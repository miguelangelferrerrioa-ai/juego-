/* ===== Aviso de las hordas: ya no se sabe siempre cuándo llegan =====
   La ficha 🧟 de arriba no dice nada hasta que aparece la primera señal. Señales (al azar en cada horda):
   - Gruñidos: se oyen gruñidos lejanos de vez en cuando.
   - Pájaros: bandadas de cuervos huyen del borde por donde vendrá la horda.
     (Una de estas dos sale siempre: entre 6 y 10 minutos antes; con torre de vigilancia o antena, 15 minutos antes).
   - Rezagados: unos minutos antes llegan 3-4 zombis sueltos. Si caen todos antes de la horda, la horda tarda 2,5 minutos más.
   - Polvo: unos minutos antes, una nube de polvo en el borde por donde entrará la horda.
   Con pájaros o polvo, el grueso de la horda entra por ese lado.
   Estado: S.hw={day,win,sig:{grunt,birds,strag,dust},side,al,known,sk,delay}, S.hwP (segundos de retraso pendientes). */
(function(){
'use strict';
const DAY=600;
const live=()=>{try{return S&&S.bld&&S.bld.length&&!S.over}catch(e){return false}};
const crea=()=>{try{return S.mode==='creativo'}catch(e){return false}};
const msg=(t,x,ic)=>{ic=ic||'🧟';try{toast(ic+' '+t+(x?': '+x:''))}catch(e){}try{notify(ic,t,x||'','alerta')}catch(e){}try{window.diarioAdd&&diarioAdd(ic,t+(x?'. '+x:''),'pueblo')}catch(e){}};
const look=()=>{try{return S.bld.some(b=>(b.type==='tower'||b.type==='mtower'||b.type==='radiolr')&&!b.cons)}catch(e){return false}};
const leftH=()=>{if(typeof S.nextH!=='number')return 1e9;return (S.nextH-S.day-1)*DAY+(DAY-(S.dayT||0))};
const edgePt=(w,out)=>{const i=out?-1.5:1.2,o=out?N+1.5:N-1.2;return w.side===0?[w.al,i]:w.side===1?[o,w.al]:w.side===2?[w.al,o]:[i,w.al]};
const dirName=w=>{try{const c=P(N/2,N/2),e=edgePt(w,1),q=P(e[0],e[1]),a=Math.atan2(q[1]-c[1],q[0]-c[0])*180/Math.PI;return a>-135&&a<=-45?'el norte':a>-45&&a<=45?'el este':a>45&&a<=135?'el sur':'el oeste'}catch(e){return'el horizonte'}};
const rnd=(a,b)=>a+Math.random()*(b-a);
/* plan de señales para la próxima horda */
function plan(){if(typeof S.nextH!=='number')return null;if(S.hw&&S.hw.day===S.nextH)return S.hw;
 const w=S.hw={day:S.nextH,win:look()?900:rnd(360,600),sig:{},known:0,sk:0,delay:0,side:Math.floor(Math.random()*4),al:8+Math.random()*(N-16)};
 const e=Math.random()<.5?'grunt':'birds';w.sig[e]=w.win;if(Math.random()<.5)w.sig.strag=rnd(150,240);if(Math.random()<.5)w.sig.dust=rnd(100,220);
 try{if(window.spawnSafe){const p0=edgePt(w,0),p=spawnSafe(p0[0],p0[1]);if(p){if(p.y<2){w.side=0;w.al=p.x}else if(p.x>N-2){w.side=1;w.al=p.y}else if(p.y>N-2){w.side=2;w.al=p.x}else{w.side=3;w.al=p.y}}}}catch(e){}
 w.on={};return w}
const known=()=>{if(crea())return true;try{if(S.hwP>0)return true;const w=S.hw;return !!(w&&w.day===S.nextH&&w.known)}catch(e){return false}};
window.hwKnown=known;
window.hwLeft=()=>S.hwP>0?S.hwP:leftH();
const fmt=t=>{t=Math.max(0,Math.ceil(t));const d=Math.floor(t/DAY),r=t%DAY;return(d?d+'d ':'')+Math.floor(r/60)+':'+String(r%60).padStart(2,'0')};
window.hwLeftTxt=()=>fmt(window.hwLeft());
function fire(w,k){w.on[k]=1;const first=!w.known;w.known=1;const vg=look()&&first?' Los vigías lo han visto venir con tiempo.':'';
 if(k==='grunt')msg('Gruñidos a lo lejos','Se oyen gruñidos fuera del pueblo: se acerca una horda.'+vg);
 else if(k==='birds')msg('Los pájaros huyen','Bandadas de cuervos levantan el vuelo hacia '+dirName(w)+': una horda viene por ese lado.'+vg);
 else if(k==='dust')msg('Polvo en el horizonte','Una nube de polvo avanza desde '+dirName(w)+': la horda está muy cerca.');
 else if(k==='strag'){spawnStrag(w);msg('Rezagados','Unos zombis se adelantan a la horda. Si caen todos antes de que llegue, la horda tardará más.')}}
/* rezagados */
function spawnStrag(w){const e=edgePt(w,1),n=3+(Math.random()<.5?1:0);w.sk=n;for(let i=0;i<n;i++){const z=mkZ('z',e[0]+(w.side%2?0:(i-1.5)*1.1),e[1]+(w.side%2?(i-1.5)*1.1:0),1);z._sp=1;z._out=1;z.act=1;z.strag=1;Z.push(z)}}
/* la horda llega con retraso si cayeron todos los rezagados; el grueso entra por el lado de las señales */
const oSH=window.startHorde;
window.startHorde=function(name,over){
 if(!name&&!over&&!(S.hwP>0)){const w=S.hw;if(w&&w.delay>0&&!crea()){S.hwP=w.delay;w.delay=0;try{msg('La horda se retrasa','Abatisteis a los rezagados: la horda llegará en '+fmt(S.hwP)+'.')}catch(e){}return}}
 const n0=Z.length,r=oSH.apply(this,arguments);
 try{const w=S.hw;if(!name&&!over&&w&&(w.on.birds||w.on.dust)){const nz=Z.slice(n0).filter(z=>z.act&&!z.band);nz.forEach((z,i)=>{if(i%10>=7)return;const a=Math.max(.8,Math.min(N-.8,w.al+((i*7)%21-10)*.9)),d=.6+(i%3)*.6;
   if(w.side===0){z.x=a;z.y=d}else if(w.side===1){z.x=N-d;z.y=a}else if(w.side===2){z.x=a;z.y=N-d}else{z.x=d;z.y=a}})}}catch(e){}return r};
try{startHorde=window.startHorde}catch(e){}
/* tiempo */
let acc=0,gT=8;
const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{if(!live())return r;
  if(S.hwP>0&&!horde){S.hwP-=dt;if(S.hwP<=0){S.hwP=0;startHorde()}}
  acc+=dt;if(acc<.5)return r;const k=acc;acc=0;if(horde||crea())return r;
  const w=plan();if(!w)return r;const L=leftH();
  for(const s in w.sig)if(!w.on[s]&&L<=w.sig[s]&&L>0)fire(w,s);
  /* rezagados abatidos */
  if(w.on.strag&&w.sk>0&&!w.skDone){const al=Z.filter(z=>z.strag&&z.hp>0&&z.act).length;if(!al){w.skDone=1;w.delay=150;msg('Rezagados abatidos','La horda tardará 2 minutos y medio más en llegar.')}}
  /* gruñidos */
  if(w.on.grunt&&L>0){gT-=k;if(gT<=0){gT=rnd(14,30)*(L<200?.5:1);growl(.35+.65*(1-Math.min(1,L/w.win)))}}
 }catch(e){}return r};
try{upd=window.upd}catch(e){}
/* gruñido sintetizado */
function growl(v){try{if(typeof SND!=='undefined'&&!SND)return;const a=audioContext(),t=a.currentTime,vol=(typeof sfxVol==='number'?sfxVol:.6)*v;
 const o=a.createOscillator(),l=a.createOscillator(),lg=a.createGain(),f=a.createBiquadFilter(),g=a.createGain();o.type='sawtooth';const f0=rnd(62,90);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*.8,t+1.4);
 l.frequency.value=rnd(7,13);lg.gain.value=f0*.18;l.connect(lg);lg.connect(o.frequency);f.type='lowpass';f.frequency.value=380;f.Q.value=4;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.16*vol),t+.3);g.gain.exponentialRampToValueAtTime(.0001,t+1.5);o.connect(f);f.connect(g);g.connect(a.destination);o.start(t);l.start(t);o.stop(t+1.6);l.stop(t+1.6);
 if(Math.random()<.6)setTimeout(()=>{try{growl(v*.6)}catch(e){}},rnd(500,1400))}catch(e){}}
window.__hwGrowl=growl;
/* dibujo: pájaros y polvo */
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{if(!live()||horde)return r;const w=S.hw;if(!w||w.day!==S.nextH||!(w.on&&(w.on.birds||w.on.dust)))return r;
  const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);const e=edgePt(w,1),b=P(e[0],e[1]),t=T;
  if(w.on.dust){for(let i=0;i<30;i++){const u=((t*.05+i/30)%1),s=(i%10-4.5)*1.3,q=P(e[0]+(w.side%2?0:s),e[1]+(w.side%2?s:0)),rr=14+u*40,a=Math.sin(u*Math.PI)*.32;
    c.fillStyle=`rgba(168,140,100,${a})`;c.beginPath();c.ellipse(q[0]+Math.sin(i*2.3+t*.4)*10,q[1]-8-u*55,rr*1.4,rr*.7,0,0,7);c.fill()}}
  if(w.on.birds){const out=w.side===0?[0,-1]:w.side===1?[1,0]:w.side===2?[0,1]:[-1,0];
   for(let i=0;i<16;i++){const u=((t*.12+i*.061)%1),q=P(e[0]+out[0]*u*10+(w.side%2?0:(i%5-2)*1.2),e[1]+out[1]*u*10+(w.side%2?(i%5-2)*1.2:0)),x=q[0]+Math.sin(i*1.7)*14,y=q[1]-10-u*170-(i%4)*9,fl=Math.sin(t*16+i*1.9)*3.5,s=3.5+(i%3);
    c.strokeStyle=`rgba(20,18,22,${.9*(1-u*.6)})`;c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(x-s,y-fl);c.quadraticCurveTo(x-s*.4,y-1,x,y+1);c.quadraticCurveTo(x+s*.4,y-1,x+s,y-fl);c.stroke()}}
  c.restore()}catch(e){}return r};try{render=window.render}catch(e){}}
window.hwLook=function(){const w=S.hw;if(!w)return;try{closeP&&closeP()}catch(e){}try{const e=edgePt(w,1),q=P(e[0],e[1]);cam.x=q[0]-innerWidth/2/cam.z;cam.y=q[1]-innerHeight/2/cam.z-50}catch(e){}};
window.hwInfo=()=>{const w=S.hw;if(!w||w.day!==S.nextH||!w.known)return'';const L=[];if(w.on.grunt)L.push('🔊 Se oyen gruñidos a lo lejos.');if(w.on.birds)L.push('🐦 Los pájaros huyen desde '+dirName(w)+': el grueso de la horda entrará por ahí.');
 if(w.on.dust)L.push('🌫 Hay polvo en el horizonte hacia '+dirName(w)+'.');if(w.on.strag)L.push(w.skDone?'✔ Abatisteis a los rezagados: la horda llegará más tarde.':'🧟 Han llegado rezagados: si caen todos antes de la horda, se retrasará.');
 return L.map(x=>'<p>'+x+'</p>').join('')+((w.on.birds||w.on.dust)?'<button class="btn" onclick="hwLook()">📍 Ver por dónde vienen</button>':'')};
/* guía */
try{const i=GD.findIndex(g=>g[0]==='Zombis y defensa');if(i>=0){const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}return h+'<p><b>🧟 Cuándo llega una horda:</b> no se sabe de antemano. Unos minutos antes aparecen señales: gruñidos lejanos o pájaros que huyen del borde por donde vendrá; a veces también <b>rezagados</b> (si los abates a todos, la horda tarda más) o polvo en el horizonte. Con una torre de vigilancia o una antena de largo alcance te enteras antes. Desde la primera señal, la ficha 🧟 de arriba muestra la cuenta atrás.</p>'}}}catch(e){}
window.__hw={plan,leftH,fire,known};
})();
