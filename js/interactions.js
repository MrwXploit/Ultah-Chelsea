const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* Ambil item acak tanpa mengulang yang sama selama masih ada pilihan lain */
const picker=n=>{let bag=[],last=-1;return()=>{if(!bag.length){bag=[...Array(n).keys()].filter(i=>n===1||i!==last);for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}}return last=bag.pop()}};
const restart=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
/* Penyimpanan ringan di browser (progres + jar favorit). Buka index.html?reset untuk mulai dari awal. */
const store={get(k,d){try{const v=localStorage.getItem("peony."+k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem("peony."+k,JSON.stringify(v))}catch{}},clear(){try{Object.keys(localStorage).filter(k=>k.startsWith("peony.")).forEach(k=>localStorage.removeItem(k))}catch{}}};
if(/[?&]reset\b/.test(location.search)){store.clear();history.replaceState(null,"",location.pathname+location.hash)}

/* Compliment-O-Matic — 40 pesan dalam 5 rasa pujian */
const COMPLIMENTS=[
 {type:"cute",icon:"🐰",text:"Kamu bilang kamu biasa aja, tapi tiap kamu senyum, aku langsung lupa tadi mau ngomong apa."},
 {type:"cute",icon:"🎀",text:"Jujur ya, kamu tuh gemesin banget. Apalagi pas lagi manyun, aku sampai nggak tahu harus ngapain."},
 {type:"cute",icon:"🍓",text:"Pipimu pasti lagi merah sekarang. Tenang, aku nggak bakal bilang siapa-siapa."},
 {type:"cute",icon:"🌷",text:"Ada orang yang bikin suasana jadi hangat cuma karena dia ada di situ. Kamu salah satunya."},
 {type:"cute",icon:"🧸",text:"Pengin banget nyubit pipimu, tapi juga pengin jagain kamu baik-baik. Dua-duanya sekaligus, repot ya aku."},
 {type:"cute",icon:"🐱",text:"Kucing penjaga barusan ngeliatin kamu lama banget terus mengeong. Kayaknya artinya: lucu banget orang ini."},
 {type:"cute",icon:"✨",text:"Rambut acak-acakan, muka cemberut, tetap aja lucu. Aku nggak ngerti gimana kamu bisa begitu."},
 {type:"cute",icon:"🫧",text:"Anehnya, tiap lihat kamu ketawa, aku ikut senyum tanpa sadar. Kamu pakai pelet apa sih?"},
 {type:"love",icon:"💌",text:"Kalau harimu panjang banget, semoga kamu ingat ada aku di sini yang selalu senang dengar ceritamu."},
 {type:"love",icon:"💗",text:"Kamu nggak harus selalu rapi atau kuat di depanku. Kamu yang apa adanya itu yang aku suka."},
 {type:"love",icon:"🌙",text:"Kangen itu aneh ya. Lagi nggak ngapa-ngapain pun tiba-tiba kepikiran kamu. Nanti pas ketemu, aku minta peluk dulu."},
 {type:"love",icon:"🧃",text:"Notif dari kamu tuh beda. Belum sempat kubuka, aku udah senyum duluan."},
 {type:"love",icon:"🪐",text:"Dari semua orang yang kukenal, ngobrol sama kamu yang paling bikin betah. Sampai lupa waktu malah."},
 {type:"love",icon:"💐",text:"Aku suka hal-hal kecil dari kamu yang mungkin kamu sendiri nggak sadar. Semuanya aku simpan baik-baik di kepala."},
 {type:"love",icon:"🫶",text:"Kalau di luar lagi berisik dan bikin capek, mampir aja ke aku. Di sini kamu nggak perlu jadi siapa-siapa."},
 {type:"love",icon:"🍰",text:"Kenal kamu itu salah satu hal yang paling aku syukuri loh selama ini. Serius, bukan gombal. Eh, mungkin dikit."},
 {type:"proud",icon:"👑",text:"Aku bangga sama kamu. Bukan cuma pas kamu berhasil, tapi juga pas kamu lagi capek dan masih mau nyoba."},
 {type:"proud",icon:"🏆",text:"Mungkin belum sampai, tapi coba lihat ke belakang deh. Kamu udah jauh banget dari awal, dan itu juga pencapaian."},
 {type:"proud",icon:"🌱",text:"Pelan-pelan juga nggak apa-apa. Nggak semua yang lagi tumbuh kelihatan hasilnya hari ini."},
 {type:"proud",icon:"💪",text:"Aku tahu kamu belum selalu merasa kuat. Tapi aku lihat kok usahamu, dan itu nggak kecil."},
 {type:"proud",icon:"⭐",text:"Bangga sama orang pas semuanya lancar itu gampang. Aku justru paling bangga sama caramu bertahan pas lagi nggak lancar."},
 {type:"proud",icon:"📣",text:"Catat ya: usaha kecilmu tetap dihitung. Hasilnya mungkin belum kelihatan, tapi usahamu nyata."},
 {type:"proud",icon:"🪄",text:"Kamu mau belajar, mau nyoba lagi, mau memperbaiki diri. Nggak semua orang mau begitu, lho."},
 {type:"proud",icon:"🎖️",text:"Hari ini kamu udah sampai sejauh ini, dan itu cukup. Sekarang makan yang enak dulu ya."},
 {type:"comfort",icon:"🧸",text:"Istirahat dulu ya. Semuanya nggak harus selesai hari ini kok. Rebahan aja dulu."},
 {type:"comfort",icon:"☁️",text:"Kalau hari ini berantakan, nggak apa-apa. Nggak semua hari harus dimenangkan, kadang cukup dilewati aja."},
 {type:"comfort",icon:"🫂",text:"Peluk dari jauh ya, yang erat banget. Kamu nggak perlu jelasin apa-apa kalau belum mau."},
 {type:"comfort",icon:"🍵",text:"Minum air dulu, terus tarik napas pelan-pelan. Kamu juga berhak dirawat, termasuk sama dirimu sendiri."},
 {type:"comfort",icon:"🌧️",text:"Kamu boleh sedih, nggak harus langsung kelihatan kuat. Perasaanmu nggak harus beres dalam semalam."},
 {type:"comfort",icon:"🪷",text:"Aku sayang kamu pas kamu lagi produktif, dan tetap sayang pas energimu cuma cukup buat bertahan."},
 {type:"comfort",icon:"💛",text:"Aku tahu belakangan ini berat buat kamu. Nggak perlu cerita sekarang. Kapan pun kamu siap, aku di sini."},
 {type:"comfort",icon:"🛏️",text:"Ini izin istirahat resmi dari Kucing HR. Berlaku hari ini, tanpa rasa bersalah."},
 {type:"silly",icon:"🚨",text:"Peringatan: jangan lihat cermin kelamaan hari ini. Nanti kamu jatuh cinta sama diri sendiri, aku kalah saing."},
 {type:"silly",icon:"🧪",text:"Hasil lab keluar: kamu 99% manusia, 1% peri peony. Efek sampingnya bikin kangen, dan belum ada obatnya."},
 {type:"silly",icon:"🍜",text:"Kalau kamu mi ayam, aku udah jadi langganan tetap. Hafal jam bukanya, hafal abangnya, hafal kucing yang tidur di depan warung."},
 {type:"silly",icon:"📡",text:"Aku tebak, sekarang kamu lagi baca ini sambil senyum-senyum sendiri. Ketahuan deh."},
 {type:"silly",icon:"🛸",text:"Alien nanya ke aku, resep jadi segemas kamu itu apa. Aku jawab nggak tahu, kayaknya bawaan lahir."},
 {type:"silly",icon:"🍮",text:"Kalau lagi ngambek, kamu kayak puding yang digoyang: goyang dikit, tapi tetap manis. Aku tungguin sampai tenang."},
 {type:"silly",icon:"📈",text:"Tingkat gemasmu hari ini naik lagi. Jujur aku udah nggak tahu harus gimana, grafiknya sampai keluar kertas."},
 {type:"silly",icon:"🐣",text:"Kamu boleh merasa biasa aja. Tapi aku udah tanya kucing-kucing sekitar sini (sampel: satu ekor), jawabannya kamu luar biasa."}
];
COMPLIMENTS.forEach(c=>c.text=fillName(c.text));
const COMPLIMENT_KIND={all:"🎁 SEMUA RASA",cute:"🐰 GEMAS",love:"💌 BUCIN",proud:"👑 BANGGA",comfort:"🧸 PELUK DULU",silly:"🍓 ABSURD"};
let complimentFilter="all",currentCompliment=null,complimentCounter=0,favoriteCompliments=store.get("fav",[]).map(t=>COMPLIMENTS.find(c=>c.text===t)).filter(Boolean);
const catSayings=["🐾 Disahkan Kucing HR: pujian ini akurat secara gemas.","📡 Radar pipi merah mendeteksi peningkatan 23%.","🌷 Satu bunga peony mekar demi kalimat ini.","🧾 Nota resmi: kamu baru saja menerima dosis sayang.","🐱 Kucing operator minta bonus karena kamu terlalu lucu.","✨ Mesin bekerja keras, kamu tinggal menerima pujian."];
function setCompliment(c,fromFavorite=false){
 currentCompliment=c;complimentCounter++;
 const screen=$("#screen");screen.textContent=c.text;restart($("#machine-box"),"shake");restart($("#compliment-card"),"compliment-pop");restart(screen,"pop");
 $("#compliment-emoji").textContent=c.icon;$("#compliment-kicker").textContent=fromFavorite?"DARI JAR FAVORITMU 💖":"PESAN SPESIAL BUAT KAMU";
 $("#compliment-type").textContent=COMPLIMENT_KIND[c.type]||"💗 PUJIAN";$("#compliment-number").textContent=`KARTU KE-${String(complimentCounter).padStart(2,"0")}`;
 const level=72+Math.floor(Math.random()*29);$("#love-meter-value").textContent=level+"%";$("#love-meter-fill").style.width=level+"%";$(".love-meter").setAttribute("aria-valuenow",level);
 $("#machine-note").textContent=catSayings[Math.floor(Math.random()*catSayings.length)];
 $("#save-compliment").disabled=false;$("#copy-compliment").disabled=false;updateSaveButton();
 if(typeof sfx==="function")sfx(760);if(typeof popAt==="function"){const r=$("#compliment-emoji").getBoundingClientRect();popAt(r.left+r.width/2,r.top+r.height/2,[c.icon,"💖","✨","🌷"],7)}
}
function updateSaveButton(){const saved=currentCompliment&&favoriteCompliments.some(c=>c.text===currentCompliment.text);$("#save-compliment").textContent=saved?"💖 TERSIMPAN":"♡ SIMPAN FAVORIT";$("#save-compliment").setAttribute("aria-pressed",!!saved)}
function renderComplimentFavorites(){store.set("fav",favoriteCompliments.map(c=>c.text));const box=$("#compliment-favorites");$("#favorite-count").textContent=`${favoriteCompliments.length} kartu`;$("#clear-favorites").hidden=!favoriteCompliments.length;
 if(!favoriteCompliments.length){box.innerHTML='<p class="favorite-empty">Masih kosong! Cari pujian yang bikin kamu bilang “ih apasihhh” dulu. 🥹</p>';return}
 box.replaceChildren();favoriteCompliments.forEach((c,i)=>{const b=document.createElement("button");b.className="favorite-card";b.type="button";b.dataset.favIndex=String(i);const em=document.createElement("span");em.className="favorite-card-icon";em.textContent=c.icon;const tx=document.createElement("span");tx.className="favorite-card-text";tx.textContent=c.text;const tag=document.createElement("small");tag.textContent=COMPLIMENT_KIND[c.type]||"PUJIAN";b.append(em,tx,tag);box.append(b)})}
const nextC=()=>{let pool=COMPLIMENTS.filter(c=>complimentFilter==="all"||c.type===complimentFilter);if(currentCompliment&&pool.length>1)pool=pool.filter(c=>c.text!==currentCompliment.text);return pool[Math.floor(Math.random()*pool.length)]};
$("#tell").onclick=()=>setCompliment(nextC());
$("#compliment-moods").addEventListener("click",e=>{const b=e.target.closest("[data-compliment]");if(!b)return;complimentFilter=b.dataset.compliment;$$('#compliment-moods [data-compliment]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));$("#machine-note").textContent=`Mode ${COMPLIMENT_KIND[complimentFilter]} aktif. Silakan menerima pujian dengan elegan (atau salting).`;if(currentCompliment&&complimentFilter!=="all"&&currentCompliment.type!==complimentFilter){currentCompliment=null;$("#screen").textContent="Mode baru siap! Pencet tombol buat buka pujian berikutnya. 🎀";$("#compliment-emoji").textContent="💌";$("#compliment-type").textContent=COMPLIMENT_KIND[complimentFilter];$("#compliment-number").textContent="menunggu kartu baru";$("#save-compliment").disabled=true;$("#copy-compliment").disabled=true;updateSaveButton()}});
$("#save-compliment").onclick=()=>{if(!currentCompliment)return;const i=favoriteCompliments.findIndex(c=>c.text===currentCompliment.text);if(i>=0)favoriteCompliments.splice(i,1);else favoriteCompliments.unshift(currentCompliment);renderComplimentFavorites();updateSaveButton();$("#machine-note").textContent=i>=0?"Dihapus dari jar. Tapi pujiannya tetap benar, ya. 💗":"Masuk jar favorit! Satu pujian berhasil diamankan dari kelupaan. 🫙💖"};
$("#compliment-favorites").onclick=e=>{const b=e.target.closest("[data-fav-index]");if(!b)return;const c=favoriteCompliments[+b.dataset.favIndex];if(c)setCompliment(c,true)};
$("#clear-favorites").onclick=()=>{favoriteCompliments=[];renderComplimentFavorites();updateSaveButton();$("#machine-note").textContent="Jar sudah bersih. Nggak apa-apa, kita isi lagi nanti dengan pujian baru. 🌷"};
function fallbackCopy(text){const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand("copy")}catch{}ta.remove();return ok}
$("#copy-compliment").onclick=async()=>{if(!currentCompliment)return;let ok=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(currentCompliment.text);ok=true}else ok=fallbackCopy(currentCompliment.text)}catch{ok=fallbackCopy(currentCompliment.text)}$("#machine-note").textContent=ok?"Tersalin! Boleh dikirim ke diri sendiri buat dibaca ulang. 📋💗":"Browser belum mengizinkan salin otomatis. Pilih teks pujiannya untuk menyalin manual."};
renderComplimentFavorites();

/* Cloud of Wishes — edit label/pesan di sini. k = nama file GIF (assets/gif/wish-<k>.gif), em = emoji yang meletup saat diklik */
const CLOUDS=[
{k:"sleepy",em:"💤",label:"Lagi capek...",msgs:["Hei, istirahat sebentar, ya. Kamu nggak harus menaklukkan seluruh dunia hari ini. Peony Planet saja hari ini masih rebahan.","Taruh dulu semuanya. Minum air, tarik napas, dan biarkan hari ini selesai sepelan yang dia mau."]},
{k:"happy",em:"🎉",label:"Hari ini harus bahagia!",msgs:["Semoga hari ini penuh hal kecil yang bikin kamu ketawa, dan makanannya enak semua. Ini perintah resmi planet.","Energi positif sedang dikirim. Kalau ada yang mengganggu, peony kami siap berjaga."]},
{k:"cuddle",em:"💖",label:"Pengen dimanjain.",msgs:["Pelukan virtual terkirim, versi erat. Kamu pantas dimanjakan, dan aku di sini buat itu.","Hari ini kamu boleh minta apa saja yang kecil dan manis. Es krim termasuk prioritas planet."]},
{k:"cheer",em:"⭐",label:"Butuh semangat.",msgs:["Kamu sudah melewati banyak hari sulit, dan kamu masih di sini. Satu langkah dulu, yang lain nanti.","Kamu mampu, pelan-pelan juga nggak apa-apa. Peony pun mekar nggak dalam semalam."]},
{k:"sad",em:"💧",label:"Lagi sedih.",msgs:["Boleh sedih, kok. Kamu nggak harus langsung baik-baik saja. Peony Planet punya ruang kosong buat kamu menangis sebentar.","Apa pun yang bikin berat hari ini, kamu nggak harus menanggungnya sendirian. Cerita ke aku kapan saja, ya."]},
{k:"angry",em:"💢",label:"Lagi kesel!",msgs:["Kesel itu valid. Keluarin dulu semuanya, aku dengerin sampai habis tanpa menyela.","Minum air dulu, lalu cerita pelan-pelan. Siapa pun yang bikin kamu kesel, planet ini ada di pihakmu."]},
{k:"miss",em:"💌",label:"Lagi kangen.",msgs:["Kangen itu tanda ada yang berharga. Anggap pesan ini pelukan dari jauh, estimasi tiba: sekarang.","Aku juga lagi mikirin kamu. Kita ketemu secepatnya, ya, dan nanti ada banyak cerita buat dibagi."]},
{k:"think",em:"💭",label:"Overthinking nih.",msgs:["Pikiranmu lagi ramai, ya? Tulis satu hal yang paling bikin kepikiran, sisanya titip dulu di awan ini.","Nggak semua hal harus dipecahin malam ini. Kadang jawabannya muncul setelah kamu istirahat."]},
{k:"nervous",em:"😅",label:"Lagi gugup.",msgs:["Gugup itu tanda kamu peduli sama hasilnya. Tarik napas pelan, kamu sudah lebih siap dari yang kamu kira.","Satu langkah kecil dulu. Aku percaya kamu bisa, dan kalau belum sempurna pun, kamu tetap hebat."]},
{k:"hungry",em:"🐟",label:"Lagi lapar.",msgs:["Misi darurat: isi perut dulu. Pilih yang paling enak, bukan yang paling praktis. Kucing aja nggak pernah telat makan, masa kamu telat.","Lapar itu bukan hal sepele. Makan dulu, baru taklukkan dunia."]},
{k:"proud",em:"👑",label:"Bangga sama diri sendiri!",msgs:["Berhenti sebentar dan lihat sejauh apa kamu sudah melangkah. Kamu pantas bangga, dan aku bangga sama kamu.","Mahkota resmi diberikan. Hasil kerja kerasmu nyata, dan nggak ada yang boleh mengecilkannya."]},
{k:"laugh",em:"😂",label:"Pengen ketawa.",msgs:["Ketawa dulu yang kenceng, nggak usah ditahan. Dunia terasa lebih ringan sehabis ketawa.","Fun fact: tawamu salah satu hal favorit planet ini. Ayo cari alasan buat ketawa bareng."]}];
CLOUDS.forEach(c=>c.msgs=c.msgs.map(fillName));
const BG=["#DCD2FF","#FFE68A","#F48F9C","#D8EDDB"],cp=CLOUDS.map(c=>picker(c.msgs.length));let gifN=0;
$("#cloud-grid").innerHTML=CLOUDS.map((c,i)=>`<button class="cloud" data-c="${i}" style="background:${BG[i%4]}">${c.em} ${esc(c.label)}</button>`).join("");
function burst(em){if(reduce)return;const w=$("#wish");for(let k=0;k<10;k++){const s=document.createElement("span");s.className="bst";s.textContent=em;const a=k/10*6.283;s.style.cssText=`--dx:${Math.cos(a)*120}px;--dy:${Math.sin(a)*90-20}px;left:50%;top:90px`;w.append(s);setTimeout(()=>s.remove(),1000)}}
$("#cloud-grid").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;const i=+b.dataset.c,c=CLOUDS[i],g=$("#wish-gif");
 $("#wish-title").textContent=c.label;$("#wish-text").textContent=c.msgs[cp[i]()];
 g.hidden=false;g.onerror=()=>g.hidden=true;g.alt="Kucing: "+c.label;g.src=`assets/gif/wish-${c.k}.gif?${++gifN}`;restart(g,"cat-in");
 $("#cloud-grid").hidden=true;$("#wish").hidden=false;restart($("#wish"),"puff");burst(c.em);$("#wish-again").focus()};
$("#wish-again").onclick=()=>{$("#wish").hidden=true;$("#cloud-grid").hidden=false};

/* Cake Lab */
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/*CAKE-START*/
const SP={vanilla:"#FFE68A",choco:"#9A6B52",strawberry:"#F9B5BF",matcha:"#BFDDA8",taro:"#CBB8F0"},FR={pink:"#F48F9C",lilac:"#DCD2FF",cream:"#FFFDF5",mint:"#BFE8D2",choco:"#7A4B3A",butter:"#FFD966"};
const OPT={tiers:["Tingkat",{1:"1",2:"2",3:"3"}],sponge:["Rasa kue",{vanilla:"Vanilla",choco:"Choco",strawberry:"Stroberi",matcha:"Matcha",taro:"Taro"}],frost:["Frosting",{pink:"Peony Pink",lilac:"Lilac",cream:"Cream",mint:"Mint",choco:"Coklat",butter:"Butter"}],style:["Gaya frosting",{wave:"Gelombang",drip:"Meleleh",smooth:"Halus"}],candles:["Lilin",{1:"1",3:"3",5:"5"}]};
const TOPS={peony:"🌷 Peony",star:"⭐ Bintang",heart:"💖 Hati",berry:"🍓 Stroberi",cat:"🐱 Kucing",sprinkle:"✨ Taburan"};
const CK={tiers:2,sponge:"vanilla",frost:"pink",style:"wave",candles:3,tops:new Set(["peony"]),lit:false};
function cakeSvg(text){
 const n=+CK.tiers,Ws=[[200],[210,150],[220,160,110]][n-1],H=[96,66,54][n-1],yb=250,cx=150,sp=SP[CK.sponge],fr=FR[CK.frost],ink="#34334B";
 const two=f=>f(`fill="${ink}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"`)+f(`fill="${fr}" stroke="${fr}" stroke-width="1"`);
 let o=`<ellipse cx="150" cy="${yb+14}" rx="134" ry="12" fill="#DCD2FF" stroke="${ink}" stroke-width="4"/><ellipse cx="150" cy="${yb+8}" rx="124" ry="8" fill="#fff" stroke="${ink}" stroke-width="3"/>`;
 for(let i=0;i<n;i++){
  const w=Ws[i],x=cx-w/2,top=yb-(i+1)*H;
  o+=`<rect x="${x}" y="${top}" width="${w}" height="${H}" rx="12" fill="${sp}" stroke="${ink}" stroke-width="4"/><rect x="${x+5}" y="${top+H*.58}" width="${w-10}" height="6" rx="3" fill="#FFF6D9" opacity=".85"/>`;
  if(CK.style==="smooth")o+=two(a=>`<rect x="${x-3}" y="${top+2}" width="${w+6}" height="16" rx="8" ${a}/>`);
  else if(CK.style==="drip"){const m=Math.round(w/24);o+=two(a=>`<rect x="${x-3}" y="${top+2}" width="${w+6}" height="16" rx="8" ${a}/>`+Array.from({length:m},(_,k)=>`<rect x="${x+(k+.5)*w/m-6}" y="${top+10}" width="12" height="${Math.min([14,30,18,38,22][(k+i)%5]+8,H-16)}" rx="6" ${a}/>`).join(""))}
  else{const m=Math.round(w/28),sw=w/m;let d=`M${x-3} ${top+2}L${x+w+3} ${top+2}L${x+w+3} ${top+16}L${x+w} ${top+16}`;for(let k=m-1;k>=0;k--)d+=`Q${x+(k+.5)*sw} ${top+32} ${x+k*sw} ${top+16}`;d+=`L${x-3} ${top+16}Z`;o+=two(a=>`<path d="${d}" ${a}/>`)}
  if(CK.tops.has("sprinkle"))for(let k=0;k<w/12;k++){const sx=x+6+(k*37)%(w-14),sy=top+6+(k*13)%9;o+=`<rect x="${sx}" y="${sy}" width="6" height="3" rx="1.5" fill="${["#F48F9C","#FFE68A","#9AD0F5","#7BC47F","#fff"][k%5]}" transform="rotate(${(k*47)%180} ${sx+3} ${sy+1.5})"/>`}
 }
 const t=(text||"").trim();
 if(t){const cy=yb-(H-16)/2,rw=Math.min(Ws[0]-16,t.length*9+24);o+=`<rect x="${cx-rw/2}" y="${cy-12}" width="${rw}" height="24" rx="12" fill="#fff" stroke="${ink}" stroke-width="3"/><text x="${cx}" y="${cy+5}" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" font-size="14" fill="${ink}">${esc(t)}</text>`}
 const ty=yb-n*H,tw=Ws[n-1],c=CK.candles,cols=["#DCD2FF","#D8EDDB","#FFE68A","#F9B5BF","#9AD0F5"];
 for(let k=0;k<c;k++){const px=c===1?cx:cx+(k-(c-1)/2)*(c===3?tw*.28:tw*.2);o+=`<rect x="${px-4}" y="${ty-46}" width="8" height="50" rx="3" fill="${cols[k%5]}" stroke="${ink}" stroke-width="3"/>`+(CK.lit?`<path class="fl" d="M${px} ${ty-68}q-8 9 0 17q8-8 0-17z" fill="#F48F9C" stroke="${ink}" stroke-width="2"/>`:"")}
 const TP={
  peony:px=>`<use href="#peony" x="${px-20}" y="${ty-32}" width="40" height="40"/>`,
  star:px=>`<use href="#star" x="${px-18}" y="${ty-32}" width="36" height="36"/>`,
  heart:px=>`<path d="M${px} ${ty+2}c-20-14-24-26-12-32 7-3 12 1 12 6 0-5 5-9 12-6 12 6 8 18-12 32z" fill="#F48F9C" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`,
  berry:px=>`<ellipse cx="${px}" cy="${ty-11}" rx="13" ry="15" fill="#F0506E" stroke="${ink}" stroke-width="3"/><path d="M${px-9} ${ty-24}q9-9 18 0q-9 5-18 0z" fill="#7BC47F" stroke="${ink}" stroke-width="2"/><circle cx="${px-5}" cy="${ty-9}" r="1.5" fill="#FFE68A"/><circle cx="${px+4}" cy="${ty-14}" r="1.5" fill="#FFE68A"/><circle cx="${px+3}" cy="${ty-4}" r="1.5" fill="#FFE68A"/>`,
  cat:px=>`<path d="M${px-15} ${ty-24}L${px-13} ${ty-44}L${px-2} ${ty-32}ZM${px+15} ${ty-24}L${px+13} ${ty-44}L${px+2} ${ty-32}Z" fill="#FAC27E" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="${px}" cy="${ty-14}" r="17" fill="#FAC27E" stroke="${ink}" stroke-width="3"/><circle cx="${px-6}" cy="${ty-16}" r="2.4" fill="${ink}"/><circle cx="${px+6}" cy="${ty-16}" r="2.4" fill="${ink}"/><path d="M${px-2} ${ty-11}h4l-2 3z" fill="#F48F9C"/>`};
 const ts=Object.keys(TP).filter(k=>CK.tops.has(k)),gap=Math.min(52,(tw-30)/Math.max(ts.length,1));
 ts.forEach((k,j)=>{o+=TP[k](cx+(j-(ts.length-1)/2)*gap)});
 return o}
/*CAKE-END*/
const rnd=a=>a[Math.floor(Math.random()*a.length)];
$("#cake-chips").innerHTML=Object.entries(OPT).map(([k,[l,o]])=>`<p class="fr">${l}</p><div class="row">${Object.entries(o).map(([v,t])=>`<button class="chip" data-ck="${k}:${v}">${t}</button>`).join("")}</div>`).join("")+`<p class="fr">Topping (boleh banyak)</p><div class="row">${Object.entries(TOPS).map(([v,t])=>`<button class="chip" data-top="${v}">${t}</button>`).join("")}</div>`;
function cakeUI(){$$("#cake-chips [data-ck]").forEach(b=>{const[k,v]=b.dataset.ck.split(":");b.setAttribute("aria-pressed",String(CK[k])===v)});
 $$("#cake-chips [data-top]").forEach(b=>b.setAttribute("aria-pressed",CK.tops.has(b.dataset.top)));
 $("#cake-art").innerHTML=cakeSvg($("#cake-text").value)}
function unlit(){CK.lit=false;$("#done").hidden=true;$("#ready").hidden=false}
$("#cake-chips").onclick=e=>{const b=e.target.closest("button");if(!b)return;
 if(b.dataset.ck){const[k,v]=b.dataset.ck.split(":");CK[k]=isNaN(v)?v:+v}else{const t=b.dataset.top;CK.tops.has(t)?CK.tops.delete(t):CK.tops.add(t)}unlit();cakeUI()};
$("#cake-text").oninput=cakeUI;
$("#dice").onclick=()=>{Object.assign(CK,{tiers:rnd([1,2,3]),sponge:rnd(Object.keys(SP)),frost:rnd(Object.keys(FR)),style:rnd(["wave","drip","smooth"]),candles:rnd([1,3,5]),tops:new Set(shuf(Object.keys(TOPS)).slice(0,1+Math.floor(Math.random()*3)))});unlit();cakeUI()};
function confetti(){if(reduce)return;const box=$("#confetti"),cols=["#F48F9C","#FFE68A","#DCD2FF","#D8EDDB"];
 for(let i=0;i<40;i++){const p=document.createElement("i");p.style.cssText=`left:${Math.random()*100}%;background:${cols[i%4]};animation-delay:${Math.random()*.6}s;rotate:${Math.random()*90}deg`;box.append(p)}
 setTimeout(()=>box.replaceChildren(),3300)}
$("#ready").onclick=()=>{CK.lit=true;cakeUI();$("#ready").hidden=true;$("#done").hidden=false;confetti()};
$("#redo").onclick=()=>{unlit();cakeUI();$("#ready").focus()};
cakeUI();
