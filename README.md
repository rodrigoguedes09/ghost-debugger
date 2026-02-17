# Kilo Ghost Debugger

> Stop chasing ghosts. Start exorcising them.

Auto-exorcism for bugs. Captures, reproduces, and fixes errors automatically using Kilo Cloud Agents.

## The Problem

Developers waste hours reproducing bugs from production or CI environments. The infamous "works on my machine" costs countless debugging cycles comparing environments and manual trial-and-error.

## The Solution

A smart CLI that integrates with Kilo Cloud Agents. When an error occurs (terminal or CI), run `kilo-ghost fix` and it:

1. Captures the error "DNA" (logs, env vars, stack trace, changed files)
2. Sends to a Kilo Cloud Agent that creates an isolated "Ghost Environment"
3. Autonomously reproduces the error
4. Returns to your VS Code the exact bug location with a ready-to-apply fix

## Quick Start

### Installation

```bash
npm install -g kilo-ghost
```

### Setup

Configure your Kilo API credentials:

```bash
kilo-ghost auth --token YOUR_KILO_TOKEN
```

### Usage

Wrap any command that might fail:

```bash
kilo-ghost run "npm test"
```

If the command fails, Ghost automatically captures the error state. Then invoke the fix protocol:

```bash
kilo-ghost fix
```

Ghost will:
- Spawn a Cloud Agent
- Reproduce the error in isolation
- Analyze the root cause
- Suggest a fix

Apply the fix automatically:

```bash
kilo-ghost fix --apply
```

## Features

### Error Snapshot
Instant capture of system state at failure moment:
- Complete stack trace
- Environment variables (filtered for security)
- Latest Git commits
- Installed dependencies
- Terminal logs
- Recently modified files

### Ghost Protocol
Automatic Cloud Agent provisioning for reproduction in clean environment:
- Auto-detects language/framework
- Configures identical cloud environment
- Executes the failing command
- Collects diagnostic data

### Context-Aware Diagnosis
AI-powered analysis crossing logs with project context:
- Analyzes README.md and project docs
- Identifies known error patterns
- Compares with similar resolved errors
- Suggests root cause analysis

### Auto-Exorcism
Receive suggested fix directly in terminal or VS Code:
- Applicable fix with one command
- Clear explanation of problem found
- Link to exact problematic code line
- Suggested tests to validate the fix

## Commands

- `kilo-ghost run <command>` - Wrap and execute a command, capturing errors
- `kilo-ghost fix` - Diagnose and fix the last captured error
- `kilo-ghost history` - Show error capture history
- `kilo-ghost auth` - Configure Kilo API authentication

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

The Ghost Debugger consists of:

1. **CLI Layer**: User interface for capturing and fixing errors
2. **Capture Layer**: Collects error context (stack trace, git, env, files)
3. **API Layer**: Communicates with Kilo Cloud Agents
4. **Storage Layer**: Persists error snapshots and configuration

## Contributing

Contributions are welcome! This project is being developed for the DeveloperWeek 2026 Hackathon.

### Development Roadmap

- [x] Week 1: MVP CLI with basic capture and API integration
- [ ] Week 2: Cloud reproduction and AI analysis
- [ ] Week 3: VS Code extension
- [ ] Week 4: CI/CD integration and polish

## License

MIT

## Built For

DeveloperWeek 2026 Hackathon - Kilo Challenge

Built to make developers' lives better by eliminating the time wasted on bug reproduction.

---

Made with determination by Rodrigo Guedes
