import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Money } from "@/lib/shopify/types";
import { formatPrice, isDiscounted } from "@/lib/utils";

/**
 * A price, followed by the struck-through compare-at price when the item is
 * marked down in Shopify. Strikethrough isn't announced by screen readers, so
 * each figure carries a visually hidden label.
 */
export function Price({
  price,
  compareAtPrice,
  locale,
  dict,
  className = "",
}: {
  price: Money;
  compareAtPrice: Money | null;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  if (!isDiscounted(price, compareAtPrice)) {
    return <p className={className}>{formatPrice(price, locale)}</p>;
  }

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span>
        <span className="sr-only">{dict.common.salePrice}: </span>
        {formatPrice(price, locale)}
      </span>
      <s className="text-[0.8em] font-normal text-ink/60">
        <span className="sr-only">{dict.common.regularPrice}: </span>
        {formatPrice(compareAtPrice, locale)}
      </s>
    </p>
  );
}
