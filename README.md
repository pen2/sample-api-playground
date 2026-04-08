# vercel-time-api-playground

Vercel で動く最小の JSON API サンプルです。

## Endpoint

- `GET /api/now`
- `/` にアクセスすると `/api/now` にリダイレクトします

## Response

```json
{
  "ok": true,
  "now": "2026-04-08T12:34:56.789Z",
  "unixMs": 1775651696789
}
```

## Local check

```bash
npm test
```

## Deploy to Vercel

1. GitHub に push
2. Vercel でこの repository を Import
3. そのまま Deploy
