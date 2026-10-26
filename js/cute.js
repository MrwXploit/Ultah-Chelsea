/* Kawaii Edition v9 — ubah CUTE di bawah untuk mematikan fitur tertentu */
const CUTE={sfx:true,trail:true};
const EMJ=["🌷","🌸","💖","⭐","🎀","✨","🍓","🐾"];

/* Bunga & hati melayang di latar */
const bgf=$("#bgf");
if(!reduce)for(let i=0;i<16;i++){const e=document.createElement("i");e.textContent=EMJ[i%EMJ.length];
 e.style.cssText=`left:${Math.random()*100}%;font-size:${14+Math.random()*20}px;animation-duration:${11+Math.random()*12}s;animation-delay:${-Math.random()*20}s;--sx:${(Math.random()-.5)*120}px`;bgf.append(e)}

/* Judul loncat-loncat */
const h1=$("#intro h1"),h1t=h1.textContent;h1.setAttribute("aria-label",h1t);
h1.innerHTML=h1t.split(" ").map((w,wi)=>`<span class="w" aria-hidden="true">${[...w].map((c,i)=>`<span style="--i:${wi*4+i}">${esc(c)}</span>`).join("")}</span>`).join(" ");

/* Letupan emoji + sparkle */
function popAt(x,y,list,n=6){if(reduce)return;for(let k=0;k<n;k++){const s=document.createElement("span"),a=Math.random()*6.283,d=40+Math.random()*50;
 s.className="pp";s.textContent=list[k%list.length];s.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-40}px`;document.body.append(s);setTimeout(()=>s.remove(),900)}}
let lastT=0;
document.addEventListener("pointermove",e=>{if(!CUTE.trail||e.pointerType!=="mouse"||Date.now()-lastT<70)return;lastT=Date.now();popAt(e.clientX,e.clientY,["✦","✧"],1)});
document.addEventListener("pointerdown",e=>popAt(e.clientX,e.clientY,["✨","💖","🌸","⭐"],4));

/* Efek suara "pop" (bisa dimatikan lewat tombol 🔔 di pemutar musik) */
let AC;
function sfx(f=660){if(!CUTE.sfx||$("#sfx").getAttribute("aria-pressed")!=="true")return;
 try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
 o.type="sine";o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.08);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);
 o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.15)}catch{}}
$("#sfx").onclick=e=>{const b=e.currentTarget,on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);b.textContent=on?"🔔":"🔕";sfx()};
document.addEventListener("click",e=>{if(e.target.closest(".btn,.chip,.loc,.cloud,.pol,.mc,#nav button,.tabs button"))sfx(500+Math.random()*300)});

/* Planet bisa dicubit */
document.addEventListener("click",e=>{const p=e.target.closest(".planet");if(!p)return;
 p.classList.add("squish");setTimeout(()=>p.classList.remove("squish"),600);
 const r=p.getBoundingClientRect();popAt(r.left+r.width/2,r.top+r.height/2,["🌷","💖","✨","🌸"],8);sfx(880);
 if(!$("#cat").hidden)catSay(rnd(["Aww, planetnya geli!","Hihi, jangan dicubit~","Planetnya blushing. 🌷"]),"laugh")});

/* Kucing penjaga: elus = hati beterbangan */
$("#cat-pet").addEventListener("click",e=>{const r=e.currentTarget.getBoundingClientRect();popAt(r.left+r.width/2,r.top+20,["💖","💗","💕"],5);sfx(760)});

/* Confetti jadi bunga, hati, dan bintang */
function confetti(){if(reduce)return;const box=$("#confetti"),cols=["#F48F9C","#FFE68A","#DCD2FF","#D8EDDB"];
 for(let i=0;i<60;i++){const p=document.createElement(i%3?"i":"b");if(i%3)p.style.background=cols[i%4];else p.textContent=EMJ[i%EMJ.length];
  p.style.cssText+=`left:${Math.random()*100}%;animation-delay:${Math.random()*.8}s;rotate:${Math.random()*90}deg`;box.append(p)}
 setTimeout(()=>box.replaceChildren(),3800)}

/* Cake Lab: harapan wajib disimpan dulu, lalu tiup lilin via mikrofon */
const _cakeSvg=cakeSvg;
cakeSvg=function(t){const n=+CK.tiers,y=[189,163,183][n-1],k="#34334B";
 return _cakeSvg(t)+`<g fill="${k}"><circle cx="139" cy="${y}" r="3"/><circle cx="161" cy="${y}" r="3"/></g><circle cx="129" cy="${y+5}" r="4.5" fill="#F48F9C" opacity=".6"/><circle cx="171" cy="${y+5}" r="4.5" fill="#F48F9C" opacity=".6"/><path d="M146 ${y+3}q4 4.5 8 0" fill="none" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`};
cakeUI();
let birthdayWishSaved=false,micStream=null,micContext=null,micAnalyser=null,micSource=null,micRaf=0,micActive=false,micRequestId=0;
function stopWishMic(message){
 unduckMusic("mic");micRequestId++;if(micRaf)cancelAnimationFrame(micRaf);micRaf=0;micActive=false;
 if(micStream){micStream.getTracks().forEach(track=>track.stop());micStream=null}
 if(micSource){try{micSource.disconnect()}catch{}micSource=null}
 if(micContext&&micContext.state!=="closed"){try{micContext.close().catch(()=>{})}catch{}}micContext=null;micAnalyser=null;
 const stop=$("#mic-stop"),start=$("#mic-start");if(stop)stop.hidden=true;if(start)start.disabled=false;
 if(message&&$("#mic-status"))$("#mic-status").textContent=message;
}
function resetWishFlow(){
 stopWishMic();birthdayWishSaved=false;
 $("#birthday-wish").value="";$("#birthday-wish").removeAttribute("aria-invalid");$("#wish-count").textContent="0/1000 karakter";
 $("#wish-gate").hidden=false;$("#blow-panel").hidden=true;$("#wish-complete").hidden=true;$("#blow-meter-fill").style.width="0%";$("#blow-meter").setAttribute("aria-valuenow","0");
 $("#wish-save-note").textContent="Setelah kamu menekan tombol, harapan akan otomatis diunduh sebagai file catatan (.txt).";
 $("#mic-status").textContent="Harapan tersimpan! Aktifkan mikrofon, lalu tiup ke arahnya. 🌷";
}
$("#birthday-wish").addEventListener("input",e=>{
 const n=e.currentTarget.value.length;$("#wish-count").textContent=`${n}/1000 karakter`;
 if(e.currentTarget.value.trim().length>=3)e.currentTarget.removeAttribute("aria-invalid");
});
function saveBirthdayWish(){
 const field=$("#birthday-wish"),wish=field.value.trim();
 if(wish.length<3){field.setAttribute("aria-invalid","true");$("#wish-save-note").textContent="Harapanmu masih kosong atau terlalu singkat. Tulis minimal 3 karakter dulu ya. 💗";field.focus();return}
 const now=new Date(),date=now.toLocaleString("id-ID"),filename=`harapan-ulang-tahun-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}.txt`;
 const content=`PEONY PLANET — HARAPAN ULANG TAHUN${NAME?" untuk "+NAME:""}\r\nTanggal ditulis: ${date}\r\n\r\nHarapan rahasiaku:\r\n${wish}\r\n\r\nSemoga harapan baik ini menemukan jalannya. Aku akan berusaha pelan-pelan. 🌷\r\n`;
 try{
  const blob=new Blob(["\uFEFF",content],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.style.display="none";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
  birthdayWishSaved=true;field.removeAttribute("aria-invalid");$("#wish-save-note").textContent=`File ${filename} sudah tersimpan di perangkatmu (cek folder Unduhan/Downloads atau aplikasi File). Simpan baik-baik, ya! 💌`;
  $("#wish-gate").hidden=true;$("#blow-panel").hidden=false;$("#mic-status").textContent="Harapanmu sudah tersimpan! Tekan AKTIFKAN MIKROFON, tunggu kalibrasi, lalu tiup. 🌬️";
  if(typeof confetti==="function")confetti();if(typeof sfx==="function")sfx(780);
 }catch(err){$("#wish-save-note").textContent="Browser gagal membuat file otomatis. Coba jalankan website lewat localhost/HTTPS, lalu tekan lagi."}
}
$("#save-wish").addEventListener("click",saveBirthdayWish);
$("#ready").addEventListener("click",()=>{resetWishFlow();$("#wish-gate").hidden=false});
$("#redo").addEventListener("click",()=>{resetWishFlow()});
function finishBlow(source){
 if(!birthdayWishSaved){$("#mic-status").textContent="Tulis dan simpan harapan dulu, baru boleh meniup lilin. 💗";return}
 if(!$("#wish-complete").hidden)return;
 stopWishMic();CK.lit=false;cakeUI();$("#blow-panel").hidden=true;$("#wish-complete").hidden=false;
 $("#wish-complete").setAttribute("data-method",source);
 if(typeof confetti==="function")confetti();if(typeof sfx==="function")sfx(300);if(typeof popAt==="function")popAt(innerWidth/2,innerHeight/2,["💨","✨","🎉","💗","🌷"],12);
 if(typeof catSay==="function")catSay(source==="microphone"?"AKU DENGAR TIUPANNYA! Lilin padam, harapan diamankan. 🥹💗":"Lilin padam! Harapanmu sudah tersimpan, semoga jadi nyata. 🌷","cuddle",6000);
}
$("#blow").addEventListener("click",()=>finishBlow("manual"));
$("#mic-stop").addEventListener("click",()=>stopWishMic("Mikrofon dijeda. Saat siap, aktifkan lagi dan tiup perlahan. 🌷"));
async function startWishMic(){
 if(!birthdayWishSaved){$("#mic-status").textContent="Simpan harapanmu terlebih dahulu, ya. 💗";return}
 if(micActive)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){$("#mic-status").textContent="Browser ini tidak menyediakan akses mikrofon. Buka lewat localhost/HTTPS atau gunakan tombol tiup tanpa mikrofon.";return}
 const requestId=++micRequestId;
 try{
  $("#mic-start").disabled=true;$("#mic-status").textContent="Meminta izin mikrofon... pilih Izinkan pada pop-up browser. 🎙️";
  const grantedStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  if(requestId!==micRequestId){grantedStream.getTracks().forEach(track=>track.stop());return}
  micStream=grantedStream;
  const ACClass=window.AudioContext||window.webkitAudioContext;if(!ACClass)throw new Error("AudioContext tidak tersedia");
  micContext=new ACClass();await micContext.resume();micAnalyser=micContext.createAnalyser();micAnalyser.fftSize=2048;micAnalyser.smoothingTimeConstant=.12;
  micSource=micContext.createMediaStreamSource(micStream);micSource.connect(micAnalyser);micActive=true;duckMusic("mic");$("#mic-stop").hidden=false;
  const samples=new Uint8Array(micAnalyser.fftSize);let started=performance.now(),baseTotal=0,baseCount=0,baseline=.012,blowStarted=0;
  const detect=()=>{
   if(!micActive||!micAnalyser)return;
   micAnalyser.getByteTimeDomainData(samples);let sum=0;for(let i=0;i<samples.length;i++){const v=(samples[i]-128)/128;sum+=v*v}const rms=Math.sqrt(sum/samples.length),elapsed=performance.now()-started;
   const pct=Math.max(0,Math.min(100,Math.round(rms/.16*100)));$("#blow-meter-fill").style.width=pct+"%";$("#blow-meter").setAttribute("aria-valuenow",String(pct));
   if(elapsed<900){baseTotal+=rms;baseCount++;baseline=baseTotal/Math.max(baseCount,1);$("#mic-status").textContent="Mikrofon sedang menyesuaikan suara ruangan... tunggu sebentar ya. 🐣"}
   else{
    const threshold=Math.max(.035,baseline*2.6,baseline+.024);
    if(rms>threshold){if(!blowStarted)blowStarted=performance.now();$("#mic-status").textContent=pct>55?"WAAH, ANGINNYA KENCANG! Terus tiup sedikit lagi! 🌬️":"Terdeteksi tiupan! Tahan sebentar lagi... 💨";
     if(performance.now()-blowStarted>=430){finishBlow("microphone");return}}
    else{blowStarted=0;$("#mic-status").textContent="Sekarang tiup ke arah mikrofon selama sekitar setengah detik. 💨"}
   }
   micRaf=requestAnimationFrame(detect);
  };
  $("#mic-status").textContent="Mikrofon aktif! Kalibrasi sebentar, lalu tiup ke arah mikrofon. 🎙️";micRaf=requestAnimationFrame(detect);
 }catch(err){if(requestId!==micRequestId)return;stopWishMic();const msg=(err&&err.name==="NotAllowedError")?"Izin mikrofon ditolak. Ubah izin situs menjadi Allow, atau gunakan tombol tiup tanpa mikrofon.":"Mikrofon tidak bisa diakses. Coba localhost/HTTPS, cek perangkat mikrofon, atau gunakan tombol tiup tanpa mikrofon.";$("#mic-status").textContent=msg}
}
$("#mic-start").addEventListener("click",startWishMic);
window.addEventListener("pagehide",()=>stopWishMic());
const _goCute=go;go=function(id){if(id!=="cake")stopWishMic();_goCute(id)};

/* Photobooth: stiker tambahan */
$("[data-s=stk]").insertAdjacentHTML("beforeend","<option>🐱</option><option>🍓</option><option>🎀</option>");

/* v12: personalisasi nama (isi OURS.name di js/config.js) */
if(NAME){
 document.title=`Untuk ${NAME} 🌷 Peony Planet`;
 const ip=$("#intro .intro-text p");ip.textContent=ip.textContent.replace("Ya ampun ya ampun!",`Ya ampun ya ampun, ${NAME}!`);
 const cl=$(".closing");cl.textContent=cl.textContent.replace("Happy birthday, manusia favoritku!",`Happy birthday, ${NAME}, manusia favoritku!`);
 const bc=`Happy Birthday ${NAME}!`;if(bc.length<=40){S.cap=bc;$("[data-s=cap]").value=bc;draw()}
 const ct=[`Happy Bday ${NAME}!`,`HBD ${NAME}!`].find(t=>t.length<=18);if(ct){$("#cake-text").value=ct;cakeUI()}
}
