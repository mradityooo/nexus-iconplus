
import {
  Users,
  CarFront,
  CalendarCheck,
  UserRound,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Employees",
    value: "0",
    description: "Registered employees",
    icon: Users,
  },
  {
    title: "Total Vehicles",
    value: "0",
    description: "Operational vehicles",
    icon: CarFront,
  },
  {
    title: "Total Drivers",
    value: "0",
    description: "Active drivers",
    icon: UserRound,
  },
  {
    title: "Reservations",
    value: "0",
    description: "Vehicle reservations",
    icon: CalendarCheck,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[#0095DA]">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Welcome to NEXUS Administration Portal.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0095DA]">
                  <Icon size={22} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">
          Welcome to NEXUS Admin
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Manage employees, vehicles, drivers, accounts, and
          operational vehicle reservations through this
          administration portal.
        </p>
      </div>
    </div>
  );
}
