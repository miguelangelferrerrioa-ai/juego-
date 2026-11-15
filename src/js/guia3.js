/* ===== Guía: textos de gasolina y aleación, recursos y secciones solo cuando ya se han desbloqueado ===== */
(function(){
'use strict';
if(typeof GD==='undefined')return;
try{
 GU.gas='Se gasta al salir de expedición, en algunas misiones y en las operaciones. Se consigue como botín en el exterior y con pozos de extracción sobre yacimientos.';
 GU.alloy='Material avanzado para los niveles 11 a 15 y para mejorar armas y atuendos en la Forja. La fabrica la Forja y la dejan los jefes al caer y algunas cadenas de misiones.';
}catch(e){}
const BASE=new Set(['food','water','wood','metal','meds','ammo']);
const hasLab=()=>{try{return window.rpOn?rpOn():S.bld.some(b=>b.type==='lab')}catch(e){return false}};
/* un recurso aparece en la guía cuando ya lo has tenido alguna vez */
function mark(){try{if(typeof S==='undefined'||!S||!S.res)return;S.rseen=S.rseen||{};RK.forEach(r=>{if((S.res[r[0]]||0)>0)S.rseen[r[0]]=1})}catch(e){}}
setInterval(mark,2000);
const seenRes=k=>{try{return BASE.has(k)||(S.rseen&&S.rseen[k])||(S.res[k]||0)>0||S.mode==='creativo'}catch(e){return BASE.has(k)}};
const ri=GD.findIndex(g=>g[0]==='Recursos');
if(ri>=0){const old=GD[ri][1];GD[ri][1]=()=>{mark();let h=old();
 const box=document.createElement('div');box.innerHTML=h;
 box.querySelectorAll('p').forEach(p=>{const b=p.querySelector('b'),img=p.querySelector('img');if(!b||!img)return;const r=RK.find(x=>x[1]===b.textContent);if(!r)return;if(window.resLocked&&resLocked(r[0])){p.innerHTML='<img src="'+img.getAttribute('src')+'" width="'+(img.getAttribute('width')||18)+'" style="'+resLockImg+';vertical-align:middle"> <b>???</b> — '+resLockTxt(r[0])}else if(!seenRes(r[0])&&!(window.RES_LV&&RES_LV[r[0]]))p.remove()});
 return box.innerHTML}}
/* sección de roles: solo nombra los edificios ya desbloqueados */
const roles=()=>{let h='<p>Cada superviviente tiene <b>9 roles</b> que van de 0 a 10. El más alto es su <b>rol principal</b> y es el que aparece en su ficha. Los roles suben en los edificios de formación y al trabajar. En la ficha, pestaña <b>★ Roles</b>, toca un rol para ver qué hace.</p><p>Si alguien trabaja en un puesto de su rol, rinde mucho más: <b>cada nivel suma un 20%</b>. Sin el rol adecuado trabaja a medio gas.</p>';
 PF.forEach(k=>{const c=(window.ROLE_SI&&ROLE_SI[k])?ROLE_SI[k][1]:'#ffd877';h+='<p><b style="color:'+c+'">'+k+'</b> · '+(window.roleTxt?roleTxt(k):'')+'</p>'});
 h+='<p class="invb">Los edificios que aún no has desbloqueado no aparecen en esta lista.</p>';return h};
{const si=GD.findIndex(g=>g[0]==='Supervivientes');GD.splice(si>=0?si+1:GD.length,0,['Roles',roles])}

/* ===== textos de la guía al día con las novedades ===== */
{const W=(name,fn)=>{const i=GD.findIndex(g=>g[0]===name);if(i<0)return;const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}try{return fn(h)}catch(e){return h}}};
 const dom=h=>{const d=document.createElement('div');d.innerHTML=h;return d};
 W('Interfaz',h=>h.replace(/Los recursos y materiales no salen aquí: se ven en el Almacén \(pestañas Recursos y Materiales\)\./,'El botón <b>📦 Recursos</b> fija a la derecha una columna con todos tus recursos y materiales y lo que suben o bajan por minuto (en verde o rojo; en amarillo si el almacén está lleno). Vuelve a tocarlo para quitarla; el juego lo recuerda. Si tocas la columna se abre el Almacén.'));
 W('Guardado y controles',h=>h.replace('En Menú puedes guardar, cargar o empezar de nuevo (con confirmación).','En <b>Menú → Partida</b> puedes guardar, exportar, cargar o empezar de nuevo (con confirmación). <b>Mientras el menú de Partida está abierto, el juego se queda en pausa.</b>'));
 W('Tecnologías',h=>{h=h.replace(/,? ?y algunas misiones principales\. Empiezas con 30 PI\./,'. <b>Sin laboratorio no se consigue ningún PI</b>: al construir el primero recibes 30 PI para empezar.');
   const d=dom(h),U=(S.unl&&S.unl.t)||{};let hid=0;d.querySelectorAll('p').forEach(p=>{const b=p.querySelector('b');if(!b)return;const t=TECH.find(q=>q[2]===b.textContent.trim());if(t&&!U[t[0]]&&!S.tech[t[0]]&&S.mode!=='creativo'){p.remove();hid++}});
   return d.innerHTML+(hid?'<p class="invb">Hay '+hid+' estudios más que aún no conoces: aparecen en el árbol a medida que avanzas.</p>':'')});
 W('Supervivientes',h=>{h=h.replace(/Reclutar cuesta 30 comida y 20 agua y necesita casas libres\.?/,'La comunidad crece sobre todo con <b>embarazos</b>; también llega alguien solo cada 8 días, por la radio, acogiendo refugiados o rescatando en expediciones. Hacen falta camas libres (casas).');const d=dom(h);d.querySelectorAll('p').forEach(p=>{const b=p.querySelector('b');if(b&&PF.includes(b.textContent.trim()))p.remove()});
   return d.innerHTML+`<p><b>Lista de supervivientes</b> (Menú → Supervivientes): arriba tienes filtros por <b>rol, sexo, edad y estado</b> (sin trabajo, trabajando, en el ejército, fuera, heridos o embarazadas) y un orden. Si filtras por un rol, salen del mejor al peor con su nivel (★ Agricultor 6/10).</p>
   <p><b>Asignar a un edificio:</b> en la lista de candidatos la <b>★ de la izquierda</b> indica lo bien que encaja cada uno en ese puesto, aunque esté ocupado (debajo pone dónde trabaja). Si tocas a alguien ocupado, se cambia directamente a este edificio.</p>
   <p>Qué hace cada rol y en qué edificios rinde mejor: sección <b>Roles</b>.</p>`});
 const eq=()=>`<p>En la ficha de un superviviente, pestaña <b>Equipo</b>, tiene tres tipos de equipo. Toca un hueco para elegir qué ponerle de lo que tienes en el almacén, o para quitar lo que lleva.</p>
   <p><b>Arma</b>: sube su poder de ataque. Se fabrican en el taller o se encuentran en expediciones y misiones.</p>
   <p><b>Atuendo</b>: un conjunto completo (solo uno a la vez). Da defensa y, muchas veces, <b>bonos a algún rol</b>. Se fabrica con chatarra y un plano o se consigue en misiones.</p>
   <p><b>Prendas</b>: piezas sueltas que <b>sueltan algunos zombis</b>. Hay cinco huecos: chaleco, chaqueta, pantalón, botas y mochila. Solo dan un poco de defensa (hasta +1 cada una) y se pueden llevar a la vez que el atuendo: su defensa se suma.</p>
   <p>Todo lo que tienes guardado se ve en el <b>Almacén</b> (pestañas Armas, Atuendos y Prendas).</p>`;
 {const i=GD.findIndex(g=>g[0]==='Roles');GD.splice(i>=0?i+1:GD.length,0,['Equipo: armas, atuendos y prendas',eq])}
 W('Materiales de construcción',h=>{const L=window.RES_LV||{},mk=window.MATK||[],nm=k=>(RK.find(r=>r[0]===k)||[0,k])[1];
   const rows=Object.keys(L).sort((a,b)=>L[a]-L[b]).map(k=>{const lk=window.resLocked&&resLocked(k);return '<p><img src="'+((typeof ICO!=='undefined'&&ICO[k])||'')+'" width="16" style="vertical-align:middle;'+(lk?resLockImg:'')+'"> '+(lk?'<b>???</b> — se desbloquea con el ayuntamiento nivel '+L[k]:'<b>'+nm(k)+'</b> — disponible (desde el ayuntamiento nivel '+L[k]+')')+'</p>'}).join('');
   return '<p>Además de madera, metal y lona hay más materiales que <b>se desbloquean al subir el ayuntamiento</b>. Hasta entonces no se consiguen de ninguna forma (ni edificios, ni expediciones, ni misiones, ni el mercado) y aparecen en todas partes como <b>???</b> en oscuro. Al desbloquear uno sale una tarjeta de <b>Nuevo material</b>.</p>'+rows+'<p>Se ven en el Almacén (pestaña Materiales) y en la columna de 📦 Recursos. Los edificios que los producen aparecen en Construir cuando los desbloqueas.</p>'});
 W('Parejas, embarazos y niños',h=>h.replace('(la mitad del rol más alto de cada uno), así que elegir bien la pareja importa.','(la mitad del rol más alto de cada uno). Si los dos comparten rol principal, <b>se suman las dos mitades</b> (hasta 7).')+'<p>En <b>Formar una familia</b> puedes filtrar por rol y ver solo a los disponibles; al elegir a los dos aparece qué heredaría el bebé. Necesitas una cama libre para formar pareja.</p><p>El bebé aparece en el mapa nada más nacer, junto a su madre, más pequeño y con un círculo azul (verde cuando ya es niño). En las tarjetas lleva 👶 o 🧒. Con 18 años, a los 3 días, ya puede trabajar.</p>');
}
const zs=t=>{try{return !!(S.zseen&&S.zseen[t])}catch(e){return false}};
const P=id=>{try{return !window.PROG||PROG.ok(id)}catch(e){return true}};
const GATE={
 'Ejército':()=>P('ejercito'),
 'Tecnologías':hasLab,
 'Niveles 11 a 15 y Forja':()=>{try{return realHall()>=11}catch(e){return false}},
 'Zombis especiales':()=>P('soldadoz'),
 'Jefes de zona':()=>['U','J','T','G','A','H'].some(zs),
 'Bandas humanas':()=>P('cuervos'),
 'Villa Esperanza':()=>P('villa'),
 'Torres y armas':()=>P('ejercito'),
 'Gasolina':()=>seenRes('gas')
};
const vis=g=>{try{const f0=GATE[g[0]];if(!f0)return true;if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return false;if(S.mode==='creativo')return true;const f=GATE[g[0]];return !f||f()}catch(e){return true}};
const og=window.guide;
window.guide=function(i){const all=GD.slice(),v=all.filter(vis);GD.length=0;v.forEach(x=>GD.push(x));try{return og.apply(this,arguments)}finally{GD.length=0;all.forEach(x=>GD.push(x))}};
})();
