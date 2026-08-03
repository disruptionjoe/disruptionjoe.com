const crypto = require("crypto");

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_NOTIFY_TO_EMAIL = "joe@disruptionjoe.com";
const FIELD_LIMITS = {
  name: 120,
  email: 254,
  company: 180,
  intent: 180,
  message: 5000,
  source: 80,
  sourcePage: 500,
  serviceFocus: 180,
  website: 300
};

function parseIncomingBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return typeof body === "object" ? body : {};
}

async function parseResponse(response) {
  const raw = await response.text();
  if (!raw) return { raw: "", json: null };
  try {
    return { raw, json: JSON.parse(raw) };
  } catch {
    return { raw, json: null };
  }
}

function normalizeField(value) {
  return String(value || "").replace(/\0/g, "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlLines(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makeSubmissionId(now) {
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `DJC-WEB-${date}-${suffix}`;
}

function parseRecipients(value) {
  return String(value || DEFAULT_NOTIFY_TO_EMAIL)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function buildPayload(body) {
  return {
    name: normalizeField(body.name),
    email: normalizeField(body.email).toLowerCase(),
    company: normalizeField(body.company || body.companyName || body.organization),
    intent: normalizeField(body.intent || "Not sure yet"),
    message: normalizeField(body.message),
    source: normalizeField(body.source || "site-contact"),
    sourcePage: normalizeField(body.sourcePage),
    serviceFocus: normalizeField(body.serviceFocus),
    website: normalizeField(body.website)
  };
}

function validatePayload(payload) {
  if (!payload.name || !payload.email) return "Name and email are required.";
  if (!isValidEmail(payload.email)) return "Enter a valid email address.";

  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (payload[field].length > limit) {
      return `${field === "sourcePage" ? "Source page" : field.charAt(0).toUpperCase() + field.slice(1)} is too long.`;
    }
  }

  return "";
}

function buildEmail({ payload, submissionId, receivedAt }) {
  const company = payload.company || "Not provided";
  const message = payload.message || "No message provided.";
  const sourcePage = payload.sourcePage || "Not provided";
  const serviceFocus = payload.serviceFocus || "Not provided";
  const subject = `Website inquiry · ${payload.intent} · ${payload.name}`;

  const text = [
    "NEW DISRUPTION JOE WEBSITE INQUIRY",
    "",
    `Submission ID: ${submissionId}`,
    `Received: ${receivedAt}`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company or organization: ${company}`,
    `Starting point: ${payload.intent}`,
    "",
    "What Joe should understand:",
    message,
    "",
    "ORIGIN",
    `Source: ${payload.source}`,
    `Source page: ${sourcePage}`,
    `Service focus: ${serviceFocus}`
  ].join("\n");

  const html = `
    <div style="margin:0;padding:32px;background:#030302;color:#fff8e8;font-family:Arial,sans-serif;line-height:1.55">
      <div style="max-width:680px;margin:0 auto;border:1px solid #6f6146;background:#090704">
        <div style="padding:18px 24px;border-bottom:1px solid #413823;color:#d8bd8a;font-family:monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase">
          Disruption Joe / Website inquiry
        </div>
        <div style="padding:28px 24px">
          <h1 style="margin:0 0 8px;color:#fff8e8;font-size:28px;line-height:1.15">${escapeHtml(payload.intent)}</h1>
          <p style="margin:0 0 28px;color:#b9ad9b;font-family:monospace;font-size:12px">${escapeHtml(submissionId)} · ${escapeHtml(receivedAt)}</p>
          <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 28px">
            <tr><td style="padding:8px 12px 8px 0;color:#d8bd8a;font-size:12px;text-transform:uppercase;vertical-align:top">Name</td><td style="padding:8px 0;color:#fff8e8">${escapeHtml(payload.name)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;color:#d8bd8a;font-size:12px;text-transform:uppercase;vertical-align:top">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(payload.email)}" style="color:#ffe3a6">${escapeHtml(payload.email)}</a></td></tr>
            <tr><td style="padding:8px 12px 8px 0;color:#d8bd8a;font-size:12px;text-transform:uppercase;vertical-align:top">Organization</td><td style="padding:8px 0;color:#fff8e8">${escapeHtml(company)}</td></tr>
          </table>
          <div style="padding:20px;border-left:3px solid #d8bd8a;background:#110e09">
            <p style="margin:0 0 8px;color:#d8bd8a;font-family:monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase">What Joe should understand</p>
            <p style="margin:0;color:#fff8e8">${htmlLines(message)}</p>
          </div>
          <div style="margin-top:26px;padding-top:18px;border-top:1px solid #413823;color:#8f836f;font-family:monospace;font-size:11px">
            Source: ${escapeHtml(payload.source)}<br>
            Source page: ${escapeHtml(sourcePage)}<br>
            Service focus: ${escapeHtml(serviceFocus)}
          </div>
        </div>
      </div>
    </div>`;

  return { subject, text, html };
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://disruptionjoe.com", "https://www.disruptionjoe.com"];
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });

  const payload = buildPayload(parseIncomingBody(req.body));
  const validationError = validatePayload(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError, code: "INVALID_CONTACT_REQUEST" });
  }

  const receivedAt = new Date();
  const submissionId = makeSubmissionId(receivedAt);

  // Quietly accept likely bot submissions without spending a Resend request.
  if (payload.website) {
    return res.status(200).json({ success: true, submissionId });
  }

  const resendApiKey = process.env.RESEND_API_KEY || "";
  const from =
    process.env.CONTACT_NOTIFY_FROM_EMAIL ||
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "";
  const to = parseRecipients(process.env.CONTACT_NOTIFY_TO_EMAIL || process.env.NOTIFICATION_TO_EMAIL);

  if (!resendApiKey || !from || !to.length) {
    console.error("Contact delivery is not configured", { submissionId });
    return res.status(500).json({
      error: "The contact service is not configured.",
      code: "CONTACT_NOT_CONFIGURED",
      submissionId
    });
  }

  const email = buildEmail({ payload, submissionId, receivedAt: receivedAt.toISOString() });

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": submissionId
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: payload.email,
        subject: email.subject,
        text: email.text,
        html: email.html
      })
    });
    const parsed = await parseResponse(response);

    if (!response.ok) {
      console.error("Resend contact delivery failed", {
        submissionId,
        status: response.status,
        providerError: parsed.json?.message || parsed.json?.name || parsed.raw.slice(0, 300)
      });
      return res.status(502).json({
        error: "The contact service could not deliver your note.",
        code: "CONTACT_DELIVERY_FAILED",
        submissionId
      });
    }

    const deliveryId = parsed.json?.id || "";
    return res.status(200).json({ success: true, submissionId, deliveryId });
  } catch (error) {
    console.error("Resend contact delivery failed", {
      submissionId,
      error: error instanceof Error ? error.message : String(error)
    });
    return res.status(502).json({
      error: "The contact service could not deliver your note.",
      code: "CONTACT_DELIVERY_FAILED",
      submissionId
    });
  }
};
