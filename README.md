# Kilo Ghost Debugger

> Stop chasing ghosts. Start exorcising them.

AI-powered CLI that captures error context and provides instant fixes using Claude Sonnet 4.5 via Kilo AI Gateway.

## The Problem

When your code fails, you waste time gathering context: reading stack traces, checking git changes, reviewing environment variables, and manually analyzing what went wrong.

## The Solution

Ghost Debugger automatically captures the full error context and uses AI to diagnose and fix the issue. Just run `kilo-ghost run <command>` and if it fails, run `kilo-ghost fix`:

1. **Captures** complete error context (stack trace, git status, environment, relevant code)
2. **Analyzes** using Claude Sonnet 4.5 via Kilo AI Gateway
3. **Provides** root cause explanation and code fix with confidence score
4. **Applies** the fix automatically if you want

## Quick Start

### Installation

```bash
npm install -g kilo-ghost
# or
git clone https://github.com/rodrigoguedes09/ghost-debugger.git
cd ghost-debugger
npm install
npm run build
npm link
```

### Setup

Get your API key from [kilo.ai](https://kilo.ai) and configure:

```bash
kilo-ghost auth --token YOUR_KILO_API_KEY
```

### Basic Usage

Wrap any command to capture errors:

```bash
kilo-ghost run "npm test"
kilo-ghost run "node app.js"
kilo-ghost run "python script.py"
```

When it fails, get AI-powered diagnosis:

```bash
kilo-ghost fix --preview  # See the fix first
kilo-ghost fix --apply    # Apply automatically
```

## Features

### Smart Error Capture
Automatically collects everything needed to diagnose:
- Stack trace with file locations and line numbers
- Git context (branch, commits, modified files)
- Environment info (Node/Python version, platform, dependencies)
- Relevant code snippets with context
- Command output (stdout/stderr)

### AI-Powered Analysis
Uses Claude Sonnet 4.5 via Kilo AI Gateway:
- Analyzes complete error context in one request
- Identifies root cause with detailed explanation
- Suggests code fixes with confidence scores
- Provides diffs in unified format
- Understands multiple languages (Node.js, TypeScript, Python)

### One-Command Fix
```bash
kilo-ghost fix --apply
```
Automatically applies the suggested fix to your files. Or use `--preview` to see changes first.

### Cost Effective
~$0.006 per error analysis (500 input + 300 output tokens)

## Commands

- `kilo-ghost run <command>` - Execute command and capture if it fails
- `kilo-ghost fix [--preview|--apply]` - Analyze and fix last error
- `kilo-ghost history` - Show captured error snapshots
- `kilo-ghost auth [--token KEY]` - Configure Kilo API key

## Example

```bash
# Capture an error
kilo-ghost run "node buggy-script.js"

# Get AI diagnosis
kilo-ghost fix --preview

# Output:
# Root Cause: Invalid discount code causing NaN calculation
# 
# The error occurs because discounts[code] returns undefined
# for invalid codes, leading to NaN in arithmetic operations.
#
# Suggested Fix (95% confidence):
# --- a/script.js
# +++ b/script.js
# @@ -10,6 +10,9 @@
#  function applyDiscount(total, code) {
# +  if (!discounts[code]) {
# +    return total; // No discount for invalid codes
# +  }
#    return total - (total * discounts[code]);
#  }

# Apply the fix
kilo-ghost fix --apply
```

## Project Structure

```
kilo-ghost/
├── src/
│   ├── cli/              # CLI main entry point
│   ├── capture/          # Error capture modules
│   ├── api/              # Kilo API client
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── tests/                # Test suite
└── docs/                 # Documentation
```

## Development

### Prerequisites

- Node.js >= 20.10.0
- npm or yarn
- Git

### Setup Development Environment

```bash
git clone https://github.com/rodrigoguedes09/ghost-debugger.git
cd ghost-debugger
npm install
```

### Build

```bash
npm run build
```

### Run in Development

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Run Linter

```bash
npm run lint
```

## Architecture

```
┌─────────────┐
│  CLI Layer  │  Commands: run, fix, auth, history
└──────┬──────┘
       │
┌──────▼────────┐
│ Capture Layer │  Collects: stack trace, git, env, files
└──────┬────────┘
       │
┌──────▼────────┐
│  API Layer    │  Kilo AI Gateway + Claude Sonnet 4.5
└──────┬────────┘
       │
┌──────▼────────┐
│ Storage Layer │  ~/.kilo-ghost/ (config + snapshots)
└───────────────┘
```

**Tech Stack:**
- TypeScript (strict mode)
- Commander.js (CLI)
- Chalk + Ora (UI)
- Jest (testing)
- Kilo AI Gateway API

## Contributing

Contributions are welcome! This project is being developed for the DeveloperWeek 2026 Hackathon.

### Development Roadmap

- [x] Week 1: MVP CLI with capture and Kilo AI integration
- [x] Real AI analysis with Claude Sonnet 4.5
- [x] Auto-fix application with confidence scores
- [ ] Week 2: VS Code extension
- [ ] Week 3: CI/CD integration
- [ ] Week 4: Demo polish and advanced features

## License

MIT

## Built For

DeveloperWeek 2026 Hackathon - Kilo Challenge

Built to make developers' lives better by eliminating the time wasted on bug reproduction.

---

Made with determination by Rodrigo Guedes
