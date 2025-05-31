# 🛒 PUNTONET - Proyecto Node.js (CLI)

Este proyecto fue realizado como **entrega final para el curso de Node.js** en Talento Tech. Consiste en una herramienta de línea de comandos (CLI) que permite simular una tienda online: listar productos, ver uno por ID, crear nuevos productos y eliminarlos.

## 📁 ¿Por qué hay otros archivos como `index.html`?

El sitio web original de PUNTONET fue un proyecto anterior realizado para el curso de **Front-End JS**, también de Talento Tech. Por ese motivo, se conservaron archivos como `index.html`, `productos.html`, estilos, imágenes, etc.

Aunque **no son parte funcional de esta entrega**, se mantuvieron en una carpeta separada (`legacy/`) como parte del diseño visual original, ya que sirvió como inspiración para los productos que se usan en esta CLI.

## 🧪 Ejemplos de uso

```bash
# Listar productos locales
USE_LOCAL_DATA=true npm run start GET products

# Ver producto por ID
USE_LOCAL_DATA=true npm run start GET products 1

# Crear producto
USE_LOCAL_DATA=true npm run start POST products "Plan 5" 42000 Internet

# Eliminar producto
USE_LOCAL_DATA=true npm run start DELETE products 1
