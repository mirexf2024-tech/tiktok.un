self.addEventListener('install',e=>e.waitUntil(caches.open('v1').then(c=>c.addAll(['/','/style.css','/app.js']))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method==='GET'&&u.origin===location.origin&&!u.pathname.startsWith('/api/'))e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
