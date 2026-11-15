/* Rutas de los supervivientes: rodean muros y edificios y cruzan las puertas; si no hay paso, se cuelan entre los edificios en línea recta. */
(function(){
'use strict';
let PV=0;const oRb=window.rebuild;
window.rebuild=function(){PV++;return oRb.apply(this,arguments)};
const WKP=t=>t=='road'||t=='trap'||t=='bridge'||t=='gate';   // los supervivientes sí cruzan las puertas
const blocked0=(x,y)=>{if(x<0||y<0||x>=N||y>=N)return true;const o=occ[y*N+x];if(!(o>0))return false;const b=bm[o];return!!b&&!WKP(b.type)};
/* rejilla de casillas bloqueadas en caché (se rehace si cambia el mapa o cada 0,3 s) */
let BG=null,BGN=0,BGT=-1,BGV=-1,BGO=null;
function grid(){if(!BG||BGN!==N||BGV!==PV||BGO!==occ||Math.abs(T-BGT)>.3){if(!BG||BGN!==N){BG=new Uint8Array(N*N);BGN=N}for(let y=0;y<N;y++)for(let x=0;x<N;x++)BG[y*N+x]=blocked0(x,y)?1:0;BGT=T;BGV=PV;BGO=occ}return BG}
const blocked=(x,y)=>{if(x<0||y<0||x>=N||y>=N)return true;return grid()[y*N+x]===1};
let PREV=null,Q=null,STAMP=null,GEN=0;
function clear(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.ceil(d/.35));for(let i=1;i<=n;i++){const t=i/n;if(blocked(Math.floor(x0+(x1-x0)*t),Math.floor(y0+(y1-y0)*t)))return false}return true}
const DX=[1,-1,0,0,1,1,-1,-1],DY=[0,0,1,-1,1,-1,1,-1];
function nearFree(x,y,fx,fy){let best=null,bd=1e9;for(let r=1;r<=6&&!best;r++){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const nx=x+dx,ny=y+dy;if(blocked(nx,ny))continue;const d=fx===undefined?Math.hypot(dx,dy):Math.hypot(dx,dy)*2+Math.hypot(nx-fx,ny-fy)*.01;if(d<bd){bd=d;best=[nx,ny]}}}return best}
function bfs(sx,sy,gx,gy){ // camino por casillas (8 direcciones, sin cortar esquinas); null si no hay paso
  if(sx===gx&&sy===gy)return[];if(blocked(gx,gy)){ // si el destino es un edificio, vale llegar a la casilla libre más cercana (también en edificios grandes)
    const best=nearFree(gx,gy,sx,sy);if(!best)return null;gx=best[0];gy=best[1];if(sx===gx&&sy===gy)return[]}
  if(!PREV||PREV.length!==N*N){PREV=new Int32Array(N*N);Q=new Int32Array(N*N);STAMP=new Uint32Array(N*N);GEN=0}if(++GEN>4e9){STAMP.fill(0);GEN=1}const prev=PREV,q=Q,G=grid();let h=0,t=0;const s=sy*N+sx,g=gy*N+gx;prev[s]=s;STAMP[s]=GEN;q[t++]=s;
  while(h<t){const c=q[h++];if(c===g)break;const cx=c%N,cy=(c/N)|0;
    for(let k=0;k<8;k++){const nx=cx+DX[k],ny=cy+DY[k];if(nx<0||ny<0||nx>=N||ny>=N)continue;const n=ny*N+nx;if(STAMP[n]===GEN||G[n])continue;
      if(k>=4&&(G[cy*N+nx]||G[ny*N+cx]))continue;prev[n]=c;STAMP[n]=GEN;q[t++]=n}}
  if(STAMP[g]!==GEN)return null;const out=[];for(let c=g;c!==s;c=prev[c])out.push([(c%N)+.5,((c/N)|0)+.5]);return out.reverse()}
/* Devuelve true si se ha movido o está en camino; false si no hay ningún paso hasta el destino. */
window.pstep=function(p,tx,ty,s){
  s*=terrMul(p.x,p.y);let sx=Math.floor(p.x),sy=Math.floor(p.y);const gx=Math.floor(tx),gy=Math.floor(ty);
  /* si se ha quedado dentro de un edificio (p. ej. construido encima), sale a la casilla libre más cercana */
  /* (no si está cruzando un edificio a propósito porque no hay camino: si no, lo devolvía al hueco del que intentaba salir y se quedaba atrapado para siempre) */
  if(blocked(sx,sy)&&!(sx===gx&&sy===gy)&&!(p.thru&&T-p.thru<1.5)){const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,c])=>!blocked(sx+a,sy+c));if(!nb){const f=nearFree(sx,sy);if(f){p.x=f[0]+.5;p.y=f[1]+.5;sx=f[0];sy=f[1];p.path=null;p.pk=null}}}
  let wx=tx,wy=ty;
  if(!clear(p.x,p.y,tx,ty)){
    const key=gx+','+gy+'|'+PV;
    if(p.pk!==key||!p.path){const near=p.path&&p.pg&&p.pv===PV&&Math.abs(p.pg[0]-gx)+Math.abs(p.pg[1]-gy)<=2&&T-(p.pT||0)<.6;if(!near){p.pk=key;p.path=bfs(sx,sy,gx,gy);p.pg=[gx,gy];p.pv=PV;p.pT=T}}
    if(!p.path){/* sin camino: pasa entre los edificios en línea recta para no quedarse atascado */p.pk=null;p.thru=T;const d0=Math.hypot(tx-p.x,ty-p.y);if(d0<.01)return true;const k0=Math.min(1,s/d0);p.x+=(tx-p.x)*k0;p.y+=(ty-p.y)*k0;p.dx=tx-p.x;return true}
    while(p.path.length&&Math.hypot(p.path[0][0]-p.x,p.path[0][1]-p.y)<.28)p.path.shift();
    if(!p.path.length){wx=tx;wy=ty}else{wx=p.path[0][0];wy=p.path[0][1]}
  }else p.path=null,p.pk=null;
  const d=Math.hypot(wx-p.x,wy-p.y);if(d<.01)return true;const k=Math.min(1,s/d);p.x+=(wx-p.x)*k;p.y+=(wy-p.y)*k;p.dx=wx-p.x;return true};
window.pathBlocked=blocked;
})();
