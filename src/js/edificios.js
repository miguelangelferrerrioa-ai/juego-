/* ===== Dead Town · motor de arte de edificios v3 =====
   Los edificios se pintan una vez en un sprite (caché) con fachadas en perspectiva isométrica real
   y se dibujan después con drawImage. Lo animado (humo, banderas, luces) va aparte en live(). */
(function(){
const OLC='#2a1a11';
const V=(u,v,zz)=>{const p=P(u,v);return[p[0],p[1]-zz]};
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const RGB=(q,k)=>'rgb('+Math.min(255,Math.round(q[0]*k))+','+Math.min(255,Math.round(q[1]*k))+','+Math.min(255,Math.round(q[2]*k))+')';
const Q=col=>parseCol(fs(col));
const rnd=(a,b,c)=>nh((a*7919+b*104729+c*1299709)|0,(a*31+b*17+c*13+977)|0);
function pl(c,pts,fill,stroke,lw){c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||2.2;c.lineJoin='round';c.stroke()}}
function lg(c,x0,y0,x1,y1,s){const g=c.createLinearGradient(x0,y0,x1,y1);s.forEach(([o,col])=>g.addColorStop(o,col));return g}
function line(c,a,b,col,lw){c.strokeStyle=col;c.lineWidth=lw||1.5;c.lineCap='round';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}

/* ---- transformación a una cara: X a lo largo de la cara (px), Y hacia arriba negativo ---- */
function faceTf(c,side,x,y,w,h,z0,fn){const o=side==='L'?P(x,y+h):P(x+w,y+h);c.save();c.translate(o[0],o[1]-z0);c.transform(1,side==='L'?.5:-.5,0,1,0,0);fn(side==='L'?w*32:h*32);c.restore()}

/* ---- materiales de pared (se pintan sobre el color base de la cara) ---- */
function matP(c,m,len,H,q,s){const dk='rgba(28,16,9,',lt='rgba(255,246,220,';
 if(m==='brick'){for(let r=0;r*5<H;r++){const yy=-H+r*5,off=(r%2)*5;for(let X=-off;X<len;X+=10){const n=rnd(r,(X/10)|0,s);if(n<.22){c.fillStyle=dk+'.12)';c.fillRect(X+.6,yy+.6,8.8,3.8)}else if(n>.8){c.fillStyle=lt+'.13)';c.fillRect(X+.6,yy+.6,8.8,3.8)}}}
  c.strokeStyle=dk+'.2)';c.lineWidth=.9;c.beginPath();for(let r=0;r*5<=H;r++){const yy=-H+r*5,off=(r%2)*5;c.moveTo(0,yy);c.lineTo(len,yy);for(let X=-off+10;X<len;X+=10){c.moveTo(X,yy);c.lineTo(X,yy+5)}}c.stroke()}
 else if(m==='plank'){for(let r=0;r*4.5<H;r++){const yy=-H+r*4.5,n=rnd(r,3,s);c.fillStyle=n<.3?dk+'.10)':n>.7?lt+'.12)':'rgba(0,0,0,0)';c.fillRect(0,yy,len,4.5);c.fillStyle=lt+'.16)';c.fillRect(0,yy+.3,len,1);c.fillStyle=dk+'.34)';c.fillRect(0,yy+3.8,len,.9);
   const j=rnd(r,9,s)*len;c.fillStyle=dk+'.3)';c.fillRect(j,yy,.9,4.5)}}
 else if(m==='metal'){for(let X=0;X<len;X+=4){c.fillStyle=((X/4)|0)%2?dk+'.11)':lt+'.13)';c.fillRect(X,-H,4,H)}c.fillStyle=lt+'.2)';for(let X=0;X<len;X+=4)c.fillRect(X+.2,-H,.7,H);
   for(let i=0;i<3;i++){const X=rnd(i,1,s)*len,Y=-H*(.3+rnd(i,2,s)*.6);c.fillStyle='rgba(140,66,28,.28)';c.beginPath();c.ellipse(X,Y,3+rnd(i,3,s)*6,2+rnd(i,4,s)*3,0,0,7);c.fill()}}
 else if(m==='block'){for(let r=0;r*6<H;r++){const yy=-H+r*6,off=(r%2)*6;for(let X=-off;X<len;X+=12){const n=rnd(r,(X/12)|0,s);if(n<.25){c.fillStyle=dk+'.09)';c.fillRect(X+.6,yy+.6,10.8,4.8)}else if(n>.8){c.fillStyle=lt+'.11)';c.fillRect(X+.6,yy+.6,10.8,4.8)}}}
  c.strokeStyle=dk+'.26)';c.lineWidth=.9;c.beginPath();for(let r=0;r*6<=H;r++){const yy=-H+r*6,off=(r%2)*6;c.moveTo(0,yy);c.lineTo(len,yy);for(let X=-off+12;X<len;X+=12){c.moveTo(X,yy);c.lineTo(X,yy+6)}}c.stroke()}
 else{/* plaster */for(let i=0;i<5;i++){const X=rnd(i,5,s)*len,Y=-H*rnd(i,6,s);c.fillStyle=i%2?lt+'.07)':dk+'.07)';c.beginPath();c.ellipse(X,Y,6+rnd(i,7,s)*12,3+rnd(i,8,s)*6,0,0,7);c.fill()}
  for(let i=0;i<2;i++){const X=rnd(i,10,s)*len,Y=-H*(.2+rnd(i,11,s)*.6);c.strokeStyle=dk+'.28)';c.lineWidth=.9;c.beginPath();c.moveTo(X,Y);c.lineTo(X+3,Y+4);c.lineTo(X+1,Y+8);c.lineTo(X+5,Y+12);c.stroke()}}
 /* desgaste: suciedad en la base y regueros de lluvia */
 const g=c.createLinearGradient(0,-8,0,0);g.addColorStop(0,'rgba(40,26,12,0)');g.addColorStop(1,'rgba(40,26,12,.18)');c.fillStyle=g;c.fillRect(0,-8,len,8);
 for(let i=0;i<4;i++){const X=rnd(i,12,s)*len,L2=H*(.25+rnd(i,13,s)*.5);c.fillStyle=dk+'.07)';c.fillRect(X,-H,1.6,L2)}}

/* ---- volumen macizo ---- */
function vol(c,o){const{x,y,w,h,z}=o,z0=o.z0||0,q=Q(o.col),mat=o.mat||'plaster',s=o.seed||1;
 const E0=V(x,y+h,z0),D0=V(x+w,y+h,z0),B0=V(x+w,y,z0),E1=V(x,y+h,z0+z),D1=V(x+w,y+h,z0+z),B1=V(x+w,y,z0+z),A1=V(x,y,z0+z);
 pl(c,[E0,D0,D1,E1],lg(c,0,E1[1],0,E0[1],[[0,RGB(q,1.04)],[1,RGB(q,.9)]]));
 faceTf(c,'L',x,y,w,h,z0,len=>{c.save();c.beginPath();c.rect(0,-z,len,z);c.clip();matP(c,mat,len,z,q,s);c.restore();if(o.decL)o.decL(c,len,z)});
 pl(c,[D0,B0,B1,D1],lg(c,0,D1[1],0,D0[1],[[0,RGB(q,.78)],[1,RGB(q,.64)]]));
 faceTf(c,'R',x,y,w,h,z0,len=>{c.save();c.beginPath();c.rect(0,-z,len,z);c.clip();c.globalAlpha=.9;matP(c,mat,len,z,q,s+5);c.globalAlpha=1;c.fillStyle='rgba(10,8,20,.08)';c.fillRect(0,-z,len,z);c.restore();if(o.decR){c.save();c.globalAlpha=.82;o.decR(c,len,z);c.restore()}});
 if(!o.noTop){pl(c,[A1,B1,D1,E1],o.topCol?o.topCol:RGB(q,1.14))}
 line(c,mix(E1,D1,0),D1,'rgba(255,255,255,.5)',1.8);line(c,D1,B1,'rgba(255,255,255,.35)',1.8);
 c.strokeStyle=OLC;c.lineWidth=2.4;c.lineJoin='round';c.beginPath();[E0,D0,B0,B1,A1,E1].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
 c.lineWidth=1.9;c.beginPath();c.moveTo(D0[0],D0[1]);c.lineTo(D1[0],D1[1]);c.moveTo(E1[0],E1[1]);c.lineTo(D1[0],D1[1]);c.lineTo(B1[0],B1[1]);c.stroke()}

/* ---- ventanas, puertas y detalles de fachada (coordenadas de cara) ---- */
function wnd(c,x,y,w,h,o){o=o||{};const t=o.t||'glass',fr=o.frame||'#eadfc2';
 c.fillStyle=OLC;c.fillRect(x-1.8,y-1.8,w+3.6,h+3.6);c.fillStyle=fr;c.fillRect(x-.8,y-.8,w+1.6,h+1.6);
 const gx=x+1.1,gy=y+1.1,gw=w-2.2,gh=h-2.2;
 if(t==='board'){c.fillStyle='#0d0907';c.fillRect(gx,gy,gw,gh);c.fillStyle='#8a6038';c.fillRect(gx-1,gy+gh*.12,gw+2,gh*.26);c.fillRect(gx-1,gy+gh*.56,gw+2,gh*.26);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(gx-1,gy+gh*.36,gw+2,1);c.fillRect(gx-1,gy+gh*.8,gw+2,1);c.fillStyle='#d6c9a6';c.fillRect(gx,gy+gh*.2,1.2,1.2);c.fillRect(gx+gw-1.4,gy+gh*.64,1.2,1.2)}
 else{c.fillStyle=o.lit?lg(c,0,gy,0,gy+gh,[[0,'#ffe9a8'],[1,'#f0b44a']]):lg(c,0,gy,0,gy+gh,[[0,'#b4e3ee'],[1,'#5d93a8']]);c.fillRect(gx,gy,gw,gh);
  c.fillStyle='rgba(255,255,255,.38)';c.beginPath();c.moveTo(gx,gy+gh*.62);c.lineTo(gx+gw*.55,gy);c.lineTo(gx+gw*.85,gy);c.lineTo(gx,gy+gh*.95);c.closePath();c.fill();
  c.fillStyle=fr;c.fillRect(gx+gw/2-.6,gy,1.2,gh);if(h>13)c.fillRect(gx,gy+gh/2-.6,gw,1.2);
  if(t==='broken'){c.fillStyle='#0d0907';c.beginPath();c.moveTo(gx+gw,gy);c.lineTo(gx+gw*.45,gy);c.lineTo(gx+gw*.7,gy+gh*.4);c.lineTo(gx+gw,gy+gh*.35);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.7;c.beginPath();c.moveTo(gx+gw*.7,gy+gh*.4);c.lineTo(gx+gw*.3,gy+gh*.7);c.moveTo(gx+gw*.7,gy+gh*.4);c.lineTo(gx+gw*.5,gy+gh);c.stroke()}
  if(o.curtain){c.fillStyle=o.curtain;c.fillRect(gx,gy,gw*.32,gh*.8);c.fillRect(gx+gw*.68,gy,gw*.32,gh*.8)}}
 c.fillStyle='#cfc3a4';c.fillRect(x-2.6,y+h+.8,w+5.2,2.4);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x-2.6,y+h+3,w+5.2,1.1);c.strokeStyle=OLC;c.lineWidth=.9;c.strokeRect(x-2.6,y+h+.8,w+5.2,2.4);
 if(o.shut){c.fillStyle=o.shut;c.fillRect(x-5.6,y-1,4.2,h+2);c.fillRect(x+w+1.4,y-1,4.2,h+2);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(x-5.6,y-1,4.2,h+2);c.strokeRect(x+w+1.4,y-1,4.2,h+2);c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=.7;for(let k=1;k<4;k++){const yy=y-1+k*(h+2)/4;c.beginPath();c.moveTo(x-5.6,yy);c.lineTo(x-1.4,yy);c.moveTo(x+w+1.4,yy);c.lineTo(x+w+5.6,yy);c.stroke()}}}
function dor(c,x,y,w,h,o){o=o||{};const col=o.col||'#8b5a30';
 c.fillStyle='#cfc3a4';c.fillRect(x-1.2,y+h,w+2.4,3);c.fillStyle='#a79b82';c.fillRect(x-2.6,y+h+3,w+5.2,2.6);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(x-1.2,y+h,w+2.4,3);c.strokeRect(x-2.6,y+h+3,w+5.2,2.6);
 c.fillStyle=OLC;c.fillRect(x-2.4,y-2.4,w+4.8,h+2.4);c.fillStyle='#eadfc2';c.fillRect(x-1.2,y-1.2,w+2.4,h+1.2);c.fillStyle=col;c.fillRect(x,y,w,h);
 c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x,y,w*.28,h);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;const pw=(w-4)/2,ph=(h-6)/2;for(let i=0;i<2;i++)for(let j=0;j<2;j++)c.strokeRect(x+1.3+i*(pw+1.4),y+1.5+j*(ph+1.6),pw,ph);
 c.fillStyle='#f3cf6a';c.beginPath();c.arc(x+w-2.4,y+h*.55,1.3,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=.8;c.stroke();
 if(o.awning){c.fillStyle=o.awning;pl(c,[[x-4,y-3],[x+w+4,y-3],[x+w+6,y-9],[x-6,y-9]],o.awning,OLC,1.4);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x-5,y-8,w+10,1.4);for(let i=0;i<5;i++){c.fillStyle=i%2?'rgba(255,255,255,.35)':'rgba(0,0,0,.18)';c.fillRect(x-4+i*((w+8)/5),y-3.8,(w+8)/5,2)}}}
function sign(c,x,y,w,h,txt,col,fcol){c.fillStyle=OLC;c.fillRect(x-1.6,y-1.6,w+3.2,h+3.2);c.fillStyle=col||'#e8d9a4';c.fillRect(x,y,w,h);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x,y,w,1.4);c.fillStyle=fcol||'#3a2616';c.font='bold '+Math.max(5,Math.min(h-3,8))+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x+w/2,y+h/2+.4)}
function plateX(c,x,y,s){c.strokeStyle='rgba(190,40,30,.85)';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(x-s,y-s);c.lineTo(x+s,y+s);c.moveTo(x+s,y-s);c.lineTo(x-s,y+s);c.stroke()}
function patch(c,x,y,w,h,col){c.fillStyle=col||'#8f959a';c.fillRect(x,y,w,h);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(x,y,w,h);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x,y,w,1.2);c.fillStyle='#2a1a11';for(const[a,b]of[[x+1.6,y+1.6],[x+w-1.6,y+1.6],[x+1.6,y+h-1.6],[x+w-1.6,y+h-1.6]]){c.beginPath();c.arc(a,b,.8,0,7);c.fill()}}

/* ---- tejados ---- */
function plane(c,A,B,C,D,col,rows,tile,seed){/* A-B = alero, D-C = cumbrera */const q=Q(col);pl(c,[A,B,C,D],lg(c,0,Math.min(A[1],D[1],C[1],B[1]),0,Math.max(A[1],D[1],C[1],B[1]),[[0,RGB(q,1.12)],[1,RGB(q,.82)]]));
 c.save();pl(c,[A,B,C,D]);c.clip();
 for(let i=0;i<rows;i++){const t0=i/rows,t1=(i+1)/rows,a=mix(A,D,t0),b=mix(B,C,t0),a1=mix(A,D,t1),b1=mix(B,C,t1);
  const n=rnd(i,seed,5);c.fillStyle=n<.3?'rgba(0,0,0,.08)':n>.7?'rgba(255,255,255,.08)':'rgba(0,0,0,0)';pl(c,[a,b,b1,a1],c.fillStyle);
  line(c,a,b,'rgba(25,12,6,.4)',1.1);line(c,mix(a,b,0),mix(a,b,1),'rgba(255,255,255,.0)',0);
  if(tile){const cnt=tile;for(let j=(i%2)*.5;j<cnt;j++){const t=j/cnt,p=mix(a,b,t),p1=mix(a1,b1,t);line(c,p,mix(p,p1,.9),'rgba(25,12,6,.3)',.9)}}}
 c.restore()}
function eaveShadow(c,A,B,k){line(c,A,B,'rgba(0,0,0,.25)',k||3)}
/* tejado a dos aguas: caballete a lo largo de Y (el piñón da a la cara frontal izquierda) */
function gableY(c,o){const{x,y,w,h,z,rh,col,oh=.18,wallCol,mat,seed}=o,zE=z-1;
 const q=Q(wallCol||col);
 {const Ab=V(x-oh,y-oh,zE),Ea=V(x-oh,y+h+oh,zE),Rf0=V(x+w/2,y+h+oh,z+rh+1),Rb0=V(x+w/2,y-oh,z+rh+1);plane(c,Ea,Ab,Rb0,Rf0,col,o.rows||7,o.tile||0,(seed||3)+9);c.save();pl(c,[Ea,Ab,Rb0,Rf0],'rgba(255,240,210,.12)');c.restore();c.strokeStyle=OLC;c.lineWidth=2.2;c.lineJoin='round';c.beginPath();c.moveTo(Ea[0],Ea[1]);c.lineTo(Ab[0],Ab[1]);c.lineTo(Rb0[0],Rb0[1]);c.stroke()}
 /* piñón triangular (pared) en la cara frontal-izq. */
 const gE=V(x,y+h,z),gD=V(x+w,y+h,z),gR=V(x+w/2,y+h,z+rh);
 pl(c,[gE,gD,gR],lg(c,0,gR[1],0,gE[1],[[0,RGB(q,1)],[1,RGB(q,.82)]]));
 faceTf(c,'L',x,y,w,h,z,len=>{c.save();c.beginPath();c.moveTo(0,0);c.lineTo(len,0);c.lineTo(len/2,-rh);c.closePath();c.clip();matP(c,mat||'plank',len,rh,q,seed||2);if(o.gable)o.gable(c,len,rh);c.restore()});
 const E=V(x-oh,y+h+oh,zE),Dd=V(x+w+oh,y+h+oh,zE),Bd=V(x+w+oh,y-oh,zE);
 const Rf=V(x+w/2,y+h+oh,z+rh+1),Rb=V(x+w/2,y-oh,z+rh+1),Ef=V(x-oh,y+h+oh,zE);
 plane(c,Dd,Bd,Rb,Rf,col,o.rows||7,o.tile||0,seed||3);
 c.strokeStyle=OLC;c.lineWidth=2.4;c.lineJoin='round';c.beginPath();c.moveTo(E[0],E[1]);c.lineTo(Rf[0],Rf[1]);c.lineTo(Dd[0],Dd[1]);c.lineTo(Bd[0],Bd[1]);c.lineTo(Rb[0],Rb[1]);c.lineTo(Rf[0],Rf[1]);c.stroke();
 line(c,E,Dd,OLC,2.6);
 line(c,mix(Rf,Rb,.02),mix(Rf,Rb,.98),'rgba(255,240,200,.45)',1.6);
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.4;c.beginPath();c.moveTo(E[0]+1,E[1]+1.5);c.lineTo(Rf[0],Rf[1]+1.5);c.stroke()}
/* tejado a dos aguas: caballete a lo largo de X (el piñón da a la cara derecha) */
function gableX(c,o){const{x,y,w,h,z,rh,col,oh=.18,wallCol,mat,seed}=o,zE=z-1,q=Q(wallCol||col);
 {const Ab=V(x-oh,y-oh,zE),Bd0=V(x+w+oh,y-oh,zE),R10=V(x-oh,y+h/2,z+rh+1),R20=V(x+w+oh,y+h/2,z+rh+1);plane(c,Ab,Bd0,R20,R10,col,o.rows||7,o.tile||0,(seed||3)+9);c.strokeStyle=OLC;c.lineWidth=2.2;c.lineJoin='round';c.beginPath();c.moveTo(Ab[0],Ab[1]);c.lineTo(Bd0[0],Bd0[1]);c.moveTo(R10[0],R10[1]);c.lineTo(R20[0],R20[1]);c.stroke()}
 const gD=V(x+w,y+h,z),gB=V(x+w,y,z),gR=V(x+w,y+h/2,z+rh);
 pl(c,[gD,gB,gR],lg(c,0,gR[1],0,gD[1],[[0,RGB(q,.74)],[1,RGB(q,.55)]]));
 faceTf(c,'R',x,y,w,h,z,len=>{c.save();c.beginPath();c.moveTo(0,0);c.lineTo(len,0);c.lineTo(len/2,-rh);c.closePath();c.clip();c.globalAlpha=.85;matP(c,mat||'plank',len,rh,q,(seed||2)+4);c.globalAlpha=1;c.fillStyle='rgba(10,8,20,.2)';c.fillRect(0,-rh,len,rh);c.restore()});
 const E=V(x-oh,y+h+oh,zE),Dd=V(x+w+oh,y+h+oh,zE),Bd=V(x+w+oh,y-oh,zE),Ab=V(x-oh,y-oh,zE);
 const R1=V(x-oh,y+h/2,z+rh+1),R2=V(x+w+oh,y+h/2,z+rh+1);
 plane(c,E,Dd,R2,R1,col,o.rows||7,o.tile||0,seed||3);
 c.strokeStyle=OLC;c.lineWidth=2.4;c.lineJoin='round';c.beginPath();c.moveTo(E[0],E[1]);c.lineTo(Dd[0],Dd[1]);c.lineTo(Bd[0],Bd[1]);c.moveTo(Dd[0],Dd[1]);c.lineTo(R2[0],R2[1]);c.lineTo(R1[0],R1[1]);c.lineTo(E[0],E[1]);c.stroke();
 line(c,R1,R2,'rgba(255,240,200,.45)',1.6);line(c,E,Dd,'rgba(255,255,255,.3)',1.2)}
function hip(c,o){const{x,y,w,h,z,rh,col,oh=.2,rows=6}=o,q=Q(col),E=V(x-oh,y+h+oh,z),D=V(x+w+oh,y+h+oh,z),B=V(x+w+oh,y-oh,z),A=V(x+w/2,y+h/2,z+rh);
 {const Ab=V(x-oh,y-oh,z);pl(c,[E,Ab,A],RGB(q,.95),OLC,2);pl(c,[Ab,B,A],RGB(q,.78),OLC,2)}
 pl(c,[E,D,A],lg(c,0,A[1],0,E[1],[[0,RGB(q,1.15)],[1,RGB(q,.88)]]));pl(c,[D,B,A],lg(c,0,A[1],0,D[1],[[0,RGB(q,.85)],[1,RGB(q,.6)]]));
 c.save();pl(c,[E,D,B,A]);c.clip();for(let i=1;i<rows;i++){const t=i/rows;line(c,mix(E,A,t),mix(D,A,t),'rgba(25,12,6,.32)',1);line(c,mix(D,A,t),mix(B,A,t),'rgba(25,12,6,.38)',1)}c.restore();
 c.strokeStyle=OLC;c.lineWidth=2.4;c.lineJoin='round';c.beginPath();c.moveTo(E[0],E[1]);c.lineTo(D[0],D[1]);c.lineTo(B[0],B[1]);c.lineTo(A[0],A[1]);c.closePath();c.moveTo(D[0],D[1]);c.lineTo(A[0],A[1]);c.stroke();line(c,E,A,'rgba(255,255,255,.35)',1.3)}
/* azotea plana con parapeto macizo: devuelve funciones para dibujar contenido entre parapetos traseros y delanteros */
function flatRoof(c,o,mid){const{x,y,w,h,z,col,t=.18,ph=3}=o,q=Q(col);
 /* superficie */const a=V(x+t,y+t,z),b=V(x+w-t,y+t,z),d=V(x+w-t,y+h-t,z),e=V(x+t,y+h-t,z);
 pl(c,[a,b,d,e],lg(c,0,a[1],0,e[1],[[0,RGB(q,1.0)],[1,RGB(q,.86)]]));
 c.save();pl(c,[a,b,d,e]);c.clip();for(let i=0;i<w*3;i++){const p=mix(e,d,i/(w*3)),p2=mix(a,b,i/(w*3));line(c,p,p2,'rgba(0,0,0,.12)',1)}c.restore();
 /* parapetos traseros (se ve su cara interior) */
 vol(c,{x:x,y:y,w:w,h:t,z:ph,z0:z,col:o.pcol||col,mat:'block',seed:3});
 vol(c,{x:x,y:y,w:t,h:h,z:ph,z0:z,col:o.pcol||col,mat:'block',seed:4});
 if(mid)mid();
 vol(c,{x:x,y:y+h-t,w:w,h:t,z:ph,z0:z,col:o.pcol||col,mat:'block',seed:5});
 vol(c,{x:x+w-t,y:y,w:t,h:h,z:ph,z0:z,col:o.pcol||col,mat:'block',seed:6})}

/* ---- objetos ---- */
function cyl(c,cx,cy,r,hh,col,o){o=o||{};const q=Q(col),k=r*.46;
 c.fillStyle=lg(c,cx-r,0,cx+r,0,[[0,RGB(q,1.12)],[.45,RGB(q,.95)],[1,RGB(q,.6)]]);c.beginPath();c.moveTo(cx-r,cy);c.lineTo(cx-r,cy-hh);c.ellipse(cx,cy-hh,r,k,0,Math.PI,0,true);c.lineTo(cx+r,cy);c.ellipse(cx,cy,r,k,0,0,Math.PI);c.closePath();c.fill();
 c.strokeStyle=OLC;c.lineWidth=2;c.stroke();
 c.fillStyle=o.topCol||RGB(q,1.2);c.beginPath();c.ellipse(cx,cy-hh,r,k,0,0,7);c.fill();c.stroke();
 if(o.bands){c.strokeStyle='rgba(20,10,4,.35)';c.lineWidth=1.2;for(let i=1;i<=o.bands;i++){const yy=cy-hh*i/(o.bands+1);c.beginPath();c.ellipse(cx,yy,r,k,0,0,Math.PI);c.stroke()}}}
function crate(c,x,y,z,s,col){vol(c,{x,y,w:s,h:s,z:s*14,z0:z||0,col:col||'#b98a4e',mat:'plank',seed:7})}
function sacks(c,x,y,n,z){for(let i=0;i<n;i++){const p=V(x+i*.24,y,z||0);c.fillStyle=i%2?'#c9b983':'#b8a56d';c.beginPath();c.ellipse(p[0],p[1]-3.5,6.4,4.2,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.6;c.stroke();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(p[0]-1.5,p[1]-5,3,1.5,0,0,7);c.fill()}}
function wire(c,a,b,n){c.strokeStyle='#cfd3d4';c.lineWidth=1.1;c.beginPath();c.moveTo(a[0],a[1]);for(let i=1;i<=n;i++){const t=i/n,p=mix(a,b,t);c.lineTo(p[0]+(i%2?-2.2:2.2),p[1]+(i%2?-3:3))}c.stroke();c.strokeStyle='rgba(30,30,30,.6)';c.lineWidth=.6;c.stroke()}
function post(c,x,y,z,hgt,col){const p=V(x,y,z);c.fillStyle=col||'#6a4b2e';c.fillRect(p[0]-1.8,p[1]-hgt,3.6,hgt);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(p[0]-1.8,p[1]-hgt,3.6,hgt)}
function chimney(c,x,y,z,hh,col){vol(c,{x,y,w:.36,h:.36,z:hh,z0:z,col:col||'#8b5a45',mat:'brick',seed:9});vol(c,{x:x-.05,y:y-.05,w:.46,h:.46,z:3,z0:z+hh,col:'#6d4a3a',mat:'block',seed:2})}
function solar(c,x,y,z){const a=V(x,y+.6,z+5),b=V(x+.9,y+.6,z+5),d=V(x+.9,y,z+10),e=V(x,y,z+10);pl(c,[a,b,d,e],lg(c,0,e[1],0,a[1],[[0,'#4a78a8'],[1,'#26446a']]),OLC,1.8);for(let i=1;i<3;i++){line(c,mix(a,b,i/3),mix(e,d,i/3),'rgba(255,255,255,.4)',.8)}line(c,mix(a,e,.5),mix(b,d,.5),'rgba(255,255,255,.4)',.8)}
function ac(c,x,y,z){vol(c,{x,y,w:.55,h:.45,z:8,z0:z,col:'#b9c0c2',mat:'metal',seed:3});const p=V(x+.27,y+.22,z+8);c.fillStyle='#2e3436';c.beginPath();c.ellipse(p[0],p[1],5.6,2.8,0,0,7);c.fill();c.strokeStyle='#6c7476';c.lineWidth=.8;c.beginPath();c.moveTo(p[0]-5,p[1]);c.lineTo(p[0]+5,p[1]);c.stroke()}
function tank(c,x,y,z,col){const p=V(x,y,z);post(c,x-.12,y-.08,z,14,'#5b4a38');post(c,x+.12,y+.1,z,14,'#5b4a38');cyl(c,p[0],p[1]-14,9,17,col||'#7fa0aa',{bands:2})}

const SPR={};
/* ===== Rotación real en 4 direcciones =====
   Los pintores dibujan en su "marco" original (w0×h0). Con rot≠0 se transforma cada primitiva al marco del mundo,
   las caras visibles pasan a ser otras (laterales / trasera) y las piezas se reordenan por profundidad. */
let ROT=0,PW=1,PH=1,NEST=0,REC=null;
const mapBox=(x,y,w,h)=>ROT==1?[PH-y-h,x,h,w]:ROT==2?[PW-x-w,PH-y-h,w,h]:ROT==3?[y,PW-x-w,h,w]:[x,y,w,h];
const mapPt=(u,v,r,pw,ph)=>{r=r===undefined?ROT:r;pw=pw===undefined?PW:pw;ph=ph===undefined?PH:ph;return r==1?[ph-v,u]:r==2?[pw-u,ph-v]:r==3?[v,pw-u]:[u,v]};
const LR=[['S','E'],['E','N'],['N','W'],['W','S']];
const seg=(c,m,z0,z1)=>{if(c&&c.__rec&&NEST==0&&c.__depth()==0)c.__begin(m,z0,z1)};
const nest=(fn)=>{NEST++;try{fn()}finally{NEST--}};
function autoBack(c,len,H){if(len<20||H<14)return;const rows=Math.max(1,Math.min(4,Math.floor(H/22))),two=len>=44,xs=two?[len*.16,len*.84-10]:[len*.5-5];
 for(let r=0;r<rows;r++){const y=-(H-9-r*20);if(y>-8)continue;xs.forEach((x,i)=>wnd(c,x,y,10,8,{lit:rnd(i,r,5)<.3,frame:'#d9cfb4'}))}
 if(len>=56&&H>=18)dor(c,len/2-5,-12,10,12,{col:'#5b4a3a'})}
const Vp=(u,v,zz)=>{if(!ROT)return V(u,v,zz);const m=mapPt(u,v);if(REC&&NEST==0)REC.__touch(m[0],m[1],zz||0);return V(m[0],m[1],zz)};
function faceTfW(c,side,x,y,w,h,z0,fn){if(!ROT)return faceTf(c,side,x,y,w,h,z0,fn);const pf=side==='L'?'S':'E',lr=LR[ROT],ws=pf===lr[0]?'L':pf===lr[1]?'R':null;if(!ws)return;const m=mapBox(x,y,w,h);faceTf(c,ws,m[0],m[1],m[2],m[3],z0,fn)}
function volW(c,o){if(!ROT)return vol(c,o);const m=mapBox(o.x,o.y,o.w,o.h),z0=o.z0||0,des={S:o.decL,E:o.decR,N:o.decN||(o.decR?autoBack:null),W:o.decW||o.decR||null},lr=LR[ROT];
 seg(c,m,z0,z0+o.z);nest(()=>vol(c,Object.assign({},o,{x:m[0],y:m[1],w:m[2],h:m[3],decL:des[lr[0]],decR:des[lr[1]]})))}
const gW=(fx)=>function(c,o){if(!ROT)return fx?gableX(c,o):gableY(c,o);const m=mapBox(o.x,o.y,o.w,o.h),o2=Object.assign({},o,{x:m[0],y:m[1],w:m[2],h:m[3]}),odd=ROT&1;
 seg(c,m,o.z,o.z+(o.rh||0));nest(()=>{((fx?!odd:odd)?gableX:gableY)(c,o2)})};
function hipW(c,o){if(!ROT)return hip(c,o);const m=mapBox(o.x,o.y,o.w,o.h);seg(c,m,o.z,o.z+(o.rh||0));nest(()=>hip(c,Object.assign({},o,{x:m[0],y:m[1],w:m[2],h:m[3]})))}
function frW(c,o,mid){if(!ROT)return flatRoof(c,o,mid);const m=mapBox(o.x,o.y,o.w,o.h);seg(c,m,o.z,o.z+(o.ph||3));nest(()=>flatRoof(c,Object.assign({},o,{x:m[0],y:m[1],w:m[2],h:m[3]}),mid))}
function crateW(c,x,y,z,s,col){if(!ROT)return crate(c,x,y,z,s,col);const m=mapBox(x,y,s,s);seg(c,m,z||0,(z||0)+s*14);nest(()=>crate(c,m[0],m[1],z,s,col))}
function sacksW(c,x,y,n,z){if(!ROT)return sacks(c,x,y,n,z);const pts=[];for(let i=0;i<n;i++)pts.push(mapPt(x+i*.24,y));const xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]);seg(c,[Math.min(...xs)-.1,Math.min(...ys)-.1,Math.max(...xs)-Math.min(...xs)+.2,Math.max(...ys)-Math.min(...ys)+.2],z||0,(z||0)+8);nest(()=>pts.forEach(q=>sacks(c,q[0],q[1],1,z)))}
function postW(c,x,y,z,hgt,col){if(!ROT)return post(c,x,y,z,hgt,col);const q=mapPt(x,y);seg(c,[q[0]-.05,q[1]-.05,.1,.1],z,z+hgt);nest(()=>post(c,q[0],q[1],z,hgt,col))}
function chW(c,x,y,z,hh,col){if(!ROT)return chimney(c,x,y,z,hh,col);const m=mapBox(x,y,.36,.36);seg(c,m,z,z+hh+3);nest(()=>chimney(c,m[0],m[1],z,hh,col))}
function solW(c,x,y,z){if(!ROT)return solar(c,x,y,z);const q=mapPt(x+.45,y+.3);seg(c,[q[0]-.45,q[1]-.3,.9,.6],z,z+10);nest(()=>solar(c,q[0]-.45,q[1]-.3,z))}
function acW(c,x,y,z){if(!ROT)return ac(c,x,y,z);const q=mapPt(x+.275,y+.225);seg(c,[q[0]-.275,q[1]-.225,.55,.45],z,z+8);nest(()=>ac(c,q[0]-.275,q[1]-.225,z))}
function tankW(c,x,y,z,col){if(!ROT)return tank(c,x,y,z,col);const q=mapPt(x,y);seg(c,[q[0]-.2,q[1]-.2,.4,.4],z,z+30);nest(()=>tank(c,q[0],q[1],z,col))}
/* grabadora: guarda las órdenes de dibujo por piezas y las repinta ordenadas por profundidad */
const PASS=new Set(['createLinearGradient','createRadialGradient','createPattern','createConicGradient','measureText','getTransform','isPointInPath','getImageData']);
function mkRec(real){const segs=[{ops:[],box:null}];let cur=segs[0],depth=0;const st={};
 const API={__rec:true,__depth:()=>depth,__touch:(x,y,z)=>{if(depth!=0||cur.fixed)return;if(!cur.raw){cur={ops:[],raw:1,box:{x0:x,x1:x+.02,y0:y,y1:y+.02,z0:z,z1:z+14}};segs.push(cur)}else{const q=cur.box;q.x0=Math.min(q.x0,x);q.x1=Math.max(q.x1,x+.02);q.y0=Math.min(q.y0,y);q.y1=Math.max(q.y1,y+.02);q.z0=Math.min(q.z0,z);q.z1=Math.max(q.z1,z+14)}},__begin:(m,z0,z1)=>{cur={ops:[],box:{x0:m[0],x1:m[0]+m[2],y0:m[1],y1:m[1]+m[3],z0:z0||0,z1:z1===undefined?(z0||0)+1:z1},fixed:1};segs.push(cur)}};
 const px=new Proxy(API,{get(t,p){if(p in t)return t[p];const v=real[p];if(typeof v==='function'){if(PASS.has(p))return v.bind(real);return(...a)=>{if(p==='save')depth++;else if(p==='restore')depth=Math.max(0,depth-1);cur.ops.push([p,a])}}if(p in st)return st[p];return v},set(t,p,v){st[p]=v;cur.ops.push(['=',p,v]);return true}});
 return{px,segs}}
function flushRec(real,segs){const A=segs.slice(1),n=A.length,ov=(a0,a1,b0,b1)=>Math.min(a1,b1)-Math.max(a0,b0)>.03,e=.03,
 cmp=(a,b)=>{if(ov(a.x0,a.x1,b.x0,b.x1)&&ov(a.y0,a.y1,b.y0,b.y1)){if(Math.abs(a.z0-b.z0)>.5)return a.z0<b.z0?-1:1;if(Math.abs(a.z1-b.z1)>.5)return a.z1<b.z1?-1:1;const da=a.x1+a.y1+a.x0+a.y0,db=b.x1+b.y1+b.x0+b.y0;return da<db-.05?-1:da>db+.05?1:0}
  const ab=a.x1<=b.x0+e||a.y1<=b.y0+e,ba=b.x1<=a.x0+e||b.y1<=a.y0+e;if(ab&&!ba)return -1;if(ba&&!ab)return 1;const da=a.x1+a.y1+a.x0+a.y0,db=b.x1+b.y1+b.x0+b.y0;return da<db-.05?-1:da>db+.05?1:0};
 const pre=A.map(()=>[]),ind=A.map(()=>0);
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const r=cmp(A[i].box,A[j].box);if(r<0){pre[i].push(j);ind[j]++}else if(r>0){pre[j].push(i);ind[i]++}}
 const done=new Array(n).fill(false),order=[];
 for(let k=0;k<n;k++){let pick=-1;for(let i=0;i<n;i++)if(!done[i]&&ind[i]==0){pick=i;break}if(pick<0){let bi=1e9;for(let i=0;i<n;i++)if(!done[i]&&ind[i]<bi){bi=ind[i];pick=i}}
  done[pick]=true;order.push(pick);pre[pick].forEach(j=>ind[j]--)}
 const run=sg=>sg.ops.forEach(([p,a])=>{if(p==='=')real[a]=arguments[0];else real[p](...a)});
 const play=sg=>{for(const o of sg.ops){if(o[0]==='=')real[o[1]]=o[2];else real[o[0]](...o[1])}};
 if(window.DBGS)window.DBGS.push(order.map(i=>{const q=A[i].box;return [q.x0,q.x1,q.y0,q.y1,q.z0,q.z1].map(v=>+v.toFixed(2)).join(',')+' ops'+A[i].ops.length}));play(segs[0]);order.forEach(i=>play(A[i]))}
function spr(k,b,paint){const lv=Math.min(15,b.lvl||1),r=(b.rot||0)&3,key=[k,b.cl||0,b.rf||0,b.ex||0,lv,b.w,b.h,window.MIRF?1:0,r,(window.NBK&&NBK.stagePaint?1:0)+(window.NBK&&NBK.lvlDeco?2:0)].join('|');let s=SPR[key];
 if(!s){const w=b.w,h=b.h,z=BT[k].z,pad=44,SC=2,minX=-h*32-pad,maxX=w*32+pad,minY=-(z+(b.up||110)),maxY=(w+h)*16+pad;
  const cv=document.createElement('canvas');cv.width=Math.ceil((maxX-minX)*SC);cv.height=Math.ceil((maxY-minY)*SC);const g=cv.getContext('2d');g.scale(SC,SC);g.translate(-minX,-minY);
  const pw=(r&1)?h:w,ph=(r&1)?w:h,bb={...b,x:0,y:0,w:pw,h:ph,lvl:lv};
  const DE=window.NBK&&NBK.lvlDeco,pt=(cc,b2)=>{if(!(NBK.stagePaint&&NBK.stagePaint(cc,b2,k)))paint(cc,b2);if(DE)DE(cc,b2,k)};if(!r){ROT=0;pt(g,bb)}else{const R=mkRec(g);ROT=r;PW=pw;PH=ph;NEST=0;REC=R.px;try{pt(R.px,bb)}finally{ROT=0;NEST=0;REC=null}flushRec(g,R.segs)}
  s=SPR[key]={cv,minX,minY,SC}}
 return s}
function blit(c,b,s){const p=P(b.x,b.y);c.drawImage(s.cv,p[0]+s.minX,p[1]+s.minY,s.cv.width/s.SC,s.cv.height/s.SC)}

window.NB={};window.NBK={RV:V,seg:(c,x,y,w,h,z0,z1)=>{if(ROT){const m=mapBox(x,y,w,h);seg(c,m,z0,z1)}},M:(u,v)=>ROT?mapPt(u,v):[u,v],hip:hipW,V:Vp,mix,RGB,Q,rnd,pl,lg,line,faceTf:faceTfW,vol:volW,wnd,dor,sign,plateX,patch,plane,gableX:gW(1),gableY:gW(0),flatRoof:frW,cyl,crate:crateW,sacks:sacksW,wire,post:postW,chimney:chW,solar:solW,ac:acW,tank:tankW,matP,eaveShadow,OLC};
window.nbDraw=function(c,b,al){const k=b.type,def=NB[k];if(!def)return false;const s=spr(k,b,def.paint);blit(c,b,s);const r=(b.rot||0)&3,pw=(r&1)?b.h:b.w,ph=(r&1)?b.w:b.h;if(b.pause){const q=V(b.x+b.w/2,b.y+b.h/2,Math.min(70,(BT[k].z||20)+16));c.fillStyle='rgba(20,20,16,.82)';c.strokeStyle='#e0b020';c.lineWidth=1.5;c.beginPath();c.roundRect(q[0]-9,q[1]-9,18,18,4);c.fill();c.stroke();c.fillStyle='#e0b020';c.fillRect(q[0]-4,q[1]-5,3,10);c.fillRect(q[0]+1,q[1]-5,3,10)}
 if(def.live&&!b.pause&&!(NBK.stage&&NBK.stage(k,b.lvl||1)<3))def.live(c,b,{M:(u,v)=>r?mapPt(u,v,r,pw,ph):[u,v],W:(x,y,zz)=>V(b.x+x,b.y+y,zz),L:(u,v,zz)=>{const m=r?mapPt(u,v,r,pw,ph):[u,v];return V(b.x+m[0],b.y+m[1],zz)}});return true};
})();
