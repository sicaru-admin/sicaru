from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,cv2,json,hashlib
R=Path(__file__).resolve().parents[1];P=R.parent
rgb=np.array(Image.open(P/'17141-original-respaldo.jpeg'));oldmask=np.array(Image.open(P/'17141-mascara-refinada.png'));mask=oldmask.copy()
old=np.array(Image.open(P/'17141-catalogo-refinada.png'));shadow=np.array(Image.open(P/'17141-sombra.png'));h,w=rgb.shape[:2];side=old.shape[0];dx,dy=-5,-475
boxes={'union_izquierda':(1140,1795,1240,1885),'union_derecha':(1615,1795,1730,1885),'base_derecha':(1680,2810,1780,2890)}
# Conventional local matte: keep original pink cap/shoulder and dark black joint.
# Source RGB is never painted or recolored. Only neutral backdrop alpha is reduced.
for key in ['union_izquierda','union_derecha']:
 l,t,r,b=boxes[key];src=rgb[t:b,l:r].astype(float);chroma=src[:,:,0]-src[:,:,1];lum=src.mean(axis=2)
 color=np.clip((chroma-3)/9,0,1);black=np.clip((95-lum)/35,0,1)
 coverage=np.maximum(color,black)
 # Keep fully black pixels exactly: they belong to the original junction.
 coverage[lum<=60]=1
 # Smooth alpha only, then restore full coverage over definite product pixels.
 coverage=cv2.GaussianBlur(coverage.astype(np.float32),(3,3),.45)
 coverage[(chroma>=12)|(lum<=60)]=1
 yy,xx=np.indices(coverage.shape);fade=np.minimum.reduce([xx/8,(r-l-1-xx)/8,yy/8,(b-t-1-yy)/8,np.ones_like(xx)]);fade=np.clip(fade,0,1)
 limit=np.rint((1-fade*(1-coverage))*255).astype(np.uint8)
 mask[t:b,l:r]=np.minimum(mask[t:b,l:r],limit)
# Local trace along the actual right base, eliminating the prior outward kink.
l,t,r,b=boxes['base_derecha'];controls=np.array([(2810,1753.0),(2820,1743.4),(2830,1732.0),(2840,1725.4),(2850,1721.8),(2860,1717.2),(2870,1712.0),(2880,1708.3),(2889,1698.5)])
yy=np.arange(t,b);edge=np.interp(yy,controls[:,0],controls[:,1]);edge=cv2.GaussianBlur(edge.astype(np.float32)[:,None],(1,9),1.7)[:,0]
for i,y in enumerate(yy):
 xs=np.arange(l,r);limit=np.rint(np.clip(edge[i]-xs+.5,0,1)*255).astype(np.uint8)
 fade=min(1,(y-t)/10,(b-1-y)/10);limit=np.rint(255*(1-fade)+limit*fade).astype(np.uint8)
 mask[y,l:r]=np.minimum(mask[y,l:r],limit)
Image.fromarray(mask).save(R/'17141-mascara-candidata-r2.png')
# Exact original shadow/background; no recomputation or adjustment.
bg=np.rint(np.array([250,248,245])[None,None,:]*(1-shadow[:,:,None]/255.)).astype(np.uint8)
result=old.copy();allowed=np.zeros(old.shape[:2],bool)
for l,t,r,b in boxes.values():
 a=mask[t:b,l:r,None]/255.;v=np.rint(rgb[t:b,l:r].astype(float)*a+bg[t+dy:b+dy,l+dx:r+dx]*(1-a)).astype(np.uint8)
 result[t+dy:b+dy,l+dx:r+dx]=v;allowed[t+dy:b+dy,l+dx:r+dx]=True
Image.fromarray(result).save(R/'17141-catalogo-candidata-r2.png')
# Verify there are no changes anywhere outside the three authorized local regions.
diff=np.any(result!=old,axis=2);assert not np.any(diff&~allowed)
# All preserved black pixels of the junction and all retained opaque RGB remain identical.
black_count=0
for key in ['union_izquierda','union_derecha']:
 l,t,r,b=boxes[key];keep=(rgb[t:b,l:r].mean(axis=2)<=60)&(oldmask[t:b,l:r]==255)
 assert np.array_equal(result[t+dy:b+dy,l+dx:r+dx][keep],old[t+dy:b+dy,l+dx:r+dx][keep]);black_count+=int(keep.sum())
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',22)
def plate(name,regions):
 sizes=[((r-l)*3,(b-t)*3) for _,(l,t,r,b) in regions];cw=max(z[0] for z in sizes);hh=sum(z[1]+60 for z in sizes)
 out=Image.new('RGB',(cw*4,hh),'white');d=ImageDraw.Draw(out);top=0
 for (label,(l,t,r,b)),(width,height) in zip(regions,sizes):
  panels=[('Original',rgb[t:b,l:r]),('Refinada previa',old[t+dy:b+dy,l+dx:r+dx]),('Máscara R2',np.repeat(mask[t:b,l:r,None],3,axis=2)),('Candidata R2',result[t+dy:b+dy,l+dx:r+dx])]
  for i,(title,arr) in enumerate(panels):
   d.text((i*cw+5,top+6),title+' · '+label,font=font,fill='#332d29');out.paste(Image.fromarray(arr).resize((width,height),Image.Resampling.NEAREST),(i*cw,top+55))
  top+=height+60
 out.save(R/name)
plate('17141-union-tapa-cuello-comparativa-r2.png',[('izquierda',(1130,1785,1250,1895)),('derecha',(1605,1785,1740,1895))])
plate('17141-base-derecha-comparativa-r2.png',[('base derecha',(1660,2760,1810,2920))])
checks={'sku':'17141','status':'candidata_pendiente_aprobacion','dimensions':[side,side],'scale':1,'translation':[dx,dy],'background':'#FAF8F5','changed_output_pixels':int(diff.sum()),'changes_outside_authorized_regions':0,'source_region_boxes':boxes,'junction_opaque_black_pixels_preserved':black_count,'shadow_sha256_unchanged':hashlib.sha256((P/'17141-sombra.png').read_bytes()).hexdigest(),'source_sha256':hashlib.sha256((P/'17141-original-respaldo.jpeg').read_bytes()).hexdigest(),'prior_refined_sha256':hashlib.sha256((P/'17141-catalogo-refinada.png').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256((R/'17141-catalogo-candidata-r2.png').read_bytes()).hexdigest(),'generative_ai':False}
(R/'verificacion-r2.json').write_text(json.dumps(checks,indent=2)+'\n');print(checks)
