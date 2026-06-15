import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function Loading() {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex items-center justify-center py-32">
      <div
        aria-label={dict.common.loading}
        role="status"
        className="size-10 animate-spin rounded-full border-4 border-sky-blue border-t-deep-sea"
      />
    </div>
  );
}
