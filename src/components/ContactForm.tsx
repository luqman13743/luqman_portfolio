"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        setErrorMsg(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Network error. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl font-semibold text-teal-900">Message sent</p>
        <p className="mt-2 text-sm text-ink/60">
          Thanks for reaching out — your message has been received and will be reviewed soon.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card grid gap-5 p-7 sm:p-8">
      {/* Honeypot field — hidden from real users, bots tend to fill every input */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-500"
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-500"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="field-label">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          required
          className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-500"
        />
        {fieldErrors.subject && <p className="mt-1 text-xs text-red-600">{fieldErrors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-500"
        />
        {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
      </div>

      {status === "error" && errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60 sm:w-fit">
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
