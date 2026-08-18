import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Basic Calculator — C4TOOLS" },
      { name: "description", content: "A clean, fast calculator for everyday arithmetic." },
      { property: "og:title", content: "Basic Calculator — C4TOOLS" },
      { property: "og:description", content: "Simple arithmetic, no clutter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BasicCalculator,
});

type Op = "+" | "-" | "×" | "÷";

function apply(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

function BasicCalculator() {
  const { t } = useI18n();
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op | null>(null);
  const [freshEntry, setFreshEntry] = useState(true);

  const inputDigit = (d: string) => {
    setDisplay((prev) => (freshEntry || prev === "0" ? d : prev + d));
    setFreshEntry(false);
  };

  const inputDot = () => {
    if (freshEntry) {
      setDisplay("0.");
      setFreshEntry(false);
      return;
    }
    setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
  };

  const chooseOp = (op: Op) => {
    const current = Number(display);
    if (accumulator !== null && pendingOp && !freshEntry) {
      const result = apply(accumulator, current, pendingOp);
      setAccumulator(result);
      setDisplay(Number.isFinite(result) ? String(result) : "Error");
    } else {
      setAccumulator(current);
    }
    setPendingOp(op);
    setFreshEntry(true);
  };

  const equals = () => {
    if (accumulator === null || !pendingOp) return;
    const result = apply(accumulator, Number(display), pendingOp);
    setDisplay(Number.isFinite(result) ? String(Math.round(result * 1e10) / 1e10) : "Error");
    setAccumulator(null);
    setPendingOp(null);
    setFreshEntry(true);
  };

  const clear = () => {
    setDisplay("0");
    setAccumulator(null);
    setPendingOp(null);
    setFreshEntry(true);
  };

  const toggleSign = () =>
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? prev : "-" + prev));

  const percentKey = () => {
    const v = Number(display) / 100;
    setDisplay(String(v));
    setFreshEntry(true);
  };

  const key =
    "inline-flex h-14 items-center justify-center rounded-xl text-lg font-semibold transition-colors active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <ToolShell title={t("tool.calculator.name")} description={t("tool.calculator.desc")} icon={Calculator}>
      <div
        dir="ltr"
        className="mb-4 rounded-xl border border-border bg-background px-4 py-5 text-end text-4xl font-bold tabular-nums text-foreground"
      >
        {display}
      </div>

      <div dir="ltr" className="grid grid-cols-4 gap-2">
        <button type="button" onClick={clear} className={`${key} bg-muted text-foreground`}>AC</button>
        <button type="button" onClick={toggleSign} className={`${key} bg-muted text-foreground`}>+/−</button>
        <button type="button" onClick={percentKey} className={`${key} bg-muted text-foreground`}>%</button>
        <button type="button" onClick={() => chooseOp("÷")} className={`${key} bg-primary text-primary-foreground`}>÷</button>

        {["7", "8", "9"].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)} className={`${key} bg-card border border-border text-foreground`}>{d}</button>
        ))}
        <button type="button" onClick={() => chooseOp("×")} className={`${key} bg-primary text-primary-foreground`}>×</button>

        {["4", "5", "6"].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)} className={`${key} bg-card border border-border text-foreground`}>{d}</button>
        ))}
        <button type="button" onClick={() => chooseOp("-")} className={`${key} bg-primary text-primary-foreground`}>−</button>

        {["1", "2", "3"].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)} className={`${key} bg-card border border-border text-foreground`}>{d}</button>
        ))}
        <button type="button" onClick={() => chooseOp("+")} className={`${key} bg-primary text-primary-foreground`}>+</button>

        <button type="button" onClick={() => inputDigit("0")} className={`${key} col-span-2 bg-card border border-border text-foreground`}>0</button>
        <button type="button" onClick={inputDot} className={`${key} bg-card border border-border text-foreground`}>.</button>
        <button type="button" onClick={equals} className={`${key} bg-primary text-primary-foreground`}>=</button>
      </div>
    </ToolShell>
  );
}
