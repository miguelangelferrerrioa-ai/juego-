/* ===== Dead Town · bandas nuevas: Los Segadores (hoces, rápidos), Los Hijos del Humo (humo que aturde) y La Hermandad del Hierro (acorazados) ===== */
(function(){
'use strict';
const hyp=Math.hypot,NB=['segadores','humo','hierro'];
/* equipo propio de cada banda (isométrico) */
window.drawBandGear=function(c,z,q,f,k){const id=z.band;if(!NB.includes(id))return;const b=BANDS[id];c.save();c.lineCap='round';
 const hx=q[0]+f*5.5*k,hy=q[1]-11*k,at=z.at?1:0;
 if(id==='segadores'){/* sombrero de paja y hoz */
  c.fillStyle='#d9bd6a';c.strokeStyle='rgba(10,8,6,.8)';c.lineWidth=.8;c.beginPath();c.ellipse(q[0],q[1]-25*k,7.2*k,2.4*k,0,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(q[0],q[1]-26.4*k,3.6*k,2.4*k,0,Math.PI,0);c.fill();c.stroke();
  if(z.t!=='p'){c.strokeStyle='#5a3d22';c.lineWidth=2;c.beginPath();c.moveTo(hx-f*2,hy+3);c.lineTo(hx+f*(at?9:6),hy-(at?3:8));c.stroke();c.strokeStyle='#d5dade';c.lineWidth=1.8;c.beginPath();c.moveTo(hx+f*(at?9:6),hy-(at?3:8));c.quadraticCurveTo(hx+f*(at?15:12),hy-(at?3:13),hx+f*(at?14:9),hy-(at?-3:16));c.stroke()}}
 else if(id==='humo'){/* máscara antigás y bidón */
  c.fillStyle='#2a2d30';c.strokeStyle='rgba(10,8,6,.9)';c.lineWidth=.8;c.beginPath();c.arc(q[0]+f*1.2,q[1]-20.2*k,3.5*k,0,7);c.fill();c.stroke();c.fillStyle=b.acc;c.fillRect(q[0]+f*.2-1.6,q[1]-21.6*k,1.3,1.3);c.fillRect(q[0]+f*.2+.6,q[1]-21.6*k,1.3,1.3);
  c.fillStyle='#4a3a2e';c.fillRect(q[0]-f*5.4-2,q[1]-14*k,4,6);c.fillStyle='#8a2a1a';c.fillRect(q[0]-f*5.4-2,q[1]-12*k,4,1.4);
  if(z.t!=='p'){c.fillStyle='#2a2d30';c.fillRect(hx-1,hy-1,7*f,2.4);const p=.5+.5*Math.sin(T*18+(z.sd||0));c.fillStyle='rgba(255,'+Math.round(130+90*p)+',40,'+(at?.95:.6)+')';c.beginPath();c.arc(hx+f*9,hy,(at?3.4:2)+p*1.4,0,7);c.fill()}}
 else{/* casco soldado, hombreras y escudo */
  c.fillStyle='#8a9096';c.strokeStyle='rgba(10,8,6,.85)';c.lineWidth=.9;c.beginPath();c.ellipse(q[0],q[1]-23.4*k,4.8*k,3.4*k,0,Math.PI,0);c.fill();c.stroke();c.fillRect(q[0]-4.8*k,q[1]-23.4*k,9.6*k,1.4);
  c.fillStyle='#5a5e63';[-1,1].forEach(s=>{c.beginPath();c.ellipse(q[0]+s*5.2*k,q[1]-15*k,2.6,2,0,0,7);c.fill();c.stroke()});
  if(z.t!=='p'){const sx=q[0]-f*5,sy=q[1]-10*k;c.fillStyle='#7a7e84';c.beginPath();c.moveTo(sx-3,sy-5);c.lineTo(sx+3,sy-5);c.lineTo(sx+3,sy+2);c.lineTo(sx,sy+5);c.lineTo(sx-3,sy+2);c.closePath();c.fill();c.stroke();c.fillStyle=b.flag;c.fillRect(sx-1,sy-3,2,5)}}
 c.restore()};
/* mecánicas en la defensa */
const oZ=window.zUpd;
window.zUpd=function(z,dt){if(z.band&&NB.includes(z.band)&&z.hp>0&&z.act){
  if(!z.nbi){z.nbi=1;if(z.band==='hierro'){z.hp=z.mhp=Math.round(z.mhp*1.5)}}
  if(z.band==='segadores'&&z.t!=='p')z.spm=1.3;
  if(z.band==='hierro')z.spm=.8;
  if(z.band==='humo'&&z.t!=='p'){z.sc=(z.sc===undefined?3+Math.random()*4:z.sc)-dt;if(z.sc<=0){z.sc=8;burst(z.x,z.y,12,'#8a9096',1.6,12);S.ppl.forEach(p=>{if(!p.away&&!p.inside&&hyp(p.x-z.x,p.y-z.y)<4.5){p.pin=T+1.2;p.pinBy=null}});U.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<4.5){u.pin=T+1.2;u.pinBy=null}})}}}
 return oZ.apply(this,arguments)};
/* mecánicas en misión */
const oMq=ZX.mq;
ZX.mq=function(z,dt,al,M,X){if(z.band&&NB.includes(z.band)&&z.hp>0){
  if(!z.nbi){z.nbi=1;if(z.band==='hierro')z.hp=z.mhp=Math.round(z.mhp*1.5)}
  if(z.band==='segadores'&&z.t!=='p')z.spm=1.3;if(z.band==='hierro')z.spm=.8;
  if(z.band==='humo'&&z.t!=='p'){z.sc=(z.sc===undefined?3+Math.random()*4:z.sc)-dt;if(z.sc<=0&&z.st){z.sc=8;al.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<3.2){u.pin=1.2;u.pinBy=null}});X.addFl(M,z.x,z.y,'Humo','#9aa0a6')}}}
 return oMq.apply(this,arguments)};
/* aviso de aparición y cierre de la banda al terminar su cadena */
const LORE={segadores:['Los Segadores','Tras el despertar de Mirasol, una secta de campesinos cree que los dormidos son «grano maduro» y ataca granjas y asentamientos.'],
 humo:['Los Hijos del Humo','Con la caída de los ejércitos, un grupo de incendiarios quema todo cuanto toca. Las columnas de humo se ven desde Peñavera.'],
 hierro:['La Hermandad del Hierro','Los chatarreros de la abadía forjaron blindajes con el metal del viejo mundo y exigen tributo a los asentamientos.']};
const oND=window.nextDay;window.nextDay=function(){const r=oND.apply(this,arguments);try{const s=S.bn||(S.bn={});s.ann=s.ann||{};s.fin=s.fin||{};
 NB.forEach(id=>{if(!s.ann[id]&&S.mode!=='creativo'&&window.bandAvail&&bandAvail().includes(id)){s.ann[id]=1;const l=LORE[id];toast('Nueva amenaza: '+l[0]+'.');try{notify('🏴',l[0],l[1]+' Hay misiones en el tablón para pararlos.','alerta')}catch(e){}try{addLog(l[0]+': '+l[1])}catch(e){}}
  if(!s.fin[id]&&S.arc&&S.arc.s&&S.arc.s[id]>=4){s.fin[id]=1;toast(BANDS[id].n+' se ha desmantelado: ya no atacarán.');try{addLog(BANDS[id].n+' se ha desmantelado.')}catch(e){}}})}catch(e){}return r};
/* equipo de cada banda: armadura (reduce el daño recibido) y armas (alcance) */
const LOAD={cuervos:[0,1],viboras:[.08,1.1],ceniza:[.15,1.15],segadores:[.22,1.2],humo:[.3,1.3],hierro:[.42,1.4]};
const oZ3=window.zUpd;
window.zUpd=function(z,dt){const L=z.band&&LOAD[z.band];if(L&&z.act&&z.hp>0){if(!z.ldI){z.ldI=1;z.ar=L[0];z.rgm=z.t==='b'?L[1]:1}
  if(z.lh===undefined)z.lh=z.hp;const d=z.lh-z.hp;if(d>0&&z.ar&&z.t!=='p')z.hp=Math.min(z.mhp||z.hp,z.hp+d*z.ar);z.lh=z.hp}
 return oZ3.apply(this,arguments)};
/* armas visibles según el nivel de la banda */
const og=window.drawBandGear;
window.drawBandGear=function(c,z,q,f,k){if(og)og.apply(this,arguments);try{const id=z.band,hx=q[0]+f*5.5*k,hy=q[1]-11*k,at=z.at?1:0;
 if(z.t==='b'&&id&&id!=='cuervos'){const T2={viboras:[16,0,'#2a2a2c'],ceniza:[20,0,'#3a2a1c'],segadores:[22,1,'#3a2a1c'],humo:[24,1,'#25282b'],hierro:[28,2,'#1d2023']}[id];if(T2){c.lineCap='round';c.strokeStyle=T2[2];c.lineWidth=T2[1]===2?3:2.4;c.beginPath();c.moveTo(hx-f*5,hy+1.4);c.lineTo(hx+f*T2[0],hy-1.6);c.stroke();c.strokeStyle='#5a3d22';c.lineWidth=2.8;c.beginPath();c.moveTo(hx-f*6,hy+1.8);c.lineTo(hx-f*1,hy+.5);c.stroke();if(T2[1]>=1){c.strokeStyle='#9aa0a6';c.lineWidth=1.2;c.beginPath();c.moveTo(hx+f*6,hy-2.2);c.lineTo(hx+f*10,hy-2.2);c.stroke()}if(at){c.fillStyle='#ffd24a';c.beginPath();c.arc(hx+f*(T2[0]+2),hy-2,2.2,0,7);c.fill()}}}
 if(z.t==='k'&&(id==='humo'||id==='hierro'||id==='ceniza')){c.lineCap='round';c.strokeStyle=id==='hierro'?'#aab0b6':'#8a8f94';c.lineWidth=2.6;c.beginPath();c.moveTo(hx,hy+2);c.lineTo(hx+f*13*(at?1.1:.6),hy-12*(at?.2:.8));c.stroke();c.strokeStyle='#2a2a2c';c.lineWidth=3.4;c.beginPath();c.moveTo(hx+f*10*(at?1.1:.6),hy-10*(at?.2:.8)-1);c.lineTo(hx+f*14*(at?1.1:.6),hy-13*(at?.2:.8));c.stroke()}}catch(e){}};
})();
