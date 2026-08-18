import { createFileRoute } from "@tanstack/react-router";
import { Plus, Scale, Trash2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  NumberField,
  PrimaryButton,
  ResultBanner,
  SecondaryButton,
  TextField,
  ToolShell,
} from "@/components/ui-kit";

export const Route = createFileRoute("/weighted-grade")({
  head: () => ({
    meta: [
      { title: "Weighted Grade Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Combine assignments and categories with different weights into one grade.",
      },
      { property: "og:title", content: "Weighted Grade Calculator — C4TOOLS" },
      { property: "og:description", content: "Work out your grade across weighted categories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeightedTool,
});

interface Row {
  id: number;
  name: string;
  score: string;
  weight: string;
}

let nextId = 4;

function WeightedTool() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: "", score: "", weight: "" },
    { id: 2, name: "", score: "", weight: "" },
    { id: 3, name: "", score: "", weight: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{ grade: number; totalWeight: number } | null>(null);

  const update = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const calculate = () => {
    const nextErrors: Record<number, string> = {};
    let weighted = 0;
    let totalWeight = 0;

    for (const r of rows) {
      if (r.score.trim() === "" && r.weight.trim() === "") continue;
      const s = Number(r.score);
      const w = Number(r.weight);
      if (!Number.isFinite(s) || s < 0 || s > 100 || !Number.isFinite(w) || w <= 0) {
        nextErrors[r.id] = t("err.range0100");
        continue;
      }
      weighted += s * w;
      totalWeight += w;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || totalWeight === 0) {
      setFormError(totalWeight === 0 ? t("err.atLeastOne") : null);
      setResult(null);
      return;
    }
    setFormError(null);
    setResult({ grade: weighted / totalWeight, totalWeight });
  };

  const clearAll = () => {
    setRows([
      { id: nextId++, name: "", score: "", weight: "" },
      { id: nextId++, name: "", score: "", weight: "" },
      { id: nextId++, name: "", score: "", weight: "" },
    ]);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const fmt = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(2));

  return (
    <ToolShell title={t("tool.weighted.name")} description={t("tool.weighted.desc")} icon={Scale}>
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={r.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("weighted.category")} {i + 1}
              </span>
              <button
                type="button"
                aria-label={t("common.remove")}
                onClick={() =>
                  setRows((prev) => (prev.length > 1 ? prev.filter((x) => x.id !== r.id) : prev))
                }
                disabled={rows.length === 1}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3">
              <TextField
                id={`w-name-${r.id}`}
                label={t("weighted.category")}
                placeholder="Homework"
                value={r.name}
                onChange={(v) => update(r.id, { name: v })}
              />
              <NumberField
                id={`w-score-${r.id}`}
                label={t("weighted.score")}
                suffix="%"
                placeholder="88"
                value={r.score}
                onChange={(v) => update(r.id, { score: v })}
              />
              <NumberField
                id={`w-weight-${r.id}`}
                label={t("weighted.weight")}
                suffix="%"
                placeholder="20"
                value={r.weight}
                error={errors[r.id]}
                onChange={(v) => update(r.id, { weight: v })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <SecondaryButton onClick={() => setRows((p) => [...p, { id: nextId++, name: "", score: "", weight: "" }])}>
          <Plus className="size-4" aria-hidden="true" />
          {t("weighted.addCategory")}
        </SecondaryButton>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
          <SecondaryButton onClick={clearAll}>{t("common.clearAll")}</SecondaryButton>
        </div>
      </div>

      {formError && <p className="mt-4 text-center text-sm text-destructive">{formError}</p>}
      {result && (
        <>
          <ResultBanner>{t("weighted.your", { value: fmt(result.grade) })}</ResultBanner>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("weighted.totalWeight", { value: fmt(result.totalWeight) })}
          </p>
        </>
      )}
    </ToolShell>
  );
}
