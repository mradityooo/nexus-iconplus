
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CarFront,
  Plane,
  Fuel,
  ReceiptText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  UserCheck,
  XCircle,
  ClipboardList,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

type RequestStatus =
  | "Submitted"
  | "Under Review"
  | "Pending Approval"
  | "Approved"
  | "Rejected";

type RequestItem = {
  id: string;
  type: string;
  category: string;
  date: string;
  description: string;
  amount: string;
  status: RequestStatus;
  submitted: boolean;
  reviewed: boolean;
  approved: boolean;
  note: string;
  route: string;
  employeeName: string;
  gaName: string;
  supervisorName: string;
};

const initialRequests: RequestItem[] = [
  {
    id: "REQ-2026-001",
    type: "Booking Kendaraan",
    category: "Vehicle Reservation",
    date: "28 Oktober 2026",
    description: "Penggunaan kendaraan untuk kunjungan kerja",
    amount: "-",
    status: "Under Review",
    submitted: true,
    reviewed: false,
    approved: false,
    note: "Pengajuan sedang diperiksa oleh petugas operasional.",
    route: "/vehicle-reservation",
    employeeName: "Muhammad Radityo",
    gaName: "Andi Saputra",
    supervisorName: "Budi Santoso",
  },
];

const filters = [
  { id: "All", label: "Semua" },
  { id: "In Progress", label: "Proses" },
  { id: "Approved", label: "Disetujui" },
  { id: "Rejected", label: "Ditolak" },
] as const;

const statusStyle: Record<RequestStatus, string> = {
  Submitted: "bg-slate-100 text-slate-700",
  "Under Review": "bg-blue-50 text-blue-700",
  "Pending Approval": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

const statusLabel: Record<RequestStatus, string> = {
  Submitted: "Terkirim",
  "Under Review": "Sedang Diperiksa",
  "Pending Approval": "Menunggu Approval",
  Approved: "Disetujui",
  Rejected: "Ditolak",
};

const steps = [
  {
    title: "Pengajuan Terkirim",
    icon: ClipboardList,
  },
  {
    title: "Pemeriksaan Data",
    icon: FileSearch,
  },
  {
    title: "Persetujuan Atasan",
    icon: UserCheck,
  },
  {
    title: "Selesai",
    icon: CheckCircle2,
  },
];

function getProgress(request: RequestItem) {
  if (request.status === "Rejected") return 2;
  if (request.status === "Approved") return 4;
  if (request.status === "Pending Approval") return 2;
  if (request.status === "Under Review") return 1;
  return 0;
}

function getIcon(category: string) {
  switch (category) {
    case "Vehicle Reservation":
      return CarFront;
    case "Travel":
      return Plane;
    case "Claims":
      return Fuel;
    default:
      return ReceiptText;
  }
}

export default function MyRequestPage() {
  const [requests] = useState<RequestItem[]>(initialRequests);
  const [filter, setFilter] = useState<
    "All" | "In Progress" | "Approved" | "Rejected"
  >("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalCount = requests.length;

  const progressCount = requests.filter(
    (item) =>
      item.status === "Submitted" ||
      item.status === "Under Review" ||
      item.status === "Pending Approval"
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected"
  ).length;

  const filteredRequests = requests.filter((item) => {
    if (filter === "All") return true;

    if (filter === "In Progress") {
      return [
        "Submitted",
        "Under Review",
        "Pending Approval",
      ].includes(item.status);
    }

    return item.status === filter;
  });

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
              My Request
            </h1>

            <p className="mt-1 text-xs leading-5 text-black">
              Pantau seluruh pengajuan dan proses persetujuan Anda.
            </p>
          </section>

          {/* Summary */}
          <section className="mb-5 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Total Request
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {totalCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Dalam Proses
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {progressCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-black">
                Disetujui
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {approvedCount}
              </p>
            </div>
          </section>

          
          {/* Filter */}
          <section className="mb-5 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-4 gap-1">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setExpandedId(null);
                  }}
                  className={`flex h-9 min-w-0 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all duration-200 ${
                    filter === item.id
                      ? "bg-white text-black shadow-sm"
                      : "text-black hover:bg-white/40"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Request List */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Daftar Pengajuan
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Riwayat dan status seluruh pengajuan Anda.
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-700">
                {filteredRequests.length} Request
              </span>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                <ClipboardList
                  size={34}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-700">
                  Belum ada pengajuan
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Pengajuan dengan kategori ini belum tersedia.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((item) => {
                  const Icon = getIcon(item.category);
                  const isExpanded = expandedId === item.id;
                  const progress = getProgress(item);

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      {/* Request Card */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            isExpanded ? null : item.id
                          )
                        }
                        aria-expanded={isExpanded}
                        className="w-full p-4 text-left transition hover:bg-slate-50/70"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                            <Icon size={21} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-slate-950">
                                {item.type}
                              </h3>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${statusStyle[item.status]}`}
                              >
                                {statusLabel[item.status]}
                              </span>
                            </div>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {item.id}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-700">
                              {item.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                <CalendarDays size={12} />
                                {item.date}
                              </span>

                              <span className="text-[10px] font-semibold text-slate-800">
                                {item.amount}
                              </span>
                            </div>
                          </div>

                          <ChevronDown
                            size={17}
                            className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/60 p-4">

                          <div className="mb-4">
                            <h4 className="text-xs font-bold text-slate-900">
                              Progress Pengajuan
                            </h4>
                            <p className="mt-1 text-[10px] text-slate-500">
                              Tahapan pemeriksaan dan persetujuan.
                            </p>
                          </div>

                          <div className="space-y-4">
                            {steps.map((step, index) => {
                              const StepIcon = step.icon;
                              const completed = index < progress;
                              const rejectedStep =
                                item.status === "Rejected" &&
                                index === 2;

                              const active =
                                !completed &&
                                !rejectedStep &&
                                index === progress;

                              const actors = [
                                {
                                    name: item.employeeName,
                                    role: "Karyawan",
                                },
                                {
                                    name: item.gaName,
                                    role: "General Affairs (GA)",
                                },
                                {
                                    name: item.supervisorName,
                                    role: "Branch Head",
                                },
                                {
                                    name: item.status === "Approved"
                                    ? item.supervisorName
                                    : item.status === "Rejected"
                                        ? item.supervisorName
                                        : "-",
                                    role: item.status === "Approved"
                                    ? "Persetujuan selesai"
                                    : item.status === "Rejected"
                                        ? "Keputusan penolakan"
                                        : "Menunggu proses",
                                },
                                ];

                              return (
                                <div
                                  key={step.title}
                                  className="relative flex gap-3"
                                >
                                  {index !== steps.length - 1 && (
                                    <div
                                      className={`absolute left-[15px] top-8 h-7 w-0.5 ${
                                        completed
                                          ? "bg-emerald-400"
                                          : "bg-slate-200"
                                      }`}
                                    />
                                  )}

                                  <div
                                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                      rejectedStep
                                        ? "bg-red-100 text-red-600"
                                        : completed
                                          ? "bg-emerald-100 text-emerald-700"
                                          : active
                                            ? "bg-sky-100 text-sky-700"
                                            : "bg-slate-200 text-slate-400"
                                    }`}
                                  >
                                    {rejectedStep ? (
                                      <XCircle size={16} />
                                    ) : (
                                      <StepIcon size={16} />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1 pb-2">
                                    <p
                                      className={`text-xs font-bold ${
                                        rejectedStep
                                          ? "text-red-700"
                                          : completed
                                            ? "text-emerald-700"
                                            : active
                                              ? "text-sky-700"
                                              : "text-slate-400"
                                      }`}
                                    >
                                      {rejectedStep
                                        ? "Pengajuan Ditolak"
                                        : step.title}
                                    </p>

                                    <p className="mt-1 text-[11px] leading-4 text-black">
                                         {actors[index].name} - {actors[index].role}
                                    </p>

                                    
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Note */}
                          <div
                            className={`mt-3 rounded-xl border p-3 ${
                              item.status === "Rejected"
                                ? "border-red-100 bg-red-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <p className="text-[10px] font-bold text-slate-800">
                              Catatan Pengajuan
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              {item.note}
                            </p>
                          </div>

                          {/* Source Link */}
                          <Link
                            href={item.route}
                            className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                          >
                            Lihat Layanan
                            <ExternalLink size={13} />
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
              NEXUS · Employees Operations Portal
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
