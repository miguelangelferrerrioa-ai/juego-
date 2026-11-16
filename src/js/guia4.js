/* Guía: añade lo nuevo (aviso de horda, soldados que defienden el pueblo, efectos reales del clima, lista de edificios, avisos de versión y copia, columna animada). */
(function(){
'use strict';
if(typeof GD==='undefined')return;
const W=(name,fn)=>{const i=GD.findIndex(g=>g[0]===name);if(i<0)return;const o=GD[i][1];GD[i][1]=()=>{let h='';try{h=o()}catch(e){}try{return fn(h)}catch(e){return h}}};
const P=t=>'<p>'+t+'</p>';
W('Interfaz',h=>h+P('<b>🧟 Aviso de la próxima horda</b> (barra superior, junto a Recursos): dice cuándo llega («3 días», «Mañana», «¡Hoy!») y su color indica si tu defensa basta: <b>verde</b> suficiente, <b>amarillo</b> justa, <b>rojo</b> insuficiente. Tócalo para ver el detalle y un consejo. Durante la horda muestra los enemigos que quedan.')
 +P('Con la columna de <b>📦 Recursos</b> abierta, los números suben o bajan poco a poco (verde o rojo) y al ganar una cantidad de golpe (recompensas, botín, compras) aparece un <b>+N</b> junto al recurso.')
 +P('<b>Menú → Edificios</b> agrupa los edificios del mismo tipo con su miniatura («Arma automática ×24») y avisa de los dañados o parados. Toca un grupo para ver cada uno y toca uno para ir a él.'));
W('Supervivientes',h=>h+P('<b>Enfermedades</b> (gripe, fiebre, infección): el enfermo trabaja un 25 % menos, pero no muere ni contagia. Se curan solas: gripe en 3 días, fiebre en 4 e infección en 6; con un <b>Médico</b> trabajando en el hospital, el doble de rápido. Los antibióticos las curan al momento. Pasar hambre o sed hace enfermar mucho más.'));
W('Ejército',h=>h+P('<b>En las hordas</b> los soldados <b>defienden el pueblo</b>: forman junto al ayuntamiento y solo atacan a los zombis que entran en la zona del pueblo (cerca de tus edificios y muros) o que ya tienen a tiro. No salen a campo abierto a perseguirlos; sin enemigos cerca, vuelven a su puesto.'));
W('Zombis y defensa',h=>h+P('<b>Rezagados:</b> si al final de una horda quedan muy pocos zombis (3 o menos, o el 10 % de la horda) y durante 20 segundos ninguno se acerca al pueblo, se dispersan y la horda termina con su recompensa normal.')
 +P('Mira el <b>🧟 aviso de horda</b> de la barra superior para saber si tu defensa basta antes de que lleguen.'));
W('Clima y expediciones',h=>h+P('Además, en la <b>tormenta</b> los zombis de las hordas van un <b>12 % más rápido</b>, y en la <b>niebla</b> los zombis errantes van un 10 % más lentos. En <b>Operaciones</b> ves el clima actual en movimiento, cuánto falta para que cambie y todos sus efectos en tu pueblo.'));
W('Guardado y controles',h=>h+P('<b>Copia de seguridad:</b> la partida solo vive dentro del navegador o la app; si se borra, se pierde. Cada 10 días de juego sin exportar sale un recordatorio con el botón <b>Exportar ahora</b>. Para recuperarla: Nueva partida → Importar partida.')
 +P('<b>Versión nueva:</b> cuando hay una actualización publicada sale un aviso abajo con <b>Actualizar</b> (guarda antes y recarga). El número de versión aparece en la portada, debajo del título.'));
})();
