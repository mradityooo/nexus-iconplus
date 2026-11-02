
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CarFront,
  CalendarDays,
  Clock3,
  MapPin,
  ChevronDown,
  Search,
  CheckCircle2,
  XCircle,
  Gauge,
  Fuel,
  UserRound,
  ClipboardList,
  Navigation,
} from "lucide-react";

type VehicleStatus = "Completed" | "Cancelled";

type VehicleRecord = {
  id: string;
  vehicle: string;
  plateNumber: string;
  date: string;
  day: string;
  month: string;
  year: string;
  time: string;
  purpose: string;
  origin: string;
  destination: string;
  driver: string;
  status: VehicleStatus;
  startOdometer: string;
  endOdometer: string;
  fuel: string;
  notes: string;
};

const initialHistory: VehicleRecord[] = [
  {
    id: "VH-2026-001",
    vehicle: "Mitsubishi Xpander",
    plateNumber: "BE 1234 XX",
    date: "26 Oktober 2026",
    day: "26",
    month: "OKT",
    year: "2026",
    time: "08.00 - 15.00 WIB",
    purpose: "Kunjungan operasional",
    origin: "Kantor PLN Icon Plus Lampung",
    destination: "Area Operasional Lampung",
    driver: "Andi Saputra",
    status: "Completed",
    startOdometer: "24.500 km",
    endOdometer: "24.620 km",
    fuel: "3/4 Tangki",
    notes: "Kendaraan dikembalikan dalam kondisi baik.",
  },
  {
    id: "VH-2026-002",
    vehicle: "Toyota Avanza",
    plateNumber: "BE 5678 XX",
    date: "20 Oktober 2026",
    day: "20",
    month: "OKT",
    year: "2026",
    time: "09.00 - 13.00 WIB",
    purpose: "Koordinasi pekerjaan lapangan",
    origin: "Kantor PLN Icon Plus Lampung",
    destination: "Area Teluk Betung",
    driver: "Budi Santoso",
    status: "Completed",
    startOdometer: "18.200 km",
    endOdometer: "18.265 km",
    fuel: "1/2 Tangki",
    notes: "Penggunaan kendaraan berjalan lancar.",
  },
  {
    id: "VH-2026-003",
    vehicle: "Mitsubishi Xpander",
    plateNumber: "BE 1234 XX",
    date: "15 Oktober 2026",
    day: "15",
    month: "OKT",
    year: "2026",
    time: "08.00 - 12.00 WIB",
    purpose: "Kunjungan kerja",
    origin: "Kantor PLN Icon Plus Lampung",
    destination: "Area Operasional Kedaton",
    driver: "Andi Saputra",
    status: "Cancelled",
    startOdometer: "-",
    endOdometer: "-",
    fuel: "-",
    notes: "Penggunaan kendaraan dibatalkan oleh pemohon.",
  },
  {
    id: "VH-2026-004",
    vehicle: "Toyota Avanza",
    plateNumber: "BE 5678 XX",
    date: "10 Oktober 2026",
    day: "10",
    month: "OKT",
    year: "2026",
    time: "10.00 - 14.00 WIB",
    purpose: "Pengantaran dokumen",
    origin: "Kantor PLN Icon Plus Lampung",
    destination: "Kantor Cabang",
    driver: "Budi Santoso",
    status: "Completed",
    startOdometer: "17.950 km",
    endOdometer: "18.010 km",
    fuel: "Full Tank",
    notes: "Kendaraan dikembalikan dengan kondisi baik.",
  },
];

const filters = [
  { id: "All", label: "Semua" },
  { id: "Completed", label: "Selesai" },
  { id: "Cancelled", label: "Dibatalkan" },
] as const;

const statusStyle: Record<VehicleStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const statusLabel: Record<VehicleStatus, string> = {
  Completed: "Selesai",
  Cancelled: "Dibatalkan",
};

export default function VehicleHistoryPage() {
  const [history] = useState<VehicleRecord[]>(initialHistory);
  const [filter, setFilter] = useState<
    "All" | "Completed" | "Cancelled"
  >("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedCount = history.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = history.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesFilter =
        filter === "All" || item.status === filter;

      const keyword = search.toLowerCase();

      const matchesSearch = [
        item.vehicle,
        item.plateNumber,
        item.id,
        item.destination,
        item.purpose,
      ].some((value) => value.toLowerCase().includes(keyword));

      return matchesFilter && matchesSearch;
    });
  }, [history, filter, search]);

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

          {/* Page Title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
              Vehicle Management
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-tight tracking-tight text-slate-950">
              Vehicle History
            </h1>

            <p className="mt-1 text-xs leading-5 text-black">
              Riwayat penggunaan kendaraan operasional Anda.
            </p>
          </section>

          {/* Statistics */}
          <section className="mb-6 grid grid-cols-3 gap-2">
            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Total Request
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {history.length}
              </p>
            </div>

            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Finish
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {completedCount}
              </p>
            </div>

            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Canceled
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {cancelledCount}
              </p>
            </div>
          </section>

          {/* Search */}
          <section className="mb-4">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-sky-500">
              <Search size={17} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kendaraan atau nomor pengajuan..."
                className="h-full w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </section>

          {/* Filters */}
          <section className="mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setExpandedId(null);
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-semibold transition ${
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

          {/* History List */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Riwayat Kendaraan
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Catatan penggunaan kendaraan sebelumnya.
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-700">
                {filteredHistory.length} Data
              </span>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                <CarFront
                  size={36}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-700">
                  Riwayat tidak ditemukan
                </p>

                <p className="mt-1 px-5 text-xs leading-5 text-slate-500">
                  Coba gunakan kata kunci atau filter lainnya.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="mt-4 text-xs font-bold text-sky-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => {
                  const expanded = expandedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      {/* History Card */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            expanded ? null : item.id
                          )
                        }
                        aria-expanded={expanded}
                        className="w-full p-4 text-left transition hover:bg-slate-50/70"
                      >
                        <div className="flex items-start gap-3">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                            <CarFront size={23} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-950">
                                  {item.vehicle}
                                </h3>

                                <p className="mt-1 text-[10px] font-medium text-slate-500">
                                  {item.plateNumber}
                                </p>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${statusStyle[item.status]}`}
                              >
                                {statusLabel[item.status]}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1.5">
                              <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <CalendarDays
                                  size={12}
                                  className="shrink-0"
                                />
                                {item.date}
                              </p>

                              <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <MapPin
                                  size={12}
                                  className="shrink-0"
                                />
                                <span className="truncate">
                                  {item.destination}
                                </span>
                              </p>
                            </div>

                            <p className="mt-2 text-[10px] font-medium text-slate-500">
                              {item.id}
                            </p>
                          </div>

                          <ChevronDown
                            size={16}
                            className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Detail */}
                      {expanded && (
                        <div className="border-t border-slate-100 bg-slate-50/60 p-4">

                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                              <ClipboardList size={18} />
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-slate-900">
                                Detail Penggunaan
                              </h4>

                              <p className="text-[10px] text-slate-500">
                                {item.id}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">

                            {/* Usage */}
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Informasi Penggunaan
                              </p>

                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <Clock3 size={14} className="mt-0.5 text-slate-400" />
                                  <div>
                                    <p className="text-[10px] text-slate-400">
                                      Waktu Penggunaan
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-800">
                                      {item.time}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Navigation size={14} className="mt-0.5 text-slate-400" />
                                  <div>
                                    <p className="text-[10px] text-slate-400">
                                      Lokasi Awal
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-800">
                                      {item.origin}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <MapPin size={14} className="mt-0.5 text-slate-400" />
                                  <div>
                                    <p className="text-[10px] text-slate-400">
                                      Tujuan
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-800">
                                      {item.destination}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <UserRound size={14} className="mt-0.5 text-slate-400" />
                                  <div>
                                    <p className="text-[10px] text-slate-400">
                                      Pengemudi
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-800">
                                      {item.driver}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Vehicle Condition */}
                            {item.status === "Completed" && (
                              <>
                                <div className="border-t border-slate-200 pt-3">
                                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Kondisi Kendaraan
                                  </p>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                      <Gauge
                                        size={16}
                                        className="text-sky-700"
                                      />
                                      <p className="mt-2 text-[10px] text-slate-400">
                                        Odometer Awal
                                      </p>
                                      <p className="mt-1 text-xs font-bold text-slate-800">
                                        {item.startOdometer}
                                      </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                      <Gauge
                                        size={16}
                                        className="text-emerald-600"
                                      />
                                      <p className="mt-2 text-[10px] text-slate-400">
                                        Odometer Akhir
                                      </p>
                                      <p className="mt-1 text-xs font-bold text-slate-800">
                                        {item.endOdometer}
                                      </p>
                                    </div>

                                    <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                                      <div className="flex items-center gap-2">
                                        <Fuel
                                          size={16}
                                          className="text-sky-700"
                                        />
                                        <div>
                                          <p className="text-[10px] text-slate-400">
                                            Sisa Bahan Bakar
                                          </p>
                                          <p className="mt-1 text-xs font-bold text-slate-800">
                                            {item.fuel}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-[10px] font-bold text-slate-800">
                                    Catatan Penggunaan
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-600">
                                    {item.notes}
                                  </p>
                                </div>
                              </>
                            )}

                            {item.status === "Cancelled" && (
                              <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                                <div className="flex items-center gap-2">
                                  <XCircle
                                    size={15}
                                    className="text-red-600"
                                  />
                                  <p className="text-[10px] font-bold text-red-700">
                                    Penggunaan Dibatalkan
                                  </p>
                                </div>

                                <p className="mt-1 text-xs leading-5 text-red-600">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>

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
