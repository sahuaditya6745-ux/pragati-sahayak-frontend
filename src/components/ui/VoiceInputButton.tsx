import { useState, useRef, useEffect, useCallback } from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: string; // e.g. "Hindi" | "English" or "hi" | "en"
  className?: string;
  fieldLabel?: string;
}

export function VoiceInputButton({
  onTranscript,
  language = "English",
  className = "",
  fieldLabel = "field",
}: VoiceInputButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognitionClass));
    }
  }, []);

  // Map language to RFC 5646 language tag
  const getLanguageTag = useCallback(() => {
    const l = (language || "").toLowerCase();
    if (l.includes("hi") || l.includes("hindi")) {
      return "hi-IN";
    }
    return "en-IN";
  }, [language]);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const startSilenceTimer = (durationMs = 5000) => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, durationMs);
  };

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      // Stop any existing instance
      if (recognitionRef.current) {
        stopListening();
      }

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = getLanguageTag();
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        startSilenceTimer(5000);
      };

      recognition.onresult = (event: any) => {
        // Reset 5-second silence timer on every speech event
        startSilenceTimer(5000);

        const lastIndex = event.results.length - 1;
        const result = event.results[lastIndex];
        if (result && result[0]) {
          const spokenText = result[0].transcript.trim();
          if (spokenText) {
            onTranscript(spokenText);
          }
        }
      };

      recognition.onerror = (event: any) => {
        // If aborted or no-speech after silence, handle gently
        if (event.error === "no-speech" || event.error === "aborted") {
          // Normal timeout or silence
        } else {
          toast.error("Could not understand. Please try again.");
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        clearSilenceTimer();
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start error:", err);
      toast.error("Could not start microphone. Please check browser permissions.");
      stopListening();
    }
  };

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // If browser doesn't support SpeechRecognition, hide gracefully
  if (!isSupported) {
    return null;
  }

  const isHindi = getLanguageTag() === "hi-IN";

  return (
    <div className={`inline-flex flex-col items-center shrink-0 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        title={isListening ? "Stop listening" : `Voice input for ${fieldLabel}`}
        aria-label={isListening ? "Stop listening" : `Voice input for ${fieldLabel}`}
        className={`relative grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-xl border transition-all duration-200 cursor-pointer ${
          isListening
            ? "border-red-500 bg-red-500/10 text-red-600 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
            : "border-border bg-background text-muted-foreground hover:border-saffron hover:bg-saffron/10 hover:text-saffron"
        }`}
      >
        {isListening ? (
          <>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
            <Mic className="h-5 w-5 animate-pulse text-red-600" />
          </>
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
      <span
        className={`mt-1 text-[10px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
          isListening ? "text-red-600 animate-pulse font-bold" : "text-muted-foreground"
        }`}
      >
        {isListening
          ? isHindi
            ? "🔴 सुन रहे हैं..."
            : "🔴 Listening..."
          : isHindi
            ? "🎤 बोलें"
            : "🎤 Speak"}
      </span>
    </div>
  );
}
