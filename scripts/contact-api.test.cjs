const assert = require("node:assert/strict");
const test = require("node:test");
const handler = require("../api/contact.js");

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; }
  };
}

test("contact endpoint delivers role and saved challenges", async () => {
  const originalFetch = global.fetch;
  const prior = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_NOTIFY_FROM_EMAIL: process.env.CONTACT_NOTIFY_FROM_EMAIL,
    CONTACT_NOTIFY_TO_EMAIL: process.env.CONTACT_NOTIFY_TO_EMAIL
  };
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_NOTIFY_FROM_EMAIL = "Website <website@example.com>";
  process.env.CONTACT_NOTIFY_TO_EMAIL = "joe@example.com";
  let providerRequest;
  global.fetch = async (url, options) => {
    providerRequest = { url, options, body: JSON.parse(options.body) };
    return { ok: true, status: 200, text: async () => JSON.stringify({ id: "delivery-test" }) };
  };

  const req = {
    method: "POST",
    headers: { origin: "https://disruptionjoe.com" },
    body: {
      name: "Homepage QA",
      email: "qa@example.com",
      company: "Example",
      role: "Project sponsor",
      intent: "Saved homepage challenges",
      challenges: "Projects keep stalling.\nEverything is a priority.",
      message: "Testing the inquiry handoff.",
      source: "site-contact",
      sourcePage: "/"
    }
  };
  const res = responseRecorder();

  try {
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(providerRequest.url, "https://api.resend.com/emails");
    assert.match(providerRequest.body.text, /Role: Project sponsor/);
    assert.match(providerRequest.body.text, /Projects keep stalling/);
    assert.match(providerRequest.body.html, /Everything is a priority/);
    assert.equal(providerRequest.body.reply_to, "qa@example.com");
  } finally {
    global.fetch = originalFetch;
    Object.entries(prior).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
});

test("contact endpoint still permits inquiry without saved challenges", async () => {
  const prior = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_NOTIFY_FROM_EMAIL: process.env.CONTACT_NOTIFY_FROM_EMAIL,
    CONTACT_SENDER_EMAIL: process.env.CONTACT_SENDER_EMAIL,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    CONTACT_NOTIFY_TO_EMAIL: process.env.CONTACT_NOTIFY_TO_EMAIL,
    NOTIFICATION_TO_EMAIL: process.env.NOTIFICATION_TO_EMAIL
  };
  Object.keys(prior).forEach((key) => { delete process.env[key]; });
  const req = { method: "POST", headers: {}, body: { name: "Direct visitor", email: "visitor@example.com" } };
  const res = responseRecorder();
  const originalError = console.error;
  console.error = () => {};
  try {
    await handler(req, res);
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.code, "CONTACT_NOT_CONFIGURED");
  } finally {
    console.error = originalError;
    Object.entries(prior).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
});
