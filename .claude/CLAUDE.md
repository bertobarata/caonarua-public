# CLAUDE.md — AI Assistant Guide for CNRWebSite

This file provides guidance for AI assistants (Claude and others) working on the CNRWebSite repository.

---

## Project Overview

**CNRWebSite** is the website for **Cão na Rua**, a dog daycare business based in Sintra, Lisboa, Portugal. "Cão na rua" means "dog on the street" in Portuguese.

The site is a small business web presence aimed at local pet owners in the Sintra/Lisboa area. It should reflect the brand's personality — friendly, local, and dog-focused — and be accessible to a Portuguese-speaking audience.

---

## Tech Stack

This is a **static HTML/CSS website** — no JavaScript framework.

| Layer | Technology |
|---|---|
| Markup | Plain HTML |
| Styling | Plain CSS |
| CSS optimization | [PurgeCSS](https://purgecss.com/) v7 — strips unused CSS for production |
| Package manager | npm |
| Runtime (dev) | Node.js 20 or ≥22 |

There is no bundler, no transpiler, and no frontend framework. Keep it that way unless there is a clear reason to add complexity.

---

## Development Workflow

### Branch Strategy

- Work on feature branches named `feature/<short-description>`
- Bugfixes go on `fix/<short-description>`
- AI-assisted work uses branches prefixed `claude/<description>-<session-id>`
- Never commit directly to `main` — always open a pull request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(homepage): add hero section with Cão na Rua branding
fix(nav): correct active link highlight on mobile
docs(readme): update setup instructions
```

### Pull Requests

- Keep PRs small and focused on a single concern
- Write a clear description explaining *what* changed and *why*
- Link related issues with `Closes #<issue>` when applicable

---

## Code Conventions

These conventions should be adopted and enforced once the stack is chosen. Update this section when tooling is configured.

### General

- Prefer explicit over implicit
- Avoid premature abstraction — solve the current problem, not a hypothetical future one
- Delete dead code rather than commenting it out
- Write code that reads like prose; use comments only where intent is not obvious from the code

### Naming

| Context | Convention |
|---|---|
| HTML & CSS files | `kebab-case` |
| CSS classes | `kebab-case` |
| Image & asset files | `kebab-case` |
| JavaScript variables & functions (if any) | `camelCase` |
| Constants (if any) | `UPPER_SNAKE_CASE` |

### File Organization

```
/
├── index.html         # Homepage
├── *.html             # Other pages (e.g. servicos.html, contacto.html)
├── css/
│   ├── style.css      # Main stylesheet (source)
│   └── style.min.css  # PurgeCSS output (generated, do not edit manually)
├── images/            # Photos and graphics
├── js/                # JavaScript (only if needed)
└── package.json       # Dev tooling config
```

Update this section if the actual structure differs.

---

## Environment Setup

Node.js 20 or ≥22 is required.

```bash
git clone <repo-url>
cd CNRWebSite
npm install
```

To purge unused CSS for production:

```bash
npx purgecss --config purgecss.config.js
```

No development server is needed — open `index.html` directly in a browser, or use any static file server (e.g. `npx serve .`).

---

## Testing

No automated test suite is configured. Manual testing checklist before opening a PR:

- [ ] Pages render correctly in Chrome, Firefox, and Safari
- [ ] Layout is responsive on mobile (375px), tablet (768px), and desktop (1280px)
- [ ] All links and navigation work
- [ ] Images load and have `alt` text
- [ ] Portuguese text has no spelling errors
- [ ] PurgeCSS output does not remove styles that are in use

---

## Key Instructions for AI Assistants

1. **Read before editing.** Always read existing files before modifying them. Understand the surrounding context.
2. **Stay focused.** Only change what the task requires. Do not refactor, reformat, or "improve" surrounding code unless asked.
3. **No unnecessary files.** Do not create new files unless the task explicitly requires them. Prefer editing existing files.
4. **No invented conventions.** Follow the conventions documented here and visible in the existing codebase. Do not introduce new patterns without discussion.
5. **No secrets in code.** Never hardcode API keys, passwords, tokens, or other secrets. Use environment variables.
6. **No force pushes to main.** Never use `git push --force` on protected branches.
7. **Commit clearly.** Write commit messages that explain *why* a change was made, not just *what* changed.
8. **Update this file.** When the project structure, stack, or conventions change significantly, update CLAUDE.md to reflect the current state.

---

## Updating This File

This file should be kept current. Update it when:

- The tech stack is chosen or changes
- New tooling (linter, formatter, test runner) is added
- Directory structure is established or reorganized
- New team conventions are agreed upon
- CI/CD pipelines are configured

Last updated: 2026-03-28
