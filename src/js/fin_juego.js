/* Fin de juego (desde el capítulo 27): Opciones → 🏆 Retos.
   - Retos de la semana: 3 objetivos que cambian cada 7 días, con recompensa al reclamar.
   - Récord de hordas: hordas superadas, mejor racha sin perder edificios.
   - Jefes: cada 5 hordas llega un jefe con la horda; al vencerla, botín especial.
   - Colección (planos, armas, atuendos) y reconquista del territorio (parcelas). */
(function(){
'use strict';
const on=()=>{try{return S.mode==='creativo'||(S.story||0)>=27}catch(e){return false}};
const F=()=>{S.fin=S.fin||{streak:0,best:0,bossN:0,ups:0,crafts:0,wk:-1,base:{},got:{}};return S.fin};
const week=()=>Math.floor(((S.day||1)-1)/7);
const POOL=[
 {k:'h',n:'Supera {n} hordas',ic:'🧟',n0:2,v:()=>S.stat.hordes},
 {k:'u',n:'Mejora {n} edificios',ic:'⬆',n0:6,v:()=>F().ups},
 {k:'e',n:'Completa {n} expediciones',ic:'🧭',n0:2,v:()=>S.stat.exps},
 {k:'k',n:'Abate {n} infectados',ic:'🎯',n0:150,v:()=>S.stat.kills},
 {k:'c',n:'Fabrica {n} armas o atuendos',ic:'⚒',n0:3,v:()=>F().crafts},
 {k:'s',n:'Supera {n} horda sin perder edificios',ic:'🛡',n0:1,v:()=>F().clean||0}];
const REW=[{alloy:15,steel:30},{concrete:40,glass:30},{rp:60,ammo:60}];
function cur(){const f=F(),w=week();if(f.wk!==w){f.wk=w;f.base={};f.got={};const sel=[];let s=w*7+3;while(sel.length<3){s=(s*31+17)%997;const i=s%POOL.length;if(!sel.includes(i))sel.push(i)}f.sel=sel;sel.forEach(i=>{f.base[POOL[i].k]=POOL[i].v()||0})}
 const sc=1+Math.min(3,Math.floor(w/4))*.5;return f.sel.map((i,j)=>{const P=POOL[i],need=Math.max(1,Math.round(P.n0*sc)),prog=Math.max(0,(P.v()||0)-(f.base[P.k]||0));return {P,need,prog:Math.min(need,prog),done:prog>=need,got:!!f.got[P.k],rew:REW[j]}})}
window.finReady=()=>{try{return on()&&cur().some(r=>r.done&&!r.got)}catch(e){return false}};
window.finClaim=k=>{const f=F(),L=cur(),r=L.find(x=>x.P.k===k);if(!r||!r.done||r.got)return;f.got[k]=1;for(const x in r.rew)S.res[x]=(S.res[x]||0)+r.rew[x];try{toast('🏆 Reto completado: '+cs(r.rew))}catch(e){}try{save()}catch(e){}finMenu()};
/* contadores */
const W=(n,fn)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){return fn.call(this,o,arguments)};try{(0,eval)(n+'=window.'+n)}catch(e){}};
W('upg',function(o,a){const b=bm[a[0]],l0=b&&b.lvl;const r=o.apply(this,a);try{if(b&&b.lvl>l0)F().ups++}catch(e){}return r});
const CR=function(o,a){const n0=(S.inv||[]).length;const r=o.apply(this,a);try{if((S.inv||[]).length>n0)F().crafts++}catch(e){}return r};W('craft',CR);W('outCraft',CR);
/* jefes cada 5 hordas */
const BK=['A','U','G','T','H','J'];
W('startHorde',function(o,a){const r=o.apply(this,a);try{if(on()&&horde&&!horde.band&&S.hordeN>0&&S.hordeN%5===0&&window.BOSS){const f=F(),k=BK[f.bossN%BK.length],side=f.bossN%4;const x=side===0?1.5:side===1?N-2:20+Math.random()*40,y=side===2?1.5:side===3?N-2:20+Math.random()*40;const z=mkZ(k,x,y,1);Z.push(z);horde._boss=k;try{toast('☠ ¡Un jefe acompaña a la horda: '+BOSS[k].n+'!')}catch(e){}}}catch(e){}return r});
W('endHorde',function(o,a){const h=horde;const r=o.apply(this,a);try{if(h&&on()){const f=F();if(!h.lostB){f.streak++;f.clean=(f.clean||0)+1}else f.streak=0;f.best=Math.max(f.best,f.streak);if(h._boss){f.bossN++;const rw={alloy:40,steel:60,concrete:60,rp:120};for(const x in rw)S.res[x]=(S.res[x]||0)+rw[x];setTimeout(()=>{try{toast('☠ Jefe abatido. Botín: '+cs(rw))}catch(e){}},1500)}}}catch(e){}return r});
/* panel */
const bar=(v,c)=>`<div class="fj-bar"><i style="width:${Math.round(Math.max(0,Math.min(1,v))*100)}%;background:${c}"></i></div>`;
window.finMenu=function(){if(!on()){try{toast('🔒 Se desbloquea al completar el capítulo 27.')}catch(e){}return}const f=F(),L=cur(),left=7-((S.day-1)%7);
 let pl=[0,0];try{const c=WP.filter(w=>w.c).map(w=>w.n).concat(Object.values(window.OUTFITS||{}).filter(o=>o.c).map(o=>o.n));pl=[c.filter(n=>!window.hasPlan||hasPlan(n)).length,c.length]}catch(e){}
 const own=new Set((S.inv||[]).map(x=>x.n).concat(S.ppl.map(p=>p.wp&&p.wp.n).filter(Boolean)));const wN=WP.length,wO=WP.filter(w=>own.has(w.n)).length;
 const par=S.parc?[S.parc.filter(Boolean).length,S.parc.length]:[0,1];const nb=5-(S.hordeN%5||5)+0;
 const h=`<div class="fj">
 <div class="fj-sec"><div class="fj-h">📅 Retos de la semana <small>cambian en ${left} día${left>1?'s':''}</small></div>
 ${L.map(r=>`<div class="fj-r ${r.got?'got':r.done?'ok':''}"><span class="fj-ic">${r.P.ic}</span><div class="fj-m"><b>${r.P.n.replace('{n}',r.need)}</b>${bar(r.prog/r.need,r.done?'#5ad08a':'#e0a124')}<small>${r.prog}/${r.need} · Recompensa: ${cs(r.rew)}</small></div>${r.got?'<span class="fj-ok">✓</span>':`<button ${r.done?'':'disabled'} onclick="finClaim('${r.P.k}')">${r.done?'Reclamar':'En curso'}</button>`}</div>`).join('')}</div>
 <div class="fj-g">
 <div class="fj-c"><div class="fj-h">🧟 Récord de hordas</div><div class="fj-big">${S.stat.hordes}</div><small>superadas</small><div class="fj-l">Racha sin perder edificios: <b>${f.streak}</b> · mejor: <b>${f.best}</b></div></div>
 <div class="fj-c"><div class="fj-h">☠ Jefes</div><div class="fj-big">${f.bossN}</div><small>abatidos</small><div class="fj-l">Próximo jefe con la horda <b>${S.hordeN-(S.hordeN%5)+5}</b> (dentro de ${5-(S.hordeN%5)} horda${5-(S.hordeN%5)>1?'s':''})</div></div>
 <div class="fj-c"><div class="fj-h">📜 Colección</div>${bar(pl[0]/Math.max(1,pl[1]),'#8be3ff')}<div class="fj-l">Planos: <b>${pl[0]}/${pl[1]}</b></div>${bar(wO/Math.max(1,wN),'#e8b84a')}<div class="fj-l">Armas distintas: <b>${wO}/${wN}</b></div></div>
 <div class="fj-c"><div class="fj-h">🗺 Reconquista</div>${bar(par[0]/par[1],'#7fc97f')}<div class="fj-l">Territorio recuperado: <b>${par[0]}/${par[1]}</b> parcelas (${Math.round(par[0]/par[1]*100)} %)</div></div>
 </div></div>`;
 show('🏆 Retos',h)};
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('finBtn'))return;const b=document.createElement('button');b.id='finBtn';b.innerHTML='<i class="ib">🏆</i>Retos';b.onclick=()=>{try{tg(0)}catch(e){}finMenu()};rl.insertBefore(b,rl.children[6]||null)}
setInterval(()=>{const b=document.getElementById('finBtn');if(on())addBtn();else if(b)b.remove()},1500);
const st=document.createElement('style');st.textContent=`.fj-sec{margin-bottom:8px}.fj-h{font-weight:900;color:#f2d27a;font-size:13.5px;margin:2px 0 5px}.fj-h small{color:#b9b39c;font-weight:600;margin-left:6px}
.fj-r{display:flex;align-items:center;gap:9px;padding:6px 9px;margin:4px 0;border-radius:10px;border:1px solid #4a5a3a;background:#182014}.fj-r.ok{border-color:#5ad08a;background:#1a2a18}.fj-r.got{opacity:.6}
.fj-ic{font-size:20px;width:26px;text-align:center}.fj-m{flex:1}.fj-m b{font-size:13px}.fj-m small{color:#b9b39c;font-size:11px}.fj-r button{flex:0 0 auto;padding:6px 10px;font-size:12px}.fj-ok{color:#5ad08a;font-size:20px;font-weight:900}
.fj-bar{height:6px;background:#0d120c;border-radius:4px;overflow:hidden;margin:3px 0}.fj-bar i{display:block;height:100%}
.fj-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:7px}.fj-c{padding:8px 10px;border-radius:10px;border:1px solid #4a5a3a;background:linear-gradient(180deg,#1f2719,#141a10)}
.fj-big{font:900 26px system-ui;color:#ffe9a8;line-height:1}.fj-c small{color:#b9b39c}.fj-l{font-size:11.5px;color:#d8dfcc;margin-top:3px}`;document.head.appendChild(st);
})();
