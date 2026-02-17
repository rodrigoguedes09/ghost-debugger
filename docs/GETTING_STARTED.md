# Getting Started with Kilo API

## Step 1: Get Your Kilo API Key

1. Visit https://kilo.ai
2. Sign up or log in to your account
3. Navigate to your account settings or API section
4. Generate a new API key
5. Copy the key (it will look like: `kilo_xxx...`)

## Step 2: Configure Ghost Debugger

Run the auth command and paste your key:

```bash
kilo-ghost auth --token kilo_your_key_here
```

Or run interactively:

```bash
kilo-ghost auth
# Enter your Kilo API token: [paste key]
```

Verify configuration:

```bash
cat ~/.kilo-ghost/config.json
```

Should show:

```json
{
  "apiKey": "kilo_your_key_here",
  "apiUrl": "https://api.kilo.ai",
  "timeout": 30000,
  "saveHistory": true,
  "maxSnapshots": 10
}
```

## Step 3: Test with Example Bug

```bash
cd examples/nodejs-bug
kilo-ghost run "node index.js"
```

You should see:

```
Ghost Debugger is watching...
Running: node index.js

Total: 47.48
Command failed with exit code 1
Capturing error snapshot...
Error captured successfully!

Run "kilo-ghost fix" to diagnose and fix this error
```

## Step 4: Get AI-Powered Fix

```bash
kilo-ghost fix
```

You should see:

```
Loading last error snapshot... ✓
Sending to Kilo Cloud Agent... ✓
Agent is reproducing the error...
Error reproduced and analyzed! ✓

--- Diagnosis ---
Root Cause: Missing null check for undefined discount code
[detailed explanation]

--- Suggested Fix ---
Confidence: 95%

File: examples/nodejs-bug/index.js
[diff showing the fix]

Run with --apply to apply this fix automatically
```

## Step 5: Apply the Fix

```bash
kilo-ghost fix --apply
```

## Step 6: Verify

```bash
node index.js
```

Should now work without errors!

## Troubleshooting

### "API key not configured"

Make sure you ran `kilo-ghost auth` successfully. Check the config file exists at `~/.kilo-ghost/config.json`.

### "Kilo API error: 401 Unauthorized"

Your API key is invalid or expired. Get a new one from https://kilo.ai and reconfigure:

```bash
kilo-ghost auth --token new_key
```

### "Kilo API error: 402 Insufficient balance"

You need to add credits to your Kilo account. Visit https://kilo.ai to add credits.

### "No error snapshot found"

You need to run a command with `kilo-ghost run` first to capture an error:

```bash
kilo-ghost run "npm test"
```

## What's Next?

- Read [docs/KILO_INTEGRATION.md](KILO_INTEGRATION.md) for technical details
- Try it on your own projects
- Check out [docs/QUICK_START.md](QUICK_START.md) for more examples

## API Costs

Ghost Debugger uses the Kilo AI Gateway with Claude Sonnet 4.5:

- Input: $0.000003 per token
- Output: $0.000015 per token

Typical error analysis uses:
- ~500 tokens input (error context)
- ~300 tokens output (fix suggestion)
- **Cost per fix: ~$0.006 (less than a penny!)**

## Credits

This project uses the Kilo AI Gateway: https://kilo.ai

Model: anthropic/claude-sonnet-4.5
