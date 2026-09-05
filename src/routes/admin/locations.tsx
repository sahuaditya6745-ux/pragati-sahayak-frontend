import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/context/AdminContext";
import { LocationsView } from "@/components/admin/LocationsView";

export const Route = createFileRoute("/admin/locations")({
  head: () => ({
    meta: [{ title: "Location Hierarchy — Admin Portal" }],
  }),
  component: AdminLocationsPage,
});

function AdminLocationsPage() {
  const { locations, setLocations } = useAdmin();

  return (
    <LocationsView
      locations={locations}
      onLocationsChange={setLocations}
    />
  );
}
