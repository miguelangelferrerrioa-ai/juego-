/* ===== Variantes de bandidos: motos, coches, furgonetas (normales y blindadas), domador con zombis encadenados, francotirador y dinamitero.
   Los vehículos entran rápido, embisten el primer edificio o muro que encuentran y sueltan a sus pasajeros; luego el conductor dispara desde dentro.
   Los blindados aguantan la mitad del daño salvo con munición perforante. Salen según el capítulo (sg) y el gusto de cada banda. ===== */
(function(){
'use strict';
const VT={
 bmo:{n:'Bandido en moto',hp:80,sp:1.9,d:6,rng:3,c:'#5b3d2a',bh:46},
 bco:{n:'Coche de bandidos',hp:240,sp:1.7,d:6,c:'#8a3a2a',bh:40},
 bfu:{n:'Furgoneta de bandidos',hp:300,sp:1.25,d:6,c:'#b49a62',bh:50},
 bbl:{n:'Coche blindado',hp:330,sp:1.35,d:8,c:'#5a6250',bh:42},
 bfb:{n:'Furgoneta blindada',hp:420,sp:1,d:8,c:'#4e5648',bh:52},
 bfr:{n:'Francotirador',hp:60,sp:.8,d:18,rng:9,c:'#5b3d2a',bh:46},
 bdy:{n:'Dinamitero',hp:50,sp:1.25,d:4,c:'#5b3d2a',bh:46},
 bdo:{n:'Domador',hp:90,sp:.75,d:7,rng:3.5,c:'#5b3d2a',bh:46},
 bzc:{n:'Zombi encadenado',hp:110,sp:.9,d:11,c:'#79a05a',bh:46}};
Object.assign(ZT,VT);
/* forma de cada vehículo: largo y ancho (casillas), alto (px), pasajeros, embestida, blindaje */
const CAR={bco:{L:1.6,W:.85,pas:3,ram:60,col:'#8a3a2a',P:[[0,1,1,4,9,'b'],[-.08,.5,.86,9,15,'g']]},
 bfu:{L:2,W:.92,pas:6,ram:80,col:'#b49a62',van:1,P:[[-.14,.72,1,4,20,'b'],[.36,.28,1,4,11,'b'],[.34,.24,.98,11,17,'g']]},
 bbl:{L:1.75,W:.95,pas:4,ram:120,col:'#5a6250',arm:1,P:[[0,1,1,4,10,'b'],[-.1,.56,.88,10,17,'s']]},
 bfb:{L:2.1,W:1,pas:8,ram:150,col:'#4e5648',van:1,arm:1,P:[[-.12,.76,1,4,21,'b'],[.38,.24,1,4,12,'b'],[.37,.22,.98,12,18,'s']]}};
CAR.bco.H=15;CAR.bfu.H=20;CAR.bbl.H=17;CAR.bfb.H=21;
const MY=new Set(Object.keys(VT)),HUM=new Set(['bmo','bfr','bdy','bdo']),TM={cuervos:1,viboras:1.2,ceniza:1.5,segadores:2.2,humo:2.7,hierro:3.4};
const hyp=Math.hypot,R=Math.random,ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const sg=()=>S.mode==='creativo'?99:(S.story||0);
const free=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y);if(ix<0||iy<0||ix>=N||iy>=N)return false;const b=bm[occ[iy*N+ix]];return !b||WK(b.type)};
/* ---------- daño a personas y soldados ---------- */
function hurt(o,u,d,why){if(u){o.hp-=Math.max(2,d-(CL[o.p.arm]?CL[o.p.arm].def:0));o.p.injury=Math.min(100,(o.p.injury||0)+d*.22)}else{o.hp-=d;o.injury=Math.min(100,(o.injury||0)+d*.15);if(o.hp<=0)die(o,why)}}
function nearest(x,y,r,ow){let best=null,bd=r;S.ppl.forEach(p=>{if(p.away||p.inside||p.tw||p.hp<=0)return;const d=hyp(p.x-x,p.y-y);if(d<bd&&(!ow||!wallBetween(x,y,p.x,p.y))){bd=d;best={o:p,u:0,d}}});
 U.forEach(q=>{if(q.hp<=0)return;const d=hyp(q.x-x,q.y-y);if(d<bd&&(!ow||!wallBetween(x,y,q.x,q.y))){bd=d;best={o:q,u:1,d}}});return best}
function boomAt(x,y,bd,pd,r){FX.push({boom:1,x,y,t:.55});burst(x,y,16,'#ff9a30',3,12);burst(x,y,10,'#3a3a3a',2,8);SHK=Math.max(SHK||0,.3);try{sfxAt('crumble',x,y,{rate:1.3,v:.9})}catch(e){}
 S.bld.slice().forEach(b=>{if(b.type==='road'||b.type==='bridge')return;const px=cl(x,b.x,b.x+b.w),py=cl(y,b.y,b.y+b.h);if(hyp(px-x,py-y)<r){b.hp-=bd;if(b.hp<=0)killB(b)}});
 U.forEach(u=>{if(hyp(u.x-x,u.y-y)<r)u.hp-=pd});S.ppl.forEach(p=>{if(!p.away&&!p.inside&&!p.tw&&hyp(p.x-x,p.y-y)<r){p.hp-=pd;p.injury=Math.min(100,(p.injury||0)+pd*.4);if(p.hp<=0)die(p,'por una explosión')}})}
/* ---------- creación ---------- */
function mk(t,x,y,band,k){const z=mkZ(t,cl(x,.5,N-.5),cl(y,.5,N-.5),1);z.band=band;z.tmd=1;const tm=TM[band]||1,f=CAR[t]?Math.sqrt(tm):tm;z.dm=f;z.hp=z.mhp=Math.round(z.mhp*f*(k||1));z.lhp=z.hp;z.ang=Math.atan2(N/2-y,N/2-x);z.dx=Math.cos(z.ang)-Math.sin(z.ang);Z.push(z);return z}
function unload(z){if(z.un)return;z.un=1;z.park=T;const a=z.ang||0,sx=-Math.sin(a),sy=Math.cos(a),hurtK=z.hp<=0?.5:1;let n=0;
 (z.pas||[]).forEach((t,i)=>{if(z.hp<=0&&R()<.4)return;const side=i%2?1:-1,back=(Math.floor(i/2)-1)*.5,x=z.x+sx*side*.95-Math.cos(a)*back,y=z.y+sy*side*.95-Math.sin(a)*back;
  const p=mk(t,free(x,y)?x:z.x,free(x,y)?y:z.y,z.band,hurtK);p.fromV=1;n++});
 z.pas=[];if(n){burst(z.x,z.y,6,'#8a7a66',1.6,6);try{sfxAt('bshout',z.x,z.y,{v:.9})}catch(e){}}}
/* ---------- comportamiento ---------- */
function armor(z){if(z.lhp===undefined)z.lhp=z.hp;const d=z.lhp-z.hp;if(d>0&&!(T-(z._pf||-9)<.5)){z.hp=Math.min(z.mhp,z.hp+d*.5);if(R()<.3)burst(z.x,z.y,2,'#d8dde2',1.4,10)}z.lhp=z.hp}
function target(z){let b=bm[z.tg];if(b&&!['road','bridge','wall','gate','barricade'].includes(b.type))return b;let bd=1e9;b=null;S.bld.forEach(q=>{if(['road','bridge','wall','gate','barricade'].includes(q.type))return;const d=hyp(q.x+q.w/2-z.x,q.y+q.h/2-z.y);if(d<bd){bd=d;b=q}});z.tg=b?b.id:0;return b}
function ram(z,b){const c=CAR[z.t];if(b){b.hp-=c.ram*(z.dm||1);if(b.hp<=0)killB(b)}SHK=Math.max(SHK||0,.25);burst(z.x+Math.cos(z.ang)*c.L*.5,z.y+Math.sin(z.ang)*c.L*.5,12,'#9a8a76',2.4,6);try{sfxAt('crumble',z.x,z.y,{rate:1.5,v:.9})}catch(e){}unload(z)}
function drive(z,dt){const c=CAR[z.t];if(c.arm)armor(z);
 if(z.hp<z.mhp*.5&&R()<dt*4)burst(z.x,z.y,1,'#4a4a4a',.6,c.H*.9);
 if(z.un){/* aparcado: el conductor dispara desde dentro */z.at=0;z.cd=(z.cd||0)-dt;const t=nearest(z.x,z.y,4,1);if(t){z.at=1;z.dx=t.o.x-z.x;if(z.cd<=0){z.cd=1.4;hurt(t.o,t.u,ZT[z.t].d*(z.dm||1)*1.4,'tiroteado por los bandidos');FX.push({a:[z.x,z.y],b:[t.o.x,t.o.y],t:.1,col:'#ffd24a'});try{sfxAt('pistol',z.x,z.y,{v:.7})}catch(e){}}}return}
 if(z.hp<z.mhp*.45){unload(z);return}
 const b=target(z);if(!b){unload(z);return}
 const px=cl(z.x,b.x,b.x+b.w),py=cl(z.y,b.y,b.y+b.h),d=hyp(px-z.x,py-z.y);if(d<c.L*.5+.35){ram(z,b);return}
 const a=Math.atan2(py-z.y,px-z.x);let da=a-(z.ang||0);while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;z.ang=(z.ang||0)+Math.max(-2.5*dt,Math.min(2.5*dt,da));
 const s=ZT[z.t].sp*dt*terrMul(z.x,z.y),nx=z.x+Math.cos(z.ang)*s,ny=z.y+Math.sin(z.ang)*s,hx=nx+Math.cos(z.ang)*c.L*.45,hy=ny+Math.sin(z.ang)*c.L*.45;
 const ix=Math.floor(hx),iy=Math.floor(hy);if(ix<0||iy<0||ix>=N||iy>=N){z.x=cl(nx,.5,N-.5);z.y=cl(ny,.5,N-.5);return}
 const ob=bm[occ[iy*N+ix]];if(ob&&!WK(ob.type)){ram(z,ob);return}
 z.x=nx;z.y=ny;z.dx=Math.cos(z.ang)-Math.sin(z.ang);
 /* atropello */z.hit=z.hit||{};const chk=(o,u,id)=>{if(z.hit[id]||hyp(o.x-z.x,o.y-z.y)>.75)return;z.hit[id]=1;hurt(o,u,22*(z.dm||1),'atropellado por los bandidos');burst(o.x,o.y,6,'#b22',1.6,8)};
 S.ppl.forEach(p=>{if(!p.away&&!p.inside&&!p.tw)chk(p,0,'p'+p.id)});U.forEach(u=>chk(u,1,'u'+u.p.id));
 /* atascado: se bajan */z.mv=(z.mv||0)+s;z.mt=(z.mt||0)+dt;if(z.mt>3){if(z.mv<.6)unload(z);z.mv=0;z.mt=0}}
function sniper(z,dt,oZ){z.cd=(z.cd||1.5)-dt;const t=nearest(z.x,z.y,9.5,1);if(t){z.at=1;z.aim=1;z.dx=t.o.x-z.x;if(z.cd<=0){z.cd=3.2;hurt(t.o,t.u,20*(z.dm||1),'abatido por un francotirador');FX.push({a:[z.x,z.y],b:[t.o.x,t.o.y],t:.14,col:'#fff3b0'});burst(t.o.x,t.o.y,3,'#b22',1.2,9);try{sfxAt('sniper',z.x,z.y,{v:.9})}catch(e){}}return}
 z.aim=0;const dm=z.dm;z.dm=(dm||1)*.3;try{oZ(z,dt)}finally{z.dm=dm}}
function dyn(z,dt){z.at=0;let b=bm[z.tg];if(!b||z.tg!==z.tg0){let bd=1e9;b=null;const sc=q=>q.type==='wall'||q.type==='gate'?.55:TWR(q.type)?.8:1;S.bld.forEach(q=>{if(q.type==='road'||q.type==='bridge')return;const d=hyp(q.x+q.w/2-z.x,q.y+q.h/2-z.y)*sc(q);if(d<bd){bd=d;b=q}});z.tg=z.tg0=b?b.id:0}
 if(!b)return;const px=cl(z.x,b.x,b.x+b.w),py=cl(z.y,b.y,b.y+b.h),d=hyp(px-z.x,py-z.y);
 const go=()=>{z.blew=1;boomAt(z.x,z.y,140*(z.dm||1),35,2.3);z.hp=0};if(d<1){go();return}
 const s=ZT.bdy.sp*dt,nx=z.x+(px-z.x)/d*s,ny=z.y+(py-z.y)/d*s;z.dx=px-z.x;if(!zTryMove(z,nx,ny,dt)){const o=bm[z.tg];if(o&&hyp(cl(z.x,o.x,o.x+o.w)-z.x,cl(z.y,o.y,o.y+o.h)-z.y)<1.3)go();else z.tg0=z.tg}}
function chained(z,dt,oZ){const o=z.own;
 if(!o||o.hp<=0){if(!z.free){z.free=1;burst(z.x,z.y,4,'#6a6a6a',1.4,10);if(!chained.tw||T-chained.tw>8){chained.tw=T;toast('⛓️ ¡Los zombis encadenados se han soltado!')}}return oZ(z,dt)}
 z.at=0;const L=2.2,t=nearest(o.x,o.y,L+1,0);let tx,ty;
 if(t){if(hyp(t.o.x-z.x,t.o.y-z.y)<.8){z.at=1;z.dx=t.o.x-z.x;hurt(t.o,t.u,ZT.bzc.d*(z.dm||1)*dt,'atacado por los zombis');return}tx=t.o.x;ty=t.o.y}
 else{const a=(o.ang!=null?o.ang:Math.atan2(N/2-o.y,N/2-o.x))+Math.PI+((z.ci||0)-1)*.8;tx=o.x+Math.cos(a)*1.2;ty=o.y+Math.sin(a)*1.2}
 if(hyp(tx-z.x,ty-z.y)>.15){z.dx=tx-z.x;step(z,tx,ty,ZT.bzc.sp*1.6*dt)}
 const d=hyp(z.x-o.x,z.y-o.y);if(d>L){z.x=o.x+(z.x-o.x)/d*L;z.y=o.y+(z.y-o.y)/d*L}}
const oZ=window.zUpd;
window.zUpd=function(z,dt){const t=z.t;if(!MY.has(t))return oZ(z,dt);if(z.hp<=0)return;if(!z.act)return oZ(z,dt);
 if(CAR[t])return drive(z,dt);
 if(t==='bfr')return sniper(z,dt,oZ);
 if(t==='bdy')return dyn(z,dt);
 if(t==='bzc')return chained(z,dt,oZ);
 const x=z.x,y=z.y;oZ(z,dt);if(t==='bmo'){const m=hyp(z.x-x,z.y-y);if(m>1e-4)z.ang=Math.atan2(z.y-y,z.x-x);if(m>.002&&R()<dt*6)burst(z.x,z.y,1,'#a89870',.8,3)}
 if(t==='bdo'){/* el domador no corre más que sus zombis */}};
try{zUpd=window.zUpd}catch(e){}
/* munición perforante: atraviesa el blindaje */
const oWH=window.wpHit;if(oWH)window.wpHit=function(p,t,d){const r=oWH.apply(this,arguments);try{if(t&&CAR[t.t]&&CAR[t.t].arm&&p&&p.wp&&p.wp.mod==='perf')t._pf=T}catch(e){}return r};
/* ---------- muertes: sin cadáver de zombi; los vehículos estallan y sueltan a quien quede ---------- */
const oC=window.combat;
window.combat=function(dt){const pre=Z.filter(z=>MY.has(z.t)&&z.hp>0);const r=oC.apply(this,arguments);
 pre.forEach(z=>{if(z.hp>0||z.dd)return;z.dd=1;if(z.t==='bzc')return;
  for(let i=DEAD.length-1;i>=0;i--){const d=DEAD[i];if(d.zom&&d.x===z.x&&d.y===z.y){DEAD.splice(i,1);break}}
  for(let i=PT.length-1;i>=0;i--){const p=PT[i];if(p.col==='#6f8f35'&&p.x===z.x&&p.y===z.y)PT.splice(i,1)}
  if(CAR[z.t]){boomAt(z.x,z.y,25,15,1.4);unload(z);burst(z.x,z.y,14,'#2a2a2a',1.4,16)}
  else if(z.t==='bmo'){const b=mk('b',z.x,z.y,z.band,.6);b.fromV=1;burst(z.x,z.y,10,'#8a6a3a',2,6)}
  else{if(z.t==='bdy'&&!z.blew&&R()<.35)boomAt(z.x,z.y,40,30,1.8);burst(z.x,z.y,6,'#b22',1.6,8);if(window.onBanditDeath)try{onBanditDeath(z)}catch(e){}}});
 return r};
try{combat=window.combat}catch(e){}
/* ---------- composición del asalto ---------- */
function edge(w,i,d){const a=Math.max(1,Math.min(N-1,w.al+(i%5-2)*1.6));return w.side===0?[a,d]:w.side===1?[N-d,a]:w.side===2?[a,N-d]:[d,a]}
function plan(W){if(typeof horde==='undefined'||!horde)return;const id=horde.band,lv=sg(),n=(S.bn&&S.bn.n)||1;if(!id)return;
 const foot=Z.filter(z=>z.act&&z.band===id&&(z.t==='b'||z.t==='k')&&!z.scout&&!z._sp);if(!foot.length)return;
 const f0=foot[0];if(!W){const sd=f0.y<3?0:f0.x>N-3?1:f0.y>N-3?2:f0.x<3?3:Math.floor(R()*4);W={side:sd,al:sd%2?f0.y:f0.x}}
 let pool=foot.slice(),k=0;const take=m=>{const out=[];while(out.length<m&&pool.length>2){const z=pool.pop();z.hp=0;z.act=0;z.dd=1;out.push(z.t)}return out};
 const at=d=>edge(W,k++,d),add=[];
 if(lv>=4&&R()<(id==='cuervos'?1:.6))for(let i=0;i<Math.min(3,1+Math.floor(n/3));i++){if(!take(1).length)break;add.push(['bmo'])}
 if(lv>=8&&R()<(id==='viboras'?1:.65))for(let i=0;i<(id==='viboras'&&lv>=14?2:1);i++)add.push(['bco',take(3)]);
 if(lv>=10&&R()<.55)for(let i=0;i<(lv>=24?2:1);i++){if(!take(1).length)break;add.push(['bfr'])}
 if(lv>=12&&R()<(id==='segadores'?1:.5)&&take(1).length)add.push(['bdo']);
 if(lv>=16&&R()<.5)add.push(['bfu',take(6)]);
 if(lv>=18&&R()<(id==='humo'?1:.45))for(let i=0;i<ri(1,3);i++){if(!take(1).length)break;add.push(['bdy'])}
 if(lv>=26&&R()<(id==='hierro'?1:.45))add.push(['bbl',take(4)]);
 if(lv>=34&&R()<(id==='hierro'?.75:.35))add.push(['bfb',take(8)]);
 Z=Z.filter(z=>!(z.dd&&!z.act&&z.hp<=0&&foot.includes(z)));
 let veh=0;add.forEach(([t,pas])=>{const p=at(CAR[t]?1.2:.9),z=mk(t,p[0],p[1],id);if(CAR[t]){z.pas=(pas||[]).slice();z.mt=-2;veh++}
  if(t==='bdo'){for(let i=0;i<ri(2,3);i++){const c=mk('bzc',p[0]+R()-.5,p[1]+R()-.5,id);c.own=z;c.ci=i;c.dm=1;c.hp=c.mhp=Math.round(ZT.bzc.hp*(1+Math.min(.9,.045*hEff())))}}});
 if(veh||add.some(a=>a[0]==='bmo')){engine(add.some(a=>CAR[a[0]])?1:0);try{toast('🏴 ¡Se oyen motores! '+BANDS[id].n+': llegan en vehículos.')}catch(e){}}
 return add.map(a=>a[0])}
const oBR=window.bandRaid;
window.bandRaid=function(id){const w=S.bw&&S.bw.day<=S.day?S.bw:null,W=w?{side:w.side,al:w.al}:null;const r=oBR.apply(this,arguments);try{plan(W)}catch(e){console.error('bandidos_tipos',e)}return r};
try{bandRaid=window.bandRaid}catch(e){}
/* ---------- sonido de motores ---------- */
function engine(big){try{if(typeof SND!=='undefined'&&!SND)return;const a=typeof audioContext==='function'?audioContext():null;if(!a)return;const t=a.currentTime,v=typeof sfxVol==='number'?sfxVol:.6,g=a.createGain(),f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=big?380:900;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.2*v,t+.6);g.gain.setValueAtTime(.2*v,t+2.2);g.gain.exponentialRampToValueAtTime(.0001,t+3.4);f.connect(g);g.connect(a.destination);
 [big?46:90,big?69:135].forEach((fr,i)=>{const o=a.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(fr,t);o.frequency.linearRampToValueAtTime(fr*1.6,t+1.2);o.frequency.linearRampToValueAtTime(fr*1.25,t+3.2);const l=a.createOscillator(),lg=a.createGain();l.frequency.value=big?9:16;lg.gain.value=fr*.08;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+3.5);const gg=a.createGain();gg.gain.value=i?.4:.7;o.connect(gg);gg.connect(f);o.start(t);o.stop(t+3.5)})}catch(e){}}
/* ---------- dibujo ---------- */
const sh=(h,k)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return'rgb('+f(n>>16)+','+f(n>>8&255)+','+f(n&255)+')'};
function prism(c,x,y,a,L,W,z0,z1,col,off,face,top){const fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx,ox=x+fx*(off||0),oy=y+fy*(off||0);
 const cs=[[1,1],[1,-1],[-1,-1],[-1,1]].map(([i,j])=>[ox+fx*L/2*i+sx*W/2*j,oy+fy*L/2*i+sy*W/2*j]),pr=cs.map(p=>P(p[0],p[1]));
 c.strokeStyle='rgba(14,12,10,.85)';c.lineWidth=1;c.lineJoin='round';
 for(let i=0;i<4;i++){const j=(i+1)%4,mx=(cs[i][0]+cs[j][0])/2-ox,my=(cs[i][1]+cs[j][1])/2-oy;if(mx+my<=0)continue;const k=mx>my?.8:.6;
  c.fillStyle=face?face(k,i===0):sh(col,k);c.beginPath();c.moveTo(pr[i][0],pr[i][1]-z0);c.lineTo(pr[j][0],pr[j][1]-z0);c.lineTo(pr[j][0],pr[j][1]-z1);c.lineTo(pr[i][0],pr[i][1]-z1);c.closePath();c.fill();c.stroke();
  if(face&&face.gl){c.strokeStyle='rgba(200,225,240,.35)';c.beginPath();const t=.3;c.moveTo(pr[i][0]+(pr[j][0]-pr[i][0])*t,pr[i][1]+(pr[j][1]-pr[i][1])*t-z1+1.5);c.lineTo(pr[i][0]+(pr[j][0]-pr[i][0])*(t+.12),pr[i][1]+(pr[j][1]-pr[i][1])*(t+.12)-z0-1.5);c.stroke();c.strokeStyle='rgba(14,12,10,.85)'}}
 c.fillStyle=top||sh(col,1.05);c.beginPath();pr.forEach((p,i)=>i?c.lineTo(p[0],p[1]-z1):c.moveTo(p[0],p[1]-z1));c.closePath();c.fill();c.stroke();return pr}
function wheel(c,x,y,r){const q=P(x,y);c.fillStyle='#141414';c.strokeStyle='#000';c.lineWidth=.8;c.beginPath();c.ellipse(q[0],q[1]-r*.75,r*.8,r,0,0,7);c.fill();c.stroke();c.fillStyle='#6a6a6a';c.beginPath();c.ellipse(q[0],q[1]-r*.75,r*.32,r*.4,0,0,7);c.fill()}
const GLASS=(k,fr)=>fr?'#22303a':(k>.7?'#3d5262':'#2c3c48');GLASS.gl=1;
function drawCar(c,z){const k=CAR[z.t],a=z.ang||0,fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx,L=k.L,W=k.W,B=(window.BANDS&&BANDS[z.band])||{col:'#333',flag:'#333',acc:'#ddd'},bob=z.un?0:Math.sin(T*22+z.x)*.4;
 const q0=P(z.x,z.y);c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q0[0],q0[1],L*24,L*12,0,0,7);c.fill();
 const wr=k.arm?4.4:3.8,ws=[[1,1],[1,-1],[-1,1],[-1,-1]].map(([i,j])=>[z.x+fx*L*.32*i+sx*W*.5*j,z.y+fy*L*.32*i+sy*W*.5*j]),dc=z.x+z.y;
 ws.filter(w=>w[0]+w[1]<dc).forEach(w=>wheel(c,w[0],w[1],wr));
 c.save();c.translate(0,bob);
 k.P.forEach(([o,l,w,z0,z1,t])=>{if(t==='b')prism(c,z.x,z.y,a,L*l,W*w,z0,z1,k.col,L*o);
  else if(t==='g')prism(c,z.x,z.y,a,L*l,W*w,z0,z1,k.col,L*o,GLASS,sh(k.col,1.08));
  else{const m=z0+(z1-z0)*.45;prism(c,z.x,z.y,a,L*l,W*w,z0,m,k.col,L*o);prism(c,z.x,z.y,a,L*l*.98,W*w*.98,m,m+1.6,'#0c0c0c',L*o,()=>'#0c0c0c');prism(c,z.x,z.y,a,L*l,W*w,m+1.6,z1,k.col,L*o)}});
 c.restore();
 ws.filter(w=>w[0]+w[1]>=dc).forEach(w=>wheel(c,w[0],w[1],wr));
 c.save();c.translate(0,bob);
 const H=k.P.reduce((m,p)=>Math.max(m,p[4]),0),pt=(f,s)=>P(z.x+fx*L*f+sx*W*s,z.y+fy*L*f+sy*W*s);
 /* franja de la banda en el techo */{const top=k.P.find(p=>p[4]===H),p1=pt(top[0]-top[1]*.4,0),p2=pt(top[0]+top[1]*.4,0);c.strokeStyle=B.col;c.lineWidth=3.2;c.lineCap='butt';c.beginPath();c.moveTo(p1[0],p1[1]-H-.4);c.lineTo(p2[0],p2[1]-H-.4);c.stroke()}
 /* faros y pilotos */const zf=k.P[0][4]-2.5;[[.5,.32],[.5,-.32]].forEach(([f,s])=>{const p=pt(f,s);c.fillStyle='#ffe9a0';c.beginPath();c.ellipse(p[0],p[1]-zf,1.6,1.2,0,0,7);c.fill()});
 [[-.5,.34],[-.5,-.34]].forEach(([f,s])=>{const p=pt(f,s);c.fillStyle='#d42a1e';c.fillRect(p[0]-1.2,p[1]-zf-.8,2.4,1.6)});
 if(k.arm){/* pala delantera, escotilla y remaches */const n=pt(.62,0),l=pt(.5,.62),r=pt(.5,-.62);c.fillStyle='#2e302c';c.strokeStyle='#111';c.lineWidth=1;c.beginPath();c.moveTo(l[0],l[1]-2);c.lineTo(n[0],n[1]-3);c.lineTo(r[0],r[1]-2);c.lineTo(r[0],r[1]-8);c.lineTo(n[0],n[1]-9);c.lineTo(l[0],l[1]-8);c.closePath();c.fill();c.stroke();
  c.strokeStyle='#55585a';c.lineWidth=.8;for(let i=1;i<4;i++){const u=pt(.5+.04*i,.6-.15*i),v=pt(.5+.04*i,-.6+.15*i);c.beginPath();c.moveTo(u[0],u[1]-3-i*1.3);c.lineTo(v[0],v[1]-3-i*1.3);c.stroke()}
  const h=pt(-.12,0);c.fillStyle='#2a2e28';c.beginPath();c.ellipse(h[0],h[1]-H-1.2,3.6,2,0,0,7);c.fill();c.stroke();
  c.fillStyle='#c9cdd2';for(let i=-2;i<=2;i++)for(const s2 of[.51,-.51]){const p=pt(i*.18,s2);if(p[1]>q0[1]-2)c.fillRect(p[0]-.6,p[1]-7.5,1.2,1.2)}}
 /* antena con la bandera */const an=pt(-.42,.35),ay=an[1]-H,t=T*5+z.x;c.strokeStyle='#222';c.lineWidth=1;c.beginPath();c.moveTo(an[0],ay);c.lineTo(an[0],ay-16);c.stroke();
 c.fillStyle=B.flag||B.col;c.beginPath();c.moveTo(an[0],ay-16);for(let i=0;i<=4;i++)c.lineTo(an[0]+i*2.2,ay-16+Math.sin(t+i)*1.1);for(let i=4;i>=0;i--)c.lineTo(an[0]+i*2.2,ay-10+Math.sin(t+i)*1.1);c.closePath();c.fill();
 if(z.at){const p=pt(0,.3);c.fillStyle='#ffd24a';c.beginPath();c.arc(p[0],p[1]-H*.75,2,0,7);c.fill()}
 c.restore()}
function human(c,z,t){z.sd=z.sd||1+Math.floor(R()*90);EXP='angry';SXF=0;OLDF=0;KIDF=0;window.BCOL=(z.band&&window.BANDS&&BANDS[z.band])?BANDS[z.band].col:null;fig(z.x,z.y,'#5b3d2a',1,1,'#d8a878',1,z.dx,'ban',z.at?4:0,z.sd);window.BCOL=null;
 const rt=z.t;z.t=t;try{window.drawBandit&&drawBandit(c,z)}finally{z.t=rt}}
function drawMoto(c,z){const a=z.ang!=null?z.ang:0,fx=Math.cos(a),fy=Math.sin(a),B=(window.BANDS&&BANDS[z.band])||{col:'#333'};
 const pt=(f,h)=>{const p=P(z.x+fx*f,z.y+fy*f);return[p[0],p[1]-h]},q=P(z.x,z.y);c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q[0],q[1],16,7,0,0,7);c.fill();
 const W=(f)=>{const p=pt(f,0);c.fillStyle='#121212';c.strokeStyle='#000';c.lineWidth=1;c.beginPath();c.ellipse(p[0],p[1]-4.6,4.2,4.8,0,0,7);c.fill();c.stroke();c.fillStyle='#8a8a8a';c.beginPath();c.ellipse(p[0],p[1]-4.6,1.5,1.7,0,0,7);c.fill()};
 W(-.42);W(.42);c.lineCap='round';c.lineJoin='round';
 const r=pt(-.42,4.6),f=pt(.42,4.6),s=pt(-.08,10),k=pt(.22,11),h=pt(.34,15);
 c.strokeStyle='#1a1a1a';c.lineWidth=2.6;c.beginPath();c.moveTo(r[0],r[1]);c.lineTo(s[0],s[1]);c.lineTo(k[0],k[1]);c.lineTo(f[0],f[1]);c.stroke();
 c.strokeStyle='#9a9a9a';c.lineWidth=1.4;c.beginPath();c.moveTo(f[0],f[1]);c.lineTo(h[0],h[1]);c.stroke();const hb=P(-fy*.18,fx*.18);c.beginPath();c.moveTo(h[0]-hb[0],h[1]-hb[1]);c.lineTo(h[0]+hb[0],h[1]+hb[1]);c.stroke();
 const e=pt(-.25,5);c.strokeStyle='#6a6a6a';c.lineWidth=2;c.beginPath();c.moveTo(e[0],e[1]);c.lineTo(r[0],r[1]+.5);c.stroke();
 c.fillStyle=B.col;c.strokeStyle='#111';c.lineWidth=1;c.beginPath();c.ellipse((s[0]+k[0])/2,(s[1]+k[1])/2-1.5,6,3.2,Math.atan2(k[1]-s[1],k[0]-s[0]),0,7);c.fill();c.stroke();
 c.fillStyle='#ffe9a0';c.beginPath();c.arc(h[0],h[1]+2,1.4,0,7);c.fill();
 c.save();c.translate(0,-7);human(c,z,'b');c.restore()}
function drawHum(c,z){const t=z.t,q=P(z.x,z.y),f=z.dx<0?-1:1;
 human(c,z,t==='bdo'?'k':'x');
 const hx=q[0]+f*5.5,hy=q[1]-11;c.lineCap='round';
 if(t==='bfr'){c.strokeStyle='#1a1a1c';c.lineWidth=2;c.beginPath();c.moveTo(hx-f*4,hy+1);c.lineTo(hx+f*16,hy-(z.aim?1:4));c.stroke();c.fillStyle='#2a2a2e';c.fillRect(hx+f*3-2,hy-3.5-(z.aim?0:1),5,2.2);
  c.fillStyle='rgba(0,0,0,.35)';c.fillRect(q[0]-4,q[1]-25,8,3);if(z.aim&&Math.sin(T*9)>0){c.fillStyle='rgba(255,40,40,.7)';c.beginPath();c.arc(hx+f*3,hy-4,1.2,0,7);c.fill()}}
 else if(t==='bdy'){c.fillStyle='#b8322c';for(let i=0;i<3;i++)c.fillRect(hx-1+i*1.7*f-1,hy-6,1.6,6);c.strokeStyle='#e8d8b0';c.lineWidth=.8;c.beginPath();c.moveTo(hx+f*2,hy-6);c.quadraticCurveTo(hx+f*4,hy-10,hx+f*3,hy-12);c.stroke();
  if(Math.sin(T*30+z.x*7)>-.2){c.fillStyle='#ffd24a';c.beginPath();c.arc(hx+f*3,hy-12.5,1.5+R(),0,7);c.fill()}
  c.fillStyle='#b8322c';[-3,0,3].forEach(o=>c.fillRect(q[0]+o-1,q[1]-14,2,5))}
 else if(t==='bdo'){c.strokeStyle='#3a2a1c';c.lineWidth=1.4;c.beginPath();c.moveTo(hx,hy);c.quadraticCurveTo(hx+f*9,hy-8+Math.sin(T*6)*3,hx+f*16,hy+2);c.stroke()}}
function drawChained(c,z){SXF=0;OLDF=0;KIDF=0;ZV=0;fig(z.x,z.y,ZT.bzc.c,1,1,'#9bb27a',0,z.dx,'zom',z.at?2:0,0);
 const q=P(z.x,z.y);c.fillStyle='#3a3a3e';c.strokeStyle='#111';c.lineWidth=.8;c.fillRect(q[0]-3.6,q[1]-19,7.2,2.4);c.strokeRect(q[0]-3.6,q[1]-19,7.2,2.4);
 c.fillStyle='#2a0c0c';c.fillRect(q[0]-2.5,q[1]-21.5,5,1.6);/* boca cosida */
 const o=z.own;if(o&&o.hp>0&&!z.free){const p=P(o.x,o.y),f=o.dx<0?-1:1,hx=p[0]+f*5.5,hy=p[1]-11,mx=(q[0]+hx)/2,my=Math.max(q[1],p[1])-4+Math.sin(T*3+z.ci)*2;
  c.strokeStyle='#8a8f96';c.lineWidth=1.3;c.setLineDash([2,1.4]);c.beginPath();c.moveTo(q[0],q[1]-18);c.quadraticCurveTo(mx,my,hx,hy);c.stroke();c.setLineDash([])}
 else{c.strokeStyle='#8a8f96';c.lineWidth=1.3;c.setLineDash([2,1.4]);c.beginPath();c.moveTo(q[0],q[1]-18);c.lineTo(q[0]-(z.dx<0?-6:6),q[1]-6+Math.sin(T*8)*2);c.stroke();c.setLineDash([])}}
const DR={bmo:drawMoto,bco:drawCar,bfu:drawCar,bbl:drawCar,bfb:drawCar,bfr:drawHum,bdy:drawHum,bdo:drawHum,bzc:drawChained};
if(window.ZX){const oHas=ZX.has,oBh=ZX.bh,oDh=ZX.dh;ZX.has=t=>MY.has(t)||oHas(t);ZX.bh=t=>MY.has(t)?VT[t].bh:oBh(t);
 ZX.dh=function(c,z){if(!MY.has(z.t))return oDh.apply(this,arguments);c.save();try{if(z.el!=null&&CAR[z.t]){/* ficha y bestiario: más pequeño para que quepa */const k=.8/CAR[z.t].L;c.scale(k,k);c.translate(0,-12)}
  if(z.el!=null&&z.ang==null)z.ang=.3;if(z.el!=null&&CAR[z.t]&&!z.band)z.band='cuervos';if(z.el!=null&&z.t==='bmo'){z.band=z.band||'cuervos';z.ang=Math.PI*.5+.4}DR[z.t](c,z)}catch(e){}finally{c.restore()}}}
/* ---------- fichas (presentación y bestiario) ---------- */
if(window.enemyInfo)Object.assign(enemyInfo,{
 bmo:['Humano hostil','Un saqueador en moto. Llega antes que nadie y dispara mientras rodea tus casas. Si le tumbas la moto, sigue a pie.','Ten tiradores repartidos: es rápido y cambia de sitio.'],
 bco:['Vehículo','Un coche con tres bandidos dentro. Embiste el primer edificio o muro que encuentra y los suelta allí. El conductor sigue disparando desde dentro.','Párale antes de que llegue: si estalla por el camino, los de dentro bajan heridos.'],
 bfu:['Vehículo','Una furgoneta cargada con seis bandidos. Más lenta que el coche, pero embiste más fuerte.','Concentra el fuego en ella en cuanto aparezca: lo peor es lo que lleva dentro.'],
 bbl:['Vehículo blindado','Un coche acorazado con pala delantera: derriba muros y solo recibe la mitad del daño.','La munición perforante atraviesa su blindaje.'],
 bfb:['Vehículo blindado','Una furgoneta acorazada con ocho bandidos dentro. Lenta, pero rompe casi cualquier muro de una embestida.','Munición perforante y torres por delante de la muralla.'],
 bfr:['Humano hostil','Se queda lejos y dispara cada pocos segundos un tiro muy fuerte. Los muros le tapan la vista.','Mándale soldados: de lejos te desgasta a la gente.'],
 bdy:['Humano hostil','Corre con un cartucho de dinamita encendido hacia tus muros y torres y se hace estallar. A veces explota al caer.','Abátelo lejos de tus edificios.'],
 bdo:['Humano hostil','Lleva a sus zombis atados con cadenas: le sirven de escudo y muerden a quien se acerca.','Si cae el domador, los zombis se sueltan y atacan a lo loco.'],
 bzc:['Infectado','Un zombi con collar y la boca cosida, atado a su domador. No se aleja de él más que la cadena.','Mata al domador o se quedarán protegiéndole.']});
/* guía: Bandas humanas */
try{const i=GD.findIndex(g=>g[0]==='Bandas humanas');if(i>=0){const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}const sn=t=>!!(S.zseen&&S.zseen[t]),nm=t=>sn(t)?ZT[t].n:'???';
 return h+'<p><b>🚗 Variantes:</b> según avanza la historia, las bandas traen '+['bmo','bco','bfu','bbl','bfb','bfr','bdy','bdo'].map(nm).join(', ')+'. Los vehículos embisten lo primero que encuentran y sueltan a sus pasajeros; '+(sn('bbl')||sn('bfb')?'los blindados solo reciben la mitad del daño, salvo con munición perforante.':'???')+'</p>'}}}catch(e){}
window.__bv={plan,mk,CAR,VT};
})();
