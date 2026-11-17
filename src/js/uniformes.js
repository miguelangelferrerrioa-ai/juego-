/* Uniformes: los civiles visten ropa de trabajo con el color de su oficio y el verde militar queda solo para los alistados, que además llevan casco y chaleco con cartucheras. Los que tienen atuendo siguen con su atuendo. */
(function(){
'use strict';
const WORK={'Médico':'#d4d8d2','Cocinero':'#e6dfcb','Constructor':'#c9952c','Agricultor':'#7d5c36','Explorador':'#3f6a86','Mecánico':'#40507e','Recolector':'#8c5a3a','Científico':'#3b8080','Soldado':'#6e6a61'};
const MIL='#55603a',MILD='#3a4228';
const dark=(h,k)=>{const n=parseInt(h.slice(1),16),c=v=>Math.max(0,Math.round(v*k)).toString(16).padStart(2,'0');return '#'+c(n>>16)+c((n>>8)&255)+c(n&255)};
let curSol=false;
function pick(p){if(!p||p.outfit)return null;if(p.arm)return [MIL,MILD,1];const c=WORK[p.prof];return c?[c,dark(c,.68),0]:null}
const of=window.fig;
window.fig=function(){let a=arguments;const role=a[8],id=a[10];if(role==='ban'||role==='zom'||!id||typeof byId!=='function')return of.apply(this,a);
 const p=byId(id);/* alistado sin arma: sin fusil en la mano */if(p&&p.arm&&(!p.wp||(window.isMelee&&isMelee(p.wp)))&&a[6]){a=Array.from(a);a[6]=0}const u=pick(p);if(!u)return of.apply(this,a);const sv=[SUIT,SUITD],sc=curSol;SUIT=u[0];SUITD=u[1];curSol=!!u[2];
 try{const r=of.apply(this,a);if(curSol)helmet(a);return r}finally{SUIT=sv[0];SUITD=sv[1];curSol=sc}};
try{fig=window.fig}catch(e){}
/* chaleco táctico: correas cruzadas, cinturón con cartucheras y hombreras (dibujado sobre el torso) */
const oOv=window.ovFig;
window.ovFig=function(g,H,FM){if(oOv)try{oOv(g,H,FM)}catch(e){}if(!curSol)return;g.save();
 g.strokeStyle='#2b2f1e';g.lineWidth=1.1;g.beginPath();g.moveTo(-3,H+.6);g.lineTo(2.6,H+5.4);g.moveTo(3,H+.6);g.lineTo(-2.6,H+5.4);g.stroke();
 g.fillStyle='#2b2f1e';g.fillRect(-3.8,H+5.2,7.6,1.5);g.fillStyle='#4a4f33';[-2.9,-.6,1.7].forEach(x=>g.fillRect(x,H+5.5,1.6,1.9));
 g.fillStyle='#3f4a2b';g.beginPath();g.ellipse(-3.4,H+.9,1.4,1,0,0,7);g.ellipse(3.4,H+.9,1.4,1,0,0,7);g.fill();g.restore()};
/* casco: misma posición que la cabeza que dibuja fig() */
function helmet(a){try{const [x,y,,sc,wkg,,,dx,,act,id]=a,c=window.g;if(!c)return;const q=P(x,y),run=act==3,ph=T*(run?15:9)+x*3+(id||0),bob=act==6||act==11?null:wkg?Math.abs(Math.cos(ph))*(run?2.2:1.2):Math.sin(T*2+(id||0))*.35;if(bob===null)return;
 const H=-17-bob,hy=H-3.4,f=dx<0?-1:1,s=(sc||1)*1.32;c.save();c.translate(q[0],q[1]);c.scale(s*f,s);if(run)c.rotate(.1);
 const cy=hy+(hy-hy)*.74,top=hy-5*.74*1.04;c.fillStyle='#4f5a35';c.strokeStyle='#22261a';c.lineWidth=.8;c.beginPath();c.ellipse(0,hy-.9,5.2*.74*1.08,4.2*.74,0,Math.PI,0);c.lineTo(4.6*.74*1.1,hy-.6);c.lineTo(-4.6*.74*1.1,hy-.6);c.closePath();c.fill();c.stroke();
 c.fillStyle='#3a4228';c.fillRect(-4.3*.74*1.1,hy-1.2,8.6*.74*1.1,.9);c.restore()}catch(e){}}
/* retratos de las fichas: mismos colores */
const oPF=window.paintFace;
if(typeof oPF==='function')window.paintFace=function(cv,p){const u=pick(p);if(!u)return oPF.apply(this,arguments);const sv=[SUIT,SUITD];SUIT=u[0];SUITD=u[1];try{return oPF.apply(this,arguments)}finally{SUIT=sv[0];SUITD=sv[1]}};
})();
