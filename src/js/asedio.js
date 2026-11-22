/* Asedios (segunda mitad del juego): con el ayuntamiento a nivel 12 o más, una de cada 4 hordas es un ASEDIO de 3 oleadas.
   Entre oleadas hay un respiro de 2:30 (tiempo de juego) para reparar muros y recargar; cada oleada trae un 15 % más de enemigos y con un 15 % más de vida.
   Al resistir las tres llega un botín extra y la siguiente horda tarda un día más. Estado en S.sg = {w: oleada, tot: 3, t: segundos de respiro}. */
(function(){
'use strict';
const TOT=3,REST=150,MINH=12;
const due=()=>{try{return !S.sg&&realHall()>=MINH&&(S.sinceSg|0)>=3}catch(e){return false}};
const oS=window.startHorde;
window.startHorde=function(name,over){
 if(!name&&!over&&due()){S.sg={w:1,tot:TOT,t:0};name='Asedio · oleada 1 de '+TOT}
 const r=oS.call(this,name,over);
 try{if(S.sg&&horde){const w=S.sg.w,k=1+.15*(w-1);if(w>1){const act=Z.filter(z=>z.act);act.forEach(z=>{z.hp*=k;z.mhp*=k});const extra=Math.floor(act.length*.15*(w-1));
   for(let i=0;i<extra&&act.length;i++){const s=act[Math.floor(Math.random()*act.length)],z=mkZ(s.t,Math.max(.5,Math.min(N-.5,s.x+(Math.random()-.5)*2)),Math.max(.5,Math.min(N-.5,s.y+(Math.random()-.5)*2)),1);z.hp*=k;z.mhp*=k;Z.push(z)}}
  toast('⚔ ASEDIO · oleada '+w+' de '+S.sg.tot+(w>1?' (más fuerte)':'')+'.')}}catch(e){}
 return r};
try{startHorde=window.startHorde}catch(e){}
const oE=window.endHorde;
window.endHorde=function(){const sg=S.sg;const r=oE.apply(this,arguments);
 try{if(!sg){S.sinceSg=(S.sinceSg|0)+1;return r}
  if(sg.w<sg.tot){sg.t=REST;toast('Oleada '+sg.w+' de '+sg.tot+' resistida. La siguiente llega en 2:30: repara los muros y recarga munición.')}
  else{const k=S.hordeN,b={metal:60+k*10,ammo:30+k*5,steel:6+Math.floor(k/4),concrete:4+Math.floor(k/5)};for(const q in b)S.res[q]=(S.res[q]||0)+b[q];
   S.sg=null;S.sinceSg=0;S.nextH=Math.max(S.nextH||0,S.day+4);S.stat.sieges=(S.stat.sieges||0)+1;
   toast('🏆 ¡Asedio resistido! Botín extra: '+Object.keys(b).map(q=>b[q]+' '+((RK.find(x=>x[0]===q)||[0,q])[1]).toLowerCase()).join(', ')+'. La próxima horda tardará más.');try{save()}catch(e){}}}catch(e){}
 return r};
try{endHorde=window.endHorde}catch(e){}
/* estimación de la próxima horda: avisa de que será un asedio */
const oEst=window.hordeEst;if(typeof oEst==='function'){window.hordeEst=function(){const e=oEst.apply(this,arguments);try{if(e&&due())e.kind='ASEDIO de '+TOT+' oleadas'}catch(x){}return e};try{hordeEst=window.hordeEst}catch(e){}}
/* respiro entre oleadas (tiempo de juego) */
const oU=window.upd;let warned=-1;
window.upd=function(dt){const r=oU.apply(this,arguments);try{if(!S||!S.bld)return r;
 if(S.sg&&!horde){if(!(S.sg.t>0))S.sg.t=REST;S.sg.t-=dt;S.nextH=Math.max(S.nextH||0,S.day+1);if(S.sg.t<=0){S.sg.w++;S.sg.t=0;startHorde('Asedio · oleada '+S.sg.w+' de '+S.sg.tot)}}
 if(!horde&&due()&&S.day===(S.nextH|0)-1&&warned!==S.day){warned=S.day;toast('⚠ Los vigías avisan: mañana llega un ASEDIO de '+TOT+' oleadas. Refuerza los muros y guarda munición.')}}catch(e){}return r};
try{upd=window.upd}catch(e){}
/* chip de arriba durante el respiro: oleadas y cuenta atrás */
setInterval(()=>{try{if(!S||!S.sg||horde)return;const c=document.getElementById('hzChip');if(!c)return;const t=Math.max(0,Math.ceil(S.sg.t||0));c.className='ch hz bad';c.innerHTML='⚔ '+(S.sg.w+1)+'/'+S.sg.tot+' · '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0');c.title='Asedio: siguiente oleada en '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}catch(e){}},250);
})();
