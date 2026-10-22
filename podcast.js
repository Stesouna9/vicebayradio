/* Vice Bay Podcast : page autonome (lecteur, notes, commentaires, j'aime). Données : podcast.json. API : live.vicebayradio.com/podcast */
(function(){
'use strict';
const API='https://live.vicebayradio.com/podcast', K_DEV='vbr.podcast.device', K_PSE='vbr.podcast.pseudo', K_LANG='vbr.lang';
const HEAD={'Sakura':'vicej','Big Lou':'volt','Mél':'sunset'};
const T={
 fr:{nav_radio:'La radio',nav_ads:'Pubs',nav_links:'Liens',cats:'Humour · Musique · Culture',play_latest:'▶ Écouter le dernier épisode',rss:'📡 Flux RSS',share:'↗ Partager',episodes:'Épisodes',
  more:'Détails',less:'Réduire',play:'Écouter',pause:'Pause',left:'restantes',min:'min',cast:'Au micro',rate:'Noter cet épisode',norating:'Sois le premier à noter',ratings:'notes',
  coms:'Commentaires',pseudo_h:'Choisis ton pseudo',pseudo_w:'Ton pseudo est définitif : tu ne pourras plus le changer.',pseudo_ph:'Pseudo (3 à 20 caractères)',pseudo_ok:'Valider le pseudo',
  as:'Tu écris en tant que',ph:'Ton commentaire…',send:'Envoyer',none:'Aucun commentaire pour l\'instant. Lance la discussion.',
  e_taken:'Ce pseudo est déjà pris.',e_inv_p:'Pseudo invalide : 3 à 20 caractères, lettres, chiffres, _ - .',e_slow:'Doucement : un commentaire toutes les 20 secondes (30 par jour).',e_inv_c:'Commentaire invalide : 1 à 500 caractères, sans lien ni insulte.',e_net:'Réseau indisponible.',e_pse:'Choisis d\'abord un pseudo.',
  ago_now:'à l\'instant',d:'j',copied:'Adresse du flux copiée : colle-la dans ton application de podcasts.',shared:'Lien copié.',soon:'Le premier épisode arrive bientôt.',off:'Les épisodes ne se chargent pas, réessaie plus tard.',avis:'avis'},
 en:{nav_radio:'The radio',nav_ads:'Ads',nav_links:'Links',cats:'Comedy · Music · Culture',play_latest:'▶ Play latest episode',rss:'📡 RSS feed',share:'↗ Share',episodes:'Episodes',
  more:'Details',less:'Less',play:'Play',pause:'Pause',left:'left',min:'min',cast:'On the mic',rate:'Rate this episode',norating:'Be the first to rate',ratings:'ratings',
  coms:'Comments',pseudo_h:'Pick your username',pseudo_w:'Your username is permanent: you can\'t change it later.',pseudo_ph:'Username (3–20 characters)',pseudo_ok:'Confirm username',
  as:'Posting as',ph:'Your comment…',send:'Send',none:'No comments yet. Start the conversation.',
  e_taken:'That username is taken.',e_inv_p:'Invalid username: 3–20 characters, letters, digits, _ - .',e_slow:'Slow down: one comment every 20 seconds (30 a day).',e_inv_c:'Invalid comment: 1–500 characters, no links or insults.',e_net:'Network unavailable.',e_pse:'Pick a username first.',
  ago_now:'just now',d:'d',copied:'Feed address copied: paste it in your podcast app.',shared:'Link copied.',soon:'The first episode is coming soon.',off:'Episodes failed to load, try again later.',avis:'ratings'}
};
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ls(k,v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v); }catch(e){ return null; } }
let lang=(ls(K_LANG)||navigator.language||'fr').slice(0,2)==='en'?'en':'fr';
const tr=k=>(T[lang][k]!=null?T[lang][k]:k);
let POD=null, EPS=[], cur=null, openId=null;
const audio=new Audio(); audio.preload='none';
const S={speeds:[1,1.25,1.5,2,0.75],si:0,rep:'off'};
function device(){ let d=ls(K_DEV); if(!d||!/^[0-9a-f-]{32,36}$/i.test(d)){ d=(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16))); ls(K_DEV,d); } return d; }
function fmt(s){ s=Math.max(0,Math.floor(s||0)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0'); }
function ago(at){ const s=Math.floor(Date.now()/1000-at); if(s<60) return tr('ago_now'); if(s<3600) return Math.floor(s/60)+' min'; if(s<86400) return Math.floor(s/3600)+' h'; return Math.floor(s/86400)+' '+tr('d'); }
function dlabel(iso){ const d=new Date(iso+'T12:00:00'); return isNaN(d)?iso:d.toLocaleDateString(lang==='fr'?'fr-FR':'en-US',{day:'numeric',month:'long',year:'numeric'}); }
function title(e){ return lang==='fr'?e.title:(e.title_en||e.title); }
function desc(e){ return lang==='fr'?e.desc:(e.desc_en||e.desc); }
async function api(path,body){
  try{
    const r=await fetch(API+path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{cache:'no-store'});
    let j={}; try{ j=await r.json(); }catch(e){} return {code:r.status,j};
  }catch(e){ return {code:0,j:{}}; }
}
/* ---------- i18n statique ---------- */
function applyLang(){
  document.documentElement.lang=lang; $('lang').textContent=lang==='fr'?'EN':'FR';
  document.querySelectorAll('[data-i18n]').forEach(n=>{ n.textContent=tr(n.dataset.i18n); });
  if(POD) $('tag').textContent=(lang==='fr'?POD.tagline:(POD.tagline_en||POD.tagline))||'';
  render(); playerSync();
}
$('lang').addEventListener('click',()=>{ lang=lang==='fr'?'en':'fr'; ls(K_LANG,lang); applyLang(); });
/* ---------- état des commentaires / notes par épisode ---------- */
const ST={};
function S_(id){ return ST[id]||(ST[id]={list:[],loaded:false,rate:{avg:0,count:0,mine:0},draft:'',nick:'',err:'',busy:false}); }
async function loadEp(id){
  const s=S_(id), d=device();
  const [c,r]=await Promise.all([api('/comments?ep='+encodeURIComponent(id)+'&device='+d), api('/rating?ep='+encodeURIComponent(id)+'&device='+d)]);
  if(c.code===200) s.list=c.j.comments||[]; if(r.code===200) s.rate=r.j; s.loaded=true;
  if(!('pseudo' in ST)){ const p=await api('/pseudo?device='+d); ST.pseudo=p.code===200?p.j.pseudo:null; if(ST.pseudo) ls(K_PSE,ST.pseudo); }
  renderDetail(id); showRate();
}
function showRate(){
  let sum=0,n=0; EPS.forEach(e=>{ const r=ST[e.id]&&ST[e.id].rate; if(r&&r.count){ sum+=r.avg*r.count; n+=r.count; } });
  $('show-rate').innerHTML=n?'★ '+(sum/n).toFixed(1).replace('.',lang==='fr'?',':'.')+' <small>· '+n+' '+tr('ratings')+'</small>':'';
}
/* ---------- rendu ---------- */
function headsHtml(e,big){ return (e.hosts||[]).filter(n=>HEAD[n]).map(n=>big?'<figure><img src="img/host_'+HEAD[n]+'.jpg" alt="'+esc(n)+'" width="64" height="64"/>'+esc(n)+'</figure>':'<img src="img/host_'+HEAD[n]+'.jpg" alt="'+esc(n)+'" title="'+esc(n)+'" width="34" height="34" loading="lazy"/>').join(''); }
function pillLabel(e){
  const on=cur===e.id&&!audio.paused;
  const base=(cur===e.id&&audio.duration)?Math.max(1,Math.round((audio.duration-audio.currentTime)/60))+' '+tr('min')+' '+tr('left'):e.minutes+' '+tr('min');
  return (on?'❚❚ ':'▶ ')+base;
}
function render(){
  const list=$('list');
  if(!POD){ list.innerHTML='<p class="empty">'+esc(tr('off'))+'</p>'; return; }
  if(!EPS.length){ list.innerHTML='<p class="empty">'+esc(tr('soon'))+'</p>'; return; }
  $('count').textContent=EPS.length;
  list.innerHTML=EPS.map(e=>
    '<article class="ep'+(openId===e.id?' open':'')+'" data-id="'+esc(e.id)+'">'+
    '<div class="ep-meta">'+esc(dlabel(e.date))+' · '+e.minutes+' '+esc(tr('min'))+'</div>'+
    '<h3><span>#'+e.n+'</span>'+esc(title(e))+'</h3>'+
    '<p class="ep-desc">'+esc(desc(e))+'</p>'+
    '<div class="ep-foot"><button class="pill'+(cur===e.id&&!audio.paused?' on':'')+'" type="button" data-play="'+esc(e.id)+'">'+esc(pillLabel(e))+'</button>'+
    '<div class="heads">'+headsHtml(e)+'</div>'+
    '<button class="more" type="button" data-more="'+esc(e.id)+'">'+esc(openId===e.id?tr('less'):tr('more'))+'</button></div>'+
    '<div class="detail" id="det-'+esc(e.id)+'"></div></article>').join('');
  if(openId) renderDetail(openId);
}
function renderDetail(id){
  const box=$('det-'+id); if(!box) return; if(openId!==id) return;
  const e=EPS.find(x=>x.id===id), s=S_(id), me=ST.pseudo;
  /* garde le brouillon et le focus pendant les mises à jour */
  const hadFocus=document.activeElement&&box.contains(document.activeElement)?document.activeElement.id:'';
  const stars=[1,2,3,4,5].map(i=>'<button type="button" data-star="'+i+'" data-ep="'+esc(id)+'" class="'+(i<=(s.rate.mine||Math.round(s.rate.avg))?'f':'')+'" aria-label="'+i+'/5">★</button>').join('');
  const rateTxt=s.rate.count?s.rate.avg.toFixed(1).replace('.',lang==='fr'?',':'.')+' · '+s.rate.count+' '+tr('ratings'):tr('norating');
  const form=me?
    '<div class="com-form"><p class="warn" style="color:var(--muted)">'+esc(tr('as'))+' <b style="color:#fff">'+esc(me)+'</b></p><textarea id="cd-'+esc(id)+'" maxlength="500" placeholder="'+esc(tr('ph'))+'">'+esc(s.draft)+'</textarea><div class="err">'+esc(s.err)+'</div><button class="btn" type="button" data-send="'+esc(id)+'"'+(s.busy?' disabled':'')+'>'+esc(tr('send'))+'</button></div>':
    '<div class="com-form"><p class="det-h" style="margin-bottom:0">'+esc(tr('pseudo_h'))+'</p><p class="warn">'+esc(tr('pseudo_w'))+'</p><input id="cn-'+esc(id)+'" maxlength="20" autocomplete="off" autocapitalize="off" placeholder="'+esc(tr('pseudo_ph'))+'" value="'+esc(s.nick)+'"/><div class="err">'+esc(s.err)+'</div><button class="btn" type="button" data-nick="'+esc(id)+'"'+(s.busy?' disabled':'')+'>'+esc(tr('pseudo_ok'))+'</button></div>';
  const coms=s.list.length?s.list.map(c=>'<div class="com"><div class="com-top"><b>'+esc(c.pseudo)+'</b><time>'+esc(ago(c.at))+'</time><button class="like'+(c.liked?' on':'')+'" type="button" data-like="'+esc(c.id)+'" data-ep="'+esc(id)+'" aria-label="J\'aime">'+(c.liked?'♥':'♡')+(c.likes?' '+c.likes:'')+'</button></div><p>'+esc(c.text)+'</p></div>').join(''):'<p class="empty" style="padding:6px 0">'+esc(tr('none'))+'</p>';
  box.innerHTML='<div class="det-h">'+esc(tr('cast'))+'</div><div class="cast">'+headsHtml(e,true)+'</div>'+
    '<div class="det-h">'+esc(tr('rate'))+'</div><div class="stars">'+stars+'<small>'+esc(rateTxt)+'</small></div>'+
    '<div class="det-h">'+esc(tr('coms'))+'</div>'+form+'<div>'+coms+'</div>';
  if(hadFocus){ const f=$(hadFocus); if(f){ f.focus(); try{ f.setSelectionRange(f.value.length,f.value.length); }catch(x){} } }
}
/* ---------- lecteur ---------- */
const P={bar:$('player')};
function load(id,play){
  const e=EPS.find(x=>x.id===id); if(!e||!e.audio) return;
  if(cur!==id){ cur=id; audio.src=new URL(e.audio,location.href).href; audio.playbackRate=S.speeds[S.si]; }
  P.bar.hidden=false; $('p-title').textContent='#'+e.n+' · '+title(e);
  if(play) audio.play().catch(playerSync);
  mediaSession(e); playerSync(); render();
}
function toggle(id){
  if(cur===id){ if(audio.paused) audio.play().catch(playerSync); else audio.pause(); return; }
  load(id,true);
}
function neighbour(step){ const q=EPS.slice().sort((a,b)=>a.n-b.n), i=q.findIndex(e=>e.id===cur); return i<0?null:q[i+step]||null; }
function next(){ const n=neighbour(1); if(n) load(n.id,true); else if(S.rep==='all'){ const q=EPS.slice().sort((a,b)=>a.n-b.n); load(q[0].id,true); } else audio.currentTime=Math.min(audio.duration||0,audio.currentTime+30); }
function prev(){ if(audio.currentTime>3){ audio.currentTime=0; return; } const p=neighbour(-1); if(p) load(p.id,true); else audio.currentTime=0; }
function playerSync(){
  if(!cur) return;
  $('p-play').textContent=audio.paused?'▶':'❚❚'; $('p-play').setAttribute('aria-label',audio.paused?tr('play'):tr('pause'));
  const d=audio.duration||0; $('p-cur').textContent=fmt(audio.currentTime); $('p-rem').textContent='-'+fmt(d?d-audio.currentTime:0);
  if(!P.drag) $('p-seek').value=d?Math.round(audio.currentTime/d*1000):0;
  $('p-speed').textContent=S.speeds[S.si]+'×'; $('p-rep').textContent=S.rep==='one'?'⟲1':'⟲'; $('p-rep').classList.toggle('act',S.rep!=='off');
  document.querySelectorAll('.pill').forEach(b=>{ const e=EPS.find(x=>x.id===b.dataset.play); if(!e) return; b.textContent=pillLabel(e); b.classList.toggle('on',cur===e.id&&!audio.paused); });
  if('mediaSession' in navigator) navigator.mediaSession.playbackState=audio.paused?'paused':'playing';
}
function mediaSession(e){
  if(!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata=new MediaMetadata({title:'#'+e.n+' · '+title(e),artist:'Vice Bay Podcast',album:'OKALAM Studio',artwork:[{src:new URL('img/podcast_cover_1400.jpg',location.href).href,sizes:'1400x1400',type:'image/jpeg'}]});
  const h=(a,f)=>{ try{ navigator.mediaSession.setActionHandler(a,f); }catch(x){} };
  h('play',()=>audio.play()); h('pause',()=>audio.pause()); h('nexttrack',next); h('previoustrack',prev);
  h('seekbackward',()=>{ audio.currentTime=Math.max(0,audio.currentTime-15); }); h('seekforward',()=>{ audio.currentTime=Math.min(audio.duration||0,audio.currentTime+30); });
}
['timeupdate','play','pause','loadedmetadata','durationchange'].forEach(t=>audio.addEventListener(t,playerSync));
audio.addEventListener('ended',()=>{ if(S.rep==='one'){ audio.currentTime=0; audio.play(); } else { const n=neighbour(1); if(n||S.rep==='all') next(); } });
$('p-play').onclick=()=>cur&&toggle(cur); $('p-next').onclick=next; $('p-prev').onclick=prev;
$('p-b15').onclick=()=>{ audio.currentTime=Math.max(0,audio.currentTime-15); }; $('p-f30').onclick=()=>{ audio.currentTime=Math.min(audio.duration||0,audio.currentTime+30); };
$('p-speed').onclick=()=>{ S.si=(S.si+1)%S.speeds.length; audio.playbackRate=S.speeds[S.si]; playerSync(); };
$('p-rep').onclick=()=>{ S.rep=S.rep==='off'?'all':(S.rep==='all'?'one':'off'); playerSync(); };
const seek=$('p-seek'); seek.addEventListener('input',()=>{ P.drag=true; if(audio.duration) $('p-cur').textContent=fmt(seek.value/1000*audio.duration); });
seek.addEventListener('change',()=>{ if(audio.duration) audio.currentTime=seek.value/1000*audio.duration; P.drag=false; });
/* ---------- actions ---------- */
document.addEventListener('click',async ev=>{
  const t=ev.target.closest('button,a'); if(!t) return;
  if(t.dataset.play){ toggle(t.dataset.play); return; }
  if(t.dataset.more){ const id=t.dataset.more; openId=openId===id?null:id; render(); if(openId) loadEp(id); return; }
  if(t.dataset.star){ const id=t.dataset.ep, v=+t.dataset.star, s=S_(id), before=s.rate.mine; s.rate.mine=v; renderDetail(id);
    const r=await api('/rating',{ep:id,device:device(),stars:v}); if(r.code===200) s.rate=r.j; else s.rate.mine=before; renderDetail(id); showRate(); return; }
  if(t.dataset.like){ const id=t.dataset.ep, s=S_(id), c=s.list.find(x=>x.id===t.dataset.like); if(!c) return;
    const was=c.liked, n=c.likes||0; c.liked=!was; c.likes=Math.max(0,n+(was?-1:1)); renderDetail(id);
    const r=await api('/like',{device:device(),id:c.id}); if(r.code===200){ c.liked=r.j.liked; c.likes=r.j.likes; } else { c.liked=was; c.likes=n; } renderDetail(id); return; }
  if(t.dataset.nick){ const id=t.dataset.nick, s=S_(id), v=($('cn-'+id)||{}).value||''; s.nick=v; s.busy=true; s.err=''; renderDetail(id);
    const r=await api('/pseudo',{device:device(),pseudo:v.trim()}); s.busy=false;
    if(r.code===200){ ST.pseudo=r.j.pseudo; ls(K_PSE,ST.pseudo); s.nick=''; }
    else if(r.code===409&&r.j.error==='already'){ ST.pseudo=r.j.pseudo; }
    else s.err=r.code===409?tr('e_taken'):(r.code===400?tr('e_inv_p'):tr('e_net'));
    renderDetail(id); return; }
  if(t.dataset.send){ const id=t.dataset.send, s=S_(id), v=($('cd-'+id)||{}).value||''; s.draft=v; s.busy=true; s.err=''; renderDetail(id);
    const r=await api('/comments',{ep:id,device:device(),text:v}); s.busy=false;
    if(r.code===200){ s.draft=''; const c=await api('/comments?ep='+encodeURIComponent(id)+'&device='+device()); if(c.code===200) s.list=c.j.comments||[]; }
    else s.err=r.code===429?tr('e_slow'):(r.code===403?tr('e_pse'):(r.code===400?tr('e_inv_c'):tr('e_net')));
    renderDetail(id); return; }
});
document.addEventListener('input',ev=>{ const t=ev.target; if(t.id&&t.id.startsWith('cd-')) S_(t.id.slice(3)).draft=t.value; if(t.id&&t.id.startsWith('cn-')) S_(t.id.slice(3)).nick=t.value; });
$('play-latest').onclick=()=>{ if(EPS[0]) toggle(EPS[0].id); };
$('rss').addEventListener('click',ev=>{ if(navigator.clipboard){ ev.preventDefault(); navigator.clipboard.writeText('https://vicebayradio.com/podcast.xml').then(()=>{ $('hint').textContent=tr('copied'); }).catch(()=>{ location.href='podcast.xml'; }); } });
$('share').onclick=async()=>{ const u='https://vicebayradio.com/podcast.html'; try{ if(navigator.share){ await navigator.share({title:'Vice Bay Podcast',url:u}); return; } await navigator.clipboard.writeText(u); $('hint').textContent=tr('shared'); }catch(e){} };
/* ---------- démarrage ---------- */
fetch('podcast.json',{cache:'no-cache'}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{
  POD=j; EPS=(j.episodes||[]).slice().sort((a,b)=>b.n-a.n); applyLang();
  EPS.forEach(e=>api('/rating?ep='+encodeURIComponent(e.id)+'&device='+device()).then(r=>{ if(r.code===200){ S_(e.id).rate=r.j; showRate(); } }));
  const h=location.hash.replace('#',''); const e=EPS.find(x=>x.id===h); if(e){ openId=e.id; render(); loadEp(e.id); }
}).catch(()=>{ applyLang(); });
applyLang();
})();
