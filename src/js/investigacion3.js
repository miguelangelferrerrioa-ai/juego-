/* ===== Estudios especiales (panel del Laboratorio y de la Estación de radio) =====
   Autopsias (aut1): los infectados especiales dejan muestras al morir (40 %). Con 3 muestras y 25 PI se estudia el tipo:
     el pueblo le hace +15 % de daño y la guía muestra su punto débil.
   Ingeniería inversa (rev1): se desmonta un arma o atuendo del almacén del que no se tiene plano (20 PI) y se aprende a fabricarlo.
   Química (chem1): munición incendiaria y perforante (1 lote por horda, se elige en el laboratorio) y explosivos para las trampas.
   Descifrado de señales (sig1): la Estación de radio descifra transmisiones; cada una revela un lugar nuevo para expediciones
     (con plano garantizado si sale bien).
   Planos perdidos: con laboratorio y ayuntamiento 6+, las expediciones a veces traen un trozo de plano; 3 trozos = mejora única.
   Estado: S.es={smp,aut,ch:{inc,perf,exp},am,tx,sig:{p,n},frag,lp}. */
(function(){
'use strict';
if(typeof TECH==='undefined')return;
[['aut1','Medicina','Autopsias',7,{},'Los infectados especiales dejan muestras. Al estudiarlas, el pueblo les hace +15% de daño'],
 ['rev1','Armamento','Ingeniería inversa',8,{},'Desmonta armas y atuendos encontrados para aprender a fabricarlos'],
 ['sig1','Exploración','Descifrado de señales',8,{},'La estación de radio descifra transmisiones que revelan lugares nuevos'],
 ['chem1','Armamento','Química',9,{},'Munición incendiaria y perforante para las hordas y explosivos para las trampas']].forEach(t=>{if(!TECH.some(q=>q[0]===t[0]))TECH.push(t)});
if(window.TECH_PRE)Object.assign(TECH_PRE,{aut1:['med2'],rev1:['arms2'],sig1:['expl2'],chem1:['arms2']});
if(window.rpFix)rpFix();
const has=id=>{try{return !!(S.tech&&S.tech[id])}catch(e){return false}};
const E=()=>{const e=S.es=S.es||{};e.smp=e.smp||{};e.aut=e.aut||{};e.ch=e.ch||{inc:0,perf:0,exp:0};e.sig=e.sig||{p:0,n:0};e.lp=e.lp||{};e.frag=e.frag||0;if(e.tx==null)e.tx=1;e.am=e.am||'';return e};
const esc=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'})[c]);
const icc=c=>{try{return Object.keys(c).map(k=>`<span class="bp2k ${(S.res[k]||0)>=c[k]||S.mode==='creativo'?'':'no'}"><img src="${ICO[k]||''}" width=12>${c[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`).join('')}catch(e){return cs(c)}};
const hasB=t=>{try{return S.bld.some(b=>b.type===t&&!b.cons)}catch(e){return false}};
const sv=()=>{try{save()}catch(e){}};
/* ---------- 1. autopsias ---------- */
const SPX='f s r u j t q h g a v x w i l'.split(' ');
const WEAK={f:'Lento y con mucha vida: dispárale desde lejos y que no llegue a los muros.',s:'Su chaleco frena las balas: la munición perforante lo atraviesa.',
 r:'Muy poca vida pero muy rápido: pon torres cerca de las puertas.',u:'Revienta muros a golpes: fosos y trampas lo frenan antes de llegar.',
 j:'El caballo corre mucho pero aguanta poco: concentra el fuego en cuanto aparezca.',t:'Salta los muros: hacen falta soldados dentro, no solo torres.',
 q:'Escupe desde lejos y tiene poca vida: los tiradores lo tumban antes de que dispare.',h:'Agarra a la gente que va sola: nadie fuera de los muros durante la horda.',
 g:'Su grito atrae a más zombis y los acelera: mátalo el primero.',a:'Su coraza frena casi todo: perforante y explosivos le hacen mucho más daño.',
 v:'Lento y débil, pero en grupo tapona el paso: no merece la pena gastar explosivos en él.',x:'Excava por debajo de los muros: deja soldados dentro del pueblo.',
 w:'Derriba puertas de un golpe: fosos y alambrada lo desgastan mientras empuja.',i:'Arde y prende lo que toca: la munición incendiaria no le hace nada; mantenlo lejos de las casas.',
 l:'Hace más fuertes a los zombis que tiene cerca: acaba con él y la horda se debilita.'};
const ARM=new Set(['s','a','u','w']);
window.autStudy=t=>{const e=E();if(!has('aut1')||e.aut[t])return;if((e.smp[t]||0)<3)return toast('Hacen falta 3 muestras.');if((S.res.rp||0)<25&&S.mode!=='creativo')return toast('Faltan puntos de investigación (25).');
 e.smp[t]-=3;if(S.mode!=='creativo')S.res.rp-=25;e.aut[t]=1;toast('🔬 Autopsia completada: '+ZT[t].n+'. Ahora le hacéis +15 % de daño.');sv();esRe()};
/* ---------- 2. ingeniería inversa ---------- */
const craftOf=it=>{if(!it||!it.n)return null;if(it.kind==='outfit'){const o=(window.OUTFITS||{})[it.n];return o&&o.c?o:null}if(it.kind)return null;const w=WP.find(q=>q.n===it.n);return w&&w.c?w:null};
const revList=()=>(S.inv||[]).map((it,i)=>({it,i})).filter(o=>craftOf(o.it)&&!(window.hasPlan&&hasPlan(o.it.n)));
window.revDo=i=>{if(!has('rev1'))return;const it=S.inv[i];if(!craftOf(it)||(window.hasPlan&&hasPlan(it.n)))return;if((S.res.rp||0)<20&&S.mode!=='creativo')return toast('Faltan puntos de investigación (20).');
 if(S.mode!=='creativo')S.res.rp-=20;S.inv.splice(i,1);S.bp=S.bp||{};S.bp[it.n]=1;S.res.scrap=(S.res.scrap||0)+10;toast('🔧 Desmontado: ya sabéis fabricar '+it.n+' (+10 chatarra).');sv();esRe()};
/* ---------- 3. química ---------- */
const CH={inc:{n:'Munición incendiaria',ic:'🔥',c:{chem:12,gas:8},d:'Durante una horda, cada disparo prende al zombi: arde 4 segundos (5 de daño por segundo). Al incendiario no le hace nada.'},
 perf:{n:'Munición perforante',ic:'🎯',c:{scrap:30,metal:15},d:'Durante una horda: +30 % de daño a soldados, acorazados, musculosos y arietes; +10 % al resto.'},
 exp:{n:'Explosivos',ic:'✹',c:{chem:15,scrap:10},d:'Se cargan en las trampas: cuando un zombi la pisa, explota (90 de daño alrededor). Una carga por explosión.'}};
const CMAX=5;
window.chemMake=k=>{const e=E(),r=CH[k];if(!has('chem1')||!r)return;if(e.ch[k]>=CMAX)return toast('Almacén lleno ('+CMAX+').');const c=costOf(r.c,1);if(!can(c))return toast('Faltan materiales.');pay(c);e.ch[k]++;toast(r.ic+' Fabricado: '+r.n);sv();esRe()};
window.chemSetA=v=>{E().am=v;sv()};window.chemSetT=v=>{E().tx=v==='1'?1:0;sv()};
/* ---------- 4. señales de radio ---------- */
const RZ=[{id:'rbunker',n:'Búnker del gobierno',kind:'Militar',icon:'🛡️',x:12,y:64,h:8,g:4,dist:4,loot:{ammo:[40,80],steel:[8,18],comp:[6,14],meds:[10,25]},intro:'La señal repetía unas coordenadas y una contraseña. Bajo una colina hay una compuerta blindada.'},
 {id:'rlab',n:'Laboratorio escondido',kind:'Ciencia',icon:'🧪',x:79,y:8,h:9,g:4,dist:5,loot:{rp:[30,60],meds:[20,40],chem:[15,30],comp:[5,12]},intro:'Una voz grabada pedía que alguien recogiera «las muestras». El laboratorio está bajo una granja.'},
 {id:'rdepot',n:'Depósito de suministros',kind:'Almacén',icon:'📦',x:26,y:77,h:10,g:5,dist:5,loot:{scrap:[60,120],metal:[40,80],gas:[15,30],sheet:[10,25]},intro:'Un camionero anunciaba un depósito lleno antes de que se cortara la señal. Nadie ha vuelto a hablar desde allí.'},
 {id:'rtower',n:'Torre de comunicaciones',kind:'Antena',icon:'📡',x:56,y:79,h:11,g:5,dist:6,loot:{comp:[10,22],glass:[10,25],steel:[10,20],alloy:[2,5]},intro:'La última señal salía de lo alto de una antena. Alguien sigue emitiendo cada noche a la misma hora.'}];
try{RZ.forEach(z=>{z.radio=1;if(!EXT_ZONES.some(q=>q.id===z.id))EXT_ZONES.push(z)})}catch(e){}
const zGot=z=>{try{return S.mode==='creativo'||RZ.indexOf(z)<E().sig.n}catch(e){return false}};
window.zVis=z=>{if(!z)return false;if(z.radio)return zGot(z);if(S.mode==='creativo')return true;const B=EXT_ZONES.filter(q=>!q.radio);return B.indexOf(z)<Math.ceil(((S.story||0)+1)*B.length/STORY.length)};
const radios=()=>S.bld.filter(b=>b.type==='radio'&&!b.cons&&!b.pause);
const nW=b=>S.ppl.filter(p=>p.job==b.id&&!p.away).length;
const sigRate=()=>{const R=radios();if(!R.length)return 0;const b=R.reduce((m,x)=>x.lvl>m.lvl?x:m,R[0]),n=nW(b);return n?(.2+.15*n)*(1+.1*((b.lvl||1)-1)):0};
/* ---------- 5. planos perdidos ---------- */
const LP=[['well','Pozo profundo','Pozos +30 % de agua',.3],['farm','Riego por goteo','Granjas +20 % de comida',.2],['saw','Sierra de cinta','Aserraderos +25 % de madera',.25],
 ['scrapy','Prensa de chatarra','Desguaces +25 % de chatarra',.25],['quarry','Barrenos','Canteras +25 % de piedra',.25],['cart','Carro de carga','Expediciones +15 % de botín',.15]];
const fragOn=()=>{try{return S.mode!=='creativo'&&hasB('lab')&&realHall()>=6}catch(e){return false}};
window.lpBuild=()=>{const e=E();if(e.frag<3)return;const L=LP.filter(q=>!e.lp[q[0]]);if(!L.length)return toast('Ya tenéis todas las mejoras.');const q=L[Math.floor(Math.random()*L.length)];e.frag-=3;e.lp[q[0]]=1;toast('🧩 Plano reconstruido: '+q[1]+'. '+q[2]+'.');sv();esRe()};
const oOut=window.out;if(typeof oOut==='function'){window.out=function(b){const o=oOut.apply(this,arguments);try{if(!o||!S.es||!S.es.lp)return o;const q=LP.find(x=>x[0]===b.type&&S.es.lp[x[0]]);if(q)for(const r in o)if(o[r]>0)o[r]*=1+q[3]}catch(e){}return o};try{out=window.out}catch(e){}}
/* ---------- expediciones: trozos de plano, plano garantizado en zonas de radio, carro de carga ---------- */
const oEx=window.exEnd;if(typeof oEx==='function'){window.exEnd=function(){let fr=0,pl=null;try{const e=S.exp,ee=E();if(e&&e.loot&&e.team&&e.team.length){
  if(ee.lp.cart)for(const k in e.loot)e.loot[k]*=1.15;
  if(fragOn()&&(e.ok||0)>=1&&Math.random()<(e.z&&e.z.radio?.6:.25)){ee.frag++;fr=1}
  if(e.z&&e.z.radio&&(e.ok||0)>=2&&window.givePlan)pl=givePlan(5)}}catch(err){}
 const r=oEx.apply(this,arguments);try{if(pl)toast('📜 En '+'la zona de la señal encontráis un plano: '+pl.n);if(fr)setTimeout(()=>{try{toast('🧩 La expedición trae un trozo de plano roto ('+S.es.frag+' de 3).')}catch(e){}},pl?1800:0)}catch(e){}return r};try{exEnd=window.exEnd}catch(e){}}
/* ---------- tiempo: daño extra, muestras, quemaduras, explosivos, señales ---------- */
let TR=new Set(),lastH=null,acc=0;const BOOM=[];
const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{if(!S||!S.bld)return r;const e=E();
  /* inicio de horda: carga un lote de munición especial */
  if(horde&&horde!==lastH){lastH=horde;const k=e.am;if(has('chem1')&&k&&e.ch[k]>0){e.ch[k]--;horde.chem=k;toast(CH[k].ic+' Los defensores cargan '+CH[k].n.toLowerCase()+' ('+e.ch[k]+' en reserva).')}}
  if(!horde)lastH=null;
  const hc=horde&&horde.chem,cur=new Set();
  for(const z of Z){if(!z.act)continue;
   if(z._h!=null&&z.hp<z._h&&z.hp>-999){const d=z._h-z.hp;let m=0;if(e.aut[z.t])m+=.15;if(hc==='perf')m+=ARM.has(z.t)?.3:.1;if(m)z.hp-=d*m;if(hc==='inc'&&z.t!=='i'&&!z.bur)z.burn=4}
   if(z.burn>0){z.burn-=dt;z.hp-=5*dt}
   z._h=z.hp;if(SPX.includes(z.t))cur.add(z)}
  if(has('aut1'))TR.forEach(z=>{if(!cur.has(z)&&z.hp<=0&&Math.random()<.4){e.smp[z.t]=(e.smp[z.t]||0)+1;if(!e.smp1){e.smp1=1;toast('🧪 Muestra recogida: '+ZT[z.t].n+'. Estúdiala en el laboratorio.')}}});
  TR=cur;
  acc+=dt;if(acc>=.25){const k=Math.min(acc,.5);acc=0;
   for(let i=BOOM.length-1;i>=0;i--){BOOM[i].t-=k;if(BOOM[i].t<=0)BOOM.splice(i,1)}
   if(has('chem1')&&e.tx&&e.ch.exp>0&&Z.length)for(const b of S.bld){if(b.type!=='trap')continue;if(b.xcd>0){b.xcd-=k;continue}
    const cx=b.x+.5,cy=b.y+.5;if(!Z.some(z=>z.act&&z.hp>0&&Math.hypot(cx-z.x,cy-z.y)<.8))continue;
    e.ch.exp--;b.xcd=30;Z.forEach(z=>{if(z.act&&Math.hypot(cx-z.x,cy-z.y)<1.6)z.hp-=90});
    try{FX.push({boom:1,x:cx,y:cy,t:.5});burst(cx,cy,18,'#ff9a30',3,12);burst(cx,cy,10,'#444',2,6);SHK=Math.max(SHK||0,.25);sfxAt('crumble',cx,cy,{rate:1.4,v:.7})}catch(er){}
    if(!e.ch.exp)toast('💣 Se han acabado los explosivos de las trampas.');if(!e.ch.exp)break}
   /* señales */
   if(has('sig1')&&e.sig.n<RZ.length&&!horde){const rt=sigRate();if(rt){e.sig.p+=rt*k/600;if(e.sig.p>=1){e.sig.p=0;const z=RZ[e.sig.n];e.sig.n++;
     try{toast('📻 Señal descifrada: '+z.n+'. Ya aparece en el mapa de expediciones.');window.notify&&notify('📻','Señal descifrada',z.n+': '+z.intro,'pueblo');window.diarioAdd&&diarioAdd('📻','Señal descifrada: '+z.n,'pueblo')}catch(er){};sv()}}}}
 }catch(err){window.__esErr=String(err)}return r};
try{upd=window.upd}catch(e){}
/* ---------- dibujo: zombis ardiendo ---------- */
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{if(!horde||horde.chem!=='inc'||!Z.length)return r;
  const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);c.globalCompositeOperation='lighter';let n=0;
  for(const z of Z){if(!(z.burn>0)||z.hp<=0||!z.act)continue;if(++n>70)break;const p=P(z.x,z.y),h=(ZT[z.t]&&ZT[z.t].big)?30:22,a=Math.min(1,z.burn);
   for(let i=0;i<3;i++){const ph=T*9+i*2.1+z.x*3,fx=p[0]+(i-1)*4+Math.sin(ph)*1.5,fy=p[1]-h*.45-i%2*4,fh=9+Math.sin(ph*1.3)*3;
    const g=c.createRadialGradient(fx,fy,0,fx,fy-fh*.3,fh);g.addColorStop(0,'rgba(255,230,140,'+(.85*a)+')');g.addColorStop(.5,'rgba(255,120,30,'+(.55*a)+')');g.addColorStop(1,'rgba(200,40,0,0)');
    c.fillStyle=g;c.beginPath();c.ellipse(fx,fy-fh*.3,fh*.45,fh,0,0,7);c.fill()}}
  c.restore()}catch(e){}return r};try{render=window.render}catch(e){}}
/* ---------- panel del laboratorio ---------- */
const TABS=[['aut','🧪','Autopsias','aut1'],['rev','🔧','Ingeniería inversa','rev1'],['chem','⚗️','Química','chem1'],['lp','🧩','Planos perdidos','']];
let lastLab=0;window.esTab=t=>{window.ESTAB=t;esRe()};
function esRe(){try{if(lastLab&&bm[lastLab]&&typeof sel!=='undefined'&&sel===lastLab)bPanel(lastLab)}catch(e){}}
window.esRe=esRe;
const tabOn=t=>t[3]?has(t[3]):(E().frag>0||Object.keys(E().lp).length>0);
const box=h=>'<div class="es-sec" style="margin:8px 0;padding:8px;border:1px solid #3e6a68;border-radius:8px;background:rgba(14,34,36,.55)">'+h+'</div>';
const row=(a,b)=>`<div style="display:flex;align-items:center;gap:8px;margin:5px 0;padding:5px 6px;border-radius:6px;background:rgba(0,0,0,.22)">${a}<div style="flex:1;min-width:0">${b}</div></div>`;
const ico=(s,big)=>`<span style="font-size:${big?22:18}px;width:28px;text-align:center">${s}</span>`;
function tabAut(){const e=E();let h='<p style="margin:2px 0 6px">Los infectados especiales dejan <b>muestras</b> al morir. Con <b>3 muestras + 25 PI</b> se estudia el tipo: el pueblo le hace <b>+15 % de daño</b> y la guía muestra su punto débil.</p>';
 const seen=t=>{try{return !!(S.zseen&&S.zseen[t])}catch(er){return false}};
 let un=0;const zc=t=>`<canvas class="es-zc" data-t="${t}" style="width:40px;height:46px;flex:none"></canvas>`;
 SPX.forEach(t=>{const z=ZT[t];if(!z)return;if(!seen(t)){un++;return}
  const n=e.smp[t]||0;if(e.aut[t])h+=row(zc(t),`✔ <b>${esc(z.n)}</b> <small style="color:#8fe08a">· +15 % de daño</small><br><small>${WEAK[t]||''}</small>`);
  else h+=row(zc(t),`<b>${esc(z.n)}</b><br><small>Muestras: ${Math.min(n,3)} / 3</small>`+(n>=3?` <button class="btn" style="margin-left:6px" onclick="autStudy('${t}')"${(S.res.rp||0)>=25||S.mode==='creativo'?'':' disabled'}>🔬 Estudiar (25 PI)</button>`:''))});
 if(un)h+=row(ico('?'),'<b>??? ×'+un+'</b><br><small style="opacity:.7">Tipos que aún no habéis visto</small>');
 return h}
function tabRev(){const L=revList();let h='<p style="margin:2px 0 6px">Desmonta un arma o atuendo que hayáis encontrado y del que <b>no tengáis plano</b>: se pierde la pieza, pero aprendéis a fabricarla (20 PI, +10 chatarra).</p>';
 if(!L.length)return h+'<p style="opacity:.8"><i>No hay nada que desmontar. Las piezas sin plano salen en expediciones, misiones y bandas.</i></p>';
 const G={};L.forEach(o=>{if(G[o.it.n])G[o.it.n].c++;else G[o.it.n]={...o,c:1}});
 Object.values(G).forEach(o=>{const it=o.it,img=it.kind==='outfit'?(window.outfitIcon&&outfitIcon(it.n)):(window.weaponIcon&&weaponIcon(it.n));
  h+=row(img?`<img src="${img}" style="width:48px;height:30px;object-fit:contain">`:ico('🔧'),`<b>${esc(it.n)}</b>${o.c>1?' <small>×'+o.c+'</small>':''}<br><button class="btn" onclick="revDo(${o.i})"${(S.res.rp||0)>=20||S.mode==='creativo'?'':' disabled'}>🔧 Desmontar y aprender</button>`)});
 return h}
function tabChem(){const e=E();let h='<p style="margin:2px 0 6px">Se guardan hasta '+CMAX+' de cada.</p>';
 for(const k in CH){const r=CH[k],c=costOf(r.c,1);h+=row(ico(r.ic,1),`<b>${r.n}</b> · <b>${e.ch[k]}</b> / ${CMAX}<br><small>${r.d}</small><div style="margin-top:4px">${icc(c)} <button class="btn" onclick="chemMake('${k}')"${can(c)&&e.ch[k]<CMAX?'':' disabled'}>⚗️ Fabricar</button></div>`)}
 h+='<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px"><span>Munición en la próxima horda:</span>'+chipSel('esAm',e.am,[['','Normal'],['inc','🔥 Incendiaria'],['perf','🎯 Perforante']],'chemSetA($V)','esRe()')+'</div>';
 h+='<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px"><span>Explosivos en las trampas:</span>'+chipSel('esTx',e.tx?'1':'0',[['1','💣 Sí'],['0','No']],'chemSetT($V)','esRe()')+'</div>';
 return h}
function tabLp(){const e=E();let h=`<p style="margin:2px 0 6px">Las expediciones a veces traen un <b>trozo de plano</b> roto. Con 3 trozos se reconstruye una <b>mejora única</b>.</p><p style="margin:4px 0">🧩 Trozos: <b>${e.frag}</b> / 3 `+(e.frag>=3?'<button class="btn" onclick="lpBuild()">🧩 Reconstruir plano</button>':'')+'</p>';
 LP.forEach(q=>{h+=e.lp[q[0]]?row(ico('📜'),`<b>${q[1]}</b><br><small style="color:#8fe08a">${q[2]}</small>`):row(ico('?'),'<b>???</b><br><small style="opacity:.7">Plano sin encontrar</small>')});return h}
const oB=window.bPanel;window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id];if(!b||!S.bld.length)return r;const pan=document.getElementById('pan');if(!pan)return r;
  let h='';
  if(b.type==='lab'&&!b.cons){lastLab=id;let t=window.ESTAB||'aut';if(!TABS.some(q=>q[0]===t&&tabOn(q))){const f=TABS.find(tabOn);t=f?f[0]:t}
   h='<div style="font-weight:bold;margin-bottom:6px">🔬 Estudios especiales</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">'+TABS.map(q=>{const on=tabOn(q);return `<button class="btn" style="flex:1;min-width:30%;padding:4px 2px;font-size:12px;${q[0]===t&&on?'background:#3e7a76;color:#fff':''}${on?'':'opacity:.55'}" ${on?`onclick="esTab('${q[0]}')"`:'disabled'}>${on?q[1]+' '+q[2]:'🔒 ???'}</button>`}).join('')+'</div>';
   const any=TABS.some(tabOn);h+=!any?'<p style="opacity:.8"><i>Investiga nuevas ramas en el árbol tecnológico para desbloquear estudios.</i></p>':t==='aut'?tabAut():t==='rev'?tabRev():t==='chem'?tabChem():tabLp();h=box(h)}
  else if(b.type==='radio'&&!b.cons&&has('sig1')){const e=E();lastLab=id;let x='<div style="font-weight:bold;margin-bottom:4px">📻 Descifrado de señales</div>';
   if(e.sig.n>=RZ.length)x+='<p style="margin:4px 0">✔ Todas las señales descifradas.</p>';
   else{const rt=sigRate(),pc=Math.floor(e.sig.p*100);x+=`<p style="margin:4px 0">Señal ${e.sig.n+1} de ${RZ.length} · <b>${pc} %</b></p><div class="bbar"><i style="width:${pc}%;background:#7fe0ff"></i></div><p style="margin:4px 0"><small>${rt?'Con '+nW(b)+' operario'+(nW(b)>1?'s':'')+': unos '+((1-e.sig.p)/rt).toFixed(1).replace('.',',')+' días.':'⚠ Pon operarios en la estación para descifrar.'} Se para durante las hordas.</small></p>`}
   RZ.forEach((z,i)=>{x+=i<e.sig.n?row(ico(z.icon),`<b>${z.n}</b><br><small>Disponible en expediciones (ayunt. ${z.h})</small>`):row(ico('?'),'<b>Señal ???</b>')});h=box(x)}
  if(h){const hd=pan.querySelector('.bp2h'),dv=document.createElement('div');dv.innerHTML=h;if(hd&&hd.parentNode)hd.parentNode.insertBefore(dv.firstElementChild,hd.nextSibling);else pan.insertAdjacentHTML('afterbegin',h);
   setTimeout(()=>{try{pan.querySelectorAll('.es-zc').forEach(c=>window.enemyPaint&&enemyPaint(c,c.dataset.t,1,{}))}catch(e){}},0)}
 }catch(e){}return r};
/* ---------- guía ---------- */
try{const i=GD.findIndex(g=>g[0]==='Tecnologías');const f=()=>{const e=E(),P=t=>'<p>'+t+'</p>',L=[];
  L.push(P('Desde el panel del <b>Laboratorio</b> (y de la <b>Estación de radio</b>) se hacen estudios que no están en el árbol: se desbloquean al investigar su rama.'));
  L.push(P(has('aut1')?'<b>🧪 Autopsias:</b> los infectados especiales dejan muestras al morir. Con 3 muestras y 25 PI estudias ese tipo: el pueblo le hace +15 % de daño.':'<b>🧪 ???</b>'));
  if(has('aut1')){const k=SPX.filter(t=>e.aut[t]);L.push(k.length?'<ul>'+k.map(t=>'<li><b>'+esc(ZT[t].n)+':</b> '+WEAK[t]+'</li>').join('')+'</ul>':P('<small>Los puntos débiles aparecen aquí al estudiar cada tipo.</small>'))}
  L.push(P(has('rev1')?'<b>🔧 Ingeniería inversa:</b> desmonta un arma o atuendo encontrado del que no tengas plano (20 PI) y aprenderás a fabricarlo.':'<b>🔧 ???</b>'));
  L.push(P(has('chem1')?'<b>⚗️ Química:</b> munición incendiaria (los zombis arden) o perforante (+30 % a los blindados): se elige en el laboratorio y se gasta 1 lote por horda. Los explosivos se cargan en las trampas y explotan al pisarlas.':'<b>⚗️ ???</b>'));
  L.push(P(has('sig1')?'<b>📻 Señales de radio:</b> con operarios en la Estación de radio se descifran transmisiones. Cada una revela un lugar nuevo para expediciones, con un plano asegurado si la expedición sale bien.':'<b>📻 ???</b>'));
  L.push(P((e.frag||Object.keys(e.lp).length)?'<b>🧩 Planos perdidos:</b> las expediciones a veces traen un trozo de plano roto. Con 3 trozos se reconstruye una mejora única en el laboratorio.':'<b>🧩 ???</b>'));
  return L.join('')};
 if(!GD.some(g=>g[0]==='Estudios especiales'))GD.splice(i>=0?i+1:GD.length,0,['Estudios especiales',f])}catch(e){}
window.__es={E,RZ,LP,CH,TR:()=>TR};
})();
