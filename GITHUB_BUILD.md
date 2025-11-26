# Build dengan GitHub Actions

Panduan lengkap untuk build aplikasi TermuxTerminal menggunakan GitHub Actions - 100% dari Termux!

## Keuntungan GitHub Actions

✅ Build di cloud (tidak perlu PC/Laptop)
✅ Gratis untuk public repository
✅ Auto-build setiap push code
✅ Download APK langsung dari GitHub
✅ Bisa dijalankan dari Termux

## Setup Awal (Sekali Saja)

### 1. Install Git di Termux

```bash
pkg install git gh
```

### 2. Setup Git Config

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```

### 3. Login ke GitHub

```bash
gh auth login
```

Pilih:
- GitHub.com
- HTTPS
- Yes (authenticate Git)
- Login with a web browser
- Copy kode yang muncul, buka browser, paste kode

### 4. Create Repository di GitHub

**Option A: Via GitHub CLI (Termux)**
```bash
cd /data/data/com.termux/files/home/TermuxTerminal
gh repo create termux-terminal --public --source=. --remote=origin --push
```

**Option B: Via Web Browser**
1. Buka https://github.com/new
2. Repository name: `termux-terminal`
3. Public/Private: pilih **Public** (agar gratis)
4. Jangan centang "Initialize with README"
5. Click "Create repository"

Lalu di Termux:
```bash
cd /data/data/com.termux/files/home/TermuxTerminal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/termux-terminal.git
git push -u origin main
```

## Cara Build APK

### Push Code untuk Trigger Build

Setiap kali Anda push code, GitHub Actions akan auto-build APK:

```bash
cd /data/data/com.termux/files/home/TermuxTerminal

# Edit code (optional)
nano src/components/Terminal.tsx

# Commit changes
git add .
git commit -m "Update: description of changes"

# Push to GitHub (ini akan trigger build!)
git push
```

### Monitor Build Progress

**Option 1: Via GitHub CLI**
```bash
gh run list
gh run watch
```

**Option 2: Via Browser**
1. Buka https://github.com/USERNAME/termux-terminal
2. Click tab "Actions"
3. Lihat build progress real-time

Build biasanya selesai dalam **5-10 menit**.

## Download APK

### Method 1: Via GitHub CLI (Termux)

```bash
# List available artifacts
gh run list --limit 5

# Download latest APK
gh run download

# APK akan ada di folder saat ini
ls -la app-release/
```

### Method 2: Via Browser

1. Buka https://github.com/USERNAME/termux-terminal/actions
2. Click workflow run yang sudah selesai (✓ hijau)
3. Scroll ke "Artifacts"
4. Download **app-release**
5. Extract zip, install APK di Android

### Method 3: Via Releases (Auto)

Jika build di branch `main`, APK akan otomatis masuk ke Releases:

1. Buka https://github.com/USERNAME/termux-terminal/releases
2. Click release terbaru
3. Download `app-release.apk`
4. Install di Android device

## Transfer APK ke Android

### Via Termux Storage

```bash
# Pastikan storage permission
termux-setup-storage

# Copy APK ke Downloads
cp app-release/app-release.apk ~/storage/downloads/

# Buka File Manager di Android, install dari Downloads
```

### Via ADB (Jika device terhubung)

```bash
pkg install android-tools
adb install app-release/app-release.apk
```

## Workflow Sehari-hari

```bash
# 1. Edit code di Termux
cd /data/data/com.termux/files/home/TermuxTerminal
nano src/App.tsx

# 2. Test perubahan (optional - lihat code)
cat src/App.tsx

# 3. Commit & push
git add .
git commit -m "Add new feature"
git push

# 4. Wait 5-10 minutes

# 5. Download APK
gh run download

# 6. Install di Android
cp app-release/app-release.apk ~/storage/downloads/
```

## Troubleshooting

### Build Failed

**Check logs:**
```bash
gh run view --log
```

Atau via browser di tab Actions.

**Common issues:**

1. **Dependency error**: Update package.json versions
2. **Gradle error**: Biasanya auto-resolve di build berikutnya
3. **Memory error**: Retry build (re-run workflow)

### Re-run Failed Build

```bash
gh run rerun
```

Atau via browser: Click "Re-run jobs"

### Manual Trigger Build

Tanpa push code:
```bash
gh workflow run android-build.yml
```

## Advanced Configuration

### Build Debug APK (Lebih Cepat)

Edit `.github/workflows/android-build.yml`:

```yaml
- name: Build Android Debug
  run: |
    cd android
    ./gradlew assembleDebug --no-daemon
```

Debug APK lebih cepat (3-5 menit) tapi lebih besar size-nya.

### Build untuk Multiple Architectures

Tambahkan di `android/app/build.gradle`:

```gradle
splits {
    abi {
        enable true
        reset()
        include 'x86', 'x86_64', 'armeabi-v7a', 'arm64-v8a'
        universalApk true
    }
}
```

Akan generate APK untuk semua architecture.

### Add Signing Key (Production)

1. Generate keystore di PC/Laptop:
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore termux-terminal.keystore \
  -alias termux-terminal \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. Convert ke base64:
```bash
base64 termux-terminal.keystore > keystore.base64
```

3. Tambahkan secrets di GitHub:
   - Settings → Secrets → New repository secret
   - `KEYSTORE_BASE64`: paste content dari keystore.base64
   - `KEYSTORE_PASSWORD`: password Anda
   - `KEY_ALIAS`: termux-terminal
   - `KEY_PASSWORD`: password Anda

4. Update workflow untuk signed APK (bisa ditambahkan nanti)

## Monitoring & Logs

### View Recent Builds

```bash
gh run list --limit 10
```

### View Build Logs

```bash
gh run view --log
```

### Build Status Badge

Tambahkan di README.md:

```markdown
![Android Build](https://github.com/USERNAME/termux-terminal/actions/workflows/android-build.yml/badge.svg)
```

## Limits & Quota

GitHub Actions gratis untuk public repos dengan limits:

- **2,000 minutes/month** untuk private repos
- **Unlimited** untuk public repos
- Build duration: ~5-10 menit per build
- Artifact retention: 90 days
- Max artifact size: 2GB

Jadi Anda bisa build ~300 kali per bulan gratis (untuk private repo), atau unlimited untuk public repo!

## Tips

1. **Push saat Anda tidur** - build selesai saat bangun
2. **Batch commits** - jangan push tiap perubahan kecil
3. **Test di local dulu** - check syntax errors
4. **Use draft releases** - jika tidak mau auto-publish

## Summary

```bash
# One-time setup
gh auth login
gh repo create termux-terminal --public --source=. --push

# Daily workflow
nano src/App.tsx      # Edit
git add .              # Stage
git commit -m "msg"    # Commit
git push               # Build!
gh run watch           # Monitor
gh run download        # Get APK
```

That's it! 🚀 Sekarang Anda bisa develop React Native apps 100% dari Termux!

---

**Next:** Setelah APK berhasil, install di device dan test aplikasi!
