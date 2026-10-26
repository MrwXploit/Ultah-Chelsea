const seen=new Set(store.get("seen",[])),IDS=$$(".view").map(v=>v.id);
function go(id){
 $$(".view").forEach(v=>v.hidden=v.id!==id);$("#nav").hidden=id==="intro";
 $$("#nav button").forEach(b=>{if(b.dataset.go===id)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 /* nav satu baris di HP: geser agar tombol aktif ada di tengah */
 const ab=$("#nav [aria-current]"),nv=$("#nav");if(ab&&id!=="intro")nv.scrollTo({left:ab.offsetLeft-(nv.clientWidth-ab.offsetWidth)/2,behavior:reduce?"auto":"smooth"});
 if(id!=="intro"&&id!=="map"){seen.add(id);store.set("seen",[...seen])}
 $$(".loc").forEach(l=>l.classList.toggle("seen",seen.has(l.dataset.go)));
 // Reset posisi secara langsung agar judul tidak tertutup navbar sticky.
 if(id!=="booth")camOff();
 window.scrollTo(0,0);
 history.replaceState(null,"","#"+id)}
document.addEventListener("click",e=>{const t=e.target.closest("[data-go]");if(t)go(t.dataset.go)});
$("#start").onclick=()=>{musicStart();const p=$("#planet-art");if(reduce)return go("map");p.classList.add("spin");setTimeout(()=>{p.classList.remove("spin");go("map")},800)};

/* Memory Vault */
const PALS=["#DCD2FF","#D8EDDB","#FFE68A","#FBC9D0","#DCD2FF"];
const cards=PEONY_PACKS.flatMap((p,pi)=>p.cards.map(c=>({...c,pack:pi})));cards.forEach((c,i)=>c.n=i+1);
const num=c=>"PEONY CARD "+String(c.n).padStart(3,"0");
const ph=n=>"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#FFF6D9"/><circle cx="200" cy="210" r="70" fill="#F48F9C"/><circle cx="200" cy="210" r="28" fill="#FFE68A"/><text x="200" y="360" font-family="sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#34334B">foto ${n}</text></svg>`);
function imgFix(im,n){const f=cards[n-1].src;if(!im.dataset.f&&im.getAttribute("src")!==f){im.dataset.f=1;im.src=f;return}im.onerror=null;im.src=ph(n)}
let pack=-1,mode="board",seed=0,vList=[],dIdx=0,zTop=5,dBusy=false;
const EMO=["🥰","✨","🤪","🧳","🏆"],BB=["#FFF0F3","#F0ECFF","#EAF6EC","#FFF6D9","#F6F1FF"],TAPE=["#FFE68A","#DCD2FF","#D8EDDB","#F9B5BF"],STK=["🌷","⭐","💖","🐱","🌸","🍓","✨","🎀"];
const BACKS=["Satu lagi alasan aku suka kamu.","Kamu di foto ini bikin aku senyum sendiri.","Simpan di hati, bukan cuma di galeri.","Momen kecil, artinya besar.","Kamu selalu jadi favoritku.","Kenangan ini dijaga kucing penjaga planet."];
function setList(sh){vList=cards.filter(c=>pack<0||c.pack===pack);if(sh){shuf(vList);seed=1+Math.floor(Math.random()*40)}else seed=0}
const cap=c=>esc(c.caption||"kenangan #"+c.n);
const pim=c=>`<img draggable="false" loading="lazy" src="${c.thumb||c.src}" alt="${esc(c.caption||num(c))}" onerror="imgFix(this,${c.n})">`;
function renderVault(){
 $("#tabs").innerHTML=`<button role="tab" aria-selected="${pack<0}" data-pack="-1">🌈 Semua</button>`+PEONY_PACKS.map((p,i)=>`<button role="tab" aria-selected="${i===pack}" data-pack="${i}">${EMO[i%5]} ${esc(p.name)}</button>`).join("");
 $("#pack-desc").textContent=pack<0?"Semua kenangan campur aduk jadi satu.":PEONY_PACKS[pack].desc;
 $("#vault-hint").textContent=mode==="board"?"Di laptop, tarik foto untuk memindahkannya. Klik untuk melihat lebih besar.":"Ketuk kartu untuk membaliknya, geser ke samping untuk melemparnya.";
 $("#mode-board").setAttribute("aria-pressed",mode==="board");$("#mode-deck").setAttribute("aria-pressed",mode==="deck");
 $("#board").hidden=mode!=="board";$("#deck").hidden=mode!=="deck";
 mode==="board"?renderBoard():renderDeck()}
function renderBoard(){const b=$("#board");b.style.setProperty("--bb",pack<0?"#FFFDF5":BB[pack%5]);
 b.innerHTML=vList.map((c,i)=>{const s=c.n*7+seed;return `<button class="pol v${s%4}" data-n="${c.n-1}" style="--rot:${(s*37%15)-7}deg;--tape:${TAPE[s%4]};--i:${i}"><span class="stk">${STK[s%8]}</span><span class="pf">${pim(c)}</span><span class="pc">${cap(c)}</span></button>`}).join("")}
function renderDeck(){const L=vList.length;
 $("#deck-stage").innerHTML=[2,1,0].map(k=>{const c=vList[(dIdx+k)%L],s=c.n*5+seed;
  return `<div class="dcard${k?"":" top"}" ${k?"":'data-top tabindex="0" role="button" aria-label="Balik kartu" '}style="--k:${k};--rot:${k?(s%9)-4:-2}deg"><div class="df"><div class="front"><span class="pf">${pim(c)}</span><span class="pc">${cap(c)}</span></div><div class="back"><b>${num(c)}</b><p>${esc(c.caption||BACKS[c.n%BACKS.length])}</p><img class="kucing" src="assets/gif/wish-cuddle.gif" alt="" onerror="this.remove()"></div></div></div>`}).join("");
 $("#d-count").textContent=`${dIdx%L+1} / ${L}`}
$("#tabs").onclick=e=>{const b=e.target.closest("[data-pack]");if(b){pack=+b.dataset.pack;dIdx=0;setList(false);renderVault()}};
$("#shuffle").onclick=()=>{dIdx=0;setList(true);renderVault()};
$("#mode-board").onclick=()=>{mode="board";renderVault()};$("#mode-deck").onclick=()=>{mode="deck";renderVault()};

/* Scrapbook: klik membuka, tarik (mouse/pen) memindahkan */
let drag=null;const board=$("#board");
board.addEventListener("pointerdown",e=>{const p=e.target.closest(".pol");if(!p||e.pointerType==="touch"||e.button)return;
 drag={p,x:e.clientX,y:e.clientY,dx:parseFloat(p.style.getPropertyValue("--dx"))||0,dy:parseFloat(p.style.getPropertyValue("--dy"))||0,moved:false};p.setPointerCapture(e.pointerId);p.style.zIndex=++zTop;p.classList.add("drag")});
board.addEventListener("pointermove",e=>{if(!drag)return;const mx=e.clientX-drag.x,my=e.clientY-drag.y;if(Math.abs(mx)+Math.abs(my)>5)drag.moved=true;drag.p.style.setProperty("--dx",drag.dx+mx+"px");drag.p.style.setProperty("--dy",drag.dy+my+"px")});
board.addEventListener("pointerup",()=>{if(!drag)return;drag.p.classList.remove("drag");drag.p.dataset.moved=drag.moved?"1":"";drag=null});
board.onclick=e=>{const p=e.target.closest(".pol");if(!p)return;if(p.dataset.moved){p.dataset.moved="";return}openLb(+p.dataset.n)};

/* Tumpukan: ketuk = balik, geser = lempar */
function step(dir){if(dBusy)return;dBusy=true;const t=$(".dcard.top");t.classList.remove("flip");t.style.transform="";t.classList.remove("dragging");t.classList.add(dir>0?"fly-l":"fly-r");
 setTimeout(()=>{dIdx=(dIdx+dir+vList.length)%vList.length;renderDeck();dBusy=false},reduce?0:340)}
$("#d-next").onclick=()=>step(1);$("#d-prev").onclick=()=>step(-1);
let dg=null;const stage=$("#deck-stage");
stage.addEventListener("pointerdown",e=>{const c=e.target.closest(".dcard.top");if(!c||dBusy)return;dg={c,x:e.clientX,dx:0};c.setPointerCapture(e.pointerId);c.classList.add("dragging")});
stage.addEventListener("pointermove",e=>{if(!dg)return;dg.dx=e.clientX-dg.x;dg.c.style.transform=`translateX(${dg.dx}px) rotate(${dg.dx/15}deg)`});
stage.addEventListener("pointerup",()=>{if(!dg)return;const{c,dx}=dg;dg=null;
 if(Math.abs(dx)>70)return step(dx<0?1:-1);
 c.classList.remove("dragging");c.style.transform="";if(Math.abs(dx)<6)c.classList.toggle("flip")});
stage.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".dcard.top")){e.preventDefault();e.target.classList.toggle("flip")}});
$("#surprise").onclick=()=>openLb(Math.floor(Math.random()*cards.length));
setList(false);renderVault();

/* Lightbox */
let cur=0,opener=null;
function showLb(i){cur=(i+cards.length)%cards.length;const c=cards[cur],im=$("#lb-img");
 im.dataset.f="";im.onerror=()=>imgFix(im,c.n);im.src=c.src;im.alt=c.caption||num(c);$("#lb-num").textContent=num(c);$("#lb-cap").textContent=c.caption}
function openLb(i){opener=document.activeElement;showLb(i);$("#lb").hidden=false;document.body.style.overflow="hidden";$("#lb-close").focus()}
function closeLb(toPack){$("#lb").hidden=true;document.body.style.overflow="";
 if(toPack&&pack>=0&&cards[cur].pack!==pack){pack=cards[cur].pack;setList(false);renderVault()}
 (opener&&document.contains(opener)?opener:$(".pol"))?.focus()}
$("#lb-prev").onclick=()=>showLb(cur-1);$("#lb-next").onclick=()=>showLb(cur+1);
$("#lb-close").onclick=()=>closeLb(true);$("#lb-back").onclick=()=>closeLb(true);
$("#lb").onclick=e=>{if(e.target.id==="lb")closeLb(true)};
document.addEventListener("keydown",e=>{
 if(!$("#lb").hidden){if(e.key==="Escape")closeLb(true);if(e.key==="ArrowLeft")showLb(cur-1);if(e.key==="ArrowRight")showLb(cur+1);return}
 if(!$("#vault").hidden&&mode==="deck"&&!e.target.matches("input,select,textarea")){if(e.key==="ArrowRight")step(1);if(e.key==="ArrowLeft")step(-1)}});

go(IDS.includes(location.hash.slice(1))?location.hash.slice(1):"intro");
