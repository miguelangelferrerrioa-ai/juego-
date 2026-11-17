/* Suelo en trozos: el borde del mapa, el terreno y los árboles/rocas que no están junto a edificios se pintan juntos en trozos
   de 1024×512 px (según el zoom) y en cada fotograma se dibujan ~6 trozos en vez del terreno + cientos de árboles.
   Medido en el móvil: apagar los árboles bajaba la GPU de ~15 a ~11 ms. Los trozos se rehacen poco a poco (2 por fotograma)
   al cambiar el zoom, construir o talar; mientras falta uno, esa zona se dibuja como antes. */
(function(){
'use strict';
const PW=1024,PH=512,MAXC=28,C=new Map();let SIG='',sigT=-1,ZS=0,ZT=-9,USE=0,budget=0,lastT=-1,ready=new Set(),bakedSet=new WeakMap();
window.GROUND_ON=true;
const q3=s=>Math.pow(2,Math.round(Math.log2(Math.max(.2,s))*3)/3);
function sig(){const n=performance.now();if(n-sigT<250)return SIG;sigT=n;let h=S.bld.length*7+S.obs.length+(S.oil?S.oil.length*1000:0);for(const b of S.bld)h=(h*31+b.x*7+b.y*13+b.w*3+b.h)%1e9;SIG=h+'|'+(window.TCV|0)+'|'+(S.parc?S.parc.join(''):'');return SIG}
/* árbol/roca "suelto": sin edificios ni muros a menos de 4 casillas (los de cerca se siguen ordenando con los edificios) */
function loose(o,sg){const c=bakedSet.get(o);if(c&&c[0]===sg)return c[1];let ok=true;for(const b of S.bld){if(b.type==='road'||b.type==='bridge')continue;if(Math.abs(o.x-b.x-b.w/2)<=b.w/2+4&&Math.abs(o.y-b.y-b.h/2)<=b.h/2+4){ok=false;break}}/* tampoco los de junto a una charca de aceite (la charca se pinta encima del suelo) */if(ok&&S.oil)for(const q of S.oil){if(Math.abs(o.x-q.x-1.5)<=5&&Math.abs(o.y-q.y-1.5)<=5){ok=false;break}}bakedSet.set(o,[sg,ok]);return ok}
const box=o=>{const p=P(o.x+.5,o.y+.5);return [p[0]-50,p[1]-90,p[0]+50,p[1]+20]};
function paint(e,sc,i,j,sg){const W=PW/sc,H=PH/sc,x0=i*W,y0=j*H,x1=x0+W,y1=y0+H;
 let cv=e&&e.cv;if(!cv){cv=document.createElement('canvas');cv.width=PW;cv.height=PH}const c=cv.getContext('2d');
 c.setTransform(1,0,0,1,0,0);c.fillStyle='#14210f';c.fillRect(0,0,PW,PH);c.setTransform(sc,0,0,sc,-x0*sc,-y0*sc);
 if(window.outerRegion)outerRegion(c,x0,y0,x1,y1,sc);
 const tx0=Math.max(x0,-N*32),ty0=Math.max(y0,0),tx1=Math.min(x1,N*32),ty1=Math.min(y1,TC?TC.height:0);if(TC&&tx1>tx0&&ty1>ty0)drawTiled(c,TC,window.TCV|0,N*32,0,1,tx0,ty0,tx1,ty1,sc);
 const os=[];for(const o of S.obs){if(!loose(o,sg))continue;const b=box(o);if(b[2]<x0||b[0]>x1||b[3]<y0||b[1]>y1)continue;os.push(o)}
 os.sort((a,b)=>(a.x+a.y)-(b.x+b.y));const pd=window.dpr;for(const o of os)obsSpr(c,o);
 return {cv,sg,t:T}}
function key(sc,i,j){return sc.toFixed(3)+':'+i+':'+j}
/* dibuja el suelo visible; devuelve nada */
window.groundDraw=function(c){if(T!==lastT){lastT=T;budget=2}ready=new Set();
 const s=cam.z*dpr,sc=q3(s);if(Math.abs(sc-ZS)>1e-6){ZS=sc;ZT=T}
 /* mientras cambia el zoom se usan los trozos del zoom anterior; los nuevos se pintan al parar 0,3 s */
 if(!USE)USE=sc;if(USE!==sc&&T-ZT>=.3)USE=sc;
 const sg=sig(),W=PW/USE,H=PH/USE,vx0=cam.x-8,vy0=cam.y-8,vx1=cam.x+vw()/cam.z+8,vy1=cam.y+vh()/cam.z+8;
 const i0=Math.floor(vx0/W),i1=Math.floor(vx1/W),j0=Math.floor(vy0/H),j1=Math.floor(vy1/H);
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=key(USE,i,j);let e=C.get(k);
  if((!e||e.sg!==sg)&&budget>0&&USE===sc){budget--;e=paint(e,USE,i,j,sg);C.delete(k);C.set(k,e);while(C.size>MAXC){const fk=C.keys().next().value;C.delete(fk)}}
  const x0=i*W,y0=j*H;
  if(e){c.drawImage(e.cv,0,0,PW,PH,x0,y0,W,H);if(e.sg===sg)ready.add(i+':'+j)}
  else{/* trozo aún sin pintar: esta zona se dibuja como antes */if(window.outerRegion)outerRegion(c,x0,y0,x0+W,y0+H,s);const tx0=Math.max(x0,-N*32),ty0=Math.max(y0,0),tx1=Math.min(x0+W,N*32),ty1=Math.min(y0+H,TC?TC.height:0);if(TC&&tx1>tx0&&ty1>ty0)drawTiled(c,TC,window.TCV|0,N*32,0,1,tx0,ty0,tx1,ty1,s)}}
 /* con cupo libre, se adelantan los trozos de alrededor */
 if(budget>0&&USE===sc)for(let j=j0-1;j<=j1+1&&budget>0;j++)for(let i=i0-1;i<=i1+1&&budget>0;i++){const k=key(USE,i,j),e=C.get(k);if(!e||e.sg!==sg){budget--;const n=paint(e,USE,i,j,sg);C.delete(k);C.set(k,n);while(C.size>MAXC){const fk=C.keys().next().value;C.delete(fk)}}}
 G.W=W;G.H=H;G.sg=sg};
const G={W:1,H:1,sg:''};
/* ¿este árbol ya está pintado en el suelo? (suelto y todos los trozos que toca están al día) */
window.groundHas=function(o){if(!loose(o,G.sg))return false;const b=box(o),i0=Math.floor(b[0]/G.W),i1=Math.floor(b[2]/G.W),j0=Math.floor(b[1]/G.H),j1=Math.floor(b[3]/G.H);
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(!ready.has(i+':'+j))return false;return true};
window.groundStats=()=>({trozos:C.size,zoomUso:USE});
})();
