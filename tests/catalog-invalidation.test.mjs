import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import {SourceTextModule,SyntheticModule,createContext} from 'node:vm';
import * as crypto from 'node:crypto';
import {NextRequest,NextResponse} from 'next/server.js';
const context=createContext({process,Buffer,Uint8Array,Date,JSON});
const invalidated=[];
const routeModule=new SourceTextModule(stripTypeScriptTypes(await readFile(new URL('../src/app/api/revalidate/route.ts',import.meta.url),'utf8')),{context});
await routeModule.link(async name=>{
 const values=name==='node:crypto'?crypto:name==='next/cache'?{revalidatePath:(...args)=>invalidated.push(args)}:{NextRequest,NextResponse};
 return new SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v)},{context});
});await routeModule.evaluate();
const key='synthetic-invalidation-key-never-production-12345';
function request(body='{"scope":"catalog"}',signature){const timestamp=String(Date.now());return new NextRequest('http://127.0.0.1/api/revalidate',{method:'POST',headers:{'x-sicaru-timestamp':timestamp,'x-sicaru-signature':signature||crypto.createHmac('sha256',key).update(timestamp+'.'+body).digest('hex')},body});}
test('catalog invalidation fails closed and never accepts arbitrary paths',async()=>{
 const old=process.env.CATALOG_REVALIDATION_SECRET;try{
  delete process.env.CATALOG_REVALIDATION_SECRET;assert.equal((await routeModule.namespace.POST(request())).status,503);
  process.env.CATALOG_REVALIDATION_SECRET=key;
  assert.equal((await routeModule.namespace.POST(request(undefined,'0'.repeat(64)))).status,401);assert.equal(invalidated.length,0);
  assert.equal((await routeModule.namespace.POST(request('{"scope":"catalog","path":"/admin"}'))).status,400);assert.equal(invalidated.length,0);
  assert.equal((await routeModule.namespace.POST(request('x'.repeat(257)))).status,413);assert.equal(invalidated.length,0);
  const result=await routeModule.namespace.POST(request());assert.equal(result.status,200);assert.equal(result.headers.get('cache-control'),'no-store');
  assert.equal(JSON.stringify(invalidated),JSON.stringify([['/','layout'],['/sitemap.xml']]));
 }finally{if(old===undefined)delete process.env.CATALOG_REVALIDATION_SECRET;else process.env.CATALOG_REVALIDATION_SECRET=old;}
});
