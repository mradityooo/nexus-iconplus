"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CarFront,
  Plane,
  CalendarDays,
  Clock3,
  MapPin,
  ChevronDown,
  ChevronRight,
  CalendarCheck,
  CheckCircle2,
  UserRound,
  Navigation,
} from "lucide-react";

type ScheduleItem = {
  id: string;
  type: "Vehicle" | "Travel";
  title: string;
  date: string;
  day: string;
  month: string;
  year: string;
  time: string;
  location: string;
  description: string;
  vehicle?: string;
  driver?: string;
  destination?: string;
  status: "Approved" | "Completed";
};

const schedules: ScheduleItem[] = [
  {
    id: "SCH-2026-001",
    type: "Vehicle",
    title: "Booking Kendaraan",
    date: "02 November 2026",
    day: "02",
    month: "NOV",
    year: "2026",
    time: "08.00 - 12.00 WIB",
    location: "Bandar Lampung",
    description: "Kunjungan kerja ke kantor cabang.",
    vehicle: "Mitsubishi Xpander",
    driver: "Budi Santoso",
    destination: "Kantor Cabang Lampung",
    status: "Approved",
  },
  {
    id: "SCH-2026-002",
    type: "Travel",
    title: "Perjalanan Dinas",
    date: "05 November 2026",
    day: "05",
    month: "NOV",
    year: "2026",
    time: "06.00 - 18.00 WIB",
    location: "Bandar Lampung - Jakarta",
    description: "Koordinasi dan rapat operasional.",
    destination: "Kantor Pusat Jakarta",
    status: "Approved",
  },
  {
    id: "SCH-2026-003",
    type: "Vehicle",
    title: "Booking Kendaraan",
    date: "26 Oktober 2026",
    day: "26",
    month: "OKT",
    year: "2026",
    time: "09.00 - 15.00 WIB",
    location: "Bandar Lampung",
    description: "Kunjungan operasional.",
    vehicle: "Toyota Avanza",
    driver: "Andi Saputra",
    destination: "Area Operasional Lampung",
    status: "Completed",
  },
];

const filters = [
  { id: "All", label: "Semua" },
  { id: "Vehicle", label: "Kendaraan" },
  { id: "Travel", label: "Perjalanan" },
] as const;

export default function MySchedulePage() {
  const [filter, setFilter] = useState<
    "All" | "Vehicle" | "Travel"
  >("All");

  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Completed"
  >("Upcoming");

  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  const upcoming = schedules.filter(
    (item) => item.status === "Approved"
  );

  const completed = schedules.filter(
    (item) => item.status === "Completed"
  );

  const visibleSchedules = (
    activeTab === "Upcoming" ? upcoming : completed
  ).filter(
    (item) => filter === "All" || item.type === filter
  );

  const IconForType = ({ type }: { type: ScheduleItem["type"] }) => {
    return type === "Vehicle" ? (
      <CarFront size={21} />
    ) : (
      <Plane size={21} />
    );
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white shadow-sm">

        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Kembali ke Home"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-900 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <img
              src="/nexus.png"
              alt="NEXUS"
              className="h-10 w-auto object-contain"
            />
          </div>
        </header>

        <div className="px-5 pb-8 pt-2">

          {/* Title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
              Employee Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-tight tracking-tight text-slate-950">
              My Schedule
            </h1>

            <p className="mt-1 text-xs leading-5 text-black">
              Kelola dan pantau jadwal kendaraan serta perjalanan dinas Anda.
            </p>
          </section>

          {/* Banner */}
          <section className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 p-5 text-white">
            <div className="relative z-10 max-w-[260px]">
              <p className="text-xs font-medium text-sky-100">
                Employee Schedule
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Your Schedule, Organized.
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-sky-100">
                Semua jadwal operasional dan perjalanan dinas dalam satu tempat.
              </p>
            </div>

            <CalendarCheck
              size={100}
              strokeWidth={0.8}
              className="absolute -bottom-5 -right-3 rotate-[-12deg] text-white/15"
            />
          </section>

          {/* Statistics */}
          <section className="mb-6 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-sky-700"
                />
                <p className="text-[10px] text-slate-500">
                  Jadwal Mendatang
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-950">
                {upcoming.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />
                <p className="text-[10px] text-slate-500">
                  Jadwal Selesai
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-950">
                {completed.length}
              </p>
            </div>
          </section>

          {/* Tabs */}
          <section className="mb-5 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("Upcoming");
                  setExpandedId(null);
                }}
                className={`h-9 rounded-full text-xs font-bold transition ${
                  activeTab === "Upcoming"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-600"
                }`}
              >
                Mendatang ({upcoming.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("Completed");
                  setExpandedId(null);
                }}
                className={`h-9 rounded-full text-xs font-bold transition ${
                  activeTab === "Completed"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-600"
                }`}
              >
                Selesai ({completed.length})
              </button>
            </div>
          </section>

          {/* Category Filter */}
          <section className="mb-5">
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Kategori Jadwal
            </p>

            <div className="flex gap-2">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setExpandedId(null);
                  }}
                  className={`rounded-full border px-4 py-2 text-[10px] font-semibold transition ${
                    filter === item.id
                      ? "border-sky-700 bg-sky-700 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {/* Schedule List */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  {activeTab === "Upcoming"
                    ? "Jadwal Mendatang"
                    : "Riwayat Jadwal"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {activeTab === "Upcoming"
                    ? "Jadwal yang telah disetujui."
                    : "Daftar kegiatan yang telah selesai."}
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-700">
                {visibleSchedules.length} Jadwal
              </span>
            </div>

            {visibleSchedules.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                <CalendarDays
                  size={35}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-700">
                  Belum ada jadwal
                </p>

                <p className="mt-1 px-5 text-xs leading-5 text-slate-500">
                  Jadwal yang sudah disetujui akan ditampilkan di sini.
                </p>

                <Link
                  href="/my-request"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-700"
                >
                  Lihat My Request
                  <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleSchedules.map((item) => {
                  const expanded = expandedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            expanded ? null : item.id
                          )
                        }
                        aria-expanded={expanded}
                        className="w-full p-3.5 text-left transition hover:bg-slate-50/70"
                      >
                        <div className="flex gap-3">

                          {/* Date */}
                          <div className="flex h-[70px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                            <span className="text-[10px] font-bold tracking-wider text-sky-700">
                              {item.month}
                            </span>

                            <span className="mt-0.5 text-2xl font-bold leading-none text-slate-900">
                              {item.day}
                            </span>

                            <span className="mt-1 text-[9px] text-slate-400">
                              {item.year}
                            </span>
                          </div>

                          {/* Information */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-950">
                                  {item.title}
                                </h3>

                                <p className="mt-1 text-[10px] text-slate-400">
                                  {item.id}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                                {item.status === "Approved"
                                  ? "Approved"
                                  : "Selesai"}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1.5">
                              <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <Clock3 size={12} className="shrink-0" />
                                {item.time}
                              </p>

                              <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">
                                  {item.location}
                                </span>
                              </p>
                            </div>
                          </div>

                          <ChevronDown
                            size={16}
                            className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Details */}
                      {expanded && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                          <div className="mb-4 flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                              <IconForType type={item.type} />
                            </span>

                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                Detail Jadwal
                              </p>

                              <p className="text-[10px] text-slate-500">
                                {item.date}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] text-slate-400">
                                Keperluan
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-800">
                                {item.description}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-400">
                                Tujuan
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-800">
                                <Navigation size={13} className="text-sky-700" />
                                {item.destination}
                              </p>
                            </div>

                            {item.vehicle && (
                              <div>
                                <p className="text-[10px] text-slate-400">
                                  Kendaraan
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-800">
                                  {item.vehicle}
                                </p>
                              </div>
                            )}

                            {item.driver && (
                              <div>
                                <p className="text-[10px] text-slate-400">
                                  Pengemudi
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-800">
                                  <UserRound size={13} />
                                  {item.driver}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-[10px] text-slate-400">
                                Status
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 size={14} />
                                {item.status === "Approved"
                                  ? "Pengajuan telah disetujui"
                                  : "Kegiatan telah selesai"}
                              </p>
                            </div>
                          </div>

                          <Link
                            href="/my-request"
                            className="mt-5 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                          >
                            Lihat Pengajuan
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-400">
              NEXUS · Employees Operations Portal · PLN Icon Plus
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
