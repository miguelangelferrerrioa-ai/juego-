/* ===== Clima extremo (segunda mitad: ayuntamiento nivel 10+) =====
   Una vez por invierno llega una VENTISCA (1 día): la calefacción quema madera (4 por persona y día) y los trabajos
   al aire libre producen la mitad. Sin madera, la gente pasa frío y enferma de gripe.
   Una vez por verano llega una OLA DE CALOR (1,5 días): se bebe el triple de agua y las granjas producen un 30 % menos.
   Sin agua, la gente tiene sed y enferma de fiebre.
   Se avisa un día antes. Se ve en la ficha de la estación (arriba). Estado: S.xw={k:'v'|'c',t:segundos}, S.xwP={id,day}. */
(function(){
'use strict';
const MINH=10,LEN=30,DAY=600;
const K={v:{ic:'❄',n:'Ventisca',dur:DAY,sea:3,ill:'Gripe',d:'la calefacción quema madera y granjas, aserraderos, canteras, desguaces, muelles y placas solares rinden la mitad'},
 c:{ic:'🔥',n:'Ola de calor',dur:DAY*1.5,sea:1,ill:'Fiebre',d:'se bebe el triple de agua y las granjas rinden un 30 % menos'}};
const OUT=new Set(['farm','saw','scrapy','quarry','dock','solar']);
const on=()=>{try{return S&&S.bld&&S.bld.length&&S.mode!=='creativo'&&realHall()>=MINH}catch(e){return false}};
const cur=()=>{try{return S.xw&&S.xw.t>0?S.xw:null}catch(e){return null}};
const heatW=()=>{try{return S.ppl.length*4}catch(e){return 0}};
const extraWater=()=>{try{return S.ppl.length*2*(typeof EAT==='number'?EAT:2.5)}catch(e){return 0}};
const msg=(ic,t,x)=>{try{toast(ic+' '+t+(x?': '+x:''))}catch(e){}try{notify(ic,t,x||'','pueblo')}catch(e){}try{window.diarioAdd&&diarioAdd(ic,t+(x?'. '+x:''),'pueblo')}catch(e){}};
/* plan: un día al azar de cada invierno y cada verano */
function plan(){const id=Math.floor(((S.day||1)-1)/LEN),s=id%4;if(s!==1&&s!==3)return null;if(!S.xwP||S.xwP.id!==id){const st=id*LEN+1;S.xwP={id,day:st+6+Math.floor(Math.random()*14),k:s===3?'v':'c',w:0,done:0}}return S.xwP}
function start(k){const d=K[k];S.xw={k,t:d.dur};S.xwSeen=S.xwSeen||{};S.xwSeen[k]=1;S.stat=S.stat||{};S.stat.xw=(S.stat.xw||0)+1;
 msg(d.ic,d.n.toUpperCase(),d.d.charAt(0).toUpperCase()+d.d.slice(1)+'.')}
function end(){const k=S.xw.k,d=K[k];S.xw=null;msg(d.ic,'Fin de la '+d.n.toLowerCase(),'El tiempo vuelve a la normalidad.')}
/* producción */
const oOut=window.out;if(typeof oOut==='function'){window.out=function(b){const o=oOut.apply(this,arguments);try{const x=cur();if(!o||!x)return o;
  if(x.k==='v'&&OUT.has(b.type))for(const r in o)if(o[r]>0)o[r]*=.5;if(x.k==='c'&&b.type==='farm'&&o.food>0)o.food*=.7}catch(e){}return o};try{out=window.out}catch(e){}}
const oRate=window.rate;if(typeof oRate==='function'){window.rate=function(){const d=oRate.apply(this,arguments);try{const x=cur();if(x&&d){if(x.k==='v')d.wood-=heatW();else d.water-=extraWater()}}catch(e){}return d};try{rate=window.rate}catch(e){}}
/* tiempo */
let lastDay=-1;
const oU=window.upd;window.upd=function(dt){const r=oU.apply(this,arguments);try{if(!on()){if(S&&S.xw)S.xw=null;return r}
  const x=cur();
  if(x){x.t-=dt;const R=S.res;
   if(x.k==='v'){const need=heatW()*dt/DAY;if(R.wood>=need){R.wood-=need;x.cold=0}else{R.wood=0;x.cold=1}}
   else{const need=extraWater()*dt/DAY;if(R.water>=need){R.water-=need;x.dry=0}else{R.water=0;x.dry=1}}
   if(x.cold||x.dry){const pr=.3*dt/DAY;S.ppl.forEach(p=>{if(p.away||p.illness)return;if(x.dry)p.thirst=Math.max(0,(p.thirst??100)-12*dt/DAY);if(Math.random()<pr){p.illness=K[x.k].ill;p.illD=0}});
    x.wt=(x.wt||0)-dt;if(x.wt<=0){x.wt=150;try{toast(x.cold?'❄ No queda madera para la calefacción: la gente pasa frío y enferma.':'🔥 No queda agua: la gente tiene sed y enferma.')}catch(e){}}}
   if(x.t<=0)end()}
  else if(S.day!==lastDay){lastDay=S.day;const P=plan();if(P&&!P.done){
   if(!P.w&&S.day===P.day-1){P.w=1;const d=K[P.k];msg(d.ic,'Mañana llega una '+d.n.toLowerCase(),P.k==='v'?'Guarda madera: la calefacción gastará unas '+Math.round(heatW())+' en el día.':'Guarda agua: se beberá unas '+Math.round(extraWater()*1.5)+' de más.')}
   if(S.day>=P.day){P.done=1;start(P.k)}}}}catch(e){}return r};
try{upd=window.upd}catch(e){}
/* ficha de la estación: muestra el clima extremo y la cuenta atrás */
const oSI=window.seasonInfo;window.seasonInfo=function(){const i=oSI.apply(this,arguments);try{const x=cur();if(x){const d=K[x.k],t=Math.max(0,Math.ceil(x.t));return [i[0],d.ic,d.n+' · '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0'),d.d.charAt(0).toUpperCase()+d.d.slice(1)+'.'+(x.cold?' ¡Falta madera!':x.dry?' ¡Falta agua!':'')]}
  const P=S.xwP;if(on()&&P&&P.w&&!P.done){const d=K[P.k];return [i[0],d.ic,d.n+' mañana',i[3]]}}catch(e){}return i};
setInterval(()=>{try{const c=document.getElementById('snChip');if(!c)return;const x=cur();if(x){const i=seasonInfo();c.textContent=i[1]+' '+i[2];c.style.borderColor=x.k==='v'?'#9ac8ff':'#ff9a40';c.style.color=(x.cold||x.dry)?'#ffb0a0':''}else{c.style.borderColor='';c.style.color=''}}catch(e){}},500);
/* aspecto */
const oR=window.render;
window.render=function(){const r=oR.apply(this,arguments);try{const x=cur();if(!x)return r;const cv=document.getElementById('c'),c=cv.getContext('2d'),W=cv.width,H=cv.height,t=T,k=W/900;c.save();c.setTransform(1,0,0,1,0,0);
  const a=Math.min(1,(K[x.k].dur-x.t)/8,x.t/8);
  if(x.k==='v'){c.fillStyle='rgba(225,235,250,'+(.3*a)+')';c.fillRect(0,0,W,H);
   c.strokeStyle='rgba(255,255,255,'+(.75*a)+')';c.lineCap='round';c.lineWidth=2.2*k;c.beginPath();for(let i=0;i<130;i++){const sp=180+i%7*40,x0=((i*137.7+t*sp)%(W+200))-100,y0=((i*91.3+t*sp*.45)%(H+80))-40;c.moveTo(x0,y0);c.lineTo(x0-14*k,y0-6*k)}c.stroke();
   c.fillStyle='rgba(255,255,255,'+(.12*a)+')';for(let i=0;i<4;i++){const y0=((i*233+t*60)%(H+300))-150;c.fillRect(0,y0,W,60*k)}}
  else{c.fillStyle='rgba(255,150,60,'+(.12*a)+')';c.fillRect(0,0,W,H);
   c.strokeStyle='rgba(255,230,190,'+(.07*a)+')';c.lineWidth=3*k;c.beginPath();for(let i=0;i<14;i++){const y0=((i*67+t*20)%(H+40))-20;c.moveTo(0,y0);for(let x0=0;x0<=W;x0+=40*k)c.lineTo(x0,y0+Math.sin(x0/(30*k)+t*3+i)*3*k)}c.stroke()}
  c.restore()}catch(e){}return r};
try{render=window.render}catch(e){}
window.xwNow=cur;
})();
