import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";
import { GRADE_SCALE, percentToLetter } from "@/lib/tools";

export const Route = createFileRoute("/grade-converter")({
  head: () => ({
    meta: [
      { title: "Grade Converter — C4TOOLS" },
      { name: "description", content: "Convert a percentage grade into a letter grade." },
      { property: "og:title", content: "Grade Converter — C4TOOLS" },
      { property: "og:description", content: "Percentage to letter grade, instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConverterTool,
});

function ConverterTool() {
  const { t } = useI18n();
  const [percent, setPercent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [letter, setLetter] = useState<string | null>(null);

  const calculate = () => {
    const p = Number(percent);
    if (percent.trim() === "" || !Number.isFinite(p) || p < 0 || p > 100) {
      setError(t("err.range0100"));
      setLetter(null);
      return;
    }
    setError(null);
    setLetter(percentToLetter(p));
  };

  return (
    <ToolShell title={t("tool.converter.name")} description={t("tool.converter.desc")} icon={ArrowLeftRight}>
      <NumberField
        id="conv"
        label={t("converter.percentage")}
        suffix="%"
        placeholder="91"
        value={percent}
        error={error ?? undefined}
        onChange={setPercent}
      />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={calculate}>{t("common.calculate")}</PrimaryButton>
        <SecondaryButton
          onClick={() => {
            setPercent("");
            setLetter(null);
            setError(null);
          }}
        >
          {t("common.reset")}
        </SecondaryButton>
      </div>
      {letter && <ResultBanner>{t("converter.letter", { value: letter })}</ResultBanner>}

      <div className="mt-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("converter.scale")}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {GRADE_SCALE.map((band) => (
            <li
              key={band.letter}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
            >
              <span className="font-semibold text-foreground">{band.letter}</span>
              <span className="text-muted-foreground">{band.min}%+</span>
            </li>
          ))}
        </ul>
      </div>
    </ToolShell>
  );
}
