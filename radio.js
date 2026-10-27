(function(){
'use strict';
const D=window.VBR, S=D.stations, ADS=D.ads;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- LANGUES ---------- */
const T={
fr:{mv_label:'Vice Bay, ce n\'est pas que la radio',mv_title:"Tous nos sites, <em>au même endroit</em>",mv_sub:"Vice Bay Radio est la radio de la ville. Le point de départ de tout : GTA VI France, avec nos applis.",mv_tag:'PUB',nav_mv:'Nos sites',mv_gta:'Le compte à rebours, les actus deux fois par jour, la boutique et la radio de Vice Bay en direct.',mv_gta_cta:'Voir le compte à rebours →',mv_game:'Le casse-briques néon de Vice Bay. 500 silhouettes, les six stations en fond. Sortie le 19 novembre 2026.',mv_game_cta:'Découvrir le jeu →',mv_kot:'Devine le mot caché en six essais, en français et en japonais. Gratuit sur iPhone et Android.',mv_kot_cta:'Jouer à Kotoba →',mv_vd:'Chaque jour une question A ou B. Vote, compare avec tes amis et avec le monde. Gratuit sur iPhone.',mv_vd_cta:"Voter aujourd'hui →",nav_stations:'Stations',nav_pod:'Podcast',pod_teaser:"Sakura, Big Lou, Mél et les autres racontent la baie et tous les mondes d'OKALAM Studio. Épisodes, notes et commentaires.",pod_open:'🎙 Écouter les épisodes',pod_rss:'📡 Flux RSS',cta_pod:'🎙 Le podcast',chip_pod:'🎙 Nouveau · Vice Bay Podcast',pod_latest:'▶ Écouter le dernier épisode',pod_eps:'Épisodes',pod_label:'Vice Bay Podcast',pod_title:'Le <em>Vice Bay Podcast</em>',pod_soon:"Le premier épisode arrive bientôt : Sakura et Big Lou parlent d'OKALAM Studio",pod_play:'▶ Écouter',pod_pause:'❚❚ Pause',pod_min:'min',pod_off:'Podcast indisponible pour le moment.',com_btn:"Commentaires",com_btn_n:"Commentaires (%n)",com_hide:"Masquer les commentaires",com_load:"Chargement…",com_none:"Aucun commentaire pour le moment. Sois le premier !",com_ph:"Écris un commentaire…",com_send:"Envoyer",com_sending:"Envoi…",com_pseudo_t:"Choisis ton pseudo",com_pseudo_w:"Ton pseudo est définitif : tu ne pourras plus le changer.",com_pseudo_ph:"Ton pseudo (3 à 20 caractères)",com_pseudo_ok:"Valider",com_as:"Tu commentes sous le pseudo",com_e_net:"Connexion impossible. Réessaie dans un instant.",com_e_taken:"Ce pseudo est déjà pris.",com_e_already:"Cet appareil a déjà le pseudo",com_e_pinv:"Pseudo invalide : 3 à 20 caractères, lettres, chiffres, _ - . seulement, sans lien ni mot interdit.",com_e_tinv:"Commentaire invalide : 1 à 500 caractères, sans lien ni mot interdit.",com_e_slow:"Doucement : un commentaire toutes les 20 secondes, 30 par jour.",com_e_pseudo:"Choisis d'abord un pseudo.",rate_n:"%a · %n avis",rate_1:"%a · 1 avis",rate_none:"Pas encore de note",rate_mine:"Ta note : %m sur 5",rate_aria:"Noter %n sur 5",like_aria:"J'aime",com_ago_now:"à l'instant",com_ago_m:"il y a %n min",com_ago_h:"il y a %n h",com_ago_d:"il y a %n j",nav_ads:'Pubs',nav_city:'La ville',nav_links:'Liens',cta_game_short:'Le jeu',
hero_kicker:'Vice Bay · 1986 · FM stéréo',hero_title:'Sept stations.<br/><em>Toute la nuit.</em>',
hero_lead:"Les radios d'une ville qui n'existe pas. Des animateurs qui parlent trop, des jingles, et les pubs de tous les commerces du front de mer. Tourne le bouton.",
cta_listen:'▶ Allumer la radio',cta_ads:'📺 Les fausses pubs',pick:'Choisis une station',pick_hint:"tourne le bouton ou appuie sur une touche",
off:'RADIO COUPÉE',onair:"À L'ANTENNE",pause:'EN PAUSE',soon_badge:'BIENTÔT',soon_prog:'Nouvelle programmation · bientôt à l\'antenne',jingle:'🎙 Jingle Vice Bay',
st_label:'Le cadran',st_title:'Sept stations, <em>sept nuits différentes</em>',st_sub:'Chaque station a sa couleur, son quartier, son animateur et ses annonceurs. Musique 100 % libre, voix originales écrites pour Vice Bay.',
st_listen:'▶ ÉCOUTER',st_page:'Voir la station →',st_playing:'❚❚ PAUSE',st_tracks:'titres au programme',st_host:'Animé par',
ads_label:'Pages de pub',ads_title:"Les 25 commerces <em>qui paient l'antenne</em>",
ads_sub:"Garages des marais, fleuristes de nuit, motels d'autoroute : chaque commerce de Vice Bay a sa pub, lue par l'animateur de sa station. Aucun n'existe. Tous sont ouverts tard.",
all:'Tout',ad_on:'Sur',ad_note:"Texte de l'antenne, version originale. La pub audio arrive bientôt, avec la voix de l'animateur.",ad_listen:'▶ Écouter la station',ad_share:'🔗 Copier le lien',ad_copied:'✓ Lien copié',
city_label:'La ville',city_title:'Bienvenue à <em>Vice Bay</em>',city_sub:"Une ville côtière de 1986, entre l'océan et les marais. Cinq quartiers, cinq couleurs, et une radio allumée dans chaque voiture.",
links_label:'Vice Bay Radio, partout',links_title:'Le jeu, la communauté, <em>le studio</em>',
lk_game:'Le casse-briques néon de Vice Bay. 500 silhouettes, les six radios en fond. iPhone et Android.',lk_game_date:'Sortie le 19 novembre 2026',
lk_discord_t:'Le Discord',lk_discord:'Bugs, suggestions, bêta iOS/Android, coulisses de Vice Bay Radio. La radio y arrive bientôt en salon vocal.',lk_discord_cta:'Rejoindre le Discord →',ig_btn:'Suis-nous sur Instagram @vicebayradio',lk_insta_t:'Instagram',lk_insta:'Les coulisses de la baie, les stations, les affiches. Suis @vicebayradio.',lk_insta_cta:'Suis-nous sur Instagram →',
lk_studio:"Le studio indépendant derrière Vice Bay. Jeux, apps, et d'autres projets qui passeront par cette radio.",
lk_projects_t:'Les autres projets',lk_projects:"Kotoba, VoteDay et ce qui arrive ensuite. Chaque projet du studio aura bientôt sa pub à l'antenne.",lk_projects_cta:'Voir les projets →',
lk_insta:"Artworks, enseignes et extraits d'antenne.",lk_gta:"Heure de sortie dans ton pays, faits vérifiés, actus 2 fois par jour, en 17 langues. Vice Bay Radio y joue en direct.",lk_gta_cta:"gtavifrance.com →",lk_contact_t:'Presse & partenariats',lk_contact:'Un commerce, une marque ou un projet qui veut passer sur Vice Bay Radio ? Écrivez-nous.',lk_contact_cta:'Nous contacter →',
soon_t:"Bientôt à l'antenne",soon_1:'Les pubs en audio, avec les voix des animateurs',soon_2:'Le bot Vice Bay Radio dans le Discord, une station par salon',soon_3:"L'appli gratuite Vice Bay Radio",
credits:'Musique : Kevin MacLeod (incompetech.com), CC BY 4.0 ; titres additionnels sous CC BY 2.5 / 3.0 via ccMixter et OpenGameArt. Voix et textes originaux, écrits pour Vice Bay.',
cr_label:'Crédits',cr_title:'Toute la musique, <em>créditée</em>',cr_sub:"Chaque morceau diffusé sur Vice Bay Radio (et dans le jeu VICE BREAK) est sous licence libre, créditée ici avec son auteur et sa licence. Les morceaux ont été ré-encodés en AAC pour le poids ; aucune autre modification. Les titres sous CC BY-SA gardent cette licence. Œuvres classiques : domaine public ; enregistrements par leurs interprètes, sous les licences indiquées (Musopen, Kimiko Ishizaka, Wikimedia Commons, Kevin MacLeod / incompetech.com, ccMixter, OpenGameArt).",cr_tracks:'titres',
nav_part:'Participer',pa_label:'Communauté',pa_title:"Cette radio, <em>c'est la vôtre</em>",pa_sub:"Vice Bay Radio grandit avec ceux qui l'écoutent. Proposez des morceaux, inventez des pubs, envoyez des dédicaces, votez : tout se passe sur le Discord, et les meilleures idées passent à l'antenne, avec votre nom.",pa_join:'Rejoindre le Discord Vice Bay',pa_note:"Rien ne passe à l'antenne sans validation. Vous gardez vos droits et nous autorisez la diffusion sur Vice Bay Radio. Musique libre uniquement (CC0, CC BY).",pa_1t:'Propose ton morceau',pa_1d:"Artiste indépendant ? Ton titre libre peut passer sur une station, avec ton nom à l'antenne et dans les crédits.",pa_2t:'Invente une pub',pa_2d:"Un commerce imaginaire de Vice Bay ? Écris sa pub : les meilleures sont enregistrées par un animateur.",pa_3t:'Envoie une dédicace',pa_3d:"Un message ou un titre pour quelqu'un que tu aimes, lu à l'antenne.",pa_4t:'Vote, top de la baie',pa_4d:"Vote pour tes titres préférés : le classement de la semaine passe plus souvent.",pa_5t:'Prête ta voix',pa_5d:"Tu veux animer une station ? Les voix de la radio viennent aussi de la communauté.",
fiction:'Vice Bay est une ville imaginaire. Ses stations, ses animateurs et ses commerces sont fictifs ; toute ressemblance avec une entreprise réelle serait une coïncidence.',
privacy:'Confidentialité',days:'J-',release_today:"C'est aujourd'hui.",released:'Disponible maintenant',shops:'annonceurs',
weather:['27 °C · humide','24 °C · pluie fine','29 °C · ciel rose','22 °C · brume sur les marais','26 °C · vent de mer']},
en:{mv_label:'Vice Bay is more than a radio',mv_title:"All our sites, <em>in one place</em>",mv_sub:'Vice Bay Radio is the radio of the city. The hub of it all: GTA VI France, with our apps.',mv_tag:'AD',nav_mv:'Our sites',mv_gta:'The countdown, news twice a day, the shop and the Vice Bay radio live.',mv_gta_cta:'See the countdown →',mv_game:'The neon brick-breaker set in Vice Bay. 500 silhouettes, the six stations in the background. Out November 19, 2026.',mv_game_cta:'Discover the game →',mv_kot:'Guess the hidden word in six tries, in French and Japanese. Free on iPhone and Android.',mv_kot_cta:'Play Kotoba →',mv_vd:'Every day an A or B question. Vote, compare with friends and the world. Free on iPhone.',mv_vd_cta:'Vote today →',nav_stations:'Stations',nav_pod:'Podcast',pod_teaser:"Sakura, Big Lou, Mél and the others tell the story of the bay and all the worlds of OKALAM Studio. Episodes, ratings and comments.",pod_open:'🎙 Listen to the episodes',pod_rss:'📡 RSS feed',cta_pod:'🎙 The podcast',chip_pod:'🎙 New · Vice Bay Podcast',pod_latest:'▶ Play latest episode',pod_eps:'Episodes',pod_label:'Vice Bay Podcast',pod_title:'The <em>Vice Bay Podcast</em>',pod_soon:'The first episode is coming soon: Sakura and Big Lou talk about OKALAM Studio',pod_play:'▶ Listen',pod_pause:'❚❚ Pause',pod_min:'min',pod_off:'Podcast unavailable right now.',com_btn:"Comments",com_btn_n:"Comments (%n)",com_hide:"Hide comments",com_load:"Loading…",com_none:"No comments yet. Be the first!",com_ph:"Write a comment…",com_send:"Send",com_sending:"Sending…",com_pseudo_t:"Pick your nickname",com_pseudo_w:"Your nickname is permanent: you won't be able to change it.",com_pseudo_ph:"Your nickname (3 to 20 characters)",com_pseudo_ok:"Confirm",com_as:"You comment as",com_e_net:"Can't connect. Try again in a moment.",com_e_taken:"That nickname is already taken.",com_e_already:"This device already has the nickname",com_e_pinv:"Invalid nickname: 3 to 20 characters, letters, digits, _ - . only, no link or banned word.",com_e_tinv:"Invalid comment: 1 to 500 characters, no link or banned word.",com_e_slow:"Slow down: one comment every 20 seconds, 30 per day.",com_e_pseudo:"Pick a nickname first.",rate_n:"%a · %n ratings",rate_1:"%a · 1 rating",rate_none:"No rating yet",rate_mine:"Your rating: %m out of 5",rate_aria:"Rate %n out of 5",like_aria:"Like",com_ago_now:"just now",com_ago_m:"%n min ago",com_ago_h:"%n h ago",com_ago_d:"%n d ago",nav_ads:'Ads',nav_city:'The city',nav_links:'Links',cta_game_short:'The game',
hero_kicker:'Vice Bay · 1986 · FM stereo',hero_title:'Seven stations.<br/><em>All night long.</em>',
hero_lead:"The radio of a city that doesn't exist. Hosts who talk too much, jingles, and ads for every business on the waterfront. Turn the dial.",
cta_listen:'▶ Turn the radio on',cta_ads:'📺 The fake ads',pick:'Pick a station',pick_hint:'turn the knob or press a preset',
off:'RADIO OFF',onair:'ON AIR',pause:'PAUSED',soon_badge:'SOON',soon_prog:'New programming · on air soon',jingle:'🎙 Vice Bay jingle',
st_label:'The dial',st_title:'Seven stations, <em>seven different nights</em>',st_sub:'Every station has its own colour, neighbourhood, host and advertisers. 100 % free music, original voices written for Vice Bay.',
st_listen:'▶ LISTEN',st_page:'View the station →',st_playing:'❚❚ PAUSE',st_tracks:'tracks in rotation',st_host:'Hosted by',
ads_label:'Commercial break',ads_title:'The 25 businesses <em>paying for airtime</em>',
ads_sub:'Swamp garages, late-night florists, highway motels: every business in Vice Bay has its ad, read by the host of its station. None of them exist. All of them are open late.',
all:'All',ad_on:'On',ad_note:'On-air script, original French broadcast. The audio ad is coming soon, voiced by the host.',ad_listen:'▶ Listen to the station',ad_share:'🔗 Copy link',ad_copied:'✓ Link copied',
city_label:'The city',city_title:'Welcome to <em>Vice Bay</em>',city_sub:'A 1986 coastal city between the ocean and the swamps. Five neighbourhoods, five colours, and a radio on in every car.',
links_label:'Vice Bay Radio, everywhere',links_title:'The game, the community, <em>the studio</em>',
lk_game:'The neon brick-breaker set in Vice Bay. 500 silhouettes, the six stations playing in the background. iPhone and Android.',lk_game_date:'Out November 19, 2026',
lk_discord_t:'Discord',lk_discord:'Bugs, suggestions, iOS/Android beta, behind the scenes of Vice Bay Radio. The radio is coming to a voice channel soon.',lk_discord_cta:'Join the Discord →',ig_btn:'Follow us on Instagram @vicebayradio',lk_insta_t:'Instagram',lk_insta:'Behind the scenes of the bay, the stations, the posters. Follow @vicebayradio.',lk_insta_cta:'Follow us on Instagram →',
lk_studio:'The independent studio behind Vice Bay. Games, apps, and more projects that will come through this radio.',
lk_projects_t:'Other projects',lk_projects:"Kotoba, VoteDay and what comes next. Every studio project will soon get its own ad on air.",lk_projects_cta:'See the projects →',
lk_insta:'Artworks, neon signs and on-air clips.',lk_gta:'Release time in your country, verified facts, news twice a day, 17 languages. Vice Bay Radio plays live there.',lk_gta_cta:'gtavifrance.com/en →',lk_contact_t:'Press & partnerships',lk_contact:'A business, a brand or a project that wants to be on Vice Bay Radio? Write to us.',lk_contact_cta:'Contact us →',
soon_t:'Coming on air',soon_1:'Audio ads, voiced by the hosts',soon_2:'The Vice Bay Radio bot on Discord, one station per channel',soon_3:'The free Vice Bay Radio app',
credits:'Music: Kevin MacLeod (incompetech.com), CC BY 4.0; additional tracks under CC BY 2.5 / 3.0 via ccMixter and OpenGameArt. Original voices and scripts, written for Vice Bay.',
cr_label:'Credits',cr_title:'All the music, <em>credited</em>',cr_sub:"Every track played on Vice Bay Radio (and in the VICE BREAK game) is under a free licence, credited here with its author and licence. Tracks were re-encoded to AAC for size; no other changes. Tracks under CC BY-SA keep that licence. Classical works are public domain; recordings are under their performers' licences as shown (Musopen, Kimiko Ishizaka, Wikimedia Commons, Kevin MacLeod / incompetech.com, ccMixter, OpenGameArt).",cr_tracks:'tracks',
nav_part:'Join in',pa_label:'Community',pa_title:"This radio is <em>yours</em>",pa_sub:"Vice Bay Radio grows with the people who listen. Suggest tracks, invent ads, send dedications, vote: it all happens on Discord, and the best ideas go on air with your name.",pa_join:'Join the Vice Bay Discord',pa_note:"Nothing goes on air without review. You keep your rights and let us broadcast on Vice Bay Radio. Free music only (CC0, CC BY).",pa_1t:'Suggest your track',pa_1d:"Independent artist? Your free-licensed track can play on a station, with your name on air and in the credits.",pa_2t:'Invent an ad',pa_2d:"An imaginary Vice Bay business? Write its ad: the best ones are recorded by a host.",pa_3t:'Send a dedication',pa_3d:"A message or a song for someone you love, read on air.",pa_4t:'Vote, top of the bay',pa_4d:"Vote for your favourite tracks: the weekly chart plays more often.",pa_5t:'Lend your voice',pa_5d:"Want to host a station? The radio's voices come from the community too.",
fiction:'Vice Bay is an imaginary city. Its stations, hosts and businesses are fictional; any resemblance to a real company is a coincidence.',
privacy:'Privacy',days:'D-',release_today:"It's today.",released:'Out now',shops:'advertisers',
weather:['81 °F · humid','75 °F · light rain','84 °F · pink sky','72 °F · mist over the swamp','79 °F · sea breeze']}};
let lang='fr'; let POD=null, podEl=null, podId=null;
try{ lang=localStorage.getItem('vbr_lang')||((navigator.language||'fr').toLowerCase().startsWith('fr')?'fr':'en'); }catch(e){}
const tr=k=>(T[lang]&&T[lang][k]!==undefined)?T[lang][k]:T.fr[k];

const Q={
  beach:{fr:'Plage',en:'Beach',c:'#1FB7A6'},
  downtown:{fr:'Centre-ville',en:'Downtown',c:'#E5B84B'},
  highway:{fr:'Autoroute',en:'Highway',c:'#FFA630'},
  everglades:{fr:'Marais',en:'Everglades',c:'#3E7C4F'},
  skyline:{fr:'Skyline',en:'Skyline',c:'#FF2E88'}};
const CITY=[
  {img:'art_beach',qs:['beach'],fr:['La plage','Le Coconut Palace face à l\'océan, le soleil qui tombe, les décapotables blanches garées sous les palmiers. Tropicana à fond.'],en:['The beach','The Coconut Palace on the ocean, the sun going down, white convertibles parked under the palms. Tropicana blasting.']},
  {img:'art_downtown',qs:['downtown','skyline'],fr:['Centre-ville & Skyline','Le Laser Lounge, les Silver Cab sur le bitume mouillé, les tours sous la lune. EMOTION à trois heures du matin, NEON dans les salles d\'arcade.'],en:['Downtown & Skyline','The Laser Lounge, Silver Cabs on wet asphalt, towers under the moon. EMOTION at 3 a.m., NEON in the arcades.']},
  {img:'art_highway',qs:['highway','everglades'],fr:['Autoroute & Marais','Le Last Stop Motel au bord des marais, les hérons, les breaks en bois garés devant le diner. Sunset Drive au volant, VOLT dans les clubs des Everglades.'],en:['Highway & Everglades','The Last Stop Motel by the swamp, herons, wood-panel wagons parked outside the diner. Sunset Drive behind the wheel, VOLT in the Everglades clubs.']}];

function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=tr(el.dataset.i18n);});
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=tr(el.dataset.i18nHtml);});
  $('lang').textContent=lang==='fr'?'EN':'FR';
  renderStations(); renderParticipate(); renderCredits(); renderFilters(); renderAds(); renderCity(); renderPodcast(); countdown(); clock(); ui();
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

S.forEach((s,i)=>{
  const d=document.createElement('div'); d.style.left=x(s.f); d.style.setProperty('--c',s.c); d.dataset.id=s.id; d.innerHTML='<i></i><span>'+s.f.toFixed(1)+'</span>'; marks.appendChild(d); if(i&&s.f-S[i-1].f<1.2) d.classList.add('up');
  const b=document.createElement('button'); b.type='button'; b.dataset.id=s.id; b.style.setProperty('--c',s.c); b.innerHTML='<i></i><img src="'+s.logo+'" alt="" width="44" height="44" decoding="async">'+esc(s.name); b.addEventListener('click',()=>tune(s.id)); chips.appendChild(b);
});
chips.style.setProperty('--n',S.length); chips.style.setProperty('--m',Math.ceil(S.length/2));

/* grésillement court, uniquement quand on change de station pendant l'écoute */
let actx=null;
function hiss(){
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended') actx.resume();
    const len=Math.floor(actx.sampleRate*.25), buf=actx.createBuffer(1,len,actx.sampleRate), ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*(1-i/len);
    const src=actx.createBufferSource(), g=actx.createGain(), bp=actx.createBiquadFilter();
    bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=.6; g.gain.value=.06*(volume/100);
    src.buffer=buf; src.connect(bp).connect(g).connect(actx.destination); src.start();
  }catch(e){}
}

/* on démarre toujours sur un morceau, jamais au milieu d'une annonce du DJ */
function firstTrack(L){ const t=L.map((v,i)=>v.type==='link'?-1:i).filter(i=>i>=0); return t.length?t[Math.floor(Math.random()*t.length)]:0; }
let pendingSeek=0, errors=0, want=false;
/* flux en direct du serveur (jingles, voix des animateurs, pubs) */
const FLUX='https://live.2-29-41-109.sslip.io/';
function load(id,i,t){ cur=id; const L=st().live; clearInterval(fade);
  if(!L.length){ idx=0; want=false; audio.pause(); audio.removeAttribute('src'); audio.load(); return; }
  idx=((i%L.length)+L.length)%L.length; pendingSeek=0; audio.src=FLUX+id+'?t='+Date.now(); }
audio.addEventListener('loadedmetadata',()=>{ if(pendingSeek&&pendingSeek<audio.duration-2){ try{audio.currentTime=pendingSeek;}catch(e){} } pendingSeek=0; });
let slowStart=false;
function play(){ const s=st(); if(!s||!s.live.length){ ui(); return; }
  clearInterval(fade); const target=volume/100; audio.volume=0;
  want=true; const p=audio.play();
  /* Chrome peut interrompre le démarrage quand l'onglet est en arrière-plan : on relance dès que le son est prêt, sauf si on a coupé entre-temps */
  if(p) p.catch(e=>{ if(e&&e.name==='AbortError') audio.addEventListener('canplay',()=>{ if(want&&audio.paused) audio.play().catch(()=>ui()); },{once:true}); ui(); });
  /* Arrivée sur la page : montée très douce sur 8 s (courbe lente au début), sinon fondu court */
  const n=slowStart?100:12; slowStart=false;
  let k=0; fade=setInterval(()=>{ k++; const x=k/n; audio.volume=Math.min(target,target*(n>12?x*x*x:x)); if(k>=n) clearInterval(fade); },80); }
function stop(){ want=false; clearInterval(fade); audio.pause(); if(cur) offsets[cur]={i:idx,t:audio.currentTime}; ui(); }
function tune(id){
  if(cur===id){ if(audio.paused) play(); else stop(); return; }
  const wasOn=cur&&!audio.paused;
  if(cur) offsets[cur]={i:idx,t:audio.currentTime};
  audio.pause(); if(typeof RX!=='undefined') RX.burst(); else if(wasOn) hiss();
  const s=S.find(v=>v.id===id), o=offsets[id];
  errors=0; load(id,o?o.i:firstTrack(s.live),o?o.t:0);
  play(); ui(); meta();
}
function next(){ if(!cur||!st().live.length) return; errors=0; load(cur,0); play(); ui(); meta(); }
function togglePlay(){ if(!cur) tune('tropicana'); else if(audio.paused) play(); else stop(); }
function ui(){
  const s=st(), on=!!(s&&!audio.paused), acc=s?s.c:'#F5E3C3';
  dial.style.setProperty('--acc',acc); dock.style.setProperty('--acc',acc); dial.classList.toggle('on',on);
  $('d-freq').textContent=s?s.f.toFixed(1):'—';
  $('d-name').textContent=s?s.name:tr('pick');
  $('d-genre').textContent=s?(lang==='fr'?s.genre:s.genre_en)+' · '+(lang==='fr'?s.slogan:s.slogan_en):tr('pick_hint');
  const it=null;
  const title=s&&s.live.length?(on?(lang==='fr'?'EN DIRECT':'LIVE'):s.name):(s?tr('soon_prog'):tr('pick'));
  $('d-onair').textContent=s&&!s.live.length?tr('soon_badge'):(on?tr('onair'):(s?tr('pause'):tr('off')));
  $('dock-name').textContent=s?'📻 '+s.name+' · '+s.f.toFixed(1)+' FM':'📻 VICE BAY RADIO';
  $('dock-title').textContent=title;
  $('dock-play').textContent=on?'❚❚':'▶';
  $('dock-play').setAttribute('aria-label',on?'Pause':'Lecture');
  needle.style.left=x(s?s.f:LOW);
  scale.setAttribute('aria-valuenow',s?s.f:LOW);
  marks.querySelectorAll('div').forEach(d=>d.classList.toggle('on',d.dataset.id===cur));
  chips.querySelectorAll('button').forEach(b=>{ b.classList.toggle('on',b.dataset.id===cur); b.setAttribute('aria-pressed',on&&b.dataset.id===cur); });
  document.querySelectorAll('.st').forEach(c=>{ const p=on&&c.dataset.id===cur; c.classList.toggle('playing',p); const b=c.querySelector('.st-play'); if(b) b.textContent=p?tr('st_playing'):tr('st_listen'); });
  document.title=(on?'▶ '+s.name+' '+s.f.toFixed(1)+' · ':'')+'Vice Bay Radio · 7 stations FM, Vice Bay 1986';
  if('mediaSession' in navigator) navigator.mediaSession.playbackState=on?'playing':(s?'paused':'none');
  if(typeof RX!=='undefined') RX.update(on,s);
}
/* écran verrouillé, casque, clavier multimédia */
function meta(){
  if(!('mediaSession' in navigator)||!st()) return;
  const s=st(), it=null;
  try{ navigator.mediaSession.metadata=new MediaMetadata({title:it?(it.type==='link'?tr('jingle'):it.title):s.name,artist:s.name+' '+s.f.toFixed(1)+' FM',album:'Vice Bay Radio',artwork:[{src:new URL(s.logo,location.href).href,sizes:'360x360',type:'image/webp'}]}); }catch(e){}
}
if('mediaSession' in navigator){
  const h={play:()=>togglePlay(),pause:()=>stop(),stop:()=>stop(),nexttrack:()=>next()};
  for(const k in h){ try{ navigator.mediaSession.setActionHandler(k,h[k]); }catch(e){} }
}
function nearest(clientX){ const r=scale.getBoundingClientRect(); const f=LOW+Math.min(1,Math.max(0,(clientX-r.left)/r.width))*(HIGH-LOW); return S.reduce((a,b)=>Math.abs(b.f-f)<Math.abs(a.f-f)?b:a); }
let drag=false;
const follow=e=>{ const r=scale.getBoundingClientRect(), p=Math.min(100,Math.max(0,(e.clientX-r.left)/r.width*100)); needle.style.left=p+'%'; if(typeof RX!=='undefined') RX.drag(LOW+p/100*(HIGH-LOW)); };
scale.addEventListener('pointerdown',e=>{ drag=true; scale.setPointerCapture(e.pointerId); needle.style.transition='none'; if(typeof RX!=='undefined') RX.dragStart(); follow(e); });
scale.addEventListener('pointermove',e=>{ if(drag) follow(e); });
scale.addEventListener('pointerup',e=>{ if(!drag) return; drag=false; needle.style.transition=''; if(typeof RX!=='undefined') RX.dragEnd(); const id=nearest(e.clientX).id; if(id===cur&&!audio.paused) ui(); else tune(id); });
scale.addEventListener('pointercancel',()=>{ drag=false; needle.style.transition=''; if(typeof RX!=='undefined') RX.dragEnd(); ui(); });
scale.addEventListener('keydown',e=>{ const i=S.findIndex(s=>s.id===cur);
  if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); tune(S[Math.min(S.length-1,i+1)].id); }
  if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); tune(S[Math.max(0,i<0?0:i-1)].id); }
  if(e.key===' '||e.key==='Enter'){ e.preventDefault(); togglePlay(); } });
$('dock-play').addEventListener('click',togglePlay);
$('dock-skip').addEventListener('click',next);
$('dock-vol').addEventListener('input',e=>{ volume=+e.target.value; clearInterval(fade); audio.volume=volume/100; });
audio.addEventListener('ended',()=>{ if(!cur||!st().live.length) return; load(cur,0); play(); ui(); meta(); });
/* un fichier qui ne charge pas : on passe au suivant, sans boucler à l'infini */
audio.addEventListener('error',()=>{ if(!cur||!audio.getAttribute('src')) return; const w=Math.min(15000,++errors*2000); setTimeout(()=>{ if(want&&cur){ load(cur,0); play(); ui(); meta(); } },w); });
/* chien de garde : direct voulu mais le temps n'avance plus pendant ~12 s (réseau, mise en veille, flux figé) : on se rebranche */
let wdT=-1, wdN=0; setInterval(()=>{ if(!want||!cur||!st().live.length){ wdN=0; return; }
  if(audio.currentTime===wdT&&!audio.seeking){ if(++wdN>=2){ wdN=0; load(cur,0); play(); ui(); meta(); } } else wdN=0; wdT=audio.currentTime; },6000);
audio.addEventListener('timeupdate',()=>{ $('dock-prog').style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+'%'; });
audio.addEventListener('play',ui); audio.addEventListener('pause',ui); audio.addEventListener('playing',()=>{ errors=0; });
document.addEventListener('click',e=>{ const b=e.target.closest('[data-tune]'); if(b){ e.preventDefault(); tune(b.dataset.tune); } });



/* ---------- PARTICIPE ---------- */
function renderParticipate(){
  const el=$('pa-grid'); if(!el) return;
  const I=['🎵','📺','💌','🏆','🎙'];
  el.innerHTML=I.map((ic,i)=>'<a class="pa" href="https://discord.gg/TSaxEnt2dG" target="_blank" rel="noopener"><span class="pa-ic" aria-hidden="true">'+ic+'</span><b>'+tr('pa_'+(i+1)+'t')+'</b><span>'+tr('pa_'+(i+1)+'d')+'</span></a>').join('');
}

/* ---------- CRÉDITS ---------- */
function renderCredits(){
  const el=$('cr-list'); if(!el) return;
  const C=D.credits||{}, L=D.licenses||{};
  el.innerHTML=S.map(s=>{
    const rows=(C[s.id]||[]).map(r=>{
      const lu=L[r.l], lic=lu?'<a href="'+lu+'" target="_blank" rel="noopener">'+esc(r.l)+'</a>':esc(r.l);
      const t=r.u?'<a href="'+esc(r.u)+'" target="_blank" rel="noopener">'+esc(r.t)+'</a>':esc(r.t);
      return '<li><b>'+t+'</b><span>'+esc(r.a)+'</span><em>'+lic+'</em></li>';
    }).join('');
    return '<details class="cr" style="--c:'+s.c+'"><summary><i></i>'+esc(s.name)+' <small>'+s.f.toFixed(1)+' FM · '+(C[s.id]||[]).length+' '+tr('cr_tracks')+'</small></summary><ul>'+rows+'</ul></details>';
  }).join('');
}

/* ---------- STATIONS ---------- */
function renderStations(){
  $('st-grid').innerHTML=S.map(s=>{
    const href=(lang==='fr'?'':'en/')+'station/'+s.id+'.html';
    return '<article class="st" data-id="'+s.id+'" style="--c:'+s.c+'">'+
      '<a class="st-img" href="'+href+'" tabindex="-1" aria-hidden="true"><img src="'+s.logo+'" alt="" loading="lazy" width="360" height="360"/></a>'+
      '<div class="st-body"><span class="st-f">'+s.f.toFixed(1)+' FM</span>'+
      '<h3><a href="'+href+'">'+esc(s.name)+'</a></h3>'+
      '<span class="st-genre">'+esc(lang==='fr'?s.genre:s.genre_en)+'</span>'+
      '<p class="st-slogan">« '+esc(lang==='fr'?s.slogan:s.slogan_en)+' »</p>'+
      (s.host?'<p class="st-host">'+tr('st_host')+' <b>'+esc(s.host)+'</b></p>':'')+
      '<div class="st-foot"><button class="st-play" type="button" data-tune="'+s.id+'">'+tr('st_listen')+'</button>'+
      '<a class="st-more" href="'+href+'">'+tr('st_page')+'</a></div></div></article>';
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
    return '<a class="ad" href="'+(lang==='fr'?'':'en/')+'pub/'+a.id+'.html" data-ad="'+a.id+'" style="--q:'+q.c+';--c:'+s.c+'"'+(show?'':' hidden')+'>'+
      '<img src="'+a.logo+'" alt="" loading="lazy" width="420" height="420"/>'+
      '<b>'+esc(a.shop)+'</b><small><i></i>'+esc(s.name)+' '+s.f.toFixed(1)+' · '+esc(q[lang])+'</small></a>';
  }).join('');
}

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

/* Autoradio : bruit de syntonisation, boutons rotatifs, égaliseur. S'appuie sur radio.js (tune, S, audio, volume, LOW, HIGH). */
const RX=(()=>{
  const rx=document.getElementById('dial'), eq=document.getElementById('rx-eq');
  const kT=document.getElementById('knob-tune'), kV=document.getElementById('knob-vol');
  let ctx=null, noiseBuf=null, loop=null, loopGain=null, dragging=false, curOn=false;
  const A0=-135, A1=135;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const freqAngle=f=>A0+(f-LOW)/(HIGH-LOW)*(A1-A0);
  const angleFreq=a=>LOW+(clamp(a,A0,A1)-A0)/(A1-A0)*(HIGH-LOW);

  /* ---- son ---- */
  function ac(){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==='suspended') ctx.resume();
      if(!noiseBuf){
        const n=ctx.sampleRate*2; noiseBuf=ctx.createBuffer(1,n,ctx.sampleRate); const d=noiseBuf.getChannelData(0);
        let b=0; for(let i=0;i<n;i++){ const w=Math.random()*2-1; b=.7*b+.3*w; d[i]=w*.7+b*.6; }   // souffle + grave de parasite
      }
    }catch(e){ ctx=null; }
    return ctx;
  }
  const vol=()=>(typeof volume==='number'?volume:60)/100;

  /* entre deux stations : souffle, sifflement qui glisse, quelques craquements */
  function burst(){
    const c=ac(); if(!c) return;
    const t=c.currentTime, dur=.62, g=c.createGain(), bp=c.createBiquadFilter(), src=c.createBufferSource();
    src.buffer=noiseBuf; src.loop=true; bp.type='bandpass'; bp.Q.value=.9;
    bp.frequency.setValueAtTime(700,t); bp.frequency.exponentialRampToValueAtTime(3800,t+dur*.45); bp.frequency.exponentialRampToValueAtTime(1300,t+dur);
    const v=.16*vol()+.02;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.04);
    g.gain.setValueAtTime(v,t+dur*.6); g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    src.connect(bp).connect(g).connect(c.destination); src.start(t,Math.random()); src.stop(t+dur+.05);
    const o=c.createOscillator(), og=c.createGain(); o.type='sine';
    o.frequency.setValueAtTime(2600,t); o.frequency.exponentialRampToValueAtTime(380,t+dur*.8);
    og.gain.setValueAtTime(.0001,t); og.gain.linearRampToValueAtTime(.025*vol()+.004,t+.05); og.gain.exponentialRampToValueAtTime(.0001,t+dur*.8);
    o.connect(og).connect(c.destination); o.start(t); o.stop(t+dur);
    for(let k=0;k<4;k++){                                            // craquements
      const pt=t+Math.random()*dur*.9, ps=c.createBufferSource(), pg=c.createGain();
      ps.buffer=noiseBuf; pg.gain.setValueAtTime(.3*vol()+.03,pt); pg.gain.exponentialRampToValueAtTime(.0005,pt+.02+Math.random()*.03);
      ps.connect(pg).connect(c.destination); ps.start(pt,Math.random()*1.5); ps.stop(pt+.07);
    }
    rx.classList.add('tuning'); setTimeout(()=>rx.classList.remove('tuning'),dur*1000);
  }

  /* pendant qu'on tourne le bouton : le souffle monte quand on s'éloigne d'une station */
  function dragStart(){
    dragging=true; const c=ac(); if(!c) return;
    loop=c.createBufferSource(); loopGain=c.createGain(); const bp=c.createBiquadFilter();
    loop.buffer=noiseBuf; loop.loop=true; bp.type='bandpass'; bp.frequency.value=1800; bp.Q.value=.5;
    loopGain.gain.value=0; loop.connect(bp).connect(loopGain).connect(c.destination); loop.start();
    rx.classList.add('tuning');
  }
  function drag(f){
    if(!dragging) return;
    const d=S.reduce((m,s)=>Math.min(m,Math.abs(s.f-f)),9), close=clamp(1-d/1.4,0,1);
    if(loopGain&&ctx) loopGain.gain.setTargetAtTime((1-close)*.12*vol()+.01,ctx.currentTime,.03);
    if(cur&&!audio.paused) audio.volume=vol()*(.12+.88*close);
    const fr=document.getElementById('d-freq'); if(fr) fr.textContent=f.toFixed(1);
    kT.style.transition='none'; kT.style.transform='rotate('+freqAngle(f)+'deg)';
  }
  function dragEnd(){
    dragging=false; rx.classList.remove('tuning');
    if(loop&&ctx){ try{ loopGain.gain.setTargetAtTime(0,ctx.currentTime,.05); loop.stop(ctx.currentTime+.3); }catch(e){} }
    loop=null; loopGain=null; kT.style.transition='';
    if(cur&&!audio.paused) audio.volume=vol();
  }

  /* ---- boutons rotatifs ---- */
  function angleOf(el,e){ const r=el.getBoundingClientRect(); return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI+90; }
  function rotary(el,onMove,onEnd){
    let on=false, last=0, acc=0;
    el.addEventListener('pointerdown',e=>{ on=true; el.setPointerCapture(e.pointerId); last=angleOf(el,e); acc=el._a||0; ac(); onMove(acc,true); });
    el.addEventListener('pointermove',e=>{ if(!on) return; let a=angleOf(el,e), d=a-last; if(d>180) d-=360; if(d<-180) d+=360; last=a; acc=clamp(acc+d,A0,A1); el._a=acc; onMove(acc,false); });
    const up=()=>{ if(!on) return; on=false; onEnd(el._a); };
    el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up);
  }
  rotary(kT,(a,first)=>{ if(first){ dragStart(); const f=cur&&st()?st().f:LOW; kT._a=freqAngle(first&&cur?f:LOW); } const f=angleFreq(kT._a); needle.style.transition='none'; needle.style.left=((f-LOW)/(HIGH-LOW)*100)+'%'; drag(f); },
         ()=>{ const f=angleFreq(kT._a), s=S.reduce((a,b)=>Math.abs(b.f-f)<Math.abs(a.f-f)?b:a); needle.style.transition=''; dragEnd(); if(s.id===cur&&!audio.paused) ui(); else tune(s.id); });
  kT.addEventListener('keydown',e=>{ const i=S.findIndex(s=>s.id===cur);
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); tune(S[Math.min(S.length-1,i+1)].id); }
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); tune(S[Math.max(0,i<0?0:i-1)].id); } });
  /* départ du bouton à la position de la station courante */
  kT.addEventListener('pointerdown',()=>{ kT._a=freqAngle(cur&&st()?st().f:LOW); },true);

  const volAngle=v=>A0+v/100*(A1-A0);
  function setVol(v){ volume=clamp(Math.round(v),0,100); const r=document.getElementById('dock-vol'); if(r) r.value=volume; if(cur&&!audio.paused) audio.volume=volume/100; kV.style.transform='rotate('+volAngle(volume)+'deg)'; kV.setAttribute('aria-valuenow',volume); }
  rotary(kV,(a,first)=>{ if(first) kV._a=volAngle(volume); setVol((kV._a-A0)/(A1-A0)*100); },()=>{});
  kV.addEventListener('pointerdown',()=>{ kV._a=volAngle(volume); },true);
  kV.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); setVol(volume+8); } if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); setVol(volume-8); } });
  document.getElementById('dock-vol').addEventListener('input',()=>setVol(+document.getElementById('dock-vol').value));
  setVol(typeof volume==='number'?volume:60);

  /* ---- égaliseur ---- */
  const bars=[]; for(let i=0;i<20;i++){ const b=document.createElement('i'); eq.appendChild(b); bars.push(b); }
  let phase=0; const lvl=bars.map(()=>.05);
  (function tick(){
    phase+=.07;
    bars.forEach((b,i)=>{
      const beat=.5+.5*Math.sin(phase*1.6+i*.5), wob=.5+.5*Math.sin(phase*3.1+i*1.7), rnd=Math.random();
      const target=curOn?clamp(.12+.45*beat*(.6+.4*wob)+.4*rnd*(1-i/bars.length*.5),0,1):.04;
      lvl[i]+=(target-lvl[i])*.35; b.style.transform='scaleY('+lvl[i].toFixed(3)+')';
    });
    requestAnimationFrame(tick);
  })();

  function update(on,s){
    curOn=on; rx.classList.toggle('on',on);
    if(!dragging){ kT._a=freqAngle(s?s.f:LOW); kT.style.transform='rotate('+kT._a+'deg)'; }
    document.getElementById('led-st').textContent=on?'STEREO':'STEREO';
  }
  return {burst,dragStart,drag,dragEnd,update};
})();



applyLang();
try{ const q=new URLSearchParams(location.search).get('tune'); if(q&&S.some(s=>s.id===q)){ const s0=S.find(s=>s.id===q); load(q,firstTrack(s0.live),0); ui(); meta(); } }catch(e){}
/* Arrivée sur la page : la radio s'allume seule. Si le navigateur bloque le son sans geste, elle démarre au premier clic ou touche */

/* ---------- PODCAST ---------- */
const fmtT=s=>{ s=Math.max(0,Math.floor(s||0)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };
const HEAD={'Sakura':'vicej','Big Lou':'volt','Mél':'sunset'};
function podHeads(e){ return '<div class="pod-heads">'+(e.hosts||[]).map(n=>HEAD[n]?'<span><img src="img/host_'+HEAD[n]+'.jpg" alt="'+esc(n)+'" width="40" height="40" loading="lazy"/><i>'+esc(n)+'</i></span>':'').join('')+'</div>'; }
function podEpisodes(){ return (POD&&Array.isArray(POD.episodes))?POD.episodes:[]; }
function renderPodcast(){
  const list=$('pod-list'), tag=$('pod-tag'); if(!list) return;
  const eps=podEpisodes();
  const chip=$('pod-chip'); if(chip&&eps.length){ chip.textContent=(lang==='fr'?'🎙 Nouveau · Vice Bay Podcast · ':'🎙 New · Vice Bay Podcast · ')+eps.length+(lang==='fr'?(eps.length>1?' épisodes':' épisode'):(eps.length>1?' episodes':' episode')); }
  const lt=$('pod-latest'); if(lt&&eps.length){ lt.dataset.pod=eps.slice().sort((a,b)=>(b.n||0)-(a.n||0))[0].id; }
  if(!POD){ list.innerHTML='<p class="pod-soon">'+esc(tr('pod_off'))+'</p>'; return; }
  if(!eps.length){ list.innerHTML='<p class="pod-soon">'+esc(tr('pod_soon'))+'</p>'; return; }
  const loc=lang==='fr'?'fr-FR':'en-US';
  list.innerHTML=eps.slice().sort((a,b)=>(b.n||0)-(a.n||0)).map(e=>{
    const d=e.date?new Date(e.date):null, ds=d&&!isNaN(d)?d.toLocaleDateString(loc,{year:'numeric',month:'long',day:'numeric'}):'';
    const on=podId===e.id&&podEl&&!podEl.paused;
    return '<article class="pod-ep'+(podId===e.id?' cur':'')+'" data-id="'+esc(e.id)+'">'+
      '<button class="pod-btn" type="button" data-pod="'+esc(e.id)+'" aria-label="'+esc(tr(on?'pod_pause':'pod_play'))+'">'+(on?'❚❚':'▶')+'</button>'+
      '<div class="pod-body"><h3>'+(e.n?'<span>#'+esc(e.n)+'</span> ':'')+esc(lang==='fr'?e.title:(e.title_en||e.title))+'</h3>'+
      '<p>'+esc(lang==='fr'?e.desc:(e.desc_en||e.desc))+'</p>'+
      '<div class="pod-meta">'+[ds,e.minutes?e.minutes+' '+tr('pod_min'):'',(e.hosts||[]).join(' · ')].filter(Boolean).map(esc).join(' · ')+'</div>'+
      podHeads(e)+
      '<div class="pod-bar"><input type="range" min="0" max="1000" value="0" step="1" aria-label="Progression" '+(podId===e.id?'':'disabled')+'/><time>0:00</time></div>'+
      '<button class="com-tog" type="button" data-com-tog="'+esc(e.id)+'" aria-expanded="'+(COM(e.id).open?'true':'false')+'"></button><div class="com-box" data-com="'+esc(e.id)+'"></div></div></article>';
  }).join('');
  eps.forEach(e=>comRender(e.id));
  podSync();
}
function podSync(){
  const p=podEl; document.querySelectorAll('.pod-ep').forEach(a=>{
    const me=a.dataset.id===podId, on=me&&p&&!p.paused, r=a.querySelector('input'), t=a.querySelector('time'), b=a.querySelector('.pod-btn');
    a.classList.toggle('cur',me); b.textContent=on?'❚❚':'▶'; b.setAttribute('aria-label',tr(on?'pod_pause':'pod_play'));
    r.disabled=!me;
    if(me&&p){ if(!r.matches(':active')) r.value=p.duration?Math.round(p.currentTime/p.duration*1000):0; t.textContent=fmtT(p.currentTime)+(p.duration?' / '+fmtT(p.duration):''); }
    else { r.value=0; t.textContent='0:00'; }
  });
}
function podToggle(id){
  const e=podEpisodes().find(v=>v.id===id); if(!e||!e.audio) return;
  if(!podEl){
    podEl=new Audio(); podEl.preload='none';
    ['timeupdate','pause','ended','loadedmetadata','durationchange'].forEach(t=>podEl.addEventListener(t,podSync));
    podEl.addEventListener('play',()=>{ if(!audio.paused||want) stop(); podSync(); });
    /* la radio reprend la main : on met le podcast en pause */
    audio.addEventListener('play',()=>{ if(podEl&&!podEl.paused) podEl.pause(); });
  }
  if(podId===id){ if(podEl.paused) podEl.play().catch(podSync); else podEl.pause(); podSync(); return; }
  podId=id; podEl.src=new URL(e.audio,location.href).href; podEl.play().catch(podSync);
  try{ navigator.mediaSession.metadata=new MediaMetadata({title:e.title,artist:'Vice Bay Podcast',album:'Vice Bay Podcast'}); }catch(_){}
  podSync();
}
document.addEventListener('click',ev=>{ const b=ev.target.closest&&ev.target.closest('[data-pod]'); if(b) podToggle(b.dataset.pod); });
document.addEventListener('input',ev=>{ const r=ev.target; if(r.matches&&r.matches('.pod-bar input')&&podEl&&podEl.duration) podEl.currentTime=r.value/1000*podEl.duration; });
/* ---------- COMMENTAIRES DU PODCAST ---------- */
const COM_API='https://live.vicebayradio.com/podcast', K_DEV='vbr.podcast.device', K_PSE='vbr.podcast.pseudo';
const comState={};
function COM(id){ return comState[id]||(comState[id]={open:false,loaded:false,loading:false,list:[],draft:'',err:'',busy:false,needPseudo:false,pseudoDraft:'',rate:{avg:0,count:0,mine:0}}); }
function lsGet(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
function lsSet(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
let _devMem=null;
function comDevice(){
  let d=lsGet(K_DEV); if(d) return d;
  if(_devMem) return _devMem;
  const u=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{ const r=(window.crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint8Array(1))[0]&15:Math.random()*16|0; return (c==='x'?r:(r&3|8)).toString(16); });
  _devMem=u; lsSet(K_DEV,u); return u;
}
const comPseudo=()=>lsGet(K_PSE)||'';
async function comApi(path,opt){
  try{
    const r=await fetch(COM_API+path,opt); let j={}; try{ j=await r.json(); }catch(e){}
    return {status:r.status,j};
  }catch(e){ return {status:0,j:{}}; }
}
function comAgo(at){
  const s=Math.max(0,Math.floor(Date.now()/1000-at));
  if(s<60) return tr('com_ago_now');
  if(s<3600) return tr('com_ago_m').replace('%n',Math.floor(s/60));
  if(s<86400) return tr('com_ago_h').replace('%n',Math.floor(s/3600));
  return tr('com_ago_d').replace('%n',Math.floor(s/86400));
}
function comHue(p){ let h=0; for(const c of String(p)) h=(h*31+c.codePointAt(0))%360; return h; }
function comErr(kind,r){
  const e=r.j&&r.j.error;
  if(!r.status) return tr('com_e_net');
  if(kind==='pseudo'){
    if(e==='taken') return tr('com_e_taken');
    if(e==='already') return tr('com_e_already')+(r.j.pseudo?' « '+r.j.pseudo+' »':'')+'.';
    if(e==='invalid') return tr('com_e_pinv');
  } else {
    if(e==='pseudo') return tr('com_e_pseudo');
    if(e==='invalid') return tr('com_e_tinv');
    if(e==='slow'||r.status===429) return tr('com_e_slow');
  }
  return tr('com_e_net');
}
function comRender(id){
  const box=document.querySelector('.com-box[data-com="'+id+'"]'), tog=document.querySelector('[data-com-tog="'+id+'"]'); if(!box||!tog) return;
  const s=COM(id);
  tog.textContent=s.open?tr('com_hide'):(s.loaded&&s.list.length?tr('com_btn_n').replace('%n',s.list.length):tr('com_btn'));
  tog.setAttribute('aria-expanded',s.open?'true':'false');
  box.hidden=!s.open; if(!s.open){ box.innerHTML=''; return; }
  const ps=comPseudo();
  const list=s.loading&&!s.loaded?'<p class="com-note">'+esc(tr('com_load'))+'</p>':
    (s.list.length?'<ul class="com-list">'+s.list.map(c=>'<li><div class="com-h"><b style="color:hsl('+comHue(c.pseudo)+',85%,68%)">'+esc(c.pseudo)+'</b><time>'+esc(comAgo(c.at))+'</time></div><div class="com-b"><p>'+esc(c.text)+'</p><button type="button" class="com-like'+(c.liked?' on':'')+'" data-com-like="'+esc(c.id)+'" aria-pressed="'+(c.liked?'true':'false')+'" aria-label="'+esc(tr('like_aria'))+'"><span aria-hidden="true">'+(c.liked?'♥':'♡')+'</span> <i>'+(c.likes|0)+'</i></button></div></li>').join('')+'</ul>':
     '<p class="com-note">'+esc(tr('com_none'))+'</p>');
  const form=s.needPseudo&&!ps?
    '<div class="com-pseudo"><strong>'+esc(tr('com_pseudo_t'))+'</strong><p class="com-warn">'+esc(tr('com_pseudo_w'))+'</p><div class="com-row"><input class="com-p" type="text" maxlength="20" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+esc(tr('com_pseudo_ph'))+'" value="'+esc(s.pseudoDraft)+'" aria-label="'+esc(tr('com_pseudo_t'))+'"/><button type="button" class="com-ok" data-com-pseudo="'+esc(id)+'"'+(s.busy?' disabled':'')+'>'+esc(tr(s.busy?'com_sending':'com_pseudo_ok'))+'</button></div></div>':
    '<div class="com-new">'+(ps?'<p class="com-as">'+esc(tr('com_as'))+' <b style="color:hsl('+comHue(ps)+',85%,68%)">'+esc(ps)+'</b></p>':'')+'<textarea class="com-t" maxlength="500" rows="2" placeholder="'+esc(tr('com_ph'))+'" aria-label="'+esc(tr('com_ph'))+'">'+esc(s.draft)+'</textarea><button type="button" class="com-ok" data-com-send="'+esc(id)+'"'+(s.busy?' disabled':'')+'>'+esc(tr(s.busy?'com_sending':'com_send'))+'</button></div>';
  box.innerHTML=comRateHtml(id)+list+form+(s.err?'<p class="com-err" role="alert">'+esc(s.err)+'</p>':'');
}
function comRateHtml(id){
  const r=COM(id).rate, n=r.count|0, m=r.mine|0;
  const txt=n?(n===1?tr('rate_1'):tr('rate_n').replace('%n',n)).replace('%a',(Math.round(r.avg*10)/10).toLocaleString(lang==='en'?'en-US':'fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})):tr('rate_none');
  let st=''; for(let i=1;i<=5;i++) st+='<button type="button" class="com-star'+(i<=m?' on':'')+'" data-com-star="'+i+'" aria-label="'+esc(tr('rate_aria').replace('%n',i))+'">'+(i<=m?'★':'☆')+'</button>';
  return '<div class="com-rate" title="'+esc(m?tr('rate_mine').replace('%m',m):'')+'"><div class="com-stars" role="group">'+st+'</div><span class="com-rtxt">'+esc(txt)+'</span></div>';
}
async function comLoadRate(id){
  const s=COM(id), r=await comApi('/rating?ep='+encodeURIComponent(id)+'&device='+encodeURIComponent(comDevice()));
  if(r.status===200&&r.j&&typeof r.j.avg==='number'){ s.rate={avg:r.j.avg,count:r.j.count|0,mine:r.j.mine|0}; comRender(id); }
}
async function comRate(id,stars){
  const s=COM(id), prev=s.rate, n=prev.count|0, m=prev.mine|0;
  const sum=prev.avg*n-(m?m:0)+stars, cnt=m?n:n+1;
  s.rate={avg:cnt?sum/cnt:0,count:cnt,mine:stars}; comRender(id);
  const r=await comApi('/rating',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ep:id,device:comDevice(),stars})});
  if(r.status===200&&r.j&&typeof r.j.avg==='number') s.rate={avg:r.j.avg,count:r.j.count|0,mine:r.j.mine|0}; else s.rate=prev;
  comRender(id); if(r.status===200) comLoadRate(id);
}
async function comLike(id,cid){
  const s=COM(id), c=s.list.find(x=>String(x.id)===String(cid)); if(!c) return;
  const was=!!c.liked, wasN=c.likes|0;
  c.liked=!was; c.likes=Math.max(0,wasN+(was?-1:1)); comRender(id);
  const r=await comApi('/like',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({device:comDevice(),id:c.id})});
  if(r.status===200&&r.j&&typeof r.j.liked==='boolean'){ c.liked=r.j.liked; c.likes=r.j.likes|0; } else { c.liked=was; c.likes=wasN; }
  comRender(id);
}
async function comLoad(id){
  const s=COM(id); s.loading=true; comRender(id);
  const r=await comApi('/comments?ep='+encodeURIComponent(id)+'&device='+encodeURIComponent(comDevice()));
  s.loading=false;
  if(r.status===200&&r.j&&Array.isArray(r.j.comments)){ s.list=r.j.comments; s.loaded=true; if(s.err===tr('com_e_net')) s.err=''; }
  else if(!s.loaded){ s.err=tr('com_e_net'); }
  comRender(id);
}
async function comSyncPseudo(){
  if(comPseudo()) return;
  const r=await comApi('/pseudo?device='+encodeURIComponent(comDevice()));
  if(r.status===200&&r.j&&r.j.pseudo) lsSet(K_PSE,r.j.pseudo);
}
async function comToggle(id){
  const s=COM(id); s.open=!s.open; s.err='';
  if(s.open){ comRender(id); comLoadRate(id); await comSyncPseudo(); comLoad(id); } else comRender(id);
}
async function comPost(id){
  const s=COM(id), box=document.querySelector('.com-box[data-com="'+id+'"]');
  const ta=box&&box.querySelector('.com-t'); if(ta) s.draft=ta.value;
  if(!s.draft.trim()){ s.err=tr('com_e_tinv'); comRender(id); return; }
  if(!comPseudo()){ await comSyncPseudo(); }
  if(!comPseudo()){ s.needPseudo=true; s.err=''; comRender(id); return; }
  s.busy=true; s.err=''; comRender(id);
  const r=await comApi('/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ep:id,device:comDevice(),text:s.draft})});
  s.busy=false;
  if(r.status===200){ s.draft=''; s.needPseudo=false; await comLoad(id); return; }
  if(r.j&&r.j.error==='pseudo'){ try{localStorage.removeItem(K_PSE);}catch(e){} s.needPseudo=true; s.err=''; }
  else s.err=comErr('comment',r);
  comRender(id);
}
async function comClaim(id){
  const s=COM(id), box=document.querySelector('.com-box[data-com="'+id+'"]');
  const inp=box&&box.querySelector('.com-p'); const v=(inp?inp.value:s.pseudoDraft).trim(); s.pseudoDraft=v;
  if(!/^[A-Za-z0-9_.\-]{3,20}$/.test(v)){ s.err=tr('com_e_pinv'); comRender(id); return; }
  s.busy=true; s.err=''; comRender(id);
  const r=await comApi('/pseudo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({device:comDevice(),pseudo:v})});
  s.busy=false;
  if(r.status===200&&r.j&&r.j.pseudo){ lsSet(K_PSE,r.j.pseudo); s.needPseudo=false; s.err=''; comPost(id); return; }
  if(r.status===409&&r.j&&r.j.error==='already'&&r.j.pseudo){ lsSet(K_PSE,r.j.pseudo); s.needPseudo=false; s.err=''; comRender(id); return; }
  s.err=comErr('pseudo',r); comRender(id);
}
document.addEventListener('click',ev=>{
  const t=ev.target.closest&&ev.target.closest('[data-com-tog],[data-com-send],[data-com-pseudo],[data-com-star],[data-com-like]'); if(!t) return;
  if(t.dataset.comTog) comToggle(t.dataset.comTog);
  else if(t.dataset.comSend) comPost(t.dataset.comSend);
  else if(t.dataset.comPseudo) comClaim(t.dataset.comPseudo);
  else{ const b=t.closest('.com-box'); if(!b) return; if(t.dataset.comStar) comRate(b.dataset.com,+t.dataset.comStar); else comLike(b.dataset.com,t.dataset.comLike); }
});
document.addEventListener('input',ev=>{
  const el=ev.target; if(!el.matches) return; const box=el.closest&&el.closest('.com-box'); if(!box) return;
  const s=COM(box.dataset.com); if(el.matches('.com-t')) s.draft=el.value; else if(el.matches('.com-p')) s.pseudoDraft=el.value;
});
document.addEventListener('keydown',ev=>{
  if(ev.key!=='Enter'||ev.shiftKey||!ev.target.matches) return;
  const box=ev.target.closest&&ev.target.closest('.com-box'); if(!box) return;
  if(ev.target.matches('.com-p')){ ev.preventDefault(); comClaim(box.dataset.com); }
  else if(ev.target.matches('.com-t')&&(ev.metaKey||ev.ctrlKey)){ ev.preventDefault(); comPost(box.dataset.com); }
});
fetch('podcast.json',{cache:'no-cache'}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{ POD=j; renderPodcast(); }).catch(()=>{ renderPodcast(); });

/* plus de démarrage automatique : la radio ne part que sur un appui explicite (27/10/2026, Gabriel) */
const fromHash=()=>{ if(location.hash.startsWith('#pub-')) location.replace((lang==='fr'?'':'en/')+'pub/'+location.hash.slice(5)+'.html'); };
window.addEventListener('hashchange',fromHash); fromHash();
})();

/* le bandeau « Vice Bay, ce n'est pas que la radio » masquait la navigation : l'en-tête se cale dessous */
(function(){ const t=document.querySelector('.top'); if(!t) return;
  const f=()=>{ const b=document.getElementById('mvbar'); t.style.top=b?Math.max(0,b.getBoundingClientRect().bottom)+'px':'0px'; };
  addEventListener('scroll',f,{passive:true}); addEventListener('resize',f); f();
  new MutationObserver(f).observe(document.body,{childList:true}); setTimeout(f,400); setTimeout(f,1500); })();
