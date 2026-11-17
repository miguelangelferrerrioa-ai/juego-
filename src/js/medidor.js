/* Medidor de rendimiento (Opciones → 📊 Medidor); con botones para apagar capas (Mezclas, Ambiente, Terreno...) y ver cuánto cuesta cada una: fps reales y ms por fotograma de lógica (upd), dibujo (render) y barra (hud),
   medidos con performance.now() y promediados cada segundo. "Resto" = tiempo del fotograma que no es JavaScript del juego
   (pintado en la GPU, composición, recolector de basura...). Objetivo: fotograma ≤ 16,6 ms. */
(function(){
'use strict';
window.PERFC={tz:0,fb:0,ed:0,ar:0,lv:0,te:0,cp:0};let on=false;try{on=localStorage.getItem('ats_fps')==='1'}catch(e){}
const A={upd:[],render:[],hud:[]},F=[];let el=null,lastF=0,lastShow=0;
function wrap(k){const o=window[k];if(typeof o!=='function')return;const w=function(){if(!on)return o.apply(this,arguments);const t=performance.now();try{return o.apply(this,arguments)}finally{A[k].push(performance.now()-t)}};window[k]=w;try{(0,eval)(k+'=window.'+k)}catch(e){}}
['upd','render','hud'].forEach(wrap);
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0,p95=a=>{if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.floor(b.length*.95))]};
const col=v=>v<=16.6?'#7fe07f':v<=33?'#f2c94c':'#ff6b5e';
function box(){if(el)return el;el=document.createElement('div');el.id='fpsM';el.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;background:rgba(0,0,0,.72);color:#e8e8e8;font:600 11px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:5px 8px;border-radius:7px;pointer-events:none;white-space:pre;border:1px solid rgba(255,255,255,.15)';document.body.appendChild(el);return el}
/* peor fotograma de los últimos 3 s y el trabajo que se hizo en él */let PV=null,WORST=null,wT=0;const snap=()=>Object.assign({},PERFC);
function tick(n){requestAnimationFrame(tick);if(!on){if(el)el.style.display='none';return}if(lastF){const d=n-lastF;F.push(d);if(PV&&(!WORST||d>WORST.d||n-wT>3000)){WORST={d,c:PV};wT=n}}lastF=n;
 {const cur=snap(),pr=tick._p||cur,dl={};for(const k in cur)dl[k]=cur[k]-pr[k];tick._p=cur;PV=dl}
 if(n-lastShow<1000)return;lastShow=n;const fr=avg(F),fps=fr?1000/fr:0,u=avg(A.upd),r=avg(A.render),h=A.hud.reduce((s,v)=>s+v,0)/Math.max(1,F.length),js=u+r+h,rest=Math.max(0,fr-js);
 const e=box();e.style.display='block';
 e.innerHTML=`<span style="color:${col(fr)}">${fps.toFixed(0)} fps · fotograma ${fr.toFixed(1)} ms (p95 ${p95(F).toFixed(1)})</span>\nlógica  ${u.toFixed(2)} ms (p95 ${p95(A.upd).toFixed(1)})\ndibujo  ${r.toFixed(2)} ms (p95 ${p95(A.render).toFixed(1)})\nbarra   ${h.toFixed(2)} ms\nresto   ${rest.toFixed(1)} ms <span style="opacity:.6">(GPU/navegador)</span>\n${WORST?`<span style="color:${col(WORST.d)}">peor 3 s: ${WORST.d.toFixed(0)} ms</span> · trozos ${WORST.c.tz} · sin trozo ${WORST.c.fb} · edificios ${WORST.c.ed}${WORST.c.cp?' · compactar':''} · árboles ${WORST.c.ar}${WORST.c.lv?' · niveles '+WORST.c.lv:''}${WORST.c.te?' · terreno':''}`:''}\nzoom ${(typeof cam!=='undefined'?cam.z:0).toFixed(2)} · res ${((typeof dpr!=='undefined'?dpr:0)).toFixed(2)}x`;
 F.length=0;A.upd.length=0;A.render.length=0;A.hud.length=0}

/* interruptores de capas para encontrar qué cuesta en la GPU: se apaga una capa y se mira cuánto suben los fps (no se guardan) */
const KILL={},LAY=[['atlas','Sin atlas',null],['trozos','Sin trozos',null],['mezclas','Mezclas',null],['ambiente','Ambiente',['apoFX']],['luz','Luz día/noche',['lightFX']],['clima','Clima',['advWeatherFX','advDamageFX']],['terreno','Terreno',['drawTiled','drawOuter']],['arboles','Árboles',['obsSpr']],['edif','Edificios',['bCache']],['pers','Personas',['fig']],['part','Partículas',['drawPT','ambientFX']]];
LAY.forEach(([id,,fs])=>{if(!fs)return;fs.forEach(k=>{const o=window[k];if(typeof o!=='function')return;const w=function(){if(KILL[id])return k==='bCache'?true:undefined;return o.apply(this,arguments)};window[k]=w;try{(0,eval)(k+'=window.'+k)}catch(e){}})});
let kp=null;
function setK(id,v){KILL[id]=v;if(id==='mezclas')window.PERF_NOBLEND=v;if(id==='trozos')window.GROUND_ON=!v;if(id==='atlas'){window.ATLAS_OFF=v;if(window.atlasToggle)atlasToggle(!v)}const b=kp&&kp.querySelector('[data-k="'+id+'"]');if(b){b.style.background=v?'#7a2a22':'#1d2618';b.style.textDecoration=v?'line-through':'none'}F.length=0;lastShow=0}
/* diagnóstico automático: con la cámara quieta, apaga cada capa por separado 4 s (1,5 de espera + 2,5 midiendo) y muestra una tabla */
let DG=null;
function diag(){if(DG)return;const out=[],ids=[['','Normal']].concat(LAY.map(l=>[l[0],l[1]])),res=document.createElement('div');DG=res;
 LAY.forEach(l=>{if(KILL[l[0]])setK(l[0],false)});
 res.style.cssText='position:fixed;right:8px;top:70px;z-index:100000;background:rgba(0,0,0,.85);color:#e8e8e8;font:600 12px/1.45 ui-monospace,Menlo,monospace;padding:8px 10px;border-radius:8px;white-space:pre;border:1px solid #6a7a4a';document.body.appendChild(res);
 let i=0;const step=()=>{if(i>=ids.length){res.innerHTML='<b>Diagnóstico</b> (fps · GPU ms · dibujo ms)\n'+out.join('\n')+'\n<span style="opacity:.6">toca para cerrar</span>';res.onclick=()=>{res.remove();DG=null};return}
  const [id,n]=ids[i];if(id)setK(id,true);res.textContent='Diagnóstico: no muevas la cámara\n'+(i+1)+'/'+ids.length+' · '+(id?'sin '+n.replace(/^Sin /i,''):n);
  setTimeout(()=>{const fs=[],rs=[];let l=0;const t0=performance.now();const rr=window.render;const R=[];window.render=function(){const a=performance.now();const x=rr.apply(this,arguments);R.push(performance.now()-a);return x};try{(0,eval)('render=window.render')}catch(e){}
   const f=n2=>{if(l)fs.push(n2-l);l=n2;if(n2-t0<2500)requestAnimationFrame(f);else{window.render=rr;try{(0,eval)('render=window.render')}catch(e){}const fr=avg(fs),dr=avg(R);out.push((id?'sin '+n.replace(/^Sin /i,''):n).padEnd(16)+String(Math.round(1000/fr)).padStart(3)+' fps · '+Math.max(0,fr-dr-1).toFixed(1).padStart(5)+' · '+dr.toFixed(1).padStart(4));if(id)setK(id,false);i++;setTimeout(step,300)}};requestAnimationFrame(f)},1500)};
 step()}

function killPanel(){if(!on){if(kp)kp.style.display='none';return}if(!kp){kp=document.createElement('div');kp.id='fpsK';kp.style.cssText='position:fixed;left:8px;bottom:118px;z-index:99999;display:flex;flex-wrap:wrap;gap:4px;max-width:330px';document.body.appendChild(kp);
  kp.innerHTML='<button data-diag="1" style="font:800 11px system-ui;padding:5px 8px;border-radius:7px;border:1px solid #c9a23a;background:#5a4a12;color:#ffe9a8">▶ Diagnóstico</button>'+LAY.map(([id,n])=>`<button data-k="${id}" style="font:700 11px system-ui;padding:5px 8px;border-radius:7px;border:1px solid #6a7a4a;background:#1d2618;color:#d8dfcc">${n}</button>`).join('');
  kp.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.diag){diag();return}const id=b.dataset.k;setK(id,!KILL[id]);return;KILL[id]=!KILL[id];if(id==='mezclas')window.PERF_NOBLEND=KILL[id];if(id==='trozos')window.GROUND_ON=!KILL[id];if(id==='atlas'){window.ATLAS_OFF=KILL[id];if(window.atlasToggle)atlasToggle(!KILL[id])}b.style.background=KILL[id]?'#7a2a22':'#1d2618';b.style.textDecoration=KILL[id]?'line-through':'none';F.length=0;lastShow=0})}
 kp.style.display='flex'}
setInterval(killPanel,500);
requestAnimationFrame(tick);
window.fpsToggle=function(){on=!on;try{localStorage.setItem('ats_fps',on?'1':'0')}catch(e){}F.length=0;lastF=0;if(typeof toast==='function')toast(on?'Medidor de rendimiento activado (abajo a la izquierda).':'Medidor desactivado.');const b=document.getElementById('fpsBtn');if(b)b.lastChild.textContent=on?'Medidor ✓':'Medidor'};
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('fpsBtn'))return;const b=document.createElement('button');b.id='fpsBtn';b.innerHTML='<i class="ib">📊</i>';b.appendChild(document.createTextNode(on?'Medidor ✓':'Medidor'));b.onclick=()=>{try{tg(0)}catch(e){}fpsToggle()};rl.appendChild(b)}
addBtn();setTimeout(addBtn,1500);
})();
