/* ===== Dead Town · etapas de construcción: campamento (nv 1-2) → chabola de chapa (nv 3-4) → diseño completo (nv 5+) ===== */
(function(){
const K=NBK,{V,line,vol,post,crate,sacks,wire,cyl,OLC,seg,wnd,dor,patch,chimney,gableY,plateX}=K;
const STAGED=new Set(['house','hosp','barr','farm','hall','store','work','expo','fact','gen','lab','saw','kitchen','smithy','pharm','chem','ammof','elab','radio','market','refin']);
const TH={house:'home',farm:'farm',kitchen:'farm',barr:'mil',work:'ind',fact:'ind',saw:'ind',scrapy:'ind',smithy:'ind',refin:'ind',chem:'ind',ammof:'ind',gen:'ind',hosp:'med',pharm:'med',lab:'med',elab:'med'};
const hx=s=>[1,3,5].map(i=>parseInt(s.substr(i,2),16));
const mc=(a,b,t)=>{const x=hx(a),y=hx(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const palc=(t,b)=>{const a=window.PAL&&PAL[t];return a?a[Math.min(b.cl||0,a.length-1)][1]:BT[t].c};
const dirt=(c,pw,ph,col)=>vol(c,{x:-.08,y:-.08,w:pw+.16,h:ph+.16,z:1.6,col:col||'#6e5e44',mat:'block',seed:11});
function tent(c,x,y,w,h,col,o){o=o||{};const hh=o.rh||14,dk=mc(col,'#1c1a14',.28);
 gableY(c,{x,y,w,h,z:2,rh:hh,col,wallCol:dk,mat:'plaster',seed:(o.seed||3),oh:.05,rows:4,gable:(c,len,rh)=>{
  c.fillStyle=dk;c.fillRect(0,-rh,len,rh);
  c.fillStyle='#241a12';c.beginPath();c.moveTo(len/2,-rh+3.5);c.lineTo(len/2+len*.2,0);c.lineTo(len/2-len*.2,0);c.closePath();c.fill();
  c.strokeStyle='rgba(255,240,200,.55)';c.lineWidth=1;c.beginPath();c.moveTo(len/2,-rh+3.5);c.lineTo(len/2+len*.2,0);c.moveTo(len/2,-rh+3.5);c.lineTo(len/2-len*.2,0);c.stroke();
  if(o.cross){c.fillStyle='#fff';c.beginPath();c.arc(len/2,-rh*.66,4.6,0,7);c.fill();c.fillStyle='#d23a3a';c.fillRect(len/2-1.2,-rh*.66-3.6,2.4,7.2);c.fillRect(len/2-3.6,-rh*.66-1.2,7.2,2.4)}
  if(o.stripe){c.fillStyle=o.stripe;c.fillRect(0,-5,len,2.2)}}});
 const R=(a,b)=>line(c,a,b,'#d9d0ae',1);const fy=y+h+.04,ty=hh+2;
 R(V(x+w/2,fy,ty),V(x-.28,fy+.28,0));R(V(x+w/2,fy,ty),V(x+w+.28,fy+.28,0));
 for(const u of[x-.28,x+w+.28]){const p=V(u,fy+.28,0);c.fillStyle='#4a3a2a';c.fillRect(p[0]-1,p[1]-2,2,3)}}
function tarpShed(c,pw,ph,col,H){const t=Math.max(.15,.06);
 for(const[u,v]of[[.12,.15],[pw-.12,.15],[.12,ph-.15],[pw-.12,ph-.15]])post(c,u,v,0,H,'#5a4636');
 vol(c,{x:.02,y:.06,w:pw-.04,h:.14,z:H-2,z0:2,col:'#8a8f94',mat:'metal',seed:4});
 vol(c,{x:-.05,y:-.05,w:pw+.1,h:ph+.1,z:2.6,z0:H,col,mat:'plaster',seed:5})}
function flagP(c,u,v,h,col){post(c,u,v,0,h,'#d8d8d8');const p=V(u,v,h);c.fillStyle=col;c.beginPath();c.moveTo(p[0]+1,p[1]);c.lineTo(p[0]+14,p[1]+2.5);c.lineTo(p[0]+1,p[1]+9);c.closePath();c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}

/* ---- etapa A (nv 1-2): campamento ---- */
const A={
 house(c,b){const l=b.lvl,col=mc(palc('house',b),'#b9ae8c',.45),pw=b.w,ph=b.h;dirt(c,pw,ph);
  tent(c,.2,.12,pw-.4,ph-.5,col,{rh:15,seed:b.cl||1});
  if(l>=2){post(c,.2,ph-.3,0,12,'#6a4b2e');post(c,pw-.2,ph-.3,0,12,'#6a4b2e');vol(c,{x:.15,y:ph-.3,w:pw-.3,h:.3,z:2,col:'#8a6a44',mat:'plank',seed:2});}
  crate(c,pw-.55,ph+.02,0,.3,'#b98a4e');if(l>=2)sacks(c,.2,ph+.12,2,0);else{const p=V(.3,ph+.15,0);c.fillStyle='#8d4a2b';c.beginPath();c.ellipse(p[0],p[1]-2,6,3.5,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1.2;c.stroke()}},
 hosp(c,b){const l=b.lvl,pw=b.w,ph=b.h;dirt(c,pw,ph,'#7a7260');
  tent(c,.25,.12,pw-.5,ph-.6,'#e9eee8',{rh:22,cross:1,stripe:'#d23a3a',seed:2});
  if(l>=2)tent(c,.0,.4,.7,1.1,'#d9e3dc',{rh:10,cross:1,seed:4});
  crate(c,pw-.55,ph+.02,0,.34,'#e8eef0');crate(c,pw-.2,ph+.0,0,.28,'#cfd9de');
  K.vol(c,{x:.25,y:ph+.05,w:.7,h:.28,z:4,z0:2,col:'#7a8a96',mat:'metal',seed:3})},
 barr(c,b){const l=b.lvl,pw=b.w,ph=b.h;dirt(c,pw,ph);
  tent(c,.15,.1,1.25,ph-.5,'#6c7a45',{rh:16,seed:2});tent(c,1.6,.1,1.25,ph-.5,'#5e6a3c',{rh:16,seed:7});
  sacks(c,.2,ph+.0,3,0);sacks(c,pw-1.05,ph+.0,3,0);if(l>=2)flagP(c,pw/2,ph*.35,40,'#6c7a45')},
 farm(c,b){const l=b.lvl,pw=b.w,ph=b.h;
  vol(c,{x:-.05,y:-.05,w:pw+.1,h:ph+.1,z:2,col:'#5b3c25',mat:'block',seed:3});
  for(let i=0;i<3;i++)vol(c,{x:.2,y:.25+i*.78,w:pw-.4,h:.5,z:4,col:'#7a5634',mat:'plank',seed:8+i,topCol:'#4b321f'});
  for(let i=0;i<3;i++)for(let j=0;j<(l>=2?8:5);j++){const u=.4+j*(l>=2?.32:.5),v=.5+i*.78,p=V(u,v,4);K.seg(c,u-.1,v-.1,.2,.2,4,12);c.fillStyle=i==1?'#d6c354':'#5da53f';c.beginPath();c.ellipse(p[0],p[1]-3,3.4,2.6,0,0,7);c.fill();c.fillStyle=i==1?'#e9d77a':'#88c957';c.beginPath();c.ellipse(p[0],p[1]-5,2.6,2.3,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke()}
  tent(c,pw-.95,ph-.7,.8,.65,'#9a8a6a',{rh:9,seed:5});
  for(let i=0;i<=4;i++)post(c,.05+i*(pw-.1)/4,ph+.02,0,8,'#6a4b2e');
  const p=V(.2,ph+.02,0);cyl(c,p[0]-4,p[1]-1,4.6,7,'#8a6a48',{bands:1})},
};
/* ---- etapa A genérica: contenedores y lona ---- */
function cont(c,x,y,w,h,z,z0,col){const dk=mc(col,'#1c1a14',.3);
 vol(c,{x,y,w,h,z,z0,col,mat:'metal',seed:(x*7+y*3+z0)|0,
  decL:(c,len,H)=>{c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;for(let X=4;X<len;X+=5){c.beginPath();c.moveTo(X,-H+1);c.lineTo(X,-1);c.stroke()}if(len>26){c.fillStyle=dk;c.fillRect(len-12,-H+3,9,H-6);c.strokeStyle=OLC;c.lineWidth=1;c.strokeRect(len-12,-H+3,9,H-6)}},
  decR:(c,len,H)=>{c.fillStyle=dk;c.fillRect(3,-H+3,len-6,H-6);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;c.beginPath();c.moveTo(len/2,-H+3);c.lineTo(len/2,-3);c.stroke();c.strokeStyle=OLC;c.strokeRect(3,-H+3,len-6,H-6)}})}
function genA(c,b,t){const pw=b.w,ph=b.h,l=b.lvl,th=TH[t]||'civ',
 cc={ind:'#a0603a',farm:'#6f7a52',med:'#dfe6e3',mil:'#5f6b44',civ:'#4f6f86',home:'#8a6a4a'}[th],cc2={ind:'#4f6f86',farm:'#9a7a46',med:'#cfd6d8',mil:'#6c7a45',civ:'#a0603a',home:'#4f6f86'}[th],
 hA=Math.min(1.1,ph*.4),big=pw>=3&&ph>=3;
 dirt(c,pw,ph);
 cont(c,.15,.15,pw-.3,hA,16,2,cc);
 if(big||l>=2)cont(c,.15+ (big?0:0),.15,pw-.3,hA,16,18,cc2);
 const y2=Math.min(ph-.6,.3+hA+.15);
 vol(c,{x:.2,y:y2,w:Math.max(.9,pw*.42),h:.7,z:3,z0:2,col:'#7a6a50',mat:'plank',seed:3});
 post(c,.25,y2+.65,0,13,'#5a4636');post(c,.2+Math.max(.9,pw*.42)-.05,y2+.65,0,13,'#5a4636');
 vol(c,{x:.12,y:y2-.04,w:Math.max(.9,pw*.42)+.1,h:.82,z:2,z0:13,col:th=='med'?'#e9eee8':'#8a8a6a',mat:'plaster',seed:6});
 if(th=='ind'){crate(c,pw-.7,y2+.1,2,.4,'#8a8e94');const p=V(pw-.3,y2+.6,2);cyl(c,p[0],p[1],5,9,'#b33',{bands:1})}
 else if(th=='civ'){line(c,V(pw*.8,.3,34),V(pw*.8,.3,58),'#cfd3d4',1.6);flagP(c,pw-.15,y2+.3,42,'#b43a2e');crate(c,pw-.8,y2+.2,2,.34,'#b98a4e')}
 else if(th=='farm'){crate(c,pw-.8,y2+.1,2,.34,'#b98a4e');sacks(c,pw-.9,y2+.5,3,2)}
 else if(th=='med'){crate(c,pw-.8,y2+.1,2,.36,'#e8eef0');K.seg(c,pw-.7,y2+.2,.3,.3,2,10);const p=V(pw-.65,y2+.3,10);c.fillStyle='#d23a3a';c.fillRect(p[0]-1,p[1]-5,2,6);c.fillRect(p[0]-3,p[1]-3,6,2)}
 sacks(c,.2,ph+.08,2,0)}
/* ---- etapa B (nv 3-4): chabola de chapa ---- */
function shack(c,b,t){const pw=b.w,ph=b.h,l=b.lvl,th=TH[t]||'civ',H=Math.max(14,Math.min(30,(BT[t].z||20)*.6)),
 wc={home:'#7f93a0',farm:'#8e7456',med:'#d9e0e0',mil:'#667455',ind:'#957b62',civ:'#8d9499'}[th],rc={home:'#8a5a46',farm:'#7a5a40',med:'#a9b3b8',mil:'#55604a',ind:'#6c635a',civ:'#6e7a84'}[th];
 vol(c,{x:-.08,y:-.08,w:pw+.16,h:ph+.16,z:2.4,col:'#8e887c',mat:'block',seed:1});
 vol(c,{x:.05,y:.05,w:pw-.1,h:ph-.1,z:H,z0:2.4,col:wc,mat:'metal',seed:b.cl||2,
  decL:(c,len,H2)=>{dor(c,len*.5-5,-10.5,10,10.5,{col:'#5a4636'});wnd(c,len*.14,-12,9,7,{t:'board',frame:'#5a4636'});wnd(c,len*.72,-12,9,7,{t:l>=4?'glass':'board',frame:'#5a4636'});patch(c,len*.3,-6,10,5,mc(wc,'#6a4a30',.5));if(th=='med'){c.fillStyle='#d23a3a';c.fillRect(len*.5+8,-14,3,9);c.fillRect(len*.5+5,-11,9,3)}},
  decR:(c,len,H2)=>{wnd(c,len*.3,-12,9,7,{t:'board',frame:'#5a4636'});patch(c,len*.6,-8,12,6,mc(wc,'#6a4a30',.4))}});
 gableY(c,{x:.0,y:.0,w:pw,h:ph,z:H+2.4,rh:Math.min(12,6+pw*2),col:rc,wallCol:wc,mat:'metal',seed:5,oh:.14,rows:8,tile:0,gable:(c,len,rh)=>{wnd(c,len/2-3,-rh+3,6,4,{t:'board'})}});
 chimney(c,pw*.7,ph*.25,H+8,10,'#7a7a72');
 {const p=V(pw*.7,ph*.25,H+16);}
 if(th=='ind'){const p=V(pw-.1,ph*.5,0);K.seg(c,pw-.3,ph*.5-.2,.5,.5,0,10);cyl(c,p[0]+8,p[1],4.6,8,'#b33',{bands:1})}
 else if(th=='civ'){line(c,V(pw*.2,ph*.25,H+14),V(pw*.2,ph*.25,H+40),'#cfd3d4',1.6);flagP(c,pw+.05,.1,H+26,'#b43a2e')}
 else if(th=='mil'){sacks(c,.2,ph+.08,3,0);sacks(c,pw-.8,ph+.08,3,0)}
 else if(th=='farm'){crate(c,pw+.05,ph*.5,0,.32,'#b98a4e');sacks(c,.2,ph+.08,2,0)}
 else if(th=='home'){crate(c,pw+.05,ph*.5,0,.3,'#b98a4e')}
 else sacks(c,.2,ph+.08,2,0)}
const B={farm(c,b){const l=b.lvl,pw=b.w,ph=b.h;
  vol(c,{x:-.05,y:-.05,w:pw+.1,h:ph+.1,z:2,col:'#5b3c25',mat:'block',seed:3});
  for(let i=0;i<3;i++)vol(c,{x:.2,y:.25+i*.7,w:pw-1.2,h:.5,z:5,col:'#7a5634',mat:'plank',seed:8+i,topCol:'#4b321f'});
  for(let i=0;i<3;i++)for(let j=0;j<6;j++){const u=.4+j*.33,v=.5+i*.7,p=V(u,v,5);K.seg(c,u-.1,v-.1,.2,.2,5,13);c.fillStyle=i==1?'#d6c354':'#5da53f';c.beginPath();c.ellipse(p[0]-2,p[1]-3,3.2,2.5,0,0,7);c.ellipse(p[0]+2,p[1]-3,3.2,2.5,0,0,7);c.fill();c.fillStyle=i==1?'#e9d77a':'#88c957';c.beginPath();c.ellipse(p[0],p[1]-5,3,2.6,0,0,7);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke()}
  vol(c,{x:pw-.95,y:.2,w:.85,h:1.1,z:14,z0:2,col:'#8e7456',mat:'metal',seed:4,decL:(c,len,H)=>{dor(c,len/2-4,-9,8,9,{col:'#5a4636'})}});
  gableY(c,{x:pw-.97,y:.18,w:.89,h:1.14,z:16,rh:7,col:'#6c635a',wallCol:'#8e7456',mat:'metal',seed:5,oh:.1,rows:6});
  for(let i=0;i<=5;i++)post(c,.05+i*(pw-.1)/5,ph+.02,0,9,'#6a4b2e');
  line(c,V(.05,ph+.02,6),V(pw-.05,ph+.02,6),'#8a6a44',1.6);
  const p=V(.3,ph+.2,0);K.seg(c,.1,ph+.1,.4,.3,0,10);cyl(c,p[0],p[1],4.6,8,'#8a6a48',{bands:1});
  sacks(c,pw-1.3,ph+.1,3,0)}};
K.stage=function(t,l){return STAGED.has(t)&&BT[t]?(l<=2?1:l<=4?2:3):3};
K.stagePaint=function(c,b,t){const s=K.stage(t,b.lvl);if(s==3)return false;if(s==1)(A[t]||((c,b)=>genA(c,b,t)))(c,b);else (B[t]||((c,b)=>shack(c,b,t)))(c,b);return true};
})();
