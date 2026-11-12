import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const folder = 'docs/catalog/lote-web-01/';
const readJson = name => JSON.parse(readFileSync(path.join(root, folder, name), 'utf8'));
const proposal = readJson('medusa-drafts.proposal.json');
const manifest = readJson('assets.json');
const expected = [
  ['PRD-9CC3A06A6F10', 'xiomara-shampoo-platinum-250ml', '250 ml', 95, '7501846500905', 1],
  ['PRD-3CE612A96316', 'xiomara-shampoo-platinum-libre-sulfatos-250ml', '250 ml', 115, '7501846505863', 2],
  ['PRD-ABEB7E8039E3', 'nekane-morazul-shampoo-matizador-300g', '300 g', 95, undefined, 2],
];

test('lote 01 is a non-executable proposal for exactly the three authorized references', () => {
  assert.equal(proposal.execution_allowed, false);
  assert.equal(proposal.products.length, 3);
  assert.deepEqual(proposal.products.map(p => p.master_id), expected.map(p => p[0]));
  assert.equal(new Set(proposal.products.map(p => p.prepared_medusa_body.handle)).size, 3);
  assert.ok(!readdirSync(path.join(root, folder)).some(name => /\.(?:m?js|cjs|ts|sh)$/.test(name)));
});

test('each draft keeps one exact presentation, public price approval, no SKU and no sales channel', () => {
  expected.forEach(([id, handle, size, amount, barcode, count], index) => {
    const p = proposal.products[index];
    const b = p.prepared_medusa_body;
    assert.equal(p.master_id, id);
    assert.equal(b.handle, handle);
    assert.equal(b.status, 'draft');
    assert.deepEqual(b.sales_channels, []);
    assert.deepEqual(b.categories, [{ id: 'pcat_01KVV3GD50MECKKS27Q8Y21HPK' }]);
    assert.deepEqual(b.options, [{ title: 'Tamaño', values: [size] }]);
    assert.equal(b.variants.length, 1);
    const v = b.variants[0];
    assert.equal(v.title, size);
    assert.deepEqual(v.options, { 'Tamaño': size });
    assert.deepEqual(v.prices, [{ currency_code: 'mxn', amount }]);
    assert.equal(v.metadata.storefront_price_approved, true);
    assert.equal(v.barcode, barcode);
    assert.ok(!Object.hasOwn(v, 'sku'));
    assert.equal(b.images.length, count);
  });
});

test('inventory remains managed with no backorder, levels, quantities, physical weight or verification', () => {
  const forbidden = new Set(['stocked_quantity', 'inventory_quantity', 'reserved_quantity', 'inventory_levels', 'inventory_items', 'location_id', 'storefront_inventory_verified', 'weight']);
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!forbidden.has(key), `Unapproved inventory field: ${key}`);
      visit(child);
    }
  }
  for (const p of proposal.products) {
    assert.equal(p.prepared_medusa_body.variants[0].manage_inventory, true);
    assert.equal(p.prepared_medusa_body.variants[0].allow_backorder, false);
    visit(p.prepared_medusa_body);
  }
});

test('Morazul retains both documentary candidates without putting any barcode, EAN or UPC in its payload', () => {
  const p = proposal.products[2];
  assert.equal(p.source.ean_state, 'PENDIENTE DE CONCILIACIÓN');
  assert.equal(p.source.ean_discrepancy.physical_photo_candidate, '0659525853273');
  assert.equal(p.source.ean_discrepancy.google_candidate, '0659525853365');
  const json = JSON.stringify(p.prepared_medusa_body);
  assert.doesNotMatch(json, /"(?:ean|barcode|upc)"/);
  assert.ok(!json.includes('0659525853273') && !json.includes('0659525853365'));
});

test('all five WebP assets match their declared dimensions, file size and SHA-256', () => {
  assert.equal(manifest.assets.length, 5);
  for (const asset of manifest.assets) {
    assert.ok(asset.path.startsWith(`public/images/products/${asset.handle}/`));
    const bytes = readFileSync(path.join(root, asset.path));
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.equal(bytes.readUInt32LE(4) + 8, bytes.length);
    let dimensions;
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const tag = bytes.toString('ascii', offset, offset + 4);
      const size = bytes.readUInt32LE(offset + 4), start = offset + 8;
      if (tag === 'VP8X') dimensions = [1 + bytes.readUIntLE(start + 4, 3), 1 + bytes.readUIntLE(start + 7, 3)];
      if (tag === 'VP8L') {
        assert.equal(bytes[start], 0x2f);
        const bits = bytes.readUInt32LE(start + 1);
        dimensions ??= [1 + (bits & 0x3fff), 1 + ((bits >>> 14) & 0x3fff)];
      }
      if (tag === 'VP8 ') dimensions ??= [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
      offset = start + size + (size & 1);
    }
    assert.deepEqual(dimensions, [asset.width, asset.height]);
  }
});

test('image provenance and allowed transformations are complete, and promotional images stay excluded', () => {
  const ids = ['13II_d26N029t2joXmw5Q2Vp0T2BrGI6a', '12uH0eSwBFgh71KHmfyMvaV7hsSFIw2oH', '17BZdXHs-9i7-rlEIxZk0j1qcEIZgPdIk', '1HP2X3p3THKJ7581EcUBf_6iHHsy3-LKA', '1ln4qqA_MiqzJ1RRPcdG3z5xglfbClpWM'];
  assert.deepEqual(manifest.assets.map(a => a.source.drive_id), ids);
  for (const a of manifest.assets) {
    assert.match(a.source.sha256, /^[a-f0-9]{64}$/);
    assert.equal(a.source.width, 3024);
    assert.equal(a.source.height, 4032);
    assert.equal(a.transform.generative_ai, false);
    assert.equal(a.transform.retouch, false);
    assert.equal(a.transform.without_enlargement, true);
    assert.equal(a.transform.background, 'original photographic background retained');
    assert.equal(a.verification.original_sha256_unchanged, true);
    assert.ok(a.verification.psnr_db === 'LOSSLESS' || a.verification.psnr_db >= 40);
    assert.ok(a.verification.mean_absolute_channel_error < 2);
    assert.ok(a.transform.crop.left + a.transform.crop.width <= a.source.width);
    assert.ok(a.transform.crop.top + a.transform.crop.height <= a.source.height);
  }
  assert.doesNotMatch(JSON.stringify(manifest), /(?:74|75)\.png/);
});

test('each proposed HTTPS gallery uses only its own verified assets with the front as thumbnail', () => {
  for (const p of proposal.products) {
    const b = p.prepared_medusa_body;
    const own = manifest.assets.filter(a => a.master_id === p.master_id);
    assert.deepEqual(b.images.map(i => i.url), own.map(a => 'https://www.sicarubeauty.com/' + a.path.slice('public/'.length)));
    assert.equal(b.thumbnail, b.images[0].url);
    assert.ok(b.images[0].url.endsWith('/01-principal.webp'));
    assert.ok(b.description.includes('WhatsApp'));
  }
});

test('prepared bodies conform to the installed Medusa Admin creation shape without adding executable application code', () => {
  const require = createRequire(import.meta.url);
  const ts = require('typescript');
  const virtual = path.join(root, 'lote-web01-payload-typecheck.ts');
  const source = `import type { HttpTypes } from '@medusajs/types';\nconst bodies = ${JSON.stringify(proposal.products.map(p => p.prepared_medusa_body))} satisfies Array<Omit<HttpTypes.AdminCreateProduct, 'status'> & { status: 'draft' }>;\nvoid bodies;`;
  const options = { noEmit: true, skipLibCheck: true, strict: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext };
  const host = ts.createCompilerHost(options);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (filename, languageVersion, ...args) => path.resolve(filename) === virtual ? ts.createSourceFile(filename, source, languageVersion, true) : originalGetSourceFile(filename, languageVersion, ...args);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([virtual], options, host));
  assert.equal(diagnostics.length, 0, diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
});
