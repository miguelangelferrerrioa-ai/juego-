/* ===== Grandes obras (ayuntamiento 12+): se construyen por etapas durante días =====
   Taller de blindaje (blindaje, 5×4): al terminarlo, una camioneta preparada para el apocalipsis lleva a las expediciones:
   viajan en la mitad de tiempo, traen un 20 % más de botín y vuelven menos heridos.
   Gran desguace (gdesg, 7×6): al terminarlo, genera 60 de chatarra al día y 20 más por cada trabajador (hasta 120).
   Etapas: b.st 0-2 en obra, 3 terminada; b.sp progreso de la etapa (0-1); b.need=1 cuando falta pagar la siguiente.
   Avanza con trabajadores (3 trabajadores: 1 día por etapa). Solo una de cada. No se destruyen: si caen, pierden avance. */
(function(){
'use strict';
if(typeof BT==='undefined'||!window.NBK)return;
const K=NBK,{V,mix,RGB,Q,pl,lg,line,vol,cyl,crate,sacks,OLC,flatRoof,gableY,gableX,dor,wnd}=K;
const ST=['Cimientos','Estructura','Acabados','Terminada'];
const OB={
 blindaje:{n:'Taller de blindaje',w:5,h:4,z:44,c:'#6a6e64',lv:12,hp:1400,slots:3,job:['Mecánico','Constructor'],obra:1,
  cost:{metal:250,concrete:40,steel:20},stg:[{steel:50,sheet:40,comp:20},{steel:70,comp:30,glass:15,scrap:120}],
  f:'Gran obra. Se construye en 3 etapas. Al terminarla, una camioneta blindada lleva a las expediciones: viajan en la mitad de tiempo, traen un 20 % más de botín y vuelven menos heridos.',
  fx:'Expediciones: mitad de viaje, +20 % de botín y menos heridos.'},
 gdesg:{n:'Gran desguace',w:7,h:6,z:60,c:'#7a7e74',lv:12,hp:1800,slots:3,job:['Recolector','Constructor','Mecánico'],obra:1,
  cost:{wood:300,metal:250,concrete:60},stg:[{steel:50,sheet:60,brick:60},{steel:60,comp:30,concrete:40}],
  f:'Gran obra. Se construye en 3 etapas. Al terminarla genera chatarra: 60 al día y 20 más por cada trabajador (hasta 120).',
  fx:'Chatarra: 60 al día + 20 por trabajador.'}};
Object.assign(BT,OB);
try{const C=window.BCATS;if(C){C.find(x=>x[0]==='prod')[3].push('blindaje');C.find(x=>x[0]==='rec')[3].push('gdesg')}}catch(e){}
const isO=b=>b&&OB[b.type];
const done=t=>S.bld.some(b=>b.type===t&&b.st>=3);
window.obraDone=done;
const nW=b=>{try{return wk(b).length}catch(e){return 0}};
const init=b=>{if(b.st===undefined){b.st=b.cl|0;b.sp=0;b.need=0}b.cl=b.st};
const g0=(c,x,y,w,h,col)=>{pl(c,[V(x,y,0),V(x+w,y,0),V(x+w,y+h,0),V(x,y+h,0)],col,'rgba(0,0,0,.25)',1.2)};
/* andamio delante de una caja */
function scaf(c,x,y,w,h,z0,z1){const P1=[],cs='#9a7040',ps='#c9a46a';
 const runs=[[[x-.15,y+h+.15],[x+w+.15,y+h+.15]],[[x+w+.15,y+h+.15],[x+w+.15,y-.15]]];
 runs.forEach(([a,b])=>{const n=Math.max(2,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/1.2));
  for(let i=0;i<=n;i++){const u=a[0]+(b[0]-a[0])*i/n,v=a[1]+(b[1]-a[1])*i/n;line(c,V(u,v,z0),V(u,v,z1),OLC,3.2);line(c,V(u,v,z0),V(u,v,z1),cs,1.8)}
  for(let zz=z0+12;zz<=z1;zz+=12){line(c,V(a[0],a[1],zz),V(b[0],b[1],zz),OLC,3.6);line(c,V(a[0],a[1],zz),V(b[0],b[1],zz),ps,2.2)}
  for(let i=0;i<n;i++){const u0=a[0]+(b[0]-a[0])*i/n,v0=a[1]+(b[1]-a[1])*i/n,u1=a[0]+(b[0]-a[0])*(i+1)/n,v1=a[1]+(b[1]-a[1])*(i+1)/n;line(c,V(u0,v0,z0),V(u1,v1,Math.min(z1,z0+24)),'rgba(120,85,45,.8)',1.1)}})}
/* grúa torre */
function crane(c,x,y,hh,len,dir){const b=V(x,y,0),t=V(x,y,hh),col='#e0b030';
 for(const dx of[-3,3]){line(c,[b[0]+dx,b[1]],[t[0]+dx,t[1]],OLC,3.4);line(c,[b[0]+dx,b[1]],[t[0]+dx,t[1]],col,2)}
 c.strokeStyle=col;c.lineWidth=1;c.beginPath();for(let k=0;k<hh;k+=8){c.moveTo(b[0]-3,b[1]-k);c.lineTo(b[0]+3,b[1]-k-8)}c.stroke();
 const e=V(x+dir[0]*len,y+dir[1]*len,hh),bk=V(x-dir[0]*len*.3,y-dir[1]*len*.3,hh);line(c,bk,e,OLC,5);line(c,bk,e,col,3);
 line(c,[t[0],t[1]-14],e,'#cfc6a8',1);line(c,[t[0],t[1]-14],bk,'#cfc6a8',1);line(c,t,[t[0],t[1]-14],OLC,3);
 c.fillStyle='#7a7a74';c.fillRect(bk[0]-6,bk[1]-2,12,8);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(bk[0]-6,bk[1]-2,12,8);
 const hk=mix(t,e,.7);line(c,hk,[hk[0],hk[1]+30],'#3a3a36',1);c.fillStyle='#3a3a36';c.fillRect(hk[0]-2,hk[1]+30,4,4);c.fillStyle='#4a6a8a';c.fillRect(t[0]-5,t[1]-6,10,7)}
function beams(c,x,y,n){for(let i=0;i<n;i++)vol(c,{x:x,y:y+i*.12,w:1.4,h:.1,z:3,z0:i%2*3,col:'#7a7e82',mat:'metal',seed:i})}
function blocks(c,x,y){for(let i=0;i<3;i++)for(let j=0;j<2;j++)vol(c,{x:x+i*.36,y:y+j*.36,w:.32,h:.32,z:8,z0:0,col:'#a8a296',mat:'block',seed:i+j})}
function flag(c,p,col){line(c,p,[p[0],p[1]-26],OLC,2.4);line(c,p,[p[0],p[1]-26],'#c8c0b0',1.2);c.fillStyle=col;c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.moveTo(p[0],p[1]-26);c.lineTo(p[0]+14,p[1]-22);c.lineTo(p[0],p[1]-17);c.closePath();c.fill();c.stroke()}
function lamp(c,p){c.fillStyle='rgba(255,220,140,.35)';c.beginPath();c.arc(p[0],p[1],7,0,7);c.fill();c.fillStyle='#ffe6a0';c.beginPath();c.arc(p[0],p[1],2.2,0,7);c.fill()}
function junk(c,x,y,r,hh,seed){const cols=['#8a5a3a','#6a6e72','#a0623a','#5a6a7a','#7a7a5a','#9a4a2a','#4a4e52'];let s=seed;const R=()=>{s=(s*9301+49297)%233280;return s/233280};
 const p=V(x,y,0);c.fillStyle='#4a4038';c.strokeStyle=OLC;c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1],r,r*.5,0,0,7);c.fill();
 c.beginPath();c.moveTo(p[0]-r,p[1]);c.quadraticCurveTo(p[0]-r*.4,p[1]-hh*1.1,p[0],p[1]-hh);c.quadraticCurveTo(p[0]+r*.4,p[1]-hh*1.1,p[0]+r,p[1]);c.closePath();c.fill();c.stroke();
 for(let i=0;i<22;i++){const a=R()*2-1,h=R(),px=p[0]+a*r*(1-h*.7),py=p[1]-h*hh*.95+R()*6;c.fillStyle=cols[(R()*cols.length)|0];c.save();c.translate(px,py);c.rotate(R()*3);const w=4+R()*9,hh2=2+R()*5;c.fillRect(-w/2,-hh2/2,w,hh2);c.strokeStyle='rgba(20,14,8,.7)';c.lineWidth=1;c.strokeRect(-w/2,-hh2/2,w,hh2);c.restore()}
 /* ruedas y tubos */for(let i=0;i<3;i++){const px=p[0]+(R()*2-1)*r*.6,py=p[1]-R()*hh*.6;c.fillStyle='#1e1e1c';c.beginPath();c.ellipse(px,py,5,4,0,0,7);c.fill();c.fillStyle='#5a5a56';c.beginPath();c.arc(px,py,1.6,0,7);c.fill()}}
function cubes(c,x,y,n){const cols=['#8a5a3a','#6a6e72','#a0623a','#7a6a5a'];for(let i=0;i<n;i++){const u=x+(i%3)*.42,v=y+((i/3)|0)%2*.42,z=((i/6)|0)*11;vol(c,{x:u,y:v,w:.38,h:.38,z:11,z0:z,col:cols[i%4],mat:'metal',seed:i})}}
function fundicion(c,st){g0(c,0,0,7,6,'#5e564a');if(st>=0)pl(c,[V(.3,.3,1),V(4.7,.3,1),V(4.7,3.7,1),V(.3,3.7,1)],'#8e897e',OLC,1.6);
 junk(c,6,1.1,46,st>=3?40:28,3);junk(c,5.9,3.3,40,st>=3?34:22,9);
 const SH=[0,44,44,48][st];
 /* chimeneas traseras */
 const chH=[0,40,90,110][st];for(const [u,v] of[[1,.8],[2.1,.6]])if(chH){const p=V(u,v,0);cyl(c,p[0],p[1],9,chH,'#7a4a36',{bands:3});if(st===3){const t=V(u,v,chH);c.fillStyle='rgba(255,140,40,.6)';c.beginPath();c.ellipse(t[0],t[1],7,3,0,0,7);c.fill();for(let i=0;i<4;i++){c.fillStyle='rgba(60,56,52,'+(.5-i*.1)+')';c.beginPath();c.arc(t[0]-i*6,t[1]-10-i*12,6+i*3,0,7);c.fill()}}}
 if(st===1){/* esqueleto de acero */for(let u=.5;u<=4.5;u+=1)for(const v of[.5,3.5]){line(c,V(u,v,0),V(u,v,SH),OLC,4);line(c,V(u,v,0),V(u,v,SH),'#7a7e82',2.4)}
  for(const v of[.5,3.5]){line(c,V(.5,v,SH),V(4.5,v,SH),OLC,4);line(c,V(.5,v,SH),V(4.5,v,SH),'#7a7e82',2.4)}for(let u=.5;u<=4.5;u+=1){line(c,V(u,.5,SH),V(u,2,SH+22),'#7a7e82',2.4);line(c,V(u,3.5,SH),V(u,2,SH+22),'#7a7e82',2.4)}
  beams(c,.5,4.3,5);crane(c,5,4.8,130,2.4,[-1,-.6])}
 if(st>=2){const dec=(cc,len,z)=>{cc.fillStyle='rgba(0,0,0,.08)';for(let X=0;X<len;X+=6)cc.fillRect(X,-z,3,z);
   if(st===3){const fw=46,fx=len*.3;cc.fillStyle='#1a120c';cc.fillRect(fx,-34,fw,34);const g=cc.createLinearGradient(0,-34,0,0);g.addColorStop(0,'#ff8a20');g.addColorStop(1,'#ffd060');cc.fillStyle=g;cc.fillRect(fx+4,-26,fw-8,26);cc.fillStyle='rgba(255,150,40,.35)';cc.fillRect(fx-10,-44,fw+20,44)}
   else{cc.fillStyle='#2a221a';cc.fillRect(len*.3,-34,46,34)}
   cc.fillStyle='#c9a23a';cc.fillRect(len*.3-4,-40,54,4)};
  vol(c,{x:.5,y:.5,w:4,h:3,z:SH,col:'#7a7e74',mat:'metal',seed:5,decL:dec,decR:(cc,len,z)=>{cc.fillStyle='rgba(0,0,0,.08)';for(let X=0;X<len;X+=6)cc.fillRect(X,-z,3,z);if(st===3){cc.fillStyle='#ffd060';cc.fillRect(len*.2,-z+8,len*.6,4)}}});
  if(st===3)gableY(c,{x:.5,y:.5,w:4,h:3,z:SH,rh:22,col:'#8a5a3a',wallCol:'#7a7e74',mat:'metal',seed:5});
  else{pl(c,[V(.5,.5,SH),V(4.5,.5,SH),V(4.5,2,SH+22),V(.5,2,SH+22)],'#8a5a3a',OLC,2);scaf(c,.5,.5,4,3,0,SH+16);crane(c,5,4.8,130,2.4,[-1,-.6])}}
 /* cinta transportadora del montón a la nave */
 if(st>=2){const a=V(5.4,2.2,6),b=V(4.5,2.2,30);line(c,a,b,OLC,7);line(c,a,b,'#3a3a36',5);for(let i=0;i<5;i++){const p=mix(a,b,(i+.5)/5);c.fillStyle=['#8a5a3a','#6a6e72','#a0623a'][i%3];c.fillRect(p[0]-3,p[1]-5,6,4)}
  for(const t of[.25,.7]){const p=mix(a,b,t);line(c,[p[0],p[1]+2],[p[0],p[1]+2+(1-t)*22+4],OLC,3)}}
 /* grúa pórtico con electroimán */
 if(st===3){const l1=V(5,0,0),l2=V(7,0,0),t1=V(5,0,78),t2=V(7,0,78),l3=V(5,4.2,0),t3=V(5,4.2,78),l4=V(7,4.2,0),t4=V(7,4.2,78);
  for(const [a,b] of[[l1,t1],[l2,t2]]){line(c,a,b,OLC,5);line(c,a,b,'#d09a20',3)}line(c,t1,t3,OLC,4);line(c,t2,t4,OLC,4);line(c,t1,t3,'#d09a20',2.6);line(c,t2,t4,'#d09a20',2.6);
  const tr=V(6,2.2,78);line(c,V(5,2.2,78),V(7,2.2,78),OLC,6);line(c,V(5,2.2,78),V(7,2.2,78),'#e0b030',4);line(c,tr,[tr[0],tr[1]+40],'#2a2a28',1.4);
  c.fillStyle='#3a3a38';c.strokeStyle=OLC;c.lineWidth=1.6;c.beginPath();c.ellipse(tr[0],tr[1]+44,11,5,0,0,7);c.fill();c.stroke();c.fillStyle='rgba(120,180,255,.5)';c.beginPath();c.ellipse(tr[0],tr[1]+47,10,3,0,0,7);c.fill();
  /* coche colgando */c.fillStyle='#7a3a2a';c.strokeStyle=OLC;c.lineWidth=1.4;c.beginPath();c.moveTo(tr[0]-14,tr[1]+58);c.lineTo(tr[0]-10,tr[1]+50);c.lineTo(tr[0]+8,tr[1]+50);c.lineTo(tr[0]+14,tr[1]+56);c.lineTo(tr[0]+14,tr[1]+62);c.lineTo(tr[0]-14,tr[1]+62);c.closePath();c.fill();c.stroke();c.fillStyle='#6a8a9a';c.fillRect(tr[0]-7,tr[1]+52,12,4);
  for(const [a,b] of[[l3,t3],[l4,t4]]){line(c,a,b,OLC,5);line(c,a,b,'#d09a20',3)}}
 /* cubos prensados y lingotes */
 if(st>=1)cubes(c,.6,4.3,st>=3?12:4);
 if(st===3){for(let i=0;i<4;i++)vol(c,{x:2.4,y:4.4+i*.18,w:1.3,h:.16,z:5,z0:(i%2)*5,col:'#b8c0c8',mat:'metal',seed:i});for(let i=0;i<3;i++)vol(c,{x:2.5,y:4.45+i*.22,w:1.1,h:.18,z:5,z0:10,col:'#c8d0d8',mat:'metal',seed:i+4});lamp(c,V(.6,3.7,40));lamp(c,V(4.4,3.7,40))}
 if(st===0){beams(c,1,1,5);blocks(c,2.8,1.4);crate(c,1,3,0,.4)}}
/* ================= 2b. TALLER DE BLINDAJE con camioneta (5×4) ================= */
function wheel(c,p,r){c.fillStyle='#1e1e1c';c.strokeStyle=OLC;c.lineWidth=1.8;c.beginPath();c.ellipse(p[0],p[1],r,r*.92,0,0,7);c.fill();c.stroke();c.strokeStyle='#3a3a36';c.lineWidth=1.4;for(let a=0;a<6;a++){c.beginPath();c.moveTo(p[0]+Math.cos(a)*r*.75,p[1]+Math.sin(a)*r*.7);c.lineTo(p[0]+Math.cos(a)*r*.95,p[1]+Math.sin(a)*r*.9);c.stroke()}c.fillStyle='#6a6a64';c.beginPath();c.arc(p[0],p[1],r*.38,0,7);c.fill();c.fillStyle='#2a2a28';c.beginPath();c.arc(p[0],p[1],r*.14,0,7);c.fill()}
function truck(c,st,X0,Y0){const Y1=Y0+1,BAR='#7a7e82',body=st>=3?'#56603f':st>=2?'#9a9e9c':'#a0603a',bodyD=st>=3?'#3e4630':st>=2?'#6e7270':'#7a4428',z0=12,R=st>=3?11.5:10.5;
 const tyre=(u,v,r)=>{const p=V(u,v,r-1);wheel(c,p,r);if(st>=3){c.strokeStyle='#4a4a46';c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1],r-1.5,r*.92-1.5,0,0,7);c.stroke()}};
 if(st===0){for(const u of[X0+.3,X0+2.3])vol(c,{x:u,y:Y0+.2,w:.35,h:.6,z:9,col:'#8a7a60',mat:'plank',seed:3});vol(c,{x:X0,y:Y0+.15,w:3,h:.7,z:4,z0:9,col:'#2e2e2c',mat:'metal',seed:1});
  tyre(X0+.3,Y1+.75,10);tyre(X0+.95,Y1+.85,10);vol(c,{x:X0+2.2,y:Y1+.4,w:.6,h:.5,z:12,col:'#5a5a56',mat:'metal',seed:4});beams(c,X0+3.3,Y0+1.2,3);return}
 /* ruedas del lado lejano */tyre(X0+.55,Y0+.1,R);tyre(X0+2.4,Y0+.1,R);
 /* chasis */vol(c,{x:X0+.05,y:Y0+.12,w:3.05,h:.76,z:5,z0:z0-5,col:'#2a2a28',mat:'metal',seed:1});
 /* caja abierta: laterales bajos y fondo oscuro */
 const BZ=st>=3?13:9;vol(c,{x:X0,y:Y0,w:1.5,h:1,z:BZ,z0,col:body,mat:'metal',seed:2,topCol:'#2a2620',decL:(cc,len,z)=>{cc.fillStyle=bodyD;cc.fillRect(0,-z,len,2.5);if(st>=3){cc.strokeStyle='rgba(20,20,10,.55)';cc.lineWidth=1;for(let X=10;X<len;X+=10){cc.beginPath();cc.moveTo(X,-z);cc.lineTo(X,0);cc.stroke()}cc.fillStyle='rgba(230,220,180,.6)';for(let X=4;X<len;X+=6)cc.fillRect(X,-z+3.5,1.2,1.2)}}});
 if(st>=1){const a=V(X0+.12,Y0+.12,z0+BZ),b=V(X0+1.38,Y0+.12,z0+BZ),d=V(X0+1.38,Y1-.12,z0+BZ),e=V(X0+.12,Y1-.12,z0+BZ);pl(c,[a,b,d,e],'#221e18')}
 /* cabina con parabrisas inclinado */
 const CZ=21,cx0=X0+1.5,cx1=X0+2.35;vol(c,{x:cx0,y:Y0,w:cx1-cx0,h:1,z:CZ,z0,col:body,mat:'metal',seed:3,decL:(cc,len,z)=>{cc.fillStyle=bodyD;cc.fillRect(0,-z*.48,len,1.6);
   if(st>=3){cc.fillStyle='#14181a';cc.fillRect(len*.14,-z+3,len*.72,6);cc.strokeStyle='#9a9e96';cc.lineWidth=.7;for(let X=len*.14;X<len*.86;X+=2.6){cc.beginPath();cc.moveTo(X,-z+3);cc.lineTo(X,-z+9);cc.stroke()}cc.fillStyle='rgba(230,220,180,.6)';for(let X=3;X<len;X+=6){cc.fillRect(X,-z*.4,1.2,1.2);cc.fillRect(X,-3,1.2,1.2)}}
   else{cc.fillStyle='#7aa0b4';cc.fillRect(len*.12,-z+3,len*.76,8);cc.fillStyle='rgba(255,255,255,.35)';cc.fillRect(len*.18,-z+4,3,6);cc.strokeStyle=OLC;cc.lineWidth=1;cc.strokeRect(len*.12,-z+3,len*.76,8);cc.fillStyle='#2a2a28';cc.fillRect(len*.7,-z*.38,4,1.6)}}});
 const w1=V(cx1,Y0+.05,z0+CZ),w2=V(cx1,Y1-.05,z0+CZ),w3=V(cx1+.28,Y1-.05,z0+12),w4=V(cx1+.28,Y0+.05,z0+12);pl(c,[w1,w2,w3,w4],st>=3?'#14181a':'#6a90a4',OLC,1.6);
 if(st>=3){c.strokeStyle='#9a9e96';c.lineWidth=.8;for(let t=.1;t<1;t+=.12){const a=mix(w1,w2,t),b=mix(w4,w3,t);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}}else{const a=mix(w1,w4,.2),b=mix(w2,w3,.2);line(c,a,b,'rgba(255,255,255,.4)',2)}
 /* capó y calandra */
 vol(c,{x:cx1,y:Y0+.04,w:.75,h:.92,z:12,z0,col:body,mat:'metal',seed:4,decR:(cc,len,z)=>{cc.fillStyle='#1a1a18';cc.fillRect(len*.22,-z+2.5,len*.56,z-5);cc.fillStyle='#8a8e90';for(let X=len*.24;X<len*.76;X+=3)cc.fillRect(X,-z+3,1.2,z-6);cc.fillStyle=st>=2?'#ffe6a0':'#d8d0b0';cc.beginPath();cc.arc(len*.1,-z*.55,2.6,0,7);cc.arc(len*.9,-z*.55,2.6,0,7);cc.fill()}});
 /* pasos de rueda y ruedas del lado cercano */
 for(const u of[X0+.55,X0+2.4]){const p=V(u,Y1,z0+3);c.fillStyle=bodyD;c.strokeStyle=OLC;c.lineWidth=1.6;c.beginPath();c.ellipse(p[0],p[1]+4,R+3,R*.75,0,Math.PI,0);c.fill();c.stroke()}
 tyre(X0+.55,Y1,R);tyre(X0+2.4,Y1,R);
 if(st>=3){/* faldón con pinchos */for(let i=0;i<6;i++){const p=V(X0+.15+i*.5,Y1,z0+1);line(c,p,[p[0]-5,p[1]+5],OLC,2.4);line(c,p,[p[0]-5,p[1]+5],'#d0d4d6',1)}
  /* defensa con pinchos */const xf=cx1+.95,a=V(xf,Y0-.05,z0-3),b=V(xf,Y1+.05,z0-3),a2=V(xf,Y0-.05,z0+10),b2=V(xf,Y1+.05,z0+10);
  for(const [p,q] of[[a,b],[a2,b2],[a,a2],[b,b2],[mix(a,b,.5),mix(a2,b2,.5)]]){line(c,p,q,OLC,4.4);line(c,p,q,BAR,2.6)}
  for(let i=0;i<5;i++){const p=mix(a2,b2,i/4);line(c,p,[p[0]+10,p[1]+3],OLC,2.8);line(c,p,[p[0]+10,p[1]+3],'#e0e4e6',1.2)}
  /* baca con rueda de repuesto */const r=[V(cx0+.05,Y0+.1,z0+CZ+3),V(cx1-.05,Y0+.1,z0+CZ+3),V(cx1-.05,Y1-.1,z0+CZ+3),V(cx0+.05,Y1-.1,z0+CZ+3)];pl(c,r,null,'#2a2a28',2.4);
  const tp=V((cx0+cx1)/2,Y0+.5,z0+CZ+6);c.fillStyle='#1e1e1c';c.strokeStyle=OLC;c.lineWidth=1.6;c.beginPath();c.ellipse(tp[0],tp[1],10,5,0,0,7);c.fill();c.stroke();c.fillStyle='#5a5a56';c.beginPath();c.ellipse(tp[0],tp[1],3.6,1.8,0,0,7);c.fill();
  /* bidones y ametralladora en la caja */
  vol(c,{x:X0+.12,y:Y0+.15,w:.24,h:.32,z:10,z0:z0+BZ-6,col:'#9a2a1e',mat:'metal',seed:5});vol(c,{x:X0+.12,y:Y0+.52,w:.24,h:.32,z:10,z0:z0+BZ-6,col:'#5a6a3a',mat:'metal',seed:6});
  const m=V(X0+.95,Y0+.5,z0+BZ-2);line(c,m,[m[0],m[1]-14],OLC,3.6);line(c,m,[m[0],m[1]-14],'#3a3a36',2);
  pl(c,[[m[0]+1,m[1]-25],[m[0]+11,m[1]-20],[m[0]+11,m[1]-9],[m[0]+1,m[1]-14]],'#56603f',OLC,1.6);line(c,[m[0]+3,m[1]-17],[m[0]+28,m[1]-12],OLC,4.6);line(c,[m[0]+3,m[1]-17],[m[0]+28,m[1]-12],'#2a2a28',2.8);
  c.fillStyle='#c9a23a';for(let k=0;k<4;k++)c.fillRect(m[0]-4-k*2,m[1]-10+k*1.4,1.6,3);
  /* escape alto */const sn=V(cx1-.05,Y1-.02,z0+4);line(c,sn,[sn[0],sn[1]-30],OLC,4.4);line(c,sn,[sn[0],sn[1]-30],'#5a5a56',2.6);
  /* barro y franja */c.fillStyle='rgba(90,70,40,.45)';for(const u of[X0+.55,X0+2.4]){const p=V(u,Y1,z0+8);c.beginPath();c.ellipse(p[0]-10,p[1]-2,8,3,0,0,7);c.fill()}
}
 else if(st===2){const p=V(X0+1.2,Y1+.45,0);c.fillStyle='rgba(255,230,120,.85)';c.beginPath();c.arc(p[0]+8,p[1]-16,3.4,0,7);c.fill();for(let i=0;i<7;i++){c.fillStyle='#ffd060';c.fillRect(p[0]+8+Math.cos(i)*7,p[1]-16+Math.sin(i)*6,1.6,1.6)}
  vol(c,{x:X0+3.3,y:Y0+1.2,w:.5,h:.08,z:12,col:'#56603f',mat:'metal',seed:2});vol(c,{x:X0+3.3,y:Y0+1.35,w:.5,h:.08,z:12,col:'#56603f',mat:'metal',seed:3})}
 else{vol(c,{x:X0+3.2,y:Y0+1.2,w:.5,h:.4,z:10,col:'#5a5a56',mat:'metal',seed:4})}}
function taller(c,st){g0(c,0,0,5,4,'#6e6454');pl(c,[V(0,0,1),V(5,0,1),V(5,4,1),V(0,4,1)],'#8e897e',OLC,1.6);
 const H=[0,22,40,40][st];
 /* nave del taller al fondo */
 if(st>=1){vol(c,{x:0,y:0,w:3.4,h:2,z:H,col:st>=3?'#6a6e64':'#7a7e74',mat:'metal',seed:4,decL:(cc,len,z)=>{cc.fillStyle='rgba(0,0,0,.08)';for(let X=0;X<len;X+=6)cc.fillRect(X,-z,3,z);if(st>=2){cc.fillStyle='#2a2620';cc.fillRect(len*.12,-30,len*.46,30);cc.fillStyle='#8a8e90';for(let Y=-30;Y<-14;Y+=3){cc.fillRect(len*.12,Y,len*.46,2)}if(st>=3){cc.fillStyle='#c9a23a';cc.fillRect(len*.66,-z+6,len*.28,10);cc.fillStyle='#2a1a10';cc.font='bold 7px sans-serif';cc.fillText('TALLER',len*.67,-z+14)}}},
   decR:(cc,len,z)=>{cc.fillStyle='rgba(0,0,0,.08)';for(let X=0;X<len;X+=6)cc.fillRect(X,-z,3,z)}});
  if(st>=2)gableX(c,{x:0,y:0,w:3.4,h:2,z:H,rh:14,col:'#7a5a40',wallCol:st>=3?'#6a6e64':'#7a7e74',mat:'metal',seed:4});
  if(st<3)scaf(c,0,0,3.4,2,0,H+12);
  if(st>=3){lamp(c,V(.3,2,34));lamp(c,V(3.3,2,34))}}
 /* grúa de taller / polipasto */
 if(st===1||st===2){const a=V(3.6,1.8,0),b=V(3.6,1.8,46),e=V(4.4,2.6,46);line(c,a,b,OLC,4);line(c,a,b,'#c08a20',2.4);line(c,b,e,OLC,4);line(c,b,e,'#c08a20',2.4);line(c,e,[e[0],e[1]+18],'#2a2a28',1.2);vol(c,{x:4.2,y:2.5,w:.4,h:.4,z:8,z0:0,col:'#5a5a56',mat:'metal',seed:2})}
 /* neumáticos apilados y bidones */
 for(let i=0;i<3;i++){const p=V(4.5,.5,i*5);c.fillStyle='#1e1e1c';c.strokeStyle=OLC;c.lineWidth=1.4;c.beginPath();c.ellipse(p[0],p[1]-3,10,5,0,0,7);c.fill();c.stroke();c.fillStyle='#3a3a36';c.beginPath();c.ellipse(p[0],p[1]-4,4,2,0,0,7);c.fill()}
 if(st>=1){vol(c,{x:4,y:1.1,w:.25,h:.25,z:12,col:'#9a2a1e',mat:'metal',seed:1});vol(c,{x:4.35,y:1.15,w:.25,h:.25,z:12,col:'#5a6a3a',mat:'metal',seed:2})}
 truck(c,st,.9,2.75)}
/* ---- arte ---- */
const SPR={blindaje:taller,gdesg:fundicion};
for(const k in SPR)NB[k]={up:180,paint(c,b){const st=b.id===undefined?3:b.st!==undefined?b.st:(b.cl|0);SPR[k](c,Math.min(3,st))},live(c,b,H){try{const st=b.st|0;
  if(k==='gdesg'&&st>=3){for(const [u,v] of[[1,.8],[2.1,.6]]){const p=H.L(u,v,112);if(typeof smoke==='function')smoke(c,p)}const p=H.L(1.8,3.5,14),f=.6+.4*Math.sin(T*7);c.fillStyle='rgba(255,150,40,'+(.25*f)+')';c.beginPath();c.ellipse(p[0],p[1],26,12,0,0,7);c.fill()}
  if(st<3&&nW(b)>0&&Math.sin(T*9+b.id)>.3){const p=k==='blindaje'?H.L(2,3.9,14):H.L(2.5,3.6,30);c.fillStyle='#fff0a0';c.beginPath();c.arc(p[0]+Math.sin(T*23)*3,p[1],2.4,0,7);c.fill();for(let i=0;i<4;i++){c.fillStyle='#ffd060';c.fillRect(p[0]+Math.cos(T*31+i*1.7)*7,p[1]+Math.sin(T*29+i)*5,1.6,1.6)}}}catch(e){}}};
/* ---- solo una de cada; no se mejoran de nivel ---- */
const oPick=window.pickB;window.pickB=function(t){if(OB[t]&&S.bld.some(b=>b.type===t))return toast('Solo puedes tener un '+OB[t].n.toLowerCase()+'.');return oPick.apply(this,arguments)};try{pickB=window.pickB}catch(e){}
const oUpg=window.upg;window.upg=function(id){const b=bm[id];if(isO(b))return toast('Las grandes obras no tienen niveles: se construyen por etapas.');return oUpg.apply(this,arguments)};try{upg=window.upg}catch(e){}
/* ---- no se destruyen: pierden avance ---- */
const oKill=window.killB;window.killB=function(b){if(isO(b)&&S.bld.includes(b)){init(b);b.hp=Math.max(1,mxhp(b)*.15);if(b.st<3){b.sp=Math.max(0,(b.sp||0)-.25)}try{toast('🏗 '+BT[b.type].n+' dañado'+(b.st<3?': la obra pierde avance.':'.'))}catch(e){}return}return oKill.apply(this,arguments)};try{killB=window.killB}catch(e){}
/* ---- producción del gran desguace ---- */
const oOut=window.out;window.out=function(b){if(b&&b.type==='gdesg'){init(b);if(b.st<3||b.pause)return{};return{scrap:60+20*Math.min(3,nW(b))}}if(b&&b.type==='blindaje')return{};return oOut.apply(this,arguments)};try{out=window.out}catch(e){}
/* ---- avance de las obras ---- */
const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{if(!S||!S.bld)return r;
  S.bld.forEach(b=>{if(!isO(b))return;init(b);if(b.st>=3||b.need||b.pause)return;const n=Math.min(3,nW(b));if(!n)return;
   b.sp+=dt*n/1800*(S.mode==='creativo'?20:1);if(b.sp>=1){b.sp=0;b.st++;b.cl=b.st;
    if(b.st>=3){const d=BT[b.type];try{toast('🏗 ¡'+d.n+' terminado! '+d.fx)}catch(e){}try{notify('🏗',d.n+' terminado',d.fx,'pueblo')}catch(e){}try{window.diarioAdd&&diarioAdd('🏗','Gran obra terminada: '+d.n+'.','pueblo')}catch(e){}try{sfx('build')}catch(e){}}
    else{b.need=1;try{toast('🏗 '+BT[b.type].n+': etapa '+b.st+' de 3 lista. Paga la siguiente para seguir.')}catch(e){}}
    try{save()}catch(e){}}});
  /* camioneta: viaje en la mitad de tiempo */
  const e=S.exp;if(e&&e.travel&&!e.travel.done&&!e.travel.gh&&done('blindaje')){e.travel.gh=1;e.travel.t*=.5;e.travel.total*=.5}}catch(e){}return r};
try{upd=window.upd}catch(e){}
/* ---- camioneta: más botín y menos heridos ---- */
const oEnd=window.exEnd;if(typeof oEnd==='function'){window.exEnd=function(){const on=done('blindaje'),e=S.exp,team=e?e.team.slice():[];
  try{if(on&&e&&e.loot&&!e.gl){e.gl=1;for(const k in e.loot)if(e.loot[k]>0)e.loot[k]*=1.2}}catch(er){}
  const r=oEnd.apply(this,arguments);
  try{if(on)team.forEach(i=>{const p=byId(i);if(!p||p.hp<=0)return;p.injury=(p.injury||0)*.6;const mx=mhp(p);if(p.hp<mx)p.hp+=(mx-p.hp)*.4})}catch(er){}return r};try{exEnd=window.exEnd}catch(e){}}
/* ---- panel ---- */
window.obraPay=function(id){const b=bm[id];if(!isO(b)||!b.need)return;const d=BT[b.type],c=costOf(d.stg[b.st-1]||{});if(!can(c))return toast('Faltan materiales: '+cs(c));pay(c);b.need=0;try{sfx('build')}catch(e){}try{save()}catch(e){}toast('🏗 Etapa '+(b.st+1)+' de 3 en marcha.');window.bPanel(id)};
const ic=o=>Object.keys(o).map(k=>`<span class="bch${(S.res[k]||0)<o[k]?' bnop':''}"><img src="${ICO[k]||''}" width=12>${o[k]}</span>`).join(' ');
const oB=window.bPanel;window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id];if(!isO(b))return r;init(b);const d=BT[b.type],pan=document.getElementById('pan');if(!pan)return r;
  const u=pan.querySelector('.bp2u');if(u)u.outerHTML='<div class="bp2u max">🏗 Gran obra: se construye por etapas</div>';
  [...pan.querySelectorAll('.bp2l')].forEach(x=>x.innerHTML=b.st>=3?'Gran obra terminada':'Gran obra · etapa '+(b.st+1)+' <small>/ 3</small>');[...pan.querySelectorAll('.bp2h .bp2p')].forEach(x=>x.style.display='none');
  const n=Math.min(3,nW(b));let h='<div class="ob-sec" style="margin:8px 0;padding:8px;border:1px solid #6a5a3a;border-radius:8px;background:rgba(40,30,16,.5)">';
  h+='<div style="display:flex;gap:4px;margin-bottom:6px">'+ST.map((s,i)=>`<span style="flex:1;text-align:center;font-size:11px;padding:3px 0;border-radius:5px;background:${i<b.st?'#4a6a3a':i===b.st?'#8a6a2a':'#2a2a26'};color:#f0e8d0">${i<b.st||b.st>=3?'✔ ':''}${s}</span>`).join('')+'</div>';
  if(b.st>=3)h+=`<p style="margin:4px 0">✔ <b>Terminada.</b> ${d.fx}</p>`+(b.type==='gdesg'?`<p style="margin:4px 0">Ahora: <b>+${60+20*n}</b> de chatarra al día (${n} de 3 trabajadores).</p>`:'');
  else if(b.need){const c=costOf(d.stg[b.st-1]||{});h+=`<p style="margin:4px 0">Etapa ${b.st} de 3 lista. Para empezar <b>${ST[b.st]}</b> hace falta:</p><p>${ic(c)}</p><button class="btn" onclick="obraPay(${id})"${can(c)?'':' disabled'}>🏗 Empezar ${ST[b.st].toLowerCase()}</button>`}
  else{const pc=Math.floor(b.sp*100),dias=n?((1-b.sp)*1800/n/600):0;h+=`<p style="margin:4px 0"><b>${ST[b.st]}</b> · ${pc} %</p><div class="bbar"><i style="width:${pc}%;background:#d9a441"></i></div><p style="margin:4px 0">${n?'Con '+n+' trabajador'+(n>1?'es':'')+': falta'+(dias>1.05?'n unos '+dias.toFixed(1).replace('.',',')+' días':' menos de un día')+'.':'⚠ Asigna trabajadores para que avance (con 3, un día por etapa).'}</p>`}
  if(b.st<3)h+=`<p style="margin:4px 0;opacity:.85"><small>Al terminar: ${d.fx}</small></p>`;
  h+='</div>';const hd=pan.querySelector('.bp2h');const dv=document.createElement('div');dv.innerHTML=h;if(hd&&hd.parentNode)hd.parentNode.insertBefore(dv.firstElementChild,hd.nextSibling);else pan.insertAdjacentHTML('afterbegin',h)}catch(e){}return r};
})();
