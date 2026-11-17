import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), sharp = require('sharp');
const bytes = path => readFileSync(new URL('../' + path, import.meta.url));
const json = path => JSON.parse(bytes(path));
const hash = value => createHash('sha256').update(value).digest('hex');
const r3 = json('docs/catalog/lote-web-01-r3/assets.json');
const r2 = json('docs/catalog/lote-web-01-r2/assets.json');

test('R3 preserves the approved masks, R2 bytes and exact source identities', () => {
  const maskHash = hash(bytes('docs/catalog/lote-web-01-r2/masks.json'));
  assert.equal(maskHash, '4abc994aac871a81d5ed27f0ec1f257ebb56aef84f219439ce0edeb08e11a0e0');
  assert.equal(r3.assets.length, 5);
  assert.equal(new Set(r3.assets.map(a => a.path)).size, 5);
  for (const a of r3.assets) {
    const old = r2.assets.find(b => a.handle === b.handle && a.role === b.role);
    assert.ok(old);
    assert.deepEqual(a.source, old.source);
    assert.deepEqual(a.bounds_native, old.bounds_native);
    assert.equal(hash(bytes(old.path)), old.sha256);
    assert.equal(a.mask_sha256, maskHash);
    assert.equal(a.path, old.path.replace('-r2.webp', '-r3.webp'));
    assert.equal(a.rgb_changes_before_resize, 0);
    for (const field of ['generative_ai', 'product_reconstructed', 'label_reconstructed', 'color_adjustments', 'shadow_baked', 'background_baked']) assert.equal(a[field], false);
    assert.equal(a.exposure_ev, 0);
  }
});

test('R3 masters retain transparency, all edges, full pump clearance and larger proportional product', async () => {
  for (const a of r3.assets) {
    const data = bytes(a.path), meta = await sharp(data).metadata();
    assert.equal(data.length, a.bytes); assert.equal(hash(data), a.sha256);
    assert.equal(meta.format, 'webp'); assert.equal(meta.width, 1600); assert.equal(meta.height, 1600);
    assert.equal(meta.hasAlpha, true); assert.equal(meta.exif, undefined);
    assert.ok(data.includes(Buffer.from('VP8L')), 'The master must be lossless WebP.');
    const alpha = await sharp(data).extractChannel(3).raw().toBuffer();
    let top = 1600, bottom = -1;
    for (let y = 0; y < 1600; y++) {
      assert.equal(alpha[y * 1600], 0); assert.equal(alpha[y * 1600 + 1599], 0);
      for (let x = 0; x < 1600; x++) if (alpha[y * 1600 + x] > 0) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
    }
    assert.ok(top >= 62 && top <= 66); assert.ok(bottom <= 1537);
    assert.ok(Math.abs(top - a.placement.top) <= 2);
    assert.ok(Math.abs(bottom + 1 - a.placement.base) <= 2);
    assert.ok(a.placement.rendered_height >= 1464 && a.placement.rendered_height <= 1472);
    assert.ok(a.bounds_native.height > a.placement.rendered_height, 'No source enlargement.');
    assert.ok(Math.abs(a.placement.rendered_width / a.placement.rendered_height - a.bounds_native.width / a.bounds_native.height) < .001);
  }
});

test('R3 visible card occupancy respects real ProductPhoto padding at supported review widths', () => {
  // Actual square dimensions measured on the existing two-column mobile card.
  for (const a of r3.assets) for (const [box, padding] of [[112, 12], [147, 12], [255.33, 20]]) {
    const occupancy = a.placement.rendered_height / 1600 * (box - 2 * padding) / box;
    assert.ok(occupancy >= .715 && occupancy <= .78);
    assert.ok(occupancy > .82 * (box - 2 * padding) / box);
  }
});

test('the same isolated page compares ACTUAL/R2/R3 without replacing real storefront components', () => {
  const page = bytes('src/app/qa/lote-web-01-r2/page.tsx').toString();
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /index: false, follow: false/);
  assert.match(page, /label: "ACTUAL"/); assert.match(page, /label: "R2 · TRANSPARENTE"/); assert.match(page, /label: "R3 · MAYOR ESCALA"/);
  assert.match(page, /<RetailProductCard/); assert.match(page, /<ImageGallery/);
  assert.match(page, /grid-cols-2[^"\n]*lg:grid-cols-3/);
  assert.doesNotMatch(page, /q95|optimizados-propuesta/);
});
