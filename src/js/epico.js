/* Rareza ÉPICO (E): entre Raro y Legendario. Se asigna a lo mejor de lo que antes era Raro. */
(function(){
['Rifle de francotirador','Lanzallamas improvisado','Escopeta de la presa'].forEach(n=>{const w=WP.find(q=>q.n===n);if(w)w.r='E'});
['Armadura de placas','Chaleco de ferroviario','Armadura antidisturbios'].forEach(n=>{const o=(window.OUTFITS||{})[n];if(o)o.r='E'});
})();
/* El tiempo de la base se detiene mientras estás en la Villa o dentro de una misión (pantalla de misión abierta). */
(function(){const o=window.upd;if(typeof o!=='function')return;window.upd=function(dt){if(window.VILLA||(window._qmShown&&window._qmShown()))return;return o.apply(this,arguments)}})();

/* El botín no se entrega hasta que el equipo vuelve a la base: tras la misión hay un viaje de regreso. */
(function(){const oEnd=window.exEnd,oU=window.upd;if(typeof oEnd!=='function')return;
 const fmt=t=>Math.floor(t/60)+':'+String(Math.ceil(t)%60).padStart(2,'0');
 window.returnInfo=e=>e&&e.back?{left:e.back.t,total:e.back.total,txt:fmt(Math.max(0,e.back.t))}:null;
 const done=()=>{const e=S.exp;if(!e)return;e.backDone=1;e.back=null;window.notify&&notify('🏠','Equipo de vuelta','Regresan de '+((e.z&&e.z.n)||'la misión')+' con el botín.','expe');window.exEnd()};
 window.exEnd=function(){const e=S.exp;
  if(e&&e.fin&&e.travel&&!e.backDone&&!e.back&&e.team&&e.team.length){const t=Math.max(5,Math.round(e.travel.total||60));e.back={t,total:t};try{save()}catch(x){}toast('🧭 El equipo regresa a la base con el botín.');if(S.mode==='creativo'){}try{window.expMenu()}catch(x){}return}
  return oEnd.apply(this,arguments)};
 window.skipTravel=function(){if(S.mode!=='creativo')return;const e=S.exp;if(!e)return;if(e.back){done();return}if(!e.travel)return;e.travel.t=0;window.startMission()};
 window.upd=function(dt){const r=oU.apply(this,arguments);try{const e=S&&S.exp;if(e&&e.back&&!window.horde){e.back.t-=dt*(S.adv&&S.adv.weather===1?1/1.2:1);if(e.back.t<=0)done()}}catch(x){}return r}})();

(function(){const o=window.upd;window.upd=function(dt){if(window.VILLA||(window._qmShown&&window._qmShown()))return;return o.apply(this,arguments)}})();

/* Icono de embarazo (biberón en un círculo rosa): sobre la persona en el mapa y en la esquina de su retrato. */
window.pregBadge=function(x,cx,cy,r){x.save();x.translate(cx,cy);const s=r/10;x.scale(s,s);x.fillStyle='#e0558f';x.strokeStyle='#fff';x.lineWidth=1.8;x.beginPath();x.arc(0,0,10,0,7);x.fill();x.stroke();
 x.fillStyle='#fff';x.beginPath();x.moveTo(-1.6,-7.2);x.quadraticCurveTo(0,-9.4,1.6,-7.2);x.lineTo(1.6,-5.6);x.lineTo(-1.6,-5.6);x.closePath();x.fill();x.fillRect(-3.4,-5.6,6.8,1.8);
 x.beginPath();x.moveTo(-3.2,-3.8);x.lineTo(3.2,-3.8);x.lineTo(3.2,5);x.quadraticCurveTo(3.2,7.2,0,7.2);x.quadraticCurveTo(-3.2,7.2,-3.2,5);x.closePath();x.fill();
 x.strokeStyle='#e0558f';x.lineWidth=.9;for(const yy of [-1.2,1.2,3.6]){x.beginPath();x.moveTo(-3.2,yy);x.lineTo(-1,yy);x.stroke()}x.restore()};
(function(){const o=window.paintFace;if(typeof o!=='function')return;window.paintFace=function(cv,p){const r=o.apply(this,arguments);try{if(p&&p.preg){const x=cv.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);const R=Math.max(9,cv.width*.12);pregBadge(x,R+4,cv.height-R-4,R);x.restore()}}catch(e){}return r}})();
/* Durante un ataque, cada enemigo lleva un pequeño marcador rojo; los que quedan fuera de pantalla se indican con flechas en el borde. */
(function(){const o=window.render;if(typeof o!=='function')return;
 window.render=function(){const r=o.apply(this,arguments);try{if(typeof Z==='undefined'||!Z||!Z.some(z=>z.act&&z.hp>0))return r;/* hordas y zombis sueltos */const cv=document.getElementById('c'),c=cv.getContext('2d'),w=vw(),h=vh(),ar=[],bob=Math.sin(T*6)*1.4;
  c.save();c.setTransform(dpr,0,0,dpr,0,0);c.lineJoin='round';
  Z.forEach(z=>{if(!z.act||z.hp<=0)return;const q=P(z.x,z.y),sx=(q[0]-cam.x)*cam.z,sy=(q[1]-cam.y)*cam.z;
   if(sx>-8&&sx<w+8&&sy>-8&&sy<h+8){const y=sy-(z.big?40:z.t==='p'?56:30)*cam.z+bob;c.fillStyle='rgba(255,40,40,.28)';c.beginPath();c.arc(sx,y-3,7,0,7);c.fill();c.fillStyle='#ff2b2b';c.strokeStyle='#3a0606';c.lineWidth=1.4;c.beginPath();c.moveTo(sx-4.5,y-7);c.lineTo(sx+4.5,y-7);c.lineTo(sx,y);c.closePath();c.fill();c.stroke()}
   else ar.push([sx,sy])});
  const cx0=w/2,cy0=h/2,done=[];ar.forEach(([sx,sy])=>{const a=Math.atan2(sy-cy0,sx-cx0),ex=Math.min(w-16,Math.max(16,sx)),ey=Math.min(h-16,Math.max(46,sy));if(done.some(d=>Math.hypot(d[0]-ex,d[1]-ey)<24))return;done.push([ex,ey]);
   c.save();c.translate(ex,ey);c.rotate(a);c.fillStyle='#ff2b2b';c.strokeStyle='#3a0606';c.lineWidth=1.4;c.beginPath();c.moveTo(8,0);c.lineTo(-5,-6);c.lineTo(-5,6);c.closePath();c.fill();c.stroke();c.restore()});
  c.restore()}catch(e){}return r}})();

/* ===== Buzón de notificaciones ===== */
(function(){
 const CAT={villa:'#c9a24a',inv:'#7fe0ff',expe:'#6aa9ff',base:'#9fb0b6',alerta:'#ff6a5a',fam:'#e88ab8'};
 const box=()=>{if(typeof S==='undefined'||!S)return[];return S.inbox||(S.inbox=[])};
 window.notify=function(ic,t,x,cat){try{const b=box();if(b.some(n=>n.t===t&&n.x===x&&n.d===S.day))return;b.unshift({ic,t,x:x||'',d:S.day,c:cat||'base',r:0});if(b.length>80)b.length=80;upd_()}catch(e){}};
 const unread=()=>box().filter(n=>!n.r).length;
 let btn=null;function mk(){if(btn)return;btn=document.createElement('button');btn.id='inbBtn';btn.innerHTML='🔔<b id="inbN"></b>';btn.onclick=()=>window.inboxOpen();document.body.appendChild(btn);
  const st=document.createElement('style');st.textContent="#inbBtn{position:fixed;right:5px;top:5px;z-index:4;width:36px;height:36px;border-radius:50%;border:1px solid #5a6a50;background:rgba(14,18,16,.88);color:#ffd877;font-size:19px;padding:0;display:flex;align-items:center;justify-content:center}#inbBtn b{position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;border-radius:9px;background:#e03a3a;color:#fff;font:700 10px system-ui;display:none;align-items:center;justify-content:center;padding:0 4px}#inbBtn.has{box-shadow:0 0 10px #e03a3a88}.inb{display:flex;gap:9px;align-items:flex-start;padding:8px;border:1px solid #3a4a50;border-radius:9px;margin:5px 0;background:rgba(10,14,16,.55)}.inb.new{border-color:#c9a24a;background:rgba(60,50,24,.45)}.inb .ii{font-size:20px;width:30px;text-align:center}.inb b{display:block;font-size:13px}.inb small{color:#9fb0b6;font-size:11px;display:block}.inb em{font-style:normal;color:#7d8b91;font-size:10px}";document.head.appendChild(st)}
 function upd_(){mk();const n=unread(),e=document.getElementById('inbN');if(e){e.textContent=n>9?'9+':n;e.style.display=n?'flex':'none'}btn.classList.toggle('has',n>0);btn.style.display=(window.VILLA||(typeof S!=='undefined'&&S&&S.over)||document.getElementById('titleScreen')&&document.getElementById('titleScreen').style.display!=='none')?'none':'flex'}
 setInterval(()=>{try{upd_()}catch(e){}},600);
 window.inboxOpen=function(){const b=box(),h=(b.length?b.map(n=>`<div class="inb${n.r?'':' new'}"><span class="ii">${n.ic}</span><div><b style="color:${CAT[n.c]||'#fff'}">${n.t}</b><small>${n.x}</small><em>Día ${n.d}</em></div></div>`).join(''):'<p class="bsub">No tienes notificaciones.</p>')+(b.length?'<div class="prow"><button onclick="inboxClear()">Vaciar buzón</button></div>':'');b.forEach(n=>n.r=1);upd_();show('🔔 Buzón de notificaciones',h)};
 window.inboxClear=function(){S.inbox=[];upd_();window.inboxOpen()};
 /* notificaciones a partir de avisos que ya existen */
 const oT=window.toast;if(typeof oT==='function')window.toast=function(m){try{const t=String(m||'');let k;
  if(k=t.match(/^Tecnolog[ií]a investigada: (.+)/))notify('🔬','Investigación terminada',k[1],'inv');
  else if(/^🎓 /.test(t))notify('🎓','Formación terminada',t.slice(2),'base');
  else if(/ ya domina /.test(t))notify('🎓','Formación completada',t,'base');
  else if(/ha dado a luz|ya forma parte de la comunidad|embarazo se ha perdido/.test(t))notify('👶','Familia',t,'fam');
  else if(/horda se acerca|vigías avisan/i.test(t))notify('⚠️','Aviso de ataque',t,'alerta');
  else if(/enemigos desde varios puntos/.test(t))notify('🧟','¡Ataque!',t,'alerta');
  else if(/Rescate durante el ataque/.test(t))notify('🆘','Rescate durante el ataque',t,'alerta');
  else if(/Plano aprendido:/.test(t))notify('📜','Plano aprendido',t.replace('Plano aprendido: ',''),'villa');
  else if(/^Encargo aceptado:/.test(t)){}
 }catch(e){}return oT.apply(this,arguments)};
 const oEH=window.endHorde;if(typeof oEH==='function')window.endHorde=function(){const h=typeof horde!=='undefined'?horde:null;const r=oEH.apply(this,arguments);try{if(h)notify('🛡','Ataque terminado',h.name+': '+h.kills+' enemigos abatidos'+(h.lostB?', '+h.lostB+' edificios perdidos':'')+(h.lostP?', '+h.lostP+' bajas':''),'alerta')}catch(e){}return r};
 const oND=window.nextDay;if(typeof oND==='function')window.nextDay=function(){const r=oND.apply(this,arguments);try{window.villaApi&&villaApi.renewCheck&&villaApi.renewCheck()}catch(e){}return r};
 const oU=window.upd;if(typeof oU==='function')window.upd=function(dt){const r=oU.apply(this,arguments);try{const e=typeof S!=='undefined'&&S&&S.exp;if(e&&e.travel&&!e.travel.done&&e.travel.t<=0&&!e.nA){e.nA=1;notify('🧭','El equipo ha llegado',((e.z&&e.z.n)||'destino')+': ya puedes jugar la misión.','expe')}}catch(x){}return r};
})();
