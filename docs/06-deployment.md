---
tags:
  - deployment
  - hosting
  - production
---

# Deployment Guide

NCMDS now runs on a **TypeScript + Node.js** runtime.

## Local

```bash
npm install
npm run dev
```

Default URL: `http://localhost:5000`

## Vercel (Recommended)

This repository includes a ready-to-use `vercel.json` pointing all routes to `api/index.ts` with static file passthrough for `/static/*`.

### Steps

1. Push your repository to GitHub.
2. Import it in Vercel.
3. Deploy (no extra build config required).
4. Add environment variables if using AI chat:
   - `LLM7_API_KEY`

## Runtime files

- `api/index.ts`: Serverless entrypoint for Vercel
- `src/app.ts`: Main Express app and routes
- `src/server.ts`: Local server bootstrap
- `vercel.json`: Vercel routing and function settings

## Production build

```bash
npm install
npm run build
npm start
```

## API routes

- `GET /api/search`
- `POST /api/ai-chat`
- `GET /api/ai-chat/status`
- `GET /api/ai-chat/models`
- `GET /export/config`
- `GET /export/qmd/all`

## Notes

- Keep secrets in environment variables, not in `config/config.yaml`.
- Set `PORT` in your hosting provider if required.
- Use preview deployments to validate docs before production releases.
