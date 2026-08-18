import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { NumberField, PrimaryButton, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/study-timer")({
  head: () => ({
    meta: [
      { title: "Study Timer — C4TOOLS" },
      { name: "description", content: "A simple countdown timer for focused study sessions." },
      { property: "og:title", content: "Study Timer — C4TOOLS" },
      { property: "og:description", content: "Start, pause and reset a simple study countdown." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyTimer,
});

export function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function StudyTimer() {
  const { t } = useI18n();
  const [minutes, setMinutes] = useState("25");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const applyMinutes = (value: string) => {
    setMinutes(value);
    const m = Number(value);
    if (!running && Number.isFinite(m) && m > 0 && m <= 600) setRemaining(Math.round(m * 60));
  };

  const reset = () => {
    setRunning(false);
    const m = Number(minutes);
    setRemaining(Number.isFinite(m) && m > 0 ? Math.round(m * 60) : 0);
  };

  return (
    <ToolShell title={t("tool.studytimer.name")} description={t("tool.studytimer.desc")} icon={Timer}>
      <p className="text-center text-6xl font-bold tabular-nums tracking-tight text-foreground">
        {formatClock(remaining)}
      </p>
      {remaining === 0 && (
        <p className="mt-3 text-center text-sm font-semibold text-primary">{t("timer.done")}</p>
      )}

      <div className="mt-6">
        <NumberField id="minutes" label={t("timer.minutes")} placeholder="25" value={minutes} onChange={applyMinutes} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={() => remaining > 0 && setRunning((r) => !r)}>
          {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {running ? t("common.pause") : t("common.start")}
        </PrimaryButton>
        <SecondaryButton onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("common.reset")}
        </SecondaryButton>
      </div>
    </ToolShell>
  );
}
