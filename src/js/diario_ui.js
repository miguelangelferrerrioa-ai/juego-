/* Diario rediseñado: pestañas del juego, tarjetas, línea de tiempo y TODOS los archivos (los no encontrados salen bloqueados). */
(function(){
'use strict';
const oD=window.diarioMenu,realShow=()=>window.show;
const grab=t=>{const real=window.show;let c=null;window.show=function(a,h){c=h};try{oD(t)}finally{window.show=real}return c?c.replace(/^<div style="display:flex[\s\S]*?<\/div><hr[^>]*>/,''):''};
window.dTab=window.dTab||'obj';
window.diarioMenu=function(tab){try{if(!S.nar&&window.narTick)narTick()}catch(e){}tab=tab||window.dTab||'obj';window.dTab=tab;
  let pre=(tab==='obj'||tab==='res')?null:grab('obj');const n=S.nar,DOCS=window.narDocs,ids=Object.keys(DOCS),got=ids.filter(i=>n&&n.docs.includes(i));
  const tb=(k,t)=>`<button class="${tab===k?'primary':''}" onclick="diarioMenu('${k}')">${t}</button>`;
  let body='';
  if(tab==='docs'){
    const found=got.map(id=>`<div class="dk dk1" onclick="docRead('${id}')"><span class="dki">📄</span><b>${DOCS[id].t}</b></div>`);
    const lock=ids.filter(i=>!got.includes(i)).map(()=>`<div class="dk dk0"><span class="dki">🔒</span><b>Sin descubrir</b></div>`);
    body=`<p class="bsub">Archivos encontrados: <b>${got.length}/${ids.length}</b> · se consiguen con la historia y las expediciones.</p><div class="dkg">${found.join('')}${lock.join('')}</div>`}
  else if(tab==='log'){
    body=n.log.length?`<div class="dtl">${n.log.slice().reverse().map(l=>`<div class="dte"><span class="dtd">Día ${l.d}</span><div>${l.x}</div></div>`).join('')}</div>`:'<p class="bsub">Aún no hay entradas. Se escribirán según vayas tomando decisiones.</p>'}
  else body=`<div class="dcard">${grab(tab)}</div>`;
  window.show('Diario del refugio',`<div class="prow ptabs">${tb('obj','🎯 Objetivo')}${tb('res','📋 Resumen')}${tb('log','📓 Diario ('+n.log.length+')')}${tb('docs','📄 Archivos ('+got.length+'/'+ids.length+')')}</div>${body}`)};
window.docRead=function(id){const d=window.narDocs[id];if(!d)return;
  window.show(d.t,`<div class="dcard dread"><div class="dkh">📄 Archivo</div><p>${d.x}</p></div><div class="bact"><button onclick="diarioMenu('docs')">← Volver a archivos</button></div>`)};
})();
