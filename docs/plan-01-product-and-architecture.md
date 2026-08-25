# The Cinephile — Implementation Plan (Part 1)
## Product Definition & Architecture

---

## 1. Product Definition

### What V1 IS

A single-page web app where users land and immediately start chatting with **The Cinephile** — a pretentious, witty, opinionated AI film critic. No signup. No configuration. One conversation at a time, stored in the browser.

**Core features:**
- Instant chat interface with The Cinephile character
- 5 randomized conversation starters to seed first interaction
- Streaming responses for snappy feel
- Client-side conversation history (survives refresh, clearable)
- "New conversation" button
- Rate limiting and abuse protection (invisible to normal users)
- Mobile-first responsive design
- Graceful degradation when limits are hit (in-character error messages)

**One V1 enhancement worth including:** A "Defend This Film" mode — a single button that picks a critically-panned movie and challenges the user to defend it while The Cinephile tears it apart. This is trivial to implement (it's just a pre-seeded prompt) and materially improves engagement by giving users a *game* to play, not just a chatbox.

### What V1 is NOT

- No authentication, accounts, or user profiles
- No server-side conversation storage
- No multiple chat threads
- No image generation or movie poster display
- No database
- No movie API integrations (TMDb, etc.)
- No sharing/social features
- No admin dashboard
- No analytics beyond what Cloudflare provides for free
- No multiple character personalities
- No "taste profiling" or persistent memory across sessions

---

## 2. Recommended Architecture

### Request Flow

```
Browser (React SPA)
    │
    │  POST /api/chat  { messages: [...], mode?: "defend" }
    │  (conversation history sent from browser)
    │
    ▼
Cloudflare Pages Function (Edge Worker)
    │
    ├─ 1. Validate request (size, shape, rate limit)
    ├─ 2. Truncate conversation to fit context window
    ├─ 3. Prepend system prompt (never sent to browser)
    ├─ 4. Call Workers AI model
    ├─ 5. Stream response back to browser
    │
    ▼
Workers AI  (@cf/meta/llama-4-scout-17b-16e-instruct)
    │
    │  Streaming SSE response
    │
    ▼
Browser receives streamed tokens, appends to conversation
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  React SPA  │  │ localStorage │  │  Chat State   │  │
│  │  (Vite +    │  │ (messages,   │  │  (React       │  │
│  │  Tailwind)  │  │  settings)   │  │   useState)   │  │
│  └──────┬──────┘  └──────────────┘  └───────────────┘  │
│         │                                               │
└─────────┼───────────────────────────────────────────────┘
          │ HTTPS POST /api/chat (SSE stream)
          ▼
┌─────────────────────────────────────────────────────────┐
│              CLOUDFLARE EDGE (Single Project)           │
│                                                         │
│  ┌──────────────────────────────────┐                   │
│  │     Pages Function (/api/chat)   │                   │
│  │                                  │                   │
│  │  ┌────────────┐ ┌─────────────┐  │                   │
│  │  │   Rate     │ │  Request    │  │                   │
│  │  │  Limiter   │ │  Validator  │  │                   │
│  │  │ (binding)  │ │  & Sanitize │  │                   │
│  │  └────────────┘ └─────────────┘  │                   │
│  │                                  │                   │
│  │  ┌────────────┐ ┌─────────────┐  │                   │
│  │  │  System    │ │  Context    │  │                   │
│  │  │  Prompt    │ │  Truncation │  │                   │
│  │  │  Builder   │ │  Logic      │  │                   │
│  │  └────────────┘ └─────────────┘  │                   │
│  │                                  │                   │
│  └──────────────┬───────────────────┘                   │
│                 │                                       │
│  ┌──────────────▼───────────────────┐                   │
│  │         Workers AI Binding       │                   │
│  │  @cf/meta/llama-4-scout-17b-16e  │                   │
│  └──────────────────────────────────┘                   │
│                                                         │
│  ┌──────────────────────────────────┐                   │
│  │     Static Assets (Pages)        │                   │
│  │     React SPA build output       │                   │
│  └──────────────────────────────────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Single Cloudflare Pages project** — frontend static assets + `/functions/api/chat.ts` as the backend. One deploy, one project, zero CORS issues.

2. **No database** — conversation state lives entirely in the browser's `localStorage`. The server is stateless. Every request includes the full conversation history needed for context.

3. **No external API keys** — Workers AI is a binding, not an API call. No secrets to leak, no keys to rotate.

4. **Server-sent Events (SSE) for streaming** — not WebSockets. SSE is simpler, works through Cloudflare's edge, and is sufficient for one-directional streaming.

5. **Rate limiting via Workers Rate Limiting binding** — native Cloudflare feature, configured in `wrangler.toml`, zero cost, no KV writes needed.
