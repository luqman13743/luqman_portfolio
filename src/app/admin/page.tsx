import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Middleware already guarantees an authenticated session reaches here
  // (unauthenticated requests are redirected to /admin/login before this
  // ever renders), so we can safely send them straight to the dashboard.
  redirect("/admin/dashboard");
}
