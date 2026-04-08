module.exports = function handler(_req, res) {
  const now = new Date();

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    ok: true,
    now: now.toISOString(),
    unixMs: now.getTime()
  });
};
