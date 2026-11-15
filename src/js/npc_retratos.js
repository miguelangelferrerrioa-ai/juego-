/* Retratos de los vecinos (Villa Esperanza y Guardia del Alba): misma cara dibujada que los supervivientes + un detalle de su oficio. Sustituye al círculo de color con emoji. */
(function(){
'use strict';
/* id: [sexo, edad, piel, pelo, ropa, detalle, id de estilo] */
const LOOK={
 raul:['M',41,'#c98f68','#1c1c1c','#8a2f3e','pajarita',4],
 berta:['F',46,'#e8b88a','#5a3a1a','#5d6a76','llave',2],
 telmo:['M',64,'#dca77e','#a9a9a4','#c4741c','gorra',3],
 lola:['F',38,'#f0c9a0','#8a3a1a','#4f7a4f','delantal',5],
 marta:['F',51,'#c98f68','#2a1a10','#b5763a','panuelo',1],
 elena:['F',34,'#f0c9a0','#c8a050','#e4e8e8','fonendo',6],
 gus:['M',58,'#e8b88a','#a9a9a4','#7a5a32','gafas',7],
 ibarra:['M',47,'#9d684b','#1c1c1c','#48607e','boina',9],
 valeria:['F',52,'#dca77e','#2a1a10','#3f4c3a','estrella',10],
 soler:['M',45,'#e8b88a','#5a3a1a','#4a5638','oficial',11],
 reyes:['F',41,'#c98f68','#1c1c1c','#e4e8e8','cruz',13],
 olmos:['M',56,'#9d684b','#a9a9a4','#5a5f48','casco',14],
 nina:['F',29,'#f0c9a0','#8a3a1a','#e8e2d0','gorro',17],
 mateo:['M',35,'#dca77e','#5a3a1a','#6a6248','carpeta',18]
};
const dark=(h,k)=>{const n=parseInt(h.slice(1),16),f=c=>Math.max(0,Math.round(c*k));return'#'+[n>>16,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('')};
function acc(x,k){const OL='#2a1a11';x.lineJoin='round';x.lineCap='round';const st=(w)=>{x.strokeStyle=OL;x.lineWidth=w||2.2;x.stroke()};
 switch(k){
  case'pajarita':x.fillStyle='#b8242e';x.beginPath();x.moveTo(90,150);x.lineTo(74,141);x.lineTo(74,159);x.closePath();x.moveTo(90,150);x.lineTo(106,141);x.lineTo(106,159);x.closePath();x.fill();st(2);x.fillStyle='#7a141c';x.beginPath();x.arc(90,150,4.5,0,7);x.fill();st(1.6);
   x.fillStyle='rgba(30,140,90,.85)';x.beginPath();x.moveTo(48,52);x.quadraticCurveTo(90,30,132,52);x.lineTo(136,60);x.quadraticCurveTo(90,44,44,60);x.closePath();x.fill();st(2);break;
  case'llave':x.save();x.translate(140,148);x.rotate(-.75);x.fillStyle='#aab3ba';x.fillRect(-4,-30,8,44);x.beginPath();x.arc(0,-34,10,0,7);x.fill();x.strokeStyle=OL;x.lineWidth=2;x.strokeRect(-4,-30,8,44);x.beginPath();x.arc(0,-34,10,0,7);x.stroke();x.fillStyle='#3a3d32';x.fillRect(-4,-46,8,10);x.restore();break;
  case'gorra':x.fillStyle='#c4741c';x.beginPath();x.moveTo(50,58);x.quadraticCurveTo(90,22,130,58);x.lineTo(130,64);x.lineTo(50,64);x.closePath();x.fill();st(2.2);x.fillStyle='#8a4e10';x.beginPath();x.moveTo(50,62);x.quadraticCurveTo(90,70,146,66);x.lineTo(146,72);x.quadraticCurveTo(90,78,50,70);x.closePath();x.fill();st(2);x.fillStyle='#ffd877';x.fillRect(84,42,12,9);break;
  case'delantal':x.fillStyle='#efe6d0';x.beginPath();x.moveTo(62,150);x.lineTo(118,150);x.lineTo(124,190);x.lineTo(56,190);x.closePath();x.fill();st(2);x.strokeStyle='#efe6d0';x.lineWidth=5;x.beginPath();x.moveTo(66,150);x.lineTo(70,128);x.moveTo(114,150);x.lineTo(110,128);x.stroke();
   x.fillStyle='#d9a23a';x.fillRect(128,150,20,24);x.strokeStyle=OL;x.lineWidth=2;x.strokeRect(128,150,20,24);x.fillStyle='#fff6';x.fillRect(128,150,20,6);break;
  case'panuelo':x.fillStyle='#b8242e';x.beginPath();x.moveTo(46,66);x.quadraticCurveTo(90,14,134,66);x.quadraticCurveTo(90,52,46,66);x.closePath();x.fill();st(2.2);x.fillStyle='#f2d27a';for(let i=0;i<5;i++){x.beginPath();x.arc(60+i*15,48-Math.sin(i/4*Math.PI)*8,2.4,0,7);x.fill()}break;
  case'fonendo':x.strokeStyle='#2a2d33';x.lineWidth=3.2;x.beginPath();x.moveTo(70,128);x.quadraticCurveTo(66,160,84,168);x.moveTo(110,128);x.quadraticCurveTo(114,160,96,168);x.stroke();x.fillStyle='#aab3ba';x.beginPath();x.arc(90,170,6,0,7);x.fill();st(1.8);
   x.fillStyle='#d33';x.fillRect(118,154,14,4);x.fillRect(123,149,4,14);break;
  case'gafas':x.strokeStyle='#2a1a11';x.lineWidth=2.6;x.fillStyle='rgba(200,230,255,.22)';x.beginPath();x.arc(74,84,11,0,7);x.fill();x.stroke();x.beginPath();x.arc(106,84,11,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(85,84);x.lineTo(95,84);x.stroke();break;
  case'boina':x.fillStyle='#2f3f5a';x.beginPath();x.ellipse(84,50,46,16,-.12,0,7);x.fill();st(2.2);x.fillStyle='#d9a23a';x.beginPath();x.arc(112,50,5,0,7);x.fill();st(1.4);
   x.fillStyle='#d9a23a';x.beginPath();x.arc(118,162,6,0,7);x.fill();st(1.6);x.fillStyle='#b8242e';x.fillRect(114,148,8,8);break;
  case'estrella':x.fillStyle='#3f4c3a';x.beginPath();x.ellipse(86,50,46,16,-.1,0,7);x.fill();st(2.2);x.fillStyle='#f2c542';x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?3.6:8.5;x.lineTo(108+Math.cos(a)*r,48+Math.sin(a)*r)}x.closePath();x.fill();st(1.4);
   x.fillStyle='#f2c542';for(let i=0;i<3;i++)x.fillRect(112+i*7,150,5,10);break;
  case'oficial':x.fillStyle='#4a5638';x.beginPath();x.moveTo(52,58);x.quadraticCurveTo(90,26,128,58);x.lineTo(128,64);x.lineTo(52,64);x.closePath();x.fill();st(2.2);x.fillStyle='#1c1f18';x.beginPath();x.ellipse(90,66,42,6,0,0,7);x.fill();st(1.8);x.fillStyle='#f2c542';x.fillRect(84,48,12,8);
   x.fillStyle='#f2c542';x.fillRect(56,146,16,4);x.fillRect(108,146,16,4);break;
  case'cruz':x.fillStyle='#fff';x.beginPath();x.moveTo(54,60);x.quadraticCurveTo(90,30,126,60);x.lineTo(126,64);x.lineTo(54,64);x.closePath();x.fill();st(2);x.fillStyle='#d33';x.fillRect(86,40,8,18);x.fillRect(81,45,18,8);
   x.fillStyle='#d33';x.fillRect(116,152,14,4);x.fillRect(121,147,4,14);break;
  case'casco':x.fillStyle='#5a6248';x.beginPath();x.moveTo(44,66);x.quadraticCurveTo(46,24,90,22);x.quadraticCurveTo(134,24,136,66);x.closePath();x.fill();st(2.4);x.fillStyle='#454b36';x.fillRect(42,62,96,7);x.strokeStyle='#2a1a11';x.lineWidth=2;x.strokeRect(42,62,96,7);break;
  case'gorro':x.fillStyle='#fbf8ef';x.beginPath();x.moveTo(56,62);x.lineTo(56,40);x.arc(68,34,13,Math.PI,0);x.arc(90,26,15,Math.PI,0);x.arc(112,34,13,Math.PI,0);x.lineTo(124,62);x.closePath();x.fill();st(2.2);x.fillStyle='#e7e1cf';x.fillRect(56,54,68,9);break;
  case'carpeta':x.save();x.translate(132,160);x.rotate(.18);x.fillStyle='#8a6a3a';x.fillRect(-14,-20,28,36);x.strokeStyle=OL;x.lineWidth=2;x.strokeRect(-14,-20,28,36);x.fillStyle='#f4efe0';x.fillRect(-10,-14,20,26);x.fillStyle='#aab3ba';x.fillRect(-6,-23,12,6);
   x.fillStyle='#6a6f74';for(let i=0;i<4;i++)x.fillRect(-7,-9+i*6,14,1.6);x.restore();break}
}
const CACHE={};
window.npcFace=function(id){if(CACHE[id])return CACHE[id];const L=LOOK[id];if(!L||typeof window.paintFace!=='function')return null;
 try{const cv=document.createElement('canvas');cv.width=120;cv.height=126;const [sex,age,skin,hair,shirt,k,sid]=L;
  const p={id:sid,n:id,sex,age,prof:'',look:{skin,hair,shirt},mor:80,hp:100};const sv=[SUIT,SUITD];SUIT=shirt;SUITD=dark(shirt,.7);
  try{window.paintFace(cv,p)}finally{SUIT=sv[0];SUITD=sv[1]}
  const x=cv.getContext('2d');x.save();x.setTransform(cv.width/180,0,0,cv.height/190,0,0);acc(x,k);x.restore();
  return CACHE[id]=cv.toDataURL()}catch(e){return null}};
/* HTML del avatar (cae al círculo de color si algo falla) */
window.npcAv=function(id,n,big){const u=window.npcFace(id);if(!u)return `<span class="vl-av" style="background:${n.col}">${n.ic}</span>`;
 return `<span class="vl-av vl-face${big?' big':''}" style="border-color:${n.col}"><img src="${u}" alt=""></span>`};
const st=document.createElement('style');st.textContent=`.vl-av.vl-face{background:#14160f;overflow:hidden;padding:0;border-width:2px;border-style:solid}.vl-av.vl-face img{width:100%;height:100%;object-fit:cover;display:block}.vl-npc .vl-av.vl-face{width:54px;height:54px;border-radius:12px}`;document.head.appendChild(st);
})();
