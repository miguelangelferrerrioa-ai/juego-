/* Antibióticos: recurso propio que fabrica un edificio y solo sirve para curar enfermedades. */
(function(){
'use strict';
if(!RK.some(r=>r[0]==='abx')){RK.push(['abx','Antibióticos','#7fd6a8']);RN.abx='antibióticos';IV.abx=300;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.strokeStyle='#111';x.lineWidth=1.5;x.save();x.translate(10,10);x.rotate(-.7);
 x.fillStyle='#f2f2f2';x.beginPath();x.roundRect(-8,-4,8,8,[4,0,0,4]);x.fill();x.stroke();x.fillStyle='#7fd6a8';x.beginPath();x.roundRect(0,-4,8,8,[0,4,4,0]);x.fill();x.stroke();x.restore();ICO.abx=c.toDataURL()}
BT.abxlab={n:'Laboratorio de antibióticos',w:2,h:3,z:34,c:'#cfe8dc',cost:{wood:180,metal:140},lv:4,hp:240,p:{abx:2},pw:1,job:['Médico','Científico'],slots:2,f:'Fabrica antibióticos. Solo sirven para curar enfermedades. Requiere energía.'};
MAT.abxlab='plaster';SIGNT.abxlab='ANTIBIÓTICOS';
const fix=()=>{if(S&&S.res&&!(S.res.abx>=0))S.res.abx=0};
const oU=window.upd;window.upd=function(){fix();return oU.apply(this,arguments)};
const oN=window.newGame;window.newGame=function(){const r=oN.apply(this,arguments);fix();return r};
const oL=window.load;window.load=function(){const r=oL.apply(this,arguments);fix();return r};
})();
/* Árboles y rocas nuevos: uno cada ~45 s en vez de todos de golpe al cambiar de día */
(function(){let t=0;const o=window.upd;window.upd=function(dt){o.apply(this,arguments);try{if(S.over||window.horde)return;t+=dt;if(t>=45){t=0;const n=S.obs.length;genObs(1);if(S.obs.length!==n)rebuild()}}catch(e){}}})();
/* Evita pulsaciones fantasma: el "click" que sigue al toque que abre un panel no puede activar botones del panel recién abierto */
(function(){let t0=0;const o=window.show;window.show=function(){const pan=document.getElementById('pan');if(!pan||pan.style.display!=='block')t0=performance.now();return o.apply(this,arguments)};
['click','pointerdown','pointerup','mousedown','mouseup','touchstart','touchend'].forEach(ev=>document.addEventListener(ev,e=>{if(performance.now()-t0<450&&e.target.closest&&e.target.closest('#pan')){e.stopPropagation();e.preventDefault()}},true))})();
