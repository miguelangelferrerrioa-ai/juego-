/* ===== Dead Town · mejoras visuales por nivel (1-10) ===== */
(function(){
const K=NBK,{V,RV,line,vol,post,crate,sacks,wire,cyl,OLC,seg,wnd}=K;
const NO=new Set(['wall','gate','barricade','trap','road','bridge','turret']);
const TH={glassw:'ind',steelw:'ind',cement:'ind',sheetw:'ind',quarry:'ind',oilp:'ind',kiln:'ind',house:'home',farm:'farm',kitchen:'farm',silo:'farm',greenh:'farm',dock:'farm',well:'farm',cistern:'farm',
 barr:'mil',tower:'mil',mtower:'mil',bunker:'mil',gar:'mil',
 work:'ind',fact:'ind',saw:'ind',scrapy:'ind',smithy:'ind',mine:'ind',refin:'ind',chem:'ind',ammof:'ind',gen:'ind',pump:'ind',solar:'ind',wind:'ind',
 hosp:'med',pharm:'med',lab:'med',elab:'med'};
const FLAG={home:'#c9743a',farm:'#5da53f',mil:'#6c7a45',ind:'#d08a2e',med:'#e8eef0',civ:'#b43a2e',train:'#3f77a8'};
const accent=l=>l>=13?'#8be3ff':l>=10?'#ffd76a':l>=7?'#e0b84e':l>=4?'#b9c3cb':'#b5793a';
const dark=(c,col)=>col;
/* dibujo crudo anclado a una caja de profundidad */
const at=(c,u,v,z0,z1,fn)=>{seg(c,u-.18,v-.18,.36,.36,z0,z1);fn(V(u,v,z0))};
function lamp(c,u,v,l){const h=18,ac=accent(l);post(c,u,v,0,h,'#6a5a48');at(c,u,v,h,h+5,p=>{const x=p[0],y=p[1]-3;
 if(l>=10){c.fillStyle='rgba(255,215,106,.22)';c.beginPath();c.arc(x,y,9,0,7);c.fill()}
 c.fillStyle='rgba(255,226,138,.28)';c.beginPath();c.arc(x,y,6,0,7);c.fill();
 c.fillStyle='#ffe28a';c.beginPath();c.arc(x,y,2.8,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke();
 c.fillStyle=ac;c.fillRect(x-3.2,y-5.2,6.4,2.2);c.strokeRect(x-3.2,y-5.2,6.4,2.2)})}
function flag(c,u,v,h,col,l,em){post(c,u,v,0,h,'#d8d8d8');at(c,u,v,h-10,h+2,p=>{const x=p[0],y=p[1]-10;
 c.fillStyle=col;c.beginPath();c.moveTo(x+1,y);c.lineTo(x+15,y+2.5);c.lineTo(x+12.5,y+6.5);c.lineTo(x+15,y+10.5);c.lineTo(x+1,y+10);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.3;c.stroke();
 if(em){c.fillStyle=accent(l);c.beginPath();c.arc(x+7,y+5.2,2,0,7);c.fill()}
 c.fillStyle=accent(l);c.beginPath();c.arc(x,y-1,1.8,0,7);c.fill();c.stroke()})}
function barrel(c,u,v,col){at(c,u,v,0,10,p=>cyl(c,p[0],p[1],4.6,8,col,{bands:1}))}
function planter(c,u,v,col,flowers){vol(c,{x:u,y:v,w:.42,h:.24,z:4,col:'#8a6a44',mat:'plank',seed:3});at(c,u+.21,v+.12,4,9,p=>{for(let i=0;i<3;i++){c.fillStyle=i==1?'#4f9a3a':'#3f7d34';c.beginPath();c.ellipse(p[0]-5+i*5,p[1]-6,3.6,3,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();if(flowers){c.fillStyle=col;c.beginPath();c.arc(p[0]-5+i*5,p[1]-8,1.4,0,7);c.fill()}}})}
function bench(c,u,v){vol(c,{x:u,y:v,w:.6,h:.18,z:4,z0:2,col:'#9a7a50',mat:'plank',seed:5});post(c,u+.05,v+.05,0,3,'#4a4038');post(c,u+.55,v+.05,0,3,'#4a4038')}
function cross(c,u,v,z){at(c,u,v,z,z+6,p=>{c.fillStyle='#d23a3a';c.fillRect(p[0]-1,p[1]-6,2,6);c.fillRect(p[0]-3,p[1]-4,6,2)})}
/* props por tema */
function prop(c,th,k,l,pw,ph){
 const ex=pw+.22,fy=ph+.28,ey=Math.min(ph-.5,ph*.5+.22);
 if(k==5){ // lado este
  if(th=='home'){planter(c,ex-.2,ey,'#ff9ad0',1);planter(c,ex-.2,ey+.4,'#ffd24a',1)}
  else if(th=='farm'){crate(c,ex-.15,ey,0,.34,'#b98a4e');crate(c,ex+.2,ey,0,.3,'#9ab13e');crate(c,ex+.02,ey,5,.3,'#e0873a')}
  else if(th=='mil'){sacks(c,ex-.15,ey,3,0);sacks(c,ex-.03,ey+.2,2,5)}
  else if(th=='ind'){barrel(c,ex,ey,'#b33');barrel(c,ex+.04,ey+.32,'#3f77a8');barrel(c,ex+.34,ey+.12,'#6a6a62')}
  else if(th=='med'){crate(c,ex-.1,ey,0,.36,'#e8eef0');cross(c,ex+.08,ey+.18,0);crate(c,ex+.28,ey+.1,0,.28,'#cfd9de')}
  else {bench(c,ex-.05,ey);bench(c,ex-.05,ey+.4)}
 } else if(k==7){ // delante izquierda
  if(th=='home'){bench(c,.1,fy+.05)}
  else if(th=='farm'){barrel(c,.25,fy+.1,'#8a6a48');barrel(c,.6,fy+.2,'#8a6a48')}
  else if(th=='mil'){wire(c,V(.05,fy+.15,6),V(Math.min(1.2,pw*.5),fy+.15,6),6);post(c,.05,fy+.15,0,9,'#4a4038');post(c,Math.min(1.2,pw*.5),fy+.15,0,9,'#4a4038')}
  else if(th=='ind'){crate(c,.1,fy,0,.36,'#8a8e94');crate(c,.5,fy+.05,0,.3,'#b98a4e')}
  else if(th=='med'){planter(c,.1,fy,'#fff',1);planter(c,.6,fy,'#9fd0ff',1)}
  else{planter(c,.1,fy,'#ffd24a',1);planter(c,.6,fy,'#ff7a7a',1)}
 } else if(k==9){ // delante derecha
  if(th=='home'){planter(c,pw-.8,fy,'#ff7a7a',1);planter(c,pw-.35,fy,'#fff',1)}
  else if(th=='farm'){sacks(c,pw-1.0,fy+.1,3,0);sacks(c,pw-.85,fy+.3,2,5)}
  else if(th=='mil'){const h=26;post(c,pw-.15,fy+.1,0,h,'#4a4038');at(c,pw-.15,fy+.1,h-4,h+4,p=>{const x=p[0],y=p[1]-4;c.fillStyle='rgba(255,240,170,.16)';c.beginPath();c.moveTo(x,y);c.lineTo(x+22,y+16);c.lineTo(x+4,y+22);c.closePath();c.fill();c.fillStyle='#d8d8d8';c.fillRect(x-4,y-5,8,6);c.strokeStyle=OLC;c.lineWidth=1.2;c.strokeRect(x-4,y-5,8,6);c.fillStyle='#fff3b0';c.fillRect(x-1.5,y-3,3,3)})}
  else if(th=='ind'){barrel(c,pw-.2,fy+.05,'#d08a2e');barrel(c,pw-.55,fy+.15,'#b33')}
  else if(th=='med'){at(c,pw-.3,fy+.1,0,12,p=>{for(let i=0;i<2;i++)cyl(c,p[0]+i*8,p[1]+i*2,3,10,i?'#4f9a3a':'#cfd3d4',{bands:1})})}
  else{at(c,pw-.35,fy+.1,0,10,p=>{c.fillStyle='#8d8a80';c.beginPath();c.ellipse(p[0],p[1]-3,11,6,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.3;c.stroke();c.fillStyle='#5aa7d0';c.beginPath();c.ellipse(p[0],p[1]-5,8,4,0,0,7);c.fill();c.stroke()})}
 }
}
K.lvlDeco=function(c,b,t){
 if(NO.has(t))return;const l=Math.min(b.lvl||1,10);if(l<2)return;
 const pw=b.w,ph=b.h,th=TH[t]||(t.indexOf('tr_')==0?'train':'civ'),ac=accent(l),fc=FLAG[th];
 /* 3: bordillo de piedra */
 if(l>=3)vol(c,{x:-.06,y:ph+.03,w:pw+.12,h:.14,z:l>=10?2.6:2,col:l>=10?'#d8b04a':'#a9a396',mat:'block',seed:2});
 /* 4 y 7: anexos laterales que ensanchan el edificio */
 if(l>=4&&ph>=2){const wc=BT[t].c||'#8a8a80',hA=Math.min(1.1,ph*.42),roofc=l>=10?'#d8b04a':l>=7?'#7b8794':'#6a4a38';
  vol(c,{x:pw+.02,y:.28,w:.5,h:hA,z:11,col:wc,mat:'plank',seed:4,decR:(c,len,H)=>{wnd(c,len/2-4,-8,8,6,{lit:l>=7})},decL:(c,len,H)=>{if(len>10)wnd(c,len/2-4,-8,8,6,{})}});
  vol(c,{x:pw-.02,y:.22,w:.62,h:hA+.12,z:2.6,z0:11,col:roofc,mat:'plank',seed:8});
  if(l>=7){vol(c,{x:pw+.02,y:.28+hA+.06,w:.5,h:.6,z:15,col:wc,mat:'plank',seed:5,decR:(c,len,H)=>{wnd(c,len/2-4,-10,8,6,{lit:true})}});
   vol(c,{x:pw-.02,y:.22+hA+.06,w:.62,h:.72,z:2.6,z0:15,col:roofc,mat:'plank',seed:9})}}
 /* 6: sendero adoquinado */
 if(l>=6){vol(c,{x:pw/2-.42,y:ph+.17,w:.84,h:.55,z:1,col:l>=10?'#cdbb8a':'#a8a091',mat:'block',seed:6})}
 /* 8: valla baja con hueco central */
 if(l>=8){const n=Math.max(2,Math.floor(pw/.55));for(let i=0;i<=n;i++){const u=.05+i*(pw-.1)/n;if(Math.abs(u-pw/2)<.55)continue;post(c,u,ph+.74,0,8,l>=10?'#d8b04a':'#7a5a3a')}
  const g=pw/2-.55;if(g>.15){line(c,V(.05,ph+.74,6),V(g,ph+.74,6),'#8a6a44',1.6);line(c,V(pw/2+.55,ph+.74,6),V(pw-.05,ph+.74,6),'#8a6a44',1.6)}}
 /* 2: farolas */
 lamp(c,-.08,ph+.1,l);lamp(c,pw+.08,ph+.1,l);
 /* 4: bandera */
 if(l>=4){const fh=Math.max(34,Math.min(78,(BT[t].z||20)+16));flag(c,pw+.14,.2,fh,fc,l,l>=6);if(l>=9)flag(c,-.1,ph+.1,Math.round(fh*.8),fc,l,1)}
 
 /* 5,7,9: objetos temáticos */
 if(l>=5)prop(c,th,5,l,pw,ph);if(l>=7)prop(c,th,7,l,pw,ph);if(l>=9)prop(c,th,9,l,pw,ph);
 /* 10: placa dorada con estrella */
 if(l>=10)at(c,pw/2,ph+.45,1,6,p=>{const x=p[0],y=p[1]-1.5;c.fillStyle='rgba(255,215,106,.3)';c.beginPath();c.ellipse(x,y,12,6,0,0,7);c.fill();c.fillStyle='#ffd76a';c.strokeStyle=OLC;c.lineWidth=1.2;c.beginPath();for(let i=0;i<10;i++){const a=-1.5708+i*.6283,r=i%2?2.4:5.2;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.6)}c.closePath();c.fill();c.stroke()});
};
})();
