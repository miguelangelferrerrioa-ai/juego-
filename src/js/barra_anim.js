/* Barra de recursos viva: los números suben/bajan poco a poco en vez de saltar, y al ganar una cantidad de golpe (recompensas, botín, compras…) aparece un "+N" flotando junto al recurso. */
(function(){
'use strict';
const SHOWN={};            /* último valor que se ha enseñado de cada recurso (por nombre) */
const ANIM=new WeakMap();
function tween(el,from,to){const t0=performance.now(),D=650,a=ANIM.get(el);if(a)cancelAnimationFrame(a);
 el.classList.remove('rb-up','rb-dn');void el.offsetWidth;el.classList.add(to>from?'rb-up':'rb-dn');
 const f=now=>{if(!el.isConnected)return;const k=Math.min(1,(now-t0)/D),e=1-Math.pow(1-k,3);el.textContent=String(Math.round(from+(to-from)*e));if(k<1)ANIM.set(el,requestAnimationFrame(f))};ANIM.set(el,requestAnimationFrame(f))}
function onPaint(col){col.querySelectorAll('.r[title]').forEach(r=>{const k=r.getAttribute('title'),b=r.querySelector('b');if(!b)return;const v=+b.textContent;if(!isFinite(v))return;
 const old=SHOWN[k];SHOWN[k]=v;if(old===undefined||old===v)return;if(Math.abs(v-old)<1)return;b.textContent=String(old);tween(b,old,v)})}
let mo=null;
function hook(){const col=document.getElementById('rbCol');if(!col||mo)return;mo=new MutationObserver(()=>{mo.disconnect();try{onPaint(col)}finally{mo.observe(col,{childList:true})}});mo.observe(col,{childList:true})}
/* "+N" flotante */
let last=null,lastS=null;
const NAME=k=>{try{return((RK.find(r=>r[0]===k)||[])[1])||k}catch(e){return k}};
function live(){try{if(typeof S==='undefined'||!S||!S.res||!S.bld||!S.bld.length||S.over)return false;if(typeof LIVE!=='undefined'&&!LIVE)return false;const ts=document.getElementById('titleScreen');if(ts&&getComputedStyle(ts).display!=='none')return false;return true}catch(e){return false}}
function anchor(k){const col=document.getElementById('rbCol');if(col&&col.classList.contains('open')){const r=[...col.querySelectorAll('.r[title]')].find(e=>e.getAttribute('title')===NAME(k));if(r){const b=r.getBoundingClientRect();if(b.width)return[b.right-3,b.top+b.height/2,1]}}
 const t=document.getElementById('rbTog');if(t){const b=t.getBoundingClientRect();if(b.width)return[b.left+b.width/2,b.bottom+4]}return[innerWidth/2,44]}
let stack=0,stackT=0;
function float(k,n){const now=performance.now();if(now-stackT>900)stack=0;stackT=now;const [x,y,inRow]=anchor(k);/* solo con la columna de Recursos abierta */if(!inRow)return;const i=0;
 const el=document.createElement('div');el.className='rb-float';let ic='';try{ic=typeof ICO!=='undefined'&&ICO[k]?`<img src="${ICO[k]}">`:''}catch(e){}
 el.innerHTML=`${ic}<b>+${n}</b>`;el.style.left=x+'px';el.style.top=(y+i*20)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),1500)}
function watch(){if(!live()){last=null;return}
 if(lastS!==S){lastS=S;last=null}
 const cur={};for(const k in S.res)cur[k]=+S.res[k]||0;
 if(last){let d=null;try{d=rate()}catch(e){}
  for(const k in cur){if(k==='rp'||k==='elec')continue;const g=cur[k]-(last[k]||0),exp=d&&d[k]?Math.abs(d[k])/600*0.6*3:0;
   /* solo saltos de golpe: no la producción normal ni el goteo de los edificios */
   if(g>=10&&g>exp+8)float(k,Math.round(g))}}
 last=cur}
setInterval(()=>{try{hook();watch()}catch(e){}},600);
const st=document.createElement('style');st.textContent=`
#rbCol b.rb-up{animation:rbUp .9s ease-out}#rbCol b.rb-dn{animation:rbDn .9s ease-out}
@keyframes rbUp{0%{color:#7dff7d;text-shadow:0 0 8px #5f5}100%{}}@keyframes rbDn{0%{color:#ff9a8a;text-shadow:0 0 8px #f55}100%{}}
.rb-float{position:fixed;z-index:9990;pointer-events:none;display:flex;align-items:center;gap:4px;transform:translate(-100%,-50%);padding:2px 8px 2px 4px;border-radius:10px;background:rgba(14,24,12,.88);border:1px solid #5fbf5f;color:#9dff9d;font:800 13px system-ui,sans-serif;text-shadow:0 1px 2px #000;animation:rbFl 1.5s ease-out forwards}
.rb-float img{width:16px;height:16px}
@keyframes rbFl{0%{opacity:0;margin-top:6px}15%{opacity:1;margin-top:0}70%{opacity:1}100%{opacity:0;margin-top:-26px}}`;document.head.appendChild(st);
})();
