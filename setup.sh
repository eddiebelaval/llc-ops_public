#!/usr/bin/env bash
# ──────────────────────────────────────────────
# Claude Code OS — Setup Wizard
# ──────────────────────────────────────────────
# Run this once after cloning to personalize
# the OS with your own identity and infrastructure.
#
# Usage: ./setup.sh
# ──────────────────────────────────────────────

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Colors
BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}Claude Code OS — Setup Wizard${RESET}"
echo -e "${DIM}Personalizing your development operating system.${RESET}"
echo ""

# ── Collect identity ──────────────────────────

read -p "Your full name (e.g. Jane Smith): " FULL_NAME
read -p "Your GitHub username: " GITHUB_USER
read -p "Your primary email: " PRIMARY_EMAIL
read -p "Your domain (e.g. mycompany.app, or leave blank): " DOMAIN
read -p "Your X/Twitter handle (without @, or leave blank): " X_HANDLE
read -p "Your LinkedIn slug (e.g. jane-smith, or leave blank): " LINKEDIN_SLUG
read -p "Your Supabase project ref (or leave blank): " SUPABASE_REF
read -p "Your Supabase anon key (or leave blank): " SUPABASE_ANON_KEY

# Defaults for optional fields
DOMAIN="${DOMAIN:-your-domain.app}"
X_HANDLE="${X_HANDLE:-your-handle}"
LINKEDIN_SLUG="${LINKEDIN_SLUG:-your-profile}"
SUPABASE_REF="${SUPABASE_REF:-your-supabase-ref}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-your-supabase-anon-key}"

echo ""
echo -e "${CYAN}Personalizing files...${RESET}"

# ── Find all text files ───────────────────────

TEXT_EXTENSIONS="md|json|html|sh|js|ts|yaml|yml|toml|txt|plist|css|mjs|cjs|env.example"

find "$REPO_ROOT" -type f | grep -E "\.($TEXT_EXTENSIONS)$" | while read -r file; do
  # Skip binary files and this script
  [[ "$file" == "$REPO_ROOT/setup.sh" ]] && continue

  sed -i '' \
    -e "s|Your Name|${FULL_NAME}|g" \
    -e "s|your-username|${GITHUB_USER}|g" \
    -e "s|your-user|${GITHUB_USER}|g" \
    -e "s|your-email@example.com|${PRIMARY_EMAIL}|g" \
    -e "s|your-domain\.app|${DOMAIN}|g" \
    -e "s|your-domain\.com|${DOMAIN//.app/.com}|g" \
    -e "s|your-domain\.tech|${DOMAIN//.app/.tech}|g" \
    -e "s|your-app\.app|${DOMAIN}|g" \
    -e "s|@your-handle|@${X_HANDLE}|g" \
    -e "s|linkedin\.com/in/your-profile|linkedin.com/in/${LINKEDIN_SLUG}|g" \
    -e "s|your-supabase-ref|${SUPABASE_REF}|g" \
    -e "s|your-supabase-anon-key|${SUPABASE_ANON_KEY}|g" \
    -e "s|your-project\.supabase\.co|${SUPABASE_REF}.supabase.co|g" \
    -e "s|your-app\.vercel\.app|${GITHUB_USER}-app.vercel.app|g" \
    -e "s|your-dashboard\.vercel\.app|${GITHUB_USER}-dashboard.vercel.app|g" \
    -e "s|your-project\.vercel\.app|${GITHUB_USER}-project.vercel.app|g" \
    "$file" 2>/dev/null || true
done

# ── Count what was personalized ───────────────

FILE_COUNT=$(find "$REPO_ROOT" -type f | grep -E "\.($TEXT_EXTENSIONS)$" | wc -l | tr -d ' ')

echo -e "${GREEN}Done.${RESET} Personalized ${BOLD}${FILE_COUNT}${RESET} files."
echo ""

# ── Optional: init git ────────────────────────

echo -e "${YELLOW}Next steps:${RESET}"
echo "  1. Review the changes: git diff (if already a repo)"
echo "  2. Initialize git:     git init && git add -A && git commit -m 'init: personalized Claude Code OS'"
echo "  3. Push to GitHub:     gh repo create my-dev-os --private --push"
echo ""
echo -e "${DIM}You can delete this setup.sh after running it.${RESET}"
