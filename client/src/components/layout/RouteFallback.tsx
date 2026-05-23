export function RouteFallback() {
  return (
    <div className="grid min-h-[320px] place-items-center">
      <div className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-sm text-text-tertiary backdrop-blur-xl">
        <span className="h-2 w-2 rounded-full bg-primary/75 shadow-[0_0_10px_rgba(103,232,249,0.18)]" />
        Loading workspace
      </div>
    </div>
  );
}
