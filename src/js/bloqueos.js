/* ===== Bloqueos visibles: lo que aún no se puede construir, visitar o usar aparece como silueta/candado con su requisito ===== */
(function(){
'use strict';
const LOCK="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10V7a5 5 0 0 1 10 0v3' fill='none' stroke='%23f2c542' stroke-width='2.4'/%3E%3Crect x='4.5' y='10' width='15' height='11' rx='2.2' fill='%23f2c542'/%3E%3Ccircle cx='12' cy='15.5' r='1.9' fill='%231a1410'/%3E%3C/svg%3E\")";
const st=document.createElement('style');st.textContent=`
[data-lkb]{position:relative;filter:grayscale(1) brightness(.62);cursor:not-allowed}
[data-lkb]:after{content:"";position:absolute;right:3px;top:3px;width:14px;height:14px;background:${LOCK} center/contain no-repeat;filter:none;pointer-events:none}
[data-lkb] .ib,[data-lkb] img,[data-lkb] svg{opacity:.35}
#pan .bcard.lk{opacity:1!important;filter:none!important;border-style:dashed;background:#0d1113}
#pan .bcard.lk b{color:#7d878c}#pan .bcard.lk .blk{color:#f2c542;font-weight:700}
#pan .bcard.lk:after{content:"";position:absolute;left:6px;top:6px;width:15px;height:15px;background:${LOCK} center/contain no-repeat}
#pan .bcard{position:relative}
.lk-ban{display:flex;gap:8px;align-items:center;border:1px dashed #f2c54288;border-radius:8px;padding:7px 10px;margin:6px 0;background:#15150d;color:#f2c542;font-weight:700;font-size:13px}
.lk-ban i{width:18px;height:18px;flex:none;background:${LOCK} center/contain no-repeat}`;
document.head.appendChild(st);
const has=t=>{try{return cnt(t)>0}catch(e){return true}};
const ok=id=>{try{return PROG.ok(id)}catch(e){return true}};
const need=id=>{try{return PROG.need(id)}catch(e){return''}};
const bneed=t=>{try{return avail(t)?'construir '+BT[t].n:'subir el ayuntamiento a nivel '+BT[t].lv}catch(e){return''}};
/* ---- silueta sobre una miniatura ya dibujada ---- */
function sil(cv){try{if(cv.dataset.sil)return;cv.dataset.sil=1;const x=cv.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#05070a';x.fillRect(0,0,cv.width,cv.height);x.globalCompositeOperation='source-over';x.font='bold 30px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=4;x.strokeStyle='#05070a';x.strokeText('?',cv.width/2,cv.height/2+2);x.fillStyle='#f2c542';x.fillText('?',cv.width/2,cv.height/2+2);x.restore()}catch(e){}}
window.lockSil=sil;
/* ---- construir ---- */
(function(){const o=window.buildMenu;if(typeof o!=='function')return;window.buildMenu=function(){const r=o.apply(this,arguments);try{document.querySelectorAll('#pan .bcard.lk canvas.mini').forEach(sil);document.querySelectorAll('#pan .bcard.lk .bci>b').forEach(b=>b.textContent='???')}catch(e){}return r}})();
(function(){const o=window.bInfo;if(typeof o!=='function')return;window.bInfo=function(t){const r=o.apply(this,arguments);try{if(!avail(t)){const pb=document.querySelector('#pan .panel-body')||document.getElementById('pan');pb.querySelectorAll('canvas.mini').forEach(sil);if(!pb.querySelector('.lk-ban')){const d=BT[t],b=document.createElement('div');b.className='lk-ban';b.innerHTML='<i></i><span>Bloqueado · requiere ayuntamiento nivel '+d.lv+(d.tech?' y la tecnología '+TECH.find(q=>q[0]==d.tech)[2]:'')+'</span>';pb.insertBefore(b,pb.firstChild)}hideName(BT[t].n)}}catch(e){}return r}})();
function hideName(n){const pan=document.getElementById('pan');const w=document.createTreeWalker(pan,NodeFilter.SHOW_TEXT);let x;const L=[];while(x=w.nextNode())L.push(x);L.forEach(t=>{if(t.nodeValue.includes(n))t.nodeValue=t.nodeValue.split(n).join('???')});
 pan.querySelectorAll('.bdesc').forEach(p=>p.textContent='Estructura desconocida. Sube el ayuntamiento para descubrir qué es.')}
/* ---- botones del menú lateral ---- */
const RULES=[
 [/^Investigar/,()=>!has('lab'),()=>bneed('lab')],
 [/^Ejército/,()=>!ok('ejercito'),()=>need('ejercito')],
 [/^Mapa exterior/,()=>!has('expo'),()=>bneed('expo')],
 [/^Villa/,()=>!ok('villa'),()=>need('villa')],
 [/^Guardia/,()=>!ok('guardia'),()=>need('guardia')]];
const lbl=b=>{const n=[...b.childNodes].filter(x=>x.nodeType===3&&x.nodeValue.trim());return n[n.length-1]||null};
function rail(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return;document.querySelectorAll('#rl>button').forEach(b=>{const tn=lbl(b);if(tn&&b.dataset.nm===undefined)b.dataset.nm=tn.nodeValue;const t=(b.dataset.nm||b.textContent).trim(),r=RULES.find(q=>q[0].test(t));if(!r)return;let lk=false;try{lk=r[1]()}catch(e){}
  if(lk){b.dataset.lkb=r[2]();if(tn&&tn.nodeValue!=='???')tn.nodeValue='???'}else{if(b.dataset.lkb!==undefined)delete b.dataset.lkb;if(tn&&b.dataset.nm&&tn.nodeValue!==b.dataset.nm)tn.nodeValue=b.dataset.nm}if(b.style.opacity)b.style.opacity=''})}catch(e){}}
setInterval(rail,1000);setTimeout(rail,300);
/* ---- un toque sobre algo bloqueado explica el requisito ---- */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-lkb]');if(!b)return;e.stopImmediatePropagation();e.preventDefault();try{toast('🔒 Bloqueado: necesitas '+b.dataset.lkb+'.')}catch(x){}},true);
/* ---- pestañas de expedición ---- */
(function(){const o=window.expMenu;if(typeof o!=='function')return;window.expMenu=function(){const r=o.apply(this,arguments);try{const row=document.querySelector('#pan .prow.ptabs');if(!row)return r;
 if(!has('expo')){if(!row.querySelector('[data-lkb]')){const n=bneed('expo'),f=document.createDocumentFragment();['Historia','Libres','Mapa','Villa'].forEach(t=>{const b=document.createElement('button');b.textContent=t;b.dataset.lkb=n;f.appendChild(b)});row.insertBefore(f,row.firstChild)}}
 else row.querySelectorAll('button').forEach(b=>{const t=b.textContent;if(/Villa/.test(t)&&!ok('villa'))b.dataset.lkb=need('villa');else if(/Historia/.test(t)&&!ok('hist'))b.dataset.lkb=need('hist')})}catch(e){}return r}})();
/* ---- forja (almacén) ---- */
(function(){const o=window.storeMenu;if(typeof o!=='function')return;window.storeMenu=function(){const r=o.apply(this,arguments);try{const b=document.getElementById('forgeB'),G=13;if(b){if(hallLv()<G){b.dataset.lkb='ayuntamiento nivel '+G;b.textContent='???'}else delete b.dataset.lkb}}catch(e){}return r}})();
/* ---- lugares de la villa ---- */
const VP={empeno:'villa',mercado:'villa',clinica:'villa',gasolinera:'villa',taberna:'taberna',armeria:'armeria',tablon:'tablon',casino:'casino'};
window.villaLocked=k=>{const id=VP[k];return !!(id&&!ok(id))};
})();
/* ===== Avisos: con una ventana abierta salen abajo a la izquierda para no tapar el título ===== */
(function(){const st=document.createElement('style');st.textContent=`body:not(.pan-open) #log{left:150px!important;max-width:calc(100% - 330px)!important}body.pan-open #log{top:auto!important;bottom:14px!important;left:24px!important;max-width:min(60%,520px)!important;display:flex;flex-direction:column-reverse;z-index:60!important}`;document.head.appendChild(st);
setInterval(()=>{try{const p=document.getElementById('pan');const on=!!(p&&getComputedStyle(p).display!=='none'&&p.offsetHeight>0);document.body.classList.toggle('pan-open',on)}catch(e){}},200)})();
