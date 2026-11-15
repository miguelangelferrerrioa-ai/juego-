/* Táctil: amplía la zona que responde al dedo en botones pequeños (sin cambiar cómo se ven) y sube un poco los textos más diminutos. */
(function(){
'use strict';
const st=document.createElement('style');st.textContent=`
#hzChip,#rbTog,.locbtn,.fs-tools button{position:relative}
#hzChip::after,#rbTog::after,.locbtn::after,.fs-tools button::after{content:"";position:absolute;left:-3px;right:-3px;top:-9px;bottom:-9px}
.binf::after{content:"";position:absolute;inset:-12px}
#rbCol small{font-size:10px}
.fi-lab{font-size:10.5px!important}.fi-h small{font-size:10.5px}
.bz-n{font-size:10px}`;document.head.appendChild(st);
/* barra de arriba: un toque en el hueco de la barra, en la vertical de una etiqueta tocable, cuenta como tocarla */
function hook(){const t=document.getElementById('top');if(!t||t._tap)return;t._tap=1;t.addEventListener('click',e=>{if(e.target!==t)return;const x=e.clientX;
 const c=[...t.querySelectorAll('button,[onclick]')].find(b=>{const r=b.getBoundingClientRect();return r.width&&x>=r.left-2&&x<=r.right+2});if(c)c.click()})}
setInterval(hook,1000);hook();
})();
