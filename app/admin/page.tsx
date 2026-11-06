
import {
  Users,
  CarFront,
  UserRound,
  CalendarCheck,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const statistics = [
  {
    title: "Total Employees",
    value: "0",
    description: "Registered employees",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Vehicles",
    value: "0",
    description: "Operational vehicles",
    icon: CarFront,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Total Drivers",
    value: "0",
    description: "Active drivers",
    icon: UserRound,
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Reservations",
    value: "0",
    description: "Vehicle reservations",
    icon: CalendarCheck,
    color: "bg-amber-50 text-amber-600",
  },
];

export default async function AdminDashboard() {
  const session = await auth();

  if (
    !session?.user ||
    !["GA", "ADMIN"].includes(session.user.role)
  ) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#0095DA]">
          OVERVIEW
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Welcome back, {session.user.email}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={23} />
                </div>

                <ArrowUpRight
                  size={19}
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

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Clock3 size={19} className="text-[#0095DA]" />
            <h2 className="font-semibold text-slate-900">
              Recent Activities
            </h2>
          </div>

          <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
            No recent activities available.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Account Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-slate-700">
                {session.user.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Access Role</p>
              <p className="mt-1 inline-flex rounded-lg bg-sky-50 px-3 py-1 text-sm font-semibold text-[#0095DA]">
                {session.user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
