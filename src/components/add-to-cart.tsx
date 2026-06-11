import { addItem } from "@/app/cart/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ProductVariant } from "@/lib/shopify/types";

export function AddToCart({ variant }: { variant: ProductVariant | null }) {
  const available = Boolean(variant?.availableForSale);

  return (
    <form action={variant ? addItem.bind(null, variant.id) : undefined}>
      <SubmitButton
        disabled={!available}
        pendingText="Adding…"
        className="w-full rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        {available ? "Add to cart" : "Sold out"}
      </SubmitButton>
    </form>
  );
}
