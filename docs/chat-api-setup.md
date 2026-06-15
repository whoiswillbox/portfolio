# Chat API Setup

The chat panel works in two modes:

- **Local (default, free):** if no `ANTHROPIC_API_KEY` is set, the bot answers by
  keyword-matching the curated repository in `src/lib/chat/`. Zero cost, no setup.
- **AI (grounded LLM):** if `ANTHROPIC_API_KEY` is set, the `/api/chat` route asks
  Claude Haiku 4.5 to answer **as Will**, using the repository as its knowledge
  base. Handles any phrasing, real conversation memory.

The client always tries the API first and **falls back to local** if the API is
unconfigured, rate-limited, or errors — so the chat never breaks.

## Architecture

```
chat-panel.tsx  ──fetch──▶  /api/chat (src/app/api/chat/route.ts)
   │  (on any failure)            │
   └──▶ local respondTo()         ├─ per-IP rate limit (Upstash, optional)
                                  ├─ knowledge base built from qaEntries
                                  └─ Claude Haiku 4.5 (claude-haiku-4-5)
```

The knowledge base is generated from `qaEntries` in `repository.ts`, so editing
the curated answers keeps both modes in sync.

## Setup (to enable AI mode)

### 1. Anthropic API key + spend cap (required)

1. Create a key at https://console.anthropic.com/ → **API Keys**.
2. **Set a monthly spend cap** (Console → **Limits/Billing**). This is the hard
   ceiling — you cannot be charged more than this no matter what. Recommended: **$5**.
3. Local dev: `cp .env.example .env.local` and paste the key into `ANTHROPIC_API_KEY`.
4. Production: add `ANTHROPIC_API_KEY` in the Vercel project's
   **Settings → Environment Variables**, then redeploy.

### 2. Per-IP rate limiting (recommended)

1. Create a free Redis database at https://upstash.com/.
2. Copy the **REST URL** and **REST token** into `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` (locally in `.env.local`, in production in Vercel).
3. With both set, each IP is limited to **20 messages/day** (tune in `route.ts`).
   If unset, the API runs without rate limiting (fine for local dev).

## Cost

Claude Haiku 4.5 is ~$0.0025 per message (~$2.50 per 1,000). The Anthropic spend
cap bounds the worst case; the per-IP limit stops a single visitor from burning it.

## Guardrails summary

| Layer | Where | Protects against |
|---|---|---|
| Spend cap ($5/mo) | Anthropic console | Any runaway cost — hard ceiling |
| Per-IP limit (20/day) | `route.ts` + Upstash | One visitor spamming |
| Input/history caps | `route.ts` | Oversized prompts |
