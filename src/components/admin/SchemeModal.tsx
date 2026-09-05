import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminScheme, ALL_STATES, ALL_SECTORS } from "@/services/adminStore";

interface SchemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheme: AdminScheme | null;
  onSave: (scheme: AdminScheme) => void;
}

const emptyScheme: AdminScheme = {
  id: "",
  name: "",
  name_hi: "",
  ministry: "",
  agency: "",
  description: "",
  max_loan: 1000000,
  min_loan: 50000,
  interest_rate: "8.5% - 11.5%",
  subsidy_percent: 25,
  tenure_years: "3 - 7 Years",
  eligibility_criteria: "• Age 18+\n• New micro-enterprise in rural or semi-urban area\n• No prior bank default",
  applicable_states: ["All India"],
  applicable_categories: ["Manufacturing", "Service", "Retail", "Agriculture"],
  application_url: "https://www.india.gov.in/",
  is_active: true,
};

interface SchemeFormErrors {
  name?: string | undefined;
  ministry?: string | undefined;
  max_loan?: string | undefined;
  interest_rate?: string | undefined;
}

export function SchemeModal({ open, onOpenChange, scheme, onSave }: SchemeModalProps) {
  const [formData, setFormData] = useState<AdminScheme>(emptyScheme);
  const [errors, setErrors] = useState<SchemeFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scheme) {
      setFormData({ ...scheme });
    } else {
      setFormData({
        ...emptyScheme,
        id: `scheme_${Date.now()}`,
      });
    }
    setErrors({});
    setIsSaving(false);
  }, [scheme, open]);

  const toggleState = (st: string) => {
    setFormData((prev) => {
      const current = prev.applicable_states || [];
      const withoutAllIndia = current.filter((s) => s !== "All India");

      if (st === "All India") {
        return { ...prev, applicable_states: ["All India"] };
      }

      if (current.includes(st)) {
        const next = current.filter((s) => s !== st);
        return { ...prev, applicable_states: next.length === 0 ? ["All India"] : next };
      } else {
        return { ...prev, applicable_states: [...withoutAllIndia, st] };
      }
    });
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const current = prev.applicable_categories || [];
      if (current.includes(cat)) {
        return { ...prev, applicable_categories: current.filter((c) => c !== cat) };
      } else {
        return { ...prev, applicable_categories: [...current, cat] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: SchemeFormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Scheme name is required";
    if (!formData.ministry.trim()) newErrors.ministry = "Ministry is required";
    if (!formData.max_loan || formData.max_loan <= 0) newErrors.max_loan = "Max loan must be > 0";
    if (!formData.interest_rate.trim()) newErrors.interest_rate = "Interest rate is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields highlighted in red.");
      return;
    }

    try {
      setIsSaving(true);
      await new Promise((r) => setTimeout(r, 350));
      onSave(formData);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scheme ? "Edit Government Scheme" : "Add New Government Scheme"}</DialogTitle>
          <DialogDescription>
            Configure policy parameters, loan ceilings, subsidy percentages, and target eligibility.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Scheme Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="scheme-name">Scheme Name (English) *</Label>
              <Input
                id="scheme-name"
                placeholder="e.g. Prime Minister Employment Generation Programme"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={errors.name ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheme-name-hi">Scheme Name (Hindi)</Label>
              <Input
                id="scheme-name-hi"
                placeholder="e.g. प्रधानमंत्री रोजगार सृजन कार्यक्रम"
                value={formData.name_hi || ""}
                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
              />
            </div>
          </div>

          {/* Ministry & Agency */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="scheme-ministry">Ministry / Department *</Label>
              <Input
                id="scheme-ministry"
                placeholder="e.g. Ministry of MSME"
                value={formData.ministry}
                onChange={(e) => {
                  setFormData({ ...formData, ministry: e.target.value });
                  if (errors.ministry) setErrors({ ...errors, ministry: undefined });
                }}
                className={errors.ministry ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.ministry && <p className="text-xs text-destructive font-medium">{errors.ministry}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheme-agency">Implementing Agency</Label>
              <Input
                id="scheme-agency"
                placeholder="e.g. KVIC / District Industries Center (DIC)"
                value={formData.agency || ""}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
              />
            </div>
          </div>

          {/* Loan Ceilings & Financials */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="scheme-min-loan">Min Loan (₹)</Label>
              <Input
                id="scheme-min-loan"
                type="number"
                min="0"
                value={formData.min_loan}
                onChange={(e) => setFormData({ ...formData, min_loan: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="scheme-max-loan">Max Loan (₹) *</Label>
              <Input
                id="scheme-max-loan"
                type="number"
                min="1000"
                value={formData.max_loan}
                onChange={(e) => {
                  setFormData({ ...formData, max_loan: Number(e.target.value) });
                  if (errors.max_loan) setErrors({ ...errors, max_loan: undefined });
                }}
                className={errors.max_loan ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.max_loan && <p className="text-xs text-destructive font-medium">{errors.max_loan}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="scheme-interest">Interest Rate *</Label>
              <Input
                id="scheme-interest"
                placeholder="e.g. 8.5% - 11.5%"
                value={formData.interest_rate}
                onChange={(e) => {
                  setFormData({ ...formData, interest_rate: e.target.value });
                  if (errors.interest_rate) setErrors({ ...errors, interest_rate: undefined });
                }}
                className={errors.interest_rate ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.interest_rate && (
                <p className="text-xs text-destructive font-medium">{errors.interest_rate}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="scheme-subsidy">Subsidy %</Label>
              <Input
                id="scheme-subsidy"
                type="number"
                min="0"
                max="100"
                value={formData.subsidy_percent}
                onChange={(e) =>
                  setFormData({ ...formData, subsidy_percent: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Tenure & Application URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="scheme-tenure">Tenure (Years)</Label>
              <Input
                id="scheme-tenure"
                placeholder="e.g. 3 - 7 Years"
                value={formData.tenure_years}
                onChange={(e) => setFormData({ ...formData, tenure_years: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheme-url">Official Application URL</Label>
              <Input
                id="scheme-url"
                placeholder="https://..."
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="scheme-desc">Description</Label>
            <Textarea
              id="scheme-desc"
              rows={2}
              placeholder="Brief scheme overview, highlights, and subsidy benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-1.5">
            <Label htmlFor="scheme-eligibility">Eligibility Criteria</Label>
            <Textarea
              id="scheme-eligibility"
              rows={3}
              placeholder="Enter eligibility rules (e.g. age, qualifications, collateral exemptions)..."
              value={formData.eligibility_criteria}
              onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
            />
          </div>

          {/* Applicable Categories (Checkboxes) */}
          <div className="space-y-2">
            <Label>Applicable Sectors / Categories</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ALL_SECTORS.map((cat) => {
                const checked = (formData.applicable_categories || []).includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <span className="text-xs font-medium">{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Applicable States (Checkboxes) */}
          <div className="space-y-2">
            <Label>Applicable States</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ALL_STATES.map((st) => {
                const checked = (formData.applicable_states || []).includes(st);
                return (
                  <label
                    key={st}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleState(st)}
                    />
                    <span className="text-xs font-medium truncate">{st}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
            <div>
              <p className="text-sm font-semibold">Scheme Status</p>
              <p className="text-xs text-muted-foreground">
                Active schemes will appear in borrower eligibility calculations and match lists.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${formData.is_active ? "text-green" : "text-muted-foreground"}`}>
                {formData.is_active ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                scheme ? "Save Changes" : "Create Scheme"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
