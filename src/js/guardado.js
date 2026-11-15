/* Guardado automático reforzado: guarda más a menudo y tras cada acción importante, al cerrar/ocultar, libera copias viejas si el almacenamiento se llena y recupera solo desde una copia si la partida está dañada. */
(function(){
'use strict';
/* 1) Almacenamiento lleno: ahora lo gestiona lsPut() en game.js (borra copias prescindibles y avisa en pantalla). */
/* 2) Cargar: el explorador/expedición se conserva; si la partida está dañada se prueba con las copias */
const oLoad=window.load;
window.load=function(){
  if(oLoad.apply(this,arguments))return true;
  try{const main=localStorage.getItem(KEY);
    for(const suf of['_bk1','b','_best','_bk2']){const t=localStorage.getItem(KEY+suf);let ok=0;try{const o=JSON.parse(t);ok=o&&o.bld&&o.ppl&&o.res}catch(e){}
      if(!ok)continue;if(main)try{localStorage.setItem(KEY+'_corrupt',main)}catch(e){}
      if(!lsPut(KEY,t))continue;if(oLoad.apply(this,arguments)){try{toast('Partida recuperada desde una copia de seguridad.')}catch(e){}return true}}}catch(e){}
  return false};
/* 3) Guardar más a menudo y en los momentos clave */
let busy=0;const soon=()=>{if(busy)return;busy=1;setTimeout(()=>{busy=0;try{save()}catch(e){}},400)};
['asg','unjob','upg','destroy','moveB','claim','craft','heal','cure','repair','commitDrag','equip','outEquip','unEquip','outOff','enlist','soloGo','soloStep','soloPick','soloUse','soloRequestReturn','exGo','exChoose','exEnd','doDay','healAll','repairAll','trainArmy','toggleAutoTrain','growCap','buyTech','research'].forEach(n=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);soon();return r}});
['pagehide','freeze'].forEach(ev=>addEventListener(ev,()=>{try{save()}catch(e){}}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)try{save()}catch(e){}});
setInterval(()=>{if(!document.hidden)try{save()}catch(e){}},8000);
/* 4) Pedir al navegador que no borre los datos de la partida */
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
})();
