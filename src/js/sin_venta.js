/* ===== Comida y agua: no se compran, no se venden y no salen como recompensa: solo se producen ===== */
(function(){
'use strict';
const FW=new Set(['food','water']);
window.NOSELL=new Set(['food','water','elec']);
window.noFW=o=>{if(!o||typeof o!=='object')return o;const r={};for(const k in o){if(FW.has(k)&&o[k]>0)continue;r[k]=o[k]}if(!Object.keys(r).length&&Object.keys(o).length){let v=0;for(const k in o)if(FW.has(k)&&o[k]>0)v+=o[k];if(v)r.scrap=Math.max(1,Math.round(v*.5))}return r};
const strip=o=>{if(!o||typeof o!=='object')return;let v=0;for(const k of FW)if(o[k]!=null&&(Array.isArray(o[k])||o[k]>0)){v+=Array.isArray(o[k])?o[k][1]:o[k];delete o[k]}if(v&&!Object.keys(o).length)o.scrap=Array.isArray(v)?v:Math.max(1,Math.round(v*.5))};
try{MS.forEach(m=>strip(m[2]))}catch(e){}
try{ZN.forEach(z=>{if(z.l){const had=!!(z.l.food||z.l.water);for(const k of FW)delete z.l[k];if(had&&!z.l.scrap)z.l.scrap=[6,16]}})}catch(e){}
try{EXT_ZONES.forEach(z=>{if(z.loot){const had=!!(z.loot.food||z.loot.water);for(const k of FW)delete z.loot[k];if(had&&!z.loot.scrap)z.loot.scrap=[8,20]}})}catch(e){}
try{for(let i=SOLO_RES.length-1;i>=0;i--)if(FW.has(SOLO_RES[i]))SOLO_RES.splice(i,1);for(const k of FW)delete SOLO_R[k];if(!SOLO_RES.includes('scrap')){SOLO_RES.push('scrap');SOLO_R.scrap=[15,35]}}catch(e){}
/* red de seguridad: la comida y el agua solo suben por producción, compra o al empezar/cargar partida */
let ok=0;const allow=f=>function(){ok++;try{return f.apply(this,arguments)}finally{ok--}};
window.fwAllow=f=>{ok++;try{return f()}finally{ok--}};
['resTick','newGame','load','loadGame','slotLoad'].forEach(n=>{try{if(typeof window[n]==='function')window[n]=allow(window[n])}catch(e){}});
function wrap(){try{if(typeof S==='undefined'||!S||!S.res||S.res.__fw)return;const raw=S.res;S.res=new Proxy(raw,{get(t,k){return k==='__fw'?true:t[k]},set(t,k,v){if(window.resLocked&&typeof v==='number'&&v>(t[k]||0)&&resLocked(k))return true;if(FW.has(k)&&!ok&&S.mode!=='creativo'&&typeof v==='number'&&v>(t[k]||0))return true;t[k]=v;return true}})}catch(e){}}
window.fwWrap=wrap;
const OUTSIDE=new Set(['farm','well','saw','scrapy','quarry','dock','solar','pump','cistern']);
/* la comida y el agua crecen más despacio con el nivel del edificio: nivel N rinde 1+0,6·(N-1) en vez de N */
(function(){const o=window.out;if(typeof o!=='function')return;window.out=function(b){const r=o.apply(this,arguments);try{const L=Math.max(1,b.lvl||1);if(L>1){const f=(1+.6*(L-1))/L,fw=(1+.5*(L-1))/L;if(r.food)r.food*=f;if(r.water)r.water*=fw}if(b.type==='saw'&&r.wood&&L>1)r.wood*=1+.15*(L-1);if(S.adv&&S.adv.weather===3&&OUTSIDE.has(b.type))for(const k in r)if(k!=='food'&&k!=='water')r[k]*=.75;}catch(e){}return r}})();
(function(){const o=window.upd;if(typeof o==='function')window.upd=function(){wrap();return o.apply(this,arguments)}})();
setInterval(wrap,250);
})();
/* ===== Consejo de recursos: qué falta, a qué ritmo llega y qué edificio lo produce ===== */
(function(){
const NM=k=>((RK.find(r=>r[0]===k)||[0,k])[1]).toLowerCase();
window.resTip=function(k,need){try{const have=S.res[k]||0;if(have>=need)return'';let r=0;try{r=rate()[k]||0}catch(e){}
 const prod=Object.keys(BT).filter(t=>t!=='hall'&&BT[t].p&&BT[t].p[k]);const own=prod.filter(t=>cnt(t)>0),av=prod.filter(t=>cnt(t)===0&&avail(t)),lock=prod.filter(t=>!avail(t));
 const falta=Math.ceil(need-have);let eta='';if(r>0){const d=falta/r;eta=d>=1?' (a este ritmo, unos '+Math.ceil(d)+' día'+(Math.ceil(d)>1?'s':'')+')':' (en menos de un día)'}else eta=' (ahora mismo no produces '+NM(k)+')';
 let tip;if(own.length){const t=own.sort((a,b)=>BT[b].p[k]-BT[a].p[k])[0];tip='Mejora o pon más trabajadores en '+BT[t].n+(av.length?', o construye '+BT[av[0]].n:'')}
 else if(av.length)tip='Construye '+BT[av.sort((a,b)=>BT[b].p[k]-BT[a].p[k])[0]].n;
 else if(lock.length)tip='Lo produce un edificio que aún no tienes desbloqueado; búscalo en expediciones, misiones o el mercado';else tip='Consíguelo en expediciones, misiones o el mercado';
 return '<br>• Te faltan '+falta+' de '+NM(k)+eta+'. '+tip+'.'}catch(e){return''}};
window.resTips=c=>Object.keys(c).map(k=>resTip(k,c[k])).join('');
})();
window.lvTip=function(nb,falta,hb){try{const c=S.bld.filter(x=>x!==hb&&!['wall','road','gate','trap','bridge','fence','barricade'].includes(x.type)&&x.lvl<nb&&BT[x.type]).sort((a,b)=>b.lvl-a.lvl);const seen={},L=[];for(const x of c){if(L.length>=3)break;const k=x.type+x.lvl;if(seen[k])continue;seen[k]=1;L.push(BT[x.type].n+' (nivel '+x.lvl+')')}return L.length?'<br>• Mejora '+falta+' más; los más cercanos: '+L.join(', ')+'.':''}catch(e){return''}};
