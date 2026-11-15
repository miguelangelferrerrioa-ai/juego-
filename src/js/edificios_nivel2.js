/* ===== Dead Town · diseños de mejora por nivel (11-15): paneles solares, antenas, cristal y obelisco de aleación ===== */
(function(){
const K=NBK,{V,line,vol,post,cyl,OLC,seg}=K;if(!K.lvlDeco)return;
const NO=new Set(['wall','gate','barricade','trap','road','bridge','turret']);
const o=K.lvlDeco;
const at=(c,u,v,z0,z1,fn)=>{seg(c,u-.2,v-.2,.4,.4,z0,z1);fn(V(u,v,z0))};
const glow=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
/* paneles solares sobre postes */
function solar(c,u,v,n){for(let i=0;i<n;i++){const y=v+i*.62;post(c,u+.2,y+.2,0,6,'#4a525a');vol(c,{x:u,y:y,w:.45,h:.5,z:1.4,z0:6,col:'#26405e',mat:'metal',seed:20+i});
  at(c,u+.22,y+.25,7.4,8,p=>{c.strokeStyle='rgba(150,210,255,.7)';c.lineWidth=.9;c.beginPath();c.moveTo(p[0]-6,p[1]-1);c.lineTo(p[0]+6,p[1]-3);c.moveTo(p[0],p[1]-3);c.lineTo(p[0]+1,p[1]+1);c.stroke()})}}
/* antena parabólica */
function dish(c,u,v,h){post(c,u,v,0,h,'#aab2b8');at(c,u,v,h,h+4,p=>{const x=p[0],y=p[1]-4;c.fillStyle='#d4dadd';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(x,y,8,5.2,-.5,0,7);c.fill();c.stroke();c.fillStyle='#8fa0a8';c.beginPath();c.ellipse(x+.8,y-.4,3.6,2.3,-.5,0,7);c.fill();c.strokeStyle='#7a8890';c.beginPath();c.moveTo(x,y);c.lineTo(x+7,y-7);c.stroke();c.fillStyle='#ff5a4a';c.beginPath();c.arc(x+7,y-7,1.5,0,7);c.fill()})}
/* baliza de energía */
function beacon(c,u,v,h,T){post(c,u,v,0,h,'#9fb4c0');at(c,u,v,h,h+3,p=>{const x=p[0],y=p[1]-3,k=.5+.5*Math.sin(T*3+u*3);glow(c,x,y,13+3*k,'rgba(139,227,255,'+(.5+.3*k)+')');c.fillStyle='#bff2ff';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.moveTo(x,y-5);c.lineTo(x+3.4,y);c.lineTo(x,y+4);c.lineTo(x-3.4,y);c.closePath();c.fill();c.stroke()})}
/* obelisco de aleación (nivel 15) */
function obelisk(c,u,v,T){vol(c,{x:u-.3,y:v-.3,w:.6,h:.6,z:3,col:'#8a949c',mat:'block',seed:30});vol(c,{x:u-.18,y:v-.18,w:.36,h:.36,z:36,z0:3,col:'#5a6a78',mat:'metal',seed:31});
  vol(c,{x:u-.1,y:v-.1,w:.2,h:.2,z:8,z0:39,col:'#bff2ff',mat:'metal',seed:32});
  at(c,u,v,47,49,p=>{const x=p[0],y=p[1]-2,k=.5+.5*Math.sin(T*2);glow(c,x,y,22+4*k,'rgba(139,227,255,.55)');c.strokeStyle='rgba(191,242,255,.9)';c.lineWidth=1.3;c.beginPath();c.ellipse(x,y+8,15,5,0,0,7);c.stroke();c.beginPath();c.ellipse(x,y+14,11,3.6,0,0,7);c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(x,y,2.4,0,7);c.fill()})}
K.lvlDeco=function(c,b,t){o.apply(this,arguments);
  if(NO.has(t)||(b.lvl||1)<11)return;const l=b.lvl,pw=b.w,ph=b.h,T=(typeof window.T==='number'?window.T:0)||(performance.now()/1000);
  /* 11-12: energía propia — paneles y antena */
  solar(c,-.72,.25,Math.max(1,Math.min(3,Math.floor(ph/1.2))));
  dish(c,pw+.62,ph+.35,34);
  /* 12: franja de cristal en el bordillo */
  if(l>=12)vol(c,{x:-.06,y:ph+.16,w:pw+.12,h:.1,z:3.4,col:'#8be3ff',mat:'metal',seed:33});
  /* 13-14: balizas y mástil de comunicaciones */
  if(l>=13){beacon(c,-.2,-.25,30,T);beacon(c,pw+.2,-.25,30,T+1)}
  if(l>=14){post(c,pw/2,-.35,0,52,'#9fb4c0');at(c,pw/2,-.35,52,56,p=>{const x=p[0],y=p[1]-4,k=.5+.5*Math.sin(T*4);glow(c,x,y,10,'rgba(255,90,74,'+(.5+.4*k)+')');c.fillStyle='#ff5a4a';c.beginPath();c.arc(x,y,2,0,7);c.fill()});line(c,V(pw/2,-.35,50),V(-.2,-.25,30),'#9fb4c0',1);line(c,V(pw/2,-.35,50),V(pw+.2,-.25,30),'#9fb4c0',1)}
  /* 15: obelisco de aleación */
  if(l>=15)obelisk(c,pw+.95,-.1,T)};
})();
