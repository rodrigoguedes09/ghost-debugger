# Ghost Debugger - Quick Demo Guide

This demo showcases the complete workflow: error capture → AI analysis → automatic fix.

## What You'll Need

- Your terminal ready to record (OBS, Asciinema, etc.)
- The Ghost Debugger repo already cloned and built
- Kilo API key configured

## Demo Scripts

Two scripts are provided:

- **demo.ps1** - For Windows PowerShell
- **demo.sh** - For Linux/Mac Bash

## Running the Demo

### Windows:
```powershell
.\demo.ps1
```

### Linux/Mac:
```bash
chmod +x demo.sh
./demo.sh
```

## What the Demo Shows

1. **Original Bug** - Shows buggy code that produces NaN
2. **Error Occurs** - Modifies code to throw an error (for demo clarity)
3. **Capture** - `kilo-ghost run` captures full error context
4. **History** - Shows saved error snapshots
5. **AI Analysis** - `kilo-ghost fix --preview` sends to Claude Sonnet 4.5
6. **Root Cause** - AI identifies the exact issue with explanation
7. **Suggested Fix** - Shows the code changes with confidence score
8. **Apply Fix** - `kilo-ghost fix --apply` patches the code automatically
9. **Verification** - Runs the fixed code successfully
10. **Diff Review** - Shows what changed

## Recording Tips

- **Slow Down**: The script pauses at each step - take your time
- **Zoom In**: Make sure terminal text is readable
- **Highlight**: Point out key parts like:
  - Error context captured
  - AI diagnosis quality
  - Confidence score (95%)
  - Automatic code patching
- **Cost**: Mention it costs ~$0.006 per fix (less than a penny!)

## Key Talking Points

- "No more manual debugging - AI does it for you"
- "Captures complete context automatically - stack trace, git status, environment"
- "Claude Sonnet 4.5 analyzes and suggests fixes"
- "One command to apply the fix"
- "Works with Node.js, TypeScript, Python"

## Cleanup

The script automatically restores the original file after the demo.

## Alternative: Manual Demo

If you prefer manual control, follow these commands:

```bash
# 1. Show the bug
node examples/nodejs-bug/index.js

# 2. Capture with Ghost
kilo-ghost run "node examples/nodejs-bug/index.js"

# 3. View history
kilo-ghost history

# 4. Get AI diagnosis
kilo-ghost fix --preview

# 5. Apply the fix
kilo-ghost fix --apply

# 6. Verify it works
node examples/nodejs-bug/index.js

# 7. Show the diff
git diff examples/nodejs-bug/index.js
```

## Demo Length

Expected duration: 3-5 minutes (depending on your narration)

---

**Pro Tip**: Practice once without recording to get familiar with the flow!
