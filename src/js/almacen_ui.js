/* ===== Dead Town · Almacén unificado: todo se ve con foto y color de rareza ===== */
(function(){
const RC={C:['Común','#bdbdbd'],U:['Poco común','#7fc97f'],R:['Raro','#6aa9ff'],E:['Épico','#b36cff'],L:['Legendario','#e8b84a']};
const RR={food:'C',water:'C',wood:'C',stone:'C',tarp:'C',scrap:'C',metal:'U',plank:'U',ammo:'U',gas:'U',sheet:'U',brick:'U',meds:'R',abx:'R',glass:'R',comp:'R',chem:'R',steel:'R',concrete:'L'};
const VR={jug:'C',disco:'C',elec:'C',radio:'C',reloj:'U',joya:'U',arte:'R',r_med:'R',r_ins:'R',r_oro:'L',r_cua:'L'};
const CL={head:'🧢',torso:'🧥',legs:'👖',feet:'🥾',hands:'🧤',back:'🎒',face:'😷',vest:'🦺',jacket:'🧥',pants:'👖',boots:'🥾',pack:'🎒'},SN={head:'Cabeza',torso:'Torso',legs:'Piernas',feet:'Pies',hands:'Manos',back:'Espalda',face:'Cara',vest:'Torso · chaleco',jacket:'Torso · chaqueta',pants:'Piernas',boots:'Pies',pack:'Espalda'},cache={};
function emoji(e){if(cache[e])return cache[e];const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');g.font='40px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(e,32,35);return cache[e]=cv.toDataURL()}
function card(img,name,stat,sub,rar,cnt,fit){const r=RC[rar]||RC.C;
 return '<div class="invc" style="border-color:'+r[1]+'"><img src="'+img+'" class="invi" style="box-shadow:0 0 8px '+r[1]+'55;'+(fit?'padding:6px':'')+'"><div><b style="color:'+r[1]+'">'+name+(cnt>1?' ×'+cnt:'')+'</b><div class="invs">'+stat+'</div>'+(sub?'<div class="invb">'+sub+'</div>':'')+'<div class="invr">'+r[0]+'</div></div></div>'}
const resCards=list=>{const d=rate();return '<div class="invg">'+list.map(r=>(window.resLocked&&resLocked(r[0]))?card(ICO[r[0]],'???','Bloqueado',resLockTxt(r[0]),'C',1,1).replace('class="invi" style="','class="invi" style="'+resLockImg+';'):card(ICO[r[0]],r[1],Math.floor(S.res[r[0]]||0)+' / '+cap(),(d[r[0]]>=0?'+':'')+(d[r[0]]/10).toFixed(1)+' por minuto',RR[r[0]]||'C',1,1)).join('')+'</div>'};
const tabs=t=>{const T=[['res','Recursos'],['mat','Materiales'],['wp','Armas'],['out','Atuendos'],['clo','Prendas'],['val','Valor']];return '<p style="display:flex;gap:6px;flex-wrap:wrap">'+T.map(x=>'<button class="'+(t===x[0]?'primary':'')+'" onclick="storeTab=\''+x[0]+'\';storeMenu()">'+x[1]+'</button>').join('')+'</p>'};
window.itemEmoji=emoji;
const ICC={};
function clothIcon(slot,col){const k=slot+'|'+col;if(ICC[k])return ICC[k];const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');col=col||((typeof ZCLOTH!=='undefined'&&ZCLOTH.find(z=>z.slot===slot))||{}).col||'#6b6455';
 const sh=(c,f)=>{g.fillStyle=c;g.strokeStyle='#15110c';g.lineWidth=2.5;g.lineJoin='round';g.beginPath();f();g.closePath();g.fill();g.stroke()};
 const dk=c=>{const n=parseInt(c.slice(1),16);const r=Math.max(0,(n>>16)-35),gg=Math.max(0,((n>>8)&255)-35),b=Math.max(0,(n&255)-35);return 'rgb('+r+','+gg+','+b+')'};
 if(slot==='jacket'||slot==='torso'||slot==='vest'){const sl=slot!=='vest';
  sh(col,()=>{g.moveTo(22,12);g.lineTo(42,12);g.lineTo(sl?56:48,20);g.lineTo(sl?58:48,sl?44:30);g.lineTo(sl?50:48,sl?46:30);g.lineTo(48,30);g.lineTo(48,54);g.lineTo(16,54);g.lineTo(16,30);g.lineTo(sl?14:16,sl?46:30);g.lineTo(sl?6:16,sl?44:30);g.lineTo(sl?8:16,20)});
  g.strokeStyle='#15110c';g.lineWidth=2;g.beginPath();g.moveTo(32,16);g.lineTo(32,54);g.stroke();g.fillStyle=dk(col);g.beginPath();g.moveTo(22,12);g.lineTo(32,24);g.lineTo(42,12);g.closePath();g.fill();
  if(slot==='vest'){g.fillStyle='#e0a124';g.fillRect(17,38,30,4)}else{g.fillStyle='#d9c9a0';[28,36,44].forEach(y=>{g.beginPath();g.arc(35,y,1.6,0,7);g.fill()})}}
 else if(slot==='pants'||slot==='legs'){sh(col,()=>{g.moveTo(18,8);g.lineTo(46,8);g.lineTo(50,56);g.lineTo(36,56);g.lineTo(32,24);g.lineTo(28,56);g.lineTo(14,56)});g.fillStyle=dk(col);g.fillRect(18,8,28,6)}
 else if(slot==='boots'||slot==='feet'){[[10,0],[34,4]].forEach(([x,y])=>sh(col,()=>{g.moveTo(x+4,12+y);g.lineTo(x+16,12+y);g.lineTo(x+16,40+y);g.lineTo(x+24,46+y);g.lineTo(x+24,52+y);g.lineTo(x+2,52+y);g.lineTo(x+4,40+y)}))}
 else if(slot==='pack'||slot==='back'){sh(col,()=>{g.moveTo(16,16);g.quadraticCurveTo(32,4,48,16);g.lineTo(50,54);g.lineTo(14,54)});sh(dk(col),()=>{g.moveTo(20,34);g.lineTo(44,34);g.lineTo(44,50);g.lineTo(20,50)});g.strokeStyle='#15110c';g.lineWidth=2.5;g.beginPath();g.arc(32,12,6,Math.PI,0);g.stroke()}
 else return emoji(CL[slot]||'👕');
 return ICC[k]=cv.toDataURL()}
window.clothIcon=clothIcon;
const oSM=window.storeMenu;
window.storeMenu=function(){let t=window.storeTab||'res';if(!['res','mat','wp','out','clo','val'].includes(t))t=window.storeTab='res';let h=tabs(t);
 if(t==='res')h+=resCards(RK.filter(r=>r[0]!=='elec'&&r[0]!=='rp'&&!(window.MATK&&MATK.includes(r[0]))))+(window.capBtn?capBtn():'');
 else if(t==='mat'){const mk=window.MATK||[];h+=resCards(RK.filter(r=>mk.includes(r[0])))+(window.matHtml?'<details style="margin-top:8px"><summary>Dónde se consigue y para qué sirve</summary>'+matHtml()+'</details>':'')+(window.capBtn?capBtn():'')}
 else if(t==='clo'){const g={};(S.inv||[]).forEach(it=>{if(it.kind!=='clothing')return;const k=it.n+'|'+(it.def||0)+'|'+it.slot;(g[k]=g[k]||{it,c:0}).c++});const L=Object.values(g);
  h+=L.length?'<div class="invg">'+L.map(o=>{const d=o.it.def||0,r=d>=4?'L':d>=3?'R':d>=2?'U':'C';return card(clothIcon(o.it.slot,o.it.col),o.it.n,'🛡 Defensa +'+d,SN[o.it.slot]||o.it.slot||'',r,o.c)}).join('')+'</div>':'<p><small>No tienes prendas recuperadas. Las sueltan algunos zombis.</small></p>'}
 else if(t==='val'){const V=window.villaVal||{},vv=S.val||{},K=Object.keys(vv).filter(k=>V[k]&&vv[k]>0);
  h+=K.length?'<div class="invg">'+K.map(k=>card(emoji(V[k][1]),V[k][0],V[k][3]?'Reliquia':'Objeto de valor','Se vende en la casa de empeños de la Villa',VR[k]||'C',vv[k])).join('')+'</div>':'<p><small>No tienes objetos de valor. Se encuentran en expediciones, exploraciones y restos de vehículos, y se venden en la Villa.</small></p>'}
 else{let cap_=null;const rs=window.show;window.show=function(a,b){cap_=b};try{oSM()}finally{window.show=rs}h+=(cap_||'').replace(/^<p style="display:flex[^]*?<\/p>/,'')}
 show('Almacén',h)};
})();
