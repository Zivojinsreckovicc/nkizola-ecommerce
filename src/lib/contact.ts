import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Store contact address — language-independent, used in mailto links. */
export const CONTACT_EMAIL = "store@nkizola.si";

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
