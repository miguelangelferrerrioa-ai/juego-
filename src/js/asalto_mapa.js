/* ===== Dead Town · Asalto final en vista isométrica: tu ejército ataca los pueblos fortificados de Cuervos y Víboras ===== */
(function(){
const GW=52,GH=44,OM=8,SC=.75,CT=22,NX=GW+2*OM,NY=GH+2*OM;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const TORRE=new Proxy({},{get:(_,k)=>(...a)=>window.TORRE_IMPL[k](...a)});
let AS=null,ov=null,last=0;
const FAC={cuervos:{n:'Nido Negro',boss:'Mordaza',col:'#23232a',acc:'#c9c9d2',tint:'40,44,70',ES:1},consejo:{n:'Torre del Consejo',boss:'AEGIS',col:'#1d2630',acc:'#5ae6ff',tint:'18,46,70',ES:1,tech:1,single:1,wall:1.7,tw:1.4,say:'«Esa es la Torre del Consejo. Drones, centinelas y un sistema que no duerme. Si caemos aquí, caemos todos. ¡Adelante!»',endSay:['Albor','«Habéis tardado.»'],fin:r=>window.TORRE.finish(r)},viboras:{n:'Nido de Víboras',boss:'Madre Víbora',col:'#6a3f8f',acc:'#d39aef',tint:'70,40,90',ES:1.15}};
window._ASFAC=FAC;
function srng(s){return()=>((s=(s*16807)%2147483647)-1)/2147483646}
/* ---------- diseño del pueblo ---------- */
function layout(fk){if(FAC[fk].tech)return TORRE.layout(fk);const R=srng(FAC[fk].seed||(fk==='cuervos'?7:23)),bl=[],mk=(key,type,x,y,w,h,lvl)=>bl.push({key,type,x,y,w,h,lvl:lvl||3,hp:1,rot:0,cl:0});
 const SIZE={house:[2,2],barr:[3,3],farm:[3,3],well:[2,2],lab:[3,3],hall:[4,4]};
 const colsL=[2,8,14],colsR=[32,38,44];let n=0;
 [4,9,14,27,32,37].forEach((y0,ri)=>{[...colsL,...colsR].forEach((x0,ci)=>{const r=R();let t;if(ri===3)t='barr';else if(ri===0&&ci===1)t=fk==='viboras'?'lab':'barr';else if(ri===4&&ci%3===1)t='well';else if(r<(FAC[fk].farm??.12))t='farm';else if(r<(FAC[fk].farm??.12)+(FAC[fk].barr??.08))t='barr';else t='house';
  const [w,h]=SIZE[t];if(t==='house'&&R()<.45){mk('b'+(++n),'house',x0+.5,y0+.5,2,2,4);mk('b'+(++n),'house',x0+3.5,y0+1.5,2,2,3)}else mk('b'+(++n),t,x0+1,y0+1,w,h,t==='barr'?4:3)})});
 mk('hq','hall',24,5,4,4,5);mk('kh1','house',22,11,2,2,4);mk('kh2','house',28,11,2,2,4);
 return bl}
function walls(){const W=[],T=[],tw=new Set(),key=(i,j)=>i+','+j,twAt=(x,y,k)=>{T.push({key:k||'t'+T.length,type:'tower',x,y,w:2,h:2,lvl:5,hp:1,rot:0,cl:0,tow:1});for(let a=0;a<2;a++)for(let b=0;b<2;b++)tw.add(key(x+a,y+b))};
 [[0,0],[GW-2,0],[0,GH-2],[GW-2,GH-2],[25,0],[0,22],[GW-2,22],[22,GH-2],[28,GH-2],[10,GH-2],[40,GH-2],[20,2],[29,2],[20,15],[29,15]].forEach(([x,y])=>twAt(x,y));
 const add=(i,j,t)=>{if(tw.has(key(i,j)))return;W.push({type:t||'wall',x:i,y:j,w:1,h:1,lvl:5,hp:1,rot:0,cl:0})};
 for(let i=0;i<GW;i++){add(i,0);add(i,GH-1,(i===25||i===26)?'gate':'wall')}for(let j=1;j<GH-1;j++){add(0,j);add(GW-1,j)}
 for(let i=21;i<=30;i++){add(i,3);add(i,16,(i===25||i===26)?'gate':'wall')}for(let j=4;j<16;j++){add(21,j);add(30,j)}
 return {W,T}}
/* ---------- mundo ---------- */
function mkWorld(fk){const bl=layout(fk),WL=walls(),F=FAC[fk];const gridT=new Uint8Array(NX*NY);const wcell=new Map();
 const idx=(i,j)=>(j+OM)*NX+(i+OM);
 const inb=(i,j)=>i>=-OM&&j>=-OM&&i<GW+OM&&j<GH+OM;
 bl.forEach(b=>{for(let i=Math.floor(b.x);i<Math.ceil(b.x+b.w);i++)for(let j=Math.floor(b.y);j<Math.ceil(b.y+b.h);j++)if(inb(i,j))gridT[idx(i,j)]=1});
 const sc=Math.pow(F.ES,.5),mhpW=700*sc*(FAC[fk].wall||1);
 WL.W.forEach(w=>{gridT[idx(w.x,w.y)]=w.type==='gate'?3:2;w.hp=w.mhp=(w.type==='gate'?3200*sc:mhpW)*(AS&&AS.hpm||1);wcell.set(idx(w.x,w.y),w)});
 WL.T.forEach(t=>{for(let a=0;a<2;a++)for(let b=0;b<2;b++)gridT[idx(t.x+a,t.y+b)]=4;t.hp=t.mhp=2200*sc*(FAC[fk].tw||1)*(AS&&AS.hpm||1)});
 /* árboles fuera */
 return {fk,F,bl,WL,gridT,wcell,idx,inb}}
const solid=(W,i,j)=>{if(!W.inb(i,j))return 1;const v=W.gridT[W.idx(i,j)];return v===1||v===2||v===3||v===4}
function cellBlocksLOS(W,i,j){if(!W.inb(i,j))return 1;const v=W.gridT[W.idx(i,j)];return v===1||v===2||v===3}
function los(W,x1,y1,x2,y2,ign){const d=Math.hypot(x2-x1,y2-y1),n=Math.ceil(d/.35);for(let k=1;k<n;k++){const t=k/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,i=Math.floor(x),j=Math.floor(y);if(cellBlocksLOS(W,i,j)){const gi=ign&&ign(i,j);if(!gi)return false}}return true}
/* BFS por cuadrícula completa */
function flood(W,sx,sy){const dist=new Int16Array(NX*NY).fill(-1),prev=new Int32Array(NX*NY).fill(-1),q=[W.idx(Math.floor(sx),Math.floor(sy))];dist[q[0]]=0;let h=0;const D=[1,-1,NX,-NX];
 while(h<q.length){const c=q[h++];if(dist[c]>90)continue;const ci=c%NX,cj=(c/NX)|0;for(let k=0;k<4;k++){const nc=c+D[k];const ni=k===0?ci+1:k===1?ci-1:ci,nj=k===2?cj+1:k===3?cj-1:cj;if(ni<0||nj<0||ni>=NX||nj>=NY||dist[nc]>=0)continue;const v=W.gridT[nc];if(v===1||v===2||v===3||v===4)continue;dist[nc]=dist[c]+1;prev[nc]=c;q.push(nc)}}
 return {dist,prev}}
function pathTo(W,fl,tx,ty){let c=W.idx(Math.floor(tx),Math.floor(ty));if(fl.dist[c]<0)return null;const p=[];while(c>=0&&fl.prev[c]>=0){p.push([(c%NX)-OM+.5,((c/NX)|0)-OM+.5]);c=fl.prev[c]}return p.reverse()}
function nearestReach(W,fl,tx,ty){let b=-1,bd=1e9;for(let c=0;c<fl.dist.length;c++){if(fl.dist[c]<0)continue;const i=(c%NX)-OM+.5,j=((c/NX)|0)-OM+.5,d=(i-tx)*(i-tx)+(j-ty)*(j-ty);if(d<bd){bd=d;b=c}}return b<0?null:[(b%NX)-OM+.5,((b/NX)|0)-OM+.5]}
/* ---------- unidades ---------- */
function mkEnemies(W,fk){if(FAC[fk].tech)return TORRE.enemies(W,AS,rnd);const E=[],F=W.F,P0=AS.plan,cs=Math.pow(F.ES*AS.es,.8),band=fk,ed=P0.ed;
 const e=(k,x,y,boss)=>{const T={g:{hp:45,dmg:5,rng:6,rate:1.4,sp:1.6,gun:1,t:'b'},m:{hp:55,dmg:6.5,rng:1.15,rate:1,sp:1.9,gun:0,t:'k'},h:{hp:170,dmg:9,rng:1.2,rate:1,sp:1.4,gun:0,t:'k',big:1},b:{hp:2800,dmg:15,rng:5.5,rate:.85,sp:1.4,gun:1,t:'b',boss:1,big:1}}[k];
  const u=Object.assign({e:1,k,band,x,y,hx:x,hy:y,cd:rnd(0,1),guard:1,dx:1,mv:0,at:0,sd:1+Math.floor(Math.random()*90),path:[],pt:0,hpP:0},T);u.hp=u.mhp=T.hp*ed*Math.pow(F.ES*AS.es,.95);u.dmg*=ed*Math.pow(F.ES*AS.es,.45);if(boss){u.bn=F.boss}E.push(u);return u};
 const ring=(cx,cy,n,rad,kk)=>{for(let i=0;i<n;i++){const a=i/n*6.283;e(kk[i%kk.length],cx+Math.cos(a)*rad,cy+Math.sin(a)*rad*.8)}};
 const nG=Math.round(5*cs*(AS.plan.gate||1));
 for(let i=0;i<nG;i++)e(i%3?'g':'m',rnd(21,31),rnd(GH-8,GH-3));
 W.bl.filter(b=>b.type==='barr').forEach(b=>{const n=Math.max(2,Math.round(2*cs));for(let i=0;i<n;i++)e(i%2?'g':'m',b.x+rnd(0,b.w),b.y+b.h+rnd(.6,1.6))});
 for(let i=0;i<Math.round(5*cs);i++)e(i%5===0?'h':i%2?'g':'m',rnd(24,28),rnd(18,40));
 for(let i=0;i<Math.round(5*cs);i++)e(i%3?'g':'m',rnd(2,GW-2),rnd(21,26));
 for(let i=0;i<Math.round(6*cs);i++)e(i%4===0?'h':'g',rnd(22,29),rnd(4,15));
 const b1=e('b',25.5,11.5,1);
 /* torretas: dos artilleros por torre */
 W.WL.T.forEach(t=>{const u=Object.assign({e:1,tow:1,tr:t,band,x:t.x+1,y:t.y+1,hx:t.x+1,hy:t.y+1,hp:t.hp,mhp:t.mhp,dmg:7*ed*Math.pow(F.ES*AS.es,.45)*.55,rng:7.5,rate:1.5,cd:rnd(0,1),gun:1,dx:1,mv:0,at:0,sd:7,path:[],guard:0,sp:0});E.push(u)});
 return E}
function mkAllies(ctx){const U=[];const sc=ctx.crew;const ox=25,oy=GH+4.5;
 ctx.units.forEach((u,i)=>{const a=Object.assign({},u);a.x=ox+rnd(-5,5);a.y=oy+rnd(-1.5,2.5);a.rng=u.gun?Math.min(6.2,u.rng/CT):1.1;a.hp*=1.3;a.mhp*=1.3;a.sp=u.sp/CT*1.15;a.at=0;a.dx=-1;a.mv=0;a.path=[];a.pt=0;a.cd=rnd(0,1);a.a=1;U.push(a)});return U}
/* ---------- suelo ---------- */
function buildGround(W){const fk=W.fk,OX=(GH+OM)*32+60,OY=-P(-OM,-OM)[1]+220,Wd=(GW+GH+2*OM)*32+120,Ht=(GW+GH+2*OM)*16+OY+80,cv=document.createElement('canvas');cv.width=Math.round(Wd*SC);cv.height=Math.round(Ht*SC);const x=cv.getContext('2d');x.scale(SC,SC);x.translate(OX,OY);
 const oB=window.biomeAt,oW=window.waterD;const distOut=(i,j)=>Math.max(-i,-j,i-(GW-1),j-(GH-1));
 const isSt=(i,j)=>(i>=24&&i<28&&j>=17)||(j>=22&&j<25)||(i>=24&&i<28&&j<GH+OM&&j>=GH-1);
 const hsh=(a,b)=>{let h=a*374761393+b*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967295};
 window.biomeAt=(i,j)=>{if(FAC[fk].tech)return'ruins';const d=distOut(i,j);if(d<=0)return'ruins';const n=nh(i*3+1,j*5+2);return d<3?(n<.55?'wasteland':'ruins'):(d<5?(n<.35?'wasteland':n<.7?'ruins':'forest'):'forest')};window.waterD=()=>0;
 try{const poly=(pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()};
  const tiles=[];for(let i=-OM;i<GW+OM;i++)for(let j=-OM;j<GH+OM;j++)tiles.push([i,j]);tiles.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[0]-b[0]);const fade=d=>Math.max(0,Math.min(1,(d-(OM-5))/5));
  tiles.forEach(([i,j])=>{const p=P(i,j),d=distOut(i,j),inside=d<=0;tile(x,p,i,j,false);if(FAC[fk].tech&&!inside&&!isSt(i,j))TORRE.outTile(x,P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),i,j,d,hsh(i,j));
   if(inside||isSt(i,j)){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),dd=P(i,j+1),r=hsh(i,j);let col=null;
    if(FAC[fk].tech)col=TORRE.tileCol(i,j,isSt(i,j),r,fk);else if(isSt(i,j))col=(i+j)%2?'#6b655a':'#625c52';else col=r<.5?'#5a4a34':'#54442f';
    poly([a,b,c,dd],col);if(FAC[fk].tech)TORRE.tileFx(x,a,b,c,dd,i,j,isSt(i,j),r);else if(r>.6){x.strokeStyle='rgba(15,12,10,.6)';x.lineWidth=1;x.beginPath();x.moveTo(a[0]+10,a[1]+8);x.lineTo(a[0]+18,a[1]+12);x.stroke()}
    if(r<.14){x.fillStyle='rgba(20,15,12,.35)';x.beginPath();x.ellipse(a[0]+14,a[1]+14,8,3,0,0,7);x.fill()}}
   const w=1-Math.min(1,d/12)*.55;if(!inside&&!FAC[fk].tech){x.globalCompositeOperation='lighter';x.fillStyle='rgb('+Math.round(27*w)+','+Math.round(26*w)+','+Math.round(12*w)+')';dia(x,p);x.fill();x.globalCompositeOperation='source-over'}
   const f=fade(d);if(f>0){x.fillStyle='rgba(5,9,6,'+Math.min(1,f*1.05)+')';dia(x,p);x.fill()}});
  tiles.forEach(([i,j])=>{const d=distOut(i,j);if(FAC[fk].tech){if(d>=1)TORRE.outObj(x,i,j,d,fade(d),isSt(i,j));return}if(d<=1||(i>=22&&i<30&&j>=GH-1))return;const f=fade(d),n=nh(i*3,j*5);const base=Math.max(.2,.7-d*.08),th=base+(1-base)*Math.pow(Math.max(0,1-(d-2)/9),1.4);if(n<th)return;x.globalAlpha=1-f*.85;try{obsSpr(x,{x:i+nh(i+9,j*2)*.6-.3,y:j+nh(i*2,j+23)*.6-.3,t:(n>.9)?'s':'t'})}catch(e){}x.globalAlpha=1});
  /* tinte de la banda */
  x.globalCompositeOperation='multiply';x.fillStyle='rgba('+FAC[fk].tint+',.35)';x.fillRect(-OX,-OY,Wd,Ht);x.globalCompositeOperation='source-over';
 }finally{window.biomeAt=oB;window.waterD=oW}
 return {cv,OX,OY,W:Wd,H:Ht}}
/* ---------- entrada ---------- */
window.asaltoIsoStart=async function(ctx){if(AS)return;const ld=document.createElement('div');ld.id='asLd';ld.style.cssText='position:fixed;inset:0;z-index:10001;background:#0b0907;color:#f2c542;display:flex;align-items:center;justify-content:center;font:900 22px system-ui;letter-spacing:.2em';ld.textContent='PREPARANDO EL ASALTO…';document.body.appendChild(ld);
 await new Promise(r=>setTimeout(r,60));
 AS={ctx,emp:2,plan:ctx.plan,es:ctx.es||1,hpm:1,fallen:[],cam:{x:0,y:0,z:1},t:0,sp:1,ex:ctx.plan.ex,cov:0,covCd:0,med:2,mode:null,rein:0,reinAt:-99,fx:[],tr:[],msg:[],shield:0,stage:0,over:0,tot:ctx.tot};
 try{await loadStage(ctx.fk||'cuervos');}finally{ld.remove()}
 window._asIso=1;mount()}
async function loadStage(fk){TORRE.setFk(fk);const W=mkWorld(fk);AS.W=W;AS.fk=fk;const t0=performance.now();Object.assign(BT,{});const G=buildGround(W);AS.G=G;
 if(!FAC[fk].tech){const tmp=document.createElement('canvas');tmp.width=300;tmp.height=300;const tc=tmp.getContext('2d');window.g=tc;for(const b of W.bl){try{shB(tc,b);mir(tc,b,(c,bb)=>{drawB(c,bb);buildingPolish(c,bb)})}catch(e){}}}
 AS.E=mkEnemies(W,fk);
 if(!AS.U)AS.U=mkAllies(AS.ctx);else{const sv=AS.U.filter(u=>u.hp>0);sv.forEach(u=>{u.hp=Math.min(u.mhp,u.hp+u.mhp*.4);u.x=25+rnd(-5,5);u.y=GH+4.5+rnd(-1.5,2.5);u.path=[];u.dx=-1});AS.U=sv}
 AS.bossDead=0;AS.t0=AS.t;AS.stage++;AS.fl=null;AS.tr=[];AS.fx=[];AS.dead=[];AS.siegeT=0;AS.siegeBreak=0;
 const c=AS.cam;AS.cam.z=.62;const q=P(25.5,GH-6);c.x=q[0]-(innerWidth)/2/.62;c.y=q[1]-innerHeight*.55/.62;
 AS.sayTxt=FAC[fk].say?FAC[fk].say:fk==='cuervos'?'«Ese es el Nido Negro. Derribad la puerta y entrad con todo. ¡Por el Alba!»':'«Las Víboras no van a rendirse. Pero tampoco nosotros. ¡Adelante!»';AS.intro={t:0,d:10.5,end:[c.x,c.y,.62]}}
function say(w,t){AS.msg.unshift({w,t,at:AS.t});if(AS.msg.length>4)AS.msg.pop()}
/* ---------- interfaz ---------- */
function mount(){ov=document.createElement('div');ov.id='asIso';ov.innerHTML='<canvas id="asIc"></canvas><div id="asItop"></div><div id="asIbar"></div><div id="asImsg"></div>';document.body.appendChild(ov);
 const st=document.createElement('style');st.id='asIsoCss';st.textContent='#asIso{position:fixed;inset:0;z-index:10000;background:#0b0907;touch-action:none}#asIc{position:absolute;inset:0;width:100%;height:100%;display:block}#asItop{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;gap:8px;padding:8px 10px;font:700 12px sans-serif;color:#e8c27a;text-shadow:0 1px 3px #000;background:linear-gradient(#0b0907e0,#0b090700);pointer-events:none}#asIbar{position:absolute;left:0;right:0;bottom:8px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}#asIbar button{padding:9px 13px;border-radius:9px;border:1px solid #6a5a3a;background:#2a2218ee;color:#f2d99a;font:700 12px sans-serif}#asIbar button.on{background:#7a5a18;color:#fff}#asIbar button:disabled{opacity:.4}#asImsg{position:absolute;left:10px;bottom:56px;display:flex;flex-direction:column-reverse;gap:3px;pointer-events:none;font:700 12px sans-serif}#asImsg div{background:#000a;color:#f2d99a;padding:3px 8px;border-radius:5px;max-width:80%}body.as-on #top,body.as-on #rail,body.as-on #bot,body.as-on #log,body.as-on #alert{display:none!important}';document.head.appendChild(st);document.body.classList.add('as-on');
 const cv=ov.querySelector('#asIc');AS.cv=cv;fit();bind(cv);last=performance.now();AS.raf=requestAnimationFrame(loop);ui()}
function fit(){const cv=AS.cv,W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}AS.Wd=W;AS.Ht=H;AS.dpr=dpr}
function clampCam(){const c=AS.cam,w=AS.Wd/c.z,h=AS.Ht/c.z,cx0=P(GW/2,GH/2),lim=.95;const hw=(GW+GH+2*OM)*16,hh=(GW+GH+2*OM)*8;c.x=clamp(c.x,cx0[0]-hw-w*.2,cx0[0]+hw-w*.8);c.y=clamp(c.y,cx0[1]-hh-h*.3,cx0[1]+hh-h*.7)}
function bind(cv){const pts=new Map();let dr=null;
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const[a,b]=[...pts.values()];dr={pinch:1,d:Math.hypot(a[0]-b[0],a[1]-b[1])};return}dr={sx:e.clientX,sy:e.clientY,cx:AS.cam.x,cy:AS.cam.y,mv:0}};
 cv.onpointermove=e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(!dr)return;if(dr.pinch){if(pts.size<2)return;const[a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);zoom(d/dr.d,(a[0]+b[0])/2,(a[1]+b[1])/2);dr.d=d;return}const dx=e.clientX-dr.sx,dy=e.clientY-dr.sy;if(Math.hypot(dx,dy)>6)dr.mv=1;if(dr.mv){AS.cam.x=dr.cx-dx/AS.cam.z;AS.cam.y=dr.cy-dy/AS.cam.z;clampCam()}};
 cv.onpointerup=cv.onpointercancel=e=>{pts.delete(e.pointerId);if(!dr)return;if(dr.pinch){if(!pts.size)dr=null;return}if(!dr.mv)tap(e.clientX,e.clientY);dr=null};
 cv.onwheel=e=>{e.preventDefault();zoom(e.deltaY<0?1.12:.89,e.clientX,e.clientY)}}
function zoom(k,cx,cy){const c=AS.cam,wx=cx/c.z+c.x,wy=cy/c.z+c.y;c.z=clamp(c.z*k,.45,2);c.x=wx-cx/c.z;c.y=wy-cy/c.z;clampCam()}
const toGrid=(wx,wy)=>({x:(wx/32+wy/16)/2,y:(wy/16-wx/32)/2});
function tap(cx,cy){if(!AS||AS.over||!AS.mode)return;const c=AS.cam,g=toGrid(cx/c.z+c.x,cy/c.z+c.y);if(AS.mode==='ex'&&AS.ex>0){boom(g.x,g.y);AS.ex--}else if(AS.mode==='med'&&AS.med>0){heal(g.x,g.y);AS.med--}else if(AS.mode==='emp'&&AS.emp>0){TORRE.emp(AS,g.x,g.y);AS.emp--}AS.mode=null;ui()}
function ui(){const b=ov.querySelector('#asIbar');b.innerHTML=`<button class="${AS.mode==='ex'?'on':''}" ${AS.ex>0?'':'disabled'} onclick="asaltoIsoMode('ex')">Explosivo ×${AS.ex}</button><button ${AS.covCd<=0&&AS.cov<=0?'':'disabled'} onclick="asaltoIsoCov()">Fuego de cobertura${AS.covCd>0?' ('+Math.ceil(AS.covCd)+')':''}</button><button class="${AS.mode==='med'?'on':''}" ${AS.med>0?'':'disabled'} onclick="asaltoIsoMode('med')">Botiquín ×${AS.med}</button>${FAC[AS.fk].tech?`<button class="${AS.mode==='emp'?'on':''}" ${AS.emp>0?'':'disabled'} onclick="asaltoIsoMode('emp')">Pulso EMP ×${AS.emp}</button>`:''}<button onclick="asaltoIsoSpd()">Velocidad ×${AS.sp}</button>`}
window.asaltoIsoMode=m=>{AS.mode=AS.mode===m?null:m;ui()};window.asaltoIsoSpd=()=>{AS.sp=AS.sp===1?2:1;ui()};window.asaltoIsoCov=()=>{if(AS.covCd>0||AS.cov>0)return;AS.cov=8;AS.covCd=26;say('Valeria','«¡Fuego de cobertura!»');ui()};
function hurt(e,d){if(e.sh>0){const a=Math.min(e.sh,d);e.sh-=a;d-=a;e.shT=3.5}e.hp-=d}
function dmgWall(w,d){if(!w||w.hp<=0)return;w.hp-=d;if(w.hp<=0)breakWall(w)}
function breakWall(w){const W=AS.W;W.gridT[W.idx(w.x,w.y)]=0;W.wcell.delete(W.idx(w.x,w.y));W.WL.W=W.WL.W.filter(q=>q!==w);AS.fx.push({k:'rub',x:w.x+.5,y:w.y+.5,t:0});AS.W.WL.W.forEach(q=>{const s=(i,j)=>W.gridT[W.idx(i,j)]===2||W.gridT[W.idx(i,j)]===3||W.gridT[W.idx(i,j)]===4?1:0;q.mask=s(q.x-1,q.y)|(s(q.x+1,q.y)<<1)|(s(q.x,q.y-1)<<2)|(s(q.x,q.y+1)<<3)});AS.fl=null;if(w.type==='gate'&&!AS.gateOpen){AS.gateOpen=1;say('Valeria','«¡La puerta ha caído! ¡Adentro!»')}}
function boom(x,y){AS.fx.push({k:'ex',x,y,t:0});AS.shake=Math.max(AS.shake||0,.55);AS.E.forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<3.2)hurt(e,e.boss?120:e.tow?260:170)});for(let i=Math.floor(x-2);i<=Math.ceil(x+2);i++)for(let j=Math.floor(y-2);j<=Math.ceil(y+2);j++){const w=AS.W.wcell.get(AS.W.idx(i,j));if(w&&Math.hypot(w.x+.5-x,w.y+.5-y)<2.2)dmgWall(w,w.type==='gate'?900:520)}try{window.sfx&&sfx('boom')}catch(e){}}
function heal(x,y){AS.U.forEach(u=>{if(u.hp>0&&Math.hypot(u.x-x,u.y-y)<3.6)u.hp=Math.min(u.mhp,u.hp+u.mhp*.55)});AS.fx.push({k:'hl',x,y,t:0})}
/* ---------- simulación ---------- */
function loop(now){if(!AS)return;AS.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;fit();
 if(AS.intro){intro(dt)}else if(!AS.over){for(let i=0;i<AS.sp;i++)step(dt);if(AS.t-AS.t0>2&&AS.t-AS.t0<16&&Math.floor(AS.t-AS.t0)%5===0&&AS._cry!==Math.floor(AS.t-AS.t0)){AS._cry=Math.floor(AS.t-AS.t0);say(pk(['Soldado','Soldada','Guardia del Alba']),pk(['«¡Mantened la formación!»','«¡Escudos arriba, avanzad!»','«¡Por los que perdimos!»','«¡Hacia la puerta!»']))}}
 const cam=AS.cam;let ox=0,oy=0;if(AS.shake>0){AS.shake-=dt;const m=AS.shake*14/cam.z*(window.SHK_STR??1);ox=(Math.random()-.5)*m;oy=(Math.random()-.5)*m;cam.x+=ox;cam.y+=oy}
 draw();if(ox||oy){cam.x-=ox;cam.y-=oy}hud()}
/* ---------- cinemática de entrada ---------- */
function introEl(){let e=document.getElementById('asIntro');if(!e&&ov){e=document.createElement('div');e.id='asIntro';e.innerHTML='<div class="lb t"></div><div class="lb b"></div><div class="ttl"></div><div class="sub"></div><div class="line"></div><div class="cry"></div><button onclick="asaltoIsoSkip()">Saltar ▶</button>';ov.appendChild(e);
  const st=document.createElement('style');st.textContent='#asIntro{position:absolute;inset:0;pointer-events:none;z-index:5}#asIntro .lb{position:absolute;left:0;right:0;height:0;background:#000;transition:height .8s}#asIntro .lb.t{top:0}#asIntro .lb.b{bottom:0}#asIntro.on .lb{height:13%}#asIntro .ttl{position:absolute;left:0;right:0;top:30%;text-align:center;font:900 clamp(26px,6vw,54px) Georgia,serif;letter-spacing:.18em;color:#f2c542;text-shadow:0 0 18px #000,0 4px 0 #3a2500;opacity:0;transform:scale(1.25);transition:opacity 1s,transform 2.2s}#asIntro .ttl.on{opacity:1;transform:scale(1)}#asIntro .sub{position:absolute;left:0;right:0;top:calc(30% + clamp(36px,7vw,64px));text-align:center;font:700 13px sans-serif;letter-spacing:.35em;text-transform:uppercase;color:#e8d3a0;opacity:0;transition:opacity 1s}#asIntro .sub.on{opacity:.9}#asIntro .line{position:absolute;left:50%;bottom:16%;transform:translateX(-50%);width:min(86%,720px);text-align:center;font:italic 600 clamp(14px,2.4vw,19px) Georgia,serif;color:#f6ead0;text-shadow:0 2px 6px #000;opacity:0;transition:opacity .6s}#asIntro .line.on{opacity:1}#asIntro .cry{position:absolute;left:0;right:0;top:38%;text-align:center;font:900 clamp(34px,8vw,76px) Georgia,serif;letter-spacing:.12em;color:#fff;text-shadow:0 0 24px #f2a020,0 0 6px #000;opacity:0;transform:scale(.6);transition:opacity .25s,transform .35s}#asIntro .cry.on{opacity:1;transform:scale(1)}#asIntro button{position:absolute;right:12px;top:calc(13% + 8px);pointer-events:auto;padding:6px 12px;border-radius:7px;border:1px solid #6a5a3a;background:#000a;color:#f2d99a;font:700 12px sans-serif}';e.appendChild(st)}return e}
function intro(dt){const I=AS.intro,F=FAC[AS.fk],e=introEl();if(!e)return;I.t+=dt;const t=I.t;
 if(!I.s0){I.s0=1;e.classList.add('on');ov.querySelector('#asIbar').style.visibility='hidden';try{window.sfx&&sfx('bossroar')}catch(x){}}
 const tt=e.querySelector('.ttl'),sb=e.querySelector('.sub'),ln=e.querySelector('.line'),cr=e.querySelector('.cry');
 tt.textContent=F.n;sb.textContent=(F.lbl||'Asalto final')+(F.single?'':' · fase '+AS.stage+' de 2');
 tt.classList.toggle('on',t>.6&&t<4.4);sb.classList.toggle('on',t>1.4&&t<4.4);
 const L=['«Mirad bien esos muros. Detrás está todo lo que nos quitaron.»','«No buscamos venganza. Buscamos que nuestros hijos puedan dormir.»',AS.sayTxt];
 const li=t<5?-1:t<6.8?0:t<8.4?1:2;ln.classList.toggle('on',li>=0&&t<9.25);if(li>=0)ln.innerHTML=L[li]+'<br><span style="font:700 11px sans-serif;letter-spacing:.25em;color:#f2c542">VALERIA</span>';
 const z0=.95,cam=AS.cam,q0=P(25.5,13),e0=[q0[0]-innerWidth/2/z0,q0[1]-innerHeight*.5/z0],E1=I.end;
 const k=t<3.6?0:Math.min(1,(t-3.6)/3.4),ke=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;cam.z=z0+(E1[2]-z0)*ke;cam.x=e0[0]+(E1[0]-e0[0])*ke;cam.y=e0[1]+(E1[1]-e0[1])*ke;
 if(t>9.4&&!I.cry){I.cry=1;cr.textContent='¡AL ATAQUE!';cr.classList.add('on');AS.shake=.6;try{window.sfx&&(sfx('boom'),setTimeout(()=>sfx('boom'),260))}catch(x){}}
 if(t>=I.d)endIntro()}
function endIntro(){if(!AS||!AS.intro)return;const E1=AS.intro.end;AS.cam.x=E1[0];AS.cam.y=E1[1];AS.cam.z=E1[2];AS.intro=null;AS.t0=AS.t;const e=document.getElementById('asIntro');if(e)e.remove();if(ov)ov.querySelector('#asIbar').style.visibility='';say('Valeria',AS.sayTxt);ui()}
window.asaltoIsoSkip=()=>{if(AS&&AS.intro){if(!AS.intro.cry){AS.intro.t=9.35}else endIntro()}};
function banner(a,b){if(!ov)return;const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;background:radial-gradient(#0000,#000a);opacity:0;transition:opacity .5s';d.innerHTML='<div style="text-align:center;padding:0 24px;max-width:92%;font:900 clamp(22px,4.6vw,44px) Georgia,serif;letter-spacing:.1em;color:#f2c542;text-shadow:0 0 22px #000,0 4px 0 #3a2500">'+a+'</div><div style="margin-top:8px;font:700 13px sans-serif;letter-spacing:.3em;color:#f6ead0;text-transform:uppercase">'+b+'</div>';ov.appendChild(d);requestAnimationFrame(()=>d.style.opacity=1);setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),600)},2300)}
function targetOf(u,L,W,rng){let b=null,bd=1e9;for(const o of L){if(o.hp<=0)continue;const d=Math.hypot(o.x-u.x,o.y-u.y);if(d<bd){bd=d;b=o}}return b?{o:b,d:bd}:null}
function unit(u,dt,foes,ally){const W=AS.W;if(u.cd>0)u.cd-=dt;u.at=Math.max(0,(u.at||0)-dt);u.mv=0;if(u.stun>0){u.stun-=dt;return}if(u.fixed)return;if(u.life!==undefined){u.life-=dt;if(u.life<=0){u.hp=0;return}}if(u.wet>0)u.wet-=dt;if(u.sh!==undefined&&u.shT>0)u.shT-=dt;else if(u.sh!==undefined&&u.sh<u.shM)u.sh=Math.min(u.shM,u.sh+u.shM*.05*dt);
 /* objetivo a tiro */
 const mult=ally?(AS.cov>0?1.5:1):(AS.shield>0?.55:1);
 if(u.tow){let best=null,bd=u.rng;for(const f of foes){if(f.hp<=0)continue;const d=Math.hypot(f.x-u.x,f.y-u.y);if(d<bd&&los(W,u.x,u.y,f.x,f.y,(i,j)=>j>=u.tr.y&&j<=u.tr.y+1&&i>=u.tr.x&&i<=u.tr.x+1||W.gridT[W.idx(i,j)]===2||W.gridT[W.idx(i,j)]===3)){bd=d;best=f}}if(best&&u.cd<=0){hurt(best,u.dmg*mult);u.cd=1/u.rate;u.at=.3;u.aim=Math.atan2(best.y-u.y,best.x-u.x);AS.tr.push({x1:u.x,y1:u.y,x2:best.x,y2:best.y,z1:FAC[AS.fk].tech?62:34,l:.1,c:FAC[AS.fk].tech?'#5ae6ff':'#ff9a4a',w:FAC[AS.fk].tech?2.6:1.3})}return}
 let t=null,td=u.gun?u.rng:u.rng;
 let cand=null,cd2=1e9;for(const f of foes){if(f.hp<=0)continue;const d=Math.hypot(f.x-u.x,f.y-u.y);if(d<cd2&&d<=(u.gun?u.rng:u.rng+.4)){if(u.fly||f.fly||los(W,u.x,u.y,f.x,f.y,f.tow?((i,j)=>j>=f.tr.y&&j<=f.tr.y+1&&i>=f.tr.x&&i<=f.tr.x+1):null)){cd2=d;cand=f}}}
 if(cand){u.dx=cand.x-u.x-(cand.y-u.y);if(u.cd<=0){let d=u.dmg*mult;if(!ally&&cand.val&&AS.shield>0)d=0;hurt(cand,d);u.cd=1/u.rate*(ally&&AS.cov>0?.7:1);u.at=.35;if(u.gun)AS.tr.push({x1:u.x,y1:u.y,x2:cand.x,y2:cand.y,z1:u.big?44:20,l:u.big?.16:.09,c:ally?'#9fc4e8':(u.tc||'#ff9a4a'),w:u.tw||1.3});else AS.fx.push({k:'hit',x:cand.x,y:cand.y,t:0})}return}
 /* guardia: solo reacciona si hay atacantes cerca */
 if(!ally&&u.guard){let n=null,nd=11;for(const f of foes){if(f.hp<=0)continue;const d=Math.hypot(f.x-u.x,f.y-u.y);if(d<nd){nd=d;n=f}}if(!n&&!AS.aggro)return;if(n)u.guard=0}
 /* movimiento: ruta hacia el enemigo más cercano; si no hay camino, hasta donde se pueda y ataca el muro */
 if(u.fly){const f=targetOf(u,foes,W);if(!f)return;const dx=f.o.x-u.x,dy=f.o.y-u.y,d=Math.hypot(dx,dy);if(d>u.rng*.8){u.dx=dx-dy;const s=u.sp*dt;u.x+=dx/d*s;u.y+=dy/d*s;u.mv=1}return}
 u.pt-=dt;
 if(u.pt<=0||!u.path||!u.path.length){u.pt=.8+Math.random()*.4;const f=targetOf(u,foes,W);if(!f)return;const fl=flood(W,u.x,u.y);let p=pathTo(W,fl,f.o.x,f.o.y);u.sg=0;if(!p){const nr=nearestReach(W,fl,f.o.x,f.o.y);if(nr){p=pathTo(W,fl,nr[0],nr[1])||[];u.sg=1;u.sgx=f.o.x;u.sgy=f.o.y}else p=[]}u.path=p||[]}
 if(u.path.length){const t0=u.path[0],dx=t0[0]-u.x,dy=t0[1]-u.y,d=Math.hypot(dx,dy);if(d<.1){u.path.shift()}else{u.dx=dx-dy;const s=Math.min(d,u.sp*dt*(AS.cov>0&&ally?1.2:1)*(u.wet>0?.5:1)*(ally&&AS.t-AS.t0<16?.55:1));u.x+=dx/d*s;u.y+=dy/d*s;u.mv=1}}
 else if(u.sg&&ally){/* asedio: golpea el muro/puerta más cercano al objetivo */
  let w=null,bd=u.gun?3.2:1.7;AS.W.wcell.forEach(c=>{const d=Math.hypot(c.x+.5-u.x,c.y+.5-u.y);if(d<bd){const toT=Math.hypot(c.x+.5-u.sgx,c.y+.5-u.sgy);if(!w||toT<w.t){w=c;w.t=toT;bd=Math.max(bd,d)}}});
  if(w&&u.cd<=0){dmgWall(w,u.dmg*(u.gun?.15:.9)*(w.type==='gate'?1:1));u.cd=1/u.rate;u.at=.35;AS.siegeT+=0}}
 u.x=clamp(u.x,-OM+1,GW+OM-1);u.y=clamp(u.y,-OM+1,GH+OM-1)}
function step(dt){AS.t+=dt;if(AS.cov>0)AS.cov-=dt;if(AS.covCd>0)AS.covCd-=dt;const al=AS.U.filter(u=>u.hp>0),en=AS.E.filter(e=>e.hp>0);
 al.forEach(u=>unit(u,dt,en,1));en.forEach(e=>unit(e,dt,al,0));
 /* torres destruidas */
 AS.E.forEach(e=>{if(e.tow){e.tr.hp=e.hp;if(e.hp<=0&&!e.dead){e.dead=1;AS.fx.push({k:'ex',x:e.x,y:e.y,t:0});const W=AS.W;for(let a=0;a<2;a++)for(let b=0;b<2;b++)W.gridT[W.idx(e.tr.x+a,e.tr.y+b)]=0;W.WL.T=W.WL.T.filter(q=>q!==e.tr);AS.fl=null}}});
 /* muertes */
 AS.U.forEach(u=>{if(u.hp<=0&&!u.dead){u.dead=1;AS.dead.push({x:u.x,y:u.y,a:1,c:u.gd?'#c9a24a':'#3f6a8f'});if(u.p)AS.fallen.push(u.p)}});
 AS.E.forEach(e=>{if(e.hp<=0&&!e.dead){e.dead=1;if(e.fly||e.big||e.fixed||e.life!==undefined)AS.fx.push({k:'ex',x:e.x,y:e.y,t:0});else if(!e.tow)AS.dead.push({x:e.x,y:e.y,a:0,c:FAC[AS.fk].col});if(e.boss){AS.bossDead=1;say(e.bn,'«No... esto no puede...»')}}});
 /* asedio: si la puerta aguanta demasiado, las cargas de la Guardia la abren */
 if(!AS.gateOpen){AS.siegeT+=dt;if(AS.siegeT>75){AS.siegeT=-999;const g=[...AS.W.wcell.values()].filter(w=>w.type==='gate'&&w.y===GH-1)[0];if(g){say('Valeria','«¡Cargas colocadas! ¡Atrás!»');boom(g.x+.5,g.y+.5)}}}
 if(AS.gateOpen||AS.t>AS.t0+60)AS.aggro=1;
 /* si nadie cae en un buen rato, la Guardia coloca cargas en el muro más cercano al cabecilla */
 const kills=AS.E.filter(e=>e.dead).length;if(kills!==AS._k){AS._k=kills;AS._kt=AS.t}if(AS.t-(AS._kt||AS.t0)>32){AS._kt=AS.t;const b=AS.E.find(e=>e.boss&&e.hp>0);if(b){let w=null,bd=1e9;AS.W.wcell.forEach(c=>{const d=Math.hypot(c.x+.5-b.x,c.y+.5-b.y);if(d<bd){bd=d;w=c}});if(w){say('Valeria','«¡Cargas en el muro! ¡Abrid paso!»');boom(w.x+.5,w.y+.5)}}}
 /* contraataque: la victoria está asegurada, pero llega cuando parece perdida */
 const mine=AS.U.filter(u=>u.a&&!u.gd),aliveFrac=mine.filter(u=>u.hp>0).length/Math.max(1,mine.length);
 if((aliveFrac<.38||AS.t-AS.t0>(AS.rein?320:240))&&AS.rein<14&&AS.t-AS.reinAt>40){AS.reinAt=AS.t;AS.rein++;say('Valeria','«¡La Guardia, conmigo! ¡Nadie más cae hoy!»');for(let i=0;i<9;i++)AS.U.push({a:1,gd:1,x:25+rnd(-5,5),y:GH+6+rnd(0,2),hp:90*Math.pow(AS.ctx.es||1,.5),mhp:90*Math.pow(AS.ctx.es||1,.5),dmg:11*Math.sqrt(AS.ctx.es||1),rng:6,rate:1.2,cd:0,sp:1.8,gun:1,sol:1,dx:-1,mv:0,at:0,path:[],pt:0});AS.U.filter(u=>u.val).forEach(v=>v.hp=v.mhp);AS.U.forEach(u=>{if(u.hp>0)u.hp=Math.min(u.mhp,u.hp+u.mhp*.35)});AS.shield=10}
 if(AS.shield>0)AS.shield-=dt;if(AS.t-AS.t0>420){const bb=AS.E.find(e=>e.boss&&e.hp>0);if(bb){AS._mc=(AS._mc||0)+dt;if(AS._mc>8){AS._mc=0;say('Valeria','«¡Fuego de la Guardia sobre el jefe!»');bb.sh=0;bb.hp-=bb.mhp*.12;AS.fx.push({k:'ex',x:bb.x,y:bb.y,t:0})}}}if(FAC[AS.fk].tech)TORRE.step(AS,dt,{hurt,say,rnd});if(FAC[AS.fk].mech&&window.SILLAS)SILLAS.step(AS,dt,{hurt,say,rnd,mkTech:TORRE.mk});
 AS.fx.forEach(f=>f.t+=dt);AS.fx=AS.fx.filter(f=>f.t<(f.k==='rub'?9999:1.2));AS.tr.forEach(t=>t.l-=dt);AS.tr=AS.tr.filter(t=>t.l>0);
 if(AS.bossDead&&!AS.over)stageDone();
 if(Math.floor(AS.t*2)!==AS._u){AS._u=Math.floor(AS.t*2);ui()}}
function stageDone(){try{const bb=AS.E.find(e=>e.boss);AS.shake=1;banner(FAC[AS.fk].n.toUpperCase()+' HA CAÍDO',(bb&&bb.bn?bb.bn+' derrotado':'Victoria'));if(bb)AS.fx.push({k:'ex',x:bb.x,y:bb.y,t:0});window.sfx&&sfx('boom')}catch(x){}if(FAC[AS.fk].single){AS.over=1;const es=FAC[AS.fk].endSay;if(es)say(es[0],es[1]);const surv=AS.U.filter(u=>u.p&&u.hp>0).length;try{FAC[AS.fk].fin({fallen:AS.fallen,total:AS.tot,surv})}catch(e){console.error(e)}setTimeout(()=>exit(),1200);return}if(AS.fk==='cuervos'){AS.over=1;say('Valeria','«El Nido Negro ha caído. Ahora, las Víboras.»');setTimeout(async()=>{const ld=document.createElement('div');ld.style.cssText='position:fixed;inset:0;z-index:10001;background:#0b0907;color:#f2c542;display:flex;align-items:center;justify-content:center;font:900 20px system-ui;letter-spacing:.15em;text-align:center;padding:20px';ld.textContent='EL NIDO NEGRO HA CAÍDO · AVANZAIS HACIA EL NIDO DE VÍBORAS';document.body.appendChild(ld);await new Promise(r=>setTimeout(r,1400));await loadStage('viboras');AS.over=0;ld.remove();ui()},1800)}
 else{AS.over=1;const surv=AS.U.filter(u=>u.p&&u.hp>0).length;try{window.ASALTO.finish2({fallen:AS.fallen,total:AS.tot,surv})}catch(e){}setTimeout(()=>exit(),1200)}}
function exit(){if(!AS)return;cancelAnimationFrame(AS.raf);ov.remove();document.getElementById('asIsoCss')&&document.getElementById('asIsoCss').remove();document.body.classList.remove('as-on');ov=null;AS=null;window._asIso=0;window._asOn=0}
window.asaltoIsoExit=exit;
/* ---------- dibujo ---------- */
function figE(c,u){const col=FAC[u.band]?FAC[u.band].col:'#222';FL=0;EXP='angry';SXF=0;OLDF=0;KIDF=0;WPN='';window.BCOL=col;fig(u.x,u.y,'#5b3d2a',u.big?1.25:1,u.mv,'#d8a878',1,u.dx,'ban',u.at>0?4:0,u.sd);window.BCOL=null;try{if(window.drawBandit)drawBandit(c,{x:u.x,y:u.y,dx:u.dx,t:u.t,band:u.band,at:u.at>0,sd:u.sd,hp:u.hp,mhp:u.mhp,act:1,flag:u.boss?1:0})}catch(e){}}
function figA(u){const p=u.p;FL=0;EXP=u.at>0?'angry':'scared';SXF=p&&p.sex==='F'?1:0;OLDF=0;KIDF=0;WPN=p&&p.wp?p.wp.n:(u.gd?'Rifle':'');fig(u.x,u.y,u.val?'#c9a24a':u.gd?'#b08a3a':(p&&p.arm?'#3f6a8f':'#6a7a4a'),u.val?1.12:1,u.mv,'#d8a878',u.gun?1:0,u.dx,p&&p.arm?p.arm:'Soldado',u.at>0?4:(u.mv?3:5),(p&&p.id)||(u.sdid=u.sdid||1+Math.floor(Math.random()*200)),'#3a2a1a',!!u.sol,false)}
function bar(c,u,w){const q=P(u.x,u.y),f=clamp(u.hp/u.mhp,0,1);c.fillStyle='#000a';c.fillRect(q[0]-w/2,q[1]-48,w,3.4);c.fillStyle=u.e?'#d04a3a':'#6fd06f';c.fillRect(q[0]-w/2,q[1]-48,w*f,3.4)}
function flag(c,x,y,col,t){const q=P(x,y);c.save();c.strokeStyle='#2a201a';c.lineWidth=2.5;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0],q[1]-70);c.stroke();c.fillStyle=col;c.beginPath();c.moveTo(q[0],q[1]-70);for(let i=0;i<=6;i++)c.lineTo(q[0]+i*4,q[1]-70+Math.sin(t*3+i)*2.5);for(let i=6;i>=0;i--)c.lineTo(q[0]+i*4,q[1]-52+Math.sin(t*3+i)*2.5);c.closePath();c.fill();c.restore()}
function draw(){if(!AS||!AS.G)return;clampCam();const cv=AS.cv,c=cv.getContext('2d'),cam=AS.cam,z=cam.z*AS.dpr,G=AS.G,W=AS.W;c.setTransform(1,0,0,1,0,0);c.fillStyle='#050906';c.fillRect(0,0,cv.width,cv.height);c.setTransform(z,0,0,z,-cam.x*z,-cam.y*z);c.drawImage(G.cv,-G.OX,-G.OY,G.W,G.H);window.g=c;
 const L=[];
 AS.dead.forEach(d=>L.push([d.x+d.y-.5,()=>{const q=P(d.x,d.y);c.save();c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(q[0],q[1]+1,9,3.6,0,0,7);c.fill();c.fillStyle=d.c;c.globalAlpha=.85;c.fillRect(q[0]-7,q[1]-3,13,5);c.fillStyle='#b89070';c.beginPath();c.arc(q[0]-9,q[1]-1,2.6,0,7);c.fill();c.restore()}]));
 W.bl.forEach(b=>L.push([b.x+b.w-1+b.y+b.h-1+.5,FAC[AS.fk].tech?()=>TORRE.drawB(c,b,T):()=>{try{shB(c,b);mir(c,b,(cc,bb)=>{drawB(cc,bb);buildingPolish(cc,bb)})}catch(e){}}]));
 W.WL.W.forEach(w=>L.push([w.x+w.y+.5,()=>{try{if(FAC[AS.fk].tech)TORRE.drawW(c,w,T);else wallDrawM(c,w.type,w.x,w.y,w.mask,5,0);if(w.hp<w.mhp){const q=P(w.x+.5,w.y+.5);c.fillStyle='#000a';c.fillRect(q[0]-10,q[1]-22,20,3);c.fillStyle='#e0a030';c.fillRect(q[0]-10,q[1]-22,20*w.hp/w.mhp,3)}}catch(e){}}]));
 W.WL.T.forEach(b=>L.push([b.x+b.w-1+b.y+b.h-1+.5,()=>{try{if(FAC[AS.fk].tech){const e=AS.E.find(q=>q.tr===b);TORRE.drawT(c,b,e,T)}else{shB(c,b);mir(c,b,(cc,bb)=>{drawB(cc,bb);buildingPolish(cc,bb)})};if(b.hp<b.mhp){const q=P(b.x+1,b.y+1);c.fillStyle='#000a';c.fillRect(q[0]-16,q[1]-120,32,4);c.fillStyle='#d04a3a';c.fillRect(q[0]-16,q[1]-120,32*b.hp/b.mhp,4)}}catch(e){}}]));
 AS.E.forEach(e=>{if(e.hp<=0||e.tow)return;L.push([e.x+e.y,()=>{if(FAC[AS.fk].tech||e.k==='zb'||e.k==='mk'||e.k==='dr'||e.k==='hl'||e.k==='cap')TORRE.drawE(c,e,T);else figE(c,e);if(e.boss){const q=P(e.x,e.y);c.font='bold 11px sans-serif';c.textAlign='center';c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=3;c.strokeText(e.bn,q[0],q[1]-62);c.fillText(e.bn,q[0],q[1]-62);bar(c,e,40)}else if(e.hp<e.mhp)bar(c,e,18)}])});
 AS.U.forEach(u=>{if(u.hp<=0)return;L.push([u.x+u.y,()=>{figA(u);if(u.val){const q=P(u.x,u.y);c.font='bold 11px sans-serif';c.textAlign='center';c.fillStyle='#f2c542';c.strokeStyle='#000';c.lineWidth=3;c.strokeText('Presidenta Valeria',q[0],q[1]-62);c.fillText('Presidenta Valeria',q[0],q[1]-62)}if(u.hp<u.mhp||u.val)bar(c,u,u.val?30:18)}])});
 if(!FAC[AS.fk].tech)W.bl.filter(b=>b.key==='hq').forEach(b=>L.push([b.x+b.y+8,()=>flag(c,b.x+b.w/2,b.y+b.h+.2,FAC[AS.fk].col,T)]));
 if(!FAC[AS.fk].tech)[[25,GH-1.4],[26.2,GH-1.4]].forEach(([x,y])=>L.push([x+y+1,()=>flag(c,x,y,FAC[AS.fk].col,T)]));
 L.sort((a,b)=>a[0]-b[0]).forEach(l=>l[1]());
 /* efectos */
 AS.tr.forEach(t=>{const a=P(t.x1,t.y1),b=P(t.x2,t.y2);c.strokeStyle=t.c;c.lineWidth=t.w||1.3;c.globalAlpha=Math.min(1,t.l*11);c.beginPath();c.moveTo(a[0],a[1]-(t.z1||20));c.lineTo(b[0],b[1]-16);c.stroke();c.globalAlpha=1});
 AS.fx.forEach(f=>{const q=P(f.x,f.y);if(f.k==='ex'){const r=f.t*90;c.strokeStyle='rgba(255,170,60,'+(1-f.t/1.2)+')';c.lineWidth=4;c.beginPath();c.ellipse(q[0],q[1],r,r*.5,0,0,7);c.stroke();c.fillStyle='rgba(255,120,30,'+(.5-f.t/2.4)+')';c.beginPath();c.ellipse(q[0],q[1]-6,r*.8,r*.45,0,0,7);c.fill();c.fillStyle='rgba(40,34,30,'+(.5-f.t/2.4)+')';c.beginPath();c.arc(q[0],q[1]-30-f.t*30,14+f.t*20,0,7);c.fill()}else if(f.k==='hl'){c.strokeStyle='rgba(120,230,140,'+(1-f.t/1.2)+')';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],f.t*60,f.t*30,0,0,7);c.stroke()}else if(f.k==='emp'){c.strokeStyle='rgba(120,230,255,'+(1-f.t/1.2)+')';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],f.t*190,f.t*95,0,0,7);c.stroke();c.strokeStyle='rgba(200,250,255,'+(.8-f.t/1.5)+')';c.beginPath();c.ellipse(q[0],q[1],f.t*120,f.t*60,0,0,7);c.stroke()}else if(f.k==='hit'){c.fillStyle='rgba(255,220,120,'+(1-f.t/.3)+')';c.fillRect(q[0]-2,q[1]-16,4,4)}else if(f.k==='rub'){c.fillStyle='#4a433a';for(let i=0;i<4;i++)c.fillRect(q[0]-10+i*5,q[1]-2+(i%2)*2,5,4)}});
 if(FAC[AS.fk].tech)TORRE.over(c,AS,T);if(FAC[AS.fk].mech&&window.SILLAS)SILLAS.over(c,AS,T);
 /* fuegos en las torres dañadas */
 c.setTransform(1,0,0,1,0,0);if(AS.mode){c.fillStyle='rgba(255,220,120,.10)';c.fillRect(0,0,cv.width,cv.height)}}
function hud(){const al=AS.U.filter(u=>u.hp>0&&u.p).length,at=AS.U.filter(u=>u.p).length,ee=AS.E.filter(e=>e.hp>0&&!e.tow).length,v=AS.U.find(u=>u.val),F=FAC[AS.fk];
 ov.querySelector('#asItop').innerHTML=`<span>${F.lbl||'Asalto final'} · ${F.n}${FAC[AS.fk].single?'':' ('+AS.stage+'/2)'}${AS.mode?' · toca el campo':''}</span><span>Tus tropas ${al}/${at} · Enemigos ${ee} · Valeria ${Math.max(0,Math.round(v?v.hp/v.mhp*100:0))}%</span>`;
 ov.querySelector('#asImsg').innerHTML=AS.msg.filter(m=>AS.t-m.at<8).slice(0,3).map(m=>'<div>'+m.w+': '+m.t+'</div>').join('')}
window.ASALTOISO={step:()=>step,state:()=>AS,boom,sim:dt=>step(dt)};
const oRen=window.render;window.render=function(){if(window._asIso)return;return oRen.apply(this,arguments)};
})();
