import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import vm from "node:vm";
import path from "node:path";
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");
const read = file => readFileSync(new URL(`../${file}`, import.meta.url),"utf8");
const loaded = new Map();
function load(name) {
  if (name === "next/link") return {__esModule:true,default:({children,...props})=>React.createElement("a",props,children)};
  if (name === "next/navigation") return {redirect:target=>{throw new Error(`redirect:${target}`);}};
  if (!name.startsWith("@/")) return require(name);
  if (loaded.has(name)) return loaded.get(name);
  let source;
  for (const ext of [".tsx",".ts"]) {try{source=read(`src/${name.slice(2)}${ext}`);break;}catch{}}
  if (!source) throw new Error(`Missing module ${name}`);
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
  const compiledModule={exports:{}};
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(specifier=>load(specifier.startsWith(".")?path.posix.join(path.posix.dirname(name),specifier):specifier),compiledModule,compiledModule.exports);
  loaded.set(name,compiledModule.exports);return compiledModule.exports;
}
const render=Component=>renderToStaticMarkup(React.createElement(Component));

test("production photos, catalog, commercial guards, protected files and home visuals are unchanged",()=>{
  const hashes=JSON.parse(read("tests/publication-protected-hashes.json"));
  for(const [file,hash] of Object.entries(hashes))assert.equal(createHash("sha256").update(readFileSync(new URL(`../${file}`,import.meta.url))).digest("hex"),hash,file);
});
test("Conócenos contains the exact approved history, no provisional image and official contact",()=>{
 const html=render(load("@/app/(shop)/nosotros/page").default);
 for(const text of ["Más de 10 años en Cadereyta.","Somos una tienda mexicana de productos de belleza para uso personal y profesional.","Sabemos que no todos buscamos lo mismo. Por eso nos gusta compartir información clara sobre los productos y sus características, para que conozcas tus opciones y elijas sin presiones.","Visítanos en el centro de Cadereyta Jiménez."])assert(html.includes(text));
 assert(!/<img|La Plaza|Local 204|El corazón|aproximadamente|autorizad/i.test(html));assert(html.includes("wa.me/528281136652"));
 assert.equal((html.match(/<section/g)||[]).length,3);
});
test("identity block is inserted once between featured products and the existing contact",()=>{
 const source=read("src/app/(shop)/page.tsx");
 assert(source.indexOf('<FeaturedProducts />')<source.indexOf('id="belleza-identidad"'));
 assert(source.indexOf('id="belleza-identidad"')<source.indexOf('<WhatsAppBanner />'));
 assert.equal((source.match(/La belleza tiene muchas formas\./g)||[]).length,1);
 assert(source.includes('Cada cabello es diferente. Su cuidado también.'));assert(source.includes('href="/nosotros"'));
});
test("professional invitation preserves general contact and points to the existing safe page",()=>{
 const html=render(load("@/components/home/WhatsAppBanner").WhatsAppBanner);
 for(const text of ["SICARÚ PROFESIONALES","Para quienes hacen de la belleza su profesión.","Valoramos tu experiencia y apoyamos tu trabajo con productos profesionales y precios especiales."])assert(html.includes(text));
 assert(html.includes('href="/salon-pro"'));assert(html.includes('href="https://wa.me/528281136652"'));
 assert(!/<img|<form/.test(html));
});
test("professional destination does not promise general discounts, routes or account activation",()=>{
 const html=render(load("@/app/(shop)/salon-pro/page").default);
 assert(html.includes('wa.me/528281136652'));assert(!/15-25|15%|25%|48 horas|martes|viernes|autom[aá]tic|<form|testimonio/i.test(html));
 assert.throws(()=>load("@/app/(shop)/salon-pro/registro/page").default(),/redirect:\/salon-pro/);
});
