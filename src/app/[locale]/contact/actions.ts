"use server";

import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type ContactField = "name" | "email" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
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
  // it. Pretend success so we don't tip them off.
  if (readField(formData, "company")) {
    return { status: "success", message: t.successMessage };
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

  // TODO: connect a delivery channel (email provider or Shopify contact API).
  // Until then, submissions are captured in the deployment logs so nothing is
  // lost during the MVP phase.
  console.info("[contact] new message", { name, email, subject, message });

  return { status: "success", message: t.successMessage };
}
