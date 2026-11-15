/* Expedición solitaria: escena animada (el superviviente camina por un paisaje que se desplaza) + panel compacto. */
(function(){
'use strict';
const oStep=window.soloStep;window.soloStep=function(){window._soloBurst=performance.now();return oStep.apply(this,arguments)};
const oPick=window.soloPick;window.soloPick=function(){window._soloBurst=performance.now();return oPick.apply(this,arguments)};
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb=a=>`rgb(${a[0]},${a[1]},${a[2]})`;
window._ss=window._ss||{x:0,ph:0,t:0,run:false};
function person(c,p,ph,moving,flip){const l=p.look||{},skin=SKINS[l.skin||0]||SKINS[0],hair=HAIRS[l.hair||0]||HAIRS[0],shirt=l.shirt||PC[p.prof]||'#647d4b';
  c.save();if(flip)c.scale(-1,1);c.lineCap='round';
  const sw=moving?Math.sin(ph)*.75:0,bob=moving?Math.abs(Math.sin(ph))*2.2:0;
  c.fillStyle='#0004';c.beginPath();c.ellipse(0,1,13,3.2,0,0,7);c.fill();
  c.translate(0,-bob);
  const leg=(a,col)=>{c.save();c.translate(0,-17);c.rotate(a);c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(0,16);c.stroke();c.strokeStyle='#222';c.lineWidth=5;c.beginPath();c.moveTo(0,16);c.lineTo(3,16);c.stroke();c.restore()};
  leg(-sw,'#2f3a44');
  c.fillStyle='#4a3a28';c.beginPath();c.roundRect(-13,-38,9,18,3);c.fill();/* mochila */
  c.fillStyle=shirt;c.beginPath();c.roundRect(-6,-39,12,23,4);c.fill();
  c.save();c.translate(0,-35);c.rotate(sw);c.strokeStyle=shirt;c.lineWidth=4.5;c.beginPath();c.moveTo(0,0);c.lineTo(0,12);c.stroke();c.strokeStyle=skin;c.beginPath();c.moveTo(0,12);c.lineTo(0,15);c.stroke();c.restore();
  leg(sw,'#3a4752');
  c.fillStyle=skin;c.beginPath();c.arc(1,-46,6.5,0,7);c.fill();
  c.fillStyle=hair;c.beginPath();c.arc(0,-47,6.8,Math.PI*1.05,Math.PI*2.1);c.fill();
  c.fillStyle='#111';c.fillRect(4,-47,1.6,1.6);
  c.restore()}
let lastT=0;
function tick(now){requestAnimationFrame(tick);const cv=document.getElementById('soloscene');if(!cv||typeof S==='undefined'||!S||!S.solo)return;
  const p=byId(S.solo.id);if(!p)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height,s=S.solo,st=window._ss;
  const dt=Math.min(.1,(now-(lastT||now))/1000);lastT=now;
  const pend=!!s.pend,ret=!!s.returning,idle=pend||(s.step===0&&!ret),burst=performance.now()-(window._soloBurst||0)<1200;
  st.x+=(idle?0:burst?110:34)*dt*(ret?-1:1);st.ph+=dt*(burst?13:8)*(idle?0:1);
  c.clearRect(0,0,W,H);const gy=H-16;c.fillStyle='#fff2';for(let i=-1;i<W/24+2;i++){c.fillRect(i*24-(((st.x%24)+24)%24),gy+5,11,2)}
  c.save();c.translate(W/2,gy);c.scale(.95,.95);person(c,p,st.ph,!idle,ret);c.restore();
  if(pend){c.font='bold 18px sans-serif';c.textAlign='center';c.fillStyle='#e8c25a';c.fillText('❗',W/2,14+Math.sin(now/200)*2)}}
requestAnimationFrame(tick);
const chip=(ic,t)=>`<span class="bch">${ic} ${t}</span>`;
window.soloView=function(){const s=S.solo,p=s&&byId(s.id);if(!p){S.solo=null;return}
  const lootC=Object.keys(s.loot).filter(k=>s.loot[k]>0).map(k=>chip(`<img src="${ICO[k]||''}" width=13>`,'+'+Math.round(s.loot[k]))).concat(s.items.map(i=>chip('⚔',i.n)),s.surv?[chip('👤','+'+s.surv)]:[],s.kit?[chip('💉',s.kit)]:[],s.tech.map(i=>chip('📐',TECH.find(q=>q[0]==i)[2])),s.dog?[chip('🐕','')]:[]);
  const pd=s.pend?CH[s.pend.i]:null,chance=Math.max(0,100-Math.floor(s.step/5)*10),canHeal=(s.kit>0||S.res.meds>0)&&p.hp<mhp(p)-1&&!s.returning,hpP=p.hp/mhp(p)*100;
  let ctl='';
  if(s.returning)ctl=`<div class="dcard">🚶 <b>Regresando a la ciudad…</b><br><small>Llegará al empezar el día ${s.returnDay}. Seguirá fuera hasta entonces.</small></div>`;
  else if(pd)ctl=`<div class="sbtn"><button class="bup" onclick="soloPick(0)">${pd.a}</button><button onclick="soloPick(1)">${pd.b}</button>${canHeal?`<button onclick="soloUse()">💉 Curar</button>`:''}</div>`;
  else ctl=`<div class="sbtn">${s.step<s.max?`<button class="bup" onclick="soloStep()">▶ Seguir adelante</button>`:''}${canHeal?`<button onclick="soloUse()">💉 Curar +35</button>`:''}<button onclick="soloRequestReturn()">${s.step?'🏠 Regresar':'✖ Cancelar'}</button></div>`;
  const logs=s.log.slice(-4,pd?undefined:-1);
  show('Expedición solitaria',`<div class="sgrid">
   <div class="sleft"><canvas id="soloscene" width="150" height="104"></canvas><b>${p.n}</b><small>${p.prof}</small><div class="bbar"><i style="width:${Math.max(0,hpP)}%;background:${hpP>60?'#5c5':hpP>30?'#dc4':'#d44'}"></i></div><div class="sch">${chip('❤',Math.round(p.hp)+'/'+mhp(p))}${chip('🏠',chance+'%')}</div></div>
   <div class="sright"><div class="sbar"><span>🏠</span><div class="bbar"><i style="width:${s.step/s.max*100}%;background:#e8c25a"></i></div><span>🏁</span><b>${s.step}/${s.max}</b></div>
   <div class="dcard sev">${s.txt}</div>${ctl}
   <div class="bchs sloot">${lootC.join('')||'<small class="bsub">Aún no has recogido nada</small>'}</div>${logs.length?`<details class="slog"><summary>Registro</summary>${logs.map(l=>`<p>${l}</p>`).join('')}</details>`:''}</div></div>`);
  paintCards()};
})();
