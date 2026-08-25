# The Cinephile

A single-page web app where users can debate cinema with an insufferably opinionated, highly knowledgeable AI film critic.

## Features

- **Instant Chat**: No signup, no configuration. Start chatting instantly.
- **Defend This Film**: A special game mode where you are challenged to defend a critically-panned movie while The Cinephile tears it apart.
- **Cinematic UI**: A dark, aesthetic UI that puts focus on the conversation.
- **Streaming Responses**: Real-time token streaming from Cloudflare's edge.
- **Rate-Limited & Secure**: Serverless Edge Function implementation limits abuse while avoiding the need for backend infrastructure.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend / Edge**: Cloudflare Pages + Pages Functions
- **AI Model**: `@cf/meta/llama-4-scout-17b-16e-instruct` via Cloudflare Workers AI

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run frontend (mocked responses)**:
   ```bash
   npm run dev
   ```

3. **Run with Edge Functions (real AI responses)**:
   ```bash
   npm run build
   npx wrangler pages dev dist
   ```

## Deployment

Deploying to Cloudflare Pages:

1. Push to GitHub and connect Cloudflare Pages to the repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy!

No environment variables or API keys required, as it uses Cloudflare's native Workers AI binding.
