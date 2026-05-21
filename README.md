# Goal Planner

Goal Planner is a personal finance planner for setting investment goals and tracking progress in Colombian pesos.

The app is built as a static React experience in plain HTML files. It uses Supabase for authentication and cloud data, and Vercel for deployment.

## Features

- Guided onboarding for creating a first financial goal
- Goal projections with contributions, expected return, inflation and scenarios
- Multiple goals with shareable planner state
- Monthly contribution tracking and progress history
- Goal archiving and restoration
- Light and dark themes

## Project Structure

| File | Purpose |
| --- | --- |
| `auth.html` | Sign-in and onboarding flow |
| `index.html` | Main planner experience |
| `tracking.html` | Monthly contribution tracking |
| `supabase-config.js` | Shared Supabase client configuration |

## Stack

- React 18 and ReactDOM from CDN
- Babel Standalone for JSX in the browser
- Chart.js for planner charts
- Supabase Auth and database sync
- Vercel static hosting

There is no build step and no `node_modules` directory.

## Run Locally

Serve the repository root with any static file server. For example:

```bash
python -m http.server 3000
```

Then open the local site in a browser.

## Deployment

The site is ready for Vercel deployment from the repository root.

Import the GitHub repository into Vercel as a static project. The HTML files live at the repository root, so no build command or generated output directory is required.

## Data and Auth

Supabase handles sign-in and shared data for goals, contributions and related planner state. The public client configuration lives in `supabase-config.js`; database access should remain protected by Supabase Row Level Security policies.

## Product Notes

- Locale: Spanish for Colombia (`es-CO`)
- Currency: Colombian pesos
- Large COP values use `MM` for miles de millones instead of `B`
