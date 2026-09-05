import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  FileCheck,
  Building2,
  TrendingUp,
  User,
  HelpCircle,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";
import type { MatchedScheme } from "@/types/business";
import { api } from "@/services/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  confidence?: "high" | "medium" | "low";
}

interface AiChatTabProps {
  data: FullResultsData;
}

export function AiChatTab({ data }: AiChatTabProps) {
  const {
    formData,
    category,
    financials,
    loanDetails,
    matchedSchemes,
    threatsDetailed,
    totalScore,
    scoreLabel,
  } = data;

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const village = formData.village || "your village";
  const block = formData.block || "your block";
  const state = formData.state || "your state";
  const business = category?.name || "Rural Enterprise";

  const topEligibleScheme = (matchedSchemes || []).find((s: MatchedScheme) => s.eligible);
  const schemeName = topEligibleScheme ? topEligibleScheme.name : "PMEGP / Mudra Yojana";
  const schemeUrl =
    topEligibleScheme?.application_url ||
    topEligibleScheme?.url ||
    "https://www.kviconline.gov.in/pmegpeportal/";

  const initialAiGreeting = `Namaste ${
    formData.fullName || "Entrepreneur"
  }! I am your PragatiSahayak AI Enterprise Advisor.

I have analyzed your entire feasibility dossier for ${business} in ${village}, ${block}, ${state}.

You can ask me about:
• Government subsidies and scheme application steps
• Required licenses (FSSAI, Udyam MSME, Trade NOC)
• How to negotiate bank loans and margin money
• Risk mitigation and competitor strategy
• Sourcing equipment and raw materials

How can I help you get started?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-tab-1",
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
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedQuestions = [
    `What licenses do I need for ${business}?`,
    `How do I apply for ${topEligibleScheme ? (topEligibleScheme.name.split("(")[0] ?? "").trim() : "government schemes"}?`,
    "What are the biggest risks and how do I avoid them?",
    "How can I increase my viability score?",
    "What documents do I need for the bank loan?",
    "How much working capital should I keep aside?",
  ];

  const generateMockResponse = (
    userQuery: string,
  ): { text: string; confidence: "high" | "medium" | "low" } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Licenses & Registrations
    if (
      q.includes("license") ||
      q.includes("registration") ||
      q.includes("permit") ||
      q.includes("fssai") ||
      q.includes("udyam")
    ) {
      const isFood = ["flour_mill", "oil_mill", "papad_making", "dairy_farm"].includes(
        category.id,
      );
      return {
        text:
          `For setting up a ${business} in ${state}, you typically need the following registrations:\n\n` +
          `1. 📋 Udyam MSME Registration (100% free and online at udyamregistration.gov.in with Aadhaar).\n` +
          (isFood
            ? `2. 🥛 FSSAI Basic Food Registration/License (mandatory for food processing businesses).\n`
            : `2. 🏪 Local Shop & Establishment Act / Trade NOC from your Gram Panchayat or Municipality.\n`) +
          `3. 🏢 Business Current Account with your local bank under the firm's name.\n` +
          `4. 🧾 GST Registration (mandatory only if your annual turnover exceeds ₹40 Lakhs for goods / ₹20 Lakhs for services).\n` +
          (category.id === "brick_kiln"
            ? `5. 💨 State Pollution Control Board (SPCB) consent to establish.\n`
            : ``) +
          `\n💡 Pro-tip: Keep your Udyam certificate ready before applying for any bank loan or government subsidy.`,
        confidence: "high",
      };
    }

    // 2. Government Schemes & Application Process
    if (
      q.includes("apply") ||
      q.includes("scheme") ||
      q.includes("subsidy") ||
      q.includes("pmegp") ||
      q.includes("mudra") ||
      q.includes("pmfme") ||
      q.includes("standup")
    ) {
      const subsidyPercent = topEligibleScheme?.subsidyPercentApplied || 35;
      return {
        text:
          `To apply for ${schemeName}:\n\n` +
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
    if (
      q.includes("risk") ||
      q.includes("threat") ||
      q.includes("challenge") ||
      q.includes("problem") ||
      q.includes("danger") ||
      q.includes("avoid")
    ) {
      const threatSnippets = threatsDetailed
        .slice(0, 3)
        .map(
          (t, i) =>
            `${i + 1}. ⚠️ ${t.name}: ${t.description.slice(0, 140)}... (Mitigation: ${t.mitigation})`,
        )
        .join("\n\n");
      return {
        text:
          `Based on local analysis for ${business} in ${village}, ${block}, the primary risks are:\n\n` +
          (threatSnippets ||
            `1. ⚠️ Seasonal income shifts: Agricultural harvest cycles can create fluctuating cash flow.\n2. ⚠️ Informal credit (Udhaar): High unpaid customer credit can cause a cash crunch.\n3. ⚠️ Machine repair delays: Distances to the nearest city hub (${data.blockMeta.nearest_city_km} km) can increase downtime.`) +
          `\n\n🛡️ Key Mitigation: Keep a 15-day inventory buffer, limit customer credit to ₹500, and save 10% monthly revenue as an emergency fund.`,
        confidence: "high",
      };
    }

    // 4. Viability Score & How to increase
    if (
      q.includes("score") ||
      q.includes("viability") ||
      q.includes("increase") ||
      q.includes("improve") ||
      q.includes("rating")
    ) {
      return {
        text:
          `Your current Business Viability Score is ${totalScore}/100 (${scoreLabel}).\n\n` +
          `Here is how you can boost your viability score even higher:\n` +
          `1. 💰 Increase Own Capital: Investing 25-30% own margin reduces debt load and monthly EMI stress.\n` +
          `2. 🤝 Anchor B2B Tie-ups: Secure advance orders from local kirana shops or schools before launching.\n` +
          `3. 📱 Digital Operations: Use UPI QR codes with audio alerts and maintain digital ledgers to build credit history.\n` +
          `4. ⚡ Power Reliability: Keep a small generator or solar backup for critical processing motors.`,
        confidence: "high",
      };
    }

    // 5. Loan & Documents
    if (
      q.includes("document") ||
      q.includes("loan") ||
      q.includes("bank") ||
      q.includes("emi") ||
      q.includes("interest") ||
      q.includes("margin") ||
      q.includes("capital")
    ) {
      return {
        text:
          `For securing your project loan of approx. ₹${(
            financials.avgInvestment - formData.capital
          ).toLocaleString("en-IN")}:\n\n` +
          `Essential Checklist:\n` +
          `• 📄 Aadhaar Card & PAN Card (self-attested)\n` +
          `• 🏠 Proof of Residence (Voter ID / Ration Card / Electricity bill)\n` +
          `• 🌾 Land Ownership or Rent Agreement (min. 3-year lease for shop/unit)\n` +
          `• 📑 6-month Bank Account Statement of savings account\n` +
          `• 📊 7-page Feasibility Dossier & DPR (Download the PDF report from the top right button!)\n` +
          `• 🚜 Machinery Quotation from an authorized manufacturer/dealer\n\n` +
          `💡 Note: Loans under Mudra Shishu/Kishor (up to ₹5 Lakhs) and PMEGP do not require collateral security.`,
        confidence: "high",
      };
    }

    // 6. Working capital
    if (q.includes("working capital") || q.includes("reserve") || q.includes("cash")) {
      const wc = Math.round(financials.avgInvestment * 0.25);
      return {
        text:
          `For a ${business} with an estimated project cost of ₹${financials.avgInvestment.toLocaleString(
            "en-IN",
          )}:\n\n` +
          `Recommended Working Capital: approx. ₹${wc.toLocaleString("en-IN")} (25% of project cost).\n\n` +
          `This covers:\n` +
          `• 30–45 days raw material stock\n` +
          `• Electricity and utility bills\n` +
          `• Emergency repairs and transit\n` +
          `• Cushion for customers paying after weekly market (haat) days.`,
        confidence: "high",
      };
    }

    // Fallback response
    return {
      text:
        `Thank you for your question about ${business} in ${village}.\n\n` +
        `Based on our rural database for ${block} (${state}):\n` +
        `• Average Project Cost: ₹${financials.avgInvestment.toLocaleString("en-IN")}\n` +
        `• Expected Monthly Profit: ~₹${financials.estimatedMonthlyProfit.toLocaleString(
          "en-IN",
        )} at steady capacity\n` +
        `• Break-even Timeline: approx. ${category.breakeven_months} months\n\n` +
        `To get more specific advice, try asking about "licenses", "government schemes", "loan documents", or "competitor strategy".`,
      confidence: "medium",
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    api
      .chatWithAI(query, {
        category,
        formData,
        financials,
        loanDetails,
        threatsDetailed,
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
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-tab-${Date.now()}`,
        sender: "ai",
        text: initialAiGreeting,
        timestamp: "Just now",
        confidence: "high",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            AI Rural Enterprise Advisor
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Trained on rural Indian trade data, government subsidy rules, and MSME regulations for{" "}
            <span className="font-semibold text-foreground">{category.name}</span> in{" "}
            <span className="font-semibold text-foreground">
              {village}, {block}
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-ochre/[0.03] p-4 sm:p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta mb-2.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions (Click to Ask)</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-left text-xs font-medium text-foreground transition hover:border-terracotta hover:bg-terracotta/10 hover:text-foreground active:scale-95 disabled:opacity-50"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="human-card shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              {/* Sender label & Confidence tag */}
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                {msg.sender === "ai" ? (
                  <>
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <Bot className="h-3.5 w-3.5 text-saffron" />
                      PragatiSahayak AI
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          msg.confidence === "high"
                            ? "bg-emerald-500"
                            : msg.confidence === "medium"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="text-[11px] font-medium capitalize">
                        {msg.confidence || "high"} confidence
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    You
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-4 leading-relaxed whitespace-pre-line text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "rounded-tr-xs bg-saffron font-medium text-saffron-foreground"
                    : "rounded-tl-xs border border-border/80 bg-muted/30 text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex flex-col items-start space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Bot className="h-3.5 w-3.5 text-saffron" />
                <span>AI Advisor is analyzing...</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-border bg-muted/40 px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-saffron" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-saffron [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-saffron [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-border/80 bg-muted/20 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business, licenses, subsidies, or suppliers..."
              disabled={isTyping}
              className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-5 font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Instant guidance synthesized from verified government and rural enterprise datasets.
          </p>
        </div>
      </div>
    </div>
  );
}
