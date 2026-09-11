import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Store contact address — language-independent. Used in mailto links and as
 * the destination for contact form submissions.
 */
export const CONTACT_EMAIL = "info@forzaizolashop.com";

export type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

/** Localized contact details shown on the contact page and home contact block. */
export function getContactDetails(dict: Dictionary): ContactDetail[] {
  const { details } = dict.contact;
  return [
    { label: details.emailLabel, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: details.locationLabel, value: details.locationValue },
    { label: details.matchdaysLabel, value: details.matchdaysValue },
  ];
}
