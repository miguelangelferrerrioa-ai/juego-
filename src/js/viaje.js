/* Viaje de las expediciones de equipo: tardan según la distancia y, al llegar, aparece un aviso para jugar la misión. */
(function(){
'use strict';
const MAXS=2400; /* el destino más lejano tarda 40 minutos; el resto, proporcional a su distancia */
const frac=e=>{const z=e.z||{};if(e.world)return Math.min(1,Math.max(1,z.dist||2)/5);if(z.chap!==undefined)return .2+.8*Math.min(1,z.chap/27);return Math.min(1,Math.max(1,z.g||1)/5)};
const distOf=e=>frac(e);
const nm=e=>((e.z&&e.z.n)||'el destino').replace(/^Cap\.\s*\d+\s*·\s*/,'');
const fmt=t=>Math.floor(t/60)+':'+String(Math.ceil(t)%60).padStart(2,'0');
window.travelInfo=e=>e&&e.travel&&!e.travel.done?{left:e.travel.t,total:e.travel.total,arrived:e.travel.t<=0,txt:fmt(e.travel.t)}:null;
const oGo=window.exGo;
window.exGo=function(){if(S.exp)return;const oe=window.exEvent;let called=0;window.exEvent=function(){called=1};
  try{oGo.apply(this,arguments)}finally{window.exEvent=oe}
  if(S.exp&&called&&!S.exp.travel){const t=Math.round(MAXS*distOf(S.exp));S.exp.travel={t,total:t,done:0};try{save()}catch(e){}window.expMenu()}};
const oE=window.exEvent;
window.exEvent=function(){const e=S.exp;if(e&&e.travel&&!e.travel.done){if(e.travel.t>0)return window.expMenu();e.travel.done=1;hideArr()}return oE.apply(this,arguments)};
window.startMission=function(){const e=S.exp;if(!e)return;if(e.travel)e.travel.done=1;hideArr();hide();window.exEvent()};
window.skipTravel=function(){if(S.mode!=='creativo')return;const e=S.exp;if(!e||!e.travel)return;e.travel.t=0;window.startMission()};
window.cancelTravel=function(){const e=S.exp;if(!e||!e.travel||e.travel.done)return;e.team.forEach(i=>{const p=byId(i);if(p)p.away=0});S.exp=null;hideArr();try{save()}catch(_){}toast('El equipo ha vuelto a la ciudad.');window.expMenu()};
function hideArr(){const a=document.getElementById('exarr');if(a)a.style.display='none'}
function showArr(e){let a=document.getElementById('exarr');if(!a){a=document.createElement('div');a.id='exarr';document.body.appendChild(a)}
  const html=`<span>🧭</span><div><b>¡El equipo ha llegado!</b><small>${nm(e)}</small></div><button class="bup" onclick="startMission()">Jugar misión</button>`;
  if(a.dataset.h!==html){a.innerHTML=html;a.dataset.h=html}a.style.display='flex'}
const oU=window.upd;
window.upd=function(dt){oU.apply(this,arguments);try{const e=S&&S.exp;if(!e||!e.travel||e.travel.done){hideArr();return}if(window.horde)return;
  if(e.travel.t>0){e.travel.t-=dt*(S.adv&&S.adv.weather===1?1/1.2:1);if(e.travel.t<=0)e.travel.t=0}
  if(e.travel.t<=0)showArr(e)}catch(_){}};
})();
