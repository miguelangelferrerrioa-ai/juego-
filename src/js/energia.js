/* ===== Energía estilo Fallout Shelter: los generadores dan capacidad, los edificios consumen; si falta, se apagan los últimos construidos ===== */
(function(){
const FREE=new Set(['hall','wall','gate','road','bridge','trap','turret','tower','mtower','bunker','gen','solar','wind']);
const BASE={house:3,farm:3,well:2,pump:3,dock:2,cistern:2,silo:2,greenh:5,store:3,barr:4,expo:4,kitchen:4,saw:5,scrapy:5,mine:6,quarry:8,oilp:9,smithy:6,sheetw:8,kiln:10,glassw:14,steelw:18,cement:22,work:6,fact:10,lab:8,hosp:8,pharm:6,chem:10,ammof:10,elab:10,refin:12,market:5,radio:4,abxlab:8};
const STAGE=l=>l<=2?0:l<=4?.5:l<=6?1:l<=8?1.5:2;
const NAME=['Campamento','Chabola','Diseño completo','Diseño avanzado','Diseño máximo'];
window.pwBase=t=>FREE.has(t)||t.startsWith('tr_')?0:(BASE[t]||4);
window.pwUse=(b,lv)=>{const t=b.type,base=pwBase(t);if(!base)return 0;return Math.round(base*STAGE(lv||b.lvl)*10)/10};
window.pwTable=t=>{const base=pwBase(t);if(!base)return null;return [1,3,5,7,9].map(l=>Math.round(base*STAGE(l)*10)/10)};
window.powCalc=function(){
  const P=S.pw=S.pw||{};let sup=0,dem=0,used=0,over=false;const cons=[];
  const creative=S.mode==='creativo';
  S.bld.forEach(b=>{if(b.pause)return;if(b.type==='gen'){if(b.run!==0)sup+=out(b,1).elec||0}else if(b.type==='solar'||b.type==='wind')sup+=out(b,1).elec||0});
  S.bld.forEach(b=>{b.off=0;if(b.pause)return;const u=pwUse(b);if(u>0)cons.push([b,u])});
  cons.sort((a,b)=>a[0].id-b[0].id);
  cons.forEach(([b,u])=>{dem+=u;if(!over&&used+u<=sup+1e-6)used+=u;else{over=true;b.off=1}});
  P.sup=sup;P.dem=dem;P.used=used;P.over=over;P.off=cons.filter(c=>c[0].off).length;POW=!over;S.res.elec=0;
  return P};
const f1=n=>(Math.round(n*10)/10).toString().replace('.',',');
window.pwBar=function(P,w,h){const tot=Math.max(P.sup,P.dem,1),u=P.used/tot*100,d=Math.max(0,P.dem-P.used)/tot*100,m=P.sup/tot*100;
  return`<span style="display:inline-block;position:relative;width:${w}px;height:${h}px;background:#1a2024;border:1px solid #3a464b;border-radius:${h/2}px;overflow:hidden;vertical-align:middle"><i style="position:absolute;left:0;top:0;bottom:0;width:${u}%;background:linear-gradient(#ffe066,#e0a800)"></i><i style="position:absolute;left:${u}%;top:0;bottom:0;width:${d}%;background:repeating-linear-gradient(45deg,#c23b2e,#c23b2e 4px,#7a1f18 4px,#7a1f18 8px)"></i><i style="position:absolute;left:${Math.min(99,m)}%;top:-1px;bottom:-1px;width:2px;background:#fff"></i></span>`};
window.powChip=function(){const P=S.pw||(powCalc(),S.pw),def=Math.max(0,P.dem-P.sup);
  return`<div class="ch" onclick="powMenu()" style="cursor:pointer;pointer-events:auto;gap:6px;${P.over?'border-color:#a33':''}">⚡ ${pwBar(P,70,10)} <span style="${P.over?'color:#ff8a7a':''}">${f1(P.dem)}/${f1(P.sup)}</span>${P.over?'<small style="color:#ff8a7a"> −'+f1(def)+'</small>':''}</div>`};
window.powMenu=function(){const P=powCalc(),def=Math.max(0,P.dem-P.sup);
  const rows=S.bld.filter(b=>pwUse(b)>0).sort((a,b)=>a.id-b.id).map(b=>{const u=pwUse(b);return`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #2a3a2a"><span>${BT[b.type].n} <small>(nv ${b.lvl})</small></span><span>${b.pause?'<small>⏸ parado</small>':b.off?'<b style="color:#ff8a7a">sin energía · ⚡ '+f1(u)+'</b>':'⚡ '+f1(u)}</span></div>`}).join('');
  const gens=S.bld.filter(b=>b.type==='gen'||b.type==='solar'||b.type==='wind').map(b=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #2a3a2a"><span>${BT[b.type].n} <small>(nv ${b.lvl})</small></span><span>${b.pause?'<small>⏸ parado</small>':'+'+f1(out(b,1).elec||0)}</span></div>`).join('');
  const line=(a,v,c)=>`<div style="display:flex;justify-content:space-between;padding:3px 0"><span>${a}</span><b style="${c||''}">${v}</b></div>`;
  show('Energía',`<div style="margin:6px 0 10px">${pwBar(P,260,18)}</div>`+line('Capacidad que generas ahora mismo','⚡ '+f1(P.sup),'color:#ffe066')+line('Necesitan todos los edificios para funcionar','⚡ '+f1(P.dem))+line('Consumo en marcha','⚡ '+f1(P.used))+(P.over?line('Te faltan','⚡ '+f1(def),'color:#ff8a7a'):line('Te sobran','⚡ '+f1(P.sup-P.dem),'color:#8c8'))+(P.over?`<p style="color:#ff8a7a"><b>${P.off} edificio(s) apagado(s)</b>: se apagan los últimos que construiste. Construye o mejora generadores, o pausa edificios.</p>`:'')+`<p><small>La energía no se guarda: los generadores dan capacidad y los edificios la usan. El ayuntamiento, los muros, las defensas y los campamentos (nivel 1-2) no gastan.</small></p><p><b>Generadores</b></p>${gens||'<p><small>No tienes ninguno. Construye un Generador.</small></p>'}<p><b>Consumidores</b> <small>(del más antiguo al más nuevo)</small></p>${rows||'<p><small>Ninguno todavía.</small></p>'}`)};
try{const G=window.GD||GD;
const rep=(t,f)=>{const g=G.find(q=>q[0]===t);if(!g)return;const o=g[1];g[1]=()=>f(o())};
rep('Interfaz',h=>h.replace('el reloj del día (cada día dura 10 minutos).','el reloj del día (cada día dura 10 minutos) y el indicador ⚡ de energía (consumo/producción; en rojo si falta). Púlsalo para ver el detalle.'));
const at=Math.max(0,G.findIndex(q=>q[0]==='Edificios'));
G.splice(at,0,['Energía',()=>'<p>La energía <b>no es un recurso que se guarde</b>: funciona como capacidad. Los <b>generadores</b>, las <b>granjas solares</b> y las <b>turbinas eólicas</b> aportan energía; los edificios consumen. En la barra superior, ⚡ muestra una <b>barra</b> con la energía <b>necesaria/capacidad</b> y se pone rojo si no llega.</p><p><b>Si falta energía</b>, se apagan los <b>últimos edificios que construiste</b> (el más reciente primero) y dejan de producir hasta que haya energía. Se ven oscurecidos con «sin energía». Construye otro generador, mejóralo, ponle trabajadores o pausa edificios que no necesites para recuperar el equilibrio.</p><p><b>No consumen:</b> ayuntamiento, muros y puertas, carreteras y puentes, trampas, torres y torretas, búnker, y los propios generadores, solares y turbinas. <b>Tampoco gastan los edificios en fase de campamento (nivel 1-2).</b></p><p><b>Cuánto consumen:</b> depende del edificio y de su aspecto. Nivel 3-4 (chabola): la mitad de su consumo base · nivel 5-6: el consumo base · nivel 7-8: ×1,5 · nivel 9-10: ×2. Base aproximada: casas, pozos y almacén 2-3; granja, barracones, expedición y cocina 3-4; aserradero 5, taller de chapa y cantera 8, horno de ladrillos 10, horno de cristal 14, acería 18, planta de hormigón 22 (cuanto más avanzado el material, más energía); taller, farmacia, laboratorio y hospital 6-8; fábrica, planta química, munición y electrónica 10; refinería 12. En el menú de construir, cada edificio muestra su tabla de energía.</p>'+'<p><b>Pausar</b> un edificio también libera su consumo.</p>']);
}catch(e){console.error('guia energia',e)}
})();
