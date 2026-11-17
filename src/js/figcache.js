/* Personas en caché: cada persona (y zombi) se dibujaba con ~40 trazos vectoriales en cada fotograma; en el móvil eso es lo que más cuesta.
   Ahora cada fotograma de su animación (12 posturas al andar, 8 en reposo) se pinta una vez en una imagen pequeña y se reutiliza.
   Se repinta solo si cambia su aspecto, el zoom, o cada pocos segundos. Golpes, muertes y ataques de zombi se siguen dibujando al momento. */
(function(){
'use strict';
const C=new Map();let RP=0,px=0,budget=0,lastT=-1;const MAXPX=12e6,TAU=Math.PI*2,BX0=-29,BY0=-48,BW=58,BH=54;
/* desactivado: en el móvil iba peor (cientos de lienzos pequeños); se deja para probar con FIGC_ON=true */window.FIGC_ON=false;
const orig=window.fig;
function look(id){if(!id||typeof byId!=='function')return '';const p=byId(id);if(!p)return '';
 return (p.outfit||'')+'|'+(p.arm||'')+'|'+(p.wp?p.wp.n:'')+'|'+(p.prof||'')+'|'+(p.gear?JSON.stringify(p.gear):'')+'|'+(p.look?JSON.stringify(p.look):'')+'|'+(p.age>=55?2:p.age<18?1:0)+(p.sex||'')}
window.fig=function(x,y,col,sc,wkg,hd,gun,dx,role,act,id){
 const c=window.g;
 if(!window.FIGC_ON||!c||!c.canvas||c.canvas.id!=='c'||FL||act==6||(role==='zom'&&act==2)||!isFinite(x)||!isFinite(y))return orig.apply(this,arguments);
 try{if(T!==lastT){lastT=T;budget=24}
  const id0=id||0,run=act==3,sp=run?15:9;let ph,ix,n;
  /* fase de la animación cuantizada; luego se pinta con un T que da justo esa fase */
  if(wkg){n=12;ph=((T*sp+x*3+id0)%TAU+TAU)%TAU;ix=Math.floor(ph/TAU*n)}else{n=8;ph=((T*6+id0)%TAU+TAU)%TAU;ix=Math.floor(ph/TAU*n)}
  const tf=c.getTransform(),s0=Math.hypot(tf.a,tf.b),sq=Math.min(4,Math.pow(2,Math.ceil(Math.log2(Math.max(.25,s0))*3)/3));
  const a=arguments,k=[role,col,sc,wkg?1:0,hd,gun?String(gun).slice(0,24):0,dx<0?1:0,act,id0,a[11],a[12]?1:0,a[13]?1:0,ix,sq,EXP,SXF,OLDF,KIDF,WPN,(typeof ZV!=='undefined'?ZV:0),window.BCOL||'',look(id)].join('~');
  const q=P(x,y);let e=C.get(k);
  if(!e||T-e.t>6){if(budget<=0)return orig.apply(this,arguments);budget--;RP++;
   const W=Math.ceil(BW*sq),H=Math.ceil(BH*sq);let cv=e&&e.cv;if(cv&&cv.width===W&&cv.height===H){const x0=cv.getContext('2d');x0.setTransform(1,0,0,1,0,0);x0.clearRect(0,0,W,H)}else{cv=document.createElement('canvas');cv.width=W;cv.height=H}
   const o=cv.getContext('2d');o.setTransform(sq,0,0,sq,-(q[0]+BX0)*sq,-(q[1]+BY0)*sq);
   const T0=T,phq=(ix+.5)/n*TAU;T=wkg?(phq-x*3-id0)/sp:(phq-id0)/6;window.g=o;
   try{orig.apply(this,arguments)}finally{T=T0;window.g=c}
   if(e)px-=e.cv.width*e.cv.height;e={cv,t:T};C.delete(k);C.set(k,e);px+=W*H;
   while(px>MAXPX&&C.size>1){const [fk,fv]=C.entries().next().value;C.delete(fk);px-=fv.cv.width*fv.cv.height}}
  c.drawImage(e.cv,q[0]+BX0,q[1]+BY0,BW,BH)}catch(er){try{window.g=c}catch(e2){}return orig.apply(this,arguments)}};
try{fig=window.fig}catch(e){}
window.figCacheStats=()=>({n:C.size,mpx:+(px/1e6).toFixed(2),repintados:RP});
})();
