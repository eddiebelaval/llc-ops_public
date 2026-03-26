#!/bin/bash
# Grant Full Disk Access to Clawdbot and Node.js binaries
#
# This script will open System Settings to the Full Disk Access panel
# You'll need to manually add each binary listed below

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Clawdbot Full Disk Access Permission Setup                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "You need to grant Full Disk Access to the following applications:"
echo ""

# 1. Clawdbot GUI App
if [ -d "/Applications/Clawdbot.app" ]; then
    echo "✓ 1. Clawdbot GUI App"
    echo "   Path: /Applications/Clawdbot.app"
    echo ""
fi

# 2. NVM Node.js (active)
NVM_NODE="/Users/your-username/.nvm/versions/node/v22.21.1/bin/node"
if [ -f "$NVM_NODE" ]; then
    echo "✓ 2. NVM Node.js (your active version)"
    echo "   Path: $NVM_NODE"
    echo ""
fi

# 3. Homebrew Node.js
BREW_NODE="/opt/homebrew/opt/node@22/bin/node"
if [ -f "$BREW_NODE" ]; then
    echo "✓ 3. Homebrew Node.js"
    echo "   Path: $BREW_NODE"
    echo ""
fi

# 4. Terminal
echo "✓ 4. Your Terminal Application"
echo "   Choose one: Terminal.app OR iTerm.app"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo ""
echo "INSTRUCTIONS:"
echo ""
echo "1. I'll open System Settings → Privacy & Security → Full Disk Access"
echo ""
echo "2. Click the lock icon (🔒) and enter your password"
echo ""
echo "3. Click the '+' button and add EACH of the binaries listed above:"
echo "   - For Clawdbot.app: Navigate to /Applications/"
echo "   - For Node binaries: Press Cmd+Shift+G and paste the full path"
echo "   - For Terminal: It should already be in Applications"
echo ""
echo "4. After adding all binaries, RESTART Clawdbot gateway:"
echo "   - Stop: clawdbot gateway stop"
echo "   - Start: clawdbot gateway start"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Press ENTER to open System Settings..."

# Open System Settings to Full Disk Access
open "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"

echo ""
echo "✓ System Settings opened"
echo ""
echo "After granting permissions, run this test:"
echo ""
echo "  /Users/your-username/.nvm/versions/node/v22.21.1/bin/node -e \"require('fs').readFileSync('/Users/your-username/Library/Messages/chat.db')\""
echo ""
echo "If it works without errors, permissions are correctly set!"
