import { addItem } from "@/app/[locale]/cart/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  PRINT_NAME_FIELD,
  PRINT_NAME_MAX_LENGTH,
  PRINT_NUMBER_FIELD,
  PRINT_NUMBER_MAX_LENGTH,
  requiresPrintDetails,
  RETURN_TO_FIELD,
  type PrintFieldError,
} from "@/lib/personalization";
import type { Product, ProductVariant } from "@/lib/shopify/types";

/** Applied to both print inputs; the border turns red on the failing field. */
function fieldClass(invalid: boolean): string {
  return [
    "mt-1 w-full rounded-lg bg-white px-3 py-2 text-ink placeholder:text-ink/35",
    "border focus:outline-none",
    invalid
      ? "border-red-600 focus:border-red-600"
      : "border-deep-sea/30 focus:border-deep-sea",
  ].join(" ");
}

/**
 * Custom print inputs. Only rendered for products that opt in via the
 * `custom.print_trigger` metafield, and only while the print variant is the
 * one selected — see `requiresPrintDetails`.
 */
function PrintFields({
  dict,
  error,
}: {
  dict: Dictionary;
  error: PrintFieldError | null;
}) {
  return (
    <fieldset className="mb-6 rounded-xl border border-deep-sea/15 bg-white p-5">
      <legend className="px-2 font-display text-sm tracking-wide text-deep-sea uppercase">
        {dict.print.legend}
      </legend>

      <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem]">
        <div>
          <label htmlFor="print-name" className="text-sm font-medium text-ink">
            {dict.print.nameLabel}
          </label>
          <input
            id="print-name"
            name={PRINT_NAME_FIELD}
            type="text"
            required
            maxLength={PRINT_NAME_MAX_LENGTH}
            autoComplete="off"
            placeholder={dict.print.namePlaceholder}
            aria-describedby="print-hint"
            aria-invalid={error === "name" || undefined}
            className={fieldClass(error === "name")}
          />
        </div>

        <div>
          <label htmlFor="print-number" className="text-sm font-medium text-ink">
            {dict.print.numberLabel}
          </label>
          <input
            id="print-number"
            name={PRINT_NUMBER_FIELD}
            type="text"
            inputMode="numeric"
            required
            maxLength={PRINT_NUMBER_MAX_LENGTH}
            pattern="[0-9]{1,2}"
            autoComplete="off"
            placeholder={dict.print.numberPlaceholder}
            aria-invalid={error === "number" || undefined}
            className={fieldClass(error === "number")}
          />
        </div>
      </div>

      <p id="print-hint" className="mt-3 text-xs text-ink/60">
        {dict.print.hint.replace("{max}", String(PRINT_NAME_MAX_LENGTH))}
      </p>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error === "name"
            ? dict.print.errorName.replace(
                "{max}",
                String(PRINT_NAME_MAX_LENGTH)
              )
            : dict.print.errorNumber}
        </p>
      )}
    </fieldset>
  );
}

export function AddToCart({
  product,
  variant,
  locale,
  dict,
  returnTo,
  error,
}: {
  product: Product;
  variant: ProductVariant | null;
  locale: Locale;
  dict: Dictionary;
  /** Product page path + query, so a rejected submission can come back here. */
  returnTo: string;
  error: PrintFieldError | null;
}) {
  const available = Boolean(variant?.availableForSale);
  const needsPrint = requiresPrintDetails(product, variant);

  return (
    <form
      action={
        variant
          ? addItem.bind(null, locale, product.handle, variant.id)
          : undefined
      }
    >
      <input type="hidden" name={RETURN_TO_FIELD} value={returnTo} />

      {needsPrint && <PrintFields dict={dict} error={error} />}

      <SubmitButton
        disabled={!available}
        pendingText={dict.common.adding}
        className="w-full rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        {available ? dict.common.addToCart : dict.common.soldOut}
      </SubmitButton>
    </form>
  );
}
