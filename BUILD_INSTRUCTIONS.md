# TermuxTerminal - Build Instructions

## Overview
TermuxTerminal adalah aplikasi terminal emulator Android yang dibangun dengan React Native, dilengkapi dengan:
- Terminal emulator lengkap dengan command execution
- File browser untuk navigasi file system
- Multiple terminal sessions (tabs)
- Custom keyboard dengan tombol khusus (Ctrl, Alt, Arrow keys, dll)
- Dark theme yang nyaman untuk mata

## Prerequisites

**PENTING:** Aplikasi ini TIDAK BISA dibangun langsung di Termux karena keterbatasan teknis. Anda perlu menggunakan komputer (Linux, macOS, atau Windows) untuk membangun aplikasi ini.

### Yang Dibutuhkan:

1. **Node.js** (versi 18 atau lebih baru)
   - Download dari https://nodejs.org

2. **Java Development Kit (JDK) 17**
   - Download dari https://www.oracle.com/java/technologies/downloads/

3. **Android Studio**
   - Download dari https://developer.android.com/studio
   - Install Android SDK (API Level 33 atau lebih baru)
   - Install Android NDK

4. **Git**
   - Untuk clone project ini

## Setup Environment

### 1. Install Dependencies

```bash
cd TermuxTerminal
npm install
```

### 2. Setup Android Environment

Tambahkan ke file `~/.bashrc` atau `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export JAVA_HOME=/path/to/your/jdk17
```

Reload shell:
```bash
source ~/.bashrc  # atau source ~/.zshrc
```

## Building the App

### Development Build (dengan Metro Bundler)

1. **Start Metro Bundler:**
```bash
npm start
```

2. **Di terminal baru, jalankan di Android:**
```bash
npm run android
```

atau

```bash
npx react-native run-android
```

### Production Build (APK Release)

1. **Generate Release Keystore (hanya sekali):**

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore termux-terminal-release.keystore -alias termux-terminal -keyalg RSA -keysize 2048 -validity 10000
```

Ingat password yang Anda gunakan!

2. **Configure Gradle untuk Signing:**

Buat file `android/gradle.properties` dan tambahkan:

```properties
MYAPP_RELEASE_STORE_FILE=termux-terminal-release.keystore
MYAPP_RELEASE_KEY_ALIAS=termux-terminal
MYAPP_RELEASE_STORE_PASSWORD=your_password_here
MYAPP_RELEASE_KEY_PASSWORD=your_password_here
```

3. **Build Release APK:**

```bash
cd android
./gradlew assembleRelease
```

APK akan berada di: `android/app/build/outputs/apk/release/app-release.apk`

4. **Build Release AAB (untuk Google Play Store):**

```bash
cd android
./gradlew bundleRelease
```

AAB akan berada di: `android/app/build/outputs/bundle/release/app-release.aab`

## Installation di Android Device

### Method 1: Via USB (ADB)

1. Enable Developer Options dan USB Debugging di Android device
2. Connect device via USB
3. Install APK:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Method 2: Transfer File

1. Copy file `app-release.apk` ke Android device (via USB, email, cloud storage, dll)
2. Di Android device, buka File Manager
3. Tap pada file APK
4. Izinkan instalasi dari unknown sources jika diminta
5. Install aplikasi

## Troubleshooting

### Build Error: "SDK location not found"

Buat file `android/local.properties`:
```properties
sdk.dir=/path/to/your/Android/Sdk
```

### Build Error: "Cannot find JDK"

Pastikan JAVA_HOME sudah di-set dengan benar:
```bash
echo $JAVA_HOME
```

### Metro Bundler Error

Clear cache:
```bash
npm start -- --reset-cache
```

### Gradle Build Error

Clean dan rebuild:
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

## Features

### 1. Terminal Emulator
- Execute shell commands
- Display command output dan errors
- Support untuk working directory navigation
- History dari command yang dijalankan

### 2. File Browser
- Browse file system
- Navigate directories
- View file details (size, permissions, modification date)
- Select files untuk view content
- Select directories untuk change working directory

### 3. Multiple Sessions
- Create multiple terminal sessions
- Switch between sessions dengan tabs
- Close sessions (minimum 1 session aktif)
- Independent working directory untuk setiap session

### 4. Custom Keyboard
- Special keys: ESC, TAB, CTRL, ALT
- Arrow keys: UP, DOWN, LEFT, RIGHT
- Function keys: F1-F8
- Common symbols: /, -, |, >, <, &, ~, $
- Toggle visibility

## Project Structure

```
TermuxTerminal/
├── src/
│   ├── components/
│   │   ├── Terminal.tsx          # Terminal UI component
│   │   ├── CustomKeyboard.tsx    # Keyboard dengan special keys
│   │   ├── FileBrowser.tsx       # File browser modal
│   │   └── TabManager.tsx        # Tab management untuk sessions
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── ShellNativeModule.ts  # Native module interface
│   └── App.tsx                   # Main app component
├── android/
│   └── app/src/main/java/com/termuxterminal/
│       ├── ShellModule.kt        # Native module untuk command execution
│       └── ShellPackage.kt       # Package registration
└── ...
```

## Development Tips

1. **Hot Reload**: Shake device atau press `R` twice untuk reload
2. **Debug Menu**: Shake device atau press `Cmd+M` (iOS) / `Ctrl+M` (Android)
3. **Logs**: Use `npx react-native log-android` untuk view logs
4. **TypeScript**: Run `npm run tsc` untuk type checking

## Known Limitations

1. **Termux Compatibility**: Karena security sandbox Android, app tidak bisa akses penuh ke Termux environment
2. **Root Commands**: Commands yang memerlukan root access tidak akan berfungsi
3. **System Commands**: Beberapa system commands mungkin tidak tersedia atau terbatas
4. **File Access**: Terbatas pada directories yang accessible oleh app

## Contributing

Jika Anda ingin berkontribusi:
1. Fork repository ini
2. Create feature branch
3. Commit changes Anda
4. Push ke branch
5. Create Pull Request

## License

MIT License - bebas digunakan dan dimodifikasi

## Support

Untuk issues atau questions, silakan buka issue di GitHub repository.

---

Dibuat dengan React Native untuk Android
