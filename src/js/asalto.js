/* ===== Dead Town · Asalto final al bastión de Cuervos y Víboras (tu ejército ataca su base) ===== */
(function(){
const NEED=2000,ES=Math.pow(NEED/300,.5),W=960,H=480,WX=470,GY=H/2,KEEP=830;
const A=()=>S.arc||(S.arc={s:{},ann:{}});
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GUN=/pistola|rifle|escopeta|franco|revólver|subfusil|fusil|arco|ballesta/i;
let plan='frontal',ST=null;
const PLANS={frontal:{n:'Asalto frontal',d:'Cargáis contra la puerta con todo. Tus tropas pegan más fuerte, pero habrá más bajas.',ad:1.2,ed:1.15,ex:2,gate:1},
 flanco:{n:'Ataque por el flanco',d:'Parte de los defensores abandona la puerta para cubrir el flanco. Menos bajas al inicio.',ad:1,ed:1,ex:2,gate:.6,en:.8},
 explosivos:{n:'Cargas explosivas',d:'Lleváis más explosivos para abrir muros y rematar a los cabecillas. Algo más lento.',ad:.95,ed:1,ex:5,gate:1}};
function crew(){const ppl=S.ppl.filter(p=>!p.away&&!p.preg&&p.age>=18&&p.hp>40&&!p.pres);const sol=ppl.filter(p=>p.arm).sort((a,b)=>upow(b)-upow(a)),civ=ppl.filter(p=>!p.arm);return{sol,civ,list:sol.concat(civ).slice(0,40)}}
const power=()=>{try{return armyPow()}catch(e){return 0}};
function briefing(){const pw=power(),ok=pw>=NEED,c=crew(),pct=Math.min(100,pw/NEED*100);
 const pl=Object.keys(PLANS).map(k=>`<button class="${plan===k?'pri':''}" onclick="asaltoPlan('${k}')">${PLANS[k].n}</button>`).join(' ');
 show('Asalto final · El bastión',`<p><i>«Cuervos y Víboras tienen cada uno un pueblo fortificado, con muros elite, torres y cientos de armas robadas. Atacaremos primero el Nido Negro y después el Nido de Víboras. Si vamos, tiene que ser con todo lo que tengamos. No voy a mandar a mi gente a una masacre.»</i> — Presidenta Valeria</p>
 <div class="mu-sts"><div class="mu-st"><b>${pw}</b><small>Tu poder</small></div><div class="mu-st"><b>${NEED}</b><small>Poder necesario</small></div><div class="mu-st"><b>${c.sol.length}</b><small>Soldados</small></div><div class="mu-st"><b>${Math.min(c.civ.length,Math.max(0,40-c.sol.length))}</b><small>Ciudadanos</small></div></div>
 <div style="height:8px;background:#232b2f;border-radius:4px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${pct}%;background:${ok?'#6fb04e':'#c9a24a'}"></div></div>
 <p>${ok?'Valeria asiente: «Estamos listos. Que cada uno sepa por qué lucha».':'Tu ejército aún no es suficiente. Faltan <b>'+(NEED-pw)+'</b> puntos de poder: recluta y equipa más soldados, mejora armas y torres. Valeria no dará la orden hasta que haya posibilidades reales.'}</p>
 <p><b>Plan de ataque</b></p><p>${pl}</p><p><small>${PLANS[plan].d}</small></p>
 <p><small>Participan tus soldados, los ciudadanos sanos que puedan combatir y la Guardia del Alba con la presidenta. Atacaréis dos pueblos seguidos. Los caídos pueden morir o quedar heridos. Durante la batalla puedes mover y ampliar la vista, lanzar explosivos sobre muros, puertas o enemigos, pedir fuego de cobertura y usar botiquines tocando en el campo.</small></p>
 <button class="pri" ${ok?'':'disabled'} onclick="asaltoGo()">Lanzar el asalto</button>`)}
window.asaltoMenu=()=>{if(!A().fall||A().won)return toast('No hay ningún asalto pendiente.');if((A().s.guerra||0)<4)return toast('Completa antes las misiones de La guerra del Alba.');briefing()};
window.asaltoPlan=k=>{plan=k;briefing()};
/* ---------- unidades ---------- */
function mkAlly(p,g){const gun=p.wp&&GUN.test(p.wp.n||'');const sol=!!p.arm;const m=PLANS[plan].ad*1.25,pf=Math.max(.6,(typeof upow==='function'?upow(p):49)/49);
 return{t:'a',p,x:rnd(60,170),y:rnd(110,H-110),hp:0,mhp:0,dmg:((p.wp?p.wp.v*1.15:2.2)+(sol?3+p.lvl*.6:0)+p.sk*.3)*m*Math.pow(pf,.45),pf,rng:gun?135:14,rate:gun?1.3:1,cd:rnd(0,1),sp:gun?29:36,gun,sol,r:6,col:sol?'#3f6a8f':'#8a7a5a',hpF:0}}
function build(){const c=crew(),U=[];c.list.forEach(p=>{const u=mkAlly(p);u.mhp=u.hp=Math.pow(u.pf,.5)*((sol=>sol?135:70)(u.sol)+p.hp*.3+(p.lvl||1)*4)*1.2;U.push(u)});
 const nG=8,gd=[];for(let i=0;i<nG;i++)gd.push({t:'a',gd:1,x:rnd(30,120),y:rnd(120,H-120),hp:85*ES*.7,mhp:85*ES*.7,dmg:9*Math.sqrt(ES),rng:135,rate:1.2,cd:rnd(0,1),sp:36,gun:1,sol:1,r:6,col:'#c9a24a'});
 const val={t:'a',gd:1,val:1,x:70,y:GY,hp:900*ES*.7,mhp:900*ES*.7,dmg:20*Math.sqrt(ES),rng:150,rate:.7,cd:0,sp:44,gun:1,sol:1,r:8,col:'#f2c542'};
 U.push(...gd,val);return U}
function enemy(k,x,y,band){const B=band,col=B==='cuervos'?'#2b2b34':'#7a4a9a';const T={g:{hp:45,dmg:5,rng:120,rate:1.4,sp:32,gun:1,r:6},m:{hp:50,dmg:6.5,rng:14,rate:1,sp:39,gun:0,r:6},h:{hp:160,dmg:9,rng:20,rate:1,sp:30,gun:0,r:9},t:{hp:380,dmg:7,rng:200,rate:.9,sp:0,gun:1,r:11,tow:1},b:{hp:4000,dmg:15,rng:105,rate:.85,sp:30,gun:1,r:12,boss:1}}[k];
 return Object.assign({t:'e',k,band:B,x,y,hp:T.hp,mhp:T.hp,cd:rnd(0,1),col,act:0,guard:1},T)}
function enemies(){const E=[],P=PLANS[plan],ed=P.ed;let n=1;const bnd=()=>Math.random()<.5?'cuervos':'viboras';
 [[WX-12,GY-130],[WX-12,GY+130]].forEach(([x,y],i)=>E.push(enemy('t',x,y,i?'viboras':'cuervos')));
 const cs=Math.pow(ES,.8),n1=Math.round(10*cs*(P.gate)),n2=Math.round(18*cs),n3=Math.round(8*cs);
 for(let i=0;i<n1;i++)E.push(enemy(i%3?'g':'m',rnd(WX+20,WX+90),rnd(100,H-100),bnd()));
 for(let i=0;i<n2;i++)E.push(enemy(i%6===0?'h':i%2?'g':'m',rnd(WX+120,WX+300),rnd(60,H-60),bnd()));
 for(let i=0;i<n3;i++)E.push(enemy(i%3===0?'h':'g',rnd(KEEP-80,KEEP+40),rnd(120,H-120),bnd()));
 E.push(enemy('b',KEEP+30,GY-50,'cuervos'));E.push(enemy('b',KEEP+30,GY+50,'viboras'));
 E.forEach(e=>{e.hp*=ed*Math.pow(ES,.95);e.mhp=e.hp;e.dmg*=ed*Math.pow(ES,.58)});E.find(e=>e.boss).bn='Mordaza';E.filter(e=>e.boss)[1].bn='Madre Víbora';E.filter(e=>e.boss)[0].bn='Mordaza';return E}
window.asaltoGo=()=>{if(power()<NEED)return;const P=PLANS[plan];document.getElementById('pan').style.display='none';window._asOn=1;
 const units=build();
 if(window.asaltoIsoStart){try{window.asaltoIsoStart({plan:P,es:ES,units,tot:units.filter(u=>u.p).length}).catch(e=>{console.error(e);window._asOn=0;toast('No se pudo cargar el mapa del asalto.')});return}catch(e){console.error(e)}}
 ST={U:units,E:enemies(),gate:{hp:650*P.gate*ES*.6,mhp:650*P.gate*ES*.6,open:0},wall:[],fx:[],tr:[],sm:[],msg:[],t:0,sp:1,ex:P.ex,cov:0,covCd:0,med:2,medCd:0,rein:0,end:0,phase:1,ph:{},aim:null,fallen:[]};
 ST.wall=[{y0:0,y1:GY-34,hp:1e9},{y0:GY+34,y1:H,hp:1e9}];say('Valeria','«¡Por el Alba! ¡Adelante!»');open()};
function say(w,t){ST.msg.unshift({w,t,at:ST.t});if(ST.msg.length>4)ST.msg.pop();try{window.sfx&&sfx('done')}catch(e){}}
/* ---------- interfaz ---------- */
let ov,cv,cx;
function open(){if(!ov){ov=document.createElement('div');ov.id='asOv';ov.innerHTML='<canvas id="asCv" width="'+W+'" height="'+H+'"></canvas><div id="asHud"></div><div id="asBar"></div>';document.body.appendChild(ov);cv=ov.querySelector('#asCv');cx=cv.getContext('2d');
 const st=document.createElement('style');st.textContent='#asOv{position:fixed;inset:0;z-index:9999;background:#0b0907;display:none;flex-direction:column;align-items:center;justify-content:center}#asOv.on{display:flex}#asCv{max-width:100%;max-height:calc(100% - 92px);width:auto;height:auto;aspect-ratio:2/1;touch-action:none;border:1px solid #4a3a2a;border-radius:6px}#asHud{position:absolute;top:6px;left:8px;right:8px;display:flex;justify-content:space-between;gap:8px;font:600 12px sans-serif;color:#e8c27a;text-shadow:0 1px 3px #000;pointer-events:none}#asBar{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;justify-content:center}#asBar button{padding:8px 12px;border-radius:8px;border:1px solid #6a5a3a;background:#2a2218;color:#f2d99a;font:600 12px sans-serif}#asBar button.on{background:#7a5a18;color:#fff}#asBar button:disabled{opacity:.4}';document.head.appendChild(st);
 cv.addEventListener('pointerdown',e=>{if(!ST||ST.end)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;if(ST.mode==='ex'&&ST.ex>0){boom(x,y);ST.ex--;ST.mode=null}else if(ST.mode==='med'&&ST.med>0){heal(x,y);ST.med--;ST.mode=null}ui()})}
 ov.classList.add('on');window._asOn=1;ui();last=performance.now();requestAnimationFrame(loop)}
function ui(){const b=ov.querySelector('#asBar');b.innerHTML=`<button class="${ST.mode==='ex'?'on':''}" ${ST.ex>0?'':'disabled'} onclick="asaltoMode('ex')">Explosivo ×${ST.ex}</button><button ${ST.covCd<=0&&!ST.cov?'':'disabled'} onclick="asaltoCov()">Fuego de cobertura${ST.covCd>0?' ('+Math.ceil(ST.covCd)+')':''}</button><button class="${ST.mode==='med'?'on':''}" ${ST.med>0?'':'disabled'} onclick="asaltoMode('med')">Botiquín ×${ST.med}</button><button onclick="asaltoSpd()">Velocidad ×${ST.sp}</button>`}
window.asaltoMode=m=>{ST.mode=ST.mode===m?null:m;ui()};window.asaltoSpd=()=>{ST.sp=ST.sp===1?2:1;ui()};window.asaltoCov=()=>{if(ST.covCd>0||ST.cov)return;ST.cov=8;ST.covCd=26;say('Valeria','«¡Fuego de cobertura! ¡Que no levanten la cabeza!»');ui()};
function boom(x,y){ST.fx.push({k:'ex',x,y,t:0});ST.E.forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<78)e.hp-=e.boss?110:160});if(Math.abs(x-WX)<70&&!ST.gate.open&&Math.abs(y-GY)<60)ST.gate.hp-=420;if(Math.abs(x-WX)<60&&(y<GY-34||y>GY+34)){const w=ST.wall.find(q=>y>=q.y0&&y<=q.y1);if(w&&!w.broken){w.broken=1;ST.fx.push({k:'tx',t:0})}}try{window.sfx&&sfx('boom')}catch(e){}}
function heal(x,y){ST.U.forEach(u=>{if(Math.hypot(u.x-x,u.y-y)<85&&u.hp>0)u.hp=Math.min(u.mhp,u.hp+u.mhp*.55)});ST.fx.push({k:'hl',x,y,t:0})}
/* ---------- simulación ---------- */
let last=0;
function loop(now){if(!ov.classList.contains('on'))return;let dt=Math.min(.05,(now-last)/1000);last=now;if(!ST.end){for(let i=0;i<ST.sp;i++)step(dt)}draw();requestAnimationFrame(loop)}
function blocked(x,nx,y,u){if(u.tow)return false;const crossing=(x<WX&&nx>=WX)||(x>WX&&nx<=WX);if(!crossing)return false;if(!ST.gate.open&&Math.abs(y-GY)<34)return true;const w=ST.wall.find(q=>y>=q.y0&&y<=q.y1);return !(Math.abs(y-GY)<34&&ST.gate.open)&&!(w&&w.broken)}
function nearest(u,L,max){let b=null,d=max||1e9;for(const o of L){if(o.hp<=0)continue;const k=Math.hypot(o.x-u.x,o.y-u.y);if(k<d){d=k;b=o}}return b?{o:b,d}:null}
function step(dt){ST.t+=dt;if(ST.cov>0)ST.cov-=dt;if(ST.covCd>0)ST.covCd-=dt;
 const al=ST.U.filter(u=>u.hp>0),en=ST.E.filter(e=>e.hp>0);
 al.forEach(u=>unit(u,dt,en,true));en.forEach(e=>unit(e,dt,al,false));
 if(ST.gate.hp<=0&&!ST.gate.open){ST.gate.open=1;ST.fx.push({k:'tx',t:0});say('Valeria','«¡La puerta ha caído! ¡Adentro!»')}
 /* contra los muros/puerta: cuerpo a cuerpo */
 al.forEach(u=>{if(u.gun||u.cd>0)return;if(!ST.gate.open&&Math.abs(u.x-(WX-14))<10&&Math.abs(u.y-GY)<40){ST.gate.hp-=u.dmg;u.cd=1/u.rate}});
 /* muertes */
 ST.U.forEach(u=>{if(u.hp<=0&&!u.dead){u.dead=1;ST.fx.push({k:'bd',x:u.x,y:u.y,t:0});if(u.p)ST.fallen.push(u.p)}});
 ST.E.forEach(e=>{if(e.hp<=0&&!e.dead){e.dead=1;ST.fx.push({k:'bd',x:e.x,y:e.y,t:0});if(e.boss){say(e.bn,'«No... esto no puede...»');ST.bossDown=(ST.bossDown||0)+1}}});
 /* fases */
 const inside=en.filter(e=>e.x>WX&&e.x<KEEP-60).length;
 if(ST.phase===1&&ST.gate.open&&!ST.ph[2]){ST.ph[2]=1;ST.phase=2;say('Soler','«Patio interior. Mantened la formación»')}
 if(ST.phase===2&&inside<5&&!ST.ph[3]){ST.ph[3]=1;ST.phase=3;say('Valeria','«Quedan los cabecillas. ¡Acabad con ellos!»')}
 /* contraataque de la Guardia: la victoria está asegurada, pero llega justo cuando parece perdida */
 const aliveFrac=al.filter(u=>!u.gd).length/Math.max(1,ST.U.filter(u=>!u.gd).length);
 if((aliveFrac<.38||ST.t>(ST.rein?300:210))&&ST.rein<4&&ST.t-(ST.reinAt||-99)>45){ST.reinAt=ST.t;ST.rein++;say('Valeria','«¡La Guardia, conmigo! ¡Nadie más cae hoy!»');for(let i=0;i<9;i++)ST.U.push({t:'a',gd:1,x:rnd(20,80),y:rnd(100,H-100),hp:90*ES*.7,mhp:90*ES*.7,dmg:11*Math.sqrt(ES),rng:135,rate:1.2,cd:0,sp:40,gun:1,sol:1,r:6,col:'#c9a24a'});ST.U.filter(u=>u.val).forEach(v=>v.hp=v.mhp);al.forEach(u=>{u.hp=Math.min(u.mhp,u.hp+u.mhp*.35)});ST.shield=10}
 if(ST.shield>0)ST.shield-=dt;if(ST.gate.open||ST.t>90)ST.aggro=1;
 if(ST.bossDown>=2&&!ST.end)finish();
 ST.fx.forEach(f=>f.t+=dt);ST.fx=ST.fx.filter(f=>f.t<(f.k==='bd'?30:1.2));ST.tr.forEach(t=>t.l-=dt);ST.tr=ST.tr.filter(t=>t.l>0);
 if(ST.t%.5<dt)ui()}
function unit(u,dt,foes,ally){if(u.cd>0)u.cd-=dt;const val=u.val;
 let t=nearest(u,foes,u.gun?u.rng:46);const mult=ally?(ST.cov>0?1.5:1):(ST.shield>0?.55:1);
 if(ally&&!t&&!u.gun){const g=ST.gate;if(!g.open&&Math.abs(u.x-(WX-14))<26&&Math.abs(u.y-GY)<46){return}}
 if(ally&&!t&&u.gun&&!ST.gate.open&&Math.abs(u.x-(WX-14))<u.rng*.6&&Math.abs(u.y-GY)<80){if(u.cd<=0){ST.gate.hp-=u.dmg*.8;u.cd=1/u.rate;ST.tr.push({a:u,b:{x:WX,y:GY},l:.09,c:'#9fc4e8'})}return}
 if(t&&t.d<=(u.gun?u.rng:u.r+t.o.r+6)){if(u.cd<=0){let d=u.dmg*mult;if(u.val)d*=1.1;if(!ally&&t.o.val&&ST.shield>0)d=0;t.o.hp-=d;u.cd=1/u.rate*(ally&&ST.cov>0?.7:1);if(u.gun||u.tow)ST.tr.push({a:u,b:t.o,l:.09,c:ally?'#9fc4e8':'#ff9a4a'});else ST.fx.push({k:'hit',x:t.o.x,y:t.o.y,t:0})}return}
 if(u.tow)return;
 if(!ally){if(u.guard){const n=nearest(u,ST.U,190);if(!n&&!ST.aggro&&u.x>WX)return;if(n)u.guard=0}}
 let tx,ty;const f=nearest(u,foes);
 if(f){tx=f.o.x;ty=f.o.y}else{tx=ally?KEEP:30;ty=GY}
 if(ally&&!f){tx=KEEP}
 /* hacia la puerta si hay muro */
 if(ally&&u.x<WX&&!ST.gate.open&&tx>WX){tx=WX-12;ty=GY+(u.y<GY?-16:16)*.2;}
 if(ally&&u.x<WX&&ST.gate.open&&tx>WX){ty=Math.abs(u.y-GY)>26?GY:ty}
 if(!ally&&u.x>WX&&tx<WX&&!ST.gate.open){tx=WX+14;}
 const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy)||1,s=u.sp*dt;let nx=u.x+dx/d*s,ny=u.y+dy/d*s;
 if(blocked(u.x,nx,ny,u)){nx=u.x;ny=u.y+(GY-u.y>0?1:-1)*s*.9}
 if(ally&&u.x<WX&&!ST.gate.open&&nx>WX-14)nx=Math.min(nx,WX-14);
 /* separación */
 u.x=clamp(nx,8,W-8);u.y=clamp(ny,8,H-8)}
function reward(){const out=[];try{if(S.gd)S.gd.rep=(S.gd.rep||0)+150;const R={ammo:400,metal:500,comp:60,meds:150,chem:60,wood:400};const cp=(typeof cap==='function')?cap():99999;for(const k in R)if(S.res[k]!==undefined)S.res[k]=Math.min(cp,S.res[k]+R[k]);villaApi.gain(2500);
['Rifle del amanecer','Rifle del Consejo'].forEach(n=>{const k=WP.findIndex(w=>w.n===n);if(k>=0)S.inv.push({n:WP[k].n,v:WP[k].v})});
['Armadura del Consejo','Uniforme del amanecer'].forEach(n=>S.inv.push({kind:'outfit',n}));
let g=0;for(let i=0;i<3&&S.ppl.length<pcap();i++){const p=mkP(['Soldado','Médico','Mecánico'][i]);S.ppl.push(p);g++}
if(S.stat)S.stat.rescued=(S.stat.rescued||0)+g;
try{const t=TECH.filter(q=>!S.tech[q[0]]).slice(0,2);t.forEach(q=>S.tech[q[0]]=1)}catch(e){}
}catch(e){}return 'Recibes 2500 fichas, 400 de munición, 500 de metal, 150 de medicinas, 400 de madera, 60 de componentes y 60 de químicos; el Rifle del amanecer, el Rifle del Consejo, la Armadura del Consejo y el Uniforme del amanecer; planos nuevos; 3 supervivientes liberados de las celdas enemigas y +150 de reputación con la Guardia.'}
function finish2(r){const fell=r.fallen.length,surv=r.surv,total=r.total;r.fallen.forEach(p=>{if(!S.ppl.includes(p))return;if(Math.random()<.4){try{die(p,'Cayó en el asalto final')}catch(e){S.ppl=S.ppl.filter(q=>q!==p)}}else{p.hp=Math.max(10,p.hp*.2)}});
 A().won=1;const RW=reward();
 try{window.notify&&notify('🏆','Cuervos y Víboras derrotados','Los dos pueblos han caído. Solo queda CENIZA.','historia')}catch(e){}
 setTimeout(()=>{window._asOn=0;show('Victoria sobre las dos bandas',`<div class="mu-empty"><span>🏆</span><b>El Nido Negro y el Nido de Víboras han caído</b><small>Mordaza y la Madre Víbora ya no están. Valeria clava la bandera dorada sobre las ruinas: «El Alba vuelve a salir».<br><br>Han combatido ${total} de los tuyos: ${surv} siguen en pie y ${fell} cayeron. Los caídos pueden haber muerto o quedar heridos; revisa tu base.<br><br>Cuervos y Víboras ya no volverán a atacar. Solo queda CENIZA. ${RW}</small></div>`)},500)}
function finish(){ST.end=1;const fell=ST.fallen.length;ST.fallen.forEach(p=>{if(!S.ppl.includes(p))return;if(Math.random()<.4){try{die(p,'Cayó en el asalto final')}catch(e){S.ppl=S.ppl.filter(q=>q!==p)}}else{p.hp=Math.max(10,p.hp*.2)}});
 const surv=ST.U.filter(u=>u.p&&u.hp>0).length,total=ST.U.filter(u=>u.p).length;
 A().won=1;const RW=reward();
 try{window.notify&&notify('🏆','Cuervos y Víboras derrotados','El bastión ha caído. Solo queda CENIZA.','historia')}catch(e){}
 setTimeout(()=>{ov.classList.remove('on');window._asOn=0;show('Victoria en el bastión',`<div class="mu-empty"><span>🏆</span><b>El bastión ha caído</b><small>Mordaza y la Madre Víbora yacen entre los muros de su fortaleza. Valeria clava la bandera dorada sobre la torre: «El Alba vuelve a salir».<br><br>Han combatido ${total} de los tuyos: ${surv} siguen en pie y ${fell} cayeron. Los caídos pueden haber muerto o quedar heridos; revisa tu base.<br><br>Cuervos y Víboras ya no volverán a atacar. Solo queda CENIZA. ${RW}</small></div>`)},1500)}
/* ---------- dibujo ---------- */
function draw(){const c=cx,tm=ST.t;
 let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#3a4228');g.addColorStop(.5,'#4a4a30');g.addColorStop(1,'#3d3426');c.fillStyle=g;c.fillRect(0,0,W,H);
 for(let i=0;i<140;i++){c.fillStyle=i%3?'rgba(20,24,10,.25)':'rgba(120,110,70,.12)';c.fillRect((i*137)%W,(i*71)%H,8+(i%5)*5,3+(i%3))}
 c.fillStyle='rgba(30,24,16,.5)';c.fillRect(WX,0,W-WX,H);c.fillStyle='#4a402c';c.fillRect(WX+110,60,190,H-120);c.strokeStyle='rgba(0,0,0,.35)';for(let y=70;y<H-60;y+=26){c.beginPath();c.moveTo(WX+110,y);c.lineTo(WX+300,y);c.stroke()}
 [[WX+150,100],[WX+210,380],[WX+250,150],[WX+170,300]].forEach(([x,y])=>{c.fillStyle='#5a5a3a';c.beginPath();c.moveTo(x-22,y+14);c.lineTo(x,y-16);c.lineTo(x+22,y+14);c.closePath();c.fill();c.strokeStyle='#1a1810';c.stroke()});
 [[WX+90,70],[WX+330,420],[WX+60,430],[WX+320,60]].forEach(([x,y])=>{c.fillStyle='#6a4a2a';c.fillRect(x,y,16,12);c.strokeStyle='#2a1a0a';c.strokeRect(x,y,16,12)});
 c.fillStyle='#5a4630';c.fillRect(KEEP-70,80,180,H-160);c.fillStyle='#3a2a1a';c.fillRect(KEEP-70,80,180,18);c.strokeStyle='#1a1008';c.lineWidth=2;c.strokeRect(KEEP-70,80,180,H-160);
 [[KEEP+40,GY-90],[KEEP+40,GY+90],[WX+210,GY]].forEach(([x,y],i)=>{const f=.5+.5*Math.sin(tm*8+i*2);const gr=c.createRadialGradient(x,y,2,x,y,46);gr.addColorStop(0,'rgba(255,150,40,'+(.55*f+.2)+')');gr.addColorStop(1,'rgba(255,80,0,0)');c.fillStyle=gr;c.fillRect(x-46,y-46,92,92);c.fillStyle='#ff8a2a';c.fillRect(x-3,y-6-f*3,6,8+f*3)});
 /* campamento de la Guardia */
 c.fillStyle='rgba(201,162,74,.12)';c.fillRect(0,0,150,H);[[24,60],[24,GY],[24,H-60]].forEach(([x,y])=>{c.strokeStyle='#2a201a';c.lineWidth=3;c.beginPath();c.moveTo(x,y+22);c.lineTo(x,y-22);c.stroke();c.fillStyle='#c9a24a';c.fillRect(x,y-22,18,11)});
 /* muro */
 const wallPaint=(y0,y1,br)=>{c.fillStyle=br?'#4a443c':'#70675b';c.fillRect(WX-12,y0,24,y1-y0);if(!br){c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;for(let y=y0;y<y1;y+=10){c.beginPath();c.moveTo(WX-12,y);c.lineTo(WX+12,y);c.stroke()}c.fillStyle='#8a8074';for(let y=y0;y<y1;y+=20)c.fillRect(WX-14,y,28,9)}};
 ST.wall.forEach(w=>{if(w.broken){for(let y=w.y0;y<w.y1;y+=18){if(Math.sin(y*1.7)>-.2)wallPaint(y,Math.min(w.y1,y+14),1)}}else wallPaint(w.y0,w.y1,0)});
 if(!ST.gate.open){c.fillStyle='#5a3e24';c.fillRect(WX-13,GY-34,26,68);c.strokeStyle='#1a0e04';c.lineWidth=2;c.strokeRect(WX-13,GY-34,26,68);c.beginPath();c.moveTo(WX,GY-34);c.lineTo(WX,GY+34);c.stroke();const f=ST.gate.hp/ST.gate.mhp;c.fillStyle='#000a';c.fillRect(WX-24,GY-46,48,5);c.fillStyle='#c9a24a';c.fillRect(WX-24,GY-46,48*Math.max(0,f),5)}else{c.fillStyle='rgba(60,40,20,.6)';c.fillRect(WX-10,GY-34,20,68)}
 /* cadáveres y efectos de suelo */
 ST.fx.filter(f=>f.k==='bd').forEach(f=>{c.fillStyle='rgba(20,15,12,.8)';c.fillRect(f.x-6,f.y-2,12,5)});
 /* unidades */
 const all=ST.U.concat(ST.E);all.forEach(u=>{if(u.hp<=0)return;const r=u.r+1.5;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(u.x,u.y+r*.7,r,r*.5,0,0,7);c.fill();
  if(u.tow){c.fillStyle='#6a6054';c.fillRect(u.x-r-8,u.y-r-8,(r+8)*2,(r+8)*2);c.strokeStyle='#1a1410';c.lineWidth=2;c.strokeRect(u.x-r-8,u.y-r-8,(r+8)*2,(r+8)*2);c.fillStyle='#403830';c.fillRect(u.x-r-2,u.y-r-2,(r+2)*2,(r+2)*2);c.fillStyle=u.col;c.beginPath();c.arc(u.x,u.y,6,0,7);c.fill()}
  else{c.fillStyle=u.col;c.beginPath();c.arc(u.x,u.y,r,0,7);c.fill();c.strokeStyle=u.t==='e'?(u.band==='cuervos'?'#c9c9d2':'#d39aef'):(u.gd?'#f2d99a':'#cfe3f5');c.lineWidth=u.boss?2.5:1.5;c.stroke();c.fillStyle='#d8a878';c.beginPath();c.arc(u.x,u.y-1,r*.45,0,7);c.fill();if(u.val){c.strokeStyle='#f2c542';c.lineWidth=2;c.beginPath();c.arc(u.x,u.y,r+3,0,7);c.stroke()}}
  if(u.boss||u.val||u.tow||u.hp<u.mhp){const w=u.boss?36:u.val?30:16,f=Math.max(0,u.hp/u.mhp);c.fillStyle='#000a';c.fillRect(u.x-w/2,u.y-r-8,w,3);c.fillStyle=u.t==='a'?'#6fa8dc':'#d04a3a';c.fillRect(u.x-w/2,u.y-r-8,w*f,3)}
  if(u.boss||u.val){c.font='bold 10px sans-serif';c.textAlign='center';c.fillStyle=u.val?'#f2c542':'#fff';c.fillText(u.val?'Presidenta Valeria':u.bn,u.x,u.y-r-12)}});
 /* disparos y efectos */
 ST.tr.forEach(t=>{c.strokeStyle=t.c;c.lineWidth=1;c.globalAlpha=Math.min(1,t.l*10);c.beginPath();c.moveTo(t.a.x,t.a.y);c.lineTo(t.b.x,t.b.y);c.stroke();c.globalAlpha=1});
 ST.fx.forEach(f=>{if(f.k==='ex'){const r=f.t*130;c.strokeStyle='rgba(255,170,60,'+(1-f.t/1.2)+')';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,r,0,7);c.stroke();c.fillStyle='rgba(255,120,30,'+(.5-f.t/2.4)+')';c.beginPath();c.arc(f.x,f.y,r*.8,0,7);c.fill()}else if(f.k==='hl'){c.strokeStyle='rgba(120,230,140,'+(1-f.t/1.2)+')';c.lineWidth=3;c.beginPath();c.arc(f.x,f.y,f.t*80,0,7);c.stroke()}else if(f.k==='hit'){c.fillStyle='rgba(255,220,120,'+(1-f.t/.3)+')';c.fillRect(f.x-2,f.y-2,4,4)}});
 /* humo */
 if(Math.random()<.4)ST.sm.push({x:rnd(WX,W),y:rnd(0,H),r:6,a:.22});ST.sm.forEach(s=>{s.y-=.4;s.r+=.15;s.a-=.002;c.fillStyle='rgba(50,44,40,'+Math.max(0,s.a)+')';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()});ST.sm=ST.sm.filter(s=>s.a>0);
 if(ST.mode){c.fillStyle='rgba(255,220,120,.12)';c.fillRect(0,0,W,H);c.font='bold 14px sans-serif';c.textAlign='center';c.fillStyle='#ffe9a8';c.fillText(ST.mode==='ex'?'Toca donde lanzar el explosivo':'Toca donde curar a tus tropas',W/2,H-14)}
 /* HUD */
 const aa=ST.U.filter(u=>u.hp>0&&u.p).length,at=ST.U.filter(u=>u.p).length,ee=ST.E.filter(e=>e.hp>0&&!e.tow).length,v=ST.U.find(u=>u.val);
 ov.querySelector('#asHud').innerHTML=`<span>Fase ${ST.phase}/3 · ${['','Romper el perímetro','Patio interior','Los cabecillas'][ST.phase]}</span><span>Tus tropas ${aa}/${at} · Enemigos ${ee} · Valeria ${Math.max(0,Math.round(v.hp/v.mhp*100))}%</span>`;
 ST.msg.slice(0,3).forEach((m,i)=>{if(ST.t-m.at>7)return;c.font='bold 12px sans-serif';c.textAlign='left';c.fillStyle='rgba(0,0,0,.6)';c.fillRect(10,H-58-i*20,c.measureText(m.w+': '+m.t).width+14,18);c.fillStyle='#f2d99a';c.fillText(m.w+': '+m.t,16,H-45-i*20)})}
/* pausa del juego mientras dura el asalto */
(function(){const o=window.upd;if(typeof o!=='function')return;window.upd=function(){if(window._asOn)return;return o.apply(this,arguments)}})();
/* botón de acceso */
setInterval(()=>{try{if(typeof S==='undefined'||!S||!S.ppl)return;const rl=document.getElementById('rl'),b=document.getElementById('asBtn'),show_=A().fall&&!A().won&&(A().s.guerra||0)>=4;if(show_&&rl&&!b){const n=document.createElement('button');n.id='asBtn';n.innerHTML='<i class="ib">⚔</i>Asalto final';n.onclick=()=>asaltoMenu();const g=document.getElementById('gdBtn')||document.getElementById('vlBtn');rl.insertBefore(n,g?g.nextSibling:null)}else if(!show_&&b)b.remove()}catch(e){}},2000);
window.ASALTO={NEED,sim:()=>ST,step,finish,finish2,build,crew,power,PLANS,reward};
})();
