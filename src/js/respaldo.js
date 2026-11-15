/* Recordatorio de copia de seguridad: cada 10 días de juego sin exportar, aviso con botón Exportar (las partidas solo viven dentro del navegador). */
(function(){
'use strict';
const CADA=10,POSP=3;
const oExp=window.exportSlotKey;
if(typeof oExp==='function')window.exportSlotKey=function(key){const r=oExp.apply(this,arguments);try{if(typeof LIVE!=='undefined'&&LIVE&&key===KEY&&typeof S!=='undefined'&&S&&!S.over){S.expD=S.day;S.expP=0;hide();save()}}catch(e){}return r};
function hide(){const el=document.getElementById('bkBar');if(el)el.remove()}
function busy(){try{if(typeof LIVE==='undefined'||!LIVE||typeof S==='undefined'||!S||S.over||horde)return true;const ts=document.getElementById('titleScreen');if(ts&&getComputedStyle(ts).display!=='none')return true}catch(e){return true}return false}
function check(){try{if(busy()||document.getElementById('bkBar'))return;if(S.expD==null){S.expD=S.day;return}
 const d=S.day-S.expD;if(d<CADA||(S.expP&&S.day<S.expP))return;show(d)}catch(e){}}
function show(d){const el=document.createElement('div');el.id='bkBar';
 el.style.cssText='position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:9997;max-width:min(92vw,540px);background:#1b2226;border:2px solid #8fa3ad;color:#e3ecef;padding:8px 10px;border-radius:8px;font:600 12px system-ui,sans-serif;display:flex;gap:8px;align-items:center;box-shadow:0 4px 18px #000a';
 el.innerHTML='<span style="flex:1">Hace '+d+' días que no guardas una copia de tu partida. Si se borra la app, se perdería.</span><button class="primary" style="padding:5px 10px">Exportar ahora</button><button style="padding:5px 8px">Luego</button>';
 const [be,bl]=el.querySelectorAll('button');be.onclick=()=>{try{exportSlotKey(KEY)}catch(e){}hide()};bl.onclick=()=>{try{S.expP=S.day+POSP}catch(e){}hide()};document.body.appendChild(el)}
window.bkCheck=check;
setInterval(check,20000);
})();
