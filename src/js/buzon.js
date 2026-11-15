/* Buzón de notificaciones con filtros por tipo y agrupado por día (las nuevas, resaltadas). */
(function(){
'use strict';
const CAT={villa:'#c9a24a',inv:'#7fe0ff',expe:'#6aa9ff',base:'#9fb0b6',alerta:'#ff6a5a',fam:'#e88ab8',historia:'#f2c542',horda:'#ff6a5a'};
const F=[['all','Todo',null],['historia','Historia',['historia']],['horda','Hordas y alertas',['horda','alerta']],['expe','Expediciones',['expe']],['villa','Villa',['villa']],['base','Pueblo',['base','inv','fam']]];
let cur='all',fresh=new Set();
const box=()=>{if(typeof S==='undefined'||!S)return[];return S.inbox||(S.inbox=[])};
const esc=s=>String(s==null?'':s);
window.inboxOpen=function(f){if(typeof f==='string')cur=f;else{cur='all';fresh=new Set(box().filter(n=>!n.r))}
 const b=box(),fl=F.find(x=>x[0]===cur)||F[0],L=fl[2]?b.filter(n=>fl[2].includes(n.c||'base')):b;
 const chips='<div class="bz-f">'+F.map(([k,t,cs])=>{const n=cs?b.filter(x=>cs.includes(x.c||'base')).length:b.length,nw=cs?b.filter(x=>cs.includes(x.c||'base')&&fresh.has(x)).length:fresh.size;
   return n||k==='all'?`<button class="${k===cur?'on':''}" onclick="inboxOpen('${k}')">${t} <em>${n}</em>${nw?`<i>${nw} nueva${nw>1?'s':''}</i>`:''}</button>`:''}).join('')+'</div>';
 let h='',day=null;L.forEach(n=>{if(n.d!==day){day=n.d;h+=`<div class="bz-d">Día ${day}</div>`}
  h+=`<div class="inb${fresh.has(n)?' new':''}"><span class="ii">${esc(n.ic)}</span><div><b style="color:${CAT[n.c]||'#fff'}">${esc(n.t)}</b><small>${esc(n.x)}</small></div>${fresh.has(n)?'<span class="bz-n">NUEVA</span>':''}</div>`});
 if(!L.length)h='<p class="bsub">No hay notificaciones de este tipo.</p>';
 b.forEach(n=>n.r=1);
 show('🔔 Buzón de notificaciones',chips+'<div class="bz-l">'+h+'</div>'+(b.length?'<div class="prow"><button onclick="inboxClear()">Vaciar buzón</button></div>':''))};
window.inboxClear=function(){if(typeof S!=='undefined'&&S)S.inbox=[];fresh=new Set();window.inboxOpen()};
const st=document.createElement('style');st.textContent=`
.bz-f{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.bz-f button{padding:5px 10px;font-size:12px;border-radius:14px}.bz-f button.on{background:linear-gradient(180deg,#ffd877,#e0a124);color:#1b1203}
.bz-f em{font-style:normal;opacity:.7;margin-left:3px}.bz-f i{font-style:normal;margin-left:5px;background:#e03a3a;color:#fff;border-radius:8px;padding:0 5px;font-size:10px}
.bz-d{margin:10px 0 2px;font-size:11px;font-weight:800;letter-spacing:.6px;color:#9aa58c;text-transform:uppercase;border-bottom:1px solid #2c3826;padding-bottom:2px}
.inb .bz-n{margin-left:auto;align-self:center;font-size:9.5px;font-weight:900;color:#fff;background:#e03a3a;border-radius:6px;padding:1px 6px}`;document.head.appendChild(st);
})();
