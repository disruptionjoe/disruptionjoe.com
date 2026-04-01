/**
 * Vercel Serverless Function: /api/contact
 *
 * Receives contact form submissions (name, email, message)
 * and creates a Person record in Twenty CRM.
 *
 * Environment variables required in Vercel:
 *   TWENTY_API_KEY  — Your Twenty API key (Settings → APIs & Webhooks)
 *   TWENTY_API_URL  — Your Twenty instance URL (e.g. https://api.twenty.com)
 */

export default async function handler(req, res) {
  // CORS headers for the site origin
  res.setHeader("Access-Control-Allow-Origin", "https://disruptionjoe.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const apiKey = process.env.TWENTY_API_KEY;
  const apiUrl = process.env.TWENTY_API_URL;

  if (!apiKey || !apiUrl) {
    console.error("Missing TWENTY_API_KEY or TWENTY_API_URL environment variable.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  // Split name into first/last (best effort)
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  try {
    // Create a Person in Twenty CRM
    const twentyRes = await fetch(`${apiUrl}/rest/people`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: { firstName, lastName },
        emails: {
          primaryEmail: email,
        },
        // Store the intake message and source in the person's intro field
        // so it's visible when Joe opens the contact in Twenty
        intro: message
          ? `[AI Session inquiry via disruptionjoe.com]\n\n${message}`
          : "[AI Session inquiry via disruptionjoe.com]",
      }),
    });

    if (!twentyRes.ok) {
      const errorBody = await twentyRes.text();
      console.error("Twenty API error:", twentyRes.status, errorBody);
      return res.status(502).json({ error: "Failed to save contact. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Twenty API request failed:", err);
    return res.status(502).json({ error: "Failed to save contact. Please try again." });
  }
}
