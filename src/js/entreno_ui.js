/* Barracones: tarjeta que explica el entrenamiento del ejército (qué hace, cuánto cuesta, cuántos pueden hoy) en vez de dos botones sin explicación. */
(function(){
'use strict';
function info(){const a=S.ppl.filter(p=>p.arm),ok=a.filter(p=>p.td!==S.day&&!p.away),food=ok.reduce((s,p)=>s+10+5*p.lvl,0);
 let n=0,f=0,m=0;ok.forEach(p=>{const c=10+5*p.lvl;if(S.res.metal>=f+c&&S.res.ammo>=m+10){n++;f+=c;m+=10}});return {total:a.length,hoy:ok.length,food,ammo:ok.length*10,n,f,m}}
function card(id){const i=info(),auto=!!S.autoTrain;
 const btn=i.hoy?(i.n?`<button class="bup tr-go" onclick="trainArmy();setTimeout(()=>bPanel(${id}),50)">Entrenar a ${i.n} soldado${i.n>1?'s':''} · ${i.f} metal · ${i.m} munición</button>`:`<button class="tr-go" disabled>Falta metal o munición para entrenar</button>`):`<button class="tr-go" disabled>${i.total?'Todos han entrenado hoy':'Aún no tienes soldados'}</button>`;
 return `<div class="tr-card"><div class="tr-h">🎯 Entrenamiento del ejército</div>
 <p>Cada soldado puede entrenar <b>una vez al día</b> y gana <b>40 de experiencia</b>. Al subir de nivel gana <b>más daño, más vida máxima y más habilidad</b> (subir del nivel N al siguiente pide N×50 de experiencia).</p>
 <div class="tr-cost"><span>Coste por soldado: <b>10 metal + 5 por nivel</b> · <b>10 munición</b></span><span>Hoy pueden entrenar: <b>${i.hoy}/${i.total}</b>${i.hoy?` · total ${i.food} metal y ${i.ammo} munición`:''}</span></div>
 ${btn}
 <label class="tr-auto"><button class="cps${auto?' on':''}" onclick="toggleAutoTrain();setTimeout(()=>bPanel(${id}),50)">${auto?'✓ ':''}Entrenamiento automático</button><small>Cada amanecer entrena a quien pueda, dejando siempre 30 de metal y 20 de munición de reserva para poder alistar.</small></label></div>`}
const oB=window.bPanel;
window.bPanel=function(id){const r=oB.apply(this,arguments);try{const b=bm[id];if(!b||b.type!=='barr')return r;const pan=document.getElementById('pan');if(!pan||pan.querySelector('.tr-card'))return r;
 const bs=[...pan.querySelectorAll('button')],t=bs.find(x=>/trainArmy\(\)/.test(x.getAttribute('onclick')||'')),a=bs.find(x=>/toggleAutoTrain\(\)/.test(x.getAttribute('onclick')||''));
 if(!t)return r;const d=document.createElement('div');d.innerHTML=card(id);t.parentNode.insertBefore(d.firstElementChild,t);t.remove();if(a)a.remove()}catch(e){}return r};
const st=document.createElement('style');st.textContent=`
.tr-card{margin:8px 0;padding:9px 11px;border:1px solid #6a7a4a;border-radius:10px;background:linear-gradient(180deg,#1d2618,#141a10)}
.tr-h{font-weight:900;color:#f2d27a;font-size:14px;margin-bottom:4px}.tr-card p{margin:4px 0 6px;font-size:12.5px;color:#d8dfcc}
.tr-cost{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;color:#c9d1c0;margin-bottom:7px}
.tr-go{width:100%;margin:2px 0 7px}.tr-auto{display:flex;gap:8px;align-items:center}.tr-auto small{color:#9aa58c;font-size:11px}`;document.head.appendChild(st);
})();
