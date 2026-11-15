/* ===== Dead Town · Forja de equipo: aleación (material nuevo), mejora de armas/atuendos hasta 5 estrellas y diseños de aleación ===== */
(function(){
'use strict';
if(!RK.some(r=>r[0]==='alloy')){RK.push(['alloy','Aleación','#8be3ff']);RN.alloy='aleación';IV.alloy=0;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.fillStyle='#8be3ff';x.strokeStyle='#111';x.lineWidth=1.5;
 x.beginPath();x.moveTo(3,14);x.lineTo(6,6);x.lineTo(17,6);x.lineTo(14,14);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.55)';x.fillRect(8,8,6,2);ICO.alloy=c.toDataURL()}
const RM={C:1,U:1.5,R:2,E:2.5,L:3,X:3.5},MAXR=5,GATE=13;
/* ---- diseños nuevos ---- */
const O=window.OUTFITS,V=window.OUTV;
const NWP=[['Pistola Fénix',34,{Soldado:4,Explorador:2},13],['Rifle de aleación',60,{Soldado:7,Mecánico:2},14],['Sable de monofilamento',50,{Soldado:6,Explorador:3},15],['Lanza térmica',56,{Soldado:6,Constructor:3},16],['Cañón de riel',88,{Soldado:10,Explorador:4},18],['Lanzagranadas Titán',96,{Soldado:11,Constructor:4},20]];
const NOU=[['Chaleco reactivo',16,{Soldado:5,Mecánico:3},['#4a525a','#2a3036','#8be3ff','vest'],13],['Capa de camuflaje óptico',14,{Explorador:9,Recolector:4},['#2e4a3a','#1a2c22','#8be3ff','coat'],14],['Armadura Centinela',24,{Soldado:9,Constructor:3},['#6a737c','#3a4148','#8be3ff','vest'],16],['Traje de ingeniero Titán',22,{Mecánico:9,Constructor:8},['#c08a2a','#7a5410','#1a1a1a','overall'],18],['Exoesqueleto de aleación',28,{Soldado:9,Constructor:6,Explorador:3},['#9aa4ae','#566069','#8be3ff','tactical'],20],['Armadura Titán',30,{Soldado:12,Médico:4},['#2a3a4a','#141e28','#8be3ff','vest'],22]];
const REQ={};
NWP.forEach((q,i)=>{if(!WP.some(w=>w.n===q[0]))WP.push({n:q[0],v:q[1],b:q[2],r:'X'});REQ[q[0]]={h:q[3],k:'w',c:{alloy:10+6*i,metal:300+60*i,comp:80+25*i,chem:60+10*i}}});
NOU.forEach((q,i)=>{if(!O[q[0]]){O[q[0]]={n:q[0],def:q[1],b:q[2],r:'X'};V[q[0]]=q[3]}REQ[q[0]]={h:q[4],k:'o',c:{alloy:10+6*i,metal:300+60*i,comp:80+25*i,chem:60+10*i}}});
/* ---- iconos propios ---- */
const ow=window.weaponIcon,oo=window.outfitIcon,cache={};
const CY='#8be3ff',OL='#14100a';
function wDraw(g,n){const M='#8d959b',D='#3b4147',R=(x,y,w,h,f)=>{g.fillStyle=f;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h)};const glow=(x,y,r,c)=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()};
 if(n==='Pistola Fénix'){glow(66,22,16,'rgba(255,150,60,.6)');R(20,16,50,13,'#c8ccd0');R(24,12,40,6,D);g.beginPath();g.moveTo(26,29);g.lineTo(42,29);g.lineTo(38,50);g.lineTo(22,50);g.closePath();g.fillStyle='#2a2f34';g.fill();g.stroke();R(60,18,16,8,'#ff9a3a');R(36,19,12,5,CY)}
 else if(n==='Rifle de aleación'){R(34,20,52,7,'#b8c2ca');R(8,17,28,13,D);R(44,27,10,6,D);R(50,11,20,7,'#5a666f');for(let i=0;i<4;i++)R(52+i*8,18,4,3,CY);g.beginPath();g.moveTo(38,27);g.lineTo(42,42);g.lineTo(50,42);g.lineTo(50,27);g.closePath();g.fillStyle=D;g.fill();g.stroke()}
 else if(n==='Sable de monofilamento'){glow(60,26,26,'rgba(139,227,255,.45)');g.beginPath();g.moveTo(26,32);g.lineTo(90,18);g.lineTo(90,22);g.lineTo(28,38);g.closePath();g.fillStyle='#e8fbff';g.fill();g.stroke();R(8,30,20,10,'#1a1c20');R(26,26,5,20,D);g.strokeStyle=CY;g.lineWidth=1.2;g.beginPath();g.moveTo(34,32);g.lineTo(88,20);g.stroke()}
 else if(n==='Lanza térmica'){g.lineWidth=6;g.strokeStyle=OL;g.beginPath();g.moveTo(8,52);g.lineTo(70,16);g.stroke();g.lineWidth=3.4;g.strokeStyle='#8a8f94';g.stroke();g.lineWidth=2;g.strokeStyle=OL;glow(80,12,22,'rgba(255,110,40,.7)');g.beginPath();g.moveTo(68,18);g.lineTo(92,4);g.lineTo(80,26);g.closePath();g.fillStyle='#ffb04a';g.fill();g.stroke();R(40,30,10,6,'#ff6a2a')}
 else if(n==='Cañón de riel'){R(6,20,84,5,'#aab4bc');R(6,28,84,5,'#aab4bc');for(let i=0;i<8;i++){g.fillStyle=CY;g.fillRect(12+i*10,25,6,3)}R(4,16,26,20,D);R(30,34,10,12,D);glow(88,26,12,'rgba(139,227,255,.6)')}
 else if(n==='Lanzagranadas Titán'){R(24,18,60,14,'#6a727a');R(80,15,10,20,D);R(8,18,20,14,'#4a3a2a');g.beginPath();g.arc(46,40,12,0,7);g.fillStyle='#3b4147';g.fill();g.stroke();g.fillStyle='#ff9a3a';for(let i=0;i<6;i++){const a=i*1.047;g.beginPath();g.arc(46+Math.cos(a)*7,40+Math.sin(a)*7,2.2,0,7);g.fill()}R(50,10,16,8,D)}}
function oDraw(g,n,o){const v=V[n];g.fillStyle=v[0];g.strokeStyle=OL;g.lineWidth=2;g.beginPath();g.moveTo(6,58);g.quadraticCurveTo(8,34,24,26);g.lineTo(26,14);g.quadraticCurveTo(32,20,38,14);g.lineTo(40,26);g.quadraticCurveTo(56,34,58,58);g.closePath();g.fill();g.stroke();
 const P=(x,y,w,h,f)=>{g.fillStyle=f;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h)};
 if(n==='Chaleco reactivo'){for(let r=0;r<3;r++)for(let c=0;c<3;c++)P(20+c*8,32+r*7,6,5,r%2?v[1]:'#6a737c');P(30,26,4,4,CY)}
 else if(n==='Capa de camuflaje óptico'){g.strokeStyle='rgba(139,227,255,.7)';g.lineWidth=1.2;for(let i=0;i<6;i++){g.beginPath();g.moveTo(10+i*8,58);g.lineTo(22+i*5,28);g.stroke()}g.strokeStyle=OL;P(28,24,8,5,v[1])}
 else if(n==='Armadura Centinela'){P(15,24,10,8,'#9aa4ae');P(39,24,10,8,'#9aa4ae');P(22,32,20,14,'#7a848c');P(26,46,12,10,'#5a646c');P(30,34,4,10,CY)}
 else if(n==='Traje de ingeniero Titán'){P(18,28,28,6,'#1a1a1a');P(14,36,10,12,v[1]);P(40,36,10,12,v[1]);P(28,36,8,16,'#e8b04a');P(30,22,4,4,'#e8b04a')}
 else if(n==='Exoesqueleto de aleación'){g.strokeStyle='#cfd6dc';g.lineWidth=2.4;g.beginPath();g.moveTo(18,28);g.lineTo(12,56);g.moveTo(46,28);g.lineTo(52,56);g.moveTo(24,34);g.lineTo(40,34);g.stroke();g.strokeStyle=OL;g.lineWidth=2;P(12,24,10,8,CY);P(42,24,10,8,CY);P(28,38,8,8,CY)}
 else if(n==='Armadura Titán'){P(12,22,14,10,'#4a6a8a');P(38,22,14,10,'#4a6a8a');P(20,32,24,18,'#3a5068');P(26,50,12,8,'#2a3a4a');g.fillStyle=CY;g.fillRect(29,36,6,8)}}
window.weaponIcon=n=>{if(!REQ[n]||REQ[n].k!=='w')return ow(n);const k='w'+n;if(cache[k])return cache[k];const cv=document.createElement('canvas');cv.width=96;cv.height=60;const g=cv.getContext('2d');g.lineJoin='round';g.lineWidth=2;g.strokeStyle=OL;wDraw(g,n);return cache[k]=cv.toDataURL()};
window.outfitIcon=n=>{if(!REQ[n]||REQ[n].k!=='o')return oo(n);const k='o'+n;if(cache[k])return cache[k];const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');g.lineJoin='round';oDraw(g,n,O[n]);return cache[k]=cv.toDataURL()};
/* ---- rango de mejora ---- */
const UP=()=>{if(!S.up)S.up={};return S.up};
const rk=n=>UP()[n]||0;
const base=n=>{const w=WP.find(q=>q.n===n);return w?w.v:0};
const odef=n=>O[n]?O[n].def:0;
const odelta=n=>rk(n)*Math.max(1,Math.round(odef(n)*.1));
window.upRank=rk;
window.upSync=()=>{if(typeof S==="undefined"||!S||!S.ppl||!S.up)return;const f=w=>{if(w&&w.n&&S.up[w.n]){const b=base(w.n);if(b)w.v=Math.round(b*(1+.1*S.up[w.n]))}};S.ppl.forEach(p=>f(p.wp));(S.inv||[]).forEach(it=>{if(!it.kind)f(it)})};
setInterval(()=>{try{if(typeof S!=='undefined'&&S&&S.res){if(typeof S.res.alloy!=='number')S.res.alloy=0;upSync()}}catch(e){}},1000);
const od=window.outDef,ep=window.eqPow;
window.outDef=p=>{const b=od(p);return b+(p&&p.outfit?odelta(p.outfit):0)};
window.eqPow=p=>{const b=ep(p);return b+(p&&p.outfit?odelta(p.outfit)*3:0)};
const cost=(n,r)=>{const x=WP.find(q=>q.n===n)||O[n],m=RM[(x&&x.r)||'C']||1,k=r+1;return{alloy:Math.ceil(3*k*m),metal:Math.ceil(50*k*m),comp:Math.ceil(10*k*m)}};
const owned=()=>{const s=new Set();(S.inv||[]).forEach(it=>{if(it.n&&it.kind!=='clothing')s.add(it.n)});S.ppl.forEach(p=>{if(p.wp&&p.wp.n)s.add(p.wp.n);if(p.outfit)s.add(p.outfit)});return[...s].filter(n=>WP.some(w=>w.n===n)||O[n])};
const star=n=>'<span style="color:#ffd76a">'+'★'.repeat(rk(n))+'</span><span style="color:#555">'+'★'.repeat(MAXR-rk(n))+'</span>';
const txt=c=>Object.keys(c).map(k=>c[k]+' '+RN[k]).join(', ');
window.forgeUp=n=>{if(hallLv()<GATE)return toast('La forja requiere ayuntamiento nivel '+GATE+'.');const r=rk(n);if(r>=MAXR)return;const c=cost(n,r);if(!can(c))return toast('Faltan: '+txt(c));pay(c);UP()[n]=r+1;upSync();toast(n+' mejorado a '+(r+1)+' estrellas.');forgeMenu()};
window.forgeMake=n=>{const q=REQ[n];if(!q)return;if(hallLv()<q.h)return toast('Requiere ayuntamiento nivel '+q.h+'.');if(!can(q.c))return toast('Faltan: '+txt(q.c));pay(q.c);S.inv.push(q.k==='o'?{kind:'outfit',n}:{n,v:base(n)});toast('Fabricado: '+n);forgeMenu()};
window.forgeSmelt=k=>{const c={steel:3*k,concrete:2*k,chem:3*k,metal:30*k};if(hallLv()<GATE)return toast('La forja requiere ayuntamiento nivel '+GATE+'.');if(!can(c))return toast('Faltan: '+txt(c));pay(c);S.res.alloy=(S.res.alloy||0)+k;toast('+'+k+' aleación');forgeMenu()};
window.forgeMenu=function(){if(typeof S.res.alloy!=='number')S.res.alloy=0;const lock=hallLv()<GATE;
 let h='<p><img src="'+ICO.alloy+'" width=16> <b>Aleación: '+Math.floor(S.res.alloy)+'</b> <small>Se funde aquí o se encuentra en misiones avanzadas.</small></p>'+(lock?'<p style="color:#e0a124">La forja requiere ayuntamiento nivel '+GATE+'.</p>':'')
 +'<p><button onclick="forgeSmelt(1)">Fundir 1 <small>(3 acero, 2 hormigón, 3 químicos, 30 metal)</small></button> <button onclick="forgeSmelt(5)">Fundir 5</button></p><p><b>Mejorar equipo</b> <small>(+10% daño o +10% defensa por estrella)</small></p>';
 const ow=owned();h+=ow.length?ow.map(n=>{const r=rk(n),c=cost(n,r),isO=!!O[n];return'<div class="invc"><img src="'+(isO?outfitIcon(n):weaponIcon(n))+'" class="invi"><div><b>'+n+'</b><div class="invs">'+star(n)+'</div>'+(r>=MAXR?'<div class="invb">Máximo</div>':'<button onclick="forgeUp(\''+n.replace(/'/g,"\\'")+'\')">Mejorar: '+txt(c)+'</button>')+'</div></div>'}).join(''):'<p><small>No tienes armas ni atuendos.</small></p>';
 h+='<p><b>Diseños de aleación</b></p>'+Object.keys(REQ).map(n=>{const q=REQ[n],isO=q.k==='o',x=isO?O[n]:WP.find(w=>w.n===n);return'<div class="invc" style="border-color:#8be3ff"><img src="'+(isO?outfitIcon(n):weaponIcon(n))+'" class="invi"><div><b style="color:#8be3ff">'+n+'</b><div class="invs">'+(isO?'🛡 Defensa +'+x.def:'⚔ Daño +'+x.v)+'</div><div class="invb">'+Object.keys(x.b||{}).map(k=>k+' +'+x.b[k]).join(' · ')+'</div><button onclick="forgeMake(\''+n.replace(/'/g,"\\'")+'\')">Fabricar (ayunt. '+q.h+'): '+txt(q.c)+'</button></div></div>'}).join('');
 show('Forja de equipo',h)};
/* acceso desde el almacén */
const so=window.storeMenu;window.storeMenu=function(){if(window.storeTab==='forge'){window.storeTab='res';return forgeMenu()}const r=so.apply(this,arguments);try{const pan=document.getElementById('pan'),row=[...pan.querySelectorAll('button')].find(b=>/storeTab=/.test(b.getAttribute('onclick')||''));if(row&&!pan.querySelector('#forgeB')){const b=document.createElement('button');b.id='forgeB';b.textContent='Forja';b.setAttribute('onclick',"storeTab='forge';storeMenu()");row.parentNode.appendChild(b)}}catch(e){}return r};
/* aleación como botín en misiones avanzadas */
try{STORY.forEach((c,i)=>{if(i>=14&&c.l&&!c.l.alloy)c.l.alloy=[6+Math.floor(i/3),12+Math.floor(i/2)]})}catch(e){}
})();
