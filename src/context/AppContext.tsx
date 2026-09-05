import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

export type FormData = {
  fullName: string;
  language: string;
  state: string;
  district: string;
  block: string;
  village: string;
  category: string;
  capital: number;
};

export const emptyFormData: FormData = {
  fullName: "",
  language: "English",
  state: "",
  district: "",
  block: "",
  village: "",
  category: "",
  capital: 0,
};

type FormDataUpdater =
  | FormData
  | Partial<FormData>
  | ((prev: FormData) => FormData | Partial<FormData>);

type AppContextValue = {
  formData: FormData;
  setFormData: (data: FormDataUpdater) => void;
  hasSubmitted: boolean;
  setHasSubmitted: (v: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (v: boolean) => void;
  openAiChat: () => void;
  closeAiChat: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<FormData>(emptyFormData);
  const [hasSubmitted, setHasSubmittedState] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const openAiChat = () => setIsAiChatOpen(true);
  const closeAiChat = () => setIsAiChatOpen(false);

  // Hydrate from sessionStorage on client-side mount
  useEffect(() => {
    try {
      const savedForm = sessionStorage.getItem("pragatisahayak_form_data") || sessionStorage.getItem("vyaparmitra_form_data");
      const savedSubmitted = sessionStorage.getItem("pragatisahayak_has_submitted") || sessionStorage.getItem("vyaparmitra_has_submitted");
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        if (parsed && typeof parsed === "object") {
          setFormDataState((prev) => ({ ...emptyFormData, ...prev, ...parsed }));
        }
      }
      if (savedSubmitted) {
        setHasSubmittedState(savedSubmitted === "true");
      }
    } catch {
      // Ignore storage errors in restricted iframe/browser modes
    }
  }, []);

  const setFormData = (data: FormDataUpdater) => {
    setFormDataState((prev) => {
      const resolved = typeof data === "function" ? data(prev) : data;
      const merged = { ...emptyFormData, ...prev, ...resolved };
      try {
        sessionStorage.setItem("pragatisahayak_form_data", JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const setHasSubmitted = (v: boolean) => {
    setHasSubmittedState(v);
    try {
      sessionStorage.setItem("pragatisahayak_has_submitted", String(v));
    } catch {}
  };

  const value = useMemo(
    () => ({
      formData,
      setFormData,
      hasSubmitted,
      setHasSubmitted,
      isAiChatOpen,
      setIsAiChatOpen,
      openAiChat,
      closeAiChat,
    }),
    [formData, hasSubmitted, isAiChatOpen],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
