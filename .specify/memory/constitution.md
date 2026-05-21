# Goal Planner Constitution

Goal Planner is a single-file, zero-build personal finance planner in COP. These principles are non-negotiable; any change that violates them needs an explicit amendment.

## Core Principles

### I. Single-File Simplicity (NON-NEGOTIABLE)

The entire app ships as one `index.html`. No bundler, no `node_modules`, no build step, no transpile pipeline beyond the in-browser Babel Standalone CDN. Adding a build tool, framework scaffold, or split source tree requires a constitutional amendment. Dependencies are loaded via CDN and pinned by version.

### II. COP-Native UX

The app is built for Colombian Pesos and Spanish-speaking users. Money inputs must use `es-CO` thousands separators with dynamic formatting and cursor preservation. Large-scale abbreviations must respect Spanish numerical semantics — use `MM` for miles de millones; never `B`, because "billón" in `es-CO` means a trillion. All user-facing strings are Spanish.

### III. Zero-Friction Deploy

Deployment is a static file drop. `python -m http.server 3000` must be enough to run the app locally and Vercel's default static hosting (zero-config, repository root, no build command) must be enough in production. External services (Supabase) are allowed as CDN-loaded SDKs with no build step; credentials are public anon keys committed to `supabase-config.js` (RLS enforces row-level security). Any feature that requires a private server process or a secret env-var breaks this principle.

### IV. Responsive First

Every view must remain usable down to 375px width. Grid collapses at 980px, toolbar tightens at 720px. Toolbar controls must follow the icon + `.theme-toggle-text` pattern so labels hide gracefully on mobile. A feature is not considered done until it has been scroll-verified at 375px.

### V. Progressive Disclosure + Explainability

Before a destructive or consequential action (apply a scenario, reset onboarding, clear data), the user sees a confirmation that explains *what changes, why, and the expected impact*. Quick-scenario tiles must route through `ScenarioModal`. "Lo nuevo" must document every user-visible change.

### VI. Respect React's Rules

Hooks are never called after a conditional return. When a prop flips behavior enough to change hook order, split into two components and dispatch between them. Controlled inputs reconcile external state only when they are not focused (`document.activeElement !== inputRef.current`).

### VII. Brand Consistency

Wordmark, logomark (`✦`), accent color (`--accent`), and tagline (*Planea hoy. Llega mañana.*) appear together on every page-level header. Favicon and footer must stay in sync with the wordmark. Visual additions should be minimal and token-driven via CSS custom properties.

## Technical Constraints

- **Stack**: React 18, ReactDOM 18, Babel Standalone, Chart.js 4.4.1, supabase-js 2 — all via CDN, all pinned
- **Auth**: Supabase Auth (magic link + Google OAuth). `auth.html` handles the full sign-in/onboarding flow; `index.html` guards with `db.auth.getSession()` on boot
- **Persistence**: primary = `localStorage` (STORAGE_KEY versioned); secondary = Supabase `goals` table synced in background (debounced 2 s, fire-and-forget). RLS ensures each user sees only their own rows
- **Backend**: Supabase project `bdkngcagwcraoivqlmow` (sa-east-1). Schema: `profiles`, `goals`, `snapshots`, `events`. Credentials in `supabase-config.js` (anon key; safe to commit)
- **Sharing**: URL query params hydrate state on load; Supabase session persists across devices
- **Browser targets**: modern evergreen browsers (Chrome, Edge, Firefox, Safari). IE is not supported
- **Accessibility**: inputs use `inputMode` where applicable; icon-only buttons keep an accessible label via adjacent `.theme-toggle-text` span
- **Testing**: there is no automated test suite. All changes must be manually verified in a real browser — eval-based synthetic event tests are unreliable and do not count as verification

## Development Workflow

- **Spec-driven**: use the spec-kit workflows under `.specify/` and the `speckit-git-*` skills for feature branches, commits, and validation
- **Commits**: small, focused, present-tense in Spanish or English as appropriate; never commit `.claude/settings.local.json` permission churn unless the user explicitly asks
- **Version bumps**: update the `v` string in the footer and add a `WHATS_NEW` bullet for every user-visible change
- **Live preview**: use the `Claude_Preview` MCP server during development; always re-verify at 375px before merging
- **Secrets**: there are none. If a change needs a secret, it violates Principle III

## Governance

This constitution supersedes ad-hoc conventions. Amendments require:

1. A written rationale in the PR or session
2. Corresponding updates to `CLAUDE.md` if conventions change
3. A version bump of this document (semver: MAJOR for principle removal/replacement, MINOR for new principles, PATCH for clarifications)

All changes must verify compliance before being applied. Complexity must be justified against Principles I and III.

**Version**: 1.1.1 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-05-12
