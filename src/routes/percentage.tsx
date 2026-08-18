import { createFileRoute } from "@tanstack/react-router";
import { Percent } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/percentage")({
  head: () => ({
    meta: [
      { title: "Percentage Calculator — C4TOOLS" },
      {
        name: "description",
        content: "Calculate percentages of a value and percentage increase or decrease.",
      },
      { property: "og:title", content: "Percentage Calculator — C4TOOLS" },
      { property: "og:description", content: "Percentages and percentage change, instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PercentageTool,
});

const num = (v: string): number | null => {
  const trimmed = v.trim();
  if (trimmed === "" || trimmed === "-") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

function format(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
}

function PercentageTool() {
  const { t } = useI18n();
  const [percent, setPercent] = useState("");
  const [value, setValue] = useState("");
  const [ofResult, setOfResult] = useState<string | null>(null);
  const [ofError, setOfError] = useState<string | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [changeResult, setChangeResult] = useState<string | null>(null);
  const [changeError, setChangeError] = useState<string | null>(null);

  const calcOf = () => {
    const p = num(percent);
    const v = num(value);
    if (p === null || v === null) {
      setOfError(t("err.number"));
      setOfResult(null);
      return;
    }
    setOfError(null);
    setOfResult(`${format(percent === "" ? 0 : (p / 100) * v)}`);
  };

  const calcChange = () => {
    const f = num(from);
    const tt = num(to);
    if (f === null || tt === null || f === 0) {
      setChangeError(f === 0 ? t("err.positive") : t("err.number"));
      setChangeResult(null);
      return;
    }
    setChangeError(null);
    const change = ((tt - f) / Math.abs(f)) * 100;
    if (change === 0) setChangeResult(t("percentage.nochange"));
    else if (change > 0) setChangeResult(t("percentage.increase", { value: format(change) }));
    else setChangeResult(t("percentage.decrease", { value: format(Math.abs(change)) }));
  };

  const reset = () => {
    setPercent("");
    setValue("");
    setOfResult(null);
    setOfError(null);
    setFrom("");
    setTo("");
    setChangeResult(null);
    setChangeError(null);
  };

  return (
    <ToolShell title={t("tool.percentage.name")} description={t("tool.percentage.desc")} icon={Percent}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("percentage.ofTitle")}
      </h2>
      <div className="mt-3 space-y-4">
        <NumberField
          id="pct"
          label={t("percentage.percent")}
          suffix="%"
          placeholder="20"
          value={percent}
          onChange={setPercent}
        />
        <NumberField
          id="val"
          label={t("percentage.value")}
          placeholder="250"
          value={value}
          onChange={setValue}
          allowNegative
        />
        <PrimaryButton onClick={calcOf}>{t("common.calculate")}</PrimaryButton>
        {ofError && <p className="text-sm text-destructive">{ofError}</p>}
        {ofResult && <ResultBanner>{ofResult}</ResultBanner>}
      </div>

      <hr className="my-7 border-border" />

      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("percentage.changeTitle")}
      </h2>
      <div className="mt-3 space-y-4">
        <NumberField
          id="from"
          label={t("percentage.from")}
          placeholder="80"
          value={from}
          onChange={setFrom}
          allowNegative
        />
        <NumberField
          id="to"
          label={t("percentage.to")}
          placeholder="92"
          value={to}
          onChange={setTo}
          allowNegative
        />
        <PrimaryButton onClick={calcChange}>{t("common.calculate")}</PrimaryButton>
        {changeError && <p className="text-sm text-destructive">{changeError}</p>}
        {changeResult && <ResultBanner>{changeResult}</ResultBanner>}
      </div>

      <div className="mt-6">
        <SecondaryButton onClick={reset}>{t("common.reset")}</SecondaryButton>
      </div>
    </ToolShell>
  );
}
