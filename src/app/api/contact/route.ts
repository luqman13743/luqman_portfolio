import { NextRequest, NextResponse } from "next/server";
import { contactSchema, rateLimit, clientKeyFromHeaders } from "@/lib/validation";
import { createMessage } from "@/lib/repo";

export async function POST(req: NextRequest) {
  const key = clientKeyFromHeaders(req.headers, "contact");
  if (!rateLimit(key, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot tripped ("website" field non-empty) — silently pretend success
    // so bots don't learn to adapt, without saving anything.
    const honeypotIssue = parsed.error.issues.find((i) => i.path[0] === "website");
    if (honeypotIssue) {
      return NextResponse.json({ ok: true });
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json({ error: "Please check the form and try again.", fieldErrors }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;
  await createMessage({ name, email, subject, message });

  // Optional email notification via Resend, only if configured.
  if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFY_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: process.env.CONTACT_NOTIFY_EMAIL,
          reply_to: email,
          subject: `New contact form message: ${subject}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
    } catch {
      // Notification is best-effort; the message is already saved either way.
    }
  }

  return NextResponse.json({ ok: true });
}
