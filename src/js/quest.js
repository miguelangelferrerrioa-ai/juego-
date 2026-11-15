/* Misiones al estilo Fallout Shelter: el equipo viaja, recorre las salas en tiempo real, combate solo y vuelve.
   Tú decides la actitud (prudente/arriesgada), curas con medicinas o ordenas la retirada. */
(function(){
'use strict';
const $=i=>document.getElementById(i);
const nR=e=>e.z.evs?e.z.evs.length:3;
const tm=e=>e.team.map(byId).filter(Boolean);
const oEvent=window.exEvent,oEnd=window.exEnd;
let ov=null,shown=false,tkey='',last=performance.now(),fxT=0;
const goDur=e=>Math.min(70,20+8*(e.dist||1));
function pw(e){return Math.round((tm(e).reduce((a,p)=>a+upow(p),0)+tm(e).reduce((a,p)=>a+(p.story==='gael'?20:p.story==='ibarra'?8:0),0))*(1+(th('expl1')?.1:0)))}
function curNode(e){const q=e.q,n=nR(e);
  if(q.ph=='go')return q.t/q.dur;
  if(q.ph=='fight')return q.fs+1;
  if(q.ph=='walk')return e.step+q.t/q.dur;
  if(q.ph=='back')return q.from+(n+1-q.from)*Math.min(1,q.t/q.dur);
  return 0}
function say(e,t){(e.ql=e.ql||[]).push(t);if(e.ql.length>40)e.ql.shift()}
function startFight(e){const q=e.q;q.ph='fight';q.t=0;q.fs=e.step;q.dur=16+Math.min(10,Math.round(dgOf(e.z)/40));
  e.ev=e.z.evs?e.z.evs[e.step]:pk(EVS);say(e,'<b>Sala '+(e.step+1)+'/'+nR(e)+'.</b> '+e.ev.t)}
window.exEvent=function(){
  const e=S.exp;if(!e)return;
  if(!e.q){e.q={ph:'go',t:0,dur:goDur(e),fs:-1};e.stance=0;say(e,'El equipo sale hacia <b>'+e.z.n.replace(/^Cap\. \d+ · /,'')+'</b>.');if(e.step>0){startFight(e)}}
  else if(e.q.ph=='fight'&&e.q.fs<e.step){e.q.ph='walk';e.q.t=0;e.q.dur=4}
  show_();
};
window.exEnd=function(){
  const e=S.exp;
  if(e&&e.q&&!e.q.done&&tm(e).length){if(e.q.ph!=='back'){e.q.ph='back';e.q.t=0;e.q.from=Math.min(curNode(e)||nR(e),nR(e));e.q.dur=Math.max(10,Math.round(goDur(e)*.7));say(e,'Misión terminada: el equipo regresa al pueblo.')}return}
  hide_();return oEnd.apply(this,arguments)};
function build(){
  ov=document.createElement('div');ov.id='qst';ov.innerHTML='<div class="q-head"><b id="qt"></b><span id="qph"></span><button id="qmin">▾ Minimizar</button></div><div class="q-path" id="qpath"></div><div class="q-main"><div class="q-scene"><div class="q-team" id="qteam"></div><div class="q-vs">VS</div><div class="q-en" id="qen"></div></div><div class="q-log" id="qlog"></div></div><div class="q-ctl"><button id="qst_s"></button><button id="qmed">＋ Medicina</button><button id="qret" class="warn">⟲ Retirada</button></div>';
  document.body.appendChild(ov);
  $('qmin').onclick=()=>{shown=false;ov.style.display='none'};
  $('qst_s').onclick=()=>{const e=S.exp;if(!e)return;e.stance=e.stance?0:1;render(true)};
  $('qmed').onclick=()=>{const e=S.exp;if(!e)return;if(S.res.meds<2)return toast('Hacen falta 2 medicinas.');S.res.meds-=2;tm(e).forEach(p=>{p.hp=Math.min(mhp(p),p.hp+25);p.injury=Math.max(0,(p.injury||0)-10)});say(e,'Se usan medicinas: el equipo recupera salud.');render(true)};
  $('qret').onclick=()=>{const e=S.exp;if(!e||!e.q||e.q.ph=='back')return;e.q.from=curNode(e);e.q.ph='back';e.q.t=0;e.q.dur=Math.max(8,Math.round(goDur(e)*.5));say(e,'<b>Retirada ordenada.</b> El equipo vuelve con lo que lleva.');render(true)};
}
function show_(){if(!ov)build();shown=true;ov.style.display='flex';render(true)}
function hide_(){shown=false;if(ov)ov.style.display='none'}
function float(host,txt,col){const d=document.createElement('div');d.className='q-fl';d.textContent=txt;d.style.color=col;d.style.left=(20+Math.random()*60)+'%';host.appendChild(d);setTimeout(()=>d.remove(),1100)}
function render(force){
  const e=S.exp;if(!ov||!shown||!e||!e.q)return;const q=e.q,n=nR(e),T=tm(e);
  $('qt').textContent=e.z.n;
  const ph={go:'Viajando',fight:'Combate · sala '+(q.fs+1)+'/'+n,walk:'Avanzando',back:'Regresando'}[q.ph];
  $('qph').textContent=ph+' · '+Math.max(0,Math.ceil(q.dur-q.t))+' s';
  // camino
  const pc=$('qpath');if(force||!pc.firstChild){let h='<div class="q-line"></div>';for(let i=0;i<n+2;i++){const x=4+92*i/(n+1);h+='<div class="q-node '+(i==0||i==n+1?'home':'')+' '+(i>0&&i<=n&&i<=e.step?'done':'')+'" style="left:'+x+'%">'+(i==0||i==n+1?'🏠':i)+'</div>'}h+='<div class="q-mk" id="qmk">▶</div>';pc.innerHTML=h}
  else pc.querySelectorAll('.q-node').forEach((nd,i)=>{nd.classList.toggle('done',i>0&&i<=n&&i<=e.step&&!(q.ph=='fight'&&i==e.step+1))});
  const cn=curNode(e),mk=$('qmk');if(mk)mk.style.left=(4+92*cn/(n+1))+'%';
  // equipo
  const key=T.map(p=>p.id).join(',');if(key!==tkey||force){tkey=key;$('qteam').innerHTML=T.map(p=>'<div class="q-pc" data-id="'+p.id+'"><b>'+p.n.split(' ')[0]+'</b><small>'+(p.arm?CL[p.arm].n:p.prof)+'</small><div class="q-bar"><i></i></div></div>').join('')}
  T.forEach(p=>{const b=$('qteam').querySelector('[data-id="'+p.id+'"] i');if(b){const f=Math.max(0,Math.min(1,p.hp/mhp(p)));b.style.width=(f*100)+'%';b.style.background=f<.35?'#d8493a':f<.7?'#e0a124':'#8dbb69'}});
  // enemigos
  const dg=dgOf(e.z),need=dg*(e.stance?1:(T.some(p=>p.story==='lia')?.4:.6)),ok=pw(e)>=need,cnt=Math.max(2,Math.min(6,Math.round(dg/22)));
  let hpE=1;if(q.ph=='fight'){const f=q.t/q.dur;hpE=ok?1-f:Math.max(.35,1-f*.65)}else if(q.ph=='go'||q.ph=='walk')hpE=1;else hpE=0;
  const en=$('qen');if(q.ph=='back'){en.innerHTML='<div class="q-home">Camino de vuelta…</div>'}
  else{const shown_=Math.ceil(cnt*hpE);en.innerHTML=(q.ph=='go'||q.ph=='walk'?'<div class="q-home">'+(q.ph=='go'?'Hacia la zona…':'Siguiente sala…')+'</div>':'<div class="q-eg">'+'🧟'.repeat(Math.max(0,shown_))+'</div><div class="q-bar e"><i style="width:'+(hpE*100)+'%"></i></div><small>Poder '+pw(e)+' / peligro '+Math.round(need)+(ok?' · ventaja':' · en desventaja')+'</small>')}
  // log
  const lg=$('qlog');const L=(e.ql||[]).slice(-7).concat([]);const lg2=(e.log||[]).slice(-3).map(x=>'<span class="q-r">'+x+'</span>');lg.innerHTML=L.map(x=>'<p>'+x+'</p>').join('')+lg2.map(x=>'<p>'+x+'</p>').join('');lg.scrollTop=1e5;
  $('qst_s').textContent='Actitud: '+(e.stance?'ARRIESGADA (más botín, más riesgo)':'PRUDENTE (seguro, menos botín)');
  $('qmed').disabled=S.res.meds<2;$('qret').disabled=q.ph=='back';
}
function tick(){
  const now=performance.now(),dt=Math.min(1,(now-last)/1000);last=now;
  try{
    const e=S&&S.exp;if(!e)return;
    if(typeof titleOpen==='function'&&titleOpen())return;
    if(!e.q){window.exEvent();return}
    const q=e.q;q.t+=dt;
    if(q.t>=q.dur){
      if(q.ph=='go'||q.ph=='walk'){startFight(e);render(true)}
      else if(q.ph=='fight'){exChoose(e.stance?1:0);return}
      else if(q.ph=='back'){q.done=1;hide_();exEnd();return}
    }
    fxT+=dt;if(shown&&fxT>.8&&q.ph=='fight'){fxT=0;const en=$('qen'),tmh=$('qteam');float(en,'-'+(8+Math.floor(Math.random()*14)),'#ffd877');if(Math.random()<.5)float(tmh,'-'+(1+Math.floor(Math.random()*5)),'#ff7b6b')}
    render(false);
  }catch(er){console.error(er)}
}
setInterval(tick,250);
document.addEventListener('visibilitychange',()=>{last=performance.now()});
})();
