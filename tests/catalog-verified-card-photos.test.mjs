import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/catalog-verified-card-photos.ts", import.meta.url),"utf8");
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {getVerifiedCatalogCardPhoto,getVerifiedCatalogGalleryPhoto} = await import("data:text/javascript;base64,"+Buffer.from(compiled).toString("base64"));

const base="https://www.sicarubeauty.com";
const items=[
  {id:"prod_01M79C6MFY2YPX504ZMDW9HJ0A",handle:"xiomara-shampoo-platinum-250ml",variants:[{title:"250 ml",barcode:"7501846500905"}],root:"xiomara-shampoo-platinum-250ml",back:false},
  {id:"prod_01M79C7BHA8D7GCZG4DTBM1Q68",handle:"xiomara-shampoo-platinum-libre-sulfatos-250ml",variants:[{title:"250 ml",barcode:"7501846505863"}],root:"xiomara-shampoo-platinum-libre-sulfatos-250ml",back:true},
  {id:"prod_01M79C817D78WYM8K6D9W32NH1",handle:"nekane-morazul-shampoo-matizador-300g",variants:[{title:"300 g",barcode:null}],root:"nekane-morazul-shampoo-matizador-300g",back:true},
];

test("three verified products show their distinct R3 photos on cards",()=>{
  for(const p of items) {
    const current=`${base}/images/products/${p.root}/01-principal.webp`;
    const proposed=`/images/products/${p.root}/01-principal-r3.webp`;
    assert.equal(getVerifiedCatalogCardPhoto(p,current),proposed);
    assert.equal(getVerifiedCatalogGalleryPhoto(p,current),proposed);
  }
});

test("XIOMARA and NEKANE backs retain correct product-specific R3 paths",()=>{
  for(const p of items.filter(x=>x.back)){
    const current=`${base}/images/products/${p.root}/02-reverso.webp`;
    assert.equal(getVerifiedCatalogGalleryPhoto(p,current),`/images/products/${p.root}/02-reverso-r3.webp`);
  }
});

test("wrong ID, handle, barcode, variant title, or variant count blocks replacement",()=>{
  for(const p of items){
    const original=`${base}/images/products/${p.root}/01-principal.webp`;
    const changes=[
      {...p,id:"prod_WRONG"},
      {...p,handle:"not-matching-handle"},
      {...p,variants:[{...p.variants[0],title:"999 ml"}]},
      {...p,variants:[...p.variants,...p.variants]},
    ];
    if(p.variants[0].barcode) changes.push({...p,variants:[{...p.variants[0],barcode:"0000000000000"}]});
    for(const changed of changes) {
      assert.equal(getVerifiedCatalogCardPhoto(changed,original),original);
      assert.equal(getVerifiedCatalogGalleryPhoto(changed,original),original);
    }
  }
});

test("MONTIS 500 ml remains blocked from 650 ml image",()=>{
  const montis={id:"prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z",handle:"montis-shampoo-extracto-natural",variants:[{title:"500ml",barcode:null}]};
  assert.equal(getVerifiedCatalogCardPhoto(montis,null),null);
  assert.equal(getVerifiedCatalogGalleryPhoto(montis,base+"/images/products/montis/image.webp"),base+"/images/products/montis/image.webp");
});

test("unknown photo origins, filenames, and querystrings do not get rewritten",()=>{
  const p=items[1],src=`${base}/images/products/${p.root}/01-principal.webp`;
  for(const url of [
    src+"?cache=1",src.replace(base,"https://other.example"),src.replace("01-principal.webp","extra.webp")
  ]) assert.equal(getVerifiedCatalogGalleryPhoto(p,url),url);
});
