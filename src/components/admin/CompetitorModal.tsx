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
import { AdminCompetitor, AdminCategory } from "@/services/adminStore";

interface CompetitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitor: AdminCompetitor | null;
  categories: AdminCategory[];
  onSave: (competitor: AdminCompetitor) => void;
}

const emptyCompetitor: AdminCompetitor = {
  id: "",
  name: "",
  category_id: "flour_mill",
  type: "Local Enterprise",
  state: "Uttar Pradesh",
  district: "Lucknow",
  block: "Malihabad",
  village: "Rasoolpur",
  distance_km: 3.0,
  years_active: 4,
  rating: 4.2,
  est_monthly_revenue: 45000,
};

interface CompetitorFormErrors {
  name?: string | undefined;
  category_id?: string | undefined;
  distance_km?: string | undefined;
  est_monthly_revenue?: string | undefined;
}

export function CompetitorModal({
  open,
  onOpenChange,
  competitor,
  categories,
  onSave,
}: CompetitorModalProps) {
  const [formData, setFormData] = useState<AdminCompetitor>(emptyCompetitor);
  const [errors, setErrors] = useState<CompetitorFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (competitor) {
      setFormData({ ...competitor });
    } else {
      setFormData({
        ...emptyCompetitor,
        id: `comp_${Date.now()}`,
        category_id: categories[0]?.id || "flour_mill",
      });
    }
    setErrors({});
    setIsSaving(false);
  }, [competitor, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: CompetitorFormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Competitor name is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (formData.distance_km < 0) newErrors.distance_km = "Distance must be ≥ 0";
    if (formData.est_monthly_revenue < 0)
      newErrors.est_monthly_revenue = "Revenue must be ≥ 0";

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
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {competitor ? "Edit Competitor Record" : "Add New Competitor"}
          </DialogTitle>
          <DialogDescription>
            Record competitor metrics used to model local market saturation and pricing power.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="comp-name">Business Name *</Label>
              <Input
                id="comp-name"
                placeholder="e.g. Sharma Atta Chakki"
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
              <Label htmlFor="comp-cat">Business Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(val) => setFormData({ ...formData, category_id: val })}
              >
                <SelectTrigger id="comp-cat">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.name_hi || cat.sector})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="comp-type">Enterprise Type</Label>
              <Input
                id="comp-type"
                placeholder="e.g. Flour Mill / Atta Chakki"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comp-village">Village / Local Area</Label>
              <Input
                id="comp-village"
                placeholder="e.g. Rasoolpur"
                value={formData.village || ""}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="comp-state">State</Label>
              <Input
                id="comp-state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comp-district">District</Label>
              <Input
                id="comp-district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comp-block">Block</Label>
              <Input
                id="comp-block"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="comp-dist">Distance (km)</Label>
              <Input
                id="comp-dist"
                type="number"
                step="0.1"
                min="0"
                value={formData.distance_km}
                onChange={(e) =>
                  setFormData({ ...formData, distance_km: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comp-years">Years Active</Label>
              <Input
                id="comp-years"
                type="number"
                min="0"
                value={formData.years_active}
                onChange={(e) =>
                  setFormData({ ...formData, years_active: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comp-rating">Rating (1-5)</Label>
              <Input
                id="comp-rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comp-rev">Monthly Rev (₹)</Label>
              <Input
                id="comp-rev"
                type="number"
                min="0"
                value={formData.est_monthly_revenue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    est_monthly_revenue: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                competitor ? "Save Competitor" : "Add Competitor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
