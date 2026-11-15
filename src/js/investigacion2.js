/* ===== Dead Town · investigación avanzada (niveles de ayuntamiento 12-18) ===== */
(function(){
const T=[
['cons3','Construcción','Gestión de obra',12,{},'Construir y mejorar cuesta un 8% menos'],
['cons4','Construcción','Industrialización',18,{},'Construir y mejorar cuesta otro 8% menos'],
['def3','Defensa','Muros de aleación',12,{},'Muros y puertas +25% de vida'],
['def4','Defensa','Blindaje compuesto',18,{},'Muros y puertas +20% de vida adicional'],
['arms3','Armamento','Munición perforante',13,{},'Torretas y defensas +20% de daño'],
['arms4','Armamento','Armas de energía',19,{},'Torretas y defensas +20% de daño adicional'],
['expl3','Exploración','Reconocimiento por dron',13,{},'Botín de expediciones +20%'],
['expl4','Exploración','Red satelital',19,{},'Botín de expediciones +20% adicional'],
['med3','Medicina','Terapia celular',12,{},'Salud máxima de los supervivientes +10%'],
['med4','Medicina','Regeneración',18,{},'Salud máxima de los supervivientes +10% adicional']];
T.forEach(t=>{if(!TECH.some(q=>q[0]===t[0]))TECH.push(t)});
const P=window.TECH_PRE;if(P){Object.assign(P,{mat6:['mat5'],mat7:['mat6'],cons3:['cons2'],cons4:['cons3'],def3:['def2'],def4:['def3'],arms3:['arms2'],arms4:['arms3'],expl3:['expl2'],expl4:['expl3'],med3:['med2'],med4:['med3']})}
if(window.rpFix)window.rpFix();
})();
