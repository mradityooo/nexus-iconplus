
"use client";

import Link from "next/link";
import {
  Bell,
  LogOut,
  CarFront,
  ClipboardCheck,
  Fuel,
  ReceiptText,
  ClipboardList,
  CalendarDays,
  History,
  CircleHelp,
  FileText,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    name: "Vehicle Reservation",
    icon: CarFront,
    iconStyle: "bg-slate-100 text-slate-700",
  },
  {
    name: "Pre-Use Inspection",
    icon: ClipboardCheck,
    iconStyle: "bg-slate-100 text-slate-700",
  },
  {
    name: "Claim Fuel",
    icon: Fuel,
    iconStyle: "bg-slate-100 text-slate-700",
  },
  {
    name: "Reimbursement",
    icon: ReceiptText,
    iconStyle: "bg-slate-100 text-slate-700",
  },
];

const workspace = [
  { name: "My Request", icon: ClipboardList },
  { name: "My Schedule", icon: CalendarDays },
  { name: "Vehicle History", icon: History },
  { name: "Help & Guide", icon: CircleHelp },
  { name: "Add Note", icon: FileText },
];

const activities = [
  {
    name: "Vehicle Reservation",
    detail: "Mitsubishi Xpander · BE 2321 ALG",
    status: "Approved",
    statusColor: "bg-emerald-500",
    icon: CarFront,
    iconStyle: "bg-slate-100 text-slate-700",
  },
  {
    name: "Claim Fuel",
    detail: "Pertamax RON 92",
    status: "Pending",
    statusColor: "bg-amber-400",
    icon: Fuel,
    iconStyle: "bg-slate-100 text-slate-700",
  },
];

export default function HomePage() {
  return (
    <main
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundAttachment: "scroll",
        }}
      >
      <div className="mx-auto min-h-dvh w-full max-w-[480px] overflow-hidden bg-white pb-8 sm:shadow-sm">

        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-5 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-red-600 text-xl font-extrabold text-white shadow-sm shadow-red-200">
              N
            </div>

            <div className="min-w-0">
              <h1 className="text-[19px] font-extrabold leading-5 tracking-[-0.6px]">
                NEXUS
              </h1>
              <p className="mt-1 text-[10px] font-medium tracking-[0.05px] text-slate-500">
                Employees Operations Portal
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.9">
            <button
              aria-label="Notifications"
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95"
            >
              <Bell className="h-[21px] w-[21px]" strokeWidth={1.8} />
            </button>

            <button
              aria-label="Logout"
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95"
            >
              <LogOut className="h-[20px] w-[20px]" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <div className="space-y-8 px-5">

          {/* Greeting */}
          <section className="pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Employee Portal
            </p>

            <h2 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Good Morning, Radit
              <span className="ml-1.5 inline-block text-[23px]"></span>
            </h2>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[0] text-slate-500">
              Manage your operational requirements and business travel.
            </p>
          </section>

          <section>
            <div className="grid grid-cols-4 gap-2.5">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.name}
                    href={
                      service.name === "Vehicle Reservation"
                        ? "/vehicle-reservation"
                          : service.name === "Pre-Use Inspection"
                          ? "/pre-use-inspection"
                            : service.name === "Claim Fuel"
                            ? "/fuel-claim"
                          : "#"
                    }
                    className="group flex min-w-0 flex-col items-center text-center active:scale-[0.97]"
                  >
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded-[2px] transition group-hover:brightness-[0.98] ${service.iconStyle}`}
                    >
                      <Icon
                        className="h-[35px] w-[35px]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <span className="mt-2.5 min-h-[30px] w-full text-[10px] font-semibold leading-[1] tracking-[-0.15px] text-slate-700">
                      {service.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* My Workspace */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[17px] font-bold tracking-[-0.35px]">
                My Workspace
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {workspace.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    className="flex min-w-0 flex-col items-center text-center active:scale-95"
                  >
                    <div className="flex h-[50px] w-[50px] max-w-full items-center justify-center rounded-full border border-slate-100 bg-[#F5F7FA] text-slate-600 transition hover:bg-slate-100">
                      <Icon
                        className="h-[21px] w-[21px]"
                        strokeWidth={1.7}
                      />
                    </div>

                    <span className="mt-2.5 w-full text-[10px] font-medium leading-[1.45] tracking-[-0.2px] text-slate-600">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[17px] font-bold tracking-[-0.35px]">
                  Recent Activity
                </h3>
                <p className="mt-1.5 max-w-[310px] text-[12px] leading-[0] text-slate-500">
                  Your latest updates
                </p>
              </div>

              <button className="flex items-center gap-0.5 rounded-lg py-2 pl-2 text-[12px] font-semibold text-red-600 active:opacity-70">
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <button
                    key={activity.name}
                    className="flex w-full items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:bg-slate-50 active:bg-slate-100"
                  >
                    <div
                      className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[1px] ${activity.iconStyle}`}
                    >
                      <Icon
                        className="h-[22px] w-[22px]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold tracking-[-0.15px] text-slate-800">
                        {activity.name}
                      </p>

                      <p className="mt-0 truncate text-[11px] leading-4 text-slate-500">
                        {activity.detail}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-center gap-1.5">
                      <span
                        className={`h-[13px] w-[13px] rounded-full ring-4 ring-slate-50 ${activity.statusColor}`}
                      />
                      <span className="sr-only">{activity.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
