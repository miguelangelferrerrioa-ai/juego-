/* ===== Dead Town · Batalla final: la Torre del Consejo (fortaleza tecnológica, vista isométrica) ===== */
(function(){
const GW=52,GH=44;
const rnd=(a,b)=>a+Math.random()*(b-a);
const pj=(i,j)=>[(i-j)*32,(i+j)*16];
const NEED=4000,ES=Math.sqrt(NEED/300);
const A=()=>S.arc||(S.arc={s:{},ann:{}});
/* ---------- objetos nuevos: armas y atuendos de la era del Consejo ---------- */
(function(){try{const O=window.OUTFITS,V=window.OUTV,W=WP;
 const addO=(n,def,b,r,v,c)=>{if(!O[n]){O[n]={n,def,b,r,c};V[n]=v}};
 addO('Exoarmadura Aegis',14,{Soldado:8,Explorador:3},'X',['#2b3a48','#18222c','#5ae6ff','vest'],{metal:500,comp:100,chem:40});
 addO('Traje de sigilo Umbra',11,{Explorador:7,Soldado:4},'X',['#1d2228','#101418','#ff4a6a','tactical'],{metal:200,comp:90,chem:60});
 [['Rifle de plasma',36,{Soldado:7},'X',{metal:400,comp:80,chem:30}],['Fusil gauss',44,{Soldado:8,Explorador:3},'X',{metal:600,comp:120,chem:50}]].forEach(([n,v,b,r,c])=>{if(!W.some(w=>w.n===n))W.push({n,v,c,b,r})})}catch(e){console.error(e)}})();

/* ---------- diseño de la fortaleza ---------- */
function srng(s){return()=>((s=(s*16807)%2147483647)-1)/2147483646}
function layout(fk){setFk(fk);const LW=CFG.lay||{},R=srng(CFG.seed||11),bl=[],mk=(key,type,x,y,w,h,lvl)=>bl.push({key,type,x,y,w,h,lvl:lvl||3,hp:1,rot:0,cl:0});
 const SIZE={pod:[2,2],hangar:[3,3],hydro:[3,3],gen:[2,2],serv:[3,3]};
 const colsL=[2,8,14],colsR=[32,38,44];let n=0;
 [4,9,14,27,32,37].forEach((y0,ri)=>{[...colsL,...colsR].forEach((x0,ci)=>{const r=R();let t;if(ri===3)t='hangar';else if(ri===0&&ci===1)t='serv';else if(ri===4&&ci%3===1)t='gen';else if(r<(LW.hydro??.12))t='hydro';else if(r<(LW.hydro??.12)+(LW.hangar??.08))t='hangar';else if(r<(LW.hydro??.12)+(LW.hangar??.08)+(LW.serv??.1))t='serv';else t='pod';
  const [w,h]=SIZE[t];if(t==='pod'&&R()<.45){mk('b'+(++n),'pod',x0+.5,y0+.5,2,2,4);mk('b'+(++n),'pod',x0+3.5,y0+1.5,2,2,3)}else mk('b'+(++n),t,x0+1,y0+1,w,h,t==='hangar'?4:3)})});
 mk('hq','core',24,5,4,4,5);mk('kh1','bunker',22,11,2,2,4);mk('kh2','bunker',28,11,2,2,4);
 return bl}

/* ---------- suelo ---------- */
function tileCol(i,j,st,r,fk){const pl=(window._ASFAC&&_ASFAC[fk]&&_ASFAC[fk].pal)||['#222a31','#1f262c','#343e48','#2f3841'];return st?((i+j)%2?pl[2]:pl[3]):(r<.5?pl[0]:pl[1])}
function tileFx(x,a,b,c,d,i,j,st,r){x.strokeStyle=AR+(st?.16:.09)+')';x.lineWidth=1;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);if(i%2===0){x.moveTo(a[0],a[1]);x.lineTo(d[0],d[1])}x.stroke();
 if(st&&(i+j)%5===0){x.fillStyle=AR+'.35)';x.beginPath();x.ellipse((a[0]+c[0])/2,(a[1]+c[1])/2,7,3.5,0,0,7);x.fill()}
 else if(!st&&r<.05){x.fillStyle=AR+'.28)';x.beginPath();x.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2+2);x.lineTo((b[0]+c[0])/2-3,(b[1]+c[1])/2);x.lineTo((c[0]+d[0])/2,(c[1]+d[1])/2-2);x.lineTo((d[0]+a[0])/2+3,(d[1]+a[1])/2);x.fill()}}

/* ---------- primitivas isométricas ---------- */
const up=(p,z)=>[p[0],p[1]-z];
function poly(c,pts,col,st){c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();if(st){c.strokeStyle=st;c.lineWidth=1;c.stroke()}}
function box(c,x0,y0,w,d,z0,z1,top,L,R,rim){const A_=pj(x0,y0),B=pj(x0+w,y0),C=pj(x0+w,y0+d),D=pj(x0,y0+d);
 poly(c,[up(D,z0),up(C,z0),up(C,z1),up(D,z1)],L);poly(c,[up(C,z0),up(B,z0),up(B,z1),up(C,z1)],R);poly(c,[up(A_,z1),up(B,z1),up(C,z1),up(D,z1)],top,'rgba(255,255,255,.16)');
 c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.beginPath();const cc=up(C,z0),cd=up(C,z1);c.moveTo(cc[0],cc[1]);c.lineTo(cd[0],cd[1]);c.stroke();
 if(rim){strip(c,x0,y0,w,d,'L',0,1,z1-5,z1-2.4,rim[0]);strip(c,x0,y0,w,d,'R',0,1,z1-5,z1-2.4,rim[1])}}
function strip(c,x0,y0,w,d,f,t0,t1,z0,z1,col){let p1,p2;if(f==='L'){p1=pj(x0+t0*w,y0+d);p2=pj(x0+t1*w,y0+d)}else{p1=pj(x0+w,y0+t0*d);p2=pj(x0+w,y0+t1*d)}poly(c,[up(p1,z0),up(p2,z0),up(p2,z1),up(p1,z1)],col)}
function cyl(c,cx,cy,rad,z0,z1,top,side,dark){const p=pj(cx,cy);const g=c.createLinearGradient(p[0]-rad,0,p[0]+rad,0);g.addColorStop(0,side);g.addColorStop(.55,dark);g.addColorStop(1,'#0c1014');
 c.fillStyle=g;c.beginPath();c.ellipse(p[0],p[1]-z0,rad,rad/2,0,0,Math.PI);c.lineTo(p[0]-rad,p[1]-z1);c.ellipse(p[0],p[1]-z1,rad,rad/2,0,Math.PI,0,true);c.lineTo(p[0]+rad,p[1]-z0);c.fill();
 c.fillStyle=top;c.beginPath();c.ellipse(p[0],p[1]-z1,rad,rad/2,0,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.18)';c.stroke()}
let CY='#5ae6ff',CY2='#2aa4c4',HUE=0,AR='rgba(90,230,255,',CFG={};
function rotC(hex,deg){let r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,l=(mx+mn)/2,d=mx-mn,sa=d?d/(1-Math.abs(2*l-1)):0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60}h=(h+deg+360)%360;const C_=(1-Math.abs(2*l-1))*sa,X_=C_*(1-Math.abs((h/60)%2-1)),m=l-C_/2;let q=h<60?[C_,X_,0]:h<120?[X_,C_,0]:h<180?[0,C_,X_]:h<240?[0,X_,C_]:h<300?[X_,0,C_]:[C_,0,X_];return q.map(v=>Math.round((v+m)*255))}
function setFk(fk){CFG=(window._ASFAC&&_ASFAC[fk])||{};HUE=CFG.hue||0;const a=rotC('#5ae6ff',HUE),b=rotC('#2aa4c4',HUE),h2=v=>'#'+v.map(x=>x.toString(16).padStart(2,'0')).join('');CY=h2(a);CY2=h2(b);AR='rgba('+a.join(',')+',';PTR.trim=PTR.acc=PTR.vis=CY;TY.tr.tc=CY;TY.dr.tc=h2(rotC('#ff4a4a',HUE))}
function shadow(c,w,h,z){c.fillStyle='rgba(0,0,0,.34)';const a=pj(.1,.1),b=pj(w+.1+z/60,.1),cc=pj(w+.1+z/60,h+.1+z/60),d=pj(.1,h+.1+z/60);poly(c,[a,b,cc,d],'rgba(0,0,0,.34)')}
function led(c,seed,face,x0,y0,w,d,z0,z1,cols){let s=seed;const R=()=>((s=(s*16807)%2147483647)-1)/2147483646;for(let z=z0;z<z1;z+=4.6)for(let t=.08;t<.95;t+=.085){if(R()<.35)continue;const col=cols[Math.floor(R()*cols.length)];strip(c,x0,y0,w,d,face,t,t+.04,z,z+1.7,col)}}

/* ---------- sprites de edificios (cacheados) ---------- */
const K=1.5,SPR={};
function mkSpr(key0,w,h,zMax,fn){const key=key0+'@'+HUE;if(SPR[key])return SPR[key];const ox=h*32+24,oy=zMax+28,W=(w+h)*32+48,H=(w+h)*16+zMax+56;const cv=document.createElement('canvas');cv.width=Math.round(W*K);cv.height=Math.round(H*K);const c=cv.getContext('2d');c.scale(K,K);c.translate(ox,oy);fn(c);let out=cv;if(HUE){out=document.createElement('canvas');out.width=cv.width;out.height=cv.height;const o=out.getContext('2d');o.filter='hue-rotate('+HUE+'deg)';o.drawImage(cv,0,0)}return SPR[key]={cv:out,ox,oy}}
const DR={
 pod(c,b){const hi=b.lvl>=4,Z=hi?42:34;shadow(c,2,2,Z);box(c,.08,.08,1.84,1.84,0,5,'#2d353d','#1c2227','#262d34');box(c,.2,.2,1.6,1.6,5,Z,'#eef2f5','#b9c3cb','#8e99a3',['#5ae6ff','#2aa4c4']);
  strip(c,.2,.2,1.6,1.6,'L',.14,.86,16,24,'#14323f');strip(c,.2,.2,1.6,1.6,'L',.16,.84,17.5,22.5,CY);strip(c,.2,.2,1.6,1.6,'R',.14,.86,16,24,'#10303c');strip(c,.2,.2,1.6,1.6,'R',.16,.84,17.5,22.5,CY2);
  if(hi){strip(c,.2,.2,1.6,1.6,'L',.14,.86,29,35,'#14323f');strip(c,.2,.2,1.6,1.6,'L',.16,.84,30,34,CY);strip(c,.2,.2,1.6,1.6,'R',.14,.86,29,35,'#10303c')}
  box(c,.6,.6,.6,.6,Z,Z+5,'#2a3138','#1a2026','#222a30');const p=pj(.9,.9);c.fillStyle=CY;c.fillRect(p[0]-2,p[1]-Z-8,4,2);c.strokeStyle='#8fa0ad';c.lineWidth=1.4;c.beginPath();c.moveTo(p[0]+8,p[1]-Z-2);c.lineTo(p[0]+8,p[1]-Z-18);c.stroke();c.fillStyle='#ff4a6a';c.fillRect(p[0]+7,p[1]-Z-20,3,3)},
 bunker(c,b){shadow(c,2,2,30);box(c,.06,.06,1.88,1.88,0,28,'#3a434c','#232a31','#2c343c',['#ff4a6a','#c0334e']);strip(c,.06,.06,1.88,1.88,'L',.2,.8,10,18,'#0e1317');strip(c,.06,.06,1.88,1.88,'L',.22,.78,13,15,'#ff4a6a');strip(c,.06,.06,1.88,1.88,'R',.2,.8,10,18,'#0e1317');strip(c,.06,.06,1.88,1.88,'R',.22,.78,13,15,'#c0334e');box(c,.5,.5,.9,.9,28,36,'#2a3138','#1a2026','#222a30');const p=pj(.95,.95);c.strokeStyle='#ff4a6a';c.lineWidth=2;c.beginPath();c.moveTo(p[0],p[1]-40);c.lineTo(p[0]+14,p[1]-50);c.stroke()},
 hangar(c,b){shadow(c,3,3,34);box(c,.15,.15,2.7,2.7,0,32,'#46515b','#2b333b','#38424b',['#5ae6ff','#2aa4c4']);
  for(let k=0;k<9;k++){const col=k%2?'#e8a020':'#171a1d';strip(c,.15,.15,2.7,2.7,'L',k/9,(k+1)/9,0,5,col);strip(c,.15,.15,2.7,2.7,'R',k/9,(k+1)/9,0,5,col)}
  strip(c,.15,.15,2.7,2.7,'R',.18,.82,5,24,'#0c1115');for(let k=0;k<5;k++)strip(c,.15,.15,2.7,2.7,'R',.2,.8,6+k*3.6,7.6+k*3.6,'#1a232a');strip(c,.15,.15,2.7,2.7,'R',.18,.82,24,26,CY);strip(c,.15,.15,2.7,2.7,'R',.18,.19,5,24,CY);strip(c,.15,.15,2.7,2.7,'R',.81,.82,5,24,CY);
  strip(c,.15,.15,2.7,2.7,'L',.15,.85,12,20,'#10161b');strip(c,.15,.15,2.7,2.7,'L',.17,.83,15,17,'rgba(255,170,60,.9)');
  const p=pj(1.5,1.5);c.fillStyle='#1c242b';c.beginPath();c.ellipse(p[0],p[1]-32,34,17,0,0,7);c.fill();c.strokeStyle=CY;c.lineWidth=1.6;c.beginPath();c.ellipse(p[0],p[1]-32,30,15,0,0,7);c.stroke();c.font='bold 15px sans-serif';c.fillStyle='#8fe9ff';c.textAlign='center';c.fillText('H',p[0],p[1]-27);
  [[.25,.25],[2.35,.25],[.25,2.35],[2.35,2.35]].forEach(([x,y])=>{box(c,x,y,.4,.4,32,44,'#2a3138','#1a2026','#222a30');const q=pj(x+.2,y+.2);c.fillStyle=CY;c.fillRect(q[0]-2,q[1]-47,4,3)})},
 hydro(c,b){shadow(c,3,3,28);box(c,.1,.1,2.8,2.8,0,7,'#3a4752','#232d35','#2c3841');
  for(let k=0;k<5;k++){const y=.45+k*.5,a=pj(.35,y),bb=pj(2.65,y),cc=pj(2.65,y+.22),d=pj(.35,y+.22);poly(c,[up(a,7.5),up(bb,7.5),up(cc,7.5),up(d,7.5)],k%2?'#46e08a':'#2cbf6c')}
  const z1=27;const A_=pj(.25,.25),B=pj(2.75,.25),C=pj(2.75,2.75),D=pj(.25,2.75);
  poly(c,[up(D,7),up(C,7),up(C,z1),up(D,z1)],'rgba(110,230,170,.30)','rgba(200,255,225,.5)');poly(c,[up(C,7),up(B,7),up(B,z1),up(C,z1)],'rgba(70,190,140,.34)','rgba(200,255,225,.45)');poly(c,[up(A_,z1),up(B,z1),up(C,z1),up(D,z1)],'rgba(150,255,200,.26)','rgba(220,255,235,.6)');
  for(let k=1;k<5;k++){const t=k/5;const p1=pj(.25+2.5*t,2.75),p2=pj(2.75,2.75-2.5*t);[p1,p2].forEach(p=>{c.strokeStyle='rgba(220,255,235,.5)';c.lineWidth=1;c.beginPath();c.moveTo(p[0],p[1]-7);c.lineTo(p[0],p[1]-z1);c.stroke()})}
  const m=pj(1.5,1.5);c.fillStyle='rgba(120,255,190,.35)';c.beginPath();c.ellipse(m[0],m[1]-14,24,12,0,0,7);c.fill()},
 gen(c,b){shadow(c,2,2,34);box(c,.1,.1,1.8,1.8,0,6,'#36424c','#222b33','#2b3640');cyl(c,1,1,25,6,34,'#5f7080','#6a7c8c','#3a4651');
  const p=pj(1,1);[14,22,29].forEach(z=>{c.strokeStyle=CY;c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1]-z,25.5,12.8,0,0,Math.PI);c.stroke()});
  c.fillStyle='#1c262e';c.beginPath();c.ellipse(p[0],p[1]-34,15,7.5,0,0,7);c.fill();c.fillStyle='rgba(90,230,255,.5)';c.beginPath();c.ellipse(p[0],p[1]-34,11,5.5,0,0,7);c.fill();
  [[.1,1.55],[1.6,.1]].forEach(([x,y])=>{box(c,x,y,.3,.3,6,22,'#4a5662','#2d3740','#38424c');const q=pj(x+.15,y+.15);c.fillStyle='#ffd84a';c.fillRect(q[0]-2,q[1]-25,4,3)})},
 serv(c,b){shadow(c,3,3,48);box(c,.2,.2,2.6,2.6,0,46,'#343c45','#1a1f25','#232930',['#5ae6ff','#2aa4c4']);led(c,31,'L',.2,.2,2.6,2.6,5,42,['#5ae6ff','#ff4ad0','#5aff9a','#2a3a44']);led(c,77,'R',.2,.2,2.6,2.6,5,42,['#2aa4c4','#c03a9a','#3acf7a','#2a3a44']);
  [[.9,.9],[1.9,1.5]].forEach(([x,y])=>{const p=pj(x+.25,y+.25);c.fillStyle='#10151a';c.beginPath();c.ellipse(p[0],p[1]-46,15,7.5,0,0,7);c.fill();c.strokeStyle='#4a5864';c.lineWidth=1.4;c.beginPath();c.ellipse(p[0],p[1]-46,15,7.5,0,0,7);c.stroke();for(let a=0;a<3;a++){const an=a*2.09;c.beginPath();c.moveTo(p[0],p[1]-46);c.lineTo(p[0]+Math.cos(an)*13,p[1]-46+Math.sin(an)*6.5);c.stroke()}})},
 core(c,b){shadow(c,4,4,120);box(c,0,0,4,4,0,18,'#46515c','#252d35','#303a44',['#5ae6ff','#2aa4c4']);strip(c,0,0,4,4,'L',.04,.96,8,11,CY);strip(c,0,0,4,4,'R',.04,.96,8,11,CY2);
  box(c,.5,.5,3,3,18,52,'#e6edf2','#b4bfc8','#8a96a1');for(let k=0;k<5;k++){const t=.12+k*.17;strip(c,.5,.5,3,3,'L',t,t+.09,22,48,'#14323f');strip(c,.5,.5,3,3,'L',t+.015,t+.075,23,47,CY);strip(c,.5,.5,3,3,'R',t,t+.09,22,48,'#10303c');strip(c,.5,.5,3,3,'R',t+.015,t+.075,23,47,CY2)}
  strip(c,.5,.5,3,3,'L',0,1,50,52.6,CY);strip(c,.5,.5,3,3,'R',0,1,50,52.6,CY2);
  box(c,1,1,2,2,52,96,'#d4dde4','#a2adb7','#7c8893');for(let k=0;k<3;k++){const t=.14+k*.3;strip(c,1,1,2,2,'L',t,t+.16,58,92,'#14323f');strip(c,1,1,2,2,'L',t+.03,t+.13,59,91,CY);strip(c,1,1,2,2,'R',t,t+.16,58,92,'#10303c');strip(c,1,1,2,2,'R',t+.03,t+.13,59,91,CY2)}
  strip(c,1,1,2,2,'L',0,1,94,96.6,CY);strip(c,1,1,2,2,'R',0,1,94,96.6,CY2);
  box(c,1.4,1.4,1.2,1.2,96,118,'#2c353d','#1a2026','#222a30');const p=pj(2,2);c.fillStyle=CY;[104,110].forEach(z=>{c.globalAlpha=.8;c.fillRect(p[0]-16,p[1]-z,32,2);c.globalAlpha=1});
  c.strokeStyle='#9fb0bd';c.lineWidth=2;c.beginPath();c.moveTo(p[0],p[1]-118);c.lineTo(p[0],p[1]-160);c.stroke();c.lineWidth=1.4;[-12,12].forEach(dx=>{c.beginPath();c.moveTo(p[0],p[1]-132);c.lineTo(p[0]+dx,p[1]-142);c.stroke()})},
 tower(c,b){shadow(c,2,2,60);box(c,0,0,2,2,0,12,'#3a444e','#222a31','#2c353d',['#5ae6ff','#2aa4c4']);cyl(c,1,1,15,12,56,'#5e6c79','#6c7d8c','#38434d');const p=pj(1,1);[22,32,44].forEach((z,i)=>{c.strokeStyle=i===1?'#ff4a6a':CY;c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1]-z,15.4,7.7,0,0,Math.PI);c.stroke()});
  c.fillStyle='#252e36';c.beginPath();c.ellipse(p[0],p[1]-56,18,9,0,0,7);c.fill()}
};
function sprOf(b){const t=b.type;const dim={pod:[2,2,50],bunker:[2,2,50],hangar:[3,3,56],hydro:[3,3,44],gen:[2,2,52],serv:[3,3,62],core:[4,4,180]}[t];return mkSpr(t+(b.lvl>=4?'4':''),dim[0],dim[1],dim[2],c=>DR[t](c,b))}
function drawB(c,b,T){const s=sprOf(b),q=pj(b.x,b.y);c.drawImage(s.cv,q[0]-s.ox,q[1]-s.oy,s.cv.width/K,s.cv.height/K);
 const ph=T*3+b.x*1.3;
 if(b.type==='core'){const p=pj(b.x+2,b.y+2);const a=.5+.4*Math.sin(T*2.2);c.fillStyle=AR+(.25+.25*a)+')';c.beginPath();c.arc(p[0],p[1]-160,9+3*a,0,7);c.fill();c.fillStyle='#fff';c.globalAlpha=.9;c.beginPath();c.arc(p[0],p[1]-160,2.6,0,7);c.fill();c.globalAlpha=1;c.strokeStyle=AR+(.2+.2*a)+')';c.lineWidth=3;c.beginPath();c.moveTo(p[0],p[1]-165);c.lineTo(p[0],p[1]-330);c.stroke()}
 else if(b.type==='gen'){const p=pj(b.x+1,b.y+1);const a=.5+.5*Math.sin(T*4+b.x);c.fillStyle=AR+(.25+.3*a)+')';c.beginPath();c.ellipse(p[0],p[1]-34,10,5,0,0,7);c.fill();c.strokeStyle='rgba(220,235,255,'+(.3+.4*a)+')';c.lineWidth=1.4;c.beginPath();c.ellipse(p[0],p[1]-34,15+3*a,7.5+1.5*a,0,0,7);c.stroke()}
 else if(b.type==='serv'){for(let k=0;k<4;k++){if(Math.sin(T*5+b.x*3+k*2.1)>.3){const p=pj(b.x+.2+(k%2)*.8+.4,b.y+2.8);c.fillStyle=k%2?'#ff4ad0':CY;c.fillRect(p[0]-6+k*5,p[1]-30-k*4,2.4,2.4)}}}
 else if(b.type==='hangar'){const p=pj(b.x+1.5,b.y+1.5);const a=Math.sin(T*3+b.y)*.5+.5;c.strokeStyle=AR+(.25+.4*a)+')';c.lineWidth=2;c.beginPath();c.ellipse(p[0],p[1]-32,22+a*5,11+a*2.5,0,0,7);c.stroke()}
 else if(b.type==='hydro'){const p=pj(b.x+1.5,b.y+1.5);c.fillStyle='rgba(140,255,190,'+(.06+.05*Math.sin(T*2+b.x))+')';c.beginPath();c.ellipse(p[0],p[1]-18,34,17,0,0,7);c.fill()}
 else if(b.type==='bunker'){const p=pj(b.x+1,b.y+1);c.fillStyle='rgba(255,74,106,'+(.4+.4*Math.sin(T*6+b.x))+')';c.beginPath();c.arc(p[0]+14,p[1]-48,2.4,0,7);c.fill()}}

/* ---------- muros y torretas ---------- */
const WH=26;
function wallSpr(type,mask){const key='w'+type+mask;return mkSpr(key,1,1,WH+14,c=>{
 const cs=type==='gate'?['#566470','#313b44','#3f4a55']:['#434e59','#272f37','#323c46'];
 if(type==='gate'){const hor=(mask&3)>0;
  if(hor){box(c,0,.12,1,.76,0,WH+6,'#5c6a77','#2d363f','#3a4550',['#ff4a6a','#c0334e']);strip(c,0,.12,1,.76,'L',.08,.92,4,WH,'#161d23');strip(c,0,.12,1,.76,'R',.1,.9,4,WH,'#12181d');for(let k=0;k<3;k++){strip(c,0,.12,1,.76,'L',.12,.88,8+k*7,9.6+k*7,'#e8a020')}strip(c,0,.12,1,.76,'R',.45,.55,4,WH,'#0a0e12')}
  else{box(c,.12,0,.76,1,0,WH+6,'#5c6a77','#2d363f','#3a4550',['#ff4a6a','#c0334e']);strip(c,.12,0,.76,1,'L',.1,.9,4,WH,'#161d23');strip(c,.12,0,.76,1,'R',.08,.92,4,WH,'#12181d')}
  return}
 const arm=(x,y,w,d)=>box(c,x,y,w,d,0,WH,cs[0],cs[1],cs[2],['#46e0ff','#2aa8c8']);
 if(mask&1)arm(0,.27,.5,.46);if(mask&4)arm(.27,0,.46,.5);
 box(c,.16,.16,.68,.68,0,WH+7,'#55616d','#2b343c','#38424c');const p=pj(.5,.5);c.fillStyle=CY;c.fillRect(p[0]-2.5,p[1]-WH-10,5,3);
 if(mask&2)arm(.5,.27,.5,.46);if(mask&8)arm(.27,.5,.46,.5)})}
function drawW(c,w,T){const s=wallSpr(w.type,(w.mask|0)&15),q=pj(w.x,w.y);c.drawImage(s.cv,q[0]-s.ox,q[1]-s.oy,s.cv.width/K,s.cv.height/K);
 if(w.type==='gate'){const p=pj(w.x+.5,w.y+.5),a=.5+.5*Math.sin(T*5);c.fillStyle='rgba(255,74,106,'+(.35+.4*a)+')';c.beginPath();c.arc(p[0],p[1]-WH-8,2.6,0,7);c.fill()}
 else if(((w.x+w.y)&3)===0){const p=pj(w.x+.5,w.y+.5),a=.5+.5*Math.sin(T*3+w.x);c.fillStyle='rgba(120,240,255,'+(.3+.5*a)+')';c.fillRect(p[0]-2.5,p[1]-WH-10,5,3)}}
function drawT(c,t,e,T){const s=mkSpr('tower',2,2,70,c=>DR.tower(c,t)),q=pj(t.x,t.y);c.drawImage(s.cv,q[0]-s.ox,q[1]-s.oy,s.cv.width/K,s.cv.height/K);
 const p=pj(t.x+1,t.y+1),hy=p[1]-58,a=(e&&e.aim)||0,vx=(Math.cos(a)-Math.sin(a))*32,vy=(Math.cos(a)+Math.sin(a))*16,vl=Math.hypot(vx,vy)||1,bx=vx/vl*24,by=vy/vl*12,st=e&&e.stun>0;
 c.fillStyle='#29323a';c.beginPath();c.ellipse(p[0],hy-6,12,7,0,0,7);c.fill();c.strokeStyle=st?'#6a7580':'#2b8aa6';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(p[0],hy-8);c.lineTo(p[0]+bx,hy-8+by);c.stroke();c.strokeStyle='#1a2026';c.lineWidth=2.4;c.beginPath();c.moveTo(p[0],hy-8);c.lineTo(p[0]+bx,hy-8+by);c.stroke();c.lineCap='butt';
 const fire=e&&e.at>0;c.fillStyle=st?'#6a7580':(fire?'#fff':CY);c.globalAlpha=st?.8:(.6+.3*Math.sin(T*6));c.beginPath();c.arc(p[0],hy-9,fire?5:3,0,7);c.fill();c.globalAlpha=1;
 if(st){c.strokeStyle='#ffe86a';c.lineWidth=1.4;c.beginPath();c.moveTo(p[0]-6,hy-22);c.lineTo(p[0]-2,hy-16);c.lineTo(p[0]-5,hy-14);c.lineTo(p[0]+3,hy-8);c.stroke()}}

/* ---------- enemigos ---------- */
const TY={
 tr:{hp:80,dmg:8,rng:6.3,rate:1.3,sp:1.7,gun:1,tc:'#5ae6ff',tw:1.8},
 el:{hp:230,dmg:13,rng:6,rate:1.1,sp:1.5,gun:1,tc:'#ff5a8a',tw:2.2,sh:130},
 dr:{hp:34,dmg:5,rng:5.5,rate:1.8,sp:3.2,gun:1,fly:1,tc:'#ff4a4a',tw:1.4},
 mk:{hp:650,dmg:21,rng:7.2,rate:.7,sp:1.1,gun:1,big:1,tc:'#ffd84a',tw:3.6,sh:200},
 b:{hp:3600,dmg:21,rng:7,rate:.85,sp:1.2,gun:1,big:1,boss:1,tc:'#ff3a5a',tw:4.2,sh:2200},
 bh:{hp:4200,dmg:19,rng:6.5,rate:1,sp:1.5,gun:1,big:1,boss:1,tc:'#ffd84a',tw:3.4,sh:1600},
 zb:{hp:70,dmg:7,rng:1.1,rate:1,sp:1.9,gun:0},
 hl:{hp:30,dmg:0,rng:1,rate:1,sp:2.2,gun:0,tc:'#ff5a8a'},
 cap:{hp:260,dmg:0,rng:0,rate:0,sp:0,gun:0,fixed:1}};
const TM={hp:1,dmg:1,cnt:1};
function mkE(AS,k,x,y){const T=TY[k],hs=Math.pow(AS.es*TM.hp,.95),ds=Math.pow(AS.es*TM.dmg,.45);
 const u=Object.assign({e:1,k,band:'consejo',x,y,hx:x,hy:y,cd:rnd(0,1),guard:1,dx:1,mv:0,at:0,sd:1+Math.floor(Math.random()*90),path:[],pt:0,hpP:0,t:'b'},T);
 u.hp=u.mhp=T.hp*hs;u.dmg=T.dmg*ds;if(T.sh){u.sh=u.shX=T.sh*hs;u.shM=k==='b'?0:u.sh}if(u.boss){u.bn=k==='b'?'AEGIS':(CFG.boss||'Jefe');u.aT=8}return u}
function enemies(W,AS){setFk(AS.fk);const E=[],cs=Math.pow(AS.es*TM.cnt,.8),mx=CFG.mix||{tr:5,el:3,dr:1,mk:1},bag=[];Object.keys(mx).forEach(k=>{for(let n=0;n<mx[k];n++)bag.push(k)});let pi=0;const pick=()=>bag[(pi++)%bag.length],e=(k,x,y)=>{const u=mkE(AS,k,x,y);E.push(u);return u};
 const cc=CFG.cnt||1,N=n=>Math.round(n*cs*cc);
 const nG=N(4.5);for(let i=0;i<nG;i++)e(pick(),rnd(21,31),rnd(GH-8,GH-3));
 W.bl.filter(b=>b.type==='hangar').forEach(b=>{const n=Math.max(2,Math.round(1.6*cs*cc));for(let i=0;i<n;i++)e(pick(),b.x+rnd(0,b.w),b.y+b.h+rnd(.6,1.6));if(!CFG.noDr)for(let i=0;i<2;i++)e('dr',b.x+rnd(0,b.w),b.y+rnd(0,b.h))});
 for(let i=0;i<N(4.5);i++)e(i%5===0?'mk':pick(),rnd(24,28),rnd(18,40));
 for(let i=0;i<N(4);i++)e(pick(),rnd(2,GW-2),rnd(21,26));
 for(let i=0;i<N(5);i++)e(i%4===0?'mk':pick(),rnd(22,29),rnd(4,15));
 const bk=CFG.bossK||'b',bu=e(bk,25.5,12.5);if(CFG.boss)bu.bn=CFG.boss;if(bk==='bh'&&CFG.bp)bu.bp=CFG.bp;
 W.WL.T.forEach(t=>{const hs=Math.pow(AS.es*TM.hp,.95),ds=Math.pow(AS.es*TM.dmg,.45);E.push({e:1,tow:1,tr:t,band:AS.fk,x:t.x+1,y:t.y+1,hx:t.x+1,hy:t.y+1,hp:t.hp,mhp:t.mhp,dmg:7*ds*.7,rng:8.2,rate:1.3,cd:rnd(0,1),gun:1,dx:1,mv:0,at:0,sd:7,path:[],guard:0,sp:0,tc:CY,tw:2.6,aim:0})});
 return E}
/* dibujo de enemigos */
function sparks(c,q,y){c.strokeStyle='#ffe86a';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0]-6,q[1]-y);c.lineTo(q[0]-1,q[1]-y+5);c.lineTo(q[0]-4,q[1]-y+7);c.lineTo(q[0]+5,q[1]-y+14);c.stroke()}
function trooper(c,q,e,s,pal,T){const f=e.dx>=0?1:-1,w=e.mv?Math.sin(T*11+e.sd)*4*s:0;c.save();c.translate(q[0],q[1]);c.scale(s,s);
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(0,1,9,3.6,0,0,7);c.fill();
 c.strokeStyle=pal.leg;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-3,-14);c.lineTo(-3+w/s,-1);c.moveTo(3,-14);c.lineTo(3-w/s,-1);c.stroke();c.strokeStyle=pal.trim;c.lineWidth=1.4;c.beginPath();c.moveTo(-5,-8);c.lineTo(-1,-8);c.moveTo(1,-8);c.lineTo(5,-8);c.stroke();c.lineCap='butt';
 c.fillStyle=pal.pack;c.fillRect(-f*8-3,-30,6,12);
 c.fillStyle=pal.body;c.strokeStyle=pal.edge;c.lineWidth=1;c.beginPath();c.roundRect?c.roundRect(-6.5,-31,13,16,3):c.rect(-6.5,-31,13,16);c.fill();c.stroke();
 c.fillStyle=pal.acc;c.fillRect(-2+f*1,-26,4,2.4);c.fillRect(-6.5,-18,13,1.6);
 c.fillStyle=pal.helm;c.beginPath();c.arc(0,-35,5.4,0,7);c.fill();c.fillStyle=pal.vis;c.beginPath();c.ellipse(f*2.4,-35,3.2,1.8,0,0,7);c.fill();
 if(!pal.nr){c.strokeStyle='#1b2228';c.lineWidth=3.2;c.beginPath();c.moveTo(f*2,-25);c.lineTo(f*19,-28);c.stroke();c.strokeStyle=pal.acc;c.lineWidth=1.6;c.beginPath();c.moveTo(f*12,-27);c.lineTo(f*21,-28.4);c.stroke()}else{c.strokeStyle=pal.leg;c.lineWidth=3;c.beginPath();c.moveTo(f*2,-26);c.lineTo(f*12,-27);c.stroke()}
 if(e.at>0){c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(f*22,-28.6,3,0,7);c.fill();c.fillStyle=pal.acc;c.globalAlpha=.5;c.beginPath();c.arc(f*22,-28.6,6,0,7);c.fill();c.globalAlpha=1}
 if(e.sh>0&&e.shX){const a=Math.min(1,e.sh/e.shX);c.strokeStyle='rgba(120,235,255,'+(.35+.4*a)+')';c.lineWidth=2;c.beginPath();c.ellipse(f*5,-22,10,17,0,-1.3,1.3);c.stroke();c.fillStyle='rgba(120,235,255,'+(.08+.14*a)+')';c.beginPath();c.ellipse(f*5,-22,10,17,0,-1.3,1.3);c.fill()}
 c.restore();if(e.stun>0)sparks(c,q,48*s)}
const PTR={leg:'#1b2229',trim:'#5ae6ff',pack:'#252d34',body:'#e1e8ed',edge:'#59636c',acc:'#5ae6ff',helm:'#20272e',vis:'#5ae6ff'};
const PEL={leg:'#14181c',trim:'#e0b34a',pack:'#1b2126',body:'#2e353c',edge:'#e0b34a',acc:'#ff5a8a',helm:'#161b20',vis:'#ff4a6a'};
function drone(c,q,e,T){const z=32+Math.sin(T*4+e.sd)*3;c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q[0],q[1]+1,8,3,0,0,7);c.fill();c.save();c.translate(q[0],q[1]-z);if(e.stun>0)c.globalAlpha=.6;
 [[-11,-2],[11,-2],[-8,3],[8,3]].forEach(([dx,dy],i)=>{c.strokeStyle='#39444d';c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(dx,dy);c.stroke();c.fillStyle='rgba(180,220,240,'+(e.stun>0?.1:.35)+')';c.beginPath();c.ellipse(dx,dy-1,6,2.2,0,0,7);c.fill()});
 c.fillStyle='#2b343c';c.beginPath();c.ellipse(0,0,8,4.6,0,0,7);c.fill();c.strokeStyle='#59636c';c.lineWidth=1;c.stroke();c.fillStyle=e.stun>0?'#777':(e.at>0?'#fff':'#ff4a4a');c.beginPath();c.arc(0,1,2.4,0,7);c.fill();
 c.fillStyle=AR+'.35)';c.beginPath();c.ellipse(0,5,6,2,0,0,7);c.fill();c.restore();if(e.stun>0)sparks(c,q,z+6)}
function mech(c,q,e,s,T){const f=e.dx>=0?1:-1,w=e.mv?Math.sin(T*6+e.sd)*5:0,boss=e.boss;c.save();c.translate(q[0],q[1]);c.scale(s,s);
 c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(0,1,14,5,0,0,7);c.fill();
 c.strokeStyle='#2c353d';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-6,-22);c.lineTo(-8+w,-9);c.lineTo(-7+w,-1);c.moveTo(6,-22);c.lineTo(8-w,-9);c.lineTo(7-w,-1);c.stroke();c.lineCap='butt';c.fillStyle='#1a2026';c.fillRect(-12+w,-3,10,3.5);c.fillRect(2-w,-3,10,3.5);
 c.fillStyle='#38424b';c.strokeStyle='#5f6c78';c.lineWidth=1;c.beginPath();c.rect(-11,-40,22,20);c.fill();c.stroke();c.fillStyle='#1f262c';c.fillRect(-9,-38,18,8);c.fillStyle=e.stun>0?'#777':'#ff3a3a';c.fillRect(-6+f*1,-36,12,2.6);
 c.fillStyle='#2a323a';c.fillRect(-f*17-4,-42,8,13);c.fillStyle='#ffd84a';for(let k=0;k<3;k++)c.fillRect(-f*17-3+k*2.4,-41,1.4,3);
 c.fillStyle='#2e3740';c.beginPath();c.arc(0,-44,6,0,7);c.fill();c.fillStyle='#ff3a3a';c.fillRect(f*1,-45,5,1.8);
 c.strokeStyle='#1b2228';c.lineWidth=5;c.beginPath();c.moveTo(f*8,-34);c.lineTo(f*26,-37);c.stroke();c.strokeStyle='#ffd84a';c.lineWidth=2;c.beginPath();c.moveTo(f*20,-36.5);c.lineTo(f*28,-37.4);c.stroke();
 if(e.at>0){c.fillStyle='rgba(255,230,120,.9)';c.beginPath();c.arc(f*30,-37.5,5,0,7);c.fill()}
 if(e.sh>0&&e.shX){const a=Math.min(1,e.sh/e.shX);c.strokeStyle='rgba(120,235,255,'+(.3+.4*a)+')';c.lineWidth=2;c.beginPath();c.ellipse(0,-26,22,30,0,0,7);c.stroke();c.fillStyle='rgba(120,235,255,'+(.05+.1*a)+')';c.fill()}
 c.restore();if(e.stun>0)sparks(c,q,100*s*.5)}
function boss(c,q,e,T){const hov=Math.sin(T*1.6)*4,cy=q[1]-78+hov;c.save();c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(q[0],q[1]+2,36,13,0,0,7);c.fill();
 for(let k=0;k<4;k++){const a=k*1.571+.78,lx=q[0]+Math.cos(a)*34,ly=q[1]+Math.sin(a)*14;c.strokeStyle='#2c353d';c.lineWidth=7;c.beginPath();c.moveTo(q[0]+Math.cos(a)*10,cy+10);c.lineTo(q[0]+Math.cos(a)*30,cy-6+Math.sin(a)*2);c.lineTo(lx,ly);c.stroke();c.strokeStyle='#5f6c78';c.lineWidth=1.4;c.stroke();c.fillStyle='#1a2026';c.beginPath();c.ellipse(lx,ly,7,3,0,0,7);c.fill()}
 c.fillStyle='#38424b';c.beginPath();c.ellipse(q[0],cy+10,26,11,0,0,7);c.fill();c.strokeStyle='#6a7885';c.lineWidth=1.4;c.stroke();
 [[34,.5],[26,.2]].forEach(([rx,ph],i)=>{c.strokeStyle=i?'rgba(255,60,80,.8)':AR+'.8)';c.lineWidth=2.4;c.beginPath();c.ellipse(q[0],cy,rx,rx*.42,Math.sin(T*(1+i*.7)+ph)*.2,0,7);c.stroke()});
 const g=c.createRadialGradient(q[0],cy-2,2,q[0],cy,19);g.addColorStop(0,e.stun>0?'#ddd':'#fff');g.addColorStop(.3,e.stun>0?'#999':'#ff5a6a');g.addColorStop(1,'#3a0a12');c.fillStyle=g;c.beginPath();c.arc(q[0],cy,19,0,7);c.fill();c.strokeStyle='#8a96a1';c.lineWidth=2;c.stroke();
 if(e.at>0){c.fillStyle='rgba(255,90,110,.45)';c.beginPath();c.arc(q[0],cy,30,0,7);c.fill()}
 if(e.sh>0&&e.shX){const a=Math.min(1,e.sh/e.shX);c.fillStyle=AR+(.06+.12*a)+')';c.strokeStyle='rgba(140,240,255,'+(.3+.5*a)+')';c.lineWidth=2.5;c.beginPath();c.ellipse(q[0],cy+6,56,60,0,0,7);c.fill();c.stroke();for(let k=0;k<5;k++){c.strokeStyle='rgba(220,235,255,'+(.12+.14*a)+')';c.lineWidth=1;c.beginPath();c.ellipse(q[0],cy+6,Math.abs(56*Math.cos(k*.6+T*.3)),60,0,0,7);c.stroke()}}
 c.restore();if(e.stun>0)sparks(c,q,128)}
const PZB={leg:'#3e4a36',trim:'#6a7a50',pack:'#2a3028',body:'#788a68',edge:'#3a4a30',acc:'#b8e070',helm:'#9aaa88',vis:'#d8ff90',nr:1};
function capsule(c,q,e,T){const a=.5+.4*Math.sin(T*3+e.x);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(q[0],q[1]+1,13,5,0,0,7);c.fill();c.fillStyle='#2a3238';c.beginPath();c.ellipse(q[0],q[1],12,5,0,0,7);c.fill();
 c.fillStyle='rgba(120,255,200,'+(.18+.14*a)+')';c.strokeStyle='rgba(200,255,235,.7)';c.lineWidth=1.4;c.beginPath();c.moveTo(q[0]-10,q[1]);c.lineTo(q[0]-10,q[1]-34);c.ellipse(q[0],q[1]-34,10,5,0,Math.PI,0);c.lineTo(q[0]+10,q[1]);c.ellipse(q[0],q[1],10,4.4,0,0,Math.PI);c.closePath();c.fill();c.stroke();
 c.fillStyle='rgba(235,245,240,.55)';c.beginPath();c.ellipse(q[0],q[1]-16,3.4,10,0,0,7);c.fill();c.beginPath();c.arc(q[0],q[1]-29,3.4,0,7);c.fill();c.fillStyle='rgba(120,255,200,'+(.4+.4*a)+')';c.fillRect(q[0]-3,q[1]-3,6,2.4);if(e.stun>0)sparks(c,q,40)}
function drawE(c,e,T){const q=pj(e.x,e.y);if(e.stun>0)c.globalAlpha=.85;
 if(e.k==='zb')trooper(c,q,e,.98,PZB,T);else if(e.k==='cap')capsule(c,q,e,T);else if(e.k==='hl'){c.globalAlpha=.4+.2*Math.sin(T*14+e.sd);trooper(c,q,e,1.1,PEL,T)}else if(e.k==='bh')trooper(c,q,e,1.6,e.bp||PEL,T);
 else if(e.k==='tr')trooper(c,q,e,1,PTR,T);else if(e.k==='el')trooper(c,q,e,1.28,PEL,T);else if(e.k==='dr')drone(c,q,e,T);else if(e.k==='mk')mech(c,q,e,1.7,T);else if(e.k==='b')boss(c,q,e,T);c.globalAlpha=1}

/* ---------- lógica propia de la batalla ---------- */
function emp(AS,x,y){AS.fx.push({k:'emp',x,y,t:0});AS.E.forEach(e=>{if(e.hp<=0||Math.hypot(e.x-x,e.y-y)>6.5)return;if(e.boss){e.stun=2.5;e.sh=(e.sh||0)*.6}else if(e.fly){e.hp=0}else{e.stun=(e.big||e.tow||e.k==='el')?7:3;if(e.sh)e.sh=0}});try{window.sfx&&sfx('boom')}catch(er){}}
function step(AS,dt,X){const b=AS.E.find(e=>e.boss&&e.hp>0);AS.bq=AS.bq||[];
 if(b){if(!(b.stun>0)){b.aT-=dt;if(b.aT<=0){b.aT=8.5;let t=null,bd=11;AS.U.forEach(u=>{if(u.hp<=0)return;const d=Math.hypot(u.x-b.x,u.y-b.y);if(d<bd){bd=d;t=u}});if(t){AS.bq.push({t:1.5,x:t.x,y:t.y,r:3.3,d:b.dmg*4.2,m:1.5});X.say('AEGIS','«Objetivo fijado. Fuego orbital en curso.»')}}}
  [[.66,'s1'],[.33,'s2']].forEach(([th,k])=>{if(b.hp<b.mhp*th&&!b[k]){b[k]=1;X.say('AEGIS','«Refuerzos desplegados.»');for(let i=0;i<4;i++){const u=mkE(AS,'dr',b.x+X.rnd(-2.5,2.5),b.y+X.rnd(-2,2));u.guard=0;AS.E.push(u)}}})}
 AS.bq.forEach(q=>{q.t-=dt;if(q.t<=0&&!q.done){q.done=1;AS.fx.push({k:'ex',x:q.x,y:q.y,t:0});AS.U.forEach(u=>{if(u.hp>0&&Math.hypot(u.x-q.x,u.y-q.y)<q.r)X.hurt(u,q.d)});try{window.sfx&&sfx('boom')}catch(e){}}});AS.bq=AS.bq.filter(q=>!q.done)}
function over(c,AS,T){(AS.bq||[]).forEach(q=>{const p=pj(q.x,q.y),a=1-q.t/q.m,rx=q.r*45,ry=q.r*22.6;c.strokeStyle='rgba(255,60,80,'+(.5+.4*Math.sin(T*18))+')';c.lineWidth=3;c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,0,7);c.stroke();c.fillStyle='rgba(255,60,80,'+(.08+.16*a)+')';c.beginPath();c.ellipse(p[0],p[1],rx*a,ry*a,0,0,7);c.fill()})}


/* ---------- borde del mapa: la ciudad en ruinas alrededor de la torre ---------- */
const hs2=(a,b)=>{let h=a*374761393+b*668265263+7;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967295};
function outTile(x,a,b,c,d,i,j,dist,r){const col=dist===1?'#2c3842':(r<.5?'#1b2127':'#181d22');poly(x,[a,b,c,d],col);
 x.strokeStyle=AR+(dist===1?.28:.07)+')';x.lineWidth=1;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);if((i+j)%3===0){x.moveTo(a[0],a[1]);x.lineTo(d[0],d[1])}x.stroke();
 if(r>.88){x.fillStyle='rgba(8,10,12,.55)';x.beginPath();x.ellipse((a[0]+c[0])/2,(a[1]+c[1])/2,11,4.5,0,0,7);x.fill()}
 else if(r<.04){x.strokeStyle='rgba(255,170,60,.35)';x.lineWidth=1.3;x.beginPath();x.moveTo(a[0]+8,a[1]+9);x.lineTo(a[0]+17,a[1]+13);x.lineTo(a[0]+24,a[1]+11);x.stroke()}}
function skyscraper(x,i,j,f){const q=pj(i,j),H=70+hs2(i,j)*120,sd=Math.floor(hs2(j,i)*1e5)+1;x.save();x.translate(q[0],q[1]);x.globalAlpha=1-f*.85;
 shadow(x,2,2,H);box(x,0,0,2,2,0,H,'#2b343d','#161b20','#20272e');led(x,sd,'L',0,0,2,2,6,H-6,['#e8b04a','#5ae6ff','#1a2128','#1a2128','#1a2128','#1a2128']);led(x,sd+9,'R',0,0,2,2,6,H-6,['#c98f2a','#2aa4c4','#161b20','#161b20','#161b20']);
 x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=2;const a=pj(2,2);x.beginPath();x.moveTo(a[0]-20,a[1]-H*.5);x.lineTo(a[0]-6,a[1]-H*.62);x.lineTo(a[0]-14,a[1]-H*.8);x.stroke();
 const t0=pj(.2,.2),t1=pj(1.6,.4);x.strokeStyle='#4a5560';x.lineWidth=1.6;for(let k=0;k<3;k++){x.beginPath();x.moveTo(t0[0]+k*14,t0[1]-H+4);x.lineTo(t0[0]+k*14+(k-1)*5,t0[1]-H-12-k*3);x.stroke()}
 if(hs2(i+3,j)<.3){const p=pj(1,1);x.fillStyle='#ff3a4a';x.fillRect(p[0]-1.5,p[1]-H-4,3,3)}x.restore()}
function outObj(x,i,j,d,f,st){const nearSt=i>=22&&i<=29&&j>=GH-2;if(nearSt||st)return;const n=hs2(i,j),al=1-f*.85;
 if(d===1){if(i%4===0||j%4===0){const q=pj(i+.5,j+.5);x.save();x.translate(q[0],q[1]);x.globalAlpha=al;box(x,-.12,-.12,.24,.24,0,26,'#4a5662','#2a323a','#38424c');x.fillStyle=CY;x.globalAlpha=al*.9;x.fillRect(-3,-30,6,4);x.globalAlpha=al*.25;x.beginPath();x.ellipse(0,-27,12,6,0,0,7);x.fill();x.restore()}return}
 if(d>=3&&i%4===1&&j%4===1&&hs2(j*3,i)<.65)return skyscraper(x,i,j,f);
 const q=pj(i+.5,j+.5);x.save();x.translate(q[0],q[1]);x.globalAlpha=al;
 if(n<.06){box(x,-.5,-.25,1,.5,0,7,'#39424b','#1d242a','#2a323a');x.fillStyle='#ff4a6a';x.fillRect(-12,-7,5,2)}
 else if(n<.13){for(let k=0;k<5;k++){const a=hs2(i+k,j*2)*2-1,b=hs2(i*2,j+k)*2-1;box(x,a*.35-.15,b*.3-.12,.3+hs2(k,i)*.25,.25,0,3+hs2(i,k+j)*7,'#2d363e','#171c21','#222a30')}}
 else if(n<.17){box(x,-.1,-.1,.2,.2,0,36+hs2(j,i)*18,'#3d4852','#222a31','#2c353d');x.fillStyle='#ffd84a';x.globalAlpha=al*.9;x.fillRect(-4,-44,8,3)}
 x.restore()}
/* ---------- salida de la batalla: capítulo 27 ---------- */
function finish(r){const fell=r.fallen.length,surv=r.surv,total=r.total;r.fallen.forEach(p=>{if(!S.ppl.includes(p))return;if(Math.random()<.35){try{die(p,'Cayó en la Torre del Consejo')}catch(e){S.ppl=S.ppl.filter(q=>q!==p)}}else{p.hp=Math.max(10,p.hp*.2)}});
 const first=S.story<=26;let rw='';S.bp=S.bp||{};['Rifle de plasma','Fusil gauss','Exoarmadura Aegis','Traje de sigilo Umbra'].forEach(n=>S.bp[n]=1);
 if(first){S.story=27;try{rw=storyReward(STORY[26].r)}catch(e){}try{window.narOnChapter&&narOnChapter(26)}catch(e){}
  try{if(S.gd)S.gd.rep=(S.gd.rep||0)+80;const R={ammo:300,metal:400,comp:120,chem:80,meds:120};const cp=(typeof cap==='function')?cap():99999;for(const k in R)if(S.res[k]!==undefined)S.res[k]=Math.min(cp,S.res[k]+R[k]);villaApi.gain(3000);
   ['Rifle de plasma','Fusil gauss'].forEach(n=>{const k=WP.findIndex(w=>w.n===n);if(k>=0)S.inv.push({n:WP[k].n,v:WP[k].v})});['Exoarmadura Aegis','Traje de sigilo Umbra'].forEach(n=>S.inv.push({kind:'outfit',n}));
   const t=TECH.filter(q=>!S.tech[q[0]]).slice(0,3);t.forEach(q=>S.tech[q[0]]=1)}catch(e){}}
 try{window.notify&&notify('🏆','La Torre del Consejo ha caído','El sistema AEGIS está destruido. Albor os espera.','historia')}catch(e){}
 setTimeout(()=>{window._asOn=0;show('La Torre del Consejo',`<div class="mu-empty"><span>🏆</span><b>AEGIS ha caído</b><small>Los drones se desploman, los centinelas se apagan y las nueve antenas quedan en silencio. En el último piso, Albor os espera sin guardias.<br><br>«${(STORY[26]&&STORY[26].outro)||''}»<br><br>Han combatido ${total} de los tuyos: ${surv} siguen en pie y ${fell} cayeron. Los caídos pueden haber muerto o quedar heridos; revisa tu base.${first?'<br><br>'+rw+'<br><b>Botín del Consejo:</b> 3000 fichas, 300 de munición, 400 de metal, 120 de componentes, 80 de químicos, 120 de medicinas; Rifle de plasma, Fusil gauss, Exoarmadura Aegis y Traje de sigilo Umbra; y los planos de estas cuatro piezas para fabricarlas en el taller. Además, planos nuevos de tecnología y +80 de reputación con la Guardia.':'<br><br>(Capítulo ya completado: sin recompensa extra)'}</small></div>`)},500)}

/* ---------- ficha previa y lanzamiento ---------- */
const power=()=>{try{return armyPow()}catch(e){return 0}};
function briefing(){const pw=power(),ok=pw>=NEED||S.mode==='creativo',c=ASALTO.crew(),pct=Math.min(100,pw/NEED*100);
 show('Capítulo 27 · La torre del Consejo',`<p><i>«La torre no es un pueblo ni una banda. Es una máquina de guerra que no duerme: drones, centinelas y un sistema llamado AEGIS que protege a Albor. Esto es lo último que tenemos que hacer. No lo hagáis con menos de lo que podáis dar.»</i> — Presidenta Valeria</p>
 <div class="mu-sts"><div class="mu-st"><b>${pw}</b><small>Tu poder</small></div><div class="mu-st"><b>${NEED}</b><small>Poder necesario</small></div><div class="mu-st"><b>${c.sol.length}</b><small>Soldados</small></div><div class="mu-st"><b>${Math.min(c.civ.length,Math.max(0,40-c.sol.length))}</b><small>Ciudadanos</small></div></div>
 <div style="height:8px;background:#232b2f;border-radius:4px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${pct}%;background:${ok?'#6fb04e':'#c9a24a'}"></div></div>
 <p>${ok?'Valeria asiente: «Hoy cae el Consejo».':'Tu ejército aún no es suficiente. Faltan <b>'+(NEED-pw)+'</b> puntos de poder: más soldados, mejores armas y armaduras, más torres.'}</p>
 <p><small>Enemigos: soldados con armadura y escudo de energía, drones, centinelas de combate y el sistema AEGIS. Torretas láser y muros reforzados. Nuevo: el <b>Pulso EMP</b> desactiva drones, centinelas y torres cercanos y apaga sus escudos. Participan tus soldados, ciudadanos sanos, la Guardia y Valeria.</small></p>
 <button class="pri" ${ok?'':'disabled'} onclick="asaltoTorreGo()">Asaltar la torre</button>`)}
window.asaltoTorreGo=()=>{if(power()<NEED&&S.mode!=='creativo')return;document.getElementById('pan').style.display='none';window._asOn=1;const units=ASALTO.build();
 window.asaltoIsoStart({fk:'consejo',plan:{ed:1,gate:1,ex:4,ad:1.2},es:ES,units,tot:units.filter(u=>u.p).length}).catch(e=>{console.error(e);window._asOn=0;toast('No se pudo cargar el mapa del asalto.')})};
(function(){const o=window.exGo;if(typeof o!=='function')return;window.exGo=function(){try{if(!S.exp&&window.exTab==='hist'&&typeof exC!=='undefined'&&exC===26){if(S.story<26&&S.mode!=='creativo')return toast('Antes debes completar el capítulo 26.');if(A().fall&&!A().won&&S.mode!=='creativo')return toast('Antes hay que acabar la guerra contra Cuervos y Víboras.');briefing();return}}catch(e){}return o.apply(this,arguments)}})();

window.TORRE_IMPL=window.TORRE={NEED,TM,TY,mk:mkE,setFk,layout,tileCol,tileFx,outTile,outObj,drawB,drawW,drawT,drawE,enemies,step,over,emp,finish,briefing};
})();
