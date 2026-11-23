/* Equipo estilo Fallout Shelter: armas y atuendos con bonos por profesión */
(function(){
const RC={C:['Común','#bdbdbd'],U:['Poco común','#7fc97f'],R:['Raro','#6aa9ff'],E:['Épico','#b36cff'],L:['Legendario','#e8b84a']};
/* armas nuevas: n,v(daño),c(coste),t(tecnología),b(bonos),r */
const NW=[
['Cuchillo de caza',2,{metal:8},0,{Explorador:1},'C'],
['Bate con clavos',4,{wood:20,metal:10},0,{Soldado:1},'C'],
['Hacha de bombero',5,{metal:30,wood:10},0,{Constructor:1,Soldado:1},'U'],
['Llave inglesa pesada',4,{metal:25},0,{Mecánico:2,Constructor:1},'C'],
['Azada reforzada',3,{metal:15,wood:15},0,{Agricultor:2},'C'],
['Bisturí táctico',3,{metal:15,meds:5},0,{Médico:2},'U'],
['Cuchillo de cocina',3,{metal:10},0,{Cocinero:2},'C'],
['Soplete de taller',6,{metal:45},0,{Mecánico:2,Constructor:1},'U'],
['Pistola de bengalas',4,{metal:20,ammo:10},0,{Explorador:2,Recolector:1},'U'],
['Carabina',9,{metal:45,ammo:15},0,{Soldado:1},'U'],
['Subfusil',10,{metal:55,ammo:25},'arms1',{Soldado:2},'R'],
['Escopeta de combate',12,{metal:65,wood:10,ammo:30},'arms1',{Soldado:2},'R'],
['Rifle de francotirador',16,{metal:90,ammo:40},'arms2',{Soldado:2,Explorador:2},'R'],
['Ballesta de precisión',10,{metal:40,wood:35},'arms1',{Explorador:3},'R'],
['Pistola de reactivos',8,{metal:50,meds:10,ammo:15},'arms1',{Científico:3,Médico:1},'R'],
['Rifle de CENIZA',18,{metal:110,ammo:50},'arms2',{Soldado:4},'L'],
['Fusil del Faro',20,{metal:120,ammo:55},'arms2',{Soldado:3,Explorador:4},'L']];
WP.forEach(w=>{if(!w.r)w.r='C'});
if(!WP.some(w=>w.n==='Cuchillo de caza'))NW.forEach(q=>WP.push({n:q[0],v:q[1],c:q[2],t:q[3]||undefined,b:q[4],r:q[5]}));
/* los básicos también reciben bonos */
const BW={'Pistola':{Soldado:1},'Escopeta':{Soldado:1},'Rifle de asalto':{Soldado:2},'Machete':{Constructor:1,Explorador:1},'Revólver':{Soldado:1},'Ballesta':{Explorador:1},'Rifle de caza':{Explorador:2,Soldado:1}};
WP.forEach(w=>{if(BW[w.n]&&!w.b)w.b=BW[w.n]});
/* atuendos: n,def,bonos,rareza,coste (null = solo botín/historia) */
const OUT=[
['Ropa de trabajo',1,{Constructor:1,Mecánico:1},'C',{wood:15,metal:5}],
['Bata sanitaria',1,{Médico:1,Científico:1},'C',{meds:5,wood:10}],
['Delantal de cocina',1,{Cocinero:2},'C',{wood:10,food:10}],
['Ropa de labranza',1,{Agricultor:2},'C',{wood:15}],
['Chaleco de explorador',2,{Explorador:2,Recolector:1},'C',{wood:15,metal:10}],
['Ropa de recolector',1,{Recolector:2,Agricultor:1},'C',{wood:15}],
['Mono de mecánico',2,{Mecánico:2},'C',{metal:15,wood:10}],
['Chaleco antibalas',3,{Soldado:1},'U',{metal:40,wood:15}],
['Uniforme médico militar',2,{Médico:3},'U',{meds:15,metal:15}],
['Mono reforzado',3,{Constructor:3,Mecánico:1},'U',{metal:35,wood:20}],
['Traje de laboratorio',2,{Científico:3,Médico:1},'U',{meds:10,metal:20}],
['Equipo de campo',3,{Explorador:3,Recolector:2},'U',{metal:30,wood:25}],
['Uniforme de chef',2,{Cocinero:3,Agricultor:1},'U',{food:20,wood:15}],
['Armadura de cuero',4,{Soldado:2},'U',{wood:30,metal:25}],
['Armadura antidisturbios',5,{Soldado:3},'R',null],
['Armadura de placas',6,{Soldado:3,Constructor:1},'R',null],
['Traje NBQ',3,{Científico:3,Médico:3},'R',null],
['Ropa táctica',4,{Explorador:4,Soldado:1},'R',null],
['Uniforme de CENIZA',5,{Soldado:4},'R',null],
['Mono de ingeniero jefe',4,{Mecánico:4,Constructor:3},'R',null],
['Armadura del Cordón',8,{Soldado:5},'L',null],
['Bata de la doctora Ibarra',3,{Médico:6},'L',null],
['Traje Aurora',5,{Científico:6,Médico:2},'L',null],
['Capa del Faro',4,{Explorador:6,Recolector:3},'L',null],
['Uniforme del superviviente',4,{Soldado:2,Constructor:2,Médico:2,Explorador:2,Mecánico:2,Agricultor:2,Cocinero:2,Recolector:2,Científico:2},'L',null]];
const OB={};OUT.forEach(o=>OB[o[0]]={n:o[0],def:o[1],b:o[2],r:o[3],c:o[4]});
window.OUTFITS=OB;
const wo=p=>p.wp&&WP.find(w=>w.n===p.wp.n),oo=p=>p.outfit&&OB[p.outfit];
window.eqB=(p,j)=>{let b=0;const w=wo(p),o=oo(p);if(w&&w.b)b+=w.b[j]||0;if(o)b+=o.b[j]||0;return b};
window.outDef=p=>{const o=oo(p);return o?o.def:0};
window.eqPow=p=>{const o=oo(p);return (o?o.def*3:0)+eqB(p,'Soldado')*2};
const bt=b=>Object.keys(b||{}).map(k=>k+' +'+b[k]).join(', ');
window.wbTxt=w=>{const x=WP.find(q=>q.n===w.n);return x&&x.b?' · '+bt(x.b):''};
window.outCraftBtns=()=>'<p>Atuendos (defensa y bonos de profesión):</p>'+OUT.filter(o=>o[4]).map((o,i)=>btn(o[0]+' (def +'+o[1]+' · '+bt(o[2])+' · '+cs(o[4])+')',`outCraft('${o[0]}')`)).join('');
window.outCraft=n=>{const o=OB[n],c=costOf(o.c,1);if(!can(c))return toast('Faltan recursos.');pay(c);S.inv.push({kind:'outfit',n});toast('Fabricado: '+n);bPanel(sel)};
window.outEquip=(id,i)=>{const p=byId(id),it=S.inv[i];if(!p||!it||it.kind!=='outfit')return;S.inv.splice(i,1);if(p.outfit)S.inv.push({kind:'outfit',n:p.outfit});p.outfit=it.n;toast(p.n+' viste: '+it.n);save();pSheet(id)};
window.outOff=id=>{const p=byId(id);if(p.outfit){S.inv.push({kind:'outfit',n:p.outfit});p.outfit=null}pSheet(id)};
const card=(o,extra)=>{const r=RC[o.r];return'<span style="color:'+r[1]+'">'+o.n+'</span> <small>('+r[0]+' · def +'+o.def+' · '+bt(o.b)+')</small>'};

})();
/* ---- aspecto visual de los atuendos ---- */
(function(){
const V={'Ropa de trabajo':['#6b6a4a','#4a492f','#8e7a3a','overall'],'Bata sanitaria':['#b9bbb0','#8a8c82','#7a7c72','coat'],'Delantal de cocina':['#575841','#3d3d2c','#cfcab2','apron'],'Ropa de labranza':['#6b5a3a','#4a3d26','#8a7a4a','overall'],'Chaleco de explorador':['#5e6244','#42452f','#8a6a3a','tactical'],'Ropa de recolector':['#5f5a44','#403c2c','#7a6a44','tactical'],'Mono de mecánico':['#4a5560','#323b44','#8a7a30','overall'],'Chaleco antibalas':['#575841','#3d3d2c','#2f3238','vest'],'Uniforme médico militar':['#5a6248','#3d432f','#c0c0b0','coat'],'Mono reforzado':['#5a5a50','#3c3c34','#c08a2a','overall'],'Traje de laboratorio':['#c8cac0','#9a9c92','#6a8a9a','coat'],'Equipo de campo':['#4f5a3a','#38422a','#8a6a3a','tactical'],'Uniforme de chef':['#d4d2c4','#a8a698','#8a2a2a','apron'],'Armadura de cuero':['#6a4a2a','#46301a','#3a2616','vest'],'Armadura antidisturbios':['#2e3238','#1e2226','#5a636c','vest'],'Armadura de placas':['#58606a','#3a4048','#9aa4ac','vest'],'Traje NBQ':['#c8b83a','#9a8c26','#3a3a30','hazmat'],'Ropa táctica':['#2f352c','#1f241d','#5a6246','tactical'],'Uniforme de CENIZA':['#2a2a2c','#161618','#8a2a1a','vest'],'Mono de ingeniero jefe':['#d8812a','#a85f18','#3a3a34','overall'],'Armadura del Cordón':['#4a5058','#2e3238','#c9a24a','vest'],'Bata de la doctora Ibarra':['#d6d8d0','#aaaca2','#cc3333','coat'],'Traje Aurora':['#d8dce0','#a4aab0','#4a8aa8','hazmat'],'Capa del Faro':['#2a3a4a','#1a2632','#c9a24a','tactical'],'Uniforme del superviviente':['#3a4a3a','#26332a','#c9a24a','overall']};
window.OUTV=V;let cur=null;
const TR={R:'#6aa9ff',L:'#e8b84a'};
function shapes(g,v,rar,L,T,R,B,k){const W=R-L,Hh=B-T,X=f=>L+f*W,Y=f=>T+f*Hh,lw=W/7.2;g.save();g.lineWidth=.5*lw;g.strokeStyle='rgba(15,10,6,.7)';const c2=v[2],kd=v[3];
const rc=(a,b,c,d,fill)=>{g.fillStyle=fill||c2;g.fillRect(X(a),Y(b),c*W,d*Hh);g.strokeRect(X(a),Y(b),c*W,d*Hh)};
if(kd==='vest'){rc(.14,.08,.72,.66);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(X(.18),Y(.12),.64*W,.14*Hh);rc(.2,.76,.18,.2,v[1]);rc(.62,.76,.18,.2,v[1]);g.strokeStyle='rgba(0,0,0,.45)';g.beginPath();g.moveTo(X(.5),Y(.08));g.lineTo(X(.5),Y(.74));g.stroke()}
else if(kd==='coat'){g.fillStyle=v[1];g.beginPath();g.moveTo(X(.5),Y(0));g.lineTo(X(.5),Y(1));g.lineTo(X(.47),Y(1));g.lineTo(X(.47),Y(0));g.fill();rc(.12,.55,.24,.22,v[1]);rc(.64,.55,.24,.22,v[1]);g.fillStyle=c2;g.beginPath();g.arc(X(.5),Y(.42),.04*W,0,7);g.arc(X(.5),Y(.64),.04*W,0,7);g.fill()}
else if(kd==='apron'){rc(.2,.2,.6,.8);g.strokeStyle=c2;g.lineWidth=.7*lw;g.beginPath();g.moveTo(X(.28),Y(0));g.lineTo(X(.28),Y(.22));g.moveTo(X(.72),Y(0));g.lineTo(X(.72),Y(.22));g.stroke();g.fillStyle='rgba(0,0,0,.12)';g.fillRect(X(.3),Y(.5),.4*W,.22*Hh)}
else if(kd==='overall'){g.fillStyle=v[1];g.fillRect(X(.16),Y(0),.16*W,Hh);g.fillRect(X(.68),Y(0),.16*W,Hh);rc(.34,.18,.32,.34,v[1]);g.fillStyle=c2;g.fillRect(X(.4),Y(.24),.2*W,.07*Hh);g.fillRect(X(.16),Y(.7),.68*W,.08*Hh)}
else if(kd==='tactical'){g.strokeStyle=v[1];g.lineWidth=1.5*lw;g.beginPath();g.moveTo(X(.05),Y(0));g.lineTo(X(.95),Y(.95));g.stroke();g.strokeStyle=c2;g.lineWidth=.5*lw;g.stroke();g.strokeStyle='rgba(15,10,6,.7)';g.lineWidth=.5*lw;rc(.14,.58,.24,.28);rc(.62,.5,.24,.28)}
else if(kd==='hazmat'){g.fillStyle=c2;g.fillRect(X(0),Y(.3),W,.1*Hh);g.fillRect(X(0),Y(.66),W,.1*Hh);rc(.4,.1,.2,.14,'#e8e8dc')}
if(rar==='R'||rar==='L'){g.fillStyle=TR[rar];g.fillRect(X(0),Y(.93),W,.07*Hh);if(rar==='L'){g.beginPath();g.arc(X(.5),Y(.5),.07*W,0,7);g.fill();g.stroke()}}
g.restore()}
const setup=p=>{const n=p&&p.outfit,v=n&&V[n];cur=v?{v,r:OUTFITS[n].r}:null;if(cur){SUIT=v[0];SUITD=v[1]}return cur};
const ofig=window.fig;
window.fig=function(){const a=arguments,role=a[8];if(role==='ban'||role==='zom'||!a[10])return ofig.apply(null,a);const p=byId(a[10]);const sv=[SUIT,SUITD];if(!setup(p))return ofig.apply(null,a);try{return ofig.apply(null,a)}finally{SUIT=sv[0];SUITD=sv[1];cur=null}};
const opf=window.paintFace;
window.paintFace=function(cv,p){const sv=[SUIT,SUITD];setup(p);try{return opf(cv,p)}finally{SUIT=sv[0];SUITD=sv[1];cur=null}};
window.ovFig=(g,H,FM)=>{if(!cur)return;shapes(g,cur.v,cur.r,-3.6,H,3.6,H+8.5)};
window.ovPort=(x,F)=>{if(!cur)return;x.save();x.beginPath();if(F){x.moveTo(34,190);x.quadraticCurveTo(40,150,70,141);x.lineTo(110,141);x.quadraticCurveTo(140,150,146,190)}else{x.moveTo(8,190);x.quadraticCurveTo(14,148,60,138);x.lineTo(120,138);x.quadraticCurveTo(166,148,172,190)}x.closePath();x.clip();shapes(x,cur.v,cur.r,F?44:26,F?150:146,F?136:154,190);x.restore()};

/* planos: solo se fabrica lo básico; el resto hay que encontrarlo en misiones y expediciones */
const FREEP=new Set(['Pistola','Revólver','Bate con clavos','Ropa de trabajo','Chaleco de explorador','Armadura de cuero']);
window.hasPlan=n=>FREEP.has(n)||!!(S.bp&&S.bp[n]);
const craftable=()=>{const o=[];WP.forEach(w=>{if(w.c&&!FREEP.has(w.n))o.push({n:w.n,r:w.r||'C'})});Object.values(window.OUTFITS||{}).forEach(x=>{if(x.c&&!FREEP.has(x.n))o.push({n:x.n,r:x.r})});return o};
window.planStat=()=>{const c=craftable();return[c.filter(x=>S.bp&&S.bp[x.n]).length,c.length]};
window.givePlan=(lv)=>{S.bp=S.bp||{};const own=craftable().filter(x=>!S.bp[x.n]);if(!own.length)return null;const rr={C:0,U:1,R:2,L:3},rk=(window._qm&&_qm.rollRar)?_qm.rollRar(lv):'C';let pool=[];for(let k=rr[rk]||0;k>=0&&!pool.length;k--)pool=own.filter(x=>rr[x.r]===k);if(!pool.length)pool=own;const it=pool[Math.floor(Math.random()*pool.length)];S.bp[it.n]=1;const e=S.exp;if(e&&e.log)e.log.push('Plano hallado: '+it.n);return it};
window.outCraftBtns=()=>'<p>📜 Planos hallados: <b>'+planStat().join('/')+'</b> · se encuentran en misiones y expediciones</p><p>Atuendos (defensa y bonos de profesión):</p>'+Object.values(window.OUTFITS||{}).filter(o=>o.c&&hasPlan(o.n)).map(o=>btn(o.n+' (def +'+o.def+' · '+Object.keys(o.b||{}).map(k=>k+' +'+o.b[k]).join(', ')+' · '+cs(o.c)+')',`outCraft('${o.n}')`)).join('');
window.outCraft=n=>{if(!hasPlan(n))return toast('Necesitas encontrar el plano.');const o=OUTFITS[n],c=costOf(o.c,1);if(!can(c))return toast('Faltan recursos.');pay(c);S.inv.push({kind:'outfit',n});toast('Fabricado: '+n);bPanel(sel)};

/* fabricación solo con chatarra (como en Fallout Shelter): el coste antiguo se convierte en chatarra */
const toScrap=c=>{if(!c)return c;if(c.scrap&&Object.keys(c).length==1)return c;const v=(c.metal||0)+(c.wood||0)*.7+(c.meds||0)*.8+(c.ammo||0)*.6+(c.fuel||0)*.6+(c.food||0)*.5+(c.elec||0)*.5;return{scrap:Math.max(3,Math.round(v/3))}};
WP.forEach(w=>{if(w.c)w.c=toScrap(w.c)});Object.values(window.OUTFITS||{}).forEach(o=>{if(o.c)o.c=toScrap(o.c)});

/* ---- Almacén estilo Fallout Shelter: recursos + armas y atuendos con dibujo y estadísticas ---- */
const RCOL={C:['Común','#bdbdbd'],U:['Poco común','#7fc97f'],R:['Raro','#6aa9ff'],E:['Épico','#b36cff'],L:['Legendario','#e8b84a'],X:['Forjado','#ff8a3a']};
const btxt=b=>Object.keys(b||{}).map(k=>k+' +'+b[k]).join(' · ');
const icache={};
window.weaponIcon=n=>{const k='w'+n;if(icache[k])return icache[k];const w=WP.find(q=>q.n===n)||{},rr=RCOL[w.r||'C'];const cv=document.createElement('canvas');cv.width=96;cv.height=60;const g=cv.getContext('2d');
  g.lineJoin='round';g.lineWidth=2;g.strokeStyle='#14100a';const M='#8d959b',D='#4b5157',W='#8b5a2b',R=(x,y,w,h,f)=>{g.fillStyle=f;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h)};
  const kind=/Pistola|Revólver/.test(n)?'pistol':/Escopeta|Rifle|Carabina|Subfusil|Fusil/.test(n)?'gun':/Ballesta/.test(n)?'xbow':/Cuchillo|Machete|Bisturí/.test(n)?'blade':'blunt';
  if(kind==='pistol'){R(22,18,46,12,M);R(24,14,38,6,D);g.beginPath();g.moveTo(26,30);g.lineTo(40,30);g.lineTo(36,50);g.lineTo(22,50);g.closePath();g.fillStyle=W;g.fill();g.stroke();R(60,20,14,8,D)}
  else if(kind==='gun'){const long=/Rifle|Fusil|francotirador/.test(n);R(30,20,long?56:46,7,M);R(8,18,26,12,W);R(40,27,10,6,D);R(48,12,18,6,D);g.beginPath();g.moveTo(38,27);g.lineTo(44,40);g.lineTo(52,40);g.lineTo(50,27);g.closePath();g.fillStyle=D;g.fill();g.stroke()}
  else if(kind==='xbow'){R(12,28,66,7,W);g.beginPath();g.moveTo(62,10);g.quadraticCurveTo(84,32,62,52);g.lineWidth=4;g.strokeStyle='#14100a';g.stroke();g.lineWidth=2.4;g.strokeStyle=M;g.stroke();g.lineWidth=2;g.strokeStyle='#14100a';g.beginPath();g.moveTo(62,10);g.lineTo(46,31);g.lineTo(62,52);g.strokeStyle='#d9d2b8';g.stroke();g.strokeStyle='#14100a'}
  else if(kind==='blade'){g.beginPath();g.moveTo(34,30);g.lineTo(84,22);g.lineTo(84,30);g.lineTo(36,38);g.closePath();g.fillStyle='#c9d0d4';g.fill();g.stroke();R(12,28,22,10,W);R(32,24,5,18,D)}
  else{g.lineWidth=6;g.strokeStyle='#14100a';g.beginPath();g.moveTo(14,50);g.lineTo(74,14);g.stroke();g.lineWidth=3.5;g.strokeStyle=W;g.stroke();g.lineWidth=2;g.strokeStyle='#14100a';
    if(/Hacha/.test(n)){g.beginPath();g.moveTo(62,8);g.lineTo(88,14);g.lineTo(80,34);g.lineTo(66,24);g.closePath();g.fillStyle=M;g.fill();g.stroke()}
    else if(/Llave|Soplete/.test(n)){g.beginPath();g.arc(76,14,10,0,7);g.fillStyle=M;g.fill();g.stroke()}
    else if(/Azada/.test(n)){g.beginPath();g.moveTo(66,14);g.lineTo(90,26);g.lineTo(80,38);g.lineTo(62,22);g.closePath();g.fillStyle=M;g.fill();g.stroke()}
    else{R(62,8,22,14,W);g.fillStyle='#cfd6d8';[[66,6],[74,4],[80,10],[70,24]].forEach(q=>{g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0]+4,q[1]-6);g.lineTo(q[0]+8,q[1]);g.fill()})}}
  return icache[k]=cv.toDataURL()};
window.outfitIcon=n=>{const k='o'+n;if(icache[k])return icache[k];const v=V[n],o=(window.OUTFITS||{})[n];const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');if(!v||!o)return icache[k]=cv.toDataURL();
  g.fillStyle=v[0];g.strokeStyle='#14100a';g.lineWidth=2;g.beginPath();g.moveTo(6,58);g.quadraticCurveTo(8,34,24,26);g.lineTo(26,14);g.quadraticCurveTo(32,20,38,14);g.lineTo(40,26);g.quadraticCurveTo(56,34,58,58);g.closePath();g.fill();g.stroke();
  shapes(g,v,o.r,18,28,46,57);return icache[k]=cv.toDataURL()};
const iCard=(it,cnt,who)=>{const mb=it.mod?'<div class="invb" style="color:#ffb070">'+(it.mod==='inc'?'🔥 Complemento incendiario':'🎯 Complemento perforante')+'</div>':'';const isO=it.kind==='outfit',nm=it.n,o=isO?(window.OUTFITS||{})[nm]:null,w=isO?null:WP.find(q=>q.n===nm);if(!o&&!w)return '';
  const rar=RCOL[(o?o.r:(w.r||'C'))]||RCOL.C,stat=o?'🛡 Defensa +'+o.def:'⚔ Daño +'+w.v,b=btxt(o?o.b:w.b);
  return '<div class="invc" style="border-color:'+rar[1]+'"><img src="'+(o?outfitIcon(nm):weaponIcon(nm))+'" class="invi" style="box-shadow:0 0 8px '+rar[1]+'55"><div><b style="color:'+rar[1]+'">'+nm+(cnt>1?' ×'+cnt:'')+'</b><div class="invs">'+stat+'</div><div class="invb">'+(b||'sin bonos')+'</div>'+mb+'<div class="invr">'+rar[0]+(who?' · '+who:'')+'</div></div></div>'};
window.storeTab=window.storeTab||'res';
window.storeMenu=function(){const d=rate(),tab=window.storeTab;
  const tb=(k,t)=>'<button class="'+(tab===k?'primary':'')+'" onclick="storeTab=\''+k+'\';storeMenu()">'+t+'</button>';
  let h='<p style="display:flex;gap:6px;flex-wrap:wrap">'+tb('res','Recursos')+(window.MATK?tb('mat','Materiales'):'')+tb('wp','Armas')+tb('out','Atuendos')+'</p>';
  if(tab==='mat')h+=matHtml()+capBtn();
  else if(tab==='res')h+='<div class="invg">'+RK.filter(r=>r[0]!=='elec'&&r[0]!=='rp'&&!(window.MATK&&MATK.includes(r[0]))).map(r=>'<div class="invc"><img src="'+ICO[r[0]]+'" width=26 height=26><div><b>'+r[1]+'</b><div class="invs">'+Math.floor(S.res[r[0]])+' / '+cap()+'</div><div class="invb">'+(d[r[0]]>=0?'+':'')+(d[r[0]]/10).toFixed(1)+' por minuto</div></div></div>').join('')+'</div>'+capBtn();
  else{const wantO=tab==='out',list={},eq=[];
    (S.inv||[]).forEach(it=>{const isO=it.kind==='outfit';if(it.kind==='clothing'||(isO!==wantO))return;const k=it.n+'|'+(it.mod||'');list[k]=(list[k]||0)+1});
    S.ppl.forEach(p=>{const n=wantO?p.outfit:(p.wp&&p.wp.n);if(n)eq.push(iCard(wantO?{kind:'outfit',n}:{n,mod:p.wp.mod},1,'lo lleva '+p.n.split(' ')[0]))});
    const own=Object.keys(list).map(k=>{const [n,m]=k.split('|');return iCard(wantO?{kind:'outfit',n}:{n,mod:m||null},list[k],'')});
    h+=(own.length?'<p><b>En el almacén</b></p><div class="invg">'+own.join('')+'</div>':'<p><small>No hay '+(wantO?'atuendos':'armas')+' guardados. Fabrícalos en el taller (con chatarra y planos) o encuéntralos en misiones.</small></p>')+(eq.length?'<p><b>Equipados</b></p><div class="invg">'+eq.join('')+'</div>':'')}
  show('Almacén',h)};
})();
