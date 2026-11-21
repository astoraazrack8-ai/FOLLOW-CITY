FOLLOW CITY - Prototype 0.1
================================
This is a playable browser prototype for the FOLLOW CITY concept.

Run:
- Best: serve this folder from a local web server (for example `python -m http.server 8000`) and open http://localhost:8000
- Internet is required because Three.js modules are loaded from jsDelivr CDN.
- On Android use Chrome; open in landscape orientation.
- For a future Android APK, package this web app with Capacitor or a Trusted Web Activity after testing.

Features in this prototype:
- Free 3D orbit camera, zoom and pan (OrbitControls)
- Landscape-first responsive UI
- GLB asset catalog from the user's uploaded ZIP collections
- Building placement, basic road drawing, bulldozer removal
- Simulated followers/comments/likes and population growth
- Basic local save for city stats (building positions are currently saved as coordinates only; model restoration is a next implementation step)

Important:
- This is an early prototype, not a finished commercial game.
- Android support depends on WebGL2/browser/GPU; no single app can guarantee every Android device/version.
- Some uploaded asset packs contain interior props and decorative assets; only selected exterior models are listed.
- No mosque model was included in the supplied collections; a dedicated mosque asset should be added later.
- The provided SimCity APK is not modified or bundled. It is used only as a visual reference.
- Check each asset pack's LICENSE.txt before public/commercial distribution.
