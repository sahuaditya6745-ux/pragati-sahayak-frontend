import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  User,
  ChevronDown,
  RotateCcw,
  ShieldAlert,
  FileCheck,
  Building2,
  TrendingUp,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";
import { computeFullResults, DEFAULT_FALLBACK_FORM_DATA } from "@/lib/resultsData";
import { useAppContext } from "@/context/AppContext";
import type { MatchedScheme } from "@/types/business";
import { api } from "@/services/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  confidence?: "high" | "medium" | "low";
}

interface AiChatWidgetProps {
  data?: FullResultsData;
}

export function AiChatWidget({ data }: AiChatWidgetProps = {}) {
  const {
    formData: contextFormData,
    isAiChatOpen,
    setIsAiChatOpen,
    openAiChat,
    closeAiChat,
  } = useAppContext();

  const resolvedData = useMemo(() => {
    try {
      return data || computeFullResults(contextFormData);
    } catch (err) {
      console.error("AiChatWidget computeFullResults error:", err);
      try {
        return computeFullResults(null);
      } catch {
        return computeFullResults(DEFAULT_FALLBACK_FORM_DATA);
      }
    }
  }, [data, contextFormData]);

  const {
    formData,
    category,
    financials,
    loanDetails,
    matchedSchemes,
    threatsDetailed,
    totalScore,
    scoreLabel,
    blockMeta,
    competitorCount,
    marketAnalysis,
  } = resolvedData;

  const isOpen = isAiChatOpen;
  const setIsOpen = setIsAiChatOpen;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const village = formData?.village || "your village";
  const block = formData?.block || "your block";
  const state = formData?.state || "your state";
  const business = category?.name || "your enterprise";

  const topEligibleScheme = matchedSchemes?.find((s: MatchedScheme) => s.eligible);
  const schemeName = topEligibleScheme ? topEligibleScheme.name : "PMEGP / Mudra Yojana";
  const schemeUrl = topEligibleScheme?.application_url || topEligibleScheme?.url || "https://www.kviconline.gov.in/pmegpeportal/";

  const initialAiGreeting = `Namaste ${formData?.fullName || "Entrepreneur"}! I am your PragatiSahayak AI Assistant. I have analyzed your complete feasibility report for ${business} in ${village}, ${state}. How can I assist you with your business plan today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: initialAiGreeting,
      timestamp: "Just now",
      confidence: "high",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Suggested questions chips
  const suggestedQuestions = [
    `What licenses do I need for ${business}?`,
    `How do I apply for ${topEligibleScheme?.name ? (topEligibleScheme.name.split("(")[0] ?? "").trim() : "government schemes"}?`,
    "What are the biggest risks?",
    "How can I increase my viability score?",
    "What documents do I need for the loan?",
  ];

  // Mock AI response generator based on keywords and user's specific context
  const generateMockResponse = (userQuery: string): { text: string; confidence: "high" | "medium" | "low" } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Licenses & Registrations
    if (q.includes("license") || q.includes("registration") || q.includes("permit") || q.includes("fssai") || q.includes("udyam")) {
      const isFood = ["flour_mill", "oil_mill", "papad_making", "dairy_farm"].includes(category?.id || "");
      return {
        text: `For setting up a ${business} in ${state}, you typically need the following registrations:\n\n` +
          `1. 📋 Udyam MSME Registration (100% free and online at udyamregistration.gov.in with Aadhaar).\n` +
          (isFood ? `2. 🥛 FSSAI Basic Food Registration/License (mandatory for food processing businesses).\n` : `2. 🏪 Local Shop & Establishment Act / Trade NOC from your Gram Panchayat or Municipality.\n`) +
          `3. 🏢 Business Current Account with your local bank under the firm's name.\n` +
          `4. 🧾 GST Registration (mandatory only if your annual turnover exceeds ₹40 Lakhs for goods / ₹20 Lakhs for services).\n` +
          (category?.id === "brick_kiln" ? `5. 💨 State Pollution Control Board (SPCB) consent to establish.\n` : ``) +
          `\n💡 Pro-tip: Keep your Udyam certificate ready before applying for any bank loan or government subsidy.`,
        confidence: "high",
      };
    }

    // 2. Government Schemes & Application Process
    if (q.includes("apply") || q.includes("scheme") || q.includes("subsidy") || q.includes("pmegp") || q.includes("mudra") || q.includes("pmfme") || q.includes("standup")) {
      const subsidyPercent = topEligibleScheme?.subsidyPercentApplied || 35;
      return {
        text: `To apply for ${schemeName}:\n\n` +
          `1. 🌐 Visit the official portal (${schemeUrl}).\n` +
          `2. 📝 Register using your Aadhaar number and Mobile OTP.\n` +
          `3. 📂 Fill the online application form and select your preferred financing bank branch in ${block}, ${state}.\n` +
          `4. 📎 Upload required documents: Aadhaar, PAN card, Passport photo, Caste certificate (if SC/ST/OBC), and Detailed Project Report (DPR).\n` +
          `5. 🏛️ For rural areas like ${village}, eligible applicants receive up to ${subsidyPercent}% capital subsidy routed directly to the lending bank.\n` +
          `6. 🏦 Once the nodal agency approves your application, the bank will release the loan disbursement directly for machinery purchase.`,
        confidence: "high",
      };
    }

    // 3. Risks & Threats
    if (q.includes("risk") || q.includes("threat") || q.includes("challenge") || q.includes("problem") || q.includes("danger")) {
      const threatSnippets = (threatsDetailed || []).slice(0, 3).map((t, i) => `${i + 1}. ⚠️ ${t.name}: ${(t.description || "").slice(0, 140)}... (Mitigation: ${t.mitigation || "N/A"})`).join("\n\n");
      return {
        text: `Based on local analysis for ${business} in ${village}, ${block}, the primary risks are:\n\n` +
          (threatSnippets || `1. ⚠️ Seasonal income shifts: Agricultural harvest cycles can create fluctuating cash flow.\n2. ⚠️ Informal credit (Udhaar): High unpaid customer credit can cause a cash crunch.\n3. ⚠️ Machine repair delays: Distances to the nearest city hub (${blockMeta?.nearest_city_km || 15} km) can increase downtime.`) +
          `\n\n🛡️ Key Mitigation: Keep a 15-day inventory buffer, limit customer credit to ₹500, and save 10% monthly revenue as an emergency fund.`,
        confidence: "high",
      };
    }

    // 4. Viability Score & How to increase
    if (q.includes("score") || q.includes("viability") || q.includes("increase") || q.includes("improve") || q.includes("rating")) {
      return {
        text: `Your current Business Viability Score is ${totalScore ?? 0}/100 (${scoreLabel || "Moderate"}).\n\n` +
          `Here is how you can boost your viability score even higher:\n` +
          `1. 💰 Increase Own Capital: Investing 25-30% own margin reduces debt load and monthly EMI stress.\n` +
          `2. 🤝 Secure Advance Orders: Tie up with 3-5 local retail shops or village institutions for bulk purchase commitments.\n` +
          `3. ⚡ Reduce Operating Cost: Use energy-efficient ISI-certified motors to keep monthly power consumption low.\n` +
          `4. 🚚 Expand Delivery: Offer free weekly delivery to neighboring villages in ${block} to double your consumer catchment.`,
        confidence: "high",
      };
    }

    // 5. Loan & Banking Documents
    if (q.includes("loan") || q.includes("document") || q.includes("bank") || q.includes("emi") || q.includes("interest") || q.includes("collateral")) {
      const loanAmount = Number(loanDetails?.loanAmount) || Math.max(0, (Number(financials?.avgInvestment) || 0) - (Number(formData?.capital) || 0));
      return {
        text: `For a project loan requirement of ~₹${(Number(loanAmount) || 0).toLocaleString("en-IN")} for your ${business}, banks typically require:\n\n` +
          `1. 📄 Identity & Address Proof: Aadhaar Card, Voter ID, and PAN Card.\n` +
          `2. 📋 Business Proof: Udyam MSME Registration Certificate and Gram Panchayat trade NOC.\n` +
          `3. 🧾 Bank Statement: Last 6 months bank statement of the primary applicant.\n` +
          `4. 📊 Detailed Project Report (DPR): You can download the complete report generated on this dashboard!\n` +
          `5. ⚙️ Machinery Quotation: Proforma invoice / price quote from the authorized equipment dealer.\n` +
          `6. 🛡️ Collateral: Under PMMY (Mudra) and PMEGP, loans up to ₹10-20 Lakhs are covered by credit guarantee (CGTMSE) with NO private collateral required.`,
        confidence: "high",
      };
    }

    // 6. Competitors & Market
    if (q.includes("competitor") || q.includes("competition") || q.includes("market") || q.includes("demand") || q.includes("customer")) {
      return {
        text: `In ${village} and surrounding areas of ${block}:\n\n` +
          `• We identified ${competitorCount ?? 0} direct competitor(s) in this sector.\n` +
          `• Estimated local consumer catchment: ${(Number(marketAnalysis?.targetCustomers) || 0).toLocaleString("en-IN")} residents.\n` +
          `• Market Demand Level: ${(marketAnalysis?.demandLevel || "moderate").toUpperCase()}.\n\n` +
          `💡 How to win customers: Set up a transparent digital weighing scale, accept GooglePay/PhonePe with an audio soundbox, and maintain hygienic packaging.`,
        confidence: "high",
      };
    }

    // 7. Financials, Profit & Breakeven
    if (q.includes("profit") || q.includes("revenue") || q.includes("margin") || q.includes("breakeven") || q.includes("money") || q.includes("earn")) {
      return {
        text: `Here is the financial summary for ${business} in ${village}:\n\n` +
          `• 💵 Estimated Monthly Revenue: ~₹${(Number(financials?.estimatedMonthlyRevenue) || 0).toLocaleString("en-IN")}\n` +
          `• 📈 Estimated Monthly Net Profit: ~₹${(Number(financials?.estimatedMonthlyProfit) || 0).toLocaleString("en-IN")}\n` +
          `• 📊 Average Profit Margin: ${financials?.marginPercent || 0}%\n` +
          `• ⏳ Expected Breakeven Period: ${financials?.breakevenMonths || 0} Months\n\n` +
          `With disciplined cash management, you can recover your initial investment within your first ${financials?.breakevenMonths || 0} months of full operations.`,
        confidence: "high",
      };
    }

    // Default Fallback
    return {
      text: `That's a great question! Based on your business plan for ${business} in ${village}, ${state}, I'd recommend consulting your local District Industries Centre (DIC) in ${formData?.district || "your district"} for localized guidance.\n\n` +
        `Would you like to know more about:\n` +
        `• 🏛️ Government subsidy schemes and eligibility\n` +
        `• 💰 Loan documents and interest subvention\n` +
        `• 📋 Required licenses and registration steps\n` +
        `• 🛡️ Local market competition and risk mitigation?`,
      confidence: "medium",
    };
  };

  const handleSend = useCallback(
    (textToSend?: string) => {
      const query = textToSend || input;
      if (!query.trim()) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query.trim(),
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Route through Unified API Service layer
      api
        .chatWithAI(query, {
          category,
          formData,
          financials,
          threatsDetailed,
          topEligibleScheme,
        })
        .then((response: { text: string; confidence?: "high" | "medium" | "low" }) => {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: response.text,
            timestamp: "Just now",
            confidence: response.confidence || "high",
          };
          setMessages((prev) => [...prev, aiMessage]);
        })
        .catch(() => {
          const fallback = generateMockResponse(query);
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: fallback.text,
            timestamp: "Just now",
            confidence: fallback.confidence,
          };
          setMessages((prev) => [...prev, aiMessage]);
        })
        .finally(() => {
          setIsTyping(false);
        });
    },
    [input, generateMockResponse, category, formData, financials, threatsDetailed, topEligibleScheme],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: initialAiGreeting,
        timestamp: "Just now",
        confidence: "high",
      },
    ]);
  };

  return (
    <>
      {/* 1. Trigger Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-terracotta px-5 py-3.5 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-terracotta/40"
            aria-label="Open PragatiSahayak AI Assistant"
          >
            {/* Pulse ping animation */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-sage border-2 border-white dark:border-background" />
            </span>

            <span className="text-lg">💬</span>
            <span className="text-sm font-extrabold tracking-wide">Ask AI Advisor</span>
          </button>
        </div>
      )}

      {/* 2. Slide-in Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md shadow-2xl border-t border-border sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:max-h-[85vh] sm:w-[380px] sm:rounded-3xl sm:border sm:border-border/80 animate-in slide-in-from-bottom-5 sm:slide-in-from-right-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 bg-card px-4 py-3.5 sm:rounded-t-3xl">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-terracotta/15 text-terracotta font-bold text-base shadow-sm">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground leading-tight">
                  PragatiSahayak AI Assistant
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Ask anything about your business report
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="grid h-9 w-9 min-h-[44px] min-w-[44px] place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 min-h-[44px] min-w-[44px] place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Context pill */}
          <div className="border-b border-border/40 bg-muted/30 px-4 py-1.5 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="truncate">
              📍 <span className="font-semibold text-foreground">{category.name}</span> in {village}
            </span>
            <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-bold ml-1">
              Score: {totalScore}/100
            </span>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* AI Label & Confidence */}
                {msg.sender === "ai" && (
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground">
                      🤖 AI
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          msg.confidence === "high"
                            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                            : msg.confidence === "medium"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="capitalize">{msg.confidence || "high"} confidence</span>
                    </span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-tr-xs bg-terracotta font-medium text-white"
                      : "rounded-tl-xs border border-border/80 bg-card text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                  <span>🤖 AI is typing...</span>
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            {/* Suggested Question Chips (displayed when message history is low or at bottom) */}
            {messages.length <= 3 && !isTyping && (
              <div className="mt-4 pt-2">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-border/80 bg-muted/60 px-3 py-1.5 text-left text-[11px] font-medium text-foreground transition hover:border-terracotta hover:bg-terracotta/10 hover:text-foreground active:scale-95"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/80 bg-card p-3 sm:rounded-b-3xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                disabled={isTyping}
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="grid h-10 w-10 min-h-[44px] min-w-[44px] shrink-0 place-items-center rounded-full bg-terracotta text-white font-bold shadow-sm transition hover:bg-terracotta/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              Instant guidance based on your personalized feasibility report.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
