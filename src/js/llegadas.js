/* Llegadas: un superviviente cada 4 días + Estación de radio */
(function(){
'use strict';
function arrive(why){
  if(S.ppl.length>=pcap()){toast('Un superviviente pasó por el pueblo, pero no hay camas libres y siguió su camino. ¡Construye más casas!');return false}
  const p=mkP();const h=S.bld.find(b=>b.type=='hall')||{x:26,y:26};
  p.x=p.tx=Math.max(1,Math.min(N-2,h.x+1+Math.random()*2));p.y=p.ty=Math.max(1,Math.min(N-2,h.y+4));
  S.ppl.push(p);
  toast((why=='radio'?'📻 Responde a tu señal: ':'🚶 Llega al pueblo: ')+p.n+' ('+p.prof+')');
  return true;
}
const FM=[1,1.8,3],FN=['Baja','Media','Alta'],RM=[1,1.4,2],RS=[1,1.2,1.5];
const mx=()=>Math.max(0,...S.bld.filter(b=>b.type=='radio'&&!b.cons).map(b=>b.freq||0));
window.raidMul=()=>RM[mx()];window.raidSz=()=>RS[mx()];
window.radioFreq=(id)=>{const b=bm[id];if(!b)return;b.freq=((b.freq||0)+1)%3;bPanel(id)};
const oP=window.bPanel;
window.bPanel=function(id){const r=oP.apply(this,arguments);
  try{const b=bm[id];if(b&&b.type=='radio'){const pan=document.getElementById('pan'),body=pan&&pan.querySelector('.panel-body');
    if(body&&!body.querySelector('.rfq')){const f=b.freq||0,d=document.createElement('div');d.className='rfq';
      d.innerHTML='<p><b>Frecuencia: '+FN[f]+'</b> · llegadas ×'+FM[f]+' · amenaza de merodeadores ×'+RM[f]+'</p><button class="big" onclick="radioFreq('+id+')">Cambiar frecuencia</button>';body.appendChild(d)}}}catch(e){}
  return r};
const old=window.doDay;
window.doDay=function(){
  const r=old.apply(this,arguments);
  try{
    autoRepair();
    {const r=rate(),nm={food:'comida',water:'agua'};['food','water'].forEach(k=>{if(r[k]<0&&S.res[k]/-r[k]<3)toast('⚠️ Poca '+nm[k]+': dura unos '+Math.max(0,Math.floor(S.res[k]/-r[k]))+' día(s). Construye '+(k=='water'?'pozos':'granjas')+' o asigna más trabajadores.')})}
    if(S.day%8===0&&S.lastArr!==S.day){S.lastArr=S.day;arrive('dia')}
    S.radioP=S.radioP||0;
    S.bld.filter(b=>b.type=='radio'&&!b.cons).forEach(b=>{
      const w=(typeof wk==='function'?wk(b).slice(0,BT.radio.slots).length:0);
      S.radioP+=(.06*b.lvl+.07*w)*FM[b.freq||0];
    });
    while(S.radioP>=1){S.radioP-=1;if(!arrive('radio')){S.radioP=Math.min(S.radioP,.9);break}}
  }catch(e){console.error(e)}
  try{if(S.ppl.length>=pcap())toast('🏠 Falta alojamiento ('+S.ppl.length+'/'+pcap()+'): construye casas o mejóralas para que lleguen más supervivientes.')}catch(e){}
  return r;
};
/* reparación automática: los Constructores arreglan lo dañado cada día */
function autoRepair(){
  const cons=S.ppl.filter(p=>p.prof=='Constructor'&&!p.away&&p.hp>30).length;
  let cap=2+3*cons,n=0;
  const dm=S.bld.filter(b=>!b.cons&&b.type!='road'&&b.type!='bridge'&&b.hp<mxhp(b)*.9).sort((a,b)=>a.hp/mxhp(a)-b.hp/mxhp(b));
  for(const b of dm){if(n>=cap||S.res.wood<5)break;S.res.wood-=5;b.hp=mxhp(b);n++}
  if(n)toast('🔧 '+(cons?'Los constructores reparan':'Reparaciones básicas')+': '+n+' estructura'+(n>1?'s':'')+' (−'+5*n+' madera).');
}
/* los merodeadores sueltos dejan edificios en ruinas (20 % de vida) en vez de destruirlos; los vecinos los ahuyentan */
const oK=window.killB;
window.killB=function(b){
  if(window.raidOn&&!horde&&b.type!='hall'){
    b.hp=Math.max(1,mxhp(b)*.2);
    const cx=b.x+b.w/2,cy=b.y+b.h/2;
    for(let i=Z.length-1;i>=0;i--){const z=Z[i];if(z.raid&&Math.hypot(z.x-cx,z.y-cy)<5)Z.splice(i,1)}
    toast('💥 '+BT[b.type].n+' dañado: los vecinos ahuyentan al merodeador. Se reparará.');
    return;
  }
  return oK.apply(this,arguments);
};
window._arrive=arrive;
})();
