/* ===== Banda sonora apocalíptica: tambores de guerra en los ataques, bocinas, sirenas y ambiente de mundo muerto (todo sintetizado) ===== */
(function(){
'use strict';
const R=(a,b)=>a+Math.random()*(b-a);
let nbuf=null,bus=null,sfxBus=null,war=null;
const AC_=()=>{try{if(typeof AC==='undefined'||!AC)return null;return AC}catch(e){return null}};
const ok=()=>{try{return !!SND&&typeof S!=='undefined'&&S&&S.bld&&S.bld.length&&!S.over}catch(e){return false}};
const mvol=()=>{try{return (typeof musicVol==='number'?musicVol:.34)*(MUSIC?1:0)}catch(e){return .3}};
const svol=()=>{try{return typeof sfxVol==='number'?sfxVol:.68}catch(e){return .6}};
function noise(ac){if(nbuf)return nbuf;const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return nbuf=b}
function buses(ac){if(bus)return;bus=ac.createGain();bus.gain.value=1;const cp=ac.createDynamicsCompressor();cp.threshold.value=-18;cp.ratio.value=6;bus.connect(cp);cp.connect(ac.destination);sfxBus=bus}
/* --- primitivas --- */
function tone(ac,{type='sine',f0,f1,t=0,dur=.3,g=.2,lp=0,att=.005,dest}){const t0=ac.currentTime+t,o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1)o.frequency.exponentialRampToValueAtTime(Math.max(18,f1),t0+dur);v.gain.setValueAtTime(.0001,t0);v.gain.linearRampToValueAtTime(g,t0+att);v.gain.exponentialRampToValueAtTime(.0001,t0+dur);let n=o;if(lp){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f}n.connect(v);v.connect(dest||bus);o.start(t0);o.stop(t0+dur+.05)}
function nz(ac,{t=0,dur=.3,g=.2,type='lowpass',f=800,f1,q=1,att=.003,dest}){const t0=ac.currentTime+t,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),v=ac.createGain();s.buffer=noise(ac);s.loop=true;fl.type=type;fl.frequency.setValueAtTime(f,t0);if(f1)fl.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t0+dur);fl.Q.value=q;v.gain.setValueAtTime(.0001,t0);v.gain.linearRampToValueAtTime(g,t0+att);v.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(fl);fl.connect(v);v.connect(dest||bus);s.start(t0,Math.random());s.stop(t0+dur+.05)}
const kick=(ac,t,g)=>{tone(ac,{f0:120,f1:38,t,dur:.42,g:g*.9,type:'sine',att:.003});nz(ac,{t,dur:.12,g:g*.35,f:900,f1:200})};
const taiko=(ac,t,g)=>{tone(ac,{f0:150,f1:55,t,dur:.7,g:g,type:'triangle',lp:600,att:.004});tone(ac,{f0:75,f1:42,t,dur:.9,g:g*.7,type:'sine'});nz(ac,{t,dur:.25,g:g*.4,f:1400,f1:250})};
const clang=(ac,t,g)=>{[520,870,1340,1910].forEach((f,i)=>tone(ac,{f0:f*R(.99,1.01),t,dur:.5-i*.08,g:g/(1+i*.7),type:'sine',att:.002}))};
const snare=(ac,t,g)=>{nz(ac,{t,dur:.18,g:g,type:'bandpass',f:1800,f1:900,q:.8});tone(ac,{f0:210,f1:120,t,dur:.12,g:g*.4,type:'triangle'})};
/* --- sirena / bocina de ataque --- */
function siren(ac,band){buses(ac);const g=svol()*.5;
 for(let i=0;i<2;i++){tone(ac,{type:'sawtooth',f0:260,f1:410,t:i*1.5,dur:1.4,g:g*.32,lp:900,att:.35});tone(ac,{type:'sawtooth',f0:262,f1:415,t:i*1.5,dur:1.4,g:g*.2,lp:700,att:.4})}
 [0,.6,1.2].forEach((t,i)=>taiko(ac,t+.2,g*(.7+i*.15)));
 if(band){[0,.5].forEach(t=>tone(ac,{type:'sawtooth',f0:98,t:t+.1,dur:1.8,g:g*.38,lp:380,att:.5}));tone(ac,{type:'sawtooth',f0:147,t:.3,dur:1.6,g:g*.25,lp:420,att:.5})}}
/* --- aviso de asalto (víspera) --- */
function warn(ac){try{if(playG('radio'))return}catch(e){}buses(ac);const g=svol()*.45;[0,.9].forEach(t=>{tone(ac,{type:'sawtooth',f0:87,t,dur:1.1,g:g*.4,lp:320,att:.35});tone(ac,{type:'sawtooth',f0:130,t:t+.05,dur:1.1,g:g*.25,lp:360,att:.4})});taiko(ac,1.8,g*.7)}
/* --- remate --- */
function winS(ac){try{if(playG('win'))return}catch(e){}buses(ac);const g=svol()*.45;[[196,0],[233,.45],[294,.9]].forEach(([f,t])=>tone(ac,{type:'triangle',f0:f,t,dur:2.2-t*.4,g:g*.3,lp:1400,att:.25}));taiko(ac,.0,g*.5)}
function loseS(ac){try{if(playG('lose'))return}catch(e){}buses(ac);const g=svol()*.5;[[147,0],[139,.5],[110,1.1]].forEach(([f,t])=>tone(ac,{type:'sawtooth',f0:f,t,dur:2.4,g:g*.3,lp:420,att:.4}));nz(ac,{t:0,dur:2.5,g:g*.2,f:300,f1:60})}
function rumble(ac){buses(ac);const g=svol();nz(ac,{dur:1.6,g:g*.5,f:260,f1:50,att:.05});tone(ac,{f0:60,f1:30,dur:1.5,g:g*.5,type:'sine',att:.02});nz(ac,{t:.1,dur:.6,g:g*.18,f:1200,f1:300,type:'bandpass',q:.7})}
/* --- tambores de guerra durante el ataque --- */
function warStart(ac,band,noDrums){if(war)return;buses(ac);war={band,nd:!!noDrums,step:0,next:ac.currentTime+.1,beat:0,drone:null};
 const dg=ac.createGain();dg.gain.value=0;dg.connect(bus);const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=240;f.connect(dg);
 const a=ac.createOscillator(),b=ac.createOscillator(),c=ac.createOscillator(),l=ac.createOscillator(),lg=ac.createGain();a.type=b.type=c.type='sawtooth';a.frequency.value=49;b.frequency.value=49.6;c.frequency.value=73.4;l.frequency.value=.11;lg.gain.value=70;l.connect(lg);lg.connect(f.frequency);[a,b,c].forEach(o=>o.connect(f));[a,b,c,l].forEach(o=>o.start());
 war.drone={dg,f,nodes:[a,b,c,l]};dg.gain.setTargetAtTime(.07,ac.currentTime,2)}
function warStop(ac){try{window.warMusic&&warMusic.stop(ac)}catch(e){}if(!war)return;const w=war;war=null;try{w.drone.dg.gain.setTargetAtTime(0,ac.currentTime,.8)}catch(e){}setTimeout(()=>{w.drone.nodes.forEach(n=>{try{n.stop()}catch(e){}try{n.disconnect()}catch(e){}});try{w.drone.dg.disconnect()}catch(e){}},4000)}
function inten(){try{if(!horde)return 0;const act=(Z||[]).filter(z=>z.act).length,ini=Math.max(6,horde.initial||act||6);return Math.max(.25,Math.min(1,.35+act/ini*.65))}catch(e){return .5}}
function warTick(ac){if(!war)return;const k=inten(),bpm=78+k*34,bt=60/bpm/2,g=svol()*(.32+k*.3)*(mvol()>0?Math.min(1,.5+mvol()):.4);
 while(war.next<ac.currentTime+.25){const t=war.next-ac.currentTime,s=war.step%16;
  if(war.nd){war.step++;war.next+=bt;continue}
  if(s===0||s===8)taiko(ac,t,g);else if(s===6||s===14){kick(ac,t,g*.8)}else if(s===4||s===12)snare(ac,t,g*.6*k);
  if(k>.6&&(s%4===2))kick(ac,t,g*.45);
  if(war.band&&(s===3||s===11)){clang(ac,t,g*.22)}
  if(s===15&&k>.7){taiko(ac,t+bt*.5,g*.5);}
  if(war.step%64===60&&k>.5)nz(ac,{t,dur:bt*6,g:g*.45,type:'bandpass',f:300,f1:2600,q:2.5,att:bt*5});
  war.step++;war.next+=bt}
 try{war.drone.dg.gain.setTargetAtTime(.04+k*.07,ac.currentTime,1)}catch(e){}}
/* --- ambiente de mundo muerto --- */
function gust(ac){buses(ac);const g=mvol()*.5+.03;nz(ac,{dur:R(3.5,6),g:g*.55,type:'bandpass',f:R(250,500),f1:R(700,1300),q:1.2,att:2})}
function moan(ac,near){buses(ac);const g=(mvol()*.5+.03)*(near?.9:.5),f=R(70,115),d=R(1.6,2.8),t0=ac.currentTime,o=ac.createOscillator(),fl=ac.createBiquadFilter(),v=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f*1.2,t0);o.frequency.linearRampToValueAtTime(f*.78,t0+d);fl.type='bandpass';fl.frequency.value=R(380,620);fl.Q.value=4;l.frequency.value=R(4,7);lg.gain.value=f*.05;l.connect(lg);lg.connect(o.frequency);v.gain.setValueAtTime(.0001,t0);v.gain.linearRampToValueAtTime(g*.5,t0+d*.35);v.gain.linearRampToValueAtTime(.0001,t0+d);o.connect(fl);fl.connect(v);v.connect(bus);o.start(t0);l.start(t0);o.stop(t0+d+.1);l.stop(t0+d+.1)}
function creak(ac){buses(ac);const g=mvol()*.45+.02,d=R(.7,1.4);tone(ac,{type:'square',f0:R(160,240),f1:R(110,320),dur:d,g:g*.25,lp:520,att:.2});nz(ac,{dur:d,g:g*.2,type:'bandpass',f:900,f1:500,q:6,att:.2})}
function farShot(ac){buses(ac);const g=mvol()*.5+.03;nz(ac,{dur:.5,g:g*.7,f:1100,f1:300,att:.002});nz(ac,{t:.35,dur:.9,g:g*.25,f:600,f1:200,att:.1})}
function crow(ac){buses(ac);const g=mvol()*.45+.03;for(let i=0;i<R(2,4);i++)tone(ac,{type:'sawtooth',f0:R(520,700),f1:R(330,420),t:i*.3,dur:.22,g:g*.2,lp:1600,att:.01})}
function thunder(ac){buses(ac);const g=mvol()*.6+.04;nz(ac,{dur:3.5,g:g*.6,f:240,f1:45,att:.3});nz(ac,{t:.5,dur:2.4,g:g*.3,f:500,f1:70,att:.4})}
let amb={n:0,last:0};
function ambient(ac){const now=performance.now();if(now<amb.last)return;let hz=false,exp=false,night=false,rain=false;try{hz=!!horde;exp=!!(S.exp||S.solo)||(window._qmShown&&_qmShown());night=(S.dayT/600)>=.62;rain=[1,3].includes((S.adv&&S.adv.weather)||0)}catch(e){}
 if(hz||window.VILLA&&0)return;amb.last=now+R(9000,24000)*(exp?.65:1);
 const r=Math.random();
 if(rain&&r<.25)thunder(ac);else if(r<.28)gust(ac);else if(r<.52)moan(ac,exp);else if(r<.62)creak(ac);else if(r<.76&&night)farShot(ac);else if(r<.86&&!night)crow(ac);else moan(ac,exp)}
/* --- bucle --- */
setInterval(()=>{try{const ac=AC_();if(ac&&war&&!(typeof horde!=='undefined'&&horde))warStop(ac);if(!ac||!ok())return;if(ac.state==='suspended')return;buses(ac);warTick(ac);if(!(window.VILLA))ambient(ac)}catch(e){}},70);
/* --- enlaces --- */
function wrap(n,fn){const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{fn.apply(this,arguments)}catch(e){}return r}}
wrap('startHorde',function(name,over){if(!ok())return;const ac=AC_()||audioContext();if(ac.state==='suspended')try{ac.resume()}catch(e){}const band=!!(typeof horde!=='undefined'&&horde&&horde.band);try{if(!playG('alarm'))siren(ac,band)}catch(e){siren(ac,band)}let wm=false;try{wm=band&&window.warMusic&&warMusic.play(ac)}catch(e){}warStart(ac,band,wm)});
(function(){const o=window.endHorde;if(typeof o!=='function')return;window.endHorde=function(){const ac=AC_();let lost=false;try{lost=!!(horde&&horde.lostB>horde.lostU+3)}catch(e){}const r=o.apply(this,arguments);try{if(ac&&ok()){warStop(ac);setTimeout(()=>{lost?loseS(ac):winS(ac)},900)}}catch(e){}return r}})();
wrap('killB',function(){const ac=AC_();if(ac&&ok()&&horde)rumble(ac)});
wrap('gameOver',function(){const ac=AC_();if(ac){warStop(ac);loseS(ac)}});
/* aviso de la víspera de un asalto de bandas */
(function(){const o=window.toast;if(typeof o!=='function')return;window.toast=function(t){try{if(typeof t==='string'&&/vigías avisan|asaltará el pueblo/i.test(t)){const ac=AC_();if(ac&&ok()){warn(ac)}}}catch(e){}return o.apply(this,arguments)}})();
window.darkAudio={siren:()=>{const ac=AC_()||audioContext();siren(ac,1)},warn:()=>{const ac=AC_()||audioContext();warn(ac)},amb:{gust,moan,creak,farShot,crow,thunder}};
})();
