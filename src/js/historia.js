/* ===== Dead Town · HISTORIA: "El Silencio de Valdecruz" =====
   Conspiración, ciencia y misterio. Eventos narrativos con decisiones, archivos
   para coleccionar, diario y finales. Todo se guarda dentro de S.nar. */
(function(){
const DOCS={
 numeros:{t:'Transmisión numérica',x:'Una voz de mujer lee números en bucle: 4-1-7, 9-0-2... y termina siempre igual: "Si alguien escucha, el Faro sigue encendido. No confiéis en el Cordón." Cada noche a la misma hora.'},
 pulsera:{t:'Pulsera de paciente',x:'Pulsera de plástico blanco en el brazo de un infectado: "AURORA BIOTECH · Ensayo L-7 · Voluntario 0319". Ningún hospital usa esos códigos. Alguien registró a estas personas antes del brote.'},
 silbato:{t:'El silbido',x:'Un tono agudo, casi inaudible, recorre la ciudad al anochecer. Los infectados giran la cabeza hacia él. Algo, o alguien, los llama. Después de la señal, la horda se detiene ante vuestra muralla y espera.'},
 ibarra:{t:'Nota de la doctora Ibarra',x:'"Trabajé en Aurora doce años. Pensé que fabricábamos una cura. Cuando entendí lo que era Lázaro, ya no me dejaron salir." Ibarra no ha vuelto a hablar del tema sin que le tiemble la voz.'},
 convoy:{t:'Convoyes sin matrícula',x:'Camiones negros sin matrícula entraron en la ciudad la semana antes del Silencio. Los vecinos los vieron cargar cajas selladas en el hospital Santa Eulalia. Nadie volvió a ver a los conductores.'},
 ceniza1:{t:'Insignia gris',x:'Los "bandidos" de la carretera llevan un parche gris con una llama blanca bajo el chaleco. No son saqueadores: son contratistas. Su empresa se llama CENIZA y su trabajo es no dejar testigos.'},
 hospital:{t:'Diario de planta · Santa Eulalia',x:'"Día 3: el suero estabiliza las lesiones, pero al sexto día los pacientes dejan de hablar. Día 5: nos ordenan trasladarlos al sótano. Día 7: cerrad las puertas. No abráis aunque llamen."'},
 lazaro:{t:'PROYECTO LÁZARO',x:'Suero regenerativo neural de Aurora Biotech. Objetivo: revertir la muerte cerebral reciente. Resultado del ensayo L-7: los sujetos regeneran tejido pero pierden la voluntad. Nota al margen: "El Sujeto Cero no debe morir. Debe despertar."'},
 sujeto0:{t:'Sujeto Cero',x:'Ficha tachada con rotulador: sujeto cero, primer paciente tratado con Lázaro, en estado de coma inducido en el sótano del hospital. Última anotación: "Reacciona a la voz de su hija."'},
 faro:{t:'Quién es el Faro',x:'El Faro emite desde un viejo observatorio. Lo opera un ex-técnico de Aurora que huyó con copias del archivo. Dice que hay una forma de despertar a los infectados... y otra de hacer que obedezcan.'},
 purga:{t:'Orden de Fase Final',x:'Orden de Ceniza: "Fase final: eliminar todos los núcleos de supervivientes en el perímetro. Sin excepciones, sin rescates, sin testigos. Inicio: amanecer." Firmado: Coronel Brandt.'},
 traidor:{t:'Registro de transmisiones',x:'Alguien de vuestro refugio ha emitido tus coordenadas en una frecuencia militar, tres noches seguidas. No lo hacía por maldad: le prometieron medicinas para alguien enfermo.'},
 voss:{t:'Cinta del director Voss',x:'"Si estáis oyendo esto, el plan funcionó. La ciudad es el laboratorio perfecto: cerrada, medible, olvidable. Cuando termine, nadie podrá probar que existió." — Aldric Voss, director de Aurora.'},
 hija:{t:'La hija del Sujeto Cero',x:'El Sujeto Cero tiene una hija de nueve años que vive en la ciudad vieja. Los infectados no la atacan. Aurora lleva meses intentando atraparla porque su sangre responde a Lázaro.'},
 manifiesto:{t:'Albaranes L-7',x:'Doce albaranes firmados por Aurora: 400 dosis del suero Lázaro enviadas al sótano de Santa Eulalia. Destinatario: "Proyecto Valdecruz". Remite: A. Voss.'},
 pastor:{t:'El Pastor',x:'Emisor de ultrasonidos diseñado por Aurora para dirigir a los infectados. Un solo operador puede guiar una horda entera. Lo escribieron como arma de contención. Alguien lo usa como arma de ataque.'},
 gael:{t:'Ficha de Gael Ruiz',x:'Gael Ruiz, 46 años, jefe de seguridad de Aurora hasta el día del Silencio. Desertó al ver las órdenes de CENIZA. Encerrado en la comisaría durante meses. Conoce a Voss y la Torre Aurora.'},
 cordon:{t:'Las fosas del Cordón',x:'Fosas comunes cubiertas de cal tras el muro. Cada cuerpo tiene la pulsera blanca. No eran víctimas del brote: eran los sujetos del ensayo, eliminados por CENIZA cuando dejaron de ser útiles.'},
 brandt:{t:'Grabación de Brandt',x:'"Voss quiere todo limpio antes del amanecer del día cuarenta. Sin testigos, sin supervivientes, sin archivo. Si falla algo, empezad por quemar el hospital." — coronel Brandt, CENIZA.'},
 dormidos:{t:'Los dormidos',x:'Infectados que no atacan: pacientes de Lázaro en un estado intermedio. Giran la cabeza ante una voz concreta. Gael dice que Aurora los llamaba "los que esperan". Esperan a alguien.'},
 plan:{t:'Operación Valdecruz',x:'Contrato firmado: Valdecruz fue elegida por ser una ciudad cerrada, sin salida, con un solo hospital. Lázaro se probaría en vivo, con testigos controlados. Nadie debía sobrevivir para contarlo.'},
 lia:{t:'Lía',x:'Nueve años. Vive sola desde el Silencio con un gato. Dice que su padre duerme en el hospital y que le canta por las noches. Los infectados se apartan cuando ella pasa. No sabe por qué.'},
 voss2:{t:'La confesión de Voss',x:'"El Sujeto Cero es mi hijo. Lázaro iba a salvarlo. Cuando falló, quise ocultarlo. Cuando vi que Lía podía arreglarlo, quise controlarla. Ya no sé qué es lo que quiero."'},
 cura:{t:'Fórmula Epsilon',x:'La Fórmula Epsilon, hecha con la sangre de la hija, revierte el efecto de Lázaro. Un solo lote. Quien lo controle decide quién despierta y quién vuelve a ser persona.'}
};

/* Efectos reutilizables */
function addLog(s){S.nar.log.push({d:S.day,x:s})}
function addDoc(id){if(!DOCS[id]||S.nar.docs.includes(id))return'';S.nar.docs.push(id);S.nar.newd=1;const pi=!window.rpOn||rpOn();if(pi)S.res.rp=(S.res.rp||0)+4;return'<br>📄 Nuevo archivo: <b>'+DOCS[id].t+'</b>'+(pi?' (+4 puntos de investigación)':'')}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function narFx(fx){let t='';if(!fx)return t;
 if(fx.res)for(const k in fx.res){const v=fx.res[k];if(v>0&&(k==='food'||k==='water'))continue;S.res[k]=Math.max(0,Math.min(cap(),(S.res[k]||0)+v));t+='<br>'+(v>0?'+':'')+v+' '+(RN[k]||k)}
 if(fx.mor){S.ppl.forEach(p=>p.mor=Math.max(0,Math.min(100,(p.mor||50)+fx.mor)));}
 if(fx.fac)for(const k in fx.fac){S.fac[k]=(S.fac[k]||0)+fx.fac[k]}
 if(fx.flag)[].concat(fx.flag).forEach(f=>S.nar.f[f]=1);
 if(fx.hurt&&S.ppl.length){const p=rnd(S.ppl);p.hp=Math.max(5,p.hp-18);p.injury=Math.min(100,(p.injury||0)+35);t+='<br>'+p.n+' resulta herido.'}
 if(fx.ill&&S.ppl.length){const p=rnd(S.ppl);p.illness='fiebre';t+='<br>'+p.n+' cae enfermo.'}
 if(fx.sv){const q=fx.sv;if(S.ppl.length<pcap()){const p=mkP(q.prof||'Médico');p.n=q.n;p.sex=q.sex||'F';p.age=q.age||40;p.story=q.id;const h=S.bld.find(b=>b.type=='hall');p.x=p.tx=h?h.x+1:26;p.y=p.ty=h?h.y+h.h+1:30;S.ppl.push(p);t+='<br>👤 '+q.n+' se une al refugio.'}else t+='<br>(No hay sitio para '+q.n+' en el refugio.)'}
 if(fx.doc)[].concat(fx.doc).forEach(d=>t+=addDoc(d));
 if(fx.horde){setTimeout(()=>{if(!horde)startHorde(fx.horde[0],fx.horde[1])},1500);t+='<br>⚠ Se acerca una amenaza...'}
 if(fx.purga)S.nar.purga=S.day+fx.purga;
 if(fx.log)addLog(fx.log);
 return t}

/* Eventos de la historia. c = condición, o = opciones */
const EVS=[
{id:'e1',a:1,n:'Cuarenta días de silencio',c:()=>S.day>=1,x:'Hace cuarenta días las sirenas de Valdecruz se apagaron a las 3:14 de la madrugada, todas a la vez. Después vino el silencio, y después los muertos. Seis de vosotros seguís en pie en el refugio. Nadie sabe qué pasó esa noche. Lo único que recordáis con claridad es una cosa que os repetís a la hora de dormir:',
 o:[{t:'"Sobrevivir exige hacer lo que haga falta."',x:'Os endurecisteis. Se nota en las manos y en la mirada.',fx:{res:{metal:40,ammo:15},flag:'pragmatico',log:'Prólogo: el refugio decidió que sobrevivir está por encima de todo.'}},
    {t:'"Nadie se queda atrás."',x:'Lo que os mantiene unidos es quedaros juntos, aunque cueste más.',fx:{res:{food:30,meds:10},mor:8,flag:'humano',log:'Prólogo: el refugio decidió no abandonar a nadie.'}},
    {t:'"Quien se esconde, vive."',x:'Aprendisteis a no hacer ruido y a leer los silencios.',fx:{res:{wood:40,ammo:10},flag:'cauto',log:'Prólogo: el refugio decidió esconderse y observar.'}}]},
{id:'e2',a:1,n:'Estática',c:()=>S.day>=2,x:'De madrugada la radio de la cocina se enciende sola. Entre la estática, una voz de mujer lee números en bucle y termina siempre igual: "El Faro sigue encendido. No confiéis en el Cordón."',
 o:[{t:'Anotar los números y escuchar cada noche',x:'Escribís cada secuencia. Parece una clave, o unas coordenadas.',fx:{doc:'numeros',res:{elec:-4},log:'Una voz desconocida emite números por radio: el Faro.'}},
    {t:'Apagar la radio: puede atraer a los infectados',x:'Ahorráis batería, pero la voz queda sin respuesta.',fx:{res:{elec:8},flag:'sinradio',log:'Apagasteis la radio. El Faro quedó sin respuesta.'}}]},
{id:'e3',a:1,n:'La pulsera',c:()=>S.day>=4,x:'En la muralla encontráis un infectado caído. En la muñeca lleva una pulsera blanca con letras negras: "AURORA BIOTECH · Ensayo L-7". Ningún hospital usa esos códigos.',
 o:[{t:'Examinar el cuerpo',x:'Entre la ropa hay una tarjeta magnética y una nota con un teléfono.',fx:{doc:'pulsera',res:{metal:6},log:'Los infectados llevan pulseras de Aurora Biotech.'},r:.35,rx:{ill:1}},
    {t:'Quemar el cuerpo sin tocarlo',x:'Es más seguro, pero os quedáis con la duda.',fx:{res:{},log:'Quemasteis el cuerpo con una pulsera de Aurora sin examinarlo.'}}]},
{id:'e4',a:1,n:'Los que esperan',c:()=>S.hordeN>=1,x:'Tras el último ataque ocurrió algo raro. Los infectados que quedaban dejaron de avanzar y se quedaron inmóviles frente a la muralla, mirando hacia el norte, como si esperasen una orden. Al anochecer oís un silbido muy agudo.',
 o:[{t:'Enviar un explorador a seguir el sonido',x:'Vuelve pálido: el silbido viene de un altavoz oculto en una torre de telefonía.',fx:{doc:'silbato',hurt:1,log:'Los infectados responden a un silbido emitido desde una torre.'}},
    {t:'Reforzar la muralla y no salir',x:'Os quedáis dentro. El silbido se repite cada noche.',fx:{res:{wood:-20,metal:-10},doc:'silbato',mor:-3,log:'Reforzasteis la muralla ante el silbido de los infectados.'}}]},
{id:'e5',a:1,n:'La extraña del camino',c:()=>S.day>=8&&hallLv()>=2,x:'Una mujer de unos cuarenta años llega tambaleándose a la puerta. Va herida y lleva una bata gris rota con un logo: AURORA. Dice llamarse Marta Ibarra, doctora, y pide entrar. Asegura que "puede explicaros lo que pasó".',
 o:[{t:'Acogerla y curarla',x:'La doctora Ibarra os mira con alivio y con algo parecido al miedo. "Gracias. Pronto sabréis por qué os lo agradezco."',fx:{sv:{id:'ibarra',n:'Marta Ibarra',prof:'Médico',sex:'F',age:44},flag:'ibarra_in',res:{meds:-8},doc:'ibarra',log:'Marta Ibarra, ex-investigadora de Aurora, se une al refugio.'}},
    {t:'Interrogarla antes de dejarla pasar',x:'Os cuenta lo justo. Cuando por fin entra, no os perdona la desconfianza.',fx:{sv:{id:'ibarra',n:'Marta Ibarra',prof:'Médico',sex:'F',age:44},flag:['ibarra_in','ibarra_fria'],mor:-4,doc:'ibarra',log:'Ibarra entró en el refugio tras un interrogatorio. Desconfía.'}},
    {t:'No abrir la puerta',x:'La veis alejarse por el camino. Antes de perderse, grita un nombre: "Lázaro".',fx:{flag:'ibarra_out',mor:-6,log:'Rechazasteis a una doctora de Aurora. Gritó un nombre: Lázaro.'}}]},
{id:'e6',a:1,n:'Señal desde la gasolinera',c:()=>S.day>=11,x:'El Faro cambia de mensaje. Por primera vez dice algo que no son números: "Estación de servicio de la carretera vieja. Hay un superviviente que sabe lo del convoy. Id con cuidado: hay quien escucha."',
 o:[{t:'Preparar una expedición (Misión de campo 1)',x:'Anotáis el lugar. Necesitaréis un Centro de expediciones (ayuntamiento nivel 3) y un equipo de entre dos y cuatro personas.',fx:{log:'Objetivo: ir a la gasolinera de la carretera vieja.'}},
    {t:'Esperar a estar más fuertes',x:'La señal sigue ahí. Aguardará.',fx:{log:'Pospusisteis la ida a la gasolinera.'}}]},
{id:'e7',a:2,n:'El convoy negro',c:()=>S.story>=1,x:'El superviviente rescatado en la gasolinera habla casi sin respirar: la semana antes del Silencio vio camiones negros sin matrícula entrar al hospital Santa Eulalia. "Cargaban cajas selladas. Los conductores no salieron."',
 o:[{t:'Preguntarle qué había dentro',x:'No lo sabe. Pero dice que olían a desinfectante y que algo se movía dentro de una.',fx:{doc:'convoy',mor:-3,log:'Camiones sin matrícula llevaron cajas al hospital Santa Eulalia.'}},
    {t:'Dejarle descansar y no presionar',x:'Duerme doce horas seguidas. Al despertar os da los detalles por su cuenta.',fx:{doc:'convoy',mor:4,log:'El superviviente de la gasolinera habló del convoy negro.'}}]},
{id:'e8',a:2,n:'Bandidos con uniforme',c:()=>S.story>=2,x:'Entre los muertos de la emboscada encontráis un parche gris con una llama blanca cosida bajo el chaleco. No son bandidos: sus botas, sus armas y su disciplina son de otra cosa. Alguien os ha estado vigilando.',
 o:[{t:'Quedarse con su equipo',x:'Armas y munición de calidad militar. Pero ahora vais marcados.',fx:{res:{ammo:35,metal:10},doc:'ceniza1',flag:'equipo_ceniza',log:'Los bandidos eran contratistas de CENIZA.'}},
    {t:'Enterrarlos y borrar las huellas',x:'Pierdes el botín, pero reduces el rastro.',fx:{res:{ammo:8},doc:'ceniza1',mor:3,log:'Enterrasteis a los hombres de CENIZA para ocultar el rastro.'}}]},
{id:'e9',a:2,n:'Santa Eulalia',c:()=>S.story>=3,x:'En el sótano del hospital encontráis un diario de planta con letra apresurada: "Día 5: nos ordenan trasladar a los pacientes al sótano. Día 7: cerrad las puertas. No abráis aunque llamen."',
 o:[{t:'Leerlo en voz alta',x:'Nadie dice nada. Alguien rompe a llorar.',fx:{doc:'hospital',mor:-4,log:'El diario de Santa Eulalia cuenta cómo encerraron a los pacientes.'},
   ib:{in:'Marta Ibarra reconoce la letra: es la de una compañera. "Estuve aquí. Me llevaron a otra planta." Os cuenta que ayudó a diseñar Lázaro y que no pudo pararlo.',fx:{flag:'ibarra_confesa',mor:-2,log:'Ibarra confesó que participó en el diseño de Lázaro.'}}},
    {t:'Guardarlo para analizarlo más tarde',x:'Lo guardáis junto a las pulseras y los números.',fx:{doc:'hospital',log:'Guardasteis el diario de Santa Eulalia.'}}]},
{id:'e10',a:2,n:'Alguien está hablando',c:()=>S.day>=22&&hallLv()>=3,x:'La batería baja más rápido de lo normal. Alguien ha estado usando la radio por la noche. Cuando revisáis el registro, descubrís transmisiones en una frecuencia militar. Alguien del refugio os ha delatado.',
 o:[{t:'Investigar en silencio',x:'Tardáis días, pero encontráis al culpable: no actuaba por maldad. Le prometieron medicinas para alguien enfermo.',fx:{doc:'traidor',res:{elec:-8,ammo:-10},mor:-3,flag:'espia_visto',log:'Hubo un delator en el refugio. Actuaba por miedo.'}},
    {t:'Reunir a todos y exigir que hable',x:'Se hace un silencio terrible. Alguien confiesa entre lágrimas. Todos os miran distinto.',fx:{doc:'traidor',mor:-10,flag:'espia_visto',log:'El refugio se enfrentó al delator en público.'}},
    {t:'Fingir que no pasa nada',x:'Esa noche la radio vuelve a sonar. Al amanecer faltan suministros.',fx:{res:{ammo:-30,meds:-10,food:-20},mor:-6,flag:'espia_libre',log:'Ignorasteis al delator. Perdisteis suministros.'}}]},
{id:'e11',a:2,n:'El laboratorio',c:()=>S.story>=4,x:'El ordenador del laboratorio clausurado sigue encendido. Archivos y vídeos describen el PROYECTO LÁZARO: un suero para revertir la muerte cerebral reciente. En el último vídeo, un hombre con bata dice, mirando a cámara: "El Sujeto Cero no debe morir. Debe despertar."',
 o:[{t:'Copiar todo para el Faro',x:'Os llevaréis todo lo que podáis cargar. Tendrán que creeros.',fx:{doc:['lazaro','sujeto0'],res:{elec:20},flag:'archivo_faro',log:'Copiasteis el archivo completo del PROYECTO LÁZARO.'}},
    {t:'Destruir los servidores',x:'Es demasiado peligroso que caiga en manos de alguien. El humo sube lento.',fx:{doc:'lazaro',res:{elec:10},flag:'archivo_destruido',log:'Destruisteis los servidores del laboratorio. Solo recordáis lo esencial.'}}]},
{id:'e12',a:2,n:'El Faro responde',c:()=>S.story>=8,x:'En el observatorio, el técnico del Faro os ofrece su ayuda: "Sé cómo se despierta a los infectados. Y sé cómo se les hace obedecer. No dejéis que Ceniza descubra la primera." Os pide algo a cambio: que le dejéis quedarse como vuestro enlace por radio.',
 o:[{t:'Aceptar su alianza',x:'Os envía rutas seguras y suministros escondidos. Desde ahora el Faro habla con vosotros cada noche.',fx:{doc:'faro',res:{meds:30,ammo:20,food:30},flag:'faro_confiado',log:'Os aliasteis con el Faro, un técnico de Aurora.'}},
    {t:'Aceptar su ayuda pero no su alianza',x:'Os quedáis con lo que os da y nada más. El Faro lo entiende, con tristeza.',fx:{doc:'faro',flag:'faro_desconfiado',mor:2,log:'No confiasteis en el Faro.'}}]},
{id:'e13',a:3,n:'Orden de fase final',c:()=>S.story>=5,x:'En la base militar abandonada hay una orden firmada por el coronel Brandt, de CENIZA: "Fase final: eliminar todos los núcleos de supervivientes en el perímetro. Sin excepciones. Inicio: amanecer." La fecha está a una semana.',
 o:[{t:'Prepararse para resistir',x:'Tenéis siete días. La muralla debe aguantar lo que venga.',fx:{doc:'purga',purga:7,res:{ammo:30,metal:30},log:'CENIZA lanzará la Purga dentro de siete días. Preparaos.'}},
    {t:'Pedir ayuda a las otras facciones',x:'Nadie quiere pelear la guerra de otro, pero algunos os debían un favor.',fx:{doc:'purga',purga:7,fac:{mil:10,mer:10},res:{ammo:15},log:'Pedisteis ayuda para la Purga de CENIZA.'}}]},
{id:'n4',a:2,n:'Albaranes de Aurora',c:()=>S.story>=4,x:'Los albaranes del almacén son claros: 400 dosis de Lázaro enviadas al sótano de Santa Eulalia. Destinatario: "Proyecto Valdecruz". Si el sótano es el centro del experimento, hay que entrar en él algún día.',
 o:[{t:'Guardar los albaranes como prueba',x:'Quedan sellados junto al diario del hospital.',fx:{doc:'manifiesto',log:'Los albaranes de Aurora hablan de un "Proyecto Valdecruz".'}},
    {t:'Quemarlos: nadie debe encontrarlos',x:'Os quedáis con la información en la cabeza.',fx:{doc:'manifiesto',res:{},log:'Quemasteis los albaranes de Aurora.'}}]},
{id:'n7',a:2,n:'El Pastor',c:()=>S.story>=7,x:'El emisor de la torre se llama "Pastor". Aurora lo diseñó para contener infectados y alguien lo ha usado para dirigirlos contra los supervivientes. Podéis apagarlo para siempre o llevároslo y aprender a usarlo.',
 o:[{t:'Destruir el emisor',x:'El silbido cesa esa noche. Los infectados se dispersan, más impredecibles pero menos dirigidos.',fx:{doc:'pastor',flag:'pastor_off',mor:4,log:'Destruisteis el Pastor: los infectados ya no obedecen a nadie.'}},
    {t:'Llevarse el emisor al refugio',x:'Es un riesgo enorme, pero también la única forma de guiar a las hordas lejos de vosotros.',fx:{doc:'pastor',flag:'pastor_control',res:{elec:-10,metal:20},log:'Os quedasteis con el Pastor. Ahora podéis guiar a los infectados.'}}]},
{id:'n9',a:2,n:'Gael Ruiz',c:()=>S.story>=9,x:'Gael Ruiz sabe demasiado. Conoce los turnos de CENIZA, la Torre Aurora y el rostro de Voss. Lo que no sabe es si podéis confiar en él, y vosotros tampoco.',
 o:[{t:'Confiar en él y darle un arma',x:'Gael asiente. No habla, pero esa noche monta guardia sin que nadie se lo pida.',fx:{sv:{id:'gael',n:'Gael Ruiz',prof:'Soldado',sex:'M',age:46},doc:'gael',flag:'gael_confia',mor:3,log:'Gael Ruiz, ex jefe de seguridad de Aurora, se une al refugio.'}},
    {t:'Vigilarlo de cerca hasta ganarse la confianza',x:'Entiende la prudencia. Acepta ser vigilado.',fx:{sv:{id:'gael',n:'Gael Ruiz',prof:'Soldado',sex:'M',age:46},doc:'gael',flag:'gael_vigilado',log:'Gael Ruiz se une al refugio, vigilado.'}}]},
{id:'n10',a:3,n:'Las fosas del Cordón',c:()=>S.story>=10,x:'Las fosas estaban llenas de personas con pulsera blanca. No eran víctimas del brote, sino los sujetos de un ensayo que ya no servían. Algunos de los vuestros no pueden dejar de pensar en ello.',
 o:[{t:'Dar sepultura a los cuerpos',x:'Tardáis un día entero. Al terminar, nadie habla, pero todos sienten que fue lo correcto.',fx:{doc:'cordon',res:{wood:-30,food:-10},mor:8,log:'Enterrasteis a las víctimas del Cordón.'}},
    {t:'Continuar: no hay tiempo',x:'La misión es lo primero. Pero lo que visteis os acompañará.',fx:{doc:'cordon',mor:-6,log:'Dejasteis las fosas del Cordón sin enterrar.'}}]},
{id:'n11',a:3,n:'Brandt escapa',c:()=>S.story>=11,x:'Brandt ha huido a la ciudad vieja. En su tienda quedó una grabación: Voss exige limpiar todo antes del día cuarenta. Ya no hay marcha atrás: solo queda llegar a la Torre Aurora antes que ellos.',
 o:[{t:'Escuchar la grabación entera',x:'Al final, la voz de Voss se quiebra: "Que no la toquen a ella". ¿A quién se refiere?',fx:{doc:'brandt',log:'Brandt huyó. Voss pidió que "no la toquen a ella".'}}]},
{id:'n12',a:3,n:'Los dormidos',c:()=>S.story>=12,x:'En el metro visteis infectados que no atacan: "los que esperan". Gael recuerda que Aurora los llamaba así. Esperan a alguien. Una voz concreta, dice la nota de la pulsera.',
 o:[{t:'Contárselo al refugio',x:'La idea de que no todos los infectados son iguales os incomoda y os da esperanza a la vez.',fx:{doc:'dormidos',mor:2,log:'Algunos infectados esperan una voz que los despierte.'}},
    {t:'Mantenerlo en secreto hasta saber más',x:'Algunas verdades necesitan un momento mejor.',fx:{doc:'dormidos',log:'Guardasteis en secreto lo de los dormidos.'}}]},
{id:'n13',a:3,n:'Operación Valdecruz',c:()=>S.story>=13,x:'El contrato de Aurora no deja dudas: Valdecruz fue elegida como ciudad-laboratorio. El experimento no falló: se descontroló. Voss hizo desaparecer a todos los testigos... excepto a una niña.',
 o:[{t:'Hacerlo público cuando llegue el momento',x:'Ahora sabéis qué hacer con la verdad.',fx:{doc:'plan',flag:'plan_publico',log:'Descubristeis la Operación Valdecruz.'}},
    {t:'Ocultarlo por ahora para proteger a la niña',x:'Quizá el mundo no esté preparado.',fx:{doc:'plan',flag:'plan_secreto',log:'Descubristeis la Operación Valdecruz y decidisteis guardar el secreto.'}}]},
{id:'n14',a:3,n:'Lía',c:()=>S.story>=14,get x(){return (S.nar.f.mochila_lia?'Lleváis la mochila de niño del Cordón y ella la reconoce al instante: "Es de mi amigo Nico". ':'')+this._x},_x:'La niña se agarra a la mano de la doctora, o a la de Gael, o a la de quien esté cerca. No llora. Solo pregunta: "¿Podemos llevarnos al gato?" Los infectados que os rodean se apartan sin que nadie se lo pida.',
 o:[{t:'Llevarla al refugio',x:'Se queda a vuestro lado. Quizá no sepa lo que significa ser la clave de todo, pero lo siente.',fx:{sv:{id:'lia',n:'Lía',prof:'Recolector',sex:'F',age:9},doc:'lia',flag:'lia_in',mor:6,log:'Lía, hija del Sujeto Cero, se une al refugio con su gato.'}}]},
{id:'n15',a:3,n:'Voss',c:()=>S.story>=15,x:'Voss no huye. Os recibe en su despacho, con una taza de café frío. "El Sujeto Cero es mi hijo. Lázaro iba a salvarlo. Cuando falló, quise ocultarlo. No pido perdón. Solo os pido que no lo despertéis."',
 o:[{t:'Detenerlo y juzgarlo',x:'Lo entregáis al refugio. Será juzgado por lo que hizo, delante de quienes lo sufrieron.',fx:{doc:'voss2',flag:'voss_juicio',mor:5,log:'Voss fue detenido para ser juzgado.'}},
    {t:'Dejarlo en su torre, solo',x:'Voss se queda donde quiso quedarse. No volvéis a verlo.',fx:{doc:'voss2',flag:'voss_solo',log:'Dejasteis a Voss en la Torre Aurora.'}},
    {t:'Matarlo',x:'Ocurre rápido. Nadie lo aplaude. Nadie lo lamenta tampoco.',fx:{doc:'voss2',flag:'voss_muerto',mor:-4,log:'Voss murió en su despacho.'}}]},
{id:'e14',a:3,n:'El origen',c:()=>S.story>=16,x:'En el sótano de Santa Eulalia, el Sujeto Cero duerme conectado a máquinas. A su lado está Lía, tranquila, con las manos en el cristal. Los infectados la rodean sin atacar. Entre las cintas de Voss encontráis la clave de todo: "La ciudad es el laboratorio perfecto: cerrada, medible, olvidable". Lía murmura: "Si le canto, me oye".',
 o:[{t:'Dejar que Lía cante',x:'Dice: "Mi padre no quiere hacer daño a nadie. Mi sangre le hace volver." La Fórmula Epsilon existe.',fx:{doc:['voss','hija','cura'],log:'Conocisteis a la hija del Sujeto Cero. Su sangre es la clave.'}}]},
{id:'e15',a:3,n:'El destino de Valdecruz',c:()=>S.story>=16&&S.nar.seen.e14!==undefined,x:'Tenéis en vuestras manos la cinta de Voss, el archivo de Lázaro y la Fórmula Epsilon. Lo que hagáis ahora decidirá qué recordará el mundo de Valdecruz.',
 o:[{t:'Emitir la verdad por todas las frecuencias',x:'El Faro se enciende. Durante tres noches, todas las radios cuentan lo que Aurora hizo. El Cordón se agrieta.',fx:{flag:'fin_verdad',res:{meds:60,elec:60},mor:12,fac:{ref:20,mer:10},log:'FINAL: la verdad salió a la luz.'}},
    {t:'Destruir el archivo y la cepa',x:'Quemáis las pruebas para que nadie vuelva a usarlas. Pierdes la verdad, ganas la paz.',fx:{flag:'fin_fuego',mor:8,res:{},fac:{ref:10},log:'FINAL: quemasteis el archivo de Lázaro.'}},
    {t:'Guardar la fórmula y decidir quién despierta',x:'Tenéis poder y una responsabilidad que ya nadie más quiere. Algunos os miran con miedo.',fx:{flag:'fin_cura',res:{meds:120},mor:-6,fac:{mer:20,mil:20},log:'FINAL: guardasteis la Fórmula Epsilon.'}}]}
];

{const e15=EVS.find(e=>e.id==='e15');const base=e15.o;Object.defineProperty(e15,'o',{get(){const f=S.nar.f,o=base.slice();
 if(f.lia_in&&(f.comp_n||0)>=4)o.push({t:'Dejar que Lía despierte al Sujeto Cero',x:'Lía canta. Durante un minuto no pasa nada. Luego, una mano se mueve. Lázaro no era la cura: era la voz de ella. Hay un hombre despierto, confundido, que pregunta por su hija.',fx:{flag:'fin_despertar',mor:15,res:{meds:80},fac:{ref:20},log:'FINAL: Lía despertó a su padre.'}});
 if((f.comp_n||0)>=8&&(f.prisionero_libre||f.gael_confia||f.lia_in))o.push({t:'Pedir ayuda a todos los que salvasteis',x:'Llegan por radio, a pie y en camiones: supervivientes que recordáis uno a uno. Juntos hacéis imposible que Aurora vuelva a encubrir nada.',fx:{flag:'fin_aliados',mor:15,res:{food:100,meds:80,metal:80},fac:{ref:25,mer:15},log:'FINAL: los que salvasteis os salvaron a vosotros.'}});
 if((f.prag_n||0)>=8&&f.pastor_control)o.push({t:'Usar el Pastor para despejar y reclamar la ciudad',x:'Los infectados abandonan Valdecruz en una marea silenciosa. La ciudad es vuestra. Nadie pregunta a qué precio.',fx:{flag:'fin_dominio',mor:-4,res:{metal:150,},fac:{mil:30},log:'FINAL: reclamasteis Valdecruz con el Pastor.'}});
 return o},configurable:true})}

/* Pequeñas historias de ambiente (opcionales, aparecen de vez en cuando) */
const SIDE=[
{id:'s1',n:'El perro de la valla',x:'Un perro flaco os observa desde el camino, con una correa rota. No ladra. Solo mira.',o:[{t:'Darle de comer',x:'Come en silencio y se queda dormido en la puerta. Alguien le pone nombre.',fx:{res:{food:-5},mor:5}},{t:'Ignorarlo',x:'Al día siguiente ya no está.',fx:{}}]},
{id:'s2',n:'Cuaderno de un niño',x:'Entre los escombros hay un cuaderno de colegio. Dibujos de una casa, una familia y una frase repetida: "mamá dice que no salgamos".',o:[{t:'Guardarlo en el refugio',x:'Alguien lo deja en un estante. Nadie lo menciona, pero todos lo han mirado.',fx:{mor:3}},{t:'Dejarlo donde estaba',x:'Algunas cosas no son para llevarse.',fx:{}}]},
{id:'s3',n:'Música en la noche',x:'Una noche se oye un violín lejano, muy suave. Parece venir de la ciudad vieja. Dura unos minutos y se apaga.',o:[{t:'Salir a escuchar',x:'Os quedáis bajo las estrellas. Hacía semanas que nadie reía.',fx:{mor:6}},{t:'Cerrar las ventanas',x:'No sabéis si era una trampa. Probablemente no.',fx:{}}]},
{id:'s4',n:'Mapa viejo',x:'Un superviviente os ofrece un mapa dibujado a mano con rutas, pozos y tres cruces rojas. "Fue de mi hermano".',o:[{t:'Comprar el mapa',x:'Tiene mejor información que cualquier radio.',fx:{res:{food:-15,wood:-15,meds:8}}},{t:'Rechazar la oferta',x:'Se marcha con su mapa y su historia.',fx:{}}]},
{id:'s5',n:'Una carta sin sobre',x:'En un buzón destrozado hay una carta. Dice: "Si lees esto, Valdecruz ya no existe. Pero yo sí. Buscadme en la torre".',o:[{t:'Anotar el mensaje',x:'Puede ser una pista, o puede ser nada.',fx:{log:'Una carta sin firma habla de una torre.'}},{t:'Quemarla',x:'Demasiado peligro para un trozo de papel.',fx:{}}]}
];

/* ---------- Estado ---------- */
function narInit(){if(!S.nar)S.nar={f:{},log:[],docs:[],seen:{},newd:0,next:0};if(!S.nar.f)S.nar.f={};if(!S.nar.seen)S.nar.seen={};if(!S.nar.docs)S.nar.docs=[];if(!S.nar.log)S.nar.log=[]}
function narBusy(){return titleOpen()||$('pan').style.display==='block'||!!placing||(typeof fading!=='undefined'&&fading)||horde||S.over||S.exp}
let curEv=null;
function evById(id){return EVS.concat(SIDE).find(e=>e.id===id)}
function narTick(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return;narInit();
 /* Purga programada */
 if(S.nar.purga&&S.day>=S.nar.purga&&!S.nar.purgaDone&&!horde&&!S.exp){S.nar.purgaDone=1;addLog('La Purga de CENIZA ha empezado.');startHorde('La Purga de Ceniza',{z:14+Math.min(20,S.hordeN),b:6,s:2,f:1,r:3});return}
 if(narBusy())return;
 const ev=EVS.find(e=>S.nar.seen[e.id]===undefined&&e.c());
 if(ev){narOpen(ev);return}
 /* Historia de ambiente cada ~3 días */
 if(S.day>=3&&S.day>(S.nar.sideDay||0)+3&&Math.random()<.15){const left=SIDE.filter(e=>S.nar.seen[e.id]===undefined);if(left.length){S.nar.sideDay=S.day;narOpen(rnd(left))}}
}catch(e){console.warn('nar',e)}}
/* Mensajes informativos: solo texto (sin elegir ni recompensas). Siguen con opciones únicamente las decisiones reales
   (reclutar, cambiar facciones, la Purga o banderas que cambian los finales). */
const KEYF=new Set(['albor_juicio','albor_libre','albor_muerta','ciudades_avisadas','conductor_libre','consejo_publico','dormidos_libres','espia_visto','faro_confia','faro_confiado','fin2_alianza','fin2_control','fin2_despertar','fin2_destruir','fin_aliados','fin_cura','fin_despertar','fin_dominio','fin_fuego','fin_verdad','gael_confia','gato','ibarra_in','lia_in','mochila_lia','pastor_control','planta_destruida','prisionero_libre','radio_diaria','voss_juicio']);
function isInfo(ev){let o;try{o=ev.o||[]}catch(e){return false}return o.length>0&&o.every(q=>{const f=q.fx||{};if(f.sv||f.fac||f.purga)return false;return![].concat(f.flag||[]).some(x=>KEYF.has(x))})}
window.narIsInfo=isInfo;
function narInfo(){const ev=curEv;if(!ev)return;narInit();S.nar.seen[ev.id]=0;let doc=null;try{ev.o.forEach(q=>{if(!doc&&q.fx&&q.fx.doc)doc=q.fx.doc})}catch(e){}
 if(doc)narFx({doc});addLog(ev.n);curEv=null;try{save()}catch(e){}hide();if(doc&&DOCS[doc])toast('📄 Nuevo archivo: '+DOCS[doc].t);narBadge()}
window.narInfo=narInfo;
function narOpen(ev){curEv=ev;sfx&&sfx('click');const kick=ev.a?'<small style="color:#c9a24a;letter-spacing:.14em">'+['','ACTO I · SILENCIO','ACTO II · AURORA','ACTO III · ORIGEN','ACTO IV · EL CONSEJO','ACTO V · LOS NUEVE'][ev.a]+'</small>':'<small style="color:#9aa58a;letter-spacing:.14em">HISTORIA</small>';
 show(ev.n,(window.SCN?SCN.tag(ev.a?'act'+ev.a:'nar',''):'')+kick+'<p style="margin:10px 0;line-height:1.5">'+ev.x+'</p>'+(isInfo(ev)?btn('Entendido','narInfo()'):ev.o.map((o,i)=>btn(o.t,'narPick('+i+')')).join('')))}
function narPick(i){const ev=curEv;if(!ev)return;narInit();const o=ev.o[i];S.nar.seen[ev.id]=i;let fx=o.fx,t='';
 if(o.r&&Math.random()<o.r&&o.rx)t+=narFx(o.rx);
 t+=narFx(fx);
 let extra='';if(o.ib){const f=S.nar.f.ibarra_in;if(f)extra='<p style="margin:10px 0;border-left:3px solid #c9a24a;padding-left:10px"><i>'+o.ib.in+'</i></p>'+narFx(o.ib.fx)}
 curEv=null;try{save()}catch(e){}
 show(ev.n,'<p style="margin:10px 0;line-height:1.5"><i>'+o.x+'</i></p>'+extra+(t?'<p style="color:#bcd0a0">'+t+'</p>':'')+btn('Continuar','hide()'));narBadge()}
function narBadge(){const b=document.getElementById('dnew');if(b)b.textContent=(S&&S.nar&&S.nar.newd)?' ●':''}
const endedA1=f=>f.fin_verdad||f.fin_fuego||f.fin_cura||f.fin_despertar||f.fin_aliados||f.fin_dominio,endedA2=f=>f.fin2_despertar||f.fin2_destruir||f.fin2_alianza||f.fin2_control;window.endedA1=endedA1;
function narObjective(){narInit();const n=S.nar;
 if(n.f.fin3_cenizas||n.f.fin3_juicio||n.f.fin3_alianza||n.f.fin3_trono||n.f.fin3_lia)return'Historia completada. El mundo sigue en pie y tú con él. Sigue sobreviviendo.';
 if(endedA2(n.f)&&!STORY[S.story])return'Historia completada. El mundo sigue en pie y tú con él. Sigue sobreviviendo.';
 if(endedA2(n.f)&&STORY[S.story]){const c=STORY[S.story];if(hallLv()<c.h)return'Siguiente misión: '+c.n+'. Mejora el ayuntamiento a nivel '+c.h+'.';return'Siguiente misión: '+c.n+'. Ábrela desde Mapa exterior o Expedición > Historia.'}
 if(endedA2(n.f)&&S.story>=48)return'Decide el destino del mundo.';
 if(S.story>=16&&!endedA1(n.f))return'Decide el destino de Valdecruz.';
 if(S.story>=28)return'Decide el destino de la red del Consejo.';
 if(n.purga&&!n.purgaDone)return'Sobrevive a la Purga de CENIZA (día '+n.purga+').';
 if(STORY[S.story]){const c=STORY[S.story];if(hallLv()<3)return'Mejora el ayuntamiento al nivel 3 para desbloquear las expediciones de la historia.';if(!cnt('expo'))return'Construye un Centro de expediciones para poder salir.';if(hallLv()<c.h)return'Siguiente misión: '+c.n+'. Mejora el ayuntamiento a nivel '+c.h+'.';return'Siguiente misión: '+c.n+'. Ábrela desde Mapa exterior o Expedición > Historia.'}
 return endedA1(n.f)?'Valdecruz resiste, pero el Consejo sigue ahí fuera. Mejora el ayuntamiento y prepárate.':'Sobrevive.'}
function narEnding(){const f=S.nar.f;let t='';
 if(window.narEnding3&&(f.fin3_cenizas||f.fin3_juicio||f.fin3_alianza||f.fin3_trono||f.fin3_lia))return narEnding3(f);
 if(window.narEnding2&&(f.fin2_despertar||f.fin2_destruir||f.fin2_alianza||f.fin2_control))return narEnding2(f);
 if(f.fin_verdad)t='La voz del Faro llegó a todas las radios del país. Aurora cayó, Voss fue juzgado en ausencia y el Cordón se desmoronó.';
 else if(f.fin_fuego)t='Quemasteis el archivo y la cepa. Nadie volverá a usar Lázaro, pero tampoco sabrá lo que ocurrió.';
 else if(f.fin_despertar)t='El Sujeto Cero despertó. Voss lloró al verlo. Aurora no sobrevivió a su testimonio. Lía aprendió que su voz valía más que cualquier fórmula.';
 else if(f.fin_aliados)t='Valdecruz no cayó sola: cada persona a la que salvasteis acudió. La verdad salió a la luz y nadie pudo silenciarla.';
 else if(f.fin_dominio)t='El Pastor despejó la ciudad. Sois los dueños de Valdecruz, y de lo que quede de ella.';
 else if(f.fin_cura)t='Guardasteis la Fórmula Epsilon. Ahora decidís quién despierta y quién no, y todos lo saben.';
 if(f.ibarra_in)t+=' La doctora Ibarra os acompañó hasta el final y por fin pudo dormir.';
 if(f.faro_confiado)t+=' El Faro nunca llegó a decir su nombre.';
 if(f.espia_visto)t+=' Del delator nadie volvió a hablar.';
 if((f.prud_n||0)>(f.agg_n||0)*1.5)t+=' Os conocieron como los que nunca arriesgaban de más.';
 if((f.agg_n||0)>(f.prud_n||0)*1.5)t+=' Os conocieron como los que siempre entraban primero.';
 if((f.comp_n||0)>=(f.prag_n||0)*1.5&&(f.comp_n||0)>=6)t+=' Los supervivientes de Valdecruz os recuerdan como los que nunca dejaron a nadie atrás.';
 if((f.prag_n||0)>=(f.comp_n||0)*1.5&&(f.prag_n||0)>=6)t+=' Los supervivientes de Valdecruz os recuerdan como los que hicieron lo necesario, sin mirar atrás.';
 if(f.prisionero_libre)t+=' Raúl Cano, el prisionero que liberasteis, volvió años después con una caravana de ayuda.';
 if(f.gato)t+=' El gato de Lía siguió durmiendo a los pies de su cama.';
 if(f.faro_confia)t+=' El Faro nunca dejó de emitir: su voz guió a decenas de supervivientes hasta vuestras puertas.';
 if(f.lia_in)t+=' Lía creció en el refugio y nunca dejó de cantar por las noches.';
 if(f.gael_confia)t+=' Gael Ruiz encontró por fin algo por lo que merecía la pena montar guardia.';
 if(f.voss_juicio)t+=' El juicio de Voss duró tres días y lo escucharon todos.';
 if(f.pastor_control)t+=' El Pastor sigue guardado en el refugio, por si alguna vez hace falta.';
 return t}
function narRecap(){const n=S.nar,st=S.story,d=n.docs;const K=[],Q=[];
 K.push('Hace cuarenta días las sirenas de Valdecruz se apagaron a las 3:14 y empezó el brote: el Silencio.');
 if(d.includes('pulsera'))K.push('Los infectados llevan pulseras de Aurora Biotech: eran voluntarios de un ensayo llamado L-7.');
 if(d.includes('silbato'))K.push('Un silbido ultrasónico dirige a las hordas.');
 if(st>=1)K.push('Camiones sin matrícula llevaron cajas selladas al hospital Santa Eulalia antes del brote.');
 if(st>=2)K.push('CENIZA, una empresa mercenaria, se hace pasar por bandidos. Trabaja para Aurora.');
 if(st>=3)K.push('En Santa Eulalia encerraron en un sótano a los pacientes tratados con un suero.');
 if(st>=4)K.push('Las cajas eran 400 dosis de Lázaro enviadas al "Proyecto Valdecruz".');
 if(st>=5)K.push('Lázaro revierte la muerte cerebral pero borra la voluntad. El primer paciente fue el Sujeto Cero.');
 if(st>=6)K.push('El Cordón no es una cuarentena: es una jaula. CENIZA tiene orden de purgar a los supervivientes.');
 if(st>=7)K.push('Un emisor llamado Pastor controla a los infectados. Lo diseñó Aurora.');
 if(st>=8)K.push('El Faro es un ex-técnico de Aurora que huyó con copias del archivo.');
 if(st>=9)K.push('Gael Ruiz, ex jefe de seguridad de Aurora, desertó al ver las órdenes de CENIZA.');
 if(st>=10)K.push('En las fosas del Cordón están los sujetos del ensayo, eliminados por CENIZA.');
 if(st>=11)K.push('El coronel Brandt, jefe de CENIZA, huyó a la ciudad vieja. Voss ordena limpiarlo todo.');
 if(st>=12)K.push('Los "dormidos" no atacan: esperan una voz concreta que los despierte.');
 if(st>=13)K.push('La Operación Valdecruz: la ciudad fue elegida como laboratorio cerrado. Nadie debía sobrevivir.');
 if(st>=14)K.push('Lía, hija del Sujeto Cero, es inmune a los infectados. Su sangre responde a Lázaro.');
 if(st>=15)K.push('El director Voss confiesa: el Sujeto Cero es su hijo y Lázaro iba a salvarlo.');
 if(st>=16)K.push('Lía y la Fórmula Epsilon pueden despertar al Sujeto Cero. Tú decides qué hacer con ello.');
 if(st<5)Q.push('¿Qué es el suero que usaron en los pacientes?');
 if(st<6)Q.push('¿Por qué el ejército selló la ciudad y no dejó salir a nadie?');
 if(st<7)Q.push('¿Quién dirige a los infectados con el silbido?');
 if(st<8)Q.push('¿Quién es el Faro y por qué os ayuda?');
 if(st<9)Q.push('¿Quién es realmente CENIZA?');
 if(st<13)Q.push('¿Por qué eligieron Valdecruz?');
 if(st<14)Q.push('¿Quién es el Sujeto Cero y por qué importa tanto?');
 if(st<15)Q.push('¿Quién es el director Voss?');
 if(st<16)Q.push('¿Se puede despertar a los infectados?');
 if(window.narRecapExtra)narRecapExtra(K,Q,st);
 return{K,Q}}
function diarioMenu(tab){narInit();S.nar.newd=0;narBadge();tab=tab||'obj';const n=S.nar;
 const tabs=btn('Objetivo','diarioMenu("obj")')+btn('Resumen','diarioMenu("res")')+btn('Diario ('+n.log.length+')','diarioMenu("log")')+btn('Archivos ('+n.docs.length+'/'+Object.keys(DOCS).length+')','diarioMenu("docs")');
 let h='<div style="display:flex;gap:6px;flex-wrap:wrap">'+tabs+'</div><hr style="border-color:#3a4a30">';
 if(tab==='obj'){h+='<p><b>Objetivo actual</b><br>'+narObjective()+'</p>';const e=narEnding();if(e)h+='<p style="border-left:3px solid #c9a24a;padding-left:10px"><i>'+e+'</i></p>';
  h+='<p><small>Eventos de la historia: '+EVS.filter(x=>n.seen[x.id]!==undefined).length+'/'+EVS.length+'</small></p>'}
 if(tab==='res'){const r=narRecap();h+='<p><b>Lo que sabéis</b></p>'+r.K.map(k=>'<p style="margin:5px 0">• '+k+'</p>').join('')+(r.Q.length?'<p style="margin-top:10px"><b>Preguntas abiertas</b></p>'+r.Q.map(k=>'<p style="margin:5px 0;color:#c9a24a">? '+k+'</p>').join(''):'<p style="margin-top:10px;color:#9fd08a"><b>Todas las preguntas han sido respondidas.</b></p>')}
 if(tab==='log'){h+=n.log.length?n.log.slice().reverse().map(l=>'<p style="margin:6px 0"><small style="color:#c9a24a">Día '+l.d+'</small><br>'+l.x+'</p>').join(''):'<p>Aún no hay entradas. Se escribirán según vayas tomando decisiones.</p>'}
 if(tab==='docs'){h+=n.docs.length?n.docs.map(id=>btn('📄 '+DOCS[id].t,'docRead("'+id+'")')).join(''):'<p>Aún no has encontrado archivos. Se consiguen con la historia y las expediciones.</p>'}
 show('Diario del refugio',h)}
function docRead(id){const d=DOCS[id];if(!d)return;show(d.t,'<p style="line-height:1.55;font-style:italic;border-left:3px solid #c9a24a;padding-left:10px">'+d.x+'</p>'+btn('Volver a Archivos','diarioMenu("docs")'))}

window.narTick=narTick;window.narOpen=narOpen;window.narDocs=DOCS;window.narFx=narFx;window.narEvs=EVS;window.addLog=addLog;window.diarioMenu=diarioMenu;window.docRead=docRead;window.narPick=narPick;window.narObjective=narObjective;
window.narOnChapter=function(i){narInit();const m={0:['convoy'],1:[],2:[],3:[],4:[],5:[]};if(i===0)addLog('Rescatasteis a un superviviente en la gasolinera.');if(i===1)addLog('Recuperasteis el camión blindado de la caravana.');if(i===2)addLog('Entrasteis en el hospital Santa Eulalia.');if(i===3)addLog('El laboratorio de Aurora ya no guarda secretos.');if(i===4)addLog('Tomasteis la base militar.');if(i===5)addLog('Llegasteis al origen del brote.');S.nar.newd=1;narBadge()};
setInterval(narTick,2500);
})();
