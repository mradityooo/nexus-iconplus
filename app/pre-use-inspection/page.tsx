"use client";

import { useEffect, useState } from "react";
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

type InspectionTemplate = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

type Reservation = {
  id: string;
  startAt: string;
  endAt: string;
  destination: string;
  purpose: string;
  vehicle: {
    id: string;
    name: string;
    plateNumber: string;
    vehicleCode: string;
  };
};

type InspectionCondition =
  | "GOOD"
  | "NEEDS_ATTENTION"
  | "NOT_APPLICABLE";

type InspectionResult = "fit" | "not-fit";

export default function PreUseInspectionPage() {
 const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState("");

  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [conditions, setConditions] = useState<
    Record<string, InspectionCondition>
  >({});

  const [inspectionDate, setInspectionDate] = useState("");

  const [odometer, setOdometer] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const selectedReservation = reservations.find(
  (reservation) => reservation.id === selectedReservationId
);

const vehicle = selectedReservation?.vehicle.name ?? "";
const plate = selectedReservation?.vehicle.plateNumber ?? "";

const completedCount = Object.keys(conditions).length;
const allChecked = templates.length > 0 && completedCount === templates.length;

useEffect(() => {
  async function loadInspectionData() {
    try {
      setLoading(true);
      setInspectionDate(new Date().toLocaleDateString("en-CA"));
      setError("");

      const [reservationResponse, templateResponse] =
        await Promise.all([
          fetch("/api/inspections"),
          fetch("/api/inspection-templates"),
        ]);

      const reservationResult = await reservationResponse.json();
      const templateResult = await templateResponse.json();

      if (!reservationResponse.ok) {
        throw new Error(
          reservationResult.message || "Gagal mengambil reservasi"
        );
      }

      if (!templateResponse.ok) {
        throw new Error(
          templateResult.message || "Gagal mengambil checklist"
        );
      }

      const reservationData: Reservation[] = reservationResult.data;
      const templateData: InspectionTemplate[] = templateResult.data;

      setReservations(reservationData);
      setTemplates(templateData);

      if (reservationData.length > 0) {
        setSelectedReservationId(reservationData[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data inspeksi"
      );
    } finally {
      setLoading(false);
    }
  }

  loadInspectionData();
}, []);

const result: InspectionResult | "" = !allChecked
  ? ""
  : Object.values(conditions).some(
        (condition) => condition === "NEEDS_ATTENTION"
      )
    ? "not-fit"
    : "fit";


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

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!selectedReservationId) {
    setError("Pilih reservasi kendaraan terlebih dahulu.");
    return;
  }

  if (!inspectionDate || !odometer || Number(odometer) < 0) {
    setError("Lengkapi tanggal inspeksi dan odometer.");
    return;
  }

  if (!allChecked) {
    setError("Lengkapi semua checklist sebelum submit.");
    return;
  }

  if (result === "not-fit" && !notes.trim()) {
    setError("Catatan wajib diisi jika kendaraan membutuhkan perhatian.");
    return;
  }

  try {
    setSubmitting(true);
    setError("");

    const inspectionNotes = [
      `Odometer: ${Number(odometer).toLocaleString("id-ID")} KM`,
      `Inspection Date: ${inspectionDate}`,
      notes.trim() ? `Catatan: ${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("/api/inspections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId: selectedReservationId,
        notes: inspectionNotes,
        items: templates.map((item) => ({
          templateId: item.id,
          condition: conditions[item.id],
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menyimpan inspeksi.");
    }

    const inspectionId = data.data.id;
    if (photo) {
      const formData = new FormData();
      formData.append("photo", photo);

      const photoResponse = await fetch(
        `/api/inspections/${inspectionId}/photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      const photoResult = await photoResponse.json();

      if (!photoResponse.ok) {
        throw new Error(
          photoResult.message || "Gagal mengunggah foto inspeksi."
        );
      }
    }

    setShowConfirmation(true);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Terjadi kesalahan."
    );
  } finally {
    setSubmitting(false);
  }
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

<div className="mb-3">
  <label className="mb-1 block text-[10px] font-bold text-slate-800">
    Approved Reservation
  </label>

  <select
    value={selectedReservationId}
    onChange={(e) => {
      setSelectedReservationId(e.target.value);
      setConditions({});
      setNotes("");
      setError("");
    }}
    disabled={loading || reservations.length === 0}
    required
    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-[10px] text-slate-700"
  >
    <option value="">Select reservation</option>

    {reservations.map((reservation) => (
      <option key={reservation.id} value={reservation.id}>
        {reservation.vehicle.name} - {reservation.vehicle.plateNumber}
      </option>
    ))}
  </select>
</div>

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
                    readOnly
                    placeholder="Vehicle name"
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
                    readOnly
                    placeholder="License plate"
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

    <span className="text-[10px] font-medium text-slate-600">
      {completedCount}/{templates.length} Checked
    </span>
  </div>

  <div className="mb-4 h-px bg-slate-400" />

  {loading ? (
    <p className="py-4 text-center text-[10px] text-slate-500">
      Loading checklist...
    </p>
  ) : templates.length === 0 ? (
    <p className="py-4 text-center text-[10px] text-slate-500">
      Checklist belum tersedia.
    </p>
  ) : (
    <div className="space-y-3">
      {templates.map((item) => (
      <div key={item.id} className="rounded-md bg-white/70 px-3 py-3">
        <p className="text-[10px] font-bold text-slate-900">
          {item.name}
        </p>

        <p className="mt-0 text-[9px] leading-4 text-slate-600">
          {item.description}
        </p>

          <select
            value={conditions[item.id] ?? ""}
            onChange={(e) => {
              const value = e.target.value as InspectionCondition;

              setConditions((previous) => ({
                ...previous,
                [item.id]: value,
              }));

              setError("");
            }}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-[10px] text-slate-700"
          >
            <option value="">Select condition</option>
            <option value="GOOD">Good</option>
            <option value="NEEDS_ATTENTION">Needs Attention</option>
            <option value="NOT_APPLICABLE">Not Applicable</option>
          </select>
        </div>
      ))}
    </div>
  )}

  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
      style={{
        width: `${
          templates.length > 0
            ? (completedCount / templates.length) * 100
            : 0
        }%`,
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

              <div
                className={`rounded-md border px-3 py-3 text-center text-[11px] font-bold ${
                  result === "fit"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : result === "not-fit"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {result === "fit"
                  ? "✓ Fit for Use"
                  : result === "not-fit"
                    ? "✕ Not Fit for Use"
                    : "Complete all vehicle checklist items"}
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
            disabled={submitting || loading}
            className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Inspection"}
            {!submitting && <ChevronRight size={15} />}
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
              Inspection Submitted
            </h2>

            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
              Pemeriksaan kendaraan berhasil dikirim dan data inspeksi telah
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
                  {completedCount}/{templates.length}
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
            onClick={() => window.location.reload()}
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
