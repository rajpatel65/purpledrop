export function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 rounded-full bg-violet opacity-30" />
          <span className="absolute inset-0 animate-ping rounded-full bg-violet opacity-40" />
          <span className="absolute inset-[35%] rounded-full bg-violet" />
        </div>
        <p className="text-sm font-medium uppercase tracking-wider text-ink-faint">purpleDrop</p>
      </div>
    </div>
  );
}
