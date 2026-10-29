
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Coffee,
  LogOut,
  Plus,
  ReceiptText,
  Trash2,
  Utensils,
  Fuel,
  MoreHorizontal,
} from "lucide-react";

type Claim = {
  id: number;
  category: string;
  date: string;
  reference: string;
  description: string;
  amount: number;
};

const categories = [
  { name: "Car Wash", icon: CarFront },
  { name: "Meals", icon: Utensils },
  { name: "Toll Fee", icon: ReceiptText },
  { name: "Fuel", icon: Fuel },
  { name: "Others", icon: MoreHorizontal },
];

const formatRupiah = (amount: number) =>
  "Rp. " + amount.toLocaleString("id-ID");

export default function ReimbursementPage() {
  const [view, setView] = useState<"form" | "claims" | "summary">("form");
  const [category, setCategory] = useState("Car Wash");
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const total = claims.reduce((sum, claim) => sum + claim.amount, 0);

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass = "mb-1.5 block text-[11px] font-semibold text-slate-700";

  function addClaim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setClaims((current) => [
      ...current,
      {
        id: Date.now(),
        category,
        date,
        reference,
        description: description.trim(),
        amount: Number(amount),
      },
    ]);

    setDate("");
    setReference("");
    setDescription("");
    setAmount("");
    setMessage("Claim berhasil ditambahkan.");
    setView("claims");
  }

  function removeClaim(id: number) {
    setClaims((current) => current.filter((claim) => claim.id !== id));
    setMessage("Claim berhasil dihapus.");
  }

  function openSummary() {
    if (claims.length === 0) {
      setMessage("Tambahkan minimal satu claim terlebih dahulu.");
      return;
    }

    setMessage("");
    setView("summary");
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
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
        </header>

        <div className="px-5 pb-8 pt-2">
          {/* Page title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Operational Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Reimbursement
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-3 text-slate-500">
              Submit a claim for eligible operational and business travel expenses.
            </p>
          </section>

          {/* Navigation */}
          <div className="mb-5 grid grid-cols-3 gap-1 rounded-full bg-[#DEDEDE] p-1">
            {[
              { id: "form", label: "New Claim" },
              { id: "claims", label: "My Claim" },
              { id: "summary", label: "Summary" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "summary") {
                    openSummary();
                  } else {
                    setView(item.id as "form" | "claims");
                    setMessage("");
                  }
                }}
                className={`h-9 rounded-full text-[11px] font-bold transition ${
                  view === item.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {message && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              {message}
            </div>
          )}

          {/* New Claim */}
          {view === "form" && (
            <>
              <section className="mb-5">
                <h2 className="mb-3 text-[14px] font-bold text-slate-900">
                  Expense Category
                </h2>

                <div className="grid grid-cols-5 gap-2">
                  {categories.map((item) => {
                    const Icon = item.icon;
                    const active = category === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setCategory(item.name)}
                        className="flex min-w-0 flex-col items-center gap-1.5"
                      >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                            active
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          <Icon size={19} strokeWidth={1.6} />
                        </span>
                        <span className="text-center text-[8px] text-slate-600">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mb-5 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    Transaction Details
                  </h2>
                  <ReceiptText size={15} className="text-slate-600" />
                </div>

                <div className="mb-4 h-px bg-slate-400/80" />

                <form onSubmit={addClaim} className="space-y-3">
                  <div>
                    <label className={labelClass} htmlFor="transactionDate">
                      Transaction Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="transactionDate"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="reference">
                      Vehicle / Trip Reference
                    </label>
                    <input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Enter vehicle or trip reference"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="description">
                      Description <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter expense description"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="amount">
                      Amount (IDR) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className={inputClass}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
                  >
                    <Plus size={15} />
                    Add Claim
                  </button>
                </form>
              </section>
            </>
          )}

          {/* My Claim */}
          {view === "claims" && (
            <>
              <section className="mb-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-[14px] font-bold text-slate-900">
                      My Claim
                    </h2>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Manage your expense claims
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-600">
                    {claims.length} item(s)
                  </span>
                </div>

                <div className="mb-1 h-px bg-slate-300" />

                {claims.length === 0 ? (
                  <div className="py-10 text-center">
                    <ReceiptText
                      size={30}
                      className="mx-auto mb-2 text-slate-300"
                    />
                    <p className="text-xs font-semibold text-slate-700">
                      No claims added
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Add a transaction to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {claims.map((claim, index) => (
                      <div key={claim.id} className="py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900">
                              {index + 1}. {claim.category}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-500">
                              {claim.date} · {claim.description}
                            </p>
                            {claim.reference && (
                              <p className="mt-0.5 text-[9px] text-slate-400">
                                {claim.reference}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 text-[11px] font-bold text-slate-900">
                            {formatRupiah(claim.amount)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeClaim(claim.id)}
                          className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-red-600"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 border-t border-slate-400 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Total Reimbursement</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView("form");
                    setMessage("");
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus size={14} />
                  Add Claim
                </button>

                <button
                  type="button"
                  onClick={openSummary}
                  disabled={claims.length === 0}
                  className="h-10 rounded-lg bg-red-600 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Submit Claim
                </button>
              </div>
            </>
          )}

          {/* Claim Summary */}
          {view === "summary" && (
            <>
              <section className="mb-4 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
                <h2 className="mb-3 text-xs font-bold text-slate-900">
                  Employee Information
                </h2>
                <div className="mb-3 h-px bg-slate-400/80" />

                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  {[
                    ["Employee Name", "Employee Name"],
                    ["Position", "Employee"],
                    ["Employee ID", "NEXUS-0001"],
                    ["Email", "employee@example.com"],
                    ["Department", "Operations"],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <p className="text-[9px] text-slate-500">{label}</p>
                      <p className="mt-0.5 break-words text-[10px] font-semibold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-4 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
                <h2 className="mb-3 text-xs font-bold text-slate-900">
                  Claim Details
                </h2>
                <div className="mb-3 h-px bg-slate-400/80" />

                <div className="space-y-3">
                  {claims.map((claim, index) => (
                    <div
                      key={claim.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-900">
                          {index + 1}. {claim.category}
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500">
                          {claim.date} · {claim.description}
                        </p>
                        {claim.reference && (
                          <p className="mt-0.5 text-[9px] text-slate-500">
                            {claim.reference}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-[10px] font-bold text-slate-900">
                        {formatRupiah(claim.amount)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-slate-400 pt-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-900">
                    <span>Total Reimbursement</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>
              </section>

              <section className="mb-5 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
                <h2 className="mb-3 text-xs font-bold text-slate-900">
                  Additional Notes
                </h2>
                <div className="mb-3 h-px bg-slate-400/80" />

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter additional notes..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView("claims");
                    setMessage("");
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-1000 text-xs font-bold text-slate-1000 transition hover:bg-slate-50"
                >
                  <ChevronLeft size={15} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    setMessage("");
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  <Check size={15} />
                  Confirm Claim
                </button>
              </div>

              {submitted && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold text-emerald-800">
                    Claim Prepared Successfully
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-emerald-700">
                    Simulasi berhasil. Data belum dikirim atau disimpan ke server.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setClaims([]);
                      setNotes("");
                      setSubmitted(false);
                      setView("form");
                    }}
                    className="mt-3 text-[11px] font-bold text-emerald-800 underline"
                  >
                    Create New Claim
                  </button>
                </div>
              )}
            </>
          )}

          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
