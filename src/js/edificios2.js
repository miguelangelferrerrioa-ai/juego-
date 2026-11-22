/* ===== Dead Town · definiciones de edificios (arte v3) ===== */
(function(){
const K=NBK,{V,mix,RGB,Q,rnd,pl,lg,line,vol,wnd,dor,sign,plateX,patch,gableX,gableY,flatRoof,hip,cyl,crate,sacks,wire,post,chimney,solar,ac,tank,OLC}=K;
const palc=(t,b)=>{const a=PAL[t];return a?a[Math.min(b.cl||0,a.length-1)][1]:BT[t].c};
const roofc=b=>ROOFS[Math.min(b.rf||0,3)][1];
const pick=(n,a)=>a[Math.floor(nh(n*977,n*131+7)*a.length)%a.length];

/* ---------------- CASA ---------------- */
NB.house={up:80,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('house',b),mat=['plank','plaster','plaster','brick','plaster','plank'][Math.min(cl,5)],rc=roofc(b),ex=b.ex||0,seed=cl*3+lv;
 vol(c,{x:-.06,y:-.06,w:2.12,h:2.12,z:3,col:'#8e887c',mat:'block',seed:1});
 const boardL=rnd(cl,1,2)<.3;
 vol(c,{x:0,y:0,w:2,h:2,z:17,z0:3,col:wall,mat,seed,
  decL:(c,len,H)=>{const sh=lv>=3?'#6e8a5c':null;wnd(c,8,-12,10,8,{shut:sh,curtain:rnd(cl,4,1)<.5?'#c0564a':null,lit:rnd(cl,5,1)<.4,t:boardL?'board':'glass'});wnd(c,len-18,-12,10,8,{shut:sh,t:rnd(cl,6,1)<.25?'broken':'glass'});
   dor(c,len/2-6,-12.5,12,12.5,{col:pick(cl+2,['#8b5a30','#4f6f8a','#a04535','#566b4a']),awning:ex===2?'#b5493a':null});
   if(rnd(cl,7,2)<.5)patch(c,len-14,-6.5,9,5,'#8b9298');},
  decR:(c,len,H)=>{wnd(c,9,-12,10,8,{shut:lv>=3?'#6e8a5c':null,lit:true});wnd(c,len-19,-12,10,8,{shut:lv>=3?'#6e8a5c':null});if(rnd(cl,8,3)<.4)plateX(c,len/2,-7,3.5)}});
 gableY(c,{x:0,y:0,w:2,h:2,z:20,rh:13,col:rc,wallCol:wall,mat,seed,oh:.2,rows:7,tile:5,gable:(c,len,rh)=>{wnd(c,len/2-4,-rh+3.5,8,6,{frame:'#eadfc2',lit:rnd(cl,9,1)<.5})}});
 if(lv>=2)chimney(c,1.45,.35,26,12,cl%2?'#9a6a50':'#8b5a45');
 if(ex===3||lv>=4)solar(c,1.1,.7,26);
 if(ex===4||lv>=5){const p=V(.4,.5,34);line(c,p,[p[0],p[1]-22],'#cfd3d4',1.6);line(c,[p[0]-6,p[1]-17],[p[0]+6,p[1]-17],'#cfd3d4',1.4);line(c,[p[0]-4,p[1]-11],[p[0]+4,p[1]-11],'#cfd3d4',1.4)}
 if(ex===1){for(const[u,v]of[[.15,2.2],[1.85,2.2],[.85,2.35],[1.2,2.35]]){const p=V(u,v,0);c.fillStyle='#3f7d34';c.beginPath();c.ellipse(p[0],p[1]-3,6.5,4.6,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.6;c.stroke();c.fillStyle=pick(u*10+v,['#ff7a7a','#ffd24a','#fff','#ff9ad0']);c.beginPath();c.arc(p[0]-2,p[1]-4,1.6,0,7);c.arc(p[0]+2.5,p[1]-2.5,1.4,0,7);c.fill()}}
 if(ex===2){vol(c,{x:.55,y:2,w:.9,h:.45,z:1.5,z0:0,col:'#9a7a50',mat:'plank',seed:3});post(c,.58,2.4,0,13);post(c,1.42,2.4,0,13)}
 if(rnd(cl,3,4)<.55)sacks(c,.1,2.18,3);
 if(rnd(cl,4,4)<.35){const a=V(.1,2.25,3),d=V(1.9,2.25,3);wire(c,a,d,9);}
},live(c,b,H){if(b.lvl>=2)smoke(c,H.L(1.63,.53,42))}};

/* ---------------- AYUNTAMIENTO ---------------- */
NB.hall={up:150,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('hall',b),W=4,Hh=4;
 vol(c,{x:-.2,y:-.2,w:4.4,h:4.4,z:3,col:'#b0aa9b',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:W,h:Hh,z:28,z0:3,col:wall,mat:'brick',seed:cl+2,
  decL:(c,len,H)=>{
   const band=(yy,hh,col)=>{c.fillStyle=col;c.fillRect(0,yy,len,hh);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(0,yy,len,hh)};
   band(-H,3.2,'rgba(255,247,225,.55)');band(-14.2,2.2,'rgba(255,247,225,.3)');
   for(let fl=0;fl<2;fl++){const yy=fl?-25:-12.5;for(const X of[10,28,92,110]){const bad=rnd(X,fl,cl)<.28;wnd(c,X,yy,10,9,{t:bad?(rnd(X,fl,9)<.5?'board':'broken'):'glass',frame:'#f1e7cb',lit:!bad&&rnd(X,fl,3)<.35})}}
   wnd(c,58,-25,12,9,{lit:true,frame:'#f1e7cb'});
   /* pórtico */
   for(const X of[44,80]){c.fillStyle=lg(c,X,0,X+6,0,[[0,'#f6efdc'],[1,'#c8bfa5']]);c.fillRect(X,-H+2,6,H-2);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(X,-H+2,6,H-2);c.fillStyle='#f6efdc';c.fillRect(X-1.5,-H+1.4,9,3);c.strokeRect(X-1.5,-H+1.4,9,3);c.fillRect(X-1.5,-2.6,9,2.6);c.strokeRect(X-1.5,-2.6,9,2.6)}
   dor(c,56,-16,16,16,{col:'#7a4a28',awning:null});
   pl(c,[[40,-H+1.6],[88,-H+1.6],[64,-H-9]],'#e9dfc4',OLC,1.8);c.fillStyle='rgba(0,0,0,.14)';c.fillRect(44,-H+.5,40,1.2);
   if(lv>=3){c.fillStyle='#b43a2e';c.fillRect(4,-27,8,14);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(4,-27,8,14)}
   patch(c,18,-6,12,6,'#8d949a');plateX(c,106,-8,4);},
  decR:(c,len,H)=>{c.fillStyle='rgba(255,247,225,.45)';c.fillRect(0,-H,len,3.2);c.fillStyle='rgba(255,247,225,.25)';c.fillRect(0,-14.2,len,2.2);
   for(let fl=0;fl<2;fl++){const yy=fl?-25:-12.5;for(let i=0;i<5;i++){const X=9+i*24,bad=rnd(i,fl,cl+5)<.25;wnd(c,X,yy,10,9,{t:bad?'board':'glass',frame:'#f1e7cb',lit:!bad&&rnd(i,fl,4)<.3})}}}});
 /* cornisa y azotea */
 vol(c,{x:-.1,y:-.1,w:4.2,h:4.2,z:3,z0:28,col:'#d9d0b8',mat:'block',seed:5,noTop:true});
 flatRoof(c,{x:-.1,y:-.1,w:4.2,h:4.2,z:31,col:'#a9aca4',pcol:'#d9d0b8',t:.2,ph:3},()=>{
  ac(c,.5,.6,31);ac(c,.5,1.3,31);tank(c,3.3,.9,31,'#7f9fa8');
  if(lv>=4){solar(c,1.0,2.9,31);solar(c,2.0,2.9,31)}});
 /* torre del reloj */
 vol(c,{x:1.3,y:1.3,w:1.4,h:1.4,z:20,z0:31,col:wall,mat:'brick',seed:7,
  decL:(c,len,H)=>{c.fillStyle=OLC;c.beginPath();c.arc(len/2,-11,8.6,0,7);c.fill();c.fillStyle='#f5eed8';c.beginPath();c.arc(len/2,-11,7.2,0,7);c.fill();c.strokeStyle='#2a1a11';c.lineWidth=1.2;for(let i=0;i<12;i++){const a=i/12*6.283;c.beginPath();c.moveTo(len/2+Math.sin(a)*5.6,-11-Math.cos(a)*5.6);c.lineTo(len/2+Math.sin(a)*6.6,-11-Math.cos(a)*6.6);c.stroke()}c.lineWidth=1.6;c.beginPath();c.moveTo(len/2,-11);c.lineTo(len/2+2,-14);c.moveTo(len/2,-11);c.lineTo(len/2-3,-9.5);c.stroke();
   wnd(c,len/2-4,-4.2,8,3.6,{frame:'#e9dfc4'})},
  decR:(c,len,H)=>{wnd(c,len/2-4.5,-14,9,9,{frame:'#e9dfc4'})}});
 hip(c,{x:1.3,y:1.3,w:1.4,h:1.4,z:51,rh:18,col:'#5b6670',oh:.18});
 {const p=V(2,2,69);line(c,p,[p[0],p[1]-22],'#d8d8d8',2);}
 /* defensas apocalípticas en la entrada */
 sacks(c,1.0,4.28,5);sacks(c,2.55,4.28,5);
 wire(c,V(.1,4.35,5),V(1.0,4.35,5),5);wire(c,V(3.4,4.35,5),V(3.95,4.35,5),3);
 if(lv>=2){for(const[u,v]of[[.2,4.35],[3.8,4.35]]){post(c,u,v,0,16,'#5b4a38');const p=V(u,v,16);c.fillStyle='#ffe28a';c.beginPath();c.arc(p[0],p[1]-3,2.6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}}
},live(c,b,H){const p=H.L(2,2,91),w=Math.sin(T*3)*3;c.fillStyle='#c33';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+15+w,p[1]+4);c.lineTo(p[0]+13+w*.6,p[1]+10);c.lineTo(p[0],p[1]+10);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.5;c.stroke();
 const an=S.dayT/600*6.283,ck=H.L(2,2.7,50);/* manecillas vivas del reloj */ }};

/* ---------------- ALMACÉN ---------------- */
NB.store={up:70,paint(c,b){const lv=b.lvl,cl=b.cl||0,wall=palc('store',b);
 vol(c,{x:-.08,y:-.08,w:3.16,h:3.16,z:2,col:'#8a8f90',mat:'block',seed:2});
 vol(c,{x:0,y:0,w:3,h:3,z:18,z0:2,col:wall,mat:'metal',seed:cl+1,
  decL:(c,len,H)=>{const dw=44,dx=len/2-dw/2;c.fillStyle=OLC;c.fillRect(dx-2.4,-17.4,dw+4.8,17.4);c.fillStyle='#d7d3c3';c.fillRect(dx-1.2,-16.2,dw+2.4,16.2);
    c.fillStyle=lg(c,0,-16,0,0,[[0,'#a9afb2'],[1,'#7d8588']]);c.fillRect(dx,-15,dw,15);c.strokeStyle='rgba(20,14,10,.45)';c.lineWidth=1;for(let y=-15;y<0;y+=3){c.beginPath();c.moveTo(dx,y);c.lineTo(dx+dw,y);c.stroke()}
    c.fillStyle='#e8c22c';for(let i=0;i<8;i++){c.fillRect(dx+i*dw/8,-2.4,dw/16,2.4)}c.fillStyle='#1c1c1c';for(let i=0;i<8;i++){c.fillRect(dx+i*dw/8+dw/16,-2.4,dw/16,2.4)}
    c.fillStyle='#2a1a11';c.fillRect(dx+dw/2-3,-5,6,1.8);
    wnd(c,8,-13,10,6,{});wnd(c,len-18,-13,10,6,{t:'board'});patch(c,len-30,-7,10,5,'#c0752f');plateX(c,dx-9,-9,3)},
  decR:(c,len,H)=>{for(let i=0;i<3;i++){const t=rnd(i,2,cl)<.3;wnd(c,10+i*28,-13,10,6,{t:t?'board':'glass'})}patch(c,len-22,-8,12,6,'#7f8a90')}});
 gableX(c,{x:0,y:0,w:3,h:3,z:20,rh:7,col:'#8a9296',wallCol:wall,mat:'metal',seed:cl+2,oh:.16,rows:9,tile:0});
 for(let i=0;i<2;i++){const p=V(.8+i*1.1,1.5,28);cyl(c,p[0],p[1],3.2,6,'#a7aeb0',{})}
 /* mercancía fuera */
 crate(c,-.28,2.45,0,.5);crate(c,-.28,2.95,0,.5,'#a47a42');crate(c,-.28,2.7,7,.45,'#c79a5c');
 {const p=V(2.65,3.28,0);cyl(c,p[0],p[1],5.4,11,'#9a3a2a',{bands:2});const p2=V(2.95,3.1,0);cyl(c,p2[0],p2[1],5.4,11,'#3a6a8a',{bands:2})}
 sacks(c,.2,3.25,4);
 if(lv>=3){for(let i=0;i<3;i++)crate(c,1.9+i*.3,3.2,0,.34,'#b98a4e')}
 wire(c,V(-.15,3.38,4),V(.2,3.38,4),3)}};

/* ---------------- GRANJA ---------------- */
NB.farm={up:90,paint(c,b){const lv=b.lvl,cl=b.cl||0,bc=palc('farm',b),w=3,h=3;
 /* molino al fondo */
 vol(c,{x:.1,y:.1,w:.55,h:.55,z:26,z0:3,col:'#d9d2bd',mat:'plaster',seed:3});hip(c,{x:.1,y:.1,w:.55,h:.55,z:29,rh:8,col:'#7a4a32',oh:.08});
 {const m=K.M(.375,.375),p=K.RV(m[0],m[1]+.33,24);K.seg(c,m[0]-.2,m[1]+.3,.4,.1,24,28);c.fillStyle=OLC;c.beginPath();c.arc(p[0],p[1],3.2,0,7);c.fill()}
 /* granero */
 vol(c,{x:1.95,y:.12,w:.95,h:.95,z:14,z0:3,col:bc,mat:'plank',seed:5,decL:(c,len,H)=>{c.fillStyle=OLC;c.fillRect(len/2-7.6,-13.5,15.2,13.5);c.fillStyle='#f0e6cf';c.fillRect(len/2-6.4,-12.3,12.8,12.3);c.fillStyle=bc;c.fillRect(len/2-5.2,-11.1,10.4,11.1);c.strokeStyle='#f0e6cf';c.lineWidth=1.4;c.beginPath();c.moveTo(len/2-5.2,-11.1);c.lineTo(len/2+5.2,0);c.moveTo(len/2+5.2,-11.1);c.lineTo(len/2-5.2,0);c.moveTo(len/2,-11.1);c.lineTo(len/2,0);c.stroke()}});
 gableY(c,{x:1.95,y:.12,w:.95,h:.95,z:17,rh:9,col:'#6a4a38',wallCol:bc,mat:'plank',seed:6,oh:.12,rows:5,gable:(c,len,rh)=>{wnd(c,len/2-3.5,-rh+3.2,7,5,{t:'board',frame:'#f0e6cf'})}});
 /* bancal elevado */
 vol(c,{x:.05,y:.7,w:1.85,h:2.25,z:3,col:'#7a5634',mat:'plank',seed:8,topCol:'#5b3c25'});
 vol(c,{x:1.95,y:1.15,w:.95,h:1.8,z:3,col:'#7a5634',mat:'plank',seed:9,topCol:'#5b3c25'});
 /* cultivos por filas */
 const crops=[['#5da53f','#88c957',null],['#4f9a3a','#6fbf4e','#e0483a'],['#9ab13e','#d6c354','#f0d36a'],['#58a640','#86cf5a',null],['#4f9a3a','#6fbf4e','#e0483a']];
 for(let r=0;r<5;r++){const v=.95+r*.4,cr=crops[r%5];for(let j=0;j<(v<1.2?6:(r<3?6:9));j++){const u=.28+j*.3;if(u>2.8)break;if(u>1.9&&v<1.15)continue;
   K.seg(c,u-.12,v-.12,.24,.24,3,11);const p=V(u,v,3),g=lv>=2?1.15:1;c.fillStyle=cr[0];c.beginPath();c.ellipse(p[0]-2.5,p[1]-3,3.6*g,2.6*g,-.5,0,7);c.ellipse(p[0]+2.5,p[1]-3,3.6*g,2.6*g,.5,0,7);c.fill();c.fillStyle=cr[1];c.beginPath();c.ellipse(p[0],p[1]-5.2,3.4*g,3*g,0,0,7);c.fill();c.strokeStyle='rgba(20,40,10,.7)';c.lineWidth=1.1;c.stroke();
   if(cr[2]){c.fillStyle=cr[2];c.beginPath();c.arc(p[0]+1.2,p[1]-5,1.5,0,7);c.fill()}}}
 /* espantapájaros */
 {K.seg(c,1.4,1.65,.2,.2,3,28);const p=V(1.5,1.75,3);c.strokeStyle='#6a4b2e';c.lineWidth=2.2;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]-18);c.moveTo(p[0]-8,p[1]-13);c.lineTo(p[0]+8,p[1]-13);c.stroke();c.fillStyle='#c8483a';c.fillRect(p[0]-4,p[1]-14,8,7);c.fillStyle='#e8cf8a';c.beginPath();c.arc(p[0],p[1]-20,3.6,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke();c.fillStyle='#4a3a28';c.fillRect(p[0]-5,p[1]-24,10,2.4)}
 /* valla perimetral */
 for(let i=0;i<=6;i++){post(c,.05+i*.47,3.0,0,10)}for(let i=0;i<=5;i++)post(c,.05,.7+i*.45,0,10);
 for(const hgt of[4,8])line(c,V(.05,3.0,hgt),V(2.9,3.0,hgt),'#8a6a44',1.8);wire(c,V(.05,3.0,12),V(2.9,3.0,12),14);
 {const p=V(2.4,3.12,0);cyl(c,p[0],p[1],5.6,8,'#8a6a48',{bands:1});c.fillStyle='#5aa7d0';c.beginPath();c.ellipse(p[0],p[1]-8,4.2,1.9,0,0,7);c.fill()}
},live(c,b,H){const m=H.M(.375,.375),p=H.W(m[0],m[1]+.33,24),a=T*1.6;c.strokeStyle='#e8dcc0';c.lineWidth=2.2;c.lineCap='round';for(let i=0;i<4;i++){const an=a+i*Math.PI/2;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(an)*14,p[1]+Math.sin(an)*14*.9);c.stroke()}c.fillStyle=OLC;c.beginPath();c.arc(p[0],p[1],2.2,0,7);c.fill()}};

/* ---------------- POZO ---------------- */
NB.well={up:70,paint(c,b){const lv=b.lvl;vol(c,{x:-.05,y:-.05,w:2.1,h:2.1,z:2,col:'#8d8a80',mat:'block',seed:2});
 const cx=P(1,1)[0],cy=P(1,1)[1]-2;cyl(c,cx,cy,19,12,'#a29c90',{});
 c.save();c.beginPath();c.ellipse(cx,cy,19,8.7,0,0,Math.PI);c.lineTo(cx-19,cy-12);c.restore();
 c.strokeStyle='rgba(30,18,8,.3)';c.lineWidth=1;for(let r=1;r<3;r++){c.beginPath();c.ellipse(cx,cy-r*4,19,8.7,0,0.05,Math.PI-.05);c.stroke()}
 for(let i=0;i<7;i++){const a=.15+i*.45;c.beginPath();c.moveTo(cx+Math.cos(a)*19,cy+Math.sin(a)*8.7);c.lineTo(cx+Math.cos(a)*19,cy-12+Math.sin(a)*8.7);c.stroke()}
 c.fillStyle=lg(c,cx-14,cy-12,cx+14,cy-12,[[0,'#4aa0c8'],[1,'#2a6f98']]);c.beginPath();c.ellipse(cx,cy-12,14.4,6.4,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(cx-4,cy-13,5,1.8,0,0,7);c.fill();
 for(const sx of[-1,1]){const p=[cx+sx*16,cy-6];c.fillStyle='#7a5636';c.fillRect(p[0]-2,p[1]-34,4,36);c.strokeStyle=OLC;c.lineWidth=1.4;c.strokeRect(p[0]-2,p[1]-34,4,36)}
 /* tejadillo */
 const a=[cx-22,cy-38],b2=[cx+22,cy-38],t=[cx,cy-52];pl(c,[[cx-22,cy-33],[cx+22,cy-33],[cx+16,cy-46],[cx-16,cy-46]],lg(c,0,cy-46,0,cy-33,[[0,'#b8503a'],[1,'#8a3a2a']]),OLC,2);
 for(let i=1;i<4;i++)line(c,[cx-22+i*2.4,cy-33-i*3.2],[cx+22-i*2.4,cy-33-i*3.2],'rgba(25,12,6,.35)',1);line(c,[cx-22,cy-33],[cx+22,cy-33],'rgba(255,255,255,.3)',1.3);
 line(c,[cx,cy-46],[cx,cy-33],'rgba(0,0,0,0)',0);
 /* manivela */
 line(c,[cx-16,cy-26],[cx+16,cy-26],'#6a4a2a',3);c.fillStyle='#8a8f94';c.beginPath();c.arc(cx+16,cy-26,3.2,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke();
 sacks(c,.2,2.05,2);crate(c,1.8,1.95,0,.34)},
live(c,b,H){/* agua: ondas que se abren y un brillo que se mueve */{const w=H.L(1,1,14),id=b.id||0;c.save();c.beginPath();c.ellipse(w[0],w[1],14,6.2,0,0,7);c.clip();c.lineWidth=1;for(let k=0;k<3;k++){const ph=(T*.6+k/3+id*.13)%1,r=2+ph*12;c.strokeStyle='rgba(220,245,255,'+(.5*(1-ph))+')';c.beginPath();c.ellipse(w[0]+Math.sin(id)*3,w[1],r,r*.44,0,0,7);c.stroke()}c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(w[0]-6+Math.sin(T*1.3+id)*5,w[1]-1.5,3.5,1,0,0,7);c.fill();c.restore()}
 const p=H.L(1,1,26),o=Math.sin(T*2+(b.id||0))*4;c.strokeStyle='#d8c6a0';c.lineWidth=1.2;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]+14+o);c.stroke();c.fillStyle='#7a5a38';c.fillRect(p[0]-3.4,p[1]+14+o,6.8,6);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(p[0]-3.4,p[1]+14+o,6.8,6)}};
})();
