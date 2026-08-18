import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { MAIN_TOOLS, SECONDARY_TOOLS, type ToolMeta } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C4TOOLS — Student Tools Made Simple" },
      {
        name: "description",
        content:
          "C4TOOLS offers a Grade Calculator, Grade Average Calculator and 10 more free student tools — GPA, percentage, timers, converters and more.",
      },
      { property: "og:title", content: "C4TOOLS — Student Tools Made Simple" },
      {
        property: "og:description",
        content:
          "Free student calculators and timers: grades, averages, GPA, percentages, Pomodoro and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Wrench;
  return <Icon className={className} aria-hidden="true" />;
}

function MainToolCard({ tool }: { tool: ToolMeta }) {
  const { t } = useI18n();
  return (
    <Link
      to={tool.path}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/40"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <ToolIcon name={tool.icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground sm:text-lg">
          {t(tool.nameKey)}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{t(tool.descKey)}</span>
      </span>
      <Icons.ChevronRight
        className="size-5 shrink-0 text-muted-foreground rtl:rotate-180"
        aria-hidden="true"
      />
    </Link>
  );
}

function SecondaryToolCard({ tool }: { tool: ToolMeta }) {
  const { t } = useI18n();
  return (
    <Link
      to={tool.path}
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/40"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
        <ToolIcon name={tool.icon} className="size-4.5" />
      </span>
      <span className="text-sm font-semibold leading-snug text-foreground">{t(tool.nameKey)}</span>
      <span className="text-xs leading-snug text-muted-foreground">{t(tool.descKey)}</span>
    </Link>
  );
}

function Home() {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">C4TOOLS</h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">{t("brand.tagline")}</p>
      </div>

      <section id="main-tools" className="mt-10">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("section.mainTools")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("section.mainToolsDesc")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {MAIN_TOOLS.map((tool) => (
            <MainToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>

      <section id="more-tools" className="mt-10">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("section.moreTools")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("section.moreToolsDesc")}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SECONDARY_TOOLS.map((tool) => (
            <SecondaryToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
