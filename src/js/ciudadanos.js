/* ===== Dead Town · atributos de ciudadano (Fuerza, Destreza, Ingenio, Carisma), centros de entrenamiento y nuevos puestos de trabajo ===== */
(function(){
'use strict';
const K=NBK,{V,vol,crate,post,line,cyl,gableY,chimney,wnd,dor,sacks,OLC,seg}=K;
const ATN={f:'Fuerza',d:'Destreza',i:'Ingenio',c:'Carisma'},ATC={f:'#e0704a',d:'#4fd1c5',i:'#7fb0ff',c:'#f2c94c'},MAXA=10;
/* ---------- edificios ---------- */
const SU=(sub)=>sub;
Object.assign(BT,{
 gym:{n:'Gimnasio',w:2,h:2,z:28,c:'#8a6a4a',cost:{wood:220,metal:140,stone:30},lv:9,hp:200,slots:2,job:[],at:'f',f:'Entrena la FUERZA: más salud máxima y más daño en combate, y mejor rendimiento en trabajos físicos. Asigna ciudadanos para entrenarlos.'},
 agil:{n:'Pista de agilidad',w:3,h:3,z:20,c:'#6a8a6a',cost:{wood:260,metal:120,tarp:20},lv:10,hp:180,slots:2,job:[],at:'d',f:'Entrena la DESTREZA: más probabilidad de críticos y mejor rendimiento en trabajos de precisión y exploración.'},
 biblio:{n:'Biblioteca',w:3,h:2,z:34,c:'#9a7a52',cost:{wood:320,metal:150,brick:30},lv:11,hp:220,slots:2,job:[],at:'i',f:'Entrena el INGENIO: mejora el rendimiento de laboratorios, hospitales y talleres técnicos.'},
 salon:{n:'Salón comunal',w:3,h:3,z:36,c:'#b08a5a',cost:{wood:400,metal:160,brick:40,glass:15},lv:12,hp:260,slots:2,job:[],at:'c',f:'Entrena el CARISMA: mejora el rendimiento de cocinas y la atención sanitaria.'},
 forgeb:{n:'Forja de aleación',w:3,h:3,z:46,c:'#5a626a',cost:{wood:300,metal:600,steel:60,concrete:40,glass:20},lv:13,hp:360,p:{alloy:2},job:['Mecánico','Constructor'],slots:3,f:'Produce aleación de forma continua. Los atributos de sus trabajadores aumentan la producción.'},
 obs:{n:'Observatorio',w:3,h:3,z:62,c:'#8a96a6',cost:{wood:260,metal:500,steel:40,concrete:30,glass:60},lv:14,hp:300,p:{rp:30},job:['Científico','Explorador'],slots:2,f:'Produce puntos de investigación extra gracias al análisis de datos del exterior.'},
 cmd:{n:'Centro de mando',w:3,h:3,z:48,c:'#6a7a5a',cost:{wood:350,metal:520,steel:50,concrete:50,glass:20},lv:15,hp:420,job:['Soldado','Explorador'],slots:2,f:'Coordina las salidas: permite enviar a un miembro más en cada expedición.'}});
['gym','agil','biblio','salon'].forEach(k=>{MAT[k]=k==='biblio'?'plaster':'plank'});['forgeb','obs','cmd'].forEach(k=>{MAT[k]='concrete'});
Object.assign(SIGNT,{gym:'GIMNASIO',agil:'AGILIDAD',biblio:'BIBLIOTECA',salon:'SALÓN',forgeb:'FORJA',obs:'OBSERVATORIO',cmd:'MANDO'});
/* ---------- diseños ---------- */
const at=(c,u,v,z0,z1,fn)=>{seg(c,u-.2,v-.2,.4,.4,z0,z1);fn(V(u,v,z0))};
const glow=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
const slab=(c,w,h,col)=>vol(c,{x:-.08,y:-.08,w:w+.16,h:h+.16,z:2,col:col||'#85817a',mat:'block',seed:2});
const disc=(c,p,r,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(p[0],p[1],r,r*.8,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()};
const sm=(c,p)=>{if(typeof smoke==='function')smoke(c,p)};
function flag(c,x,y,h,col){post(c,x,y,2,h,'#6b6458');const p=V(x,y,2);c.fillStyle=col;c.beginPath();c.moveTo(p[0]+1.8,p[1]-h);c.lineTo(p[0]+15,p[1]-h+3.5);c.lineTo(p[0]+1.8,p[1]-h+9);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}
NB.gym={up:90,paint(c,b){slab(c,2,2);
 vol(c,{x:.1,y:.1,w:1.8,h:1.0,z:18,z0:2,col:'#8a6a4a',mat:'plank',seed:3,decL:(c,len)=>{wnd(c,len*.2,-11,8,6,{lit:true});wnd(c,len*.6,-11,8,6,{})},decR:(c,len)=>{dor(c,len/2-5,-10.5,10,10.5,{col:'#3a2a1c'})}});
 vol(c,{x:.04,y:.04,w:1.92,h:1.12,z:3,z0:20,col:'#5a4632',mat:'plank',seed:5});
 /* barra con discos */
 post(c,.45,1.5,2,9,'#6b6458');post(c,1.25,1.5,2,9,'#6b6458');line(c,V(.35,1.5,12),V(1.35,1.5,12),'#cfd3d6',2.2);
 for(const u of[.38,.52,1.18,1.32]){const p=V(u,1.5,12);disc(c,p,4.2,'#2a2a2e')}
 /* saco de boxeo y pesas */
 post(c,1.75,1.55,2,22,'#6b6458');line(c,V(1.75,1.55,22),V(1.75,1.55,12),'#8a7a5a',1);const sp=V(1.75,1.55,12);c.fillStyle='#b3402e';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(sp[0],sp[1]-3,4.4,7,0,0,7);c.fill();c.stroke();
 crate(c,.15,1.7,2,.26,'#7a7f86');flag(c,1.85,.1,34,'#e0704a')}};
NB.agil={up:90,paint(c,b){slab(c,3,3,'#7f7a6e');
 vol(c,{x:.15,y:.15,w:1.0,h:.2,z:26,z0:2,col:'#8a6a4a',mat:'plank',seed:3});vol(c,{x:.15,y:.15,w:.2,h:1.0,z:26,z0:2,col:'#8a6a4a',mat:'plank',seed:4});
 for(let i=0;i<3;i++){const u=.5+i*.28;post(c,.18,u,2,8+i*7,'#c9a24a')}
 /* vallas de salto */
 for(const v of[1.0,1.6,2.2]){post(c,1.5,v,2,9,'#8a8f94');post(c,2.5,v,2,9,'#8a8f94');line(c,V(1.5,v,10),V(2.5,v,10),v>1.5?'#e0704a':'#e8e8e0',2)}
 /* neumáticos */
 for(let i=0;i<4;i++){const p=V(.45+i*.42,2.6,3+((i%2)?3:0));c.fillStyle='#222428';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(p[0],p[1],6,3.8,0,0,7);c.fill();c.stroke();c.fillStyle='#4a4c50';c.beginPath();c.ellipse(p[0],p[1],3,1.8,0,0,7);c.fill()}
 /* cuerda tensada */
 line(c,V(2.7,.4,2),V(2.7,1.0,26),'#b8a070',1.3);flag(c,2.75,.15,32,'#4fd1c5')}};
NB.biblio={up:90,paint(c,b){slab(c,3,2,'#8a8478');
 vol(c,{x:.1,y:.1,w:2.8,h:1.5,z:26,z0:2,col:'#a58a60',mat:'brick',seed:4,decL:(c,len)=>{for(let i=0;i<4;i++)wnd(c,len*(.1+i*.22),-14,8,9,{lit:i%2===0})},decR:(c,len)=>{dor(c,len/2-5,-12,10,12,{col:'#3a2a1c'});wnd(c,len*.15,-14,8,8,{lit:true})}});
 gableY(c,{x:.05,y:.05,w:2.9,h:1.6,z:28,rh:12,col:'#6a4a38',wallCol:'#a58a60',mat:'plank',seed:5,oh:.12,rows:7});
 for(let i=0;i<4;i++)post(c,.35+i*.75,1.75,2,18,'#d8d0b8');vol(c,{x:.25,y:1.65,w:2.6,h:.16,z:3,z0:20,col:'#b8b09a',mat:'block',seed:6});
 crate(c,2.6,1.8,2,.3,'#8a5a32');crate(c,2.4,1.9,2.3,.22,'#5a7aa0');chimney(c,.5,.4,34,14,'#7a5a4a')}};
NB.salon={up:90,paint(c,b){slab(c,3,3,'#85796a');
 vol(c,{x:.15,y:.1,w:2.7,h:1.9,z:24,z0:2,col:'#b08a5a',mat:'plank',seed:4,decL:(c,len)=>{for(let i=0;i<4;i++)wnd(c,len*(.1+i*.22),-12,8,8,{lit:true})},decR:(c,len)=>{dor(c,len*.3,-11,12,11,{col:'#3a2a1c'});dor(c,len*.62,-11,12,11,{col:'#3a2a1c'})}});
 gableY(c,{x:.08,y:.05,w:2.84,h:2.0,z:26,rh:12,col:'#7a4a32',wallCol:'#b08a5a',mat:'plank',seed:5,oh:.14,rows:8});
 vol(c,{x:.25,y:2.05,w:2.5,h:.8,z:2,z0:2,col:'#9a8a6a',mat:'block',seed:6});
 post(c,.3,2.85,2,22,'#6a4a32');post(c,2.7,2.85,2,22,'#6a4a32');line(c,V(.3,2.85,22),V(2.7,2.85,22),'#d9b85a',1.4);
 for(let i=0;i<7;i++){const u=.4+i*.33,p=V(u,2.85,21-Math.sin(i/6*3.14)*-2);c.fillStyle=i%2?'#ffe28a':'#ffb04a';c.beginPath();c.arc(p[0],p[1]+3,1.8,0,7);c.fill()}
 vol(c,{x:1.1,y:2.2,w:.8,h:.4,z:2.4,z0:2,col:'#6a4a2a',mat:'plank',seed:7});sacks(c,.35,2.3,2,3);flag(c,2.85,.1,40,'#f2c94c')}};
NB.forgeb={up:90,paint(c,b){slab(c,3,3,'#6f6a62');
 vol(c,{x:.1,y:.1,w:2.1,h:1.8,z:34,z0:2,col:'#5a626a',mat:'metal',seed:3,decL:(c,len)=>{wnd(c,len*.2,-16,9,7,{lit:true});wnd(c,len*.6,-16,9,7,{})},decR:(c,len)=>{dor(c,len/2-6,-14,12,14,{col:'#2a2420'})}});
 gableY(c,{x:.05,y:.05,w:2.2,h:1.9,z:36,rh:9,col:'#3a4048',wallCol:'#5a626a',mat:'metal',seed:5,oh:.1,rows:6});
 chimney(c,1.7,.4,44,16,'#3a3a3e');chimney(c,.4,1.4,40,12,'#3a3a3e');
 /* horno con brasas y lingotes cian */
 vol(c,{x:2.2,y:.5,w:.7,h:.9,z:14,z0:2,col:'#7a4a32',mat:'brick',seed:6});at(c,2.55,.95,16,17,p=>{glow(c,p[0],p[1]-2,12,'rgba(255,140,50,.55)');c.fillStyle='#ffb04a';c.fillRect(p[0]-4,p[1]-3,8,3)});
 vol(c,{x:.3,y:2.2,w:.7,h:.3,z:5,z0:2,col:'#2a2c30',mat:'metal',seed:7});vol(c,{x:.4,y:2.25,w:.5,h:.2,z:3,z0:7,col:'#4a4c52',mat:'metal',seed:8});
 for(let i=0;i<3;i++)vol(c,{x:1.5+i*.35,y:2.3,w:.3,h:.2,z:2.6,z0:2+(i%2)*2.6,col:'#8be3ff',mat:'metal',seed:9+i})},
 live(c,b,H){sm(c,H.L(1.7,.4,60))}};
NB.obs={up:90,paint(c,b){slab(c,3,3,'#7f7f86');
 vol(c,{x:.5,y:.5,w:2,h:2,z:34,z0:2,col:'#8a96a6',mat:'plaster',seed:3,decL:(c,len)=>{wnd(c,len*.3,-18,9,9,{lit:true})},decR:(c,len)=>{dor(c,len/2-5,-14,10,14,{col:'#2a3040'});wnd(c,len*.1,-20,7,8,{lit:true})}});
 vol(c,{x:.4,y:.4,w:2.2,h:2.2,z:3,z0:36,col:'#6a7684',mat:'block',seed:5});
 /* cúpula y telescopio */
 const p=V(1.5,1.5,39);c.fillStyle='#d8dee6';c.strokeStyle=OLC;c.lineWidth=1.4;c.beginPath();c.ellipse(p[0],p[1],25,13,0,Math.PI,0,false);c.lineTo(p[0]+25,p[1]);c.ellipse(p[0],p[1],25,8,0,0,Math.PI,false);c.closePath();c.fill();c.stroke();
 c.fillStyle='#2a3a58';c.beginPath();c.ellipse(p[0]+6,p[1]-9,5,12,-.6,0,7);c.fill();c.stroke();line(c,V(1.5,1.5,39),V(2.1,1.3,60),'#aab4c0',3);
 glow(c,p[0]+13,p[1]-18,12,'rgba(139,227,255,.5)');
 post(c,.2,2.8,2,24,'#9fb4c0');at(c,.2,2.8,26,28,q=>{c.fillStyle='#8be3ff';c.beginPath();c.arc(q[0],q[1]-3,2.4,0,7);c.fill()})}};
NB.cmd={up:90,paint(c,b){slab(c,3,3,'#6f6e62');
 vol(c,{x:.2,y:.4,w:2.6,h:2.0,z:28,z0:2,col:'#6a7a5a',mat:'block',seed:3,decL:(c,len)=>{wnd(c,len*.15,-14,12,5,{lit:true});wnd(c,len*.55,-14,12,5,{lit:true})},decR:(c,len)=>{dor(c,len/2-6,-14,12,14,{col:'#2a3020'})}});
 vol(c,{x:.1,y:.3,w:2.8,h:2.2,z:3,z0:30,col:'#4a5a3a',mat:'block',seed:5});
 /* mástil, parabólica y banderín */
 post(c,2.55,.5,32,48,'#aab2b8');const d=V(2.55,.5,60);c.fillStyle='#d4dadd';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();c.ellipse(d[0]+3,d[1],9,6,-.5,0,7);c.fill();c.stroke();flag(c,.35,.5,52,'#b43a2e');
 for(let i=0;i<5;i++)sacks(c,.2+i*.32,2.75,2,1);crate(c,2.3,2.7,2,.3,'#3a4a2a')}};
/* ---------- menú de construcción ---------- */
/* (las categorías se completan en construir_ui.js) */
/* ---------- atributos ---------- */
const ensure=p=>{if(!p.at){const s=Math.floor(Math.random()*3),r=()=>Math.floor(Math.random()*3);p.at={f:r(),d:r(),i:r(),c:r()};const m={Soldado:'f',Constructor:'f',Recolector:'f',Explorador:'d',Mecánico:'d',Científico:'i',Médico:'i',Cocinero:'c',Agricultor:'f'}[p.prof];if(m)p.at[m]=Math.min(MAXA,p.at[m]+1+s%2)}return p.at};
window.atOf=ensure;
setInterval(()=>{try{if(typeof S==='undefined'||!S||!S.ppl)return;S.ppl.forEach(ensure);if(typeof S.res.alloy!=='number')S.res.alloy=0}catch(e){}},1500);
const isAt=b=>b&&BT[b.type]&&BT[b.type].at;
const secs=(p,b)=>Math.round(160*Math.pow((ensure(p)[BT[b.type].at]||0)+1,1.35)/(1+.15*((b.lvl||1)-1)));
const fmt=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const info=p=>{const b=p.job&&bm[p.job];if(!isAt(b))return null;const k=BT[b.type].at,lv=ensure(p)[k]||0,need=secs(p,b);return{b,k,lv,need,left:need-(p.atT||0),pct:Math.min(100,(p.atT||0)/need*100),max:lv>=MAXA}};
const oUpd=window.upd;
window.upd=function(dt){oUpd.apply(this,arguments);try{if(S.over)return;
  const salon=S.bld.filter(b=>b.type==='salon').reduce((a,b)=>a+b.lvl,0);
  S.ppl.forEach(p=>{const a=ensure(p);if(!p.away&&(a.c||salon)){p.mor=Math.min(100,(p.mor||0)+(a.c*.0025+salon*.0015)*dt)}
   const i=info(p);if(!i){p.atT=0;p.atK=null;return}if(p.away||p.hp<=0)return;
   const key=i.b.id+':'+i.k+':'+i.lv;if(p.atK!==key){p.atK=key;p.atT=0}
   if(i.max){p.job=0;p.atT=0;toast(p.n.split(' ')[0]+' ya domina '+ATN[i.k]+' (nivel '+MAXA+')');return}
   p.atT=(p.atT||0)+dt;if(p.atT>=i.need){a[i.k]=Math.min(MAXA,i.lv+1);p.atT=0;p.atK=null;p.job=0;p.xp+=8;toast(p.n.split(' ')[0]+': '+ATN[i.k]+' nivel '+a[i.k])}})}catch(e){}};
/* producción: los atributos de los trabajadores mejoran el rendimiento (hasta +30%) */
const REL={Constructor:'f',Recolector:'f',Agricultor:'f',Soldado:'f',Mecánico:'d',Explorador:'d',Científico:'i',Médico:'i',Cocinero:'c'};
const oOut=window.out;
window.out=function(b,pow){const o=oOut.apply(this,arguments);try{const d=BT[b.type];if(!d||!d.p||!d.job||!d.job.length)return o;const k=REL[d.job[0]];if(!k)return o;const w=wk(b).slice(0,slots(b));if(!w.length)return o;const avg=w.reduce((a,p)=>a+(ensure(p)[k]||0),0)/w.length,m=1+.03*avg;if(m>1)for(const q in o)o[q]*=m}catch(e){}return o};
/* combate */
const eq=window.eqPow;window.eqPow=function(p){return eq.apply(this,arguments)+(p&&p.at?Math.round((p.at.f+p.at.d)*1.5+p.at.i*.5):0)};
/* ficha del ciudadano (pestaña Roles) */
window.atHtml=p=>{const a=ensure(p);return '<p><b>Atributos</b></p><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'+Object.keys(ATN).map(k=>'<div class="invc" style="padding:6px"><div style="flex:1"><b style="color:'+ATC[k]+'">'+ATN[k]+' '+a[k]+'</b><div style="height:6px;background:#222;border-radius:3px;margin-top:4px"><div style="height:100%;width:'+(a[k]*10)+'%;background:'+ATC[k]+';border-radius:3px"></div></div></div></div>').join('')+'</div><p class="invb">Se entrenan en Gimnasio (Fuerza), Pista de agilidad (Destreza), Biblioteca (Ingenio) y Salón comunal (Carisma).</p>'};
/* panel de los centros de entrenamiento */
const oB=window.bPanel;
window.bPanel=function(id){const b=bm[id];if(!isAt(b))return oB.apply(this,arguments);const sh=window.show;window.show=function(t,h){window.show=sh;const k=BT[b.type].at;
  const al=wk(b).map(p=>{const i=info(p);return i?'<div class="invc"><div style="flex:1"><b>'+p.n+'</b> <small>'+ATN[k]+' '+i.lv+' → '+Math.min(MAXA,i.lv+1)+'</small><div style="height:6px;background:#222;border-radius:3px;margin:4px 0"><div style="height:100%;width:'+i.pct+'%;background:'+ATC[k]+';border-radius:3px"></div></div><div class="invb">'+(i.max?'Ya domina este atributo':'Faltan '+fmt(i.left))+'</div></div></div>':''}).join('');
  h=h.replace(/<p>Trabajadores (\d+)\/(\d+)\. Ideal: [^<]*<\/p>/,'<p>Alumnos $1/$2 · Atributo: <b style="color:'+ATC[k]+'">'+ATN[k]+'</b></p>');
  sh(t,h+(al?'<p><b>En formación</b></p>'+al:'<p><small>Nadie se está formando. Asigna un superviviente libre.</small></p>'))};return oB.apply(this,arguments)};
/* centro de mando: un miembro más por expedición */
window.cmdBonus=()=>cnt('cmd')>0?1:0;
})();
