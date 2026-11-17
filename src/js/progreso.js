/* ===== Progresión: las mecánicas se abren con la historia y el ayuntamiento (st = capítulos completados, h = nivel de ayuntamiento) ===== */
(function(){
'use strict';
const MECH=[
 {id:'base',n:'Construcción y supervivientes',ic:'🔨',st:0,h:1,d:'Casas, granjas, pozos, muros y trabajo de tus supervivientes.'},
 {id:'zonas',n:'Expediciones cercanas',ic:'🧭',st:0,h:1,d:'Registrar zonas próximas en busca de recursos.'},
 {id:'ejercito',n:'Ejército, torres y defensas',ic:'🛡',st:0,h:2,d:'Barracones, torres de vigilancia, trampas y soldados.'},
 {id:'hist',n:'Misiones de historia',ic:'📖',st:0,h:3,d:'Los capítulos que mueven la trama y abren el mundo.'},
 {id:'cor',n:'Infectados corredores',ic:'🏃',st:1,h:1,d:'Aparecen en las hordas: rápidos y frágiles.',info:1},
 {id:'villa',n:'Villa Esperanza',ic:'🏘',st:1,h:3,d:'Comercio, empeños y gasolinera. Moneda: fichas.'},
 {id:'taberna',n:'Taberna: reclutar supervivientes',ic:'🍺',st:2,h:3,d:'Candidatos con ficha completa que cambian cada 5 días.'},
 {id:'armeria',n:'Armería de la villa',ic:'🔧',st:3,h:3,d:'Armas, armaduras y planos con rareza limitada.'},
 {id:'cuervos',n:'Los Cuervos',ic:'🐦‍⬛',st:3,h:3,d:'Una nota negra en el hospital: Los Cuervos tienen a Irene. Nuevas misiones en el tablón de la villa.'},
 {id:'gordos',n:'Infectados gordos',ic:'🧟',st:3,h:3,d:'Muy resistentes: obligan a concentrar el fuego.',info:1},
 {id:'tablon',n:'Tablón de encargos de la villa',ic:'📋',st:4,h:4,d:'Fichas de exploración que rotan y dan recompensas.'},
 {id:'viboras',n:'Las Víboras',ic:'🐍',st:6,h:4,d:'Coordenadas con una serpiente violeta en el sobre de CENIZA: pista de Las Víboras en el tablón de la villa.'},
 {id:'soldadoz',n:'Infectados soldado',ic:'🪖',st:6,h:4,d:'Zombis con uniforme: mucha vida y daño.',info:1},
 {id:'casino',n:'Casino de la villa',ic:'🎰',st:6,h:4,d:'Apuestas con fichas: riesgo y recompensa.'},
 {id:'guardia',n:'La Guardia del Alba',ic:'🛡',st:8,h:4,d:'El Faro os dio su frecuencia de radio: operaciones de la Guardia en el tablón de la Guardia.'},
 {id:'ceniza',n:'CENIZA',ic:'🔥',st:10,h:5,d:'La facción de Brandt ataca para destruir.'}];
const byId={};MECH.forEach(m=>byId[m.id]=m);
const creative=()=>{try{return S.mode==='creativo'}catch(e){return false}};
const stv=()=>{try{return S.story||0}catch(e){return 0}};
const hall=()=>{try{return realHall()}catch(e){return 1}};
const ok=id=>{const m=byId[id];if(!m)return true;return creative()||(stv()>=m.st&&hall()>=m.h)};
const need=id=>{const m=byId[id];if(!m)return'';const a=[];if(stv()<m.st)a.push('completar el capítulo '+m.st);if(hall()<m.h)a.push('ayuntamiento nivel '+m.h);return a.join(' y ')};
const hallCap=()=>{const s=stv(),L=typeof STORY!=='undefined'?STORY:[];return s>=L.length?25:(L[s]&&L[s].h)||25};
/* ¿en qué capítulo se desbloquea el nivel L del ayuntamiento? k = capítulos que hay que tener completados */
const hallUnlock=L=>{const st=typeof STORY!=='undefined'?STORY:[];for(let k=stv();k<=st.length;k++){const c=k>=st.length?25:(st[k]&&st[k].h)||25;if(c>=L)return {k,n:k>0&&st[k-1]?st[k-1].n:'',falta:k-stv()}}return null};
window.hallUnlockTxt=L=>{const u=hallUnlock(L);if(!u)return '';return 'El nivel '+L+' del ayuntamiento se desbloquea al completar '+(u.n||('el capítulo '+u.k))+(u.falta>0?' (te '+(u.falta===1?'falta 1 capítulo':'faltan '+u.falta+' capítulos')+').':'.')};
window.PROG={ok,need,hallCap,MECH,byId};
/* ---- cada lugar de la villa se abre con la historia ---- */
const VP={empeno:'villa',mercado:'villa',clinica:'villa',gasolinera:'villa',taberna:'taberna',armeria:'armeria',tablon:'tablon',casino:'casino'};
(function(){const o=window.villaGo;if(typeof o!=='function')return;window.villaGo=function(k){const id=VP[k];if(id&&!ok(id)){const m=byId[id];try{toast('🔒 '+m.n+': necesitas '+need(id)+'.')}catch(e){}return}return o.apply(this,arguments)}})();
/* ---- el ayuntamiento avanza a la par que la historia ---- */
(function(){const o=window.upg;if(typeof o!=='function')return;window.upg=function(id){try{const b=bm[id];if(b&&b.type==='hall'&&!creative()&&b.lvl<25){const c=hallCap();if(b.lvl>=c){toast('🔒 '+hallUnlockTxt(b.lvl+1));return}}}catch(e){}return o.apply(this,arguments)}})();
/* ---- avisos de desbloqueo ---- */
function check(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return;const first=!S.pg;if(first)S.pg={seen:{}};const sn=S.pg.seen;
 MECH.forEach(m=>{if(ok(m.id)&&!sn[m.id]){sn[m.id]=1;if(!first&&!creative()){try{notify('🔓','Nueva mecánica: '+m.n,m.d,'historia');if(window.tutShow)window.tutShow(m.id);else toast('🔓 Nueva mecánica: '+m.n)}catch(e){}}}});
 const vb=document.getElementById('vlBtn'),gb=document.getElementById('gdBtn');[[vb,'villa'],[gb,'guardia']].forEach(([b,id])=>{if(!b)return;const lk=!ok(id);b.style.opacity=lk?.55:'';b.dataset.lk=lk?'1':''})}catch(e){}}
setInterval(check,2500);
/* ---- panel de progresión ---- */
function panel(){const s=stv(),n=typeof STORY!=='undefined'?STORY.length:28,h=hall(),cap=hallCap(),nx=STORY[s],pct=Math.min(100,s/n*100);
 const row=m=>{const o=ok(m.id);return `<div class="vl-row" style="${o?'':'opacity:.6'}"><span style="font-size:22px;width:28px;text-align:center">${o?m.ic:'🔒'}</span><div style="flex:1"><b>${o?m.n:'???'}</b><small>${o?m.d:'Requiere '+need(m.id)+'.'}</small></div>${o&&m.id!=='base'&&m.id!=='zonas'?`<button onclick="tutOpen('${m.id}')" style="padding:4px 10px;font-size:12px">Tutorial</button>`:''}</div>`};
 const open=MECH.filter(m=>ok(m.id)),lock=MECH.filter(m=>!ok(m.id));
 show('Progresión',`<p>La historia y tu ayuntamiento avanzan juntos: cada capítulo exige un nivel de ayuntamiento, y el ayuntamiento no sube más allá de lo que pide el siguiente capítulo.</p>
 <div class="mu-sts"><div class="mu-st"><span>📖</span><b>${s}/${n}</b><small>Capítulos</small></div><div class="mu-st"><span>🏛</span><b>Nv ${h}</b><small>Tope actual ${cap}</small></div></div>
 ${cap<25&&!creative()?`<p style="margin:4px 0;color:#f2d27a">🔒 ${hallUnlockTxt(cap+1)}</p>`:''}
 <div style="height:6px;background:#0d120c;border-radius:4px;margin:2px 0 8px;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:linear-gradient(90deg,#c8921a,#f2c542)"></i></div>
 ${nx?`<div class="vl-q"><div><b>Siguiente: ${esc(nx.n)}</b><small>Requiere ayuntamiento nivel ${nx.h}${h>=nx.h?' · ¡ya puedes empezarlo!':' · te faltan '+(nx.h-h)+' nivel(es)'}</small></div></div>`:''}
 <div class="mu-h">Desbloqueado <small>${open.length}</small></div><div class="vl-list">${open.map(row).join('')}</div>
 ${lock.length?`<div class="mu-h">Por desbloquear <small>${lock.length}</small></div><div class="vl-list">${lock.map(row).join('')}</div>`:''}`)}
const esc=s=>String(s).replace(/[<>&]/g,'');
window.progresoMenu=panel;
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('pgBtn'))return;const b=document.createElement('button');b.id='pgBtn';b.innerHTML='<i class="ib">📈</i>Progresión';b.onclick=()=>{try{tg(0)}catch(e){}panel()};const g=[...rl.children].find(x=>/Guía/.test(x.textContent));rl.insertBefore(b,g||rl.lastElementChild)}
addBtn();document.addEventListener('DOMContentLoaded',addBtn);setTimeout(addBtn,900);
})();
