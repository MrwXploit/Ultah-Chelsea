#!/usr/bin/env python3
"""
Peony Planet: kompres foto supaya website ringan dan cepat dibuka di HP.

Cara pakai (dari folder proyek):
    pip install pillow
    python tools/optimize-photos.py

Yang dilakukan:
  1. Mengambil foto bernomor di assets/photos/ (01.jpg ... 40.jpg; png/webp juga boleh).
  2. Menyimpan salinan ASLI ke assets/photos/_original/ (tidak pernah ditimpa).
  3. Menulis ulang assets/photos/NN.jpg: sisi terpanjang maks 1400 px, kualitas 82,
     orientasi EXIF dibetulkan (foto HP yang miring jadi tegak).
  4. Membuat thumbnail 480 px di assets/photos/thumbs/NN.jpg.
  5. Mengubah USE_THUMBS menjadi true di js/memories.js.

Aman dijalankan berkali-kali: selalu memproses dari salinan asli di _original/.
Folder _original/ tidak perlu ikut diunggah saat website dipublikasikan.
Format HEIC (iPhone) belum didukung: ekspor ke JPG dulu.
"""
import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow belum terpasang. Jalankan dulu:  pip install pillow")

MAX_MAIN, MAX_THUMB = 1400, 480
Q_MAIN, Q_THUMB = 82, 78
EXTS = {".jpg", ".jpeg", ".png", ".webp"}

root = Path(__file__).resolve().parent.parent
folder = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else root / "assets" / "photos"
if not folder.is_dir():
    sys.exit(f"Folder tidak ditemukan: {folder}")

backup = folder / "_original"
thumbs = folder / "thumbs"
backup.mkdir(exist_ok=True)
thumbs.mkdir(exist_ok=True)


def save_jpeg(img, path, longest, quality):
    img = img.copy()
    img.thumbnail((longest, longest), Image.LANCZOS)  # tidak memperbesar foto kecil
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def to_rgb(img):
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        bg = Image.new("RGB", rgba.size, (255, 255, 255))
        bg.paste(rgba, mask=rgba.split()[-1])
        return bg
    return img.convert("RGB")


# 1) cadangkan foto bernomor yang ada di folder utama
sources = {}
for f in sorted(folder.iterdir()):
    if f.is_file() and f.suffix.lower() in EXTS and f.stem.isdigit():
        dest = backup / f.name
        if not dest.exists():
            shutil.copy2(f, dest)
        sources[int(f.stem)] = dest
    elif f.is_file() and f.suffix.lower() in {".heic", ".heif"}:
        print(f"  dilewati {f.name}: HEIC belum didukung, ekspor ke JPG dulu")
    elif f.is_file() and not f.name.startswith(".") and f.suffix.lower() in EXTS:
        print(f"  dilewati {f.name}: nama harus berupa nomor, mis. 07.jpg")

# foto yang sudah pernah dipindah ke _original/ tetap ikut diproses ulang
for f in sorted(backup.iterdir()):
    if f.is_file() and f.suffix.lower() in EXTS and f.stem.isdigit():
        sources.setdefault(int(f.stem), f)

if not sources:
    sys.exit("Belum ada foto bernomor (01.jpg, 02.jpg, ...) di " + str(folder))

before = after = 0
for n in sorted(sources):
    src = sources[n]
    name = f"{n:02d}.jpg"
    with Image.open(src) as im:
        im = to_rgb(ImageOps.exif_transpose(im))
        save_jpeg(im, folder / name, MAX_MAIN, Q_MAIN)
        save_jpeg(im, thumbs / name, MAX_THUMB, Q_THUMB)
    # kalau nama/format aslinya beda (05.png, 5.jpg, 07.JPG), hapus salinan lama di folder utama (cadangan ada di _original)
    old = folder / src.name
    if old.exists() and old != folder / name:
        old.unlink()
    b, a = src.stat().st_size, (folder / name).stat().st_size
    before += b
    after += a
    print(f"  {name}: {b/1024:7.0f} KB -> {a/1024:6.0f} KB")

print(f"\nSelesai: {len(sources)} foto, {before/1048576:.1f} MB -> {after/1048576:.1f} MB")

# 5) aktifkan thumbnail di memories.js
mem = root / "js" / "memories.js"
if mem.exists():
    s = mem.read_text(encoding="utf-8")
    if re.search(r"USE_THUMBS\s*=\s*false", s):
        mem.write_text(re.sub(r"USE_THUMBS\s*=\s*false", "USE_THUMBS=true", s), encoding="utf-8")
        print("USE_THUMBS di js/memories.js sudah diaktifkan.")
    elif "USE_THUMBS" not in s:
        print("Catatan: js/memories.js tidak punya USE_THUMBS, thumbnail belum terpakai.")
