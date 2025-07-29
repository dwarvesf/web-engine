# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web engine for building static sites, primarily used for Dwarves Foundation's website. It's a monorepo with a Next.js app, themes system, and Lambda functions, managed with pnpm workspaces.

## Key Development Commands

### Main Development

- `pnpm dev` - Start development server (runs content processing, then Next.js dev)
- `pnpm build` - Full production build (clones content, processes config, builds Next.js)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier

### Theme Development

- `pnpm themes:dev` - Watch mode for all themes
- `pnpm themes:build` - Build all themes
- `pnpm themes:lint` - Lint all themes
- `pnpm themes:type-check` - TypeScript check for themes

### Individual App Commands (from app/ directory)

- `npx tsx scripts/dev.ts` - Development with content processing
- `npx tsx scripts/build.ts` - Production build
- `tsx scripts/clone-repo.ts` - Clone content repository
- `tsx scripts/copy-content.ts` - Copy content files
- `tsx scripts/process-site-config.ts` - Process site configuration

## Architecture

### Monorepo Structure

- `/app/` - Next.js application with MDX processing
- `/themes/default/` - Default theme components and styles
- `/memory-bank/` - Development logs and reflections

### Content Management

- Content is stored externally and cloned via `clone:repo` script
- MDX files in `/public/content/` are processed at build time
- Site configuration is generated from `/public/content/site.json`
- Dynamic routing via `[[...slug]].tsx` handles all pages

### Theme System

- Themes are workspace packages with React components
- Default theme provides UI components, forms, and layouts
- Theme selection via `theme` field in site config
- Components use Tailwind CSS with custom configuration

### Build Process

1. Clone external content repository
2. Copy content to `/public/content/`
3. Process site configuration from `site.json`
4. Build Next.js application with MDX processing
5. Generate static output in `/out/`

### Key Technologies

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **Content**: MDX with next-mdx-remote-client
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm with workspaces
- **TypeScript**: Full TypeScript support

### Configuration

- Site config loaded from generated JSON at `/app/src/generated/site-config.json`
- Theme configuration in `/themes/default/theme.json`
- Environment variable `NEXT_PUBLIC_PAGES_BASE_PATH` for deployment paths

## Important Files

- `/app/src/global/config/site-config.ts` - Site configuration loader and types
- `/app/src/pages/[[...slug]].tsx` - Dynamic routing for all pages
- `/app/src/global/mdx/mdx-page.tsx` - MDX page renderer
- `/themes/default/modules/template-render.tsx` - Theme template selector
- `/public/content/site.json` - Site configuration source

## Development Notes

- Always run `pnpm dev` (not just `next dev`) to ensure content processing
- Content changes require restarting dev server or running `pnpm run cp:content`
- Theme changes are watched automatically in dev mode
- Pre-commit hooks run linting and formatting via husky + lint-staged
