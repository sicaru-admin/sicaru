import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),sharp=require('sharp');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),originals=args[args.indexOf('--originals')+1],evidence=args[args.indexOf('--evidence')+1];
assert.ok(args.includes('--originals')&&originals&&args.includes('--evidence')&&evidence,'Pass --originals and --evidence; originals are read-only.');
const masks=JSON.parse(await readFile(root+'/docs/catalog/lote-web-01-r2/masks.json','utf8'));
const approved=JSON.parse(await readFile(root+'/docs/catalog/lote-web-01/assets.json','utf8'));
await mkdir(resolve(evidence),{recursive:true});const results=[];
for(const item of approved.assets){
 const file=resolve(originals,item.source.drive_id+'.jpg'),bytes=await readFile(file);assert.equal(createHash('sha256').update(bytes).digest('hex'),item.source.sha256,'ORIGINAL_HASH_MISMATCH');
 const mask=masks.assets.find(m=>m.drive_id===item.source.drive_id);assert.ok(mask);
 const {data:source,info}=await sharp(bytes).rotate().toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,3024);assert.equal(info.height,4032);
 const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 1368 1824"><path fill="white" d="${mask.path}"/></svg>`);
 const alpha=await sharp(svg).extractChannel(3).raw().toBuffer();
 let minX=info.width,minY=info.height,maxX=0,maxY=0,weight=0,weightedX=0,opaque=0,changedRGB=0;
 const rgba=Buffer.from(source);
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=y*info.width+x,a=alpha[i];rgba[i*4+3]=a;if(a>0){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);weight+=a;weightedX+=x*a;}if(a===255){opaque++;for(let c=0;c<3;c++)if(source[i*4+c]!==rgba[i*4+c])changedRGB++;}}
 assert.equal(changedRGB,0);const box={left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1};assert.ok(box.height>1312);
 const crop=await sharp(rgba,{raw:{width:info.width,height:info.height,channels:4}}).extract(box).resize({height:1312,kernel:'lanczos3',withoutEnlargement:true}).png().toBuffer();const meta=await sharp(crop).metadata();
 const scale=meta.height/box.height,left=Math.round(800-(weightedX/weight-box.left)*scale),top=1440-meta.height;
 const output=resolve(root,item.path.replace('.webp','-r2.webp'));await mkdir(dirname(output),{recursive:true});
 await sharp({create:{width:1600,height:1600,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:crop,left,top}]).webp({lossless:true,effort:6}).toFile(output);
 const final=await readFile(output),fm=await sharp(final).metadata();assert.equal(fm.width,1600);assert.equal(fm.height,1600);assert.equal(fm.hasAlpha,true);
 const {data:raw}=await sharp(final).ensureAlpha().raw().toBuffer({resolveWithObject:true});let transparent=0,fullyOpaque=0;for(let i=3;i<raw.length;i+=4){if(raw[i]===0)transparent++;if(raw[i]===255)fullyOpaque++;}
 assert.ok(transparent>1600*1600*.7);assert.ok(fullyOpaque>100000);
 const prefix=item.handle+'-'+item.role;await writeFile(resolve(evidence,prefix+'-mask.svg'),svg);
 await sharp(final).flatten({background:'#FAF8F5'}).png().toFile(resolve(evidence,prefix+'-crema.png'));
 await sharp(final).flatten({background:'#ff00ff'}).png().toFile(resolve(evidence,prefix+'-magenta.png'));
 results.push({handle:item.handle,role:item.role,path:item.path.replace('.webp','-r2.webp'),source:item.source,source_sha256_unchanged:true,width:1600,height:1600,format:'webp',has_alpha:true,bytes:final.length,sha256:createHash('sha256').update(final).digest('hex'),technique:'manual Bezier alpha mask at native resolution; proportional Lanczos3 reduction; lossless WebP',generative_ai:false,product_reconstructed:false,label_reconstructed:false,rgb_changes_before_resize:changedRGB,opaque_source_pixels_checked:opaque,exposure_ev:0,color_adjustments:false,shadow_baked:false,background_baked:false,bounds_native:box,placement:{left,top,rendered_width:meta.width,rendered_height:meta.height,base:1440,canvas:1600},alpha:{transparent_pixels:transparent,opaque_pixels:fullyOpaque},human_review:mask.review});
 console.log(JSON.stringify({asset:prefix,width:1600,height:1600,alpha:true,bytes:final.length,rgb_changes_before_resize:changedRGB}));
}
await writeFile(root+'/docs/catalog/lote-web-01-r2/assets.json',JSON.stringify({schema_version:1,state:'PENDING_VISUAL_APPROVAL',tool:{sharp:sharp.versions.sharp,vips:sharp.versions.vips,webp:sharp.versions.webp},generative_ai:false,assets:results},null,2)+'\n');
