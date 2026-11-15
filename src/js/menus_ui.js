/* Menús rediseñados: Ejército, Partida, Operaciones+, Edificios, Mejoras y Configuración */
(function(){
const f1=n=>(Math.round(n*10)/10).toString().replace('.',',');
const esc=s=>String(s).replace(/[<>&]/g,'');
const ck=cost=>Object.keys(cost).filter(k=>cost[k]).map(k=>{const ok=(S.res[k]||0)>=cost[k];return `<span class="mu-k ${ok?'':'no'}"><img src="${ICO[k]||''}" width=13>${cost[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('');
const miss=cost=>Object.keys(cost).filter(k=>cost[k]&&(S.res[k]||0)<cost[k]).map(k=>((RK.find(r=>r[0]===k)||[0,k])[1]).toLowerCase());
const bar=(p,c)=>`<div class="mu-bar"><i style="width:${Math.max(0,Math.min(100,p))}%;background:${c}"></i></div>`;
const hpc=p=>p>60?'#5c5':p>30?'#dc4':'#d44';
const stat=(ic,v,l)=>`<div class="mu-st"><span>${ic}</span><b>${v}</b><small>${l}</small></div>`;
const tile=(ic,t,s,fn,cls)=>`<button class="mu-t ${cls||''}" onclick="${fn}"><span class="mu-ti">${ic}</span><span class="mu-tt"><b>${t}</b><small>${s}</small></span></button>`;
const done=()=>{try{paintCards()}catch(e){}};

/* ---------- EJÉRCITO ---------- */
window.armyMenu=function(){
  const a=S.ppl.filter(p=>p.arm),cap=window.acap?acap():a.length,hp=a.length?Math.round(a.reduce((s,p)=>s+p.hp/mhp(p)*100,0)/a.length):0;
  const head=`<div class="mu-sts">${stat('🛡',a.length+'/'+cap,'Unidades')}${stat('⚔',armyPow(),'Poder total')}${stat('♥',hp+'%','Salud media')}</div>`;
  const cards=a.map(p=>{const pc=p.hp/mhp(p)*100,cl=CL[p.arm];return `<div class="mu-c" onclick="pSheet(${p.id})"><canvas class="pf" data-id="${p.id}" width="120" height="126"></canvas><div class="mu-ci"><b>${esc(p.n)}</b><span class="mu-tag">${cl.n}</span><small>Nivel ${p.lvl} · ⚔ ${upow(p)}</small>${bar(pc,hpc(pc))}<small>♥ ${Math.round(p.hp)}/${mhp(p)}</small></div></div>`}).join('');
  show('Ejército',head+(cards?`<div class="mu-grid">${cards}</div>`:`<div class="mu-empty"><span>🛡</span><b>Aún no hay unidades</b><small>Abre la ficha de un superviviente y enrólalo para formar tu ejército.</small>${tile('👥','Ver supervivientes','Elige a quién enrolar','pplMenu()')}</div>`));done()};

/* ---------- PARTIDA ---------- */
window.menu=function(){
  const M={facil:'Fácil',normal:'Normal',dificil:'Difícil',apocaliptico:'Apocalíptico'};
  show('Partida',`<div class="mu-sts">${stat('🎮',M[S.mode||'normal']||S.mode,'Modo')}${stat('📅','Día '+S.day,'Progreso')}${stat('💾','Auto','Guardado')}</div><div class="mu-tiles">`+
   tile('💾','Guardar partida','Guarda ahora mismo','save();bkRotate(KEY,0,1);toast("Partida guardada.")')+
   tile('📤','Exportar partida','Descarga un archivo de respaldo','exportSlotKey(KEY)')+
   tile('📥','Cargar partida','Vuelve al último guardado','if(load()){LIVE=true;toast("Partida cargada.");hide()}else toast("No hay partida guardada.")')+
   tile(SND?'🔊':'🔇','Sonido y vibración',SND?'Activados':'Desactivados','togSnd()')+
   tile('⚙','Configuración','Música, volumen y pantalla','settingsMenu()')+
   tile('📖','Guía completa','Todo explicado','guide(0)')+
   tile('🏠','Volver al inicio','Pantalla de título','titleMenu()')+
   tile('➕','Nueva partida','Empieza desde cero','showModeSelect()','mu-danger')+`</div>`)};

/* el juego se detiene mientras está abierto el menú de partida (o su configuración) */
window._menuPause=false;
(function(){const o=window.upd;if(typeof o!=='function')return;window.upd=function(){if(window._menuPause)return;return o.apply(this,arguments)}})();
{const om=window.menu;window.menu=function(){window._menuPause=true;const r=om.apply(this,arguments);try{const t=document.querySelector('#pan .ptitle,#pan h2,#pan .panel-title');const b=document.querySelector('#pan .panel-body')||document.getElementById('pan');if(b&&!b.querySelector('.mp-pause')){const d=document.createElement('div');d.className='mp-pause';d.style.cssText='text-align:center;color:#ffd877;font-weight:800;letter-spacing:2px;font-size:12px;margin:-2px 0 6px';d.textContent='⏸ JUEGO EN PAUSA';b.insertBefore(d,b.firstChild)}}catch(e){}return r}}
setInterval(()=>{if(!window._menuPause)return;const p=document.getElementById('pan');if(!p||p.style.display==='none'||getComputedStyle(p).display==='none')window._menuPause=false},250);
/* ---------- CONFIGURACIÓN ---------- */
window.settingsMenu=function(){window._menuPause=true;
  show('Configuración',`<div class="mu-tiles">`+
   tile(SND?'🔊':'🔇','Efectos y vibración',SND?'Activados':'Desactivados','togSnd()')+
   tile(MUSIC?'🎵':'🔕','Música de fondo',MUSIC?'Activada':'Desactivada','setMusic(!MUSIC);settingsMenu()')+`</div>
   <div class="mu-sl"><span>🎵 Volumen de música</span><input type="range" min="0" max="1" step=".05" value="${musicVol}" oninput="setMusicVol(this.value)"></div>
   <div class="mu-sl"><span>🔊 Volumen de efectos</span><input type="range" min="0" max="1" step=".05" value="${sfxVol}" oninput="setSfxVol(this.value)"></div>
   <div class="mu-tiles">`+tile('⛶','Pantalla completa','Ocupa toda la pantalla',"if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})")+tile('↩','Volver','Menú de partida','menu()')+`</div>`)};

/* ---------- OPERACIONES+ ---------- */
window.advMenu=function(){
  advInit();const w=S.adv.weather||0,ico=['☀️','🌧','🌫','⛈'][w]||'☀️',cl=(S.adv.clues||[]);
  show('Operaciones',`<div class="mu-wx"><span>${ico}</span><div><b>${advWeatherName()}</b><small>${ADV_WEATHER[w][1]}</small></div></div>
   <div class="mu-sts">${stat('📢',S.adv.events||0,'Sucesos')}${stat('🔎',cl.length+'/4','Pistas')}</div>
   <div class="mu-tiles">${tile('🗺','Lugares especiales','Expediciones cortas con botín','advLandmarksMenu()')}</div>
   <div class="mu-h">Historia recuperada</div>${cl.length?`<div class="mu-chips">${cl.map(c=>`<span class="mu-ch">🔎 ${esc(c)}</span>`).join('')}</div>`:'<small class="mu-mut">Aún no hay pistas. Explora lugares especiales para descubrir el origen del brote.</small>'}`)};

/* ---------- EDIFICIOS ---------- */
window.bldList=function(){
  const l=S.bld.filter(b=>b.type!='road'&&b.type!='bridge'),walls=l.filter(b=>b.type==='wall'),rest=l.filter(b=>b.type!=='wall');
  const off=l.filter(b=>b.off||b.pause).length;
  const row=b=>{const p=b.hp/mxhp(b)*100,st=b.pause?'<span class="mu-s w">⏸ Parado</span>':b.off?'<span class="mu-s w">⚡ Sin energía</span>':'';
    return `<div class="mu-r" onclick="centerOn(${b.x+b.w/2},${b.y+b.h/2});bPanel(${b.id})"><div class="mu-rn"><b>${BT[b.type].n}</b>${st}</div><span class="mu-lv">Nv ${b.lvl}</span>${bar(p,hpc(p))}</div>`};
  let h=`<div class="mu-sts">${stat('🏠',l.length,'Edificios')}${stat('🧱',walls.length,'Muros')}${stat('⏸',off,'Parados / sin energía')}</div><div class="mu-list">`+
   rest.sort((a,b)=>BT[a.type].n.localeCompare(BT[b.type].n)||b.lvl-a.lvl).map(row).join('');
  if(walls.length){const lv=[...new Set(walls.map(w=>w.lvl))].sort(),avg=walls.reduce((s,w)=>s+w.hp/mxhp(w)*100,0)/walls.length;
    h+=`<div class="mu-r" onclick="centerOn(${walls[0].x},${walls[0].y});bPanel(${walls[0].id})"><div class="mu-rn"><b>Muros ×${walls.length}</b></div><span class="mu-lv">Nv ${lv.join(', ')}</span>${bar(avg,hpc(avg))}</div>`}
  show('Edificios',h+'</div>')};

/* ---------- MEJORAS ---------- */
window.upgMenu=function(){
  const hl=hallLv(),rows=[];
  S.bld.filter(b=>b.type==='hall').forEach(b=>{if(b.lvl>=25)return;const L=b.lvl,cost=costOf(hallCost(L),1),n=S.bld.filter(x=>x!==b&&!['wall','road','gate','trap','bridge'].includes(x.type)&&x.lvl>=Math.min(L+1,15)).length,m=miss(cost);
    const why=n<hallNB(L)?'Necesitas '+hallNB(L)+' edificios al nivel '+Math.min(L+1,15)+' (tienes '+n+')':m.length?'Faltan: '+m.join(', '):'';
    rows.push({n:'Ayuntamiento',a:L,b:L+1,cost,why,id:b.id,ok:!why,hall:1})});
  const seen={};
  S.bld.filter(b=>!['road','bridge','wall','gate','trap','hall'].includes(b.type)&&b.lvl<15).forEach(b=>{
    const cost=window.ucost?ucost(b):costOf(BT[b.type].cost,b.lvl+1),g=window.ugate?ugate(b):'',m=miss(cost);
    let why='';if(b.lvl>=hl+1)why='Mejora antes el ayuntamiento';else if(g)why=g;else if(m.length)why='Faltan: '+m.join(', ');
    rows.push({n:BT[b.type].n,a:b.lvl,b:b.lvl+1,cost,why,id:b.id,ok:!why,town:b.lvl>=hl+1})});
  const ok=rows.filter(r=>r.ok),pend=rows.filter(r=>!r.ok&&!r.town),lock=rows.filter(r=>r.town);
  const card=r=>`<div class="mu-u ${r.ok?'go':''}"><div class="mu-un"><b>${r.n}</b><span class="mu-lv">Nv ${r.a} → <i>${r.b}</i></span></div><div class="mu-uk">${ck(r.cost)||'<small>Sin coste</small>'}</div>${r.ok?`<button class="mu-ub" onclick="upg(${r.id});upgMenu()">⬆ Mejorar</button>`:`<div class="mu-uw">${r.why}</div>`}</div>`;
  const sec=(t,a)=>a.length?`<div class="mu-h">${t} <small>${a.length}</small></div><div class="mu-grid2">${a.map(card).join('')}</div>`:'';
  show('Mejoras',`<div class="mu-sts">${stat('✅',ok.length,'Listas')}${stat('⏳',pend.length,'Faltan recursos')}${stat('🔒',lock.length,'Esperan al ayuntamiento')}</div>`+
   (rows.length?sec('Listas para mejorar',ok)+sec('Faltan recursos o estudios',pend)+(lock.length?`<div class="mu-h">Bloqueadas por el ayuntamiento <small>${lock.length}</small></div><small class="mu-mut">Sube el ayuntamiento al nivel ${hl+1} para mejorarlas: ${[...new Set(lock.map(r=>r.n))].join(', ')}.</small>`:''):'<div class="mu-empty"><span>🏆</span><b>Todo al máximo</b></div>')+
   (S.bld.some(b=>b.type==='wall'&&b.lvl<5)?`<div class="mu-h">Muros</div><small class="mu-mut">Toca un muro en el mapa para mejorarlo por tramos o todos a la vez.</small>`:''))};

/* ---------- ESTILOS ---------- */
const st=document.createElement('style');st.textContent=`
.mu-sts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:2px 0 10px}
.mu-st{background:linear-gradient(#1b2418,#131a12);border:1px solid #3a4a30;border-radius:10px;padding:4px;display:flex;flex-direction:column;align-items:center;gap:0;text-align:center;line-height:1.15}
.mu-st span{font-size:14px}.mu-st b{font-size:15px;color:#ffd877}.mu-st small{font-size:11px;opacity:.65}
.mu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.mu-grid2{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}
.mu-c{display:flex;gap:10px;align-items:center;background:#161d15;border:1px solid #34432c;border-radius:12px;padding:8px;cursor:pointer}
.mu-c:active{background:#1f2a1b}.mu-c canvas{width:60px;height:63px;border-radius:8px;background:#0d120c;flex:none}
.mu-ci{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.mu-ci b{font-size:14px;color:#ffe9a8}.mu-ci small{font-size:11.5px;opacity:.75}
.mu-tag{align-self:flex-start;font-size:10.5px;letter-spacing:.04em;text-transform:uppercase;background:#2a3a24;border:1px solid #4a6a3a;border-radius:8px;padding:1px 7px;color:#bfe8a8}
.mu-bar{height:6px;background:#0d120c;border-radius:4px;overflow:hidden}.mu-bar i{display:block;height:100%;border-radius:4px}
.mu-empty{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:16px 8px}.mu-empty>span{font-size:34px}.mu-empty small{opacity:.7;max-width:320px}
.mu-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin:6px 0}
.mu-t{display:flex;align-items:center;gap:10px;text-align:left;padding:10px 12px;border-radius:12px;background:linear-gradient(#222c1e,#182016);border:1px solid #3a4a30;color:#e8efdc}
.mu-t:active{background:#2c3a26}.mu-ti{font-size:22px;flex:none;width:30px;text-align:center}.mu-tt{display:flex;flex-direction:column;gap:1px;min-width:0}.mu-tt b{font-size:14px}.mu-tt small{font-size:11.5px;opacity:.65;font-weight:400;text-transform:none;letter-spacing:0}
.mu-t.mu-danger{border-color:#6a3a3a;background:linear-gradient(#2c1c1c,#1c1212)}.mu-t.mu-danger b{color:#ff9a8a}
.mu-sl{display:flex;flex-direction:column;gap:4px;margin:8px 2px;font-size:13px}.mu-sl input{width:100%;accent-color:#f2c542}
.mu-wx{display:flex;gap:12px;align-items:center;background:linear-gradient(#1c2a34,#131c22);border:1px solid #34505e;border-radius:12px;padding:10px 12px;margin-bottom:8px}.mu-wx>span{font-size:34px}.mu-wx b{font-size:16px;color:#bfe3f5;display:block}.mu-wx small{opacity:.75;font-size:12.5px}
.mu-h{margin:12px 2px 6px;font-weight:800;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#f2c542}.mu-h small{opacity:.6;font-weight:600;margin-left:4px}
.mu-mut{opacity:.65;display:block;margin:2px}
.mu-chips{display:flex;flex-wrap:wrap;gap:6px}.mu-ch{background:#241f12;border:1px solid #6a5a1a;border-radius:12px;padding:3px 10px;font-size:12.5px;color:#ffe9a8}
.mu-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px}
.mu-r{background:#161d15;border:1px solid #34432c;border-radius:10px;padding:8px 10px;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:5px 8px;align-items:center}.mu-r:active{background:#1f2a1b}.mu-r .mu-bar{grid-column:1/3}
.mu-rn{display:flex;flex-direction:column;gap:2px;min-width:0}.mu-rn b{font-size:13.5px}
.mu-lv{font-size:12px;color:#ffd877;background:#241f12;border:1px solid #5a4a1a;border-radius:9px;padding:1px 8px;white-space:nowrap}.mu-lv i{font-style:normal;font-weight:800}
.mu-s{font-size:11px}.mu-s.w{color:#ff9a8a}
.mu-u{background:#161d15;border:1px solid #34432c;border-radius:12px;padding:9px;display:flex;flex-direction:column;gap:7px}.mu-u.go{border-color:#6a5a1a;background:linear-gradient(#1c2418,#141a14)}
.mu-un{display:flex;justify-content:space-between;align-items:center;gap:6px}.mu-un b{font-size:14px}
.mu-uk{display:flex;flex-wrap:wrap;gap:5px}.mu-k{display:inline-flex;align-items:center;gap:4px;background:#101619;border:1px solid #2f5a36;border-radius:11px;padding:1px 8px;font-size:12.5px;color:#cfeccf}.mu-k small{opacity:.5;font-size:10px}.mu-k.no{border-color:#7a3a3a;color:#ffb3a8}
.mu-ub{padding:8px;font-weight:800;background:linear-gradient(#f2c542,#c8921a);color:#1c1405;border:0;border-radius:9px}
.mu-uw{font-size:12px;color:#ff9a8a;text-align:center}
`;document.head.appendChild(st);
})();
