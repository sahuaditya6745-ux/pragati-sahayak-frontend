import { useState, useMemo } from "react";
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
import { LocationTree, ALL_STATES } from "@/services/adminStore";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: LocationTree;
  onSave: (data: {
    state: string;
    district: string;
    block: string;
    population?: number;
    literacy_rate?: number;
    primary_occupation?: string;
    nearest_city_km?: number;
    villages?: string[];
  }) => void;
}

interface LocationFormErrors {
  state?: string | undefined;
  district?: string | undefined;
  block?: string | undefined;
}

export function LocationModal({
  open,
  onOpenChange,
  locations,
  onSave,
}: LocationModalProps) {
  const existingStates = useMemo(() => Object.keys(locations).sort(), [locations]);

  const [isNewState, setIsNewState] = useState(false);
  const [selectedState, setSelectedState] = useState(existingStates[0] || "Uttar Pradesh");
  const [customState, setCustomState] = useState("");

  const existingDistricts = useMemo(() => {
    if (isNewState || !locations[selectedState]) return [];
    return Object.keys(locations[selectedState]).sort();
  }, [locations, selectedState, isNewState]);

  const [isNewDistrict, setIsNewDistrict] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");

  const [blockName, setBlockName] = useState("");
  const [population, setPopulation] = useState(5000);
  const [literacyRate, setLiteracyRate] = useState(65);
  const [primaryOccupation, setPrimaryOccupation] = useState("Agriculture");
  const [nearestCityKm, setNearestCityKm] = useState(25);
  const [villagesText, setVillagesText] = useState("");
  const [errors, setErrors] = useState<LocationFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const stateToUse = isNewState ? customState.trim() : selectedState;
  const districtToUse = isNewState || isNewDistrict ? customDistrict.trim() : selectedDistrict;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: LocationFormErrors = {};

    if (!stateToUse) newErrors.state = "State is required";
    if (!districtToUse) newErrors.district = "District is required";
    if (!blockName.trim()) newErrors.block = "Block name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields highlighted in red.");
      return;
    }

    const villages = villagesText
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    try {
      setIsSaving(true);
      await new Promise((r) => setTimeout(r, 350));
      onSave({
        state: stateToUse,
        district: districtToUse,
        block: blockName.trim(),
        population: Number(population) || 5000,
        literacy_rate: Number(literacyRate) || 65,
        primary_occupation: primaryOccupation,
        nearest_city_km: Number(nearestCityKm) || 25,
        villages: villages.length > 0 ? villages : [blockName.trim() + " Village"],
      });

      // Reset fields
      setBlockName("");
      setVillagesText("");
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Administrative Location</DialogTitle>
          <DialogDescription>
            Register new geographical hierarchy (State → District → Block) for feasibility checks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* State Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>State *</Label>
              <button
                type="button"
                onClick={() => setIsNewState(!isNewState)}
                className="text-xs text-primary font-medium hover:underline"
              >
                {isNewState ? "Choose existing State" : "+ Enter new State"}
              </button>
            </div>

            {isNewState ? (
              <Input
                placeholder="e.g. Haryana"
                value={customState}
                onChange={(e) => {
                  setCustomState(e.target.value);
                  if (errors.state) setErrors({ ...errors, state: undefined });
                }}
                className={errors.state ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
            ) : (
              <Select
                value={selectedState}
                onValueChange={(val) => {
                  setSelectedState(val);
                  setSelectedDistrict("");
                  if (errors.state) setErrors({ ...errors, state: undefined });
                }}
              >
                <SelectTrigger className={errors.state ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {existingStates.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.state && <p className="text-xs text-destructive font-medium">{errors.state}</p>}
          </div>

          {/* District Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>District *</Label>
              {!isNewState && existingDistricts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsNewDistrict(!isNewDistrict)}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {isNewDistrict ? "Choose existing District" : "+ Enter new District"}
                </button>
              )}
            </div>

            {isNewState || isNewDistrict || existingDistricts.length === 0 ? (
              <Input
                placeholder="e.g. Rohtak"
                value={customDistrict}
                onChange={(e) => {
                  setCustomDistrict(e.target.value);
                  if (errors.district) setErrors({ ...errors, district: undefined });
                }}
                className={errors.district ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
              />
            ) : (
              <Select
                value={selectedDistrict}
                onValueChange={(val) => {
                  setSelectedDistrict(val);
                  if (errors.district) setErrors({ ...errors, district: undefined });
                }}
              >
                <SelectTrigger className={errors.district ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {existingDistricts.map((dst) => (
                    <SelectItem key={dst} value={dst}>
                      {dst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.district && <p className="text-xs text-destructive font-medium">{errors.district}</p>}
          </div>

          {/* Block Name */}
          <div className="space-y-1.5">
            <Label htmlFor="loc-block">Block / Taluka Name *</Label>
            <Input
              id="loc-block"
              placeholder="e.g. Sampla"
              value={blockName}
              onChange={(e) => {
                setBlockName(e.target.value);
                if (errors.block) setErrors({ ...errors, block: undefined });
              }}
              className={errors.block ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
            />
            {errors.block && <p className="text-xs text-destructive font-medium">{errors.block}</p>}
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="loc-pop">Est. Population</Label>
              <Input
                id="loc-pop"
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-lit">Literacy Rate (%)</Label>
              <Input
                id="loc-lit"
                type="number"
                min="1"
                max="100"
                value={literacyRate}
                onChange={(e) => setLiteracyRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="loc-occ">Primary Occupation</Label>
              <Input
                id="loc-occ"
                placeholder="Agriculture / Mixed / Trade"
                value={primaryOccupation}
                onChange={(e) => setPrimaryOccupation(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-city">Nearest City (km)</Label>
              <Input
                id="loc-city"
                type="number"
                min="0"
                value={nearestCityKm}
                onChange={(e) => setNearestCityKm(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Villages */}
          <div className="space-y-1.5">
            <Label htmlFor="loc-villages">Sample Villages (comma separated)</Label>
            <Input
              id="loc-villages"
              placeholder="e.g. Chhara, Bhalaut, Ismaila"
              value={villagesText}
              onChange={(e) => setVillagesText(e.target.value)}
            />
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
                "Save Location"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
