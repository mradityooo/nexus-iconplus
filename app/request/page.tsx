
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Laptop,
  Check,
  Plus,
  Search,
  Send,
  Settings2,
  X,
  CircleCheck,
} from "lucide-react";

type RequestItem = {
  id: string;
  title: string;
  category: string;
  priority: string;
  neededDate: string;
  description: string;
  status: "Pending" | "In Review" | "Approved" | "Rejected";
  submittedAt: string;
};

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-slate-700";

const initialRequests: RequestItem[] = [
  {
    id: "REQ-001",
    title: "Permintaan Laptop Operasional",
    category: "IT & Equipment",
    priority: "Normal",
    neededDate: "2026-11-10",
    description: "Permintaan perangkat untuk mendukung pekerjaan operasional.",
    status: "In Review",
    submittedAt: "29 Okt 2026",
  },
  {
    id: "REQ-002",
    title: "Permintaan Akses Aplikasi",
    category: "System Access",
    priority: "High",
    neededDate: "2026-11-05",
    description: "Permintaan akses ke aplikasi internal perusahaan.",
    status: "Approved",
    submittedAt: "27 Okt 2026",
  },
];

const categories = [
  "IT & Equipment",
  "System Access",
  "Facility",
  "Administration",
  "Other",
];

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: RequestItem["status"]) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700";
    case "Rejected":
      return "bg-red-50 text-red-600";
    case "In Review":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function RequestPage() {
  const [activeTab, setActiveTab] = useState<"new" | "list">("new");
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<RequestItem | null>(null);
  const [notice, setNotice] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [neededDate, setNeededDate] = useState("");
  const [description, setDescription] = useState("");

  const filteredRequests = requests.filter((request) => {
    const keyword = search.toLowerCase().trim();
    

    return (
      request.title.toLowerCase().includes(keyword) ||
      request.id.toLowerCase().includes(keyword) ||
      request.category.toLowerCase().includes(keyword)
    );
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (neededDate < getTodayLocal()) {
      setNotice("Tanggal dibutuhkan tidak boleh sebelum hari ini.");
      return;
    }

    const newRequest: RequestItem = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      title: title.trim(),
      category,
      priority,
      neededDate,
      description: description.trim(),
      status: "Pending",
      submittedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setRequests((previous) => [newRequest, ...previous]);
    setTitle("");
    setCategory("");
    setPriority("Normal");
    setNeededDate("");
    setDescription("");
    setNotice(`Request ${newRequest.id} berhasil diajukan.`);
    setActiveTab("list");
  }

  return (
    <main
      className="min-h-screen bg-white"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to Home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
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
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Employee Services
            </p>

            <h2 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Request
            </h2>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-slate-">
              Submit and track your operational requests in one place.
            </p>
          </section>
        
          {/* Statistics */}
          <section className="mb-6 grid grid-cols-3 gap-2">
            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">Total Requests</p>
                <p className="mt-1 text-xl font-bold text-black">
                {requests.length}
                </p>
            </div>

            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">Pending</p>
                <p className="mt-1 text-xl font-bold text-black">
                {requests.filter((item) => item.status === "Pending").length}
                </p>
            </div>

            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">Approved</p>
                <p className="mt-1 text-xl font-bold text-black">
                {requests.filter((item) => item.status === "Approved").length}
                </p>
            </div>
            </section>

          {/* Tabs */}
          <section className="mb-4 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "new"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
               
                New Request
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "list"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
             
                My Requests
              </button>
            </div>
          </section>

          {/* Notice */}
          {notice && (
            <div className="mb-4 flex items-start justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-800">
              <p>{notice}</p>
              <button
                type="button"
                aria-label="Close notification"
                onClick={() => setNotice("")}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {activeTab === "new" ? (
            /* New Request Form */
            <section className="rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900">
                  Request Information
                </h2>
                <Settings2 size={15} className="text-slate-600" />
              </div>

              <div className="mb-3 h-px bg-slate-400/80" />

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="request-title" className={labelClass}>
                    Request Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="request-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter request title"
                    className={inputClass}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="category" className={labelClass}>
                      Category <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className={`${inputClass} appearance-none pr-6`}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="priority" className={labelClass}>
                      Priority <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                        className={`${inputClass} appearance-none pr-6`}
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="needed-date" className={labelClass}>
                    Needed Date <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="needed-date"
                      type="date"
                      value={neededDate}
                      min={getTodayLocal()}
                      onChange={(event) => setNeededDate(event.target.value)}
                      className={`${inputClass} pl-7`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    Request Description{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Explain your request and its purpose..."
                    className="min-h-[100px] w-full resize-y rounded-md border border-slate-200 bg-white px-2.5 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    maxLength={1000}
                    required
                  />
                  <p className="mt-1 text-right text-[9px] text-slate-500">
                    {description.length}/1000 characters
                  </p>
                </div>

                <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] leading-4 text-blue-800">
                    Make sure your request information is complete before
                    submitting. The request will initially be marked as
                    Pending.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
                >
                  <Send size={14} />
                  Submit Request
                </button>
              </form>
            </section>
          ) : (
            /* My Requests */
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">
                    My Requests
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Track the status of your submissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className="flex h-8 items-center justify-center gap-1 rounded-md bg-[#0095DA] px-3 text-[10px] font-bold text-white hover:bg-[#007AB8]"
                >
                  <Plus size={12} />
                  New
                </button>
              </div>

              <div className="mb-1 h-px bg-slate-300" />

              <div className="relative mb-3 mt-3">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, ID, or category"
                  className={`${inputClass} pl-8`}
                />
              </div>

              <div className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedRequest(request)}
                    className="flex w-full items-start gap-3 rounded-lg px-1.5 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
                      <FileText size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-900">
                        {request.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {request.id} · {request.category}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyle(request.status)}`}
                        >
                          {request.status}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-slate-500">
                          <CalendarDays size={10} />
                          {formatDate(request.neededDate)}
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-slate-400"
                    />
                  </button>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="py-10 text-center">
                  <ClipboardList
                    size={28}
                    className="mx-auto mb-2 text-slate-300"
                  />
                  <p className="text-xs font-semibold text-slate-700">
                    No requests found
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Try another keyword or create a new request.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-0 backdrop-blur-sm sm:items-center sm:px-5"
          onClick={() => setSelectedRequest(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-detail-title"
            className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase text-blue-700">
                  Request Details · {selectedRequest.id}
                </p>
                <h2
                  id="request-detail-title"
                  className="mt-2 text-lg font-bold text-slate-900"
                >
                  {selectedRequest.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedRequest(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle(selectedRequest.status)}`}
              >
                {selectedRequest.status}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">
                {selectedRequest.priority} Priority
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {[
                ["Category", selectedRequest.category],
                ["Needed Date", formatDate(selectedRequest.neededDate)],
                ["Submitted At", selectedRequest.submittedAt],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-slate-100 pb-3"
                >
                  <span className="text-[11px] text-slate-500">{label}</span>
                  <span className="text-right text-[11px] font-semibold text-slate-800">
                    {value}
                  </span>
                </div>
              ))}

              <div>
                <p className="text-[11px] font-semibold text-slate-700">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-[11px] leading-5 text-slate-600">
                  {selectedRequest.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRequest(null)}
              className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] text-xs font-bold text-white transition hover:bg-[#007AB8]"
            >
              Close Details
              <Check size={14} />
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
