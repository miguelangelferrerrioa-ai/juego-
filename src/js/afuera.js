/* Las hordas y los zombis sueltos aparecen en el borde del mapa. Si ese borde ya es parte de tu territorio (parcelas compradas)
   o hay edificios cerca, el zombi se lleva al punto del borde libre más cercano, lejos de lo construido (antes aparecían dentro de la base). */
(function(){
'use strict';
const near=(x,y)=>{let m=1e9;for(const b of S.bld){if(b.type==='road'||b.type==='bridge')continue;const dx=Math.max(b.x-x,0,x-(b.x+b.w)),dy=Math.max(b.y-y,0,y-(b.y+b.h));const d=Math.hypot(dx,dy);if(d<m)m=d}return m};
const bad=(x,y)=>(typeof ownP==='function'&&ownP(x,y))||near(x,y)<8;
let PTS=null,PK='';
function cands(){let k=S.bld.length+'|'+(S.parc?S.parc.join(''):'');for(const b of S.bld)k+=b.x+b.y;if(PK===k&&PTS)return PTS;PK=k;const L=[];
 for(let i=1.5;i<N-1.5;i+=1.5){for(const [x,y] of [[i,1.2],[i,N-1.2],[1.2,i],[N-1.2,i]]){const own=typeof ownP==='function'&&ownP(x,y);L.push({x,y,d:near(x,y),own})}}
 PTS=L;return L}
function pick(x,y){const L=cands();let best=null,bs=-1e9;for(const p of L){const ok=!p.own&&p.d>=10;const s=(ok?1e6:0)+(ok?-Math.hypot(p.x-x,p.y-y):p.d*10-(p.own?1e5:0));if(s>bs){bs=s;best=p}}return best}
const oU=window.upd;
window.upd=function(dt){try{if(typeof Z!=='undefined'&&Z.length&&S&&S.bld){const moved=[];for(const z of Z){if(z._sp)continue;z._sp=1;if(!z.act)continue;
  const edge=z.x<2.6||z.y<2.6||z.x>N-2.6||z.y>N-2.6;if(!edge||!bad(z.x,z.y))continue;
  /* los que salían juntos se llevan juntos */let g=moved.find(m=>Math.hypot(m.ox-z.x,m.oy-z.y)<6);if(!g){const p=pick(z.x,z.y);if(!p)continue;g={ox:z.x,oy:z.y,p};moved.push(g)}
  let nx=g.p.x,ny=g.p.y;for(let k=0;k<6;k++){const ax=Math.max(.6,Math.min(N-.6,g.p.x+(Math.random()-.5)*3)),ay=Math.max(.6,Math.min(N-.6,g.p.y+(Math.random()-.5)*3));if(!(typeof ownP==='function'&&ownP(ax,ay))&&near(ax,ay)>=8){nx=ax;ny=ay;break}}z.x=nx;z.y=ny;z.tg=0;z.tx=0}}}catch(e){}return oU.apply(this,arguments)};
try{upd=window.upd}catch(e){}
window.spawnSafe=pick;
})();
