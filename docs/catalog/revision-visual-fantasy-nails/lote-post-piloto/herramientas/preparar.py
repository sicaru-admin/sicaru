from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np,cv2,json,hashlib,shutil
R=Path(__file__).resolve().parents[1];BASE=R.parent;REPO=next(p for p in R.parents if (p/'.git').exists());SRC=REPO/'public/images/fantasy-nails'
PILOT=BASE/'17141/correccion-puntual-r2/17141-catalogo-candidata-r2.png'
assert hashlib.sha256(PILOT.read_bytes()).hexdigest()=='166df5915a623010dfaf6574e4df1dac2b871f77cf5b022f3683c27bb0c201a7'
# Each path is manually located against its own original (coordinates in its 960x1280 view).
# No contour or pixels from Petal are used in these paths.
PATHS={
'17133':[(379,327),(383,350),(390,400),(393,450),(394,500),(394,550),(390,600),(386,631),(385,634),(367,646),(352,666),(346,687),(344,713),(345,800),(346,890),(348,932),(354,951),(365,962),(375,975),(395,987),(425,994),(460,997),(500,993),(534,986),(555,973),(567,955),(580,945),(590,931),(592,900),(590,800),(589,714),(585,686),(575,664),(558,648),(540,638),(546,631),(541,590),(536,550),(530,500),(528,450),(531,400),(535,350),(538,327),(532,316),(516,309),(489,304),(455,303),(420,305),(397,313)],
'17136':[(384,276),(389,310),(396,370),(398,440),(397,490),(392,550),(389,590),(367,601),(352,619),(347,643),(346,675),(347,800),(348,900),(355,922),(365,935),(371,950),(389,962),(415,969),(449,974),(483,974),(515,968),(543,957),(563,941),(578,925),(589,913),(598,897),(599,800),(599,680),(595,644),(581,617),(565,600),(551,588),(544,550),(538,500),(535,450),(536,400),(541,350),(546,305),(549,276),(541,263),(522,254),(492,249),(461,247),(427,250),(401,259)],
'28102':[(381,213),(388,270),(393,330),(393,400),(389,470),(384,535),(366,548),(351,569),(343,591),(341,620),(342,800),(347,860),(360,882),(367,898),(388,913),(420,920),(461,925),(500,923),(535,914),(560,902),(574,885),(588,874),(600,852),(601,800),(599,620),(594,590),(581,565),(565,549),(547,539),(552,535),(546,480),(540,420),(537,350),(541,290),(547,230),(548,210),(537,195),(510,187),(475,181),(442,181),(414,186),(393,195)],
'28101':[(399,311),(404,350),(409,400),(411,450),(410,500),(405,550),(401,599),(404,604),(400,608),(386,616),(370,631),(361,651),(358,677),(358,800),(360,918),(366,935),(376,949),(388,960),(415,970),(450,975),(487,976),(524,970),(554,960),(570,945),(581,935),(596,923),(599,900),(598,700),(596,677),(590,650),(579,630),(559,615),(545,608),(547,604),(551,600),(545,550),(540,500),(539,450),(542,400),(546,350),(550,310),(548,304),(533,296),(507,290),(474,287),(440,289),(414,296),(401,305)],
'20132':[(363,325),(362,400),(363,500),(362,565),(364,571),(368,580),(367,600),(367,800),(368,900),(369,925),(379,938),(399,946),(431,952),(472,955),(517,954),(552,947),(578,936),(598,924),(598,800),(598,600),(597,580),(600,571),(600,565),(599,520),(599,450),(599,325),(586,312),(558,301),(520,293),(476,290),(438,292),(398,299),(372,310)]}
NAMES={'17133':'Gel Rubber Pink Shine','17136':'Gel Rubber Piel','28101':'Gel Super Blanco','28102':'Gel Super Negro','20132':'TrueBond sin ácido'}
NECK={'17133':635,'17136':591,'28102':537,'28101':603,'20132':571}
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',22)
rows=[]
def trace(points,scale):
 points=np.array(points,float)*scale;curve=[]
 for i in range(len(points)):
  a,b,c,d=[points[k%len(points)] for k in [i-1,i,i+1,i+2]]
  for t in np.linspace(0,1,max(5,int(np.linalg.norm(c-b))),endpoint=False):
   curve.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
 return np.array(curve)
for sku,points in PATHS.items():
 folder=R/sku;folder.mkdir(exist_ok=True);source=SRC/(sku+'.jpeg');backup=folder/(sku+'-original-respaldo.jpeg');shutil.copyfile(source,backup)
 rgb=np.array(Image.open(backup).convert('RGB'));h,w=rgb.shape[:2];scale=w/960
 curve=trace(points,scale);x0,y0=np.floor(curve.min(axis=0)-3).astype(int);x1,y1=np.ceil(curve.max(axis=0)+3).astype(int)
 high=np.zeros(((y1-y0)*4,(x1-x0)*4),np.uint8);cv2.fillPoly(high,[np.rint((curve-[x0,y0])*4).astype(np.int32)],255)
 mask=np.zeros((h,w),np.uint8);mask[y0:y1,x0:x1]=cv2.resize(high,(x1-x0,y1-y0),interpolation=cv2.INTER_AREA)
 # Local optical edge refinement on each original; broad source reflections remain inside the mask.
 blur=cv2.GaussianBlur(rgb.astype(np.float32),(0,0),max(.5,scale*.4));gx=cv2.Sobel(blur,cv2.CV_32F,1,0,ksize=3);grad=np.sqrt(np.sum(gx*gx,axis=2))
 start=int((min(p[1] for p in points)+23)*scale);end=int((max(p[1] for p in points)-18)*scale);bound=[]
 radius=max(4,int(6*scale))
 for y in range(start,end):
  occupied=np.where(mask[y]>0)[0];l,r=occupied[0],occupied[-1];found=[]
  for edge in [l,r]:
   xs=np.arange(max(0,edge-radius),min(w,edge+radius+1));score=grad[y,xs]*np.exp(-.5*((xs-edge)/max(2,radius*.8))**2)
   k=int(np.argmax(score));x=float(xs[k]);
   if 0<k<len(xs)-1:
    v=score[k-1:k+2];den=v[0]-2*v[1]+v[2]
    if abs(den)>1e-5:x+=float(np.clip(.5*(v[0]-v[2])/den,-.5,.5))
   found.append(x)
  bound.append(found)
 bound=np.array(bound,np.float32);ksize=max(5,int(scale*7)|1);bound=cv2.GaussianBlur(bound,(1,ksize),max(.7,scale*1.1))
 # Regularize measured long cap/body boundaries, individually per bottle, avoiding noisy stairs.
 bands={'17133':[(345,620),(710,920),(925,980)],'17136':[(290,580),(670,885),(890,955)],'28102':[(225,525),(615,840),(850,907)],'28101':[(325,590),(685,900),(910,960)],'20132':[(335,560),(620,895),(900,942)]}
 for ya,yb in bands[sku]:
  ia=max(0,int(ya*scale)-start);ib=min(len(bound),int(yb*scale)-start);yy=np.arange(ia,ib,dtype=float);u=(yy-yy.mean())/max(1,yy.std())
  for col in [0,1]:
   values=bound[ia:ib,col].copy();good=np.ones(len(u),bool)
   for _ in range(4):
    fit=np.polyfit(u[good],values[good],3);res=values-np.polyval(fit,u);good=np.abs(res)<max(1.2*scale,2.5*np.std(res[good]))
   sm=np.polyval(fit,u);weight=np.minimum(1,np.minimum((yy-ia)/(10*scale),(ib-1-yy)/(10*scale)))
   bound[ia:ib,col]=values*(1-weight)+sm*weight
 for j,y in enumerate(range(start,end)):
  if abs(y-NECK[sku]*scale)<5*scale:continue
  occupied=np.where(mask[y]>0)[0];oldl=occupied[0]-.5;oldr=occupied[-1]+.5
  weight=min(1,j/(8*scale),(end-start-j-1)/(8*scale));l=oldl+(bound[j,0]-oldl)*weight;r=oldr+(bound[j,1]-oldr)*weight
  xx=np.arange(w);coverage=np.minimum(np.clip(xx-l+.5,0,1),np.clip(r-xx+.5,0,1))
  # Use direct coverage (not an automatic erosion of the prior outline).
  mask[y]=np.rint(coverage*255).astype(np.uint8)
 # Clean neutral backdrop only at each black bottle's own cap/neck extremities.
 if sku in ['17133','17136','28102']:
  neck=int(NECK[sku]*scale);edge_row=int(neck-3*scale);occupied=np.where(mask[edge_row]>0)[0]
  for edge in [occupied[0],occupied[-1]]:
   l=max(0,int(edge-13*scale));r=min(w,int(edge+13*scale));t=int(neck-7*scale);b=int(neck+8*scale)
   src=rgb[t:b,l:r].astype(float);lum=src.mean(axis=2)
   coverage=np.maximum(np.clip((90-lum)/30,0,1),np.clip((lum-155)/35,0,1))
   coverage=cv2.GaussianBlur(coverage.astype(np.float32),(3,3),.45);coverage[(lum<=60)|(lum>=190)]=1
   yy,xx=np.indices(coverage.shape);fade=np.clip(np.minimum.reduce([xx/(3*scale),(r-l-1-xx)/(3*scale),yy/(3*scale),(b-t-1-yy)/(3*scale),np.ones_like(xx)]),0,1)
   mask[t:b,l:r]=np.minimum(mask[t:b,l:r],np.rint(255*(1-fade*(1-coverage))).astype(np.uint8))
 # TrueBond: independent chromatic edge measurements distinguish its pink/translucent outline
 # from neutral backdrop, without removing the gray cast seen through the product interior.
 if sku=='20132':
  chroma=cv2.GaussianBlur(rgb[:,:,0].astype(np.float32)-rgb[:,:,1].astype(np.float32),(0,0),.6)
  ys0,xs0=np.where(mask>0);ya=int(ys0.min()+4);yb=int(ys0.max()-4);bounds=[]
  for y in range(ya,yb):
   occ=np.where(mask[y]>0)[0];l,r=occ[0],occ[-1];limits=[]
   for edge,sgn in [(l,1),(r,-1)]:
    xx=np.arange(max(0,edge-12),min(w,edge+18)) if sgn==1 else np.arange(min(w-1,edge+12),max(0,edge-18),-1)
    hits=np.where(chroma[y,xx]>=6)[0]
    if not len(hits):limits.append(float(edge));continue
    x=int(xx[hits[0]]);outside=x-sgn;v0=chroma[y,outside];v1=chroma[y,x]
    limits.append(outside+sgn*np.clip((6-v0)/max(.001,v1-v0),0,1))
   bounds.append(limits)
  bounds=cv2.GaussianBlur(np.array(bounds,np.float32),(1,11),1.5)
  for j,y in enumerate(range(ya,yb)):
   xx=np.arange(w);l,r=bounds[j];coverage=np.minimum(np.clip(xx-l+.5,0,1),np.clip(r-xx+.5,0,1))
   mask[y]=np.minimum(mask[y],np.rint(coverage*255).astype(np.uint8))
 # Subpixel mask antialiasing only; maintain full-opacity interior and untouched RGB.
 blurred=cv2.GaussianBlur(mask.astype(np.float32)/255,(0,0),max(.55,.75*scale))
 mask=np.rint(np.clip((blurred-.38)/.24,0,1)*255).astype(np.uint8)
 # Preserve all enclosed product pixels; only the outer silhouette is masked.
 ys,xs=np.where(mask>0);bx0,bx1=xs.min(),xs.max()+1;by0,by1=ys.min(),ys.max()+1;pw=bx1-bx0;ph=by1-by0
 side=int(np.ceil(ph/.755));dx=(side-pw)//2-int(bx0);dy=(side-ph)//2-int(by0)
 # Same composition/shadow proportions as the unchanged approved R2 pilot, adjusted to native resolution.
 shadow_w=Image.new('L',(side,side),0);contact=Image.new('L',(side,side),0);cx=(bx0+bx1-1)/2+dx;bottom=by1-1+dy
 ImageDraw.Draw(shadow_w).ellipse((cx-pw*.54,bottom-ph*.020,cx+pw*.54,bottom+ph*.018),fill=28);shadow_w=shadow_w.filter(ImageFilter.GaussianBlur(22*side/2823))
 ImageDraw.Draw(contact).ellipse((cx-pw*.35,bottom-11*side/2823,cx+pw*.35,bottom+5*side/2823),fill=53);contact=contact.filter(ImageFilter.GaussianBlur(7*side/2823))
 shadow=np.maximum(np.array(shadow_w),np.array(contact));bg=np.rint(np.array([250,248,245])[None,None,:]*(1-shadow[:,:,None]/255.)).astype(np.uint8)
 fullalpha=np.zeros((side,side),np.uint8);layer=np.zeros((side,side,3),np.uint8)
 sx=max(0,-dx);sy=max(0,-dy);ex=min(w,side-dx);ey=min(h,side-dy)
 fullalpha[sy+dy:ey+dy,sx+dx:ex+dx]=mask[sy:ey,sx:ex];layer[sy+dy:ey+dy,sx+dx:ex+dx]=rgb[sy:ey,sx:ex]
 result=np.rint(layer.astype(float)*fullalpha[:,:,None]/255.+bg*(1-fullalpha[:,:,None]/255.)).astype(np.uint8)
 Image.fromarray(result).save(folder/(sku+'-catalogo-candidata.png'));Image.fromarray(mask).save(folder/(sku+'-mascara.png'));Image.fromarray(np.dstack([rgb,mask])).save(folder/(sku+'-producto-original-mascarado.png'));Image.fromarray(shadow).save(folder/(sku+'-sombra.png'))
 assert np.array_equal(result[fullalpha==255],layer[fullalpha==255])
 # Aligned original, mask and new candidate, no change to the originals themselves.
 aligned=np.full_like(result,230);aligned[sy+dy:ey+dy,sx+dx:ex+dx]=rgb[sy:ey,sx:ex]
 panels=[('Original alineado',aligned),('Máscara individual',np.repeat(fullalpha[:,:,None],3,axis=2)),('Candidata por aprobar',result)]
 sheet=Image.new('RGB',(1800,660),'white');d=ImageDraw.Draw(sheet)
 for i,(label,im) in enumerate(panels):
  d.text((i*600+10,12),sku+' · '+label,font=font,fill='#332d29');sheet.paste(Image.fromarray(im).resize((590,590),Image.Resampling.LANCZOS),(i*600+5,55))
 sheet.save(folder/(sku+'-comparacion.png'))
 # Native source-coordinate critical crops: cap rim, joint/shoulders and base, shown 200%.
 top=min(p[1] for p in points);neck=NECK[sku];bot=max(p[1] for p in points)
 regions=[('Tapa',(int(bx0),int((top-5)*scale),int(bx1),int((top+35)*scale))),('Unión/hombros',(int(bx0),int((neck-12)*scale),int(bx1),int((neck+50)*scale))),('Base',(int(bx0),int((bot-55)*scale),int(bx1),int((bot+12)*scale)))]
 tiles=[]
 for title,(l,t,r,b) in regions:
  cw=(r-l)*2;ch=(b-t)*2;plate=Image.new('RGB',(cw*3,ch+55),'white');pd=ImageDraw.Draw(plate)
  for i,(label,im) in enumerate(panels):
   crop=Image.fromarray(im).crop((l+dx,t+dy,r+dx,b+dy)).resize((cw,ch),Image.Resampling.NEAREST);plate.paste(crop,(i*cw,50));pd.text((i*cw+5,10),title+' · '+label,font=font,fill='#332d29')
  tiles.append(plate)
 combo=Image.new('RGB',(max(p.width for p in tiles),sum(p.height for p in tiles)),'white');yy=0
 for tile in tiles:combo.paste(tile,(0,yy));yy+=tile.height
 combo.save(folder/(sku+'-bordes-criticos-200pct.png'))
 row={'sku':sku,'name':NAMES[sku],'status':'pendiente_revision_individual','source_dimensions':[w,h],'dimensions':[side,side],'source_bbox':[int(bx0),int(by0),int(bx1),int(by1)],'translation':[int(dx),int(dy)],'product_scale':1,'relative_height':float(ph/side),'margins_output':[int(bx0+dx),int(by0+dy),int(side-bx1-dx),int(side-by1-dy)],'opaque_pixels':int(np.sum(fullalpha==255)),'opaque_rgb_differences':0,'partial_alpha_pixels':int(np.sum((fullalpha>0)&(fullalpha<255))),'source_sha256':hashlib.sha256(backup.read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256((folder/(sku+'-catalogo-candidata.png')).read_bytes()).hexdigest(),'background':'#FAF8F5','generative_ai':False}
 (folder/'verificacion.json').write_text(json.dumps(row,indent=2)+'\n');rows.append(row);print(sku,side,ph/side,flush=True)
# Petal is read-only: its existing file is only reduced within the comparison sheet.
order=['17133','17141','17136','28101','28102','20132'];sheet=Image.new('RGB',(2400,1720),'#FAF8F5');d=ImageDraw.Draw(sheet);font2=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',25)
for i,sku in enumerate(order):
 x=i%3*800;y=i//3*860;path=PILOT if sku=='17141' else R/sku/(sku+'-catalogo-candidata.png');im=Image.open(path)
 sheet.paste(im.resize((800,800),Image.Resampling.LANCZOS),(x,y));d.text((x+40,y+805),sku+(' · Referencia R2 aceptada' if sku=='17141' else ' · Pendiente de revisión'),font=font2,fill='#332d29')
sheet.save(R/'seis-sku-comparativa.png')
assert hashlib.sha256(PILOT.read_bytes()).hexdigest()=='166df5915a623010dfaf6574e4df1dac2b871f77cf5b022f3683c27bb0c201a7'
(R/'verificacion-lote.json').write_text(json.dumps({'pilot_17141_unchanged':True,'pilot_sha256':hashlib.sha256(PILOT.read_bytes()).hexdigest(),'candidates':rows},indent=2)+'\n')
