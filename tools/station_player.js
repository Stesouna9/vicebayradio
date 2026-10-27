(()=>{
const id="%%ID%%",T=%%T%%,FLUX="https://live.2-29-41-109.sslip.io/";
const $=x=>document.getElementById(x);
const ev=n=>{try{window.goatcounter&&goatcounter.count&&goatcounter.count({path:"ecoute/"+n+"/"+id,title:n,event:true})}catch(e){}};
const a=new Audio();a.preload="none";a.setAttribute("playsinline","");
let want=false,ok=false,cumul=0,t0=0,c30=false,tries=0,wd=0,fade=0,np="";
const dec=s=>{const t=document.createElement("textarea");t.innerHTML=s;return t.value};
const ico=p=>$("ico").setAttribute("d",p?"M6 4h4v16H6zM14 4h4v16h-4z":"M7 4v16l13-8z");
const setNp=t=>{np=t;$("titre").textContent=t||T.live;
  if("mediaSession"in navigator)try{navigator.mediaSession.metadata=new MediaMetadata({title:t||"%%NAME%% %%F%% FM",artist:"%%NAME%% %%F%% FM · Vice Bay Radio",artwork:[{src:"%%ART%%",sizes:"600x600",type:"image/jpeg"}]})}catch(e){}};
async function poll(){
  try{const r=await fetch(FLUX+"status-json.xsl",{cache:"no-store"});const j=await r.json();let s=j.icestats.source;s=Array.isArray(s)?s:[s];
    const m=s.find(x=>(x.listenurl||"").endsWith("/"+id));if(m){const t=dec(m.title||"").trim();if(t&&t!==np)setNp(t)}}catch(e){}
}
function arm(){clearTimeout(wd);wd=setTimeout(()=>{if(want&&a.readyState<3)retry()},10000)}
function retry(){
  clearTimeout(wd);tries++;
  if(tries>4){want=false;ico(false);$("etat").textContent=T.r;$("lect").classList.remove("joue");a.removeAttribute("src");return}
  $("etat").textContent=T.c;setTimeout(()=>{if(want)start()},Math.min(1500*tries,6000))
}
function start(){
  /* direct : on se reconnecte toujours au flux en cours, jamais à un tampon ancien */
  a.src=FLUX+id+"?t="+Date.now();$("etat").textContent=T.c;ico(true);arm();
  const p=a.play();
  if(p&&p.catch)p.catch(err=>{
    if(err&&err.name==="AbortError")return;
    if(err&&err.name==="NotAllowedError"){want=false;ico(false);$("etat").textContent=T.r;return}
    if(want)retry()
  })
}
function go(){want=true;tries=0;start();poll()}
function stop(){want=false;clearTimeout(wd);a.pause();a.removeAttribute("src");a.load();$("lect").classList.remove("joue");if(t0){cumul+=Date.now()-t0;t0=0}$("etat").textContent=T.p;ico(false)}
a.addEventListener("playing",()=>{
  tries=0;clearTimeout(wd);$("etat").textContent=T.on;$("lect").classList.add("joue");ico(true);t0=t0||Date.now();
  if(!ok){ok=true;ev("play")}
  clearInterval(fade);const v=$("vol").value/100;let k=0;a.volume=0;fade=setInterval(()=>{k++;a.volume=Math.min(v,v*k/8);if(k>=8)clearInterval(fade)},60)
});
a.addEventListener("pause",()=>{if(want)stop()});
a.addEventListener("waiting",()=>{if(want){$("etat").textContent=T.c;arm()}});
a.addEventListener("stalled",()=>{if(want)arm()});
a.addEventListener("error",()=>{if(want)retry()});
a.addEventListener("ended",()=>{if(want)retry()});
setInterval(()=>{if(!c30&&cumul+(t0?Date.now()-t0:0)>30000){c30=true;ev("30s")}},5000);
setInterval(poll,15000);
$("pp").onclick=()=>{if(want)stop();else go()};
$("vol").oninput=e=>{a.volume=e.target.value/100;try{localStorage.setItem("vbr_vol",e.target.value)}catch(_){}};
try{const v=localStorage.getItem("vbr_vol");if(v!==null)$("vol").value=v}catch(_){}
$("gta").addEventListener("click",()=>ev("gtavifrance"));
setNp("");poll();
if("mediaSession"in navigator){
  const m=(k,f)=>{try{navigator.mediaSession.setActionHandler(k,f)}catch(e){}};
  m("play",go);m("pause",stop);m("stop",stop)
}
})();
