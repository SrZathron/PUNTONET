import fetch from 'node-fetch';
import { promises as fs } from 'fs';
const BASE = 'https://fakestoreapi.com';
const LOCAL_FILE = './data/products.json';
const useLocal = process.env.USE_LOCAL_DATA === 'true';

export async function listProducts() {
  if (useLocal) {
    const file = await fs.readFile(LOCAL_FILE, 'utf8');
    return JSON.parse(file);
  }
  const res = await fetch(`${BASE}/products`);
  return res.json();
}

export async function getProduct(id) {
  if (useLocal) {
    const all = await listProducts();
    return all.find(p => p.id === +id) || null;
  }
  const res = await fetch(`${BASE}/products/${id}`);
  return res.json();
}

export async function createProduct({ title, price, category }) {
  if (useLocal) {
    const all = await listProducts();
    const nextId = all.length ? Math.max(...all.map(p => p.id)) + 1 : 1;
    const product = { id: nextId, title, price, category };
    all.push(product);
    await fs.writeFile(LOCAL_FILE, JSON.stringify(all, null, 2));
    return product;
  }
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, price, category })
  });
  return res.json();
}

export async function deleteProduct(id) {
  if (useLocal) {
    let all = await listProducts();
    const before = all.length;
    all = all.filter(p => p.id !== +id);
    await fs.writeFile(LOCAL_FILE, JSON.stringify(all, null, 2));
    return { deleted: before - all.length };
  }
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  return res.json();
}
