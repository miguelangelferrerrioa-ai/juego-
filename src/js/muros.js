/* Muros finos y bajos: lienzos de pared estrecha que se conectan con los vecinos (en vez de cubos de una casilla entera). */
(function(){
'use strict';
const K=window.NBK;if(!K||!window.nbDraw)return;
const {vol,V,faceTf,post}=K,CACHE={},SC=2,PAD=44;
const WH=38,GH=46;
const isW=(x,y)=>{if(x<0||y<0||x>=N||y>=N)return 0;const o=bm[occ[y*N+x]];return o&&(o.type==='wall'||o.type==='gate')?1:0};
function paint(c,type,mask,dm,l){
  const a=.34,e=1-a,col='#a9a69a',cap='#c6c2b4';
  /* caja a lo largo del eje ax ('x' o 'y'): u0..u1 sobre el eje, v0..v1 en el ancho */
  const B=(ax,u0,u1,v0,v1,o)=>ax==='x'?vol(c,{x:u0,y:v0,w:u1-u0,h:v1-v0,...o}):vol(c,{x:v0,y:u0,w:v1-v0,h:u1-u0,...o});
  if(type==='gate'){
    const ax=(mask&12)&&!(mask&3)?'y':'x',G=Math.max(1,Math.min(5,l||1));
    const P={1:{pc:'#9aa3aa',pm:'metal',cap:'#d9cf9a',lc:'#aab3ba',lm:'metal'},2:{pc:'#8a6a44',pm:'plank',cap:'#6a4b2e',lc:'#9a7a50',lm:'plank'},3:{pc:'#8d8a80',pm:'block',cap:cap,lc:'#5a6168',lm:'metal'},4:{pc:'#a85a3c',pm:'brick',cap:'#d9c9a4',lc:'#5a6168',lm:'metal'},5:{pc:'#78828a',pm:'metal',cap:'#4f585f',lc:'#434b52',lm:'metal'}}[G];
    const leaf=(c2,len,H)=>{if(G==1){c2.strokeStyle='rgba(235,240,245,.7)';c2.lineWidth=.8;c2.beginPath();for(let X=-H;X<len+H;X+=4){c2.moveTo(X,0);c2.lineTo(X+H,-H);c2.moveTo(X,-H);c2.lineTo(X+H,0)}c2.stroke()}
      else if(G==2){c2.strokeStyle='#4a3420';c2.lineWidth=2;c2.beginPath();c2.moveTo(1,-1);c2.lineTo(len-1,-H+1);c2.moveTo(1,-H+1);c2.lineTo(len-1,-1);c2.stroke()}
      else{c2.strokeStyle='#e0b020';c2.lineWidth=2;for(let i=0;i<4;i++){c2.beginPath();c2.moveTo(3+i*5,-H);c2.lineTo(3+i*5+3,0);c2.stroke()}}};
    if(G==1){ /* puerta de valla: mismo lenguaje que la malla, con marco, diagonal y pestillo */
      const Hf=24,mesh=(c2,len)=>{c2.save();c2.beginPath();c2.rect(0,-Hf,len,Hf);c2.clip();c2.fillStyle='rgba(190,200,210,.12)';c2.fillRect(0,-Hf,len,Hf);c2.strokeStyle='rgba(222,228,234,.85)';c2.lineWidth=.8;c2.beginPath();for(let X=-Hf;X<len+Hf;X+=5){c2.moveTo(X,0);c2.lineTo(X+Hf,-Hf);c2.moveTo(X,-Hf);c2.lineTo(X+Hf,0)}c2.stroke();c2.restore()};
      const frame=(c2,len)=>{c2.save();c2.beginPath();c2.rect(0,-Hf-2,len,Hf+2);c2.clip();c2.fillStyle='rgba(190,200,210,.16)';c2.fillRect(0,-Hf,len,Hf);c2.strokeStyle='rgba(222,228,234,.8)';c2.lineWidth=.8;c2.beginPath();for(let X=-Hf;X<len+Hf;X+=5){c2.moveTo(X,0);c2.lineTo(X+Hf,-Hf);c2.moveTo(X,-Hf);c2.lineTo(X+Hf,0)}c2.stroke();c2.strokeStyle='#6f7a82';c2.lineWidth=2.2;c2.strokeRect(1.2,-Hf+1,len-2.4,Hf-2);c2.lineWidth=1.8;c2.beginPath();c2.moveTo(1.5,-1.5);c2.lineTo(len-1.5,-Hf+1.5);c2.stroke();c2.fillStyle='#d9cf9a';c2.fillRect(len-5,-Hf/2-2,3.4,5);c2.restore()};
      const face=(u0,u1,fn)=>ax==='x'?faceTf(c,'L',u0,.5,u1-u0,0,8.6,fn):faceTf(c,'R',.5,u0,0,u1-u0,8.6,fn);
      B(ax,0,1,.4,.6,{z:7,col:'#9c9a90',mat:'block',seed:3});B(ax,-.01,1.01,.37,.63,{z:1.6,z0:7,col:'#d9cf9a',mat:'block',seed:4});
      face(0,.2,len=>mesh(c,len));face(.8,1,len=>mesh(c,len));face(.2,.8,len=>frame(c,len));
      const PS=(u)=>ax==='x'?post(c,u,.5,8.6,Hf+8,'#aab3ba'):post(c,.5,u,8.6,Hf+8,'#aab3ba');
      [0,.2,.8,1].forEach(PS);
      return}
    B(ax,0,.26,.28,.72,{z:GH,col:P.pc,mat:P.pm,seed:1});
    B(ax,.74,1,.28,.72,{z:GH,col:P.pc,mat:P.pm,seed:2});
    B(ax,.26,.74,.4,.6,{z:G==1?26:30,col:P.lc,mat:P.lm,seed:3,decL:leaf,decR:leaf});
    B(ax,-.02,.28,.25,.75,{z:2,z0:GH,col:P.cap,mat:G==2?'plank':G==5?'metal':'block',seed:4});
    B(ax,.72,1.02,.25,.75,{z:2,z0:GH,col:P.cap,mat:G==2?'plank':G==5?'metal':'block',seed:5});
    if(G==5){const A=ax==='x'?[V(-.02,.78,GH+10),V(1.02,.78,GH+10)]:[V(.78,-.02,GH+10),V(.78,1.02,GH+10)];K.wire(c,A[0],A[1],8)}
    return}
  const hx=mask&3,hy=mask&12,L=Math.max(1,Math.min(5,l||1));
  const crack=(c2)=>{if(dm){c2.strokeStyle='#2a1a11';c2.lineWidth=1.2;c2.beginPath();c2.moveTo(8,-24);c2.lineTo(12,-18);c2.lineTo(9,-12);c2.stroke()}};
  const rv=(c2,len,H)=>{c2.strokeStyle='rgba(0,0,0,.28)';c2.lineWidth=1;for(let X=10;X<len;X+=10){c2.beginPath();c2.moveTo(X,-H+1);c2.lineTo(X,-1);c2.stroke()}c2.fillStyle='rgba(235,240,245,.55)';for(let X=5;X<len;X+=10){c2.fillRect(X-.8,-H+3,1.6,1.6);c2.fillRect(X-.8,-5,1.6,1.6)}crack(c2)};
  const ST={2:{col:'#8a6a44',mat:'plank',cap:'#6a4b2e',pil:'#5a4030',h:30,dec:crack},3:{col:'#a9a69a',mat:'block',cap:'#c6c2b4',pil:'#b3b0a4',h:WH,dec:crack},4:{col:'#a85a3c',mat:'brick',cap:'#d9c9a4',pil:'#9a4f34',h:WH,dec:crack},5:{col:'#78828a',mat:'metal',cap:'#4f585f',pil:'#5f6a72',h:WH+4,dec:rv}}[L];
  const runs=[];if(hy)runs.push(['y',(mask&4)?0:(L>1?a:a),(mask&8)?1:e]);if(hx||!hy)runs.push(['x',(mask&1)?0:(hx?a:.12),(mask&2)?1:(hx?e:.88)]);
  if(L==1){ /* valla de malla metálica sobre zócalo de hormigón */
   const Hf=24,mesh=(c2,len)=>{c2.save();c2.beginPath();c2.rect(0,-Hf,len,Hf);c2.clip();c2.fillStyle='rgba(190,200,210,.12)';c2.fillRect(0,-Hf,len,Hf);c2.strokeStyle='rgba(222,228,234,.85)';c2.lineWidth=.8;c2.beginPath();for(let X=-Hf;X<len+Hf;X+=5){c2.moveTo(X,0);c2.lineTo(X+Hf,-Hf);c2.moveTo(X,-Hf);c2.lineTo(X+Hf,0)}c2.stroke();c2.strokeStyle='#9aa3aa';c2.lineWidth=1.6;c2.beginPath();c2.moveTo(0,-Hf);c2.lineTo(len,-Hf);c2.stroke();c2.restore();if(dm){c2.strokeStyle='#2a1a11';c2.lineWidth=1.2;c2.beginPath();c2.moveTo(len*.4,-Hf);c2.lineTo(len*.5,-Hf*.5);c2.lineTo(len*.42,-4);c2.stroke()}};
   for(const[ax,u0,u1]of runs){
    B(ax,u0,u1,.4,.6,{z:7,col:'#9c9a90',mat:'block',seed:3});B(ax,u0-.01,u1+.01,.37,.63,{z:1.6,z0:7,col:'#d9cf9a',mat:'block',seed:4});
    if(ax==='x')faceTf(c,'L',u0,.5,u1-u0,0,8.6,len=>mesh(c,len));else faceTf(c,'R',.5,u0,0,u1-u0,8.6,len=>mesh(c,len));
    const n=Math.max(1,Math.round((u1-u0)/.5));for(let i=0;i<=n;i++){const u=u0+(u1-u0)*i/n;ax==='x'?post(c,u,.5,8.6,Hf+2,'#aab3ba'):post(c,.5,u,8.6,Hf+2,'#aab3ba')}}
   return}
  for(const[ax,u0,u1]of runs){
   B(ax,u0,u1,a,e,{z:ST.h,col:ST.col,mat:ST.mat,seed:3+(ax=='y'?0:2),decL:(c2,l2,H)=>ST.dec(c2,l2,H),decR:L==5||L==2?(c2,l2,H)=>ST.dec(c2,l2,H):undefined});
   B(ax,u0,u1,a-.03,e+.03,{z:1.6,z0:ST.h,col:ST.cap,mat:ST.mat=='plank'?'plank':ST.mat=='metal'?'metal':'block',seed:4+(ax=='y'?0:2)});
   if(L==5){const A=ax==='x'?[V(u0,e+.02,ST.h+10),V(u1,e+.02,ST.h+10)]:[V(e+.02,u0,ST.h+10),V(e+.02,u1,ST.h+10)];K.wire(c,A[0],A[1],Math.max(4,Math.round((u1-u0)*8)))}}
  /* pilar en cruces, esquinas y extremos */
  if((hx&&hy)||(!hx&&!hy)||(hx&&((mask&3)!==3))||(hy&&((mask&12)!==12))){B('x',a-.04,e+.04,a-.04,e+.04,{z:ST.h+3,col:ST.pil,mat:ST.mat=='plank'?'plank':'block',seed:7});B('x',a-.07,e+.07,a-.07,e+.07,{z:1.8,z0:ST.h+3,col:ST.cap,mat:'block',seed:8})}
}
const oDraw=window.nbDraw;
window.nbDraw=function(c,b,al){
  const k=b.type;if(k!=='wall'&&k!=='gate')return oDraw.apply(this,arguments);
  const mask=isW(b.x-1,b.y)|(isW(b.x+1,b.y)<<1)|(isW(b.x,b.y-1)<<2)|(isW(b.x,b.y+1)<<3),dm=k==='wall'&&b.hp<mxhp(b)*.5?1:0,key=k+mask+'_'+dm+'_'+Math.min(5,b.lvl||1);
  let s=CACHE[key];
  if(!s){const z=k==='gate'?GH+4:WH+5,minX=-32-PAD,maxX=32+PAD,minY=-(z+30),maxY=32+PAD;
    const cv=document.createElement('canvas');cv.width=Math.ceil((maxX-minX)*SC);cv.height=Math.ceil((maxY-minY)*SC);const g=cv.getContext('2d');g.scale(SC,SC);g.translate(-minX,-minY);
    paint(g,k,mask,dm,Math.min(5,b.lvl||1));s=CACHE[key]={cv,minX,minY}}
  const p=P(b.x,b.y);c.drawImage(s.cv,p[0]+s.minX,p[1]+s.minY,s.cv.width/SC,s.cv.height/SC);return true};
window.wallDrawM=function(c,k,x,y,mask,l,dm){const key=k+mask+'_'+(dm||0)+'_'+Math.min(5,l||1);let s=CACHE[key];
  if(!s){const z=k==='gate'?GH+4:WH+5,minX=-32-PAD,maxX=32+PAD,minY=-(z+30),maxY=32+PAD;const cv=document.createElement('canvas');cv.width=Math.ceil((maxX-minX)*SC);cv.height=Math.ceil((maxY-minY)*SC);const g=cv.getContext('2d');g.scale(SC,SC);g.translate(-minX,-minY);paint(g,k,mask,dm||0,Math.min(5,l||1));s=CACHE[key]={cv,minX,minY}}
  const p=P(x,y);c.drawImage(s.cv,p[0]+s.minX,p[1]+s.minY,s.cv.width/SC,s.cv.height/SC)};
BT.wall.z=WH;BT.gate.z=GH;
})();
