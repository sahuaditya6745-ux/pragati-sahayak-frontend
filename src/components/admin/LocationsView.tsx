import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  MapPin,
  Trash2,
  Building,
  Home,
  Users,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LocationTree,
  addAdminLocation,
  deleteAdminLocation,
} from "@/services/adminStore";
import { api } from "@/services/api";
import { LocationModal } from "./LocationModal";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface LocationsViewProps {
  locations: LocationTree;
  onLocationsChange: (locations: LocationTree) => void;
  openAddModalInitially?: boolean;
}

export function LocationsView({
  locations,
  onLocationsChange,
  openAddModalInitially = false,
}: LocationsViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(openAddModalInitially);

  // Expanded tree nodes
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({
    "Uttar Pradesh": true,
    Bihar: true,
  });
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({
    "Uttar Pradesh/Lucknow": true,
    "Bihar/Patna": true,
  });

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<{
    state: string;
    district?: string;
    block?: string;
    label: string;
  } | null>(null);

  const toggleState = (st: string) => {
    setExpandedStates((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  const toggleDistrict = (st: string, dst: string) => {
    const key = `${st}/${dst}`;
    setExpandedDistricts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveLocation = async (data: any) => {
    try {
      const updated = await api.createLocation(data);
      onLocationsChange(updated);
      // Expand newly added path
      setExpandedStates((prev) => ({ ...prev, [data.state]: true }));
      if (data.district) {
        setExpandedDistricts((prev) => ({ ...prev, [`${data.state}/${data.district}`]: true }));
      }
      toast.success("Location added successfully!", {
        description: `${data.block || data.district || data.state} was registered in coverage tree.`,
      });
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error("Failed to add location", { description: err?.message });
    }
  };

  const handleDeleteClick = (target: {
    state: string;
    district?: string;
    block?: string;
    label: string;
  }) => {
    setDeleteTarget(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const updated = await api.deleteLocation(
        deleteTarget.state,
        deleteTarget.district,
        deleteTarget.block
      );
      onLocationsChange(updated);
      toast.success("Location removed", {
        description: `"${deleteTarget.label}" was removed from the database.`,
      });
    } catch (err: any) {
      toast.error("Failed to remove location", { description: err?.message });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filtered state keys based on search query
  const filteredStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return Object.keys(locations).sort();

    return Object.keys(locations)
      .sort()
      .filter((state) => {
        if (state.toLowerCase().includes(q)) return true;
        const districts = locations[state] || {};
        return Object.keys(districts).some((district) => {
          if (district.toLowerCase().includes(q)) return true;
          const blocks = districts[district] || {};
          return Object.keys(blocks).some((block) => block.toLowerCase().includes(q));
        });
      });
  }, [locations, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            {t("admin.locations")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage State → District → Block jurisdiction tree and village metadata.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-saffron text-saffron-foreground hover:bg-saffron/90 cursor-pointer shadow-sm font-semibold shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_location")}
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex items-center rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
        </div>
        <div className="ml-4 hidden text-xs text-muted-foreground sm:block">
          Showing {filteredStates.length} states
        </div>
      </div>

      {/* Hierarchical Tree View */}
      <div className="space-y-3">
        {filteredStates.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No locations found matching your search.
          </div>
        ) : (
          filteredStates.map((state) => {
            const districts = locations[state] || {};
            const districtKeys = Object.keys(districts).sort();
            const totalBlocksInState = Object.values(districts).reduce(
              (acc, b) => acc + Object.keys(b).length,
              0
            );
            const isStateExpanded =
              searchQuery.trim() !== "" || !!expandedStates[state];

            return (
              <div
                key={state}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all"
              >
                {/* Level 1: State Row */}
                <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 p-3.5 sm:p-4">
                  <div
                    onClick={() => toggleState(state)}
                    className="flex flex-1 items-center gap-2.5 cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      className="grid h-6 w-6 place-items-center rounded-md hover:bg-accent text-muted-foreground"
                    >
                      {isStateExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <MapPin className="h-4 w-4 text-saffron" />
                    <span className="text-sm font-black text-foreground sm:text-base">
                      {state}
                    </span>
                    <span className="rounded-full bg-saffron/10 px-2 py-0.5 text-[10px] font-extrabold text-saffron">
                      {districtKeys.length} Districts • {totalBlocksInState} Blocks
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteTarget({
                        state,
                        label: `State: ${state}`,
                      })
                    }
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title={`Delete entire state ${state}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Level 2: Districts Container */}
                {isStateExpanded && (
                  <div className="divide-y divide-border/40 p-2 sm:p-3">
                    {districtKeys.map((district) => {
                      const blocks = districts[district] || {};
                      const blockKeys = Object.keys(blocks).sort();
                      const distKey = `${state}/${district}`;
                      const isDistrictExpanded =
                        searchQuery.trim() !== "" || !!expandedDistricts[distKey];

                      return (
                        <div key={district} className="py-2 first:pt-0 last:pb-0">
                          {/* District Row */}
                          <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/20">
                            <div
                              onClick={() => toggleDistrict(state, district)}
                              className="flex flex-1 items-center gap-2 cursor-pointer select-none pl-4"
                            >
                              <button
                                type="button"
                                className="grid h-5 w-5 place-items-center rounded hover:bg-accent text-muted-foreground"
                              >
                                {isDistrictExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <Building className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-xs font-bold text-foreground sm:text-sm">
                                {district}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                {blockKeys.length} Blocks
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteTarget({
                                  state,
                                  district,
                                  label: `District: ${district} (${state})`,
                                })
                              }
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                              title={`Delete district ${district}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          {/* Level 3: Blocks List */}
                          {isDistrictExpanded && (
                            <div className="mt-1 space-y-1.5 pl-10 pr-2">
                              {blockKeys.map((blockName) => {
                                const blockData = blocks[blockName];
                                const villagesCount = blockData?.villages?.length || 0;

                                return (
                                  <div
                                    key={blockName}
                                    className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/60 p-2.5 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Home className="h-3.5 w-3.5 text-green" />
                                        <span className="text-xs font-bold text-foreground">
                                          {blockName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          ({villagesCount} villages)
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Users className="h-3 w-3" /> Pop: ~{blockData?.population?.toLocaleString() || "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <GraduationCap className="h-3 w-3" /> Lit: {blockData?.literacy_rate ?? "N/A"}%
                                        </span>
                                        <span>• Main: {blockData?.primary_occupation ?? "General"}</span>
                                        <span>• {blockData?.nearest_city_km ?? "—"} km to city</span>
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setDeleteTarget({
                                          state,
                                          district,
                                          block: blockName,
                                          label: `Block: ${blockName} (${district}, ${state})`,
                                        })
                                      }
                                      className="h-7 w-7 self-end p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer sm:self-center"
                                      title={`Delete block ${blockName}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        locations={locations}
        onSave={handleSaveLocation}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Administrative Location"
        description={`Are you sure you want to delete ${deleteTarget?.label}? Any dependent districts or blocks within it will also be deleted.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
