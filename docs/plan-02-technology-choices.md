# The Cinephile — Implementation Plan (Part 2)
## Technology Choices

---

## 3. Technology Choices

### Frontend: React 19 + TypeScript

**Why chosen:** You're learning the Claude API and system prompting — React + TypeScript is the standard frontend for AI chat interfaces. The patterns (streaming state, message arrays, role-based rendering) transfer directly to any LLM API integration. React 19 is stable and mature.

**Free-tier limitations:** N/A — runs in the browser.

**Failure modes:** None relevant — it's client-side code.

**Alternative considered:** Vanilla JS/HTML. Rejected because React's component model and state management make chat UIs significantly cleaner, and the learning value is higher for your goals.

**Alternative considered:** Svelte/SvelteKit. Rejected because React knowledge transfers more broadly, and the Cloudflare Pages + Vite + React ecosystem is better documented.

---

### Build Tool: Vite 8

**Why chosen:** Fastest DX for React+TS projects. Native Tailwind v4 plugin support. The Cloudflare Pages integration is seamless — `npm run build` produces a `dist/` folder that deploys directly.

**Current version:** Vite 8.2.x (as of August 2026). Scaffold with `npm create vite@latest ./ -- --template react-ts`.

**Free-tier limitations:** N/A — it's a build tool.

**Failure modes:** Breaking changes between major versions. Mitigated by pinning in `package.json`.

**Alternative considered:** Next.js. **Rejected.** Next.js adds SSR, routing, and server component complexity that this project doesn't need. It's a single-page chat app. Vite is simpler and produces a clean static SPA.

---

### Styling: Tailwind CSS v4

**Why chosen:** You asked about Tailwind. Tailwind v4 is the right choice here — it's CSS-first (no `tailwind.config.js`), uses a Vite plugin (`@tailwindcss/vite`), and is extremely fast. For a single-page chat UI, it keeps styling co-located and consistent.

**Setup (v4 changes from v3):**
- Install: `npm install tailwindcss @tailwindcss/vite`
- Vite config: add `tailwindcss()` to plugins
- CSS entry: `@import "tailwindcss";` (replaces old `@tailwind` directives)
- Theme: configured via `@theme {}` blocks in CSS, not JS

**Free-tier limitations:** N/A.

**Failure modes:** Browser compatibility — Tailwind v4 requires Safari 16.4+, Chrome 111+, Firefox 128+. This is fine for August 2026.

**Alternative considered:** Vanilla CSS. Rejected because Tailwind's utility classes are faster to iterate with for a small project, and dark mode support is trivial.

---

### Hosting & Backend: Cloudflare Pages + Pages Functions

**Why chosen:** Single deployment target for both static frontend and serverless API. The Pages Function at `/functions/api/chat.ts` *is* a Worker — same runtime, same bindings, zero CORS configuration needed.

**Free-tier limits:**
| Resource | Limit |
|---|---|
| Requests/day | 100,000 |
| CPU time/request | 10ms (I/O wait doesn't count) |
| Bandwidth | Unlimited |
| Builds/month | 500 |
| Static files/site | 20,000 |
| Custom domains | 100 |
| Subdomain | `*.pages.dev` (free) |

**Important quotas:** 100,000 requests/day is far more than the AI model can serve. The bottleneck is always the Workers AI neuron budget, not the Worker request limit.

**Failure modes:**
- Build failures (mitigated by local testing before push)
- CPU time exceeded (unlikely — our Worker just validates input and calls AI binding, which is I/O)
- Cloudflare outage (rare, no mitigation needed for a fun project)

**Alternative considered:** Vercel + external API. Rejected because it requires managing an external API key (Groq, Google, etc.), adds a secret management concern, and splits the deployment across two services. Cloudflare's Workers AI binding is the cleanest zero-key integration available.

**Alternative considered:** Separate Cloudflare Worker + Pages. Rejected because a single Pages project with Functions is simpler — one repo, one deploy, no CORS.

---

### AI Inference: Cloudflare Workers AI

**Why chosen:** It's the only option where the model runs as a **platform binding** — no API key, no external HTTP call, no secret to manage. You call `env.AI.run()` directly in your Worker code. This eliminates an entire class of security and operational concerns.

**Free-tier limits:**
| Resource | Limit |
|---|---|
| Neurons/day | 10,000 |
| Reset time | 00:00 UTC daily |
| RPM (text generation) | 300 |

**Estimated capacity with chosen model (`llama-4-scout-17b-16e-instruct`):**
- ~150–400 conversational turns/day (depends on message length)
- At an average of 8 messages per conversation: ~20–50 conversations/day
- This is appropriate for a fun indie project, not a SaaS product

**Failure modes:**
- Neuron budget exhaustion → return in-character "The Cinephile has retired for the evening" message
- Model timeout → retry once, then return in-character error
- 429 rate limit → return retry-after message

**Alternative considered:** Google Gemini API free tier (1,500 RPD, excellent quality). **Rejected as primary** because:
1. Requires an API key → introduces secret management
2. Free tier data is used for Google training → privacy concern for users
3. Terms restrict EEA users to paid tier → accessibility issue
4. Adds external dependency to what should be a self-contained Cloudflare project

**Alternative considered:** Groq free tier (14,400 RPD, blazing fast). **Rejected as primary** because:
1. Requires an API key
2. Free tier terms may change
3. Adds external network dependency (latency, availability)
4. The speed advantage is less relevant when streaming

> **Note:** Both Gemini and Groq are excellent *fallback* options if you later need more capacity. The architecture makes it trivial to add a fallback provider. But for V1, the simplicity of a single-platform deployment with zero API keys is the right call.

---

### Rate Limiting: Workers Rate Limiting Binding

**Why chosen:** Native Cloudflare feature. Configured in `wrangler.toml` with `[[ratelimits]]`. Called in Worker code as `env.RATE_LIMITER.limit({ key: ip })`. No KV writes, no external service, no cost.

**Configuration:** 10 requests per 60 seconds per IP.

**Free-tier limitations:** Part of the Workers platform — no additional cost.

**Alternative considered:** KV-based rate limiting. Rejected because it consumes the 1,000 writes/day KV limit and is more complex to implement. The native binding is purpose-built for this.

---

### Conversation State: Browser localStorage

**Why chosen:** The simplest possible state management. Messages are stored as a JSON array in `localStorage`. The full conversation is sent to the server with each request. The server is completely stateless.

**Limits:** `localStorage` has a ~5MB limit per origin. At ~500 bytes per message, that's ~10,000 messages before hitting the limit. We'll cap conversations at 50 messages (25 turns) well before that.

**Failure modes:**
- Private browsing may have reduced storage → graceful fallback to session-only state
- User clears browser data → conversation lost (expected and acceptable)

**Alternative considered:** Server-side storage (KV, D1). Rejected because it adds complexity, requires session management, and the KV write limit (1,000/day) would become another bottleneck. For a chatbot with no accounts, browser-side state is correct.
