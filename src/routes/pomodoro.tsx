import { createFileRoute } from "@tanstack/react-router";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PrimaryButton, SecondaryButton, ToolShell } from "@/components/ui-kit";

export const Route = createFileRoute("/pomodoro")({
  head: () => ({
    meta: [
      { title: "Pomodoro Timer — C4TOOLS" },
      { name: "description", content: "A simple Pomodoro timer: 25 minutes focus, 5 minutes break." },
      { property: "og:title", content: "Pomodoro Timer — C4TOOLS" },
      { property: "og:description", content: "25/5 Pomodoro sessions with start, pause and reset." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pomodoro,
});

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Pomodoro() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setMode((m) => {
            const next = m === "focus" ? "break" : "focus";
            setRemaining(next === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const switchMode = () => {
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setRunning(false);
    setRemaining(next === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
  };

  return (
    <ToolShell title={t("tool.pomodoro.name")} description={t("tool.pomodoro.desc")} icon={Clock}>
      <p className="text-center text-sm font-semibold uppercase tracking-wide text-primary">
        {mode === "focus" ? t("pomodoro.focus") : t("pomodoro.break")}
      </p>
      <p className="mt-2 text-center text-6xl font-bold tabular-nums tracking-tight text-foreground">
        {clock(remaining)}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={() => setRunning((r) => !r)}>
          {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {running ? t("common.pause") : t("common.start")}
        </PrimaryButton>
        <SecondaryButton onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("common.reset")}
        </SecondaryButton>
      </div>
      <div className="mt-3">
        <SecondaryButton onClick={switchMode}>{t("pomodoro.switch")}</SecondaryButton>
      </div>
    </ToolShell>
  );
}
