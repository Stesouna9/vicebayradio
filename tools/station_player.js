(()=>{
const L=%%LIVE%%,id="%%ID%%",T=%%T%%;
const $=x=>document.getElementById(x);
const ev=n=>{try{window.goatcounter&&goatcounter.count&&goatcounter.count({path:"ecoute/"+n+"/"+id,title:n,event:true})}catch(e){}};
const a=new Audio();a.preload="auto";a.setAttribute("playsinline","");
const isT=t=>t.type!=="link";
let i=Math.max(0,L.findIndex(isT)),ok=false,cumul=0,t0=0,c30=false,fails=0,want=false,wd=0,fade=0;
const fmt=s=>{if(!isFinite(s)||s<0)return"0:00";s=Math.floor(s);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
const ico=p=>$("ico").setAttribute("d",p?"M6 4h4v16H6zM14 4h4v16h-4z":"M7 4v16l13-8z");
const lbl=t=>t.type==="link"?T.dj:(t.title+(t.artist?" · "+t.artist:""));
const nextTrack=n=>{for(let k=1;k<=L.length;k++){const j=(n+k)%L.length;if(isT(L[j]))return j}return n};
const prevTrack=n=>{for(let k=1;k<=L.length;k++){const j=(n-k+L.length)%L.length;if(isT(L[j]))return j}return n};
function mark(){document.querySelectorAll("#prog button").forEach(b=>b.classList.toggle("now",+b.dataset.i===i))}
function charge(n){
  i=(n+L.length)%L.length;const t=L[i];a.src=t.src;a.load();
  $("titre").textContent=lbl(t);$("seek").value=0;$("cur").textContent="0:00";$("dur").textContent="0:00";
  const nx=L[nextTrack(i)];$("suivant").textContent=T.nx+" : "+(nx.title||"")+(nx.artist?" · "+nx.artist:"");
  mark();
  if("mediaSession"in navigator&&isT(t))try{navigator.mediaSession.metadata=new MediaMetadata({title:t.title||"",artist:t.artist||"Vice Bay Radio",album:"%%NAME%% %%F%% FM",artwork:[{src:"%%ART%%",sizes:"600x600",type:"image/jpeg"}]})}catch(e){}
}
function arm(){clearTimeout(wd);wd=setTimeout(()=>{if(want&&a.paused===false&&a.readyState<3)skip()},12000)}
function skip(){
  fails++;clearTimeout(wd);
  if(fails>L.length){want=false;ico(false);$("etat").textContent=T.r;$("lect").classList.remove("joue");return}
  charge(i+1);go()
}
function go(){
  want=true;if(!a.src)charge(i);
  $("etat").textContent=T.c;ico(true);arm();
  const p=a.play();
  if(p&&p.catch)p.catch(err=>{
    if(err&&err.name==="AbortError")return;
    if(err&&err.name==="NotAllowedError"){want=false;ico(false);$("etat").textContent=T.r;return}
    if(want)skip()
  })
}
function stop(){want=false;clearTimeout(wd);a.pause()}
a.addEventListener("playing",()=>{
  fails=0;clearTimeout(wd);$("etat").textContent=T.on;$("lect").classList.add("joue");ico(true);t0=t0||Date.now();
  if(!ok){ok=true;ev("play")}
  clearInterval(fade);const v=$("vol").value/100;let k=0;a.volume=0;fade=setInterval(()=>{k++;a.volume=Math.min(v,v*k/8);if(k>=8)clearInterval(fade)},60)
});
a.addEventListener("pause",()=>{$("lect").classList.remove("joue");if(t0){cumul+=Date.now()-t0;t0=0}if(!want||a.ended)return;$("etat").textContent=T.p;ico(false)});
a.addEventListener("waiting",()=>{if(want){$("etat").textContent=T.c;arm()}});
a.addEventListener("stalled",()=>{if(want)arm()});
a.addEventListener("ended",()=>{charge(i+1);go()});
a.addEventListener("error",()=>{if(want)skip()});
a.addEventListener("loadedmetadata",()=>{$("dur").textContent=fmt(a.duration)});
a.addEventListener("timeupdate",()=>{if(a.duration){$("seek").value=Math.round(a.currentTime/a.duration*1000)}$("cur").textContent=fmt(a.currentTime)});
setInterval(()=>{if(!c30&&cumul+(t0?Date.now()-t0:0)>30000){c30=true;ev("30s")}},5000);
$("pp").onclick=()=>{if(want&&!a.paused){stop();$("etat").textContent=T.p;ico(false)}else go()};
$("nx").onclick=()=>{charge(nextTrack(i));go()};
$("pv").onclick=()=>{if(a.currentTime>4){a.currentTime=0}else{charge(prevTrack(i))}go()};
$("seek").oninput=e=>{if(a.duration)a.currentTime=a.duration*e.target.value/1000};
$("vol").oninput=e=>{a.volume=e.target.value/100;try{localStorage.setItem("vbr_vol",e.target.value)}catch(_){}};
try{const v=localStorage.getItem("vbr_vol");if(v!==null)$("vol").value=v}catch(_){}
document.querySelectorAll("#prog button").forEach(b=>b.onclick=()=>{charge(+b.dataset.i);go()});
$("gta").addEventListener("click",()=>ev("gtavifrance"));
charge(i);
if("mediaSession"in navigator){
  const m=(k,f)=>{try{navigator.mediaSession.setActionHandler(k,f)}catch(e){}};
  m("play",go);m("pause",()=>{stop();ico(false);$("etat").textContent=T.p});m("nexttrack",()=>{charge(nextTrack(i));go()});m("previoustrack",()=>{charge(prevTrack(i));go()})
}
})();
