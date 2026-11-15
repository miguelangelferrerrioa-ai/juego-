/* Filtro anti-spoilers: en los menús y en la guía, cualquier nombre de edificio, material o enemigo aún bloqueado se cambia por «???» (también dentro de frases). */
(function(){
'use strict';
const MAT={stone:['piedra'],plank:['tablones','tablón'],comp:['componentes','componente'],brick:['ladrillos','ladrillo'],abx:['antibióticos','antibiótico'],sheet:['chapa'],chem:['químicos','químico'],glass:['cristal'],steel:['acero'],concrete:['hormigón'],alloy:['aleación']};
let RE=null,SIG='';
function terms(){const t=[];try{
  for(const k in BT){const d=BT[k];if(!d||!d.n||k==='road')continue;let ok=true;try{ok=avail(k)||cnt(k)>0}catch(e){}if(!ok)t.push(d.n)}
  if(window.resLocked)for(const k in MAT)if(resLocked(k))t.push(...MAT[k]);
  const seen=S.zseen||{};for(const k in ZT){if(k==='z'||k==='b')continue;const z=ZT[k];if(z&&z.n&&!seen[k])t.push(z.n)}
 }catch(e){}return t}
function build(){if(typeof S==='undefined'||!S||!S.bld)return null;const t=terms();const sig=t.join('|');if(sig!==SIG){SIG=sig;
  /* los más largos primero ("Zombi soldado" antes que "soldado") */
  RE=t.length?new RegExp('(^|[^\\wáéíóúüñÁÉÍÓÚÜÑ])('+t.sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\wáéíóúüñÁÉÍÓÚÜÑ])','gi'):null}return RE}
function clean(root){const re=build();if(!re||!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const L=[];while((n=w.nextNode()))L.push(n);
 for(const x of L){const v=x.nodeValue;if(!v||v.length<3)continue;re.lastIndex=0;if(!re.test(v))continue;re.lastIndex=0;x.nodeValue=v.replace(re,'$1???')}}
window.spoilClean=clean;
let busy=0;const q=new Set();
function run(){busy=0;for(const r of q)clean(r);q.clear()}
function watch(id){const el=document.getElementById(id);if(!el)return;new MutationObserver(()=>{q.add(el);if(!busy){busy=1;requestAnimationFrame(run)}}).observe(el,{childList:true,subtree:true,characterData:true})}
['pan','guideScreen'].forEach(watch);
})();
