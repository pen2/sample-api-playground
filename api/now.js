function isAllowedOrigin(origin) {
  if (!origin) {
    return false;
  }

  try {
    const url = new URL(origin);

    if (url.protocol !== "https:") {
      return false;
    }

    return (
      url.hostname === "goodshare.jp" ||
      url.hostname === "preview.studio.site" ||
      url.hostname.endsWith(".preview.studio.site") ||
      url.hostname === "studioiframesandbox.com" ||
      url.hostname.endsWith(".studioiframesandbox.com")
    );
  } catch {
    return false;
  }
}

module.exports = function handler(req, res) {
  const origin = req.headers?.origin;

  res.setHeader("Vary", "Origin");
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const now = new Date();

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    ok: true,
    now: now.toISOString(),
    unixMs: now.getTime()
  });
};

module.exports.isAllowedOrigin = isAllowedOrigin;
