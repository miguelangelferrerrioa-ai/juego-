/* Ambientes sonoros por acto (síntesis, sin archivos): I Silencio · II Aurora · III Consejo · IV Amanecer */
(function(){
'use strict';
const NAMES=['','Acto I · Silencio','Acto II · Aurora','Acto III · El Consejo','Acto IV · Amanecer'];
const actOf=()=>{const s=S.story||0;return s<6?1:s<14?2:s<22?3:4};
let bus=null,cur=null,curAct=0,noiseBuf=null,first=true;
const rnd=(a,b)=>a+Math.random()*(b-a);
function nb(ac){if(noiseBuf)return noiseBuf;const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return noiseBuf=b}
function L(ac){ // capa: lista de nodos + timers
  const o={nodes:[],timers:[],on:true,g:ac.createGain()};o.g.gain.value=0;o.g.connect(bus);
  o.add=n=>{o.nodes.push(n);return n};
  o.every=(fn,a,b)=>{const go=()=>{if(!o.on)return;try{fn()}catch(e){}o.timers.push(setTimeout(go,rnd(a,b)*1000))};o.timers.push(setTimeout(go,rnd(a,b)*1000))};
  o.osc=(type,f,g,dest)=>{const x=o.add(ac.createOscillator()),v=o.add(ac.createGain());x.type=type;x.frequency.value=f;v.gain.value=g;x.connect(v);v.connect(dest||o.g);x.start();return[x,v]};
  o.noise=(type,f,q,g)=>{const s=o.add(ac.createBufferSource()),fl=o.add(ac.createBiquadFilter()),v=o.add(ac.createGain());s.buffer=nb(ac);s.loop=true;fl.type=type;fl.frequency.value=f;fl.Q.value=q;v.gain.value=g;s.connect(fl);fl.connect(v);v.connect(o.g);s.start();return[s,fl,v]};
  o.lfo=(param,rate,depth)=>{const l=o.add(ac.createOscillator()),d=o.add(ac.createGain());l.frequency.value=rate;d.gain.value=depth;l.connect(d);d.connect(param);l.start()};
  o.blip=(type,f0,f1,dur,g)=>{const t=ac.currentTime,x=ac.createOscillator(),v=ac.createGain();x.type=type;x.frequency.setValueAtTime(f0,t);x.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(g,t+Math.min(.05,dur/3));v.gain.exponentialRampToValueAtTime(.0001,t+dur);x.connect(v);v.connect(o.g);x.start(t);x.stop(t+dur+.05)};
  o.burst=(f,dur,g)=>{const t=ac.currentTime,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),v=ac.createGain();s.buffer=nb(ac);fl.type='highpass';fl.frequency.value=f;v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(v);v.connect(o.g);s.start(t,Math.random(),dur+.05)};
  o.kill=()=>{o.on=false;o.timers.forEach(clearTimeout);const t=ac.currentTime;try{o.g.gain.cancelScheduledValues(t);o.g.gain.setTargetAtTime(0,t,.8)}catch(e){}setTimeout(()=>{o.nodes.forEach(n=>{try{n.stop&&n.stop()}catch(e){}try{n.disconnect()}catch(e){}});try{o.g.disconnect()}catch(e){}},4500)};
  return o}
const BUILD={
 1(ac){const o=L(ac),[,f]=o.noise('bandpass',900,9,.05);o.lfo(f.frequency,.07,350);
  o.every(()=>{const b=rnd(380,560);o.blip('sine',b,b*.72,.28,.05);setTimeout(()=>o.blip('sine',b*.95,b*.66,.3,.04),420)},12,28);o.g.gain.setTargetAtTime(1,ac.currentTime,2);return o},
 2(ac){const o=L(ac),lp=o.add(ac.createBiquadFilter());lp.type='lowpass';lp.frequency.value=190;lp.connect(o.g);
  o.osc('sawtooth',55,.05,lp);o.osc('sawtooth',55.8,.05,lp);
  o.every(()=>o.burst(2800,rnd(.12,.4),.05),2.5,7);o.every(()=>o.blip('square',1000,1000,.09,.025),11,26);o.g.gain.setTargetAtTime(1,ac.currentTime,2);return o},
 3(ac){const o=L(ac),[,v1]=o.osc('sine',41,.1),[,v2]=o.osc('sine',58,.06);o.lfo(v1.gain,.12,.05);o.lfo(v2.gain,.09,.04);
  o.every(()=>{const f=rnd(660,1100);o.blip('sine',f,f*.99,2.4,.035);o.blip('sine',f*1.5,f*1.49,1.8,.015)},7,15);o.g.gain.setTargetAtTime(1,ac.currentTime,2);return o},
 4(ac){const o=L(ac);o.osc('triangle',110,.018);o.osc('triangle',164.8,.014);
  const beat=()=>{if(!o.on)return;o.blip('sine',70,38,.28,.11);setTimeout(()=>o.blip('sine',64,36,.3,.08),230);o.timers.push(setTimeout(beat,(typeof horde!=='undefined'&&horde?.62:1.15)*1000))};beat();o.g.gain.setTargetAtTime(1,ac.currentTime,2);return o}
};
function stinger(ac,a){const t=ac.currentTime,n=[[196,247,294],[165,220,262],[147,185,220],[220,277,330]][a-1];n.forEach((f,i)=>{const x=ac.createOscillator(),v=ac.createGain();x.type='triangle';x.frequency.value=f;v.gain.setValueAtTime(.0001,t+i*.35);v.gain.linearRampToValueAtTime(.12,t+i*.35+.5);v.gain.exponentialRampToValueAtTime(.0001,t+i*.35+3.2);x.connect(v);v.connect(bus);x.start(t+i*.35);x.stop(t+i*.35+3.3)})}
function tick(){
  try{
    if(window.NEWMUS){if(cur){cur.kill();cur=null;curAct=0}return}if(typeof S==='undefined'||!S||!S.bld||!S.bld.length||typeof AC==='undefined'||!AC||typeof MUSIC==='undefined')return;
    const ac=AC;
    if(!bus){bus=ac.createGain();bus.gain.value=0;bus.connect(ac.destination)}
    const want=(MUSIC&&SND&&!S.over)?actOf():0,vol=(typeof musicVol==='number'?musicVol:.34)*.9;
    bus.gain.setTargetAtTime(window.NEWMUS?0:vol,ac.currentTime,.5);
    if(want!==curAct){
      if(cur){cur.kill();cur=null}
      curAct=want;window._actSound=want;
      if(want){cur=BUILD[want](ac);if(!first){stinger(ac,want);toast('🎧 '+NAMES[want])}first=false}
    }
  }catch(e){}
}
setInterval(tick,1000);
})();
