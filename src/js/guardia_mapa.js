/* ===== Dead Town · Villa Esperanza como mapa isométrico propio: pantalla de carga, edificios en los que se entra, tiempo de tu base en pausa ===== */
(function(){
const K=window.NBK,NBo=window.NB;if(!K||!NBo||!window.villaApi)return;
const {V,vol,crate,post,line,hip,gableY,flatRoof,wnd,dor,sign,chimney}=K;
const GW=46,GH=36,SC=1,OM=8;
const VBT=window._vbt;
const GCOL={wall:'#5f6f80',trim:'#d8b24a'};
Object.assign(VBT,{v_cuartel:{n:'Cuartel',w:7,h:5,z:50,c:'#5f6f80'},v_barracon:{n:'Barracones',w:5,h:4,z:30,c:'#6a7560'},v_intend:{n:'Intendencia',w:5,h:4,z:36,c:'#8a7a56'},v_enfer:{n:'Enfermería',w:4,h:3,z:34,c:'#dfe6e4'},v_comedor:{n:'Comedor',w:4,h:3,z:38,c:'#9a6a4a'}});
['v_cuartel','v_barracon','v_intend','v_enfer','v_comedor'].forEach(k=>Object.assign(VBT[k],{cost:{},lv:99,hp:1,f:''}));
NBo.v_cuartel={up:90,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:7.12,h:5.12,z:2,col:'#4a525c',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:7,h:5,z:44,z0:2,col:'#5f6f80',mat:'block',seed:11,
  decL:(c,len)=>{dor(c,len/2-9,-16,18,16,{col:'#2a323c',awning:'#3f6a8f'});sign(c,10,-40,len-20,11,'CUARTEL','#1b222a','#f2c542');wnd(c,10,-28,12,9,{lit:true,frame:'#d8b24a'});wnd(c,len-22,-28,12,9,{lit:true,frame:'#d8b24a'});c.fillStyle='#d8b24a';c.fillRect(0,-12,len,2)},
  decR:(c,len)=>{for(let i=0;i<4;i++)wnd(c,8+i*(len-26)/3,-28,10,9,{lit:i%2===0,frame:'#d8b24a'});c.fillStyle='#d8b24a';c.fillRect(0,-12,len,2)}});
 flatRoof(c,{x:0,y:0,w:7,h:5,z:46,col:'#3a444e'});
 post(c,3.5,2.5,2,70,'#c8c2b0');vol(c,{x:3.55,y:2.45,w:1.0,h:.12,z:12,z0:96,col:'#3f6a8f',mat:'block',seed:2});vol(c,{x:3.55,y:2.45,w:.4,h:.14,z:6,z0:99,col:'#f2c542',mat:'block',seed:3});
 crate(c,.3,5.1,2,.4,'#5a6350');crate(c,6.2,5.1,2,.4,'#4a5339')}};
NBo.v_barracon={up:70,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:5.12,h:4.12,z:2,col:'#5a5e52',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:5,h:4,z:24,z0:2,col:'#6a7560',mat:'plank',seed:12,
  decL:(c,len)=>{for(let i=0;i<3;i++)wnd(c,8+i*(len-24)/2,-17,10,7,{lit:i!==1,frame:'#d8d2b0'});dor(c,len/2-5,-11,10,11,{col:'#2f3a2a'});sign(c,6,-27,len-12,7,'BARRACONES','#2a3226','#e8d9a4')},
  decR:(c,len)=>{for(let i=0;i<4;i++)wnd(c,6+i*(len-22)/3,-17,9,7,{lit:i%2===1,frame:'#d8d2b0'})}});
 flatRoof(c,{x:0,y:0,w:5,h:4,z:26,col:'#4a5340'});vol(c,{x:.3,y:.3,w:.8,h:.2,z:5,z0:27,col:'#3f6a8f',mat:'block',seed:2})}};
NBo.v_intend={up:70,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:5.12,h:4.12,z:2,col:'#6f6a58',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:5,h:4,z:30,z0:2,col:'#8a7a56',mat:'plaster',seed:13,
  decL:(c,len)=>{dor(c,len/2-8,-13,16,13,{col:'#3a2e1a',awning:'#3f6a8f'});sign(c,6,-30,len-12,8,'INTENDENCIA','#2a2314','#f2e2a8');wnd(c,8,-20,11,8,{lit:true,frame:'#e8d9a4'});wnd(c,len-19,-20,11,8,{lit:true,frame:'#e8d9a4'})},
  decR:(c,len)=>{for(let i=0;i<3;i++)wnd(c,8+i*(len-26)/2,-19,10,8,{lit:i!==1,frame:'#e8d9a4'})}});
 hip(c,{x:0,y:0,w:5,h:4,z:32,rh:9,col:'#5a4a36',oh:.15});
 crate(c,.3,4.1,2,.4,'#8a6a44');crate(c,.85,4.1,2,.35,'#a07a4c');crate(c,4.1,4.1,2,.4,'#8a6a44')}};
NBo.v_enfer={up:70,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:4.12,h:3.12,z:2,col:'#a7aeb0',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:4,h:3,z:28,z0:2,col:'#e2e7e6',mat:'plaster',seed:6,
  decL:(c,len)=>{dor(c,len/2-7,-13,14,13,{col:'#dfeaea',awning:'#3f6a8f'});sign(c,4,-28,len-8,8,'ENFERMERÍA','#f6f6f0','#2f5a86');wnd(c,10,-20,10,7,{lit:true,frame:'#f4f4ee'});wnd(c,len-20,-20,10,7,{lit:true,frame:'#f4f4ee'})},
  decR:(c,len)=>{for(let i=0;i<3;i++)wnd(c,8+i*(len-24)/2,-20,9,7,{lit:i!==1,frame:'#f4f4ee'})}});
 flatRoof(c,{x:0,y:0,w:4,h:3,z:30,col:'#bfc4c4'});
 vol(c,{x:1.7,y:1.2,w:.6,h:.2,z:9,z0:31,col:'#2f6aa8',mat:'block',seed:2});vol(c,{x:1.9,y:1.2,w:.2,h:.2,z:9,z0:31,col:'#2f6aa8',mat:'block',seed:3})}};
NBo.v_comedor={up:70,paint(c,b){
 vol(c,{x:-.06,y:-.06,w:4.12,h:3.12,z:2,col:'#7a6a52',mat:'block',seed:1});
 vol(c,{x:0,y:0,w:4,h:3,z:32,z0:2,col:'#9a6a4a',mat:'plank',seed:9,
  decL:(c,len)=>{dor(c,len/2-6,-13,12,13,{col:'#3a2616',awning:'#3f6a8f'});sign(c,6,-31,len-12,9,'COMEDOR','#3a2616','#ffd877');wnd(c,10,-20,11,8,{lit:true,frame:'#e8d9a4'});wnd(c,len-21,-20,11,8,{lit:true,frame:'#e8d9a4'})},
  decR:(c,len)=>{for(let i=0;i<3;i++)wnd(c,8+i*(len-26)/2,-22,10,8,{lit:i!==2,frame:'#e8d9a4'})}});
 hip(c,{x:0,y:0,w:4,h:3,z:34,rh:10,col:'#4a3626',oh:.2});chimney(c,3.2,.4,34,52,'#7a4a32');
 crate(c,.3,3.1,2,.34,'#6a4a2a');crate(c,3.3,3.1,2,.34,'#6a4a2a')}};

/* ---------- datos del mapa ---------- */
const BL=[['barr1','v_barracon',3,1,5,4,0],['barr2','v_barracon',10,1,5,4,0],['cuartel','v_cuartel',19,1,7,5,0],['barr3','v_barracon',30,1,5,4,0],['barr4','v_barracon',37,1,5,4,0],['radio','v_radio',43,1,2,2,0],
 ['casa1','v_casa',2,7,3,3,0],['casa2','v_casa',6,7,3,3,1],['casa3','v_casa',10,7,3,3,2],['casa4','v_casa',14,7,3,3,3],['casa5','v_casa',30,7,3,3,1],['casa6','v_casa',34,7,3,3,2],['casa7','v_casa',38,7,3,3,3],['casa8','v_casa',42,7,3,3,0],
 ['tablon','v_tablon',27,9,2,1,0],
 ['intend','v_intend',2,14,5,4,0],['armeria','v_armeria',8,14,3,3,0],['enfer','v_enfer',2,20,4,3,0],['comedor','v_comedor',8,19,4,3,0],['almacen','v_almacen',36,14,5,4,0],['taller','v_almacen',36,20,5,4,0],
 ['casa9','v_casa',2,26,3,3,3],['casa10','v_casa',6,26,3,3,0],['casa11','v_casa',10,26,3,3,1],['casa12','v_casa',14,26,3,3,2],['casa13','v_casa',30,26,3,3,2],['casa14','v_casa',34,26,3,3,3],['casa15','v_casa',38,26,3,3,0],['casa16','v_casa',42,26,3,3,1],
 ['casa17','v_casa',2,31,3,3,1],['casa18','v_casa',6,31,3,3,2],['casa19','v_casa',38,31,3,3,3],['casa20','v_casa',42,31,3,3,0]];
const PLZ={x0:14,x1:31,y0:14,y1:22};
const TREES0=[[9,6.6,'t'],[18.4,8.5,'t'],[19.4,9.5,'r'],[28.6,7.5,'t'],[27.6,5.8,'t'],[1,12.5,'t'],[13.6,5.6,'t'],[20.6,24.5,'t'],[25.5,24.4,'t'],[16.5,25.0,'r'],[18.8,28,'t'],[26.6,28.2,'t'],[28.5,24.6,'t'],[13,23.8,'t'],[1,24.4,'t'],[44.4,24.4,'t'],[1,34,'t'],[44,34,'t'],[17,31.5,'t'],[28,31.5,'t'],[12,33,'r'],[34,33,'r'],[33.5,13.5,'t'],[34.4,18.8,'t'],[12.5,17.8,'t'],[44,13,'t'],[44,19,'r'],[1,18.6,'r'],[8,24,'t'],[40,24.5,'t'],[41.6,13,'t'],[5,5.6,'t'],[16,3.2,'t'],[28,3.4,'r'],[36,5.8,'t'],[16.6,20.2,'t'],[29,20.4,'r']];
const TREES=TREES0.filter(([x,y])=>!BL.some(b=>x>=b[2]&&x<b[2]+b[4]&&y>=b[3]&&y<b[3]+b[5]));
const NPC=[['valeria','cuartel',-1.6,.5,'#3f6a8f','F','Soldado'],['mateo','intend',2.4,.5,'#8a7a56','M','Cocinero'],['olmos','armeria',1.9,.5,'#5a6a4a','M','Mecánico'],['reyes','enfer',2,.5,'#d8e0de','F','Médico'],['soler','tablon',1.4,.5,'#3f6a8f','M','Soldado'],['nina','comedor',2,.5,'#9a6a4a','F','Cocinero']];
let VS=null,ov=null;
const door=b=>({x:b.x+b.w/2,y:b.y+b.h+.7});
const isPav=(i,j)=>(i>=PLZ.x0&&i<PLZ.x1&&j>=PLZ.y0&&j<PLZ.y1);
const isSt=(i,j)=>(i>=22&&i<24&&j>=6);
const isRoad=(i,j)=>(j>=11&&j<13&&(i<PLZ.x0||i>=PLZ.x1))||(j>=23&&j<25);
const hsh=(a,b)=>{let h=a*374761393+b*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967295};
/* ---------- suelo precalculado: pueblo en ruinas + anillo de yermo y bosque que se pierde en la niebla ---------- */
const distOut=(x,y)=>Math.max(-x,-y,x-(GW-1),y-(GH-1));
const outRoad=(x,y)=>(x===22||x===23)&&y>=GH;
function buildGround(){const OX=(GH+OM)*32+60,OY=-P(-OM,-OM)[1]+220,W=(GW+GH+2*OM)*32+120,H=(GW+GH+2*OM)*16+OY+80,cv=document.createElement('canvas');cv.width=Math.round(W*SC);cv.height=Math.round(H*SC);const x=cv.getContext('2d');x.scale(SC,SC);x.translate(OX,OY);
 const oB=window.biomeAt,oW=window.waterD;
 window.biomeAt=(i,j)=>{const d=distOut(i,j);if(d<=0)return'ruins';const n=nh(i*3+1,j*5+2);return d<3?(n<.55?'wasteland':'ruins'):(d<5?(n<.35?'wasteland':n<.7?'ruins':'forest'):'forest')};window.waterD=()=>0;
 try{
 const poly=(pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()};
 const tiles=[];for(let i=-OM;i<GW+OM;i++)for(let j=-OM;j<GH+OM;j++)tiles.push([i,j]);tiles.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[0]-b[0]);
 const fade=d=>Math.max(0,Math.min(1,(d-(OM-5))/5));
 tiles.forEach(([i,j])=>{const p=P(i,j),d=distOut(i,j),inside=d<=0;tile(x,p,i,j,false);
  if(inside||outRoad(i,j)){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),dd=P(i,j+1),r=hsh(i,j);let col=null;
   if(isPav(i,j))col=(i+j)%2?'#7d786d':'#74706a';else if(isSt(i,j)||outRoad(i,j))col=(i+j)%2?'#6b675f':'#645f58';else if(isRoad(i,j))col=r<.5?'#7a6648':'#725f43';
   if(col){poly([a,b,c,dd],col);x.strokeStyle='rgba(0,0,0,.16)';x.lineWidth=1;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.lineTo(c[0],c[1]);x.stroke();
    if(r>.55){x.strokeStyle='rgba(15,12,10,.7)';x.lineWidth=1;x.beginPath();let px=a[0]+(r*47)%30-15+32,py=a[1]+6+r*8;x.moveTo(px,py);x.lineTo(px+6,py+4);x.lineTo(px+4,py+9);x.lineTo(px+12,py+11);x.stroke()}
    if(r<.22){x.fillStyle='rgba(60,95,36,.55)';x.beginPath();x.ellipse(a[0]+(r*131)%36-8+16,a[1]+14,7+r*10,3,0,0,7);x.fill()}
    if(outRoad(i,j)&&(j%2===0)){x.strokeStyle='rgba(222,184,74,.55)';x.lineWidth=1.6;x.setLineDash([6,6]);x.beginPath();x.moveTo(a[0]-16,a[1]+8);x.lineTo(a[0]+16,a[1]+24);x.stroke();x.setLineDash([])}}
   else{const r2=hsh(i+9,j+4);if(r2<.35){x.fillStyle='rgba(18,14,10,.28)';x.beginPath();x.ellipse(a[0]+(r2*90)%30-6,a[1]+16+r2*6,6+r2*14,3+r2*4,0,0,7);x.fill()}if(r2>.8){x.strokeStyle='rgba(70,52,34,.5)';x.lineWidth=1.3;x.beginPath();x.moveTo(a[0]-10,a[1]+14);x.lineTo(a[0]+6,a[1]+22);x.stroke()}}}
  const w=1-Math.min(1,d/12)*.55;if(!inside){x.globalCompositeOperation='lighter';x.fillStyle='rgb('+Math.round(27*w)+','+Math.round(26*w)+','+Math.round(12*w)+')';dia(x,p);x.fill();x.globalCompositeOperation='source-over'}
  const f=fade(d);if(f>0){x.fillStyle='rgba(5,9,6,'+Math.min(1,f*1.05)+')';dia(x,p);x.fill()}});
 /* decoración exterior: árboles, rocas, coches abandonados y escombros */
 let wr=0;
 tiles.forEach(([i,j])=>{const d=distOut(i,j);if(d<=0)return;const f=fade(d),n=nh(i*3,j*5);
  if(outRoad(i,j)){if(d>3&&d<OM-2&&nh(i*7,j*13)>.78&&wr<4){wr++;wreckD(x,P(i,j),i+j)}return}
  if(d<2)return;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(outRoad(i+a,j+b))return;
  const bo=window.biomeAt(i,j),base=bo==='forest'?.2:Math.max(.2,.7-d*.08),th=base+(1-base)*Math.pow(Math.max(0,1-(d-2)/9),1.4);
  if(n<th)return;x.globalAlpha=1-f*.85;
  const k=(n<.72||d<6)?1:2;for(let q=0;q<k;q++){const ox=.15+nh(i+q*17,j*2)*.7,oy=.15+nh(i*2,j+q*23)*.7;obsSpr(x,{x:i+ox-.5,y:j+oy-.5,t:(n>.9&&q===0)?'s':'t'})}x.globalAlpha=1});
 }finally{window.biomeAt=oB;window.waterD=oW}
 return {cv,OX,OY,W,H}}
function buildWalls(){const W=[],T=[],tw=new Set(),key=(i,j)=>i+','+j;
 const corners=[[-2,-2],[GW,-2],[-2,GH],[GW,GH]];corners.forEach(([x,y])=>{T.push({type:'tower',x,y,w:2,h:2,lvl:4,hp:99999,rot:0,cl:0});for(let a=0;a<2;a++)for(let b=0;b<2;b++)tw.add(key(x+a,y+b))});
 const add=(i,j,t)=>{if(tw.has(key(i,j)))return;W.push({type:t||'wall',x:i,y:j,w:1,h:1,lvl:4,hp:99999,rot:0,cl:0})};
 for(let i=-1;i<=GW;i++){add(i,-1);if(i===22||i===23)add(i,GH,'gate');else add(i,GH)}
 for(let j=0;j<GH;j++){add(-1,j);add(GW,j)}
 const set=new Set([...W.map(w=>key(w.x,w.y)),...tw]);
 W.forEach(w=>{const q=(i,j)=>set.has(key(i,j))?1:0;w.mask=q(w.x-1,w.y)|(q(w.x+1,w.y)<<1)|(q(w.x,w.y-1)<<2)|(q(w.x,w.y+1)<<3)});
 return {W,T}}
function buildLayout(){const bl=BL.map(([k,t,x,y,w,h,cl])=>({key:k,type:t,x,y,w,h,lvl:1,hp:1,rot:0,cl:cl||0}));return bl}
/* ---------- camino ---------- */
function blocked(i,j){if(i<0||j<0||i>=GW||j>=GH)return true;return VS.grid[j*GW+i]}
function bfs(sx,sy,tx,ty){sx=Math.floor(sx);sy=Math.floor(sy);tx=Math.floor(tx);ty=Math.floor(ty);if(blocked(tx,ty)){let best=null,bd=99;for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(!blocked(tx+dx,ty+dy)&&Math.hypot(dx,dy)<bd){bd=Math.hypot(dx,dy);best=[tx+dx,ty+dy]}if(!best)return[];tx=best[0];ty=best[1]}
 const prev=new Map(),q=[[sx,sy]];prev.set(sy*GW+sx,-1);const D=[[1,0],[-1,0],[0,1],[0,-1]];
 while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)break;for(const[dx,dy]of D){const nx=x+dx,ny=y+dy;if(blocked(nx,ny)||prev.has(ny*GW+nx))continue;prev.set(ny*GW+nx,y*GW+x);q.push([nx,ny])}}
 if(!prev.has(ty*GW+tx))return[];const path=[];let c=ty*GW+tx;while(c!==-1){path.push([c%GW+.5,Math.floor(c/GW)+.5]);c=prev.get(c)}return path.reverse().slice(1)}
/* ---------- carga ---------- */
const TIPS=['La Guardia del Alba protege a los supervivientes.','Gana reputación con misiones y donaciones.','Con más rango, mejores precios y equipo.','Mientras estés aquí, el tiempo de tu base no avanza.'];
function loader(txt){let l=document.getElementById('vlLoad');if(!l){l=document.createElement('div');l.id='vlLoad';l.innerHTML='<div class="vl-ld"><div class="vl-ldt">VILLA ESPERANZA</div><div class="vl-ldp"><i id="vlLdBar"></i></div><div class="vl-ldm" id="vlLdMsg"></div><small id="vlLdTip"></small></div>';document.body.appendChild(l)}l.style.display='flex';l.style.opacity='1';l.querySelector('.vl-ldt').textContent='LA GUARDIA DEL ALBA';document.getElementById('vlLdMsg').textContent=txt;document.getElementById('vlLdTip').textContent=TIPS[Math.floor(Math.random()*TIPS.length)];document.getElementById('vlLdBar').style.width='4%';return l}
const prog=(p,m)=>{const b=document.getElementById('vlLdBar');if(b)b.style.width=Math.round(p*100)+'%';if(m)document.getElementById('vlLdMsg').textContent=m};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function hideLoader(){const l=document.getElementById('vlLoad');if(!l)return;l.style.opacity='0';setTimeout(()=>{l.style.display='none'},420)}
/* ---------- entrada ---------- */
let busy=false;
window.guardiaEnter=async function(){
 const A=villaApi,GA=window.guardiaApi;if(!GA.unlocked())return GA.lock();if(busy||VS)return;if(window.horde)return toast('No puedes salir de la base durante una horda.');
 busy=true;try{
 loader('Preparando el camino…');await wait(60);const t0=performance.now();
 Object.assign(BT,VBT);prog(.15,'Levantando las calles…');await wait(40);
 const G=vlTiles(buildGround());prog(.4,'Construyendo los edificios…');await wait(40);
 const bl=buildLayout(),WL=buildWalls(),grid=new Uint8Array(GW*GH);
 bl.forEach(b=>{for(let i=Math.floor(b.x);i<Math.ceil(b.x+b.w);i++)for(let j=Math.floor(b.y);j<Math.ceil(b.y+b.h);j++)if(i>=0&&j>=0&&i<GW&&j<GH)grid[j*GW+i]=1});
 grid[18*GW+22]=grid[18*GW+23]=grid[17*GW+22]=grid[17*GW+23]=1;
 TREES.forEach(([x,y])=>{const i=Math.floor(x),j=Math.floor(y);if(i>=0&&j>=0&&i<GW&&j<GH)grid[j*GW+i]=1});
 /* calienta las imágenes en caché */
 const tmp=document.createElement('canvas');tmp.width=300;tmp.height=300;const tc=tmp.getContext('2d');window.g=tc;
 let k=0;for(const b of bl){try{shB(tc,b);mir(tc,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb)})}catch(e){}prog(.4+.3*(++k/bl.length));await wait(25)}
 prog(.75,'Plantando árboles…');for(const[x,y,t]of TREES){try{obsSpr(tc,{x:Math.floor(x),y:Math.floor(y),t})}catch(e){}}await wait(30);
 prog(.88,'Llegan los vecinos…');
 const me=S.ppl.find(p=>!p.away)||S.ppl[0];
 const npcs=NPC.map(([id,pl,du,dv,col,sex,prof],i)=>{const b=bl.find(q=>q.key===pl),d=door(b);return{id,pl,x:b.x+b.w/2+du,y:b.y+b.h+.55+dv*0,col,sex,prof,sid:900+i,skin:['#e8b88a','#d8a878','#c58c5e','#e0b080','#b87c52','#d8a070','#c99a6a'][i],hair:['#3a2a1a','#6a4a2a','#1a1410','#6a3a1a','#8a8a8a','#a0522d','#2a2a2a'][i],dx:1}});
 const CP=['Agricultor','Recolector','Cocinero','Mecánico','Constructor','Médico','Soldado'],CC=['#7a9a5a','#a8743a','#5a7aa8','#9a5a5a','#6a8a8a','#8a7aa8','#a89a5a','#5a8a7a'];
 const civ=[...Array(24)].map((_,i)=>({civ:1,x:PLZ.x0+2+Math.random()*(PLZ.x1-PLZ.x0-4),y:PLZ.y0+1+Math.random()*(PLZ.y1-PLZ.y0-2),tx:0,ty:0,col:CC[i%CC.length],sex:i%2?'F':'M',prof:CP[i%CP.length],sid:950+i,skin:['#e8b88a','#d8a878','#c58c5e','#e0b080','#b87c52'][i%5],hair:['#3a2a1a','#6a4a2a','#1a1410','#6a3a1a','#8a8a8a','#a0522d'][i%6],dx:1,wait:Math.random()*4}));
 const guards=[[21.2,GH-.9,1,0],[24.8,GH-.9,-1,0],[21.6,7.2,1,0],[25.6,7.2,-1,0]].concat([...Array(8)].map((_,i)=>[PLZ.x0+Math.random()*(PLZ.x1-PLZ.x0),PLZ.y0+Math.random()*(PLZ.y1-PLZ.y0),1,1])).map(([x,y,dx,pt],i)=>({x,y,col:i%3?'#3f6a8f':'#4a5a3a',sex:i%4===3?'F':'M',prof:'Soldado',sid:970+i,skin:['#d8a878','#e8b88a','#c58c5e'][i%3],hair:'#2a2a2a',dx,mv:0,gun:1,pt,wait:Math.random()*3,path:[]}));
 const zom=[[-4,8],[-5,24],[23,-4.5],[50,10],[49,28],[10,-5],[30,41],[8,40],[-3,34],[51,2],[40,-4],[52,20]].map(([x,y],i)=>({x,y,ax:x,ay:y,tx:x,ty:y,sid:990+i,dx:1,mv:0,wait:Math.random()*3}));
 VS={G,bl,WL,guards,zom,grid,npcs,civ,me:{x:23,y:GH-1.2,path:[],mv:0,dx:-1,pend:null},cam:{x:0,y:0,z:1},ph:0,open:false};
 await wait(Math.max(0,1100-(performance.now()-t0)));prog(1,'¡Listo!');await wait(120);
 window.VILLA=true;document.body.classList.add('vl-on');mount();hideLoader();
 A.refresh();GA.arrive();
 }finally{busy=false}};
function mount(){ov=document.createElement('div');ov.id='vlMap';ov.innerHTML='<canvas id="vlCv"></canvas><div class="vl-top"><button id="vlExit">← Volver a mi base</button><div class="vl-ttl">La Guardia del Alba</div><div class="vl-chips" id="vlChips"></div></div><div class="vl-hint">Toca un edificio o un vecino para ir a él · arrastra para mover la vista</div>';document.body.appendChild(ov);
 const cv=ov.querySelector('#vlCv');VS.cv=cv;document.getElementById('vlExit').onclick=window.guardiaExit;fit(true);bind(cv);VS.raf=requestAnimationFrame(loop)}
const HWr=(GW+GH+4*OM)*16,HHr=(GW+GH+4*OM)*8,CXr=(GW-GH)*16,CYr=(GW+GH)*8,LIM=.93;
const okPt=(x,y)=>Math.abs(x-CXr)/HWr+Math.abs(y-CYr)/HHr<=LIM;
const fitsV=(cx,cy,w,h,top)=>{const t=cy-h/2+top;return okPt(cx-w/2,t)&&okPt(cx+w/2,t)&&okPt(cx-w/2,cy+h/2)&&okPt(cx+w/2,cy+h/2)};
function fit(init){const cv=VS.cv,W=cv.clientWidth||innerWidth,H=cv.clientHeight||innerHeight,dpr=Math.min(1.5,devicePixelRatio||1)*(typeof QS==='number'?QS:1)/* con el ajuste automático de calidad del juego (QS) */ /* como en el pueblo: a 2× la GPU del móvil pintaba 1,8 veces más píxeles */;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}VS.W=W;VS.H=H;VS.dpr=dpr;
 if(init){const bw=(GW+GH)*32,bh=(GW+GH)*16+110,z=Math.min(1.5,Math.max(.5,Math.min(W/bw*1.25,(H-60)/bh*1.25)));VS.cam.z=z;const c=P(23,18);VS.cam.x=c[0]-W/2/z;VS.cam.y=c[1]-H/2/z+10}}
function clampCam(){const c=VS.cam,top=50;let w=VS.W/c.z,h=VS.H/c.z,g=0;while(!fitsV(CXr,CYr,w,h,top/c.z)&&g++<40){c.z*=1.04;w=VS.W/c.z;h=VS.H/c.z}
 let cx=c.x+w/2,cy=c.y+h/2;if(!fitsV(cx,cy,w,h,top/c.z)){let lo=0,hi=1;for(let i=0;i<16;i++){const m=(lo+hi)/2;if(fitsV(CXr+(cx-CXr)*m,CYr+(cy-CYr)*m,w,h,top/c.z))lo=m;else hi=m}cx=CXr+(cx-CXr)*lo;cy=CYr+(cy-CYr)*lo;c.x=cx-w/2;c.y=cy-h/2}}
/* ---------- entrada del usuario ---------- */
function bind(cv){const pts=new Map();let dr=null;
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const[a,b]=[...pts.values()];dr={pinch:1,d:Math.hypot(a[0]-b[0],a[1]-b[1])};return}VS.vel=null;dr={sx:e.clientX,sy:e.clientY,cx:VS.cam.x,cy:VS.cam.y,mv:0,lt:performance.now(),lx:e.clientX,ly:e.clientY,vx:0,vy:0}};
 cv.onpointermove=e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(!dr)return;if(dr.pinch){if(pts.size<2)return;const[a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);zoom(d/dr.d,(a[0]+b[0])/2,(a[1]+b[1])/2);dr.d=d;return}
  const dx=e.clientX-dr.sx,dy=e.clientY-dr.sy;if(Math.hypot(dx,dy)>6)dr.mv=1;if(dr.mv){const n=performance.now(),k=Math.max(1,n-dr.lt);dr.vx=.6*dr.vx+.4*(e.clientX-dr.lx)/k;dr.vy=.6*dr.vy+.4*(e.clientY-dr.ly)/k;dr.lt=n;dr.lx=e.clientX;dr.ly=e.clientY;VS.cam.x=dr.cx-dx/VS.cam.z;VS.cam.y=dr.cy-dy/VS.cam.z;clampCam()}};
 cv.onpointerup=cv.onpointercancel=e=>{pts.delete(e.pointerId);if(!dr)return;if(dr.pinch){if(!pts.size)dr=null;return}if(!dr.mv)tap(e.clientX,e.clientY);else if(performance.now()-dr.lt<90&&Math.hypot(dr.vx,dr.vy)>.15)VS.vel={x:-dr.vx*1000/VS.cam.z,y:-dr.vy*1000/VS.cam.z};dr=null};
 cv.onwheel=e=>{e.preventDefault();zoom(e.deltaY<0?1.12:.89,e.clientX,e.clientY)}}
function zoom(k,cx,cy){const c=VS.cam,r=VS.cv.getBoundingClientRect(),sx=cx-r.left,sy=cy-r.top,wx=sx/c.z+c.x,wy=sy/c.z+c.y;c.z=Math.max(.45,Math.min(2.2,c.z*k));c.x=wx-sx/c.z;c.y=wy-sy/c.z;clampCam()}
const toGrid=(wx,wy)=>({x:(wx/32+wy/16)/2,y:(wy/16-wx/32)/2});
function tap(cx,cy){if(VS.open||document.getElementById('pan').style.display==='block')return;const r=VS.cv.getBoundingClientRect(),c=VS.cam,wx=(cx-r.left)/c.z+c.x,wy=(cy-r.top)/c.z+c.y;
 for(const n of VS.npcs){const q=P(n.x,n.y);if(Math.abs(q[0]-wx)<18&&wy>q[1]-50&&wy<q[1]+8)return goTo(n.pl)}
 const order=[...VS.bl].sort((a,b)=>(b.x+b.w+b.y+b.h)-(a.x+a.w+a.y+a.h));
 for(const b of order){const z=VBT[b.type].z;for(const f of[1,.75,.5,.25,0]){const g=toGrid(wx,wy+z*f);if(g.x>=b.x&&g.x<b.x+b.w&&g.y>=b.y&&g.y<b.y+b.h)return goTo(b.key)}}
 }
function goTo(key){if(!PLACE[key]){const b0=VS.bl.find(q=>q.key===key);toast(b0&&b0.type==='v_casa'?'Un hogar de la Guardia. La puerta está cerrada.':b0&&b0.type==='v_almacen'?'Almacén y taller de la Guardia. Solo entra el personal autorizado.':b0&&b0.type==='v_barracon'?'Barracones: aquí duermen los soldados.':'La emisora de la Guardia repite un mensaje de esperanza.');return}enter(key)}
function enter(key){VS.me.pend=null;VS.me.mv=0;VS.open=true;guardiaGo(PLACE[key])}
const PLACE={cuartel:'cuartel',intend:'intend',armeria:'armeria',enfer:'enfer',tablon:'tablon',comedor:'comedor'};
/* ---------- salida ---------- */
window.guardiaDbg=()=>VS;
window.guardiaExit=async function(){if(!VS||busy)return;busy=true;hide();cancelAnimationFrame(VS.raf);loader('Volviendo a tu base…');await wait(500);ov.remove();ov=null;VS=null;window.VILLA=false;document.body.classList.remove('vl-on');Object.keys(VBT).forEach(k=>delete BT[k]);try{save()}catch(e){}hideLoader();busy=false};
/* ---------- bucle y dibujo ---------- */
let last=performance.now(),chipTxt='';
function loop(now){if(!VS)return;VS.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(VS.open&&document.getElementById('pan').style.display!=='block')VS.open=false;
 /* con un menú abierto la villa se queda quieta (antes se seguía dibujando detrás del menú a todo ritmo) */const pOn=document.getElementById('pan').style.display==='block',t0=performance.now();if(!pOn||!VS.fz){update(dt);draw();VS.fz=pOn?1:0}window.__vlMs=(window.__vlMs||0)*.9+(performance.now()-t0)*.1;const A=villaApi,v=A.st(),t=`<span>🪙 ${Math.floor(v.f)}</span><span>⛽ ${Math.floor(S.res.gas||0)}</span>`;if(t!==chipTxt){chipTxt=t;document.getElementById('vlChips').innerHTML=t}}
function stepTo(e,path,sp,dt){if(!path.length){e.mv=0;return}const t=path[0],dx=t[0]-e.x,dy=t[1]-e.y,d=Math.hypot(dx,dy);if(d<.08){path.shift();return}e.dx=dx-dy;const s=Math.min(d,sp*dt);e.x+=dx/d*s;e.y+=dy/d*s;e.mv=1}
function update(dt){if(VS.vel){const c=VS.cam,v=VS.vel;c.x+=v.x*dt;c.y+=v.y*dt;clampCam();const f=Math.pow(.04,dt);v.x*=f;v.y*=f;if(Math.hypot(v.x,v.y)<8)VS.vel=null}VS.zom.forEach(z=>{if(z.path&&z.path.length){const t=z.path[0],dx=t[0]-z.x,dy=t[1]-z.y,d=Math.hypot(dx,dy);if(d<.06){z.path.shift();return}z.dx=dx-dy;const s=Math.min(d,.45*dt);z.x+=dx/d*s;z.y+=dy/d*s;z.mv=1;return}z.mv=0;z.wait-=dt;if(z.wait<=0){z.wait=3+Math.random()*5;z.path=[[z.ax+(Math.random()-.5)*2.6,z.ay+(Math.random()-.5)*2.6]]}});const p=VS.me;if(!VS.open&&p.path.length){const bb=p.pend&&VS.bl.find(q=>q.key===p.pend),dd=bb&&door(bb),rem=dd?Math.hypot(p.x-dd.x,p.y-dd.y):0;if(dd&&rem<1.4){p.path=[];p.mv=0;enter(p.pend)}else stepTo(p,p.path,rem>9?10:6.5,dt)}else if(!p.path.length){p.mv=0;if(p.pend)enter(p.pend)}
 const rtg=()=>{const r=Math.random();return r<.6?[PLZ.x0+Math.random()*(PLZ.x1-PLZ.x0),PLZ.y0+Math.random()*(PLZ.y1-PLZ.y0)]:r<.85?[2+Math.random()*42,11.5+Math.random()*1.2]:[22+Math.random()*1.5,6.5+Math.random()*28]};
 VS.civ.forEach(c=>{if(c.path&&c.path.length){stepTo(c,c.path,1.3,dt);return}c.mv=0;c.wait-=dt;if(c.wait<=0){c.wait=2+Math.random()*5;const t=rtg();c.path=bfs(c.x,c.y,t[0],t[1])}});
 VS.guards.forEach(g=>{if(!g.pt)return;if(g.path&&g.path.length){stepTo(g,g.path,1.1,dt);return}g.mv=0;g.wait-=dt;if(g.wait<=0){g.wait=3+Math.random()*6;const t=rtg();g.path=bfs(g.x,g.y,t[0],t[1])}})}
function vlLight(c,cv){if(window.PERF_NOBLEND)return;const t=S.dayT/600,W=cv.width,H=cv.height;let col=null,a=0,nf=0;if(t<.08){col='255,190,120';a=.5*(1-t/.08)}else if(t>=.62&&t<.8){col='255,150,90';a=.55*(t-.62)/.18}else if(t>=.8){const k=Math.min(1,(t-.8)/.1);col='70,85,150';a=.55+.2*k;nf=k}
 c.setTransform(1,0,0,1,0,0);if(col){c.globalCompositeOperation='multiply';c.globalAlpha=a;c.fillStyle='rgb('+col+')';c.fillRect(0,0,W,H);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
 if(nf>0||t>=.7){const f=Math.min(1,Math.max(nf,(t-.7)/.1)),z=VS.cam.z*VS.dpr;c.setTransform(z,0,0,z,-VS.cam.x*z,-VS.cam.y*z);c.globalCompositeOperation='lighter';VS.bl.forEach(b=>{const q=P(b.x+b.w/2,b.y+b.h/2),rr=34+b.w*12,fl=.85+Math.sin(T*5+b.x)*.08,zz=VBT[b.type].z*.4,g=c.createRadialGradient(q[0],q[1]-zz,2,q[0],q[1]-zz,rr);g.addColorStop(0,'rgba(255,190,90,'+.45*f*fl+')');g.addColorStop(1,'rgba(255,150,50,0)');c.fillStyle=g;c.fillRect(q[0]-rr,q[1]-zz-rr,rr*2,rr*2)});c.globalCompositeOperation='source-over'}
 c.setTransform(1,0,0,1,0,0)}
function labelPill(c,x,y,t,ic){c.save();c.font='bold 11px system-ui,sans-serif';const w=c.measureText(t).width+24;c.fillStyle='rgba(12,16,10,.78)';c.beginPath();c.roundRect(x-w/2,y-9,w,18,9);c.fill();c.strokeStyle='rgba(242,197,66,.7)';c.lineWidth=1;c.stroke();c.fillStyle='#ffe9a8';c.textAlign='center';c.textBaseline='middle';c.fillText((ic||'')+' '+t,x,y+.5);c.restore()}
function figOf(e){FL=0;EXP='';SXF=e.sex==='F'?1:0;OLDF=0;KIDF=0;WPN='';fig(e.x,e.y,e.col||'#6a7a4a',e.sex==='F'?.85:.9,e.mv,e.skin||'#e8b88a',0,e.dx,e.prof||'Recolector',0,e.sid||1,e.hair||'#3a2a1a',false,false)}
function draw(){fit(false);clampCam();const cv=VS.cv,c=cv.getContext('2d'),cam=VS.cam,z=cam.z*VS.dpr;c.setTransform(1,0,0,1,0,0);c.fillStyle='#050906';c.fillRect(0,0,cv.width,cv.height);
 c.setTransform(z,0,0,z,-cam.x*z,-cam.y*z);const G=VS.G;vlDrawG(c,G,cam,cv,z);window.g=c;
 const L=[],LS=[],LSx=(bx,e)=>LS.push([e[0],e[1],bx]),LD=(x,y,e)=>L.push([e[0],e[1],vlBx(x,y,14,56)]),LDb=(x,y,e)=>L.push([e[0],e[1],vlBx(x,y,50,130)]),LDf=(x,y,e)=>L.push([e[0],e[1],vlBx(x,y,22,62)]);
 VS.bl.forEach(b=>LSx(vlBxB(b),[b.x+b.w-1+b.y+b.h-1+.5,(c)=>{try{shB(c,b);mir(c,b,(cc,bb)=>{drawB(cc,bb);buildingPolish(cc,bb)})}catch(e){}}]));
VS.WL.W.forEach(w=>LSx(vlBx(w.x+.5,w.y+.5,34,72),[w.x+w.y+.5,(c)=>{try{wallDrawM(c,w.type,w.x,w.y,w.mask,4,0)}catch(e){}}]));
 VS.WL.T.forEach(b=>LSx(vlBxB(b),[b.x+b.w-1+b.y+b.h-1+.5,(c)=>{try{shB(c,b);mir(c,b,(cc,bb)=>{drawB(cc,bb);buildingPolish(cc,bb)})}catch(e){}}]));
 VS.zom.forEach(z=>LD(z.x,z.y,[z.x+z.y,(c)=>{FL=0;EXP='';SXF=0;OLDF=0;KIDF=0;ZV=0;WPN='';fig(z.x,z.y,'#5b4a36',1,z.mv,'#9bb27a',0,z.dx,'zom',0,z.sid)}]));
 VS.guards.forEach(n=>LD(n.x,n.y,[n.x+n.y,(c)=>{FL=0;EXP='';SXF=0;OLDF=0;KIDF=0;WPN='';fig(n.x,n.y,n.col,.95,0,n.skin,1,n.dx,'Soldado',0,n.sid,n.hair,true,false)}]));
 [[13.2,16],[31.8,16],[13.2,21],[31.8,21],[21,27.5],[25,27.5],[21,33],[25,33]].forEach(([x,y],bi)=>LDf(x,y,[x+y,(c)=>{const q=P(x,y);c.save();c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(q[0],q[1]+1,9,4,0,0,7);c.fill();c.fillStyle='#5a3a24';c.fillRect(q[0]-6,q[1]-15,12,15);c.fillStyle='#3a2616';c.fillRect(q[0]-6,q[1]-10,12,2);c.beginPath();c.ellipse(q[0],q[1]-15,6,2.5,0,0,7);c.fill();
  c.globalCompositeOperation='lighter';const fl=1+Math.sin(T*9+bi*2)*.2;const g2=c.createRadialGradient(q[0],q[1]-20,1,q[0],q[1]-20,34*fl);g2.addColorStop(0,'rgba(255,170,60,.5)');g2.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=g2;c.beginPath();c.arc(q[0],q[1]-20,34*fl,0,7);c.fill();c.globalCompositeOperation='source-over';
  c.fillStyle='#ff9a2a';c.beginPath();c.moveTo(q[0]-5,q[1]-15);c.quadraticCurveTo(q[0]-6+Math.sin(T*10+bi)*2,q[1]-28*fl,q[0],q[1]-34*fl);c.quadraticCurveTo(q[0]+6,q[1]-26,q[0]+5,q[1]-15);c.fill();c.fillStyle='#ffd36a';c.beginPath();c.moveTo(q[0]-3,q[1]-15);c.quadraticCurveTo(q[0],q[1]-26*fl,q[0]+3,q[1]-15);c.fill();c.restore()}]));
 [[20.4,34.2],[25.6,34.2],[17.5,6.6],[28.5,6.6]].forEach(([x,y])=>LSx(vlBx(x,y,30,40),[x+y,(c)=>{const q=P(x,y);c.save();c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(q[0],q[1]+3,22,7,0,0,7);c.fill();for(let r=0;r<2;r++)for(let k=0;k<4-r;k++){c.fillStyle=(k+r)%2?'#9a8660':'#a8946a';c.strokeStyle='#4a3a22';c.lineWidth=1;c.beginPath();c.roundRect(q[0]-20+k*10+r*5,q[1]-6-r*7,12,8,3);c.fill();c.stroke()}c.restore()}]));
 TREES.forEach(([x,y,t])=>LSx(vlBx(x,y,42,124),[x+y+.5,(c)=>{try{obsSpr(c,{x:Math.floor(x),y:Math.floor(y),t})}catch(e){}}]));
 /* asta de bandera central */
 LDb(22.5,18,[40.5,(c)=>{const q=P(22.5,18);c.save();c.fillStyle='#7d786d';c.beginPath();c.ellipse(q[0],q[1]+4,30,15,0,0,7);c.fill();c.fillStyle='#8a8478';c.beginPath();c.ellipse(q[0],q[1]+1,26,12,0,0,7);c.fill();c.strokeStyle='#c8c2b0';c.lineWidth=3;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]-96);c.stroke();c.fillStyle='#d8b24a';c.beginPath();c.arc(q[0],q[1]-97,3,0,7);c.fill();
  const t=T*3,w=46,h=28,y1=q[1]-92;c.fillStyle='#3f6a8f';c.strokeStyle='rgba(10,8,6,.85)';c.lineWidth=1;c.beginPath();c.moveTo(q[0]+1,y1);for(let i=0;i<=8;i++)c.lineTo(q[0]+1+w*i/8,y1+Math.sin(t+i*.8)*2.2);for(let i=8;i>=0;i--)c.lineTo(q[0]+1+w*i/8,y1+h+Math.sin(t+i*.8)*2.2);c.closePath();c.fill();c.stroke();
  const mx=q[0]+1+w*.5,my=y1+h*.5+Math.sin(t+3)*1.6;c.fillStyle='#f2c542';c.beginPath();c.arc(mx,my+4,7,Math.PI,0);c.fill();c.strokeStyle='#f2c542';c.lineWidth=1.6;for(let i=0;i<5;i++){const a=Math.PI+i*Math.PI/4;c.beginPath();c.moveTo(mx+Math.cos(a)*9,my+4+Math.sin(a)*9);c.lineTo(mx+Math.cos(a)*13,my+4+Math.sin(a)*13);c.stroke()}c.restore()}]);
 /* farolas */
 [[14,14.4],[31,14.4],[14,21.6],[31,21.6],[21,25.5],[25,25.5],[21,31],[25,31],[12,10.6],[34,10.6],[21,8.5],[25,8.5],[7,13],[40,13],[7,24],[40,24]].forEach(([x,y])=>LSx(vlBx(x,y,18,50),[x+y,(c)=>{const q=P(x,y);c.save();c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(q[0],q[1],7,3,0,0,7);c.fill();c.fillStyle='#3a3a3e';c.fillRect(q[0]-1.5,q[1]-38,3,38);c.fillStyle='#ffe28a';c.beginPath();c.arc(q[0],q[1]-40,4.5,0,7);c.fill();const g2=c.createRadialGradient(q[0],q[1]-40,2,q[0],q[1]-40,30);g2.addColorStop(0,'rgba(255,226,138,.28)');g2.addColorStop(1,'rgba(255,226,138,0)');c.fillStyle=g2;c.beginPath();c.arc(q[0],q[1]-40,30,0,7);c.fill();c.restore()}]));
 VS.npcs.forEach(n=>LD(n.x,n.y,[n.x+n.y,()=>figOf(n)]));VS.civ.forEach(n=>LD(n.x,n.y,[n.x+n.y,()=>figOf(n)]));
 const me=VS.me,mp=S.ppl.find(p=>!p.away)||S.ppl[0]||{};
 if(0)L.push([me.x+me.y,(c)=>{const q=P(me.x,me.y);c.save();c.strokeStyle='#ffd877';c.lineWidth=1.6;c.beginPath();c.ellipse(q[0],q[1]+1,11,5,0,0,7);c.stroke();c.restore();FL=0;EXP='';SXF=mp.sex==='F'?1:0;OLDF=0;KIDF=0;WPN='';fig(me.x,me.y,(mp.look&&mp.look.shirt)||(window.PC&&PC[mp.prof])||'#4a7a3a',.9,me.mv,(mp.look&&mp.look.skin)||0,0,me.dx,mp.prof||'Constructor',0,mp.id||1,(mp.look&&mp.look.hair),false,false)}]);
 vlScene(c,VS,L,LS,cam,cv,z);
 /* etiquetas */
 const icons={cuartel:'🛡',intend:'📦',armeria:'🔧',enfer:'⚕',tablon:'📋',comedor:'🍲'};
 VS.bl.forEach(b=>{if(!PLACE[b.key])return;const q=P(b.x+b.w/2,b.y+b.h/2),nm=VBT[b.type].n;labelPill(c,q[0],q[1]-VBT[b.type].z-22,nm,icons[b.key])});
 try{apoFX(c,cv)}catch(e){}try{advWeatherFX(c,cv)}catch(e){}try{vlLight(c,cv)}catch(e){}
 c.setTransform(z,0,0,z,-cam.x*z,-cam.y*z);
 VS.npcs.forEach(n=>{const q=P(n.x,n.y),N=window.villaNpc?villaNpc(n.id):null;if(N){const qq=villaApi.st().q[n.id];if(qq&&!qq.done){c.save();c.fillStyle='#ffd877';c.strokeStyle='#1a1410';c.lineWidth=2;c.font='bold 16px system-ui';c.textAlign='center';const bob=Math.sin(T*4+n.sid)*2;c.strokeText('!',q[0],q[1]-52+bob);c.fillText('!',q[0],q[1]-52+bob);c.restore()}}})}
})();
