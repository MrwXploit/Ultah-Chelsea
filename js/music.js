/* Daftar lagu: taruh file (mp3/wav/ogg) di assets/audio/, lalu tambahkan barisnya di sini. */
const SONGS=[
 {title:"Just The Way You Are - Bruno Mars",src:"assets/audio/Bruno Mars - Just The Way You Are.mp3"},
 {title:"Perfect - Ed Sheeran",src:"assets/audio/Ed Sheeran - Perfect.mp3"},
 {title:"Ed Sheeran – Thinking Out Loud",src:"assets/audio/Ed Sheeran – Thinking Out Loud.mp3"},
 {title:"The Weekend - True Colors",src:"assets/audio/The Weeknd - True Colors.mp3"},
 // ,{title:"Judul lagu kalian",src:"assets/audio/lagu-kita.mp3"}
];
const au=$("#song"),mp=$("#m-play");let mi=0,started=false;
const missing=()=>$("#m-title").textContent="File lagu belum ada di assets/audio/";
function mLoad(i){mi=(i+SONGS.length)%SONGS.length;au.src=SONGS[mi].src;$("#m-title").textContent=SONGS[mi].title}
function mUI(on){mp.textContent=on?"⏸":"▶";mp.setAttribute("aria-pressed",on);mp.setAttribute("aria-label",on?"Jeda musik":"Putar musik")}
function mPlay(){return au.play().then(()=>mUI(true)).catch(missing)}
function mPause(){au.pause();mUI(false)}
/* Lagu latar dijeda otomatis saat voice note / mikrofon aktif, lalu lanjut lagi sendiri */
const duckBy=new Set();let duckPaused=false;
function duckMusic(why){duckBy.add(why);if(!au.paused){duckPaused=true;mPause()}}
function unduckMusic(why){duckBy.delete(why);if(!duckBy.size&&duckPaused){duckPaused=false;mPlay()}}
function musicStart(){if(started)return;started=true;mPlay()}  /* dipanggil saat tombol "OKE, AKU DATANG!" ditekan */
mp.onclick=()=>{started=true;duckPaused=false;au.paused?mPlay():mPause()};
$("#m-next").onclick=()=>{mLoad(mi+1);mPlay()};$("#m-prev").onclick=()=>{mLoad(mi-1);mPlay()};
$("#m-vol").oninput=e=>au.volume=+e.target.value;au.volume=.6;
au.loop=SONGS.length===1;au.onended=()=>{mLoad(mi+1);mPlay()};au.onerror=missing;
mLoad(0);
