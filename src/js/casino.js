/* ===== Dead Town · Casino de Villa Esperanza: tragaperras, ruleta y carreras de caballos con animación ===== */
(function(){
const U=()=>window.villaUI,A=()=>window.villaApi,st=()=>A().st();
const W=360,H=230,MAXP=1e9,BETS=[5,10,25,50],TW=8.8,CD=1.8;
const rnd=(a,b)=>a+Math.random()*(b-a),ri_=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
let game='slot',bet=10,anim=0,msg='',lastRes={},rpick={t:'red'},hpick=0,hcard=null,rnum=17;
/* ---------- audio ---------- */
let ac=null,nbuf=null,mute=localStorage.getItem('dt_cas_mute')==='1';
const AC_=()=>{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();try{window.masterLimit&&masterLimit(ac)}catch(e){}}if(ac.state==='suspended')ac.resume();return ac};
const sOn=()=>!mute&&!(typeof SND!=='undefined'&&!SND);
function tone(f,d,ty,v,at,f2){try{if(!sOn())return;const a=AC_(),o=a.createOscillator(),g=a.createGain(),t=a.currentTime+(at||0);o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.04,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
function nz(d,fc,q,v,at,ty){try{if(!sOn())return;const a=AC_();if(!nbuf){nbuf=a.createBuffer(1,a.sampleRate*1.5,a.sampleRate);const D=nbuf.getChannelData(0);for(let i=0;i<D.length;i++)D[i]=Math.random()*2-1}const s=a.createBufferSource();s.buffer=nbuf;s.loop=true;const f=a.createBiquadFilter();f.type=ty||'bandpass';f.frequency.value=fc;f.Q.value=q||1;const g=a.createGain(),t=a.currentTime+(at||0);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.05,t+Math.min(.03,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t,Math.random());s.stop(t+d+.02)}catch(e){}}
const coins=n=>{for(let i=0;i<n;i++){const t=i*.07+Math.random()*.03,f=1800+Math.random()*1400;tone(f,.09,'triangle',.05,t);tone(f*1.5,.07,'sine',.025,t+.015)}};
const fanfare=big=>{const N=big?[523,659,784,1047,784,1047,1319]:[523,659,784,1047];N.forEach((f,i)=>{tone(f,.22,'square',.035,i*.11);tone(f/2,.22,'triangle',.05,i*.11)});if(big)[0,.15,.3].forEach(t=>tone(1568,.5,'triangle',.04,.9+t))};
const wah=()=>{tone(260,.28,'sawtooth',.04,0,200);tone(220,.34,'sawtooth',.04,.28,150)};
/* semilla determinista para partículas */
const sr=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
/* ---------- fichas pendientes ---------- */
function applyPrize(p){const v=st();if(!p)return;try{
 if(p.t==='f')v.f+=p.n;else if(p.t==='v'){S.val=S.val||{};S.val[p.k]=(S.val[p.k]||0)+1}
 else if(p.t==='w')S.inv.push({n:p.n,v:p.v});else if(p.t==='o')S.inv.push({kind:'outfit',n:p.n});
 else if(p.t==='p'){S.bp=S.bp||{};S.bp[p.n]=1;toast('Plano conseguido: '+p.n)}
 else if(p.t==='s'){if(S.ppl.length>=pcap()){v.f+=300;toast('No tienes camas libres: te dan 300 fichas en su lugar.')}else if(window._arrive)_arrive('villa')}
 try{save()}catch(e){}}catch(e){}}
function settle(){const v=st();if(v.pend>0){v.f+=v.pend;v.pend=0}if(v.wp){const p=v.wp;v.wp=null;applyPrize(p)}}
/* ---------- bucle de animación ---------- */
function run(cv,scene,dur,done){const c=cv.getContext('2d');let t0=performance.now(),fin=0,lt=0,ei=0;const ev=(scene.ev||[]).slice().sort((a,b)=>a[0]-b[0]);anim=1;
 const end=()=>{if(fin)return;fin=1;anim=0;settle();done&&done()};
 cv.onclick=()=>{if(performance.now()-t0<dur*1000-50){t0=performance.now()-dur*1000;scene.skip&&scene.skip()}};
 (function f(){if(fin)return;if(!document.body.contains(cv)){fin=1;anim=0;settle();return}const t=(performance.now()-t0)/1000,tt=Math.min(t,dur);
  while(ei<ev.length&&ev[ei][0]<=t){if(t-ev[ei][0]<.3)ev[ei][1]();ei++}
  c.setTransform(cv.width/W,0,0,cv.height/H,0,0);const sk=scene.shake&&scene.shake(tt);if(sk)c.translate(sk[0],sk[1]);scene.draw(c,tt,1);
  if(scene.tick&&t-lt<.5&&t<dur)scene.tick(tt,Math.max(0,t-lt));lt=t;
  if(t>=dur){c.setTransform(cv.width/W,0,0,cv.height/H,0,0);scene.draw(c,dur,0);end();return}requestAnimationFrame(f)})()}
function still(cv,scene,dur){const c=cv.getContext('2d');c.setTransform(cv.width/W,0,0,cv.height/H,0,0);scene.draw(c,dur===undefined?0:dur,0)}
const rr=(c,x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
const CONF=['#e8b84a','#e0483a','#4ab0e0','#6ae04a','#e04ac0','#f4f0e0'];
function confetti(c,k,n,seed){if(k<=0)return;for(let i=0;i<n;i++){const x=sr(i+seed)*W+Math.sin(k*2+i)*8,y=-12-sr(i+seed+7)*70+k*(55+sr(i+seed+3)*90);if(y>H+10)continue;c.save();c.translate(x,y);c.rotate(k*(3+sr(i+seed+5)*6)+i);c.fillStyle=CONF[i%CONF.length];c.fillRect(-3,-1.6,6,3.2);c.restore()}}
function flash(c,k,len,a){if(k>=0&&k<len){c.fillStyle='rgba(255,255,255,'+(a*(1-k/len))+')';c.fillRect(-10,-10,W+20,H+20)}}
function beams(c,cx,cy,T,a,n){c.save();c.translate(cx,cy);c.rotate(T*.7);for(let i=0;i<n;i++){c.rotate(Math.PI*2/n);c.fillStyle='rgba(255,230,140,'+a+')';c.beginPath();c.moveTo(0,0);c.lineTo(300,-16);c.lineTo(300,16);c.closePath();c.fill()}c.restore()}
/* ================= TRAGAPERRAS ================= */
const SYM=[['🍒',30],['🍋',25],['🔔',20],['💀',15],['⭐',7],['7️⃣',3]],PAY={'🍒':6,'🍋':10,'🔔':16,'💀':3,'⭐':40,'7️⃣':150},ALL=SYM.map(s=>s[0]);
const spinSym=()=>{let r=Math.random()*100;for(const[s,w]of SYM){if((r-=w)<0)return s}return SYM[0][0]};
/* simbolos de la tragaperras dibujados a mano (los emojis no se ven en todos los dispositivos dentro de un canvas) */
function slotSym(c,k,x,y,z){c.save();c.translate(x,y);c.scale(z,z);c.lineJoin='round';c.lineCap='round';
 const o=(col)=>{c.strokeStyle=col;c.lineWidth=1.6;c.stroke()};
 if(k==='🍒'){c.strokeStyle='#3f7a2a';c.lineWidth=2;c.beginPath();c.moveTo(-6,2);c.quadraticCurveTo(-3,-10,4,-13);c.moveTo(7,4);c.quadraticCurveTo(6,-6,4,-13);c.stroke();c.fillStyle='#5aa23a';c.beginPath();c.ellipse(8,-12,6,3,-.4,0,7);c.fill();
  [[-7,6],[7,8]].forEach(([a,b])=>{const g=c.createRadialGradient(a-2,b-2,1,a,b,7);g.addColorStop(0,'#ff7a7a');g.addColorStop(1,'#b0101c');c.fillStyle=g;c.beginPath();c.arc(a,b,7,0,7);c.fill();o('#6a0a10')})}
 else if(k==='🍋'){const g=c.createRadialGradient(-3,-3,2,0,0,13);g.addColorStop(0,'#fff6a0');g.addColorStop(1,'#e8c21a');c.fillStyle=g;c.beginPath();c.ellipse(0,0,13,9.5,-.3,0,7);c.fill();o('#9a7a08');c.fillStyle='#e8c21a';c.beginPath();c.arc(11,-6,2.4,0,7);c.fill();c.fillStyle='#5aa23a';c.beginPath();c.ellipse(-9,-9,5,2.4,.6,0,7);c.fill()}
 else if(k==='🔔'){const g=c.createLinearGradient(-12,0,12,0);g.addColorStop(0,'#c9901a');g.addColorStop(.5,'#ffe27a');g.addColorStop(1,'#b8800f');c.fillStyle=g;c.beginPath();c.moveTo(-11,8);c.quadraticCurveTo(-10,-12,0,-12);c.quadraticCurveTo(10,-12,11,8);c.lineTo(13,10);c.lineTo(-13,10);c.closePath();c.fill();o('#7a5208');c.fillStyle='#7a5208';c.beginPath();c.arc(0,12,3,0,7);c.fill();c.beginPath();c.arc(0,-13,2.2,0,7);c.fill()}
 else if(k==='💀'){c.fillStyle='#f2efe6';c.beginPath();c.arc(0,-3,11,Math.PI*.85,Math.PI*2.15);c.lineTo(6,9);c.lineTo(-6,9);c.closePath();c.fill();o('#6a6458');c.fillStyle='#2a2522';c.beginPath();c.ellipse(-4.5,-3,3.4,3.8,0,0,7);c.ellipse(4.5,-3,3.4,3.8,0,0,7);c.fill();c.beginPath();c.moveTo(0,1);c.lineTo(-2,5);c.lineTo(2,5);c.closePath();c.fill();c.strokeStyle='#2a2522';c.lineWidth=1.2;for(let q=-4;q<=4;q+=2.7){c.beginPath();c.moveTo(q,7);c.lineTo(q,10);c.stroke()}}
 else if(k==='⭐'){c.beginPath();for(let q=0;q<10;q++){const r=q%2?5.5:13,a=-Math.PI/2+q*Math.PI/5;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();const g=c.createRadialGradient(-2,-3,1,0,0,13);g.addColorStop(0,'#fff6b0');g.addColorStop(1,'#f0b818');c.fillStyle=g;c.fill();o('#a87408')}
 else{c.font='900 30px system-ui,Arial';c.textAlign='center';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#5a0a0e';c.strokeText('7',0,1);const g=c.createLinearGradient(0,-13,0,13);g.addColorStop(0,'#ff5a4a');g.addColorStop(1,'#b0101c');c.fillStyle=g;c.fillText('7',0,1)}
 c.restore()}
function slotCoin(c,x,y,r){const g=c.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,'#fff0a0');g.addColorStop(1,'#c8901a');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle='#8a5a08';c.lineWidth=1;c.stroke()}
function slotScene(res){const tg=res?res.r:(lastRes.slot?lastRes.slot.r:['🍒','🔔','⭐']),win=res?res.w:(lastRes.slot?lastRes.slot.w:0),b=res?res.b:0,tension=res&&tg[0]===tg[1],big=win>b*10,jack=res&&tg[0]===tg[1]&&tg[1]===tg[2];
 const L=9,strips=[0,1,2].map(i=>{const D=22+i*7+ri_(0,3),s=Array.from({length:L},()=>pick(ALL));s[D%L]=tg[i];return{D,s}});
 const ts=[1.9,3.1,tension?6:4.3],dur=ts[2]+(win>0?3.4:1.2),fixed=!res;let od=0,acc=0;
 const out=()=>{if(od||fixed)return;od=1;if(win>0){coins(big?26:12);fanfare(jack)}else wah()};
 const ev=[[0,()=>{nz(.16,220,.8,.12,0,'lowpass');tone(110,.28,'sine',.15,0,45)}],[.42,()=>{nz(.08,1500,1,.07);tone(200,.1,'square',.05,0,90)}]];
 ts.forEach(t=>ev.push([t,()=>{tone(150,.13,'square',.08,0,60);nz(.07,2500,1,.07);tone(900,.05,'triangle',.03)}]));
 if(tension)ev.push([ts[1]+.05,()=>{tone(260,ts[2]-ts[1],'sawtooth',.018,0,1100);for(let k=0;k<7;k++)tone(70,.14,'sine',.12,k*.42,45)}]);
 ev.push([ts[2]+.05,out]);
 return{dur:fixed?0:dur,ev,skip:out,
  shake(t){if(fixed)return null;let a=0;ts.forEach(x=>{const k=t-x;if(k>=0&&k<.28)a=Math.max(a,(jack&&x===ts[2]?6:3)*(1-k/.28))});if(t<.2)a=Math.max(a,1.6*(1-t/.2));return a?[Math.sin(t*90)*a,Math.cos(t*77)*a]:null},
  tick(t,dt){if(t>.45&&t<ts[2]){acc+=dt;if(acc>.07){acc=0;tone(420+Math.random()*260,.025,'square',.014)}}},
  draw(c,t,live){const T=fixed?99:t,cw=74,ch=62,cx=34+(W-96)/2,gap=7,span=cw*3+gap*2,x0=cx-span/2,cy=106;
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a0f14');g.addColorStop(1,'#1a0709');c.fillStyle=g;c.fillRect(-10,-10,W+20,H+20);
  if(!fixed&&win>0&&T>ts[2])beams(c,cx,cy,T,Math.min(.16,(T-ts[2])*.2),12);
  rr(c,34,14,W-96,H-24,16);const bg=c.createLinearGradient(0,14,0,H);bg.addColorStop(0,'#b8222c');bg.addColorStop(1,'#6a1018');c.fillStyle=bg;c.fill();c.lineWidth=3;c.strokeStyle='#e8b84a';c.stroke();
  c.fillStyle='#1a0709';rr(c,cx-(W-128)/2,24,W-128,26,8);c.fill();c.fillStyle='#ffd877';c.font='800 15px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('SILENCE SLOTS',cx,38);
  const fast=win>0&&T>ts[2]+.2&&T<dur;for(let i=0;i<14;i++){const on=fast?((Math.floor(T*14)+i)%2===0):((Math.floor(T*4)+i)%3===0&&res);c.fillStyle=on?'#fff3b0':'#6a4a1a';c.beginPath();c.arc(cx-(W-136)/2+i*(W-136)/13,20,2.6,0,7);c.fill();c.beginPath();c.arc(cx-(W-136)/2+i*(W-136)/13,54,2.6,0,7);c.fill()}
  rr(c,x0-8,cy-ch/2-8,span+16,ch+16,10);c.fillStyle='#0c0807';c.fill();c.strokeStyle='#e8b84a';c.lineWidth=2;c.stroke();
  for(let i=0;i<3;i++){const rx=x0+i*(cw+gap),{D,s}=strips[i],u=Math.min(T/ts[i],1),pos=fixed?D:D*(1-Math.pow(1-u,3)),sp=u<1?D*3*Math.pow(1-u,2)/ts[i]:0;
   c.save();rr(c,rx,cy-ch/2,cw,ch,6);c.clip();const bgr=c.createLinearGradient(rx,0,rx+cw,0);bgr.addColorStop(0,'#cfc7b0');bgr.addColorStop(.5,'#fffdf2');bgr.addColorStop(1,'#cfc7b0');c.fillStyle=bgr;c.fillRect(rx,cy-ch/2,cw,ch);
   const k0=Math.floor(pos);for(let k=k0-2;k<=k0+2;k++){const y=cy+(pos-k)*ch*.78,sym=s[((k%L)+L)%L];c.globalAlpha=sp>6?.55:1;slotSym(c,sym,rx+cw/2,y,1.05);if(sp>6){c.globalAlpha=.25;slotSym(c,sym,rx+cw/2,y-14,1.05);slotSym(c,sym,rx+cw/2,y+14,1.05)}c.globalAlpha=1}
   const sh=c.createLinearGradient(0,cy-ch/2,0,cy+ch/2);sh.addColorStop(0,'rgba(0,0,0,.45)');sh.addColorStop(.3,'rgba(0,0,0,0)');sh.addColorStop(.7,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.45)');c.fillStyle=sh;c.fillRect(rx,cy-ch/2,cw,ch);
   if(!fixed){const k=T-ts[i];if(k>=0&&k<.22){c.fillStyle='rgba(255,255,255,'+(.55*(1-k/.22))+')';c.fillRect(rx,cy-ch/2,cw,ch)}if(win>0&&jack&&T>ts[2]){c.fillStyle='rgba(255,220,100,'+(.12+.12*Math.sin(T*14))+')';c.fillRect(rx,cy-ch/2,cw,ch)}}
   c.restore();
   if(!fixed&&tension&&i===2&&T>ts[1]&&T<ts[2]){c.strokeStyle='rgba(255,230,120,'+(.5+.5*Math.sin(T*20))+')';c.lineWidth=3;rr(c,rx-2,cy-ch/2-2,cw+4,ch+4,7);c.stroke()}}
  {/* bandeja de monedas */const ty=162,tw=span*.62;rr(c,cx-tw/2,ty,tw,30,8);const tg=c.createLinearGradient(0,ty,0,ty+30);tg.addColorStop(0,'#0c0807');tg.addColorStop(1,'#2a1a10');c.fillStyle=tg;c.fill();c.strokeStyle='#e8b84a';c.lineWidth=2;c.stroke();
   c.fillStyle='rgba(255,216,119,.18)';rr(c,cx-tw/2+8,ty+6,tw-16,6,3);c.fill();if(fixed||!(win>0&&T>ts[2])){[[-18,22],[-6,24],[8,23],[20,24]].forEach(([a,b])=>slotCoin(c,cx+a,ty+b,4.5))}}
  c.strokeStyle='rgba(255,80,80,.55)';c.lineWidth=1.4;c.beginPath();c.moveTo(x0-10,cy);c.lineTo(x0+span+10,cy);c.stroke();
  const pull=fixed?0:(T<.45?Math.sin(T/.45*Math.PI*.5):T<.9?Math.cos((T-.45)/.45*Math.PI*.5):0),lx=W-44,ly=70+pull*50;c.strokeStyle='#bdbdbd';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(lx,100);c.lineTo(lx,ly);c.stroke();c.fillStyle='#e03a3a';c.beginPath();c.arc(lx,ly,9,0,7);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.arc(lx-3,ly-3,3,0,7);c.fill();
  if(!fixed&&T>ts[2]+.15&&win>0){const k=T-ts[2];c.fillStyle='#ffd877';c.textAlign='center';c.font='800 '+(big?26:20)+'px system-ui';c.save();c.translate(cx,cy+ch/2+44);c.scale(1+.12*Math.sin(k*10),1+.12*Math.sin(k*10));c.fillText('+'+win,0,0);c.restore();
   for(let i=0;i<(big?26:14);i++){const sx=sr(i+1)*W*.7+30,sy=((k*90*(.6+sr(i+9))+sr(i+4)*200)%240)-20;slotCoin(c,sx,sy,5)}
   confetti(c,k-.1,big?60:26,40);flash(c,k-.1,.35,.45);if(jack){c.fillStyle='#ffd877';c.font='800 13px system-ui';c.globalAlpha=.7+.3*Math.sin(k*12);c.fillText('¡¡JACKPOT!!',cx,154);c.globalAlpha=1}}
  }}}
/* ================= RULETA ================= */
const WH=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26],REDS=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const ncol=n=>n===0?'#1f8a4c':REDS.has(n)?'#c4302b':'#1a1a1d';
function rouScene(res){const n=res?res.n:(lastRes.rou?lastRes.rou.n:null),fixed=!res,TB=9.5,dur=fixed?0:TB+2.6,idx=n===null?0:WH.indexOf(n),SEC=Math.PI*2/37,w0=rnd(0,6),WS=1.1,A=Math.PI*2*13,pa=idx*SEC,win=res&&res.w>0;
 const wEnd=w0+WS*TB,b0=wEnd+pa+A,cx=W/2-20,cy=H/2+2,R=100;let od=0,acc=0,lastSec=-1,lr=0;
 const P=T=>{const wa=w0+WS*T;if(T>=TB)return[wa+pa,72,wa];const u=T/TB,e=1-Math.pow(1-u,2.4);let ba=b0-A*e,r;if(u<.55)r=91;else if(u<.82)r=91-(u-.55)/.27*16;else{const v=(u-.82)/.18;r=75-3*v+Math.abs(Math.cos(v*9))*7*(1-v)*(1-v)*2;ba+=Math.sin(v*22)*.12*(1-v)}return[ba,r,wa]};
 const out=()=>{if(od||fixed)return;od=1;tone(1200,.5,'sine',.06);nz(.09,900,2,.14);if(win){coins(n===0||res.w>=bet*10?24:12);fanfare(res.w>=bet*10)}else wah()};
 const ev=[[0,()=>{nz(.9,700,.5,.08);tone(500,.12,'triangle',.05,.05,900)}],[TB,out]];
 return{dur,ev,skip:out,
  shake(t){const k=t-TB;return k>=0&&k<.3?[Math.sin(t*80)*2*(1-k/.3),Math.cos(t*70)*2*(1-k/.3)]:null},
  tick(t,dt){if(t<TB){acc+=dt;const[ba,r,wa]=P(t),u=t/TB;if(u<.45){if(acc>.07){acc=0;nz(.08,260+u*300,.6,.035,0,'lowpass')}}else{const sec=Math.floor(((ba-wa)/SEC)+.5);if(sec!==lastSec&&acc>.02){acc=0;const lud=u>.82;tone(lud?700+Math.random()*900:1100+Math.random()*500,.035,'triangle',lud?.07:.04);nz(.025,3200,1,lud?.08:.04)}lastSec=sec}}},
  draw(c,t,live){const T=fixed?TB+2:t,wa=P(T)[2],pp=P(T);
  const bg=c.createRadialGradient(cx,cy,10,cx,cy,170);bg.addColorStop(0,'#14402a');bg.addColorStop(1,'#07180f');c.fillStyle=bg;c.fillRect(-10,-10,W+20,H+20);
  c.fillStyle='#5a3a1a';c.beginPath();c.arc(cx,cy,R+8,0,7);c.fill();c.fillStyle='#8a5a28';c.beginPath();c.arc(cx,cy,R+4,0,7);c.fill();c.fillStyle='#16110b';c.beginPath();c.arc(cx,cy,R,0,7);c.fill();
  c.fillStyle='#2a2218';c.beginPath();c.arc(cx,cy,R-8,0,7);c.fill();
  for(let i=0;i<37;i++){const a0=wa+i*SEC-SEC/2,a1=a0+SEC;c.beginPath();c.moveTo(cx+Math.cos(a0)*52,cy+Math.sin(a0)*52);c.arc(cx,cy,82,a0,a1);c.arc(cx,cy,52,a1,a0,true);c.closePath();c.fillStyle=ncol(WH[i]);c.fill();c.strokeStyle='#c9a24a';c.lineWidth=.8;c.stroke();
   c.save();c.translate(cx+Math.cos(a0+SEC/2)*72,cy+Math.sin(a0+SEC/2)*72);c.rotate(a0+SEC/2+Math.PI/2);c.fillStyle='#f0e6c8';c.font='700 7px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(WH[i],0,0);c.restore()}
  if(n!==null&&T>=TB){const a0=wa+idx*SEC-SEC/2,a1=a0+SEC,k=T-TB,pu=.55+.45*Math.sin(k*7);c.beginPath();c.moveTo(cx+Math.cos(a0)*52,cy+Math.sin(a0)*52);c.arc(cx,cy,82,a0,a1);c.arc(cx,cy,52,a1,a0,true);c.closePath();c.fillStyle='rgba(255,230,120,'+(.45*pu)+')';c.fill();c.strokeStyle='rgba(255,240,160,'+pu+')';c.lineWidth=1.6;c.stroke()}
  c.fillStyle='#3a2c18';c.beginPath();c.arc(cx,cy,50,0,7);c.fill();c.strokeStyle='#c9a24a';c.lineWidth=2;c.stroke();
  for(let k=0;k<4;k++){const a=wa+k*Math.PI/2;c.strokeStyle='#e8c870';c.lineWidth=3;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*36,cy+Math.sin(a)*36);c.stroke();c.fillStyle='#e8c870';c.beginPath();c.arc(cx+Math.cos(a)*38,cy+Math.sin(a)*38,3.2,0,7);c.fill()}c.fillStyle='#e8c870';c.beginPath();c.arc(cx,cy,7,0,7);c.fill();
  if(n!==null){if(!fixed&&T<TB){for(let j=6;j>=1;j--){const q=P(Math.max(0,T-j*.025));c.fillStyle='rgba(255,255,255,'+(.28*(1-j/7))+')';c.beginPath();c.arc(cx+Math.cos(q[0])*q[1],cy+Math.sin(q[0])*q[1],3.4*(1-j/9),0,7);c.fill()}}
   const[ba,r]=pp,bx=cx+Math.cos(ba)*r,by=cy+Math.sin(ba)*r;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(bx+1.5,by+2,3.6,0,7);c.fill();c.fillStyle='#fdfdf4';c.beginPath();c.arc(bx,by,3.8,0,7);c.fill();c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(bx-1,by-1.2,1.3,0,7);c.fill()}
  const px=W-48,py=60;if(n!==null&&T>=TB){const k=fixed?9:T-TB,pop=Math.min(1,k*3),sc=1+.35*Math.max(0,1-k*3)*Math.sin(Math.min(1,k*3)*Math.PI);c.save();c.translate(px,py);c.scale(sc*pop,sc*pop);c.fillStyle='#1a1408';c.beginPath();c.arc(0,0,30,0,7);c.fill();c.fillStyle=ncol(n);c.beginPath();c.arc(0,0,26,0,7);c.fill();c.strokeStyle='#e8b84a';c.lineWidth=2.4;c.stroke();c.fillStyle='#fff';c.font='800 24px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(n,0,1);c.restore();
   if(res&&res.w>0){c.fillStyle='#ffd877';c.font='800 17px system-ui';c.textAlign='center';c.fillText('+'+res.w,px,py+46);confetti(c,k-.05,res.w>=bet*10?60:30,70);flash(c,k,.3,.35)}}
  else if(!fixed){c.fillStyle='rgba(255,255,255,.55)';c.font='700 11px system-ui';c.textAlign='center';c.fillText(T<TB*.55?'La bola gira…':'Cae…',W-48,60)}}}}
const RB={red:['Rojo ×2',n=>n>0&&REDS.has(n),2],black:['Negro ×2',n=>n>0&&!REDS.has(n),2],even:['Par ×2',n=>n>0&&n%2===0,2],odd:['Impar ×2',n=>n%2===1,2],low:['1-18 ×2',n=>n>=1&&n<=18,2],high:['19-36 ×2',n=>n>=19,2],d1:['Docena 1-12 ×3',n=>n>=1&&n<=12,3],d2:['Docena 13-24 ×3',n=>n>=13&&n<=24,3],d3:['Docena 25-36 ×3',n=>n>=25,3],num:['Número ×36',null,36]};
/* ================= CARRERAS ================= */
const HN=[['Rayo','#d94b3a'],['Ceniza','#7a7f86'],['Fénix','#e8a02a'],['Sombra','#3b3f4a'],['Tormenta','#4a82c8'],['Lucero','#c9a0e0']],ODDS=[2.8,4,5.5,8,11,18];
function newCard(){const o=ODDS.slice().sort(()=>Math.random()-.5);hcard=HN.map((h,i)=>({n:h[0],c:h[1],o:o[i]}));hpick=0}
function horseScene(res){const fixed=!res,card=res?res.card:hcard,win=res?res.win:-1,tw=TW,dur=fixed?0:tw+CD+1.2,fin=res?res.fin:card.map((_,i)=>tw+i*.01);
 const K=card.map((_,i)=>[1+Math.floor(sr(i+3)*3),(sr(i+11)-.5)*.1,sr(i+5)*6]),x0=52,x1=W-30,top=44,lh=(H-top)/6;
 let od=0,acc=0,acc2=0;const wonB=res&&res.w>0,out=()=>{if(od||fixed)return;od=1;tone(1700,.8,'sine',.06);tone(2300,.6,'sine',.03,.02);nz(1.4,1100,.4,.09);if(wonB){coins(16);fanfare(res.w>=bet*10)}else wah()};
 const ev=[[.6,()=>tone(520,.14,'square',.05)],[1,()=>tone(520,.14,'square',.05)],[1.4,()=>tone(520,.14,'square',.05)],[CD,()=>{tone(900,.4,'square',.05);nz(.22,2000,.5,.15,0,'highpass')}],[CD+tw,out]];
 return{dur,ev,skip:out,
  shake(t){const r=t-CD;let a=0;if(r>=0&&r<.18)a=2*(1-r/.18);const q=r-tw;if(q>=0&&q<.3)a=Math.max(a,2.5*(1-q/.3));return a?[Math.sin(t*90)*a,Math.cos(t*80)*a]:null},
  tick(t,dt){const r=t-CD;if(r>0&&r<tw+.6){const pr=Math.min(1,r/tw);acc+=dt;if(acc>.115){acc=0;nz(.07,150+Math.random()*80,.8,.05+.05*pr,0,'lowpass');tone(62+Math.random()*10,.08,'sine',.07)}acc2+=dt;if(acc2>.28){acc2=0;nz(.4,800+Math.random()*600,.5,.012+.035*pr)}}},
  draw(c,t,live){const T=fixed?(res?dur:0):t,r=T-CD;
  c.fillStyle='#1a120a';c.fillRect(-10,-10,W+20,H+20);const sky=c.createLinearGradient(0,0,0,top);sky.addColorStop(0,'#2a2f44');sky.addColorStop(1,'#5a4a50');c.fillStyle=sky;c.fillRect(0,0,W,top);
  for(let i=0;i<110;i++){const px=sr(i)*W,py=18+sr(i+50)*24+(Math.sin(T*6+i)>.96?-2:0);c.fillStyle=['#c9a24a','#7a8aa8','#a85a5a','#8aa87a','#d8d0b8'][i%5];c.fillRect(px,py,3,5)}
  c.fillStyle='#2a1f16';c.fillRect(0,top-4,W,4);
  for(let i=0;i<6;i++){c.fillStyle=i%2?'#8a6a3a':'#9a7a46';c.fillRect(0,top+i*lh,W,lh);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(0,top+i*lh,W,1)}
  c.fillStyle='#fff';c.fillRect(x0-2,top,2,lh*6);for(let k=0;k<12;k++){c.fillStyle=k%2?'#fff':'#111';c.fillRect(x1+10,top+k*lh/2,5,lh/2)}
  for(let i=0;i<6;i++){const cd=card[i],ty=fin[i],u=fixed&&!res?0:Math.max(0,Math.min(1,r/ty)),k=K[i],p=u+k[1]*Math.sin(k[0]*Math.PI*u),x=x0+(x1-x0)*Math.min(p,1)+(u>=1?Math.max(0,(r-ty))*18:0),cy=top+i*lh+lh*.62,gal=(!fixed&&r>0&&u<1)||(!fixed&&r>0&&u>=1&&r-ty<.6)?1:0,ph=T*17+k[2],bob=gal?Math.sin(ph)*1.6:0;
   if(gal&&live!==undefined){for(let d=0;d<3;d++){const dk=((T*5+d*.33+i)%1);c.fillStyle='rgba(220,200,160,'+(.45*(1-dk))+')';c.beginPath();c.arc(x-14-dk*16,cy+7-dk*5,2+dk*3,0,7);c.fill()}}
   if(gal&&u<1){c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;for(let d=0;d<3;d++){const lx=x-22-((T*220+d*13+i*7)%34),ly=cy-3+d*4;c.beginPath();c.moveTo(lx,ly);c.lineTo(lx-10-d*3,ly);c.stroke()}}
   if(res&&r>=ty&&i===win){const k=r-ty,gl=c.createRadialGradient(x,cy,2,x,cy,26);gl.addColorStop(0,'rgba(255,224,120,'+(.55*Math.min(1,k*2))+')');gl.addColorStop(1,'rgba(255,224,120,0)');c.fillStyle=gl;c.fillRect(x-30,cy-30,60,60)}
   c.save();c.translate(x,cy+bob);const sc=lh/24;c.scale(sc,sc);
   c.strokeStyle=cd.c;c.lineWidth=2.6;c.lineCap='round';for(const[lx,sg]of[[-7,1],[-4,-1],[5,-1],[8,1]]){const a=gal?Math.sin(ph+sg*1.4)*.9:0;c.beginPath();c.moveTo(lx,3);c.lineTo(lx+Math.sin(a)*5,10+Math.cos(a)*1);c.stroke()}
   c.fillStyle=cd.c;c.beginPath();c.ellipse(0,0,11,5.4,0,0,7);c.fill();c.beginPath();c.moveTo(8,-2);c.lineTo(14,-8);c.lineTo(17,-6);c.lineTo(11,2);c.closePath();c.fill();c.beginPath();c.ellipse(16,-8,4.4,2.6,.5,0,7);c.fill();
   c.strokeStyle='#14100a';c.lineWidth=1.6;c.beginPath();c.moveTo(-10,-1);c.quadraticCurveTo(-17,gal?-5+Math.sin(ph)*2:2,-15,6);c.stroke();c.beginPath();c.moveTo(9,-6);c.lineTo(5,-11);c.stroke();
   c.fillStyle='#f4f0e0';c.beginPath();c.arc(1,-9,2.5,0,7);c.fill();c.fillStyle=['#e03a3a','#3ac0e0','#e8d03a','#6ae03a','#e03ac0','#e0883a'][i];c.fillRect(-3,-8.5,7,5.5);c.fillStyle='#fff';c.font='700 6px system-ui';c.textAlign='center';c.fillText(i+1,0,-3.8);if(res&&r>=ty&&i===win){{const yy=-19+Math.sin(T*6)*1.2;c.fillStyle='#ffd23a';c.strokeStyle='#8a5a08';c.lineWidth=.8;c.beginPath();c.moveTo(-6,yy+5);c.lineTo(-6,yy-1);c.lineTo(-3,yy+2);c.lineTo(0,yy-3);c.lineTo(3,yy+2);c.lineTo(6,yy-1);c.lineTo(6,yy+5);c.closePath();c.fill();c.stroke()}}c.restore()}
  for(let i=0;i<6;i++){c.fillStyle='rgba(0,0,0,.55)';c.fillRect(2,top+i*lh+lh*.5-8,16,16);c.fillStyle=card[i].c;c.font='800 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(i+1,10,top+i*lh+lh*.5)}
  if(!fixed&&T<CD){const n=T<.6?'':T<1?'3':T<1.4?'2':'1';c.fillStyle='rgba(0,0,0,.45)';c.fillRect(0,top,W,lh*6);c.fillStyle='#ffd877';c.font='800 46px system-ui';c.textAlign='center';c.fillText(T<.6?'¡Listos!':n,W/2,H/2+14)}
  if(res&&r>tw-.1){const a=Math.min(1,(r-(tw-.1))*1.4);c.fillStyle='rgba(0,0,0,'+(.55*a)+')';c.fillRect(0,top,W,lh*6);c.fillStyle='#ffd877';c.globalAlpha=a;c.font='800 20px system-ui';c.textAlign='center';c.fillText('Gana '+card[win].n+' (nº '+(win+1)+')',W/2,H/2-6);if(res.w>0){c.font='800 24px system-ui';c.fillStyle='#8f8';c.fillText('+'+res.w+' fichas',W/2,H/2+26)}c.globalAlpha=1;
   if(fixed===false&&r>tw-.1&&r<tw+.12){c.fillStyle='rgba(255,255,255,'+(1-(r-(tw-.1))/.22)+')';c.fillRect(0,0,W,H)}if(wonB&&!fixed)confetti(c,r-tw,50,90);if(wonB&&fixed)confetti(c,2.2,0,90)}}}}
/* ================= RULETA DE LA FORTUNA (gratis, cada 3 días) ================= */
const RCw={C:'#bdbdbd',U:'#7fc97f',R:'#6aa9ff',E:'#b36cff',L:'#e8b84a'},WCD=3;
const PRZ=[{id:'nada',w:15,n:'Nada',ic:'💨',col:'#4a4f56'},{id:'f1',w:20,n:'Fichas pequeñas (20-60)',ic:'🪙',col:'#8a8a8a',f:[20,60]},{id:'f2',w:10,n:'Fichas (100-200)',ic:'🪙',col:'#5fa86a',f:[100,200]},{id:'f3',w:2.5,n:'Fichas grandes (400-600)',ic:'💰',col:'#e8b84a',f:[400,600]},
 {id:'v1',w:15,n:'Objeto de valor',ic:'💍',col:'#6a8a5a'},{id:'v2',w:3,n:'Reliquia',ic:'🥇',col:'#d8a838'},{id:'w1',w:10,n:'Arma común',ic:'🔫',col:'#7a7f86',rar:'CU'},{id:'w2',w:3,n:'Arma rara',ic:'🔫',col:'#4a82c8',rar:'REL'},
 {id:'o1',w:9,n:'Atuendo común',ic:'🛡',col:'#8a6a4a',rar:'CU'},{id:'o2',w:2.5,n:'Atuendo raro',ic:'🛡',col:'#5a62c8',rar:'REL'},{id:'p1',w:7,n:'Plano común',ic:'📜',col:'#9a8a5a',rar:'CU'},{id:'p2',w:1.5,n:'Plano raro',ic:'📜',col:'#7a5ac8',rar:'REL'},{id:'s',w:1.5,n:'Superviviente',ic:'🧑',col:'#c84a6a'}];
const wAvail=()=>{const v=st();if(v.wd===undefined||v.wd<0)return 0;return Math.max(0,WCD-(S.day-v.wd))};
function rarIn(r,set){return set.indexOf(r||'C')>=0}
function pickPrize(){let r=Math.random()*100,cat=PRZ[0];for(const c of PRZ){if((r-=c.w)<0){cat=c;break}}
 const f=n=>({cat,t:'f',n,txt:n+' fichas',rar:n>=400?'L':n>=100?'U':'C',ic:'🪙'});
 if(cat.id==='nada')return{cat,t:'x',txt:'Hoy no ha habido suerte',rar:'C',ic:'💨'};
 if(cat.f)return f(ri_(cat.f[0],cat.f[1]));
 if(cat.id==='v1'||cat.id==='v2'){const V=window.villaVal||{},K=Object.keys(V).filter(k=>cat.id==='v2'?V[k][3]:!V[k][3]);const k=pick(K);return{cat,t:'v',k,txt:V[k][0],rar:cat.id==='v2'?(k==='r_oro'||k==='r_cua'?'L':'R'):V[k][2]>=50?'U':'C',ic:V[k][1]}}
 if(cat.id==='w1'||cat.id==='w2'){let L=(typeof WP!=='undefined'?WP:[]).filter(w=>rarIn(w.r,cat.rar));if(!L.length)L=(typeof WP!=='undefined'?WP:[]);const w=pick(L);return{cat,t:'w',n:w.n,v:w.v,txt:w.n,rar:w.r||'C',img:'w'}}
 if(cat.id==='o1'||cat.id==='o2'){const O=Object.values(window.OUTFITS||{});let L=O.filter(o=>rarIn(o.r,cat.rar));if(!L.length)L=O;const o=pick(L);return{cat,t:'o',n:o.n,txt:o.n,rar:o.r||'C',img:'o'}}
 if(cat.id==='p1'||cat.id==='p2'){const c=[];(typeof WP!=='undefined'?WP:[]).forEach(w=>{if(w.c&&!hasPlan(w.n))c.push({n:w.n,r:w.r||'C',k:'w'})});Object.values(window.OUTFITS||{}).forEach(o=>{if(o.c&&!hasPlan(o.n))c.push({n:o.n,r:o.r||'C',k:'o'})});let L=c.filter(x=>rarIn(x.r,cat.rar));if(!L.length)L=c;if(!L.length)return f(100);const x=pick(L);return{cat,t:'p',n:x.n,txt:'Plano: '+x.n,rar:x.r,img:x.k}}
 return{cat,t:'s',txt:'Un superviviente para tu base',rar:'L',ic:'🧑'}}
function shade(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);r=Math.round(r+(f-r)*t);g=Math.round(g+(f-g)*t);b=Math.round(b+(f-b)*t);return'rgb('+r+','+g+','+b+')'}
function ico(c,id){c.save();c.lineJoin='round';c.lineCap='round';
 const gold=(x0,y0,x1,y1)=>{const g=c.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#fff4b0');g.addColorStop(.5,'#e8b84a');g.addColorStop(1,'#8a5a10');return g};
 const coin=(x,y,r)=>{c.fillStyle=gold(x-r,y-r,x+r,y+r);c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle='#7a4e0c';c.lineWidth=1.1;c.stroke();c.strokeStyle='rgba(120,78,12,.7)';c.lineWidth=.8;c.beginPath();c.arc(x,y,r*.66,0,7);c.stroke()};
 c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=3;c.shadowOffsetY=1.5;
 if(id==='nada'){c.strokeStyle='#dfe5ec';c.lineWidth=2.4;[[-6,13],[0,17],[6,11]].forEach(([y,l])=>{c.beginPath();c.moveTo(-10,y);c.lineTo(-10+l,y);c.quadraticCurveTo(-10+l+5.5,y,-10+l+5.5,y-4.5);c.stroke()})}
 else if(id==='f1'){coin(0,0,9.5);c.shadowColor='transparent';c.fillStyle='#7a4e0c';c.font='800 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('$',0,.8)}
 else if(id==='f2'){[[-3,6],[3,1],[-2,-4]].forEach(([x,y])=>coin(x,y,6.8));c.shadowColor='transparent'}
 else if(id==='f3'){c.fillStyle='#8a5a2a';c.beginPath();c.moveTo(-5,-9);c.quadraticCurveTo(0,-5,5,-9);c.lineTo(9,6);c.quadraticCurveTo(0,13,-9,6);c.closePath();c.fill();c.strokeStyle='#4a2c10';c.lineWidth=1.2;c.stroke();c.shadowColor='transparent';c.fillStyle='#e8b84a';c.fillRect(-5.6,-9.6,11.2,2.6);c.fillStyle='#ffe28a';c.font='800 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('$',0,2.6)}
 else if(id==='v1'){c.strokeStyle=gold(-9,-2,9,12);c.lineWidth=3.2;c.beginPath();c.arc(0,4,7,0,7);c.stroke();c.shadowColor='transparent';c.fillStyle='#7fe8ff';c.strokeStyle='#e8fbff';c.lineWidth=1;c.beginPath();c.moveTo(-5,-5);c.lineTo(5,-5);c.lineTo(7,-8);c.lineTo(0,-12);c.lineTo(-7,-8);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(-3,-6);c.lineTo(0,-10);c.lineTo(1,-6);c.closePath();c.fill()}
 else if(id==='v2'){c.fillStyle=gold(-10,-6,10,8);c.beginPath();c.moveTo(-6,-6);c.lineTo(6,-6);c.lineTo(11,6);c.lineTo(-11,6);c.closePath();c.fill();c.strokeStyle='#6a420a';c.lineWidth=1.2;c.stroke();c.shadowColor='transparent';c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(-5,-4.5);c.lineTo(2,-4.5);c.lineTo(-1,0);c.lineTo(-7.5,0);c.closePath();c.fill();c.fillStyle='#6a420a';c.font='800 6px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('AU',1,3)}
 else if(id==='w1'||id==='w2'){const rare=id==='w2',body=rare?'#d6deee':'#b8bcc4';c.strokeStyle='#14100a';c.lineWidth=1.2;c.fillStyle='#6a3a1a';c.beginPath();c.moveTo(-9,-1);c.lineTo(-2,-1);c.lineTo(-3.4,10);c.lineTo(-9.8,10);c.closePath();c.fill();c.stroke();c.fillStyle=body;c.beginPath();c.rect(-11,-7,22,6.6);c.fill();c.stroke();c.beginPath();c.moveTo(-1,-.4);c.quadraticCurveTo(-.5,5,5,4.4);c.lineTo(4,-.4);c.fill();c.stroke();c.shadowColor='transparent';c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-9.5,-6.2,17,1.3);c.fillStyle='#14100a';c.fillRect(8.6,-4.6,2.4,2);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.8;for(let k=0;k<4;k++){c.beginPath();c.moveTo(-8+k*1.8,-1.2);c.lineTo(-8+k*1.8,-6.4);c.stroke()}if(rare){c.fillStyle='#e8b84a';c.beginPath();c.arc(8.4,-9.6,2.3,0,7);c.fill()}}
 else if(id==='o1'||id==='o2'){const rare=id==='o2';const sg=c.createLinearGradient(-9,-10,9,10);sg.addColorStop(0,rare?'#aab4ff':'#c8ced6');sg.addColorStop(1,rare?'#3a3f9a':'#5a6068');c.fillStyle=sg;c.beginPath();c.moveTo(0,-11);c.lineTo(9,-7);c.lineTo(8,3);c.quadraticCurveTo(6,9,0,12);c.quadraticCurveTo(-6,9,-8,3);c.lineTo(-9,-7);c.closePath();c.fill();c.strokeStyle='#14100a';c.lineWidth=1.3;c.stroke();c.shadowColor='transparent';c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;c.beginPath();c.moveTo(0,-8);c.lineTo(0,9);c.moveTo(-6,-2);c.lineTo(6,-2);c.stroke();if(rare){c.fillStyle='#ffe28a';c.beginPath();for(let k=0;k<5;k++){const a=-Math.PI/2+k*Math.PI*2/5,b=a+Math.PI/5;c.lineTo(Math.cos(a)*4.4,Math.sin(a)*4.4-1);c.lineTo(Math.cos(b)*1.8,Math.sin(b)*1.8-1)}c.closePath();c.fill()}}
 else if(id==='p1'||id==='p2'){c.fillStyle='#e8dcb4';c.strokeStyle='#6a5a2a';c.lineWidth=1.2;c.beginPath();c.moveTo(-8,-8);c.lineTo(8,-8);c.lineTo(8,8);c.lineTo(-8,8);c.closePath();c.fill();c.stroke();c.shadowColor='transparent';c.fillStyle='#d4c490';c.fillRect(-10,-10,20,3.6);c.fillRect(-10,6.4,20,3.6);c.strokeStyle='#6a5a2a';c.lineWidth=.9;[-3,0,3].forEach(y=>{c.beginPath();c.moveTo(-5,y);c.lineTo(5,y);c.stroke()});if(id==='p2'){c.fillStyle='#c8302a';c.beginPath();c.arc(5,6,3.4,0,7);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(4,5,1,0,7);c.fill()}}
 else if(id==='s'){c.fillStyle='#f0d2b0';c.strokeStyle='#14100a';c.lineWidth=1.2;c.beginPath();c.arc(0,-5,5,0,7);c.fill();c.stroke();c.fillStyle='#4a82c8';c.beginPath();c.moveTo(-9,11);c.quadraticCurveTo(-9,2,0,2);c.quadraticCurveTo(9,2,9,11);c.closePath();c.fill();c.stroke();c.shadowColor='transparent';c.strokeStyle='#3a2a1a';c.lineWidth=1.6;c.beginPath();c.arc(0,-6,5.2,Math.PI,Math.PI*2);c.stroke()}
 c.restore()}
const icoCache={};function icoURL(id){if(icoCache[id])return icoCache[id];const cv=document.createElement('canvas');cv.width=cv.height=40;const g=cv.getContext('2d');g.translate(20,20);g.scale(1.5,1.5);ico(g,id);return icoCache[id]=cv.toDataURL()}
function wheelScene(res){const fixed=!res,last=res||lastRes.wh,TB=8.5,dur=fixed?0:TB+3.2,seg=[];let acc=0;PRZ.forEach(c=>{const a=c.w/100*Math.PI*2;seg.push({c,a0:acc,a1:acc+a});acc+=a});
 const si=last?PRZ.indexOf(last.prize.cat):-1,th0=rnd(0,6.28),sg=si>=0?seg[si]:null,off=sg?sg.a0+(sg.a1-sg.a0)*rnd(.25,.75):0,thF=sg?-Math.PI/2-off:th0,tot=sg?(thF-th0)-Math.PI*2*Math.ceil((thF-th0)/(Math.PI*2))+Math.PI*2*8:0;
 const rot=T=>{if(!res)return last?thF:th0;const u=Math.min(1,T/TB);return th0+tot*(1-Math.pow(1-u,3.2))};
 const segAt=th=>{let q=(((-Math.PI/2-th)%(Math.PI*2))+Math.PI*2)%(Math.PI*2);for(let i=0;i<seg.length;i++)if(q>=seg[i].a0&&q<seg[i].a1)return i;return 0};
 let img=null;if(last&&last.prize.img){try{img=new Image();img.src=last.prize.img==='w'?weaponIcon(last.prize.n):outfitIcon(last.prize.n)}catch(e){}}
 let od=0,lastI=-1,fl=-9,pt=0;const big=last&&(last.prize.rar==='L'||last.prize.rar==='R'),out=()=>{if(od||fixed)return;od=1;nz(.1,900,2,.1);tone(1000,.5,'sine',.06);const p=res.prize;if(p.t==='x')wah();else{coins(p.t==='f'&&p.n>=400?26:p.rar==='C'?8:14);fanfare(p.rar==='L'||p.t==='s')}};
 const ev=[[0,()=>{nz(.8,500,.5,.07);tone(120,.3,'sine',.12,0,50)}],[TB,out]];
 return{dur,ev,skip:out,shake(t){const k=t-TB;return k>=0&&k<.3&&res.prize.t!=='x'?[Math.sin(t*80)*2.4*(1-k/.3),Math.cos(t*70)*2.4*(1-k/.3)]:null},
  tick(t,dt){const i=segAt(rot(t));pt+=dt;if(i!==lastI){if(pt>.03&&t<TB){tone(1300-Math.min(500,(TB-t)*0+((t/TB)*500)),.03,'triangle',.05);nz(.02,3000,1,.04);pt=0}lastI=i;fl=t}},
  draw(c,t,live){const T=fixed?99:t,th=rot(Math.min(T,TB)),cx=W/2,cy=H/2+10,R=90,TT=fixed?0:T;
   const bg=c.createRadialGradient(cx,cy,10,cx,cy,200);bg.addColorStop(0,'#33204f');bg.addColorStop(.6,'#150c26');bg.addColorStop(1,'#07040d');c.fillStyle=bg;c.fillRect(-10,-10,W+20,H+20);
   c.save();c.translate(cx,cy);c.rotate(TT*.15);for(let k=0;k<10;k++){c.rotate(Math.PI/5);c.fillStyle='rgba(180,140,255,.045)';c.beginPath();c.moveTo(0,0);c.lineTo(260,-22);c.lineTo(260,22);c.closePath();c.fill()}c.restore();
   for(let k=0;k<26;k++){const sx=sr(k+300)*W,sy=sr(k+330)*H,tw=.4+.6*Math.abs(Math.sin(TT*2+k));c.fillStyle='rgba(255,240,200,'+(.35*tw)+')';c.fillRect(sx,sy,1.4,1.4)}
   if(!fixed&&T>=TB&&res.prize.t!=='x')beams(c,cx,cy,T,Math.min(.14,(T-TB)*.2),14);
   c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(cx,cy+R+12,R+8,9,0,0,7);c.fill();
   const ring=(r0,r1,g)=>{c.beginPath();c.arc(cx,cy,r1,0,7);c.arc(cx,cy,r0,0,7,true);c.fillStyle=g;c.fill()};
   const gr=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);gr.addColorStop(0,'#fff2b0');gr.addColorStop(.25,'#d8a838');gr.addColorStop(.5,'#7a5410');gr.addColorStop(.75,'#e8c860');gr.addColorStop(1,'#8a5e14');ring(R+1,R+11,gr);
   c.strokeStyle='#3a2606';c.lineWidth=1;c.beginPath();c.arc(cx,cy,R+11,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R+1,0,7);c.stroke();
   c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();
   seg.forEach((g,i)=>{const a0=th+g.a0,a1=th+g.a1,gd=c.createRadialGradient(cx,cy,R*.15,cx,cy,R);gd.addColorStop(0,shade(g.c.col,-.38));gd.addColorStop(.7,g.c.col);gd.addColorStop(1,shade(g.c.col,.28));c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R,a0,a1);c.closePath();c.fillStyle=gd;c.fill();c.strokeStyle='rgba(255,226,140,.75)';c.lineWidth=1.1;c.stroke()});
   seg.forEach((g,i)=>{const am=th+(g.a0+g.a1)/2,dw=g.a1-g.a0;
    if(dw>.2){c.save();c.translate(cx+Math.cos(am)*R*.66,cy+Math.sin(am)*R*.66);c.rotate(am+Math.PI/2);c.scale(dw>.5?1.25:.95,dw>.5?1.25:.95);ico(c,g.c.id);c.restore()}
    if(dw>.28){c.save();c.translate(cx+Math.cos(am)*R*.9,cy+Math.sin(am)*R*.9);c.rotate(am+Math.PI/2);c.font='800 6.5px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(0,0,0,.55)';c.fillText(g.c.w+'%',.4,.6);c.fillStyle='#fff7d6';c.fillText(g.c.w+'%',0,0);c.restore()}});
   const sh=c.createLinearGradient(cx-R,cy-R,cx+R*.4,cy+R*.4);sh.addColorStop(0,'rgba(255,255,255,.28)');sh.addColorStop(.5,'rgba(255,255,255,.04)');sh.addColorStop(1,'rgba(0,0,0,.12)');c.fillStyle=sh;c.fillRect(cx-R,cy-R,R*2,R*2);
   c.restore();
   if(!fixed&&T>=TB){const k=T-TB,g=seg[si],a0=th+g.a0,a1=th+g.a1,pu=.5+.5*Math.sin(k*8);c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R,a0,a1);c.closePath();c.fillStyle='rgba(255,255,255,'+(.3*pu)+')';c.fill();c.strokeStyle='rgba(255,246,176,'+pu+')';c.lineWidth=2.4;c.stroke();c.restore()}
   for(let i=0;i<24;i++){const a=i/24*Math.PI*2,rx=cx+Math.cos(a)*(R+6),ry=cy+Math.sin(a)*(R+6),on=(Math.floor(TT*8)+i)%3===0||(!fixed&&T>=TB&&Math.floor(T*10)%2===0);
    if(on){const bl=c.createRadialGradient(rx,ry,0,rx,ry,8);bl.addColorStop(0,'rgba(255,240,150,.9)');bl.addColorStop(1,'rgba(255,200,60,0)');c.fillStyle=bl;c.fillRect(rx-8,ry-8,16,16)}
    c.fillStyle=on?'#fffbd0':'#6a4a14';c.beginPath();c.arc(rx,ry,2.6,0,7);c.fill();c.strokeStyle='#2a1a04';c.lineWidth=.7;c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(rx-.7,ry-.8,.8,0,7);c.fill()}
   const hb=c.createRadialGradient(cx-3,cy-3,1,cx,cy,17);hb.addColorStop(0,'#fff2b0');hb.addColorStop(.5,'#d8a838');hb.addColorStop(1,'#6a460c');c.fillStyle=hb;c.beginPath();c.arc(cx,cy,16,0,7);c.fill();c.strokeStyle='#3a2606';c.lineWidth=1.2;c.stroke();
   c.save();c.translate(cx,cy);c.rotate(th);c.fillStyle='#3a2606';for(let k=0;k<8;k++){c.rotate(Math.PI/4);c.beginPath();c.moveTo(0,-14);c.lineTo(2.4,-8);c.lineTo(-2.4,-8);c.closePath();c.fill()}c.fillStyle='#e03a3a';c.beginPath();c.arc(0,0,4.6,0,7);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(-1.4,-1.6,1.5,0,7);c.fill();c.restore();
   const flick=fixed?0:Math.max(0,1-(T-fl)/.1)*.45*(T<TB?1:0);c.save();c.translate(cx,cy-R-12);c.rotate(flick);c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=5;c.shadowOffsetY=2;const pg=c.createLinearGradient(-9,-10,9,16);pg.addColorStop(0,'#ff7a6a');pg.addColorStop(.5,'#d8322a');pg.addColorStop(1,'#7a1410');c.fillStyle=pg;c.beginPath();c.moveTo(-9,-10);c.lineTo(9,-10);c.lineTo(0,18);c.closePath();c.fill();c.shadowColor='transparent';c.strokeStyle='#ffe28a';c.lineWidth=1.6;c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(-5,-8);c.lineTo(-1,-8);c.lineTo(-1,5);c.closePath();c.fill();c.restore();
   if(last&&(fixed||T>=TB)){const k=fixed?9:T-TB,pop=Math.min(1,k*3.5),p=last.prize,col=RCw[p.rar]||'#bdbdbd';c.save();c.translate(cx,cy);c.scale(pop,pop);
    c.shadowColor=col;c.shadowBlur=18;rr(c,-124,-52,248,104,14);const cg=c.createLinearGradient(0,-52,0,52);cg.addColorStop(0,'#241838');cg.addColorStop(1,'#0c0716');c.fillStyle=cg;c.fill();c.shadowColor='transparent';c.strokeStyle=col;c.lineWidth=2.6;c.stroke();rr(c,-120,-48,240,96,11);c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=1;c.stroke();
    c.fillStyle=col;rr(c,-52,-62,104,18,9);c.fill();c.fillStyle='#14100a';c.font='800 10px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(p.t==='x'?'SIN PREMIO':'¡PREMIO!',0,-53);
    const ig=c.createRadialGradient(-84,0,2,-84,0,34);ig.addColorStop(0,col+'66');ig.addColorStop(1,col+'00');c.fillStyle=ig;c.fillRect(-120,-38,72,76);
    if(img&&img.complete&&img.naturalWidth){c.drawImage(img,-110,-26,52,52)}else{c.save();c.translate(-84,0);c.scale(2,2);ico(c,p.t==='v'?(p.rar==='L'||p.rar==='R'?'v2':'v1'):p.cat.id);c.restore()}
    c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='#fff';c.font='800 14px system-ui';const lines=wrapT(c,p.txt,150);lines.forEach((l,i)=>c.fillText(l,-52,-10+i*17+(lines.length<2?6:0)));
    c.fillStyle=col;c.font='700 11px system-ui';c.fillText(p.t==='x'?'Vuelve en '+WCD+' días':({C:'Común',U:'Poco común',R:'Raro',E:'Épico',L:'Legendario'})[p.rar],-52,36);c.restore();
    if(!fixed&&p.t!=='x'){confetti(c,k-.05,big?60:30,120);flash(c,k,.3,.4)}}}}}
function wrapT(c,t,w){const ws=String(t).split(' '),L=[];let cur='';ws.forEach(x=>{const n=cur?cur+' '+x:x;if(c.measureText(n).width>w&&cur){L.push(cur);cur=x}else cur=n});if(cur)L.push(cur);return L.slice(0,2)}
/* ================= INTERFAZ ================= */
function cvHtml(){return `<canvas id="casCv" class="cas-cv" width="720" height="460"></canvas>`}
function scene(){return game==='slot'?slotScene(null):game==='rou'?rouScene(null):game==='wheel'?wheelScene(null):horseScene(lastRes.hor&&lastRes.hor.card===hcard?lastRes.hor:null)}
const rmFs=()=>{const e=document.getElementById('casFs');if(e)e.remove()};
function goBtn(){const v=st(),left=Math.max(0,MAXP-v.bets),ok=!anim&&v.f>=bet&&left>0;if(game==='wheel'){const d=wAvail();return `<button class="cas-go" ${!anim&&d===0?'':'disabled'} onclick="casinoPlay()">${d===0?'🎁 Girar gratis':'🎁 Disponible en '+d+(d>1?' días':' día')}</button>`}const t=game==='slot'?'🎰 Tirar de la palanca · '+bet:game==='rou'?'🎡 Girar · '+bet+(rpick.t==='num'?' al '+rnum:''):'🏇 Apostar '+bet+' a '+hcard[hpick].n;return `<button class="cas-go" ${ok?'':'disabled'} onclick="casinoPlay()">${t}</button>`}
function controls(){const d=anim?'disabled':'';let ctl='';if(game==='wheel')return `<div class="cas-leg"><b>Premios y probabilidad</b>${PRZ.map(c=>`<div><img src="${icoURL(c.id)}" style="background:${c.col}"><span>${c.n}</span><em>${c.w}%</em></div>`).join('')}<small>Gratis cada ${WCD} días. Los planos y armas raros son muy difíciles. Si ya tienes todos los planos, salen fichas.</small></div>`;
 if(game==='rou')ctl=`<div class="cas-bt">${Object.keys(RB).map(k=>`<button class="${rpick.t===k?'on':''}" ${d} onclick="casinoPick('${k}')">${RB[k][0]}</button>`).join('')}</div>`+(rpick.t==='num'?`<div class="cas-num">${Array.from({length:37},(_,n)=>`<button class="${rnum===n?'on':''} n${n===0?'g':REDS.has(n)?'r':'b'}" ${d} onclick="casinoNum(${n})">${n}</button>`).join('')}</div>`:'');
 else if(game==='hor')ctl=`<div class="cas-hs">${hcard.map((h,i)=>`<button class="${hpick===i?'on':''}" ${d} onclick="casinoHorse(${i})"><i style="background:${h.c}">${i+1}</i><b>${h.n}</b><small>×${h.o}</small></button>`).join('')}</div>`;
 else ctl='<p class="mu-mut" style="margin:4px 2px">Tira de la palanca: tres iguales pagan premio, dos cerezas y parejas devuelven algo.</p>';
 return `<div class="cas-bets">${BETS.map(b=>`<button class="${bet===b?'on':''}" ${d} onclick="casinoBet(${b})">🪙 ${b}</button>`).join('')}</div>`+ctl}
function msgHtml(){return msg||'<i>Raúl: «'+pick(window.villaNpc('raul').say[0])+'»</i>'}
function fitFs(cv,box){const r=box.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);let w=Math.min(r.width,r.height*W/H);if(!(w>40))w=Math.min(innerWidth,innerHeight*W/H)*.8;const h=w*H/W;cv.style.width=w+'px';cv.style.height=h+'px';const pw=Math.max(720,Math.round(w*dpr));cv.width=pw;cv.height=Math.round(pw*H/W)}
window.casinoView=function(){const v=st();if(!anim)settle();
 if(game==='hor'&&!hcard)newCard();
 const gt=(k,ic,t)=>`<button class="${game===k?'on':''}" ${anim?'disabled':''} onclick="casinoGame('${k}')"><span>${ic}</span>${t}</button>`;
 const tabs=`<div class="cas-tabs">${gt('slot','🎰','Tragaperras')}${gt('rou','🎡','Ruleta')}${gt('hor','🏇','Carreras')}${gt('wheel','🎁','Fortuna')}</div>`;
 show('Villa Esperanza · Casino','<p class="mu-mut" style="padding:14px">Casino abierto.</p>');
 rmFs();const f=document.createElement('div');f.id='casFs';
 f.innerHTML=`<div class="fs-top"><button class="cas-x" onclick="casinoExit()">← Salir</button>${tabs}<button class="cas-x cas-mu" onclick="casinoMute()" title="Sonido">${mute?'🔇':'🔊'}</button><span class="cas-f">🪙 ${Math.floor(v.f)}</span></div><div class="fs-body"><div class="fs-main"><div class="fs-cv"><canvas id="casCv" class="cas-cv"></canvas></div><div class="cas-msg" id="casMsg">${msgHtml()}</div></div><div class="fs-bar">${goBtn()}${controls()}<small class="mu-mut">Toca la pantalla durante la animación para saltarla.</small></div></div>`;
 document.body.appendChild(f);const cv=f.querySelector('#casCv');fitFs(cv,f.querySelector('.fs-cv'));
 still(cv,scene(),game==='hor'?(lastRes.hor&&lastRes.hor.card===hcard?99:0):game==='rou'?(lastRes.rou?99:0):(lastRes.slot?99:0))};
window.casinoExit=()=>{if(anim)return;hide()};
window.casinoMute=()=>{mute=!mute;try{localStorage.setItem('dt_cas_mute',mute?'1':'0')}catch(e){}const b=document.querySelector('#casFs .cas-mu');if(b)b.textContent=mute?'🔇':'🔊';if(!mute)tone(880,.1,'triangle',.05)};
const oHide=window.hide;window.hide=function(){rmFs();return oHide.apply(this,arguments)};
const oShow=window.show;window.show=function(t){if(!/Casino/.test(String(t)))rmFs();return oShow.apply(this,arguments)};
addEventListener('resize',()=>{const f=document.getElementById('casFs');if(f&&!anim)casinoView()});
window.casinoGame=k=>{game=k;msg='';if(k==='hor')hcard=null;casinoView()};
window.casinoBet=b=>{bet=b;casinoView()};
window.casinoPick=k=>{rpick.t=k;casinoView()};
window.casinoNum=n=>{rnum=n;casinoView()};
window.casinoHorse=i=>{hpick=i;casinoView()};
window.casinoPlay=function(){const v=st();if(game==='wheel'){if(anim||wAvail()>0)return;const prize=pickPrize(),res={prize};lastRes.wh=res;v.wd=S.day;v.wp=prize.t==='x'?null:prize;msg=prize.t==='x'?'Hoy no hay premio. Vuelve en '+WCD+' días.':'<b style="color:#8e8">¡Premio: '+prize.txt+'!</b>';anim=1;casinoView();const sc=wheelScene(res),cv=document.getElementById('casCv');const m=document.getElementById('casMsg');if(m)m.innerHTML='…';try{save()}catch(e){}run(cv,sc,sc.dur,()=>casinoView());return}
 if(anim||v.f<bet||v.bets>=MAXP)return;v.f-=bet;v.bets++;v.pend=0;let sc,dur,res,txt;
 if(game==='slot'){const r=[spinSym(),spinSym(),spinSym()],c={};r.forEach(s=>c[s]=(c[s]||0)+1);let w=0;if(c[r[0]]===3)w=bet*PAY[r[0]];else if(c['🍒']===2)w=Math.round(bet*1.5);else if(Object.values(c).includes(2))w=Math.round(bet*.5);w=Math.round(w);res={r,w,b:bet};lastRes.slot=res;sc=slotScene(res);txt=w>bet?`<b style="color:#8e8">¡Ganas ${w} fichas!</b>`:w>0?`Recuperas ${w}.`:'Nada esta vez.'}
 else if(game==='rou'){const n=ri_(0,36),o=RB[rpick.t],win=rpick.t==='num'?n===rnum:o[1](n),w=win?bet*o[2]:0;res={n,w};lastRes.rou=res;sc=rouScene(res);txt=`Sale el <b>${n}</b> ${n===0?'(verde)':REDS.has(n)?'(rojo)':'(negro)'}. `+(w?`<b style="color:#8e8">¡Ganas ${w} fichas!</b>`:'Pierdes.')}
 else{const ps=hcard.map(h=>1/h.o),tot=ps.reduce((a,b)=>a+b,0);let r=Math.random()*tot,win=0;for(let i=0;i<6;i++){if((r-=ps[i])<0){win=i;break}}const tw=TW,order=[0,1,2,3,4,5].filter(i=>i!==win).sort(()=>Math.random()-.5),fin=[];fin[win]=tw;order.forEach((i,k)=>fin[i]=tw+.18+k*.16+Math.random()*.12);const w=hpick===win?Math.round(bet*hcard[win].o):0;res={win,fin,w,card:hcard};lastRes.hor=res;sc=horseScene(res);txt=`Gana <b>${hcard[win].n}</b>. `+(w?`<b style="color:#8e8">¡Ganas ${w} fichas!</b>`:'Pierdes.')}
 v.pend=res.w;const goods=res.w>0;msg=txt;
 anim=1;casinoView();const cv=document.getElementById('casCv');
 const m=document.getElementById('casMsg');if(m)m.innerHTML='…';
 run(cv,sc,sc.dur,()=>{casinoView()});
};
const css=document.createElement('style');css.textContent=`.cas-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}.cas-ttl{flex:1;font-weight:800;color:#ffd877;letter-spacing:.5px;text-transform:uppercase;font-size:13px}.cas-x{padding:8px 12px;font-size:14px;font-weight:800;white-space:nowrap}.cas-f{background:#15201a;border:1px solid #3a4a30;border-radius:10px;padding:8px 10px;font-weight:800;color:#ffd877;white-space:nowrap}
.cas-main{display:flex;gap:12px;align-items:flex-start}.cas-l{flex:1;min-width:0}.cas-vis{flex:0 0 46%;position:sticky;top:0;display:flex;flex-direction:column;gap:6px}
.cas-cv{width:100%;aspect-ratio:${W}/${H};display:block;border-radius:12px;border:2px solid #e8b84a;background:#000}
.cas-cvw{position:relative;margin:0 auto;width:100%;max-width:calc((100dvh - 245px)*${W}/${H});min-width:200px}.cas-cvw .cas-cv{max-width:none;margin:0}.cas-fsb{position:absolute;right:6px;top:6px;width:30px;height:30px;padding:0;background:rgba(20,26,16,.8);border:1px solid #e8b84a;color:#ffd877;border-radius:8px;font-size:16px;font-weight:800}
.cas-tabs{display:flex;gap:6px;margin:0 0 8px}.cas-tabs button{flex:1;padding:5px 2px;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:0;line-height:1.1}.cas-tabs button span{font-size:17px}#casFs .cas-tabs button{flex-direction:row;gap:6px;font-size:12px;padding:7px 4px}.cas-tabs button.on{background:#e8b84a;color:#1a1408}
.cas-msg{min-height:20px;text-align:center;font-size:13px;line-height:1.3;margin-top:4px}
.cas-bets{display:flex;gap:6px;align-items:center;margin-bottom:8px}.cas-bets button{flex:1;padding:8px 2px}.cas-bets button.on{background:#e8b84a;color:#1a1408}.cas-bets small{color:#9fb0b6;white-space:nowrap;margin-left:2px;font-size:11px}
.cas-go{width:100%;padding:12px;font-size:14px;font-weight:800;background:linear-gradient(#e8b84a,#b8861c);color:#1a1408;border-radius:10px;margin-top:4px}.cas-go:disabled{opacity:.45}
.cas-bt{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-bottom:6px}.cas-bt button{padding:7px 2px;font-size:11px}.cas-bt button.on,.cas-num button.on,.cas-hs button.on{outline:2px solid #e8b84a;background:#3a3014}
.cas-num{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;margin:4px 0 8px}.cas-num button{padding:5px 0;font-size:10px;min-width:0}.cas-num .nr{background:#7a1f1c}.cas-num .nb{background:#1c1c20}.cas-num .ng{background:#17683b}
.cas-leg{font-size:12px;display:flex;flex-direction:column;gap:3px;margin-bottom:6px}.cas-leg b{color:#ffd877;margin-bottom:2px}.cas-leg div{display:flex;align-items:center;gap:6px}.cas-leg img{width:24px;height:24px;border-radius:7px;flex:none;border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 0 6px rgba(0,0,0,.5)}.cas-leg span{flex:1;min-width:0}.cas-leg em{font-style:normal;color:#ffd877;font-weight:700}.cas-leg small{color:#9fb0b6;margin-top:4px}.cas-hs{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-bottom:6px}.cas-hs button{display:flex;align-items:center;gap:5px;padding:6px 5px;min-width:0}.cas-hs b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cas-hs i{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:800;color:#fff;text-shadow:0 0 3px #000;flex:none;font-size:12px}.cas-hs b{flex:1;text-align:left;font-size:12px}.cas-hs small{color:#ffd877;font-weight:700;font-size:12px}
#casFs{position:fixed;inset:0;z-index:9000;background:radial-gradient(#1b2117,#050705);display:flex;flex-direction:column;gap:8px;padding:8px 10px;box-sizing:border-box}
#casFs .fs-top{display:flex;gap:8px;align-items:center}#casFs .fs-top .cas-tabs{flex:1;margin:0}
#casFs .fs-body{flex:1;min-height:0;display:flex;gap:12px}#casFs .fs-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
#casFs .fs-cv{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}#casFs .cas-cv{width:auto;max-width:100%;flex:none;margin:0}
#casFs .fs-bar{flex:0 0 250px;overflow:hidden auto;display:flex;flex-direction:column;gap:2px;padding-right:2px}
#casFs .cas-num{grid-template-columns:repeat(8,1fr)}
.cas-info{display:flex;align-items:center;gap:8px;margin-bottom:6px}.cas-info small{color:#9fb0b6}.cas-info .cas-f{padding:4px 10px}
@media (max-width:560px) and (orientation:portrait){.cas-main{flex-direction:column}.cas-vis{flex:none;width:100%;position:static}}`;document.head.appendChild(css);
})();
