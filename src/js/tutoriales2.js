/* ===== Tutoriales de mecánicas avanzadas: una tarjeta corta la primera vez que cada una entra en juego ===== */
(function(){
'use strict';
const P=window.PROG;if(!P||!P.tut||!P.byId)return;
const has=t=>{try{return cnt(t)>0}catch(e){return false}};
const arcOk=k=>{try{return !!(window.ARCOS&&ARCOS.ARC[k]&&ARCOS.ARC[k].ok())}catch(e){return false}};
const L=[
 {id:'invest',d:'Ya tienes Laboratorio: puedes investigar mejoras para tu ciudad.',n:'Investigación',ic:'🔬',when:()=>has('lab'),pages:[
  {sc:'flow',p:{a:'🧪',b:'📜',label:'Laboratorio → Investigar'},t:'Investigación',x:'Con un Laboratorio se abre el menú «Investigar». Cada tecnología cuesta recursos, tarda un tiempo y mejora la producción, la defensa o las expediciones.'},
  {sc:'bars',p:{rows:[['Investigada',100,'#5ad08a'],['Siguiente de la rama',60,'#f2c542'],['???',20,'#566065']],label:'Árbol por ramas'},t:'Ramas del árbol',x:'De cada rama solo ves la siguiente tecnología; las que vienen después salen como «???» hasta que investigues la anterior. Algunas piden un nivel de ayuntamiento.'}]},
 {id:'energia',d:'Tus edificios empiezan a consumir energía.',n:'Energía',ic:'⚡',when:()=>{try{return window.powCalc&&powCalc().dem>0}catch(e){return false}},pages:[
  {sc:'bars',p:{rows:[['Capacidad (generadores)',80,'#f2d43c'],['Consumo (edificios)',60,'#c8362c']],label:'Barra de energía de arriba'},t:'Energía',x:'Desde el nivel 3, muchos edificios consumen energía. Generadores, placas solares y molinos dan capacidad. Si el consumo supera la capacidad, se apagan los últimos edificios construidos.'}]},
 {id:'racion',d:'No hay comida o agua para todos: empieza el racionamiento.',n:'Racionamiento',ic:'🍞',when:()=>{try{return !!S.rationed}catch(e){return false}},pages:[
  {sc:'bars',p:{rows:[['Con ración',65,'#5ad08a'],['Sin ración',35,'#c8362c']],label:'Lo que hay se reparte'},t:'Racionamiento',x:'Si la comida o el agua no llegan para todos, se reparte lo que hay. Pasan hambre primero los comunes sin trabajo, luego los comunes con trabajo; niños, embarazadas y personajes clave, los últimos.'},
  {sc:'flow',p:{a:'🌾',b:'🍞',label:'Solo se producen'},t:'Cómo salir',x:'La comida y el agua no se compran, no se venden y no salen como recompensa: construye o mejora granjas y pozos y pon más gente a trabajar en ellos.'}]},
 {id:'familia',d:'Tus supervivientes pueden formar familias.',n:'Familias',ic:'💞',when:()=>{try{return S.day>=6&&S.ppl.some(p=>p.sex==='F'&&p.age>=18)&&S.ppl.some(p=>p.sex==='M'&&p.age>=18)}catch(e){return false}},pages:[
  {sc:'calendar',p:{head:'FAMILIA',days:['Pareja','Gestación','Crece','Ciudadano']},t:'Formar una familia',x:'Desde «Supervivientes» puedes formar parejas. Tras unos días de gestación nace un niño que crece y acaba siendo un ciudadano más. Hay un máximo de embarazos a la vez.'}]},
 {id:'operaciones',d:'El tiempo cambia y afecta a tu ciudad y a tus salidas.',n:'Clima y lugares de interés',ic:'🌦',when:()=>{try{return S.day>=3}catch(e){return false}},pages:[
  {sc:'bars',p:{rows:[['Despejado',50,'#f2c542'],['Lluvia',25,'#3a9be0'],['Niebla',15,'#9aa3aa'],['Tormenta',10,'#c8362c']],label:'Tiempo que dura cada clima'},t:'El clima',x:'La lluvia alarga los viajes de las expediciones, la niebla reduce el alcance de las torres y la tormenta baja la madera, el metal, la piedra y la energía solar, y endurece las misiones. Nunca afecta a la comida ni al agua.'},
  {sc:'map',p:{label:'Operaciones+',pins:[[60,110,'🏥'],[140,60,'📻'],[220,100,'🚉']]},t:'Lugares de interés',x:'En «Operaciones+» aparecen lugares cercanos que puedes explorar una vez a cambio de un poco de comida, munición y gasolina.'}]},
 {id:'ciudades',d:'Las ciudades del mapa piden ayuda en el tablón de la villa.',n:'Ciudades del mapa',ic:'🏙',when:()=>arcOk('mirasol')||arcOk('alcor'),pages:[
  {sc:'map',p:{label:'Encargos de ciudades',pins:[[50,100,'🏙'],[130,60,'🏙'],[210,110,'🏙']]},t:'Ciudades del mapa',x:'Ocho ciudades tienen sus propios problemas. Sus encargos salen en el tablón de la villa, en cadena de tres misiones, y al terminarlas dan recompensas y aliados.'}]},
 {id:'bandas2',d:'Nuevas bandas rondan la zona.',n:'Nuevas bandas',ic:'🏴',when:()=>arcOk('segadores')||arcOk('humo')||arcOk('hierro'),pages:[
  {sc:'fight',p:{l:['🪖','🪖'],r:['🏴','🏴','🏴'],label:'Segadores, Humo y Hierro'},t:'Nuevas bandas',x:'Los Segadores, los Hijos del Humo y la Hermandad del Hierro tienen su propia historia de cuatro misiones en el tablón de la villa. Son misiones duras: lleva a tus mejores soldados.'}]},
 {id:'forja',d:'Se abre la Forja en el Almacén.',n:'Forja',ic:'🔨',when:()=>{try{return hallLv()>=13}catch(e){return false}},pages:[
  {sc:'flow',p:{a:'⚙',b:'⭐',label:'Almacén → pestaña Forja'},t:'Forja',x:'En el Almacén se abre la pestaña Forja: fabrica aleación y mejora armas y atuendos hasta 5 estrellas. También hay diseños que solo se hacen con aleación.'}]},
 {id:'asaltofinal',d:'La guerra del Alba ha empezado.',n:'Asalto final',ic:'⚔',when:()=>{try{return !!(S.arc&&S.arc.fall)}catch(e){return false}},pages:[
  {sc:'fight',p:{l:['🛡','🪖','🪖'],r:['🐦','🐍'],wall:1,label:'Dos bastiones seguidos'},t:'La guerra del Alba',x:'Valeria está en tu base. Completa sus misiones del tablón y luego abre «Asalto final» en el menú: necesitas 2000 de poder. Atacaréis los dos bastiones seguidos; durante la batalla puedes usar explosivos, fuego de cobertura y botiquines.'}]}
];
L.forEach(m=>{if(!P.byId[m.id])P.byId[m.id]={id:m.id,n:m.n,ic:m.ic,st:0,h:1,d:m.d};P.tut[m.id]=m.pages});
setInterval(()=>{try{if(typeof S==='undefined'||!S||!S.ppl||!S.bld||!S.bld.length||S.over||S.mode==='creativo'||window.ZI_OFF)return;
 /* partida guardada antes de existir estas tarjetas: lo que ya está en marcha se da por visto sin enseñarlo (antes salían todas seguidas al cargar) */
 if(!S.tips){S.tips={};if(S.day>1){for(const m of L){let ok=false;try{ok=m.when()}catch(e){}if(ok)S.tips[m.id]=1}return}}
 for(const m of L){if(S.tips[m.id])continue;let ok=false;try{ok=m.when()}catch(e){}if(ok){S.tips[m.id]=1;window.tutShow&&tutShow(m.id)}}}catch(e){}},2500);
})();
