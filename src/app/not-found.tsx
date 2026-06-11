import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl text-sky-blue">404</p>
      <h1 className="mt-4 font-display text-3xl tracking-wide text-deep-sea uppercase">
        Off the pitch
      </h1>
      <p className="mt-4 text-deep-sea/70">
        This page doesn&apos;t exist — but the kit room does.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        Back to the shop
      </Link>
    </div>
  );
}
