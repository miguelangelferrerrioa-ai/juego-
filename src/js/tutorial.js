/* Primeros pasos: objetivos guiados que se marcan solos */
(function(){
'use strict';
const ST=[
 ['Abre «Construir» y levanta un Aserradero: da madera.',()=>cnt('saw')>=1,{wood:40}],
 ['Construye un Pozo: sin agua la gente enferma.',()=>cnt('well')>=1,{wood:30}],
 ['Construye una Granja para tener comida.',()=>cnt('farm')>=1,{wood:30}],
 ['Toca un edificio y asigna trabajadores (botón de puestos).',()=>S.ppl.some(p=>p.job&&!p.arm),{food:30}],
 ['Construye una Casa: más camas, más supervivientes.',()=>cnt('house')>=2,{wood:40,metal:10}],
 ['Defiéndete: levanta muros (arrastra el dedo), una torreta o una torre.',()=>['wall','barr','turret','tower','gate'].some(t=>cnt(t)>=1),{metal:30,ammo:15}],
 ['Aguanta la primera horda (día 5). Los soldados salen solos a luchar.',()=>S.stat&&S.stat.hordes>=1,{metal:40,ammo:20}],
 ['Mejora el Ayuntamiento a nivel 2 (toca el edificio → Mejorar).',()=>hallLv()>=2,{wood:60,metal:40}],
 ['Sube el Ayuntamiento a nivel 4 para desbloquear la investigación y estudia una tecnología.',()=>Object.keys(S.tech).length>=1,{wood:50,metal:30}],
 ['Con el Ayuntamiento en nivel 4, construye la Estación de radio.',()=>cnt('radio')>=1,{metal:60,comp:4}],
];
let box,open=false,lastKey='';
const $=i=>document.getElementById(i);
function mk(){
  box=document.createElement('div');box.id='tut';document.body.appendChild(box);
  box.addEventListener('click',e=>{
    const t=e.target.closest('[data-a]');if(!t)return;
    if(t.dataset.a=='off'){S.tut.off=1;draw()}
    else{open=!open;draw()}
  });
}
function reward(r){const o=[];if(window.noFW)r=noFW(r);for(const k in r){S.res[k]=Math.min(cap(),(S.res[k]||0)+r[k]);o.push('+'+r[k]+' '+(k=='wood'?'madera':k=='metal'?'metal':k=='food'?'comida':k=='ammo'?'munición':k=='comp'?'componentes':k))}return o.join(', ')}
function draw(){
  if(!box)mk();
  const t=S.tut;
  if(!t||t.off||t.i>=ST.length||S.over){box.style.display='none';return}
  const title=document.querySelector('#title,#menu');
  box.style.display='block';
  const cur=ST[t.i];
  let h=`<div class="tut-h" data-a="t"><b>Primeros pasos ${t.i}/${ST.length}</b><span>${open?'▲':'▼'}</span></div><div class="tut-c" data-a="t">${cur[0]}</div>`;
  if(open)h+='<div class="tut-l">'+ST.map((s,i)=>`<div class="${i<t.i?'ok':i==t.i?'cur':''}">${i<t.i?'✓':i==t.i?'▸':'·'} ${s[0]}</div>`).join('')+'<button data-a="off">Ocultar guía</button></div>';
  if(h!==lastKey){box.innerHTML=h;lastKey=h}
}
function step(){
  try{
    if(typeof S==='undefined'||!S||!S.bld||!S.bld.length||!document.getElementById('top')||!document.getElementById('top').innerHTML){if(box)box.style.display='none';return}
    if(!S.tut)S.tut={i:0,off:S.day>12?1:0};
    const t=S.tut;
    let guard=0;
    while(!t.off&&t.i<ST.length&&ST[t.i][1]()&&guard++<12){const g=reward(ST[t.i][2]);toast('✅ '+ST[t.i][0].split(':')[0].split('.')[0]+' · '+g);t.i++}
    draw();
  }catch(e){}
}
setInterval(step,1000);
})();
