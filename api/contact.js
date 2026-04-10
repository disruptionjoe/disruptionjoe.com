/**
 * Vercel Serverless Function: /api/contact
 *
 * Receives AI Session form submissions, creates a Person in Twenty CRM,
 * attaches the intake note when provided, and sends an email notification
 * when Resend is configured.
 *
 * Environment variables:
 *   TWENTY_API_KEY                - Required
 *   TWENTY_API_URL                - Optional, defaults to https://api.twenty.com
 *   RESEND_API_KEY                - Optional, enables email notifications
 *   CONTACT_NOTIFY_FROM_EMAIL     - Optional, required with RESEND_API_KEY
 *   CONTACT_NOTIFY_TO_EMAIL       - Optional, defaults to joe@disruptionjoe.com
 */

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
  const apiUrl = (value || DEFAULT_TWENTY_API_URL).trim();
  return apiUrl.replace(/\/rest$/, "").replace(/\/+$/, "");
}

function buildRestUrl(apiUrl, path) {
  return `${apiUrl}/rest/${path.replace(/^\/+/, "")}`;
}

function buildGraphqlUrl(apiUrl) {
  return `${apiUrl}/graphql`;
}

function extractId(payload, keys) {
  if (!payload || typeof payload !== "object") return "";

  for (const key of keys) {
    const value = key.split(".").reduce((acc, part) => {
      if (acc && typeof acc === "object") {
        return acc[part];
      }
      return undefined;
    }, payload);

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

async function parseApiResponse(response) {
  const text = await response.text();

  if (!text) {
    return { raw: "", json: null };
  }

  try {
    return {
      raw: text,
      json: JSON.parse(text),
    };
  } catch {
    return {
      raw: text,
      json: null,
    };
  }
}

function isDuplicateEntryError(responsePayload) {
  const jsonMessages = Array.isArray(responsePayload?.json?.messages)
    ? responsePayload.json.messages.join(" ")
    : "";
  const combined = [
    responsePayload?.raw || "",
    responsePayload?.json?.error || "",
    jsonMessages,
  ]
    .join(" ")
    .toLowerCase();

  return combined.includes("duplicate entry");
}

async function findExistingPersonIdByEmail({ apiUrl, apiKey, email }) {
  const query = `
    query FindPersonByEmail($email: String!) {
      people(first: 1, filter: { emails: { primaryEmail: { eq: $email } } }) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { email },
    }),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    console.error("Twenty GraphQL lookup error:", response.status, parsed.raw);
    return "";
  }

  return (
    parsed.json?.data?.people?.edges?.[0]?.node?.id ||
    ""
  );
}

function buildNotificationText({ name, email, message, personId }) {
  const lines = [
    "New AI Session inquiry from disruptionjoe.com",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Twenty Person ID: ${personId || "Unavailable"}`,
    "",
    "Message:",
    message || "(No message provided)",
  ];

  return lines.join("\n");
}

async function sendNotificationEmail({ name, email, message, personId }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.CONTACT_NOTIFY_FROM_EMAIL ||
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "";
  const toEmail = process.env.CONTACT_NOTIFY_TO_EMAIL || process.env.NOTIFICATION_TO_EMAIL || DEFAULT_NOTIFY_TO_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return {
      attempted: false,
      sent: false,
      reason: "notification_not_configured",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `New AI Session inquiry from ${name}`,
      text: buildNotificationText({ name, email, message, personId }),
    }),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(
      `Resend notification failed (${response.status}): ${parsed.raw || "No response body"}`
    );
  }

  return {
    attempted: true,
    sent: true,
    id: parsed.json?.id || "",
  };
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://disruptionjoe.com", "https://www.disruptionjoe.com"];

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseIncomingBody(req.body);
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const apiKey = process.env.TWENTY_API_KEY;
  const apiUrl = normalizeApiUrl(process.env.TWENTY_API_URL);

  if (!apiKey) {
    console.error("Missing TWENTY_API_KEY environment variable.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  const nameParts = name.split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  let personId = "";
  let noteId = "";
  let notificationStatus = {
    attempted: false,
    sent: false,
    reason: "not_attempted",
  };

  try {
    const twentyRes = await fetch(buildRestUrl(apiUrl, "people"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: { firstName, lastName },
        emails: { primaryEmail: email },
      }),
    });

    const personResponse = await parseApiResponse(twentyRes);

    if (!twentyRes.ok) {
      if (isDuplicateEntryError(personResponse)) {
        personId = await findExistingPersonIdByEmail({ apiUrl, apiKey, email });
        if (personId) {
          console.warn("Twenty duplicate person detected; reusing existing record for email:", email);
        }
      }

      if (!personId) {
        console.error("Twenty API error (person):", twentyRes.status, personResponse.raw);
        return res.status(502).json({ error: "Failed to save contact. Please try again." });
      }
    } else {
      personId = extractId(personResponse.json, [
        "data.createPerson.id",
        "data.person.id",
        "data.id",
        "id",
      ]);
    }

    if (message && personId) {
      const noteText = `[AI Session inquiry via disruptionjoe.com]\n\n${message}`;

      const noteRes = await fetch(buildRestUrl(apiUrl, "notes"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "AI Session inquiry via disruptionjoe.com",
          bodyV2: { markdown: noteText },
        }),
      });

      const noteResponse = await parseApiResponse(noteRes);

      if (!noteRes.ok) {
        console.error("Twenty API error (note):", noteRes.status, noteResponse.raw);
      } else {
        noteId = extractId(noteResponse.json, [
          "data.createNote.id",
          "data.note.id",
          "data.id",
          "id",
        ]);
      }

      if (noteId) {
        const noteTargetRes = await fetch(buildRestUrl(apiUrl, "noteTargets"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            noteId,
            targetPersonId: personId,
          }),
        });

        const noteTargetResponse = await parseApiResponse(noteTargetRes);

        if (!noteTargetRes.ok) {
          console.error("Twenty API error (note target):", noteTargetRes.status, noteTargetResponse.raw);
        }
      }
    }

    try {
      notificationStatus = await sendNotificationEmail({ name, email, message, personId });
    } catch (notificationError) {
      notificationStatus = {
        attempted: true,
        sent: false,
        reason: notificationError.message,
      };
      console.error("Notification email failed:", notificationError);
    }

    return res.status(200).json({
      success: true,
      personId,
      noteAttached: Boolean(noteId),
      notificationAttempted: Boolean(notificationStatus.attempted),
      notificationSent: Boolean(notificationStatus.sent),
    });
  } catch (err) {
    console.error("Twenty API request failed:", err);
    return res.status(502).json({ error: "Failed to save contact. Please try again." });
  }
};
