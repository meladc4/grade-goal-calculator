import { createFileRoute } from "@tanstack/react-router";
import { Plus, Sigma, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/grade-average")({
  head: () => ({
    meta: [
      { title: "Grade Average Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Add all your subjects and instantly calculate your overall grade average.",
      },
      { property: "og:title", content: "Grade Average Calculator — C4TOOLS" },
      {
        property: "og:description",
        content: "Add your subjects and grades to get your average in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GradeAverage,
});

interface Subject {
  id: number;
  name: string;
  grade: string;
}

let nextId = 4;

function GradeAverage() {
  const { t } = useI18n();
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "", grade: "" },
    { id: 2, name: "", grade: "" },
    { id: 3, name: "", grade: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{ average: number; count: number } | null>(null);

  const update = (id: number, patch: Partial<Subject>) =>
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSubject = () => setSubjects((prev) => [...prev, { id: nextId++, name: "", grade: "" }]);

  const removeSubject = (id: number) =>
    setSubjects((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));

  const clearAll = () => {
    setSubjects([
      { id: nextId++, name: "", grade: "" },
      { id: nextId++, name: "", grade: "" },
      { id: nextId++, name: "", grade: "" },
    ]);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const calculate = () => {
    const nextErrors: Record<number, string> = {};
    const grades: number[] = [];

    for (const subject of subjects) {
      const raw = subject.grade.trim();
      if (raw === "") continue;
      const num = Number(raw);
      if (!Number.isFinite(num) || num < 0 || num > 100) {
        nextErrors[subject.id] = t("err.range0100");
      } else {
        grades.push(num);
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || grades.length === 0) {
      setFormError(grades.length === 0 ? t("err.atLeastOne") : null);
      setResult(null);
      return;
    }

    setFormError(null);
    const sum = grades.reduce((acc, g) => acc + g, 0);
    setResult({ average: sum / grades.length, count: grades.length });
  };

  const format = (value: number) => {
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
  };

  return (
    <ToolShell title={t("tool.average.name")} description={t("tool.average.desc")} icon={Sigma}>
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div key={subject.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("average.subject")} {index + 1}
              </span>
              <button
                type="button"
                aria-label={t("average.removeSubject")}
                onClick={() => removeSubject(subject.id)}
                disabled={subjects.length === 1}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3">
              <TextField
                id={`name-${subject.id}`}
                label={t("average.subjectName")}
                placeholder="Math"
                value={subject.name}
                onChange={(v) => update(subject.id, { name: v })}
              />
              <NumberField
                id={`grade-${subject.id}`}
                label={t("average.grade")}
                suffix="%"
                placeholder="92"
                value={subject.grade}
                error={errors[subject.id]}
                onChange={(v) => update(subject.id, { grade: v })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <SecondaryButton onClick={addSubject}>
          <Plus className="size-4" aria-hidden="true" />
          {t("average.addSubject")}
        </SecondaryButton>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
          <SecondaryButton onClick={clearAll}>{t("common.clearAll")}</SecondaryButton>
        </div>
      </div>

      {formError && <p className="mt-4 text-center text-sm text-destructive">{formError}</p>}

      {result && (
        <>
          <ResultBanner>{t("average.your", { value: format(result.average) })}</ResultBanner>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("average.count", { count: result.count })}
          </p>
        </>
      )}
    </ToolShell>
  );
}
