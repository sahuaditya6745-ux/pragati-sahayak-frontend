import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("landing.disclaimer")}
          </p>
          <p className="text-sm font-semibold text-foreground">
            Built for Smart India Hackathon 2026
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PragatiSahayak. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
