/* Personas en caché: cada persona (y zombi) se dibujaba con ~40 trazos vectoriales en cada fotograma (medido día 248, zoom 1: ~75 personas = +16 ms de dibujo).
   Cada postura de su animación (8 al andar, 4 en reposo; con 12/8 no cabían ~75 personas en 2 páginas) se pinta una vez y se reutiliza. Golpes, muertes y ataques de zombi se siguen dibujando al momento.
   v2 (ATLAS): la primera versión usaba un lienzo pequeño por postura (cientos) y en el móvil iba peor (v159 la apagó). Ahora las posturas van en
   como mucho 2 páginas de 2048 px (texturas de la GPU), igual que los edificios; se pintan al principio del fotograma (pintar en una página ya
   dibujada obliga a Chrome a copiarla) y, mientras falta una, la persona se dibuja como antes. Medidor → 'Personas sin caché' para comparar. */
(function(){
'use strict';
const AS=2048,MAXPG=2,BX0=-29,BY0=-48,BW=58,BH=54,TAU=Math.PI*2;
window.FIGC_ON=true;
const orig=window.fig;
const C=new Map();          /* clave -> {pg,x,y,t} (orden = uso reciente) */
const Q=new Map();          /* clave -> trabajo de pintado pendiente */
let HIT=0,MISS=0,PG=[],SQ=0,ZS=0,ZT=-9,CW=0,CH=0,COLS=0,ROWS=0,FREE=[],RP=0;
function freePages(){PG.forEach(cv=>{cv.width=1;cv.height=1});PG=[];C.clear();Q.clear();FREE=[];SQ=0}
function reset(sq){SQ=sq;CW=Math.ceil(BW*sq)+2;CH=Math.ceil(BH*sq)+2;COLS=Math.floor(AS/CW);ROWS=Math.floor(AS/CH);C.clear();Q.clear();FREE=[];
 PG.forEach(cv=>cv.getContext('2d').clearRect(0,0,AS,AS));for(let p=0;p<PG.length;p++)for(let i=0;i<COLS*ROWS;i++)FREE.push([p,i])}
function cell(){if(FREE.length)return FREE.pop();
 if(PG.length<MAXPG){const cv=document.createElement('canvas');cv.width=AS;cv.height=AS;PG.push(cv);const p=PG.length-1;for(let i=COLS*ROWS-1;i>0;i--)FREE.push([p,i]);return [p,0]}
 /* lleno: se reutiliza la postura usada hace más tiempo */
 for(const [k,e] of C){C.delete(k);return [e.pg,e.i]}return null}
/* aspecto de cada persona: se recalcula como mucho una vez por segundo (antes buscaba a la persona y hacía 2 JSON en cada llamada) */
const LK=new Map();function look(id){if(!id)return '';const m=LK.get(id);if(m&&T-m[0]<1&&T>=m[0])return m[1];const v=look0(id);LK.set(id,[T,v]);if(LK.size>800)LK.clear();return v}
function look0(id){if(typeof byId!=='function')return '';const p=byId(id);if(!p)return '';
 return (p.outfit||'')+'|'+(p.arm||'')+'|'+(p.wp?p.wp.n:'')+'|'+(p.prof||'')+'|'+(p.gear?JSON.stringify(p.gear):'')+'|'+(p.look?JSON.stringify(p.look):'')+'|'+(p.age>=55?2:p.age<18?1:0)+(p.sex||'')}
/* volumen (se pinta una vez por postura): luz cálida por la izquierda y sombra fría a la derecha, y sombra suave alargada en el suelo */
/* sombra suave pre-pintada (un degradado; antes un desenfoque por postura, 4 veces más lento) */
let SHS=null;function shSpr(){if(SHS)return SHS;SHS=document.createElement('canvas');SHS.width=88;SHS.height=40;const x=SHS.getContext('2d');x.translate(44,20);x.scale(1,.36);const g=x.createRadialGradient(0,0,0,0,0,44);g.addColorStop(0,'rgba(10,6,2,.3)');g.addColorStop(.55,'rgba(10,6,2,.2)');g.addColorStop(1,'rgba(10,6,2,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,44,0,7);x.fill();return SHS}
function shade(x,j){const q=j.q,sc=+j.a[3]||1;
 x.globalCompositeOperation='source-atop';{let g=x.createLinearGradient(q[0]-8,0,q[0]+8,0);g.addColorStop(0,'rgba(255,232,185,.30)');g.addColorStop(.5,'rgba(255,232,185,0)');g.addColorStop(.55,'rgba(25,20,60,0)');g.addColorStop(1,'rgba(25,20,60,.34)');x.fillStyle=g;x.fillRect(q[0]+BX0,q[1]+BY0,BW,BH);
 g=x.createLinearGradient(0,q[1]-34,0,q[1]);g.addColorStop(0,'rgba(255,248,220,.18)');g.addColorStop(.6,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,6,2,.25)');x.fillStyle=g;x.fillRect(q[0]+BX0,q[1]+BY0,BW,BH)}
 x.globalCompositeOperation='destination-over';x.drawImage(shSpr(),q[0]-5*sc,q[1]-3.5*sc,22*sc,10*sc);x.globalCompositeOperation='source-over'}
/* pinta la postura en su celda con el reloj T ajustado a esa fase de la animación */
/* se pinta en un lienzo pequeño aparte y se copia al atlas de una vez (sombrear leyendo de la página del atlas obligaría a copiarla entera) */
let FC=null;function paint(j){const sl=cell();if(!sl)return;const [p,i]=sl,cx=(i%COLS)*CW+1,cy=Math.floor(i/COLS)*CH+1,cv=PG[p],x=cv.getContext('2d');RP++;
 if(!FC)FC=document.createElement('canvas');if(FC.width!==CW||FC.height!==CH){FC.width=CW;FC.height=CH}const f=FC.getContext('2d');
 f.save();f.setTransform(1,0,0,1,0,0);f.globalCompositeOperation='source-over';f.globalAlpha=1;f.clearRect(0,0,CW,CH);f.beginPath();f.rect(1,1,CW-2,CH-2);f.clip();
 f.setTransform(SQ,0,0,SQ,1-(j.q[0]+BX0)*SQ,1-(j.q[1]+BY0)*SQ);
 const T0=T,og=window.g;T=j.T;window.g=f;try{orig.apply(null,j.a);if(window.FIGSH!==false)shade(f,j)}finally{T=T0;window.g=og;f.restore()}
 x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(cx-1,cy-1,CW,CH);x.drawImage(FC,cx-1,cy-1);x.restore();
 C.set(j.k,{pg:p,i,x:cx,y:cy,t:T})}
window.figFlush=function(){if(!Q.size)return;const t0=performance.now();let n=0;for(const [k,j] of Q){Q.delete(k);if(j.sq===SQ&&!C.has(k))paint(j);if(++n>=24||performance.now()-t0>3)break}};
{const ob=window.bcFlush;window.bcFlush=function(){if(ob)try{ob()}catch(e){}try{figFlush()}catch(e){}}}
window.fig=function(x,y,col,sc,wkg,hd,gun,dx,role,act,id){
 const c=window.g;
 if(!window.FIGC_ON||!c||!c.canvas||c.canvas.id!=='c'||FL||act==6||(role==='zom'&&act==2)||!isFinite(x)||!isFinite(y))return orig.apply(this,arguments);
 try{const id0=id||0,run=act==3,sp=run?15:9;let ph,ix,n;
  /* fase de la animación cuantizada; se pinta con un T que da justo esa fase */
  if(wkg){n=8;ph=((T*sp+x*3+id0)%TAU+TAU)%TAU;ix=Math.floor(ph/TAU*n)}else{n=4;ph=((T*6+id0)%TAU+TAU)%TAU;ix=Math.floor(ph/TAU*n)}
  /* escala: ×0,5/1/1,5/2 hacia arriba (nunca borroso); al cambiar el zoom se sigue usando la anterior y se cambia con la cámara quieta 0,3 s */
  const tf=c.getTransform(),s0=Math.hypot(tf.a,tf.b);if(Math.abs(s0-ZS)>1e-4){ZS=s0;ZT=T}
  /* con el zoom muy alejado (personas de ~8 px) la caché no compensa: medido en el móvil (zoom 0,35, noche con lluvia) la GPU bajaba de 99 a 28 ms sin ella y el dibujo solo subía 2 ms.
     Se dibujan como antes y, con el zoom quieto 2 s, se sueltan las páginas (32 MB de memoria de la GPU que se peleaban con las de los edificios) */
  if(s0<.7){if(PG.length&&T-ZT>2)freePages();window.__figLod=true;try{return orig.apply(this,arguments)}finally{window.__figLod=false}}
  const want=[1,1.5,2].find(v=>v>=s0-1e-6)||2;/* con margen como los edificios: subir si pasa un 25 % por encima, bajar por debajo del 60 % (cada cambio repinta a todas las personas) */if(!SQ||(want!==SQ&&T-ZT>=.8&&((want>SQ&&s0>SQ*1.25)||(want<SQ&&s0<SQ*.6))))reset(want);
  const a=arguments,k=[role,col,sc,wkg?1:0,hd,gun?String(gun).slice(0,24):0,dx<0?1:0,act,id0,a[11],a[12]?1:0,a[13]?1:0,ix,EXP,SXF,OLDF,KIDF,WPN,(typeof ZV!=='undefined'?ZV:0),window.BCOL||'',look(id)].join('~');
  const q=P(x,y);let e=C.get(k);
  /* se refresca cada ~60 s por si algo del aspecto no está en la clave */
  if(!e||T-e.t>60+(id0%13)){if(!Q.has(k))Q.set(k,{k,a:Array.prototype.slice.call(a),q,sq:SQ,T:wkg?((ix+.5)/n*TAU-x*3-id0)/sp:((ix+.5)/n*TAU-id0)/6});if(!e){MISS++;return orig.apply(this,arguments)}}
  else{C.delete(k);C.set(k,e)}HIT++;
  c.drawImage(PG[e.pg],e.x,e.y,CW-2,CH-2,q[0]+BX0,q[1]+BY0,(CW-2)/SQ,(CH-2)/SQ)}catch(er){try{window.g=c}catch(e2){}return orig.apply(this,arguments)}};
try{fig=window.fig}catch(e){}
window.figCacheReset=()=>{SQ=0;C.clear();Q.clear()};
(window.__gfxR=window.__gfxR||[]).push(()=>{SQ=0;C.clear();Q.clear()});
window.figCacheStats=()=>({n:C.size,pendientes:Q.size,paginas:PG.length,escala:SQ,repintados:RP,aciertos:HIT,fallos:MISS});
})();
