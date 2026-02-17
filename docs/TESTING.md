# Integration Test Script

This document describes how to test the complete Ghost Debugger workflow.

## Prerequisites

- Node.js installed
- Ghost Debugger built (`npm run build`)
- Kilo API key configured
- Internet connection

## Test Scenarios

### Test 1: Basic Error Capture

**Objective**: Verify error capture works

```bash
cd examples/nodejs-bug
kilo-ghost run "node index.js"
```

**Expected**:
- Command runs and fails
- Error captured message appears
- Snapshot saved in `~/.kilo-ghost/snapshots/`

**Verification**:
```bash
kilo-ghost history
```

Should show the captured error.

### Test 2: AI Analysis (Preview)

**Objective**: Verify Kilo API integration

```bash
kilo-ghost fix --preview
```

**Expected**:
- "Loading last error snapshot..." success
- "Sending to Kilo Cloud Agent..." success
- Root cause displayed
- Explanation shown
- Suggested fix with diff
- Confidence score
- No files modified (preview mode)

**Verification**:
```bash
git status
# Should show no modifications
```

### Test 3: Apply Fix

**Objective**: Verify fix application

```bash
kilo-ghost fix --apply
```

**Expected**:
- Same as Test 2
- Plus "Applying fix..." success
- Files modified

**Verification**:
```bash
git diff examples/nodejs-bug/index.js
# Should show the applied changes

node examples/nodejs-bug/index.js
# Should run without error
```

### Test 4: Multiple Errors

**Objective**: Test history management

```bash
# Reset the example
git checkout examples/nodejs-bug/index.js

# Capture multiple errors
kilo-ghost run "node examples/nodejs-bug/index.js"
kilo-ghost run "npm test"  # Will fail - no tests defined
kilo-ghost run "node nonexistent.js"  # Will fail - file not found
```

**Verification**:
```bash
kilo-ghost history --limit 5
```

Should show all 3 errors.

### Test 5: Error Without Stack Trace

**Objective**: Test handling of simple errors

Create a test file:
```bash
echo "console.log('test'); process.exit(1);" > test-simple-error.js
kilo-ghost run "node test-simple-error.js"
kilo-ghost fix --preview
rm test-simple-error.js
```

**Expected**:
- Captures error even without stack trace
- AI provides generic suggestions

### Test 6: Invalid API Key

**Objective**: Test error handling

```bash
kilo-ghost auth --token invalid_key
kilo-ghost fix
```

**Expected**:
- Clear error message about invalid API key
- Suggestion to reconfigure

## Automated Test Script

```bash
#!/bin/bash

echo "Ghost Debugger Integration Tests"
echo "=================================="

# Test 1: Capture
echo -e "\nTest 1: Error Capture"
cd examples/nodejs-bug
kilo-ghost run "node index.js" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "FAIL: Command should have failed"
else
  echo "PASS: Error captured"
fi

# Test 2: History
echo -e "\nTest 2: History"
HISTORY=$(kilo-ghost history --limit 1)
if [[ $HISTORY == *"node index.js"* ]]; then
  echo "PASS: History shows captured error"
else
  echo "FAIL: Error not in history"
fi

# Test 3: Fix (requires API key)
echo -e "\nTest 3: AI Analysis"
if [ -z "$KILO_API_KEY" ]; then
  echo "SKIP: No API key set"
else
  kilo-ghost auth --token $KILO_API_KEY
  OUTPUT=$(kilo-ghost fix --preview)
  if [[ $OUTPUT == *"Root Cause"* ]]; then
    echo "PASS: AI analysis completed"
  else
    echo "FAIL: No analysis result"
  fi
fi

echo -e "\nTests complete!"
```

Save as `test-integration.sh` and run:

```bash
chmod +x test-integration.sh
export KILO_API_KEY=your_key
./test-integration.sh
```

## Performance Benchmarks

Record these metrics during testing:

| Metric | Target | Actual |
|--------|--------|--------|
| Capture time | <2s | |
| API request time | <5s | |
| Fix application | <1s | |
| Total workflow | <10s | |

## Checklist

Before marking integration complete:

- [ ] Error capture works for Node.js
- [ ] Error capture works for Python
- [ ] Stack trace parsing accurate
- [ ] Git context captured correctly
- [ ] Environment info complete
- [ ] API authentication works
- [ ] AI analysis returns valid JSON
- [ ] Fix suggestions are relevant
- [ ] Apply fix modifies files correctly
- [ ] History command works
- [ ] Error messages are clear
- [ ] Documentation is accurate

## Known Issues

Document any issues found during testing:

1. **Issue**: [Description]
   **Workaround**: [Solution]
   **Status**: [Open/Fixed]

## Next Steps

After successful integration tests:

1. Update documentation with real examples
2. Add more test cases
3. Implement streaming for better UX
4. Add caching for common errors
5. Optimize prompt for better results
