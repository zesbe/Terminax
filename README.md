# TermuxTerminal 🚀

Aplikasi **Terminal Emulator** lengkap untuk Android, dibangun dengan React Native. Develop 100% dari Termux dengan GitHub Actions!

![Android Build](https://github.com/USERNAME/termux-terminal/actions/workflows/android-build.yml/badge.svg)

## ✨ Features

- 🖥️ **Terminal Emulator** - Execute shell commands dengan output real-time
- 📁 **File Browser** - Browse dan navigate file system dengan mudah
- 📑 **Multiple Sessions** - Tab-based terminal sessions
- ⌨️ **Custom Keyboard** - Special keys: ESC, TAB, CTRL, ALT, Arrow keys, F1-F8
- 🎨 **Dark Theme** - UI yang nyaman untuk mata
- 📱 **Native Performance** - Menggunakan native Android modules

## 🚀 Quick Start

### Build dengan GitHub Actions (Recommended)

**100% dari Termux tanpa perlu PC!**

```bash
# 1. Install git & gh
pkg install git gh

# 2. Login GitHub
gh auth login

# 3. Push ke GitHub
cd /data/data/com.termux/files/home/TermuxTerminal
gh repo create termux-terminal --public --source=. --push

# 4. Wait 5-10 minutes untuk build selesai

# 5. Download APK
gh run download
```

📖 **Panduan lengkap:** [GITHUB_BUILD.md](GITHUB_BUILD.md)

### Build di PC/Laptop (Alternative)

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## 📂 Project Structure

```
TermuxTerminal/
├── src/
│   ├── components/
│   │   ├── Terminal.tsx           # Terminal UI component
│   │   ├── CustomKeyboard.tsx     # Special keyboard
│   │   ├── FileBrowser.tsx        # File browser modal
│   │   └── TabManager.tsx         # Session tabs
│   ├── types/index.ts             # TypeScript types
│   ├── utils/ShellNativeModule.ts # Native module interface
│   └── App.tsx                    # Main app
├── android/
│   └── app/src/main/java/com/termuxterminal/
│       ├── ShellModule.kt         # Command execution
│       └── ShellPackage.kt        # Module registration
└── .github/workflows/
    └── android-build.yml          # GitHub Actions config
```

## 📚 Documentation

- **[GITHUB_BUILD.md](GITHUB_BUILD.md)** - Build dengan GitHub Actions (100% dari Termux)
- **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - Build manual di PC/Laptop
- **[QUICK_START.md](QUICK_START.md)** - Quick reference untuk penggunaan

## 🛠️ Development

### Edit Code di Termux

```bash
# Install editor
pkg install nano vim micro

# Edit components
cd /data/data/com.termux/files/home/TermuxTerminal
nano src/components/Terminal.tsx

# Commit & push (auto build di GitHub)
git add .
git commit -m "Update Terminal component"
git push
```

### Workflow

1. ✏️ Edit code di Termux
2. 📤 Push ke GitHub
3. ⏳ Wait 5-10 menit (auto build)
4. 📥 Download APK
5. 📱 Install di Android

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - bebas digunakan dan dimodifikasi

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev)
- Icons from various sources
- Inspired by Termux

## 📧 Support

Untuk issues atau questions:
- Open issue di GitHub
- Check existing documentation
- Review source code comments

---

**Made with ❤️ in Termux**
