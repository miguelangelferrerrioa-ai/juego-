/* ===== Dead Town · Las nueve sillas: un asalto isométrico propio por cada accionista del Consejo ===== */
(function(){
'use strict';
const GW=52,GH=44;
const rnd=(a,b)=>a+Math.random()*(b-a);
const pj=(i,j)=>[(i-j)*32,(i+j)*16];
const FAC=window._ASFAC;
const A=()=>S.arc||(S.arc={s:{},ann:{}});
const PAL=(body,acc,leg)=>({leg:leg||'#1b2229',trim:acc,pack:'#252d34',body,edge:'#59636c',acc,helm:'#20272e',vis:acc});
/* ---------- configuración de cada silla ---------- */
const SI={
 lanz:{chap:31,need:4500,n:'La Cuna de Lanz',boss:'Eduardo Lanz',hue:-40,tint:'30,80,60',col:'#2a3a38',acc:'#5aeaa8',pal:['#1f2a28','#1b2523','#2f3e3a','#2a3834'],lay:{serv:.3,hydro:.22},seed:5,mix:{zb:3,tr:3,el:2},bossK:'bh',bp:PAL('#eef4f0','#5aeaa8','#2a3a38'),mech:['caps'],ES:1.05,
  say:'«La Cuna de Lanz. Cada cápsula despierta más dormidos: romped las cápsulas o no pararán nunca.»',endSay:['Lanz','«Mi obra… no debía…»'],
  txt:'Una torre de cristal con cápsulas de dormidos repartidas por las calles. Cada cápsula libera zombis cada pocos segundos hasta que se destruye. Lanz y su guardia con batas blindadas defienden el centro.'},
 hahn:{chap:33,need:5000,n:'La torre de maniobras de Hahn',boss:'Brigitte Hahn',hue:-150,tint:'80,60,20',col:'#3a3228',acc:'#ffb030',pal:['#2a2622','#26221e','#3c3630','#36302a'],lay:{hangar:.3,serv:.12},seed:9,mix:{tr:4,el:3,mk:1,dr:1},bossK:'bh',bp:PAL('#e8c030','#ffb030','#3a3228'),mech:['trains'],ES:1.1,
  say:'«Hahn manda trenes por la avenida central. Cuando suene la alarma, apartaos de la vía o seréis los primeros en caer.»',endSay:['Hahn','«Un tren más… solo uno más…»'],
  txt:'Una estación fortificada con una vía que cruza la ciudad. Cada pocos segundos un tren sin freno la atraviesa y arrolla todo lo que haya en ella, amigos y enemigos. Una alarma roja avisa antes.'},
 ardiles:{chap:35,need:5600,n:'El cuartel de Ardiles',boss:'General Ardiles',classic:1,tint:'70,55,30',col:'#6a5a3a',acc:'#d8c27a',farm:.03,barr:.3,seed:17,mech:['arty'],ES:1.2,wall:1.3,
  say:'«El cuartel de Ardiles. Tiene artillería: cuando veáis los círculos rojos, salid de ellos.»',endSay:['Ardiles','«He perdido… por primera vez.»'],
  txt:'Un campamento militar con cuarteles por todas partes y mucha artillería. Las salvas caen cada pocos segundos sobre tus tropas y se anuncian con círculos rojos en el suelo.'},
 roca:{chap:37,need:6200,n:'El estudio de Selene Roca',boss:'Selene Roca',hue:130,tint:'70,30,70',col:'#3a2e44',acc:'#ff5ad0',pal:['#2a2230','#241c2a','#3a2e44','#34283e'],lay:{serv:.28,hydro:.05},seed:13,mix:{tr:3,el:3,dr:2},bossK:'bh',bp:PAL('#2a2a34','#ff5ad0','#16161e'),mech:['decoys'],ES:1.15,
  say:'«Roca emite imágenes falsas de sí misma y de su guardia. No gastéis las balas con los señuelos.»',endSay:['Roca','«Os necesito… más de lo que creéis.»'],
  txt:'Un estudio de pantallas que proyecta señuelos holográficos. Los señuelos atraen tus disparos y se destruyen con un solo golpe. La verdadera Roca lleva el vestido negro y dorado.'},
 ambrosio:{chap:39,need:6900,n:'La abadía de los Hermanos',boss:'Padre Ambrosio',classic:1,tint:'55,60,70',col:'#8a8a86',acc:'#e8e8e0',farm:.02,barr:.12,seed:21,mech:['sleep'],ES:1.2,wall:1.4,
  say:'«La abadía está llena de dormidos. Cuando el coro canta, se levantan. Cortad al coro o no habrá fin.»',endSay:['Ambrosio','«Dormid… dormid…»'],
  txt:'Una abadía con decenas de dormidos tendidos por el suelo. Cada pocos segundos el coro canta y una oleada se levanta. Ambrosio y sus Hermanos del Silencio vigilan el altar.'},
 saenz:{chap:41,need:7600,n:'La compuerta de Sáenz',boss:'Raimundo Sáenz',hue:-10,tint:'20,45,90',col:'#26384a',acc:'#5ac8ff',pal:['#1a2630','#16212a','#26384a','#223244'],lay:{hydro:.3,serv:.1},seed:25,mix:{tr:3,el:2,dr:2,mk:1},bossK:'bh',bp:PAL('#2a5a7a','#5ac8ff','#12303c'),mech:['flood'],ES:1.25,
  say:'«Sáenz abre las compuertas por zonas. Con el agua os movéis la mitad y las descargas os queman.»',endSay:['Sáenz','«Que… se… cierren…»'],
  txt:'Una presa fortificada. Cada pocos segundos una franja de la base se inunda: el agua frena a todos a la mitad y las descargas eléctricas dañan a tus tropas.'},
 mori:{chap:43,need:8400,n:'El faro de Mori',boss:'Haruka Mori',hue:160,tint:'70,20,30',col:'#2c2e34',acc:'#ff5a6a',pal:['#1e2024','#1a1c20','#2c2e34','#282a30'],lay:{hangar:.35,serv:.15},seed:29,mix:{dr:5,tr:2,el:2},bossK:'bh',bp:PAL('#e8e8ee','#ff5a6a','#2c2e34'),mech:['swarm'],ES:1.3,cnt:.9,
  say:'«Mori lanza enjambres de drones sin parar. El pulso EMP los destruye de golpe: guardadlo para cuando se junten.»',endSay:['Mori','«Los ojos… se apagan…»'],
  txt:'Un puerto fortificado de donde salen enjambres de drones cada pocos segundos. El pulso EMP destruye todos los drones que alcance, así que conviene guardarlo para cuando se agrupen.'},
 salgado:{chap:45,need:9200,n:'La mina de Salgado',boss:'Víctor Salgado',classic:1,tint:'80,50,20',col:'#a8742a',acc:'#e8a050',farm:.02,barr:.2,seed:33,mech:['rocks','dig'],ES:1.3,wall:1.5,
  say:'«La mina de Salgado. Caen rocas y salen excavadoras sin tregua. Moveos y apuntad a Salgado.»',endSay:['Salgado','«Parad… las máquinas…»'],
  txt:'Una mina con derrumbes que caen sobre cualquier zona, sin distinguir bando, y excavadoras que embisten desde el fondo. Salgado dirige a los mineros desde la cámara de cobre.'},
 vidal:{chap:47,need:10500,n:'La Cúpula',boss:'Anselmo Vidal',hue:-145,tint:'80,70,20',col:'#3e3a2e',acc:'#ffd84a',pal:['#2a2820','#26241c','#3e3a2e','#38342a'],lay:{serv:.2,hydro:.2,hangar:.15},seed:37,mix:{tr:3,el:4,mk:2,dr:2},bossK:'bh',bp:PAL('#f2f0e4','#ffd84a','#8f98a2'),mech:['arty','swarm','flood'],ES:1,wall:1.5,tw:1.3,
  say:'«La Cúpula de Vidal. Artillería, drones y compuertas a la vez. Es lo último que tiene el Consejo: no os separéis.»',endSay:['Vidal','«Habéis tardado… pero habéis llegado.»'],
  txt:'La ciudad cerrada de Vidal, con los defensas más fuertes de todo el Consejo. Combina artillería, enjambres de drones e inundaciones. Es la última silla.'}};
const KEYS=Object.keys(SI);
/* registro de las fortalezas en el motor */
KEYS.forEach(k=>{const c=SI[k];FAC[k]=Object.assign({n:c.n,boss:c.boss,col:c.col,acc:c.acc,tint:c.tint,ES:c.ES||1,single:1,lbl:'Asalto',tech:c.classic?0:1,mech:c.mech,say:c.say,endSay:c.endSay,wall:c.wall,tw:c.tw,fin:r=>finish(k,r)},c)});
/* ---------- mecánicas ---------- */
const alive=L=>L.filter(u=>u.hp>0);
function free(AS,x0,x1,y0,y1){const W=AS.W;for(let n=0;n<60;n++){const x=rnd(x0,x1),y=rnd(y0,y1);if(W.gridT[W.idx(Math.floor(x),Math.floor(y))]===0)return[x,y]}return[(x0+x1)/2,(y0+y1)/2]}
function spawn(AS,X,k,x,y,extra){const u=X.mkTech(AS,k,x,y);u.guard=0;u.aggro=1;Object.assign(u,extra||{});AS.E.push(u);return u}
function arty(AS,X,n,r,d,all,t){const al=alive(AS.U);if(!al.length)return;for(let i=0;i<n;i++){const a=al[Math.floor(Math.random()*al.length)];AS.bq=AS.bq||[];AS.bq.push({t:t||1.7,x:a.x+rnd(-2,2),y:a.y+rnd(-2,2),r,d,m:t||1.7,all,sil:1})}}
const MECH={
 caps(AS,X,dt,tick){if(!AS.capsInit){AS.capsInit=1;[[8,23.5],[16,23.5],[35,23.5],[43,23.5],[25.5,31],[25.5,39]].forEach(([x,y])=>spawn(AS,X,'cap',x,y).guard=0);X.say('Lanz','«Mis cápsulas no se apagan. Ni vosotros me apagaréis a mí.»')}
  tick('caps',13,()=>{const zb=AS.E.filter(e=>e.k==='zb'&&e.hp>0).length;AS.E.filter(e=>e.k==='cap'&&e.hp>0).forEach(c=>{if(zb<26){for(let i=0;i<2;i++)spawn(AS,X,'zb',c.x+rnd(-1,1),c.y+rnd(-1,1))}})})},
 trains(AS,X,dt,tick){const T=AS.trn;if(!T){tick('trn',20,()=>{AS.trn={w:3,dir:Math.random()<.5?1:-1,x:0,hit:new Set(),y:23.5};X.say('Hahn','«¡Tren en la vía! ¡Despejad la avenida!»')});return}
  if(T.w>0){T.w-=dt;if(T.w<=0){T.x=T.dir>0?-12:GW+12}return}
  T.x+=T.dir*24*dt;const tx0=Math.min(T.x,T.x-T.dir*9),tx1=Math.max(T.x,T.x-T.dir*9);[...AS.U,...AS.E].forEach(u=>{if(u.hp<=0||u.tow||u.fixed||T.hit.has(u))return;if(Math.abs(u.y-T.y)<1.5&&u.x>tx0&&u.x<tx1){T.hit.add(u);X.hurt(u,u.boss?u.mhp*.06:u.mhp*(u.a?.4:.6))}});
  if(T.x<-14||T.x>GW+14)AS.trn=null},
 arty(AS,X,dt,tick){tick('arty',11,()=>{arty(AS,X,3,2.6,(AS.U.reduce((a,u)=>a+u.mhp,0)/Math.max(1,AS.U.length))*.45,0);})},
 decoys(AS,X,dt,tick){tick('dec',14,()=>{const al=alive(AS.U);if(!al.length)return;const cx=al.reduce((a,u)=>a+u.x,0)/al.length,cy=al.reduce((a,u)=>a+u.y,0)/al.length;for(let i=0;i<5;i++)spawn(AS,X,'hl',cx+rnd(-4,4),cy-rnd(3,6),{life:16});X.say('Roca','«Mirad, mirad… ¿cuál es la de verdad?»')})},
 sleep(AS,X,dt,tick){if(!AS.sl){AS.sl=[];for(let i=0;i<30;i++){const p=free(AS,3,GW-3,5,GH-4);AS.sl.push({x:p[0],y:p[1]})}}
  tick('coro',20,()=>{const al=alive(AS.U);if(!al.length||!AS.sl.length)return;const cx=al.reduce((a,u)=>a+u.x,0)/al.length,cy=al.reduce((a,u)=>a+u.y,0)/al.length;AS.sl.sort((a,b)=>Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy));const w=AS.sl.splice(0,7);w.forEach(s=>spawn(AS,X,'zb',s.x,s.y));X.say('Ambrosio','«Despertad, hermanos. Es la hora.»')})},
 flood(AS,X,dt,tick){const F=AS.fl2;if(!F){tick('fl',28,()=>{const y=rnd(8,GH-9);AS.fl2={y0:y,y1:y+7,w:2,t:12};X.say('Sáenz','«¡Abrid las compuertas!»')});return}
  if(F.w>0){F.w-=dt;return}F.t-=dt;[...AS.U,...AS.E].forEach(u=>{if(u.hp<=0||u.tow||u.fixed||u.fly)return;if(u.y>F.y0&&u.y<F.y1){u.wet=.4;if(u.a)X.hurt(u,u.mhp*.025*dt)}});if(F.t<=0)AS.fl2=null},
 swarm(AS,X,dt,tick){tick('sw',18,()=>{const n=AS.E.filter(e=>e.k==='dr'&&e.hp>0).length;if(n>16)return;const hs=AS.W.bl.filter(b=>b.type==='hangar');for(let i=0;i<6;i++){const b=hs.length?hs[Math.floor(Math.random()*hs.length)]:{x:25,y:12,w:2,h:2};spawn(AS,X,'dr',b.x+rnd(0,b.w),b.y+rnd(0,b.h))}})},
 rocks(AS,X,dt,tick){tick('rk',14,()=>{arty(AS,X,2,3.2,(AS.U.reduce((a,u)=>a+u.mhp,0)/Math.max(1,AS.U.length))*.5,1,1.9)})},
 dig(AS,X,dt,tick){tick('dig',42,()=>{if(AS.E.filter(e=>e.k==='mk'&&e.hp>0).length>3)return;X.say('Salgado','«Que salgan las excavadoras.»');spawn(AS,X,'mk',rnd(23,28),rnd(14,17))})}};
function step(AS,dt,X){const c=SI[AS.fk];if(!c||AS.t<6)return;AS.mt=AS.mt||{};const tick=(n,p,f)=>{AS.mt[n]=(AS.mt[n]===undefined?p*.55:AS.mt[n])-dt;if(AS.mt[n]<=0){AS.mt[n]=p;f()}};
 (FAC[AS.fk].mech||[]).forEach(m=>MECH[m]&&MECH[m](AS,X,dt,tick));
 if(!FAC[AS.fk].tech){AS.bq=AS.bq||[];AS.bq.forEach(q=>{q.t-=dt;if(q.t<=0&&!q.done){q.done=1;AS.fx.push({k:'ex',x:q.x,y:q.y,t:0});(q.all?[...AS.U,...AS.E]:AS.U).forEach(u=>{if(u.hp>0&&!u.tow&&Math.hypot(u.x-q.x,u.y-q.y)<q.r)X.hurt(u,u.boss?q.d*.15:q.d)});try{window.sfx&&sfx('boom')}catch(e){}}});AS.bq=AS.bq.filter(q=>!q.done)}}
/* ---------- dibujo de las mecánicas ---------- */
function bx(c,x0,y0,w,d,z,top,L,R){const A_=pj(x0,y0),B=pj(x0+w,y0),C=pj(x0+w,y0+d),D=pj(x0,y0+d),u=(p,h)=>[p[0],p[1]-h],poly=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill()};poly([u(D,0),u(C,0),u(C,z),u(D,z)],L);poly([u(C,0),u(B,0),u(B,z),u(C,z)],R);poly([u(A_,z),u(B,z),u(C,z),u(D,z)],top)}
function over(c,AS,T){
 if(!FAC[AS.fk].tech)(AS.bq||[]).forEach(q=>{const p=pj(q.x,q.y),a=1-q.t/q.m,rx=q.r*45,ry=q.r*22.6;c.strokeStyle='rgba(255,60,80,'+(.5+.4*Math.sin(T*18))+')';c.lineWidth=3;c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,0,7);c.stroke();c.fillStyle='rgba(255,60,80,'+(.08+.16*a)+')';c.beginPath();c.ellipse(p[0],p[1],rx*a,ry*a,0,0,7);c.fill()});
 (AS.sl||[]).forEach(s=>{const q=pj(s.x,s.y);c.save();c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(q[0],q[1]+1,9,3.5,0,0,7);c.fill();c.fillStyle='#6a7a5a';c.fillRect(q[0]-7,q[1]-4,13,5);c.fillStyle='#b8c8a8';c.beginPath();c.arc(q[0]-9,q[1]-2,2.8,0,7);c.fill();c.restore()});
 const F=AS.fl2;if(F){const a=pj(-2,F.y0),b=pj(GW+2,F.y0),cc=pj(GW+2,F.y1),d=pj(-2,F.y1);c.fillStyle=F.w>0?'rgba(255,200,80,.12)':'rgba(70,150,255,'+(.26+.05*Math.sin(T*3))+')';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();c.strokeStyle=F.w>0?'rgba(255,200,80,.7)':'rgba(160,210,255,.6)';c.lineWidth=2;if(F.w>0)c.setLineDash([10,8]);c.stroke();c.setLineDash([]);if(F.w<=0){c.strokeStyle='rgba(200,235,255,.5)';c.lineWidth=1.2;for(let k=0;k<6;k++){const y=F.y0+(F.y1-F.y0)*((k+(T*.6)%1)/6),p1=pj(-2,y),p2=pj(GW+2,y);c.beginPath();c.moveTo(p1[0],p1[1]);c.lineTo(p2[0],p2[1]);c.stroke()}}}
 const Tr=AS.trn;if(Tr){const y0=Tr.y-1.1,y1=Tr.y+1.1,a=pj(-10,y0),b=pj(GW+10,y0),cc=pj(GW+10,y1),d=pj(-10,y1);if(Tr.w>0){c.fillStyle='rgba(255,50,50,'+(.1+.16*Math.abs(Math.sin(T*9)))+')';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();c.strokeStyle='rgba(255,70,70,.8)';c.lineWidth=2;c.stroke()}
  else{for(let k=0;k<7;k++){const x=Tr.x-Tr.dir*k*1.6;bx(c,x-.7,y0+.2,1.4,1.6,k?20:24,k?'#6a7480':'#8a9098','#3a424a','#4a525c')}}}}
/* ---------- fin de la batalla: se completa el capítulo ---------- */
function finish(k,r){const c=SI[k],fell=r.fallen.length;r.fallen.forEach(p=>{if(!S.ppl.includes(p))return;if(Math.random()<.35){try{die(p,'Cayó en '+c.n)}catch(e){S.ppl=S.ppl.filter(q=>q!==p)}}else{p.hp=Math.max(10,p.hp*.2)}});
 const idx=c.chap,first=S.story<=idx;let rw='';
 if(first){S.story=idx+1;try{rw=storyReward(STORY[idx].r)}catch(e){console.error(e)}try{window.narOnChapter&&narOnChapter(idx)}catch(e){}try{window.villaApi&&villaApi.gain(800+300*KEYS.indexOf(k))}catch(e){}if(S.gd)S.gd.rep=(S.gd.rep||0)+25}
 try{window.notify&&notify('🏆',c.boss+' ha caído',c.n+' ya no pertenece al Consejo.','historia')}catch(e){}
 setTimeout(()=>{window._asOn=0;show(c.n,`<div class="mu-empty"><span>🏆</span><b>${c.boss} ha caído</b><small>${(STORY[idx]&&STORY[idx].outro)||''}<br><br>Han combatido ${r.total} de los tuyos: ${r.surv} siguen en pie y ${fell} cayeron. Los caídos pueden haber muerto o quedar heridos; revisa tu base.${first?'<br><br>'+rw+', y '+(800+300*KEYS.indexOf(k))+' fichas.':'<br><br>(Capítulo ya completado: sin recompensa extra)'}</small></div>`)},500)}
/* ---------- ficha previa y lanzamiento ---------- */
const power=()=>{try{return armyPow()}catch(e){return 0}};
function briefing(k){const c=SI[k],pw=power(),need=c.need,ok=pw>=need||S.mode==='creativo',cr=ASALTO.crew(),pct=Math.min(100,pw/need*100);
 show(STORY[c.chap].n,`<p><i>${c.say}</i> — Presidenta Valeria</p>
 <div class="mu-sts"><div class="mu-st"><b>${pw}</b><small>Tu poder</small></div><div class="mu-st"><b>${need}</b><small>Poder necesario</small></div><div class="mu-st"><b>${cr.sol.length}</b><small>Soldados</small></div><div class="mu-st"><b>${Math.min(cr.civ.length,Math.max(0,40-cr.sol.length))}</b><small>Ciudadanos</small></div></div>
 <div style="height:8px;background:#232b2f;border-radius:4px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${pct}%;background:${ok?'#6fb04e':'#c9a24a'}"></div></div>
 <p>${ok?'Valeria asiente: «Vamos a por '+c.boss+'».':'Tu ejército aún no es suficiente. Faltan <b>'+(need-pw)+'</b> puntos de poder: más soldados, mejores armas y armaduras, más torres.'}</p>
 <p><small>${c.txt}${FAC[k].tech?' Tienes el <b>Pulso EMP</b>: paraliza centinelas y torres y destruye drones.':''}</small></p>
 <button class="pri" ${ok?'':'disabled'} onclick="asaltoSillaGo('${k}')">Asaltar</button>`)}
window.asaltoSillaGo=k=>{const c=SI[k];if(!c||(power()<c.need&&S.mode!=='creativo'))return;document.getElementById('pan').style.display='none';window._asOn=1;const units=ASALTO.build();
 window.asaltoIsoStart({fk:k,plan:{ed:1,gate:1,ex:4,ad:1.2},es:(es0=>es0>3.9?3.9+(es0-3.9)*.5:es0)(Math.sqrt(c.need/300)),units,tot:units.filter(u=>u.p).length}).catch(e=>{console.error(e);window._asOn=0;toast('No se pudo cargar el mapa del asalto.')})};
(function(){const o=window.exGo;if(typeof o!=='function')return;window.exGo=function(){try{if(!S.exp&&window.exTab==='hist'&&typeof exC!=='undefined'){const k=KEYS.find(q=>SI[q].chap===exC);if(k){if(S.story<exC&&S.mode!=='creativo')return toast('Antes debes completar el capítulo anterior.');briefing(k);return}}}catch(e){}return o.apply(this,arguments)}})();
window.SILLAS={SI,step,over,finish,briefing,KEYS};
})();
