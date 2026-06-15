import { addItem } from "@/app/[locale]/cart/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductVariant } from "@/lib/shopify/types";

export function AddToCart({
  variant,
  locale,
  dict,
}: {
  variant: ProductVariant | null;
  locale: Locale;
  dict: Dictionary;
}) {
  const available = Boolean(variant?.availableForSale);

  return (
    <form
      action={variant ? addItem.bind(null, locale, variant.id) : undefined}
    >
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
