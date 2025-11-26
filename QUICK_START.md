# TermuxTerminal - Quick Start Guide

## Cara Tercepat untuk Mulai Menggunakan

### Jika Anda Sudah Punya APK
1. Transfer file APK ke Android device Anda
2. Buka file APK melalui File Manager
3. Install (izinkan instalasi dari unknown sources jika diminta)
4. Buka aplikasi dan mulai gunakan!

### Jika Anda Ingin Build dari Source

**PENTING:** Anda TIDAK BISA build di Termux! Gunakan PC/Laptop.

#### Minimal Steps:

```bash
# 1. Clone/Copy project ke PC Anda
cd TermuxTerminal

# 2. Install dependencies
npm install

# 3. Connect Android device atau start emulator

# 4. Run development build
npm run android
```

## Fitur-Fitur Utama

### 1. Terminal Commands
- Ketik command seperti di terminal biasa
- Support untuk: ls, cd, cat, mkdir, rm, dll
- Gunakan Tab key dari keyboard khusus untuk autocomplete

### 2. Multiple Tabs
- Tap tombol "+" untuk membuat session baru
- Tap nama tab untuk switch session
- Tap "×" untuk close session

### 3. File Browser
- Tap tombol "Files" di top bar
- Navigate menggunakan folder hierarchy
- Tap file untuk view content
- Tap "Select This Dir" untuk set working directory

### 4. Custom Keyboard
- Toggle dengan tombol "Show Keys" / "Hide Keys"
- Scroll horizontal untuk lihat semua keys
- Keys tersedia:
  - ESC, TAB, CTRL, ALT
  - Arrow keys (UP, DOWN, LEFT, RIGHT)
  - Function keys (F1-F8)
  - Symbols: /, -, |, >, <, &, ~, $

## Tips Penggunaan

### Command Examples:
```bash
# List files
ls -la

# Change directory
cd /sdcard

# View file content
cat filename.txt

# Create directory
mkdir new_folder

# Remove file
rm filename.txt

# Check current directory
pwd

# Clear screen (tambahkan beberapa newlines)
clear
```

### Keyboard Shortcuts:
- **TAB**: Autocomplete (dari custom keyboard)
- **UP/DOWN arrows**: Command history (dari custom keyboard)
- **ESC**: Cancel current command (dari custom keyboard)

### Best Practices:
1. Gunakan multiple tabs untuk different tasks
2. Toggle keyboard visibility untuk save screen space
3. Use file browser untuk quick navigation
4. Tap terminal area untuk focus input

## Common Issues

### "Permission Denied"
- Aplikasi terbatas pada accessible directories saja
- Try navigate ke /sdcard atau app's private directory

### "Command not found"
- System commands mungkin berbeda dengan Termux
- Beberapa commands tidak tersedia di Android sandbox

### Keyboard tidak muncul
- Tap area terminal untuk trigger keyboard
- Use toggle button untuk show/hide custom keyboard

## Untuk Developer

### Edit Code di Termux
Anda bisa edit source code di Termux menggunakan editor seperti:
- `nano`, `vim`, `micro`
- VS Code Server

Tapi untuk BUILD, transfer ke PC/Laptop.

### Sync Files
```bash
# Di Termux, sync ke PC via git
git add .
git commit -m "Update from Termux"
git push

# Di PC, pull changes
git pull

# Build
npm run android
```

## Next Steps

1. **Customize**: Edit components di `src/components/`
2. **Add Features**: Tambahkan features baru
3. **Style**: Modify colors di StyleSheet
4. **Build**: Follow BUILD_INSTRUCTIONS.md untuk production build

## Need Help?

- Check BUILD_INSTRUCTIONS.md untuk detailed instructions
- Check source code comments untuk implementation details
- Open issue di GitHub jika menemukan bugs

---

Happy Coding! 🚀
