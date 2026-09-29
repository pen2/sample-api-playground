# sample-api-playground

Vercel で動く JSON API サンプルです。

## Endpoint

- `GET /api/now`
- `GET /api/shizuoka-fuji3776`
- `/` にアクセスすると `/api/now` にリダイレクトします

ブラウザからのアクセスは、次の Origin に対して CORS を許可しています。

- `https://goodshare.jp`
- `https://preview.studio.site`
- `https://*.preview.studio.site`
- `https://studioiframesandbox.com`
- `https://*.studioiframesandbox.com`

## Shizuoka Fuji 3776

初期値は次のとおりです。

```json
{
  "campaignId": "ea8edf81-2d6c-4eaf-9b71-ac6af2edc48c",
  "totalLikes": 0,
  "totalPosts": 0
}
```

値はPrivate Vercel Blobから読み取ります。編集ツールとPOST更新処理は停止済みです。

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
