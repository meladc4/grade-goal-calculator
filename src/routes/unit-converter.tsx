import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Ruler } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, ResultBanner, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/unit-converter")({
  head: () => ({
    meta: [
      { title: "Unit Converter — C4TOOLS" },
      {
        name: "description",
        content: "Convert km/miles, kg/lb, metres/feet, Celsius/Fahrenheit and litres/gallons.",
      },
      { property: "og:title", content: "Unit Converter — C4TOOLS" },
      { property: "og:description", content: "Everyday unit conversions for students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnitConverter,
});

interface Conversion {
  id: string;
  labelKey: string;
  a: string;
  b: string;
  toB: (v: number) => number;
  toA: (v: number) => number;
}

const CONVERSIONS: Conversion[] = [
  { id: "km_mi", labelKey: "unit.km_mi", a: "km", b: "mi", toB: (v) => v / 1.609344, toA: (v) => v * 1.609344 },
  { id: "kg_lb", labelKey: "unit.kg_lb", a: "kg", b: "lb", toB: (v) => v * 2.20462262185, toA: (v) => v / 2.20462262185 },
  { id: "m_ft", labelKey: "unit.m_ft", a: "m", b: "ft", toB: (v) => v / 0.3048, toA: (v) => v * 0.3048 },
  { id: "c_f", labelKey: "unit.c_f", a: "°C", b: "°F", toB: (v) => v * 1.8 + 32, toA: (v) => (v - 32) / 1.8 },
  { id: "l_gal", labelKey: "unit.l_gal", a: "L", b: "gal", toB: (v) => v / 3.785411784, toA: (v) => v * 3.785411784 },
];

function UnitConverter() {
  const { t } = useI18n();
  const [conversionId, setConversionId] = useState(CONVERSIONS[0]!.id);
  const [reversed, setReversed] = useState(false);
  const [value, setValue] = useState("");

  const conversion = CONVERSIONS.find((c) => c.id === conversionId)!;
  const fromUnit = reversed ? conversion.b : conversion.a;
  const toUnit = reversed ? conversion.a : conversion.b;

  const parsed = value.trim() === "" ? null : Number(value);
  const output =
    parsed !== null && Number.isFinite(parsed)
      ? reversed
        ? conversion.toA(parsed)
        : conversion.toB(parsed)
      : null;

  const fmt = (v: number) => {
    const rounded = Math.round(v * 10000) / 10000;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
  };

  return (
    <ToolShell title={t("tool.unit.name")} description={t("tool.unit.desc")} icon={Ruler}>
      <div className="space-y-1.5">
        <label htmlFor="conv-type" className="block text-sm font-medium text-foreground">
          {t("unit.type")}
        </label>
        <select
          id="conv-type"
          value={conversionId}
          onChange={(e) => setConversionId(e.target.value)}
          className="block h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          {CONVERSIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {t(c.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <NumberField
          id="unit-value"
          label={`${t("unit.from")} (${fromUnit})`}
          suffix={fromUnit}
          placeholder="10"
          value={value}
          onChange={setValue}
          allowNegative
        />
      </div>

      <div className="mt-4">
        <SecondaryButton onClick={() => setReversed((r) => !r)}>
          <ArrowUpDown className="size-4" aria-hidden="true" />
          {t("unit.swap")}
        </SecondaryButton>
      </div>

      {output !== null && (
        <ResultBanner>
          {fmt(output)} {toUnit}
        </ResultBanner>
      )}
    </ToolShell>
  );
}
