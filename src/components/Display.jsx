export default function Display({ expression, current, palette }) {
  return (
    <div className="p-4">
      <div className="text-right">
        <div className="min-h-[24px] text-zinc-500 text-sm truncate">{expression || ""}</div>
        <div className={`mt-1 text-4xl font-semibold tabular-nums tracking-tight ${palette.text}`}>{current}</div>
      </div>
    </div>
  );
}
