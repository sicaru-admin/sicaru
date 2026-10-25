import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { assertPublicPage, assertPublishedTargets } from './helpers/public-link-validation.mjs';

const root = new URL('../content/blog/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('./fixtures/published-product-links.json', import.meta.url), 'utf8'));

test('all public blog product links and embedded cards target a verified published handle', () => {
  const handles = new Set(catalog.products.map(p => p.handle));
  for (const file of readdirSync(root).filter(f => f.endsWith('.mdx'))) assertPublishedTargets(readFileSync(new URL(file, root), 'utf8'), handles, file);
});

test('link gate catches nonexistent markdown and embedded targets instead of guessing a similar SKU', () => {
  const handles = new Set(['voglia-tinte-permanente-90ml']);
  for (const source of ['[Voglia](/productos/voglia-tinte-permanente)', '<ProductEmbed handle="voglia-tinte-permanente" name="Voglia" />']) assert.throws(() => assertPublishedTargets(source, handles, 'article'), /unpublished product/);
  assert.doesNotThrow(() => assertPublishedTargets('[Catálogo](/productos) y [marca](/marcas/voglia)', handles, 'article'));
});

test('semantic page gate rejects streaming 200 not-found pages and failed product recovery', () => {
  for (const page of [{status:200,headings:['404'],body:'This page could not be found.'},{status:200,headings:['No pudimos cargar este producto.'],body:'No pudimos cargar este producto.'},{status:404,headings:['Producto'],body:'Producto'}]) assert.throws(() => assertPublicPage(page, '/productos/missing'));
  assert.doesNotThrow(() => assertPublicPage({status:200,headings:['Producto publicado'],body:'Consultar precio'}, '/productos/real'));
});
