/* ===== Dead Town · reparaciones: coste realista según daño, tipo y nivel; pestaña de Reparaciones en el ayuntamiento ===== */
(function(){
'use strict';
const SKIP=['elec','rp'];
function baseCost(b){const d=BT[b.type]||{};let c=Object.assign({},d.cost||{});if(!Object.keys(c).length)c={wood:40,metal:15};
 const L=b.lvl||1,o={};for(const k in c)o[k]=c[k]*(1+(L-1)*.5);
 /* materiales del nivel que YA tiene (antes cobraba los de la mejora siguiente, que aún no se pueden tener) */try{if(L>1&&typeof ucost==='function'&&b.type!=='wall'&&b.type!=='gate'){const u=ucost(Object.assign({},b,{lvl:L-1}));for(const k in u)o[k]=(o[k]||0)+u[k]*.18}}catch(e){}
 return o}
window.repairCost=function(b){const m=mxhp(b),f=Math.max(0,Math.min(1,(m-b.hp)/m));if(f<=.001)return{};const base=baseCost(b),o={};
 for(const k in base){if(SKIP.includes(k)||!(base[k]>0))continue;const v=Math.ceil(base[k]*f*.35*(typeof disc==='function'?disc():1));o[k]=Math.max(1,v)}
 return o};
const add=(a,c)=>{for(const k in c)a[k]=(a[k]||0)+c[k]};
const chips=c=>Object.keys(c).map(k=>{const ok=(S.res[k]||0)>=c[k]||S.mode==='creativo';return `<span class="bp2k ${ok?'':'no'}"><img src="${(typeof ICO!=='undefined'&&ICO[k])||''}" width=13>${c[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('');
const dmg=()=>S.bld.filter(b=>b.hp<mxhp(b)-.5).sort((a,b)=>a.hp/mxhp(a)-b.hp/mxhp(b));
window.repair=function(id){const b=bm[id];if(!b)return;const c=repairCost(b);if(!Object.keys(c).length)return toast('No necesita reparación.');if(!can(c))return toast('Faltan materiales: '+cs(c)+'.');pay(c);b.hp=mxhp(b);burst(b.x+b.w/2,b.y+b.h/2,12,'#a9d7a0',1.8,9);try{S.adv.repairs=(S.adv.repairs||0)+1}catch(e){}toast('Reparado: '+BT[b.type].n+'.');try{bPanel(id)}catch(e){}};
window.repairAll=function(){let n=0,left=0;const g={};dmg().forEach(b=>{const c=repairCost(b);if(can(c)){pay(c);add(g,c);b.hp=mxhp(b);n++;burst(b.x+b.w/2,b.y+b.h/2,8,'#a9d7a0',1.6,8)}else left++});
 try{S.adv.repairs=(S.adv.repairs||0)+n}catch(e){}
 toast(n?('Reparadas '+n+' estructuras. Coste: '+cs(g)+'.'+(left?' Faltan materiales para '+left+'.':'')):'No hay materiales suficientes para ninguna reparación.');repMenu()};
window.repMenu=function(){const l=dmg(),tot={};l.forEach(b=>add(tot,repairCost(b)));
 const rows=l.slice(0,40).map(b=>{const c=repairCost(b),pct=Math.round(b.hp/mxhp(b)*100),col=pct<35?'#d9534a':pct<70?'#e0b04a':'#8bc46f';
  return `<div class="bp2d" style="flex-direction:column;align-items:stretch;gap:5px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)"><div style="display:flex;justify-content:space-between;gap:8px"><b>${BT[b.type].n} · nv ${b.lvl}</b><span style="color:${col}">${pct}%</span></div><div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px"><i style="display:block;height:100%;width:${pct}%;background:${col};border-radius:3px"></i></div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div class="bp2ck" style="margin:0">${chips(c)}</div><button onclick="repair(${b.id});repMenu()" style="white-space:nowrap">Reparar</button></div></div>`}).join('');
 const h=l.length?`<p>${l.length} estructura(s) dañada(s). El coste depende del daño, del tipo de edificio y de su nivel.</p><div class="bp2ck" style="margin:6px 0 10px"><b style="margin-right:6px">Total</b>${chips(tot)}</div><button class="bp2b" onclick="repairAll()">Reparar todo (las más dañadas primero)</button><div style="margin-top:10px">${rows}</div>${l.length>40?'<p><small>Se muestran las 40 más dañadas.</small></p>':''}`:'<p>Todas las estructuras están en buen estado.</p>';
 const hall=S.bld.find(b=>b.type==='hall');show('Reparaciones',h+`<div class="bact">${hall?btn('← Volver al ayuntamiento',`bPanel(${hall.id})`):''}</div>`)};
})();
