/* Menú de misiones rediseñado: 3 pestañas, tarjetas compactas con recompensas en iconos, listas primero las reclamables. */
(function(){
'use strict';
window.mTab=window.mTab||null;
const G={p:['Principal'],s:['Secundaria','Logro'],d:['Diario']},GN={p:'Principales',s:'Secundarias',d:'Diarias'};
const done=i=>{const m=MS[i];return !!S.done[i]&&(!/Diario/.test(m[3])||S.done[i]==S.day)};
const ready=i=>!done(i)&&MS[i][1]();
const idx=g=>MS.map((m,i)=>i).filter(i=>G[g].includes(MS[i][3]));
const chips=r=>Object.keys(r).filter(k=>r[k]).map(k=>k==='sv'?`<span class="bch">👤 +${r[k]}</span>`:`<span class="bch"><img src="${ICO[k]||''}" width=13> +${r[k]}</span>`).join('');
window.missMenu=function(){
  const gs=['p','s','d'];
  if(!window.mTab||!G[window.mTab])window.mTab=gs.find(g=>idx(g).some(ready))||gs.find(g=>idx(g).some(i=>!done(i)))||'p';
  const tot=MS.filter((m,i)=>!/Diario/.test(m[3])&&done(i)).length,all=MS.filter(m=>!/Diario/.test(m[3])).length;
  const tab=g=>{const n=idx(g).filter(ready).length;return `<button class="${window.mTab===g?'primary':''}" onclick="mTab='${g}';missMenu()">${GN[g]}${n?` <span class="mbad">${n}</span>`:''}</button>`};
  const L=idx(window.mTab).sort((a,b)=>(done(a)-done(b))||(ready(b)-ready(a)));
  const card=i=>{const m=MS[i],d=done(i),r=ready(i),t=m[0].replace(/^Diario: /,'').replace(/^./,c=>c.toUpperCase());
    return `<div class="mc${d?' md':r?' mr':''}"><div class="mst">${d?'✔':r?'★':'○'}</div><div class="mbd"><b>${t}</b><div class="bchs">${chips(m[2])}</div></div>`+(d?`<span class="mdn">${/Diario/.test(m[3])?'Hecha hoy':'Completada'}</span>`:`<button class="${r?'bup':''}" ${r?'':'disabled'} onclick="claim(${i})">${r?'Reclamar':'En curso'}</button>`)+`</div>`};
  show('Misiones',`<div class="prow ptabs">${gs.map(tab).join('')}</div><p class="bsub">Completadas: <b>${tot}/${all}</b>${window.mTab==='d'?' · las diarias se renuevan cada día':''}</p><div class="mls">${L.map(card).join('')}</div>`)};
})();
