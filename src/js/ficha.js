/* Ficha de superviviente compacta para móvil: cabecera fija + 3 pestañas (Equipo · Estado · Trabajo). El equipo se elige tocando una casilla. */
(function(){
'use strict';
const RCOL={C:['Común','#bdbdbd'],U:['Poco común','#7fc97f'],R:['Raro','#6aa9ff'],E:['Épico','#b36cff'],L:['Legendario','#e8b84a'],X:['Forjado','#ff8a3a']};
const bt=b=>Object.keys(b||{}).map(k=>k+' +'+b[k]).join(' · ');
window.pTab=window.pTab||'eq';window.pPick=null;
const info=(kind,n)=>{if(kind==='out'){const o=(window.OUTFITS||{})[n];return o?{n,ico:outfitIcon(n),rar:RCOL[o.r]||RCOL.C,stat:'🛡 Defensa +'+o.def,b:bt(o.b)}:null}
  const w=WP.find(q=>q.n===n);return w?{n,ico:weaponIcon(n),rar:RCOL[w.r||'C']||RCOL.C,stat:'⚔ Daño +'+w.v,b:bt(w.b)}:null};
const mini=(l,v,c)=>`<div class="pm"><span>${l}</span><div class="bar"><i style="width:${cl(v,0,100)}%;background:${c}"></i></div></div>`;
const slot=(id,kind,name)=>{const it=name&&info(kind,name),t=kind==='out'?'Atuendo':'Arma';
  return `<div class="pslot" onclick="pPick='${kind}';pSheet(${id})" style="border-color:${it?it.rar[1]:'#3a4a50'}">`+(it?`<img src="${it.ico}" class="invi"><div><div class="pst">${t}</div><b style="color:${it.rar[1]}">${it.n}</b><div class="invs">${it.stat}</div><div class="invb">${it.b||'sin bonos'}</div></div>`:`<div class="invi pempty">+</div><div><div class="pst">${t}</div><b>Vacío</b><div class="invb">Toca para elegir</div></div>`)+`</div>`};
function picker(p){const kind=window.pPick,id=p.id,list=[];
  S.inv.forEach((it,i)=>{const isO=it.kind==='outfit';if(it.kind==='clothing')return;if((kind==='out')!==isO)return;const d=info(kind,it.n);if(!d)return;
    list.push(`<div class="invc" style="border-color:${d.rar[1]}" onclick="${isO?`outEquip(${id},${i})`:`equip(${id},${i})`};pPick=null;pSheet(${id})"><img src="${d.ico}" class="invi"><div><b style="color:${d.rar[1]}">${d.n}</b><div class="invs">${d.stat}</div><div class="invb">${d.b||'sin bonos'}</div></div></div>`)});
  const cur=kind==='out'?p.outfit:(p.wp&&p.wp.n);
  return `<div class="prow"><button onclick="pPick=null;pSheet(${id})">← Volver</button>`+(cur?`<button onclick="${kind==='out'?`outOff(${id})`:`unEquip(${id})`};pPick=null;pSheet(${id})">Quitar actual</button>`:'')+`</div>`+
   (list.length?`<div class="invg">${list.join('')}</div>`:`<p><small>No tienes ${kind==='out'?'atuendos':'armas'} en el almacén. Fabrícalos en el taller (chatarra + plano) o encuéntralos en misiones.</small></p>`)}
window.unEquip=id=>{const p=byId(id);if(p&&p.wp){S.inv.push(p.wp);p.wp=null}};
function tabEq(p){const id=p.id;if(window.pPick&&String(pPick).startsWith('cl:'))return clothPicker(p,pPick.slice(3));if(window.pPick)return picker(p);
  const tot={};PF.forEach(k=>{const v=window.eqB?eqB(p,k):0;if(v)tot[k]=v});
  return `<div class="pslots">${slot(id,'wp',p.wp&&p.wp.n)}${slot(id,'out',p.outfit)}</div>${clothHtml(p)}<p class="invb">Bonos del equipo: <b style="color:#ffd877">${Object.keys(tot).length?bt(tot):'ninguno'}</b> · Defensa extra: ${(window.outDef?outDef(p):0)+clothingDef(p)}</p>`}
const CSL=[['vest','Chaleco'],['jacket','Chaqueta'],['pants','Pantalón'],['boots','Botas'],['pack','Mochila']];
function clothHtml(p){const id=p.id,cl=p.clothes||{},nInv=sl=>S.inv.filter(w=>w.kind==='clothing'&&w.slot===sl).length;
  const ic=(sl,col)=>window.clothIcon?'<img src="'+clothIcon(sl,col)+'" class="invi" style="padding:4px">':'<div class="invi pempty">+</div>';
  let h='<div class="pst" style="margin:8px 0 3px;color:#e0a124">Prendas · defensa +'+Object.values(cl).reduce((a,x)=>a+(x.def||0),0)+'</div><div class="pslots" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">';
  CSL.forEach(([sl,nm])=>{const w=cl[sl],n=nInv(sl);h+='<div class="pslot" onclick="pPick=\'cl:'+sl+'\';pSheet('+id+')" style="border-color:'+(w?'#7fc97f':'#3a4a50')+'">'+(w?ic(sl,w.col):'<div class="invi pempty">+</div>')+'<div><div class="pst">'+nm+'</div><b'+(w?' style="color:#7fc97f"':'')+'>'+(w?w.n:'Vacío')+'</b><div class="invb">'+(w?'Defensa +'+(w.def||0):(n?n+' en el almacén':'Toca para elegir'))+'</div></div></div>'});
  return h+'</div>'}
function clothPicker(p,sl){const id=p.id,cur=(p.clothes||{})[sl],nm=(CSL.find(x=>x[0]===sl)||[0,'prenda'])[1].toLowerCase();
  const L=S.inv.map((w,i)=>[w,i]).filter(x=>x[0].kind==='clothing'&&x[0].slot===sl);
  const card=([w,i])=>'<div class="invc" onclick="pPick=null;lootEquip('+id+','+i+')"><img src="'+(window.clothIcon?clothIcon(w.slot,w.col):'')+'" class="invi" style="padding:6px"><div><b>'+w.n+'</b><div class="invs">🛡 Defensa +'+(w.def||0)+'</div></div></div>';
  return '<div class="prow"><button onclick="pPick=null;pSheet('+id+')">← Volver</button>'+(cur?'<button onclick="pPick=null;clothOff('+id+',\''+sl+'\')">Quitar actual</button>':'')+'</div>'+
   (L.length?'<div class="invg">'+L.map(card).join('')+'</div>':'<p><small>No tienes ningún '+nm+' en el almacén. Las prendas las sueltan algunos zombis.</small></p>')}
window.clothOff=function(id,sl){const p=byId(id);if(!p||!p.clothes||!p.clothes[sl])return;S.inv.push(p.clothes[sl]);delete p.clothes[sl];toast(p.n+' se quita la prenda.');save();pSheet(id)};
function tabEs(p){const id=p.id,hs=cnt('hosp')>0,rels=Object.entries(p.rel||{}).map(([r,v])=>{const q=byId(+r);return q?q.n.split(' ')[0]+' '+v:''}).filter(Boolean);
  return `<div class="pgrid">${mini('Hambre',p.hunger,'#d89b45')}${mini('Sed',p.thirst,'#49a9e8')}${mini('Experiencia '+Math.floor(p.xp)+'/'+p.lvl*50,p.xp/(p.lvl*50)*100,'#48c')}</div>
  <p class="invb">${p.illness?'Enfermo ('+p.illness+')':'Sin enfermedad'} · ${p.injury>0?'Herido ('+Math.round(p.injury)+'%)':'Sin heridas'} · Personalidad ${p.trait} · Habilidad ${p.sk}</p>
  <p class="invb">Relaciones: ${rels.join(' · ')||'todavía conociendo a la comunidad'}</p>
  <div class="prow">${btn('Curar heridas ('+healCost(p,S.bld.find(x=>x.type=='hosp'))+' medicinas)',`heal(${id})`,!hs||p.hp>=mhp(p)-1&&!p.injury)}${btn('💊 Antibiótico (1)',`cure(${id})`,!p.illness||!(S.res.abx>=1))}</div>`}
const SI={Médico:['M','#e0556a'],Soldado:['S','#8a9a4a'],Constructor:['C','#d2a24a'],Agricultor:['A','#6fb04e'],Cocinero:['K','#d9824a'],Explorador:['E','#4a8ad0'],Mecánico:['X','#8f98a3'],Recolector:['R','#b0824a'],Científico:['I','#4ac0b0']};
function tabSt(p){return tabSt0(p)+(window.atHtml?atHtml(p):'')}
const RX={Médico:'Si es su rol principal y trabaja en su puesto sanitario, atiende a los heridos cada día por su cuenta.',
 Constructor:'Si es su rol principal: cada constructor abarata un 4% construir y mejorar (hasta un 30% entre todos) y repara cada día los edificios dañados.',
 Explorador:'Cada nivel da un 3% más de suerte en la exploración en solitario (y un 4% extra si es su rol principal).',
 Mecánico:'El rol de la industria: talleres, fábricas, energía y materiales avanzados.',
 Recolector:'Si es su rol principal: un 20% más de botín al recoger en el mapa y al registrar restos de vehículos.',
 Científico:'Genera más puntos de investigación y rinde más en los edificios de ciencia.'};
function roleTxt(k){let L=[];try{L=Object.keys(BT).filter(t=>(BT[t].job||[]).includes(k)&&((BT[t].lv<=hallLv()&&(!BT[t].tech||th(BT[t].tech)))||cnt(t)>0)).map(t=>BT[t].n)}catch(e){}
  const w=L.length?'Trabaja mejor en: <b>'+L.join(', ')+'</b>. Cada nivel del rol suma un 20% de rendimiento en esos puestos.':'Sus puestos de trabajo aún no están desbloqueados.';
  return w+(RX[k]?' '+RX[k]:'')}
window.roleTxt=roleTxt;window.ROLE_SI=SI;
function tabSt0(p){const tr=window.trInfo&&trInfo(p),sel=window.pRole&&PF.includes(pRole)?pRole:p.prof;
  return `<div class="stg">`+PF.map(k=>{const v=Math.min(10,p.ps[k]||0),e=window.eqB?eqB(p,k):0,c=SI[k][1],seg=[];
   for(let i=1;i<=10;i++)seg.push(`<i style="${i<=v?'background:'+c:i<=v+e?'background:#ffd877':''}"></i>`);
   return `<div class="sti${tr&&tr.pf===k?' on':''}${k===sel?' sel':''}" style="cursor:pointer${k===sel?';outline:1px solid #e0b020':''}" onclick="pRole='${k}';pSheet(${p.id})"><b style="background:${c}">${SI[k][0]}</b><span>${k}</span><div class="sts">${seg.join('')}</div><em>${v}${e?'<small>+'+e+'</small>':''}</em></div>`}).join('')+`</div><div class="invb" style="background:#141c20;border:1px solid #263238;border-radius:4px;padding:6px 8px;margin:4px 0;line-height:1.35"><b style="color:${SI[sel][1]}">${sel}</b> · ${roleTxt(sel)}</div><p class="invb">Toca un rol para ver qué hace. Cada rol sube de 0 a 10 en los edificios de formación. <span style="color:#ffd877">Amarillo</span> = bono del equipo.</p>`}
function tabTr(p){const id=p.id,b=bm[p.job],opts=S.bld.filter(q=>BT[q.type].slots&&wk(q).length<slots(q)&&!p.arm);
  const cl_=S.inv.filter(w=>w.kind==='clothing'),op=window.pOpen;
  const tg=k=>`pOpen=${op===k?'null':`'${k}'`};pSheet(${id})`;
  let h=`<div class="prow"><span>Trabajo: <b class="pv">${b?BT[b.type].n:'sin asignar'}</b></span>${btn(op==='job'?'▲ Cerrar':'Cambiar',tg('job'))}${p.job?btn('Quitar',`byId(${id}).job=0;pSheet(${id})`):''}</div>`;
  if(op==='job')h+=`<div class="pchips">${opts.length?opts.map(q=>btn((BT[q.type].tr?'🎓 ':'')+BT[q.type].n,`pOpen=null;asg(${id},${q.id})`)).join(''):'<small>No hay puestos libres.</small>'}</div>`;
  h+=`<div class="prow"><span>Ejército: <b class="pv">${p.arm?CL[p.arm].n:'civil'}</b></span>`+(p.arm?btn('Licenciar',`byId(${id}).arm=null;pSheet(${id})`):btn(op==='army'?'▲ Cerrar':'Enrolar',tg('army')))+`</div>`;
  if(op==='army'&&!p.arm)h+=`<div class="pchips">${Object.keys(CL).map(k=>btn(CL[k].n,`pOpen=null;enlist(${id},'${k}')`,CL[k].t&&!th(CL[k].t))).join('')}</div>`;
  if(cl_.length)h+=`<p class="invb">Prendas recuperadas: ${cl_.map(w=>btn(w.n+' (+'+(w.def||0)+')',`lootEquip(${id},${S.inv.indexOf(w)})`)).join('')}</p>`;
  return h}
window.pSheet=function(id){const p=byId(id);if(!p)return;const b=bm[p.job];
  const tb=(k,t)=>`<button class="${window.pTab===k?'primary':''}" onclick="pTab='${k}';pPick=null;pOpen=null;pSheet(${id})">${t}</button>`;
  const body=window.pTab==='es'?tabEs(p):window.pTab==='st'?tabSt(p):window.pTab==='tr'?tabTr(p):tabEq(p);
  const h=`<div class="phead"><canvas id="avatar" width="180" height="190"></canvas><div class="pinfo"><div><b>${p.age} años · ${p.prof}</b> <small>(${p.sp})</small></div><div class="invb">Nivel ${p.lvl} · ${b?BT[b.type].n:'sin trabajo'}${p.arm?' · '+CL[p.arm].n:''}</div>${p.preg?(()=>{const q=(S.pregnancies||[]).find(x=>x.mother===p.id&&!x.born);const left=q?Math.max(0,3-(q.gest||0)):null;return `<div class="invb" style="color:#ff9cc6;display:flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="-11 -11 22 22"><circle r="10" fill="#e0558f" stroke="#fff" stroke-width="1.8"/><path d="M-1.6 -7.2Q0 -9.4 1.6 -7.2V-5.6H-1.6Z M-3.4 -5.6H3.4V-3.8H-3.4Z M-3.2 -3.8H3.2V5Q3.2 7.2 0 7.2Q-3.2 7.2 -3.2 5Z" fill="#fff"/></svg><b>Embarazada</b>${left!==null?' · da a luz en '+(left<1?'menos de un día':Math.ceil(left)+' día'+(Math.ceil(left)>1?'s':'')):''}</div>`})():''}${(()=>{const t=window.trInfo&&trInfo(p);return t?`<div class="invb" style="color:#8bd">🎓 Formándose: ${t.pf} nivel ${t.lv} → ${Math.min(10,t.lv+1)} · faltan ${Math.floor(Math.max(0,t.left)/60)}:${String(Math.ceil(Math.max(0,t.left))%60).padStart(2,'0')}</div>`:''})()}
  <div class="pgrid">${mini('Salud '+Math.round(p.hp)+'/'+mhp(p),p.hp/mhp(p)*100,'#d44')}</div></div></div>
  <div class="prow ptabs">${tb('eq','⚔ Equipo')}${tb('es','♥ Estado')}${tb('st','★ Roles')}${tb('tr','🔧 Trabajo')}</div>${body}`;
  show(p.n,h);drawAvatar(id)};
})();
