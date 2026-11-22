/* Táctil: amplía la zona que responde al dedo en botones pequeños (sin cambiar cómo se ven) y sube un poco los textos más diminutos. */
(function(){
'use strict';
const st=document.createElement('style');st.textContent=`
#hzChip,#rbTog,.locbtn,.fs-tools button{position:relative}
#hzChip::after,#rbTog::after,.locbtn::after,.fs-tools button::after{content:"";position:absolute;left:-3px;right:-3px;top:-9px;bottom:-9px}
.binf::after{content:"";position:absolute;inset:-12px}
#rbCol small{font-size:10px}
.fi-lab{font-size:10.5px!important}.fi-h small{font-size:10.5px}
.bz-n{font-size:10px}
/* revisión de interfaz en el móvil (932×415): más zona de toque, sin cambiar el dibujo */
#snChip::after,#top .ch[onclick]::after{content:"";position:absolute;left:-2px;right:-2px;top:-9px;bottom:-9px}
#pan .panel-x::after{content:"";position:absolute;inset:-8px}
#pan .cps::after,#pan .panel-footer button::after,#pan .panel-body>p>button::after,#pan .panel-body>button::after{content:"";position:absolute;left:0;right:0;top:-5px;bottom:-5px}
#dockToggle::after{content:"";position:absolute;inset:-7px}
/* letra mínima 11 px (antes 9,5-10,5) */
#qhn .qh-t small{font-size:11px!important}#qhn .qh-a{font-size:11.5px!important}
#pan .pgf .pc small{font-size:11px!important}
#pan .bcard .bci small{font-size:11px!important}
#pan .invr{font-size:11px!important}
@media (orientation:landscape) and (max-height:520px){#top .ch:nth-child(-n+3),#top .ch:nth-child(-n+3) b{font-size:11px!important;letter-spacing:.2px!important}}
#rl{max-height:calc(100vh - 108px)!important}
/* barra de energía algo más corta para que quepa la letra de 11 px sin que 'Recursos' salte a otra línea */
@media (orientation:landscape) and (max-height:520px){#top .ch>span:has(>i){width:50px!important;min-width:0!important}}`;document.head.appendChild(st);
/* barra de arriba: un toque en el hueco de la barra, en la vertical de una etiqueta tocable, cuenta como tocarla */
function hook(){const t=document.getElementById('top');if(!t||t._tap)return;t._tap=1;t.addEventListener('click',e=>{if(e.target!==t)return;const x=e.clientX;
 const c=[...t.querySelectorAll('button,[onclick]')].find(b=>{const r=b.getBoundingClientRect();return r.width&&x>=r.left-2&&x<=r.right+2});if(c)c.click()})}
setInterval(hook,1000);hook();
})();
