/* Aviso fijo de la próxima horda en la barra de arriba: cuándo llega y si tu defensa basta (verde/amarillo/rojo). Al tocarlo, detalle. Durante la horda: cuántos enemigos quedan. */
(function(){
'use strict';
const COL={Suficiente:'ok',Justa:'mid',Insuficiente:'bad'};
function live(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length||S.over)return false;if(typeof LIVE!=='undefined'&&!LIVE)return false;const ts=document.getElementById('titleScreen');if(ts&&getComputedStyle(ts).display!=='none')return false;return true}catch(e){return false}}
function when(d){return d<=0?'¡Hoy!':d===1?'Mañana':'En '+d+' días'}
function whenS(d){return d<=0?'¡Hoy!':d===1?'Mañana':d+' días'}
function upd(){const t=document.getElementById('top');if(!t)return;let c=document.getElementById('hzChip');
 if(!live()){if(c)c.style.display='none';return}
 if(!c){c=document.createElement('button');c.id='hzChip';c.className='ch';c.onclick=e=>{e.stopPropagation();detail()};}
 const rb=document.getElementById('rbTog');if(c.parentNode!==t||(rb&&c.nextSibling!==rb&&rb.previousSibling!==c)){if(rb)t.insertBefore(c,rb);else t.appendChild(c)}
 c.style.display='';
 if(horde){const n=Z.filter(z=>z.act).length;c.className='ch hz now';c.innerHTML=`🧟 ${n}`;c.title='Horda en curso: '+n+' enemigos';return}
 let e=null;try{e=hordeEst()}catch(x){}if(!e){c.style.display='none';return}
 c.className='ch hz '+(COL[e.v]||'mid');c.innerHTML=`🧟 ${whenS(e.days)}`;c.title='Próxima horda: '+when(e.days)+' · defensa '+e.v}
function detail(){if(horde)return;let e=null;try{e=hordeEst()}catch(x){}if(!e)return;
 const k=COL[e.v]||'mid',pct=Math.round(Math.min(1,(e.r||0)/2)*100),tip={ok:'Tu defensa debería bastar. Aun así, repara muros y mantén munición.',mid:'Va a estar justo: sube torres o torretas, entrena al ejército o arma a más gente.',bad:'Tu defensa no basta: refuerza ya (torretas, muros, soldados armados) o perderás edificios y gente.'}[k];
 show('Próxima horda',`<div class="hz-card ${k}"><div class="hz-big">🧟</div><div><b>${when(e.days)} · ${e.kind}</b><small>Unos ${e.n} enemigos</small></div><span class="hz-v">${e.v}</span></div>
  <div class="mu-h">Tu defensa frente a la horda</div><div class="hz-bar"><i class="${k}" style="width:${pct}%"></i><span style="left:41.5%"></span><span style="left:62.5%"></span></div><div class="hz-leg"><small style="left:20%">Insuficiente</small><small style="left:52%">Justa</small><small style="left:81%">Suficiente</small><b class="hz-you" style="left:${Math.max(3,Math.min(97,pct))}%">▲ Tú</b></div>
  <p class="hz-tip">${tip}</p><small class="mu-mut">Cuentan los soldados del ejército, quienes tienen arma en torres y las torretas. Los civiles sin arma se refugian en el ayuntamiento.</small>`)}
window.hordeChip=detail;
setInterval(()=>{try{upd()}catch(e){}},1000);
const st=document.createElement('style');st.textContent=`
@media (max-width:1000px){#top .ch{letter-spacing:.3px!important;padding-left:5px!important;padding-right:6px!important}}
#hzChip.hz{cursor:pointer;border:1px solid;font-weight:800;padding-left:6px;padding-right:7px;white-space:nowrap;letter-spacing:.2px;font-size:11px}
#hzChip.ok{border-color:#4f9a4f;color:#a6f0a6;background:linear-gradient(180deg,#1f3a1f,#142614)}
#hzChip.mid{border-color:#b8962a;color:#ffe08a;background:linear-gradient(180deg,#3e3414,#2a230c)}
#hzChip.bad{border-color:#c0442e;color:#ffb39e;background:linear-gradient(180deg,#4a1c14,#2e110c);animation:hzP 1.6s ease-in-out infinite}
#hzChip.now{border-color:#e0442e;color:#fff;background:linear-gradient(180deg,#8a2418,#5a160e);animation:hzP 1s ease-in-out infinite}
@keyframes hzP{0%,100%{box-shadow:0 0 0 0 rgba(224,68,46,0)}50%{box-shadow:0 0 10px 2px rgba(224,68,46,.55)}}
.hz-card{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;border:1px solid}.hz-card.ok{border-color:#4f9a4f;background:#142614}.hz-card.mid{border-color:#b8962a;background:#2a230c}.hz-card.bad{border-color:#c0442e;background:#2e110c}
.hz-big{font-size:30px}.hz-card b{display:block;font-size:16px;color:#f2d27a}.hz-card small{color:#c9d1c0}.hz-v{margin-left:auto;font-weight:900;font-size:15px;padding:4px 10px;border-radius:8px;background:#0008}
.hz-bar{position:relative;height:14px;border-radius:7px;background:#2a1612;overflow:hidden;border:1px solid #444}.hz-bar i{display:block;height:100%}.hz-bar i.bad{background:linear-gradient(90deg,#8a2418,#e0442e)}.hz-bar i.mid{background:linear-gradient(90deg,#8a6a14,#e0b040)}.hz-bar i.ok{background:linear-gradient(90deg,#2a6a2a,#5fcf5f)}.hz-bar span{position:absolute;top:-2px;bottom:-2px;width:2px;background:#fff}
.hz-leg{position:relative;height:34px;color:#9aa58c;margin:3px 0 4px}.hz-leg small{position:absolute;top:0;transform:translateX(-50%)}.hz-leg .hz-you{position:absolute;top:15px;transform:translateX(-50%);color:#fff;font-size:12px}.hz-tip{color:#e8dcb0}`;document.head.appendChild(st);
})();
