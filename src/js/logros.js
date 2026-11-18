/* Logros: 31 objetivos de toda la partida (hordas, población, días, capítulos, ayuntamiento, edificios, abatidos,
   expediciones, jefes, rescatados, soldados, tecnologías). Al conseguir uno sale un aviso y da una pequeña recompensa
   y un TÍTULO para tu pueblo, que se elige en Opciones → 🏅 Logros y aparece en la ficha del ayuntamiento. */
(function(){
'use strict';
const L=()=>{S.logros=S.logros||{got:{},nuevo:0,tit:''};return S.logros};
const nT=()=>{try{return Object.keys(S.tech||{}).filter(k=>S.tech[k]).length}catch(e){return 0}};
const D=[
 ['h1','🧟','Primera sangre','Supera tu primera horda',1,()=>S.stat.hordes,'Superviviente',{ammo:20}],
 ['h10','🧟','Veterano','Supera 10 hordas',10,()=>S.stat.hordes,'Muro de contención',{ammo:50}],
 ['h50','🧟','Imparable','Supera 50 hordas',50,()=>S.stat.hordes,'Bastión',{steel:20}],
 ['h100','🧟','Leyenda del asedio','Supera 100 hordas',100,()=>S.stat.hordes,'Ciudad inexpugnable',{alloy:20}],
 ['p20','👥','Comunidad','Llega a 20 habitantes',20,()=>S.ppl.length,'Aldea',{wood:100}],
 ['p50','👥','Pueblo','Llega a 50 habitantes',50,()=>S.ppl.length,'Pueblo',{metal:100}],
 ['p100','👥','Ciudad','Llega a 100 habitantes',100,()=>S.ppl.length,'Ciudad',{brick:60}],
 ['p150','👥','Metrópolis','Llega a 150 habitantes',150,()=>S.ppl.length,'Metrópolis',{concrete:40}],
 ['d30','📅','Un mes vivos','Sobrevive 30 días',30,()=>S.day,'Los que resisten',{meds:10}],
 ['d100','📅','Cien días','Sobrevive 100 días',100,()=>S.day,'Centenarios',{meds:30}],
 ['d250','📅','Nueva era','Sobrevive 250 días',250,()=>S.day,'Nueva era',{alloy:15}],
 ['c5','📖','El camino','Completa 5 capítulos',5,()=>S.story||0,'Exploradores',{tarp:30}],
 ['c15','📖','La verdad','Completa 15 capítulos',15,()=>S.story||0,'Buscadores de la verdad',{glass:20}],
 ['c27','📖','La Torre','Completa 27 capítulos',27,()=>S.story||0,'Libertadores',{steel:40}],
 ['c48','📖','Fin de la historia','Completa toda la historia',()=>STORY.length,()=>S.story||0,'Héroes del Silencio',{alloy:60}],
 ['a5','🏛','Alcaldía','Ayuntamiento nivel 5',5,()=>hallLv(),'Alcaldía',{wood:150}],
 ['a10','🏛','Capital','Ayuntamiento nivel 10',10,()=>hallLv(),'Capital',{metal:200}],
 ['a15','🏛','Sede del Consejo','Ayuntamiento nivel 15',15,()=>hallLv(),'Sede del Consejo',{concrete:30}],
 ['a25','🏛','La ciudad renace','Ayuntamiento nivel 25',25,()=>hallLv(),'Ciudad renacida',{alloy:40}],
 ['b50','🏗','Constructores','Ten 50 edificios',50,()=>S.bld.filter(b=>b.type!=='road'&&b.type!=='wall'&&!(BT[b.type]&&BT[b.type].deco)).length,'Constructores',{plank:40}],
 ['b100','🏗','Urbanistas','Ten 100 edificios',100,()=>S.bld.filter(b=>b.type!=='road'&&b.type!=='wall'&&!(BT[b.type]&&BT[b.type].deco)).length,'Urbanistas',{sheet:40}],
 ['b200','🏗','Gran ciudad','Ten 200 edificios',200,()=>S.bld.filter(b=>b.type!=='road'&&b.type!=='wall'&&!(BT[b.type]&&BT[b.type].deco)).length,'Gran ciudad',{steel:30}],
 ['k100','🎯','Cazadores','Abate 100 infectados',100,()=>S.stat.kills,'Cazadores',{ammo:40}],
 ['k1000','🎯','Exterminadores','Abate 1.000 infectados',1000,()=>S.stat.kills,'Exterminadores',{ammo:100}],
 ['k10000','🎯','Plaga humana','Abate 10.000 infectados',10000,()=>S.stat.kills,'La plaga de la plaga',{alloy:25}],
 ['e10','🧭','Rastreadores','Completa 10 expediciones',10,()=>S.stat.exps,'Rastreadores',{gas:30}],
 ['e50','🧭','Cartógrafos','Completa 50 expediciones',50,()=>S.stat.exps,'Cartógrafos',{gas:80}],
 ['j1','☠','Matagigantes','Vence a un jefe',1,()=>(S.fin&&S.fin.bossN)||0,'Matagigantes',{steel:30}],
 ['r25','🤝','Refugio','Rescata a 25 supervivientes',25,()=>S.stat.rescued,'Refugio',{meds:25}],
 ['s20','🪖','Ejército','Ten 20 soldados alistados',20,()=>S.ppl.filter(p=>p.arm).length,'Fortaleza',{ammo:80}],
 ['t20','🔬','Sabios','Investiga 20 tecnologías',20,nT,'Ciudad de sabios',{rp:60}]];
const goal=d=>typeof d[4]==='function'?d[4]():d[4];
const val=d=>{try{return d[5]()||0}catch(e){return 0}};
const SEEN=new WeakSet();
function check(){if(!S||!S.stat||S.mode==='creativo')return;const g=L().got;let nuevos=[];
 D.forEach(d=>{if(g[d[0]])return;if(val(d)>=goal(d)){g[d[0]]=S.day;nuevos.push(d)}});
 if(!SEEN.has(S)){SEEN.add(S);/* primera vez que se mira esta partida: lo que ya tenía conseguido de antes de existir los logros se da por hecho, sin avisos ni recompensas */if(nuevos.length&&!L().ini&&S.day>3){L().ini=1;L().tit=L().tit||nuevos[nuevos.length-1][6];return}L().ini=1}
 nuevos.forEach((d,i)=>{L().nuevo++;for(const k in d[7])S.res[k]=(S.res[k]||0)+d[7][k];setTimeout(()=>{try{toast('🏅 Logro: '+d[2]+' · título «'+d[6]+'» · +'+cs(d[7]))}catch(e){}try{notify('🏅','Logro: '+d[2],d[3]+'. Título nuevo: «'+d[6]+'».','pueblo')}catch(e){}},800+i*1200)})}
setInterval(()=>{try{check()}catch(e){}},2000);
window.logroPend=()=>{try{return L().nuevo>0}catch(e){return false}};
window.logroTit=n=>{L().tit=n;try{save()}catch(e){}logrosMenu()};
const bar=v=>`<div class="lg-bar"><i style="width:${Math.round(Math.max(0,Math.min(1,v))*100)}%"></i></div>`;
window.logrosMenu=function(){const l=L();l.nuevo=0;const g=l.got,n=Object.keys(g).length;
 const tits=D.filter(d=>g[d[0]]).map(d=>d[6]);
 const h=`<div class="lg-top"><div><small>Título de tu pueblo</small><b>${l.tit?'«'+l.tit+'»':'— sin título —'}</b></div><div class="lg-n"><b>${n}</b>/${D.length}<small>logros</small></div></div>
 ${tits.length?`<small style="color:#b9b39c">Elige el título (desliza):</small><div class="lg-tits">${tits.map(t=>`<button class="${l.tit===t?'on':''}" onclick="logroTit('${t.replace(/'/g,"\\'")}')">${t}</button>`).join('')}</div>`:''}
 <div class="lg-g">${D.map(d=>{const ok=!!g[d[0]],G=goal(d),v=Math.min(G,val(d));return `<div class="lg-c ${ok?'ok':''}"><span class="lg-i">${ok?d[1]:'🔒'}</span><div class="lg-m"><b>${d[2]}</b><small>${d[3]}</small>${ok?`<small class="lg-d">Conseguido el día ${g[d[0]]} · título «${d[6]}»</small>`:bar(v/G)+`<small>${v.toLocaleString('es')}/${G.toLocaleString('es')} · ${cs(d[7])}</small>`}</div></div>`}).join('')}</div>`;
 show('🏅 Logros',h)};
/* título en la ficha del ayuntamiento */
const oB=window.bPanel;window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id],t=L().tit;if(b&&b.type==='hall'&&t){const n=document.querySelector('#pan .bp2n');if(n&&!n.querySelector('.lg-tt'))n.insertAdjacentHTML('beforeend',`<small class="lg-tt">«${t}»</small>`)}}catch(e){}return r};
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('lgBtn'))return;const b=document.createElement('button');b.id='lgBtn';b.innerHTML='<i class="ib">🏅</i>Logros';b.onclick=()=>{try{tg(0)}catch(e){}logrosMenu()};rl.insertBefore(b,rl.children[6]||null)}
setTimeout(addBtn,1500);setTimeout(addBtn,4000);
const st=document.createElement('style');st.textContent=`.lg-top{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;border:1px solid #c9a23a;background:linear-gradient(180deg,#2a2412,#1a160a);margin-bottom:6px}.lg-top>div:first-child{flex:1}.lg-top small{display:block;color:#b9b39c;font-size:10.5px}.lg-top b{color:#ffe9a8;font-size:15px}.lg-n{text-align:center}.lg-n b{font:900 22px system-ui;color:#ffe9a8}
.lg-tits{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:4px;margin-bottom:7px;padding-bottom:3px}#pan .lg-tits button{flex:0 0 auto}#pan .lg-tits button{min-height:0;padding:3px 8px;font-size:11px;border-radius:12px;border:1px solid #6a7a4a;background:#1d2618;color:#d8dfcc}#pan .lg-tits button.on{background:#5a4a12;border-color:#c9a23a;color:#ffe9a8}
.lg-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}.lg-c{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:9px;border:1px solid #3a4434;background:#141a10;opacity:.75}.lg-c.ok{opacity:1;border-color:#c9a23a;background:linear-gradient(180deg,#2a2412,#1a160a)}
.lg-i{font-size:22px;width:28px;text-align:center}.lg-m{flex:1;min-width:0}.lg-m b{font-size:12.5px;color:#f2e6c0}.lg-m small{display:block;font-size:10.5px;color:#b9b39c}.lg-d{color:#e8b84a!important}
.lg-bar{height:5px;background:#0d120c;border-radius:3px;overflow:hidden;margin:3px 0}.lg-bar i{display:block;height:100%;background:#e0a124}.lg-tt{display:block;font-size:12px;color:#e8b84a;font-weight:700}`;document.head.appendChild(st);
})();
