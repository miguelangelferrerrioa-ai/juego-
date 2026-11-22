/* ===== Dead Town · presentación de enemigos nuevos: la primera vez que aparece un tipo, el juego se para y se muestra su ficha animada ===== */
(function(){
'use strict';
const INFO={
 x:['Infectado especial','Cava por debajo de los muros de nivel 1 a 6 y aparece dentro del pueblo. Bajo tierra no se le puede herir.','Los muros de nivel 7 o más tienen cimientos: ahí tiene que romperlos. Ten tiradores también dentro.'],
 w:['Infectado especial','Enorme y lentísimo, carga una viga de hierro. Casi no ataca a la gente: va a por tus muros y puertas y los destroza.','Que las torres cubran la muralla: hay que tumbarlo antes de que llegue.'],
 i:['Infectado especial','Arde por dentro. Al morir deja fuego unos segundos que quema edificios y gente cercana.','Mátalo lejos de las casas: mejor con torres que lleguen lejos.'],
 l:['Infectado especial','Líder de manada. Los zombis a su alrededor pegan más fuerte y se curan mientras él siga en pie.','Es la prioridad: sin él, la manada se debilita.'],
 z:['Infectado','Lento y torpe, pero nunca viene solo. Ataca cuerpo a cuerpo a personas y edificios.','Las torres con tiradores los frenan antes de que lleguen.'],
 f:['Infectado','Aguanta más del triple que un zombi normal y avanza despacio hacia tus edificios.','Concentra el fuego en él: tarda en llegar, pero derriba lo que toca.'],
 s:['Infectado','Un antiguo militar. Conserva parte del equipo y resiste mucho más castigo.','Necesitas armas mejores que la pistola para tumbarlo rápido.'],
 r:['Infectado','Corre más del doble que los demás y llega el primero a tus defensas. Tiene poca vida.','Mantén tiradores cerca del ayuntamiento: cae con pocos disparos.'],
 b:['Humano hostil','Un saqueador armado. Dispara desde lejos en vez de acercarse.','Tus soldados deben salir a por él: las torres no siempre lo alcanzan.'],
 k:['Humano hostil','El bruto de la banda. Va al cuerpo a cuerpo y pega muy fuerte.','No dejes que alcance a tus civiles: abátelo a distancia.'],
 p:['Humano hostil','Lleva el estandarte de su banda. Pega poco, pero aguanta bastante.','Suele ir rodeado: elimina primero a los que disparan.'],
 m:['Humano hostil','Un profesional a sueldo. Dispara desde más lejos que un bandido y resiste el doble.','En las misiones, acércate en grupo: de uno en uno te desgasta.'],
 e:['CENIZA','Soldado de élite con armadura: cada impacto le hace menos daño. Dispara desde muy lejos y muy rápido.','Las armas débiles apenas le afectan. Lleva tu mejor equipo.'],
 u:['Infectado especial','Una mole. Cada pocos segundos da un golpe en el suelo que hiere a todos los que tiene cerca.','No amontones a tu gente a su lado. Dispárale desde lejos.'],
 j:['Infectado especial','Monta una bestia y embiste a toda velocidad contra quien tenga delante. Al morir, su jinete sigue a pie.','Carga cada pocos segundos: reparte a tus soldados para que no los arrolle juntos.'],
 t:['Infectado especial','No rompe los muros: los escala. Pasa por encima de murallas y puertas.','Los muros no te salvan de él. Necesitas tiradores dentro del recinto.'],
 q:['Infectado especial','Escupe ácido desde lejos contra personas y edificios, sin necesidad de acercarse.','Es frágil: mándale soldados o dale prioridad con las torres.'],
 h:['Infectado especial','Salta sobre una persona, la derriba y la mantiene inmovilizada mientras la hiere.','Quien queda atrapado no puede moverse: mata al cazador para liberarlo.'],
 g:['Infectado especial','Su grito enfurece a los zombis cercanos, que se mueven más rápido durante unos segundos.','Apenas hace daño, pero vuelve peligrosa a toda la horda. Elimínalo primero.'],
 a:['Infectado especial','Va cubierto de placas que absorben casi todo el daño hasta que se rompen.','Las armas potentes rompen las placas mucho antes que las débiles.'],
 v:['Infectado especial','Se arrastra muy despacio y es difícil de acertar. Si alcanza a un civil, lo agarra y no lo suelta.','No lo ignores por lento: remátalo antes de que llegue a tu gente.'],
 U:['Jefe','Un gigante hecho de restos. Cada poco tiempo ruge y hace surgir más zombis a su alrededor.','Cuanto más dure, más enemigos habrá. Todo el fuego sobre él.'],
 J:['Jefe','Rápido y letal. Cuando pierde la mitad de la vida, llama a una jauría de corredores.','Guarda munición y soldados para la segunda mitad del combate.'],
 T:['Jefe','Trepa los muros y cría trepadores sin parar mientras siga viva.','Las murallas no la detienen. Defiende desde dentro.'],
 G:['Jefe','Su chillido paraliza a todos los que están cerca y acelera al resto de la horda.','Mantén a tu gente lejos de ella y dispárale desde las torres.'],
 A:['Jefe','Lleva una armadura que se regenera. Si se la rompes, entra en furia y se vuelve más rápido.','Usa tus armas más fuertes y no dejes de dispararle.'],
 H:['Jefe','Lidera a los cazadores. Salta sobre tus supervivientes una y otra vez y los inmoviliza.','Agrupa soldados para liberar rápido a quien atrape.']};
const HUMC={b:'#5b3d2a',k:'#5b3d2a',p:'#5b3d2a',m:'#4f5e40',e:'#2c2f3a'};
const css=document.createElement('style');css.textContent=`
#ziov{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(40,6,6,.72),rgba(0,0,0,.9));padding:10px;box-sizing:border-box}
#ziov.on{display:flex}
#zic{width:min(660px,96vw);max-height:94vh;display:flex;flex-direction:column;background:linear-gradient(#1b1512,#0d0b0a);border:2px solid #b3382e;border-radius:14px;box-shadow:0 0 0 1px #000,0 14px 50px #000d,0 0 60px rgba(179,56,46,.25);overflow:hidden;animation:ziin .4s cubic-bezier(.2,1.3,.4,1)}
#zic.boss{border-color:#e8b84a;box-shadow:0 0 0 1px #000,0 14px 50px #000d,0 0 70px rgba(232,184,74,.3)}
.zi-top{display:flex;align-items:center;gap:8px;padding:7px 12px;background:repeating-linear-gradient(135deg,#2a0d0b 0 12px,#1c0908 12px 24px);border-bottom:1px solid #5a1c17}
.zi-top b{flex:1;color:#ff6b5a;font-size:12px;letter-spacing:.2em;text-transform:uppercase}
#zic.boss .zi-top b{color:#ffd877}
.zi-top span{color:#a89a8a;font-size:11px;letter-spacing:.08em}
.zi-body{display:flex;gap:14px;padding:12px 14px;align-items:stretch;overflow:auto}
.zi-art{flex:0 0 190px;position:relative;border-radius:10px;border:1px solid #4a2a22;background:radial-gradient(ellipse at 50% 82%,#3a2a1e 0,#1a1410 55%,#0c0a09 100%);overflow:hidden;min-height:190px}
.zi-art canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.zi-art i{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px);pointer-events:none}
.zi-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.zi-tag{align-self:flex-start;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#1a0b09;background:#ff6b5a;border-radius:4px;padding:2px 7px;font-weight:800}
#zic.boss .zi-tag{background:#ffd877}
.zi-txt h3{margin:0;color:#ffe9c8;font-size:22px;line-height:1.1;letter-spacing:.02em}
.zi-txt p{margin:0;font-size:14px;line-height:1.45;color:#e6ddd0}
.zi-tip{font-size:13px;line-height:1.4;color:#d8c9a0;border-left:3px solid #c8921a;padding:4px 0 4px 9px;background:rgba(200,146,26,.08);border-radius:0 6px 6px 0}
.zi-tip b{color:#f2c542}
.zi-st{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;align-items:center;font-size:11px;color:#a89a8a;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
.zi-st em{display:block;height:6px;border-radius:3px;background:#2a211c;overflow:hidden}.zi-st em u{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#b3382e,#ff6b5a)}
.zi-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;border-top:1px solid #3a2a22;background:#120e0c}
.zi-foot small{color:#8a7d70;font-size:11px}
.zi-foot button{padding:9px 22px;font-weight:800;border:0;border-radius:9px;background:linear-gradient(#f2c542,#c8921a);color:#1c1405;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
@keyframes ziin{from{transform:scale(.82);opacity:0}to{transform:scale(1);opacity:1}}
@media(max-width:520px){.zi-body{flex-direction:column}.zi-art{flex:none;height:170px}}
@media(max-height:420px){.zi-art{flex-basis:160px;min-height:150px}.zi-txt h3{font-size:19px}.zi-txt p{font-size:13px}.zi-tip{font-size:12px}.zi-body{padding:8px 12px}}`;
document.head.appendChild(css);
let ov=null,queue=[],cur=null,raf=0,t0=0,mPrev=null;
function build(){ov=document.createElement('div');ov.id='ziov';ov.innerHTML='<div id="zic"><div class="zi-top"><b id="zih"></b><span id="zin"></span></div><div class="zi-body"><div class="zi-art"><canvas id="zicv"></canvas><i></i></div><div class="zi-txt"><span class="zi-tag" id="zitag"></span><h3 id="zinm"></h3><p id="zids"></p><div class="zi-st" id="zist"></div><div class="zi-tip" id="zitp"></div></div></div><div class="zi-foot"><small>⏸ Juego en pausa</small><button id="zibt" onclick="enemyIntroNext()">Entendido</button></div></div>';document.body.appendChild(ov)}
const seen=()=>{S.zseen=S.zseen||{};return S.zseen};
function paint(cv,t,el,st){if(!cv||!ZT[t])return;const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);if(!r.width)return;
 if(cv.width!==Math.round(r.width*d)){cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d)}
 const x=cv.getContext('2d'),zt=ZT[t],bh=(window.ZX&&ZX.bh?ZX.bh(t):0)||zt.bh||46,sc=Math.min(4.6,(r.height*.8)/bh);
 x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);
 /* suelo */
 x.setTransform(d,0,0,d,0,0);const gx=r.width/2,gy=r.height*.84;x.fillStyle='rgba(0,0,0,.4)';x.beginPath();x.ellipse(gx,gy,r.width*.3,r.height*.06,0,0,7);x.fill();
 x.setTransform(d*sc,0,0,d*sc,gx*d,gy*d);
 const atk=(el%4)>2.6,z=st.z||(st.z={t,x:0,y:0,hp:1,mhp:1,act:1,wear:[],sd:7,pl:1,pl0:1});z.t=t;z.at=atk?1:0;z.dx=Math.sin(el*.5)>-.3?1:-1;
 const og=window.g;window.g=x;
 try{FL=0;x.save();
  if(HUMC[t]){EXP='angry';SXF=0;OLDF=0;KIDF=0;window.BCOL=HUMC[t];fig(0,0,HUMC[t],t==='k'?1.1:1,1,'#d8a878',1,z.dx,'ban',atk?4:0,z.sd);window.BCOL=null;if(t==='b'||t==='k'||t==='p'){try{window.drawBandit&&drawBandit(x,z)}catch(e){}}}
  else if(window.ZX&&ZX.has(t))ZX.dh(x,z);
  else{SXF=0;OLDF=0;KIDF=0;ZV=t==='f'?3:t==='s'?4:t==='r'?7:0;fig(0,0,zt.c,t==='f'?1.12:t==='r'?.97:1,1,'#9bb27a',0,z.dx,'zom',atk?2:(t==='r'?3:0),0)}
  x.restore()}catch(e){}finally{window.g=og}}
window.enemyPaint=paint;window.enemyInfo=INFO;
function drawEnemy(){if(cur)paint(document.getElementById('zicv'),cur,(performance.now()-t0)/1000,drawEnemy)}
function loop(){if(!cur)return;drawEnemy();raf=requestAnimationFrame(loop)}
function bar(v,mx){return '<em><u style="width:'+Math.max(8,Math.min(100,Math.round(v/mx*100)))+'%"></u></em>'}
function show(t){cur=t;if(!ov)build();const zt=ZT[t],I=INFO[t]||['Enemigo','Un enemigo desconocido.','Obsérvalo antes de acercarte.'],boss=!!zt.boss;
 document.getElementById('zic').className=boss?'boss':'';
 document.getElementById('zih').textContent=boss?'☠ Nuevo jefe':'⚠ Nuevo enemigo';
 document.getElementById('zin').textContent=queue.length?('quedan '+queue.length+' más'):'';
 document.getElementById('zitag').textContent=I[0];document.getElementById('zinm').textContent=zt.n;document.getElementById('zids').textContent=I[1];
 document.getElementById('zitp').innerHTML='<b>Consejo:</b> '+I[2];
 document.getElementById('zist').innerHTML='<span>Vida</span>'+bar(Math.sqrt(zt.hp),Math.sqrt(boss?1800:340))+'<span>Velocidad</span>'+bar(zt.sp,1.55)+'<span>Daño</span>'+bar(zt.d,boss?34:24);
 document.getElementById('zibt').textContent=queue.length?'Siguiente':'Entendido';
 drawEnemy.z=null;t0=performance.now();ov.classList.add('on');window._ziOpen=true;
 try{const M=window._qm&&_qm.M&&_qm.M();if(M&&mPrev===null){mPrev=!!M.pause;M.pause=true}}catch(e){}
 try{sfx(boss?'bossroar':'zombie')}catch(e){}
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
window.enemyIntroNext=function(){if(cur){seen()[cur]=1}if(queue.length){show(queue.shift());return}
 cur=null;cancelAnimationFrame(raf);if(ov)ov.classList.remove('on');window._ziOpen=false;
 try{const M=window._qm&&_qm.M&&_qm.M();if(M&&mPrev!==null)M.pause=mPrev}catch(e){}mPrev=null;try{sfx('click')}catch(e){}};
window.enemyIntroShow=function(t){if(!ZT[t])return;if(cur){queue.push(t);return}show(t)};
/* detección: tipos nuevos en la horda o en el mapa de la misión */
function scan(){try{if(window.ZI_OFF||typeof S==='undefined'||!S||!S.ppl||S.over||cur||window._ttOpen)return;const ts=document.getElementById('titleScreen');if(ts&&getComputedStyle(ts).display!=='none')return;
 const sn=seen(),found=[];const add=t=>{if(ZT[t]&&!sn[t]&&!found.includes(t)&&!queue.includes(t))found.push(t)};
 if(typeof horde!=='undefined'&&horde)Z.forEach(z=>{if(z.act&&z.hp>0)add(z.t)});
 try{if(window._qmShown&&_qmShown()){const M=_qm.M();if(M&&M.en)M.en.forEach(z=>{if(z.hp>0&&(!M.vis||M.vis[Math.floor(z.y)*M.g[0].length+Math.floor(z.x)]===2))add(z.t)})}}catch(e){}
 if(!found.length)return;found.sort((a,b)=>(ZT[a].boss?1:0)-(ZT[b].boss?1:0)||ZT[a].hp-ZT[b].hp);const pick=found;pick.forEach(t=>sn[t]=1);queue=queue.concat(pick.slice(1));show(pick[0])}catch(e){}}
setInterval(scan,400);
/* pausa del juego mientras la ficha está abierta */
(function(){const o=window.upd;if(typeof o!=='function')return;window.upd=function(){if(window._ziOpen)return;return o.apply(this,arguments)}})();
})();
