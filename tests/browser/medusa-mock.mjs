import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const port = 9100;
const output = process.env.SICARU_QA_OUTPUT_DIR || path.resolve('work/qa-output');
fs.mkdirSync(output,{recursive:true});
const logPath = path.join(output,'medusa-requests.jsonl');
let mode = 'pending';
let cart;
let quoteCreatedAt=Date.now();
const region = {id:'reg_qa',name:'México QA sintético',currency_code:'mxn',countries:[{iso_2:'mx',display_name:'México'}],automatic_taxes:true};
const variant = {id:'variant_qa',title:'1 Negro QA',sku:'SYNTHETIC-VOGLIA-QA',manage_inventory:true,allow_backorder:false,inventory_quantity:12,calculated_price:{calculated_amount:97,original_amount:97,currency_code:'mxn',is_calculated_price_tax_inclusive:true,is_original_price_tax_inclusive:true},options:[]};
const product = {id:'prod_qa',title:'Kit de prueba QA · Tinte + peróxido',handle:'kit-sintetico-qa',description:'Producto sintético para verificar el checkout local. No disponible para venta.',thumbnail:null,images:[],metadata:{components:'Datos sintéticos · sin entrega ni pago real'},options:[],variants:[variant],categories:[],collection:null,status:'published'};
function reset(legacyFee=0){
 quoteCreatedAt=Date.now();
 cart={id:'cart_qa',currency_code:'mxn',region_id:region.id,region,sales_channel_id:'sc_qa',completed_at:null,email:'qa@example.invalid',items:[{id:'item_qa',product_id:product.id,variant_id:variant.id,title:product.title,product_title:product.title,variant_title:variant.title,unit_price:97,quantity:1,is_tax_inclusive:true,thumbnail:null,variant:{...variant,product}}],shipping_address:null,billing_address:null,shipping_methods:legacyFee?[{id:'sm_local_retired',name:'Entrega local antigua',shipping_option_id:'local_retired',amount:legacyFee,is_tax_inclusive:true}]:[],payment_collection:null,promotions:[],discount_total:0,shipping_discount_total:0,shipping_total:legacyFee,shipping_subtotal:legacyFee?Math.round(legacyFee/1.16*100)/100:0,shipping_tax_total:legacyFee?Math.round((legacyFee-legacyFee/1.16)*100)/100:0};
 totals();
}
function totals(){
 for(const item of cart.items){item.total=item.unit_price*item.quantity;item.subtotal=Math.round(item.total/1.16*100)/100;item.tax_total=Math.round((item.total-item.subtotal)*100)/100;}
 cart.item_total=cart.items.reduce((a,i)=>a+i.total,0);cart.item_subtotal=cart.items.reduce((a,i)=>a+i.subtotal,0);cart.item_tax_total=Math.round((cart.item_total-cart.item_subtotal)*100)/100;cart.total=cart.item_total+cart.shipping_total;cart.subtotal=cart.item_subtotal+cart.shipping_subtotal;cart.tax_total=Math.round((cart.item_tax_total+cart.shipping_tax_total)*100)/100;
}
reset();
function quote(){
 if(mode==='unavailable')return null;
 if(mode==='approved'){
  const fingerprint=createHash('sha256').update(JSON.stringify({items:cart.items.map(i=>[i.variant_id,i.quantity]),address:cart.shipping_address})).digest('hex');
  return {quote:{status:'available',mode:'commercial',approval_status:'approved',coverage_verified:true,is_tax_inclusive:true,quote_id:'synthetic-'+fingerprint,fingerprint,quoted_at:new Date(quoteCreatedAt).toISOString(),expires_at:new Date(quoteCreatedAt+600000).toISOString(),shipping_option_id:'parcel_synthetic_qa',amount:187.65,currency_code:'mxn'},shipping_options:[{id:'parcel_synthetic_qa',name:'Paquetería sintética QA',amount:187.65,price_type:'flat',is_tax_inclusive:true}]};
 }

 if(mode==='unapproved')return {quote:{status:'available',shipping_option_id:'dhl_provisional',amount:214,currency_code:'mxn',mode:'review'},shipping_options:[{id:'dhl_provisional',name:'DHL provisional no aprobado',amount:214,price_type:'flat',is_tax_inclusive:true}]};
 const reason=cart.shipping_address?.postal_code==='00000'?'no_coverage':'commercial_approval_required';
 return {quote:{status:'quote_required',reason,message:'Envío por cotizar'},shipping_options:[]};
}
const server=http.createServer(async(req,res)=>{
 let raw='';for await(const chunk of req)raw+=chunk;let body={};try{body=raw?JSON.parse(raw):{};}catch{}
 const url=new URL(req.url,'http://localhost:'+port); const p=url.pathname;
 fs.appendFileSync(logPath,JSON.stringify({at:new Date().toISOString(),method:req.method,path:p,body})+'\n');
 res.setHeader('Access-Control-Allow-Origin',req.headers.origin||'*');res.setHeader('Access-Control-Allow-Credentials','true');res.setHeader('Access-Control-Allow-Headers','content-type,x-publishable-api-key,authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
 function send(value,status=200){res.statusCode=status;res.end(JSON.stringify(value));}
 if(req.method==='OPTIONS')return send({});
 if(p==='/__qa/reset'){mode=body.mode||'pending';reset(body.legacyFee||0);return send({cart,mode});}
 if(p==='/__qa/state')return send({cart,mode});
 if(p==='/store/regions')return send({regions:[region],count:1,offset:0,limit:100});
 if(p==='/store/products')return send({products:[product],count:1,offset:0,limit:20});
 if(p==='/store/product-categories')return send({product_categories:[],count:0,offset:0,limit:100});
 if(p==='/store/collections')return send({collections:[],count:0,offset:0,limit:100});
 if(p==='/store/customers/me')return send({message:'No autenticado (QA)'},401);
 if(p==='/store/review-readiness')return send({methods:[],methodsVerified:false});
 if(p==='/store/payment-providers')return send({payment_providers:[]});
 if(p==='/store/carts'&&req.method==='POST')return send({cart});
 if(p==='/store/carts/cart_qa/dhl-quote') {const q=quote();if(!q)return send({message:'Cotización no disponible QA'},503);return send(q);}
 if(p==='/store/carts/cart_qa/line-items'&&req.method==='POST') {const item=cart.items.find(i=>i.variant_id===body.variant_id);if(item)item.quantity+=body.quantity||1;else cart.items.push({id:'item_qa',product_id:product.id,variant_id:variant.id,title:product.title,product_title:product.title,variant_title:variant.title,unit_price:97,quantity:body.quantity||1,is_tax_inclusive:true,variant:{...variant,product},thumbnail:null});totals();return send({cart});}
 if(p==='/store/carts/cart_qa/line-items/item_qa'){if(req.method==='POST'){if(body.quantity>12)return send({message:'Stock sintético insuficiente'},400);cart.items[0].quantity=body.quantity;totals();return send({cart});}if(req.method==='DELETE'){cart.items=[];totals();return send({id:'item_qa',object:'line-item',deleted:true,parent:cart});}}
 if(p==='/store/carts/cart_qa'){if(req.method==='POST'){Object.assign(cart,body);totals();}return send({cart});}
 if(p==='/store/carts/cart_qa/shipping-methods'&&req.method==='POST'&&mode==='approved'){
  const q=quote().quote;
  if(body.option_id!==q.shipping_option_id||body.data?.sicaru_quote_id!==q.quote_id||body.data?.sicaru_quote_fingerprint!==q.fingerprint)return send({message:'Cotización sintética inválida'},400);
  cart.shipping_methods=[{id:'sm_qa',name:'Paquetería sintética QA',shipping_option_id:q.shipping_option_id,amount:q.amount,is_tax_inclusive:true,data:body.data}];
  cart.shipping_total=q.amount;cart.shipping_subtotal=q.amount/1.16;cart.shipping_tax_total=q.amount-cart.shipping_subtotal;totals();return send({cart});
 }
 if(/payment|complete|shipping-methods/.test(p)&&req.method==='POST')return send({message:'QA: operación bloqueada; no se generan pagos ni pedidos'},409);
 return send({message:'QA mock no implementa '+req.method+' '+p},404);
});
server.listen(port,'127.0.0.1',()=>console.log('SICARÚ QA Medusa mock en http://127.0.0.1:'+port+' (solo datos sintéticos)'));
