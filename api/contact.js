/**
 * Vercel Serverless Function: /api/contact
 *
 * Receives AI Session and webinar form submissions, creates or updates a
 * Person in Twenty CRM, optionally creates a webinarParticipation record,
 * attaches the intake note when provided, and sends an email notification
 * when Resend is configured.
 *
 * Environment variables:
 *   TWENTY_API_KEY                - Required
 *   TWENTY_API_URL                - Optional, defaults to https://api.twenty.com
 *   TWENTY_DEFAULT_WEBINAR_ID     - Optional, used for webinar registrations
 *   RESEND_API_KEY                - Optional, enables email notifications
 *   CONTACT_NOTIFY_FROM_EMAIL     - Optional, required with RESEND_API_KEY
 *   CONTACT_NOTIFY_TO_EMAIL       - Optional, defaults to joe@disruptionjoe.com
 *   CONTACT_CONFIRMATION_EMAILS_ENABLED - Optional, defaults to false
 *   CONTACT_CONFIRMATION_PREVIEW_ONLY   - Optional, defaults to true
 *   CONTACT_CONFIRMATION_FROM_EMAIL     - Optional, required when confirmation emails are enabled
 */

const DEFAULT_TWENTY_API_URL = "https://api.twenty.com";
const DEFAULT_NOTIFY_TO_EMAIL = "joe@disruptionjoe.com";
const DEFAULT_WEBINAR_REGISTRATION_SOURCE = "SITE_FORM";

function envFlag(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw == null || raw === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(raw).trim().toLowerCase());
}

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

function normalizeSource(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function buildSourceContext({ source, submittedAt }) {
  switch (normalizeSource(source)) {
    case "webinar":
      return {
        source: "webinar",
        noteTitle: "Webinar registration via disruptionjoe.com/webinar",
        notePrefix: "[Webinar registration via disruptionjoe.com/webinar]",
        notificationLabel: "Webinar registration",
        personUpdatesForNewRecord: {
          sourcePrimary: "WEBINAR",
          sourceDetail: "WEBINAR_SITE_FORM",
          lifecycle: "PROSPECT",
          lastTouchAt: submittedAt,
          lastWebinarParticipationAt: submittedAt,
        },
        personUpdatesForExistingRecord: {
          lastTouchAt: submittedAt,
          lastWebinarParticipationAt: submittedAt,
        },
        shouldCreateWebinarParticipation: true,
      };
    default:
      return {
        source: "site-contact",
        noteTitle: "Contact via disruptionjoe.com",
        notePrefix: "[Contact via disruptionjoe.com]",
        notificationLabel: "Contact inquiry",
        personUpdatesForNewRecord: {
          lastTouchAt: submittedAt,
        },
        personUpdatesForExistingRecord: {
          lastTouchAt: submittedAt,
        },
        shouldCreateWebinarParticipation: false,
      };
  }
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

async function findExistingPersonByEmail({ apiUrl, apiKey, email }) {
  const query = `
    query FindPersonByEmail($email: String!) {
      people(first: 1, filter: { emails: { primaryEmail: { eq: $email } } }) {
        edges {
          node {
            id
            lifecycle
            engagedAt
            sourcePrimary
            sourceDetail
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
    return null;
  }

  return parsed.json?.data?.people?.edges?.[0]?.node || null;
}

function buildExistingPersonUpdates({ sourceContext, existingPerson }) {
  const updates = {
    ...(sourceContext.personUpdatesForExistingRecord || {}),
  };

  const currentSourcePrimary = existingPerson?.sourcePrimary || "";
  const currentSourceDetail = existingPerson?.sourceDetail || "";

  if (!currentSourcePrimary && sourceContext.personUpdatesForNewRecord?.sourcePrimary) {
    updates.sourcePrimary = sourceContext.personUpdatesForNewRecord.sourcePrimary;
  }

  if (!currentSourceDetail && sourceContext.personUpdatesForNewRecord?.sourceDetail) {
    updates.sourceDetail = sourceContext.personUpdatesForNewRecord.sourceDetail;
  }

  return updates;
}

function buildNotificationText({ name, email, message, personId, notificationLabel }) {
  const lines = [
    `New ${notificationLabel} from disruptionjoe.com`,
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

function buildConfirmationEmailText({ name }) {
  return [
    `Hi ${name},`,
    "",
    "Thanks for reaching out through disruptionjoe.com.",
    "",
    "I got your note and will follow up personally.",
    "",
    "Joe",
  ].join("\n");
}

function buildWebinarConfirmationEmailText({ firstName }) {
  return [
    `Thanks for registering for Why So Many AI Pilots Stall Out on Thursday, April 30 at 11:30 AM Central.`,
    "",
    `This is a live, participatory Zoom session. Please join with one LLM already open, logged in, and ready to use.`,
    "",
    `Join link: https://us06web.zoom.us/j/83740097324?pwd=CnZ8eN51k8S30Qzv9kSp9EdFkFL9ka.1`,
    "",
    `You do not need advanced prompting experience. Mixed starting points are expected.`,
    "",
    `What to have ready:`,
    `- ChatGPT, Claude, Gemini, or another LLM you already use comfortably`,
    `- One real workflow, team habit, or friction pattern you want to think about`,
    `- A quiet enough space to participate in a short breakout or full-room prompt exercise`,
    "",
    `If you do not already have an LLM ready, any of these work for the session: ChatGPT at chatgpt.com (free account), Claude at claude.ai (free account), or Microsoft Copilot at copilot.microsoft.com (no account needed).`,
    "",
    `You'll get another reminder before the event.`,
    "",
    `Thanks,`,
    `Joe`,
  ].join("\n");
}

function emitFollowupEvent(type, payload = {}) {
  console.log(
    JSON.stringify({
      type,
      emittedAt: new Date().toISOString(),
      ...payload,
    })
  );
}

async function sendTextEmail({ from, to, replyTo, subject, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo,
      subject,
      text,
    }),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(`Resend email failed (${response.status}): ${parsed.raw || "No response body"}`);
  }

  return parsed.json?.id || "";
}

async function updatePersonRecord({ apiUrl, apiKey, personId, updates }) {
  if (!personId || !updates || Object.keys(updates).length === 0) {
    return { attempted: false, applied: false, raw: "" };
  }

  const response = await fetch(buildRestUrl(apiUrl, `people/${personId}`), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    return {
      attempted: true,
      applied: false,
      raw: parsed.raw,
    };
  }

  return {
    attempted: true,
    applied: true,
    raw: parsed.raw,
  };
}

async function createWebinarParticipation({
  apiUrl,
  apiKey,
  personId,
  webinarId,
  registeredAt,
  registrationSource,
}) {
  if (!personId || !webinarId) {
    return {
      attempted: false,
      created: false,
      reason: "webinar_config_missing",
    };
  }

  const payload = {
    name: `Registration ${registeredAt}`,
    registeredAt,
    personId,
    webinarId,
  };

  if (registrationSource) {
    payload.registrationSource = registrationSource;
  }

  const response = await fetch(buildRestUrl(apiUrl, "webinarParticipations"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok && registrationSource) {
    const fallbackResponse = await fetch(buildRestUrl(apiUrl, "webinarParticipations"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Registration ${registeredAt}`,
        registeredAt,
        personId,
        webinarId,
      }),
    });

    const fallbackParsed = await parseApiResponse(fallbackResponse);

    if (!fallbackResponse.ok) {
      return {
        attempted: true,
        created: false,
        reason: fallbackParsed.raw || parsed.raw || "webinar_participation_failed",
      };
    }

    return {
      attempted: true,
      created: true,
      reason: "created_without_registration_source",
    };
  }

  if (!response.ok) {
    return {
      attempted: true,
      created: false,
      reason: parsed.raw || "webinar_participation_failed",
    };
  }

  return {
    attempted: true,
    created: true,
    reason: "created",
  };
}

async function sendNotificationEmail({ name, email, message, personId, notificationLabel }) {
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

  return {
    attempted: true,
    sent: true,
    id: await sendTextEmail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New ${notificationLabel} from ${name}`,
      text: buildNotificationText({ name, email, message, personId, notificationLabel }),
    }),
  };
}

async function handleConfirmationEmail({ sourceContext, name, firstName, email, personId }) {
  const enabled = envFlag("CONTACT_CONFIRMATION_EMAILS_ENABLED", false);
  const previewOnly = envFlag("CONTACT_CONFIRMATION_PREVIEW_ONLY", true);
  const fromEmail =
    process.env.CONTACT_CONFIRMATION_FROM_EMAIL ||
    process.env.CONTACT_NOTIFY_FROM_EMAIL ||
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "";

  const eligibleSources = ["site-contact", "webinar"];
  if (!eligibleSources.includes(sourceContext.source)) {
    return {
      attempted: false,
      sent: false,
      previewed: false,
      reason: "source_not_eligible",
    };
  }

  emitFollowupEvent("followup_candidate_detected", {
    email,
    personId,
    source: sourceContext.source,
  });

  if (!enabled) {
    emitFollowupEvent("followup_suppressed_by_gate", {
      email,
      personId,
      source: sourceContext.source,
      gate: "CONTACT_CONFIRMATION_EMAILS_ENABLED",
    });
    return {
      attempted: false,
      sent: false,
      previewed: false,
      reason: "suppressed_by_gate",
    };
  }

  if (!process.env.RESEND_API_KEY || !fromEmail) {
    return {
      attempted: true,
      sent: false,
      previewed: false,
      reason: "confirmation_not_configured",
    };
  }

  // Build source-specific email content
  let subject, text;
  if (sourceContext.source === "webinar") {
    subject = "You're registered: Why So Many AI Pilots Stall Out";
    text = buildWebinarConfirmationEmailText({ firstName: firstName || name });
  } else {
    subject = "Thanks for reaching out";
    text = buildConfirmationEmailText({ name });
  }

  if (previewOnly) {
    emitFollowupEvent("followup_preview_rendered", {
      email,
      personId,
      source: sourceContext.source,
      subject,
      text,
    });
    return {
      attempted: true,
      sent: false,
      previewed: true,
      reason: "preview_only",
    };
  }

  emitFollowupEvent("followup_send_attempted", {
    email,
    personId,
    source: sourceContext.source,
  });

  const id = await sendTextEmail({
    from: fromEmail,
    to: email,
    subject,
    text,
  });

  emitFollowupEvent("followup_send_succeeded", {
    email,
    personId,
    source: sourceContext.source,
    resendId: id,
  });

  return {
    attempted: true,
    sent: true,
    previewed: false,
    id,
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
  const email = (body.email || "").trim();
  const submittedAt = new Date().toISOString();
  const sourceContext = buildSourceContext({
    source: body.source,
    submittedAt,
  });

  // Support both legacy single name field and new firstName/lastName fields
  let firstName = (body.firstName || "").trim();
  let lastName = (body.lastName || "").trim();
  if (!firstName && body.name) {
    const nameParts = body.name.trim().split(/\s+/);
    firstName = nameParts[0] || "";
    lastName = nameParts.slice(1).join(" ") || "";
  }
  const name = [firstName, lastName].filter(Boolean).join(" ");

  // Extended webinar fields (O6 spec)
  const company = (body.company || "").trim();
  const title = (body.title || "").trim();
  const reasonForJoining = (body.reasonForJoining || "").trim();
  const linkedinUrl = (body.linkedinUrl || "").trim();
  const message = (body.message || "").trim();

  if (!firstName || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const apiKey = process.env.TWENTY_API_KEY;
  const apiUrl = normalizeApiUrl(process.env.TWENTY_API_URL);

  if (!apiKey) {
    console.error("Missing TWENTY_API_KEY environment variable.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  // firstName and lastName already parsed above

  let personId = "";
  let existingPerson = null;
  let noteId = "";
  let personWasCreated = false;
  let crmDefaultsApplied = false;
  let webinarParticipationStatus = {
    attempted: false,
    created: false,
    reason: "not_attempted",
  };
  let notificationStatus = {
    attempted: false,
    sent: false,
    reason: "not_attempted",
  };
  let confirmationStatus = {
    attempted: false,
    sent: false,
    previewed: false,
    reason: "not_attempted",
  };

  try {
    const personPayload = {
      name: { firstName, lastName },
      emails: { primaryEmail: email },
    };
    if (company) personPayload.company = { name: company };
    if (title) personPayload.jobTitle = title;
    if (linkedinUrl) {
      personPayload.links = { primaryLinkUrl: linkedinUrl, primaryLinkLabel: "LinkedIn" };
    }

    const twentyRes = await fetch(buildRestUrl(apiUrl, "people"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personPayload),
    });

    const personResponse = await parseApiResponse(twentyRes);

    if (!twentyRes.ok) {
      if (isDuplicateEntryError(personResponse)) {
        existingPerson = await findExistingPersonByEmail({ apiUrl, apiKey, email });
        personId = existingPerson?.id || "";
        if (personId) {
          console.warn("Twenty duplicate person detected; reusing existing record for email:", email);
        }
      }

      if (!personId) {
        console.error("Twenty API error (person):", twentyRes.status, personResponse.raw);
        return res.status(502).json({ error: "Failed to save contact. Please try again." });
      }
    } else {
      personWasCreated = true;
      personId = extractId(personResponse.json, [
        "data.createPerson.id",
        "data.person.id",
        "data.id",
        "id",
      ]);
    }

    const personUpdateResponse = await updatePersonRecord({
      apiUrl,
      apiKey,
      personId,
      updates: personWasCreated
        ? sourceContext.personUpdatesForNewRecord
        : buildExistingPersonUpdates({
            sourceContext,
            existingPerson,
          }),
    });

    crmDefaultsApplied = Boolean(personUpdateResponse.applied);

    if (personUpdateResponse.attempted && !personUpdateResponse.applied) {
      console.error("Twenty API error (person patch):", personUpdateResponse.raw);
    }

    // Build note from extended fields + message
    const noteLines = [sourceContext.notePrefix];
    if (company) noteLines.push(`Company: ${company}`);
    if (title) noteLines.push(`Title: ${title}`);
    if (reasonForJoining) noteLines.push(`Reason for joining: ${reasonForJoining}`);
    if (linkedinUrl) noteLines.push(`LinkedIn/URL: ${linkedinUrl}`);
    if (message) noteLines.push(`\n${message}`);
    const hasNoteContent = company || title || reasonForJoining || linkedinUrl || message;

    if (hasNoteContent && personId) {
      const noteText = noteLines.join("\n");

      const noteRes = await fetch(buildRestUrl(apiUrl, "notes"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: sourceContext.noteTitle,
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

    if (personId && sourceContext.shouldCreateWebinarParticipation) {
      webinarParticipationStatus = await createWebinarParticipation({
        apiUrl,
        apiKey,
        personId,
        webinarId: (body.webinarId || process.env.TWENTY_DEFAULT_WEBINAR_ID || "").trim(),
        registeredAt: submittedAt,
        registrationSource: (body.registrationSource || DEFAULT_WEBINAR_REGISTRATION_SOURCE).trim(),
      });

      if (webinarParticipationStatus.attempted && !webinarParticipationStatus.created) {
        console.error("Twenty API error (webinar participation):", webinarParticipationStatus.reason);
      }
    }

    try {
      notificationStatus = await sendNotificationEmail({
        name,
        email,
        message,
        personId,
        notificationLabel: sourceContext.notificationLabel,
      });
    } catch (notificationError) {
      notificationStatus = {
        attempted: true,
        sent: false,
        reason: notificationError.message,
      };
      console.error("Notification email failed:", notificationError);
    }

    try {
      confirmationStatus = await handleConfirmationEmail({
        sourceContext,
        name,
        firstName,
        email,
        personId,
      });
    } catch (confirmationError) {
      confirmationStatus = {
        attempted: true,
        sent: false,
        previewed: false,
        reason: confirmationError.message,
      };
      emitFollowupEvent("followup_send_failed", {
        email,
        personId,
        source: sourceContext.source,
        reason: confirmationError.message,
      });
      console.error("Confirmation email failed:", confirmationError);
    }

    return res.status(200).json({
      success: true,
      personId,
      crmDefaultsApplied,
      noteAttached: Boolean(noteId),
      webinarParticipationAttempted: Boolean(webinarParticipationStatus.attempted),
      webinarParticipationCreated: Boolean(webinarParticipationStatus.created),
      notificationAttempted: Boolean(notificationStatus.attempted),
      notificationSent: Boolean(notificationStatus.sent),
      confirmationAttempted: Boolean(confirmationStatus.attempted),
      confirmationSent: Boolean(confirmationStatus.sent),
      confirmationPreviewed: Boolean(confirmationStatus.previewed),
    });
  } catch (err) {
    console.error("Twenty API request failed:", err);
    return res.status(502).json({ error: "Failed to save contact. Please try again." });
  }
};
