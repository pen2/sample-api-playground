const handler = require("../api/now");

let statusCode = null;
const headers = {};
let jsonBody = null;

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
  }
};

handler({}, res);

if (statusCode !== 200) {
  throw new Error(`Expected status 200, received ${statusCode}`);
}

if (headers["Content-Type"] !== "application/json; charset=utf-8") {
  throw new Error("Unexpected content type");
}

if (!jsonBody || jsonBody.ok !== true) {
  throw new Error("Response body is missing ok=true");
}

if (typeof jsonBody.now !== "string" || Number.isNaN(Date.parse(jsonBody.now))) {
  throw new Error("Response body now is not a valid ISO timestamp");
}

if (typeof jsonBody.unixMs !== "number") {
  throw new Error("Response body unixMs is not a number");
}

console.log("test passed");
console.log(JSON.stringify(jsonBody, null, 2));
