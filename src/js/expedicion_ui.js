/* Menú de expedición rediseñado: pestañas, destino en tarjetas, equipo con foto y botón Partir arriba. */
(function(){
'use strict';
window.exVilla=()=>{const j=(villaApi.tbAcc()||[])[window.exQ];if(!j)return toast('Elige un encargo.');const t=window.exTab;let pushed=0,i;if(j.zo){EXT_ZONES.push(j.zo);pushed=1;i=EXT_ZONES.length-1}else i=EXT_ZONES.findIndex(q=>q.id===j.z);window.exZ=i;window.exTab='world';try{exGo();if(S.exp&&j.gd)S.exp.gd=1}finally{if(pushed)EXT_ZONES.pop();if(S.exp)window.exTab='villa';else window.exTab=t}};
const pips=g=>'<span class="xpips">'+[1,2,3,4,5].map(k=>`<i class="${k<=g?'on':''}"></i>`).join('')+'</span>';
const loot=o=>Object.keys(o||{}).map(k=>`<span class="bch"><img src="${ICO[k]||''}" width=13></span>`).join('');
const short=n=>n.replace(/^Cap\.\s*\d+\s*·\s*/,'');
window.expMenu=function(){
  const pt=document.querySelector('#pan .panel-title span'),inMenu=document.getElementById('pan').style.display==='block'&&pt&&pt.textContent==='Expedición';
  const has=cnt('expo')>0;if(!has)window.exTab='solo';else if(!inMenu&&window.exTab==='solo')window.exTab='hist';
  const busy=!!S.exp,busyS=!!S.solo;
  const mx=3+(th('expl1')?1:0)+(window.cmdBonus?cmdBonus():0),tab=window.exTab,lv=hallLv();
  const tb=(k,t)=>`<button class="${tab===k||(k==='zonas'&&tab==='zonas')?'primary':''}" onclick="exTab='${k}';expMenu()">${t}</button>`;
  const vq=(window.villaApi&&villaApi.tbAcc&&villaApi.tbAcc())||[];let tabs=`<div class="prow ptabs">${has?tb('hist','📖 Historia')+tb('zonas','🧭 Libres')+tb('world','🌍 Mapa')+tb('villa','🏘 Villa'+(vq.length?' ('+vq.length+')':'')):''}${tb('solo','🚶 Solitario')}</div>`;
  let h=tabs;
  const free=S.ppl.filter(p=>!p.away&&p.hp>30&&!p.preg&&p.age>=18);
  if(S.solo){const bp=byId(S.solo.id);h+=`<div class="xbusy"><span class="xbi">🚶</span><div class="xdi"><b>Explorador en camino</b><div class="bsub">${bp?bp.n:'Explorador'} · ${S.solo.returning?'volviendo a la ciudad':'Tramo '+S.solo.step+'/'+S.solo.max}</div></div><button class="bup" onclick="soloView()">Ver</button></div>`}
  if(S.exp){const te=S.exp.team.map(byId).filter(Boolean),tv=window.travelInfo&&travelInfo(S.exp),dn=(S.exp.z&&S.exp.z.n||'Expedición').replace(/^Cap\.\s*\d+\s*·\s*/,''),who=te.map(p=>p.n.split(' ')[0]).join(', ');
    const rt=window.returnInfo&&returnInfo(S.exp);if(rt)h+=`<div class="xbusy"><span class="xbi">🏠</span><div class="xdi"><b>Equipo de vuelta · llega en ${rt.txt}</b><div class="bsub">${dn} · ${who} · el botín llegará con ellos</div><div class="bbar"><i style="width:${Math.min(100,(1-rt.left/rt.total)*100)}%;background:#7fc97f"></i></div></div></div>`;
    else if(tv&&!tv.arrived)h+=`<div class="xbusy"><span class="xbi">🧭</span><div class="xdi"><b>Equipo en camino · llega en ${tv.txt}</b><div class="bsub">${dn} · ${who}</div><div class="bbar"><i style="width:${Math.min(100,(1-tv.left/tv.total)*100)}%;background:#e8c25a"></i></div></div><button onclick="cancelTravel()">Volver</button></div>`;
    else if(tv)h+=`<div class="xbusy"><span class="xbi">📍</span><div class="xdi"><b>El equipo ha llegado</b><div class="bsub">${dn} · ${who}</div></div><button class="bup" onclick="startMission()">Jugar misión</button></div>`;
    else h+=`<div class="xbusy"><span class="xbi">🧭</span><div class="xdi"><b>Misión en curso</b><div class="bsub">${dn} · ${who}</div></div><button class="bup" onclick="exEvent()">Ver</button></div>`}
  if(!has)h+=`<p class="bsub" style="color:#e8a090">Para misiones con equipo necesitas un <b>Centro de expediciones</b> (ayuntamiento nivel 3). Mientras tanto puedes enviar al explorador solitario.</p>`;
  if(tab==='solo'){
    const poor=S.res.food<10||S.res.water<10||busyS;
    h+=`<div class="xdest"><div class="xdi"><b>Explorador solitario</b><div class="bsub">Un superviviente explora los alrededores y tú decides cuándo vuelve. Puede traer suministros, armas, planos o gente… o no volver.</div><div class="bchs"><span class="bch"><img src="${ICO.food}" width=13> −10</span><span class="bch"><img src="${ICO.water}" width=13> −10</span></div></div></div>`+
     `<div class="bsec">Elige a quién enviar</div><div class="pg sm">${free.map(p=>pcard(p,poor?`toast('${busyS?'Ya hay un explorador en camino.':'Necesitas 10 de comida y 10 de agua.'}')`:`soloGo(${p.id})`,poor?'dis':'',p.ps&&p.ps.Explorador?'★'+p.ps.Explorador:'⚔'+upow(p))).join('')||'<p class="bsub">No hay supervivientes disponibles.</p>'}</div>`;
    show('Expedición',h);paintCards();return}
  /* destinos */
  let items=[],cur=null,sel=null,pick;
  if(tab==='hist'){items=STORY.map((c,i)=>!sVis(i)?null:{k:i,n:short(c.n),num:i+1,g:c.g,h:c.h,done:i<S.story,lock:i>S.story||c.h>lv||(window.chLocked&&chLocked(i)),l:c.l,intro:c.intro,rec:dgOf({chap:i,g:c.g}),icon:c.loc&&c.loc.icon}).filter(Boolean);sel=window.exC;if(items.length===1&&!items[0].lock)sel=window.exC=items[0].k;pick=k=>`exC=${k};expMenu()`}
  else if(tab==='villa'){items=vq.map((j,i)=>{const z=j.zo||EXT_ZONES.find(q=>q.id===j.z)||{};return{k:i,n:j.t,g:j.g,h:z.h||1,lock:(z.h||1)>lv,l:z.loot,intro:j.x,icon:j.ic,dist:z.dist,ex:'<div class="bsub" style="color:#ffd877">📍 '+j.zn+' · Recompensa: '+j.rw.map(r=>villaApi.rwTxt(r)).join(' · ')+' · ⏳ '+Math.max(0,j.dl-S.day)+' d</div>'}});sel=window.exQ;pick=k=>`exQ=${k};expMenu()`}
  else if(tab==='world'){items=EXT_ZONES.map((z,i)=>!zVis(z)?null:{k:i,n:z.n,g:z.g,h:z.h,lock:z.h>lv,l:z.loot,intro:z.intro,icon:z.icon,dist:z.dist}).filter(Boolean);sel=window.exZ;pick=k=>`exZ=${k};expMenu()`}
  else{items=ZN.map((z,i)=>({k:i,n:z.n,g:z.g,h:z.h,lock:z.h>lv,l:z.l})) ;sel=window.exZ;pick=k=>`exZ=${k};expMenu()`}
  cur=items.find(x=>x.k===sel&&!x.lock)||null;
  const ready=!!cur&&exSel.length>0&&!busy;
  h+=`<div class="xdest${cur?'':' xnone'}">`+(cur?`<div class="xdi"><b>${cur.icon?cur.icon+' ':''}${cur.n}</b><div class="xmeta">Peligro ${pips(cur.g)}${cur.rec?`<span class="bch">⚔ ~${cur.rec}</span>`:''}${cur.dist?`<span class="bch">📍 ${cur.dist}</span>`:''}<span class="xl">${loot(cur.l)}</span></div>${cur.intro?`<div class="bsub xin">${cur.intro}</div>`:''}${cur.ex||''}${cur.done?'<div class="bsub">✔ Completada: solo da el botín del camino.</div>':''}</div>`:`<div class="xdi"><b>Elige un destino</b><div class="bsub">Toca una de las tarjetas de abajo.</div></div>`)+
    `<button class="bup xgo" ${ready?'':'disabled'} onclick="${tab==='villa'?'exVilla()':'exGo()'}">Partir<small>${busy?'misión en curso':exSel.length+'/'+mx}</small></button></div>`;
  if(tab==='villa'&&!items.length)h+='<div class="xdest xnone"><div class="xdi"><b>Sin encargos de la Villa</b><div class="bsub">Acepta encargos en el tablón de Villa Esperanza y aparecerán aquí para hacerlos.</div></div></div>';
  if(items.length>1||tab==='villa')h+=`<div class="bsec">Destino</div><div class="xg">`+items.map(x=>`<div class="xc${x.k===sel?' on':''}${x.lock?' lk':''}" ${x.lock?'':`onclick="${pick(x.k)}"`}><span class="xn">${x.done?'✔':x.num||x.icon||'•'}</span><div class="xt"><b>${x.n}</b>${x.lock?`<small>🔒 Ayuntamiento ${x.h}</small>`:pips(x.g)}</div></div>`).join('')+`</div>`;
  h+=`<div class="bsec">Equipo <b>${exSel.length}/${mx}</b></div><div class="pg sm">`+free.map(p=>pcard(p,`exTog(${p.id})`,exSel.includes(p.id)?'sel':'',exSel.includes(p.id)?'✔':'⚔'+upow(p))).join('')+`</div>`+(free.length?'':'<p class="bsub">No hay supervivientes disponibles.</p>');
  show('Expedición',h);paintCards()};
})();
