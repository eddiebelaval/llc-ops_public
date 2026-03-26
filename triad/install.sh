#!/bin/bash
# Triad Installer
# Copies templates, commands, and skills to ~/.claude/

set -e

CLAUDE_DIR="${HOME}/.claude"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DRY_RUN=false
UNINSTALL=false

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --uninstall) UNINSTALL=true ;;
    --help|-h)
      echo "Usage: ./install.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run     Preview what will be installed"
      echo "  --uninstall   Remove all Triad files from ~/.claude/"
      echo "  --help, -h    Show this help"
      exit 0
      ;;
  esac
done

# Files to install
COMMANDS=(reconcile roadmap drift changelog pitch debt onboard morning)
SKILLS_DIRS=("reconcile" "triad-derive")

if [ "$UNINSTALL" = true ]; then
  echo -e "${YELLOW}Uninstalling Triad...${NC}"
  for cmd in "${COMMANDS[@]}"; do
    if [ -f "${CLAUDE_DIR}/commands/${cmd}.md" ]; then
      echo "  Removing commands/${cmd}.md"
      [ "$DRY_RUN" = false ] && rm "${CLAUDE_DIR}/commands/${cmd}.md"
    fi
  done
  for skill in "${SKILLS_DIRS[@]}"; do
    if [ -d "${CLAUDE_DIR}/skills/${skill}" ]; then
      echo "  Removing skills/${skill}/"
      [ "$DRY_RUN" = false ] && rm -rf "${CLAUDE_DIR}/skills/${skill}"
    fi
  done
  echo -e "${GREEN}Triad uninstalled.${NC}"
  exit 0
fi

echo -e "${YELLOW}Installing Triad...${NC}"
echo ""

# Ensure directories exist
[ "$DRY_RUN" = false ] && mkdir -p "${CLAUDE_DIR}/commands" "${CLAUDE_DIR}/skills" "${CLAUDE_DIR}/doc-templates"

# Install commands
echo "Commands:"
for cmd in "${COMMANDS[@]}"; do
  src="${SCRIPT_DIR}/commands/${cmd}.md"
  dst="${CLAUDE_DIR}/commands/${cmd}.md"
  if [ -f "$src" ]; then
    if [ -f "$dst" ]; then
      echo -e "  ${YELLOW}[UPDATE]${NC} commands/${cmd}.md"
    else
      echo -e "  ${GREEN}[NEW]${NC} commands/${cmd}.md"
    fi
    [ "$DRY_RUN" = false ] && cp "$src" "$dst"
  fi
done

echo ""

# Install skills
echo "Skills:"
for skill in "${SKILLS_DIRS[@]}"; do
  src_dir="${SCRIPT_DIR}/skills/${skill}"
  dst_dir="${CLAUDE_DIR}/skills/${skill}"
  if [ -d "$src_dir" ]; then
    [ "$DRY_RUN" = false ] && mkdir -p "$dst_dir"
    for file in "$src_dir"/*.md; do
      if [ -f "$file" ]; then
        fname=$(basename "$file")
        if [ -f "${dst_dir}/${fname}" ]; then
          echo -e "  ${YELLOW}[UPDATE]${NC} skills/${skill}/${fname}"
        else
          echo -e "  ${GREEN}[NEW]${NC} skills/${skill}/${fname}"
        fi
        [ "$DRY_RUN" = false ] && cp "$file" "${dst_dir}/${fname}"
      fi
    done
  fi
done

echo ""

# Install templates
echo "Templates:"
for tmpl in vision spec; do
  src="${SCRIPT_DIR}/templates/${tmpl}.md"
  dst="${CLAUDE_DIR}/doc-templates/${tmpl}.md"
  if [ -f "$src" ]; then
    if [ -f "$dst" ]; then
      echo -e "  ${YELLOW}[UPDATE]${NC} doc-templates/${tmpl}.md"
    else
      echo -e "  ${GREEN}[NEW]${NC} doc-templates/${tmpl}.md"
    fi
    [ "$DRY_RUN" = false ] && cp "$src" "$dst"
  fi
done

echo ""
echo -e "${GREEN}Triad installed.${NC}"
echo ""
echo "Available commands:"
echo "  /reconcile          Maintain the triangle"
echo "  /roadmap            Prioritized build order"
echo "  /drift              Trajectory analysis"
echo "  /changelog          What shipped recently"
echo "  /pitch              Vision + proof narrative"
echo "  /debt               Tech + product debt scan"
echo "  /onboard            New contributor guide"
echo "  /morning            Daily brief with triangle health"
echo ""
echo "Start: Create VISION.md + SPEC.md at your project root, or run /reconcile init"
