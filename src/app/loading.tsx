export default function Loading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div
        aria-label="Loading"
        role="status"
        className="size-10 animate-spin rounded-full border-4 border-sky-blue border-t-deep-sea"
      />
    </div>
  );
}
