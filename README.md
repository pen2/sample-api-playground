# sample-api-playground

Vercel で動く最小の JSON API サンプルです。

## Endpoint

- `GET /api/now`
- `/` にアクセスすると `/api/now` にリダイレクトします

ブラウザからのアクセスは、次の Origin に対して CORS を許可しています。

- `https://goodshare.jp`
- `https://preview.studio.site`
- `https://*.preview.studio.site`

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
