import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexPage,
});

function AdminIndexPage() {
  const { session } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && session.isAuthenticated) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [session, navigate]);

  return null;
}
