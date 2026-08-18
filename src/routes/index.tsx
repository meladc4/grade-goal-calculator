import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C4TOOLS — Grade Calculator" },
      {
        name: "description",
        content:
          "C4TOOLS Grade Calculator helps students find exactly what they need on their final exam to reach their target grade.",
      },
      {
        property: "og:title",
        content: "C4TOOLS — Grade Calculator",
      },
      {
        property: "og:description",
        content:
          "Find out exactly what you need on your final exam with C4TOOLS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

interface FormState {
  currentGrade: string;
  examWeight: string;
  desiredGrade: string;
}

interface FormErrors {
  currentGrade?: string;
  examWeight?: string;
  desiredGrade?: string;
}

interface CalculationResult {
  value: number;
  message: string;
  status: "possible" | "already-there" | "impossible";
}

function Index() {
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
    if (current === null) {
      nextErrors.currentGrade = "Enter a number between 0 and 100.";
    } else if (current < 0 || current > 100) {
      nextErrors.currentGrade = "Current grade must be between 0 and 100.";
    }

    const weight = parsePercent(next.examWeight);
    if (weight === null) {
      nextErrors.examWeight = "Enter a number greater than 0 and at most 100.";
    } else if (weight <= 0 || weight > 100) {
      nextErrors.examWeight = "Exam weight must be greater than 0 and at most 100.";
    }

    const desired = parsePercent(next.desiredGrade);
    if (desired === null) {
      nextErrors.desiredGrade = "Enter a number between 0 and 100.";
    } else if (desired < 0 || desired > 100) {
      nextErrors.desiredGrade = "Desired grade must be between 0 and 100.";
    }

    return nextErrors;
  };

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value;
    // Allow only digits, one decimal point, and a leading minus (though 0-100
    // means it will be rejected by validation). This keeps the keyboard friendly
    // and prevents letters/symbols.
    const sanitized = raw.replace(/[^0-9.]/g, "");
    const next = { ...values, [field]: sanitized };
    setValues(next);
    setErrors(validate(next));
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const calculate = () => {
    const allTouched: Record<keyof FormState, boolean> = {
      currentGrade: true,
      examWeight: true,
      desiredGrade: true,
    };
    setTouched(allTouched);

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
    const required =
      (desired - current * (1 - weightDecimal)) / weightDecimal;

    let message: string;
    let status: CalculationResult["status"];

    if (required <= 0) {
      message = "You've already reached your target.";
      status = "already-there";
    } else if (required > 100) {
      message = "This target isn't mathematically possible with this exam.";
      status = "impossible";
    } else {
      const rounded = Math.round(required * 10) / 10;
      const formatted = Number.isInteger(rounded)
        ? rounded.toString()
        : rounded.toFixed(1);
      message = `You need ${formatted}% on your final exam.`;
      status = "possible";
    }

    setResult({ value: required, message, status });
  };

  const reset = () => {
    setValues({ currentGrade: "", examWeight: "", desiredGrade: "" });
    setErrors({});
    setTouched({
      currentGrade: false,
      examWeight: false,
      desiredGrade: false,
    });
    setResult(null);
  };

  const resultColor = useMemo(() => {
    if (!result) return "bg-primary";
    switch (result.status) {
      case "already-there":
        return "bg-success";
      case "impossible":
        return "bg-destructive";
      case "possible":
      default:
        return "bg-result";
    }
  }, [result]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              C4TOOLS
            </h1>
            <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">
              Grade Calculator
            </p>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Find out exactly what you need on your final exam.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="space-y-5">
              <NumberField
                id="currentGrade"
                label="Current Grade"
                suffix="%"
                placeholder="0"
                value={values.currentGrade}
                error={touched.currentGrade ? errors.currentGrade : undefined}
                onChange={handleChange("currentGrade")}
                onBlur={handleBlur("currentGrade")}
              />

              <NumberField
                id="examWeight"
                label="Final Exam Weight"
                suffix="%"
                placeholder="0"
                value={values.examWeight}
                error={touched.examWeight ? errors.examWeight : undefined}
                onChange={handleChange("examWeight")}
                onBlur={handleBlur("examWeight")}
              />

              <NumberField
                id="desiredGrade"
                label="Desired Final Grade"
                suffix="%"
                placeholder="0"
                value={values.desiredGrade}
                error={touched.desiredGrade ? errors.desiredGrade : undefined}
                onChange={handleChange("desiredGrade")}
                onBlur={handleBlur("desiredGrade")}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={calculate}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background px-6 text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
              >
                Reset
              </button>
            </div>

            {/* Result */}
            {result && (
              <div
                className={`mt-6 rounded-xl p-5 text-center ${resultColor} text-primary-foreground animate-in fade-in slide-in-from-bottom-2 duration-300`}
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-medium opacity-90">Result</p>
                <p className="mt-1 text-xl font-bold leading-snug sm:text-2xl">
                  {result.message}
                </p>
              </div>
            )}
          </div>

          {/* Formula hint */}
          <p className="mt-6 text-center text-xs text-muted-foreground sm:text-sm">
            Required Exam Grade = (Target − Current × (1 − Weight)) ÷ Weight
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          © 2026 C4TOOLS — Created by Melad
        </p>
      </footer>
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  suffix: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

function NumberField({
  id,
  label,
  suffix,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: NumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground sm:text-base"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="block w-full rounded-xl border border-input bg-background px-4 py-3.5 text-lg font-semibold text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none sm:text-xl"
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-base font-medium text-muted-foreground sm:text-lg">
          {suffix}
        </span>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
