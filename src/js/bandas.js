/* ===== Bandas de saqueadores: CENIZA (historia, roja), Los Cuervos (negra) y Las Víboras (morada). Atacan para destruir y cada ataque trae un portaestandarte. ===== */
(function(){
'use strict';
window.BANDS={
 ceniza:{n:'CENIZA',col:'#b8322c',acc:'#f0c0a0',flag:'#c8342c',em:'#2a0a08',story:1,tag:'la facción de Brandt'},
 cuervos:{n:'Los Cuervos',col:'#23232a',acc:'#c9c9d2',flag:'#17171c',em:'#e8e8ee',tag:'una banda de saqueadores del norte'},
 viboras:{n:'Las Víboras',col:'#7a3fae',acc:'#e6c8ff',flag:'#8a44c0',em:'#f0dcff',tag:'una banda de asaltantes de las carreteras'},
 segadores:{n:'Los Segadores',col:'#b08a22',acc:'#f1d472',flag:'#c9a227',em:'#3a2a06',tag:'una secta de campesinos armados con hoces que cosechan a los vivos'},
 humo:{n:'Los Hijos del Humo',col:'#5c6268',acc:'#ff9a3a',flag:'#3c4146',em:'#ffb04a',tag:'incendiarios enmascarados que lo queman todo a su paso'},
 hierro:{n:'La Hermandad del Hierro',col:'#6a4a3a',acc:'#c9cdd2',flag:'#7a3a22',em:'#d9dde2',tag:'una milicia acorazada de chatarreros, lenta pero casi imparable'}};
const B=BANDS,ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),isB=t=>t==='b'||t==='k'||t==='p';
window.isBan=isB;
if(typeof ZT!=='undefined'){ZT.k={n:'Matón',hp:95,sp:.85,d:13,c:'#8a6a4a'};ZT.p={n:'Portaestandarte',hp:125,sp:.72,d:5,c:'#8a6a4a',rng:2.5}}
const bn=()=>S.bn||(S.bn={next:(S.day||1)+6,n:0,last:'',weak:{},warned:0});
const sg=()=>S.mode==='creativo'?99:(S.story||0);
const avail=()=>[['cuervos',3],['viboras',6],['ceniza',10],['segadores',31],['humo',36],['hierro',41]].filter(a=>sg()>=a[1]&&!(S.arc&&S.arc.won&&['cuervos','viboras'].includes(a[0]))&&!(['segadores','humo','hierro'].includes(a[0])&&S.arc&&S.arc.s&&S.arc.s[a[0]]>=4)).map(a=>a[0]);window.bandAvail=avail;
const nm=id=>B[id].n;
/* ---- dibujo: banda de la cabeza, franja en el torso y bandera del portaestandarte ---- */
window.drawBandit=function(c,z){const b=B[z.band];if(!b)return;const q=P(z.x,z.y),f=z.dx<0?-1:1,k=z.t==='k'?1.08:1;
 c.save();c.fillStyle=b.acc;c.strokeStyle='rgba(10,8,6,.7)';c.lineWidth=.8;
 c.fillRect(q[0]-3.8*k,q[1]-23.6*k,7.6*k,2.1);c.strokeRect(q[0]-3.8*k,q[1]-23.6*k,7.6*k,2.1);
 c.beginPath();c.moveTo(q[0]-4*k*f,q[1]-22.6*k);c.lineTo(q[0]-7*k*f,q[1]-20*k);c.lineTo(q[0]-4*k*f,q[1]-20.4*k);c.fill();
 c.strokeStyle=b.acc;c.lineWidth=1.6;c.beginPath();c.moveTo(q[0]-4.6*k,q[1]-14.6*k);c.lineTo(q[0]+4.6*k,q[1]-9.4*k);c.stroke();
 const hx=q[0]+f*5.5*k,hy=q[1]-11*k,at=z.at?1:0;c.lineCap='round';
 if(z.t==='k'){const bat=(z.sd||0)%2,L=bat?11:9;c.strokeStyle=bat?'#6a4a2a':'#c9ccd0';c.lineWidth=bat?2.6:2;c.beginPath();c.moveTo(hx,hy+2);c.lineTo(hx+f*L*(at?1.1:.5),hy-L*(at?.2:.9));c.stroke();if(!bat){c.strokeStyle='#3a2a1c';c.lineWidth=2.4;c.beginPath();c.moveTo(hx,hy+2);c.lineTo(hx+f*1.5,hy)}c.stroke()}
 else if(z.t==='b'){c.strokeStyle='#1a1a1c';c.lineWidth=2.2;c.beginPath();c.moveTo(hx-f*3,hy+1);c.lineTo(hx+f*11,hy-1.5);c.stroke();c.strokeStyle='#5a3d22';c.lineWidth=2.6;c.beginPath();c.moveTo(hx-f*4,hy+1.2);c.lineTo(hx-f*1,hy+.6);c.stroke();if(at){c.fillStyle='#ffd24a';c.beginPath();c.arc(hx+f*13,hy-1.8,2,0,7);c.fill()}}
 else if(z.t==='p'){c.strokeStyle='#1a1a1c';c.lineWidth=2;c.beginPath();c.moveTo(hx,hy);c.lineTo(hx+f*5,hy-1);c.stroke()}
 if(z.t==='p'){const t=T*4+(z.sd||0),x0=q[0]+5*f,y0=q[1]-2,y1=q[1]-50;c.strokeStyle='#3a2a1c';c.lineWidth=1.8;c.beginPath();c.moveTo(x0,y0);c.lineTo(x0,y1);c.stroke();
  const w=17,h=11,fx=x0+f*1;c.fillStyle=b.flag;c.strokeStyle='rgba(10,8,6,.85)';c.lineWidth=1;c.beginPath();c.moveTo(fx,y1);
  for(let i=0;i<=6;i++)c.lineTo(fx+f*w*i/6,y1+Math.sin(t+i*.9)*1.6);for(let i=6;i>=0;i--)c.lineTo(fx+f*w*i/6,y1+h+Math.sin(t+i*.9)*1.6);c.closePath();c.fill();c.stroke();
  const mx=fx+f*w*.5,my=y1+h*.5+Math.sin(t+2.7)*1.2;c.fillStyle=b.em;c.strokeStyle=b.em;
  if(z.band==='ceniza'){c.beginPath();c.moveTo(mx,my-4);c.quadraticCurveTo(mx+3,my,mx+1.5,my+3.5);c.quadraticCurveTo(mx,my+1.5,mx-1.5,my+3.5);c.quadraticCurveTo(mx-3,my,mx,my-4);c.fill()}
  else if(z.band==='cuervos'){c.beginPath();c.arc(mx,my-.5,3,0,7);c.fill();c.fillStyle=b.flag;c.fillRect(mx-1.8,my-1.2,1.3,1.3);c.fillRect(mx+.6,my-1.2,1.3,1.3)}
  else if(z.band==='segadores'){c.lineWidth=1.6;c.beginPath();c.arc(mx,my+1,3.6,3.6,6.0);c.stroke();c.beginPath();c.moveTo(mx-3.6,my+1);c.lineTo(mx+1,my-3.5);c.stroke()}
  else if(z.band==='humo'){c.lineWidth=1.5;c.beginPath();c.moveTo(mx-3,my+3.5);c.bezierCurveTo(mx-4,my,mx+3,my,mx+1,my-3.8);c.stroke();c.beginPath();c.arc(mx+2,my+2.4,1.1,0,7);c.fill()}
  else if(z.band==='hierro'){c.beginPath();c.moveTo(mx-3.6,my-3.4);c.lineTo(mx+3.6,my-3.4);c.lineTo(mx+3.6,my+.4);c.lineTo(mx,my+4);c.lineTo(mx-3.6,my+.4);c.closePath();c.fill()}
  else{c.lineWidth=1.5;c.beginPath();c.moveTo(mx-4,my+2);c.bezierCurveTo(mx-2,my-4,mx+1,my+4,mx+4,my-2);c.stroke()}}
 if(window.drawBandGear)drawBandGear(c,z,q,f,k);
 c.restore()};
/* ---- botín: ropa con los colores de la banda ---- */
window.onBanditDeath=function(z){const b=B[z.band];if(!b||Math.random()>(z.t==='p'?1:.1))return;
 if(z.t==='p'){S.res.metal=Math.min(cap(),(S.res.metal||0)+20);toast('🏴 Estandarte de '+b.n+' derribado: +20 metal.');try{notify('🏴','Estandarte derribado',b.n+' pierde su bandera.','alerta')}catch(e){}return}
 const slot=['vest','jacket'][ri(0,1)],it={kind:'clothing',slot,n:(slot==='vest'?'Chaleco de ':'Chaqueta de ')+b.n,def:1+(z.t==='k'?1:0),col:b.col};S.inv.push(it);toast('Un bandido ha dejado: '+it.n+'.')};
/* ---- ataques ---- */
const MS={facil:.65,normal:1,dificil:1.3,apocaliptico:1.8,creativo:.8};
window.bandRaid=function(id){id=B[id]?id:'cuervos';const s=bn(),sc=MS[S.mode||'normal']||1,weak=(s.weak[id]||0)>=S.day?.6:(s.wk1===S.day?.8:1);
 const c=Math.max(4,Math.min(30,Math.round((4+s.n*1.5+S.ppl.length*.25+(typeof realHall==='function'?realHall():1)*.5)*sc*weak*(1+.02*Math.min(Math.max(sg(),({cuervos:3,viboras:6,ceniza:10,segadores:31,humo:36,hierro:41})[id]||0),48))))),k=Math.round(c*({cuervos:.45,viboras:.4,ceniza:.3,segadores:.18,humo:.08,hierro:0})[id]),comp={b:Math.max(2,c-k),k,p:1};
 s.n++;s.last=id;s.next=S.day+Math.max(4,ri(6,9)-Math.floor(Math.min(sg(),28)/5));s.warned=0;s.cur=id;
 startHorde('Asalto de '+nm(id),comp)};
const oSH=window.startHorde;
window.startHorde=function(name,over){const s=S&&S.bn,prev=S&&S.hs&&S.hs.band,r=oSH.apply(this,arguments);
 try{const id=(s&&s.cur&&over&&over.p)?s.cur:prev;if(id&&B[id]){Z.forEach(z=>{if(z.act&&isB(z.t)&&!z.band)z.band=id});const tm=({cuervos:1,viboras:1.2,ceniza:1.5,segadores:2.2,humo:2.7,hierro:3.4})[id]||1;Z.forEach(z=>{if(z.act&&z.band===id&&!z.tmd){z.tmd=1;z.dm=tm;z.hp=z.mhp=Math.round(z.mhp*tm)}});if(S.hs)S.hs.band=id;if(typeof horde!=='undefined'&&horde)horde.band=id;if(s)s.cur=''}}catch(e){}return r};
const oND=window.nextDay;
window.nextDay=function(){const r=oND.apply(this,arguments);try{const s=bn();if(S.day<4||!avail().length)return r;
  if(typeof horde!=='undefined'&&horde){if(S.day>=s.next)s.next=S.day+1;return r}
  if(!s.band||s.band===s.last&&Math.random()<.7){const a=avail().filter(x=>x!==s.last);s.band=a[ri(0,a.length-1)]||avail()[0]}if(s.band&&!avail().includes(s.band))s.band=avail()[0];
  if(S.day>=s.next){const id=s.band;s.band='';bandRaid(id);try{notify('🏴','Asalto de '+nm(id),'Atacan para destruir: defiende tus edificios y derriba al portaestandarte.','alerta')}catch(e){}}
  else if(S.day===s.next-1&&!s.warned){s.warned=1;const id=s.band,m='Los vigías avisan: '+nm(id)+' ('+B[id].tag+') asaltará el pueblo mañana. Refuerza las defensas.';toast('🏴 '+m);try{notify('🏴','Aviso: '+nm(id),m,'alerta')}catch(e){}}}catch(e){console.error('bandas',e)}return r};

})();
