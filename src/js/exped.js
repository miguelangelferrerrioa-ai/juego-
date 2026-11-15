/* Expediciones v2: determinista, 5 eventos, enemigos, compañeros, resumen */
(function(){
const EN={z:'infectados',f:'gordo',s:'soldado infectado',r:'corredor'};
const CHZ=[['z'],['z','r'],['z','f'],['z','s'],['z','f'],['s','r'],['z','r'],['z'],['z','s'],['s','f'],['s','s','r'],['z','f','r'],['z','s'],['z','f'],['s','r'],['f','s','r']];
const X=[
[['Un cartel descolorido anuncia "Agua gratis". El depósito subterráneo sigue sellado.','Forzar la tapa','Revisar el cierre con cuidado'],['Al volver, huellas recientes rodean el coche.','Seguirlas','Borrarlas y marcharse']],
[['Una cisterna volcada gotea combustible.','Recogerlo a toda prisa','Hacer una cadena con cubos'],['En la cabina hay una radio que aún emite.','Llevársela','Escuchar sin tocarla']],
[['La puerta de urgencias está atrancada desde dentro.','Derribarla','Buscar una entrada lateral'],['Una enfermera infectada aún lleva el cordón con su nombre.','Acabar con ella','Esquivarla en silencio']],
[['Las estanterías llegan hasta el techo y no se ve el fondo.','Avanzar por el pasillo central','Subir a las pasarelas'],['Un camión de carga arranca solo al acercaros.','Apagarlo a tiros','Cortar la batería']],
[['El pasillo de cuarentena tiene luces rojas intermitentes.','Cruzarlo corriendo','Anular el sistema de alarma'],['Un congelador contiene frascos etiquetados con números.','Llevaros todos','Llevaros solo uno y fotografiar el resto']],
[['Un soldado muerto aún sostiene un fusil.','Recoger el fusil','Dejarlo y revisar sus bolsillos'],['La barrera está electrificada.','Cortar los cables','Rodearla por el barranco']],
[['El silbido se intensifica y los infectados se agrupan.','Taparos los oídos y avanzar','Retroceder hasta romper la línea de sonido'],['La escalera de la torre cruje a cada paso.','Subir de uno en uno','Subir todos juntos']],
[['La puerta del observatorio tiene una nota: "No es una trampa".','Entrar de inmediato','Registrar la entrada antes'],['El técnico duda si fiarse de vosotros.','Mostrarle las armas','Dejarle las armas fuera']],
[['Hay celdas con los barrotes doblados desde dentro.','Examinarlas','Pasar sin tocar nada'],['El archivo de custodia está bajo llave.','Reventar el cajón','Buscar la llave en la sala de guardia']],
[['Una cuadrilla de infectados empuja el muro desde fuera.','Reforzar el muro','Abrir un hueco y atraerlos hacia otro lado'],['Entre las fosas hay una mochila de niño.','Llevársela','Dejarla donde está']],
[['Hay tiendas de campaña quemadas y bidones vacíos.','Seguir el rastro de las huellas','Registrar las tiendas una por una'],['Un prisionero atado pide agua.','Liberarlo','Interrogarlo antes']],
[['Los túneles tienen agua hasta los tobillos.','Cruzar sin linterna para no hacer luz','Usar linternas y avanzar despacio'],['Los dormidos giran la cabeza a vuestro paso.','Cruzar sin parar','Parar y observar']],
[['Las cajas del archivo huelen a humedad y papel quemado.','Llevaros las cajas enteras','Fotografiar lo importante'],['Una alarma se activa en la planta baja.','Salir por la azotea','Desactivarla']],
[['La casa conserva dibujos pegados en la pared.','Abrir los cajones','Dejar la casa como está'],['Un gato maúlla desde el desván.','Subir a por él','Llamarlo desde abajo']],
[['Seguridad privada patrulla el vestíbulo.','Cruzarlo por la fuerza','Entrar por el aparcamiento'],['El ascensor sigue funcionando.','Usarlo','Subir por las escaleras']],
[['Las máquinas del sótano pitan al unísono.','Cortar la energía','Mantenerlas encendidas'],['Una puerta final se abre despacio.','Cruzarla sin dudar','Esperar a que el equipo se recomponga']]];
const BON=[0,0,0,3,0,5,0,0,6,0,0,0,0,0,0,0];
function dgBase(z){return z.chap!==undefined?(95+z.chap*23):z.g*22+8}
window.dgOf=function(z){const sp=z.chap!==undefined?CHZ[z.chap].filter(t=>t!=='z'&&t!=='r').length:0;return Math.round(dgBase(z)*(1+.06*sp))};
STORY.forEach((c,i)=>{if(c.evs.length<5&&X[i]){X[i].forEach((q,k)=>c.evs.push({t:q[0],a:q[1],b:q[2]}))}c.en=CHZ[i]||['z'];if(c.r&&c.r.wp===undefined&&[3,7,9,12].includes(i))c.r.wp=({3:4,7:5,9:6,12:6})[i]});
if(WP.length<7){WP.push({n:'Machete',v:3,c:{metal:15}},{n:'Revólver',v:7,c:{metal:30,ammo:10}},{n:'Ballesta',v:8,c:{metal:25,wood:25}},{n:'Rifle de caza',v:11,c:{metal:55,wood:10,ammo:20},t:'arms1'})}

const ROUT={0:'Chaleco de explorador',1:'Chaleco antibalas',2:'Uniforme médico militar',3:'Mono reforzado',4:'Traje de laboratorio',5:'Armadura antidisturbios',6:'Ropa táctica',7:'Capa del Faro',8:'Armadura de placas',9:'Armadura del Cordón',10:'Uniforme de CENIZA',11:'Traje NBQ',12:'Mono de ingeniero jefe',13:'Bata de la doctora Ibarra',14:'Traje Aurora',15:'Uniforme del superviviente'};
const RWP={1:'Carabina',4:'Pistola de reactivos',6:'Ballesta de precisión',8:'Subfusil',10:'Escopeta de combate',11:'Rifle de francotirador',13:'Fusil del Faro',14:'Rifle de CENIZA'};
setTimeout(()=>{STORY.forEach((c,i)=>{if(c.r){if(ROUT[i])c.r.out=ROUT[i];if(RWP[i]){const k=WP.findIndex(w=>w.n===RWP[i]);if(k>=0)c.r.wp=k}}})},0);

/* consecuencias de las decisiones extra: [tipo c=compasión p=pragmático, registro, efectos] */
const C=(l,fx)=>['c',l,fx],P=(l,fx)=>['p',l,fx];
const CONS=[
[[P('Forzasteis el depósito de agua de la gasolinera.'),C('Revisasteis el cierre sin romper nada.')],[P('Borrasteis las huellas y os fuisteis.'),C('Seguisteis las huellas y encontrasteis un cuaderno de ruta.',{doc:'manifiesto'})]],
[[P('Recogisteis el combustible a toda prisa.'),C('Organizasteis una cadena de cubos y repartisteis lo sobrante.')],[P('Os llevasteis la radio de la cabina.',{res:{elec:8}}),C('Escuchasteis la radio sin tocarla y anotasteis las frecuencias.')]],
[[P('Derribasteis la puerta de urgencias.'),C('Entrasteis por un lateral sin hacer ruido.')],[C('Acabasteis con la enfermera infectada y guardasteis su cordón.'),P('Esquivasteis a la enfermera en silencio.')]],
[[P('Avanzasteis por el pasillo central.'),C('Subisteis a las pasarelas.')],[P('Apagasteis el camión a tiros.'),C('Cortasteis la batería del camión con cuidado.')]],
[[P('Cruzasteis corriendo el pasillo de cuarentena.'),C('Anulasteis la alarma de cuarentena.')],[P('Os llevasteis todos los frascos.',{res:{meds:6}}),C('Cogisteis un frasco y fotografiasteis el resto.',{flag:'frasco_foto'})]],
[[P('Recogisteis el fusil del soldado muerto.'),C('Dejasteis el fusil y registrasteis sus bolsillos: una carta a su familia.',{mor:2})],[P('Cortasteis los cables de la barrera.'),C('Rodeasteis la barrera por el barranco.')]],
[[P('Avanzasteis tapándoos los oídos.'),C('Retrocedisteis hasta romper la línea de sonido.')],[P('Subisteis la torre uno a uno.'),C('Subisteis juntos, ayudándoos.')]],
[[P('Entrasteis de inmediato.'),C('Registrasteis la entrada antes.')],[P('Le mostrasteis las armas al técnico.',{flag:'faro_tenso'}),C('Dejasteis las armas fuera. El técnico respiró.',{flag:'faro_confia'})]],
[[C('Examinasteis las celdas con cuidado.'),P('Pasasteis de largo.')],[P('Reventasteis el cajón del archivo.'),C('Buscasteis la llave en la sala de guardia.')]],
[[C('Reforzasteis el muro para proteger a los de dentro.',{mor:2}),P('Atrajisteis a los infectados hacia otro lado.')],[C('Os llevasteis la mochila de niño.',{flag:'mochila_lia'}),P('Dejasteis la mochila donde estaba.')]],
[[C('Seguisteis las huellas de CENIZA.'),P('Registrasteis las tiendas una por una.',{res:{ammo:8}})],[C('Liberasteis al prisionero.',{sv:{id:'prisionero',n:'Raúl Cano',prof:'Soldado',sex:'M',age:33},flag:'prisionero_libre'}),P('Interrogasteis al prisionero antes de liberarlo.',{flag:'prisionero_interrogado',res:{ammo:15}})]],
[[P('Cruzasteis los túneles sin linterna.'),C('Usasteis linternas y avanzasteis despacio.')],[P('Cruzasteis sin parar entre los dormidos.'),C('Os parasteis a observar a los dormidos.',{doc:'dormidos'})]],
[[P('Os llevasteis las cajas enteras del archivo.',{res:{metal:10}}),C('Fotografiasteis lo importante.')],[P('Salisteis por la azotea.'),C('Desactivasteis la alarma.')]],
[[C('Abristeis los cajones de la casa de Lía.',{doc:'lia'}),P('Dejasteis la casa como estaba.')],[C('Subisteis al desván a por el gato.',{flag:'gato',mor:3}),P('Llamasteis al gato desde abajo.')]],
[[P('Cruzasteis el vestíbulo por la fuerza.'),C('Entrasteis por el aparcamiento.')],[P('Usasteis el ascensor.'),C('Subisteis por las escaleras.')]],
[[P('Cortasteis la energía de las máquinas.'),C('Mantuvisteis las máquinas encendidas.')],[P('Cruzasteis la puerta final sin dudar.'),C('Esperasteis a que el equipo se recompusiera.',{mor:3})]]];
window.CONS=CONS;window.CHZ=CHZ;window.exMk={C,P};
STORY.forEach((c,i)=>{c.xs=[c.evs.length-2,c.evs.length-1]});
function cons(chap,step,agg){const c=STORY[chap];if(!c||!c.xs||!S.nar||!S.nar.f)return;const k=c.xs.indexOf(step);if(k<0)return;const row=CONS[chap]&&CONS[chap][k];if(!row)return;const q=row[agg?0:1];if(!q)return;const f=S.nar.f;f[q[0]==='c'?'comp_n':'prag_n']=(f[q[0]==='c'?'comp_n':'prag_n']||0)+1;let t='';if(q[0]==='c'){S.ppl.forEach(p=>p.mor=Math.min(100,(p.mor||50)+2))}else{S.res.metal=Math.min(cap(),S.res.metal+6)}
if(q[2]&&window.narFx)t=narFx(q[2]);window.addLog&&addLog(q[1]);return t}
const tm=e=>e.team.map(byId).filter(Boolean);
const bonus=e=>{let b=0;tm(e).forEach(p=>{if(p.story==='gael')b+=20;if(p.story==='ibarra')b+=8});return b};
const has=(e,id)=>tm(e).some(p=>p.story===id);
const pwOf=e=>Math.round((tm(e).reduce((a,p)=>a+upow(p),0)+bonus(e))*(1+(th('expl1')?.1:0)));
window.exEvent=function(){const e=S.exp;e.ev=e.z.evs?e.z.evs[e.step]:pk(EVS);const pw=pwOf(e),dg=dgOf(e.z),pa=pw>=dg,pb=pw>=dg*(has(e,'lia')?.4:.6),en=(e.z.chap!==undefined?CHZ[e.z.chap]:[]).map(t=>EN[t]);const tot=e.z.evs?e.z.evs.length:3;
let comp='';if(has(e,'gael'))comp+=' · Gael aporta +20';if(has(e,'ibarra'))comp+=' · Ibarra aporta +8';if(has(e,'lia'))comp+=' · Lía: los infectados se apartan (la opción prudente exige menos)';
show('Expedición: '+e.z.n+' ('+(e.step+1)+'/'+tot+')',`${e.z.intro&&e.step==0?'<p><i>'+e.z.intro+'</i></p>':''}<p>${e.ev.t}</p><p>Poder del equipo: <b>${pw}</b> · Necesario: <b>${dg}</b> (arriesgada) / <b>${Math.round(dg*(has(e,'lia')?.4:.6))}</b> (prudente)</p>${en.length?'<p><small>Enemigos en la zona: '+en.join(', ')+comp+'</small></p>':''}`+e.log.map(l=>'<p><small>'+l+'</small></p>').join('')+btn(e.ev.a+' (arriesgado · '+(pa?'éxito seguro':'fracaso: heridas graves')+')','exChoose(1)')+btn(e.ev.b+' (prudente · '+(pb?'éxito seguro':'fracaso: heridas leves')+')','exChoose(0)'))};
window.exChoose=function(agg){const e=S.exp,z=e.z,team=tm(e),pw=pwOf(e),dg=dgOf(z)*(agg?1:(has(e,'lia')?.4:.6)),ok=pw>=dg,lm=(ok?(agg?1.3:.6):(agg?.3:.4))*(z.chap!==undefined?1+z.chap*.12:1),dm0=ok?(agg?6:2):(agg?Math.min(40,15+(dg-pw)/dg*40):Math.min(15,5+(dg-pw)/dg*15));e.dead=e.dead||[];e.hurt=e.hurt||{};
team.forEach(p=>{let dm=dm0;if(p.story==='lia')dm=0;if(has(e,'ibarra'))dm*=.7;p.hp-=dm;p.injury=Math.min(100,(p.injury||0)+dm*.7);p.xp+=5;if(dm>0)e.hurt[p.id]=(e.hurt[p.id]||0)+dm});
const pack=team.length?1+team.filter(p=>p.gear&&p.gear.pack).length*.25/team.length:1;for(const k in z.l)e.loot[k]=(e.loot[k]||0)+(z.l[k][0]+z.l[k][1])/2*lm/3*(th('expl2')?1.2:1)*pack;

if(e.ev.sv&&agg&&ok)e.surv++;if(e.ev.am&&agg&&ok)e.loot.ammo=(e.loot.ammo||0)+15;if(ok)e.ok++;
if(S.nar&&S.nar.f&&z.chap!==undefined){S.nar.f[agg?'agg_n':'prud_n']=(S.nar.f[agg?'agg_n':'prud_n']||0)+1;S.nar.f['m'+z.chap+'_'+e.step]=agg?1:0}
{const ct=z.chap!==undefined?cons(z.chap,e.step,agg):'';if(ct)e.log.push('Consecuencia:'+ct.replace(/<br>/g,' · '))}
e.log.push((ok?'Éxito: ':'Fracaso: ')+(agg?e.ev.a:e.ev.b)+(ok?'.':', con heridas y poco botín.'));
team.forEach(p=>{if(p.hp<=-10){e.log.push(p.n+' murió.');e.dead.push(p.n);p.away=0;die(p,'en la expedición');e.team=e.team.filter(i=>i!=p.id)}else if(p.hp<=0)p.hp=3});
e.step++;save();if(!e.team.length||e.step>=(z.evs?z.evs.length:3))exEnd();else exEvent()};
const oEnd=window.exEnd;
window.exEnd=function(){const e=S.exp;const names=e?e.team.map(byId).filter(Boolean).map(p=>({n:p.n,id:p.id})):[];const hurt=e?e.hurt||{}:{},dead=e?e.dead||[]:[];const tot=e&&e.z.evs?e.z.evs.length:3,okN=e?e.ok:0,chap=e&&e.z.chap!==undefined;const win=chap?okN>=Math.ceil(tot/2)&&names.length:okN>0;
const os=window.show;window.show=function(t,h){window.show=os;const team=names.map(q=>{const p=byId(q.id),w=hurt[q.id]||0;return'<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #fff2"><span>'+q.n+'</span><span style="color:'+(w>25?'#e07a5f':w>0?'#e8c25a':'#9fd08a')+'">'+(w>25?'Herido grave':w>0?'Herido leve':'Ileso')+(p?' · salud '+Math.round(p.hp):'')+'</span></div>'}).join('')+dead.map(n=>'<div style="padding:3px 0;color:#c0392b">✝ '+n+' (murió)</div>').join('');
const head='<div style="text-align:center;margin:4px 0 10px"><div style="font-size:22px;font-weight:900;letter-spacing:2px;color:'+(win?'#c9a24a':'#c0392b')+'">'+(win?(chap?'MISIÓN SUPERADA':'EXPEDICIÓN EXITOSA'):(chap?'MISIÓN FALLIDA':'EXPEDICIÓN FALLIDA'))+'</div><small>'+okN+' de '+tot+' encuentros superados</small></div><div style="margin-bottom:10px"><b>Equipo</b>'+team+'</div>';
os(win?(chap?'Misión superada':'Expedición completada'):'Expedición terminada',head+h)};oEnd()};
/* chip de expedición en curso */
const ch=document.createElement('div');ch.id='expchip';ch.style.cssText='position:fixed;top:46px;right:8px;z-index:30;background:#2a2312;border:1px solid #c9a24a;color:#e8c25a;padding:4px 10px;border-radius:14px;font:12px sans-serif;display:none;cursor:pointer';ch.onclick=()=>S.exp?exEvent():expMenu();document.body.appendChild(ch);
setInterval(()=>{if(typeof S!=='undefined'&&S&&S.exp){const e=S.exp,tot=e.z.evs?e.z.evs.length:3;ch.style.display='block';ch.textContent=(e.travel&&!e.travel.done)?('🧭 '+e.z.n.replace(/^Cap\. \d+ · /,'')+' · '+(e.travel.t>0?'llega en '+Math.floor(e.travel.t/60)+':'+String(Math.ceil(e.travel.t)%60).padStart(2,'0'):'¡ha llegado!')):('🧭 '+e.z.n.replace(/^Cap\. \d+ · /,'')+' · '+(e.step+1)+'/'+tot+' · '+e.team.length+' fuera')}else ch.style.display='none'},800);
})();
