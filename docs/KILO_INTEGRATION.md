# Kilo API Integration

## Overview

The Ghost Debugger now integrates with the Kilo AI Gateway to provide AI-powered error analysis and fix suggestions.

## Architecture

Instead of using hypothetical "Cloud Agents", we leverage Kilo's chat completions API to create a virtual debugging agent:

```
Error Occurs → Capture Context → Send to Kilo Chat API → Parse AI Response → Apply Fix
```

## Implementation Details

### API Endpoint

Base URL: `https://api.kilo.ai/api/gateway`

Endpoint used: `POST /chat/completions`

Model: `anthropic/claude-sonnet-4.5`

### Request Flow

1. **Error Capture**: When a command fails, we capture:
   - Stack trace
   - Git context (branch, commits, diffs)
   - Environment (Node/Python version, dependencies)
   - Code snippets from error locations

2. **Prompt Construction**: We build a comprehensive prompt including:
   ```
   # Error Analysis Request
   
   ## Command That Failed
   npm test
   
   ## Error Output
   [stderr content]
   
   ## Stack Trace
   - file.js:10 in handleError
   - server.js:25 in processRequest
   
   ## Relevant Code
   [code snippets with context]
   
   ## Git Context
   Branch: main
   Last Commit: Fix login bug
   
   ## Environment
   Node: v20.10.0
   Platform: win32
   
   ## Dependencies
   - express: 4.18.0
   - jest: 29.0.0
   ```

3. **AI Analysis**: Send to Kilo with system prompt:
   ```
   You are an expert debugging assistant.
   Analyze errors, identify root causes, and suggest fixes.
   Return valid JSON with: rootCause, explanation, suggestedFix, confidence
   ```

4. **Response Parsing**: Extract JSON from AI response and structure as FixResult

5. **Fix Application**: Apply suggested code changes to files

### Request Configuration

```typescript
{
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: errorAnalysisPrompt }
  ],
  max_tokens: 4000,
  temperature: 0.2  // Low temperature for consistent, deterministic fixes
}
```

### Response Format

The AI returns JSON matching this schema:

```json
{
  "rootCause": "Missing null check in applyDiscount function",
  "explanation": "The discount code 'INVALID_CODE' does not exist...",
  "affectedFiles": ["index.js"],
  "suggestedFix": [
    {
      "file": "index.js",
      "oldContent": "const discountAmount = total * discounts[discountCode];",
      "newContent": "const discount = discounts[discountCode] || 0;\n  const discountAmount = total * discount;",
      "unified": "--- a/index.js\n+++ b/index.js\n..."
    }
  ],
  "confidence": 95,
  "additionalTests": ["Test with invalid discount code"]
}
```

## Authentication

Set your Kilo API key:

```bash
kilo-ghost auth --token YOUR_KILO_API_KEY
```

Or interactively:

```bash
kilo-ghost auth
```

The key is stored securely in `~/.kilo-ghost/config.json`.

## Error Handling

### API Errors

| Error Code | Handling |
|------------|----------|
| 400 | Invalid request - check prompt construction |
| 401 | Unauthorized - verify API key |
| 402 | Insufficient balance - add credits |
| 429 | Rate limited - retry with backoff |
| 500 | Server error - retry or fallback |
| 502 | Provider error - log and notify user |

### Response Parsing

If the AI response doesn't contain valid JSON:
1. Try to extract JSON from markdown code blocks
2. Fall back to showing raw explanation
3. Set low confidence score (30%)

## Cost Optimization

To minimize API costs:

1. **Context Limiting**:
   - Max 5 stack trace lines
   - Max 3 code files
   - Max 10 dependencies listed

2. **Token Management**:
   - `max_tokens: 4000` cap
   - Concise prompts
   - Relevant code only (±5 lines of context)

3. **Temperature**:
   - `0.2` for consistent, short responses
   - Reduces unnecessary verbosity

## Testing

### Unit Test (Mock API)

```typescript
// tests/kilo-api.test.ts
test('should analyze error and return fix', async () => {
  const mockResponse = {
    choices: [{
      message: {
        content: JSON.stringify({
          rootCause: 'Null reference',
          confidence: 90
        })
      }
    }]
  };
  
  // Mock fetch, test parsing
});
```

### Integration Test (Real API)

```bash
# Set real API key
export KILO_API_KEY=your_key

# Run with example bug
kilo-ghost run "node examples/nodejs-bug/index.js"

# Request fix
kilo-ghost fix --preview
```

## Limitations

1. **No Real Reproduction**: We don't spin up isolated environments. The AI analyzes statically.

2. **Context Window**: Limited to ~4000 tokens output. Complex fixes might be truncated.

3. **No Iterative Refinement**: Single-pass analysis. No back-and-forth with AI.

4. **Language Support**: Best for JavaScript/TypeScript and Python. Others might work but not optimized.

## Future Enhancements

1. **Streaming Responses**: Use `stream: true` for better UX
2. **Multi-turn Conversations**: Allow user to refine the fix
3. **Caching**: Cache common error patterns
4. **Multiple Models**: Support other Kilo models for specialized tasks
5. **Tool Calling**: Use function calling for code execution

## Example Usage

```bash
# Capture error
kilo-ghost run "npm test"

# Get AI-powered fix
kilo-ghost fix

# Output:
# Root Cause: Missing null check in applyDiscount function
# Explanation: The discount code 'INVALID_CODE' doesn't exist...
# Suggested Fix:
#   File: index.js
#   + const discount = discounts[discountCode] || 0;
#   + const discountAmount = total * discount;
# Confidence: 95%

# Apply fix
kilo-ghost fix --apply
```

## API Response Example

<details>
<summary>Full API Response</summary>

```json
{
  "id": "gen-abc123",
  "object": "chat.completion",
  "created": 1739000000,
  "model": "anthropic/claude-sonnet-4.5",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "{\n  \"rootCause\": \"Missing null check for undefined discount code\",\n  \"explanation\": \"The function applyDiscount accesses the discounts object with a key that doesn't exist ('INVALID_CODE'). This returns undefined, and multiplying undefined by a number results in NaN. You need to handle the case when the discount code is not found.\",\n  \"affectedFiles\": [\"examples/nodejs-bug/index.js\"],\n  \"suggestedFix\": [{\n    \"file\": \"examples/nodejs-bug/index.js\",\n    \"oldContent\": \"  const discountAmount = total * discounts[discountCode];\\n  return total - discountAmount;\",\n    \"newContent\": \"  const discount = discounts[discountCode] || 0;\\n  const discountAmount = total * discount;\\n  return total - discountAmount;\",\n    \"unified\": \"--- a/examples/nodejs-bug/index.js\\n+++ b/examples/nodejs-bug/index.js\\n@@ -14,7 +14,8 @@\\n   };\\n   \\n-  const discountAmount = total * discounts[discountCode];\\n+  const discount = discounts[discountCode] || 0;\\n+  const discountAmount = total * discount;\\n   return total - discountAmount;\\n }\"\n  }],\n  \"confidence\": 95,\n  \"additionalTests\": [\"Add test case for invalid discount code\"]\n}"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 450,
    "completion_tokens": 280,
    "total_tokens": 730
  }
}
```

</details>

## Troubleshooting

### "No response from AI"

Check:
1. API key is valid
2. Internet connection
3. Kilo API status

### "Error parsing AI response"

The AI might have returned non-JSON. Check:
1. Prompt clarity
2. System message constraints
3. Model capabilities

### High costs

Reduce:
1. Number of fix attempts
2. Context sent (fewer files/lines)
3. max_tokens limit

---

Last updated: February 16, 2026
