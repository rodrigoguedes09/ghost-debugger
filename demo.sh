#!/bin/bash
# Ghost Debugger - Live Demo Script
# This script demonstrates the full workflow of capturing and fixing errors with AI

echo ""
echo "========================================"
echo "  Ghost Debugger - AI-Powered Debugging"
echo "========================================"
echo ""

# Step 1: Show the buggy code
echo "[STEP 1] Here's our buggy application..."
echo "File: examples/nodejs-bug/index.js"
echo ""

head -15 examples/nodejs-bug/index.js
echo "..."
echo ""
read -p "Press Enter to continue..."

# Step 2: Try to run it normally (it will fail)
echo ""
echo "[STEP 2] Running the application normally..."
echo "Command: node examples/nodejs-bug/index.js"
echo ""

node examples/nodejs-bug/index.js
echo ""
echo "Notice: Invalid discount code produces NaN!"
echo ""
read -p "Press Enter to continue..."

# Step 3: Temporarily modify the file to throw an error
echo ""
echo "[STEP 3] Let's modify it to throw an error..."

cp examples/nodejs-bug/index.js examples/nodejs-bug/index.js.backup
sed -i "s/console.warn(\`Invalid/throw new Error(\`Invalid/g" examples/nodejs-bug/index.js

echo "Modified: Changed warning to throw error"
echo ""
read -p "Press Enter to continue..."

# Step 4: Capture the error with Ghost Debugger
echo ""
echo "[STEP 4] Capturing error with Ghost Debugger..."
echo "Command: kilo-ghost run 'node examples/nodejs-bug/index.js'"
echo ""

node dist/cli/index.js run "node examples/nodejs-bug/index.js"

echo ""
echo "Error captured! Full context saved to ~/.kilo-ghost/"
echo ""
read -p "Press Enter to continue..."

# Step 5: Show error history
echo ""
echo "[STEP 5] Viewing error history..."
echo "Command: kilo-ghost history"
echo ""

node dist/cli/index.js history

echo ""
read -p "Press Enter to continue..."

# Step 6: AI Analysis (Preview)
echo ""
echo "[STEP 6] Getting AI-powered diagnosis..."
echo "Command: kilo-ghost fix --preview"
echo ""
echo "This sends the error context to Claude Sonnet 4.5 via Kilo AI Gateway..."
echo ""

node dist/cli/index.js fix --preview

echo ""
echo "AI analyzed the error and suggested a fix!"
echo ""
read -p "Press Enter to continue..."

# Step 7: Apply the fix
echo ""
echo "[STEP 7] Applying the AI-suggested fix..."
echo "Command: kilo-ghost fix --apply"
echo ""

node dist/cli/index.js fix --apply

echo ""
echo "Fix applied automatically!"
echo ""
read -p "Press Enter to continue..."

# Step 8: Run again to show it works
echo ""
echo "[STEP 8] Running the fixed application..."
echo "Command: node examples/nodejs-bug/index.js"
echo ""

node examples/nodejs-bug/index.js

echo ""
echo "Success! The error is fixed - it now handles invalid discount codes gracefully."
echo ""
read -p "Press Enter to continue..."

# Step 9: Show the diff
echo ""
echo "[STEP 9] What changed? Let's see the git diff..."
echo "Command: git diff examples/nodejs-bug/index.js"
echo ""

git diff examples/nodejs-bug/index.js

echo ""
read -p "Press Enter to cleanup and finish..."

# Cleanup: Restore original file
echo ""
echo "[CLEANUP] Restoring original file..."
mv examples/nodejs-bug/index.js.backup examples/nodejs-bug/index.js

echo ""
echo "========================================"
echo "           Demo Complete!"
echo "========================================"
echo ""

echo "Summary:"
echo "1. Captured error context automatically"
echo "2. Sent to Claude Sonnet 4.5 via Kilo AI (~\$0.006)"
echo "3. Received root cause analysis + fix"
echo "4. Applied fix with one command"
echo "5. Error resolved!"
echo ""

echo "Repository: https://github.com/rodrigoguedes09/ghost-debugger"
echo "Built for DeveloperWeek 2026 Hackathon"
echo ""
