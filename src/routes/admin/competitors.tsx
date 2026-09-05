import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/context/AdminContext";
import { CompetitorsView } from "@/components/admin/CompetitorsView";

export const Route = createFileRoute("/admin/competitors")({
  head: () => ({
    meta: [{ title: "Competitor Management — Admin Portal" }],
  }),
  component: AdminCompetitorsPage,
});

function AdminCompetitorsPage() {
  const { competitors, setCompetitors, categories } = useAdmin();

  return (
    <CompetitorsView
      competitors={competitors}
      categories={categories}
      onCompetitorsChange={setCompetitors}
    />
  );
}
