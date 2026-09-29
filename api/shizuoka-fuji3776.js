const { get } = require("@vercel/blob");
const { setCorsHeaders } = require("../lib/cors");
const { DEFAULT_VALUE, validateValue } = require("../lib/shizuoka-fuji3776");

const BLOB_PATHNAME = "api-data/shizuoka-fuji3776.json";

function hasBlobConfiguration() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
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

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res, "GET, OPTIONS");
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

  res.setHeader("Allow", "GET, OPTIONS");
  return res.status(405).json({ error: "Method not allowed." });
};

module.exports.hasBlobConfiguration = hasBlobConfiguration;
module.exports.readValue = readValue;
