#!/data/data/com.termux/files/usr/bin/bash

# TermuxTerminal - GitHub Setup Script
# Script ini akan membantu setup GitHub repository dan push pertama kali

echo "========================================="
echo "  TermuxTerminal - GitHub Setup"
echo "========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git belum terinstall!"
    echo "📦 Installing git..."
    pkg install git -y
fi

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI belum terinstall!"
    echo "📦 Installing gh..."
    pkg install gh -y
fi

echo ""
echo "✅ Git dan GitHub CLI sudah terinstall"
echo ""

# Check if already logged in to GitHub
if gh auth status &> /dev/null; then
    echo "✅ Sudah login ke GitHub"
else
    echo "🔐 Belum login ke GitHub"
    echo "📝 Silakan login dengan perintah berikut:"
    echo ""
    echo "    gh auth login"
    echo ""
    echo "Pilih:"
    echo "  - GitHub.com"
    echo "  - HTTPS"
    echo "  - Yes (authenticate Git)"
    echo "  - Login with a web browser"
    echo ""
    read -p "Sudah login? (y/n): " logged_in
    if [ "$logged_in" != "y" ]; then
        echo "❌ Harap login terlebih dahulu dengan: gh auth login"
        exit 1
    fi
fi

echo ""
echo "📋 Setup Git Configuration"
echo ""

# Get current git config
current_name=$(git config --global user.name 2>/dev/null)
current_email=$(git config --global user.email 2>/dev/null)

if [ -z "$current_name" ]; then
    read -p "Nama Anda: " git_name
    git config --global user.name "$git_name"
else
    echo "   Name: $current_name ✓"
fi

if [ -z "$current_email" ]; then
    read -p "Email Anda: " git_email
    git config --global user.email "$git_email"
else
    echo "   Email: $current_email ✓"
fi

echo ""
echo "📝 Masukkan informasi repository"
echo ""

read -p "Nama repository (default: termux-terminal): " repo_name
repo_name=${repo_name:-termux-terminal}

read -p "Deskripsi (default: Terminal Emulator for Android): " repo_desc
repo_desc=${repo_desc:-"Terminal Emulator for Android"}

read -p "Public atau Private? (public/private, default: public): " repo_visibility
repo_visibility=${repo_visibility:-public}

echo ""
echo "🔍 Preview:"
echo "   Repository: $repo_name"
echo "   Deskripsi: $repo_desc"
echo "   Visibility: $repo_visibility"
echo ""

read -p "Lanjutkan? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "❌ Setup dibatalkan"
    exit 1
fi

echo ""
echo "🚀 Creating GitHub repository..."
echo ""

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: TermuxTerminal v1.0"

# Create GitHub repository and push
if gh repo create "$repo_name" --$repo_visibility --source=. --remote=origin --push --description "$repo_desc"; then
    echo ""
    echo "========================================="
    echo "  ✅ Setup Berhasil!"
    echo "========================================="
    echo ""
    echo "Repository: https://github.com/$(gh api user --jq .login)/$repo_name"
    echo ""
    echo "📊 GitHub Actions akan mulai build APK otomatis."
    echo "   Proses ini memakan waktu sekitar 5-10 menit."
    echo ""
    echo "🔍 Monitor build progress:"
    echo "   gh run list"
    echo "   gh run watch"
    echo ""
    echo "📥 Download APK setelah build selesai:"
    echo "   gh run download"
    echo ""
    echo "📖 Dokumentasi lengkap:"
    echo "   cat GITHUB_BUILD.md"
    echo ""
    echo "Happy coding! 🚀"
else
    echo ""
    echo "❌ Gagal membuat repository"
    echo ""
    echo "Troubleshooting:"
    echo "1. Cek koneksi internet"
    echo "2. Pastikan sudah login: gh auth status"
    echo "3. Coba manual:"
    echo "   gh repo create $repo_name --$repo_visibility"
    echo "   git remote add origin https://github.com/USERNAME/$repo_name.git"
    echo "   git push -u origin main"
fi
