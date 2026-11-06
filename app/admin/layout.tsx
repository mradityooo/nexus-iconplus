
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <AdminSidebar />
      </div>

      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
          <div>
            <h2 className="font-semibold text-slate-900">
              Administration
            </h2>
            <p className="text-xs text-slate-500">
              NEXUS Employees Operations Portal
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-[#0095DA]">
            GA
          </div>
        </header>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
