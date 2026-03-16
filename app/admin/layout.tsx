import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/layout/admin-shell";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/");
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
};

export default AdminLayout;
