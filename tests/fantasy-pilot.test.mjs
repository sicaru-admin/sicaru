import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(readFileSync('public/images/fantasy-nails/manifest.json', 'utf8'));
const data = readFileSync('src/lib/fantasy-pilot.ts', 'utf8');
test('six unique SKU map to the intact original photos', () => {
  assert.deepEqual(manifest.map(p => p.sku).sort(), ['17133','17136','17141','20132','28101','28102']);
  for (const p of manifest) {
    assert.equal(createHash('sha256').update(readFileSync(`public${p.path}`)).digest('hex'), p.sha256);
    assert.ok(data.includes(`imageUrl: "${p.path}"`));
  }
});
test('review pages preserve uncertainty and search exclusion without checkout', () => {
  for (const route of ['piloto-unas-profesionales/page.tsx','piloto-fantasy-nails/[slug]/page.tsx']) {
    const page = readFileSync(`src/app/(shop)/${route}`, 'utf8');
    assert.match(page, /index: false, follow: false/);
    assert.match(page, /Disponibilidad por confirmar/);
    assert.match(page, /fantasyInquiryHref/);
    assert.doesNotMatch(page, /AddToCart|checkout|application\/ld\+json|InStock/);
    assert.match(page, /object-contain/);
    assert.match(page, /unoptimized/);
  }
  assert.match(data, /STORE.whatsapp/);
  assert.match(readFileSync('src/lib/constants/store.ts','utf8'), /whatsapp: "528281136652"/);
});
