/* ===== Población: el embarazo es la vía principal. Límite según casas y herencia de roles ===== */
(function(){
'use strict';
window.pregMax=function(){try{const hs=S.bld.filter(b=>b.type==='house'&&!b.cons),h=hs.length;/* +1 embarazo por cada 2 niveles de cada casa */return Math.max(2,Math.min(6,Math.floor(h/2)))+hs.reduce((s,b)=>s+Math.floor((b.lvl||1)/2),0)}catch(e){return 2}};
const best=p=>{if(!p||!p.ps)return null;let k=null,v=0;for(const r in p.ps)if((p.ps[r]||0)>v){v=p.ps[r];k=r}return k?[k,v]:null};
window.inheritRoles=function(b,mo,fa){try{b.ps={};const xm=best(mo),xf=best(fa);
  if(xm&&xf&&xm[0]===xf[0]){const v=Math.min(7,Math.floor(xm[1]/2)+Math.floor(xf[1]/2));if(v>0)b.ps[xm[0]]=v}/* mismo rol: se suman las dos mitades (tope 7) */
  else [xm,xf].forEach(x=>{if(!x)return;const v=Math.floor(x[1]/2);if(v>0)b.ps[x[0]]=Math.max(b.ps[x[0]]||0,v)});
  const x=best(b);if(x){b.prof=x[0];b.sk=Math.max(1,x[1]);try{const t=mkP(x[0]);b.sp=t.sp}catch(e){}}else{b.ps={Recolector:1};b.prof='Recolector'}}catch(e){}};
window.inhTxt=function(b){try{const L=Object.entries(b.ps||{}).filter(e=>e[1]>0).map(e=>e[0]+' '+e[1]);return L.length?' Hereda: '+L.join(', ')+'.':''}catch(e){return''}};
/* llegada de cada persona: los fundadores y los que ya estaban no cuentan como recién llegados */
setInterval(()=>{try{if(typeof S==='undefined'||!S||!S.ppl||!S.bld||!S.bld.length)return;if(!S.arrInit){S.arrInit=1;S.ppl.forEach(p=>{if(p.arrD===undefined)p.arrD=-999});return}S.ppl.forEach(p=>{if(p.arrD===undefined)p.arrD=p.bd!==undefined?-999:S.day})}catch(e){}},1000);
window.kidBadge=function(x,cx,cy,r,baby){try{x.save();x.translate(cx,cy);const s=r/10;x.scale(s,s);x.fillStyle=baby?'#4aa3df':'#3fae7a';x.strokeStyle='#fff';x.lineWidth=1.8;x.beginPath();x.arc(0,0,10,0,7);x.fill();x.stroke();
  x.fillStyle='#fff';x.beginPath();x.arc(0,baby?-2.5:-3.5,baby?3.6:3,0,7);x.fill();
  if(baby){x.beginPath();x.ellipse(0,4.5,4.6,3.2,0,0,7);x.fill()}else{x.fillRect(-2.2,0,4.4,5.2);x.fillRect(-2.2,5,1.6,3.4);x.fillRect(.6,5,1.6,3.4)}
  x.restore()}catch(e){}};
})();
