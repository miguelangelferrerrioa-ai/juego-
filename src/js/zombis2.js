/* ===== Dead Town · zombis especiales: musculoso, jinete, trepador, escupidor, cazador, gritón, acorazado e inválido ===== */
(function(){
'use strict';
const ZN={
 u:{n:'Zombi musculoso',hp:340,sp:.42,d:24,c:'#86a064',big:1,bh:64},
 j:{n:'Zombi jinete',hp:170,sp:1.45,d:11,c:'#7a5a3a',big:1,bh:66},
 t:{n:'Zombi trepador',hp:75,sp:.85,d:8,c:'#7f9c62',climb:1,bh:44},
 q:{n:'Zombi escupidor',hp:62,sp:.5,d:7,c:'#9bb83a',rng:4.6,cd:1.6,tc:'#b6e04a',bh:48},
 h:{n:'Zombi cazador',hp:90,sp:1.05,d:12,c:'#4c5444',bh:44},
 g:{n:'Zombi gritón',hp:58,sp:.62,d:4,c:'#b8b49a',bh:50},
 a:{n:'Zombi acorazado',hp:250,sp:.5,d:13,c:'#6a7078',bh:56},
 v:{n:'Zombi inválido',hp:44,sp:.2,d:6,c:'#79a05a',bh:24}};
Object.assign(ZT,ZN);
const SP=new Set(Object.keys(ZN));
const hyp=Math.hypot;
/* ---------- utilidades ---------- */
const recon=(z,fn)=>{if(z.lhp===undefined)z.lhp=z.hp;const d=z.lhp-z.hp;if(d>0){const r=fn(d);if(r>0)z.hp=Math.min(z.mhp,z.hp+d*r)}z.lhp=z.hp};
function near(z,r){let best=null,bd=r;S.ppl.forEach(p=>{if(p.away||p.inside||p.hp<=0)return;const d=hyp(p.x-z.x,p.y-z.y);if(d<bd){bd=d;best={o:p,d,u:0}}});U.forEach(u=>{if(u.hp<=0)return;const d=hyp(u.x-z.x,u.y-z.y);if(d<bd){bd=d;best={o:u,d,u:1}}});return best}
function hurt(t,d){const o=t.o;o.hp-=d;if(t.u){o.p.injury=Math.min(100,(o.p.injury||0)+d*.22)}else{o.injury=Math.min(100,(o.injury||0)+d*.15);o.mor=Math.max(0,(o.mor||0)-3);if(o.hp<=0)die(o,'atacado por los zombis')}}
/* ---------- creación ---------- */
const oMk=window.mkZ;window.mkZ=function(t){const z=oMk.apply(this,arguments);if(SP.has(t)){z.lhp=z.hp;if(t==='a'){z.pl0=z.mhp*.7;z.pl=z.pl0}}return z};
/* ---------- comportamiento en la defensa de la base ---------- */
const oZ=window.zUpd;
function climb(z,dt){if(!z.act)return oZ(z,dt);const zt=ZT.t;z.at=0;let tg=near(z,80),tx,ty,tb=null;
 if(tg){tx=tg.o.x;ty=tg.o.y}else{if(!z.tg||!bm[z.tg]){let bd=1e9;S.bld.forEach(b=>{if(b.type=='road'||b.type=='bridge'||b.type=='wall'||b.type=='gate')return;const dd=hyp(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<bd){bd=dd;z.tg=b.id}})}
  tb=bm[z.tg];if(!tb)return;tx=cl(z.x,tb.x,tb.x+tb.w);ty=cl(z.y,tb.y,tb.y+tb.h)}
 const dist=hyp(tx-z.x,ty-z.y);z.dx=tx-z.x;
 if(dist<=.85){z.at=1;z.cl=0;if(tg)hurt(tg,zt.d*dt);else{tb.hp-=zt.d*dt;if(tb.hp<=0)killB(tb)}return}
 const ix=Math.floor(z.x),iy=Math.floor(z.y),here=(ix>=0&&iy>=0&&ix<N&&iy<N)?bm[occ[iy*N+ix]]:null,onW=!!(here&&(here.type==='wall'||here.type==='gate'));
 const s=zt.sp*(onW?.5:1)*dt*terrMul(z.x,z.y),nx=z.x+(tx-z.x)/dist*s,ny=z.y+(ty-z.y)/dist*s,jx=Math.floor(nx),jy=Math.floor(ny);
 const nb=(jx>=0&&jy>=0&&jx<N&&jy<N)?bm[occ[jy*N+jx]]:null;
 if(!nb||nb===tb||WK(nb.type)||nb.type==='wall'||nb.type==='gate'){z.x=nx;z.y=ny;z.cl=(nb&&(nb.type==='wall'||nb.type==='gate'))?1:0}
 else{z.at=1;z.cl=0;nb.hp-=zt.d*dt;if(nb.hp<=0)killB(nb)}}
function hunt(z,dt){if(!z.act)return oZ(z,dt);const zt=ZT.h;z.at=0;
 if(z.pinT){const p=z.pinT.o;if(p.hp<=0||T>p.pin||z.hp<=0){p.pin=0;z.pinT=null}else{z.x=p.x+.3;z.y=p.y+.05;z.at=1;hurt(z.pinT,zt.d*.7*dt);if(z.pinT.u===0){p.tx=p.x;p.ty=p.y}return}}
 if(z.leap){const L=z.leap;L.t-=dt;const k=Math.min(1,dt/Math.max(.001,L.t+dt));z.x+=(L.tx-z.x)*k;z.y+=(L.ty-z.y)*k;z.dx=L.tx-z.x;z.lz=Math.sin(Math.PI*Math.max(0,Math.min(1,1-L.t/L.d)));
  if(L.t<=0){z.leap=null;z.lz=0;const t=L.tg;if(t&&t.o.hp>0&&hyp(t.o.x-z.x,t.o.y-z.y)<1.4){hurt(t,zt.d*2.2);t.o.pin=T+3;t.o.pinBy=z;z.pinT=t;burst(t.o.x,t.o.y,6,'#b22',1.6,9)}}return}
 z.lc=(z.lc||0)-dt;const tg=near(z,5.5);
 if(tg&&z.lc<=0&&tg.d>1.7&&!wallBetween(z.x,z.y,tg.o.x,tg.o.y)){z.leap={tx:tg.o.x,ty:tg.o.y,t:.42,d:.42,tg};z.lc=6+rn(0,2);sfxAt('zscream',z.x,z.y,{rate:1.1,v:.9});return}
 return oZ(z,dt)}
window.zUpd=function(z,dt){const t=z.t;if(z.boost>T)dt*=1.35;if(!SP.has(t))return oZ(z,dt);if(z.hp<=0)return;
 if(!z.act)return oZ(z,dt);
 if(t==='t')return climb(z,dt);
 if(t==='h')return hunt(z,dt);
 if(t==='a'){recon(z,d=>{if(z.pl>0){const r=d>=22?.3:.65;z.pl=Math.max(0,z.pl-d*r*.9);if(Math.random()<.4)burst(z.x,z.y,2,'#cfd6dc',1.4,10);z.sp2=T;return r}return 0})}
 if(t==='v'){recon(z,d=>d<10?.3:0)}
 if(t==='j'){z.jc=(z.jc||0)-dt;const tg=near(z,10);
  if(z.chg>0){z.chg-=dt;dt*=2.3;if(tg&&tg.d<1.1&&!z.tr1){z.tr1=1;hurt(tg,18);burst(z.x,z.y,6,'#b22',1.6,9)}if(Math.random()<dt*14)burst(z.x,z.y,1,'#a89870',1.2,4)}
  else if(tg&&z.jc<=0&&tg.d>3){z.chg=1.1;z.jc=7+rn(0,2);z.tr1=0;sfxAt('zscream',z.x,z.y,{rate:.9,v:1})}}
 if(t==='g'){z.sc=(z.sc||0)-dt;const tg=near(z,9);
  if(tg&&z.sc<=0){z.sc=9;z.scr=T;Z.forEach(o=>{if(o!==z&&o.act&&hyp(o.x-z.x,o.y-z.y)<16)o.boost=T+5});S.ppl.forEach(p=>{if(!p.away&&hyp(p.x-z.x,p.y-z.y)<6)p.mor=Math.max(0,p.mor-8)});sfxAt('zshriek',z.x,z.y,{rate:.45,v:1.3});SHK=Math.max(SHK||0,.1)}
  if(T-(z.scr||-9)<.9){z.at=0;return}}
 oZ(z,dt);
 if(t==='u'&&z.at){z.sl=(z.sl||0)-dt;if(z.sl<=0){z.sl=2.4;z.slam=T;S.ppl.forEach(p=>{if(!p.away&&!p.inside&&hyp(p.x-z.x,p.y-z.y)<2.3){p.hp-=14;p.injury=Math.min(100,(p.injury||0)+8);if(p.hp<=0)die(p,'aplastado por un zombi')}});U.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<2.3)u.hp-=14});const b=bm[z.tg];if(b&&hyp(b.x+b.w/2-z.x,b.y+b.h/2-z.y)<4){b.hp-=30;if(b.hp<=0)killB(b)}SHK=Math.max(SHK||0,.12);burst(z.x,z.y,8,'#8a7a5a',2,8);sfxAt('crumble',z.x,z.y,{rate:.8,v:.7})}}
 if(t==='q'&&z.at){z.sq=(z.sq||0)-dt;if(z.sq<=0){z.sq=1.4;z.spit=T;const tg=near(z,ZT.q.rng+.5),b=bm[z.tg];const tx=tg?tg.o.x:b?b.x+b.w/2:z.x,ty=tg?tg.o.y:b?b.y+b.h/2:z.y;FX.push({a:[z.x,z.y],b:[tx,ty],t:.22,col:'#b6e04a'});burst(tx,ty,4,'#9bd03a',1,6)}}
 if(t==='v'&&z.at){const tg=near(z,1);if(tg&&!tg.u){tg.o.pin=T+1.3;tg.o.pinBy=z}}};
/* sujeción (cazador / inválido): las personas se quedan quietas y los soldados no se mueven */
const oUpd=window.upd;window.upd=function(dt){S.ppl.forEach(p=>{if(p.pin>T){if(p.pinBy&&p.pinBy.hp<=0)p.pin=0;else{p.tx=p.x;p.ty=p.y}}});return oUpd.apply(this,arguments)};
const oU=window.uUpd;window.uUpd=function(u,dt){if(u.pin>T){if(u.pinBy&&u.pinBy.hp<=0){u.pin=0}else{const x=u.x,y=u.y;oU.apply(this,arguments);u.x=x;u.y=y;return}}return oU.apply(this,arguments)};
/* el jinete suelta a su jinete al morir */
const oC=window.combat;window.combat=function(dt){const js=Z.filter(z=>z.t==='j');const r=oC.apply(this,arguments);js.forEach(z=>{if(z.hp<=0&&!z.dd){z.dd=1;const n=mkZ('z',z.x,z.y,1);n.hp=n.mhp=Math.round(n.mhp*.6);n.lhp=n.hp;Z.push(n);burst(z.x,z.y,10,'#8a6a3a',2,8)}});return r};
/* ---------- composición de hordas ---------- */
const COMP=(comp,n,PG)=>{const add=(k,min,pg,v)=>{if(n>=min&&PG>=pg){const q=Math.round(v);if(q>0)comp[k]=Math.max(comp[k]||0,q)}};
 add('v',2,4,Math.min(6,1+n/3));add('q',3,6,Math.min(7,1+n/3));add('t',3,9,Math.min(8,n/2.5));add('g',4,11,Math.min(3,1+n/6));
 add('a',5,13,Math.min(6,n/3));add('h',5,15,Math.min(6,n/3));add('u',6,17,Math.min(4,n/4));add('j',7,19,Math.min(5,n/3.5))};
const MIXL={v:2,q:3,t:4,g:5,a:6,h:7,u:8,j:9};
const MIX=(l,R)=>{const p=Math.min(.4,.035*(l-1));if(p<=0||R()>=p)return null;const ok=Object.keys(MIXL).filter(k=>l>=MIXL[k]);return ok.length?ok[Math.floor(R()*ok.length)]:null};
/* ---------- dibujo ---------- */
const OL='#14100a';
const sh=(c,q,rx,ry)=>{c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(q[0],q[1],rx,ry,0,0,7);c.fill()};
const lim=(c,x1,y1,x2,y2,w,col)=>{c.lineCap='round';c.strokeStyle=OL;c.lineWidth=w+2;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
const blob=(c,x,y,rx,ry,col,rot)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=1.4;c.beginPath();c.ellipse(x,y,rx,ry,rot||0,0,7);c.fill();c.stroke()};
const head=(c,x,y,r,skin,eye,mouth)=>{blob(c,x,y,r,r*1.05,skin);c.fillStyle=eye||'#e8e07a';c.fillRect(x-r*.55,y-r*.25,r*.4,r*.28);c.fillRect(x+r*.2,y-r*.25,r*.4,r*.28);if(mouth){c.fillStyle='#2a0c0c';c.beginPath();c.ellipse(x,y+r*.5,r*.45,r*.6,0,0,7);c.fill()}};
const SK='#8fae72',SKD='#6f8c58';
const ph=z=>z.x*3+z.y*2.1;
const lim2=(c,x1,y1,x2,y2,x3,y3,w,col,hi)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle=OL;c.lineWidth=w+2;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x3,y3);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.stroke();
 if(hi){c.strokeStyle=hi;c.lineWidth=Math.max(1,w*.28);c.beginPath();c.moveTo(x1-w*.2,y1-w*.15);c.lineTo(x2-w*.2,y2-w*.15);c.stroke()}};
const poly=(c,pts,col,lw)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=lw||1.5;c.lineJoin='round';c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();c.fill();if(lw!==0)c.stroke()};
const fpoly=(c,pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();c.fill()};
const dot=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
const claws=(c,x,y,f,len,col,dy)=>{for(const [w,cc] of[[2.6,OL],[1.3,col]]){c.strokeStyle=cc;c.lineWidth=w;c.lineCap='round';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x,y+k*1.6);c.quadraticCurveTo(x+f*len*.7,y+k*2.4-1+(dy||0),x+f*len,y+k*2.6+2+(dy||0));c.stroke()}}};
const face=(c,x,y,r,f,skin,eye,mo,glow)=>{blob(c,x,y,r,r*1.08,skin);
 c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x-f*r*.35,y+r*.15,r*.6,r*.85,0,0,7);c.fill();
 c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.ellipse(x+f*r*.25,y-r*.45,r*.45,r*.3,0,0,7);c.fill();
 c.fillStyle='#1a1410';c.beginPath();c.ellipse(x+f*r*.42,y-r*.12,r*.28,r*.22,0,0,7);c.ellipse(x-f*r*.12,y-r*.12,r*.24,r*.2,0,0,7);c.fill();
 if(glow){c.fillStyle=glow;c.beginPath();c.arc(x+f*r*.42,y-r*.12,r*.55,0,7);c.arc(x-f*r*.12,y-r*.12,r*.45,0,7);c.fill()}
 c.fillStyle=eye;c.fillRect(x+f*r*.42-r*.13,y-r*.2,r*.26,r*.17);c.fillRect(x-f*r*.12-r*.11,y-r*.2,r*.22,r*.15);
 const m=mo||0;c.fillStyle='#2a0c0c';c.beginPath();c.ellipse(x+f*r*.3,y+r*.48,r*.36,r*(.14+m*.32),0,0,7);c.fill();
 if(m>.1){c.fillStyle='#e6dcc0';for(let k=-1;k<=1;k++){c.fillRect(x+f*r*.3+k*r*.2-r*.05,y+r*(.48-.14-m*.32)+.2,r*.1,r*.16);c.fillRect(x+f*r*.3+k*r*.2-r*.05,y+r*(.48+.14+m*.32)-r*.16,r*.1,r*.15)}}};
const SKH='rgba(220,240,190,.35)',demo=z=>z.mhp===1&&z.pl0===1;
/* herida con sangre seca */
const wound=(c,x,y,r)=>{c.fillStyle='#5a1a16';c.beginPath();c.ellipse(x,y,r,r*.7,0,0,7);c.fill();c.fillStyle='#8a2a22';c.beginPath();c.ellipse(x-r*.2,y-r*.1,r*.5,r*.35,0,0,7);c.fill()};
/* jirones: borde de tela roto */
const rag=(c,x1,x2,y,col,n)=>{c.fillStyle=col;c.beginPath();c.moveTo(x1,y);const st=(x2-x1)/n;for(let i=0;i<n;i++){c.lineTo(x1+st*(i+.5),y+3+(i%2)*2.4);c.lineTo(x1+st*(i+1),y)}c.closePath();c.fill()};
const DR={
u(c,z,q,f,tt){const X=v=>q[0]+v*f,Y=v=>q[1]+v,p=tt*5+ph(z),sw=Math.sin(p)*4;let att=z.at,sl=Math.max(0,1-(tt-(z.slam||-9))*3);
  if(demo(z)&&att){const k=tt%1.2;sl=k<.33?1-k*3:0}
  const bob=Math.abs(Math.sin(p))*1.4;sh(c,q,19,6.8);
  /* piernas cortas y anchas con pantalón reventado */
  lim2(c,X(-6),Y(-17),X(-8+sw),Y(-9),X(-6+sw),Y(-1.8),8.5,'#4a4638');lim2(c,X(6),Y(-17),X(8-sw),Y(-9),X(7-sw),Y(-1.8),8.5,'#5a5648','rgba(255,255,255,.1)');
  fpoly(c,[X(5-sw),Y(-11),X(10-sw),Y(-11),X(9-sw),Y(-6),X(6-sw),Y(-7)],SK);blob(c,X(-5+sw),Y(-1.6),4.6,2.2,'#2a2420');blob(c,X(8-sw),Y(-1.6),4.6,2.2,'#332a22');
  /* tronco: espalda enorme, pectorales, venas moradas, camiseta hecha jirones */
  const T0=-44+bob;poly(c,[X(-11),Y(-16),X(11),Y(-16),X(18),Y(T0+8),X(13),Y(T0),X(-13),Y(T0),X(-18),Y(T0+8)],SKD,1.8);
  fpoly(c,[X(-11),Y(-16),X(-2),Y(-16),X(-3),Y(T0),X(-13),Y(T0),X(-18),Y(T0+8)],'rgba(0,0,0,.2)');
  fpoly(c,[X(1),Y(T0+3),X(12),Y(T0+3),X(14),Y(T0+9),X(3),Y(T0+11)],SKH);
  c.strokeStyle='rgba(30,40,20,.5)';c.lineWidth=1.3;c.beginPath();c.moveTo(X(0),Y(T0+4));c.lineTo(X(0),Y(-19));c.moveTo(X(-10),Y(T0+12));c.quadraticCurveTo(X(0),Y(T0+16),X(12),Y(T0+11));for(let i=0;i<2;i++){c.moveTo(X(-5),Y(T0+20+i*5));c.lineTo(X(6),Y(T0+20+i*5))}c.stroke();
  c.strokeStyle='rgba(120,70,150,.65)';c.lineWidth=1.1;for(const [a,b] of[[-8,4],[7,6],[11,14]]){c.beginPath();c.moveTo(X(a),Y(T0+b));c.quadraticCurveTo(X(a+3),Y(T0+b+6),X(a+1),Y(T0+b+12));c.lineTo(X(a+3),Y(T0+b+15));c.stroke()}
  poly(c,[X(-13),Y(-25),X(-6),Y(T0+4),X(-2),Y(T0+18),X(-11),Y(-17)],'#7a7a6e',1.2);rag(c,X(-12),X(-3),Y(-25),'#7a7a6e',3);
  wound(c,X(7),Y(T0+22),2.4);poly(c,[X(-11),Y(-21),X(11),Y(-21),X(11),Y(-16),X(-11),Y(-16)],'#3a2e22',1.2);
  /* brazos gigantes con puños hinchados; al golpear los alza y los baja */
  const rz=att?(sl>0?0:Math.min(1,(tt%1.2)/1)):0;
  [[-1,SKD],[1,SK]].forEach(([s,col])=>{const sx=X(s*15),sy=Y(T0+3),ux=att?sx+f*(4+s*2):sx+s*3*f,uy=att?Y(T0-12*rz+(1-rz)*14):Y(T0+14),fx=att?X(8+s*4):X(s*17+4),fy=att?(sl>0?Y(-6):Y(T0-20*rz+(1-rz)*28)):Y(-18+Math.sin(p+s)*2);
   lim2(c,sx,sy,ux,uy,fx,fy,9,col,s>0?SKH:0);blob(c,fx,fy,7,6.4,col);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(fx+f*3,fy+k*2.2-1);c.lineTo(fx+f*6,fy+k*2.2-1);c.stroke()}});
  /* cabeza pequeña entre los hombros */
  face(c,X(2),Y(-47+bob),6.4,f,SK,'#e8e07a',att?.8:.4);c.strokeStyle='#1a1410';c.lineWidth=1;c.beginPath();c.moveTo(X(-2),Y(-53+bob));c.lineTo(X(4),Y(-51+bob));c.stroke();
  if(sl>0){c.strokeStyle='rgba(200,180,140,'+sl*.7+')';c.lineWidth=2.4;c.beginPath();c.ellipse(q[0],q[1],(1-sl)*50+8,(1-sl)*24+4,0,0,7);c.stroke();
   for(let i=0;i<6;i++){const a=i*1.05,r=(1-sl)*30;dot(c,q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r*.45-sl*8,1.6,'rgba(120,100,70,'+sl+')')}}},
j(c,z,q,f,tt){let ch=z.chg>0;if(demo(z))ch=(tt%5)>3.4;const p=tt*(ch?16:10)+ph(z);sh(c,q,24,7);
  const X=v=>q[0]+v*f,Y=v=>q[1]+v;
  /* patas del caballo con cascos */
  [[-11,0],[-8,Math.PI],[10,Math.PI*.5],[13,Math.PI*1.5]].forEach(([hx,o],i)=>{const a=Math.sin(p+o),l=Math.max(0,Math.cos(p+o));lim2(c,X(hx),Y(-18),X(hx+a*4),Y(-10-l*2),X(hx+a*7),Y(-3-l*4),4.4,i%2?'#4a3220':'#5e4228');blob(c,X(hx+a*7),Y(-2.5-l*4),2.6,1.7,'#1e1812')});
  /* cola deshilachada */
  c.strokeStyle='#2a2018';c.lineWidth=2;for(let k=0;k<3;k++){c.beginPath();c.moveTo(X(-17),Y(-26));c.quadraticCurveTo(X(-25-k),Y(-24+Math.sin(p+k)*3),X(-22+k*2),Y(-11+k))}c.stroke();
  /* cuerpo podrido: costillas al aire, manta y silla */
  blob(c,X(0),Y(-24),18,8.6,'#6e5034');fpoly(c,[X(-17),Y(-22),X(17),Y(-22),X(14),Y(-18),X(-14),Y(-18)],'rgba(0,0,0,.2)');
  fpoly(c,[X(2),Y(-31),X(13),Y(-30),X(15),Y(-27),X(4),Y(-27)],'rgba(255,230,190,.18)');
  poly(c,[X(-12),Y(-28),X(-4),Y(-29),X(-3),Y(-20),X(-12),Y(-20)],'#4a1c16',1.1);c.strokeStyle='#e0d6bc';c.lineWidth=1.2;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-11+i*3),Y(-28));c.quadraticCurveTo(X(-10+i*3),Y(-24),X(-11+i*3),Y(-20.5));c.stroke()}
  poly(c,[X(-6),Y(-32),X(8),Y(-32),X(9),Y(-22),X(-7),Y(-22)],'#6a2a26',1.2);rag(c,X(-7),X(9),Y(-22),'#6a2a26',4);c.strokeStyle='#c9a23a';c.lineWidth=1;c.beginPath();c.moveTo(X(-6),Y(-30));c.lineTo(X(8),Y(-30));c.stroke();
  /* cuello y cabeza del caballo con crin y brida */
  lim(c,X(13),Y(-28),X(23),Y(-38+Math.sin(p)*1.5),7,'#6e5034');c.strokeStyle='#1e1812';c.lineWidth=1.6;for(let i=0;i<5;i++){const a=i/4;c.beginPath();c.moveTo(X(13+a*10),Y(-31-a*10));c.lineTo(X(11+a*10-2),Y(-33-a*10+Math.sin(p+i)*1.5));c.stroke()}
  blob(c,X(27),Y(-38+Math.sin(p)*1.5),6.8,3.8,'#5e4228',-.35*f);dot(c,X(31),Y(-37+Math.sin(p)*1.5),1,'#1a1410');
  c.fillStyle='#d9d2b8';c.fillRect(X(29)-1,Y(-39),2,1.6);dot(c,X(26),Y(-40+Math.sin(p)*1.5),1.4,'#e8e07a');
  c.strokeStyle='#3a2a1a';c.lineWidth=1;c.beginPath();c.moveTo(X(30),Y(-36));c.lineTo(X(6),Y(-40));c.stroke();
  /* jinete: abrigo largo roto y sombrero */
  const lean=ch?7:3;lim2(c,X(-1),Y(-29),X(4),Y(-24),X(5),Y(-17),5,'#3a3a44');
  poly(c,[X(-5),Y(-28),X(6),Y(-28),X(lean+5),Y(-47),X(lean-5),Y(-47)],'#5a4a3a',1.4);rag(c,X(-6),X(7),Y(-28),'#5a4a3a',4);fpoly(c,[X(-5),Y(-28),X(0),Y(-28),X(lean-1),Y(-47),X(lean-5),Y(-47)],'rgba(0,0,0,.2)');
  const ar=Math.sin(p*.5);lim2(c,X(lean+3),Y(-44),X(lean+9),Y(-40),X(lean+13),Y(-42+ar*3),3.6,SKD);
  face(c,X(lean+4),Y(-53),5.6,f,SK,'#e8e07a',ch?.8:.3);
  poly(c,[X(lean-6),Y(-56),X(lean+11),Y(-56),X(lean+9),Y(-54.5),X(lean-5),Y(-54.5)],'#3a2e22',1.2);poly(c,[X(lean-2),Y(-56),X(lean+7),Y(-56),X(lean+6),Y(-61),X(lean-1),Y(-61)],'#3a2e22',1.2);
  lim2(c,X(lean+4),Y(-44),X(lean+10),Y(-38),X(lean+15),Y(-39-ar*3),3.6,SK,SKH);
  if(ch){c.strokeStyle='rgba(200,190,160,.5)';c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-20-i*4),Y(-30+i*8));c.lineTo(X(-30-i*4),Y(-30+i*8));c.stroke()}if(Math.random()<.3&&!demo(z))burst(z.x,z.y,1,'#a89870',1,3)}},
t(c,z,q,f,tt){let cl_=z.cl;if(demo(z))cl_=(tt%5)>2.5;const p=tt*11+ph(z),X=v=>q[0]+v*f,Y=v=>q[1]+v;sh(c,q,cl_?7:11,cl_?3:4.5);
  if(cl_){const y0=q[1]-12,s1=Math.sin(p)*3;
   lim2(c,q[0]-3,y0+2,q[0]-9,y0+5,q[0]-8,y0+10-s1,4,SKD);lim2(c,q[0]+3,y0+2,q[0]+9,y0+5,q[0]+8,y0+10+s1,4,SKD);
   poly(c,[q[0]-5,y0+2,q[0]+5,y0+2,q[0]+6,y0-12,q[0]-6,y0-12],'#4a5a3e',1.4);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(q[0]-4,y0-8+i*3);c.lineTo(q[0]+4,y0-8+i*3);c.stroke()}
   lim2(c,q[0]-4,y0-10,q[0]-8,y0-17,q[0]-9,y0-24+s1,3.6,SK);lim2(c,q[0]+4,y0-10,q[0]+8,y0-17,q[0]+9,y0-24-s1,3.6,SK,SKH);
   claws(c,q[0]-9,y0-24+s1,-1,4,'#d9d2b8',-4);claws(c,q[0]+9,y0-24-s1,1,4,'#d9d2b8',-4);
   blob(c,q[0],y0-19,5.4,5.8,'#3a4a30');face(c,q[0],y0-19,4.6,1,SK,'#e8e07a',.3);c.fillStyle='#3a4a30';c.beginPath();c.arc(q[0],y0-20,5.6,Math.PI*1.05,Math.PI*1.95);c.fill();return}
  const sw=Math.sin(p)*5;
  lim2(c,X(-3),Y(-14),X(-6-sw),Y(-8),X(-3-sw),Y(-1),4.2,SKD);lim2(c,X(1),Y(-14),X(5+sw),Y(-9),X(2+sw),Y(-1),4.2,'#4a5a3e');
  /* tronco delgado inclinado: sudadera con capucha rota, columna marcada */
  poly(c,[X(-6),Y(-15),X(1),Y(-13),X(9),Y(-27),X(2),Y(-30)],'#4a5a3e',1.4);rag(c,X(-6),X(2),Y(-15),'#4a5a3e',3);
  c.fillStyle=SK;c.beginPath();c.ellipse(X(-1),Y(-22),2,4,f*.5,0,7);c.fill();c.strokeStyle='#5a6a4a';c.lineWidth=.9;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-2.4),Y(-24+i*2));c.lineTo(X(.4),Y(-23+i*2));c.stroke()}
  for(let i=0;i<4;i++)dot(c,X(-1+i*2.6),Y(-15.5-i*3.6),1,'#c8c0a0');
  const aw=Math.sin(p+1.5)*3;lim2(c,X(5),Y(-26),X(10),Y(-22),X(15),Y(-19+aw),3.6,SKD);claws(c,X(15),Y(-19+aw),f,4.5,'#d9d2b8');
  lim2(c,X(4),Y(-25),X(9),Y(-18),X(13),Y(-14-aw),3.6,SK,SKH);claws(c,X(13),Y(-14-aw),f,4.5,'#e6dcc0');
  blob(c,X(9),Y(-30),6.2,6.4,'#3a4a30');face(c,X(10),Y(-30),5.2,f,SK,'#e8e07a',.75);c.fillStyle='#3a4a30';c.beginPath();c.arc(X(9),Y(-31),6.2,f>0?Math.PI*.95:Math.PI*1.25,f>0?Math.PI*1.75:Math.PI*2.05);c.fill()},
q(c,z,q,f,tt){const X=v=>q[0]+v*f,Y=v=>q[1]+v,p=tt*6+ph(z),sw=Math.sin(p)*3.5;let spt=z.spit;if(demo(z)&&z.at)spt=tt-(tt%1.4);const sp=Math.max(0,1-(tt-(spt||-9))*3.2);sh(c,q,10,4);
  lim2(c,X(-3),Y(-15),X(-4+sw),Y(-8),X(-3+sw),Y(-1.5),4.6,'#4a3a28');lim2(c,X(3),Y(-15),X(4-sw),Y(-8),X(3-sw),Y(-1.5),4.6,'#5a4a32');
  /* cuerpo hinchado lleno de pústulas, camisa abierta */
  blob(c,X(0),Y(-26),9,12,'#9bb83a');fpoly(c,[X(-9),Y(-26),X(-2),Y(-37),X(-2),Y(-15),X(-7),Y(-19)],'rgba(0,0,0,.18)');
  poly(c,[X(-9),Y(-32),X(-4),Y(-37),X(-3),Y(-16),X(-8),Y(-17)],'#8a5a32',1.2);poly(c,[X(9),Y(-31),X(5),Y(-36),X(4),Y(-17),X(8),Y(-18)],'#7a4a28',1.2);rag(c,X(-8),X(-3),Y(-17),'#8a5a32',2);
  [[1,-30,1.8],[-1,-23,1.4],[3,-20,1.2],[2,-25,1]].forEach(([x,y,r],i)=>{const pu=.5+.5*Math.sin(tt*4+i*2);dot(c,X(x),Y(y),r+pu*.4,'#c4e04a');dot(c,X(x)-.4,Y(y)-.4,r*.4,'rgba(255,255,220,.7)')});
  c.strokeStyle='rgba(60,90,20,.5)';c.lineWidth=1;c.beginPath();c.moveTo(X(-2),Y(-34));c.quadraticCurveTo(X(2),Y(-28),X(0),Y(-20));c.stroke();
  const aw=Math.sin(p)*2;lim2(c,X(-7),Y(-33),X(-9),Y(-27),X(-10),Y(-20+aw),3.6,SKD);lim2(c,X(7),Y(-33),X(10),Y(-28),X(11),Y(-22-aw),3.6,SK,SKH);
  const back=z.at?sp*3:0;
  /* saco de ácido en la garganta que brilla */
  const pu=.5+.5*Math.sin(tt*5+ph(z));c.fillStyle='rgba(190,230,70,'+(.25+.2*pu)+')';c.beginPath();c.arc(X(2),Y(-36),9+pu*2,0,7);c.fill();
  blob(c,X(2),Y(-34),5.4+pu*.8,6.4+pu,'#c4de52');c.strokeStyle='rgba(90,120,20,.6)';c.lineWidth=.8;c.beginPath();c.moveTo(X(0),Y(-38));c.quadraticCurveTo(X(3),Y(-34),X(1),Y(-29));c.moveTo(X(4),Y(-37));c.lineTo(X(5),Y(-31));c.stroke();dot(c,X(3.4),Y(-37),1.2,'rgba(255,255,220,.6)');
  face(c,X(3),Y(-44-back),5.6,f,'#a3bd7a','#c9f03a',.7,'rgba(200,240,60,.25)');
  /* babas de ácido */
  const dr=(tt*1.4+ph(z)*.1)%1;c.strokeStyle='#9bd03a';c.lineWidth=1.6;c.beginPath();c.moveTo(X(5),Y(-41-back));c.lineTo(X(5.6),Y(-36+dr*6-back));c.stroke();dot(c,X(5.6),Y(-35.5+dr*6-back),1.2,'#b6e04a');
  if(sp>0){c.fillStyle='rgba(190,240,70,'+sp+')';c.beginPath();c.arc(X(8+(1-sp)*14),Y(-40-back),3.2,0,7);c.fill();for(let i=0;i<3;i++)dot(c,X(6+(1-sp)*10-i*3),Y(-40-back+i*1.4),1.2,'rgba(190,240,70,'+sp*.7+')')}},
h(c,z,q,f,tt){const X=v=>q[0]+v*f,p=tt*12+ph(z);const lz=z.lz||0;sh(c,q,lz?7:11,lz?2.6:4.2);
  const HD='#2a2e26';
  if(lz>0){const L=lz*26,ys=q[1]-26-L;
   lim2(c,X(-14),ys+8,X(-8),ys+4,X(-3),ys,5,'#2f342c');lim2(c,X(-12),ys+3,X(-6),ys+1,X(-2),ys-2,5,'#3a3f34');
   poly(c,[X(-6),ys+2,X(9),ys-10,X(12),ys-5,X(-2),ys+5],'#3c4238',1.5);rag(c,X(-6),X(0),ys+3,'#3c4238',2);
   lim2(c,X(6),ys-7,X(12),ys-9,X(19),ys-10,3.8,SK,SKH);claws(c,X(19),ys-10,f,5,'#e6dcc0');lim2(c,X(5),ys-5,X(12),ys-3,X(18),ys-3,3.8,SKD);claws(c,X(18),ys-3,f,5,'#d9d2b8');
   blob(c,X(11),ys-10,5.8,6,HD);c.fillStyle='#14100a';c.beginPath();c.ellipse(X(12.5),ys-9.6,3.4,3.6,0,0,7);c.fill();dot(c,X(13.6),ys-10.4,2.6,'rgba(255,216,58,.35)');c.fillStyle='#ffd83a';c.fillRect(X(13)-1.2,ys-11,2.4,1.6);c.fillRect(X(11)-1.2,ys-11,2,1.4);
   c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(X(-22),ys+6);c.lineTo(X(-10),ys+2);c.moveTo(X(-20),ys-2);c.lineTo(X(-12),ys-3);c.stroke();return}
  const sw=Math.sin(p)*5,cr=z.pinT?4:0,Y=v=>q[1]+v+cr;
  lim2(c,X(-3),Y(-13),X(-7-sw),Y(-8),X(-3-sw),Y(-1-cr),4.6,'#2f342c');lim2(c,X(2),Y(-13),X(7+sw),Y(-8),X(2+sw),Y(-1-cr),4.6,'#3a3f34');
  /* agazapado: sudadera oscura con capucha, vendas en los brazos */
  poly(c,[X(-7),Y(-13),X(3),Y(-12),X(11),Y(-26),X(1),Y(-31),X(-5),Y(-24)],'#3c4238',1.5);rag(c,X(-7),X(3),Y(-13),'#3c4238',3);
  fpoly(c,[X(-7),Y(-13),X(-2),Y(-13),X(-1),Y(-29),X(-5),Y(-24)],'rgba(0,0,0,.25)');c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=1;c.beginPath();c.moveTo(X(-3),Y(-18));c.lineTo(X(5),Y(-24));c.stroke();
  const aw=Math.sin(p+2)*3;lim2(c,X(5),Y(-25),X(11),Y(-20),X(17),Y(-17+aw),3.8,SK,SKH);
  c.strokeStyle='#cfc6a8';c.lineWidth=1.1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(10+i*2),Y(-21.5+i*.8));c.lineTo(X(11+i*2),Y(-18+i*.8));c.stroke()}
  claws(c,X(17),Y(-17+aw),f,5.5,'#e6dcc0');lim2(c,X(4),Y(-24),X(9),Y(-15),X(15),Y(-12-aw),3.8,SKD);claws(c,X(15),Y(-12-aw),f,5.5,'#d9d2b8');
  blob(c,X(9),Y(-31),6.4,6.6,HD);c.fillStyle='#14100a';c.beginPath();c.ellipse(X(10.8),Y(-30.4),3.8,4,0,0,7);c.fill();
  c.fillStyle='rgba(255,216,58,.35)';c.beginPath();c.arc(X(11),Y(-31),4,0,7);c.fill();c.fillStyle='#ffd83a';c.fillRect(X(12)-1.2,Y(-33)+.5,2.4,1.8);c.fillRect(X(9.6)-1,Y(-33)+.6,2,1.5);
  c.fillStyle='#e6dcc0';for(let k=0;k<3;k++)c.fillRect(X(10+k*1.3)-.4,Y(-28.6),.9,1.6)},
g(c,z,q,f,tt){const X=v=>q[0]+v*f,Y=v=>q[1]+v,p=tt*7+ph(z),sw=Math.sin(p)*3.5;let age=tt-(z.scr||-9);if(demo(z))age=tt%3.5;const sc=age<.9;sh(c,q,9,3.8);
  lim2(c,X(-2.5),Y(-15),X(-3+sw),Y(-8),X(-2.5+sw),Y(-1.5),3.6,'#9a9a86');lim2(c,X(2.5),Y(-15),X(3-sw),Y(-8),X(2.5-sw),Y(-1.5),3.6,'#aaa996');
  /* esquelético con bata de hospital rota y costillas */
  poly(c,[X(-6),Y(-15),X(6),Y(-15),X(7),Y(-34),X(-7),Y(-34)],'#9ab0b4',1.4);rag(c,X(-6),X(6),Y(-15),'#9ab0b4',4);
  fpoly(c,[X(-6),Y(-15),X(-2),Y(-15),X(-2),Y(-34),X(-7),Y(-34)],'rgba(0,0,0,.18)');
  fpoly(c,[X(1),Y(-33),X(6),Y(-33),X(5),Y(-22),X(1),Y(-25)],'#cfd2b4');c.strokeStyle='#8a8a76';c.lineWidth=.9;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(1.5),Y(-31+i*2.4));c.quadraticCurveTo(X(4),Y(-32+i*2.4),X(5.5),Y(-30+i*2.4));c.stroke()}
  dot(c,X(-3),Y(-24),1.4,'rgba(120,30,25,.6)');
  const ay=sc?-14:0;lim2(c,X(-6),Y(-32),X(-9),Y(-26+ay*.5),X(-9),Y(-19+ay),3.2,'#c0c3a6');lim2(c,X(6),Y(-32),X(9),Y(-26+ay*.5),X(10),Y(-19+ay),3.2,'#cfd2b4',SKH);
  claws(c,X(10),Y(-19+ay),f,3.5,'#e6dcc0',ay?-3:0);
  /* cabeza con mandíbula desencajada, pelo ralo */
  const hy=sc?Y(-42):Y(-40);c.strokeStyle='#4a4a40';c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(X(-4+i*1.8),hy-6);c.quadraticCurveTo(X(-6+i),hy-2,X(-7+i*.6),hy+3+i);c.stroke()}
  face(c,X(1),hy,6.4,f,'#cfd2b4','#e8e07a',sc?1:.5);
  if(sc){c.fillStyle='#2a0c0c';c.beginPath();c.ellipse(X(2),hy+4.4,3.2,6,0,0,7);c.fill();c.fillStyle='#e6dcc0';for(let k=-1;k<=1;k++){c.fillRect(X(2+k*1.4)-.4,hy+.6,.9,1.6);c.fillRect(X(2+k*1.4)-.4,hy+8.2,.9,1.4)}
   for(let i=0;i<3;i++){const a=age*1.1+i*.28;c.strokeStyle='rgba(255,255,255,'+Math.max(0,.55-a*.6)+')';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1]-26,10+a*70,5+a*34,0,0,7);c.stroke()}}},
a(c,z,q,f,tt){const X=v=>q[0]+v*f,Y=v=>q[1]+v,p=tt*5+ph(z),sw=Math.sin(p)*4,pl=z.pl>0,full=z.pl>(z.pl0||1)*.45;let fl=tt-(z.sp2||-9)<.12;if(demo(z))fl=(tt%2)<.12;sh(c,q,12,4.6);
  const AR=fl?'#e8edf0':'#4a525c',ARL=fl?'#fff':'#6a737c';
  /* piernas con rodilleras */
  lim2(c,X(-4),Y(-16),X(-5+sw),Y(-9),X(-4+sw),Y(-1.5),5.6,'#2a2e36');lim2(c,X(4),Y(-16),X(5-sw),Y(-9),X(4-sw),Y(-1.5),5.6,'#363a44');
  if(pl){blob(c,X(-5+sw),Y(-9),2.6,2.4,ARL);blob(c,X(5-sw),Y(-9),2.6,2.4,ARL)}blob(c,X(-3+sw),Y(-1.6),3.6,1.8,'#14181c');blob(c,X(5-sw),Y(-1.6),3.6,1.8,'#1a1e22');
  /* chaleco antidisturbios con placas, o el cuerpo herido si se lo han roto */
  if(pl){poly(c,[X(-9),Y(-16),X(9),Y(-16),X(10),Y(-37),X(-10),Y(-37)],AR,1.6);fpoly(c,[X(-9),Y(-16),X(-3),Y(-16),X(-3),Y(-37),X(-10),Y(-37)],'rgba(0,0,0,.22)');
   c.strokeStyle='rgba(10,14,18,.6)';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-8),Y(-22-i*5));c.lineTo(X(8),Y(-22-i*5));c.stroke()}
   fpoly(c,[X(2),Y(-36),X(8),Y(-36),X(8),Y(-31),X(2),Y(-31)],'rgba(255,255,255,.14)');poly(c,[X(-4),Y(-33),X(4),Y(-33),X(4),Y(-29),X(-4),Y(-29)],'#c9b23a',1);
   for(const s of[-1,1])poly(c,[X(s*9),Y(-38),X(s*13),Y(-36),X(s*12),Y(-31),X(s*8),Y(-32)],ARL,1.3);
   [[3,-25],[-5,-20]].forEach(([x,y])=>{c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.8;c.beginPath();c.moveTo(X(x),Y(y));c.lineTo(X(x+2),Y(y+2));c.stroke()})}
  else{blob(c,X(0),Y(-27),9,12,'#6b7a58');poly(c,[X(-9),Y(-30),X(-3),Y(-37),X(-2),Y(-24)],'#3a3e46',1.2);wound(c,X(3),Y(-27),2.6);wound(c,X(-3),Y(-20),1.8);rag(c,X(-8),X(8),Y(-17),'#2a2e36',4)}
  lim2(c,X(-9),Y(-34),X(-11),Y(-27),X(-11),Y(-20),4.4,SKD);lim2(c,X(9),Y(-34),X(12),Y(-28),X(12),Y(-23),4.4,SK);
  if(pl){blob(c,X(-11),Y(-20),2.6,2.4,'#1a1e22');blob(c,X(12),Y(-23),2.6,2.4,'#1a1e22')}
  /* escudo con arañazos */
  if(full){c.fillStyle='rgba(120,150,175,.82)';c.strokeStyle=OL;c.lineWidth=1.6;c.beginPath();c.roundRect?c.roundRect(X(7)-5,Y(-38),11,24,3):c.rect(X(7)-5,Y(-38),11,24);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(X(7)-3,Y(-36),3,18);
   c.strokeStyle='rgba(40,50,60,.55)';c.lineWidth=.8;c.beginPath();c.moveTo(X(4),Y(-30));c.lineTo(X(9),Y(-26));c.moveTo(X(5),Y(-22));c.lineTo(X(10),Y(-20));c.moveTo(X(8),Y(-35));c.lineTo(X(6),Y(-31));c.stroke();c.fillStyle='#222';c.fillRect(X(7)-3,Y(-31),6,2)}
  face(c,X(0),Y(-43),6,f,SK,'#e8e07a',.4);
  if(pl){blob(c,X(0),Y(-45),6.8,5.6,fl?'#e8edf0':'#3e464e');c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(X(2),Y(-48),3,1.6,0,0,7);c.fill();
   c.fillStyle='rgba(140,170,190,.55)';c.strokeStyle=OL;c.lineWidth=1;c.beginPath();c.moveTo(X(-3),Y(-45));c.lineTo(X(7),Y(-45));c.lineTo(X(6.5),Y(-39));c.lineTo(X(-2),Y(-39));c.closePath();c.fill();c.stroke();
   c.fillStyle='rgba(232,224,122,.85)';c.fillRect(X(3)-1,Y(-43),2,1.4);c.fillRect(X(.5)-1,Y(-43),2,1.4);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(X(4),Y(-44.5),1.2,4)}},
v(c,z,q,f,tt){const X=v=>q[0]+v*f,Y=v=>q[1]+v,p=tt*4+ph(z);sh(c,q,13,3.6);
  /* rastro de sangre y tripas */
  c.strokeStyle='rgba(90,20,16,.6)';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(X(-6),Y(-2));c.lineTo(X(-26),Y(-1.5));c.stroke();c.strokeStyle='rgba(90,20,16,.35)';c.lineWidth=2;c.beginPath();c.moveTo(X(-14),Y(-3));c.lineTo(X(-30),Y(-3.4));c.stroke();
  c.strokeStyle='#8a3a30';c.lineWidth=2;c.beginPath();c.moveTo(X(-8),Y(-5));c.quadraticCurveTo(X(-14),Y(-1),X(-17),Y(-3)+Math.sin(p)*.6);c.stroke();
  /* medio cuerpo: camisa rota y columna asomando */
  blob(c,X(0),Y(-8),10.5,5.4,'#6a7a5a');fpoly(c,[X(-10),Y(-8),X(10),Y(-8),X(8),Y(-4),X(-8),Y(-4)],'rgba(0,0,0,.2)');
  poly(c,[X(-9),Y(-11),X(4),Y(-13),X(6),Y(-5),X(-9),Y(-4)],'#5a6070',1.2);rag(c,X(-9),X(-2),Y(-4),'#5a6070',2);
  blob(c,X(-9.5),Y(-6),3.2,2.6,'#7a2a22');for(let i=0;i<3;i++)dot(c,X(-11-i*1.8),Y(-6.5+i*.2),.9,'#e0d6bc');
  const a=Math.sin(p);lim2(c,X(4),Y(-9),X(9+a*2),Y(-11),X(13+a*5),Y(-2),3.6,SK,SKH);claws(c,X(13+a*5),Y(-2),f,3.5,'#d9d2b8',1);
  lim2(c,X(2),Y(-7),X(7-a*2),Y(-8),X(11-a*5),Y(-1),3.6,SKD);
  face(c,X(10),Y(-12),5,f,SK,'#e8e07a',.7);c.strokeStyle='#3a3a30';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(8+i*1.5),Y(-16.5));c.lineTo(X(6+i),Y(-13+i));c.stroke()}}};
const BH=t=>ZN[t]?ZN[t].bh:46;
window.ZX={_dr:(c,z,q,f,tt)=>DR[z.t](c,z,q,f,tt),has:t=>SP.has(t),bh:t=>BH(t),comp:COMP,mix:MIX,
 dh(c,z){const q=P(z.x,z.y),f=z.dx<0?-1:1;c.save();try{DR[z.t](c,z,q,f,z.el!=null?z.el:T)}finally{c.restore()}}};
})();
/* ---------- misiones de exploración (mapa cenital) ---------- */
(function(){
const hyp=Math.hypot,ZX=window.ZX;
const recon=(z,fn)=>{if(z.lhp===undefined)z.lhp=z.hp;const d=z.lhp-z.hp;if(d>0){const r=fn(d);if(r>0)z.hp=Math.min(z.mhp,z.hp+d*r)}z.lhp=z.hp};
ZX.mq=function(z,dt,al,M,X){const t=z.t;if(!ZX.has(t))return false;const tg=X.tg,bd=X.bd;
 if(t==='a'){if(z.pl===undefined){z.pl0=z.mhp*.7;z.pl=z.pl0}recon(z,d=>{if(z.pl>0){const r=d>=22?.3:.65;z.pl=Math.max(0,z.pl-d*r*.9);z.sp2=M.t;return r}return 0})}
 if(t==='v')recon(z,d=>d<10?.3:0);
 z.spm=(z.boost>M.t)?1.35:1;
 if(t==='g'){z.sc=(z.sc||0)-dt;if(z.sc<=0){z.sc=9;z.scr=M.t;M.en.forEach(o=>{if(o!==z){o.boost=M.t+5;o.st=1}});X.addFl(M,z.x,z.y,'¡AAAAH!','#ffd877');M.shake=.5}
  if(M.t-(z.scr||-9)<.9)return true}
 if(t==='j'){z.jc=(z.jc||0)-dt;if(z.chg>0){z.chg-=dt;z.spm*=2.3}else if(bd>3&&z.jc<=0){z.chg=1.1;z.jc=7+Math.random()*2}}
 if(t==='u'&&bd<1.2){z.sl=(z.sl||0)-dt;if(z.sl<=0){z.sl=2.4;z.slam=M.t;al.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<2.3)u.p.hp-=12});M.shake=.3;X.addFl(M,z.x,z.y,'¡CRASH!','#ffb060')}}
 if(t==='t'){if(bd<1.05)return false;const s=ZT.t.sp*1.45*dt*z.spm*(X.solid(M,Math.floor(z.x),Math.floor(z.y))?.5:1),d=bd||1,nx=z.x+(tg.x-z.x)/d*s,ny=z.y+(tg.y-z.y)/d*s;
  z.fa=Math.atan2(tg.y-z.y,tg.x-z.x);if(nx>1&&nx<X.COLS-1&&ny>1&&ny<X.ROWS-1){z.x=nx;z.y=ny}z.cl=X.solid(M,Math.floor(z.x),Math.floor(z.y))?1:0;return true}
 if(t==='h'){
  if(z.pinT){const u=z.pinT;if(!u||u.p.hp<=0||u.pin<=0||z.hp<=0){if(u)u.pin=0;z.pinT=null}else{z.x=u.x+.3;z.y=u.y;u.p.hp-=ZT.h.d*.7*dt;return true}}
  if(z.leap){const L=z.leap;L.t-=dt;const k=Math.min(1,dt/Math.max(.001,L.t+dt));z.x+=(L.tx-z.x)*k;z.y+=(L.ty-z.y)*k;z.fa=Math.atan2(L.ty-z.y,L.tx-z.x);z.lz=Math.sin(Math.PI*Math.max(0,Math.min(1,1-L.t/L.d)));
   if(L.t<=0){z.leap=null;z.lz=0;if(tg&&tg.p&&tg.p.hp>0&&hyp(tg.x-z.x,tg.y-z.y)<1.4&&!tg.ally){tg.p.hp-=ZT.h.d*2.2;tg.pin=3;tg.pinBy=z;z.pinT=tg;X.addFl(M,tg.x,tg.y,'¡Sujeto!','#ff7b6b')}}return true}
  z.lc=(z.lc||0)-dt;if(tg&&z.lc<=0&&bd>1.8&&bd<5.5&&X.los(z.x,z.y,tg.x,tg.y)){z.leap={tx:tg.x,ty:tg.y,t:.4,d:.4};z.lc=6+Math.random()*2;return true}}
 return false};
ZX.mk=function(z,M){if(z.t==='j'){const hp=Math.round(ZT.z.hp*.6);M.en.push({t:'z',x:z.x,y:z.y,hp,mhp:hp,st:1,path:[],pt:0,dm:z.dm||1,cd:1})}};
const R=(cx,x,y,rx,ry,col,rot)=>{cx.fillStyle=col;cx.strokeStyle='#14100a';cx.lineWidth=1.3;cx.beginPath();cx.ellipse(x,y,rx,ry,rot||0,0,7);cx.fill();cx.stroke()};
ZX.dm=function(cx,z,ts,t,M){const x=z.x*ts,y=z.y*ts,r=.4*ts*.82,a=z.fa||0,ca=Math.cos(a),sa=Math.sin(a),k=z.t;cx.save();
 if(k==='u'){R(cx,x,y,r*1.45,r*1.45,'#86a064');[-1,1].forEach(s=>R(cx,x+ca*r*1.3-sa*s*r*1.2,y+sa*r*1.3+ca*s*r*1.2,r*.62,r*.62,'#9bb27a'));R(cx,x+ca*r*.4,y+sa*r*.4,r*.55,r*.55,'#7a9058')}
 else if(k==='j'){cx.translate(x,y);cx.rotate(a);R(cx,0,0,r*2.1,r*.9,'#7a5a3a');R(cx,r*1.9,0,r*.75,r*.5,'#6a4a2a');cx.strokeStyle='#2a2018';cx.lineWidth=2;for(let i=0;i<4;i++){const o=Math.sin(t*(z.chg>0?16:10)+i*1.6)*r*.5;cx.beginPath();cx.moveTo(i<2?-r*1.3+o:r*1.1+o,-r*.9);cx.lineTo(i<2?-r*1.3+o:r*1.1+o,-r*.9-3);cx.moveTo(i<2?-r*1.3-o:r*1.1-o,r*.9);cx.lineTo(i<2?-r*1.3-o:r*1.1-o,r*.9+3);cx.stroke()}R(cx,-r*.1,0,r*.72,r*.72,'#6a8a50')}
 else if(k==='t'){const cl=z.cl;if(cl){cx.globalAlpha=.6;cx.fillStyle='rgba(139,200,120,.25)';cx.beginPath();cx.arc(x,y,r*2,0,7);cx.fill()}cx.strokeStyle='#14100a';cx.lineWidth=2.4;for(let i=0;i<4;i++){const an=a+(i<2?1:-1)*(.7+(i%2)*.8)+Math.sin(t*11+i)*.2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+Math.cos(an)*r*1.5,y+Math.sin(an)*r*1.5);cx.stroke()}R(cx,x,y,r*.8,r*.8,'#7f9c62');cx.globalAlpha=1}
 else if(k==='q'){R(cx,x,y,r*.95,r*.95,'#8a5a32');const pu=.5+.5*Math.sin(t*5);cx.fillStyle='rgba(190,230,70,'+(.3+.2*pu)+')';cx.beginPath();cx.arc(x+ca*r*.7,y+sa*r*.7,r*(.9+.3*pu),0,7);cx.fill();R(cx,x+ca*r*.7,y+sa*r*.7,r*.55,r*.55,'#c4de52')}
 else if(k==='h'){if(z.lz>0){cx.strokeStyle='rgba(255,255,255,.35)';cx.lineWidth=3;cx.beginPath();cx.moveTo(x-ca*r*3,y-sa*r*3);cx.lineTo(x,y);cx.stroke()}R(cx,x,y,r*(1+(z.lz||0)*.3),r*(1+(z.lz||0)*.3),'#3c4238');cx.fillStyle='#ffd83a';[-1,1].forEach(s=>{cx.beginPath();cx.arc(x+ca*r*.6-sa*s*r*.35,y+sa*r*.6+ca*s*r*.35,r*.16,0,7);cx.fill()})}
 else if(k==='g'){const age=t-(z.scr||-9);R(cx,x,y,r,r,'#cfd2b4');R(cx,x+ca*r*.45,y+sa*r*.45,r*.4,r*.5,'#2a0c0c',a);if(age<.9){for(let i=0;i<3;i++){const q=age*1.1+i*.28;cx.strokeStyle='rgba(255,255,255,'+Math.max(0,.55-q*.6)+')';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,r+q*ts*3,0,7);cx.stroke()}}}
 else if(k==='a'){R(cx,x,y,r*1.1,r*1.1,'#6b7a58');if(z.pl>0){cx.strokeStyle=(t-(z.sp2||-9)<.12)?'#fff':'#9fb0bd';cx.lineWidth=ts*.14;cx.beginPath();cx.arc(x,y,r*1.2,a-1,a+1);cx.stroke();R(cx,x,y,r*.7,r*.7,'#6a737c')}}
 else if(k==='v'){cx.strokeStyle='rgba(90,20,16,.6)';cx.lineWidth=ts*.14;cx.lineCap='round';cx.beginPath();cx.moveTo(x,y);cx.lineTo(x-ca*r*2.4,y-sa*r*2.4);cx.stroke();R(cx,x,y,r*.95,r*.7,'#6a7a5a',a);R(cx,x+ca*r*.8,y+sa*r*.8,r*.45,r*.45,'#8fae72')}
 cx.restore()};
})();
