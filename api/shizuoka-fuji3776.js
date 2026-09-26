const crypto = require("node:crypto");
const { get, put } = require("@vercel/blob");
const { setCorsHeaders } = require("../lib/cors");
const { DEFAULT_VALUE, validateValue } = require("../lib/shizuoka-fuji3776");

const BLOB_PATHNAME = "api-data/shizuoka-fuji3776.json";

function hasBlobConfiguration() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function isAuthorized(req) {
  const expectedToken = process.env.SHIZUOKA_FUJI3776_EDIT_TOKEN;
  const authorization = req.headers?.authorization || "";
  const suppliedToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!expectedToken || !suppliedToken) {
    return false;
  }

  const expected = Buffer.from(expectedToken);
  const supplied = Buffer.from(suppliedToken);

  return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied);
}

async function readValue() {
  if (!hasBlobConfiguration()) {
    return DEFAULT_VALUE;
  }

  const result = await get(BLOB_PATHNAME, {
    access: "private",
    useCache: false
  });

  if (!result) {
    return DEFAULT_VALUE;
  }

  const storedValue = JSON.parse(await new Response(result.stream).text());
  const validated = validateValue(storedValue);

  if (validated.error) {
    throw new Error("Stored value is invalid.");
  }

  return validated.value;
}

async function writeValue(value) {
  await put(BLOB_PATHNAME, JSON.stringify(value), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res, "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      return res.status(200).json(await readValue());
    } catch (error) {
      console.error("Failed to read shizuoka-fuji3776 value", error);
      return res.status(500).json({ error: "Failed to read the current value." });
    }
  }

  if (req.method === "POST") {
    if (!process.env.SHIZUOKA_FUJI3776_EDIT_TOKEN) {
      return res.status(503).json({ error: "The edit token is not configured." });
    }

    if (!hasBlobConfiguration()) {
      return res.status(503).json({ error: "Vercel Blob is not configured." });
    }

    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Invalid edit token." });
    }

    const validated = validateValue(req.body);
    if (validated.error) {
      return res.status(400).json({ error: validated.error });
    }

    try {
      await writeValue(validated.value);
      return res.status(200).json(validated.value);
    } catch (error) {
      console.error("Failed to update shizuoka-fuji3776 value", error);
      return res.status(500).json({ error: "Failed to save the new value." });
    }
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ error: "Method not allowed." });
};

module.exports.hasBlobConfiguration = hasBlobConfiguration;
module.exports.isAuthorized = isAuthorized;
module.exports.readValue = readValue;
