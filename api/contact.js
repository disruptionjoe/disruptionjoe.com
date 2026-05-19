/**
 * Vercel Serverless Function: /api/contact
 *
 * Receives AI Session, Snapshot, and webinar form submissions, creates or updates a
 * Person in Twenty CRM, optionally creates a webinarParticipation record,
 * attaches the intake note when provided, and sends an email notification
 * when Resend is configured.
 *
 * Environment variables:
 *   TWENTY_API_KEY                - Required
 *   TWENTY_API_URL                - Optional, defaults to https://api.twenty.com
 *   TWENTY_DEFAULT_WEBINAR_ID     - Optional, used for webinar registrations
 *   SNAPSHOT_GPT_URL              - Optional, stored on Snapshot engagement records
 *   SNAPSHOT_GOOGLE_FORM_URL      - Optional, stored on Snapshot engagement records
 *   RESEND_API_KEY                - Optional, enables email notifications
 *   CONTACT_NOTIFY_FROM_EMAIL     - Optional, required with RESEND_API_KEY
 *   CONTACT_NOTIFY_TO_EMAIL       - Optional, defaults to joe@disruptionjoe.com
 *   CONTACT_CONFIRMATION_EMAILS_ENABLED - Optional, defaults to false
 *   CONTACT_CONFIRMATION_PREVIEW_ONLY   - Optional, defaults to true
 *   CONTACT_CONFIRMATION_FROM_EMAIL     - Optional, required when confirmation emails are enabled
 *   SNAPSHOT_CONFIRMATION_EMAILS_ENABLED - Optional, defaults to true for Snapshot requests
 *   SNAPSHOT_CONFIRMATION_PREVIEW_ONLY   - Optional, defaults to false for Snapshot requests
 */

const DEFAULT_TWENTY_API_URL = "https://api.twenty.com";
const DEFAULT_NOTIFY_TO_EMAIL = "joe@disruptionjoe.com";
const DEFAULT_WEBINAR_REGISTRATION_SOURCE = "SITE_FORM";
const DEFAULT_SNAPSHOT_WINDOW_HOURS = 48;

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
    case "snapshot-sponsor":
    case "snapshot-sponsor-home-hero":
      return {
        source: "snapshot-sponsor",
        noteTitle: "AI Readiness Snapshot request via disruptionjoe.com",
        notePrefix: "[AI Readiness Snapshot request via disruptionjoe.com]",
        notificationLabel: "AI Readiness Snapshot request",
        personUpdatesForNewRecord: {
          sourcePrimary: "SNAPSHOT",
          sourceDetail: "SNAPSHOT_SITE_FORM",
          lifecycle: "PROSPECT",
          lastTouchAt: submittedAt,
          lastSnapshotSubmittedAt: submittedAt,
        },
        personUpdatesForExistingRecord: {
          lastTouchAt: submittedAt,
          lastSnapshotSubmittedAt: submittedAt,
        },
        shouldCreateWebinarParticipation: false,
        shouldCreateSnapshotEngagement: true,
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
        shouldCreateSnapshotEngagement: false,
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

const PERSON_FIELDS = `
  id
  lifecycle
  engagedAt
  companyId
  sourcePrimary
  sourceDetail
  deletedAt
  emails {
    primaryEmail
    additionalEmails
  }
`;

async function findExistingPersonByEmail({ apiUrl, apiKey, email, includeDeleted = false }) {
  const filter = includeDeleted
    ? `{ deletedAt: { is: NOT_NULL }, emails: { primaryEmail: { eq: $email } } }`
    : `{ emails: { primaryEmail: { eq: $email } } }`;

  const query = `
    query FindPersonByEmail($email: String!) {
      people(first: 1, filter: ${filter}) {
        edges { node { ${PERSON_FIELDS} } }
      }
    }
  `;

  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { email } }),
  });
  const parsed = await parseApiResponse(response);

  const label = includeDeleted ? "trashed email" : "email";
  if (!response.ok) {
    console.error(`Twenty GraphQL ${label} lookup HTTP error:`, response.status, parsed.raw);
    return null;
  }
  if (parsed.json?.errors) {
    console.error(`Twenty GraphQL ${label} lookup body error:`, JSON.stringify(parsed.json.errors));
    return null;
  }

  const node = parsed.json?.data?.people?.edges?.[0]?.node;
  console.log(`Twenty ${label} lookup result:`, node ? `found id=${node.id}` : "no match");
  return node ? { ...node, matchedBy: includeDeleted ? "email_trashed" : "email" } : null;
}

async function findExistingPersonByName({ apiUrl, apiKey, firstName, lastName, includeDeleted = false }) {
  if (!firstName || !lastName) return null;

  const filter = includeDeleted
    ? `{ deletedAt: { is: NOT_NULL }, name: { firstName: { eq: $firstName }, lastName: { eq: $lastName } } }`
    : `{ name: { firstName: { eq: $firstName }, lastName: { eq: $lastName } } }`;

  const query = `
    query FindPersonByName($firstName: String!, $lastName: String!) {
      people(first: 1, filter: ${filter}) {
        edges { node { ${PERSON_FIELDS} } }
      }
    }
  `;

  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { firstName, lastName } }),
  });
  const parsed = await parseApiResponse(response);

  const label = includeDeleted ? "trashed name" : "name";
  if (!response.ok) {
    console.error(`Twenty GraphQL ${label} lookup HTTP error:`, response.status, parsed.raw);
    return null;
  }
  if (parsed.json?.errors) {
    console.error(`Twenty GraphQL ${label} lookup body error:`, JSON.stringify(parsed.json.errors));
    return null;
  }

  const node = parsed.json?.data?.people?.edges?.[0]?.node;
  console.log(`Twenty ${label} lookup result:`, node ? `found id=${node.id}` : `no match for firstName=${firstName} lastName=${lastName}`);
  return node ? { ...node, matchedBy: includeDeleted ? "name_trashed" : "name" } : null;
}

async function restorePerson({ apiUrl, apiKey, id }) {
  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation R($id: ID!) { restorePerson(id: $id) { id deletedAt } }`, variables: { id } }),
  });
  const parsed = await parseApiResponse(response);

  if (!response.ok || parsed.json?.errors) {
    console.error("Twenty restorePerson failed:", response.status, parsed.json?.errors ? JSON.stringify(parsed.json.errors) : parsed.raw);
    return false;
  }
  const restoredId = parsed.json?.data?.restorePerson?.id;
  console.log("Twenty restorePerson result:", restoredId === id ? `restored id=${id}` : `unexpected payload: ${parsed.raw}`);
  return restoredId === id;
}

function buildEmailUpdatesForNameMatch({ existingPerson, submittedEmail }) {
  const matched = existingPerson?.matchedBy;
  if (matched !== "name" && matched !== "name_trashed") return null;
  if (!submittedEmail) return null;

  const existingEmails = existingPerson?.emails || {};
  const primary = (existingEmails.primaryEmail || "").trim();
  const additional = Array.isArray(existingEmails.additionalEmails)
    ? existingEmails.additionalEmails.filter(Boolean)
    : [];

  const submittedLower = submittedEmail.toLowerCase();

  if (!primary) {
    return { primaryEmail: submittedEmail, additionalEmails: additional };
  }
  if (primary.toLowerCase() === submittedLower) return null;
  if (additional.some((e) => (e || "").toLowerCase() === submittedLower)) return null;

  return { primaryEmail: primary, additionalEmails: [...additional, submittedEmail] };
}

function buildExistingPersonUpdates({ sourceContext, existingPerson, submittedEmail }) {
  const updates = {
    ...(sourceContext.personUpdatesForExistingRecord || {}),
  };

  const currentSourcePrimary = existingPerson?.sourcePrimary || "";
  const currentSourceDetail = existingPerson?.sourceDetail || "";

  if (!currentSourcePrimary && sourceContext.personUpdatesForNewRecord?.sourcePrimary) {
    updates.sourcePrimary = sourceContext.personUpdatesForNewRecord.sourcePrimary;
  }

  if (
    !currentSourceDetail &&
    sourceContext.personUpdatesForNewRecord?.sourceDetail &&
    (!currentSourcePrimary || currentSourcePrimary === sourceContext.personUpdatesForNewRecord?.sourcePrimary)
  ) {
    updates.sourceDetail = sourceContext.personUpdatesForNewRecord.sourceDetail;
  }

  const emailUpdates = buildEmailUpdatesForNameMatch({ existingPerson, submittedEmail });
  if (emailUpdates) {
    updates.emails = emailUpdates;
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

function buildSnapshotConfirmationEmailText() {
  return [
    "Thanks for requesting an AI Readiness Snapshot.",
    "",
    "Joe will review your request and send the setup link and instructions within 24-48 hours.",
    "",
    "The Snapshot is designed to help surface team-level patterns around AI curiosity, caution, readiness, friction, appetite, and practical next steps.",
    "",
    "Sponsors receive team-level patterns, not a \"who said what\" report.",
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

async function findExistingCompanyByName({ apiUrl, apiKey, companyName }) {
  if (!companyName) return null;

  const query = `
    query FindCompanyByName($companyName: String!) {
      companies(first: 1, filter: { name: { eq: $companyName } }) {
        edges { node { id name deletedAt } }
      }
    }
  `;

  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { companyName } }),
  });
  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    console.error("Twenty GraphQL company lookup HTTP error:", response.status, parsed.raw);
    return null;
  }
  if (parsed.json?.errors) {
    console.error("Twenty GraphQL company lookup body error:", JSON.stringify(parsed.json.errors));
    return null;
  }

  const node = parsed.json?.data?.companies?.edges?.[0]?.node;
  console.log("Twenty company lookup result:", node ? `found id=${node.id}` : `no match for company=${companyName}`);
  return node || null;
}

function extractEmailDomain(email) {
  const match = String(email || "").trim().toLowerCase().match(/@([^@\s]+)$/);
  return match ? match[1] : "";
}

function isPersonalEmailDomain(domain) {
  return [
    "aol.com",
    "apple.com",
    "gmail.com",
    "googlemail.com",
    "hey.com",
    "hotmail.com",
    "icloud.com",
    "live.com",
    "me.com",
    "msn.com",
    "outlook.com",
    "pm.me",
    "proton.me",
    "protonmail.com",
    "yahoo.com",
  ].includes(domain);
}

function buildCompanyCreatePayload({ companyName, email }) {
  const payload = { name: companyName };
  const domain = extractEmailDomain(email);

  if (domain && !isPersonalEmailDomain(domain)) {
    payload.domainName = {
      primaryLinkLabel: domain,
      primaryLinkUrl: `https://${domain}`,
      secondaryLinks: [],
    };
  }

  return payload;
}

async function createCompanyRecord({ apiUrl, apiKey, companyName, email }) {
  if (!companyName) {
    return {
      attempted: false,
      created: false,
      companyId: "",
      reason: "company_name_missing",
    };
  }

  const existingCompany = await findExistingCompanyByName({ apiUrl, apiKey, companyName });
  if (existingCompany?.id) {
    return {
      attempted: true,
      created: false,
      companyId: existingCompany.id,
      reason: "existing_company_reused",
    };
  }

  const response = await fetch(buildRestUrl(apiUrl, "companies"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildCompanyCreatePayload({ companyName, email })),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    if (isDuplicateEntryError(parsed)) {
      const duplicate = await findExistingCompanyByName({ apiUrl, apiKey, companyName });
      if (duplicate?.id) {
        return {
          attempted: true,
          created: false,
          companyId: duplicate.id,
          reason: "duplicate_company_reused",
        };
      }
    }

    return {
      attempted: true,
      created: false,
      companyId: "",
      reason: parsed.raw || "company_create_failed",
    };
  }

  return {
    attempted: true,
    created: true,
    companyId: extractId(parsed.json, [
      "data.createCompany.id",
      "data.company.id",
      "data.id",
      "id",
    ]),
    reason: "created",
  };
}

async function ensurePersonCompanyAssociation({ apiUrl, apiKey, personId, companyId }) {
  if (!personId || !companyId) {
    return {
      attempted: false,
      applied: false,
      raw: "",
    };
  }

  return updatePersonRecord({
    apiUrl,
    apiKey,
    personId,
    updates: { companyId },
  });
}

function addHoursIso(isoDate, hours) {
  return new Date(new Date(isoDate).getTime() + hours * 60 * 60 * 1000).toISOString();
}

function buildSnapshotEngagementName({ name, company, submittedAt }) {
  const label = company || name || "Unknown sponsor";
  return `${label} Snapshot ${submittedAt.slice(0, 10)}`;
}

function buildSnapshotNotes({ name, email, company, sourcePage, message, submittedAt }) {
  return [
    "AI Readiness Snapshot sponsor request.",
    "",
    `Sponsor: ${name}`,
    `Email: ${email}`,
    `Company/organization: ${company}`,
    sourcePage ? `Source page: ${sourcePage}` : "",
    `Submitted at: ${submittedAt}`,
    "",
    "Next step: Joe to send setup link and instructions, plus a suggested sponsor message, within 24-48 hours.",
    "Context: free first step toward Team AI Activations.",
    "",
    message || "",
  ].filter(Boolean).join("\n");
}

function getSnapshotConfigValue(bodyValue, envName) {
  return (bodyValue || process.env[envName] || "").trim();
}

async function findOpenSnapshotEngagement({ apiUrl, apiKey, personId, companyId }) {
  if (!personId || !companyId) return null;

  const query = `
    query FindOpenSnapshotEngagement($personId: UUID!, $companyId: UUID!) {
      snapshotEngagements(
        first: 1,
        filter: {
          sponsorPersonId: { eq: $personId },
          companyId: { eq: $companyId },
          windowStatus: { in: [OPEN, DRAFT_PENDING] }
        }
      ) {
        edges {
          node {
            id
            name
            windowStatus
            sponsorPersonId
            companyId
          }
        }
      }
    }
  `;

  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { personId, companyId } }),
  });
  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    console.error("Twenty GraphQL snapshot engagement lookup HTTP error:", response.status, parsed.raw);
    return null;
  }
  if (parsed.json?.errors) {
    console.error("Twenty GraphQL snapshot engagement lookup body error:", JSON.stringify(parsed.json.errors));
    return null;
  }

  const node = parsed.json?.data?.snapshotEngagements?.edges?.[0]?.node;
  console.log("Twenty snapshot engagement lookup result:", node ? `found id=${node.id}` : "no open engagement match");
  return node || null;
}

async function createOrUpdateSnapshotEngagement({
  apiUrl,
  apiKey,
  personId,
  companyId,
  name,
  email,
  company,
  sourcePage,
  message,
  submittedAt,
  body,
}) {
  if (!personId || !companyId) {
    return {
      attempted: false,
      created: false,
      updated: false,
      snapshotEngagementId: "",
      reason: "person_or_company_missing",
    };
  }

  const teamCode = (body.teamCode || "").trim();
  const payload = {
    name: buildSnapshotEngagementName({ name, company, submittedAt }),
    sponsorPersonId: personId,
    companyId,
    submitSource: "SITE_FORM",
    windowOpensAt: submittedAt,
    windowClosesAt: addHoursIso(submittedAt, DEFAULT_SNAPSHOT_WINDOW_HOURS),
    submissionCount: 0,
    windowStatus: "OPEN",
    notes: {
      markdown: buildSnapshotNotes({ name, email, company, sourcePage, message, submittedAt }),
    },
  };

  if (teamCode) payload.teamCode = teamCode;

  const googleFormUrl = getSnapshotConfigValue(body.googleFormUrl, "SNAPSHOT_GOOGLE_FORM_URL");
  const gptUrl = getSnapshotConfigValue(body.gptUrl, "SNAPSHOT_GPT_URL");
  if (googleFormUrl) payload.googleFormUrl = googleFormUrl;
  if (gptUrl) payload.gptUrl = gptUrl;

  const existing = await findOpenSnapshotEngagement({ apiUrl, apiKey, personId, companyId });
  const method = existing?.id ? "PATCH" : "POST";
  const path = existing?.id
    ? buildRestUrl(apiUrl, `snapshotEngagements/${existing.id}`)
    : buildRestUrl(apiUrl, "snapshotEngagements");

  const response = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseApiResponse(response);

  if (!response.ok) {
    return {
      attempted: true,
      created: false,
      updated: false,
      snapshotEngagementId: existing?.id || "",
      reason: parsed.raw || "snapshot_engagement_failed",
    };
  }

  return {
    attempted: true,
    created: !existing?.id,
    updated: Boolean(existing?.id),
    snapshotEngagementId: existing?.id || extractId(parsed.json, [
      "data.createSnapshotEngagement.id",
      "data.snapshotEngagement.id",
      "data.id",
      "id",
    ]),
    reason: existing?.id ? "updated_existing_open_engagement" : "created",
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
  const isSnapshotSponsor = sourceContext.source === "snapshot-sponsor";
  const enabled = isSnapshotSponsor
    ? envFlag("SNAPSHOT_CONFIRMATION_EMAILS_ENABLED", true)
    : envFlag("CONTACT_CONFIRMATION_EMAILS_ENABLED", false);
  const previewOnly = isSnapshotSponsor
    ? envFlag("SNAPSHOT_CONFIRMATION_PREVIEW_ONLY", false)
    : envFlag("CONTACT_CONFIRMATION_PREVIEW_ONLY", true);
  const fromEmail =
    process.env.CONTACT_CONFIRMATION_FROM_EMAIL ||
    process.env.CONTACT_NOTIFY_FROM_EMAIL ||
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "";

  const eligibleSources = ["site-contact", "webinar", "snapshot-sponsor"];
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
      gate: isSnapshotSponsor ? "SNAPSHOT_CONFIRMATION_EMAILS_ENABLED" : "CONTACT_CONFIRMATION_EMAILS_ENABLED",
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
  } else if (sourceContext.source === "snapshot-sponsor") {
    subject = "Your AI Readiness Snapshot request is in";
    text = buildSnapshotConfirmationEmailText();
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
  const company = (body.company || body.companyName || body.organization || "").trim();
  const sourcePage = (body.sourcePage || "").trim();
  const title = (body.title || "").trim();
  const reasonForJoining = (body.reasonForJoining || "").trim();
  const linkedinUrl = (body.linkedinUrl || "").trim();
  const message = (body.message || "").trim();

  if (!firstName || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (sourceContext.shouldCreateSnapshotEngagement && !company) {
    return res.status(400).json({ error: "Company / organization is required." });
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
  let companyId = "";
  let noteId = "";
  let personWasCreated = false;
  let crmDefaultsApplied = false;
  let companyStatus = {
    attempted: false,
    created: false,
    companyId: "",
    reason: "not_attempted",
  };
  let companyAssociationStatus = {
    attempted: false,
    applied: false,
    raw: "",
  };
  let snapshotEngagementStatus = {
    attempted: false,
    created: false,
    updated: false,
    snapshotEngagementId: "",
    reason: "not_attempted",
  };
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
        // 1) live record by email
        existingPerson = await findExistingPersonByEmail({ apiUrl, apiKey, email });
        personId = existingPerson?.id || "";
        if (personId) {
          console.warn("Twenty duplicate person detected; reusing existing record by email:", email);
        }

        // 2) live record by name
        if (!personId) {
          existingPerson = await findExistingPersonByName({ apiUrl, apiKey, firstName, lastName });
          personId = existingPerson?.id || "";
          if (personId) {
            console.warn("Twenty duplicate person detected; reusing existing record by name:", firstName, lastName, "(submitted email:", email, ")");
          }
        }

        // 3) trashed record by email — restore then reuse
        if (!personId) {
          const trashed = await findExistingPersonByEmail({ apiUrl, apiKey, email, includeDeleted: true });
          if (trashed?.id) {
            const restored = await restorePerson({ apiUrl, apiKey, id: trashed.id });
            if (restored) {
              existingPerson = trashed;
              personId = trashed.id;
              console.warn("Twenty duplicate detected in trashed; restored by email:", email, "id:", trashed.id);
            }
          }
        }

        // 4) trashed record by name — restore then reuse (adds email via buildEmailUpdatesForNameMatch)
        if (!personId) {
          const trashed = await findExistingPersonByName({ apiUrl, apiKey, firstName, lastName, includeDeleted: true });
          if (trashed?.id) {
            const restored = await restorePerson({ apiUrl, apiKey, id: trashed.id });
            if (restored) {
              existingPerson = trashed;
              personId = trashed.id;
              console.warn("Twenty duplicate detected in trashed; restored by name:", firstName, lastName, "id:", trashed.id, "(submitted email:", email, ")");
            }
          }
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

    if (personId && sourceContext.shouldCreateSnapshotEngagement) {
      companyStatus = await createCompanyRecord({
        apiUrl,
        apiKey,
        companyName: company,
        email,
      });
      companyId = companyStatus.companyId || "";

      if (companyStatus.attempted && !companyId) {
        console.error("Twenty API error (company):", companyStatus.reason);
        return res.status(502).json({ error: "Failed to save organization. Please try again." });
      }
    }

    const personUpdates = personWasCreated
      ? { ...(sourceContext.personUpdatesForNewRecord || {}) }
      : buildExistingPersonUpdates({
          sourceContext,
          existingPerson,
          submittedEmail: email,
        });

    if (companyId) {
      personUpdates.companyId = companyId;
    }

    const personUpdateResponse = await updatePersonRecord({
      apiUrl,
      apiKey,
      personId,
      updates: personUpdates,
    });

    crmDefaultsApplied = Boolean(personUpdateResponse.applied);

    if (personUpdateResponse.attempted && !personUpdateResponse.applied) {
      console.error("Twenty API error (person patch):", personUpdateResponse.raw);
    }

    // Build note from extended fields + message
    const noteLines = [sourceContext.notePrefix];
    if (company) noteLines.push(`Company: ${company}`);
    if (sourcePage) noteLines.push(`Source page: ${sourcePage}`);
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

    if (personId && sourceContext.shouldCreateSnapshotEngagement) {
      snapshotEngagementStatus = await createOrUpdateSnapshotEngagement({
        apiUrl,
        apiKey,
        personId,
        companyId,
        name,
        email,
        company,
        sourcePage,
        message,
        submittedAt,
        body,
      });

      if (snapshotEngagementStatus.attempted && !snapshotEngagementStatus.created && !snapshotEngagementStatus.updated) {
        console.error("Twenty API error (snapshot engagement):", snapshotEngagementStatus.reason);
        return res.status(502).json({ error: "Failed to save Snapshot request. Please try again." });
      }

      companyAssociationStatus = await ensurePersonCompanyAssociation({
        apiUrl,
        apiKey,
        personId,
        companyId,
      });

      if (companyAssociationStatus.attempted && !companyAssociationStatus.applied) {
        console.error("Twenty API error (person-company association):", companyAssociationStatus.raw);
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
      companyId,
      snapshotEngagementId: snapshotEngagementStatus.snapshotEngagementId,
      crmDefaultsApplied,
      noteAttached: Boolean(noteId),
      companyAttempted: Boolean(companyStatus.attempted),
      companyCreated: Boolean(companyStatus.created),
      companyAssociationApplied: Boolean(companyAssociationStatus.applied),
      snapshotEngagementAttempted: Boolean(snapshotEngagementStatus.attempted),
      snapshotEngagementCreated: Boolean(snapshotEngagementStatus.created),
      snapshotEngagementUpdated: Boolean(snapshotEngagementStatus.updated),
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
