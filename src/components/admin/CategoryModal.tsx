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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminCategory, ALL_SECTORS } from "@/services/adminStore";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: AdminCategory | null;
  onSave: (category: AdminCategory) => void;
}

const emptyCategory: AdminCategory = {
  id: "",
  name: "",
  name_hi: "",
  sector: "Manufacturing",
  min_investment: 50000,
  max_investment: 250000,
  avg_margin_percent: 22,
  risk_level: "Low",
  breakeven_months: 12,
};

interface CategoryFormErrors {
  name?: string | undefined;
  min_investment?: string | undefined;
  max_investment?: string | undefined;
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<AdminCategory>(emptyCategory);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({ ...category });
    } else {
      setFormData({
        ...emptyCategory,
        id: `category_${Date.now()}`,
      });
    }
    setErrors({});
    setIsSaving(false);
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: CategoryFormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.min_investment || formData.min_investment <= 0)
      newErrors.min_investment = "Min investment must be > 0";
    if (!formData.max_investment || formData.max_investment < formData.min_investment)
      newErrors.max_investment = "Max investment must be ≥ Min investment";

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Business Category" : "Add Business Category"}
          </DialogTitle>
          <DialogDescription>
            Define industry sector economics, capital thresholds, margins, and risk profiles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Name (English) *</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Flour Mill"
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
              <Label htmlFor="cat-name-hi">Category Name (Hindi)</Label>
              <Input
                id="cat-name-hi"
                placeholder="e.g. आटा चक्की"
                value={formData.name_hi}
                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-sector">Sector *</Label>
              <Select
                value={formData.sector}
                onValueChange={(val) => setFormData({ ...formData, sector: val })}
              >
                <SelectTrigger id="cat-sector">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SECTORS.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-risk">Risk Level *</Label>
              <Select
                value={formData.risk_level}
                onValueChange={(val) =>
                  setFormData({ ...formData, risk_level: val as "Low" | "Medium" | "High" })
                }
              >
                <SelectTrigger id="cat-risk">
                  <SelectValue placeholder="Select Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-min-inv">Min Investment (₹) *</Label>
              <Input
                id="cat-min-inv"
                type="number"
                min="1000"
                value={formData.min_investment}
                onChange={(e) => {
                  setFormData({ ...formData, min_investment: Number(e.target.value) });
                  if (errors.min_investment) setErrors({ ...errors, min_investment: undefined });
                }}
                className={errors.min_investment ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.min_investment && (
                <p className="text-xs text-destructive font-medium">{errors.min_investment}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-max-inv">Max Investment (₹) *</Label>
              <Input
                id="cat-max-inv"
                type="number"
                min="1000"
                value={formData.max_investment}
                onChange={(e) => {
                  setFormData({ ...formData, max_investment: Number(e.target.value) });
                  if (errors.max_investment) setErrors({ ...errors, max_investment: undefined });
                }}
                className={errors.max_investment ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
              {errors.max_investment && (
                <p className="text-xs text-destructive font-medium">{errors.max_investment}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-margin">Average Margin %</Label>
              <Input
                id="cat-margin"
                type="number"
                min="1"
                max="100"
                value={formData.avg_margin_percent}
                onChange={(e) =>
                  setFormData({ ...formData, avg_margin_percent: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-breakeven">Breakeven (Months)</Label>
              <Input
                id="cat-breakeven"
                type="number"
                min="1"
                max="60"
                value={formData.breakeven_months}
                onChange={(e) =>
                  setFormData({ ...formData, breakeven_months: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[130px]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                category ? "Save Category" : "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
