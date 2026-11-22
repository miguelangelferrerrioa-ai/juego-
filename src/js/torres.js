/* Torres de vigilancia: los tiradores asignados están DENTRO de la torre.
   - No se dibujan ni merodean: se quedan en la torre (p.tw=1) y salen al lado si se les quita el puesto o cae la torre.
   - Están protegidos: los zombis y bandas no los eligen como objetivo y no reciben daño de combate ni mueren por ataques mientras la torre siga en pie (el hambre y la vejez siguen igual).
   - Encima de cada torre, una placa con figuras: amarillas por cada tirador dentro, grises por cada plaza libre (p. ej. 1/2).
   - Ya no se puede pasar del cupo (antes había torres con 3 tiradores en 2 plazas): al cargar, los que sobran quedan sin puesto. */
(function(){
'use strict';
const isTw=b=>!!(b&&BT[b.type]&&BT[b.type].gun);
function inTw(p){if(!p||p.away||!p.job)return false;const b=bm[p.job];return isTw(b)&&!b.cons}
window.inTower=inTw;
const ctr=b=>[b.x+b.w/2,b.y+b.h/2];
/* cupo: los que sobran (más antiguos primero se quedan) pierden el puesto */
function trim(){try{S.bld.forEach(b=>{if(!isTw(b))return;const ws=S.ppl.filter(p=>p.job===b.id&&!p.away),n=slots(b);ws.slice(n).forEach(p=>{p.job=0;p.tw=0})})}catch(e){}}
let lastS=null;
const oU=window.upd;
window.upd=function(dt){
 if(S!==lastS){lastS=S;trim()}
 const HP=new Map(),war=Z.some(z=>z.act&&z.hp>0);
 /* con un arma cuerpo a cuerpo no se puede estar de tirador: sale de la torre */for(const p of S.ppl)if(inTw(p)&&p.wp&&window.isMelee&&isMelee(p.wp)){try{toast(p.n+' lleva '+p.wp.n+' (cuerpo a cuerpo) y no puede disparar desde la torre: deja el puesto.')}catch(e){}p.job=0}
 for(const p of S.ppl){const t=inTw(p);if(t){if(!p.tw){p.tw=1}if(war)HP.set(p,p.hp)}else if(p.tw){/* sale de la torre: aparece junto a ella */p.tw=0;const x=p.twx,y=p.twy;if(isFinite(x)){p.x=p.tx=x;p.y=p.ty=y+1.2;p.path=null}}}
 const r=oU.apply(this,arguments);
 for(const [p,h] of HP)if(inTw(p)&&p.hp<h)p.hp=h;/* protegido del combate: si un ataque le ha quitado vida estando dentro, se le devuelve (el hambre y la vejez siguen igual) */
 for(const p of S.ppl){if(!p.tw||!inTw(p))continue;
  const b=bm[p.job],c=ctr(b);p.twx=c[0];p.twy=b.y+b.h;p.x=p.tx=c[0];p.y=p.ty=c[1];p.mv=0;p.path=null;p.pk=null;p.fg=0}
 return r};
try{upd=window.upd}catch(e){}
/* nadie muere dentro de una torre en pie */
const oD=window.die;
if(typeof oD==='function'){window.die=function(p,w){if(p&&inTw(p)&&/zombi|explosi|combate|banda|atac|aplast/i.test(w||'')){p.hp=Math.max(1,p.hp);return}return oD.apply(this,arguments)};try{die=window.die}catch(e){}}
/* placa sobre la torre */
function badge(c,b){const n=S.ppl.filter(p=>p.job===b.id&&!p.away).length,cap=slots(b)||2;/* solo en las torres a las que les falta gente (pedido del dueño: demasiadas placas en pantalla) */if(n>=cap)return;const k=Math.min(cap,4),q=P(b.x+b.w/2,b.y+b.h/2),y=q[1]-BT[b.type].z-26,w=k*15+34,x=q[0]-w/2;
 c.fillStyle='rgba(18,24,14,.88)';c.strokeStyle=n?'#e0b44a':'#7a7a6a';c.lineWidth=1.6;c.beginPath();if(c.roundRect)c.roundRect(x,y-11,w,22,11);else c.rect(x,y-11,w,22);c.fill();c.stroke();
 for(let i=0;i<k;i++){const cx=x+12+i*15;c.fillStyle=i<n?'#ffd877':'rgba(255,255,255,.18)';c.beginPath();c.arc(cx,y-4,3.4,0,7);c.fill();c.beginPath();c.moveTo(cx-5.5,y+7);c.quadraticCurveTo(cx,y-3,cx+5.5,y+7);c.fill()}
 c.fillStyle=n?'#ffe9a8':'#bbb';c.font='800 11px system-ui';c.textAlign='left';c.textBaseline='middle';c.fillText(n+'/'+cap,x+12+k*15-4,y+1);
 c.fillStyle='rgba(18,24,14,.88)';c.beginPath();c.moveTo(q[0]-5,y+11);c.lineTo(q[0]+5,y+11);c.lineTo(q[0],y+17);c.fill()}
const oR=window.render;
window.render=function(){const r=oR.apply(this,arguments);try{const cv=document.getElementById('c'),c=cv.getContext('2d');c.save();c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  for(const b of S.bld){if(!isTw(b)||b.cons||!vis(b.x+b.w/2,b.y+b.h/2,200))continue;badge(c,b)}c.restore()}catch(e){}return r};
try{render=window.render}catch(e){}
})();
