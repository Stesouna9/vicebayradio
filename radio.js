(function(){
'use strict';
const D=window.VBR, S=D.stations, ADS=D.ads;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- LANGUES ---------- */
const T={
fr:{nav_stations:'Stations',nav_ads:'Pubs',nav_city:'La ville',nav_links:'Liens',cta_game_short:'Le jeu',
hero_kicker:'Vice Bay · 1986 · FM stéréo',hero_title:'Cinq stations.<br/><em>Toute la nuit.</em>',
hero_lead:"Les radios d'une ville qui n'existe pas. Des animateurs qui parlent trop, des jingles, et les pubs de tous les commerces du front de mer. Tourne le bouton.",
cta_listen:'▶ Allumer la radio',cta_ads:'📺 Les fausses pubs',pick:'Choisis une station',pick_hint:"ou glisse l'aiguille sur le cadran",
off:'RADIO COUPÉE',onair:"À L'ANTENNE",pause:'EN PAUSE',soon_badge:'BIENTÔT',soon_prog:'Nouvelle programmation · bientôt à l\'antenne',jingle:'🎙 Jingle Vice Bay',
st_label:'Le cadran',st_title:'Cinq animateurs, <em>cinq nuits différentes</em>',st_sub:'Chaque station a sa couleur, son quartier, son animateur et ses annonceurs. Musique 100 % libre, voix originales écrites pour Vice Bay.',
st_listen:'▶ ÉCOUTER',st_playing:'❚❚ EN COURS',st_tracks:'titres au programme',st_host:'Animé par',
ads_label:'Pages de pub',ads_title:"Les 25 commerces <em>qui paient l'antenne</em>",
ads_sub:"Garages des marais, fleuristes de nuit, motels d'autoroute : chaque commerce de Vice Bay a sa pub, lue par l'animateur de sa station. Aucun n'existe. Tous sont ouverts tard.",
all:'Tout',ad_on:'Sur',ad_note:"Texte de l'antenne, version originale. La pub audio arrive bientôt, avec la voix de l'animateur.",ad_listen:'▶ Écouter la station',ad_share:'🔗 Copier le lien',ad_copied:'✓ Lien copié',
city_label:'La ville',city_title:'Bienvenue à <em>Vice Bay</em>',city_sub:"Une ville côtière de 1986, entre l'océan et les marais. Cinq quartiers, cinq couleurs, et une radio allumée dans chaque voiture.",
links_label:'Vice Bay Radio, partout',links_title:'Le jeu, la communauté, <em>le studio</em>',
lk_game:'Le casse-briques néon de Vice Bay. 500 silhouettes, les cinq radios en fond. iPhone et Android.',lk_game_date:'Sortie le 19 novembre 2026',
lk_discord_t:'Le Discord',lk_discord:'Bugs, suggestions, bêta iOS/Android, coulisses de Vice Bay Radio. La radio y arrive bientôt en salon vocal.',lk_discord_cta:'Rejoindre le Discord →',
lk_studio:"Le studio indépendant derrière Vice Bay. Jeux, apps, et d'autres projets qui passeront par cette radio.",
lk_projects_t:'Les autres projets',lk_projects:"Kotoba, VoteDay et ce qui arrive ensuite. Chaque projet du studio aura bientôt sa pub à l'antenne.",lk_projects_cta:'Voir les projets →',
lk_insta:"Artworks, enseignes et extraits d'antenne.",lk_contact_t:'Presse & partenariats',lk_contact:'Un commerce, une marque ou un projet qui veut passer sur Vice Bay Radio ? Écrivez-nous.',lk_contact_cta:'Nous contacter →',
soon_t:"Bientôt à l'antenne",soon_1:'Les pubs en audio, avec les voix des animateurs',soon_2:'Le bot Vice Bay Radio dans le Discord, une station par salon',soon_3:"L'appli gratuite Vice Bay Radio",
credits:'Musique : Kevin MacLeod (incompetech.com), CC BY 4.0 ; titres additionnels sous CC BY 2.5 / 3.0 via ccMixter et OpenGameArt. Voix et textes originaux, écrits pour Vice Bay.',
fiction:'Vice Bay est une ville imaginaire. Ses stations, ses animateurs et ses commerces sont fictifs ; toute ressemblance avec une entreprise réelle serait une coïncidence.',
privacy:'Confidentialité',days:'J-',release_today:"C'est aujourd'hui.",released:'Disponible maintenant',shops:'annonceurs',
weather:['27 °C · humide','24 °C · pluie fine','29 °C · ciel rose','22 °C · brume sur les marais','26 °C · vent de mer']},
en:{nav_stations:'Stations',nav_ads:'Ads',nav_city:'The city',nav_links:'Links',cta_game_short:'The game',
hero_kicker:'Vice Bay · 1986 · FM stereo',hero_title:'Five stations.<br/><em>All night long.</em>',
hero_lead:"The radio of a city that doesn't exist. Hosts who talk too much, jingles, and ads for every business on the waterfront. Turn the dial.",
cta_listen:'▶ Turn the radio on',cta_ads:'📺 The fake ads',pick:'Pick a station',pick_hint:'or drag the needle along the dial',
off:'RADIO OFF',onair:'ON AIR',pause:'PAUSED',soon_badge:'SOON',soon_prog:'New programming · on air soon',jingle:'🎙 Vice Bay jingle',
st_label:'The dial',st_title:'Five hosts, <em>five different nights</em>',st_sub:'Every station has its own colour, neighbourhood, host and advertisers. 100 % free music, original voices written for Vice Bay.',
st_listen:'▶ LISTEN',st_playing:'❚❚ PLAYING',st_tracks:'tracks in rotation',st_host:'Hosted by',
ads_label:'Commercial break',ads_title:'The 25 businesses <em>paying for airtime</em>',
ads_sub:'Swamp garages, late-night florists, highway motels: every business in Vice Bay has its ad, read by the host of its station. None of them exist. All of them are open late.',
all:'All',ad_on:'On',ad_note:'On-air script, original French broadcast. The audio ad is coming soon, voiced by the host.',ad_listen:'▶ Listen to the station',ad_share:'🔗 Copy link',ad_copied:'✓ Link copied',
city_label:'The city',city_title:'Welcome to <em>Vice Bay</em>',city_sub:'A 1986 coastal city between the ocean and the swamps. Five neighbourhoods, five colours, and a radio on in every car.',
links_label:'Vice Bay Radio, everywhere',links_title:'The game, the community, <em>the studio</em>',
lk_game:'The neon brick-breaker set in Vice Bay. 500 silhouettes, the five stations playing in the background. iPhone and Android.',lk_game_date:'Out November 19, 2026',
lk_discord_t:'Discord',lk_discord:'Bugs, suggestions, iOS/Android beta, behind the scenes of Vice Bay Radio. The radio is coming to a voice channel soon.',lk_discord_cta:'Join the Discord →',
lk_studio:'The independent studio behind Vice Bay. Games, apps, and more projects that will come through this radio.',
lk_projects_t:'Other projects',lk_projects:"Kotoba, VoteDay and what comes next. Every studio project will soon get its own ad on air.",lk_projects_cta:'See the projects →',
lk_insta:'Artworks, neon signs and on-air clips.',lk_contact_t:'Press & partnerships',lk_contact:'A business, a brand or a project that wants to be on Vice Bay Radio? Write to us.',lk_contact_cta:'Contact us →',
soon_t:'Coming on air',soon_1:'Audio ads, voiced by the hosts',soon_2:'The Vice Bay Radio bot on Discord, one station per channel',soon_3:'The free Vice Bay Radio app',
credits:'Music: Kevin MacLeod (incompetech.com), CC BY 4.0; additional tracks under CC BY 2.5 / 3.0 via ccMixter and OpenGameArt. Original voices and scripts, written for Vice Bay.',
fiction:'Vice Bay is an imaginary city. Its stations, hosts and businesses are fictional; any resemblance to a real company is a coincidence.',
privacy:'Privacy',days:'D-',release_today:"It's today.",released:'Out now',shops:'advertisers',
weather:['81 °F · humid','75 °F · light rain','84 °F · pink sky','72 °F · mist over the swamp','79 °F · sea breeze']}};
let lang='fr';
try{ lang=localStorage.getItem('vbr_lang')||((navigator.language||'fr').toLowerCase().startsWith('fr')?'fr':'en'); }catch(e){}
const tr=k=>(T[lang]&&T[lang][k]!==undefined)?T[lang][k]:T.fr[k];

const Q={
  beach:{fr:'Plage',en:'Beach',c:'#1FB7A6'},
  downtown:{fr:'Centre-ville',en:'Downtown',c:'#E5B84B'},
  highway:{fr:'Autoroute',en:'Highway',c:'#FFA630'},
  everglades:{fr:'Marais',en:'Everglades',c:'#3E7C4F'},
  skyline:{fr:'Skyline',en:'Skyline',c:'#FF2E88'}};
const CITY=[
  {img:'art_beach',qs:['beach'],fr:['La plage','Le Coconut Palace face à l'océan, le soleil qui tombe, les décapotables blanches garées sous les palmiers. Tropicana à fond.'],en:['The beach','The Coconut Palace on the ocean, the sun going down, white convertibles parked under the palms. Tropicana blasting.']},
  {img:'art_downtown',qs:['downtown','skyline'],fr:['Centre-ville & Skyline','Le Laser Lounge, les Silver Cab sur le bitume mouillé, les tours sous la lune. EMOTION à trois heures du matin, NEON dans les salles d\'arcade.'],en:['Downtown & Skyline','The Laser Lounge, Silver Cabs on wet asphalt, towers under the moon. EMOTION at 3 a.m., NEON in the arcades.']},
  {img:'art_highway',qs:['highway','everglades'],fr:['Autoroute & Marais','Le Last Stop Motel au bord des marais, les hérons, les breaks en bois garés devant le diner. Sunset Drive au volant, VOLT dans les clubs des Everglades.'],en:['Highway & Everglades','The Last Stop Motel by the swamp, herons, wood-panel wagons parked outside the diner. Sunset Drive behind the wheel, VOLT in the Everglades clubs.']}];

function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=tr(el.dataset.i18n);});
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=tr(el.dataset.i18nHtml);});
  $('lang').textContent=lang==='fr'?'EN':'FR';
  renderStations(); renderFilters(); renderAds(); renderCity(); countdown(); clock(); ui();
}
$('lang').addEventListener('click',()=>{ lang=lang==='fr'?'en':'fr'; try{localStorage.setItem('vbr_lang',lang);}catch(e){} applyLang(); });

/* ---------- RADIO ---------- */
const LOW=87.5, HIGH=108;
const audio=new Audio(); audio.preload='none';
let cur=null, idx=0, fade=null, volume=60;
const offsets={};
const x=f=>((f-LOW)/(HIGH-LOW)*100)+'%';
const st=()=>S.find(s=>s.id===cur);
const needle=$('needle'), scale=$('scale'), marks=$('marks'), chips=$('chips'), dial=$('dial'), dock=$('dock');

S.forEach(s=>{
  const d=document.createElement('div'); d.style.left=x(s.f); d.style.setProperty('--c',s.c); d.dataset.id=s.id; d.innerHTML='<i></i><span>'+s.f.toFixed(1)+'</span>'; marks.appendChild(d);
  const b=document.createElement('button'); b.type='button'; b.dataset.id=s.id; b.style.setProperty('--c',s.c); b.innerHTML='<i></i>'+esc(s.name); b.addEventListener('click',()=>tune(s.id)); chips.appendChild(b);
});

/* grésillement entre deux stations */
let actx=null;
function hiss(){
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const len=actx.sampleRate*.35, buf=actx.createBuffer(1,len,actx.sampleRate), ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*(1-i/len);
    const src=actx.createBufferSource(), g=actx.createGain(), bp=actx.createBiquadFilter();
    bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=.6; g.gain.value=.12*(volume/100);
    src.buffer=buf; src.connect(bp).connect(g).connect(actx.destination); src.start();
  }catch(e){}
}

function load(id,i){ cur=id; const L=st().live;
  if(!L.length){ idx=0; audio.pause(); audio.removeAttribute('src'); return; }
  idx=((i%L.length)+L.length)%L.length; audio.src=L[idx].src; }
function playSoft(){ const s=st(); if(!s||!s.live.length){ ui(); return; }
  clearInterval(fade); const target=volume/100; audio.volume=0; audio.play().catch(()=>{});
  let k=0; fade=setInterval(()=>{ k++; audio.volume=Math.min(target,target*k/15); if(k>=15) clearInterval(fade); },90); }
function tune(id){
  if(cur===id){ if(audio.paused) playSoft(); ui(); return; }
  if(cur) offsets[cur]={i:idx,t:audio.currentTime};
  hiss();
  const s=S.find(v=>v.id===id), o=offsets[id];
  load(id,o?o.i:Math.floor(Math.random()*Math.max(1,s.live.length)));
  if(o) audio.currentTime=o.t;
  playSoft(); ui();
}
function ui(){
  const s=st(), on=!!(s&&!audio.paused), acc=s?s.c:'#F5E3C3';
  dial.style.setProperty('--acc',acc); dock.style.setProperty('--acc',acc); dial.classList.toggle('on',on);
  $('d-freq').textContent=s?s.f.toFixed(1):'—';
  $('d-name').textContent=s?s.name:tr('pick');
  $('d-genre').textContent=s?(lang==='fr'?s.genre:s.genre_en)+' · '+(lang==='fr'?s.slogan:s.slogan_en):tr('pick_hint');
  const it=s&&s.live.length?s.live[idx]:null;
  const title=it?(it.type==='link'?tr('jingle'):it.title+' · '+it.artist):(s?tr('soon_prog'):tr('pick'));
  $('d-onair').textContent=s&&!s.live.length?tr('soon_badge'):(on?tr('onair'):(s?tr('pause'):tr('off')));
  $('dock-name').textContent=s?'📻 '+s.name+' · '+s.f.toFixed(1)+' FM':'📻 VICE BAY RADIO';
  $('dock-title').textContent=title;
  $('dock-play').textContent=on?'❚❚':'▶';
  needle.style.left=x(s?s.f:LOW);
  scale.setAttribute('aria-valuenow',s?s.f:LOW);
  marks.querySelectorAll('div').forEach(d=>d.classList.toggle('on',d.dataset.id===cur));
  chips.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.id===cur));
  document.querySelectorAll('.st').forEach(c=>{ const p=on&&c.dataset.id===cur; c.classList.toggle('playing',p); const b=c.querySelector('.st-play'); if(b) b.textContent=p?tr('st_playing'):tr('st_listen'); });
  document.title=(on?'▶ '+s.name+' '+s.f.toFixed(1)+' · ':'')+'Vice Bay Radio · 5 stations FM, Vice Bay 1986';
}
function nearest(clientX){ const r=scale.getBoundingClientRect(); const f=LOW+Math.min(1,Math.max(0,(clientX-r.left)/r.width))*(HIGH-LOW); return S.reduce((a,b)=>Math.abs(b.f-f)<Math.abs(a.f-f)?b:a); }
let drag=false;
const follow=e=>{ const r=scale.getBoundingClientRect(); needle.style.left=Math.min(100,Math.max(0,(e.clientX-r.left)/r.width*100))+'%'; };
scale.addEventListener('pointerdown',e=>{ drag=true; scale.setPointerCapture(e.pointerId); needle.style.transition='none'; follow(e); });
scale.addEventListener('pointermove',e=>{ if(drag) follow(e); });
scale.addEventListener('pointerup',e=>{ if(!drag) return; drag=false; needle.style.transition=''; tune(nearest(e.clientX).id); });
scale.addEventListener('keydown',e=>{ const i=S.findIndex(s=>s.id===cur);
  if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); tune(S[Math.min(S.length-1,i+1)].id); }
  if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); tune(S[Math.max(0,i<0?0:i-1)].id); }
  if(e.key===' '||e.key==='Enter'){ e.preventDefault(); togglePlay(); } });
function togglePlay(){ if(!cur) tune('tropicana'); else if(audio.paused) playSoft(); else audio.pause(); ui(); }
$('dock-play').addEventListener('click',togglePlay);
$('dock-skip').addEventListener('click',()=>{ if(cur&&st().live.length){ load(cur,idx+1); playSoft(); ui(); } });
$('dock-vol').addEventListener('input',e=>{ volume=+e.target.value; clearInterval(fade); audio.volume=volume/100; });
audio.addEventListener('ended',()=>{ if(!st().live.length) return; load(cur,idx+1); audio.play().catch(()=>{}); ui(); });
audio.addEventListener('timeupdate',()=>{ $('dock-prog').style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+'%'; });
audio.addEventListener('play',ui); audio.addEventListener('pause',ui);
document.addEventListener('click',e=>{ const b=e.target.closest('[data-tune]'); if(b){ e.preventDefault(); tune(b.dataset.tune); } });

/* ---------- STATIONS ---------- */
function renderStations(){
  $('st-grid').innerHTML=S.map(s=>{
    const n=Math.max(s.catalog.length,s.live.filter(t=>t.type==='track').length);
    return '<article class="st" data-id="'+s.id+'" style="--c:'+s.c+'">'+
      '<img src="'+s.logo+'" alt="'+esc(s.name)+' '+s.f+' FM" loading="lazy" width="360" height="360"/>'+
      '<div class="st-body"><span class="st-f">'+s.f.toFixed(1)+' FM · '+esc(lang==='fr'?s.genre:s.genre_en)+'</span>'+
      '<h3>'+esc(s.name)+'</h3><p class="st-slogan">« '+esc(lang==='fr'?s.slogan:s.slogan_en)+' »</p>'+
      '<p class="st-host">'+tr('st_host')+' <b>'+esc(s.host)+'</b>. '+esc(lang==='fr'?s.bio:s.bio_en)+'</p>'+
      (s.jingles[0]?'<p class="st-jingle">'+esc(s.jingles[0])+'</p>':'')+
      '<div class="st-foot"><button class="st-play" type="button" data-tune="'+s.id+'">'+tr('st_listen')+'</button>'+
      '<span class="st-count">'+n+' '+tr('st_tracks')+'</span></div></div></article>';
  }).join('');
}

/* ---------- PUBS ---------- */
let filter='all';
function renderFilters(){
  const f=[['all',tr('all'),'']].concat(Object.keys(Q).map(k=>['q:'+k,Q[k][lang],Q[k].c]),[['sep']],S.map(s=>['s:'+s.id,s.name,s.c]));
  $('filters').innerHTML=f.map(([k,l,c])=>k==='sep'?'<span class="sep"></span>':'<button type="button" data-f="'+k+'"'+(c?' style="--c:'+c+'"':'')+(filter===k?' class="on"':'')+' aria-pressed="'+(filter===k)+'">'+(c?'<i></i>':'')+esc(l)+'</button>').join('');
}
$('filters').addEventListener('click',e=>{ const b=e.target.closest('button[data-f]'); if(!b) return; filter=b.dataset.f; renderFilters(); renderAds(); });
function renderAds(){
  $('ad-grid').innerHTML=ADS.map(a=>{
    const s=S.find(v=>v.id===a.station), q=Q[a.q];
    const show=filter==='all'||filter==='q:'+a.q||filter==='s:'+a.station;
    return '<button class="ad" type="button" data-ad="'+a.id+'" style="--q:'+q.c+';--c:'+s.c+'"'+(show?'':' hidden')+'>'+
      '<img src="'+a.logo+'" alt="" loading="lazy" width="420" height="420"/>'+
      '<b>'+esc(a.shop)+'</b><small><i></i>'+esc(s.name)+' '+s.f.toFixed(1)+' · '+esc(q[lang])+'</small></button>';
  }).join('');
}
$('ad-grid').addEventListener('click',e=>{ const b=e.target.closest('[data-ad]'); if(b) openAd(b.dataset.ad); });

function script(t){
  return t.split('\n').map(l=>{
    const h=esc(l).replace(/\(([^)]*)\)/g,'<span class="dir">($1)</span>');
    return h||'&nbsp;';
  }).join('<br/>');
}
const modal=$('modal');
function openAd(id){
  const a=ADS.find(v=>v.id===id); if(!a) return;
  const s=S.find(v=>v.id===a.station), q=Q[a.q];
  modal.style.setProperty('--q',q.c);
  $('modal-body').innerHTML='<div class="m-head"><img src="'+a.logo+'" alt="'+esc(a.shop)+'"/><div><h3>'+esc(a.shop)+'</h3>'+
    '<div class="m-tags"><span style="--t:'+s.c+'">'+tr('ad_on')+' '+esc(s.name)+' '+s.f.toFixed(1)+'</span><span style="--t:'+q.c+'">'+esc(q[lang])+'</span><span style="--t:#F5E3C3">'+esc(s.host)+'</span></div></div></div>'+
    '<div class="m-script">'+script(a.text)+'</div><p class="m-note">'+tr('ad_note')+'</p>'+
    '<div class="m-actions"><button class="btn btn-sm" type="button" data-tune="'+s.id+'">'+tr('ad_listen')+'</button>'+
    '<button class="btn btn-sm btn-ghost" type="button" id="m-share">'+tr('ad_share')+'</button></div>';
  $('m-share').addEventListener('click',()=>{ const u=location.href.split('#')[0]+'#pub-'+a.id;
    (navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>{ $('m-share').textContent=tr('ad_copied'); }).catch(()=>{ prompt('',u); }); });
  if(!modal.open) modal.showModal();
  try{ history.replaceState(null,'','#pub-'+a.id); }catch(e){}
}
modal.addEventListener('close',()=>{ if(location.hash.startsWith('#pub-')){ try{ history.replaceState(null,'','#pubs'); }catch(e){} } });
modal.addEventListener('click',e=>{ if(e.target===modal) modal.close(); });

/* ---------- VILLE ---------- */
function renderCity(){
  $('city').innerHTML=CITY.map(c=>{
    const shops=ADS.filter(a=>c.qs.includes(a.q)), qc=Q[c.qs[0]].c;
    return '<article class="q" style="--qc:'+qc+'"><span class="q-bar"></span>'+
      '<img src="img/'+c.img+'_s.jpg" srcset="img/'+c.img+'_s.jpg 800w, img/'+c.img+'.jpg 1600w" sizes="(max-width:980px) 100vw, 33vw" alt="'+esc(c[lang][0])+'" loading="lazy"/>'+
      '<div class="q-in"><h3>'+esc(c[lang][0])+'</h3><p>'+esc(c[lang][1])+'</p>'+
      '<div class="q-shops">'+shops.map(a=>'<button type="button" data-ad="'+a.id+'" style="--qc:'+Q[a.q].c+'">'+esc(a.shop)+'</button>').join('')+'</div></div></article>';
  }).join('');
}
$('city').addEventListener('click',e=>{ const b=e.target.closest('[data-ad]'); if(b) openAd(b.dataset.ad); });

/* ---------- HORLOGE, MÉTÉO, COMPTE À REBOURS ---------- */
function clock(){
  const d=new Date(), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
  const w=tr('weather'); $('clock').textContent='VICE BAY · '+hh+':'+mm+' · '+w[Math.floor(d.getTime()/1800000)%w.length];
}
setInterval(clock,20000);
function countdown(){
  const el=$('countdown'); if(!el) return;
  const days=Math.ceil((new Date(2026,10,19)-new Date())/86400000);
  el.textContent=days>0?tr('lk_game_date')+' · '+tr('days')+days:(days===0?tr('release_today'):tr('released'));
}

applyLang();
const fromHash=()=>{ if(location.hash.startsWith('#pub-')) openAd(location.hash.slice(5)); };
window.addEventListener('hashchange',fromHash); fromHash();
})();
