import { Link, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import type { ReactNode } from "react";
import { LANGUAGES, useI18n, type LanguageCode } from "@/lib/i18n";

function LanguageSelect() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="relative">
      <Globe
        className="pointer-events-none absolute inset-y-0 start-2.5 my-auto size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        aria-label={t("nav.language")}
        value={lang}
        onChange={(e) => setLang(e.target.value as LanguageCode)}
        className="h-10 appearance-none rounded-lg border border-border bg-background ps-8 pe-3 text-sm font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, dir } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  return (
    <div dir={dir} className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
            C4TOOLS
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                isHome ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {t("nav.home")}
            </Link>
            <LanguageSelect />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground sm:text-sm">{t("footer.credit")}</p>
      </footer>
    </div>
  );
}
