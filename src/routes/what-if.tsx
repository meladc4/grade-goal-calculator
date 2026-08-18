import { createFileRoute } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/what-if")({
  head: () => ({
    meta: [
      { title: "What-If Grade Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Test hypothetical grades and see how they would change your average.",
      },
      { property: "og:title", content: "What-If Grade Calculator — C4TOOLS" },
      { property: "og:description", content: "See how a new grade would move your average." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhatIfTool,
});

function WhatIfTool() {
  const { t } = useI18n();
  const [avg, setAvg] = useState("");
  const [count, setCount] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const a = Number(avg);
    const n = Number(count);
    const g = Number(newGrade);
    const valid =
      avg.trim() !== "" && count.trim() !== "" && newGrade.trim() !== "" &&
      Number.isFinite(a) && a >= 0 && a <= 100 &&
      Number.isFinite(n) && n >= 1 && Number.isInteger(n) &&
      Number.isFinite(g) && g >= 0 && g <= 100;
    if (!valid) {
      setError(t("err.range0100"));
      setResult(null);
      return;
    }
    setError(null);
    const next = (a * n + g) / (n + 1);
    const rounded = Math.round(next * 100) / 100;
    setResult(
      t("whatif.result", {
        value: Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2),
      })
    );
  };

  const reset = () => {
    setAvg("");
    setCount("");
    setNewGrade("");
    setError(null);
    setResult(null);
  };

  return (
    <ToolShell title={t("tool.whatif.name")} description={t("tool.whatif.desc")} icon={Shuffle}>
      <div className="space-y-5">
        <NumberField id="wi-avg" label={t("whatif.currentAverage")} suffix="%" placeholder="88" value={avg} onChange={setAvg} />
        <NumberField id="wi-count" label={t("whatif.gradesSoFar")} placeholder="4" value={count} onChange={setCount} />
        <NumberField id="wi-new" label={t("whatif.newGrade")} suffix="%" placeholder="95" value={newGrade} onChange={setNewGrade} />
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
        <SecondaryButton onClick={reset}>{t("common.reset")}</SecondaryButton>
      </div>
      {result && <ResultBanner>{result}</ResultBanner>}
    </ToolShell>
  );
}
