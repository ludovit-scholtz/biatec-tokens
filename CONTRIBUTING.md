# Contributing to Biatec Tokens

Thank you for your interest in contributing to Biatec Tokens! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept differing viewpoints gracefully
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/biatec-tokens.git
   cd biatec-tokens
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/scholtz/biatec-tokens.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create your `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Keeping Your Fork Up to Date

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run the build to check for TypeScript errors
npm run build

# Test the application locally
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new token standard support"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Style

### TypeScript

- **Strict Mode**: Always enabled
- **Type Safety**: Avoid `any` types
- **Naming Conventions**:
  - Variables and functions: `camelCase`
  - Components: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Interfaces: `PascalCase` with descriptive names

Example:
```typescript
// Good
interface TokenMetadata {
  name: string;
  symbol: string;
}

const createToken = async (metadata: TokenMetadata): Promise<Token> => {
  // implementation
}

// Avoid
const CreateToken = async (data: any) => {
  // implementation
}
```

### Vue Components

- Use **Composition API** with `<script setup>`
- Structure: `<script setup>` → `<template>` → `<style>`
- Props should be typed
- Emit events should be defined

Example:
```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  update: [value: number]
}>()
</script>

<template>
  <div>{{ title }}: {{ count }}</div>
</template>

<style scoped>
/* Component-specific styles */
</style>
```

### Styling

- Use **Tailwind CSS** utility classes
- Follow existing design patterns
- Support both light and dark modes
- Use the color palette defined in `tailwind.config.js`

```vue
<!-- Good -->
<button class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
  Click me
</button>

<!-- Avoid inline styles -->
<button style="padding: 1rem; background: blue;">
  Click me
</button>
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   └── Input.vue
│   ├── layout/          # Layout components
│   │   ├── Navbar.vue
│   │   └── Sidebar.vue
│   └── TokenCard.vue    # Feature-specific components
├── stores/              # Pinia stores
├── router/              # Vue Router config
├── views/               # Page components
└── main.ts              # App entry point
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(tokens): add ARC-200 token support

Add support for creating and deploying ARC-200 tokens with full
metadata support and IPFS integration.

Closes #123

fix(wallet): resolve connection timeout issue

The wallet connection was timing out after 5 seconds. Increased
the timeout to 30 seconds and added retry logic.

Fixes #456

docs(readme): update installation instructions

Updated the README with more detailed installation instructions
and troubleshooting tips.
```

## Pull Request Process

### Before Submitting

1. **Code Quality**:
   - [ ] Code follows project style guidelines
   - [ ] TypeScript compilation passes (`npm run build`)
   - [ ] No console errors or warnings
   - [ ] All files have proper imports

2. **Testing**:
   - [ ] Tested locally with `npm run dev`
   - [ ] Tested in both light and dark modes
   - [ ] Tested on different screen sizes (responsive)
   - [ ] Wallet integration tested (if applicable)

3. **Documentation**:
   - [ ] Code comments added for complex logic
   - [ ] README updated (if needed)
   - [ ] CHANGELOG updated (for significant changes)

### PR Title Format

Follow the same format as commit messages:

```
feat(tokens): add support for ERC-1155 tokens
fix(ui): resolve dark mode contrast issues
docs: add API documentation
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on different browsers
```

### Review Process

1. At least one maintainer must approve the PR
2. All CI checks must pass
3. No merge conflicts with the main branch
4. All review comments must be resolved

### After Approval

- Maintainers will merge your PR
- Your changes will be included in the next release
- You'll be credited in the release notes

## Testing

### Manual Testing

1. **UI Testing**:
   - Test on Chrome, Firefox, Safari
   - Test responsive design (mobile, tablet, desktop)
   - Test dark mode and light mode
   - Test all interactive elements

2. **Functional Testing**:
   - Test all user flows
   - Test error handling
   - Test wallet connections
   - Test form validation

3. **Browser Console**:
   - Check for errors
   - Check for warnings
   - Monitor network requests

### Automated Testing (Future)

When test infrastructure is added:
```bash
npm test           # Run unit tests
npm run test:e2e   # Run end-to-end tests
npm run test:coverage  # Generate coverage report
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and complex logic
- Document component props and emits
- Include usage examples for reusable components

Example:
```typescript
/**
 * Creates a new token on the Algorand blockchain
 * 
 * @param metadata - Token metadata including name, symbol, and supply
 * @param network - Target network (voi-mainnet, aramidmain, dockernet)
 * @returns Promise resolving to the created token with asset ID
 * 
 * @example
 * ```ts
 * const token = await createToken({
 *   name: "My Token",
 *   symbol: "MTK",
 *   totalSupply: "1000000"
 * }, "voi-mainnet")
 * ```
 */
async function createToken(metadata: TokenMetadata, network: string): Promise<Token> {
  // implementation
}
```

### README Updates

Update the README when:
- Adding new features
- Changing setup instructions
- Adding new dependencies
- Changing environment variables

## Questions?

- Open an issue for bug reports or feature requests
- Start a discussion for general questions
- Join our [Community Discord/Slack] (if available)

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

Thank you for contributing to Biatec Tokens! 🚀
