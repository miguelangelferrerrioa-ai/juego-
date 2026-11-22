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
/* pinta la postura en su celda con el reloj T ajustado a esa fase de la animación */
function paint(j){const sl=cell();if(!sl)return;const [p,i]=sl,cx=(i%COLS)*CW+1,cy=Math.floor(i/COLS)*CH+1,cv=PG[p],x=cv.getContext('2d');RP++;
 x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(cx-1,cy-1,CW,CH);x.beginPath();x.rect(cx,cy,CW-2,CH-2);x.clip();
 x.setTransform(SQ,0,0,SQ,cx-(j.q[0]+BX0)*SQ,cy-(j.q[1]+BY0)*SQ);
 const T0=T,og=window.g;T=j.T;window.g=x;try{orig.apply(null,j.a)}finally{T=T0;window.g=og;x.restore()}
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
  const want=[.5,1,1.5,2].find(v=>v>=s0-1e-6)||2;if(!SQ||(want!==SQ&&T-ZT>=.3))reset(want);
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
