#!/usr/bin/env node
import {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct
} from './lib/api.js';

const [, , method, resource, ...args] = process.argv;

async function main() {
  try {
    // GET products
    if (method === 'GET' && resource === 'products' && args.length === 0) {
      console.log(await listProducts());

    // GET products <id>
    } else if (method === 'GET' && resource === 'products' && args.length === 1) {
      const [id] = args;
      console.log(await getProduct(id));

    // POST products <title> <price> <category>
    } else if (method === 'POST' && resource === 'products' && args.length === 3) {
      const [title, price, category] = args;
      console.log(await createProduct({
        title,
        price: Number(price),
        category
      }));

    // DELETE products <id>
    } else if (method === 'DELETE' && resource === 'products' && args.length === 1) {
      const [id] = args;
      console.log(await deleteProduct(id));

    } else {
      console.error(`
Uso:
  GET    products               → lista todos
  GET    products <id>          → muestra uno
  POST   products <t> <p> <c>   → crea (t=title, p=price, c=category)
  DELETE products <id>          → elimina
      `.trim());
      process.exit(1);
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();
