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
const DR={
u(c,z,q,f,tt){const p=tt*5+ph(z),sw=Math.sin(p)*4,att=z.at,sl=Math.max(0,1-(tt-(z.slam||-9))*3);sh(c,q,18,6.5);
  lim(c,q[0]-6,q[1]-17,q[0]-6+sw,q[1]-1,8,'#5a5648');lim(c,q[0]+6,q[1]-17,q[0]+6-sw,q[1]-1,8,'#4a4638');
  c.fillStyle=SKD;c.strokeStyle=OL;c.lineWidth=1.6;c.beginPath();c.moveTo(q[0]-16,q[1]-42);c.lineTo(q[0]+16,q[1]-42);c.lineTo(q[0]+10,q[1]-16);c.lineTo(q[0]-10,q[1]-16);c.closePath();c.fill();c.stroke();
  c.strokeStyle='rgba(120,70,150,.55)';c.lineWidth=1.2;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(q[0]+i*5,q[1]-40);c.quadraticCurveTo(q[0]+i*5+3,q[1]-30,q[0]+i*4,q[1]-20);c.stroke()}
  c.fillStyle='#4a4638';c.fillRect(q[0]-10,q[1]-20,20,8);
  const rz=att?Math.sin(tt*6)*.5+.5:0;
  [[-1,0],[1,1]].forEach(([s])=>{const sx=q[0]+s*16,sy=q[1]-40,fx=sx+s*5+f*3,fy=att?sy-14*rz+(1-rz)*30:sy+20+Math.sin(p+s)*2;lim(c,sx,sy,fx,fy,9,SK);blob(c,fx,fy,6.5,6,SK)});
  head(c,q[0]+f*2,q[1]-47,6.5,SK,'#e8e07a');
  if(sl>0){c.strokeStyle='rgba(200,180,140,'+sl*.6+')';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1],(1-sl)*50+8,(1-sl)*24+4,0,0,7);c.stroke()}},
j(c,z,q,f,tt){const ch=z.chg>0,p=tt*(ch?16:10)+ph(z);sh(c,q,24,7);
  const X=v=>q[0]+v*f,Y=v=>q[1]+v;
  /* patas del caballo */
  [[-11,0],[-8,Math.PI],[10,Math.PI*.5],[13,Math.PI*1.5]].forEach(([hx,o],i)=>{const a=Math.sin(p+o),l=Math.max(0,Math.cos(p+o));lim(c,X(hx),Y(-17),X(hx+a*7),Y(-3-l*4),4.5,i%2?'#5a3e22':'#6a4a2a');blob(c,X(hx+a*7),Y(-2.5-l*4),2.4,1.6,'#2a2018')});
  /* cola */
  c.strokeStyle='#2a2018';c.lineWidth=3;c.beginPath();c.moveTo(X(-17),Y(-26));c.quadraticCurveTo(X(-25),Y(-24+Math.sin(p)*3),X(-23),Y(-12));c.stroke();
  blob(c,X(0),Y(-24),18,8.5,'#7a5a3a');blob(c,X(-6),Y(-26),4,3,'#5a6a4a');blob(c,X(7),Y(-22),3,2.4,'#5a6a4a');
  c.strokeStyle='rgba(40,25,12,.6)';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(X(-5+i*5),Y(-29));c.quadraticCurveTo(X(-3+i*5),Y(-24),X(-5+i*5),Y(-19));c.stroke()}
  lim(c,X(13),Y(-28),X(23),Y(-38+Math.sin(p)*1.5),7,'#7a5a3a');blob(c,X(27),Y(-38+Math.sin(p)*1.5),6.5,3.6,'#6a4a2a',-.35*f);
  c.fillStyle='#d9d2b8';c.fillRect(X(29)-1,Y(-39),2,1.6);c.strokeStyle='#2a2018';c.lineWidth=3;c.beginPath();c.moveTo(X(15),Y(-32));c.lineTo(X(20),Y(-43));c.stroke();
  /* jinete */
  const lean=ch?7:3;lim(c,X(0),Y(-30),X(lean),Y(-46),8,'#586a46');lim(c,X(-1),Y(-29),X(5),Y(-17),5,'#4a4a52');
  const ar=Math.sin(p*.5);lim(c,X(lean),Y(-44),X(lean+13),Y(-44+ar*3),4,SK);lim(c,X(lean),Y(-42),X(lean+11),Y(-39-ar*3),4,SKD);
  head(c,X(lean+4),Y(-53),5.6,SK,'#e8e07a');
  if(ch&&Math.random()<.3)burst(z.x,z.y,1,'#a89870',1,3)},
t(c,z,q,f,tt){const p=tt*11+ph(z),cl_=z.cl;sh(c,q,cl_?7:11,cl_?3:4.5);
  if(cl_){const y0=q[1]-12,s1=Math.sin(p)*3;lim(c,q[0]-3,y0-10,q[0]-9,y0-24+s1,4,SK);lim(c,q[0]+3,y0-10,q[0]+9,y0-24-s1,4,SK);
   lim(c,q[0]-3,y0+2,q[0]-8,y0+10-s1,4.5,SKD);lim(c,q[0]+3,y0+2,q[0]+8,y0+10+s1,4.5,SKD);
   blob(c,q[0],y0-6,5,9,'#7f9c62');c.fillStyle='#3a3a44';c.fillRect(q[0]-5,y0-3,10,6);head(c,q[0],y0-20,5,SK,'#e8e07a');
   c.strokeStyle='#d9d2b8';c.lineWidth=1.2;[[-9,-24+s1],[9,-24-s1]].forEach(([dx,dy])=>{c.beginPath();c.moveTo(q[0]+dx,y0+dy);c.lineTo(q[0]+dx+(dx<0?-2:2),y0+dy-3);c.stroke()});return}
  const sw=Math.sin(p)*5;lim(c,q[0]-3*f,q[1]-14,q[0]-3*f-sw*f,q[1]-1,4.5,SKD);lim(c,q[0]+1*f,q[1]-14,q[0]+1*f+sw*f,q[1]-1,4.5,SKD);
  lim(c,q[0]-3*f,q[1]-16,q[0]+5*f,q[1]-28,8,'#7f9c62');c.fillStyle='#3a3a44';c.fillRect(q[0]-1*f-4,q[1]-22,8,6);
  const aw=Math.sin(p+1.5)*3;lim(c,q[0]+4*f,q[1]-26,q[0]+15*f,q[1]-19+aw,4,SK);lim(c,q[0]+3*f,q[1]-25,q[0]+13*f,q[1]-14-aw,4,SKD);
  c.strokeStyle='#d9d2b8';c.lineWidth=1.3;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(q[0]+15*f,q[1]-19+aw);c.lineTo(q[0]+19*f,q[1]-19+aw+i*2.4);c.stroke()}
  head(c,q[0]+10*f,q[1]-30,5.2,SK,'#e8e07a',1)},
q(c,z,q,f,tt){const p=tt*6+ph(z),sw=Math.sin(p)*3.5,sp=Math.max(0,1-(tt-(z.spit||-9))*3.2);sh(c,q,10,4);
  lim(c,q[0]-3,q[1]-15,q[0]-3+sw,q[1]-1,5,'#5a4a32');lim(c,q[0]+3,q[1]-15,q[0]+3-sw,q[1]-1,5,'#4a3a28');
  blob(c,q[0],q[1]-26,8.5,12,'#8a5a32');blob(c,q[0],q[1]-26,6,10,'#9bb83a');
  const aw=Math.sin(p)*2;lim(c,q[0]-8,q[1]-33,q[0]-10,q[1]-20+aw,4,SK);lim(c,q[0]+8,q[1]-33,q[0]+10+f*2,q[1]-22-aw,4,SK);
  const back=z.at?sp*3:0;
  /* saco de ácido en la garganta */
  const pu=.5+.5*Math.sin(tt*5+ph(z));c.fillStyle='rgba(190,230,70,'+(.25+.2*pu)+')';c.beginPath();c.arc(q[0]+f*2,q[1]-36,9+pu*2,0,7);c.fill();
  blob(c,q[0]+f*2,q[1]-34,5.4+pu*.8,6.4+pu,'#c4de52');
  head(c,q[0]+f*3,q[1]-44-back,5.6,'#a3bd7a','#c9f03a',1);
  c.strokeStyle='#9bd03a';c.lineWidth=1.6;c.beginPath();c.moveTo(q[0]+f*3,q[1]-38-back);c.lineTo(q[0]+f*3+f,q[1]-30+Math.sin(tt*8)*2);c.stroke();
  if(sp>0){c.fillStyle='rgba(190,240,70,'+sp+')';c.beginPath();c.arc(q[0]+f*(8+(1-sp)*14),q[1]-40-back,3.2,0,7);c.fill()}},
h(c,z,q,f,tt){const p=tt*12+ph(z),lz=z.lz||0;sh(c,q,lz?7:11,lz?2.6:4.2);
  if(lz>0){const L=lz*26,ys=q[1]-26-L;lim(c,q[0]-10*f,ys+2,q[0]-3*f,ys-2,6,'#3c4238');lim(c,q[0]-3*f,ys-2,q[0]+8*f,ys-8,9,'#2f342c');
   lim(c,q[0]+6*f,ys-7,q[0]+19*f,ys-9,4,SK);lim(c,q[0]+5*f,ys-5,q[0]+18*f,ys-3,4,SKD);lim(c,q[0]-14*f,ys+6,q[0]-3*f,ys,5,SKD);
   blob(c,q[0]+11*f,ys-10,5.6,5.8,'#222620');c.fillStyle='#ffd83a';c.fillRect(q[0]+11*f,ys-12,2.4,2);c.fillRect(q[0]+8*f,ys-12,2.4,2);
   c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(q[0]-20*f,ys+4);c.lineTo(q[0]-8*f,ys);c.stroke();return}
  const sw=Math.sin(p)*5,cr=z.pinT?4:0;
  lim(c,q[0]-3*f,q[1]-13,q[0]-3*f-sw*f,q[1]-1,5,'#3a3f34');lim(c,q[0]+2*f,q[1]-13,q[0]+2*f+sw*f,q[1]-1,5,'#2f342c');
  lim(c,q[0]-2*f,q[1]-14+cr,q[0]+6*f,q[1]-27+cr,9,'#3c4238');
  const aw=Math.sin(p+2)*3;lim(c,q[0]+5*f,q[1]-25+cr,q[0]+17*f,q[1]-17+aw+cr,4,SK);lim(c,q[0]+4*f,q[1]-24+cr,q[0]+15*f,q[1]-12-aw+cr,4,SKD);
  c.strokeStyle='#d9d2b8';c.lineWidth=1.3;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(q[0]+17*f,q[1]-17+aw+cr);c.lineTo(q[0]+22*f,q[1]-17+aw+cr+i*2.4);c.stroke()}
  blob(c,q[0]+9*f,q[1]-31+cr,6.2,6.4,'#262a22');c.fillStyle='rgba(255,216,58,.35)';c.beginPath();c.arc(q[0]+11*f,q[1]-31+cr,4,0,7);c.fill();c.fillStyle='#ffd83a';c.fillRect(q[0]+9*f,q[1]-33+cr,2.4,2);c.fillRect(q[0]+12*f,q[1]-33+cr,2.4,2)},
g(c,z,q,f,tt){const p=tt*7+ph(z),sw=Math.sin(p)*3.5,age=tt-(z.scr||-9),sc=age<.9;sh(c,q,9,3.8);
  lim(c,q[0]-3,q[1]-15,q[0]-3+sw,q[1]-1,4.5,'#4a4a52');lim(c,q[0]+3,q[1]-15,q[0]+3-sw,q[1]-1,4.5,'#3a3a42');
  blob(c,q[0],q[1]-26,7,11,'#b8b49a');c.fillStyle='#8a8a76';c.fillRect(q[0]-4,q[1]-28,8,2);
  lim(c,q[0]-7,q[1]-32,q[0]-9,q[1]-20+(sc?-14:0),4,SK);lim(c,q[0]+7,q[1]-32,q[0]+9,q[1]-20+(sc?-14:0),4,SK);
  const hy=sc?q[1]-42:q[1]-40;head(c,q[0],hy,6.4,'#cfd2b4','#e8e07a',1);
  if(sc){c.fillStyle='#2a0c0c';c.beginPath();c.ellipse(q[0],hy+3.4,3.2,5.4,0,0,7);c.fill();
   for(let i=0;i<3;i++){const a=age*1.1+i*.28;c.strokeStyle='rgba(255,255,255,'+Math.max(0,.55-a*.6)+')';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1]-26,10+a*70,5+a*34,0,0,7);c.stroke()}}},
a(c,z,q,f,tt){const p=tt*5+ph(z),sw=Math.sin(p)*4,pl=z.pl>0,full=z.pl>(z.pl0||1)*.45,fl=tt-(z.sp2||-9)<.12;sh(c,q,12,4.6);
  lim(c,q[0]-4,q[1]-16,q[0]-4+sw,q[1]-1,6,'#4a4a52');lim(c,q[0]+4,q[1]-16,q[0]+4-sw,q[1]-1,6,'#3a3a42');
  blob(c,q[0],q[1]-27,9,12,pl?(fl?'#e8edf0':'#7a8590'):'#6b7a58');
  if(pl){c.strokeStyle='rgba(20,24,28,.6)';c.lineWidth=1;c.beginPath();c.moveTo(q[0]-7,q[1]-28);c.lineTo(q[0]+7,q[1]-28);c.moveTo(q[0],q[1]-37);c.lineTo(q[0],q[1]-17);c.stroke()}
  lim(c,q[0]-9,q[1]-34,q[0]-11,q[1]-20,5,SK);lim(c,q[0]+9,q[1]-34,q[0]+12*f,q[1]-23,5,SK);
  if(full){c.fillStyle='rgba(120,150,175,.82)';c.strokeStyle=OL;c.lineWidth=1.6;c.beginPath();c.roundRect?c.roundRect(q[0]+f*7-5,q[1]-38,11,24,3):c.rect(q[0]+f*7-5,q[1]-38,11,24);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(q[0]+f*7-3,q[1]-36,3,18)}
  head(c,q[0],q[1]-43,6,SK,'#e8e07a');
  if(pl){blob(c,q[0],q[1]-45,6.6,5.4,fl?'#e8edf0':'#6a737c');c.fillStyle='#14181c';c.fillRect(q[0]-5,q[1]-43,10,3);c.fillStyle='rgba(232,224,122,.8)';c.fillRect(q[0]-3,q[1]-42.4,2,1.4);c.fillRect(q[0]+1.4,q[1]-42.4,2,1.4)}},
v(c,z,q,f,tt){const p=tt*4+ph(z);sh(c,q,13,3.6);
  c.strokeStyle='rgba(90,20,16,.6)';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(q[0]-6*f,q[1]-2);c.lineTo(q[0]-26*f,q[1]-1.5);c.stroke();
  blob(c,q[0],q[1]-8,10,5.2,'#6a7a5a');blob(c,q[0]-9*f,q[1]-6,3.2,2.6,'#7a2a22');
  const a=Math.sin(p);lim(c,q[0]+5*f,q[1]-8,q[0]+13*f+a*5*f,q[1]-2,4,SK);lim(c,q[0]+3*f,q[1]-6,q[0]+11*f-a*5*f,q[1]-1,4,SKD);
  head(c,q[0]+10*f,q[1]-11,5,SK,'#e8e07a',1)}};
const BH=t=>ZN[t]?ZN[t].bh:46;
window.ZX={_dr:(c,z,q,f,tt)=>DR[z.t](c,z,q,f,tt),has:t=>SP.has(t),bh:t=>BH(t),comp:COMP,mix:MIX,
 dh(c,z){const q=P(z.x,z.y),f=z.dx<0?-1:1;c.save();try{DR[z.t](c,z,q,f,T)}finally{c.restore()}}};
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
