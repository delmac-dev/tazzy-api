# Tazzy API — AI Agent Guide

Purpose: Give AI coding agents the minimum context to be productive in this codebase.

## Architecture & Shape
- Runtime: TypeScript + Express 5, single entry `app.ts` exporting the Express app.
- Routers: Each file in `routes/` exports an Express `Router` mounted in `app.ts` under an `/api/*` base.
- Middleware: Global CORS, JSON/body parsing, centralized error handler (`middlewares/error-handler.ts`).
- Tools: `tools/` holds AI tool definitions using `ai` + `zod` (see `tools/invalid-request.ts`). Not yet wired into routes.

## Dev Workflow
- Install and run dev server:
  - `npm install`
  - `npm run dev` (uses `tsx watch app.ts`)
- Build: `npm run build` (tsc). Vercel also runs this via `vercel-build`.
- Env file for local dev: `.env` with `PORT`, `AI_MODEL`, `GOOGLE_GENERATIVE_AI_API_KEY`.

## Routing Conventions
- Do not hardcode the `/api` prefix in routers; define paths relative to the router root and mount in `app.ts`:
  - `app.use("/api/ai", aiRoute);`
  - `app.use("/api/tool", toolRoute);`
  - `app.use("/api/health", healthRoute);`
- 404 fallback: mounted last with `app.use('/{*splat}', forbiddenRoute);` — avoid adding competing catch-alls.
- Example router shape (POST with validation):
  ```ts
  import { Router } from "express"; import z from "zod";
  const router = Router();
  const Body = z.object({ title: z.string().min(1) });
  router.post("/items", (req, res, next) => {
    const parsed = Body.safeParse(req.body); if (!parsed.success) return res.status(400).json(parsed.error);
    // ...do work
    res.json({ ok: true });
  });
  export default router;
  ```

## AI Integration
- Uses `@ai-sdk/google` + `ai` to generate text. See `routes/ai.ts`:
  ```ts
  const { text } = await generateText({
    model: google(process.env.AI_MODEL || 'gemini-2.5-flash'),
    prompt: "what is the full name of AI?",
  });
  ```
- Define reusable tools with `tool({...})` and `zod` in `tools/`. Integrate by importing into a router and invoking as needed.

## Middleware & Errors
- Prefer `next(err)` over sending ad-hoc error JSON. `error-handler.ts` responds with `{ error, message }` and 500.
- `auth-handler.ts` exists as a placeholder; apply route-level (`router.use(authHandler)`) where needed rather than globally by default.

## Environment
- Required for AI: `GOOGLE_GENERATIVE_AI_API_KEY`. Optional: `AI_MODEL` (defaults to `gemini-2.5-flash`).
- `PORT` used only for local dev; Vercel supplies its own port.

## Deployment Notes
- Vercel: `vercel.json` routes all traffic to `app.js` and runs `npm run build`.
- Local prod `npm start` expects `dist/app.js`, but `tsconfig.json` currently outputs to `.vercel/output`. Prefer `npm run dev` locally unless aligning output paths.

## When Adding Code
- Keep routers small and composable; export a `Router` from one file and mount in `app.ts`.
- Validate request bodies with `zod` and return `res.json(...)` objects.
- Do not change build or Vercel config without verifying implications across `tsconfig.json`, `package.json`, and `vercel.json`.
