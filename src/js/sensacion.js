/* Sensación de juego (solo visual, no cambia la simulación): al construir o mejorar un edificio da un pequeño 'bote':
   se aplasta un poco y vuelve a su forma con un ligero rebote (0,4 s), anclado al suelo. Con 'Temblor de pantalla: No' no se hace. */
(function(){
'use strict';
const DUR=.4,AMP=.1,c1=1.70158,c3=c1+1,back=k=>1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);
const ob=window.bCache;if(typeof ob!=='function')return;
/* solo cuentan marcas no futuras: las partidas guardadas traen fxBuild/fxUpgrade del reloj de otra sesión */
const ok=v=>typeof v==='number'&&v<=T?v:-99;
window.bCache=function(c,b){const t0=Math.max(ok(b.fxBuild),ok(b.fxUpgrade)),k=(T-t0)/DUR;
 if(!(k>=0&&k<1)||window.SHK_STR===0)return ob.apply(this,arguments);
 const e=back(k),sx=1+AMP*(1-e),sy=1-AMP*(1-e),q=P(b.x+b.w/2,b.y+b.h/2);
 c.save();window.__popS=sx;try{c.translate(q[0],q[1]);c.scale(sx,sy);c.translate(-q[0],-q[1]);return ob.apply(this,arguments)}finally{window.__popS=0;c.restore()}};
try{bCache=window.bCache}catch(e){}
})();
