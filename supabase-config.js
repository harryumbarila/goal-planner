// supabase-config.js — shared by auth.html and index.html
// Goal Planner · Supabase project: bdkngcagwcraoivqlmow (sa-east-1)

const SUPABASE_URL     = 'https://bdkngcagwcraoivqlmow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka25nY2Fnd2NyYW9pdnFsbW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODI1ODUsImV4cCI6MjA5MzU1ODU4NX0.Vn90hhbUs9Q6pJvhG0oLOVNrHRWVnLz8cAOgLqyuga4';

// This file must be loaded AFTER the supabase-js CDN script.
// Both HTML files include:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
//   <script src="supabase-config.js"></script>

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey:     'goal-planner-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,   // handles magic-link & OAuth redirects
  },
});

// ── helpers ──────────────────────────────────────────────────────────────────

/** Returns the current session user, or null. */
async function getUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

/** Redirect to auth.html if not authenticated. Call at app boot. */
async function requireAuth(redirectTo = 'auth.html') {
  const user = await getUser();
  if (!user) {
    window.location.href = redirectTo;
  }
  return user;
}

/** Log a structured event to the `events` table (fire-and-forget). */
function logEvent(goalId, eventType, payload = {}) {
  db.from('events')
    .insert({ goal_id: goalId, event_type: eventType, payload })
    .then(({ error }) => {
      if (error) console.warn('[supabase] logEvent failed:', error.message);
    });
}
