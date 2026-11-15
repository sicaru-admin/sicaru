from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,cv2,json,hashlib
R=Path(__file__).resolve().parents[1];B=R.parent;P=B/'lote-post-piloto';PREV=B/'correcciones-tres-sku-r2'
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',22);rows=[]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def old_edge(src,candidate,bg,y,l,r,dx,dy,which):
 f=src[y,l:r].astype(float);back=bg[y+dy,l+dx:r+dx].astype(float);c=candidate[y+dy,l+dx:r+dx].astype(float);v=f-back
 alpha=np.clip(np.sum((c-back)*v,axis=1)/np.maximum(1,np.sum(v*v,axis=1)),0,1)
 hits=np.where(alpha>=.5)[0];i=int(hits[0] if which=='left' else hits[-1]);outside=i-1 if which=='left' else i+1
 if outside<0 or outside>=len(alpha):return float(l+i)
 a0,a1=alpha[outside],alpha[i];return l+outside+(i-outside)*np.clip((.5-a0)/max(1e-6,a1-a0),0,1)
for sku in ['28101','20132']:
 meta=json.loads((P/sku/'verificacion.json').read_text());src=np.array(Image.open(P/sku/(sku+'-original-respaldo.jpeg')).convert('RGB'));before=np.array(Image.open(PREV/(sku+'-refinada-r2.png')));shadow=np.array(Image.open(P/sku/(sku+'-sombra.png')));dx,dy=meta['translation'];side=before.shape[0]
 bg=np.rint(np.array([250,248,245])[None,None,:]*(1-shadow[:,:,None]/255.)).astype(np.uint8)
 out=before.copy();allowed=np.zeros(before.shape[:2],bool);details=[]
 regions=[('Extremo inferior izquierdo',(350,908,391,955),'left'),('Extremo inferior derecho',(561,908,610,955),'right')] if sku=='28101' else [('Contorno derecho junto a etiqueta',(585,864,615,926),'right')]
 for title,(l,t,r,b),which in regions:
  yy=np.arange(t,b,dtype=float)
  baseline=np.array([old_edge(src,before,bg,y,l,r,dx,dy,which) for y in range(t,b)])
  if sku=='28101':
   # Smooth the two small local matte irregularities; no global erosion or product retouch.
   u=(yy-yy.mean())/yy.std();fit=np.polyfit(u,baseline,3);target=np.polyval(fit,u)
  else:
   # Recover the real edge from original optical evidence, not by drawing new bottle pixels.
   blur=cv2.GaussianBlur(src.astype(np.float32),(0,0),.65);gradient=np.linalg.norm(cv2.Sobel(blur,cv2.CV_32F,1,0,ksize=3),axis=2)
   guide=np.array([(864,605),(890,605),(900,606),(907,606),(912,604),(916,601),(922,598),(925,596)],float)
   measured=[]
   for y in range(t,b):
    center=np.interp(y,guide[:,0],guide[:,1]);xs=np.arange(int(center-3),int(center+4));scores=gradient[y,xs];j=int(np.argmax(scores));x=float(xs[j])
    if 0<j<len(xs)-1:
     a0,a1,a2=scores[j-1:j+2];den=a0-2*a1+a2
     if abs(den)>1e-6:x+=float(np.clip(.5*(a0-a2)/den,-.5,.5))
    measured.append(x)
   target=cv2.GaussianBlur(np.array(measured,np.float32)[:,None],(1,15),2.0)[:,0]
   # Piecewise source-fitted curve keeps the natural lower rounding and avoids a false shoulder.
   ia=0;ib=47;u=(yy[ia:ib]-yy[ia:ib].mean())/yy[ia:ib].std();target[ia:ib]=np.polyval(np.polyfit(u,target[ia:ib],3),u)
  for j,y in enumerate(range(t,b)):
   fade=min(1,j/6,(b-t-1-j)/6);edge=baseline[j]*(1-fade)+target[j]*fade;xx=np.arange(l,r)
   alpha=np.clip(xx-edge+.5,0,1) if which=='left' else np.clip(edge-xx+.5,0,1)
   alpha=np.rint(alpha*255).astype(np.uint8)/255.
   patch=np.rint(src[y,l:r].astype(float)*alpha[:,None]+bg[y+dy,l+dx:r+dx]*(1-alpha[:,None])).astype(np.uint8)
   # The unchanged first/last rows retain the exact original composition rounding.
   if fade>0:out[y+dy,l+dx:r+dx]=patch;allowed[y+dy,l+dx:r+dx]=True
  details.append({'zone':title,'source_box':[l,t,r,b]})
 diff=np.any(out!=before,axis=2);assert not np.any(diff&~allowed)
 Image.fromarray(out).save(R/(sku+'-candidata-final-r3.png'))
 # Exact protection of the print/interior; translucent gray and lighting must not change.
 protect=(380,600,585,915) if sku=='20132' else (380,635,575,905)
 l,t,r,b=protect;assert np.array_equal(before[t+dy:b+dy,l+dx:r+dx],out[t+dy:b+dy,l+dx:r+dx])
 # Focused enlargements: original, R2 and R3; no resampling of master files.
 crops=[('Extremo izquierdo',(346,902,398,963)),('Extremo derecho',(557,902,615,963))] if sku=='28101' else [('Lateral inferior de etiqueta',(578,855,620,932))]
 tiles=[]
 for title,(l,t,r,b) in crops:
  factor=5 if sku=='28101' else 6;cw=max(300,(r-l)*factor);ch=(b-t)*factor;tile=Image.new('RGB',(cw*3,ch+90),'white');d=ImageDraw.Draw(tile);d.text((12,8),sku+' · '+title,font=font,fill='#332d29')
  for i,(label,arr,box) in enumerate([('Original',src,(l,t,r,b)),('R2 · antes',before,(l+dx,t+dy,r+dx,b+dy)),('R3 · después',out,(l+dx,t+dy,r+dx,b+dy))]):
   d.text((i*cw+10,43),label,font=font,fill='#332d29');tile.paste(Image.fromarray(arr).crop(box).resize(((r-l)*factor,ch),Image.Resampling.NEAREST),(i*cw+10,85))
  tiles.append(tile)
 plate=Image.new('RGB',(max(x.width for x in tiles),sum(x.height for x in tiles)),'white');y=0
 for tile in tiles:plate.paste(tile,(0,y));y+=tile.height
 plate.save(R/(sku+'-ampliaciones-original-r2-r3.png'))
 rows.append({'sku':sku,'status':'candidata_final_r3_pendiente_revision_y_publicacion','dimensions':[side,side],'source_regions':details,'changed_output_pixels':int(diff.sum()),'changes_outside_regions':0,'translation':[dx,dy],'product_scale':1,'background':'#FAF8F5','protected_interior_box':protect,'protected_interior_differences':0,'shadow_sha256_unchanged':sha(P/sku/(sku+'-sombra.png')),'before_sha256':sha(PREV/(sku+'-refinada-r2.png')),'after_sha256':sha(R/(sku+'-candidata-final-r3.png')),'generative_ai':False})
 print(sku,int(diff.sum()),flush=True)
# These four files are only read, never regenerated or rewritten.
selected={'17133':P/'17133/17133-catalogo-candidata.png','17141':B/'17141/correccion-puntual-r2/17141-catalogo-candidata-r2.png','17136':P/'17136/17136-catalogo-candidata.png','28101':R/'28101-candidata-final-r3.png','28102':PREV/'28102-refinada-r2.png','20132':R/'20132-candidata-final-r3.png'}
expected={'17133':'624b84b7da088c266254f3220486c6d32d67d4eae6a312eb46a9ce8098204722','17141':'166df5915a623010dfaf6574e4df1dac2b871f77cf5b022f3683c27bb0c201a7','17136':'f206d9fa4e90ed46fc297d7aa594487fe0441b02d01063d0b39ff58ac21656f0','28102':'eca55c9e5bf3cb11975f7fd1d7290164f5ca7ab1ebec201a102192769da1dad7'}
for s,v in expected.items():assert sha(selected[s])==v
sheet=Image.new('RGB',(2400,1720),'#FAF8F5');d=ImageDraw.Draw(sheet)
for i,(s,p) in enumerate(selected.items()):
 x=i%3*800;y=i//3*860;im=Image.open(p);sheet.paste(im.resize((800,800),Image.Resampling.LANCZOS),(x,y));label=s+(' · R3 por revisar' if s in ['28101','20132'] else ' · '+('R2 aceptable visualmente' if s=='28102' else 'Sin nuevas correcciones'));d.text((x+28,y+805),label,font=font,fill='#332d29')
sheet.save(R/'seis-productos-vista-conjunta-actualizada.png')
(R/'verificacion.json').write_text(json.dumps({'modified_candidates':rows,'unchanged_four_skus':expected,'selected_versions':{s:str(p.relative_to(B)) for s,p in selected.items()},'commercial_publication_authorization':'not_granted'},indent=2)+'\n')
