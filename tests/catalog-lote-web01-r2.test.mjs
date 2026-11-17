import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),sharp=require('sharp');
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const manifest=read('docs/catalog/lote-web-01-r2/assets.json');
const previous=read('docs/catalog/lote-web-01/assets.json');
const fixture=read('docs/catalog/lote-web-01-r2/fixture.json');

test('R2 contains only five new paths and preserves every current published asset byte',()=>{
  assert.equal(manifest.assets.length,5);assert.equal(new Set(manifest.assets.map(a=>a.path)).size,5);
  for(let i=0;i<5;i++){const a=manifest.assets[i],old=previous.assets[i];assert.equal(a.source.drive_id,old.source.drive_id);assert.equal(a.source.sha256,old.source.sha256);assert.equal(a.path,old.path.replace('.webp','-r2.webp'));const bytes=readFileSync(new URL('../'+old.path,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),old.sha256);}
});

test('all R2 files are lossless 1600-square WebP with real transparent margins and no private EXIF',async()=>{
  for(const a of manifest.assets){const file=new URL('../'+a.path,import.meta.url);const bytes=readFileSync(file);assert.equal(bytes.length,a.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);const meta=await sharp(bytes).metadata();assert.equal(meta.format,'webp');assert.equal(meta.width,1600);assert.equal(meta.height,1600);assert.equal(meta.hasAlpha,true);assert.equal(meta.exif,undefined);const alpha=await sharp(bytes).extractChannel(3).raw().toBuffer();assert.equal(alpha[0],0);assert.equal(alpha[1599],0);assert.equal(alpha[1600*1599],0);assert.equal(alpha[1600*1600-1],0);let transparent=0,max=-1,min=1600;for(let i=0;i<alpha.length;i++){if(alpha[i]===0)transparent++;else{const y=Math.floor(i/1600);max=Math.max(max,y);min=Math.min(min,y);}}assert.ok(transparent>1600*1600*.7);assert.ok(max<=1441&&max>=1438);assert.ok(min>=126&&min<=130);}
});

test('all masks preserve source RGB, proportionate reduction and no generative reconstruction',()=>{
  for(const a of manifest.assets){assert.equal(a.generative_ai,false);assert.equal(a.product_reconstructed,false);assert.equal(a.label_reconstructed,false);assert.equal(a.rgb_changes_before_resize,0);assert.equal(a.exposure_ev,0);assert.equal(a.color_adjustments,false);assert.equal(a.shadow_baked,false);assert.equal(a.background_baked,false);assert.ok(a.bounds_native.height>a.placement.rendered_height);const ratio=a.bounds_native.width/a.bounds_native.height;assert.ok(Math.abs(a.placement.rendered_width/a.placement.rendered_height-ratio)<.001);assert.equal(a.placement.rendered_height/1600,.82);assert.equal(a.placement.base/1600,.9);}
});

test('the isolated comparison retains the exact published variants, price approvals and Morazul without codes',()=>{
  assert.equal(fixture.products.length,3);assert.deepEqual(fixture.products.map(p=>p.variants[0].calculated_price.calculated_amount),[95,115,95]);
  assert.deepEqual(fixture.products.map(p=>p.id),['prod_01M79C6MFY2YPX504ZMDW9HJ0A','prod_01M79C7BHA8D7GCZG4DTBM1Q68','prod_01M79C817D78WYM8K6D9W32NH1']);
  for(const p of fixture.products){assert.equal(p.variants.length,1);const v=p.variants[0];assert.equal(v.metadata.storefront_price_approved,true);assert.ok(!Object.hasOwn(v.metadata,'storefront_inventory_verified'));assert.equal(v.inventory_quantity,0);assert.equal(v.manage_inventory,true);assert.equal(v.allow_backorder,false);assert.equal(v.sku,null);assert.ok(p.images.every(i=>!i.url.includes('-r2.webp')));}
  const morazul=fixture.products[2].variants[0];assert.equal(morazul.barcode,null);assert.equal(morazul.ean,null);assert.equal(morazul.upc,null);
});
