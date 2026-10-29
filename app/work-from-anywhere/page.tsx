
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  LogOut,
  Laptop,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  Clock,
  Plus,
  Home,
  MapPinned,
  ReceiptText,
  X,
} from "lucide-react";

type WFARequest = {
  id: number;
  workLocation: string;
  locationDetails: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
};

const locationOptions = [
  { name: "Home", icon: Home },
  { name: "Other", icon: MapPinned },
];

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function WorkFromAnywherePage() {
  const [view, setView] = useState<"form" | "list" | "summary">("form");

  const [workLocation, setWorkLocation] = useState("Home");
  const [locationDetails, setLocationDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<WFARequest[]>([]);

  const today = new Date().toLocaleDateString("en-CA");

  const pendingCount = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0095DA] focus:ring-2 focus:ring-sky-100";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold text-slate-700";

  function addRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (startDate < today) {
      setMessage("Tanggal mulai tidak boleh di masa lalu.");
      return;
    }

    if (endDate < startDate) {
      setMessage("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    const newRequest: WFARequest = {
      id: Date.now(),
      workLocation,
      locationDetails: locationDetails.trim(),
      startDate,
      endDate,
      reason: reason.trim(),
      notes: notes.trim(),
      status: "Pending",
    };

    setRequests((current) => [...current, newRequest]);
    setMessage("Pengajuan WFA berhasil ditambahkan.");
    setSubmitted(false);
    setView("list");
  }

  function removeRequest(id: number) {
    setRequests((current) => current.filter((item) => item.id !== id));
    setMessage("Pengajuan berhasil dihapus.");
  }

  function resetForm() {
    setWorkLocation("Home");
    setLocationDetails("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setNotes("");
    setMessage("");
    setSubmitted(false);
    setView("form");
  }

  return (
    <main
      className="min-h-screen bg-slate-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(0,149,218,0.12), transparent 35%)",
      }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to Home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-800 transition hover:bg-slate-50"
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
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Employee Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Work From Anywhere
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-black">
              Manage your remote work schedule and WFA requests.
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
                {pendingCount}
              </p>
            </div>

            <div className="rounded-sm border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Approved</p>
              <p className="mt-1 text-xl font-bold text-black">
                {approvedCount}
              </p>
            </div>
          </section>

          
        {/* Navigation */}
        <section className="mb-3 rounded-full bg-[#DEDEDE] p-1">
        <div className="grid grid-cols-2 gap-1">
            <button
            type="button"
            onClick={() => {
                setView("form");
                setMessage("");
            }}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                view === "form"
                ? "bg-white text-black shadow-sm"
                : "text-slate-700 hover:bg-white/40"
            }`}
            >
            
            New WFA
            </button>

            <button
            type="button"
            onClick={() => {
                setView("list");
                setMessage("");
            }}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                view === "list"
                ? "bg-white text-black shadow-sm"
                : "text-slate-700 hover:bg-white/40"
            }`}
            >
           
            My Requests
            </button>
        </div>
        </section>


          {message && (
            <div className="mb-4 flex items-start justify-between gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
              <span>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Tutup pesan"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* New WFA Form */}
          {view === "form" && (
            <section className="rounded-2xl border border-slate-100 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    WFA Request
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Complete your remote work details
                  </p>
                </div>
              </div>

              <form onSubmit={addRequest} className="space-y-4 p-4">
                {/* Work Location */}
                <div>
                  <label className={labelClass}>
                    Work Location <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {locationOptions.map((item) => {
                      const Icon = item.icon;
                      const active = workLocation === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setWorkLocation(item.name)}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                            active
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-[10px] font-semibold">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <label className={labelClass} htmlFor="locationDetails">
                    Location Details <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="locationDetails"
                      value={locationDetails}
                      onChange={(e) => setLocationDetails(e.target.value)}
                      placeholder="City or work address"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} htmlFor="startDate">
                      Start Date *
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="endDate">
                      End Date *
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className={labelClass} htmlFor="reason">
                    Reason for WFA *
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you need to work remotely..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none transition focus:border-[#0095DA] focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className={labelClass} htmlFor="notes">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional information (optional)"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none transition focus:border-[#0095DA] focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99]"
                >
                  <Plus size={17} />
                  Submit WFA Request
                </button>
              </form>
            </section>
          )}

          {/* My Requests */}
          {view === "list" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    My WFA Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Track your remote work requests
                  </p>
                </div>

                <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                  {requests.length} request(s)
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                  <Laptop
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    No WFA requests yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Create your first remote work request.
                  </p>
                  <button
                    type="button"
                    onClick={() => setView("form")}
                    className="mt-4 text-xs font-bold text-sky-700"
                  >
                    Create Request
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <Laptop size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {item.workLocation}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.locationDetails}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                            item.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-[10px] text-slate-500">
                            Start Date
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {formatDate(item.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">
                            End Date
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {formatDate(item.endDate)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        {item.reason}
                      </p>

                      {item.notes && (
                        <p className="mt-2 text-[11px] text-slate-500">
                          Notes: {item.notes}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock size={13} />
                          Request #{String(item.id).slice(-6)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeRequest(item.id)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Summary */}
          {view === "summary" && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <ReceiptText size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      WFA Summary
                    </h2>
                    <p className="text-[10px] text-slate-500">
                      Overview of your requests
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] text-slate-500">Total</p>
                    <p className="mt-1 text-xl font-bold">
                      {requests.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-[10px] text-amber-700">Pending</p>
                    <p className="mt-1 text-xl font-bold text-amber-700">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-[10px] text-emerald-700">Approved</p>
                    <p className="mt-1 text-xl font-bold text-emerald-700">
                      {approvedCount}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {requests.map((item, index) => (
                    <div
                      key={item.id}
                      className="border-t border-slate-100 pt-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900">
                          {index + 1}. {item.workLocation}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {formatDate(item.startDate)} – {formatDate(item.endDate)}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {item.locationDetails}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                This is a local prototype. Requests are not yet connected to
                the admin approval system or database.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    setMessage("");
                  }}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 text-xs font-bold text-white hover:bg-sky-700"
                >
                  <Check size={16} />
                  Confirm
                </button>
              </div>

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-800">
                    Summary confirmed
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    This is a prototype confirmation. No request has been sent
                    to a server or approval workflow.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 text-xs font-bold text-emerald-800 underline"
                  >
                    Create New WFA
                  </button>
                </div>
              )}
            </section>
          )}

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
