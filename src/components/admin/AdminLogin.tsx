import { useState } from "react";
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setAdminSession } from "@/services/adminStore";
import { api } from "@/services/api";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("admin@pragatisahayak.in");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.adminLogin(trimmedEmail, trimmedPass);
      if (res && res.success) {
        setAdminSession(trimmedEmail);
        toast.success("Admin login successful!", {
          description: "Welcome back to the PragatiSahayak control panel.",
        });
        onSuccess();
      } else {
        setError(res?.error || "Invalid credentials. Use admin@pragatisahayak.in and admin123.");
        toast.error("Authentication failed", {
          description: res?.error || "Check your email and password.",
        });
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
      toast.error("Authentication error", { description: err?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@pragatisahayak.in");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron/10 text-saffron ring-8 ring-saffron/5">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
            Sign in to manage government schemes, categories, locations & market data.
          </p>
        </div>

        {/* Demo Credentials Pill */}
        <div className="mt-6 rounded-xl border border-saffron/20 bg-saffron/5 p-3 text-xs text-foreground">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-saffron flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Demo Access:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-bold text-saffron underline hover:text-saffron/80 cursor-pointer"
            >
              Autofill
            </button>
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
            <div>Email: <strong className="text-foreground">admin@pragatisahayak.in</strong></div>
            <div>Password: <strong className="text-foreground">admin123</strong></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Admin Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@pragatisahayak.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron font-bold text-saffron-foreground hover:bg-saffron/90 cursor-pointer"
          >
            {loading ? "Verifying..." : "Sign In to Admin"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Protected administrative access for PragatiSahayak platform officers.
        </div>
      </div>
    </div>
  );
}
