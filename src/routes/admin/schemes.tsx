import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/context/AdminContext";
import { SchemesView } from "@/components/admin/SchemesView";

export const Route = createFileRoute("/admin/schemes")({
  head: () => ({
    meta: [{ title: "Scheme Management — Admin Portal" }],
  }),
  component: AdminSchemesPage,
});

function AdminSchemesPage() {
  const { schemes, setSchemes } = useAdmin();

  return (
    <SchemesView
      schemes={schemes}
      onSchemesChange={setSchemes}
    />
  );
}
