/* Pantalla de carga corta: espera a que la pantalla tenga su tamaño real, recentra la cámara y precalienta el dibujo */
(function(){
'use strict';
let box=null,busy=false;
function mk(){if(box)return box;box=document.createElement('div');box.id='ldg';box.innerHTML='<div class="ld-in"><h2>AFTER THE SILENCE</h2><div class="ld-t" id="ld_t"></div><div class="ld-bar"><i id="ld_b"></i></div></div>';document.body.appendChild(box);return box}
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),frame=()=>new Promise(r=>requestAnimationFrame(()=>r()));
const prog=(p,t)=>{const b=document.getElementById('ld_b'),x=document.getElementById('ld_t');if(b)b.style.width=Math.round(p*100)+'%';if(x&&t)x.textContent=t};
async function stable(max){ // el tamaño de la ventana debe repetirse varias veces seguidas
  const t0=performance.now();let last='',n=0;
  while(performance.now()-t0<max){const k=vw()+'x'+vh();if(k===last){if(++n>=3)return true}else{n=0;last=k}await sleep(60)}
  return false}
window.loadingRun=async function(msg,done){
  if(busy)return;busy=true;const t0=performance.now();mk();box.style.display='flex';box.style.opacity=1;prog(.05,msg);
  try{
    await frame();prog(.25);
    if(document.fonts&&document.fonts.ready)await Promise.race([document.fonts.ready,sleep(700)]);
    prog(.5,'Ajustando la pantalla…');
    await stable(1200);prog(.7);
    // cámara y dibujo a su tamaño real
    cam.z=Math.max(.5,Math.min(1,vw()/900));const h=S.bld.find(b=>b.type=='hall')||{x:26,y:26};centerOn(h.x+2,h.y+2);
    try{window.outerWarm&&outerWarm()}catch(e){console.error('borde',e)}
    window.HS='';
    for(let i=0;i<3;i++){try{render();hud()}catch(e){console.error('carga',e)}await frame()}
    prog(.95,'Listo');
  }catch(e){console.error(e)}
  const w=500-(performance.now()-t0);if(w>0)await sleep(w);
  try{done&&done()}catch(e){console.error(e)}
  prog(1);box.style.opacity=0;await sleep(260);box.style.display='none';busy=false};
// si cambia la orientación o el tamaño, repinta con el tamaño nuevo
let rt=0;const refit=()=>{clearTimeout(rt);rt=setTimeout(async()=>{await stable(800);try{const old=cam.z;cam.z=Math.max(.5,Math.min(1,vw()/900))>old?cam.z:cam.z;render();window.HS='';hud()}catch(e){}},200)};
addEventListener('resize',refit);addEventListener('orientationchange',refit);
if(window.visualViewport)visualViewport.addEventListener('resize',refit);
})();
