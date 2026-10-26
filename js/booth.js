/* Peony Photobooth — canvas mandiri; semua frame, filter, dan dekor ikut tersimpan ke PNG. */
const FX={
 Normal:"none",Vanilla:"sepia(.15) saturate(1.12) brightness(1.05)",Mono:"grayscale(1) contrast(1.1)",
 "B&W":"grayscale(1) contrast(1.28) brightness(.94)",Film:"sepia(.42) contrast(1.08) saturate(.88)",
 Dreamy:"blur(.35px) brightness(1.1) saturate(1.2) contrast(.94)",Pop:"saturate(1.7) contrast(1.15)",
 "Peony Pink":"sepia(.18) hue-rotate(-22deg) saturate(1.55) brightness(1.07)",
 Pastel:"saturate(.82) brightness(1.13) contrast(.87)",Golden:"sepia(.25) saturate(1.35) contrast(1.04)",
 Cool:"hue-rotate(155deg) saturate(.82) brightness(1.04)",Retro:"sepia(.45) hue-rotate(-12deg) contrast(1.1) saturate(.82)",
 Candy:"hue-rotate(-12deg) saturate(1.8) brightness(1.1)",Noir:"grayscale(1) contrast(1.35) brightness(.9)"
};
const LAYOUTS={
 strip:{name:"Strip 4",cols:1,rows:4,w:520,h:390},
 strip3:{name:"Strip 3",cols:1,rows:3,w:520,h:390},
 grid:{name:"Grid 2×2",cols:2,rows:2,w:380,h:380},
 six:{name:"Grid 3×2",cols:3,rows:2,w:270,h:300},
 polaroid:{name:"Polaroid",cols:1,rows:1,w:560,h:560},
 postcard:{name:"Postcard",cols:1,rows:1,w:680,h:420}
};
const COLORS=["#F48F9C","#DCD2FF","#D8EDDB","#FFE68A","#FFF6D9","#34334B","#FFFFFF","#F7B7D2","#BFE7F4","#B9D8A7","#FFB68A","#C5B6F2"];
const S={layout:"strip",color:"#F48F9C",pat:"peony",frame:"polaroid",title:"PEONY PLANET",cap:"Happy Birthday!",fx:"Peony Pink",vig:true,grain:false,spk:true,stk:"🌷",rad:24};
const shots=[null,null,null,null,null,null],PAD=40,GAP=22;let sel=-1,busy=false,stream=null;
const cv=$("#pb-canvas"),ctx=cv.getContext("2d"),FILT="filter" in ctx;
const say=t=>$("#pb-msg").textContent=t,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const lum=h=>{const n=parseInt(h.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
const grain=(()=>{const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d"),d=g.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const n=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=n;d.data[i+3]=255}g.putImageData(d,0,0);return c})();
const nSlots=()=>LAYOUTS[S.layout].cols*LAYOUTS[S.layout].rows;
function geom(){const L=LAYOUTS[S.layout],foot=L.rows===1?230:190,r=[];for(let i=0;i<nSlots();i++)r.push({x:PAD+(i%L.cols)*(L.w+GAP),y:PAD+Math.floor(i/L.cols)*(L.h+GAP),w:L.w,h:L.h});return{W:PAD*2+L.cols*L.w+(L.cols-1)*GAP,H:PAD+L.rows*L.h+(L.rows-1)*GAP+foot,r,foot}}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,Math.max(0,Math.min(r,w/2,h/2)))}
function spark(x,y,r){const p=[[0,-1],[.25,-.25],[1,0],[.25,.25],[0,1],[-.25,.25],[-1,0],[-.25,-.25]];ctx.beginPath();p.forEach(([a,b],i)=>ctx[i?"lineTo":"moveTo"](x+a*r,y+b*r));ctx.closePath();ctx.fill()}
function heart(x,y,size){ctx.save();ctx.translate(x,y);ctx.scale(size/32,size/32);ctx.beginPath();ctx.moveTo(0,12);ctx.bezierCurveTo(-25,-2,-15,-20,0,-8);ctx.bezierCurveTo(15,-20,25,-2,0,12);ctx.fill();ctx.restore()}
function pattern(W,H){const k=S.pat;if(k==="none")return;ctx.save();ctx.fillStyle=ctx.strokeStyle="rgba(255,255,255,.48)";const step={dots:46,peony:120,stars:90,stripes:44,hearts:68,checker:42,confetti:62,bows:78}[k]||80;
 if(k==="stripes"){ctx.lineWidth=14;for(let x=-H;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+H,H);ctx.stroke()}}
 else if(k==="checker"){for(let y=0,ry=0;y<H+step;y+=step,ry++)for(let x=0,rx=0;x<W+step;x+=step,rx++)if((rx+ry)%2===0){ctx.fillStyle="rgba(255,255,255,.27)";ctx.fillRect(x,y,step,step)}}
 else if(k==="confetti"){let sd=314159;const rnd=()=>{sd=sd*16807%2147483647;return sd/2147483647};const c=["rgba(255,255,255,.55)","rgba(255,230,138,.8)","rgba(220,210,255,.8)"];for(let y=0;y<H+step;y+=step)for(let x=0;x<W+step;x+=step){ctx.save();ctx.translate(x+rnd()*20,y+rnd()*20);ctx.rotate(rnd()*Math.PI);ctx.fillStyle=c[Math.floor(rnd()*c.length)];ctx.fillRect(0,0,8+rnd()*9,3+rnd()*4);ctx.restore()}}
 else for(let y=0,row=0;y<H+step;y+=step,row++)for(let x=(row%2)*step/2;x<W+step;x+=step){ctx.save();ctx.translate(x,y);
  if(k==="dots"){ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill()}
  else if(k==="stars")spark(0,0,16);
  else if(k==="hearts")heart(0,0,27);
  else if(k==="bows"){ctx.font="28px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("🎀",0,0)}
  else for(let a=0;a<5;a++){ctx.beginPath();ctx.arc(0,-11,10,0,Math.PI*2);ctx.fill();ctx.rotate(Math.PI*2/5)}ctx.restore()}
 ctx.restore()}
function cover(im,s){const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,k=Math.max(s.w/iw,s.h/ih),w=iw*k,h=ih*k;ctx.drawImage(im,s.x+(s.w-w)/2,s.y+(s.h-h)/2,w,h)}
function photoBox(s){switch(S.frame){case"polaroid":return{x:s.x+16,y:s.y+15,w:s.w-32,h:s.h-86};case"film":return{x:s.x+34,y:s.y+27,w:s.w-68,h:s.h-54};case"washi":return{x:s.x+12,y:s.y+18,w:s.w-24,h:s.h-30};case"sticker":return{x:s.x+13,y:s.y+13,w:s.w-26,h:s.h-26};case"double":return{x:s.x+11,y:s.y+11,w:s.w-22,h:s.h-22};case"doodle":return{x:s.x+8,y:s.y+8,w:s.w-16,h:s.h-16};default:return{x:s.x+4,y:s.y+4,w:s.w-8,h:s.h-8}}}
function drawPhoto(im,p,i){ctx.save();roundRect(p.x,p.y,p.w,p.h,Math.min(S.rad,30));ctx.clip();if(im){if(FILT)ctx.filter=FX[S.fx]||"none";cover(im,p);if(FILT)ctx.filter="none";
 if(S.vig){const cx=p.x+p.w/2,cy=p.y+p.h/2,g=ctx.createRadialGradient(cx,cy,p.h*.28,cx,cy,Math.max(p.w,p.h)*.72);g.addColorStop(0,"rgba(52,51,75,0)");g.addColorStop(1,"rgba(52,51,75,.38)");ctx.fillStyle=g;ctx.fillRect(p.x,p.y,p.w,p.h)}
 if(S.grain){ctx.globalAlpha=.14;ctx.fillStyle=ctx.createPattern(grain,"repeat");ctx.fillRect(p.x,p.y,p.w,p.h);ctx.globalAlpha=1}
 if(S.spk){let sd=i*97+13;const rnd=()=>{sd=sd*16807%2147483647;return sd/2147483647};ctx.fillStyle="rgba(255,255,255,.88)";for(let k=0;k<7;k++)spark(p.x+rnd()*p.w,p.y+rnd()*p.h,7+rnd()*12)}}else{ctx.fillStyle="#DCD2FF";ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle="#34334B";ctx.font=`700 ${Math.max(18,Math.min(34,p.w/10))}px Fredoka,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("+ foto "+(i+1),p.x+p.w/2,p.y+p.h/2);ctx.font="28px serif";ctx.fillText("🌷",p.x+p.w/2,p.y+p.h/2+38)}ctx.restore()}
function decorateFrame(s,p,i,out){ctx.save();
 if(S.frame==="polaroid"){
  ctx.lineWidth=3;ctx.strokeStyle="#34334B";roundRect(s.x,s.y,s.w,s.h,8);ctx.stroke();ctx.fillStyle="#34334B";ctx.textAlign="center";ctx.textBaseline="alphabetic";ctx.font=`600 ${Math.max(18,Math.min(27,s.w/18))}px Caveat,"Comic Sans MS",cursive`;ctx.fillText(i%2===0?"a little memory ♡":"my favorite human ✿",s.x+s.w/2,s.y+s.h-33,s.w-24);
  ctx.font="20px serif";ctx.fillText("✦",s.x+23,s.y+s.h-12);ctx.fillText("✦",s.x+s.w-23,s.y+s.h-12)
 }else if(S.frame==="film"){
  ctx.fillStyle="#FFF6D9";for(let yy=s.y+8;yy<s.y+s.h-8;yy+=24){roundRect(s.x+8,yy,12,13,3);ctx.fill();roundRect(s.x+s.w-20,yy,12,13,3);ctx.fill()}
  ctx.strokeStyle="#34334B";ctx.lineWidth=5;roundRect(p.x-2,p.y-2,p.w+4,p.h+4,6);ctx.stroke()
 }else if(S.frame==="washi"){
  ctx.save();ctx.globalAlpha=.9;ctx.fillStyle="#FFF0A8";ctx.translate(s.x+s.w*.28,s.y+10);ctx.rotate(-.08);ctx.fillRect(-s.w*.14,-7,s.w*.28,22);ctx.fillStyle="#FFD4E0";ctx.translate(s.w*.58,0);ctx.rotate(.16);ctx.fillRect(-s.w*.12,-7,s.w*.24,22);ctx.restore();ctx.strokeStyle="#34334B";ctx.lineWidth=4;roundRect(p.x-2,p.y-2,p.w+4,p.h+4,Math.min(S.rad,26));ctx.stroke()
 }else if(S.frame==="sticker"){
  ctx.strokeStyle="#34334B";ctx.lineWidth=5;ctx.setLineDash([10,7]);roundRect(p.x-3,p.y-3,p.w+6,p.h+6,Math.min(S.rad,24));ctx.stroke();ctx.setLineDash([]);ctx.font=`${Math.max(22,Math.min(46,s.w/8))}px serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(i%3===0?"🎀":i%3===1?"⭐":"💗",s.x+18,s.y+20);ctx.fillText(i%3===0?"🍓":i%3===1?"✦":"🌷",s.x+s.w-18,s.y+s.h-18)
 }else if(S.frame==="double"){
  ctx.strokeStyle="#34334B";ctx.lineWidth=8;roundRect(s.x+2,s.y+2,s.w-4,s.h-4,Math.min(S.rad+5,30));ctx.stroke();ctx.strokeStyle="#FFFDF5";ctx.lineWidth=3;roundRect(s.x+10,s.y+10,s.w-20,s.h-20,Math.max(0,S.rad-4));ctx.stroke()
 }else if(S.frame==="doodle"){
  ctx.strokeStyle="#34334B";ctx.lineWidth=5;ctx.setLineDash([3,9]);roundRect(p.x-2,p.y-2,p.w+4,p.h+4,Math.min(S.rad,25));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#FFE68A";spark(s.x+17,s.y+17,9);ctx.fillStyle="#F48F9C";heart(s.x+s.w-18,s.y+18,24);ctx.fillStyle="#DCD2FF";spark(s.x+s.w-18,s.y+s.h-18,8)
 }else{ctx.strokeStyle="#34334B";ctx.lineWidth=7;roundRect(p.x-2,p.y-2,p.w+4,p.h+4,Math.min(S.rad+2,28));ctx.stroke();ctx.strokeStyle="#FFFDF5";ctx.lineWidth=2;roundRect(p.x+4,p.y+4,p.w-8,p.h-8,Math.max(0,S.rad-2));ctx.stroke()}
 if(!out&&i===sel){ctx.setLineDash([16,10]);ctx.strokeStyle="#fff";ctx.lineWidth=12;roundRect(s.x-3,s.y-3,s.w+6,s.h+6,Math.min(S.rad+10,35));ctx.stroke();ctx.strokeStyle="#34334B";ctx.lineWidth=4;ctx.stroke();ctx.setLineDash([])}ctx.restore()}
function draw(out=false){const{W,H,r,foot}=geom();cv.width=W;cv.height=H;ctx.clearRect(0,0,W,H);ctx.fillStyle=S.color;ctx.fillRect(0,0,W,H);pattern(W,H);
 r.forEach((s,i)=>{const im=shots[i],p=photoBox(s);if(S.frame==="polaroid"){ctx.fillStyle="#FFFDF5";roundRect(s.x,s.y,s.w,s.h,8);ctx.fill();ctx.shadowColor="rgba(52,51,75,.15)";ctx.shadowBlur=12;ctx.strokeStyle="rgba(52,51,75,.12)";ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0}
 else if(S.frame==="film"){ctx.fillStyle="#34334B";roundRect(s.x,s.y,s.w,s.h,7);ctx.fill()}
 else if(S.frame==="washi"||S.frame==="sticker"||S.frame==="doodle"){ctx.fillStyle="#FFFDF5";roundRect(s.x,s.y,s.w,s.h,12);ctx.fill()}
 drawPhoto(im,p,i);decorateFrame(s,p,i,out)});
 ctx.fillStyle=lum(S.color)>.55?"#34334B":"#fff";ctx.textAlign="center";ctx.textBaseline="alphabetic";
 ctx.font='700 58px Fredoka,"Trebuchet MS",sans-serif';ctx.fillText(S.title,W/2,H-foot+82,W-110);
 ctx.font='600 30px Nunito,sans-serif';ctx.fillText(S.cap,W/2,H-foot+132,W-110);
 if(S.stk!=="-"){ctx.font="72px serif";ctx.textBaseline="middle";[[W-54, H-foot+42,.18],[52,H-foot+42,-.2],[W-52,H-48,.15],[50,H-48,-.15]].forEach(([x,y,a])=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillText(S.stk,0,0);ctx.restore()})}
 ctx.textBaseline="alphabetic";ctx.font="18px Nunito,sans-serif";ctx.globalAlpha=.7;ctx.fillStyle=lum(S.color)>.55?"#34334B":"#fff";ctx.fillText("made with extra love ♡",W/2,H-13);ctx.globalAlpha=1;
}
function put(im){let i=sel>=0?sel:shots.slice(0,nSlots()).findIndex(s=>!s);if(i<0)i=0;shots[i]=im;sel=-1;draw();say(`Yay! Foto masuk ke slot ${i+1}. Klik slot lain untuk mengatur posisinya.`)}
function pickSlot(i){sel=i===sel?-1:i;say(sel>=0?`Slot ${sel+1} dipilih. Foto berikutnya masuk ke sini.`:"");draw();sync()}
cv.onclick=e=>{const R=cv.getBoundingClientRect(),x=(e.clientX-R.left)*cv.width/R.width,y=(e.clientY-R.top)*cv.height/R.height,i=geom().r.findIndex(s=>x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h);if(i>=0)pickSlot(i)};

/* Control builders */
$("#pb-layouts").innerHTML=Object.entries(LAYOUTS).map(([k,l])=>`<button class="chip" data-k="layout" data-v="${k}" aria-pressed="${S.layout===k}">${l.name}</button>`).join("");
$("#pb-fx").innerHTML=Object.keys(FX).map(k=>`<button class="chip" data-k="fx" data-v="${k}" aria-pressed="${S.fx===k}">${k}</button>`).join("");
$("#pb-sw").insertAdjacentHTML("afterbegin",COLORS.map(c=>`<button class="pb-sw" data-k="color" data-v="${c}" style="background:${c}" aria-label="Warna frame ${c}" title="${c}"></button>`).join(""));
function sync(){$$("#booth [data-k]").forEach(b=>b.setAttribute("aria-pressed",S[b.dataset.k]===b.dataset.v));$("#pb-slots").innerHTML=Array.from({length:nSlots()},(_,i)=>`<button class="chip" data-slot="${i}" aria-pressed="${i===sel}">Slot ${i+1}${shots[i]?" ✓":""}</button>`).join("")}
$("#booth").addEventListener("click",e=>{const sl=e.target.closest("[data-slot]");if(sl){pickSlot(+sl.dataset.slot);return}const b=e.target.closest("[data-k]");if(!b)return;S[b.dataset.k]=b.dataset.v;if(b.dataset.k==="layout"){sel=-1;shots.forEach((_,i)=>{if(i>=nSlots())shots[i]=null})}if(b.dataset.k==="color")$("#pb-color").value=b.dataset.v;sync();draw()});
$$("#booth [data-s]").forEach(el=>el.oninput=()=>{S[el.dataset.s]=el.type==="checkbox"?el.checked:el.type==="range"?+el.value:el.value;if(el.dataset.s==="color")sync();draw()});
$("#clear").onclick=()=>{shots.fill(null);sel=-1;sync();draw();say("Slot bersih! Saatnya foto-foto lagi 💗")};

/* Upload & Memory Vault */
$("#up").onchange=e=>{[...e.target.files].filter(f=>f.type.startsWith("image/")).forEach(f=>{const im=new Image();im.onload=()=>{put(im);sync();URL.revokeObjectURL(im.src)};im.onerror=()=>say("Ada foto yang gagal dibuka. Coba file gambar lain ya.");im.src=URL.createObjectURL(f)});e.target.value=""};
$("#pick-btn").onclick=()=>{const p=$("#pick");p.hidden=!p.hidden;if(!p.hidden&&!p.children.length)p.innerHTML=cards.map(c=>`<button class="pb-th" data-c="${c.n-1}" aria-label="${num(c)}"><img loading="lazy" src="${c.thumb||c.src}" alt="" onerror="imgFix(this,${c.n})"></button>`).join("")};
$("#pick").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;const c=cards[+b.dataset.c],im=new Image();im.onload=()=>{put(im);sync()};im.onerror=()=>say(num(c)+" belum ada di assets/photos.");im.src=c.src};

/* Kamera */
async function camOn(){try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280}},audio:false});$("#cam").srcObject=stream;$("#cam-box").hidden=false;say("Kamera siap! Atur pose terbaikmu 🌷")}catch{say("Kamera tidak bisa dibuka (butuh izin dan https/localhost). Pakai Upload sebagai gantinya.")}}
function camOff(){stream?.getTracks().forEach(t=>t.stop());stream=null;$("#cam-box").hidden=true}
function snap(){const v=$("#cam");if(!stream||!v.videoWidth)return;const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;const g=c.getContext("2d");if($("#mirror").checked){g.translate(c.width,0);g.scale(-1,1)}g.drawImage(v,0,0);put(c);sync()}
async function count(){for(let n=3;n>0;n--){$("#count").textContent=n;await sleep(850)}$("#count").textContent=""}
$("#cam-on").onclick=camOn;$("#cam-off").onclick=camOff;
$("#mirror").onchange=e=>$("#cam").style.transform=e.target.checked?"scaleX(-1)":"";$("#cam").style.transform="scaleX(-1)";
$("#snap").onclick=async()=>{if(busy)return;busy=true;try{await count();snap()}finally{busy=false}};
$("#auto").onclick=async()=>{if(busy)return;busy=true;shots.fill(null);for(let i=0;i<nSlots()&&stream;i++){await count();sel=i;snap();await sleep(400)}busy=false;sync();draw()};

/* Save as PNG */
$("#dl").onclick=()=>{try{draw(true);cv.toBlob(b=>{if(!b){say("PNG belum bisa dibuat. Coba foto Upload atau jalankan via localhost.");draw();return}const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`peony-photobooth-${S.layout}-${S.frame}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);say("PNG berhasil disiapkan. Semoga hasilnya gemas! 💗")})}catch{say("Browser memblokir ekspor foto dari file lokal. Jalankan lewat server lokal (python -m http.server) atau pakai foto Upload/Kamera.")}draw()};
if(!FILT)say("Browser ini belum mendukung efek foto; frame tetap bisa dipakai.");sync();draw();document.fonts?.load('700 58px Fredoka').then(()=>draw()).catch(()=>{});
