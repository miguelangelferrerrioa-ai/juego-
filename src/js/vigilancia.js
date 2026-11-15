/* Vigilancia del ejército:
   - Fuera de las hordas, los alistados patrullan: por dentro de los muros si los hay; si no, por el pueblo.
   - En una horda se reparten por el contorno: por dentro de los muros donde los hay y por el borde de los edificios donde no. Cada uno recorre su tramo y dispara a lo que le llega a tiro (los muros tapan el disparo).
   - Si un zombi se cuela dentro del pueblo, va a por él el soldado más cercano y luego vuelve a su tramo. */
(function(){
'use strict';
const NB4=[[1,0],[-1,0],[0,1],[0,-1]],NB8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],BINS=48;
const tb=(x,y)=>{const o=occ[y*N+x];return o>0?bm[o]:null};
const isW=b=>!!b&&(b.type==='wall'||b.type==='gate'),isB=b=>!!b&&!['wall','gate','road','bridge','trap'].includes(b.type);
const inMap=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
let G=null;
function geo(){if(G&&T-G.t<3&&G.n===S.bld.length&&G.N===N)return G;
 const pass=(x,y)=>inMap(x,y)&&!isW(tb(x,y))&&!pathBlocked(x,y);
 const out=new Uint8Array(N*N),q=[];
 for(let i=0;i<N;i++)for(const [x,y] of [[i,0],[i,N-1],[0,i],[N-1,i]])if(pass(x,y)&&!out[y*N+x]){out[y*N+x]=1;q.push(x,y)}
 for(let h=0;h<q.length;h+=2){const x=q[h],y=q[h+1];for(const[a,b]of NB4){const nx=x+a,ny=y+b;if(pass(nx,ny)&&!out[ny*N+nx]){out[ny*N+nx]=1;q.push(nx,ny)}}}
 const wallG=[],cand=[],inner=[];let cx=0,cy=0,cn=0;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=tb(x,y);if(isB(b)){cx+=x+.5;cy+=y+.5;cn++}}
 if(cn){cx/=cn;cy/=cn}else{const h=S.bld.find(b=>b.type==='hall');cx=h?h.x+h.w/2:N/2;cy=h?h.y+h.h/2:N/2}
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!pass(x,y))continue;
  /* ronda sin muros: cualquier casilla libre a ≤2 de un edificio (dentro del pueblo) */
  {let nb=false;for(let a=-2;a<=2&&!nb;a++)for(let c=-2;c<=2;c++)if(inMap(x+a,y+c)&&isB(tb(x+a,y+c))){nb=true;break}if(nb)inner.push([x+.5,y+.5])}
  const dc=Math.hypot(x+.5-cx,y+.5-cy);
  /* lado de dentro del muro: casilla libre junto a un muro y más cerca del centro del pueblo que ese muro (vale aunque haya huecos o puertas) */
  if(NB4.some(([a,c])=>inMap(x+a,y+c)&&isW(tb(x+a,y+c))&&Math.hypot(x+a+.5-cx,y+c+.5-cy)>dc+.2))wallG.push([x+.5,y+.5]);
  else if(out[y*N+x]&&NB8.some(([a,c])=>inMap(x+a,y+c)&&isB(tb(x+a,y+c))))cand.push([x+.5,y+.5])}
 const ang=p=>Math.atan2(p[1]-cy,p[0]-cx),bin=p=>Math.floor((ang(p)+Math.PI)/(2*Math.PI)*BINS)%BINS,rad=p=>Math.hypot(p[0]-cx,p[1]-cy);
 /* borde de los edificios: de las casillas libres junto a un edificio, las más alejadas del centro en cada dirección */
 const bMax=new Array(BINS).fill(0);cand.forEach(p=>{const k=bin(p);bMax[k]=Math.max(bMax[k],rad(p))});
 const wB=new Array(BINS).fill(0);wallG.forEach(p=>{const k=bin(p);wB[k]=Math.max(wB[k],rad(p))});
 const edge=cand.filter(p=>!wB[bin(p)]&&rad(p)>=bMax[bin(p)]-2.5);
 /* radio del contorno por dirección (muro o borde) para saber si un zombi se ha colado */
 const bR=bMax.map((v,k)=>wB[k]?wB[k]+.5:v);
 const ring=wallG.concat(edge).sort((a,b)=>ang(a)-ang(b));
 G={t:T,n:S.bld.length,N,out,wallG,edge,town:wallG.length?wallG:inner,ring,cx,cy,bMax:bR,bin,rad};return G}
window.vigGeo=geo;
/* zombi colado: dentro del recinto de los muros, o claramente por dentro del borde de los edificios */
function colado(z,g){const ix=Math.floor(z.x),iy=Math.floor(z.y);if(!inMap(ix,iy))return false;
 if(!g.out[iy*N+ix]&&!pathBlocked(ix,iy))return true;const p=[z.x,z.y],R=g.bMax[g.bin(p)];return R>0&&g.rad(p)<R-2}
let AT=-1,AS=new Map();
function assign(g){if(AT===T)return AS;AT=T;AS=new Map();const best=new Map();
 Z.forEach(z=>{if(!z.act||!colado(z,g))return;let bu=null,bd=1e9;U.forEach(u=>{if(u.hp<=0)return;const d=Math.hypot(z.x-u.x,z.y-u.y);if(d<bd){bd=d;bu=u}});
  if(bu&&(!best.has(bu)||best.get(bu)>bd)){best.set(bu,bd);AS.set(bu,z)}});return AS}
/* tramos del contorno: se reparten por ángulo entre los soldados */
let arcG=null,arcN=-1;
function arcs(g){if(arcG===g&&arcN===U.length)return;arcG=g;arcN=U.length;const L=g.ring.length;if(!L)return;
 const us=U.slice().sort((a,b)=>Math.atan2(a.y-g.cy,a.x-g.cx)-Math.atan2(b.y-g.cy,b.x-g.cx)),k=Math.max(1,Math.ceil(L/Math.max(1,us.length)));
 us.forEach((u,i)=>{u.si=Math.min(L-1,i*k);u.ei=Math.min(L-1,u.si+k-1);if(u.pi===undefined||u.pi<u.si||u.pi>u.ei)u.pi=u.si+Math.floor(Math.random()*(u.ei-u.si+1));u.pd=Math.random()<.5?1:-1;u.pw=0;u.ptg=null})}
function walk(u,x,y,sp,dt){u.mv=1;if(!(window.pstep&&pstep(u,x,y,sp*dt)))step(u,x,y,sp*dt)}
function patrol(u,dt,g){arcs(g);const L=g.ring.length;
 if(!L){const h=S.bld.find(b=>b.type==='hall');if(h&&Math.hypot(h.x+2-u.x,h.y+h.h+1.5-u.y)>.4)walk(u,h.x+2,h.y+h.h+1.5,2,dt);return}
 if(u.pw>0){u.pw-=dt;return}
 if(!u.ptg){let ni=u.pi+u.pd*(2+Math.floor(Math.random()*4));if(ni>u.ei||ni<u.si){u.pd=-u.pd;ni=Math.max(u.si,Math.min(u.ei,u.pi+u.pd*2))}u.pi=Math.max(0,Math.min(L-1,ni));u.ptg=g.ring[u.pi]}
 const d=Math.hypot(u.ptg[0]-u.x,u.ptg[1]-u.y);if(d<.35){u.ptg=null;u.pw=.4+Math.random()*1.2;return}
 walk(u,u.ptg[0],u.ptg[1],u.ptg&&d>6?2.2:1.5,dt)}
window.uUpd=function(u,dt){const c=CL[u.p.arm];u.cd-=dt;u.mv=0;
 if(!u.vInit){u.vInit=1;if(u.p&&!u.p.away&&isFinite(u.p.x)&&isFinite(u.p.y)&&u.p.x>0){u.x=u.p.x;u.y=u.p.y}}
 const g=geo();
 let t=null,td=1e9;Z.forEach(z=>{if(!z.act)return;const dd=Math.hypot(z.x-u.x,z.y-u.y);if(dd<=c.rng&&dd<td&&!wallBetween(u.x,u.y,z.x,z.y)){td=dd;t=z}});
 if(!t){const z=assign(g).get(u);if(z){t=z;td=Math.hypot(z.x-u.x,z.y-u.y);u.ptg=null}}
 if(u.p.arm=='medico'){let a=null;U.forEach(q=>{if(q!==u&&q.hp<mhp(q.p)-5&&Math.hypot(q.x-u.x,q.y-u.y)<3.5)a=q});if(a){a.hp+=10*dt;u.hl=T;return}}
 if(u.p.arm=='ing'){const b=S.bld.find(b=>b.hp<mxhp(b)&&Math.hypot(b.x+b.w/2-u.x,b.y+b.h/2-u.y)<b.w+3);if(b){b.hp=Math.min(mxhp(b),b.hp+15*dt);u.rp=T;return}}
 if(!t){patrol(u,dt,g);return}
 if(td<=1.4){u.dx=t.x-u.x;if(u.cd<=0){u.cd=.7;sfxAt('punch',u.x,u.y);t.hp-=(c.dmg*.8+(u.p.wp?u.p.wp.v*.5:0)+u.p.lvl)*(.9+Math.random()*.2);burst(t.x,t.y,2,'#b22',1,6)}}
 else if(td<=c.rng){u.dx=t.x-u.x;if(u.cd<=0){u.cd=.8;const m=S.res.ammo>=.05;if(m)S.res.ammo-=.05;{const k=({franco:'sniper',pesado:'rifle',esp:'blaster',expl:'pistol',medico:'pistol',ing:'pistol'})[u.p.arm]||'rifle';sfxAt(k,u.x,u.y);if(Math.random()<.3)setTimeout(()=>sfxAt('casing',u.x,u.y),330)}
  t.hp-=(c.dmg+(u.p.wp?u.p.wp.v:0)+u.p.lvl)*(th('arms1')?1.2:1)*(th('arms3')?1.2:1)*(th('arms4')?1.2:1)*(m?1:.6);FX.push({a:[u.x,u.y],b:[t.x,t.y],t:.1,col:'#fff'});burst(t.x,t.y,2,'#ffd24a',1,8)}}
 else walk(u,t.x,t.y,2.2,dt)};
try{uUpd=window.uUpd}catch(e){}
/* fuera de las hordas: los alistados sin puesto hacen la ronda (se controla antes y después del paseo normal para que este no les cambie el destino) */
function pick(p,g){const pts=g.town;if(!pts.length)return false;let best=null;for(let i=0;i<14;i++){const q=pts[Math.floor(Math.random()*pts.length)],d=Math.hypot(q[0]-p.x,q[1]-p.y);if(d>2&&d<9){best=q;break}if(!best||d<Math.hypot(best[0]-p.x,best[1]-p.y))best=q}p.vtx=best[0];p.vty=best[1];return true}
const idleOK=p=>p.arm&&!p.away&&!p.inside&&!p.job&&p.age>=18;
const oU=window.upd;window.upd=function(dt){let L=[],g=null;
 try{if(!horde&&typeof S!=='undefined'&&S&&S.ppl){L=S.ppl.filter(idleOK);if(L.length){g=geo();L.forEach(p=>{if(p.vtx===undefined&&!pick(p,g))return;
   if(p.vw>0){p._px=p.x;p._py=p.y;p._dx=p.dx;p.tx=p.x+1;p.ty=p.y}else{p.tx=p.vtx;p.ty=p.vty}})}}}catch(e){L=[]}
 const r=oU.apply(this,arguments);
 try{L.forEach(p=>{if(p.vtx===undefined)return;
  if(p.vw>0){p.x=p._px;p.y=p._py;p.dx=p._dx;p.mv=0;p.vw-=dt;p.tx=p.x+1;p.ty=p.y;return}
  const d=Math.hypot(p.vtx-p.x,p.vty-p.y),stuck=p.nopath&&T-p.nopath<.5;
  if(d<.5){p.vw=1+Math.random()*2.5;pick(p,g);p.tx=p.x+1;p.ty=p.y;return}
  if(stuck){p.nopath=0;pick(p,g)}p.tx=p.vtx;p.ty=p.vty})}catch(e){}
 return r};
})();
