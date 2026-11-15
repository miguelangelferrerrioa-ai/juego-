#!/usr/bin/env python3
"""Junta src/ en un solo index.html (raíz del repo) listo para publicar y sube la versión de la caché del sw.js.
Uso: python3 tools/build.py"""
import re,os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));d=os.path.join(R,'src')+'/'
s=open(d+'index.html',encoding='utf-8').read()
s=s.replace('<link rel="stylesheet" href="css/style.css">','<style>'+open(d+'css/style.css',encoding='utf-8').read()+'</style>')
s=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+open(d+m.group(1),encoding='utf-8').read()+'</script>',s)
s=re.sub(r'<link rel="manifest"[^>]*>','',s)
HEAD='\n<link rel="manifest" href="./manifest.webmanifest">\n<link rel="icon" href="./icon-192.png">\n<link rel="apple-touch-icon" href="./icon-180.png">\n<meta name="theme-color" content="#07090b">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="After the Silence">'
s=s.replace('<title>After the Silence</title>','<title>After the Silence</title>'+HEAD,1)
s=s.replace('Error al registrar Dead Town','Error al registrar After the Silence')
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(s)
sw=os.path.join(R,'sw.js');t=open(sw,encoding='utf-8').read()
t=re.sub(r"ats-v(\d+)",lambda m:'ats-v%d'%(int(m.group(1))+1),t,count=1)
open(sw,'w',encoding='utf-8').write(t)
print('index.html generado;',re.search(r"ats-v\d+",t).group(0))
