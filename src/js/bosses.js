/* ===== Dead Town · jefes de zona zombi: Coloso, Jinete Pálido, Reina de la Colmena, Banshee, Centurión y Alfa de la Jauría ===== */
(function(){
'use strict';
const ZX=window.ZX,hyp=Math.hypot;
const BO={
 U:{n:'Coloso del Osario',base:'u',hp:1800,sp:.38,d:34,bh:96,col:'#ff5a3a',s:1.6},
 J:{n:'Jinete Pálido',base:'j',hp:1300,sp:1.5,d:20,bh:100,col:'#8be3ff',s:1.5},
 T:{n:'Reina de la Colmena',base:'t',hp:1100,sp:.9,d:14,bh:78,col:'#b6e04a',s:1.7},
 G:{n:'Banshee',base:'g',hp:900,sp:.7,d:10,bh:84,col:'#e8e8ff',s:1.6},
 A:{n:'Centurión Carmesí',base:'a',hp:1700,sp:.5,d:22,bh:90,col:'#ff4a4a',s:1.55},
 H:{n:'Alfa de la Jauría',base:'h',hp:1200,sp:1.2,d:20,bh:76,col:'#ffd83a',s:1.6}};
const LORE={
 A:['El Cordón','Los restos del Cordón siguen custodiados por un soldado que no dejó de obedecer órdenes: el Centurión Carmesí, un oficial infectado con la armadura soldada a la piel.'],
 U:['Los sótanos de Aurora','Aurora experimentó con sujetos para crear soldados. El primero que sobrevivió al tratamiento sigue encerrado: el Coloso del Osario.'],
 G:['Radio Aurora','Una señal de auxilio sigue sonando en bucle. Su origen es una antigua locutora que aún grita: la Banshee.'],
 T:['La presa de Valcaldera','Bajo la presa creció un nido enorme dirigido por una criatura que ordena al resto: la Reina de la Colmena.'],
 H:['Los lotes huérfanos','Los perros del Consejo fueron soltados sin dueño. Su líder, el Alfa de la Jauría, caza todo lo que se mueve.'],
 J:['El convoy fantasma de Hahn','Los supervivientes hablan de un jinete pálido que acompaña al convoy desaparecido: el Jinete Pálido.']};
window.BOSSMAP={9:'A',14:'U',19:'G',24:'T',29:'H',34:'J',38:'U',42:'A',46:'T'};
Object.keys(LORE).forEach(k=>{BO[k].lore=LORE[k][1];BO[k].where=LORE[k][0]});
const KEYS=Object.keys(BO);
KEYS.forEach(k=>{ZT[k]={n:BO[k].n,hp:BO[k].hp,sp:BO[k].sp,d:BO[k].d,c:'#888',big:1,boss:1,bh:BO[k].bh,climb:k==='T'?1:0}});
window.BOSS=BO;
/* tipos "especiales" incluyen a los jefes */
const oHas=ZX.has,oBh=ZX.bh;ZX.has=t=>!!BO[t]||oHas(t);ZX.bh=t=>BO[t]?BO[t].bh:oBh(t);
/* --- ejecuta el comportamiento del tipo base con las estadísticas del jefe --- */
function asBase(z,fn){const B=BO[z.t],zt=ZT[B.base],sv={d:zt.d,sp:zt.sp},real=z.t;zt.d=B.d;zt.sp=B.sp;z.t=B.base;try{return fn()}finally{z.t=real;zt.d=sv.d;zt.sp=sv.sp}}
/* ---------- defensa de la base ---------- */
const PGx=()=>S.mode==='creativo'?48:Math.min(48,S.story||0);
const oMk=window.mkZ;window.mkZ=function(t,x,y,act){const z=oMk.apply(this,arguments);
 if(act&&!BO[t]&&!(typeof isBan==='function'&&isBan(t)&&false)){const k=1+.015*PGx();z.hp=z.mhp=z.hp*k}
 if(BO[t]){if(act){const k=Math.max(.7,Math.min(1.6,.5+.035*PGx()));z.hp=z.mhp=z.hp*k}z.lhp=z.hp;if(t==='A'){z.pl0=z.mhp*.55;z.pl=z.pl0}z.rc=6}return z};
function spawn(t,x,y,n,hpK){for(let i=0;i<n;i++){const a=Math.random()*6.28,z=mkZ(t,cl(x+Math.cos(a)*1.6,.5,N-.5),cl(y+Math.sin(a)*1.6,.5,N-.5),1);if(hpK){z.hp=z.mhp=Math.round(z.mhp*hpK);z.lhp=z.hp}Z.push(z)}burst(x,y,10,'#6f8f35',2,10)}
const oZ=window.zUpd;
window.zUpd=function(z,dt){const B=BO[z.t];if(!B)return oZ(z,dt);if(z.hp<=0)return;
 if(!z.act)return asBase(z,()=>oZ(z,dt));
 const k=z.t;
 if(k==='A'){if(z.pl>0&&z.pl<z.pl0)z.pl=Math.min(z.pl0,z.pl+10*dt);if(z.pl<=0&&!z.rage){z.rage=1;burst(z.x,z.y,14,'#ff4a4a',2.4,12);toast('¡El Centurión se enfurece sin armadura!')}if(z.rage)dt*=1.5}
 if(k==='H'&&z.lc>3.5)z.lc=3.5;
 asBase(z,()=>oZ(z,dt));
 z.rc=(z.rc||0)-dt;
 if(k==='U'&&z.rc<=0){z.rc=14;spawn('z',z.x,z.y,4);SHK=Math.max(SHK||0,.3);sfxAt('bossroar',z.x,z.y,{v:1.4});z.roar=T}
 if(k==='T'&&z.rc<=0){z.rc=10;spawn('t',z.x,z.y,2,.9);z.roar=T}
 if(k==='J'&&!z.sum&&z.hp<z.mhp*.5){z.sum=1;spawn('r',z.x,z.y,6);toast('El Jinete Pálido llama a su jauría.')}
 if(k==='G'&&z.rc<=0){z.rc=6.5;z.roar=T;S.ppl.forEach(p=>{if(!p.away&&!p.inside&&hyp(p.x-z.x,p.y-z.y)<9){p.pin=T+1.5;p.pinBy=null;p.mor=Math.max(0,p.mor-6)}});U.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<9){u.pin=T+1.5;u.pinBy=null}});Z.forEach(o=>{if(o!==z&&o.act)o.boost=T+4});SHK=Math.max(SHK||0,.25);sfxAt('zshriek',z.x,z.y,{rate:.8,v:1.5})}};
/* recompensa al caer el jefe en la base */
const oC=window.combat;window.combat=function(dt){const bs=Z.filter(z=>BO[z.t]);const r=oC.apply(this,arguments);bs.forEach(z=>{if(z.hp<=0&&!z.bd){z.bd=1;const a=12+Math.round(Math.random()*8);S.res.alloy=(S.res.alloy||0)+a;toast('Jefe abatido: '+BO[z.t].n+'. +'+a+' aleación.');try{addLog('Abatisteis a '+BO[z.t].n+'.')}catch(e){}burst(z.x,z.y,24,'#ffd877',2.6,14);if(z.t==='J'){const n=mkZ('z',z.x,z.y,1);Z.push(n)}}});return r};
/* composición: un jefe cada 5 hordas */
const oComp=ZX.comp;ZX.comp=function(comp,n,PG){oComp.apply(this,arguments);const ok=KEYS.filter(k=>{for(const c in BOSSMAP)if(BOSSMAP[c]===k&&+c+1<=PG)return true;return false});
 if(S.hordeN%5===4&&ok.length){const pool=ok;comp[pool[Math.floor(Math.random()*pool.length)]]=1}};
/* ---------- dibujo (isométrico) ---------- */
const oDh=ZX.dh;
function aura(c,q,B,tt,k){const p=.5+.5*Math.sin(tt*3);c.strokeStyle=B.col;c.globalAlpha=.35+.25*p;c.lineWidth=2.2;c.beginPath();c.ellipse(q[0],q[1],22*k,9*k,0,0,7);c.stroke();c.globalAlpha=.12;c.fillStyle=B.col;c.fill();c.globalAlpha=1}
const OL='#14100a',SK='#8fae72';
const tri=(c,x,y,w,h,col)=>{c.fillStyle=col;c.strokeStyle=OL;c.lineWidth=1.2;c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);c.lineTo(x,y-h);c.closePath();c.fill();c.stroke()};
const ACC={
 U(c,f,tt,z){[[-13,-44],[13,-44],[-6,-48],[6,-48]].forEach(([x,y],i)=>tri(c,x,y,6,9+(i>1?3:0),'#d9d2b8'));c.strokeStyle='#5a5a60';c.lineWidth=2;c.beginPath();c.moveTo(-14,-40);c.quadraticCurveTo(0,-28,14,-40);c.stroke();
  c.fillStyle='rgba(255,70,40,'+(.6+.3*Math.sin(tt*6))+')';c.fillRect(-3,-49,2.4,2);c.fillRect(1,-49,2.4,2)},
 J(c,f,tt,z){c.fillStyle='rgba(235,240,255,.4)';c.beginPath();c.ellipse(0,-24,18,9,0,0,7);c.fill();c.fillStyle='rgba(20,24,40,.8)';c.beginPath();c.moveTo(-1*f,-44);c.quadraticCurveTo(-18*f,-36,-24*f,-16+Math.sin(tt*8)*2);c.lineTo(-6*f,-26);c.closePath();c.fill();
  c.strokeStyle='#8a8f96';c.lineWidth=2.2;c.beginPath();c.moveTo(14*f,-60);c.lineTo(20*f,-20);c.stroke();c.strokeStyle='#cfd6dc';c.beginPath();c.moveTo(14*f,-60);c.quadraticCurveTo(26*f,-62,28*f,-50);c.stroke();
  c.fillStyle='#8be3ff';c.fillRect(27*f,-40,2.6,2);c.fillRect(8*f,-54,2.4,2)},
 T(c,f,tt,z){for(let i=0;i<4;i++){const a=-.6+i*.4+Math.sin(tt*5+i)*.1;c.strokeStyle=OL;c.lineWidth=4.4;c.beginPath();c.moveTo(0,-26);c.lineTo(Math.sin(a)*22*(i%2?1:-1),-26-Math.cos(a)*10);c.stroke();c.strokeStyle='#7f9c62';c.lineWidth=2.6;c.stroke()}
  [[-14,2],[12,3],[0,5]].forEach(([x,y],i)=>{const p=.5+.5*Math.sin(tt*3+i);c.fillStyle='rgba(190,230,70,'+(.5+.3*p)+')';c.strokeStyle=OL;c.lineWidth=1.2;c.beginPath();c.ellipse(x,y,5+p,3.6+p*.6,0,0,7);c.fill();c.stroke()})},
 G(c,f,tt,z){c.strokeStyle='rgba(235,235,255,.8)';c.lineWidth=1.6;for(let i=0;i<7;i++){c.beginPath();c.moveTo((i-3)*1.6,-44);c.quadraticCurveTo((i-3)*5+Math.sin(tt*3+i)*4,-30,(i-3)*7+Math.sin(tt*2+i)*5,-8)}c.stroke();
  c.fillStyle='rgba(235,235,255,.3)';c.beginPath();c.moveTo(-10,-34);c.lineTo(10,-34);c.lineTo(16,-2+Math.sin(tt*4)*2);c.lineTo(-16,-2-Math.sin(tt*4)*2);c.closePath();c.fill()},
 A(c,f,tt,z){c.fillStyle='#b32424';c.strokeStyle=OL;c.lineWidth=1.2;c.beginPath();c.moveTo(-4,-52);c.quadraticCurveTo(0,-62,6*f,-58);c.lineTo(3*f,-50);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(160,20,20,.85)';c.beginPath();c.moveTo(-8,-38);c.lineTo(-18*f,-8);c.lineTo(-4,-12);c.closePath();c.fill();c.stroke();
  if(z.pl>0){c.fillStyle='#d8b04a';c.fillRect(-6,-30,12,3)}},
 H(c,f,tt,z){c.strokeStyle='#d9d2b8';c.lineWidth=2.4;[[-1],[1]].forEach(([s])=>{const hx=9*f+s*3,hy=-38;c.beginPath();c.moveTo(hx,hy);c.lineTo(hx+s*6,hy-8);c.lineTo(hx+s*5,hy-14);c.moveTo(hx+s*6,hy-8);c.lineTo(hx+s*11,hy-9);c.stroke()});
  c.fillStyle='rgba(255,60,40,.9)';c.fillRect(8*f,-34,2.6,2);c.fillRect(11*f,-34,2.6,2)}};
ZX.dh=function(c,z){const B=BO[z.t];if(!B)return oDh(c,z);const q=P(z.x,z.y),f=z.dx<0?-1:1,s=B.s;
 c.save();aura(c,q,B,T,s);c.translate(q[0],q[1]);c.scale(s,s);
 const fz=Object.create(z);fz.t=B.base;
 try{ZX._dr(c,fz,[0,0],f,T);ACC[z.t](c,f,T,z)}finally{c.restore()}
 const roar=T-(z.roar||-9);if(roar<1){c.save();c.strokeStyle=B.col;c.lineWidth=2;c.globalAlpha=Math.max(0,.6-roar*.6);c.beginPath();c.ellipse(q[0],q[1]-20,20+roar*90,9+roar*40,0,0,7);c.stroke();c.restore()}
 c.save();c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=3;c.font='bold 10px sans-serif';c.textAlign='center';const y=q[1]-B.bh-8*s/1.6;c.strokeText(B.n,q[0],y-6);c.fillText(B.n,q[0],y-6);c.restore()};
/* se necesita acceso a los dibujos base de zombis2: los exponemos desde allí */
/* ---------- misiones ---------- */
const oMk2=ZX.mk;ZX.mk=function(z,M){if(BO[z.t]&&!z.lg){z.lg=1;try{addLog('Abatisteis a '+BO[z.t].n+' en '+BO[z.t].where+'.')}catch(e){}}return oMk2&&oMk2.apply(this,arguments)};
const oMq=ZX.mq;
function msp(M,t,x,y,n,hpK){const hpM=1.1;for(let i=0;i<n;i++){const a=Math.random()*6.28,hp=Math.round(ZT[t].hp*hpM*(hpK||1)),px=Math.max(1.5,Math.min(COLS_-1.5,x+Math.cos(a)*1.6)),py=Math.max(1.5,Math.min(ROWS_-1.5,y+Math.sin(a)*1.6));M.en.push({t,x:px,y:py,hp,mhp:hp,st:1,path:[],pt:0,dm:1,cd:1})}}
let COLS_=26,ROWS_=11;
ZX.mq=function(z,dt,al,M,X){const B=BO[z.t];COLS_=X.COLS;ROWS_=X.ROWS;if(!B)return oMq(z,dt,al,M,X);
 if(z.hp<=0)return false;const k=z.t;z.rc=(z.rc===undefined?8:z.rc)-dt;
 if(k==='A'){if(z.pl===undefined){z.pl0=z.mhp*.55;z.pl=z.pl0}if(z.pl>0&&z.pl<z.pl0)z.pl=Math.min(z.pl0,z.pl+10*dt);if(z.pl<=0&&!z.rage){z.rage=1;X.addFl(M,z.x,z.y,'¡FURIA!','#ff4a4a')}z.spm=z.rage?1.5:1}
 if(k==='H'&&z.lc>3.5)z.lc=3.5;
 let r;const zt=ZT[B.base],sv={d:zt.d,sp:zt.sp};zt.d=B.d;zt.sp=B.sp;z.t=B.base;try{r=oMq(z,dt,al,M,X)}finally{z.t=k;zt.d=sv.d;zt.sp=sv.sp}
 if(k==='A')z.spm=z.rage?1.5:(z.spm||1);
 if(k==='U'&&z.rc<=0){z.rc=14;msp(M,'z',z.x,z.y,3);M.shake=.5;z.roar=M.t;X.addFl(M,z.x,z.y,'¡RUGIDO!','#ff7b5a')}
 if(k==='T'&&z.rc<=0){z.rc=10;msp(M,'t',z.x,z.y,2,.9);z.roar=M.t}
 if(k==='J'&&!z.sum&&z.hp<z.mhp*.5){z.sum=1;msp(M,'r',z.x,z.y,5);X.addFl(M,z.x,z.y,'¡Jauría!','#8be3ff')}
 if(k==='G'&&z.rc<=0){z.rc=6.5;z.roar=M.t;al.forEach(u=>{if(hyp(u.x-z.x,u.y-z.y)<9){u.pin=1.5;u.pinBy=null}});M.en.forEach(o=>{if(o!==z){o.boost=M.t+4;o.st=1}});M.shake=.4;X.addFl(M,z.x,z.y,'¡AAAAAH!','#e8e8ff')}
 return r};
ZX.dm=(function(o){return function(cx,z,ts,t,M){const B=BO[z.t];if(!B)return o(cx,z,ts,t,M);const x=z.x*ts,y=z.y*ts,r=.4*ts*.82;
 cx.save();const p=.5+.5*Math.sin(t*3);cx.strokeStyle=B.col;cx.globalAlpha=.4+.25*p;cx.lineWidth=2.5;cx.beginPath();cx.arc(x,y,r*2.1*(B.s/1.5),0,7);cx.stroke();cx.globalAlpha=1;
 cx.translate(x,y);cx.scale(B.s*.9,B.s*.9);cx.translate(-x,-y);const fz=Object.create(z);fz.t=B.base;o(cx,fz,ts,t,M);
 if(B.base==='a'||true){cx.fillStyle=B.col;cx.beginPath();cx.arc(x,y,r*.28,0,7);cx.fill()}
 cx.restore();const roar=t-(z.roar||-9);if(roar<1){cx.save();cx.strokeStyle=B.col;cx.globalAlpha=Math.max(0,.6-roar*.6);cx.lineWidth=2.4;cx.beginPath();cx.arc(x,y,r+roar*ts*5,0,7);cx.stroke();cx.restore()}}})(ZX.dm);
/* barra de vida del jefe (parte superior del mapa) */
ZX.hud=function(cx,M,W){const m=M.mo;if(!m||m.k!=='boss'||m.done||!m.boss||m.boss.hp<=0)return;const z=m.boss,B=BO[z.t],w=Math.min(420,W*.6),x=(W-w)/2,y=44;
 cx.save();cx.fillStyle='rgba(8,10,12,.85)';cx.fillRect(x-4,y-16,w+8,34);cx.strokeStyle=B.col;cx.lineWidth=1.5;cx.strokeRect(x-4,y-16,w+8,34);
 cx.fillStyle='#fff';cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillText(B.n.toUpperCase()+(z.st?'':' · duerme'),W/2,y-3);
 cx.fillStyle='#3a1210';cx.fillRect(x,y+3,w,8);cx.fillStyle=B.col;cx.fillRect(x,y+3,w*Math.max(0,z.hp/z.mhp),8);if(z.pl>0){cx.fillStyle='#cfd6dc';cx.fillRect(x,y+12,w*z.pl/z.pl0,2)}cx.restore()};
})();
