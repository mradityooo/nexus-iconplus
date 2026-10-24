
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  LogOut,
  Plane,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  CarFront,
  TrainFront,
  Bus,
  Check,
  ChevronLeft,
  Clock,
  Plus,
  ReceiptText,
  Users,
} from "lucide-react";

type TravelRequest = {
  id: number;
  destination: string;
  departureDate: string;
  returnDate: string;
  purpose: string;
  transport: string;
  estimatedCost: number;
  status: string;
};

const formatRupiah = (amount: number) =>
  "Rp " + amount.toLocaleString("id-ID");

const transportOptions = [
  { name: "Pesawat", icon: Plane },
  { name: "Kereta", icon: TrainFront },
  { name: "Mobil", icon: CarFront },
  { name: "Bus", icon: Bus },
];

export default function TravelPage() {
  const [view, setView] = useState<"form" | "list" | "summary">("form");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [transport, setTransport] = useState("Pesawat");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [travelerCount, setTravelerCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const totalCost = requests.reduce(
    (sum, item) => sum + item.estimatedCost,
    0
  );

  const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-slate-700";

  function addTravel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (returnDate < departureDate) {
      setMessage("Tanggal kepulangan tidak boleh sebelum keberangkatan.");
      return;
    }

    setRequests((current) => [
      ...current,
      {
        id: Date.now(),
        destination: destination.trim(),
        departureDate,
        returnDate,
        purpose: purpose.trim(),
        transport,
        estimatedCost: Number(estimatedCost),
        status: "Draft",
      },
    ]);

    setMessage("Pengajuan perjalanan berhasil ditambahkan.");
    setSubmitted(false);
    setView("list");
  }

  function removeTravel(id: number) {
    setRequests((current) => current.filter((item) => item.id !== id));
    setMessage("Pengajuan berhasil dihapus.");
  }

  function resetForm() {
    setDestination("");
    setDepartureDate("");
    setReturnDate("");
    setPurpose("");
    setTransport("Pesawat");
    setEstimatedCost("");
    setTravelerCount("1");
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-1000 text-slate-1000 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/nexus.png"
              alt="NEXUS"
              className="h-10 w-auto object-contain"
            />
          </div>
            </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="text-slate-1000 transition hover:text-red-600"
            >
              <Bell size={21} strokeWidth={1.8} />
            </button>

            <Link
              href="/"
              aria-label="Logout"
              className="text-slate-1000 transition hover:text-red-600"
            >
              <LogOut size={21} strokeWidth={1.8} />
            </Link>
          </div>
        </header>

        <div className="px-5 pb-8 pt-2">
          {/* Title */}
         <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
                Operational Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
                Travel
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-slate-500">
                Plan and manage your business trips in one place.
            </p>
         </section>

          {/* Travel highlight */}
          <section className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 p-5 text-white">
            <div className="relative z-10 max-w-[260px]">
              
              <p className="text-xs font-medium text-sky-100">
                Business Travel
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Your next trip starts here
              </h2>
              <p className="mt-0 text-[11px] leading-5 text-sky-100">
                Submit your travel plan and track your request status.
              </p>
            </div>
            <Plane
              size={110}
              strokeWidth={0.8}
              className="absolute -bottom-5 -right-4 rotate-[-20deg] text-white/15"
            />
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-3 gap-2">
            <div className="rounded-3 border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Total Requests</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {requests.length}
              </p>
            </div>
            <div className="rounded-3 border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Draft</p>
              <p className="mt-1 text-xl font-bold text-amber-600">
                {requests.filter((item) => item.status === "Draft").length}
              </p>
            </div>
            <div className="rounded-3 border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Est. Cost</p>
              <p className="mt-1 truncate text-sm font-bold text-sky-700">
                {formatRupiah(totalCost)}
              </p>
            </div>
          </section>

          {/* Navigation */}
            <section className="mb-3 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-3 gap-1">
                {[
                { id: "form", label: "New Travel" },
                { id: "list", label: "My Travel" },
                { id: "summary", label: "Summary" },
                ].map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                    if (item.id === "summary") {
                        if (requests.length === 0) {
                        setMessage(
                            "Buat pengajuan perjalanan terlebih dahulu."
                        );
                        return;
                        }

                        setMessage("");
                        setView("summary");
                    } else {
                        setView(item.id as "form" | "list");
                        setMessage("");
                    }
                    }}
                    className={`flex h-9 min-w-0 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all duration-200 ${
                    view === item.id
                        ? "bg-white text-black shadow-sm"
                        : "text-slate-600 hover:bg-white/40"
                    }`}
                >
                    <span className="truncate">{item.label}</span>
                </button>
                ))}
            </div>
            </section>

          {message && (
            <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
              {message}
            </div>
          )}

          {/* New Travel */}
          {view === "form" && (
            <section className="rounded-2xl border border-slate-100 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Travel Request
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Complete your business trip details
                  </p>
                </div>
              </div>

              <form onSubmit={addTravel} className="space-y-4 p-4">
                <div>
                  <label className={labelClass} htmlFor="destination">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="City or destination"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} htmlFor="departureDate">
                      Departure Date *
                    </label>
                    <input
                      id="departureDate"
                      type="date"
                      value={departureDate}
                      min={new Date().toLocaleDateString("en-CA")}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="returnDate">
                      Return Date *
                    </label>
                    <input
                      id="returnDate"
                      type="date"
                      value={returnDate}
                      min={departureDate || new Date().toLocaleDateString("en-CA")}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="purpose">
                    Purpose of Travel *
                  </label>
                  <textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Explain the purpose of your trip..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Transportation</label>
                  <div className="grid grid-cols-4 gap-2">
                    {transportOptions.map((item) => {
                      const Icon = item.icon;
                      const active = transport === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setTransport(item.name)}
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

                <div>
                  <label className={labelClass} htmlFor="travelerCount">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="travelerCount"
                      type="number"
                      min="1"
                      value={travelerCount}
                      onChange={(e) => setTravelerCount(e.target.value)}
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="estimatedCost">
                    Estimated Cost (IDR) *
                  </label>
                  <input
                    id="estimatedCost"
                    type="number"
                    min="0"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="Enter estimated travel cost"
                    className={inputClass}
                    required
                  />
                  {estimatedCost !== "" && (
                    <p className="mt-1.5 text-xs font-semibold text-sky-700">
                      {formatRupiah(Number(estimatedCost) || 0)}
                    </p>
                  )}
                </div>

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
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99]"
                >
                  <Plus size={17} />
                  Add Travel Request
                </button>
              </form>
            </section>
          )}

          {/* My Travel */}
          {view === "list" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    My Travel
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Track your travel requests
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                  {requests.length} request(s)
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                  <Plane
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    No travel requests yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Create your first business trip request.
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
                            <Plane size={21} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {item.destination}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.transport} · {item.purpose}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-[10px] text-slate-500">
                            Departure
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {item.departureDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">
                            Return
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {item.returnDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500">
                            Estimated Cost
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {formatRupiah(item.estimatedCost)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTravel(item.id)}
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
                      Travel Summary
                    </h2>
                    <p className="text-[10px] text-slate-500">
                      Overview of your travel requests
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-3 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Total Requests</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {requests.length}
                    </p>
                  </div>
                  <div className="rounded-3 bg-sky-50 p-3">
                    <p className="text-xs text-sky-700">Total Est. Cost</p>
                    <p className="mt-1 text-sm font-bold text-sky-800">
                      {formatRupiah(totalCost)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {requests.map((item, index) => (
                    <div
                      key={item.id}
                      className="border-t border-slate-100 pt-3"
                    >
                      <p className="text-xs font-bold text-slate-900">
                        {index + 1}. {item.destination}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.departureDate} – {item.returnDate}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-800">
                        {formatRupiah(item.estimatedCost)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                This is a local prototype. Travel requests are not yet sent to
                an approval system or database.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
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
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-bold text-white hover:bg-sky-700"
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
                    Confirmation is simulated. No request has been sent to a
                    server or approval workflow.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 text-xs font-bold text-emerald-800 underline"
                  >
                    Create New Travel
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
