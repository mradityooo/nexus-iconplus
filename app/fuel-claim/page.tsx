
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  LogOut,
  Upload,
  Fuel,
  ReceiptText,
  CarFront,
  CalendarDays,
  Gauge,
  Check,
  ChevronRight,
  X,
  FileCheck2,
} from "lucide-react";

export default function FuelClaimPage() {
  const [vehicle, setVehicle] = useState("Mitsubishi Xpander");
  const [plate, setPlate] = useState("BE 2321 ALG");
  const [tripReference, setTripReference] = useState("TRV-20261018-001");
  const [driver, setDriver] = useState("Muhammad Radityo");

  const [refuelDate, setRefuelDate] = useState("");
  const [fuelStation, setFuelStation] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [odometer, setOdometer] = useState("");

  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalAmount =
    Number(liters || 0) * Number(pricePerLiter || 0);

  const inputClass =
    "h-9 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-1.5 block text-[10px] font-medium text-slate-600";

  function handleReceiptChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Unggah struk berupa gambar atau PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran struk maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    if (receiptPreview) URL.revokeObjectURL(receiptPreview);

    setReceipt(file);
    setReceiptPreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    setError("");
  }

  function handleNext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!receipt) {
      setError("Unggah struk pengisian BBM terlebih dahulu.");
      return;
    }

    if (Number(liters) <= 0 || Number(pricePerLiter) <= 0) {
      setError("Liter dan harga per liter harus lebih dari nol.");
      return;
    }

    setError("");
    setShowReview(true);
  }

  function handleSubmitClaim() {
    setShowReview(false);
    setSubmitted(true);
  }

  function resetForm() {
    setRefuelDate("");
    setFuelStation("");
    setFuelType("");
    setLiters("");
    setPricePerLiter("");
    setOdometer("");
    setReceipt(null);

    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview("");
    setError("");
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white pb-8">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-5 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              aria-label="Back to Home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
            </Link>

            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                <span className="text-sm font-extrabold">N</span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900">
                  NEXUS
                </p>
                <p className="truncate text-[9px] text-slate-500">
                  Employees Operations Portal
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="text-slate-600 hover:text-red-600"
            >
              <Bell size={21} />
            </button>

            <Link
              href="/"
              aria-label="Logout"
              className="text-slate-600 hover:text-red-600"
            >
              <LogOut size={21} />
            </Link>
          </div>
        </header>

        <div className="space-y-4 px-5">
          {/* Page title */}
          <section className="pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Operational Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Fuel Claim
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[0] text-slate-500">
              Submit your fuel expense claim for official travel and operational use.
            </p>
          </section>

          {submitted ? (
            <section className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-5 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={28} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Claim Prepared
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Ringkasan klaim berhasil dibuat pada prototype. Data belum
                tersimpan ke database atau dikirim ke bagian persetujuan.
              </p>

              <div className="mt-5 rounded-lg bg-white p-4 text-left">
                <p className="text-[10px] text-slate-500">Total Claim</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  {totalAmount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </p>

                <div className="mt-3 border-t border-slate-100 pt-3 text-[11px]">
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="text-right font-semibold">{vehicle}</span>
                  </div>
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-slate-500">License Plate</span>
                    <span className="font-semibold">{plate}</span>
                  </div>
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-slate-500">Fuel Type</span>
                    <span className="font-semibold">{fuelType}</span>
                  </div>
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-slate-500">Receipt</span>
                    <span className="max-w-[60%] truncate text-right font-semibold">
                      {receipt?.name}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="mt-5 w-full rounded-lg bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-700"
              >
                Create Another Claim
              </button>

              <Link
                href="/"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700"
              >
                Back to Home
              </Link>
            </section>
          ) : (
            <form onSubmit={handleNext} className="space-y-3">
              {/* Vehicle Information */}
              <section className="rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    Vehicle Information
                  </h2>
                  <CarFront size={16} className="text-slate-600" />
                </div>

                <div className="mb-2.5 h-px bg-slate-400" />

                <div className="space-y-2.5">
                  {[
                    ["Vehicle", vehicle],
                    ["License Plate", plate],
                    ["Trip Reference", tripReference],
                    ["Driver", driver],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                    >
                      <span className="text-[10px] font-semibold text-slate-800">
                        {label}
                      </span>
                      <span className="max-w-[175px] break-words text-right text-[10px] text-slate-600">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Fuel Transaction */}
              <section className="rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    Fuel Transaction
                  </h2>
                  <Fuel size={16} className="text-slate-600" />
                </div>

                <div className="mb-3 h-px bg-slate-400" />

                <div className="space-y-3">
                  <div>
                    <label htmlFor="refuelDate" className={labelClass}>
                      Date of Refueling
                    </label>
                    <div className="relative">
                      <CalendarDays
                        size={14}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="refuelDate"
                        type="date"
                        value={refuelDate}
                        onChange={(e) => setRefuelDate(e.target.value)}
                        className={`${inputClass} pl-8`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fuelStation" className={labelClass}>
                      Fuel Station
                    </label>
                    <input
                      id="fuelStation"
                      type="text"
                      value={fuelStation}
                      onChange={(e) => setFuelStation(e.target.value)}
                      placeholder="Enter fuel station name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="fuelType" className={labelClass}>
                      Fuel Type
                    </label>
                    <input
                      id="fuelType"
                      type="text"
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      placeholder="e.g. Pertamax"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="liters" className={labelClass}>
                      Liters (L)
                    </label>
                    <input
                      id="liters"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={liters}
                      onChange={(e) => setLiters(e.target.value)}
                      placeholder="0.00"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pricePerLiter" className={labelClass}>
                      Price per Liter (IDR)
                    </label>
                    <input
                      id="pricePerLiter"
                      type="number"
                      min="1"
                      step="1"
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(e.target.value)}
                      placeholder="0"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="odometer" className={labelClass}>
                      Odometer (KM)
                    </label>
                    <div className="relative">
                      <Gauge
                        size={14}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="odometer"
                        type="number"
                        min="0"
                        step="1"
                        value={odometer}
                        onChange={(e) => setOdometer(e.target.value)}
                        placeholder="Current odometer"
                        className={`${inputClass} pl-8`}
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-300 bg-white/70 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold text-slate-600">
                        Total Amount (IDR)
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {totalAmount.toLocaleString("id-ID", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-[9px] text-slate-500">
                      Liters × price per liter
                    </p>
                  </div>
                </div>
              </section>

              {/* Attach Receipt */}
              <section>
                <label
                  htmlFor="receipt"
                  className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-[#DCDCDC] px-3 py-2.5 text-[10px] font-bold text-slate-800 transition hover:bg-slate-200"
                >
                  <Upload size={15} />
                  {receipt ? "Change Receipt" : "Attach Receipt"}
                  <ReceiptText size={14} />
                </label>

                <input
                  id="receipt"
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  onChange={handleReceiptChange}
                  className="hidden"
                />

                {receipt && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                    {receiptPreview ? (
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                        <FileCheck2 size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-slate-800">
                        {receipt.name}
                      </p>
                      <p className="mt-1 text-[9px] text-slate-500">
                        {(receipt.size / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove receipt"
                      onClick={() => {
                        if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                        setReceipt(null);
                        setReceiptPreview("");
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <p className="mt-1.5 text-[9px] text-slate-500">
                  JPG, PNG or PDF · Maximum 5 MB
                </p>
              </section>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] leading-4 text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#DCDCDC] px-3 py-2.5 text-[10px] font-bold text-slate-900 transition hover:bg-slate-300 active:scale-[0.99]"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </form>
          )}

          <footer className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>

        {/* Claim Summary Page */}
        {showReview && !submitted && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F3F4F6]">
            <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white px-5 pb-8 pt-5">
            {/* Header */}
            <header className="mb-7 flex items-center justify-between">
                <Link
                href="/"
                aria-label="NEXUS Home"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm font-extrabold text-white"
                >
                N
                </Link>

                <div className="flex items-center gap-4 text-slate-700">
                <Bell size={19} />
                <Link href="/" aria-label="Logout">
                    <LogOut size={19} />
                </Link>
                </div>
            </header>

            {/* Title */}
            <section className="mb-6">
                <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
                Fuel Claim
                </h1>
                <p className="text-[10px] text-slate-500">
                Review your fuel expense claim before submitting.
                </p>
            </section>

            {/* Claim Summary */}
            <section className="mb-3 rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
                <h2 className="text-xs font-bold text-slate-900">
                Claim Summary
                </h2>
                <div className="my-2 h-px bg-slate-500" />

                <div className="space-y-2">
                {[
                    ["Vehicle", vehicle],
                    ["License Plate", plate],
                    ["Trip Reference", tripReference],
                    ["Driver", driver],
                    ["Date Refueling", refuelDate],
                    ["Fuel Station", fuelStation],
                    ["Fuel Type", fuelType],
                    ["Odometer (KM)", Number(odometer).toLocaleString("id-ID")],
                    ["Liters (L)", `${liters} L`],
                    [
                    "Price per Liter (IDR)",
                    `Rp ${Number(pricePerLiter).toLocaleString("id-ID")}`,
                    ],
                ].map(([label, value]) => (
                    <div
                    key={label}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 text-[10px]"
                    >
                    <span className="font-semibold text-slate-800">
                        {label}
                    </span>
                    <span className="break-words text-slate-600">
                        {value || "-"}
                    </span>
                    </div>
                ))}
                </div>

                <div className="my-3 h-px bg-slate-500" />

                <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-slate-900">
                    Total Amount
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-900">
                    Rp {totalAmount.toLocaleString("id-ID", {
                        maximumFractionDigits: 0,
                    })}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-slate-900">
                    Payment Method
                    </span>
                    <span className="text-[10px] text-slate-600">
                    QRIS
                    </span>
                </div>
                </div>
            </section>

            {/* Receipt */}
            <section className="rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
                <h2 className="text-xs font-bold text-slate-900">
                Receipt
                </h2>
                <div className="my-2 h-px bg-slate-500" />

                {receipt ? (
                <div className="flex items-center gap-3">
                    {receiptPreview ? (
                    <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-20 w-20 shrink-0 rounded-md border border-slate-300 bg-white object-cover"
                    />
                    ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600">
                        <FileCheck2 size={30} />
                    </div>
                    )}

                    <div className="min-w-0 flex-1">
                    <p className="break-words text-[10px] font-semibold text-slate-800">
                        {receipt.name}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">
                        {(receipt.size / 1024).toFixed(0)} KB
                    </p>

                    <label
                        htmlFor="replaceReceipt"
                        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-slate-700 underline"
                    >
                        <Upload size={12} />
                        Change receipt
                    </label>

                    <input
                        id="replaceReceipt"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleReceiptChange}
                        className="hidden"
                    />
                    </div>

                    <button
                    type="button"
                    aria-label="Delete receipt"
                    onClick={() => {
                        if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                        setReceipt(null);
                        setReceiptPreview("");
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-800 hover:bg-white/60"
                    >
                    <X size={19} />
                    </button>
                </div>
                ) : (
                <label
                    htmlFor="replaceReceipt"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white/70 px-3 py-5 text-[10px] font-semibold text-slate-700"
                >
                    <Upload size={15} />
                    Attach Receipt
                    <input
                    id="replaceReceipt"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptChange}
                    className="hidden"
                    />
                </label>
                )}
            </section>

            {error && (
                <p role="alert" className="mt-3 text-[10px] text-red-600">
                {error}
                </p>
            )}

            {/* Actions */}
            <div className="mt-3 grid grid-cols-[80px_minmax(0,1fr)] gap-2">
                <button
                type="button"
                onClick={() => {
                    setShowReview(false);
                    setError("");
                }}
                className="flex h-10 items-center justify-center gap-1 rounded-md bg-[#DCDCDC] text-[10px] font-bold text-slate-800 hover:bg-slate-300"
                >
                <ArrowLeft size={13} />
                Back
                </button>

                <button
                type="button"
                onClick={() => {
                    if (!receipt) {
                    setError("Receipt wajib dilampirkan sebelum klaim diajukan.");
                    return;
                    }

                    handleSubmitClaim();
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 text-[10px] font-bold text-white hover:bg-red-700"
                >
                Submit Claim
                <Check size={13} />
                </button>
            </div>

            <p className="mt-4 text-center text-[9px] text-slate-400">
                NEXUS · Employees Operations Portal
            </p>
            </div>
        </div>
        )}
    </main>
  );
}
