import { createFileRoute } from "@tanstack/react-router";
import { Award, Plus, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/gpa")({
  head: () => ({
    meta: [
      { title: "GPA Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Calculate your GPA from your courses, grade points and credit hours.",
      },
      { property: "og:title", content: "GPA Calculator — C4TOOLS" },
      { property: "og:description", content: "Credit-weighted GPA on a 4.0 scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GpaTool,
});

interface Course {
  id: number;
  name: string;
  points: string;
  credits: string;
}

let nextId = 4;

function GpaTool() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "", points: "", credits: "" },
    { id: 2, name: "", points: "", credits: "" },
    { id: 3, name: "", points: "", credits: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [gpa, setGpa] = useState<number | null>(null);

  const update = (id: number, patch: Partial<Course>) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const calculate = () => {
    const nextErrors: Record<number, string> = {};
    let totalPoints = 0;
    let totalCredits = 0;

    for (const c of courses) {
      if (c.points.trim() === "" && c.credits.trim() === "") continue;
      const p = Number(c.points);
      const cr = Number(c.credits);
      if (!Number.isFinite(p) || p < 0 || p > 4 || !Number.isFinite(cr) || cr <= 0) {
        nextErrors[c.id] = t("err.number");
        continue;
      }
      totalPoints += p * cr;
      totalCredits += cr;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || totalCredits === 0) {
      setFormError(totalCredits === 0 ? t("err.atLeastOne") : null);
      setGpa(null);
      return;
    }
    setFormError(null);
    setGpa(totalPoints / totalCredits);
  };

  const clearAll = () => {
    setCourses([
      { id: nextId++, name: "", points: "", credits: "" },
      { id: nextId++, name: "", points: "", credits: "" },
      { id: nextId++, name: "", points: "", credits: "" },
    ]);
    setErrors({});
    setFormError(null);
    setGpa(null);
  };

  return (
    <ToolShell title={t("tool.gpa.name")} description={t("tool.gpa.desc")} icon={Award}>
      <div className="space-y-4">
        {courses.map((c, i) => (
          <div key={c.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("gpa.course")} {i + 1}
              </span>
              <button
                type="button"
                aria-label={t("common.remove")}
                onClick={() =>
                  setCourses((prev) => (prev.length > 1 ? prev.filter((x) => x.id !== c.id) : prev))
                }
                disabled={courses.length === 1}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3">
              <TextField
                id={`c-name-${c.id}`}
                label={t("gpa.course")}
                placeholder="Biology"
                value={c.name}
                onChange={(v) => update(c.id, { name: v })}
              />
              <NumberField
                id={`c-pts-${c.id}`}
                label={t("gpa.points")}
                placeholder="3.7"
                value={c.points}
                onChange={(v) => update(c.id, { points: v })}
              />
              <NumberField
                id={`c-cr-${c.id}`}
                label={t("gpa.credits")}
                placeholder="3"
                value={c.credits}
                error={errors[c.id]}
                onChange={(v) => update(c.id, { credits: v })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <SecondaryButton onClick={() => setCourses((p) => [...p, { id: nextId++, name: "", points: "", credits: "" }])}>
          <Plus className="size-4" aria-hidden="true" />
          {t("gpa.addCourse")}
        </SecondaryButton>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
          <SecondaryButton onClick={clearAll}>{t("common.clearAll")}</SecondaryButton>
        </div>
      </div>

      {formError && <p className="mt-4 text-center text-sm text-destructive">{formError}</p>}
      {gpa !== null && <ResultBanner>{t("gpa.your", { value: gpa.toFixed(2) })}</ResultBanner>}
    </ToolShell>
  );
}
