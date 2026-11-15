/* Operaciones: el clima se ve en una escena animada (sol, lluvia, niebla o tormenta con rayos), cuánto falta para que cambie y qué efecto tiene ahora en tu pueblo. */
(function(){
'use strict';
const stat=(ic,v,l)=>`<div class="mu-st"><span>${ic}</span><b>${v}</b><small>${l}</small></div>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* efectos reales que aplica el código en cada clima */
const FX=[
 [['✔','Sin efectos: buen momento para salir de expedición','ok']],
 [['🧭','Viajes de las expediciones: +20 % de tiempo (ida y vuelta)','bad']],
 [['🎯','Torres y tiradores: −20 % de alcance','bad'],['🧟','Zombis errantes: −10 % de velocidad','good']],
 [['🌲','Madera, metal, piedra y placas solares: −25 %','bad'],['⚔','Enemigos de las misiones: +15 % más duros','bad'],['🧟','Zombis de las hordas: +12 % de velocidad','bad'],['🌾','Comida y agua: sin cambios','ok']]];
const fmt=s=>{s=Math.max(0,Math.round(s));const m=Math.floor(s/60),r=s%60;return m?m+' min'+(r>=30?' y medio':''):r+' s'};
window.advMenu=function(){
 advInit();const w=S.adv.weather||0,cl=(S.adv.clues||[]),left=S.adv.weatherLeft||0;
 show('Operaciones',`<div class="op-wx w${w}"><canvas id="opSky" width="300" height="120"></canvas><div class="op-wi"><b>${advWeatherName()}</b><small>${ADV_WEATHER[w][1]}</small><span class="op-left">Cambia en unos ${fmt(left)}</span></div></div>
  <div class="mu-h">Efecto ahora en tu pueblo</div><div class="op-fx">${FX[w].map(([i,t,k])=>`<span class="op-f ${k}"><i>${i}</i>${t}</span>`).join('')}</div>
  <div class="mu-sts">${stat('📢',S.adv.events||0,'Sucesos')}${stat('🔎',cl.length+'/4','Pistas')}</div>
  <div class="mu-tiles"><button class="mu-t" onclick="advLandmarksMenu()"><span class="mu-ti">🗺</span><span class="mu-tt"><b>Lugares especiales</b><small>Expediciones cortas con botín</small></span></button></div>
  <div class="mu-h">Historia recuperada</div>${cl.length?`<div class="mu-chips">${cl.map(c=>`<span class="mu-ch">🔎 ${esc(c)}</span>`).join('')}</div>`:'<small class="mu-mut">Aún no hay pistas. Explora lugares especiales para descubrir el origen del brote.</small>'}`);
 sky(w)};
let raf=0;
function sky(w){cancelAnimationFrame(raf);const cv=document.getElementById('opSky');if(!cv)return;const d=Math.min(2,devicePixelRatio||1),W=300,H=120;cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.scale(d,d);
 const R=(a,b)=>a+Math.random()*(b-a);const drops=Array.from({length:w===3?90:w===1?60:0},()=>({x:R(0,W),y:R(0,H),v:R(240,340),l:R(7,12)}));
 const fog=Array.from({length:w===2?6:0},(_,i)=>({y:40+i*13,x:R(0,W),v:R(6,14)*(i%2?1:-1),a:R(.12,.22)}));let flash=0,nextF=R(1.5,4),t0=performance.now(),last=t0;
 const town=c=>{c.fillStyle='#10140e';c.beginPath();c.moveTo(0,H);[[0,92],[22,92],[22,80],[40,80],[40,88],[58,88],[58,70],[66,64],[74,70],[74,88],[96,88],[96,76],[120,76],[120,90],[140,90],[140,72],[150,72],[150,60],[154,60],[154,72],[166,72],[166,86],[190,86],[190,78],[214,78],[214,92],[236,92],[236,74],[248,66],[260,74],[260,90],[300,90],[300,H]].forEach(p=>c.lineTo(p[0],p[1]));c.closePath();c.fill();
  c.fillStyle='rgba(255,200,90,.55)';[[30,85],[64,76],[104,82],[158,78],[176,80],[200,84],[246,78]].forEach(p=>c.fillRect(p[0],p[1],3,3))};
 function frame(now){if(!cv.isConnected)return;const t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000);last=now;
  const g=x.createLinearGradient(0,0,0,H);const SK=[['#3b6ea8','#f0c27a'],['#3a4654','#5f6a70'],['#59646a','#9aa3a4'],['#141a26','#2c3442']][w];g.addColorStop(0,SK[0]);g.addColorStop(1,SK[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
  if(w===0){const sx=232,sy=34;x.save();x.translate(sx,sy);x.rotate(t*.15);x.fillStyle='rgba(255,230,150,.28)';for(let i=0;i<12;i++){x.rotate(Math.PI/6);x.beginPath();x.moveTo(0,0);x.lineTo(60,-5);x.lineTo(60,5);x.closePath();x.fill()}x.restore();
   const sg=x.createRadialGradient(sx,sy,4,sx,sy,26);sg.addColorStop(0,'#fff6c8');sg.addColorStop(.5,'#ffd86a');sg.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=sg;x.beginPath();x.arc(sx,sy,26,0,7);x.fill();
   x.fillStyle='rgba(255,255,255,.75)';[[40,28,1],[120,18,.8]].forEach(([cx,cy,s],i)=>{const ox=((cx+t*6*(i+1))%(W+80))-40;cl(x,ox,cy,s)})}
  if(w>=1){x.fillStyle=w===3?'rgba(20,24,32,.9)':'rgba(90,98,106,.85)';for(let i=0;i<6;i++)cl(x,((i*62+t*(w===3?14:8))%(W+80))-40,14+(i%2)*10,1.3,x.fillStyle)}
  if(w===3){nextF-=dt;if(nextF<=0){flash=1;nextF=R(2,5)}if(flash>0){x.fillStyle=`rgba(230,235,255,${flash*.55})`;x.fillRect(0,0,W,H);if(flash>.7){x.strokeStyle='#f4f6ff';x.lineWidth=2.2;x.beginPath();let lx=R(60,240),ly=10;x.moveTo(lx,ly);while(ly<80){lx+=R(-12,12);ly+=R(8,14);x.lineTo(lx,ly)}x.stroke()}flash=Math.max(0,flash-dt*2.6)}}
  town(x);
  if(drops.length){x.strokeStyle=w===3?'rgba(190,205,230,.65)':'rgba(170,195,220,.55)';x.lineWidth=1.1;x.beginPath();drops.forEach(p=>{p.y+=p.v*dt;p.x-=p.v*dt*.18;if(p.y>H){p.y=-10;p.x=R(0,W+40)}x.moveTo(p.x,p.y);x.lineTo(p.x+p.l*.18,p.y-p.l)});x.stroke()}
  fog.forEach(f=>{f.x+=f.v*dt;if(f.x>W)f.x-=W*1.6;if(f.x<-W*.6)f.x+=W*1.6;const fg=x.createLinearGradient(0,f.y-14,0,f.y+14);fg.addColorStop(0,'rgba(220,226,228,0)');fg.addColorStop(.5,`rgba(220,226,228,${f.a})`);fg.addColorStop(1,'rgba(220,226,228,0)');x.fillStyle=fg;x.fillRect(f.x-W*.3,f.y-14,W*1.2,28)});
  raf=requestAnimationFrame(frame)}
 raf=requestAnimationFrame(frame)}
function cl(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.scale(s,s);if(col)x.fillStyle=col;x.beginPath();x.arc(0,8,10,0,7);x.arc(14,2,13,0,7);x.arc(30,8,10,0,7);x.rect(0,8,30,10);x.fill();x.restore()}
const st=document.createElement('style');st.textContent=`
.op-wx{display:flex;gap:12px;align-items:stretch;border:1px solid #3a4a34;border-radius:12px;overflow:hidden;background:#11160f}
.op-wx canvas{width:300px;height:120px;flex:none;display:block}.op-wx.w3{border-color:#5a6aa0}.op-wx.w0{border-color:#a08a3a}
.op-wi{padding:10px 12px 10px 0;display:flex;flex-direction:column;gap:4px;min-width:0}.op-wi b{font-size:18px;color:#f2d27a}.op-wi small{color:#c9d1c0;font-size:12px;line-height:1.35}
.op-left{margin-top:auto;font-size:11px;font-weight:700;color:#9fc4e8}
.op-fx{display:flex;flex-wrap:wrap;gap:6px}.op-f{display:inline-flex;gap:6px;align-items:center;font-size:12px;padding:5px 9px;border-radius:8px;border:1px solid #3a4a34;background:#161d14}
.op-f i{font-style:normal}.op-f.bad{border-color:#8a3a2a;background:#2a1612;color:#ffc2b0}.op-f.good{border-color:#3a7a3a;background:#132413;color:#bfeabf}.op-f.ok{color:#c9d1c0}
@media (max-width:700px){.op-wx{flex-direction:column}.op-wx canvas{width:100%}.op-wi{padding:8px 10px}}`;document.head.appendChild(st);
})();
