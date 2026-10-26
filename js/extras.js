/* Counter, Memory Match, Surat Rahasia, Kucing Penjaga */
/*PURE-START*/
function ymd(a,b){let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth();if(b.getDate()<a.getDate())m--;if(m<0){y--;m+=12}
 const tm=a.getMonth()+m+y*12,ty=a.getFullYear()+Math.floor(tm/12),mm=tm%12,dim=new Date(ty,mm+1,0).getDate(),anchor=new Date(ty,mm,Math.min(a.getDate(),dim));
 return[y,m,Math.max(0,Math.round((new Date(b.getFullYear(),b.getMonth(),b.getDate())-anchor)/864e5))]}
function daysToNext(s,n){const t=new Date(n.getFullYear(),n.getMonth(),n.getDate());let x=new Date(n.getFullYear(),s.getMonth(),s.getDate());if(x<t)x.setFullYear(x.getFullYear()+1);return Math.round((x-t)/864e5)}
/*PURE-END*/
let mInit=false,mLv=8,mOpen=[],mLock=false,mMoves=0,mFound=0,lOpen=false,lTimer=null,lUnlocked=!OURS.letterCode,voiceMissing=false;

/* Counter hari bersama */
const p2=n=>String(n).padStart(2,"0");
function tick(){const el=$("#cnt"),s=new Date(OURS.since),n=new Date();
 if(isNaN(s)){el.textContent="Atur tanggal di js/config.js";return}
 const ms=n-s;if(ms<0){el.textContent="Belum waktunya, tunggu sebentar lagi ya.";$("#cnt-next").textContent="";return}
 const d=Math.floor(ms/864e5),[y,mo,dd]=ymd(s,n),left=daysToNext(s,n);
 el.innerHTML=`<b class="big">${d.toLocaleString("id-ID")}</b> hari<span>${y} tahun ${mo} bulan ${dd} hari</span><span class="clock">${p2(Math.floor(ms/36e5)%24)}:${p2(Math.floor(ms/6e4)%60)}:${p2(Math.floor(ms/1e3)%60)}</span>`;
 $("#cnt-next").textContent=left===0?"Hari ini hari jadi kita! 🎉":`Hari jadi berikutnya: ${left} hari lagi`}
setInterval(()=>{if(!$("#map").hidden)tick()},1000);tick();

/* Memory Match */
function mStat(){$("#m-stat").textContent=`Langkah: ${mMoves} · Pasangan: ${mFound}/${mLv}`}
function mNew(){const picks=shuf(cards.slice()).slice(0,mLv),deck=shuf([...picks,...picks]);mMoves=0;mFound=0;mOpen=[];mLock=false;
 const g=$("#mgrid");g.dataset.lv=mLv;
 g.innerHTML=deck.map((c,i)=>`<button class="mc" data-n="${c.n}" aria-label="Kartu tertutup"><span class="mf"><span class="mb">🌷</span><span class="mfr">${pim(c)}</span></span></button>`).join("");
 $("#m-win").hidden=true;$("#m-note").hidden=true;mStat()}
$("#mgrid").onclick=e=>{const b=e.target.closest(".mc");if(!b||mLock||b.classList.contains("up"))return;
 const c=cards[+b.dataset.n-1];b.classList.add("up");b.setAttribute("aria-label","Kartu terbuka: "+(c.caption||num(c)));mOpen.push(b);if(mOpen.length<2)return;
 mMoves++;const[a,d]=mOpen;mOpen=[];
 if(a.dataset.n===d.dataset.n){a.classList.add("ok");d.classList.add("ok");a.disabled=d.disabled=true;mFound++;
  $("#m-note").textContent=c.caption||BACKS[c.n%BACKS.length];$("#m-note").hidden=false;mStat();
  if(mFound===mLv){$("#m-win-t").textContent=`Selesai dalam ${mMoves} langkah. ${mMoves<=mLv+3?"Ingatanmu luar biasa!":"Pelan-pelan juga tetap menang."}`;$("#m-win").hidden=false;confetti();catSay("Hebat! Kamu menang!","proud")}}
 else{mLock=true;mStat();setTimeout(()=>{[a,d].forEach(x=>{x.classList.remove("up");x.setAttribute("aria-label","Kartu tertutup")});mLock=false},reduce?300:850)}};
$$("[data-lv]").forEach(b=>b.onclick=()=>{mLv=+b.dataset.lv;$$("[data-lv]").forEach(x=>x.setAttribute("aria-pressed",x===b));mNew()});
$("#m-new").onclick=mNew;$("#m-again").onclick=mNew;

/* Surat Rahasia */
const lFull=fillName(OURS.letter.join("\n\n")),lSign=fillName(OURS.sign);$("#l-full").textContent=lFull+" "+lSign;
function lReset(){clearInterval(lTimer);lOpen=false;const env=$("#env");env.classList.remove("open");env.disabled=false;
 $("#paper").hidden=true;$("#l-text").textContent="";$("#l-skip").hidden=false;$("#l-again").hidden=true;$("#voice-note").hidden=true;
 const audio=$("#letter-audio");try{audio.pause();audio.currentTime=0}catch{}
 $("#l-lock").hidden=lUnlocked;$("#env-wrap").hidden=!lUnlocked;$("#l-hint").textContent=OURS.letterHint||"";$("#l-err").textContent=""}
function lFin(){clearInterval(lTimer);$("#l-text").textContent=lFull;$("#l-sign").textContent=lSign;$("#l-skip").hidden=true;$("#l-again").hidden=false;$("#voice-note").hidden=voiceMissing;confetti()}
$("#l-open").onclick=()=>{if($("#l-code").value.trim().toLowerCase()===String(OURS.letterCode).toLowerCase()){lUnlocked=true;lReset()}else{$("#l-err").textContent="Kodenya belum pas, coba lagi ya.";restart($("#l-lock"),"shake")}};
$("#l-code").onkeydown=e=>{if(e.key==="Enter")$("#l-open").click()};
$("#env").onclick=()=>{if(lOpen)return;lOpen=true;const env=$("#env");env.classList.add("open");env.disabled=true;
 setTimeout(()=>{$("#paper").hidden=false;$("#l-sign").textContent="";if(reduce)return lFin();let i=0;lTimer=setInterval(()=>{$("#l-text").textContent=lFull.slice(0,++i);if(i>=lFull.length)lFin()},32)},reduce?0:700)};
$("#l-skip").onclick=lFin;$("#l-again").onclick=lReset;
/* Voice note: kotak disembunyikan kalau file-nya tidak ada (pengunjung tidak melihat pesan teknis). Lagu latar dijeda selama voice note main. */
const VA=$("#letter-audio");
function voiceGone(){voiceMissing=true;$("#voice-note").hidden=true;console.info("[Peony] assets/audio/voice-note.mp3 tidak ditemukan, kotak voice note disembunyikan sampai file ditambahkan.")}
VA.querySelector("source").addEventListener("error",voiceGone);
VA.addEventListener("loadedmetadata",()=>{voiceMissing=false;$("#voice-note-help").textContent='🎧 Rekaman sudah siap. Tekan play, lalu dengarkan sampai selesai ya. 💗'});
VA.addEventListener("play",()=>duckMusic("voice"));
["pause","ended"].forEach(ev=>VA.addEventListener(ev,()=>unduckMusic("voice")));
VA.load();  /* cek lebih awal supaya kotak tidak muncul lalu hilang */

/* Kucing penjaga planet */
const catEl=$("#cat"),catImg=$("#cat-img"),catBub=$("#cat-say"),CG=n=>`assets/gif/wish-${n}.gif`;let catT,idleT,catClicks=0,fish=0;
const PAGE={map:["Selamat datang! Aku kucing penjaga planet.","cuddle"],vault:["Foto mana yang paling kamu suka?","happy"],machine:["Pencet terus, mesinnya sayang kamu.","laugh"],clouds:["Pilih awan sesuai suasana hatimu, ya.","miss"],cake:["Boleh aku minta sepotong?","hungry"],report:["Nilainya sempurna. Aku yang menilai.","proud"],booth:["Senyum! Aku ikut masuk frame.","happy"],match:["Cari pasangannya, jangan lama-lama!","cheer"],letter:["Pssst... ada surat buat kamu.","miss"]};
const PET=["Purr... lagi dong.","Eh, geli! Tapi enak.","Kamu baik banget, ya.","Meong~ terima kasih!","Satu elusan lagi, janji yang terakhir. (bohong)","Hatiku meleleh jadi puding. 🍮","Tangan kamu ajaib, tahu!"];
function catSay(t,g,ms=3800){clearTimeout(catT);clearTimeout(idleT);catBub.textContent=t;catBub.hidden=false;if(g)catImg.src=CG(g);catT=setTimeout(()=>catBub.hidden=true,ms);idleT=setTimeout(()=>catImg.src=CG("sleepy"),ms+6000)}
function meow(){try{const A=new(window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain(),t=A.currentTime;o.type="triangle";o.frequency.setValueAtTime(500,t);o.frequency.linearRampToValueAtTime(900,t+.15);o.frequency.linearRampToValueAtTime(450,t+.5);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.55);o.connect(g);g.connect(A.destination);o.start();o.stop(t+.6)}catch{}}
$("#cat-pet").onclick=()=>{catClicks++;if(catClicks%5===0){meow();catSay("MEOW! Kamu menemukan rahasiaku.","laugh")}else catSay(PET[catClicks%PET.length],"cuddle")};
$("#cat-fish").onclick=()=>{fish++;fish%5===0?catSay("Kenyang... zzz","sleepy"):catSay(`Nyam nyam! (ikan ke-${fish})`,"happy")};
function catPage(id){catEl.hidden=id==="intro";if(PAGE[id])catSay(PAGE[id][0],PAGE[id][1])}

/* Kaitkan ke navigasi */
const _go=go;go=function(id){_go(id);if(id==="match"&&!mInit){mInit=true;mNew()}if(id==="letter")lReset();else clearInterval(lTimer);if(id==="map")tick();catPage(id)};
go(IDS.includes(location.hash.slice(1))?location.hash.slice(1):"intro");
