# Quick Start Guide

Get started with Kilo Ghost Debugger in less than 5 minutes.

## Prerequisites

- Node.js >= 20.10.0
- npm or yarn
- Git (optional, for git context capture)
- Kilo API token (get yours at https://kilo.ai)

## Installation

### Option 1: Install from npm (when published)

```bash
npm install -g kilo-ghost
```

### Option 2: Install from source

```bash
git clone https://github.com/rodrigoguedes09/ghost-debugger.git
cd ghost-debugger
npm install
npm run build
npm link
```

Verify installation:

```bash
kilo-ghost --version
```

## Initial Setup

### 1. Configure Authentication

```bash
kilo-ghost auth --token YOUR_KILO_API_TOKEN
```

Or run without token flag to enter it interactively:

```bash
kilo-ghost auth
```

### 2. Verify Configuration

The tool creates a config file at `~/.kilo-ghost/config.json`. You can verify it was created successfully.

## Basic Usage

### Capture an Error

Wrap any command that might fail:

```bash
kilo-ghost run "npm test"
```

or

```bash
kilo-ghost run "python script.py"
```

If the command succeeds, Ghost just shows the output. If it fails, Ghost captures:
- Error message and stack trace
- Git context (branch, commits, diffs)
- Environment info (Node/Python version, dependencies)
- Code snippets from error locations

### Fix the Error

After capturing an error, run:

```bash
kilo-ghost fix
```

This will:
1. Load the last captured error
2. Send it to a Kilo Cloud Agent
3. Wait for analysis
4. Display root cause and suggested fix

### Preview Before Applying

To see the suggested fix without applying it:

```bash
kilo-ghost fix --preview
```

### Apply Fix Automatically

To apply the suggested fix immediately:

```bash
kilo-ghost fix --apply
```

### View Error History

See your last 10 captured errors:

```bash
kilo-ghost history
```

Limit the number of entries:

```bash
kilo-ghost history --limit 5
```

## Example Workflow

1. You're working on a project and tests are failing
2. Run tests with Ghost:
   ```bash
   kilo-ghost run "npm test"
   ```
3. Tests fail, Ghost captures the error
4. Get AI-powered diagnosis:
   ```bash
   kilo-ghost fix --preview
   ```
5. Review the suggested fix
6. Apply it:
   ```bash
   kilo-ghost fix --apply
   ```
7. Verify the fix works:
   ```bash
   npm test
   ```

## Try the Example

The repository includes an example project with an intentional bug:

```bash
cd examples/nodejs-bug
kilo-ghost run "node index.js"
kilo-ghost fix --preview
```

## Configuration

Configuration is stored in `~/.kilo-ghost/config.json`:

```json
{
  "apiKey": "your-api-key",
  "apiUrl": "https://api.kilo.ai",
  "timeout": 30000,
  "saveHistory": true,
  "maxSnapshots": 10
}
```

You can edit this file directly or use the `auth` command to update the API key.

## Error Snapshots

Error snapshots are stored in `~/.kilo-ghost/snapshots/`. Ghost automatically keeps only the last 10 snapshots to save disk space.

Each snapshot includes:
- Command that failed
- Exit code
- stdout/stderr output
- Git context
- Environment details
- Stack trace
- Relevant code snippets

## Troubleshooting

### Command not found

If `kilo-ghost` command is not found after installation:

1. Make sure npm global bin directory is in your PATH
2. Or run `npm link` from the project directory

### API Authentication Failed

1. Verify your API key is correct
2. Check your internet connection
3. Ensure the API URL is correct in config

### No Error Captured

If Ghost doesn't capture an error:

1. Make sure the command actually fails (non-zero exit code)
2. Check that stderr or stdout contains error information
3. Verify you have write permissions to `~/.kilo-ghost/`

### Tests Are Failing

If you're working on Ghost itself and tests fail:

```bash
npm test
```

Make sure all dependencies are installed:

```bash
npm install
```

## Next Steps

- Read the full [README.md](../README.md)
- Check out [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
- Report issues on GitHub
- Share your experience!

## Need Help?

- Open an issue: https://github.com/rodrigoguedes09/ghost-debugger/issues
- Read the docs: https://github.com/rodrigoguedes09/ghost-debugger/tree/main/docs
