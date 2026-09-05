import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/services/api";
import { STATES as FALLBACK_STATES, BUSINESS_CATEGORIES as FALLBACK_CATEGORIES } from "@/lib/locations";
import { useAppContext, type FormData } from "@/context/AppContext";
import { incrementReportsGeneratedCount } from "@/services/adminStore";
import { VoiceInputButton } from "@/components/ui/VoiceInputButton";
import { toast } from "sonner";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    const category = search["category"];
    return typeof category === "string" ? { category } : {};
  },
  head: () => ({
    meta: [
      { title: "Analyze Your Business Idea — PragatiSahayak" },
      {
        name: "description",
        content:
          "Answer three quick steps about you, your village and your business idea to get a free feasibility report.",
      },
      { property: "og:title", content: "Analyze Your Business Idea — PragatiSahayak" },
      {
        property: "og:description",
        content:
          "Answer three quick steps about you, your village and your business idea to get a free feasibility report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyzePage,
});

const fieldClass =
  "min-h-[48px] w-full rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30";

function ErrorText({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function AnalyzePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { formData, setFormData, setHasSubmitted } = useAppContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const STEPS = [
    { n: 1, label: t("form.step1_title") },
    { n: 2, label: t("form.step2_title") },
    { n: 3, label: t("form.step3_title") },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: formData,
    mode: "onTouched",
    shouldUnregister: false,
  });

  // Sync form when formData changes on initial client load
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      const cur = getValues();
      if (!cur.fullName && formData.fullName) {
        reset(formData);
      }
    }
  }, []);

  // Sync form language when global i18n changes
  useEffect(() => {
    const formLang = (i18n.language && i18n.language.startsWith("hi")) ? "Hindi" : "English";
    setValue("language", formLang);
  }, [i18n.language, setValue]);

  useEffect(() => {
    if (search.category) {
      setValue("category", search.category);
    }
  }, [search.category, setValue]);

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedBlock = watch("block");

  const [states, setStates] = useState<string[]>([...FALLBACK_STATES]);
  const [categoriesList, setCategoriesList] = useState<string[]>([...FALLBACK_CATEGORIES]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [suggestedVillages, setSuggestedVillages] = useState<{ name: string }[]>([]);

  // Load States & Categories via Unified API service layer
  useEffect(() => {
    let isMounted = true;
    api.getStates().then((res: string[]) => {
      if (isMounted && Array.isArray(res) && res.length > 0) setStates(res);
    });
    api.getCategories().then((res: any[]) => {
      if (isMounted && Array.isArray(res) && res.length > 0) {
        setCategoriesList(res.map((c: any) => c.name || c));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Districts via API on state change
  useEffect(() => {
    let isMounted = true;
    if (selectedState) {
      api.getDistricts(selectedState).then((res: string[]) => {
        if (isMounted) setDistricts(res || []);
      });
    } else {
      setDistricts([]);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  // Fetch Blocks via API on district change
  useEffect(() => {
    let isMounted = true;
    if (selectedState && selectedDistrict) {
      api.getBlocks(selectedState, selectedDistrict).then((res: string[]) => {
        if (isMounted) setBlocks(res || []);
      });
    } else {
      setBlocks([]);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedDistrict]);

  // Fetch Villages via API on block change
  useEffect(() => {
    let isMounted = true;
    if (selectedState && selectedDistrict && selectedBlock) {
      api.getVillages(selectedState, selectedDistrict, selectedBlock).then((res: any[]) => {
        if (isMounted) setSuggestedVillages((res as { name: string }[]) || []);
      });
    } else {
      setSuggestedVillages([]);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedDistrict, selectedBlock]);

  const statusMessages = [
    `📍 ${t("form.status_analyzing")}`,
    `🏪 ${t("form.status_mapping")}`,
    `🏛️ ${t("form.status_schemes")}`,
    `💰 ${t("form.status_loan")}`,
    `📊 ${t("form.status_generating")}`,
  ];

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, 4));
    }, 250);
    const timeout = setTimeout(() => {
      navigate({ to: "/results" });
    }, 1100);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading, navigate]);

  const stepFields: Record<number, (keyof FormData)[]> = {
    1: ["fullName", "language"],
    2: ["state", "district", "block", "village"],
    3: ["category", "capital"],
  };

  async function next() {
    const fieldsToValidate = stepFields[step] || [];
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      const currentValues = getValues();
      const stepUpdates: Partial<FormData> = {};
      for (const f of fieldsToValidate) {
        const val = currentValues[f];
        if (val !== undefined && val !== "") {
          (stepUpdates as any)[f] = val;
        }
      }
      setFormData((prev: FormData) => ({ ...(prev || {}), ...stepUpdates }));
      setStep((s) => Math.min(s + 1, 3));
    }
  }

  async function onSubmit(data: FormData) {
    const currentValues = getValues();
    const cleanCurrent: Partial<FormData> = {};
    for (const [key, val] of Object.entries(currentValues || {})) {
      if (val !== undefined && val !== "") {
        (cleanCurrent as any)[key] = val;
      }
    }
    const cleanData: Partial<FormData> = {};
    for (const [key, val] of Object.entries(data || {})) {
      if (val !== undefined && val !== "") {
        (cleanData as any)[key] = val;
      }
    }

    const merged = {
      ...(formData || {}),
      ...cleanCurrent,
      ...cleanData,
    };

    const parsedCapital = Number(merged.capital);
    const safeCapital =
      !Number.isNaN(parsedCapital) && parsedCapital >= 0
        ? parsedCapital
        : 60000;

    const preparedData: FormData = {
      fullName: (merged.fullName || "").trim() || "Entrepreneur",
      language: merged.language || "English",
      state: merged.state || "Uttar Pradesh",
      district: merged.district || "Lucknow",
      block: merged.block || "Malihabad",
      village: (merged.village || "").trim() || "Rasoolpur",
      category: merged.category || "Flour Mill",
      capital: safeCapital,
    };

    setFormData(preparedData);
    setHasSubmitted(true);
    incrementReportsGeneratedCount();
    setStatusIndex(0);
    setLoading(true);

    try {
      // Calls unified API service layer
      await api.generateReport(preparedData);
    } catch (err) {
      console.error("API generateReport error:", err);
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      await next();
      return;
    }

    // Step 3 submission: trigger validation on Step 3 fields first
    const isStep3Valid = await trigger(["category", "capital"]);
    if (!isStep3Valid) {
      toast.error("Please select a business category and enter your investment capital.");
      return;
    }

    handleSubmit(
      (data) => {
        onSubmit(data);
      },
      (validationErrors) => {
        console.warn("Form validation notice on submit:", validationErrors);
        const errorKeys = Object.keys(validationErrors);
        if (errorKeys.some((k) => ["fullName", "language"].includes(k))) {
          setStep(1);
          toast.error("Please enter your name on Step 1.");
        } else if (errorKeys.some((k) => ["state", "district", "block", "village"].includes(k))) {
          setStep(2);
          toast.error("Please complete your location details on Step 2.");
        } else {
          // If required fields are present or defaultable, proceed safely with sanitized data
          onSubmit(getValues());
        }
      }
    )(e);
  };

  // Handle language change from form to sync i18n
  const handleFormLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = e.target.value;
    setValue("language", chosen);
    if (chosen === "Hindi") {
      i18n.changeLanguage("hi");
    } else if (chosen === "English") {
      i18n.changeLanguage("en");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("form.page_title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("form.page_subtitle")}
        </p>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                      step > s.n
                        ? "bg-green text-green-foreground"
                        : step === s.n
                          ? "bg-saffron text-saffron-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.n ? <Check className="h-5 w-5" /> : s.n}
                  </div>
                  <span
                    className={`whitespace-nowrap text-[11px] font-medium sm:text-xs ${
                      step >= s.n ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 -mt-6 h-1 flex-1 rounded-full ${
                      step > s.n ? "bg-green" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {t("common.next")} {step} / 3
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="human-card mt-8 p-6 sm:p-8"
        >
          <div className={step === 1 ? "space-y-6 animate-in fade-in duration-200" : "hidden"}>
            <div>
              <label htmlFor="fullName" className="mb-2 block font-medium text-foreground">
                {t("form.name")} <span className="text-destructive">*</span>
              </label>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1">
                  <input
                    id="fullName"
                    type="text"
                    placeholder={t("form.name_placeholder")}
                    className={fieldClass}
                    {...register("fullName", {
                      required: t("form.error_required"),
                      maxLength: { value: 100, message: "Name must be under 100 characters" },
                    })}
                  />
                  <ErrorText message={errors.fullName?.message} />
                </div>
                <VoiceInputButton
                  onTranscript={(text) => {
                    setValue("fullName", text, { shouldValidate: true, shouldDirty: true });
                  }}
                  language={watch("language") || ((i18n.language && i18n.language.startsWith("hi")) ? "Hindi" : "English")}
                  fieldLabel="Full Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="language" className="mb-2 block font-medium text-foreground">
                {t("form.language")} <span className="text-destructive">*</span>
              </label>
              <select
                id="language"
                className={fieldClass}
                {...register("language", {
                  required: t("form.error_required"),
                  onChange: handleFormLanguageChange,
                })}
              >
                <option value="">{t("form.language")}</option>
                <option value="English">{t("form.language_en")}</option>
                <option value="Hindi">{t("form.language_hi")}</option>
              </select>
              <ErrorText message={errors.language?.message} />
            </div>
          </div>

          <div className={step === 2 ? "space-y-6 animate-in fade-in duration-200" : "hidden"}>
            <div>
              <label htmlFor="state" className="mb-2 block font-medium text-foreground">
                {t("form.state")} <span className="text-destructive">*</span>
              </label>
              <select
                id="state"
                className={fieldClass}
                {...register("state", {
                  required: t("form.error_required"),
                  onChange: () => {
                    setValue("district", "");
                    setValue("block", "");
                  },
                })}
              >
                <option value="">{t("form.state_placeholder")}</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.state?.message} />
            </div>
            <div>
              <label htmlFor="district" className="mb-2 block font-medium text-foreground">
                {t("form.district")} <span className="text-destructive">*</span>
              </label>
              <select
                id="district"
                disabled={!selectedState}
                className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
                {...register("district", {
                  required: t("form.error_required"),
                  onChange: () => setValue("block", ""),
                })}
              >
                <option value="">
                  {selectedState ? t("form.district_placeholder") : t("form.state_placeholder")}
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.district?.message} />
            </div>
            <div>
              <label htmlFor="block" className="mb-2 block font-medium text-foreground">
                {t("form.block")} <span className="text-destructive">*</span>
              </label>
              <select
                id="block"
                disabled={!selectedDistrict}
                className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
                {...register("block", { required: t("form.error_required") })}
              >
                <option value="">
                  {selectedDistrict ? t("form.block_placeholder") : t("form.district_placeholder")}
                </option>
                {blocks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.block?.message} />
            </div>
            <div>
              <label htmlFor="village" className="mb-2 block font-medium text-foreground">
                {t("form.village")} <span className="text-destructive">*</span>
              </label>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1">
                  <input
                    id="village"
                    type="text"
                    list="suggested-villages"
                    placeholder={t("form.village_placeholder")}
                    className={fieldClass}
                    {...register("village", {
                      required: t("form.error_required"),
                      maxLength: { value: 100, message: "Village must be under 100 characters" },
                    })}
                  />
                  {suggestedVillages && suggestedVillages.length > 0 && (
                    <datalist id="suggested-villages">
                      {suggestedVillages.map((v) => (
                        <option key={v.name} value={v.name} />
                      ))}
                    </datalist>
                  )}
                  <ErrorText message={errors.village?.message} />
                </div>
                <VoiceInputButton
                  onTranscript={(text) => {
                    setValue("village", text, { shouldValidate: true, shouldDirty: true });
                  }}
                  language={watch("language") || ((i18n.language && i18n.language.startsWith("hi")) ? "Hindi" : "English")}
                  fieldLabel="Village Name"
                />
              </div>
            </div>
          </div>

          <div className={step === 3 ? "space-y-6 animate-in fade-in duration-200" : "hidden"}>
            <div>
              <label htmlFor="category" className="mb-2 block font-medium text-foreground">
                {t("form.category")} <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                className={fieldClass}
                {...register("category", { required: t("form.error_required") })}
              >
                <option value="">{t("form.category_placeholder")}</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.category?.message} />
            </div>
            <div>
              <label htmlFor="capital" className="mb-2 block font-medium text-foreground">
                {t("form.capital")} <span className="text-destructive">*</span>
              </label>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-border focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/30">
                <span className="grid w-12 shrink-0 place-items-center bg-muted text-lg font-semibold text-foreground">
                  ₹
                </span>
                <input
                  id="capital"
                  type="number"
                  min={0}
                  step={1000}
                  placeholder={t("form.capital_placeholder")}
                  className="min-h-[48px] w-full bg-background px-4 text-base text-foreground outline-none"
                  {...register("capital", {
                    required: t("form.error_required"),
                    valueAsNumber: true,
                    min: { value: 0, message: "Capital cannot be negative" },
                  })}
                />
              </div>
              <ErrorText message={errors.capital?.message} />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-muted px-6 font-semibold text-muted-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("form.back")}
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.01] sm:flex-1 cursor-pointer shadow-sm"
              >
                <span>{t("form.next")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-secondary px-6 text-base font-bold text-secondary-foreground transition-all hover:bg-secondary/90 hover:scale-[1.01] sm:flex-1 cursor-pointer shadow-md"
              >
                <span>{t("form.generate")}</span>
                <Sparkles className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </form>
      </main>
      <Footer />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 px-6 text-center backdrop-blur-sm">
          <Loader2 className="h-14 w-14 animate-spin text-saffron" />
          <p className="max-w-sm text-lg font-semibold text-foreground">
            {statusMessages[statusIndex]}
          </p>
          <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-green transition-all duration-700"
              style={{ width: `${((statusIndex + 1) / statusMessages.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
