/* ===== Investigación por puntos (PI): el laboratorio los produce, cada estudio se paga con PI y tarda un tiempo en una cola ===== */
(function(){
'use strict';
if(!RK.some(r=>r[0]==='rp')){RK.push(['rp','Puntos de investigación','#7fe0ff']);RN.rp='puntos de investigación';IV.rp=60;
 const c=document.createElement('canvas');c.width=c.height=20;const x=c.getContext('2d');x.strokeStyle='#111';x.lineWidth=1.4;x.fillStyle='#7fe0ff';
 x.beginPath();x.moveTo(8,3);x.lineTo(12,3);x.lineTo(12,8);x.lineTo(17,16);x.quadraticCurveTo(18,18,15,18);x.lineTo(5,18);x.quadraticCurveTo(2,18,3,16);x.lineTo(8,8);x.closePath();x.fill();x.stroke();
 x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.arc(9,14,1.5,0,7);x.fill();ICO.rp=c.toDataURL()}
const T=id=>TECH.find(q=>q[0]===id);
window.rpCost=t=>Math.round((10+14*t[3])/5)*5;
window.rpDays=t=>Math.round((.4+.12*t[3])*10)/10;
const fix=()=>{TECH.forEach(t=>{if(!t.pi){t[4]={rp:rpCost(t)};t.pi=1}})};fix();window.rpFix=fix;
const labs=()=>S.bld.filter(b=>b.type==='lab');
window.rpCap=()=>S.mode==='creativo'?999999:120+40*labs().reduce((a,b)=>a+b.lvl,0);
window.rqSlots=()=>{const L=labs();if(!L.length)return 0;const m=Math.max(...L.map(b=>b.lvl));return 1+(m>=4?1:0)+(m>=8?1:0)};
const ensure=()=>{if(!S.rq)S.rq=[];if(!S.rpG&&labs().length){S.rpG=1;S.res.rp=(S.res.rp||0)+30}};
/* sin laboratorio la investigación está bloqueada: no se ganan puntos de investigación */
window.rpOn=()=>{try{return S.mode==='creativo'||S.bld.some(b=>b.type==='lab')}catch(e){return false}};
window.rqList=()=>{ensure();return S.rq};
window.rqActive=()=>labs().some(b=>!b.off&&!b.pause);
window.rqIn=id=>(S.rq||[]).some(q=>q.id===id);
window.rqStart=id=>{ensure();fix();const t=T(id);if(!t||S.tech[id]||rqIn(id))return'';
  if(window.techWhyX){const w=techWhyX(t);if(w)return w}
  if(S.mode==='creativo'){S.tech[id]=1;rqDone(id);return''}
  if(S.rq.length>=rqSlots())return'La cola de investigación está llena ('+rqSlots()+').';
  if(!can(t[4]))return'Faltan puntos de investigación ('+t[4].rp+').';
  pay(t[4]);S.rq.push({id,left:rpDays(t),tot:rpDays(t)});toast('Investigando: '+t[2]);return''};
window.rqCancel=id=>{ensure();const i=S.rq.findIndex(q=>q.id===id);if(i<0)return;const t=T(id);S.rq.splice(i,1);S.res.rp=(S.res.rp||0)+t[4].rp;toast('Estudio cancelado. Puntos devueltos.')};
function rqDone(id){const t=T(id);S.tech[id]=1;toast('Tecnología investigada: '+t[2]);try{window._techFlash&&window._techFlash(id);window._techRefresh&&_techRefresh()}catch(e){}}
function tickRQ(dt){if(!S||!S.res||S.over)return;ensure();
  if(S.mode!=='creativo')S.res.rp=Math.min(S.res.rp||0,rpCap());
  if(!S.rq.length||horde||!rqActive())return;
  const d=dt/600;for(let i=S.rq.length-1;i>=0;i--){const q=S.rq[i];q.left-=d;if(q.left<=0){S.rq.splice(i,1);rqDone(q.id)}}}
const oU=window.upd;if(typeof oU==='function')window.upd=function(dt){const r=oU.apply(this,arguments);try{tickRQ(dt)}catch(e){}return r};
/* laboratorio: produce puntos de investigación */
BT.lab.p=Object.assign({},BT.lab.p,{rp:24});
BT.lab.f='Produce puntos de investigación (más cuanto mejor sea el científico y el nivel). Necesario para investigar. Requiere energía.';
/* fuentes extra: expediciones, misiones y archivos */
try{ZN.forEach((z,i)=>{if(!z.l)return;if(/lab|univers|hospital|clínic|cient/i.test(z.n))z.l.rp=[10,25];else if(i%3==1&&!z.l.rp)z.l.rp=[3,9];z._rp=z.l.rp;delete z.l.rp})}catch(e){}
/* las zonas solo dan puntos de investigación cuando ya hay laboratorio */
setInterval(()=>{try{const on=rpOn();ZN.forEach(z=>{if(!z._rp||!z.l)return;if(on)z.l.rp=z._rp;else delete z.l.rp})}catch(e){}},1500);
/* guía */
try{const G=window.GD||GD,rep=(t,f)=>{const g=G.find(q=>q[0]===t);if(!g)return;const o=g[1];g[1]=()=>f(o())};
const i=G.findIndex(q=>q[0]==='Tecnologías');
if(i>=0)G[i][1]=()=>{fix();return'<p>Las tecnologías <b>no gastan materiales</b>: se pagan con <b>puntos de investigación (PI)</b> y tardan un tiempo en completarse.</p><p><b>Conseguir PI:</b> el <b>Laboratorio</b> los produce cada día (más cuanto más nivel tenga y mejor sea el científico que trabaja en él; formar científicos sube la producción). Si el laboratorio se queda sin energía, deja de producir y la investigación se detiene. También dan PI las expediciones (sobre todo a laboratorios y hospitales), los archivos y documentos que encuentras, y algunas misiones principales. Empiezas con 30 PI.</p><p><b>Límite:</b> los PI no se acumulan sin fin: el tope es 120 + 40 por nivel de laboratorio.</p><p><b>Cola:</b> un estudio a la vez. Con un laboratorio de nivel 4 hay una segunda plaza y con nivel 8 una tercera. El coste se paga al empezar y puedes cancelar un estudio para recuperar los PI.</p><p><b>Árbol:</b> cada rama (Agricultura, Medicina, Construcción, Energía, Armamento, Defensa, Exploración) es una fila; un estudio pide haber investigado el anterior y tener el nivel de ayuntamiento indicado.</p>'+TECH.map(t=>`<p><b>${t[2]}</b> (${t[1]}, ayunt. ${t[3]}): ${t[5]}. Coste: ${t[4].rp} PI · ${rpDays(t)} días.</p>`).join('')};
rep('Recursos',h=>h);
}catch(e){console.error('guia inv',e)}
})();
