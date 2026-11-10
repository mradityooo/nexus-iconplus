
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CarFront,
  UserRound,
  CalendarCheck,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/auth";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
  {
    label: "Vehicles",
    href: "/admin/vehicles",
    icon: CarFront,
  },
  {
    label: "Drivers",
    href: "/admin/drivers",
    icon: UserRound,
  },
  {
    label: "Reservations",
    href: "/admin/reservations",
    icon: CalendarCheck,
  },
  {
    label: "Accounts",
    href: "/admin/accounts",
    icon: ShieldCheck,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <img
            src="/nexus.png"
            alt="NEXUS"
            className="h-10 w-auto"
          />
          <div>
            <h1 className="font-bold text-slate-900">NEXUS</h1>
            <p className="text-xs text-slate-500">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-[#0095DA]"
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-slate-100"
          >
            <LayoutDashboard size={19} />
            Employee Portal
          </Link>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50">
              <LogOut size={19} />
              Logout
            </button>
          </form>
        </div>
      </aside>

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
