#!/bin/bash

# HYDRA Cost Monitor - Track expensive Claude usage

COST_LOG="$HOME/.hydra/costs/daily-$(date +%Y%m%d).log"
NOTIFY="$HOME/.hydra/daemons/notify-user.sh"
mkdir -p "$(dirname "$COST_LOG")"

# Count running processes
CLAUDE_PROCESSES=$(ps aux | grep -c "[c]laude")
OPENCLAW_GATEWAY=$(ps aux | grep -c "[o]penclaw-gateway")

# Get approximate token usage (very rough estimate)
TOKEN_ESTIMATE=$((CLAUDE_PROCESSES * 1000))  # rough tokens per process

# Log the data
echo "$(date): Claude processes: $CLAUDE_PROCESSES, Estimated tokens: $TOKEN_ESTIMATE" >> "$COST_LOG"

# Alert if too many processes (but NEVER kill — alert only)
if [ "$CLAUDE_PROCESSES" -gt 3 ]; then
    ALERT_MSG="$CLAUDE_PROCESSES Claude processes running (expected 1-2). Estimated burn: ~$((CLAUDE_PROCESSES * 5))/hour."
    echo "COST ALERT: $ALERT_MSG"

    # Send notification via Telegram
    if [[ -x "$NOTIFY" ]]; then
        "$NOTIFY" urgent "Cost Alert" "$ALERT_MSG" 2>/dev/null || true
    fi
fi

# Show current status
echo "HYDRA Cost Status:"
echo "- Claude processes: $CLAUDE_PROCESSES"
echo "- OpenClaw gateway: $OPENCLAW_GATEWAY"
echo "- Estimated hourly cost: ~\$2-5"
