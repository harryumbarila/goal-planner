# Goal Planner — Claude Context

Personal finance goal planner for tracking investment progress in Colombian Pesos (COP). Shared privately with close friends, deployed on Netlify.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

## Project Overview

- **Product**: `Goal Planner — Planea hoy. Llega mañana.`
- **Version**: v1.5
- **Audience**: personal use + close friends (not a public product)
- **Locale**: Spanish (Colombia), `es-CO`
- **Currency**: COP only (uses `MM` for miles de millones, never "B" — "billón" in Spanish = 1 trillion)
- **Deployment**: Netlify (static hosting — drop `index.html`, `auth.html`, `supabase-config.js` and it runs)

## Architecture

**Two-file React app + shared config.** Everything lives in three static files:

| File | Role |
|------|------|
| `auth.html` | Sign-in / onboarding (magic link, Google OAuth, 3-step goal setup) |
| `index.html` | Main planner app (requires active Supabase session) |
| `supabase-config.js` | Shared Supabase client (`db`) — loaded by both HTML files |

- React 18 + ReactDOM + Babel Standalone + supabase-js 2 (all via CDN, no build step)
- Chart.js 4.4.1 (via CDN)
- **Auth**: Supabase Auth — magic link + Google OAuth. `auth.html` → `index.html` via URL params
- **Persistence**: `localStorage` (primary, instant) + Supabase `goals` table (secondary, debounced 2 s sync)
- **Prototype mode**: `auth.html` shows the stage chrome when run on `localhost` or with `?proto` — hides in production
- Shareable links use URL query params that hydrate state on load

### Supabase project

- **Project**: `goal-planner` (`bdkngcagwcraoivqlmow`, region `sa-east-1`)
- **URL**: `https://bdkngcagwcraoivqlmow.supabase.co`
- **Anon key**: in `supabase-config.js` (safe to commit — RLS enforces row-level security)
- **Schema**: `profiles`, `goals`, `snapshots`, `events` (append-only)
- **RLS**: every table restricted to `auth.uid() = user_id`
- **Google OAuth**: requires setup in Google Cloud Console (see Supabase Dashboard → Auth → Providers)

### Key components inside `index.html`

- `CurrencyInput` — COP input with dynamic `es-CO` thousands separators and cursor preservation (`requestAnimationFrame` + digit counting before caret)
- `NumberInput` — thin dispatcher that routes to `CurrencyInput` when `currency` prop is set, otherwise renders a native number input
- `WhatIfGrid` — quick scenarios (duplicar aportes, +5pp retorno, +3 años plazo, aporte $2M, escenario 12%, conservador)
- `ScenarioModal` — confirmation modal that explains each scenario (narrative + "Qué cambia" diff + resulting impact) before applying
- `WHATS_NEW` — changelog bullets rendered in the "lo nuevo" modal
- `fmt()` — COP formatter helper (millions, thousands, MM)
- Onboarding flow with `restartOnboarding` trigger
- Dark/light theme toggle driven by CSS custom properties

### Brand tokens

- Logomark: `✦` (U+2726) in `var(--accent)`
- Wordmark: **Goal** in accent color + ` planner` in body color
- Tagline: *Planea hoy. Llega mañana.*
- Favicon: inline SVG data URI of the `✦` glyph
- Accent hue: `#2563eb` (blue)

## Running Locally

Use the launch config in `.claude/launch.json`:

```bash
python -m http.server 3000
```

Then open `http://localhost:3000`. No install step, no watcher — just reload the page after edits.

For live preview during a Claude Code session, use the `Claude_Preview` MCP server (already whitelisted in `.claude/settings.local.json`).

## Conventions

### Currency handling

- All money-denominated inputs (`currentVal`, `monthlyAdd`, `goalAmount`) use `<NumberInput currency ... />`
- Non-money numeric inputs (`expectedReturn`, `goalYears`) stay as plain number inputs
- Display formatting via `toLocaleString('es-CO')`; parsing strips non-digits

### React patterns

- **Never call hooks after a conditional return.** When branching on props changes hook order, extract the conditional path into its own component (see `CurrencyInput` / `NumberInput` split).
- External state changes (e.g. a slider updating the same field) should only rewrite a controlled input's display when the input is not focused — check `document.activeElement !== inputRef.current` inside the sync `useEffect`.

### Testing caveat

Native DOM events dispatched via `preview_eval` do **not** trigger React's synthetic event system. For anything interactive, verify in a real browser.

### Responsive

- Grid collapses at `980px`
- Toolbar tightens at `720px` (icons only, text hidden via `.theme-toggle-text`)
- All toolbar buttons must follow the icon + `<span className="theme-toggle-text">label</span>` pattern so the label hides correctly on mobile

## Spec-Driven Development

This project uses [spec-kit](https://github.com/github/spec-kit). Workflows and skills live under:

- `.specify/` — specs, workflows, memory (including this project's constitution)
- `.claude/skills/speckit-git-*` — git helper skills (commit, feature, initialize, remote, validate)

Follow the constitution in `.specify/memory/constitution.md` for non-negotiable principles.

## Do Not

- Do **not** introduce a build step, bundler, or `node_modules`. Single-file deploy is a core constraint.
- Do **not** use "B" as the abbreviation for billions in Spanish — it means trillion in `es-CO`. Use `MM` (miles de millones).
- Do **not** create documentation files unless the user asks.
- Do **not** commit `.claude/settings.local.json` permission churn unless the user requests it.
