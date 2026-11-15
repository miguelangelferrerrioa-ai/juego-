/* ===== Dead Town · ACTO III: "Los Nueve" (capítulos 29–48, ayuntamiento 16–25) ===== */
(function(){
'use strict';
const W=WP,O=window.OUTFITS,V=window.OUTV;
const addO=(n,def,b,v,c)=>{if(!O[n]){O[n]={n,def,b,r:'X',c};V[n]=v}};
const addW=(n,v,b,c)=>{if(!W.some(w=>w.n===n))W.push({n,v,c,b,r:'X'})};
/* --- equipo de las nueve sillas (se consigue en la misión; el plano permite fabricarlo después) --- */
addW('Rifle Lanz',50,{Soldado:7,Médico:2},{metal:320,comp:90,chem:60});
addW('Rifle de carril Hahn',54,{Soldado:7,Mecánico:3},{metal:380,comp:100,chem:60});
addW('Escopeta de los Pardos',58,{Soldado:8},{metal:420,comp:110,chem:70});
addW('Fusil de enfoque Roca',62,{Soldado:8,Explorador:3},{metal:460,comp:120,chem:80});
addW('Rifle del Silencio',66,{Soldado:8,Explorador:4},{metal:500,comp:140,chem:90});
addW('Subfusil de marea',70,{Soldado:9},{metal:540,comp:150,chem:100});
addW('Rifle de deriva Mori',74,{Soldado:9,Explorador:4},{metal:580,comp:170,chem:110});
addW('Fusil de cobre Salgado',78,{Soldado:10},{metal:640,comp:190,chem:120});
addW('Rifle del Último Turno',85,{Soldado:11,Explorador:5},{metal:720,comp:220,chem:140});
addO('Bata blindada Lanz',15,{Médico:8,Científico:6},['#e8ece8','#b4bcb4','#5ae6a8','coat'],{metal:260,comp:80,chem:60});
addO('Chaqueta de maquinista',16,{Mecánico:8,Constructor:5},['#3a4f6a','#243448','#e8b04a','vest'],{metal:300,comp:90,chem:60});
addO('Coraza parda',18,{Soldado:9},['#6a5a3a','#463a24','#d8c27a','vest'],{metal:340,comp:100,chem:70});
addO('Traje de gala blindado',17,{Explorador:7,Cocinero:4},['#2a2a34','#16161e','#d8b04a','coat'],{metal:320,comp:100,chem:70});
addO('Hábito de ceniza',19,{Médico:7,Soldado:5},['#8a8a86','#5e5e5a','#f2f2ee','coat'],{metal:340,comp:110,chem:80});
addO('Traje de buzo táctico',20,{Explorador:8,Mecánico:5},['#1f4a5a','#12303c','#5ae6ff','tactical'],{metal:380,comp:120,chem:90});
addO('Manto de drones',21,{Soldado:8,Explorador:6},['#2a3238','#161c20','#ff5a6a','tactical'],{metal:400,comp:130,chem:90});
addO('Exoesqueleto de mina',23,{Constructor:9,Soldado:6},['#a8742a','#6e4a18','#2a2a2a','vest'],{metal:460,comp:150,chem:100});
addO('Corona de acero',26,{Soldado:6,Médico:6,Científico:6,Mecánico:6,Explorador:6,Constructor:6,Agricultor:4,Cocinero:4,Recolector:4},['#d8dde2','#8f98a2','#ffd84a','vest'],{metal:560,comp:180,chem:120});
const wi=n=>W.findIndex(w=>w.n===n);
/* los planos de las piezas se conceden junto a la recompensa del capítulo */
(function(){const o=window.storyReward;if(typeof o!=='function')return;window.storyReward=function(r){let h=o.apply(this,arguments);if(r&&r.plan){S.bp=S.bp||{};r.plan.forEach(n=>S.bp[n]=1);h+=', planos: '+r.plan.join(', ')}return h}})();
const D=window.narDocs;
Object.assign(D,{
lista9:{t:'Los nueve nombres',x:'Nueve sillas, nueve nodos. Cada accionista del Consejo gobierna un territorio desde una fortaleza propia: Mirasol, Alcor, Peñavera, Cuatro Torres, Santa Brígida, El Vado, Puerto Gris, la Isla de Cobre y la Cúpula. Si cae una, las demás lo sabrán.'},
requiem:{t:'Protocolo Réquiem',x:'La red de torres se apagó, pero el Consejo guardaba una copia. Réquiem no despierta a los dormidos: los ordena. Cada silla tiene una llave, y las nueve juntas abren la Cúpula.'},
lanz:{t:'Eduardo Lanz',x:'Farmacéutico. Fabricaba Lázaro por encargo y cobraba por lote. En su cuna de cristal guardaba muestras vivas de todas las ciudades.'},
hahn:{t:'Brigitte Hahn',x:'Logística. Mueve trenes, camiones y gente. Nunca ha disparado un arma y nunca ha dejado de dar una orden.'},
ardiles:{t:'General Ardiles',x:'Retirado y rencoroso. Dirige a los Pardos, mercenarios que cobran en munición y en miedo.'},
roca:{t:'Selene Roca',x:'Medios y propaganda. Decide qué ciudades saben qué. Tiene un estudio desde el que habla a cuatro ciudades a la vez.'},
ambrosio:{t:'Padre Ambrosio',x:'Cree que los dormidos son santos. Su orden, los Hermanos del Silencio, los cuida, los alimenta y mata a quien los despierta.'},
saenz:{t:'Raimundo Sáenz',x:'Agua y presas. El Vado bebe de lo que él decida. Hace meses que decide mal.'},
mori:{t:'Haruka Mori',x:'Naviera y drones. Su flota patrulla la costa sin tripulación. Nadie ha visto nunca a quien las pilota.'},
salgado:{t:'Víctor Salgado',x:'Minería. Sus máquinas no se cansan y sus mineros tampoco, porque ya no son del todo mineros.'},
vidal:{t:'Anselmo Vidal',x:'Presidente del Consejo. Fundó Aurora Biotech con una promesa: «curar el mundo». Lleva cuarenta años cumpliéndola a su manera.'}});
/* --- capítulos --- */
const X=(...a)=>a.map(q=>({t:q[0],a:q[1],b:q[2]}));
const CH3=[
{n:'Cap. 29 · El día después',h:16,g:4,loc:{x:40,y:44,icon:'🌅',p:'Capital · plaza de las antenas'},z:['z','s'],
 intro:'Las torres callan, pero el mundo no. Entre los restos de la sala de emisión aparece una lista cifrada: nueve nombres, nueve lugares. El Consejo no era una sala. Era nueve.',
 evs:X(['Las calles de la capital se llenan de gente que mira al cielo.','Organizar un cordón','Dejar que se dispersen'],['Un técnico del Consejo ofrece descifrar la lista a cambio de protección.','Protegerlo','Descifrarla sin él'],['Una patrulla desconocida os sigue a distancia.','Tenderle una emboscada','Cambiar de ruta'],['El disco con la lista está dentro de un camión blindado.','Asaltarlo','Esperar a que se detenga'],['Gael pide que no os separéis. Valeria pide que lo hagáis, para cubrir más ciudades.','Mantener el grupo unido','Dividir las fuerzas']),
 l:{metal:[60,120],comp:[8,16],chem:[4,10],ammo:[20,40]},outro:'La lista se abre: Lanz, Hahn, Ardiles, Roca, Ambrosio, Sáenz, Mori, Salgado y Vidal. Debajo, una frase: «Réquiem se activa cuando caiga la primera silla». Os quedan ocho ciudades y un reloj.',r:{res:{metal:150,comp:30,chem:20,meds:60},plan:['Rifle de plasma']}},
{n:'Cap. 30 · Los lotes huérfanos',h:16,g:4,loc:{x:22,y:52,icon:'📦',p:'Almacenes de la ruta sur'},z:['z','f','s'],
 intro:'Antes de caer, la red repartió lotes de Epsilon-2 por toda la zona. Si alguien los usa, Réquiem tendrá soldados de sobra. Hay que encontrarlos primero.',
 evs:X(['Un almacén tiene los contenedores marcados con un número de silla.','Cargar todo','Quemarlo en el sitio'],['Un grupo de saqueadores intenta venderlos.','Pagarles','Quitárselos'],['Una cámara frigorífica sigue encendida: dentro, dormidos.','Abrirla','Dejarla cerrada'],['Un camión parte con un lote hacia el norte.','Perseguirlo','Cortarle la carretera'],['Queda un lote en un tren varado.','Subir a por él','Volar los vagones']),
 l:{metal:[70,130],comp:[10,18],chem:[8,16],meds:[10,20]},outro:'Recuperáis los lotes. En los contenedores hay un sello distinto: cada silla firma lo suyo. Os dais cuenta de que las nueve no se llevan bien entre sí, y de que eso se puede usar.',r:{res:{metal:160,comp:40,chem:40,meds:60}}},
{n:'Cap. 31 · Mirasol, la ciudad dormida',h:17,g:5,loc:{x:12,y:16,icon:'🏙️',p:'Mirasol'},z:['z','z','s'],
 intro:'Mirasol parece intacta. Las luces funcionan, los parques están cuidados y no hay un alma. Todos duermen en las plantas altas, conectados a máquinas.',
 evs:X(['Las calles están limpias, demasiado.','Avanzar en silencio','Fortificar una esquina'],['Un hospital entero respira al mismo compás.','Desconectar una sala','No tocar nada'],['Un niño despierto os observa desde un balcón.','Hablarle','Ignorarlo'],['Las puertas de la farmacia central están selladas con lacre.','Forzarlas','Buscar otra entrada'],['Una voz suena por megafonía: «Bienvenidos a la cuna».','Responder','Cortar el altavoz']),
 l:{meds:[30,60],chem:[10,20],comp:[10,20]},outro:'La voz os guía hasta una torre de cristal en el centro. Es la Cuna de Lanz. Sabe que vais y os espera con las puertas abiertas.',r:{res:{meds:120,chem:40,comp:40}}},
{n:'Cap. 32 · La cuna de Lanz',h:17,g:5,loc:{x:14,y:20,icon:'🧪',p:'Mirasol · la Cuna'},z:['s','f','r'],
 intro:'Eduardo Lanz recibe como un anfitrión. Detrás de él, cien cápsulas con gente dormida. «Son mi obra», dice. «Y vais a destruirla».',
 evs:X(['Guardias con batas blindadas bloquean el pasillo.','Abrirse paso','Distraerlos con ruido'],['Las cápsulas empiezan a despertar a la vez.','Calmarlas','Desconectarlas'],['Lanz ofrece una cura a cambio de dejarle vivir.','Aceptar el trato','Rechazarlo'],['El laboratorio central se sella.','Forzar la puerta','Rodear por la ventilación'],['Lanz llega a la última cápsula con una llave en la mano.','Detenerle','Dejar que la abra']),
 l:{meds:[40,80],chem:[15,30],comp:[15,30],metal:[40,80]},outro:'Lanz cae, pero antes entrega la llave de su silla. Las cápsulas se abren una a una: la gente de Mirasol vuelve despacio, sin recordar nada. En la pared, un mapa de Alcor marcado en rojo.',r:{res:{meds:180,chem:70,comp:60,metal:120},wp:wi('Rifle Lanz'),out:'Bata blindada Lanz',plan:['Rifle Lanz','Bata blindada Lanz']}},
{n:'Cap. 33 · Alcor, la estación sin trenes',h:18,g:5,loc:{x:28,y:10,icon:'🚉',p:'Alcor'},z:['z','s','f'],
 intro:'Alcor vive de la estación. Los trenes no paran, pero siguen llegando: sin conductor, llenos de mercancía y de gente que no sabe adónde va.',
 evs:X(['Un tren pasa sin frenar.','Subir en marcha','Dejarlo pasar'],['La estación está tomada por empleados armados.','Negociar','Asaltar el andén'],['Un jefe de vía ofrece enseñar el mapa de la red.','Aceptarlo','Rechazarlo'],['Los desvíos se activan solos.','Cortar la corriente','Redirigir el tren'],['Un convoy de refugiados es desviado hacia una trampa.','Salvarlos','Seguir adelante']),
 l:{metal:[80,150],comp:[15,25],ammo:[30,60]},outro:'Entendéis cómo funciona Alcor: Hahn controla cada vía desde una torre de maniobras. Un tren sin freno viene hacia la ciudad cada hora.',r:{res:{metal:200,comp:50,ammo:100,meds:60}}},
{n:'Cap. 34 · El convoy fantasma de Hahn',h:18,g:5,loc:{x:30,y:14,icon:'🚆',p:'Alcor · torre de maniobras'},z:['s','s','f','r'],
 intro:'Brigitte Hahn nunca sale de su torre. Da órdenes por radio a trescientos trenes a la vez. Hay que cortar la línea desde dentro.',
 evs:X(['La torre solo se abre desde el andén central.','Forzar la puerta','Subir por la fachada'],['Cada piso tiene un panel de control distinto.','Desactivarlos uno a uno','Cortar la alimentación'],['Hahn manda un tren cargado de explosivos.','Detenerlo','Evacuar la estación'],['Un guardia le susurra a Hahn que os dejen pasar.','Seguirle el juego','No fiaros'],['Hahn aparece en la cima con un mando en cada mano.','Quitarle los mandos','Hacerle hablar']),
 l:{metal:[90,160],comp:[20,35],ammo:[40,70]},outro:'Hahn cae mientras intenta desviar un último tren. La llave de su silla estaba en el mando. Ahora Alcor tiene luz propia y ninguna orden del Consejo.',r:{res:{metal:250,comp:70,ammo:140,meds:70},wp:wi('Rifle de carril Hahn'),out:'Chaqueta de maquinista',plan:['Rifle de carril Hahn','Chaqueta de maquinista']}},
{n:'Cap. 35 · Peñavera bajo el estandarte pardo',h:19,g:5,loc:{x:50,y:12,icon:'🏔️',p:'Peñavera'},z:['s','s','f'],
 intro:'Peñavera es un pueblo de montaña con una sola carretera y un estandarte pardo en cada poste. Los Pardos controlan quién entra, quién sale y quién cobra.',
 evs:X(['Un puesto de control cobra peaje en munición.','Pagar','Forzar el paso'],['Un grupo de mercenarios os ofrece sus armas.','Aceptarlas','Rechazarlas'],['Las casas tienen centinelas en los tejados.','Silenciarlos','Cruzar por los patios'],['Una mujer pide ayuda: su hijo es rehén de los Pardos.','Ayudarla','Seguir el plan'],['Un pardo herido os dice dónde está el arsenal.','Fiaros','Verificarlo']),
 l:{ammo:[60,100],metal:[90,150],comp:[15,25]},outro:'El arsenal está bajo el cuartel. El general Ardiles lo vigila en persona y no ha perdido una guerra en veinte años. Esta será la primera.',r:{res:{ammo:200,metal:220,comp:60,meds:70}}},
{n:'Cap. 36 · El cuartel de Ardiles',h:19,g:5,loc:{x:52,y:16,icon:'🎖️',p:'Peñavera · el cuartel'},z:['s','s','s','r'],
 intro:'Ardiles espera en la sala de mando con un mapa de vuestra base. Lleva meses preparando este día.',
 evs:X(['Una pared de sacos y ametralladoras corta el patio.','Rodearla','Romperla con explosivos'],['Los Pardos lanzan una carga desde dos flancos.','Aguantar la línea','Replegaros'],['El general os llama por altavoz.','Escucharle','Ignorarle'],['Un depósito de munición arde.','Apagarlo','Aprovechar el caos'],['Ardiles sale solo, sin escolta.','Aceptar el duelo','Dispararle desde lejos']),
 l:{ammo:[80,130],metal:[100,170],comp:[20,35]},outro:'Ardiles cae sin una palabra. Los Pardos sueltan las armas y se quedan mirándoos. La tercera llave está en su guerrera. Os llevaréis también un buen cargamento.',r:{res:{ammo:260,metal:280,comp:80,meds:80},wp:wi('Escopeta de los Pardos'),out:'Coraza parda',plan:['Escopeta de los Pardos','Coraza parda']}},
{n:'Cap. 37 · Cuatro Torres, la ciudad que te mira',h:20,g:5,loc:{x:56,y:34,icon:'📡',p:'Cuatro Torres'},z:['z','s','f'],
 intro:'Cuatro Torres es una ciudad de pantallas. En cada esquina, una cámara y una pantalla con vuestras caras. Selene Roca ya os ha contado a su manera.',
 evs:X(['Las pantallas os llaman asesinos.','Taparlas','Responder por radio'],['Un periodista clandestino ofrece guiaros.','Seguirle','No fiaros'],['La plaza central proyecta un vídeo falso vuestro.','Desmentirlo','Cortar el proyector'],['Los vecinos os rodean con pancartas.','Hablarles','Pasar entre ellos'],['Una pantalla gigante muestra vuestra base.','Preocuparos','Ignorarla']),
 l:{elec:[30,60],comp:[20,35],chem:[10,20]},outro:'Roca controla las pantallas desde un estudio en la torre norte. Lo que decide ahí lo creen cuatro ciudades. Hay que entrar y emitir la verdad.',r:{res:{comp:70,chem:40,meds:80,metal:150}}},
{n:'Cap. 38 · El estudio de Selene Roca',h:20,g:5,loc:{x:58,y:36,icon:'🎙️',p:'Cuatro Torres · torre norte'},z:['s','f','s','r'],
 intro:'El estudio es una sala blanca con un plató, tres cámaras y un público de maniquíes. Roca os recibe con una sonrisa y un guion.',
 evs:X(['Guardias vestidos de presentadores bloquean el pasillo.','Abrirse paso','Fingir una entrevista'],['La emisión en directo os enfoca.','Decir la verdad en cámara','Cortar la señal'],['Roca ofrece un papel en su historia.','Aceptar para ganar tiempo','Rechazarlo'],['Un técnico llora detrás del decorado.','Ayudarle','Pedirle que huya'],['Roca intenta emitir vuestra muerte en falso directo.','Interrumpir la emisión','Ir a por ella']),
 l:{elec:[40,70],comp:[25,40],chem:[12,24]},outro:'Roca cae delante de las cámaras. La verdad llega a cuatro ciudades a la vez. En el plató queda su llave y un último mensaje: «Os necesito más de lo que creéis».',r:{res:{comp:90,chem:50,meds:90,metal:200},wp:wi('Fusil de enfoque Roca'),out:'Traje de gala blindado',plan:['Fusil de enfoque Roca','Traje de gala blindado']}},
{n:'Cap. 39 · Santa Brígida y el silencio',h:21,g:5,loc:{x:8,y:42,icon:'⛪',p:'Santa Brígida'},z:['z','z','f'],
 intro:'En Santa Brígida nadie habla. Ni los vivos ni los dormidos. Los Hermanos del Silencio caminan con hábito gris, cuidando de cada cuerpo que descansa en la nave de la iglesia.',
 evs:X(['Un hermano os pone el dedo en los labios.','Respetar el silencio','Hablar igualmente'],['Los dormidos están alineados en bancos.','Despertar a uno','Dejarlos dormir'],['Un grupo de fieles bloquea la puerta.','Rodearlos','Pasar por la fuerza'],['Un hermano rompe su voto para avisaros.','Escucharle','Desconfiar'],['Las campanas empiezan a sonar.','Cortarlas','Esperar a ver qué pasa']),
 l:{meds:[40,70],chem:[15,25],comp:[15,25]},outro:'Un hermano anciano os confiesa que el Padre Ambrosio no cree que los dormidos estén vivos: cree que están ocupados. Esperan algo. Y él también.',r:{res:{meds:140,chem:50,comp:60,metal:150}}},
{n:'Cap. 40 · La abadía de los Hermanos',h:21,g:5,loc:{x:6,y:46,icon:'🕯️',p:'Santa Brígida · abadía'},z:['f','s','r','z'],
 intro:'La abadía está excavada en la roca. Cada pasillo es una nave y cada nave un coro de dormidos que murmuran al mismo tiempo.',
 evs:X(['Los Hermanos os atacan sin gritar.','Defenderos','Huir por el claustro'],['Los dormidos se levantan al ver las armas.','Dispararles','Retiraros'],['Ambrosio os espera con las manos abiertas.','Escucharle','Atacar'],['El coro empieza a cantar y los dormidos obedecen.','Taparos los oídos','Cantar con ellos'],['Ambrosio sube al altar con una llave en la mano.','Detenerle','Dejarle hablar']),
 l:{meds:[50,90],chem:[18,30],comp:[20,35]},outro:'Ambrosio cae sin resistirse. Los dormidos se sientan a su alrededor, sin despertar, y la abadía queda en silencio. La llave de la quinta silla estaba bajo el altar.',r:{res:{meds:200,chem:70,comp:80,metal:200},wp:wi('Rifle del Silencio'),out:'Hábito de ceniza',plan:['Rifle del Silencio','Hábito de ceniza']}},
{n:'Cap. 41 · El Vado, la presa envenenada',h:22,g:5,loc:{x:30,y:56,icon:'💧',p:'El Vado'},z:['z','s','f'],
 intro:'El Vado depende de una presa. Alguien está ensuciando el agua con un compuesto del Consejo, y la gente enferma sin saber por qué.',
 evs:X(['Los vecinos hacen cola con cubos.','Repartir agua limpia','Investigar la fuente'],['Un técnico confiesa que obedece órdenes.','Protegerle','Entregarlo a los vecinos'],['La compuerta sur está cerrada con candado.','Forzarlo','Buscar la llave'],['Un grupo armado vigila la orilla.','Atacar','Rodear por el bosque'],['Un vecino quiere vengarse de todos los técnicos.','Calmarle','Dejarle hacer']),
 l:{chem:[20,35],meds:[40,70],metal:[80,140]},outro:'La presa es de Raimundo Sáenz. Desde una sala de control bajo el agua decide qué ciudades beben. Hay que cortarle el grifo antes de que decida otra cosa.',r:{res:{chem:60,meds:150,metal:200,comp:60}}},
{n:'Cap. 42 · La compuerta de Sáenz',h:22,g:5,loc:{x:32,y:60,icon:'🌊',p:'El Vado · sala de control'},z:['s','f','z','r'],
 intro:'La sala de control es una burbuja de cristal bajo seis metros de agua. Sáenz os observa desde dentro y abre las compuertas una a una.',
 evs:X(['Las compuertas se abren y el agua sube.','Subir por las pasarelas','Bloquear con cargas'],['Drones acuáticos os atacan.','Destruirlos','Esquivarlos'],['Sáenz amenaza con inundar El Vado.','Tomar la sala rápido','Negociar'],['Un generador falla y las luces parpadean.','Repararlo','Aprovechar la oscuridad'],['Sáenz pulsa el botón de inundación.','Detenerle','Cortar la energía']),
 l:{chem:[25,40],metal:[100,160],comp:[25,40]},outro:'Sáenz cae y las compuertas se cierran. El Vado vuelve a beber agua limpia. La llave de la sexta silla flota en una cápsula estanca sobre la consola.',r:{res:{chem:90,meds:160,metal:260,comp:90},wp:wi('Subfusil de marea'),out:'Traje de buzo táctico',plan:['Subfusil de marea','Traje de buzo táctico']}},
{n:'Cap. 43 · Puerto Gris',h:23,g:5,loc:{x:60,y:56,icon:'⚓',p:'Puerto Gris'},z:['s','f','s'],
 intro:'Puerto Gris es un astillero cubierto de niebla. No hay tripulaciones: barcos, grúas y drones hacen todo solos.',
 evs:X(['Las grúas se mueven sin nadie.','Detenerlas','Cruzar entre ellas'],['Un barco sale solo del muelle.','Abordarlo','Hundirlo'],['Los drones patrullan en círculos.','Esperar un hueco','Derribarlos'],['Una grabación de Mori suena en bucle.','Escucharla','Apagarla'],['Un superviviente atrapado en un contenedor golpea la pared.','Abrirlo','Seguir avanzando']),
 l:{elec:[40,70],comp:[25,40],metal:[100,170]},outro:'Mori pilota la flota desde un faro sobre el puerto. Cada dron es un ojo. Para llegar hasta ella hay que ser más rápido que todos a la vez.',r:{res:{comp:100,metal:260,chem:80,meds:100}}},
{n:'Cap. 44 · La flota de Mori',h:23,g:5,loc:{x:62,y:58,icon:'🛰️',p:'Puerto Gris · el faro'},z:['s','s','f','r'],
 intro:'El faro es una torre de pantallas. En cada una, un dron. En el centro, Haruka Mori, con los ojos cerrados, pilotando a doscientos a la vez.',
 evs:X(['Los drones forman una barrera.','Atravesarla','Cortar la señal'],['Mori redirige un barco contra el faro.','Desviarlo','Aguantar el golpe'],['Las pantallas muestran vuestras posiciones.','Apagarlas','Moveros sin parar'],['Una pantalla muestra a Lía.','Comprobarlo','Ignorarla'],['Mori abre los ojos por primera vez.','Aprovechar el momento','Escucharla']),
 l:{elec:[50,80],comp:[30,45],chem:[18,30]},outro:'Los drones caen en cadena. La llave de la séptima silla estaba en la mano de Mori. Dice que la pantalla de Lía era mentira. Que no sabe cómo, pero que el Consejo os conoce muy bien.',r:{res:{comp:130,chem:90,meds:110,metal:300},wp:wi('Rifle de deriva Mori'),out:'Manto de drones',plan:['Rifle de deriva Mori','Manto de drones']}},
{n:'Cap. 45 · La isla de cobre',h:24,g:5,loc:{x:4,y:6,icon:'⛏️',p:'Isla de Cobre'},z:['f','s','z'],
 intro:'La Isla de Cobre es una mina a cielo abierto con máquinas que excavan sin parar. Los mineros caminan a su lado con los ojos vacíos.',
 evs:X(['Una excavadora avanza hacia vosotros.','Esquivarla','Sabotearla'],['Los mineros siguen trabajando aunque os vean.','No molestarles','Intentar hablar'],['Un túnel bloqueado esconde un montacargas.','Despejarlo','Buscar otro camino'],['Las máquinas empiezan a coordinarse.','Cortar la red','Esconderse'],['Un minero herido os pide que apaguéis a Salgado.','Prometerlo','No prometer nada']),
 l:{metal:[120,200],comp:[30,45],chem:[20,30]},outro:'Salgado vive bajo la mina, en una cámara de cobre donde nadie le toca. Tiene el ejército más obediente del mundo: gente que ya no recuerda cómo parar.',r:{res:{metal:340,comp:110,chem:90,meds:110}}},
{n:'Cap. 46 · Las minas de Salgado',h:24,g:5,loc:{x:6,y:8,icon:'🔩',p:'Isla de Cobre · cámara central'},z:['s','f','f','r'],
 intro:'La cámara central es una catedral de cobre. Los mineros forman un círculo alrededor de Salgado y repiten su nombre en voz baja.',
 evs:X(['Los mineros avanzan sin hablar.','Disparar al suelo','Retroceder'],['Las máquinas se encienden a la vez.','Destruirlas','Subir a los andamios'],['Salgado habla con voz amable.','Escucharle','Atacar'],['El techo empieza a ceder.','Aguantar','Evacuar'],['Salgado levanta un mando.','Detenerle','Dejar que lo use']),
 l:{metal:[140,220],comp:[35,50],chem:[22,35]},outro:'Salgado cae y los mineros despiertan, uno por uno, mirando sus propias manos. La llave de la octava silla estaba grabada en cobre. Solo queda la Cúpula.',r:{res:{metal:420,comp:140,chem:110,meds:130},wp:wi('Fusil de cobre Salgado'),out:'Exoesqueleto de mina',plan:['Fusil de cobre Salgado','Exoesqueleto de mina']}},
{n:'Cap. 47 · La Cúpula',h:25,g:5,loc:{x:34,y:30,icon:'🔵',p:'La Cúpula'},z:['s','s','f','r'],
 intro:'Con ocho llaves, la Cúpula se abre. Es una ciudad cerrada bajo cristal, con jardines, plazas y torres. Vidal la construyó para vivir en ella, y para que nadie más lo hiciera.',
 evs:X(['Las puertas se abren solas.','Entrar con cuidado','Entrar en formación'],['Los jardines están llenos de maniquíes armados.','Destruirlos','Rodearlos'],['Una voz familiar os saluda por los altavoces.','Escucharla','Cortarla'],['Los ocho sellos brillan al unísono.','Usarlos para abrir camino','Guardarlos'],['Vidal os ofrece un trato desde su balcón.','Subir a por él','Rechazar el trato']),
 l:{metal:[160,240],comp:[40,60],chem:[25,40],ammo:[60,100]},outro:'Cruzáis la Cúpula hasta el último piso. Vidal os espera sentado, con una taza de té y los nueve sellos en la mesa. «Habéis tardado», dice. «Pero habéis llegado».',r:{res:{metal:500,comp:160,chem:120,meds:150,ammo:200}}},
{n:'Cap. 48 · La última silla',h:25,g:5,loc:{x:36,y:32,icon:'♟️',p:'La Cúpula · sala del Consejo'},z:['s','s','f','r'],
 intro:'Anselmo Vidal no quiere pelear. Quiere que escuchéis su oferta. Pero su guardia personal, nueve centinelas de acero, sí.',
 evs:X(['Los centinelas se interponen.','Combatirlos','Esperar a que se agoten'],['Vidal explica su plan: un mundo sin sorpresas.','Escuchar hasta el final','Interrumpirle'],['Una nueva emisión empieza a prepararse.','Cortarla','Aprovecharla'],['Los nueve sellos empiezan a brillar.','Apagarlos','Romperlos'],['Vidal se levanta y os tiende la mano.','Estrecharla','Rechazarla']),
 l:{metal:[200,300],comp:[50,80],chem:[30,50],meds:[40,80]},outro:'El silencio se hace en la sala del Consejo. Vidal ya no sonríe. Delante de vosotros están los nueve sellos y una decisión que no se parece a las otras.',r:{res:{metal:700,comp:220,chem:160,meds:200,ammo:300},wp:wi('Rifle del Último Turno'),out:'Corona de acero',sv:3,plan:['Rifle del Último Turno','Corona de acero']}}];
const {P,C}=window.exMk,CONS=window.CONS,CHZ=window.CHZ;
CH3.forEach(c=>{const idx=STORY.length;c.xs=[c.evs.length-2,c.evs.length-1];c.en=c.z;CHZ[idx]=c.z;
 const e3=c.evs[3],e4=c.evs[4];CONS[idx]=[[P('Optasteis por: '+e3.a.toLowerCase()+'.'),C('Optasteis por: '+e3.b.toLowerCase()+'.')],[P('Optasteis por: '+e4.a.toLowerCase()+'.'),C('Optasteis por: '+e4.b.toLowerCase()+'.')]];
 delete c.z;STORY.push(c)});
/* --- eventos narrativos del Acto III --- */
const E=narEvs,add=e=>{if(!E.some(q=>q.id===e.id))E.push(e)};
add({id:'m29',a:5,n:'Los nueve nombres',c:()=>S.story>=29,x:'La lista descifrada cuelga en la pared del refugio. Nueve nombres tachados a lápiz uno a uno es lo que Valeria quiere ver. Gael prefiere no mirarla.',o:[{t:'Marcar cada nombre al caer',x:'El refugio se llena de tachones. Cada uno pesa.',fx:{doc:'lista9',mor:3,log:'Descifrasteis la lista de los nueve.'}},{t:'Guardarla en un cajón',x:'La lista os espera cada noche. Aun así, dormís mejor.',fx:{doc:'lista9',log:'Guardasteis la lista de los nueve.'}}]});
add({id:'m31',a:5,n:'La llave de Lanz',c:()=>S.story>=32,x:'Entre las llaves hay una grabada con el nombre de Lanz. Lía la toca y dice que suena distinto a las demás, como una campana de cristal.',o:[{t:'Guardar las llaves juntas',x:'Cuantas más sumáis, más pesan.',fx:{doc:'requiem',log:'Guardasteis las llaves de las sillas.'}},{t:'Repartirlas entre los vuestros',x:'Ahora cada uno lleva su parte del peso.',fx:{doc:'requiem',flag:'llaves_repartidas',mor:4,log:'Repartisteis las llaves entre los vuestros.'}}]});
add({id:'m36',a:5,n:'Los Pardos desarmados',c:()=>S.story>=36,x:'Los mercenarios de Ardiles no tienen adónde ir. Algunos piden quedarse en vuestro refugio, otros prefieren cobrar por irse.',o:[{t:'Acogerlos como milicia',x:'Os cobran poco y vigilan bien. Un día os dirán por qué.',fx:{flag:'pardos_acogidos',mor:-2,res:{ammo:60},log:'Acogisteis a los Pardos.'}},{t:'Dejarlos marchar',x:'Se llevan lo suyo y no miran atrás.',fx:{log:'Dejasteis marchar a los Pardos.'}}]});
add({id:'m40',a:5,n:'El silencio de Santa Brígida',c:()=>S.story>=40,x:'Los Hermanos del Silencio piden permiso para seguir cuidando a los dormidos. Prometen no despertarlos nunca.',o:[{t:'Aceptar con una condición',x:'Podréis visitarlos cuando queráis. Acepta con un gesto.',fx:{flag:'hermanos_vigilados',mor:3,log:'Dejasteis a los Hermanos cuidar de los dormidos.'}},{t:'Prohibirlo',x:'Los dormidos se quedan sin nadie. Alguien tendrá que ocuparse.',fx:{mor:-2,log:'Prohibisteis a los Hermanos cuidar a los dormidos.'}}]});
add({id:'m44',a:5,n:'La flota apagada',c:()=>S.story>=44,x:'Los drones de Mori yacen en la costa. Con unas semanas de trabajo, se podrían reprogramar.',o:[{t:'Reprogramar los drones',x:'Vuestros técnicos se ponen a ello. Los drones obedecen, más o menos.',fx:{flag:'drones_propios',res:{comp:40},log:'Reprogramasteis los drones de Mori.'}},{t:'Hundirlos en el mar',x:'Nadie volverá a pilotarlos.',fx:{mor:2,log:'Hundisteis los drones de Mori.'}}]});
const f3={id:'f3',a:5,n:'La última silla',c:()=>S.story>=48&&window.endedA1&&endedA1(S.nar.f)&&(S.nar.f.fin2_despertar||S.nar.f.fin2_destruir||S.nar.f.fin2_alianza||S.nar.f.fin2_control),x:'Nueve sellos sobre la mesa. Vidal os mira. Detrás de él, la Cúpula entera espera una orden. Lo que decidáis ahora será lo último que el Consejo haga, y lo primero que haga el mundo.',o:[]};
Object.defineProperty(f3,'o',{get(){const f=S.nar.f,o=[];
 o.push({t:'Destruir los nueve sellos y la Cúpula',x:'La Cúpula arde durante tres días. Nadie volverá a gobernar desde ella, pero tampoco habrá ya quien responda de nada.',fx:{flag:'fin3_cenizas',mor:8,res:{metal:200},fac:{ref:10},log:'FINAL III: destruisteis el Consejo y su Cúpula.'}});
 o.push({t:'Juzgar a Vidal y publicar todo lo que sabía',x:'Los archivos de la Cúpula llegan a todas las ciudades. Vidal declara cuatro días. El mundo escucha.',fx:{flag:'fin3_juicio',mor:12,res:{comp:80},fac:{ref:20,mer:10},log:'FINAL III: Vidal fue juzgado en público.'}});
 if((f.comp_n||0)>=8||f.radio_diaria||f.ciudades_avisadas||f.fin2_alianza)o.push({t:'Convertir la Cúpula en el hogar de las nueve ciudades',x:'Los jardines se llenan de gente. Cada ciudad envía un delegado y cada delegado, un niño que jugar.',fx:{flag:'fin3_alianza',mor:20,res:{meds:200},fac:{ref:30,com:20},log:'FINAL III: la Cúpula pasó a las ciudades.'}});
 if((f.prag_n||0)>=8||f.fin2_control||f.pastor_control)o.push({t:'Ocupar la silla de Vidal',x:'Os sentáis donde él se sentaba. Las ciudades os escuchan y nadie pregunta cuánto durará.',fx:{flag:'fin3_trono',mor:-6,res:{metal:400,comp:120},fac:{mil:40},log:'FINAL III: ocupasteis la silla de Vidal.'}});
 if(f.lia_in)o.push({t:'Dejar que Lía decida',x:'Lía mira la mesa, mira a Vidal y rompe los sellos con sus manos pequeñas. «Ya está». Nadie se atreve a decir nada.',fx:{flag:'fin3_lia',mor:25,res:{meds:250},fac:{ref:35,mer:15},log:'FINAL III: Lía rompió los nueve sellos.'}});
 return o},configurable:true});add(f3);
window.narEnding3=f=>{let t='';
 if(f.fin3_cenizas)t='La Cúpula ardió tres días. Cuando el humo se fue, las nueve ciudades se miraron y se dieron cuenta de que ya nadie les decía qué hacer.';
 else if(f.fin3_juicio)t='Vidal declaró cuatro días ante las nueve ciudades. Al quinto, todas querían ser juzgadas con la misma luz.';
 else if(f.fin3_alianza)t='La Cúpula se llenó de niños. Las nueve ciudades se turnaron para mantenerla, y nadie volvió a hablar de sillas.';
 else if(f.fin3_trono)t='Ocupasteis la silla. Las ciudades os escuchan, por miedo o por gratitud, y todas saben que un día podríais dejar de hacerlo.';
 else if(f.fin3_lia)t='Lía rompió los nueve sellos con las manos. Nadie volvió a hablar del Consejo salvo para contar cómo acabó.';
 if(f.pardos_acogidos)t+=' Los Pardos acabaron siendo vuestra guardia, y la mejor.';if(f.drones_propios)t+=' Los drones de Mori vigilan ahora vuestras costas.';if(f.hermanos_vigilados)t+=' Los Hermanos del Silencio cuidan aún de los dormidos, y a veces cantan.';if(f.llaves_repartidas)t+=' Cada uno guardó su llave. Nadie la ha perdido.';
 return t};
})();
