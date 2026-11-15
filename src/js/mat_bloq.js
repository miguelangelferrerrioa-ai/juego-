/* ===== Materiales bloqueados por nivel del ayuntamiento: no se consiguen hasta que se pueden usar y se ven en oscuro como "???" ===== */
(function(){
'use strict';
const LV={plank:2,stone:3,comp:4,brick:4,abx:4,sheet:5,chem:7,glass:8,steel:8,concrete:13,alloy:13};
window.RES_LV=LV;
const hl=()=>{try{return hallLv()}catch(e){return 1}};
window.resLocked=function(k){try{if(!LV[k])return false;if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return true;if(S.mode==='creativo')return false;return hl()<LV[k]}catch(e){return false}};
window.resLockImg='filter:brightness(0) invert(.38)';
window.resLockTxt=k=>'Material bloqueado: se desbloquea con el ayuntamiento nivel '+LV[k]+'.';

/* los edificios no producen materiales bloqueados (el ayuntamiento no da piedra hasta el nivel 3, el desguace no da componentes hasta el 4…) */
(function(){const o=window.out;if(typeof o!=='function')return;window.out=function(b){const r=o.apply(this,arguments);try{if(r)for(const k in r)if(resLocked(k))delete r[k]}catch(e){}return r}})();

/* botines y recompensas: los materiales bloqueados se apartan y vuelven solos al desbloquearse */
const STASH=new WeakMap();
function sync(o){if(!o||typeof o!=='object')return;let st=STASH.get(o);
  for(const k of Object.keys(o))if(LV[k]&&resLocked(k)){if(!st){st={};STASH.set(o,st)}st[k]=o[k];delete o[k]}
  if(st)for(const k of Object.keys(st))if(!resLocked(k)){o[k]=st[k];delete st[k]}}
let SOLO0=null;
function syncAll(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return;
  try{ZN.forEach(z=>sync(z.l))}catch(e){}
  try{EXT_ZONES.forEach(z=>sync(z.loot))}catch(e){}
  try{MS.forEach(m=>sync(m[2]))}catch(e){}
  try{if(typeof STORY!=='undefined')STORY.forEach(s=>{sync(s.r);sync(s.rw);sync(s.l)})}catch(e){}
  try{if(typeof SOLO_RES!=='undefined'){if(!SOLO0)SOLO0=SOLO_RES.slice();const want=SOLO0.filter(k=>!resLocked(k));if(want.join()!==SOLO_RES.join()){SOLO_RES.length=0;want.forEach(k=>SOLO_RES.push(k))}}}catch(e){}
  try{if(S.vil&&S.vil.stock)for(const k of Object.keys(S.vil.stock))if(resLocked(k))delete S.vil.stock[k]}catch(e){}
 }catch(e){}}
setInterval(syncAll,1200);setTimeout(syncAll,300);
})();
