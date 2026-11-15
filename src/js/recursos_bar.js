/* ===== Pestaña de recursos: el botón 📦 de la barra de arriba fija una columna a la derecha con todos los materiales y su producción por minuto ===== */
(function(){
'use strict';
const css=`#rbTog{cursor:pointer;border-radius:4px;padding:3px 10px;background:linear-gradient(180deg,#3a464b,#252e32);color:var(--amb2,#ffd877);text-transform:uppercase;font-size:11.5px;letter-spacing:.8px;font-weight:700;box-shadow:inset 0 0 0 1px #8795996a,0 1px 0 #000;display:flex;align-items:center;gap:4px;border:0;font-family:inherit}
#rbTog.on{background:linear-gradient(180deg,#ffd877,#e0a124);color:#1b1203}
#rbCol{position:absolute;top:54px;right:6px;width:112px;max-height:calc(100% - 122px);overflow-y:auto;z-index:3;display:none;grid-template-columns:1fr;gap:2px;padding:3px;background:#0e1416c4;border:1px solid #e0a12466;border-radius:6px;box-shadow:0 4px 12px #0008;cursor:pointer;scrollbar-width:none}
#rbCol::-webkit-scrollbar{display:none}
#rbCol.open{display:grid}#rbCol.c2{width:206px;grid-template-columns:1fr 1fr}#rbCol .t,#rbCol .lk{grid-column:1/-1}
#rbCol .r{display:flex;align-items:center;gap:4px;padding:1px 4px;background:#1b2427e6;border:1px solid #2d3a3f;border-radius:4px;height:18px;min-width:0}#rbCol .r.m{background:#1f2522e6;border-color:#3a3f2f}
#rbCol .r img{width:14px;height:14px;flex:none}
#rbCol .r b{color:#f0e6cc;font-size:10.5px;min-width:20px}
#rbCol .r b.full{color:#ffd877}
#rbCol .r small{font-size:9px;margin-left:auto;white-space:nowrap}
#rbCol .up{color:#7ddc6a}#rbCol .dn{color:#ff7b6b}
#rbCol .lk{display:flex;flex-wrap:wrap;gap:3px;padding:3px 4px;background:#151c1fe6;border:1px dashed #3a474c;border-radius:4px}
#rbCol .lk img{width:14px;height:14px}
#rbCol .t{font-size:8.5px;letter-spacing:.8px;text-transform:uppercase;color:#e0a124;margin:2px 2px 0}`;
try{const st=document.createElement('style');st.textContent=css;document.head.appendChild(st)}catch(e){}
let open=false;try{open=localStorage.getItem('ats_rescol')==='1'}catch(e){}
const col=document.createElement('div');col.id='rbCol';col.title='Toca para abrir el almacén';
col.onclick=()=>{try{storeTab='res';storeMenu()}catch(e){}};
const boot=()=>{const t=document.getElementById('top');(t&&t.parentNode||document.body).appendChild(col)};
if(document.body)boot();else addEventListener('DOMContentLoaded',boot);
const BASE=['food','water','wood','metal','meds','ammo'];
const seen=k=>{try{return (S.res[k]||0)>0||(S.rseen&&S.rseen[k])||BASE.includes(k)}catch(e){return false}};
const lockd=k=>!!(window.resLocked&&resLocked(k));
const ico=k=>(typeof ICO!=='undefined'&&ICO[k])||'';
const nm=k=>(RK.find(r=>r[0]===k)||[0,k])[1];
function row(k,d,cp,m){const v=Math.floor(S.res[k]||0),pm=(d[k]||0)/10,full=cp&&v>=cp;
  const rt=Math.abs(pm)<.05?'':`<small class="${pm>0?'up':'dn'}">${pm>0?'+':''}${pm.toFixed(1).replace('.',',')}</small>`;
  return `<div class="r${m?' m':''}" title="${nm(k)}"><img src="${ico(k)}"><b class="${full?'full':''}">${v}</b>${rt}</div>`}
function live(){try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length)return false;if(typeof LIVE!=='undefined'&&!LIVE)return false;const ts=document.getElementById('titleScreen');if(ts&&ts.style.display!=='none'&&getComputedStyle(ts).display!=='none')return false;return true}catch(e){return false}}
function paint(){const show=open&&live();col.classList.toggle('open',show);if(!show)return;try{
  const d=rate(),cp=typeof cap==='function'?cap():0,mk=window.MATK||[];
  const all=RK.map(r=>r[0]).filter(k=>k!=='elec'&&k!=='rp'||(k==='rp'&&window.rpOn&&rpOn()));
  const on=all.filter(k=>!lockd(k)&&(seen(k)||(window.RES_LV&&RES_LV[k]))),lk=all.filter(k=>lockd(k));
  const base=on.filter(k=>!mk.includes(k)),mat=on.filter(k=>mk.includes(k));
  col.classList.toggle('c2',base.length+mat.length>8);
  let h=base.map(k=>row(k,d,k==='rp'?0:cp)).join('')+mat.map(k=>row(k,d,cp,1)).join('');
  if(lk.length)h+='<div class="lk" title="Bloqueados">'+lk.map(k=>`<img src="${ico(k)}" style="${resLockImg}" title="??? · ayuntamiento nivel ${RES_LV[k]}">`).join('')+'</div>';
  col.innerHTML=h}catch(e){}}
function label(){const b=document.getElementById('rbTog');if(b){b.classList.toggle('on',open);b.innerHTML='📦 Recursos '+(open?'▴':'▾')}}
window.rbToggle=function(){open=!open;try{localStorage.setItem('ats_rescol',open?'1':'0')}catch(e){}label();paint()};
setInterval(paint,1000);
/* el botón vive dentro de la barra de arriba, que se redibuja sola: se vuelve a poner si desaparece */
function ensureBtn(){const t=document.getElementById('top');if(!t||document.getElementById('rbTog'))return;
  const b=document.createElement('button');b.id='rbTog';b.className='ch';
  b.onclick=e=>{e.stopPropagation();rbToggle()};t.appendChild(b);label()}
setInterval(()=>{ensureBtn();const s=open&&live();if(col.classList.contains('open')!==s)paint()},400);
try{new MutationObserver(ensureBtn).observe(document.getElementById('top')||document.body,{childList:true})}catch(e){}
})();
