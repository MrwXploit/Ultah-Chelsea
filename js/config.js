/* === UBAH DI SINI === */
const OURS={
 name:"",                         /* nama panggilan dia (mis. "Mawar"). Kosongkan kalau tidak mau memakai nama. Di teks lain, tulis {nama} untuk menyisipkannya */
 since:"2023-01-28T16:48:00",   /* tanggal jadian: format TAHUN-BULAN-TANGGALTjam:menit:detik */
 letterCode:"2801",                 /* kode pembuka surat. Kosongkan ("") kalau tidak mau dikunci. Contoh: "0101" */
 letterHint:"Petunjuk: tanggal dan bulan jadian, kalo kamu gk tau aku ngambek liat aja!",
 letter:[
  "DEAR Chelsea Voncell Camberly Mattuankota.",
  "Kalau surat ini sudah terbuka, berarti kamu sudah menjelajahi planet kecil yang aku buat dengan sepenuh sangat tulus dan sampai excited.",
  "Aku ingin bilang, aku sayang kamu. Aku sayang kamu bangetttt, dan aku bangga banget sama kamu, Aku juga minta maaf yaaa, aku gk pinterr beut buat ngerangkai kata-kata buat surattt hehehehe.",
  "U know whatt??, aku sangatt bangga punya wifeyy sepertii kamuuu, Terima kasih sudah sabar, sudah ketawa bareng, dan sudah tetap di sini di hari-hari yang nggak mudah. Aku bangga banget bisa kenal kamu, Walaupun dihubungan kita banyak dramaa yakk, tapi kita bisa melaluinya, aku berharappp hubungan ini akan teruss berjalann dengan lancar sampai kita di surga:) ",
  "Semoga tahun ini penuh hal baik, sehat selaluu dan semoga aku masih boleh jadi bagian dari cerita seumur hidupmu. Barakallah fii umrik sayanggkuu, I LOVE YOU IN EVERY EVERY UNIVERSE MULTIVERSE QUANTILIVERSE INFINITYVERSE UNLIMITEDVERSE EVERYTINGVERSE AND MORE MORE THAN YOU LOVE ME❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ."],
 sign:"From Your Lover, Abdilah Panca Wiradhika"
};
/* Nama dipakai di intro, report, kartu kue, photobooth, dan teks yang memuat {nama} */
const NAME=(OURS.name||"").trim(),fillName=s=>String(s).replace(/\{nama\}/gi,NAME||"kamu");
