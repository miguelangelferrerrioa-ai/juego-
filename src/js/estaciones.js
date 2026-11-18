/* Estaciones del año: cambian cada 30 días (primavera → verano → otoño → invierno).
   Primavera: granjas +15 %. Verano: pozos y bombas +25 % de agua, granjas −10 %. Otoño: granjas +5 %, aserraderos +15 %.
   Invierno: granjas −35 % (el invernadero y el hidropónico no se ven afectados) y agua −10 %. En invierno nieva y el mapa se ve más frío.
   Se ve en la barra superior (junto al día) y avisa unos días antes de que llegue el invierno. */
(function(){
'use strict';
const SN=[['primavera','🌸','Primavera','Las granjas producen un 15 % más.'],['verano','☀','Verano','Pozos y bombas dan un 25 % más de agua; las granjas, un 10 % menos.'],['otono','🍂','Otoño','Las granjas producen un 5 % más y los aserraderos un 15 % más.'],['invierno','❄','Invierno','Las granjas producen un 35 % menos (no los invernaderos) y el agua un 10 % menos.']];
const LEN=30;
window.season=()=>{try{return Math.floor(((S.day||1)-1)/LEN)%4}catch(e){return 0}};
window.seasonLeft=()=>{try{return LEN-((S.day||1)-1)%LEN}catch(e){return LEN}};
window.seasonInfo=()=>SN[season()];
const FARM=new Set(['farm']),WATER=new Set(['well','pump','cistern']),SAW=new Set(['saw']);
const oOut=window.out;if(typeof oOut==='function'){window.out=function(b){const o=oOut.apply(this,arguments);try{if(!o||S.mode==='creativo')return o;const s=season();let m=1,w=1,wd=1;
  if(FARM.has(b.type))m=[1.15,.9,1.05,.65][s];if(WATER.has(b.type))w=[1,1.25,1,.9][s];if(SAW.has(b.type))wd=[1,1,1.15,1][s];
  if(m!==1&&o.food>0)o.food*=m;if(w!==1&&o.water>0)o.water*=w;if(wd!==1&&o.wood>0)o.wood*=wd}catch(e){}return o};try{out=window.out}catch(e){}}
/* aviso al cambiar y unos días antes del invierno */
let last=null,warned=-1;
setInterval(()=>{try{if(!S||!S.day)return;const s=season();if(last===null){last=s;return}if(s!==last){last=s;const i=SN[s];try{toast(i[1]+' Llega el '+i[2].toLowerCase()+': '+i[3])}catch(e){}try{notify(i[1],'Llega el '+i[2].toLowerCase(),i[3],'pueblo')}catch(e){}try{window.diarioAdd&&diarioAdd(i[1],'Empieza el '+i[2].toLowerCase()+'.','pueblo')}catch(e){}}
 if(s===2&&seasonLeft()<=3&&warned!==S.day){warned=S.day;try{toast('❄ El invierno llega en '+seasonLeft()+' día'+(seasonLeft()>1?'s':'')+': guarda comida, las granjas producirán un 35 % menos.')}catch(e){}}}catch(e){}},1500);
/* chip en la barra superior */
function chip(){try{const top=document.getElementById('top');if(!top)return;let c=document.getElementById('snChip');if(!c){c=document.createElement('button');c.id='snChip';c.className='ch';c.onclick=e=>{e.stopPropagation();const i=seasonInfo();try{toast(i[1]+' '+i[2]+' · quedan '+seasonLeft()+' días · '+i[3])}catch(er){}};
  }/* junto al aviso de horda (después de los 5 primeros chips, que tienen su propio estilo) */const hz=document.getElementById('hzChip');if(hz&&c.nextSibling!==hz)top.insertBefore(c,hz);else if(!hz&&!c.parentNode)top.appendChild(c);const i=seasonInfo();c.textContent=i[1]+' '+i[2];c.title=i[2]+' · quedan '+seasonLeft()+' días';c.style.display=(S&&S.bld&&S.bld.length)?'':'none'}catch(e){}}
setInterval(chip,1500);
{const st=document.createElement('style');st.textContent='#snChip{cursor:pointer;border:1px solid #6a7a8a;font-weight:800;padding:0 7px;white-space:nowrap;font-size:11px;color:#e8eef4;background:linear-gradient(180deg,#2a3440,#1a222a)}';document.head.appendChild(st)}
/* aspecto: invierno frío con nieve; otoño con hojas */
const oR=window.render;
window.render=function(){const r=oR.apply(this,arguments);try{if(!S||!S.bld||!S.bld.length)return r;const s=season();if(s!==3&&s!==2)return r;const cv=document.getElementById('c'),c=cv.getContext('2d'),W=cv.width,H=cv.height,t=T;c.save();c.setTransform(1,0,0,1,0,0);
  if(s===3){c.fillStyle='rgba(215,230,255,.13)';c.fillRect(0,0,W,H);c.fillStyle='rgba(255,255,255,.85)';c.beginPath();const n=70,k=W/900;for(let i=0;i<n;i++){const x=((i*137.7+t*(14+i%5*4)+Math.sin(t*.8+i)*20)%(W+40))-20,y=((i*91.3+t*(26+i%4*7))%(H+40))-20,rr=(1+(i%3)*.6)*k;c.moveTo(x+rr,y);c.arc(x,y,rr,0,7)}c.fill()}
  else{const n=16,k=W/900;for(let i=0;i<n;i++){const x=((i*211.7+t*(10+i%4*3)+Math.sin(t+i)*30)%(W+40))-20,y=((i*77.3+t*(18+i%3*6))%(H+40))-20;c.fillStyle=['#c8642a','#e0a124','#a8401e'][i%3];c.save();c.translate(x,y);c.rotate(t*2+i);c.fillRect(-3*k,-1.4*k,6*k,2.8*k);c.restore()}}
  c.restore()}catch(e){}return r};
try{render=window.render}catch(e){}
})();
