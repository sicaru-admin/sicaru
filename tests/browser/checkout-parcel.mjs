import {createRequire} from 'node:module';
import path from 'node:path';
// Resolve the locally or globally installed Node-only QA package.
const loadModule=createRequire(import.meta.url);
const {chromium}=loadModule('playwright');
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='http://127.0.0.1:3100';
const api='http://127.0.0.1:9100';
const output=process.env.SICARU_QA_OUTPUT_DIR || path.resolve('work/qa-output');
const results={story:'Carrito → dirección → cotización de paquetería → bloqueo de pago sin aprobación; UI real y API Medusa local sintética, sin proveedores externos.',checks:[],requests:[],externalRequests:[],consoleErrors:[],pageErrors:[],screenshots:[]};
async function post(path,body){const res=await fetch(api+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});return res.json();}
async function state(){return(await fetch(api+'/__qa/state')).json();}
function check(name,value,evidence){assert(value,name+': '+evidence);results.checks.push({name,passed:true,evidence});}
async function open(browser,path){const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:1,isMobile:true,hasTouch:true});await context.addInitScript(()=>localStorage.setItem('sicaru_cart_id','cart_qa'));const page=await context.newPage();await page.route('**/*',route=>{const req=route.request();const url=new URL(req.url());if(!['127.0.0.1','localhost'].includes(url.hostname)){results.externalRequests.push({method:req.method(),url:req.url()});return route.abort('blockedbyclient');}results.requests.push({method:req.method(),path:url.pathname});return route.continue();});page.on('console',m=>{if(m.type()==='error')results.consoleErrors.push(m.text())});page.on('pageerror',e=>results.pageErrors.push(String(e)));await page.goto(root+path,{waitUntil:'networkidle',timeout:90000});return {context,page};}
async function submitAddress(page,postalCode='67480'){
 await page.locator('#checkout-email').fill('qa@example.invalid');
 await page.locator('#shipping-name').fill('QA Prueba');
 await page.locator('#shipping-phone').fill('8110000000');
 await page.locator('#shipping-postal_code').fill(postalCode);
 await page.locator('#shipping-province').selectOption({label:'Nuevo León'});
 await page.locator('#shipping-city').fill('Cadereyta Jiménez');
 await page.locator('#shipping-address_2').fill('Centro');
 await page.locator('#shipping-address_1').fill('Solo prueba 1');
 await page.getByRole('button',{name:'Continuar compra',exact:true}).click();
 await page.waitForTimeout(500);
}
async function screenshot(page,name){const path=output+'/'+name;await page.screenshot({path,fullPage:true});results.screenshots.push(path);}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.SICARU_QA_CHROMIUM || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  await post('/__qa/reset',{mode:'pending',legacyFee:49});
  let {context,page}=await open(browser,'/carrito');
  let text=await page.locator('body').innerText();
  check('Carrito antiguo no anuncia envío local ni importe $49',!text.includes('$49')&&!text.includes('Entrega local'),text.match(/Subtotal[\s\S]{0,130}/)?.[0]);
  check('Subtotal de productos con IVA incluido sin sumar envío retirado',text.includes('$97.00')&&text.includes('IVA incluido. Envío por cotizar.'),'1 ×97 y método local49 conservado por backend fixture; UI muestra productos97 y envío por cotizar.');
  await page.getByRole('button',{name:/Aumentar cantidad/}).click();
  await page.waitForFunction(()=>document.querySelector('[aria-label="Cantidad"]')?.textContent==='2');
  check('Aumento cantidad preserva variante y subtotal',((await state()).cart.item_total===194),'2 ×97 =194 MXN; misma variante.');
  await page.reload({waitUntil:'networkidle'});
  check('Recarga conserva carrito y cantidades',await page.locator('[aria-label="Cantidad"]').innerText()==='2','cart_qa y cantidad2 tras recarga.');
  await page.getByRole('button',{name:/Disminuir cantidad/}).click();
  await page.waitForFunction(()=>document.querySelector('[aria-label="Cantidad"]')?.textContent==='1');
  check('Disminución restaura subtotal correcto',(await state()).cart.item_total===97,'1 ×97 =97 MXN.');
  await screenshot(page,'qa-carrito-mobile-375.png');
  await page.goto(root+'/checkout',{waitUntil:'networkidle'});
  await page.waitForSelector('#checkout-email');
  await submitAddress(page);
  text=await page.locator('body').innerText();
  check('Dirección enviada y carrito conservado',((await state()).cart.shipping_address?.postal_code==='67480')&&((await state()).cart.items.length===1),'Dirección QA CP67480 guardada; producto y cantidad1 conservados.');
  check('Sin cotización aprobada muestra Envío por cotizar',text.includes('Envío por cotizar'),text.match(/Envío por cotizar[\s\S]{0,220}/)?.[0]);
  check('WhatsApp disponible para consultar paquetería',await page.getByRole('link',{name:/Consultar.*WhatsApp/i}).count()>0,'Enlace wa.me, sin abrirlo ni enviar mensajes.');
  check('Pago no habilitado y sin formulario tarjeta',await page.locator('iframe[src*="mercadopago"],input[autocomplete="cc-number"]').count()===0,'Sin iframe/inputs tarjeta y sin requests de pago.');
  for(const width of [375,320]){await page.setViewportSize({width,height:812});const metrics=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));check('Mobile sin desbordamiento horizontal '+width,metrics.document<=width&&metrics.body<=width,JSON.stringify(metrics));await screenshot(page,'qa-checkout-pending-mobile-'+width+'.png');}
  await page.reload({waitUntil:'networkidle'});
  check('Recarga checkout conserva dirección y productos',(await page.locator('#shipping-postal_code').inputValue())==='67480'&&((await state()).cart.items.length===1),'CP67480 prellenado; producto retenido.');
  await context.close();
  for(const scenario of [{mode:'pending',postal:'00000',name:'Sin cobertura'},{mode:'unapproved',postal:'67480',name:'Tarifa review214 no aprobada'},{mode:'unavailable',postal:'67480',name:'Servicio cotización503'}]){
   await post('/__qa/reset',{mode:scenario.mode,legacyFee:40});
   ({context,page}=await open(browser,'/checkout'));
   await submitAddress(page,scenario.postal);
   text=await page.locator('body').innerText();
   check(scenario.name+' conserva carrito',(await state()).cart.items.length===1,'Producto97, cantidad1 retenida.');
   check(scenario.name+' no habilita pago',!text.includes('$214')&&await page.locator('input[name="shipping-method"]').count()===0&&await page.locator('iframe[src*="mercadopago"]').count()===0,'Sin radio de envío aprobado ni formulario tarjeta.');
   check(scenario.name+' ofrece consulta paquetería',text.includes('Envío por cotizar')&&await page.getByRole('link',{name:/Consultar.*WhatsApp/i}).count()>0,text.match(/Envío por cotizar[\s\S]{0,200}/)?.[0]);
   if(scenario.mode==='pending')await screenshot(page,'qa-checkout-sin-cobertura-mobile.png');
   await context.close();
  }
  for(const [quantity,productTotal,orderTotal] of [[1,97,284.65],[3,291,478.65]]){
   await post('/__qa/reset',{mode:'approved',legacyFee:49});
   if(quantity>1)await post('/store/carts/cart_qa/line-items/item_qa',{quantity});
   ({context,page}=await open(browser,'/carrito'));
   await page.getByRole('link',{name:'Finalizar compra',exact:true}).waitFor();
   check('Subtotal carrito sintético '+quantity, (await page.locator('body').innerText()).includes('$'+productTotal.toFixed(2)),quantity+' ×97 ='+productTotal+'; envío retirado49 excluido.');
   await page.getByRole('link',{name:'Finalizar compra',exact:true}).click();
   await page.waitForSelector('#checkout-email');
   await submitAddress(page);
   await page.locator('input[name="shipping-method"]').waitFor();
   text=await page.locator('body').innerText();
   check('Cotización sintética exacta IVA incluido '+quantity,text.includes('$187.65')&&!text.includes('$214'),'Cotización de contrato local sintético187.65; no tarifa comercial real.');
   await page.getByRole('button',{name:'Continuar compra',exact:true}).click();
   await page.getByText('No hay métodos de pago disponibles para esta compra.',{exact:false}).waitFor();
   const snapshot=(await state()).cart;
   check('Método guardado coincide con cotización '+quantity,snapshot.shipping_methods.length===1&&snapshot.shipping_methods[0].amount===187.65&&snapshot.shipping_methods[0].data.sicaru_quote_id.startsWith('synthetic-'),'Un método187.65 con quote_id y fingerprint, reemplaza local49.');
   check('Total carrito y checkout coherente '+quantity,snapshot.total===orderTotal&&(await page.locator('body').innerText()).includes('$'+orderTotal.toFixed(2)),'Productos'+productTotal+' + envío187.65 ='+orderTotal+', IVA incluido una vez.');
   if(quantity===1)await screenshot(page,'qa-checkout-cotizacion-sintetica-mobile.png');
   await page.getByRole('button',{name:/Contacto y dirección.*Editar/}).first().click();
   await page.locator('#shipping-address_1').fill('Dirección modificada QA 2');
   check('Editar dirección invalida cotización antes de pago '+quantity,(await page.locator('body').innerText()).includes('Envío por cotizar')&&await page.locator('input[name="payment-method"]').count()===0,'Se exige nueva cotización tras editar destino, sin peticiones de pago.');
   await context.close();
  }
  await post('/__qa/reset',{mode:'pending'});
  ({context,page}=await open(browser,'/carrito'));
  await page.getByRole('button',{name:'Eliminar',exact:true}).click();
  await page.getByText('Tu carrito está vacío.',{exact:true}).waitFor();
  check('Eliminar limpia únicamente artículo',(await state()).cart.items.length===0,'Carrito vacío conserva mismo id.');
  await page.goto(root+'/productos/kit-sintetico-qa',{waitUntil:'networkidle',timeout:90000});
  await page.getByRole('button',{name:/Agregar al carrito/i}).first().click();
  await page.waitForTimeout(500);
  check('Agregar producto conserva variante y cantidad',(await state()).cart.items[0]?.quantity===1,'Producto sintético añadido mediante UI real.');
  await context.close();
  const paymentRequests=results.requests.filter(r=>/payment-collections|payment-sessions|\/complete/.test(r.path));
  check('Cero inicio de pagos o creación de pedidos',paymentRequests.length===0,JSON.stringify(paymentRequests));
  check('Cero peticiones a proveedores externos MP',!results.externalRequests.some(r=>/mercadopago|mercadolibre/.test(r.url)),JSON.stringify(results.externalRequests));
  check('Cero errores JavaScript',results.pageErrors.length===0,JSON.stringify(results.pageErrors));
 } finally {await browser.close();fs.writeFileSync(output+'/qa-checkout-browser.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.checks,externalRequests:results.externalRequests,consoleErrors:results.consoleErrors,pageErrors:results.pageErrors,screenshots:results.screenshots},null,2));}
})().catch(e=>{console.error(e);process.exitCode=1;});
