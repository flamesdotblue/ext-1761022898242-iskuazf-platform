import { useMemo, useState } from "react";
import BananaHeader from "./components/BananaHeader";
import Display from "./components/Display";
import Keypad from "./components/Keypad";
import HistoryPanel from "./components/HistoryPanel";

function endsWithOperator(expr) {
  return /[+\-×÷]$/.test(expr);
}

function replaceLastNumber(expr, newNum) {
  if (!expr) return newNum;
  const match = expr.match(/(-?\d*\.?\d+)(?!.*\d)/);
  if (!match) {
    // No number yet in expression; if it ends with operator, just append
    if (endsWithOperator(expr)) return expr + newNum;
    return newNum;
  }
  const start = match.index ?? 0;
  const end = start + match[0].length;
  return expr.slice(0, start) + newNum + expr.slice(end);
}

function safeEvaluate(expr) {
  let js = expr.replace(/×/g, "*").replace(/÷/g, "/");
  js = js.replace(/\s+/g, "");
  if (!/^[-+*/.\d\s]+$/.test(js)) throw new Error("Invalid expression");
  // Prevent invalid trailing operators
  js = js.replace(/[+\-*/]+$/, "");
  // Evaluate
  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${js || 0})`)();
  if (!isFinite(result)) throw new Error("Math error");
  return result;
}

function formatNumber(n) {
  // Handle very large/small numbers gracefully
  const abs = Math.abs(n);
  let out;
  if ((abs !== 0 && (abs < 1e-6 || abs >= 1e12))) {
    out = n.toExponential(8);
  } else {
    out = Number(n.toFixed(10)).toString();
  }
  return out;
}

export default function App() {
  const [theme, setTheme] = useState("ripe"); // ripe | plantain
  const [expression, setExpression] = useState("");
  const [current, setCurrent] = useState("");
  const [lastPressed, setLastPressed] = useState("none");
  const [history, setHistory] = useState([]);

  const palette = useMemo(() => {
    return theme === "ripe"
      ? {
          bg: "from-yellow-100 via-yellow-200 to-amber-100",
          accent: "bg-yellow-400",
          accentDeep: "bg-amber-500",
          text: "text-amber-900",
          panel: "bg-yellow-50/70",
        }
      : {
          bg: "from-lime-100 via-lime-200 to-emerald-100",
          accent: "bg-lime-400",
          accentDeep: "bg-emerald-500",
          text: "text-emerald-900",
          panel: "bg-lime-50/70",
        };
  }, [theme]);

  const handleNumber = (ch) => {
    setLastPressed("number");
    setCurrent((prev) => {
      let next = prev;
      if (ch === ".") {
        if (!prev) next = "0";
        if (prev.includes(".")) return prev;
      }
      // Prevent leading zeros like 0002
      if (prev === "0" && ch !== ".") next = "";
      next = (next || "") + ch;

      setExpression((expr) => {
        if (!expr || endsWithOperator(expr) || lastPressed === "equal") {
          if (lastPressed === "equal") return ch === "." ? `0${ch}` : ch;
          return (expr || "") + (ch === "." && (!prev || prev === "") ? "0" : "") + ch;
        }
        return replaceLastNumber(expr, next);
      });

      return next;
    });
  };

  const handleOperator = (op) => {
    setLastPressed("operator");
    setExpression((expr) => {
      // If we just computed a result, start with current as the expression
      if (lastPressed === "equal") {
        const base = current || "0";
        return base + op;
      }
      if (!expr && current) return current + op;
      if (!expr) return "0" + op;
      if (endsWithOperator(expr)) return expr.slice(0, -1) + op;
      // Ensure latest current is placed into expression
      if (current) return replaceLastNumber(expr, current) + op;
      return expr + op;
    });
  };

  const handleEquals = () => {
    try {
      let expr = expression;
      if (lastPressed === "operator" && endsWithOperator(expr)) {
        expr = expr.slice(0, -1);
      }
      if (lastPressed === "number") {
        expr = replaceLastNumber(expr, current);
      }
      const result = safeEvaluate(expr);
      const formatted = formatNumber(result);
      setHistory((h) => [{ expr, result: formatted, t: Date.now() }, ...h].slice(0, 25));
      setCurrent(formatted);
      setExpression(expr);
      setLastPressed("equal");
    } catch (e) {
      setCurrent("Error");
      setLastPressed("equal");
    }
  };

  const handleClear = () => {
    setExpression("");
    setCurrent("");
    setLastPressed("none");
  };

  const handleDelete = () => {
    if (lastPressed === "equal") return; // don't mutate result; user can start fresh
    if (lastPressed === "operator") {
      setExpression((expr) => expr.slice(0, -1));
      return;
    }
    setCurrent((prev) => {
      const next = prev.slice(0, -1);
      setExpression((expr) => {
        if (!expr) return expr;
        if (endsWithOperator(expr)) return expr; // shouldn't happen when lastPressed number
        if (next === "") {
          // remove last number entirely
          const m = expr.match(/(-?\d*\.?\d+)(?!.*\d)/);
          if (!m) return expr;
          const start = m.index ?? 0;
          const end = start + m[0].length;
          return expr.slice(0, start) + expr.slice(end);
        }
        return replaceLastNumber(expr, next);
      });
      return next;
    });
  };

  const handlePercent = () => {
    if (!current) return;
    let num = parseFloat(current);
    if (isNaN(num)) return;
    num = num / 100;
    const s = formatNumber(num);
    setCurrent(s);
    setExpression((expr) => replaceLastNumber(expr || "0", s));
    setLastPressed("number");
  };

  const handlePlusMinus = () => {
    if (!current) return;
    if (current === "0") return;
    const s = current.startsWith("-") ? current.slice(1) : "-" + current;
    setCurrent(s);
    setExpression((expr) => replaceLastNumber(expr || "0", s));
    setLastPressed("number");
  };

  const onKey = (key) => {
    if (/^\d$/.test(key)) return handleNumber(key);
    switch (key) {
      case ".":
        return handleNumber(".");
      case "+":
      case "-":
      case "×":
      case "÷":
        return handleOperator(key);
      case "=":
        return handleEquals();
      case "AC":
        return handleClear();
      case "⌫":
        return handleDelete();
      case "%":
        return handlePercent();
      case "±":
        return handlePlusMinus();
      default:
        return;
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${palette.bg} transition-colors duration-500`}> 
      <div className="max-w-md mx-auto px-4 py-6">
        <BananaHeader theme={theme} setTheme={setTheme} palette={palette} />
        <div className={`mt-4 rounded-3xl shadow-xl ring-1 ring-black/5 ${palette.panel} backdrop-blur p-4`}> 
          <div className="relative overflow-hidden rounded-2xl">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rotate-12 rounded-full blur-3xl opacity-50" style={{background: theme === 'ripe' ? 'radial-gradient(circle at 30% 30%, #facc15, #f59e0b)' : 'radial-gradient(circle at 30% 30%, #a3e635, #10b981)'}} />
            <Display palette={palette} expression={expression} current={current || "0"} />
          </div>
          <Keypad onKey={onKey} palette={palette} />
        </div>
        <HistoryPanel history={history} palette={palette} onClear={() => setHistory([])} />
        <p className="mt-6 text-center text-xs text-zinc-500">
          Tip: Use the delicious buttons below. This calculator is slightly banana-flavored 🍌
        </p>
      </div>
    </div>
  );
}
