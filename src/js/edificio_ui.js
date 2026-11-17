/* Panel de edificio rediseñado: cabecera con estado, trabajadores como fichas de superviviente, acciones agrupadas. */
(function(){
'use strict';
try{const st=document.createElement('style');st.textContent='.pc .tg.tgl{right:auto!important;left:3px!important;color:#ffd877!important;border-color:#e0a124!important}.asgl .pc .tg{font-size:7.5px!important;padding:0 3px!important;letter-spacing:0!important;line-height:12px!important}.asgl .pc .tg.tgl{font-size:9px!important}';document.head.appendChild(st)}catch(e){}
const oB=window.bPanel,realShow=()=>window.show;
const strip=(h,re)=>h.replace(re,'');
const bar=(v,c)=>`<div class="bbar"><i style="width:${Math.max(0,Math.min(100,v))}%;background:${c}"></i></div>`;
window.asgList=function(id){const b=bm[id];if(!b)return;const d=BT[b.type];
  /* en las torres (puestos de tirador) también salen los alistados: antes no se podía poner a un soldado en una torre */const L=S.ppl.filter(p=>(!p.arm||d.gun)&&p.age>=18&&!p.away&&p.job!=id).map(p=>({p,k:skFor(p,d)||0})).sort((a,c)=>c.k-a.k||(a.p.job?1:0)-(c.p.job?1:0));
  const h=`<p class="bsub">Elige a quién asignar a <b>${d.n}</b>. Los de tu rol ideal (${(d.job||[]).join(', ')||'cualquiera'}) trabajan mejor. Las ★ indican lo bien que encaja cada uno, aunque ahora esté ocupado: si tocas a alguien ocupado, se cambia a este puesto${d.tr?' · aquí se formarán y no podrán trabajar en otro sitio':''}.</p>`+
   (L.length?`<div class="pg sm asgl">${L.map(({p,k})=>(()=>{const jb=p.job&&bm[p.job]?BT[bm[p.job].type].n:'';let h=pcard(p,`asg(${p.id},${id})`,'',p.job?'ocupado':'');if(k>0)h=h.replace('<span class="tg">','<span class="tg tgl">★'+k+'</span><span class="tg">');if(jb)h=h.replace(/<\/div>$/,`<small style="color:#d9a441">Ocupado en: ${jb}</small></div>`);return h})()).join('')}</div>`:'<p>No hay supervivientes libres.</p>')+`<div class="bact">${btn('← Volver',`bPanel(${id})`)}</div>`;
  window.show(d.n,h);paintCards()};
window.bPanel=function(id){const b=bm[id];if(!b)return;
  const real=window.show;let cap=null;window.show=function(t,h){cap=[t,h]};
  try{oB.apply(this,arguments)}finally{window.show=real}
  if(!cap)return;let [t,h]=cap;const d=BT[b.type],sl=slots(b),wks=wk(b),isHall=b.type==='hall';
  try{
   /* extraer botón de mejora antes de limpiar */
   const um=h.match(/<button (disabled )?onclick="upg\(\d+\)">([\s\S]*?)<\/button>/),upDis=um&&um[1],upTxt=um?(um[2].match(/\(([^)]*)\)/)||[])[1]:'';
   h=h.replace(/^<p>Nivel[\s\S]*?<\/p><p>[\s\S]*?<\/p>/,'');
   if(b.type==='wall'||b.type==='gate')h=h.replace(/^<p>[^<]*Nivel \d+ · \d+x\d+ · Vida[\s\S]*?<\/p><p>[\s\S]*?<\/p>/,'');
   h=strip(h,/<p>Producción diaria:[\s\S]*?<\/p>/);
   h=strip(h,/<p>(Trabajadores|Alumnos)[\s\S]*?<\/p>/);
   h=strip(h,/<button[^>]*onclick="(unjob|asgList)\([^"]*"[^>]*>[\s\S]*?<\/button>/g);
   h=strip(h,/<button[^>]*onclick="asgList\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
   if(isHall)h=strip(h,/<button[^>]*onclick="upg\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
   if(!isHall)h=strip(h,/<button[^>]*onclick="(upg|moveB|destroy|repair)\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
   h=h.replace(/Entrenar al ejército \([^)]*\)/,'Entrenar al ejército');
   const hpP=b.hp/mxhp(b)*100,isWall=b.type==='wall'||b.type==='gate',MXL=isWall?5:15,f1=n=>(Math.round(n*10)/10).toString().replace('.',',');
   const stageOf=l=>isWall||isHall?'':(l<=2?'Campamento':l<=4?'Chabola':'Diseño completo');
   const wn=isWall?(b.type==='wall'?(window.WALLN||[])[Math.min(4,b.lvl-1)]:['Puerta de malla','Puerta de madera','Puerta de acero y piedra','Puerta de acero y ladrillo','Puerta blindada'][Math.min(4,b.lvl-1)]):'';
   const pips=Array.from({length:MXL},(_,i)=>`<i class="${i<b.lvl?'on':i===b.lvl?'nx':''}"></i>`).join('');
   let head=`<div class="bp2h"><canvas class="bp2s" id="bp2s" width="150" height="130"></canvas><div class="bp2i"><div class="bp2n">${wn||d.n}</div><div class="bp2l">Nivel ${b.lvl}<small> / ${isHall?25:MXL}</small>${stageOf(b.lvl)?'<span class="bp2st">'+stageOf(b.lvl)+'</span>':''}</div><div class="bp2p">${isHall?'':pips}</div><div class="bp2hp"><span>♥ ${Math.ceil(b.hp)}/${mxhp(b)}</span>${bar(hpP,hpP>60?'#5c5':hpP>30?'#dc4':'#d44')}${b.hp<mxhp(b)?`<button class="bp2r" onclick="repair(${id})">🔧 Reparar: ${window.repairCost?cs(repairCost(b)):'5 madera'}</button>`:''}</div></div></div>`;
   /* chips de estado */
   const o=d.p?out(b,1):null,eu=window.pwUse?pwUse(b):0,hasE=window.pwBase&&pwBase(b.type)>0,canPause=hasE||b.type==='gen';
   let chips='';
   if(b.pause)chips+='<span class="bp2c w">⏸ Parado</span>';else if(b.off)chips+='<span class="bp2c w">⚡ Sin energía</span>';else if(d.p||hasE)chips+='<span class="bp2c ok">▶ En marcha</span>';
   if(d.p){const src=b.off?(()=>{const so=b.off;b.off=0;const r=out(b);b.off=so;return r})():(o||{});chips+=Object.keys(src).filter(k=>k!=='elec').map(k=>`<span class="bp2c"><img src="${ICO[k]||''}" width=13> +${src[k].toFixed(1)}<small>/día</small></span>`).join('');if(b.type==='gen'||b.type==='solar'||b.type==='wind')chips+=`<span class="bp2c e">⚡ +${f1(src.elec||0)} capacidad</span>`}
   if(hasE)chips+=`<span class="bp2c e">⚡ ${eu>0?'consume '+f1(eu):'no consume (campamento)'}</span>`;
   head+=`<div class="bp2c-row">${chips}</div><p class="bsub">${d.f}</p>`;
   let work='';
   if(sl){const free=Math.max(0,sl-wks.length),tr=!!d.tr;
     work=`<div class="bsec">${tr?'Alumnos':'Trabajadores'} <b>${wks.length}/${sl}</b>${d.job&&d.job.length?`<small> · ideal: ${d.job.join(', ')}</small>`:''}</div><div class="bwg">`+
      wks.map(p=>`<div class="bwc" onclick="pSheet(${p.id})"><canvas class="pf" data-id="${p.id}" width="120" height="126"></canvas><div class="bwi"><b>${p.n}</b><small>${p.prof} · niv ${p.lvl} ${pTags(p)}</small></div><button class="bx" onclick="event.stopPropagation();unjob(${p.id},${id})">${tr?'Sacar':'Quitar'}</button></div>`).join('')+
      Array.from({length:Math.min(free,2)},()=>`<div class="bwc bempty" onclick="asgList(${id})"><div class="bplus">+</div><small>Asignar</small></div>`).join('')+
      (free>2?`<small class="bsub">+${free-2} plazas libres</small>`:'')+`</div>`}
   /* tarjeta de mejora con comparación nivel actual → siguiente */
   let upc='';
   const maxHall=isHall?25:Math.min(MXL,hallLv()+1);
   if(isHall){
     if(b.lvl>=(isHall?25:MXL))upc=`<div class="bp2u max">★ Nivel máximo alcanzado</div>`;
     else{const L=b.lvl,cost=costOf(hallCost(L),1),n=S.bld.filter(x=>x!==b&&!['wall','road','gate','trap','bridge'].includes(x.type)&&x.lvl>=Math.min(L+1,15)).length;
       const chipsC=Object.keys(cost).filter(k=>cost[k]).map(k=>{const ok=(S.res[k]||0)>=cost[k];return `<span class="bp2k ${ok?'':'no'}"><img src="${ICO[k]||''}" width=13>${cost[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('');
       const miss=Object.keys(cost).filter(k=>cost[k]&&(S.res[k]||0)<cost[k]).map(k=>((RK.find(r=>r[0]===k)||[0,k])[1]).toLowerCase());
       const nb=b.lvl+1;let why='';if(n<hallNB(L))why='Necesitas '+hallNB(L)+' edificios al nivel '+nb+' (tienes '+n+').'+(window.lvTip?lvTip(nb,hallNB(L)-n,b):'')+(miss.length&&window.resTips?resTips(cost):'');else if(miss.length)why='Faltan: '+miss.join(', ')+'.'+(window.resTips?resTips(cost):'');
       const old=b.lvl;b.lvl=nb;const hp1=mxhp(b);b.lvl=old;
       upc=`<div class="bp2u"><div class="bp2ut">⬆ Mejorar a nivel ${nb}</div><div class="bp2d"><span>♥ Vida</span><span><s>${mxhp(b)}</s> → <b>${hp1}</b></span></div><div class="bp2d"><span>🏗 Edificios nivel ${nb}</span><span><b style="color:${n>=hallNB(L)?'#8e8':'#f88'}">${Math.min(n,hallNB(L))}/${hallNB(L)}</b></span></div><div class="bp2d"><span>🔓 Desbloquea</span><span><b>nuevos edificios y nivel máx. ${Math.min(10,nb+1)}</b></span></div><div class="bp2ck">${chipsC||'<small>Sin coste</small>'}</div><button class="bp2b" ${why?'disabled':''} onclick="upg(${id})">⬆ Mejorar</button>${why?`<div class="bp2w">${why}</div>`:''}</div>`}
   }
   if(b.type==='wall'){
     h=strip(h,/<button[^>]*onclick="upgWalls\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
     if(b.lvl>=5)upc=`<div class="bp2u max">★ Nivel máximo alcanzado</div>`;
     else{const sc=window.wScope||'one',I=wInfo(b,sc),sel=k=>sc===k?' on':'';
       const all=wInfo(b,'all'),seg=wInfo(b,'seg');
       const chipsC=Object.keys(I.cost).filter(k=>I.cost[k]).map(k=>{const ok=(S.res[k]||0)>=I.cost[k];return `<span class="bp2k ${ok?'':'no'}"><img src="${ICO[k]||''}" width=13>${I.cost[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('');
       upc=`<div class="bp2u"><div class="bp2ut">⬆ Mejorar muros a nivel ${b.lvl+1}</div><div class="bp2sc"><button class="${sel('one').trim()}" onclick="wScopeSet(${id},'one')">Este muro<small>1</small></button><button class="${sel('seg').trim()}" onclick="wScopeSet(${id},'seg')">Tramo conectado<small>${seg.n}</small></button><button class="${sel('all').trim()}" onclick="wScopeSet(${id},'all')">Todos nivel ${b.lvl}<small>${all.n}</small></button></div><div class="bp2d"><span>♥ Vida por muro</span><span><s>${mxhp(b)}</s> → <b>${I.hp1}</b></span></div><div class="bp2d"><span>🧱 Muros a mejorar</span><span><b>${I.n}</b></span></div><div class="bp2ck">${chipsC||'<small>Sin coste</small>'}</div><button class="bp2b" ${I.why?'disabled':''} onclick="wUpg(${id})">⬆ Mejorar ${I.n>1?I.n+' muros':'muro'}</button>${I.why?`<div class="bp2w">${I.why}</div>`:''}</div>`}
   }else if(!isHall){
     if(b.lvl>=MXL)upc=`<div class="bp2u max">★ Nivel máximo alcanzado</div>`;
     else{
       const nx=b.lvl+1,cost=window.ucost?ucost(b):costOf(d.cost,nx),gate=window.ugate?ugate(b):'';
       const prev=()=>{const L0=b.lvl,O0=b.off;b.lvl=nx;b.off=0;let r={sl:slots(b),p:d.p?out(b):null,hp:mxhp(b)};b.lvl=L0;b.off=O0;return r};
       const A={sl:slots(b),p:d.p?(()=>{const so=b.off;b.off=0;const r=out(b);b.off=so;return r})():null,hp:mxhp(b)},B=prev();
       const rows=[];
       if(A.p)Object.keys(B.p).filter(k=>k!=='elec'||true).forEach(k=>{rows.push([k==='elec'?'⚡ Capacidad':`<img src="${ICO[k]||''}" width=12> Producción`,'+'+f1(A.p[k]||0),'+'+f1(B.p[k]),k==='elec'?'':'/día'])});
       rows.push(['♥ Vida',A.hp,B.hp,'']);
       if(A.sl!==B.sl)rows.push(['👥 Plazas',A.sl,B.sl,'']);
       if(hasE){const e0=pwUse(b),e1=pwUse(b,nx);if(e0!==e1)rows.push(['⚡ Energía',f1(e0),f1(e1),' (consumo)'])}
       if(stageOf(b.lvl)!==stageOf(nx)&&stageOf(nx))rows.push(['🎨 Aspecto',stageOf(b.lvl),stageOf(nx),'']);
       const chipsC=Object.keys(cost).filter(k=>cost[k]).map(k=>{const ok=(S.res[k]||0)>=cost[k];return `<span class="bp2k ${ok?'':'no'}"><img src="${ICO[k]||''}" width=13>${cost[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('');
       const miss=Object.keys(cost).filter(k=>cost[k]&&(S.res[k]||0)<cost[k]).map(k=>((RK.find(r=>r[0]===k)||[0,k])[1]).toLowerCase());
       let why='';if(b.lvl>=maxHall)why='Mejora antes el ayuntamiento (nivel '+(hallLv()+1)+').';else if(gate)why=gate;else if(miss.length)why='Faltan: '+miss.join(', ')+'.'+(window.resTips?resTips(cost):'');
       upc=`<div class="bp2u"><div class="bp2ut">⬆ Mejorar a nivel ${nx}</div>${rows.map(r=>`<div class="bp2d"><span>${r[0]}</span><span><s>${r[1]}</s> → <b>${r[2]}</b><small>${r[3]}</small></span></div>`).join('')}<div class="bp2ck">${chipsC||'<small>Sin coste</small>'}</div><button class="bp2b" ${why?'disabled':''} onclick="upg(${id})">⬆ Mejorar</button>${why?`<div class="bp2w">${why}</div>`:''}</div>`}
   }
   /* acciones secundarias */
   let act=`<div class="bp2a">`;
   if(canPause)act+=`<button onclick="togB(${id})">${b.pause?'▶ Encender':'⏸ Pausar'}</button>`;
   if(PAL[b.type])act+=`<button onclick="aspMenu(${id})">🎨 Aspecto</button>`;
   act+=`<button onclick="moveB(${id})">✥ Mover</button>`;
   if(isHall){const nd=S.bld.filter(x=>x.hp<mxhp(x)-.5).length;act+=`<button onclick="repMenu()">🔧 Reparaciones<small> ${nd?nd+' dañadas':'todo en orden'}</small></button>`}
   if(!isHall)act+=`<button class="del" id="bp2d" onclick="bp2Del(${id})">🗑 Destruir</button>`;
   act+=`</div>`;
   h=strip(h,/<p>⚡ Energía:[\s\S]*?<\/p>/);h=strip(h,/<p>Estado:[\s\S]*?<\/p>/);
   h=strip(h,/<button[^>]*onclick="(togB|aspMenu)\([^"]*"[^>]*>[\s\S]*?<\/button>/g);
   h=strip(h,/<button[^>]*onclick="repair\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
   if(isHall)h=strip(h,/<button[^>]*onclick="moveB\(\d+\)"[^>]*>[\s\S]*?<\/button>/g);
   h=`<div class="bp2g"><div>${head}${act}</div>${upc}</div>`+(h.trim()?`<div class="bsp">${h}</div>`:'')+work}catch(e){console.error('bPanel ui',e);h=cap[1]}
  window.show(t,h);paintCards();try{bp2Sprite(b)}catch(e){}};

window.wScope='one';
window.wScopeSet=(id,k)=>{window.wScope=k;bPanel(id)};
function wList(b,sc){const L=b.lvl,W=S.bld.filter(x=>x.type==='wall'||x.type==='gate');
  if(sc==='one')return [b];
  if(sc==='all')return W.filter(x=>x.type==='wall'&&x.lvl===L);
  const key=(x,y)=>x+','+y,M={};W.forEach(w=>{for(let i=0;i<w.w;i++)for(let j=0;j<w.h;j++)M[key(w.x+i,w.y+j)]=w});
  const seen=new Set([b]),q=[b];while(q.length){const w=q.pop();for(let i=-1;i<=w.w;i++)for(let j=-1;j<=w.h;j++){if((i<0||i>=w.w)&&(j<0||j>=w.h))continue;const n=M[key(w.x+i,w.y+j)];if(n&&!seen.has(n)){seen.add(n);q.push(n)}}}
  return [...seen].filter(x=>x.type==='wall'&&x.lvl===L)}
window.wInfo=wInfo;function wInfo(b,sc){const ws=wList(b,sc),cost={};ws.forEach(x=>{const q=window.ucost?ucost(x):costOf(BT.wall.cost,x.lvl+1);for(const k in q)cost[k]=(cost[k]||0)+q[k]});
  const old=b.lvl;b.lvl=old+1;const hp1=mxhp(b);b.lvl=old;
  const miss=Object.keys(cost).filter(k=>cost[k]&&(S.res[k]||0)<cost[k]).map(k=>((RK.find(r=>r[0]===k)||[0,k])[1]).toLowerCase());
  const g=window.ugate&&ugate(b);let why='';if(b.lvl>=hallLv()+1)why='Mejora antes el ayuntamiento (nivel '+(hallLv()+1)+').';else if(g)why=g;else if(miss.length)why='Faltan: '+miss.join(', ')+'.'+(window.resTips?resTips(cost):'');
  return {ws,n:ws.length,cost,hp1,why}}
window.wUpg=id=>{const b=bm[id];if(!b)return;const I=wInfo(b,window.wScope||'one');if(I.why)return toast(I.why);pay(I.cost);I.ws.forEach(x=>{x.lvl++;x.hp=mxhp(x);x.fxUpgrade=T});toast(I.n+(I.n>1?' muros mejorados.':' muro mejorado.'));bPanel(id)};
window.bp2Del=id=>{const bt=document.getElementById('bp2d');if(!bt)return destroy(id);if(bt.dataset.arm){destroy(id);return}bt.dataset.arm=1;bt.textContent='¿Seguro? (devuelve 50%)';setTimeout(()=>{if(bt&&bt.isConnected){delete bt.dataset.arm;bt.textContent='🗑 Destruir'}},3000)};
function bp2Sprite(b){const c=document.getElementById('bp2s');if(!c)return;const d=BT[b.type],x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
  if(b.type==='wall'||b.type==='gate'){x.fillStyle=d.c||'#888';x.fillRect(40,60,70,30);return}
  const sc=Math.min(140/((d.w+d.h)*32),110/(d.z+(d.w+d.h)*16)),
  nb={type:b.type,x:0,y:0,w:d.w,h:d.h,lvl:b.lvl,hp:mxhp(b),rot:0,cl:b.cl||0,rf:b.rf||0,ex:b.ex||0,id:b.id};
  x.save();x.translate(75-(d.w-d.h)*16*sc,d.z*sc+14);x.scale(sc,sc);try{drawB(x,nb,1)}catch(e){}x.restore()}
const st=document.createElement('style');st.textContent=`
.bp2sc{display:flex;gap:6px;margin:6px 0}.bp2sc button{flex:1;padding:7px 4px;border-radius:8px;border:1px solid #4a5360;background:#1b222b;color:#cfd6df;font:inherit;font-size:13px;display:flex;flex-direction:column;align-items:center;gap:2px}.bp2sc button small{font-size:15px;font-weight:700;color:#f2c94c}.bp2sc button.on{border-color:#f2c94c;background:#3a3216;color:#fff}
.bp2g{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}.bp2g .bp2u{margin:2px 0}@media(max-width:600px){.bp2g{grid-template-columns:1fr}}
.bp2h{display:flex;gap:12px;align-items:center;margin:2px 0 6px}
.bp2s{width:84px;height:72px;flex:none;background:radial-gradient(#26343a,#141c20);border:1px solid #2c3a40;border-radius:10px}
.bp2i{flex:1;min-width:0}.bp2n{font-size:17px;font-weight:800;line-height:1.15;color:#ffd877}
.bp2l{font-size:13px;margin:2px 0}.bp2l small{opacity:.6}.bp2st{margin-left:8px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;background:#2c3a40;border-radius:8px;padding:1px 7px;color:#cfe0d0}
.bp2p{display:flex;gap:3px;margin:3px 0 5px}.bp2p i{flex:1;max-width:22px;height:6px;border-radius:3px;background:#222c31}.bp2p i.on{background:linear-gradient(#ffe066,#e0a800)}.bp2p i.nx{box-shadow:inset 0 0 0 1px #e0a800}
.bp2hp{display:flex;align-items:center;gap:8px;font-size:12px}.bp2hp .bbar{flex:1}.bp2r{margin:0;padding:3px 8px;font-size:11px}
.bp2c-row{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0}.bp2c{display:inline-flex;align-items:center;gap:4px;background:#141c20;border:1px solid #2c3a40;border-radius:12px;padding:2px 9px;font-size:12px}.bp2c small{opacity:.6}
.bp2c.ok{color:#9be29b;border-color:#2f5a36}.bp2c.w{color:#ff9a8a;border-color:#7a3a3a}.bp2c.e{color:#ffe066;border-color:#6a5a1a}
.bp2u{margin:8px 0;padding:10px;border:1px solid #6a5a1a;border-radius:12px;background:linear-gradient(#1c2418,#141a14)}.bp2u.max{text-align:center;color:#ffd877;border-color:#4a4a2a}
.bp2ut{font-weight:800;letter-spacing:.04em;color:#ffd877;margin-bottom:6px}
.bp2d{display:flex;justify-content:space-between;font-size:13px;padding:3px 0;border-bottom:1px dashed #2c3a40}.bp2d s{opacity:.5;text-decoration:none}.bp2d b{color:#9be29b}.bp2d small{opacity:.6}
.bp2ck{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.bp2k{display:inline-flex;align-items:center;gap:4px;background:#101619;border:1px solid #2f5a36;border-radius:12px;padding:2px 9px;font-size:13px;color:#cfeccf}.bp2k small{opacity:.55;font-size:10px;margin-left:2px}.bp2k.no{color:#ff9a8a;border-color:#7a3a3a}
.bp2b{width:100%;margin:2px 0 0;padding:10px;font-size:15px;font-weight:800;background:linear-gradient(#f2c542,#c8921a);color:#1c1405;border:0;border-radius:10px}.bp2b:disabled{background:#2a3236;color:#78848a}
.bp2w{margin-top:6px;font-size:12px;color:#ff9a8a;text-align:center}
.bp2a{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:5px;margin:6px 0}.bp2a button{margin:0;padding:7px 6px;font-size:12px}.bp2a .del{border-color:#7a3a3a;color:#ff9a8a}
`;document.head.appendChild(st);
})();
