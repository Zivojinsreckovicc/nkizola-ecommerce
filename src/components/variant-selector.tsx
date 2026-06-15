import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/shopify/types";

type Props = {
  product: Product;
  selectedOptions: Record<string, string>;
  locale: Locale;
};

/**
 * Option values are encoded in the URL query string so variant selection
 * stays server-rendered and shareable (e.g. /products/jersey?size=M).
 */
export function VariantSelector({ product, selectedOptions, locale }: Props) {
  const options = product.options.filter(
    (option) => option.values.length > 1 || option.name !== "Title"
  );

  if (options.length === 0) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-2 text-sm font-semibold tracking-wide uppercase">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const params = new URLSearchParams(selectedOptions);
              params.set(option.name, value);

              const isAvailable = product.variants.some(
                (variant) =>
                  variant.availableForSale &&
                  variant.selectedOptions.every(
                    (selected) =>
                      selected.name === option.name
                        ? selected.value === value
                        : selectedOptions[selected.name] === selected.value
                  )
              );

              return (
                <Link
                  key={value}
                  href={`${localizePath(locale, `/products/${product.handle}`)}?${params}`}
                  replace
                  scroll={false}
                  aria-current={isSelected ? "true" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-deep-sea bg-deep-sea text-sand"
                      : "border-deep-sea/30 bg-white text-ink hover:border-deep-sea"
                  } ${isAvailable ? "" : "opacity-40"}`}
                >
                  {value}
                </Link>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
