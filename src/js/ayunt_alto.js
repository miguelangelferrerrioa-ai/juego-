/* Ayuntamiento 16-25: un edificio nuevo en cada nivel para que la progresión no se pare tras el capítulo 27.
   16 Hospital de campaña · 17 Garaje · 18 Torre de francotirador · 19 Escuela militar · 20 Puesto avanzado
   21 Antena de largo alcance · 22 Taller de fortificación · 23 Laboratorio de la cura · 24 Monumento a los caídos · 25 Plaza mayor */
(function(){
'use strict';
const K=window.NBK;if(!K)return;const {V,vol,crate,post,line,wnd,dor,sacks,OLC,gableY,cyl,sign}=K;
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
 perrera:{n:'Perrera',w:2,h:2,z:22,c:'#8a6a4a',cost:{wood:500,metal:400,steel:20,concrete:20},lv:14,hp:300,job:['Explorador','Recolector'],slots:2,f:'Perros guardianes: muerden a los infectados que se cuelan en el pueblo (más daño por nivel).'},
 polvorin:{n:'Polvorín',w:2,h:2,z:24,c:'#6a6450',cost:C(1.05),lv:16,hp:420,p:{ammo:10},job:['Soldado','Mecánico'],slots:2,f:'Produce munición y las fábricas de munición y talleres de armas fabrican un 25 % más.'},
 drones:{n:'Taller de drones',w:2,h:2,z:30,c:'#5a6a7a',cost:C(1.15),lv:18,hp:360,job:['Mecánico','Científico'],slots:2,f:'Un dron vigila el pueblo y marca a los enemigos: las torres les hacen un 15 % más de daño (+3 % por nivel).'},
 hidro:{n:'Invernadero hidropónico',w:3,h:2,z:26,c:'#7ab07a',cost:C(1.25),lv:20,hp:360,p:{food:30,water:18},pw:1,job:['Agricultor','Científico'],slots:3,f:'Mucha comida y agua en poco espacio. Necesita energía.'},
 nuclear:{n:'Central nuclear',w:3,h:3,z:60,c:'#9aa0a4',cost:C(1.5),lv:22,hp:800,p:{elec:160},job:['Científico','Mecánico'],slots:3,f:'Muchísima energía para toda la ciudad. Solo se puede construir una.'},
 plaza:{n:'Plaza mayor',w:4,h:4,z:24,c:'#c9b58a',cost:C(1.6),lv:25,hp:600,f:'La ciudad renace: +10 % de producción y se abren los retos de fin de juego sin límite (Opciones → Retos).'}
});
/* límites: los de efecto único no suman al repetirlos */
['hospc','garaje','escuela','radiolr','fortif','curalab','monum','plaza','nuclear','drones','perrera'].forEach(t=>BT[t].lim=1);BT.puesto.lim=2;BT.polvorin.lim=2;
/* no se puede colocar otro si ya está al máximo */
{const oP=window.pickB;if(typeof oP==='function'){window.pickB=function(t){const d=BT[t];if(d&&d.lim&&S.bld.filter(b=>b.type===t).length>=d.lim){try{toast(d.n+': '+(d.lim===1?'solo se puede construir uno':'máximo '+d.lim)+'.')}catch(e){}return}return oP.apply(this,arguments)};try{pickB=window.pickB}catch(e){}}}
/* ---------- dibujos ---------- */
const NB=window.NB;const slab=(c,w,h,col)=>vol(c,{x:-.08,y:-.08,w:w+.16,h:h+.16,z:2,col:col||'#85817a',mat:'block',seed:2});
const glow=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
const flag=(c,x,y,z,col)=>{post(c,x,y,z-14,z+4,'#5a4a3a');const p=V(x,y,z+4);c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+12,p[1]+3);c.lineTo(p[0],p[1]+7);c.closePath();c.fill();c.stroke()};
NB.hospc={up:90,paint(c){slab(c,3,3,'#9a9a90');
 /* detrás: tienda de campaña verde con cruz */
 const tent=(x,y,w,h,col)=>{const b=V(x+w,y,2),d=V(x+w,y+h,2),e=V(x,y+h,2),t1=V(x,y+h/2,16),t2=V(x+w,y+h/2,16);c.strokeStyle=OLC;c.lineWidth=1.2;c.fillStyle=col;c.beginPath();c.moveTo(e[0],e[1]);c.lineTo(t1[0],t1[1]);c.lineTo(t2[0],t2[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(d[0],d[1]);c.lineTo(t2[0],t2[1]);c.lineTo(b[0],b[1]);c.closePath();c.fill();c.stroke()};
 tent(.1,.1,.8,1.2,'#6a7a4a');const tc=V(.5,.7,12);c.fillStyle='#fff';c.fillRect(tc[0]-4,tc[1]-1,8,3);c.fillStyle='#d23a2e';c.fillRect(tc[0]-3,tc[1]-.5,6,2);c.fillRect(tc[0]-1,tc[1]-3,2,6);
 /* edificio principal (deja libre la franja de delante) */
 vol(c,{x:1,y:.15,w:1.85,h:1.85,z:22,z0:2,col:'#e2e6dc',mat:'plaster',seed:3,decL:(c,l)=>{wnd(c,l*.2,-13,8,6,{lit:true});wnd(c,l*.6,-13,8,6,{lit:true})},decR:(c,l)=>{dor(c,l*.15,-15,13,15,{col:'#3a6a5a'});c.fillStyle='#d23a2e';c.fillRect(l*.6,-18,l*.3,4)}});
 vol(c,{x:.92,y:.07,w:2.01,h:2.01,z:3,z0:24,col:'#c9cfc6',mat:'block',seed:4});
 const p=V(1.92,1.07,27);c.fillStyle='#fff';c.beginPath();c.ellipse(p[0],p[1],20,10,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();c.fillStyle='#d23a2e';c.fillRect(p[0]-12,p[1]-2.2,24,4.4);c.fillRect(p[0]-2.6,p[1]-7,5.2,14);
 /* delante: camillas y la ambulancia aparcada, sin tapar el edificio */
 for(let i=0;i<3;i++)crate(c,.2+i*.32,1.65,2,.22,'#e8e8e0');
 const ax=1.25,ay=2.2;vol(c,{x:ax,y:ay,w:1.15,h:.6,z:8,z0:3,col:'#f0f0ea',mat:'metal',seed:11});const a=V(ax+.55,ay+.6,7);c.fillStyle='#d23a2e';c.fillRect(a[0]-8,a[1]-2,16,2.6);const lz=V(ax+.3,ay+.3,11);c.fillStyle='#4a8ad8';c.fillRect(lz[0]-3,lz[1]-2,6,2);
 [V(ax+.2,ay+.6,3),V(ax+.95,ay+.6,3)].forEach(w=>{c.fillStyle='#151515';c.beginPath();c.ellipse(w[0],w[1],3,2.4,0,0,7);c.fill()})}};
NB.garaje={up:90,paint(c){slab(c,3,3,'#6f6c64');
 const door=(c,x,w)=>{c.fillStyle='#3a3c3a';c.fillRect(x,-20,w,18);c.strokeStyle='#5a5c58';c.lineWidth=1;for(let k=0;k<6;k++){c.beginPath();c.moveTo(x,-20+k*3);c.lineTo(x+w,-20+k*3);c.stroke()}c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(x,-20,w,18);c.fillStyle='#e0a124';c.fillRect(x,-2.5,w,2)};
 /* detrás: neumáticos y bidones */
 for(let i=0;i<3;i++){const t=V(.25,.25,3+i*2.6);c.fillStyle='#1c1c1c';c.strokeStyle='#000';c.lineWidth=1;c.beginPath();c.ellipse(t[0],t[1],5,2.6,0,0,7);c.fill();c.stroke();c.fillStyle='#4a4a4a';c.beginPath();c.ellipse(t[0],t[1],2,1,0,0,7);c.fill()}
 for(let i=0;i<3;i++){const b=V(.75+i*.3,.22,2);cyl(c,b[0],b[1],2.6,8,['#3f6a3a','#c23a2e','#3f6a3a'][i],{bands:1})}
 /* nave con dos portones enrollables */
 vol(c,{x:.15,y:.55,w:2.05,h:2.3,z:22,z0:2,col:'#7a766c',mat:'metal',seed:3,
  decR:(c,l)=>{door(c,l*.08,l*.38);door(c,l*.54,l*.38);sign(c,l*.32,-29,l*.36,6,'','#c9a23a')},
  decL:(c,l)=>{wnd(c,l*.2,-16,10,7,{lit:true});dor(c,l*.7,-13,7,12,{col:'#2a2a28'})}});
 gableY(c,{x:.1,y:.5,w:2.15,h:2.4,z:24,rh:10,col:'#5a4a3a',wallCol:'#7a766c',mat:'metal',seed:6,oh:.1,rows:6});
 const sk=V(1.15,1.7,32);c.fillStyle='rgba(160,210,240,.75)';c.strokeStyle=OLC;c.lineWidth=1;c.beginPath();c.moveTo(sk[0]-6,sk[1]);c.lineTo(sk[0],sk[1]-3);c.lineTo(sk[0]+6,sk[1]);c.lineTo(sk[0],sk[1]+3);c.closePath();c.fill();c.stroke();
 /* delante de los portones: surtidor y todoterreno */
 vol(c,{x:2.55,y:.45,w:.28,h:.28,z:13,z0:2,col:'#c23a2e',mat:'metal',seed:9});const g=V(2.69,.73,12);c.fillStyle='#ffe9a8';c.fillRect(g[0]-2,g[1]-1,4,3);
 const x=2.32,y=1.35;vol(c,{x,y,w:.6,h:1.15,z:6,z0:3,col:'#5a6a3a',mat:'metal',seed:11});vol(c,{x:x+.04,y:y+.38,w:.52,h:.5,z:5,z0:9,col:'#4a5a30',mat:'metal',seed:12});
 [V(x+.6,y+.2,3),V(x+.6,y+.95,3)].forEach(w=>{c.fillStyle='#151515';c.beginPath();c.ellipse(w[0],w[1],3.2,2.6,0,0,7);c.fill()});const f=V(x+.6,y+.1,8);c.fillStyle='#ffe08a';c.fillRect(f[0]-1,f[1],2,1.6)}};
NB.sniper={up:90,paint(c){slab(c,2,2,'#5f584e');
 for(const [x,y] of [[.25,.25],[1.75,.25],[.25,1.75],[1.75,1.75]])post(c,x,y,2,100,'#5a4a38');
 for(let k=0;k<3;k++){line(c,V(.25,.25,10+k*30),V(1.75,1.75,38+k*30),'#4a3a2a',2);line(c,V(1.75,.25,10+k*30),V(.25,1.75,38+k*30),'#4a3a2a',2)}
 /* escalera */const l0=V(1.75,1.2,2),l1=V(1.75,1.2,100);line(c,[l0[0]-3,l0[1]],[l1[0]-3,l1[1]],'#7a5a3a',1.6);line(c,[l0[0]+3,l0[1]],[l1[0]+3,l1[1]],'#7a5a3a',1.6);for(let k=1;k<12;k++){const y=l0[1]+(l1[1]-l0[1])*k/12;line(c,[l0[0]-3,y],[l0[0]+3,y],'#7a5a3a',1.2)}
 vol(c,{x:0,y:0,w:2,h:2,z:4,z0:100,col:'#5a4a38',mat:'plank',seed:3});
 /* sacos terreros en el borde y francotirador tumbado */const sb=(x,y)=>{const q=V(x,y,105);c.fillStyle='#b8a274';c.strokeStyle=OLC;c.lineWidth=1;c.beginPath();c.ellipse(q[0],q[1],5.5,3,0,0,7);c.fill();c.stroke()};for(let i=0;i<5;i++)sb(.15+i*.42,1.88);for(let i=0;i<4;i++)sb(1.88,.15+i*.42);
 const sp=V(1.2,1.2,106);c.fillStyle='#4a5a30';c.beginPath();c.ellipse(sp[0],sp[1],7,3,-.4,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();c.fillStyle='#e0b080';c.beginPath();c.arc(sp[0]+6,sp[1]-2,2.6,0,7);c.fill();c.stroke();line(c,[sp[0]+5,sp[1]-1],[sp[0]+26,sp[1]+3],'#1a1a1a',2.2);c.fillStyle='#2a2a2a';c.fillRect(sp[0]+10,sp[1]-3,5,2.4);
 /* tejado de lona */const r=[V(-.1,-.1,124),V(2.1,-.1,124),V(2.1,2.1,124),V(-.1,2.1,124)],top=V(1,1,134);c.fillStyle='#6a5a3a';c.strokeStyle=OLC;c.lineWidth=1.2;[[0,1],[1,2],[2,3],[3,0]].forEach(([a,b],k)=>{c.fillStyle=k%2?'#5a4a2e':'#7a6a46';c.beginPath();c.moveTo(r[a][0],r[a][1]);c.lineTo(r[b][0],r[b][1]);c.lineTo(top[0],top[1]);c.closePath();c.fill();c.stroke()});
 for(const [x,y] of [[-.05,-.05],[2.05,-.05],[2.05,2.05],[-.05,2.05]])post(c,x,y,104,124,'#5a4a38')}};
NB.escuela={up:90,paint(c){slab(c,3,3,'#6a6a5a');
 vol(c,{x:.2,y:.6,w:2.6,h:2,z:26,z0:2,col:'#5f6a4c',mat:'block',seed:3,decL:(c,l)=>{for(let k=0;k<3;k++)wnd(c,l*(.12+k*.28),-16,8,7,{lit:true})},decR:(c,l)=>{dor(c,l/2-6,-14,12,14,{col:'#2a3020'})}});
 vol(c,{x:.1,y:.5,w:2.8,h:2.2,z:3,z0:28,col:'#3f4a30',mat:'block',seed:5});
 /* campo de tiro */for(let i=0;i<3;i++){post(c,.4+i*.9,.25,2,12,'#7a5a3a');const q=V(.4+i*.9,.25,14);c.fillStyle='#e8e2cc';c.beginPath();c.arc(q[0],q[1],4,0,7);c.fill();c.fillStyle='#c23a2e';c.beginPath();c.arc(q[0],q[1],2,0,7);c.fill()}
 flag(c,2.8,2.8,28,'#4f6a3a')}};
NB.puesto={up:90,paint(c){slab(c,3,3,'#7a6a52');
 /* empalizada de troncos alrededor (lados de atrás primero) */
 const stake=(x,y)=>{post(c,x,y,2,15,'#6a4a2a');const q=V(x,y,16);c.fillStyle='#8a6a3a';c.beginPath();c.moveTo(q[0]-2,q[1]+1);c.lineTo(q[0],q[1]-3);c.lineTo(q[0]+2,q[1]+1);c.fill()};
 for(let i=0;i<=12;i++)stake(.05+i*.24,.05);for(let i=1;i<=12;i++)stake(.05,.05+i*.24);
 /* torreta de vigía de madera en la esquina */for(const [x,y] of [[.25,.25],[.85,.25],[.25,.85],[.85,.85]])post(c,x,y,2,34,'#5a4030');vol(c,{x:.15,y:.15,w:.8,h:.8,z:3,z0:34,col:'#7a5a38',mat:'plank',seed:4});const rt=V(.55,.55,48);c.fillStyle='#6a4a2e';c.strokeStyle=OLC;c.beginPath();const r4=[V(.1,.1,38),V(1,.1,38),V(1,1,38),V(.1,1,38)];c.moveTo(r4[0][0],r4[0][1]);c.lineTo(rt[0],rt[1]);c.lineTo(r4[1][0],r4[1][1]);c.lineTo(r4[2][0],r4[2][1]);c.lineTo(rt[0],rt[1]);c.lineTo(r4[3][0],r4[3][1]);c.closePath();c.fill();c.stroke();
 /* tiendas de campaña de colores */
 const tent=(x,y,col,col2)=>{const b=V(x+.9,y,2),d=V(x+.9,y+.8,2),e=V(x,y+.8,2),t1=V(x,y+.4,17),t2=V(x+.9,y+.4,17);c.strokeStyle=OLC;c.lineWidth=1.2;c.fillStyle=col;c.beginPath();c.moveTo(e[0],e[1]);c.lineTo(t1[0],t1[1]);c.lineTo(t2[0],t2[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();c.stroke();c.fillStyle=col2;c.beginPath();c.moveTo(d[0],d[1]);c.lineTo(t2[0],t2[1]);c.lineTo(b[0],b[1]);c.closePath();c.fill();c.stroke();const m=V(x+.9,y+.4,6);c.fillStyle='#2a1a10';c.beginPath();c.moveTo(m[0]-2,m[1]+4);c.lineTo(m[0],m[1]-4);c.lineTo(m[0]+2,m[1]+4);c.fill()};
 tent(1.25,.3,'#6a7a4a','#55623a');tent(1.15,1.35,'#9a7a42','#7a6034');
 /* generador, bidones y leña */vol(c,{x:2.35,y:.35,w:.45,h:.35,z:8,z0:2,col:'#6a7a5a',mat:'metal',seed:9});const gx=V(2.6,.55,11);c.fillStyle='#ffe08a';c.fillRect(gx[0]-1,gx[1]-1,2,2);
 for(let i=0;i<2;i++){const b=V(2.45+i*.25,1.05,2);cyl(c,b[0],b[1],2.4,7,'#3f6a3a',{bands:1})}
 for(let i=0;i<3;i++)vol(c,{x:.25,y:1.3+i*.12,w:.8,h:.1,z:1.6,z0:2+i*1.4,col:'#7a5432',mat:'plank',seed:60+i});
 /* fogata con troncos y bancos */const f=V(.75,2.2,3);glow(c,f[0],f[1],14,'rgba(255,170,60,.55)');c.fillStyle='#4a3020';c.fillRect(f[0]-5,f[1]-1,10,2);c.fillStyle='#ff9a30';c.beginPath();c.moveTo(f[0]-3,f[1]);c.lineTo(f[0],f[1]-7);c.lineTo(f[0]+3,f[1]);c.fill();c.fillStyle='#ffe08a';c.beginPath();c.moveTo(f[0]-1.4,f[1]);c.lineTo(f[0],f[1]-4);c.lineTo(f[0]+1.4,f[1]);c.fill();
 vol(c,{x:.3,y:2.55,w:.9,h:.14,z:3,z0:2,col:'#6a4a2a',mat:'plank',seed:70});
 /* cajas de botín y bandera */for(let i=0;i<4;i++)crate(c,2.05+(i%2)*.42,2.05+(i>>1)*.42,2,.32,'#6a4a2a');sacks(c,2.65,1.6,2,2);flag(c,2.85,.15,30,'#c9a23a');
 /* lados de delante de la empalizada */for(let i=0;i<=12;i++)stake(.05+i*.24,2.95);for(let i=0;i<12;i++){if(i===5||i===6)continue;stake(2.95,.05+i*.24)}}};
NB.radiolr={up:90,paint(c){slab(c,2,2,'#7a7a74');
 vol(c,{x:.2,y:.9,w:1,h:.9,z:14,z0:2,col:'#8a9098',mat:'metal',seed:3,decR:(c,l)=>{dor(c,l/2-4,-10,8,10,{col:'#3a4048'})}});
 const b=V(1.4,.6,2),t=V(1.4,.6,88);line(c,[b[0]-8,b[1]],t,'#9aa2aa',2);line(c,[b[0]+8,b[1]],t,'#9aa2aa',2);for(let k=1;k<6;k++){const y=b[1]+(t[1]-b[1])*k/6,w=8*(1-k/6);line(c,[t[0]-w,y],[t[0]+w,y],'#9aa2aa',1.2)}
 c.fillStyle='#e04a3a';c.beginPath();c.arc(t[0],t[1],2.4,0,7);c.fill();glow(c,t[0],t[1],8,'rgba(255,80,60,.5)');const d=V(1.4,.6,62);c.fillStyle='#d4dadd';c.strokeStyle=OLC;c.beginPath();c.ellipse(d[0]+8,d[1],7,5,-.5,0,7);c.fill();c.stroke()}};
NB.fortif={up:90,paint(c){slab(c,3,3,'#7a7872');
 /* detrás/izquierda: grúa pórtico, bloques y vigas (se dibujan antes que la nave) */
 post(c,.15,.35,2,40,'#d9a43a');post(c,.15,2.55,2,40,'#d9a43a');line(c,V(.15,.35,42),V(.15,2.55,42),'#d9a43a',3.5);line(c,V(.15,1.4,42),V(.15,1.4,30),'#333',1);
 vol(c,{x:.05,y:1.05,w:.2,h:.7,z:3,z0:26,col:'#6a6e72',mat:'metal',seed:8});
 
 for(let i=0;i<3;i++)vol(c,{x:.32+i*.2,y:1.5,w:.12,h:.9,z:2.4,z0:2+i*.1,col:'#7a828a',mat:'metal',seed:30+i});
 /* nave de hormigón con portón y cartel */
 vol(c,{x:1.1,y:.3,w:1.75,h:2.1,z:24,z0:2,col:'#86847c',mat:'concrete',seed:3,
  decR:(c,l)=>{c.fillStyle='#2e2e2c';c.fillRect(l*.18,-18,l*.64,16);c.strokeStyle='#e0a124';c.lineWidth=2;for(let k=0;k<5;k++){c.beginPath();c.moveTo(l*.18+k*l*.16,-2);c.lineTo(l*.18+k*l*.16+5,-6);c.stroke()}sign(c,l*.25,-27,l*.5,6,'','#c9a23a')},
  decL:(c,l)=>{wnd(c,l*.2,-17,9,6,{lit:true});wnd(c,l*.6,-17,9,6,{lit:true})}});
 vol(c,{x:1.02,y:.22,w:1.91,h:2.26,z:3,z0:26,col:'#5f5d58',mat:'concrete',seed:5});
 /* delante-izquierda: bloques de hormigón apilados */for(let r=0;r<2;r++)for(let i=0;i<2-r;i++)vol(c,{x:.3+i*.38+r*.19,y:1.9,w:.34,h:.5,z:6,z0:2+r*6,col:'#a6a298',mat:'concrete',seed:20+i+r*3});
 /* delante: sacos terreros y bloques anti-tanque */for(let i=0;i<5;i++)sacks(c,1.15+i*.36,2.75,2,1);
 for(let i=0;i<2;i++){const q=V(.4+i*.4,2.75,2);c.fillStyle='#9a968c';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.moveTo(q[0]-6,q[1]);c.lineTo(q[0],q[1]-11);c.lineTo(q[0]+6,q[1]);c.lineTo(q[0],q[1]+3);c.closePath();c.fill();c.stroke()}}};
NB.curalab={up:90,paint(c){slab(c,3,3,'#8a948e');
 /* detrás: depósitos de cultivo con tuberías */
 for(let i=0;i<3;i++){const t=V(.35+i*.55,.3,2);cyl(c,t[0],t[1],5,22,['#cfe8e0','#bfe0d8','#cfe8e0'][i],{bands:2});const tp=V(.35+i*.55,.3,24);c.fillStyle=['#5ad08a','#6fd0ff','#f2c542'][i];c.beginPath();c.ellipse(tp[0],tp[1],4.2,2,0,0,7);c.fill();glow(c,tp[0],tp[1],7,'rgba(140,255,200,.35)')}
 line(c,V(.35,.3,16),V(1.45,.3,16),'#8a9a9a',2);line(c,V(1.45,.3,16),V(1.45,.8,16),'#8a9a9a',2);
 /* edificio blanco con franja verde y ventanas iluminadas */
 vol(c,{x:.3,y:.85,w:2.4,h:1.6,z:26,z0:2,col:'#e6eeea',mat:'plaster',seed:3,decL:(c,l)=>{for(let k=0;k<3;k++)wnd(c,l*(.1+k*.3),-18,9,9,{lit:true});c.fillStyle='#3aa07a';c.fillRect(0,-6,l,2.4)},decR:(c,l)=>{dor(c,l*.35,-15,12,15,{col:'#2a4a48'});c.fillStyle='#3aa07a';c.fillRect(0,-6,l,2.4);c.fillStyle='#f2c542';c.beginPath();c.arc(l*.82,-17,5,0,7);c.fill();c.fillStyle='#1a1a1a';c.font='bold 7px sans-serif';c.textAlign='center';c.fillText('☣',l*.82,-14.5)}});
 vol(c,{x:.22,y:.77,w:2.56,h:1.76,z:3,z0:28,col:'#9fd0c6',mat:'block',seed:5});
 /* cúpula de cristal del laboratorio */const p=V(1.5,1.65,31);c.fillStyle='rgba(150,240,220,.45)';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(p[0],p[1],20,10,0,Math.PI,0,false);c.ellipse(p[0],p[1],20,10,0,0,Math.PI,false);c.fill();c.stroke();c.beginPath();c.ellipse(p[0],p[1]-6,16,11,0,Math.PI,0,false);c.fill();c.stroke();
 c.strokeStyle='rgba(255,255,255,.6)';c.beginPath();c.moveTo(p[0]-8,p[1]-14);c.quadraticCurveTo(p[0]-12,p[1]-6,p[0]-10,p[1]);c.stroke();glow(c,p[0],p[1]-6,18,'rgba(120,255,190,.4)');
 /* antena y placas solares en el tejado */post(c,2.5,1,30,46,'#aab2b8');const an=V(2.5,1,47);c.fillStyle='#e04a3a';c.beginPath();c.arc(an[0],an[1],2,0,7);c.fill();
 for(let i=0;i<2;i++){const s0=V(.5+i*.5,2.15,31),s1=V(.9+i*.5,2.15,31),s2=V(.9+i*.5,2.35,33),s3=V(.5+i*.5,2.35,33);c.fillStyle='#2a4a7a';c.strokeStyle=OLC;c.beginPath();c.moveTo(s0[0],s0[1]);c.lineTo(s1[0],s1[1]);c.lineTo(s2[0],s2[1]);c.lineTo(s3[0],s3[1]);c.closePath();c.fill();c.stroke()}
 /* delante: cajas de muestras refrigeradas */for(let i=0;i<3;i++)crate(c,.6+i*.55,2.75,2,.28,'#d8e8f0')}};
NB.monum={up:90,paint(c){slab(c,2,2,'#a8a296');
 vol(c,{x:.3,y:.3,w:1.4,h:1.4,z:8,z0:2,col:'#b8b2a4',mat:'block',seed:3});vol(c,{x:.7,y:.7,w:.6,h:.6,z:52,z0:10,col:'#cfc9ba',mat:'block',seed:4});
 const t=V(1,1,64);c.fillStyle='#e8e2cc';c.strokeStyle=OLC;c.beginPath();c.moveTo(t[0]-6,t[1]+4);c.lineTo(t[0],t[1]-6);c.lineTo(t[0]+6,t[1]+4);c.closePath();c.fill();c.stroke();
 for(let i=0;i<4;i++){const q=V(.2+i*.5,1.85,3);c.fillStyle='#f2c542';c.beginPath();c.arc(q[0],q[1],1.6,0,7);c.fill();glow(c,q[0],q[1],6,'rgba(255,200,90,.5)')}}};
NB.plaza={up:90,paint(c){slab(c,4,4,'#c9b58a');
 /* pavimento con anillo */for(let i=0;i<4;i++)for(let j=0;j<4;j++){const a=V(i,j,2.2),b=V(i+1,j,2.2),d=V(i+1,j+1,2.2),e=V(i,j+1,2.2);c.fillStyle=(i+j)%2?'rgba(255,240,210,.2)':'rgba(120,90,50,.18)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.fill()}
 const ce=V(2,2,2.3);c.strokeStyle='rgba(140,100,60,.6)';c.lineWidth=3;c.beginPath();c.ellipse(ce[0],ce[1],52,26,0,0,7);c.stroke();
 const tree=(x,y,r)=>{post(c,x,y,2,14,'#6a4a2a');const q=V(x,y,20);c.fillStyle='#3f7a35';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.arc(q[0],q[1],r,0,7);c.fill();c.stroke();c.fillStyle='#58a047';c.beginPath();c.arc(q[0]-r*.3,q[1]-r*.3,r*.5,0,7);c.fill()};
 const lamp=(x,y)=>{post(c,x,y,2,28,'#2a2a2a');const q=V(x,y,30);c.fillStyle='#ffe08a';c.beginPath();c.arc(q[0],q[1],2.8,0,7);c.fill();glow(c,q[0],q[1],10,'rgba(255,220,120,.5)')};
 const bench=(x,y)=>{vol(c,{x,y,w:.5,h:.14,z:3,z0:3,col:'#8a5a32',mat:'plank',seed:40})};
 /* puestos de mercado con toldos de colores (atrás) */const stall=(x,y,col)=>{for(const [dx,dy] of [[0,0],[.7,0],[0,.6],[.7,.6]])post(c,x+dx,y+dy,2,16,'#5a4030');vol(c,{x,y:y+.05,w:.7,h:.5,z:6,z0:2,col:'#8a6a42',mat:'plank',seed:80});
  const r=[V(x-.05,y-.05,18),V(x+.75,y-.05,18),V(x+.75,y+.65,14),V(x-.05,y+.65,14)];c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1.1;c.beginPath();c.moveTo(r[0][0],r[0][1]);r.forEach(q=>c.lineTo(q[0],q[1]));c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.55)';for(let k=0;k<3;k++){const a=V(x+.05+k*.25,y-.05,18),b=V(x+.05+k*.25,y+.65,14);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[0]+5,a[1]+2.5);c.lineTo(b[0]+5,b[1]+2.5);c.lineTo(b[0],b[1]);c.fill()}
  for(let k=0;k<3;k++){const q=V(x+.15+k*.2,y+.3,8.5);c.fillStyle=['#e04a3a','#f2c542','#5ad08a'][k];c.beginPath();c.arc(q[0],q[1],1.8,0,7);c.fill()}};
 stall(.25,.25,'#c23a2e');stall(1.65,.2,'#3a6ab8');tree(3.5,.5,9);tree(.45,1.7,8);lamp(1.25,.35);
 /* fuente con estatua del superviviente */vol(c,{x:1.3,y:1.3,w:1.4,h:1.4,z:6,z0:2,col:'#a8a296',mat:'block',seed:3});const f=V(2,2,9);c.fillStyle='#6fb6d8';c.beginPath();c.ellipse(f[0],f[1],19,9.5,0,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;c.beginPath();c.ellipse(f[0],f[1],12,6,0,0,7);c.stroke();
 vol(c,{x:1.8,y:1.8,w:.4,h:.4,z:14,z0:8,col:'#cfc9ba',mat:'block',seed:4});const st=V(2,2,24);c.fillStyle='#8a9096';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(st[0],st[1]-7,4.5,9,0,0,7);c.fill();c.stroke();c.beginPath();c.arc(st[0],st[1]-18,3.6,0,7);c.fill();c.stroke();line(c,[st[0]+3,st[1]-12],[st[0]+10,st[1]-22],'#8a9096',2.6);
 const fl=[st[0]+10,st[1]-22];line(c,fl,[fl[0],fl[1]-10],'#5a4a3a',1.4);c.fillStyle='#c9a23a';c.beginPath();c.moveTo(fl[0],fl[1]-10);c.lineTo(fl[0]+9,fl[1]-7);c.lineTo(fl[0],fl[1]-4);c.closePath();c.fill();c.stroke();
 for(let k=0;k<6;k++){const a=k/6*6.28,q=[f[0]+Math.cos(a)*15,f[1]+Math.sin(a)*7.5];c.fillStyle='rgba(220,245,255,.8)';c.beginPath();c.arc(q[0],q[1]-2,1.2,0,7);c.fill()}glow(c,f[0],f[1]-4,16,'rgba(160,220,255,.45)');
 /* delante: bancos, farolas, árboles y parterres */bench(.6,3.3);bench(1.5,3.35);bench(3.3,1.5);bench(3.35,2.4);
 const bed=(x,y)=>{vol(c,{x,y,w:.7,h:.7,z:3,z0:2,col:'#7a6a52',mat:'block',seed:50});for(let k=0;k<6;k++){const q=V(x+.15+(k%3)*.2,y+.2+(k>>1)*.15,6);c.fillStyle=['#e04a6a','#f2c542','#ffffff','#b36cff','#e04a6a','#ff8a3a'][k];c.beginPath();c.arc(q[0],q[1],1.9,0,7);c.fill()}};
 bed(3.15,3.15);lamp(2.4,3.7);lamp(3.7,2.4);lamp(.3,3.7);tree(3.6,3.65,7);tree(.5,3.0,7);tree(2.9,3.8,6)}};
NB.perrera={up:90,paint(c){slab(c,2,2,'#8a7a5a');
 /* valla de malla al fondo */for(let i=0;i<=4;i++)post(c,.1+i*.45,.1,2,12,'#5a5a5a');line(c,V(.1,.1,12),V(1.9,.1,12),'#7a7a7a',1.2);line(c,V(.1,.1,6),V(1.9,.1,6),'#7a7a7a',1);
 /* caseta de madera con tejado a dos aguas */gableY(c,{x:.2,y:.4,w:1,h:.9,z:12,rh:8,col:'#7a3a2a',wallCol:'#a8784a',mat:'plank',seed:5,oh:.12,rows:4});
 const dd=V(.7,1.3,5);c.fillStyle='#1a120c';c.beginPath();c.ellipse(dd[0],dd[1],4,5,0,Math.PI,0,false);c.lineTo(dd[0]+4,dd[1]+3);c.lineTo(dd[0]-4,dd[1]+3);c.fill();
 /* perros */const dog=(x,y,col,f)=>{const q=V(x,y,3);c.save();c.translate(q[0],q[1]);c.scale(f,1);c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1;c.beginPath();c.ellipse(0,-4,6,3.2,0,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(6,-7,3,2.6,0,0,7);c.fill();c.stroke();c.fillRect(-5,-2,1.6,4);c.fillRect(-1,-2,1.6,4);c.fillRect(3,-2,1.6,4);c.beginPath();c.moveTo(5,-9);c.lineTo(6,-12);c.lineTo(7.5,-9);c.fill();c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.moveTo(-6,-5);c.lineTo(-9,-8);c.stroke();c.fillStyle='#c23a2e';c.fillRect(4,-6,3,1.2);c.restore()};
 dog(1.45,.9,'#3a2a1e',-1);dog(1.5,1.6,'#a8784a',1);dog(.7,1.75,'#4a4a4a',1);
 /* cuencos y hueso */const b=V(1.6,.5,3);c.fillStyle='#4a6ab8';c.beginPath();c.ellipse(b[0],b[1],3.6,1.8,0,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}};
NB.polvorin={up:90,paint(c){slab(c,2,2,'#7a7462');
 /* búnker semienterrado de hormigón con tierra encima */vol(c,{x:.15,y:.2,w:1.7,h:1.6,z:14,z0:2,col:'#8a8678',mat:'concrete',seed:3,decR:(c,l)=>{c.fillStyle='#3a3a36';c.fillRect(l*.3,-12,l*.4,10);c.fillStyle='#f2c542';c.beginPath();c.moveTo(l*.5,-26);c.lineTo(l*.5+6,-16);c.lineTo(l*.5-6,-16);c.closePath();c.fill();c.fillStyle='#1a1a1a';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText('!',l*.5,-17.5)},decL:(c,l)=>{for(let k=0;k<3;k++){c.fillStyle='#e0a124';c.fillRect(l*(.1+k*.3),-4,l*.15,2)}}});
 const t=V(1,1,16);c.fillStyle='#6a7a3a';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(t[0],t[1],30,14,0,Math.PI,0,false);c.closePath();c.fill();c.stroke();c.fillStyle='#7f8f4a';for(let k=0;k<6;k++){c.beginPath();c.arc(t[0]-20+k*8,t[1]-4-Math.sin(k)*3,2,0,7);c.fill()}
 post(c,1.75,.25,16,30,'#5a4a3a');const fl=V(1.75,.25,30);c.fillStyle='#c23a2e';c.beginPath();c.moveTo(fl[0],fl[1]);c.lineTo(fl[0]+10,fl[1]+3);c.lineTo(fl[0],fl[1]+6);c.fill();
 /* cajas de munición delante */for(let i=0;i<3;i++)crate(c,.15+i*.4,1.85,2,.3,'#4a5a30');sacks(c,1.55,1.85,2,1)}};
NB.drones={up:90,paint(c){slab(c,2,2,'#6a6e72');
 vol(c,{x:.2,y:.35,w:1.6,h:1.45,z:18,z0:2,col:'#5a6a7a',mat:'metal',seed:3,decR:(c,l)=>{c.fillStyle='#2a3038';c.fillRect(l*.2,-14,l*.6,12);c.strokeStyle='#4a5560';for(let k=0;k<4;k++){c.beginPath();c.moveTo(l*.2,-14+k*3);c.lineTo(l*.8,-14+k*3);c.stroke()}},decL:(c,l)=>{wnd(c,l*.3,-13,10,6,{lit:true})}});
 vol(c,{x:.12,y:.27,w:1.76,h:1.61,z:2,z0:20,col:'#3a4a5a',mat:'metal',seed:5});
 /* plataforma de despegue con H */const h=V(1,1.05,22.5);c.fillStyle='#2a2a2a';c.beginPath();c.ellipse(h[0],h[1],15,7.5,0,0,7);c.fill();c.strokeStyle='#f2c542';c.lineWidth=1.4;c.beginPath();c.ellipse(h[0],h[1],13,6.5,0,0,7);c.stroke();c.fillStyle='#f2c542';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText('H',h[0],h[1]+3);
 /* dron en vuelo */const dr=V(1,1,52);c.strokeStyle=OLC;c.lineWidth=1;c.fillStyle='#2a3038';c.fillRect(dr[0]-4,dr[1]-2,8,4);c.strokeRect(dr[0]-4,dr[1]-2,8,4);[[-9,-3],[9,-3],[-7,3],[7,3]].forEach(([dx,dy])=>{line(c,[dr[0],dr[1]],[dr[0]+dx,dr[1]+dy],'#3a4048',1.4);c.fillStyle='rgba(200,220,240,.45)';c.beginPath();c.ellipse(dr[0]+dx,dr[1]+dy,4.5,1.6,0,0,7);c.fill()});c.fillStyle='#e04a3a';c.beginPath();c.arc(dr[0],dr[1]+3,1.4,0,7);c.fill();glow(c,dr[0],dr[1]+4,7,'rgba(255,80,60,.45)');
 const sh=V(1,1,2.5);c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(sh[0],sh[1]+18,9,4,0,0,7);c.fill();
 post(c,1.75,.3,20,40,'#aab2b8');const an=V(1.75,.3,41);c.fillStyle='#d4dadd';c.beginPath();c.ellipse(an[0]+4,an[1],5,3.5,-.5,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}};
NB.hidro={up:90,paint(c){slab(c,3,2,'#7a8a6a');
 /* invernadero de cristal con estructura metálica */vol(c,{x:.15,y:.2,w:2.7,h:1.6,z:16,z0:2,col:'#a8d8b0',mat:'plaster',seed:3,decL:(c,l)=>{c.fillStyle='rgba(180,240,200,.55)';c.fillRect(0,-16,l,14);c.strokeStyle='#5a6a6a';c.lineWidth=1;for(let k=1;k<6;k++){c.beginPath();c.moveTo(l*k/6,-16);c.lineTo(l*k/6,-2);c.stroke()}for(let k=0;k<4;k++){const y=-13+k*3.5;c.fillStyle=['#3f8a35','#58a047','#e04a3a','#58a047'][k];for(let q=0;q<9;q++){c.beginPath();c.arc(l*(.06+q*.11),y,1.5,0,7);c.fill()}}},decR:(c,l)=>{c.fillStyle='rgba(180,240,200,.55)';c.fillRect(0,-16,l,14);c.strokeStyle='#5a6a6a';for(let k=1;k<3;k++){c.beginPath();c.moveTo(l*k/3,-16);c.lineTo(l*k/3,-2);c.stroke()}dor(c,l*.38,-12,9,11,{col:'#5a7a6a'})}});
 const r=[V(.1,.15,18),V(2.9,.15,18),V(2.9,1.85,18),V(.1,1.85,18)],top=[V(.1,1,27),V(2.9,1,27)];c.strokeStyle='#5a6a6a';c.lineWidth=1.2;c.fillStyle='rgba(200,250,220,.5)';c.beginPath();c.moveTo(r[0][0],r[0][1]);c.lineTo(r[1][0],r[1][1]);c.lineTo(top[1][0],top[1][1]);c.lineTo(top[0][0],top[0][1]);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(170,235,200,.6)';c.beginPath();c.moveTo(r[3][0],r[3][1]);c.lineTo(r[2][0],r[2][1]);c.lineTo(top[1][0],top[1][1]);c.lineTo(top[0][0],top[0][1]);c.closePath();c.fill();c.stroke();
 for(let k=1;k<6;k++){const a=V(.1+k*.47,1.85,18),b=V(.1+k*.47,1,27);line(c,a,b,'#5a6a6a',1)}
 /* depósitos de agua y bomba */for(let i=0;i<2;i++){const t=V(.35+i*.5,1.95,2);cyl(c,t[0],t[1],4,10,'#4a8ab8',{bands:1})}glow(c,V(1.5,1,20)[0],V(1.5,1,20)[1],22,'rgba(200,120,255,.25)')}};
NB.nuclear={up:90,paint(c){slab(c,3,3,'#8a8a84');
 /* torre de refrigeración */const t=V(.9,.9,2);const tw=(cx,cy,w0,w1,h)=>{c.fillStyle='#c8ccce';c.strokeStyle=OLC;c.lineWidth=1.4;c.beginPath();c.moveTo(cx-w0,cy);c.quadraticCurveTo(cx-w1*.75,cy-h*.6,cx-w1,cy-h);c.lineTo(cx+w1,cy-h);c.quadraticCurveTo(cx+w1*.75,cy-h*.6,cx+w0,cy);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(0,0,0,.12)';c.beginPath();c.moveTo(cx,cy);c.quadraticCurveTo(cx+w1*.4,cy-h*.6,cx+w1*.2,cy-h);c.lineTo(cx+w1,cy-h);c.quadraticCurveTo(cx+w1*.75,cy-h*.6,cx+w0,cy);c.closePath();c.fill();c.fillStyle='#9aa0a4';c.beginPath();c.ellipse(cx,cy-h,w1,w1*.35,0,0,7);c.fill();c.stroke();c.fillStyle='#3a3a3a';c.beginPath();c.ellipse(cx,cy-h,w1*.8,w1*.27,0,0,7);c.fill();for(let k=0;k<4;k++){c.fillStyle='rgba(235,240,245,'+(.55-k*.1)+')';c.beginPath();c.arc(cx-4+k*5,cy-h-8-k*9,8+k*3,0,7);c.fill()}c.fillStyle='#c23a2e';c.fillRect(cx-w0*.9,cy-h*.25,w0*1.8,3)};
 tw(t[0],t[1],26,17,62);
 /* reactor: cúpula y edificio de turbinas */vol(c,{x:1.6,y:1.4,w:1.3,h:1.5,z:18,z0:2,col:'#9aa0a4',mat:'concrete',seed:3,decR:(c,l)=>{dor(c,l*.3,-14,10,13,{col:'#3a4048'})},decL:(c,l)=>{wnd(c,l*.3,-13,10,5,{lit:true})}});
 const d=V(2.25,2.15,20);c.fillStyle='#d4d8da';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(d[0],d[1],18,9,0,Math.PI,0,false);c.closePath();c.fill();c.stroke();c.beginPath();c.ellipse(d[0],d[1]-4,15,11,0,Math.PI,0,false);c.fill();c.stroke();
 const sg=V(2.25,2.15,32);c.fillStyle='#f2c542';c.beginPath();c.arc(sg[0],sg[1],5,0,7);c.fill();c.strokeStyle='#1a1a1a';c.stroke();c.fillStyle='#1a1a1a';for(let k=0;k<3;k++){const a=k*2.094-1.57;c.beginPath();c.moveTo(sg[0],sg[1]);c.arc(sg[0],sg[1],4.2,a-.45,a+.45);c.closePath();c.fill()}
 /* tendido eléctrico */post(c,2.75,.3,2,34,'#6a6a6a');line(c,V(2.55,.3,32),V(2.95,.3,32),'#6a6a6a',2);glow(c,V(2.75,.3,33)[0],V(2.75,.3,33)[1],8,'rgba(120,200,255,.5)')}};
/* ---------- efectos ---------- */
window.towerMul=()=>{const L=lv('drones');return L?1.15+.03*(L-1):1};
window.fortMul=()=>{const L=lv('fortif');return L?1.3+.05*(L-1):1};
const oMk=window.mkZ;if(typeof oMk==='function'){window.mkZ=function(){const z=oMk.apply(this,arguments);try{const L=lv('curalab');if(L&&z&&z.act){const k=Math.max(.6,1-(.15+.01*(L-1)));z.hp*=k;z.mhp*=k}}catch(e){}return z};try{mkZ=window.mkZ}catch(e){}}
const oOut=window.out;if(typeof oOut==='function'){window.out=function(b){const o=oOut.apply(this,arguments);try{let m=1;if(has('polvorin')&&(b.type==='ammof'||b.type==='work')&&o&&o.ammo>0)o.ammo*=1.25;if(has('monum'))m+=Math.min(.25,Math.floor(S.ppl.length/5)*.01);if(has('plaza'))m+=.1;if(m>1&&o&&BT[b.type]&&BT[b.type].p)for(const k in o)if(k!=='elec'&&o[k]>0)o[k]*=m}catch(e){}return o};try{out=window.out}catch(e){}}
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
/* perros: cada segundo muerden a los infectados colados en el pueblo */
let dogT=0;const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{const L=lv('perrera');if(L&&typeof Z!=='undefined'&&Z.length){dogT+=dt;if(dogT>=1){dogT=0;const n=1+Math.floor(L/3),d=8+3*L;const tg=Z.filter(z=>z.act&&z.hp>0&&z.x>=0&&z.y>=0&&z.x<N&&z.y<N&&nearTown(z.x,z.y)&&!(BT.wall&&0)).slice(0,n);tg.forEach(z=>{z.hp-=d;try{burst(z.x,z.y,4,'#b22',1.2,6);sfxAt('punch',z.x,z.y)}catch(e){}})}}}catch(e){}return r};try{upd=window.upd}catch(e){}
})();
