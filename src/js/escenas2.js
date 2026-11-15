/* Escenas por capítulo, actos, portada y tutoriales */
(function(){
const N='night',D='dusk',A='dawn',G='gloom',R='red',T='toxic',O='gold',H='hope',Y='day';
// [cielo, monumentos, primer plano, clima]
const T48=[
[N,['ruins','tower'],['surv'],['fog']],[D,['convoy'],['surv'],['ash']],[G,['hospital'],['surv','zomb'],['rain']],[T,['lab'],['surv'],['spores']],[G,['military'],['surv','zomb'],['fog']],[R,['lab','ruins'],['surv'],['ash']],
[N,['tower'],['surv'],['fog','flash']],[N,['observatory'],['surv'],['fog']],[D,['police'],['surv','zomb'],['rain']],[G,['wall'],['surv'],['ash']],[N,['camp','ruins'],['surv'],['ash']],[N,['metro'],['surv'],['fog']],
[G,['archive'],['surv'],['ash']],[D,['house'],['surv'],['rain']],[N,['skyscraper'],['surv'],['fog']],[N,['basement'],['surv'],['fog']],[R,['ruins'],['surv','zomb'],['ash']],[D,['city'],['surv'],['birds']],
[T,['lab','ruins'],['surv','zomb'],['spores']],[N,['tower'],['surv'],['rain','flash']],[R,['wall'],['surv'],['ash']],[G,['port'],['surv'],['fog']],[D,['convoy'],['surv','zomb'],['ash']],[G,['dam'],['surv'],['rain']],
[N,['archive','council'],['surv'],['fog']],[N,['train'],['surv'],['rain']],[R,['council'],['surv','zomb'],['ash']],[H,['city'],['surv','surv2'],['birds']],
[A,['city'],['surv'],['birds']],[G,['ruins','camp'],['surv'],['ash']],[N,['pods'],['surv'],['fog']],[T,['lab'],['surv'],['spores']],[G,['station'],['surv'],['fog']],[D,['convoy'],['surv','zomb'],['ash']],
[R,['banners'],['surv'],['ash']],[R,['barracks'],['surv','zomb'],['ash']],[N,['eyes'],['surv'],['fog']],[N,['studio'],['surv'],['fog']],[G,['church'],['surv'],['fog']],[N,['abbey'],['surv'],['fog']],
[T,['sluice'],['surv'],['spores']],[T,['sluice'],['surv','zomb'],['spores']],[G,['port'],['surv'],['rain']],[D,['fleet'],['surv'],['fog']],[O,['island'],['surv'],['ash']],[G,['mine'],['surv','zomb'],['fog']],
[N,['dome'],['surv'],['fog']],[O,['chair'],['surv'],[]]];
const SEED=i=>i*7+3;
SCN.chapter=i=>{const t=T48[i];if(!t)return null;return{sky:t[0],lm:t[1],fg:t[2],wx:t[3],seed:SEED(i)}};
SCN.reg('title',{sky:'dusk',lm:['city','tower'],fg:['surv'],wx:['ash','birds'],seed:5,tint:'rgba(20,10,0,.12)'});
SCN.reg('act1',{sky:'night',lm:['ruins','tower'],fg:['surv'],wx:['fog'],seed:2});
SCN.reg('act2',{sky:'dusk',lm:['city','tower'],fg:['surv'],wx:['ash'],seed:4});
SCN.reg('act3',{sky:'red',lm:['council'],fg:['surv','zomb'],wx:['ash'],seed:6});
SCN.reg('act4',{sky:'hope',lm:['city'],fg:['surv','surv2'],wx:['birds'],seed:8});
SCN.reg('act5',{sky:'gold',lm:['chair'],fg:['surv'],wx:[],seed:9});
SCN.reg('nar',{sky:'night',lm:['camp','ruins'],fg:['surv'],wx:['fog'],seed:12});
const TUTS=[['night',['camp']],['dawn',['city']],['dusk',['hospital']],['gloom',['military']],['night',['tower']],['dusk',['house']],['gloom',['archive']],['night',['lab']]];
SCN.tut=id=>{let h=0;for(const ch of String(id))h=(h*31+ch.charCodeAt(0))>>>0;const q=TUTS[h%TUTS.length];return{sky:q[0],lm:q[1],fg:['surv'],wx:['ash'],seed:h%50}};
const o=SCN.spec;SCN.spec=id=>{const m=String(id).match(/^tut:(.+)$/);return m?SCN.tut(m[1]):o(id)};
/* portada: sustituye el arte CSS por la escena animada */
function cover(){const e=document.querySelector('.coverart');if(!e||e._sc)return;e._sc=1;e.style.background='none';e.style.border='0';e.innerHTML=SCN.tag('title','');const c=e.firstChild;c.style.cssText='position:absolute;inset:0;width:100%;height:100%;margin:0;border-radius:inherit;object-fit:cover;object-position:50% 85%;box-shadow:none;aspect-ratio:auto';e.classList.add('cvn');SCN.mount(c)}
const st=document.createElement('style');st.textContent='.coverart.cvn:before,.coverart.cvn:after{display:none!important}';document.head.appendChild(st);
document.addEventListener('DOMContentLoaded',cover);if(document.readyState!=='loading')cover();
/* tarjeta de capítulo: escena sobre el texto */
const info=window.worldMapMenu;
window.chScene=i=>SCN.tag('ch:'+i,(STORY[i]&&STORY[i].n||'').replace(/^Cap\.\s*\d+\s*·\s*/,''));
})();
