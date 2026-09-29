const { setCorsHeaders } = require("../lib/cors");
const { DEFAULT_VALUE } = require("../lib/shizuoka-fuji3776");

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res, "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(DEFAULT_VALUE);
  }

  res.setHeader("Allow", "GET, OPTIONS");
  return res.status(405).json({ error: "Method not allowed." });
};
