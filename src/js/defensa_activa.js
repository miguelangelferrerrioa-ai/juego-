/* ===== Defensa activa: alambrada electrificada y reflectores (estudios de Defensa) =====
   Alambrada electrificada (elec1, ayuntamiento 13): los muros y puertas de nivel 5 o más dan descargas a los zombis
   que los tocan (18 de daño por segundo, +3 por cada nivel por encima del 5). Gasta 0,15 de energía por tramo.
   Reflectores (refl1, ayuntamiento 12): de noche, torres, armas automáticas y puestos de tirador no pierden alcance
   (sin ellos, de noche ven un 40 % menos). Gastan 0,3 de energía por cada uno. Si falta energía, se apagan
   (primero la alambrada) sin apagar otros edificios. Estado: S.pw.refl / S.pw.elec (encendidos o no). */
(function(){
'use strict';
if(typeof TECH==='undefined')return;
[['refl1','Defensa','Reflectores',12,{},'De noche, torres y tiradores no pierden alcance. Gasta 0,3 de energía por torre'],
 ['elec1','Defensa','Alambrada electrificada',13,{},'Muros y puertas de nivel 5+ dan descargas a los zombis. Gasta 0,15 de energía por tramo'],
 ['moat1','Defensa','Foso con pinchos',12,{},'Desbloquea el foso: frena a los zombis que lo cruzan y les hace daño']].forEach(t=>{if(!TECH.some(q=>q[0]===t[0]))TECH.push(t)});
if(window.TECH_PRE)Object.assign(TECH_PRE,{refl1:['def2'],elec1:['def3'],moat1:['def2']});
if(window.rpFix)rpFix();
const has=id=>{try{return !!(S.tech&&S.tech[id])}catch(e){return false}};
const isW=b=>b&&(b.type==='wall'||b.type==='gate');
const isG=b=>{const d=b&&BT[b.type];return !!(d&&(d.gun||d.fire))&&b.type!=='trap'};
const segs=()=>S.bld.filter(b=>isW(b)&&b.lvl>=5&&!b.pause);
const guns=()=>S.bld.filter(b=>isG(b)&&!b.pause);
/* ---- foso con pinchos: se pinta como los muros; los zombis lo cruzan a menos de la mitad de velocidad y pierden 8 de vida por segundo ---- */
BT.moat={n:'Foso con pinchos',w:1,h:1,z:2,c:'#4a3a2a',cost:{wood:15,stone:10},lv:12,tech:'moat1',hp:500,f:'Zanja con estacas afiladas. Se pinta arrastrando el dedo, como los muros. Los zombis lo cruzan a menos de la mitad de velocidad y pierden vida mientras están dentro. La gente pasa por encima con tablones.'};
try{PAINT.moat=1}catch(e){}
try{const C=window.BCATS;if(C){const d=C.find(x=>x[0]==='def')[3];if(!d.includes('moat'))d.splice(d.indexOf('trap')+1,0,'moat')}}catch(e){}
const onMoat=o=>{const ix=Math.floor(o.x),iy=Math.floor(o.y);if(ix<0||iy<0||ix>=N||iy>=N)return false;const b=bm[occ[iy*N+ix]];return !!(b&&b.type==='moat')};
const isZ=o=>o&&o.t&&!o.n&&typeof ZT!=='undefined'&&ZT[o.t];
const oStep=window.step;if(typeof oStep==='function'){window.step=function(o,tx,ty,s){if(isZ(o)&&!o.bur&&onMoat(o))s*=.45;return oStep.call(this,o,tx,ty,s)};try{step=window.step}catch(e){}}
if(window.NB&&window.NBK){const {V,pl,line,OLC}=NBK;NB.moat={up:20,paint(c,b){const a=V(.06,.06,0),bb=V(.94,.06,0),d=V(.94,.94,0),e=V(.06,.94,0),ia=V(.2,.2,-7),ib=V(.8,.2,-7),id=V(.8,.8,-7),ie=V(.2,.8,-7);
  pl(c,[a,bb,d,e],'#5a4630',OLC,1.6);pl(c,[a,bb,ib,ia],'#2e2418');pl(c,[a,e,ie,ia],'#3a2e20');pl(c,[e,d,id,ie],'#4a3a28');pl(c,[bb,d,id,ib],'#42341f');pl(c,[ia,ib,id,ie],'#241c12');
  c.fillStyle='rgba(60,70,50,.55)';c.beginPath();const m=V(.5,.5,-7);c.ellipse(m[0],m[1],9,4,0,0,7);c.fill();
  for(const [u,v] of[[.32,.32],[.66,.36],[.36,.66],[.68,.68],[.5,.5]]){const p=V(u,v,-6),t=[p[0]+3,p[1]-15];line(c,p,t,OLC,3.2);line(c,p,t,'#b08a58',1.8);line(c,[t[0]-.6,t[1]+3],t,'#e6d6b0',1.2)}}};}
/* ---- energía ---- */
const oPC=window.powCalc;if(typeof oPC==='function'){window.powCalc=function(){const P=oPC.apply(this,arguments);try{
  let av=Math.max(0,P.sup-P.used);P.refl=0;P.elec=0;P.xd=0;
  if(has('refl1')){const d=Math.round(guns().length*.3*10)/10;P.dem+=d;P.xd+=d;if(av>=d){av-=d;P.used+=d;P.refl=1}}
  if(has('elec1')){const d=Math.round(segs().length*.15*10)/10;P.dem+=d;P.xd+=d;if(av>=d){av-=d;P.used+=d;P.elec=1}}}catch(e){}return P};try{powCalc=window.powCalc}catch(e){}}
const pw=()=>{try{return S.pw||{}}catch(e){return{}}};
window.REFL=()=>has('refl1')&&!!pw().refl;
const ELEC=()=>has('elec1')&&!!pw().elec;window.ELEC=ELEC;
/* ---- descargas ---- */
let acc=0;const ZAP=[];
const near=(z)=>{const ix=Math.floor(z.x),iy=Math.floor(z.y);let best=null,bd=.95;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const x=ix+i,y=iy+j;if(x<0||y<0||x>=N||y>=N)continue;const b=bm[occ[y*N+x]];if(!isW(b)||b.lvl<5||b.pause)continue;
  const dx=Math.max(b.x-z.x,0,z.x-(b.x+b.w)),dy=Math.max(b.y-z.y,0,z.y-(b.y+b.h)),d=Math.hypot(dx,dy);if(d<bd){bd=d;best=b}}return best};
const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{acc+=dt;if(acc<.25)return r;const k=Math.min(acc,.5);acc=0;
  for(let i=ZAP.length-1;i>=0;i--){ZAP[i].t-=k;if(ZAP[i].t<=0)ZAP.splice(i,1)}
  if(S&&Z.length&&S.bld.some(b=>b.type==='moat'))Z.forEach(z=>{if(!z.act||z.hp<=0||z.bur||!onMoat(z))return;z.hp-=8*k;if(Math.random()<k*.8)try{burst(z.x,z.y,2,'#8a1a14',1,5)}catch(e){}});
  if(!S||!Z.length||!ELEC())return r;
  Z.forEach(z=>{if(!z.act||z.hp<=0||z.bur)return;const b=near(z);if(!b)return;z.hp-=(18+3*(b.lvl-5))*k;z.shk=T;
   if(ZAP.length<40)ZAP.push({x:z.x,y:z.y,bx:Math.max(b.x,Math.min(b.x+b.w,z.x)),by:Math.max(b.y,Math.min(b.y+b.h,z.y)),t:.3,s:Math.random()*99})})}catch(e){}return r};
try{upd=window.upd}catch(e){}
window.__zap=ZAP;
/* ---- dibujo: chispazos y haces de luz ---- */
const night=()=>{try{const t=S.dayT/600;return t>=.78||t<.04||(window.horde&&horde.night)}catch(e){return false}};
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{if(!S||!S.bld||!S.bld.length)return r;
  const rf=window.REFL()&&night(),zp=ZAP.length;if(!rf&&!zp)return r;
  const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);c.globalCompositeOperation='lighter';
  if(rf){const G=guns().slice(0,40),vx0=cam.x-200,vx1=cam.x+innerWidth/cam.z+200,vy0=cam.y-200,vy1=cam.y+innerHeight/cam.z+260;
   G.forEach(b=>{const cx=b.x+b.w/2,cy=b.y+b.h/2,o=P(cx,cy);if(o[0]<vx0||o[0]>vx1||o[1]<vy0||o[1]>vy1)return;const zt=Math.min(60,(BT[b.type].z||30)+6);
    let a=T*.45+b.id*1.7,L=4.6;const tz=Z.length?Z.reduce((m,z)=>{if(!z.act||z.hp<=0)return m;const d=Math.hypot(z.x-cx,z.y-cy);return d<7&&(!m||d<m.d)?{z,d}:m},null):null;
    if(tz){a=Math.atan2(tz.z.y-cy,tz.z.x-cx);L=Math.max(1.5,tz.d)}
    const ex=cx+Math.cos(a)*L,ey=cy+Math.sin(a)*L,e=P(ex,ey),pe=[-(e[1]-o[1]),e[0]-o[0]],pl=Math.hypot(pe[0],pe[1])||1,w=22+L*6,s=[o[0],o[1]-zt];
    const g=c.createLinearGradient(s[0],s[1],e[0],e[1]);g.addColorStop(0,'rgba(255,250,215,.32)');g.addColorStop(1,'rgba(255,250,215,.04)');c.fillStyle=g;
    c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(e[0]+pe[0]/pl*w,e[1]+pe[1]/pl*w*.5);c.lineTo(e[0]-pe[0]/pl*w,e[1]-pe[1]/pl*w*.5);c.closePath();c.fill();
    const sg=c.createRadialGradient(e[0],e[1],0,e[0],e[1],w*1.1);sg.addColorStop(0,'rgba(255,250,215,.28)');sg.addColorStop(1,'rgba(255,250,215,0)');c.fillStyle=sg;c.beginPath();c.ellipse(e[0],e[1],w*1.1,w*.55,0,0,7);c.fill();
    c.fillStyle='rgba(255,250,220,.9)';c.beginPath();c.arc(s[0],s[1],2.6,0,7);c.fill()})}
  ZAP.forEach(q=>{const a=P(q.bx,q.by),b2=P(q.x,q.y),A=[a[0],a[1]-18],B=[b2[0],b2[1]-14],al=Math.min(1,q.t/.3);
   c.strokeStyle='rgba(140,200,255,'+(.9*al)+')';c.lineWidth=3.2;c.beginPath();c.moveTo(A[0],A[1]);for(let i=1;i<6;i++){const t=i/6,j=(Math.sin(q.s+i*7.3+T*40)*7);c.lineTo(A[0]+(B[0]-A[0])*t+j,A[1]+(B[1]-A[1])*t+j*.5)}c.lineTo(B[0],B[1]);c.stroke();
   c.strokeStyle='rgba(240,250,255,'+al+')';c.lineWidth=1.3;c.stroke();
   const gl=c.createRadialGradient(B[0],B[1],0,B[0],B[1],26);gl.addColorStop(0,'rgba(150,210,255,'+(.6*al)+')');gl.addColorStop(1,'rgba(150,210,255,0)');c.fillStyle=gl;c.beginPath();c.arc(B[0],B[1],26,0,7);c.fill()});
  c.restore()}catch(e){}return r};try{render=window.render}catch(e){}}
/* ---- guía ---- */
try{const i=GD.findIndex(g=>g[0]==='Zombis y defensa');if(i>=0){const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}try{const a=has('refl1'),b=has('elec1');
  h+='<p>'+(a?'<b>🔦 Reflectores</b> (estudio de Defensa): de noche, torres, armas automáticas y tiradores no pierden alcance (sin ellos ven un 40 % menos). Gastan 0,3 de energía por torre.':'<b>🔦 ???</b>: un estudio de Defensa para ver mejor de noche.')+'</p>';
  h+='<p>'+(has('moat1')?'<b>🕳 Foso con pinchos</b> (estudio de Defensa): zanja con estacas que se pinta como los muros. Los zombis lo cruzan a menos de la mitad de velocidad y pierden 8 de vida por segundo dentro. La gente pasa por encima sin problema. Va bien delante de los muros.':'<b>🕳 ???</b>: un estudio de Defensa para frenar a los zombis antes de los muros.')+'</p>';
  h+='<p>'+(b?'<b>⚡ Alambrada electrificada</b> (estudio de Defensa): los muros y puertas de nivel 5 o más dan descargas a los zombis que los tocan (18 de daño por segundo, +3 por nivel por encima del 5). Gastan 0,15 de energía por tramo.':'<b>⚡ ???</b>: un estudio de Defensa para que los muros se defiendan solos.')+'</p><p>Si falta energía se apagan, primero la alambrada, sin apagar otros edificios.</p>'}catch(e){}return h}}}catch(e){}
})();
