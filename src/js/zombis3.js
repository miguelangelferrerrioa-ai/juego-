/* ===== Zombis de la segunda mitad del juego: excavador, ariete, incendiario y alfa =====
   Excavador (x): cava por debajo de los muros de nivel 1-6 (bajo tierra no recibe daño) y sale dentro; los de nivel 7+ tienen cimientos y los tiene que romper.
   Ariete (w): muy lento y duro; va a por el muro o puerta más cercano y lo destroza (6× daño a muros), casi no ataca a la gente.
   Incendiario (i): arde; al morir deja fuego 6 s que daña edificios y gente cercana.
   Alfa (l): líder de manada; los zombis a menos de 3,5 casillas pegan un 25 % más y se curan poco a poco mientras siga vivo.
   Salen en las hordas del pueblo a partir del capítulo 16-22 de la historia (ZX.comp). */
(function(){
'use strict';
if(!window.ZX||typeof ZT==='undefined')return;
const ZN={
 x:{n:'Zombi excavador',hp:110,sp:.7,d:10,c:'#7a6a4a',bh:46},
 w:{n:'Zombi ariete',hp:620,sp:.33,d:5,c:'#6a705e',big:1,bh:70},
 i:{n:'Zombi incendiario',hp:85,sp:.78,d:8,c:'#a0583a',bh:54},
 l:{n:'Zombi alfa',hp:320,sp:.72,d:15,c:'#6a8a52',big:1,bh:66}};
Object.assign(ZT,ZN);
const NS=new Set(Object.keys(ZN)),hyp=Math.hypot,clp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tileB=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y);return(ix>=0&&iy>=0&&ix<N&&iy<N)?bm[occ[iy*N+ix]]:null};
const isW=b=>b&&(b.type==='wall'||b.type==='gate');
function near(z,r){let best=null,bd=r;S.ppl.forEach(p=>{if(p.away||p.inside||p.hp<=0)return;const d=hyp(p.x-z.x,p.y-z.y);if(d<bd){bd=d;best={o:p,d,u:0}}});U.forEach(u=>{if(u.hp<=0)return;const d=hyp(u.x-z.x,u.y-z.y);if(d<bd){bd=d;best={o:u,d,u:1}}});return best}
function hurt(t,d){const o=t.o;o.hp-=d;if(t.u){o.p.injury=Math.min(100,(o.p.injury||0)+d*.22)}else{o.injury=Math.min(100,(o.injury||0)+d*.15);if(o.hp<=0)die(o,'atacado por los zombis')}}
function hitB(b,d){b.hp-=d;if(b.hp<=0)killB(b)}
/* ---------- excavador ---------- */
function dig(z,dt){const zt=ZT.x;z.at=0;let tg=near(z,70),tx,ty,tb=null;
 if(tg){tx=tg.o.x;ty=tg.o.y}else{if(!z.tg||!bm[z.tg]||isW(bm[z.tg])){let bd=1e9;S.bld.forEach(b=>{if(b.type=='road'||b.type=='bridge'||isW(b))return;const dd=hyp(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<bd){bd=dd;z.tg=b.id}})}
  tb=bm[z.tg];if(!tb)return;tx=clp(z.x,tb.x,tb.x+tb.w);ty=clp(z.y,tb.y,tb.y+tb.h)}
 const dist=hyp(tx-z.x,ty-z.y)||1e-6;z.dx=tx-z.x;
 if(dist<=.85&&!z.bur){z.at=1;if(tg)hurt(tg,zt.d*dt);else hitB(tb,zt.d*dt);return}
 const s=zt.sp*(z.bur?.75:1)*dt*terrMul(z.x,z.y),nx=z.x+(tx-z.x)/dist*s,ny=z.y+(ty-z.y)/dist*s,nb=tileB(nx,ny),hb=tileB(z.x,z.y);
 if(isW(nb)&&(nb.lvl||1)>=7&&!isW(hb)){z.at=1;hitB(nb,zt.d*1.5*dt);return}/* cimientos: no puede pasar, rompe el muro */
 if(nb&&nb!==tb&&!isW(nb)&&!WK(nb.type)&&!z.bur){z.at=1;hitB(nb,zt.d*dt);return}
 const under=isW(nb)||isW(hb)||(z.bur&&(isW(tileB(z.x-(tx-z.x)/dist*.6,z.y-(ty-z.y)/dist*.6))));
 if(under&&!z.bur){z.bur=1;burst(z.x,z.y,8,'#6a5034',1.6,9)}
 if(!under&&z.bur){z.bur=0;z.emg=T;burst(z.x,z.y,12,'#6a5034',2,10);try{sfxAt('zdie',z.x,z.y,{rate:.6,v:.6})}catch(e){}}
 z.x=nx;z.y=ny}
/* ---------- ariete ---------- */
function ram(z,dt){const zt=ZT.w;z.at=0;let wb=z.wt&&bm[z.wt];
 if(!wb||!isW(wb)){let bd=1e9;wb=null;S.bld.forEach(b=>{if(!isW(b))return;const d=hyp(b.x+.5-z.x,b.y+.5-z.y);if(d<bd){bd=d;wb=b}});z.wt=wb?wb.id:0}
 if(!wb)return 'def';
 const tx=wb.x+.5,ty=wb.y+.5,dist=hyp(tx-z.x,ty-z.y)||1e-6;z.dx=tx-z.x;
 if(dist<=.95){z.at=1;z.rh=(z.rh||0)-dt;if(z.rh<=0){z.rh=1.6;z.hit=T;hitB(wb,zt.d*6*1.6+18);SHK=Math.max(SHK||0,.08);burst(tx,ty,6,'#9a958a',1.6,9);try{sfxAt('brick',tx,ty,{v:.8})}catch(e){}}return}
 const s=zt.sp*dt*terrMul(z.x,z.y),nx=z.x+(tx-z.x)/dist*s,ny=z.y+(ty-z.y)/dist*s,nb=tileB(nx,ny);
 if(nb&&nb!==wb&&!WK(nb.type)){z.at=1;hitB(nb,zt.d*3*dt);return}
 z.x=nx;z.y=ny}
/* ---------- comportamiento ---------- */
const oZ=window.zUpd;
window.zUpd=function(z,dt){const t=z.t;
 if(!NS.has(t)){if(z.alf>T&&z.hp>0&&z.hp<z.mhp)z.hp=Math.min(z.mhp,z.hp+z.mhp*.02*dt);return oZ.apply(this,arguments)}
 if(z.hp<=0)return;if(!z.act)return oZ.apply(this,arguments);if(z.boost>T)dt*=1.35;
 if(t==='x'){if(z.bur){if(z.lhp!==undefined&&z.hp<z.lhp)z.hp=z.lhp}z.lhp=z.hp;return dig(z,dt)}
 if(t==='w'){if(ram(z,dt)==='def')return oZ.call(this,z,dt);return}
 if(t==='l'){z.au=(z.au||0)-dt;if(z.au<=0){z.au=.5;Z.forEach(o=>{if(o!==z&&o.act&&o.hp>0&&hyp(o.x-z.x,o.y-z.y)<3.5){o.alf=T+.8;if(!o.alfD){o.dm0=o.dm||1;o.dm=o.dm0*1.25;o.alfD=1}}else if(o.alfD&&!(o.alf>T)){o.dm=o.dm0||1;o.alfD=0}})}}
 return oZ.call(this,z,dt)};
try{zUpd=window.zUpd}catch(e){}
/* ---------- fuego del incendiario ---------- */
let FIRE=[];
const oC=window.combat;
if(typeof oC==='function'){window.combat=function(dt){const inc=Z.filter(z=>z.t==='i'&&z.act&&!z.fd);const r=oC.apply(this,arguments);
  inc.forEach(z=>{if(z.hp<=0&&!z.fd){z.fd=1;FIRE.push({x:z.x,y:z.y,t:6});burst(z.x,z.y,16,'#ff8a30',2.4,12);try{sfxAt('boom',z.x,z.y,{v:.7})}catch(e){}}});return r};try{combat=window.combat}catch(e){}}
const oU=window.upd;
window.upd=function(dt){const r=oU.apply(this,arguments);try{if(FIRE.length&&S&&S.bld){FIRE.forEach(f=>{f.t-=dt;
   S.bld.forEach(b=>{if(b.type==='road'||b.type==='bridge')return;const d=hyp(clp(f.x,b.x,b.x+b.w)-f.x,clp(f.y,b.y,b.y+b.h)-f.y);if(d<1.3){b.hp-=7*dt;if(b.hp<=0)killB(b)}});
   S.ppl.forEach(p=>{if(p.away||p.inside||p.hp<=0)return;if(hyp(p.x-f.x,p.y-f.y)<1.3){p.hp-=6*dt;if(p.hp<=0)die(p,'quemado por un zombi incendiario')}});
   U.forEach(u=>{if(u.hp>0&&hyp(u.x-f.x,u.y-f.y)<1.3)u.hp-=6*dt});
   if(Math.random()<dt*6)burst(f.x+(Math.random()-.5),f.y+(Math.random()-.5),1,'#ff9a3a',1,5)});FIRE=FIRE.filter(f=>f.t>0)}
  if(!horde&&FIRE.length&&!Z.length)FIRE=[]}catch(e){}return r};
try{upd=window.upd}catch(e){}
window.zFire=()=>FIRE;
/* ---------- dibujo ---------- */
const OL='#14100a',sh=(c,q,rx,ry)=>{c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q[0],q[1],rx,ry,0,0,7);c.fill()};
const lim=(c,x1,y1,x2,y2,w,col)=>{c.lineCap='round';c.strokeStyle=OL;c.lineWidth=w+2;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
/* brazo/pierna en dos tramos (con codo/rodilla) y brillo en el lado de la luz */
const lim2=(c,x1,y1,x2,y2,x3,y3,w,col,hi)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle=OL;c.lineWidth=w+2;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x3,y3);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.stroke();
 if(hi){c.strokeStyle=hi;c.lineWidth=Math.max(1,w*.28);c.beginPath();c.moveTo(x1-w*.2,y1-w*.15);c.lineTo(x2-w*.2,y2-w*.15);c.stroke()}};
const blob=(c,x,y,rx,ry,col,rot)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=1.4;c.beginPath();c.ellipse(x,y,rx,ry,rot||0,0,7);c.fill();c.stroke()};
const poly=(c,pts,col,lw)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=lw||1.5;c.lineJoin='round';c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();c.fill();if(lw!==0)c.stroke()};
const fpoly=(c,pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();c.fill()};
const dot=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
/* garras: tres uñas curvas */
const claws=(c,x,y,f,len,col,dy)=>{c.strokeStyle=OL;c.lineWidth=2.6;c.lineCap='round';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x,y+k*1.6);c.quadraticCurveTo(x+f*len*.7,y+k*2.4-1+(dy||0),x+f*len,y+k*2.6+2+(dy||0));c.stroke()}
 c.strokeStyle=col;c.lineWidth=1.3;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x,y+k*1.6);c.quadraticCurveTo(x+f*len*.7,y+k*2.4-1+(dy||0),x+f*len,y+k*2.6+2+(dy||0));c.stroke()}};
/* cara de zombi: cuencas hundidas, ojos que brillan, boca abierta con dientes */
const face=(c,x,y,r,f,skin,eye,mo,glow)=>{blob(c,x,y,r,r*1.08,skin);
 c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x-f*r*.35,y+r*.15,r*.6,r*.85,0,0,7);c.fill();
 c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.ellipse(x+f*r*.25,y-r*.45,r*.45,r*.3,0,0,7);c.fill();
 c.fillStyle='#1a1410';c.beginPath();c.ellipse(x+f*r*.42,y-r*.12,r*.28,r*.22,0,0,7);c.ellipse(x-f*r*.12,y-r*.12,r*.24,r*.2,0,0,7);c.fill();
 if(glow){c.fillStyle=glow;c.beginPath();c.arc(x+f*r*.42,y-r*.12,r*.55,0,7);c.arc(x-f*r*.12,y-r*.12,r*.45,0,7);c.fill()}
 c.fillStyle=eye;c.fillRect(x+f*r*.42-r*.13,y-r*.2,r*.26,r*.17);c.fillRect(x-f*r*.12-r*.11,y-r*.2,r*.22,r*.15);
 const m=mo||0;c.fillStyle='#2a0c0c';c.beginPath();c.ellipse(x+f*r*.3,y+r*.48,r*.36,r*(.14+m*.32),0,0,7);c.fill();
 if(m>.1){c.fillStyle='#e6dcc0';for(let k=-1;k<=1;k++){c.fillRect(x+f*r*.3+k*r*.2-r*.05,y+r*(.48-.14-m*.32)+.2,r*.1,r*.16);c.fillRect(x+f*r*.3+k*r*.2-r*.05,y+r*(.48+.14+m*.32)-r*.16,r*.1,r*.15)}}};
const SK='#8fae72',SKD='#6f8c58',SKH='rgba(220,240,190,.35)',ph=z=>z.x*3+z.y*2.1;
/* en la guía (enemyPaint) la figura es de muestra: hp=mhp=1 */
const demo=z=>z.mhp===1&&z.pl0===1;
const DR={
x(c,z,q,f,tt){const p=tt*9+ph(z),X=v=>q[0]+v*f,Y=v=>q[1]+v;let bur=z.bur,emg=z.emg;
  if(demo(z)){const k=tt%6;bur=k<2.4;if(!bur&&k<3)emg=tt-(k-2.4)}
  if(bur){/* bajo tierra: montículo agrietado que avanza, casco y garras asomando */
   sh(c,q,14,5);const bo=Math.sin(p*.8)*1.2;
   for(let i=0;i<3;i++){const a=(tt*2+i*.33)%1;c.fillStyle='rgba(120,95,60,'+(.35*(1-a))+')';c.beginPath();c.ellipse(X(-10-a*14),Y(-2-a*4),3+a*5,2+a*3,0,0,7);c.fill()}
   poly(c,[X(-15),Y(0),X(-11),Y(-6+bo),X(-4),Y(-10),X(4),Y(-11-bo),X(11),Y(-7),X(15),Y(0)],'#6a5034');
   fpoly(c,[X(-4),Y(-10),X(4),Y(-11-bo),X(11),Y(-7),X(15),Y(0),X(2),Y(0)],'rgba(0,0,0,.18)');
   c.strokeStyle='#3a2a18';c.lineWidth=1;c.beginPath();c.moveTo(X(-6),Y(-8));c.lineTo(X(-2),Y(-4));c.lineTo(X(-5),Y(-1));c.moveTo(X(3),Y(-10));c.lineTo(X(6),Y(-5));c.lineTo(X(10),Y(-4));c.stroke();
   [[-9,-4,2.2,'#8a8070'],[7,-3,1.8,'#7a7060'],[-1,-2,1.5,'#6a6458'],[12,-2,1.4,'#8a8070']].forEach(([x,y,r,col])=>{fpoly(c,[X(x-r),Y(y+r*.6),X(x-r*.6),Y(y-r*.7),X(x+r*.5),Y(y-r*.8),X(x+r),Y(y+r*.6)],col);dot(c,X(x-r*.2),Y(y-r*.3),r*.35,'rgba(255,255,255,.25)')});
   c.fillStyle='#c9a23a';c.strokeStyle=OL;c.lineWidth=1.4;c.beginPath();c.arc(X(3),Y(-10-bo),5,Math.PI,0);c.fill();c.stroke();dot(c,X(7),Y(-12-bo),1.6,'#fff3b0');
   c.save();c.globalAlpha=.25;c.fillStyle='#fff3b0';c.beginPath();c.moveTo(X(7),Y(-12-bo));c.lineTo(X(26),Y(-6));c.lineTo(X(24),Y(2));c.closePath();c.fill();c.restore();
   const pk=Math.max(0,Math.sin(tt*3+ph(z)));if(pk>.3)claws(c,X(10),Y(-6-pk*5),f,7*pk,'#d9d2b8',-2);
   for(let i=0;i<4;i++){const a=p*.7+i*1.7;dot(c,X(Math.cos(a)*10),Y(-8+Math.sin(a*1.3)*3),1.1,'#4a3824')}return}
  const w=Math.sin(p)*3.5,at=z.at,dg=Math.sin(tt*14),bob=Math.abs(Math.sin(p))*1.2;sh(c,q,12,4.4);
  /* piernas dobladas con peto de trabajo y botas */
  lim2(c,X(-3),Y(-15),X(-6+w),Y(-8),X(-3+w),Y(-1.5),4.5,'#3e4452');lim2(c,X(3),Y(-15),X(6-w),Y(-8),X(4-w),Y(-1.5),4.5,'#4d5566','rgba(255,255,255,.12)');
  blob(c,X(-2+w),Y(-1.5),3.4,1.9,'#2a2420');blob(c,X(5-w),Y(-1.5),3.4,1.9,'#332a22');
  /* brazo de atrás */
  const ax=at?dg*4:Math.sin(p+1)*2;lim2(c,X(-2),Y(-30+bob),X(6),Y(-22),X(13+ax),Y(-14+Math.abs(ax)),3.6,SKD);claws(c,X(13+ax),Y(-14+Math.abs(ax)),f,6,'#b8b098');
  /* tronco encorvado: camisa rota, peto con tirantes, joroba */
  poly(c,[X(-6),Y(-15),X(6),Y(-15),X(10),Y(-27+bob),X(4),Y(-33+bob),X(-5),Y(-33+bob),X(-9),Y(-25)],'#7a6a4a');
  fpoly(c,[X(-6),Y(-15),X(-1),Y(-15),X(-3),Y(-33+bob),X(-5),Y(-33+bob),X(-9),Y(-25)],'rgba(0,0,0,.22)');
  poly(c,[X(-5),Y(-15),X(6),Y(-15),X(8),Y(-25+bob),X(-3),Y(-25+bob)],'#4d5566',1.2);
  c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X(0)-1.5,Y(-22+bob),3,4);c.strokeStyle='#3a404c';c.lineWidth=1.6;c.beginPath();c.moveTo(X(-2),Y(-25+bob));c.lineTo(X(1),Y(-33+bob));c.moveTo(X(7),Y(-25+bob));c.lineTo(X(6),Y(-31+bob));c.stroke();
  dot(c,X(-2),Y(-24.5+bob),.9,'#c0b070');dot(c,X(7),Y(-24.5+bob),.9,'#c0b070');
  c.fillStyle='#6a5034';[[-3,-18,2.6],[4,-20,2],[1,-16,1.6],[-6,-27,2]].forEach(([x,y,r])=>{c.beginPath();c.arc(X(x),Y(y+bob),r,0,7);c.fill()});
  c.strokeStyle=OL;c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-7+i*1.5),Y(-31+i*2+bob));c.lineTo(X(-9+i*1.5),Y(-29+i*2+bob));c.stroke()}
  /* cabeza baja y adelantada con casco de minero y linterna */
  const hx=X(11),hy=Y(-33+bob),mo=at?.6+.4*Math.abs(dg):.35+.2*Math.sin(p*.5);
  lim(c,X(5),Y(-31+bob),hx-f*2,hy+2,4,SKD);face(c,hx,hy,5.4,f,SK,'#e8e07a',mo);
  c.fillStyle='#c9a23a';c.strokeStyle=OL;c.lineWidth=1.4;c.beginPath();c.arc(hx-f*.5,hy-2.4,6,Math.PI,0);c.lineTo(hx+6.8,hy-2.4);c.lineTo(hx-7.4,hy-2.4);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.arc(hx-f*.5,hy-2.4,6,f>0?Math.PI:Math.PI*1.5,f>0?Math.PI*1.5:0);c.lineTo(hx-f*.5,hy-2.4);c.fill();
  c.strokeStyle='#8a6a20';c.lineWidth=1;c.beginPath();c.moveTo(hx-f*.5,hy-8.2);c.lineTo(hx-f*.5,hy-2.6);c.stroke();
  blob(c,hx+f*4.6,hy-5,2,2,'#5a5040');dot(c,hx+f*5.2,hy-5,1.3,'#fff3b0');
  c.save();c.globalAlpha=.16+.06*Math.sin(tt*3);c.fillStyle='#fff3b0';c.beginPath();c.moveTo(hx+f*5.5,hy-5.5);c.lineTo(hx+f*30,hy+8);c.lineTo(hx+f*22,hy+20);c.closePath();c.fill();c.restore();
  /* brazo de delante con garras de excavar */
  const bx=at?dg*5:Math.sin(p)*2.4;lim2(c,X(4),Y(-30+bob),X(11),Y(-21),X(16+bx),Y(-12+Math.abs(bx)*.6),4,SK,SKH);claws(c,X(16+bx),Y(-12+Math.abs(bx)*.6),f,7.5,'#e6dcc0');
  c.fillStyle='#4a3824';c.fillRect(X(16+bx)-1.2,Y(-13+Math.abs(bx)*.6),2.4,2.4);
  /* tierra que se le cae / que lanza al cavar */
  for(let i=0;i<(at?5:2);i++){const a=((tt*(at?2.2:.9))+i*.37+ph(z)*.1)%1;dot(c,X((at?16-a*22:2+i*4)),Y((at?-12-Math.sin(a*Math.PI)*12:-18+a*16)),at?1.4:1,'#5a4228')}
  if(T-(emg||-9)<.6||(demo(z)&&tt-(emg||-9)<.6)){const k=Math.max(0,1-((demo(z)?tt:T)-emg)/.6);c.fillStyle='rgba(106,80,52,'+k+')';c.beginPath();c.ellipse(q[0],q[1],16,7,0,0,7);c.fill();
   for(let i=0;i<8;i++){const a=i*.8,r=(1-k)*20;dot(c,q[0]+Math.cos(a)*r,q[1]-Math.abs(Math.sin(a))*r*.9-(1-k)*6,1.8,'rgba(106,80,52,'+k+')')}}},
w(c,z,q,f,tt){const p=tt*3.5+ph(z),w=Math.sin(p)*3,X=v=>q[0]+v*f,Y=v=>q[1]+v;let hit=Math.max(0,1-(tt-(z.hit||-9))*3);if(demo(z)&&z.at)hit=Math.max(0,Math.sin(tt*5));
  const bob=Math.abs(Math.sin(p))*1.5,lean=2+hit*4;sh(c,q,22,7.5);
  /* piernas gruesas, pantalón roto, pies descalzos */
  lim2(c,X(-7),Y(-20),X(-9+w),Y(-10),X(-7+w),Y(-2),9,'#3e4436');lim2(c,X(7),Y(-20),X(9-w),Y(-10),X(8-w),Y(-2),9,'#4e5446','rgba(255,255,255,.1)');
  blob(c,X(-6+w),Y(-1.6),5,2.4,SKD);blob(c,X(9-w),Y(-1.6),5,2.4,SK);fpoly(c,[X(-11+w),Y(-12),X(-3+w),Y(-12),X(-4+w),Y(-7),X(-10+w),Y(-8)],'#5a6a4a');
  /* tronco enorme: piel con cicatrices cosidas, costillas, cadenas cruzadas, chapa atornillada */
  const T0=-50+bob,L=lean;poly(c,[X(-13),Y(-19),X(13),Y(-19),X(19+L),Y(T0+8),X(14+L),Y(T0),X(-14+L*.5),Y(T0),X(-19+L*.3),Y(T0+8)],SKD,1.8);
  fpoly(c,[X(-13),Y(-19),X(-2),Y(-19),X(-4+L*.5),Y(T0),X(-14+L*.5),Y(T0),X(-19+L*.3),Y(T0+8)],'rgba(0,0,0,.2)');
  fpoly(c,[X(2+L),Y(T0+3),X(13+L),Y(T0+3),X(16+L),Y(T0+10),X(6+L),Y(T0+12)],SKH);
  c.strokeStyle='rgba(40,50,30,.55)';c.lineWidth=1.2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(X(-12+L*.3),Y(T0+14+i*4));c.quadraticCurveTo(X(-6+L*.3),Y(T0+12+i*4),X(-2+L*.3),Y(T0+15+i*4));c.stroke()}
  c.strokeStyle='#5a2a24';c.lineWidth=1.3;c.beginPath();c.moveTo(X(2+L),Y(T0+16));c.lineTo(X(10+L),Y(T0+26));c.stroke();c.strokeStyle='#1a1410';c.lineWidth=.9;for(let i=0;i<5;i++){const a=i/4;c.beginPath();c.moveTo(X(2+L+a*8-1.6),Y(T0+16+a*10+1.4));c.lineTo(X(2+L+a*8+1.6),Y(T0+16+a*10-1.4));c.stroke()}
  poly(c,[X(-13),Y(-26),X(13),Y(-26),X(13),Y(-19),X(-13),Y(-19)],'#4a3c2a',1.4);dot(c,X(0),Y(-22.5),1.6,'#a08a50');
  /* cadena en bandolera */
  for(let i=0;i<7;i++){const a=i/6,cx=X(-11+L*.4+a*21),cy=Y(T0+5+a*20);c.strokeStyle=OL;c.lineWidth=2.6;c.beginPath();c.ellipse(cx,cy,2.4,1.5,(.6)*f+(i%2?1.2:0),0,7);c.stroke();c.strokeStyle='#8a8a86';c.lineWidth=1.3;c.stroke()}
  /* chapa oxidada en el hombro de atrás */
  poly(c,[X(-18+L*.3),Y(T0+2),X(-6+L*.5),Y(T0-3),X(-3+L*.5),Y(T0+8),X(-16+L*.3),Y(T0+12)],'#7a5a3e',1.4);fpoly(c,[X(-16+L*.3),Y(T0+8),X(-4+L*.5),Y(T0+5),X(-3+L*.5),Y(T0+8),X(-16+L*.3),Y(T0+12)],'rgba(150,80,40,.6)');
  [[-15,3],[-7,0],[-6,7]].forEach(([x,y])=>dot(c,X(x+L*.4),Y(T0+y),1,'#c8b890'));
  /* cabeza pequeña hundida entre los hombros, puntos de sutura, bozal de hierro */
  const hx=X(6+L),hy=Y(T0-4);face(c,hx,hy,6.4,f,SK,'#f0a040',.45,'rgba(240,160,64,.25)');
  c.strokeStyle='#1a1410';c.lineWidth=1;c.beginPath();c.moveTo(hx-f*5,hy-5);c.quadraticCurveTo(hx,hy-8,hx+f*4,hy-6);c.stroke();for(let i=0;i<4;i++){const a=i/3;c.beginPath();c.moveTo(hx-f*(5-a*9),hy-7.4+Math.sin(a*3)*-.6);c.lineTo(hx-f*(5-a*9),hy-4.6);c.stroke()}
  c.strokeStyle='#5a5a56';c.lineWidth=1.4;c.beginPath();c.moveTo(hx-f*3,hy+1.5);c.lineTo(hx+f*6,hy+1.5);c.moveTo(hx+f*1,hy+1.5);c.lineTo(hx+f*1,hy+6);c.moveTo(hx+f*4,hy+1.5);c.lineTo(hx+f*4,hy+6);c.stroke();
  /* aliento */
  const br=(tt*.6+ph(z)*.1)%1;c.fillStyle='rgba(230,230,220,'+(.3*(1-br))+')';c.beginPath();c.arc(hx+f*(9+br*8),hy+2-br*6,2+br*4,0,7);c.fill();
  /* viga de acero remachada con cuerdas */
  const bx=X(8+L+hit*8),by=Y(T0+22);c.save();c.translate(bx,by);c.rotate(f*(.06-hit*.05));const sx=f>0?-12:-26;
  c.fillStyle='#6a6a66';c.strokeStyle=OL;c.lineWidth=1.6;c.fillRect(sx,-6,38,12);c.strokeRect(sx,-6,38,12);
  c.fillStyle='#55554f';c.fillRect(sx,-2,38,4);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(sx+1,-5,36,1.6);
  c.fillStyle='rgba(150,80,40,.55)';c.fillRect(sx+(f>0?24:4),-6,8,12);c.fillRect(sx+(f>0?6:26),-1,5,7);
  c.fillStyle='#3a3834';for(let i=0;i<6;i++){c.beginPath();c.arc(sx+3+i*6.4,-4,.9,0,7);c.arc(sx+3+i*6.4,4,.9,0,7);c.fill()}
  c.strokeStyle='#a08a5a';c.lineWidth=1.6;for(const k of[f>0?8:18,f>0?14:12]){c.beginPath();c.moveTo(sx+k,-6.5);c.lineTo(sx+k+3,6.5);c.stroke()}
  c.fillStyle='#4a4a46';c.strokeStyle=OL;c.lineWidth=1.4;const ex=f>0?sx+38:sx-4;c.fillRect(ex,-7.5,4,15);c.strokeRect(ex,-7.5,4,15);c.restore();
  /* brazos enormes sujetando la viga */
  lim2(c,X(-12+L*.5),Y(T0+5),X(-4+L),Y(T0+18),bx-f*2,by+3,8,SKD);lim2(c,X(12+L),Y(T0+5),X(18+L),Y(T0+16),bx+f*12,by-1,8,SK,SKH);
  blob(c,bx-f*2,by+3,4.4,4,SKD);blob(c,bx+f*12,by-1,4.6,4.2,SK);
  if(hit>.5){c.strokeStyle='rgba(255,230,180,'+(hit-.5)*1.4+')';c.lineWidth=2;for(let i=0;i<4;i++){const a=-.8+i*.5;c.beginPath();c.moveTo(bx+f*30,by);c.lineTo(bx+f*(30+Math.cos(a)*10),by+Math.sin(a)*10);c.stroke()}}},
i(c,z,q,f,tt){const p=tt*9+ph(z),w=Math.sin(p)*3,X=v=>q[0]+v*f,Y=v=>q[1]+v,fl=.75+.25*Math.sin(tt*13+ph(z)),bob=Math.abs(Math.sin(p))*1.2;sh(c,q,11,4.2);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(q[0],q[1]-24,0,q[0],q[1]-24,30);g.addColorStop(0,'rgba(255,130,40,'+(.42*fl)+')');g.addColorStop(1,'rgba(255,90,20,0)');c.fillStyle=g;c.fillRect(q[0]-30,q[1]-54,60,60);c.restore();
  /* humo negro que sube */
  for(let i=0;i<3;i++){const a=(tt*.5+i/3+ph(z)*.05)%1;c.fillStyle='rgba(30,26,24,'+(.32*(1-a))+')';c.beginPath();c.arc(X(-4+Math.sin(a*6+i)*4),Y(-44-a*26),3+a*6,0,7);c.fill()}
  /* garrafa de gasolina a la espalda */
  poly(c,[X(-12),Y(-36+bob),X(-5),Y(-37+bob),X(-5),Y(-22+bob),X(-12),Y(-22+bob)],'#9a2a1e',1.4);fpoly(c,[X(-12),Y(-36+bob),X(-10),Y(-36+bob),X(-10),Y(-22+bob),X(-12),Y(-22+bob)],'rgba(0,0,0,.25)');
  c.strokeStyle='#5a1a12';c.lineWidth=1;c.beginPath();c.moveTo(X(-11),Y(-33+bob));c.lineTo(X(-6),Y(-26+bob));c.moveTo(X(-6),Y(-33+bob));c.lineTo(X(-11),Y(-26+bob));c.stroke();poly(c,[X(-7),Y(-37+bob),X(-5),Y(-40+bob),X(-4),Y(-39+bob),X(-5.5),Y(-36.5+bob)],'#3a3a36',1);
  const dr=(tt*1.3+ph(z)*.1)%1;dot(c,X(-8),Y(-22+bob+dr*20),1,'rgba(200,180,90,'+(1-dr)+')');
  /* piernas carbonizadas con grietas que brillan */
  lim2(c,X(-3),Y(-16),X(-4+w),Y(-8),X(-3+w),Y(-1.5),4.6,'#2a1e18');lim2(c,X(3),Y(-16),X(4-w),Y(-8),X(4-w),Y(-1.5),4.6,'#3a2a20');
  c.strokeStyle='rgba(255,140,40,'+fl+')';c.lineWidth=.9;c.beginPath();c.moveTo(X(4-w*.5),Y(-13));c.lineTo(X(4.5-w*.8),Y(-9));c.lineTo(X(3.5-w),Y(-5));c.stroke();
  /* tronco quemado, harapos y grietas de brasa */
  poly(c,[X(-6),Y(-16),X(6),Y(-16),X(8),Y(-27+bob),X(6),Y(-33+bob),X(-6),Y(-33+bob),X(-8),Y(-27+bob)],'#3a2620');
  fpoly(c,[X(-6),Y(-16),X(-1),Y(-16),X(-2),Y(-33+bob),X(-6),Y(-33+bob),X(-8),Y(-27+bob)],'rgba(0,0,0,.25)');
  poly(c,[X(-7),Y(-25+bob),X(7),Y(-26+bob),X(6),Y(-17),X(4),Y(-20),X(2),Y(-16),X(-1),Y(-19),X(-3),Y(-16),X(-6),Y(-18)],'#5a4436',1.1);
  c.strokeStyle='rgba(255,'+(120+Math.round(60*fl))+',40,'+(.6+.4*fl)+')';c.lineWidth=1.1;c.beginPath();c.moveTo(X(-2),Y(-32+bob));c.lineTo(X(1),Y(-29+bob));c.lineTo(X(0),Y(-27+bob));c.moveTo(X(4),Y(-31+bob));c.lineTo(X(6),Y(-28+bob));c.moveTo(X(-5),Y(-22));c.lineTo(X(-3),Y(-20));c.lineTo(X(-4),Y(-17));c.stroke();
  /* brazos */
  const ar=Math.sin(p)*2;lim2(c,X(-5),Y(-31+bob),X(-2),Y(-23),X(5),Y(-19+ar),3.6,'#3a2a20');
  lim2(c,X(5),Y(-31+bob),X(11),Y(-25),X(15),Y(-29-ar),3.8,'#4a3428','rgba(255,150,60,.35)');
  claws(c,X(15),Y(-29-ar),f,4.5,'#2a1a14');
  /* cabeza derretida: medio cráneo, boca y ojos encendidos */
  const hx=X(3),hy=Y(-39+bob);face(c,hx,hy,5.8,f,'#4a3428','#ffe070',.55,'rgba(255,170,40,.35)');
  c.fillStyle='#d9cfb4';c.beginPath();c.ellipse(hx-f*2.4,hy-2,2.8,3.4,0,Math.PI*.8,Math.PI*2.1);c.fill();
  c.fillStyle='rgba(255,150,40,'+(.5+.4*fl)+')';c.beginPath();c.ellipse(hx+f*1.8,hy+2.8,1.6,1,0,0,7);c.fill();
  /* llamas por capas: espalda, hombros y cabeza */
  for(const [dx,y0,h0,col] of[[-9,-38,11,'#ff6a1a'],[-5,-38,9,'#ff9a30'],[-8,-37,6,'#ffd060'],[7,-31,6,'#ff7a2a'],[-6,-31,6,'#ff9a30'],[1,-44,9,'#ff6a1a'],[4,-44,11,'#ff8a2a'],[2.5,-44,7,'#ffd060']]){const h=h0*(.72+.38*Math.sin(tt*12+dx*2+ph(z))),s2=Math.sin(tt*8+dx)*1.8;c.fillStyle=col;c.beginPath();c.moveTo(X(dx-2.8),Y(y0+bob));c.quadraticCurveTo(X(dx-2.4)+s2*.5,Y(y0+bob-h*.6),X(dx)+s2,Y(y0+bob-h));c.quadraticCurveTo(X(dx+2.4)+s2*.5,Y(y0+bob-h*.6),X(dx+2.8),Y(y0+bob));c.fill()}
  /* chispas que suben */
  for(let i=0;i<5;i++){const a=(tt*.9+i*.21+ph(z)*.03)%1;dot(c,X(-6+i*3+Math.sin(a*9+i)*3),Y(-40-a*30),1.1*(1-a)+.3,'rgba(255,'+(150+i*20)+',60,'+(1-a)+')')}},
l(c,z,q,f,tt){const p=tt*7+ph(z),w=Math.sin(p)*4,X=v=>q[0]+v*f,Y=v=>q[1]+v,at=z.at,bob=Math.abs(Math.sin(p))*1.4,ro=(tt*.5+ph(z)*.05)%1;
  /* aura: anillo de 3,5 casillas que late y ondas al rugir */
  c.strokeStyle='rgba(200,40,30,'+(.25+.15*Math.sin(tt*4))+')';c.lineWidth=1.6;c.beginPath();c.ellipse(q[0],q[1],3.5*32*.5,3.5*16*.5,0,0,7);c.stroke();
  if(ro<.35){const k=ro/.35;c.strokeStyle='rgba(220,50,40,'+(.5*(1-k))+')';c.lineWidth=2.4;c.beginPath();c.ellipse(q[0],q[1]-30,14+k*60,8+k*30,0,0,7);c.stroke()}
  for(let i=0;i<4;i++){const a=(tt*.35+i*.25)%1,an=i*1.6+ph(z);dot(c,q[0]+Math.cos(an)*(20+a*20),q[1]-4-a*20+Math.sin(an)*6,1.6*(1-a)+.4,'rgba(200,40,30,'+(.45*(1-a))+')')}
  sh(c,q,15,5.4);
  /* piernas largas, pantalón hecho jirones, cinturón con trofeos */
  lim2(c,X(-5),Y(-22),X(-7+w),Y(-11),X(-5+w),Y(-1.5),6.4,'#2e3628');lim2(c,X(5),Y(-22),X(7-w),Y(-11),X(6-w),Y(-1.5),6.4,'#3e4a34','rgba(255,255,255,.1)');
  blob(c,X(-4+w),Y(-1.4),4,2,SKD);blob(c,X(7-w),Y(-1.4),4,2,SK);
  fpoly(c,[X(-9+w),Y(-12),X(-3+w),Y(-12),X(-4+w),Y(-8),X(-6+w),Y(-10),X(-8+w),Y(-7)],'#5f7c4c');
  /* espinas de hueso en la espalda */
  for(let i=0;i<4;i++){const bx=X(-10+i*1.2),by=Y(-46+i*6+bob);poly(c,[bx,by-2,bx-f*(7-i),by-6+i,bx,by+2.5],'#e0d6bc',1.1)}
  /* tronco musculoso: pectorales, abdominales, venas rojas, cicatriz */
  const T0=-50+bob;poly(c,[X(-9),Y(-21),X(8),Y(-21),X(14),Y(T0+6),X(10),Y(T0),X(-11),Y(T0),X(-14),Y(T0+6)],'#5f7c4c',1.7);
  fpoly(c,[X(-9),Y(-21),X(-2),Y(-21),X(-3),Y(T0),X(-11),Y(T0),X(-14),Y(T0+6)],'rgba(0,0,0,.22)');
  c.strokeStyle='rgba(30,40,20,.55)';c.lineWidth=1.2;c.beginPath();c.moveTo(X(1),Y(T0+4));c.lineTo(X(1),Y(-24));c.moveTo(X(-6),Y(T0+11));c.quadraticCurveTo(X(1),Y(T0+14),X(9),Y(T0+10));
  for(let i=0;i<3;i++){c.moveTo(X(-3),Y(T0+17+i*4));c.lineTo(X(6),Y(T0+17+i*4))}c.stroke();
  fpoly(c,[X(3),Y(T0+2),X(11),Y(T0+3),X(9),Y(T0+9),X(3),Y(T0+10)],SKH);
  const vp=.45+.35*Math.sin(tt*5);c.strokeStyle='rgba(190,30,30,'+vp+')';c.lineWidth=1;c.beginPath();c.moveTo(X(-8),Y(T0+5));c.quadraticCurveTo(X(-4),Y(T0+12),X(-6),Y(T0+20));c.moveTo(X(-4),Y(T0+12));c.lineTo(X(0),Y(T0+15));c.moveTo(X(6),Y(T0+20));c.quadraticCurveTo(X(9),Y(T0+14),X(12),Y(T0+8));c.stroke();
  c.strokeStyle='#5a1a1a';c.lineWidth=1.6;c.beginPath();c.moveTo(X(-5),Y(T0+4));c.lineTo(X(5),Y(T0+18));c.stroke();
  poly(c,[X(-9),Y(-25),X(8),Y(-25),X(8),Y(-21),X(-9),Y(-21)],'#3a2a1e',1.2);blob(c,X(4),Y(-22),2.6,2.8,'#e0d6bc');c.fillStyle='#1a1410';c.fillRect(X(4)-1.6,Y(-23),1.2,1.1);c.fillRect(X(4)+.5,Y(-23),1.2,1.1);
  for(let i=0;i<3;i++)poly(c,[X(-6+i*3),Y(-21),X(-5+i*3),Y(-15+i%2*2),X(-4+i*3),Y(-21)],'#4a3a2a',1);
  /* espinas de los hombros */
  for(const s of[-1,1])for(let i=0;i<3;i++){const bx=X((s<0?-11:9)+s*i*2.4),by=Y(T0+1+i*1.6);poly(c,[bx-2,by,bx+s*f*1.5,by-8+i,bx+2,by],'#e0d6bc',1.1)}
  /* brazos largos con garras */
  const ak=at?Math.sin(tt*9)*6:Math.sin(p)*2;
  lim2(c,X(-10),Y(T0+5),X(-6),Y(T0+20),X(4+ak),Y(T0+26-ak),5.4,SKD);claws(c,X(4+ak),Y(T0+26-ak),f,7,'#d9d2b8');
  /* cabeza: mandíbula alargada, colmillos, rugido periódico, ojos rojos y pelo ralo */
  const hx=X(4),hy=Y(T0-6),mo=at||ro<.35?.9:.35;c.strokeStyle='#1e1a14';c.lineWidth=1.2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(hx-f*(4-i*1.6),hy-5.6);c.quadraticCurveTo(hx-f*(7-i),hy-2,hx-f*(8-i*.5),hy+2+i);c.stroke()}
  face(c,hx,hy,6.6,f,SK,'#ff3a2a',mo,'rgba(255,50,30,.35)');
  c.fillStyle='#f0e8d0';c.beginPath();c.moveTo(hx+f*1,hy+3);c.lineTo(hx+f*1.8,hy+6.5);c.lineTo(hx+f*2.6,hy+3);c.moveTo(hx+f*4,hy+3);c.lineTo(hx+f*4.6,hy+6.5);c.lineTo(hx+f*5.4,hy+3);c.fill();
  c.strokeStyle='#5a1a1a';c.lineWidth=1.1;c.beginPath();c.moveTo(hx+f*1,hy-6);c.lineTo(hx+f*4.5,hy+1);c.stroke();
  lim2(c,X(9),Y(T0+5),X(15),Y(T0+18),X(19+ak*.6),Y(T0+12-ak),5.6,SK,SKH);claws(c,X(19+ak*.6),Y(T0+12-ak),f,8,'#e6dcc0',-3)}};
/* ZX: los nuevos usan el mismo camino de dibujo que los especiales */
const oHas=ZX.has,oDh=ZX.dh,oBh=ZX.bh,oDr=ZX._dr,oComp=ZX.comp;
ZX.has=t=>NS.has(t)||oHas(t);ZX.bh=t=>NS.has(t)?ZN[t].bh:oBh(t);
ZX.dh=function(c,z){if(!NS.has(z.t))return oDh.apply(this,arguments);const q=P(z.x,z.y),f=z.dx<0?-1:1;c.save();try{DR[z.t](c,z,q,f,z.el!=null?z.el:T)}finally{c.restore()}};
ZX._dr=(c,z,q,f,tt)=>NS.has(z.t)?DR[z.t](c,z,q,f,tt):oDr(c,z,q,f,tt);
ZX.comp=function(comp,n,PG){oComp.apply(this,arguments);const add=(k,min,pg,v)=>{if(n>=min&&PG>=pg){const q=Math.round(v);if(q>0)comp[k]=Math.max(comp[k]||0,q)}};
 add('x',6,16,Math.min(5,n/4));add('w',7,18,Math.min(3,n/8));add('i',7,20,Math.min(6,n/4));add('l',8,22,Math.min(2,1+n/15))};
/* fuego en el suelo: se dibuja con los efectos */
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{if(FIRE.length){const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  FIRE.forEach(f=>{const q=P(f.x,f.y),a=Math.min(1,f.t/1.5);c.globalCompositeOperation='lighter';const g=c.createRadialGradient(q[0],q[1]-6,0,q[0],q[1]-6,40);g.addColorStop(0,'rgba(255,140,40,'+(.5*a)+')');g.addColorStop(1,'rgba(255,90,20,0)');c.fillStyle=g;c.beginPath();c.ellipse(q[0],q[1],40,22,0,0,7);c.fill();c.globalCompositeOperation='source-over';
   for(let k=0;k<6;k++){const ox=Math.cos(k*1.7)*14,oy=Math.sin(k*2.3)*7,h=(8+6*Math.sin(T*11+k*2))*a;c.fillStyle=k%2?'#ff8a30':'#ffc040';c.beginPath();c.moveTo(q[0]+ox-3,q[1]+oy);c.quadraticCurveTo(q[0]+ox,q[1]+oy-h*1.2,q[0]+ox+3,q[1]+oy);c.fill()}});c.restore()}}catch(e){}return r};try{render=window.render}catch(e){}}
})();
