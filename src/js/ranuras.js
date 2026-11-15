/* Ranuras de guardado (3) · copias de seguridad · exportar / importar */
(function(){
'use strict';
const KEYS=['dtls1','dtls_s2','dtls_s3'],$=i=>document.getElementById(i);
const oCont=window.continueGame,oMode=window.showModeSelect;
let mode='load',armed=-1,view='list',rec=-1,imp=-1;
function raw(k){try{return localStorage.getItem(k)}catch(e){return null}}
function parse(t){try{const s=JSON.parse(t);return s&&s.bld&&s.ppl&&s.res?s:null}catch(e){return null}}
function info(k){const s=parse(raw(k));if(!s)return null;const h=s.bld.find(b=>b.type=='hall');return{day:s.day,pop:s.ppl.length,hall:h?h.lvl:1,mode:s.mode||'normal',story:s.story||0,bld:s.bld.length}}
const line=d=>'Día '+d.day+' · '+d.pop+' superv. · Ayunt. '+d.hall+' · Cap. '+d.story+'/48 · '+d.mode;
function ui(m){mode=m;armed=-1;view='list';draw()}
function backups(i){const k=KEYS[i];return[[k+'_best','Partida más avanzada'],[k+'_bk1','Copia reciente'],[k+'_bk2','Copia anterior'],[k+'b','Inicio del último día'],[k+'_guard','Guardado bloqueado (protegido)']].map(([key,n])=>({key,n,d:info(key)})).filter(x=>x.d)}
function draw(){
  const el=$('titleContent');if(!el)return;
  if(view=='rec'){const bs=backups(rec);let h='<p><b>Copias de la ranura '+(rec+1)+'</b><br><small>Restaurar sustituye la partida actual de la ranura (la actual se guarda antes como copia).</small></p><div class="slots">';
    h+=bs.length?bs.map(b=>'<div class="slot"><div class="si"><b>'+b.n+'</b><span>'+line(b.d)+'</span></div><div class="sb"><button class="primary" onclick="slotRestore(\''+b.key+'\')">Restaurar</button></div></div>').join(''):'<p>No hay copias en esta ranura.</p>';
    el.innerHTML=h+'</div><div class="title-actions"><button onclick="slotView(\'list\')">Volver</button></div>';return}
  if(view=='imp'){el.innerHTML='<p><b>Importar partida</b><br><small>Elige el archivo .json que exportaste, o pega su texto.</small></p><div class="slots"><div class="slot" style="display:block"><input type="file" id="impF" accept=".json,.txt,application/json,text/plain" style="width:100%;margin-bottom:6px"><textarea id="impT" rows="3" style="width:100%;font-size:10px" placeholder="…o pega aquí el texto de la partida"></textarea><div style="margin-top:6px">Guardar en: <span id="impSC"></span> <button class="primary" onclick="slotImport()">Importar</button></div><div id="impM" style="color:#e8c25a;margin-top:4px"></div></div></div><div class="title-actions"><button onclick="slotView(\'list\')">Volver</button></div>';window._impSlot=String(imp>=0?imp:0);window._cpOpen='';impRen();
    $('impF').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('impT').value=String(r.result||'')};r.readAsText(f)};return}
  let h='<p>'+(mode=='load'?'Elige la partida que quieres continuar.':'Elige una ranura para la nueva partida.')+'</p><div class="slots">';
  KEYS.forEach((k,i)=>{const d=info(k),nb=backups(i).length;
    h+='<div class="slot'+(KEY===k?' cur':'')+'"><div class="si"><b>Ranura '+(i+1)+'</b><span>'+(d?line(d):'Vacía')+'</span></div><div class="sb">';
    if(mode=='load')h+=d?'<button class="primary" onclick="slotPick('+i+')">Cargar</button>':'<button disabled>Vacía</button>';
    else h+='<button class="primary" onclick="slotPick('+i+')">'+(d?(armed==i?'¿Sobrescribir?':'Sobrescribir'):'Nueva')+'</button>';
    if(d)h+='<button onclick="slotExport('+i+')">Exportar</button>';
    if(nb)h+='<button onclick="slotRec('+i+')">Copias ('+nb+')</button>';
    if(d)h+='<button onclick="slotDel('+i+')">'+(armed==-2-i?'¿Seguro?':'Borrar')+'</button>';
    h+='</div></div>'});
  h+='</div><div class="title-actions"><button onclick="slotImp()">Importar partida</button><button onclick="titleMenu()">Volver</button></div>';
  el.innerHTML=h}
window.slotView=v=>{view=v;draw()};
window.slotRec=i=>{rec=i;view='rec';draw()};
window.slotImp=()=>{imp=-1;view='imp';draw()};
window.slotPick=i=>{
  const d=info(KEYS[i]);
  if(mode=='new'&&d&&armed!==i){armed=i;draw();return}
  window.LIVE=false;                       // mientras eliges, nada se guarda
  if(mode=='new'&&d)bkRotate(KEYS[i],0,1); // la partida que vas a sobrescribir queda como copia
  KEY=KEYS[i];try{localStorage.setItem('dtls_slotkey',KEY)}catch(e){}
  if(mode=='load')oCont();else oMode()};
window.slotDel=i=>{
  if(armed!==-2-i){armed=-2-i;draw();return}
  try{bkRotate(KEYS[i],0,1)}catch(e){}   // borrar deja una copia recuperable
  try{localStorage.removeItem(KEYS[i])}catch(e){}
  armed=-1;draw()};
window.slotRestore=key=>{const k=KEYS[rec],t=raw(key);if(!parse(t))return;try{bkRotate(k,0,1);lsPut(k,t)}catch(e){}
  view='list';mode='load';draw();toast('Copia restaurada en la ranura '+(rec+1)+'. Ya puedes cargarla.')};
function download(name,txt){try{const b=new Blob([txt],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(a.href)},1500);return true}catch(e){return false}}
window.exportSlotKey=key=>{
  let t=raw(key);if(window.LIVE&&key===KEY&&typeof S!=='undefined'&&S&&!S.over){try{save();t=raw(key)}catch(e){}}
  const d=info(key);if(!d)return toast('No hay partida que exportar.');
  const name='afterthesilence_dia'+d.day+'_'+(KEYS.indexOf(key)>=0?'ranura'+(KEYS.indexOf(key)+1):key)+'.json';
  download(name,t);
  try{navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast('Partida exportada y copiada al portapapeles.'),()=>toast('Partida exportada como archivo.'))}catch(e){toast('Partida exportada como archivo.')}};
window.slotExport=i=>exportSlotKey(KEYS[i]);
/* selector de ranura con los chips del juego (sin desplegable nativo); solo se redibuja el chip para no perder el archivo elegido */
function impRen(){const e=$('impSC');if(e)e.innerHTML=chipSel('impS',window._impSlot,KEYS.map((k,i)=>[String(i),'Ranura '+(i+1)+(info(k)?' (sobrescribe)':' (vacía)')]),'window._impSlot=$V','_impRen()')}
window._impRen=impRen;
window.slotImport=()=>{const t=($('impT').value||'').trim(),m=$('impM'),i=+(window._impSlot||0),s=parse(t);
  if(!s){m.textContent='Ese texto no es una partida válida.';return}
  const k=KEYS[i];try{if(info(k))bkRotate(k,0,1);if(!lsPut(k,JSON.stringify(s)))throw 0}catch(e){m.textContent='No se pudo guardar (almacenamiento lleno).';return}
  view='list';mode='load';draw();toast('Partida importada en la ranura '+(i+1)+'. Ya puedes cargarla.')};
window.continueGame=()=>{if(KEYS.some(k=>info(k)))ui('load');else ui('new')};
window.showModeSelect=()=>ui('new');
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const oTitle=window.titleMenu;
const hint=()=>{try{if(!KEYS.some(k=>info(k))){const el=$('titleContent');if(el&&!el.querySelector('.nosave'))el.insertAdjacentHTML('beforeend','<p class="nosave" style="margin-top:10px;font-size:12px;opacity:.85">No hay partidas guardadas en este archivo. El navegador guarda las partidas por archivo: si venías de otra versión, ábrela, usa Menú → Exportar partida y aquí pulsa Nueva partida → Importar partida.</p>')}}catch(e){}};
setTimeout(hint,50);
window.titleMenu=function(){oTitle.apply(this,arguments);try{if(!KEYS.some(k=>info(k))){const el=$('titleContent');if(el&&!el.querySelector('.nosave'))el.insertAdjacentHTML('beforeend','<p class="nosave" style="margin-top:10px;font-size:12px;opacity:.85">No hay partidas guardadas en este archivo. El navegador guarda las partidas por archivo: si venías de otra versión, ábrela, usa Menú → Exportar partida y aquí pulsa Nueva partida → Importar partida.</p>')}}catch(e){}};
setTimeout(()=>{const b=$('continueBtn');if(b&&KEYS.some(k=>info(k)))b.disabled=false},0);
})();
