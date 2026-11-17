/* Muros: selección múltiple y tramo recto.
   - Ficha de un muro → "⬚ Seleccionar varios": arrastra el dedo para marcar una zona (se añaden los muros y puertas de dentro);
     toca un muro para añadirlo o quitarlo. Barra de abajo: Mejorar · Reparar · Mover · Destruir (con coste total).
   - "Tramo recto": la línea recta de muros desde el que tocas hasta una esquina, puerta o hueco.
   - Mover en grupo: se arrastra todo el grupo a la vez, con vista previa verde/roja, y se confirma.
   - Con dos dedos se sigue moviendo la cámara y haciendo zoom. */
(function(){
'use strict';
const isW=b=>!!b&&(b.type==='wall'||b.type==='gate');
let W=null;
/* tramo recto: desde b, en la dirección con más muros seguidos; corta en puertas y huecos */
function line(b){const at=(x,y)=>{const o=occ[y*N+x];const q=o>0?bm[o]:null;return q&&q.type==='wall'?q:null};
 const run=(dx,dy)=>{const r=[];let x=b.x+dx,y=b.y+dy;while(x>=0&&y>=0&&x<N&&y<N){const q=at(x,y);if(!q)break;r.push(q);x+=dx;y+=dy}return r};
 const h=run(1,0).concat(run(-1,0)),v=run(0,1).concat(run(0,-1));return [b].concat(h.length>=v.length?h:v)}
window.wLine=line;
function start(id,how,mode){const b=bm[id];if(!b)return;try{hide()}catch(e){}
 W={mode:'sel',ids:new Set(how==='line'?line(b).map(q=>q.id):[id]),a:null,b:null,dx:0,dy:0,pt:new Set(),arm:0};if(mode==='move')toMove();bar()}
window.wSelStart=start;
function list(){return [...W.ids].map(i=>bm[i]).filter(Boolean)}
function add(c,v,k){for(const x in v)c[x]=(c[x]||0)+v[x]*(k||1)}
function upInfo(){const L=list().filter(b=>b.lvl<5&&b.lvl<hallLv()+1&&!(window.ugate&&ugate(b))),c={};L.forEach(b=>add(c,window.ucost?ucost(b):costOf(BT[b.type].cost,b.lvl+1)));return {L,c}}
function rpInfo(){const L=list().filter(b=>b.hp<mxhp(b)-.5),c={};L.forEach(b=>add(c,window.repairCost?repairCost(b):{}));return {L,c}}
function bar(){let f=document.getElementById('wsb');if(!W){if(f)f.remove();return}
 if(!f){f=document.createElement('div');f.id='wsb';document.body.appendChild(f)}
 const n=W.ids.size;
 if(W.mode==='move'){const ok=valid();f.innerHTML=`<div class="wsb-t">✥ Mover ${n} ${n===1?'pieza':'piezas'} · arrastra con un dedo</div><div class="wsb-s" style="color:${ok?'#8dff9b':'#ff8585'}">${ok?'Ubicación válida':'Ubicación no válida'}</div><div class="wsb-b"><button class="go" ${ok&&(W.dx||W.dy)?'':'disabled'} onclick="wSel('mvok')">✔ Confirmar</button><button onclick="wSel('mvno')">✕ Cancelar</button></div>`;return}
 const U=upInfo(),R=rpInfo();
 f.innerHTML=`<div class="wsb-t">⬚ ${n} ${n===1?'seleccionado':'seleccionados'}</div><div class="wsb-s">Arrastra: marcar zona · Toca: añadir/quitar · 2 dedos: cámara</div><div class="wsb-b">`+
  `<button ${U.L.length?'':'disabled'} onclick="wSel('up')">⬆ Mejorar ${U.L.length}<small>${U.L.length?cs(U.c):'nada que mejorar'}</small></button>`+
  `<button ${R.L.length?'':'disabled'} onclick="wSel('rp')">🔧 Reparar ${R.L.length}<small>${R.L.length?cs(R.c):'todo en orden'}</small></button>`+
  `<button ${n?'':'disabled'} onclick="wSel('mv')">✥ Mover</button>`+
  `<button class="del" ${n?'':'disabled'} onclick="wSel('del')">${W.arm?'¿Seguro? (devuelve 50%)':'🗑 Destruir'}</button>`+
  `<button onclick="wSel('none')">Vaciar</button><button onclick="wSel('out')">✕ Salir</button></div>`}
/* validez del grupo desplazado: se quitan del mapa un momento para no chocar consigo mismos */
let VK='',VV=true;
function valid(){const k=W.dx+','+W.dy+','+W.ids.size;if(k===VK)return VV;VK=k;const L=list(),sv=[];
 L.forEach(b=>{for(let i=0;i<b.w;i++)for(let j=0;j<b.h;j++){const q=(b.y+j)*N+b.x+i;sv.push([q,occ[q]]);occ[q]=0}});
 let ok=true;const pl=window.placing;try{window.placing=null}catch(e){}
 for(const b of L){const x=b.x+W.dx,y=b.y+W.dy;if(x<0||y<0||x+b.w>N||y+b.h>N||!okAt(x,y,b.w,b.h,b.id)){ok=false;break}}
 try{window.placing=pl}catch(e){}sv.forEach(([q,v])=>occ[q]=v);VV=ok;return ok}
function toMove(){W.mode='move';W.dx=0;W.dy=0;VK=''}
window.wSel=function(a){if(!W)return;
 if(a==='out'){W=null;bar();return}
 if(a==='none'){W.ids.clear();W.arm=0;bar();return}
 if(a==='up'){const U=upInfo();if(!U.L.length)return;if(!can(U.c))return toast('Faltan recursos: '+cs(U.c));pay(U.c);U.L.forEach(b=>{b.lvl++;b.hp=mxhp(b);b.fxUpgrade=T});toast(U.L.length+(U.L.length>1?' piezas mejoradas.':' pieza mejorada.'));try{save()}catch(e){}bar();return}
 if(a==='rp'){const R=rpInfo();if(!R.L.length)return;if(!can(R.c))return toast('Faltan recursos: '+cs(R.c));pay(R.c);R.L.forEach(b=>b.hp=mxhp(b));toast(R.L.length+' reparadas.');try{save()}catch(e){}bar();return}
 if(a==='mv'){toMove();bar();return}
 if(a==='mvno'){W.mode='sel';W.dx=W.dy=0;bar();return}
 if(a==='mvok'){if(!valid()||!(W.dx||W.dy))return;list().forEach(b=>{b.x+=W.dx;b.y+=W.dy});rebuild();try{dirtyT=1}catch(e){}try{save()}catch(e){}toast('Movidas '+W.ids.size+' piezas.');W.mode='sel';W.dx=W.dy=0;bar();return}
 if(a==='del'){if(!W.arm){W.arm=1;bar();setTimeout(()=>{if(W&&W.arm){W.arm=0;bar()}},3000);return}
  const L=list();L.forEach(b=>{const c=costOf(BT[b.type].cost);for(const k in c)S.res[k]+=Math.floor(c[k]*.5*b.lvl)});const ids=new Set(L.map(b=>b));S.bld=S.bld.filter(x=>!ids.has(x));rebuild();try{save()}catch(e){}toast(L.length+' piezas destruidas.');W.ids.clear();W.arm=0;bar();return}};
/* toque: añade o quita el muro tocado */
const oTap=window.tap;
window.tap=function(sx,sy){if(!W)return oTap.apply(this,arguments);if(W.mode!=='sel')return;const b=hitB(sx,sy);let q=isW(b)?b:null;if(!q){const g=scr2g(sx,sy),o=occ[Math.floor(g.y)*N+Math.floor(g.x)];q=o>0&&isW(bm[o])?bm[o]:null}
 if(q){if(W.ids.has(q.id))W.ids.delete(q.id);else W.ids.add(q.id);W.arm=0;bar()}};
try{tap=window.tap}catch(e){}
/* arrastre con un dedo: zona (selección) o desplazamiento (mover); la cámara no se mueve */
const cv=document.getElementById('c'),oD=cv.onpointerdown,oM=cv.onpointermove,oU=cv.onpointerup;
cv.onpointerdown=function(e){if(W){W.pt.add(e.pointerId);if(W.pt.size===1){W.g0=scr2g(e.clientX,e.clientY);W.s0=[e.clientX,e.clientY];W.drag=0;W.dx0=W.dx;W.dy0=W.dy}else{W.a=W.b=null;W.drag=0}}return oD.apply(this,arguments)};
cv.onpointermove=function(e){if(!W||W.pt.size!==1||!W.pt.has(e.pointerId))return oM.apply(this,arguments);const cx=cam.x,cy=cam.y;oM.apply(this,arguments);cam.x=cx;cam.y=cy;
 if(!W.drag&&Math.hypot(e.clientX-W.s0[0],e.clientY-W.s0[1])>8)W.drag=1;if(!W.drag)return;const g=scr2g(e.clientX,e.clientY);
 if(W.mode==='sel'){W.a=W.g0;W.b=g}else{const dx=W.dx0+Math.round(g.x-W.g0.x),dy=W.dy0+Math.round(g.y-W.g0.y);if(dx!==W.dx||dy!==W.dy){W.dx=dx;W.dy=dy;bar()}}};
cv.onpointerup=cv.onpointercancel=function(e){if(W){const one=W.pt.size===1;W.pt.delete(e.pointerId);
  if(one&&W.mode==='sel'&&W.drag&&W.a){const x0=Math.floor(Math.min(W.a.x,W.b.x)),x1=Math.floor(Math.max(W.a.x,W.b.x)),y0=Math.floor(Math.min(W.a.y,W.b.y)),y1=Math.floor(Math.max(W.a.y,W.b.y));
   S.bld.forEach(b=>{if(isW(b)&&b.x<=x1&&b.x+b.w-1>=x0&&b.y<=y1&&b.y+b.h-1>=y0)W.ids.add(b.id)});W.a=W.b=null;W.arm=0;bar()}
  if(one&&W.drag){/* que no cuente como toque */const r=oU.apply(this,arguments);return r}}
 return oU.apply(this,arguments)};
/* dibujo: piezas seleccionadas en amarillo; zona en curso; al mover, la vista previa verde/roja en el destino */
function dia(c,x,y,w,h){const a=P(x,y),b=P(x+w,y),d=P(x+w,y+h),e=P(x,y+h);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath()}
const oR=window.render;
window.render=function(){const r=oR.apply(this,arguments);if(!W)return r;try{const c=document.getElementById('c').getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  const mv=W.mode==='move',ok=mv?valid():true;
  for(const b of list()){dia(c,b.x,b.y,b.w,b.h);c.fillStyle=mv?'rgba(255,255,255,.12)':'rgba(255,214,90,.35)';c.fill();c.lineWidth=2/cam.z;c.strokeStyle=mv?'rgba(255,255,255,.5)':'#ffd65a';c.stroke();
   if(mv&&(W.dx||W.dy)){dia(c,b.x+W.dx,b.y+W.dy,b.w,b.h);c.fillStyle=ok?'rgba(80,220,110,.45)':'rgba(240,70,60,.5)';c.fill();c.strokeStyle=ok?'#8dff9b':'#ff8585';c.stroke()}}
  if(W.a&&W.b){const x0=Math.floor(Math.min(W.a.x,W.b.x)),x1=Math.floor(Math.max(W.a.x,W.b.x))+1,y0=Math.floor(Math.min(W.a.y,W.b.y)),y1=Math.floor(Math.max(W.a.y,W.b.y))+1;dia(c,x0,y0,x1-x0,y1-y0);c.fillStyle='rgba(255,214,90,.12)';c.fill();c.setLineDash([8/cam.z,6/cam.z]);c.lineWidth=2.5/cam.z;c.strokeStyle='#ffd65a';c.stroke();c.setLineDash([])}
  c.restore()}catch(e){}return r};
try{render=window.render}catch(e){}
const st=document.createElement('style');st.textContent=`#wsb{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;z-index:60;background:rgba(14,19,11,.92);border:1.5px solid #c9a23a;border-radius:10px;padding:4px 7px;max-width:calc(100vw - 230px);color:#e8e2cc;font:600 11px system-ui;box-shadow:0 3px 12px #0008}
#wsb .wsb-t{font-weight:900;color:#ffd877;font-size:12px;display:inline}#wsb .wsb-s{display:inline;font-size:10px;color:#b9b39c;margin-left:8px}#wsb .wsb-b{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:4px;margin-top:3px}
#wsb button{flex:0 0 auto;font:800 11px system-ui;padding:3px 8px;border-radius:7px;border:1px solid #6a7a4a;background:#24301c;color:#e8f0d8;display:flex;flex-direction:column;align-items:flex-start;line-height:1.2}#wsb button small{font-weight:600;font-size:9px;color:#cfc8a8}
#wsb button.go{background:#2f6a2a;border-color:#7fd06a}#wsb button.del{background:#5a1f1a;border-color:#c0504a}#wsb button:disabled{opacity:.45}`;document.head.appendChild(st);
})();
