# After the Silence — instrucciones para Claude

Juego de navegador (supervivencia y construcción de un pueblo en vista isométrica) para jugar entre amigos, no es público.
Se juega sobre todo en un **Android en horizontal (2424×1080, devicePixelRatio ≈ 2.6)** con Firefox o Chrome.

## Cómo está organizado
- `src/` → **código fuente**. Aquí se hacen los cambios.
  - `src/index.html` carga `css/style.css` y unos 90 scripts de `js/` **en orden** (el orden importa: muchos archivos envuelven funciones de los anteriores, p. ej. `window.fig`, `window.render`).
  - `src/js/game.js` es el núcleo (estado global `S`, `BT` edificios, `render()`, `frame()`, `fig()` para dibujar personas…).
  - `src/audio/soundbank.js` sonidos y música.
- `index.html` (raíz) → **el juego ya montado en un solo archivo**. Es lo que publica Vercel. No se edita a mano: se genera.
- `sw.js`, `manifest.webmanifest`, `icon-*.png`, `_headers` → para que se pueda instalar como aplicación y jugar sin conexión.
- `tools/build.py` → junta `src/` en `index.html` y sube la versión de caché de `sw.js` (para que los móviles cojan la versión nueva).
- `tools/scan.py` → prueba rápida: dibuja todos los edificios en todos los niveles; debe imprimir `[2440, [], 0] []`.
- `partidas/` → partidas guardadas para probar (`partida_larga_dia248.json`: la de día 248 sin tutoriales pendientes, lista para importar en el móvil; `prueba_asalto_final.json`: día 248, pueblo grande, listo para el asalto final; `dia3.json`: partida temprana).
- `HISTORIAL.md` → notas de todo lo que se ha cambiado en sesiones anteriores (leer antes de tocar algo grande).

## Después de cada cambio
1. Editar en `src/`.
2. `python3 tools/build.py`
3. `python3 tools/scan.py` (si hay Playwright) → sin errores.
4. Añadir una línea a `HISTORIAL.md` explicando el cambio.
5. Commit y push a `main` → Vercel lo publica solo.

## Preferencias del dueño del juego (importante)
- Responder **siempre en español**, corto y yendo al grano.
- Mandar **capturas de prueba** de los cambios cuando se pueda.
- Si un cambio se nota en partidas largas (rendimiento, pueblo grande, capítulos avanzados…), mandar SIEMPRE con SendUserFile un guardado largo para importar (`partidas/partida_larga_dia248.json`, o uno nuevo si hace falta), comprobado antes con Importar partida.
- No tardar horas en pruebas/simulaciones largas.
- **No proponer nunca un botón de velocidad**: no se va a hacer.
- Los ratos lentos del juego (parones) se quedan.
- Solo los ciudadanos comunes mueren de vejez.
- Los asaltos (final, Torre, sillas) NO se pueden perder, a propósito: no proponer añadir derrota.
- **Nada de spoilers**: lo bloqueado se muestra como "???" o siluetas oscuras en todas partes (guía, recursos, opciones, etc.).
- La moral ya se quitó del juego: no proponer cosas basadas en moral.
- Si dice "no hagas nada hasta que te diga", solo mandar maquetas/capturas.
- No usar desplegables nativos del navegador (`<select>`): usar los chips del juego (`window.chipSel`).
