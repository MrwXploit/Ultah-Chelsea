/* Cek persiapan: buka index.html?cek untuk melihat apa saja yang masih perlu diisi.
   Pengunjung biasa tidak pernah melihat ini (hanya aktif kalau alamat memuat ?cek). */
if(/[?&]cek\b/.test(location.search)){(async()=>{
 const DEF_SINCE="2021-01-01T00:00:00",DEF_LETTER="Hai, kamu. Kalau surat ini sudah terbuka";
 const rows=[],add=(ok,t)=>rows.push({ok,t});
 await new Promise(r=>setTimeout(r,1200));
 const has=await Promise.all(cards.map(c=>new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=c.src})));
 const miss=cards.filter((c,i)=>!has[i]).map(c=>String(c.n).padStart(2,"0"));
 const caps=cards.filter(c=>c.caption).length;
 add(!!NAME,NAME?`Nama panggilan: ${NAME}`:"Nama panggilan belum diisi (OURS.name di js/config.js)");
 add(OURS.since!==DEF_SINCE,OURS.since===DEF_SINCE?"Tanggal jadian masih contoh bawaan (2021-01-01)":`Tanggal jadian: ${OURS.since}`);
 add(!String(OURS.letter[0]||"").startsWith(DEF_LETTER),"Isi surat"+(String(OURS.letter[0]||"").startsWith(DEF_LETTER)?" masih teks contoh bawaan":" sudah diganti"));
 add(null,OURS.letterCode?`Surat dikunci dengan kode: ${OURS.letterCode}`:"Surat tidak dikunci (letterCode kosong)");
 add(!voiceMissing,voiceMissing?"voice-note.mp3 belum ada di assets/audio/ (kotak voice note disembunyikan)":"voice-note.mp3 ditemukan");
 add(!miss.length,miss.length?`${miss.length} dari ${cards.length} foto belum ada: ${miss.length>12?miss.slice(0,12).join(", ")+" ...":miss.join(", ")}`:`${cards.length} foto lengkap`);
 add(null,`${caps} dari ${cards.length} foto punya caption (boleh kosong)`);
 add(null,USE_THUMBS?"Thumbnail aktif (USE_THUMBS=true)":"Thumbnail belum aktif. Jalankan tools/optimize-photos.py supaya galeri ringan");
 const box=document.createElement("div");box.className="cek";box.setAttribute("role","dialog");box.setAttribute("aria-label","Cek persiapan");
 const h=document.createElement("h2");h.textContent="Cek persiapan 🌷";box.append(h);
 const ul=document.createElement("ul");rows.forEach(r=>{const li=document.createElement("li");li.textContent=(r.ok===null?"ℹ️ ":r.ok?"✅ ":"⚠️ ")+r.t;ul.append(li)});box.append(ul);
 const p=document.createElement("p");p.className="small";p.textContent="Ini hanya muncul kalau alamat memuat ?cek. Hapus ?cek dari alamat untuk tampilan normal. Pakai ?reset untuk menghapus progres yang tersimpan di browser ini.";box.append(p);
 const b=document.createElement("button");b.className="btn lil";b.textContent="Tutup";b.onclick=()=>box.remove();box.append(b);
 document.body.append(box);
 console.table(rows.map(r=>({status:r.ok===null?"info":r.ok?"ok":"perlu diisi",catatan:r.t})));
})()}
