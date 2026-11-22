/* ===== Dead Town · Guía con imágenes de referencia: recursos, materiales, edificios, enemigos, unidades y profesiones ===== */
(function(){
'use strict';
if(typeof GD==='undefined'||typeof window.guide!=='function')return;
const css=document.createElement('style');css.textContent=`
.gi-card{display:flex;gap:12px;align-items:center;margin:8px 0;padding:8px 10px;border:1px solid #2c3a2a;border-radius:10px;background:rgba(255,255,255,.025)}
.gi-card p{margin:0!important;flex:1;min-width:0}
.gi-pic{flex:0 0 84px;width:84px;height:76px;border-radius:8px;border:1px solid #3a3326;background:radial-gradient(ellipse at 50% 80%,#3a3022 0,#1a1611 60%,#0d0c0a 100%);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
.gi-pic canvas{width:100%;height:100%;display:block}
.gi-pic img{width:44px;height:44px;image-rendering:pixelated}
.gi-strip{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px}
.gi-strip figure{margin:0;width:92px;text-align:center}
.gi-strip figcaption{font-size:11px;line-height:1.2;color:#cfc6b0;margin-top:3px}
.gi-strip .gi-pic{width:92px;flex:none}
@media(max-width:520px){.gi-pic{flex-basis:68px;width:68px;height:64px}}
/* la guía ocupa la pantalla: el índice y el artículo se desplazan por separado, así el texto nunca queda cortado ni fuera de la vista */
#guideScreen{overflow:hidden}
#guideScreen .guide-shell{height:100%;min-height:0}
#guideScreen .guide-layout{min-height:0;overflow:hidden}
#guideScreen .guide-nav{min-height:0;overflow:auto;-webkit-overflow-scrolling:touch}
#guideScreen .guide-article{max-height:none;min-height:0;height:100%;box-sizing:border-box;overflow:auto;-webkit-overflow-scrolling:touch}
@media(max-height:480px){#guideScreen .guide-head{padding:8px 14px}#guideScreen .guide-head p,#guideScreen .guide-head small{display:none}#guideScreen .guide-head h2{font-size:18px;margin:0}#guideScreen .guide-nav button{padding:7px 10px}}
/* bestiario */
.gi-best{display:flex;gap:14px;align-items:stretch;margin:10px 0;padding:10px 12px;border:1px solid #4a2a22;border-radius:12px;background:linear-gradient(#1b1512,#120f0d)}
.gi-best.boss{border-color:#8a6a1e}.gi-best.lock{border-color:#2a2a2a;background:#101112}
.gi-best .gi-pic{flex:0 0 130px;width:130px;height:130px}
.gi-best .bt{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;justify-content:center}
.gi-best .tag{align-self:flex-start;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#1a0b09;background:#ff6b5a;border-radius:4px;padding:1px 7px;font-weight:800}
.gi-best.boss .tag{background:#ffd877}.gi-best.lock .tag{background:#555;color:#ddd}
.gi-best h4{margin:0!important;color:#ffe9c8!important;font-size:18px}
.gi-best p{margin:0!important}
.gi-best .tip{font-size:13px;color:#d8c9a0;border-left:3px solid #c8921a;padding:3px 0 3px 9px;background:rgba(200,146,26,.08)}
.gi-best .st{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;align-items:center;font-size:11px;color:#a89a8a;text-transform:uppercase;letter-spacing:.08em;max-width:420px}
.gi-best .st em{display:block;height:6px;border-radius:3px;background:#2a211c;overflow:hidden}.gi-best .st em u{display:block;height:100%;background:linear-gradient(90deg,#b3382e,#ff6b5a)}
.gi-h{margin:18px 0 4px!important}
.gi-lockq{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:900 30px system-ui;color:#8a8f94;text-shadow:0 2px 6px #000;pointer-events:none}
@media(max-width:520px){.gi-best .gi-pic{flex-basis:92px;width:92px;height:100px}}`;
document.head.appendChild(css);
const norm=s=>String(s||'').toLowerCase().replace(/[:.,;()]/g,' ').replace(/\s+/g,' ').trim();
let MAP=null;
function buildMap(){const m=Object.create(null);const put=(n,v)=>{const k=norm(n);if(k&&!m[k])m[k]=v};
 /* enemigos primero: sus nombres son los más específicos */
 Object.keys(ZT).forEach(k=>put(ZT[k].n,['zom',k]));PF.forEach(pr=>put(pr,['prof',pr]));Object.keys(CL).forEach(k=>put(CL[k].n,['unit',k]));
 /* nombres cortos de zombis (Musculoso, Jinete...) solo si no chocan con una profesión o unidad */
 Object.keys(ZT).forEach(k=>{const sh=ZT[k].n.replace(/^Zombi /,'');if(sh!==ZT[k].n)put(sh,['zom',k])});
 put('Zombis normales',['zom','z']);put('Zombis',['zom','z']);put('Centurión',['zom','A']);put('Coloso',['zom','U']);put('Reina',['zom','T']);put('Alfa',['zom','H']);put('Jinete Pálido',['zom','J']);
 Object.keys(BT).forEach(k=>{put(BT[k].n,['bld',k])});
 put('Murallas',['bld','wall']);put('Muros',['bld','wall']);put('Puertas',['bld','gate']);put('Torres',['bld','tower']);put('Trampas',['bld','trap']);put('Carreteras',['bld','road']);
 RK.forEach(r=>{if(ICO[r[0]])put(r[1],['res',r[0]])});
 Object.keys(CL).forEach(k=>put(CL[k].n,['unit',k]));
 PF.forEach(pr=>put(pr,['prof',pr]));
 MAP=m}
const bk=t=>{try{return t==='road'||avail(t)||cnt(t)>0}catch(e){return true}};window.guideBldKnown=bk;
const known=t=>{try{return !!(S&&S.zseen&&S.zseen[t])}catch(e){return false}};
function pic(e){const d=document.createElement('div');d.className='gi-pic';if((e[0]==='zom'&&!known(e[1]))||(e[0]==='bld'&&!bk(e[1]))){const q=document.createElement('span');q.className='gi-lockq';q.textContent='?';d.appendChild(q);d.title='Enemigo sin descubrir'}
 if(e[0]==='res'){const im=new Image();im.src=ICO[e[1]];im.alt='';d.appendChild(im)}
 else{const c=document.createElement('canvas');c.dataset.k=e[0];c.dataset.t=e[1];d.appendChild(c)}
 return d}
let SECN='';
function enhance(){if(!MAP)buildMap();const art=document.getElementById('guideArticle');if(!art)return;{const h0=art.querySelector('h3');SECN=h0?h0.textContent.trim():''}
 [...art.querySelectorAll('p')].forEach(p=>{if(p.closest('.gi-card'))return;const bs=[...p.querySelectorAll('b')],hits=[];const seen=new Set();
  bs.forEach((b,i)=>{let e=MAP[norm(b.textContent)];if(Array.isArray(e)&&e[0]==='prof'&&SECN==='Ejército'){const k=Object.keys(CL).find(k=>CL[k].n===e[1]);if(k)e=['unit',k]}if(Array.isArray(e)&&!seen.has(e.join())){seen.add(e.join());hits.push([b,e,i])}});
  if(!hits.length)return;
  /* ¿el párrafo define una sola cosa y empieza por ella? -> tarjeta con imagen a la izquierda */
  const first=bs[0],lead=hits[0][0]===first&&p.textContent.trim().indexOf(first.textContent.trim())<=2;
  if(lead&&hits.length<=2){const sm=p.querySelector('img[width="16"]');if(sm)sm.remove();const card=document.createElement('div');card.className='gi-card';p.parentNode.insertBefore(card,p);card.appendChild(pic(hits[0][1]));card.appendChild(p);hits.shift()}
  if(hits.length){const st=document.createElement('div');st.className='gi-strip';hits.forEach(([b,e])=>{const f=document.createElement('figure');f.appendChild(pic(e));const c=document.createElement('figcaption');c.textContent=(e[0]==='zom'&&!known(e[1]))?'Enemigo desconocido':(e[0]==='bld'&&!bk(e[1]))?'Edificio bloqueado':b.textContent.replace(/[:.]$/,'');f.appendChild(c);st.appendChild(f)});const host=p.closest('.gi-card')||p;host.parentNode.insertBefore(st,host.nextSibling)}});
 /* imágenes propias de cada sección para lo que el texto explica sin nombrarlo en negrita */
 try{const h=art.querySelector('h3'),sec=h?h.textContent.trim():'',list=(SEC[sec]||[]).filter(e=>e[0]==='bld'?BT[e[1]]:e[0]==='zom'?ZT[e[1]]:e[0]==='res'?ICO[e[1]]:e[0]==='unit'?CL[e[1]]:true);
  const have=new Set([...art.querySelectorAll('canvas[data-k]')].map(c=>c.dataset.k+','+c.dataset.t).concat([...art.querySelectorAll('.gi-pic img')].map(i=>'res,'+Object.keys(ICO).find(k=>ICO[k]===i.getAttribute('src')))));
  const add=list.filter(e=>!have.has(e.join()));
  if(add.length&&h){const st=document.createElement('div');st.className='gi-strip';add.forEach(e=>{const f=document.createElement('figure');f.appendChild(pic(e));const c=document.createElement('figcaption');c.textContent=e[0]==='bld'?(bk(e[1])?BT[e[1]].n:'Edificio bloqueado'):e[0]==='zom'?(known(e[1])?ZT[e[1]].n:'Enemigo desconocido'):e[0]==='res'?(RK.find(r=>r[0]===e[1])||[0,e[1]])[1]:e[0]==='unit'?CL[e[1]].n:e[1];f.appendChild(c);st.appendChild(f)});h.parentNode.insertBefore(st,h.nextSibling)}}catch(e){console.error('guia_img sec',e)}
 paintStatic();start()}
const B=k=>['bld',k],R=k=>['res',k],Zt=k=>['zom',k],Un=k=>['unit',k],Pr=k=>['prof',k];
const SEC={'Un día':[Zt('z'),B('tower')],'Construir':[B('hall'),B('house'),B('farm'),B('well'),B('wall'),B('gate'),B('road'),B('trap')],
 'Materiales de construcción':['tarp','stone','plank','sheet','brick','glass','steel','concrete'].map(R).concat(['saw','quarry','sheetw','kiln','glassw','steelw','cement'].map(B)),
 'Pausar edificios':[B('farm'),B('saw')],'Niveles y aspecto de los edificios':[B('hall'),B('house')],'Muros, vallas y puertas':[B('wall'),B('fence'),B('gate'),Zt('t')],
 'Torres y armas':[B('tower'),B('mtower'),B('turret'),B('bunker'),B('work'),R('ammo')],'Restos de vehículos':[R('scrap'),R('comp'),R('metal')],
 'Energía':[B('gen'),B('solar'),B('wind'),R('elec')],'Gasolina':[B('oilp'),B('refin'),R('gas'),B('expo')],'Villa Esperanza':[R('comp'),R('chem'),R('glass'),R('steel'),R('gas')],
 'Supervivientes':PF.map(Pr),'Formación':PF.map(Pr),'Ejército':[B('barr')],'Zombis y defensa':[Zt('z'),Zt('r'),Zt('f'),Zt('s'),B('tower'),B('wall'),B('trap')],
 'Exploración':[B('expo'),Un('expl'),R('gas'),R('food'),R('water')],'Tecnologías':[B('lab'),R('rp')],'Parejas, embarazos y niños':[B('house')],
 'Niveles 11 a 15 y Forja':[R('alloy'),B('forgeb'),B('smithy')],'Atributos y entrenamiento':[B('gym'),B('barr')],
 'Zombis especiales':['u','j','t','q','h','g','a','v'].map(Zt),'Jefes de zona':['U','J','T','G','A','H'].map(Zt),'Bandas humanas':['b','k','p','m','e'].map(Zt),
 'Objetivos de misión y dificultad':[Zt('e'),Zt('G')],'Clima y expediciones':[B('expo'),B('work')],'Misiones':[B('hall')]};
function ctxFor(c){const r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);if(!r.width)return null;if(c.width!==Math.round(r.width*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,r.width,r.height);return [x,r.width,r.height,d]}
function paintBld(c){const q=ctxFor(c);if(!q)return;const [x,W,H]=q,t=c.dataset.t,d=BT[t];if(!d)return;const s=Math.min((W-8)/((d.w+d.h)*32),(H-8)/(d.z+(d.w+d.h)*16));
 x.translate(W/2-(d.w-d.h)*16*s,d.z*s+4+(H-8-(d.z+(d.w+d.h)*16)*s)/2);x.scale(s,s);
 try{if(t==='road')box(x,0,0,1,1,2,'#77736b');else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:1,hp:1},1)}catch(e){}if(!bk(t)){x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#07090a';x.fillRect(0,0,c.width,c.height);x.restore()}c.dataset.done=1}
function paintFig(c,el){const q=ctxFor(c);if(!q)return;const [x,W,H,d]=q,k=c.dataset.k,t=c.dataset.t,sc=H*.8/30;
 x.fillStyle='rgba(0,0,0,.4)';x.beginPath();x.ellipse(W/2,H*.84,W*.3,H*.06,0,0,7);x.fill();
 x.setTransform(d*sc,0,0,d*sc,W/2*d,H*.84*d);const og=window.g,sw=[WPN,EXP,SXF,OLDF,KIDF];window.g=x;
 try{FL=0;SXF=0;OLDF=0;KIDF=0;WPN='';const dx=Math.sin(el*.5)>-.3?1:-1;
  if(k==='unit'){EXP=(el%4)>2.6?'angry':'ok';fig(0,0,'#4a7a3a',1,1,0,1,dx,t,(el%4)>2.6?4:3,0)}
  else{EXP='ok';fig(0,0,PC[t]||'#647d4b',.9,1,0,0,dx,t,0,0)}}catch(e){}finally{window.g=og;WPN=sw[0];EXP=sw[1];SXF=sw[2];OLDF=sw[3];KIDF=sw[4]}}
function paintStatic(){document.querySelectorAll('#guideArticle canvas[data-k="bld"]').forEach(c=>{if(!c.dataset.done)paintBld(c)})}
let raf=0,t0=performance.now();const st=new WeakMap();
function tick(){const gs=document.getElementById('guideScreen');if(!gs||getComputedStyle(gs).display==='none'){raf=0;return}
 const el=(performance.now()-t0)/1000,art=document.getElementById('guideArticle'),ar=art.getBoundingClientRect();
 art.querySelectorAll('canvas[data-k]').forEach(c=>{const k=c.dataset.k;if(k==='bld'){if(!c.dataset.done)paintBld(c);return}const r=c.getBoundingClientRect();if(r.bottom<ar.top-40||r.top>ar.bottom+40)return;
  if(k==='zom'){let s=st.get(c);if(!s){s={};st.set(c,s)}if(!window.enemyPaint)return;if(known(c.dataset.t))enemyPaint(c,c.dataset.t,el,s);else if(!c.dataset.sil){enemyPaint(c,c.dataset.t,1,s);/* silueta: se tapa el dibujo con negro */const x=c.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#07090a';x.fillRect(0,0,c.width,c.height);x.restore();c.dataset.sil=1}}else paintFig(c,el)});
 raf=requestAnimationFrame(tick)}
function start(){if(!raf)raf=requestAnimationFrame(tick)}
/* Bestiario: una ficha por enemigo; los que aún no has encontrado salen como silueta */
const GROUPS=[['Infectados',['z','r','f','s']],['Infectados especiales',['u','j','t','q','h','g','a','v','x','w','i','l']],['Humanos hostiles',['b','k','p','m','e']],['Jefes',['U','J','T','G','A','H']]];
function bestiary(){const I=window.enemyInfo||{};const bar=(v,mx)=>'<em><u style="width:'+Math.max(8,Math.min(100,Math.round(v/mx*100)))+'%"></u></em>';
 const all=GROUPS.reduce((a,g)=>a.concat(g[1]),[]).filter(t=>ZT[t]),n=all.filter(known).length;
 let h='<p>Aquí se guarda una ficha de cada enemigo. Los que todavía no has encontrado aparecen como una <b>silueta</b>: se desbloquean la primera vez que los ves, en una horda o en una misión. Descubiertos: <b>'+n+' de '+all.length+'</b>.</p>';
 GROUPS.forEach(([gn,ts])=>{ts=ts.filter(t=>ZT[t]);if(!ts.length)return;h+='<h4 class="gi-h">'+gn+'</h4>';ts.forEach(t=>{const zt=ZT[t],i=I[t]||['Enemigo','',''],boss=!!zt.boss;
  if(known(t))h+='<div class="gi-best'+(boss?' boss':'')+'"><div class="gi-pic"><canvas data-k="zom" data-t="'+t+'"></canvas></div><div class="bt"><span class="tag">'+i[0]+'</span><h4>'+zt.n+'</h4><p>'+i[1]+'</p><div class="st"><span>Vida</span>'+bar(Math.sqrt(zt.hp),Math.sqrt(boss?1800:340))+'<span>Velocidad</span>'+bar(zt.sp,1.55)+'<span>Daño</span>'+bar(zt.d,boss?34:24)+'</div><div class="tip"><b>Consejo:</b> '+i[2]+'</div></div></div>';
  else h+='<div class="gi-best lock"><div class="gi-pic" title="Enemigo sin descubrir"><span class="gi-lockq">?</span><canvas data-k="zom" data-t="'+t+'"></canvas></div><div class="bt"><span class="tag">Bloqueado</span><h4>???</h4><p>Aún no has encontrado a este enemigo. Su ficha se desbloqueará cuando lo veas por primera vez.</p></div></div>'})});
 return h}
(function(){const i=GD.findIndex(g=>g[0]==='Zombis y defensa');GD.splice(i>=0?i+1:GD.length,0,['Bestiario',bestiary])})();
function hideB(){const art=document.getElementById('guideArticle');if(!art)return;const L=Object.keys(BT).filter(k=>!bk(k)).map(k=>BT[k].n).filter(n=>n&&n.length>2).sort((a,b)=>b.length-a.length);if(!L.length)return;
 const esc=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp('(^|[^\\p{L}])('+L.map(esc).join('|')+')(?![\\p{L}])','giu');
 const w=document.createTreeWalker(art,NodeFilter.SHOW_TEXT);let n;const A=[];while(n=w.nextNode())A.push(n);A.forEach(t=>{if(t.parentNode.closest('figcaption'))return;const v=t.nodeValue.replace(re,'$1???');if(v!==t.nodeValue)t.nodeValue=v})}
const og=window.guide;window.guide=function(){const r=og.apply(this,arguments);try{enhance();hideB()}catch(e){console.error('guia_img',e)}return r};
try{guide=window.guide}catch(e){}
})();
