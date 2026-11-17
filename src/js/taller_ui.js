/* Taller de armas: el menú de fabricar pasa de una lista de botones con mucho texto a tarjetas con imagen, rareza, daño,
   tipo (fuego / cuerpo a cuerpo), bonos, coste con lo que tienes y botón Fabricar. Pestañas Armas / Atuendos.
   Lo que aún no tiene plano sale como silueta «???» (sin spoilers). */
(function(){
'use strict';
const RC={C:['Común','#bdbdbd'],U:['Poco común','#7fc97f'],R:['Raro','#6aa9ff'],E:['Épico','#b36cff'],L:['Legendario','#e8b84a']};
const esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'})[c]);
const bt=b=>Object.keys(b||{}).map(k=>k+' +'+b[k]).join(' · ');
const own=n=>(S.inv||[]).filter(x=>x&&x.n===n).length;
const plan=n=>!window.hasPlan||hasPlan(n);
function chips(c){return Object.keys(c).filter(k=>c[k]).map(k=>{const ok=(S.res[k]||0)>=c[k]||S.mode==='creativo';return `<span class="bp2k ${ok?'':'no'}"><img src="${(typeof ICO!=='undefined'&&ICO[k])||''}" width=12>${c[k]}<small>${Math.floor(S.res[k]||0)}</small></span>`}).join('')}
function card(o){const r=RC[o.r]||RC.C;
 return `<div class="tl-c" style="--rc:${r[1]}"><div class="tl-im"><img src="${o.img}"></div><div class="tl-n" style="color:${r[1]}">${esc(o.n)}</div><div class="tl-tags"><span class="tl-r">${r[0]}</span>${o.tag?`<span>${o.tag}</span>`:''}</div>
 <div class="tl-st">${o.stat}</div>${o.b?`<div class="tl-b">${esc(o.b)}</div>`:''}<div class="tl-cost">${chips(o.c)}</div>
 <button class="tl-go" ${o.why?'disabled':''} onclick="${o.fn}">${o.why?esc(o.why):'⚒ Fabricar'}</button>${o.own?`<small class="tl-own">En el almacén: ${o.own}</small>`:''}</div>`}
const lockCard=n=>n?`<div class="tl-c tl-lk"><div class="tl-im"><div class="tl-sil">?</div></div><div class="tl-n">??? ×${n}</div><div class="tl-st">Planos por encontrar</div><div class="tl-b" style="color:#9a9c8e">Aparecen en misiones y expediciones</div></div>`:'';
function weapons(){const L=[];let lk=0;WP.forEach((w,i)=>{if(!w.c)return;if(!plan(w.n)){lk++;return}
 const c=costOf(w.c,1),tech=w.t&&!th(w.t),mel=window.isMelee&&isMelee(w);
 L.push(card({n:w.n,r:w.r||'C',img:window.weaponIcon?weaponIcon(w.n):'',tag:mel?'🗡 Cuerpo a cuerpo':'🔫 De fuego',stat:'⚔ Daño +'+w.v,b:bt(w.b),c,fn:`craft(${i})`,why:tech?'🔒 Falta investigarlo':(!can(c)?'Faltan recursos':''),own:own(w.n)}))});
 return L.join('')+lockCard(lk)}
function outfits(){const L=[];let lk=0;Object.values(window.OUTFITS||{}).forEach(o=>{if(!o.c)return;if(!plan(o.n)){lk++;return}const c=costOf(o.c,1);
 L.push(card({n:o.n,r:o.r||'C',img:window.outfitIcon?outfitIcon(o.n):'',tag:'🛡 Atuendo',stat:'🛡 Defensa +'+o.def,b:bt(o.b),c,fn:`outCraft('${o.n.replace(/'/g,"\\'")}')`,why:!can(c)?'Faltan recursos':'',own:own(o.n)}))});
 return (L.join('')||'')+lockCard(lk)||'<p>Aún no tienes planos de atuendos.</p>'}
window.tlTab=function(t,id){window.TLTAB=t;bPanel(id)};
function section(id){const t=window.TLTAB||'w';let ps='';try{const c=WP.filter(w=>w.c).map(w=>w.n).concat(Object.values(window.OUTFITS||{}).filter(o=>o.c).map(o=>o.n)),h=c.filter(plan).length;ps=`📜 Planos: <b>${h}/${c.length}</b>`}catch(e){}
 return `<div class="tl-sec"><div class="tl-hd"><b>⚒ Fabricar</b><div class="tl-tabs"><button class="${t==='w'?'on':''}" onclick="tlTab('w',${id})">🔫 Armas</button><button class="${t==='o'?'on':''}" onclick="tlTab('o',${id})">🛡 Atuendos</button></div><small>${ps}</small></div>
 <div class="tl-g">${t==='w'?weapons():outfits()}</div></div>`}
const oB=window.bPanel;
window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id];if(!b||b.type!=='work')return r;const pan=document.getElementById('pan');if(!pan||pan.querySelector('.tl-sec'))return r;
 const bs=[...pan.querySelectorAll('button')].filter(x=>/^(craft|outCraft)\(/.test(x.getAttribute('onclick')||''));if(!bs.length)return r;
 const anchor=bs[0];const d=document.createElement('div');d.innerHTML=section(id);anchor.parentNode.insertBefore(d.firstElementChild,anchor);
 bs.forEach(x=>x.remove());[...pan.querySelectorAll('p')].forEach(p=>{if(/^(Fabricar:|📜 Planos hallados|Atuendos \(defensa)/.test((p.textContent||'').trim()))p.remove()})}catch(e){}return r};
const st=document.createElement('style');st.textContent=`
.tl-sec{width:100%;margin:6px 0 8px;flex-basis:100%}.tl-hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}.tl-hd b{color:#f2d27a;font-size:14px}.tl-hd small{color:#b9b39c;margin-left:auto}
.tl-tabs{display:flex;gap:4px}#pan .tl-sec button{min-height:0!important;min-width:0!important;width:auto;white-space:nowrap;letter-spacing:0;box-shadow:none}#pan .tl-sec .tl-go{width:100%;white-space:normal;flex:0 0 auto!important;height:auto!important;max-height:34px;padding:5px 6px!important;margin:3px 0 0!important}.tl-tabs button{padding:4px 10px;border-radius:8px;font:800 12px system-ui;border:1px solid #6a7a4a;background:#1d2618;color:#d8dfcc}.tl-tabs button.on{background:#5a4a12;border-color:#c9a23a;color:#ffe9a8}
.tl-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:7px}
.tl-c{position:relative;display:flex;flex-direction:column;gap:3px;padding:7px;border-radius:10px;border:1.5px solid var(--rc,#555);background:linear-gradient(180deg,#1f2719,#141a10);box-shadow:inset 0 0 14px color-mix(in srgb,var(--rc,#555) 18%,transparent)}
.tl-im{height:54px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,color-mix(in srgb,var(--rc,#555) 25%,transparent),transparent 70%);border-radius:8px}.tl-im img{max-height:50px;max-width:100%;image-rendering:auto}
.tl-n{font-weight:900;font-size:12.5px;line-height:1.15}.tl-tags{display:flex;flex-wrap:wrap;gap:3px}.tl-tags span{font-size:9.5px;font-weight:800;padding:1px 5px;border-radius:5px;background:#0006;color:#cfc8a8}.tl-tags .tl-r{color:var(--rc)}
.tl-st{font-size:11.5px;font-weight:800;color:#e8e2cc}.tl-b{font-size:10px;color:#9fd38a}.tl-cost{display:flex;flex-wrap:wrap;gap:3px;margin-top:auto}.tl-cost .bp2k{font-size:11px;padding:1px 5px}
.tl-go{margin-top:3px;padding:5px 6px;border-radius:8px;font:900 12px system-ui;border:1px solid #c9a23a;background:linear-gradient(180deg,#e8b84a,#b8861e);color:#241a04}.tl-go:disabled{background:#2a2f26;border-color:#454c3e;color:#9a9c8e;font-size:11px}
.tl-own{font-size:9.5px;color:#b9b39c;text-align:center}.tl-lk{--rc:#3a3f36;opacity:.7}.tl-sil{width:46px;height:46px;border-radius:50%;background:#0a0d09;color:#556;display:flex;align-items:center;justify-content:center;font:900 22px system-ui}.tl-lk .tl-n{color:#777}`;document.head.appendChild(st);
})();
