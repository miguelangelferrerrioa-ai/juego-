/* Botón "atrás" en todos los paneles: recuerda de qué menú vienes y vuelve a generarlo actualizado. */
(function(){
'use strict';
const N={stack:[],cur:null,reset:false,going:false};
const isOpen=()=>{const p=document.getElementById('pan');return !!p&&p.style.display==='block'};
const NAMES=['bPanel','pSheet','expMenu','missMenu','diarioMenu','docRead','buildMenu','storeMenu','pplMenu','upgMenu','bldList','techMenu','armyMenu','worldMapMenu','asgList','expandMenu','aspMenu','soloView','exEvent','menu'];
let tag=null;
NAMES.forEach(n=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){tag={fn:n,args:[].slice.call(arguments)};return o.apply(this,arguments)}});
const oShow=window.show;
window.show=function(t,h){
  const wasOpen=isOpen(),tg=tag;tag=null;
  const entry=tg?{fn:tg.fn,args:tg.args}:{snap:[t,h]};
  if(!wasOpen||N.reset){N.stack=[];N.reset=false}
  else if(!N.going&&N.cur){
    const c=N.cur,same=(c.fn&&entry.fn&&c.fn===entry.fn)||(c.snap&&entry.snap&&c.snap[0]===entry.snap[0]);
    if(!same)N.stack.push(c)}
  N.cur=entry;
  const r=oShow.apply(this,arguments);
  try{const hd=document.querySelector('#pan .panel-title');if(hd&&N.stack.length){const b=document.createElement('button');b.className='panel-back';b.setAttribute('aria-label','Atrás');b.textContent='←';b.onclick=()=>window.navBack();hd.insertBefore(b,hd.firstChild)}}catch(e){}
  return r};
window.navBack=function(){const e=N.stack.pop();if(!e)return;N.going=true;
  try{if(e.fn&&typeof window[e.fn]==='function')window[e.fn].apply(null,e.args);else if(e.snap){oShow(e.snap[0],e.snap[1]);N.cur=e;try{paintCards()}catch(_){}}}finally{N.going=false}
  const hd=document.querySelector('#pan .panel-title');if(hd&&N.stack.length&&!hd.querySelector('.panel-back')){const b=document.createElement('button');b.className='panel-back';b.textContent='←';b.onclick=()=>window.navBack();hd.insertBefore(b,hd.firstChild)}};
const oHide=window.hide;window.hide=function(){N.stack=[];N.cur=null;return oHide.apply(this,arguments)};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#rail button,#bot button');if(b){N.reset=true;setTimeout(()=>{N.reset=false},350)}},true);
})();
