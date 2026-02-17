# Contributing to Kilo Ghost Debugger

First off, thank you for considering contributing to Ghost Debugger! This project is being developed for the DeveloperWeek 2026 Hackathon, but we welcome contributions from the community.

## Code of Conduct

Be respectful, inclusive, and considerate. We're all here to learn and build something awesome together.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the problem
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)
- Any relevant error messages or stack traces

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- Clear and descriptive title
- Detailed description of the proposed functionality
- Why this enhancement would be useful
- Examples of how it would work

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear commit message

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rodrigoguedes09/ghost-debugger.git
   cd ghost-debugger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Code Style

We use ESLint and Prettier to maintain code quality:

```bash
npm run lint
npm run format
```

### TypeScript Guidelines

- Use explicit types where possible
- Avoid `any` type unless absolutely necessary
- Document public APIs with JSDoc comments
- Use meaningful variable and function names

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

## Project Structure

```
src/
├── cli/          # CLI commands and interface
├── capture/      # Error capture logic
├── api/          # Kilo API client
├── types/        # TypeScript type definitions
└── utils/        # Utility functions

tests/            # Test files (mirror src structure)
examples/         # Example projects for testing
docs/             # Additional documentation
```

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Aim for >70% code coverage

```bash
npm test
npm run test:coverage
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for public APIs
- Include examples for new features

## Questions?

Feel free to open an issue with the "question" label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
