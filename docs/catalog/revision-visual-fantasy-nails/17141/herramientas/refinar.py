from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageFont
import numpy as np,cv2,json,hashlib,shutil
R=Path(__file__).resolve().parents[1];P=R.parent
orig=R/'17141-original-respaldo.jpeg';old=R/'17141-propuesta-anterior.png'
rgb=np.array(Image.open(orig).convert('RGB'));h,w=rgb.shape[:2]
# Hand-located outline, followed by local optical-edge alignment; no product synthesis.
points=np.array([(371,284),(375,277),(389,269),(410,264),(440,261),(466,261),(491,264),(513,271),(528,280),(531,286),(529,310),(526,350),(523,400),(522,450),(524,500),(527,550),(530,579),(532,583),(526,583),(533,587),(546,595),(558,607),(565,620),(569,638),(570,663),(570,700),(571,760),(571,820),(572,864),(568,884),(558,896),(554,902),(550,909),(540,918),(521,926),(494,932),(465,935),(435,934),(405,930),(383,924),(365,915),(352,903),(348,893),(339,884),(334,872),(332,850),(331,800),(330,740),(329,680),(329,654),(332,636),(338,619),(348,605),(360,594),(374,586),(378,583),(373,583),(375,550),(378,500),(379,450),(378,400),(376,350),(373,312)],np.float64)*w/960
curve=[]
for i in range(len(points)):
 a,b,c,d=[points[k%len(points)] for k in [i-1,i,i+1,i+2]]
 count=max(4,int(np.linalg.norm(c-b)/1.5))
 for t in np.linspace(0,1,count,endpoint=False):
  curve.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
curve=np.array(curve,np.float32)
tangent=np.roll(curve,-1,axis=0)-np.roll(curve,1,axis=0);normal=np.stack([tangent[:,1],-tangent[:,0]],axis=1);normal/=np.maximum(np.linalg.norm(normal,axis=1)[:,None],.001)
lab=cv2.cvtColor(rgb,cv2.COLOR_RGB2LAB).astype(np.float32);lab=cv2.GaussianBlur(lab,(0,0),1.0)
grad=np.sqrt(np.sum(cv2.Sobel(lab,cv2.CV_32F,1,0,ksize=3)**2+cv2.Sobel(lab,cv2.CV_32F,0,1,ksize=3)**2,axis=2))
offsets=np.arange(-14,15,.5,dtype=np.float32)
samples=curve[:,None,:]+normal[:,None,:]*offsets[None,:,None]
g=cv2.remap(grad,samples[:,:,0],samples[:,:,1],cv2.INTER_LINEAR)
# Favor nearest true edge rather than tiny noise peaks in backdrop.
score=g*np.exp(-.5*(offsets/12)**2)[None,:]
best=np.clip(offsets[np.argmax(score,axis=1)],-5,5)
# Periodic robust smoothing removes one-pixel stair steps in the mask only.
median=np.median(np.stack([np.roll(best,k) for k in range(-5,6)]),axis=0)
smooth=np.zeros_like(median);weights=np.exp(-.5*(np.arange(-90,91)/30)**2);weights/=weights.sum()
for k,weight in zip(range(-90,91),weights):smooth+=np.roll(median,k)*weight
curve+=normal*smooth[:,None]
np.save(R/'contorno-subpixel.npy',curve)
x0,y0=np.floor(curve.min(axis=0)-3).astype(int);x1,y1=np.ceil(curve.max(axis=0)+3).astype(int)
ss=4;high=np.zeros(((y1-y0)*ss,(x1-x0)*ss),np.uint8)
cv2.fillPoly(high,[np.rint((curve-[x0,y0])*ss).astype(np.int32)],255)
a=cv2.resize(high,(x1-x0,y1-y0),interpolation=cv2.INTER_AREA)
mask=np.zeros((h,w),np.uint8);mask[y0:y1,x0:x1]=a
# Refine neutral backdrop on the cap/body sides using measured source chroma.
# Only these side bands: exclude the white top rim and shoulder reflections.
chroma=rgb[:,:,0].astype(float)-rgb[:,:,1].astype(float)
for ya,yb in [(835,2934)]:
 bounds=[]
 for y in range(ya,yb):
  occupied=np.where(mask[y]>0)[0];l=int(occupied[0]);r=int(occupied[-1])
  lr=np.arange(max(0,l-60),min(w,l+80));rr=np.arange(min(w-1,r+60),max(0,r-80),-1)
  lc=np.where(chroma[y,lr]>=8)[0];rc=np.where(chroma[y,rr]>=8)[0]
  if len(lc)==0 or len(rc)==0:
   bounds.append([l-.5,r+.5]);continue
  ll=lr[lc[0]];ri=rr[rc[0]]
  def crossing(x,outside):
   a=chroma[y,outside];b=chroma[y,x];return outside+(x-outside)*np.clip((8-a)/max(b-a,.001),0,1)
  bounds.append([crossing(ll,ll-1),crossing(ri,ri+1)])
 bounds=cv2.GaussianBlur(np.array(bounds,np.float32),(1,31),4)
 for j,y in enumerate(range(ya,yb)):
  weight=min(1.,j/25,(yb-ya-1-j)/25)
  occupied=np.where(mask[y]>0)[0];oldl=occupied[0]-.5;oldr=occupied[-1]+.5
  l=oldl+(bounds[j,0]-oldl)*weight;r=oldr+(bounds[j,1]-oldr)*weight
  xx=np.arange(w);cover=np.minimum(np.clip(xx-l+.5,0,1),np.clip(r-xx+.5,0,1))
  mask[y]=np.minimum(mask[y],np.rint(cover*255).astype(np.uint8))
# Top arc fitted to the bright source rim; robust smooth curve avoids JPEG chroma noise.
topcols=[];topbounds=[]
lum=cv2.GaussianBlur(cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY).astype(np.float32),(0,0),.8)
for x in range(w):
 occ=np.where(mask[:,x]>0)[0]
 if not len(occ) or occ[0]>=900:continue
 top=int(occ[0]);yy=np.arange(max(1,top-4),min(h-1,top+28))
 strength=lum[yy+1,x]-lum[yy-1,x]
 bound=float(yy[np.argmax(strength)])-.5
 topcols.append(x);topbounds.append(bound)
if topcols:
 xx=np.array(topcols,float);vv=np.array(topbounds,float);u=(xx-xx.mean())/xx.std();good=np.ones(len(xx),bool)
 for _ in range(4):
  poly=np.polyfit(u[good],vv[good],4);res=vv-np.polyval(poly,u);good=np.abs(res)<max(3.,np.std(res[good])*2.5)
 vals=np.polyval(poly,u);yy=np.arange(h)
 for x,bound in zip(topcols,vals):
  mask[:,x]=np.minimum(mask[:,x],np.rint(np.clip(yy-bound+.5,0,1)*255).astype(np.uint8))
Image.fromarray(mask).save(R/'17141-mascara-refinada.png')
Image.fromarray(np.dstack([rgb,mask])).save(R/'17141-producto-original-con-mascara.png')
# Keep exactly the canvas and translation of the previous proposal, with no resizing.
meta=json.loads((R/'verificacion-piloto.json').read_text())
side=meta['dimensions'][0];dx,dy=meta['translation']
canvas=np.full((side,side,3),[250,248,245],dtype=np.uint8)
# Tight contact and restrained broad shadow, entirely behind the original product layer.
ys,xs=np.where(mask>0);bottom=int(ys.max()+dy);cx=(xs.min()+xs.max())/2+dx;pw=xs.max()-xs.min();ph=ys.max()-ys.min()
broad=Image.new('L',(side,side),0);ImageDraw.Draw(broad).ellipse((cx-pw*.54,bottom-ph*.020,cx+pw*.54,bottom+ph*.018),fill=28);broad=broad.filter(ImageFilter.GaussianBlur(22))
contact=Image.new('L',(side,side),0);ImageDraw.Draw(contact).ellipse((cx-pw*.35,bottom-11,cx+pw*.35,bottom+5),fill=53);contact=contact.filter(ImageFilter.GaussianBlur(7))
shadow=np.maximum(np.array(broad),np.array(contact));Image.fromarray(shadow).save(R/'17141-sombra.png')
canvas=np.rint(canvas.astype(float)*(1-shadow[:,:,None]/255.)).astype(np.uint8)
# Feathering changes alpha at silhouette only; RGB of product layer is untouched.
alpha=np.zeros((side,side),np.uint8);layer=np.zeros((side,side,3),np.uint8)
sx=max(0,-dx);sy=max(0,-dy);ex=min(w,side-dx);ey=min(h,side-dy)
alpha[sy+dy:ey+dy,sx+dx:ex+dx]=mask[sy:ey,sx:ex]
layer[sy+dy:ey+dy,sx+dx:ex+dx]=rgb[sy:ey,sx:ex]
result=np.rint(layer.astype(float)*(alpha[:,:,None]/255.)+canvas.astype(float)*(1-alpha[:,:,None]/255.)).astype(np.uint8)
Image.fromarray(result).save(R/'17141-catalogo-refinada.png')
# Aligned views for comparison and edge review.
original=np.full_like(result,230);original[sy+dy:ey+dy,sx+dx:ex+dx]=rgb[sy:ey,sx:ex]
maskview=np.repeat(alpha[:,:,None],3,axis=2);current=np.array(Image.open(old))
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',24)
panels=[('Original · encuadre alineado',original),('Máscara refinada · blanco conserva',maskview),('Propuesta actual',current),('Propuesta refinada',result)]
sheet=Image.new('RGB',(2400,660),'white');d=ImageDraw.Draw(sheet)
for i,(title,im) in enumerate(panels):
 d.text((i*600+12,15),title,font=font,fill='#332D29');sheet.paste(Image.fromarray(im).resize((590,590),Image.Resampling.LANCZOS),(i*600+5,55))
sheet.save(R/'17141-comparacion-cuatro-vistas.png')
# Native-coordinate crops: all mapped identically, enlarged exactly 2x with nearest-neighbor.
zones={'tapa':(1120,800,1690,1040),'hombros':(1010,1790,1820,2050),'lateral-izquierdo':(1010,2100,1110,2610),'lateral-derecho':(1730,2100,1830,2610),'base':(1030,2760,1800,2970),'sombra':(1000,2880,1840,3100)}
for name,(l,t,r,b) in zones.items():
 box=(l+dx,t+dy,r+dx,b+dy);cw=(r-l)*2;ch=(b-t)*2
 plate=Image.new('RGB',(cw*4,ch+70),'white');pd=ImageDraw.Draw(plate)
 for i,(title,im) in enumerate(panels):
  crop=Image.fromarray(im).crop(box).resize((cw,ch),Image.Resampling.NEAREST)
  plate.paste(crop,(cw*i,65));pd.text((cw*i+8,12),['Original','Máscara','Actual','Refinada'][i],font=font,fill='#332D29')
 plate.save(R/'ampliaciones'/('17141-'+name+'-200pct.png'))
core=alpha==255;boundary=(alpha>0)&(alpha<255)
assert np.array_equal(result[core],layer[core]);assert np.array_equal(np.array(Image.open(R/'17141-producto-original-con-mascara.png'))[:,:,:3],rgb)
assert np.all(result[0,0]==[250,248,245])
checks={'sku':'17141','source_sha256':hashlib.sha256(orig.read_bytes()).hexdigest(),'previous_sha256':hashlib.sha256(old.read_bytes()).hexdigest(),'refined_sha256':hashlib.sha256((R/'17141-catalogo-refinada.png').read_bytes()).hexdigest(),'dimensions':[side,side],'product_scale':1,'translation':[dx,dy],'opaque_pixels':int(core.sum()),'opaque_rgb_differences':0,'boundary_alpha_pixels':int(boundary.sum()),'product_layer_rgb_differences_entire_original':0,'background':'#FAF8F5','generative_ai':False,'approval':'pending_visual_review'}
(R/'verificacion-piloto.json').write_text(json.dumps(checks,indent=2)+'\n')
print(checks)
