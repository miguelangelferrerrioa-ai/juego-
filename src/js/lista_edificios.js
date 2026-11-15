/* Lista de edificios: tarjetas con miniatura, los del mismo tipo agrupados (×N), aviso de dañados/parados; al tocar un grupo se despliegan sus edificios. */
(function(){
'use strict';
const bar=(p,c)=>`<div class="mu-bar"><i style="width:${Math.max(0,Math.min(100,p))}%;background:${c}"></i></div>`;
const hpc=p=>p>60?'#5c5':p>30?'#dc4':'#d44';
const stat=(ic,v,l,c)=>`<div class="bl-st${c?' '+c:''}"><span>${ic}</span><b>${v}</b><small>${l}</small></div>`;
let open='';
const hp=b=>b.hp/Math.max(1,mxhp(b))*100;
window.bldOpen=t=>{open=open===t?'':t;bldList();const el=document.querySelector('#pan .bl-sub')||document.querySelector('#pan .bl-g.on');if(el)el.scrollIntoView({block:'center'})};
window.bldList=function(){
 const l=S.bld.filter(b=>b.type!=='road'&&b.type!=='bridge'&&BT[b.type]),off=l.filter(b=>b.off||b.pause).length,dmg=l.filter(b=>hp(b)<60).length;
 const G={};l.forEach(b=>{(G[b.type]=G[b.type]||[]).push(b)});
 const keys=Object.keys(G).sort((a,b)=>(a==='hall'?-1:b==='hall'?1:0)||BT[a].n.localeCompare(BT[b].n));
 let h=`<div class="bl-sts">${stat('🏠',l.length,'Edificios')}${stat('▦',keys.length,'Tipos')}${stat('⚠',dmg,'Dañados',dmg?'r':'')}${stat('⏸',off,'Parados',off?'y':'')}</div><div class="bl-grid">`;
 for(const t of keys){const L=G[t],n=L.length,lv=L.map(b=>b.lvl),mn=Math.min(...lv),mx=Math.max(...lv),avg=L.reduce((s,b)=>s+hp(b),0)/n,
   d=L.filter(b=>hp(b)<60).length,o=L.filter(b=>b.off||b.pause).length,on=open===t;
  const warn=(d?`<span class="bl-w r">⚠ ${d} dañado${d>1?'s':''}</span>`:'')+(o?`<span class="bl-w y">⏸ ${o} parado${o>1?'s':''}</span>`:'');
  const act=n===1?`centerOn(${L[0].x+L[0].w/2},${L[0].y+L[0].h/2});bPanel(${L[0].id})`:`bldOpen('${t}')`;
  h+=`<div class="bl-g${on?' on':''}${d?' dmg':o?' off':''}" onclick="${act}"><canvas class="bl-mini" data-t="${t}" data-l="${mx}" width="64" height="56"></canvas><div class="bl-i"><b>${BT[t].n}${n>1?` <em>×${n}</em>`:''}</b><small>Nv ${mn===mx?mx:mn+'–'+mx}${n>1?(on?' · ▲':' · ▼ ver todos'):''}</small>${warn}${bar(avg,hpc(avg))}</div></div>`;
  if(on&&n>1)h+=`<div class="bl-sub">`+L.slice().sort((a,b)=>hp(a)-hp(b)||b.lvl-a.lvl).map(b=>{const p=hp(b),s=b.pause?'⏸ Parado':b.off?'⚡ Sin energía':p<60?'⚠ Dañado':'';
   return `<div class="bl-r" onclick="event.stopPropagation();centerOn(${b.x+b.w/2},${b.y+b.h/2});bPanel(${b.id})"><span class="mu-lv">Nv ${b.lvl}</span>${s?`<small class="bl-s">${s}</small>`:''}${bar(p,hpc(p))}<small class="bl-hp">${Math.round(p)}%</small></div>`}).join('')+`</div>`}
 show('Edificios',h+'</div>');
 document.querySelectorAll('#pan canvas.bl-mini').forEach(c=>{try{const x=c.getContext('2d'),t=c.dataset.t,d=BT[t],lv=+c.dataset.l||1,s=Math.min(60/((d.w+d.h)*32),50/(d.z+(d.w+d.h)*16));
  x.translate(32-(d.w-d.h)*16*s,d.z*s+3);x.scale(s,s);if(t==='wall'||t==='gate'||t==='trap')box(x,0,0,1,1,6,'#8a8a80');else drawB(x,{type:t,x:0,y:0,w:d.w,h:d.h,lvl:lv,hp:1,id:0},1)}catch(e){}})};
const st=document.createElement('style');st.textContent=`
.bl-sts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.bl-st{display:flex;align-items:center;gap:6px;padding:5px 8px;border:1px solid #34432c;border-radius:9px;background:#141b12}.bl-st span{font-size:14px}.bl-st b{font-size:16px;color:#f2d27a}.bl-st small{color:#9aa58c;font-size:10px;line-height:1.1}.bl-st.r{border-color:#b8442e}.bl-st.r b{color:#ffb39e}.bl-st.y{border-color:#a08a2a}
.bl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:7px;margin-top:8px}
.bl-g{display:flex;gap:8px;align-items:center;padding:6px 8px;border:1px solid #3a4a34;border-radius:10px;background:linear-gradient(#1b2418,#121810);cursor:pointer;transition:transform .12s,border-color .12s}
.bl-g:active{transform:scale(.98)}.bl-g.on{border-color:#e0b040;box-shadow:0 0 0 1px #e0b04055 inset}
.bl-g.dmg{border-color:#b8442e}.bl-g.off{border-color:#a08a2a}
.bl-mini{width:64px;height:56px;flex:none;background:radial-gradient(circle at 50% 60%,#2c3826,#141a10);border-radius:8px}
.bl-i{flex:1;min-width:0}.bl-i b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bl-i b em{font-style:normal;color:#f2c542}
.bl-i small{display:block;color:#9aa58c;font-size:11px;margin:1px 0 3px}
.bl-w{display:inline-block;font-size:10px;font-weight:700;border-radius:6px;padding:1px 6px;margin:0 4px 3px 0}.bl-w.r{background:#4a1c14;color:#ffb39e}.bl-w.y{background:#3e3612;color:#f2d27a}
.bl-sub{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;padding:6px;border:1px dashed #e0b04066;border-radius:10px;background:#0e130c;animation:pin .18s ease-out}
.bl-r{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:6px;padding:5px 7px;border-radius:8px;background:#182016;border:1px solid #2c3826;cursor:pointer}
.bl-r .mu-bar{grid-column:1/-1}.bl-s{color:#f2c542;font-size:10px}.bl-hp{color:#9aa58c;font-size:10px;text-align:right}`;document.head.appendChild(st);
})();
