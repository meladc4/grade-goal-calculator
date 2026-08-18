import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/target-grade")({
  head: () => ({
    meta: [
      { title: "Target Grade Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Find the score you need on an upcoming assessment to hit your target grade.",
      },
      { property: "og:title", content: "Target Grade Calculator — C4TOOLS" },
      { property: "og:description", content: "The score you need on your next assessment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TargetTool,
});

function TargetTool() {
  const { t } = useI18n();
  const [current, setCurrent] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; tone: "result" | "success" | "destructive" } | null>(null);

  const calculate = () => {
    const c = Number(current);
    const w = Number(weight);
    const g = Number(target);
    const valid =
      current.trim() !== "" &&
      weight.trim() !== "" &&
      target.trim() !== "" &&
      Number.isFinite(c) && c >= 0 && c <= 100 &&
      Number.isFinite(w) && w > 0 && w <= 100 &&
      Number.isFinite(g) && g >= 0 && g <= 100;

    if (!valid) {
      setError(t("err.range0100"));
      setResult(null);
      return;
    }
    setError(null);
    const wd = w / 100;
    const required = (g - c * (1 - wd)) / wd;
    if (required <= 0) setResult({ message: t("grade.already"), tone: "success" });
    else if (required > 100) setResult({ message: t("grade.impossible"), tone: "destructive" });
    else {
      const r = Math.round(required * 10) / 10;
      setResult({
        message: t("target.need", { value: Number.isInteger(r) ? r : r.toFixed(1) }),
        tone: "result",
      });
    }
  };

  const reset = () => {
    setCurrent("");
    setWeight("");
    setTarget("");
    setError(null);
    setResult(null);
  };

  return (
    <ToolShell title={t("tool.target.name")} description={t("tool.target.desc")} icon={Target}>
      <div className="space-y-5">
        <NumberField id="t-current" label={t("grade.current")} suffix="%" placeholder="78" value={current} onChange={setCurrent} />
        <NumberField id="t-weight" label={t("target.assessmentWeight")} suffix="%" placeholder="25" value={weight} onChange={setWeight} />
        <NumberField id="t-target" label={t("grade.desired")} suffix="%" placeholder="85" value={target} onChange={setTarget} />
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
        <SecondaryButton onClick={reset}>{t("common.reset")}</SecondaryButton>
      </div>
      {result && <ResultBanner tone={result.tone}>{result.message}</ResultBanner>}
    </ToolShell>
  );
}
