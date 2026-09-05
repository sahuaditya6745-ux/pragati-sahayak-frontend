import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function ResultsSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 animate-pulse">
        {/* Top Header & Actions Bar Skeleton */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-xl bg-muted" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-muted/60" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-36 rounded-xl bg-muted" />
            <div className="h-10 w-24 rounded-xl bg-muted" />
          </div>
        </div>

        {/* Viability Gauge & Summary Cards Skeleton */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Gauge card */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="h-44 w-44 rounded-full border-8 border-muted bg-muted/20" />
            <div className="mt-6 h-5 w-40 rounded-lg bg-muted" />
            <div className="mt-2 h-3 w-56 rounded-md bg-muted/60" />
          </div>

          {/* 4 KPI metrics */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-md bg-muted" />
                  <div className="h-8 w-8 rounded-xl bg-muted" />
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="h-7 w-28 rounded-lg bg-muted" />
                  <div className="h-3 w-36 rounded-md bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation Pill Bar Skeleton */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-10 w-28 shrink-0 rounded-xl bg-muted" />
          ))}
        </div>

        {/* Active Tab Content Card Skeleton */}
        <div className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="space-y-1.5">
              <div className="h-5 w-48 rounded-lg bg-muted" />
              <div className="h-3 w-64 rounded-md bg-muted/60" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-36 rounded-2xl border border-border/60 bg-muted/30 p-4" />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
