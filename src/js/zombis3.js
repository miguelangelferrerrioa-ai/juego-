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
 x:{n:'Zombi excavador',hp:110,sp:.7,d:10,c:'#7a6a4a',bh:44},
 w:{n:'Zombi ariete',hp:620,sp:.33,d:5,c:'#6a705e',big:1,bh:60},
 i:{n:'Zombi incendiario',hp:85,sp:.78,d:8,c:'#a0583a',bh:46},
 l:{n:'Zombi alfa',hp:320,sp:.72,d:15,c:'#6a8a52',big:1,bh:58}};
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
const OL='#14100a',sh=(c,q,rx,ry)=>{c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(q[0],q[1],rx,ry,0,0,7);c.fill()};
const lim=(c,x1,y1,x2,y2,w,col)=>{c.lineCap='round';c.strokeStyle=OL;c.lineWidth=w+2;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
const blob=(c,x,y,rx,ry,col,rot)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=1.4;c.beginPath();c.ellipse(x,y,rx,ry,rot||0,0,7);c.fill();c.stroke()};
const head=(c,x,y,r,skin,eye)=>{blob(c,x,y,r,r*1.05,skin);c.fillStyle=eye||'#e8e07a';c.fillRect(x-r*.55,y-r*.25,r*.4,r*.28);c.fillRect(x+r*.2,y-r*.25,r*.4,r*.28)};
const SK='#8fae72',SKD='#6f8c58',ph=z=>z.x*3+z.y*2.1;
const DR={
x(c,z,q,f,tt){const p=tt*9+ph(z);
  if(z.bur){/* bajo tierra: montículo de tierra que avanza */sh(c,q,11,4);blob(c,q[0],q[1]-3,10,5,'#6a5034');blob(c,q[0]-4,q[1]-5,4,2.6,'#7f6240');c.fillStyle='#4a3824';for(let i=0;i<4;i++){const a=p*.7+i*1.7;c.fillRect(q[0]+Math.cos(a)*9,q[1]-6+Math.sin(a*1.3)*3,2,2)}return}
  const w=Math.sin(p)*3.5;sh(c,q,10,4);lim(c,q[0]-3,q[1]-14,q[0]-3+w,q[1]-1,4,'#5a4a34');lim(c,q[0]+3,q[1]-14,q[0]+3-w,q[1]-1,4,'#4a3c2a');
  blob(c,q[0]+f*2,q[1]-20,8,8,'#7a6a4a');c.fillStyle='rgba(90,64,36,.7)';c.fillRect(q[0]-6+f*2,q[1]-22,12,3);
  const dg=Math.sin(tt*10)*4;[[-1],[1]].forEach(([s])=>{const sx=q[0]+s*6,sy=q[1]-22,fx=sx+f*9,fy=sy+8+(z.at?dg:Math.sin(p+s)*2);lim(c,sx,sy,fx,fy,3.5,SKD);c.strokeStyle='#d9d2b8';c.lineWidth=1.2;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+f*4,fy+k*2.2);c.stroke()}});
  head(c,q[0]+f*6,q[1]-28,5.2,SK,'#e8e07a');c.fillStyle='#3a3a30';c.beginPath();c.arc(q[0]+f*6,q[1]-31,5.4,Math.PI,0);c.fill();c.fillStyle='#ffe08a';c.beginPath();c.arc(q[0]+f*9,q[1]-32,1.6,0,7);c.fill();
  if(T-(z.emg||-9)<.6){c.fillStyle='rgba(106,80,52,'+(1-(T-z.emg)/.6)+')';c.beginPath();c.ellipse(q[0],q[1],14,6,0,0,7);c.fill()}},
w(c,z,q,f,tt){const p=tt*3.5+ph(z),w=Math.sin(p)*3,hit=Math.max(0,1-(tt-(z.hit||-9))*3);sh(c,q,20,7);
  lim(c,q[0]-7,q[1]-18,q[0]-7+w,q[1]-1,9,'#4e5446');lim(c,q[0]+7,q[1]-18,q[0]+7-w,q[1]-1,9,'#424838');
  c.fillStyle='#6a705e';c.strokeStyle=OL;c.lineWidth=1.6;c.beginPath();c.moveTo(q[0]-17,q[1]-46);c.lineTo(q[0]+17,q[1]-46);c.lineTo(q[0]+12,q[1]-17);c.lineTo(q[0]-12,q[1]-17);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(30,30,24,.35)';c.fillRect(q[0]-12,q[1]-30,24,4);
  /* viga de hierro en las manos */const bx=q[0]+f*(14+hit*8),by=q[1]-34;c.save();c.translate(bx,by);c.rotate(f*.08);c.fillStyle='#7a6a5a';c.strokeStyle=OL;c.lineWidth=1.6;c.fillRect(f>0?-6:-26,-5,32,10);c.strokeRect(f>0?-6:-26,-5,32,10);c.fillStyle='#4a4038';for(let i=0;i<4;i++)c.fillRect((f>0?-4:-24)+i*8,-2,2,2);c.restore();
  lim(c,q[0]-12,q[1]-42,bx-f*4,by+2,8,SKD);lim(c,q[0]+12,q[1]-42,bx+f*6,by-2,8,SK);
  head(c,q[0]+f*3,q[1]-52,7,SK,'#f0a040');c.fillStyle='#5a5a50';c.fillRect(q[0]+f*3-8,q[1]-58,16,4)},
i(c,z,q,f,tt){const p=tt*9+ph(z),w=Math.sin(p)*3;sh(c,q,10,4);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(q[0],q[1]-22,0,q[0],q[1]-22,26);g.addColorStop(0,'rgba(255,130,40,.45)');g.addColorStop(1,'rgba(255,90,20,0)');c.fillStyle=g;c.fillRect(q[0]-26,q[1]-48,52,52);c.restore();
  lim(c,q[0]-3,q[1]-15,q[0]-3+w,q[1]-1,4,'#3a2a20');lim(c,q[0]+3,q[1]-15,q[0]+3-w,q[1]-1,4,'#2e221a');
  blob(c,q[0],q[1]-23,8,10,'#5a3a28');c.fillStyle='rgba(255,120,40,.8)';c.fillRect(q[0]-4,q[1]-27,3,6);c.fillRect(q[0]+2,q[1]-21,3,5);
  lim(c,q[0]-7,q[1]-29,q[0]-7+f*8,q[1]-20+Math.sin(p)*2,3.5,'#8a5a3a');lim(c,q[0]+7,q[1]-29,q[0]+7+f*9,q[1]-22-Math.sin(p)*2,3.5,'#7a4a2e');
  head(c,q[0]+f*2,q[1]-38,5.6,'#9a6a48','#ffd040');
  /* llamas: sobre la cabeza y en los hombros */for(const [dx,y0,h0,col] of [[-7,-30,7,'#ff7a2a'],[7,-30,6,'#ff9a30'],[f*2-3,-42,9,'#ff7a2a'],[f*2+3,-42,8,'#ff9a30'],[f*2,-43,13,'#ffc040']]){const h=h0*(.75+.35*Math.sin(tt*12+dx*2+ph(z))),s2=Math.sin(tt*8+dx)*1.6;c.fillStyle=col;c.beginPath();c.moveTo(q[0]+dx-2.6,q[1]+y0);c.quadraticCurveTo(q[0]+dx-2+s2*.5,q[1]+y0-h*.6,q[0]+dx+s2,q[1]+y0-h);c.quadraticCurveTo(q[0]+dx+2+s2*.5,q[1]+y0-h*.6,q[0]+dx+2.6,q[1]+y0);c.fill()}},
l(c,z,q,f,tt){const p=tt*7+ph(z),w=Math.sin(p)*4;
  c.strokeStyle='rgba(200,40,30,'+(.25+.15*Math.sin(tt*4))+')';c.lineWidth=1.6;c.beginPath();c.ellipse(q[0],q[1],3.5*32*.5,3.5*16*.5,0,0,7);c.stroke();sh(c,q,14,5);
  lim(c,q[0]-5,q[1]-20,q[0]-5+w,q[1]-1,6,'#3e4a34');lim(c,q[0]+5,q[1]-20,q[0]+5-w,q[1]-1,6,'#34402c');
  c.fillStyle=SKD;c.strokeStyle=OL;c.lineWidth=1.6;c.beginPath();c.moveTo(q[0]-13,q[1]-46);c.lineTo(q[0]+13,q[1]-46);c.lineTo(q[0]+8,q[1]-19);c.lineTo(q[0]-8,q[1]-19);c.closePath();c.fill();c.stroke();
  c.fillStyle='#d9d2b8';c.strokeStyle=OL;c.lineWidth=1;for(const s of[-1,1])for(let i=0;i<3;i++){const bx=q[0]+s*(9+i*3),by=q[1]-46+i*2;c.beginPath();c.moveTo(bx-2,by);c.lineTo(bx+s*2,by-7);c.lineTo(bx+2,by);c.closePath();c.fill();c.stroke()}
  c.strokeStyle='rgba(140,30,30,.7)';c.lineWidth=2;c.beginPath();c.moveTo(q[0]-6,q[1]-40);c.lineTo(q[0]+4,q[1]-28);c.stroke();
  const at=z.at?Math.sin(tt*9)*5:0;lim(c,q[0]-12,q[1]-42,q[0]-12+f*10,q[1]-28+at,5.5,SK);lim(c,q[0]+12,q[1]-42,q[0]+12+f*12,q[1]-32-at,5.5,SK);
  head(c,q[0]+f*2,q[1]-52,6.4,SK,'#ff3a2a');c.fillStyle='rgba(255,60,40,.35)';c.beginPath();c.arc(q[0]+f*2,q[1]-53,9,0,7);c.fill()}};
/* ZX: los nuevos usan el mismo camino de dibujo que los especiales */
const oHas=ZX.has,oDh=ZX.dh,oBh=ZX.bh,oDr=ZX._dr,oComp=ZX.comp;
ZX.has=t=>NS.has(t)||oHas(t);ZX.bh=t=>NS.has(t)?ZN[t].bh:oBh(t);
ZX.dh=function(c,z){if(!NS.has(z.t))return oDh.apply(this,arguments);const q=P(z.x,z.y),f=z.dx<0?-1:1;c.save();try{DR[z.t](c,z,q,f,T)}finally{c.restore()}};
ZX._dr=(c,z,q,f,tt)=>NS.has(z.t)?DR[z.t](c,z,q,f,tt):oDr(c,z,q,f,tt);
ZX.comp=function(comp,n,PG){oComp.apply(this,arguments);const add=(k,min,pg,v)=>{if(n>=min&&PG>=pg){const q=Math.round(v);if(q>0)comp[k]=Math.max(comp[k]||0,q)}};
 add('x',6,16,Math.min(5,n/4));add('w',7,18,Math.min(3,n/8));add('i',7,20,Math.min(6,n/4));add('l',8,22,Math.min(2,1+n/15))};
/* fuego en el suelo: se dibuja con los efectos */
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{if(FIRE.length){const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  FIRE.forEach(f=>{const q=P(f.x,f.y),a=Math.min(1,f.t/1.5);c.globalCompositeOperation='lighter';const g=c.createRadialGradient(q[0],q[1]-6,0,q[0],q[1]-6,40);g.addColorStop(0,'rgba(255,140,40,'+(.5*a)+')');g.addColorStop(1,'rgba(255,90,20,0)');c.fillStyle=g;c.beginPath();c.ellipse(q[0],q[1],40,22,0,0,7);c.fill();c.globalCompositeOperation='source-over';
   for(let k=0;k<6;k++){const ox=Math.cos(k*1.7)*14,oy=Math.sin(k*2.3)*7,h=(8+6*Math.sin(T*11+k*2))*a;c.fillStyle=k%2?'#ff8a30':'#ffc040';c.beginPath();c.moveTo(q[0]+ox-3,q[1]+oy);c.quadraticCurveTo(q[0]+ox,q[1]+oy-h*1.2,q[0]+ox+3,q[1]+oy);c.fill()}});c.restore()}}catch(e){}return r};try{render=window.render}catch(e){}}
})();
