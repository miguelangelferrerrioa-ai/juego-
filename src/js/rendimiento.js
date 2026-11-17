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
/* ATLAS: las imágenes de los edificios van en unos pocos lienzos grandes de 2048 px (texturas de la GPU) en vez de un lienzo pequeño por edificio.
   En Chrome de Android los lienzos pequeños no están en la GPU y cada fotograma se subían ~100 texturas: medido en el móvil, apagar los edificios bajaba la GPU de 30 a 17 ms. */
const AS=2048,MAXPG=4,PG=[];let ZS=0,ZT=-9,BSQ=0;let ATL_ON=true;
function newPage(){const cv=document.createElement('canvas');cv.width=AS;cv.height=AS;const pg={cv,x:[],sh:[],y:0};PG.push(pg);return pg}
/* estantes: cada estante tiene una altura fija; se busca uno con sitio y altura parecida */
function alloc(w,h){w+=2;h+=2;if(w>AS||h>AS)return null;const hh=Math.ceil(h/16)*16;
 for(let i=0;i<PG.length;i++){const pg=PG[i];for(const sh of pg.sh){if(sh.h===hh&&sh.x+w<=AS){const r={pg:i,x:sh.x+1,y:sh.y+1};sh.x+=w;return r}}if(pg.y+hh<=AS){const sh={y:pg.y,h:hh,x:w};pg.sh.push(sh);pg.y+=hh;return {pg:i,x:1,y:sh.y+1}}}
 if(PG.length<MAXPG){newPage();return alloc(w-2,h-2)}return null}
/* compactar: copia solo las imágenes vivas a páginas nuevas (copia de GPU a GPU, sin redibujar); los huecos viejos de otros zooms se liberan */
function compact(){if(window.PERFC)PERFC.cp++;const old=PG.splice(0);const live=[...C.entries()].filter(([,e])=>e.sl).sort((a,b)=>b[1].H-a[1].H);
 for(const [id,e] of live){const sl=alloc(e.W,e.H);if(!sl){C.delete(id);continue}const o=old[e.sl.pg];PG[sl.pg].cv.getContext('2d').drawImage(o.cv,e.sl.x,e.sl.y,e.W,e.H,sl.x,sl.y,e.W,e.H);e.sl=sl}}
function atlasReset(){PG.forEach(pg=>{pg.sh=[];pg.y=0;pg.cv.getContext('2d').clearRect(0,0,AS,AS)});C.clear();px=0}
function paintIn(x,b,sq,bx){const og=window.g;window.g=x;try{shB(x,b);mir(x,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb)})}finally{window.g=og}}
/* pinta el edificio en su hueco del atlas (recortado para no pisar a los vecinos) */
let PA=0;function paintAtlas(b,sq,bx,sl){PA++;const W=Math.ceil((bx[2]-bx[0])*sq),H=Math.ceil((bx[3]-bx[1])*sq),x=PG[sl.pg].cv.getContext('2d');
 x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(sl.x,sl.y,W,H);x.beginPath();x.rect(sl.x,sl.y,W,H);x.clip();x.setTransform(sq,0,0,sq,sl.x-bx[0]*sq,sl.y-bx[1]*sq);try{paintIn(x,b,sq,bx)}finally{x.restore()}}
function paint(b,sq,bx,re){const W=Math.ceil((bx[2]-bx[0])*sq),H=Math.ceil((bx[3]-bx[1])*sq);let cv=re;if(cv&&cv.width===W&&cv.height===H){const x0=cv.getContext('2d');x0.setTransform(1,0,0,1,0,0);x0.clearRect(0,0,W,H)}else{cv=document.createElement('canvas');cv.width=W;cv.height=H}const x=cv.getContext('2d');x.setTransform(sq,0,0,sq,-bx[0]*sq,-bx[1]*sq);const og=window.g;window.g=x;try{shB(x,b);mir(x,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb)})}finally{window.g=og}return cv}
function same(a,b){try{const A=a.getContext('2d').getImageData(0,0,a.width,a.height).data,B=b.getContext('2d').getImageData(0,0,b.width,b.height).data;for(let i=0;i<A.length;i+=16)if(A[i]!==B[i]||A[i+3]!==B[i+3])return false;return true}catch(e){return false}}
const TRIM=new Map();
function trimOf(cv,bx,sc){try{const W=cv.width,H=cv.height,d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>2){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}if(x1<0)return null;const m=8;return[x0/sc-m,y0/sc-m,(x1+1)/sc+m,(y1+1)/sc+m]}catch(e){return null}}
function animated(b,bx){const k=b.type+'|'+b.lvl+'|'+b.w+'|'+b.h+'|'+(b.rot||0)+'|'+(window.NBK&&NBK.stagePaint?1:0);if(ANIM.has(k))return ANIM.get(k);
 const r=Math.random;let i=0;Math.random=()=>((i++*0.6180339)%1);const a=paint(b,.5,bx);i=0;T+=.43;const c2=paint(b,.5,bx);T-=.43;Math.random=r;const an=!same(a,c2);ANIM.set(k,an);const t1=trimOf(a,bx,.5),t2=trimOf(c2,bx,.5);if(t1&&t2)TRIM.set(k,[Math.min(t1[0],t2[0])-(an?10:0),Math.min(t1[1],t2[1])-(an?14:0),Math.max(t1[2],t2[2])+(an?10:0),Math.max(t1[3],t2[3])+(an?6:0)]);return an}
function tbox(b,bx){const t=TRIM.get(b.type+'|'+b.lvl+'|'+b.w+'|'+b.h+'|'+(b.rot||0)+'|'+(window.NBK&&NBK.stagePaint?1:0));if(!t)return bx;return[bx[0]+Math.max(0,t[0]),bx[1]+Math.max(0,t[1]),Math.min(bx[2],bx[0]+t[2]),Math.min(bx[3],bx[0]*0+bx[1]+t[3])]}
function blit(c,e){if(e.sl)c.drawImage(PG[e.sl.pg].cv,e.sl.x,e.sl.y,e.W,e.H,e.tb[0],e.tb[1],e.W/e.sq,e.H/e.sq);else c.drawImage(e.cv,e.tb[0],e.tb[1],e.cv.width/e.sq,e.cv.height/e.sq)}
window.bCache=function(c,b){try{if(!window.BC_ON)return false;if(T!==lastT){lastT=T;budget=4}
 const th=TH.get(b.id);if(th&&th.off>T)return false;
 const tf=c.getTransform(),s=Math.hypot(tf.a,tf.b)/((typeof QS==='number'&&QS>0)?QS:1);/* sin el ajuste automático de calidad: si no, cada ajuste repintaba todos los edificios */if(Math.abs(s-ZS)>1e-4){ZS=s;ZT=T}/* margen de zoom: se reutiliza la escala mientras el zoom no se aleje más de un ~40 %; solo se cambia con la cámara parada 0,3 s */const want=Math.min(3,Math.pow(2,Math.ceil(Math.log2(Math.max(.25,s))*3)/3));if(!BSQ||((want/BSQ>1.42||want/BSQ<.7)&&T-ZT>=.3))BSQ=want;const sq=BSQ;
 const bx=box(b),k=sig(b,sq),kb=sig(b,0);let e=C.get(b.id);
 /* solo cuenta claves NUEVAS: antes contaba cada fotograma de espera (sin presupuesto) y tras cambiar la calidad marcaba todo el pueblo como 'inestable' y lo dibujaba sin caché 12 s */
 /* el zoom (sq) no cuenta: antes, al pellizcar, casi todo el pueblo quedaba 12 s sin caché */if(e&&e.kb!==kb&&!(th&&th.lk===kb)){const t=th||{n:0,t:T,off:0};t.lk=kb;if(T-t.t>4){t.n=0;t.t=T}if(++t.n>6){t.off=T+12;TH.set(b.id,t);return false}TH.set(b.id,t)}
 const per=e&&e.an?.13+(b.id%5)*.02:e&&e.sl?1e9:3+(b.id%7)*.25;
 /* mientras el zoom cambia (pellizco) se reutiliza la imagen anterior escalada; se repinta al parar 0,3 s */if(Math.abs(s-ZS)>1e-4){ZS=s;ZT=T}if(e&&e.sq!==sq&&T-ZT<.3&&e.kb===kb&&e.bx[0]===bx[0]&&e.bx[1]===bx[1]){blit(c,e);return true}
 const fresh=e&&e.k===k&&e.bx[0]===bx[0]&&e.bx[1]===bx[1]&&(T-e.t<per||budget<=0);
 if(!fresh&&budget<=0&&e&&e.kb===kb&&e.bx[0]===bx[0]&&e.bx[1]===bx[1]){/* sin cupo de repintado este fotograma: se usa la imagen anterior (otro zoom o fotograma de animación) en vez de dibujarlo entero */blit(c,e);return true}
 if(!fresh){if(budget<=0)return false;budget--;if(window.PERFC)PERFC.ed++;const an=animated(b,bx),tb=tbox(b,bx);
  const W=Math.ceil((tb[2]-tb[0])*sq),H=Math.ceil((tb[3]-tb[1])*sq);
  if(ATL_ON&&!an){/* solo los edificios quietos van al atlas: repintar a menudo una página ya dibujada obliga al navegador a copiarla entera *//* mismo tamaño que antes: se repinta en su hueco; si no, hueco nuevo (y si el atlas se llena, se vacía y se rehace poco a poco) */
   let sl=e&&e.sl&&e.W===W&&e.H===H?e.sl:null;if(!sl){if(e&&e.sl)e.sl=null;sl=alloc(W,H);if(!sl&&T-(window.__cmpT||-9)>1){window.__cmpT=T;compact();sl=alloc(W,H)}}
   if(sl){paintAtlas(b,sq,tb,sl);if(e&&e.cv)px-=e.cv.width*e.cv.height;e={k,kb,sq,bx,tb,sl,W,H,t:T,an};C.set(b.id,e)}
   else{/* el atlas está lleno: este edificio usa su propio lienzo, como antes */const cv=paint(b,sq,tb,e&&e.cv);if(e&&e.cv)px-=e.cv.width*e.cv.height;e={k,kb,sq,bx,tb,cv,W:cv.width,H:cv.height,t:T,an};C.set(b.id,e);px+=cv.width*cv.height}}
  else{const cv=paint(b,sq,tb,e&&e.cv);if(e&&e.cv)px-=e.cv.width*e.cv.height;e={k,kb,sq,bx,tb,cv,W:cv.width,H:cv.height,t:T,an};C.delete(b.id);C.set(b.id,e);px+=cv.width*cv.height;
   while(px>MAXPX&&C.size>1){const[fk,fv]=C.entries().next().value;if(fk===b.id)break;C.delete(fk);if(fv.cv)px-=fv.cv.width*fv.cv.height}}}
 else if(!e.sl){C.delete(b.id);C.set(b.id,e)}
 blit(c,e);return true}catch(er){return false}};
window.bCacheClear=()=>{atlasReset();C.clear();px=0;ANIM.clear();TH.clear()};
window.atlasToggle=v=>{ATL_ON=v===undefined?!ATL_ON:!!v;atlasReset();return ATL_ON};window.bCacheStats=()=>({n:C.size,mpx:+(px/1e6).toFixed(1),anim:[...ANIM].filter(x=>x[1]).map(x=>x[0].split('|')[0]),pages:PG.length,atlas:ATL_ON,pintadosAtlas:PA,thrash:[...TH.keys()].length,off:[...TH.values()].filter(t=>t.off>T).length});
})();
