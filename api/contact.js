const DEFAULT_TWENTY_API_URL = "https://api.twenty.com";
const DEFAULT_NOTIFY_TO_EMAIL = "joe@disruptionjoe.com";

function parseIncomingBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function normalizeApiUrl(value) {
  return (value || DEFAULT_TWENTY_API_URL).trim().replace(/\/rest$/, "").replace(/\/+$/, "");
}

function restUrl(apiUrl, path) {
  return `${apiUrl}/rest/${path.replace(/^\/+/, "")}`;
}

function graphqlUrl(apiUrl) {
  return `${apiUrl}/graphql`;
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

function extractId(payload, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, part) => {
      if (!acc || typeof acc !== "object") return undefined;
      return acc[part];
    }, payload);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ")
  };
}

function isDuplicatePerson(payload) {
  const messages = Array.isArray(payload?.json?.messages) ? payload.json.messages.join(" ") : "";
  return [payload?.raw || "", payload?.json?.error || "", messages].join(" ").toLowerCase().includes("duplicate");
}

async function findPersonByEmail({ apiUrl, apiKey, email }) {
  const query = `
    query FindPersonByEmail($email: String!) {
      people(first: 1, filter: { emails: { primaryEmail: { eq: $email } } }) {
        edges { node { id } }
      }
    }
  `;
  const response = await fetch(graphqlUrl(apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables: { email } })
  });
  const parsed = await parseResponse(response);
  if (!response.ok || parsed.json?.errors) return "";
  return parsed.json?.data?.people?.edges?.[0]?.node?.id || "";
}

async function createOrFindPerson({ apiUrl, apiKey, name, email }) {
  const { firstName, lastName } = splitName(name);
  const response = await fetch(restUrl(apiUrl, "people"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: { firstName, lastName },
      emails: { primaryEmail: email }
    })
  });
  const parsed = await parseResponse(response);
  if (response.ok) {
    return extractId(parsed.json, ["data.createPerson.id", "data.person.id", "data.id", "id"]);
  }
  if (isDuplicatePerson(parsed)) {
    return findPersonByEmail({ apiUrl, apiKey, email });
  }
  throw new Error(`Person create failed: ${parsed.raw || response.status}`);
}

async function attachNote({ apiUrl, apiKey, personId, payload }) {
  if (!personId) return "";

  const lines = [
    "[Contact via disruptionjoe.com]",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    payload.intent ? `Intent: ${payload.intent}` : "",
    payload.sourcePage ? `Source page: ${payload.sourcePage}` : "",
    "",
    payload.message || "(No message provided)"
  ].filter(Boolean);

  const noteResponse = await fetch(restUrl(apiUrl, "notes"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Contact via disruptionjoe.com",
      bodyV2: { markdown: lines.join("\n") }
    })
  });
  const parsedNote = await parseResponse(noteResponse);
  if (!noteResponse.ok) return "";
  const noteId = extractId(parsedNote.json, ["data.createNote.id", "data.note.id", "data.id", "id"]);
  if (!noteId) return "";

  await fetch(restUrl(apiUrl, "noteTargets"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ noteId, targetPersonId: personId })
  });

  return noteId;
}

async function sendNotification({ payload, personId }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_NOTIFY_FROM_EMAIL ||
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "";
  const to = process.env.CONTACT_NOTIFY_TO_EMAIL || process.env.NOTIFICATION_TO_EMAIL || DEFAULT_NOTIFY_TO_EMAIL;

  if (!resendApiKey || !from) {
    return { attempted: false, sent: false, reason: "not_configured" };
  }

  const text = [
    "New contact inquiry from disruptionjoe.com",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    payload.intent ? `Intent: ${payload.intent}` : "",
    payload.sourcePage ? `Source page: ${payload.sourcePage}` : "",
    personId ? `Twenty person id: ${personId}` : "",
    "",
    "Message:",
    payload.message || "(No message provided)"
  ].filter(Boolean).join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      reply_to: payload.email,
      subject: `New contact inquiry from ${payload.name}`,
      text
    })
  });
  const parsed = await parseResponse(response);
  if (!response.ok) {
    return { attempted: true, sent: false, reason: parsed.raw || String(response.status) };
  }
  return { attempted: true, sent: true };
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://disruptionjoe.com", "https://www.disruptionjoe.com"];
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = parseIncomingBody(req.body);
  const payload = {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    company: String(body.company || body.companyName || body.organization || "").trim(),
    intent: String(body.intent || "AI Activation Planning Call").trim(),
    message: String(body.message || "").trim(),
    sourcePage: String(body.sourcePage || "").trim()
  };

  if (!payload.name || !payload.email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  let personId = "";
  let noteAttached = false;
  let notification = { attempted: false, sent: false, reason: "not_attempted" };

  try {
    const apiKey = process.env.TWENTY_API_KEY || "";
    const apiUrl = normalizeApiUrl(process.env.TWENTY_API_URL);

    if (apiKey) {
      personId = await createOrFindPerson({ apiUrl, apiKey, name: payload.name, email: payload.email });
      const noteId = await attachNote({ apiUrl, apiKey, personId, payload });
      noteAttached = Boolean(noteId);
    }

    notification = await sendNotification({ payload, personId });

    if (!apiKey && !notification.sent) {
      return res.status(500).json({ error: "Server configuration error." });
    }

    return res.status(200).json({
      success: true,
      personId,
      noteAttached,
      notificationAttempted: notification.attempted,
      notificationSent: notification.sent
    });
  } catch (error) {
    console.error("Contact request failed:", error);
    return res.status(502).json({ error: "Failed to save contact. Please try again." });
  }
};
