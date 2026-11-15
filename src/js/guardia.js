/* ===== La Guardia del Alba: poblado aliado grande, reputación, intendencia, armería, enfermería, comedor y encargos ===== */
(function(){
const VUI=window.villaUI,A=window.villaApi;if(!VUI||!A)return;
const RANKS=['Desconocido','Aliado','Confiable','Honrado','Hermano de armas'],RT=[0,30,90,200,380];
const CB='#3f6a8f';
const pk=a=>a[Math.floor(Math.random()*a.length)],ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const unlocked=()=>S.mode==='creativo'||(S.story||0)>=8;
function gd(){if(!S.gd)S.gd={rep:0,met:0,day:-1,stock:{},don:0,tb:null,meal:-1};return S.gd}
const rank=()=>{const r=gd().rep;let k=0;RT.forEach((t,i)=>{if(r>=t)k=i});return k};
const disc=()=>1-.04*rank();
const fich=()=>A.st().f;
function rep(n){const g=gd(),k0=rank();g.rep=Math.max(0,g.rep+n);const k1=rank();try{window.notify&&notify('🛡','Guardia del Alba','+'+n+' de reputación'+(k1>k0?' · ¡Nuevo rango: '+RANKS[k1]+'!':''),'villa')}catch(e){}if(k1>k0)toast('🛡 Nuevo rango con la Guardia: '+RANKS[k1])}
function refresh(){const g=gd();if(g.day===S.day)return;g.day=S.day;g.don=0;
 const it={food:[40,90],water:[40,90],wood:[30,80],metal:[20,50],meds:[8,20],ammo:[15,40],plank:[10,30]};g.stock={};Object.keys(it).forEach(k=>g.stock[k]=Math.round(ri(it[k][0],it[k][1])/5)*5)}
const V={wood:1,metal:2,meds:5,ammo:3,plank:3};
const buyP=k=>Math.max(1,Math.ceil(V[k]*1.25*disc()));
const sellP=k=>Math.max(1,Math.round(V[k]*.6*(1+.03*rank())*10)/10);
const NM=k=>(typeof NAME==='function'?NAME(k):k);
const NPCS={
 valeria:{n:'Presidenta Valeria',role:'Presidenta de la Guardia del Alba',ic:'🛡',col:CB,say:[['No te conozco. Aquí se gana el respeto, no se pide.','Mantenemos esta línea desde el primer día. ¿Vienes a ayudar o a mirar?'],['Algunos de los míos hablan bien de ti. Sigue así.','La Guardia protege a quien protege a los demás.'],['Cuentas con nuestra confianza. No es poco.','Los bandidos son cada vez más osados. Necesitamos aliados.'],['Eres uno de los nuestros, casi.','Cuando llegue lo peor, tu base tendrá nuestro apoyo.'],['Hermano de armas. Mi puerta siempre está abierta para ti.','El Alba no se rinde. Y tú tampoco.']]},
 mateo:{n:'Mateo',role:'Intendente',ic:'📦',col:'#8a7a56',say:[['Todo está racionado. Pago lo justo.','Las cuentas claras. Sin favores.'],['Para ti, precio de aliado.','Hoy ha llegado un cargamento. Mira el estante.'],['Un buen proveedor es oro.','Si te sobra algo, aquí lo compro.'],['Para un amigo, lo mejor de la despensa.','Nadie pasa hambre mientras yo lleve las cuentas.'],['Tú no pagas, compartes. O casi.','Lo que necesites, dímelo.']]},
 olmos:{n:'Sargento Olmos',role:'Armero',ic:'🔧',col:'#5a6a4a',say:[['Equipo reglamentario solo para quien lo merece.','Gánatelo.'],['Algo básico puedo ofrecerte.','Cuida el equipo y él te cuidará.'],['Ya puedes llevarte algo mejor.','Un chaleco bien ajustado salva vidas.'],['Lo mejor que tenemos, para ti.','Esto lo usan nuestros veteranos.'],['El equipo de élite es tuyo.','Hazlo valer.']]},
 reyes:{n:'Doctora Reyes',role:'Médica de la Guardia',ic:'⚕',col:'#d8e0de',say:[['Pasa, pero rápido. Hay mucho trabajo.','Cobro lo justo. Los suministros no sobran.'],['Te remendamos sin problema.','Las heridas infectadas son lo peor.'],['Para ti, atención prioritaria.','Descansa, comes y vuelves.'],['Siempre hay hueco para los tuyos.','Cuídate. Nos hacéis falta.'],['Hermano de armas. Hoy no cobro la revisión.','Que nadie muera si puedo evitarlo.']]},
 soler:{n:'Capitán Soler',role:'Oficial de operaciones',ic:'📋',col:CB,say:[['Tengo operaciones. Elige con cuidado.','Aquí no se juega.'],['Misiones de más confianza para ti.','Sale cada ficha de un informe real.'],['Operaciones serias. ¿Te atreves?','El éxito depende de todos.'],['Te confío lo importante.','El Alba cuenta contigo.'],['Mi mejor equipo es el tuyo.','Cuando quieras.']]},
 nina:{n:'Nina',role:'Cocinera',ic:'🍲',col:'#9a6a4a',say:[['¿Hambre? Siéntate.','Sopa caliente, sin preguntas.'],['Un plato caliente levanta cualquier ánimo.','Aquí todos comemos juntos.'],['Te guardo siempre el mejor trozo.','Los soldados hablan más cuando comen.'],['Para ti, doble ración.','Los rumores corren más que el viento.'],['Eres de la familia.','Siéntate y cuéntame.']]}};
const RUM=['Dicen que Los Cuervos han vuelto a mover gente por el norte.','Alguien vio a Las Víboras cortando la carretera del este.','CENIZA no pierde de vista a nadie. Mejor no hablar de ellos.','La emisora ha captado algo raro esta noche.','El Capitán Soler necesita más gente para sus patrullas.','Con buenas armaduras, los bandidos no son tan temibles.'];
const esc=s=>String(s).replace(/[<>&]/g,'');
const pips=g=>'●'.repeat(g)+'<span style="opacity:.25">'+'●'.repeat(Math.max(0,5-g))+'</span>';
const bk=`<button class="vl-back" onclick="hide()">← Salir del edificio</button>`;
function head(){const g=gd(),k=rank(),nx=RT[k+1],pr=nx?Math.min(100,(g.rep-RT[k])/(nx-RT[k])*100):100;
 return `<div class="mu-sts"><div class="mu-st"><span>🪙</span><b>${Math.floor(fich())}</b><small>Fichas</small></div><div class="mu-st"><span>🛡</span><b>${RANKS[k]}</b><small>${g.rep}${nx?' / '+nx:''} rep.</small></div></div><div style="height:6px;background:#0d120c;border-radius:4px;margin:2px 0 6px;overflow:hidden"><i style="display:block;height:100%;width:${pr}%;background:linear-gradient(90deg,#3f6a8f,#f2c542)"></i></div>`}
function npc(id){const n=NPCS[id],k=rank();return `<div class="vl-npc">${window.npcAv?npcAv(id,n,1):`<div class="vl-av" style="background:${n.col}">${n.ic}</div>`}<div><b>${n.n}</b><small>${n.role}</small><p>“${pk(n.say[k])}”</p></div></div>`}
const T=(t)=>'Guardia del Alba · '+t;
function lock(){show('La Guardia del Alba',`<div class="mu-empty"><span>🔒</span><b>La Guardia del Alba</b><small>Soldados con insignia dorada patrullan al norte. Aún no sabes cómo encontrarlos: avanza en la historia (capítulo 8).</small></div>`)}
function arrive(){const g=gd();if(g.met)return;g.met=1;rep(5);A.gain(60);toast('La Guardia te recibe: +60 fichas y +5 de reputación.');try{save()}catch(e){}}
/* ---- cuartel ---- */
const PERKS=['Sin ventajas aún.','Precios de intendencia −4%. Equipo básico.','Precios −8%. Equipo reforzado.','Precios −12%. Equipo avanzado y revisión con descuento.','Precios −16%. Equipo de élite y atención gratuita.'];
const DON=[['ammo',20,4,'Munición'],['meds',10,4,'Medicinas'],['food',40,3,'Comida'],['metal',30,3,'Metal']];
function cuartel(){const g=gd(),k=rank();
 show(T('Cuartel'),bk+head()+npc('valeria')+`<div class="vl-q"><div><b>${RANKS[k]}</b><small>${PERKS[k]}</small></div></div><div class="mu-h">Donar suministros <small>${g.don}/3 hoy</small></div><div class="vl-list">`+DON.map(([r,n,p,t])=>{const have=Math.floor(S.res[r]||0);return `<div class="vl-row"><div style="flex:1"><b>${t} ×${n}</b><small>Tienes ${have} · +${p} reputación</small></div><button ${have<n||g.don>=3?'disabled':''} onclick="guardiaDon('${r}',${n},${p})">Donar</button></div>`}).join('')+`</div><small class="mu-mut">También ganas reputación completando encargos del tablón de la Guardia.</small>`)}
window.guardiaDon=(r,n,p)=>{const g=gd();if(g.don>=3||(S.res[r]||0)<n)return;S.res[r]-=n;g.don++;rep(p);try{save()}catch(e){}guardiaGo('cuartel')};
/* ---- intendencia ---- */
let itab='buy';
function intend(t){if(t)itab=t;const g=gd(),k=rank();let rows;
 if(itab==='buy')rows=Object.keys(g.stock).filter(r=>g.stock[r]>0&&((r!=='ammo'&&r!=='meds')||k>=1)&&(r!=='plank'||k>=2)).map(r=>{const p=buyP(r),q=g.stock[r];return `<div class="vl-row"><img src="${ICO[r]}" width=20><div><b>${NM(r)}</b><small>Tienes ${Math.floor(S.res[r]||0)} · quedan ${q}</small></div><span class="vl-p">🪙 ${p}</span><button onclick="guardiaBuy('${r}',1)" ${fich()<p?'disabled':''}>×1</button><button onclick="guardiaBuy('${r}',10)" ${fich()<p*Math.min(10,q)?'disabled':''}>×10</button></div>`}).join('')||'<small class="mu-mut">Hoy no queda nada.</small>';
 else rows=Object.keys(V).filter(r=>!(window.NOSELL&&NOSELL.has(r))&&(S.res[r]||0)>=1).map(r=>{const p=sellP(r),h=Math.floor(S.res[r]);return `<div class="vl-row"><img src="${ICO[r]}" width=20><div><b>${NM(r)}</b><small>Tienes ${h}</small></div><span class="vl-p">🪙 ${p}</span><button onclick="guardiaSell('${r}',10)" ${h<10?'disabled':''}>×10</button><button onclick="guardiaSell('${r}',${h})">Todo</button></div>`}).join('')||'<small class="mu-mut">No tienes nada que vender.</small>';
 show(T('Intendencia'),bk+head()+npc('mateo')+`<div class="vl-tabs"><button class="${itab==='buy'?'on':''}" onclick="guardiaGo('intend','buy')">Comprar</button><button class="${itab==='sell'?'on':''}" onclick="guardiaGo('intend','sell')">Vender</button></div><div class="vl-list">${rows}</div>`)}
window.guardiaBuy=(r,n)=>{if(r==='food'||r==='water')return;const g=gd();n=Math.min(n,g.stock[r]||0);const p=buyP(r)*n;if(!n||fich()<p)return;A.st().f-=p;g.stock[r]-=n;S.res[r]=Math.min(cap(),(S.res[r]||0)+n);guardiaGo('intend')};
window.guardiaSell=(r,n)=>{if(window.NOSELL&&NOSELL.has(r))return toast('Eso no se vende: tu gente lo necesita para vivir.');n=Math.min(n,Math.floor(S.res[r]||0));if(!n)return;const gg=Math.floor(sellP(r)*n);S.res[r]-=n;A.gain(gg);toast('Vendes '+n+' de '+NM(r).toLowerCase()+': +'+gg+' fichas.');guardiaGo('intend')};
/* ---- armería ---- */
const GEAR=[{n:'Chaleco de la Guardia',slot:'vest',def:2,p:140,r:1},{n:'Chaqueta de la Guardia',slot:'jacket',def:3,p:210,r:1},{n:'Chaleco reforzado de la Guardia',slot:'vest',def:4,p:340,r:2},{n:'Chaqueta táctica de la Guardia',slot:'jacket',def:5,p:460,r:3},{n:'Chaleco de élite del Alba',slot:'vest',def:7,p:720,r:4},{n:'Capote del Alba',slot:'jacket',def:8,p:900,r:4}];
const PACKS=[{n:'Caja de munición ×20',r:'ammo',q:20,p:55,k:0},{n:'Munición ×60',r:'ammo',q:60,p:150,k:1},{n:'Botiquín militar ×5',r:'meds',q:5,p:70,k:1},{n:'Barras de metal ×30',r:'metal',q:30,p:90,k:2}];
function armeria(){const k=rank();
 show(T('Armería'),bk+head()+npc('olmos')+`<div class="mu-h">Equipo de la Guardia</div><div class="vl-list">`+GEAR.map((g,i)=>{const p=Math.ceil(g.p*disc()),lk=k<g.r;return `<div class="vl-row"><div style="flex:1"><b style="color:#9fc4e8">${g.n}</b><small>${lk?'🔒 Requiere rango '+RANKS[g.r]:'Defensa +'+g.def+' · '+(g.slot==='vest'?'Chaleco':'Chaqueta')}</small></div><span class="vl-p">🪙 ${p}</span><button ${lk||fich()<p?'disabled':''} onclick="guardiaGear(${i})">Comprar</button></div>`}).join('')+`</div><div class="mu-h">Suministros</div><div class="vl-list">`+PACKS.map((g,i)=>{const p=Math.ceil(g.p*disc()),lk=k<g.k;return `<div class="vl-row"><div style="flex:1"><b>${g.n}</b>${lk?'<small>🔒 '+RANKS[g.k]+'</small>':''}</div><span class="vl-p">🪙 ${p}</span><button ${lk||fich()<p?'disabled':''} onclick="guardiaPack(${i})">Comprar</button></div>`}).join('')+`</div>`)}
window.guardiaGear=i=>{const g=GEAR[i],p=Math.ceil(g.p*disc());if(!g||rank()<g.r||fich()<p)return;A.st().f-=p;S.inv.push({kind:'clothing',slot:g.slot,n:g.n,def:g.def,col:CB});toast('Compras: '+g.n+'. Está en tu inventario.');try{save()}catch(e){}guardiaGo('armeria')};
window.guardiaPack=i=>{const g=PACKS[i],p=Math.ceil(g.p*disc());if(!g||rank()<g.k||fich()<p)return;A.st().f-=p;S.res[g.r]=Math.min(cap(),(S.res[g.r]||0)+g.q);toast('Compras: '+g.n+'.');guardiaGo('armeria')};
/* ---- enfermería ---- */
function enfer(){const k=rank(),hurt=S.ppl.filter(p=>!p.away&&(p.hp<mhp(p)-1||(p.injury||0)>0)),miss=hurt.reduce((a,p)=>a+Math.max(0,mhp(p)-p.hp)+(p.injury||0)*.5,0),cost=k>=4?0:Math.max(8,Math.round(miss*.5*disc()));
 show(T('Enfermería'),bk+head()+npc('reyes')+`<div class="vl-list"><div class="vl-row"><div style="flex:1"><b>Curar a todos tus heridos</b><small>${hurt.length?hurt.length+' con heridas. Recuperan toda la vida.':'Nadie necesita atención.'}</small></div><span class="vl-p">🪙 ${hurt.length?cost:0}</span><button ${!hurt.length||fich()<cost?'disabled':''} onclick="guardiaHeal(${cost})">Curar</button></div></div>`)}
window.guardiaHeal=c=>{if(fich()<c)return;A.st().f-=c;S.ppl.forEach(p=>{if(p.away)return;p.hp=mhp(p);p.injury=0});toast('Tus heridos se han recuperado.');guardiaGo('enfer')};
/* ---- comedor ---- */
function comedor(){const g=gd(),p=Math.ceil(25*disc()),done=g.meal===S.day;
 show(T('Comedor'),bk+head()+npc('nina')+`<div class="vl-list"><div class="vl-row"><div style="flex:1"><b>Comida caliente para tu equipo</b><small>${done?'Hoy ya habéis comido.':'Todos tus supervivientes: +15 de salud.'}</small></div><span class="vl-p">🪙 ${p}</span><button ${done||fich()<p?'disabled':''} onclick="guardiaMeal(${p})">Comer</button></div></div><div class="vl-rum">“${pk(RUM)}”</div>`)}
window.guardiaMeal=p=>{const g=gd();if(g.meal===S.day||fich()<p)return;A.st().f-=p;g.meal=S.day;S.ppl.forEach(q=>{if(!q.away)q.hp=Math.min(mhp(q),q.hp+15)});toast('Salud +15 para todos.');guardiaGo('comedor')};
/* ---- tablón de operaciones ---- */
const TG=[
 {ic:'🚚',t:'Escolta de convoy',zs:null,x:'«Un convoy de la Guardia debe cruzar {z}. Ve por delante y limpia el camino. Se esperan asaltantes.»'},
 {ic:'🪖',t:'Rescate de patrulla',zs:['camp','police','station','factory'],x:'«Una patrulla perdió el contacto en {z}. Encuéntrala y tráela de vuelta.»'},
 {ic:'📦',t:'Recuperar suministros',zs:['market','station','hospital','suburb'],x:'«Un camión de la Guardia fue asaltado cerca de {z}. Recupera lo que puedas.»'},
 {ic:'⚔',t:'Contraataque',zs:['camp','factory','police'],x:'«Una banda usa {z} como base de saqueo. Expúlsala antes de que ataque.»'},
 {ic:'📡',t:'Balizas de radio',zs:['station','factory','camp'],x:'«Necesitamos reponer una baliza de radio en {z}. Sin ella, perdemos contacto con los puestos.»'},
 {ic:'☠',t:'Despejar la ruta',zs:['hospital','factory','suburb','police'],x:'«{z} está infestado y corta nuestra ruta de abastecimiento. Despéjalo.»'},
 {ic:'🔭',t:'Reconocimiento',zs:null,x:'«Antes de enviar tropas a {z}, quiero ojos allí. Ve, observa y vuelve.»'}];
function zonas(){const lv=typeof hallLv==='function'?hallLv():1,z=(typeof EXT_ZONES!=='undefined'?EXT_ZONES:[]).filter(q=>(typeof zVis==='function'?zVis(q):1)&&q.h<=lv);return z.length?z:(typeof EXT_ZONES!=='undefined'?EXT_ZONES.slice(0,1):[])}
function gen(){const zs=zonas(),out=[],used=new Set();let guard=0;while(out.length<4&&guard++<40){const i=ri(0,TG.length-1);if(used.has(i))continue;const T=TG[i],zl=zs.filter(z=>!T.zs||T.zs.includes(z.id));if(!zl.length)continue;used.add(i);const z=pk(zl),g=z.g||1;
  const rw=[{t:'G',n:6+g*3+ri(0,4)}];const o=Math.random();rw.push(o<.4?{t:'r',k:'ammo',n:Math.round((15+10*g)/5)*5}:o<.7?{t:'r',k:'metal',n:Math.round((15+8*g)/5)*5}:{t:'f',n:Math.round((60+40*g)/5)*5});
  out.push({id:S.day*100+out.length+ri(0,90),tp:i,ic:T.ic,t:T.t,w:'la Guardia',z:z.id,zn:z.n,zi:z.icon||'📍',g,x:T.x.replace('{z}',z.n),rw,gd:1})}return out}
function tbG(){const g=gd();if(!g.tb||S.day-g.tb.d>=4)g.tb={d:S.day,l:gen()};return g.tb}
function villaTbA(){if(!S.vil)A.st();if(!S.vil.tb)S.vil.tb={d:S.day,l:[],a:[],n:0};return S.vil.tb}
function tablon(){const b=tbG(),vt=villaTbA(),act=(vt.a||[]).filter(j=>j.gd),left=Math.max(1,4-(S.day-b.d)),tot=(vt.a||[]).length;
 const card=(j,i,on)=>`<div class="tbc${on?' on':''}"><div class="tbh"><span class="tbi">${j.ic}</span><div><b>${j.t}</b><small>Operación de la Guardia</small></div></div><p>${esc(j.x)}</p><div class="tbz"><span>${j.zi} ${j.zn}</span><span>${pips(j.g)}</span>${on?`<span>⏳ ${Math.max(0,j.dl-S.day)} día(s)</span>`:''}</div><div class="tbr">${j.rw.map(r=>`<span>${A.rwTxt(r)}</span>`).join('')}</div>${on?'<small class="mu-mut">Hazla en Explorar → pestaña Villa.</small>':`<button ${tot>=3?'disabled':''} onclick="guardiaTb(${i})">Aceptar operación</button>`}</div>`;
 show(T('Tablón de operaciones'),bk+head()+npc('soler')+(act.length?`<div class="mu-h">En curso</div><div class="tb-grid">${act.map(j=>card(j,0,1)).join('')}</div>`:'')+`<div class="mu-h">Operaciones <small>cambian en ${left} día(s)</small></div>`+(b.l.length?`<div class="tb-grid">${b.l.map((j,i)=>card(j,i,0)).join('')}</div>`:'<small class="mu-mut">No hay más operaciones por ahora.</small>')+`<small class="mu-mut">Comparten el límite de 3 encargos con el tablón de la villa. Los enemigos suelen ser Los Cuervos y Las Víboras.</small>`)}
window.guardiaTb=i=>{const b=tbG(),vt=villaTbA(),j=b.l[i];if(!j||(vt.a||[]).length>=3)return;b.l.splice(i,1);j.dl=S.day+8;(vt.a=vt.a||[]).push(j);toast('Operación aceptada: '+j.t);try{save()}catch(e){}guardiaGo('tablon')};
window.guardiaGo=function(k,t){if(!unlocked())return lock();refresh();({cuartel,intend,armeria,enfer,tablon,comedor})[k]?({cuartel,intend,armeria,enfer,tablon,comedor})[k](t):0};
window.guardiaApi={unlocked,lock,arrive,rep,rank:()=>rank(),st:gd};
window.guardiaMenu=()=>{try{guardiaEnter()}catch(e){lock()}};
/* renovación del tablón */
(function(){const o=window.nextDay;if(typeof o!=='function')return;window.nextDay=function(){const r=o.apply(this,arguments);try{if(unlocked()&&S.gd&&S.gd.tb&&S.day-S.gd.tb.d>=4){S.gd.tb=null;tbG();notify('🛡','Guardia: nuevas operaciones','El capitán Soler tiene fichas nuevas.','villa');toast('🔔 Guardia: nuevas operaciones')}}catch(e){}return r}})();
/* refuerzos en tus asaltos */
(function(){const o=window.startHorde;if(typeof o!=='function')return;window.startHorde=function(){const r=o.apply(this,arguments);try{if(unlocked()&&S.gd&&S.gd.met&&horde&&!S.over){const k=rank(),n=k>=4?5:k>=3?3:k>=2?2:0;if(n){const h=S.bld.find(b=>b.type=='hall')||{x:16,y:16};for(let i=0;i<n;i++)U.push({p:{id:'gd'+i,ally:1,arm:'soldado',lvl:3,xp:0,age:30,sex:i%3===2?'F':'M',n:'Soldado de la Guardia',wp:{n:'Fusil',v:5},hp:100,injury:0,mor:90,gear:{armor:0,pack:0}},x:h.x+2+i%4,y:h.y+7+(i>>2),hp:100,cd:0});setTimeout(()=>{try{toast('🛡 La Guardia del Alba envía '+n+' soldados en tu ayuda.');notify('🛡','Refuerzos de la Guardia',n+' soldados defienden tu base.','alerta')}catch(e){}},400)}}}catch(e){console.error('refuerzos',e)}return r}})();
(function(){const o=window.endHorde;if(typeof o!=='function')return;window.endHorde=function(){try{U=U.filter(u=>!(u.p&&u.p.ally))}catch(e){}return o.apply(this,arguments)}})();
/* botón del menú lateral */
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('gdBtn'))return;const vb=document.getElementById('vlBtn');if(!vb)return;const b=document.createElement('button');b.id='gdBtn';b.innerHTML='<i class="ib">🛡</i>Guardia';b.onclick=()=>{try{tg(0)}catch(e){}guardiaMenu()};rl.insertBefore(b,vb.nextSibling)}
addBtn();document.addEventListener('DOMContentLoaded',addBtn);setTimeout(addBtn,800);
})();
