const ALLOWED_HOSTS = new Set([
  "goodshare.jp",
  "preview.studio.site",
  "studioiframesandbox.com"
]);

const ALLOWED_HOST_SUFFIXES = [
  ".preview.studio.site",
  ".studioiframesandbox.com"
];

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
      ALLOWED_HOSTS.has(url.hostname) ||
      ALLOWED_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))
    );
  } catch {
    return false;
  }
}

function setCorsHeaders(req, res, methods = "GET, OPTIONS") {
  const origin = req.headers?.origin;

  res.setHeader("Vary", "Origin");
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", methods);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
}

module.exports = { isAllowedOrigin, setCorsHeaders };
