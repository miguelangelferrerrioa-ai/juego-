/* Ayuntamiento 16-25: un edificio nuevo en cada nivel para que la progresión no se pare tras el capítulo 27.
   16 Hospital de campaña · 17 Garaje · 18 Torre de francotirador · 19 Escuela militar · 20 Puesto avanzado
   21 Antena de largo alcance · 22 Taller de fortificación · 23 Laboratorio de la cura · 24 Monumento a los caídos · 25 Plaza mayor */
(function(){
'use strict';
const K=window.NBK;if(!K)return;const {V,vol,crate,post,line,wnd,dor,sacks,OLC}=K;
const has=t=>{try{return S.bld.some(b=>b.type===t&&!b.cons)}catch(e){return false}};
const lv=t=>{try{return S.bld.filter(b=>b.type===t&&!b.cons).reduce((a,b)=>Math.max(a,b.lvl),0)}catch(e){return 0}};
const LATE={wood:400,metal:700,steel:70,concrete:70,glass:40};
const C=(k)=>{const o={};for(const x in LATE)o[x]=Math.round(LATE[x]*k);return o};
Object.assign(BT,{
 hospc:{n:'Hospital de campaña',w:3,h:3,z:30,c:'#c9cfc6',cost:C(1),lv:16,hp:420,p:{meds:3},job:['Médico'],slots:3,f:'Cada amanecer cura a todo el pueblo (+25 de vida y menos heridas) y produce medicinas.'},
 garaje:{n:'Garaje de vehículos',w:3,h:3,z:30,c:'#6d6a62',cost:C(1.1),lv:17,hp:400,p:{gas:4},job:['Mecánico'],slots:2,f:'Vehículos para las expediciones: +25 % de botín al volver de cada expedición (+5 % por nivel).'},
 sniper:{n:'Torre de francotirador',w:2,h:2,z:124,c:'#6a5a48',cost:C(1.15),lv:18,hp:360,fire:{r:13,d:24,rt:1.6},gun:1,slots:2,job:['Soldado'],f:'Puesto de tirador de largo alcance: casi el doble de alcance y mucho más daño que una torre de vigilancia. Necesita tiradores con arma de fuego.'},
 escuela:{n:'Escuela militar',w:3,h:3,z:34,c:'#5f6a4c',cost:C(1.2),lv:19,hp:420,job:['Soldado'],slots:2,f:'Cada amanecer todos los soldados alistados ganan experiencia (25 + 5 por nivel de la escuela), sin coste.'},
 puesto:{n:'Puesto avanzado',w:3,h:3,z:26,c:'#7a6a4a',cost:C(1.25),lv:20,hp:500,p:{wood:20,metal:14,stone:8},job:['Recolector','Explorador'],slots:3,f:'Campamento fuera de las murallas que recoge materiales del exterior sin parar.'},
 radiolr:{n:'Antena de largo alcance',w:2,h:2,z:90,c:'#8a9098',cost:C(1.3),lv:21,hp:360,job:['Explorador'],slots:1,f:'Cada 3 días contacta con supervivientes lejanos: llega un refugiado (si hay sitio) o una caravana con materiales.'},
 fortif:{n:'Taller de fortificación',w:3,h:3,z:30,c:'#7a7a74',cost:C(1.35),lv:22,hp:600,job:['Constructor'],slots:2,f:'Refuerza las murallas: muros y puertas +30 % de vida (+5 % por nivel del taller).'},
 curalab:{n:'Laboratorio de la cura',w:3,h:3,z:40,c:'#9fd0c6',cost:C(1.4),lv:23,hp:420,p:{rp:20},job:['Científico','Médico'],slots:2,f:'Investiga una cura: todos los infectados nuevos aparecen con un 15 % menos de vida (+1 % por nivel).'},
 monum:{n:'Monumento a los caídos',w:2,h:2,z:70,c:'#b8b2a4',cost:C(1.45),lv:24,hp:500,f:'Recuerdo de quienes no llegaron: +1 % de producción en todo el pueblo por cada 5 supervivientes (máx. +25 %).'},
 plaza:{n:'Plaza mayor',w:4,h:4,z:24,c:'#c9b58a',cost:C(1.6),lv:25,hp:600,f:'La ciudad renace: +10 % de producción y se abren los retos de fin de juego sin límite (Opciones → Retos).'}
});
/* ---------- dibujos ---------- */
const NB=window.NB;const slab=(c,w,h,col)=>vol(c,{x:-.08,y:-.08,w:w+.16,h:h+.16,z:2,col:col||'#85817a',mat:'block',seed:2});
const glow=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
const flag=(c,x,y,z,col)=>{post(c,x,y,z-14,z+4,'#5a4a3a');const p=V(x,y,z+4);c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+12,p[1]+3);c.lineTo(p[0],p[1]+7);c.closePath();c.fill();c.stroke()};
NB.hospc={up:90,paint(c){slab(c,3,3,'#9a9a90');
 vol(c,{x:.3,y:.3,w:2.4,h:2.4,z:22,z0:2,col:'#d8ddd4',mat:'plaster',seed:3,decL:(c,l)=>{wnd(c,l*.2,-12,9,7,{lit:true});wnd(c,l*.6,-12,9,7,{lit:true})},decR:(c,l)=>{dor(c,l/2-6,-14,12,14,{col:'#3a5a4a'})}});
 vol(c,{x:.2,y:.2,w:2.6,h:2.6,z:3,z0:24,col:'#b9c0b4',mat:'block',seed:4});
 const p=V(1.5,1.5,30);c.fillStyle='#fff';c.fillRect(p[0]-9,p[1]-3,18,6);c.fillStyle='#d23a2e';c.fillRect(p[0]-7,p[1]-1.5,14,3);c.fillRect(p[0]-1.5,p[1]-6,3,12);
 for(let i=0;i<3;i++)crate(c,.25+i*.5,2.75,2,.28,'#e8e8e0')}};
NB.garaje={up:90,paint(c){slab(c,3,3,'#6f6c64');
 vol(c,{x:.2,y:.2,w:2.6,h:2.6,z:24,z0:2,col:'#6d6a62',mat:'metal',seed:3,decR:(c,l)=>{c.fillStyle='#2a2a28';c.fillRect(l*.15,-18,l*.7,16);c.strokeStyle='#4a4a46';for(let k=0;k<5;k++){c.beginPath();c.moveTo(l*.15,-18+k*3.2);c.lineTo(l*.85,-18+k*3.2);c.stroke()}},decL:(c,l)=>{wnd(c,l*.3,-16,10,6,{lit:false})}});
 vol(c,{x:.1,y:.1,w:2.8,h:2.8,z:3,z0:26,col:'#4a4a46',mat:'metal',seed:5});
 /* camioneta */vol(c,{x:3.1,y:1.6,w:.8,h:1.3,z:7,z0:2,col:'#7a3a2a',mat:'metal',seed:8});vol(c,{x:3.1,y:1.6,w:.8,h:.6,z:5,z0:9,col:'#5a2a1e',mat:'metal',seed:9})}};
NB.sniper={up:90,paint(c){slab(c,2,2,'#5f584e');
 for(const [x,y] of [[.25,.25],[1.75,.25],[.25,1.75],[1.75,1.75]])post(c,x,y,2,100,'#5a4a38');
 line(c,V(.25,.25,40),V(1.75,1.75,80),'#4a3a2a',2);line(c,V(1.75,.25,40),V(.25,1.75,80),'#4a3a2a',2);
 vol(c,{x:0,y:0,w:2,h:2,z:16,z0:100,col:'#6a5a48',mat:'plank',seed:3,decR:(c,l)=>{c.fillStyle='#1a1410';c.fillRect(l*.25,-11,l*.5,5)},decL:(c,l)=>{c.fillStyle='#1a1410';c.fillRect(l*.25,-11,l*.5,5)}});
 vol(c,{x:-.15,y:-.15,w:2.3,h:2.3,z:6,z0:116,col:'#4a3e30',mat:'plank',seed:4});
 const p=V(1.6,1.3,110);line(c,p,[p[0]+22,p[1]-4],'#2a2a2a',2.4)}};
NB.escuela={up:90,paint(c){slab(c,3,3,'#6a6a5a');
 vol(c,{x:.2,y:.6,w:2.6,h:2,z:26,z0:2,col:'#5f6a4c',mat:'block',seed:3,decL:(c,l)=>{for(let k=0;k<3;k++)wnd(c,l*(.12+k*.28),-16,8,7,{lit:true})},decR:(c,l)=>{dor(c,l/2-6,-14,12,14,{col:'#2a3020'})}});
 vol(c,{x:.1,y:.5,w:2.8,h:2.2,z:3,z0:28,col:'#3f4a30',mat:'block',seed:5});
 /* campo de tiro */for(let i=0;i<3;i++){post(c,.4+i*.9,.25,2,12,'#7a5a3a');const q=V(.4+i*.9,.25,14);c.fillStyle='#e8e2cc';c.beginPath();c.arc(q[0],q[1],4,0,7);c.fill();c.fillStyle='#c23a2e';c.beginPath();c.arc(q[0],q[1],2,0,7);c.fill()}
 flag(c,2.8,2.8,28,'#4f6a3a')}};
NB.puesto={up:90,paint(c){slab(c,3,3,'#7a6a52');
 /* tiendas de campaña, cajas y fogata */
 const tent=(x,y,col)=>{const a=V(x,y,2),b=V(x+1,y,2),d=V(x+1,y+1,2),e=V(x,y+1,2),t=V(x+.5,y+.5,20);c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(t[0],t[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(d[0],d[1]);c.lineTo(t[0],t[1]);c.lineTo(b[0],b[1]);c.closePath();c.fillStyle='rgba(0,0,0,.18)';c.fill();c.stroke()};
 tent(.2,.2,'#7a8a5a');tent(1.6,.3,'#8a7a52');tent(.3,1.6,'#6a7a4a');for(let i=0;i<4;i++)crate(c,1.7+(i%2)*.5,1.8+(i>>1)*.5,2,.32,'#6a4a2a');sacks(c,2.6,1.4,2,2);
 const f=V(1.4,1.5,4);glow(c,f[0],f[1],10,'rgba(255,170,60,.6)');c.fillStyle='#ff9a30';c.beginPath();c.arc(f[0],f[1],2.5,0,7);c.fill();flag(c,2.8,.2,26,'#c9a23a')}};
NB.radiolr={up:90,paint(c){slab(c,2,2,'#7a7a74');
 vol(c,{x:.2,y:.9,w:1,h:.9,z:14,z0:2,col:'#8a9098',mat:'metal',seed:3,decR:(c,l)=>{dor(c,l/2-4,-10,8,10,{col:'#3a4048'})}});
 const b=V(1.4,.6,2),t=V(1.4,.6,88);line(c,[b[0]-8,b[1]],t,'#9aa2aa',2);line(c,[b[0]+8,b[1]],t,'#9aa2aa',2);for(let k=1;k<6;k++){const y=b[1]+(t[1]-b[1])*k/6,w=8*(1-k/6);line(c,[t[0]-w,y],[t[0]+w,y],'#9aa2aa',1.2)}
 c.fillStyle='#e04a3a';c.beginPath();c.arc(t[0],t[1],2.4,0,7);c.fill();glow(c,t[0],t[1],8,'rgba(255,80,60,.5)');const d=V(1.4,.6,62);c.fillStyle='#d4dadd';c.strokeStyle=OLC;c.beginPath();c.ellipse(d[0]+8,d[1],7,5,-.5,0,7);c.fill();c.stroke()}};
NB.fortif={up:90,paint(c){slab(c,3,3,'#7a7872');
 vol(c,{x:.3,y:.3,w:2.4,h:2.4,z:22,z0:2,col:'#7a7a74',mat:'concrete',seed:3,decR:(c,l)=>{c.fillStyle='#2a2a28';c.fillRect(l*.2,-16,l*.6,14)},decL:(c,l)=>{wnd(c,l*.4,-16,10,5,{lit:true})}});
 vol(c,{x:.2,y:.2,w:2.6,h:2.6,z:3,z0:24,col:'#5a5a56',mat:'concrete',seed:5});
 for(let i=0;i<3;i++)vol(c,{x:.1+i*.95,y:2.75,w:.8,h:.22,z:9,z0:2,col:'#9a968c',mat:'concrete',seed:7+i});for(let i=0;i<4;i++)crate(c,2.75,.2+i*.6,2,.26,'#8a8a82')}};
NB.curalab={up:90,paint(c){slab(c,3,3,'#8a948e');
 vol(c,{x:.3,y:.3,w:2.4,h:2.4,z:30,z0:2,col:'#d4e6e0',mat:'plaster',seed:3,decL:(c,l)=>{for(let k=0;k<3;k++)wnd(c,l*(.1+k*.3),-22,8,10,{lit:true})},decR:(c,l)=>{dor(c,l/2-5,-14,10,14,{col:'#2a4a48'})}});
 vol(c,{x:.2,y:.2,w:2.6,h:2.6,z:3,z0:32,col:'#9fd0c6',mat:'block',seed:5});
 const p=V(1.5,1.5,40);c.fillStyle='rgba(140,255,200,.35)';c.strokeStyle=OLC;c.beginPath();c.ellipse(p[0],p[1],18,9,0,Math.PI,0,false);c.closePath();c.fill();c.stroke();glow(c,p[0],p[1]-4,16,'rgba(120,255,190,.45)');
 for(let i=0;i<3;i++){const q=V(.6+i*.6,1.5,38);c.fillStyle=['#5ad08a','#6fd0ff','#f2c542'][i];c.fillRect(q[0]-1.5,q[1]-6,3,6)}}};
NB.monum={up:90,paint(c){slab(c,2,2,'#a8a296');
 vol(c,{x:.3,y:.3,w:1.4,h:1.4,z:8,z0:2,col:'#b8b2a4',mat:'block',seed:3});vol(c,{x:.7,y:.7,w:.6,h:.6,z:52,z0:10,col:'#cfc9ba',mat:'block',seed:4});
 const t=V(1,1,64);c.fillStyle='#e8e2cc';c.strokeStyle=OLC;c.beginPath();c.moveTo(t[0]-6,t[1]+4);c.lineTo(t[0],t[1]-6);c.lineTo(t[0]+6,t[1]+4);c.closePath();c.fill();c.stroke();
 for(let i=0;i<4;i++){const q=V(.2+i*.5,1.85,3);c.fillStyle='#f2c542';c.beginPath();c.arc(q[0],q[1],1.6,0,7);c.fill();glow(c,q[0],q[1],6,'rgba(255,200,90,.5)')}}};
NB.plaza={up:90,paint(c){slab(c,4,4,'#c9b58a');
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){if((i+j)%2)continue;const a=V(i,j,2.2),b=V(i+1,j,2.2),d=V(i+1,j+1,2.2),e=V(i,j+1,2.2);c.fillStyle='rgba(120,90,50,.18)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.fill()}
 /* fuente central */vol(c,{x:1.4,y:1.4,w:1.2,h:1.2,z:6,z0:2,col:'#a8a296',mat:'block',seed:3});const f=V(2,2,9);c.fillStyle='#6fb6d8';c.beginPath();c.ellipse(f[0],f[1],16,8,0,0,7);c.fill();vol(c,{x:1.85,y:1.85,w:.3,h:.3,z:14,z0:8,col:'#cfc9ba',mat:'block',seed:4});glow(c,f[0],f[1]-14,10,'rgba(160,220,255,.6)');
 for(const [x,y] of [[.3,.3],[3.7,.3],[.3,3.7],[3.7,3.7]]){post(c,x,y,2,26,'#3a3a3a');const q=V(x,y,28);c.fillStyle='#ffe08a';c.beginPath();c.arc(q[0],q[1],2.6,0,7);c.fill();glow(c,q[0],q[1],9,'rgba(255,220,120,.55)')}
 for(const [x,y] of [[.3,2],[3.7,2]]){const q=V(x,y,4);c.fillStyle='#4f7a3a';c.beginPath();c.arc(q[0],q[1]-6,7,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}}};
/* ---------- efectos ---------- */
window.fortMul=()=>{const L=lv('fortif');return L?1.3+.05*(L-1):1};
const oMk=window.mkZ;if(typeof oMk==='function'){window.mkZ=function(){const z=oMk.apply(this,arguments);try{const L=lv('curalab');if(L&&z&&z.act){const k=Math.max(.6,1-(.15+.01*(L-1)));z.hp*=k;z.mhp*=k}}catch(e){}return z};try{mkZ=window.mkZ}catch(e){}}
const oOut=window.out;if(typeof oOut==='function'){window.out=function(b){const o=oOut.apply(this,arguments);try{let m=1;if(has('monum'))m+=Math.min(.25,Math.floor(S.ppl.length/5)*.01);if(has('plaza'))m+=.1;if(m>1&&o&&BT[b.type]&&BT[b.type].p)for(const k in o)if(k!=='elec'&&o[k]>0)o[k]*=m}catch(e){}return o};try{out=window.out}catch(e){}}
const oEx=window.exEnd;if(typeof oEx==='function'){window.exEnd=function(){try{const L=lv('garaje');if(L&&S.exp&&S.exp.loot){const m=1.25+.05*(L-1);for(const k in S.exp.loot)S.exp.loot[k]*=m}}catch(e){}return oEx.apply(this,arguments)};try{exEnd=window.exEnd}catch(e){}}
/* cada amanecer */
let lastDay=null;
function daily(){if(!S||S.over)return;if(lastDay===null){lastDay=S.day;return}if(S.day===lastDay)return;lastDay=S.day;const msg=[];
 if(has('hospc')){S.ppl.forEach(p=>{if(p.away)return;p.hp=Math.min(mhp(p),p.hp+25);p.injury=Math.max(0,(p.injury||0)-20)});msg.push('🏥 El hospital de campaña cura al pueblo.')}
 const E=lv('escuela');if(E){const xp=25+5*E;let n=0;S.ppl.forEach(p=>{if(p.arm&&!p.away){p.xp+=xp;try{lvlUp(p)}catch(e){}n++}});if(n)msg.push('🎖 Escuela militar: '+n+' soldados ganan '+xp+' de experiencia.')}
 if(has('radiolr')&&S.day%3===0){if(S.ppl.length<pcap()){try{const p=mkP();const h=S.bld.find(b=>b.type==='hall')||{x:30,y:30,w:3,h:3};p.x=p.tx=h.x+h.w/2;p.y=p.ty=h.y+h.h+1;p.job=0;S.ppl.push(p);msg.push('📡 La antena contacta con supervivientes: '+p.n+' se une al pueblo.')}catch(e){}}
  else{const m=40+S.day%40,sc=20+S.day%25;S.res.metal+=m;S.res.scrap=(S.res.scrap||0)+sc;S.res.ammo+=15;msg.push('📡 Llega una caravana por radio: +'+m+' metal, +'+sc+' chatarra, +15 munición.')}}
 msg.forEach((t,i)=>setTimeout(()=>{try{toast(t)}catch(e){}},1200+i*900))}
setInterval(()=>{try{daily()}catch(e){}},1000);
})();
