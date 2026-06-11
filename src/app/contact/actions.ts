"use server";

export type ContactField = "name" | "email" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
};

// Pragmatic check — good enough to catch typos without rejecting valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real supporters leave this hidden field empty; bots tend to fill
  // it. Pretend success so we don't tip them off.
  if (readField(formData, "company")) {
    return {
      status: "success",
      message: "Thanks for reaching out — we'll be in touch soon.",
    };
  }

  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const subject = readField(formData, "subject");
  const message = readField(formData, "message");

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please tell us your name.";
  if (!EMAIL_PATTERN.test(email))
    fieldErrors.email = "Enter a valid email address.";
  if (message.length < 10)
    fieldErrors.message = "Your message is a little short — add a few details.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // TODO: connect a delivery channel (email provider or Shopify contact API).
  // Until then, submissions are captured in the deployment logs so nothing is
  // lost during the MVP phase.
  console.info("[contact] new message", { name, email, subject, message });

  return {
    status: "success",
    message:
      "Thanks for reaching out! We'll get back to you within a couple of days.",
  };
}
