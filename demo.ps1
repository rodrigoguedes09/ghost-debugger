# Ghost Debugger - Live Demo Script
# This script demonstrates the full workflow of capturing and fixing errors with AI

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Ghost Debugger - AI-Powered Debugging" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Show the buggy code
Write-Host "[STEP 1] Here's our buggy application..." -ForegroundColor Yellow
Write-Host "File: examples/nodejs-bug/index.js`n" -ForegroundColor Gray

Get-Content examples/nodejs-bug/index.js | Select-Object -First 15
Write-Host "..." -ForegroundColor Gray
Write-Host "`nPress Enter to continue..." -ForegroundColor Green
Read-Host

# Step 2: Try to run it normally (it handles gracefully now)
Write-Host "`n[STEP 2] Running the application (currently fixed version)..." -ForegroundColor Yellow
Write-Host "Command: node examples/nodejs-bug/index.js`n" -ForegroundColor Gray

node examples/nodejs-bug/index.js
Write-Host "`nNotice: It handles invalid discount codes gracefully with a warning." -ForegroundColor Gray
Write-Host "Let's make it throw an error to demo the fix workflow...`n" -ForegroundColor Gray
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

# Step 3: Temporarily modify the file to throw an error
Write-Host "`n[STEP 3] Let's modify it to throw an error..." -ForegroundColor Yellow

$originalContent = Get-Content examples/nodejs-bug/index.js -Raw
$modifiedContent = $originalContent -replace 'console.warn\(`Invalid discount code', 'throw new Error(`Invalid discount code'
$modifiedContent = $modifiedContent -replace 'return total;', 'return total; // This line is never reached'
Set-Content examples/nodejs-bug/index.js -Value $modifiedContent -NoNewline

Write-Host "Modified: Changed warning to throw error`n" -ForegroundColor Gray
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

# Step 4: Capture the error with Ghost Debugger
Write-Host "`n[STEP 4] Capturing error with Ghost Debugger..." -ForegroundColor Yellow
Write-Host "Command: kilo-ghost run 'node examples/nodejs-bug/index.js'`n" -ForegroundColor Gray

node dist/cli/index.js run "node examples/nodejs-bug/index.js"

Write-Host "`nError captured! Full context saved to ~/.kilo-ghost/`n" -ForegroundColor Green
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

# Step 5: Show error history
Write-Host "`n[STEP 5] Viewing error history..." -ForegroundColor Yellow
Write-Host "Command: kilo-ghost history`n" -ForegroundColor Gray

node dist/cli/index.js history

Write-Host "`nPress Enter to continue..." -ForegroundColor Green
Read-Host

# Step 6: AI Analysis (Preview)
Write-Host "`n[STEP 6] Getting AI-powered diagnosis..." -ForegroundColor Yellow
Write-Host "Command: kilo-ghost fix --preview`n" -ForegroundColor Gray
Write-Host "This sends the error context to Claude Sonnet 4.5 via Kilo AI Gateway..." -ForegroundColor Gray
Write-Host ""

node dist/cli/index.js fix --preview

Write-Host "`nAI analyzed the error and suggested a fix!" -ForegroundColor Green
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

# Step 7: Apply the fix
Write-Host "`n[STEP 7] Applying the AI-suggested fix..." -ForegroundColor Yellow
Write-Host "Command: kilo-ghost fix --apply`n" -ForegroundColor Gray

node dist/cli/index.js fix --apply

Write-Host "`nFix applied automatically!`n" -ForegroundColor Green
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

# Step 8: Run again to show it works
Write-Host "`n[STEP 8] Running the fixed application..." -ForegroundColor Yellow
Write-Host "Command: node examples/nodejs-bug/index.js`n" -ForegroundColor Gray

node examples/nodejs-bug/index.js

Write-Host "`nSuccess! The error is fixed - it now handles invalid discount codes gracefully." -ForegroundColor Green
Write-Host "`nPress Enter to continue..." -ForegroundColor Green
Read-Host

# Step 9: Show the diff
Write-Host "`n[STEP 9] What changed? Let's see the git diff..." -ForegroundColor Yellow
Write-Host "Command: git diff examples/nodejs-bug/index.js`n" -ForegroundColor Gray

git diff examples/nodejs-bug/index.js

Write-Host "`nPress Enter to cleanup and finish..." -ForegroundColor Green
Read-Host

# Cleanup: Restore original file
Write-Host "`n[CLEANUP] Restoring original file..." -ForegroundColor Yellow
Set-Content examples/nodejs-bug/index.js -Value $originalContent -NoNewline
git restore examples/nodejs-bug/index.js

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "           Demo Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Summary:" -ForegroundColor White
Write-Host "1. Captured error context automatically" -ForegroundColor Gray
Write-Host "2. Sent to Claude Sonnet 4.5 via Kilo AI (~$0.006)" -ForegroundColor Gray
Write-Host "3. Received root cause analysis + fix" -ForegroundColor Gray
Write-Host "4. Applied fix with one command" -ForegroundColor Gray
Write-Host "5. Error resolved!`n" -ForegroundColor Gray

Write-Host "Repository: https://github.com/rodrigoguedes09/ghost-debugger" -ForegroundColor Cyan
Write-Host "Built for DeveloperWeek 2026 Hackathon`n" -ForegroundColor Cyan
