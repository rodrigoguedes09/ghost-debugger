# Example: Node.js Project with Intentional Bug

This example demonstrates how Kilo Ghost Debugger captures and helps fix errors.

## The Bug

This simple Node.js script has a bug that only manifests when a specific condition is met.

## How to Test

1. Navigate to this directory:
   ```bash
   cd examples/nodejs-bug
   ```

2. Install dependencies (if any):
   ```bash
   npm install
   ```

3. Run with Ghost Debugger:
   ```bash
   kilo-ghost run "node index.js"
   ```

4. Fix the error:
   ```bash
   kilo-ghost fix
   ```

## Expected Behavior

The Ghost Debugger should:
1. Capture the error and stack trace
2. Identify the undefined variable
3. Suggest adding proper error handling or initialization
