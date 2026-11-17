/* Mosaico del terreno: con la cámara alejada, los lienzos grandes (terreno 5120 px, borde) se dibujan desde versiones a 1/2 y 1/4 troceadas en baldosas de 1024 px.
   - En el móvil, un lienzo de más de 4096 px no cabe en una textura de la GPU y se pinta muy lento; las baldosas sí caben.
   - Con la cámara alejada se usa la versión reducida: se mueven 4 o 16 veces menos píxeles por fotograma. */
(function(){
'use strict';
const TS=1024,M=new WeakMap();
function lv(src,k){if(window.PERFC)PERFC.lv++;const f=1/(1<<k),w=Math.max(1,Math.ceil(src.width*f)),h=Math.max(1,Math.ceil(src.height*f)),t=[];
 for(let y=0;y<h;y+=TS)for(let x=0;x<w;x+=TS){const cv=document.createElement('canvas');cv.width=Math.min(TS,w-x);cv.height=Math.min(TS,h-y);const g=cv.getContext('2d');g.imageSmoothingQuality='high';
  g.drawImage(src,x/f,y/f,cv.width/f,cv.height/f,0,0,cv.width,cv.height);t.push([x,y,cv])}
 return {f,t}}
/* ver: número que cambia cuando se repinta el lienzo de origen */
function get(src,ver,k){let e=M.get(src);if(!e||e.ver!==ver||e.w!==src.width||e.h!==src.height){e={ver,w:src.width,h:src.height,L:[]};M.set(src,e);const E=e;/* las versiones reducidas se preparan en un rato libre, no al alejar la cámara */[1,2].forEach((q,i)=>setTimeout(()=>{if(M.get(src)===E&&!E.L[q])E.L[q]=lv(src,q)},120+i*90))}
 if(!e.L[k])e.L[k]=lv(src,k);return e.L[k]}
/* dibuja la zona del mundo [x0,x1]×[y0,y1]; px=(x+ox)*sc, py=(y+oy)*sc en el lienzo de origen; dps = píxeles de pantalla por unidad de mundo */
window.drawTiled=function(c,src,ver,ox,oy,sc,x0,y0,x1,y1,dps){
 const need=dps/sc;let k=0;while(k<2&&1/(1<<(k+1))>=need*.62)k++;
 /* de cerca se dibuja del lienzo original, como siempre */if(k===0){const sx=(x0+ox)*sc,sy=(y0+oy)*sc;c.drawImage(src,sx,sy,(x1-x0)*sc,(y1-y0)*sc,x0,y0,x1-x0,y1-y0);return}
 const L=get(src,ver,k),f=L.f*sc,sx0=(x0+ox)*f,sy0=(y0+oy)*f,sx1=(x1+ox)*f,sy1=(y1+oy)*f;
 for(const [tx,ty,cv] of L.t){const ax=Math.max(sx0,tx),ay=Math.max(sy0,ty),bx=Math.min(sx1,tx+cv.width),by=Math.min(sy1,ty+cv.height);if(bx<=ax||by<=ay)continue;
  /* un pelín de solape para que no se vean juntas entre baldosas */
  c.drawImage(cv,ax-tx,ay-ty,bx-ax,by-ay,ax/f-ox,ay/f-oy,(bx-ax)/f+.6/f,(by-ay)/f+.6/f)}};
})();
