import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  return <AdminPanel />;
}
