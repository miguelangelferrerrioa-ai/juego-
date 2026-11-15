/* ===== Dead Town · edificios (arte v3) · parte 2 ===== */
(function(){
const K=NBK,{faceTf,V,mix,RGB,Q,rnd,pl,lg,line,vol,wnd,dor,sign,plateX,patch,gableX,gableY,flatRoof,hip,cyl,crate,sacks,wire,post,chimney,solar,ac,tank,OLC}=K;
const palc=(t,b)=>{const a=PAL[t];return a?a[Math.min(b.cl||0,a.length-1)][1]:BT[t].c};
const row=(c,len,y,x0,step,n,o,sd)=>{o=o||{};for(let i=0;i<n;i++){const bad=rnd(i,sd,7)<(o.bad===undefined?.2:o.bad);wnd(c,x0+i*step,y,o.w||10,o.h||8,{t:bad?(rnd(i,sd,8)<.5?'board':'broken'):'glass',lit:!bad&&rnd(i,sd,9)<(o.lit===undefined?.3:o.lit),frame:o.frame,shut:o.shut})}};
const star=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke()};
const slats=(c,x,y,w,h,col)=>{c.fillStyle=OLC;c.fillRect(x-2.4,y-2.4,w+4.8,h+2.4);c.fillStyle='#d7d3c3';c.fillRect(x-1.2,y-1.2,w+2.4,h+1.2);c.fillStyle=lg(c,0,y,0,y+h,[[0,col||'#b3b9bc'],[1,'#7f878b']]);c.fillRect(x,y,w,h);c.strokeStyle='rgba(20,14,10,.4)';c.lineWidth=1;for(let yy=y+3;yy<y+h;yy+=3){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke()}c.fillStyle='#e8c22c';for(let i=0;i<8;i++){c.fillRect(x+i*w/8,y+h-2.4,w/16,2.4)}c.fillStyle='#1c1c1c';for(let i=0;i<8;i++){c.fillRect(x+i*w/8+w/16,y+h-2.4,w/16,2.4)}};
const drum=(c,x,y,col)=>{const p=V(x,y,0);cyl(c,p[0],p[1],5.2,10,col,{bands:2})};

/* ---------------- TALLER DE ARMAS ---------------- */
NB.work={up:80,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('work',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#85817a',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:20,z0:2,col:wall,mat:'brick',seed:cl+3,
  decL:(c,len,H)=>{slats(c,12,-15,36,15);c.fillStyle=OLC;c.beginPath();c.arc(70,-13,6.4,0,7);c.fill();c.fillStyle='#e8c94a';c.beginPath();c.arc(70,-13,5.2,0,7);c.fill();c.fillStyle=OLC;for(let i=0;i<8;i++){const a=i*Math.PI/4;c.fillRect(70+Math.cos(a)*5.4-1,-13+Math.sin(a)*5.4-1,2,2)}c.beginPath();c.arc(70,-13,2,0,7);c.fill();
   wnd(c,60,-8,8,5,{lit:true});wnd(c,76,-8,8,5,{lit:true});patch(c,86,-19,8,5,'#8d949a')},
  decR:(c,len,H)=>{row(c,len,-14,10,24,3,{w:10,h:7,lit:.6},cl+1)}});
 gableX(c,{x:0,y:0,w:3,h:3,z:22,rh:6,col:'#5b6168',wallCol:wall,mat:'brick',seed:cl+4,oh:.14,rows:8});
 {const p=V(.6,.55,24);cyl(c,p[0],p[1],5.4,30,'#8f5d48',{bands:3});c.strokeStyle=OLC;c.lineWidth=1.6;c.beginPath();c.ellipse(p[0],p[1]-30,5.4,2.5,0,0,7);c.stroke();c.fillStyle='#2a1a11';c.beginPath();c.ellipse(p[0],p[1]-30,3.6,1.6,0,0,7);c.fill()}
 drum(c,.15,3.2,'#8a3a2a');drum(c,.5,3.3,'#3a6a8a');crate(c,2.55,3.12,0,.4);
 {const p=V(1.6,3.2,0);c.fillStyle='#4a4f55';c.fillRect(p[0]-7,p[1]-8,14,3);c.fillRect(p[0]-4,p[1]-5,8,5);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(p[0]-7,p[1]-8,14,3);c.strokeRect(p[0]-4,p[1]-5,8,5)}
 if(lv>=3)solar(c,1.6,1.3,28)},
live(c,b,H){smoke(c,H.L(.6,.55,56));if(Math.sin(T*9)>.3){const p=H.L(.75,3.15,6);c.fillStyle='#ffd54a';c.fillRect(p[0]+Math.sin(T*30)*5,p[1]-3,2.2,2.2)}}};

/* ---------------- BARRACONES ---------------- */
NB.barr={up:90,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('barr',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#7d7a6f',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:19,z0:2,col:wall,mat:'block',seed:cl+5,
  decL:(c,len,H)=>{row(c,len,-14,8,26,3,{w:9,h:7,lit:.25,bad:.15},cl+2);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,-5.5,len,1.3);star(c,len*.78,-9,5.4,'#e8d26a');patch(c,6,-6.5,9,5,'#6f7a50')},
  decR:(c,len,H)=>{row(c,len,-14,10,26,3,{w:9,h:7},cl+9);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(0,-H+3.5,len,1.2)}});
 gableX(c,{x:0,y:0,w:3,h:3,z:21,rh:8,col:'#566346',wallCol:wall,mat:'block',seed:cl+6,oh:.16,rows:8,tile:6});
 /* puerta (sobre cara frontal) */
 sacks(c,.1,3.2,6);sacks(c,2.05,3.2,6);sacks(c,.1,3.45,3);
 vol(c,{x:.25,y:.25,w:.6,h:.6,z:10,z0:29,col:wall,mat:'block',seed:3});hip(c,{x:.25,y:.25,w:.6,h:.6,z:39,rh:6,col:'#4a5539',oh:.1});
 post(c,2.75,.3,2,36,'#7a7468');
 wire(c,V(-.1,3.55,3),V(3.1,3.55,3),14);
 if(lv>=3){for(const u of[.75,2.25]){const p=V(u,3.1,0);c.fillStyle='#4a4f40';c.fillRect(p[0]-6,p[1]-9,12,9);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(p[0]-6,p[1]-9,12,9)}}},
live(c,b,H){const p=H.L(2.75,.3,38),w=Math.sin(T*3)*2.5;c.fillStyle='#b03030';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+14+w,p[1]+3);c.lineTo(p[0]+12+w*.6,p[1]+9);c.lineTo(p[0],p[1]+9);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.4;c.stroke()}};
NB.barr.paint=(orig=>function(c,b){orig(c,b);const q=NBK;/* puerta con estrella en cara frontal */NBK.faceTf(c,'L',0,0,b.w,b.h,2,len=>{q.dor(c,len/2-6,-13.5,12,13.5,{col:'#5b6a3c'})})})(NB.barr.paint);

/* ---------------- HOSPITAL ---------------- */
NB.hosp={up:90,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('hosp',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#a7aeb0',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:26,z0:2,col:wall,mat:'plaster',seed:cl+1,
  decL:(c,len,H)=>{c.fillStyle='rgba(120,150,170,.22)';c.fillRect(0,-9.5,len,1.6);row(c,len,-23,8,18,5,{w:9,h:7,lit:.45,bad:.08,frame:'#f4f4ee'},cl+1);
   dor(c,len/2-7,-13,14,13,{col:'#dfeaea',awning:'#c4382e'});wnd(c,10,-12.5,10,8,{lit:true,frame:'#f4f4ee'});wnd(c,len-20,-12.5,10,8,{frame:'#f4f4ee'});
   c.fillStyle=OLC;c.fillRect(len/2-9.4,-34,18.8,2);},
  decR:(c,len,H)=>{row(c,len,-23,9,22,4,{w:9,h:7,lit:.5,bad:.08,frame:'#f4f4ee'},cl+4);row(c,len,-12,9,22,4,{w:9,h:7,lit:.4,bad:.1,frame:'#f4f4ee'},cl+7)}});
 /* cruz grande en la fachada derecha */
 faceTf(c,'R',0,0,3,3,2,len=>{c.fillStyle='#f6f6f0';c.fillRect(len/2-8,-19,16,16);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(len/2-8,-19,16,16);c.fillStyle='#d0352e';c.fillRect(len/2-2.6,-17,5.2,12);c.fillRect(len/2-6,-13.6,12,5.2)});
 flatRoof(c,{x:0,y:0,w:3,h:3,z:28,col:'#bfc4c4',pcol:wall,t:.16,ph:3},()=>{
  {const p=V(1.5,1.5,28);c.fillStyle='#e8c94a';c.beginPath();c.ellipse(p[0],p[1],16,8,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.8;c.stroke();c.fillStyle='#2a1a11';c.font='bold 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('H',p[0],p[1]+.5)}
  ac(c,.35,.4,28);ac(c,2.0,.4,28);if(lv>=4)solar(c,.4,2.2,28)});
 sacks(c,.1,3.2,3);crate(c,2.7,3.15,0,.4,'#c9d3d3')},
live(c,b,H){const p=H.L(.2,.2,36),on=Math.sin(T*6)>0;c.fillStyle=on?'rgba(255,50,50,.3)':'rgba(60,100,255,.3)';c.beginPath();c.arc(p[0],p[1]-3,9,0,7);c.fill();c.fillStyle=on?'#f33':'#36f';c.beginPath();c.arc(p[0],p[1]-3,3,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}};

/* ---------------- TORRE DE VIGILANCIA ---------------- */
NB.tower={up:120,paint(c,b){const lv=b.lvl;
 const legs=[[.06,.06],[1.76,.06],[.06,1.76],[1.76,1.76]];
 vol(c,{x:-.08,y:-.08,w:2.16,h:2.16,z:2,col:'#7d786d',mat:'block',seed:1});
 legs.slice(0,2).forEach(([u,v])=>vol(c,{x:u,y:v,w:.2,h:.2,z:80,z0:2,col:'#7a5a3c',mat:'plank',seed:3}));
 for(const hgt of[16,38,62]){c.strokeStyle='#5b4228';c.lineWidth=2;c.beginPath();let a=V(.16,2,2),d=V(1.86,2,2+hgt);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);a=V(.16,2,2+hgt);d=V(1.86,2,2);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);c.stroke()}
 legs.slice(2).forEach(([u,v])=>vol(c,{x:u,y:v,w:.2,h:.2,z:80,z0:2,col:'#86644a',mat:'plank',seed:4}));
 for(const hgt of[16,38,62]){c.strokeStyle='#5b4228';c.lineWidth=2;c.beginPath();let a=V(2,.16,2),d=V(2,1.86,2+hgt);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);a=V(2,.16,2+hgt);d=V(2,1.86,2);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);c.stroke()}
 vol(c,{x:.1,y:.1,w:1.8,h:1.8,z:22,z0:2,col:'#7a5a3c',mat:'plank',seed:11,decL:(c,len,H)=>{dor(c,len/2-6,-13,12,13,{col:'#4a3624'})}});
 vol(c,{x:-.14,y:-.14,w:2.28,h:2.28,z:3,z0:82,col:'#8d6c46',mat:'plank',seed:5});
 /* barandilla */
 vol(c,{x:-.14,y:-.14,w:2.28,h:.1,z:5,z0:85,col:'#9a7650',mat:'plank',seed:6});vol(c,{x:-.14,y:-.14,w:.1,h:2.28,z:5,z0:85,col:'#9a7650',mat:'plank',seed:7});
 vol(c,{x:.3,y:.3,w:1.4,h:1.4,z:14,z0:85,col:'#8d6c46',mat:'plank',seed:8,decL:(c,len,H)=>{wnd(c,len/2-9,-11,18,6,{t:'glass',frame:'#5b4228'})},decR:(c,len,H)=>{wnd(c,len/2-9,-11,18,6,{t:'glass',frame:'#5b4228'})}});
 hip(c,{x:.3,y:.3,w:1.4,h:1.4,z:99,rh:9,col:'#5b4a38',oh:.22});
 vol(c,{x:-.14,y:1.96,w:2.28,h:.1,z:5,z0:85,col:'#9a7650',mat:'plank',seed:9});vol(c,{x:2.0,y:-.14,w:.1,h:2.28,z:5,z0:85,col:'#9a7650',mat:'plank',seed:10});
 sacks(c,.1,2.2,4);
 if(lv>=3){const p=V(1,1,110);line(c,p,[p[0],p[1]-14],'#d8d8d8',1.8)}},
live(c,b,H){const p=H.L(1,1.9,92),a=T*1.5;c.fillStyle='rgba(255,255,170,.28)';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a-.12)*60,p[1]+Math.sin(a-.12)*30);c.lineTo(p[0]+Math.cos(a+.12)*60,p[1]+Math.sin(a+.12)*30);c.closePath();c.fill();c.fillStyle='#ffe9a0';c.beginPath();c.arc(p[0],p[1],2.6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}};

/* ---------------- FÁBRICA ---------------- */
NB.fact={up:120,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('fact',b);
 vol(c,{x:-.08,y:-.08,w:4.16,h:3.16,z:2,col:'#7d7a72',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:4,h:3,z:24,z0:2,col:wall,mat:'brick',seed:cl+2,
  decL:(c,len,H)=>{row(c,len,-19,10,22,5,{w:12,h:6,lit:.5,bad:.1},cl+3);slats(c,len*.32,-14,40,14);c.fillStyle=OLC;c.fillRect(len-30,-22,18,2);patch(c,10,-9,12,6,'#8a5a3c')},
  decR:(c,len,H)=>{row(c,len,-19,10,22,4,{w:12,h:6,lit:.4,bad:.12},cl+8);for(let i=0;i<3;i++){c.strokeStyle='#8a8f94';c.lineWidth=3;c.beginPath();c.moveTo(0,-8-i*3);c.lineTo(len,-8-i*3);c.stroke()}}});
 /* dientes de sierra */
 for(let i=0;i<3;i++){gableX(c,{x:0,y:i*1.0,w:4,h:1.0,z:26,rh:5,col:i%2?'#6a7076':'#757b81',wallCol:wall,mat:'brick',seed:i+2,oh:.04,rows:5})}
 for(const[u,v,h2]of[[.5,.5,40],[1.2,.5,32]]){const p=V(u,v,26);cyl(c,p[0],p[1],6.2,h2,'#9a5f48',{bands:3});c.fillStyle='#2a1a11';c.beginPath();c.ellipse(p[0],p[1]-h2,3.8,1.7,0,0,7);c.fill();c.strokeStyle='#e8e2d0';c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1]-h2+3,6.2,2.8,0,0,Math.PI);c.stroke()}
 for(let i=0;i<3;i++)crate(c,3.2+i*.28,3.2,0,.34,'#a98a50');drum(c,.2,3.25,'#8a3a2a');drum(c,.55,3.3,'#5a6a40');
 if(lv>=4)solar(c,2.6,1.2,31)},
live(c,b,H){smoke(c,H.L(.5,.5,66));smoke(c,H.L(1.2,.5,58))}};

/* ---------------- GENERADOR ---------------- */
NB.gen={up:70,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('gen',b)||'#c9a93a';
 vol(c,{x:-.06,y:-.06,w:2.12,h:2.12,z:2,col:'#7d7a72',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:2,h:2,z:15,z0:2,col:wall,mat:'metal',seed:cl+1,
  decL:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(8,-11.6,26,9);c.fillStyle='#3c4143';c.fillRect(9.2,-10.4,23.6,6.6);c.strokeStyle='#8a9296';c.lineWidth=1;for(let i=0;i<6;i++){c.beginPath();c.moveTo(10+i*4,-10);c.lineTo(10+i*4,-4.4);c.stroke()}
   pl(c,[[len-22,-4],[len-10,-4],[len-16,-14]],'#e8c22c',OLC,1.3);c.fillStyle='#2a1a11';c.fillRect(len-16.6,-11,1.4,4.4);c.fillRect(len-16.6,-5.8,1.4,1.4);patch(c,40,-12,10,6,'#8a9298')},
  decR:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(10,-12,28,10);c.fillStyle='#4a5256';c.fillRect(11.4,-10.6,25,7.4);c.strokeStyle='#8a9296';c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(12+i*5,-10);c.lineTo(12+i*5,-4);c.stroke()}}});
 {const p=V(1.4,.5,17);cyl(c,p[0],p[1],3.4,18,'#7b8286',{bands:2})}
 {const p=V(.5,.5,17);cyl(c,p[0],p[1],6,3.4,'#6a7276',{});c.strokeStyle='#cfd3d4';c.lineWidth=1;c.beginPath();c.moveTo(p[0]-5,p[1]-3.4);c.lineTo(p[0]+5,p[1]-3.4);c.moveTo(p[0],p[1]-6);c.lineTo(p[0],p[1]);c.stroke()}
 drum(c,.15,2.2,'#6a8a3a');drum(c,.5,2.3,'#6a8a3a');
 line(c,V(1.6,2.1,2),V(2.4,2.5,0),'#222',2.2)},
live(c,b,H){if(b.run!==0){const p=H.L(1,1,23);c.strokeStyle='rgba(120,220,255,.9)';c.lineWidth=1.3;for(let n=0;n<2;n++){c.beginPath();let px=p[0]-8,py=p[1]-n*6;c.moveTo(px,py);for(let i=0;i<5;i++){px+=3.4;py+=(Math.random()-.5)*5;c.lineTo(px,py)}c.stroke()}}const e=H.L(.3,.3,19);c.fillStyle=b.run!==0&&Math.sin(T*4)>0?'#ffe45c':'#6a5a20';c.beginPath();c.arc(e[0],e[1],3,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke();smoke(c,H.L(1.4,.5,38))}};

/* ---------------- GARAJE ---------------- */
NB.gar={up:80,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('gar',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#85827a',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:19,z0:2,col:wall,mat:'block',seed:cl+4,
  decL:(c,len,H)=>{slats(c,9,-15,32,15);slats(c,len-41,-15,32,15);c.fillStyle=OLC;c.fillRect(len/2-6,-24,12,6);c.fillStyle='#e8c94a';c.fillRect(len/2-5,-23,10,4);wnd(c,len/2-4,-13,8,5,{lit:true})},
  decR:(c,len,H)=>{row(c,len,-14,12,26,3,{w:10,h:6,bad:.3},cl+5);patch(c,len-18,-8,9,5,'#9a7a4a')}});
 gableX(c,{x:0,y:0,w:3,h:3,z:21,rh:5,col:'#6c7278',wallCol:wall,mat:'block',seed:cl+5,oh:.14,rows:7});
 for(let i=0;i<3;i++){const p=V(2.7,3.2,i*5);cyl(c,p[0],p[1],6,5,'#1c1c1c',{})}
 vol(c,{x:-.7,y:1.3,w:.55,h:1.0,z:6,z0:3,col:'#8a4a36',mat:'metal',seed:5});vol(c,{x:-.62,y:1.5,w:.4,h:.6,z:5,z0:9,col:'#3f5a6a',mat:'plaster',seed:6});
 for(const[u,v]of[[-.68,1.35],[-.2,1.35],[-.68,2.2],[-.2,2.2]]){const p=V(u,v,0);c.fillStyle='#1a1512';c.beginPath();c.ellipse(p[0],p[1]-2.5,3,3.5,0,0,7);c.fill()}
 drum(c,2.4,3.25,'#8a3a2a');if(lv>=3)sacks(c,.2,3.25,4)},
live(c,b,H){}};

/* ---------------- LABORATORIO ---------------- */
NB.lab={up:100,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('lab',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#9aa3a5',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:22,z0:2,col:wall,mat:'plaster',seed:cl+6,
  decL:(c,len,H)=>{for(let i=0;i<3;i++)wnd(c,8+i*20,-18,14,8,{lit:true,frame:'#f2f6f6'});dor(c,len-26,-13,13,13,{col:'#9fc9c6',awning:null});pl(c,[[18,-3],[36,-3],[27,-12]],'#e8c22c',OLC,1.3);c.fillStyle='#2a1a11';c.fillRect(26.2,-9.5,1.6,4);c.fillRect(26.2,-5,1.6,1.4);
   c.fillStyle='#7fd8d0';c.fillRect(0,-8,len,1.2)},
  decR:(c,len,H)=>{for(let i=0;i<3;i++)wnd(c,10+i*26,-18,14,8,{frame:'#f2f6f6',lit:i!==1});row(c,len,-8,10,26,3,{w:8,h:4,frame:'#f2f6f6'},cl+2)}});
 flatRoof(c,{x:0,y:0,w:3,h:3,z:24,col:'#c3cbcc',pcol:wall,t:.16,ph:3},()=>{
  {const p=V(1.5,1.5,24);const g=c.createLinearGradient(0,p[1]-22,0,p[1]);g.addColorStop(0,'rgba(190,255,245,.85)');g.addColorStop(1,'rgba(90,190,185,.75)');c.fillStyle=g;c.beginPath();c.ellipse(p[0],p[1],21,11,0,Math.PI,0);c.lineTo(p[0]+21,p[1]);c.ellipse(p[0],p[1],21,10.5,0,0,Math.PI);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.8;c.stroke();
   c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1;for(let i=-1;i<=1;i++){c.beginPath();c.ellipse(p[0],p[1],21*(1-Math.abs(i)*.4)*.0+Math.abs(i)*0+ (i===0?1:.55)*21,(i===0?1:.55)*11,0,Math.PI,0);c.stroke()}
   c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(p[0]-6,p[1]-10,5,2,-.5,0,7);c.fill()}
  const p=V(2.4,.5,24);line(c,p,[p[0],p[1]-20],'#cfd3d4',1.6);line(c,[p[0]-5,p[1]-15],[p[0]+5,p[1]-15],'#cfd3d4',1.4);ac(c,.35,.4,24)});
 if(lv>=3)sacks(c,2.4,3.2,3)},
live(c,b,H){const p=H.L(1.5,1.5,34);c.fillStyle='rgba(200,255,240,.85)';for(let i=0;i<3;i++){const t=(T*.8+i/3)%1;c.beginPath();c.arc(p[0]+Math.sin(T*3+i*2)*5,p[1]-t*22,1.5+t,0,7);c.fill()}}};

/* ---------------- CENTRO DE EXPEDICIONES ---------------- */
NB.expo={up:100,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('expo',b);
 vol(c,{x:-.1,y:-.1,w:3.2,h:3.2,z:2,col:'#8d8a80',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:20,z0:2,col:wall,mat:'block',seed:cl+2,
  decL:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(10,-18.8,34,16.6);c.fillStyle='#e8dcb4';c.fillRect(11.4,-17.4,31,13.8);c.strokeStyle='rgba(120,90,50,.6)';c.lineWidth=.9;c.beginPath();c.moveTo(14,-14);c.lineTo(22,-10);c.lineTo(28,-15);c.lineTo(36,-8);c.moveTo(18,-6);c.lineTo(26,-12);c.stroke();c.fillStyle='#c33';c.beginPath();c.arc(30,-11,1.8,0,7);c.fill();c.fillStyle='#35a';c.beginPath();c.arc(20,-8,1.5,0,7);c.fill();
   dor(c,len-34,-13,13,13,{col:'#6d7a52',awning:'#c4a14a'});wnd(c,60,-13,9,7,{lit:true})},
  decR:(c,len,H)=>{row(c,len,-14,10,26,3,{w:10,h:7},cl+4)}});
 flatRoof(c,{x:0,y:0,w:3,h:3,z:22,col:'#b4aea0',pcol:wall,t:.16,ph:3},()=>{const p=V(1.5,1.5,22);post(c,1.5,1.5,22,18,'#7a7f84');ac(c,.4,.4,22);ac(c,2.0,2.1,22)});
 /* jeep */
 vol(c,{x:2.2,y:3.2,w:.7,h:.4,z:5,z0:3,col:'#6d7a52',mat:'metal',seed:6});vol(c,{x:2.35,y:3.25,w:.35,h:.3,z:4,z0:8,col:'#3f5a6a',mat:'plaster',seed:7});
 for(const[u,v]of[[2.25,3.65],[2.8,3.65]]){const p=V(u,v,0);c.fillStyle='#1a1512';c.beginPath();c.ellipse(p[0],p[1]-2.5,3,3.3,0,0,7);c.fill()}
 sacks(c,.1,3.2,3);crate(c,.9,3.2,0,.4)},
live(c,b,H){const p=H.L(1.5,1.5,40),a=T;c.save();c.translate(p[0],p[1]);c.rotate(Math.sin(a)*.7);c.fillStyle='#d8dde0';c.beginPath();c.ellipse(0,-4,13,5,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.6;c.stroke();c.fillStyle='#8a9296';c.fillRect(-1,-4,2,6);c.restore()}};

/* ---------------- MURALLA / PUERTA / BARRICADA / TRAMPA / ARMA ---------------- */
NB.wall={up:40,paint(c,b){const l=Math.min(5,b.lvl||1),dm=b.hp<(BT.wall.hp||160)*l*.5;
 const crack=(c,len,H)=>{if(dm){c.strokeStyle='#2a1a11';c.lineWidth=1.2;c.beginPath();c.moveTo(10,-H);c.lineTo(14,-H*.6);c.lineTo(11,-H*.25);c.stroke()}};
 if(l==1){ /* valla de malla metálica sobre zócalo de hormigón */
  vol(c,{x:-.02,y:-.02,w:1.04,h:1.04,z:5,col:'#9c9a90',mat:'block',seed:3});
  vol(c,{x:-.05,y:-.05,w:1.1,h:1.1,z:1.6,z0:5,col:'#d9cf9a',mat:'block',seed:4});
  const Hf=22,mesh=(c,len)=>{c.save();c.beginPath();c.rect(0,-Hf,len,Hf);c.clip();c.fillStyle='rgba(190,200,210,.10)';c.fillRect(0,-Hf,len,Hf);c.strokeStyle='rgba(215,222,228,.8)';c.lineWidth=.8;c.beginPath();for(let X=-Hf;X<len+Hf;X+=5){c.moveTo(X,0);c.lineTo(X+Hf,-Hf);c.moveTo(X,-Hf);c.lineTo(X+Hf,0)}c.stroke();c.strokeStyle='#8e979e';c.lineWidth=1.6;c.beginPath();c.moveTo(0,-Hf);c.lineTo(len,-Hf);c.stroke();c.restore()};
  faceTf(c,'L',0,0,1,1,6.6,(len)=>mesh(c,len));faceTf(c,'R',0,0,1,1,6.6,(len)=>mesh(c,len));
  for(const[u,v]of[[.03,.97],[.5,.97],[.97,.97],[.97,.5],[.97,.03]])post(c,u,v,6.6,Hf+2,'#aab3ba')}
 else if(l==2){ /* valla de madera */
  const Hf=17,pk=(c,len)=>{for(let X=0;X<len-1;X+=5){const sh=(X/5|0)%2;c.fillStyle=sh?'#8a6a44':'#9a7a50';c.beginPath();c.moveTo(X,0);c.lineTo(X,-Hf+2);c.lineTo(X+2.4,-Hf);c.lineTo(X+4.6,-Hf+2);c.lineTo(X+4.6,0);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke()}c.fillStyle='#6a4b2e';c.fillRect(0,-Hf+4,len,2);c.fillRect(0,-5,len,2);c.strokeStyle=OLC;c.lineWidth=.8;c.strokeRect(0,-Hf+4,len,2);c.strokeRect(0,-5,len,2)};
  vol(c,{x:-.02,y:-.02,w:1.04,h:1.04,z:3,col:'#6e5e44',mat:'block',seed:3});
  faceTf(c,'L',0,0,1,1,3,(len)=>pk(c,len));faceTf(c,'R',0,0,1,1,3,(len)=>pk(c,len));
  for(const[u,v]of[[.04,.96],[.5,.96],[.96,.96],[.96,.5],[.96,.04]])post(c,u,v,3,Hf+3,'#5a4030')}
 else if(l==3){ /* muro de piedra */
  vol(c,{x:0,y:0,w:1,h:1,z:18,col:'#a09c90',mat:'block',seed:3,decL:crack,decR:crack});
  vol(c,{x:-.05,y:-.05,w:1.1,h:1.1,z:2.4,z0:18,col:'#c6c2b4',mat:'block',seed:4})}
 else if(l==4){ /* muro de ladrillo */
  vol(c,{x:0,y:0,w:1,h:1,z:22,col:'#a85a3c',mat:'brick',seed:5,decL:crack,decR:crack});
  vol(c,{x:-.05,y:-.05,w:1.1,h:1.1,z:2.6,z0:22,col:'#d9c9a4',mat:'block',seed:4})}
 else { /* muro de acero con alambre de espino */
  const rv=(c,len,H)=>{c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1;for(let X=12;X<len;X+=12){c.beginPath();c.moveTo(X,-H+1);c.lineTo(X,-1);c.stroke()}c.fillStyle='rgba(235,240,245,.5)';for(let X=6;X<len;X+=12){c.fillRect(X-.8,-H+3,1.6,1.6);c.fillRect(X-.8,-4,1.6,1.6)}crack(c,len,H)};
  vol(c,{x:0,y:0,w:1,h:1,z:26,col:'#78828a',mat:'metal',seed:6,decL:rv,decR:rv});
  vol(c,{x:-.05,y:-.05,w:1.1,h:1.1,z:2.2,z0:26,col:'#4f585f',mat:'metal',seed:4});
  wire(c,V(-.05,1.05,31),V(1.05,1.05,31),6);wire(c,V(1.05,1.05,31),V(1.05,-.05,31),6)}
}};
NB.gate={up:40,paint(c,b){vol(c,{x:0,y:0,w:.28,h:1,z:20,col:'#8d8a80',mat:'block',seed:1});vol(c,{x:.72,y:0,w:.28,h:1,z:20,col:'#8d8a80',mat:'block',seed:2});
 vol(c,{x:.28,y:.12,w:.44,h:.76,z:14,col:'#5a6168',mat:'metal',seed:3,decL:(c,len,H)=>{c.strokeStyle='#e0b020';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(3+i*6,-H);c.lineTo(3+i*6+4,0);c.stroke()}}});
 vol(c,{x:-.04,y:-.04,w:1.08,h:1.08,z:2.4,z0:20,col:'#c6c2b4',mat:'block',seed:4,noTop:false})}};
NB.barricade={up:30,paint(c,b){sacks(c,.05,1.05,4);vol(c,{x:.05,y:.15,w:.9,h:.7,z:8,col:'#9b7045',mat:'plank',seed:4,decL:(c,len,H)=>{c.strokeStyle='#49301c';c.lineWidth=3;c.beginPath();c.moveTo(3,-H+1);c.lineTo(len-3,-1);c.moveTo(len-3,-H+1);c.lineTo(3,-1);c.stroke()}});
 for(let i=0;i<3;i++){const p=V(.2+i*.3,.2,8);c.fillStyle='#c9ced0';c.beginPath();c.moveTo(p[0]-2,p[1]);c.lineTo(p[0],p[1]-7);c.lineTo(p[0]+2,p[1]);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke()}}};
NB.trap={up:20,paint(c,b){vol(c,{x:.06,y:.06,w:.88,h:.88,z:2,col:'#6a5a48',mat:'plank',seed:1});for(let i=0;i<4;i++){const p=V(.25+(i%2)*.5,.3+Math.floor(i/2)*.4,2);c.fillStyle='#d9dcdc';c.beginPath();c.moveTo(p[0]-3.4,p[1]);c.lineTo(p[0],p[1]-10);c.lineTo(p[0]+3.4,p[1]);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}}};
NB.turret={up:40,paint(c,b){sacks(c,.02,.95,4);sacks(c,.9,.2,3);vol(c,{x:.2,y:.2,w:.6,h:.6,z:6,col:'#4f555d',mat:'metal',seed:2});vol(c,{x:.3,y:.3,w:.4,h:.4,z:4,z0:6,col:'#343a41',mat:'metal',seed:3})},
live(c,b,H){const p=H.L(.5,.5,15),a=b.ang||T;c.strokeStyle='#15181c';c.lineWidth=3.6;c.lineCap='round';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*14,p[1]+Math.sin(a)*7);c.stroke();c.strokeStyle='#6a737c';c.lineWidth=1.4;c.stroke();c.fillStyle='#8a929a';c.beginPath();c.arc(p[0],p[1],3.6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.3;c.stroke()}};

/* ---------------- MUELLE, BOMBEO, MINA, TORRE DE MONTAÑA ---------------- */
NB.dock={up:60,paint(c,b){vol(c,{x:0,y:0,w:2,h:2,z:3,z0:1,col:'#9a7a50',mat:'plank',seed:3,topCol:'#a98a5c'});
 for(let i=1;i<4;i++){line(c,V(i*.5,0,4),V(i*.5,2,4),'rgba(50,32,16,.55)',1)}
 for(const[u,v]of[[0,0],[1.82,0],[0,1.82],[1.82,1.82]])vol(c,{x:u,y:v,w:.18,h:.18,z:13,z0:0,col:'#5a4028',mat:'plank',seed:4});
 crate(c,.2,.2,4,.45,'#b9a47a');{const p=V(1.5,.6,4);c.strokeStyle='#d8c9a0';c.lineWidth=1.4;c.beginPath();c.moveTo(p[0]-6,p[1]);c.lineTo(p[0]+6,p[1]-5);c.lineTo(p[0]+8,p[1]+3);c.closePath();c.stroke()}
 {const a=V(1.7,.35,4),b2=V(2.3,.1,26);line(c,a,b2,'#3a2a18',2);line(c,b2,[b2[0]+4,b2[1]+22],'rgba(235,240,240,.8)',.9)}}};
NB.pump={up:80,paint(c,b){const cl=b.cl||0,wall=palc('pump',b)||'#6f8fa3';vol(c,{x:-.05,y:-.05,w:2.1,h:2.1,z:3,col:'#8a8f90',mat:'block',seed:1});
 vol(c,{x:.15,y:.15,w:1.7,h:1.7,z:14,z0:3,col:wall,mat:'metal',seed:2,decL:(c,len,H)=>{wnd(c,10,-11,10,6,{lit:true});c.fillStyle='#f0f0e8';c.beginPath();c.arc(len-14,-9,5,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.4;c.stroke();c.fillStyle='#3a8fc0';c.beginPath();c.moveTo(len-14,-13);c.quadraticCurveTo(len-9,-8,len-14,-5);c.quadraticCurveTo(len-19,-8,len-14,-13);c.fill()},decR:(c,len,H)=>{row(c,len,-11,10,22,2,{w:10,h:6},cl)}});
 {const p=V(1.0,1.0,17);cyl(c,p[0],p[1],10,14,'#8fb0c0',{bands:2})}
 {const a=V(.4,2.0,6),b2=V(.4,2.7,1);line(c,a,b2,'#3c4a52',3.4);line(c,V(.9,2.0,6),V(.9,2.7,1),'#3c4a52',3.4)}}};
NB.mine={up:90,paint(c,b){const lv=b.lvl;vol(c,{x:-.1,y:-.1,w:3.2,h:3.2,z:14,col:'#756c60',mat:'block',seed:4});vol(c,{x:.3,y:.3,w:2.4,h:2.4,z:12,z0:14,col:'#8a8174',mat:'block',seed:5});
 faceTf(c,'L',0,0,3,3,0,len=>{const e=len/2-14;c.fillStyle=OLC;c.beginPath();c.moveTo(e-4,0);c.lineTo(e-4,-20);c.lineTo(e+32,-20);c.lineTo(e+32,0);c.fill();c.fillStyle='#120e0a';c.fillRect(e,-17,28,17);c.fillStyle='#8a6240';c.fillRect(e-4,-20,4,20);c.fillRect(e+28,-20,4,20);c.fillRect(e-4,-22,40,4);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(e-4,-22,40,4);
  c.strokeStyle='#6a6a6a';c.lineWidth=1.6;c.beginPath();c.moveTo(e+8,0);c.lineTo(e+8,12);c.moveTo(e+20,0);c.lineTo(e+20,12);c.stroke()});
 /* castillete */
 vol(c,{x:.4,y:.4,w:.25,h:.25,z:30,z0:26,col:'#7a5a3c',mat:'plank',seed:3});vol(c,{x:1.1,y:.4,w:.25,h:.25,z:30,z0:26,col:'#86644a',mat:'plank',seed:4});
 {const p=V(.9,.5,56);c.fillStyle='#8a8f94';c.beginPath();c.arc(p[0],p[1],6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=2;c.stroke();c.strokeStyle='#5b4228';c.lineWidth=1.4;for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*6,p[1]+Math.sin(a)*6);c.stroke()}}
 vol(c,{x:2.0,y:3.15,w:.6,h:.4,z:5,z0:2,col:'#8a5a2a',mat:'plank',seed:6});
 for(const[u,v]of[[2.05,3.55],[2.5,3.55]]){const p=V(u,v,0);c.fillStyle='#1a1512';c.beginPath();c.arc(p[0],p[1]-2,2.5,0,7);c.fill()}
 if(lv>=3)crate(c,.4,3.2,0,.4)},
live(c,b,H){const p=H.L(1.5,3.1,22);c.fillStyle='rgba(255,210,120,'+(.35+.15*Math.sin(T*5))+')';c.beginPath();c.arc(p[0],p[1],7,0,7);c.fill();c.fillStyle='#ffe9a0';c.beginPath();c.arc(p[0],p[1],2.2,0,7);c.fill()}};
NB.mtower={up:140,paint(c,b){const lv=b.lvl;vol(c,{x:-.15,y:-.15,w:2.3,h:2.3,z:12,col:'#6f7473',mat:'block',seed:2});
 vol(c,{x:.1,y:.1,w:.22,h:.22,z:40,z0:12,col:'#7a5a3c',mat:'plank',seed:3});vol(c,{x:1.68,y:.1,w:.22,h:.22,z:40,z0:12,col:'#7a5a3c',mat:'plank',seed:4});
 for(const hgt of[14,32]){c.strokeStyle='#5b4228';c.lineWidth=2;c.beginPath();let a=V(.2,2,12),d=V(1.8,2,12+hgt);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);a=V(.2,2,12+hgt);d=V(1.8,2,12);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);c.stroke()}
 vol(c,{x:.1,y:1.68,w:.22,h:.22,z:40,z0:12,col:'#86644a',mat:'plank',seed:5});vol(c,{x:1.68,y:1.68,w:.22,h:.22,z:40,z0:12,col:'#86644a',mat:'plank',seed:6});
 for(const hgt of[14,32]){c.strokeStyle='#5b4228';c.lineWidth=2;c.beginPath();let a=V(2,.2,12),d=V(2,1.8,12+hgt);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);a=V(2,.2,12+hgt);d=V(2,1.8,12);c.moveTo(a[0],a[1]);c.lineTo(d[0],d[1]);c.stroke()}
 vol(c,{x:-.15,y:-.15,w:2.3,h:2.3,z:3,z0:52,col:'#8d6c46',mat:'plank',seed:7});
 vol(c,{x:.3,y:.3,w:1.4,h:1.4,z:13,z0:55,col:'#8d6c46',mat:'plank',seed:8,decL:(c,len,H)=>{wnd(c,len/2-9,-10,18,6,{frame:'#5b4228'})},decR:(c,len,H)=>{wnd(c,len/2-9,-10,18,6,{frame:'#5b4228'})}});
 hip(c,{x:.3,y:.3,w:1.4,h:1.4,z:68,rh:9,col:'#5b4a38',oh:.22});sacks(c,.1,2.2,4)},
live(c,b,H){const p=H.L(1,1.9,62),a=T*1.5;c.fillStyle='rgba(255,255,170,.28)';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a-.1)*70,p[1]+Math.sin(a-.1)*35);c.lineTo(p[0]+Math.cos(a+.1)*70,p[1]+Math.sin(a+.1)*35);c.closePath();c.fill();c.fillStyle='#ffe9a0';c.beginPath();c.arc(p[0],p[1],2.6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}};

/* tamaños de caché más altos para estructuras muy altas */
['tower','mtower','fact','hall'].forEach(k=>{if(NB[k])NB[k].up=Math.max(NB[k].up||110,k==='mtower'?150:130)});
})();
