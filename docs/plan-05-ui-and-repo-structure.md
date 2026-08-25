# The Cinephile — Implementation Plan (Part 5)
## UI/UX Design & Repository Structure

---

## 9. UI/UX

### Design Philosophy

This is a **polished indie internet project**, not a SaaS dashboard. Think: a single-page experience with personality, like a well-designed portfolio site or a fun web experiment. Dark theme. Cinematic feel. Minimal chrome.

### Color Palette

```css
@theme {
  /* Deep cinematic dark theme */
  --color-bg-primary: #0a0a0f;        /* Near-black with blue undertone */
  --color-bg-secondary: #12121a;      /* Slightly lighter for cards */
  --color-bg-chat: #16161f;           /* Chat message background */
  --color-surface: #1e1e2a;           /* Input area, buttons */
  --color-accent: #c8a96e;            /* Warm gold — cinema/awards feel */
  --color-accent-dim: #8a7444;        /* Muted gold for secondary elements */
  --color-text-primary: #e8e6e3;      /* Warm off-white */
  --color-text-secondary: #8a8898;    /* Muted lavender-gray */
  --color-text-accent: #c8a96e;       /* Gold for highlights */
  --color-error: #d4544e;             /* Warm red for errors */
  --color-border: #2a2a3a;            /* Subtle borders */
}
```

### Typography

**Google Font: "Instrument Serif"** for the title/branding (cinematic, editorial feel).
**Google Font: "Inter"** for body text and chat messages (clean, highly readable).

### Landing Page

```
┌──────────────────────────────────────────┐
│                                          │
│         🎬                               │
│                                          │
│      THE CINEPHILE                       │  ← Instrument Serif, gold
│                                          │
│  An insufferably opinionated film critic │  ← Inter, muted text
│  who knows more about cinema than you.   │
│  Probably.                               │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  "Defend Transformers: Age of     │  │  ← Conversation starters
│  │   Extinction to me"               │  │     (clickable cards)
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  "What's the most overrated film  │  │
│  │   of the 21st century?"           │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  "I think Marvel movies are       │  │
│  │   genuinely great cinema"         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ── or ──                                │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Ask The Cinephile anything...    │  │  ← Input field
│  │                               [→] │  │
│  └────────────────────────────────────┘  │
│                                          │
│  🎬 Defend This Film                     │  ← "Defend" mode button
│                                          │
│  ─────────────────────────────────────── │
│  A fun project. No data stored.          │  ← Footer
│  Powered by pretentiousness.             │
│                                          │
└──────────────────────────────────────────┘
```

### Chat Interface

```
┌──────────────────────────────────────────┐
│  🎬 THE CINEPHILE            [New Chat]  │  ← Sticky header
│──────────────────────────────────────────│
│                                          │
│  ┌─ You ─────────────────────────────┐   │
│  │ I think Interstellar is Nolan's   │   │  ← User message (right-aligned)
│  │ best film.                        │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ The Cinephile ───────────────────┐   │
│  │ Ah, Interstellar. A film that     │   │  ← Assistant message (left-aligned)
│  │ mistakes volume for profundity    │   │
│  │ and Hans Zimmer's organ for       │   │
│  │ emotional depth. Nolan's best?    │   │
│  │ That's a curious way to spell     │   │
│  │ "The Prestige." But I'm           │   │
│  │ intrigued — what specifically     │   │
│  │ about Interstellar elevates it    │   │
│  │ above his tighter, more           │   │
│  │ disciplined work?                 │   │
│  └───────────────────────────────────┘   │
│                                          │
│──────────────────────────────────────────│
│  ┌────────────────────────────────────┐  │
│  │  Your response...             [→] │  │  ← Input (sticky bottom)
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Loading State (Streaming)

While the model is generating:
- A subtle **pulsing film reel icon** appears next to "The Cinephile is thinking..."
- Tokens stream in character-by-character (SSE)
- The send button is disabled
- A faint typing indicator animation plays
- The loading message is: `"Consulting my mental Criterion Collection..."`

### Error State

Errors appear **inline in the chat** as system messages styled differently (italic, muted color, slightly smaller text). They're in-character. The user can still send another message — the chat is never "broken."

### Empty / Theater Closed State

When daily neurons are exhausted:
```
┌──────────────────────────────────────────┐
│                                          │
│            🎬 INTERMISSION               │
│                                          │
│  The Cinephile has screened too many     │
│  films today and has retired to a        │
│  darkened room to contemplate Bergman.   │
│                                          │
│  The projection booth reopens at         │
│  midnight UTC.                           │
│                                          │
│  ████████████░░░░░░░ 68% of day elapsed │  ← Progress to midnight UTC
│                                          │
└──────────────────────────────────────────┘
```

### Mobile Experience

- The entire UI is a single column — no layout changes needed
- Chat messages use full width with comfortable padding
- Input is sticky at the bottom with safe area inset for notched phones
- Touch targets are 44px minimum
- Conversation starters stack vertically
- No horizontal scrolling anywhere
- System font stack for maximum readability on small screens

### Conversation Starters

Randomized from a pool of ~15. Five are shown at a time. Examples:

1. "I think Marvel movies are genuinely great cinema"
2. "What's the most overrated film of the 21st century?"
3. "Convince me to watch a black-and-white film"
4. "Is Christopher Nolan a genius or just loud?"
5. "What's the worst Best Picture winner?"
6. "I've never seen The Godfather. Fight me."
7. "Why do people pretend to like art films?"
8. "Is there a perfect movie?"
9. "The Dark Knight is the greatest film ever made"
10. "Recommend me something I definitely haven't seen"
11. "Are video games cinema?"
12. "Tarantino or Scorsese?"
13. "I only watch movies made after 2010"
14. "What's the most underrated horror film?"
15. "Explain why anyone should care about cinematography"

### Animations

Keep animations subtle and performant:
- **Message appear:** Fade in + slight upward slide (150ms ease-out)
- **Streaming text:** Smooth token append with no layout jank
- **Conversation starters:** Gentle hover scale (1.02) with gold border glow
- **Header logo:** Subtle shimmer on the gold accent on initial load
- **Buttons:** Smooth background-color transitions (200ms)
- **No:** Parallax, particle effects, heavy animations, or anything that fights with readability

---

## 10. Repository Structure

```
the-cinephile/
├── public/
│   └── favicon.svg                    # Film reel icon
│
├── src/
│   ├── components/
│   │   ├── ChatMessage.tsx            # Single message bubble
│   │   ├── ChatInput.tsx              # Input field + send button
│   │   ├── ChatWindow.tsx             # Scrollable message list
│   │   ├── ConversationStarters.tsx   # Landing page starter cards
│   │   ├── Header.tsx                 # Top bar with logo + new chat
│   │   ├── TheaterClosed.tsx          # Exhausted-state display
│   │   └── StreamingIndicator.tsx     # "Thinking..." animation
│   │
│   ├── hooks/
│   │   ├── useChat.ts                 # Core chat logic (send, stream, state)
│   │   └── useLocalStorage.ts         # localStorage read/write hook
│   │
│   ├── lib/
│   │   ├── api.ts                     # fetch wrapper for /api/chat
│   │   ├── constants.ts               # Starters list, config values
│   │   └── types.ts                   # Message, ChatState, ApiResponse types
│   │
│   ├── App.tsx                        # Root component
│   ├── App.css                        # Component-specific styles (if needed)
│   ├── index.css                      # Tailwind imports + @theme + globals
│   └── main.tsx                       # React entry point
│
├── functions/
│   └── api/
│       └── chat.ts                    # Cloudflare Pages Function (the backend)
│
├── server/
│   ├── prompt.ts                      # System prompt constant
│   ├── validation.ts                  # Request validation logic
│   ├── truncation.ts                  # Conversation truncation logic
│   ├── defend-films.ts                # "Defend This Film" movie list
│   └── errors.ts                      # In-character error messages
│
├── index.html                         # Vite entry HTML
├── vite.config.ts                     # Vite + React + Tailwind config
├── wrangler.toml                      # Cloudflare Workers config
├── tsconfig.json                      # TypeScript config
├── tsconfig.node.json                 # TypeScript config for node/vite
├── package.json
├── .gitignore
├── .dev.vars                          # Local dev env vars (if needed, gitignored)
└── README.md
```

### Why This Structure

- **`functions/api/chat.ts`** — Cloudflare Pages convention. This file automatically becomes the `/api/chat` endpoint.
- **`server/`** — Shared server-side logic imported by the Pages Function. Keeps the function file thin.
- **`src/`** — Standard React SPA source. Nothing unusual.
- **No `src/pages/`** — It's a single-page app. No routing needed.
- **No `src/contexts/`** — The app is simple enough that `useState` + a custom hook is sufficient. No need for Context API or state management libraries.
- **No test directory yet** — Tests are added in Phase 5 (see implementation phases).
