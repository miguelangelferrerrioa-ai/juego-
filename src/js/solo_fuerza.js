/* Expedición solitaria: indicador de cómo le irán los combates (según su fuerza y el tramo) y de cuánto le protege su defensa, al elegir a quién mandar y durante la expedición. */
(function(){
'use strict';
function lab(w){return w>=.8?['ok','los ganará casi siempre']:w>=.4?['mid','los ganará a veces']:['bad','los perderá casi siempre']}
function prot(p){const a=soloArm(p);return Math.round((1-a)*100)}
const oV=window.soloView;window.soloView=function(){const r=oV.apply(this,arguments);try{const s=S.solo,p=s&&byId(s.id);if(!p)return r;
 const w=soloWin(p,s.step),[k,t]=lab(w),pr=prot(p),pan=document.getElementById('pan');const bar=pan&&pan.querySelector('.sright .sbar');
 if(bar&&!pan.querySelector('.sf-odds')){const d=document.createElement('div');d.className='sf-odds '+k;d.innerHTML=`⚔ Combates en el próximo tramo: <b>${t}</b> <em>(${Math.round(w*100)} %)</em>${pr?` · 🛡 heridas −${pr} %`:''}`;bar.after(d)}}catch(e){}return r};
const oE=window.expMenu;window.expMenu=function(){const r=oE.apply(this,arguments);try{const pan=document.getElementById('pan');if(!pan)return r;
 pan.querySelectorAll('.pg.sm [onclick*="soloGo("]').forEach(c=>{const m=(c.getAttribute('onclick')||'').match(/soloGo\((\d+)\)/);if(!m||c.querySelector('.sf-tag'))return;const p=byId(+m[1]);if(!p)return;
  const w=soloWin(p,0),w20=soloWin(p,20),[k]=lab((w+w20)/2),e=document.createElement('small');e.className='sf-tag '+k;e.textContent=k==='ok'?'⚔ Fuerte':k==='mid'?'⚔ Normal':'⚔ Débil';e.title='Combates: '+Math.round(w*100)+' % al empezar, '+Math.round(w20*100)+' % en el tramo 20';c.appendChild(e)})}catch(e){}return r};
const st=document.createElement('style');st.textContent=`
.sf-odds{margin:6px 0;padding:5px 9px;border-radius:8px;font-size:12px;border:1px solid}.sf-odds em{font-style:normal;opacity:.75}
.sf-odds.ok{border-color:#4f9a4f;background:#142614;color:#bfeabf}.sf-odds.mid{border-color:#b8962a;background:#2a230c;color:#ffe08a}.sf-odds.bad{border-color:#c0442e;background:#2e110c;color:#ffc2b0}
.sf-tag{display:block;margin-top:2px;font-weight:800;font-size:10.5px}.sf-tag.ok{color:#8fe08f}.sf-tag.mid{color:#ffd877}.sf-tag.bad{color:#ff9a8a}`;document.head.appendChild(st);
})();
