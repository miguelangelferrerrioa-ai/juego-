/* ===== Rendimiento: los edificios se dibujan una vez en una imagen y se reutilizan (se refrescan solos cada pocos segundos) ===== */
(function(){
'use strict';
const C=new Map();let px=0;const MAXPX=18e6;
const ANIM=new Map();      /* firma de tipo -> true si su dibujo cambia con el tiempo */
const TH=new Map();        /* id -> {n,t,off} para edificios cuya clave cambia sin parar */
let budget=0,lastT=-1;
window.BC_ON=true;
function sig(b,sq){const hb=Math.round(cl(b.hp/Math.max(1,mxhp(b)),0,1)*8);return b.type+'|'+b.lvl+'|'+b.w+'|'+b.h+'|'+(b.rot||0)+'|'+(window.NBK&&NBK.stagePaint?1:0)+'|'+(b.off||0)+'|'+(b.cl||0)+'|'+(b.rf||0)+'|'+(b.ex||0)+'|'+(b.run||0)+'|'+(typeof b.t==='object'?'':b.t)+'|'+(typeof b.l==='object'?'':b.l)+'|'+hb+'|'+(b.ang!=null?Math.round(b.ang*12):'')+'|'+sq+'|'+(window.NBK&&NBK.stagePaint?1:0)+(window.NBK&&NBK.lvlDeco?2:0)}
function box(b){const d=BT[b.type],z=d.z||20,m=Math.max(b.w,b.h),q=P(b.x+b.w/2,b.y+b.h/2);return[q[0]-m*32-44,q[1]-m*16-z-110,q[0]+m*32+z*.9+44,q[1]+m*16+z*.45+34]}
/* re: lienzo anterior del mismo edificio; si mide lo mismo se reutiliza (antes se creaba uno nuevo en cada refresco: ~300 lienzos/s en pueblos grandes) */
function paint(b,sq,bx,re){const W=Math.ceil((bx[2]-bx[0])*sq),H=Math.ceil((bx[3]-bx[1])*sq);let cv=re;if(cv&&cv.width===W&&cv.height===H){const x0=cv.getContext('2d');x0.setTransform(1,0,0,1,0,0);x0.clearRect(0,0,W,H)}else{cv=document.createElement('canvas');cv.width=W;cv.height=H}const x=cv.getContext('2d');x.setTransform(sq,0,0,sq,-bx[0]*sq,-bx[1]*sq);const og=window.g;window.g=x;try{shB(x,b);mir(x,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb)})}finally{window.g=og}return cv}
function same(a,b){try{const A=a.getContext('2d').getImageData(0,0,a.width,a.height).data,B=b.getContext('2d').getImageData(0,0,b.width,b.height).data;for(let i=0;i<A.length;i+=16)if(A[i]!==B[i]||A[i+3]!==B[i+3])return false;return true}catch(e){return false}}
const TRIM=new Map();
function trimOf(cv,bx,sc){try{const W=cv.width,H=cv.height,d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>2){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}if(x1<0)return null;const m=8;return[x0/sc-m,y0/sc-m,(x1+1)/sc+m,(y1+1)/sc+m]}catch(e){return null}}
function animated(b,bx){const k=b.type+'|'+b.lvl+'|'+b.w+'|'+b.h+'|'+(b.rot||0)+'|'+(window.NBK&&NBK.stagePaint?1:0);if(ANIM.has(k))return ANIM.get(k);
 const r=Math.random;let i=0;Math.random=()=>((i++*0.6180339)%1);const a=paint(b,.5,bx);i=0;T+=.43;const c2=paint(b,.5,bx);T-=.43;Math.random=r;const an=!same(a,c2);ANIM.set(k,an);const t1=trimOf(a,bx,.5),t2=trimOf(c2,bx,.5);if(t1&&t2)TRIM.set(k,[Math.min(t1[0],t2[0])-(an?10:0),Math.min(t1[1],t2[1])-(an?14:0),Math.max(t1[2],t2[2])+(an?10:0),Math.max(t1[3],t2[3])+(an?6:0)]);return an}
function tbox(b,bx){const t=TRIM.get(b.type+'|'+b.lvl+'|'+b.w+'|'+b.h+'|'+(b.rot||0)+'|'+(window.NBK&&NBK.stagePaint?1:0));if(!t)return bx;return[bx[0]+Math.max(0,t[0]),bx[1]+Math.max(0,t[1]),Math.min(bx[2],bx[0]+t[2]),Math.min(bx[3],bx[0]*0+bx[1]+t[3])]}
window.bCache=function(c,b){try{if(!window.BC_ON)return false;if(T!==lastT){lastT=T;budget=14}
 const th=TH.get(b.id);if(th&&th.off>T)return false;
 const tf=c.getTransform(),s=Math.hypot(tf.a,tf.b);const sq=Math.min(3,Math.pow(2,Math.ceil(Math.log2(Math.max(.25,s))*3)/3));
 const bx=box(b),k=sig(b,sq),kb=sig(b,0);let e=C.get(b.id);
 /* solo cuenta claves NUEVAS: antes contaba cada fotograma de espera (sin presupuesto) y tras cambiar la calidad marcaba todo el pueblo como 'inestable' y lo dibujaba sin caché 12 s */
 /* el zoom (sq) no cuenta: antes, al pellizcar, casi todo el pueblo quedaba 12 s sin caché */if(e&&e.kb!==kb&&!(th&&th.lk===kb)){const t=th||{n:0,t:T,off:0};t.lk=kb;if(T-t.t>4){t.n=0;t.t=T}if(++t.n>6){t.off=T+12;TH.set(b.id,t);return false}TH.set(b.id,t)}
 const per=e&&e.an?.13+(b.id%5)*.02:3+(b.id%7)*.25;const fresh=e&&e.k===k&&e.bx[0]===bx[0]&&e.bx[1]===bx[1]&&(T-e.t<per||budget<=0);
 if(!fresh&&budget<=0&&e&&e.kb===kb&&e.bx[0]===bx[0]&&e.bx[1]===bx[1]){/* sin cupo de repintado este fotograma: se usa la imagen anterior (otro zoom o fotograma de animación) en vez de dibujarlo entero */c.drawImage(e.cv,e.tb[0],e.tb[1],e.cv.width/e.sq,e.cv.height/e.sq);return true}
 if(!fresh){if(budget<=0)return false;budget--;const an=animated(b,bx),tb=tbox(b,bx);
  const cv=paint(b,sq,tb,e&&e.cv);if(e)px-=e.cv.width*e.cv.height;e={k,kb,sq,bx,tb,cv,t:T,an};C.delete(b.id);C.set(b.id,e);px+=cv.width*cv.height;
  while(px>MAXPX&&C.size>1){const[fk,fv]=C.entries().next().value;if(fk===b.id)break;C.delete(fk);px-=fv.cv.width*fv.cv.height}}
 else{C.delete(b.id);C.set(b.id,e)}
 c.drawImage(e.cv,e.tb[0],e.tb[1],e.cv.width/e.sq,e.cv.height/e.sq);return true}catch(er){return false}};
window.bCacheClear=()=>{C.clear();px=0;ANIM.clear();TH.clear()};
window.bCacheStats=()=>({n:C.size,mpx:+(px/1e6).toFixed(1),anim:[...ANIM].filter(x=>x[1]).map(x=>x[0].split('|')[0]),thrash:[...TH.keys()].length,off:[...TH.values()].filter(t=>t.off>T).length});
})();
