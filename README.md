# Peony Planet v12 — Perbaikan Hari-H

Website ulang tahun interaktif bertema peony dengan gaya lucu dan playful.

## Update v12 (perbaikan)
- **Musik latar otomatis dijeda** saat voice note diputar dan saat mikrofon tiup-lilin aktif, lalu lanjut lagi sendiri. Sebelumnya lagu menimpa suaramu.
- **Kucing penjaga tidak lagi menelan tap.** Kotak transparannya dulu bisa menutupi tombol di bagian bawah layar HP (mis. tombol simpan harapan). Sekarang hanya kucing dan tombol ikannya yang bisa disentuh, dan ukurannya sedikit lebih kecil di HP.
- **Navigasi satu baris yang bisa digeser di HP** (dulu 3 baris dan memakan ±18% layar). Tombol halaman aktif otomatis digeser ke tengah.
- **Kotak voice note disembunyikan kalau `assets/audio/voice-note.mp3` tidak ada**, jadi pengunjung tidak melihat pesan teknis. Begitu file ditambahkan, kotaknya muncul sendiri.
- **Nama personal.** Isi `name` di `js/config.js` (mis. `"Mawar"`). Nama dipakai di intro, report, kartu kue, caption photobooth, judul tab, dan file harapan. Di surat, pujian, awan pesan, dan caption foto kamu bisa menulis `{nama}` untuk menyisipkannya (kalau `name` kosong, diganti kata "kamu").
- **Progres tersimpan di browser**: tanda "sudah dikunjungi" dan Jar Favorit tidak hilang saat halaman di-refresh. Buka `index.html?reset` untuk menghapusnya (berguna setelah kamu selesai mencoba sendiri, sebelum diberikan).
- **Cek persiapan**: buka `index.html?cek` untuk melihat daftar apa yang belum diisi (nama, tanggal jadian, isi surat, voice note, 40 foto, caption). Pengunjung biasa tidak melihat ini.
- **Favicon, warna tema, dan deskripsi** ditambahkan; judul tab tidak lagi memuat kata "Kawaii Edition".
- **Kompres foto**: `python tools/optimize-photos.py` (butuh `pip install pillow`). Foto di-resize ke maks 1400 px, orientasi EXIF dibetulkan, thumbnail 480 px dibuat, dan aslinya dicadangkan di `assets/photos/_original/`. Foto HP 3-5 MB jadi ±150-300 KB, jadi galeri jauh lebih ringan. Folder `_original/` tidak perlu ikut dipublikasikan.
- Teks "file Notepad" diganti "file catatan (.txt)" karena di HP tidak ada Notepad.
- Di Photobooth, thumbnail Memory Vault sekarang jatuh kembali ke foto asli kalau thumbnail belum dibuat (sebelumnya langsung tampil placeholder).

### Saran publikasi
Kamera, mikrofon, dan simpan PNG foto Vault butuh `https://` atau `localhost`. Cara paling mudah supaya dia cukup membuka link: unggah folder ini ke GitHub Pages, Netlify, atau Cloudflare Pages (gratis), lalu kirim linknya. Kalau tetap memakai ZIP, buka lewat `python -m http.server 8000`.

## Update v11 — Voice Note & Wish-Blow Cake
- **Surat Rahasia** menampilkan pemutar voice note setelah surat selesai terbuka. Untuk memasukkan suaramu, letakkan rekaman MP3 bernama `voice-note.mp3` di `assets/audio/` sehingga path lengkapnya menjadi `assets/audio/voice-note.mp3`. Kamu bisa merekam dengan perekam suara HP, lalu ekspor/ubah namanya menjadi `voice-note.mp3`. Tidak perlu mengubah kode jika memakai nama dan lokasi itu. Kalau nama/format file berbeda, ubah `src` pada elemen `source` dengan id pemutar `letter-audio` di `index.html` dan sesuaikan `type` (contoh MP3: `audio/mpeg`, M4A: `audio/mp4`, WAV: `audio/wav`).
- **The Cake Lab** sekarang punya urutan wajib: rakit kue → tekan OKAY, CAKE'S READY! → ketik harapan (minimal 3 karakter) → tekan tombol simpan. Harapan otomatis diunduh sebagai file teks `.txt` dengan tanggal di nama file dan BOM UTF-8 agar teks Indonesia tampil dengan benar.
- Setelah file harapan dibuat, panel tiup lilin terbuka. Pilih **AKTIFKAN MIKROFON**, izinkan akses mikrofon, tunggu kalibrasi singkat, lalu tiup ke arah mikrofon selama kira-kira setengah detik. Deteksi berlangsung langsung di browser; suara tidak direkam atau diunggah. Mikrofon akan dihentikan setelah lilin padam.
- Jika izin mikrofon tidak tersedia/ditolak, buka website lewat `http://localhost:8000` atau HTTPS, pastikan izin mikrofon browser disetel ke Allow, atau gunakan opsi **TIUP TANPA MIKROFON**. File `.txt` tetap wajib dibuat sebelum opsi tiup bisa digunakan.

## Update v10 — Compliment-O-Matic & Photobooth Remix

- **Compliment-O-Matic** sekarang punya 40 pujian dalam 5 kategori: Gemas, Bucin, Bangga, Peluk Dulu, dan Absurd. Pilih kategori, buka kartu pujian, lihat meter gemas, salin teks, atau simpan ke Jar Favorit. Jar ini disimpan di memori halaman aktif, jadi akan kosong lagi saat halaman dimuat ulang.
- **Photobooth** sekarang punya 6 layout (Strip 4, Strip 3, Grid 2×2, Grid 3×2, Polaroid, Postcard), 7 gaya frame (Polaroid, Gummy Outline, Double Border, Film Camera, Washi Tape, Sticker Party, Doodle Cutie), 9 pola latar, 14 filter foto, dan 12 warna frame.
- Foto yang diunduh sebagai PNG memakai filter, bingkai, pola, judul, caption, dan stiker yang sedang dipilih. Untuk hasil maksimal, buka website melalui `python -m http.server 8000` lalu kunjungi `http://localhost:8000`.
- Pilihan layout dan kontrol photobooth dirancang agar bisa digunakan melalui klik atau sentuhan dan tetap responsif di layar kecil.

## Cara menjalankan

1. Ekstrak seluruh ZIP ke satu folder.
2. Buka `index.html` di browser.
3. Untuk pengalaman yang lebih konsisten, buka terminal pada folder ini lalu jalankan:

   ```bash
   python -m http.server 8000
   ```

4. Buka `http://localhost:8000` di browser.

## Memasukkan 40 foto

Folder `assets/photos/` pada ZIP awal masih kosong. Tambahkan foto milikmu ke folder tersebut dengan nama berikut:

- `01.jpg` sampai `08.jpg` → Certified Cutie
- `09.jpg` sampai `16.jpg` → Main Character Mode
- `17.jpg` sampai `24.jpg` → Chaos Department
- `25.jpg` sampai `32.jpg` → Tiny Adventures
- `33.jpg` sampai `40.jpg` → Personal Hall of Fame

Gunakan ekstensi `.jpg` untuk nama standar di atas. Jika file fotomu memakai ekstensi lain, ubah nilai `src` di `js/memories.js` sesuai nama file. Kalau foto belum dimasukkan atau file tidak ditemukan, website menampilkan placeholder, bukan gambar rusak.

## Mengubah caption

Buka `js/memories.js`. Caption bisa diubah pada daftar `caps` di masing-masing paket. Jika caption dikosongkan (`""`), kartu tetap tampil tanpa caption.

## Bagian kode

- `index.html` — markup dan ilustrasi SVG.
- `css/style.css` — warna, layout responsif, animasi, serta style komponen.
- `js/memories.js` — 40 data kartu foto dan caption.
- `js/interactions.js` — mesin pujian, awan pesan, pilihan kue, dan confetti.
- `js/app.js` — navigasi, galeri, lightbox, dan shuffle foto.

## Hasil pemeriksaan

- Memperbaiki bentroknya class tombol lokasi `loc-b` dengan class lightbox.
- Memperbaiki status aktif pada navigasi agar memakai `aria-current="page"`.
- Memperbaiki scroll antarhalaman agar judul tidak tertutup navbar sticky.
- Memperbaiki ikon peony pada mesin pujian dan laporan agar SVG tampil utuh, bukan terpotong.
- Mengganti pengacakan kartu menjadi Fisher–Yates agar lebih merata, tanpa pengulangan langsung antar-siklus.
- Memeriksa sintaks JavaScript.
- Menjalankan tes interaksi untuk navigasi, mesin pujian, awan pesan, dekorasi kue, lightbox, dan shuffle.
- Memeriksa responsivitas pada lebar 360, 390, 430, 768, 1024, dan 1366 piksel; tidak ditemukan horizontal overflow pada ukuran tersebut.

Font Fredoka dan Nunito dimuat dari Google Fonts saat koneksi internet tersedia. Jika offline, website tetap menggunakan font pengganti.

## Photobooth
Buka lewat tombol di Report atau menu Photobooth. Kamera butuh https atau localhost. Simpan PNG dari foto Memory Vault butuh server lokal (python -m http.server); foto Upload/Kamera jalan di mana saja. Efek dan frame diedit di bagian atas js/booth.js (FX, LAYOUTS, COLORS).

## Lagu & GIF kucing
- Lagu: taruh file di assets/audio/ lalu daftarkan di js/music.js (array SONGS). Musik mulai saat tombol "AKU DATANG!" ditekan (browser butuh interaksi dulu). Lagu default adalah Happy Birthday versi music box buatan sendiri.
- GIF kucing ada di assets/gif/ (cat-bounce, cat-dance; yang di Compliment-O-Matic memakai wish-cuddle). Ganti dengan GIF buatanmu memakai nama file yang sama.

## Cloud of Wishes
12 awan didefinisikan di array CLOUDS (js/interactions.js). Tiap awan punya GIF kucing sendiri: assets/gif/wish-<k>.gif. Ganti dengan GIF buatanmu memakai nama file yang sama.

## Memory Vault & Cake Lab
Vault punya dua mode: Scrapbook (polaroid miring, bisa ditarik dengan mouse) dan Tumpukan (ketuk untuk membalik, geser untuk melempar). Cake Lab: opsi kue ada di OPT/TOPS di js/interactions.js, kue digambar oleh fungsi cakeSvg().

## Fitur tambahan
Semua yang perlu diubah ada di js/config.js: tanggal jadian (counter), kode dan isi Surat Rahasia. Kode surat hanya untuk seru-seruan karena tertulis di file JS. Memory Match memakai foto dari Memory Vault. Kucing penjaga: elus 5 kali untuk kejutan.

## Baru di v9 (Kawaii Edition)
- Peony dan kue sekarang punya wajah dan pipi merona; planet bisa dicubit (ketuk) dan akan memantul.
- Latar penuh bunga, hati, dan bintang yang melayang; sparkle mengikuti kursor; judul loncat-loncat.
- Confetti berupa bunga, hati, dan bintang. Tombol berbentuk gummy yang bergoyang saat disentuh.
- Cake Lab: tombol TIUP LILINNYA! setelah kue siap. Pujian dan kalimat kucing bertambah. Stiker Photobooth bertambah (🐱🍓🎀).
- Efek suara pop kecil, dimatikan lewat tombol 🔔 di pemutar musik, atau set `CUTE.sfx=false` di js/cute.js.
- Semua tambahan ada di css/cute.css dan js/cute.js. Hapus tag-nya dari index.html untuk kembali ke tampilan v8.
