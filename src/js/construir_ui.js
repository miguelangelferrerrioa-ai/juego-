/* Menú de construcción por categorías: pestañas, tarjetas con dibujo, coste en iconos (rojo si falta) y bloqueados al final. */
(function(){
'use strict';
const CATS=[
 ['ciudad','🏠','Ciudad',['house','store','silo','expo','radio','road','bridge','cmd']],
 ['rec','🌾','Recursos',['farm','saw','scrapy','dock','well','pump','mine','quarry','oilp','sheetw','kiln','cistern','greenh','kitchen']],
 ['prod','⚙','Producción',['work','fact','smithy','glassw','steelw','cement','ammof','chem','refin','gen','solar','wind','market','forgeb','obs']],
 ['def','🛡','Defensa',['wall','gate','trap','tower','mtower','turret','bunker']],
 ['ent','🎓','Entrenamiento',['barr','tr_Médico','tr_Soldado','tr_Constructor','tr_Agricultor','tr_Cocinero','tr_Explorador','tr_Mecánico','tr_Recolector','tr_Científico','gym','agil','biblio','salon']],
 ['sal','🩺','Salud',['hosp','pharm','lab','elab','abxlab']]];
window.bTab=window.bTab||'ciudad';
/* Formaciones desbloqueadas por potencia del rol: las básicas primero, las más fuertes con ayuntamiento alto */
[['Recolector',2,{wood:110,metal:25}],['Agricultor',2,{wood:120,metal:30}],['Cocinero',3,{wood:140,metal:50}],['Constructor',3,{wood:170,metal:80}],['Mecánico',4,{wood:200,metal:140}],['Médico',5,{wood:230,metal:150,meds:20}],['Explorador',6,{wood:260,metal:180}],['Soldado',7,{wood:300,metal:240,ammo:40}],['Científico',9,{wood:380,metal:320,comp:20}]].forEach(([pf,lv,c])=>{const d=BT['tr_'+pf];if(d){d.lv=lv;d.cost=c}});
const catOf=k=>{const c=CATS.find(x=>x[3].includes(k));return c?c[0]:'ciudad'};
const note=d=>d.oil?'🛢 Solo sobre un yacimiento':d.mt?'⛰ Solo en montaña':d.dk?'🌊 En la orilla':d.wb?'🌊 Sobre el agua':d.pm?'💧 Junto al agua':'';
window.bInfo=function(t){const d=BT[t],ok=avail(t),c=costOf(d.cost);
  const row=(a,b)=>`<div class="irow"><span>${a}</span><b>${b}</b></div>`;
  const ic=o=>Object.keys(o).filter(k=>o[k]).map(k=>`<span class="bch${S.res[k]<o[k]?' bnop':''}"><img src="${ICO[k]||''}" width=12>${o[k]}</span>`).join('');
  let h=`<div class="bcard" style="cursor:default"><canvas class="mini" data-t="${t}" width="80" height="70"></canvas><div class="bci"><b style="font-size:15px">${d.n}</b><small>${(CATS.find(x=>x[3].includes(t))||[0,'','Ciudad'])[2]}</small></div></div>`;
  h+=`<p class="bdesc">${d.f||d.d||'Estructura de la base.'}</p>`;
  h+=row('Tamaño',d.w+'×'+d.h+' casillas')+row('Requiere',ok?'✔ Ayuntamiento '+d.lv:'🔒 Ayuntamiento '+d.lv+(d.tech?' + '+TECH.find(q=>q[0]==d.tech)[2]:''))+row('Coste',ic(c)||'—');
  if(d.p&&Object.keys(d.p).some(k=>k!=='elec'))h+=row('Produce',Object.keys(d.p).filter(k=>k!=='elec').map(k=>`<span class="bpr"><img src="${ICO[k]||''}" width=11>+${d.p[k]}/min</span>`).join(' '));
  if(d.cons)h+=row('Consume',Object.keys(d.cons.use).map(k=>`<span class="bpr"><img src="${ICO[k]||''}" width=11>${d.cons.use[k]}/min</span>`).join(' '));
  if(window.pwTable&&pwTable(t)){const T=pwTable(t);h+=row('Energía','nv 1-2: 0 · 3-4: '+T[1]+' · 5-6: '+T[2]+' · 7-8: '+T[3]+' · 9-10: '+T[4])}else if(d.p&&d.p.elec)h+=row('Energía','+'+d.p.elec+' de capacidad por nivel');
  if(d.slots)h+=row('Plazas',d.slots+(d.job&&d.job.length?' · '+d.job.join(', '):d.tr?' · formación de '+d.tr:''));
  if(d.fire)h+=row('Defensa',d.gun?'Necesita 1-2 tiradores con arma':'Dispara a los zombis');
  if(d.hp)h+=row('Resistencia',d.hp+' PV');
  if(note(d))h+=row('Ubicación',note(d));
  if(d.tr)h+=row('Efecto','Sube el rol de '+d.tr+' de nivel 0 a 10 (cuanto más nivel, más tarda)');
  h+='<div class="row" style="margin-top:8px">'+btn(ok?'Construir':'Bloqueado',`pickB('${t}')`,!ok)+btn('Volver','buildMenu()')+'</div>';
  show(d.n,h);document.querySelectorAll('canvas.mini').forEach(c=>{const x=c.getContext('2d'),d=BT[t],s=Math.min(76/((d.w+d.h)*32),62/(d.z+(d.w+d.h)*16));x.translate(40-(d.w-d.h)*16*s,d.z*s+4);x.scale(s,s);try{if(t=='road'){box(x,0,0,1,1,2,'#77736b')}else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:1,hp:1},1)}catch(e){}})};
window.buildMenu=function(){
  const keys=Object.keys(BT).filter(k=>k!=='hall');
  const by={};CATS.forEach(c=>by[c[0]]=[]);keys.forEach(k=>by[catOf(k)].push(k));
  if(!by[window.bTab]||!by[window.bTab].length)window.bTab='ciudad';
  const tabs=CATS.map(c=>{const n=by[c[0]].filter(avail).length;return `<button class="${window.bTab===c[0]?'primary':''}" onclick="bTab='${c[0]}';buildMenu()">${c[1]} ${c[2]}${n?` <span class="mbad">${n}</span>`:''}</button>`}).join('');
  const L=by[window.bTab].slice().sort((a,b)=>(avail(b)?1:0)-(avail(a)?1:0)||BT[a].lv-BT[b].lv);
  const card=t=>{const d=BT[t],ok=avail(t),c=costOf(d.cost),poor=ok&&!can(c);
    const cost=Object.keys(c).filter(k=>c[k]).map(k=>`<span class="bch${S.res[k]<c[k]?' bnop':''}"><img src="${ICO[k]||''}" width=12>${c[k]}</span>`).join('');
    const prod=d.p?Object.keys(d.p).map(k=>`<span class="bpr"><img src="${ICO[k]||''}" width=11>+${d.p[k]}</span>`).join(''):'';
    const lock=!ok?`🔒 Ayuntamiento ${d.lv}${d.tech?' · '+TECH.find(q=>q[0]==d.tech)[2]:''}`:'';
    const act=ok?`pickB('${t}')`:`toast('Requiere ayuntamiento nivel ${d.lv}${d.tech?' y la tecnología '+TECH.find(q=>q[0]==d.tech)[2]:''}')`;
    return `<div class="bcard${ok?'':' lk'}${poor?' poor':''}" onclick="${act}"><canvas class="mini" data-t="${t}" width="80" height="70"></canvas><button class="binf" onclick="event.stopPropagation();bInfo('${t}')">i</button><div class="bci"><b>${d.n}</b><small>${d.w}×${d.h}${prod?' · '+prod:''}</small>${lock?`<small class="blk">${lock}</small>`:`<div class="bchs">${cost}</div>`}${note(d)?`<small>${note(d)}</small>`:''}</div></div>`};
  show('Construir',`<div class="prow ptabs bcat">${tabs}</div><p class="bsub">Ayuntamiento nivel <b>${hallLv()}</b> · toca una estructura, colócala y confirma cuando el contorno esté verde.</p><div class="bgrid">${L.map(card).join('')}</div>`);
  document.querySelectorAll('canvas.mini').forEach(c=>{const x=c.getContext('2d'),t=c.dataset.t,d=BT[t],s=Math.min(76/((d.w+d.h)*32),62/(d.z+(d.w+d.h)*16));x.translate(40-(d.w-d.h)*16*s,d.z*s+4);x.scale(s,s);try{if(t=='road'){box(x,0,0,1,1,2,'#77736b')}else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:1,hp:1},1)}catch(e){}})};
})();
