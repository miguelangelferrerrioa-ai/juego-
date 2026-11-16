/* ===================================================================
   DEAD TOWN · Interfaz 3.0
   - Pantallas completas con mapa isométrico real (misiones y territorio)
   - Árbol de investigación en red (estilo Plague Inc)
   - Formar familia (antes "Sistema de parejas") con fichas compactas
   =================================================================== */
(function(){
'use strict';
const $=i=>document.getElementById(i);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const TAU=Math.PI*2;

/* ---------------------------------------------------------------
   Overlay de pantalla completa
---------------------------------------------------------------- */
const fs=document.createElement('div');fs.id='fs';
fs.innerHTML='<div class="fs-head"><div class="fs-ttl"></div><div class="fs-tools"></div><button class="panel-x" onclick="fsClose()" aria-label="Cerrar">✕</button></div><div class="fs-body"></div>';
document.body.appendChild(fs);
const fsT=fs.querySelector('.fs-ttl'),fsTools=fs.querySelector('.fs-tools'),fsB=fs.querySelector('.fs-body');
let tok=0,cur='',VW=null,infoEl=null,raf=0;
const isOpen=()=>fs.style.display==='flex';

window.fsClose=function(){tok++;cancelAnimationFrame(raf);fs.style.display='none';fsB.innerHTML='';fsTools.innerHTML='';cur='';VW=null;infoEl=null};
const _show=window.show;
window.show=function(){if(isOpen())window.fsClose();return _show.apply(this,arguments)};

function fsOpen(kind,title,sub){
  if(typeof hide==='function')hide();
  tok++;cancelAnimationFrame(raf);cur=kind;
  fs.style.display='flex';
  fsT.innerHTML=title+'<small>'+(sub||'')+'</small>';
  fsB.innerHTML='';
  fsTools.innerHTML='<button onclick="fsZoom(1.35)" title="Acercar">＋</button><button onclick="fsZoom(1/1.35)" title="Alejar">－</button><button onclick="fsFit()">Ajustar</button><button onclick="fsInfoToggle()">Ficha</button>';
  const cv=document.createElement('canvas');cv.className='fs-cv';fsB.appendChild(cv);
  infoEl=document.createElement('div');infoEl.className='fs-info';fsB.appendChild(infoEl);
  return cv;
}
window.fsZoom=f=>{if(VW)VW.zoom(f,VW.w/2-VW.padR()/2,VW.h/2)};
window.fsFit=()=>{if(VW)VW.reset()};
window.fsInfoToggle=()=>{if(infoEl){infoEl.classList.toggle('hide');if(VW)VW.reset()}};

/* ---------------------------------------------------------------
   Visor con zoom y desplazamiento (ratón, táctil y pellizco)
---------------------------------------------------------------- */
function viewer(cv,o){
  const V={k:1,k0:1,tx:0,ty:0,w:10,h:10,dpr:1,t:0,ctx:cv.getContext('2d'),hits:[]};
  const my=tok;
  V.padR=()=>(infoEl&&!infoEl.classList.contains('hide'))?Math.min(272,V.w*.38)+14:0;
  V.s=(x,y)=>[x*V.k+V.tx,y*V.k+V.ty];
  V.inv=(x,y)=>[(x-V.tx)/V.k,(y-V.ty)/V.k];
  V.size=()=>{const r=cv.getBoundingClientRect();if(!r.width)return;V.dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(r.width*V.dpr);cv.height=Math.round(r.height*V.dpr);V.w=r.width;V.h=r.height};
  V.reset=()=>{V.size();const aw=V.w-V.padR(),ah=V.h;V.k0=Math.min(aw/o.w,ah/o.h)*(o.fill||1);V.k=V.k0;V.tx=(aw-o.w*V.k)/2;V.ty=(ah-o.h*V.k)/2;if(o.top)V.ty=Math.max(V.ty,o.top);if(o.left!=null)V.tx=Math.max(V.tx,o.left)};
  V.clampPan=()=>{const m=60;V.tx=clamp(V.tx,V.w*.15-o.w*V.k,V.w*.85);V.ty=clamp(V.ty,V.h*.15-o.h*V.k,V.h*.85)};
  V.zoom=(f,cx,cy)=>{const nk=clamp(V.k*f,V.k0*.85,V.k0*(o.maxZ||6));f=nk/V.k;V.tx=cx-(cx-V.tx)*f;V.ty=cy-(cy-V.ty)*f;V.k=nk;V.clampPan()};
  const P=new Map();let moved=0,t0=0,pd=0;
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===1){moved=0;t0=performance.now()}if(P.size===2){const a=[...P.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
  cv.addEventListener('pointermove',e=>{if(!P.has(e.pointerId))return;const old=P.get(e.pointerId),r=cv.getBoundingClientRect();
    if(P.size===1){const dx=e.clientX-old[0],dy=e.clientY-old[1];moved+=Math.abs(dx)+Math.abs(dy);V.tx+=dx;V.ty+=dy;V.clampPan()}
    else if(P.size===2){P.set(e.pointerId,[e.clientX,e.clientY]);const a=[...P.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pd>0)V.zoom(d/pd,(a[0][0]+a[1][0])/2-r.left,(a[0][1]+a[1][1])/2-r.top);pd=d;moved+=20}
    P.set(e.pointerId,[e.clientX,e.clientY])});
  const up=e=>{const was=P.size;P.delete(e.pointerId);if(was===1&&moved<10&&performance.now()-t0<600&&e.type==='pointerup'){const r=cv.getBoundingClientRect();o.click&&o.click(e.clientX-r.left,e.clientY-r.top,V)}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();V.zoom(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top)},{passive:false});
  let last=0;
  const loop=ts=>{if(my!==tok||!isOpen())return;if(ts-last>28){last=ts;V.t=ts/1000;const c=V.ctx;c.setTransform(V.dpr,0,0,V.dpr,0,0);V.hits=[];try{o.draw(c,V)}catch(err){console.error(err)}}raf=requestAnimationFrame(loop)};
  new ResizeObserver(()=>{if(my===tok){const a=V.k/V.k0;V.size()}}).observe(cv);
  V.reset();V.reset();raf=requestAnimationFrame(loop);
  return V;
}

/* ---------------------------------------------------------------
   Utilidades de color y dibujo
---------------------------------------------------------------- */
function rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hex(a){return'#'+a.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')}
function shade(h,f){const a=rgb(h);return hex(a.map(v=>f>=1?v+(255-v)*(f-1):v*f))}
function mix(a,b,t){const x=rgb(a),y=rgb(b);return hex(x.map((v,i)=>v+(y[i]-v)*t))}
function poly(c,pts,fill,stroke,lw){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.lineWidth=lw||1;c.strokeStyle=stroke;c.stroke()}}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function plate(c,x,y,txt,o){o=o||{};c.save();c.font='800 '+(o.fs||10)+'px Bahnschrift,Oswald,"Arial Narrow",system-ui,sans-serif';const w=c.measureText(txt).width+14,h=(o.fs||10)+8;
  rrect(c,x-w/2,y-h/2,w,h,3);c.fillStyle=o.bg||'rgba(8,11,12,.86)';c.fill();c.lineWidth=1;c.strokeStyle=o.line||'#7c8b8f';c.stroke();
  c.fillStyle=o.col||'#e9ece6';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x,y+.5);c.restore()}
function box(c,x,y,hw,hd,h,top,left,right){ // x,y = centro del suelo
  poly(c,[[x-hw,y-h],[x,y-h+hd],[x,y+hd],[x-hw,y]],left);
  poly(c,[[x+hw,y-h],[x,y-h+hd],[x,y+hd],[x+hw,y]],right);
  poly(c,[[x,y-h-hd],[x+hw,y-h],[x,y-h+hd],[x-hw,y-h]],top)}

/* ---------------------------------------------------------------
   Terreno isométrico real (mismo mapa que el pueblo)
---------------------------------------------------------------- */
const A=8,TW=N*2*A,TH=N*A+70,OX=TW/2,OY=34;
const gx=(i,j)=>(i-j)*A+OX,gy=(i,j)=>(i+j)*A/2+OY;
let TC=null;
function terrain(){
  if(TC)return TC;
  const c=document.createElement('canvas');c.width=TW;c.height=TH;const x=c.getContext('2d');
  const H=(i,j)=>hh(i*3+1,j*5+2);
  for(let s=0;s<2*N-1;s++){
    for(let i=Math.max(0,s-N+1);i<=Math.min(s,N-1);i++){
      const j=s-i,b=biomeAt(i,j),pb=PBIO[b]||PBIO.meadow,sx=gx(i,j),sy=gy(i,j);
      const r=hh(i,j),f=.86+r*.22+((fbm?(fbm(i*.12,j*.12)-.5):0)*.35);
      let col=shade(pb[1],f);
      poly(x,[[sx,sy],[sx+A,sy+A/2],[sx,sy+A],[sx-A,sy+A/2]],col);
      if(b==='water'){x.strokeStyle='rgba(215,245,250,.28)';x.lineWidth=1;if(r<.35){x.beginPath();x.moveTo(sx-4,sy+A/2);x.lineTo(sx+1,sy+A/2);x.stroke()}}
      const cx=sx,cy=sy+A/2+1,h2=H(i,j);
      if(b==='forest'&&h2<.62){const s2=3.4+h2*2.6;x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.ellipse(cx+1,cy+1,s2*.9,s2*.45,0,0,TAU);x.fill();
        x.fillStyle='#1d3a20';x.beginPath();x.moveTo(cx,cy-s2*2.5);x.lineTo(cx+s2,cy);x.lineTo(cx-s2,cy);x.fill();x.fillStyle='#336b35';x.beginPath();x.moveTo(cx,cy-s2*2.5);x.lineTo(cx+s2,cy);x.lineTo(cx+s2*.15,cy);x.fill()}
      else if(b==='meadow'&&h2<.05){x.fillStyle='#5e3f22';x.fillRect(cx-.7,cy-2,1.4,3);x.fillStyle='#3f7a35';x.beginPath();x.arc(cx,cy-4,3.3,0,TAU);x.fill();x.fillStyle='#58a047';x.beginPath();x.arc(cx-.8,cy-4.8,1.8,0,TAU);x.fill()}
      else if(b==='mountain'&&h2<.55){const w=4.5+h2*5,hgt=8+h2*14;poly(x,[[cx-w,cy],[cx,cy-hgt],[cx+w*.1,cy]],'#6b7270');poly(x,[[cx+w,cy],[cx,cy-hgt],[cx+w*.1,cy]],'#a7aeac');if(hgt>14)poly(x,[[cx-w*.28,cy-hgt*.72],[cx,cy-hgt],[cx+w*.28,cy-hgt*.72]],'#eef2f2')}
      else if(b==='ruins'&&h2<.34){box(x,cx,cy,3+h2*3,1.6+h2*1.4,3+h2*5,'#b5a68a','#6d604b','#8f8068');x.fillStyle='#2a241a';x.fillRect(cx+.4,cy-2.4,1.2,1.4)}
      else if(b==='industrial'&&h2<.3){box(x,cx,cy,4+h2*4,2+h2*2,5+h2*6,'#9aa09c','#555b58','#777e7a');if(h2<.12){x.fillStyle='#4a4f4c';x.fillRect(cx+1,cy-17,2.4,12);x.fillStyle='rgba(210,210,210,.45)';x.beginPath();x.arc(cx+2.2,cy-19,2.4,0,TAU);x.fill()}}
      else if(b==='wasteland'&&h2<.06){x.strokeStyle='#4f3b22';x.lineWidth=1;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-6);x.moveTo(cx,cy-4);x.lineTo(cx+2.5,cy-7);x.stroke()}
    }
  }
  TC=c;return c;
}
function drawTerrain(c,V){
  const bg=c.createRadialGradient(V.w*.45,V.h*.5,10,V.w*.45,V.h*.5,Math.max(V.w,V.h)*.8);bg.addColorStop(0,'#17252a');bg.addColorStop(1,'#05080a');c.fillStyle=bg;c.fillRect(0,0,V.w,V.h);
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const T=terrain();
  c.save();c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=30;c.drawImage(T,V.tx,V.ty,TW*V.k,TH*V.k);c.restore();
  c.drawImage(T,V.tx,V.ty,TW*V.k,TH*V.k);
}
function vignette(c,V){const g=c.createRadialGradient(V.w/2,V.h/2,Math.min(V.w,V.h)*.38,V.w/2,V.h/2,Math.max(V.w,V.h)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.62)');c.fillStyle=g;c.fillRect(0,0,V.w,V.h)}
const iso=(V,i,j)=>V.s(gx(i,j),gy(i,j));

/* ---------------------------------------------------------------
   Marcadores
---------------------------------------------------------------- */
function pin(c,x,y,r,label,fill,rim,txt,glow,t){
  const cy=y-r*1.95;
  c.save();c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(x,y,r*.8,r*.32,0,0,TAU);c.fill();
  if(glow){c.shadowColor=glow;c.shadowBlur=14+7*Math.sin(t*4)}
  c.beginPath();c.arc(x,cy,r,Math.PI*.75,Math.PI*.25,false);c.lineTo(x,y);c.closePath();
  const g=c.createLinearGradient(x,cy-r,x,y);g.addColorStop(0,shade(fill,1.25));g.addColorStop(1,shade(fill,.8));c.fillStyle=g;c.fill();
  c.shadowBlur=0;c.lineWidth=2;c.strokeStyle=rim;c.stroke();
  c.beginPath();c.arc(x,cy,r*.68,0,TAU);c.fillStyle='rgba(0,0,0,.22)';c.fill();
  c.fillStyle=txt;c.font='900 '+Math.round(r*(String(label).length>1?.92:1.1))+'px Bahnschrift,"Arial Narrow",system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';
  if(label==='ok'){c.strokeStyle=txt;c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(x-r*.38,cy);c.lineTo(x-r*.08,cy+r*.3);c.lineTo(x+r*.42,cy-r*.3);c.stroke()}
  else c.fillText(label,x,cy+.5);
  c.restore();
}
const POI={suburb:['#b9693f','#d9c7a3'],market:['#3f8fc4','#d8d2c0'],station:['#d9a23a','#cfc7b5'],hospital:['#d9d9d9','#e8e8e8'],factory:['#7d8280','#a9aeab'],police:['#3a5ea8','#c9ccd1'],camp:['#6d7a3a','#8f9a5c']};
function poi(c,x,y,s,z,lock,t){
  const pc=POI[z.id]||['#999','#ccc'];let roof=pc[0],wall=pc[1];if(lock){roof=mix(roof,'#555a5c',.7);wall=mix(wall,'#4a4f51',.6)}
  c.save();
  poly(c,[[x,y-s*.75],[x+s*1.5,y],[x,y+s*.75],[x-s*1.5,y]],'rgba(0,0,0,.4)');
  poly(c,[[x,y-s*.62],[x+s*1.25,y],[x,y+s*.62],[x-s*1.25,y]],lock?'#44494a':'#5d6b50');
  const hw=s*.8,hd=s*.4,h=s*.8;
  if(z.id==='camp'){poly(c,[[x-hw,y],[x,y-s*1.25],[x+hw*.15,y+hd*.2]],shade(roof,.75));poly(c,[[x+hw,y],[x,y-s*1.25],[x+hw*.15,y+hd*.2]],roof);poly(c,[[x-hw*.1,y+hd*.3],[x+hw,y],[x+hw*.15,y+hd*.2]],shade(roof,.5))}
  else{box(c,x,y,hw,hd,h,roof,shade(wall,.78),wall);
    if(z.id==='hospital'){c.fillStyle='#d23b3b';c.fillRect(x+hw*.28,y-h*.78,hw*.44,hw*.12);c.fillRect(x+hw*.44,y-h*.9,hw*.12,hw*.44)}
    if(z.id==='factory'){c.fillStyle=shade(wall,.55);c.fillRect(x-hw*.5,y-h-s*.9,s*.28,s*.95);c.fillStyle='rgba(220,220,220,.5)';c.beginPath();c.arc(x-hw*.36,y-h-s*1.05,s*.2+Math.sin(t*2)*1.2,0,TAU);c.fill()}
    if(z.id==='station'){poly(c,[[x+hw*.2,y-h*1.25],[x+hw*1.4,y-h*.85],[x+hw*.2,y-h*.5],[x-hw*.4,y-h*.85]],roof)}
    if(z.id==='police'){c.fillStyle='#e9e9e9';c.fillRect(x+hw*.2,y-h*.6,hw*.6,2)}
    if(z.id==='market'){for(let k=0;k<3;k++){c.fillStyle=k%2?'#e9ece6':'#c9503a';poly(c,[[x+hw*(.15+k*.28),y-h*.5],[x+hw*(.15+k*.28+.28),y-h*.5-hd*.0],[x+hw*(.15+k*.28+.28),y-h*.2],[x+hw*(.15+k*.28),y-h*.2]],c.fillStyle)}}
  }
  c.restore();
}
function lockGlyph(c,x,y,r){c.save();c.fillStyle='rgba(8,11,12,.85)';c.beginPath();c.arc(x,y,r*1.5,0,TAU);c.fill();c.strokeStyle='#cfd6d2';c.fillStyle='#cfd6d2';c.lineWidth=1.6;c.beginPath();c.arc(x,y-r*.25,r*.55,Math.PI,0);c.stroke();c.fillRect(x-r*.7,y-r*.2,r*1.4,r*1.0);c.restore()}
function baseFlag(c,x,y,t,sz){
  c.save();const s=sz||7;
  poly(c,[[x,y-s*.6],[x+s*1.3,y],[x,y+s*.6],[x-s*1.3,y]],'rgba(0,0,0,.4)');
  box(c,x,y,s*.8,s*.4,s*.8,'#c46a3a','#8f8068','#b5a68a');
  c.strokeStyle='#e9ece6';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y-s*.8);c.lineTo(x,y-s*3);c.stroke();
  poly(c,[[x,y-s*3],[x+s*1.5,y-s*2.6+Math.sin(t*3)],[x,y-s*2.1]],'#f2b632');
  plate(c,x,y+s*1.4,'BASE',{fs:9,col:'#f2d27a',line:'#a8740f'});
  c.restore();
}
function ownedEdges(c,V,color){
  c.save();c.lineWidth=3;c.strokeStyle=color;c.shadowColor=color;c.shadowBlur=8;c.lineCap='round';
  for(let id=0;id<PG*PG;id++){if(!S.parc[id])continue;const px=id%PG,py=Math.floor(id/PG),i0=px*PS,j0=py*PS,i1=i0+PS,j1=j0+PS;
    const own=(a,b)=>a>=0&&b>=0&&a<PG&&b<PG&&S.parc[b*PG+a];
    const side=(a,b,p,q)=>{const A1=iso(V,a,b),B1=iso(V,p,q);c.beginPath();c.moveTo(A1[0],A1[1]);c.lineTo(B1[0],B1[1]);c.stroke()};
    if(!own(px,py-1))side(i0,j0,i1,j0);
    if(!own(px+1,py))side(i1,j0,i1,j1);
    if(!own(px,py+1))side(i0,j1,i1,j1);
    if(!own(px-1,py))side(i0,j0,i0,j1);
  }
  c.restore();
}

/* ---------------------------------------------------------------
   Ficha lateral (HTML)
---------------------------------------------------------------- */
const pips=n=>'<span class="pips">'+[1,2,3,4,5].map(k=>'<i class="'+(k<=n?'on d'+n:'')+'"></i>').join('')+'</span>';
const rchip=(k,v,ok)=>'<span class="rc'+(ok===false?' no':'')+'"><img src="'+ICO[k]+'">'+v+'</span>';
const costChips=o=>Object.keys(o).map(k=>rchip(k,o[k],S.res[k]>=o[k])).join('');

/* ===============================================================
   1) MAPA DEL MUNDO EXTERIOR · cartografía ilustrada
================================================================ */
const MW=1200,MH=700,mu=x=>60+x*13.5,mv=y=>45+y*8;
const INK='#2b2214';let LOCKF=false;const F=c=>LOCKF?mix(c,'#8d8670',.62):c;
const coastY=x=>x<700?600+Math.pow(x/700,1.5)*100:720;
const RV=[[1210,30],[1090,90],[1010,160],[940,240],[880,320],[800,390],[745,425],[708,445],[640,480],[560,520],[470,560],[400,595],[350,628]];
function dens(pts,step){const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(d/step));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}o.push(pts[pts.length-1]);return o}
const RS=dens(RV,12);
const ROADS=[[[0,250],[180,268],[330,305],[480,338],[640,372],[760,398],[900,432],[1050,486],[1200,515]],[[640,0],[648,120],[690,250],[745,400],[722,520],[690,640]]];
const RAIL=[[411,119],[500,200],[600,290],[760,405],[960,455],[1200,480]];
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
// ---- primitivas de dibujo "tinta" en coordenadas locales (-20..20)
const r_=(c,x,y,w,h,f,s)=>{c.fillStyle=F(f);c.fillRect(x,y,w,h);if(s!==0){c.strokeStyle=INK;c.lineWidth=1.3;c.strokeRect(x,y,w,h)}};
const p_=(c,pts,f,s)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fillStyle=F(f);c.fill();if(s!==0){c.strokeStyle=INK;c.lineWidth=1.3;c.lineJoin='round';c.stroke()}};
const o_=(c,x,y,r,f,s)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=F(f);c.fill();if(s!==0){c.strokeStyle=INK;c.lineWidth=1.3;c.stroke()}};
const l_=(c,pts,w)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.strokeStyle=INK;c.lineWidth=w||1.3;c.lineCap='round';c.lineJoin='round';c.stroke()};
const wn=(c,x,y,n,m,dx,dy,w,h,f)=>{for(let i=0;i<n;i++)for(let j=0;j<m;j++)r_(c,x+i*dx,y+j*dy,w||3,h||3,f||'#6f8fa6',0)};
const dome=(c,x,y,r,f)=>{c.beginPath();c.arc(x,y,r,Math.PI,0);c.closePath();c.fillStyle=F(f);c.fill();c.strokeStyle=INK;c.lineWidth=1.3;c.stroke()};
const IC={
 gas:c=>{r_(c,-18,-7,36,5,'#d9a23a');r_(c,-14,-2,3,16,'#cdbf9c');r_(c,11,-2,3,16,'#cdbf9c');r_(c,-7,4,5,10,'#b8432f');r_(c,2,4,5,10,'#b8432f');r_(c,-23,-19,3,30,'#8d949a');r_(c,-27,-21,11,6,'#b8432f')},
 truck:c=>{c.rotate(-.18);r_(c,-17,-3,22,13,'#f2eee0');r_(c,5,0,12,10,'#3f6a96');r_(c,8,2,5,3,'#a9c4d6',0);o_(c,-10,11,3.6,'#2b2214');o_(c,11,11,3.6,'#2b2214');l_(c,[[-20,15],[-2,15]],1)},
 hospital:c=>{r_(c,-17,-6,34,20,'#f2eee0');r_(c,-7,-17,14,11,'#e2d6b8');r_(c,-1.6,-15.5,3.2,8,'#c23b32',0);r_(c,-4.6,-13,9.2,3.2,'#c23b32',0);wn(c,-14,0,2,2,8,6,4,3);wn(c,6,0,2,2,8,6,4,3);r_(c,-3,7,6,7,'#6a5a3a')},
 warehouse:c=>{p_(c,[[-19,-1],[0,-15],[19,-1]],'#7d8489');r_(c,-19,-1,38,15,'#cdbf9c');r_(c,-6,3,12,11,'#6a5a3a');l_(c,[[-6,8.5],[6,8.5]],1);r_(c,10,1,6,4,'#d9a23a',0)},
 lab:c=>{r_(c,-15,-3,30,17,'#f2eee0');dome(c,0,-3,10,'#7fb6a8');o_(c,0,7,3.6,'#8bc34a');r_(c,10,-17,2,13,'#8d949a');o_(c,11,-18,2,'#b8432f')},
 military:c=>{r_(c,-17,-1,34,15,'#6d7a3a');r_(c,-1,-21,2,21,'#5a4a30',0);p_(c,[[1,-21],[12,-17],[1,-13]],'#b8432f');for(let i=0;i<5;i++)o_(c,-16+i*8,14,3.8,'#c9b27a');r_(c,-4,4,8,10,'#4a5530')},
 tower:c=>{l_(c,[[-9,15],[0,-19],[9,15]],1.7);l_(c,[[-6,3],[6,3]],1.2);l_(c,[[-4,-8],[4,-8]],1.2);l_(c,[[-6,3],[4,-8]],1);l_(c,[[6,3],[-4,-8]],1);o_(c,-4,-14,2.6,'#e2d6b8');o_(c,4,-14,2.6,'#e2d6b8');o_(c,0,-20,2,'#b8432f')},
 observatory:c=>{r_(c,-13,-2,26,16,'#e2d6b8');dome(c,0,-2,12,'#f2eee0');l_(c,[[0,-14],[3,-3]],2.6);l_(c,[[2,-12],[12,-18]],2);r_(c,-3,6,6,8,'#6a5a3a')},
 police:c=>{r_(c,-17,-4,34,18,'#6b87b5');r_(c,-17,-8,34,5,'#2f4a7a');o_(c,-5,-10,2.6,'#c23b32');o_(c,5,-10,2.6,'#3f7ad0');p_(c,[[0,-1],[3,2],[0,7],[-3,2]],'#f2d27a');r_(c,-3,7,6,7,'#2b2214');wn(c,-14,0,1,1,0,0,4,3);wn(c,10,0,1,1,0,0,4,3)},
 wall:c=>{for(let i=0;i<4;i++)r_(c,-19+i*10,-6,9,20,'#b6b19f');l_(c,[[-19,-10],[-14,-7],[-9,-10],[-4,-7],[1,-10],[6,-7],[11,-10],[16,-7],[19,-9]],1.1);for(let i=0;i<3;i++)p_(c,[[-14+i*10,-2],[-8+i*10,-2],[-8+i*10,3],[-14+i*10,3]],'#d9a23a',0);r_(c,-19,-6,38,0.1,'#000',1)},
 camp:c=>{p_(c,[[-18,12],[-8,-6],[2,12]],'#a8452f');p_(c,[[-2,12],[8,-10],[18,12]],'#8a6f46');l_(c,[[-8,-6],[-8,12]],1);p_(c,[[-4,15],[0,6],[4,15]],'#e8902c',0);o_(c,0,-14,2.4,'rgba(60,50,40,.55)',0);o_(c,3,-18,3,'rgba(60,50,40,.4)',0)},
 metro:c=>{r_(c,-15,-3,30,17,'#8d949a');c.beginPath();c.arc(0,14,8,Math.PI,0);c.fillStyle=F('#2b2214');c.fill();o_(c,0,-12,8,'#c23b32');c.fillStyle=F('#fff');c.font='bold 11px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('M',0,-11.5)},
 archive:c=>{p_(c,[[-16,-5],[0,-16],[16,-5]],'#b9a97f');r_(c,-14,-5,28,19,'#cdbf9c');for(let i=0;i<4;i++)r_(c,-11+i*7,-3,3,15,'#e9e0c8');r_(c,-16,13,32,3,'#8d8670')},
 house:c=>{p_(c,[[-15,-2],[0,-16],[15,-2]],'#a8452f');r_(c,-12,-2,24,16,'#e2d6b8');r_(c,-3,5,6,9,'#6a5a3a');r_(c,-10,2,5,5,'#6f8fa6');r_(c,6,2,5,5,'#6f8fa6');r_(c,7,-14,4,8,'#8a6f46')},
 skyscraper:c=>{r_(c,-8,-19,16,33,'#7f98ae');r_(c,-17,-3,10,17,'#9bb0c2');r_(c,8,-8,9,22,'#9bb0c2');wn(c,-5,-16,3,6,5,5,2.6,2.6,'#e9e0c8');l_(c,[[0,-19],[0,-24]],1.5);o_(c,0,-24,1.5,'#c23b32')},
 old:c=>{r_(c,-12,-3,24,17,'#d8cba8');p_(c,[[-14,-3],[0,-12],[14,-3]],'#8a6f46');r_(c,-4,-20,8,17,'#cdbf9c');p_(c,[[-5,-20],[0,-27],[5,-20]],'#8a6f46');l_(c,[[0,-27],[0,-31]],1.3);l_(c,[[-2,-29],[2,-29]],1.3);o_(c,0,-14,2,'#e8902c');r_(c,-3,6,6,8,'#6a5a3a')},
 barrier:c=>{l_(c,[[-20,10],[20,6]],0.1);r_(c,-19,2,38,6,'#6e6a5e',0);r_(c,-19,2,38,6,'#6e6a5e');for(let i=0;i<5;i++)p_(c,[[-18+i*8,2],[-12+i*8,2],[-15+i*8,8],[-21+i*8,8]],i%2?'#f2eee0':'#c23b32',0);p_(c,[[-12,-6],[-8,-6],[-6,2],[-14,2]],'#e8902c');p_(c,[[10,-6],[14,-6],[16,2],[8,2]],'#e8902c');l_(c,[[-6,-14],[0,-8],[6,-14]],1.1);o_(c,0,-17,2,'rgba(60,50,40,.5)',0)},
 weather:c=>{r_(c,-9,2,18,12,'#e2d6b8');r_(c,-1,-18,2,20,'#8d949a');l_(c,[[-9,-14],[9,-14]],1.4);o_(c,-9,-14,2.6,'#f2eee0');o_(c,9,-14,2.6,'#f2eee0');p_(c,[[1,-18],[10,-20],[8,-16]],'#c23b32');r_(c,-3,6,6,8,'#6a5a3a')},
 greenhouse:c=>{for(let i=0;i<2;i++){const x=-18+i*19;c.beginPath();c.moveTo(x,14);c.lineTo(x,2);c.arc(x+8.5,2,8.5,Math.PI,0);c.lineTo(x+17,14);c.closePath();c.fillStyle=F('#a9d1b4');c.fill();c.strokeStyle=INK;c.lineWidth=1.3;c.stroke();l_(c,[[x+8.5,-6.5],[x+8.5,14]],.9);o_(c,x+5,10,2.6,'#5f9a45',0);o_(c,x+12,10,2.6,'#5f9a45',0)}},
 radio:c=>{r_(c,-11,4,22,10,'#e2d6b8');r_(c,-1,-18,2,22,'#8d949a');for(let i=1;i<=3;i++){c.beginPath();c.arc(0,-16,i*5,-Math.PI*.8,-Math.PI*.2);c.strokeStyle=F(INK);c.lineWidth=1.2;c.stroke()}o_(c,0,-17,2,'#c23b32')},
 border:c=>{r_(c,-19,-1,3,15,'#8d949a');r_(c,16,-1,3,15,'#8d949a');c.save();c.rotate(-.35);for(let i=0;i<5;i++)r_(c,-16+i*5.2,-6,5.2,4,i%2?'#f2eee0':'#c23b32');c.restore();r_(c,-8,2,13,12,'#8a8f6a');r_(c,-5,5,6,4,'#a9c4d6',0)},
 port:c=>{r_(c,-3,-19,3,31,'#d9a23a');r_(c,-3,-19,22,3,'#d9a23a');l_(c,[[17,-16],[17,-6]],1);r_(c,14,-6,7,5,'#3f6a96');p_(c,[[-20,12],[20,12],[14,18],[-14,18]],'#8d949a');r_(c,-14,5,8,7,'#c23b32');r_(c,-5,5,8,7,'#3f6a96')},
 highway:c=>{r_(c,-20,-2,40,6,'#8d949a');r_(c,-14,4,4,10,'#b6b19f');r_(c,10,4,4,10,'#b6b19f');r_(c,-9,-8,9,6,'#c23b32');o_(c,-7,-1,1.6,'#2b2214',0);o_(c,-2,-1,1.6,'#2b2214',0);r_(c,6,-7,8,5,'#3f6a96');l_(c,[[-20,1],[20,1]],.8)},
 dam:c=>{p_(c,[[-20,-6],[20,-6],[17,6],[-17,6]],'#b6b19f');r_(c,-17,6,34,8,'#7fb2c0');for(let i=0;i<4;i++)l_(c,[[-12+i*8,6],[-12+i*8,12]],1);l_(c,[[-20,-6],[20,-6]],1.6);r_(c,-3,-12,6,6,'#8d949a')},
 office:c=>{r_(c,-12,-14,24,28,'#a9a07c');wn(c,-9,-11,4,5,6,5,3,3,'#e9e0c8');r_(c,-3,8,6,6,'#2b2214');l_(c,[[0,-14],[0,-20]],1.4);p_(c,[[0,-20],[7,-18],[0,-16]],'#c23b32')},
 trainstation:c=>{p_(c,[[-17,-1],[-11,-9],[11,-9],[17,-1]],'#a8452f');r_(c,-15,-1,30,13,'#e2d6b8');o_(c,0,-4,3.6,'#f2eee0');r_(c,-4,5,8,7,'#6a5a3a');l_(c,[[-20,15],[20,15]],1.4);l_(c,[[-20,18],[20,18]],1.4);for(let i=0;i<7;i++)l_(c,[[-18+i*6,14],[-18+i*6,19]],.9)},
 capital:c=>{r_(c,-4,-19,8,33,'#7f98ae');r_(c,-14,2,10,12,'#9bb0c2');r_(c,4,2,10,12,'#9bb0c2');[-9,-3,3,9].forEach((x,i)=>{l_(c,[[x*.4,-19],[x*1.1,-27]],1.3);o_(c,x*1.1,-27.5,1.5,'#c23b32',0)});wn(c,-2,-15,2,5,4,5,2.4,2.4,'#e9e0c8')},
 emitter:c=>{l_(c,[[-6,15],[0,-4],[6,15]],1.5);c.save();c.translate(0,-9);c.rotate(-.5);c.beginPath();c.ellipse(0,0,13,6,0,0,TAU);c.fillStyle=F('#f2eee0');c.fill();c.strokeStyle=INK;c.lineWidth=1.3;c.stroke();c.restore();l_(c,[[0,-9],[7,-18]],1.3);o_(c,7,-18,2,'#c23b32')},
 suburb:c=>{[[-13,2,.8],[2,-4,1],[11,5,.75]].forEach(([x,y,s])=>{c.save();c.translate(x,y);c.scale(s,s);p_(c,[[-9,-1],[0,-10],[9,-1]],'#a8452f');r_(c,-7,-1,14,10,'#e2d6b8');r_(c,-2,3,4,6,'#6a5a3a');c.restore()})},
 market:c=>{r_(c,-16,-4,32,18,'#e2d6b8');for(let i=0;i<6;i++)r_(c,-16+i*5.4,-9,5.4,6,i%2?'#f2eee0':'#c23b32');r_(c,-12,3,24,7,'#a9c4d6',0);r_(c,-3,6,6,8,'#6a5a3a')},
 factory:c=>{r_(c,-17,-1,34,15,'#8d949a');p_(c,[[-17,-1],[-9,-8],[-9,-1]],'#7d8489');p_(c,[[-9,-1],[-1,-8],[-1,-1]],'#7d8489');r_(c,6,-18,5,17,'#6e6a5e');r_(c,12,-14,4,13,'#6e6a5e');o_(c,8,-21,3,'rgba(70,60,50,.5)',0);o_(c,13,-18,2.6,'rgba(70,60,50,.4)',0)},
 base:c=>{c.beginPath();c.ellipse(0,6,21,11,0,0,TAU);c.fillStyle=F('#a58a5a');c.fill();c.strokeStyle=INK;c.lineWidth=1.3;c.stroke();for(let i=0;i<12;i++){const a=i/12*TAU;r_(c,Math.cos(a)*21-1.5,Math.sin(a)*11+6-6,3,7,'#7a5f36')}p_(c,[[-9,2],[-1,-6],[7,2]],'#a8452f');r_(c,-7,2,13,8,'#e2d6b8');r_(c,8,-20,2,24,'#5a4a30',0);p_(c,[[10,-20],[22,-16],[10,-12]],'#f2b632')}
};
const KIND=['gas','truck','hospital','warehouse','lab','military','tower','observatory','police','wall','camp','metro','archive','house','skyscraper','old','barrier','weather','greenhouse','radio','border','port','highway','dam','office','trainstation','capital','emitter'];
const ZKIND={suburb:'suburb',market:'market',station:'gas',hospital:'hospital',factory:'factory',police:'police',camp:'camp'};
let WL=null,WBASE=null;
function wlayout(){
  if(WL)return WL;
  const M=[];
  STORY.forEach((c,i)=>M.push({t:'s',i,x:mu(c.loc.x),y:mv(c.loc.y),ox:mu(c.loc.x),oy:mv(c.loc.y),w:1,kind:KIND[i]||'house'}));
  EXT_ZONES.forEach(z=>M.push({t:'z',id:z.id,x:mu(z.x),y:mv(z.y),ox:mu(z.x),oy:mv(z.y),w:.55,kind:ZKIND[z.id]||'house'}));
  M.push({t:'b',x:mu(30),y:mv(42),ox:mu(30),oy:mv(42),w:99,kind:'base',fixed:1});
  const dam=M.find(m=>m.t==='s'&&m.i===23);let best=1e9,bp=RS[0];RS.forEach(q=>{const d=Math.hypot(q[0]-dam.x,q[1]-dam.y);if(d<best){best=d;bp=q}});dam.x=dam.ox=bp[0];dam.y=dam.oy=bp[1];dam.fixed=1;
  const D=68;
  for(let it=0;it<260;it++){
    for(let a=0;a<M.length;a++)for(let b=a+1;b<M.length;b++){const A_=M[a],B=M[b],dx=B.x-A_.x,dy=(B.y-A_.y)*1.25,d=Math.hypot(dx,dy)||.01;if(d<D){const push=(D-d)*.5,wa=A_.fixed?0:1/A_.w,wb=B.fixed?0:1/B.w,sw=(wa+wb)||1,ux=dx/d,uy=dy/d/1.25;A_.x-=ux*push*wa/sw*2;A_.y-=uy*push*wa/sw*2;B.x+=ux*push*wb/sw*2;B.y+=uy*push*wb/sw*2}}
    M.forEach(m=>{if(m.fixed)return;
      m.x+=(m.ox-m.x)*.03;m.y+=(m.oy-m.y)*.03;
      RS.forEach(q=>{const dx=m.x-q[0],dy=m.y-q[1],d=Math.hypot(dx,dy);if(d<34&&d>0){m.x+=dx/d*(34-d)*.35;m.y+=dy/d*(34-d)*.35}});
      m.x=clamp(m.x,70,MW-70);m.y=clamp(m.y,92,MH-52);const cy=coastY(m.x)-26;if(m.y>cy)m.y=cy});
  }
  WL=M;return M;
}
function buildBase(){
  if(WBASE)return WBASE;
  const M=wlayout(),S2=2,cv=document.createElement('canvas');cv.width=MW*S2;cv.height=MH*S2;const c=cv.getContext('2d');c.scale(S2,S2);
  const R=rng(7),near=(x,y,d)=>M.some(m=>Math.hypot(m.x-x,(m.y-y)*1.2)<d)||RS.some(q=>Math.hypot(q[0]-x,q[1]-y)<d*.5);
  // papel
  let g=c.createLinearGradient(0,0,MW,MH);g.addColorStop(0,'#d3c699');g.addColorStop(.5,'#c7b98a');g.addColorStop(1,'#bba97a');c.fillStyle=g;c.fillRect(0,0,MW,MH);
  for(let i=0;i<16;i++){const x=R()*MW,y=R()*MH,r=80+R()*160,gg=c.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,R()<.5?'rgba(120,90,40,.07)':'rgba(255,245,210,.08)');gg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gg;c.fillRect(x-r,y-r,r*2,r*2)}
  // zonas verdes (bosque) suaves
  const FO=[[170,160,150,90],[110,430,100,130],[330,520,140,60],[1010,640,160,40],[1100,300,90,120],[560,100,170,40],[740,560,130,50],[930,90,110,40]];
  FO.forEach(([x,y,rx,ry])=>{const gg=c.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));gg.addColorStop(0,'rgba(110,140,80,.38)');gg.addColorStop(1,'rgba(110,140,80,0)');c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=gg;c.beginPath();c.arc(x,y,rx,0,TAU);c.fill();c.restore()});
  // mar
  c.beginPath();c.moveTo(0,MH);c.lineTo(0,coastY(0));for(let x=0;x<=700;x+=10)c.lineTo(x,coastY(x)+Math.sin(x/23)*3);c.lineTo(700,MH);c.closePath();c.fillStyle='#8fb3b8';c.fill();c.strokeStyle='#5d8790';c.lineWidth=2.4;c.stroke();
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;for(let i=0;i<40;i++){const x=R()*680,y=coastY(x)+14+R()*(MH-coastY(x)-14);if(y>MH-10)continue;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+6,y-3,x+12,y);c.stroke()}
  // río
  const river=(w,col)=>{c.beginPath();RV.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.lineWidth=w;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';c.stroke()};
  c.save();c.shadowColor='rgba(60,50,30,.25)';c.shadowBlur=6;river(20,'#5d8790');c.restore();river(16,'#8fb3b8');river(5,'rgba(255,255,255,.28)');
  // colinas con curvas de nivel
  [[170,110,1],[1120,540,.8],[1090,160,.7]].forEach(([x,y,s])=>{for(let k=0;k<4;k++){const rx=(130-k*30)*s,ry=(64-k*14)*s;c.beginPath();for(let a=0;a<=TAU+.1;a+=.15){const wob=1+Math.sin(a*3+k)*.07,px=x+Math.cos(a)*rx*wob,py=y+Math.sin(a)*ry*wob;a?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();c.strokeStyle='rgba(120,90,50,.55)';c.lineWidth=1.1;c.stroke();if(k===0){c.fillStyle='rgba(150,120,70,.14)';c.fill()}}});
  // ciudad (manzanas)
  c.save();c.translate(760,400);c.rotate(.22);c.beginPath();c.ellipse(0,0,215,130,0,0,TAU);c.fillStyle='rgba(176,155,105,.45)';c.fill();c.restore();
  const cr=rng(3);for(let gxn=-240;gxn<240;gxn+=30)for(let gyn=-150;gyn<150;gyn+=24){const px=gxn*Math.cos(.22)-gyn*Math.sin(.22)+760,py=gxn*Math.sin(.22)+gyn*Math.cos(.22)+400,e=((gxn/215)**2+(gyn/130)**2);if(e>1||cr()<.28)continue;if(near(px,py,38))continue;c.save();c.translate(px,py);c.rotate(.22);c.fillStyle='#b9a97f';c.strokeStyle='#6f5f3e';c.lineWidth=.8;c.fillRect(-11,-8,22,16);c.strokeRect(-11,-8,22,16);c.restore()}
  // zona infectada
  const inf=c.createRadialGradient(762,420,10,762,420,200);inf.addColorStop(0,'rgba(190,50,40,.20)');inf.addColorStop(1,'rgba(190,50,40,0)');c.fillStyle=inf;c.fillRect(540,240,440,360);
  // bosques
  FO.forEach(([x,y,rx,ry],fi)=>{const n=Math.round(rx*ry/260);const pts=[];for(let i=0;i<n;i++){const a=R()*TAU,r=Math.sqrt(R()),px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;if(py>coastY(px)-8||near(px,py,50))continue;pts.push([px,py])}pts.sort((a,b)=>a[1]-b[1]);pts.forEach(([px,py])=>{const s=5+R()*3.5;if(R()<.5){c.fillStyle='rgba(0,0,0,.14)';c.beginPath();c.ellipse(px+2,py+s*.7,s,s*.4,0,0,TAU);c.fill();c.fillStyle='#4f7a3e';c.strokeStyle='#2b3a1c';c.lineWidth=.9;c.beginPath();c.moveTo(px,py-s*2.2);c.lineTo(px+s*.9,py);c.lineTo(px-s*.9,py);c.closePath();c.fill();c.stroke();c.fillStyle='#6f9a52';c.beginPath();c.moveTo(px,py-s*2.2);c.lineTo(px-s*.9,py);c.lineTo(px-s*.15,py);c.closePath();c.fill()}else{c.fillStyle='#5a4126';c.fillRect(px-.8,py-2,1.6,4);c.fillStyle='#6a9250';c.strokeStyle='#2b3a1c';c.lineWidth=.9;c.beginPath();c.arc(px,py-s*.9,s*.95,0,TAU);c.fill();c.stroke();c.fillStyle='#86b066';c.beginPath();c.arc(px-s*.3,py-s*1.2,s*.4,0,TAU);c.fill()}})});
  // carreteras
  const road=(pts,w)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.lineJoin='round';c.lineCap='round';c.lineWidth=w+3;c.strokeStyle='#6a5a3a';c.stroke();c.lineWidth=w;c.strokeStyle='#ece2bf';c.stroke();c.setLineDash([8,8]);c.lineWidth=1;c.strokeStyle='#b59a5a';c.stroke();c.setLineDash([])};
  c.save();c.beginPath();c.ellipse(760,400,230,142,.22,0,TAU);c.lineWidth=5;c.strokeStyle='#6a5a3a';c.stroke();c.lineWidth=2.4;c.strokeStyle='#ece2bf';c.stroke();c.restore();
  // pistas a cada ubicación
  const roadPts=ROADS.flatMap(r=>dens(r,16));
  c.save();c.setLineDash([2,5]);c.lineWidth=1.6;c.strokeStyle='rgba(90,70,40,.75)';c.lineCap='round';M.forEach(m=>{let bd=1e9,bq=null;roadPts.forEach(q=>{const d=Math.hypot(q[0]-m.x,q[1]-m.y);if(d<bd){bd=d;bq=q}});if(bd>26){c.beginPath();c.moveTo(m.x,m.y);c.quadraticCurveTo((m.x+bq[0])/2+(bq[1]-m.y)*.15,(m.y+bq[1])/2-(bq[0]-m.x)*.15,bq[0],bq[1]);c.stroke()}});c.restore();
  ROADS.forEach(r=>road(r,7));
  // ferrocarril
  c.beginPath();RAIL.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.lineWidth=3;c.strokeStyle='#2b2214';c.stroke();c.setLineDash([2,7]);c.lineWidth=7;c.strokeStyle='#2b2214';c.stroke();c.setLineDash([]);c.lineWidth=1.2;c.strokeStyle='#d9cfae';c.stroke();
  // puentes (carretera sobre el río)

  // puentes donde carreteras y vía cruzan el río
  const inter=(a,b,c2,d)=>{const x1=a[0],y1=a[1],x2=b[0],y2=b[1],x3=c2[0],y3=c2[1],x4=d[0],y4=d[1],den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);if(!den)return null;const t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den,u=-((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;return(t>=0&&t<=1&&u>=0&&u<=1)?[x1+t*(x2-x1),y1+t*(y2-y1),Math.atan2(y2-y1,x2-x1)]:null};
  const bridge=(x,y,a,w)=>{c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#8a7a58';c.fillRect(-14,-w/2-3,28,w+6);c.strokeStyle=INK;c.lineWidth=1.4;c.strokeRect(-14,-w/2-3,28,w+6);c.fillStyle='#ece2bf';c.fillRect(-14,-w/2,28,w);for(let k=-12;k<=12;k+=6){c.fillStyle=INK;c.fillRect(k-.6,-w/2-3,1.2,3);c.fillRect(k-.6,w/2,1.2,3)}c.restore()};
  [...ROADS.map(r=>[r,7]),[RAIL,5]].forEach(([pl,w])=>{for(let i=0;i<pl.length-1;i++)for(let j=0;j<RV.length-1;j++){const q=inter(pl[i],pl[i+1],RV[j],RV[j+1]);if(q)bridge(q[0],q[1],q[2],w)}});
  // cordón militar (línea roja) y sellos
  c.save();c.strokeStyle='rgba(168,50,35,.85)';c.lineWidth=3;c.setLineDash([12,7]);c.beginPath();c.moveTo(1168,60);c.quadraticCurveTo(1150,330,1170,640);c.stroke();c.setLineDash([]);c.lineWidth=2.2;for(let y=90;y<640;y+=48){const x=1160+Math.sin(y/60)*6;c.beginPath();c.moveTo(x-5,y-5);c.lineTo(x+5,y+5);c.moveTo(x+5,y-5);c.lineTo(x-5,y+5);c.stroke()}c.restore();
  const stamp=(t,x,y,a,col)=>{c.save();c.translate(x,y);c.rotate(a);c.font='900 13px Georgia,serif';if('letterSpacing'in c)c.letterSpacing='3px';const w=c.measureText(t).width+16;c.strokeStyle=col;c.lineWidth=2.4;c.strokeRect(-w/2,-12,w,24);c.lineWidth=.9;c.strokeRect(-w/2+3,-9,w-6,18);c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText(t,0,1);c.restore()};
  stamp('ZONA DE CUARENTENA',135,540,-.12,'rgba(168,50,35,.62)');stamp('CORDÓN MILITAR',1062,652,0,'rgba(168,50,35,.55)');stamp('INFECTADA',860,520,.08,'rgba(168,50,35,.4)');
  // coches abandonados, hogueras y humo
  const car=(x,y,a,col)=>{c.save();c.translate(x,y);c.rotate(a);c.fillStyle=col;c.strokeStyle=INK;c.lineWidth=1;c.fillRect(-6,-3,12,6);c.strokeRect(-6,-3,12,6);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-2,-2,4,4);c.restore()};
  [[560,372,.1,'#a8452f'],[610,380,-.15,'#3f6a96'],[840,420,.2,'#d9a23a'],[905,437,-.1,'#8d949a'],[420,320,.05,'#c23b32'],[690,330,.5,'#e2d6b8'],[985,466,.1,'#6d7a3a']].forEach(q=>{if(!near(q[0],q[1],34))car(q[0],q[1],q[2],q[3])});
  const smoke=(x,y)=>{if(near(x,y,40))return;c.fillStyle='#e8902c';c.beginPath();c.moveTo(x-3,y);c.quadraticCurveTo(x,y-9,x+3,y);c.fill();for(let k=0;k<4;k++){c.fillStyle='rgba(60,50,40,'+(.38-k*.08)+')';c.beginPath();c.arc(x+k*3,y-8-k*8,3+k*1.8,0,TAU);c.fill()}};
  [[700,470],[830,350],[620,330],[900,380],[780,300]].forEach(q=>smoke(q[0],q[1]));
  // rótulos
  const txt=(t,x,y,a,sz,col,sp)=>{c.save();c.translate(x,y);c.rotate(a);c.font='italic 700 '+sz+'px Georgia,serif';c.fillStyle=col;c.textAlign='center';if('letterSpacing'in c)c.letterSpacing=(sp||0)+'px';c.fillText(t,0,0);c.restore()};
  txt('Río Valdecruz',955,212,.9,13,'rgba(40,80,95,.8)',3);txt('Mar de Levante',230,675,0,16,'rgba(40,80,95,.8)',5);txt('Bosque de la Niebla',170,250,0,12,'rgba(50,70,30,.75)',3);txt('Montes del Norte',1090,100,0,11,'rgba(90,60,30,.8)',3);txt('CIUDAD VIEJA',760,512,0,15,'rgba(110,40,30,.55)',6);
  // cuadrícula y marco
  c.strokeStyle='rgba(60,45,20,.16)';c.lineWidth=.8;for(let x=100;x<MW;x+=100){c.beginPath();c.moveTo(x,22);c.lineTo(x,MH-22);c.stroke()}for(let y=100;y<MH;y+=100){c.beginPath();c.moveTo(22,y);c.lineTo(MW-22,y);c.stroke()}
  c.font='700 10px Georgia,serif';c.fillStyle='#3a2c14';c.textAlign='center';'ABCDEFGHIJKL'.split('').forEach((l,i)=>{c.fillText(l,50+i*100,17);c.fillText(l,50+i*100,MH-8)});for(let j=0;j<7;j++){c.fillText(String(j+1),11,50+j*100+3);c.fillText(String(j+1),MW-11,50+j*100+3)}
  // quemado de bordes
  const eb=c.createRadialGradient(MW/2,MH/2,MH*.35,MW/2,MH/2,MW*.62);eb.addColorStop(0,'rgba(60,40,10,0)');eb.addColorStop(1,'rgba(60,40,10,.42)');c.fillStyle=eb;c.fillRect(0,0,MW,MH);
  c.strokeStyle=INK;c.lineWidth=3;c.strokeRect(18,22,MW-36,MH-44);c.lineWidth=1;c.strokeRect(24,28,MW-48,MH-56);
  // cartela
  c.fillStyle='rgba(215,200,155,.92)';c.fillRect(40,40,300,64);c.strokeStyle=INK;c.lineWidth=2;c.strokeRect(40,40,300,64);c.lineWidth=.8;c.strokeRect(45,45,290,54);
  c.fillStyle=INK;c.textAlign='center';c.font='900 26px Georgia,serif';if('letterSpacing'in c)c.letterSpacing='6px';c.fillText('VALDECRUZ',190,72);c.font='italic 600 11px Georgia,serif';if('letterSpacing'in c)c.letterSpacing='1px';c.fillText('Mapa de reconocimiento · Zona de exclusión',190,90);if('letterSpacing'in c)c.letterSpacing='0px';
  // brújula
  c.save();c.translate(MW-88,MH-92);c.beginPath();c.arc(0,0,42,0,TAU);c.fillStyle='rgba(215,200,155,.7)';c.fill();c.strokeStyle=INK;c.lineWidth=1.6;c.stroke();for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);const L=i%2?26:40;c.beginPath();c.moveTo(0,-L);c.lineTo(5,-6);c.lineTo(0,0);c.lineTo(-5,-6);c.closePath();c.fillStyle=i===0?'#a8452f':(i%2?'#8d8670':INK);c.fill();c.stroke();c.restore()}c.fillStyle=INK;c.font='900 14px Georgia,serif';c.textAlign='center';c.fillText('N',0,-47);c.restore();
  // escala
  c.save();c.translate(MW/2-80,MH-48);for(let i=0;i<4;i++){c.fillStyle=i%2?'#f2eee0':INK;c.fillRect(i*40,0,40,6)}c.strokeStyle=INK;c.lineWidth=1;c.strokeRect(0,0,160,6);c.fillStyle=INK;c.font='700 10px Georgia,serif';c.textAlign='left';c.fillText('0',0,18);c.fillText('2',76,18);c.fillText('4 km',150,18);c.restore();
  WBASE=cv;return cv;
}
function drawIcon(c,kind,x,y,sc,lock,t){
  c.save();c.translate(x,y);c.scale(sc,sc);LOCKF=!!lock;
  c.fillStyle='rgba(40,30,10,.28)';c.beginPath();c.ellipse(0,15,19,5,0,0,TAU);c.fill();
  (IC[kind]||IC.house)(c,t);LOCKF=false;c.restore();
}
window.worldMapMenu=function(){
  const lv=hallLv();
  if(!window._wmInit){window._wmInit=1;window.storyPickIdx=Math.min(S.story,STORY.length-1)}
  const cv=fsOpen('world','Mapa de exploración','Historia '+Math.min(S.story,STORY.length)+'/'+STORY.length+' · Ayuntamiento nivel '+lv);
  const lockOf=i=>(i>S.story&&S.mode!=='creativo')||STORY[i].h>lv||(window.chLocked&&chLocked(i));
  const info=()=>{
    const i=storyPickIdx;let h='';
    if(i>=0&&STORY[i]){const c=STORY[i],dn=i<S.story,lk=lockOf(i)||cnt('expo')<1,why=cnt('expo')<1?'Construye primero un Centro de expediciones (ayuntamiento nivel 3).':(i>=16&&window.chLocked&&chLocked(i))?'Primero decide el destino de Valdecruz.':i>S.story?'Primero completa la misión '+(S.story+1)+'.':c.h>lv?'Requiere ayuntamiento nivel '+c.h+'.':'';
      h=SCN.tag('ch:'+i,'Cap. '+(i+1))+'<div class="fi-h"><small>MISIÓN '+(i+1)+' DE '+STORY.length+'</small><b>'+c.n.replace(/^Cap\.\s*\d+\s*·\s*/,'')+'</b></div><div class="fi-b"><div class="fi-tags"><span class="tgc">'+c.loc.p+'</span></div><div class="fi-row"><span>Peligro</span>'+pips(c.g)+'</div><div class="fi-row"><span>Ayuntamiento</span><span class="tgc '+(c.h>lv?'no':'')+'">Nivel '+c.h+'</span></div><p class="fi-t">'+c.intro+'</p>'+(dn?'<p class="fi-ok">Misión completada. Puedes repetirla para conseguir botín.</p>':'')+(why?'<p class="fi-no">'+why+'</p>':'')+'<button class="big fw" '+(lk&&!dn?'disabled':'')+' onclick="exTab=\'hist\';exC='+i+';expMenu()">'+(dn?'Repetir misión':'Preparar misión')+'</button></div>'}
    else{const z=EXT_ZONES.find(q=>q.id===extPick)||EXT_ZONES[0];
      h='<div class="fi-h"><small>ZONA LIBRE · '+z.kind.toUpperCase()+'</small><b>'+z.n+'</b></div><div class="fi-b"><div class="fi-row"><span>Peligro</span>'+pips(z.g)+'</div><div class="fi-row"><span>Distancia</span><span class="tgc">'+z.dist+'</span></div><div class="fi-row"><span>Ayuntamiento</span><span class="tgc '+(z.h>lv?'no':'')+'">Nivel '+z.h+'</span></div><p class="fi-t">'+z.intro+'</p><div class="fi-lab">Botín probable</div><div class="rcs">'+Object.keys(z.loot).map(k=>rchip(k,z.loot[k][0]+'–'+z.loot[k][1])).join('')+'</div>'+(cnt('expo')<1?'<p class="fi-no">Construye primero un Centro de expediciones.</p>':'')+'<button class="big fw" '+(z.h>lv||cnt('expo')<1?'disabled':'')+' onclick="exTab=\'world\';exZ=EXT_ZONES.findIndex(q=>q.id===\''+z.id+'\');expMenu()">Preparar expedición</button></div>'}
    const nx=STORY[S.story];
    h+=nx?'<div class="fi-f"><button class="fw" onclick="storyPickIdx='+S.story+';fsRefresh();fsFocus()">Ir a la siguiente misión</button></div>':'<div class="fi-f"><b>Has completado toda la historia.</b></div>';
    infoEl.innerHTML=h};
  window.fsRefresh=()=>{info()};
  info();
  const M=wlayout(),BASE=buildBase();
  const posOf=m=>[m.x,m.y];
  const sMark=i=>M.find(m=>m.t==='s'&&m.i===i);
  const pick=m=>{if(m.t==='s'){window.storyPickIdx=m.i}else if(m.t==='z'){window.extPick=m.id;window.storyPickIdx=-1}else return;infoEl.classList.remove('hide');info()};
  VW=viewer(cv,{w:MW,h:MH,fill:1,maxZ:7,
    click:(x,y,V)=>{let best=null,bd=1e9;V.hits.forEach(h=>{const d=Math.hypot(h.x-x,h.y-y);if(d<h.r&&d<bd){bd=d;best=h.m}});if(best)pick(best)},
    draw:(c,V)=>{
      c.fillStyle='#0a0d0e';c.fillRect(0,0,V.w,V.h);
      c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
      c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=24;c.drawImage(BASE,V.tx,V.ty,MW*V.k,MH*V.k);c.restore();
      const sc=clamp(V.k*1.5,.5,2.8),S1=a=>[a.x*V.k+V.tx,a.y*V.k+V.ty];
      // ruta de la historia
      const pts=STORY.map((_,i)=>S1(sMark(i)));
      c.save();c.lineCap='round';
      for(let i=0;i<Math.min(pts.length-1,S.story);i++){const a=pts[i],b=pts[i+1],mx=(a[0]+b[0])/2+(b[1]-a[1])*.14,my=(a[1]+b[1])/2-(b[0]-a[0])*.14;
        c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(mx,my,b[0],b[1]);
        if(i<S.story){c.setLineDash([]);c.lineWidth=3;c.strokeStyle='rgba(60,110,40,.9)'}
        else if(i===S.story){c.setLineDash([9,7]);c.lineDashOffset=-V.t*22;c.lineWidth=3.4;c.strokeStyle='#b8431f'}
        else{c.setLineDash([3,7]);c.lineWidth=2;c.strokeStyle='rgba(70,50,25,.55)'}
        c.stroke()}
      c.restore();
      const order=M.slice().sort((a,b)=>a.y-b.y),late=[];
      order.forEach(m=>{const [x,y]=S1(m);
        if(m.t==='s'&&!sVis(m.i))return;if(m.t==='z'&&!zVis(EXT_ZONES.find(z=>z.id===m.id)))return;
        if(m.t==='b'){drawIcon(c,'base',x,y,sc*1.05,false,V.t);late.push(()=>plate(c,x,y+22*sc,'NUESTRA BASE',{fs:9,col:'#f2d27a',line:'#a8740f'}));return}
        if(m.t==='z'){const lk=EXT_ZONES.find(z=>z.id===m.id).h>lv,sel=storyPickIdx<0&&extPick===m.id;
          if(sel){c.save();c.strokeStyle='#b8431f';c.lineWidth=2.4;c.setLineDash([6,4]);c.lineDashOffset=-V.t*14;c.beginPath();c.ellipse(x,y+14*sc,24*sc,9*sc,0,0,TAU);c.stroke();c.restore()}
          drawIcon(c,m.kind,x,y,sc*.82,lk,V.t);
          if(sel||V.k>V.k0*2)late.push(()=>plate(c,x,y+22*sc,EXT_ZONES.find(z=>z.id===m.id).n.toUpperCase(),{fs:9,bg:'rgba(215,200,155,.95)',col:'#2b2214',line:'#2b2214'}));
          if(lk)lockGlyph(c,x+15*sc,y+9*sc,4);
          V.hits.push({x,y,r:22*sc,m});return}
        const i=m.i,dn=i<S.story,cu=i===S.story,lk=lockOf(i)&&!dn,sel=storyPickIdx===i,off=sel?-Math.abs(Math.sin(V.t*5))*3:0;
        if(cu){c.save();const pr=.5+.5*Math.sin(V.t*3.5);c.fillStyle='rgba(242,182,50,'+(.25+.2*pr)+')';c.beginPath();c.ellipse(x,y+14*sc,(26+6*pr)*sc,(10+2*pr)*sc,0,0,TAU);c.fill();c.restore()}
        if(sel){c.save();c.strokeStyle='#b8431f';c.lineWidth=2.6;c.beginPath();c.ellipse(x,y+14*sc,25*sc,9.5*sc,0,0,TAU);c.stroke();c.restore()}
        drawIcon(c,m.kind,x,y+off,sc,lk,V.t);
        const br=clamp(6+2.2*sc,8,14),bx=x-18*sc,by=y-16*sc+off;
        c.save();c.beginPath();c.arc(bx,by,br,0,TAU);c.fillStyle=dn?'#5f9a45':cu?'#f2b632':lk?'#7d7765':'#9a9272';c.fill();c.lineWidth=2;c.strokeStyle='#2b2214';c.stroke();
        if(dn){c.strokeStyle='#fff';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(bx-br*.4,by);c.lineTo(bx-br*.1,by+br*.32);c.lineTo(bx+br*.45,by-br*.32);c.stroke()}
        else{c.fillStyle=cu?'#1b1203':'#f2eee0';c.font='900 '+Math.round(br*1.1)+'px Bahnschrift,"Arial Narrow",system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(i+1,bx,by+.5)}c.restore();
        if(cu){c.save();c.fillStyle='#b8431f';c.strokeStyle='#2b2214';c.lineWidth=1.5;const ay=y-24*sc+Math.sin(V.t*5)*3;c.beginPath();c.moveTo(x,ay);c.lineTo(x-6,ay-9);c.lineTo(x+6,ay-9);c.closePath();c.fill();c.stroke();c.restore()}
        if(lk&&STORY[i].h>lv)lockGlyph(c,x+16*sc,y+9*sc,4.2);
        if(sel||cu||V.k>V.k0*2.2)late.push(()=>plate(c,x,y+22*sc,STORY[i].n.replace(/^Cap\.\s*\d+\s*·\s*/,'').toUpperCase(),{fs:9,bg:'rgba(215,200,155,.96)',col:'#2b2214',line:sel?'#b8431f':'#2b2214'}));
        V.hits.push({x,y,r:24*sc,m})});
      late.forEach(f=>f());
      vignette(c,V);
      const lx=12,ly=V.h-15;c.save();c.fillStyle='rgba(8,11,12,.8)';rrect(c,4,V.h-28,330,24,4);c.fill();c.font='700 10px Bahnschrift,"Arial Narrow",system-ui,sans-serif';c.textBaseline='middle';
      [['#f2b632','Misión actual'],['#5f9a45','Completada'],['#9a9272','Bloqueada']].forEach((q,k)=>{const x=lx+k*104;c.fillStyle=q[0];c.beginPath();c.arc(x+5,ly,5,0,TAU);c.fill();c.strokeStyle='#05080a';c.stroke();c.fillStyle='#d5dbd6';c.fillText(q[1],x+14,ly+.5)});c.restore();
    }});
  window.fsFocus=()=>{const i=storyPickIdx>=0?storyPickIdx:S.story;if(i>=STORY.length||!VW)return;const m=sMark(i),V=VW;V.k=V.k0*1.9;const aw=V.w-V.padR();V.tx=aw/2-m.x*V.k;V.ty=V.h/2-m.y*V.k;V.clampPan()};
  fsFocus();
};

/* ===============================================================
   2) TERRITORIO
================================================================ */
window.expandMenu=function(){
  const cv=fsOpen('terr','Territorio','Parcelas '+parcelCount()+' / '+PG*PG+' · Toca una parcela para ver su ficha');
  let sel=-1,CK=[];
  const refreshCK=()=>{CK=[];for(let id=0;id<PG*PG;id++)CK[id]=S.parc[id]?null:parcelCheck(id)};
  refreshCK();
  const avail=id=>!S.parc[id]&&CK[id]&&CK[id].why!=='Debe tocar una parcela tuya.';
  const info=()=>{
    let h='';
    if(sel<0){h='<div class="fi-h"><small>HOJA DE CATASTRO</small><b>Tu territorio</b></div><div class="fi-b"><div class="fi-row"><span>Parcelas</span><span class="tgc">'+parcelCount()+' / '+PG*PG+'</span></div><div class="bar"><i style="width:'+parcelCount()+'%;background:#f2b632"></i></div><p class="fi-t">Cada parcela mide '+PS+'×'+PS+' casillas. Compra las que tocan tu territorio para construir más lejos y llegar a todo el mapa.</p><ul class="leg"><li><s style="background:#f2b632"></s>Tuya</li><li><s class="dash"></s>Disponible</li><li><s style="background:#0009"></s>Aún lejos</li></ul></div>'}
    else{const inf=parcelInfo(sel),pb=PBIO[inf.dom],tot=PS*PS,comp=Object.keys(inf.c).filter(k=>PBIO[k]).sort((a,b)=>inf.c[b]-inf.c[a]);
      h='<div class="fi-h"><small>PARCELA '+(sel%PG+1)+' · '+(Math.floor(sel/PG)+1)+'</small><b>'+pb[0]+'</b></div><div class="fi-b"><p class="fi-t">'+pb[3]+'</p><div class="fi-lab">Composición</div>'+comp.map(k=>'<div class="comp"><s style="background:'+PBIO[k][1]+'"></s><span>'+PBIO[k][0]+'</span><div class="bar"><i style="width:'+Math.round(inf.c[k]/tot*100)+'%;background:'+shade(PBIO[k][1],1.15)+'"></i></div><em>'+Math.round(inf.c[k]/tot*100)+'%</em></div>').join('');
      if(S.parc[sel])h+='<p class="fi-ok">Esta parcela ya es parte de tu territorio.</p>';
      else{const k=CK[sel];h+='<div class="fi-lab">Coste</div><div class="rcs">'+costChips(k.cost)+'</div>'+(k.need?'<div class="fi-row"><span>Ayuntamiento</span><span class="tgc '+(hallLv()<k.need?'no':'')+'">Nivel '+k.need+'</span></div>':'')+(k.ok?'<button class="big fw" onclick="buyParcel('+sel+')">Comprar parcela</button>':'<p class="fi-no">'+k.why+'</p>')}
      h+='</div>'}
    infoEl.innerHTML=h};
  info();
  const poly4=(V,id)=>{const px=id%PG,py=Math.floor(id/PG),i0=px*PS,j0=py*PS,i1=i0+PS,j1=j0+PS;return[iso(V,i0,j0),iso(V,i1,j0),iso(V,i1,j1),iso(V,i0,j1)]};
  const hall=S.bld.find(b=>b.type=='hall');
  window._terrRefresh=()=>{refreshCK();fsT.querySelector('small').textContent='Parcelas '+parcelCount()+' / '+PG*PG+' · Toca una parcela para ver su ficha';info()};
  VW=viewer(cv,{w:TW,h:TH,fill:1.02,
    click:(x,y,V)=>{const [cx,cy]=V.inv(x,y),u=(cx-OX)/A,v=(cy-OY)*2/A,i=(u+v)/2,j=(v-u)/2;if(i<0||j<0||i>=N||j>=N)return;sel=Math.floor(j/PS)*PG+Math.floor(i/PS);infoEl.classList.remove('hide');info()},
    draw:(c,V)=>{
      drawTerrain(c,V);
      for(let id=0;id<PG*PG;id++){const q=poly4(V,id),own=S.parc[id],av=avail(id);
        if(own){poly(c,q,'rgba(255,214,90,.10)')}
        else if(av){const pu=.07+.07*Math.sin(V.t*3+id);poly(c,q,'rgba(255,255,255,'+pu+')');c.save();c.setLineDash([7,6]);c.lineDashOffset=-V.t*16;c.lineWidth=2;c.strokeStyle='rgba(255,255,255,.85)';c.beginPath();q.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();c.restore();
          const ck=CK[id];if(ck&&hallLv()<ck.need){const m=[(q[0][0]+q[2][0])/2,(q[0][1]+q[2][1])/2];lockGlyph(c,m[0],m[1],4.5)}}
        else{poly(c,q,'rgba(5,8,10,.55)')}
        if(!own&&!av)poly(c,q,null,'rgba(0,0,0,.35)',1)}
      ownedEdges(c,V,'#f2b632');
      if(sel>=0){const q=poly4(V,sel);c.save();c.shadowColor='#ff9d2e';c.shadowBlur=14;poly(c,q,'rgba(255,157,46,.22)','#ffb347',3.2);c.restore()}
      if(hall){const b=iso(V,hall.x+hall.w/2,hall.y+hall.h/2);baseFlag(c,b[0],b[1],V.t,clamp(.8+.2*V.k/V.k0,.8,1.5)*7)}
      vignette(c,V);
    }});
};
const _buy=window.buyParcel;
window.buyParcel=function(id){const n=parcelCount();_buy(id);if(cur==='terr'&&parcelCount()>n&&window._terrRefresh)window._terrRefresh()};

/* ===============================================================
   3) ÁRBOL DE INVESTIGACIÓN (red tipo Plague Inc)
================================================================ */
const BR={'Defensa':['#5aa9e6','def'],'Construcción':['#ffb347','cons'],'Energía':['#f2d43c','energy'],'Armamento':['#ec6b3a','arms'],'Exploración':['#4fd1c5','expl'],'Agricultura':['#8bc34a','agri'],'Medicina':['#ef5a7a','med']};
const ORDER=['Defensa','Construcción','Energía','Armamento','Exploración','Agricultura','Medicina'];
const PRE={agri2:['agri1'],med1:['agri1'],med2:['med1'],cons2:['cons1'],energy1:['cons1'],energy2:['energy1'],arms2:['arms1'],def1:['cons1'],def2:['def1'],expl2:['expl1'],veh1:['energy1'],veh2:['veh1'],mat2:['cons1'],mat3:['mat2'],mat4:['mat3'],mat5:['mat4']};
window.TECH_PRE=PRE;
let TW2=1200,TH2=900;
const NODE={},LBL={};
function layoutNodes(){
  const dep={},d=id=>{if(dep[id]!=null)return dep[id];const p=PRE[id]||[];return dep[id]=p.length?1+Math.max(...p.map(d)):0};
  TECH.forEach(t=>d(t[0]));let maxD=0;TECH.forEach(t=>maxD=Math.max(maxD,dep[t[0]]));
  const X0=215,DX=215,RH=118;let y=70;
  ORDER.forEach(b=>{const ts=TECH.filter(t=>t[1]===b);if(!ts.length)return;
    const col={};ts.forEach(t=>{const k=dep[t[0]];(col[k]=col[k]||[]).push(t)});
    const rows=Math.max(...Object.values(col).map(a=>a.length)),h=Math.max(1,rows)*RH;
    LBL[b]={x:70,y:y+h/2-14};
    Object.keys(col).forEach(k=>col[k].forEach((t,q)=>{NODE[t[0]]={x:X0+k*DX,y:y+(h-col[k].length*RH)/2+q*RH+RH/2-14,br:b,tier:+k}}));
    y+=h+14});
  TW2=X0+maxD*DX+130;TH2=y+30}
const TBY=id=>TECH.find(q=>q[0]===id);
function techWhy(t){
  if(!cnt('lab'))return'Necesitas un Laboratorio.';
  if(hallLv()<t[3])return'Requiere ayuntamiento nivel '+t[3]+'.';
  const m=(PRE[t[0]]||[]).filter(p=>!S.tech[p]);if(m.length)return'Requiere: '+m.map(p=>window.techName?techName(TBY(p)):TBY(p)[2]).join(', ')+'.';
  return'';
}
window.techWhyX=techWhy;
const tstate=t=>S.tech[t[0]]?'done':(window.rqIn&&rqIn(t[0]))?'prog':(techWhy(t)?'lock':'avail');
const techHid=t=>{try{return !S.tech[t[0]]&&(PRE[t[0]]||[]).some(p=>!S.tech[p])}catch(e){return false}};window.techHid=techHid;window.techGlyph=(c,t,x,y,r)=>{const b=BR[t[1]]||['#ccc','cons'];glyph(c,b[1],x,y,r,b[0],'#141b1e')};window.techCol=t=>(BR[t[1]]||['#ccc'])[0];
window.techName=t=>techHid(t)?'???':t[2];

function glyph(c,k,x,y,r,col,bg){
  c.save();c.translate(x,y);c.strokeStyle=col;c.fillStyle=col;c.lineWidth=r*.12;c.lineCap='round';c.lineJoin='round';
  if(k==='agri'){c.beginPath();c.moveTo(0,r*.6);c.lineTo(0,-r*.6);c.stroke();for(let q=0;q<3;q++){const yy=-r*.5+q*r*.38;[-1,1].forEach(sd=>{c.save();c.translate(0,yy);c.rotate(sd*.75);c.beginPath();c.ellipse(sd*r*.2,-r*.05,r*.22,r*.1,0,0,TAU);c.fill();c.restore()})}}
  else if(k==='med'){const a=r*.2,b=r*.58;c.beginPath();c.rect(-a,-b,a*2,b*2);c.rect(-b,-a,b*2,a*2);c.fill()}
  else if(k==='cons'){for(let q=0;q<8;q++){c.save();c.rotate(q*Math.PI/4);c.fillRect(-r*.1,-r*.62,r*.2,r*.28);c.restore()}c.beginPath();c.arc(0,0,r*.42,0,TAU);c.fill();c.fillStyle=bg;c.beginPath();c.arc(0,0,r*.18,0,TAU);c.fill()}
  else if(k==='energy'){c.beginPath();c.moveTo(r*.14,-r*.66);c.lineTo(-r*.34,r*.08);c.lineTo(-r*.02,r*.08);c.lineTo(-r*.16,r*.66);c.lineTo(r*.36,-r*.12);c.lineTo(r*.04,-r*.12);c.closePath();c.fill()}
  else if(k==='arms'){c.beginPath();c.arc(0,0,r*.42,0,TAU);c.stroke();[[0,-1],[0,1],[-1,0],[1,0]].forEach(d=>{c.beginPath();c.moveTo(d[0]*r*.28,d[1]*r*.28);c.lineTo(d[0]*r*.68,d[1]*r*.68);c.stroke()});c.beginPath();c.arc(0,0,r*.08,0,TAU);c.fill()}
  else if(k==='def'){c.beginPath();c.moveTo(0,-r*.64);c.lineTo(r*.5,-r*.4);c.lineTo(r*.46,r*.1);c.quadraticCurveTo(r*.3,r*.46,0,r*.66);c.quadraticCurveTo(-r*.3,r*.46,-r*.46,r*.1);c.lineTo(-r*.5,-r*.4);c.closePath();c.fill();c.strokeStyle=bg;c.lineWidth=r*.08;c.beginPath();c.moveTo(0,-r*.4);c.lineTo(0,r*.4);c.stroke()}
  else if(k==='expl'){c.beginPath();c.arc(0,0,r*.55,0,TAU);c.stroke();c.beginPath();c.moveTo(0,-r*.42);c.lineTo(r*.14,0);c.lineTo(0,r*.42);c.lineTo(-r*.14,0);c.closePath();c.fill();c.rotate(Math.PI/2);c.globalAlpha=.55;c.beginPath();c.moveTo(0,-r*.3);c.lineTo(r*.1,0);c.lineTo(0,r*.3);c.lineTo(-r*.1,0);c.closePath();c.fill()}
  else if(k==='veh'){c.beginPath();c.arc(0,0,r*.55,0,TAU);c.stroke();c.beginPath();c.arc(0,0,r*.15,0,TAU);c.fill();for(let q=0;q<6;q++){c.save();c.rotate(q*Math.PI/3);c.beginPath();c.moveTo(0,r*.15);c.lineTo(0,r*.52);c.stroke();c.restore()}}
  else if(k==='lab'){c.beginPath();c.moveTo(-r*.14,-r*.62);c.lineTo(r*.14,-r*.62);c.lineTo(r*.14,-r*.22);c.lineTo(r*.52,r*.5);c.quadraticCurveTo(r*.55,r*.64,r*.38,r*.64);c.lineTo(-r*.38,r*.64);c.quadraticCurveTo(-r*.55,r*.64,-r*.52,r*.5);c.lineTo(-r*.14,-r*.22);c.closePath();c.fill();c.fillStyle=bg;c.beginPath();c.arc(-r*.08,r*.34,r*.1,0,TAU);c.arc(r*.14,r*.46,r*.07,0,TAU);c.fill()}
  c.restore();
}

window.techMenu=function(){
  if(cur==='tech'&&window._techRefresh)return window._techRefresh();
  if(window._techSilent)return;
  window.rpFix&&rpFix();layoutNodes();
  const lab=cnt('lab')>0;
  const cv=fsOpen('tech','Investigación',lab?'Laboratorio operativo':'Necesitas un Laboratorio para investigar');
  let sel='',flash=null;
  const nDone=()=>TECH.filter(t=>S.tech[t[0]]).length;
  const head=()=>{fsT.querySelector('small').innerHTML='🔬 '+Math.floor(S.res.rp||0)+' / '+(window.rpCap?rpCap():0)+' PI · Investigadas '+nDone()+' / '+TECH.length+(cnt('lab')?'':' · <span style="color:#ef8a7a">Necesitas un Laboratorio</span>')};
  const info=()=>{
    let h='';
    if(!sel){h='<div class="fi-h"><small>CENTRO DE INVESTIGACIÓN</small><b>Árbol tecnológico</b></div><div class="fi-b"><div class="fi-row"><span>Progreso</span><span class="tgc">'+nDone()+' / '+TECH.length+'</span></div><div class="bar"><i style="width:'+Math.round(nDone()/TECH.length*100)+'%;background:#f2b632"></i></div><p class="fi-t">Toca un nodo para ver sus requisitos. Las tecnologías se desbloquean en cadena: investiga la anterior para abrir la siguiente.</p><ul class="leg"><li><s class="n done"></s>Investigada</li><li><s class="n avail"></s>Disponible</li><li><s class="n lock"></s>Bloqueada</li></ul><div class="fi-lab">Cola de investigación ('+(window.rqList?rqList().length:0)+'/'+(window.rqSlots?rqSlots():0)+')</div>'+((window.rqList&&rqList().length)?rqList().map(q=>'<div class="fi-row"><span>'+TBY(q.id)[2]+'</span><span class="tgc">'+q.left.toFixed(1)+' d</span></div>').join(''):'<p class="fi-t">Vacía. Los PI los produce el laboratorio (más nivel y mejor científico, más PI).</p>')+'</div>'}
    else{const t=TBY(sel),st=tstate(t),b=BR[t[1]],why=techWhy(t),aff=can(t[4]),full=window.rqList&&rqList().length>=rqSlots(),qi=window.rqList&&rqList().find(q=>q.id===sel);
      const reqs=[['Laboratorio',!!cnt('lab')],['Ayuntamiento nivel '+t[3],hallLv()>=t[3]]].concat((PRE[sel]||[]).map(p=>[techName(TBY(p)),!!S.tech[p]]));const hid=techHid(t);
      h='<div class="fi-h" style="border-bottom-color:'+b[0]+'"><small style="color:'+b[0]+'">'+t[1].toUpperCase()+'</small><b>'+(hid?'🔒 ???':t[2])+'</b></div><div class="fi-b"><p class="fi-t">'+(hid?'Tecnología desconocida. Investiga la anterior de esta rama para descubrir qué es.':t[5]+'.')+'</p>'+
        (st==='done'?'<p class="fi-ok">Tecnología investigada.</p>':st==='prog'?'<p class="fi-ok">En investigación: quedan '+(qi?qi.left.toFixed(1):'?')+' días.</p><button class="big fw" onclick="rqCancel(\''+sel+'\');_techRefresh()">Cancelar (recuperas los PI)</button>':'<div class="fi-lab">Requisitos</div><ul class="req">'+reqs.map(r=>'<li class="'+(r[1]?'ok':'no')+'">'+r[0]+'</li>').join('')+'</ul><div class="fi-lab">Coste</div><div class="rcs">'+costChips(t[4])+'</div><p class="fi-t">Duración: '+rpDays(t)+' días</p>'+
        '<button class="big fw" '+(why||!aff||full?'disabled':'')+' onclick="research(\''+sel+'\')">'+(why?'Bloqueada':(full?'Cola llena':(aff?'Investigar':'Faltan PI')))+'</button>')+'</div>'}
    infoEl.innerHTML=h;head()};
  head();info();
  window._techRefresh=()=>{info()};
  const edges=[];
  TECH.forEach(t=>{const pr=PRE[t[0]];if(pr)pr.forEach(p=>edges.push([p,t[0]]));else edges.push(['hub:'+t[1],t[0]])});
  const _r=window.research;
  VW=viewer(cv,{w:TW2,h:TH2,fill:1.7,left:8,top:8,maxZ:3,
    click:(x,y,V)=>{let best=null,bd=1e9;V.hits.forEach(h=>{const d=Math.hypot(h.x-x,h.y-y);if(d<h.r&&d<bd){bd=d;best=h}});sel=best?best.id:'';infoEl.classList.remove('hide');info()},
    draw:(c,V)=>{
      const k=V.k;
      // fondo tipo plano técnico
      const bg=c.createRadialGradient(V.w*.42,V.h*.5,20,V.w*.42,V.h*.5,Math.max(V.w,V.h)*.8);bg.addColorStop(0,'#16242a');bg.addColorStop(1,'#05080a');c.fillStyle=bg;c.fillRect(0,0,V.w,V.h);
      c.save();c.strokeStyle='rgba(120,160,170,.07)';c.lineWidth=1;const hs=46*k,hy=hs*.866;
      for(let r=-1;r*hy<V.h+hy;r++)for(let q=-1;q*hs*1.5<V.w+hs;q++){const x=q*hs*1.5+V.tx%(hs*3),y=r*hy*2+(q%2?hy:0)+V.ty%(hy*2);c.beginPath();for(let a=0;a<6;a++){const ang=a*Math.PI/3,px=x+Math.cos(ang)*hs*.5,py=y+Math.sin(ang)*hs*.5;a?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();c.stroke()}
      c.restore();
      const hub=V.s(60,60),lab=cnt('lab')>0;
      const P=id=>id.startsWith('hub:')?V.s(LBL[id.slice(4)].x,LBL[id.slice(4)].y):V.s(NODE[id].x,NODE[id].y);
      // conexiones
      edges.forEach(([a,b])=>{const pa=P(a),pb=P(b),tb=TBY(b),sb=tstate(tb),isH=a.startsWith('hub:'),sa=isH?(lab?'done':'lock'):tstate(TBY(a)),col=BR[tb[1]][0];
        c.save();c.lineCap='round';c.beginPath();c.moveTo(pa[0],pa[1]);c.lineTo(pb[0],pb[1]);
        if(sb==='done'){c.lineWidth=5*k;c.strokeStyle=col;c.shadowColor=col;c.shadowBlur=12;c.stroke();c.shadowBlur=0;c.lineWidth=1.6*k;c.strokeStyle='#fff';c.globalAlpha=.55;c.stroke()}
        else if(sa==='done'||isH&&lab){c.setLineDash([9*k,7*k]);c.lineDashOffset=-V.t*28*k;c.lineWidth=3.4*k;c.strokeStyle=shade(col,1.1);c.globalAlpha=(sb==='avail'||sb==='prog')?.95:.5;c.stroke()}
        else{c.setLineDash([4*k,8*k]);c.lineWidth=2.4*k;c.strokeStyle='#3a464b';c.stroke()}
        c.restore()});
      // etiquetas de rama (a la izquierda de cada fila)
      Object.keys(LBL).forEach(b=>{const q=V.s(LBL[b].x,LBL[b].y),col=BR[b][0],hr=34*k;
        c.save();c.shadowColor=lab?col:'#000';c.shadowBlur=lab?14:4;c.beginPath();c.arc(q[0],q[1],hr,0,TAU);c.fillStyle='#161d20';c.fill();c.lineWidth=3.4*k;c.strokeStyle=lab?col:'#566469';c.stroke();c.restore();
        glyph(c,BR[b][1],q[0],q[1],hr*.9,lab?col:'#7c8b8f','#161d20');
        plate(c,q[0],q[1]+hr+12*k,b.toUpperCase(),{fs:Math.max(8,9*k),col:lab?'#ffd877':'#97a39f',line:lab?col:'#3a464b'})});
      // nodos
      TECH.forEach(t=>{const n=NODE[t[0]],p=V.s(n.x,n.y),st0=tstate(t),st=st0==='prog'?'avail':st0,col=BR[t[1]][0],r=(n.tier?30:34)*k,gk=BR[t[1]][1];
        const pulse=Math.sin(V.t*3.2+n.x)*.5+.5,isSel=sel===t[0];
        c.save();
        if(st==='avail'){c.shadowColor=col;c.shadowBlur=10+16*pulse}
        if(st==='done'){c.shadowColor=col;c.shadowBlur=20}
        c.beginPath();c.arc(p[0],p[1],r,0,TAU);
        const g=c.createRadialGradient(p[0],p[1]-r*.4,2,p[0],p[1],r);
        if(st==='done'){g.addColorStop(0,shade(col,1.3));g.addColorStop(1,shade(col,.7))}else if(st==='avail'){g.addColorStop(0,'#33444b');g.addColorStop(1,'#141b1e')}else{g.addColorStop(0,'#242c30');g.addColorStop(1,'#0e1214')}
        c.fillStyle=g;c.fill();c.shadowBlur=0;
        c.lineWidth=(st==='avail'?3.4:3)*k;c.strokeStyle=st==='done'?'#fff':st==='avail'?col:'#3d484d';c.stroke();
        if(st==='avail'){c.beginPath();c.arc(p[0],p[1],r+(5+5*pulse)*k,0,TAU);c.lineWidth=1.6*k;c.strokeStyle=col;c.globalAlpha=.6-.4*pulse;c.stroke();c.globalAlpha=1}
        if(st0==='prog'){const qq=rqList().find(x=>x.id===t[0]),fr=qq?1-qq.left/qq.tot:0;c.beginPath();c.arc(p[0],p[1],r+6*k,-Math.PI/2,-Math.PI/2+TAU*fr);c.lineWidth=5*k;c.strokeStyle='#7fe0ff';c.stroke()}
        if(isSel){c.beginPath();c.arc(p[0],p[1],r+7*k,0,TAU);c.setLineDash([6*k,5*k]);c.lineDashOffset=-V.t*20*k;c.lineWidth=2.4*k;c.strokeStyle='#fff';c.stroke();c.setLineDash([])}
        if(techHid(t)){c.font='900 '+Math.round(r*.9)+'px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#566065';c.fillText('?',p[0],p[1]+r*.04)}else glyph(c,gk,p[0],p[1],r*.95,st==='done'?'#101517':st==='avail'?col:'#566065',st==='done'?shade(col,1.25):'#141b1e');
        if(st==='lock'){lockGlyph(c,p[0]+r*.72,p[1]+r*.72,r*.2)}
        if(st==='done'){c.beginPath();c.arc(p[0]+r*.75,p[1]-r*.75,r*.26,0,TAU);c.fillStyle='#2f7a3a';c.fill();c.lineWidth=1.5*k;c.strokeStyle='#fff';c.stroke();c.strokeStyle='#fff';c.lineWidth=2*k;c.beginPath();c.moveTo(p[0]+r*.64,p[1]-r*.74);c.lineTo(p[0]+r*.74,p[1]-r*.64);c.lineTo(p[0]+r*.9,p[1]-r*.9);c.stroke()}
        c.restore();
        plate(c,p[0],p[1]+r+12*k,techHid(t)?'???':t[2].toUpperCase(),{fs:Math.max(8,9*k),col:st==='lock'?'#8d9894':'#e9ece6',line:st==='done'?col:st==='avail'?col:'#3a464b'});
        if(st!=='done')plate(c,p[0],p[1]+r+32*k,'AYUNT. '+t[3]+' · '+(t[4].rp||0)+' PI',{fs:Math.max(7,8*k),col:hallLv()>=t[3]?'#97a39f':'#ef8a7a',bg:'rgba(8,11,12,.7)',line:'#2c3539'});
        V.hits.push({x:p[0],y:p[1],r:r+8*k,id:t[0]});
        if(flash&&flash.id===t[0]){const a=(performance.now()-flash.t0)/900;if(a<1){c.save();c.beginPath();c.arc(p[0],p[1],r+a*90*k,0,TAU);c.lineWidth=5*k*(1-a);c.strokeStyle=col;c.globalAlpha=1-a;c.stroke();c.restore()}else flash=null}
      });
      vignette(c,V);
    }});
  window._techRefresh=()=>{head();info()};
  window._techFlash=id=>{flash={id,t0:performance.now()}};
};
window.research=function(id){const t=TBY(id);if(!t||S.tech[id])return;const w=window.rqStart?rqStart(id):'Sin sistema';if(w)toast(w);if(cur==='tech'&&window._techRefresh)_techRefresh()};

/* ===============================================================
   4) FORMAR FAMILIA (antes "Sistema de parejas")
================================================================ */
window.pairUI=function(){
  let M=byId(pairM),F=byId(pairF);
  if(!M||whyNot(M)||M.sex!=='M'||M.age<18){pairM=0;M=null}
  if(!F||whyNot(F)||F.sex!=='F'||F.age<18){pairF=0;F=null}
  if(M&&F&&kin(M,F)){pairF=0;F=null;toast('Son parientes.')}
  const FF=window.FAMF=window.FAMF||{rol:'',disp:0},lvR=(p,k)=>(p.ps&&p.ps[k])||0,bestR=p=>Math.max(0,...Object.values(p.ps||{}));
  const lst=(sx,sel,other,k)=>{let a=S.ppl.filter(p=>p.sex===sx&&p.age>=18);if(FF.rol)a=a.filter(p=>lvR(p,FF.rol)>0||p.id===sel);if(FF.disp)a=a.filter(p=>p.id===sel||!(whyNot(p)||(other&&kin(p,other))));const un=p=>(whyNot(p)||(other&&kin(p,other)))?1:0;a.sort((x,y)=>un(x)-un(y)||(FF.rol?lvR(y,FF.rol)-lvR(x,FF.rol):bestR(y)-bestR(x)));return a.length?'<div class="pg sm">'+a.map(p=>{const w=whyNot(p)||(other&&kin(p,other)?'pariente':'');const wt=w?(window.whyTxt?whyTxt(p,w):w):'';let h=pcard(p,w?`toast('${p.n} no está disponible: ${wt}.')`:`pairPick('${k}',${p.id})`,(sel===p.id?'sel ':'')+(w?'dis':''),wt||(sel===p.id?'✔':''));if(FF.rol)h=h.replace(/<\/div>$/,'<small style="color:#e0b020">★ '+FF.rol+' '+lvR(p,FF.rol)+'/10</small></div>');return h}).join('')+'</div>':'<p><small>'+(FF.rol||FF.disp?'Nadie cumple el filtro.':'No hay adultos de este sexo.')+'</small></p>'};
  const inh=(M&&F&&window.inheritRoles)?(()=>{const t={ps:{}};inheritRoles(t,F,M);return Object.entries(t.ps).filter(e=>e[1]>0).map(e=>e[0]+' '+e[1]).join(', ')})():'';
  const fbar='<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0">'+chipSel('fam_rol',FF.rol,[['','Todos los roles']].concat(PF.map(k=>[k,k])),'FAMF.rol=$V','pairUI()')+'<button class="cps'+(FF.disp?' on':'')+'" onclick="FAMF.disp=FAMF.disp?0:1;pairUI()">'+(FF.disp?'✓ ':'')+'Solo disponibles</button>'+(inh?'<span class="tgc" style="background:#2a3a1e">El bebé heredaría: '+inh+'</span>':'')+'</div>';
  const full=S.pregnancies.length>=(window.pregMax?pregMax():2),ok=M&&F&&!full;
  const slot=(p,lab)=>'<div class="fam-slot'+(p?' on':'')+'">'+(p?'<canvas class="pf" data-id="'+p.id+'" width="120" height="126"></canvas><b>'+p.n+'</b>':'<span class="ph"></span><b>—</b>')+'<small>'+lab+'</small></div>';
  const heart='<svg class="fam-heart'+(ok?' on':'')+'" viewBox="0 0 24 22"><path d="M12 21C5 15.5 1.5 12 1.5 7.6 1.5 4.6 3.8 2.5 6.6 2.5c2 0 3.9 1.1 5.4 3.2 1.5-2.100 3.400-3.200 5.400-3.200 2.800 0 5.100 2.100 5.100 5.100 0 4.400-3.500 7.900-10.500 13.400z"/></svg>';
  const sc=$('pan').scrollTop;
  show('Formar una familia',
   '<div class="fam-info"><span class="tgc">Embarazos '+S.pregnancies.length+' / '+pregMax()+'</span><span class="tgc">Gestación 3 d</span><span class="tgc">Crecimiento 3 d</span><span class="tgc">Descanso 4 d</span><span class="tgc" title="La embarazada come el doble">Come ×2</span><span class="tgc" title="El bebé hereda la mitad del rol más alto de cada padre; si comparten rol, se suman (máx. 7)">Hereda roles</span><span class="tgc">Gemelos 10%</span></div>'+
   '<div class="fam-bar">'+slot(F,'Madre')+heart+slot(M,'Padre')+'<button class="big" '+(ok?'':'disabled')+' onclick="pairGo()">'+(ok?'Formar pareja':(full?'Sin espacio':'Elige a ambos'))+'</button></div>'+
   fbar+'<div class="fam-cols"><div><div class="fi-lab">Madre</div>'+lst('F',pairF,M,'F')+'</div><div><div class="fi-lab">Padre</div>'+lst('M',pairM,F,'M')+'</div></div>');
  paintCards();$('pan').scrollTop=sc;
};
const _pg=window.pairGo;
window.pairGo=function(){_pg();document.querySelectorAll('#pan .pg').forEach(e=>e.classList.add('sm'))};
})();
