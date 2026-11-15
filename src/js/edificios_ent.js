/* Aspecto propio de cada edificio de formación (2x2): cada oficio tiene su escuela reconocible. */
(function(){
'use strict';
if(!window.NB||!window.NBK)return;
const K=NBK,{V,vol,wnd,dor,sign,patch,gableX,flatRoof,hip,cyl,crate,sacks,post,line,ac,OLC}=K;
const slab=(c,col)=>vol(c,{x:-.08,y:-.08,w:2.16,h:2.16,z:2,col:col||'#85817a',mat:'block',seed:2});
const sm=(c,p)=>{if(typeof smoke==='function')smoke(c,p)};
const disc=(c,p,r,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(p[0],p[1],r,r*.8,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()};
const flag=(c,x,y,hgt,col)=>{post(c,x,y,2,hgt,'#6b6458');const p=V(x,y,2);c.fillStyle=col;c.beginPath();c.moveTo(p[0]+1.8,p[1]-hgt);c.lineTo(p[0]+15,p[1]-hgt+3.5);c.lineTo(p[0]+1.8,p[1]-hgt+9);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()};
const lvx=(c,b,col)=>{if((b.lvl||1)>=2)flag(c,1.85,1.85,34,col);};
const def=(k,o)=>{NB['tr_'+k]=Object.assign({up:90},o);try{delete SIGNT['tr_'+k]}catch(e){}};

def('Médico',{paint(c,b){const cl=b.cl||0;slab(c,'#a7aeb0');
 vol(c,{x:0,y:0,w:2,h:2,z:24,z0:2,col:'#e2eaec',mat:'plaster',seed:cl+1,
  decL:(c,len)=>{c.fillStyle='rgba(120,150,170,.25)';c.fillRect(0,-9,len,1.5);wnd(c,8,-19,9,8,{lit:true,frame:'#f4f4ee'});wnd(c,len-17,-19,9,8,{frame:'#f4f4ee'});dor(c,len/2-6,-12,12,12,{col:'#dfeaea',awning:'#c4382e'});sign(c,len/2-14,-23,28,7,'AULA','#f4f4ee','#b3261e')},
  decR:(c,len)=>{wnd(c,8,-17,9,8,{lit:true,frame:'#f4f4ee'});wnd(c,len-17,-17,9,8,{lit:true,frame:'#f4f4ee'});c.fillStyle='#f6f6f0';c.fillRect(len/2-6,-21,12,12);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(len/2-6,-21,12,12);c.fillStyle='#d0352e';c.fillRect(len/2-1.8,-19.5,3.6,9);c.fillRect(len/2-4.5,-16.8,9,3.6)}});
 flatRoof(c,{x:0,y:0,w:2,h:2,z:26,col:'#c4c9c9',pcol:'#e2eaec',t:.16,ph:3},()=>{ac(c,.35,.4,26)});
 crate(c,1.7,2.2,0,.3,'#e6ecec');lvx(c,b,'#c4382e')}});

def('Soldado',{paint(c,b){const cl=b.cl||0;slab(c,'#7d7a62');
 vol(c,{x:.08,y:.08,w:.9,h:.9,z:22,z0:2,col:'#6b7a48',mat:'block',seed:cl+3,decL:(c,len)=>{dor(c,len/2-5,-12,10,12,{col:'#4a5539'});sign(c,3,-19,len-6,6,'TIRO','#d6c97a','#3a3a20')},decR:(c,len)=>{wnd(c,len/2-4,-16,8,7,{lit:true})}});
 hip(c,{x:.08,y:.08,w:.9,h:.9,z:24,rh:6,col:'#4a5539',oh:.1});
 for(const u of[1.25,1.7]){post(c,u,.3,2,22,'#7a5a3a');const p=V(u,.3,2);disc(c,[p[0],p[1]-26],7,'#f2f0e6');disc(c,[p[0],p[1]-26],4.6,'#c0392b');disc(c,[p[0],p[1]-26],2,'#f2f0e6')}
 sacks(c,.2,1.75,7,0);sacks(c,.35,1.95,6,0);
 crate(c,1.75,1.1,0,.28,'#6b7a48');lvx(c,b,'#e8d26a')}});

def('Constructor',{paint(c,b){const cl=b.cl||0;slab(c,'#8f866a');
 vol(c,{x:.1,y:1.2,w:1.8,h:.28,z:14,z0:2,col:'#b5603f',mat:'brick',seed:cl+2});
 vol(c,{x:.1,y:.9,w:.28,h:.58,z:24,z0:2,col:'#b5603f',mat:'brick',seed:cl+5});
 vol(c,{x:1.62,y:.9,w:.28,h:.58,z:18,z0:2,col:'#b5603f',mat:'brick',seed:cl+6});
 for(const u of[.5,.9,1.3])post(c,u,1.3,14,14,'#7a5a3c');
 vol(c,{x:.1,y:1.3,w:1.8,h:.1,z:2,z0:28,col:'#a9824f',mat:'plank',seed:4});
 vol(c,{x:.1,y:.1,w:.9,h:.7,z:22,z0:2,col:'#c7a24a',mat:'plank',seed:7,decL:(c,len)=>{sign(c,2,-15,len-4,6,'OBRAS','#2c2c2c','#f2c230')},decR:(c,len)=>{dor(c,len/2-4,-11,8,11,{col:'#5b4228'})}});
 gableX(c,{x:.1,y:.1,w:.9,h:.7,z:22,rh:6,col:'#7a5a32',wallCol:'#c7a24a',mat:'plank',seed:3,oh:.1,rows:5});
 post(c,1.7,.35,2,52,'#c9a23a');line(c,V(1.7,.35,54),V(1.0,.35,54),'#c9a23a',2.4);line(c,V(1.1,.35,54),V(1.1,.35,40),'#555',1);
 crate(c,1.5,1.7,0,.3,'#b5603f');crate(c,1.1,1.8,0,.26,'#a9824f');lvx(c,b,'#f2c230')}});

def('Agricultor',{paint(c,b){const cl=b.cl||0;slab(c,'#7a6a48');
 vol(c,{x:0,y:0,w:2,h:.9,z:20,z0:2,col:'#a84a3a',mat:'plank',seed:cl+2,decL:(c,len)=>{dor(c,len/2-6,-13,12,13,{col:'#6a3a2e'});sign(c,len/2-14,-20,28,6,'HUERTO','#e8d9a4','#3a5a1c')},decR:(c,len)=>{wnd(c,len/2-4,-14,8,8,{lit:true})}});
 gableX(c,{x:0,y:0,w:2,h:.9,z:22,rh:8,col:'#6a3a2e',wallCol:'#a84a3a',mat:'plank',seed:cl+4,oh:.12,rows:6});
 vol(c,{x:.05,y:1.0,w:1.9,h:.95,z:4,z0:2,col:'#5b3d26',mat:'plaster',seed:9});
 for(let i=0;i<5;i++)vol(c,{x:.14+i*.37,y:1.08,w:.2,h:.8,z:8,z0:4,col:i%2?'#5f9a3c':'#78b04a',mat:'plaster',seed:i+11});
 sacks(c,1.35,.95,3,0);lvx(c,b,'#7da05a')}});

def('Cocinero',{paint(c,b){const cl=b.cl||0;slab(c,'#85796a');
 vol(c,{x:0,y:0,w:2,h:2,z:20,z0:2,col:'#b8714a',mat:'brick',seed:cl+5,
  decL:(c,len)=>{wnd(c,7,-15,9,8,{lit:true});dor(c,len-19,-12,12,12,{col:'#5b4228'});c.fillStyle='#d8503a';c.fillRect(4,-21,len/2,3);c.fillStyle='#f4e9d0';for(let i=0;i<5;i++)c.fillRect(4+i*(len/10)*2,-21,len/10,3);sign(c,len/2-14,-30,28,6,'COCINA','#f0d890','#6a2e1c')},
  decR:(c,len)=>{wnd(c,8,-14,9,8,{lit:true});wnd(c,len-17,-14,9,8,{lit:true})}});
 gableX(c,{x:0,y:0,w:2,h:2,z:22,rh:7,col:'#6a5a4a',wallCol:'#b8714a',mat:'brick',seed:cl+6,oh:.14,rows:6});
 vol(c,{x:1.4,y:.25,w:.3,h:.3,z:42,z0:22,col:'#8a5a3c',mat:'brick',seed:2});
 {const p=V(.3,2.2,2);cyl(c,p[0],p[1],5.2,10,'#7a8a50',{bands:2})}crate(c,1.1,2.2,0,.3,'#d9b06a');lvx(c,b,'#d8503a')},
 live(c,b,H){sm(c,H.L(1.55,.4,44))}});

def('Explorador',{paint(c,b){const cl=b.cl||0;slab(c,'#6f7a5a');
 vol(c,{x:.1,y:.1,w:1.3,h:1.2,z:8,z0:2,col:'#4f6f92',mat:'plaster',seed:cl+1});
 gableX(c,{x:.1,y:.1,w:1.3,h:1.2,z:8,rh:18,col:'#5a82aa',wallCol:'#4f6f92',mat:'plaster',seed:cl+2,oh:.06,rows:6});
 post(c,1.65,.3,2,34,'#6a4b2e');{const p=V(1.65,.3,2);sign(c,p[0]-11,p[1]-48,22,13,'RUTA','#e8d9a4','#6a2e1c')}
 {const p=V(1.45,1.5,2);for(let i=0;i<5;i++){const a=i*1.26;c.fillStyle='#8a8478';c.beginPath();c.ellipse(p[0]+Math.cos(a)*6,p[1]+Math.sin(a)*3,2.4,1.8,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke()}}
 sacks(c,.2,1.65,3,0);crate(c,.9,1.75,0,.28,'#9a7a4a');lvx(c,b,'#e8d26a')},
 live(c,b,H){const p=H.L(1.45,1.5,5),f=Math.sin(T*9)*1.5;c.fillStyle='#f39a2a';c.beginPath();c.moveTo(p[0]-3,p[1]);c.quadraticCurveTo(p[0]-2,p[1]-7+f,p[0],p[1]-10+f);c.quadraticCurveTo(p[0]+2,p[1]-6,p[0]+3,p[1]);c.closePath();c.fill();c.fillStyle='#ffe28a';c.beginPath();c.ellipse(p[0],p[1]-3,1.5,3,0,0,7);c.fill()}});

def('Mecánico',{paint(c,b){const cl=b.cl||0;slab(c,'#6f7378');
 vol(c,{x:0,y:0,w:2,h:1.6,z:22,z0:2,col:'#8a8f96',mat:'metal',seed:cl+2,
  decL:(c,len)=>{c.fillStyle='#5d646b';c.fillRect(6,-16,len-12,14);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(6,-16,len-12,14);c.strokeStyle='rgba(0,0,0,.3)';for(let i=1;i<5;i++){c.beginPath();c.moveTo(6,-16+i*2.8);c.lineTo(len-6,-16+i*2.8);c.stroke()}sign(c,len/2-15,-24,30,6,'TALLER','#e07a2a','#2a1a11')},
  decR:(c,len)=>{wnd(c,len/2-5,-15,10,8,{lit:true})}});
 gableX(c,{x:0,y:0,w:2,h:1.6,z:24,rh:5,col:'#555b62',wallCol:'#8a8f96',mat:'metal',seed:cl+4,oh:.12,rows:5});
 for(let i=0;i<3;i++){const p=V(.25,1.9,2+i*5);cyl(c,p[0],p[1],5.6,5,'#2e2e2e',{})}
 {const p=V(1.5,1.9,2);cyl(c,p[0],p[1],5,11,'#a04a3a',{bands:2})}crate(c,1.7,1.7,0,.26,'#6f7378');lvx(c,b,'#e07a2a')}});

def('Recolector',{paint(c,b){const cl=b.cl||0;slab(c,'#8a7a52');
 vol(c,{x:.05,y:.05,w:1.9,h:.5,z:12,z0:2,col:'#7a5a32',mat:'plank',seed:cl+1,decL:(c,len)=>{sign(c,len/2-18,-11,36,6,'RECOLECTA','#d6c78a','#3a2a16')}});
 for(const[u,v]of[[.08,.08],[1.88,.08],[.08,1.2],[1.88,1.2]])post(c,u,v,2,30,'#6a4b2e');

 hip(c,{x:0,y:0,w:2,h:1.35,z:31,rh:7,col:'#7a5a32',oh:.1});
 vol(c,{x:.15,y:.7,w:1.7,h:.4,z:10,z0:2,col:'#8a6a3a',mat:'plank',seed:5});
 sacks(c,.25,.85,6,10);sacks(c,.3,1.7,3,0);sacks(c,1.2,1.85,3,0);crate(c,.15,1.5,0,.3,'#b98a4e');crate(c,1.65,1.55,0,.28,'#9a7444');lvx(c,b,'#7da05a')}});

def('Científico',{paint(c,b){const cl=b.cl||0;slab(c,'#8a9496');
 vol(c,{x:0,y:0,w:2,h:2,z:26,z0:2,col:'#cfe3e0',mat:'plaster',seed:cl+1,
  decL:(c,len)=>{wnd(c,7,-20,10,9,{lit:true,frame:'#eef6f4'});wnd(c,len-17,-20,10,9,{lit:true,frame:'#eef6f4'});dor(c,len/2-6,-12,12,12,{col:'#7fb8b0'});sign(c,len/2-14,-23,28,6,'LAB','#2f7f78','#e6fffb')},
  decR:(c,len)=>{wnd(c,7,-19,10,9,{lit:true,frame:'#eef6f4'});wnd(c,len/2-5,-19,10,9,{frame:'#eef6f4'});wnd(c,len-17,-19,10,9,{lit:true,frame:'#eef6f4'});c.fillStyle='rgba(47,127,120,.35)';c.fillRect(0,-9,len,2)}});
 flatRoof(c,{x:0,y:0,w:2,h:2,z:28,col:'#9fb8b6',pcol:'#cfe3e0',t:.16,ph:3},()=>{
  {const p=V(1.3,1.2,28);c.fillStyle='#e8eef0';c.beginPath();c.ellipse(p[0],p[1]-9,10,6,-.4,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.3;c.stroke();line(c,[p[0],p[1]-9],[p[0]+3,p[1]-3],'#6a7a80',1.6)}
  ac(c,.35,.45,28)});
 post(c,.3,1.6,28,18,'#8a9aa0');{const t=V(1.7,1.8,2);cyl(c,t[0],t[1],6,14,'#9fb8b6',{bands:2})}lvx(c,b,'#2f7f78')},
 live(c,b,H){const p=H.L(.3,1.6,48);c.fillStyle=Math.sin(T*5)>0?'#ff4a4a':'#5a1a1a';c.beginPath();c.arc(p[0],p[1],2.4,0,7);c.fill()}});
})();
