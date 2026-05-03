import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
  return <AdminDashboard />;
}
