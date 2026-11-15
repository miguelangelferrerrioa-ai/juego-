/* ===== Dead Town · ampliación: más recursos, edificios y niveles de ayuntamiento (hasta 15) ===== */
(function(){
/* ---- recursos nuevos ---- */
[['chem','Químicos','#9b6fd1'],['comp','Componentes','#5fc4c4'],['scrap','Chatarra','#a39b86']].forEach(([k,n,col])=>{
 if(RK.some(r=>r[0]===k))return;RK.push([k,n,col]);RN[k]=n.toLowerCase();IV[k]=k==='chem'?240:300;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.fillStyle=col;x.strokeStyle='#111';x.lineWidth=1.5;
 if(k==='chem'){x.beginPath();x.moveTo(7,2);x.lineTo(13,2);x.lineTo(13,8);x.lineTo(17,17);x.lineTo(3,17);x.lineTo(7,8);x.closePath();x.fill();x.stroke()}
 else if(k==='scrap'){x.beginPath();x.arc(10,10,6.5,0,7);x.fill();x.stroke();x.fillStyle='#2a2a26';x.beginPath();x.arc(10,10,2.4,0,7);x.fill();x.fillStyle=col;for(let i=0;i<6;i++){const a=i*Math.PI/3;x.fillRect(10+Math.cos(a)*7.5-1.5,10+Math.sin(a)*7.5-1.5,3,3);x.strokeRect(10+Math.cos(a)*7.5-1.5,10+Math.sin(a)*7.5-1.5,3,3)}}
 else{x.fillRect(4,4,12,12);x.strokeRect(4,4,12,12);x.fillStyle='#123';x.fillRect(8,8,4,4);x.fillStyle=col;for(let i=0;i<3;i++){x.fillRect(1,6+i*4,3,2);x.fillRect(16,6+i*4,3,2)}}
 ICO[k]=c.toDataURL()});
/* ---- coste del ayuntamiento hasta nivel 15 ---- */
window.hallCost=L=>{const c=L<4?{wood:120+60*L,metal:90+60*L}:{wood:Math.round(200+100*L),metal:Math.round(150+100*L)};if(L>=4)c.comp=10*(L-3);if(L>=7)c.chem=8*(L-6);return c};
/* ---- edificios nuevos ---- */
const B={
silo:{n:'Silo',w:2,h:2,z:60,c:'#b8b09a',cost:{wood:140,metal:60},lv:3,hp:350,cap:1,f:'Almacena mucho más. Cada nivel añade +200 de capacidad a todos los recursos.'},
scrapy:{n:'Desguace',w:3,h:3,z:30,c:'#7d7f80',cost:{wood:100},lv:1,hp:300,p:{metal:15,comp:2},job:['Constructor','Recolector'],slots:3,f:'Desmonta coches y chatarra: produce metal y algunos componentes electrónicos.'},
saw:{n:'Aserradero',w:3,h:3,z:40,c:'#a8743a',cost:{wood:80,metal:20},lv:1,hp:300,p:{wood:90},job:['Constructor','Recolector'],slots:4,f:'Produce madera de forma constante.'},
kitchen:{n:'Cocina comunal',w:3,h:2,z:36,c:'#b5623f',cost:{wood:150,metal:40},lv:4,hp:280,p:{food:14},job:['Cocinero'],slots:2,f:'Convierte provisiones en raciones: comida estable.'},
cistern:{n:'Cisterna',w:2,h:2,z:56,c:'#6f93b5',cost:{wood:130,metal:70},lv:5,hp:300,p:{water:16},job:['Mecánico'],slots:1,f:'Recoge y filtra agua de lluvia.'},
greenh:{n:'Invernadero',w:4,h:3,z:36,c:'#7fb8a4',cost:{wood:220,metal:90},lv:6,hp:260,p:{food:28},job:['Agricultor','Científico'],slots:3,f:'Cultiva comida protegida de la ceniza.'},
solar:{n:'Granja solar',w:3,h:3,z:30,c:'#4a6a86',cost:{wood:80,metal:140,comp:10},lv:6,hp:260,p:{elec:26},job:['Mecánico'],slots:1,f:'Electricidad sin combustible.'},
smithy:{n:'Fundición',w:3,h:3,z:52,c:'#8a5a3c',cost:{wood:200,metal:180},lv:7,hp:450,p:{metal:22},job:['Mecánico','Constructor'],slots:3,f:'Refunde chatarra en metal.'},
pharm:{n:'Farmacia',w:2,h:2,z:34,c:'#d8d6cc',cost:{wood:160,metal:80,comp:6},lv:7,hp:280,p:{meds:4},job:['Médico','Científico'],slots:2,f:'Sintetiza medicinas.'},
chem:{n:'Planta química',w:3,h:3,z:60,c:'#8b78b3',cost:{wood:220,metal:200,comp:14},lv:8,hp:380,p:{chem:8},pw:1,job:['Científico'],slots:2,f:'Produce químicos para mejoras avanzadas.'},
ammof:{n:'Fábrica de munición',w:3,h:3,z:36,c:'#6a7050',cost:{wood:200,metal:220,comp:12},lv:8,hp:420,p:{ammo:12},pw:1,job:['Soldado','Mecánico'],slots:2,f:'Fabricación masiva de munición.'},
elab:{n:'Taller de electrónica',w:3,h:2,z:46,c:'#5a7a8c',cost:{wood:200,metal:240,chem:10},lv:9,hp:300,p:{comp:7},pw:1,job:['Científico','Mecánico'],slots:2,f:'Recupera y fabrica componentes electrónicos.'},
wind:{n:'Turbina eólica',w:2,h:2,z:90,c:'#d8d8d0',cost:{wood:100,metal:200,comp:14},lv:9,hp:200,p:{elec:34},job:['Mecánico'],slots:1,f:'Energía limpia, siempre que haya viento.'},
market:{n:'Mercado de trueque',w:4,h:3,z:36,c:'#c9a24a',cost:{wood:260,metal:100,comp:10},lv:10,hp:300,p:{food:12,water:12,comp:3},job:['Recolector','Explorador'],slots:3,f:'Los supervivientes comercian: recursos variados.'},
refin:{n:'Refinería',w:4,h:4,z:80,c:'#7a8a8c',cost:{wood:300,metal:300,comp:18,chem:14},lv:11,hp:550,p:{chem:10},pw:1,job:['Mecánico','Científico'],slots:3,f:'Refina químicos de forma estable.'},
radio:{n:'Estación de radio',w:2,h:2,z:84,c:'#7a8a72',cost:{wood:160,metal:120,comp:6},lv:4,hp:220,job:['Científico','Mecánico'],slots:2,f:'Emite una señal de auxilio: atrae nuevos supervivientes. Más nivel y operarios, llegan antes.'},
bunker:{n:'Búnker',w:3,h:3,z:26,c:'#7d7a72',cost:{wood:220,metal:360,comp:16,chem:12},lv:12,hp:1000,bk:1,f:'Alberga +8 supervivientes por nivel y resiste ataques.'}};
Object.assign(BT,B);
/* ---- efectos ---- */
const oPc=window.pcap;
/* pcap y cap son const: se parchean en game.js (ver cap/pcap) */
const oOut=window.out;
window.out=function(b,pow){const o=oOut(b,pow),m=1+.03*Math.max(0,realHall()-5);if(m>1)for(const k in o)if(k!=='food'&&k!=='water')o[k]*=m;return o};
/* ---- arte ---- */
const K=NBK,{faceTf,V,mix,RGB,Q,rnd,pl,lg,line,vol,wnd,dor,sign,plateX,patch,gableX,gableY,flatRoof,hip,cyl,crate,sacks,wire,post,chimney,solar,ac,tank,OLC}=K;
const palc=(t,b)=>{const a=window.PAL&&PAL[t];return a?a[Math.min(b.cl||0,a.length-1)][1]:BT[t].c};
const row=(c,len,y,x0,step,n,o,sd)=>{o=o||{};for(let i=0;i<n;i++){const bad=rnd(i,sd,7)<(o.bad===undefined?.2:o.bad);wnd(c,x0+i*step,y,o.w||10,o.h||8,{t:bad?(rnd(i,sd,8)<.5?'board':'broken'):'glass',lit:!bad&&rnd(i,sd,9)<(o.lit===undefined?.3:o.lit),frame:o.frame})}};
const drum=(c,x,y,col)=>{const p=V(x,y,0);cyl(c,p[0],p[1],5.2,10,col,{bands:2})};
const slab=(c,w,h,col)=>vol(c,{x:-.08,y:-.08,w:w+.16,h:h+.16,z:2,col:col||'#85817a',mat:'block',seed:2});
const sm=(c,p)=>{if(typeof smoke==='function')smoke(c,p)};
NB.silo={up:100,paint(c,b){const lv=b.lvl;slab(c,2,2);{const p=V(1,1,2);cyl(c,p[0],p[1],19,46,palc('silo',b),{bands:4});c.strokeStyle=OLC;c.lineWidth=1.4;const q=V(1,1,48);c.beginPath();c.ellipse(q[0],q[1],19,8,0,0,7);c.fillStyle='#8a8268';c.fill();c.stroke();const r=V(1,1,52);cyl(c,r[0],r[1],6,6,'#6a6454',{})}
 vol(c,{x:1.55,y:1.6,w:.45,h:.4,z:14,z0:2,col:'#8a6a3a',mat:'plank',seed:3});sacks(c,.1,2.1,3);if(lv>=3){const p=V(.4,.4,2);cyl(c,p[0],p[1],8,30,'#a8a08a',{bands:3})}}};
NB.saw={up:70,paint(c,b){const cl=b.cl||0;slab(c,3,3,'#8f7a58');
 for(const u of[.1,2.75])for(const v of[.1,2.75])vol(c,{x:u,y:v,w:.15,h:.15,z:20,z0:2,col:'#7a5a3c',mat:'plank',seed:u*3+v});
 gableX(c,{x:0,y:0,w:3,h:3,z:22,rh:9,col:'#6a4a32',wallCol:'#8a6a4a',mat:'plank',seed:cl+2,oh:.2,rows:6});
 for(let i=0;i<4;i++)vol(c,{x:.2+i*.3,y:2.2,w:.28,h:.7,z:7+(i%2)*4,z0:2,col:i%2?'#a9824f':'#9a7444',mat:'plank',seed:i});
 {const p=V(1.7,1.2,3);c.fillStyle='#7a8286';c.beginPath();c.ellipse(p[0],p[1]-8,11,6,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.4;c.stroke();c.strokeStyle='#cfd5d8';c.beginPath();c.ellipse(p[0],p[1]-8,8,4,0,0,7);c.stroke()}
 sacks(c,2.4,3.1,3)},live(c,b,H){const p=H.L(1.7,1.2,10);if(Math.sin(T*14)>0){c.fillStyle='#ffe9a0';c.fillRect(p[0]+Math.sin(T*9)*6,p[1]-2,2,2)}}};
NB.scrapy={up:70,paint(c,b){const cl=b.cl||0;slab(c,3,3,'#6f6a60');
 /* valla de chapa alrededor del patio */
 for(const[u,v,w,h]of[[0,0,3,.08],[0,0,.08,3],[2.92,0,.08,3],[0,2.92,1.1,.08],[1.9,2.92,1.1,.08]])vol(c,{x:u,y:v,w,h,z:9,z0:1,col:'#7c8489',mat:'metal',seed:u+v*3});
 /* caseta del encargado */
 vol(c,{x:.15,y:.15,w:1.2,h:1,z:17,z0:1,col:'#8a7a5c',mat:'metal',seed:cl+4,decL:(c,len,H)=>{dor(c,8,-12,10,12,{col:'#4a3a28'})},decR:(c,len,H)=>{wnd(c,10,-12,8,6,{lit:true})}});
 flatRoof(c,{x:.1,y:.1,w:1.3,h:1.1,z:17,col:'#5c6468'});
 /* montones de chatarra */
 const heap=(u,v,r,col,sd)=>{const p=V(u,v,1),R=r*1.05;let rs=sd*9301;const rnd=()=>((rs=(rs*9301+49297)%233280)/233280);
  const g=c.createLinearGradient(0,p[1]-r,0,p[1]);g.addColorStop(0,'#8a8f92');g.addColorStop(1,col);c.fillStyle=g;c.strokeStyle=OLC;c.lineWidth=1.3;c.beginPath();c.moveTo(p[0]-R,p[1]);
  for(let i=1;i<12;i++){const a=Math.PI*(i/12),k=.8+.3*rnd();c.lineTo(p[0]-Math.cos(a)*R*k,p[1]-Math.sin(a)*r*k)}c.lineTo(p[0]+R,p[1]);c.quadraticCurveTo(p[0],p[1]+r*.35,p[0]-R,p[1]);c.fill();c.stroke();
  const P2=['#9a5a34','#7d8a92','#b0b4b0','#6a3d2a','#c9a24a','#4f6a7a'];
  for(let i=0;i<9;i++){const a=Math.PI*(.15+.7*rnd()),d=.25+.6*rnd(),x=p[0]-Math.cos(a)*R*d,y=p[1]-Math.sin(a)*r*d*.95;c.save();c.translate(x,y);c.rotate(rnd()*3-1.5);
   if(i%4===0){c.fillStyle='#1e2022';c.beginPath();c.ellipse(0,0,4.5,3,0,0,7);c.fill();c.strokeStyle='#55595b';c.lineWidth=1;c.beginPath();c.ellipse(0,0,2,1.3,0,0,7);c.stroke()}
   else{c.fillStyle=P2[(i+sd)%P2.length];c.fillRect(-4,-1.6,8,3.2);c.strokeStyle=OLC;c.lineWidth=.8;c.strokeRect(-4,-1.6,8,3.2)}c.restore()}
  c.strokeStyle='#c8cdd0';c.lineWidth=1.1;for(let i=0;i<3;i++){const x=p[0]-R*.5+i*R*.45,y=p[1]-r*(.5+.3*rnd());c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y-6);c.stroke()}};
 heap(2.15,1.25,34,'#55595c',1);heap(1.7,2.35,26,'#5e574c',2);
 /* coche desguazado */
 vol(c,{x:.3,y:1.6,w:.95,h:.5,z:6,z0:2,col:'#8a3b2e',mat:'metal',seed:9});vol(c,{x:.52,y:1.64,w:.48,h:.42,z:11,z0:6,col:'#6f8d9a',mat:'glass',seed:10});vol(c,{x:.56,y:1.66,w:.4,h:.38,z:12,z0:11,col:'#7a3428',mat:'metal',seed:11});
 for(const[u,v]of[[.4,2.08],[1.05,2.08]]){const p=V(u,v,1);c.fillStyle='#1d1f20';c.beginPath();c.ellipse(p[0],p[1],3,2,0,0,7);c.fill()}
 /* grúa con imán */
 {vol(c,{x:2.55,y:.25,w:.18,h:.18,z:46,z0:1,col:'#d4a23a',mat:'metal',seed:5});const a=V(2.64,.34,46),e=V(2.1,1.15,46);c.strokeStyle='#d4a23a';c.lineWidth=3;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.stroke();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();
  c.strokeStyle='#333';c.lineWidth=1;c.beginPath();c.moveTo(e[0],e[1]);c.lineTo(e[0],e[1]+16);c.stroke();c.fillStyle='#4a4f52';c.beginPath();c.ellipse(e[0],e[1]+18,5,2.6,0,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}
 drum(c,.2,2.55,'#5a7a8a');drum(c,.45,2.6,'#8a5a3a')},
live(c,b,H){const p=H.L(1.75,2.35,14);if(Math.sin(T*11+(b.id||0))>.2){c.fillStyle='#fff3b0';for(let i=0;i<3;i++)c.fillRect(p[0]+Math.sin(T*23+i*2)*7,p[1]-Math.abs(Math.cos(T*17+i))*6,1.6,1.6)}}};
NB.kitchen={up:70,paint(c,b){const cl=b.cl||0,wall=palc('kitchen',b);slab(c,3,2);
 vol(c,{x:0,y:0,w:3,h:2,z:18,z0:2,col:wall,mat:'brick',seed:cl+5,decL:(c,len,H)=>{row(c,len,-12,10,20,3,{w:10,h:7,lit:.6},cl);c.fillStyle='#f0d890';c.fillRect(6,-18,len-12,3);c.strokeStyle=OLC;c.strokeRect(6,-18,len-12,3)},decR:(c,len,H)=>{dor(c,10,-13.5,12,13.5,{col:'#5b4228'});wnd(c,34,-12,8,6,{lit:true})}});
 gableX(c,{x:0,y:0,w:3,h:2,z:20,rh:6,col:'#6a5a4a',wallCol:wall,mat:'brick',seed:cl+6,oh:.14,rows:6});
 vol(c,{x:2.2,y:.3,w:.4,h:.4,z:44,z0:20,col:'#8a5a3c',mat:'brick',seed:2});drum(c,.2,2.2,'#7a8a50');crate(c,2.5,2.15,0,.34)},
live(c,b,H){sm(c,H.L(2.4,.5,50))}};
NB.cistern={up:100,paint(c,b){slab(c,2,2);for(const[u,v]of[[.12,.12],[1.76,.12],[.12,1.76],[1.76,1.76]])vol(c,{x:u,y:v,w:.14,h:.14,z:20,z0:2,col:'#5a6068',mat:'metal',seed:u+v});
 {const p=V(1,1,20);cyl(c,p[0],p[1],20,30,palc('cistern',b),{bands:3});c.strokeStyle=OLC;c.lineWidth=1.5;const q=V(1,1,50);c.beginPath();c.ellipse(q[0],q[1],20,8,0,0,7);c.fillStyle='#5a82a2';c.fill();c.stroke()}
 line(c,V(1.9,1,20),V(2.2,1.6,3),'#3c4a52',3);sacks(c,.2,2.1,2)}};
NB.greenh={up:70,paint(c,b){const cl=b.cl||0;slab(c,4,3,'#8d8a80');
 vol(c,{x:.1,y:.1,w:3.8,h:2.8,z:12,z0:2,col:'#9fcfc0',mat:'glass',seed:cl+1,decL:(c,len,H)=>{c.strokeStyle='rgba(30,50,40,.7)';c.lineWidth=1.3;for(let x=0;x<=len;x+=len/6){c.beginPath();c.moveTo(x,0);c.lineTo(x,-H);c.stroke()}c.fillStyle='rgba(90,160,70,.7)';for(let x=6;x<len;x+=11)c.fillRect(x,-8,6,6)},decR:(c,len,H)=>{c.strokeStyle='rgba(30,50,40,.7)';c.lineWidth=1.3;for(let x=0;x<=len;x+=len/5){c.beginPath();c.moveTo(x,0);c.lineTo(x,-H);c.stroke()}c.fillStyle='rgba(90,160,70,.7)';for(let x=6;x<len;x+=11)c.fillRect(x,-8,6,6)}});
 gableX(c,{x:.1,y:.1,w:3.8,h:2.8,z:14,rh:9,col:'#b8e0d2',wallCol:'#9fcfc0',mat:'glass',seed:cl+2,oh:.05,rows:5});drum(c,.2,3.2,'#3a6a8a');crate(c,3.4,3.15,0,.34)}};
NB.solar={up:50,paint(c,b){slab(c,3,3,'#7d7a72');for(let i=0;i<3;i++)for(let j=0;j<3;j++)solar(c,.5+i*.95,.5+j*.95,8);vol(c,{x:2.5,y:2.4,w:.4,h:.4,z:12,z0:2,col:'#6a7276',mat:'metal',seed:2})},
live(c,b,H){const p=H.L(1.5,1.5,16);c.fillStyle='rgba(255,240,170,'+(.12+.06*Math.sin(T*2))+')';c.beginPath();c.ellipse(p[0],p[1],34,14,0,0,7);c.fill()}};
NB.smithy={up:130,paint(c,b){const cl=b.cl||0,wall=palc('smithy',b);slab(c,3,3,'#6f6c64');
 vol(c,{x:0,y:0,w:3,h:3,z:24,z0:2,col:wall,mat:'brick',seed:cl+4,decL:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(10,-18,30,16);c.fillStyle='#e8671c';c.fillRect(12,-16,26,12);c.fillStyle='#ffd25a';c.fillRect(18,-13,14,6);row(c,len,-18,len-34,16,2,{w:9,h:6,lit:.5},cl)},decR:(c,len,H)=>{row(c,len,-16,10,22,3,{w:10,h:7,lit:.3,bad:.3},cl+2)}});
 gableX(c,{x:0,y:0,w:3,h:3,z:26,rh:6,col:'#5b6168',wallCol:wall,mat:'brick',seed:cl+9,oh:.1,rows:6});
 {const p=V(.7,.6,26);cyl(c,p[0],p[1],6,44,'#8f5d48',{bands:4});c.fillStyle='#2a1a11';c.beginPath();c.ellipse(p[0],p[1]-44,3.8,1.7,0,0,7);c.fill()}
 crate(c,2.5,3.15,0,.4,'#6a6a6a');drum(c,.2,3.2,'#8a3a2a');vol(c,{x:1.6,y:3.15,w:.6,h:.3,z:7,z0:2,col:'#4a4f55',mat:'metal',seed:4})},
live(c,b,H){sm(c,H.L(.7,.6,76));const p=H.L(.75,1.55,12);c.fillStyle='rgba(255,150,40,'+(.25+.15*Math.sin(T*7))+')';c.beginPath();c.arc(p[0],p[1],8,0,7);c.fill()}};
NB.pharm={up:70,paint(c,b){const cl=b.cl||0;slab(c,2,2,'#9a978c');
 vol(c,{x:0,y:0,w:2,h:2,z:22,z0:2,col:'#e2e0d6',mat:'plaster',seed:cl+1,decL:(c,len,H)=>{c.fillStyle='#2f9b57';c.fillRect(len/2-3,-17,6,16);c.fillRect(len/2-8,-12,16,6);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(len/2-3,-17,6,16);wnd(c,8,-12,9,7,{lit:true})},decR:(c,len,H)=>{dor(c,10,-13.5,12,13.5,{col:'#4a6a8a'});wnd(c,30,-12,9,7,{lit:true})}});
 hip(c,{x:0,y:0,w:2,h:2,z:24,rh:5,col:'#a9b8b4',oh:.14});crate(c,1.6,2.2,0,.32,'#8fc0a0')}};
NB.chem={up:130,paint(c,b){const cl=b.cl||0;slab(c,3,3,'#6f6c78');
 vol(c,{x:.1,y:.1,w:1.2,h:2.8,z:16,z0:2,col:palc('chem',b),mat:'metal',seed:cl+1,decL:(c,len,H)=>{row(c,len,-11,6,16,1,{w:9,h:6,lit:.7},cl)},decR:(c,len,H)=>{row(c,len,-11,6,22,2,{w:9,h:6,lit:.5},cl+1)}});
 for(const[u,v,r,h,col]of[[1.9,.7,11,40,'#9b6fd1'],[2.4,1.7,9,30,'#5fa89a'],[1.6,2.4,8,24,'#d19b3a']]){const p=V(u,v,2);cyl(c,p[0],p[1],r,h,col,{bands:3})}
 line(c,V(1.3,.8,16),V(1.9,.8,30),'#444',2.4);line(c,V(1.3,1.8,12),V(2.2,1.8,22),'#444',2.4);drum(c,.2,3.2,'#6a3a8a')},
live(c,b,H){sm(c,H.L(1.9,.7,50));const p=H.L(.7,1.5,20);c.fillStyle=Math.sin(T*3)>0?'#9bff7a':'#2a5a1a';c.beginPath();c.arc(p[0],p[1],2,0,7);c.fill()}};
NB.ammof={up:80,paint(c,b){const cl=b.cl||0,wall=palc('ammof',b);slab(c,3,3,'#6f6c64');
 vol(c,{x:0,y:0,w:3,h:3,z:20,z0:2,col:wall,mat:'block',seed:cl+3,decL:(c,len,H)=>{c.fillStyle='#e8c22c';c.fillRect(8,-14,len-16,4);c.fillStyle='#1c1c1c';for(let i=0;i<8;i++)c.fillRect(8+i*(len-16)/8,-14,(len-16)/16,4);row(c,len,-8,12,24,3,{w:10,h:5,lit:.4},cl)},decR:(c,len,H)=>{dor(c,12,-13.5,14,13.5,{col:'#4a4f3a'});row(c,len,-12,40,20,2,{w:9,h:6,lit:.3},cl+1)}});
 gableX(c,{x:0,y:0,w:3,h:3,z:22,rh:5,col:'#4a5036',wallCol:wall,mat:'block',seed:cl+8,oh:.1,rows:5});
 for(let i=0;i<4;i++)crate(c,2.2+(i%2)*.36,3.15+(i>>1)*.1,(i>>1)*5,.36,'#6a7a4a');sacks(c,.1,3.15,4)}};
NB.elab={up:120,paint(c,b){const cl=b.cl||0,wall=palc('elab',b);slab(c,3,2,'#7d7a72');
 vol(c,{x:0,y:0,w:3,h:2,z:30,z0:2,col:wall,mat:'plaster',seed:cl+2,decL:(c,len,H)=>{row(c,len,-24,8,20,3,{w:10,h:7,lit:.8,bad:.05},cl);row(c,len,-12,8,20,3,{w:10,h:7,lit:.7,bad:.05},cl+1)},decR:(c,len,H)=>{dor(c,10,-13.5,12,13.5,{col:'#2a3a4a'});row(c,len,-24,34,18,2,{w:9,h:6,lit:.6},cl+2)}});
 flatRoof&&flatRoof(c,{x:0,y:0,w:3,h:2,z:32,col:'#5a6168'});
 line(c,V(2.3,.4,32),V(2.3,.4,66),'#8a9296',2);line(c,V(2.3,.4,60),V(2.0,.4,60),'#8a9296',1.6);line(c,V(2.3,.4,52),V(2.6,.4,52),'#8a9296',1.6);{const p=V(.8,1.0,32);c.fillStyle='#cfd5d8';c.beginPath();c.ellipse(p[0],p[1]-6,9,4,0,0,Math.PI*2);c.fill();c.strokeStyle=OLC;c.stroke()}},
live(c,b,H){const p=H.L(2.3,.4,68);c.fillStyle=Math.sin(T*4)>0?'#ff4a3a':'#5a1a14';c.beginPath();c.arc(p[0],p[1],2.4,0,7);c.fill()}};
NB.wind={up:170,paint(c,b){slab(c,2,2,'#8d8a80');{const p=V(1,1,2);cyl(c,p[0],p[1],5,78,'#e4e4dc',{bands:5})}vol(c,{x:.7,y:.7,w:.6,h:.6,z:84,z0:78,col:'#cfd3d4',mat:'metal',seed:2});sacks(c,.1,2.1,2)},
live(c,b,H){const p=H.L(1,.7,82);c.strokeStyle='#f0f0ea';c.lineWidth=3;c.lineCap='round';for(let i=0;i<3;i++){const a=T*2.4+i*2.094;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*34,p[1]+Math.sin(a)*34);c.stroke()}c.lineCap='butt';c.fillStyle='#8a9296';c.beginPath();c.arc(p[0],p[1],3.4,0,7);c.fill()}};
NB.radio={up:90,paint(c,b){slab(c,2,2,'#8d8a80');vol(c,{x:.15,y:1.0,w:1.0,h:.8,z:20,z0:2,col:'#6f7a64',mat:'plank',seed:4});
 line(c,V(1.6,.5,2),V(1.6,.5,84),'#8a9296',2.4);line(c,V(1.6,.5,60),V(1.2,.9,40),'#6a7276',1);line(c,V(1.6,.5,60),V(2.0,.9,40),'#6a7276',1);line(c,V(1.6,.5,70),V(1.2,.5,70),'#8a9296',1.6);line(c,V(1.6,.5,50),V(2.0,.5,50),'#8a9296',1.6);sacks(c,.1,.2,2)},
live(c,b,H){const p=H.L(1.6,.5,86);c.fillStyle=Math.sin(T*3)>0?'#ff4a3a':'#5a1a14';c.beginPath();c.arc(p[0],p[1],2.4,0,7);c.fill();c.strokeStyle='rgba(255,220,120,'+(.6-((T*.8)%1)*.6)+')';c.lineWidth=1.5;for(let i=1;i<=2;i++){c.beginPath();c.arc(p[0],p[1],6+((T*.8)%1)*14+i*7,-2.4,-.7);c.stroke()}}};
NB.market={up:70,paint(c,b){const cl=b.cl||0;slab(c,4,3,'#8d8a80');
 for(let i=0;i<3;i++){const x=.2+i*1.3,col=['#c94a3a','#d9b84a','#4a8ac9'][i];vol(c,{x,y:.3,w:1.1,h:1.6,z:20,z0:2,col:'#8a6a4a',mat:'plank',seed:i,decL:(c,len,H)=>{c.fillStyle=col;c.fillRect(0,-H,len,6);c.strokeStyle=OLC;c.strokeRect(0,-H,len,6)}});crate(c,x+.2,2.2,0,.34,i%2?'#a98a50':'#8a6a3a');sacks(c,x,2.6,2)}
 vol(c,{x:.1,y:2.7,w:3.8,h:.2,z:8,z0:2,col:'#6a4a32',mat:'plank',seed:9})}};
NB.refin={up:170,paint(c,b){const cl=b.cl||0;slab(c,4,4,'#6f6c64');
 for(const[u,v,r,h]of[[.9,.9,16,38],[2.6,.9,14,30],[.9,2.7,12,24],[2.6,2.7,15,34]]){const p=V(u,v,2);cyl(c,p[0],p[1],r,h,['#a8aeb2','#9aa09a','#b0a89a','#a0a8ae'][Math.floor(u+v)%4],{bands:3})}
 vol(c,{x:1.7,y:1.4,w:.8,h:.8,z:14,z0:2,col:palc('refin',b),mat:'metal',seed:cl+2});for(const[a,b2]of[[[.9,.9],[2.6,.9]],[[.9,.9],[.9,2.7]],[[2.6,.9],[2.6,2.7]]])line(c,V(a[0],a[1],26),V(b2[0],b2[1],26),'#5a4a3a',2.6);
 line(c,V(3.6,3.6,2),V(3.6,3.6,100),'#6a6e72',2.4)},
live(c,b,H){const p=H.L(3.6,3.6,104);c.fillStyle='rgba(255,'+(130+Math.floor(Math.sin(T*9)*40))+',40,.9)';c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+5,p[1]-8,p[0],p[1]-16-Math.sin(T*8)*3);c.quadraticCurveTo(p[0]-5,p[1]-8,p[0],p[1]);c.fill();sm(c,p)}};
NB.bunker={up:60,paint(c,b){const lv=b.lvl;slab(c,3,3,'#7a766c');
 vol(c,{x:.05,y:.05,w:2.9,h:2.9,z:14,z0:2,col:palc('bunker',b),mat:'block',seed:3,decL:(c,len,H)=>{c.fillStyle='#14110e';for(let i=0;i<3;i++)c.fillRect(12+i*28,-9,18,3)},decR:(c,len,H)=>{c.fillStyle='#8a8f94';c.fillRect(10,-13,22,13);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(10,-13,22,13);c.fillStyle='#c9a24a';c.fillRect(19,-8,4,3)}});
 vol(c,{x:.5,y:.5,w:2,h:2,z:19,z0:14,col:'#5b6a3c',mat:'block',seed:5,topCol:'#6a7a46'});sacks(c,.1,3.1,4);sacks(c,2.4,3.1,3);{const p=V(1.5,1.5,19);c.fillStyle='#2a2e24';c.beginPath();c.ellipse(p[0],p[1]-1,9,4,0,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}}};
Object.keys(B).forEach(k=>{if(NB[k]&&!NB[k].up)NB[k].up=100});
/* ---- ayuntamiento: remates para niveles 6–15 ---- */
if(NB.hall){const orig=NB.hall.paint;NB.hall.paint=function(c,b){orig.call(this,c,b);const lv=b.lvl;if(lv<=5)return;
 const n=Math.min(10,lv-5);for(let i=0;i<n;i++){const u=.7+(i%5)*.65,v=.5+Math.floor(i/5)*.9;vol(c,{x:u,y:v,w:.4,h:.5,z:5+(i%3)*2,z0:31,col:['#8a9296','#a8a08a','#7a8690'][i%3],mat:'metal',seed:i+9})}
 if(lv>=9){line(c,V(2,2,51),V(2,2,70+Math.min(40,(lv-9)*7)),'#8a9296',2.4);line(c,V(2,2,60),V(1.5,2,60),'#8a9296',1.6)}
 if(lv>=12){for(const[u,v]of[[.2,.2],[3.6,.2],[.2,3.6],[3.6,3.6]]){const p=V(u,v,34);c.fillStyle='#d4b65f';c.beginPath();c.arc(p[0],p[1]-6,4,0,7);c.fill();c.strokeStyle=OLC;c.stroke()}}};
 const ol=NB.hall.live;NB.hall.live=function(c,b,H){if(ol)ol.call(this,c,b,H);if(b.lvl>=9){const p=H.L(2,2,72+Math.min(40,(b.lvl-9)*7));c.fillStyle=Math.sin(T*3)>0?'#ff5a3a':'#5a1a14';c.beginPath();c.arc(p[0],p[1],2.6,0,7);c.fill()}}}
})();
