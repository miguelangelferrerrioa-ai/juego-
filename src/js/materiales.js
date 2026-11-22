/* ===== Dead Town · materiales de construcción por tramos (lona, piedra, tablones, chapa, ladrillo) ===== */
(function(){
const MATK=['tarp','stone','plank','sheet','brick','glass','steel','concrete'];window.MATK=MATK;
const MD=[['tarp','Lona','#b9ae8c'],['stone','Piedra','#9c9a90'],['plank','Tablones','#a8743a'],['sheet','Chapa','#8e9aa3'],['brick','Ladrillo','#b5623f'],['glass','Cristal','#8fd0dc'],['steel','Acero','#4f5a64'],['concrete','Hormigón','#a6a49c']];
MD.forEach(([k,n,col])=>{if(RK.some(r=>r[0]===k))return;RK.push([k,n,col]);RN[k]=n.toLowerCase();IV[k]=150;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.fillStyle=col;x.strokeStyle='#111';x.lineWidth=1.5;
 if(k==='tarp'){x.beginPath();x.moveTo(10,3);x.lineTo(18,16);x.lineTo(2,16);x.closePath();x.fill();x.stroke();x.fillStyle='#2a1a11';x.beginPath();x.moveTo(10,8);x.lineTo(13,16);x.lineTo(7,16);x.closePath();x.fill()}
 else if(k==='stone'){x.beginPath();x.moveTo(3,15);x.lineTo(5,7);x.lineTo(11,4);x.lineTo(17,9);x.lineTo(16,15);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.25)';x.fillRect(7,7,5,2)}
 else if(k==='plank'){for(let i=0;i<3;i++){x.fillRect(3,4+i*5,14,4);x.strokeRect(3,4+i*5,14,4)}}
 else if(k==='sheet'){x.fillRect(3,5,14,10);x.strokeRect(3,5,14,10);x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;for(let i=0;i<5;i++){x.beginPath();x.moveTo(5+i*3,5);x.lineTo(5+i*3,15);x.stroke()}}
 else if(k==='glass'){x.beginPath();x.moveTo(10,2);x.lineTo(17,10);x.lineTo(10,18);x.lineTo(3,10);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.5)';x.fillRect(8,6,2,5)}
 else if(k==='steel'){x.fillRect(3,4,14,3);x.fillRect(8,7,4,7);x.fillRect(3,14,14,3);x.strokeRect(3,4,14,3);x.strokeRect(8,7,4,7);x.strokeRect(3,14,14,3)}
 else if(k==='concrete'){x.fillRect(3,6,14,10);x.strokeRect(3,6,14,10);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(6,9,2,2);x.fillRect(11,12,2,2);x.fillRect(12,8,1.5,1.5)}
 else{x.fillRect(2,7,16,7);x.strokeRect(2,7,16,7);x.strokeStyle='rgba(0,0,0,.4)';x.beginPath();x.moveTo(8,7);x.lineTo(8,14);x.moveTo(13,7);x.lineTo(13,14);x.stroke()}
 ICO[k]=c.toDataURL()});
/* ---- edificios de producción ---- */
Object.assign(BT,{
 sheetw:{n:'Taller de chapa',w:2,h:2,z:34,c:'#8e9aa3',cost:{wood:170,metal:120,tarp:10},lv:2,hp:200,p:{sheet:7},tech:'mat2',job:['Mecánico','Constructor'],slots:2,f:'Tramo 2. Produce chapa para chabolas y muros de acero.'},
 quarry:{n:'Cantera',w:3,h:3,z:34,c:'#9c9a90',cost:{wood:260,metal:150,tarp:16},lv:3,hp:260,p:{stone:12},tech:'mat3',mt:1,job:['Recolector','Mecánico','Constructor'],slots:3,f:'Tramo 3. Extrae piedra en la montaña.'},
 glassw:{n:'Horno de cristal',w:2,h:2,z:46,c:'#9fd0d8',cost:{wood:350,metal:230,brick:45},lv:6,hp:240,p:{glass:5},tech:'mat4',job:['Mecánico','Científico'],slots:2,f:'Tramo 4. Produce cristal.'},
 steelw:{n:'Acería',w:3,h:3,z:58,c:'#5f6a72',cost:{wood:430,metal:430,brick:65,sheet:40},lv:7,hp:380,p:{steel:4},tech:'mat4',job:['Mecánico','Constructor'],slots:3,f:'Tramo 4. Produce acero estructural.'},
 cement:{n:'Planta de hormigón',w:3,h:3,z:50,c:'#a6a49c',cost:{wood:520,metal:480,brick:65,steel:30,glass:25},lv:8,hp:420,p:{concrete:4},tech:'mat5',job:['Mecánico','Científico'],slots:3,f:'Tramo 5. Produce hormigón, el material más caro.'},
 kiln:{n:'Horno de ladrillos',w:2,h:2,z:52,c:'#b5623f',cost:{wood:270,metal:170,stone:45},lv:3,hp:260,p:{brick:7},tech:'mat3',job:['Mecánico','Cocinero'],slots:2,f:'Tramo 3. Produce ladrillos.'}});
BT.saw.p.plank=12;BT.saw.f='Produce madera y, con ella, tablones.';
BT.hall.p.tarp=5;BT.hall.p.stone=5;
[['house',4],['hosp',6],['barr',6],['store',4],['work',5],['expo',5],['fact',6],['gen',4],['lab',6],['kitchen',4]].forEach(([k,n])=>{if(BT[k])BT[k].cost.tarp=n});
[['sheetw','TALLER DE CHAPA'],['quarry','CANTERA'],['kiln','HORNO'],['glassw','VIDRIERÍA'],['steelw','ACERÍA'],['cement','HORMIGÓN']].forEach(([k,t])=>{SIGNT[k]=t;MAT[k]='metal'});
TECH.push(['mat2','Construcción','Metalistería',2,{wood:120,metal:60,tarp:10,stone:10},'Taller de chapa; mejoras a nivel 3-4 (chabola) y muro de acero'],['mat3','Construcción','Albañilería',3,{wood:200,metal:100,plank:20,sheet:10},'Cantera y horno de ladrillos; mejoras a nivel 5-6 y muro de ladrillo'],['mat4','Construcción','Vidrio y acero',6,{wood:260,metal:160,brick:20,sheet:20},'Horno de cristal y acería; mejoras a nivel 7-8'],['mat5','Construcción','Hormigón armado',8,{wood:320,metal:300,glass:20,steel:20,chem:10},'Planta de hormigón; mejoras a nivel 9-10'],['mat6','Construcción','Aleaciones ligeras',12,{wood:500,metal:600,steel:60,concrete:40,chem:40},'Mejoras a nivel 11-12'],['mat7','Construcción','Compuestos avanzados',17,{metal:900,steel:120,concrete:80,glass:60,chem:80,comp:30},'Mejoras a nivel 13-15']);
/* botín de expediciones */
try{ZN.forEach((z,i)=>{z.l=z.l||{};if(i%2==0&&!z.l.tarp)z.l.tarp=[6,18];if(i%3==0&&!z.l.stone)z.l.stone=[8,22];if(i%4==1&&!z.l.plank)z.l.plank=[6,14];if(i%5==2&&!z.l.sheet)z.l.sheet=[4,10];if(i%6==3&&!z.l.glass)z.l.glass=[3,9];if(i%7==4&&!z.l.steel)z.l.steel=[2,6];if(i%9==5&&!z.l.concrete)z.l.concrete=[2,5]})}catch(e){}
/* ---- costes y requisitos de mejora ---- */
const STG=new Set(['house','hosp','barr','farm','store','work','expo','fact','gen','lab','saw','kitchen','smithy','pharm','chem','ammof','elab','radio','market','refin']);
const ALL=b=>!['wall','gate','trap','road','bridge','turret','hall'].includes(b.type);
window.ucost=b=>{const d=BT[b.type],t=b.lvl+1,base=costOf(d.cost,t),a=Math.max(2,Math.ceil(b.w*b.h/2));let m={};
 if(b.type=='wall')m=({2:{plank:2},3:{stone:3},4:{brick:3},5:{sheet:4},6:{concrete:3},7:{concrete:4,steel:2},8:{steel:5,concrete:2},9:{concrete:6,steel:4,glass:2},10:{comp:2,steel:6,concrete:6}})[t]||{};
 else if(b.type=='gate')m=({2:{plank:4},3:{stone:6},4:{brick:6},5:{sheet:8},6:{concrete:6},7:{concrete:8,steel:4},8:{steel:10,concrete:4},9:{concrete:12,steel:8,glass:4},10:{comp:4,steel:12,concrete:12}})[t]||{};
 else if(STG.has(b.type))m=({2:{tarp:2*a},3:{sheet:2*a,plank:2*a},4:{sheet:3*a,plank:2*a},5:{stone:3*a,brick:2*a},6:{stone:4*a,brick:3*a}})[t]||{};
 if(ALL(b)&&t>=7)m=({7:{glass:2*a,steel:2*a},8:{glass:3*a,steel:3*a},9:{concrete:3*a,glass:2*a},10:{concrete:5*a,steel:3*a},11:{concrete:6*a,steel:4*a,glass:3*a},12:{concrete:7*a,steel:5*a,glass:4*a},13:{concrete:8*a,steel:6*a,glass:5*a},14:{concrete:10*a,steel:8*a,glass:6*a},15:{concrete:12*a,steel:10*a,glass:8*a}})[t]||{};
 return Object.assign(base,costOf(m,1))};
window.ugate=b=>{const t=b.lvl+1,y=b.type;let n=null;
 if(y=='wall'||y=='gate'){if(t==4)n='mat3';if(t==5)n='mat2';if(t==6||t==7)n='mat5';if(t==8||t==9)n='mat6';if(t==10)n='mat7'}
 else{if(STG.has(y)){if(t==3||t==4)n='mat2';if(t>=5&&t<=6)n='mat3'}if(ALL(b)){if(t==7||t==8)n='mat4';if(t==9||t==10)n='mat5';if(t==11||t==12)n='mat6';if(t>=13)n='mat7'}}
 if(n&&!th(n))return 'Requiere el estudio «'+TECH.find(q=>q[0]==n)[2]+'».';return ''};
/* ---- panel de materiales ---- */
window.matHtml=function(){const d=rate(),how={tarp:'Ayuntamiento (recolectores), ruinas y expediciones.',stone:'Ayuntamiento (recolectores), Cantera y expediciones.',plank:'Aserradero y expediciones.',sheet:'Taller de chapa.',brick:'Horno de ladrillos.',glass:'Horno de cristal y expediciones.',steel:'Acería y expediciones.',concrete:'Planta de hormigón y expediciones raras.'},use={tarp:'Casas, hospital y barracones en nv 1-2.',stone:'Muros de piedra y mejoras nv 5-6.',plank:'Vallas de madera y mejoras nv 3-4.',sheet:'Chabolas (nv 3-4) y muro de acero.',brick:'Muros de ladrillo y mejoras nv 5-6.',glass:'Mejoras a nivel 7-8 y 9.',steel:'Mejoras a nivel 7-8 y 10.',concrete:'Mejoras a nivel 9-10 y muros de hormigón (nv 6-10).'};
 return (MD.map(([k,n])=>`<div style="margin:8px 0;padding-bottom:6px;border-bottom:1px solid #2a3a2a"><b><img src="${ICO[k]}" width=16> ${n}: ${Math.floor(S.res[k]||0)}</b> <small>(${d[k]>=0?'+':''}${(d[k]/10).toFixed(1)}/min)</small><br><small>Se consigue: ${how[k]}<br>Se usa: ${use[k]}</small></div>`).join('')+'<p><small>Tramo 1: lona y piedra. Tramo 2: chapa y tablones (estudio Metalistería). Tramo 3: ladrillo y piedra de cantera (estudio Albañilería). Tramo 4: cristal y acero (estudio Vidrio y acero). Tramo 5: hormigón (estudio Hormigón armado).</small></p>')};
window.matMenu=function(){show('Materiales',matHtml())};
/* ---- pintar los edificios nuevos ---- */
const K=NBK,{V,vol,crate,post,line,cyl,gableY,hip,chimney,wnd,dor,sacks,OLC}=K;
NB.sheetw={up:70,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:2.12,h:2.12,z:2.4,col:'#8e887c',mat:'block',seed:1});
 vol(c,{x:.1,y:.1,w:1.35,h:1.15,z:20,z0:2.4,col:'#8e9aa3',mat:'metal',seed:3,decL:(c,len,H)=>{dor(c,len/2-5,-10.5,10,10.5,{col:'#4a3a2a'});wnd(c,len*.12,-12,8,6,{t:'board'});c.fillStyle='rgba(255,170,60,.55)';c.fillRect(len*.7,-13,5,6)},decR:(c,len,H)=>{wnd(c,len*.3,-12,9,7,{lit:true})}});
 gableY(c,{x:.05,y:.05,w:1.45,h:1.25,z:22.4,rh:8,col:'#6f767c',wallCol:'#8e9aa3',mat:'metal',seed:5,oh:.12,rows:7});
 chimney(c,1.1,.3,28,14,'#5f5f58');
 for(let i=0;i<4;i++)vol(c,{x:1.4,y:1.2,w:.55,h:.7,z:1.4,z0:2.4+i*1.5,col:i%2?'#aab3ba':'#9aa3aa',mat:'metal',seed:10+i});
 vol(c,{x:.2,y:1.55,w:.5,h:.28,z:4,z0:2.4,col:'#3a3a3e',mat:'block',seed:2});vol(c,{x:.26,y:1.6,w:.38,h:.18,z:3,z0:6.4,col:'#4a4a50',mat:'block',seed:3});
 crate(c,.85,1.6,2.4,.3,'#8a8e94')},
 live(c,b,H){smoke(c,H.L(1.28,.48,56))}};
NB.quarry={up:90,paint(c,b){
 vol(c,{x:-.05,y:-.05,w:3.1,h:3.1,z:2,col:'#7d7566',mat:'block',seed:1});
 vol(c,{x:.1,y:.1,w:2.8,h:.95,z:15,z0:2,col:'#a39d90',mat:'block',seed:2});
 vol(c,{x:.1,y:1.05,w:2.8,h:.95,z:10,z0:2,col:'#aaa498',mat:'block',seed:3});
 vol(c,{x:.1,y:2.0,w:2.8,h:.9,z:5,z0:2,col:'#b3ada0',mat:'block',seed:4});
 for(const[u,v,s,col]of[[.3,2.1,.3,'#c9c4b6'],[.65,2.18,.28,'#bdb8aa'],[.5,2.1,.26,'#d0cbbd'],[2.2,2.15,.34,'#c9c4b6'],[2.52,2.2,.26,'#bdb8aa']])crate(c,u,v,5,s,col);
 for(const[u,v]of[[1.2,1.3],[1.45,1.4],[1.9,1.2]])crate(c,u,v,10,.26,'#cfcabb');
 post(c,1.4,2.55,2,30,'#6a4b2e');post(c,2.2,2.55,2,30,'#6a4b2e');vol(c,{x:1.35,y:2.5,w:.95,h:.1,z:3,z0:30,col:'#6a4b2e',mat:'plank',seed:3});
 line(c,V(1.85,2.55,30),V(1.85,2.55,12),'#d9d0ae',1.2);crate(c,1.7,2.4,5,.28,'#8a6a44')}};
NB.kiln={up:100,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:2.12,h:2.12,z:2.4,col:'#8e887c',mat:'block',seed:1});
 vol(c,{x:.2,y:.2,w:1.4,h:1.4,z:20,z0:2.4,col:'#b5623f',mat:'brick',seed:4,
  decL:(c,len,H)=>{c.fillStyle=OLC;c.beginPath();c.moveTo(len/2-8,0);c.lineTo(len/2-8,-9);c.quadraticCurveTo(len/2,-19,len/2+8,-9);c.lineTo(len/2+8,0);c.closePath();c.fill();c.fillStyle='#ff9a3a';c.beginPath();c.moveTo(len/2-6,0);c.lineTo(len/2-6,-8.5);c.quadraticCurveTo(len/2,-16,len/2+6,-8.5);c.lineTo(len/2+6,0);c.closePath();c.fill();c.fillStyle='#ffd27a';c.fillRect(len/2-3,-6,6,6)},
  decR:(c,len,H)=>{c.fillStyle='rgba(0,0,0,.18)';c.fillRect(len*.3,-H+4,len*.4,5)}});
 hip(c,{x:.2,y:.2,w:1.4,h:1.4,z:22.4,rh:7,col:'#8a4a32',oh:.1});
 chimney(c,1.25,.3,26,22,'#a85a3c');
 crate(c,1.55,1.7,2.4,.3,'#b5623f');crate(c,1.25,1.78,2.4,.26,'#a85a3c');crate(c,1.58,1.4,2.4,.26,'#c06a46');sacks(c,.2,1.8,2,2.4)},
 live(c,b,H){smoke(c,H.L(1.43,.48,50))}};
NB.glassw={up:80,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:2.12,h:2.12,z:2.4,col:'#8e887c',mat:'block',seed:1});
 vol(c,{x:.2,y:.15,w:1.4,h:1.2,z:18,z0:2.4,col:'#9a948a',mat:'brick',seed:4,decL:(c,len,H)=>{c.fillStyle=OLC;c.beginPath();c.arc(len/2,-7,7,0,7);c.fill();c.fillStyle='#ff9a3a';c.beginPath();c.arc(len/2,-7,5.2,0,7);c.fill();c.fillStyle='#ffe0a0';c.beginPath();c.arc(len/2,-7,2.4,0,7);c.fill()},decR:(c,len,H)=>{wnd(c,len*.3,-12,9,7,{lit:true})}});
 hip(c,{x:.2,y:.15,w:1.4,h:1.2,z:20.4,rh:6,col:'#6a5a4a',oh:.1});
 chimney(c,1.2,.3,24,22,'#7a6a5a');
 for(let i=0;i<4;i++)vol(c,{x:1.45+i*.1,y:1.45,w:.1,h:.5,z:12,z0:2.4,col:i%2?'#bfe3ea':'#9fd0d8',mat:'block',seed:20+i});
 crate(c,.25,1.55,2.4,.32,'#b98a4e');crate(c,.65,1.62,2.4,.26,'#9fd0d8')},
 live(c,b,H){smoke(c,H.L(1.38,.48,50))}};
NB.steelw={up:110,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:3.12,h:3.12,z:2.4,col:'#7d786e',mat:'block',seed:1});
 vol(c,{x:.15,y:.15,w:2.7,h:1.9,z:24,z0:2.4,col:'#5f6a72',mat:'metal',seed:3,decL:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(len*.18,-16,16,16);c.fillStyle='#ff8a2a';c.fillRect(len*.18+1.6,-14.4,12.8,14.4);c.fillStyle='#ffd27a';c.fillRect(len*.18+4,-10,8,10)},decR:(c,len,H)=>{wnd(c,len*.3,-14,9,7,{t:'board'})}});
 gableY(c,{x:.1,y:.1,w:2.8,h:2.0,z:26.4,rh:8,col:'#434b52',wallCol:'#5f6a72',mat:'metal',seed:5,oh:.12,rows:8});
 chimney(c,.5,.4,34,28,'#4a4a46');chimney(c,2.2,.4,34,22,'#4a4a46');
 for(let i=0;i<6;i++)vol(c,{x:.3+(i%3)*.55,y:2.35+Math.floor(i/3)*.3,w:.5,h:.24,z:3,z0:2.4,col:i%2?'#6a737b':'#4f5860',mat:'metal',seed:30+i});
 crate(c,2.3,2.4,2.4,.34,'#8a8e94')},
 live(c,b,H){smoke(c,H.L(.68,.58,64));smoke(c,H.L(2.38,.58,58))}};
NB.cement={up:100,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:3.12,h:3.12,z:2.4,col:'#8e8a80',mat:'block',seed:1});
 const cy=(u,v,r,h,col)=>{K.seg(c,u-.35,v-.35,.7,.7,2.4,h+3);const p=V(u,v,2.4);cyl(c,p[0],p[1],r,h,col,{bands:1})};
 cy(.7,.7,11,40,'#b9b6ac');cy(1.55,.7,11,34,'#a6a49c');
 vol(c,{x:.15,y:1.25,w:1.8,h:.9,z:16,z0:2.4,col:'#8d8a80',mat:'block',seed:6,decL:(c,len,H)=>{wnd(c,len*.2,-10,8,6,{t:'board'});dor(c,len*.6,-9,9,9,{col:'#4a3a2a'})}});
 vol(c,{x:.1,y:1.2,w:1.9,h:1.0,z:2.6,z0:18.4,col:'#6f6c64',mat:'block',seed:7});
 {const p=V(2.4,1.2,2.4);K.seg(c,2.1,.9,.7,.7,2.4,22);c.fillStyle='#e0b020';c.beginPath();c.ellipse(p[0],p[1]-12,11,9,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.6;c.stroke();c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.2;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(p[0]+i*5,p[1]-19);c.lineTo(p[0]+i*5+2,p[1]-5);c.stroke()}}
 for(let i=0;i<6;i++)vol(c,{x:.3+(i%3)*.5,y:2.5+Math.floor(i/3)*.28,w:.45,h:.24,z:4,z0:2.4,col:i%2?'#b0aea4':'#a09e94',mat:'block',seed:40+i});
 sacks(c,2.1,2.5,3,2.4)}};
})();
/* ---- guía: contenido nuevo ---- */
(function(){try{
const G=window.GD||GD,U=GU;
const nm={tarp:'Lona',stone:'Piedra',plank:'Tablones',sheet:'Chapa',brick:'Ladrillo',glass:'Cristal',steel:'Acero',concrete:'Hormigón'};
Object.assign(U,{tarp:'Material de construcción (tramo 1). Se consigue con los recolectores del ayuntamiento, en ruinas y en expediciones. Se gasta en casas, hospital, barracones y en las mejoras a nivel 2. No se mezcla con la chatarra.',stone:'Material de construcción (tramo 1). Lo dan los recolectores del ayuntamiento, la Cantera y las expediciones. Sirve para muros de piedra y mejoras a nivel 5-6.',plank:'Material (tramo 2). Lo fabrica el Aserradero. Sirve para vallas de madera y mejoras a nivel 3-4.',sheet:'Material (tramo 2). Lo fabrica el Taller de chapa. Sirve para chabolas (nivel 3-4) y muros de acero.',brick:'Material (tramo 3). Lo cuece el Horno de ladrillos. Sirve para muros de ladrillo y mejoras a nivel 5-6.',glass:'Material (tramo 4). Lo funde el Horno de cristal, o se halla en expediciones. Sirve para mejoras a nivel 7-9.',steel:'Material (tramo 4). Lo produce la Acería, o se halla en expediciones. Sirve para mejoras a nivel 7, 8 y 10.',concrete:'Material (tramo 5, el más caro). Lo mezcla la Planta de hormigón; también aparece en expediciones raras. Sirve para mejoras a nivel 9-10.'});
for(const[k,t]of Object.entries({chem:'Lo produce la Planta química. Sirve para tecnologías y mejoras avanzadas, y el estudio de hormigón lo necesita.',comp:'Piezas electrónicas: las recupera el Taller de electrónica y el Mercado. Se usan en edificios avanzados (solar, eólica, farmacia, plantas).',scrap:'Chatarra recogida en el mapa y expediciones. Es independiente de los materiales de construcción.',abx:'Los fabrica el Laboratorio de antibióticos. Solo sirven para curar enfermedades.'}))if(!U[k])U[k]=t;
const rep=(t,f)=>{const g=G.find(q=>q[0]===t);if(!g)return;const o=g[1];g[1]=()=>f(o())};
rep('Zombis y defensa',h=>h.replace(/murallas, puertas, barricadas y torres/,'murallas, puertas y torres').replace('murallas, barricadas, puertas','vallas y murallas, puertas'));
const at=Math.max(0,G.findIndex(q=>q[0]==='Edificios'));
const ins=[
['Materiales de construcción',()=>'<p>Además de madera y metal hay <b>8 materiales</b> que se desbloquean por tramos, de más fáciles a más costosos. Se ven en el <b>Almacén → pestaña Materiales</b> (cantidad, ritmo por minuto, cómo se consiguen y para qué sirven). Siguen sin mezclarse con la chatarra.</p><p><b>Tramo 1 · Lona y piedra:</b> desde el principio. Los dan el ayuntamiento (recolectores), las ruinas y las expediciones. La <b>Cantera</b> (solo en montaña) produce piedra de forma estable.</p><p><b>Tramo 2 · Tablones y chapa</b> (estudio <i>Metalistería</i>): el Aserradero produce tablones y el <b>Taller de chapa</b> produce chapa.</p><p><b>Tramo 3 · Ladrillo</b> (estudio <i>Albañilería</i>): el <b>Horno de ladrillos</b> produce ladrillo.</p><p><b>Tramo 4 · Cristal y acero</b> (estudio <i>Vidrio y acero</i>, ayuntamiento 6): el <b>Horno de cristal</b> y la <b>Acería</b>.</p><p><b>Tramo 5 · Hormigón</b> (estudio <i>Hormigón armado</i>, ayuntamiento 8): la <b>Planta de hormigón</b> produce hormigón.</p><p><b>Coste de mejorar:</b> nivel 2 lona · 3-4 chapa y tablones · 5-6 piedra y ladrillo · 7 cristal y acero · 8 más cristal y acero · 9 hormigón y cristal · 10 hormigón y acero (las cantidades crecen con el tamaño del edificio). Los niveles 3-4 exigen Metalistería, 5-6 Albañilería, 7-8 Vidrio y acero y 9-10 Hormigón armado. Cada edificio sube como máximo un nivel por encima del ayuntamiento.</p>'],
['Pausar edificios',()=>'<p>Los edificios <b>no gastan materiales para producir</b>: su único consumo es la <b>energía</b> (ver sección Energía). Producen según su nivel, sus trabajadores y si tienen energía.</p><p><b>Pausar y encender:</b> en el panel de un edificio que consume energía hay un botón para pararlo. Mientras está en pausa <b>no produce ni gasta energía</b> y se ve una insignia de pausa. Úsalo para liberar energía cuando hay déficit. Pulsa de nuevo para encenderlo.</p>'],
['Niveles y aspecto de los edificios',()=>'<p>Cada mejora cambia el aspecto del edificio, siempre con estilo apocalíptico: <b>nivel 1-2</b>, campamento (tiendas de campaña, la clínica es una tienda sanitaria, la granja un huerto con vallas de alambre); <b>nivel 3-4</b>, chabola de chapa y tablones; <b>nivel 5 en adelante</b>, el diseño completo, que va ganando banderas, farolas, focos, depósitos, paneles y refuerzos hasta el nivel 10. El nivel máximo es 10 (5 en muros y puertas). Al girar un edificio se redibuja con la nueva orientación.</p>'],
['Muros, vallas y puertas',()=>'<p>Los muros y puertas son finos y se conectan con sus vecinos. Los 5 primeros niveles: <b>1 valla de alambre</b> sobre zócalo, <b>2 valla de madera</b>, <b>3 piedra</b>, <b>4 ladrillo</b> y <b>5 acero</b> con alambre de espino. Las puertas siguen el mismo material (la de nivel 1 lleva marco, diagonal y pestillo). Mejorar un muro gasta tablones, piedra, ladrillo o chapa según el nivel y pide los estudios Albañilería (nivel 4) y Metalistería (nivel 5). Se pintan arrastrando el dedo y puedes mejorar varios a la vez desde el menú de muros. Las barricadas ya no existen: las partidas antiguas las convierten en vallas.</p>'],
['Torres y armas',()=>'<p>Las <b>torres de vigilancia no disparan solas</b>: hay que asignar 1 o 2 supervivientes con arma. Cada tirador dispara con <b>su arma</b>: el alcance, el daño y la cadencia dependen de ella (la escopeta pega fuerte a poca distancia, el rifle alcanza más, la pistola es rápida) y también de su habilidad. El alcance crece con el nivel de la torre y baja de noche. Sin tiradores armados la torre se queda parada.</p>']];
G.splice(at,0,...ins);
}catch(e){console.error('guia',e)}})();
try{const G=window.GD||GD;const at=Math.max(0,G.findIndex(q=>q[0]==='Edificios'));
G.splice(at,0,['Restos de vehículos',()=>'<p>No hay vehículos que conducir. Por el mapa, sobre todo en ruinas, zonas industriales y yermos, hay <b>restos de coches y furgonetas</b> abandonados.</p><p><b>Registrar:</b> toca uno dentro de tu territorio. Si destella, aún tiene botín: metal siempre y, al azar, chatarra, lona, tablones, componentes, munición, medicinas, químicos y algún punto de investigación. Los recolectores aumentan lo que encuentras. Ya saqueado, se ve con la puerta abierta; si lo tocas otra vez lo retiras (un poco de metal) y liberas el hueco para construir.</p><p>Los limpiadores no los retiran. Aparecen pocos y de forma lenta, así que no son una fuente infinita.</p>']);
}catch(e){console.error('guia restos',e)}
