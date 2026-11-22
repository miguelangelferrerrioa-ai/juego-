/* Batería de regresión de After the Silence (comportamiento en partida).
   Uso: node tools/regresion.js            (necesita Playwright de Node)
   Juega escenarios completos y comprueba reglas que nunca deben romperse. Imprime OK/FALLO por regla. */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const R=path.dirname(__dirname),SV=f=>fs.readFileSync(path.join(R,'partidas',f),'utf8');
const results=[];const ok=(name,cond,info)=>{results.push([cond?'OK   ':'FALLO',name,info||''])};
async function open(b,save){const pg=await b.newPage({viewport:{width:932,height:415}});const pe=[];pg.on('pageerror',e=>pe.push(String(e).slice(0,160)));
 await pg.addInitScript(s=>{try{localStorage.clear();localStorage.setItem('dtls1',s)}catch(e){}window.ZI_OFF=1},save);
 await pg.goto('file://'+path.join(R,'index.html'));await pg.waitForTimeout(1500);
 await pg.click('text=Continuar');await pg.waitForTimeout(400);await pg.click('text=Cargar');await pg.waitForTimeout(3000);
 for(let i=0;i<10;i++){for(const t of['text=Saltar','text=Entendido','text=Cerrar']){try{await pg.click(t,{timeout:120})}catch(e){}}}
 await pg.evaluate(()=>{window.__U0=window.upd;window.upd=()=>{};window.render=()=>{};
  /* vigila reglas en cada paso */
  window.__V={preg:0,kid:0,unarmed:0,old:0,nan:0,err:0,em:'',jump:0,jex:''};window.__LP=new Map();
  window.__step=dt=>{T+=dt;try{__U0(dt)}catch(e){__V.err++;__V.em=String(e).slice(0,120)}
   U.forEach(u=>{const p=u.p;if(p&&p.id!==undefined&&typeof p.id==='number'){if(p.preg)__V.preg++;if(p.age<18)__V.kid++}if(!isFinite(u.x)||!isFinite(u.y)||!isFinite(u.hp))__V.nan++});
   /* saltos: la posición visible de cada soldado (su unidad de combate o él mismo) no puede moverse más de 1,2 casillas de un paso a otro */
   S.ppl.forEach(p=>{if(!p.arm||p.away)return;if(p.tw){__LP.delete(p);return}/* dentro de una torre no se ve: entrar o salir no es un salto */const u=U.find(u=>u.p===p),x=u?u.x:p.x,y=u?u.y:p.y,l=__LP.get(p);if(l&&Math.hypot(x-l[0],y-l[1])>1.2){__V.jump++;__V.jex=__V.jex||(p.n+' '+Math.hypot(x-l[0],y-l[1]).toFixed(1))}__LP.set(p,[x,y])});
   S.ppl.forEach(p=>{if(p.fg===T){if(p.preg)__V.preg++;if(p.age<18)__V.kid++;if(!p.wp&&horde){const h=S.bld.find(b=>b.type==='hall');if(!h||Math.hypot(p.x-(h.x+h.w/2),p.y-(h.y+h.h+.8))>7)__V.unarmed++}if(!p.wp&&p.age>=65)__V.old++}if(!isFinite(p.x)||!isFinite(p.y)||!isFinite(p.hp))__V.nan++})};
  window.__run=async(s,stop)=>{let t=0;while(t<s){__step(.05);t+=.05;if(Math.round(t/.05)%40===0)await new Promise(r=>setTimeout(r,25));if(stop&&stop())break}return t}});
 return {pg,pe}}
const scenarios=[];const ONLY=process.env.SOLO||'';
/* 1) zombis sueltos */
scenarios.push(['Zombis sueltos','dia3.json',async pg=>pg.evaluate(async()=>{
 const F=S.ppl.find(p=>p.sex==='F'&&p.age>=18&&!p.arm);if(F){F.arm='soldado';F.preg=1;F.wp={n:'Pistola',v:5}}
 const kid=S.ppl.find(p=>p.age<18);const out=[];
 for(let k=0;k<4;k++){const pop=S.ppl.length;S.raidT=.01;let seen=0,far=0;const g=vigGeo();
  await __run(260,()=>{if(window.raidOn)seen=1;const z=Z.find(z=>z.act);if(z&&!nearTown(z.x,z.y))U.forEach(u=>{let m=1e9;g.town.forEach(q=>{m=Math.min(m,Math.hypot(q[0]-u.x,q[1]-u.y))});far=Math.max(far,m)});return seen&&!window.raidOn&&!Z.some(z=>z.act)});
  out.push({seen,dead:pop-S.ppl.length,far:+far.toFixed(1),left:Z.filter(z=>z.act).length})}
 return {out,V:__V}})]);
/* 2) zombis sueltos sin soldados */
scenarios.push(['Zombis sueltos sin soldados','dia3.json',async pg=>pg.evaluate(async()=>{S.ppl.forEach(p=>p.arm=null);const a=S.ppl.find(p=>p.age>=18&&!p.preg);if(a)a.wp={n:'Pistola',v:5};const out=[];
 for(let k=0;k<4;k++){const pop=S.ppl.length;S.raidT=.01;let seen=0;await __run(260,()=>{if(window.raidOn)seen=1;return seen&&!window.raidOn&&!Z.some(z=>z.act)});out.push({seen,dead:pop-S.ppl.length})}
 return {out,V:__V}})]);
/* 2b) el caso real: el único soldado está de expedición y nadie tiene arma */
scenarios.push(['Pueblo desarmado','dia3.json',async pg=>pg.evaluate(async()=>{S.ppl.forEach(p=>{p.wp=null});const sol=S.ppl.find(p=>p.arm);if(sol)sol.away=1;const out=[];
 for(let k=0;k<5;k++){const pop=S.ppl.length;S.raidT=.01;let seen=0;await __run(300,()=>{if(window.raidOn)seen=1;return seen&&!window.raidOn&&!Z.some(z=>z.act)});out.push({seen,dead:pop-S.ppl.length,left:Z.filter(z=>z.act).length})}
 return {out,V:__V}})]);
/* 2c) horda con el pueblo desarmado: un zombi llega a la puerta del ayuntamiento */
scenarios.push(['Horda en la puerta','dia3.json',async pg=>pg.evaluate(async()=>{S.ppl.forEach(p=>{p.wp=null;p.arm=null});const h=S.bld.find(b=>b.type==='hall');const pop=S.ppl.length;
 startHorde();await __run(8);Z.filter(z=>z.act).forEach((z,i)=>{z.x=h.x+h.w/2+(i%3)-1;z.y=h.y+h.h+3.5});let fought=0;const t=await __run(420,()=>{if(S.ppl.some(p=>p.fg===T&&!p.wp))fought=1;return !horde});
 return {fought,ended:!horde,t:Math.round(t),dead:pop-S.ppl.length,inside:S.ppl.filter(p=>p.inside).length,V:__V}})]);
/* 2d) primera horda con un solo soldado: debe acudir a donde atacan y no dejar que rompan edificios */
scenarios.push(['Primera horda con un soldado','dia3.json',async pg=>pg.evaluate(async()=>{const out=[];for(let k=0;k<3;k++){const nb=S.bld.length;startHorde();let first=-1;await __run(400,()=>{if(first<0&&Z.some(z=>z.act&&z.hp<z.mhp))first=1;return !horde});out.push({rotos:nb-S.bld.length,ended:!horde})}return {out,V:__V}})]);
/* 3) hordas temprana y avanzada */
for(const sv of ['dia3.json','partida_larga_dia248.json'])scenarios.push(['Hordas '+sv,sv,async pg=>pg.evaluate(async()=>{const out=[];
 for(let k=0;k<3;k++){const pop=S.ppl.length;startHorde();const t=await __run(420,()=>!horde);
  /* tras la horda: nadie queda dentro del ayuntamiento y vuelven a trabajar */
  await __run(30);out.push({ended:!horde,t:Math.round(t),dead:pop-S.ppl.length,inside:S.ppl.filter(p=>p.inside).length,U:U.length})}
 const tw=S.bld.filter(b=>BT[b.type].gun).length;return {out,V:__V,towers:tw}})]);
/* 4) horda con muros: los soldados quedan por dentro */
scenarios.push(['Horda con muros','dia3.json',async pg=>pg.evaluate(async()=>{
 const bl=S.bld.filter(b=>!['road','wall','gate'].includes(b.type));let x0=1e9,y0=1e9,x1=-1,y1=-1;bl.forEach(b=>{x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.w);y1=Math.max(y1,b.y+b.h)});x0-=3;y0-=3;x1+=2;y1+=2;let id=Math.max(...S.bld.map(b=>b.id))+1;
 for(let x=x0;x<=x1;x++)for(const y of [y0,y1])if(!occ[y*N+x])S.bld.push({type:'wall',x,y,w:1,h:1,lvl:1,hp:160,id:id++});
 for(let y=y0+1;y<y1;y++)for(const x of [x0,x1])if(!occ[y*N+x])S.bld.push({type:'wall',x,y,w:1,h:1,lvl:1,hp:160,id:id++});rebuild();
 S.ppl.filter(p=>!p.preg&&p.age>=18).slice(0,4).forEach(p=>{p.arm='soldado';p.job=0});
 startHorde();let outside=0,samples=0;const g=vigGeo();await __run(420,()=>{samples++;U.forEach(u=>{if(u.x<x0||u.x>x1+1||u.y<y0||u.y>y1+1){outside++;if(!window.__ex)window.__ex=[+u.x.toFixed(1),+u.y.toFixed(1),u.p.arm,!!Z.find(z=>z.act&&Math.hypot(z.x-u.x,z.y-u.y)<6)]}});return !horde});
 return {ended:!horde,outsideSamples:outside,ex:window.__ex,box:[x0,y0,x1,y1],V:__V}})]);
/* 4b) agarre del Zombi cazador y asalto de banda */
scenarios.push(['Agarre y bandas','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{startHorde();await __run(3);const u=U[0];u.pin=T+5;u.pinBy={hp:999};const x=u.x,y=u.y;await __run(2);const m1=Math.hypot(u.x-x,u.y-y);u.pinBy.hp=0;await __run(2);const m2=Math.hypot(u.x-x,u.y-y);
 await __run(420,()=>!horde);const pop=S.ppl.length;bandRaid('cuervos');const st=!!horde;await __run(420,()=>!horde);return {m1,m2,st,ended:!horde,dead:pop-S.ppl.length,V:__V}})]);
/* 4c) sucesos encadenados (los fallos de estado solo salen al repetir) */
for(const sv of ['dia3.json','partida_larga_dia248.json'])scenarios.push(['Secuencia '+sv,sv,async pg=>pg.evaluate(async()=>{const log=[];const pop0=S.ppl.length;window.__pop0=pop0;
 const horda=async n=>{const p=S.ppl.length;n?bandRaid('cuervos'):startHorde();await __run(420,()=>!horde);await __run(20);log.push((n?'banda':'horda')+':'+(!horde?'ok':'NO ACABA')+':'+(p-S.ppl.length))};
 const suelto=async()=>{const p=S.ppl.length;S.raidT=.01;let seen=0;await __run(260,()=>{if(window.raidOn)seen=1;return seen&&!window.raidOn&&!Z.some(z=>z.act)});log.push('suelto:'+(seen?'ok':'no sale')+':'+(p-S.ppl.length))};
 await horda(0);await suelto();await horda(0);await horda(1);await suelto();await horda(0);return {log,dead:pop0-S.ppl.length,pop0,V:__V}})]);
/* 4d) enfermedades: se curan solas sin antibióticos */
scenarios.push(['Enfermedades','dia3.json',async pg=>pg.evaluate(async()=>{S.res.abx=0;const ps=S.ppl.filter(p=>p.age>=18).slice(0,3);ps[0].illness='Gripe';ps[0].illD=3;ps[1].illness='Infección';ps[1].illD=6;ps[2].illness='Fiebre';delete ps[2].illD;
 const days=[];for(let d=0;d<7;d++){S.nextH=S.day+60;S.raidT=1e6;S.dayT=599.9;await __run(1);days.push(ps.map(p=>p.illness?1:0).join(''))}return {days,left:ps.filter(p=>p.illness).length,V:__V}})]);
/* 4e) parejas: tras el parto y el descanso, padre y madre vuelven a estar disponibles */
scenarios.push(['Parejas','dia3.json',async pg=>pg.evaluate(async()=>{window.show=()=>{};S.ppl.forEach(p=>{p.illness=''});S.bld.push(...[0,1,2,3].map(i=>({type:'house',x:2+i*3,y:2,w:2,h:2,lvl:1,hp:100,id:9000+i})));rebuild();
 const M=S.ppl.find(p=>p.sex==='M'&&p.age>=18&&!whyNot(p)),F=S.ppl.find(p=>p.sex==='F'&&p.age>=18&&!whyNot(p)&&!kin(p,M));pairM=M.id;pairF=F.id;pairGo();const st=!!F.preg;
 for(let d=0;d<9;d++){S.nextH=S.day+60;S.raidT=1e6;M.illness='';F.illness='';S.dayT=599.9;await __run(1)}
 M.illness='';F.illness='';return {st,M:whyNot(M)||'libre',F:whyNot(F)||'libre',txt:window.whyTxt?whyTxt(F,'descansa'):''}})]);
/* 4f) soldado alistado sin arma: no dispara, pelea a puñetazos */
scenarios.push(['Soldado sin arma','dia3.json',async pg=>pg.evaluate(async()=>{const sol=S.ppl.find(p=>p.arm);sol.wp=null;sol.outfit=null;let shots=0,punches=0;
 const oF=FX.push;startHorde();await __run(400,()=>{const u=U.find(u=>u.p===sol);if(u){FX.forEach(f=>{if(f.t>.09&&f.a&&Math.hypot(f.a[0]-u.x,f.a[1]-u.y)<.01)shots++})}return !horde});
 return {shots,ended:!horde,V:__V}})]);
/* 5) guardar / cargar */
scenarios.push(['Guardar y cargar','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{await __run(20);const IGN=new Set(['php','fl','inside','mv','path','pk','pg','pv','pT','dx','tx','ty','x','y','thru','nopath','vtx','vty','vw','_px','_py','_dx']);
 const norm=o=>{const c=JSON.parse(JSON.stringify(o));c.obs=(c.obs||[]).map(q=>q.x+','+q.y+','+q.t).sort();return c};const a=norm(S);save(true);load();const b=norm(S);let d=0,ex='';
 const walk=(x,y,p)=>{if(IGN.has(p.split('.').pop()))return;if(x&&typeof x==='object'&&y&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p+'.'+k)}else if(x!==y&&!(typeof x==='number'&&Math.abs(x-y)<1e-9)){d++;ex=ex||p}};walk(a,b,'S');return {diffs:d,ex}})]);
/* 5b) partida principal dañada (cortada): la ranura no sale 'Vacía', se carga la última copia buena y la dañada se guarda aparte; guardar no reescribe la copia 'más avanzada' en cada guardado */
scenarios.push(['Ranura dañada','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{const k=KEY;save(true);const day=S.day,pop=S.ppl.length;if(!localStorage.getItem(k+'_bk1'))localStorage.setItem(k+'_bk1',localStorage.getItem(k));
 const bt0=localStorage.getItem(k+'_best');S.res.wood+=1;save();const bestSame=localStorage.getItem(k+'_best')===bt0;
 LIVE=false;localStorage.setItem(k,localStorage.getItem(k).slice(0,5000));localStorage.removeItem(k+'_corrupt');
 continueGame();const ui=(document.getElementById('titleContent')||{}).innerHTML||'';slotPick(['dtls1','dtls_s2','dtls_s3'].indexOf(k));await new Promise(r=>setTimeout(r,1500));
 let back=null;try{back=JSON.parse(localStorage.getItem(k)).day}catch(e){}
 return {ui:/dañada/.test(ui),day:S.day,pop:S.ppl.length,day0:day,pop0:pop,corrupt:(localStorage.getItem(k+'_corrupt')||'').length,back,bestSame}})]);
/* 5c) atascos y vaivenes (skill game-ai): en una horda grande ningún zombi (salvo el inválido, que se arrastra) ni soldado se queda >4 s sin avanzar sin estar atacando,
   los soldados no van y vuelven sin parar, y en un día normal nadie del pueblo se queda >20 s queriendo ir a un sitio sin moverse */
scenarios.push(['Atascos y vaivenes','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{const zH=new Map(),uH=new Map(),zSt=new Set(),uSt=new Set(),rev=new Map();let acc=0;startHorde();
 await __run(60,()=>{acc+=.05;if(acc<.5-1e-9)return false;acc=0;
  Z.forEach(z=>{if(!z.act||z.hp<=0||z.t==='v')return;const h=zH.get(z)||[];h.push([z.x,z.y,!!z.at]);if(h.length>9)h.shift();zH.set(z,h);if(h.length>=9&&Math.hypot(h[8][0]-h[0][0],h[8][1]-h[0][1])<.3&&!h.some(x=>x[2]))zSt.add(z)});
  U.forEach(u=>{if(u.hp<=0)return;const h=uH.get(u)||[];h.push([u.x,u.y,u.mv]);if(h.length>7)h.shift();uH.set(u,h);const n=h.length;
   if(n>=3){const d1=[h[n-2][0]-h[n-3][0],h[n-2][1]-h[n-3][1]],d2=[h[n-1][0]-h[n-2][0],h[n-1][1]-h[n-2][1]],l1=Math.hypot(...d1),l2=Math.hypot(...d2);if(l1>.15&&l2>.15&&(d1[0]*d2[0]+d1[1]*d2[1])/(l1*l2)<-.7)rev.set(u,(rev.get(u)||0)+1)}
   if(n>=7&&h.every(x=>x[2])&&Math.hypot(h[6][0]-h[0][0],h[6][1]-h[0][1])<.3)uSt.add(u)});return false});
 const nZ=zH.size,maxRev=Math.max(0,...rev.values());while(horde)await __run(5);
 const P0=new Map();let pMax=0,who='';acc=0;await __run(120,()=>{acc+=.05;if(acc<.25-1e-9)return false;acc=0;S.ppl.forEach(p=>{if(p.away||p.inside||!isFinite(p.x))return;const w=Math.hypot((p.tx??p.x)-p.x,(p.ty??p.y)-p.y);const s=P0.get(p);
  if(w>.8){if(!s||Math.hypot(p.x-s[1],p.y-s[2])>.25)P0.set(p,[T,p.x,p.y]);else if(T-s[0]>pMax){pMax=T-s[0];who=p.n}}else P0.delete(p)});return false});
 return {nZ,zSt:zSt.size,uSt:uSt.size,maxRev,pMax:+pMax.toFixed(1),who}})]);
/* 5d) hordas tardías: pasado el tope (hEff) en un pueblo grande hay más especiales, más vida y asediadores que van a la torre elegida; en un pueblo pequeño nada de eso; la horda termina sin matanza */
scenarios.push(['Endurecer hordas tardías','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{const pop0=S.ppl.length;startHorde();await __run(1);const a=Z.filter(z=>z.act),zN=a.filter(z=>z.t==='z').length,sp=a.length-zN,sg=a.filter(z=>z.sg),hpZ=Math.max(...a.filter(z=>z.t==='z').map(z=>z.mhp)),tg=horde.sgT,tgOK=!!(bm[tg]&&['tower','mtower','sniper'].includes(bm[tg].type));
 let t=0;while(horde&&t<420){await __run(5);t+=5}const ended=!horde,dead=pop0-S.ppl.length;
 /* pueblo pequeño: mismo número de horda con 30 personas */S.ppl=S.ppl.slice(0,30);rebuild();Z=Z.filter(z=>!z.act);startHorde();await __run(1);const b=Z.filter(z=>z.act);const small={sg:b.filter(z=>z.sg).length,hpZ:Math.max(...b.filter(z=>z.t==='z').map(z=>z.mhp))};while(horde&&t<900){await __run(5);t+=5}
 return {zN,sp,sg:sg.length,hpZ:Math.round(hpZ),tgOK,ended,dead,pop0,small:{sg:small.sg,hpZ:Math.round(small.hpZ)},smallEnded:!horde}})]);
/* 5e) vuelta de la expedición en solitario: un explorador fuerte tiene mucho menos riesgo de morir al volver que uno débil desde el mismo tramo */
scenarios.push(['Vuelta en solitario','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{window.show=()=>{};window.save=()=>{};const ad=S.ppl.filter(p=>p.age>=18&&!p.preg&&!p.away);ad.sort((a,b)=>upow(b)-upow(a));const fu=ad[0],de=ad[ad.length-1];
 const run=(p,rnd)=>{S.solo=null;soloGo(p.id);const s=S.solo;if(!s)return 'sin expedición';s.step=30;s.returning=1;s.returnDay=S.day;const r=Math.random;Math.random=()=>rnd;let txt='';try{txt=soloResolveReturn()}finally{Math.random=r}return byId(p.id)?'vuelve':'muere'};
 const cF=soloRetChance({step:30},fu),cD=soloRetChance({step:30},de);const rF=run(fu,.6),rD=run(de,.6);return {cF,cD,rF,rD,base:40}})]);
/* 6) expedición solitaria y de equipo */
scenarios.push(['Expediciones','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{window.show=()=>{};window.save=()=>{};
 const p=S.ppl.filter(q=>!q.away&&q.age>=18&&!q.preg).sort((a,b)=>upow(b)-upow(a))[0];const f0=S.res.food,w0=S.res.water,g0=S.res.gas||0;soloGo(p.id);const started=!!S.solo;const cost=(f0-S.res.food)+(w0-S.res.water)+(g0-(S.res.gas||0));
 for(let i=0;i<6;i++){if(!S.solo)break;if(S.solo.pend)soloPick(0);else soloStep()}const away=p.away;if(S.solo){S.solo.step=0;soloRequestReturn()}
 return {started,cost,away,back:!S.solo&&!p.away}})]);
/* 5c) soldado armado con un zombi cerca y a la vista: no se queda quieto (ni con sueltos ni en hordas) */
for(const sv of ['dia3.json','partida_larga_dia248.json'])scenarios.push(['Soldado no se queda quieto '+sv,sv,async pg=>pg.evaluate(async()=>{S.ppl.filter(p=>p.arm).forEach(p=>{if(!p.wp)p.wp={n:'Pistola',v:5}});const st=new Map(),Q=[];
 const chk=()=>{S.ppl.forEach(p=>{if(!p.arm||p.away||!p.wp||p.preg||p.age<18||p.hp<=0)return;if(horde&&p.job&&bm[p.job]&&BT[bm[p.job].type].gun)return;const u=U.find(u=>u.p===p),x=u?u.x:p.x,y=u?u.y:p.y;let zd=1e9;Z.forEach(z=>{if(!z.act||z.hp<=0)return;const d=Math.hypot(z.x-x,z.y-y);if(d<zd&&!wallBetween(x,y,z.x,z.y))zd=d});
  const s=st.get(p)||{x,y,t:0,cd:0},mv=Math.hypot(x-s.x,y-s.y)>.02,sh=u&&u.cd>s.cd+.1;if(zd<7&&!mv&&!sh){s.t+=.05;if(s.t>3&&!s.r){s.r=1;Q.push(p.n+' a '+zd.toFixed(1)+' ['+[p.arm,u?'U':'noU',p.job?(bm[p.job]||{}).type:'-',horde?'horda':'suelto',u&&u.pin>T?'agarrado':'',p.inside?'dentro':''].join(',')+']')}}else{s.t=0;s.r=0}s.x=x;s.y=y;s.cd=u?u.cd:0;st.set(p,s)})};
 for(let k=0;k<3;k++){S.raidT=.01;let seen=0;await __run(200,()=>{chk();if(window.raidOn)seen=1;return seen&&!window.raidOn&&!Z.some(z=>z.act)})}
 startHorde();await __run(400,()=>{chk();return !horde});return {Q,V:__V}})]);
/* 5d) reparar: con el ayuntamiento justo, un edificio mejorado se puede reparar con los materiales de su nivel */
scenarios.push(['Reparar','dia3.json',async pg=>pg.evaluate(async()=>{const bad=[];S.bld.filter(b=>BT[b.type]&&!['road','bridge'].includes(b.type)).forEach(b=>{const L0=b.lvl;for(let L=1;L<=15;L++){b.lvl=L;const c=repairCost(Object.assign({},b,{hp:1,lvl:L}));const up=L>1?ucost(Object.assign({},b,{lvl:L-1})):{};const used=new Set([...Object.keys(BT[b.type].cost||{}),...Object.keys(up),'wood','metal']);for(let j=1;j<L-1;j++)Object.keys(ucost(Object.assign({},b,{lvl:j}))).forEach(k=>used.add(k));Object.keys(c).forEach(k=>{if(!used.has(k))bad.push(b.type+' nv'+L+' pide '+k)})}b.lvl=L0});return {bad:[...new Set(bad)].slice(0,8),V:__V}})]);
/* 5e) un soldado alistado se puede asignar a una torre de vigilancia y en la horda se queda en ella */
scenarios.push(['Soldado en torre','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{window.show=window.show||(()=>{});const t=S.bld.find(b=>b.type==='tower');if(!t)return {err:'sin torre',V:__V};
 S.ppl.forEach(p=>{if(p.job===t.id)p.job=0});const sol=S.ppl.find(p=>p.arm&&!p.away&&!p.preg&&p.age>=18&&p.job!==t.id);sol.wp=sol.wp||{n:'Fusil',v:8};sol.job=0;
 let html='';const os=window.show;window.show=(a,h)=>{html=h};try{asgList(t.id)}finally{window.show=os}const listed=html.includes('asg('+sol.id+','+t.id+')');
 asg(sol.id,t.id);const assigned=sol.job===t.id;await __run(1);const hidden=!!sol.tw;
 /* cupo: con la torre llena no se puede meter a otro */const ws=S.ppl.filter(p=>p.arm&&!p.away&&!p.preg&&p.age>=18&&p.wp&&p.job!==t.id);if(ws[0])asg(ws[0].id,t.id);if(ws[1])asg(ws[1].id,t.id);const full=S.ppl.filter(p=>p.job===t.id).length<=slots(t);
 /* protegido: zombis pegados a la torre no le quitan vida */const h0=sol.hp;startHorde();await __run(6);const inU=U.some(u=>u.p===sol);Z.filter(z=>z.act).slice(0,6).forEach((z,i)=>{z.x=t.x+t.w/2+(i%3)-1;z.y=t.y+t.h+.8});let minHp=sol.hp,far=0;await __run(400,()=>{minHp=Math.min(minHp,sol.hp);if(Math.hypot(sol.x-t.x-t.w/2,sol.y-t.y-t.h/2)>.6)far++;return !horde});
 const alive=S.ppl.includes(sol),standing=!!bm[t.id];return {listed,assigned,hidden,full,inU,lost:+(h0-minHp).toFixed(1),far,alive,standing,V:__V}})]);
/* 5f) soldado con arma cuerpo a cuerpo (lanza): no puede ser tirador de torre y en la horda no dispara */
scenarios.push(['Soldado con lanza','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{window.toast=window.toast||(()=>{});const t=S.bld.find(b=>b.type==='tower');S.ppl.forEach(p=>{if(p.job===t.id)p.job=0});
 const sol=S.ppl.find(p=>p.arm&&!p.away&&!p.preg&&p.age>=18);sol.wp={n:'Lanza térmica',v:56};sol.job=0;asg(sol.id,t.id);const refused=sol.job!==t.id;
 sol.job=t.id;await __run(1);const kicked=sol.job!==t.id;
 S.ppl.filter(p=>p.arm&&p!==sol).forEach(p=>p.away=1);startHorde();await __run(5);const u=U.find(u=>u.p===sol);let shots=0,hits=0;const seen=new Set();
 await __run(300,()=>{FX.forEach(f=>{if(f.a&&u&&!seen.has(f)&&Math.hypot(f.a[0]-u.x,f.a[1]-u.y)<.05){seen.add(f);shots++}});return !horde});
 return {refused,kicked,inU:!!u,shots,V:__V}})]);
/* 5g) en plena horda: quitar a un soldado de una torre lo mete a combatir; meterlo en una torre lo saca del grupo */
scenarios.push(['Torre en plena horda','partida_larga_dia248.json',async pg=>pg.evaluate(async()=>{window.show=window.show||(()=>{});const t=S.bld.find(b=>b.type==='tower');const g=S.ppl.find(p=>p.job===t.id&&p.arm&&p.wp&&!p.preg);
 startHorde();await __run(5);const before=U.some(u=>u.p===g);unjob(g.id,t.id);await __run(1);const u=U.find(u=>u.p===g);const joined=!!u;const x0=u?u.x:0,y0=u?u.y:0;let acted=0;await __run(30,()=>{if(u&&(Math.hypot(u.x-x0,u.y-y0)>.5||u.cd>0.5))acted=1;return acted});
 const other=U.find(v=>typeof v.p.id==='number'&&v.p.wp&&!(window.isMelee&&isMelee(v.p.wp))&&v.p!==g);let out=null;if(other){S.ppl.filter(p=>p.job===t.id).forEach(p=>p.job=0);asg(other.p.id,t.id);await __run(1);out=!U.some(v=>v.p===other.p)}
 await __run(400,()=>!horde);return {before,joined,acted,out,ended:!horde,V:__V}})]);
/* 5h) territorio en el borde del mapa: la horda y los zombis sueltos no aparecen dentro ni junto a la base */
scenarios.push(['Horda con territorio en el borde','dia3.json',async pg=>pg.evaluate(async()=>{for(let i=0;i<PG;i++)S.parc[i]=1;rebuild();dirtyT=1;let id=Math.max(...S.bld.map(b=>b.id))+1;
 for(let x=10;x<70;x+=12)if(okAt(x,1,2,2,0))S.bld.push({type:'house',x,y:1,w:2,h:2,lvl:1,hp:120,id:id++});rebuild();
 const bad=[];const chk=()=>{Z.forEach(z=>{if(z._ck||!z.act)return;z._ck=1;let m=1e9;S.bld.forEach(b=>{if(b.type==='road')return;const dx=Math.max(b.x-z.x,0,z.x-(b.x+b.w)),dy=Math.max(b.y-z.y,0,z.y-(b.y+b.h));m=Math.min(m,Math.hypot(dx,dy))});if(ownP(z.x,z.y)||m<8)bad.push([+z.x.toFixed(1),+z.y.toFixed(1),+m.toFixed(1)])})};
 startHorde();await __run(.2);chk();const n=Z.filter(z=>z.act).length;await __run(400,()=>!horde);S.raidT=.01;let seen=0;await __run(120,()=>{if(window.raidOn&&!seen){seen=1;__step(.05);chk()}return seen&&!window.raidOn&&!Z.some(z=>z.act)});
 return {n,bad:bad.slice(0,5),nbad:bad.length,ended:!horde,V:__V}})]);
/* 5i) plazas del ejército: 4 por nivel de barracón; sin barracones no se alista */
scenarios.push(['Plazas del ejército','dia3.json',async pg=>pg.evaluate(async()=>{window.pSheet=()=>{};S.res.ammo=999;const B=S.bld.filter(b=>b.type==='barr');S.bld=S.bld.filter(b=>b.type!=='barr');rebuild();
 const c=()=>S.ppl.filter(p=>p.arm).length,free=()=>S.ppl.find(p=>!p.arm&&!p.preg&&p.age>=18&&!p.away);const n0=c();enlist(free().id,'soldado');const sin=c()-n0;
 S.bld.push({type:'barr',x:2,y:2,w:B[0]?B[0].w:3,h:B[0]?B[0].h:2,lvl:1,hp:200,id:9999});rebuild();S.ppl.forEach(p=>{if(p.arm)p.arm=null});let k=0;for(let i=0;i<8;i++){const f=free();if(!f)break;enlist(f.id,'soldado')}k=c();
 return {cap0:0,sin,con:k,cap:acap(),V:__V}})]);
(async()=>{const b=await chromium.launch();const t0=Date.now();
 for(const [name,sv,fn] of scenarios){if(ONLY&&!name.includes(ONLY))continue;const {pg,pe}=await open(b,SV(sv));let r=null;try{r=await fn(pg)}catch(e){r={crash:String(e).slice(0,200)}}
  const V=r&&r.V||{};const tag=name;
  if(r.crash)ok(tag+': se ejecuta',false,r.crash);
  if(V.err!==undefined){ok(tag+': sin errores de juego',!V.err,V.em);ok(tag+': embarazadas no pelean',!V.preg,V.preg);ok(tag+': menores no pelean',!V.kid,V.kid);ok(tag+': en hordas los desarmados solo pelean en la puerta del ayuntamiento',!V.unarmed,V.unarmed);ok(tag+': mayores de 65 sin arma no pelean',!V.old,V.old);ok(tag+': sin valores rotos',!V.nan,V.nan);ok(tag+': soldados sin teletransportes',!V.jump,V.jump+' '+V.jex)}
  if(name==='Zombis sueltos'){ok(tag+': aparecen',r.out.every(o=>o.seen),JSON.stringify(r.out));ok(tag+': no matan al pueblo (≤1 muerto)',r.out.every(o=>o.dead<=1),JSON.stringify(r.out.map(o=>o.dead)));ok(tag+': soldados no salen al campo (≤4,5 casillas del pueblo)',r.out.every(o=>o.far<=4.5),JSON.stringify(r.out.map(o=>o.far)))}
  if(name==='Pueblo desarmado'){ok(tag+': los zombis sueltos no matan al pueblo (≤1 muerto cada uno)',r.out.every(o=>o.seen&&o.dead<=1),JSON.stringify(r.out));ok(tag+': el zombi acaba muerto',r.out.every(o=>!o.left),JSON.stringify(r.out))}
  if(name==='Horda en la puerta'){ok(tag+': salen a pelear a puñetazos',r.fought,JSON.stringify(r));ok(tag+': la horda termina',r.ended,JSON.stringify(r));ok(tag+': no muere todo el pueblo',r.dead<=4,JSON.stringify(r))}
  if(name==='Primera horda con un soldado'){ok(tag+': terminan',r.out.every(o=>o.ended),JSON.stringify(r.out));ok(tag+': casi no rompen edificios (≤1 por horda)',r.out.every(o=>o.rotos<=1),JSON.stringify(r.out))}
  if(name==='Zombis sueltos sin soldados')ok(tag+': no matan al pueblo (≤2 muertos)',r.out.every(o=>o.dead<=2),JSON.stringify(r.out));
  if(name.startsWith('Hordas')){ok(tag+': terminan',r.out.every(o=>o.ended),JSON.stringify(r.out));ok(tag+': nadie queda encerrado tras la horda',r.out.every(o=>!o.inside&&!o.U),JSON.stringify(r.out))}
  if(name==='Horda con muros'){ok(tag+': termina',r.ended);ok(tag+': soldados por dentro del muro',r.outsideSamples<20,r.outsideSamples+' '+JSON.stringify(r.ex)+' '+JSON.stringify(r.box))}
  if(name==='Agarre y bandas'){ok(tag+': soldado agarrado no se mueve',r.m1<.01,r.m1);ok(tag+': al morir el cazador queda libre',r.m2>.3,r.m2);ok(tag+': el asalto de banda empieza y termina',r.st&&r.ended,JSON.stringify(r))}
  if(name.startsWith('Secuencia')){ok(tag+': todo termina',!r.log.some(l=>/NO ACABA|no sale/.test(l)),r.log.join(' '));ok(tag+': sin matanzas (≤25 % de bajas en total)',r.dead<=Math.max(3,Math.ceil(.25*r.pop0)),r.dead+'/'+r.pop0+' · '+r.log.join(' '))}
  if(name==='Enfermedades'){ok(tag+': se curan solas sin antibióticos (cada una se cura en algún momento)',[0,1,2].every(i=>r.days.some(d=>d[i]==='0')),r.days.join(' '));ok(tag+': la gripe no se cura el primer día',r.days[0][0]==='1',r.days.join(' '))}
  if(name==='Parejas'){ok(tag+': se forma la pareja',r.st,JSON.stringify(r));ok(tag+': tras parto y descanso vuelven a estar disponibles',r.M==='libre'&&r.F==='libre',JSON.stringify(r))}
  if(name.startsWith('Soldado no se queda quieto'))ok(tag+': con un zombi cerca y a la vista va a por él o dispara',r.Q.length===0,r.Q.slice(0,5).join(', '));
  if(name==='Reparar')ok(tag+': solo pide materiales que el edificio ya usó para llegar a su nivel',r.bad.length===0,r.bad.join(', '));
  if(name==='Soldado en torre'){ok(tag+': el soldado sale en la lista de la torre',r.listed,JSON.stringify(r));ok(tag+': se le puede asignar',r.assigned,JSON.stringify(r));ok(tag+': en la horda se queda en la torre (no patrulla)',r.assigned&&!r.inU,JSON.stringify(r));ok(tag+': está dentro (no se ve ni merodea)',r.hidden&&r.far===0,JSON.stringify(r));ok(tag+': no se pasa del cupo',r.full,JSON.stringify(r));ok(tag+': protegido mientras la torre está en pie',!r.standing||(r.alive&&r.lost<=0.01),JSON.stringify(r))}
  if(name==='Soldado con lanza'){ok(tag+': no se le puede poner de tirador',r.refused,JSON.stringify(r));ok(tag+': si estaba en una torre, deja el puesto',r.kicked,JSON.stringify(r));ok(tag+': en la horda no dispara (pelea de cerca)',r.inU&&r.shots===0,JSON.stringify(r))}
  if(name==='Torre en plena horda'){ok(tag+': en la torre no está en el grupo',!r.before,JSON.stringify(r));ok(tag+': al quitarlo de la torre entra a combatir',r.joined&&r.acted,JSON.stringify(r));ok(tag+': al meterlo en una torre sale del grupo',r.out!==false,JSON.stringify(r));ok(tag+': la horda termina',r.ended,JSON.stringify(r))}
  if(name==='Horda con territorio en el borde'){ok(tag+': ningún zombi aparece dentro del territorio ni junto a edificios',r.nbad===0&&r.n>0,JSON.stringify(r));ok(tag+': la horda termina',r.ended,JSON.stringify(r))}
  if(name==='Plazas del ejército'){ok(tag+': sin barracones no se puede alistar',r.sin===0,JSON.stringify(r));ok(tag+': un barracón de nivel 1 da 4 plazas y no se pasa',r.cap===4&&r.con===4,JSON.stringify(r))}
  if(name==='Soldado sin arma'){ok(tag+': no dispara',r.shots===0,JSON.stringify(r));ok(tag+': la horda termina',r.ended,JSON.stringify(r))}
  if(name==='Atascos y vaivenes'){ok(tag+': zombis atascados sin atacar ≤2 %',r.zSt<=Math.max(1,.02*r.nZ),JSON.stringify(r));ok(tag+': ningún soldado atascado',r.uSt===0,JSON.stringify(r));ok(tag+': soldados sin vaivén (≤4 idas y vueltas por minuto)',r.maxRev<=4,JSON.stringify(r));ok(tag+': nadie del pueblo parado >20 s queriendo moverse',r.pMax<=20,JSON.stringify(r))}
  if(name==='Endurecer hordas tardías'){ok(tag+': más especiales que normales a medias (≥35 % especiales)',r.sp>=.35*(r.sp+r.zN),JSON.stringify(r));ok(tag+': zombis normales con más vida que en un pueblo pequeño (×2 o más)',r.hpZ>=2*r.small.hpZ,JSON.stringify(r));ok(tag+': hay asediadores con una torre elegida',r.sg>0&&r.tgOK,JSON.stringify(r));ok(tag+': termina sin matanza (≤10 % de bajas)',r.ended&&r.dead<=Math.ceil(.1*r.pop0),JSON.stringify(r));ok(tag+': pueblo pequeño sin asediadores y termina',r.small.sg===0&&r.smallEnded,JSON.stringify(r))}
  if(name==='Vuelta en solitario'){ok(tag+': el fuerte tiene mucha más probabilidad de volver (≥ base+30)',r.cF>=r.base+30,JSON.stringify(r));ok(tag+': el débil se queda como antes',r.cD===r.base,JSON.stringify(r));ok(tag+': con la misma suerte el fuerte vuelve y el débil no',r.rF==='vuelve'&&r.rD==='muere',JSON.stringify(r))}
  if(name==='Ranura dañada'){ok(tag+': la ranura avisa y no sale vacía',r.ui,JSON.stringify(r));ok(tag+': carga la copia buena (mismo día y gente)',r.day===r.day0&&r.pop===r.pop0&&r.back===r.day0,JSON.stringify(r));ok(tag+': guarda aparte la dañada',r.corrupt===5000,JSON.stringify(r));ok(tag+': un guardado normal no reescribe la copia más avanzada',r.bestSame,JSON.stringify(r))}
  if(name==='Guardar y cargar')ok(tag+': partida idéntica',r.diffs===0,r.ex);
  if(name==='Expediciones'){ok(tag+': solitaria arranca sin coste (comida, agua ni gasolina)',r.started&&r.cost<=0,JSON.stringify(r));ok(tag+': vuelve y queda en casa',r.back,JSON.stringify(r))}
  ok(tag+': sin errores de página',!pe.length,pe.slice(0,2).join(' | '));await pg.close()}
 await b.close();
 results.forEach(r=>console.log(r[0],r[1],r[0]!=='OK   '?r[2]:''));
 const bad=results.filter(r=>r[0]!=='OK   ').length;console.log('\n'+(results.length-bad)+' OK, '+bad+' FALLOS · '+Math.round((Date.now()-t0)/1000)+' s');process.exit(bad?1:0)})();
