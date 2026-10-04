/* Vice Bay Radio : le shell est mis en cache pour l'ouverture instantanée ; jamais les audios (lecture en continu, requêtes Range). */
const V='vbr-20261004a', SHELL=['./','index.html','radio.css','receiver.css','radio.js','data.js','manifest.webmanifest','img/icon-192.png','img/icon-512.png','img/vicebay_radio.webp'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||r.headers.has('range')||/\.(m4a|mp3|ogg|oga|opus|flac)$/i.test(u.pathname)||u.origin!==location.origin) return;
  /* réseau d'abord (contenu toujours frais), cache en secours hors ligne */
  e.respondWith(fetch(r).then(res=>{ if(res.ok&&(r.mode==='navigate'||SHELL.some(p=>u.pathname.endsWith(p.replace('./',''))||u.pathname==='/'))){ const c=res.clone(); caches.open(V).then(x=>x.put(r,c)); } return res; }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
