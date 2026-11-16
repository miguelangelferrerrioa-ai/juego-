/* Resumen del día: al amanecer recoge todos los avisos que salen en los primeros segundos del día nuevo y muestra una tarjeta pequeña en una esquina («☀ Día N · K novedades») que no para el juego. Al tocarla, se ven todos juntos. */
(function(){
'use strict';
const WIN=15;              /* segundos de juego tras el amanecer en los que se recogen avisos */
let col=null;              /* {d,t0,list:[]} */
const IC=[[/horda|vigías|asaltará|zombi|infectad|banda/i,'🧟','alerta'],[/murió|muerto|fallec|no lo ha logrado|desapareci/i,'✝','alerta'],[/enferm|herid|cura/i,'💉','salud'],[/sube a nivel|domina|formaci/i,'⭐','gente'],[/naci|bebé|embaraz|pareja|se une|llega|refugiad/i,'👶','gente'],
 [/armería|tablón|taberna|villa|mercado|encargo/i,'🏪','villa'],[/tiempo|lluvia|niebla|tormenta|despejado/i,'🌦','clima'],[/investig|tecnolog/i,'🔬','base'],[/expedici|equipo|regres/i,'🧭','expe']];
const dup=t=>col.list.some(q=>q.t.includes(t)||t.includes(q.t));
const kind=t=>{for(const [re,ic,c] of IC)if(re.test(t))return [ic,c];return ['•','base']};
const oT=window.toast;
window.toast=function(m){try{if(col&&typeof S!=='undefined'&&S&&S.day===col.d&&(S.dayT||0)-col.t0<=WIN){const t=String(m||'').trim();if(t&&!dup(t)){col.list.push({t,k:kind(t)});card()}}}catch(e){}return oT.apply(this,arguments)};
/* también lo que va al buzón (renovaciones de la Villa, avisos de bandas, nacimientos…) */
const oNt=window.notify;if(typeof oNt==='function')window.notify=function(ic,t,x){try{if(col&&typeof S!=='undefined'&&S&&S.day===col.d&&(S.dayT||0)-col.t0<=WIN){const tx=String(t||'')+(x?': '+x:'');if(!dup(tx)&&!dup(String(x||''))){const k=kind(tx);col.list.push({t:tx,k:[ic||k[0],k[1]]});card()}}}catch(e){}return oNt.apply(this,arguments)};
const oN=window.nextDay;
if(typeof oN==='function')window.nextDay=function(){const r=oN.apply(this,arguments);try{col={d:S.day,t0:S.dayT||0,list:[]};const el=document.getElementById('rdCard');if(el)el.remove();setTimeout(card,300)}catch(e){}return r};
function card(){if(!col)return;let el=document.getElementById('rdCard');const n=col.list.length;if(!n){if(el)el.remove();return}
 if(!el){el=document.createElement('button');el.id='rdCard';el.onclick=open;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('in'))}
 el.innerHTML=`<span class="rd-sun">☀</span><span><b>Día ${col.d}</b><small>${n} novedad${n>1?'es':''} · toca para verlas</small></span><i class="rd-x" title="Cerrar">✕</i>`;
 el.querySelector('.rd-x').onclick=e=>{e.stopPropagation();el.remove()}}
function open(){if(!col)return;const g={};col.list.forEach(x=>{(g[x.k[1]]=g[x.k[1]]||[]).push(x)});
 const order=['alerta','salud','gente','expe','base','villa','clima'],nm={alerta:'Peligro',salud:'Salud',gente:'Supervivientes',expe:'Expediciones',base:'Pueblo',villa:'Villa Esperanza',clima:'Clima'};
 let h='';order.forEach(k=>{if(!g[k])return;h+=`<div class="rd-h ${k}">${nm[k]}</div>`+g[k].map(x=>`<div class="rd-i ${k}"><span>${x.k[0]}</span><p>${x.t}</p></div>`).join('')});
 const el=document.getElementById('rdCard');if(el)el.remove();
 show('☀ Resumen del día '+col.d,`<div class="rd-l">${h}</div><small class="mu-mut">Todo queda también en el buzón 🔔.</small>`)}
window.dayRecap=open;window._rdCol=()=>col;window._rdSet=c=>{col=c;card()};
const st=document.createElement('style');st.textContent=`
#rdCard{position:fixed;left:8px;bottom:58px;z-index:30;display:flex;gap:9px;align-items:center;padding:7px 10px 7px 8px;border-radius:12px;border:1px solid #c9a24a;background:linear-gradient(180deg,#2c2614f0,#1a160bf0);color:#f3e4b0;font:600 12px system-ui,sans-serif;box-shadow:0 6px 18px #000a;transform:translateX(-120%);transition:transform .35s ease-out;text-align:left;cursor:pointer}
#rdCard.in{transform:none}#rdCard .rd-sun{font-size:22px;animation:rdS 6s linear infinite}#rdCard b{display:block;font-size:13px;color:#ffd877}#rdCard small{color:#d8c89a}
#rdCard .rd-x{font-style:normal;margin-left:4px;opacity:.7;padding:2px 4px}@keyframes rdS{to{transform:rotate(360deg)}}
.rd-h{margin:10px 0 4px;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:#9aa58c;border-bottom:1px solid #2c3826;padding-bottom:2px}.rd-h.alerta{color:#ff9a8a}
.rd-i{display:flex;gap:9px;align-items:flex-start;padding:6px 8px;margin:4px 0;border-radius:8px;background:#141b12;border:1px solid #2c3826}.rd-i span{font-size:16px;width:20px;text-align:center}.rd-i p{margin:0;font-size:12.5px;color:#e3e8dc}
.rd-i.alerta{border-color:#8a3a2a;background:#2a1612}`;document.head.appendChild(st);
})();
