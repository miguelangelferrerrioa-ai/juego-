/* Ficha del ayuntamiento: si el siguiente nivel está bloqueado por la historia, dice en qué capítulo se desbloquea y cuántos faltan. */
(function(){
'use strict';
const oB=window.bPanel;
window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id];if(!b||b.type!=='hall'||S.mode==='creativo'||b.lvl>=25||!window.PROG||!window.hallUnlockTxt)return r;
 if(b.lvl<PROG.hallCap())return r;const pan=document.getElementById('pan');if(!pan||pan.querySelector('.hcap'))return r;
 const d=document.createElement('div');d.className='hcap';d.innerHTML='🔒 '+hallUnlockTxt(b.lvl+1);
 const h=pan.querySelector('.bp2h');if(h&&h.parentNode)h.parentNode.insertBefore(d,h.nextSibling);else{const c=pan.querySelector('.pc,.body')||pan;c.insertBefore(d,c.firstChild)}}catch(e){}return r};
const st=document.createElement('style');st.textContent='.hcap{margin:6px 0;padding:7px 10px;border:1px solid #c9a23a;border-radius:9px;background:#2a2412;color:#f2d27a;font-weight:700;font-size:13px}';document.head.appendChild(st);
})();
