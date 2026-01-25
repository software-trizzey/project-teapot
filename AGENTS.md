# Repository Agent Guide

## Project Overview
- Next.js App Router project (see `app/`)
- TypeScript with `strict: true`
- Tailwind CSS for styling (`globals.css`)
- Aliased imports: `@/*` maps to repo root
- Package manager: pnpm (see `pnpm-lock.yaml`)

## Required Checks (Before PR)
- Run lint after changes where possible
- Run build after significant changes
- Run tests if a runner is introduced

## Commands
### Install
- `pnpm install`

### Dev Server
- `pnpm dev`

### Build
- `pnpm build`

### Start (production)
- `pnpm start`

### Lint
- `pnpm lint`

### Typecheck (optional)
- `pnpm exec tsc --noEmit`

### Tests
- No test runner configured yet
- If a runner is added, follow the script name in `package.json`

### Single Test (when available)
- Not configured currently
- Common pattern once added: `pnpm test -- <pattern>`
- Example (Jest/Vitest): `pnpm test -- app/page.test.tsx`

## Repository Structure
- `app/`: Next.js App Router routes and layouts
- `components/`: Shared UI components
- `components/scene/`: Scene-related components
- `components/dialog/`: Dialog-related components
- `lib/`: Shared utilities and controllers
- `public/`: Static assets
- `docs/`: Project notes

## TypeScript Guidelines
- Prefer explicit types for public APIs
- Use `import type` for type-only imports
- Avoid `any`; use `unknown` with narrowing
- Use unions/enums for discrete states
- Keep props and controller interfaces local to the file

## React/Next.js Guidelines
- Use Server Components by default
- Add `"use client"` only when needed
- Keep client components focused and small
- Use `next/image` for images in `public/`
- Use `next/link` for internal navigation
- Prefer `Metadata` in layouts/pages for SEO

## Styling Guidelines
- Use Tailwind utility classes for styling
- Prefer semantic grouping of classes
- Use `clsx` for conditional classes
- Use `tailwind-merge` when combining class strings
- Avoid inline styles unless necessary

## Imports
- Order imports: external, internal, styles
- Keep a blank line between import groups
- Prefer absolute imports via `@/` for cross-folder refs
- Avoid deep relative imports when alias works

## Formatting
- Follow existing formatting in `app/` files
- Use 2-space indentation
- Use double quotes for strings
- Use semicolons where present in the file
- Keep JSX props one per line when long

## Naming
- Components: PascalCase (e.g., `SceneVideo`)
- Files for components: PascalCase `.tsx`
- Hooks: `use` prefix (e.g., `useDialogState`)
- Utilities: lowerCamelCase
- Constants: UPPER_SNAKE_CASE only for true constants

## Error Handling
- Surface user-facing errors in UI state
- Log unexpected errors and rethrow when needed
- Prefer `try/catch` around async boundaries
- Do not swallow errors silently

## State & Data
- Keep state close to where it’s used
- Use derived state instead of duplicating data
- Avoid global state unless shared across routes

## Accessibility
- Ensure interactive elements are keyboard accessible
- Provide `alt` text for images
- Use semantic HTML where possible

## Testing Notes
- No tests currently
- If tests are added:
  - Co-locate unit tests near modules
  - Use descriptive test names
  - Prefer deterministic tests

## Lint Configuration
- Uses `eslint-config-next` (core-web-vitals + typescript)
- Default ignores restored via `globalIgnores`

## Cursor/Copilot Rules
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found

## Contribution Workflow
- Keep changes minimal and scoped
- Update docs when behavior changes
- Avoid unrelated refactors

## Notes for Agents
- Prefer existing patterns in `app/layout.tsx` and `app/page.tsx`
- Use `components/index.ts` and sub-barrels when available
- Place new utilities in `lib/` with named exports
