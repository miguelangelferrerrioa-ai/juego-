/* Partidas de antes del registro de enemigos vistos (S.zseen): al cargarlas, se dan por vistos los enemigos que ya han tenido que salir según lo avanzado (hordas, capítulos, jefes y bandas). Así la guía y el bestiario no los tapan con «???». */
(function(){
'use strict';
const COMPL={v:[2,4],q:[3,6],t:[3,9],g:[4,11],a:[5,13],h:[5,15],u:[6,17],j:[7,19]};   /* hordas: [nº de horda, capítulo] */
const MIXL={v:2,q:3,t:4,g:5,a:6,h:7,u:8,j:9};                                     /* misiones: nivel */
function infer(){const zs=S.zseen=S.zseen||{},hn=S.hordeN||0,st=S.story||0,ml=Math.max(0,st-1),add=k=>{if(typeof ZT!=='undefined'&&ZT[k])zs[k]=1};
 add('z');add('b');
 if(hn>=1||ml>=1)add('r');if(hn>=2||ml>=2)add('f');if(hn>=3||ml>=3)add('s');
 if(ml>=5)add('m');if(ml>=10)add('e');
 for(const k in COMPL){const [n,pg]=COMPL[k];if((hn>=n&&st>=pg)||ml>=MIXL[k]+2)add(k)}
 if(window.BOSSMAP)for(const c in BOSSMAP)if(+c<st)add(BOSSMAP[c]);
 if(S.bn&&S.bn.n>0){add('k');add('p')}}
setInterval(()=>{try{if(typeof S==='undefined'||!S||!S.bld||!S.bld.length||S.zsInf)return;if((S.day||1)>3)infer();S.zsInf=1}catch(e){}},2000);
window.zseenInfer=infer;
})();
