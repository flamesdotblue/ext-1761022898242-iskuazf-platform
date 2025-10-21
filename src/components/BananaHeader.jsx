export default function BananaHeader({ theme, setTheme, palette }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>🍌</span>
        <div>
          <h1 className={`text-xl font-semibold ${palette.text}`}>BananaCalc</h1>
          <p className="text-xs text-zinc-500 -mt-0.5">Appealing arithmetic</p>
        </div>
      </div>
      <button
        onClick={() => setTheme(theme === "ripe" ? "plantain" : "ripe")}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white shadow ${palette.accentDeep} hover:brightness-110 active:scale-[0.98] transition`}
        aria-label="Toggle banana ripeness"
      >
        {theme === "ripe" ? "Ripe" : "Plantain"}
      </button>
    </header>
  );
}
