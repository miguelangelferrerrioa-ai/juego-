/* Medidor de rendimiento (Opciones → 📊 Medidor): fps reales y ms por fotograma de lógica (upd), dibujo (render) y barra (hud),
   medidos con performance.now() y promediados cada segundo. "Resto" = tiempo del fotograma que no es JavaScript del juego
   (pintado en la GPU, composición, recolector de basura...). Objetivo: fotograma ≤ 16,6 ms. */
(function(){
'use strict';
let on=false;try{on=localStorage.getItem('ats_fps')==='1'}catch(e){}
const A={upd:[],render:[],hud:[]},F=[];let el=null,lastF=0,lastShow=0;
function wrap(k){const o=window[k];if(typeof o!=='function')return;const w=function(){if(!on)return o.apply(this,arguments);const t=performance.now();try{return o.apply(this,arguments)}finally{A[k].push(performance.now()-t)}};window[k]=w;try{(0,eval)(k+'=window.'+k)}catch(e){}}
['upd','render','hud'].forEach(wrap);
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0,p95=a=>{if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.floor(b.length*.95))]};
const col=v=>v<=16.6?'#7fe07f':v<=33?'#f2c94c':'#ff6b5e';
function box(){if(el)return el;el=document.createElement('div');el.id='fpsM';el.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;background:rgba(0,0,0,.72);color:#e8e8e8;font:600 11px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:5px 8px;border-radius:7px;pointer-events:none;white-space:pre;border:1px solid rgba(255,255,255,.15)';document.body.appendChild(el);return el}
function tick(n){requestAnimationFrame(tick);if(!on){if(el)el.style.display='none';return}if(lastF)F.push(n-lastF);lastF=n;
 if(n-lastShow<1000)return;lastShow=n;const fr=avg(F),fps=fr?1000/fr:0,u=avg(A.upd),r=avg(A.render),h=A.hud.reduce((s,v)=>s+v,0)/Math.max(1,F.length),js=u+r+h,rest=Math.max(0,fr-js);
 const e=box();e.style.display='block';
 e.innerHTML=`<span style="color:${col(fr)}">${fps.toFixed(0)} fps · fotograma ${fr.toFixed(1)} ms (p95 ${p95(F).toFixed(1)})</span>\nlógica  ${u.toFixed(2)} ms (p95 ${p95(A.upd).toFixed(1)})\ndibujo  ${r.toFixed(2)} ms (p95 ${p95(A.render).toFixed(1)})\nbarra   ${h.toFixed(2)} ms\nresto   ${rest.toFixed(1)} ms <span style="opacity:.6">(GPU/navegador)</span>\nzoom ${(typeof cam!=='undefined'?cam.z:0).toFixed(2)} · res ${((typeof dpr!=='undefined'?dpr:0)).toFixed(2)}x`;
 F.length=0;A.upd.length=0;A.render.length=0;A.hud.length=0}
requestAnimationFrame(tick);
window.fpsToggle=function(){on=!on;try{localStorage.setItem('ats_fps',on?'1':'0')}catch(e){}F.length=0;lastF=0;if(typeof toast==='function')toast(on?'Medidor de rendimiento activado (abajo a la izquierda).':'Medidor desactivado.');const b=document.getElementById('fpsBtn');if(b)b.lastChild.textContent=on?'Medidor ✓':'Medidor'};
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('fpsBtn'))return;const b=document.createElement('button');b.id='fpsBtn';b.innerHTML='<i class="ib">📊</i>';b.appendChild(document.createTextNode(on?'Medidor ✓':'Medidor'));b.onclick=()=>{try{tg(0)}catch(e){}fpsToggle()};rl.appendChild(b)}
addBtn();setTimeout(addBtn,1500);
})();
