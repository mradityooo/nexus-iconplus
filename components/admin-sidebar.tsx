
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CarFront,
  UserRound,
  CalendarCheck,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menus = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Vehicles", href: "/admin/vehicles", icon: CarFront },
  { label: "Drivers", href: "/admin/drivers", icon: UserRound },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Accounts", href: "/admin/accounts", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center gap-3 border-b px-6">
        <img src="/nexus.png" alt="NEXUS" className="h-10 w-auto" />

        <div>
          <h1 className="font-bold text-slate-900">NEXUS</h1>
          <p className="text-xs text-slate-500">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        {menus.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-sky-50 text-[#0095DA]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#0095DA]"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
