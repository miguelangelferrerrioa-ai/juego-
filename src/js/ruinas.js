/* ===== Dead Town · ilustraciones de la caída del Alba (canvas, animadas) ===== */
(function(){
const W=480,H=260;
function rng(s){return()=>((s=(s*16807)%2147483647)-1)/2147483646}
const TXT=['Calle principal','Muralla derribada','Plaza del cuartel'];
function ruin(c,R,x,gy,w,h,glow,t){c.fillStyle='#352a24';c.strokeStyle='#0d0907';c.lineWidth=1.5;c.beginPath();c.moveTo(x,gy);const n=Math.max(3,Math.round(w/14));let px=x,py=gy-h;c.lineTo(x,py);for(let i=1;i<=n;i++){px=x+w*i/n;py=gy-h*(.55+R()*.5)-(i%3===0?h*.15:0);c.lineTo(px,py)}c.lineTo(x+w,gy);c.closePath();c.fill();c.stroke();
 c.fillStyle='#463830';c.fillRect(x,gy-h*.35,w,h*.35);
 for(let i=0;i<4;i++){const wx=x+6+R()*(w-18),wy=gy-h*.2-R()*h*.6;if(wy<gy-h)continue;c.fillStyle=R()<.55?'rgba(255,'+(110+R()*60|0)+',30,'+(.5+.35*Math.sin(t*5+wx))+')':'#050403';c.fillRect(wx,wy,7,9)}
 c.strokeStyle='#0c0907';c.lineWidth=2;for(let i=0;i<3;i++){const bx=x+R()*w;c.beginPath();c.moveTo(bx,gy-h*.85-R()*10);c.lineTo(bx+(R()-.5)*30,gy-h*.55);c.stroke()}
 if(glow){const g=c.createRadialGradient(x+w/2,gy,2,x+w/2,gy,w*.9);const f=.55+.25*Math.sin(t*7+x);g.addColorStop(0,'rgba(255,120,30,'+f+')');g.addColorStop(1,'rgba(255,60,0,0)');c.fillStyle=g;c.fillRect(x-w*.5,gy-w*1.2,w*2,w*1.4)}}
function body(c,x,y,s,a){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(0,5,15,4,0,0,7);c.fill();c.fillStyle='#2b2e25';c.fillRect(-9,-3,14,6);c.fillRect(5,-2,8,2.4);c.fillRect(5,1,8,2.4);c.fillRect(-15,-2,7,2.4);c.fillStyle='#8a6e55';c.beginPath();c.arc(-12,0,3.4,0,7);c.fill();c.fillStyle='#c9a24a';c.fillRect(-4,-3,3,2);c.restore()}
function flag(c,x,gy,t){c.strokeStyle='#2a201a';c.lineWidth=3;c.beginPath();c.moveTo(x,gy);c.lineTo(x+6,gy-62);c.stroke();c.fillStyle='#b58a2a';c.beginPath();c.moveTo(x+6,gy-60);for(let i=0;i<=8;i++)c.lineTo(x+6+i*4,gy-60+Math.sin(t*3+i)*2.5+i*.8);for(let i=8;i>=0;i--)c.lineTo(x+6+i*4-(i>5?(i-5)*3:0),gy-38+Math.sin(t*3+i)*2.5+i*.8);c.closePath();c.fill();c.fillStyle='#3a2a10';c.fillRect(x+16,gy-54,6,10)}
function wall(c,R,x0,x1,gy,gap){const bh=9,bw=18;for(let r=0;r<6;r++)for(let x=x0;x<x1;x+=bw){if(gap&&x>gap[0]&&x<gap[1]&&r>0&&R()<.5+r*.1)continue;if(r>3&&R()<.35)continue;c.fillStyle=r%2?'#6a5f54':'#7a6e62';c.fillRect(x+(r%2?bw/2:0),gy-(r+1)*bh,bw-1,bh-1)}}
function rubble(c,R,x0,x1,gy){for(let i=0;i<40;i++){const x=x0+R()*(x1-x0),y=gy+R()*22,w=4+R()*12;c.fillStyle='rgb('+(30+R()*30|0)+','+(25+R()*25|0)+','+(20+R()*20|0)+')';c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y-w*.4);c.lineTo(x+w*1.2,y+w*.3);c.lineTo(x+w*.2,y+w*.4);c.closePath();c.fill()}}
function draw(cv,k,t,P){const c=cv.getContext('2d'),R=rng(11+k*97),gy=H*.68;
 let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a2024');g.addColorStop(.4,'#7a3a22');g.addColorStop(.7,'#d9772e');g.addColorStop(1,'#2a1a12');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(255,140,50,.10)';c.beginPath();c.arc(W*(.3+k*.2),gy-10,90,0,7);c.fill();
 c.fillStyle='#2a1d17';c.beginPath();c.moveTo(0,gy);for(let x=0;x<=W;x+=30)c.lineTo(x,gy-18-Math.sin(x*.02+k)*10-R()*8);c.lineTo(W,gy);c.fill();
 if(k===0){for(let i=0,x=-10;i<7;i++){const w=50+R()*40,h=60+R()*70;ruin(c,R,x,gy,w,h,i%2===0,t);x+=w+R()*14}}
 else if(k===1){wall(c,R,0,W,gy,[150,290]);for(let i=0;i<3;i++){const w=44+R()*30;ruin(c,R,20+i*150,gy-10,w,50+R()*30,i===1,t)}flag(c,330,gy+6,t)}
 else{ruin(c,R,30,gy,110,100,1,t);ruin(c,R,340,gy,90,85,1,t);for(let i=0;i<3;i++){c.fillStyle='#211a15';c.beginPath();c.moveTo(180+i*50,gy);c.lineTo(205+i*50,gy-38);c.lineTo(230+i*50,gy);c.closePath();c.fill()}flag(c,420,gy+8,t)}
 c.fillStyle='#2a1f19';c.fillRect(0,gy,W,H-gy);const gg=c.createLinearGradient(0,gy,0,H);gg.addColorStop(0,'rgba(255,100,20,.18)');gg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=gg;c.fillRect(0,gy,W,H-gy);
 rubble(c,R,0,W,gy+4);
 const B=k===0?[[110,gy+34,1,.15],[200,gy+46,1.1,-.1],[330,gy+30,.9,.3]]:k===1?[[70,gy+38,1,.1],[250,gy+50,1.15,3.3],[400,gy+34,.95,-.2]]:[[120,gy+44,1.1,.05],[230,gy+36,.9,3.2],[300,gy+56,1.2,-.12],[390,gy+40,1,.2]];
 B.forEach(b=>body(c,b[0],b[1],b[2],b[3]));
 P.sm.forEach(p=>{p.y-=p.v;p.x+=Math.sin(t+p.s)*.25+.18;p.r+=.07;p.a-=.0016;if(p.a<=0||p.y<-30){p.y=gy-Math.random()*20;p.x=p.x0+Math.random()*20;p.r=8+Math.random()*10;p.a=.18+Math.random()*.12}c.fillStyle='rgba('+(40+p.g)+','+(36+p.g)+','+(34+p.g)+','+Math.max(0,p.a)+')';c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill()});
 P.em.forEach(e=>{e.y-=e.v;e.x+=Math.sin(t*2+e.s)*.4;if(e.y<20){e.y=gy+Math.random()*30;e.x=Math.random()*W}c.fillStyle='rgba(255,'+(120+e.s*30|0)+',40,'+(.5+.5*Math.sin(t*8+e.s*9))+')';c.fillRect(e.x,e.y,2,2)});
 const v=c.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.45)');c.fillStyle=v;c.fillRect(0,0,W,H);
 }
function init(cv,k,warm){cv.width=W;cv.height=H;const R=rng(5+k),P={sm:[],em:[]};for(let i=0;i<46;i++)P.sm.push({x0:(i%6)*80+R()*30,x:0,y:H*.68-R()*H*.6,r:8+R()*12,v:.18+R()*.35,a:.06+R()*.22,s:R()*6,g:R()*20|0});P.sm.forEach(p=>p.x=p.x0);for(let i=0;i<40;i++)P.em.push({x:R()*W,y:H*.5+R()*H*.4,v:.2+R()*.6,s:R()});
 let t0=performance.now();for(let i=0;i<(warm||0);i++)draw(cv,k,i/60,P);const loop=()=>{if(!cv.isConnected)return;draw(cv,k,(performance.now()-t0)/1000,P);requestAnimationFrame(loop)};draw(cv,k,0,P);loop()}
window.RUINAS={W,H,TXT,init,gallery(){return '<div class="ru-g">'+TXT.map((t,i)=>'<figure><canvas class="ru-c" data-k="'+i+'"></canvas><figcaption>'+t+'</figcaption></figure>').join('')+'</div>'},mount(root){(root||document).querySelectorAll('canvas.ru-c').forEach(cv=>{if(!cv.dataset.on){cv.dataset.on=1;init(cv,+cv.dataset.k,150)}})}};
const st=document.createElement('style');st.textContent='.ru-g{display:flex;flex-direction:column;gap:10px;margin:6px 0 12px}.ru-g figure{margin:0;position:relative}.ru-c{width:100%;height:auto;display:block;border:1px solid #4a3a2a;border-radius:8px;background:#120d10}.ru-g figcaption{position:absolute;left:10px;bottom:8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#e8c27a;text-shadow:0 1px 3px #000}';document.head.appendChild(st);
})();
