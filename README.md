# Caregiver clickable prototype

Open `Prototype.dc.html` from a web server (not file://), since the pages load each other by fetch.

Local: `npx serve .` or `python3 -m http.server 8000`, then open http://localhost:8000/Prototype.dc.html

Deploy: upload this folder as-is to any static host (Netlify, Vercel, GitHub Pages, S3). The entry point is Prototype.dc.html.

Files:
- Prototype.dc.html: entry, both widths, switcher, frame index
- prototype-rules.js: surfaces, situations, click rules
- <Page>.dc.html and <Page> desktop.dc.html: the twenty accepted pages (each also opens on its own as a canvas)
- support.js: runtime

Deep links: #phone/<surface>/<ID>, #desktop/<surface>/<ID>, #index. Surfaces: today, compose, device, chapters, photos, profile, settings, auth, admin, public.
Fonts load from Google Fonts; offline they fall back to Georgia and Helvetica.
