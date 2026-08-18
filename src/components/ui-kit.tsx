import { Link } from "@tanstack/react-router";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export function NumberField({
  id,
  label,
  suffix,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  allowNegative = false,
}: {
  id: string;
  label: string;
  suffix?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  allowNegative?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground sm:text-base">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, "")
            )
          }
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="block w-full rounded-xl border border-input bg-background px-4 py-3.5 text-lg font-semibold text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none sm:text-xl"
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4 text-base font-medium text-muted-foreground sm:text-lg">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border border-input bg-background px-4 py-3 text-base font-medium text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none"
      />
    </div>
  );
}

const baseButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]";

export function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseButton} w-full bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${baseButton} w-full border border-border bg-background text-foreground hover:bg-muted ${className}`}
    >
      {children}
    </button>
  );
}

export function ResultBanner({
  children,
  tone = "result",
}: {
  children: ReactNode;
  tone?: "result" | "success" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "bg-success text-success-foreground"
      : tone === "destructive"
        ? "bg-destructive text-destructive-foreground"
        : "bg-result text-result-foreground";
  const { t } = useI18n();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-6 rounded-xl p-5 text-center ${toneClass} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <p className="text-sm font-medium opacity-90">{t("common.result")}</p>
      <p className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{children}</p>
    </div>
  );
}

export function ToolShell({
  title,
  description,
  icon: Icon,
  children,
  footnote,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: ReactNode;
  footnote?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {t("common.back")}
      </Link>

      <div className="mt-5 mb-6 text-center">
        {Icon && (
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">{children}</div>

      {footnote && (
        <p className="mt-6 text-center text-xs text-muted-foreground sm:text-sm">{footnote}</p>
      )}
    </div>
  );
}
