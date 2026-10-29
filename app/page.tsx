"use client";

import "./globals.css";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  LogOut,
  CarFront,
  Fuel,
  ClipboardList,
  CalendarDays,
  History,
  CircleHelp,
  FileText,
  UserRound,
  ChevronDown,
} from "lucide-react";

const services = [
  {
    name: "Vehicle Reservation",
    icon: "/vehicle.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Pre-Use Inspection",
    icon: "/note.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
   {
    name: "Travel",
    icon: "/plane.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Claims",
    icon: "/claim.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Career Planing",
    icon: "/career.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Leave & Attendance",
    icon: "/clock.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Request",
    icon: "/request.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
  },
  {
    name: "Work From Anywhere",
    icon: "/laptop.png",
    iconStyle: "from-sky-100/80 to-sky-100/40",
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
  const [language, setLanguage] = useState<"id" | "en">("id");
  const router = useRouter();
  return (
    <main
        className=" min-h-screen">
      <div className="relative mx-auto min-h-dvh w-full max-w-[480px] overflow-hidden bg-transparent pb-8 sm:shadow-sm">

        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-5 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/nexus.png"
              alt="NEXUS"
              className="h-10 w-auto object-contain"
            />
          </div>

        <div className="flex shrink-0 items-center gap-2">
          <section className="rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                aria-label="Bahasa Indonesia"
                aria-pressed={language === "id"}
                onClick={() => setLanguage("id")}
                className={`flex h-5 items-center justify-center rounded-full transition-all duration-200 ${
                  language === "id"
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src="/id.svg"
                  alt="Indonesia"
                  className="h-5 w-5 rounded-full object-cover"
                />
              </button>

              <button
                type="button"
                aria-label="English"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
                className={`flex h-5 items-center justify-center rounded-full transition-all duration-200 ${
                  language === "en"
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src="/gb.svg"
                  alt="English"
                  className="h-5 w-5 rounded-full object-cover"
                />
              </button>
            </div>
          </section>

          {/* Profile */}
          <button
            type="button"
            aria-label="Open profile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            <UserRound size={22} strokeWidth={1.8} />
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

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-slate-">
              Manage your operational requirements and business travel.
            </p>
          </section>

          <section>
            <div className="grid grid-cols-4 gap-2.5">
              
            {services.map((service) => {
              return (
                <Link
                  key={service.name}
                  href={
                    service.name === "Vehicle Reservation"
                      ? "/vehicle-reservation"
                        : service.name === "Pre-Use Inspection"
                        ? "/pre-use-inspection"
                          : service.name === "Travel"
                          ? "/travel"
                            : service.name === "Claims"
                            ? "/claims"
                              : service.name === "Career Planing"
                              ? "/career-planing"
                                : service.name === "Leave & Attendance"
                                ? "/leave-attendance"
                                  : service.name === "Work From Anywhere"
                                  ? "/work-from-anywhere"
                                  : "#"
                  }
                  className="group flex min-w-0 flex-col items-center text-center active:scale-[0.97]">
                 
                  <div className={`flex aspect-square w-full items-center justify-center rounded-sm border border-white/0 bg-gradient-to-br from-slate-200/80 to-slate-200/50 backdrop-blur-xl`}>
                    
                  <img
                    src={service.icon}
                    alt={service.name}
                    className="h-[42px] w-[42px] object-contain brightness-0 saturate-100"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(40%) sepia(94%) saturate(1700%) hue-rotate(165deg) brightness(95%) contrast(102%)",
                    }}
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
          <section className="-mt-4">
              <div className="mb-3 border-b border-slate-300 pb-2">
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
                    <div className="flex h-[50px] w-[50px] max-w-full items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-slate-200/80 to-slate-200/50 backdrop-blur-xl">
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

          
        {/* News */}
          <section className="-mt-4">
            <div className="mb-3 border-b border-slate-300 pb-2">
              <h3 className="text-[17px] font-bold tracking-[-0.35px] text-slate-900">
                News
              </h3>
            </div>

            <Link
              href="/news"
              className="group block overflow-hidden rounded-md bg-slate-100 transition active:scale-[0.99]"
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-gradient-to-br from-sky-100 via-slate-100 to-blue-100">
                {/* <img
                  src="/news-banner.jpg"
                  alt="NEXUS News"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                /> */}
              </div>
              <div className="bg-cyan-50/80 px-3 py-3">
              <h4 className="text-[12px] font-medium leading-relaxed text-black-1000 transition group-hover:text-blue-800">
                Judul berita akan ditampilkan di sini
              </h4>
            </div>
            </Link>
          </section>


        </div>
      </div>
    </main>
  );
}
