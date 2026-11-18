/* Diario del pueblo (Opciones → 📜 Diario): lo importante de la partida, día a día, y gráficas.
   Sucesos: nacimientos, llegadas, muertes (con nombre y causa), hordas, capítulos, ayuntamiento, logros y cambios de estación.
   Gráficas: población, soldados, edificios y comida guardados cada amanecer. Empieza a registrar desde que se instala. */
(function(){
'use strict';
const D=()=>{S.diario=S.diario||{ev:[],hist:[],d0:S.day};return S.diario};
function add(ic,t,k){const d=D();d.ev.push({d:S.day,ic,t,k:k||''});if(d.ev.length>500)d.ev.splice(0,d.ev.length-500)}
window.diarioAdd=add;
/* muertes */
const oDie=window.die;if(typeof oDie==='function'){window.die=function(p,w){const was=p&&S.ppl.includes(p);const r=oDie.apply(this,arguments);try{if(was&&!S.ppl.includes(p))add('✝',p.n+' murió'+(w?' '+String(w).replace(/^\(|\)$/g,''):'')+'.','muerte')}catch(e){}return r};try{die=window.die}catch(e){}}
/* hordas */
const oEnd=window.endHorde;if(typeof oEnd==='function'){window.endHorde=function(){const h=horde;const r=oEnd.apply(this,arguments);try{if(h)add('🧟','Horda superada: '+(h.name||'horda')+(h.lostB?' · '+h.lostB+' edificios perdidos':' sin perder edificios')+'.','horda')}catch(e){}return r};try{endHorde=window.endHorde}catch(e){}}
/* vigilante: nacimientos, llegadas, capítulos, ayuntamiento, logros, amanecer */
let W=null;
function watch(){if(!S||!S.ppl||!S.bld)return;const d=D();
 if(!W||W.S!==S){W={S,ids:new Set(S.ppl.map(p=>p.id)),story:S.story||0,hall:hallLv(),lg:Object.keys((S.logros&&S.logros.got)||{}).length,day:S.day};if(!d.hist.length)snap();return}
 const now=new Set(S.ppl.map(p=>p.id));S.ppl.forEach(p=>{if(W.ids.has(p.id))return;if(p.bd2||p.age<1)add('👶','Nace '+p.n+'.','vida');else add('🚶',p.n+' se une al pueblo.','vida')});W.ids=now;
 const st=S.story||0;if(st>W.story){for(let i=W.story;i<st;i++){const c=STORY[i];add('📖','Capítulo completado: '+(c?c.n:(i+1))+'.','historia')}W.story=st}
 const hl=hallLv();if(hl>W.hall){add('🏛','El ayuntamiento sube a nivel '+hl+'.','pueblo');W.hall=hl}else if(hl<W.hall)W.hall=hl;
 const lg=Object.keys((S.logros&&S.logros.got)||{}).length;if(lg>W.lg){add('🏅','Nuevo logro conseguido ('+lg+').','pueblo');W.lg=lg}
 if(S.day!==W.day){W.day=S.day;snap()}}
function snap(){const d=D();const h={d:S.day,pop:S.ppl.length,sol:S.ppl.filter(p=>p.arm).length,bld:S.bld.filter(b=>b.type!=='road'&&b.type!=='wall'&&!(BT[b.type]&&BT[b.type].deco)).length,food:Math.round(S.res.food||0)};const L=d.hist;if(L.length&&L[L.length-1].d===h.d)L[L.length-1]=h;else L.push(h);if(L.length>400)L.splice(0,L.length-400)}
setInterval(()=>{try{watch()}catch(e){}},1000);
/* panel */
window.dTab=window.dTab||'ev';
function chart(id,key,col,lab){return `<div class="dj-ch"><div class="dj-cl"><b style="color:${col}">${lab}</b><small id="${id}v"></small></div><canvas id="${id}" data-k="${key}" data-c="${col}" width="1000" height="130"></canvas></div>`}
function drawCharts(){const H=D().hist;document.querySelectorAll('#pan canvas[data-k]').forEach(cv=>{const x=cv.getContext('2d'),k=cv.dataset.k,col=cv.dataset.c,W=cv.width,Hh=cv.height;x.clearRect(0,0,W,Hh);
 if(H.length<2){x.fillStyle='#9a9c8e';x.font='14px system-ui';x.fillText('Aún no hay datos: se apunta uno cada amanecer.',12,Hh/2);return}
 const v=H.map(h=>h[k]||0),mx=Math.max(1,...v),mn=Math.min(...v,0),sx=i=>8+i*(W-16)/(H.length-1),sy=y=>Hh-10-(y-mn)/(mx-mn||1)*(Hh-24);
 x.strokeStyle='rgba(255,255,255,.08)';for(let g=0;g<4;g++){const y=10+g*(Hh-20)/3;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}
 x.beginPath();v.forEach((y,i)=>i?x.lineTo(sx(i),sy(y)):x.moveTo(sx(i),sy(y)));x.lineTo(sx(v.length-1),Hh-10);x.lineTo(sx(0),Hh-10);x.closePath();x.fillStyle=col+'33';x.fill();
 x.beginPath();v.forEach((y,i)=>i?x.lineTo(sx(i),sy(y)):x.moveTo(sx(i),sy(y)));x.strokeStyle=col;x.lineWidth=2.5;x.stroke();
 x.fillStyle='#cfc8a8';x.font='12px system-ui';x.fillText('día '+H[0].d,6,Hh-1);const t='día '+H[H.length-1].d;x.fillText(t,W-x.measureText(t).width-6,Hh-1);
 const lb=document.getElementById(cv.id+'v');if(lb)lb.textContent=' · ahora '+v[v.length-1].toLocaleString('es')+' · máximo '+mx.toLocaleString('es')})}
const FIL={'':'Todo',vida:'Vida',muerte:'Muertes',horda:'Hordas',historia:'Historia',pueblo:'Pueblo'};
window.dFil=window.dFil||'';
window.diarioMenu=function(){const d=D(),tab=window.dTab;let h=`<div class="prow ptabs"><button class="${tab==='ev'?'primary':''}" onclick="dTab='ev';diarioMenu()">📜 Sucesos</button><button class="${tab==='gr'?'primary':''}" onclick="dTab='gr';diarioMenu()">📈 Gráficas</button></div>`;
 if(tab==='gr'){h+=`<p class="bsub">Un dato cada amanecer desde el día ${d.hist.length?d.hist[0].d:S.day}.</p>`+chart('djP','pop','#7fc97f','👥 Población')+chart('djS','sol','#6fa8dc','🪖 Soldados')+chart('djB','bld','#e8b84a','🏗 Edificios')+chart('djF','food','#e0704a','🌾 Comida guardada')}
 else{const f=window.dFil,L=d.ev.filter(e=>!f||e.k===f).slice().reverse();h+=`<div class="dj-f">${Object.keys(FIL).map(k=>`<button class="${f===k?'on':''}" onclick="dFil='${k}';diarioMenu()">${FIL[k]}</button>`).join('')}</div>`;
  if(!L.length)h+=`<p class="bsub">El diario empezó el día ${d.d0}. Aquí se irán apuntando nacimientos, llegadas, muertes, hordas, capítulos y logros.</p>`;
  let last=null;h+='<div class="dj-l">'+L.slice(0,200).map(e=>{const hd=e.d!==last?`<div class="dj-d">Día ${e.d}</div>`:'';last=e.d;return hd+`<div class="dj-e ${e.k}"><span>${e.ic}</span>${e.t.replace(/[<>&]/g,'')}</div>`}).join('')+'</div>'}
 show('📜 Diario del pueblo',h);if(tab==='gr')setTimeout(drawCharts,30)};
function addBtn(){const rl=document.getElementById('rl');if(!rl||document.getElementById('djBtn'))return;const b=document.createElement('button');b.id='djBtn';b.innerHTML='<i class="ib">📜</i>Diario';b.onclick=()=>{try{tg(0)}catch(e){}diarioMenu()};rl.insertBefore(b,rl.children[6]||null)}
setTimeout(addBtn,1500);setTimeout(addBtn,4000);
const st=document.createElement('style');st.textContent=`.dj-f{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 6px}#pan .dj-f button{min-height:0;padding:3px 9px;font-size:11px;border-radius:12px;border:1px solid #6a7a4a;background:#1d2618;color:#d8dfcc}#pan .dj-f button.on{background:#5a4a12;border-color:#c9a23a;color:#ffe9a8}
.dj-d{margin:8px 0 3px;font-weight:900;color:#f2d27a;font-size:12px;border-bottom:1px solid #3a4434;padding-bottom:2px}.dj-e{display:flex;gap:8px;align-items:flex-start;padding:3px 4px;font-size:12.5px;color:#e0dccb}.dj-e span{width:20px;text-align:center}.dj-e.muerte{color:#e8a49a}
.dj-ch{margin:6px 0;padding:6px 8px;border-radius:9px;border:1px solid #3a4434;background:#141a10}.dj-cl{font-size:12.5px;margin-bottom:2px}.dj-cl small{color:#b9b39c}.dj-ch canvas{width:100%;height:auto;display:block}`;document.head.appendChild(st);
})();
