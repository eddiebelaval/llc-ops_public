#!/bin/bash
# morning-briefing.sh - Daily morning status report
# Runs: 8 AM daily via launchd
# Logs: ~/Library/Logs/claude-automation/morning-briefing/

set -euo pipefail

# Configuration
LOGS_DIR="$HOME/Library/Logs/claude-automation/morning-briefing"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOGS_DIR/briefing-$DATE.log"
REPORT_FILE="$LOGS_DIR/report-$DATE.md"

# Create logs directory
mkdir -p "$LOGS_DIR"

# Start logging
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "========================================"
log "Morning Briefing Report"
log "Started: $(date)"
log "========================================"

# Initialize sections
SYSTEM_STATUS=""
PROJECT_STATUS=""
TODAY_PRIORITIES=""
HYDRA_STATUS=""

# ═══════════════════════════════════════════════════════════════
# SYSTEM HEALTH CHECK
# ═══════════════════════════════════════════════════════════════

log "Step 1: System health check..."

# Check HYDRA status
if command -v hydra &> /dev/null; then
    hydra_output=$(hydra status 2>/dev/null || echo "HYDRA offline")
    HYDRA_STATUS="✅ HYDRA System Active"
    
    # Check for any issues
    if echo "$hydra_output" | grep -q "undelivered"; then
        HYDRA_STATUS="⚠️  HYDRA has undelivered notifications"
    fi
else
    HYDRA_STATUS="❌ HYDRA command not available"
fi

# Check Splinter backup
if [ -d "/Volumes/Splinter" ]; then
    BACKUP_SIZE=$(du -sh /Volumes/Splinter/the-user-development 2>/dev/null | cut -f1 || echo "Unknown")
    SYSTEM_STATUS+="**Splinter Backup:** ✅ $BACKUP_SIZE mirrored\n"
else
    SYSTEM_STATUS+="**Splinter Backup:** ❌ Drive not mounted\n"
fi

# Check Homer production
if curl -s --connect-timeout 5 https://tryhomer.vip/gus > /dev/null 2>&1; then
    SYSTEM_STATUS+="**Homer Production:** ✅ Live and responding\n"
else
    SYSTEM_STATUS+="**Homer Production:** ⚠️  Not responding\n"
fi

# Check key launchd jobs
ACTIVE_JOBS=$(launchctl list | grep -c "com.id8labs\|com.hydra" || echo "0")
SYSTEM_STATUS+="**Automation Jobs:** $ACTIVE_JOBS active\n"

# ═══════════════════════════════════════════════════════════════
# PROJECT STATUS
# ═══════════════════════════════════════════════════════════════

log "Step 2: Project status scan..."

# Check git status for key projects
KEY_PROJECTS=("Homer" "id8/id8labs" "pura-vida")

for project in "${KEY_PROJECTS[@]}"; do
    project_path="$HOME/Development/$project"
    if [ -d "$project_path" ]; then
        cd "$project_path"
        
        # Get git status
        if [ -d ".git" ]; then
            branch=$(git branch --show-current 2>/dev/null || echo "unknown")
            uncommitted=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
            
            PROJECT_STATUS+="**$(basename $project):** Branch: $branch"
            if [ "$uncommitted" -gt 0 ]; then
                PROJECT_STATUS+=" ($uncommitted uncommitted changes)"
            fi
            PROJECT_STATUS+="\n"
        fi
    fi
done

# ═══════════════════════════════════════════════════════════════
# TODAY'S PRIORITIES
# ═══════════════════════════════════════════════════════════════

log "Step 3: Priority identification..."

# Check for urgent deadlines in memory
MEMORY_FILE="$HOME/clawd/memory/$(date +%Y-%m-%d).md"
if [ -f "$MEMORY_FILE" ]; then
    # Look for priority markers
    priorities=$(grep -E "(URGENT|Priority|TODO)" "$MEMORY_FILE" 2>/dev/null | head -3 || echo "")
    if [ -n "$priorities" ]; then
        TODAY_PRIORITIES+="**From Memory:**\n$priorities\n\n"
    fi
fi

# Check yesterday's evening report for carry-over items
YESTERDAY_REPORT="$HOME/Library/Logs/claude-automation/evening-kickoff/report-$(date -d 'yesterday' +%Y-%m-%d 2>/dev/null || date -j -v-1d +%Y-%m-%d).md"
if [ -f "$YESTERDAY_REPORT" ]; then
    priority_actions=$(grep -A 5 "## Priority Actions" "$YESTERDAY_REPORT" 2>/dev/null | tail -n +2 || echo "")
    if [ -n "$priority_actions" ] && [ "$priority_actions" != "No priority actions identified." ]; then
        TODAY_PRIORITIES+="**From Yesterday:**\n$priority_actions\n"
    fi
fi

if [ -z "$TODAY_PRIORITIES" ]; then
    TODAY_PRIORITIES="No urgent priorities identified. Good time for strategic work.\n"
fi

# ═══════════════════════════════════════════════════════════════
# GENERATE REPORT
# ═══════════════════════════════════════════════════════════════

log "Generating morning briefing report..."

cat > "$REPORT_FILE" << EOF
# 🌅 Morning Briefing
**Date:** $(date '+%A, %B %d, %Y')
**Time:** $(date '+%H:%M %Z')

---

## 🚦 System Status

$HYDRA_STATUS

$(echo -e "$SYSTEM_STATUS")

---

## 📊 Project Status

$(echo -e "$PROJECT_STATUS")

---

## 🎯 Today's Priorities

$(echo -e "$TODAY_PRIORITIES")

---

## 💡 Quick Actions

1. Check Telegram for overnight messages
2. Review any GitHub notifications
3. Pick 1-2 priorities to tackle first
4. Schedule any urgent meetings/calls

---

## 🗓️ Time Blocks Available

**Morning (8 AM - 12 PM):** Deep work
**Afternoon (12 PM - 6 PM):** Meetings & communication  
**Evening (6 PM - 10 PM):** Building & shipping

---

*Good morning! Ready to make today count.* ☕

---
*Generated by morning-briefing.sh*
*Log: $LOG_FILE*
EOF

# Display the report on screen
echo ""
echo "========================================"
echo "🌅 MORNING BRIEFING"
echo "========================================"
cat "$REPORT_FILE"
echo "========================================"

# Also open in default markdown viewer
if command -v open &> /dev/null; then
    open "$REPORT_FILE"
fi

# Send notification
if command -v terminal-notifier &> /dev/null; then
    terminal-notifier -title "Morning Briefing Ready" \
        -message "Today's briefing is displayed. Check your screen!" \
        -sound default
fi

log "========================================"
log "Morning Briefing Complete"
log "Finished: $(date)"
log "Report: $REPORT_FILE"
log "========================================"

exit 0