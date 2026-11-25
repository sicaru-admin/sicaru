import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(readFileSync('docs/qa/recortes-xiomara-pr34/MANIFIESTO_RECORTES.json','utf8'));
test('owner crops retain original bytes, transparent lossless WebP format and dimensions',()=>{
  assert.equal(manifest.items.length,2);
  for(const item of manifest.items){
    assert.match(item.archivo_web,/01-principal-recorte-propietaria-candidato\.webp$/);
    const b=readFileSync(item.archivo_web);
    assert.equal(b.length,item.bytes_web);
    assert.equal(createHash('sha256').update(b).digest('hex'),item.web_sha256);
    assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
    assert.equal(b.toString('ascii',12,16),'VP8L');assert.equal(b[20],0x2f);
    assert.deepEqual([1+(((b[22]&0x3f)<<8)|b[21]),1+(((b[24]&0xf)<<10)|(b[23]<<2)|((b[22]&0xc0)>>6))],item.dimensiones_web);
    assert.ok(b[24]&0x10,'alpha flag required');
    assert.notEqual(item.web_sha256,createHash('sha256').update(readFileSync(item.archivo_web.replace('-recorte-propietaria-candidato','-r3'))).digest('hex'));
  }
});
test('comparison is guarded, uses real components and bypasses the R3 card override only locally',()=>{
 const page=readFileSync('src/app/qa/reparacion-shampoos/recortes/page.tsx','utf8');
 assert.match(page,/process.env.VERCEL_ENV !== "preview"/);assert.match(page,/notFound\(\)/);
 assert.match(page,/robots: \{ index: false, follow: false \}/);
 assert.match(page,/variant.barcode === reference.barcode/);
 assert.match(page,/product\?\.id === reference.id/);
 assert.match(page,/disableVerifiedPhoto/);assert.match(page,/<ImageGallery images=/);
 assert.doesNotMatch(page,/sdk\.admin|method:\s*"(?:POST|PUT|DELETE|PATCH)"/);
});
