/* Misiones con mapa explorable en directo: diriges al equipo por el lugar, con niebla, enemigos, botín y eventos de la historia. */
(function(){
'use strict';
const $=i=>document.getElementById(i);
const COLS=26,ROWS=11,oEnd=window.exEnd;
const toast=m=>{if(/caído|logrado|Objetivo cumplido|abandonar|reanímalo|Hay enemigos activos/.test(m))window.toast(m)}; // en misión solo avisos importantes
const tm=e=>e.team.map(byId).filter(Boolean);
const nR=e=>e.z.evs?e.z.evs.length:3;
/* ---------- progresión: amenaza, enemigos armados y rareza del botín ---------- */
const lvlOf=z=>z.chap!==undefined?z.chap:Math.min(15,(z.g||1)*1.5);
const RAR={C:['Común','#c4c4c4'],U:['Poco común','#74d674'],R:['Raro','#5aa8ff'],E:['Épico','#b36cff'],L:['Legendario','#ffa43a']};
const RW=l=>l<1?{C:100}:l<4?{C:85,U:15}:l<6?{C:55,U:35,R:10}:l<8?{C:52,U:33,R:12,E:3}:l<12?{C:33,U:38,R:20,E:6,L:3}:{C:18,U:32,R:28,E:10,L:12};
const maxRar=l=>Object.keys(RW(l)).pop();
const threatOf=l=>l<2?'baja':l<5?'media':l<9?'alta':l<13?'muy alta':'extrema';
Object.assign(ZT,{b:{n:'Bandido',hp:55,sp:.95,d:8,c:'#8a6a4a',rng:4.2,cd:1.9,hum:1},m:{n:'Mercenario',hp:95,sp:.9,d:11,c:'#6a7a50',rng:5.6,cd:1.5,hum:1},e:{n:'Élite de CENIZA',hp:170,sp:.85,d:15,c:'#3a3d48',rng:6.6,cd:1.3,hum:1,armor:4}});
const HUMTH={military:1.5,police:1.5,camp:1.4,port:1.3,highway:1.3,cordon:1.5,office:1.2,warehouse:1.1,hospital:.5,lab:.6,house:.6,greenhouse:.5};
function ownedSet(){const o=new Set();(S.inv||[]).forEach(i=>o.add(i.n));S.ppl.forEach(p=>{if(p.wp)o.add(p.wp.n);if(p.outfit)o.add(p.outfit)});return o}
function rollRar(l){const w=RW(l);let t=0,k;for(k in w)t+=w[k];let r=Math.random()*t;for(k in w){if((r-=w[k])<=0)return k}return 'C'}
function gearPool(r,wOnly){const ow=ownedSet(),o=[];WP.forEach(w=>{if((w.r||'C')===r&&!(r=='L'&&ow.has(w.n)))o.push({n:w.n,v:w.v})});
  if(!wOnly&&window.OUTFITS)for(const k in OUTFITS)if(OUTFITS[k].r===r&&!(r=='L'&&ow.has(k)))o.push({n:k,o:1});return o}
function rollGear(l,bonus,wOnly){let r=rollRar(l+(bonus||0));if(r=='L'&&l<8)r='E';let pool=gearPool(r,wOnly);
  while(!pool.length&&r!='C'){r=({L:'E',E:'R',R:'U',U:'C'})[r];pool=gearPool(r,wOnly)}
  if(!pool.length)return null;const it=pool[Math.floor(Math.random()*pool.length)];return{it,r}}
function giveGear(l,bonus,wOnly,at){const g=rollGear(l,bonus,wOnly);if(!g)return null;const it=g.it;
  S.inv.push(it.o?{kind:'outfit',n:it.n}:{n:it.n,v:it.v});const e=S.exp;
  if(e){e.log.push('Hallazgo: '+it.n+' ('+RAR[g.r][0]+')');e.gear=(e.gear||[]);e.gear.push(it.n)}
  if(at&&M)addFl(M,at.x,at.y,'★ '+it.n,RAR[g.r][1]);toast('★ Encontrado: '+it.n+' · '+RAR[g.r][0]);return g}
function mixType(l,R,th){const hs=l<2?0:Math.min(.45,(l-1)*.045)*(HUMTH[th]||1);
  if(R()<hs)return l<5?'b':l<10?(R()<.5?'b':'m'):(R()<.35?'b':R()<.7?'m':'e');
  const sx=window.ZX&&ZX.mix&&ZX.mix(l,R);if(sx)return sx;
  const pool=['z'];if(l>=1)pool.push('r');if(l>=2)pool.push('f');if(l>=3)pool.push('s');return R()<.55?'z':pool[Math.floor(R()*pool.length)]}
let M=null,ov,cv,cx,shown=false,raf=0,lastT=0,ts=32,ox=0,oy=0,evOpen=false;
function rngS(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}let a=h>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* ---------- generación ---------- */
function genDefault(e,T){
  const R=rngS(e.z.n+':'+(e.dist||1)+':'+e.step+(e.z.chap===undefined&&e.seed!==undefined?':'+e.seed:'')),ri=(a,b)=>a+Math.floor(R()*(b-a+1));
  let g;if(T)g=T.g;else{g=[];for(let y=0;y<ROWS;y++){g.push(new Uint8Array(COLS));for(let x=0;x<COLS;x++)g[y][x]=(x==0||y==0||x==COLS-1||y==ROWS-1)?1:0}
  [9,17].forEach(px=>{const d=ri(2,ROWS-4),d2=ri(2,ROWS-4);for(let y=1;y<ROWS-1;y++)if(!((y>=d&&y<=d+1)||(y>=d2&&y<=d2+1)))g[y][px]=1});
  [[10,16,13],[18,24,21]].forEach(([a,b,dx])=>{for(let x=a;x<=b;x++)if(Math.abs(x-dx)>1)g[5][x]=1})}
  const floor=()=>{const o=[];for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++)if(!g[y][x])o.push([x,y]);return o};
  const conn=()=>{const f=floor(),seen=new Set(['3,5']),q=[[3,5]];while(q.length){const[x,y]=q.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const k=(x+a)+','+(y+b);if(!g[y+b][x+a]&&!seen.has(k)){seen.add(k);q.push([x+a,y+b])}})}return seen.size===f.length};
  for(let i=0;i<(T?6:14);i++){const x=ri(4,COLS-2),y=ri(1,ROWS-2);if(g[y][x]||(!T&&(x==9||x==17)))continue;g[y][x]=2;if(!conn())g[y][x]=0}
  const ex=[];for(let y=4;y<=6;y++)for(let x=1;x<=3;x++){g[y][x]=0;ex.push(x+','+y)}
  const used=new Set(ex),cand=floor().filter(([x,y])=>x>=5&&!g[y][x]).sort((a,b)=>a[0]-b[0]);
  const pick=(arr)=>{const t=arr.splice(ri(0,arr.length-1),1)[0];return t};
  const remain=Math.max(0,nR(e)-e.step),pois=[];
  for(let i=0;i<remain;i++){const lo=Math.floor(cand.length*(i/remain)),hi=Math.max(lo,Math.floor(cand.length*((i+1)/remain))-1),k=ri(lo,hi),t=cand[k];if(t)pois.push({x:t[0]+.5,y:t[1]+.5,on:1})}
  const far=(x,y,l,d)=>l.every(o=>Math.hypot(o.x-x,o.y-y)>d);
  const crates=[];let tries=0;while(crates.length<5&&tries++<80){const t=cand[ri(0,cand.length-1)];if(far(t[0]+.5,t[1]+.5,pois,2.2)&&far(t[0]+.5,t[1]+.5,crates,3))crates.push({x:t[0]+.5,y:t[1]+.5,on:1,emp:.3})}
  const cars=[];tries=0;while(cars.length<3&&tries++<80){const t=cand[ri(0,cand.length-1)];if(t[0]>=7&&far(t[0]+.5,t[1]+.5,pois,2.2)&&far(t[0]+.5,t[1]+.5,crates,2.5)&&far(t[0]+.5,t[1]+.5,cars,5))cars.push({x:t[0]+.5,y:t[1]+.5,on:1,emp:.45,car:1,c:['#6b7f8f','#8f5a4f','#5f7a5a','#8a8a82'][ri(0,3)]})}
  const z=e.z,lvl=lvlOf(z),th0=T?T.th:null;
  const cnt=Math.max(2+Math.floor(lvl/4),Math.min(8,Math.round(dgOf(z)/60))),en=[],hpM=(.85+.035*lvl)*(S.adv&&S.adv.weather===3?1.15:1),dmM=(.85+.025*lvl)*(S.adv&&S.adv.weather===3?1.15:1);tries=0;
  while(en.length<cnt&&tries++<200){const t=cand[ri(0,cand.length-1)];if(t[0]<8)continue;if(!far(t[0]+.5,t[1]+.5,en,1.2)||!far(t[0]+.5,t[1]+.5,pois,1.2))continue;const ty=mixType(lvl,R,themeOf(e)),hp=Math.round(ZT[ty].hp*hpM);en.push({t:ty,x:t[0]+.5,y:t[1]+.5,hp,mhp:hp,st:0,path:[],pt:0,dm:dmM,cd:1})}
  if(e.z.chap===undefined&&window.BANDS&&!e.z.noBand&&window.bandAvail&&bandAvail().filter(x=>x!=='ceniza').length){const av=bandAvail().filter(x=>x!=='ceniza'),both=e.fbid==='ambas'&&av.includes('cuervos')&&av.includes('viboras'),bid=both?'cuervos':(e.fbid&&av.includes(e.fbid))?e.fbid:av[Math.floor(R()*av.length)],k=(e.gd||e.fbid||R()<.55)?Math.max(2,Math.round(en.length*((e.gd||e.fbid)?.7:.5))):0;let n=0;en.forEach(z=>{if(n>=k)return;z.t='b';z.hp=z.mhp=Math.round(ZT.b.hp*hpM);z.band=both&&n%2?'viboras':bid;if(n===0||(both&&n===1))z.flag=1;n++});if(n)e.bandId=bid}
  const units=tm(e).map((p,i)=>({p,x:2.5,y:4.5+i*.9,path:[],cd:0,home:[2.5,5.5]}));
  const vis=new Uint8Array(COLS*ROWS);
  const barrels=[];if(T)for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(T.pr[y][x]=='H'&&hs(x,y)>.5)barrels.push({x:x+.5,y:y+.5,hp:12,mhp:12,barrel:1});
  const meds=[];tries=0;while(meds.length<2&&tries++<60){const t=cand[ri(0,cand.length-1)];if(t[0]>=8&&far(t[0]+.5,t[1]+.5,pois,1.5)&&far(t[0]+.5,t[1]+.5,crates,1.5)&&far(t[0]+.5,t[1]+.5,meds,4))meds.push({x:t[0]+.5,y:t[1]+.5,on:1})}
  const ally=[];if(e.arc==='guerra')ally.push({p:{arm:'soldado',hp:400,injury:0,n:'Presidenta Valeria'},ally:1,lead:1,dmg:14,rate:.6,mhp:400,x:1.8,y:3.4,path:[],pt:0,cd:0,fa:0});if(e.gd&&window.guardiaApi){const rk=guardiaApi.rank(),na=rk>=4?3:rk>=3?2:rk>=2?1:0;for(let i=0;i<na;i++)ally.push({p:{arm:'soldado',hp:75,injury:0,n:'Soldado de la Guardia'},ally:1,x:1.8,y:4.2+i*.9,path:[],pt:0,cd:0,fa:0})}
  return{g,pois,crates,cars,en,units,vis,ally,fl:[],tr:[],focus:null,goal:null,t:0,loot:{},barrels,meds,sel:null}
}

/* ---------- plantillas por tipo de lugar ---------- */
const CHK=['gas','truck','hospital','warehouse','lab','military','tower','observatory','police','wall','camp','metro','archive','house','skyscraper','old','barrier','weather','greenhouse','radio','border','port','highway','dam','office','trainstation','capital','emitter','capital','warehouse','skyscraper','lab','trainstation','trainstation','military','military','radio','radio','old','archive','dam','dam','port','tower','factory','factory','capital','emitter'];
const K2T={gas:'gas',truck:'highway',hospital:'hospital',warehouse:'warehouse',lab:'lab',military:'military',tower:'tower',observatory:'observatory',police:'police',wall:'cordon',camp:'camp',metro:'metro',archive:'archive',house:'house',skyscraper:'office',old:'house',barrier:'cordon',weather:'radio',greenhouse:'greenhouse',radio:'radio',border:'cordon',port:'port',highway:'highway',dam:'dam',office:'office',trainstation:'metro',capital:'office',emitter:'lab',suburb:'house',market:'market',station:'gas',factory:'warehouse'};
function themeOf(e){const z=e.z;if(z.chap!==undefined)return K2T[CHK[z.chap]];if(z.theme)return z.theme;if(z.id&&K2T[z.id])return K2T[z.id];const n=(z.n||'').toLowerCase();
  return[['gasolinera','gas'],['supermercado','market'],['hospital','hospital'],['comisar','police'],['fábrica','warehouse'],['campamento','military'],['laboratorio','lab'],['base militar','military'],['pueblo','house'],['refugio','house'],['barrio','house'],['industrial','warehouse']].find(q=>n.includes(q[0]))?.[1]||null}
const PAL={
 gas:{f:[['#6b6f72','#64686b'],['#34373b','#303338'],['#44484c','#40444a']],w:['#6a5a4a','#8f7c66']},
 highway:{f:[['#3a3c3f','#37393c'],['#4b4b44','#464640'],['#3a3c3f','#37393c']],w:['#3a4044','#59646b'],line:1},
 hospital:{f:[['#a7b6b6','#9eaeae'],['#a7b6b6','#9eaeae'],['#86aaa6','#7fa3a0']],w:['#b8c4c4','#e6eeee']},
 warehouse:{f:[['#55524c','#504d47'],['#4a4843','#46443f'],['#55524c','#504d47']],w:['#383d42','#515a61']},
 lab:{f:[['#6d7c88','#677681'],['#6d7c88','#677681'],['#586a78','#52636f']],w:['#9aa8b2','#c7d2da']},
 military:{f:[['#4a4f45','#454a40'],['#5b5039','#554a35'],['#4a4f45','#454a40']],w:['#3a4236','#5a6652']},
 police:{f:[['#5c6063','#585c5f'],['#5c6063','#585c5f'],['#4e5a66','#49555f']],w:['#40485a','#5f6a82']},
 metro:{f:[['#6a6c68','#656763'],['#6a6c68','#656763'],['#6a6c68','#656763']],w:['#2f3a3a','#4b5b5a'],rail:1},
 archive:{f:[['#5d4f3b','#584a36'],['#5d4f3b','#584a36'],['#5d4f3b','#584a36']],w:['#3f3326','#5e4e3a']},
 house:{f:[['#7b5b3b','#745436'],['#7b5b3b','#745436'],['#6e7a58','#68744f']],w:['#c9b999','#e4d7b8']},
 office:{f:[['#4a5a6a','#455564'],['#4a5a6a','#455564'],['#4a5a6a','#455564']],w:['#7a838c','#a9b3bb']},
 tower:{f:[['#5a5a50','#56564c'],['#4f5a3a','#4a5536'],['#5a5a50','#56564c']],w:['#5a5e60','#8a9094']},
 observatory:{f:[['#6a7480','#65707c'],['#405a3a','#3b5536'],['#6a7480','#65707c']],w:['#3a4a6a','#5a6a8a']},
 port:{f:[['#5a5d5f','#55585a'],['#5a5d5f','#55585a'],['#5a5d5f','#55585a']],w:['#3a4a50','#566a72']},
 dam:{f:[['#6a6a66','#666662'],['#5a5e60','#565a5c'],['#5a5e60','#565a5c']],w:['#555a5c','#7a8084']},
 greenhouse:{f:[['#8a8a7a','#848474'],['#8a8a7a','#848474'],['#8a8a7a','#848474']],w:['#6fa8a0','#b8e0d8']},
 cordon:{f:[['#52483a','#4d4336'],['#52483a','#4d4336'],['#52483a','#4d4336']],w:['#4a4a46','#6a6a64']},
 camp:{f:[['#4d4430','#48402d'],['#4d4430','#48402d'],['#4d4430','#48402d']],w:['#3a3a30','#5a5a4a']},
 radio:{f:[['#6a7a86','#647480'],['#445034','#3f4b30'],['#6a7a86','#647480']],w:['#8a9096','#b4bcc2']},
 casa:{f:[['#7b5b3b','#745436'],['#7b5b3b','#745436'],['#6e7a58','#68744f']],w:['#c9b999','#e4d7b8']},
 market:{f:[['#7b7b72','#75756c'],['#7b7b72','#75756c'],['#7b7b72','#75756c']],w:['#5a4a3a','#8a7358']}
};
function tpl(id){
  const base={gas:',',highway:'.',hospital:':',warehouse:'.',lab:':',military:',',police:'.',metro:'.',archive:'.',house:'.',office:':',market:'.',tower:',',observatory:',',port:'.',dam:'.',greenhouse:'.',cordon:',',camp:',',radio:','}[id];
  const G=[];for(let y=0;y<ROWS;y++)G.push(Array(COLS).fill(base));
  const F=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)G[y][x]=c};
  const Wr=(x0,y0,x1,y1,fl)=>{if(fl)F(x0+1,y0+1,x1-1,y1-1,fl);for(let x=x0;x<=x1;x++){G[y0][x]='#';G[y1][x]='#'}for(let y=y0;y<=y1;y++){G[y][x0]='#';G[y][x1]='#'}};
  const D=(x,y,c)=>{G[y][x]=c||'d'};
  const rows=(xs,y0,y1,c)=>xs.forEach(x=>F(x,y0,x,y1,c));
  if(id=='gas'){Wr(16,1,24,9,'.');D(16,5);F(18,2,22,2,'S');F(18,4,22,4,'S');F(18,6,22,6,'S');F(18,8,21,8,'K');
    F(7,2,7,3,'P');F(7,7,7,8,'P');F(11,2,11,3,'P');F(11,7,11,8,'P');F(13,9,14,9,'T');F(4,1,5,1,'C');F(13,5,14,5,'C');F(6,5,6,5,',')}
  if(id=='highway'){F(1,1,24,1,',');F(1,9,24,9,',');F(1,5,24,5,':');F(4,1,24,1,'F');F(9,1,10,1,',');F(18,1,19,1,',');F(4,9,24,9,'F');F(7,9,8,9,',');F(15,9,16,9,',');
    F(6,3,7,3,'C');F(10,7,11,7,'C');F(15,3,16,3,'C');F(20,7,21,7,'C');F(13,7,16,8,'A');F(9,4,9,4,'X');F(19,6,19,6,'X')}
  if(id=='hospital'){Wr(4,1,24,9,':');F(5,5,23,5,'.');for(const x of[9,13,17,21]){F(x,2,x,3,'#');F(x,7,x,8,'#')}F(5,4,23,4,'#');F(5,6,23,6,'#');[7,11,15,19,23].forEach(x=>{D(x,4);D(x,6)});D(4,5);
    [[5,8],[10,12],[14,16],[18,20],[22,23]].forEach(([a,b])=>{F(a,2,a+1,2,'B');F(a,8,a+1,8,'B');if(b-a>=2)F(b,2,b,2,'L')})}
  if(id=='warehouse'){for(const y of[2,4,6,8]){F(5,y,9,y,'S');F(12,y,16,y,'S');F(19,y,23,y,'S')}F(10,8,11,8,'R');F(17,5,17,5,'X');F(10,5,10,5,'X');F(4,1,5,1,'A');F(23,9,24,9,'A')}
  if(id=='lab'){Wr(4,1,24,9,':');F(10,2,10,8,'#');F(18,2,18,8,'#');D(10,3);D(10,7);D(18,5);D(18,2);D(4,5);F(5,2,8,2,'M');F(5,8,8,8,'L');F(12,3,16,3,'D');F(12,7,16,7,'D');F(14,5,14,5,'R');F(20,2,23,2,'M');F(20,8,23,8,'R');F(21,5,21,5,'D')}
  if(id=='military'){F(5,1,24,1,'F');F(5,9,24,9,'F');F(5,1,5,9,'F');F(24,1,24,9,'F');G[5][5]=',';F(8,2,8,2,'N');F(10,2,10,2,'N');F(8,8,8,8,'N');F(10,8,10,8,'N');F(13,3,13,4,'Z');F(13,6,13,7,'Z');Wr(17,3,22,7,'.');D(17,5);F(19,4,19,4,'X');F(20,6,20,6,'X');F(7,6,8,6,'C');F(15,8,16,8,'C')}
  if(id=='police'){Wr(4,1,24,9,'.');D(4,5);F(12,2,12,8,'#');D(12,5);D(12,8);F(13,4,23,4,'#');F(13,6,23,6,'#');F(18,2,18,3,'#');F(18,7,18,8,'#');D(15,4,'b');D(21,4,'b');D(15,6);D(21,6);F(6,3,9,3,'K');F(6,7,6,7,'D');F(8,7,8,7,'D');F(14,8,17,8,'L');F(20,8,23,8,'L');F(14,2,14,2,'L')}
  if(id=='metro'){F(1,3,24,4,'r');F(1,7,24,8,'r');F(8,1,10,1,'Q');F(15,1,17,1,'Q');for(const x of[8,13,18,23])F(x,5,x,5,'R');F(12,3,17,4,'A');F(21,9,23,9,'Q')}
  if(id=='archive'){for(const x of[6,8,10,12,14,16,18,20,22]){F(x,2,x,4,'S');F(x,6,x,8,'S')}F(4,2,4,3,'D');F(24,5,24,5,'X')}
  if(id=='house'){Wr(4,1,24,9,'.');D(4,5);F(11,2,11,8,'#');F(17,2,17,8,'#');D(11,5);D(11,2);D(17,5);D(17,8);F(6,2,8,2,'U');F(8,6,9,6,'D');F(13,2,15,2,'K');F(14,6,14,6,'D');F(19,2,20,2,'B');F(19,8,20,8,'B');F(23,3,23,3,'L');F(5,8,5,8,'V');F(10,8,10,8,'V')}
  if(id=='office'){Wr(4,1,24,9,':');D(4,5);for(const y of[3,7]){F(6,y,9,y,'D');F(12,y,15,y,'D');F(18,y,21,y,'D')}F(23,2,23,3,'M');F(5,2,5,2,'V');F(23,8,23,8,'V')}
  if(id=='market'){Wr(4,1,24,9,'.');D(4,5);for(const x of[7,9,11,13,15,17]){F(x,2,x,4,'S');F(x,6,x,8,'S')}F(21,2,21,3,'K');F(21,7,21,8,'K');F(23,2,23,8,'L');G[5][23]='.'}
  if(id=='tower'){Wr(14,3,20,7,'.');D(14,5);F(17,5,17,5,'Y');F(22,2,22,2,'R');F(22,8,22,8,'R');F(11,3,11,3,'H');F(11,7,11,7,'H');F(7,2,8,2,'C');F(10,1,10,3,'F');F(10,7,10,9,'F');F(16,3,16,3,'X');F(19,7,19,7,'X')}
  if(id=='observatory'){Wr(13,2,22,8,':');D(13,5);F(18,5,18,5,'O');F(15,3,15,3,'D');F(20,7,20,7,'D');F(15,7,15,7,'M');F(21,3,21,3,'M');F(6,2,7,2,'Q');F(6,8,7,8,'Q');F(9,5,9,5,'V');F(10,2,10,2,'V');F(10,8,10,8,'V');F(24,5,24,5,'H')}
  if(id=='port'){F(1,1,24,2,'W');F(6,4,9,4,'A');F(6,6,9,6,'A');F(12,3,15,3,'A');F(12,7,15,7,'A');F(18,4,21,4,'A');F(18,6,21,6,'A');F(16,5,16,5,'R');F(10,8,10,8,'H');F(22,8,22,8,'H');F(23,3,23,3,'X')}
  if(id=='dam'){Wr(5,2,11,8,':');D(5,5);F(7,3,9,3,'M');F(7,7,9,7,'D');F(14,3,14,3,'R');F(14,7,14,7,'R');F(16,2,16,2,'R');F(16,8,16,8,'R');F(20,1,24,9,'W');F(19,2,19,8,'F');G[5][19]='.';F(18,4,18,4,'H');F(18,6,18,6,'H');F(13,5,13,5,'X')}
  if(id=='greenhouse'){Wr(4,1,24,9,'.');D(4,5);for(const y of[2,4,6,8]){F(6,y,10,y,'E');F(14,y,18,y,'E');F(21,y,23,y,'E')}F(12,5,12,5,'H');F(20,5,20,5,'D');F(5,9,5,9,'V')}
  if(id=='cordon'){F(12,1,12,9,'J');F(12,3,12,3,',');F(12,7,12,7,',');F(11,2,11,2,'Z');F(13,2,13,2,'Z');F(11,8,11,8,'Z');F(13,8,13,8,'Z');F(7,2,8,2,'C');F(7,8,8,8,'C');F(16,4,16,4,'H');F(16,6,16,6,'H');F(19,3,19,3,'X');F(19,7,19,7,'X');F(21,4,21,4,'X');F(23,1,23,9,'F');G[5][23]=','}
  if(id=='camp'){for(const[x,y]of[[8,2],[10,2],[12,2],[8,8],[10,8],[12,8],[16,3],[18,3],[16,7],[18,7],[21,2],[21,8]])F(x,y,x,y,'N');F(14,5,14,5,'H');F(13,5,13,5,'H');F(5,1,24,1,'F');F(5,9,24,9,'F');F(24,1,24,9,'F');F(5,1,5,3,'F');F(5,7,5,9,'F');F(21,5,22,5,'C');F(15,5,15,5,'Z')}
  if(id=='radio'){Wr(15,2,23,8,':');D(15,5);F(17,3,21,3,'M');F(17,7,17,7,'D');F(20,7,20,7,'D');F(11,5,11,5,'Y');F(12,2,12,2,'R');F(12,8,12,8,'R');F(7,2,8,2,'C');F(7,8,7,8,'H');F(9,4,9,4,'X')}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(x==0||y==0||x==COLS-1||y==ROWS-1)G[y][x]='#';
  F(1,4,3,6,base=='.'||base==','||base==':'?base:'.');
  return G}
/* ---------- variantes procedurales (misiones secundarias y de la Villa) ----------
   Las plantillas fijas de tpl() quedan reservadas a la historia. Aquí cada visita genera un plano distinto. */
const VBASE={gas:',',highway:'.',hospital:':',warehouse:'.',lab:':',military:',',police:'.',metro:'.',archive:'.',house:'.',casa:'.',office:':',market:'.',tower:',',observatory:',',port:'.',dam:'.',greenhouse:'.',cordon:',',camp:',',radio:','};
const VPI={};
function propInfo(id){const src=id=='casa'?'house':id;if(VPI[id])return VPI[id];const G=tpl(src),cnt={};G.forEach((r,y)=>r.forEach((c,x)=>{if(x&&y&&x<COLS-1&&y<ROWS-1&&!'#.,:rdb'.includes(c))cnt[c]=(cnt[c]||0)+1}));
  const fence=['F','J'].find(c=>cnt[c])||null,pal=Object.keys(cnt).filter(c=>!'FJW'.includes(c));if(!pal.length)pal.push('X');
  return VPI[id]={base:VBASE[id]||'.',pal,w:pal.map(c=>cnt[c]),fence}}
function vtpl(id,R,SUB){const ri=(a,b)=>a+Math.floor(R()*(b-a+1)),pk=a=>a[ri(0,a.length-1)],I=propInfo(id),base=I.base,fl=base==','?'.':base;
  const G=[];for(let y=0;y<ROWS;y++)G.push(Array(COLS).fill(base));
  const F=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>0&&y>0&&x<COLS-1&&y<ROWS-1)G[y][x]=c};
  const Wr=(x0,y0,x1,y1,f)=>{F(x0+1,y0+1,x1-1,y1-1,f);for(let x=x0;x<=x1;x++){G[y0][x]='#';G[y1][x]='#'}for(let y=y0;y<=y1;y++){G[y][x0]='#';G[y][x1]='#'}};
  const doors=[],D=(x,y)=>{G[y][x]='d';doors.push([x,y])};
  const wp=()=>{let t=I.w.reduce((a,b)=>a+b,0),r=R()*t,i=0;for(;i<I.pal.length-1;i++){r-=I.w[i];if(r<=0)break}return I.pal[i]};
  const free=(x,y)=>G[y]&&'.,:'.includes(G[y][x])&&!doors.some(([a,b])=>Math.abs(a-x)<=1&&Math.abs(b-y)<=1)&&!(x<=4&&y>=3&&y<=7);
  const reach=()=>{const seen=new Set(['3,5']),q=[[3,5]];while(q.length){const[x,y]=q.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const X=x+a,Y=y+b;if(Y>=0&&Y<ROWS&&X>=0&&X<COLS&&'.,:rdb'.includes(G[Y][X])&&!seen.has(X+','+Y)){seen.add(X+','+Y);q.push([X,Y])}})}return seen.size};
  const scatter=(x0,y0,x1,y1,n,chars)=>{let r0=reach();for(let i=0,t=0;i<n&&t<n*6;t++){const x=ri(x0,x1),y=ri(y0,y1);if(free(x,y)){const o=G[y][x];G[y][x]=chars?pk(chars):wp();if(reach()!==r0-1)G[y][x]=o;else{r0--;i++}}}};
  const home=id=='casa',ROOM={bed:['B','U','B','L'],kit:['K','K','D'],liv:['D','V','L','U'],bath:['L','V'],gen:null},rp=(t)=>ROOM[t]&&ROOM[t].filter(c=>I.pal.includes(c)).length?ROOM[t].filter(c=>I.pal.includes(c)):null;
  const styles=home?['home','home','home','row','yard']:id=='highway'||id=='port'||id=='dam'||id=='metro'?['yard','rows']:id=='warehouse'||id=='market'||id=='archive'||id=='greenhouse'?['rows','block','twin','yard']:['block','corridor','twin','yard','block','corridor'];

  const st=pk(styles);
  const fence=(x0,y0,x1,y1,gap)=>{if(!I.fence)return;const c=I.fence;F(x0,y0,x1,y0,c);F(x0,y1,x1,y1,c);F(x0,y0,x0,y1,c);F(x1,y0,x1,y1,c);if(gap)gap.forEach(([x,y])=>{G[y][x]=base})};
  if(id=='casa'){const SUBS=['abandonada','chalet','granja','cabana','bloque','pueblo','campo'],sub=SUBS.includes(SUB)?SUB:pk(SUBS),RT=['liv','kit','bed','bed','bath','bed'];
    const split=(x0,y0,x1,y1,dp)=>{const w=x1-x0+1,h=y1-y0+1;if(dp<=0||(w<6&&h<5))return[[x0,y0,x1,y1]];
      const nearD=(v,hor)=>doors.some(([a,b])=>hor?(Math.abs(b-v)<=1&&(a==x0-1||a==x1+1)):(Math.abs(a-v)<=1&&(b==y0-1||b==y1+1)));
      if(w>=h&&w>=7){let x=ri(x0+2,x1-2),k=0;while(nearD(x,0)&&k++<10)x=ri(x0+2,x1-2);if(nearD(x,0))return[[x0,y0,x1,y1]];F(x,y0,x,y1,'#');D(x,ri(y0,y1));return split(x0,y0,x-1,y1,dp-1).concat(split(x+1,y0,x1,y1,dp-1))}
      if(h>=5){let y=ri(y0+1,y1-1),k=0;while(nearD(y,1)&&k++<10)y=ri(y0+1,y1-1);if(nearD(y,1))return[[x0,y0,x1,y1]];F(x0,y,x1,y,'#');D(ri(x0,x1),y);return split(x0,y0,x1,y-1,dp-1).concat(split(x0,y+1,x1,y1,dp-1))}return[[x0,y0,x1,y1]]};
    const furn=(rs,dn)=>{let t=ri(0,5);rs.forEach(([a,b,c,d])=>{const ty=RT[t++%RT.length],ok=rp(ty);scatter(a,b,c,d,Math.max(2,Math.round((c-a+1)*(d-b+1)/(dn||6))),ok||undefined)})};
    const house=(x0,y0,w,h,dp,door)=>{Wr(x0,y0,x0+w,y0+h,fl);D(door=='r'?x0+w:x0,ri(y0+Math.min(1,h-1),y0+h-1));const rs=split(x0+1,y0+1,x0+w-1,y0+h-1,dp);furn(rs);return rs};
    const only=(a,c)=>{const l=a.filter(q=>I.pal.includes(q));return l.length?l:c};
    if(sub=='abandonada'){const w=ri(10,16),h=ri(6,8);house(ri(5,24-w),ri(1,9-h),w,h,ri(2,3));scatter(5,1,24,9,ri(3,8),['X','X','A','V'])}
    else if(sub=='chalet'){const px0=ri(5,6),px1=ri(22,24);fence(px0,1,px1,9,[[px0,5]]);const w=ri(8,10),h=ri(5,6),hx=px0+ri(2,3),hy=ri(2,3);house(hx,hy,w,h,2);
      const gx=hx+w+1;if(gx+5<px1){Wr(gx,hy+1,gx+4,hy+h,fl);D(gx,hy+2);F(gx+1,hy+2,gx+3,hy+3,fl);G[hy+2][gx+2]='C';G[hy+3][gx+2]='C'}
      scatter(px0+1,1,px1-1,9,ri(5,10),['V','V','V','X']);F(px0+1,5,hx-1,5,fl)}
    else if(sub=='granja'){const hx=ri(5,6);house(hx,ri(1,2),7,ri(5,6),2);const bx=hx+9,bw=ri(8,24-bx);Wr(bx,ri(1,2),bx+bw,ri(7,8),fl);const by0=0;let yy=1;while(G[yy][bx]!='#'&&yy<9)yy++;D(bx,5);scatter(bx+1,2,bx+bw-1,7,ri(8,14),['A','A','H','X','C']);
      {const cx=Math.min(21,bx+bw+2);for(let y=2;y<=8;y+=2)F(cx,y,22,y,'E')}fence(hx-1>4?hx-1:5,0,24,10,[]);G[5][5]=base;scatter(5,1,24,9,ri(2,5),['V','X'])}
    else if(sub=='cabana'){const w=ri(6,9),h=ri(4,6);house(ri(7,24-w),ri(1,9-h),w,h,ri(0,1));scatter(5,1,24,9,ri(3,8),['V','V','X'])}
    else if(sub=='bloque'){const x0=ri(4,6),x1=ri(19,22),cy=ri(4,6);Wr(x0,1,x1,9,fl);D(x0,cy);D(x1,cy);for(let x=x0+1;x<x1;x++){G[cy-1][x]='#';G[cy+1][x]='#'}const tops=[],bots=[];let x=x0+1;while(x<x1-2){const e=Math.min(x1-1,x+ri(3,5));if(e>x){tops.push([x,2,e-1,cy-2]);bots.push([x,cy+2,e-1,8]);if(e<x1-1){F(e,2,e,cy-2,'#');F(e,cy+2,e,8,'#')}D(Math.min(e-1,x+1),cy-1);D(Math.min(e-1,x+1),cy+1)}x=e+1}
      furn(tops.concat(bots),5);scatter(x0+1,cy,x1-1,cy,ri(0,2),['X','A'])}
    else if(sub=='pueblo'){const n=ri(2,4);let x=ri(5,6);for(let i=0;i<n&&x<20;i++){const w=ri(5,7),up=R()<.55,y0=up?1:6,y1=up?4:9;Wr(x,y0,x+w,y1,fl);D(x+ri(1,w-1),up?4:6);furn([[x+1,up?2:7,x+w-1,up?3:8]],3);x+=w+ri(0,1)}scatter(5,5,24,5,ri(2,4),['C','X'])}
    else{const hx=ri(5,7);house(hx,ri(2,3),ri(7,9),ri(4,5),2);const sx=hx+ri(11,12);if(sx+5<24){Wr(sx,ri(2,3),sx+5,ri(7,8),fl);D(sx,5);scatter(sx+1,3,sx+4,6,ri(3,6),['A','X','H'])}fence(5,1,24,9,[[5,5],[24,5]]);{const cx=Math.min(19,hx+ri(10,12));for(let y=2;y<=8;y+=2)F(cx,y,22,y,'E')}scatter(5,1,24,9,ri(2,5),['V','X'])}
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(x==0||y==0||x==COLS-1||y==ROWS-1)G[y][x]='#';F(1,4,3,6,fl);return G}
  if(st=='block'){const x0=ri(5,8),x1=ri(16,24),y0=ri(1,2),y1=ri(8,9);Wr(x0,y0,x1,y1,fl);D(x0,ri(4,6));const nv=ri(0,2);let xs=[x0];for(let i=0;i<nv;i++){const x=ri(x0+4,x1-4);if(xs.every(q=>Math.abs(q-x)>3)){xs.push(x);F(x,y0+1,x,y1-1,'#');D(x,ri(y0+2,y1-2))}}
    if(R()<.5){const y=ri(y0+3,y1-3);const a=pk(xs.concat([x0])),b=a==xs[xs.length-1]?x1:pk(xs.filter(q=>q>a).concat([x1]));for(let x=a+1;x<b;x++)if(G[y][x]!='d')G[y][x]='#';D(ri(a+1,b-1),y)}
    scatter(x0+1,y0+1,x1-1,y1-1,ri(10,20));scatter(5,1,24,9,ri(2,6));if(I.fence&&R()<.4)F(x1+1>24?24:x1+1,y0,x1+1>24?24:x1+1,y1,I.fence)}
  else if(st=='corridor'){const x0=ri(4,6),x1=ri(21,24),cy=ri(4,6);Wr(x0,1,x1,9,fl);D(x0,cy);for(let x=x0+1;x<x1;x++){G[cy-1][x]='#';G[cy+1][x]='#'}for(let x=x0+2;x<x1-1;x+=ri(3,4)){D(x,cy-1);D(x,cy+1)}
    for(let x=x0+3;x<x1-1;x+=ri(4,5)){F(x,2,x,cy-2,'#');F(x,cy+2,x,8,'#')}scatter(x0+1,2,x1-1,cy-2,ri(6,10));scatter(x0+1,cy+2,x1-1,8,ri(6,10));scatter(x0+1,cy,x1-1,cy,ri(0,2))}
  else if(st=='twin'){const a0=ri(5,6),a1=ri(10,12),b0=ri(15,17),b1=ri(21,24);Wr(a0,ri(1,3),a1,ri(7,9),fl);Wr(b0,ri(1,3),b1,ri(7,9),fl);D(a0,5);D(a1,ri(4,6));D(b0,ri(4,6));D(b1,5);F(a1+1,5,b0-1,5,fl);G[5][a1]='d';
    scatter(a0+1,2,a1-1,8,ri(5,9));scatter(b0+1,2,b1-1,8,ri(5,9));scatter(a1+1,1,b0-1,9,ri(3,6));if(I.fence)fence(a1+1,1,b0-1,9,[[a1+1,5],[b0-1,5]])}
  else if(st=='rows'){const main=I.pal[0],horiz=R()<.5;if(horiz){for(let y=ri(2,3);y<=8;y+=2){let x=ri(5,7);while(x<24){const l=ri(2,5);F(x,y,Math.min(23,x+l),y,R()<.8?main:wp());x+=l+ri(2,3)}}}
    else{for(let x=ri(6,8);x<=23;x+=ri(2,3)){let y=1;while(y<9){const l=ri(2,4);F(x,y,x,Math.min(9,y+l),R()<.8?main:wp());y+=l+ri(2,3)}}}
    scatter(5,1,24,9,ri(4,9));if(I.fence&&R()<.5)fence(5,1,24,9,[[5,5]])}
  else if(st=='yard'){const nb=ri(1,3);for(let i=0;i<nb;i++){const w=ri(4,6),h=ri(3,4),x0=ri(6,24-w),y0=ri(1,9-h);if(G[y0][x0]!='#'&&free(x0,y0)){Wr(x0,y0,x0+w,y0+h,fl);const sd=ri(0,3);if(sd==0)D(x0,y0+ri(1,h-1));else if(sd==1)D(x0+w,y0+ri(1,h-1));else if(sd==2)D(x0+ri(1,w-1),y0);else D(x0+ri(1,w-1),y0+h);scatter(x0+1,y0+1,x0+w-1,y0+h-1,ri(2,5))}}
    scatter(5,1,24,9,ri(10,20));if(I.fence&&R()<.6)fence(5,1,24,9,[[5,ri(3,7)],[24,ri(3,7)]])}
  else if(st=='home'){const w=ri(10,16),h=ri(6,8),x0=ri(6,24-w),y0=ri(1,9-h),x1=x0+w,y1=y0+h;Wr(x0,y0,x1,y1,fl);D(x0,ri(Math.max(y0+1,4),Math.min(y1-1,6)));
    const mid=ri(x0+4,x1-4),my=ri(y0+2,y1-2);F(mid,y0+1,mid,y1-1,'#');D(mid,ri(y0+1,y1-1));const ys=ri(y0+2,y1-2);if(R()<.7){for(let x=mid+1;x<x1;x++)G[ys][x]='#';D(ri(mid+1,x1-1),ys)}
    const rooms=[[x0+1,y0+1,mid-1,y1-1,pk(['liv','kit','bed'])],[mid+1,y0+1,x1-1,ys-1,pk(['bed','bath','kit'])],[mid+1,ys+1,x1-1,y1-1,pk(['bed','liv','bath'])]];
    rooms.forEach(([a,b,c,d,t])=>{if(c>=a&&d>=b)scatter(a,b,c,d,Math.max(2,Math.round((c-a+1)*(d-b+1)/6)),rp(t)||undefined)});
    if(R()<.5)scatter(x1+1,y0,24,y1,ri(2,4),I.pal.filter(c=>'VX'.includes(c)).length?I.pal.filter(c=>'VX'.includes(c)):undefined);scatter(5,1,x0-1,9,ri(1,3),['V'].filter(c=>I.pal.includes(c)).length?['V']:undefined)}
  else if(st=='row'){const n=ri(2,3);let x=ri(5,6);for(let i=0;i<n&&x<22;i++){const w=ri(5,7),h=ri(4,6),y0=ri(1,9-h);Wr(x,y0,x+w,y0+h,fl);if(i==0)D(x,ri(y0+1,y0+h-1));else D(x,ri(y0+1,y0+h-1));D(x+w,ri(y0+1,y0+h-1));scatter(x+1,y0+1,x+w-1,y0+h-1,ri(3,6),rp(pk(['bed','kit','liv'])||'gen')||undefined);x+=w+ri(1,2)}scatter(5,1,24,9,ri(1,3))}
  /* conexión entre el punto de partida y el primer edificio */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(x==0||y==0||x==COLS-1||y==ROWS-1)G[y][x]='#';
  F(1,4,3,6,fl);return G}
function buildTheme(th,R,ri,GG){
  const T=GG||tpl(th),g=[],fv=[],pr=[],dc=[];
  for(let y=0;y<ROWS;y++){g.push(new Uint8Array(COLS));fv.push(new Uint8Array(COLS));pr.push(Array(COLS).fill(null));dc.push(Array(COLS).fill(null))}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=T[y][x];
    if(c=='#')g[y][x]=1;else if('.,:r'.includes(c)||c=='d'||c=='b'){fv[y][x]=c==','?1:c==':'?2:c=='r'?3:0;if(c=='d'||c=='b')dc[y][x]=c}
    else{g[y][x]=3;pr[y][x]=c;fv[y][x]=T[y][x-1]&&'.,:r'.includes(T[y][x-1])?(T[y][x-1]==','?1:T[y][x-1]==':'?2:0):0}}
  const fl=[];for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++)if(!g[y][x])fl.push([x,y]);
  const seen=new Set(['3,5']),q=[[3,5]];while(q.length){const[x,y]=q.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const k=(x+a)+','+(y+b);if(y+b>=0&&y+b<ROWS&&x+a>=0&&x+a<COLS&&!g[y+b][x+a]&&!seen.has(k)){seen.add(k);q.push([x+a,y+b])}})}
  if(seen.size<fl.length*.97)return null;
  return{g,fv,pr,dc}}

/* ---------- objetivos variados ---------- */
const MODES=['defend','escort','rescue','sabotage'];
function modeTile(M0,xa,xb,avoid,md){const R=Math.random;for(let i=0;i<120;i++){const x=xa+Math.floor(R()*(xb-xa+1)),y=1+Math.floor(R()*(ROWS-2));if(M0.g[y][x])continue;if(avoid.some(o=>Math.hypot(o.x-x-.5,o.y-y-.5)<md))continue;if(bfs(M0,3,5,x,y))return{x:x+.5,y:y+.5}}return null}
function setMode(M0,e){const z=e.z;if(e.step!==0||z.mode==='none')return;let k=z.mode;if(!k){if(z.chap===undefined||z.chap<3)return;k=(window.BOSSMAP&&BOSSMAP[z.chap])?'boss':MODES[Math.floor(z.chap/2)%4]}
  const av=M0.pois.concat(M0.units.map(u=>({x:u.x,y:u.y})));let tg;
  if(k==='defend'){tg=modeTile(M0,Math.floor(COLS*.4),Math.floor(COLS*.6),av,2);if(!tg)return;M0.mo={k,tg,t:0,need:45,wave:6,txt:'Defiende la posición',brief:'Objetivo: mantener la posición marcada 45 s mientras llegan oleadas.'}}
  else if(k==='escort'){tg=modeTile(M0,COLS-8,COLS-3,av,2);if(!tg)return;const v={p:{arm:'soldado',hp:90,injury:0,n:'Superviviente'},ally:1,vip:1,dmg:5,rate:1.1,mhp:90,x:2.3,y:4.2,path:[],pt:0,cd:0,fa:0};(M0.ally=M0.ally||[]).push(v);M0.mo={k,tg,vip:v,txt:'Escolta al superviviente hasta la marca',brief:'Objetivo: escoltar a un superviviente herido hasta el punto marcado. Si muere, el botín se reduce a la mitad.'}}
  else if(k==='rescue'){tg=modeTile(M0,COLS-8,COLS-3,av,2);if(!tg)return;M0.mo={k,tg,t:0,lim:140,txt:'Rescata al prisionero',brief:'Objetivo: llegar al prisionero antes de 140 s o llegarán refuerzos.'}}
  else if(k==='boss'){tg=modeTile(M0,COLS-7,COLS-3,av,2);if(!tg)return;const ks=Object.keys(window.BOSS||{});if(!ks.length)return;const bk=(window.BOSSMAP&&BOSSMAP[z.chap])||ks[Math.floor(z.chap/5)%ks.length],lvl=lvlOf(S.exp.z),hp=Math.round(ZT[bk].hp*(.5+.04*lvl));const bz={t:bk,x:tg.x,y:tg.y,hp,mhp:hp,st:0,path:[],pt:0,dm:.9+.05*lvl,cd:1,boss:1};M0.en.push(bz);M0.mo={k,boss:bz,txt:'Abate al jefe: '+BOSS[bk].n,brief:(BOSS[bk].lore?BOSS[bk].lore+' ':'')+'Objetivo: abatir a '+BOSS[bk].n+'. Es mucho más resistente y usa habilidades propias. Al caer deja aleación.'}}
  else{let a,b;for(let i=0;i<8&&!b;i++){a=modeTile(M0,10,COLS-4,av,2);if(a)for(let j=0;j<25&&!b;j++){const c=modeTile(M0,10,COLS-4,av.concat([a]),2);if(c&&Math.hypot(c.x-a.x,c.y-a.y)>=5)b=c}}/* antes pedía 5 casillas de TODOS los puntos de interés: en los cap. 7, 16, 24 y 31 nunca cabía y se quedaban sin objetivo */if(!a||!b)return;M0.mo={k:'sabotage',ch:[{x:a.x,y:a.y,p:0},{x:b.x,y:b.y,p:0}],txt:'Coloca las cargas',brief:'Objetivo: colocar 2 cargas (3 s cada una). Cada carga atrae a los infectados.'}}
  M0.mo.done=0}
function moSpawn(n,E){const e=S.exp,lvl=lvlOf(e.z),hpM=(.85+.035*lvl)*(S.adv&&S.adv.weather===3?1.15:1),dmM=(.85+.025*lvl)*(S.adv&&S.adv.weather===3?1.15:1);const f=[];for(let y=1;y<ROWS-1;y++)for(let x=Math.floor(COLS*.55);x<COLS-1;x++)if(!M.g[y][x]&&M.vis[y*COLS+x]!=2)f.push([x,y]);
  for(let i=0;i<n&&f.length;i++){const t=f.splice(Math.floor(Math.random()*f.length),1)[0],ty=mixType(lvl,Math.random,themeOf(e)),hp=Math.round(ZT[ty].hp*hpM);M.en.push({t:ty,x:t[0]+.5,y:t[1]+.5,hp,mhp:hp,st:1,path:[],pt:0,dm:dmM,cd:1})}}
function moDone(txt){const m=M.mo;m.done=1;toast('Objetivo cumplido: '+txt+'. Ya puedes investigar los eventos.');M.units.forEach(u=>{if(!u.dead)addFl(M,u.x,u.y,'Objetivo','#ffd877')})}
function modeStep(dt,al){const m=M.mo;if(!m||m.done)return;const e=S.exp,lvl=lvlOf(e.z),near=(o,r)=>al.some(u=>Math.hypot(u.x-o.x,u.y-o.y)<r);
  if(m.k==='defend'){if(near(m.tg,4.5)){m.t+=dt;m.wave-=dt;if(m.wave<=0){m.wave=11;moSpawn(2+Math.floor(lvl/5)+(m.t>25?1:0))}if(m.t>=m.need)moDone('posición mantenida')}}
  else if(m.k==='escort'){const v=m.vip;if(v.p.hp<=0){if(!m.lost){m.lost=1;for(const k in e.loot)e.loot[k]*=.5;toast('El superviviente ha muerto: botín reducido.');m.done=1}return}
    m.t=(m.t||0)+dt;if(m.t>14&&!m.spawned){m.spawned=1;moSpawn(3+Math.floor(lvl/6))}if(Math.hypot(v.x-m.tg.x,v.y-m.tg.y)<2.2&&near(m.tg,3))moDone('superviviente a salvo')}
  else if(m.k==='boss'){if(m.boss.hp<=0){const a=14+Math.floor(lvl/2);e.loot.alloy=(e.loot.alloy||0)+a;moDone('jefe abatido (+'+a+' aleación)')}}
  else if(m.k==='rescue'){m.t+=dt;if(m.t>m.lim){m.lim+=18;moSpawn(3);toast('Llegan refuerzos.')}if(near(m.tg,1.5)){moDone('prisionero liberado');M.ally.push({p:{arm:'soldado',hp:60,injury:0,n:'Prisionero'},ally:1,dmg:4,rate:1.2,mhp:60,x:m.tg.x,y:m.tg.y,path:[],pt:0,cd:0,fa:0})}}
  else{let all=1;m.ch.forEach(c=>{if(c.p>=3)return;all=0;if(near(c,1.6)){c.p+=dt;if(c.p>=3){c.p=3;moSpawn(3);alert_(c.x,c.y,10);addFl(M,c.x,c.y,'Carga colocada','#ffd877')}}else c.p=Math.max(0,c.p-dt*.5)});if(all)moDone('cargas colocadas')}}
function moTxt(){const m=M.mo;if(!m)return'';if(m.done)return'';if(m.k==='defend')return m.txt+' '+Math.floor(m.t)+'/'+m.need+' s';if(m.k==='rescue')return m.txt+(m.t<m.lim?' · '+Math.ceil(m.lim-m.t)+' s':' · refuerzos');if(m.k==='sabotage')return m.txt+' '+m.ch.filter(c=>c.p>=3).length+'/2';return m.txt}
function drawMo(){const m=M.mo;if(!m||m.done)return;const pulse=(x,y,col,lab,prog)=>{const k=(M.t*.9)%1,px=x*ts,py=y*ts;cx.strokeStyle=col;cx.lineWidth=2.5;cx.beginPath();cx.arc(px,py,ts*(.5+k*.6),0,7);cx.stroke();cx.fillStyle=col;cx.beginPath();cx.arc(px,py,ts*.2,0,7);cx.fill();if(prog>0){cx.lineWidth=4;cx.beginPath();cx.arc(px,py,ts*.62,-Math.PI/2,-Math.PI/2+Math.PI*2*prog);cx.stroke()}cx.fillStyle='#fff';cx.font='bold '+Math.round(ts*.26)+'px sans-serif';cx.textAlign='center';cx.fillText(lab,px,py-ts*.85)};
  if(m.k==='defend'){cx.strokeStyle='rgba(120,200,255,.35)';cx.lineWidth=2;cx.setLineDash([6,5]);cx.beginPath();cx.arc(m.tg.x*ts,m.tg.y*ts,ts*4.5,0,7);cx.stroke();cx.setLineDash([]);pulse(m.tg.x,m.tg.y,'#6cc4ff','POSICIÓN',m.t/m.need)}
  else if(m.k==='escort')pulse(m.tg.x,m.tg.y,'#6cff9a','DESTINO',0);
  else if(m.k==='rescue'){pulse(m.tg.x,m.tg.y,'#ffb04a','PRISIONERO',0);const x=m.tg.x*ts,y=m.tg.y*ts;cx.fillStyle='#d8a878';cx.beginPath();cx.arc(x,y-ts*.1,ts*.16,0,7);cx.fill()}
  else if(m.k==='sabotage')m.ch.forEach(c=>{if(c.p<3)pulse(c.x,c.y,'#ff6a4a','CARGA',c.p/3)})}
function gen(e){
  let th=themeOf(e);let T=null;const story=e.z.chap!==undefined;
  if(!story&&e.seed===undefined)e.seed=Math.floor(Math.random()*1e9);
  if(th&&PAL[th]){const sk=e.z.n+':'+(e.dist||1)+':'+e.step+(story?'':':'+e.seed);
    if(story){const R=rngS(sk);T=buildTheme(th,R,(a,b)=>a+Math.floor(R()*(b-a+1)))}
    else{if(th=='house')th='casa';for(let i=0;i<14&&!T;i++){const R=rngS(sk+':'+i);T=buildTheme(th,R,(a,b)=>a+Math.floor(R()*(b-a+1)),vtpl(th,R,e.z.sub))}if(!T){th=themeOf(e);if(th=='casa')th='house';const R=rngS(sk);T=buildTheme(th,R,(a,b)=>a+Math.floor(R()*(b-a+1)))}}}
  const M0=genDefault(e,T);unPocket(M0);M0.theme=T?th:null;M0.pal=T?PAL[th]:null;if(T){M0.fv=T.fv;M0.pr=T.pr;M0.dc=T.dc}
  setMode(M0,e);try{dangerInit(M0,e)}catch(er){}return M0}
/* Huecos cerrados por paredes: lo que cae dentro (coches, cajas, enemigos…) se mueve a la casilla alcanzable más cercana, para que todo se pueda coger o abatir */
function unPocket(M){try{const R=new Uint8Array(COLS*ROWS),q=[];const sol=(x,y)=>x<0||y<0||x>=COLS||y>=ROWS||M.g[y][x]>0;
  (M.units||[]).forEach(u=>{const x=Math.floor(u.x),y=Math.floor(u.y);if(!sol(x,y)&&!R[y*COLS+x]){R[y*COLS+x]=1;q.push([x,y])}});if(!q.length)return;
  for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(sol(nx,ny)||R[ny*COLS+nx])continue;R[ny*COLS+nx]=1;q.push([nx,ny])}}
  const used=new Set();const all=['pois','crates','cars','meds','barrels','en'];all.forEach(k=>(M[k]||[]).forEach(o=>used.add(Math.floor(o.x)+','+Math.floor(o.y))));
  const near=(o,r)=>{for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(R[y*COLS+x]&&Math.hypot(x+.5-o.x,y+.5-o.y)<r)return true;return false};
  all.forEach(k=>(M[k]||[]).forEach(o=>{if(near(o,k==='en'?.8:1.3))return;let best=null,bd=1e9;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!R[y*COLS+x]||used.has(x+','+y)||x<5)continue;const d=Math.hypot(x+.5-o.x,y+.5-o.y);if(d<bd){bd=d;best=[x,y]}}
   if(best){used.delete(Math.floor(o.x)+','+Math.floor(o.y));o.x=best[0]+.5;o.y=best[1]+.5;used.add(best[0]+','+best[1])}}))}catch(e){}}
const solid=(M,x,y)=>x<0||y<0||x>=COLS||y>=ROWS||M.g[y][x]>0;
function bfs(M,sx,sy,tx,ty){
  sx=Math.floor(sx);sy=Math.floor(sy);tx=Math.floor(tx);ty=Math.floor(ty);if(solid(M,tx,ty))return null;
  const prev=new Int32Array(COLS*ROWS).fill(-1),q=[sy*COLS+sx];prev[sy*COLS+sx]=sy*COLS+sx;
  for(let h=0;h<q.length;h++){const c=q[h],x=c%COLS,y=(c/COLS)|0;if(x==tx&&y==ty)break;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(solid(M,nx,ny))continue;const k=ny*COLS+nx;if(prev[k]<0){prev[k]=c;q.push(k)}}}
  const tk=ty*COLS+tx;if(prev[tk]<0)return null;const out=[];let c=tk;while(c!==sy*COLS+sx){out.push([(c%COLS)+.5,((c/COLS)|0)+.5]);c=prev[c]}return out.reverse()}
function nearTiles(M,tx,ty,n){const out=[],seen=new Set(),q=[[Math.floor(tx),Math.floor(ty)]];seen.add(q[0].join());for(let h=0;h<q.length&&out.length<n;h++){const[x,y]=q[h];if(!solid(M,x,y))out.push([x+.5,y+.5]);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(!seen.has(k)&&!solid(M,x+a,y+b)){seen.add(k);q.push([x+a,y+b])}}}return out}
function moveTo(M,u,x,y){const p=bfs(M,u.x,u.y,x,y);if(p)u.path=p}
const selected=u=>!M.sel||M.sel.has(u);
const isAl=u=>u.p.hp>0&&!u.dead;
function order(x,y){const al=M.units.filter(u=>isAl(u)&&selected(u));const ts_=nearTiles(M,x,y,al.length);al.forEach((u,i)=>{const t=ts_[i]||ts_[0];if(t){moveTo(M,u,t[0],t[1]);u.home=[t[0],t[1]]}})}
function dmgOf(p){const c=CL[p.arm||'soldado'];return c.dmg+(p.wp?p.wp.v*.6:0)+p.lvl*.8+(p.sk||0)*.3+(p.at?p.at.f*.5:0)}
function rngOf(p){return Math.max(1.8,Math.min(6.5,CL[p.arm||'soldado'].rng*.95+(p.wp&&/rifle|ballesta|carabina|francotirador/i.test(p.wp.n)?1.2:0)))}
function addFl(M,x,y,t,c){M.fl.push({x,y,t,c,l:1})}
const vrOf=u=>u.p.arm=='expl'?8.5:6.5;
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.3);for(let i=1;i<n;i++){const t=i/n,x=Math.floor(x0+(x1-x0)*t),y=Math.floor(y0+(y1-y0)*t);if(M.g[y]&&M.g[y][x]===1)return false}return true}
function alert_(x,y,rad){if(M&&!M.pv&&M.dg!==undefined)M.dg=Math.min(100,M.dg+.35);M.en.forEach(z=>{if(!z.st&&Math.hypot(z.x-x,z.y-y)<rad)z.st=1})}
function killZ(z){const zt=ZT[z.t],e=S.exp;if(window.ZX&&ZX.mk)ZX.mk(z,M);if(z.flag&&z.band&&window.BANDS){const bb=BANDS[z.band];e.loot.metal=(e.loot.metal||0)+15;addFl(M,z.x,z.y-.8,'Estandarte de '+bb.n+' +15 metal',bb.acc)}if(zt&&zt.hum&&e){const l=lvlOf(e.z),a=3+Math.round(Math.random()*4+l*.8);e.loot.ammo=(e.loot.ammo||0)+a;e.loot.metal=(e.loot.metal||0)+Math.round(a/2);e.loot.scrap=(e.loot.scrap||0)+2+Math.round(Math.random()*2);addFl(M,z.x,z.y-.4,'+'+a+' munición','#8dbb69');if(Math.random()<.1+l*.012)giveGear(l,0,1,z)}
  (M.blood=M.blood||[]).push({x:z.x,y:z.y,a:Math.random()*3});addFl(M,z.x,z.y,'☠','#fff');M.kills=(M.kills||0)+1}
function explode(b){b.hp=0;M.barrels=M.barrels.filter(q=>q!==b);const tx=Math.floor(b.x),ty=Math.floor(b.y);M.g[ty][tx]=0;M.pr[ty][tx]=null;
  addFl(M,b.x,b.y,'💥','#fff');M.shake=.6;
  M.en.forEach(z=>{const d=Math.hypot(z.x-b.x,z.y-b.y);if(d<2.5){z.hp-=75;z.st=1;addFl(M,z.x,z.y,'-75','#ffd877');if(z.hp<=0)killZ(z)}else if(d<9)z.st=1});
  M.units.forEach(u=>{if(isAl(u)&&Math.hypot(u.x-b.x,u.y-b.y)<2.3){u.p.hp-=22;addFl(M,u.x,u.y,'-22','#ff7b6b')}});
  M.en=M.en.filter(z=>z.hp>0)}
function step(dt){
  const e=S.exp;if(!M||!e)return;M.t+=dt;
  const al=M.units.filter(isAl);
  // niebla
  al.forEach(u=>{const vr=vrOf(u);for(let y=Math.max(0,Math.floor(u.y-vr-1));y<Math.min(ROWS,u.y+vr+1);y++)for(let x=Math.max(0,Math.floor(u.x-vr-1));x<Math.min(COLS,u.x+vr+1);x++)if(Math.hypot(x+.5-u.x,y+.5-u.y)<=vr)M.vis[y*COLS+x]=2});
  // botiquines
  M.meds.forEach(m=>{if(!m.on)return;const u=al.find(q=>Math.hypot(q.x-m.x,q.y-m.y)<.9);if(u){m.on=0;u.p.hp=Math.min(mhp(u.p),u.p.hp+40);addFl(M,u.x,u.y,'+40','#8dbb69')}});
  // IA de combate: el jugador decide adónde van; pelean ellos solos
  M.bt=(M.bt||0)-dt;if(M.bt<=0){M.bt=.3;M.barrelT=null;M.barrels.forEach(b=>{if(M.vis[Math.floor(b.y)*COLS+Math.floor(b.x)]!=2)return;const near=M.en.filter(z=>z.st&&Math.hypot(z.x-b.x,z.y-b.y)<2.4);
    if((near.length>=2||near.some(z=>z.t=='f'))&&!al.some(u=>Math.hypot(u.x-b.x,u.y-b.y)<2.9)&&al.some(u=>{const r=rngOf(u.p);return r>2.6&&Math.hypot(u.x-b.x,u.y-b.y)<=r&&los(u.x,u.y,b.x,b.y)}))M.barrelT=b})}
  al.forEach(u=>{
    u.cd-=dt;u.ait=(u.ait||0)-dt;const arm=u.p.arm;if(u.slow>0)u.slow-=dt;if(u.pin>0){u.pin-=dt;u.path=[];if(u.pinBy&&u.pinBy.hp<=0)u.pin=0}
    if(u.path.length){const[tx,ty]=u.path[0],d=Math.hypot(tx-u.x,ty-u.y),s=(arm=='expl'?3:2.4)*(u.slow>0?.5:1)*dt;u.fa=Math.atan2(ty-u.y,tx-u.x);if(d<=s){u.x=tx;u.y=ty;u.path.shift()}else{u.x+=(tx-u.x)/d*s;u.y+=(ty-u.y)/d*s}}
    if(arm=='medico')al.forEach(o=>{if(o!==u&&Math.hypot(o.x-u.x,o.y-u.y)<3.2&&o.p.hp<mhp(o.p))o.p.hp=Math.min(mhp(o.p),o.p.hp+2.5*dt)});
    const r=rngOf(u.p),ranged=r>2.6;let tg=null;
    if(M.barrelT&&ranged&&Math.hypot(M.barrelT.x-u.x,M.barrelT.y-u.y)<=r&&los(u.x,u.y,M.barrelT.x,M.barrelT.y))tg=M.barrelT;
    if(!tg){let bd=r+.01,hpB=1e9;M.en.forEach(z=>{if(M.vis[Math.floor(z.y)*COLS+Math.floor(z.x)]!=2)return;const d=Math.hypot(z.x-u.x,z.y-u.y);if(d<=r&&los(u.x,u.y,z.x,z.y)){const sc=d+(z.st?0:3)+z.hp/80;if(sc<bd+hpB&&(tg==null||sc<tg._sc)){tg=z;z._sc=sc}}})}
    if(tg)u.fa=Math.atan2(tg.y-u.y,tg.x-u.x);
    // movimiento autónomo en combate (solo si no tiene una orden de movimiento del jugador)
    if(!u.path.length&&u.ait<=0&&!(u.pin>0)){u.ait=.5;
      const th=M.en.filter(z=>z.st&&M.vis[Math.floor(z.y)*COLS+Math.floor(z.x)]==2&&Math.hypot(z.x-u.x,z.y-u.y)<10).sort((a,b)=>Math.hypot(a.x-u.x,a.y-u.y)-Math.hypot(b.x-u.x,b.y-u.y));
      if(th.length){const n=th[0],dn=Math.hypot(n.x-u.x,n.y-u.y),hd=Math.hypot(u.home[0]-u.x,u.home[1]-u.y);
        if(arm=='medico'){const hurt=al.filter(o=>o!==u).sort((a,b)=>a.p.hp/mhp(a.p)-b.p.hp/mhp(b.p))[0];if(hurt&&Math.hypot(hurt.x-u.x,hurt.y-u.y)>2.4)moveTo(M,u,hurt.x,hurt.y)}
        else if(ranged&&dn<1.9){ // retroceder para mantener la distancia
          let best=null,bv=-1;for(let a=0;a<8;a++){const an=a*Math.PI/4,tx=u.x+Math.cos(an)*2.2,ty=u.y+Math.sin(an)*2.2;if(solid(M,Math.floor(tx),Math.floor(ty)))continue;const v=Math.hypot(tx-n.x,ty-n.y);if(v>bv){bv=v;best=[tx,ty]}}if(best&&bv>dn+.8)moveTo(M,u,best[0],best[1])}
        else if((!tg||!ranged&&dn>1.8)&&hd<7){const p=bfs(M,u.x,u.y,n.x,n.y);if(p){while(p.length>1&&Math.hypot(p[p.length-1][0]-n.x,p[p.length-1][1]-n.y)<(ranged?r*.8:1.2))p.pop();u.path=p}}}
    }
    if(tg&&u.cd<=0){u.cd=.9;const melee=r<2.6;let dm=dmgOf(u.p)*(.85+Math.random()*.3),crit=arm=='franco'&&Math.random()<.18+(u.p.at?u.p.at.d*.01:0);if(crit)dm*=2.2;
      if(tg.t&&ZT[tg.t]&&ZT[tg.t].armor)dm=Math.max(1,dm-ZT[tg.t].armor);tg.hp-=dm;if(!tg.barrel)tg.st=1;M.tr.push({a:u,b:tg,l:.12,m:melee});addFl(M,tg.x,tg.y,(crit?'¡CRÍTICO! ':'-')+Math.round(dm),crit?'#ff9a3a':'#ffd877');
      if(!melee)alert_(u.x,u.y,7);
      if(tg.hp<=0){if(tg.barrel)explode(tg);else{killZ(tg);u.p.xp+=1}}}
  });
  M.en=M.en.filter(z=>z.hp>0);if(M.focus&&M.focus.hp<=0)M.focus=null;
  // aliados de la Guardia
  (M.ally||[]).forEach(a=>{if(a.p.hp<=0)return;a.cd-=dt;let tz=null,td=6;M.en.forEach(z=>{const d=Math.hypot(z.x-a.x,z.y-a.y);if(d<td&&los(a.x,a.y,z.x,z.y)){td=d;tz=z}});
    if(tz){a.fa=Math.atan2(tz.y-a.y,tz.x-a.x);if(a.cd<=0){a.cd=a.rate||.9;a.sh=M.t;tz.hp-=(a.dmg||7);tz.st=1;M.tr.push({a,b:tz,l:.12,m:false});alert_(a.x,a.y,5);addFl(M,tz.x,tz.y,'-'+(a.dmg||7),a.lead?'#f2c542':'#9fc4e8');if(tz.hp<=0){if(tz.barrel)explode(tz);else killZ(tz)}}return}
    let ld=null,bd2=1e9;al.forEach(u=>{const d=Math.hypot(u.x-a.x,u.y-a.y);if(d<bd2){bd2=d;ld=u}});if(!ld||bd2<2.2)return;a.pt-=dt;if(a.pt<=0||!a.path.length){a.pt=.6;a.path=bfs(M,a.x,a.y,ld.x,ld.y)||[]}
    if(a.path.length){const[tx,ty]=a.path[0],d=Math.hypot(tx-a.x,ty-a.y),s=1.6*dt;a.fa=Math.atan2(ty-a.y,tx-a.x);if(d<=s){a.x=tx;a.y=ty;a.path.shift()}else{a.x+=(tx-a.x)/d*s;a.y+=(ty-a.y)/d*s}}});
  M.en=M.en.filter(z=>z.hp>0);
  // enemigos
  M.en.forEach(z=>{const zt=ZT[z.t];let tg=null,bd=1e9;al.concat((M.ally||[]).filter(a=>a.p.hp>0)).forEach(u=>{const d=Math.hypot(u.x-z.x,u.y-z.y);if(d<bd){bd=d;tg=u}});
    if(!z.st&&bd<(zt.rng?zt.rng+1.5:5.2))z.st=1;
    if(!z.st||!tg)return;
    if(window.ZX&&ZX.mq(z,dt,al,M,{tg,bd,bfs,solid,los,addFl,alert_,COLS,ROWS}))return;
    z.fa=Math.atan2(tg.y-z.y,tg.x-z.x);
    if(zt.rng&&bd<=zt.rng&&los(z.x,z.y,tg.x,tg.y)){z.cd-=dt;if(z.cd<=0){z.cd=zt.cd*(.85+Math.random()*.3);z.sh=M.t;M.tr.push({a:z,b:tg,l:.12,m:false,c:zt.tc});alert_(z.x,z.y,6);
      if(Math.random()<.72){const def=CL[tg.p.arm||'soldado'].def;let dm=Math.max(2,zt.d*(z.dm||1)*1.5-def*.8);if(tg.p.arm=='pesado')dm*=.8;tg.p.hp-=dm;tg.p.injury=Math.min(100,(tg.p.injury||0)+dm*.35);addFl(M,tg.x,tg.y,'-'+Math.round(dm),'#ff7b6b')}else addFl(M,tg.x,tg.y,'falla','#aaa')}
      return}
    if(bd<1.05){const def=CL[tg.p.arm||'soldado'].def;let dm=Math.max(1,zt.d*(z.dm||1)-def*.8)*dt;if(tg.p.arm=='pesado')dm*=.7;tg.p.hp-=dm;tg.p.injury=Math.min(100,(tg.p.injury||0)+dm*.3);if(Math.random()<dt*1.4)addFl(M,tg.x,tg.y,'-'+Math.max(1,Math.round(dm*2)),'#ff7b6b');return}
    z.pt-=dt;if(z.pt<=0||!z.path.length){z.pt=.6;const p=bfs(M,z.x,z.y,tg.x,tg.y);z.path=p||[]}
    if(z.path.length){const[tx,ty]=z.path[0],d=Math.hypot(tx-z.x,ty-z.y),s=zt.sp*1.45*dt*(z.spm||1);z.fa=Math.atan2(ty-z.y,tx-z.x);if(d<=s){z.x=tx;z.y=ty;z.path.shift()}else{z.x+=(tx-z.x)/d*s;z.y+=(ty-z.y)/d*s}}});
  // caídos: se pueden reanimar con un compañero al lado (el médico, el doble de rápido)
  M.units.forEach(u=>{if(u.dead)return;const p=u.p;
    if(p.hp>0){u.down=0;return}
    if(!u.down){u.down=1;u.dt=25;u.rv=0;u.path=[];addFl(M,u.x,u.y,'¡CAÍDO!','#ff7b6b');toast('⚠ '+p.n+' ha caído. Acércale a un compañero para reanimarle.')}
    u.dt-=dt;const hp_=al.filter(o=>Math.hypot(o.x-u.x,o.y-u.y)<1.6);if(hp_.length)u.rv+=dt*(hp_.some(o=>o.p.arm=='medico')?2:1);else u.rv=Math.max(0,u.rv-dt*.5);
    if(u.rv>=3){p.hp=mhp(p)*.3;u.down=0;u.rv=0;M.revived=(M.revived||0)+1;addFl(M,u.x,u.y,'¡De pie!','#8dbb69')}
    else if(u.dt<=0){u.dead=1;addFl(M,u.x,u.y,'✝','#fff');toast('✝ '+p.n+' no lo ha logrado.');e.dead=e.dead||[];e.dead.push(p.n);p.away=0;e.team=e.team.filter(i=>i!=p.id);die(p,'en la expedición')}});
  if(!e.team.length&&!e.fin){e.fin=1;shown=false;ov.style.display='none';exEnd();return}
  modeStep(dt,al);try{dangerStep(dt,al)}catch(er){}
  // objetivos al llegar
  if(M.goal){const g=M.goal,near=al.some(u=>Math.hypot(u.x-g.o.x,u.y-g.o.y)<(g.k=='c'?1.35:1.6));
    if(near&&g.o.on){M.goal=null;if(g.k=='c')openCrate(g.o);else tryPoi(g.o)}}
  M.fl.forEach(f=>f.l-=dt*1.1);M.fl=M.fl.filter(f=>f.l>0);M.tr.forEach(t=>t.l-=dt);M.tr=M.tr.filter(t=>t.l>0);
}
function openCrate(c){const e=S.exp,z=e.z,L=lvlOf(z);if(c.amb&&!c.warned){c.warned=1;addFl(M,c.x,c.y,'Se oye algo dentro…','#ff9a6a');toast('⚠ Se oye algo dentro de la caja. Tócala otra vez para abrirla de todos modos.');return}c.on=0;if(c.amb){c.amb=0;ambush(c)}const o=[];if(Math.random()<(c.emp||0)){addFl(M,c.x,c.y,'Vacío','#9fb0b6');sfx&&sfx('click');return}for(const k in z.l){const a=(z.l[k][0]+z.l[k][1])/2/5*(.75+.05*L)*(.6+Math.random()*.8)*(th('expl2')?1.2:1)*(th('expl3')?1.2:1)*(th('expl4')?1.2:1)*(M.units.some(u=>isAl(u)&&u.p.arm=='ing')?1.3:1);if(a>=1){e.loot[k]=(e.loot[k]||0)+a;o.push('+'+Math.round(a)+' '+k)}}
  {const sc=Math.max(2,Math.round((c.car?7:4)*(.8+Math.random()*.6)*(1+.12*L)));e.loot.scrap=(e.loot.scrap||0)+sc;o.unshift('+'+sc+' chatarra')}
  addFl(M,c.x,c.y,o.join(' ')||'vacío','#8dbb69');sfx&&sfx('click');
  if(Math.random()<.06+.012*L)setTimeout(()=>giveGear(L,0,0,{x:c.x,y:c.y-.5}),350)
  if(Math.random()<(c.car?.14:.1)+.01*L){const pl=givePlan&&givePlan(L);if(pl)setTimeout(()=>addFl(M,c.x,c.y-.4,'📜 Plano: '+pl.n,'#ffd877'),500)}}
function tryPoi(p){const e=S.exp;
  if(M.mo&&!M.mo.done){toast('Primero: '+moTxt());return}
  if(M.en.some(z=>z.st&&Math.hypot(z.x-p.x,z.y-p.y)<6)){toast('Hay enemigos activos cerca: elimínalos primero.');return}
  e.ev=e.z.evs?e.z.evs[e.step]:pk(EVS);M.cur=p;showEv()}
/* ---------- evento ---------- */
function showEv(){const e=S.exp;evOpen=true;const dg=dgOf(e.z),lia=tm(e).some(p=>p.story==='lia'),pw=Math.round((tm(e).reduce((a,p)=>a+upow(p),0)+tm(e).reduce((a,p)=>a+(p.story==='gael'?20:p.story==='ibarra'?8:0),0))*(1+(th('expl1')?.1:0))),need=Math.round(dg*(lia?.4:.6));
  if(!/bandid|saquead|superviviente|desconocid|mercader|clan|negoci|hablar|extra[ñn]|armado|oís|voz|facci|rend|ofrec|exig|líder|emisari|prisioner|truque|trato|patrulla|soldad|milicia|cazador|viajero|forastero/i.test(e.ev.t)){evOpen=false;window._qmPick(pw>=dg?1:0);return} // evento normal: sin diálogo; solo se elige al tratar con gente
  //: se resuelve solo (arriesgado si el equipo es fuerte, prudente si no)
  const d=$('qm_ev');d.style.display='flex';d.innerHTML='<div class="qe-box"><p>'+e.ev.t+'</p><button onclick="_qmPick(1)">'+e.ev.a+' <small>('+(pw>=dg?'éxito seguro':'riesgo de heridas graves')+')</small></button><button onclick="_qmPick(0)">'+e.ev.b+' <small>('+(pw>=need?'éxito seguro':'riesgo de heridas')+')</small></button></div>'}
window._qmPick=agg=>{const e=S.exp;if(!e||!M)return;const t=tm(e),dn=M.units.filter(u=>u.down&&!u.dead).map(u=>u.p);dn.forEach(p=>p.hp=60);const h0=t.map(p=>p.hp),i0=t.map(p=>p.injury||0);
  $('qm_ev').style.display='none';evOpen=false;
  M.cur&&(M.cur.on=0);const before=e.step;
  exChoose(agg); // aplica botín, historia y consecuencias
  if(S.exp&&S.exp===e){tm(e).forEach(p=>{const k=t.indexOf(p);if(k>=0){const dd=h0[k]-p.hp;if(dd>0)p.hp=h0[k]-dd*.4;p.injury=i0[k]+((p.injury||0)-i0[k])*.4}})}
  if(S.exp&&S.exp===e)dn.forEach(p=>{if(e.team.includes(p.id))p.hp=0});
  addFl(M,M.cur.x,M.cur.y,agg?'Arriesgado':'Prudente','#ffd877');
  if(S.exp&&S.exp===e&&!e.complete&&e.step===before)e.step=before+1;
}
/* ---------- salida ---------- */
const inExit=u=>u.x<4&&u.y>3.6&&u.y<7.4;
function atExit(){return M.units.filter(isAl).every(inExit)}
function hasDown(){return M.units.some(u=>!u.dead&&u.p.hp<=0)}
function leave(){const e=S.exp;if(!e)return;e.log.push('Enemigos abatidos: '+(M.kills||0)+(M.revived?' · Compañeros reanimados: '+M.revived:''));e.fin=1;shown=false;ov.style.display='none';cancelAnimationFrame(raf);exEnd()}
window.exEnd=function(){const e=S.exp;
  if(e&&!e.fin&&tm(e).length){if(!e.complete){e.complete=1;toast('✅ Objetivo cumplido. Vuelve a la salida con tu equipo.');setTimeout(()=>{giveGear(lvlOf(e.z),1);givePlan(lvlOf(e.z))},900)}return}
  shown=false;if(ov)ov.style.display='none';cancelAnimationFrame(raf);M=null;return oEnd.apply(this,arguments)};
/* ---------- peligro de las misiones: barra de peligro, patrullas, trampas, emboscadas y evacuación ---------- */
const HZ={wire:['Alambre de espino','#9aa0a4'],acid:['Charco de ácido','#8adf3a'],mine:['Mina','#c23a2e'],floor:['Suelo que cede','#7a5a3a']};
function freeTiles(M0,x0){const f=[],busy=new Set();['pois','crates','cars','meds','barrels','en'].forEach(k=>(M0[k]||[]).forEach(o=>busy.add(Math.floor(o.x)+','+Math.floor(o.y))));(M0.units||[]).forEach(u=>busy.add(Math.floor(u.x)+','+Math.floor(u.y)));
 for(let y=1;y<ROWS-1;y++)for(let x=x0;x<COLS-1;x++)if(!M0.g[y][x]&&!busy.has(x+','+y))f.push([x,y]);return f}
function dangerInit(M0,e){if(M0.pv)return;const L=lvlOf(e.z);M0.dg=0;M0.dgT=0;M0.dgN=0;M0.evac={need:Math.min(35,20+Math.floor(L/2)),t:0,on:0,done:0,w:3};
 /* trampas */const f=freeTiles(M0,6),n=Math.min(f.length,8,4+Math.floor(L/6)),ks=Object.keys(HZ);M0.hz=[];for(let i=0;i<n;i++){const t=f.splice(Math.floor(Math.random()*f.length),1)[0];M0.hz.push({k:ks[Math.floor(Math.random()*ks.length)],x:t[0]+.5,y:t[1]+.5,on:1})}
 /* patrullas: un tercio de los enemigos camina por el mapa */M0.en.forEach(z=>{if(z.boss||Math.random()>.33)return;z.pat=1});
 /* emboscadas: una de cada cuatro cajas esconde enemigos */(M0.crates||[]).forEach(c=>{if(Math.random()<.25)c.amb=1})}
function spawnAt(x,y,n,wake){const e=S.exp,lvl=lvlOf(e.z),hpM=.85+.035*lvl,dmM=.85+.025*lvl,t=nearTiles(M,x,y,n+6).filter(q=>!M.units.some(u=>isAl(u)&&Math.hypot(u.x-q[0],u.y-q[1])<1.5));
 for(let i=0;i<n&&t.length;i++){const q=t.splice(Math.floor(Math.random()*t.length),1)[0],ty=mixType(lvl,Math.random,themeOf(e)),hp=Math.round(ZT[ty].hp*hpM);M.en.push({t:ty,x:q[0],y:q[1],hp,mhp:hp,st:wake?1:0,path:[],pt:0,dm:dmM,cd:1})}}
function ambush(c){const lvl=lvlOf(S.exp.z),n=2+Math.floor(lvl/6);spawnAt(c.x,c.y,n,1);M.shake=.4;addFl(M,c.x,c.y,'¡Emboscada!','#ff4a3a');toast('⚠ ¡Emboscada! Salen infectados escondidos.');M.dg=Math.min(100,(M.dg||0)+8)}
/* oleada desde los bordes del mapa, lejos del equipo */
function wave(n){const al=M.units.filter(isAl);const f=[];for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(M.g[y][x])continue;const edge=x>=COLS-3||y<=1||y>=ROWS-2;if(!edge||x<8)continue;if(al.some(u=>Math.hypot(u.x-x,u.y-y)<6))continue;f.push([x,y])}
 if(!f.length)return;const c=f[Math.floor(Math.random()*f.length)];spawnAt(c[0]+.5,c[1]+.5,n,1)}
function dangerStep(dt,al){if(M.pv||M.dg===undefined)return;const e=S.exp,lvl=lvlOf(e.z);
 /* barra de peligro: sube sola y con el ruido; cada tercio trae una oleada; llena, oleadas cada 25 s */
 if(!(M.evac&&M.evac.on)){M.dg=Math.min(100,M.dg+dt*(.25+.012*lvl));const tier=Math.floor(M.dg/34);if(tier>M.dgN){M.dgN=tier;const n=2+Math.floor(lvl/6)+tier;wave(n);toast('⚠ El ruido atrae a más infectados ('+n+').');M.shake=.25}
  if(M.dg>=100){M.dgT+=dt;if(M.dgT>=30){M.dgT=0;wave(2+Math.floor(lvl/8))}}}
 /* patrullas */M.en.forEach(z=>{if(!z.pat||z.st||z.hp<=0)return;if(!z.wp||Math.hypot(z.wp[0]-z.x,z.wp[1]-z.y)<.4||(z.pwT=(z.pwT||0)-dt)<=0){z.pwT=8;let t=null;for(let k=0;k<12&&!t;k++){const x=Math.floor(z.x+(Math.random()-.5)*12),y=Math.floor(z.y+(Math.random()-.5)*8);if(x>4&&!solid(M,x,y))t=[x+.5,y+.5]}z.wp=t||[z.x,z.y];z.path=bfs(M,z.x,z.y,z.wp[0],z.wp[1])||[]}
  if(z.path&&z.path.length){const[tx,ty]=z.path[0],d=Math.hypot(tx-z.x,ty-z.y),sp=ZT[z.t].sp*.7*dt;z.fa=Math.atan2(ty-z.y,tx-z.x);if(d<=sp){z.x=tx;z.y=ty;z.path.shift()}else{z.x+=(tx-z.x)/d*sp;z.y+=(ty-z.y)/d*sp}}});
 /* trampas */(M.hz||[]).forEach(h=>{if(!h.on)return;const tile=(o)=>Math.floor(o.x)===Math.floor(h.x)&&Math.floor(o.y)===Math.floor(h.y);
  al.forEach(u=>{if(!tile(u))return;const p=u.p;if(h.k==='wire'){u.slow=Math.max(u.slow||0,1.5);if(Math.random()<dt*2)addFl(M,u.x,u.y,'Enganchado','#cfd6d8');p.hp-=3*dt}
   else if(h.k==='acid'){p.hp-=7*dt;p.injury=Math.min(100,(p.injury||0)+dt*2);if(Math.random()<dt*2)addFl(M,u.x,u.y,'Ácido','#8adf3a')}
   else if(h.k==='mine'){h.on=0;M.shake=.6;M.vis[Math.floor(h.y)*COLS+Math.floor(h.x)]=2;M.units.filter(isAl).forEach(o=>{if(Math.hypot(o.x-h.x,o.y-h.y)<1.7){o.p.hp-=32;addFl(M,o.x,o.y,'-32','#ff7b6b')}});M.en.forEach(z=>{if(Math.hypot(z.x-h.x,z.y-h.y)<1.7)z.hp-=60});M.tr.push({a:{x:h.x,y:h.y},b:{x:h.x+.01,y:h.y},l:.3,m:true,c:'#ffb040'});addFl(M,h.x,h.y,'¡BOOM!','#ff9a30');toast('💥 ¡Una mina!');M.dg=Math.min(100,M.dg+10)}
   else if(h.k==='floor'){h.on=0;p.hp-=16;u.slow=3;M.shake=.3;addFl(M,u.x,u.y,'¡El suelo cede! -16','#ff7b6b')}});
  if(h.on&&h.k==='mine')M.en.forEach(z=>{if(z.st&&tile(z)){h.on=0;M.en.forEach(q=>{if(Math.hypot(q.x-h.x,q.y-h.y)<1.7)q.hp-=60});addFl(M,h.x,h.y,'¡BOOM!','#ff9a30');M.shake=.4}})});
 /* evacuación */const v=M.evac;if(v&&v.on&&!v.done){if(atExit()&&!hasDown())v.t+=dt;v.w-=dt;if(v.w<=0){v.w=8;wave(1+Math.floor(lvl/8))}
  if(v.t>=v.need){v.done=1;toast('🚁 ¡Ha llegado la ayuda! Salís de la zona.');setTimeout(()=>{if(S.exp&&M)leave()},700)}}}
function drawHz(){(M.hz||[]).forEach(h=>{if(!h.on||M.vis[Math.floor(h.y)*COLS+Math.floor(h.x)]!==2)return;const x=h.x*ts,y=h.y*ts,r=ts*.38;
 if(h.k==='acid'){cx.fillStyle='rgba(120,220,60,.55)';cx.beginPath();cx.ellipse(x,y,r*1.2,r*.75,.3,0,7);cx.fill();cx.fillStyle='rgba(200,255,140,.6)';cx.beginPath();cx.arc(x-r*.3,y-r*.15,r*.18,0,7);cx.fill()}
 else if(h.k==='wire'){cx.strokeStyle='#b8bec2';cx.lineWidth=1.3;for(let k=0;k<3;k++){cx.beginPath();for(let i=0;i<=8;i++){const px=x-r+i*r/4,py=y-r*.4+k*r*.4+Math.sin(i*1.7+k)*r*.15;i?cx.lineTo(px,py):cx.moveTo(px,py)}cx.stroke()}}
 else if(h.k==='mine'){cx.fillStyle='#3a3a32';cx.beginPath();cx.ellipse(x,y,r*.55,r*.35,0,0,7);cx.fill();cx.fillStyle=(M.t*3%1)<.5?'#ff3a2a':'#5a1a14';cx.beginPath();cx.arc(x,y-r*.12,r*.14,0,7);cx.fill()}
 else{cx.strokeStyle='#2a1a10';cx.lineWidth=1.6;cx.beginPath();cx.moveTo(x-r,y-r*.3);cx.lineTo(x-r*.2,y);cx.lineTo(x+r*.3,y-r*.5);cx.moveTo(x-r*.2,y);cx.lineTo(x+r*.1,y+r*.6);cx.moveTo(x+r*.3,y-r*.5);cx.lineTo(x+r,y-r*.1);cx.stroke()}
 cx.strokeStyle='rgba(255,90,60,.55)';cx.lineWidth=1;cx.setLineDash([3,3]);cx.strokeRect(x-ts*.5+2,y-ts*.5+2,ts-4,ts-4);cx.setLineDash([])})}
function drawDanger(W,H){if(M.pv||M.dg===undefined)return;const v=M.evac,x=10,y=8,w=Math.min(190,W*.28),h=11,k=M.dg/100,col=k<.34?'#e0c040':k<.67?'#e08a30':'#e04a3a';
 cx.fillStyle='rgba(0,0,0,.6)';cx.fillRect(x-4,y-4,w+8,h+20);cx.fillStyle='#2a1a14';cx.fillRect(x,y+12,w,h);cx.fillStyle=col;cx.fillRect(x,y+12,w*k,h);cx.strokeStyle='#000';cx.strokeRect(x,y+12,w,h);
 cx.fillStyle='rgba(0,0,0,.5)';[1,2].forEach(i=>cx.fillRect(x+w*i/3-1,y+12,2,h));cx.fillStyle='#ffe9a8';cx.font='bold 10px sans-serif';cx.textAlign='left';cx.fillText('☣ PELIGRO '+Math.round(M.dg)+'%'+(M.dg>=100?' · oleadas':''),x,y+8);
 if(v&&v.on&&!v.done){const t=Math.max(0,v.need-v.t),bw=Math.min(260,W*.4),bx=W-bw-14,by=H-44;cx.fillStyle='rgba(0,0,0,.65)';cx.fillRect(bx-6,by-4,bw+12,34);cx.fillStyle='#ffe9a8';cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillText(atExit()?(hasDown()?'⚠ Reanimad a los caídos para seguir':'🚁 EVACUACIÓN · aguanta '+Math.ceil(t)+' s'):'⚠ Volved a la salida para la evacuación',bx+bw/2,by+11);cx.fillStyle='#2a3a2a';cx.fillRect(bx,by+17,bw,8);cx.fillStyle='#5ad08a';cx.fillRect(bx,by+17,bw*(v.t/v.need),8)}}
/* ---------- dibujo ---------- */
const hs=(x,y)=>{let h=(x*374761393+y*668265263)^0x5bd1e995;h=(h^(h>>>13))*1274126177;return((h^(h>>>16))>>>0)/4294967296};
let dark=null,FL=null;window._qmReset=()=>{dark=null;FL=null};
function drawFig(c,x,y,o){ // figura vista desde arriba: sombra, torso, cabeza, brazos/arma
  const r=o.r,fa=o.fa||0,cs=Math.cos(fa),sn=Math.sin(fa);
  c.fillStyle='#0006';c.beginPath();c.ellipse(x,y+r*.55,r*1.05,r*.55,0,0,7);c.fill();
  // brazos
  c.lineCap='round';c.strokeStyle=o.skin;c.lineWidth=r*.34;
  if(o.zom){const w=Math.sin(M.t*6+x)*.15;for(const k of[-1,1]){c.beginPath();c.moveTo(x-sn*k*r*.55,y+cs*k*r*.55);c.lineTo(x+cs*r*1.15-sn*k*r*.5,y+sn*r*1.15+cs*k*r*.5+w*r);c.stroke()}}
  else{c.beginPath();c.moveTo(x-sn*r*.5,y+cs*r*.5);c.lineTo(x+cs*r*.95,y+sn*r*.95);c.stroke();
    c.strokeStyle=o.gun||'#1b1b1b';c.lineWidth=r*(o.big?.4:.3);c.beginPath();c.moveTo(x+cs*r*.4,y+sn*r*.4);c.lineTo(x+cs*r*(o.gl||1.6),y+sn*r*(o.gl||1.6));c.stroke();
    if(o.flash){c.fillStyle='#ffd24a';c.beginPath();c.arc(x+cs*r*((o.gl||1.6)+.35),y+sn*r*((o.gl||1.6)+.35),r*.34,0,7);c.fill()}}
  // torso
  c.fillStyle=o.shirt;c.beginPath();c.ellipse(x,y,r*.82,r*.98,fa,0,7);c.fill();c.strokeStyle='#0008';c.lineWidth=1.4;c.stroke();
  if(o.pack){c.fillStyle='#0004';c.beginPath();c.ellipse(x-cs*r*.45,y-sn*r*.45,r*.42,r*.52,fa,0,7);c.fill()}
  // cabeza
  c.fillStyle=o.skin;c.beginPath();c.arc(x+cs*r*.12,y+sn*r*.12,r*.55,0,7);c.fill();c.stroke();
  if(o.hair){c.fillStyle=o.hair;c.beginPath();c.arc(x+cs*r*.02,y+sn*r*.02,r*.56,fa+Math.PI*.55,fa+Math.PI*1.45);c.lineTo(x+cs*r*.1,y+sn*r*.1);c.fill()}
  if(o.helm){c.fillStyle=o.helm;c.beginPath();c.arc(x+cs*r*.08,y+sn*r*.08,r*.6,fa+Math.PI*.5,fa+Math.PI*1.5);c.fill()}
  if(o.eyes){c.fillStyle='#d22';for(const k of[-1,1]){c.fillRect(x+cs*r*.42-sn*k*r*.2-1,y+sn*r*.42+cs*k*r*.2-1,2.4,2.4)}}
}

const CARC=['#a33a2a','#2f5f8f','#c9c9c2','#3a3a3e','#b8902a','#4a7a4a'];
function drawProp(c,ch,px,py,ts,x,y){
  const sh=(w,h,ox,oy)=>{c.fillStyle='#0006';c.fillRect(px+ox+2,py+oy+3,w,h)};
  const same=(dx,dy,k)=>M.pr[y+dy]&&M.pr[y+dy][x+dx]===k;
  const hh=hs(x,y);
  switch(ch){
  case'P':sh(ts*.7,ts*.8,ts*.15,ts*.1);c.fillStyle='#9a9a94';c.fillRect(px+ts*.1,py+ts*.05,ts*.8,ts*.9);c.fillStyle='#c33';c.fillRect(px+ts*.2,py+ts*.15,ts*.6,ts*.7);c.fillStyle='#eee';c.fillRect(px+ts*.2,py+ts*.15,ts*.6,ts*.14);c.fillStyle='#222';c.fillRect(px+ts*.3,py+ts*.4,ts*.4,ts*.2);c.fillStyle='#3d8';c.fillRect(px+ts*.34,py+ts*.44,ts*.32,ts*.1);break;
  case'S':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#3b3128';c.fillRect(px+ts*.05,py+ts*.08,ts*.9,ts*.84);c.fillStyle='#524536';c.fillRect(px+ts*.05,py+ts*.08,ts*.9,ts*.1);for(let k=0;k<3;k++){c.fillStyle=(M.theme=='archive'?['#b8a888','#9a8a6a','#c9bb9a','#7a6a4a','#d8cfb4']:['#c9a24a','#b84a3a','#4a7aa8','#8aa860','#d8d4c4'])[Math.floor(hs(x*3+k,y)*5)];c.fillRect(px+ts*(.12+k*.28),py+ts*.26,ts*.2,ts*.2);c.fillStyle=(M.theme=='archive'?['#9a8a6a','#d8cfb4','#7a6a4a','#b8a888','#c9bb9a']:['#8aa860','#c9a24a','#b84a3a','#d8d4c4','#4a7aa8'])[Math.floor(hs(x*3+k,y+9)*5)];c.fillRect(px+ts*(.12+k*.28),py+ts*.56,ts*.2,ts*.24)}break;
  case'B':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#8a95a0';c.fillRect(px+ts*.03,py+ts*.1,ts*.94,ts*.8);c.fillStyle='#e8eeee';c.fillRect(px+ts*.08,py+ts*.15,ts*.84,ts*.7);c.fillStyle='#f5f8f8';c.beginPath();c.ellipse(px+ts*.25,py+ts*.5,ts*.14,ts*.2,0,0,7);c.fill();c.fillStyle=M.theme=='house'?'#a8564a':'#5aa8a4';c.fillRect(px+ts*.42,py+ts*.15,ts*.5,ts*.7);break;
  case'D':sh(ts*.9,ts*.7,ts*.05,ts*.15);c.fillStyle=M.theme=='office'?'#9a9a94':'#7a5a38';c.fillRect(px+ts*.05,py+ts*.15,ts*.9,ts*.7);c.fillStyle='#00000030';c.fillRect(px+ts*.05,py+ts*.15,ts*.9,ts*.08);c.fillStyle='#111';c.fillRect(px+ts*.3,py+ts*.25,ts*.4,ts*.26);c.fillStyle='#4aa';c.fillRect(px+ts*.34,py+ts*.29,ts*.32,ts*.17);break;
  case'C':{const left=same(-1,0,'C'),right=same(1,0,'C');const col=CARC[Math.floor(hs(x-(left?1:0),y)*CARC.length)];if(left){c.fillStyle='#0006';c.fillRect(px+2,py+ts*.18,ts*.9,ts*.72);c.fillStyle=col;c.fillRect(px,py+ts*.15,ts*.9,ts*.7);c.fillStyle='#9ec6d8';c.fillRect(px+ts*.1,py+ts*.25,ts*.28,ts*.5);c.fillStyle='#000a';c.strokeRect(px,py+ts*.15,ts*.9,ts*.7)}
    else{c.fillStyle='#0006';c.fillRect(px+ts*.1+2,py+ts*.18,right?ts*.9:ts*.8,ts*.72);c.fillStyle=col;c.fillRect(px+ts*.1,py+ts*.15,right?ts*.9:ts*.8,ts*.7);c.fillStyle='#9ec6d8';c.fillRect(px+ts*.6,py+ts*.25,ts*.25,ts*.5);c.strokeStyle='#000a';c.strokeRect(px+ts*.1,py+ts*.15,right?ts*.9:ts*.8,ts*.7);c.fillStyle='#e8d070';c.fillRect(px+ts*.1,py+ts*.2,3,ts*.12);c.fillRect(px+ts*.1,py+ts*.68,3,ts*.12)}break}
  case'K':sh(ts*1,ts*.7,0,ts*.2);c.fillStyle='#8a8d90';c.fillRect(px,py+ts*.2,ts,ts*.62);c.fillStyle='#b0b4b8';c.fillRect(px,py+ts*.2,ts,ts*.14);if(hh>.5){c.fillStyle='#222';c.fillRect(px+ts*.3,py+ts*.38,ts*.4,ts*.3);c.fillStyle='#5d8';c.fillRect(px+ts*.34,py+ts*.42,ts*.32,ts*.1)}break;
  case'T':c.fillStyle='#0006';c.beginPath();c.ellipse(px+ts*.55,py+ts*.58,ts*.45,ts*.4,0,0,7);c.fill();c.fillStyle='#b8b040';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.42,0,7);c.fill();c.strokeStyle='#000a';c.lineWidth=1.5;c.stroke();c.strokeStyle='#8a8430';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.26,0,7);c.stroke();c.fillStyle='#444';c.fillRect(px+ts*.44,py+ts*.44,ts*.12,ts*.12);break;
  case'R':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#c0742a';c.fillRect(px+ts*.05,py+ts*.1,ts*.9,ts*.8);c.fillStyle='#8a5018';c.fillRect(px+ts*.05,py+ts*.1,ts*.9,ts*.16);for(let k=0;k<4;k++){c.fillStyle='#00000040';c.fillRect(px+ts*(.15+k*.2),py+ts*.4,ts*.1,ts*.4)}c.fillStyle=Math.sin(M.t*4+x)>0?'#6f6':'#161';c.fillRect(px+ts*.75,py+ts*.18,ts*.1,ts*.08);break;
  case'X':sh(ts*.8,ts*.7,ts*.1,ts*.15);c.fillStyle='#a67c3d';c.fillRect(px+ts*.08,py+ts*.12,ts*.84,ts*.74);c.strokeStyle='#5a4020';c.lineWidth=1.5;c.strokeRect(px+ts*.08,py+ts*.12,ts*.84,ts*.74);c.beginPath();c.moveTo(px+ts*.08,py+ts*.12);c.lineTo(px+ts*.92,py+ts*.86);c.moveTo(px+ts*.92,py+ts*.12);c.lineTo(px+ts*.08,py+ts*.86);c.stroke();break;
  case'L':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#5a6e80';c.fillRect(px+ts*.05,py+ts*.08,ts*.9,ts*.84);c.fillStyle='#7c92a6';c.fillRect(px+ts*.05,py+ts*.08,ts*.9,ts*.1);c.strokeStyle='#2a3640';c.lineWidth=1.2;for(let k=0;k<3;k++){c.strokeRect(px+ts*(.1+k*.28),py+ts*.22,ts*.24,ts*.62)}break;
  case'Z':for(let k=0;k<2;k++){c.fillStyle='#0006';c.fillRect(px+ts*.1+2,py+ts*(.14+k*.4)+3,ts*.8,ts*.34);c.fillStyle=k?'#b8a470':'#c8b480';c.fillRect(px+ts*.08,py+ts*(.12+k*.4),ts*.84,ts*.34);c.strokeStyle='#5a4a2a';c.strokeRect(px+ts*.08,py+ts*(.12+k*.4),ts*.84,ts*.34)}break;
  case'N':c.fillStyle='#0006';c.beginPath();c.moveTo(px+ts*.5+2,py+ts*.08+3);c.lineTo(px+ts*.95+2,py+ts*.92+3);c.lineTo(px+ts*.05+2,py+ts*.92+3);c.fill();c.fillStyle='#5a6a3a';c.beginPath();c.moveTo(px+ts*.5,py+ts*.08);c.lineTo(px+ts*.95,py+ts*.92);c.lineTo(px+ts*.05,py+ts*.92);c.closePath();c.fill();c.strokeStyle='#2a3418';c.lineWidth=1.5;c.stroke();c.fillStyle='#3a4626';c.beginPath();c.moveTo(px+ts*.5,py+ts*.08);c.lineTo(px+ts*.5,py+ts*.92);c.lineTo(px+ts*.05,py+ts*.92);c.closePath();c.fill();break;
  case'F':{c.strokeStyle='#8a8f92';c.lineWidth=1.4;const h=!same(1,0,'F')&&!same(-1,0,'F')?false:(same(1,0,'F')||same(-1,0,'F'));const v=same(0,1,'F')||same(0,-1,'F');c.beginPath();if(h){c.moveTo(px,py+ts*.5);c.lineTo(px+ts,py+ts*.5);c.moveTo(px,py+ts*.35);c.lineTo(px+ts,py+ts*.65)}if(v){c.moveTo(px+ts*.5,py);c.lineTo(px+ts*.5,py+ts);c.moveTo(px+ts*.35,py);c.lineTo(px+ts*.65,py+ts)}c.stroke();c.fillStyle='#5a5e60';c.fillRect(px+ts*.44,py+ts*.44,ts*.12,ts*.12);break}
  case'V':c.fillStyle='#0005';c.beginPath();c.arc(px+ts*.52,py+ts*.58,ts*.34,0,7);c.fill();c.fillStyle='#3f7a3a';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.34,0,7);c.fill();c.fillStyle='#58a050';c.beginPath();c.arc(px+ts*.42,py+ts*.42,ts*.18,0,7);c.fill();break;
  case'M':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#22282c';c.fillRect(px+ts*.05,py+ts*.08,ts*.9,ts*.84);for(let k=0;k<4;k++){c.fillStyle=Math.sin(M.t*3+x+k*2+y)>0?'#4f4':'#252';c.fillRect(px+ts*(.14+k*.2),py+ts*.2,ts*.1,ts*.08);c.fillStyle=Math.sin(M.t*2.4+k+x)>0?'#f84':'#422';c.fillRect(px+ts*(.14+k*.2),py+ts*.5,ts*.1,ts*.08)}break;
  case'Q':sh(ts,ts*.5,0,ts*.25);c.fillStyle='#7a5a36';c.fillRect(px,py+ts*.25,ts,ts*.5);c.fillStyle='#9a7648';for(let k=0;k<3;k++)c.fillRect(px,py+ts*(.28+k*.15),ts,ts*.09);break;
  case'U':sh(ts,ts*.7,0,ts*.2);c.fillStyle=hh>.5?'#7a4a5a':'#4a5f7a';c.fillRect(px,py+ts*.2,ts,ts*.62);c.fillStyle='#00000030';c.fillRect(px,py+ts*.2,ts,ts*.14);c.strokeStyle='#0008';c.strokeRect(px,py+ts*.2,ts,ts*.62);break;
  case'A':{const col=['#8a3a2a','#2a5a7a','#6a6a30','#5a5a5a'][Math.floor(hs(x>>1,y)*4)];c.fillStyle='#0006';c.fillRect(px+2,py+3,ts,ts);c.fillStyle=col;c.fillRect(px,py,ts,ts);c.fillStyle='#00000035';for(let k=0;k<5;k++)c.fillRect(px+ts*(.08+k*.2),py,ts*.06,ts);c.fillStyle='#ffffff25';c.fillRect(px,py,ts,ts*.08);c.strokeStyle='#000b';c.lineWidth=1.5;c.beginPath();if(!same(0,-1,'A')){c.moveTo(px,py);c.lineTo(px+ts,py)}if(!same(0,1,'A')){c.moveTo(px,py+ts);c.lineTo(px+ts,py+ts)}if(!same(-1,0,'A')){c.moveTo(px,py);c.lineTo(px,py+ts)}if(!same(1,0,'A')){c.moveTo(px+ts,py);c.lineTo(px+ts,py+ts)}c.stroke();break}
  case'Y':c.fillStyle='#0006';c.fillRect(px+ts*.15+3,py+ts*.15+3,ts*.7,ts*.7);c.fillStyle='#8a9096';c.fillRect(px+ts*.15,py+ts*.15,ts*.7,ts*.7);c.strokeStyle='#3a4044';c.lineWidth=2;c.strokeRect(px+ts*.15,py+ts*.15,ts*.7,ts*.7);c.beginPath();c.moveTo(px+ts*.15,py+ts*.15);c.lineTo(px+ts*.85,py+ts*.85);c.moveTo(px+ts*.85,py+ts*.15);c.lineTo(px+ts*.15,py+ts*.85);c.stroke();c.fillStyle=Math.sin(M.t*3)>0?'#f44':'#511';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.1,0,7);c.fill();break;
  case'O':c.fillStyle='#0006';c.beginPath();c.arc(px+ts*.55,py+ts*.55,ts*.42,0,7);c.fill();c.fillStyle='#d8dde0';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.42,0,7);c.fill();c.strokeStyle='#4a5a6a';c.lineWidth=2;c.stroke();c.fillStyle='#22303c';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.2,0,7);c.fill();c.strokeStyle='#8aa0b0';c.lineWidth=ts*.1;c.beginPath();c.moveTo(px+ts*.5,py+ts*.5);c.lineTo(px+ts*.88,py+ts*.2);c.stroke();break;
  case'E':sh(ts*.9,ts*.8,ts*.05,ts*.1);c.fillStyle='#5a4128';c.fillRect(px+ts*.05,py+ts*.1,ts*.9,ts*.8);for(let k=0;k<4;k++){c.fillStyle=['#4f9a46','#6ab25a','#3f8a3a'][(k+x+y)%3];c.beginPath();c.arc(px+ts*(.2+k*.2),py+ts*(.35+((k+x)%2)*.25),ts*.11,0,7);c.fill()}if(hh>.6){c.fillStyle='#e86a4a';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.05,0,7);c.fill()}break;
  case'W':c.fillStyle='#1f4a6a';c.fillRect(px,py,ts,ts);c.strokeStyle='#4a86a8';c.lineWidth=1.5;for(let k=0;k<2;k++){c.beginPath();for(let i=0;i<=6;i++){const xx=px+ts*i/6,yy=py+ts*(.3+k*.4)+Math.sin(M.t*2+i+x+k*2)*ts*.05;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke()}break;
  case'H':c.fillStyle='#0006';c.beginPath();c.ellipse(px+ts*.56,py+ts*.6,ts*.3,ts*.26,0,0,7);c.fill();c.fillStyle=hh>.5?'#a8442a':'#4a6a8a';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.3,0,7);c.fill();c.strokeStyle='#000a';c.lineWidth=1.5;c.stroke();c.strokeStyle='#00000055';c.beginPath();c.arc(px+ts*.5,py+ts*.5,ts*.18,0,7);c.stroke();break;
  case'J':sh(ts,ts*.7,0,ts*.2);c.fillStyle='#8a8a84';c.fillRect(px,py+ts*.15,ts,ts*.7);c.fillStyle='#a8a8a0';c.fillRect(px,py+ts*.15,ts,ts*.14);c.fillStyle='#c9a52a';for(let k=0;k<3;k++)c.fillRect(px+ts*(.1+k*.3),py+ts*.4,ts*.16,ts*.12);c.strokeStyle='#000a';c.lineWidth=1.2;c.strokeRect(px,py+ts*.15,ts,ts*.7);break;
  default:c.fillStyle='#777';c.fillRect(px+ts*.1,py+ts*.1,ts*.8,ts*.8)}
}
function draw(){
  const W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(1.5,window.devicePixelRatio||1);/* tope de resolución como en el pueblo: a 2,6× el móvil pintaba 2,7 veces más píxeles */if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr}
  cx.setTransform(dpr,0,0,dpr,0,0);ts=Math.floor(Math.min(W/COLS,H/ROWS));ox=Math.floor((W-ts*COLS)/2);oy=Math.floor((H-ts*ROWS)/2);if(!(ts>0))return;
  cx.fillStyle='#050607';cx.fillRect(0,0,W,H);cx.save();cx.translate(ox,oy);const shk=M.shake>0?(Math.random()-.5)*M.shake*12:0;cx.translate(shk,shk);M.shake=Math.max(0,(M.shake||0)-.03);
  const g=M.g,T=M.t,al=M.units.filter(isAl);
  const seen=(x,y)=>M.vis[Math.floor(y)*COLS+Math.floor(x)];
  const pal=M.pal;
  /* suelo, paredes y objetos fijos: se pintan una vez en una capa y solo se rehacen al descubrir casillas nuevas (antes, cientos de casillas a mano en cada fotograma) */
  let vc=0;for(let i=0;i<M.vis.length;i++)if(M.vis[i])vc++;const fk=vc+'|'+ts+'|'+dpr+'|'+COLS+'|'+ROWS+'|'+(M.gv||0);
  if(!FL||FL.k!==fk||FL.M!==M){if(!FL)FL={cv:document.createElement('canvas')};FL.k=fk;FL.M=M;FL.cv.width=Math.ceil(ts*COLS*dpr);FL.cv.height=Math.ceil(ts*ROWS*dpr);const oc=cx;cx=FL.cv.getContext('2d');cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,ts*COLS,ts*ROWS);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!M.vis[y*COLS+x])continue;const px=x*ts,py=y*ts;
    if(g[y][x]==1){const w=pal?pal.w:['#34434b','#4a5c66'];cx.fillStyle='#1d262b';cx.fillRect(px,py,ts,ts);cx.fillStyle=w[0];cx.fillRect(px,py,ts,ts*.62);cx.fillStyle=w[1];cx.fillRect(px,py,ts,ts*.14);cx.fillStyle='#0005';cx.fillRect(px,py+ts*.62,ts,ts*.1);
      cx.strokeStyle='#00000030';cx.lineWidth=1;cx.beginPath();cx.moveTo(px,py+ts*.34);cx.lineTo(px+ts,py+ts*.34);cx.moveTo(px+ts*(hs(x,y)>.5?.35:.65),py+ts*.14);cx.lineTo(px+ts*(hs(x,y)>.5?.35:.65),py+ts*.34);cx.stroke()}
    else{
      let base;if(pal){const f=M.fv[y][x];if(f==3)base='#3b372f';else base=pal.f[f][(x+y)%2]}else{const room=x<9?0:x<17?1:2;base=[['#3a3d36','#363931'],['#3b4547','#364042'],['#463d32','#41382e']][room][(x+y)%2]}
      cx.fillStyle=base;cx.fillRect(px,py,ts,ts);
      if(pal&&M.fv[y][x]==3){cx.fillStyle='#4a3b2a';for(let k=0;k<2;k++)cx.fillRect(px+ts*(.12+k*.5),py,ts*.2,ts);cx.fillStyle='#9aa0a4';cx.fillRect(px,py+ts*.18,ts,ts*.1);cx.fillRect(px,py+ts*.72,ts,ts*.1)}
      if(pal&&pal.line&&M.fv[y][x]==2){cx.fillStyle='#d9b84a';cx.fillRect(px+ts*.1,py+ts*.45,ts*.45,ts*.1)}
      const h=hs(x,y);if(h>.8){cx.fillStyle='#0003';cx.beginPath();cx.ellipse(px+ts*(.2+h*.6),py+ts*(.3+h*.4),ts*.22,ts*.12,h*3,0,7);cx.fill()}
      if(h<.07){cx.strokeStyle='#0006';cx.beginPath();cx.moveTo(px+ts*.2,py+ts*.8);cx.lineTo(px+ts*.5,py+ts*.5);cx.lineTo(px+ts*.8,py+ts*.6);cx.stroke()}
      const dcc=pal?M.dc[y][x]:((x==9||x==17)?'d':null);
      if(dcc=='d'){cx.strokeStyle='#b98a2a';cx.lineWidth=2;cx.strokeRect(px+2,py-1,ts-4,ts+2)}
      if(dcc=='b'){cx.strokeStyle='#9aa0a4';cx.lineWidth=2;for(let k=0;k<4;k++){cx.beginPath();cx.moveTo(px+ts*(.15+k*.23),py+2);cx.lineTo(px+ts*(.15+k*.23),py+ts-2);cx.stroke()}}
      if(g[y][x]==2){cx.fillStyle='#0006';cx.beginPath();cx.ellipse(px+ts*.5,py+ts*.7,ts*.42,ts*.2,0,0,7);cx.fill();cx.fillStyle='#5b5750';cx.beginPath();cx.moveTo(px+ts*.12,py+ts*.72);cx.lineTo(px+ts*.25,py+ts*.3);cx.lineTo(px+ts*.55,py+ts*.18);cx.lineTo(px+ts*.88,py+ts*.5);cx.lineTo(px+ts*.82,py+ts*.74);cx.closePath();cx.fill();cx.strokeStyle='#000a';cx.stroke();cx.fillStyle='#7a766c';cx.fillRect(px+ts*.3,py+ts*.34,ts*.2,ts*.14);cx.fillRect(px+ts*.55,py+ts*.5,ts*.18,ts*.12)}
      if(g[y][x]==3)drawProp(cx,M.pr[y][x],px,py,ts,x,y)}}
  cx=oc}
  cx.drawImage(FL.cv,0,0,ts*COLS,ts*ROWS);
  try{drawHz()}catch(er){}
  (M.blood||[]).forEach(b=>{if(!seen(b.x,b.y))return;cx.fillStyle='#5a1210aa';cx.beginPath();cx.ellipse(b.x*ts,b.y*ts,ts*.3,ts*.18,b.a,0,7);cx.fill()});
  // salida
  cx.fillStyle='#e0a12433';cx.fillRect(1*ts,4*ts,3*ts,3*ts);cx.save();cx.beginPath();cx.rect(1*ts,4*ts,3*ts,3*ts);cx.clip();cx.strokeStyle='#e0a12440';cx.lineWidth=5;for(let i=-4;i<8;i++){cx.beginPath();cx.moveTo(1*ts+i*ts*.5,4*ts);cx.lineTo(1*ts+i*ts*.5+3*ts,7*ts);cx.stroke()}cx.restore();
  cx.strokeStyle='#e0a124';cx.lineWidth=2;cx.setLineDash([7,5]);cx.strokeRect(1*ts+1,4*ts+1,3*ts-2,3*ts-2);cx.setLineDash([]);cx.fillStyle='#ffd877';cx.font='bold '+Math.round(ts*.3)+'px sans-serif';cx.textAlign='center';cx.fillText('SALIDA',2.5*ts,7.55*ts);
  // cajones
  M.meds.forEach(m=>{if(!m.on||!seen(m.x,m.y))return;const x=m.x*ts,y=m.y*ts;cx.fillStyle='#0006';cx.fillRect(x-ts*.22+2,y-ts*.18+3,ts*.44,ts*.36);cx.fillStyle='#f0f0ec';cx.fillRect(x-ts*.22,y-ts*.18,ts*.44,ts*.36);cx.fillStyle='#d33';cx.fillRect(x-ts*.04,y-ts*.13,ts*.08,ts*.26);cx.fillRect(x-ts*.13,y-ts*.04,ts*.26,ts*.08)});
  M.barrels.forEach(b=>{if(!seen(b.x,b.y))return;cx.strokeStyle='rgba(255,90,60,'+(.35+.3*Math.sin(M.t*5))+')';cx.lineWidth=2;cx.beginPath();cx.arc(b.x*ts,b.y*ts,ts*.42,0,7);cx.stroke();if(M.focus===b){cx.strokeStyle='#ff4a3a';cx.lineWidth=3;cx.beginPath();cx.arc(b.x*ts,b.y*ts,ts*.5,0,7);cx.stroke()}});
  M.crates.forEach(c=>{if(!seen(c.x,c.y))return;const x=c.x*ts,y=c.y*ts,w=ts*.62,h=ts*.5;cx.fillStyle='#0006';cx.fillRect(x-w/2+2,y-h/2+4,w,h);cx.fillStyle=c.on?'#a67c3d':'#4a4034';cx.fillRect(x-w/2,y-h/2,w,h);cx.strokeStyle='#000b';cx.lineWidth=1.5;cx.strokeRect(x-w/2,y-h/2,w,h);cx.strokeStyle=c.on?'#6f4f22':'#2c261e';cx.beginPath();cx.moveTo(x-w/2,y-h/2);cx.lineTo(x+w/2,y+h/2);cx.moveTo(x+w/2,y-h/2);cx.lineTo(x-w/2,y+h/2);cx.stroke();if(c.on){cx.fillStyle='#d9b85a';cx.fillRect(x-3,y-3,6,6)}});
  // coches
  (M.cars||[]).forEach(c=>{if(!seen(c.x,c.y))return;const x=c.x*ts,y=c.y*ts,w=ts*.95,h=ts*.5;cx.fillStyle='#0006';cx.fillRect(x-w/2+2,y-h/2+4,w,h);cx.fillStyle=c.on?c.c:'#4a4a48';cx.fillRect(x-w/2,y-h/2,w,h);cx.fillStyle='#10161a';cx.fillRect(x-w*.18,y-h/2+3,w*.34,h-6);cx.fillStyle='#cfd6d8';cx.fillRect(x+w/2-4,y-h/2+2,3,4);cx.fillRect(x+w/2-4,y+h/2-6,3,4);cx.strokeStyle='#000b';cx.lineWidth=1.5;cx.strokeRect(x-w/2,y-h/2,w,h)});
  // símbolo de inspección
  insp().forEach(c=>{if(!seen(c.x,c.y))return;const x=c.x*ts,y=c.y*ts-ts*(c.car?.52:.5),r=ts*.17;cx.fillStyle='rgba(20,26,29,.85)';cx.beginPath();cx.arc(x,y,r+1.5,0,7);cx.fill();cx.strokeStyle='#d9b85a';cx.lineWidth=1.5;cx.beginPath();cx.arc(x-r*.18,y-r*.18,r*.5,0,7);cx.moveTo(x+r*.2,y+r*.2);cx.lineTo(x+r*.62,y+r*.62);cx.stroke()});
  // eventos
  M.pois.forEach(p=>{if(!p.on||!seen(p.x,p.y))return;const x=p.x*ts,y=p.y*ts,k=(T*.9)%1;cx.strokeStyle='rgba(255,200,80,'+(.7*(1-k))+')';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,ts*(.3+k*.7),0,7);cx.stroke();
    cx.save();cx.translate(x,y);cx.rotate(Math.PI/4);cx.fillStyle='#e0a124';cx.shadowColor='#ffb53a';cx.shadowBlur=12;cx.fillRect(-.26*ts,-.26*ts,.52*ts,.52*ts);cx.restore();cx.fillStyle='#1b1203';cx.font='bold '+Math.round(ts*.46)+'px sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('!',x,y+1)});
  cx.textBaseline='alphabetic';
  drawMo();if(window.ZX&&ZX.hud)ZX.hud(cx,M,ts*COLS);
  // enemigos
  M.en.forEach(z=>{if(!al.some(u=>Math.hypot(z.x-u.x,z.y-u.y)<=6.3))return;const r=(z.t=='f'?.5:z.t=='r'?.32:.4)*ts*.82;
    if(window.ZX&&ZX.has(z.t))ZX.dm(cx,z,ts,M.t,M);else if(ZT[z.t].hum)drawFig(cx,z.x*ts,z.y*ts,{r:.4*ts*.82,fa:z.fa||0,skin:'#c9a27e',shirt:z.band?BANDS[z.band].col:{b:'#7a5a34',m:'#4f5e40',e:'#2c2f3a'}[z.t],helm:z.t=='e'?'#1d2026':z.t=='m'?'#3c4632':null,gun:z.t=='b'?'#222':'#111',gl:z.t=='b'?1.4:1.9,flash:M.t-(z.sh||-9)<.12,big:z.t!='b'});
    else drawFig(cx,z.x*ts,z.y*ts,{r,fa:z.fa||0,zom:1,skin:z.t=='s'?'#7e9a86':'#8fae72',shirt:z.t=='f'?'#6a5a3a':z.t=='s'?'#3f4f44':z.t=='r'?'#5a4a52':'#56624a',eyes:1});
    if(z.band&&BANDS[z.band]){const bb=BANDS[z.band];cx.strokeStyle=bb.acc;cx.lineWidth=2;cx.beginPath();cx.arc(z.x*ts,z.y*ts,.4*ts*.82*1.05,0,7);cx.stroke();
      if(z.flag){const px=z.x*ts+ts*.3,py=z.y*ts,t=M.t*4;cx.strokeStyle='#3a2a1c';cx.lineWidth=2;cx.beginPath();cx.moveTo(px,py+ts*.2);cx.lineTo(px,py-ts*.75);cx.stroke();cx.fillStyle=bb.flag;cx.strokeStyle=bb.acc;cx.lineWidth=1;cx.beginPath();cx.moveTo(px,py-ts*.75);for(let i=0;i<=5;i++)cx.lineTo(px+ts*.5*i/5,py-ts*.75+Math.sin(t+i)*1.5);for(let i=5;i>=0;i--)cx.lineTo(px+ts*.5*i/5,py-ts*.4+Math.sin(t+i)*1.5);cx.closePath();cx.fill();cx.stroke()}}
    if(M.focus===z){cx.strokeStyle='#ff4a3a';cx.lineWidth=2.5;cx.beginPath();cx.arc(z.x*ts,z.y*ts,r*1.5,0,7);cx.stroke()}
    if(z.hp<z.mhp){cx.fillStyle='#400';cx.fillRect(z.x*ts-r,z.y*ts-r-9,r*2,3.5);cx.fillStyle='#e33';cx.fillRect(z.x*ts-r,z.y*ts-r-9,r*2*z.hp/z.mhp,3.5)}});
  (M.ally||[]).forEach(a=>{if(a.p.hp<=0||!seen(a.x,a.y))return;const r=.34*ts;drawFig(cx,a.x*ts,a.y*ts,{r,fa:a.fa||0,skin:'#d8a878',shirt:a.lead?'#c9a24a':'#3f6a8f',helm:a.lead?'#6a4a1a':'#2a3a4a',gl:1.6,flash:M.t-(a.sh||-9)<.12});const f=Math.max(0,Math.min(1,a.p.hp/(a.mhp||75)));if(a.lead){cx.font='bold 10px sans-serif';cx.textAlign='center';cx.fillStyle='#f2c542';cx.fillText('Presidenta Valeria',a.x*ts,a.y*ts-r-13)}cx.fillStyle='#000a';cx.fillRect(a.x*ts-r,a.y*ts-r-9,r*2,4);cx.fillStyle='#6fa8dc';cx.fillRect(a.x*ts-r,a.y*ts-r-9,r*2*f,4)});
  M.tr.forEach(t=>{cx.strokeStyle=t.c||(t.m?'#fff':'#ffe08a');cx.lineWidth=t.m?3:1.6;cx.globalAlpha=Math.min(1,t.l*8);cx.beginPath();cx.moveTo(t.a.x*ts,t.a.y*ts);cx.lineTo(t.b.x*ts,t.b.y*ts);cx.stroke();cx.globalAlpha=1});
  al.forEach(u=>{if(u.p.arm=='medico'){cx.fillStyle='rgba(90,255,150,.08)';cx.beginPath();cx.arc(u.x*ts,u.y*ts,ts*3.2,0,7);cx.fill()}});
  M.units.forEach(u=>{if(u.dead||u.p.hp>0)return;const x=u.x*ts,y=u.y*ts,r=.34*ts;cx.fillStyle='#0006';cx.beginPath();cx.ellipse(x,y+r*.3,r*1.2,r*.6,0,0,7);cx.fill();cx.fillStyle='#7a828a';cx.beginPath();cx.ellipse(x,y,r*1.1,r*.6,0,0,7);cx.fill();cx.strokeStyle='#000a';cx.stroke();
    cx.strokeStyle='#5ad08a';cx.lineWidth=3;cx.beginPath();cx.arc(x,y,r*1.6,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,(u.rv||0)/3));cx.stroke();cx.strokeStyle='#e0a124';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,r*1.9,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,(u.dt||0)/25));cx.stroke();cx.fillStyle='#fff';cx.font='bold '+Math.round(ts*.3)+'px sans-serif';cx.textAlign='center';cx.fillText('✚',x,y+ts*.1)});
  if(M.sel)al.forEach(u=>{if(M.sel.has(u)){cx.strokeStyle='#fff';cx.lineWidth=2;cx.setLineDash([4,3]);cx.beginPath();cx.arc(u.x*ts,u.y*ts,ts*.5,0,7);cx.stroke();cx.setLineDash([])}});
  al.forEach(u=>{const p=u.p,r=.34*ts,sk=(p.look&&p.look.skin!==undefined&&typeof p.look.skin=='number'?SKINS[p.look.skin]:p.look&&p.look.skin)||'#e8b88a',gl={franco:2.1,pesado:1.5,esp:1.7}[p.arm]||1.6;
    drawFig(cx,u.x*ts,u.y*ts,{r,fa:u.fa||0,skin:typeof sk=='string'?sk:'#e8b88a',shirt:(p.look&&p.look.shirt)||PC[p.prof]||'#647d4b',hair:p.look&&p.look.hair,helm:p.arm?'#3d4630':null,pack:p.gear&&p.gear.pack,gl,big:p.arm=='pesado',flash:u.cd>.78});
    cx.fillStyle='#fff';cx.font='bold '+Math.round(ts*.26)+'px sans-serif';cx.textAlign='center';cx.fillText(p.n.split(' ')[0],u.x*ts,u.y*ts+r+ts*.32);
    const f=Math.max(0,Math.min(1,p.hp/mhp(p)));cx.fillStyle='#000a';cx.fillRect(u.x*ts-r,u.y*ts-r-9,r*2,4);cx.fillStyle=f<.35?'#d8493a':f<.7?'#e0a124':'#8dbb69';cx.fillRect(u.x*ts-r,u.y*ts-r-9,r*2*f,4)});
  M.fl.forEach(f=>{cx.globalAlpha=Math.max(0,Math.min(1,f.l*1.4));cx.fillStyle=f.c;cx.strokeStyle='#000';cx.lineWidth=3;cx.font='bold '+Math.round(ts*.4)+'px sans-serif';cx.textAlign='center';const yy=(f.y-.55-(1-f.l)*.9)*ts;cx.strokeText(f.t,f.x*ts,yy);cx.fillText(f.t,f.x*ts,yy);cx.globalAlpha=1});
  // iluminación: oscuridad con huecos de luz alrededor del equipo
  /* oscuridad a media resolución (es un degradado suave: no se nota) */
  if(!M.pv){const DS=.5;if(!dark||dark.width!==Math.ceil(ts*COLS*DS)||dark.height!==Math.ceil(ts*ROWS*DS)){dark=document.createElement('canvas');dark.width=Math.ceil(ts*COLS*DS);dark.height=Math.ceil(ts*ROWS*DS)}
  const dc=dark.getContext('2d');dc.setTransform(1,0,0,1,0,0);dc.globalCompositeOperation='source-over';dc.clearRect(0,0,dark.width,dark.height);dc.setTransform(DS,0,0,DS,0,0);dc.fillStyle='rgba(2,4,6,.62)';dc.fillRect(0,0,ts*COLS,ts*ROWS);
  dc.globalCompositeOperation='destination-out';al.forEach(u=>{const gr=dc.createRadialGradient(u.x*ts,u.y*ts,ts*1.2,u.x*ts,u.y*ts,ts*6.3);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=gr;dc.beginPath();dc.arc(u.x*ts,u.y*ts,ts*6.4,0,7);dc.fill()});
  // la salida siempre algo iluminada
  const gr2=dc.createRadialGradient(2.5*ts,5.5*ts,ts,2.5*ts,5.5*ts,ts*4);gr2.addColorStop(0,'rgba(0,0,0,.8)');gr2.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=gr2;dc.beginPath();dc.arc(2.5*ts,5.5*ts,ts*4,0,7);dc.fill();
  cx.drawImage(dark,0,0,ts*COLS,ts*ROWS)}
  cx.restore();try{drawDanger(W,H)}catch(er){}
  const e=S.exp;if(e){$('qm_t').textContent=e.z.n+' · amenaza '+threatOf(lvlOf(e.z));$('qm_o').textContent=e.complete?'Objetivo cumplido · vuelve a la salida':(M.mo&&!M.mo.done)?moTxt():'Eventos '+Math.min(e.step,nR(e))+'/'+nR(e)+' · botín '+(Object.keys(e.loot).map(k=>k+' '+Math.round(e.loot[k])).join(', ')||'—');
    const ex=atExit(),ev=M.evac&&M.evac.on&&!M.evac.done;$('qm_ret').textContent=ev?('Evacuando… '+Math.ceil(M.evac.need-M.evac.t)+' s'):ex?(e.complete?(M.evac&&!M.evac.done&&!M.pv?'📻 Pedir evacuación':'Salir ✓'):'Salir (abandonar)'):'Ir a la salida';$('qm_ret').className=ex&&e.complete?'good':'';
    $('qm_med').disabled=S.res.meds<2}
}
function loop(t){if(!shown||!M)return;const dt=Math.min(.1,(t-lastT)/1000||0);lastT=t;if(!evOpen&&!M.pause){for(let i=0;i<(M.spd||1);i++)step(dt)}else M.fl.forEach(f=>f.l-=dt*.5);if(M&&shown){draw();strip();updIn()}raf=requestAnimationFrame(loop)}
/* ---------- interfaz ---------- */
function build(){
  ov=document.createElement('div');ov.id='qm';ov.innerHTML='<div class="qm-head"><b id="qm_t"></b><span id="qm_o"></span><button id="qm_pz">II</button><button id="qm_sp">×1</button><button id="qm_min">▾</button></div><div class="qm-cv"><canvas id="qm_cv"></canvas><div id="qm_u"></div><button id="qm_in" style="display:none">🔍 Inspeccionar</button><div id="qm_ev"></div></div><div class="qm-ctl"><span class="qm-hint">Tú diriges (mover, medicinas, salir); el equipo pelea solo · toca a un compañero para mandarlo por separado · los disparos atraen zombis · los barriles rojos explotan</span><button id="qm_med">＋ Medicina</button><button id="qm_ret">Ir a la salida</button></div>';
  document.body.appendChild(ov);cv=$('qm_cv');cx=cv.getContext('2d');
  $('qm_in').onclick=()=>{const c=nearInsp();if(c&&!evOpen)openCrate(c);$('qm_in').style.display='none'};
  $('qm_min').onclick=()=>{shown=false;ov.style.display='none';cancelAnimationFrame(raf)};
  $('qm_pz').onclick=()=>{if(!M)return;M.pause=!M.pause;$('qm_pz').textContent=M.pause?'▶':'II'};
  $('qm_sp').onclick=()=>{if(!M)return;M.spd=M.spd==2?1:2;$('qm_sp').textContent='×'+M.spd};
  $('qm_med').onclick=()=>{const e=S.exp;if(!e||S.res.meds<2)return;S.res.meds-=2;tm(e).forEach(p=>{p.hp=Math.min(mhp(p),Math.max(0,p.hp)+25)});M.units.forEach(u=>{if(!u.dead)addFl(M,u.x,u.y,'+25','#8dbb69')})};
  $('qm_ret').onclick=()=>{const e=S.exp;if(!e||!M)return;if(atExit()){if(hasDown()){toast('Un compañero ha caído: reanímalo antes de salir.');return}if(!e.complete&&!confirm_ok()){return}if(e.complete&&M.evac&&!M.evac.done&&!M.pv){if(!M.evac.on){M.evac.on=1;toast('📻 Pides la evacuación: aguanta '+M.evac.need+' s en la salida hasta que llegue la ayuda.')}return}leave()}else{M.focus=null;order(2,5)}};
  $('qm_u').addEventListener('pointerdown',ev=>{const c=ev.target.closest('[data-i]');if(!c||!M)return;ev.stopPropagation();const i=+c.dataset.i;if(i<0)M.sel=null;else{const u=M.units[i];if(!u||u.dead)return;M.sel=(M.sel&&M.sel.size==1&&M.sel.has(u))?null:new Set([u])}});
  cv.addEventListener('pointerdown',ev=>{if(evOpen||!M)return;const r=cv.getBoundingClientRect(),fx=(ev.clientX-r.left-ox)/ts,fy=(ev.clientY-r.top-oy)/ts;tap(fx,fy)})}
let uSig='';
const ABI={medico:'✚ cura',franco:'🎯 críticos',pesado:'🛡 blindado',expl:'👁 visión',ing:'🔧 botín+',esp:'⚡',soldado:''};
function strip(){const key=M.units.map(u=>[u.dead?'x':u.p.hp>0?Math.round(u.p.hp/6):'d'+Math.ceil(u.dt||0),M.sel&&M.sel.has(u)?1:0].join()).join('|')+(M.sel?'s':'a');if(key===uSig)return;uSig=key;
  $('qm_u').innerHTML='<div class="qu '+(M.sel?'':'on')+'" data-i="-1"><b>Todos</b></div>'+M.units.map((u,i)=>{if(u.dead)return'';const p=u.p,f=Math.max(0,Math.min(1,p.hp/mhp(p)));return'<div class="qu '+(M.sel&&M.sel.has(u)?'on':'')+(p.hp<=0?' dn':'')+'" data-i="'+i+'"><b>'+p.n.split(' ')[0]+'</b><small>'+(p.hp<=0?'CAÍDO '+Math.ceil(u.dt)+'s':(ABI[p.arm]||''))+'</small><div class="q-bar"><i style="width:'+(f*100)+'%;background:'+(f<.35?'#d8493a':f<.7?'#e0a124':'#8dbb69')+'"></i></div></div>'}).join('')}
let armedLeave=0;function confirm_ok(){if(armedLeave&&Date.now()-armedLeave<4000){armedLeave=0;return true}armedLeave=Date.now();toast('Pulsa otra vez para abandonar la misión sin completarla.');return false}
function updIn(){const b=$('qm_in');if(!b)return;const c=(evOpen||M.pause)?null:nearInsp();if(!c){b.style.display='none';return}b.style.display='block';b.textContent='🔍 Inspeccionar '+(c.car?'coche':'cajón');b.style.left=Math.round(ox+c.x*ts)+'px';b.style.top=Math.round(oy+c.y*ts+ts*.45)+'px'}
function insp(){return M.crates.concat(M.cars||[]).filter(c=>c.on)}
function nearInsp(){const al=M.units.filter(isAl);let r=null,bd=1.6;insp().forEach(c=>{if(!M.vis[Math.floor(c.y)*COLS+Math.floor(c.x)])return;al.forEach(u=>{const d=Math.hypot(u.x-c.x,u.y-c.y);if(d<bd){bd=d;r=c}})});return r}
function tap(fx,fy){
  const vis=(x,y)=>M.vis[Math.floor(y)*COLS+Math.floor(x)];
  const cu=M.units.find(u=>isAl(u)&&Math.hypot(u.x-fx,u.y-fy)<.6);
  if(cu){M.sel=(M.sel&&M.sel.size==1&&M.sel.has(cu))?null:new Set([cu]);return}
  let z=null,bd=.75;M.en.forEach(q=>{const d=Math.hypot(q.x-fx,q.y-fy);if(d<bd&&vis(q.x,q.y)==2){bd=d;z=q}});
  if(z){toast('Tu equipo combate solo: indícales adónde ir.');return}
  const c=insp().find(c=>vis(c.x,c.y)&&Math.hypot(c.x-fx,c.y-fy)<.8);
  if(c){M.focus=null;M.goal=null;order(c.x,c.y);return}
  const p=M.pois.find(p=>p.on&&vis(p.x,p.y)&&Math.hypot(p.x-fx,p.y-fy)<.8);
  if(p){M.focus=null;M.goal={k:'p',o:p};order(p.x,p.y);return}
  if(fx<0||fy<0||fx>=COLS||fy>=ROWS||solid(M,Math.floor(fx),Math.floor(fy)))return;
  M.focus=null;M.goal=null;order(fx,fy)}
function open(){if(!ov)build();ov.style.display='flex';shown=true;lastT=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
window.exEvent=function(){const e=S.exp;if(!e)return;
  if(!M||M.step0!==e.z.n){M=gen(e);M.step0=e.z.n;evOpen=false;if(!ov)build();$('qm_ev').style.display='none';
    if(e.z.intro&&e.step==0){open();evOpen=true;const d=$('qm_ev');d.style.display='flex';d.innerHTML='<div class="qe-box"><small>'+e.z.n+'</small><p><i>'+e.z.intro+'</i></p>'+briefing(e)+'<button onclick="document.getElementById(\'qm_ev\').style.display=\'none\';_qmGo()">Entrar</button></div>';return}}
  open()};
function briefing(e){const l=lvlOf(e.z),mb=M&&M.mo?'<p><small><b>'+M.mo.brief+'</b></small></p>':'',names=[...new Set(M.en.map(z=>ZT[z.t].n))];return'<p><small>Amenaza <b>'+threatOf(l)+'</b> · enemigos: '+(names.join(', ')||'—')+(e.bandId&&window.BANDS&&BANDS[e.bandId]?' · banda: <b>'+BANDS[e.bandId].n+'</b>':'')+'<br>Mejor botín posible: <b style="color:'+RAR[maxRar(l)][1]+'">'+RAR[maxRar(l)][0]+'</b></small></p>'+mb}
window._qmGo=()=>{evOpen=false};
window._qmShown=()=>shown;/* mientras la misión ocupa la pantalla, el pueblo de debajo no se dibuja (antes se dibujaban los dos a la vez) */{const oR=window.render;window.render=function(){if(shown)return;return oR.apply(this,arguments)};try{render=window.render}catch(e){}}window._qm={draw:()=>draw(),vtpl,rngS,rollRar,lvlOf,rollGear,RW,giveGear,tpl,buildTheme,M:()=>M,tap,step,leave,gen,themeOf,PAL,preview(th){const ci=CHK.indexOf(Object.keys(K2T).find(k=>K2T[k]==th&&CHK.includes(k)));const e={z:{n:'Prueba '+th,l:{},evs:[1,2,3]},dist:1,step:0,team:[]};if(ci>=0)e.z.chap=ci;else e.z.id=th;M=gen(e);M.vis.fill(2);M.pv=1;if(!ov)build();ov.style.display='flex';shown=true;cv.width=cv.width;draw();return M.theme}};
})();
