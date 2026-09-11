import type { Product, ProductVariant } from "@/lib/shopify/types";

/**
 * Custom print personalisation.
 *
 * A product opts in by carrying the `custom.print_trigger` metafield, whose
 * value is the id of the `ProductOptionValue` that turns printing on (e.g. the
 * "Z imenom in številko" value of the "Print" option). Products without that
 * metafield never render the fields — the feature is per-product by design.
 *
 * Matching on the value *id* rather than its name keeps this working once the
 * option is translated: Shopify returns localized option names and values, but
 * ids are stable across languages.
 */

/** Line item property keys — what the team reads on the Shopify order. */
export const PRINT_NAME_KEY = "Name";
export const PRINT_NUMBER_KEY = "Number";

/** Form field names, kept distinct from the order-facing property keys. */
export const PRINT_NAME_FIELD = "printName";
export const PRINT_NUMBER_FIELD = "printNumber";

/**
 * Hidden field carrying the product page's own path + query, so a rejected
 * submission can return to the exact variant the shopper had selected.
 */
export const RETURN_TO_FIELD = "returnTo";

export const PRINT_NAME_MAX_LENGTH = 15;
export const PRINT_NUMBER_MAX_LENGTH = 2;

/** Letters (incl. č/š/ž), digits, space, hyphen, apostrophe and period. */
const NAME_PATTERN = /^[\p{L}\p{M}\p{Nd} .'-]+$/u;
const NUMBER_PATTERN = /^\d{1,2}$/;

export type PrintFieldError = "name" | "number";

/**
 * Whether the selected variant is the custom-print one.
 *
 * The trigger id is resolved back to an option/value *name* pair from the same
 * localized response the variant came from, so both sides always speak the
 * same language.
 */
export function requiresPrintDetails(
  product: Product,
  variant: ProductVariant | null
): boolean {
  if (!product.printTriggerValueId || !variant) return false;

  for (const option of product.options) {
    const trigger = option.values.find(
      (value) => value.id === product.printTriggerValueId
    );
    if (!trigger) continue;

    return variant.selectedOptions.some(
      (selected) =>
        selected.name === option.name && selected.value === trigger.name
    );
  }

  return false;
}

/**
 * Whether the product offers custom print on any variant. Used where there is
 * no variant selection yet — e.g. the listing grid, which must send these
 * products to the product page rather than quick-adding them.
 */
export function offersPrint(product: Product): boolean {
  return product.printTriggerValueId !== null;
}

export type PrintDetails = { name: string; number: string };

/**
 * Validate submitted print details. Returns the cleaned values, or the first
 * field that failed so the caller can report it.
 */
export function parsePrintDetails(
  formData: FormData
): { details: PrintDetails } | { error: PrintFieldError } {
  const name = String(formData.get(PRINT_NAME_FIELD) ?? "").trim();
  const number = String(formData.get(PRINT_NUMBER_FIELD) ?? "").trim();

  if (
    !name ||
    name.length > PRINT_NAME_MAX_LENGTH ||
    !NAME_PATTERN.test(name)
  ) {
    return { error: "name" };
  }

  if (!NUMBER_PATTERN.test(number)) {
    return { error: "number" };
  }

  return { details: { name, number } };
}

/** Cart line attributes for a validated set of print details. */
export function printAttributes(
  details: PrintDetails
): { key: string; value: string }[] {
  return [
    { key: PRINT_NAME_KEY, value: details.name },
    { key: PRINT_NUMBER_KEY, value: details.number },
  ];
}
