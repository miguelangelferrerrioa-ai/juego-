/* ===== Tarjetas de desbloqueo (estilo "nuevo edificio"): al subir el ayuntamiento o descubrir algo, nombre + imagen ===== */
(function(){
'use strict';
const st=document.createElement('style');st.textContent=`
#unov{position:fixed;inset:0;z-index:8990;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(50,36,6,.86),rgba(0,0,0,.96));padding:10px;box-sizing:border-box}
#unov.on{display:flex}
#unov{overflow:auto}#unov .ub{position:relative;max-width:min(760px,96vw);margin:auto;text-align:center;animation:unpop .45s cubic-bezier(.2,1.6,.4,1)}
#unov .ray{position:absolute;left:50%;top:90px;width:520px;height:520px;margin:-260px 0 0 -260px;background:repeating-conic-gradient(rgba(242,197,66,.16) 0 9deg,transparent 9deg 22deg);border-radius:50%;animation:unspin 14s linear infinite;pointer-events:none;-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%)}
#unov .uh{position:relative;font:900 clamp(20px,4.4vw,34px)/1.05 Bahnschrift,"Arial Narrow",system-ui,sans-serif;letter-spacing:2px;color:#ffe08a;text-transform:uppercase;text-shadow:0 3px 0 #6b4a05,0 0 18px rgba(242,197,66,.6)}
#unov .us{position:relative;color:#e9e2c8;font:700 13px system-ui;letter-spacing:1.5px;text-transform:uppercase;margin:4px 0 10px;opacity:.85}
#unov .hallc{position:relative;display:block;margin:0 auto 4px;width:190px;height:150px}
#unov .ug{position:relative;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:6px 0 12px}
#unov .uc{width:128px;border-radius:12px;padding:8px 6px 9px;background:linear-gradient(#3a3020,#1b160d);border:2px solid #f2c542;box-shadow:0 6px 0 #5a420c,0 0 22px rgba(242,197,66,.35);opacity:0;animation:uncard .5s ease-out forwards}
#unov .uc.t{border-color:var(--c);box-shadow:0 6px 0 #0b1013,0 0 22px var(--c)}
#unov .uc canvas{width:112px;height:92px;display:block;margin:0 auto}
#unov .uc small{display:block;font:800 10px system-ui;letter-spacing:1.2px;color:#f2c542;text-transform:uppercase}
#unov .uc.t small{color:var(--c)}
#unov .uc b{display:block;color:#fff;font:800 14px/1.15 system-ui;margin-top:2px}
#unov button{position:relative;font:900 16px Bahnschrift,system-ui;letter-spacing:2px;text-transform:uppercase;padding:10px 34px;border-radius:10px;border:0;background:linear-gradient(#ffd25e,#e0a51e);color:#2a1a00;box-shadow:0 4px 0 #7a5208;cursor:pointer}
@keyframes unpop{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}
@keyframes unspin{to{transform:rotate(360deg)}}
@keyframes uncard{from{transform:translateY(18px) scale(.8);opacity:0}to{transform:none;opacity:1}}
@media (max-height:480px){#unov{padding:4px}#unov .uh{font-size:20px}#unov .ub.many .hallc{display:none}#unov .ub.many .us{margin:2px 0 4px}#unov .us{margin:0 0 4px;font-size:11px}#unov .hallc{width:120px;height:78px;margin:0 auto}#unov .ug{gap:6px;margin:2px 0 8px}#unov .uc{width:86px;padding:4px 3px 6px;border-radius:9px}#unov .uc canvas{width:78px;height:56px}#unov .uc small{font-size:8px;letter-spacing:.5px}#unov .uc b{font-size:11px}#unov button{padding:7px 26px;font-size:14px}#unov .ray{top:50px}}`;
document.head.appendChild(st);
const ov=document.createElement('div');ov.id='unov';document.body.appendChild(ov);
const Q=[];let open=false;
window._unOpen=false;
(function(){const o=window.upd;if(typeof o!=='function')return;window.upd=function(){if(window._unOpen)return;return o.apply(this,arguments)}})();
const hl=()=>{try{return realHall()}catch(e){try{return hallLv()}catch(x){return 1}}};
function drawBld(cv,t,lvl){try{const x=cv.getContext('2d'),d=BT[t],W=cv.width,H=cv.height,s=Math.min((W-10)/((d.w+d.h)*32),(H-10)/(d.z+(d.w+d.h)*16));x.save();x.translate(W/2-(d.w-d.h)*16*s,d.z*s+5+(H-10-(d.z+(d.w+d.h)*16)*s)/2);x.scale(s,s);if(t==='road')box(x,0,0,1,1,2,'#77736b');else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:lvl||1,hp:1},1);x.restore()}catch(e){}}
function drawTech(cv,t){try{const x=cv.getContext('2d'),W=cv.width,H=cv.height,r=Math.min(W,H)*.36,c=window.techCol?techCol(t):'#f2c542';x.save();x.shadowColor=c;x.shadowBlur=18;x.beginPath();x.arc(W/2,H/2,r,0,7);const g=x.createRadialGradient(W/2,H/2-r*.4,2,W/2,H/2,r);g.addColorStop(0,'#33444b');g.addColorStop(1,'#141b1e');x.fillStyle=g;x.fill();x.shadowBlur=0;x.lineWidth=4;x.strokeStyle=c;x.stroke();x.restore();if(window.techGlyph)techGlyph(x,t,W/2,H/2,r*.95)}catch(e){}}
function show(){if(open||!Q.length)return;const it=Q.shift();open=true;window._unOpen=true;try{if(window._qm&&_qm.M&&_qm.M())_qm.M().pause=true}catch(e){}
 const cards=it.items.map((e,i)=>e.k==='r'?`<div class="uc t" style="--c:#7fd3ff;animation-delay:${.25+i*.12}s"><img src="${(typeof ICO!=='undefined'&&ICO[e.id])||''}" style="width:72px;height:72px;display:block;margin:10px auto;image-rendering:pixelated;filter:drop-shadow(0 0 10px #7fd3ff88)"><small>Nuevo material</small><b>${(RK.find(r=>r[0]===e.id)||[0,e.id])[1]}</b></div>`:e.k==='b'?`<div class="uc" style="animation-delay:${.25+i*.12}s"><canvas data-b="${e.id}" width="224" height="184"></canvas><small>Nuevo edificio</small><b>${BT[e.id].n}</b></div>`:`<div class="uc t" style="--c:${window.techCol?techCol(e.t):'#f2c542'};animation-delay:${.25+i*.12}s"><canvas data-tc="${e.id}" width="224" height="184"></canvas><small>Nueva investigación</small><b>${e.t[2]}</b></div>`).join('');
 ov.innerHTML=`<div class="ub${it.items.length>7?' many':''}"><div class="ray"></div>${it.hall?`<div class="uh">¡Ayuntamiento nivel ${it.hall}!</div><canvas class="hallc" width="380" height="300"></canvas><div class="us">${it.items.length?'Desbloqueado':'Tu ciudad sigue creciendo'}</div>`:`<div class="uh">¡Nuevo desbloqueo!</div><div class="us">Ya disponible</div>`}<div class="ug">${cards}</div><button onclick="unlockNext()">Genial</button></div>`;
 ov.classList.add('on');
 const hc=ov.querySelector('.hallc');if(hc)drawBld(hc,'hall',it.hall);
 ov.querySelectorAll('canvas[data-b]').forEach(c=>drawBld(c,c.dataset.b,1));
 ov.querySelectorAll('canvas[data-tc]').forEach(c=>{const t=TECH.find(q=>q[0]===c.dataset.tc);if(t)drawTech(c,t)});
 try{window.sfx&&sfx('lvl')}catch(e){}}
window.unlockNext=function(){ov.classList.remove('on');open=false;window._unOpen=false;try{if(window._qm&&_qm.M&&_qm.M())_qm.M().pause=false}catch(e){}setTimeout(show,250)};
window.unlockShow=function(it){Q.push(it);show()};
const ttv=()=>{const t=document.getElementById('ttov');return !!(t&&getComputedStyle(t).display!=='none')};
function busy(){try{if(window._ziOpen||ttv())return true;if(window._qmShown&&_qmShown())return true;const ts=document.getElementById('titleScreen');if(ts&&ts.style.display!=='none'&&getComputedStyle(ts).display!=='none')return true}catch(e){}return false}
function scan(){try{if(window.ZI_OFF||typeof S==='undefined'||!S||!S.bld||!S.bld.length)return;if(S.mode==='creativo')return;
 const B=Object.keys(BT).filter(k=>k!=='hall'&&avail(k)),T=(window.techName?TECH.filter(t=>techName(t)!=='???'&&!S.tech[t[0]]):[]),h=hl();
 if(!S.unl){S.unl={b:{},t:{},h};B.forEach(k=>S.unl.b[k]=1);T.forEach(t=>S.unl.t[t[0]]=1);TECH.forEach(t=>{if(S.tech[t[0]])S.unl.t[t[0]]=1});return}
 const R=window.RES_LV?Object.keys(RES_LV).filter(k=>!resLocked(k)):[];if(!S.unl.r){S.unl.r={};R.forEach(k=>S.unl.r[k]=1)}
 const U=S.unl,nb=B.filter(k=>!U.b[k]),nt=T.filter(t=>!U.t[t[0]]),nr=R.filter(k=>!U.r[k]),up=h>(U.h||1);
 if(!nb.length&&!nt.length&&!nr.length&&!up)return;if(busy())return;
 nb.forEach(k=>U.b[k]=1);nt.forEach(t=>U.t[t[0]]=1);nr.forEach(k=>U.r[k]=1);U.h=Math.max(U.h||1,h);
 const items=nb.map(k=>({k:'b',id:k})).concat(nr.map(k=>({k:'r',id:k})),nt.map(t=>({k:'t',id:t[0],t})));
 window.unlockShow({hall:up?h:0,items})}catch(e){}}
setInterval(()=>{ov.style.visibility=open&&ttv()?'hidden':'';scan()},600);
})();
