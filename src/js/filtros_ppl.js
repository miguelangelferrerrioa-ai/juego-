/* ===== Lista de supervivientes con filtros: rol, sexo, edad, estado y orden ===== */
(function(){
'use strict';
try{const st=document.createElement('style');st.textContent='#pan .pgf,.pgf{display:grid!important;gap:6px;margin:6px 0;grid-template-columns:repeat(auto-fill,minmax(92px,1fr))!important}#pan .pgf .pc{padding:4px!important}#pan .pgf .pc canvas{width:62px!important;height:auto!important;margin:2px auto!important}#pan .pgf .pc b{font-size:11px!important;line-height:1.15}#pan .pgf .pc small{font-size:10px!important;line-height:1.2}';document.head.appendChild(st)}catch(e){}
try{const st2=document.createElement('style');st2.textContent='.cps{background:linear-gradient(180deg,#3a464b,#252e32)!important;color:#ffd877!important;border:1px solid #5a6a70!important;border-radius:5px!important;padding:5px 9px!important;font-size:12px!important;letter-spacing:.3px;text-transform:none!important;min-height:0!important}.cps.on{background:linear-gradient(180deg,#ffd877,#e0a124)!important;color:#1b1203!important}.cpl{flex-basis:100%;display:flex;flex-wrap:wrap;gap:4px;padding:6px;background:#0e1416;border:1px solid #e0a12466;border-radius:6px}.cpl button{padding:4px 9px!important;font-size:12px!important;min-height:0!important;text-transform:none!important;background:#1b2427!important;color:#e8e0c8!important;border:1px solid #2d3a3f!important;border-radius:4px!important}.cpl button.on{background:#e0a124!important;color:#1b1203!important}';document.head.appendChild(st2)}catch(e){}
window._cpOpen='';
/* desplegable propio del juego (sin la ventana del navegador) */
window.chipSel=function(id,cur,opts,setJS,rerJS){const o=window._cpOpen===id,ct=(opts.find(x=>x[0]===cur)||opts[0])[1];
  let h='<button class="cps'+(o?' on':'')+'" onclick="_cpOpen=_cpOpen===\''+id+'\'?\'\':\''+id+'\';'+rerJS+'">'+ct+' '+(o?'▴':'▾')+'</button>';
  if(o)h+='<div class="cpl">'+opts.map(([v,t])=>'<button class="'+(v===cur?'on':'')+'" onclick="'+setJS.replace('$V','\''+v+'\'')+';_cpOpen=\'\';'+rerJS+'">'+t+'</button>').join('')+'</div>';
  return h};
const F=window.PPLF={rol:'',sex:'',age:'',st:'',ord:'rol'};
const AGES={'nino':['Niños (menos de 18)',p=>p.age<18],'joven':['18 a 39 años',p=>p.age>=18&&p.age<40],'medio':['40 a 59 años',p=>p.age>=40&&p.age<60],'mayor':['60 años o más',p=>p.age>=60]};
const ST={'libre':['Sin trabajo',p=>!p.job&&!p.arm&&!p.away&&p.age>=18],'trab':['Trabajando',p=>!!p.job],'ejer':['En el ejército',p=>!!p.arm],'fuera':['Fuera del pueblo',p=>!!p.away],'mal':['Heridos o enfermos',p=>!!p.illness||(p.injury||0)>0||p.hp<mhp(p)*.6],'preg':['Embarazadas',p=>!!p.preg]};
const ORD={'rol':'Mejor en el rol','nivel':'Nivel','nombre':'Nombre','edadA':'Más jóvenes','edadD':'Más mayores'};
const lv=(p,k)=>(p.ps&&p.ps[k])||0;
const sel=(id,cur,opts)=>chipSel('pp_'+id,cur,opts,'PPLF.'+id+'=$V','pplMenu()');
window.pplMenu=function(){
  let L=S.ppl.slice();
  if(F.rol)L=L.filter(p=>p.prof===F.rol||lv(p,F.rol)>0);
  if(F.sex)L=L.filter(p=>p.sex===F.sex);
  if(F.age&&AGES[F.age])L=L.filter(AGES[F.age][1]);
  if(F.st&&ST[F.st])L=L.filter(ST[F.st][1]);
  const by={rol:(a,b)=>F.rol?lv(b,F.rol)-lv(a,F.rol)||b.lvl-a.lvl:(a.prof||'').localeCompare(b.prof||'')||b.sk-a.sk,
    nivel:(a,b)=>b.lvl-a.lvl||b.xp-a.xp,nombre:(a,b)=>a.n.localeCompare(b.n),edadA:(a,b)=>a.age-b.age,edadD:(a,b)=>b.age-a.age}[F.ord]||(()=>0);
  L.sort(by);
  const act=F.rol||F.sex||F.age||F.st;
  const bar=`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:2px 0 8px">`+
    sel('rol',F.rol,[['','Todos los roles']].concat(PF.map(k=>[k,k])))+
    sel('sex',F.sex,[['','Hombres y mujeres'],['M','Hombres'],['F','Mujeres']])+
    sel('age',F.age,[['','Todas las edades']].concat(Object.keys(AGES).map(k=>[k,AGES[k][0]])))+
    sel('st',F.st,[['','Cualquier estado']].concat(Object.keys(ST).map(k=>[k,ST[k][0]])))+
    sel('ord',F.ord,Object.keys(ORD).map(k=>['' +k,'Orden: '+ORD[k]]))+
    (act?`<button class="mini" onclick="PPLF.rol=PPLF.sex=PPLF.age=PPLF.st='';pplMenu()">✕ Quitar filtros</button>`:'')+`</div>`;
  const info=`<p style="margin:0 0 6px">Mostrando <b>${L.length}</b> de ${S.ppl.length}.${F.rol?' Ordenados por nivel de <b>'+F.rol+'</b>.':''} Toca una foto para ver la ficha.</p>`;
  const body=L.length?'<div class="pgf">'+L.map(p=>{const h=pcard(p,`pSheet(${p.id})`);return F.rol?h.replace(/<\/div>$/,`<small style="color:#e0b020">★ ${F.rol} ${lv(p,F.rol)}/10</small></div>`):h}).join('')+'</div>':'<p class="invb">Nadie cumple estos filtros.</p>';
  show('Supervivientes ('+S.ppl.length+'/'+pcap()+')',bar+info+body);paintCards()};
})();
