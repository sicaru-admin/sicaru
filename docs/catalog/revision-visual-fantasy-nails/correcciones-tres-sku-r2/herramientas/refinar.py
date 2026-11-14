from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,cv2,json,hashlib
R=Path(__file__).resolve().parents[1];BASE=R.parent/'lote-post-piloto'
SKUS=['28101','28102','20132'];font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',21)
rows=[]
def edge_coverage(mask,y,l,r):
 xx=np.arange(mask.shape[1]);return np.rint(255*np.minimum(np.clip(xx-l+.5,0,1),np.clip(r-xx+.5,0,1))).astype(np.uint8)
def smooth(a,sigma):
 k=max(5,int(sigma*6)|1);return cv2.GaussianBlur(np.array(a,np.float32)[:,None],(1,k),sigma)[:,0]
def measured_edges(rgb,mask,ya,yb,which,guide=None,radius=5,sigma=1.1):
 blur=cv2.GaussianBlur(rgb.astype(np.float32),(0,0),.65);grad=np.linalg.norm(cv2.Sobel(blur,cv2.CV_32F,1,0,ksize=3),axis=2);values=[]
 for y in range(ya,yb):
  oldxs=np.where(mask[y]>0)[0];prior=float(oldxs[0] if which=='left' else oldxs[-1])
  center=prior if guide is None else np.interp(y,guide[:,0],guide[:,1]);xs=np.arange(max(1,int(center-radius)),min(mask.shape[1]-1,int(center+radius)+1));score=grad[y,xs]*np.exp(-.5*((xs-center)/max(1,radius*.85))**2)
  j=int(np.argmax(score));x=float(xs[j])
  if 0<j<len(xs)-1:
   a,b,c=score[j-1:j+2];den=a-2*b+c
   if abs(den)>1e-7:x+=float(np.clip(.5*(a-c)/den,-.5,.5))
  values.append(x)
 return smooth(values,sigma)
for sku in SKUS:
 P=BASE/sku;meta=json.loads((P/'verificacion.json').read_text());rgb=np.array(Image.open(P/(sku+'-original-respaldo.jpeg')).convert('RGB'));oldmask=np.array(Image.open(P/(sku+'-mascara.png')));mask=oldmask.copy();old=np.array(Image.open(P/(sku+'-catalogo-candidata.png')));shadow=np.array(Image.open(P/(sku+'-sombra.png')));scale=rgb.shape[1]/960;dx,dy=meta['translation']
 normboxes={
 '28101':[(385,588,425,630),(525,588,570,630),(350,630,380,950),(578,630,610,950),(350,915,395,965),(565,915,610,965)],
 '28102':[(530,533,615,650),(335,850,425,920),(515,850,610,920)],
 '20132':[(350,292,480,352),(480,292,615,352),(540,916,612,952)]}[sku]
 boxes=[tuple(int(round(x*scale)) for x in box) for box in normboxes]
 if sku=='28101':
  # Local neutral-background key at the two neck ends. Keep dark joint and bright white reflections.
  for l,t,r,b in boxes[:2]:
   src=rgb[t:b,l:r].astype(float);lum=src.mean(axis=2);coverage=np.maximum(np.clip((lum-132)/35,0,1),np.clip((85-lum)/25,0,1));coverage=cv2.GaussianBlur(coverage.astype(np.float32),(3,3),.4);coverage[(lum<=60)|(lum>=175)]=1
   yy,xx=np.indices(coverage.shape);fade=np.clip(np.minimum.reduce([xx/4,(r-l-1-xx)/4,yy/4,(b-t-1-yy)/4,np.ones_like(xx)]),0,1)
   mask[t:b,l:r]=np.minimum(mask[t:b,l:r],np.rint(255*(1-fade*(1-coverage))).astype(np.uint8))
  # Source-measured white-bottle borders; no color neutralization or interior filtering.
  for which,box in [('left',boxes[2]),('right',boxes[3])]:
   l,t,r,b=box;values=measured_edges(rgb,oldmask,t,b,which,radius=4,sigma=1.3)
   ia=660-t;ib=910-t;yy=np.arange(ia,ib,dtype=float);u=(yy-yy.mean())/yy.std();poly=np.polyfit(u,values[ia:ib],3);regular=np.polyval(poly,u);weight=np.minimum(1,np.minimum((yy-ia)/10,(ib-1-yy)/10));values[ia:ib]=values[ia:ib]*(1-weight)+regular*weight
   for j,y in enumerate(range(t,b)):
    occ=np.where(oldmask[y]>0)[0];fade=min(1,j/8,(b-t-1-j)/8);edge=(occ[0] if which=='left' else occ[-1])*(1-fade)+values[j]*fade
    cover=edge_coverage(mask,y,edge if which=='left' else occ[0]-.5,edge if which=='right' else occ[-1]+.5)
    mask[y,l:r]=cover[l:r]
 elif sku=='28102':
  l,t,r,b=boxes[0];ya=int(535*scale);yb=int(646*scale)
  guide=np.array([(535,547),(540,561),(545,569),(550,575),(555,580),(560,584),(565,588),(570,591),(580,596),(590,600),(600,603),(610,604),(625,605),(646,605)],float)*scale
  values=measured_edges(rgb,oldmask,ya,yb,'right',guide,radius=round(3.5*scale),sigma=1.5*scale)
  for j,y in enumerate(range(ya,yb)):
   occ=np.where(oldmask[y]>0)[0];fade=min(1,j/(4*scale),(yb-ya-1-j)/(6*scale));edge=occ[-1]*(1-fade)+values[j]*fade;cover=edge_coverage(mask,y,occ[0]-.5,edge);mask[y,l:r]=cover[l:r]
  # Each base side is measured independently from its own source, regularized locally.
  for which,box in [('left',boxes[1]),('right',boxes[2])]:
   l,t,r,b=box;ya=int(860*scale);yb=int(915*scale);values=measured_edges(rgb,oldmask,ya,yb,which,radius=round(4*scale),sigma=1.2*scale)
   yy=np.arange(len(values),dtype=float);u=(yy-yy.mean())/yy.std();poly=np.polyfit(u,values,4);fitted=np.polyval(poly,u)
   for j,y in enumerate(range(ya,yb)):
    occ=np.where(oldmask[y]>0)[0];fade=min(1,j/(6*scale),(yb-ya-1-j)/(6*scale));prior=occ[0] if which=='left' else occ[-1];edge=prior*(1-fade)+fitted[j]*fade
    cover=edge_coverage(mask,y,edge if which=='left' else occ[0]-.5,edge if which=='right' else occ[-1]+.5);mask[y,l:r]=cover[l:r]
 elif sku=='20132':
  # Trace each upper corner from its own original pink/neutral boundary.
  # Restore original edge pixels omitted by the old matte as well as removing the gray spur.
  chroma=cv2.GaussianBlur(rgb[:,:,0].astype(np.float32)-rgb[:,:,1].astype(np.float32),(0,0),.55)
  ya,yb=292,352;bounds=[]
  for y in range(ya,yb):
   hits=np.where(chroma[y,350:615]>=24)[0]
   if not len(hits):bounds.append([480.,480.]);continue
   l0=int(hits[0]+350);r0=int(hits[-1]+350)
   def crossing(x,outside):
    v0=chroma[y,outside];v1=chroma[y,x];return outside+(x-outside)*np.clip((24-v0)/max(.001,v1-v0),0,1)
   bounds.append([crossing(l0,l0-1),crossing(r0,r0+1)])
  bounds=cv2.GaussianBlur(np.array(bounds,np.float32),(1,7),1.0)
  for j,y in enumerate(range(ya,yb)):
   l0,r0=bounds[j];coverage=edge_coverage(mask,y,l0,r0);blend=min(1,j/3,(yb-ya-1-j)/8)
   for l,t,r,b in boxes[:2]:mask[y,l:r]=np.rint(oldmask[y,l:r]*(1-blend)+coverage[l:r]*blend).astype(np.uint8)
  l,t,r,b=boxes[2];ya,yb=919,950;guide=np.array([(919,600),(924,597),(928,592),(932,587),(936,580),(940,571),(944,560),(946,552),(949,545)],float)
  values=measured_edges(rgb,oldmask,ya,yb,'right',guide,radius=3,sigma=1.15)
  yy=np.arange(len(values),dtype=float);poly=np.polyfit(yy,values,3);fitted=np.polyval(poly,yy)
  for j,y in enumerate(range(ya,yb)):
   occ=np.where(oldmask[y]>0)[0];fade=min(1,j/3,(yb-ya-1-j)/3);edge=occ[-1]*(1-fade)+fitted[j]*fade;cover=edge_coverage(mask,y,occ[0]-.5,edge);mask[y,l:r]=cover[l:r]
 # The exact existing shadow and existing background; update strictly the authorized regions.
 bg=np.rint(np.array([250,248,245])[None,None,:]*(1-shadow[:,:,None]/255.)).astype(np.uint8);result=old.copy();allowed=np.zeros(old.shape[:2],bool)
 for l,t,r,b in boxes:
  a=mask[t:b,l:r,None]/255.;result[t+dy:b+dy,l+dx:r+dx]=np.rint(rgb[t:b,l:r]*a+bg[t+dy:b+dy,l+dx:r+dx]*(1-a)).astype(np.uint8);allowed[t+dy:b+dy,l+dx:r+dx]=True
 diff=np.any(result!=old,axis=2);assert not np.any(diff&~allowed)
 # All opaque source pixels in modified regions retain RGB exactly; no source edits.
 for l,t,r,b in boxes:
  keep=mask[t:b,l:r]==255;assert np.array_equal(result[t+dy:b+dy,l+dx:r+dx][keep],rgb[t:b,l:r][keep])
 output=R/(sku+'-refinada-r2.png');Image.fromarray(result).save(output)
 # One before/after comparison per SKU, with full frame and detail rows.
 side=old.shape[0];sheet=Image.new('RGB',(1800,0+660),'white');d=ImageDraw.Draw(sheet)
 for i,(label,arr) in enumerate([('ANTES · 1f9c777',old),('DESPUÉS · candidata R2',result)]):
  x=i*900;d.text((x+20,12),sku+' · '+label,font=font,fill='#332d29');sheet.paste(Image.fromarray(arr).resize((600,600),Image.Resampling.LANCZOS),(x+150,55))
 regions={'28101':[('Transición tapa/cuello',(385,588,570,632)),('Bordes del envase',(345,625,615,965))],'28102':[('Hombro derecho',(530,530,615,650)),('Escalones de base',(335,845,610,935))],'20132':[('Esquinas tapa',(350,285,615,355)),('Borde inferior derecho',(540,910,615,962)),('Translucidez conservada',(380,600,585,915))]}[sku]
 plates=[sheet]
 for title,coords in regions:
  l,t,r,b=[int(round(v*scale)) for v in coords];factor=2 if scale==1 else 1;cw=(r-l)*factor;ch=(b-t)*factor
  # A narrow lateral crop of the white bottle plus full lower outline, still source-coordinate aligned.
  plate=Image.new('RGB',(max(1800,cw*2),ch+55),'white');pd=ImageDraw.Draw(plate)
  for i,(label,arr) in enumerate([('ANTES',old),('DESPUÉS',result)]):
   x=i*(plate.width//2);pd.text((x+12,10),sku+' · '+title+' · '+label,font=font,fill='#332d29');plate.paste(Image.fromarray(arr).crop((l+dx,t+dy,r+dx,b+dy)).resize((cw,ch),Image.Resampling.NEAREST),(x+12,50))
  plates.append(plate)
 combo=Image.new('RGB',(max(p.width for p in plates),sum(p.height for p in plates)),'white');top=0
 for p in plates:combo.paste(p,(0,top));top+=p.height
 combo.save(R/(sku+'-comparacion-antes-despues.png'))
 row={'sku':sku,'status':'candidata_r2_pendiente_aprobacion_comercial','dimensions':meta['dimensions'],'translation':meta['translation'],'product_scale':1,'background':'#FAF8F5','source_boxes':boxes,'changed_output_pixels':int(diff.sum()),'differences_outside_authorized_regions':0,'opaque_rgb_differences':0,'source_sha256':hashlib.sha256((P/(sku+'-original-respaldo.jpeg')).read_bytes()).hexdigest(),'before_sha256':hashlib.sha256((P/(sku+'-catalogo-candidata.png')).read_bytes()).hexdigest(),'after_sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'shadow_sha256_unchanged':hashlib.sha256((P/(sku+'-sombra.png')).read_bytes()).hexdigest(),'generative_ai':False}
 if sku=='20132':
  l,t,r,b=380,600,585,915;assert np.array_equal(old[t+dy:b+dy,l+dx:r+dx],result[t+dy:b+dy,l+dx:r+dx]);row['translucent_body_assessment']={'source_box':[l,t,r,b],'differences':0,'gray_influence':'preserved_without_recoloring_or_reconstruction'}
 rows.append(row);print(sku,'changed pixels',row['changed_output_pixels'],flush=True)
(R/'verificacion.json').write_text(json.dumps({'only_skus':SKUS,'results':rows},indent=2)+'\n')
