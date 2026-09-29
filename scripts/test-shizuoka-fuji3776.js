const assert = require("node:assert/strict");
const { isAllowedOrigin } = require("../lib/cors");
const { DEFAULT_VALUE, validateValue } = require("../lib/shizuoka-fuji3776");
const handler = require("../api/shizuoka-fuji3776");

function invoke({ method = "GET", headers = {}, body } = {}) {
  let statusCode = null;
  const responseHeaders = {};
  let jsonBody = null;
  let ended = false;

  const res = {
    setHeader(name, value) {
      responseHeaders[name] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      jsonBody = value;
      return this;
    },
    end() {
      ended = true;
      return this;
    }
  };

  return handler({ method, headers, body }, res).then(() => ({
    statusCode,
    headers: responseHeaders,
    jsonBody,
    ended
  }));
}

assert.equal(isAllowedOrigin("https://goodshare.jp"), true);
assert.equal(isAllowedOrigin("https://example.preview.studio.site"), true);
assert.equal(isAllowedOrigin("https://abc.studioiframesandbox.com"), true);
assert.equal(isAllowedOrigin("https://studioiframesandbox.com.example.com"), false);
assert.equal(isAllowedOrigin("http://goodshare.jp"), false);

assert.deepEqual(validateValue(DEFAULT_VALUE), { value: DEFAULT_VALUE });
assert.deepEqual(
  validateValue({ campaignId: " campaign ", totalLikes: 12, totalPosts: 3 }),
  {
    value: { campaignId: "campaign", totalLikes: 12, totalPosts: 3 }
  }
);
assert.equal(
  validateValue({ campaignId: "campaign", totalLikes: -1, totalPosts: 0 }).error,
  "totalLikes must be a non-negative integer."
);
assert.equal(
  validateValue({ campaignId: "campaign", totalLikes: 0, totalPosts: 1.5 }).error,
  "totalPosts must be a non-negative integer."
);

(async () => {
  const environmentKeys = [
    "BLOB_READ_WRITE_TOKEN",
    "BLOB_STORE_ID",
    "VERCEL_OIDC_TOKEN"
  ];
  const originalEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]])
  );

  for (const key of environmentKeys) {
    delete process.env[key];
  }

  try {
    const getResponse = await invoke({
      headers: { origin: "https://goodshare.jp" }
    });
    assert.equal(getResponse.statusCode, 200);
    assert.deepEqual(getResponse.jsonBody, DEFAULT_VALUE);
    assert.equal(
      getResponse.headers["Access-Control-Allow-Origin"],
      "https://goodshare.jp"
    );

    const postResponse = await invoke({ method: "POST", body: DEFAULT_VALUE });
    assert.equal(postResponse.statusCode, 405);
    assert.equal(postResponse.headers.Allow, "GET, OPTIONS");
    assert.equal(postResponse.jsonBody.error, "Method not allowed.");
  } finally {
    for (const key of environmentKeys) {
      if (originalEnvironment[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnvironment[key];
      }
    }
  }

  console.log("shizuoka-fuji3776 tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
