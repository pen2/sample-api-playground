const assert = require("node:assert/strict");
const handler = require("../api/now");

function invoke({ method = "GET", origin } = {}) {
  let statusCode = null;
  const headers = {};
  let jsonBody = null;
  let ended = false;

  const res = {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      jsonBody = body;
      return this;
    },
    end() {
      ended = true;
      return this;
    }
  };

  handler({ method, headers: origin ? { origin } : {} }, res);
  return { statusCode, headers, jsonBody, ended };
}

const response = invoke({ origin: "https://example.preview.studio.site" });

assert.equal(response.statusCode, 200);
assert.equal(response.headers["Content-Type"], "application/json; charset=utf-8");
assert.equal(
  response.headers["Access-Control-Allow-Origin"],
  "https://example.preview.studio.site"
);
assert.equal(response.jsonBody.ok, true);
assert.equal(Number.isNaN(Date.parse(response.jsonBody.now)), false);
assert.equal(typeof response.jsonBody.unixMs, "number");

const productionResponse = invoke({ origin: "https://goodshare.jp" });
assert.equal(
  productionResponse.headers["Access-Control-Allow-Origin"],
  "https://goodshare.jp"
);

const studioSandboxResponse = invoke({
  origin: "https://65qmp3w0ov.studioiframesandbox.com"
});
assert.equal(
  studioSandboxResponse.headers["Access-Control-Allow-Origin"],
  "https://65qmp3w0ov.studioiframesandbox.com"
);

const rejectedResponse = invoke({ origin: "https://evil-preview.studio.site.example.com" });
assert.equal(rejectedResponse.headers["Access-Control-Allow-Origin"], undefined);

const rejectedSandboxResponse = invoke({
  origin: "https://studioiframesandbox.com.example.com"
});
assert.equal(
  rejectedSandboxResponse.headers["Access-Control-Allow-Origin"],
  undefined
);

const preflightResponse = invoke({
  method: "OPTIONS",
  origin: "https://project.preview.studio.site"
});
assert.equal(preflightResponse.statusCode, 204);
assert.equal(preflightResponse.ended, true);
assert.equal(
  preflightResponse.headers["Access-Control-Allow-Origin"],
  "https://project.preview.studio.site"
);

console.log("test passed");
console.log(JSON.stringify(response.jsonBody, null, 2));
