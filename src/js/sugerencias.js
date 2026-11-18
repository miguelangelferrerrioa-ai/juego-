/* «¿Qué hago ahora?»: una tarjeta pequeña arriba a la izquierda (bajo Opciones) con el siguiente paso más útil.
   Se recalcula cada pocos segundos; al tocarla abre el menú adecuado; con ✕ se oculta esa sugerencia hasta que cambie.
   No se muestra durante hordas, con un panel abierto o con Opciones desplegado. Solo nombra edificios ya desbloqueados. */
(function(){
'use strict';
const av=t=>{try{return !!BT[t]&&avail(t)}catch(e){return false}};
const hall=()=>{try{return S.bld.find(b=>b.type==='hall')}catch(e){return null}};
const tab=t=>()=>{window.bTab=t;buildMenu()};
function rules(){const R=[];const pop=S.ppl.filter(p=>!p.away).length,eat=(typeof EAT==='number'?EAT:2.5);
 if(S.res.food<pop*eat*1.5)R.push(['🌾','Queda poca comida: construye '+(av('greenh')?'un invernadero o ':'')+'una granja y asigna agricultores.','Construir',tab('rec')]);
 if(S.res.water<pop*eat*1.5)R.push(['💧','Queda poca agua: construye un pozo'+(av('pump')?' o una estación de bombeo':'')+'.','Construir',tab('rec')]);
 try{const pw=powCalc();if(pw&&(pw.over||pw.sup<pw.dem))R.push(['⚡','Falta energía y hay edificios parados: construye '+(av('solar')?'una granja solar o ':'')+'un generador.','Construir',tab('prod')])}catch(e){}
 try{const e=hordeEst();if(e&&e.days<=1&&e.v==='Insuficiente')R.push(['🧟','La próxima horda llega '+(e.days<=0?'hoy':'mañana')+' y tu defensa no basta: construye torres o alista soldados.','Defensa',tab('def')])}catch(e){}
 const dmg=S.bld.filter(b=>b.hp<mxhp(b)*.7&&b.type!=='road').length;if(dmg>=3)R.push(['🔧','Tienes '+dmg+' edificios dañados: repáralos desde el ayuntamiento.','Reparar',()=>{try{repMenu()}catch(e){const h=hall();h&&bPanel(h.id)}}]);
 try{if(pop>=pcap())R.push(['🏠','No caben más supervivientes: construye casas o mejóralas.','Construir',tab('ciudad')])}catch(e){}
 const idle=S.ppl.filter(p=>!p.away&&!p.job&&!p.arm&&p.age>=18&&!p.preg&&!p.inside).length;if(idle>=2)R.push(['👷',idle+' supervivientes no tienen trabajo: asígnales un puesto.','Ver gente',()=>{try{pplMenu()}catch(e){}}]);
 try{if(window.finReady&&finReady())R.push(['🏆','Tienes un reto semanal listo para reclamar.','Retos',()=>finMenu()])}catch(e){}
 try{if(window.logroPend&&logroPend())R.push(['🏅','Has conseguido logros nuevos: mira tus recompensas.','Logros',()=>logrosMenu()])}catch(e){}
 try{const c=STORY[S.story];if(c&&!S.exp&&cnt('expo')>0&&hallLv()>=c.h&&!(window.chLocked&&chLocked(S.story)))R.push(['📖','Ya puedes empezar el '+c.n.split('·')[0].trim().toLowerCase()+': '+(c.n.split('·')[1]||'').trim()+'.','Historia',()=>{window.exTab='hist';expMenu()}])}catch(e){}
 try{const h=hall();if(h&&window.PROG){const cap=PROG.hallCap();if(h.lvl<cap&&h.lvl<25){const c=costOf(hallCost(h.lvl),1);if(can(c))R.push(['🏛','Puedes mejorar el ayuntamiento a nivel '+(h.lvl+1)+'.','Ayuntamiento',()=>bPanel(h.id)])}else if(h.lvl>=cap&&h.lvl<25&&window.hallUnlockTxt)R.push(['📖',hallUnlockTxt(h.lvl+1),'Historia',()=>{window.exTab='hist';expMenu()}])}}catch(e){}
 try{if(window.rpOn&&rpOn()&&(!S.rq||!S.rq.length))R.push(['🔬','El laboratorio está parado: elige algo que investigar.','Investigar',()=>techMenu()])}catch(e){}
 return R}
let el=null,cur=null,hid={},last=0;
function box(){if(el)return el;el=document.createElement('div');el.id='qhn';document.body.appendChild(el);
 el.addEventListener('click',e=>{const x=e.target.closest('[data-x]');if(x){e.stopPropagation();if(cur)hid[cur[1]]=1;tick(1);return}if(cur&&cur[3]){try{cur[3]()}catch(er){}}});return el}
function busy(){try{if(typeof horde!=='undefined'&&horde)return true;const p=document.getElementById('pan');if(p&&p.style.display==='block')return true;const rl=document.getElementById('rl');if(rl&&getComputedStyle(rl).display!=='none'&&rl.offsetHeight>0)return true;if(window._ttOpen||window._qmShown&&_qmShown())return true;const ts=document.getElementById('titleScreen');if(ts&&ts.style.display!=='none'&&ts.style.display!=='')return true;if(window.placing)return true}catch(e){}return false}
function tick(force){try{if(!S||!S.bld||!S.bld.length||S.mode==='creativo'){if(el)el.style.display='none';return}const e=box();if(busy()){e.style.display='none';return}
 const now=performance.now();if(!force&&now-last<4000&&cur){e.style.display='flex';return}last=now;
 const R=rules().filter(r=>!hid[r[1]]);cur=R[0]||null;if(!cur){e.style.display='none';return}
 const op=document.querySelector('#rail>button');const r=op?op.getBoundingClientRect():{left:8,bottom:60};e.style.left=Math.max(6,r.left)+'px';e.style.top=(r.bottom+6)+'px';
 e.innerHTML=`<span class="qh-i">${cur[0]}</span><div class="qh-t"><small>¿Qué hago ahora?</small>${cur[1]}</div><b class="qh-a">${cur[2]} ›</b><span class="qh-x" data-x="1">✕</span>`;e.style.display='flex'}catch(er){}}
setInterval(()=>tick(0),700);
const st=document.createElement('style');st.textContent=`#qhn{position:fixed;z-index:40;display:none;align-items:center;gap:7px;max-width:min(300px,34vw);padding:5px 7px 5px 8px;border-radius:11px;background:rgba(14,19,11,.9);border:1.5px solid #c9a23a;color:#e8e2cc;font:600 11.5px/1.25 system-ui;box-shadow:0 3px 12px #0008;cursor:pointer;animation:qhin .4s ease-out}
@keyframes qhin{from{opacity:0;transform:translateY(-6px)}to{opacity:1}}#qhn .qh-i{font-size:19px}#qhn .qh-t{flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-size:11px}#qhn small{display:block;color:#f2d27a;font-weight:900;font-size:9.5px;letter-spacing:.04em;text-transform:uppercase}
#qhn .qh-a{flex:0 0 auto;color:#241a04;background:linear-gradient(180deg,#e8b84a,#b8861e);border-radius:7px;padding:4px 7px;font-size:10.5px}#qhn .qh-x{flex:0 0 auto;color:#9a9c8e;font-size:12px;padding:2px 3px}`;document.head.appendChild(st);
})();
