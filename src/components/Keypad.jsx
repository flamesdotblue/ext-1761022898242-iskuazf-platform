const Button = ({ label, onClick, className = "", ariaLabel }) => (
  <button
    onClick={() => onClick(label)}
    aria-label={ariaLabel || label}
    className={`select-none rounded-2xl p-4 text-lg font-medium shadow-sm active:translate-y-[1px] transition bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 ${className}`}
  >
    {label}
  </button>
);

export default function Keypad({ onKey, palette }) {
  return (
    <div className="mt-2 grid grid-cols-4 gap-3">
      <Button label="AC" onClick={onKey} className="text-rose-600" />
      <Button label="±" onClick={onKey} className="text-amber-600" />
      <Button label="%" onClick={onKey} className="text-amber-600" />
      <Button label="÷" onClick={onKey} className={`${palette.accent} text-white`} />

      <Button label="7" onClick={onKey} />
      <Button label="8" onClick={onKey} />
      <Button label="9" onClick={onKey} />
      <Button label="×" onClick={onKey} className={`${palette.accent} text-white`} />

      <Button label="4" onClick={onKey} />
      <Button label="5" onClick={onKey} />
      <Button label="6" onClick={onKey} />
      <Button label="-" onClick={onKey} className={`${palette.accent} text-white`} />

      <Button label="1" onClick={onKey} />
      <Button label="2" onClick={onKey} />
      <Button label="3" onClick={onKey} />
      <Button label="+" onClick={onKey} className={`${palette.accent} text-white`} />

      <Button label="⌫" onClick={onKey} className="col-span-1 text-amber-700" />
      <Button label="0" onClick={onKey} className="col-span-2" />
      <Button label="." onClick={onKey} />
      <Button label="=" onClick={onKey} className={`col-span-1 ${palette.accentDeep} text-white`} />
    </div>
  );
}
