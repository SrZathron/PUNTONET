#!/usr/bin/env bash
set -e

echo "🔧 Iniciando refactor para entregar CLI de Node.js…"

# 1) Crear carpetas necesarias
mkdir -p legacy data lib

# 2) Mover front-end y servidor Express a legacy/
#    Ajusta estas rutas si tus archivos principales se llaman distinto.
for f in index.html app.js server.js public views; do
  if [ -e "$f" ]; then
    echo "  • Moviendo $f → legacy/"
    mv "$f" legacy/
  fi
done

# 3) Extraer catálogo existente
#    Si ya tenías un productos.json o similar, lo clonamos.
if [ -f legacy/data/productos.json ]; then
  echo "  • Reutilizando catálogo desde legacy/data/productos.json"
  cp legacy/data/productos.json data/products.json
elif grep -q "const products" legacy/lib/api.js 2>/dev/null; then
  echo "  • Extrayendo catálogo embebido en legacy/lib/api.js"
  # Este es un ejemplo: busca un array JS y lo vuelca. Ajusta el patrón si tu código difiere.
  sed -n '/const products = \[/,/];/p' legacy/lib/api.js \
    | sed '1s/const products = //; $s/;//' \
    > data/products.json
else
  echo "  • Creando esqueleto vacío data/products.json"
  cat << 'EOF' > data/products.json
[]
EOF
fi

# 4) Instalar node-fetch si aún no está
if ! grep -q '"node-fetch"' package.json 2>/dev/null; then
  echo "  • Añadiendo dependencia node-fetch@3"
  npm install node-fetch@3 --save
fi

# 5) Parchar lib/api.js
cat << 'EOF' > lib/api.js
import fs from 'fs/promises';
import fetch from 'node-fetch';

const BASE = 'https://fakestoreapi.com';
const USE_LOCAL = process.env.USE_LOCAL_DATA === 'true';
const LOCAL_FILE = './data/products.json';

async function readLocal() {
  const txt = await fs.readFile(LOCAL_FILE, 'utf8');
  return JSON.parse(txt);
}
async function writeLocal(arr) {
  await fs.writeFile(LOCAL_FILE, JSON.stringify(arr, null,2));
}

export async function listProducts() {
  if (USE_LOCAL) return readLocal();
  const res = await fetch(\`\${BASE}/products\`);
  return res.json();
}

export async function getProduct(id) {
  if (USE_LOCAL) {
    const all = await readLocal();
    return all.find(p => p.id==id);
  }
  const res = await fetch(\`\${BASE}/products/\${id}\`);
  return res.json();
}

export async function createProduct({ title, price, category }) {
  if (USE_LOCAL) {
    const all = await readLocal();
    const id = all.length? Math.max(...all.map(p=>p.id))+1 : 1;
    const nuevo = { id, title, price, category };
    all.push(nuevo);
    await writeLocal(all);
    return nuevo;
  }
  const res = await fetch(\`\${BASE}/products\`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ title, price, category })
  });
  return res.json();
}

export async function deleteProduct(id) {
  if (USE_LOCAL) {
    let all = await readLocal();
    const before = all.length;
    all = all.filter(p => p.id!=id);
    await writeLocal(all);
    return { deleted: before-all.length };
  }
  const res = await fetch(\`\${BASE}/products/\${id}\`, {
    method:'DELETE'
  });
  return res.json();
}
EOF

# 6) Crear el CLI entrypoint si no existe
if [ ! -f cli.js ]; then
  cat << 'EOF' > cli.js
#!/usr/bin/env node
import {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct
} from './lib/api.js';

const [,, method, resource, param, ...rest] = process.argv;

async function main() {
  try {
    if (method==='GET' && resource==='products' && !param) {
      console.log(await listProducts());
    } else if (method==='GET' && resource==='products' && param) {
      console.log(await getProduct(param));
    } else if (method==='POST' && resource==='products') {
      const [title, price, category] = rest;
      console.log(await createProduct({ title, price:+price, category }));
    } else if (method==='DELETE' && resource==='products' && param) {
      console.log(await deleteProduct(param));
    } else {
      console.error('Uso:\n  GET products [id]\n  POST products <title> <price> <category>\n  DELETE products <id>');
      process.exit(1);
    }
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
main();
EOF
  chmod +x cli.js
  echo "  • Creado CLI de comandos en cli.js"
fi

# 7) Asegurar package.json
if [ ! -f package.json ]; then
  npm init -y
fi
# Añadir type:module y script start
node -e "
const p = require('./package.json');
p.type='module';
p.scripts = p.scripts||{};
p.scripts.start='node cli.js';
require('fs').writeFileSync('package.json', JSON.stringify(p,null,2));
"
echo "  • package.json configurado (ESModules + \"start\": \"node cli.js\")"

echo "✅ Refactor completado."
echo "   • Front-end y Express originales en legacy/"
echo "   • Productos locales en data/products.json"
echo "   • CLI listo en cli.js (usa USE_LOCAL_DATA=true)"
echo
echo "Ejemplo de uso:"
echo "  USE_LOCAL_DATA=true npm run start GET products"
echo "  USE_LOCAL_DATA=true npm run start POST products \"Camiseta\" 250 remeras"

exit 0
