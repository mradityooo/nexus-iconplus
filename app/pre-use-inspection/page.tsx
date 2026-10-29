
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Camera,
  CarFront,
  Check,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  LogOut,
  Upload,
  X,
} from "lucide-react";

const checklistItems = [
  {
    id: "tires",
    title: "Tires & Wheels",
    description:
      "Check tire pressure, tread condition, and wheel condition.",
  },
  {
    id: "lights",
    title: "Lights & Turn Signals",
    description:
      "Check headlights, brake lights, fog lights, and turn signals.",
  },
  {
    id: "brakes",
    title: "Brake System",
    description: "Check brake pedal response and braking performance.",
  },
  {
    id: "engine",
    title: "Engine Oil & Coolant",
    description:
      "Check engine oil and coolant levels according to the vehicle manual.",
  },
  {
    id: "fuel",
    title: "Fuel Level",
    description: "Check the available fuel level before departure.",
  },
  {
    id: "safety",
    title: "Safety Equipment",
    description:
      "Check the availability of required safety equipment and emergency tools.",
  },
  {
    id: "body",
    title: "Vehicle Body & Mirrors",
    description:
      "Check vehicle body condition, mirrors, and visible damage.",
  },
];

type InspectionResult = "fit" | "not-fit";

export default function PreUseInspectionPage() {
  const [vehicle, setVehicle] = useState("");
  const [plate, setPlate] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [odometer, setOdometer] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [result, setResult] = useState<InspectionResult | "">("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const completedCount = checkedItems.length;
  const allChecked = completedCount === checklistItems.length;

  function toggleChecklist(id: string) {
    setCheckedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    setError("");
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allChecked) {
      setError("Lengkapi semua item checklist sebelum submit.");
      return;
    }

    if (!result) {
      setError("Pilih hasil inspeksi terlebih dahulu.");
      return;
    }

    setError("");
    setShowConfirmation(true);
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
        </header>

        <div className="px-5 pb-8 pt-2">
          {/* Title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              Operational Services
            </p>
            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              Pre-Use Inspection
            </h1>
            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-black">
              Complete the vehicle checklist before starting your trip.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Vehicle Information */}
            <section className="rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900">
                  Vehicle Information
                </h2>
                <CarFront size={17} className="text-slate-600" />
              </div>

              <div className="mb-3 h-px bg-slate-400" />

              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <div>
                  <label
                    htmlFor="vehicle"
                    className="mb-1 block text-[10px] font-bold text-slate-800"
                  >
                    Vehicle
                  </label>
                  <input
                  id="vehicle"
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="Enter vehicle name"
                  className="w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-7 pr-2 text-[10px] text-slate-700 outline-none focus:border-red-400"
                  required
                />
                </div>

                <div>
                  <label
                    htmlFor="plate"
                    className="mb-1 block text-[10px] font-bold text-slate-800"
                  >
                    License Plate
                  </label>
                 <input
                  id="plate"
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="Input Plate Number"
                  className="w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-7 pr-2 text-[10px] text-slate-700 outline-none focus:border-red-400"
                  required
                />
                </div>

                <div>
                  <label
                    htmlFor="inspectionDate"
                    className="mb-1 block text-[10px] font-bold text-slate-800"
                  >
                    Inspection Date
                  </label>
                  <input
                    id="inspectionDate"
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    required
                    className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-2 py-2 text-[10px] text-slate-700 outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="odometer"
                    className="mb-1 block text-[10px] font-bold text-slate-800"
                  >
                    Odometer
                  </label>
                  <div className="relative">
                    <Gauge
                      size={13}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="odometer"
                      type="number"
                      min="0"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="Input KM"
                      required
                      className="w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-7 pr-2 text-[10px] text-slate-700 outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Vehicle Checklist */}
            <section className="rounded-lg border border-slate-200/60 bg-[#DCDCDC] px-4 py-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-xs font-bold text-slate-900">
                  Vehicle Checklist
                </h2>
                <span className="shrink-0 text-[10px] font-medium text-slate-600">
                  {completedCount}/{checklistItems.length} Checked
                </span>
              </div>

              <div className="mb-1.5 h-px bg-slate-400" />

              <div className="space-y-0.5">
                {checklistItems.map((item) => {
                  const isChecked = checkedItems.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-md px-0 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecklist(item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-red-600"
                      />

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[10px] font-bold leading-4 ${
                            isChecked ? "text-emerald-800" : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="block text-[9px] leading-[1.4] text-slate-600">
                          {item.description}
                        </span>
                      </span>

                      {isChecked && (
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${(completedCount / checklistItems.length) * 100}%`,
                  }}
                />
              </div>
            </section>

            {/* Inspection Result */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-slate-900">
                  Inspection Result
                </h2>
                {result && (
                  <span
                    className={`text-[9px] font-bold ${
                      result === "fit" ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {result === "fit" ? "Fit for Use" : "Not Fit for Use"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setResult("fit");
                    setError("");
                  }}
                  className={`flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-[10px] font-bold transition ${
                    result === "fit"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-[#DCDCDC] text-slate-800 hover:bg-emerald-50"
                  }`}
                >
                  {result === "fit" && <Check size={13} />}
                  Fit for Use
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResult("not-fit");
                    setError("");
                  }}
                  className={`flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-[10px] font-bold transition ${
                    result === "not-fit"
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-slate-200 bg-[#DCDCDC] text-slate-800 hover:bg-red-50"
                  }`}
                >
                  {result === "not-fit" && <X size={13} />}
                  Not Fit for Use
                </button>
              </div>

              {result === "not-fit" && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-[11px] font-bold text-red-700">
                    Vehicle requires attention
                  </p>
                  <p className="mt-1 text-[10px] leading-3 text-red-600">
                    Jelaskan masalah kendaraan pada catatan agar dapat
                    ditindaklanjuti sebelum digunakan.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the vehicle issue..."
                    rows={3}
                    required
                    className="mt-2 w-full rounded-md border border-red-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-red-400"
                  />
                </div>
              )}

              {result === "fit" && (
                <div className="mt-3">
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-[10px] font-semibold text-slate-700"
                  >
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add additional notes..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-red-400"
                  />
                </div>
              )}
            </section>

            {/* Attach Photo */}
            <section>
              <label
                htmlFor="inspectionPhoto"
                className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
              >
                <Upload size={15} />
                {photo ? "Change Photo" : "Attach Photo (Optional)"}
              </label>

              <input
                id="inspectionPhoto"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {photo && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Inspection attachment preview"
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold text-slate-800">
                      {photo.name}
                    </p>
                    <p className="mt-1 text-[9px] text-slate-500">
                      {(photo.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => {
                      if (photoPreview) URL.revokeObjectURL(photoPreview);
                      setPhoto(null);
                      setPhotoPreview("");
                    }}
                   className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
              <p className="mt-1.5 text-[9px] text-slate-500">
                Optional · JPG, PNG · Maximum 5 MB
              </p>
            </section>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] leading-4 text-red-700"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" 
              className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
            >
              Submit Inspection
              <ChevronRight size={15} />
            </button>
          </form>

          <footer className="mt-7 border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>

      {/* Confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 py-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspection-confirmation-title"
            className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                result === "fit"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {result === "fit" ? (
                <ClipboardCheck size={27} />
              ) : (
                <X size={27} />
              )}
            </div>

            <h2
              id="inspection-confirmation-title"
              className="mt-4 text-center text-lg font-bold text-slate-900"
            >
              Inspection Prepared
            </h2>

            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
              Pemeriksaan berhasil divalidasi pada prototype. Data belum
              disimpan ke server.
            </p>

            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3.5 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Vehicle</span>
                <span className="text-right font-semibold text-slate-800">
                  {vehicle}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">License Plate</span>
                <span className="font-semibold text-slate-800">{plate}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Inspection Date</span>
                <span className="font-semibold text-slate-800">
                  {inspectionDate}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Odometer</span>
                <span className="font-semibold text-slate-800">
                  {Number(odometer).toLocaleString("id-ID")} KM
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Checklist</span>
                <span className="font-semibold text-slate-800">
                  {completedCount}/{checklistItems.length}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Result</span>
                <span
                  className={`font-bold ${
                    result === "fit" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {result === "fit" ? "Fit for Use" : "Not Fit for Use"}
                </span>
              </div>
              {photo && (
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Attachment</span>
                  <span className="max-w-[60%] truncate text-right font-semibold text-slate-800">
                    {photo.name}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="mt-4 w-full rounded-xl bg-red-600 py-3 text-xs font-bold text-white transition hover:bg-red-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
