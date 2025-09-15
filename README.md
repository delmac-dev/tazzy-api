# Tazzy API

API server for the Tazzy mobile app — simplifies class schedules through AI extraction and smart task syncing.

## Overview
- Built with TypeScript + Express
- AI via Google's Gemini (using `@ai-sdk/google` + `ai`)
- Deployable on Vercel

## Quick Start
```bash
npm install
npm run dev
```

Create a `.env` file (local development):
```
PORT=3000
AI_MODEL=gemini-2.5-flash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

## Endpoints
- `GET /api/health` — Service health and uptime
- `GET /api/ai` — Sample AI text generation
- `GET /api/tool` — Tools route check

## Scripts
- `npm run dev` — Start dev server (tsx watch)
- `npm run build` — TypeScript build
- `npm start` — Start production (runs `dist/app.js`)

## Deployment
- Vercel friendly project structure. Ensure `GOOGLE_GENERATIVE_AI_API_KEY` (and optional `AI_MODEL`) are set in project settings.