import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";

export function Header() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAiChat } = useAppContext();

  const isHindi = i18n.language && i18n.language.startsWith("hi");

  const toggleLanguage = () => {
    const nextLang = isHindi ? "en" : "hi";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary font-bold transition-transform group-hover:scale-105 shadow-xs">
            🌱
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-foreground sm:text-xl leading-none">
              Pragati<span className="text-primary">Sahayak</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground hidden sm:block">
              {isHindi ? "ग्रामीण उद्यम सलाहकार" : "Rural Enterprise Advisor"}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <Link
            to="/"
            activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/analyze"
            activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary"
          >
            {t("nav.analyze")}
          </Link>
          <Link
            to="/results"
            activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary"
          >
            {t("nav.report_dashboard")}
          </Link>
          <button
            type="button"
            onClick={openAiChat}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary cursor-pointer flex items-center gap-1.5"
          >
            <span className="text-xs">🤖</span>
            <span>{t("nav.ai_advisor")}</span>
          </button>
          <Link
            to="/admin"
            activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary"
          >
            {t("nav.admin")}
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 h-9 min-h-[36px] rounded-full border border-border/80 bg-card px-3.5 text-xs font-bold text-foreground shadow-xs transition-all hover:border-primary hover:text-primary cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>{isHindi ? "हि | EN" : "EN | हि"}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="grid h-11 w-11 min-h-[44px] place-items-center rounded-lg border border-border bg-background text-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{ className: "bg-accent text-saffron font-bold" }}
              className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-saffron"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{ className: "bg-accent text-saffron font-bold" }}
              className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-saffron"
            >
              {t("nav.analyze")}
            </Link>
            <Link
              to="/results"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{ className: "bg-accent text-saffron font-bold" }}
              className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-saffron"
            >
              {t("nav.report_dashboard")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAiChat();
              }}
              className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-saffron w-full text-left cursor-pointer"
            >
              {t("nav.ai_advisor")}
            </button>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{ className: "bg-accent text-saffron font-bold" }}
              className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-saffron"
            >
              {t("nav.admin")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
