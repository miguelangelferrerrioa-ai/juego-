# (Juego renombrado: After the Silence) Dead Town - traspaso del proyecto del bot (nuevo chat)

## Estructura (carpeta de trabajo /home/claude/work)
- deadtown/ : codigo fuente del juego (js/, css, index.html). build.py lo compila a DeadTown_v2.html
- build.py : `cd work && python3 build.py` genera DeadTown_v2.html (un solo archivo)
- scan.py : comprobacion tras cada cambio. OK = `[2400, [], 0] []`
- bot/ : banco de pruebas (Playwright)
  - bot.js : el bot (se inyecta con add_init_script). Perfil `ace` = determinista, el mejor.
    BOT.play({skill:'ace',seed,maxDays,timeMs,cp,stopStory,over:{fast:1}}), BOT.setup(k) refuerza al capitulo k
  - chain.py : campana asistida capitulo a capitulo (partida nueva por capitulo, refuerzo + expedicion)
    uso: `python3 chain.py tag k0 k1 40 50000` (salta los asaltos)
  - chain_as.py : asaltos (26 torre; 31,33,...,47 sillas). uso: `python3 chain_as.py 26,31,33`
  - b30.py : tandas de N partidas desde cero. `LIM=1 python3 b30.py ace 18 70 70000 tag "{}"`
  - t8.py (log de hordas), t10.py (gasto de metal), t11.py k (mision con log de HP), t13.py k (asalto suelto), diag.py
## Reglas de trabajo del usuario
- Responder en espanol, mensajes cortos, sin emojis en la interfaz del juego.
- Tras cada cambio: build.py, probar con Playwright (pulsar "Entendido"), scan.py, y enviar el HTML completo con SendUserFile (NO como artefacto) + resumen corto.
- Avisar siempre antes de cambiar el juego (el usuario pregunto si se cambiaba el juego).
## Cambios hechos en el juego (ya en el HTML)
1. uUpd (game.js): soldados rodean edificios con pstep al perseguir zombis (antes se atascaban).
2. newGame: soldado inicial con Pistola, scrap:40, gas:40 (antes 0 y 15, sin arma).
## Estado del bot
- Desde cero (ace): sobrevive mediana ~66 dias; casi nunca llega al ayuntamiento 3 (el metal entra a ~10-20/dia). Muere en las hordas del dia ~45-70.
- Campana asistida: 38 capitulos normales + 10 asaltos AVANZAN todos (heroes reforzados en B.cp: lvl=3+1.5k, arma v=8+1.7k, 8+1.1k soldados, armadura).
- Cap. 20 (rescate) pide ~17 intentos: pico de dificultad.
- Bug del bot corregido: Q.tap seleccionaba una sola unidad -> ahora M.sel=null antes de cada orden.
## Hallazgos de equilibrio
- Armas cuestan chatarra (solo de expediciones, exigen ayuntamiento 3). Torres sin tirador no sirven.
- Ayuntamiento 1->2 cuesta 150 metal; nivel 3 pide 3 edificios nivel 3 (solo tipos sin tecnologia mat2: pozo, torre...).
- Viaje de expedicion avanzada ~969 s de juego (~19 dias).
- Nivel de edificios STG (casa, granja, cuartel, aserradero...) a 3-4 exige la tecnologia Metalisteria (necesita Laboratorio).
## Sesion 2 (partida continua desde dia 1 del usuario)
- bot/cont.py: partida continua. `python3 cont.py <guardado.json> <tag> 5 <segundos>`; checkpoints en bot/ck/<tag>/dNNNN.json; si pierde o cae la poblacion vuelve a un checkpoint anterior (como reintentar el dia). Retoma solo desde el ultimo checkpoint.
- bot/sv.py open_save (carga un JSON de guardado), exp.py (comparar variantes con semillas), tr2.py (traza diaria), hd.py (hordas), dx.py (misiones).
- ARREGLO CLAVE del banco: el reloj T del juego solo avanza en frame(); el bot ahora hace T+=DT. Antes estaban rotos todos los temporizadores basados en T.
- Bot nuevo: alloc() por deficit (agua/comida/madera/metal), power() (generadores), hallPlan()+reserva para ayuntamiento, trade() en la villa (vende sobrantes, encargos, armeria, planos, chatarra, metal, gas, componentes, municion, taberna), gear() (atuendos, ropa, mejor arma; fabrica con chatarra), tapObs() (registrar coches/rocas/arboles a mano; limpiadores a 0), wreckLand(), drill() (entrenar ejercito a diario y rol 'esp' con arms2), trimMil()/milCap 60%, expedicion solo con poder >=90% del recomendado (espera hasta 120 dias), retirada al 45% de vida, escolta guiando al VIP, saltar objetivos inalcanzables.
- Probado y descartado: muralla en anillo (peor), armar a civiles (peor), subir torretas con prioridad (no ayuda).
- Cambios en el juego (aprobados/avisados): mercado de la villa vende componentes (4-10/dia) y quimicos desde cap. 10 (pueblo.js refresh); fxUpgrade/fxBuild con T anterior ya no rompen render (game.js).
- Estado: guardado bot/ck/r6/d0516.json: dia 516, capitulo 20 (siguiente: Cap. 21 La frontera quemada), ayuntamiento 8, ~77 hab, soldados ~140 de poder (nv 5-6, armas v14).
- Bloqueo: Cap. 21 (rescate) tiene 3 Elite de CENIZA (hp 348, armadura 4, alcance 6.6) + Zombi musculoso 697 en el camino; el equipo de 4 (poder ~570 vs 622 recomendado) muere en ~3 s. Con hold=10 sobreviven pero no avanzan.
## Sesion 2b: partida completada
- La partida continua desde el dia 1 del usuario llego al final: dia 780, capitulos 48/48, ayuntamiento 25, 135 hab (con reintentos: 31 derrotas y 30 dias flojos repetidos).
- Cambios de juego para lograrlo: mapquest.js hpM=.85+.035*lvl y dmM=.85+.025*lvl (antes .06/.05); enemigos por mision min(8,dgOf/60) (antes min(10,dgOf/45)); ficha.js rareza 'X' (forja) ya no rompe la ficha.
- Bot: asaltos (torre y sillas) con BOT.assault() tras esperar la carga asincrona; para la simulacion al llegar A.over. Revivir caidos y retirada que se anula sin enemigos cerca.
## Sesion 3: equilibrio para poder pasarse el juego (cerrado)
- Hordas: hEff()=min(hordeN, 4+capitulo+2*ayuntamiento, 2+0.7*poblacion) para el tamano; el tipo de horda y los jefes usan el hordeN real. Crecimiento 2.1 por horda (antes 2.6), ease=min(1,.4+.05n).
- Derrota parcial: hallRuin() en killB: ayuntamiento al 25 %, -40 % recursos basicos, 2 edificios destruidos, la horda se retira. Solo se pierde si muere toda la poblacion.
- Civiles sin arma se refugian en el ayuntamiento durante las hordas.
- Moral eliminada: p.mor fijo a 85 en upd; sin barras ni textos; comida de la Guardia y noche de historias dan salud.
- Vejez: +1 ano cada 10 dias; desde 65 los comunes pueden morir de vejez; historia/raros/presidenta no (keyP). Historia/raros no pueden ser traidores.
- Las armas y atuendos de muertos y desertores vuelven al almacen. Rescates en hordas solo si hay camas. Causas de muerte reales.
- Mercado de la villa por capitulo: chapa/ladrillo cap 6, cristal/componentes/quimicos cap 10, acero/hormigon cap 16.
- Misiones: hpM=.85+.035*lvl, dmM=.85+.025*lvl, enemigos min(8,dgOf/60).
- Resultado: partida continua desde el dia 1 del usuario terminada en el dia 503 (48/48, ayto 25), 1 retroceso, 5 ruinas. Guardado bot/ck/g3/d0503.json.
- Ideas no hechas: aviso de fuerza de la proxima horda, boton de entrenar a todo el ejercito, partida mas corta, ciudadanos atascados lejos de su trabajo (cit_stuck).
## Sesion 4: interfaz, guia, rendimiento y economia
- Herramientas: bot/ui_audit.py (auditoria de interfaz, sonido e iconos invisibles en movil 844x390 y pc 1280x800). /tmp/dz.py-style: medir "tramos muertos" = dias sin capitulo ni nivel de ayuntamiento nuevo a partir de out/cont_<tag>.log.
- Casino: tragaperras con simbolos vectoriales (casino.js slotSym), centrada.
- Enemigos nuevos (js/enemigos_intro.js): tarjeta animada con texto, pausa el juego, sin limite, cola; lo visto en mision no vuelve a salir en asalto (S.zseen). ZI_OFF desactiva (el bot lo usa).
- Guia (js/guia_img.js): imagenes de referencia por seccion, Bestiario con ficha por enemigo; enemigos no vistos y edificios no desbloqueados como silueta + "???" (tambien en el texto). Arreglado el corte de la guia en movil.
- Bloqueos (js/bloqueos.js): edificios bloqueados con silueta y nombre "???", candado en botones del menu lateral (Investigar sin laboratorio, Ejercito, Mapa exterior, Villa, Guardia), pestanas de expedicion bloqueadas, lugares de la villa "Bloqueado", Forja "???" hasta ayto 13. Arbol de investigacion: solo se ve el siguiente de cada rama (techHid en ui3.js).
- Desbloqueos (js/desbloqueos.js): tarjeta estilo "nuevo edificio" al subir ayuntamiento o revelar tecnologia/edificio; pausa el juego; espera a que se cierren tutoriales; S.unl guarda lo ya visto.
- Rendimiento (js/rendimiento.js + rutas.js + game.js): cache de edificios como imagen (bCache, BC_ON; animados se refrescan a ~7 fps), rejilla de casillas bloqueadas en cache y BFS sin reservar memoria, lista de objetivos de zombis una vez por fotograma, dpr max 1.5. Render 65->35 ms y logica de horda 11->3.5 ms en el banco.
- Armas sin desgaste (wd=100, sin Mantenimiento de armas).
- Desguace (scrapy, edificios4.js): ayto 1, coste solo madera, +15 metal, 3 plazas.
- Aserradero: 4 plazas en nivel 1 y +15 % de madera extra por nivel (sin_venta.js, envoltorio de out).
- Comida y agua (js/sin_venta.js): no se compran ni venden (NOSELL incluye elec), no salen como recompensa (misiones, historia, tutorial, expediciones, encargos; se cambian por chatarra). Red de seguridad: Proxy sobre S.res que solo deja subir comida/agua dentro de resTick.
- Consumo EAT=2.5 por ciudadano y dia, +0.06 por nivel de ayuntamiento por encima de 8 (eatNow en game.js). Pozo +12. Comida/agua escalan 1+0.6*(nivel-1) y no reciben el bonus de ayuntamiento alto.
- Racionamiento (rationOrder en game.js): si no llega, pasan hambre primero comunes sin trabajo, luego comunes con trabajo; ninos, embarazadas y personajes clave los ultimos.
- Panel del ayuntamiento: explica que falta, cuanto tarda al ritmo actual y que edificio lo produce (resTip/resTips/lvTip en sin_venta.js).
- Bot: mas granjas/pozos (n/3, n/4, n/2.5), pasa defensores a granjas si falta comida, construye aserraderos/desguaces si la madera/metal frenan el ayuntamiento (saw y scrapy fuera de la reserva). Probado y quitado: sacar defensores de torres para el aserradero (hunde la defensa).
- Resultados con todo: partidas de 15 min llegan a cap. 45-48 y ayto 24-25 en el dia 280-330; tramo muerto maximo 30 dias; 0 muertes de hambre.
- Ojo: 1 dia de juego = 10 min reales (≈47-55 h para terminar). No hay boton de velocidad.
## Sesion 5: revision final
- Nombres: los 2 primeros ciudadanos ya cambian el nombre al forzar su sexo (newGame). Guia: imagenes bloqueadas dicen "Edificio bloqueado" / "Enemigo desconocido".
- Probado de principio a fin: arcos Cuervos/Viboras/Guardia -> caida del Alba (Valeria +3 soldados) -> guerra del Alba -> asalto final (asalto_mapa, 2 bastiones, se gana). 11 arcos mas (8 ciudades, Segadores, Humo, Hierro) avanzan sin errores; lugares de interes OK. Recompensas de comida en arcos cambiadas a chatarra.
- Vehiculos eliminados por completo (S.vehicles/S.veh/vehicleId, selector, desgaste, bonus). Quedan los restos de vehiculos del mapa como botin.
- Clima (game.js advTick): pesos [80,13,8,7] sin repetir -> 50/25/15/9 % del tiempo; despejado 3,5-5 min, lluvia 3-5, niebla 3-4,2, tormenta 2-3. Lluvia: viajes x1.2 (viaje.js, epico.js). Niebla: alcance de tiradores x0.8. Tormenta: -25 % madera/metal/piedra/solar al aire libre (OUTSIDE en sin_venta.js, nunca comida/agua) y misiones x1.15 (mapquest hpM/dmM).
- Avisos (#log): con ventana abierta abajo a la izquierda; sin ventana a la derecha del boton Opciones (bloqueos.js).
- Muertes: doDay retira a quien llega a 0 de vida por hambre/sed (antes seguia "vivo" hasta el siguiente resTick). ppl_dead_alive restante = caidos en mision (por diseno). pop_over_cap = casas destruidas en hordas (legitimo).
- Tutoriales nuevos (js/tutoriales2.js, S.tips): investigacion, energia, racionamiento (S.rationed), familias, clima y lugares, ciudades, nuevas bandas, forja, asalto final.
- Hordas: tope por poblacion 2+0.55*pob (antes 0.7): en el punto caliente (cap. 14, ~21 hab) pasa de 0/3 a 2/3 partidas que avanzan.
- Textos: revisados 1495 textos (acentos, repeticiones, puntuacion) sin fallos; corregidos: guia del clima, descripcion del laboratorio, intercambio "combustible" (ahora gasolina), barra de moral en la taberna.
- Agua: escala 1+0.5*(nivel-1) (comida 0.6).
- Sonido: el mismo efecto max 6 veces cada 0,25 s (sfx en game.js).
- Resultado final: 2 partidas de 15 min desde el dia 1 del usuario: 0 tramos repetidos, 0 muertes de hambre, cap. 31-32 y ayto 17-18 en el dia ~240 (dentro del rango de antes).
- El usuario NO quiere boton de velocidad: no proponerlo.
- Ayuntamiento: pide hallNB(L) edificios del nivel siguiente = 2 hasta el nivel 10, 3 despues (game.js, edificio_ui.js, menus_ui.js, bot). Desguace da tambien +2 componentes (antes no habia fuente fija de componentes hasta el Taller de electronica, ayto 9).
- Embarazadas: sin barriga; icono pregBadge (biberon en circulo rosa) sobre la persona, en el retrato y linea 'Embarazada · da a luz en X dias' en la ficha.
- Audio: los tambores/musica de guerra (audio_dark.js) seguian sonando si la horda terminaba sin endHorde (cargar partida, reintentar dia) -> se oian dos canciones; ahora se paran si no hay horda. La musica del pueblo (sonidos2.js) ya arranca aunque los archivos terminen de decodificarse tarde. Truenos solo con lluvia/tormenta.
- Escenas (js/escenas3.js): cada tutorial tiene escena propia (TUTSCN: cielo, lugar y detalle animado x_*). Todas las escenas (tutoriales, 48 capitulos, portada, actos, sucesos) llevan acabado de cine: rayos de luz con origen variable (luna de noche) y destello, bruma, primer plano variado (rocas/valla/coche, se recorta si hay figuras), aves o murcielagos, parpadeo de fuego, particulas, fundido de entrada y tinte por cielo. Momentos clave (actos y capitulos 6, 14, 22 y 48) con sol/luna saliendo, brasas o bandera.
- Tutoriales2 incluyen escenas propias; el render recibe s.sk, s.seed y s.fg.
- Nombre del juego: After the Silence (titulo, portada, pantalla de carga, casino 'SILENCE SLOTS', exportacion afterthesilence_diaN.json). build.py sigue generando DeadTown_v2.html; se copia a AfterTheSilence.html. Las claves de guardado (dtls*) no se tocaron.
- Version publica: quitado el modo Creativo (selector, guia, nombre en el menu), el boton 'Asalto de prueba' (bandas.js) y 'Saltar viaje'. Partidas creativas antiguas se convierten a Normal y se recortan los recursos al almacen. scan.py usa NORMAL. Las comprobaciones S.mode==='creativo' internas se dejaron (inofensivas).
- Netlify: carpeta netlify/ (index.html = AfterTheSilence.html + etiquetas manifest/iconos añadidas a mano tras <title>, porque build.py no las conserva; manifest.webmanifest, sw.js con CACHE 'ats-v2', icon-180/192/512 = portada 'cov_road', _headers). Al publicar version nueva: copiar el html, volver a meter las etiquetas y subir CACHE en sw.js. Portadas extra registradas: cov_city, cov_road, cov_wall (escenas3.js).
- Audio nuevo (sonidos2.js B64): musica de Post-Apocalyptic Soundscapes (itch.io, swarajthegreat): menu=Anthem, dia=Elegy, noche=Fading, horda=Frenzy (mono 32 kHz 56 kbps, -17,5 LUFS, fundidos). Efectos: zombis del pack 'zombies' (24 wav, OpenGameArt; zg1-6, zs1-3, zdie/zdie2, zbite/zbite2), Kenney Impact (golpes melee1-3, construir build1-3, pasos step1-4), Kenney RPG (puertas door/door2, monedas loot/loot2, recarga metalLatch), Kenney Interface (clics). Rugido de jefe (Pixabay, monster-roar-02, recortado a 3,6 s) y sirena de horda (Pixabay, air-raid-siren, 5 s; grupo alarm con hueco de 6 s). Conversion en /tmp/conv.py (no persistente). Del banco antiguo (audio/soundbank.js) se quitaron las muestras sustituidas (z1-24, gunS/L/Lc, blS/L, punch, build, menu, money, run, enemy); quedan tree, rock, casing, brick, wallS, wallL, crystal, relic, save.
- Resultado: parones maximos 35 dias (antes 40-50); el usuario quiere que SIGA habiendo parones para que el juego dure.
## Pendiente
- Partida continua desde cero hasta el final (el usuario quiere mandar un guardado como punto de partida).
- Guerra Cuervos y Viboras (S.arc, asaltoMenu/asaltoPlan/asaltoGo) sin probar.
- Mecanicas por cubrir: bandas, Villa Esperanza (comercio), vehiculos, investigacion completa, clima, audio.
- Nota: el juego no es 100% determinista, comparar con >=18 partidas.

## Sesión 6 (13-nov)
- Publicado en Vercel (Netlify bloqueado en la red del usuario). Vercel Drop: cada drop = proyecto nuevo; actualizar soltando en el proyecto del panel.
- Música doble arreglada: game.js startMusic() ahora hace return (si se tocaba la pantalla durante la carga, arrancaba la música antigua MB). MB vaciado en soundbank.js (-3,3 MB). audio_act.js no construye capas si NEWMUS.
- netlify/sw.js CACHE=ats-v6.
- Puntos de investigación bloqueados hasta tener laboratorio: window.rpOn(); sin +30 inicial (se dan al construir el lab), misiones principales sin rp:12, zonas guardan rp en z._rp y solo lo activan con lab, chatarra de coches y archivos de historia sin PI sin lab, chip 🔬 oculto. sw ats-v7.
- guia3.js (tras guia_img): GU.gas/GU.alloy; Recursos solo muestra los ya vistos (S.rseen); secciones ocultas hasta desbloquear (Ejército, Tecnologías, Niveles 11-15, Zombis especiales, Jefes, Bandas, Villa, Torres, Gasolina) envolviendo window.guide. sw ats-v8.
- ficha.js: pestaña Roles con descripción por rol (toca un rol; pRole). roleTxt lista edificios desbloqueados con ese job (+20%/nivel) + extras RX (Médico hospital, Constructor descuento/reparación, Explorador suerte solo, Recolector botín, Mecánico, Científico). sw ats-v9.
- Skins mejoradas al empezar en móvil: el juego dibujaba y cacheaba sprites antes de cargar edificios_etapas.js (parseo lento). Clave de SPR (edificios.js) y de bCache/ANIM/TRIM (rendimiento.js) incluyen ahora si NBK.stagePaint/lvlDeco existen -> se redibujan solos. sw ats-v10.
- Guía: sección "Roles" tras Supervivientes (guia3.js, usa window.roleTxt/ROLE_SI de ficha.js); solo nombra edificios desbloqueados o construidos. sw ats-v11.
- Botón Partida movido del rail Opciones al dock Menú (index.html, tras Misiones); texto de Interfaz en la guía actualizado. sw ats-v12.
- filtros_ppl.js (tras menus_ui): pplMenu con filtros rol/sexo/edad/estado y orden (window.PPLF); grid propia .pgf (auto-fill) para que 1 tarjeta no ocupe todo. sw ats-v13.
- Tarjetas de supervivientes más pequeñas en la lista (.pgf: 92px, cara 62px). sw ats-v14.
- recursos_bar.js: botón "📦 Recursos" dentro de #top (se re-inserta si la barra se redibuja) que despliega #rbPan con todos los recursos/materiales vistos, cantidad/capacidad y neto por minuto (rate()/10); se refresca cada 1 s. Ojo: cap e ICO son const globales (no window.*). sw ats-v15.
- mat_bloq.js (tras sin_venta): RES_LV {plank2,stone3,comp4,brick4,abx4,sheet5,chem7,glass8,steel8,concrete13,alloy13} por hallLv(); window.resLocked/resLockImg/resLockTxt. out() quita materiales bloqueados; proxy de sin_venta bloquea subidas; ZN/EXT_ZONES/MS/STORY/SOLO_RES/stock de la villa se apartan (WeakMap) y vuelven al desbloquear. Se ven como "???" en oscuro en almacén, guía (Recursos) y pestaña Recursos. desbloqueos.js: tarjetas "Nuevo material" (S.unl.r). Pendiente: el usuario elige opción A (franja) o B (columna) para la pestaña de recursos fija. sw ats-v16.
- Opción B elegida: recursos_bar.js reescrito: el botón 📦 fija la columna #rbCol a la derecha (se recuerda en localStorage ats_rescol); filas icono+cantidad+neto/min, materiales aparte y bloqueados como siluetas; tocarla abre el almacén. Ya no hay panel desplegable. sw ats-v17.
- Columna de recursos compacta: 2 columnas (.c2, 206px) a partir de 9 recursos, filas de 18px, materiales con fondo distinto sin cabecera, bloqueados en una fila de siluetas. Con todo desbloqueado (21 filas + rp) cabe sin scroll en 915x412 y 800x360. sw ats-v18.
- Población (sesión 6): embarazo vía principal. poblacion.js: pregMax()=clamp(floor(casas/2),2,6), inheritRoles (mitad del rol más alto de cada padre), inhTxt. game.js: gemelos 10% (q.tw), embarazada come x2 (rate y resTick), expediciones y explorador solitario: 30% de que el superviviente acepte, llega herido (60% vida, injury 20); refugiados 1 cada 5 días; llegadas.js: llegada cada 8 días, radio a la mitad. Textos de guía y chips de Formar familia actualizados. bot.js: breed() empareja cada día (pairs en resultado). Bot 45 días (6 semillas): pob. día 30 media ~18 (antes sin parejas ~12, antes con parejas ~29). sw ats-v19.
- Formar familia (ui3.js pairUI): filtro por rol + "Solo disponibles" (window.FAMF), orden por nivel del rol, etiqueta ★Rol n/10 y aviso "El bebé heredaría: …". Arreglado límite fijo de 2 en ui3 (ahora pregMax). sw ats-v20.
- Herencia: si ambos padres tienen el mismo rol principal, el bebé suma las dos mitades (tope 7). sw ats-v21.
- Desplegables nativos (<select>) sustituidos por window.chipSel (filtros_ppl.js) en Supervivientes y Formar familia; "Solo disponibles" es un botón. Opciones: botones bloqueados muestran "???" (bloqueos.js guarda el nombre en data-nm) y el requisito ya no nombra edificios bloqueados; Progresión muestra "???" en mecánicas bloqueadas. sw ats-v22.
- Asignar trabajador (edificio_ui.js asgList): ★ visibles también en ocupados, orden por encaje y "Ocupado en: X". sw ats-v23.
- ★ de encaje en la esquina superior izquierda de la tarjeta (.tg.tgl), "ocupado" a la derecha. sw ats-v24.
- Lista de asignar (.asgl): etiqueta "ocupado" más pequeña para no tapar la ★. sw ats-v25.
- Bebés: nacen en el momento del parto (age 0, bd2=1; edad=(día-bd)*6, adulto en 3 días) junto a la madre, aunque no haya cama; formar pareja exige cama libre (pop+embarazos<pcap). Gemelos sin límite de cama. Icono en mapa window.kidBadge (azul bebé <6, verde niño <18), figura más pequeña (<6: .6), etiqueta 👶/🧒 en tarjetas (pTags); los bebés no hablan (balbuceo.js). sw ats-v26.
- Almacén > Prendas: iconos dibujados por código (clothIcon, con el color de ZCLOTH) para chaleco/chaqueta/pantalón/botas/mochila y nombre de hueco en español (antes "jacket" y emoji en blanco en Android). emoji() usa fuentes de emoji explícitas. sw ats-v27.
- Ficha > Equipo: sección Prendas (5 huecos con icono, Quitar) y lista de prendas del almacén para ponerlas (ficha.js clothHtml/clothOff). Menú Partida y Configuración pausan el juego (window._menuPause envuelve upd; se quita al cerrar el panel). sw ats-v28.
- Prendas: 5 huecos con el mismo estilo que arma/atuendo (.pslot); al tocar se abre el selector (pPick="cl:slot", clothPicker) con las prendas de ese hueco, Volver y Quitar actual. sw ats-v29.
- Guía actualizada (guia3.js, envoltorios W): Interfaz (columna Recursos), Guardado (pausa en Partida), Tecnologías (PI solo con lab; estudios no descubiertos ocultos), Supervivientes (filtros, ★ al asignar, fuentes de población; sin lista de edificios por rol), nueva sección "Equipo: armas, atuendos y prendas", Materiales (bloqueo por ayuntamiento con ???), Parejas (bono mismo rol, filtro, bebés en mapa). sw ats-v30.
- Moral sin efectos: producción con factor fijo .925 (antes .5+mor/200); nadie se va por moral baja. Traición: 1/3 de antes y solo recién llegados de fuera (p.arrD, primeros 10 días; nunca nacidos ni fundadores; poblacion.js marca arrD, S.arrInit). sw ats-v31.
- Asalto final más épico (asalto_mapa.js): música de horda durante el asalto (sonidos2 want()), cinemática de entrada por fase (franjas, título, 3 frases de Valeria, barrido de cámara, "¡AL ATAQUE!", Saltar), avance en formación al 55% los primeros 16 s, gritos de tropa, puerta 3200*sc de vida (antes 1400), cargas automáticas a los 75 s (antes 38), temblor de pantalla en explosiones, cartel "X HA CAÍDO" al caer el jefe. sw ats-v32.

## Sesión 7 (15-nov)
- Guardado seguro (game.js lsPut/lsFree/saveFail): si el almacenamiento está lleno se borran copias por orden de menos a más útiles (dañadas/protegidas, "mejor" si es igual a la principal, bk2, bk1 y "b" de otras ranuras, bk1 propia, "mejor" de otras, "mejor" propia); nunca una partida principal ni el inicio del día actual. Si ni borrando todo cabría, no se borra nada. Si falla: aviso fijo arriba con botón Exportar (se repite como mucho cada 3 min y se quita al volver a guardar). Sustituye al parche de Storage.setItem de guardado.js. save() devuelve true/false; el botón Guardar ya no dice "Partida guardada" si falla. retryDay ya no pisa la partida si no hay copia del inicio del día. Importar/restaurar copia usan lsPut. Ranuras: "Cap. X/48" (antes /28). sw ats-v35.
- vercel.json: cabeceras no-cache para /, /index.html y /sw.js (equivalente a _headers de Netlify) para publicar en Vercel desde el repositorio.
- Rendimiento (rendimiento.js): la caché de edificios se anulaba sola. Al cambiar la calidad (QS) todos los edificios cambian de clave y, mientras esperaban turno (14 repintados por fotograma), cada fotograma de espera contaba como 'cambio': >6 y el edificio se marcaba inestable y se dibujaba sin caché 12 s (pueblo de 199 edificios: ~150 sin caché durante ~15 s tras cargar o cambiar calidad, lo que a su vez bajaba más la calidad). Ahora solo cuentan claves nuevas (th.lk). Además el lienzo de cada edificio se reutiliza al refrescar (antes ~330 lienzos nuevos/s por los edificios animados: pozos, torres...; ahora ~9/s). Día 248: tras cargar 25-26 fps -> 32-35 fps al instante en el banco. sw ats-v37.
- Pantalla de inicio (style.css, al final): en móvil horizontal (alto <=560px) la caja del título es una rejilla: portada a la izquierda, título/botones a la derecha (botones 2x2), lista de ranuras con scroll propio si no cabe. #titleScreen align-items:safe center para que nunca se corte por arriba. En PC no cambia. sw ats-v38.
- Pantalla de inicio: el diseño horizontal no salía en el móvil del usuario (su pantalla es más ancha/alta que 932x415). Ahora se activa en horizontal con alto <=760px y proporción >=3:2 (probado de 932x415 a 1385x617; PC 1280x800 y vertical sin cambios). Centrado con margin:auto en vez de 'safe center'. sw ats-v39.
- build.py pone el número de versión en la portada ('Edición 2.7 · vNN', el mismo que la caché de sw.js) para saber qué versión tiene la app del móvil. sw ats-v40.
- Importar partida (ranuras.js): la ranura se elige con window.chipSel en vez de <select> nativo; solo se redibuja el chip (#impSC, impRen) para no perder el archivo elegido. sw ats-v41.
- Cansancio eliminado (game.js): ya no sube en doDay ni baja en upd, sin descanso (antes todos iban a la PRIMERA casa del pueblo y en pueblos grandes no llegaban: cansancio 100 fijo, -30 % producción), sin barra de Energía (ficha.js, ficha de game.js). Suceso "falsa alarma" ahora gasta 15 de munición. Al cargar: fatigue=0, resting=0. Compensación para mantener los parones: workerFactor multiplica por fatComp() = 0,95 (ayto 1-2) -> 0,78 (ayto 16+), la media que daba el cansancio; día 248: producción de un día igual que antes.
- Ciudadanos atrapados (rutas.js pstep): en pueblos apretados quedan huecos libres cerrados por edificios; sin camino, el ciudadano cruzaba en línea recta pero el "sacar de dentro de un edificio" lo devolvía al hueco: atrapado para siempre. Ahora no se le saca mientras cruza a propósito (p.thru, 1,5 s). Destino que quedó dentro de un edificio: se elige otro (game.js). Día 248: trabajadores lejos de su edificio 80 % -> 1 %, atascados todo el día 99 -> 0. Horda de 183 zombis sin errores. sw ats-v44.
