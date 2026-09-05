import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Edit2, Trash2, Filter, Briefcase } from "lucide-react";
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
  AdminCategory,
  ALL_SECTORS,
  saveAdminCategory,
  deleteAdminCategory,
} from "@/services/adminStore";
import { api } from "@/services/api";
import { CategoryModal } from "./CategoryModal";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface CategoriesViewProps {
  categories: AdminCategory[];
  onCategoriesChange: (categories: AdminCategory[]) => void;
  openAddModalInitially?: boolean;
}

export function CategoriesView({
  categories,
  onCategoriesChange,
  openAddModalInitially = false,
}: CategoriesViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.name_hi && c.name_hi.includes(searchQuery)) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        sectorFilter === "all" || c.sector.toLowerCase() === sectorFilter.toLowerCase();

      return matchesSearch && matchesSector;
    });
  }, [categories, searchQuery, sectorFilter]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (cat: AdminCategory) => {
    const isNew = !categories.some((c) => c.id === cat.id);
    try {
      const updated = isNew
        ? await api.createCategory(cat)
        : await api.updateCategory(cat.id, cat);
      onCategoriesChange(updated);
      toast.success(
        isNew ? "Category added successfully!" : "Category updated successfully!",
        { description: `"${cat.name}" catalog entry saved.` }
      );
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      toast.error("Failed to save category", { description: err?.message });
    }
  };

  const handleDeleteClick = (cat: AdminCategory) => {
    setCategoryToDelete(cat);
    setDeleteId(cat.id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const name = categoryToDelete?.name || "Category";
    try {
      const updated = await api.deleteCategory(deleteId);
      onCategoriesChange(updated);
      toast.success("Category deleted", {
        description: `"${name}" was removed from the database.`,
      });
    } catch (err: any) {
      toast.error("Failed to delete category", { description: err?.message });
    } finally {
      setDeleteId(null);
      setCategoryToDelete(null);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
            Low Risk
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600">
            Medium Risk
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600">
            High Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
            {risk}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            {t("admin.categories")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Maintain industry sector definitions, capital envelopes, profit margins, and risk tiers.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-saffron text-saffron-foreground hover:bg-saffron/90 cursor-pointer shadow-sm font-semibold shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_category")}
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
          <span className="text-xs font-medium text-muted-foreground">{t("admin.sector")}:</span>
          <Select value={sectorFilter} onValueChange={(val) => setSectorFilter(val)}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder={t("admin.sector")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {ALL_SECTORS.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  {sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border border-border bg-card shadow-sm md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("form.category")}</TableHead>
              <TableHead>{t("admin.sector")}</TableHead>
              <TableHead>{t("admin.investment_range")}</TableHead>
              <TableHead>Margin & Breakeven</TableHead>
              <TableHead>{t("admin.risk")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No categories found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-foreground">{cat.name}</p>
                      {cat.name_hi && (
                        <p className="text-xs text-muted-foreground">{cat.name_hi}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                      {cat.sector}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-foreground whitespace-nowrap">
                    ₹{cat.min_investment.toLocaleString("en-IN")} – ₹{cat.max_investment.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-xs text-foreground whitespace-nowrap">
                    <span className="font-bold text-green">{cat.avg_margin_percent}%</span> margin • ~{cat.breakeven_months} mo
                  </TableCell>

                  <TableCell>{getRiskBadge(cat.risk_level)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(cat)}
                        className="h-8 w-8 p-0 text-foreground hover:bg-accent cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(cat)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Category"
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

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredCategories.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No categories found matching your search.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {cat.name} {cat.name_hi && <span className="font-normal text-muted-foreground">({cat.name_hi})</span>}
                  </h3>
                  <p className="text-xs text-muted-foreground">Sector: {cat.sector}</p>
                </div>
                <div>{getRiskBadge(cat.risk_level)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground">Investment</span>
                  <p className="font-bold text-foreground">
                    ₹{(cat.min_investment / 1000).toFixed(0)}k - ₹{(cat.max_investment / 1000).toFixed(0)}k
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Margin / Breakeven</span>
                  <p className="font-bold text-green">
                    {cat.avg_margin_percent}% (~{cat.breakeven_months} mo)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(cat)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(cat)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setCategoryToDelete(null);
          }
        }}
        title="Delete Business Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? Any enterprise feasibility reports linked to this category may need reassessment.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
