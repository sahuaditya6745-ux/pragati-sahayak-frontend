import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/context/AdminContext";
import { CategoriesView } from "@/components/admin/CategoriesView";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Category Management — Admin Portal" }],
  }),
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const { categories, setCategories } = useAdmin();

  return (
    <CategoriesView
      categories={categories}
      onCategoriesChange={setCategories}
    />
  );
}
