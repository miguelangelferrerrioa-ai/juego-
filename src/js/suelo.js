/* Suelo en trozos: el borde del mapa, el terreno y los árboles/rocas que no están junto a edificios se pintan juntos en trozos
   de 1024×512 px (según el zoom) y en cada fotograma se dibujan ~6 trozos en vez del terreno + cientos de árboles.
   Medido en el móvil: apagar los árboles bajaba la GPU de ~15 a ~11 ms. Los trozos se pintan poco a poco (2 por fotograma);
   mientras falta uno, esa zona se dibuja como antes.
   Si cambia un árbol (talar, crecer) o un edificio deja de/empieza a tener árboles cerca, solo se rehacen los trozos de esa zona
   (antes se rehacían todos y daba tirones). El terreno entero solo se rehace si cambia el propio terreno (comprar parcelas…). */
(function(){
'use strict';
const PW=1024,PH=512,MAXC=28,C=new Map();let TS='',BS='',chkT=-1,ZS=0,ZT=-9,USE=0,budget=0,lastT=-1,ready=new Set(),GP=0;
const LZ=new WeakMap();let BK=new Map();
window.GROUND_ON=true;
/* huella del terreno: copia a 256×128 y suma de píxeles (lectura pequeña, solo cuando se repinta el terreno) */
let HC=null;window.tcHash=function(tc){try{if(!HC){HC=document.createElement('canvas');HC.width=256;HC.height=128}const x=HC.getContext('2d',{willReadFrequently:true});x.clearRect(0,0,256,128);x.drawImage(tc,0,0,256,128);const d=x.getImageData(0,0,256,128).data;let h=tc.width*7+tc.height;for(let i=0;i<d.length;i+=4)h=(h*31+d[i]*3+d[i+1]*5+d[i+2])%2147483647;return h}catch(e){return Math.random()}};
const q3=s=>Math.pow(2,Math.round(Math.log2(Math.max(.2,s))*3)/3);
const box=o=>{const p=P(o.x+.5,o.y+.5);return [p[0]-50,p[1]-90,p[0]+50,p[1]+20]};
const ok=o=>o.x+','+o.y+','+o.t+(o.l?'L':'');
/* árbol/roca "suelto": sin edificios ni muros a menos de 4 casillas ni charcas de aceite a menos de 5 */
function calcLoose(o){for(const b of S.bld){if(b.type==='road'||b.type==='bridge')continue;if(Math.abs(o.x-b.x-b.w/2)<=b.w/2+4&&Math.abs(o.y-b.y-b.h/2)<=b.h/2+4)return false}
 if(S.oil)for(const q of S.oil){if(Math.abs(o.x-q.x-1.5)<=5&&Math.abs(o.y-q.y-1.5)<=5)return false}return true}
function loose(o){const c=LZ.get(o);if(c&&c[0]===BS)return c[1];const v=calcLoose(o);LZ.set(o,[BS,v]);return v}
/* rect del mundo de un trozo a partir de su clave */
function rectOf(k){const [sc,i,j]=k.split(':').map(Number),W=PW/sc,H=PH/sc;return [i*W,j*H,i*W+W,j*H+H]}
/* se mira cada 250 ms si cambió algo: terreno → todo; árboles/edificios → solo las zonas tocadas */
function check(){const n=performance.now();if(n-chkT<250)return;chkT=n;
 const ts=(window.TCV|0)+'|'+(S.parc?S.parc.join(''):'');if(ts!==TS){TS=ts;C.clear()}
 let h=S.bld.length*7+S.obs.length+(S.oil?S.oil.length*1000:0);for(const b of S.bld)h=(h*31+b.x*7+b.y*13+b.w*3+b.h)%1e9;for(const q of (S.oil||[]))h=(h*17+q.x*5+q.y)%1e9;const bs=h+'';
 if(bs===BS)return;BS=bs;const nb=new Map();for(const o of S.obs)if(loose(o))nb.set(ok(o),o);
 const ch=[];for(const [k,o] of nb)if(!BK.has(k))ch.push(box(o));for(const [k,o] of BK)if(!nb.has(k))ch.push(box(o));BK=nb;
 if(!ch.length)return;for(const [k,e] of C){const r=rectOf(k);if(ch.some(b=>b[2]>=r[0]&&b[0]<=r[2]&&b[3]>=r[1]&&b[1]<=r[3]))e.dirty=true}}
/* cada trozo lleva 2 px de margen a la derecha y abajo: se solapa con el vecino sin estirarse (sin juntas) */const MG=2;
function paint(e,sc,i,j){GP++;const W=PW/sc,H=PH/sc,x0=i*W,y0=j*H,x1=x0+W+MG/sc,y1=y0+H+MG/sc;
 let cv=e&&e.cv;if(!cv){cv=document.createElement('canvas');cv.width=PW+MG;cv.height=PH+MG}const c=cv.getContext('2d');
 c.setTransform(1,0,0,1,0,0);c.fillStyle='#14210f';c.fillRect(0,0,PW+MG,PH+MG);c.setTransform(sc,0,0,sc,-x0*sc,-y0*sc);
 if(window.outerRegion)outerRegion(c,x0,y0,x1,y1,sc);
 const tx0=Math.max(x0,-N*32),ty0=Math.max(y0,0),tx1=Math.min(x1,N*32),ty1=Math.min(y1,TC?TC.height:0);if(TC&&tx1>tx0&&ty1>ty0)drawTiled(c,TC,window.TCV|0,N*32,0,1,tx0,ty0,tx1,ty1,sc);
 const os=[];for(const o of BK.values()){const b=box(o);if(b[2]<x0||b[0]>x1||b[3]<y0||b[1]>y1)continue;os.push(o)}
 os.sort((a,b)=>(a.x+a.y)-(b.x+b.y));for(const o of os)obsSpr(c,o);
 return {cv,dirty:false}}
const key=(sc,i,j)=>sc.toFixed(4)+':'+i+':'+j;
function put(k,e){C.delete(k);C.set(k,e);while(C.size>MAXC){const fk=C.keys().next().value;C.delete(fk)}}
window.groundDraw=function(c){if(T!==lastT){lastT=T;budget=2}ready=new Set();check();
 /* la escala de los trozos no depende del ajuste automático de calidad (QS): si no, cada ajuste los rehacía todos */const s=cam.z*dpr,sc=q3(cam.z*Math.min(1.5,devicePixelRatio||1));if(Math.abs(sc-ZS)>1e-6){ZS=sc;ZT=T}
 /* mientras cambia el zoom se usan los trozos del zoom anterior; los nuevos se pintan al parar 0,3 s */
 if(!USE)USE=sc;if(USE!==sc&&T-ZT>=.3)USE=sc;
 const W=PW/USE,H=PH/USE,vx0=cam.x-8,vy0=cam.y-8,vx1=cam.x+vw()/cam.z+8,vy1=cam.y+vh()/cam.z+8;
 const i0=Math.floor(vx0/W),i1=Math.floor(vx1/W),j0=Math.floor(vy0/H),j1=Math.floor(vy1/H),ov=1.2/s;
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=key(USE,i,j);let e=C.get(k);
  if((!e||e.dirty)&&budget>0&&USE===sc){budget--;e=paint(e,USE,i,j);put(k,e)}
  const x0=i*W,y0=j*H;
  /* un píxel de solape para que no se vean las juntas entre trozos */
  if(e){c.drawImage(e.cv,0,0,PW+MG,PH+MG,x0,y0,W+MG/USE,H+MG/USE);if(!e.dirty)ready.add(i+':'+j)}
  else{if(window.outerRegion)outerRegion(c,x0,y0,x0+W+ov,y0+H+ov,s);const tx0=Math.max(x0,-N*32),ty0=Math.max(y0,0),tx1=Math.min(x0+W+ov,N*32),ty1=Math.min(y0+H+ov,TC?TC.height:0);if(TC&&tx1>tx0&&ty1>ty0)drawTiled(c,TC,window.TCV|0,N*32,0,1,tx0,ty0,tx1,ty1,s)}}
 /* con cupo libre, se adelantan los trozos de alrededor */
 if(budget>0&&USE===sc)for(let j=j0-1;j<=j1+1&&budget>0;j++)for(let i=i0-1;i<=i1+1&&budget>0;i++){const k=key(USE,i,j),e=C.get(k);if(!e||e.dirty){budget--;put(k,paint(e,USE,i,j))}}
 G.W=W;G.H=H};
const G={W:1,H:1};
/* ¿este árbol ya está pintado en el suelo? (suelto y todos los trozos que toca están al día) */
window.groundHas=function(o){if(!loose(o))return false;const b=box(o),i0=Math.floor(b[0]/G.W),i1=Math.floor(b[2]/G.W),j0=Math.floor(b[1]/G.H),j1=Math.floor(b[3]/G.H);
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(!ready.has(i+':'+j))return false;return true};
window.groundStats=()=>({trozos:C.size,zoomUso:USE,pintados:GP,firma:BS});
})();
