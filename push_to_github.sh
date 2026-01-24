#!/bin/bash

# GitHub reponi yaratgandan so'ng, quyidagi URL'ni o'z repoingiz URL'i bilan almashtiring
# Masalan: https://github.com/username/ecocash-project.git

echo "GitHub repo URL'ini kiriting (masalan: https://github.com/username/repo-name.git):"
read REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Xato: Repo URL'i kiritilmadi!"
    exit 1
fi

# Branch nomini main ga o'zgartiramiz (agar master bo'lsa)
git branch -M main 2>/dev/null || git branch -M master

# Remote qo'shamiz
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Push qilamiz
echo "Push qilinmoqda..."
git push -u origin main 2>/dev/null || git push -u origin master

echo "✅ Muvaffaqiyatli push qilindi!"
echo "Repoingiz: $REPO_URL"

