#!/bin/bash
# Sentinel self-hosting demo
# Drop a CI task into the inbox and watch the result appear in the outbox

set -e

INBOX="${HOME}/.sentinel/inbox"
OUTBOX="${HOME}/.sentinel/outbox"

echo "Sentinel Self-Hosting Demo"
echo "========================="
echo ""
echo "This drops a task into the inbox asking Sentinel to verify itself."
echo "Make sure Sentinel is running: sentinel start --config examples/self-host.yaml"
echo ""

# Create the task file
TASK_FILE="${INBOX}/$(date +%Y-%m-%dT%H-%M-%S)--self-verify.md"
cat > "$TASK_FILE" << 'EOF'
Run the test suite and type checker for this project:

1. Run: npm test
2. Run: npx tsc --noEmit
3. Report the results — how many tests passed? Any type errors?
EOF

echo "Task queued: $TASK_FILE"
echo ""
echo "Watching outbox for results..."
echo "(Press Ctrl+C to stop watching)"
echo ""

# Watch for new files in outbox
INITIAL_COUNT=$(ls -1 "$OUTBOX" 2>/dev/null | wc -l | tr -d ' ')
while true; do
  CURRENT_COUNT=$(ls -1 "$OUTBOX" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$CURRENT_COUNT" -gt "$INITIAL_COUNT" ]; then
    echo "--- Result arrived! ---"
    echo ""
    # Show the newest file
    NEWEST=$(ls -t "$OUTBOX" | head -1)
    cat "$OUTBOX/$NEWEST"
    break
  fi
  sleep 2
done
