# 🎬 The Cinephile — Complete Implementation Plan

> An insufferably opinionated AI film critic. $0 to operate. Zero maintenance.

---

## Plan Overview

The complete plan is split across 7 documents. Each is self-contained but they build on each other sequentially.

| Part | Document | Sections Covered |
|---|---|---|
| 1 | [Product & Architecture](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-01-product-and-architecture.md) | §1 Product Definition, §2 Recommended Architecture |
| 2 | [Technology Choices](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-02-technology-choices.md) | §3 Every technology evaluated with free-tier limits |
| 3 | [Model & System Prompt](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-03-model-and-prompt.md) | §4 Model Selection (7 models compared), §5 Complete System Prompt |
| 4 | [State, Abuse & Failures](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-04-state-abuse-failures.md) | §6 State Design, §7 Abuse Prevention, §8 Failure Handling |
| 5 | [UI/UX & Repo Structure](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-05-ui-and-repo-structure.md) | §9 UI/UX Design (all states), §10 Repository Structure |
| 6 | [Implementation Phases](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-06-implementation-phases.md) | §11 Seven Phases (each produces something runnable) |
| 7 | [Deploy, Test & Final Stack](file:///Users/osalama/.gemini/antigravity-cli/brain/e79a4885-127d-44fb-a621-c1ed98ad9e4c/plan-07-deployment-testing-stack.md) | §12 Deployment, §13 Testing, §14 What NOT to Build, §15 Final Stack |

---

## Key Decisions Summary

| Decision | Choice | Key Rationale |
|---|---|---|
| **Primary model** | Llama 4 Scout 17B (MoE) on Workers AI | MoE efficiency = more conversations/day; zero API keys |
| **Hosting** | Cloudflare Pages + Functions | Single deploy, $0, unlimited bandwidth |
| **State** | Browser localStorage only | No database, no server state, simplest possible |
| **Rate limiting** | Workers Rate Limiting binding | Native, free, no KV writes needed |
| **Streaming** | Server-Sent Events (SSE) | Simpler than WebSockets, sufficient for chat |
| **V1 fun feature** | "Defend This Film" mode | Trivial to implement, materially improves engagement |

## Rejected Alternatives

| Rejected | In favor of | Why |
|---|---|---|
| Gemini API (1,500 RPD) | Workers AI binding | API key management, data privacy concerns, EEA restrictions |
| Groq API (14,400 RPD) | Workers AI binding | External dependency, API key, separate service to manage |
| Next.js | Vite SPA | Unnecessary SSR/routing complexity for a single-page chat |
| KV-based rate limiting | Native rate limit binding | Consumes limited KV writes (1,000/day) |
| Server-side conversation storage | localStorage | No accounts = no reason for server state |
| Multiple AI providers/fallback | Single provider | V1 simplicity; fallback trivial to add later if needed |

## Estimated Timeline

| Phase | Focus | Effort |
|---|---|---|
| Phase 1 | Scaffold + Landing Page | ~2 hours |
| Phase 2 | Chat UI (Mock) | ~3 hours |
| Phase 3 | Workers AI Integration | ~4 hours |
| Phase 4 | Abuse Prevention | ~2 hours |
| Phase 5 | Defend This Film | ~2 hours |
| Phase 6 | Polish + Production Prep | ~2 hours |
| Phase 7 | Deploy | ~30 minutes |
| **Total** | | **~15 hours** |

## Total Cost

| Item | Cost |
|---|---|
| Cloudflare Pages | $0 |
| Cloudflare Workers AI | $0 (10K neurons/day) |
| Workers Rate Limiting | $0 |
| Domain (optional) | $0 (`*.pages.dev`) |
| **Total** | **$0.00/month** |

---

> Ready to proceed? The plan is structured so each phase produces something runnable. Start with Phase 1.
