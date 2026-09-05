import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Bot,
  BarChart3,
  BadgeCheck,
  Landmark,
  Languages,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PragatiSahayak — AI Business Advisory for Rural Entrepreneurs" },
      {
        name: "description",
        content:
          "Get a free AI-powered business feasibility report for your village in minutes. Built for rural Indian entrepreneurs.",
      },
      {
        property: "og:title",
        content: "PragatiSahayak — AI Business Advisory for Rural Entrepreneurs",
      },
      {
        property: "og:description",
        content: "Get a free AI-powered business feasibility report for your village in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FileText,
      title: t("landing.step1_title"),
      description: t("landing.step1_desc"),
    },
    {
      icon: Bot,
      title: t("landing.step2_title"),
      description: t("landing.step2_desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.step3_title"),
      description: t("landing.step3_desc"),
    },
  ];

  const badges = [
    { icon: BadgeCheck, label: t("landing.badge_free") },
    { icon: Landmark, label: t("landing.badge_schemes") },
    { icon: Languages, label: t("landing.badge_bilingual") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-18 lg:px-8 lg:pb-26 lg:pt-22">
          <div className="mx-auto max-w-4xl text-center">
            {/* Friendly Kicker Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-bold text-primary mb-6 shadow-xs animate-in fade-in slide-in-from-top-2 duration-500">
              <span className="text-sm">🌾</span>
              <span>Made for Rural Entrepreneurs & Micro-Enterprises</span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="hidden sm:inline text-secondary font-bold">100% Free AI Insights</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {t("landing.hero_title")}{" "}
              <span className="text-primary italic font-serif font-medium sm:font-bold">{t("landing.hero_title_accent")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {t("landing.hero_subtitle")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/analyze"
                className="inline-flex h-14 min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-hidden active:scale-[0.98]"
              >
                <span>{t("landing.cta_button")}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center sm:mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Simple & Transparent
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl mt-1">
                {t("landing.how_it_works")}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                {t("landing.how_it_works_subtitle")}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="human-card human-card-hover group flex flex-col p-6 sm:p-8"
                >
                  <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <step.icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-card-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-y border-border/80 bg-muted/40 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-6 lg:gap-8">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-xs"
                >
                  <badge.icon className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="text-sm font-semibold text-foreground">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
