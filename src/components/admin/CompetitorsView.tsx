import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Edit2, Trash2, Filter, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  AdminCompetitor,
  AdminCategory,
  saveAdminCompetitor,
  deleteAdminCompetitor,
} from "@/services/adminStore";
import { api } from "@/services/api";
import { CompetitorModal } from "./CompetitorModal";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface CompetitorsViewProps {
  competitors: AdminCompetitor[];
  categories: AdminCategory[];
  onCompetitorsChange: (competitors: AdminCompetitor[]) => void;
  openAddModalInitially?: boolean;
}

export function CompetitorsView({
  competitors,
  categories,
  onCompetitorsChange,
  openAddModalInitially = false,
}: CompetitorsViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [editingCompetitor, setEditingCompetitor] = useState<AdminCompetitor | null>(null);

  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [competitorToDelete, setCompetitorToDelete] = useState<AdminCompetitor | null>(null);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filteredCompetitors = useMemo(() => {
    return competitors.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.village && c.village.toLowerCase().includes(q)) ||
        (c.block && c.block.toLowerCase().includes(q)) ||
        (c.type && c.type.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "all" || c.category_id === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [competitors, searchQuery, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingCompetitor(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: AdminCompetitor) => {
    setEditingCompetitor(comp);
    setIsModalOpen(true);
  };

  const handleSaveCompetitor = async (comp: AdminCompetitor) => {
    const isNew = !competitors.some((c) => c.id === comp.id);
    try {
      const updated = isNew
        ? await api.createCompetitor(comp)
        : await api.updateCompetitor(comp.id, comp);
      onCompetitorsChange(updated);
      toast.success(
        isNew ? "Competitor registered!" : "Competitor details updated!",
        { description: `"${comp.name}" stored in benchmark dataset.` }
      );
      setIsModalOpen(false);
      setEditingCompetitor(null);
    } catch (err: any) {
      toast.error("Failed to save competitor", { description: err?.message });
    }
  };

  const handleDeleteClick = (comp: AdminCompetitor) => {
    setCompetitorToDelete(comp);
    setDeleteId(comp.id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    const name = competitorToDelete?.name || "Competitor";
    try {
      const updated = await api.deleteCompetitor(deleteId);
      onCompetitorsChange(updated);
      toast.success("Competitor deleted", {
        description: `"${name}" removed from competitor registry.`,
      });
    } catch (err: any) {
      toast.error("Failed to delete competitor", { description: err?.message });
    } finally {
      setDeleteId(null);
      setCompetitorToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            {t("admin.competitors")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Maintain village-level businesses to calculate market saturation indices and revenue benchmarks.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-saffron text-saffron-foreground hover:bg-saffron/90 cursor-pointer shadow-sm font-semibold shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_competitor")}
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
          <span className="text-xs font-medium text-muted-foreground">{t("form.category")}:</span>
          <Select
            value={categoryFilter}
            onValueChange={(val) => setCategoryFilter(val)}
          >
            <SelectTrigger className="w-[160px] text-xs">
              <SelectValue placeholder={t("form.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-xl border border-border bg-card shadow-sm md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>{t("form.category")}</TableHead>
              <TableHead>{t("admin.village")} & Location</TableHead>
              <TableHead>{t("admin.distance")}</TableHead>
              <TableHead>{t("admin.revenue")}</TableHead>
              <TableHead>{t("admin.rating")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompetitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No competitors found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompetitors.map((comp) => (
                <TableRow key={comp.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-sm font-bold text-foreground">{comp.name}</p>
                      <p className="text-xs text-muted-foreground">{comp.type}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {categoryMap.get(comp.category_id) || comp.category_id}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {comp.village || "Local Area"}
                    </span>
                    {comp.block && <span> • {comp.block}</span>}
                    {comp.district && <span>, {comp.district}</span>}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground whitespace-nowrap">
                    {comp.distance_km} km
                  </TableCell>

                  <TableCell className="text-xs font-bold text-foreground whitespace-nowrap">
                    ₹{comp.est_monthly_revenue.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{comp.rating}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({comp.years_active}y)
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(comp)}
                        className="h-8 w-8 p-0 text-foreground hover:bg-accent cursor-pointer"
                        title="Edit Competitor"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(comp)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Competitor"
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

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredCompetitors.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No competitors found matching your criteria.
          </div>
        ) : (
          filteredCompetitors.map((comp) => (
            <div
              key={comp.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{comp.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {categoryMap.get(comp.category_id) || comp.category_id} • {comp.type}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-xs font-bold text-amber-600">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {comp.rating}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground">Distance</span>
                  <p className="font-bold text-foreground">{comp.distance_km} km</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Monthly Rev</span>
                  <p className="font-bold text-foreground">
                    ₹{(comp.est_monthly_revenue / 1000).toFixed(0)}k
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Location</span>
                  <p className="truncate font-semibold text-foreground">
                    {comp.village || comp.block}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(comp)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(comp)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Competitor Modal */}
      <CompetitorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        competitor={editingCompetitor}
        categories={categories}
        onSave={handleSaveCompetitor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setCompetitorToDelete(null);
          }
        }}
        title="Delete Competitor Record"
        description={`Are you sure you want to delete "${competitorToDelete?.name}"? Local market competition scores will recalculate automatically.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
