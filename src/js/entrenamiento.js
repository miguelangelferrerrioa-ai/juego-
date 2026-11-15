/* Formación estilo Fallout Shelter: edificios que solo sirven para entrenar un rol. El superviviente asignado no trabaja en otro sitio y, pasado el tiempo, sube un nivel de ese rol. */
(function(){
'use strict';
const TR=[
 ['Médico','Aula de medicina','AULA MÉDICA','#dfe8ea',2,{wood:110,metal:50}],
 ['Soldado','Campo de tiro','TIRO','#7a8a52',2,{wood:110,metal:60}],
 ['Constructor','Escuela de obras','OBRAS','#a8905a',2,{wood:130,metal:40}],
 ['Agricultor','Huerto escuela','HUERTO','#7da05a',2,{wood:120,metal:30}],
 ['Cocinero','Cocina escuela','COCINA','#c98a5a',2,{wood:120,metal:40}],
 ['Explorador','Pista de rastreo','RASTREO','#5a7aa0',3,{wood:130,metal:60}],
 ['Mecánico','Taller escuela','TALLER-ESC','#8a8f96',3,{wood:100,metal:90}],
 ['Recolector','Escuela de recolección','RECOLECCIÓN','#8a6a3a',2,{wood:120,metal:30}],
 ['Científico','Aula de ciencias','CIENCIA','#7fb8b0',3,{wood:110,metal:80}]];
TR.forEach(([pf,n,sign,col,lv,cost])=>{const k='tr_'+pf;BT[k]={n,w:2,h:2,z:28,c:col,cost,lv,hp:180,slots:2,job:[],tr:pf,f:'Solo sirve para entrenar el rol de '+pf+'. Asigna aquí a un superviviente: mientras se forma no trabaja en ningún otro sitio. Cuanto más nivel, más tarda. Mejorar el edificio acelera la formación y da más plazas.'};
  MAT[k]='plaster';SIGNT[k]=sign});
const MAXL=10,secs=(p,b)=>Math.round(205*Math.pow((p.ps[b.tr||BT[b.type].tr]||0)+1,1.4)/(1+.15*((b.lvl||1)-1)));
const isTr=b=>b&&BT[b.type]&&BT[b.type].tr;
const fmt=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
window.trInfo=p=>{const b=p.job&&bm[p.job];if(!isTr(b))return null;const pf=BT[b.type].tr,lv=p.ps[pf]||0,need=secs(p,b);return{b,pf,lv,need,left:need-(p.trT||0),pct:Math.min(100,(p.trT||0)/need*100),max:lv>=MAXL}};
const oUpd=window.upd;
window.upd=function(dt){oUpd.apply(this,arguments);try{if(S.over)return;S.ppl.forEach(p=>{const i=trInfo(p);if(!i){p.trT=0;p.trK=null;return}
  if(p.away||p.hp<=0)return;const key=i.b.id+':'+i.pf+':'+i.lv;if(p.trK!==key){p.trK=key;p.trT=0}
  if(i.max){p.job=0;p.trT=0;toast(p.n.split(' ')[0]+' ya domina '+i.pf+' (nivel '+MAXL+')');return}
  p.trT=(p.trT||0)+dt;if(p.trT>=i.need){p.ps[i.pf]=Math.min(MAXL,i.lv+1);p.trT=0;p.trK=null;p.job=0;S.dt=(S.dt||0)+1;p.xp+=10;
    const best=Object.keys(p.ps).reduce((a,k)=>p.ps[k]>p.ps[a]?k:a,p.prof);if(p.ps[best]>(p.ps[p.prof]||0)){p.prof=best;try{p.sp=pk(SPC[best])}catch(e){}}
    toast('🎓 '+p.n.split(' ')[0]+': '+i.pf+' nivel '+p.ps[i.pf])}})}catch(e){}};
/* panel del edificio: lista de alumnos con tiempo restante */
const oB=window.bPanel;
window.bPanel=function(id){const b=bm[id];if(!isTr(b))return oB.apply(this,arguments);const sh=window.show;window.show=function(t,h){window.show=sh;
  const pf=BT[b.type].tr,al=wk(b).map(p=>{const i=trInfo(p);return i?`<div class="invc"><div style="flex:1"><b>${p.n}</b> <small>${pf} nivel ${i.lv} → ${Math.min(MAXL,i.lv+1)}</small><div style="height:6px;background:#222;border-radius:3px;margin:4px 0"><div style="height:100%;width:${i.pct}%;background:#48c;border-radius:3px"></div></div><div class="invb">${i.max?'Ya domina este rol':'Faltan '+fmt(i.left)}</div></div></div>`:''}).join('');
  h=h.replace(/<p>Trabajadores (\d+)\/(\d+)\. Ideal: [^<]*<\/p>/,'<p>Alumnos $1/$2 · Rol: <b>'+pf+'</b></p>');h=h.replace(/Quitar (\S[^<]*?) \(/g,'Sacar a $1 (');
  sh(t,h+(al?'<p><b>En formación</b></p>'+al:'<p><small>Nadie se está formando. Asigna un superviviente libre.</small></p>')+'<p class="invb">Cada nivel tarda bastante más que el anterior (de 3 min a 1 h y media). Mejorar el edificio lo acorta.</p>')};try{oB.apply(this,arguments)}finally{window.show=sh}};
})();
