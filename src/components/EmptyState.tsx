export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 border-dashed px-8 py-14 text-center">
      <p className="field-label">Nothing here yet</p>
      <p className="max-w-sm text-sm text-ink/60">{label}</p>
    </div>
  );
}
