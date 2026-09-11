import "server-only";

/**
 * Transactional email through Resend. A plain `fetch` against their REST API —
 * no SDK needed for a single endpoint.
 *
 * `FROM` must stay on a domain verified in the Resend dashboard, otherwise
 * Resend rejects the send (see the README for the DNS records).
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "NK Izola Store <noreply@forzaizolashop.com>";

const apiKey = process.env.RESEND_API_KEY;

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  /** Where a reply should go — the supporter, not the store. */
  replyTo?: string;
};

/**
 * Send one email. Returns whether it was accepted by Resend so callers can
 * surface an honest error instead of a false "message sent".
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: OutgoingEmail): Promise<boolean> {
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set — nothing was sent");
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        // Collapse newlines: the subject comes from user input.
        subject: subject.replace(/\s+/g, " ").slice(0, 200),
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      console.error(
        "[email] Resend rejected the message",
        response.status,
        await response.text()
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Resend request failed", error);
    return false;
  }
}

/** Escape user input before interpolating it into an HTML email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
