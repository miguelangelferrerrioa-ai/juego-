/* ===== Dead Town · gasolina: botín, pozos sobre yacimientos y coste de expediciones, misiones y operaciones ===== */
(function(){
/* ---- recurso ---- */
if(!RK.some(r=>r[0]==='gas')){RK.push(['gas','Gasolina','#e0a030']);RN.gas='gasolina';IV.gas=120;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.fillStyle='#e0a030';x.strokeStyle='#111';x.lineWidth=1.5;
 x.beginPath();x.moveTo(4,6);x.lineTo(12,6);x.lineTo(16,3);x.lineTo(16,17);x.lineTo(4,17);x.closePath();x.fill();x.stroke();x.fillStyle='#1c1405';x.fillRect(7,9,6,2);x.fillRect(9,7,2,6);ICO.gas=c.toDataURL()}
/* ---- edificio: pozo petrolífero ---- */
BT.oilp={n:'Pozo petrolífero',w:3,h:3,z:70,c:'#3a3a3e',cost:{wood:300,metal:260},lv:3,hp:300,p:{gas:6},oil:1,job:['Mecánico','Recolector'],slots:3,f:'Solo sobre un yacimiento de petróleo. Extrae gasolina para expediciones, misiones y operaciones.'};
try{SIGNT.oilp='PETRÓLEO';MAT.oilp='metal'}catch(e){}
const K=NBK,{V,vol,crate,post,line}=K;
NB.oilp={up:110,paint(c,b){
 vol(c,{x:-.05,y:-.05,w:3.1,h:3.1,z:2.4,col:'#2b2a2c',mat:'block',seed:1});
 vol(c,{x:.15,y:.15,w:1.0,h:1.0,z:3.6,z0:2.4,col:'#4a4a50',mat:'block',seed:2});
 for(const[u,v]of[[1.15,1.15],[1.85,1.15],[1.15,1.85],[1.85,1.85]])post(c,u,v,2.4,74,'#8a6a34');
 for(const z of[22,40,58]){line(c,V(1.15,1.15,z),V(1.85,1.15,z),'#6a4b2e',1.4);line(c,V(1.15,1.85,z),V(1.85,1.85,z),'#6a4b2e',1.4);line(c,V(1.15,1.15,z),V(1.15,1.85,z),'#6a4b2e',1.4);line(c,V(1.85,1.15,z),V(1.85,1.85,z),'#6a4b2e',1.4)}
 line(c,V(1.15,1.15,2.4),V(1.85,1.85,22),'#6a4b2e',1.1);line(c,V(1.85,1.15,22),V(1.15,1.85,40),'#6a4b2e',1.1);line(c,V(1.15,1.15,40),V(1.85,1.85,58),'#6a4b2e',1.1);
 vol(c,{x:1.1,y:1.1,w:.8,h:.8,z:6,z0:74,col:'#5a5f66',mat:'block',seed:3});
 line(c,V(1.5,1.5,74),V(1.5,1.5,6),'#cfc8a8',1.2);
 vol(c,{x:2.0,y:.2,w:.85,h:.85,z:18,z0:2.4,col:'#5d646b',mat:'block',seed:4});
 for(const[u,v,s]of[[.3,1.9,.32],[.7,2.2,.3],[.35,2.4,.3],[2.1,2.1,.34],[2.45,2.4,.3]])crate(c,u,v,2.4,s,'#2d2d32');
 crate(c,.5,.2,2.4,.4,'#8a5a22')},
 live(c,b,H){smoke(c,H.L(1.5,1.5,86))}};
/* energía, tema y categoría en el menú de construir */
/* ---- yacimientos ---- */
const OK=['meadow','forest','ruins','industrial','wasteland'];
const pidOf=(x,y)=>Math.floor(y/PS)*PG+Math.floor(x/PS);
function free3(x,y){for(let i=0;i<3;i++)for(let j=0;j<3;j++){const xx=x+i,yy=y+j;if(xx<0||yy<0||xx>=N||yy>=N)return false;if(!OK.includes(biomeAt(xx,yy)))return false;if(isRoad(xx,yy))return false;if(bm[occ[yy*N+xx]])return false}return true}
function spotIn(px,py){const c=[];for(let dy=0;dy<=PS-3;dy++)for(let dx=0;dx<=PS-3;dx++)c.push([px*PS+dx,py*PS+dy]);c.sort(()=>Math.random()-.5);for(const[x,y]of c)if(free3(x,y))return{x,y};return null}
function genOil(){
 const out=[],used=[];const want=(px,py)=>{const s=spotIn(px,py);if(s){out.push(s);used.push([px,py]);return true}return false};
 const ring=[];for(let py=1;py<=5;py++)for(let px=1;px<=5;px++)if(!(px>=2&&px<=4&&py>=2&&py<=4))ring.push([px,py]);
 ring.sort((a,b)=>(S.parc[a[1]*PG+a[0]]?1:0)-(S.parc[b[1]*PG+b[0]]?1:0)||Math.random()-.5);
 for(const[px,py]of ring){if(want(px,py))break}
 const far=[];for(let py=0;py<PG;py++)for(let px=0;px<PG;px++)if(px<1||px>5||py<1||py>5)far.push([px,py]);far.sort(()=>Math.random()-.5);
 for(const[px,py]of far){if(out.length>=6)break;if(used.some(u=>Math.max(Math.abs(u[0]-px),Math.abs(u[1]-py))<2))continue;want(px,py)}
 S.oil=out;
 /* despeja obstáculos del yacimiento */
 const before=S.obs.length;S.obs=S.obs.filter(o=>!out.some(d=>o.x>=d.x&&o.x<d.x+3&&o.y>=d.y&&o.y<d.y+3));
 if(S.obs.length!==before)setTimeout(()=>{try{rebuild()}catch(e){}},0)}
function ensure(){if(!S||!S.bld)return false;if(!S.parc)return false;if(!Array.isArray(S.oil))genOil();if(!S.gasG){S.gasG=1;S.res.gas=(S.res.gas||0)+15}return true}
window.oilSite=function(x,y,w,h){if(!ensure())return false;return w===3&&h===3&&S.oil.some(o=>Math.abs(x-o.x)<=1&&Math.abs(y-o.y)<=1)};
const OSPR={};(window.__gfxR=window.__gfxR||[]).push(()=>{for(const k in OSPR)delete OSPR[k]});
function rng(sd){let s=sd>>>0||1;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
function blob(x,cx,cy,rx,ry,k,ph){const n=20,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=k*(1+.2*Math.sin(a*3+ph[0])+.14*Math.sin(a*5+ph[1])+.09*Math.sin(a*2+ph[2]));pts.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r])}
 x.beginPath();for(let i=0;i<n;i++){const p0=pts[i],p1=pts[(i+1)%n],mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2;if(i===0)x.moveTo(mx,my);else x.quadraticCurveTo(p0[0],p0[1],mx,my)}
 const p0=pts[0],p1=pts[1];x.quadraticCurveTo(p0[0],p0[1],(p0[0]+p1[0])/2,(p0[1]+p1[1])/2);x.closePath()}
function barrel(x,bx,by,col,tilt){x.save();x.translate(bx,by);x.rotate(tilt);x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(2,13,11,4,0,0,7);x.fill();
 x.fillStyle=col;x.fillRect(-8,-12,16,24);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(2,-12,6,24);x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=1.3;x.strokeRect(-8,-12,16,24);
 x.beginPath();x.moveTo(-8,-4);x.lineTo(8,-4);x.moveTo(-8,5);x.lineTo(8,5);x.stroke();
 x.fillStyle='#2a1c12';x.beginPath();x.ellipse(0,-12,8,3.2,0,0,7);x.fill();x.stroke();x.restore()}
function oilSprite(o){const k=o.x+','+o.y;if(OSPR[k])return OSPR[k];
 const R=rng(o.x*131+o.y*17+7),ph=[R()*6,R()*6,R()*6],SC=2,W=340,H=210,cv=document.createElement('canvas');cv.width=W*SC;cv.height=H*SC;const x=cv.getContext('2d');x.scale(SC,SC);const cx=W/2,cy=H/2+6,rx=82,ry=40;
 /* suelo manchado */
 x.fillStyle='rgba(78,58,36,.42)';blob(x,cx,cy,rx,ry,1.55,ph);x.fill();
 x.fillStyle='rgba(52,38,26,.55)';blob(x,cx,cy,rx,ry,1.3,[ph[1],ph[2],ph[0]]);x.fill();
 for(let i=0;i<70;i++){const a=R()*6.28,d=Math.sqrt(R())*1.5;x.fillStyle=`rgba(${20+R()*30|0},${14+R()*20|0},10,${.18+R()*.25})`;x.beginPath();x.ellipse(cx+Math.cos(a)*rx*d,cy+Math.sin(a)*ry*d,1.5+R()*3,.8+R()*1.6,0,0,7);x.fill()}
 /* regueros */
 x.lineCap='round';for(let i=0;i<6;i++){const a=R()*6.28,sx=cx+Math.cos(a)*rx*.85,sy=cy+Math.sin(a)*ry*.85,ex=cx+Math.cos(a)*rx*(1.25+R()*.4),ey=cy+Math.sin(a)*ry*(1.25+R()*.4);x.strokeStyle='#17110d';x.lineWidth=2.5+R()*3;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo((sx+ex)/2+R()*14-7,(sy+ey)/2+R()*8-4,ex,ey);x.stroke()}
 /* charcos satélite */
 for(let i=0;i<4;i++){const a=R()*6.28,d=1.05+R()*.4,px=cx+Math.cos(a)*rx*d,py=cy+Math.sin(a)*ry*d,s=.16+R()*.14;x.fillStyle='#3a2d1f';blob(x,px,py,rx,ry,s*1.25,[R()*6,R()*6,R()*6]);x.fill();x.fillStyle='#0f0b09';blob(x,px,py,rx,ry,s,[R()*6,R()*6,R()*6]);x.fill()}
 /* charco principal */
 x.fillStyle='#4a3826';blob(x,cx,cy,rx,ry,1.04,ph);x.fill();
 x.fillStyle='#17110d';blob(x,cx,cy,rx,ry,.95,ph);x.fill();
 const g=x.createRadialGradient(cx-14,cy-8,4,cx,cy,rx);g.addColorStop(0,'#241a14');g.addColorStop(1,'#080605');x.fillStyle=g;blob(x,cx,cy,rx,ry,.84,[ph[2],ph[0],ph[1]]);x.fill();
 x.strokeStyle='rgba(255,255,255,.2)';x.lineWidth=1.6;x.beginPath();x.ellipse(cx-26,cy-12,22,6,-.25,3.4,5.6);x.stroke();x.beginPath();x.ellipse(cx+30,cy+9,14,4,-.2,.2,2.4);x.stroke();
 /* atrezo */
 for(let i=0;i<9;i++){const a=R()*6.28,d=1.2+R()*.5,tx=cx+Math.cos(a)*rx*d,ty=cy+Math.sin(a)*ry*d;x.strokeStyle='#7a6a3a';x.lineWidth=1.2;for(let j=0;j<4;j++){x.beginPath();x.moveTo(tx,ty);x.lineTo(tx+j*2.2-3,ty-5-R()*5);x.stroke()}}
 for(let i=0;i<5;i++){const a=R()*6.28,d=1.3+R()*.35,tx=cx+Math.cos(a)*rx*d,ty=cy+Math.sin(a)*ry*d,s=3+R()*4;x.fillStyle='#6f6c66';x.beginPath();x.ellipse(tx,ty,s*1.3,s*.8,0,0,7);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.ellipse(tx-1,ty-1.5,s*.7,s*.3,0,0,7);x.fill()}
 const bc=['#7a4a2a','#4f6272','#8a3a28','#5a5f3a'];[[-1,.55],[1,.8],[-.2,1.35]].forEach(([sx,sy],i)=>{if(R()<.85)barrel(x,cx+sx*rx*1.12+R()*8-4,cy+sy*ry*1.05*(sx<0?1:-1)*(i===2?-1:1)+4,bc[(R()*4)|0],(R()-.5)*.6)});
 return OSPR[k]={cv,cx,cy,W,H,ph}}
window.drawOil=function(c){if(!ensure())return;
 S.oil.forEach(o=>{if(!vis(o.x+1.5,o.y+1.5,170))return;
  const built=S.bld.some(b=>b.type==='oilp'&&Math.abs(b.x-o.x)<=1&&Math.abs(b.y-o.y)<=1),q=P(o.x+1.5,o.y+1.5),sp=oilSprite(o);
  c.drawImage(sp.cv,q[0]-sp.cx,q[1]-sp.cy,sp.W,sp.H);
  c.save();
  if(!built){
   /* brillo irisado y burbujas de alquitrán */
   const sh=.2+.1*Math.sin(T*1.5+o.x);c.save();c.beginPath();c.ellipse(q[0],q[1],62,28,0,0,7);c.clip();
   const g=c.createLinearGradient(q[0]-60+Math.sin(T*.5)*20,q[1]-20,q[0]+60,q[1]+20);g.addColorStop(0,`rgba(130,70,210,${sh})`);g.addColorStop(.45,`rgba(40,190,150,${sh})`);g.addColorStop(.75,`rgba(230,170,50,${sh})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(q[0]-70,q[1]-32,140,64);c.restore();
   for(let i=0;i<3;i++){const t=(T*.35+i/3+o.x*.13)%1,bx=q[0]+Math.sin(i*2.7+o.y)*38,by=q[1]+Math.cos(i*3.1+o.x)*13;
    if(t<.8){const r=1+t*5;c.strokeStyle=`rgba(120,110,100,${.6*(1-t)})`;c.fillStyle=`rgba(60,50,45,${.5})`;c.lineWidth=1.2;c.beginPath();c.ellipse(bx,by-t*3,r,r*.6,0,0,7);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.4)';c.fillRect(bx-r*.4,by-t*3-r*.4,1.5,1)}
    else{const r=7*(t-.8)/.2*1.2;c.strokeStyle=`rgba(150,140,130,${.5*(1-(t-.8)/.2)})`;c.lineWidth=1.2;c.beginPath();c.ellipse(bx,by,r+4,(r+4)*.55,0,0,7);c.stroke()}}
   const bob=Math.sin(T*2.2+o.y)*2.5;c.translate(q[0],q[1]-52+bob);c.fillStyle='#e0a030';c.strokeStyle='#111';c.lineWidth=2;c.beginPath();c.moveTo(0,-12);c.quadraticCurveTo(11,2,0,10);c.quadraticCurveTo(-11,2,0,-12);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-3,1,2,4,0,0,7);c.fill()}
  c.restore()})};
/* ---- coste de gasolina ---- */
const COST_SOLO=4,COST_OP=3;
function exCost(){let g=3;try{if(exTab=='hist'&&exC!==undefined)g=STORY[exC].g;else if(exTab=='world'&&exZ!==undefined)g=EXT_ZONES[exZ].g;else if(exZ!==undefined)g=ZN[exZ].g}catch(e){}return 3+2*(g||1)}
window.gasCost={team:exCost,solo:()=>0,op:()=>COST_OP};
const need=(c,what)=>{if((S.res.gas||0)>=c)return true;toast('Necesitas '+c+' de gasolina para '+what+' (tienes '+Math.floor(S.res.gas||0)+'). Encuéntrala en botines o construye un pozo petrolífero sobre un yacimiento.');return false};
const oEx=window.exGo;window.exGo=function(){if(S.exp)return oEx.apply(this,arguments);const c=exCost();
 const had=S.exp;const ready=(()=>{try{const zz=exTab=='hist'?exC!==undefined:exZ!==undefined;return zz&&exSel.length}catch(e){return false}})();
 if(ready&&!need(c,'esta expedición'))return;oEx.apply(this,arguments);if(S.exp&&!had){S.res.gas-=c;S.exp.gas=c}};
/* el explorador solitario no tiene coste (ni gasolina) */
const oAd=window.advExplore;window.advExplore=function(i){advInit();const q=S.adv.landmarks[i];if(!q||q.done||q.day>S.day)return oAd.apply(this,arguments);if(!need(COST_OP,'esta operación'))return;oAd.apply(this,arguments);if(q.done)S.res.gas-=COST_OP};
const oCt=window.cancelTravel;if(oCt)window.cancelTravel=function(){const e=S.exp,g=e&&e.gas;oCt.apply(this,arguments);if(g&&!S.exp){S.res.gas=(S.res.gas||0)+g;toast('Se te devuelven '+g+' de gasolina.')}};
/* aviso de coste en los paneles de expedición, misión y operación */
const oShow=window.show;window.show=function(t,h){if(typeof h==='string'&&/exGo\(\)|soloGo\(|advExplore\(/.test(h)){const g=Math.floor(S.res.gas||0),low=g<COST_OP;
  h=`<div class="gas-b ${low?'low':''}"><img src="${ICO.gas}" width=16> <b>Gasolina: ${g}</b><small>Expedición ${exCost()} · Explorador gratis · Operación ${COST_OP}</small></div>`+h}return oShow.call(this,t,h)};
/* ---- botín ---- */
try{ZN.forEach((z,i)=>{if(z.l&&i%3===2&&!z.l.gas)z.l.gas=[3,8]})}catch(e){}
try{EXT_ZONES.forEach((z,i)=>{if(z.loot&&i%2===0&&!z.loot.gas)z.loot.gas=[3,8]})}catch(e){}
try{MS.forEach(m=>{if(m[3]==='Principal'&&m[2]&&!m[2].gas)m[2]=Object.assign({},m[2],{gas:6})})}catch(e){}
const oLw=window.lootWreck;window.lootWreck=function(ob){const r=oLw.apply(this,arguments);let t='';if(Math.random()<.45){const v=Math.max(1,Math.round(ri(2,6)*(1+S.ppl.filter(p=>p.prof=='Recolector').length*.2)));S.res.gas=(S.res.gas||0)+v;t=', +'+v+' gasolina'}return r+t};
/* ---- guía ---- */
try{const G=window.GD||GD,at=Math.max(0,G.findIndex(q=>q[0]==='Edificios'));
G.splice(at,0,['Gasolina',()=>'<p>La <b>gasolina</b> se gasta al salir de la base: <b>expediciones y misiones</b> (3 + 2 por nivel de peligro del destino); el <b>explorador solitario</b> es gratis; y las <b>operaciones</b> o lugares especiales (3). Si cancelas el viaje antes de llegar, se te devuelve.</p><p>Se consigue de dos formas: en <b>botines</b> (restos de vehículos, algunas expediciones y misiones principales) o construyendo un <b>Pozo petrolífero</b>.</p><p>El pozo solo se puede construir <b>sobre un yacimiento</b>: manchas negras con una gota dorada que verás en el mapa. Hay varios repartidos por el mundo, y <b>uno está justo al lado de tu territorio inicial</b>; compra esa parcela para poder construir encima. Un pozo consume energía y da más gasolina cuanto mayor es su nivel.</p>']);
}catch(e){console.error('guia gasolina',e)}
const st=document.createElement('style');st.textContent='.gas-b{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#241f12;border:1px solid #6a5a1a;border-radius:10px;padding:6px 10px;margin:0 0 8px;font-size:13px;color:#ffe9a8}.gas-b small{opacity:.7}.gas-b.low{background:#2c1a16;border-color:#8a3a2a;color:#ffb3a8}';document.head.appendChild(st);
})();
