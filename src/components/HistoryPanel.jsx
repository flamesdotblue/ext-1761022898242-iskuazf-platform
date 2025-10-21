import { useState } from "react";

function Row({ item }) {
  const date = new Date(item.t);
  return (
    <div className="flex items-baseline justify-between py-2">
      <div className="truncate text-zinc-600 text-sm">{item.expr}</div>
      <div className="ml-3 shrink-0 tabular-nums font-medium">{item.result}</div>
    </div>
  );
}

export default function HistoryPanel({ history, onClear, palette }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <button
          className={`rounded-full px-3 py-1 text-sm font-medium ${palette.accent} text-white shadow hover:brightness-110 active:scale-[0.98] transition`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"} History
        </button>
        <button
          className="text-xs text-zinc-500 hover:text-zinc-700"
          onClick={onClear}
          disabled={history.length === 0}
        >
          Clear
        </button>
      </div>
      {open && (
        <div className={`mt-3 rounded-2xl ${palette.panel} ring-1 ring-black/5 p-3 max-h-60 overflow-auto`}> 
          {history.length === 0 ? (
            <p className="text-center text-sm text-zinc-400">No history yet</p>
          ) : (
            history.map((h) => <Row key={h.t + h.expr} item={h} />)
          )}
        </div>
      )}
    </section>
  );
}
