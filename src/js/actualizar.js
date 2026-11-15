/* Aviso de versión nueva: compara la versión de este archivo con la del sw.js publicado; si hay una más nueva, ofrece actualizar (guarda antes). */
(function(){
'use strict';
const VER=+'__ATS_VER__';if(!(VER>0)||location.protocol==='file:')return;
let shown=0;
async function check(){try{if(shown||!navigator.onLine)return;const r=await fetch('./sw.js?v='+Date.now(),{cache:'no-store'});if(!r.ok)return;const m=(await r.text()).match(/ats-v(\d+)/);if(m&&+m[1]>VER)show(+m[1])}catch(e){}}
function show(nv){shown=1;const el=document.createElement('div');el.id='updBar';
 el.style.cssText='position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:9998;max-width:min(92vw,520px);background:#1d2a1c;border:2px solid #e0b040;color:#f3e4b0;padding:8px 10px;border-radius:8px;font:600 12px system-ui,sans-serif;display:flex;gap:8px;align-items:center;box-shadow:0 4px 18px #000a';
 el.innerHTML='<span style="flex:1">Hay una versión nueva del juego (v'+nv+'). Tu partida se guarda antes de actualizar.</span><button class="primary" style="padding:5px 10px">Actualizar</button><button style="padding:5px 8px">Luego</button>';
 const [bu,bl]=el.querySelectorAll('button');bu.onclick=update;bl.onclick=()=>el.remove();document.body.appendChild(el)}
async function update(){try{if(typeof save==='function')save()}catch(e){}
 try{const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.update().catch(()=>{})))}catch(e){}
 try{const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}catch(e){}
 location.reload()}
window.updCheck=check;
setTimeout(check,4000);setInterval(check,15*60*1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
})();
