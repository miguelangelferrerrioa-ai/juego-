#!/usr/bin/env python3
"""Prueba rápida: abre el juego, empieza partida y dibuja todos los edificios en todos los niveles.
Debe imprimir algo como [2440, [], 0] []  (sin errores). Necesita: pip install playwright && playwright install chromium"""
import os
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':930,'height':415})
    pe=[];pg.on('pageerror',lambda e:pe.append(str(e)))
    pg.goto('file://'+os.path.join(R,'index.html'))
    pg.click('text=Nueva partida');pg.locator('.slot button').first.click();pg.wait_for_timeout(300)
    pg.click('text=NORMAL');pg.wait_for_timeout(2500)
    for t in('text=Entendido','text=Cerrar'):
        try: pg.click(t,timeout=1200)
        except: pass
    r=pg.evaluate("""()=>{let n=0,er=[];const cv=document.createElement('canvas');cv.width=cv.height=600;const c=cv.getContext('2d');
    for(const k of Object.keys(BT)){if(!NB[k])continue;for(let l=1;l<=10;l++)for(let r=0;r<4;r++){try{const b={type:k,x:5,y:5,w:BT[k].w,h:BT[k].h,lvl:l,rot:r,hp:BT[k].hp,id:1};c.clearRect(0,0,600,600);nbDraw&&nbDraw(c,b,300,300,0);n++}catch(e){er.push(k+l+r+':'+e.message)}}}
    return [n,er.slice(0,8),er.length]}""")
    print(r,pe);b.close()
