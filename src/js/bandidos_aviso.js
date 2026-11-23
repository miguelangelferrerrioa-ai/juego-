/* ===== Aviso de los asaltos de bandidos =====
   Dos días antes del asalto se anuncia (al azar) con una de estas señales, o con las dos:
   - Humo: una columna de humo del color de la banda y sus banderas en el borde del mapa por donde van a entrar.
   - Exploradores: el día antes llegan 2 bandidos a vigilar el pueblo, se quedan un rato y se van.
     Si mueren los dos, el asalto llega con un 40 % menos de gente; si muere uno, con un 20 % menos.
   Mientras tanto, una ficha 🏴 arriba con la cuenta atrás (al tocarla, detalle). En los últimos 2 minutos suenan
   tambores lejanos y un cuerno, cada vez más fuertes y seguidos.
   Además: entre un asalto de bandidos y una horda de zombis hay como mínimo 2 días.
   Estado: S.bw={day,sig:'humo'|'expl'|'ambos',side,al,scT,scS,scK,scE,id}. */
(function(){
'use strict';
if(typeof BANDS==='undefined')return;
const DAY=600;
const bn=()=>S.bn;
const nm=id=>(BANDS[id]&&BANDS[id].n)||'Bandidos';
const live=()=>{try{return S&&S.bld&&S.bld.length&&!S.over&&S.mode!=='creativo'}catch(e){return false}};
const msg=(t,x)=>{try{toast('🏴 '+t)}catch(e){}try{notify('🏴',t,x||'','alerta')}catch(e){}try{window.diarioAdd&&diarioAdd('🏴',t+(x?'. '+x:''),'pueblo')}catch(e){}};
/* punto del borde por el que vendrán */
const edgePt=(w,out)=>{const i=out?-1.5:1.2,o=out?N+1.5:N-1.2;return w.side===0?[w.al,i]:w.side===1?[o,w.al]:w.side===2?[w.al,o]:[i,w.al]};
const dirName=w=>{try{const c=P(N/2,N/2),e=edgePt(w,1),q=P(e[0],e[1]),a=Math.atan2(q[1]-c[1],q[0]-c[0])*180/Math.PI;return a>-135&&a<=-45?'el norte':a>-45&&a<=45?'el este':a>45&&a<=135?'el sur':'el oeste'}catch(e){return'el horizonte'}};
/* segundos que faltan para el asalto (empieza al amanecer del día S.bn.next) */
const left=()=>{const s=bn();if(!s||!s.next)return 1e9;return (s.next-S.day-1)*DAY+(DAY-(S.dayT||0))};
const W=()=>{const w=S.bw;const s=bn();return w&&s&&w.day===s.next&&!horde?w:null};
/* ---- anuncio ---- */
function announce(){const s=bn();if(!s||!s.band||!BANDS[s.band])return;const w=S.bw={day:s.next,id:s.band,side:Math.floor(Math.random()*4),al:8+Math.random()*(N-16),scK:0,scE:0,scS:0};
 /* el lado anunciado tiene que ser uno por el que puedan entrar (fuera de tu territorio y lejos de lo construido) */
 try{if(window.spawnSafe){const e=edgePt(w,0),p=spawnSafe(e[0],e[1]);if(p){if(p.y<2){w.side=0;w.al=p.x}else if(p.x>N-2){w.side=1;w.al=p.y}else if(p.y>N-2){w.side=2;w.al=p.x}else{w.side=3;w.al=p.y}}}}catch(e){}
 const r=Math.random();w.sig=r<.45?'humo':r<.85?'expl':'ambos';w.scT=120+Math.random()*260;
 if(w.sig!=='expl')msg('Humo en el horizonte','Se ve una columna de humo hacia '+dirName(w)+' y banderas de '+nm(w.id)+'. Atacarán en 2 días por ese lado.');
 else msg('Movimiento en los caminos','Los vigías ven huellas de '+nm(w.id)+'. Atacarán en 2 días; mañana vendrán a espiar.')}
/* ---- separación con las hordas: al menos 2 días ---- */
function sep(){const s=bn();if(!s||!s.next||typeof S.nextH!=='number')return;const w=S.bw&&S.bw.day===s.next?S.bw:null;
 if(Math.abs(S.nextH-s.next)>=2)return;
 if(w){if(!horde||S.nextH>S.day)S.nextH=s.next+2}else{s.next=S.nextH+2}}
window.bandSep=sep;
/* asalto por sorpresa de los bandidos hostiles (game.js): ahora se programa y se avisa como los demás */
window.bandSoon=function(){try{const s=bn();if(!s||S.day<4)return false;if(s.next>S.day+2){s.next=S.day+2;sep();return true}}catch(e){}return false};
const oND=window.nextDay;
window.nextDay=function(){const r=oND.apply(this,arguments);try{if(!live()||!bn())return r;sep();const s=bn();
  if(S.bw&&S.bw.day!==s.next&&S.bw.day<S.day)S.bw=null;
  if(!horde&&s.band&&s.next-S.day<=2&&s.next>S.day&&!(S.bw&&S.bw.day===s.next))announce();
  if(S.bw&&S.bw.day===s.next&&BANDS[S.bw.id])s.band=S.bw.id;
  const w=W();if(w&&s.next-S.day===1&&w.sig!=='humo'&&!w.scS)msg('Exploradores a la vista','Hoy vendrán exploradores de '+nm(w.id)+' a espiar el pueblo. Si caen, el asalto será más flojo.')}catch(e){console.error('bandidos_aviso',e)}return r};
try{nextDay=window.nextDay}catch(e){}
/* el asalto entra por el lado anunciado y se aplica lo que pasó con los exploradores */
const oBR=window.bandRaid;
window.bandRaid=function(id){const w=S.bw&&S.bw.day<=S.day?S.bw:null,s=bn();if(w&&BANDS[w.id])id=w.id;
 if(w&&s){if(w.scK>=2)s.weak[id]=S.day;s.wk1=w.scK===1?S.day:0}
 const r=oBR.call(this,id);
 try{if(w){const pts=Z.filter(z=>z.act&&z.band===id&&!z._sp);pts.forEach((z,i)=>{const a=Math.max(.8,Math.min(N-.8,w.al+(i%7-3)*1.1)),d=.6+(i%3)*.6;
   if(w.side===0){z.x=a;z.y=d}else if(w.side===1){z.x=N-d;z.y=a}else if(w.side===2){z.x=a;z.y=N-d}else{z.x=d;z.y=a}});S.bw=null}}catch(e){}return r};
try{bandRaid=window.bandRaid}catch(e){}
/* ---- exploradores ---- */
const isSc=z=>z&&z.scout;
function spawnScouts(w){const e=edgePt(w,1);w.scS=1;for(let i=0;i<2;i++){const z=mkZ('b',e[0]+(w.side%2?0:i*1.2-.6),e[1]+(w.side%2?i*1.2-.6:0),1);
  z._sp=1;z._out=1;z.act=1;z.band=w.id;z.scout=1;z.scSt='in';z.scW=0;z.hp=z.mhp=Math.round(z.mhp*1.3);z._sc0=[e[0],e[1]];Z.push(z)}
 const t=target(w);Z.forEach(z=>{if(isSc(z)&&!z.scTg)z.scTg=[t[0]+(Math.random()-.5)*2,t[1]+(Math.random()-.5)*2]})}
/* se acercan por la línea del borde al centro y se paran a unas 5 casillas del primer edificio */
function target(w){const e=edgePt(w,0),h=S.bld.find(b=>b.type==='hall')||{x:N/2,y:N/2,w:1,h:1},cx=h.x+h.w/2,cy=h.y+h.h/2;let best=[e[0],e[1]];
 for(let k=0;k<=60;k++){const t=k/60,x=e[0]+(cx-e[0])*t,y=e[1]+(cy-e[1])*t;let m=1e9;for(const b of S.bld){if(b.type==='road'||b.type==='bridge')continue;const dx=Math.max(b.x-x,0,x-(b.x+b.w)),dy=Math.max(b.y-y,0,y-(b.y+b.h));m=Math.min(m,Math.hypot(dx,dy))}if(m<6)break;best=[x,y]}return best}
const oZ=window.zUpd;
window.zUpd=function(z,dt){if(isSc(z)&&z.hp>0){const sp=1.05*dt;let tg=z.scSt==='out'?z._sc0:z.scTg;
  if(z.scSt==='watch'){z.scW+=dt;z.at=0;if(Math.random()<dt*.6){z.dx=Math.random()<.5?-1:1}if(z.scW>35){z.scSt='out'}return}
  const dx=tg[0]-z.x,dy=tg[1]-z.y,d=Math.hypot(dx,dy);if(d<.3){if(z.scSt==='in'){z.scSt='watch';return}z.scEsc=1;return}
  z.x+=dx/d*Math.min(sp*(z.scSt==='out'?1.5:1),d);z.y+=dy/d*Math.min(sp*(z.scSt==='out'?1.5:1),d);z.dx=dx;z.at=0;z.mv=1;return}
 return oZ.apply(this,arguments)};
try{zUpd=window.zUpd}catch(e){}
/* ---- tiempo: exploradores, separación, tambores ---- */
let acc=0,beat=0,horn={};const SC=new Set();
const oU=window.upd;window.upd=function(dt){
 /* los que escapan no cuentan como abatidos */
 try{if(Z.some(z=>z.scout&&z.scEsc)){for(const z of Z){if(z.scout&&z.scEsc&&!z._scDone){z._scDone=1;const w=S.bw;if(w){w.scE++;if(w.scE+w.scK>=2)scoutsEnd(w)}}}Z=Z.filter(z=>!(z.scout&&z.scEsc))}}catch(e){}
 const r=oU.apply(this,arguments);
 try{if(!live())return r;
  for(const z of Z)if(z.scout&&!z.scEsc&&!z._scDone)SC.add(z);
  for(const z of SC){if(z._scDone||z.scEsc){SC.delete(z);continue}if(z.hp<=0||!Z.includes(z)){z._scDone=1;SC.delete(z);const w=S.bw;if(w){w.scK++;if(w.scE+w.scK>=2)scoutsEnd(w)}}}
  acc+=dt;if(acc<.5)return r;const k=acc;acc=0;sep();
  const w=W();if(!w)return r;const s=bn();
  if(w.sig!=='humo'&&!w.scS&&s.next-S.day===1&&(S.dayT||0)>=w.scT)spawnScouts(w);
  drums(left(),k)}catch(e){}return r};
try{upd=window.upd}catch(e){}
function scoutsEnd(w){if(w._end)return;w._end=1;
 if(w.scK>=2)msg('Exploradores abatidos','Los dos exploradores de '+nm(w.id)+' han caído: el asalto llegará con mucha menos gente.');
 else if(w.scK===1)msg('Un explorador ha escapado','Uno ha caído y el otro ha vuelto con información: el asalto será algo más flojo.');
 else msg('Los exploradores han escapado',nm(w.id)+' ya sabe cómo es el pueblo: vendrán con todos.')}
/* ---- sonido: tambores y cuerno sintetizados ---- */
function ac(){try{return(typeof SND==='undefined'||SND)&&typeof audioContext==='function'?audioContext():null}catch(e){return null}}
function vol(){try{return typeof sfxVol==='number'?sfxVol:.6}catch(e){return .6}}
function drum(v){const a=ac();if(!a)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(42,t+.25);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.5*v*vol()),t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.45);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.5);
 const n=a.createBuffer(1,a.sampleRate*.12,a.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const b=a.createBufferSource(),f=a.createBiquadFilter(),g2=a.createGain();
 b.buffer=n;f.type='lowpass';f.frequency.value=420;g2.gain.value=.18*v*vol();b.connect(f);f.connect(g2);g2.connect(a.destination);b.start(t)}
function hornS(v){const a=ac();if(!a)return;const t=a.currentTime,f=a.createBiquadFilter(),g=a.createGain();f.type='lowpass';f.frequency.setValueAtTime(300,t);f.frequency.linearRampToValueAtTime(900,t+.5);f.frequency.linearRampToValueAtTime(500,t+2.2);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.22*v*vol()),t+.35);g.gain.setValueAtTime(.22*v*vol(),t+1.7);g.gain.exponentialRampToValueAtTime(.0001,t+2.6);f.connect(g);g.connect(a.destination);
 [110,110.8,165].forEach((fr,i)=>{const o=a.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(fr*.94,t);o.frequency.linearRampToValueAtTime(fr,t+.4);const gg=a.createGain();gg.gain.value=i===2?.35:.6;o.connect(gg);gg.connect(f);o.start(t);o.stop(t+2.7)})}
function drums(tl,k){if(tl>120||tl<=0)return;const v=.25+.75*(1-tl/120);beat-=k;
 if(beat<=0){const gap=tl>60?1.6:tl>25?1:.6;beat=gap;drum(v);setTimeout(()=>{try{drum(v*.7)}catch(e){}},gap*330)}
 [[115,'a'],[60,'b'],[20,'c']].forEach(([at,id])=>{const key=S.bw.day+id;if(tl<=at&&!horn[key]){horn[key]=1;hornS(v)}})}
window.__bwSound={drum,hornS};
/* ---- ficha de arriba ---- */
const fmt=t=>{t=Math.max(0,Math.ceil(t));const d=Math.floor(t/DAY),r=t%DAY;return(d?d+'d ':'')+Math.floor(r/60)+':'+String(r%60).padStart(2,'0')};
function chip(){const top=document.getElementById('top');if(!top)return;let c=document.getElementById('bwChip');const w=live()&&W();
 if(!w){if(c)c.style.display='none';return}
 if(!c){c=document.createElement('button');c.id='bwChip';c.className='ch';c.onclick=e=>{e.stopPropagation();bwDetail()}}
 const hz=document.getElementById('hzChip');if(c.parentNode!==top){if(hz&&hz.parentNode===top)top.insertBefore(c,hz);else top.appendChild(c)}
 const B=BANDS[w.id],tl=left();c.style.display='';c.style.cssText+=';border:1px solid '+B.flag+';background:linear-gradient(180deg,'+B.col+'cc,#120a08);color:'+(B.acc||'#fff')+';font-weight:800;font-size:11px;white-space:nowrap;cursor:pointer;pointer-events:auto';
 c.innerHTML='🏴 '+fmt(tl);c.title='Asalto de '+B.n+' en '+fmt(tl);c.classList.toggle('bwHot',tl<120)}
setInterval(()=>{try{chip()}catch(e){}},500);
const st=document.createElement('style');st.textContent='#bwChip.bwHot{animation:bwP .8s ease-in-out infinite}@keyframes bwP{0%,100%{box-shadow:0 0 0 0 rgba(255,80,40,0)}50%{box-shadow:0 0 12px 3px rgba(255,80,40,.7)}}';document.head.appendChild(st);
window.bwLook=function(){const w=S.bw;if(!w)return;try{closeP&&closeP()}catch(e){}try{const e=edgePt(w,1),q=P(e[0],e[1]);cam.x=q[0]-innerWidth/2/cam.z;cam.y=q[1]-innerHeight/2/cam.z-60}catch(e){}};
window.bwDetail=function(){const w=W();if(!w)return;const B=BANDS[w.id],tl=left();
 const sc=w.sig==='humo'?'':(!w.scS?'Mañana vendrán 2 exploradores a espiar. Si caen los dos, el asalto llega con un 40 % menos de gente.':(w.scK+w.scE<2?'Los exploradores están rondando el pueblo: ¡abátelos antes de que se vayan!':(w.scK>=2?'✔ Abatiste a los dos exploradores: vendrán muchos menos.':w.scK===1?'Abatiste a uno: vendrán algunos menos.':'Los exploradores escaparon: vendrán con todos.')));
 show('Asalto de '+B.n,`<div style="display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;border:1px solid ${B.flag};background:linear-gradient(135deg,${B.col}55,#120a08)"><div style="font-size:30px">🏴</div><div><b style="display:block;font-size:16px;color:${B.acc}">${B.n}</b><small>${B.tag}</small></div><b style="margin-left:auto;font-size:18px">${fmt(tl)}</b></div>`+
  (w.sig!=='expl'?`<p>🔥 Su humo se ve hacia <b>${dirName(w)}</b>: entrarán por ese lado. Refuerza ese borde.</p><button class="btn" onclick="bwLook()">📍 Ver el humo</button>`:'<p>No se sabe por dónde entrarán.</p>')+(sc?'<p>'+sc+'</p>':'')+'<p><small>Atacan para destruir edificios. Derriba al portaestandarte para conseguir metal.</small></p>')};
/* ---- dibujo: humo y banderas en el borde ---- */
const oR=window.render;if(typeof oR==='function'){window.render=function(){const r=oR.apply(this,arguments);try{const w=live()&&W();if(!w||w.sig==='expl')return r;const B=BANDS[w.id];
  const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  const e=edgePt(w,1),b=P(e[0],e[1]),t=T;
  /* hoguera */
  const gl=c.createRadialGradient(b[0],b[1],0,b[0],b[1],40);gl.addColorStop(0,'rgba(255,170,60,.55)');gl.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=gl;c.beginPath();c.ellipse(b[0],b[1],40,20,0,0,7);c.fill();
  for(let i=0;i<5;i++){const ph=t*7+i*1.7,fx=b[0]+(i-2)*4,fh=10+Math.sin(ph)*3;c.fillStyle=i%2?'rgba(255,200,80,.9)':'rgba(255,110,30,.85)';c.beginPath();c.ellipse(fx,b[1]-fh*.5,3.2,fh*.6,0,0,7);c.fill()}
  /* columna de humo, teñida del color de la banda */
  const col=B.col.replace('#',''),R=parseInt(col.slice(0,2),16),G=parseInt(col.slice(2,4),16),Bl=parseInt(col.slice(4,6),16),mix=(a,m)=>Math.round(a*.35+m*.65);
  for(let i=0;i<26;i++){const u=((t*.09+i/26)%1),y=b[1]-8-u*260,x=b[0]+Math.sin(u*5+i)*6+u*u*60,rr=8+u*34,a=(1-u)*.55*Math.min(1,u*8);
   c.fillStyle=`rgba(${mix(R,70)},${mix(G,66)},${mix(Bl,62)},${a})`;c.beginPath();c.arc(x,y,rr,0,7);c.fill()}
  /* banderas */
  [[-26,6],[22,4],[-6,16]].forEach(([dx,dy],i)=>{const px=b[0]+dx,py=b[1]+dy;c.strokeStyle='#3a2a1a';c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(px,py-34);c.stroke();
   const wv=Math.sin(t*4+i)*2;c.fillStyle=B.flag;c.strokeStyle='rgba(0,0,0,.6)';c.lineWidth=1;c.beginPath();c.moveTo(px,py-34);c.quadraticCurveTo(px+9,py-36+wv,px+18,py-32+wv);c.lineTo(px+18,py-22+wv);c.quadraticCurveTo(px+9,py-26+wv,px,py-24);c.closePath();c.fill();c.stroke();
   c.fillStyle=B.em||'#fff';c.beginPath();c.arc(px+9,py-28+wv*.6,2.6,0,7);c.fill()});
  c.restore()}catch(e){}return r};try{render=window.render}catch(e){}}
/* ---- guía ---- */
try{const i=GD.findIndex(g=>g[0]==='Bandas humanas');if(i>=0){const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}return h+'<p><b>🏴 Avisos:</b> dos días antes de un asalto se ve venir: a veces <b>humo y banderas</b> en el borde por donde entrarán, a veces <b>exploradores</b> que vienen a espiar el día antes (si los abates, el asalto llega más flojo), o las dos cosas. Arriba sale una ficha 🏴 con la cuenta atrás y, en los últimos minutos, se oyen tambores y un cuerno. Entre un asalto y una horda siempre hay al menos 2 días.</p>'}}}catch(e){}
window.__bw={announce,left,W,sep,spawnScouts,target};
})();
