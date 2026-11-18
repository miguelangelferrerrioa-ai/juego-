/* Lienzos perdidos: Chrome de Android, cuando le falta memoria gráfica, borra el contenido de los lienzos (pérdida de contexto).
   El juego guarda muchas imágenes ya pintadas (terreno, atlas de edificios, trozos de suelo, árboles, texturas) y no se enteraba:
   se veía el pueblo sin edificios, sin terreno y sin árboles. Ahora se detecta y se rehace todo solo. */
(function(){
'use strict';
let ev=0;const mark=()=>{ev++};
const oC=document.createElement.bind(document);
document.createElement=function(t){const e=oC.apply(document,arguments);if(typeof t==='string'&&t.toLowerCase()==='canvas'){try{e.addEventListener('contextlost',mark);e.addEventListener('contextrestored',mark)}catch(x){}}return e};
document.addEventListener('DOMContentLoaded',()=>{try{const c=document.getElementById('c');if(c){c.addEventListener('contextlost',mark);c.addEventListener('contextrestored',mark)}}catch(x){}});
let done=0,lastEv=0,quiet=0;
function flush(){try{window.PERFC&&(PERFC.lost=(PERFC.lost||0)+1)}catch(e){}
 const T=(f)=>{try{f()}catch(e){}};
 T(()=>{for(const k in TEXC)delete TEXC[k];for(const k in TPAT)delete TPAT[k]});
 T(()=>{for(const k in OSP)delete OSP[k];for(const k in OAS)delete OAS[k];OAT[1]=[];OAT[2]=[]});
 T(()=>{GLW=null;GLL=null;APOV=null});
 T(()=>{TB=null;TBK='';window.__TK=null;dirtyT=1});
 T(()=>window.bCacheClear&&bCacheClear());T(()=>window.groundReset&&groundReset());T(()=>window.tileReset&&tileReset());
 T(()=>window.outerReset&&outerReset());T(()=>{NOI=null});(window.__gfxR||[]).forEach(f=>T(f));T(()=>window._qmReset&&_qmReset());
 done++}
/* se rehace cuando han pasado 400 ms sin más avisos (la pérdida y la recuperación llegan en ráfaga) */
setInterval(()=>{if(ev!==lastEv){lastEv=ev;quiet=performance.now();return}if(ev&&quiet&&performance.now()-quiet>400&&done<ev){done=ev;flush();quiet=0}},200);
window.gfxFlush=flush;
/* botón manual en Opciones, por si el navegador no avisa */
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('gfxBtn'))return;const b=document.createElement('button');b.id='gfxBtn';b.innerHTML='<i class="ib">🔄</i>Rehacer gráficos';b.onclick=()=>{try{tg(0)}catch(e){}flush();try{toast('Gráficos rehechos.')}catch(e){}};rl.appendChild(b)}
setTimeout(addBtn,1500);setTimeout(addBtn,4000);
})();
