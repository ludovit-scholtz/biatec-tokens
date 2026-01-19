# Contributing to Biatec Tokens

Thank you for your interest in contributing to Biatec Tokens! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A code editor (VS Code recommended)
- Basic knowledge of Vue 3, TypeScript, and Algorand

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/biatec-tokens.git
   cd biatec-tokens
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/scholtz/biatec-tokens.git
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Verify Build Works**
   ```bash
   npm run build
   ```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Making Changes

1. **Make your changes** in the feature branch
2. **Test your changes** thoroughly
3. **Ensure code quality**:
   ```bash
   npm run build  # Includes TypeScript type checking
   ```
4. **Keep commits atomic** - One logical change per commit
5. **Write clear commit messages** (see Commit Guidelines below)

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# Push to your fork (force push after rebase)
git push origin feature/your-feature-name --force-with-lease
```

## Coding Standards

### TypeScript

- **Strict Mode**: Always use TypeScript strict mode
- **Type Safety**: Avoid using `any` type
- **Explicit Types**: Define interfaces for complex objects
- **No Unused Variables**: Clean up unused imports and variables

Example:
```typescript
// ✅ Good
interface TokenData {
  name: string;
  symbol: string;
  supply: number;
}

const createToken = (data: TokenData): Promise<Token> => {
  // Implementation
};

// ❌ Bad
const createToken = (data: any) => {
  // Implementation
};
```

### Vue Components

- **Composition API**: Use `<script setup>` syntax
- **TypeScript**: Type all props, emits, and refs
- **Single Responsibility**: Keep components focused
- **Reusability**: Extract common logic into composables

Example:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  tokenName: string;
  supply: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  create: [token: Token];
}>();

const isValid = computed(() => props.supply > 0);
</script>
```

### Styling

- **Tailwind CSS**: Use utility classes first
- **Custom Classes**: Only when necessary for reusability
- **Dark Mode**: Always support dark mode
- **Responsive**: Mobile-first approach

Example:
```vue
<template>
  <!-- ✅ Good: Tailwind utilities with dark mode -->
  <button class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg">
    Create Token
  </button>
  
  <!-- ❌ Bad: Inline styles -->
  <button style="padding: 8px 16px; background: blue;">
    Create Token
  </button>
</template>
```

### File Organization

```typescript
// 1. Imports - external first, then internal
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { Token } from '@/types';

// 2. Types/Interfaces
interface FormData {
  // ...
}

// 3. Component/Store definition
export const useTokenStore = defineStore('tokens', () => {
  // 4. State
  const tokens = ref<Token[]>([]);
  
  // 5. Computed
  const totalTokens = computed(() => tokens.value.length);
  
  // 6. Methods
  const createToken = async (data: FormData) => {
    // ...
  };
  
  // 7. Return
  return {
    tokens,
    totalTokens,
    createToken,
  };
});
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Use them
- **Line Length**: Max 120 characters
- **Trailing Commas**: Use them in multi-line objects/arrays

Prettier configuration handles most of this automatically.

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(tokens): add support for ARC72 token creation

# Bug fix
fix(wallet): resolve Pera wallet connection timeout issue

# Documentation
docs(readme): update installation instructions

# Multiple changes in body
feat(dashboard): add token analytics view

- Add chart component for token statistics
- Implement transaction history table
- Add export to CSV functionality

Closes #123
```

### Best Practices

- **Present Tense**: Use "add" not "added"
- **Imperative Mood**: "fix bug" not "fixes bug"
- **Lowercase**: Start subject with lowercase (except proper nouns)
- **No Period**: Don't end subject with a period
- **50/72 Rule**: Subject max 50 chars, body wrap at 72 chars
- **Reference Issues**: Use "Closes #123" or "Fixes #456"

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes
2. **Test thoroughly** - All features work as expected
3. **Build succeeds** - `npm run build` completes without errors
4. **No TypeScript errors** - Type checking passes
5. **Code is clean** - No console.logs, commented code, or debug statements
6. **Documentation updated** - If adding features

### Creating a Pull Request

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request** on GitHub

3. **Fill out the PR template**:
   - Clear description of changes
   - Motivation and context
   - Type of change (bug fix, feature, etc.)
   - Testing performed
   - Screenshots (for UI changes)
   - Related issues

4. **Request review** from maintainers

### PR Title Format

Use the same format as commit messages:

```
feat(tokens): add ARC72 token support
fix(wallet): resolve connection timeout
docs(contributing): add PR guidelines
```

### Review Process

- Maintainers will review your PR
- Address feedback and requested changes
- Keep discussions professional and constructive
- Be patient - reviews may take a few days

### After Approval

- PR will be merged by maintainers
- Your branch can be deleted
- Celebrate! 🎉

## Testing

### Manual Testing

Currently, the project relies on manual testing:

1. **Token Creation**: Test all token standards
2. **Wallet Connection**: Test all supported wallets
3. **Network Switching**: Test on different networks
4. **Responsive Design**: Test on mobile and desktop
5. **Dark Mode**: Test both themes

### Future: Automated Testing

We plan to add automated testing with Vitest. Contributions in this area are welcome!

```bash
# Future commands (not yet implemented)
npm run test              # Run all tests
npm run test:unit         # Run unit tests
npm run test:coverage     # Generate coverage report
```

### Testing Checklist

Before submitting a PR, verify:

- [ ] All existing features still work
- [ ] New features work as expected
- [ ] UI is responsive on mobile and desktop
- [ ] Dark mode works correctly
- [ ] No console errors or warnings
- [ ] All wallet connections work
- [ ] Transactions can be signed and submitted
- [ ] Error handling works properly

## Documentation

### When to Update Documentation

Update documentation when:

- Adding new features
- Changing existing behavior
- Adding new configuration options
- Updating dependencies that affect usage

### Documentation Files

- **README.md**: Main project documentation
- **CONTRIBUTING.md**: This file
- **SECURITY.md**: Security policy and practices
- **Code Comments**: For complex logic only
- **JSDoc**: For public APIs and utilities

### Documentation Style

- **Clear and Concise**: Easy to understand
- **Examples**: Include code examples
- **Up-to-date**: Keep in sync with code
- **Beginner-Friendly**: Don't assume expert knowledge

## Getting Help

### Resources

- **README.md**: Start here for project overview
- **GitHub Issues**: Search existing issues
- **GitHub Discussions**: Ask questions, share ideas
- **Code**: Read the source code - it's well-organized!

### Asking Questions

When asking for help:

1. **Search first**: Check existing issues and discussions
2. **Be specific**: Describe what you're trying to do
3. **Include context**: Version, OS, error messages
4. **Show your work**: What have you tried?
5. **Be patient**: Maintainers are volunteers

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code review and feedback

## Recognition

Contributors are recognized in:

- Git commit history
- Release notes
- README.md (for significant contributions)
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Biatec Tokens! Your efforts help make blockchain technology more accessible to everyone.

## Quick Reference

```bash
# Setup
git clone https://github.com/YOUR_USERNAME/biatec-tokens.git
cd biatec-tokens
npm install
cp .env.example .env
npm run dev

# Development
git checkout -b feature/my-feature
# Make changes
npm run build  # Test build
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature

# Update branch
git fetch upstream
git rebase upstream/main
git push origin feature/my-feature --force-with-lease
```

Happy coding! 🚀
