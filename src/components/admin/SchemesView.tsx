import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Landmark,
  ExternalLink,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminScheme,
  toggleSchemeActive,
  deleteAdminScheme,
  saveAdminScheme,
} from "@/services/adminStore";
import { api } from "@/services/api";
import { SchemeModal } from "./SchemeModal";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface SchemesViewProps {
  schemes: AdminScheme[];
  onSchemesChange: (schemes: AdminScheme[]) => void;
  openAddModalInitially?: boolean;
}

export function SchemesView({
  schemes,
  onSchemesChange,
  openAddModalInitially = false,
}: SchemesViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [editingScheme, setEditingScheme] = useState<AdminScheme | null>(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [schemeToDelete, setSchemeToDelete] = useState<AdminScheme | null>(null);

  // Filtered schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.name_hi && s.name_hi.includes(searchQuery));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && s.is_active) ||
        (statusFilter === "inactive" && !s.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [schemes, searchQuery, statusFilter]);

  const handleOpenAdd = () => {
    setEditingScheme(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (scheme: AdminScheme) => {
    setEditingScheme(scheme);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, current: boolean, name: string) => {
    const updated = toggleSchemeActive(id);
    onSchemesChange(updated);
    toast.success(
      `${name} is now ${!current ? t("admin.active") : t("admin.inactive")}`,
    );
  };

  const handleDeleteClick = (scheme: AdminScheme) => {
    setSchemeToDelete(scheme);
    setDeleteId(scheme.id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const updated = await api.deleteScheme(deleteId);
      onSchemesChange(updated);
      toast.success(
        `Scheme "${schemeToDelete?.name ?? "Scheme"}" deleted successfully`,
      );
    } catch (err: any) {
      toast.error("Failed to delete scheme", { description: err?.message });
    } finally {
      setDeleteId(null);
      setSchemeToDelete(null);
    }
  };

  const handleSaveScheme = async (saved: AdminScheme) => {
    try {
      const updated = editingScheme
        ? await api.updateScheme(editingScheme.id, saved)
        : await api.createScheme(saved);
      onSchemesChange(updated);
      toast.success(
        `Scheme "${saved.name}" ${editingScheme ? "updated" : "created"} successfully`,
      );
      setIsModalOpen(false);
      setEditingScheme(null);
    } catch (err: any) {
      toast.error("Failed to save scheme", { description: err?.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            {t("admin.schemes")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Configure lending programs, interest subventions, capital margin rules, and criteria.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-saffron text-saffron-foreground hover:bg-saffron/90 cursor-pointer shadow-sm font-semibold shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_scheme")}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{t("admin.status")}:</span>
          <Select
            value={statusFilter}
            onValueChange={(val: any) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-[130px] text-xs">
              <SelectValue placeholder={t("admin.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="active">{t("admin.active")}</SelectItem>
              <SelectItem value="inactive">{t("admin.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden rounded-xl border border-border bg-card shadow-sm md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t("admin.scheme_name")}</TableHead>
              <TableHead>{t("admin.ministry")}</TableHead>
              <TableHead>{t("admin.max_loan")}</TableHead>
              <TableHead>{t("admin.interest")}</TableHead>
              <TableHead>{t("admin.subsidy")}</TableHead>
              <TableHead className="text-center">{t("admin.status")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchemes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No schemes found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredSchemes.map((scheme) => (
                <TableRow key={scheme.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-foreground">{scheme.name}</p>
                      {scheme.name_hi && (
                        <p className="text-xs text-muted-foreground">{scheme.name_hi}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {scheme.ministry}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground whitespace-nowrap">
                    ₹{(scheme.max_loan / 100000).toLocaleString("en-IN")} Lakh
                  </TableCell>

                  <TableCell className="text-xs text-foreground whitespace-nowrap">
                    {scheme.interest_rate}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                      {scheme.subsidy_percent}%
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={scheme.is_active}
                        onCheckedChange={() =>
                          handleToggleStatus(scheme.id, scheme.is_active, scheme.name)
                        }
                        aria-label={`Toggle status for ${scheme.name}`}
                      />
                      <span
                        className={`text-[11px] font-bold ${
                          scheme.is_active ? "text-green" : "text-muted-foreground"
                        }`}
                      >
                        {scheme.is_active ? "Active" : "Off"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(scheme)}
                        className="h-8 w-8 p-0 text-foreground hover:bg-accent cursor-pointer"
                        title="Edit Scheme"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(scheme)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Scheme"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View (shown only on mobile) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredSchemes.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No schemes found matching your search.
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{scheme.name}</h3>
                  <p className="text-xs text-muted-foreground">{scheme.ministry}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Switch
                    checked={scheme.is_active}
                    onCheckedChange={() =>
                      handleToggleStatus(scheme.id, scheme.is_active, scheme.name)
                    }
                  />
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {scheme.is_active ? "On" : "Off"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-2.5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground">Max Loan</span>
                  <p className="font-bold text-foreground">
                    ₹{(scheme.max_loan / 100000).toLocaleString("en-IN")}L
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Interest</span>
                  <p className="font-bold text-foreground">{scheme.interest_rate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Subsidy</span>
                  <p className="font-bold text-emerald-600">{scheme.subsidy_percent}%</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(scheme)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(scheme)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scheme Form Modal */}
      <SchemeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        scheme={editingScheme}
        onSave={handleSaveScheme}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setSchemeToDelete(null);
          }
        }}
        title="Delete Government Scheme"
        description={`Are you sure you want to delete "${schemeToDelete?.name}"? This scheme will no longer be considered during entrepreneur feasibility checks.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
