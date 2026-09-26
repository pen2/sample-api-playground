const { isAllowedOrigin, setCorsHeaders } = require("../lib/cors");

module.exports = function handler(req, res) {
  setCorsHeaders(req, res);

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
