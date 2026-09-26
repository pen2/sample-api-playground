# sample-api-playground

Vercel で動く JSON API サンプルです。

## Endpoint

- `GET /api/now`
- `GET /api/shizuoka-fuji3776`
- `POST /api/shizuoka-fuji3776`（編集トークンが必要）
- `/tool/shizuoka-fuji3776/`（値の編集ページ）
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

更新値を永続化するには、VercelのStorage画面でPrivate Blob storeを作成してこのプロジェクトへ接続します。次に、VercelのEnvironment Variablesへ十分に長いランダム値を次の名前で追加します。

```text
SHIZUOKA_FUJI3776_EDIT_TOKEN
```

環境変数を追加した後は再デプロイが必要です。編集ページでは、この環境変数と同じ値をEdit token欄へ入力します。

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
