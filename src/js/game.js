
const vw=()=>Math.max(1,document.documentElement.clientWidth||window.innerWidth||screen.width),vh=()=>Math.max(1,document.documentElement.clientHeight||window.innerHeight||screen.height);
'use strict';
/* ================= DATOS ================= */
let KEY=(()=>{try{return localStorage.getItem('dtls_slotkey')||'dtls1'}catch(e){return'dtls1'}})();const N=80,rn=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rn(a,b+1)),pk=a=>a[ri(0,a.length-1)],cl=(v,a,b)=>Math.max(a,Math.min(b,v)),$=i=>document.getElementById(i);
const RK=[['food','Comida','#d6502e'],['water','Agua','#3a9be0'],['wood','Madera','#a8743a'],['metal','Metal','#aab3bd'],['meds','Medicinas','#e8466a'],['ammo','Munición','#d9a23a'],['elec','Electricidad','#f2d43c']];
const IV={food:30,water:30,wood:60,metal:120,meds:300,ammo:180,fuel:240,elec:30};delete IV.fuel;
const RN={};RK.forEach(r=>RN[r[0]]=r[1].toLowerCase());
const ICO={};RK.forEach(([k,,col])=>{const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.fillStyle=col;x.strokeStyle='#111';x.lineWidth=1.5;
({food:()=>{x.beginPath();x.arc(10,12,6,0,7);x.fill();x.stroke();x.fillStyle='#3a3';x.fillRect(9,3,2,4)},water:()=>{x.beginPath();x.moveTo(10,2);x.quadraticCurveTo(18,12,10,18);x.quadraticCurveTo(2,12,10,2);x.fill();x.stroke()},wood:()=>{x.fillRect(2,4,16,5);x.fillRect(2,11,16,5);x.strokeRect(2,4,16,5);x.strokeRect(2,11,16,5)},metal:()=>{x.beginPath();x.moveTo(3,15);x.lineTo(6,6);x.lineTo(15,6);x.lineTo(18,15);x.closePath();x.fill();x.stroke()},meds:()=>{x.fillRect(7,2,6,16);x.fillRect(2,7,16,6)},ammo:()=>{for(let i=0;i<3;i++){x.fillRect(3+i*5,6,4,11);x.fillStyle='#b55';x.fillRect(3+i*5,3,4,4);x.fillStyle=col}},fuel:()=>{x.fillRect(4,5,11,13);x.strokeRect(4,5,11,13);x.fillRect(11,2,5,4)},elec:()=>{x.beginPath();x.moveTo(12,1);x.lineTo(4,11);x.lineTo(9,11);x.lineTo(7,19);x.lineTo(16,8);x.lineTo(10,8);x.closePath();x.fill();x.stroke()}})[k]();ICO[k]=c.toDataURL()});
const BT={
hall:{n:'Ayuntamiento',w:4,h:4,z:34,c:'#8b95a1',cost:{},lv:1,hp:700,p:{wood:15,metal:6},job:['Recolector','Constructor'],slots:3,f:'Centro de la ciudad. Su nivel desbloquea edificios y mejoras.'},
house:{n:'Casa',w:2,h:2,z:20,c:'#c19a68',cost:{wood:40},lv:1,hp:120,f:'Aumenta la capacidad de población (+4 por nivel).'},
farm:{n:'Granja',w:3,h:3,z:4,c:'#6b4a2a',cost:{wood:60},lv:1,hp:100,p:{food:14},job:['Agricultor','Cocinero'],slots:3,f:'Produce comida. Agricultores y cocineros rinden más.'},
well:{n:'Pozo y depósito',w:2,h:2,z:10,c:'#8a949e',cost:{wood:50,metal:10},lv:1,hp:100,p:{water:12},job:['Recolector','Constructor'],slots:2,f:'Produce y almacena agua.'},
wall:{n:'Valla y muro',w:1,h:1,z:14,c:'#a39d90',cost:{wood:5,metal:2},lv:1,hp:160,f:'Empieza como valla metálica y se mejora a madera, piedra, ladrillo y acero (nivel 1-5).'},
barricade:{n:'Barricada',w:1,h:1,z:9,c:'#9b7045',cost:{wood:12,metal:4},lv:1,hp:110,f:'Defensa ligera de madera y metal. Bloquea a los zombis.'},
gate:{n:'Puerta reforzada',w:1,h:1,z:16,c:'#6b5a46',cost:{wood:15,metal:15},lv:2,hp:420,f:'Segmento de muralla muy resistente.'},
road:{n:'Carretera',w:1,h:1,z:0,c:'#77736b',cost:{wood:2},lv:1,hp:1,f:'Los edificios junto a una carretera producen un 10% más.'},
hosp:{n:'Hospital',w:3,h:3,z:30,c:'#e8eef0',cost:{wood:150,metal:60},lv:2,hp:220,p:{meds:3},job:['Médico'],slots:2,pw:1,f:'Cura heridos y produce medicinas. Requiere energía.'},
barr:{n:'Barracones',w:3,h:3,z:26,c:'#7a8a52',cost:{wood:140,metal:50},lv:2,hp:240,job:['Soldado'],slots:3,f:'Entrena soldados y aumenta el tamaño del ejército.'},
tower:{n:'Torre de vigilancia',w:2,h:2,z:108,c:'#85705a',cost:{wood:100,metal:50},lv:2,hp:160,fire:{r:7,d:10,rt:1},gun:1,slots:2,job:['Soldado'],f:'Puesto de tirador: solo dispara si asignas 1 o 2 ciudadanos con arma. Alcance y daño dependen del arma (gasta munición).'},
store:{n:'Almacén',w:3,h:3,z:24,c:'#5f7a96',cost:{wood:120,metal:30},lv:2,hp:220,f:'Capacidad de recursos +250 por nivel.'},
work:{n:'Taller de armas',w:3,h:3,z:26,c:'#94704a',cost:{wood:200,metal:100},lv:3,hp:220,p:{ammo:8},job:['Mecánico'],slots:2,pw:1,f:'Produce munición y fabrica armas. Requiere energía.'},
expo:{n:'Centro de expediciones',w:3,h:3,z:26,c:'#b0985f',cost:{wood:220,metal:80},lv:3,hp:200,job:['Explorador'],slots:2,f:'Permite enviar equipos al mundo exterior.'},
fact:{n:'Fábrica',w:4,h:3,z:34,c:'#7a7f85',cost:{wood:300,metal:150},lv:4,hp:280,p:{metal:14},job:['Mecánico'],slots:3,pw:1,f:'Produce metal. Requiere energía.'},
gen:{n:'Generador',w:2,h:2,z:20,c:'#c9a93a',cost:{wood:100,metal:60},lv:2,hp:130,p:{elec:20},job:['Mecánico','Científico'],slots:2,f:'Da energía a la base. Sus trabajadores y su nivel suben la capacidad.'},
lab:{n:'Laboratorio',w:3,h:3,z:28,c:'#4e8f8a',cost:{wood:260,metal:180},lv:4,hp:220,job:['Científico'],p:{rp:24},slots:2,pw:1,f:'Necesario para investigar tecnologías. Requiere energía.'},
trap:{n:'Trampa',w:1,h:1,z:3,c:'#777',cost:{metal:12},lv:2,hp:90,tech:'def2',f:'Daña a los zombis que pasan por encima.'},
turret:{n:'Arma automática',w:1,h:1,z:14,c:'#4a4f58',cost:{metal:70,wood:20},lv:3,hp:130,tech:'arms2',fire:{r:5,d:5,rt:.35},f:'Torreta de disparo rápido (gasta munición).'}};
Object.assign(BT,{
bridge:{n:'Puente',w:1,h:1,z:0,c:'#8a6240',cost:{wood:15,metal:3},lv:1,hp:90,wb:1,f:'Se construye sobre el agua. Cruzar ríos y lagos sin puente es lento para todos, también para los zombis.'},
dock:{n:'Muelle de pesca',w:2,h:2,z:14,c:'#8a6a45',cost:{wood:90,metal:10},lv:2,hp:110,p:{food:12},job:['Recolector','Agricultor'],slots:2,dk:1,f:'Se construye en la orilla, con parte sobre el agua. Los pescadores producen comida.'},
pump:{n:'Estación de bombeo',w:2,h:2,z:22,c:'#6f8fa3',cost:{wood:110,metal:50},lv:2,hp:140,p:{water:24},job:['Mecánico','Recolector'],slots:2,pm:1,f:'Debe estar junto al agua. Produce el doble de agua que un pozo.'},
mine:{n:'Mina',w:3,h:3,z:26,c:'#7a6e5c',cost:{wood:170,metal:40},lv:3,hp:220,p:{metal:12},job:['Mecánico','Recolector'],slots:3,mt:1,f:'Solo en montaña. Extrae metal sin necesitar electricidad.'},
mtower:{n:'Torre de montaña',w:2,h:2,z:104,c:'#7a7a74',cost:{wood:120,metal:90},lv:3,hp:200,fire:{r:11,d:12,rt:1.1},gun:1,slots:2,job:['Soldado'],mt:1,f:'Solo en montaña. Más alcance que la torre normal. Necesita 1 o 2 ciudadanos con arma asignados (gasta munición).'}});
['wall','gate','trap','turret'].forEach(k=>BT[k].anyb=1);delete BT.barricade;
const PAINT={wall:1,gate:1,road:1,trap:1,bridge:1};
const PF=['Médico','Soldado','Constructor','Agricultor','Cocinero','Explorador','Mecánico','Recolector','Científico'];
const PC={Médico:'#ddd',Soldado:'#6b7a3a',Constructor:'#e0a020',Agricultor:'#7a5a2a',Cocinero:'#eee',Explorador:'#3a6a9a',Mecánico:'#3a3a8a',Recolector:'#8a4a2a',Científico:'#2a8a8a'};
const TRAITS=['Trabajador','Optimista','Sociable','Resistente','Valiente','Perezoso','Reservado','Ingenioso'];
const SKINS=['#e8b88a','#c98f68','#f0c9a0','#9d684b','#dca77e'],HAIRS=['#2a1a10','#5a3a1a','#c8a050','#1c1c1c','#8a3a1a'],SHIRTS=['#647d4b','#4c6680','#8b6045','#6c647d','#9b914e'];
const SPC={Médico:['Cirujano','Paramédico'],Soldado:['Fusilero','Defensa'],Constructor:['Carpintero','Albañil'],Agricultor:['Horticultor','Ganadero'],Cocinero:['Conservas','Panadero'],Explorador:['Rastreador','Cartógrafo'],Mecánico:['Electricista','Armero'],Recolector:['Pescador','Chatarrero'],Científico:['Químico','Biólogo']};
const NM=['Ana','Luis','Marta','Carlos','Elena','Jorge','Lucía','Pablo','Sara','Diego','Irene','Hugo','Nora','Raúl','Clara','Iván','Rosa','Tomás'],NMF=['Ana','Marta','Elena','Lucía','Sara','Irene','Nora','Clara','Rosa'],NMM=['Luis','Carlos','Jorge','Pablo','Diego','Hugo','Raúl','Iván','Tomás'],sexOfName=n=>{const f=String(n||'').split(' ')[0];return NMF.includes(f)?'F':NMM.includes(f)?'M':null},AP=['Vega','Ruiz','Soto','Marín','Lara','Cruz','Ortiz','Peña','Gil','Rey'];
const CL={soldado:{n:'Soldado básico',dmg:9,def:2,rng:4},franco:{n:'Francotirador',dmg:20,def:1,rng:8,t:'arms1'},medico:{n:'Médico militar',dmg:3,def:1,rng:3,t:'med1'},ing:{n:'Ingeniero',dmg:5,def:2,rng:2,t:'cons1'},expl:{n:'Explorador',dmg:8,def:1,rng:4,t:'expl1'},pesado:{n:'Soldado pesado',dmg:12,def:6,rng:3,t:'def1'},esp:{n:'Arma especial',dmg:30,def:3,rng:5,t:'arms2'}};
const WP=[{n:'Pistola',v:5,c:{metal:20,ammo:10}},{n:'Escopeta',v:9,c:{metal:40,wood:10,ammo:20}},{n:'Rifle de asalto',v:14,c:{metal:70,ammo:30},t:'arms1'}];
const ZT={z:{n:'Zombi',hp:48,sp:.72,d:7,c:'#79a05a'},f:{n:'Zombi gordo',hp:170,sp:.5,d:10,c:'#79a05a',big:1},s:{n:'Zombi soldado',hp:125,sp:.68,d:9,c:'#79a05a'},r:{n:'Zombi corredor',hp:36,sp:1.55,d:6,c:'#79a05a'},b:{n:'Bandido',hp:55,sp:.95,d:8,c:'#8a6a4a',rng:4}};
const KINDS=['Ataque pequeño','Ataque nocturno','Horda numerosa','Asedio','Ataque sorpresa'];
const ZCLOTH=[{slot:'vest',n:'Chaleco gastado',def:1,col:'#786b45'},{slot:'jacket',n:'Chaqueta vieja',def:1,col:'#59636a'},{slot:'pants',n:'Pantalones resistentes',def:0,col:'#514b3c'},{slot:'boots',n:'Botas de trabajo',def:0,col:'#59402d'},{slot:'pack',n:'Mochila usada',def:0,col:'#705438'}];
const TECH=[['agri1','Agricultura','Riego mejorado',1,{wood:100,metal:50},'Granjas +25% producción'],['agri2','Agricultura','Cultivos resistentes',3,{wood:200,metal:120},'Granjas +25% más'],['med1','Medicina','Antibióticos',2,{wood:100,metal:60,meds:20},'Desbloquea médicos militares; epidemias más leves'],['med2','Medicina','Cirugía avanzada',3,{wood:180,metal:100,meds:40},'Hospital +25% producción'],['cons1','Construcción','Herramientas',1,{wood:120,metal:60},'Costes -10%; desbloquea ingenieros'],['cons2','Construcción','Prefabricados',3,{wood:220,metal:140},'Costes -10%; fábrica +25%'],['energy1','Energía','Paneles',2,{wood:140,metal:100},'Generadores +25%'],['energy2','Energía','Motor eficiente',4,{wood:240,metal:160},'Generadores +25% más de energía'],['arms1','Armamento','Munición mejorada',2,{wood:120,metal:100,ammo:30},'Daño +20%; francotiradores y rifles'],['arms2','Armamento','Armas automáticas',4,{wood:260,metal:200,ammo:60},'Desbloquea torretas y unidad especial'],['def1','Defensa','Muros reforzados',2,{wood:140,metal:100},'Muros +50% vida; soldado pesado'],['def2','Defensa','Trampas',3,{wood:160,metal:120},'Desbloquea trampas'],['expl1','Exploración','Mapas',2,{wood:100,metal:70},'+1 plaza en expediciones; exploradores'],['expl2','Exploración','Radio de largo alcance',4,{wood:200,metal:140},'Expediciones con más botín']];
const ZN=[{n:'Gasolinera abandonada',h:1,g:1,l:{metal:[5,15],scrap:[8,20]}},{n:'Supermercado',h:1,g:1,l:{food:[40,80],water:[30,60]}},{n:'Pueblo abandonado',h:2,g:2,l:{wood:[40,90],food:[20,50]}},{n:'Hospital',h:2,g:2,l:{meds:[15,35]}},{n:'Comisaría',h:2,g:2,l:{ammo:[20,45],metal:[10,25]}},{n:'Refugio oculto',h:2,g:2,l:{water:[20,40]},s:1},{n:'Fábrica',h:3,g:3,l:{metal:[40,90]}},{n:'Campamento enemigo',h:3,g:3,l:{ammo:[30,60],food:[30,60],metal:[20,40]}},{n:'Laboratorio',h:4,g:4,l:{meds:[20,40],elec:[30,60]},tech:1},{n:'Base militar',h:4,g:5,l:{ammo:[60,110],metal:[40,80]},wp:1}];
const EVS=[{t:'Un grupo de zombis bloquea el camino.',a:'Combatir',b:'Rodear'},{t:'Un edificio inestable guarda suministros.',a:'Entrar',b:'Registrar la entrada'},{t:'Oís a un superviviente pidiendo ayuda.',a:'Rescatarlo',b:'Ignorarlo',sv:1},{t:'Hay rastros de bandidos cerca.',a:'Emboscarlos',b:'Esconderse',am:1}];
const FAC={mer:'Mercaderes',ref:'Refugiados',mil:'Militares supervivientes',com:'Comunidad aliada',ban:'Bandidos',clan:'Clan hostil'};
const MS=[['Construye 3 casas',()=>cnt('house')>=3,{wood:100,food:50},'Principal'],['Mejora el ayuntamiento al nivel 2',()=>hallLv()>=2,{metal:100,meds:20},'Principal'],['Alcanza 10 supervivientes',()=>S.ppl.length>=10,{food:100,water:60},'Principal'],['Construye una torre de vigilancia',()=>cnt('tower')>=1,{ammo:30},'Principal'],['Rechaza tu primera horda',()=>S.stat.hordes>=1,{metal:80,ammo:30},'Principal'],['Completa una expedición',()=>S.stat.exps>=1,{meds:30,food:40},'Secundaria'],['Aloja a 3 soldados en el ejército',()=>S.ppl.filter(p=>p.arm).length>=3,{ammo:30},'Secundaria'],['Investiga una tecnología',()=>Object.keys(S.tech).length>=1,{wood:100,metal:60},'Secundaria'],['Construye el Taller de armas',()=>cnt('work')>=1,{metal:100},'Secundaria'],['Rescata o recluta 5 supervivientes',()=>S.stat.rescued>=5,{food:100,meds:50,sv:2},'Secundaria'],['Construye una puerta en tu muro',()=>cnt('gate')>=1,{ammo:50,metal:50},'Secundaria'],['Sobrevive 20 días',()=>S.day>=20,{wood:300,metal:200,sv:2},'Logro'],['Diario: recolecta 5 veces en el mapa',()=>S.dh>=5,{wood:40},'Diario'],['Diario: completa una formación',()=>S.dt>=1,{food:30},'Diario']];
/* ================= UTILIDADES ================= */
let POW=true,S,occ,bm={},Z=[],U=[],FX=[],T=0,dirtyT=1,placing=null,sel=0,cam={x:-300,y:0,z:1},exSel=[],horde=null,keys={},dpr=1;
/* varios archivos preguntan window.horde, pero horde es 'let' (no está en window): sin esto, para ellos nunca había horda */
Object.defineProperty(window,'horde',{get:()=>horde,configurable:true});
const th=id=>S.tech[id],byId=id=>S.ppl.find(p=>p.id==id),cnt=t=>S.bld.filter(b=>b.type==t).length,realHall=()=>{const h=S.bld.find(b=>b.type=='hall');return h?h.lvl:1},hallLv=()=>S.mode==='creativo'?25:realHall(),mhp=p=>Math.round((100+(p.lvl-1)*10+(p.at?p.at.f*4:0))*(th('med3')?1.1:1)*(th('med4')?1.1:1));
const cap=()=>S.mode==='creativo'?999999:300+hallLv()*100+(S.cx||0)*100+S.bld.filter(b=>b.type=='store').reduce((a,b)=>a+250*b.lvl,0)+S.bld.filter(b=>b.type=='silo').reduce((a,b)=>a+200*b.lvl,0),pcap=()=>4+S.bld.filter(b=>b.type=='house').reduce((a,b)=>a+4*b.lvl,0)+S.bld.filter(b=>b.type=='bunker').reduce((a,b)=>a+8*b.lvl,0),acap=()=>3+S.bld.filter(b=>b.type=='barr').reduce((a,b)=>a+4*b.lvl,0);
const disc=()=>1-Math.min(.3,.04*S.ppl.filter(p=>p.prof=='Constructor').length)-(th('cons1')?.1:0)-(th('cons2')?.1:0)-(th('cons3')?.08:0)-(th('cons4')?.08:0);
const costOf=(c,m=1)=>{const o={};for(const k in c)o[k]=Math.ceil(c[k]*m*disc());return o},can=c=>S.mode==='creativo'||Object.keys(c).every(k=>S.res[k]>=c[k]),pay=c=>{if(S.mode==='creativo')return;for(const k in c)S.res[k]-=c[k]},cs=c=>Object.keys(c).filter(k=>c[k]).map(k=>Math.round(c[k]*10)/10+' '+RN[k]).join(', ')||'gratis';
const mxhp=b=>Math.round(BT[b.type].hp*b.lvl*((b.type=='wall'||b.type=='gate')&&th('def1')?1.5:1)*((b.type=='wall'||b.type=='gate')?(th('def3')?1.25:1)*(th('def4')?1.2:1):1));
const wk=b=>S.ppl.filter(p=>p.job==b.id&&(BT[b.type].gun||!p.arm)&&!p.away),slots=b=>BT[b.type].gun?2:BT[b.type].slots?BT[b.type].slots+b.lvl-1:0;
const gunners=b=>wk(b).filter(p=>p.wp&&p.hp>20&&!p.preg&&p.age>=18).slice(0,2),wpStat=(p,f)=>{const v=p.wp.v||5,n=(p.wp.n||'').toLowerCase();let r=.8+v*.03,d=v*1.1,rt=f.rt*1.0;if(n.includes('escopeta')){r=.72;d=v*1.9;rt=f.rt*1.5}else if(n.includes('rifle')||n.includes('franco')){r=1.15+v*.02;d=v*1.5;rt=f.rt*.85}else if(n.includes('pistola')){r=.85;d=v*1.2;rt=f.rt*.8}return{r:f.r*r,d:d+p.sk*.6,rt}};
const skFor=(p,d)=>Math.max(0,...d.job.map(j=>((p.ps&&p.ps[j])||0)+(window.eqB?eqB(p,j):0))),eff=(p,d)=>{const s=skFor(p,d);return .35*(s>0?1.6*(1+.2*s):.7*(1+.2*p.sk))};
const upow=p=>{const c=CL[p.arm||'soldado'];return Math.round((c.dmg+(p.wp?p.wp.v:0)+p.lvl*2+p.sk)*1.5+mhp(p)/10+c.def*3+(window.eqPow?eqPow(p):0))};
const armyPow=()=>S.ppl.filter(p=>p.arm&&!p.away&&p.hp>20).reduce((a,p)=>a+upow(p),0)+S.bld.reduce((a,b)=>a+(BT[b.type].fire?(BT[b.type].gun?gunners(b).length:1)*15:0),0);
function toast(m){const L=$('log');[...L.children].forEach(c=>{if(c.textContent===m)c.remove()});while(L.children.length>=2)L.firstChild.remove();const d=document.createElement('div');d.textContent=m;L.appendChild(d);setTimeout(()=>d.remove(),4500)}
const btn=(l,f,d)=>`<button ${d?'disabled':''} onclick="${f}">${l}</button>`;
const bar=(l,v,c)=>`<div>${l} ${Math.round(v)}</div><div class="bar"><i style="width:${cl(v,0,100)}%;background:${c}"></i></div>`;
function show(t,h){$('pan').innerHTML='<h3 class="panel-title"><span>'+t+'</span><button class="panel-x" onclick="hide()" aria-label="Cerrar">✕</button></h3><div class="panel-body">'+h+'</div><div class="panel-footer"><button onclick="hide()">Cerrar</button></div>';$('pan').style.display='block';$('pan').scrollTop=0}function hide(){$('pan').style.display='none'}
/* ================= ESTADO / MAPA ================= */
function mkP(prof){const P0=mkP0(prof);const sx=Math.random()<.5?'M':'F';P0.sex=sx;P0.n=pk(sx==='F'?NMF:NMM)+' '+pk(AP);return P0}
function mkP0(prof){prof=prof||pk(PF);const sk=ri(1,4),ps={};ps[prof]=sk;return{id:S.id++,n:'',age:ri(18,58),sex:'M',prof,sp:pk(SPC[prof]),lvl:1,xp:0,hp:100,mor:80,sk,ps,job:0,arm:null,wp:null,away:0,x:20,y:20,tx:20,ty:20,hunger:100,thirst:100,fatigue:ri(5,25),injury:0,illness:'',trait:pk(TRAITS),rel:{},gear:{armor:0,pack:0},clothes:{},look:{skin:pk(SKINS),hair:pk(HAIRS),shirt:pk(SHIRTS)}}}
function addB(type,x,y,w,h,rot){const d=BT[type],b={id:S.id++,type,x,y,w:w||d.w,h:h||d.h,lvl:1,hp:0,rot:rot||0};b.hp=mxhp(b);S.bld.push(b);return b}
function rebuild(){occ=new Int32Array(N*N);bm={};S.obs.forEach(o=>occ[o.y*N+o.x]=-1);S.bld.forEach(b=>{bm[b.id]=b;for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++)occ[(b.y+j)*N+b.x+i]=b.id});dirtyT=1}
// Limpiadores visibles: unidades autónomas que recorren el asentamiento y retiran obstáculos.
let cleanerUnits=[];
function syncCleanerUnits(){
 const n=cl(Number(S.cleaners)||0,0,5),hall=S.bld.find(b=>b.type==='hall')||{x:26,y:26,w:4,h:4};
 while(cleanerUnits.length<n){const i=cleanerUnits.length;cleanerUnits.push({x:hall.x+hall.w+1+(i%3)*.6,y:hall.y+1+Math.floor(i/3),tx:hall.x+hall.w+1,ty:hall.y+1,work:0,target:null,id:91000+i,dx:1})}
 cleanerUnits.length=n;
}
function setCleaner(){
 const n=cl(Number(S.cleaners)||0,0,5);
 show('Limpiadores',`<p>Asigna hasta 5 limpiadores. Se moverán por tu territorio, buscarán árboles y rocas y los retirarán poco a poco.</p><p><b>Asignados: <span id="cleanerCount">${n}</span> / 5</b></p>`+
 btn('−','setCleanerCount((S.cleaners||0)-1)',n<=0)+
 btn('+','setCleanerCount((S.cleaners||0)+1)',n>=5)+
 btn('Listo','bPanel(sel)'));
}
function setCleanerCount(n){
 S.cleaners=cl(Number(n)||0,0,5);syncCleanerUnits();save();setCleaner();
}
function updateCleaners(dt){
 if(!S.cleaners)return;
 syncCleanerUnits();
 const claimed=new Set();
 // Mantener objetivos distintos: cada limpiador reserva su propio obstáculo.
 cleanerUnits.forEach(u=>{
  if(u.target){const k=u.target.x+','+u.target.y;if(claimed.has(k)||!S.obs.some(o=>o.x===u.target.x&&o.y===u.target.y))u.target=null;else claimed.add(k)}
 });
 cleanerUnits.forEach((u,i)=>{
  if(u.work>0){
   u.work-=dt;
   if(u.work<=0&&u.target){
    const oi=S.obs.findIndex(o=>o.x===u.target.x&&o.y===u.target.y);
    if(oi>=0){
     const ob=S.obs[oi];
     if(ob.t==='t')S.res.wood=Math.min(cap(),S.res.wood+1);
     else S.res.metal=Math.min(cap(),S.res.metal+1);
     S.obs.splice(oi,1);S.dh=(S.dh||0)+1;rebuild();save();
    }
    const k=u.target.x+','+u.target.y;claimed.delete(k);u.target=null;
   }
   return;
  }
  if(!u.target){
   let best=null,bd=1e9;
   S.obs.forEach(o=>{
    const k=o.x+','+o.y;if(o.t==='v'||claimed.has(k)||!inOwn(o.x,o.y,0))return;
    const d=Math.hypot(o.x+.5-u.x,o.y+.5-u.y);
    if(d<bd){bd=d;best=o}
   });
   if(!best){const h=S.bld.find(b=>b.type==='hall')||{x:26,y:26,w:4,h:4};u.tx=h.x+h.w+1+(i%3);u.ty=h.y+1+Math.floor(i/3);u.mv=0;return;}
   u.target={x:best.x,y:best.y};claimed.add(best.x+','+best.y);u.tx=best.x+.5;u.ty=best.y+.5;
  }
  const dx=u.tx-u.x,dy=u.ty-u.y,d=Math.hypot(dx,dy);
  if(d>.12){const v=Math.min(d,1.05*dt);u.dx=dx<0?-1:1;u.x+=dx/d*v;u.y+=dy/d*v;u.mv=1;}
  else{u.mv=0;u.work=1.8;u.cleanAnim=T;}
 });
}
function newGame(mode){S={mode:mode||'normal',day:1,res:{food:130,water:130,wood:210,metal:55,meds:12,ammo:20,elec:0,chem:0,comp:0,scrap:40,gas:40},bld:[],ppl:[],tech:{},done:{},inv:[],fac:{mer:10,ref:5,mil:0,com:0,ban:-10,clan:-10},parc:new Array(PG*PG).fill(0).map((_,i)=>START_PARC.includes(i)?1:0),obs:[],id:1,hordeN:0,nextH:5,stat:{kills:0,hordes:0,exps:0,rescued:0},exp:null,tm:{},dayT:0,snap:null,dh:0,dt:0,ex:0,cx:0,story:0,solo:null,cleaners:0,pregnancies:[]};{const f={facil:1.25,normal:1,dificil:.8,apocaliptico:.6}[S.mode];if(f&&f!==1)['food','water','wood','metal','meds','ammo','elec'].forEach(k=>S.res[k]=Math.round(S.res[k]*f))}if(S.mode==='creativo')RK.forEach(q=>S.res[q[0]]=999999);
addB('hall',26,26);addB('house',23,26);addB('house',23,29);const f=addB('farm',31,25),w=addB('well',31,29);
[['Agricultor',f],['Agricultor',f],['Recolector',w],['Constructor',0],['Soldado',0],['Médico',0]].forEach(([pr,b])=>{const p=mkP(pr);if(pr==='Soldado'){p.arm='soldado';p.wp={n:'Pistola',v:5}}if(S.ppl.length<2){const sx=S.ppl.length===0?'M':'F';if(p.sex!==sx){p.sex=sx;p.n=pk(sx==='F'?NMF:NMM)+' '+p.n.split(' ').slice(1).join(' ')}}p.job=b?b.id:0;p.x=p.tx=27+ri(0,2);p.y=p.ty=30+ri(0,1);S.ppl.push(p)});
S.snap={...S.res};genObs();rebuild();centerOn(28,28);syncCleanerUnits()}
function vis(x,y,m){const q=P(x,y),vwz=vw()/cam.z,vhz=vh()/cam.z;return q[0]>cam.x-m&&q[0]<cam.x+vwz+m&&q[1]>cam.y-m-40&&q[1]<cam.y+vhz+m}
function mkZ(t,x,y,act){const s=1+Math.min(.9,.045*hEff())*(act?1:0),hp=ZT[t].hp*s;const z={t,x,y,hp,mhp:hp,act,tg:0,tx:0,ty:0,wear:[]};if(t==='z'){const count=Math.random()<.18?2:Math.random()<.62?1:0;const pool=ZCLOTH.slice();for(let i=0;i<count;i++){const k=ri(0,pool.length-1);z.wear.push(pool.splice(k,1)[0])}}return z}
var LIVE=false,bkT=0;
/* Copias de seguridad: bk1 = la más reciente, bk2 = la anterior. Se rotan como mucho cada 3 minutos o al cambiar de día. */
function bkRotate(key,txt,force){try{const old=txt||localStorage.getItem(key);if(!old)return;const n=Date.now(),d=(JSON.parse(old).day)||0,last=+localStorage.getItem(key+'_bkd')||0;if(!force&&n-bkT<180000&&d===last)return;const b1=localStorage.getItem(key+'_bk1');if(b1&&b1!==old)localStorage.setItem(key+'_bk2',b1);localStorage.setItem(key+'_bk1',old);localStorage.setItem(key+'_bkd',String(d));bkT=n}catch(e){}}
/* Guardado seguro: si el almacenamiento está lleno, borra copias prescindibles (nunca la partida principal de una ranura) y reintenta. Si aun así no cabe, avisa en pantalla. */
const SLOTK=['dtls1','dtls_s2','dtls_s3'];
function lsFree(cur){const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}},oth=SLOTK.filter(k=>k!==cur),all=[cur,...oth];
 return [all.flatMap(k=>[k+'_corrupt',k+'_guard']),
  all.filter(k=>{const b=g(k+'_best');return b!==null&&b===g(k)}).flatMap(k=>[k+'_best',k+'_bestd']),
  [...oth.map(k=>k+'_bk2'),cur+'_bk2'],oth.flatMap(k=>[k+'_bk1',k+'b']),[cur+'_bk1'],
  oth.flatMap(k=>[k+'_best',k+'_bestd']),[cur+'_best',cur+'_bestd']].map(ks=>ks.filter(k=>k!==KEY+'b'&&g(k)!==null))}
function lsPut(k,v){try{localStorage.setItem(k,v);return true}catch(e){}
 const cur=SLOTK.find(x=>k===x||k.startsWith(x))||KEY,gr=lsFree(cur).filter(ks=>ks.length),len=x=>{try{return(localStorage.getItem(x)||'').length}catch(e){return 0}};
 /* si ni borrando todas las copias cabría, no se borra nada */
 let room=len(k),used=0;gr.flat().forEach(x=>room+=len(x)+x.length);try{for(let i=0;i<localStorage.length;i++){const x=localStorage.key(i);used+=x.length+len(x)}}catch(e){}
 if(room<v.length-Math.max(0,1e7-used))return false;
 for(const ks of gr){ks.forEach(x=>{try{localStorage.removeItem(x)}catch(e){}});try{localStorage.setItem(k,v);return true}catch(e){}}return false}
let saveWarnT=0;
function saveFail(on){const id='saveFail';let el=document.getElementById(id);if(!on){if(el)el.remove();return}
 if(el||Date.now()-saveWarnT<180000)return;saveWarnT=Date.now();el=document.createElement('div');el.id=id;
 el.style.cssText='position:fixed;left:50%;top:44px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);background:#3a1210;border:2px solid #e0533f;color:#ffe2d8;padding:8px 10px;border-radius:8px;font:600 12px system-ui,sans-serif;display:flex;gap:8px;align-items:center;box-shadow:0 4px 18px #000a';
 el.innerHTML='<span style="flex:1">No se pudo guardar: el almacenamiento del navegador está lleno. Exporta la partida para no perder el progreso.</span><button style="padding:4px 8px">Exportar</button><button style="padding:4px 8px">✕</button>';
 const [bx,bc]=el.querySelectorAll('button');bx.onclick=()=>{try{exportSlotKey(KEY)}catch(e){}};bc.onclick=()=>el.remove();document.body.appendChild(el)}
/* force=true solo para partidas nuevas / reintentos. Nunca se guarda mientras estás en el título (LIVE=false). */
function save(force){if(S.over||!LIVE)return;const ob=S.obs;try{S.obs=ob.map(o=>o.t=='v'?N*N*2+(o.y*N+o.x)*2+(o.l?1:0):(o.y*N+o.x)*2+(o.t=='t'?0:1));const j=JSON.stringify(S);S.obs=ob;const old=localStorage.getItem(KEY);
 if(old&&!force){try{const o=JSON.parse(old);if(((o.day||0)>=3&&S.day<=1)||(o.day||0)>S.day+1){try{localStorage.setItem(KEY+'_guard',j)}catch(e){}console.warn('Guardado bloqueado: protege una partida más avanzada');return}}catch(e){}}
 if(old&&old!==j)bkRotate(KEY,old,force);if(!lsPut(KEY,j)){console.warn('No se pudo guardar: almacenamiento lleno');saveFail(1);return false}saveFail(0);try{if(S.day>=(+localStorage.getItem(KEY+'_bestd')||0)){localStorage.setItem(KEY+'_best',j);localStorage.setItem(KEY+'_bestd',String(S.day))}}catch(e){}return true}catch(e){S.obs=ob}}
function saveIdle(){(window.requestIdleCallback||setTimeout)(save)}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(!s||!s.bld)return false;S=s;delete S.res.fuel;S.bld.forEach(b=>{if(b.type=='barricade'){b.type='wall';b.lvl=1;b.hp=Math.min(b.hp||160,160)}});S.res.chem=S.res.chem||0;S.res.comp=S.res.comp||0;(S.ppl||[]).forEach(p=>{p.gear={armor:0,pack:0}});S.res.scrap=S.res.scrap||0;migrateParc();(S.ppl||[]).forEach(p=>{const sx=sexOfName(p.n);if(sx)p.sex=sx});S.obs=(S.obs||[]).map(o=>typeof o=='number'?(o>=N*N*2?{x:((o-N*N*2)>>1)%N,y:Math.floor(((o-N*N*2)>>1)/N),t:'v',l:o&1}:{x:(o>>1)%N,y:Math.floor((o>>1)/N),t:(o&1)?'s':'t'}):o).filter(o=>obsOK(o.x,o.y));S.cx=S.cx||0;S.story=S.story||0;S.cleaners=S.cleaners||0;S.pregnancies=S.pregnancies||[];{const refd=new Set(S.pregnancies.map(q=>q.mother).filter(Boolean)),loose=S.ppl.filter(p=>p.preg&&!refd.has(p.id));S.pregnancies.forEach(q=>{if(!q.mother&&!q.born){const w=loose.shift();if(w)q.mother=w.id}});loose.forEach(p=>p.preg=0)}delete S.vehicles;delete S.veh;delete S.vehicleId;if(S.mode==='creativo'){S.mode='normal';try{const cp=cap();for(const k in S.res)if(S.res[k]>cp)S.res[k]=cp}catch(e){}}(S.bld||[]).filter(b=>b.type=='gar').forEach(g=>{S.res.wood+=250;S.res.metal+=150;(S.ppl||[]).forEach(q=>{if(q.job==g.id)q.job=0})});S.bld=(S.bld||[]).filter(b=>b.type!='gar');S.solo=S.solo||null;S.tm=S.tm||{};S.dayT=S.dayT||0;horde=null;U=[];Z=[];if(S.solo&&!byId(S.solo.id))S.solo=null;if(S.exp){S.exp.team=(S.exp.team||[]).filter(i=>byId(i));if(!S.exp.team.length)S.exp=null}S.ppl.forEach(p=>{p.fl=0;p.inside=0;p.php=undefined;p.away=((S.solo&&S.solo.id===p.id)||(S.exp&&S.exp.team.includes(p.id)))?1:0;if(!p.sex)p.sex=Math.random()<.5?'M':'F';if(!p.ps){p.ps={};p.ps[p.prof]=p.sk}p.hunger=p.hunger??100;p.thirst=p.thirst??100;p.fatigue=0;p.resting=0;p.injury=p.injury??0;p.illness=p.illness||'';p.trait=p.trait||pk(TRAITS);p.rel=p.rel||{};p.gear=p.gear||{armor:0,pack:0};p.clothes=p.clothes||{};p.look=p.look||{skin:pk(SKINS),hair:pk(HAIRS),shirt:PC[p.prof]||'#647d4b'};});S.exp=S.exp||null;S.over=0;rebuild();if(S.hs)startHorde(S.hs.name||undefined,S.hs.over||undefined);return true}catch(e){console.error('load',e);return false}}
/* ================= RECURSOS / ECONOMÍA ================= */
function roadAdj(b){for(let i=-1;i<=b.w;i++)for(let j=-1;j<=b.h;j++){if((i>=0&&i<b.w)&&(j>=0&&j<b.h))continue;const x=b.x+i,y=b.y+j;if(x<0||y<0||x>=N||y>=N)continue;const o=bm[occ[y*N+x]];if(o&&o.type=='road')return 1}return 0}
function profMatch(p,b){const n=BT[b.type].job||[];return n.includes(p.prof)}
/* Sin cansancio: fatComp() sustituye al recorte medio que daba (≈0,95 al principio, 0,78 en ayuntamiento 16+) para mantener el ritmo del juego */
function fatComp(){const L=typeof hallLv==='function'?hallLv():1;return L<=2?.95:L>=16?.78:.95-(L-2)*.17/14}
function workerFactor(p,b){let f=1;if(profMatch(p,b))f*=1.28;if(p.trait==='Trabajador'||p.trait==='Ingenioso')f*=1.12;if(p.trait==='Perezoso')f*=.86;if(p.hunger<35||p.thirst<35)f*=.65;else if(p.hunger<60||p.thirst<60)f*=.85;f*=fatComp();if(p.injury>0)f*=Math.max(.65,1-p.injury/250);if(p.illness)f*=.75;return f}
function out(b,pow){const d=BT[b.type],o={};if(!d||b.pause||!d.p||b.off)return o;let m=.3;wk(b).slice(0,slots(b)).forEach(p=>m+=eff(p,d)*.925*workerFactor(p,b));if(roadAdj(b))m*=1.1;
({farm:['agri1','agri2'],gen:['energy1','energy2'],hosp:['med2'],fact:['cons2']}[b.type]||[]).forEach(t=>{if(th(t))m*=1.25});for(const k in d.p)o[k]=d.p[k]*b.lvl*m;return o}
let EAT=2.5; /* comida y agua por ciudadano y minuto (sube un poco con el ayuntamiento: una ciudad grande gasta más) */
function eatNow(){try{return 2.5+.06*Math.max(0,realHall()-8)}catch(e){return 2.5}}
function rate(){EAT=eatNow();if(window.powCalc)powCalc();const d={};RK.forEach(r=>d[r[0]]=0);S.bld.forEach(b=>{if(b.type=='gen'||!BT[b.type]){}else{const o=out(b,POW);for(const k in o)d[k]+=o[k];const cn=BT[b.type].cons;if(cn&&o[cn.k]){const f=o[cn.k]/(BT[b.type].p[cn.k]*b.lvl);for(const q in cn.use)d[q]-=cn.use[q]*f}}});d.food-=(S.ppl.length+S.ppl.filter(p=>p.preg).length)*EAT;d.water-=S.ppl.length*EAT;return d}
function resTick(r,I){EAT=eatNow();const R=S.res,k=I/600,pop=S.ppl.length;if(S.mode==='creativo'){RK.forEach(q=>R[q[0]]=999999);R.elec=0;if(window.powCalc)powCalc();return;}
if(r=='elec'){S.bld.forEach(b=>{if(b.type=='gen')b.run=b.pause?0:1});if(window.powCalc)powCalc();R.elec=0}
else S.bld.forEach(b=>{if(b.type=='gen')return;if(r=='elec'&&false)return;const o=out(b,POW);if(o[r]){const cn=BT[b.type].cons;if(cn&&cn.k==r){const f=o[r]/(BT[b.type].p[r]*b.lvl);if(!Object.keys(cn.use).every(q=>R[q]>=cn.use[q]*f*k))return;Object.keys(cn.use).forEach(q=>R[q]-=cn.use[q]*f*k)}R[r]+=o[r]*k}});
if(r=='food'){const per=EAT*k,np0=S.ppl.filter(p=>p.preg).length,_pf=(R.food=Math.max(0,R.food-np0*per)),need=pop*per,fed=R.food>=need?pop:Math.floor(R.food/per+1e-9);if(fed<pop)S.rationed=1;R.food=Math.max(0,R.food-fed*per);rationOrder().forEach((p,i)=>{if(i>=fed){p.mor=Math.max(0,p.mor-12*k);p.hp-=8*k;p.hunger=Math.max(0,(p.hunger??100)-2*k)}else{p.mor=Math.min(100,p.mor+3*k);p.hunger=Math.min(100,(p.hunger??100)+1);if(R.water>0)p.hp=Math.min(mhp(p),p.hp+6*k)}})}
if(r=='water'){const per=EAT*k,need=pop*per,fed=R.water>=need?pop:Math.floor(R.water/per+1e-9);if(fed<pop)S.rationed=1;R.water=Math.max(0,R.water-fed*per);rationOrder().forEach((p,i)=>{if(i>=fed){p.hp-=10*k;p.thirst=Math.max(0,(p.thirst??100)-2.5*k)}else p.thirst=Math.min(100,(p.thirst??100)+1.1)})}
R[r]=Math.min(R[r],cap());S.ppl.filter(p=>p.hp<=0).forEach(p=>die(p,(p.thirst??100)<25?'de sed':(p.hunger??100)<25?'de hambre':p.illness?'por enfermedad ('+p.illness+')':'por sus heridas'))}
/* personajes de historia y con rango (raros): no pueden ser traidores */
/* racionamiento: si no hay para todos, se quedan sin ración primero los comunes sin trabajo, luego los comunes con trabajo; niños, embarazadas y personajes clave, los últimos */
function rationOrder(){const pr=p=>(keyP(p)||p.age<18||p.preg)?2:(p.job&&bm[p.job])?1:0;return S.ppl.slice().sort((a,b)=>pr(b)-pr(a)||(a.id||0)-(b.id||0))}
function keyP(p){return !!(p&&(p.story||p.pres||p.rare))}
function die(p,w){
 /* el equipo de los caidos vuelve al almacen */
 try{if(p.wp){S.inv.push(p.wp);p.wp=null}if(p.outfit){S.inv.push({kind:'outfit',n:p.outfit});p.outfit=null}}catch(e){}
 if(horde&&/combate|zombi|explosión/i.test(w||''))horde.lostP=(horde.lostP||0)+1;if(!p.nd&&!p.away&&p.x!==undefined&&!/expedición|solitario/.test(w||'')){DEAD.push({x:p.x,y:p.y,t:0,col:PC[p.prof],skin:'#e8b88a',s:.9,dx:p.dx,role:p.prof,id:p.id});burst(p.x,p.y,6,'#b22',1.5,10)}S.ppl=S.ppl.filter(q=>q!==p);S.ppl.forEach(q=>q.mor=Math.max(0,q.mor-5));toast(p.n+' ha muerto'+(w?' '+w:'')+'.');sfx('death');if(!S.ppl.length)gameOver('Toda la población ha muerto.')}
function gameOver(why){if(S.over)return;S.over=1;horde=null;Z=[];U=[];S.hs=null;sfx('death');let bk=null;try{localStorage.removeItem(KEY);bk=localStorage.getItem(KEY+'b')}catch(e){}
$('alert').style.display='none';$('pan').innerHTML='<h3>Has caído</h3><p>'+why+'</p><p>Sobreviviste '+S.day+' días · '+S.stat.hordes+' hordas · '+S.stat.kills+' zombis abatidos.</p>'+(bk?btn('Reintentar desde el inicio del último día','retryDay()'):'')+btn('Empezar de nuevo','restart()');$('pan').style.display='block'}
function retryDay(){try{const b=localStorage.getItem(KEY+'b');if(b)lsPut(KEY,b)}catch(e){}horde=null;Z=[];U=[];if(load()){LIVE=true;hide();toast('Vuelves al inicio del día. ¡Prepara mejor las defensas!')}else restart()}
function restart(){horde=null;Z=[];U=[];newGame();LIVE=true;save(true);hide()}
/* ---------- Sonido y vibración ---------- */
let SND=localStorage.getItem('dtls_snd')!=='0',AC=null;
let MUSIC=localStorage.getItem('dtls_music')!=='0';
let musicVol=Math.max(0,Math.min(1,Number(localStorage.getItem('dtls_musicvol')||0.34)));
let sfxVol=Math.max(0,Math.min(1,Number(localStorage.getItem('dtls_sfxvol')||0.68)));
let musicBus=null,musicNodes=[],musicTimer=null,musicStep=0;
const SFX={horde:[[[110,0,.25,'sawtooth'],[85,.28,.4,'sawtooth']],[200,80,200]],win:[[[523,0,.12,'square'],[659,.12,.12,'square'],[784,.24,.28,'square']],[80]],lvl:[[[660,0,.1,'triangle'],[880,.1,.18,'triangle']],[40]],death:[[[196,0,.3,'triangle'],[147,.3,.45,'triangle']],[120]],done:[[[440,0,.1,'sine'],[587,.12,.2,'sine']],[50]],
 tree:[[[105,0,.32,'sawtooth'],[78,.2,.5,'triangle'],[48,.48,.65,'sine'],[190,.12,.08,'square']],[180]],
 rock:[[[310,0,.09,'square'],[185,.1,.16,'triangle'],[115,.23,.24,'sawtooth'],[420,.04,.05,'square']],[90]],
 foot:[[[95,0,.07,'triangle'],[62,.035,.1,'sine']],[0]],gun:[[[1250,0,.035,'square'],[180,.025,.22,'sawtooth'],[72,.06,.3,'triangle']],[0]],impact:[[[82,0,.16,'sawtooth'],[210,.015,.08,'triangle']],[0]],zombie:[[[92,0,.5,'sawtooth'],[68,.22,.55,'triangle'],[310,.1,.25,'sawtooth']],[0]],door:[[[180,0,.12,'square'],[105,.12,.22,'triangle'],[65,.24,.2,'sine']],[0]],alert:[[[880,0,.12,'sine'],[660,.14,.16,'sine'],[880,.34,.2,'sine']],[0]]};
function audioContext(){AC=AC||(new(window.AudioContext||window.webkitAudioContext)());if(AC.state==='suspended')AC.resume();return AC}

/* ================= MÚSICA POR SITUACIÓN (pistas del juego) ================= */
/* day = "post-apocalyptic morning": día despejado, construir y gestionar.
   night = "the world fell silent": portada, atardecer/noche, lluvia, niebla, crisis y fin de partida.
   dark = "dark cavern ambient": hordas, tormenta, expediciones y exploración en solitario. */
const MV={day:.9,night:1,dark:.85},MXF=4;
let MBUF={},MLOAD={},mLay=[],mCur=null,mKey='',mSince=0,mT=0,mLast=-1;
function mLoad(k){if(MBUF[k])return Promise.resolve(MBUF[k]);if(MLOAD[k])return MLOAD[k];
 return MLOAD[k]=new Promise((ok,no)=>{try{const bin=atob(MB[k]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const oc=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,1,32000);const p=oc.decodeAudioData(u.buffer,b=>{MBUF[k]=b;ok(b)},no);if(p&&p.catch)p.catch(no)}catch(e){no(e)}})}
function mLayer(k,fade,off,t0){const ac=AC,b=MBUF[k],src=ac.createBufferSource(),g=ac.createGain(),v=MV[k]||1;src.buffer=b;src.connect(g);g.connect(musicBus);t0=Math.max(t0||0,ac.currentTime);
 g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+Math.max(.05,fade));src.start(t0,off||0);
 const end=t0+(b.duration-(off||0)),o={k,src,g,end,nx:0,v};g.gain.setValueAtTime(v,Math.max(t0+fade,end-MXF));g.gain.linearRampToValueAtTime(0,end);
 src.onended=()=>{try{src.disconnect();g.disconnect()}catch(e){}mLay=mLay.filter(x=>x!==o)};mLay.push(o);return o}
function mOut(o,t){const ac=AC,now=ac.currentTime;try{o.g.gain.cancelScheduledValues(now);o.g.gain.setValueAtTime(o.g.gain.value,now);o.g.gain.linearRampToValueAtTime(0,now+t);o.src.stop(now+t+.1)}catch(e){}}
function mSwitch(k,t){let off=0;if(mCur){off=((AC.currentTime-(mCur.end-MBUF[mCur.k].duration))%MBUF[mCur.k].duration);mPos[mCur.k]=off;mOut(mCur,t)}const o=mPos[k]||0;mKey=k;mSince=performance.now();mCur=mLayer(k,t,Math.max(0,Math.min(o,MBUF[k].duration-MXF-2)))}
var mPos={};
function titleOpen(){const e=$('titleScreen');return!!e&&e.style.display!=='none'&&e.style.display!==''}
function musicWanted(){try{if(titleOpen()||S.over)return'night';if(horde||S.exp||S.solo)return'dark';const w=(S.adv&&S.adv.weather)||0;if(w===3)return'dark';const t=S.dayT/600,mor=S.ppl.length?S.ppl.reduce((a,p)=>a+p.mor,0)/S.ppl.length:100;if(t>=.62||w===1||w===2||mor<30||S.res.food<=0||S.res.water<=0)return'night';return'day'}catch(e){return'day'}}
function mTick(){try{if(!musicBus||!MUSIC||!AC)return;const want=musicWanted(),now=performance.now(),urgent=want==='dark'&&!!horde;
 if(want!==mKey){if(!MBUF[want]){mLoad(want).catch(()=>{})}else if(!mCur||urgent||now-mSince>25000)mSwitch(want,urgent?1.6:4)}
 if(mCur&&!mCur.nx&&mCur.end-AC.currentTime<MXF+2){mCur.nx=1;const nk=mCur.k,o=mLayer(nk,MXF,0,mCur.end-MXF);mCur=o}
 const pan=$('pan'),duck=pan&&pan.style.display==='block'?.6:1,tg=musicVol*duck;if(Math.abs(tg-mLast)>.001){mLast=tg;musicBus.gain.setTargetAtTime(tg,AC.currentTime,.4)}}catch(e){}}
function mStop(){clearInterval(mT);mT=0;const L=mLay.slice();setTimeout(()=>L.forEach(o=>{try{o.src.stop()}catch(e){}}),700);mLay=[];mCur=null;mKey=''}
function startMusic(){return;/* la música antigua queda desactivada: la gestiona sonidos2.js */try{if(!MUSIC||musicBus)return;const ac=audioContext();musicBus=ac.createGain();musicBus.gain.value=musicVol;musicBus.connect(ac.destination);mLast=musicVol;mLay=[];mCur=null;mKey='';
 mLoad(musicWanted()).then(()=>{mTick();[...Object.keys(MB)].forEach((k,i)=>setTimeout(()=>mLoad(k).catch(()=>{}),2500+i*2500))}).catch(()=>{musicBus=null;startSynthMusic()});mT=setInterval(mTick,400)}catch(e){try{musicBus=null;startSynthMusic()}catch(e2){}}}
document.addEventListener('visibilitychange',()=>{try{if(AC&&AC.state!=='closed')document.hidden?AC.suspend():AC.resume()}catch(e){}});
function startSynthMusic(){
 try{
  if(!MUSIC||musicBus)return;
  const ac=audioContext();
  musicBus=ac.createGain();musicBus.gain.value=musicVol;musicBus.connect(ac.destination);
  // Viento grave continuo y ruido filtrado: una cama ambiental sin archivos externos.
  const ambientBuffer=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),noise=ambientBuffer.getChannelData(0);
  let brown=0;for(let i=0;i<noise.length;i++){brown=(brown+.018*(Math.random()*2-1))*.997;noise[i]=brown*3.2}
  const wind=ac.createBufferSource(),windFilter=ac.createBiquadFilter(),windGain=ac.createGain();wind.buffer=ambientBuffer;wind.loop=true;windFilter.type='lowpass';windFilter.frequency.value=360;windGain.gain.value=.035;wind.connect(windFilter);windFilter.connect(windGain);windGain.connect(musicBus);wind.start();
  const windOsc=ac.createOscillator(),windOscGain=ac.createGain(),windLfo=ac.createOscillator(),windLfoGain=ac.createGain();windOsc.type='sine';windOsc.frequency.value=43;windOscGain.gain.value=.012;windLfo.frequency.value=.07;windLfoGain.gain.value=.009;windLfo.connect(windOscGain.gain);windOsc.connect(windOscGain);windOscGain.connect(musicBus);windOsc.start();windLfo.start();
  musicNodes.push(wind,windFilter,windGain,windOsc,windOscGain,windLfo,windLfoGain);
  // Cuatro paisajes musicales originales: melodía, capas armónicas y texturas ambientales.
  const tracks=[
   {name:'Ruinas',tempo:2.8,notes:[55,73.42,82.41,110,98,82.41,73.42,65.41],lead:'triangle',pad:[55,82.41,110],tone:620},
   {name:'Última señal',tempo:2.15,notes:[146.83,164.81,196,174.61,146.83,130.81,110,130.81],lead:'sine',pad:[73.42,110,146.83],tone:920},
   {name:'Horizonte muerto',tempo:3.3,notes:[65.41,77.78,98,116.54,103.83,87.31,77.78,69.3],lead:'triangle',pad:[51.91,77.78,103.83],tone:480},
   {name:'La horda',tempo:1.9,notes:[49,58.27,69.3,77.78,69.3,58.27,52,65.41],lead:'sawtooth',pad:[49,65.41,98],tone:700}
  ];
  let trackIndex=0,cycleNodes=[];
  const add=(freq,dur,wave,gain,delay,detune=0,filterHz=1800)=>{
   const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();
   o.type=wave;o.frequency.setValueAtTime(freq,t);if(detune)o.detune.value=detune;
   f.type='lowpass';f.frequency.value=filterHz;g.gain.setValueAtTime(.0001,t);
   g.gain.linearRampToValueAtTime(gain,t+.8);g.gain.setValueAtTime(gain,t+Math.max(.85,dur*.65));
   g.gain.exponentialRampToValueAtTime(.0001,t+dur);
   o.connect(f);f.connect(g);g.connect(musicBus);o.start(t);o.stop(t+dur+.04);cycleNodes.push(o,g,f);
  };
  const playTrack=()=>{
   if(!musicBus||!MUSIC)return;
   const tr=tracks[trackIndex++%tracks.length],notes=tr.notes;
   // Acordes sostenidos que hacen audible el ambiente sin tapar la melodía.
   tr.pad.forEach((f,i)=>{add(f,35,'sine',.032,0,i*3-3,500);add(f*2,28,'triangle',.012,1.5+i*.7,0,900)});
   // Melodía lenta, con pequeñas variaciones entre repeticiones.
   for(let i=0;i<24;i++){
    const f=notes[i%notes.length]*(i>7&&i%5===0?2:1);
    add(f,2.5+Math.random()*1.4,tr.lead,.045,i*tr.tempo,Math.random()*12-6,tr.tone);
    if(i%3===0)add(f*.5,3.8,'sine',.018,i*tr.tempo+.35,0,360);
   }
   // Viento tonal y pulsos lejanos, perceptibles pero secundarios.
   for(let i=0;i<7;i++){add(180+Math.random()*90,5,'sawtooth',.008,i*9,.0,260);add(38+Math.random()*9,1.1,'sine',.045,i*10,0,100)}
   setTimeout(()=>{cycleNodes=cycleNodes.filter(n=>{try{if(n.stop)n.stop();n.disconnect()}catch(e){}return false})},80000);
  };
  playTrack();musicTimer=setInterval(playTrack,42000);
 }catch(e){console.warn('Audio no disponible',e)}
}
function stopMusic(){mStop();
  if(musicTimer){clearInterval(musicTimer);musicTimer=null}
  if(musicBus){try{musicBus.gain.setTargetAtTime(0,AC.currentTime,.15);const old=musicBus;setTimeout(()=>{try{old.disconnect()}catch(e){}},700)}catch(e){}}
  musicBus=null;musicNodes.forEach(n=>{try{n.stop&&n.stop();n.disconnect()}catch(e){}});musicNodes=[];
}
function setMusic(v){MUSIC=!!v;localStorage.setItem('dtls_music',MUSIC?'1':'0');if(MUSIC)startMusic();else stopMusic()}
function setMusicVol(v){musicVol=Math.max(0,Math.min(1,Number(v)));localStorage.setItem('dtls_musicvol',String(musicVol));if(musicBus)musicBus.gain.setTargetAtTime(musicVol,AC.currentTime,.08)}
function setSfxVol(v){sfxVol=Math.max(0,Math.min(1,Number(v)));localStorage.setItem('dtls_sfxvol',String(sfxVol))}
function unlockAudio(){try{audioContext();if(MUSIC)startMusic()}catch(e){}}

/* ================= EFECTOS DE SONIDO (muestras reales) ================= */
const SG={tree:{f:['tree'],v:1},rock:{f:['rock'],v:1},punch:{f:['punch'],v:.9,gap:90,pr:.1},zombie:{f:Array.from({length:24},(_,i)=>'z'+(i+1)),v:.8,gap:250,pr:.1},
rifle:{f:['gunL'],v:.55,gap:60,pr:.04},pistol:{f:['gunS'],v:.55,gap:60,pr:.04},sniper:{f:['gunLc'],v:.6,gap:200},blaster:{f:['blS'],v:.5,gap:50,pr:.05},casing:{f:['casing'],v:.35,gap:150,pr:.1},
build:{f:['build'],v:.85},brick:{f:['brick'],v:.8},thud:{f:['wallS'],v:.75,gap:400,pr:.08},crumble:{f:['wallL'],v:.9,gap:250},
tab:{f:['menu'],v:.14,gap:40},coin:{f:['money'],v:.7},crystal:{f:['crystal'],v:.7},relic:{f:['relic'],v:.75},save:{f:['save'],v:.55},foot:{f:['run'],v:.25,gap:150,pr:.15}};
const SGM={tree:'tree',rock:'rock',foot:'foot',win:'relic',lvl:'crystal',done:'coin',build:'build',tab:'tab',zombie:'zombie',day:'save'};
let SBUF={},sVox=0,sLastT={},sLastF={};
function sLoad(){if(sLoad.d||typeof SB==='undefined')return;sLoad.d=1;Object.keys(SB).forEach(k=>{try{const bin=atob(SB[k]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const oc=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,1,32000),pr=oc.decodeAudioData(u.buffer,b=>{SBUF[k]=b},()=>{});if(pr&&pr.catch)pr.catch(()=>{})}catch(e){}})}
addEventListener('load',()=>setTimeout(sLoad,300));
function playG(k,o){try{o=o||{};if(k==='horde'){if(!SBUF.wallL)return false;playG('crumble');const bd=(typeof horde!=='undefined'&&horde&&horde.band)||(S&&S.bn&&S.bn.cur);[700,1600,2600].forEach(t=>setTimeout(()=>playG(bd?'bshout':'zombie',{g:.9}),t));return true}
const gk=SG[k]?k:SGM[k],G=SG[gk];if(!G||!SBUF[G.f[0]])return false;const ac=audioContext(),now=ac.currentTime;if(now-(sLastT[gk]||0)<(G.gap||0)/1000)return true;if(sVox>=14)return true;sLastT[gk]=now;
let f=G.f[0];if(G.f.length>1){do{f=G.f[Math.floor(Math.random()*G.f.length)]}while(f===sLastF[gk]);sLastF[gk]=f}
const src=ac.createBufferSource(),g=ac.createGain();src.buffer=SBUF[f];src.playbackRate.value=(o.rate||1)*(1+(Math.random()*2-1)*(G.pr||0));g.gain.value=G.v*(o.g===undefined?1:o.g)*sfxVol;src.connect(g);let out=g;if(o.pan&&ac.createStereoPanner){const pn=ac.createStereoPanner();pn.pan.value=o.pan;g.connect(pn);out=pn}out.connect(ac.destination);sVox++;src.onended=()=>{sVox--;try{src.disconnect();g.disconnect()}catch(e){}};src.start();return true}catch(e){return false}}
function sfxAt(k,x,y,o){if(!SND)return;o=o||{};const q=P(x,y),W=vw(),H=vh(),sx=(q[0]-cam.x)*cam.z,sy=(q[1]-cam.y)*cam.z,dx=Math.max(0,Math.abs(sx-W/2)-W/2),dy=Math.max(0,Math.abs(sy-H/2)-H/2),g=Math.max(o.floor||0,1-Math.hypot(dx,dy)/(Math.max(W,H)*1.1));if(g<.06)return;playG(k,{g:g*g*(o.v||1),rate:o.rate,pan:Math.max(-.8,Math.min(.8,(sx-W/2)/(W/2)))})}
const SFXT={};/* límite: el mismo sonido como mucho 6 veces cada 0,25 s para no saturar en las hordas */
function sfx(t){try{const now=performance.now(),q=SFXT[t]||(SFXT[t]=[]);while(q.length&&now-q[0]>250)q.shift();if(q.length>=6)return;q.push(now);const d=SFX[t];if(!SND)return;if(d&&navigator.vibrate)navigator.vibrate(d[1]);if(playG(t))return;if(!d)return;const ac=audioContext(),t0=ac.currentTime;d[0].forEach(([f,st,du,w])=>{const o=ac.createOscillator(),g=ac.createGain();o.type=w;o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+st);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.12*sfxVol),t0+st+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+st+du);o.connect(g);g.connect(ac.destination);o.start(t0+st);o.stop(t0+st+du+.05)})}catch(e){}}
function synthSound(kind){
 try{
  if(!SND)return; if(playG(kind))return; const ac=audioContext(),t=ac.currentTime;
  const osc=(freq,dur,wave,gain,delay=0,endFreq=null)=>{
   const o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();
   o.type=wave;f.type='lowpass';f.frequency.value=kind==='zombie'?850:1500;
   o.frequency.setValueAtTime(freq,t+delay);if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,t+delay+dur);
   g.gain.setValueAtTime(.0001,t+delay);g.gain.linearRampToValueAtTime(Math.max(.0001,gain*sfxVol),t+delay+.04);
   g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);
   o.connect(f);f.connect(g);g.connect(ac.destination);o.start(t+delay);o.stop(t+delay+dur+.03);
  };
  if(kind==='build'){osc(95,.22,'triangle',.22,0,58);osc(180,.12,'square',.08,.12,110);osc(420,.08,'triangle',.08,.27,250)}
  if(kind==='tab'){osc(660,.055,'sine',.03);osc(880,.045,'sine',.015,.025)}
  if(kind==='zombie'){
   const base=42+Math.random()*17;
   osc(base,.85,'sawtooth',.16,0,base*.62);
   osc(base*2.1,.68,'triangle',.07,.04,base*1.35);
   osc(base*.52,1.05,'sawtooth',.12,.12,base*.4);
  }
 }catch(e){}
}
// Voces de aldeanos desactivadas: los personajes no reproducen diálogos hablados.
function speakVillager(){return false}
function togSnd(){SND=!SND;if(!SND){speechBusy=false}try{localStorage.setItem('dtls_snd',SND?'1':'0')}catch(e){}menu()}
document.addEventListener('pointerdown',function audioFirstTouch(){unlockAudio()},{once:true});
let fading=0;
/* Reloj: 24 horas en 10 minutos reales (600 s). Solo se muestran las horas. Amanece a las 05:00. */
function gameHour(){return Math.floor((5+S.dayT/600*24)%24)}
function clockTxt(){return String(gameHour()).padStart(2,'0')+':00'}
/* Cambio de día sin pantalla de "Día N" ni informe: solo avisos breves de lo importante. */
function nextDay(){if(fading)return;const r=doDay();sfx&&sfx('day');const notes=[];String((r&&r[1])||'').replace(/<p>• (.*?)<\/p>/g,(m,t)=>{notes.push(t.replace(/<[^>]+>/g,''))});notes.slice(0,3).forEach((t,i)=>setTimeout(()=>toast(t),400+i*900))}
function doDay(){advInit();advDaily();const ev=[];const before=S.snap||{...S.res};if(LIVE)try{lsPut(KEY+'b',JSON.stringify(S))}catch(e){}
S.day++;S.dh=0;S.dt=0;const soloReturnNotice=soloResolveReturn();if(soloReturnNotice)ev.push(soloReturnNotice);
/* envejecimiento: un año cada 10 días; desde los 65 los ciudadanos comunes pueden morir de vejez (los de historia y raros no) */
if(S.day%10===0)S.ppl.forEach(p=>{if(p.age>=18)p.age++});
if(S.autoTrain&&S.bld.some(b=>b.type==='barr')){const n=trainArmyQuiet();if(n)ev.push('Entrenamiento automático: '+n+' unidades entrenadas.')}
S.ppl.filter(p=>p.age>=65&&!keyP(p)&&!p.away&&Math.random()<(p.age-64)*.004).forEach(p=>{ev.push(p.n+' ha muerto de vejez a los '+p.age+' años.');die(p,'de vejez')});
S.ppl.forEach(p=>{p.hunger=Math.max(0,(p.hunger??100)-ri(9,15));p.thirst=Math.max(0,(p.thirst??100)-ri(11,17));p.fatigue=0;if(p.job&&!p.away)p.xp+=2;if(p.hunger<25||p.thirst<25){p.hp-=4;p.mor=Math.max(0,p.mor-5)}if(p.fatigue>85)p.mor=Math.max(0,p.mor-3);if(!p.illness&&Math.random()<((p.hunger<35||p.thirst<35)?.18:.025)){p.illness=pk(['Gripe','Infección','Fiebre']);ev.push(p.n+' ha enfermado ('+p.illness+').')}if(p.injury>0)p.injury=Math.max(0,p.injury-2)});S.ppl.filter(p=>p.hp<=0).forEach(p=>die(p,(p.thirst??100)<25?'de sed':(p.hunger??100)<25?'de hambre':p.illness?'por enfermedad ('+p.illness+')':'por sus heridas'));
/* Relaciones: compañeros de trabajo desarrollan vínculos que influyen en su moral. */
for(const b of S.bld){const team=wk(b).slice(0,slots(b));for(let i=0;i<team.length;i++)for(let j=i+1;j<team.length;j++){const a=team[i],q=team[j],key=String(q.id);if(a.rel[key]===undefined&&Math.random()<.18){const v=Math.random()<.72?'Amistad':'Rivalidad';a.rel[key]=v;q.rel[String(a.id)]=v}const v=a.rel[key];if(v==='Amistad'){a.mor=Math.min(100,a.mor+2);q.mor=Math.min(100,q.mor+2)}else if(v==='Rivalidad'){a.mor=Math.max(0,a.mor-2);q.mor=Math.max(0,q.mor-2)}}}

S.pregnancies=S.pregnancies||[];
S.pregnancies.forEach(q=>{const mo=q.mother&&byId(q.mother);if(q.mother&&!mo&&!q.born){q.done=1;ev.push('Un embarazo se ha perdido: la madre ya no está en la ciudad.');return}
if(!q.born){q.gest=(q.gest||0)+1;if(q.gest>=3){q.born=1;if(mo){mo.preg=0;mo.pcd=S.day+4}ev.push((mo?mo.n:'Una superviviente')+' ha dado a luz a '+q.name+'.')}else return}
q.grow=(q.grow||0)+1;if(q.born){const fa=q.father&&byId(q.father),mk1=nmx=>{const baby=mkP('Recolector');baby.age=0;baby.bd=S.day;baby.bd2=1;baby.job=0;baby.par=[q.mother||0,q.father||0];baby.n=nmx||baby.n;baby.sex=sexOfName(baby.n)||baby.sex;{const hh=S.bld.find(b=>b.type==='hall')||{x:26,y:26,w:4,h:4},ox=mo&&!mo.away?mo.x:hh.x+1,oy=mo&&!mo.away?mo.y:hh.y+hh.h+1;baby.x=baby.tx=ox+.4;baby.y=baby.ty=oy+.3}if(mo&&fa&&mo.look&&fa.look&&baby.look)baby.look.skin=pk([mo.look.skin,fa.look.skin]);if(window.inheritRoles)inheritRoles(baby,mo,fa);S.ppl.push(baby);return baby};const b1=mk1(q.name);ev.push('👶 '+b1.n+' ya está en la comunidad. Será adulto/a en 3 días.'+(window.inhTxt?inhTxt(b1):''));if(q.tw){const ap=(q.name||'').split(' ').slice(1).join(' '),b2=mk1(pk(NM)+(ap?' '+ap:''));ev.push('¡Gemelos! '+b2.n+' también se une a la comunidad.'+(window.inhTxt?inhTxt(b2):''))}q.done=1}});
S.pregnancies=S.pregnancies.filter(q=>!q.done);S.ppl.forEach(p=>{if(p.bd!==undefined&&p.age<18)p.age=Math.min(18,p.bd2?Math.floor((S.day-p.bd)*6):6+Math.floor((S.day-p.bd)*4))});
/* Médicos asignados al hospital atienden automáticamente a dos pacientes al día. */
const hosp=S.bld.find(b=>b.type==='hosp'),docs=hosp?wk(hosp).filter(p=>p.prof==='Médico').length:0;
if(docs){const patients=S.ppl.filter(p=>p.hp<mhp(p)-1||p.injury>0).sort((a,b)=>(a.hp/mhp(a))-(b.hp/mhp(b)));let treated=0;for(const p of patients){if(treated>=docs*2||S.res.meds<1)break;if(p.hp>=mhp(p)-1&&!p.injury)continue;S.res.meds--;p.hp=Math.min(mhp(p),p.hp+22);p.injury=Math.max(0,p.injury-25);treated++}let cured=0;for(const p of S.ppl){if(cured>=docs*2||!(S.res.abx>=1))break;if(p.illness){S.res.abx--;p.illness='';cured++}}if(treated||cured)ev.push('El equipo médico atendió a '+(treated+cured)+' supervivientes.')}

rebuild();S.res.ammo+=4;S.ppl.filter(p=>false).forEach(p=>{if(S.ppl.length>2&&Math.random()<.3){try{if(p.wp){S.inv.push(p.wp);p.wp=null}if(p.outfit){S.inv.push({kind:'outfit',n:p.outfit});p.outfit=null}}catch(e){}S.ppl=S.ppl.filter(q=>q!==p);ev.push(p.n+' ha abandonado la ciudad: la moral estaba por los suelos.')}});if(S.fac.mil>=50)S.res.ammo+=5;if(S.fac.com>=40){S.res.food+=8;S.res.wood+=5}
if(Math.random()<.4)ev.push(dayEvent());
if(S.fac.ban<-15&&Math.random()<.25){ev.push('Bandidos hostiles atacan la ciudad.');startHorde('Ataque de bandidos',{b:3+hEff()})}
if(!horde&&S.day>=S.nextH){startHorde();S.nextH=S.day+3+(S.hordeN%3==2?2:0)}else if(!horde&&S.day==S.nextH-1){let t='';try{const e=hordeEst();t=' Unos '+e.n+' enemigos ('+e.kind+'). Tu defensa: '+e.v+'.'}catch(er){}ev.push('Los vigías avisan: una horda se acerca mañana.'+t+(t.includes('Insuficiente')?' Refuerza las defensas: más torres, tiradores y soldados.':''))}
for(const k in S.res)S.res[k]=cl(S.res[k],0,cap());save();const d={};RK.forEach(r=>d[r[0]]=Math.round(S.res[r[0]]-before[r[0]]));S.snap={...S.res};
return['Día '+S.day,'<p>'+RK.map(r=>`<img src="${ICO[r[0]]}" width=14> ${r[1]}: ${d[r[0]]>=0?'+':''}${d[r[0]]}`).join('<br>')+'</p>'+ev.filter(Boolean).map(e=>'<p>• '+e+'</p>').join('')]}
function dayEvent(){const p=S.ppl.length?pk(S.ppl):null,k=ri(0,5);
if(k==0&&S.ppl.length<pcap()&&Math.random()<.12){const n=mkP();S.ppl.push(n);S.stat.rescued++;return'Refugiados piden entrar: '+n.n+' ('+n.prof+') se une a la ciudad.'}
if(k==1&&S.bld.length){const b=pk(S.bld.filter(b=>b.type!='road'));if(b){b.hp=Math.max(1,b.hp-mxhp(b)*.35);return'Incendio en '+BT[b.type].n+': daños graves.'}}
if(k==2){S.ppl.forEach(q=>q.hp-=th('med1')?6:14);return'Epidemia: todos los habitantes pierden salud.'}
if(k==3){const p=Math.random()<1/3?pk(S.ppl.filter(q=>!keyP(q)&&q.bd===undefined&&q.arrD!==undefined&&S.day-q.arrD<=10&&!q.away))||null:null;if(!p||S.ppl.length<=4)return'Día tranquilo en el asentamiento.';S.res.wood=Math.max(0,S.res.wood-20);S.res.metal=Math.max(0,S.res.metal-20);die(p,'(traicionó a la ciudad y huyó con suministros)');return'Traición: '+p.n+' roba materiales y desaparece.'}
if(k==4){S.fac.mer=Math.min(100,S.fac.mer+5);S.res.food+=30;return'Una caravana de mercaderes regala 30 de comida.'}
const r=pk(['wood','metal','meds','ammo']);S.res[r]+=25;return'Hallazgo: encuentras 25 de '+RN[r]+'.'}
/* ================= HORDAS Y COMBATE ================= */
/* fuerza de las hordas segun el progreso (capitulo y ayuntamiento), no solo segun los dias */
function hallNB(L){return L+1<10?2:3} /* edificios del nivel siguiente que pide el ayuntamiento */
function hEff(){return S.mode==='creativo'?S.hordeN:Math.min(S.hordeN,4+(S.story||0)+2*realHall(),2+Math.round(S.ppl.length*.55))}
/* previsión de la próxima horda: enemigos aproximados y comparación con la defensa */
function hordeEst(){const n=hEff(),ki=S.hordeN%KINDS.length,mult=[.72,1.05,1.35,1.18,.92][ki],settle=S.ppl.length*.22+S.bld.length*.12+realHall()*.8,PGs=S.mode==='creativo'?99:(S.story||0),base=Math.round((7+n*2.1+settle*1.05)*mult*(1+.02*Math.min(PGs,48))),cnt0=Math.max(6,Math.min(95,base));
 const comp={z:cnt0};if(n>=1&&PGs>=1)comp.r=Math.min(12,1+Math.floor(n/1.7));if(n>=2&&PGs>=3)comp.f=Math.min(8,Math.floor(n/1.8));if(n>=3&&PGs>=6)comp.s=Math.min(10,Math.floor(n/1.6));try{const r0=Math.random;Math.random=()=>.5;try{if(window.ZX&&ZX.comp)ZX.comp(comp,n,PGs)}finally{Math.random=r0}}catch(e){}
 const modeScale={facil:.65,normal:1.2,dificil:1.6,apocaliptico:2.3}[S.mode||'normal']||1,ease=Math.min(1,.4+.05*n);comp.z=Math.max(3,Math.round(cnt0*modeScale*ease));
 const hs=1+Math.min(.9,.045*n);let cnt=0,thr=0;for(const t in comp){const c=comp[t]||0;cnt+=c;thr+=c*((ZT[t]&&ZT[t].hp)||30)*hs}
 let def=0;S.ppl.forEach(p=>{if(p.away||p.age<18)return;const g=p.job&&bm[p.job]&&BT[bm[p.job].type].gun;if(p.arm)def+=upow(p)*1.0;else if(g&&p.wp)def+=(p.wp.v*4+p.lvl*3)*(1+.2*(bm[p.job].lvl-1))});
 S.bld.forEach(b=>{if(b.type==='turret')def+=40*b.lvl;else if(b.type==='mtower'||b.type==='bunker')def+=30*b.lvl});
 const r=def/Math.max(1,thr)/.12;return {n:cnt,kind:KINDS[ki],thr:Math.round(thr),def:Math.round(def),r,v:r>=1.25?"Suficiente":r>=.83?'Justa':'Insuficiente',days:Math.max(0,S.nextH-S.day)}}
function startHorde(name,over){const n=hEff(),ki=S.hordeN%KINDS.length,kn=name||KINDS[ki],mult=[.72,1.05,1.35,1.18,.92][ki],settle=S.ppl.length*.22+S.bld.length*.12+realHall()*.8,PGs=S.mode==='creativo'?99:(S.story||0),base=Math.round((7+n*2.1+settle*1.05)*mult*(1+.02*Math.min(PGs,48))),cnt0=Math.max(6,Math.min(95,base)),comp=over||{};
if(!over){comp.z=cnt0;if(n>=1&&PGs>=1)comp.r=Math.min(12,1+Math.floor(n/1.7));if(n>=2&&PGs>=3)comp.f=Math.min(8,Math.floor(n/1.8));if(n>=3&&PGs>=6)comp.s=Math.min(10,Math.floor(n/1.6));if(window.ZX&&ZX.comp)ZX.comp(comp,n,PGs)}
Z=Z.filter(z=>z.act);const night=ki==1&&!over;horde={name:kn,night,kills:0,lostB:0,lostU:0,lostP:0,rescued:0,rescueChecked:0,damaged:[],t:0,initial:cnt0,resBefore:{...S.res},bldBefore:S.bld.map(b=>({id:b.id,hp:b.hp,type:b.type}))};S.hs={name:name||null,over:over||null};
const modeScale={facil:.65,normal:1.2,dificil:1.6,apocaliptico:2.3}[S.mode||'normal']||1;const ease=Math.min(1,.4+.05*n);const scaled=Math.max(3,Math.round(cnt0*modeScale*ease));if(!over)comp.z=scaled;const dirs=[[0,0.02],[.5,0],[1,.25],[1,.75],[.5,1],[.02,.75],[.02,.25],[.5,.98]];for(const t in comp)for(let i=0;i<comp[t];i++){const d=dirs[i%dirs.length],edge= i%2?rn(-.12,.12):rn(-.08,.08);let x,y;if(d[0]===0){x=rn(1,N-1);y=1+edge*8}else if(d[0]===1){x=N-2+edge*8;y=rn(1,N-1)}else if(d[1]===0){x=rn(1,N-1);y=1+edge*8}else if(d[1]===1){x=rn(1,N-1);y=N-2+edge*8}else{const side=i%4;x=side<2?rn(1,N-1):(side===2?1:N-2);y=side<2?(side===0?1:N-2):rn(1,N-1)}Z.push(mkZ(t,cl(x,.5,N-.5),cl(y,.5,N-.5),1))}
U=[];const h=S.bld.find(b=>b.type=='hall')||{x:16,y:16};/* los alistados que son tiradores de una torre se quedan en ella (antes salían también como soldados y contaban dos veces) */S.ppl.filter(p=>p.arm&&!p.away&&p.hp>15&&!p.preg&&p.age>=18&&!(p.job&&bm[p.job]&&BT[bm[p.job].type].gun&&gunners(bm[p.job]).includes(p))).forEach((p,i)=>U.push({p,x:h.x+1+i%4,y:h.y+5+(i>>2),hp:p.hp,cd:0}));
toast(kn+'! '+Z.filter(z=>z.act).length+' enemigos desde varios puntos. Defensores: '+U.length);if(night)toast('Es de noche: las torres y torretas ven menos lejos.');sfx('horde');hide()}
function dropZombieWear(z){if(!z.wear||!z.wear.length||Math.random()>.075)return;const item=z.wear[ri(0,z.wear.length-1)];S.inv.push({kind:'clothing',slot:item.slot,n:item.n,def:item.def,col:item.col});toast('Un zombi ha dejado: '+item.n+' (botín poco frecuente).');}
function drawZombieWear(c,z){if(!z.wear||!z.wear.length)return;const q=P(z.x,z.y);z.wear.forEach(w=>{c.save();c.fillStyle=w.col;c.strokeStyle='rgba(20,20,18,.65)';c.lineWidth=1;if(w.slot==='vest'||w.slot==='jacket'){c.fillRect(q[0]-4.2,q[1]-14,8.4,7);c.strokeRect(q[0]-4.2,q[1]-14,8.4,7);if(w.slot==='vest'){c.fillStyle='#b4a36d';c.fillRect(q[0]-1,q[1]-13,2,5)}}else if(w.slot==='pants'){c.fillRect(q[0]-3.7,q[1]-7,3,6);c.fillRect(q[0]+.7,q[1]-7,3,6)}else if(w.slot==='boots'){c.fillRect(q[0]-4,q[1]-2,3,2);c.fillRect(q[0]+1,q[1]-2,3,2)}else if(w.slot==='pack'){c.fillRect(q[0]-6,q[1]-14,3,6);c.fillRect(q[0]-6,q[1]-14,3,1)}c.restore()})}
function drawSurvivorWear(c,p){if(!p.clothes)return;const q=P(p.x,p.y);Object.values(p.clothes).forEach(w=>{c.save();c.fillStyle=w.col||'#655';c.strokeStyle='rgba(10,10,10,.55)';c.lineWidth=.8;if(w.slot==='vest'||w.slot==='jacket'){c.fillRect(q[0]-3.8,q[1]-14,7.6,6.5);c.strokeRect(q[0]-3.8,q[1]-14,7.6,6.5)}else if(w.slot==='pants'){c.fillRect(q[0]-3.5,q[1]-7,2.7,5);c.fillRect(q[0]+.8,q[1]-7,2.7,5)}else if(w.slot==='boots'){c.fillRect(q[0]-3.5,q[1]-2,2.8,2);c.fillRect(q[0]+.8,q[1]-2,2.8,2)}else if(w.slot==='pack'){c.fillRect(q[0]-5.5,q[1]-13,2.2,5)}c.restore()})}
function clothingDef(p){return (window.outDef?outDef(p):0)+(p.clothes?Object.values(p.clothes):[]).reduce((a,x)=>a+(x.def||0),0)}
function lootEquip(id,i){const p=byId(id),it=S.inv[i];if(!p||!it||it.kind!=='clothing')return;p.clothes=p.clothes||{};const old=p.clothes[it.slot];if(old)S.inv.push(old);p.clothes[it.slot]=it;S.inv.splice(i,1);toast(p.n+' equipa '+it.n+'.');save();pSheet(id)}
/* derrota parcial: si cae el ayuntamiento no se pierde la partida; queda en ruinas, la horda saquea y se retira */
function hallRuin(b){const lost=[];for(const k of ['food','water','wood','metal','ammo','meds','scrap','tarp','stone','plank']){const v=Math.floor((S.res[k]||0)*.4);if(v>0){S.res[k]-=v;lost.push(v+' '+(RN[k]||k).toLowerCase())}}
 b.hp=Math.round(mxhp(b)*.25);b.ruinD=S.day;const others=S.bld.filter(x=>x!==b&&!['wall','road','gate','trap','bridge'].includes(x.type)).sort(()=>Math.random()-.5).slice(0,2);others.forEach(x=>{S.bld=S.bld.filter(y=>y!==x);S.ppl.forEach(p=>{if(p.job==x.id)p.job=0})});
 Z.forEach(z=>{if(z.act)z.hp=0});rebuild();SHK=.5;sfx('death');
 const t='El ayuntamiento ha caído, pero la ciudad resiste. Los infectados saquean y se retiran. Pérdidas: '+(lost.join(', ')||'nada')+(others.length?'; destruidos: '+others.map(x=>BT[x.type].n).join(', '):'')+'.';
 try{notify('🏚','Ayuntamiento en ruinas',t,'horda')}catch(e){}toast(t)}
function killB(b){if(b.type=='hall'&&S.mode!=='creativo'&&!S.over){hallRuin(b);return}S.bld=S.bld.filter(x=>x!==b);S.ppl.forEach(p=>{if(p.job==b.id){p.job=0;p.hp-=20}});if(horde)horde.lostB++;rebuild();FX.push({boom:1,x:b.x+b.w/2,y:b.y+b.h/2,t:.6});burst(b.x+b.w/2,b.y+b.h/2,24,'#8a7a66',3,14);burst(b.x+b.w/2,b.y+b.h/2,10,'#e0a050',2.5,10);SHK=.3;sfxAt('crumble',b.x+b.w/2,b.y+b.h/2,{floor:.2}); if(b.type=='hall')gameOver('El ayuntamiento ha caído y la ciudad ha sido arrasada.')}
function boom(z){FX.push({boom:1,x:z.x,y:z.y,t:.5});burst(z.x,z.y,18,'#ff9a30',3,12);burst(z.x,z.y,10,'#444',2,6);SHK=.35;sfxAt('crumble',z.x,z.y,{rate:1.25,v:.8});S.bld.slice().forEach(b=>{if(Math.hypot(b.x+b.w/2-z.x,b.y+b.h/2-z.y)<3){b.hp-=120;if(b.hp<=0)killB(b)}});U.forEach(u=>{if(Math.hypot(u.x-z.x,u.y-z.y)<2.5)u.hp-=40});S.ppl.forEach(p=>{if(!p.away&&Math.hypot(p.x-z.x,p.y-z.y)<2.5){p.hp-=40;p.injury=Math.min(100,(p.injury||0)+18);if(p.hp<=0)die(p,'por una explosión')}});z.hp=0}
function step(o,tx,ty,s){s*=terrMul(o.x,o.y);const d=Math.hypot(tx-o.x,ty-o.y);if(d<.01)return;const k=Math.min(1,s/d),nx=o.x+(tx-o.x)*k,ny=o.y+(ty-o.y)*k;const ix=Math.floor(nx),iy=Math.floor(ny),ob=(ix>=0&&iy>=0&&ix<N&&iy<N)?bm[occ[iy*N+ix]]:null;if(ob&&!WK(ob.type)){const ox=Math.floor(o.x),oy=Math.floor(o.y),sideX=(ix>=0&&iy>=0&&ix<N&&iy<N)?bm[occ[oy*N+ix]]:null,sideY=(ix>=0&&iy>=0&&ix<N&&iy<N)?bm[occ[iy*N+ox]]:null;if(!sideX||WK(sideX.type))o.x=nx;else if(!sideY||WK(sideY.type))o.y=ny;else return}else{o.x=nx;o.y=ny}o.dx=tx-o.x}
function zTryMove(z,nx,ny,dt){{const m=terrMul(z.x,z.y);if(m<1){nx=z.x+(nx-z.x)*m;ny=z.y+(ny-z.y)*m}}const ix=Math.floor(nx),iy=Math.floor(ny);if(ix<0||iy<0||ix>=N||iy>=N)return false;const ob=bm[occ[iy*N+ix]];if(ob&&!WK(ob.type)){z.tg=ob.id;return false}const debris=S.obs.find(o=>o.x===ix&&o.y===iy);if(debris){debris.hp=debris.hp??42;debris.hp-=18*dt;z.at=1;if(debris.hp<=0){S.obs=S.obs.filter(o=>o!==debris);rebuild();burst(ix+.5,iy+.5,5,'#8b7658',1.2,8)}return false}z.x=nx;z.y=ny;z.dx=nx-z.x;return true}
let _ZPT=-1,_ZPU=-1,_ZPP=-1,_ZPL=[];
function zUpd(z,dt){const zt=ZT[z.t],zd=zt.d*(z.dm||1);z.at=0;
if(!z.act){if(!z.tx||Math.hypot(z.tx-z.x,z.ty-z.y)<.3){let a,b,k=0;do{a=rn(.5,N-.5);b=rn(.5,N-.5);k++}while(inOwn(a,b,1)&&k<20);z.tx=a;z.ty=b}step(z,z.tx,z.ty,zt.sp*.35*dt*(S.adv&&S.adv.weather===2?.9:1));return}
if(!z.tg||!bm[z.tg]){let bd=1e9;S.bld.forEach(b=>{if(b.type=='road'||b.type=='bridge'||b.type=='wall'||b.type=='gate'||b.type=='barricade')return;const dd=Math.hypot(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<bd){bd=dd;z.tg=b.id}});if(!z.tg)S.bld.forEach(b=>{if(b.type=='road'||b.type=='bridge')return;const dd=Math.hypot(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<bd){bd=dd;z.tg=b.id}})}
// IA avanzada: los infectados activos priorizan grupos de trabajadores aislados y alternan el ángulo de aproximación.
if(z.act&&Math.random()<dt*.22){let target=null,dist=9;S.ppl.forEach(p=>{if(p.away||p.inside)return;const d=Math.hypot(p.x-z.x,p.y-z.y);if(d<dist){dist=d;target=p}});if(target&&dist<7){z.noiseTarget=target.id;z.tg=0;z.flank=(z.flank||0)*-1|| (Math.random()<.5?-1:1)}}
let u=null,ud=zt.rng&&zt.rng>2?1.2:1;U.forEach(q=>{const dd=Math.hypot(q.x-z.x,q.y-z.y);if(dd<ud){ud=dd;u=q}});
if(u&&!zt.boom){const hit=Math.max(1,zd-CL[u.p.arm].def-((u.p.gear&&u.p.gear.armor)?4:0)-clothingDef(u.p))*dt;u.hp-=hit;u.p.injury=Math.min(100,(u.p.injury||0)+hit*.22);z.at=1;return}
let cn=null,cdist=80;if(_ZPT!==T||_ZPU!==U.length||_ZPP!==S.ppl.length){_ZPT=T;_ZPU=U.length;_ZPP=S.ppl.length;const inU=new Set(U.map(q=>q.p));_ZPL=S.ppl.filter(p=>!(p.away||p.inside||inU.has(p)))}_ZPL.forEach(p=>{if(p.away||p.inside)return;const dd=Math.hypot(p.x-z.x,p.y-z.y);if(dd<cdist){cdist=dd;cn=p}});
if(cn){const arg=(zt.rng||.9)*(z.rgm||1);if(zt.boom&&cdist<1.2){boom(z);return}if(cdist<=arg&&!(arg>1.5&&wallBetween(z.x,z.y,cn.x,cn.y)&&!S.bld.some(q=>BT[q.type].gun&&gunners(q).includes(cn)))){z.at=1;cn.hp-=zd*dt;cn.injury=Math.min(100,(cn.injury||0)+zd*dt*.12);cn.mor=Math.max(0,cn.mor-5*dt);if(cn.hp<=0)die(cn,'atacado por los zombis');return}const flank=(z.flank||0)*Math.min(.22,dt*.7),nx=z.x+(cn.x-z.x)/cdist*zt.sp*dt*(S.adv&&S.adv.weather===3?1.12:1)-(cn.y-z.y)/cdist*flank,ny=z.y+(cn.y-z.y)/cdist*zt.sp*dt*(S.adv&&S.adv.weather===3?1.12:1)+(cn.x-z.x)/cdist*flank,ob=bm[occ[Math.floor(ny)*N+Math.floor(nx)]];if(ob&&!WK(ob.type)){if(!z.tgL||T-z.tgL>.6){z.tg=ob.id;z.tgL=T}}else{if(zTryMove(z,nx,ny,dt)){z.dx=cn.x-z.x;return}const sx=-(cn.y-z.y)/cdist,sy=(cn.x-z.x)/cdist,sd=z.sd3||(z.sd3=Math.random()<.5?1:-1),st=zt.sp*dt;if(zTryMove(z,z.x+sx*sd*st,z.y+sy*sd*st,dt))return;z.sd3=-sd;if(!z.tg||!bm[z.tg])return}}
const b=bm[z.tg];if(!b)return;const px=cl(z.x,b.x,b.x+b.w),py=cl(z.y,b.y,b.y+b.h),dist=Math.hypot(px-z.x,py-z.y),rg=(zt.rng||.6+(zt.big?.4:0))*(z.rgm||1);
if(dist<=rg&&!(rg>1.5&&b.type!='wall'&&b.type!='gate'&&wallBetween(z.x,z.y,px,py))){if(zt.boom){boom(z);return}z.at=1;b.hp-=zd*dt;if(b.hp<=0)killB(b);return}
const s=zt.sp*dt,nx=z.x+(px-z.x)/dist*s,ny=z.y+(py-z.y)/dist*s,ob=bm[occ[Math.floor(ny)*N+Math.floor(nx)]];
if(ob&&ob!==b&&!WK(ob.type)){
 /* rodeo: antes de atacar el muro, el zombi busca un hueco bordeándolo (hasta 5 s) */
 z.bp=(z.bp||0)+dt;
 if(z.bp<(window.DET||5)&&dist>0){z.sd2=z.sd2||(Math.random()<.5?1:-1);const tx=-(py-z.y)/dist*z.sd2,ty=(px-z.x)/dist*z.sd2,ax=z.x+tx*s*1.1+(px-z.x)/dist*s*.25,ay=z.y+ty*s*1.1+(py-z.y)/dist*s*.25,ob2=bm[occ[Math.floor(ay)*N+Math.floor(ax)]];
  if(ob2&&!WK(ob2.type)){z.sd2=-z.sd2;z.bs=(z.bs||0)+1;if(z.bs>3){z.tg=ob.id;z.bp=0;z.bs=0}return}
  if(zTryMove(z,ax,ay,dt)){z.dx=ax-z.x;return}return}
 z.tg=ob.id;z.bp=0;return}
z.bp=Math.max(0,(z.bp||0)-dt*2);
if(!zTryMove(z,nx,ny,dt))return;z.dx=px-z.x}
function wallBetween(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.35);for(let i=1;i<n;i++){const t=i/n,ix=Math.floor(x0+(x1-x0)*t),iy=Math.floor(y0+(y1-y0)*t);if(ix<0||iy<0||ix>=N||iy>=N)continue;const b=bm[occ[iy*N+ix]];if(b&&(b.type=='wall'||b.type=='gate'))return true}return false}
/* Los soldados defienden el pueblo: solo van a por zombis que están dentro de la zona del pueblo (cerca de algún edificio) o que ya tienen a tiro; antes salían a campo abierto detrás del más cercano. Sin enemigos, vuelven a su puesto. */
/* zona del pueblo: casillas a menos de TOWN_R de cualquier edificio propio (se rehace cada 2 s) */
const TOWN_R=4;let TWN=null,TWNt=-9;
function nearTown(x,y){if(!TWN||T-TWNt>2||TWN.length!==N*N){TWNt=T;TWN=new Uint8Array(N*N);const R=TOWN_R;S.bld.forEach(b=>{if(b.type==='road'||b.type==='bridge')return;for(let yy=Math.max(0,b.y-R);yy<Math.min(N,b.y+b.h+R);yy++)for(let xx=Math.max(0,b.x-R);xx<Math.min(N,b.x+b.w+R);xx++)TWN[yy*N+xx]=1})}
 const ix=Math.floor(x),iy=Math.floor(y);return ix>=0&&iy>=0&&ix<N&&iy<N&&TWN[iy*N+ix]===1}
function uUpd(u,dt){const c=CL[u.p.arm];u.cd-=dt;u.mv=0;if(u.hx===undefined){u.hx=u.x;u.hy=u.y}let t=null,td=1e9;Z.forEach(z=>{if(!z.act)return;const dd=Math.hypot(z.x-u.x,z.y-u.y);if(dd>c.rng&&!nearTown(z.x,z.y))return;if(dd<td&&!wallBetween(u.x,u.y,z.x,z.y)){td=dd;t=z}});
if(u.p.arm=='medico'){let a=null;U.forEach(q=>{if(q!==u&&q.hp<mhp(q.p)-5&&Math.hypot(q.x-u.x,q.y-u.y)<3.5)a=q});if(a){a.hp+=10*dt;u.hl=T;return}}
if(u.p.arm=='ing'){const b=S.bld.find(b=>b.hp<mxhp(b)&&Math.hypot(b.x+b.w/2-u.x,b.y+b.h/2-u.y)<b.w+3);if(b){b.hp=Math.min(mxhp(b),b.hp+15*dt);u.rp=T;return}}
if(!t){/* sin enemigos cerca: vuelve a su puesto */if(Math.hypot(u.hx-u.x,u.hy-u.y)>.4){u.mv=1;if(!(window.pstep&&pstep(u,u.hx,u.hy,2*dt)))step(u,u.hx,u.hy,2*dt)}return}
if(td<=1.4){u.dx=t.x-u.x;if(u.cd<=0){u.cd=.7;sfxAt('punch',u.x,u.y);t.hp-=(c.dmg*.8+(u.p.wp?u.p.wp.v*.5:0)+u.p.lvl)*(.9+Math.random()*.2);burst(t.x,t.y,2,'#b22',1,6)}}else if(td<=c.rng){u.dx=t.x-u.x;if(u.cd<=0){u.cd=.8;const m=S.res.ammo>=.05;if(m)S.res.ammo-=.05;{const k=({franco:'sniper',pesado:'rifle',esp:'blaster',expl:'pistol',medico:'pistol',ing:'pistol'})[u.p.arm]||'rifle';sfxAt(k,u.x,u.y);if(Math.random()<.3)setTimeout(()=>sfxAt('casing',u.x,u.y),330)}const wd=100;t.hp-=(c.dmg+(u.p.wp?u.p.wp.v:0)+u.p.lvl)*(th('arms1')?1.2:1)*(th('arms3')?1.2:1)*(th('arms4')?1.2:1)*(m?1:.6)*(.55+.45*wd/100);FX.push({a:[u.x,u.y],b:[t.x,t.y],t:.1,col:'#fff'});burst(t.x,t.y,2,'#ffd24a',1,8)}}else{u.mv=1;if(!(window.pstep&&pstep(u,t.x,t.y,2.2*dt)))step(u,t.x,t.y,2.2*dt)}}
function combat(dt){if(horde){horde.t+=dt;if(!horde.rescueChecked&&horde.t>24){horde.rescueChecked=1;if(S.ppl.length<pcap()&&Math.random()<.38){const p=mkP();p.hp=65;p.mor=72;p.injury=12;p.x=cl((S.bld.find(b=>b.type==='hall')||{x:28}).x+rn(-3,4),OB().x0,OB().x1-1);p.y=cl((S.bld.find(b=>b.type==='hall')||{y:28}).y+rn(-3,4),OB().y0,OB().y1-1);p.tx=p.x;p.ty=p.y;p.job=0;S.ppl.push(p);S.stat.rescued++;horde.rescued++;toast('¡Rescate durante el ataque! '+p.n+' ha conseguido llegar al asentamiento.');}}}Z.forEach(z=>zUpd(z,dt));U.forEach(u=>uUpd(u,dt));
S.bld.forEach(b=>{const f=BT[b.type].fire;if(b.type=='trap'){Z.forEach(z=>{if(Math.hypot(b.x+.5-z.x,b.y+.5-z.y)<.8){z.hp-=25*dt;b.hp-=4*dt}});if(b.hp<=0)killB(b);return}
if(!f)return;if(BT[b.type].gun){b.cds=b.cds||{};gunners(b).forEach(g=>{const w=wpStat(g,f);b.cds[g.id]=(b.cds[g.id]||0)-dt;if(b.cds[g.id]>0)return;let t=null,td=w.r*(S.adv&&S.adv.weather===2?.8:1)*(1+(b.lvl-1)*.1)*(horde&&horde.night?.6:1);Z.forEach(z=>{const dd=Math.hypot(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<td){td=dd;t=z}});
if(t){b.cds[g.id]=w.rt;const m=S.res.ammo>=.3;if(m)S.res.ammo-=.3;sfxAt(w.rt<.5?'blaster':'rifle',b.x+b.w/2,b.y+b.h/2);t.hp-=w.d*(1+(b.lvl-1)*.2)*(th('arms1')?1.2:1)*(th('arms3')?1.2:1)*(th('arms4')?1.2:1)*(m?1:.5);g.xp+=.02;b.ang=Math.atan2(t.y-b.y,t.x-b.x);FX.push({a:[b.x+b.w/2,b.y+b.h/2],b:[t.x,t.y],t:.1,col:'#ffe066'});burst(t.x,t.y,2,'#ffd24a',1,8)}});return}
b.cd=(b.cd||0)-dt;if(b.cd>0)return;let t=null,td=f.r*(1+(b.lvl-1)*.1)*(horde&&horde.night?.6:1);Z.forEach(z=>{const dd=Math.hypot(b.x+b.w/2-z.x,b.y+b.h/2-z.y);if(dd<td){td=dd;t=z}});
if(t){b.cd=f.rt;const m=S.res.ammo>=.3;if(m)S.res.ammo-=.3;sfxAt(f.rt<.5?'blaster':'rifle',b.x+b.w/2,b.y+b.h/2);t.hp-=f.d*b.lvl*(th('arms1')?1.2:1)*(th('arms3')?1.2:1)*(th('arms4')?1.2:1)*(m?1:.6);b.ang=Math.atan2(t.y-b.y,t.x-b.x);FX.push({a:[b.x+b.w/2,b.y+b.h/2],b:[t.x,t.y],t:.1,col:'#ffe066'});burst(t.x,t.y,2,'#ffd24a',1,8)}});
Z=Z.filter(z=>{if(z.hp>0)return true;if(z.act){S.stat.kills++;if(horde)horde.kills++;if(Math.random()<.4)sfxAt((z.t==='b'||z.t==='k'||z.t==='p')?'bdie':'zdie',z.x,z.y,{v:.8,floor:.1});if(window.onBanditDeath&&(z.t==='b'||z.t==='k'||z.t==='p'))onBanditDeath(z);if(z.t!=='b'&&z.t!=='k'&&z.t!=='p'){DEAD.push({x:z.x,y:z.y,t:0,zom:1,col:ZT.z.c,skin:'#9bb27a',s:1,dx:z.dx,id:0,zv:z.t==='f'?3:z.t==='s'?4:z.t==='r'?7:0});burst(z.x,z.y,8,'#6f8f35',1.8,10);if(z.t==='z')dropZombieWear(z)}U.forEach(u=>{if(Math.hypot(u.x-z.x,u.y-z.y)<9)u.p.xp+=3})}return false});
U=U.filter(u=>{if(u.hp>0)return true;if(u.p.ally){burst(u.x,u.y,6,'#b22',1.6,8);return false}DEAD.push({x:u.x,y:u.y,t:0,col:'#4a7a3a',skin:'#e8b88a',s:1,dx:u.dx,role:u.p.arm,id:u.p.id});burst(u.x,u.y,8,'#b22',1.8,10);if(horde)horde.lostU++;if(Math.random()<.5){u.p.nd=1;die(u.p,'en combate')}else{u.p.hp=4;toast(u.p.n+' queda gravemente herido.')}return false});
/* rezagados: si quedan pocos (≤3 o ≤10 % de la horda) y durante 20 s ninguno está dentro de la zona del pueblo, se dispersan y la horda termina (los soldados ya no salen a buscarlos) */
if(horde&&horde.t>40){const act=Z.filter(z=>z.act);horde.maxA=Math.max(horde.maxA||0,act.length);if(act.length&&act.length<=Math.max(3,Math.ceil(horde.maxA*.1))&&!act.some(z=>nearTown(z.x,z.y))){horde.outT=(horde.outT||0)+dt;if(horde.outT>20){Z=Z.filter(z=>!z.act);toast('Los últimos zombis se dispersan.')}}else horde.outT=0}
if(horde&&!Z.some(z=>z.act))endHorde()}
function endHorde(){const h=horde;horde=null;S.hs=null;sfx('win');S.stat.hordes++;S.hordeN++;U.forEach(u=>{u.p.hp=Math.max(1,u.hp);u.p.xp+=15});U.forEach(u=>lvlUp(u.p));U=[];const m=20+S.hordeN*8,a=10+S.hordeN*3;S.res.metal+=m;S.res.ammo+=a;const hurt=S.ppl.filter(p=>p.hp<mhp(p)-1).length,dead=Math.max(0,h.lostU-hurt),damaged=S.bld.filter(b=>{const q=h.bldBefore.find(v=>v.id===b.id);return q&&b.hp<q.hp}).length;save();
const delta=Object.keys(h.resBefore).map(k=>{const d=Math.round((S.res[k]-h.resBefore[k])*10)/10;return d?((d>0?'+':'')+d+' '+RN[k]):''}).filter(Boolean).join(', ')||'sin cambios';show('Informe de combate: '+h.name,`<p>Enemigos eliminados: ${h.kills}<br>Supervivientes heridos: ${hurt}<br>Supervivientes muertos: ${h.lostP||0}<br>Soldados caídos: ${h.lostU}<br>Supervivientes rescatados: ${h.rescued||0}<br>Edificios dañados: ${damaged}<br>Edificios destruidos: ${h.lostB}<br>Balance de recursos (incluye munición gastada y recompensas): ${delta}<br>Recompensas: +${m} metal, +${a} munición</p>`)}
function lvlUp(p){while(p.xp>=p.lvl*50){p.xp-=p.lvl*50;p.lvl++;p.sk=Math.min(10,p.sk+1);p.hp=mhp(p);toast(p.n+' sube a nivel '+p.lvl+'.');sfx('lvl')}}
/* ================= CONSTRUCCIÓN ================= */
function okAt(x,y,w,h,ig){
 x=Math.floor(x);y=Math.floor(y);w=Math.max(1,Math.floor(w));h=Math.max(1,Math.floor(h));
 for(let i=0;i<w;i++)for(let j=0;j<h;j++)if(!ownP(x+i,y+j))return false;if(placing&&placing.t&&!siteRule(placing.t,x,y,w,h))return false;
 for(let i=0;i<w;i++)for(let j=0;j<h;j++){
  const xx=x+i,yy=y+j,v=occ[yy*N+xx];
  if(v&&v!==ig)return false; // occ ya incluye edificios y obstáculos del mapa
 }
 // Evita colocar estructuras encima de supervivientes o unidades desplegadas.
 if(!ig){const inside=(u)=>u.x>=x&&u.x<x+w&&u.y>=y&&u.y<y+h;
  if(S.ppl.some(q=>!q.away&&inside(q))||U.some(inside))return false;
 }
 return true;
}
const avail=t=>BT[t].lv<=hallLv()&&(!BT[t].tech||th(BT[t].tech));
function buildMenu(){let h='<p>Ayuntamiento nivel '+hallLv()+'. Elige una estructura, ajusta su posición en la cuadrícula y confirma cuando el contorno esté verde.</p><div class="row">';Object.keys(BT).forEach(t=>{if(t=='hall')return;const d=BT[t],ok=avail(t),c=costOf(d.cost);h+=`<div class="card ${ok?'':'lk'}" onclick="${ok?`pickB('${t}')`:`toast('Requiere ayuntamiento nivel ${d.lv}${d.tech?' y la tecnología '+TECH.find(q=>q[0]==d.tech)[2]:''}')`}"><canvas class="mini" data-t="${t}" width="80" height="70"></canvas><br><b>${d.n}</b><br>${d.w}x${d.h} · ${cs(c)}${d.mt?'<br><small>⛰️ Solo en montaña</small>':d.dk?'<br><small>🌊 En la orilla</small>':d.wb?'<br><small>🌊 Sobre el agua</small>':d.pm?'<br><small>💧 Junto al agua</small>':''}</div>`});show('Construir',h+'</div>');
document.querySelectorAll('canvas.mini').forEach(c=>{const x=c.getContext('2d'),t=c.dataset.t,d=BT[t],s=Math.min(76/((d.w+d.h)*32),62/(d.z+(d.w+d.h)*16));x.translate(40-(d.w-d.h)*16*s,d.z*s+4);x.scale(s,s);if(t=='road'){box(x,0,0,1,1,2,'#77736b')}else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:1,hp:1},1)})}
function pickB(t){
 hide();const d=BT[t],c=costOf(d.cost);if(!can(c)){toast('Recursos insuficientes: '+cs(c));return}
 const g=scr2g(vw()/2,vh()/2);placing={t,w:d.w,h:d.h,x:Math.floor(g.x-d.w/2),y:Math.floor(g.y-d.h/2),paint:!!PAINT[t],rot:0,cl:t=='house'?Math.floor(Math.random()*6):0,rf:0,ex:0};
 fbar();
}
function placeValid(){return placing&&okAt(placing.x,placing.y,placing.w,placing.h,placing.mv)}
const PAL={house:[['Crema','#d9c7a0'],['Azul','#6f93b5'],['Verde','#7da36b'],['Ladrillo','#b5623f'],['Gris','#9aa0a6'],['Amarillo','#e0b84e']],hall:[['Acero','#8f9aa6'],['Ladrillo','#a85a3c'],['Arena','#c9b58a']],farm:[['Rojo','#b33'],['Azul','#3f6fa8'],['Verde','#4f8a46']],hosp:[['Blanco','#e8ecee'],['Verde','#bfe0cf'],['Azul','#bcd3e8']],barr:[['Militar','#5a6a3a'],['Desierto','#b59c68'],['Gris','#6b727a']],store:[['Azul','#46607a'],['Verde','#4d7a58'],['Naranja','#c2763a']],work:[['Gris','#6c6f73'],['Rojo','#9a4034'],['Azul','#3f5f86']],expo:[['Gris','#8a919a'],['Verde','#58735a'],['Arena','#b9a276']],fact:[['Óxido','#8a5a3c'],['Gris','#6e757b'],['Azul','#4a6280']],gar:[['Gris','#777e83'],['Rojo','#a1403a'],['Amarillo','#c7a23a']],lab:[['Blanco','#dfe9ea'],['Turquesa','#78c4c0'],['Violeta','#9c8cc4']],tower:[['Hormigón','#8c8f92'],['Madera','#7a5a3c'],['Verde','#566b4a']],gen:[['Amarillo','#c9a233'],['Gris','#707678'],['Rojo','#a8403a']],well:[['Piedra','#8a8f86'],['Ladrillo','#a8654a']],wall:[['Hormigón','#8a8d8a'],['Ladrillo','#a66248'],['Chapa','#7b6d58']],gate:[['Hormigón','#8a8d8a'],['Ladrillo','#a66248'],['Chapa','#7b6d58']]};
const ROOFS=[['Teja roja','#a2402f'],['Pizarra','#4f5a66'],['Verde','#4f7a50'],['Azul','#3d6a96']],EXTRAS=['Ninguno','Jardín','Porche','Paneles solares','Antena'];
function cycA(key){const p=placing;if(!p)return;const n=key=='cl'?(PAL[p.t]||[]).length:key=='rf'?ROOFS.length:EXTRAS.length;p[key]=((p[key]||0)+1)%Math.max(1,n);fbar()}
function aspMenu(id){const b=bm[id];if(!b)return;const sw=(key,list,t)=>'<p><b>'+t+'</b></p>'+list.map((v,i)=>`<button style="${v[1]?'border-left:14px solid '+v[1]+';':''}${(b[key]||0)===i?'outline:2px solid #f2c14e;':''}" onclick="setAsp(${id},'${key}',${i})">${v[0]}</button>`).join('');show('Aspecto: '+BT[b.type].n,sw('cl',PAL[b.type]||[],'Color')+(b.type=='house'?sw('rf',ROOFS,'Tejado')+sw('ex',EXTRAS.map(n=>[n,'']),'Extra'):'')+btn('Volver',`bPanel(${id})`))}
function setAsp(id,k,i){const b=bm[id];if(!b)return;b[k]=i;save();aspMenu(id)}
function fbar(){
 const f=$('fb');if(!placing){f.style.display='none';return}
 const p=placing,ok=placeValid(),c=costOf(BT[p.t].cost);
 f.style.display='block';
 f.innerHTML=(p.paint?(()=>{const n=allCells(p).length;return(n?btn('✔ Construir ('+dragInfo(p).n+')','commitDrag()')+btn('↶ Deshacer','planUndo()')+btn('✕ Borrar','planClear()'):btn('Colocar 1','confirmP()'))+(p.t=='wall'?btn('⬚ Rodear base','planRing()'):'')+btn('Arrastrar '+(window.dragOff?'✗':'✓'),'window.dragOff=!window.dragOff;fbar()')})():(btn('Rotar','rotP()')+btn('Confirmar','confirmP()')))+btn('Cancelar','endPlace()')+(PAL[p.t]?btn('◐ '+PAL[p.t][Math.min(p.cl||0,PAL[p.t].length-1)][0],"cycA('cl')"):'')+(p.t=='house'?btn('Tejado: '+ROOFS[p.rf||0][0],"cycA('rf')")+btn('Extra: '+EXTRAS[p.ex||0],"cycA('ex')"):'')+
 (p.paint&&allCells(p).length?'':`<br><small style="background:#000c;padding:3px 7px;border-radius:5px;color:${ok?'#8dff9b':'#ff8585'}">${ok?'Ubicación válida':'Ubicación no válida'} · ${BT[p.t].n} · ${p.w}×${p.h} · ${cs(c)}</small>`)+(p.paint?`<br><small style="background:#000c;padding:3px 7px;border-radius:5px;color:#f2d27a">${allCells(p).length?(()=>{const d=dragInfo(p);return'Trazado: '+d.n+' piezas · '+cs(d.tot)+(d.bad?' · '+d.bad+' en rojo':'')+(d.poor?' · faltan recursos':'')})():'Arrastra o toca puntos para trazar'}</small>`:'');
}
function endPlace(){placing=null;fbar()}
/* Texto en edificios girados: se dibuja del revés para que, tras el espejo, se lea bien (ver MIRF) */
(function(){const P=CanvasRenderingContext2D.prototype,mk=o=>function(t,x,y,m){if(!window.MIRF)return o.call(this,t,x,y,m);const al=this.textAlign;this.save();this.translate(x,0);this.scale(-1,1);this.textAlign=(al=='left'||al=='start')?'right':(al=='right'||al=='end')?'left':al;o.call(this,t,0,y,m);this.restore()};P.fillText=mk(P.fillText);P.strokeText=mk(P.strokeText)})();
function mir(c,b,fn){if(!((b.rot||0)&1)||(window.NB&&NB[b.type]))return fn(c,b);const cx=b.x+b.w/2,cy=b.y+b.h/2,q=P(cx,cy),nb=Object.assign({},b,{w:b.h,h:b.w,x:cx-b.h/2,y:cy-b.w/2});c.save();c.translate(q[0],0);c.scale(-1,1);c.translate(-q[0],0);const pm=window.MIRF;window.MIRF=1;try{fn(c,nb)}finally{window.MIRF=pm;c.restore()}}
function rotP(){if(!placing)return;const p=placing;[p.w,p.h]=[p.h,p.w];p.rot=((p.rot||0)+1)%4;fbar()}
function confirmP(){
 const p=placing;if(!p)return;
 if(!placeValid()){toast('Espacio ocupado, fuera de tu territorio o terreno no válido para este edificio.');return}
 if(p.mv!==undefined){const b=bm[p.mv];if(!b){endPlace();return}b.x=p.x;b.y=p.y;b.w=p.w;b.h=p.h;b.rot=(p.rot||0)%4;b.cl=p.cl||0;b.rf=p.rf||0;b.ex=p.ex||0;rebuild();burst(p.x+p.w/2,p.y+p.h/2,14,'#d8c39a',2,8);toast(BT[p.t].n+' movido.');endPlace();return}
 const c=costOf(BT[p.t].cost);if(!can(c)){toast('Recursos insuficientes: '+cs(c));return}
 pay(c);const nb=addB(p.t,p.x,p.y,p.w,p.h,(p.rot||0)%4);nb.cl=p.cl||0;nb.rf=p.rf||0;nb.ex=p.ex||0;synthSound('build');burst(p.x+p.w/2,p.y+p.h/2,18,'#d8c39a',2.2,8);nb.fxBuild=T;rebuild();toast(BT[p.t].n+' construido.');
 if(p.paint){fbar();}
 else endPlace();
}
function allCells(p){const a=(p.plan||[]).slice();(p.drag||[]).forEach(q=>{if(!a.some(r=>r[0]===q[0]&&r[1]===q[1]))a.push(q)});return a}
function dragCells(p,gx,gy){const last=p.drag[p.drag.length-1];let x=last[0],y=last[1],g=0;while((x!==gx||y!==gy)&&g++<200){if(x!==gx&&(Math.abs(gx-x)>=Math.abs(gy-y)||y===gy))x+=Math.sign(gx-x);else y+=Math.sign(gy-y);if(!p.drag.some(q=>q[0]===x&&q[1]===y))p.drag.push([x,y])}}
function dragInfo(p){const one=costOf(BT[p.t].cost);let n=0,bad=0,poor=0;const tot={};const ok=allCells(p).map(q=>{if(!okAt(q[0],q[1],1,1)){bad++;return 0}if(poor){return 0}const need={};for(const k in one)need[k]=one[k]*(n+1);if(!can(need)){poor=1;return 0}n++;return 1});for(const k in one)tot[k]=one[k]*n;return{ok,n,bad,poor,tot}}
function dragPrev(c,p){const d=dragInfo(p);c.save();allCells(p).forEach((q,i)=>{const a=P(q[0],q[1]),b=P(q[0]+1,q[1]),e=P(q[0]+1,q[1]+1),f=P(q[0],q[1]+1);poly(c,[a,b,e,f],d.ok[i]?'rgba(55,225,85,.30)':'rgba(245,55,55,.34)');if(d.ok[i])drawB(c,{type:p.t,x:q[0],y:q[1],w:1,h:1,lvl:1,hp:1,rot:0,cl:0,rf:0,ex:0},.7)});c.restore()}
function endSeg(){const p=placing;if(!p||!p.drag)return;const seg=p.drag;p.drag=null;const plan=p.plan||(p.plan=[]),segs=p.segs||(p.segs=[]),has=q=>plan.some(r=>r[0]===q[0]&&r[1]===q[1]);segs.push(plan.length);
 if(seg.length===1&&plan.length){const t={drag:[plan[plan.length-1]]};dragCells(t,seg[0][0],seg[0][1]);t.drag.slice(1).forEach(q=>{if(!has(q))plan.push(q)})}
 else seg.forEach(q=>{if(!has(q))plan.push(q)});
 if(segs[segs.length-1]===plan.length)segs.pop();fbar()}
function planUndo(){const p=placing;if(!p||!p.plan||!p.plan.length)return;const n=(p.segs&&p.segs.length)?p.segs.pop():0;p.plan.length=Math.min(n,p.plan.length);fbar()}
function planClear(){const p=placing;if(!p)return;p.plan=[];p.segs=[];p.drag=null;fbar()}
function planRing(){const p=placing;if(!p)return;const bs=S.bld.filter(b=>!['road','bridge','wall','gate','trap'].includes(b.type));if(!bs.length)return toast('No hay edificios que rodear.');
 let x0=1e9,y0=1e9,x1=-1,y1=-1;bs.forEach(b=>{x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.w);y1=Math.max(y1,b.y+b.h)});const m=3;x0=Math.max(1,x0-m);y0=Math.max(1,y0-m);x1=Math.min(N-2,x1+m-1);y1=Math.min(N-2,y1+m-1);
 const c=[];for(let x=x0;x<=x1;x++)c.push([x,y0]);for(let y=y0+1;y<=y1;y++)c.push([x1,y]);for(let x=x1-1;x>=x0;x--)c.push([x,y1]);for(let y=y1-1;y>y0;y--)c.push([x0,y]);
 p.plan=c.filter(q=>!S.bld.some(b=>b.type==p.t&&b.x===q[0]&&b.y===q[1]));p.segs=[0];p.drag=null;fbar();const d=dragInfo(p);toast('Perímetro trazado: '+d.n+' piezas válidas'+(d.bad?' · '+d.bad+' en rojo (no válidas)':'')+'. Revisa y pulsa Construir.')}
function commitDrag(){const p=placing;if(!p)return;const cells=allCells(p);p.drag=null;p.plan=[];p.segs=[];if(!cells.length){fbar();return}const t=p.t;let n=0,bad=0,poor=0;for(const q of cells){if(!okAt(q[0],q[1],1,1)){bad++;continue}const c=costOf(BT[t].cost);if(!can(c)){poor=1;break}pay(c);const nb=addB(t,q[0],q[1],1,1,0);nb.fxBuild=T;n++}
 if(n){rebuild();synthSound('build');const q=cells[cells.length-1];burst(q[0]+.5,q[1]+.5,14,'#d8c39a',2,8)}
 toast(n?(n+' × '+BT[t].n+' construidos'+(poor?' · se acabaron los recursos':'')+(bad?' · '+bad+' casillas no válidas':'')):(poor?'Recursos insuficientes.':'No se puede construir ahí.'));fbar()}
function paintAt(x,y){if(!placing)return;placing.x=Math.floor(x);placing.y=Math.floor(y);fbar()}
function moveB(id){const b=bm[id];if(!b)return;hide();placing={t:b.type,w:b.w,h:b.h,x:b.x,y:b.y,mv:id,rot:b.rot||0,cl:b.cl||0,rf:b.rf||0,ex:b.ex||0};fbar()}
function upg(id){const b=bm[id];if(!b)return;const d=BT[b.type];if(b.type=='hall'){if(b.lvl>=25)return toast('Nivel máximo.');const L=b.lvl,c=costOf(hallCost(L),1),n=S.bld.filter(x=>x!==b&&!['wall','road','gate','trap','bridge'].includes(x.type)&&x.lvl>=Math.min(L+1,15)).length;if(n<hallNB(L))return toast('Necesitas '+hallNB(L)+' edificios al nivel '+Math.min(L+1,15)+' (tienes '+n+').');if(!can(c))return toast('Faltan recursos: '+cs(c));pay(c);b.lvl++;b.hp=mxhp(b);b.fxUpgrade=T;burst(b.x+b.w/2,b.y+b.h/2,26,'#f2d27a',2.8,12);toast('¡Ayuntamiento nivel '+b.lvl+'! Nuevos edificios desbloqueados.');bPanel(id);return}
const MXL=(b.type=='wall'||b.type=='gate')?5:15;if(b.lvl>=Math.min(MXL,hallLv()+1))return toast(b.lvl>=MXL?'Nivel máximo.':'Mejora antes el ayuntamiento.');const G=window.ugate&&ugate(b);if(G)return toast(G);const c=window.ucost?ucost(b):costOf(d.cost,b.lvl+1);if(!can(c))return toast('Faltan recursos: '+cs(c));pay(c);b.lvl++;b.hp=mxhp(b);b.fxUpgrade=T;burst(b.x+b.w/2,b.y+b.h/2,22,'#f2d27a',2.5,10);bPanel(id)}
function destroy(id){playG('brick');const b=bm[id],c=costOf(BT[b.type].cost);for(const k in c)S.res[k]+=Math.floor(c[k]*.5*b.lvl);S.ppl.forEach(p=>{if(p.job==id)p.job=0});S.bld=S.bld.filter(x=>x!==b);rebuild();hide()}
function bPanel(id){const b=bm[id];if(!b)return;sel=id;const d=BT[b.type],sl=slots(b),wks=wk(b);let h=`<p>${b.type=='wall'?WALLN[Math.min(4,b.lvl-1)]+' · ':b.type=='gate'?['Puerta de malla','Puerta de madera','Puerta de acero y piedra','Puerta de acero y ladrillo','Puerta blindada'][Math.min(4,b.lvl-1)]+' · ':''}Nivel ${b.lvl} · ${b.w}x${b.h} · Vida ${Math.ceil(b.hp)}/${mxhp(b)}</p><p>${d.f}</p>`;
if(window.pwUse&&pwBase(b.type)){const u=pwUse(b);h+=`<p>⚡ Energía: <b>${u>0?'consume '+u:'no consume (campamento)'}</b>${b.off?' · <b style="color:#ff8a7a">APAGADO por falta de energía</b>':''}</p>`}if(PAL[b.type])h+=btn('🎨 Personalizar aspecto',`aspMenu(${id})`);if(b.type=='house')h+=btn('Formar una familia (3+3 días)','pairSurvivors()');if(d.cons||b.type=='gen'||(window.pwBase&&pwBase(b.type)))h+=`<p>Estado: <b>${b.pause?'⏸ Parado':'▶ En marcha'}</b>${b.pause?' (no consume ni produce)':''}</p>`+btn(b.pause?'▶ Encender':'⏸ Parar',`togB(${id})`);if(d.p)h+=`<p>Producción diaria: ${cs(out(b,!b.off))}${b.off?' (sin energía)':''}</p>`;
if(sl&&d.gun)h+=`<p>Tiradores ${wks.length}/${sl}. Solo disparan con arma equipada; el alcance y el daño dependen del arma.</p>`+(wks.length?'':'<p>⚠ Sin tiradores: la torre no dispara.</p>')+wks.map(p=>btn('Quitar '+p.n+(p.wp?' ('+p.wp.n+')':' (sin arma)'),`unjob(${p.id},${id})`)).join('')+btn('Asignar tirador',`asgList(${id})`,wks.length>=sl);else if(sl)h+=`<p>Trabajadores ${wks.length}/${sl}. Ideal: ${d.job.join(', ')}</p>`+wks.map(p=>btn('Quitar '+p.n+' ('+p.prof+')',`unjob(${p.id},${id})`)).join('')+btn('Asignar',`asgList(${id})`,wks.length>=sl);
if(b.type=='hosp')h+=`<p>Heridos: ${S.ppl.filter(p=>p.hp<mhp(p)-1).length}</p>`+btn(healAllLabel(),'healAll()');
if((b.type=='barr'||b.type=='hall')&&S.mode!=='creativo'){try{const e=hordeEst(),col={Suficiente:'#6c6',Justa:'#dc4',Insuficiente:'#e55'}[e.v];h+='<div class="sub" style="margin:6px 0">🧟 Próxima horda '+(e.days?'en '+e.days+' día'+(e.days>1?'s':''):'hoy')+': ~'+e.n+' enemigos ('+e.kind+'). Tu defensa: <b style="color:'+col+'">'+e.v+'</b></div>'}catch(er){}}
if(b.type=='barr')h+=btn('Entrenar al ejército (1 vez al día por unidad · 10 comida +5 por nivel y 5 munición c/u)','trainArmy()')+btn('Entrenamiento automático cada día: '+(S.autoTrain?'SÍ':'NO'),'toggleAutoTrain()')+btn('Gestionar ejército','armyMenu()');
if(b.type=='work')h+='<p>Fabricar:</p>'+WP.map((w,i)=>(window.hasPlan&&!hasPlan(w.n))?'':btn(w.n+' (+'+w.v+(window.wbTxt?wbTxt(w):'')+' · '+cs(w.c)+')',`craft(${i})`,w.t&&!th(w.t))).join('')+(window.outCraftBtns?outCraftBtns():'');
if(b.type=='lab')h+=btn('Investigar','techMenu()');
if(b.type=='expo')h+=btn('Preparar expedición','expMenu()');
if(b.type=='hall')h+=btn('Asignar limpiador automático ('+(S.cleaners||0)+')','setCleaner()')+btn('Mejorar ayuntamiento ('+cs(costOf(hallCost(b.lvl)))+' y '+hallNB(b.lvl)+' edificios nivel '+(b.lvl+1)+')',`upg(${id})`)+btn('Territorio ('+parcelCount()+'/'+PG*PG+' parcelas)','expandMenu()')+btn('Mover ayuntamiento',`moveB(${id})`)+capBtn();
else h+=btn('Mejorar ('+cs(window.ucost?ucost(b):costOf(d.cost,b.lvl+1))+' )',`upg(${id})`,b.lvl>=((b.type=='wall'||b.type=='gate')?5:15))+(b.type=='wall'&&b.lvl<5?btn('Mejorar todos los muros de nivel '+b.lvl,`upgWalls(${id})`):'')+btn('Mover',`moveB(${id})`)+btn('Destruir',`destroy(${id})`);
if(b.hp<mxhp(b))h+=btn('Reparar (5 madera)',`repair(${id})`);show(d.n,h)}

var pairM=0,pairF=0;
function kin(a,b){if(!a||!b)return false;const pa=a.par||[],pb=b.par||[];return pa.includes(b.id)||pb.includes(a.id)||(pa.length&&pb.length&&pa.some(x=>x&&pb.includes(x)))}
function whyNot(p){if(p.away)return'fuera';if(p.preg)return'embarazada';if(p.illness)return'enfermo';if(p.hp<50||p.injury>50)return'herido';if((p.pcd||0)>S.day)return'descansa';return''}
function pairSurvivors(){if(horde)return toast('No es momento: hay una horda.');pairM=0;pairF=0;pairUI()}
function pairPick(k,id){if(k==='F')pairF=pairF===id?0:id;else pairM=pairM===id?0:id;pairUI()}
function pairUI(){let M=byId(pairM),F=byId(pairF);if(!M||whyNot(M)||M.sex!=='M'||M.age<18){pairM=0;M=null}if(!F||whyNot(F)||F.sex!=='F'||F.age<18){pairF=0;F=null}if(M&&F&&kin(M,F)){pairF=0;F=null;toast('Son parientes.')}
const lst=(sx,sel,other,k)=>{const a=S.ppl.filter(p=>p.sex===sx&&p.age>=18);return a.length?'<div class="pg">'+a.map(p=>{const w=whyNot(p)||(other&&kin(p,other)?'pariente':'');return pcard(p,w?`toast('${p.n} no está disponible (${w}).')`:`pairPick('${k}',${p.id})`,(sel===p.id?'sel ':'')+(w?'dis':''),w||(sel===p.id?'✔':''))}).join('')+'</div>':'<p>No hay adultos de este sexo.</p>'},
full=S.pregnancies.length>=pregMax(),ok=M&&F&&!full,sc=$('pan').scrollTop;
show('Sistema de parejas',`<p>Embarazos en curso: ${S.pregnancies.length}/${pregMax()} (1 por cada 2 casas, entre 2 y 6) · Gestación 3 días + crecimiento 3 días. La embarazada come el doble. El bebé hereda parte de los roles de sus padres y hay un 10% de gemelos. La madre queda descansando 4 días tras el parto.</p><p><b>Madre</b></p>${lst('F',pairF,M,'F')}<p><b>Padre</b></p>${lst('M',pairM,F,'M')}`+btn(ok?`Formar pareja: ${M.n} y ${F.n}`:(full?'Sin espacio para más embarazos':'Elige a la madre y al padre'),'pairGo()',!ok));paintCards();$('pan').scrollTop=sc}
function pairGo(){if(horde)return toast('No es momento: hay una horda.');const m=byId(pairM),f=byId(pairF);if(!m||!f||whyNot(m)||whyNot(f)||m.sex!=='M'||f.sex!=='F'||m.age<18||f.age<18)return toast('Elige a dos adultos disponibles.');if(kin(m,f))return toast('Son parientes.');if(S.ppl.length+S.pregnancies.length>=pcap())return toast('No hay cama para un bebé: construye o mejora casas antes.');if(S.pregnancies.length>=pregMax())return toast('No hay espacio para más embarazos: construye más casas (1 embarazo por cada 2 casas).');
f.preg=1;m.pcd=S.day+2;S.pregnancies.push({tw:Math.random()<.1?1:0,gest:0,grow:0,mother:f.id,father:m.id,name:pk(NM)+' '+(m.n.split(' ').slice(1).join(' ')||pk(AP))});m.rel=m.rel||{};f.rel=f.rel||{};m.rel[String(f.id)]='Pareja';f.rel[String(m.id)]='Pareja';m.mor=Math.min(100,m.mor+10);f.mor=Math.min(100,f.mor+10);pairM=0;pairF=0;
show('Pareja formada','<div class="pg">'+pcard(f,'void 0','','🤰')+pcard(m,'void 0','','')+'</div><p>'+f.n+' y '+m.n+' esperan un hijo. Nacerá en 3 días y se unirá a la comunidad 3 días después.</p>');paintCards();save()}
function repair(id){if(S.res.wood<5)return;S.res.wood-=5;bm[id].hp=mxhp(bm[id]);burst(bm[id].x+bm[id].w/2,bm[id].y+bm[id].h/2,12,'#a9d7a0',1.8,9);bPanel(id)}
function unjob(p,b){byId(p).job=0;bPanel(b)}
function asgList(id){const gn=BT[bm[id].type].gun;show(gn?'Asignar tirador (con arma)':'Asignar trabajador',S.ppl.filter(p=>(gn?!!p.wp&&!p.preg:!p.arm)&&p.age>=18&&!p.away&&p.job!=id).map(p=>btn(`${p.n} · ${p.prof} niv ${p.lvl}${skFor(p,BT[bm[id].type])>0?' ★'+skFor(p,BT[bm[id].type]):''}${p.job?' (ocupado)':''}`,`asg(${p.id},${id})`)).join(''))}
function asg(p,b){const q=byId(p);if(q.age<18)return toast('Los niños no pueden trabajar hasta ser adultos.');if(BT[bm[b].type].gun&&q.preg)return toast('Una embarazada no puede disparar.');if(BT[bm[b].type].gun&&!q.wp)return toast('Necesita un arma equipada.');q.job=b;bPanel(b)}
function healCost(p,b){const miss=Math.max(0,mhp(p)-p.hp),lv=b?b.lvl||1:1;let c=Math.ceil(miss/16)+((p.injury||0)>35?1:0)+((p.injury||0)>70?1:0);c-=Math.floor((lv-1)/5);return Math.max(1,c)}
function healList(){const b=S.bld.find(x=>x.type=='hosp');return S.ppl.filter(p=>!p.away&&p.hp<mhp(p)-1).sort((a,c)=>(a.hp/mhp(a))-(c.hp/mhp(c))).map(p=>({p,c:healCost(p,b)}))}
function healAllLabel(){const l=healList(),t=l.reduce((s,x)=>s+x.c,0);return l.length?'Curar a todos los heridos ('+l.length+' · '+t+' medicinas)':'Curar a todos los heridos (nadie herido)'}
function healAll(){const l=healList();if(!l.length){toast('Nadie necesita atención.');return}let n=0,gast=0;l.forEach(x=>{if(S.res.meds>=x.c){S.res.meds-=x.c;gast+=x.c;x.p.hp=mhp(x.p);if(x.p.injury)x.p.injury=Math.max(0,x.p.injury-40);n++}});
 toast(n?('Tratados '+n+' de '+l.length+' heridos. Medicinas usadas: '+gast+'.'):'No hay medicinas suficientes. Necesitas al menos '+l[0].c+'.');if(n<l.length&&n)toast('Faltan medicinas para '+(l.length-n)+' heridos.');bPanel(sel)}
function craft(i){const w=WP[i];if(window.hasPlan&&!hasPlan(w.n))return toast('Necesitas encontrar el plano.');const c=costOf(w.c,1);if(!can(c))return toast('Faltan recursos.');pay(c);S.inv.push({n:w.n,v:w.v});toast('Fabricado: '+w.n);bPanel(sel)}
function bldList(){const l=S.bld.filter(b=>b.type!='road'&&b.type!='bridge');show('Edificios ('+l.length+')',l.map(b=>btn(BT[b.type].n+' niv '+b.lvl,`centerOn(${b.x+b.w/2},${b.y+b.h/2});bPanel(${b.id})`)).join(''))}
const WALLN=['Valla metálica','Valla de madera','Muro de piedra','Muro de ladrillo','Muro de acero'];
function togB(id){const b=bm[id];if(!b)return;b.pause=b.pause?0:1;toast(BT[b.type].n+(b.pause?' parado.':' en marcha.'));save();bPanel(id)}
function upgWalls(id){const b=bm[id];if(!b)return;const L=b.lvl;if(L>=5)return toast('Nivel máximo.');if(L>=hallLv()+1)return toast('Mejora antes el ayuntamiento.');const G=window.ugate&&ugate(b);if(G)return toast(G);const ws=S.bld.filter(x=>x.type=='wall'&&x.lvl==L);let c={};ws.forEach(x=>{const q=window.ucost?ucost(x):costOf(BT.wall.cost,L+1);for(const k in q)c[k]=(c[k]||0)+q[k]});if(!can(c))return toast('Faltan recursos: '+cs(c));pay(c);ws.forEach(x=>{x.lvl++;x.hp=mxhp(x);x.fxUpgrade=T});toast(ws.length+' muros mejorados a '+WALLN[L].toLowerCase()+'.');bPanel(id)}
function upgMenu(){const l=S.bld.filter(b=>!['road','bridge','wall','gate','trap','hall'].includes(b.type)&&b.lvl<Math.min(15,hallLv()+1));show('Mejoras disponibles',(S.bld.filter(b=>b.type=='hall').map(b=>btn('Ayuntamiento → nivel '+(b.lvl+1),`upg(${b.id});upgMenu()`)).join(''))+(l.map(b=>btn(BT[b.type].n+' niv '+b.lvl+' → '+(b.lvl+1)+' ('+cs(window.ucost?ucost(b):costOf(BT[b.type].cost,b.lvl+1))+')',`upg(${b.id});upgMenu()`)).join('')||'<p>No hay mejoras disponibles. Sube el nivel del ayuntamiento.</p>'))}
function storeMenu(){const d=rate();show('Almacén (capacidad '+cap()+')',RK.map(r=>`<p><img src="${ICO[r[0]]}" width=16> ${r[1]}: ${Math.floor(S.res[r[0]])} <small>(${d[r[0]]>=0?'+':''}${(d[r[0]]/10).toFixed(1)} por minuto)</small></p>`).join('')+'<p>Hay '+S.inv.length+' armas en inventario.</p>'+capBtn())}
function capBtn(){const k=(S.cx||0)+1;return k>6?'<p>Ampliación de almacén al máximo.</p>':btn('Ampliar almacén (+100 capacidad, '+cs(costOf({wood:100*k,metal:50*k}))+') ['+(k-1)+'/6]','growCap()')}
function growCap(){const k=(S.cx||0)+1;if(k>6)return;const c=costOf({wood:100*k,metal:50*k});if(!can(c))return toast('Faltan recursos: '+cs(c));pay(c);S.cx=k;toast('Capacidad ampliada a '+cap()+'.');storeMenu()}
/* ================= SUPERVIVIENTES / EJÉRCITO ================= */
function pplMenu(){show('Supervivientes ('+S.ppl.length+'/'+pcap()+')','<p>Toca una foto para ver la ficha.</p><div class="pg">'+S.ppl.map(p=>pcard(p,`pSheet(${p.id})`)).join('')+'</div>');paintCards()}
function recruit(){return toast('Los supervivientes sólo se encuentran en expediciones y eventos.')}
function pSheet(id){const p=byId(id);if(!p)return;const b=bm[p.job],hs=cnt('hosp')>0,gear=p.gear||{armor:0,pack:0},rels=Object.entries(p.rel||{}).map(([rid,v])=>{const q=byId(+rid);return q?q.n+': '+v:''}).filter(Boolean);let h=`<canvas id="avatar" width="180" height="190" style="display:block;margin:4px auto;background:#172018;border-radius:10px;border:1px solid #61734b"></canvas><p><b>${p.age} años · ${p.prof}</b> (${p.sp}) · Nivel ${p.lvl} · Experiencia ${Math.floor(p.xp)}/${p.lvl*50}</p><p>Personalidad: <b>${p.trait}</b> · Habilidad general ${p.sk}</p>${bar('Salud '+Math.round(p.hp)+'/'+mhp(p),p.hp/mhp(p)*100,'#d44')}${bar('Hambre',p.hunger,'#d89b45')}${bar('Sed',p.thirst,'#49a9e8')}${bar('Experiencia',p.xp/(p.lvl*50)*100,'#48c')}<p>Estado: ${p.illness?'Enfermo ('+p.illness+')':'Sin enfermedad'} · ${p.injury>0?'Herido ('+Math.round(p.injury)+'%)':'Sin heridas'}</p><p>Trabajo: ${b?BT[b.type].n:'Sin asignar'} · Arma: ${p.wp?p.wp.n:'ninguna'} · Rol militar: ${p.arm?CL[p.arm].n:'civil'}</p><p>Equipo: Armadura ${gear.armor?'reforzada':'básica'} · Mochila ${gear.pack?'de exploración':'normal'}</p><p>Prendas recuperadas equipadas: ${Object.values(p.clothes||{}).map(x=>x.n).join(', ')||'ninguna'} · Defensa adicional: ${clothingDef(p)}</p><p><b>Relaciones:</b> ${rels.join(' · ')||'Todavía está conociendo a la comunidad'}</p>`;
h+=btn('Entrenar ('+(10+5*p.lvl)+' comida · 1 vez al día)',`train(${id})`,p.td===S.day)+'<p><b>Asignación laboral</b></p>'+ (p.job?btn('Quitar trabajo',`byId(${id}).job=0;pSheet(${id})`):'')+S.bld.filter(q=>BT[q.type].slots&&wk(q).length<slots(q)&&(BT[q.type].gun?!!p.wp:!p.arm)).map(q=>btn('Trabajar: '+BT[q.type].n,`asg(${id},${q.id})`)).join('')+'<p><b>Formación profesional</b> (15 comida por nivel)</p>'+PF.map(k=>btn(k+' ('+(p.ps[k]||0)+')',`tProf(${id},'${k}')`)).join('')+btn('Tratamiento médico (2 medicinas)',`heal(${id})`,!hs||p.hp>=mhp(p)-1&&!p.illness&&!p.injury)+'<p><b>Equipamiento</b></p>'+''+(S.inv.some(w=>w.kind!=='clothing'&&w.kind!=='outfit')?'<p>Armas disponibles:</p>'+S.inv.map((w,i)=>(w.kind==='clothing'||w.kind==='outfit')?'':btn(w.n+' (+'+w.v+')'+(window.wbTxt?wbTxt(w):''),`equip(${id},${i})`)).join(''):'')+(S.inv.some(w=>w.kind==='clothing')?'<p><b>Prendas recuperadas</b></p>'+S.inv.map((w,i)=>w.kind==='clothing'?btn(w.n+' (+'+(w.def||0)+' defensa)',`lootEquip(${id},${i})`):'').join(''):'')+(p.arm?btn('Licenciar del ejército',`byId(${id}).arm=null;pSheet(${id})`):'<p><b>Enrolar en el ejército</b></p>'+Object.keys(CL).map(k=>btn(CL[k].n,`enlist(${id},'${k}')`,CL[k].t&&!th(CL[k].t))).join(''));
show(p.n,h);drawAvatar(id)}
function paintFace(cv,p){const x=cv.getContext('2d'),l=p.look||{};x.setTransform(cv.width/180,0,0,cv.height/190,0,0);x.clearRect(0,0,180,190);
const F=p.sex==='F',kid=p.age<18,old=p.age>=55,id=p.id||0,OLN='#2a1a11',sk=(typeof l.skin==='string'&&l.skin[0]==='#')?l.skin:'#d9a67e',hc=old?'#a9a9a4':(l.hair||HAIR[id%5]);
const sty=F?[2,5,2,1][id%4]:[0,1,3,4][id%4],bear=!F&&!kid&&(id%7===0||id%7===3||id%7===5),mor=p.mor===undefined?60:p.mor;
const bg=x.createLinearGradient(0,0,0,190);bg.addColorStop(0,'#3a3d32');bg.addColorStop(1,'#14160f');x.fillStyle=bg;x.fillRect(0,0,180,190);
const vg=x.createRadialGradient(90,80,20,90,90,130);vg.addColorStop(0,'rgba(255,240,200,.10)');vg.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=vg;x.fillRect(0,0,180,190);
const ol=(w)=>{x.strokeStyle=OLN;x.lineWidth=w||2.2;x.lineJoin='round';x.stroke()};
/* pelo trasero */
{const hcx0=90,hcy0=kid?96:80;x.save();x.translate(hcx0,hcy0);if(kid)x.scale(.84,.84);x.translate(-hcx0,-hcy0+(kid?-2:0));
x.fillStyle=hc;
if(sty===2){x.beginPath();x.moveTo(44,70);x.bezierCurveTo(34,20,146,20,136,70);x.lineTo(146,150);x.quadraticCurveTo(138,160,124,150);x.lineTo(56,150);x.quadraticCurveTo(42,160,34,150);x.closePath();x.fill();ol(2.2)}
else if(sty===5){x.beginPath();x.ellipse(138,82,13,28,.35,0,7);x.fill();ol(2);x.fillStyle='#8a2a22';x.fillRect(128,66,14,8)}
else if(sty===1&&F){x.beginPath();x.moveTo(44,66);x.bezierCurveTo(32,24,148,24,136,66);x.lineTo(138,112);x.quadraticCurveTo(130,124,118,116);x.lineTo(62,116);x.quadraticCurveTo(50,124,42,112);x.closePath();x.fill();ol(2.2)}
x.restore()}
/* ---- hombros y mono ---- */
const sw=F?0:1;x.save();if(kid){x.translate(90,190);x.scale(.86,.86);x.translate(-90,-190)}
x.fillStyle=SUIT;x.beginPath();
if(F){x.moveTo(34,190);x.quadraticCurveTo(40,150,70,141);x.lineTo(110,141);x.quadraticCurveTo(140,150,146,190)}
else{x.moveTo(8,190);x.quadraticCurveTo(14,148,60,138);x.lineTo(120,138);x.quadraticCurveTo(166,148,172,190)}
x.closePath();x.fill();ol(2.4);
x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.moveTo(90,140);x.lineTo(F?146:172,190);x.lineTo(F?120:130,190);x.closePath();x.fill();
if(!F){x.fillStyle='rgba(0,0,0,.14)';x.fillRect(16,150,26,10);x.fillRect(138,150,26,10)}else{x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(78,178,13,10,0,0,7);x.ellipse(102,178,13,10,0,0,7);x.fill()}
/* cuello */
x.fillStyle=sk;x.beginPath();const nw=F?13:19;x.moveTo(90-nw,112);x.lineTo(90-nw,140);x.quadraticCurveTo(90,F?154:152,90+nw,140);x.lineTo(90+nw,112);x.closePath();x.fill();ol(2);
x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.moveTo(90-nw,118);x.lineTo(90+nw,118);x.lineTo(90+nw,134);x.quadraticCurveTo(90,140,90-nw,134);x.fill();
/* cuello del mono */
x.fillStyle=SUITD;x.beginPath();x.moveTo(90-nw-8,140);x.lineTo(90,F?172:166);x.lineTo(90+nw+8,140);x.lineTo(90+nw+2,134);x.lineTo(90,F?152:150);x.lineTo(90-nw-2,134);x.closePath();x.fill();ol(1.6);
x.strokeStyle='rgba(20,14,8,.5)';x.lineWidth=1.6;x.beginPath();x.moveTo(90,F?172:166);x.lineTo(90,190);x.stroke();
x.fillStyle='#8e5a30';x.fillRect(F?46:34,F?166:162,24,15);ol(1.4);x.fillStyle='#cdbf96';x.fillRect(F?51:39,F?171:167,14,3);
x.fillStyle='rgba(30,22,12,.28)';x.fillRect(F?54:60,F?178:176,28,5);
if(window.ovPort)ovPort(x,F);
x.restore();
/* ---- cabeza ---- */
const hcx=90,hcy=kid?96:80;x.save();x.translate(hcx,hcy);if(kid)x.scale(.84,.84);x.translate(-hcx,-hcy+(kid?-2:0));
const head=()=>{x.beginPath();if(F){x.moveTo(52,64);x.bezierCurveTo(52,26,128,26,128,64);x.lineTo(128,84);x.bezierCurveTo(128,108,106,132,90,133);x.bezierCurveTo(74,132,52,108,52,84);x.closePath()}
 else if(kid){x.ellipse(90,78,42,48,0,0,7)}
 else{x.moveTo(47,62);x.bezierCurveTo(47,24,133,24,133,62);x.lineTo(133,90);x.bezierCurveTo(133,112,116,130,90,131);x.bezierCurveTo(64,130,47,112,47,90);x.closePath()}};
/* mechones sobre los hombros */
x.fillStyle=hc;if(sty===2){x.beginPath();x.moveTo(42,84);x.lineTo(36,150);x.quadraticCurveTo(50,162,64,146);x.lineTo(58,96);x.closePath();x.fill();ol(2);x.beginPath();x.moveTo(138,84);x.lineTo(144,150);x.quadraticCurveTo(130,162,116,146);x.lineTo(122,96);x.closePath();x.fill();ol(2)}
else if(sty===5){}
/* orejas */
x.fillStyle=sk;x.beginPath();const ew=F?5.5:7.5;x.ellipse(47,82,ew,F?10:12,0,0,7);x.ellipse(133,82,ew,F?10:12,0,0,7);x.fill();ol(1.6);
x.fillStyle=sk;head();x.fill();
const sh=x.createLinearGradient(50,40,130,130);sh.addColorStop(0,'rgba(255,230,190,.18)');sh.addColorStop(.6,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(30,18,10,.28)');x.fillStyle=sh;head();x.fill();
ol(2.6);
/* suciedad y marcas (recortadas a la cara) */
x.save();head();x.clip();x.fillStyle='rgba(45,32,20,.2)';x.beginPath();x.ellipse(66,100,13,7,0,0,7);x.ellipse(120,58,12,5,0,0,7);x.ellipse(104,118,16,7,0,0,7);x.fill();
if(!F){x.fillStyle='rgba(255,255,255,.04)'}
if(old){x.strokeStyle='rgba(50,34,22,.35)';x.lineWidth=2;for(let k=0;k<3;k++){x.beginPath();x.moveTo(62,46+k*5);x.quadraticCurveTo(90,43+k*5,118,46+k*5);x.stroke()}x.beginPath();x.moveTo(56,80);x.lineTo(50,86);x.moveTo(124,80);x.lineTo(130,86);x.stroke()}
if(id%9===0){x.strokeStyle='rgba(130,55,45,.85)';x.lineWidth=2.6;x.beginPath();x.moveTo(110,64);x.lineTo(98,102);x.stroke();x.strokeStyle='rgba(230,200,180,.35)';x.lineWidth=1;x.stroke()}
/* barba / sombra de barba */
if(bear){x.fillStyle=hc;x.beginPath();x.moveTo(40,92);x.quadraticCurveTo(66,108,90,104);x.quadraticCurveTo(114,108,140,92);x.lineTo(140,140);x.lineTo(40,140);x.closePath();x.fill();x.fillStyle='rgba(0,0,0,.2)';x.fillRect(40,122,100,20);
 x.fillStyle=hc;x.beginPath();x.moveTo(72,98);x.quadraticCurveTo(90,92,108,98);x.quadraticCurveTo(90,106,72,98);x.fill()}
else if(!F&&!kid&&id%2){x.fillStyle='rgba(30,20,12,.26)';x.beginPath();x.ellipse(90,112,38,22,0,0,7);x.fill();x.beginPath();x.ellipse(90,96,20,6,0,0,7);x.fill()}
x.restore();
/* nariz */
x.strokeStyle='rgba(90,48,34,.9)';x.lineWidth=F?2.6:3.4;x.lineCap='round';x.beginPath();x.moveTo(90+(F?0:1),82);x.lineTo(F?87:85,F?96:98);x.lineTo(F?92:96,F?97:99);x.stroke();
x.fillStyle='rgba(0,0,0,.1)';x.beginPath();x.ellipse(F?88:86,F?97:99,F?6:8,3,0,0,7);x.fill();
/* ojos */
const sick=!!p.illness,ey=76,exs=[72,108];
exs.forEach((ex,k)=>{const w=F?8.4:7.6,h=F?4.8:4;x.fillStyle='rgba(50,32,22,.35)';x.beginPath();x.ellipse(ex,ey+1.5,w+4,h+4,0,0,7);x.fill();
 x.fillStyle='#ddd5c0';x.beginPath();x.ellipse(ex,ey,w,h,0,0,7);x.fill();x.fillStyle=F?'#3e2c20':'#2a2118';x.beginPath();x.arc(ex+(k?-.5:.5),ey+.4,h-.4,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex-1.4,ey-1.2,1.2,0,7);x.fill();
 x.strokeStyle=OLN;x.lineWidth=F?2.2:2;x.beginPath();x.ellipse(ex,ey,w,h,0,Math.PI*1.05,Math.PI*1.95);x.stroke();
 if(F){x.lineWidth=2;x.beginPath();const o=k?1:-1;x.moveTo(ex+o*w,ey-1);x.lineTo(ex+o*(w+4.5),ey-4.5);x.stroke();x.lineWidth=1.3;x.beginPath();x.moveTo(ex+o*(w-3),ey-h);x.lineTo(ex+o*(w-1),ey-h-3.5);x.stroke()}
 if(sick||old){x.fillStyle='rgba(60,40,50,.28)';x.beginPath();x.ellipse(ex,ey+h+3.5,w,3,0,0,Math.PI);x.fill()}});
/* cejas */
x.strokeStyle=F?'#2a1a10':hc;if(!F&&old)x.strokeStyle='#8a8a84';x.lineCap='round';x.lineWidth=F?3:6;
const low=mor<35,ang=mor<35?-4:(p.injury>0?-2:0);
x.beginPath();if(F){x.moveTo(60,66+ang);x.quadraticCurveTo(72,58,84,64-ang*.5);x.moveTo(96,64-ang*.5);x.quadraticCurveTo(108,58,120,66+ang)}else{x.moveTo(60,66+ang);x.lineTo(84,63-ang*.6);x.moveTo(96,63-ang*.6);x.lineTo(120,66+ang)}x.stroke();
/* boca */
if(F){x.fillStyle='#9c4a45';x.beginPath();const m=mor>=60?1.5:mor<35?-2.5:0;x.moveTo(76,108);x.quadraticCurveTo(84,103,90,105);x.quadraticCurveTo(96,103,104,108);x.quadraticCurveTo(90,114+m,76,108);x.fill();x.strokeStyle='#4a1f1a';x.lineWidth=1.6;x.beginPath();x.moveTo(76,108);x.quadraticCurveTo(90,107+m*.6,104,108);x.stroke()}
else{x.strokeStyle=bear?'#1c1008':'#5a2a22';x.lineWidth=bear?3:3.6;x.beginPath();if(mor>=60){x.moveTo(76,108);x.quadraticCurveTo(90,110,104,107)}else if(mor<35){x.moveTo(76,111);x.quadraticCurveTo(90,105,104,111)}else{x.moveTo(76,108);x.lineTo(104,108)}x.stroke()}
if(sick){x.fillStyle='rgba(120,190,80,.3)';head();x.fill()}
/* pelo delantero */
x.fillStyle=hc;
if(sty===0||(sty===1&&!F)){x.beginPath();x.moveTo(45,70);x.bezierCurveTo(40,22,140,22,135,70);x.lineTo(130,58);x.quadraticCurveTo(110,38,84,50);x.quadraticCurveTo(66,52,60,60);x.lineTo(50,72);x.closePath();x.fill();ol(2.2);x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.ellipse(78,38,14,4,-.3,0,7);x.fill()}
else if(sty===3){x.globalAlpha=.88;x.beginPath();x.moveTo(46,66);x.bezierCurveTo(44,26,136,26,134,66);x.lineTo(126,56);x.quadraticCurveTo(90,40,54,56);x.closePath();x.fill();x.globalAlpha=1;ol(1.4)}
else if(sty===4){x.globalAlpha=.5;x.beginPath();x.moveTo(48,64);x.bezierCurveTo(48,30,132,30,132,64);x.lineTo(126,54);x.quadraticCurveTo(90,42,54,54);x.closePath();x.fill();x.globalAlpha=1}
else if(F){x.beginPath();x.moveTo(46,74);x.bezierCurveTo(36,22,144,22,134,74);x.lineTo(124,50);x.quadraticCurveTo(100,34,78,42);x.quadraticCurveTo(62,52,56,76);x.closePath();x.fill();ol(2.2);
 x.beginPath();x.moveTo(46,74);x.quadraticCurveTo(44,96,50,112);x.lineTo(58,108);x.quadraticCurveTo(54,90,58,74);x.closePath();x.fill();ol(1.8);x.fillStyle='rgba(255,255,255,.13)';x.beginPath();x.ellipse(82,36,16,4,-.2,0,7);x.fill()}
/* venda */
if(p.hp<mhp(p)*.5||(p.injury||0)>40){x.fillStyle='#e0d8c4';x.save();x.translate(90,52);x.rotate(-.1);x.fillRect(-46,-6,92,12);x.restore();x.strokeStyle=OLN;x.lineWidth=1.4;x.strokeRect(44,46,92,12);x.fillStyle='#a52a2a';x.beginPath();x.arc(108,53,4.5,0,7);x.fill()}
/* gorros / equipo */
const pr=p.arm?'__arm':p.prof,dome=(col,r,y)=>{x.fillStyle=col;x.beginPath();x.moveTo(90-r,y+6);x.bezierCurveTo(90-r,y-r*1.25,90+r,y-r*1.25,90+r,y+6);x.closePath();x.fill();ol(2.2)};
if(pr==='__arm'){dome('#4b5a35',52,54);x.fillStyle='#3a4628';x.fillRect(38,54,104,9);ol(1.6);x.fillStyle='rgba(255,255,255,.14)';x.fillRect(66,28,30,4)}
else if(pr==='Agricultor'){x.fillStyle='#a8905a';x.beginPath();x.ellipse(90,52,68,13,0,0,7);x.fill();ol(2.2);dome('#a8905a',38,52);x.fillStyle='#6a2f26';x.fillRect(53,46,74,6)}
else if(pr==='Constructor'){dome('#c9a02a',48,56);x.fillStyle='#c9a02a';x.fillRect(38,54,104,9);ol(1.6);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(70,30,40,5)}
else if(pr==='Cocinero'){x.fillStyle='#e8e4d4';x.fillRect(58,24,64,30);x.beginPath();x.arc(68,24,17,0,7);x.arc(90,15,19,0,7);x.arc(112,24,17,0,7);x.fill();ol(1.8)}
else if(pr==='Recolector'){x.fillStyle='#7a2f26';x.fillRect(44,50,92,14);ol(1.6)}
else if(pr==='Científico'){x.strokeStyle='#b9e4e0';x.lineWidth=4.5;x.beginPath();x.rect(60,68,25,16);x.rect(95,68,25,16);x.moveTo(85,76);x.lineTo(95,76);x.stroke();x.fillStyle='rgba(150,240,230,.25)';x.fillRect(61,69,23,14);x.fillRect(96,69,23,14)}
else if(pr==='Médico'){dome('#e8e4d4',42,54);x.fillStyle='#b02a2a';x.fillRect(86,34,8,18);x.fillRect(81,39,18,8)}
else if(pr==='Mecánico'){dome('#3a3a6a',47,57);x.fillRect(44,55,96,8);x.fillRect(90,62,52,5)}
else if(pr==='Explorador'){dome('#3a5a7a',47,57);x.fillRect(44,55,96,8)}
x.restore();x.setTransform(1,0,0,1,0,0)}
function drawAvatar(id){const c=document.getElementById('avatar');if(!c)return;const p=byId(id)||byId(sel)||S.ppl[0];if(p)paintFace(c,p)}
function pcard(p,click,cls,tag){const hc=p.hp>=70?'hp1':p.hp>=35?'hp2':'hp3';return`<div class="pc ${hc} ${cls||''}" onclick="${click}"><span class="tg">${tag===undefined?pTags(p):tag}</span><canvas class="pf" data-id="${p.id}" width="120" height="126"></canvas><b>${p.n}</b><small>${p.prof} · niv ${p.lvl} · ${p.age} años</small></div>`}
function pTags(p){return(p.age<6?'👶':p.age<18?'🧒':'')+(p.arm?'⚔️':'')+(p.illness?'🤒':'')+(p.injury>0?'🩹':'')+(p.away?'🚶':'')+(p.preg?'🤰':'')}
function paintCards(){document.querySelectorAll('canvas.pf').forEach(c=>{const p=byId(+c.dataset.id);if(p)paintFace(c,p)})}
function tProf(id,pr){const p=byId(id);if(S.res.food<15)return toast('Faltan 15 de comida.');S.res.food-=15;p.ps[pr]=Math.min(10,(p.ps[pr]||0)+1);S.dt++;const best=Object.keys(p.ps).reduce((a,k)=>p.ps[k]>p.ps[a]?k:a,p.prof);if(p.ps[best]>(p.ps[p.prof]||0)){p.prof=best;p.sp=pk(SPC[best])}toast(p.n+': '+pr+' nivel '+p.ps[pr]);pSheet(id)}
function train(id){const p=byId(id),c=10+5*p.lvl;if(p.td===S.day)return toast(p.n+' ya ha entrenado hoy.');if(S.res.food<c)return toast('Falta comida ('+c+').');S.res.food-=c;p.td=S.day;p.xp+=cnt('barr')?40:20;S.dt++;lvlUp(p);pSheet(id)}
function heal(id){const p=byId(id),c=healCost(p,S.bld.find(x=>x.type=='hosp'));if(S.res.meds<c)return toast('Faltan medicinas: necesitas '+c+'.');S.res.meds-=c;p.hp=mhp(p);p.injury=0;pSheet(id)}function cure(id){const p=byId(id);if(!p||!p.illness)return;if(!(S.res.abx>=1))return toast('Faltan antibióticos.');S.res.abx--;p.illness='';toast('💊 '+p.n.split(' ')[0]+' se ha curado.');pSheet(id)}
function gearEquip(id,k){const p=byId(id);p.gear=p.gear||{armor:0,pack:0};if(!p.gear[k])return;   /* ya no se compra equipo con recursos: solo armas y atuendos fabricados o encontrados */if(p.gear[k]){p.gear[k]=0;toast('Equipo retirado.')}else if(k==='armor'){if(S.res.metal<35||S.res.wood<15)return toast('Faltan materiales.');S.res.metal-=35;S.res.wood-=15;p.gear.armor=1;toast(p.n+' equipa armadura: +4 defensa.')}else{if(S.res.wood<20||S.res.metal<10)return toast('Faltan materiales.');S.res.wood-=20;S.res.metal-=10;p.gear.pack=1;toast(p.n+' equipa mochila: +25% botín de expedición.')}save();pSheet(id)}
function enlist(id,k){const p=byId(id);if(p.preg||p.age<18)return toast(p.preg?'Una embarazada no puede ir al ejército.':'Los niños no pueden alistarse.');if(S.ppl.filter(q=>q.arm).length>=acap())return toast('Ejército completo. Construye o mejora Barracones.');if(S.res.ammo<5)return toast('Falta munición.');S.res.ammo-=5;p.arm=k;p.job=0;pSheet(id)}
function equip(id,i){const p=byId(id),w=S.inv.splice(i,1)[0];if(p.wp)S.inv.push(p.wp);p.wp=w;pSheet(id)}
/* entrenamiento automático: al empezar cada día entrena a todo el ejército si hay comida y munición */
function trainArmyQuiet(){let n=0;S.ppl.filter(p=>p.arm&&!p.away&&p.td!==S.day).forEach(p=>{const c=10+5*p.lvl;if(S.res.food>=c+S.ppl.length*3&&S.res.ammo>=5+20){S.res.food-=c;S.res.ammo-=5;p.td=S.day;p.xp+=40;lvlUp(p);n++}});if(n)S.dt=(S.dt||0)+1;return n}
function toggleAutoTrain(){S.autoTrain=!S.autoTrain;if(S.autoTrain){const n=trainArmyQuiet();toast('Entrenamiento automático activado'+(n?' ('+n+' entrenadas hoy)':'')+'.')}else toast('Entrenamiento automático desactivado.');bPanel(sel)}
function trainArmy(){let n=0;S.ppl.filter(p=>p.arm&&p.td!==S.day).forEach(p=>{const c=10+5*p.lvl;if(S.res.food>=c&&S.res.ammo>=5){S.res.food-=c;S.res.ammo-=5;p.td=S.day;p.xp+=40;lvlUp(p);n++}});toast(n+' unidades entrenadas.');S.dt+=n?1:0;bPanel(sel)}
function armyMenu(){const a=S.ppl.filter(p=>p.arm);show('Ejército ('+a.length+'/'+acap()+') · Poder '+armyPow(),a.map(p=>btn(`${CL[p.arm].n}: ${p.n} niv ${p.lvl} · Poder ${upow(p)} · Salud ${Math.round(p.hp)}`,`pSheet(${p.id})`)).join('')||'<p>Aún no hay unidades. Enrola supervivientes desde su ficha.</p>')}
function techMenu(){const lab=cnt('lab')>0;show('Árbol tecnológico visual','<canvas id="techCanvas" width="420" height="250" style="width:100%;max-width:420px;background:#101810;border:1px solid #65764d;border-radius:8px"></canvas><p>Las líneas muestran dependencias por ramas.</p>'+(lab?'':'<p>Necesitas un Laboratorio para investigar.</p>')+TECH.map(t=>{const d=S.tech[t[0]];return`<p><b>${t[2]}</b> (${t[1]}) ${t[5]}.<br>`+(d?'Investigada':btn('Investigar: '+cs(t[4])+' · ayunt. '+t[3],`research('${t[0]}')`,!lab||hallLv()<t[3]))+'</p>'}).join(''));drawTechTree()}
function drawTechTree(){const c=document.getElementById('techCanvas');if(!c)return;const x=c.getContext('2d'),nodes=TECH.slice(0,16);x.clearRect(0,0,c.width,c.height);nodes.forEach((t,i)=>{const col=i%4,row=Math.floor(i/4),px=50+col*105,py=30+row*58;if(row){x.strokeStyle='#718d58';x.lineWidth=2;x.beginPath();x.moveTo(px,py-58);x.lineTo(px,py-15);x.stroke()}x.fillStyle=S.tech[t[0]]?'#477e3d':'#394333';x.strokeStyle='#d4b45b';x.fillRect(px-40,py-14,80,28);x.strokeRect(px-40,py-14,80,28);x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='center';x.fillText(t[2].slice(0,13),px,py+3)})}
function research(id){const t=TECH.find(q=>q[0]==id);if(!can(t[4]))return toast('Faltan recursos.');pay(t[4]);S.tech[id]=1;toast('Tecnología investigada: '+t[2]);techMenu()}
/* ================= EXPLORACIÓN ================= */
const STORY=[
{n:'Cap. 1 · La señal de radio',h:3,g:1,intro:'Una radio de la ciudad capta una señal entrecortada: alguien pide ayuda desde la gasolinera de la carretera vieja.',evs:[{t:'La señal se repite, cada vez más débil, desde la gasolinera.',a:'Seguir la señal',b:'Esperar a que se repita'},{t:'Un grupo de zombis merodea entre los surtidores.',a:'Atacar',b:'Distraerlos con ruido'},{t:'Entre los coches volcados hay un superviviente herido.',a:'Rescatarlo',b:'Dejarle agua y marchar',sv:1}],l:{metal:[5,15],scrap:[8,20]},outro:'El superviviente habla de una caravana de mercaderes perdida más al este.',r:{res:{meds:20},sv:1}},
{n:'Cap. 2 · La caravana perdida',h:3,g:2,intro:'Los restos de la caravana deberían estar a medio día de camino. Se dice que llevaba armas y suministros.',evs:[{t:'Encuentras los restos de la caravana volcados en la carretera.',a:'Inspeccionar los vehículos',b:'Vigilar desde lejos'},{t:'Hay huellas recientes de bandidos.',a:'Tenderles una emboscada',b:'Esconderse',am:1},{t:'Un camión blindado sigue cerrado con su carga dentro.',a:'Forzar la puerta',b:'Buscar la llave'}],l:{wood:[40,90],metal:[20,40]},outro:'El camión escondía armamento. Los bandidos de la zona ya saben que andáis por ahí.',r:{res:{metal:80,ammo:40},wp:1}},
{n:'Cap. 3 · El hospital tomado',h:3,g:2,intro:'Un antiguo hospital guarda medicinas y, según rumores, médicos atrapados dentro.',evs:[{t:'El vestíbulo está lleno de infectados.',a:'Abrirse paso',b:'Usar la entrada de servicio'},{t:'Oís golpes tras una puerta cerrada: hay gente dentro.',a:'Derribar la puerta',b:'Llamar con calma',sv:1},{t:'La farmacia está intacta pero la puerta está atrancada.',a:'Romper la reja',b:'Buscar otra entrada'}],l:{meds:[25,50]},outro:'Los médicos rescatados deciden unirse a vuestra ciudad.',r:{res:{meds:60},sv:2,fac:{ref:10}}},
{n:'Cap. 4 · El laboratorio clausurado',h:4,g:3,intro:'Un laboratorio sellado desde el inicio del brote. Quizá guarde pistas sobre lo que ocurrió.',evs:[{t:'La puerta de seguridad aún tiene corriente.',a:'Forzar el panel',b:'Cortar la luz y entrar'},{t:'Zombis deformados vagan por los pasillos.',a:'Enfrentarlos',b:'Esquivarlos'},{t:'Un ordenador sigue encendido con archivos del brote.',a:'Copiar todo',b:'Copiar lo esencial'},{t:'La alarma se activa y se oyen pasos por todas partes.',a:'Resistir',b:'Huir por el conducto'}],l:{meds:[20,40],elec:[30,60]},outro:'Los archivos hablan de un foco de infección en el centro de la ciudad vieja.',r:{res:{elec:80},tech:1}},
{n:'Cap. 5 · La base militar',h:4,g:4,intro:'Una base del ejército, abandonada, con un arsenal que nadie ha tocado.',evs:[{t:'La verja está custodiada por zombis con uniforme.',a:'Asalto frontal',b:'Buscar un hueco'},{t:'Una torreta automática sigue operativa.',a:'Desactivarla',b:'Rodearla'},{t:'Llegáis al almacén de armas, cerrado con código.',a:'Volar la puerta',b:'Descifrar el código'},{t:'Una patrulla de supervivientes armados os apunta.',a:'Imponerse',b:'Negociar',sv:1}],l:{ammo:[40,80],metal:[30,60]},outro:'El arsenal es vuestro. El ejército superviviente os verá con otros ojos.',r:{res:{ammo:100,metal:60},wp:2,fac:{mil:30}}},
{n:'Cap. 6 · El origen del brote',h:5,g:5,intro:'Todo apunta a un edificio en el corazón de la ciudad vieja. Es la misión más peligrosa.',evs:[{t:'Una marea de zombis bloquea las calles hacia el centro.',a:'Abrirse paso a la fuerza',b:'Tomar los túneles'},{t:'Los túneles están inundados y oscuros.',a:'Cruzar deprisa',b:'Avanzar con cuidado'},{t:'Un zombi gigantesco os corta el paso.',a:'Atacarlo de frente',b:'Tenderle una trampa'},{t:'Llegáis a la sala del foco. Algo late bajo el suelo.',a:'Destruirlo',b:'Sellarlo'},{t:'La estructura se derrumba. Hay que salir ya.',a:'Correr por el centro',b:'Salir por el lateral',sv:1}],l:{food:[40,80],water:[40,80],meds:[20,40]},outro:'El foco queda sellado. La ciudad respira, aunque el peligro no ha desaparecido del todo. ¡Has completado la historia!',r:{res:{food:150,water:150,meds:80,ammo:100,metal:150},sv:3}}];
var exZ,exC,exTab='hist';
const EXT_ZONES=[
{id:'suburb',n:'Barrio residencial',kind:'Casas abandonadas',icon:'🏚️',x:18,y:20,h:1,g:1,dist:1,loot:{food:[12,28],water:[10,25],wood:[8,20],meds:[0,3]},intro:'Calles estrechas, viviendas saqueadas y coches abandonados. Se oyen ruidos dentro de algunos edificios.'},
{id:'market',n:'Supermercado',kind:'Comercio',icon:'🛒',x:32,y:18,h:1,g:2,dist:2,loot:{food:[35,75],water:[20,45],meds:[0,5]},intro:'El supermercado está parcialmente saqueado. Los almacenes traseros podrían conservar suministros.'},
{id:'station',n:'Gasolinera',kind:'Suministros',icon:'⛽',x:45,y:27,h:2,g:2,dist:2,loot:{metal:[5,18],food:[5,15],scrap:[10,25]},intro:'Una gasolinera junto a la autovía. Hay combustible, pero el depósito está expuesto.'},
{id:'hospital',n:'Hospital abandonado',kind:'Sanidad',icon:'🏥',x:61,y:16,h:2,g:3,dist:3,loot:{meds:[25,55],water:[10,25],elec:[5,15]},intro:'El hospital conserva parte de su farmacia y material médico. Los pasillos están oscuros.'},
{id:'factory',n:'Complejo industrial',kind:'Industria',icon:'🏭',x:68,y:37,h:3,g:4,dist:4,loot:{metal:[40,90],wood:[10,25],elec:[15,35]},intro:'Naves industriales y almacenes con maquinaria. El ruido puede atraer a muchos zombis.'},
{id:'police',n:'Comisaría',kind:'Seguridad',icon:'🚓',x:43,y:55,h:3,g:4,dist:4,loot:{ammo:[25,60],metal:[10,30],meds:[5,15]},intro:'La comisaría fue evacuada a toda prisa. El armero podría seguir cerrado.'},
{id:'camp',n:'Campamento militar',kind:'Militar',icon:'🪖',x:72,y:63,h:4,g:5,dist:5,loot:{ammo:[50,100],food:[20,45],meds:[10,25],metal:[30,60]},intro:'Un campamento fortificado en las afueras. Hay suministros, pero también una gran concentración de infectados.'}
];
var extPick='suburb';
/* el mapa se va descubriendo: misiones de historia hasta la actual y zonas libres que aparecen según avanzas */
window.sVis=i=>S.mode==='creativo'||i<=(S.story||0);window.zVis=z=>S.mode==='creativo'||EXT_ZONES.indexOf(z)<Math.ceil(((S.story||0)+1)*EXT_ZONES.length/STORY.length);
function worldMapMenu(){const lv=hallLv();let h='<p>Mapa exterior · Toca una ubicación para inspeccionarla. Las zonas lejanas requieren un ayuntamiento más avanzado.</p><div class="extmap">';h+=EXT_ZONES.filter(zVis).map(z=>`<button class="extpin ${z.h>lv?'locked':''} ${z.id===extPick?'chosen':''}" style="left:${5+z.x/80*88}%;top:${5+z.y/80*84}%" onclick="extPick='${z.id}';worldMapMenu()" title="${z.n}">${z.icon}</button>`).join('');h+='</div><div class="row">';h+=EXT_ZONES.filter(zVis).map(z=>`<div class="card ${z.h>lv?'lk':''}" onclick="extPick='${z.id}';worldMapMenu()"><b>${z.icon} ${z.n}</b><br><small>${z.kind} · Peligro ${z.g}/5</small></div>`).join('');h+='</div>';const z=EXT_ZONES.find(q=>q.id===extPick)||EXT_ZONES[0];h+=`<hr><h4>${z.icon} ${z.n}</h4><p>${z.intro}</p><p>Distancia: ${z.dist} · Peligro: ${z.g}/5 · Requisito: ayuntamiento nivel ${z.h}</p><p>Botín probable: ${Object.keys(z.loot).map(k=>RN[k]).join(', ')}</p>`+btn('Preparar expedición en esta zona',`exTab='world';exZ=EXT_ZONES.findIndex(q=>q.id==='${z.id}');expMenu()`,z.h>lv);show('Mapa del mundo exterior',h)}
function extEventFor(z,i){const events=[{t:'Un grupo de zombis bloquea la entrada principal.',a:'Abrirse paso',b:'Buscar una entrada secundaria'},{t:'Encuentras un almacén con la puerta atascada.',a:'Forzar la puerta',b:'Revisar una ventana lateral'},{t:'Un superviviente pide ayuda desde una habitación cerrada.',a:'Rescatarlo',b:'No arriesgar al equipo',sv:1},{t:'Una alarma antigua empieza a sonar y atrae infectados.',a:'Desactivarla rápidamente',b:'Retirarse y esperar'},{t:'El camino está cortado por un coche volcado y una cadena de zombis.',a:'Apartar el coche y abrirse paso',b:'Dar un rodeo largo'}];return events[(i+z.g)%events.length]}
function storyZone(i){const c=STORY[i];return{n:c.n,g:c.g,l:c.l,evs:c.evs,intro:c.intro,outro:c.outro,r:c.r,chap:i}}
function storyReward(r){let h='<br><b>Recompensa:</b>';if(r.res){r.res=window.noFW?noFW(r.res):r.res;for(const k in r.res)S.res[k]=Math.min(cap(),S.res[k]+r.res[k]);h+=' '+cs(r.res)}
if(r.sv){let n=0;for(let i=0;i<r.sv&&S.ppl.length<pcap();i++){S.ppl.push(mkP());S.stat.rescued++;n++}if(n)h+=', +'+n+' supervivientes'}
if(r.out){S.inv.push({kind:'outfit',n:r.out});h+=', atuendo: '+r.out}
if(r.wp!==undefined){S.inv.push({n:WP[r.wp].n,v:WP[r.wp].v});h+=', arma: '+WP[r.wp].n}
if(r.tech){const t=TECH.filter(q=>!S.tech[q[0]]);if(t.length){const q=pk(t);S.tech[q[0]]=1;h+=', planos: '+q[2]}}
if(r.fac)for(const k in r.fac)if(S.fac[k]!==undefined)S.fac[k]=cl(S.fac[k]+r.fac[k],-100,100);return h}
function expMenu(){if(S.exp)return exEvent();if(S.solo)return soloView();
const has=cnt('expo')>0;if(!has)exTab='solo';const mx=3+(th('expl1')?1:0)+(window.cmdBonus?cmdBonus():0);
let h='<p>'+(has?btn('Misiones de historia',"exTab='hist';expMenu()")+btn('Misiones libres',"exTab='zonas';expMenu()")+btn('Mapa exterior','worldMapMenu()'):'')+btn('Explorador solitario (sin mapa)',"exTab='solo';expMenu()")+'</p>';
if(!has)h+='<p style="color:#e8a090"><b>Para hacer misiones necesitas un Centro de expediciones</b> (ayuntamiento nivel 3). Mientras tanto solo puedes enviar al explorador solitario.</p>';
if(exTab=='solo'){h+='<p>Envía a <b>un</b> superviviente a explorar los alrededores. Cuesta 10 comida y 10 agua. Por el camino le irán pasando cosas: puede volver con suministros, armas, planos o supervivientes... o no volver. Tú decides cuándo regresar.</p>'+
S.ppl.filter(p=>!p.away&&p.hp>30&&!p.preg&&p.age>=18).map(p=>btn(`${p.n} · ${p.prof} · poder ${upow(p)} · salud ${Math.round(p.hp)}`+(p.ps.Explorador?' ★'+p.ps.Explorador:''),`soloGo(${p.id})`,S.res.food<10||S.res.water<10)).join('')}
else{h+=`<p>Equipo (máx. ${mx}).</p>`;
if(exTab=='world'){h+=`<p>Destino: <b>${EXT_ZONES[exZ]&&EXT_ZONES[exZ].n||'No seleccionado'}</b>. Selecciona el equipo.</p>`+btn('Cambiar destino','worldMapMenu()')+EXT_ZONES.map((z,i)=>!zVis(z)?'':btn(z.n+' · peligro '+z.g,`exZ=${i};expMenu()`,z.h>hallLv())).join('')}else if(exTab=='hist'){h+=STORY.map((c,i)=>!sVis(i)?'':btn(`${i<S.story?'✔ ':''}${c.n} · poder recomendado ~${dgOf({chap:i,g:c.g})}`,`exC=${i};expMenu()`,(i>S.story&&S.mode!=='creativo')||c.h>hallLv()||(window.chLocked&&chLocked(i)))).join('');
if(exC!==undefined)h+=`<p>Elegido: <b>${STORY[exC].n}</b><br><i>${STORY[exC].intro}</i>${exC<S.story?'<br><small>Ya completado: solo da el botín del camino.</small>':''}</p>`}
else{h+=ZN.map((z,i)=>btn(`${z.n} · peligro ${z.g}`,`exZ=${i};expMenu()`,z.h>hallLv())).join('');
if(exZ!==undefined)h+=`<p>Elegido: <b>${ZN[exZ].n}</b>. Botín: ${Object.keys(ZN[exZ].l).map(k=>RN[k]).join(', ')}.</p>`}
h+=S.ppl.filter(p=>!p.away&&p.hp>30&&!p.preg&&p.age>=18).map(p=>btn(`${p.n} · ${p.prof} · poder ${upow(p)}`+(exSel.includes(p.id)?' ✔':''),`exTog(${p.id})`)).join('')+'<p>'+btn('Partir','exGo()')+'</p>'}
show('Expedición',h)}
function exTog(id){const i=exSel.indexOf(id),mx=3+(th('expl1')?1:0)+(window.cmdBonus?cmdBonus():0);if(i>=0)exSel.splice(i,1);else if(exSel.length<mx)exSel.push(id);expMenu()}
function exGo(){if(S.exp)return;exSel=exSel.filter(i=>{const q=byId(i);return q&&!q.preg&&q.age>=18});const zz=exTab=='hist'?(exC===undefined?null:storyZone(exC)):exTab=='world'?(exZ===undefined?null:(()=>{const q=EXT_ZONES[exZ];return q?{...q,n:q.n,l:q.loot,intro:q.intro,evs:[0,1,2,3].map(i=>extEventFor(q,i))}:null})()):(exZ===undefined?null:ZN[exZ]);if(!zz||!exSel.length)return toast('Elige destino y equipo.');const dist=zz.dist||1,fuelCost=0;S.exp={z:zz,team:exSel.slice(),step:0,loot:{},log:[],surv:0,ok:0,fuelCost,dist,world:exTab==='world'};exSel=[];S.exp.team.forEach(i=>byId(i).away=1);exEvent()}
/* ---------- Explorador solitario ---------- */
const SOLO_RES=['food','water','wood','metal','meds','ammo'],SOLO_R={food:[20,45],water:[20,45],wood:[25,60],metal:[15,40],meds:[5,15],ammo:[10,25],fuel:[5,15]};
function toggleDock(){const b=$('bot'),closed=b.classList.toggle('dock-collapsed');$('dockToggle').setAttribute('aria-expanded',closed?'false':'true');$('dockToggle').textContent=closed?'☰ Menú':'✕ Cerrar menú'}
function soloGo(id){const p=byId(id);if(!p||p.away||S.solo)return;if(p.preg||p.age<18)return toast('No puede salir de expedición.');if(horde)return toast('No puedes salir durante una horda.');if(S.res.food<10||S.res.water<10)return toast('Necesitas 10 de comida y 10 de agua.');
S.res.food-=10;S.res.water-=10;p.away=1;S.solo={id,step:0,max:50,loot:{},log:[],items:[],surv:0,tech:[],returning:false,txt:p.n+' sale de la ciudad por el camino viejo...'};soloView()}
function soloView(){const s=S.solo,p=s&&byId(s.id);if(!p){S.solo=null;return}
const L=Object.keys(s.loot).filter(k=>s.loot[k]>0).map(k=>Math.round(s.loot[k])+' '+RN[k]).concat(s.items.map(i=>i.n),s.surv?[s.surv+' superviviente(s)']:[],s.kit?[s.kit+' botiquín(es)']:[],s.tech.map(i=>'planos: '+TECH.find(q=>q[0]==i)[2])).join(', ')||'nada aún';
const pd=s.pend?CH[s.pend.i]:null;const returnChance=Math.max(0,100-Math.floor(s.step/5)*10);
let controls='';if(s.returning){controls=`<p><b>🚶 Regresando a la ciudad...</b></p><p>El viaje de vuelta terminará al comenzar el día ${s.returnDay}. El superviviente seguirá fuera hasta entonces.</p>`;}else if(pd){controls=btn(pd.a,'soloPick(0)')+btn(pd.b,'soloPick(1)')+((s.kit>0||S.res.meds>0)&&p.hp<mhp(p)-1?btn('💉 Curar (+35 salud)','soloUse()'):'');}else{controls=(s.step<s.max?btn('Seguir adelante ('+s.step+'/50)','soloStep()'):'<p>Has alcanzado el límite de 50 tramos.</p>')+((s.kit>0||S.res.meds>0)&&p.hp<mhp(p)-1?btn('💉 Curar (+35 salud)','soloUse()'):'')+btn(s.step?'Regresar a la ciudad':'Cancelar expedición','soloRequestReturn()');}
show('Expedición solitaria: '+p.n,bar('Salud '+Math.round(p.hp)+'/'+mhp(p),p.hp/mhp(p)*100,'#d44')+`<p><b>Tramo ${s.step}/50</b> · Probabilidad de volver con vida: <b>${returnChance}%</b></p><p>Botín: ${L}${s.dog?' · 🐕':''}</p>`+s.log.slice(-4,pd?undefined:-1).map(l=>'<p><small>'+l+'</small></p>').join('')+`<p><b>${s.txt}</b></p>`+controls)}
const CH=[
{t:'Ves un edificio con la puerta entreabierta y se oyen ruidos dentro.',a:'Entrar',b:'Rodearlo',r:[(s,p)=>{if(Math.random()<.55+soloLuck(p,s)){const a=pk(SOLO_RES),b=pk(SOLO_RES),na=ri(...SOLO_R[a]),nb=ri(...SOLO_R[b]);s.loot[a]=(s.loot[a]||0)+na;s.loot[b]=(s.loot[b]||0)+nb;return'Entras con cuidado y hay buen botín: +'+na+' '+RN[a]+' y +'+nb+' '+RN[b]+'.'}const dm=Math.round(rn(15,30));p.hp-=dm;return'Dentro había infectados. Sales corriendo y malherido (-'+dm+' salud).'},(s,p)=>{const a=pk(SOLO_RES),n=Math.round(ri(...SOLO_R[a])/3);s.loot[a]=(s.loot[a]||0)+n;return'Rodeas el edificio sin problemas y recoges lo que ves por fuera (+'+n+' '+RN[a]+').'}]},
{t:'Un puente medio derrumbado separa dos barrios.',a:'Cruzar por el puente',b:'Dar un rodeo largo',r:[(s,p)=>{if(Math.random()<.6+soloLuck(p,s)){s.loot.metal=(s.loot.metal||0)+25;s.loot.wood=(s.loot.wood||0)+25;return'Cruzas con cuidado y encuentras material tirado al otro lado (+25 metal, +25 madera).'}const dm=Math.round(rn(12,25));p.hp-=dm;return'El puente cede y caes. Te levantas dolorido (-'+dm+' salud).'},(s,p)=>{s.step=Math.min(s.max,s.step+1);return'Das un largo rodeo seguro. Pierdes un tramo de viaje, pero llegas entero.'}]},
{t:'Un perro callejero te sigue, hambriento.',a:'Compartir tu comida',b:'Ahuyentarlo',r:[(s,p)=>{if(s.loot.food>=5)s.loot.food-=5;s.dog=1;return'El perro se queda contigo y te avisa de peligros (+5% de suerte el resto del viaje).'},(s,p)=>'El perro se aleja gimoteando. Sigues solo.']},
{t:'Una caravana abandonada tiene un cofre cerrado con candado.',a:'Forzar el cofre',b:'Dejarlo',r:[(s,p)=>{if(Math.random()<.5+soloLuck(p,s)){if(Math.random()<.4){const w=pk(WP.filter(q=>!q.t||th(q.t)));s.items.push({n:w.n,v:w.v});return'¡El cofre guardaba un arma: '+w.n+'!'}s.loot.ammo=(s.loot.ammo||0)+25;return'Dentro hay munición (+25).'}const dm=Math.round(rn(10,20));p.hp-=dm;return'El ruido atrae a unos infectados. Escapas herido (-'+dm+' salud).'},(s,p)=>'Prefieres no arriesgarte y sigues tu camino.']},
{t:'Un superviviente herido te pide ayuda al borde del camino.',a:'Ayudarle',b:'Ignorarle',r:[(s,p)=>{if(s.kit>0){s.kit--;s.surv++;return'Usas un botiquín para curarle. Agradecido, decide seguirte a la ciudad.'}s.loot.scrap=(s.loot.scrap||0)+15;return'No tienes con qué curarle, pero te habla de un escondite cercano (+15 chatarra).'},(s,p)=>'Sigues adelante sin mirar atrás.']}];
function soloLuck(p,s){return(p.ps.Explorador||0)*.03+(p.prof=='Explorador'?.04:0)+(th('expl1')?.03:0)+(th('expl2')?.03:0)+(s&&s.dog?.05:0)}
function soloPick(k){const s=S.solo,p=s&&byId(s.id);if(!p||!s.pend)return;const c=CH[s.pend.i];s.pend=null;const t=c.r[k](s,p);s.txt=t;s.log.push(s.step+'. '+t);if(p.hp<=0)return soloEnd(1);soloView()}
function soloUse(){const s=S.solo,p=s&&byId(s.id);if(!p||s.returning||p.hp>=mhp(p)-1)return;if(s.kit>0)s.kit--;else if(S.res.meds>0)S.res.meds--;else return toast('No quedan botiquines ni medicinas.');const old=Math.round(p.hp);p.hp=Math.min(mhp(p),p.hp+35);p.injury=Math.max(0,(p.injury||0)-8);s.txt=p.n+' se cura durante la expedición (+'+(Math.round(p.hp)-old)+' salud).';s.log.push('Tramo '+s.step+': '+s.txt);save();soloView()}
function soloRequestReturn(){const s=S.solo,p=s&&byId(s.id);if(!s||!p||s.returning)return;if(s.step===0){return soloEnd(0)}s.returning=true;s.returnDay=S.day+1;s.txt=p.n+' ha iniciado el regreso. La vuelta tardará un día completo.';save();soloView()}
function soloResolveReturn(){const s=S.solo,p=s&&byId(s.id);if(!s||!p||!s.returning||S.day<s.returnDay)return '';const chance=Math.max(0,100-Math.floor(s.step/5)*10);if(Math.random()*100>=chance){S.solo=null;p.away=0;die(p,'desapareció durante el regreso de una expedición solitaria');save();return p.n+' no ha conseguido regresar. Probabilidad de supervivencia: '+chance+'%. Se ha perdido el botín.';}return soloEnd(0,true)}
function soloStep(){const s=S.solo,p=s&&byId(s.id);if(!p){S.solo=null;return}if(s.returning)return toast('Ya está regresando a la ciudad.');if(s.step>=50)return soloView();
const lk=soloLuck(p,s),pw=upow(p),d=22+s.step*10,fight=dg=>pw*rn(.6,1.4)>dg,add=(r,n)=>{s.loot[r]=(s.loot[r]||0)+n};
const W=[['sup',30],['zom',24],['trap',9],['calm',9],['rest',8],['band',7+s.step],['surv',2+lk*40],['wp',2+lk*40],['bp',1+lk*30],['ch',12],['kit',5]];
let r=rn(0,W.reduce((a,w)=>a+w[1],0)),k=W[0][0];for(const w of W){if(r<w[1]){k=w[0];break}r-=w[1]}
let t='';if(S.solo&&s.pend)return;
if(k=='ch'){const i=ri(0,CH.length-1);s.step++;s.pend={i};s.txt=CH[i].t;return soloView()}
if(k=='sup'){const res=pk(SOLO_RES),n=Math.round(ri(...SOLO_R[res])*(1+lk));add(res,n);t=pk(['Registras unas ruinas abandonadas','Encuentras un coche destrozado','Un almacén olvidado aún guarda cosas útiles'])+': +'+n+' '+RN[res]+'.'}
else if(k=='zom'){if(fight(d)){p.xp+=4;t='Un grupo de zombis te cierra el paso. Logras abatirlos y sigues.';if(Math.random()<.4){add('ammo',8);t+=' Recoges +8 munición.'}}else{const dm=Math.round(rn(10,28));p.hp-=dm;t='Los zombis te rodean. Escapas herido (-'+dm+' salud).'}}
else if(k=='trap'){const dm=Math.round(rn(5,15));p.hp-=dm;t=pk(['Pisas una trampa oxidada','Te cortas con unos cristales','Caes por un suelo podrido'])+' (-'+dm+' salud).'}
else if(k=='calm')t=pk(['El camino está tranquilo. Solo se oye el viento.','Encuentras un mirador y observas la zona sin novedad.','Cruzas un barrio vacío, sin nada que merezca la pena.'])
else if(k=='rest'){p.hp=Math.min(mhp(p),p.hp+18);t='Encuentras un refugio improvisado. Descansas un rato (+18 salud).'}
else if(k=='band'){if(fight(d+12)){add('ammo',15);add('scrap',15);t='Unos bandidos te tienden una emboscada, pero los vences y les quitas sus cosas (+15 munición, +15 chatarra).'}else{const dm=Math.round(rn(15,35));p.hp-=dm;for(const q in s.loot)s.loot[q]*=.5;t='Unos bandidos te roban la mitad del botín y te hieren (-'+dm+' salud).'}}
else if(k=='kit'){s.kit=(s.kit||0)+1;t='Encuentras un botiquín en una mochila abandonada. Puedes usarlo cuando quieras.'}
else if(k=='surv'){s.surv++;t='Encuentras a un superviviente escondido que decide seguirte a la ciudad.'}
else if(k=='wp'){add('scrap',8+ri(0,8));t='Entre unos escombros reúnes un buen puñado de chatarra.'}
else{const c=TECH.filter(q=>!S.tech[q[0]]&&q[3]<=hallLv()+1&&!s.tech.includes(q[0]));if(c.length){const q=pk(c);s.tech.push(q[0]);t='Encuentras unos planos antiguos: '+q[2]+'.'}else t='Encuentras restos de un campamento, pero sin nada útil.'}
s.step++;s.txt=t;s.log.push(s.step+'. '+t);if(p.hp<=0)return soloEnd(1);soloView()}
function soloEnd(down,scheduled){const s=S.solo,p=s&&byId(s.id);S.solo=null;if(!p)return '';p.away=0;let m='',f=1;
if(down){if(Math.random()<.5){die(p,'explorando en solitario');return show('Exploración fallida',`<p>${s.txt}</p><p>${p.n} no regresó. Se perdió todo el botín.</p>`)}p.hp=3;f=.5;m=`<p>${s.txt}</p><p>${p.n} vuelve arrastrándose, malherido. Solo conserva la mitad del botín.</p>`}
let l='';for(const k in s.loot){const a=Math.round(s.loot[k]*f);if(a>0){S.res[k]=Math.min(cap(),S.res[k]+a);l+=' +'+a+' '+RN[k]}}
let ex='';if(s.kit){const mk=Math.round(8*s.kit*f);S.res.meds=Math.min(cap(),S.res.meds+mk);ex+='<br>Botiquines sin usar: +'+mk+' medicinas'}s.items.forEach(i=>{S.inv.push(i);ex+='<br>Arma encontrada: '+i.n});
for(let i=0;i<s.surv;i++)if(S.ppl.length<pcap()){if(Math.random()>=.3){ex+='<br>El superviviente que encontraste prefirió seguir su camino.';continue}const n=mkP();n.hp=Math.round(mhp(n)*.6);n.injury=20;S.ppl.push(n);S.stat.rescued++;ex+='<br>Rescatado: '+n.n+' ('+n.prof+')'}
s.tech.forEach(id=>{S.tech[id]=1;ex+='<br>Planos descubiertos: '+TECH.find(q=>q[0]==id)[2]});
if(s.step>0){p.xp+=5*s.step;lvlUp(p);S.stat.exps++}
sfx('done');save();const result=m+`<p>${p.n} regresa tras ${s.step} tramos.</p><p>Botín:${l||' ninguno'}${ex}</p>`;if(scheduled)return 'La expedición de '+p.n+' ha terminado. Ha regresado con vida y trae: '+(l||'ningún botín')+'.';show('Exploración terminada',result);return result}
function exEvent(){const e=S.exp;e.ev=e.z.evs?e.z.evs[e.step]:pk(EVS);const pw=Math.round(e.team.reduce((a,i)=>a+upow(byId(i)),0)*(1+(th('expl1')?.1:0)));show('Expedición: '+e.z.n+' ('+(e.step+1)+'/'+(e.z.evs?e.z.evs.length:3)+')',`${e.z.intro&&e.step==0?'<p><i>'+e.z.intro+'</i></p>':''}<p>${e.ev.t}</p><p>Poder del equipo: ${pw} · Peligro: ${e.z.g}</p>`+e.log.map(l=>'<p><small>'+l+'</small></p>').join('')+(()=>{const dg=e.z.g*22+8,pa=pw>=dg,pb=pw>=dg*.6;return'<p><small>Necesitas poder '+dg+' para la opción arriesgada y '+Math.round(dg*.6)+' para la prudente.</small></p>'+btn(e.ev.a+' (arriesgado · '+(pa?'éxito seguro':'fracaso: heridas graves')+')','exChoose(1)')+btn(e.ev.b+' (prudente · '+(pb?'éxito seguro':'fracaso: heridas leves')+')','exChoose(0)')})())}
function exChoose(agg){const e=S.exp,z=e.z,team=e.team.map(byId).filter(Boolean),pw=team.reduce((a,p)=>a+upow(p),0)*(1+(th('expl1')?.1:0)),dg=(z.g*22+8)*(agg?1:.6),ok=pw>=dg,lm=ok?(agg?1.3:.6):(agg?.3:.4),dm=ok?(agg?6:2):(agg?Math.min(40,15+(dg-pw)/dg*40):Math.min(15,5+(dg-pw)/dg*15));
team.forEach(p=>{const wound=dm;p.hp-=wound;p.injury=Math.min(100,(p.injury||0)+wound*.7);p.xp+=5});const packBoost=team.length?1+team.filter(p=>p.gear&&p.gear.pack).length*.25/team.length:1;for(const k in z.l)e.loot[k]=(e.loot[k]||0)+(z.l[k][0]+z.l[k][1])/2*lm/3*(th('expl2')?1.2:1)*(th('expl3')?1.2:1)*(th('expl4')?1.2:1)*packBoost;
if(e.ev.sv&&agg&&ok)e.surv++;if(e.ev.am&&agg&&ok)e.loot.ammo=(e.loot.ammo||0)+15;if(ok)e.ok++;
e.log.push((ok?'Éxito: ':'Fracaso: ')+(agg?e.ev.a:e.ev.b)+(ok?'.':', con bajas y poco botín.'));
team.forEach(p=>{if(p.hp<=0){if(p.hp<=-10){e.log.push(p.n+' murió.');p.away=0;die(p,'en la expedición');e.team=e.team.filter(i=>i!=p.id)}else p.hp=3}});e.step++;save();if(!e.team.length||e.step>=(z.evs?z.evs.length:3))exEnd();else exEvent()}
function exEnd(){const e=S.exp,z=e.z;S.exp=null;let m='';e.team.forEach(i=>{const p=byId(i);if(p){p.away=0;p.xp+=z.g*10;lvlUp(p)}});let cargo=Object.values(e.loot).reduce((a,v)=>a+Math.max(0,v),0),limit=Math.max(45,e.team.length*22);const factor=cargo>limit?limit/cargo:1;if(cargo>limit)m+=` (Carga limitada: ${Math.round(limit)} unidades; el excedente se dejó atrás)`;for(const k in e.loot){const a=Math.round(Math.max(0,e.loot[k])*factor);S.res[k]=Math.min(cap(),S.res[k]+a);if(a)m+=` +${a} ${RN[k]}`}
if(z.s)e.surv++;let ex='';for(let i=0;i<e.surv;i++)if(S.ppl.length<pcap()){if(Math.random()>=.3){ex+='<br>Encontrasteis a un superviviente, pero no quiso unirse y siguió su camino.';continue}const n=mkP();n.hp=Math.round(mhp(n)*.6);n.injury=20;S.ppl.push(n);S.stat.rescued++;ex+=`<br>Rescatado: ${n.n} (${n.prof})`}
if(z.wp&&e.ok>=2){const w=pk(WP.slice(0,2+(th('arms1')?1:0)));S.inv.push({n:w.n,v:w.v});ex+='<br>Arma encontrada: '+w.n}
if(z.tech&&e.ok>=2){const t=TECH.filter(q=>!S.tech[q[0]]);if(t.length){const q=pk(t);S.tech[q[0]]=1;ex+='<br>Planos descubiertos: '+q[2]}}const tot=z.evs?z.evs.length:3;if(z.chap!==undefined){if(e.team.length&&e.ok>=Math.ceil(tot/2)){ex+='<br><i>'+z.outro+'</i>';if(S.story<=z.chap){S.story=z.chap+1;ex+=storyReward(z.r);window.narOnChapter&&narOnChapter(z.chap)}else ex+='<br><small>(Capítulo ya completado: sin recompensa extra)</small>'}else ex+='<br>Misión fracasada: puedes reintentarla con un equipo más fuerte.'}
sfx('done');S.stat.exps++;save();show('Expedición completada',`<p>${z.n}: ${e.ok}/${tot} encuentros superados.</p><p>Botín:${m||' ninguno'}${ex}</p>`)}
/* ================= FACCIONES ================= */
const OF=[['Comprar medicinas (40 metal)','metal',40,'meds',20],['Comprar munición (40 madera)','wood',40,'ammo',25],['Comprar gasolina (30 metal)','metal',30,'gas',25]];
function facMenu(){const f=S.fac;show('Facciones',Object.keys(FAC).map(k=>`<p><b>${FAC[k]}</b> · reputación ${f[k]} (${f[k]>=50?'aliados':f[k]<-15?'hostiles':'neutrales'})</p>`+({mer:()=>OF.map((o,i)=>btn(o[0]+' (recibes '+Math.round(o[4]*(1+f.mer/200))+')',`trade(${i})`,S.res[o[1]]<o[2])).join(''),ref:()=>btn('Acoger refugiados (20 comida, 10 agua · 1 persona cada 5 días)','refu()',S.ppl.length>=pcap()||S.rd===S.day)+btn('Enviar suministros (40 comida, 40 agua)',"aid('ref',{food:40,water:40})"),mil:()=>btn('Enviar medicinas (20)',"aid('mil',{meds:20})")+btn('Pedir munición (+40)','askAmmo()',f.mil<20),com:()=>btn('Enviar ayuda (50 comida, 30 madera)',"aid('com',{food:50,wood:30})"),ban:()=>btn('Pagar tributo (30 comida, 20 metal)',"aid('ban',{food:30,metal:20})")+btn('Atacar campamento','camp("ban")'),clan:()=>btn('Pagar tributo (30 comida, 20 metal)',"aid('clan',{food:30,metal:20})")+btn('Atacar campamento','camp("clan")')})[k]()).join(''))}
function trade(i){const o=OF[i];if(S.res[o[1]]<o[2])return;S.res[o[1]]-=o[2];S.res[o[3]]=Math.min(cap(),S.res[o[3]]+Math.round(o[4]*(1+S.fac.mer/200)));S.fac.mer=Math.min(100,S.fac.mer+2);facMenu()}
function aid(k,c){if(!can(c))return toast('Faltan recursos.');pay(c);S.fac[k]=Math.min(100,S.fac[k]+10);toast('Reputación con '+FAC[k]+': '+S.fac[k]);facMenu()}
function refu(){if(S.rd&&S.day-S.rd<5)return toast('Los refugiados solo llegan cada 5 días (faltan '+(5-(S.day-S.rd))+').');const c={food:20,water:10};if(!can(c))return toast('Faltan recursos: '+cs(c));pay(c);S.rd=S.day;const n=1;for(let i=0;i<n&&S.ppl.length<pcap();i++){S.ppl.push(mkP());S.stat.rescued++}S.fac.ref=Math.min(100,S.fac.ref+5);facMenu()}
function askAmmo(){S.res.ammo=Math.min(cap(),S.res.ammo+40);S.fac.mil-=5;facMenu()}
function camp(k){const a=S.ppl.filter(p=>p.arm&&!p.away&&p.hp>20);if(!a.length)return toast('Necesitas soldados sanos en el ejército.');const pw=a.reduce((x,p)=>x+upow(p),0),en=60+S.stat.hordes*15+(k=='clan'?40:0),win=pw*rn(.7,1.3)>en;let m='';
a.forEach(p=>{p.hp-=win?rn(5,25):rn(25,60);p.xp+=15;if(p.hp<=0){if(Math.random()<.5){m+='<br>'+p.n+' murió.';die(p,'')}else p.hp=3}});S.fac[k]=Math.max(-100,S.fac[k]-10);
if(win){const r={ammo:ri(30,60),food:ri(30,60),metal:ri(20,50)};for(const x in r)S.res[x]=Math.min(cap(),S.res[x]+r[x]);m+='<br>Botín: '+cs(r)}a.forEach(lvlUp);show(win?'Campamento tomado':'Ataque fallido',`<p>Tu poder ${pw} contra ${en}.${m}</p>`)}
function missMenu(){show('Misiones',MS.map((m,i)=>`<p><b>${m[3]}</b>: ${m[0]}<br><small>Recompensa: ${cs({...m[2],sv:0})}${m[2].sv?', '+m[2].sv+' supervivientes':''}</small> `+(S.done[i]&&(!/Diario/.test(m[3])||S.done[i]==S.day)?'Completada':btn('Reclamar',`claim(${i})`,!m[1]()))+'</p>').join(''))}
function claim(i){const m=MS[i];if(S.done[i]&&(!/Diario/.test(m[3])||S.done[i]==S.day)||!m[1]())return;for(const k in m[2]){if(k=='sv'){for(let j=0;j<m[2].sv&&S.ppl.length<pcap();j++){S.ppl.push(mkP());S.stat.rescued++}}else S.res[k]=Math.min(cap(),S.res[k]+m[2][k])}if(!/Diario/.test(m[3]))S.done[i]=1;else S.done[i]=S.day;missMenu()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.closest('#rail')||b.closest('#pan')){if(!b.classList.contains('panel-x')&&b.textContent.trim()!=='Cerrar')synthSound('tab')}},true);
function tg(v){const e=$('rl');e.style.display=(v===undefined?e.style.display!='flex':v)?'flex':'none'}
function menu(){show('Menú de partida',btn('Guardar partida','if(save()!==false){bkRotate(KEY,0,1);toast("Partida guardada.")}')+btn('Exportar partida (archivo)','exportSlotKey(KEY)')+btn('Cargar partida','if(load()){LIVE=true;toast("Partida cargada.");hide()}else toast("No hay partida guardada.")')+btn('Sonido y vibración: '+(SND?'sí':'no'),'togSnd()')+btn('Configuración','settingsMenu()')+btn('Guía completa','guide(0)')+btn('Volver al inicio','titleMenu()')+btn('Nueva partida','showModeSelect()')+`<p><small>Modo actual: ${S.mode||'normal'}. El guardado automático está activado.</small></p>`)}
function titleMenu(){hide();$('titleScreen').style.display='flex';$('titleContent').innerHTML='<p>La ciudad ha caído. Tu comunidad aún puede sobrevivir.</p><div class="title-actions"><button class="primary" onclick="showModeSelect()">Nueva partida</button><button onclick="continueGame()">Continuar</button><button onclick="titleSettings()">Configuración</button><button onclick="titleGuide()">Guía del juego</button></div>'}
function showModeSelect(){$('titleContent').innerHTML=`<h3>Elige tu modo de partida</h3><p>Selecciona la dificultad de tu supervivencia.</p><div class="modegrid"><div class="modecard" onclick="startMode('facil')"><b>🌿 Fácil</b><small>Hordas reducidas y una experiencia más tranquila.</small></div><div class="modecard" onclick="startMode('normal')"><b>⚖️ Normal</b><small>La experiencia equilibrada original.</small></div><div class="modecard" onclick="startMode('dificil')"><b>☠️ Difícil</b><small>Enemigos más numerosos y presión constante.</small></div><div class="modecard" onclick="startMode('apocaliptico')"><b>🔥 Apocalíptico</b><small>Hordas mucho más grandes. Cada decisión cuenta.</small></div></div><div class="title-actions"><button onclick="titleMenu()">Volver</button></div>`}
function startMode(mode){if(mode==='creativo')mode='normal';newGame(mode);LIVE=true;save(true);loadingRun('Preparando la ciudad…',()=>{$('titleScreen').style.display='none';hide();toast('Nueva partida · Modo '+mode+'.')})}
function continueGame(){if(load()){LIVE=true;loadingRun('Cargando partida…',()=>{$('titleScreen').style.display='none';hide();toast('Partida cargada.')})}else if(localStorage.getItem(KEY)){toast('No se pudo leer esta partida. Sigue intacta: prueba «Copias» en su ranura.')}else{toast('No hay ninguna partida guardada.');showModeSelect()}}
function titleSettings(){ $('titleContent').innerHTML='<h3>Configuración de audio</h3><p>Efectos de sonido y vibración: '+(SND?'activados':'desactivados')+'</p><div class="title-actions"><button onclick="togSnd();titleSettings()">Activar / desactivar efectos</button><button onclick="setMusic(!MUSIC);titleSettings()">Música de fondo: '+(MUSIC?'activada':'desactivada')+'</button><label style="display:block;text-align:left">Volumen de música <input aria-label="Volumen de música" type="range" min="0" max="1" step=".05" value="'+musicVol+'" oninput="setMusicVol(this.value)" style="width:100%"></label><label style="display:block;text-align:left">Volumen de efectos <input aria-label="Volumen de efectos" type="range" min="0" max="1" step=".05" value="'+sfxVol+'" oninput="setSfxVol(this.value)" style="width:100%"></label><button onclick="if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});">Pantalla completa</button><button onclick="titleMenu()">Volver</button></div>' }
function settingsMenu(){show('Configuración de audio',btn('Efectos y vibración: '+(SND?'activados':'desactivados'),'togSnd()')+btn('Música de fondo: '+(MUSIC?'activada':'desactivada'),'setMusic(!MUSIC);settingsMenu()')+'<div style="padding:8px 4px"><label>Volumen de música <input type="range" min="0" max="1" step=".05" value="'+musicVol+'" oninput="setMusicVol(this.value)" style="width:100%"></label><label>Volumen de efectos <input type="range" min="0" max="1" step=".05" value="'+sfxVol+'" oninput="setSfxVol(this.value)" style="width:100%"></label></div>'+btn('Pantalla completa','if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})')+btn('Volver al menú','menu()'))}
function titleGuide(){guideReturn='title';$('titleScreen').style.display='none';guide(0);}

/* ================= GUÍA ================= */
const GU={food:'Se consume 2,5 por superviviente y día (algo más con el ayuntamiento alto). Lo producen las granjas. Sin comida: salud -8 por día.',water:'Se consume 2,5 por superviviente y día (algo más con el ayuntamiento alto). Lo producen los pozos. Sin agua: salud -10 por día.',wood:'Sirve para construir y mejorar. Se consigue talando árboles del mapa, en el ayuntamiento, en expediciones y comerciando.',metal:'Construcción, mejoras, armas y tecnologías. Sale de la chatarra del mapa, la fábrica, el ayuntamiento y el botín.',meds:'Curar heridos (2 por persona) y algunas tecnologías. Lo produce el hospital.',ammo:'La gastan torres (0,3 por disparo), torretas, soldados (0,05 por disparo), enrolar (5) y entrenar al ejército. Sin munición el daño cae un 60-70%. Lo produce el taller de armas.',rp:'Puntos de investigación: los produce el laboratorio y se gastan en las tecnologías. Se ven en la pantalla de Investigación y en la barra superior.',elec:'Ya no es un recurso que se guarde: es una capacidad. Los generadores, paneles solares y turbinas dan energía y cada edificio consume según su nivel. Mira el indicador ⚡ de la barra superior.'};
const GD=[
['Interfaz',()=>`<p><b>Barra superior</b>: nivel del ayuntamiento, día, población/capacidad, poder militar y el reloj del día (cada día dura 10 minutos). Los recursos y materiales no salen aquí: se ven en el Almacén (pestañas Recursos y Materiales).</p><p><b>Botón Opciones (arriba a la izquierda)</b>: despliega Construir (menú de edificios), Investigar (tecnologías; necesita laboratorio), Ejército (tus unidades), Expedición (salidas al exterior), Diario, Mapa exterior, Operaciones y Guía (esta pestaña).</p><p><b>Botón Menú (abajo a la derecha)</b>: Edificios (lista y centrar la cámara), Supervivientes (fichas), Mejoras (subir de nivel), Almacén (recursos y balance por minuto), Misiones, Partida (guardar, cargar, configuración y nueva partida) y +/- (zoom).</p><p>Toca cualquier edificio del mapa para abrir su panel. Toca un árbol o una pila de chatarra dentro de tu territorio (borde amarillo) para recolectar.</p>`],
['Recursos',()=>RK.filter(r=>r[0]!=='elec'&&r[0]!=='rp').map(r=>`<p><img src="${ICO[r[0]]}" width=16> <b>${r[1]}</b>: ${GU[r[0]]}</p>`).join('')+`<p>Se generan en tiempo real: comida y agua cada 30 s, madera cada minuto, metal cada 2 min, munición cada 3 min y medicinas cada 5 min. Capacidad máxima actual: ${cap()} por recurso (300 + 100 por nivel de ayuntamiento + 250 por nivel de almacén + 100 por cada ampliación directa, hasta 6).</p>`],
['Un día',()=>`<p>Cada día dura <b>10 minutos reales</b> (el reloj está en la barra superior; se detiene mientras defiendes una horda). Al terminar, la pantalla se oscurece y vuelve con el número del nuevo día. Entonces <b>se regeneran todos los árboles y minerales del mapa</b>, puede ocurrir un evento y llega una horda si toca. Los vigías aportan +4 de munición al día. Si cae el ayuntamiento o muere toda la población pierdes la partida (puedes reintentar desde el inicio del último día). El ataque nocturno trae más enemigos y reduce el alcance de torres y torretas.</p><p><b>Producción</b> (por día) = base × nivel × (0,3 + rendimiento de los trabajadores) × 1,1 si hay carretera pegada. Se entrega repartida en el tiempo. Sin trabajadores se produce un 30%. Los consumos de comida y agua (2 por persona y día) también se descuentan en cada entrega; sin comida baja la salud, sin agua baja la salud.</p><p><b>Eventos (40% cada día)</b>: refugiados, incendio, epidemia, traición, caravana de mercaderes y hallazgos. Si los bandidos te odian pueden atacar. Las hordas llegan cada 3-5 días y el día anterior recibes un aviso.</p>`],
['Construir',()=>`<p>1) Pulsa Construir y elige un edificio. 2) Aparece una vista previa: <b>verde</b> si es válida, <b>roja</b> si choca con algo o queda fuera del territorio. 3) Arrastra o toca para moverla. 4) Rotar (si no es cuadrado), Confirmar o Cancelar. El coste se paga al confirmar.</p><p><b>Murallas, puertas, carreteras y trampas</b> se pintan arrastrando el dedo; pulsa Hecho al terminar.</p><p><b>Mejorar</b>: sube la producción y la vida. Un edificio puede estar como máximo un nivel por encima del ayuntamiento. <b>Ayuntamiento</b>: cuesta 500×nivel de madera y 300×nivel de metal, y exige 2 edificios al nivel siguiente (3 a partir del ayuntamiento 10).</p><p><b>Mover / Destruir</b>: destruir devuelve el 50%. <b>Reparar</b> cuesta 5 de madera. <b>Ampliar terreno</b> (en el ayuntamiento) agranda tu territorio hasta 8 veces. Los constructores abaratan todo un 4% cada uno (máx. 30%).</p>`],
['Edificios',()=>Object.keys(BT).map(k=>{const d=BT[k];return`<p><b>${d.n}</b> (${d.w}x${d.h}, ayunt. ${d.lv}${d.tech?', requiere '+TECH.find(q=>q[0]==d.tech)[2]:''}): ${d.f} Coste: ${cs(d.cost)}.${d.p?' Produce '+cs(d.p)+' por día (10 min), repartido en entregas periódicas.':''}${d.job?' Pueden trabajar hasta '+d.slots+' (más 1 por nivel), ideal: '+d.job.join(', ')+'.':''}${d.pw?' Gasta 4 de electricidad al día.':''}${d.fire?' Dispara a '+d.fire.r+' casillas (daño '+d.fire.d+').':''}</p>`}).join('')+'<p><b>Acciones especiales</b>: Hospital (curar a todos), Barracones (entrenar ejército), Taller (fabricar armas), Laboratorio (investigar), Centro de expediciones (salidas), Ayuntamiento (mejorar y ampliar).</p>'],
['Supervivientes',()=>`<p>Cada uno tiene nombre, edad, profesión y especialización, nivel, experiencia, salud y habilidad. Se asignan a un edificio desde el panel del edificio (Asignar) o desde su ficha; los civiles caminan por la ciudad.</p>`+PF.map(pr=>`<p><b>${pr}</b>: destaca en ${Object.keys(BT).filter(k=>BT[k].job&&BT[k].job.includes(pr)).map(k=>BT[k].n).join(', ')||'defensa y misiones (sin edificio propio)'}.</p>`).join('')+`<p>Constructor: abarata las obras. Recolector: +20% al recolectar del mapa. Reclutar cuesta 30 comida y 20 agua y necesita casas libres. Salud baja con enfermedad, combates y hambre.</p>`],
['Formación',()=>`<p>Puedes poner a <b>cualquier superviviente en cualquier trabajo</b>, pero con un rendimiento menor (x0,7) si no está formado. Los profesionales del oficio rinden x1,6 y más cuanto mayor es su nivel.</p><p>En su ficha, <b>Formar en una profesión</b> cuesta 15 de comida y sube +1 nivel (máx. 10) en esa profesión. Si supera a su especialidad actual, cambia de profesión. Aparece ★ con su nivel al asignarlo a un edificio que lo aprovecha.</p><p><b>Entrenar</b> (10 comida) da experiencia (40 con barracones) y al subir de nivel gana habilidad y salud máxima. <b>Curar</b> (2 medicinas) necesita hospital.</p>`],
['Ejército',()=>`<p>Enrola supervivientes desde su ficha (cuesta 5 munición; límite por barracones). Las unidades enroladas dejan su trabajo.</p>`+Object.keys(CL).map(k=>{const c=CL[k];return`<p><b>${c.n}</b>: daño ${c.dmg}, defensa ${c.def}, alcance ${c.rng}.${c.t?' Requiere '+TECH.find(q=>q[0]==c.t)[2]+'.':''}${k=='medico'?' Cura aliados.':k=='ing'?' Repara edificios en combate.':''}</p>`}).join('')+'<p><b>Armas</b> (Taller): '+WP.map(w=>`${w.n} (+${w.v} daño; ${w.c?cs(w.c):'no se fabrica: botín o armería'})`).join('; ')+'. Se equipan desde la ficha. El poder militar suma unidades y torres.</p><p>Si caen en combate pueden morir (50%) o quedar muy heridas. Cúralas en el hospital.</p>'],
['Zombis y defensa',()=>`<p><b>Zombis normales</b>: lentos y numerosos; atacan cuerpo a cuerpo a personas y edificios. Solo cambia su ropa y aspecto: algunos llevan chalecos, chaquetas, pantalones, botas o mochilas. Con la historia aparecen además el <b>Zombi corredor</b>, el <b>Zombi gordo</b>, el <b>Zombi soldado</b>, los zombis especiales y los jefes (tienen su propia sección). La primera vez que veas un enemigo nuevo, el juego se detiene y te lo presenta.</p><p><b>Botín</b>: al morir, un zombi vestido tiene una probabilidad baja de dejar una de las prendas que llevaba. Se almacena en el inventario y puede equiparse a un superviviente; los chalecos y chaquetas aportan defensa.</p><p><b>Hordas</b>: aumentan gradualmente según los días, población y tamaño del asentamiento. Pueden llegar desde distintos lados del mapa. Atacan edificios, defensas y habitantes; las murallas, puertas, barricadas y torres ayudan a contenerlas. Ganas metal y munición al vencer.</p><p><b>Defensas</b>: murallas, barricadas, puertas, torres, torretas, trampas, ingenieros y soldados.</p>`],
['Exploración',()=>`<p><b>Explorador solitario</b> (siempre disponible): envía a un superviviente solo (10 comida y 10 agua). Va avanzando por tramos y le pasan cosas: suministros, zombis, bandidos, trampas, refugios y, con suerte, armas, planos o supervivientes. Tú decides si seguir o volver. También aparecen decisiones (entrar o rodear, cruzar o dar un rodeo, ayudar o ignorar), botiquines que puedes usar durante el viaje y compañeros inesperados. Si cae herido puede morir y perder el botín.</p><p><b>Expediciones en grupo</b> (Centro de expediciones, ayuntamiento 3): equipo de 3 plazas (+1 con Mapas, ). Hay <b>Historia</b> (6 capítulos en orden, con recompensas únicas) y <b>Zonas libres</b> (botín repetible). En cada encuentro eliges una opción arriesgada (más botín, más riesgo) o prudente.`],
['Tecnologías',()=>'<p>Se investigan al instante pagando recursos, con laboratorio y nivel de ayuntamiento.</p>'+TECH.map(t=>`<p><b>${t[2]}</b> (${t[1]}, ayunt. ${t[3]}): ${t[5]}. Coste: ${cs(t[4])}.</p>`).join('')],
['Parejas, embarazos y niños',()=>`<p>Desde el panel de una casa abre <b>Formar una familia</b>. Selecciona dos supervivientes adultos disponibles y no emparentados. Es la forma principal de que crezca tu comunidad: puede haber <b>1 embarazo por cada 2 casas</b> (mínimo 2, máximo 6). La gestación dura 3 días; después nace el bebé. La embarazada <b>come el doble</b> mientras dura. El bebé <b>hereda parte de los roles de sus padres</b>: la mitad del rol más alto de cada uno. Si los dos comparten el mismo rol principal, <b>se suman las dos mitades</b> (hasta un máximo de 7), así que dos agricultores buenos tienen un hijo muy buen agricultor. Hay un 10% de probabilidad de <b>gemelos</b>. La madre descansa 4 días tras el parto.</p><p>Otras formas de conseguir gente son más raras: llega alguien solo cada 8 días, la radio atrae a algunos, se pueden acoger refugiados cada 5 días y en las expediciones solo un 30% de los supervivientes que encuentras acepta venir (y llegan heridos).</p><p><b>Crecimiento actualizado:</b> el niño pasa a ser adulto 3 días después de nacer. Al alcanzar la edad adulta puede trabajar, entrenarse, formar pareja y participar en expediciones, según su estado.</p><p>Durante esos 3 días de crecimiento el bebé todavía no se incorpora a la población jugable. Al terminar, entra en la comunidad como adulto. Las relaciones entre compañeros pueden crear amistades o rivalidades. Los parentescos impiden formar parejas entre familiares.</p>`],
['Modos de juego',()=>`<p><b>Fácil:</b> hordas reducidas. <b>Normal:</b> equilibrio original. <b>Difícil:</b> hordas más numerosas. <b>Apocalíptico:</b> hordas mucho más numerosas.</p><p>El modo se elige al crear una partida nueva y queda guardado con ella.</p>`],
['Clima y expediciones',()=>`<p>El tiempo cambia durante la partida. Cada clima dura unos minutos y nunca se repite seguido: <b>despejado</b> (la mitad del tiempo, sin efectos), <b>lluvia</b> (los viajes de las expediciones duran un 20 % más), <b>niebla</b> (torres y tiradores con un 20 % menos de alcance) y <b>tormenta</b> (−25 % de madera, metal, piedra y energía solar al aire libre, y misiones un 15 % más duras). El clima nunca afecta a la comida ni al agua. Abre <b>Operaciones+</b> para consultar el clima, explorar lugares especiales y recuperar pistas.</p><p>Los sucesos del asentamiento pueden traer suministros, o aumentar la amenaza. Las armas y armaduras no se desgastan: una vez equipadas, duran para siempre.</p><p>Los edificios muy dañados muestran grietas visuales. Los zombis activos pueden cambiar su objetivo hacia supervivientes cercanos y variar su aproximación.</p>`],
['Misiones',()=>MS.map(m=>`<p><b>${m[3]}</b>: ${m[0]}. Recompensa: ${cs({...m[2],sv:0})}${m[2].sv?' y '+m[2].sv+' supervivientes':''}.</p>`).join('')+'<p>Las diarias se pueden reclamar de nuevo cada día.</p>'],
['Guardado y controles',()=>`<p>Guardado automático cada 15 s, al pasar de día y al cerrar. En Menú puedes guardar, cargar o empezar de nuevo (con confirmación). Móvil: arrastra para mover el mapa, pellizca para el zoom, toca para seleccionar. PC: ratón, rueda, WASD/flechas, R rotar, Enter confirmar, Esc cancelar, +/- zoom.</p>`]];
let guideReturn='game';function guide(i){i=Number.isInteger(i)?i:0;i=cl(i,0,GD.length-1);hide();$('pan').style.display='none';$('guideScreen').style.display='block';$('guideScreen').setAttribute('aria-hidden','false');$('guideNav').innerHTML=GD.map((g,j)=>`<button class="${j===i?'active':''}" onclick="guide(${j})">${String(j+1).padStart(2,'0')} · ${g[0]}</button>`).join('');$('guideArticle').innerHTML='<h3>'+GD[i][0]+'</h3>'+GD[i][1]();const active=$('guideNav').querySelector('.active');if(active)active.scrollIntoView({block:'nearest',inline:'nearest'});$('guideArticle').scrollTop=0;}function closeGuide(){$('guideScreen').style.display='none';$('guideScreen').setAttribute('aria-hidden','true');if(guideReturn==='title'){$('titleScreen').style.display='flex'}else{$('titleScreen').style.display='none'}}
/* ================= RENDER ISOMÉTRICO ================= */
const P=(x,y)=>[(x-y)*32,(x+y)*16];
function poly(c,p,col){c.fillStyle=col;c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill()}
const shc={};function parseCol(col){let m=/^#([0-9a-f]{6})$/i.exec(col);if(m){const n=parseInt(m[1],16);return[n>>16,(n>>8)&255,n&255]}m=/^#([0-9a-f]{3})$/i.exec(col);if(m){const n=parseInt(m[1],16);return[(n>>8&15)*17,(n>>4&15)*17,(n&15)*17]}m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(col);if(m)return[+m[1],+m[2],+m[3]];return[128,128,128]}
function sh(col,k){const key=col+k;if(shc[key])return shc[key];const q=parseCol(col);return shc[key]='rgb('+Math.min(255,Math.round(q[0]*k))+','+Math.min(255,Math.round(q[1]*k))+','+Math.min(255,Math.round(q[2]*k))+')'}

/* ================= ESTRUCTURAS: materiales, deterioro y atrezo apocalíptico ================= */
var CM='plaster',CMR='metal';const TEXC={},TPAT={},MAT={hall:'concrete',farm:'plank',well:'brick',wall:'concrete',gate:'metal',hosp:'plaster',barr:'metal',tower:'plank',store:'metal',work:'brick',expo:'concrete',fact:'brick',gen:'metal',gar:'metal',lab:'plaster'},SIGNT={house:'HOGAR',hall:'AYUNTAMIENTO',farm:'GRANJA',well:'AGUA',hosp:'CLÍNICA',barr:'MILICIA',store:'ALMACÉN',work:'TALLER',expo:'EXPEDICIÓN',fact:'FÁBRICA',gen:'ENERGÍA',gar:'GARAJE',lab:'LABORATORIO',tower:'VIGÍA'};
function texCv(m){if(TEXC[m])return TEXC[m];const t=document.createElement('canvas');t.width=64;t.height=m=='stain'?128:64;const x=t.getContext('2d'),W=64,H=t.height,R=(a,b)=>hh(a*1.7+m.length,b*2.3+3);
if(m=='plank'){for(let i=0;i<8;i++){x.fillStyle='rgba('+(R(i,1)>.5?'255,255,255':'0,0,0')+','+(.05+R(i,2)*.12)+')';x.fillRect(i*8,0,8,H);x.fillStyle='rgba(0,0,0,.5)';x.fillRect(i*8,0,1.4,H);for(let k=0;k<3;k++){x.fillStyle='rgba(0,0,0,.2)';x.fillRect(i*8+1.5,R(i,k+3)*H,6.5,1)}x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(i*8+4,R(i,9)*H,1.3,2.6,0,0,7);x.fill()}}
else if(m=='brick'){for(let r=0;r<8;r++)for(let q=-1;q<4;q++){const ox=(r%2)*8;x.fillStyle='rgba('+(R(q,r)>.5?'255,230,200':'0,0,0')+','+(.04+R(r,q)*.16)+')';x.fillRect(q*16+ox,r*8,15,7)}x.fillStyle='rgba(225,215,195,.4)';for(let r=0;r<8;r++){x.fillRect(0,r*8+7,W,1);for(let q=0;q<5;q++)x.fillRect(q*16+(r%2)*8-1,r*8,1,7)}}
else if(m=='metal'){for(let i=0;i<16;i++){const g=x.createLinearGradient(i*4,0,i*4+4,0);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.4)');x.fillStyle=g;x.fillRect(i*4,0,4,H)}for(let k=0;k<7;k++){x.fillStyle='rgba(150,70,25,'+(.18+R(k,2)*.3)+')';x.beginPath();x.ellipse(R(k,5)*W,R(k,7)*H,3+R(k,1)*8,2+R(k,3)*6,0,0,7);x.fill()}}
else if(m=='concrete'||m=='plaster'){for(let i=0;i<520;i++){x.fillStyle='rgba('+(R(i,1)>.5?'255,255,255':'0,0,0')+','+(.03+R(i,2)*.09)+')';x.fillRect(R(i,3)*W,R(i,4)*H,1+R(i,5)*2,1+R(i,6)*2)}x.strokeStyle='rgba(0,0,0,'+(m=='concrete'?.28:.14)+')';x.lineWidth=1;if(m=='concrete'){x.strokeRect(.5,.5,W-1,H-1);x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke()}x.strokeStyle='rgba(50,35,25,.4)';x.beginPath();let cx=R(1,1)*W,cy=0;x.moveTo(cx,cy);for(let k=0;k<6;k++){cx+=(R(k,8)-.5)*9;cy+=H/6;x.lineTo(cx,cy)}x.stroke()}
else if(m=='shingle'){for(let r=0;r<8;r++)for(let q=-1;q<5;q++){const ox=(r%2)*6.4;x.fillStyle='rgba('+(R(q,r)>.5?'255,255,255':'0,0,0')+','+(.03+R(r,q)*.16)+')';x.fillRect(q*12.8+ox,r*8,12,8);x.fillStyle='rgba(0,0,0,.42)';x.fillRect(q*12.8+ox,r*8+7,12.8,1.2)}}
else if(m=='stain'){for(let k=0;k<10;k++){const xx=R(k,1)*W,y0=R(k,3)*30,len=30+R(k,2)*90,rust=R(k,4)>.45,g=x.createLinearGradient(0,y0,0,y0+len);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.3,rust?'rgba(135,62,24,.5)':'rgba(10,8,6,.42)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(xx,y0,2+R(k,5)*5,len)}}
return TEXC[m]=t}
function pFill(c,pts,m,P0,P1,t,top,a){try{const pt=TPAT[m]||(TPAT[m]=c.createPattern(texCv(m),'repeat'));if(!pt.setTransform)return;pt.setTransform(new DOMMatrix([(P1[0]-P0[0])/(64*t),(P1[1]-P0[1])/(64*t),0,1,P0[0],top]));c.save();c.globalAlpha*=a;c.fillStyle=pt;c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();c.restore()}catch(e){}}
function winD(c,p,seed,col){const st=hh(seed,7);c.fillStyle=OL;c.fillRect(p[0]-5.5,p[1]-7,11,14);
if(st<.18){c.fillStyle='#7a5a38';c.fillRect(p[0]-3.8,p[1]-5.3,7.6,10.6);c.strokeStyle='#4a321c';c.lineWidth=1.6;c.beginPath();c.moveTo(p[0]-4,p[1]-2.5);c.lineTo(p[0]+4,p[1]+.5);c.moveTo(p[0]-4,p[1]+1.5);c.lineTo(p[0]+4,p[1]+4.5);c.stroke()}
else{const g=col||'#9fd3e3';c.fillStyle=g;c.fillRect(p[0]-3.8,p[1]-5.3,7.6,10.6);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(p[0]-3.8,p[1]-5.3,2.4,10.6);c.fillStyle=col?sh(col,.75):'#6fa6ba';c.fillRect(p[0]-3.8,p[1]+.2,7.6,5.1);c.fillStyle=OL;c.fillRect(p[0]-.5,p[1]-5.3,1.1,10.6);c.fillRect(p[0]-3.8,p[1]-.3,7.6,1.1);if(st>.82){c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=.8;c.beginPath();c.moveTo(p[0]+1,p[1]-5);c.lineTo(p[0]+2.6,p[1]-1);c.lineTo(p[0]+.6,p[1]+2);c.stroke()}}}
function doorD(c,p,k,sw,id){const col=k=='hosp'?'#e3eeee':k=='barr'?'#6b7c4c':'#9a6a3c';c.fillStyle=OL;c.fillRect(p[0]-6,p[1]-13.5,12,14);c.save();c.translate(p[0]-4.6,p[1]-12);c.rotate(sw?-.42:Math.sin(T*.55+id)*.025);c.fillStyle=col;c.fillRect(0,0,9.2,12);c.fillStyle='rgba(255,255,255,.28)';c.fillRect(0,0,2.4,12);c.fillStyle='rgba(0,0,0,.22)';c.fillRect(0,5.4,9.2,1.2);c.fillStyle='#f0c85a';c.beginPath();c.arc(7.2,6.4,1.2,0,7);c.fill();c.restore();c.fillStyle='rgba(0,0,0,.3)';c.fillRect(p[0]-7,p[1]-.3,14,1.8)}
function pTires(c,q){for(let i=0;i<3;i++){const y=q[1]-i*3.6;c.fillStyle='#16130f';c.beginPath();c.ellipse(q[0],y,6,2.9,0,0,7);c.fill();c.strokeStyle='#3a342c';c.lineWidth=1;c.stroke();c.fillStyle='#2b2620';c.beginPath();c.ellipse(q[0],y,2.8,1.3,0,0,7);c.fill()}}
function pBrl(c,q,col){c.fillStyle=col;c.fillRect(q[0]-4,q[1]-10,8,10);c.fillStyle=sh(col,1.3);c.beginPath();c.ellipse(q[0],q[1]-10,4,2,0,0,7);c.fill();c.fillStyle='rgba(0,0,0,.3)';c.fillRect(q[0]-4,q[1]-7,8,1);c.fillRect(q[0]-4,q[1]-3,8,1);c.fillStyle='rgba(120,60,20,.45)';c.fillRect(q[0]-3,q[1]-9,2,6);c.strokeStyle='rgba(20,12,6,.8)';c.lineWidth=1;c.strokeRect(q[0]-4,q[1]-10,8,10)}
function pCrate(c,q){c.fillStyle='#8a6a42';c.fillRect(q[0]-6,q[1]-9,12,9);c.strokeStyle='#4a3520';c.lineWidth=1.2;c.strokeRect(q[0]-6,q[1]-9,12,9);c.beginPath();c.moveTo(q[0]-6,q[1]-9);c.lineTo(q[0]+6,q[1]);c.moveTo(q[0]+6,q[1]-9);c.lineTo(q[0]-6,q[1]);c.stroke();c.fillStyle='rgba(255,230,180,.25)';c.fillRect(q[0]-6,q[1]-9,12,1.5)}
function pSack(c,q){c.strokeStyle='rgba(30,22,10,.8)';c.lineWidth=1;for(let i=0;i<3;i++){c.fillStyle=i%2?'#b8a77a':'#a99868';c.beginPath();c.ellipse(q[0]+i*8-8,q[1]-2,5,3,0,0,7);c.fill();c.stroke()}c.fillStyle='#b8a77a';c.beginPath();c.ellipse(q[0],q[1]-6,5,3,0,0,7);c.fill();c.stroke()}
function pRub(c,q){for(let i=0;i<6;i++){c.fillStyle=i%2?'#6f6a62':'#58534c';c.beginPath();c.ellipse(q[0]+(hh(i,q[0])-.5)*16,q[1]-hh(i,q[1])*3,1.8+hh(i,5)*2.6,1+hh(i,6)*1.4,0,0,7);c.fill()}}
function pWire(c,L,w,h){const n=Math.round(w*2);let pr=null;for(let i=0;i<=n;i++){const q=L(i*w/n,h+.45,0),t=L(i*w/n,h+.45,9);c.strokeStyle='rgba(30,22,14,.95)';c.lineWidth=1;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(t[0],t[1]);c.stroke();if(pr){c.strokeStyle='rgba(195,195,195,.85)';c.beginPath();c.moveTo(pr[0],pr[1]);for(let k=1;k<=4;k++)c.lineTo(pr[0]+(t[0]-pr[0])*k/4,pr[1]+(t[1]-pr[1])*k/4+(k%2?-2.5:2.5));c.stroke()}pr=t}}
function pSign(c,q,txt,sc){c.save();c.translate(q[0],q[1]);const wd=Math.max(20,txt.length*4.6+8);c.strokeStyle='#8a8f94';c.lineWidth=1;c.beginPath();c.moveTo(-wd/2+3,0);c.lineTo(-wd/2+3,-5);c.moveTo(wd/2-3,0);c.lineTo(wd/2-3,-5);c.stroke();c.fillStyle='#2e2a24';c.fillRect(-wd/2,-5,wd,10);c.strokeStyle='#15110d';c.strokeRect(-wd/2,-5,wd,10);c.fillStyle='#d8cf9a';c.font='bold 6.4px sans-serif';c.textAlign='center';c.fillText(txt,0,2.2);c.fillStyle='rgba(120,60,20,.4)';c.fillRect(-wd/2+2,-4,3,9);c.restore()}
function pTarp(c,L,w,h,z,r){const a=L(w*.15,h*.2,z+8),b2=L(w*.55,h*.2,z+11),d=L(w*.6,h*.55,z+6),e=L(w*.2,h*.55,z+4);poly(c,[a,b2,d,e],r>.5?'#2f6f9a':'#b8641f');c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=1;c.beginPath();c.moveTo((a[0]+e[0])/2,(a[1]+e[1])/2);c.lineTo((b2[0]+d[0])/2,(b2[1]+d[1])/2);c.moveTo((a[0]+b2[0])/2,(a[1]+b2[1])/2);c.lineTo((e[0]+d[0])/2,(e[1]+d[1])/2);c.stroke();c.fillStyle='#1a1410';[a,b2,d,e].forEach(q=>c.fillRect(q[0]-1,q[1]-1,2,2))}
function pCable(c,a,b2,sag){c.strokeStyle='rgba(15,12,10,.9)';c.lineWidth=1.1;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+b2[0])/2,(a[1]+b2[1])/2+sag,b2[0],b2[1]);c.stroke()}
function propsD(c,b){const k=b.type;if(!SIGNT[k])return;const w=b.w,h=b.h,id=b.id||1,x=b.x,y=b.y,z=BT[k].z,L=(u,v,zz)=>{const p=P(x+u,y+v);return[p[0],p[1]-zz]},r=i=>hh(id*3.1+i,k.length);
{const A=P(x-.25,y-.25),B=P(x+w+.25,y-.25),D=P(x+w+.25,y+h+.25),E=P(x-.25,y+h+.25);poly(c,[A,B,D,E],'rgba(52,38,24,.38)')}
if(z>14)for(let i=0;i<2;i++){const u0=.25+r(i)*(w-.9),zz=z*.2+r(i+4)*z*.3,a=L(u0,h,zz),b2=L(u0+.45,h,zz),cc=[b2[0],b2[1]-7],dd=[a[0],a[1]-7];poly(c,[a,b2,cc,dd],['#7c8186','#8b6a4a','#6b7a74'][Math.floor(r(i+9)*3)]);c.strokeStyle='rgba(20,14,8,.8)';c.lineWidth=.9;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b2[0],b2[1]);c.lineTo(cc[0],cc[1]);c.lineTo(dd[0],dd[1]);c.closePath();c.stroke();c.fillStyle='#d8d2c0';c.fillRect(a[0]+.6,a[1]-1.6,1,1);c.fillRect(b2[0]-1.6,b2[1]-1.6,1,1);c.fillRect(cc[0]-1.6,cc[1]+.6,1,1);c.fillRect(dd[0]+.6,dd[1]+.6,1,1)}
const fr=u=>L(u,h+.3,0),gp=[()=>pTires(c,fr(.3+r(1)*(w-.6))),()=>pBrl(c,fr(.3+r(2)*(w-.6)),['#8a3a2a','#3a6a8a','#6a6f74','#b8962a'][Math.floor(r(3)*4)]),()=>pCrate(c,fr(.3+r(5)*(w-.6))),()=>pSack(c,fr(.3+r(6)*(w-.6))),()=>pRub(c,fr(.4+r(7)*(w-.8)))];
for(let i=0;i<3;i++)gp[Math.floor(r(10+i)*gp.length)]();
if(['barr','store','fact','gar','gen','hall'].includes(k))pWire(c,L,w,h);
pSign(c,L(.45,h+.12,16+z*.25),SIGNT[k],1);
if(['house','store','gar','work','fact'].includes(k)&&r(14)>.45)pTarp(c,L,w,h,z,r(15));
if(z>12)pCable(c,L(.3,.3,z+14),L(w-.3,h-.3,z+10),7)}
const FSC={};function fs(c0){if(FSC[c0])return FSC[c0];const q=parseCol(c0),gr=(q[0]+q[1]+q[2])/3,sat=1.2,f=v=>Math.round(Math.max(0,Math.min(255,(gr+(v-gr)*sat)*1.08)));return FSC[c0]='rgb('+f(q[0])+','+f(q[1])+','+f(q[2])+')'}
const OL='#2a1a11';
function box(c,x,y,w,h,z,col,z0){z0=z0||0;col=fs(col);const a=P(x,y),b=P(x+w,y),d=P(x+w,y+h),e=P(x,y+h),u=(p,k)=>[p[0],p[1]-k-z0];
poly(c,[u(e,0),u(d,0),u(d,z),u(e,z)],sh(col,.86));poly(c,[u(d,0),u(b,0),u(b,z),u(d,z)],sh(col,.62));poly(c,[u(a,z),u(b,z),u(d,z),u(e,z)],sh(col,1.14));
const t1=u(e,z),t2=u(d,z),t3=u(b,z);
if(z>=9){c.strokeStyle='rgba(30,18,10,.17)';c.lineWidth=1.2;c.beginPath();for(let k=6;k<z-1;k+=6){const l1=u(e,k),l2=u(d,k),l3=u(b,k);c.moveTo(l1[0],l1[1]);c.lineTo(l2[0],l2[1]);c.lineTo(l3[0],l3[1])}c.stroke()}
c.strokeStyle='rgba(255,255,255,.42)';c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(t1[0],t1[1]+1.6);c.lineTo(t2[0],t2[1]+1.6);c.lineTo(t3[0],t3[1]+1.6);c.stroke();
c.strokeStyle=OL;c.lineWidth=2.6;c.lineJoin='round';c.beginPath();[u(e,0),u(d,0),u(b,0),u(b,z),u(a,z),u(e,z)].forEach((q,i2)=>i2?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.stroke();
c.lineWidth=2;c.beginPath();const v=u(d,0),v2=u(d,z);c.moveTo(v[0],v[1]);c.lineTo(v2[0],v2[1]);c.moveTo(t1[0],t1[1]);c.lineTo(t2[0],t2[1]);c.lineTo(t3[0],t3[1]);c.stroke()}
function roof(c,x,y,w,h,z,rh,col){col=fs(col);const a=P(x,y),b=P(x+w,y),d=P(x+w,y+h),e=P(x,y+h),ap=P(x+w/2,y+h/2),A=[ap[0],ap[1]-z-rh];poly(c,[[e[0],e[1]-z],[d[0],d[1]-z],A],sh(col,.98));poly(c,[[d[0],d[1]-z],[b[0],b[1]-z],A],sh(col,.7));
if(rh>2){c.strokeStyle='rgba(30,18,10,.2)';c.lineWidth=1.2;c.beginPath();for(let k=.33;k<1;k+=.33){const m=(p,q)=>[p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k],e2=m([e[0],e[1]-z],A),d2=m([d[0],d[1]-z],A),b2=m([b[0],b[1]-z],A);c.moveTo(e2[0],e2[1]);c.lineTo(d2[0],d2[1]);c.lineTo(b2[0],b2[1])}c.stroke()}
c.strokeStyle=OL;c.lineWidth=2.4;c.lineJoin='round';c.beginPath();c.moveTo(e[0],e[1]-z);c.lineTo(d[0],d[1]-z);c.lineTo(b[0],b[1]-z);c.lineTo(A[0],A[1]);c.closePath();c.moveTo(d[0],d[1]-z);c.lineTo(A[0],A[1]);c.stroke();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=1.4;c.beginPath();c.moveTo(A[0]-.5,A[1]+1.5);c.lineTo(d[0],d[1]-z-1);c.stroke()}
function smoke(c,p){for(let i=0;i<4;i++){const t=(T*.55+i/4)%1,drift=Math.sin(T*.7+i*1.8)*4;c.fillStyle='rgba(205,211,205,'+(.24*(1-t))+')';c.beginPath();c.arc(p[0]+drift+t*7,p[1]-t*25,2.2+t*4.2,0,7);c.fill()}}
function drawB(c,b,al){const d=BT[b.type],x=b.x,y=b.y,w=b.w,h=b.h,z=d.z,k=b.type,L=(u,v,zz)=>{const p=P(x+u,y+v);return[p[0],p[1]-zz]},C=P(x+w/2,y+h/2),win=(n,zz,col)=>{for(let i=0;i<n;i++)winD(c,L(w*(i+.7)/(n+.4),h,zz),(b.id||1)*7+i,col)};
c.save();c.globalAlpha=al||1;
CM=k=='house'?['plank','plaster','plaster','brick','plaster','plank'][Math.min(b.cl||0,5)]:(MAT[k]||'plaster');CMR=k=='house'?'shingle':'metal';
const PA=PAL[k],mc=PA?PA[Math.min(b.cl||0,PA.length-1)][1]:d.c,rc=ROOFS[Math.min(b.rf||0,3)][1],ex=b.ex||0,fb=(u,v,a,b2,zh,col,z0)=>box(c,x+u,y+v,a,b2,zh,col,z0),
wR=(n,zz,col)=>{for(let i=0;i<n;i++)winD(c,L(w,h*(i+.7)/(n+.4),zz),(b.id||1)*7+i+3,col)},
sack=(u,v,n)=>{for(let i=0;i<n;i++){const q=L(u+i*.22,v,2);c.fillStyle=i%2?'#b8a77a':'#a99868';c.strokeStyle='rgba(30,22,10,.8)';c.lineWidth=1;c.beginPath();c.ellipse(q[0],q[1]-2,5,3,0,0,7);c.fill();c.stroke()}},
brl=(u,v,col)=>{const q=L(u,v,0);c.fillStyle=col;c.fillRect(q[0]-4,q[1]-10,8,10);c.fillStyle=sh(col,1.25);c.beginPath();c.ellipse(q[0],q[1]-10,4,2,0,0,7);c.fill();c.strokeStyle='rgba(20,12,6,.8)';c.lineWidth=1;c.strokeRect(q[0]-4,q[1]-10,8,10)},
rdoor=(u,wd,ht,open)=>{const p=L(u,h,0);c.fillStyle='#171008';c.fillRect(p[0]-wd/2-1,p[1]-ht-1,wd+2,ht+1);c.fillStyle='#2c2f33';c.fillRect(p[0]-wd/2,p[1]-ht+open,wd,ht-open);c.fillStyle='rgba(255,255,255,.1)';for(let i=2;i<ht-open;i+=3)c.fillRect(p[0]-wd/2,p[1]-ht+open+i,wd,1)};
if(window.nbDraw&&NB[k])nbDraw(c,b,al);else if(k=='farm'){box(c,x,y,w,h,4,'#526f35');for(let row=0;row<5;row++){const xx=.35+row*.48,a=L(xx,.25,5),e=L(xx,h-.25,5);c.strokeStyle='rgba(35,54,24,.75)';c.lineWidth=4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.stroke();c.strokeStyle='#a2bd56';c.lineWidth=1.4;c.beginPath();c.moveTo(a[0]-2,a[1]);c.lineTo(e[0]-2,e[1]);c.stroke();for(let j=0;j<5;j++){const q=L(xx,.45+j*.48,8+Math.sin(T*2+row+j)*.5);c.strokeStyle=j%2?'#7cae3c':'#b0c65c';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0]-2,q[1]);c.lineTo(q[0],q[1]-5);c.lineTo(q[0]+3,q[1]-1);c.stroke()}}box(c,x+w-1.25,y+.15,1.05,1.05,17,mc);roof(c,x+w-1.3,y+.1,1.15,1.15,17,10,sh(mc,.7));const barn=L(w-.72,.65,25);c.fillStyle='#f0d8b0';c.fillRect(barn[0]-5,barn[1]-9,10,2);c.fillStyle='#e4d0a8';c.fillRect(barn[0]-1,barn[1]-9,2,9);const silo=L(.45,.35,18);c.fillStyle='#b9c2c5';c.beginPath();c.ellipse(silo[0],silo[1]-15,8,5,0,0,Math.PI*2);c.fill();c.fillRect(silo[0]-8,silo[1]-15,16,15);c.fillStyle='#7d8b91';c.beginPath();c.ellipse(silo[0],silo[1],8,4,0,0,Math.PI*2);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(silo[0]-5,silo[1]-12);c.lineTo(silo[0]-5,silo[1]-2);c.stroke();const mill=L(w-.5,.35,22);c.strokeStyle='#5c4631';c.lineWidth=4;c.beginPath();c.moveTo(mill[0],mill[1]);c.lineTo(mill[0],mill[1]+15);c.stroke();for(let a=0;a<4;a++){const an=T*1.8+a*Math.PI/2;c.fillStyle='#e9e1cf';c.beginPath();c.moveTo(mill[0],mill[1]);c.lineTo(mill[0]+Math.cos(an)*19-2,mill[1]+Math.sin(an)*19-3);c.lineTo(mill[0]+Math.cos(an)*19+3,mill[1]+Math.sin(an)*19+3);c.closePath();c.fill();c.strokeStyle='#8d806c';c.lineWidth=1;c.stroke()}c.fillStyle='#c8a15b';c.beginPath();c.arc(mill[0],mill[1],3,0,7);c.fill();for(let i=0;i<=6;i++){const p=L(i*w/6,h,0),q=L(w,i*h/6,0);c.fillStyle='#7a5a38';c.fillRect(p[0]-1,p[1]-7,2,7);c.fillRect(q[0]-1,q[1]-7,2,7)}c.strokeStyle='#a68458';c.lineWidth=1;c.beginPath();{const a0=L(0,h,5),a1=L(w,h,5),a2=L(w,0,5);c.moveTo(a0[0],a0[1]);c.lineTo(a1[0],a1[1]);c.lineTo(a2[0],a2[1])}c.stroke();{const sc=L(1.2,1.4,4);c.strokeStyle='#6b4a2a';c.lineWidth=2;c.beginPath();c.moveTo(sc[0],sc[1]);c.lineTo(sc[0],sc[1]-14);c.moveTo(sc[0]-6,sc[1]-10);c.lineTo(sc[0]+6,sc[1]-10);c.stroke();c.fillStyle='#e0b070';c.beginPath();c.arc(sc[0],sc[1]-16,3,0,7);c.fill();c.fillStyle='#c9a24a';c.fillRect(sc[0]-5,sc[1]-21,10,2)}}
else if(k=='house'){fb(-.05,-.05,w+.1,h+.1,3,sh(mc,.78));fb(0,0,w,h,z-3,mc,3);roof(c,x-.12,y-.12,w+.24,h+.24,z,15,rc);fb(1.25,.25,.45,.45,10,'#6e5a4b',z+3);smoke(c,L(1.5,.5,z+17));win(2,13,'#e8b65a');wR(1,13,'#e8b65a');
 {const an=L(w*.5,h,z*.12+12);poly(c,[[an[0]-8,an[1]],[an[0]+8,an[1]],[an[0]+10,an[1]+4],[an[0]-10,an[1]+4]],rc);for(const u of[.25,.75]){const q=L(w*u,h,9);c.fillStyle=sh(rc,.9);c.fillRect(q[0]-5,q[1]+1,10,2.5)}}
 if(ex==1){for(const[u,v]of[[.15,h+.2],[w-.15,h+.2],[w*.5-.9,h+.35],[w*.5+.9,h+.35]]){const q=L(u,v,0);c.fillStyle='#3f7a35';c.beginPath();c.ellipse(q[0],q[1]-3,6,4,0,0,7);c.fill();c.fillStyle=['#ff7aa8','#ffd35a','#fff'][Math.floor(hh(u*9,v*7)*3)];c.fillRect(q[0]-2,q[1]-6,2,2);c.fillRect(q[0]+2,q[1]-4,2,2)}for(let i=0;i<=6;i++){const q=L(.1+i*(w-.2)/6,h+.5,0);c.fillStyle='#e9e2cf';c.fillRect(q[0]-1,q[1]-6,2.2,6)}}
 else if(ex==2){fb(w*.5-.55,h,1.1,.5,2,'#8b6a43');fb(w*.5-.5,h+.3,.14,.14,12,'#6b5238');fb(w*.5+.36,h+.3,.14,.14,12,'#6b5238');fb(w*.5-.62,h,1.24,.6,1.5,rc,12)}
 else if(ex==3){const a=L(w*.3,h*.8,z+9);poly(c,[[a[0]-2,a[1]],[a[0]+12,a[1]+5],[a[0]+12,a[1]-3],[a[0]-2,a[1]-8]],'#27466f');poly(c,[[a[0]+14,a[1]+6],[a[0]+28,a[1]+11],[a[0]+28,a[1]+3],[a[0]+14,a[1]-2]],'#27466f');c.strokeStyle='rgba(190,210,230,.85)';c.lineWidth=1;c.beginPath();c.moveTo(a[0]+5,a[1]-5);c.lineTo(a[0]+5,a[1]+3);c.moveTo(a[0]+21,a[1]);c.lineTo(a[0]+21,a[1]+8);c.stroke()}
 else if(ex==4){const a=L(.35,.35,z+13);c.strokeStyle='#bbb';c.lineWidth=1.4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[0],a[1]-22);c.moveTo(a[0]-6,a[1]-17);c.lineTo(a[0]+6,a[1]-17);c.moveTo(a[0]-4,a[1]-12);c.lineTo(a[0]+4,a[1]-12);c.stroke();c.fillStyle=Math.sin(T*4)>0?'#f44':'#622';c.beginPath();c.arc(a[0],a[1]-22,1.8,0,7);c.fill()}}
else if(k=='hall'){fb(-.3,-.3,w+.6,h+.6,3,sh(mc,.8));fb(0,0,w,h,z,mc,3);fb(1,1,2,2,16,sh(mc,1.1),z+3);for(let i=0;i<5;i++)fb(.35+i*.8,h+.05,.2,.2,26,'#e6dfcd',0);fb(.2,h,w-.4,.55,2.5,sh(mc,1.15),26);fb(.5,h+.25,w-1,.3,1.5,'#9a968c',0);fb(.4,h+.5,w-.8,.3,1,'#a9a59a',0);win(4,24);win(4,34,'#e8d070');wR(4,24);wR(4,34,'#e8d070');
 {const p=L(2,2,z+19);c.strokeStyle='#ddd';c.lineWidth=2;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]-26);c.stroke();poly(c,[[p[0],p[1]-26],[p[0]+16+Math.sin(T*3)*3,p[1]-21],[p[0],p[1]-16]],'#c33');const dd=L(3.2,.9,z+19);c.fillStyle='#d8d8d8';c.beginPath();c.ellipse(dd[0],dd[1]-5,6,3.5,.5,0,7);c.fill();c.strokeStyle='#777';c.beginPath();c.moveTo(dd[0],dd[1]);c.lineTo(dd[0],dd[1]-5);c.stroke();const ck=L(2,3,z+13),an=S.dayT/600*6.283;c.fillStyle='#f3ecd8';c.beginPath();c.arc(ck[0],ck[1],6,0,7);c.fill();c.strokeStyle='#222';c.lineWidth=1.3;c.beginPath();c.arc(ck[0],ck[1],6,0,7);c.moveTo(ck[0],ck[1]);c.lineTo(ck[0]+Math.sin(an)*4.5,ck[1]-Math.cos(an)*4.5);c.moveTo(ck[0],ck[1]);c.lineTo(ck[0]+Math.sin(an*12)*3,ck[1]-Math.cos(an*12)*3);c.stroke()}}
else if(k=='well'){fb(.1,.1,w-.2,h-.2,8,mc);{const q=P(x+w/2,y+h/2);c.fillStyle='#2f7fb8';c.beginPath();c.ellipse(q[0],q[1]-8,12,6,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(q[0]-3,q[1]-9,4,1.6,0,0,7);c.fill()}fb(.15,.15,.18,.18,26,'#6a4a2a');fb(w-.33,h-.33,.18,.18,26,'#6a4a2a');roof(c,x+.05,y+.05,w-.1,h-.1,26,8,'#7a3a2a');
 {const q=L(w/2,h/2,26),o=Math.sin(T*2+(b.id||0))*3;c.strokeStyle='#caa';c.lineWidth=1;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]+10+o);c.stroke();c.fillStyle='#7a5a38';c.fillRect(q[0]-3,q[1]+10+o,6,5);const t=L(w-.25,.25,0);c.strokeStyle='#4a4f55';c.lineWidth=2;c.beginPath();c.moveTo(t[0]-5,t[1]);c.lineTo(t[0]-3,t[1]-26);c.moveTo(t[0]+5,t[1]);c.lineTo(t[0]+3,t[1]-26);c.stroke();c.fillStyle='#5e7a8a';c.fillRect(t[0]-8,t[1]-40,16,14);c.fillStyle='#8fb0c0';c.beginPath();c.ellipse(t[0],t[1]-40,8,3,0,0,7);c.fill();c.strokeStyle='rgba(20,12,6,.8)';c.strokeRect(t[0]-8,t[1]-40,16,14);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(t[0]-8,t[1]-34,16,1.5);c.fillRect(t[0]-8,t[1]-29,16,1.5)}}
else if(k=='bridge'){bridgeT(c,P(x,y),bAx(x,y))}
else if(k=='dock'){fb(0,0,w,h,4,'#9a7a50',2);{c.strokeStyle='rgba(50,32,16,.55)';c.lineWidth=1;c.beginPath();for(let i=1;i<4;i++){const a=L(w*i/4,0,6),b2=L(w*i/4,h,6);c.moveTo(a[0],a[1]);c.lineTo(b2[0],b2[1])}c.stroke()}
 for(const[u,v]of[[0,0],[w-.18,0],[0,h-.18],[w-.18,h-.18]])fb(u,v,.18,.18,14,'#5a4028',0);fb(.25,.2,.45,.45,6,'#b9a47a',6);
 {const a=L(w*.85,h*.25,6),b2=L(w*1.3,h*.1,26);c.strokeStyle='#3a2a18';c.lineWidth=1.6;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b2[0],b2[1]);c.stroke();c.strokeStyle='rgba(235,240,240,.7)';c.lineWidth=.8;c.beginPath();c.moveTo(b2[0],b2[1]);c.lineTo(b2[0]+4,b2[1]+22);c.stroke()}}
else if(k=='pump'){fb(0,0,w,h,4,sh(mc,.8));fb(.15,.15,w-.3,h-.3,14,mc,4);
 {const q=L(w*.55,h*.55,18);c.fillStyle='#4f6a78';c.beginPath();c.ellipse(q[0],q[1]+16,11,5.5,0,0,7);c.fill();c.fillStyle='#5e7a8a';c.fillRect(q[0]-11,q[1],22,16);c.fillStyle='#8fb0c0';c.beginPath();c.ellipse(q[0],q[1],11,5.5,0,0,7);c.fill();c.strokeStyle='rgba(20,12,6,.8)';c.lineWidth=1.2;c.strokeRect(q[0]-11,q[1],22,16);
 const p1=L(w*.2,h,6),p2=L(w*.2,h+1.2,2);c.strokeStyle='#3c4a52';c.lineWidth=3;c.beginPath();c.moveTo(p1[0],p1[1]);c.lineTo(p2[0],p2[1]);c.stroke()}}
else if(k=='mine'){fb(-.1,-.1,w+.2,h+.2,14,'#6b6258');fb(.3,.3,w-.6,h-.6,24,'#7d7466',14);
 {const e=(u,zz)=>L(u,h+.1,zz);poly(c,[e(.7,0),e(2.3,0),e(2.3,16),e(1.5,21),e(.7,16)],'#120e0a');c.strokeStyle='#8a6240';c.lineWidth=2.4;c.beginPath();c.moveTo(e(.7,0)[0],e(.7,0)[1]);c.lineTo(e(.7,16)[0],e(.7,16)[1]);c.lineTo(e(2.3,16)[0],e(2.3,16)[1]);c.lineTo(e(2.3,0)[0],e(2.3,0)[1]);c.stroke();
 const r1=L(1.5,h+.1,0),r2=L(1.5,h+1.5,0);c.strokeStyle='#555';c.lineWidth=1.4;c.beginPath();c.moveTo(r1[0]-3,r1[1]);c.lineTo(r2[0]-3,r2[1]);c.moveTo(r1[0]+3,r1[1]);c.lineTo(r2[0]+3,r2[1]);c.stroke();fb(w-.9,h+.5,.5,.4,5,'#8a5a2a',2)}}
else if(k=='mtower'){fb(-.15,-.15,w+.3,h+.3,12,'#6b6f6e');for(const[u,v]of[[.05,.05],[w-.25,.05],[.05,h-.25],[w-.25,h-.25]])fb(u,v,.2,.2,z-28,'#6d6a64',12);
 c.strokeStyle='rgba(30,22,14,.9)';c.lineWidth=1.6;c.beginPath();for(let i=0;i<2;i++){const a=L(0,h,12+i*20),b2=L(w,h,32+i*20),a2=L(0,h,32+i*20),b3=L(w,h,12+i*20);c.moveTo(a[0],a[1]);c.lineTo(b2[0],b2[1]);c.moveTo(a2[0],a2[1]);c.lineTo(b3[0],b3[1])}c.stroke();
 fb(-.2,-.2,w+.4,h+.4,3,sh(mc,.8),z-16);fb(.2,.2,w-.4,h-.4,12,sh(mc,1.05),z-13);roof(c,x+.1,y+.1,w-.2,h-.2,z-1,7,'#5a4a38');win(1,z-8,'#ffe9a0');wR(1,z-8,'#ffe9a0');
 {const p=L(1,1,z+4);c.strokeStyle='rgba(255,255,150,.55)';c.lineWidth=4;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(T*1.5)*46,p[1]+Math.sin(T*1.5)*23);c.stroke()}}
else if(k=='wall'){fb(0,0,1,1,z,mc);fb(.04,.04,.4,.92,5,sh(mc,1.12),z);fb(.56,.04,.4,.92,5,sh(mc,1.12),z);c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=1;{const a=L(0,1,5),e=L(1,1,5),f=L(0,1,10),g2=L(1,1,10);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.moveTo(f[0],f[1]);c.lineTo(g2[0],g2[1]);c.stroke()}
 if(b.hp<mxhp(b)*.5){const p=L(.5,1,8);c.strokeStyle='#222';c.beginPath();c.moveTo(p[0]-3,p[1]-4);c.lineTo(p[0]+1,p[1]);c.lineTo(p[0]-1,p[1]+4);c.stroke()}}
else if(k=='gate'){fb(0,0,.28,1,z+4,mc);fb(.72,0,.28,1,z+4,mc);fb(.28,.06,.44,.88,z-3,'#6d6f72');{const p=L(.5,1,2);c.strokeStyle='#e0b020';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(p[0]-6,p[1]-3-i*3.4);c.lineTo(p[0]+6,p[1]-7-i*3.4);c.stroke()}const l=L(.14,1,z+8);c.fillStyle=Math.sin(T*5)>0?'#ff6a3a':'#5a2a1a';c.beginPath();c.arc(l[0],l[1]-4,2.4,0,7);c.fill()}}
else if(k=='barricade'){sack(.05,1.05,4);box(c,x,y,1,1,z,d.c);if(k=='barricade'){const p=L(.5,1,3);c.strokeStyle='#49301c';c.lineWidth=4;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(p[0]-9,p[1]-8+i*5);c.lineTo(p[0]+9,p[1]-2+i*5);c.stroke()}c.strokeStyle='#b7a58a';c.lineWidth=1.5;c.beginPath();c.moveTo(p[0]-6,p[1]-12);c.lineTo(p[0]-6,p[1]+3);c.moveTo(p[0]+6,p[1]-9);c.lineTo(p[0]+6,p[1]+6);c.stroke()}else if(k=='wall'){c.strokeStyle='rgba(0,0,0,.35)';const a=L(0,1,5),e=L(1,1,5),f=L(0,1,10),g2=L(1,1,10);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.moveTo(f[0],f[1]);c.lineTo(g2[0],g2[1]);c.stroke()}else{const p=L(.5,1,0);c.fillStyle='#2a2018';c.fillRect(p[0]-6,p[1]-12,12,12)}if(b.hp<mxhp(b)*.5){const p=L(.5,1,8);c.strokeStyle='#222';c.beginPath();c.moveTo(p[0]-3,p[1]-4);c.lineTo(p[0]+1,p[1]);c.lineTo(p[0]-1,p[1]+4);c.stroke()}}
else if(k=='trap'){box(c,x+.05,y+.05,.9,.9,2,'#6a5a48');const p=P(x+.5,y+.5);c.fillStyle='#d4d4d4';c.strokeStyle='rgba(30,20,10,.8)';c.lineWidth=1;for(let i=-1;i<2;i++){c.beginPath();c.moveTo(p[0]+i*7-3,p[1]);c.lineTo(p[0]+i*7,p[1]-10);c.lineTo(p[0]+i*7+3,p[1]);c.fill();c.stroke()}c.fillStyle='rgba(150,20,20,.55)';c.fillRect(p[0]-8,p[1]-1,3,2);c.fillRect(p[0]+4,p[1]+1,3,2)}
else if(k=='turret'){sack(.05,.9,4);fb(.2,.2,.6,.6,6,'#4a4f55');fb(.28,.28,.44,.44,5,'#2f343b',6);{const p=L(.5,.5,15),a=b.ang||T;c.strokeStyle='#15181c';c.lineWidth=3.4;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*15,p[1]+Math.sin(a)*7.5);c.stroke();c.strokeStyle='#8a929a';c.lineWidth=1.2;c.beginPath();c.moveTo(p[0],p[1]-1);c.lineTo(p[0]+Math.cos(a)*15,p[1]+Math.sin(a)*7.5-1);c.stroke();c.fillStyle='#d44';c.beginPath();c.arc(p[0],p[1]-4,1.6,0,7);c.fill()}}
else if(k=='hosp'){fb(-.2,-.2,w+.4,h+.4,2,'#9aa4a8');fb(0,0,w,h,z,mc,2);fb(.12,.12,w-.24,h-.24,2,sh(mc,.9),z+2);{const q=L(w/2,h/2,z+4);c.fillStyle='#3a4046';c.beginPath();c.ellipse(q[0],q[1],17,8.5,0,0,7);c.fill();c.strokeStyle='#f5f0d0';c.lineWidth=1.4;c.stroke();c.fillStyle='#f5f0d0';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText('H',q[0],q[1]+4);
 const sg=L(.4,h,38);fb(.3,h-.12,.1,.1,24,'#888',0);c.fillStyle='#fff';c.fillRect(sg[0]-8,sg[1]-8,16,16);c.strokeStyle='#222';c.lineWidth=1;c.strokeRect(sg[0]-8,sg[1]-8,16,16);c.fillStyle='#d33';c.fillRect(sg[0]-6,sg[1]-2,12,4);c.fillRect(sg[0]-2,sg[1]-6,4,12);
 const an=L(w/2,h,16);poly(c,[[an[0]-14,an[1]],[an[0]+14,an[1]],[an[0]+17,an[1]+7],[an[0]-17,an[1]+7]],'#d33');poly(c,[[an[0]-4,an[1]],[an[0]+4,an[1]],[an[0]+5,an[1]+7],[an[0]-5,an[1]+7]],'#f2f2f2')}win(3,12,'#bfe7ff');win(3,24,'#bfe7ff');wR(3,12,'#bfe7ff');wR(3,24,'#bfe7ff')}
else if(k=='barr'){fb(0,0,w,h,z,mc);fb(.1,.1,w-.2,h-.2,3,sh(mc,.8),z);sack(.2,h+.12,5);sack(w-1.4,h+.12,5);fb(w-.95,.15,.75,.75,12,sh(mc,.9),z+3);roof(c,x+w-1.05,y+.05,.95,.95,z+15,6,'#4a4f3a');
 {const p=L(.5,.5,z+3);c.strokeStyle='#ddd';c.lineWidth=1.5;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]-20);c.stroke();poly(c,[[p[0],p[1]-20],[p[0]+11,p[1]-16],[p[0],p[1]-12]],'#a22');pSign(c,L(w*.8,h,z*.6),'B-'+((b.id||1)%9+1),1)}win(3,12,'#223');wR(3,12,'#223')}
else if(k=='tower'){for(const[u,v]of[[0,0],[w-.2,0],[0,h-.2],[w-.2,h-.2]])fb(u,v,.2,.2,z-8,'#6d6a64');c.strokeStyle='rgba(30,22,14,.9)';c.lineWidth=1.6;c.beginPath();for(let i=0;i<3;i++){const a=L(0,h,i*17),b2=L(w,h,i*17+17),a2=L(0,h,i*17+17),b3=L(w,h,i*17);c.moveTo(a[0],a[1]);c.lineTo(b2[0],b2[1]);c.moveTo(a2[0],a2[1]);c.lineTo(b3[0],b3[1])}c.stroke();fb(-.2,-.2,w+.4,h+.4,3,sh(mc,.8),z-8);fb(.2,.2,w-.4,h-.4,12,sh(mc,1.05),z-5);roof(c,x+.1,y+.1,w-.2,h-.2,z+7,7,'#5a4a38');win(1,z-1,'#ffe9a0');wR(1,z-1,'#ffe9a0');
 {const p=L(1,1,z+10);c.strokeStyle='rgba(255,255,150,.55)';c.lineWidth=4;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(T*1.5)*46,p[1]+Math.sin(T*1.5)*23);c.stroke();const q=L(0,h,z-3);c.strokeStyle='#4a3a28';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0]+w*32,q[1]+w*16);c.stroke()}}
else if(k=='store'){fb(0,0,w,h,z,mc);fb(-.1,-.1,w+.2,h+.2,3,sh(mc,.7),z);fb(.3,.3,w-.6,h-.6,3,sh(mc,.85),z+3);for(let i=0;i<3;i++)fb(.5+i*.8,.5,.4,.4,2,'#8a8f94',z+6);rdoor(w/2,24,18,0);{const sg=L(w/2,h,z-2);c.fillStyle='#e8d070';c.fillRect(sg[0]-13,sg[1]-4,26,5);c.fillStyle='#3a2a10';for(let i=0;i<5;i++)c.fillRect(sg[0]-11+i*5,sg[1]-3,3,3)}fb(w-.75,h+.08,.5,.5,7,'#9a7544');fb(w-.35,h+.25,.42,.42,5,'#b08850');brl(.35,h+.25,'#3a6a8a');brl(.7,h+.35,'#8a3a2a');win(2,22)}
else if(k=='work'){fb(0,0,w,h,z,mc);fb(-.08,-.08,w+.16,h+.16,2,sh(mc,.7),z);roof(c,x+1.3,y+.5,1.4,1.8,z+2,6,'#5a5f66');fb(.3,.3,.6,.6,18,'#4a4a4a',z+2);smoke(c,L(.6,.6,z+20));rdoor(w*.72,18,15,0);
 {const g2=L(.8,h,z*.55);c.fillStyle='#e8d070';c.beginPath();c.arc(g2[0],g2[1],5,0,7);c.fill();c.fillStyle=sh(mc,.7);c.beginPath();c.arc(g2[0],g2[1],2.2,0,7);c.fill();c.strokeStyle='#e8d070';c.lineWidth=2;for(let i=0;i<8;i++){const a=i*.785;c.beginPath();c.moveTo(g2[0]+Math.cos(a)*5,g2[1]+Math.sin(a)*5);c.lineTo(g2[0]+Math.cos(a)*7,g2[1]+Math.sin(a)*7);c.stroke()}}
 brl(.2,h+.15,'#8a3a2a');win(2,14);if(Math.sin(T*9)>.3){const p=L(w*.72,h,10);c.fillStyle='#ffcc44';c.fillRect(p[0]+Math.sin(T*30)*4,p[1]-4,2,2)}}
else if(k=='fact'){fb(0,0,w,h,z,mc);for(let i=0;i<3;i++){fb(.15+i*1.25,.3,1.05,h-.6,5,sh(mc,.8),z);const q=L(.15+i*1.25+.55,h-.3,z+5);c.fillStyle='#7fd8d0';c.fillRect(q[0]-7,q[1]-3,14,3)}fb(.4,.4,.6,.6,22,'#555',z+5);fb(2.2,.4,.6,.6,16,'#555',z+5);smoke(c,L(.7,.7,z+27));smoke(c,L(2.5,.7,z+21));
 c.strokeStyle='#8a8f94';c.lineWidth=3;c.beginPath();{const a=L(w,.4,18),e=L(w,h-.4,18),f=L(w,h-.4,8);c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.lineTo(f[0],f[1])}c.stroke();fb(w-1.3,h+.05,1.2,.5,3,'#6d6d6d');rdoor(1.2,22,17,0);brl(w-.6,h+.35,'#b8962a');win(3,16);wR(2,16)}
else if(k=='gen'){fb(0,0,w,h,z,mc);fb(-.05,-.05,w+.1,h+.1,2,sh(mc,.7),z);{const p=L(w/2,h,z*.5);c.fillStyle='#3c4143';c.fillRect(p[0]-11,p[1]-14,22,13);c.fillStyle='#899397';c.fillRect(p[0]-8,p[1]-17,16,4);c.strokeStyle='#222';c.lineWidth=2;for(let i=0;i<4;i++){const a=(b.run!==0?T*6:0)+i*1.57;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*7,p[1]+Math.sin(a)*7);c.stroke()}
 const bo=L(w/2,h,z*.3);pSign(c,[bo[0],bo[1]-8],'ALTA TENSIÓN',1);const e=L(.5,.5,z+4);c.fillStyle=b.run!==0&&Math.sin(T*4)>0?'#ffe45c':'#6a5a20';c.beginPath();c.arc(e[0],e[1],3,0,7);c.fill()}fb(w-.4,.2,.16,.16,26,'#555',z);brl(w+.05,h-.4,'#a8403a');brl(w+.2,h-.15,'#a8403a');if(b.run!==0)smoke(c,L(w-.32,.28,z+28))}
else if(k=='gar'){fb(0,0,w,h,z,mc);fb(-.1,-.1,w+.2,h+.2,2,sh(mc,.75),z);rdoor(w*.27,17,14,0);rdoor(w*.73,17,14,Math.max(0,4+Math.sin(T*.8+(b.id||0))*4));{const sg=L(w/2,h,z-1);c.fillStyle='#e8d070';c.fillRect(sg[0]-13,sg[1]-3,26,5);c.fillStyle='#2a2a2a';c.fillRect(sg[0]-10,sg[1]-2,20,1.5)}for(let i=0;i<3;i++){const t=L(w+.1,h-.35,i*4);c.fillStyle='#1b1b1b';c.beginPath();c.ellipse(t[0],t[1]-3,5.5,2.6,0,0,7);c.fill();c.strokeStyle='#555';c.stroke()}brl(.25,h+.2,'#6a6f74');win(1,16)}
else if(k=='lab'){fb(0,0,w,h,z,mc);fb(-.05,-.05,w+.1,h+.1,2,sh(mc,.8),z);{const p=L(w/2,h/2,z+2);c.fillStyle='rgba(127,216,208,.9)';c.beginPath();c.ellipse(p[0],p[1],19,10,0,Math.PI,0);c.fill();c.strokeStyle='rgba(20,40,40,.8)';c.lineWidth=1.4;c.stroke();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(p[0]-5,p[1]-6,5,2.2,-.4,0,7);c.fill();c.fillStyle=Math.sin(T*3)>0?'#f55':'#522';c.beginPath();c.arc(p[0],p[1]-12,2.5,0,7);c.fill()}fb(w-.75,.2,.5,.5,14,'#8fe0d8',z+2);c.strokeStyle='rgba(120,255,240,.85)';c.lineWidth=2;{const a=L(0,h,z-1),e=L(w,h,z-1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.stroke()}
 {const q=L(.5,h,z*.45);poly(c,[[q[0],q[1]-9],[q[0]+7,q[1]],[q[0]-7,q[1]]],'#e8c020');c.fillStyle='#222';c.fillRect(q[0]-.8,q[1]-6,1.6,3.5)}win(3,12,'#bff');wR(2,12,'#bff')}
else if(k=='expo'){fb(-.15,-.15,w+.3,h+.3,2,'#8a8f94');fb(0,0,w,h,z,mc,2);fb(w/2-.12,h/2-.12,.24,.24,22,'#777',z+2);{const p=L(w/2,h/2,z+24);c.save();c.translate(p[0],p[1]);c.rotate(Math.sin(T));c.fillStyle='#e0e0e0';c.beginPath();c.ellipse(0,0,14,5.5,0,0,7);c.fill();c.strokeStyle='#777';c.stroke();c.restore();c.fillStyle=Math.sin(T*4)>0?'#f44':'#622';c.beginPath();c.arc(p[0],p[1]-8,2,0,7);c.fill()}
 {const m=L(w*.8,h,z*.6);c.fillStyle='#e8dcb4';c.fillRect(m[0]-8,m[1]-6,16,12);c.strokeStyle='#222';c.strokeRect(m[0]-8,m[1]-6,16,12);c.fillStyle='#c33';c.fillRect(m[0]-4,m[1]-2,2,2);c.fillStyle='#35a';c.fillRect(m[0]+2,m[1],2,2);const t=L(w+.5,h-.3,0);poly(c,[[t[0]-11,t[1]],[t[0],t[1]-15],[t[0]+11,t[1]]],'#b9a276');poly(c,[[t[0]-3,t[1]],[t[0],t[1]-8],[t[0]+3,t[1]]],'#2a2418')}win(3,14);wR(3,14)}
else{fb(0,0,w,h,z,mc);win(2,12)}

if(window.NB&&NB[k]){if(SIGNT[k])pSign(c,L(.45,h+.12,16+z*.25),SIGNT[k],1)}else propsD(c,b);
if(!(window.NB&&NB[k])&&['house','hall','hosp','barr','store','work','expo','gar','lab'].includes(k)){const dp=L(w*.5,h,z*.12),sw=(Math.sin(T*1.15+(b.id||0)*.7)>.94)?1:0;doorD(c,dp,k,sw,b.id||1)}
if(!(window.NB&&NB[k]))bFX(c,b);if(b.off){const a=P(x,y),bb=P(x+w,y),dd=P(x+w,y+h),e=P(x,y+h);poly(c,[[a[0],a[1]-z],[bb[0],bb[1]-z],[dd[0],dd[1]-z],[e[0],e[1]-z]],'rgba(0,0,0,.4)');}
c.restore();if(al===undefined&&b.hp<mxhp(b)&&b.type!='road'){const p=L(w/2,h/2,z+8);g.fillStyle='#400';g.fillRect(p[0]-14,p[1]-4,28,4);g.fillStyle='#e44';g.fillRect(p[0]-14,p[1]-4,28*b.hp/mxhp(b),4)}}
var PT=[],DEAD=[],FP=0,FL=0,SHK=0;const RCOL={food:'#e55',water:'#4ad',wood:'#c94',metal:'#bcd',meds:'#f7a',ammo:'#fc4',fuel:'#6d6',elec:'#ff4'};
function burst(x,y,n,col,sp,zz){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(sp||1.5)*(.4+Math.random());PT.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,z:zz===undefined?10:zz,vz:30+Math.random()*60,l:.5+Math.random()*.5,col,s:1.2+Math.random()*1.6})}}
function updPT(dt){PT.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=260*dt;if(p.z<0){p.z=0;p.vz=0;p.vx*=.6;p.vy*=.6}p.l-=dt});PT=PT.filter(p=>p.l>0);if(PT.length>300)PT.splice(0,PT.length-300);DEAD.forEach(d=>d.t+=dt);DEAD=DEAD.filter(d=>d.t<12);SHK=Math.max(0,SHK-dt)}
function drawPT(c){PT.forEach(p=>{const q=P(p.x,p.y);if(q[0]<cam.x-20||q[0]>cam.x+vw()/cam.z+20)return;c.globalAlpha=Math.min(1,p.l*2);c.fillStyle=p.col;c.fillRect(q[0]-p.s/2,q[1]-p.z-p.s/2,p.s,p.s)});c.globalAlpha=1}
function hitD(e,hp,col){if(e.php!==undefined&&hp<e.php-.4){burst(e.x,e.y,3,col,1.3,14);e.fl=T}e.php=hp;if(e.fl&&e.fl>T+.2)e.fl=0;const d=T-(e.fl||0);return e.fl&&d>=0&&d<.14?1-d/.14:0}
function bFX(c,b){const d=BT[b.type],k=b.type,x=b.x,y=b.y,w=b.w,h=b.h,z=d.z,L=(u,v,zz)=>{const p=P(x+u,y+v);return[p[0],p[1]-zz]};
if(k=='well'){const p=L(w/2,h/2,z+8),o=Math.sin(T*2+(b.id||0))*5;c.strokeStyle='#caa';c.lineWidth=1;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]+10+o);c.stroke();c.fillStyle='#6a4a2a';c.fillRect(p[0]-3,p[1]+10+o,6,5)}
if(k=='hosp'){const p=L(w/2,h/2,z+4),on=Math.sin(T*6)>0;c.fillStyle=on?'rgba(255,50,50,.25)':'rgba(60,100,255,.25)';c.beginPath();c.arc(p[0],p[1]-3,9,0,7);c.fill();c.fillStyle=on?'#f33':'#36f';c.beginPath();c.arc(p[0],p[1]-3,2.6,0,7);c.fill()}
if(k=='lab'){const p=L(w/2,h/2,z+8);c.fillStyle='rgba(200,255,240,.8)';for(let i=0;i<3;i++){const t=(T*.8+i/3)%1;c.beginPath();c.arc(p[0]+Math.sin(T*3+i*2)*5,p[1]-t*22,1.5+t,0,7);c.fill()}}
if(k=='gen'&&b.run!==0&&b.id){c.strokeStyle='rgba(120,220,255,.9)';c.lineWidth=1.3;const p=L(w/2,h/2,z+8);for(let n=0;n<2;n++){c.beginPath();let px=p[0]-8,py=p[1]-n*6;c.moveTo(px,py);for(let i=0;i<5;i++){px+=4;c.lineTo(px,py+(Math.random()-.5)*8)}c.stroke()}}
if(k=='store'){box(c,x+.4,y+.4,.6,.6,5,'#8a6a3a',z);box(c,x+1.2,y+.9,.5,.5,4,'#a07840',z)}
if(k=='tower'){const p=L(w/2,h/2,z+14);c.fillStyle='rgba(255,230,140,'+(.5+.3*Math.sin(T*3))+')';c.beginPath();c.arc(p[0],p[1],3,0,7);c.fill()}
if(d.p&&!b.off&&k!='gen'&&b.id){const n=wk(b).length;if(n){const ks=Object.keys(d.p)[0],ph=(T*.35+b.id*.37)%1,p=L(w/2,h/2,z+16+ph*18);c.globalAlpha=Math.sin(ph*Math.PI);c.fillStyle=RCOL[ks]||'#fff';c.beginPath();c.arc(p[0],p[1],4,0,7);c.fill();c.fillStyle='#000a';c.font='bold 7px sans-serif';c.textAlign='center';c.fillText('+',p[0],p[1]+2.5);c.globalAlpha=1}}}
const HAIR=['#1e140e','#3d2a18','#6b5a3a','#141414','#4a2a18'],HC={Médico:'#e8e4d4',soldado:'#4b5a35',franco:'#33402a',pesado:'#2e2e33',medico:'#eee',ing:'#c9a02a',expl:'#3a6a9a',esp:'#6a2a2a',Soldado:'#4b5a35',Constructor:'#c9a02a',Mecánico:'#3a3a6a',Explorador:'#3a5a7a'};
let SUIT='#575841',SUITD='#3d3d2c',ZCL=['#5d6048','#5e6064','#3a3530','#6a6e52','#4a5238','#7a5e28','#4c4e48','#5a574a'];var WPN='',ZV=0,EXP='ok',SXF=0,OLDF=0,KIDF=0;
function fig(x,y,col,sc,wkg,hd,gun,dx,role,act,id,hair,armored,backpack){id=id||0;const q=P(x,y),f=dx<0?-1:1,run=act==3,ph=T*(run?15:9)+x*3+id,w=wkg?Math.sin(ph):0,zom=role=='zom',skin=hd||'#e8b88a',tt=T*6+id,sw=Math.sin(tt),bob=act==6?0:wkg?Math.abs(Math.cos(ph))*(run?2.2:1.2):Math.sin(T*2+id)*.35,H=-17-bob;
g.save();g.translate(q[0],q[1]);g.scale(sc*f*1.32,sc*1.32);g.fillStyle='rgba(0,0,0,.34)';g.beginPath();g.ellipse(0,0,6.4,3,0,0,7);g.fill();
if(FL)g.translate(-FL*2.5,0);if(act==6)g.rotate(-FP*1.5);if(act==11){g.translate(-1,-4);g.rotate(-1.5)}if(act==13)g.translate(0,5);if(zom&&act==2)g.translate(Math.max(0,Math.sin(T*9))*2.5,0);if(run)g.rotate(.1);
const ban=role=='ban',zv=zom?(ZV|0):0;if(!ban&&!zom)col=SUIT;if(ban)col=window.BCOL||'#5b3d2a';if(zom)col=ZCL[zv];g.lineCap='round';g.strokeStyle=zom?'#38402c':ban?'#33261b':SUITD;g.lineWidth=2.6;[[-1.5,w],[1.5,-w]].forEach(([lx,v])=>{g.beginPath();if(act==13){g.moveTo(lx,H+8);g.lineTo(lx+5.5,H+8.8);g.lineTo(lx+5.5,-1);g.stroke();g.fillStyle='#2a1f16';g.fillRect(lx+4,-2.6,3.6,2.4);return}g.moveTo(lx,H+8);g.lineTo(lx+v*(run?4.5:3),-Math.max(0,v)*2.2);g.stroke();if(!zom){const ex=lx+v*(run?4.5:3),ey=-Math.max(0,v)*2.2;g.fillStyle='#2a1f16';g.fillRect(ex-1.6,ey-1.8,3.2,2.2)}});
const FM=!zom&&SXF==1,TP=new Path2D();if(FM){TP.moveTo(-3,H);TP.lineTo(3,H);TP.lineTo(2.5,H+4.2);TP.lineTo(2.2,H+5.6);TP.lineTo(3.9,H+8.9);TP.lineTo(-3.9,H+8.9);TP.lineTo(-2.2,H+5.6);TP.lineTo(-2.5,H+4.2);TP.closePath()}else{TP.moveTo(-4.1,H);TP.lineTo(4.1,H);TP.lineTo(3.6,H+8.5);TP.lineTo(-3.6,H+8.5);TP.closePath()}const SHX=FM?3:3.8;g.fillStyle=col;g.fill(TP);g.save();g.clip(TP);if(armored&&!zom){g.fillStyle='#9aa5a8';g.fillRect(-3.7,H+1,7.4,5.8);g.strokeStyle='#41494b';g.lineWidth=.8;g.strokeRect(-3.7,H+1,7.4,5.8);g.fillStyle='#d4b85f';g.fillRect(-.7,H+2,1.4,1.4)}if(backpack&&!zom){g.fillStyle='#6a4a2d';g.fillRect(-5.3,H+1,2.2,5.5);g.fillStyle='#c09a5b';g.fillRect(-5.3,H+3,2.2,1)}g.fillStyle='rgba(0,0,0,.2)';g.fillRect(.4,H,3.2,8.5);
if(!zom){g.fillStyle='rgba(20,14,8,.35)';g.fillRect(-3.6,H+6.3,7.2,2.2);g.fillStyle='#3b2a1c';g.fillRect(-3.6,H+5.2,7.2,1.3);g.fillStyle='#c9a24a';g.fillRect(-.7,H+5.2,1.4,1.3);g.fillStyle='#34341f';g.fillRect(-3.6,H,7.2,1.3);g.fillStyle='#8e5a30';g.fillRect(-3,H+1.9,2.6,1.9);g.fillStyle='#cdbf96';g.fillRect(-2.5,H+2.4,1.6,.6);g.strokeStyle='rgba(30,22,12,.55)';g.lineWidth=.5;g.beginPath();g.moveTo(.4,H+1.3);g.lineTo(.4,H+5.2);g.stroke();g.fillStyle='rgba(185,160,110,.3)';g.fillRect(-3.4,H+3.6,1.2,1.2);g.fillRect(1.6,H+2.2,1.3,.9)}
if(zom){g.fillStyle='rgba(120,10,10,.6)';g.fillRect(-2.6,H+2.4,2.4,3);g.fillRect(1.2,H+5,1.8,2.2);g.fillStyle='rgba(20,14,8,.45)';for(let i=0;i<4;i++)g.fillRect(-3.6+i*1.9,H+7.4,1.1,1.1);if(zv==3){g.fillStyle='#a9b58a';g.beginPath();g.ellipse(0,H+5,5.6,4.6,0,0,7);g.fill();g.stroke();g.fillStyle='rgba(60,70,30,.4)';g.beginPath();g.ellipse(1.5,H+6,2,1.4,0,0,7);g.fill()}if(zv==4){g.fillStyle='#5a6540';g.fillRect(-3.6,H+.8,7.2,5.4);g.strokeRect(-3.6,H+.8,7.2,5.4);g.fillStyle='#8a7a4a';g.fillRect(-2.6,H+1.8,1.6,2)}if(zv==2){g.strokeStyle='#d64a1a';g.lineWidth=.6;g.beginPath();g.moveTo(-2,H+1);g.lineTo(-.6,H+3.2);g.lineTo(-2.2,H+5);g.moveTo(1.6,H+2);g.lineTo(2.6,H+4.6);g.stroke()}}
if(ban){g.fillStyle='#3b2a1c';g.fillRect(-3.6,H+5.4,7.2,1.3);g.strokeStyle='#caa46a';g.lineWidth=.9;g.beginPath();g.moveTo(-3.4,H+.6);g.lineTo(3.4,H+6.4);g.stroke();g.fillStyle='#8f8f86';g.fillRect(-3.6,H,2.2,2.4)}
if(FM){g.fillStyle='rgba(0,0,0,.13)';g.beginPath();g.ellipse(1.1,H+2.7,2,1.5,0,0,7);g.ellipse(-1.1,H+2.7,1.6,1.4,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.1)';g.beginPath();g.ellipse(-.9,H+2.2,1,.7,0,0,7);g.fill();g.fillStyle='rgba(20,14,8,.35)';g.beginPath();g.moveTo(-1.4,H);g.lineTo(0,H+3);g.lineTo(1.4,H);g.fill()}else if(!zom){g.fillStyle='rgba(0,0,0,.1)';g.fillRect(-4.1,H,1.6,2.6);g.fillRect(2.5,H,1.6,2.6)}
if(!zom&&!ban&&window.ovFig)ovFig(g,H,FM);g.restore();g.strokeStyle='rgba(20,14,8,.85)';g.lineWidth=.8;g.lineJoin='round';g.stroke(TP);
if(!zom&&gun&&role!=='zom'&&id&&false){}
if(role=='Médico'||role=='medico'){g.fillStyle='#d33';g.fillRect(-.5,H+2,1.2,4);g.fillRect(-2,H+3.4,4.4,1.2)}if(role=='Explorador'){g.fillStyle='#6a4a2a';g.fillRect(-6,H+1,3,7)}
{const ex=-4+(zom?8:0)-(wkg&&!zom?w*1.5:0),ey=H+(zom?2.5-sw:8);g.strokeStyle=zom?skin:SUIT;g.lineWidth=2.2;g.beginPath();g.moveTo(-SHX+.4,H+1.5);g.lineTo(ex,ey);g.stroke();if(!zom){g.fillStyle=skin;g.beginPath();g.arc(ex,ey,1.2,0,7);g.fill()}}
const arm=(ex,ey)=>{g.strokeStyle=zom?skin:SUIT;g.lineWidth=2.2;g.beginPath();g.moveTo(SHX-.4,H+1.5);g.lineTo(ex,ey);g.stroke();if(!zom){g.fillStyle=skin;g.beginPath();g.arc(ex,ey,1.2,0,7);g.fill()}};
const tool=(L,t0,am,hc,hw)=>{const th=t0+sw*am,hx=4.5,hy=H+4,ex=hx+Math.sin(th)*L,ey=hy-Math.cos(th)*L;arm(hx,hy);g.strokeStyle='#7a5a32';g.lineWidth=1.7;g.beginPath();g.moveTo(hx-Math.sin(th)*2,hy+Math.cos(th)*2);g.lineTo(ex,ey);g.stroke();g.fillStyle=hc;g.fillRect(ex-hw/2,ey-hw/2,hw,hw);return sw>.75?[ex,ey]:0};
const spk=(p,k)=>{if(!p)return;g.fillStyle=k;for(let i=0;i<4;i++)g.fillRect(p[0]+Math.sin(T*50+i*2)*3,p[1]-1-i*1.6,1.6,1.6)};
if(act==6||act==11)arm(2,H+9);else if(act==13)arm(5.5,H+8);else if(act==12){arm(3.6,H-.5+Math.sin(T*5)*1.8);g.fillStyle='#8f969a';g.fillRect(3.4,H+Math.sin(T*5)*1.8,2.8,3);g.strokeStyle='#2a1a11';g.lineWidth=.6;g.strokeRect(3.4,H+Math.sin(T*5)*1.8,2.8,3)}else if(!zom&&!ban&&EXP==='scared'&&wkg&&!gun)arm(5.5,H-3+Math.sin(T*14)*1.2);else if(zom)arm(9,H+1.5+sw);else if(act==9){arm(8,H+2);g.fillStyle='#4f4';for(let i=0;i<3;i++){const k=(T*1.3+i/3)%1;g.fillRect(9+i*1.5,H-k*10,1.4,3.6);g.fillRect(8+i*1.5,H+1-k*10,3.6,1.4)}}else if(act==10)spk(tool(8,1,1,'#777',4),'#ffd24a');
else if(gun&&act!=1){const W=WPN||'',kind=/machete|cuchillo|hacha|bate|palanca|martillo|lanza|espada/i.test(W)?'m':/ballesta/i.test(W)?'b':/pistola|revólver/i.test(W)?'p':/escopeta/i.test(W)?'s':/subfusil/i.test(W)?'u':/rifle|carabina|fusil/i.test(W)?'r':(role=='pesado'?'s':role=='esp'?'e':role=='medico'||role=='ing'||role=='expl'?'p':'r'),y0=run?H+3:H+5,hit=act==4||act==8&&sw>.3;arm(6,y0);g.lineCap='round';
if(kind=='m'){const sl=(act==4||act==8)?Math.sin(T*18)*5:0;g.strokeStyle='#5a3a22';g.lineWidth=2.2;g.beginPath();g.moveTo(5,y0+1);g.lineTo(8,y0-1+sl*.3);g.stroke();g.strokeStyle='#cfd5d8';g.lineWidth=2;g.beginPath();g.moveTo(8,y0-1+sl*.3);g.lineTo(14,y0-6+sl);g.stroke()}
else{const L={p:7,s:15,u:11,r:16,b:12,e:12}[kind];
 if(kind=='s'||kind=='r'||kind=='u'){g.strokeStyle='#5a3a22';g.lineWidth=2.8;g.beginPath();g.moveTo(-1,y0+2);g.lineTo(4,y0+1);g.stroke()}
 g.strokeStyle=kind=='e'?'#3cf':kind=='s'?'#3a3a3a':'#222';g.lineWidth=kind=='p'?2.2:kind=='s'?3.2:2.4;g.beginPath();g.moveTo(3,y0+1);g.lineTo(L,y0-.5);g.stroke();
 if(kind=='r'||kind=='u'){g.fillStyle='#222';g.fillRect(6,y0+1,2,3.4)}
 if(kind=='r'&&role=='franco'){g.fillStyle='#7cf';g.fillRect(6,y0-2.4,4,1.6)}
 if(kind=='b'){g.strokeStyle='#6a4a2a';g.lineWidth=1.6;g.beginPath();g.moveTo(L-3,y0-5);g.lineTo(L-3,y0+4);g.stroke()}
 if(hit){g.fillStyle='#ffd24a';g.beginPath();g.arc(L+2.5,y0-.5,2.8,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(L+2,y0-.5,1.2,0,7);g.fill()}}
g.lineCap='butt'}
else if(act==8)spk(tool(9,1.1,1.2,'#888',3),'#c33');
else if(act==1){switch(role){
case'Agricultor':spk(tool(13,1.2,1.1,'#444',4),'#7a5a32');break;
case'Recolector':spk(tool(12,1.1,1.1,'#999',4),'#a07a48');break;
case'Constructor':spk(tool(8,1,1,'#777',4),'#ffd24a');break;
case'Mecánico':spk(tool(8,.9,.5,'#aaa',3),'#ffd24a');break;
case'Cocinero':arm(7.5,H+5);g.fillStyle='#555';g.fillRect(6,H+5,6,5);g.strokeStyle='#ccc';g.lineWidth=1.3;g.beginPath();g.moveTo(8,H+5);g.lineTo(9+Math.cos(tt)*2,H+8);g.stroke();g.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<2;i++){const k=(T*1.5+i/2)%1;g.beginPath();g.arc(9+Math.sin(T*3+i)*1.5,H+3-k*9,1.4+k,0,7);g.fill()}break;
case'Médico':arm(6,H+6);g.fillStyle='#a33';g.fillRect(6,H+6,5,4);g.fillStyle='#e33';g.fillRect(-.7,H-9+sw*1.5,1.6,5);g.fillRect(-2.3,H-7.5+sw*1.5,4.8,1.6);break;
case'Científico':arm(6,H+3);g.fillStyle='#5ee08a';g.beginPath();g.moveTo(6,H+3);g.lineTo(9.5,H+3);g.lineTo(11,H+8);g.lineTo(4.5,H+8);g.closePath();g.fill();g.fillStyle='#d8fff0';for(let i=0;i<3;i++){const k=(T*1.4+i/3)%1;g.fillRect(7+Math.sin(T*4+i)*1.5,H+2-k*9,1.4,1.4)}break;
case'Explorador':arm(3.5,H-3);g.fillStyle='#222';g.fillRect(2,H-5.5,5,2.6);break;
default:arm(6,H+5)}}
else arm(3.8-w*1.2,H+8-Math.abs(w)*.5);
const hr=5,hy=H-3.4,OLN='#2a1a11',ex=EXP||'ok',sty=SXF==1?[2,5,2,1][id%4]:[0,1,3,4][id%4],hrx=hr*(SXF==1&&!zom?.92:1.06),bear=!zom&&!ban&&SXF!=1&&!KIDF&&(id%7===0||id%7===3||id%7===5),hcol=OLDF?'#a9a9a4':(hair||HAIR[id%5]);
const zsk=['#7f9468','#a9b3a8','#4b4640','#8d9a70','#7f9468','#a3ad88','#9db07a','#86967a'][zv],hskin=zom?zsk:skin;
g.lineJoin='round';g.fillStyle=zom?'#38402c':skin;const nw=SXF==1&&!zom?1.1:1.7;g.fillRect(-nw,H-1.4,nw*2,2.4);g.save();g.translate(0,H);g.rotate(zom?(zv==7?.22:.14):0);g.translate(0,-H);g.translate(0,hy);g.scale(.74,.74);g.translate(0,-hy);
if(!zom&&!ban){if(sty===2){g.fillStyle=hcol;g.beginPath();g.ellipse(-2.6,hy+2,3.6,6,.1,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.8;g.stroke()}if(sty===5){g.fillStyle=hcol;g.beginPath();g.ellipse(-5.6,hy+1,2,3.4,.5,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.8;g.stroke();g.fillStyle='#c33';g.fillRect(-4.4,hy-.2,1.2,1.4)}}
g.fillStyle=hskin;g.beginPath();g.ellipse(0,hy,hrx,hr*1.04,0,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=1;g.stroke();const HP=()=>{g.beginPath();g.ellipse(0,hy,hrx,hr*1.04,0,0,7)};
g.fillStyle=zom?'rgba(40,50,20,.35)':'rgba(120,70,40,.22)';g.beginPath();g.ellipse(-.8,hy+1.6,hr*.9,hr*.55,0,0,Math.PI);g.fill();
g.fillStyle=hskin;g.beginPath();g.arc(-hr+.6,hy+.6,1.3,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.6;g.stroke();if(!zom){g.fillStyle='rgba(45,32,20,.28)';g.beginPath();g.ellipse(1+(id%3),hy+2.2,2.4,1.3,0,0,7);g.fill();g.beginPath();g.ellipse(-2,hy-1.4,1.6,1,0,0,7);g.fill();if(id%9===0){g.strokeStyle='rgba(120,50,40,.8)';g.lineWidth=.7;g.beginPath();g.moveTo(3.4,hy-1.4);g.lineTo(1.8,hy+2.4);g.stroke()}if(!bear&&id%2&&SXF!=1){g.save();HP();g.clip();g.fillStyle='rgba(30,20,12,.24)';g.beginPath();g.ellipse(1.4,hy+4.2,4.6,3.2,0,0,7);g.fill();g.restore()}}
if(zom){
 g.fillStyle='rgba(20,18,10,.6)';g.beginPath();g.ellipse(1.3,hy-.3,1.8,1.7,0,0,7);g.ellipse(3.5,hy-.3,1.6,1.5,0,0,7);g.fill();g.fillStyle='#c9c590';g.beginPath();g.ellipse(1.4,hy-.3,.9,.9,0,0,7);g.ellipse(3.5,hy-.3,.8,.8,0,0,7);g.fill();g.fillStyle='#5a1a10';g.beginPath();g.arc(1.6,hy-.2,.4,0,7);g.arc(3.6,hy-.2,.4,0,7);g.fill();
 g.strokeStyle='#26331a';g.lineWidth=1;g.beginPath();g.moveTo(.2,hy-2.6);g.lineTo(2.4,hy-1.9);g.moveTo(2.6,hy-1.9);g.lineTo(4.4,hy-2.5);g.stroke();
 g.fillStyle='#2a0a0a';g.beginPath();g.ellipse(2.1,hy+2.9,1.9,1.3+Math.abs(Math.sin(T*3+zv))*.7,0,0,7);g.fill();g.fillStyle='#b8b090';g.fillRect(1,hy+1.9,.8,.8);g.fillRect(2.6,hy+1.9,.8,.8);
 g.fillStyle='rgba(120,10,10,.7)';g.fillRect(-3.6,hy-3.4,2.4,1.6);g.fillRect(3.2,hy+3.2,.9,2.2);
 if(zv==2){g.fillStyle='rgba(214,74,26,.8)';g.fillRect(-1.8,hy-3.4,.8,2.6);g.fillRect(.2,hy+1.4,.8,2)}
 if(zv==1){g.fillStyle='rgba(70,90,150,.5)';g.beginPath();g.ellipse(2.1,hy+2.9,2.4,1.7,0,0,7);g.fill()}
 if(zv==6){g.fillStyle='#d8d4b4';g.beginPath();g.ellipse(-2.4,hy-3.4,2.6,1.8,.4,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.6;g.stroke()}else if(zv!=4&&zv!=5){g.fillStyle='#3a3f2a';g.beginPath();g.moveTo(-4.6,hy-1.4);g.lineTo(-3.4,hy-4.6);g.lineTo(-1.6,hy-3);g.lineTo(-.4,hy-4.8);g.lineTo(.8,hy-3.4);g.lineTo(-1,hy-1.6);g.closePath();g.fill()}
 if(zv==4){g.fillStyle='#4f5a38';g.beginPath();g.arc(0,hy-.8,hr*1.05,Math.PI,0);g.fill();g.fillRect(-hr*1.05,hy-1,hr*2.1,1.5);g.strokeStyle=OLN;g.lineWidth=.9;g.beginPath();g.arc(0,hy-.8,hr*1.05,Math.PI,0);g.stroke();g.fillStyle='rgba(20,20,10,.5)';g.fillRect(-1.2,hy-5.4,2.4,1.1)}
 if(zv==5){g.fillStyle='#e2b422';g.beginPath();g.arc(0,hy-1,hr*1.08,Math.PI,0);g.fill();g.fillRect(-hr*1.3,hy-1.4,hr*2.6,1.4);g.strokeStyle=OLN;g.lineWidth=.9;g.stroke();g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-1.5,hy-5.7,3,.9)}
}else{
 if(bear){g.save();HP();g.clip();g.fillStyle=hcol;g.beginPath();g.moveTo(-hr-1,hy+1.4);g.quadraticCurveTo(0,hy+3.1,hr*.6,hy+2.4);g.lineTo(hr+1,hy+1.6);g.lineTo(hr+1,hy+hr+2);g.lineTo(-hr-1,hy+hr+2);g.closePath();g.fill();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-hr,hy+4.4,hr*2,3);g.fillStyle='#2a1a11';g.fillRect(.9,hy+3.4,2.8,.8);g.restore();g.strokeStyle=OLN;g.lineWidth=1;HP();g.stroke()}
 const sc2=ex==='scared'?1.25:ex==='hurt'||ex==='sick'?.75:1,ey=hy-.3;
 g.fillStyle='rgba(40,26,18,.35)';g.beginPath();g.ellipse(1.4,ey+.2,1.7,1.5,0,0,7);g.ellipse(3.7,ey+.2,1.5,1.3,0,0,7);g.fill();g.fillStyle='#d9d2bd';g.beginPath();g.ellipse(1.4,ey,1.05,.95*sc2,0,0,7);g.ellipse(3.6,ey,.9,.85*sc2,0,0,7);g.fill();
 g.fillStyle='#1b120c';g.beginPath();g.arc(1.8,ey+.1,.75,0,7);g.arc(3.9,ey+.1,.65,0,7);g.fill();
 g.strokeStyle=bear?hcol:'#1e140e';g.lineWidth=SXF==1?.8:1.35;g.lineCap='round';g.beginPath();
 if(ex==='angry'){g.moveTo(-.2,ey-3);g.lineTo(2.4,ey-1.8);g.moveTo(2.6,ey-1.8);g.lineTo(5,ey-3)}else if(ex==='scared'){g.moveTo(-.2,ey-2);g.lineTo(2.2,ey-3.4);g.moveTo(3,ey-3.2);g.lineTo(5,ey-2)}else if(ex==='hurt'||ex==='sick'){g.moveTo(-.2,ey-2.2);g.lineTo(2.2,ey-2.9);g.moveTo(3,ey-2.9);g.lineTo(5,ey-2.2)}else{g.moveTo(-.2,ey-2.4);g.lineTo(2.2,ey-2.6);g.moveTo(3,ey-2.6);g.lineTo(5,ey-2.4)}g.stroke();
 g.strokeStyle='#4a1f14';g.lineWidth=.9;g.beginPath();
 if(ex==='ok'||ex==='happy'){g.moveTo(1,hy+3.2);g.lineTo(3.8,hy+3.2)}else if(ex==='scared'){g.fillStyle='#4a1f14';g.ellipse(2.4,hy+3,.9,1.2,0,0,7);g.fill()}else if(ex==='angry'){g.moveTo(.8,hy+3.2);g.lineTo(4,hy+2.8)}else{g.moveTo(.8,hy+3.3);g.quadraticCurveTo(2.4,hy+2.2,4,hy+3.3)}g.stroke();
 if(ex==='sleep'){g.fillStyle=skin;g.beginPath();g.ellipse(1.4,ey,1.8,1.6,0,0,7);g.ellipse(3.6,ey,1.6,1.5,0,0,7);g.fill();g.strokeStyle='#1e140e';g.lineWidth=.8;g.beginPath();g.moveTo(.2,ey+.2);g.quadraticCurveTo(1.4,ey+1.2,2.6,ey+.2);g.moveTo(2.6,ey+.2);g.quadraticCurveTo(3.7,ey+1.1,4.8,ey+.2);g.stroke()}
 if(SXF==1){g.strokeStyle='#1e140e';g.lineWidth=.7;g.beginPath();g.moveTo(.3,ey-.5);g.lineTo(-.2,ey-1.3);g.moveTo(2.5,ey-.8);g.lineTo(2.6,ey-1.5);g.moveTo(2.9,ey-.7);g.lineTo(2.6,ey-1.4);g.moveTo(4.5,ey-.4);g.lineTo(5,ey-1.1);g.stroke();g.fillStyle='rgba(150,50,50,.8)';g.beginPath();g.ellipse(2.4,hy+3.1,1.7,.75,0,0,7);g.fill()}
 if(ex==='sick'){g.fillStyle='rgba(110,190,80,.4)';g.beginPath();g.ellipse(0,hy,hr,hr*1.04,0,0,7);g.fill()}
 if(ex==='hurt'){g.fillStyle='#e8e0cc';g.fillRect(-3.4,hy-3.8,5.6,1.5);g.strokeStyle=OLN;g.lineWidth=.5;g.strokeRect(-3.4,hy-3.8,5.6,1.5);g.fillStyle='#b02020';g.fillRect(.4,hy-3.8,1,1.5)}
 if(ban){g.save();HP();g.clip();g.fillStyle='#8a2a22';g.beginPath();g.moveTo(-hr,hy+.8);g.lineTo(hr,hy+.8);g.lineTo(hr*.8,hy+hr*.95);g.lineTo(-hr*.7,hy+hr*.95);g.closePath();g.fill();g.strokeStyle=OLN;g.lineWidth=.8;g.stroke();g.restore();g.strokeStyle=OLN;g.lineWidth=1;HP();g.stroke()}
 const hc=HC[role];
 if(role=='Agricultor'){g.fillStyle='#a8905a';g.beginPath();g.ellipse(0,hy-hr*.62,hr*1.75,1.9,0,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.9;g.stroke();g.beginPath();g.arc(0,hy-hr*.7,hr*.85,Math.PI,0);g.fill();g.stroke()}
 else if(role=='Cocinero'){g.fillStyle='#fff';g.fillRect(-hr*.8,hy-hr*1.6,hr*1.6,hr*.9);g.beginPath();g.arc(0,hy-hr*1.6,hr*.85,0,7);g.fill();g.strokeStyle=OLN;g.lineWidth=.8;g.stroke()}
 else if(role=='Recolector'){g.fillStyle=hcol;g.beginPath();g.arc(0,hy-.6,hr*1.02,Math.PI,0);g.fill();g.fillStyle='#7a2f26';g.fillRect(-hr,hy-2.6,hr*2,1.8);g.strokeStyle=OLN;g.lineWidth=.6;g.strokeRect(-hr,hy-2.6,hr*2,1.8)}
 else if(role=='Científico'){g.fillStyle=hcol;g.beginPath();g.arc(0,hy-.6,hr*1.02,Math.PI,0);g.fill();g.fillStyle='rgba(150,240,230,.8)';g.fillRect(-hr,hy-1.4,hr*2,2);g.strokeStyle='#2a3a3a';g.lineWidth=.7;g.strokeRect(-hr,hy-1.4,hr*2,2)}
 else if(hc&&role!=='ban'){g.fillStyle=hc;g.beginPath();g.arc(0,hy-.8,hr*1.06,Math.PI,0);g.fill();g.fillRect(-hr*1.06,hy-1,hr*2.12,1.4);g.strokeStyle=OLN;g.lineWidth=.9;g.beginPath();g.arc(0,hy-.8,hr*1.06,Math.PI,0);g.stroke();g.fillStyle='rgba(255,255,255,.3)';g.fillRect(-1.8,hy-hr*1.02,3,.9)}
 else{g.fillStyle=hcol;g.beginPath();
  if(sty===3){g.globalAlpha=.85;g.arc(0,hy-.8,hr*1.0,Math.PI*1.02,Math.PI*1.98);g.fill();g.globalAlpha=1}
  else if(sty===4){g.globalAlpha=.55;g.arc(0,hy-.8,hr*.98,Math.PI*1.05,Math.PI*1.95);g.fill();g.globalAlpha=1}
  else{g.arc(0,hy-.6,hr*1.03,Math.PI,0);g.lineTo(hr*.6,hy-1.6);g.quadraticCurveTo(0,hy-3.4,-hr*.7,hy-1.2);g.closePath();g.fill();g.strokeStyle=OLN;g.lineWidth=.8;g.stroke();g.fillStyle='rgba(255,255,255,.22)';g.beginPath();g.ellipse(-1.2,hy-hr*.85,2.2,.9,-.3,0,7);g.fill()}}
}
g.restore();g.restore()}
const hh=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v)};
function dia(c,p,k){k=k||0;c.beginPath();c.moveTo(p[0],p[1]+k);c.lineTo(p[0]+32-k*2,p[1]+16);c.lineTo(p[0],p[1]+32-k);c.lineTo(p[0]-32+k*2,p[1]+16);c.closePath()}
/* ===== Mapa 2.0: terreno generado con ruido determinista (mismo mundo en cada partida) ===== */
const nh=(x,y)=>{let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295};
const vn=(x,y)=>{const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=nh(x0,y0),b=nh(x0+1,y0),c=nh(x0,y0+1),d=nh(x0+1,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
const fbm=(x,y)=>vn(x,y)*.55+vn(x*2.1+7.3,y*2.1+3.1)*.3+vn(x*4.3+1.7,y*4.3+9.2)*.15;
const CORE={x0:9,y0:9,x1:48,y1:48};
const riverX=y=>58+Math.sin(y*.11)*4+(fbm(y*.07,3.5)-.5)*7,riverW=y=>1.35+fbm(y*.13,8.2)*.9;
let BIO=null,WDEP=null,PATHS=null;
function buildBiomes(){
 BIO=new Array(N*N);const wat=new Uint8Array(N*N),ponds=[[10,68,6,5],[30,71,5,4]];
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  let b='meadow';
  if(!(x>=CORE.x0&&x<CORE.x1&&y>=CORE.y0&&y<CORE.y1)){
   let w=false;
   if(y>=7&&y<64&&Math.abs(x+.5-riverX(y))<riverW(y))w=true;
   {const dx=(x-70)/17,dy=(y-67)/13;if(dx*dx+dy*dy<1+(fbm(x*.13,y*.13)-.5)*.9)w=true}
   for(const[q,z,rx,ry]of ponds){const dx=(x-q)/rx,dy=(y-z)/ry;if(dx*dx+dy*dy<1+(fbm(x*.2,y*.2)-.5)*.7)w=true}
   if(w)b='water';
   else if(y<5+fbm(x*.08,1.7)*14)b='mountain';
   else if(y<46&&x>63+(fbm(x*.1,y*.1)-.5)*8)b='industrial';
   else if(x<17+(fbm(y*.1,5)-.5)*8&&y>20&&y<62)b='ruins';
   else if(y>=56&&x>36+(fbm(x*.1,y*.1)-.5)*8&&x<56)b='wasteland';
   else{let f=fbm(x*.1+30,y*.1+11);if((x<19&&y<22)||(x<20&&y>60)||(x>58&&y>43&&y<62))f+=.25;if(y>50)f+=.07;if(f>.6)b='forest'}
  }
  BIO[y*N+x]=b;wat[y*N+x]=b==='water'?1:0;
 }
 // playas: tierra pegada al agua (no en el núcleo ni en montaña)
 const isW=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&BIO[y*N+x]==='water';
 const sand=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=BIO[y*N+x];if(b==='water'||b==='mountain')continue;let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(isW(x+i,y+j))near=true;if(near&&!(x>=CORE.x0&&x<CORE.x1&&y>=CORE.y0&&y<CORE.y1))sand.push(y*N+x)}
 sand.forEach(k=>BIO[k]='beach');
 // profundidad: 2 = aguas profundas (sin orilla a 2 casillas)
 WDEP=new Uint8Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!wat[y*N+x])continue;let deep=1;for(let j=-2;j<=2&&deep;j++)for(let i=-2;i<=2;i++){const a=x+i,c=y+j;if(a>=0&&c>=0&&a<N&&c<N&&!wat[c*N+a]){deep=0;break}}WDEP[y*N+x]=deep?2:1}
}
function biomeAt(x,y){if(!BIO)buildBiomes();if(x<0||y<0||x>=N||y>=N)return'meadow';return BIO[y*N+x]}
function waterD(x,y){if(!BIO)buildBiomes();return x<0||y<0||x>=N||y>=N?0:WDEP[y*N+x]}
const isRoad=(x,y)=>y===42||y===43||x===43||x===44;
function pathSet(){if(PATHS)return PATHS;const s=new Set(),add=(x,y)=>{if(x>=0&&y>=0&&x<N&&y<N)s.add(y*N+x)};
 let py=24;for(let x=47;x<N;x++){const ny=24+Math.round(Math.sin(x*.23)*1.4);for(let y=Math.min(py,ny);y<=Math.max(py,ny);y++)add(x,y);py=ny}
 let px=20;for(let y=48;y<N;y++){const nx=20+Math.round(Math.sin(y*.19)*1.6);for(let x=Math.min(px,nx);x<=Math.max(px,nx);x++)add(x,y);px=nx}
 return PATHS=s}
const isPath=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&pathSet().has(y*N+x);
const obsOK=(x,y)=>{const b=biomeAt(x,y);return b!=='water'&&b!=='mountain'&&b!=='beach'&&!isRoad(x,y)&&!isPath(x,y)};
/* ===== Territorio por parcelas (hectáreas) y reglas de terreno ===== */
const PS=8,PG=N/PS,START_PARC=[2,3,4].flatMap(py=>[2,3,4].map(px=>py*PG+px));
const parcelId=(x,y)=>Math.floor(y/PS)*PG+Math.floor(x/PS);
function migrateParc(){if(Array.isArray(S.parc)&&S.parc.length===PG*PG)return;const o=S.own||{x0:18,y0:18,x1:38,y1:38};S.parc=new Array(PG*PG).fill(0);
 for(let id=0;id<PG*PG;id++){const cx=(id%PG)*PS+PS/2,cy=Math.floor(id/PG)*PS+PS/2;if(cx>=o.x0&&cx<o.x1&&cy>=o.y0&&cy<o.y1)S.parc[id]=1}
 START_PARC.forEach(id=>S.parc[id]=1);(S.bld||[]).forEach(b=>{for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++)S.parc[parcelId(b.x+i,b.y+j)]=1});delete S.own}
function ownP(x,y){if(!S.parc)migrateParc();return x>=0&&y>=0&&x<N&&y<N&&!!S.parc[parcelId(Math.floor(x),Math.floor(y))]}
const inOwn=(x,y,m)=>{if(!m)return ownP(x,y);for(const dx of[-m,0,m])for(const dy of[-m,0,m])if(ownP(x+dx,y+dy))return true;return false};
const WK=t=>t=='road'||t=='trap'||t=='bridge';
function terrMul(x,y){const ix=Math.floor(x),iy=Math.floor(y);if(ix<0||iy<0||ix>=N||iy>=N)return 1;const b=biomeAt(ix,iy);if(b!=='water'&&b!=='mountain')return 1;if(isRoad(ix,iy)||isPath(ix,iy))return 1;const ob=bm[occ[iy*N+ix]];if(ob&&ob.type==='bridge')return 1;return b==='water'?(waterD(ix,iy)>1?.35:.5):.7}
function siteRule(t,x,y,w,h){const d=BT[t];if(!d)return true;let wat=0,mt=0,sand=0;
 for(let i=0;i<w;i++)for(let j=0;j<h;j++){const b=biomeAt(x+i,y+j);if(b==='water')wat++;else if(b==='mountain')mt++;else if(b==='beach')sand++}
 const n=w*h;
 if(d.oil)return window.oilSite?oilSite(x,y,w,h):false;
 if(d.wb)return wat===n;
 if(d.dk)return wat>=1&&wat+sand===n;
 if(d.pm){if(wat||mt)return false;for(let i=-1;i<=w;i++)for(let j=-1;j<=h;j++)if(biomeAt(x+i,y+j)==='water')return true;return false}
 if(d.mt)return mt===n;
 if(wat)return false;
 if(mt)return !!d.anyb;
 return true}
const PBIO={meadow:['Prados','#7d9a45','🌾','Buen suelo llano para casas, granjas y almacenes.'],forest:['Bosque','#3f6a35','🌲','Mucha madera, pero hay que despejar muchos árboles.'],ruins:['Ruinas','#85735c','🏚️','Escombros y chatarra. Hay que limpiar antes de construir.'],industrial:['Zona industrial','#6f7571','🏭','Restos de fábricas y chimeneas. Terreno firme para talleres.'],wasteland:['Yermo','#b0894f','🏜️','Terreno vacío y llano, fácil de construir pero expuesto.'],mountain:['Montaña','#8d9391','⛰️','Aquí solo caben minas y torres de montaña (y defensas). Frena a los zombis.'],water:['Agua','#3a8fa8','🌊','Se construyen puentes y muelles. Cruzarla sin puente es lento.'],beach:['Orilla','#d9c27a','🏖️','Sitio ideal para muelles y estaciones de bombeo.']};
const PI={};
function parcelInfo(id){if(PI[id])return PI[id];const px=(id%PG)*PS,py=Math.floor(id/PG)*PS,c={};for(let j=0;j<PS;j++)for(let i=0;i<PS;i++){const b=biomeAt(px+i,py+j);c[b]=(c[b]||0)+1}
 let dom='meadow',m=-1;for(const k in c)if(c[k]>m){m=c[k];dom=k}
 if((c.water||0)>=PS*PS*.22)dom='water';else if((c.mountain||0)>=PS*PS*.4)dom='mountain';
 return PI[id]={dom,c}}
function OB(){if(!S.parc)migrateParc();let x0=N,y0=N,x1=0,y1=0;for(let id=0;id<PG*PG;id++)if(S.parc[id]){const x=(id%PG)*PS,y=Math.floor(id/PG)*PS;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+PS);y1=Math.max(y1,y+PS)}return{x0,y0,x1,y1}}
const parcelCount=()=>(S.parc||[]).filter(Boolean).length;
function parcelCheck(id){if(S.parc[id])return{ok:false,why:'Ya es tuya.'};const px=id%PG,py=Math.floor(id/PG);
 const adj=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const x=px+a,y=py+b;return x>=0&&y>=0&&x<PG&&y<PG&&S.parc[y*PG+x]});
 const inf=parcelInfo(id),k=Math.max(1,parcelCount()-8),fac={meadow:1,forest:1.1,ruins:1.3,industrial:1.4,wasteland:1.2,mountain:1.6,water:1.2,beach:1}[inf.dom]||1;
 const cost=costOf({wood:80+k*12,metal:40+k*6},fac),d=Math.max(Math.abs(px-3),Math.abs(py-3)),need=Math.min(5,1+Math.floor(d/2)+(inf.dom==='mountain'?1:0));
 if(!adj)return{ok:false,why:'Debe tocar una parcela tuya.',cost,need,inf};
 if(hallLv()<need)return{ok:false,why:'Requiere ayuntamiento nivel '+need+'.',cost,need,inf};
 if(!can(cost))return{ok:false,why:'Faltan recursos: '+cs(cost),cost,need,inf,poor:1};
 return{ok:true,cost,need,inf}}
let pSel=-1;
function expandMenu(){const n=parcelCount();show('Territorio','<p>Parcelas: <b>'+n+' / '+PG*PG+'</b> (hectáreas de '+PS+'×'+PS+'). Toca una parcela junto a tu territorio para comprarla; así puedes llegar a todo el mapa.</p><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start"><canvas id="pmap" width="400" height="400" style="width:min(100%,56vh,380px);border:1px solid #78845b;border-radius:10px;touch-action:manipulation;flex:0 0 auto"></canvas><div id="pinfo" style="flex:1 1 210px;min-width:200px"></div></div>');
 const cv=$('pmap');cv.onclick=e=>{const r=cv.getBoundingClientRect(),px=Math.floor((e.clientX-r.left)/r.width*PG),py=Math.floor((e.clientY-r.top)/r.height*PG);if(px>=0&&py>=0&&px<PG&&py<PG){pSel=py*PG+px;drawPMap()}};drawPMap()}
function drawPMap(){const cv=$('pmap');if(!cv)return;const c=cv.getContext('2d'),cs2=cv.width/PG;c.clearRect(0,0,cv.width,cv.height);c.font=Math.round(cs2*.45)+'px system-ui';c.textAlign='center';c.textBaseline='middle';
 const hall=S.bld.find(b=>b.type=='hall'),hp=hall?parcelId(hall.x,hall.y):-1;
 for(let id=0;id<PG*PG;id++){const x=(id%PG)*cs2,y=Math.floor(id/PG)*cs2,inf=parcelInfo(id),own=S.parc[id],chk=own?null:parcelCheck(id),avail=!own&&chk.why!=='Debe tocar una parcela tuya.';
  c.fillStyle=PBIO[inf.dom][1];c.fillRect(x,y,cs2,cs2);
  if(!own){c.fillStyle=avail?'rgba(0,0,0,.18)':'rgba(0,0,0,.55)';c.fillRect(x,y,cs2,cs2)}
  c.fillStyle='rgba(255,255,255,'+(own?.95:avail?.8:.35)+')';c.fillText(id===hp?'🏠':PBIO[inf.dom][2],x+cs2/2,y+cs2/2+1);
  c.lineWidth=own?3:avail?2:1;c.strokeStyle=own?'#ffd75a':avail?'rgba(255,255,255,.85)':'rgba(0,0,0,.45)';if(avail)c.setLineDash([5,4]);c.strokeRect(x+1.5,y+1.5,cs2-3,cs2-3);c.setLineDash([])}
 if(pSel>=0){const x=(pSel%PG)*cs2,y=Math.floor(pSel/PG)*cs2;c.lineWidth=4;c.strokeStyle='#ff9d2e';c.strokeRect(x+2,y+2,cs2-4,cs2-4)}
 const el=$('pinfo');if(!el)return;if(pSel<0){el.innerHTML='<p><small>🟨 tuya · ⬜ discontinua: comprable · oscuras: aún lejos.</small></p>';return}
 const inf=parcelInfo(pSel),pb=PBIO[inf.dom],comp=Object.keys(inf.c).filter(k=>PBIO[k]&&inf.c[k]>=4).map(k=>PBIO[k][0]+' '+Math.round(inf.c[k]/(PS*PS)*100)+'%').join(' · ');
 let h='<div class="card" style="padding:9px;margin-top:6px"><b>'+pb[2]+' '+pb[0]+'</b> · parcela '+(pSel%PG+1)+','+(Math.floor(pSel/PG)+1)+'<br><small>'+pb[3]+'</small><br><small>'+comp+'</small>';
 if(S.parc[pSel])h+='<br><b>Ya es parte de tu territorio.</b>';else{const k=parcelCheck(pSel);h+='<br>Coste: <b>'+cs(k.cost)+'</b>'+(k.need?' · Ayuntamiento nivel '+k.need:'');h+='<br>'+(k.ok?'<button class="big" onclick="buyParcel('+pSel+')">Comprar parcela</button>':'<small>🔒 '+k.why+'</small>')}
 el.innerHTML=h+'</div>'}
function buyParcel(id){const k=parcelCheck(id);if(!k.ok)return toast(k.why);pay(k.cost);S.parc[id]=1;S.ex=(S.ex||0)+1;dirtyT=1;const px=(id%PG)*PS+PS/2,py=Math.floor(id/PG)*PS+PS/2;burst(px,py,30,'#ffd75a',3,12);synthSound('build');toast('Parcela adquirida: '+PBIO[k.inf.dom][0]+'.');save();drawPMap();const t=$('pan').querySelector('p');if(t)t.innerHTML='Parcelas: <b>'+parcelCount()+' / '+PG*PG+'</b> (hectáreas de '+PS+'×'+PS+'). Toca una parcela junto a tu territorio para comprarla; así puedes llegar a todo el mapa.'}
function expand(){expandMenu()}


function tileGr(c,w){c._g=c._g||{};if(c._g[w])return c._g[w];const gr=c.createLinearGradient(-24,0,24,31);gr.addColorStop(0,w?'rgba(180,231,239,.22)':'rgba(255,239,190,.12)');gr.addColorStop(.5,'rgba(255,255,255,.015)');gr.addColorStop(1,'rgba(4,12,14,.28)');return c._g[w]=gr}
function tile(c,p,x,y,own){
 let r=hh(x,y);const r2=hh(y+3,x+7),r3=hh(x*11+5,y*7+2),bio=biomeAt(x,y);
 const fb=(fbm(x*.18,y*.18)-.5)*16;r=Math.min(.999,Math.max(0,r*.45+.28+(fb/32)));
 let hue=(own&&bio==='meadow')?`hsl(${72+r*18},${36+r2*12}%,${30+r*11}%)`:
 ({meadow:`hsl(${70+r*18},${30+r2*14}%,${23+r*12}%)`,forest:`hsl(${111+r*15},${35+r2*16}%,${18+r*10}%)`,industrial:`hsl(${83+r*8},${13+r2*12}%,${22+r*9}%)`,ruins:`hsl(${29+r*13},${18+r2*15}%,${23+r*10}%)`,wasteland:`hsl(${39+r*14},${29+r2*15}%,${26+r*10}%)`,mountain:`hsl(${35+r*12},${13+r2*12}%,${31+r*12}%)`,water:(waterD(x,y)>1?`hsl(197,52%,${26+r*5}%)`:`hsl(184,50%,${38+r*6}%)`),beach:`hsl(${44+r*6},${38+r2*12}%,${56+r*9}%)`}[bio]);r=hh(x,y);
 poly(c,[[p[0],p[1]+1],[p[0]+32,p[1]+16],[p[0],p[1]+31],[p[0]-32,p[1]+16]],'rgba(0,0,0,.28)');
 dia(c,p);c.fillStyle=hue;c.fill();c.strokeStyle='rgba(26,18,8,.05)';c.lineWidth=1;dia(c,p);c.stroke();
 c.save();c.translate(p[0],p[1]);c.fillStyle=tileGr(c,bio==='water');dia(c,[0,0]);c.fill();c.restore();
 if(bio==='water'){
   c.save();dia(c,p);c.clip();
   for(let k=0;k<3;k++){let xx=p[0]-17+hh(x+k,y+2)*32, yy=p[1]+7+k*7;
    c.strokeStyle=k===1?'rgba(190,235,235,.36)':'rgba(105,194,208,.28)';c.lineWidth=1.1;
    c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+5,yy-2,xx+11,yy);c.stroke()}
   if(waterD(x,y)>1&&r>.68){c.fillStyle='rgba(226,245,218,.35)';c.beginPath();c.ellipse(p[0]+(r2-.5)*30,p[1]+16,4,1.5,-.2,0,7);c.fill()}
   c.restore();
   return;
 }
 // Suelo natural según bioma.
 if(bio==='mountain'){
   c.fillStyle='rgba(22,27,27,.35)';poly(c,[[p[0]-20,p[1]+18],[p[0]-7,p[1]-2],[p[0]+1,p[1]+7],[p[0]+13,p[1]-4],[p[0]+25,p[1]+18]],'rgba(31,38,38,.28)');
   c.strokeStyle='rgba(207,207,185,.24)';c.lineWidth=1;c.beginPath();c.moveTo(p[0]-7,p[1]+7);c.lineTo(p[0]+1,p[1]-2);c.lineTo(p[0]+8,p[1]+8);c.stroke();
 }else{
   if(r<.19||bio==='ruins'){c.fillStyle=bio==='ruins'?'rgba(111,88,67,.28)':`rgba(117,82,48,${.13+r*.3})`;c.beginPath();c.ellipse(p[0]+(r2-.5)*22,p[1]+16+(r3-.5)*7,7+r*15,3+r*4,-.2,0,7);c.fill()}
   if(bio==='industrial'&&r2>.52){c.fillStyle='rgba(35,40,38,.3)';c.fillRect(p[0]-8+(r-.5)*22,p[1]+11,10,3)}
   if(bio==='wasteland'&&r2>.45){c.strokeStyle='rgba(190,153,91,.5)';c.lineWidth=1;c.beginPath();c.moveTo(p[0]-8,p[1]+10);c.lineTo(p[0]+3,p[1]+18);c.lineTo(p[0]+10,p[1]+14);c.stroke()}
   if(bio!=='ruins'&&bio!=='industrial'&&bio!=='mountain'&&bio!=='beach'){
    const n=own?7:(bio==='forest'?7:4);
    for(let k=0;k<n;k++){const a=hh(x*7+k,y*5+k*3),b=hh(x*3+k*5,y*9+k),tx=p[0]+(a-.5)*48,ty=p[1]+16+(b-.5)*22,h=3+a*4.5;
     const col=k%3===0?'#b4c85a':(k%2?'#7fb246':'#3f8a3a');c.lineCap='round';
     c.strokeStyle='rgba(20,40,14,.55)';c.lineWidth=2.4;c.beginPath();c.moveTo(tx-2.4,ty);c.lineTo(tx-3.4-a,ty-h);c.moveTo(tx,ty);c.lineTo(tx+.4,ty-h*1.25);c.moveTo(tx+2.4,ty);c.lineTo(tx+3.8+a,ty-h);c.stroke();
     c.strokeStyle=col;c.lineWidth=1.2;c.stroke()}
   }
   if(r3>.9){const fx=p[0]+(r-.5)*42,fy=p[1]+14+(r2-.5)*16;c.fillStyle=bio==='ruins'?'#8a6a50':(r>.5?'#b8a468':'#a88480');c.beginPath();c.arc(fx,fy,1.25,0,7);c.fill()}
   if(r2<.13||bio==='ruins'){c.fillStyle=bio==='ruins'?'#77736a':'#8b8d78';c.beginPath();c.ellipse(p[0]+(r-.5)*38,p[1]+16+(r3-.5)*15,2.5+r*2,1.3,0,0,7);c.fill()}
 }
 if(bio==='beach')beachFX(c,p,x,y);
 c.strokeStyle=own?'rgba(198,222,126,.12)':'rgba(190,205,145,.04)';c.lineWidth=.8;c.beginPath();c.moveTo(p[0]-32,p[1]+16);c.lineTo(p[0],p[1]);c.lineTo(p[0]+32,p[1]+16);c.stroke();
 if(own&&r2>.975){c.fillStyle=r>.5?'#b8a468':'#a88480';c.beginPath();c.arc(p[0]+(r-.5)*24,p[1]+14+(r2-.9)*35,1.8,0,7);c.fill()}
}
const OBW={meadow:.05,forest:.42,ruins:.16,industrial:.1,wasteland:.07};
const WRK_MAX=14;
function genObs(lim){const used=new Set();S.bld.forEach(b=>{for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++)used.add((b.x+i)+','+(b.y+j))});S.obs=(S.obs||[]).filter(o=>obsOK(o.x,o.y));S.obs.forEach(o=>used.add(o.x+','+o.y));
 const n=Math.min(lim||Math.round(N*N*.14),Math.max(0,Math.round(N*N*.2)-S.obs.length));if(n<=0)return;
 const wOf=(x,y)=>{if(used.has(x+','+y)||!obsOK(x,y))return 0;if(x>=CORE.x0&&x<CORE.x1&&y>=CORE.y0&&y<CORE.y1)return .14;return(OBW[biomeAt(x,y)]||0)*(.55+nh(x*3+1,y*5+2)*.9)};
 let tot=0;for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)tot+=wOf(x,y);if(tot<=0)return;
 for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){const w=wOf(x,y);if(w&&Math.random()<Math.min(1,w*n/tot)){const bi=biomeAt(x,y),tree=bi==='forest'?.92:bi==='meadow'?.78:(bi==='ruins'||bi==='industrial')?.15:bi==='wasteland'?.4:.78;const vw=({ruins:.07,industrial:.06,wasteland:.04,meadow:.012,forest:.006})[bi]||0,nv=S.obs.filter(q=>q.t==='v').length;S.obs.push({x,y,t:(nv<WRK_MAX&&Math.random()<vw)?'v':Math.random()<tree?'t':'s'});used.add(x+','+y)}}}
function bAx(x,y){const g=(a,b)=>{if(a<0||b<0||a>=N||b>=N||!occ)return false;const o=bm[occ[b*N+a]];return !!o&&o.type==='bridge'};return(g(x,y-1)||g(x,y+1))&&!(g(x-1,y)||g(x+1,y))?'y':'x'}
function bridgeT(c,p,axis){c.save();dia(c,p);c.fillStyle='#6e4d33';c.fill();
 const ln=(a,b,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()};
 for(let k=0;k<5;k++){const t=(k+.5)/5;if(axis==='x')ln([p[0]+32*t,p[1]+16*t],[p[0]+32*t-32,p[1]+16*t+16],k%2?'#a27a50':'#8a6240',5.5);else ln([p[0]-32*t,p[1]+16*t],[p[0]-32*t+32,p[1]+16*t+16],k%2?'#a27a50':'#8a6240',5.5)}
 // barandillas en los dos bordes paralelos al camino
 if(axis==='x'){ln([p[0]-32,p[1]+16],[p[0],p[1]],'#d1aa72',2.4);ln([p[0],p[1]+32],[p[0]+32,p[1]+16],'#3f2c1c',2.4)}
 else{ln([p[0],p[1]],[p[0]+32,p[1]+16],'#d1aa72',2.4);ln([p[0]-32,p[1]+16],[p[0],p[1]+32],'#3f2c1c',2.4)}
 c.restore()}
function peakD(c,p,s,r){const cx=p[0]+(r-.5)*22,cy=p[1]+20,w=18+s*30,h=12+s*54,ax=cx+(r-.5)*14,ay=cy-h,L=[cx-w,cy],B=[cx+(r-.5)*6,cy+w*.46],R=[cx+w,cy],lp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],A=[ax,ay],j=(r*37%1)-.5,SL=lp(A,L,.45+j*.2),SR=lp(A,R,.5-j*.2);SL[0]+=4;SL[1]-=4+r*5;SR[0]-=5;SR[1]-=3+r*4;
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(cx+8,cy+4,w*1.05,w*.42,0,0,7);c.fill();
 poly(c,[L,SL,A,B],'#4b5458');poly(c,[A,SR,R,B],'#7e8789');
 poly(c,[lp(A,B,.5),lp(SL,B,.55),B],'rgba(20,24,28,.28)');
 c.strokeStyle='rgba(30,34,36,.5)';c.lineWidth=1;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();
 if(h>38){poly(c,[A,lp(A,SL,.55),lp(A,B,.16),lp(A,B,.4)],'#dbe6ea');poly(c,[A,lp(A,B,.4),lp(A,SR,.55)],'#f5f9fa')}
 c.strokeStyle='rgba(20,24,26,.65)';c.lineWidth=1.2;c.beginPath();c.moveTo(L[0],L[1]);c.lineTo(SL[0],SL[1]);c.lineTo(A[0],A[1]);c.lineTo(SR[0],SR[1]);c.lineTo(R[0],R[1]);c.stroke()}
function wreckD(c,p,i){c.save();c.translate(p[0],p[1]+16);c.rotate(i%2?.18:-.12);c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(4,5,17,8,0,0,7);c.fill();c.fillStyle=i%2?'#56605c':'#76513b';c.fillRect(-14,-8,28,13);c.fillStyle='#293b40';c.fillRect(-8,-6,9,7);c.fillRect(3,-6,8,7);c.fillStyle='#252a29';c.beginPath();c.arc(-9,6,4,0,7);c.arc(10,6,4,0,7);c.fill();c.strokeStyle='#b36c43';c.lineWidth=2;c.beginPath();c.moveTo(-12,-8);c.lineTo(-6,-12);c.lineTo(11,-8);c.stroke();c.restore()}
function beachFX(c,p,x,y){const E=[[0,-1,[p[0],p[1]],[p[0]+32,p[1]+16]],[1,0,[p[0]+32,p[1]+16],[p[0],p[1]+32]],[0,1,[p[0],p[1]+32],[p[0]-32,p[1]+16]],[-1,0,[p[0]-32,p[1]+16],[p[0],p[1]]]];
 for(const[dx,dy,a,b]of E)if(biomeAt(x+dx,y+dy)==='water'){c.strokeStyle='rgba(70,110,100,.45)';c.lineWidth=3;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
 if(nh(x*5+3,y*3)>.8){const q=[p[0]+(nh(x,y)-.5)*20,p[1]+18];c.strokeStyle='#5f7a3a';c.lineWidth=1.3;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(q[0]+k*3,q[1]);c.lineTo(q[0]+k*3+k,q[1]-9-k*k*2);c.stroke()}c.fillStyle='#6b4326';for(let k=-1;k<=1;k+=2)c.fillRect(q[0]+k*3-1,q[1]-12,2,4)}
 else if(nh(x*9,y*7)>.85){c.fillStyle='#f3e9d4';c.beginPath();c.arc(p[0]+(nh(x,y*2)-.5)*26,p[1]+17,1.6,0,7);c.fill()}}
function waterFX(c,p,x,y){const E=[[0,-1,[p[0],p[1]],[p[0]+32,p[1]+16]],[1,0,[p[0]+32,p[1]+16],[p[0],p[1]+32]],[0,1,[p[0],p[1]+32],[p[0]-32,p[1]+16]],[-1,0,[p[0]-32,p[1]+16],[p[0],p[1]]]],cc=[p[0],p[1]+16];
 for(const[dx,dy,a,b]of E){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=N||ny>=N||biomeAt(nx,ny)==='water')continue;
  c.strokeStyle='rgba(236,250,244,.8)';c.lineWidth=2.4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
  const a2=[a[0]+(cc[0]-a[0])*.2,a[1]+(cc[1]-a[1])*.2],b2=[b[0]+(cc[0]-b[0])*.2,b[1]+(cc[1]-b[1])*.2];c.strokeStyle='rgba(170,226,226,.45)';c.lineWidth=1.4;c.beginPath();c.moveTo(a2[0],a2[1]);c.lineTo(b2[0],b2[1]);c.stroke()}}
function worldDecor(c){
 // Pasada 1: carreteras de asfalto, caminos de tierra y puentes sobre el agua (siguen la cuadrícula isométrica).
 for(let s2=0;s2<2*N;s2++)for(let x=0;x<N;x++){const y=s2-x;if(y<0||y>=N)continue;const rd=isRoad(x,y),pt=!rd&&isPath(x,y);if(!rd&&!pt)continue;const p=P(x,y),water=biomeAt(x,y)==='water';
  const axis=rd?((y===42||y===43)?'x':'y'):((y>=48&&x<35)?'y':'x');
  if(water){bridgeT(c,p,axis);continue}
  if(rd){dia(c,p);c.fillStyle='rgba(48,49,43,.78)';c.fill();
   c.strokeStyle='rgba(232,184,70,.6)';c.lineWidth=1.6;c.setLineDash([7,7]);c.beginPath();
   if(y===42){c.moveTo(p[0]-32,p[1]+16);c.lineTo(p[0],p[1]+32)}else if(x===43){c.moveTo(p[0]+32,p[1]+16);c.lineTo(p[0],p[1]+32)}c.stroke();c.setLineDash([]);
   if(nh(x,y*3)>.84){c.strokeStyle='rgba(17,20,18,.8)';c.lineWidth=1;c.beginPath();c.moveTo(p[0]-8,p[1]+11);c.lineTo(p[0]-2,p[1]+17);c.lineTo(p[0]+5,p[1]+14);c.stroke()}}
  else{const r=nh(x*7,y*3);dia(c,p);c.fillStyle=`hsl(${32+r*6},${30+r*8}%,${33+r*9}%)`;c.fill();c.fillStyle='rgba(60,42,24,.35)';for(let k=0;k<4;k++){c.fillRect(p[0]+(nh(x+k,y)-.5)*34,p[1]+16+(nh(y,x+k)-.5)*15,2.2,1.4)}
   c.strokeStyle='rgba(70,50,30,.35)';c.lineWidth=1;c.beginPath();if(axis==='x'){c.moveTo(p[0]-16,p[1]+8);c.lineTo(p[0]+16,p[1]+24)}else{c.moveTo(p[0]+16,p[1]+8);c.lineTo(p[0]-16,p[1]+24)}c.stroke()}}
 // Pasada 2: relieve y objetos, ordenados en diagonal para que se solapen bien.
 for(let s2=0;s2<2*N;s2++)for(let x=0;x<N;x++){const y=s2-x;if(y<0||y>=N)continue;
  const bio=biomeAt(x,y),p=P(x,y),core=x>=CORE.x0&&x<CORE.x1&&y>=CORE.y0&&y<CORE.y1,rd=isRoad(x,y),pt=isPath(x,y);
  if(bio==='water'){waterFX(c,p,x,y);continue}
  if(core&&!rd)continue;
  if(rd&&!core){if(nh(x*11,y*5)>.945)wreckD(c,p,x+y)}
  if(rd||pt)continue;
  if(bio==='mountain'){const n=nh(x*7,y*13);if(n>.56&&!MBLK.has(y*N+x)){const s=Math.min(1,Math.max(0,(fbm(x*.17+4,y*.17+2)-.3)*2.2));peakD(c,p,s,n)}}
  else if(bio==='industrial'){const r=nh(x*5,y*9);if(r>.955){const q=P(x+.5,y+.5),h=12+nh(x,3)*17;c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q[0]+5,q[1]+3,13,5,0,0,7);c.fill();c.fillStyle=r>.97?'#59615b':'#795b42';c.fillRect(q[0]-7,q[1]-h,13,h);c.fillStyle='#a3a69a';c.fillRect(q[0]-7,q[1]-h,13,3);c.fillStyle='#a94f35';c.fillRect(q[0]-6,q[1]-h+7,11,2)}else if(r<.03)wreckD(c,p,x*3+y)}
  else if(bio==='ruins'){const r=nh(x*3,y*7);if(r>.88){const q=P(x+.5,y+.5);c.fillStyle='rgba(0,0,0,.22)';c.fillRect(q[0]-9,q[1]+1,18,4);c.fillStyle=r>.94?'#77685b':'#8b7c6b';c.fillRect(q[0]-8,q[1]-5,16,6);c.fillStyle='#4a4842';c.fillRect(q[0]-5,q[1]-8,5,3)}else if(r<.02)wreckD(c,p,x+y)}
  else if(bio==='wasteland'){if(nh(x*13,y*3)>.975)wreckD(c,p,x+y)}
 }
}
function roadT(c,p,x,y,bm,occ){const g=(dx,dy)=>{const q=x+dx,w=y+dy;if(q<0||w<0||q>=N||w>=N)return 0;const o=bm[occ[w*N+q]];return o&&o.type=='road'},r=hh(x,y);c.fillStyle=`hsl(34,9%,${35+r*6}%)`;dia(c,p);c.fill();c.strokeStyle='rgba(40,36,30,.55)';c.lineWidth=2;c.beginPath();
if(!g(0,-1)){c.moveTo(p[0]-32,p[1]+16);c.lineTo(p[0],p[1])}if(!g(1,0)){c.moveTo(p[0],p[1]);c.lineTo(p[0]+32,p[1]+16)}if(!g(0,1)){c.moveTo(p[0]+32,p[1]+16);c.lineTo(p[0],p[1]+32)}if(!g(-1,0)){c.moveTo(p[0],p[1]+32);c.lineTo(p[0]-32,p[1]+16)}c.stroke();
c.fillStyle='rgba(0,0,0,.14)';for(let k=0;k<3;k++){c.fillRect(p[0]+(hh(x+k,y)-.5)*30,p[1]+16+(hh(y,x+k)-.5)*14,2,1.5)}if(r>.7){c.fillStyle='rgba(232,184,64,.8)';c.fillRect(p[0]-5,p[1]+15,10,2)}}
function obsD(c,ob){if(ob.t==='v')return drawWreck(c,ob);const p=P(ob.x+.5,ob.y+.5),r=hh(ob.x,ob.y);c.save();
c.fillStyle='rgba(0,0,0,.34)';c.beginPath();c.ellipse(p[0]+5,p[1]+2,ob.t=='t'?17:14,6,0,0,7);c.fill();
if(ob.t=='t'){
 const bio=biomeAt(ob.x,ob.y),dead=(bio==='ruins'||bio==='industrial'||bio==='wasteland')||r>.93,round=!dead&&(bio==='meadow'?r>.35:r>.82),k=.9+r*.3,X=p[0],Y=p[1],OLC='#1c2614';
 const ov=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.5;c.stroke()};
 const trunk=(h,w,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(X-w,Y-1);c.lineTo(X-w*.6,Y-h);c.lineTo(X+w*.6,Y-h);c.lineTo(X+w,Y-1);c.closePath();c.fill();c.strokeStyle='#2a1a11';c.lineWidth=1.6;c.stroke();c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.moveTo(X+w*.1,Y-1);c.lineTo(X+w*.1,Y-h);c.lineTo(X+w*.6,Y-h);c.lineTo(X+w,Y-1);c.fill()};
 if(dead){
  trunk(34*k,3.6,'#6d5238');c.strokeStyle='#2a1a11';c.lineCap='round';
  const br=[[-1,-18,-12,-30],[1,-24,13,-36],[-1,-30,-8,-46*k],[1,-33,5,-50*k],[0,-12,10,-20]];
  br.forEach(([d,y0,dx,y1])=>{c.lineWidth=4;c.beginPath();c.moveTo(X,Y+y0*k*.8);c.lineTo(X+dx,Y+y1*.8);c.stroke();c.strokeStyle='#7d6042';c.lineWidth=2;c.stroke();c.strokeStyle='#2a1a11'});
  if(r>.5){ov(X+7,Y-27,4.5,3,'#6b7a3a')}
 }else if(round){
  trunk(24*k,4,'#7a5434');
  const cl=[['#2f6a2e',0,-36,15,12],['#3a7d34',-9,-30,11,9],['#3a7d34',9,-30,11,9],['#4d9440',-2,-44*k,12,10]];
  cl.forEach(q=>ov(X+q[1],Y+q[2]*k,q[3]*k,q[4]*k,q[0]));
  c.fillStyle='rgba(190,230,110,.38)';c.beginPath();c.ellipse(X-4,Y-47*k,6*k,3.6*k,-.4,0,7);c.fill();c.fillStyle='rgba(120,190,90,.3)';c.beginPath();c.ellipse(X-10,Y-32*k,4,2.6,-.3,0,7);c.fill();
  c.fillStyle='rgba(10,40,14,.28)';c.beginPath();c.ellipse(X+6,Y-27*k,8*k,4,0,0,Math.PI);c.fill();
  if(r>.6){c.fillStyle='#d9534a';for(let j=0;j<3;j++){c.beginPath();c.arc(X-8+j*8,Y-33*k-j%2*6,1.6,0,7);c.fill()}}
 }else{
  trunk(16*k,3.8,'#6d4a2d');
  const cols=['#1f4a2a','#276033','#2f733a','#3b8742'];
  for(let i=0;i<4;i++){const yy=Y-12-i*12.5*k,ww=(17-i*3.2)*k;c.fillStyle=cols[i];c.beginPath();c.moveTo(X-ww,yy+6);c.quadraticCurveTo(X-ww*.5,yy+2,X-ww*.15,yy-9*k);c.lineTo(X,yy-12*k);c.lineTo(X+ww*.15,yy-9*k);c.quadraticCurveTo(X+ww*.5,yy+2,X+ww,yy+6);c.quadraticCurveTo(X,yy+10,X-ww,yy+6);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.5;c.stroke();
   c.fillStyle='rgba(10,40,16,.3)';c.beginPath();c.moveTo(X+ww*.1,yy-10*k);c.lineTo(X+ww*.15,yy-9*k);c.quadraticCurveTo(X+ww*.5,yy+2,X+ww,yy+6);c.quadraticCurveTo(X+ww*.5,yy+7,X+ww*.1,yy+5);c.closePath();c.fill();
   c.fillStyle='rgba(180,225,110,.35)';c.beginPath();c.ellipse(X-ww*.35,yy-2,ww*.28,2.2,-.45,0,7);c.fill()}
 }
}else{
 // chatarra: neumático, chapa oxidada y cristal roto
 c.fillStyle='#30363a';c.beginPath();c.ellipse(p[0]-4,p[1]-1,9,5,-.25,0,7);c.fill();c.fillStyle='#717b80';c.beginPath();c.moveTo(p[0]-13,p[1]-1);c.lineTo(p[0]-8,p[1]-13);c.lineTo(p[0]+3,p[1]-15);c.lineTo(p[0]+14,p[1]-2);c.lineTo(p[0]+9,p[1]+2);c.closePath();c.fill();c.strokeStyle='rgba(20,18,16,.85)';c.lineWidth=1.4;c.stroke();
 c.fillStyle='#9ba3a2';c.beginPath();c.moveTo(p[0]-8,p[1]-12);c.lineTo(p[0]+3,p[1]-15);c.lineTo(p[0]+1,p[1]-6);c.lineTo(p[0]-9,p[1]-4);c.closePath();c.fill();c.fillStyle='#a75b35';c.fillRect(p[0]-3,p[1]-10,8,5);c.fillStyle='#e0955c';c.fillRect(p[0]-3,p[1]-10,8,1.5);c.strokeStyle='#c5d7d9';c.lineWidth=1;c.beginPath();c.moveTo(p[0]+7,p[1]-7);c.lineTo(p[0]+11,p[1]-12);c.lineTo(p[0]+9,p[1]-4);c.stroke();
}
c.restore()}

let TB=null,TBK='',NOI=null,MBLK=new Set();
function fsGrade(c){const a=P(0,0),b=P(N,0),d=P(N,N),e=P(0,N);c.save();c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.clip();
c.globalCompositeOperation='lighter';c.fillStyle='rgb(26,28,10)';c.fillRect(-N*32,0,N*64,N*32+10);c.globalCompositeOperation='multiply';c.fillStyle='rgba(255,236,200,.2)';c.fillRect(-N*32,0,N*64,N*32+10);
if(!NOI){NOI=document.createElement('canvas');NOI.width=NOI.height=96;const n=NOI.getContext('2d'),im=n.createImageData(96,96);for(let i=0;i<im.data.length;i+=4){const v=60+Math.random()*135;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}n.putImageData(im,0,0)}
c.globalCompositeOperation='overlay';c.globalAlpha=.05;c.fillStyle=c.createPattern(NOI,'repeat');c.fillRect(-N*32,0,N*64,N*32+10);c.globalAlpha=1;
c.globalCompositeOperation='soft-light';const g=c.createLinearGradient(0,0,0,N*32);g.addColorStop(0,'rgba(255,214,120,.35)');g.addColorStop(1,'rgba(40,70,80,.3)');c.fillStyle=g;c.fillRect(-N*32,0,N*64,N*32+10);c.restore()}
function terrBase(){if(!S.parc)migrateParc();MBLK=new Set();S.bld.forEach(b=>{const d=BT[b.type];if(d&&(d.mt||d.anyb))for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++)if(biomeAt(b.x+i,b.y+j)==='mountain')MBLK.add((b.y+j)*N+b.x+i)});const k=S.parc.join('')+'|'+[...MBLK].sort((a,b)=>a-b).join(',');if(TB&&TBK==k)return TB;TBK=k;const tc=TB||document.createElement('canvas');tc.width=N*64;tc.height=N*32+10;const c=tc.getContext('2d');c.clearRect(0,0,tc.width,tc.height);c.translate(N*32,0);
for(let s2=0;s2<2*N;s2++)for(let x=0;x<N;x++){const y=s2-x;if(y<0||y>=N)continue;tile(c,P(x,y),x,y,ownP(x,y))}
worldDecor(c);fsGrade(c);return TB=tc}
const OSP={};

/* ---- restos de vehículos: decorado del mapa con botín ---- */
function drawWreck(c,ob){const r=hh(ob.x,ob.y),r2=hh(ob.y+3,ob.x+7),L=!!ob.l;c.save();
 const cols=['#b04a38','#4f7aa0','#a8a89c','#d1b04a','#6a8a58','#8a6a9a'],bc=L?'#6e625a':cols[Math.floor(r*cols.length)%cols.length],van=r2>.62;
 const x0=ob.x+.06,y0=ob.y+.27,w=.88,h=.46,g=P(ob.x+.5,ob.y+.5);
 c.fillStyle='rgba(0,0,0,.34)';c.beginPath();c.ellipse(g[0]+2,g[1]+3,28,10,0,0,7);c.fill();
 box(c,x0+.03,y0+.03,w-.06,h-.06,3,'#232321',0);                                   // bajos
 box(c,x0,y0,w,h,van?9:6,bc,3);                                                    // carrocería
 if(van){box(c,x0+.04,y0+.02,.52,h-.04,6,'#1d2429',12);box(c,x0+.02,y0,.56,h,1.6,bc,18)}        // furgoneta: caja con ventanillas
 else{box(c,x0+.22,y0+.02,.42,h-.04,5.5,'#1d2429',9);box(c,x0+.2,y0,.46,h,1.6,bc,14.5)}          // cabina de turismo
 // ruedas (una falta)
 const wh=(u,v,bare)=>{const q=P(u,v);c.fillStyle=bare?'#6a6a66':'#161614';c.beginPath();c.ellipse(q[0],q[1]-3.5,4.6,5.2,0,0,7);c.fill();c.fillStyle='#9a9a92';c.beginPath();c.ellipse(q[0],q[1]-3.5,1.8,2,0,0,7);c.fill()};
 wh(x0+.14,y0+h,false);wh(x0+.7,y0+h,r>.5);
 // cristal roto, óxido y faros
 c.strokeStyle='rgba(235,245,255,.55)';c.lineWidth=1;const a=P(x0+.34,y0+h-.02),b2=P(x0+.5,y0+h-.02);c.beginPath();c.moveTo(a[0],a[1]-12);c.lineTo(b2[0],b2[1]-8);c.moveTo(a[0]+2,a[1]-7);c.lineTo(b2[0]-2,b2[1]-13);c.stroke();
 c.fillStyle='rgba(70,32,12,.5)';const o=P(x0+.1+r*.25,y0+h);c.fillRect(o[0],o[1]-11,7,3);c.fillRect(o[0]+12,o[1]-7,5,2.5);
 if(L){const d=P(x0+.5,y0+h);c.fillStyle=bc;c.strokeStyle='#1c1c1a';c.lineWidth=1.4;c.beginPath();c.moveTo(d[0]-6,d[1]-12);c.lineTo(d[0]+7,d[1]-4);c.lineTo(d[0]+7,d[1]+5);c.lineTo(d[0]-6,d[1]-3);c.closePath();c.fill();c.stroke()}
 else{c.fillStyle='rgba(255,226,120,.95)';c.beginPath();c.arc(g[0]-2,g[1]-28,2.4,0,7);c.fill();c.strokeStyle='rgba(255,226,120,.45)';c.lineWidth=1;c.beginPath();c.arc(g[0]-2,g[1]-28,4.4,0,7);c.stroke()}
 c.restore()}
function shadeC(col){return sh?sh(col,.8):col}
window.lootWreck=function(ob){
 const col=1+S.ppl.filter(p=>p.prof=='Recolector').length*.2;
 const T=[['metal',[8,22],1],['scrap',[6,16],.9],['tarp',[3,8],.6],['plank',[2,6],.4],['comp',[1,3],.3],['ammo',[2,8],.25],['meds',[1,4],.2],['chem',[1,3],.12],['rp',[2,5],(window.rpOn&&rpOn())?.08:0]];
 const got={};let n=0;T.forEach(([k,rg,pr])=>{if(Math.random()<pr||(k=='metal')){const v=Math.max(1,Math.round(ri(rg[0],rg[1])*col));got[k]=v;n++}});
 if(n<2)got.scrap=(got.scrap||0)+ri(4,10);
 for(const k in got)S.res[k]=Math.min(k=='rp'&&window.rpCap?rpCap():cap(),(S.res[k]||0)+got[k]);
 ob.l=1;return Object.keys(got).map(k=>'+'+got[k]+' '+(RK.find(r=>r[0]==k)||[0,k])[1].toLowerCase()).join(', ')};
function obsSpr(c,ob){const sc=(dpr*cam.z)>1.2?2:1,bk=ob.t+(ob.l?'L':'')+biomeAt(ob.x,ob.y)+Math.floor(hh(ob.x,ob.y)*8)+'@'+sc;let s=OSP[bk];const p=P(ob.x+.5,ob.y+.5);
 if(!s){const cv=document.createElement('canvas');cv.width=100*sc;cv.height=110*sc;const x=cv.getContext('2d');x.scale(sc,sc);x.translate(50-p[0],90-p[1]);obsD(x,ob);s=OSP[bk]={cv}}
 c.drawImage(s.cv,p[0]-50,p[1]-90,100,110)}
function obsKey(o){let k=o.x+o.y+.5;for(const b of S.bld){if(b.type=='road'||Math.abs(o.x-b.x-b.w/2)>b.w/2+4||Math.abs(o.y-b.y-b.h/2)>b.h/2+4)continue;const bk=b.x+b.w-1+b.y+b.h-1+.5;
  const fr=(o.x>=b.x&&o.x<b.x+b.w&&o.y>=b.y+b.h)||(o.y>=b.y&&o.y<b.y+b.h&&o.x>=b.x+b.w)||(o.x>=b.x+b.w&&o.y>=b.y+b.h);
  const bh=(o.x<b.x+b.w&&o.y<b.y)||(o.y<b.y+b.h&&o.x<b.x);
  if(fr)k=Math.max(k,bk+.01);else if(bh)k=Math.min(k,bk-.01)}return k}
function terr(){const base=terrBase(),tc=TC||document.createElement('canvas');if(tc.width!=base.width||tc.height!=base.height){tc.width=base.width;tc.height=base.height}const c=tc.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,tc.width,tc.height);c.drawImage(base,0,0);c.translate(N*32,0);
S.bld.forEach(b=>{if(b.type=='road')for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++)roadT(c,P(b.x+i,b.y+j),b.x+i,b.y+j,bm,occ)});
c.shadowColor='#ffd75a';c.shadowBlur=10;c.strokeStyle='rgba(255,224,110,.85)';c.lineWidth=3;c.setLineDash([10,6]);c.beginPath();
for(let id=0;id<PG*PG;id++){if(!S.parc[id])continue;const px=id%PG,py=Math.floor(id/PG),x0=px*PS,y0=py*PS,x1=x0+PS,y1=y0+PS,nb=(u,v)=>u>=0&&v>=0&&u<PG&&v<PG&&S.parc[v*PG+u],seg=(A,B)=>{const m=P(A[0],A[1]),n=P(B[0],B[1]);c.moveTo(m[0],m[1]);c.lineTo(n[0],n[1])};
 if(!nb(px,py-1))seg([x0,y0],[x1,y0]);if(!nb(px+1,py))seg([x1,y0],[x1,y1]);if(!nb(px,py+1))seg([x1,y1],[x0,y1]);if(!nb(px-1,py))seg([x0,y1],[x0,y0])}
c.stroke();c.shadowBlur=0;c.setLineDash([]);return tc}
let TC=null;
function groundB(c,b){const k=b.type;if(k=='road'||k=='bridge'||k=='dock'||k=='wall'||k=='gate'||k=='barricade'||k=='trap')return;
 const e=k=='farm'?.2:.42;c.save();
 const ring=(m,col)=>{poly(c,[P(b.x-m,b.y-m),P(b.x+b.w+m,b.y-m),P(b.x+b.w+m,b.y+b.h+m),P(b.x-m,b.y+b.h+m)],col)};
 ring(e,'rgba(112,86,52,.42)');ring(e*.55,'rgba(88,64,38,.5)');ring(.1,'rgba(40,26,14,.38)');c.restore();
 for(let i=0;i<14;i++){const r1=hh(b.x*7+i,b.y*3+i),r2=hh(b.y*5+i,b.x*11+i),u=-e+r1*(b.w+2*e),v=-e+r2*(b.h+2*e);if(u>0&&u<b.w&&v>0&&v<b.h)continue;const p=P(b.x+u,b.y+v);c.fillStyle=i%3?'rgba(70,50,30,.55)':'rgba(150,140,120,.7)';c.beginPath();c.ellipse(p[0],p[1],1.6+r1*1.6,.9+r2,0,0,7);c.fill()}}
function shB(c,b){groundB(c,b);const z=BT[b.type].z*.6,a=P(b.x,b.y),b2=P(b.x+b.w,b.y),d=P(b.x+b.w,b.y+b.h),e=P(b.x,b.y+b.h),o=[z*.9,z*.45];poly(c,[a,b2,d,e],'rgba(0,0,0,.2)');poly(c,[[e[0],e[1]],[d[0],d[1]],[d[0]+o[0],d[1]+o[1]],[e[0]+o[0],e[1]+o[1]]],'rgba(0,0,0,.17)');poly(c,[[b2[0],b2[1]],[d[0],d[1]],[d[0]+o[0],d[1]+o[1]],[b2[0]+o[0],b2[1]+o[1]]],'rgba(0,0,0,.17)')}
function lightFX(c,cv){const t=S.dayT/600,W=cv.width,H=cv.height;let col=null,a=0,nf=0;
if(t<.08){col='255,190,120';a=.5*(1-t/.08)}else if(t>=.62&&t<.8){col='255,150,90';a=.55*(t-.62)/.18}else if(t>=.8){const k=Math.min(1,(t-.8)/.1);col='70,85,150';a=.55+.2*k;nf=k}
c.setTransform(1,0,0,1,0,0);if(t>=.04&&t<.62){c.fillStyle='rgba(255,190,100,.05)';c.fillRect(0,0,W,H)}if(col){c.globalCompositeOperation='multiply';c.globalAlpha=a;c.fillStyle='rgb('+col+')';c.fillRect(0,0,W,H);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
if(nf>0||t>=.7){const f=Math.min(1,Math.max(nf,(t-.7)/.1));c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);c.globalCompositeOperation='lighter';S.bld.forEach(b=>{if(b.type=='road'||!vis(b.x+b.w/2,b.y+b.h/2,160))return;const q=P(b.x+b.w/2,b.y+b.h/2),rr=24+b.w*10,fl=.85+Math.sin(T*5+b.id)*.08,g=c.createRadialGradient(q[0],q[1]-BT[b.type].z*.4,2,q[0],q[1]-BT[b.type].z*.4,rr);g.addColorStop(0,'rgba(255,190,90,'+.45*f*fl+')');g.addColorStop(1,'rgba(255,150,50,0)');c.fillStyle=g;c.fillRect(q[0]-rr,q[1]-BT[b.type].z*.4-rr,rr*2,rr*2)});c.globalCompositeOperation='source-over'}
c.setTransform(1,0,0,1,0,0);const g=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.85);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(22,10,0,.26)');c.fillStyle=g;c.fillRect(0,0,W,H)}
function buildingPolish(c,b){
 const d=BT[b.type],k=b.type,x=b.x,y=b.y,w=b.w,h=b.h,z=d.z,pt=(u,v,zz=0)=>{const q=P(x+u,y+v);return[q[0],q[1]-zz]};
 if(k==='road'||k==='bridge')return;
 c.save();
 // sombra de contacto y pequeña base perimetral
 const a=pt(0,0),bb=pt(w,0),dd=pt(w,h),e=pt(0,h);c.fillStyle='rgba(0,0,0,.20)';poly(c,[[a[0],a[1]+2],[bb[0],bb[1]+2],[dd[0],dd[1]+2],[e[0],e[1]+2]],'rgba(0,0,0,.16)');
 c.strokeStyle='rgba(255,232,180,.24)';c.lineWidth=1.1;c.beginPath();c.moveTo(e[0],e[1]-z+1);c.lineTo(dd[0],dd[1]-z+1);c.lineTo(bb[0],bb[1]-z+1);c.stroke();
 c.restore();return;
 if(['house','hall','hosp','barr','store','work','fact','lab','expo','gar'].includes(k)){
   const count=Math.max(1,Math.min(4,w));for(let i=0;i<count;i++){const q=pt((i+.5)*w/count,h,z*.48);c.fillStyle='rgba(20,24,20,.22)';c.fillRect(q[0]-5,q[1]-4,10,8);c.strokeStyle='rgba(255,232,190,.28)';c.strokeRect(q[0]-5,q[1]-4,10,8);c.fillStyle='rgba(255,210,120,.10)';c.fillRect(q[0]-3,q[1]-2,2,3)}
 }
 if(k==='hall'||k==='house'||k==='barr'||k==='store'||k==='work'){
   const q=pt(w*.5,h,z*.22);c.fillStyle='rgba(35,25,16,.65)';c.fillRect(q[0]-5,q[1]-10,10,10);c.strokeStyle='rgba(222,190,128,.45)';c.strokeRect(q[0]-5,q[1]-10,10,10);c.fillStyle='#d5b56a';c.fillRect(q[0]+2,q[1]-6,1.5,1.5);
 }
 // óxido y grietas discretas en fachadas
 if(['fact','work','gar','store','wall','gate'].includes(k)){const q=pt(w*.78,h,z*.35);c.strokeStyle='rgba(35,25,17,.35)';c.lineWidth=1;c.beginPath();c.moveTo(q[0],q[1]-6);c.lineTo(q[0]-2,q[1]-2);c.lineTo(q[0]+1,q[1]+1);c.stroke()}
 // pequeñas luces cálidas en ventanas al anochecer
 const day=S.dayT/600;if(day>.72){const q=pt(w*.5,h,z*.65);c.save();c.globalCompositeOperation='lighter';const rg=c.createRadialGradient(q[0],q[1],1,q[0],q[1],14);rg.addColorStop(0,'rgba(255,190,90,.22)');rg.addColorStop(1,'rgba(255,150,50,0)');c.fillStyle=rg;c.fillRect(q[0]-14,q[1]-14,28,28);c.restore()}
 c.restore();
}
function buildingLifeFX(c,b){
 const d=BT[b.type],k=b.type,x=b.x,y=b.y,w=b.w,h=b.h,z=d.z,lv=Math.max(1,b.lvl||1),id=b.id||0;
 if(k==='road'||k==='bridge'||k==='wall'||k==='gate'||k==='trap'||k==='turret'||(window.NB&&NB[k]))return;
 const pt=(u,v,zz=0)=>{const q=P(x+u,y+v);return[q[0],q[1]-zz]};
 c.save();
 // Destellos breves de mejora y construcción (solo visuales, sin temporizadores persistentes).
 if(b.fxUpgrade&&T>=b.fxUpgrade&&T-b.fxUpgrade<1.6){const q=pt(w/2,h/2,z+8),a=Math.max(0,1-(T-b.fxUpgrade)/1.6);c.strokeStyle='rgba(255,220,110,'+a+')';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1],18+(1-a)*24,8+(1-a)*10,0,0,7);c.stroke()}
 if(b.fxBuild&&T>=b.fxBuild&&T-b.fxBuild<1.1){const q=pt(w/2,h/2,z+5),a=Math.max(0,1-(T-b.fxBuild)/1.1);c.fillStyle='rgba(230,220,190,'+(.18*a)+')';c.beginPath();c.ellipse(q[0],q[1],20+(1-a)*22,9+(1-a)*10,0,0,7);c.fill()}
 // Acabados progresivos: cada mejora añade infraestructura visible al tejado.
 if(lv>=2){const q=pt(w*.72,h*.28,z+5);c.fillStyle='#59656a';c.fillRect(q[0]-5,q[1]-3,10,5);c.fillStyle='#b9c7c8';c.fillRect(q[0]-4,q[1]-4,8,2);}
 if(lv>=3){const q=pt(w*.28,h*.28,z+8);c.strokeStyle='#414b4d';c.lineWidth=1.8;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]-15);c.stroke();c.beginPath();c.arc(q[0],q[1]-16,2,0,7);c.fillStyle='#e5c66b';c.fill();}
 if(lv>=4){const q=pt(w*.72,h*.68,z+4);c.fillStyle='#315b72';c.fillRect(q[0]-6,q[1]-3,12,6);c.strokeStyle='#a9d1d7';c.lineWidth=.8;c.beginPath();c.moveTo(q[0]-3,q[1]-3);c.lineTo(q[0]-3,q[1]+3);c.moveTo(q[0]+2,q[1]-3);c.lineTo(q[0]+2,q[1]+3);c.stroke();}
 if(lv>=5){const q=pt(w*.5,.12,z+9);c.fillStyle='#d4b65f';c.beginPath();c.arc(q[0],q[1],3.2,0,7);c.fill();c.strokeStyle='#f4d77b';c.beginPath();c.arc(q[0],q[1],6+Math.sin(T*2+id)*.6,0,7);c.stroke();}
 // Identidad visual y accesorios funcionales de cada instalación.
 if(k==='hosp'){
  let q=pt(w*.5,h,z+18);c.fillStyle='#f3f5f1';c.fillRect(q[0]-12,q[1]-4,24,8);c.fillRect(q[0]-4,q[1]-12,8,24);c.fillStyle='#d73535';c.fillRect(q[0]-9,q[1]-2,18,4);c.fillRect(q[0]-2,q[1]-9,4,18);
  const blink=Math.sin(T*5+id)>0;c.fillStyle=blink?'#ff5151':'#f4f4e7';c.fillRect(q[0]-17,q[1]+8,4,2);c.fillRect(q[0]+13,q[1]+8,4,2);
 }
 if(k==='barr'){
  let q=pt(.35,h+.12,2);c.fillStyle='#89734b';c.fillRect(q[0]-8,q[1]-5,16,5);c.fillStyle='#4e5c39';c.fillRect(q[0]-7,q[1]-4,14,3);
  q=pt(w*.78,.18,z+21);c.strokeStyle='#3a3328';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]-18);c.stroke();c.fillStyle='#a63832';poly(c,[[q[0],q[1]-17],[q[0]+10,q[1]-14],[q[0],q[1]-10]],'#a63832');
 }
 if(k==='farm'){
  // Sacos, cajas y espantapájaros en el perímetro de cultivo.
  let q=pt(.18,h*.78,4);c.fillStyle='#b78b4c';c.fillRect(q[0]-4,q[1]-5,8,5);c.strokeStyle='#76552f';c.beginPath();c.moveTo(q[0]-3,q[1]-3);c.lineTo(q[0]+3,q[1]-3);c.stroke();
  q=pt(w*.18,.12,10);c.strokeStyle='#4c3926';c.lineWidth=2;c.beginPath();c.moveTo(q[0],q[1]-8);c.lineTo(q[0],q[1]+5);c.moveTo(q[0]-5,q[1]-4);c.lineTo(q[0]+5,q[1]-4);c.stroke();c.fillStyle='#d8bd78';c.beginPath();c.arc(q[0],q[1]-10,3,0,7);c.fill();
 }
 if(k==='work'||k==='fact'){
  let q=pt(w*.78,.2,z+12);c.fillStyle='#555b5b';c.fillRect(q[0]-5,q[1]-13,10,13);c.fillStyle='#b7b2a5';c.fillRect(q[0]-6,q[1]-14,12,2);smoke(c,[q[0],q[1]-15]);
  q=pt(.25,h+.12,2);c.fillStyle='#c48a37';c.fillRect(q[0]-5,q[1]-5,10,5);c.strokeStyle='#6a4a29';c.strokeRect(q[0]-5,q[1]-5,10,5);
 }
 if(k==='gar'){
  let q=pt(w*.5,h+.24,1);c.fillStyle='#26333a';c.fillRect(q[0]-11,q[1]-7,22,7);c.fillStyle='#a9b6b5';c.fillRect(q[0]-7,q[1]-10,14,4);c.fillStyle='#e3c56a';c.fillRect(q[0]-9,q[1]-3,3,2);c.fillRect(q[0]+6,q[1]-3,3,2);
  c.fillStyle='#171d21';for(let a of [-7,7]){c.beginPath();c.arc(q[0]+a,q[1],2.2,0,7);c.fill()}
 }
 if(k==='gen'){
  let q=pt(w*.5,h*.25,z+12);c.strokeStyle='#30383b';c.lineWidth=2;c.beginPath();c.arc(q[0],q[1],5,0,7);c.stroke();c.save();c.translate(q[0],q[1]);c.rotate(T*4);for(let j=0;j<4;j++){c.rotate(Math.PI/2);c.fillStyle='#aeb9b7';c.fillRect(-1,-5,2,5)}c.restore();
 }
 if(k==='lab'){
  let q=pt(w*.5,h*.15,z+12);c.fillStyle='rgba(100,235,215,.25)';c.beginPath();c.arc(q[0],q[1],8+Math.sin(T*2)*1.5,0,7);c.fill();c.strokeStyle='#9de6d7';c.stroke();
 }
 if(k==='tower'){
  let q=pt(w*.5,h*.5,z+30);c.strokeStyle='#d8c58a';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]-13);c.stroke();c.fillStyle='#d6bd75';c.fillRect(q[0]-3,q[1]-14,6,3);
 }
 // Ventanas cálidas nocturnas y reflejos de actividad.
 const night=S.dayT/600>.72;
 if(night&&['house','hall','hosp','barr','store','work','expo','fact','gar','lab'].includes(k)){
  for(let i=0;i<Math.min(4,Math.max(1,w));i++){const q=pt((i+.5)*w/Math.min(4,Math.max(1,w)),h,z*.55);const pulse=.72+.22*Math.sin(T*1.8+i+id);c.fillStyle='rgba(255,207,112,'+pulse+')';c.fillRect(q[0]-2,q[1]-4,4,7);c.fillStyle='rgba(255,240,180,.25)';c.fillRect(q[0]-1,q[1]-3,1,5)}
 }
 // Pequeños accesorios de ambientación en el borde frontal, calculados sin aleatoriedad.
 if(['house','hall','hosp','store','expo','fact','work','gar'].includes(k)){
  const q=pt(w+.18,h*.78,1);c.fillStyle='#5a4a35';c.fillRect(q[0]-2,q[1]-8,4,8);c.fillStyle='#e7c66d';c.beginPath();c.arc(q[0],q[1]-9,3.2,0,7);c.fill();c.fillStyle='rgba(255,220,130,.18)';c.beginPath();c.arc(q[0],q[1]-9,8,0,7);c.fill();
 }
 // Superviviente asignado trabajando cerca del acceso: figura pequeña y animada.
 if(d.job&&b.id&&wk(b).length&&Math.floor(T*1.4+id)%4!==3){
  const worker=wk(b)[0],phase=T*.55+id*.91,px=x+w*.52+Math.sin(phase)*.42,py=y+h+.28+Math.cos(phase*1.3)*.16;
  fig(px,py,PC[worker.prof]||'#b68b54',.48,1,0,0,Math.sin(phase)>=0?1:-1,worker.prof,3,worker.id);
  if(Math.sin(T*4+id)>0.72){const q=P(px,py);c.fillStyle='rgba(255,220,125,.8)';c.beginPath();c.arc(q[0]+4,q[1]-15,1.5,0,7);c.fill()}
 }
 c.restore();
}
function ambientFX(c){
 // motas de polvo y luciérnagas ambientales; no intervienen en colisiones ni en la simulación
 const t=T,vx0=cam.x-10,vx1=cam.x+vw()/cam.z+10,vy0=cam.y-10,vy1=cam.y+vh()/cam.z+10;if(QS<.7)return;for(let i=0;i<30;i++){const x=((i*97.3+t*(i%3+1)*2.2)%(N*64))-N*32,y=((i*53.7+Math.sin(t*.35+i)*18)%(N*32));if(x<vx0||x>vx1||y<vy0||y>vy1)continue;const alpha=.08+.08*(.5+.5*Math.sin(t*1.7+i));c.fillStyle=i%7===0?'rgba(255,197,105,'+alpha+')':'rgba(225,226,190,'+alpha+')';c.beginPath();c.arc(x,y, i%7===0?1.4:.75,0,7);c.fill()}
}
function apoFX(c,cv){const W=cv.width,H=cv.height;c.save();c.setTransform(1,0,0,1,0,0);
 c.globalCompositeOperation='saturation';c.globalAlpha=.2;c.fillStyle='#7a7a7a';c.fillRect(0,0,W,H);
 c.globalCompositeOperation='multiply';c.globalAlpha=1;c.fillStyle='rgba(190,180,152,.15)';c.fillRect(0,0,W,H);
 c.globalCompositeOperation='source-over';
 const hz=c.createLinearGradient(0,0,0,H*.55);hz.addColorStop(0,'rgba(104,96,76,.30)');hz.addColorStop(1,'rgba(104,96,76,0)');c.fillStyle=hz;c.fillRect(0,0,W,H*.55);
 const vg=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(8,8,4,.5)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 if(QS>=.7){const t=T,n=44;c.fillStyle='rgba(205,200,185,.5)';for(let i=0;i<n;i++){const x=((i*131.7+t*(8+i%5*3))%(W+40))-20,y=((i*77.3+t*(14+i%4*5))%(H+40))-20,r=(.8+(i%3)*.5)*(cv.width/900);c.globalAlpha=.25+.3*((i*7)%5)/5;c.beginPath();c.arc(x,y,r,0,7);c.fill()}c.globalAlpha=1}
 c.restore()}
function drawBuildGrid(c){
 if(!placing)return;
 c.save();c.lineWidth=1;
 for(let id=0;id<PG*PG;id++){if(!S.parc[id])continue;const bx=(id%PG)*PS,by=Math.floor(id/PG)*PS;if(!vis(bx+PS/2,by+PS/2,PS*34))continue;for(let y=by;y<by+PS;y++)for(let x=bx;x<bx+PS;x++){
  const a=P(x,y),b=P(x+1,y),d=P(x+1,y+1),e=P(x,y+1),valid=okAt(x,y,1,1,placing.mv);
  c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();
  c.fillStyle=valid?'rgba(130,205,115,.035)':'rgba(255,90,75,.025)';c.fill();
  c.strokeStyle='rgba(220,245,205,.28)';c.stroke();
 }}
 c.restore();
}
function updatePlacementFromScreen(sx,sy){
 if(!placing)return;const g2=scr2g(sx,sy);
 placing.x=Math.floor(g2.x-placing.w/2+.5);placing.y=Math.floor(g2.y-placing.h/2+.5);fbar();
}
function expOf(p,fight){if(fight)return'angry';if(p.illness)return'sick';if(p.hp<mhp(p)*.5||(p.injury||0)>40)return'hurt';if(horde)return'scared';if((p.hunger??100)<25||(p.thirst??100)<25)return'hungry';return'ok'}
function needOf(p){if(p.illness)return'sick';if(p.hp<mhp(p)*.5||(p.injury||0)>40)return'hurt';if((p.thirst??100)<25)return'water';if((p.hunger??100)<25)return'food';return''}
function drawBub(c,x,y,k){const bob=Math.sin(T*4)*1.2;c.save();c.translate(x,y+bob);c.fillStyle='#f4efe0';c.strokeStyle='#2a1a11';c.lineWidth=1.6;c.beginPath();c.moveTo(-7,-7);c.quadraticCurveTo(-9,-7,-9,-5);c.lineTo(-9,5);c.quadraticCurveTo(-9,7,-7,7);c.lineTo(-2,7);c.lineTo(0,11);c.lineTo(2,7);c.lineTo(7,7);c.quadraticCurveTo(9,7,9,5);c.lineTo(9,-5);c.quadraticCurveTo(9,-7,7,-7);c.closePath();c.fill();c.stroke();
 if(k==='water'){c.fillStyle='#3a9ad0';c.beginPath();c.moveTo(0,-5);c.quadraticCurveTo(5,1,0,5);c.quadraticCurveTo(-5,1,0,-5);c.fill()}
 else if(k==='food'){c.fillStyle='#d23a2e';c.beginPath();c.arc(0,1,4,0,7);c.fill();c.fillStyle='#3a8a2a';c.fillRect(-.6,-5,1.4,3)}
 else if(k==='hurt'){c.fillStyle='#d23a2e';c.fillRect(-1.6,-5,3.2,10);c.fillRect(-5,-1.6,10,3.2)}
 else if(k==='sleep'){c.fillStyle='#2a1a11';c.font='bold 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('Z',-2,1);c.font='bold 7px system-ui';c.fillText('z',4,-3)}
 else if(k==='sick'){c.fillStyle='#7ab648';c.beginPath();c.arc(0,0,4.6,0,7);c.fill();c.fillStyle='#2a1a11';c.fillRect(-2.4,-1.6,1.4,1.4);c.fillRect(1,-1.6,1.4,1.4);c.fillRect(-2,2,4,1)}
 c.restore()}
function render(){const cv=$('c'),w=vw(),h=vh();window.outerClamp&&outerClamp();dpr=Math.min(1.5,devicePixelRatio||1)*QS;if(cv.width!=Math.round(w*dpr)||cv.height!=Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
if(cv.style.width!==w+'px'||cv.style.height!==h+'px'){cv.style.width=w+'px';cv.style.height=h+'px'}
const c=cv.getContext('2d');window.g=c;c.setTransform(1,0,0,1,0,0);c.fillStyle='#14210f';c.fillRect(0,0,cv.width,cv.height);c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
if(SHK>0)c.translate((Math.random()-.5)*SHK*14,(Math.random()-.5)*SHK*14);if(window.drawOuter)drawOuter(c);if(dirtyT){TC=terr();dirtyT=0}/* Extiende visualmente el terreno hasta el borde inferior de la pantalla: el mundo isométrico original es más bajo que algunas pantallas panorámicas. */if(TC&&!window.drawOuter){const extra=Math.max(0,vh()/cam.z-TC.height);if(extra>0){const band=Math.min(72,Math.floor(TC.height*.12));const sourceY=Math.max(0,Math.min(TC.height-band,Math.floor(TC.height*.42)));c.drawImage(TC,0,sourceY,TC.width,band,-N*32,TC.height,TC.width,extra)}}{const viewH=vh()/cam.z,B=window.outerBounds;if(B){cam.y=cl(cam.y,B.y0,Math.max(B.y0,B.y1-viewH));cam.x=cl(cam.x,B.x0,Math.max(B.x0,B.x1-vw()/cam.z))}else cam.y=cl(cam.y,0,Math.max(0,TC.height-viewH));const viewW=vw()/cam.z,x0=Math.max(cam.x-12,-N*32),y0=Math.max(cam.y-12,0),x1=Math.min(cam.x+viewW+12,N*32),y1=Math.min(cam.y+viewH+12,TC.height);if(x1>x0&&y1>y0)c.drawImage(TC,x0+N*32,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0)}drawBuildGrid(c);ambientFX(c);
if(window.drawOil)drawOil(c);const L=[];S.bld.forEach(b=>{if(b.type!='road'&&BT[b.type]&&vis(b.x+b.w/2,b.y+b.h/2,140+(b.w+b.h)*22))L.push([b.x+b.w-1+b.y+b.h-1+.5,()=>{if(window.bCache&&bCache(c,b))mir(c,b,(c,bb)=>buildingLifeFX(c,bb));else{shB(c,b);mir(c,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb);buildingLifeFX(c,bb)})}}])});
S.obs.forEach(o=>{if(vis(o.x+.5,o.y+.5,60))L.push([obsKey(o),()=>obsSpr(c,o)])});
const OC=[];const inU=new Set(U.map(u=>u.p));S.ppl.forEach(p=>{if(p.away||p.inside||inU.has(p)||!vis(p.x,p.y,90))return;const f=()=>{FL=hitD(p,p.hp,'#c22');const fgt=T-(p.fg||-9)<.35,idl=!p.job&&!p.mv&&!horde&&!fgt,tt=S.dayT/600,ACT=fgt?8:(horde&&p.mv)?3:idl&&(tt>.78||tt<.03)?11:idl&&((tt>.4&&tt<.46)||(tt>.62&&tt<.68))?12:idl&&(p.id%3==0)?13:(p.job&&!p.mv&&!horde?1:0);EXP=ACT==11?'sleep':expOf(p,fgt);SXF=p.sex==='F'?1:0;OLDF=p.age>=55?1:0;KIDF=p.age<18?1:0;WPN=p.wp?p.wp.n:'';fig(p.x,p.y,(p.look&&p.look.shirt)||PC[p.prof],(p.sex==='F'?.85:.9)*(p.age<6?.6:p.age<18?.78:1),p.mv,(p.look&&p.look.skin)||0,p.arm||p.wp,p.dx,p.arm||p.prof,ACT,p.id,(p.look&&p.look.hair),!!(p.gear&&p.gear.armor),!!(p.gear&&p.gear.pack));if(p.preg&&window.pregBadge){const q=P(p.x,p.y);pregBadge(c,q[0]+9,q[1]-36,5.2)}else if(p.age<18&&window.kidBadge){const q=P(p.x,p.y);kidBadge(c,q[0]+8,q[1]-30,5,p.age<6)}drawSurvivorWear(c,p);{const q=P(p.x,p.y),oc=occl(p),bk=oc?0:ACT==11?'sleep':needOf(p);if(bk)drawBub(c,q[0]+(ACT==11?-8:0),q[1]-(ACT==11?36:55),bk);if(p.hp<mhp(p)-1&&!oc){c.fillStyle='#400';c.fillRect(q[0]-9,q[1]-45,18,3.4);c.fillStyle='#4e4';c.fillRect(q[0]-9,q[1]-45,18*cl(p.hp/mhp(p),0,1),3.4)}}};L.push([dk(p.x,p.y),f])});
Z.forEach(z=>vis(z.x,z.y,90)&&L.push([dk(z.x,z.y),()=>{const t=ZT[z.t],s=1;FL=hitD(z,z.hp,'#6f8f35');if(z.t==='b'||z.t==='k'||z.t==='p'){z.sd=z.sd||1+Math.floor(Math.random()*90);EXP='angry';SXF=0;OLDF=0;KIDF=0;window.BCOL=(z.band&&window.BANDS&&BANDS[z.band])?BANDS[z.band].col:null;fig(z.x,z.y,'#5b3d2a',z.t==='k'?1.1:1,1,'#d8a878',1,z.dx,'ban',z.at?4:0,z.sd);window.BCOL=null;window.drawBandit&&drawBandit(c,z)}else if(window.ZX&&ZX.has(z.t))ZX.dh(c,z);else{SXF=0;OLDF=0;KIDF=0;ZV=z.t==='f'?3:z.t==='s'?4:z.t==='r'?7:0;fig(z.x,z.y,t.c,z.t==='f'?1.12:z.t==='r'?.97:1,1,'#9bb27a',0,z.dx,'zom',z.at?2:(z.t==='r'?3:0),0);if(z.t==='z')drawZombieWear(c,z)}if(z.act&&z.hp<z.mhp){const q=P(z.x,z.y);c.fillStyle='#400';c.fillRect(q[0]-10,q[1]-(window.ZX?ZX.bh(z.t):46)*s,20,3.4);c.fillStyle='#e33';c.fillRect(q[0]-10,q[1]-(window.ZX?ZX.bh(z.t):46)*s,20*z.hp/z.mhp,3.4)}}]));
U.forEach(u=>vis(u.x,u.y,90)&&L.push([dk(u.x,u.y),()=>{FL=hitD(u,u.hp,'#c22');if(u.mv&&Math.random()<.15)burst(u.x,u.y,1,'#a89a80',.6,2);EXP=u.cd>.55?'angry':'scared';SXF=u.p.sex==='F'?1:0;OLDF=u.p.age>=55?1:0;KIDF=u.p.age<18?1:0;WPN=u.p.wp?u.p.wp.n:'';fig(u.x,u.y,u.p.ally?'#3f6a8f':'#4a7a3a',1,u.mv,0,1,u.dx,u.p.arm,T-(u.hl||-9)<.35?9:T-(u.rp||-9)<.35?10:u.mv?3:(u.cd>.55?4:5),u.p.id);const q=P(u.x,u.y);c.fillStyle='#040';c.fillRect(q[0]-9,q[1]-45,18,3.4);c.fillStyle='#4e4';c.fillRect(q[0]-9,q[1]-45,18*cl(u.hp/mhp(u.p),0,1),3.4)}]));
DEAD.forEach(d=>vis(d.x,d.y,90)&&L.push([d.x+d.y-.3,()=>{const q=P(d.x,d.y),f=Math.min(1,d.t);FP=Math.min(1,d.t/.45);FL=0;g.save();g.globalAlpha=d.t>9?Math.max(0,1-(d.t-9)/3):1;g.fillStyle=d.zom?'rgba(60,90,30,.55)':'rgba(120,10,10,.6)';g.beginPath();g.ellipse(q[0],q[1],9*f*d.s,4*f*d.s,0,0,7);g.fill();EXP='hurt';SXF=0;OLDF=0;KIDF=0;ZV=d.zv||0;fig(d.x,d.y,d.col,d.s,0,d.skin,0,d.dx,d.zom?'zom':d.role,6,d.id);g.restore()}]));
cleanerUnits.forEach(u=>{if(!vis(u.x,u.y,100))return;L.push([u.x+u.y+.02,()=>{SXF=0;OLDF=0;KIDF=0;const act=u.work>0?8:(u.mv?3:1);fig(u.x,u.y,'#d6bd36',.92,!!u.mv,'#e8b88a',0,u.dx,'Constructor',act,u.id,'#49321d',false,true);const q=P(u.x,u.y);if(u.work>0){g.save();g.strokeStyle='#f5df65';g.lineWidth=2;g.beginPath();g.arc(q[0],q[1]-19,5+Math.sin(T*12)*2,0,Math.PI*2);g.stroke();g.restore();}}])});
L.sort((a,b)=>a[0]-b[0]).forEach(l=>l[1]());drawPT(c);
FX.forEach(f=>{if(f.boom){const q=P(f.x,f.y);const rr=60*(.6-f.t)+14,gr=c.createRadialGradient(q[0],q[1]-10,1,q[0],q[1]-10,rr);gr.addColorStop(0,'rgba(255,255,200,'+Math.min(1,f.t*2)+')');gr.addColorStop(.4,'rgba(255,150,40,'+f.t+')');gr.addColorStop(1,'rgba(120,40,0,0)');c.fillStyle=gr;c.beginPath();c.arc(q[0],q[1]-10,rr,0,7);c.fill()}else{const a=P(...f.a),b=P(...f.b);c.shadowColor=f.col;c.shadowBlur=10;c.strokeStyle=f.col;c.lineWidth=2.5;c.beginPath();c.moveTo(a[0],a[1]-16);c.lineTo(b[0],b[1]-10);c.stroke();c.shadowBlur=0}});
if(placing){const p=placing,ok=placeValid(),a=P(p.x,p.y),b=P(p.x+p.w,p.y),d=P(p.x+p.w,p.y+p.h),e=P(p.x,p.y+p.h);c.save();poly(c,[a,b,d,e],ok?'rgba(55,225,85,.24)':'rgba(245,55,55,.28)');c.strokeStyle=ok?'#53ff72':'#ff514d';c.lineWidth=3;c.setLineDash([7,4]);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.stroke();c.setLineDash([]);mir(c,{type:p.t,x:p.x,y:p.y,w:p.w,h:p.h,lvl:1,hp:1,rot:(p.rot||0)%4,cl:p.cl||0,rf:p.rf||0,ex:p.ex||0},(c,bb)=>drawB(c,bb,.72));c.restore();if(allCells(p).length>(p.drag&&p.drag.length==1&&!(p.plan||[]).length?1:0))dragPrev(c,p)}
apoFX(c,cv);lightFX(c,cv);advDamageFX(c);advWeatherFX(c,cv);if(horde&&horde.night){c.setTransform(1,0,0,1,0,0);c.fillStyle='rgba(10,10,50,.3)';c.fillRect(0,0,cv.width,cv.height)}}
/* ================= ENTRADA ================= */
const scr2g=(sx,sy)=>{const wx=sx/cam.z+cam.x,wy=sy/cam.z+cam.y;return{x:(wx/32+wy/16)/2,y:(wy/16-wx/32)/2}};
/* Orden de dibujo: quien está justo delante (este o sur) de un edificio se pinta encima de él aunque x+y sea menor que la clave del edificio */
function dk(x,y){let k=x+y;for(const b of S.bld){if(b.type=='road'||b.type=='bridge')continue;const kb=b.x+b.w-1+b.y+b.h-1+.5;if(k>=kb)continue;if((x>=b.x+b.w&&y>=b.y-.5&&y<=b.y+b.h)||(y>=b.y+b.h&&x>=b.x-.5&&x<=b.x+b.w))k=kb+.01}return k}
/* ¿Hay un edificio por delante que pueda tapar a esta persona? Se redibuja translúcida encima para que nunca desaparezca */
function occl(p){const k=p.x+p.y;for(const b of S.bld){if(b.type=='road'||b.type=='bridge')continue;const kb=b.x+b.w-1+b.y+b.h-1+.5;if(kb<=k)continue;const rise=Math.min(8,(BT[b.type].z||20)/16+1.5);if(p.x<b.x+b.w+.3&&p.y<b.y+b.h+.3&&p.x>b.x-rise&&p.y>b.y-rise)return true}return false}
function centerOn(x,y){const p=P(x,y);cam.x=p[0]-vw()/2/cam.z;cam.y=p[1]-vh()/2/cam.z}
function zoomBy(k,cx,cy){cx=cx===undefined?vw()/2:cx;cy=cy===undefined?vh()/2:cy;const wx=cx/cam.z+cam.x,wy=cy/cam.z+cam.y;cam.z=cl(cam.z*k,.35,2.2);cam.x=wx-cx/cam.z;cam.y=wy-cy/cam.z}
function hitB(sx,sy){const wx=sx/cam.z+cam.x,wy=sy/cam.z+cam.y;const l=S.bld.filter(b=>b.type!='road').sort((a,b)=>(b.x+b.w+b.y+b.h)-(a.x+a.w+a.y+a.h));for(const b of l){const z=BT[b.type].z;for(const f of [1,.75,.5,.25,0]){const y2=wy+z*f,gx=(wx/32+y2/16)/2,gy=(y2/16-wx/32)/2;if(gx>=b.x&&gx<b.x+b.w&&gy>=b.y&&gy<b.y+b.h)return b}}return null}
function tap(sx,sy){const b=hitB(sx,sy);if(b)return bPanel(b.id);const g2=scr2g(sx,sy),x=Math.floor(g2.x),y=Math.floor(g2.y),o=S.obs.findIndex(q=>q.x==x&&q.y==y);
if(o>=0){if(!inOwn(x,y,0))return toast('Fuera de tu territorio.');const ob=S.obs[o],col=1+S.ppl.filter(p=>p.prof=='Recolector').length*.2;
 if(ob.t=='v'){if(!ob.l){const m=lootWreck(ob);sfx('rock');toast('Registras los restos del vehículo: '+m);save();return}S.res.metal=Math.min(cap(),S.res.metal+Math.round(3*col));toast('Retiras los restos ya saqueados.');sfx('rock')}
 else if(ob.t=='t'){S.res.wood=Math.min(cap(),S.res.wood+Math.round(8*col));sfx('tree')}
 else{S.res.metal=Math.min(cap(),S.res.metal+Math.round(6*col));sfx('rock')}
 S.obs.splice(o,1);S.dh++;rebuild()}}
let dr=null,pts=new Map();const cv0=$('c');
cv0.onpointerdown=e=>{tg(0);cv0.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size==2){const[a,b]=[...pts.values()];dr={pinch:1,d:Math.hypot(a[0]-b[0],a[1]-b[1])};return}hide();dr={sx:e.clientX,sy:e.clientY,cx:cam.x,cy:cam.y,mv:0};if(placing){updatePlacementFromScreen(e.clientX,e.clientY);dr.pl=1;if(placing.paint&&!window.dragOff)placing.drag=[[placing.x,placing.y]]}};
cv0.onpointermove=e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(!dr)return;if(dr.pinch){if(pts.size<2)return;const[a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);zoomBy(d/dr.d,(a[0]+b[0])/2,(a[1]+b[1])/2);dr.d=d;return}
if(dr.pl){updatePlacementFromScreen(e.clientX,e.clientY);if(placing&&placing.paint&&placing.drag){dragCells(placing,placing.x,placing.y);if(placing.drag.length>1)fbar()}return}
const dx=e.clientX-dr.sx,dy=e.clientY-dr.sy;if(Math.hypot(dx,dy)>6)dr.mv=1;if(dr.mv){cam.x=dr.cx-dx/cam.z;cam.y=dr.cy-dy/cam.z}};
cv0.onpointerup=cv0.onpointercancel=e=>{pts.delete(e.pointerId);if(!dr)return;if(dr.pinch){if(!pts.size)dr=null;return}if(dr.pl&&placing&&placing.paint)endSeg();if(!dr.mv&&!dr.pl)tap(e.clientX,e.clientY);dr=null};
cv0.onwheel=e=>{e.preventDefault();zoomBy(e.deltaY<0?1.12:.89,e.clientX,e.clientY)};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key=='Escape'){endPlace();hide()}if(e.key.toLowerCase()=='r'&&placing&&!placing.paint)rotP();if(e.key=='Enter'&&placing&&!placing.paint)confirmP();if(e.key=='+')zoomBy(1.15);if(e.key=='-')zoomBy(.87)});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
/* ================= DEAD TOWN 2 · SISTEMAS AVANZADOS ================= */
const ADV_WEATHER=[['Despejado','El aire está quieto. Buena visibilidad.',1],['Lluvia','La lluvia embarra los caminos: los viajes de las expediciones duran un 20 % más.',.92],['Niebla','La niebla espesa dificulta detectar amenazas: las torres y tiradores tienen un 20 % menos de alcance.',.82],['Tormenta','La tormenta reduce un 25 % la madera, el metal, la piedra y la energía solar que se produce al aire libre (aserraderos, desguaces, canteras y placas solares), y los enemigos de las misiones son un 15 % más duros. La comida y el agua no se ven afectadas.',.75]];
function advInit(){S.adv=S.adv||{weather:0,weatherLeft:150,events:0,landmarks:[],clues:[],repairs:0,missionHeat:0};if(!Array.isArray(S.adv.landmarks)||!S.adv.landmarks.length){const names=['Hospital de campaña','Estación de radio','Depósito ferroviario','Refugio del puente','Laboratorio municipal'];S.adv.landmarks=names.slice(0,4).map((n,i)=>({name:n,done:0,kind:i,day:ri(2,5)}))} }
function advWeatherName(){advInit();return ADV_WEATHER[S.adv.weather||0][0]}
function advEvent(){advInit();const a=S.adv;const events=[
()=>{const n=Math.min(35,Math.max(8,Math.round(S.res.food*.08)));S.res.food+=n;return 'Una caravana aparece en la carretera. Los comerciantes dejan '+n+' unidades de comida.'},
()=>{S.res.water=Math.max(0,S.res.water-18);S.ppl.forEach(p=>p.mor=Math.max(0,p.mor-3));return 'Un depósito contaminado obliga a desechar 18 unidades de agua.'},
()=>{const n=Math.min(3,S.ppl.filter(p=>!p.away).length);S.ppl.filter(p=>!p.away).slice(0,n).forEach(p=>p.hp=Math.min(mhp(p),p.hp+10));return 'Una noche de historias alrededor del fuego: varios supervivientes descansan (+10 de salud).'},
()=>{S.res.metal+=12;return 'Un grupo de chatarreros comparte material recuperado: +12 metal.'},
()=>{S.res.ammo=Math.max(0,(S.res.ammo||0)-15);return 'Una falsa alarma: los vigías disparan a las sombras y gastan munición (-15).'},
()=>{S.adv.missionHeat=(S.adv.missionHeat||0)+1;return 'Se detectan señales de una horda cerca del perímetro. La próxima incursión será más peligrosa.'}
];const msg=events[ri(0,events.length-1)]();a.events++;toast('Suceso del asentamiento: '+msg);return msg}
function advLandmarksMenu(){advInit();const a=S.adv;let h='<p>Expediciones cortas a puntos de interés descubiertos en los alrededores. Cada lugar solo puede registrarse una vez.</p>';h+=a.landmarks.map((q,i)=>`<section style="border:1px solid #52634a;border-radius:8px;padding:8px;margin:7px 0;background:#20291e"><b>${q.name}</b><p>${q.done?'Lugar agotado.':q.day>S.day?'Señales recientes; estará accesible a partir del día '+q.day+'.':'Hay suministros y pistas. Coste: 8 comida y 5 munición.'}</p>${btn(q.done?'Registrado': 'Explorar',`advExplore(${i})`,!!q.done||q.day>S.day||S.res.food<8||S.res.ammo<5)}</section>`).join('');h+=`<p><b>Pistas reunidas:</b> ${(a.clues||[]).length}/4</p>`;show('Lugares especiales',h)}
function advExplore(i){advInit();const q=S.adv.landmarks[i];if(!q||q.done||q.day>S.day||S.res.food<8||S.res.ammo<5)return;S.res.food-=8;S.res.ammo-=5;q.done=1;const rewards=[()=>{S.res.meds+=12;return '+12 medicinas.'},()=>{S.res.metal+=24;return '+24 metal.'},()=>{S.res.ammo+=22;return '+22 munición.'},()=>{S.res.wood+=30;return '+30 madera.'},()=>{S.res.scrap=(S.res.scrap||0)+35;return '+35 chatarra.'}];const msg=rewards[i%rewards.length]();S.adv.clues.push(q.name);S.stat.exps=(S.stat.exps||0)+1;S.adv.missionHeat=Math.max(0,(S.adv.missionHeat||0)-1);save();advLandmarksMenu();toast('Exploración completada: '+q.name+'. '+msg+' Has encontrado una pista sobre el origen del brote.')}
function advRepairMenu(){return advMenu();const items=[];S.ppl.forEach(p=>{if(p.wp&&typeof p.wp==='object'){p.wp.durability=p.wp.durability===undefined?100:p.wp.durability;items.push({p,w:p.wp})}});let h='<p>El equipo armado pierde eficacia con el uso. Repara armas antes de una nueva horda.</p>';h+=items.length?items.map(x=>`<p><b>${x.p.n}</b> · ${x.w.n} · Durabilidad ${Math.round(x.w.durability)}%</p>${btn('Reparar (6 metal)',`advRepair(${x.p.id})`,S.res.metal<6||x.w.durability>=100)}`).join(''):'<p>No hay armas individuales equipadas que necesiten mantenimiento. Las armas de inventario se conservan.</p>';show('Mantenimiento de armas',h)}
function advRepair(id){const p=byId(id);if(!p||!p.wp||S.res.metal<6)return;S.res.metal-=6;p.wp.durability=100;S.adv.repairs=(S.adv.repairs||0)+1;toast('Arma de '+p.n+' reparada.');advRepairMenu()}
function advMenu(){advInit();show('Centro de operaciones',`<p><b>Clima actual:</b> ${advWeatherName()}</p><p>${ADV_WEATHER[S.adv.weather||0][1]}</p><p><b>Incidentes registrados:</b> ${S.adv.events||0} · <b>Reparaciones:</b> ${S.adv.repairs||0}</p>${btn('Explorar lugares especiales','advLandmarksMenu()')}${btn('Mantenimiento de armas','advRepairMenu()')}<p><b>Historia recuperada:</b> ${(S.adv.clues||[]).join(' · ')||'Aún no hay pistas.'}</p>`)}
function advTick(dt){advInit();const a=S.adv;a.weatherLeft-=dt;if(a.weatherLeft<=0){{const W=[[0,80],[1,13],[2,8],[3,7]].filter(x=>x[0]!==a.weather),tot=W.reduce((s,x)=>s+x[1],0);let r=Math.random()*tot;a.weather=W[W.length-1][0];for(const x of W){if(r<x[1]){a.weather=x[0];break}r-=x[1]}}a.weatherLeft=a.weather===3?120+Math.random()*60:a.weather===0?210+Math.random()*90:a.weather===2?180+Math.random()*70:180+Math.random()*120;toast('Cambio de tiempo: '+advWeatherName()+'. '+ADV_WEATHER[a.weather][1])}}
function advDaily(){advInit();if(Math.random()<.72)advEvent();const a=S.adv;a.landmarks.forEach(q=>{if(!q.done&&q.day>S.day&&Math.random()<.12)q.day=Math.max(S.day,q.day-1)});0}
function advWeatherFX(c,cv){advInit();const w=S.adv.weather||0;if(w===0)return;c.save();c.setTransform(1,0,0,1,0,0);if(w===2){c.fillStyle='rgba(145,160,175,.12)';c.fillRect(0,0,cv.width,cv.height)}if(w===1||w===3){c.strokeStyle=w===3?'rgba(180,205,220,.28)':'rgba(175,195,210,.2)';c.lineWidth=1;const count=Math.min(170,Math.floor(cv.width/7));for(let i=0;i<count;i++){const x=(i*83+T*(w===3?430:260))%(cv.width+80)-40,y=(i*137+T*(w===3?680:430))%(cv.height+60)-30;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+13);c.stroke()}}if(w===3){c.fillStyle='rgba(30,40,55,.12)';c.fillRect(0,0,cv.width,cv.height)}c.restore()}
function advDamageFX(c){if(!S||!S.bld)return;S.bld.forEach(b=>{if(b.type==='road'||b.hp/mxhp(b)>.62||!vis(b.x+b.w/2,b.y+b.h/2,80))return;const q=P(b.x+b.w/2,b.y+b.h/2);c.save();c.strokeStyle='rgba(30,20,15,.65)';c.lineWidth=1.5;c.beginPath();c.moveTo(q[0]-7,q[1]-10);c.lineTo(q[0]-2,q[1]-3);c.lineTo(q[0]-5,q[1]+2);c.moveTo(q[0]+5,q[1]-6);c.lineTo(q[0]+1,q[1]+1);c.stroke();c.restore()})}

/* ================= BUCLE ================= */
let villagerAudioClock=0,zombieAudioClock=0,footstepAudioClock=0;
function upd(dt){if(S&&S.ppl)for(const p of S.ppl)p.mor=85;/* sin sistema de moral: valor fijo */if(S.over||($('titleScreen')&&$('titleScreen').style.display!=='none'))return;updPT(dt);advTick(dt);updateCleaners(dt);
villagerAudioClock-=dt;zombieAudioClock-=dt;footstepAudioClock-=dt;
if(SND&&cam.z>=1.15&&footstepAudioClock<=0){const cx=cam.x+vw()/(2*cam.z),cy=cam.y+vh()/(2*cam.z);const moving=S.ppl.some(p=>!p.away&&p.mv&&(()=>{const q=P(p.x,p.y);return Math.hypot(q[0]-cx,q[1]-cy)<150})());if(moving){sfx('foot');footstepAudioClock=.48}else footstepAudioClock=.2}
if(horde&&Z.some(z=>z.act)&&zombieAudioClock<=0){{const zv=Z.filter(z=>z.act),z=zv[Math.floor(Math.random()*zv.length)];if(z)sfxAt((z.t==='b'||z.t==='k'||z.t==='p')?'bshout':'zombie',z.x,z.y,{floor:.15});zombieAudioClock=Math.max(.8,3.4-zv.length*.07)+Math.random()*1.6}}
const sp=500*dt/cam.z;if(keys.a||keys.arrowleft)cam.x-=sp;if(keys.d||keys.arrowright)cam.x+=sp;if(keys.w||keys.arrowup)cam.y-=sp;if(keys.s||keys.arrowdown)cam.y+=sp;
const inU=new Set(U.map(u=>u.p));S.ppl.forEach(p=>{if(p.away||inU.has(p))return;if(!horde&&p.inside){p.inside=0;const h0=S.bld.find(b=>b.type==='hall');if(h0){p.x=p.tx=h0.x+h0.w/2;p.y=p.ty=h0.y+h0.h+.9}}if(horde&&(p.preg||p.age<18||!p.wp)){if(p.inside){p.mv=0;return}const h=S.bld.find(b=>b.type==='hall')||{x:26,y:26,w:3,h:3},dx=h.x+h.w/2,dy=h.y+h.h+.8;if(Math.hypot(dx-p.x,dy-p.y)<1.1){p.inside=1;p.mv=0;return}p.tx=dx;p.ty=dy;p.mv=1;if(!pstep(p,dx,dy,2.1*dt)){step(p,dx,dy,2.1*dt)}return}if(horde){const b0=bm[p.job];if(p.wp&&b0&&BT[b0.type].gun){p.mv=0;return}
/* civiles con arma sin alistar: junto al ayuntamiento atacan a lo que se acerque a ≤4 casillas; de camino solo se defienden si lo tienen encima (≤2) */
const hh0=S.bld.find(q=>q.type==='hall'),nearH=!hh0||Math.hypot(p.x-(hh0.x+hh0.w/2),p.y-(hh0.y+hh0.h+1.3))<3.2;
let zn=null,zd=nearH?4:2;Z.forEach(z=>{if(!z.act)return;const dd=Math.hypot(z.x-p.x,z.y-p.y);if(dd<zd&&!wallBetween(p.x,p.y,z.x,z.y)){zd=dd;zn=z}});
if(!zn){/* sin zombis a la vista: se refugian junto al ayuntamiento */
 const h=S.bld.find(q=>q.type==='hall')||{x:26,y:26,w:3,h:3},k=(p.id||0)%6;p.resting=0;p.tx=h.x+h.w/2+((k%3)-1)*1.2;p.ty=h.y+h.h+1.3+Math.floor(k/3)*1.1;if(Math.hypot(p.tx-p.x,p.ty-p.y)>.35){p.mv=1;if(!pstep(p,p.tx,p.ty,1.7*dt))p.mv=0}else p.mv=0;return}
if(zn){p.dx=zn.x-p.x;if(p.hp<=35){p.tx=cl(p.x-(zn.x-p.x)*3,OB().x0,OB().x1-1);p.ty=cl(p.y-(zn.y-p.y)*3,OB().y0,OB().y1-1);p.mv=1;step(p,p.tx,p.ty,1.9*dt)}else if(zd>1.05){p.mv=1;step(p,zn.x,zn.y,1.7*dt)}else{p.mv=0;p.fg=T;if(!p.pa||T-p.pa>.5){p.pa=T;sfxAt(p.wp&&/pistola|revólver|escopeta|rifle|carabina|subfusil|ballesta|fusil/i.test(p.wp.n||'')?'pistol':'punch',p.x,p.y)}zn.hp-=(2+p.sk*.4+p.lvl*.2+(p.wp&&p.wp.v?p.wp.v*.5:0))*dt}return}}if(p.resting){p.resting=0;p.tx=p.x;p.ty=p.y}if(Math.hypot(p.tx-p.x,p.ty-p.y)<.15){p.mv=0;if(Math.random()<dt*.7){const b=bm[p.job];let a,c2,k=0;do{if(b){a=b.x+rn(-.5,b.w+.5);c2=b.y+b.h+rn(.2,1)}else{a=rn(OB().x0+1,OB().x1-1);c2=rn(OB().y0+1,OB().y1-1)}k++}while((occ[cl(Math.floor(c2),0,N-1)*N+cl(Math.floor(a),0,N-1)]>0||(!b&&!ownP(a,c2)))&&k<25);p.tx=a;p.ty=c2}}else{p.mv=1;if(!pstep(p,p.tx,p.ty,1.1*dt)){p.mv=0;p.tx=p.x;p.ty=p.y;p.nopath=T}else if(p.path&&!p.path.length&&occ[cl(Math.floor(p.ty),0,N-1)*N+cl(Math.floor(p.tx),0,N-1)]>0&&window.pathBlocked&&pathBlocked(Math.floor(p.tx),Math.floor(p.ty))){/* su destino quedó dentro de un edificio: ya está lo más cerca posible, elige otro sitio */p.tx=p.x;p.ty=p.y}}});
FX.forEach(f=>f.t-=dt);FX=FX.filter(f=>f.t>0);
if(Z.length)combat(dt);$('alert').style.display=horde?'block':'none';if(horde)$('alert').textContent=horde.name+' · enemigos: '+Z.filter(z=>z.act).length;if(!fading){for(const r in IV){S.tm[r]=(S.tm[r]||0)+dt;if(S.tm[r]>=IV[r]){S.tm[r]-=IV[r];resTick(r,IV[r])}}if(!horde){S.dayT+=dt;if(S.dayT>=600){S.dayT=0;nextDay()}}}}
var QS=1,fa=16,qt=0,qg=0;let last=performance.now(),hu=0;function frame(n){/* hasta que no se han cargado todos los scripts no se dibuja ni se simula (antes daba errores de tipos de edificio aún sin definir durante el primer segundo) */if(!window.__ATS_READY){last=n;requestAnimationFrame(frame);return}const raw=n-last,dt=Math.min(.05,raw/1000);last=n;if(raw<250){fa+=(raw-fa)*.05;qt+=raw;if(qt>1500){qt=0;if(fa>30&&QS>.75){/* mínimo 75 % de resolución: antes bajaba hasta el 50 % y se veía borroso */QS=Math.max(.75,QS-.15);qg=0}else if(fa<19&&QS<1){if(++qg>=4){QS=Math.min(1,QS+.1);qg=0}}else qg=0}}T+=dt;try{upd(dt)}catch(er){frErr(er,'upd')}try{render()}catch(er){frErr(er,'render')}hu-=dt;if(hu<=0){hu=.4;try{hud()}catch(er){frErr(er,'hud')}}requestAnimationFrame(frame)}
var FE=0;function frErr(er,w){FE++;if(FE<4)console.error('frame '+w,er)}
var HS='';function hud(){RK.forEach(q=>{if(S.res[q[0]]==null)S.res[q[0]]=0;if(S.mode==='creativo'&&S.res[q[0]]<999999)S.res[q[0]]=999999});if(S.mode==='creativo')TECH.forEach(t=>{if(!S.tech[t[0]])S.tech[t[0]]=1});if(!S.matG&&window.MATK){S.matG=1;S.res.tarp+=40;S.res.stone+=30}const d=rate();const hs=`<div class="ch"><b>Ayunt. ${realHall()}</b></div><div class="ch">${({facil:"Fácil",normal:"Normal",dificil:"Difícil",apocaliptico:"Apocalíptico",creativo:"Creativo"})[S.mode||"normal"]}</div><div class="ch">Día ${S.day} · ${clockTxt()}</div><div class="ch">Pob. ${S.ppl.length}/${pcap()}</div><div class="ch">Poder ${armyPow()}</div>`+(window.powChip?powChip():'')+(window.rqList&&(!window.rpOn||rpOn())?`<div class="ch" onclick="techMenu()" style="cursor:pointer;pointer-events:auto">🔬 ${Math.floor(S.res.rp||0)}${rqList().length?' · '+rqList().length+'▸':''}</div>`:'');if(hs!==HS){HS=hs;$('top').innerHTML=hs}const hb=$('top').offsetHeight+4;$('rail').style.top=hb+'px';$('log').style.top=(hb+2)+'px';$('alert').style.top=hb+'px'}
if(!load())newGame();syncCleanerUnits();advInit();
cam.z=Math.max(.5,Math.min(1,vw()/900));{const hh=S.bld.find(b=>b.type=='hall')||{x:26,y:26};centerOn(hh.x+2,hh.y+2)}setInterval(saveIdle,20000);addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
$('titleScreen').style.display='flex';if(!localStorage.getItem(KEY))$('continueBtn').disabled=true;setTimeout(()=>toast('Bienvenido a After the Silence. Elige una partida para comenzar.'),500);requestAnimationFrame(frame);
