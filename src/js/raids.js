/* ===================================================================
   Merodeadores: zombis sueltos y mini grupos desde el día 3 (modo normal)
   + Localizar superviviente (la cámara va hasta él, como en Fallout Shelter)
   =================================================================== */
(function(){
'use strict';
const $=i=>document.getElementById(i);
const CFG={facil:{d:5,sz:.7,a:560,b:880},normal:{d:3,sz:1,a:400,b:640},dificil:{d:2,sz:1.3,a:150,b:260},apocaliptico:{d:2,sz:1.8,a:100,b:200}};
const SIDES=[['norte',0],['este',1],['sur',2],['oeste',3]];
let last=0;
function pickSize(cfg){
  const d=S.day-cfg.d;                     // días desde que empiezan
  let n=1;
  if(d>=3&&Math.random()<.45)n=2;
  if(d>=6&&Math.random()<.5)n=2+Math.floor(Math.random()*2);
  if(d>=12&&Math.random()<.5)n=3+Math.floor(Math.random()*3);
  if(d>=20&&Math.random()<.5)n=4+Math.floor(Math.random()*4);
  return Math.max(1,Math.round(n*cfg.sz*(window.raidSz?window.raidSz():1)));
}
function spawnRaid(){
  const cfg=CFG[S.mode]||CFG.normal,n=pickSize(cfg),side=SIDES[Math.floor(Math.random()*4)];
  const comp={z:n};
  if(S.day>=cfg.d+4&&n>=2&&Math.random()<.5){comp.r=1;comp.z=n-1}
  if(S.day>=cfg.d+9&&n>=3&&Math.random()<.4){comp.f=1;comp.z=Math.max(0,comp.z-1)}
  if(S.day>=cfg.d+14&&n>=4&&Math.random()<.4){comp.s=1;comp.z=Math.max(0,comp.z-1)}
  const along=Math.random()*(N-16)+8;let sx,sy;
  if(side[1]===0){sx=along;sy=1.5}else if(side[1]===1){sx=N-2.5;sy=along}else if(side[1]===2){sx=along;sy=N-2.5}else{sx=1.5;sy=along}
  let k=0;for(const t in comp)for(let i=0;i<comp[t];i++){const z=mkZ(t,cl(sx+rn(-2,2),.5,N-.5),cl(sy+rn(-2,2),.5,N-.5),1);z.raid=1;Z.push(z);k++}
  // defensores: los soldados enrolados salen a recibirlos
  if(!U.length){const h=S.bld.find(b=>b.type=='hall')||{x:26,y:26};S.ppl.filter(p=>p.arm&&!p.away&&p.hp>25&&!p.preg&&p.age>=18).forEach((p,i)=>U.push({p,x:h.x+1+i%4,y:h.y+5+(i>>2),hp:p.hp,cd:0}))}
  window.raidOn={n:k,t:0,side:side[0]};
  toast(k===1?'Un zombi solitario se acerca por el '+side[0]+'.':'Un grupo de '+k+' infectados merodea por el '+side[0]+' y se dirige al pueblo.');
  try{sfxAt('zombie',sx,sy,{rate:.8,v:.9})}catch(e){}
}
function endRaid(){
  const r=window.raidOn;window.raidOn=null;
  U.forEach(u=>{u.p.hp=Math.max(1,u.hp);u.p.xp+=6});U.forEach(u=>lvlUp(u.p));U=[];
  const f=2+Math.floor(Math.random()*5),m=1+Math.floor(Math.random()*4);S.res.food=Math.min(cap(),S.res.food+f);S.res.metal=Math.min(cap(),S.res.metal+m);
  toast('Amenaza neutralizada. Botín del camino: '+f+' comida, '+m+' metal.');
  S.nextRaid=S.day*1000+0;S.raidT=null;
}
function tick(){
  if(typeof S==='undefined'||!S||S.over||typeof fading!=='undefined'&&fading)return;
  const cfg=CFG[S.mode];if(!cfg)return;                       // creativo: sin merodeadores
  if(S.dayT===last){return}
  const dt=Math.max(0,Math.min(5,S.dayT-last));last=S.dayT;
  const live=Z.some(z=>z.act);
  if(window.raidOn){
    window.raidOn.t+=dt;
    if(!horde&&!live)endRaid();
    return;
  }
  if(horde||live||S.day<cfg.d||S.exp&&false)return;
  if(S.raidT==null)S.raidT=cfg.a*.5+Math.random()*(cfg.b-cfg.a*.5);
  S.raidT-=dt*(window.raidMul?window.raidMul():1);
  if(S.raidT<=0){
    // no solapar con una horda inminente en las próximas horas del día
    if(S.day>=S.nextH&&S.dayT>420){S.raidT=60;return}
    S.raidT=cfg.a+Math.random()*(cfg.b-cfg.a);
    spawnRaid();
  }
}
window._raid={spawn:spawnRaid,end:endRaid};
setInterval(tick,500);

/* ------------------------ LOCALIZAR ------------------------ */
const mark=document.createElement('div');mark.id='locmark';mark.innerHTML='<div class="lm-ring"></div><div class="lm-tag"><b></b><span></span></div>';document.body.appendChild(mark);
const mTag=mark.querySelector('.lm-tag b'),mAct=mark.querySelector('.lm-tag span');
let loc=null;
function activity(p){
  if(p.away)return'De expedición';
  if(U.some(u=>u.p===p))return'Combatiendo';
  if(p.inside)return'Refugiado en el ayuntamiento';
  if(p.age<18)return'Niño/a, jugando';
  if(p.preg)return'Embarazada, descansando';
  if(p.illness)return'Enfermo';
  const b=bm[p.job];if(b)return'Trabajando en '+(BT[b.type]?BT[b.type].n:'el pueblo');
  if(p.arm)return'De guardia';
  return'Sin trabajo asignado';
}
window.locate=function(id){
  const p=byId(id);if(!p)return;
  if(p.away){toast(p.n+' está de expedición.');return}
  hide();
  loc={id,t0:performance.now(),cz:cam.z};
  cam.z=Math.max(cam.z,1.25);
  mTag.textContent=p.n;mAct.textContent=activity(p);
  mark.style.display='block';
  requestAnimationFrame(follow);
};
function follow(){
  if(!loc)return;
  const p=byId(loc.id),age=(performance.now()-loc.t0)/1000;
  if(!p||p.away||age>6||horde&&age>3){loc=null;mark.style.display='none';return}
  // la cámara se desliza hasta la persona y la sigue unos segundos
  const q=P(p.x,p.y),tx=q[0]-vw()/2/cam.z,ty=q[1]-vh()/2/cam.z,k=Math.min(1,.16+age*.02);
  cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
  const sx=(q[0]-cam.x)*cam.z,sy=(q[1]-cam.y)*cam.z;
  mark.style.left=sx+'px';mark.style.top=(sy-6)+'px';
  mAct.textContent=activity(p);
  mark.style.opacity=age>5?Math.max(0,6-age):1;
  requestAnimationFrame(follow);
}
// cualquier arrastre del jugador cancela el seguimiento
document.addEventListener('pointerdown',e=>{if(loc&&e.target&&e.target.id==='c'){loc=null;mark.style.display='none'}},true);

// botón en la ficha
const _ps=window.pSheet;
window.pSheet=function(id){
  const r=_ps.apply(this,arguments);
  try{const pan=$('pan');const body=pan&&pan.querySelector('.panel-body');const p=byId(id);
    if(body&&p&&!body.querySelector('.locbtn')){const b=document.createElement('button');b.className='locbtn big';b.innerHTML='<i class="ib">◎</i>Localizar en el pueblo';b.onclick=()=>locate(id);b.style.width='100%';b.style.margin='2px 0 6px';body.insertBefore(b,body.firstChild)}}catch(e){}
  return r;
};
})();
