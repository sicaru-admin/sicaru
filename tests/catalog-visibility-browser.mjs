// No Medusa records or production services: synthetic Store API fixture in memory.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createHmac} from 'node:crypto';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const base='http://127.0.0.1:55448', backendOrigin='http://127.0.0.1:55449';
const secret='synthetic-local-catalog-invalidation-1234567890';
const marker='UNIQUE_RETIRE_PRODUCT',safe='UNIQUE_SURVIVING_PRODUCT',draft='NEVER_PUBLIC_DRAFT';
let published=true,offline=false,writes=0,externalWrites=0;
const variant={id:'variant_test',title:'Test',options:[],manage_inventory:true,metadata:{},calculated_price:null};
const collection={id:'col_test',title:'Marca aislada',handle:'marca-test'};
const category={id:'cat_test',name:'Categoría aislada',handle:'categoria-test',is_active:true,is_internal:false};
const product=(id,title,handle,status)=>({id,title,handle,status,description:'Synthetic isolated fixture',thumbnail:null,images:[],options:[],variants:[{...variant,id:'variant_'+id}],collection,categories:[category],metadata:{}});
const products=()=>[product('retire',marker,'retirar',published?'published':'draft'),product('surviving',safe,'conservar','published'),product('draft',draft,'nunca-publico','draft')];
const backend=createServer((req,res)=>{
 const url=new URL(req.url,backendOrigin);res.setHeader('content-type','application/json');res.setHeader('Access-Control-Allow-Origin',base);res.setHeader('Access-Control-Allow-Headers','content-type,x-publishable-api-key,x-medusa-locale');
 if(req.method==='OPTIONS'){res.end();return;}if(req.method!=='GET'){writes++;res.writeHead(405).end('{}');return;}
 if(offline){res.writeHead(503).end('{"message":"Synthetic offline"}');return;}
 let data={};if(url.pathname==='/store/regions')data={regions:[{id:'reg_mx',name:'México',currency_code:'mxn'}]};
 else if(url.pathname==='/store/products'){
  let rows=products().filter(p=>p.status==='published');if(url.searchParams.has('handle'))rows=rows.filter(p=>p.handle===url.searchParams.get('handle'));
  data={products:rows,count:rows.length,offset:0,limit:100};
 }else if(url.pathname==='/store/product-categories')data={product_categories:[category],count:1,offset:0,limit:50};
 else if(url.pathname==='/store/collections')data={collections:[collection],count:1,offset:0,limit:50};
 else {res.writeHead(404).end('{}');return;}
 res.end(JSON.stringify(data));
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function stop(child){if(!child||child.exitCode!==null)return;child.kill('SIGTERM');await Promise.race([new Promise(r=>child.once('exit',r)),wait(5000)]);if(child.exitCode===null)child.kill('SIGKILL');}
let server,browser;const results=[];let log='';
const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'production',NEXT_PUBLIC_MEDUSA_BACKEND_URL:backendOrigin,NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:'pk_synthetic_fixture',NEXT_PUBLIC_CATALOG_MODE:'true',CATALOG_REVALIDATION_SECRET:secret,NEXT_TELEMETRY_DISABLED:'1'};
const next=path.resolve('node_modules/next/dist/bin/next');
async function runBuild(){const child=spawn(process.execPath,[next,'build','--webpack'],{env});child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);const code=await new Promise(r=>child.once('exit',r));assert.equal(code,0,log);}
async function read(route,rsc=false){const r=await fetch(base+route,{headers:rsc?{RSC:'1'}:{},signal:AbortSignal.timeout(20000)});const body=await r.text();if(rsc)assert.match(r.headers.get('content-type')||'',/text\/x-component/);return {r,body};}
async function check(route,label,{absent=[],present=[],missing=false}={}){const {r,body}=await read(route);if(missing)assert(r.status===404||/name="robots"[^>]+content="noindex/.test(body),label+' lacks semantic not-found');for(const s of absent)assert(!body.includes(s),label+' leaks '+s);for(const s of present)assert(body.includes(s),label+' misses '+s);results.push({test:label,status:r.status,cache_control:r.headers.get('cache-control'),pass:true});}
function signed(body=JSON.stringify({scope:'catalog'}),timestamp=String(Date.now())){return {body,headers:{'content-type':'application/json','x-sicaru-timestamp':timestamp,'x-sicaru-signature':createHmac('sha256',secret).update(timestamp+'.'+body).digest('hex')}};}
try{
 await new Promise(r=>backend.listen(55449,'127.0.0.1',r));
 await runBuild();
 server=spawn(process.execPath,[next,'start','--hostname','127.0.0.1','--port','55448'],{env});server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
 for(let i=0;i<100;i++){if(await fetch(base,{signal:AbortSignal.timeout(1000)}).then(r=>r.ok).catch(()=>false))break;await wait(250);if(i===99)throw Error('Next did not start');}
 const routes=['/','/productos','/categorias/categoria-test','/marcas/marca-test'];
 for(const route of routes){await check(route,'published HTML '+route,{present:[marker,safe],absent:[draft]});const {body}=await read(route,true);assert(body.includes(marker));assert(!body.includes(draft));results.push({test:'published RSC '+route,pass:true});}
 await check('/productos/retirar','published detail',{present:[marker],absent:[draft]});assert((await read('/productos/retirar',true)).body.includes(marker));results.push({test:'published detail RSC',pass:true});await check('/sitemap.xml','published sitemap',{present:['/productos/retirar','/productos/conservar'],absent:['/productos/nunca-publico']});
 const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
 const context=await browser.newContext();const page=await context.newPage();page.on('request',r=>{if(r.method()!=='GET'&&!r.url().startsWith(base))externalWrites++});
 await page.goto(base+'/productos/retirar');await page.getByRole('heading',{name:marker,exact:true}).waitFor();
 // Simulate upstream published -> draft without touching any database.
 published=false;
 // Fresh HTML/RSC must already be safe BEFORE webhook delivery, including loss of delivery.
 for(const route of routes){await check(route,'draft HTML before webhook '+route,{present:[safe],absent:[marker,draft]});const {body}=await read(route,true);assert(!body.includes(marker));assert(!body.includes(draft));assert(body.includes(safe));results.push({test:'draft RSC before webhook '+route,pass:true});}
 await check('/productos/retirar','retired direct URL',{absent:[marker,draft],missing:true});await check('/productos/nunca-publico','new draft direct URL',{absent:[marker,draft],missing:true});await check('/sitemap.xml','draft sitemap',{present:['/productos/conservar'],absent:['/productos/retirar','/productos/nunca-publico']});
 for(const route of ['/productos/retirar','/productos/nunca-publico']){const {r,body}=await read(route,true);assert(!body.includes(marker)&&!body.includes(draft));assert(r.status===404||/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/.test(body));results.push({test:'draft direct RSC '+route,pass:true});}
 const unsigned=await fetch(base+'/api/revalidate',{method:'POST',headers:{'content-type':'application/json'},body:'{"scope":"catalog"}'});assert.equal(unsigned.status,401);
 for(const [label,input,status]of [['expired',signed(undefined,String(Date.now()-120000)),401],['wrong scope',signed('{"scope":"catalog","path":"/arbitrary"}'),400],['oversize',signed('x'.repeat(257)),413]]){const r=await fetch(base+'/api/revalidate',{method:'POST',...input});assert.equal(r.status,status);results.push({test:'reject '+label,pass:true});}
 const input=signed();for(let i=0;i<2;i++){const r=await fetch(base+'/api/revalidate',{method:'POST',...input});assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');}
 results.push({test:'signed invalidation and safe retry',pass:true});
 await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.getByRole('heading',{name:marker,exact:true}).waitFor({state:'hidden'});results.push({test:'open tab refreshes after online event',pass:true});
 await page.goto(base+'/productos/conservar');await page.goBack();await page.getByRole('heading',{name:marker,exact:true}).waitFor({state:'hidden'});results.push({test:'history return does not restore retired product',pass:true});
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/productos');assert(!(await page.content()).includes(marker));assert((await page.content()).includes(safe));results.push({test:'mobile published survivor, no drafts',pass:true});
 offline=true;for(const route of ['/productos','/productos/conservar'])await check(route,'offline fails closed '+route,{absent:[marker,safe,draft]});
 assert.equal(writes,0);assert.equal(externalWrites,0);results.push({test:'zero backend/payment/checkout mutations',pass:true});
 console.log(JSON.stringify({pass:true,checks:results.length,results},null,2));
}finally{
 if(browser)await browser.close();await stop(server);await new Promise(r=>backend.close(r));await mkdir('artifacts/catalog-visibility',{recursive:true});await writeFile('artifacts/catalog-visibility/runtime.log',log);await writeFile('artifacts/catalog-visibility/results.json',JSON.stringify({checks:results,backend_writes:writes,external_writes:externalWrites},null,2));
}
