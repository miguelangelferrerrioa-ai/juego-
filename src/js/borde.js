/* Borde del mapa: anillo de bosque decorativo (como en Clash of Clans) con las carreteras abandonadas que salen del mapa.
   Es solo decoración: se pinta una vez en un lienzo a media resolución y no interviene en el juego. */
(function(){
'use strict';
const OM=16,SC=.5,W0=(N+2*OM)*32,TY=2*OM*16;
let OC=null;
const road=(x,y)=>((y===42||y===43)&&(x<0||x>=N))||((x===43||x===44)&&(y<0||y>=N));
const dist=(x,y)=>Math.max(-x,-y,x-(N-1),y-(N-1));
function build(){
  const cv=document.createElement('canvas');cv.width=Math.round(W0*2*SC);cv.height=Math.round(((N+2*OM)*32+40)*SC);
  const c=cv.getContext('2d');c.scale(SC,SC);c.translate(W0,TY);
  const tiles=[];for(let x=-OM;x<N+OM;x++)for(let y=-OM;y<N+OM;y++){if(x>=0&&y>=0&&x<N&&y<N)continue;tiles.push([x,y])}
  tiles.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[0]-b[0]);
  const fade=d=>Math.max(0,Math.min(1,(d-(OM-6))/6));
  // suelo: el bioma del borde del mapa continúa hacia fuera (agua, montaña, playa...) y se oscurece/convierte en bosque a lo lejos
  const oB=window.biomeAt,oW=window.waterD,cc=v=>Math.max(0,Math.min(N-1,v));
  const smp=(x,y)=>{if(x>=0&&y>=0&&x<N&&y<N)return[x,y];const j=Math.round((nh(x*3+1,y*5+2)-.5)*3);return(x<0||x>=N)&&(y<0||y>=N)?[cc(x),cc(y)]:(x<0||x>=N?[cc(x),cc(y+j)]:[cc(x+j),cc(y)])};
  window.biomeAt=(x,y)=>{if(x>=0&&y>=0&&x<N&&y<N)return oB(x,y);const q=smp(x,y);return oB(q[0],q[1])};
  window.waterD=(x,y)=>{if(x>=0&&y>=0&&x<N&&y<N)return oW(x,y);const q=smp(x,y);return oW(q[0],q[1])};
  try{
  tiles.forEach(([x,y])=>{const d=dist(x,y),f=fade(d),p=P(x,y);
    tile(c,p,x,y,false);
    const w=1-Math.min(1,d/12)*.55;c.globalCompositeOperation='lighter';c.fillStyle='rgb('+Math.round(27*w)+','+Math.round(26*w)+','+Math.round(12*w)+')';dia(c,p);c.fill();c.globalCompositeOperation='source-over';   // el suelo de dentro es algo más claro: se iguala junto al borde
    c.fillStyle='rgba(5,9,6,'+Math.min(1,f*1.05)+')';dia(c,p);c.fill()});
  }finally{window.biomeAt=oB;window.waterD=oW}
  const BIOX={};tiles.forEach(([x,y])=>{const q=smp(x,y);BIOX[x+','+y]=oB(q[0],q[1])});
  // mismo acabado de color que el terreno del mapa (calidez, grano y degradado), para que no parezcan dos mapas distintos
  {const a=P(-OM,-OM),b=P(N+OM,-OM),d=P(N+OM,N+OM),e=P(-OM,N+OM),X0=-W0,Wd=2*W0,Y0=a[1],Hh=e[1]-a[1]+40;
   c.save();c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.clip();
   c.globalCompositeOperation='lighter';c.fillStyle='rgb(26,28,10)';c.fillRect(X0,Y0,Wd,Hh);
   c.globalCompositeOperation='multiply';c.fillStyle='rgba(255,236,200,.2)';c.fillRect(X0,Y0,Wd,Hh);
   const nz=document.createElement('canvas');nz.width=nz.height=96;{const n=nz.getContext('2d'),im=n.createImageData(96,96);for(let i=0;i<im.data.length;i+=4){const v=60+Math.random()*135;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}n.putImageData(im,0,0)}
   c.globalCompositeOperation='overlay';c.globalAlpha=.05;c.fillStyle=c.createPattern(nz,'repeat');c.fillRect(X0,Y0,Wd,Hh);c.globalAlpha=1;
   c.globalCompositeOperation='soft-light';const g=c.createLinearGradient(0,Y0,0,Y0+Hh);g.addColorStop(0,'rgba(255,214,120,.35)');g.addColorStop(1,'rgba(40,70,80,.3)');c.fillStyle=g;c.fillRect(X0,Y0,Wd,Hh);c.restore()}
  // carreteras abandonadas que continúan las del mapa
  let wr=0;
  tiles.forEach(([x,y])=>{if(!road(x,y))return;const p=P(x,y),d=dist(x,y),f=fade(d);
    dia(c,p);c.fillStyle='rgba(78,79,72,'+(.95*(1-f*.6))+')';c.fill();
    c.strokeStyle='rgba(232,184,70,'+(.7*(1-f))+')';c.lineWidth=2;c.setLineDash([7,7]);c.beginPath();
    if(y===42){c.moveTo(p[0]-32,p[1]+16);c.lineTo(p[0],p[1]+32)}else if(x===43){c.moveTo(p[0]+32,p[1]+16);c.lineTo(p[0],p[1]+32)}c.stroke();c.setLineDash([]);
    if(nh(x,y*3)>.7){c.strokeStyle='rgba(17,20,18,.8)';c.lineWidth=1;c.beginPath();c.moveTo(p[0]-8,p[1]+11);c.lineTo(p[0]-2,p[1]+17);c.lineTo(p[0]+5,p[1]+14);c.stroke()}
    // maleza que va tapando el asfalto cuanto más lejos
    const gr=Math.min(.7,d*.05+(nh(x*5,y*9)>.6?.15:0));c.fillStyle='rgba(60,92,34,'+gr+')';c.beginPath();c.ellipse(p[0]+(hh(x,y)-.5)*26,p[1]+16+(hh(y,x)-.5)*10,10+hh(x+1,y)*10,4+hh(x,y+1)*3,0,0,7);c.fill();
  });
  // árboles y alguna roca, en orden de profundidad (con los coches abandonados entre medias)
  tiles.forEach(([x,y])=>{const d=dist(x,y),f=fade(d),rd=road(x,y);
    if(rd){if(d>2&&d<OM-3&&nh(x*7,y*13)>.93&&wr<14){wr++;wreckD(c,P(x,y),x+y)}return}
    for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)if(road(x+i,y+j))return;   // pasillo despejado a ambos lados de la carretera
    const bo=BIOX[x+','+y],n=nh(x*3,y*5);
    if(bo==='water'||bo==='beach')return;
    if(bo==='mountain'){const m=nh(x*7,y*13);if(m>.56){const sz=Math.min(1,Math.max(0,(fbm(x*.17+4,y*.17+2)-.3)*2.2));c.globalAlpha=1-f*.8;peakD(c,P(x,y),sz,m);c.globalAlpha=1}else if(n>.8&&d<OM-2){c.globalAlpha=1-f*.85;obsSpr(c,{x:x,y:y,t:'s'});c.globalAlpha=1}return}
    const base=bo==='forest'?.18:Math.max(.18,.62-d*.07),ramp=Math.max(0,1-(d-1)/13),th=base+(1-base)*Math.pow(ramp,1.4);   // sin árboles junto al mapa y cada vez más bosque hacia fuera   // otros biomas: arbolado ralo cerca del mapa que se cierra en bosque
    if(n<th)return;const k=(n<.7||d<8)?1:2;
    c.globalAlpha=1-f*.85;
    for(let i=0;i<k;i++){const ox=.15+nh(x+i*17,y*2)*.7,oy=.15+nh(x*2,y+i*23)*.7;
      if(n>.965&&i===0)obsSpr(c,{x:x+ox-.5,y:y+oy-.5,t:'s'});else obsSpr(c,{x:x+ox-.5,y:y+oy-.5,t:'t'})}
    c.globalAlpha=1});
  return cv}
window.outerWarm=()=>{if(!OC)OC=build()};
window.drawOuter=function(c){
  if(!OC)OC=build();const w=vw()/cam.z,h=vh()/cam.z,ymax=OC.height/SC-TY;
  const x0=Math.max(cam.x-4,-W0),y0=Math.max(cam.y-4,-TY),x1=Math.min(cam.x+w+4,W0),y1=Math.min(cam.y+h+4,ymax);
  if(x1>x0&&y1>y0){if(window.drawTiled)drawTiled(c,OC,1,W0,TY,SC,x0,y0,x1,y1,cam.z*dpr);else c.drawImage(OC,(x0+W0)*SC,(y0+TY)*SC,(x1-x0)*SC,(y1-y0)*SC,x0,y0,x1-x0,y1-y0)}};
/* la cámara no puede salirse del rombo del borde: así nunca se ve el vacío negro (el final del borde es niebla densa) */
window.outerClamp=function(){
  const HW=(N+2*OM)*32,HH=(N+2*OM)*16,CY=N*16,LIM=.985,ok=(x,y)=>Math.abs(x)/HW+Math.abs(y-CY)/HH<=LIM;
  const tb=document.getElementById('top'),TI=(tb?tb.offsetHeight:0)+4;   // la barra superior tapa parte de la pantalla: esa franja puede salirse del límite
  const fits=(cx,cy,w,h)=>{const t=cy-h/2+TI/cam.z;return ok(cx-w/2,t)&&ok(cx+w/2,t)&&ok(cx-w/2,cy+h/2)&&ok(cx+w/2,cy+h/2)};
  let w=vw()/cam.z,h=vh()/cam.z,g=0;
  while(!fits(0,CY,w,h)&&g++<40){cam.z*=1.04;w=vw()/cam.z;h=vh()/cam.z}   // si la vista no cabe, se acerca el zoom
  let cx=cam.x+w/2,cy=cam.y+h/2;const L=window._oc;
  if(!fits(cx,cy,w,h)){
    if(L&&L.z===cam.z&&L.w===w&&fits(L.cx,L.cy,w,h)){
      // pared invisible: se avanza todo lo posible y se desliza a lo largo del límite, sin tirar hacia atrás
      const along=(ax,ay,bx,by)=>{let lo=0,hi=1;for(let i=0;i<14;i++){const m=(lo+hi)/2;if(fits(ax+(bx-ax)*m,ay+(by-ay)*m,w,h))lo=m;else hi=m}return[ax+(bx-ax)*lo,ay+(by-ay)*lo]};
      const cand=[];
      if(fits(cx,L.cy,w,h))cand.push(along(cx,L.cy,cx,cy));else cand.push(along(L.cx,L.cy,cx,L.cy));
      if(fits(L.cx,cy,w,h))cand.push(along(L.cx,cy,cx,cy));else cand.push(along(L.cx,L.cy,L.cx,cy));
      cand.push(along(L.cx,L.cy,cx,cy));
      let best=cand[0],bd=-1;cand.forEach(q=>{const d=Math.hypot(q[0]-L.cx,q[1]-L.cy);if(d>bd){bd=d;best=q}});
      cx=best[0];cy=best[1];
    }else{let lo=0,hi=1;for(let i=0;i<14;i++){const m=(lo+hi)/2;if(fits(m*cx,CY+m*(cy-CY),w,h))lo=m;else hi=m}cx*=lo;cy=CY+lo*(cy-CY)}
  }
  cam.x=cx-w/2;cam.y=cy-h/2;window._oc={cx,cy,z:cam.z,w}};
window.outerBounds={x0:-W0,x1:W0,y0:-TY,y1:((N+2*OM)*32+40)-TY};
})();
