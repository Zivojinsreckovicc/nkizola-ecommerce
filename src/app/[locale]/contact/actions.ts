"use server";

import { redirect } from "next/navigation";
import { CONTACT_EMAIL } from "@/lib/contact";
import { escapeHtml, sendEmail } from "@/lib/email";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type ContactField = "name" | "email" | "message";

export type ContactFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
};

// Pragmatic check — good enough to catch typos without rejecting valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  locale: Locale,
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const dict = await getDictionary(locale);
  const t = dict.contact.form;

  // Honeypot: real supporters leave this hidden field empty; bots tend to fill
  // it. Send them down the success path so we don't tip them off.
  if (readField(formData, "company")) {
    redirect(localizePath(locale, "/thank-you"));
  }

  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const subject = readField(formData, "subject");
  const message = readField(formData, "message");

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = t.errorName;
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = t.errorEmail;
  if (message.length < 10) fieldErrors.message = t.errorMessage;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: t.errorGeneric,
      fieldErrors,
    };
  }

  const delivered = await sendEmail({
    to: CONTACT_EMAIL,
    // Staff hit Reply in their inbox and it reaches the supporter directly.
    replyTo: email,
    subject: subject
      ? `Contact form: ${subject}`
      : `Contact form: new message from ${name}`,
    html: renderNotification({ name, email, subject, message, locale }),
  });

  if (!delivered) {
    // Keep the message in the deployment logs so nothing is lost while the
    // sender is down, and tell the supporter the truth.
    console.error("[contact] delivery failed", { name, email, subject, message });
    return {
      status: "error",
      message: t.errorDelivery.replace("{email}", CONTACT_EMAIL),
    };
  }

  redirect(localizePath(locale, "/thank-you"));
}

/** HTML body of the notification sent to the store inbox. */
function renderNotification(submission: {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: Locale;
}): string {
  const rows: [string, string][] = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Subject", submission.subject || "—"],
    ["Language", submission.locale.toUpperCase()],
  ];

  return `
    <div style="font-family:system-ui,sans-serif;color:#0A1622;line-height:1.6">
      <h2 style="color:#0C0D29;margin:0 0 16px">New contact form message</h2>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:16px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding-right:12px;color:#0A1622;opacity:.6">${label}</td><td>${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #5DB4E6;padding-left:12px">${escapeHtml(submission.message)}</div>
    </div>
  `;
}
