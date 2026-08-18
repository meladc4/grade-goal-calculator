import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/grade-calculator")({
  head: () => ({
    meta: [
      { title: "Grade Calculator — C4TOOLS" },
      {
        name: "description",
        content:
          "Work out exactly what score you need on your final exam to reach your target grade.",
      },
      { property: "og:title", content: "Grade Calculator — C4TOOLS" },
      {
        property: "og:description",
        content: "Find the final exam score you need to hit your target grade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GradeCalculator,
});

interface FormState {
  currentGrade: string;
  examWeight: string;
  desiredGrade: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface CalculationResult {
  message: string;
  status: "possible" | "already-there" | "impossible";
}

function GradeCalculator() {
  const { t } = useI18n();
  const [values, setValues] = useState<FormState>({
    currentGrade: "",
    examWeight: "",
    desiredGrade: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    currentGrade: false,
    examWeight: false,
    desiredGrade: false,
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const parsePercent = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const num = Number(trimmed);
    if (!Number.isFinite(num)) return null;
    return num;
  };

  const validate = (next: FormState): FormErrors => {
    const nextErrors: FormErrors = {};

    const current = parsePercent(next.currentGrade);
    if (current === null || current < 0 || current > 100) {
      nextErrors.currentGrade = t("err.range0100");
    }

    const weight = parsePercent(next.examWeight);
    if (weight === null || weight <= 0 || weight > 100) {
      nextErrors.examWeight = t("err.weight");
    }

    const desired = parsePercent(next.desiredGrade);
    if (desired === null || desired < 0 || desired > 100) {
      nextErrors.desiredGrade = t("err.range0100");
    }

    return nextErrors;
  };

  const handleChange = (field: keyof FormState) => (value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setErrors(validate(next));
  };

  const handleBlur = (field: keyof FormState) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const calculate = () => {
    setTouched({ currentGrade: true, examWeight: true, desiredGrade: true });
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    const current = parsePercent(values.currentGrade)!;
    const weight = parsePercent(values.examWeight)!;
    const desired = parsePercent(values.desiredGrade)!;

    const weightDecimal = weight / 100;
    const required = (desired - current * (1 - weightDecimal)) / weightDecimal;

    if (required <= 0) {
      setResult({ message: t("grade.already"), status: "already-there" });
    } else if (required > 100) {
      setResult({ message: t("grade.impossible"), status: "impossible" });
    } else {
      const rounded = Math.round(required * 10) / 10;
      const formatted = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
      setResult({ message: t("grade.need", { value: formatted }), status: "possible" });
    }
  };

  const reset = () => {
    setValues({ currentGrade: "", examWeight: "", desiredGrade: "" });
    setErrors({});
    setTouched({ currentGrade: false, examWeight: false, desiredGrade: false });
    setResult(null);
  };

  return (
    <ToolShell
      title={t("tool.grade.name")}
      description={t("tool.grade.desc")}
      icon={GraduationCap}
      footnote={t("grade.formula")}
    >
      <div className="space-y-5">
        <NumberField
          id="currentGrade"
          label={t("grade.current")}
          suffix="%"
          placeholder="87"
          value={values.currentGrade}
          error={touched.currentGrade ? errors.currentGrade : undefined}
          onChange={handleChange("currentGrade")}
          onBlur={handleBlur("currentGrade")}
        />
        <NumberField
          id="examWeight"
          label={t("grade.weight")}
          suffix="%"
          placeholder="30"
          value={values.examWeight}
          error={touched.examWeight ? errors.examWeight : undefined}
          onChange={handleChange("examWeight")}
          onBlur={handleBlur("examWeight")}
        />
        <NumberField
          id="desiredGrade"
          label={t("grade.desired")}
          suffix="%"
          placeholder="90"
          value={values.desiredGrade}
          error={touched.desiredGrade ? errors.desiredGrade : undefined}
          onChange={handleChange("desiredGrade")}
          onBlur={handleBlur("desiredGrade")}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
        <SecondaryButton onClick={reset}>{t("common.reset")}</SecondaryButton>
      </div>

      {result && (
        <ResultBanner
          tone={
            result.status === "already-there"
              ? "success"
              : result.status === "impossible"
                ? "destructive"
                : "result"
          }
        >
          {result.message}
        </ResultBanner>
      )}
    </ToolShell>
  );
}
