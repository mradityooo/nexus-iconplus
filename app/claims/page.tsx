"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
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
  id: string;
  category: string;
  date: string;
  reference: string;
  description: string;
  amount: number;
  receiptUrl?: string | null;
  fuelType?: string;
  liters?: number;
  pricePerLiter?: number;
  stationLocation?: string;
  status?: string;
};

type ClaimApiResponse = {
  id: string;
  category: string;
  transactionDate: string;
  reference: string | null;
  description: string;
  amount: string | number;
  fuelType: string | null;
  liters: string | number | null;
  pricePerLiter: string | number | null;
  stationLocation: string | null;
  status: string;
  receiptUrl: string | null;
};

type EmployeeProfile = {
  fullName: string;
  position: string | null;
  employeeCode: string;
  email: string | null;
  department: string | null;
};

type ClaimRequestProgress = {
  id: string;
  requestNumber: string;
  totalAmount: string | number;
  status: string;
  notes: string | null;
  reviewNote: string | null;
  createdAt: string;
  claims: {
    id: string;
    category: string;
    transactionDate: string;
    description: string;
    amount: string | number;
    status: string;
  }[];
  reviews: {
    stage: string;
    decision: string;
    note: string | null;
    createdAt: string;
  }[];
};

const categories = [
  { name: "Car Wash", icon: CarFront },
  { name: "Meals", icon: Utensils },
  { name: "Toll Fee", icon: ReceiptText },
  { name: "Fuel", icon: Fuel },
  { name: "Others", icon: MoreHorizontal },
];

const categoryToEnum: Record<string, string> = {
  "Car Wash": "CAR_WASH",
  Meals: "MEALS",
  "Toll Fee": "TOLL_FEE",
  Fuel: "FUEL",
  Others: "OTHERS",
};

const enumToCategory: Record<string, string> = {
  CAR_WASH: "Car Wash",
  MEALS: "Meals",
  TOLL_FEE: "Toll Fee",
  FUEL: "Fuel",
  OTHERS: "Others",
};

const formatRupiah = (amount: number) =>
  "Rp. " + amount.toLocaleString("id-ID");

const requestStatusLabels: Record<string, string> = {
  PENDING_GA: "Menunggu pemeriksaan GA",
  PENDING_BRANCH_HEAD: "Menunggu Kepala Cabang",
  PENDING_TREASURER: "Menunggu Bendahara",
  PROCESSING_PAYMENT: "Disetujui, menunggu pencairan",
  PAID: "Klaim selesai / cair",
  REJECTED: "Pengajuan ditolak",
};

const reviewStages = [
  { stage: "GA", label: "Pemeriksaan GA" },
  { stage: "BRANCH_HEAD", label: "Pemeriksaan Kepala Cabang" },
  { stage: "TREASURER", label: "Pemeriksaan Bendahara" },
] as const;

function ClaimRequestsProgress({
  requests,
}: {
  requests: ClaimRequestProgress[];
}) {

async function downloadRequestPdf(request: ClaimRequestProgress) {
  const doc = new jsPDF();

  const formatPdfDate = (value: string) =>
    new Date(value).toLocaleString("id-ID");

  doc.setFontSize(16);
  doc.text("RINGKASAN PENGAJUAN KLAIM", 14, 18);

  doc.setFontSize(10);
  doc.text(`Nomor pengajuan: ${request.requestNumber}`, 14, 27);
  doc.text(`Tanggal pengajuan: ${formatPdfDate(request.createdAt)}`, 14, 33);
  doc.text(
    `Status: ${requestStatusLabels[request.status] ?? request.status}`,
    14,
    39
  );
  doc.text(
    `Total: ${formatRupiah(Number(request.totalAmount))}`,
    14,
    45
  );

  autoTable(doc, {
    startY: 53,
    head: [["No.", "Kategori", "Tanggal transaksi", "Deskripsi", "Nominal"]],
    body: request.claims.map((claim, index) => [
      String(index + 1),
      claim.category,
      new Date(claim.transactionDate).toLocaleDateString("id-ID"),
      claim.description,
      formatRupiah(Number(claim.amount)),
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [7, 86, 165] },
  });

  const reviewRows = reviewStages.map((stage) => {
    const review = request.reviews.find(
      (item) => item.stage === stage.stage
    );

    const status = review
      ? review.decision === "APPROVED"
        ? "Disetujui"
        : "Ditolak"
      : request.status === `PENDING_${stage.stage}`
        ? "Sedang diperiksa"
        : request.status === "REJECTED"
          ? "Tidak dilanjutkan"
          : "Menunggu pemeriksaan";

    return [
      stage.label,
      status,
      review ? formatPdfDate(review.createdAt) : "-",
      review?.note || "-",
    ];
  });

  reviewRows.push([
    "Pencairan",
    request.status === "PAID"
      ? "Selesai / cair"
      : request.status === "PROCESSING_PAYMENT"
        ? "Menunggu pencairan"
        : "-",
    "-",
    "-",
  ]);

  const tableEndY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 53;

  doc.setFontSize(12);
  doc.text("RUNDOWN PEMERIKSAAN", 14, tableEndY + 12);

  autoTable(doc, {
    startY: tableEndY + 17,
    head: [["Tahap", "Status", "Waktu", "Catatan"]],
    body: reviewRows,
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [7, 86, 165] },
  });

  if (request.notes) {
    const reviewEndY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? tableEndY + 17;

    doc.setFontSize(9);
    doc.text("Catatan pengajuan:", 14, reviewEndY + 10);
    doc.text(doc.splitTextToSize(request.notes, 180), 14, reviewEndY + 16);
  }

  const safeFileName = request.requestNumber.replace(/[^a-zA-Z0-9-_]/g, "_");
  doc.save(`Claim-${safeFileName}.pdf`);
}

  if (requests.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-900">
          Status Pengajuan Klaim
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Belum ada pengajuan klaim yang dikirim.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">
          Status Pengajuan Klaim
        </h2>
        <p className="mt-1 text-[10px] text-slate-500">
          Pantau proses setiap pengajuan yang sudah dikirim.
        </p>
      </div>

      {requests.map((request) => (
        <article
          key={request.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Nomor pengajuan</p>
              <p className="mt-0.5 break-all text-xs font-bold text-slate-900">
                {request.requestNumber}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {new Date(request.createdAt).toLocaleDateString("id-ID")}
                {" · "}
                {request.claims.length} item
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-center text-[9px] font-bold text-blue-700">
                {requestStatusLabels[request.status] ?? request.status}
              </span>

              <button
                type="button"
                onClick={() => void downloadRequestPdf(request)}
                className="rounded-full bg-blue-700 px-2.5 py-1 text-center text-[9px] font-bold text-white hover:bg-blue-800"
              >
                Unduh PDF
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
            <span className="text-slate-600">Total pengajuan</span>
            <span className="font-bold text-slate-900">
              {formatRupiah(Number(request.totalAmount))}
            </span>
          </div>

          <ol className="mt-4 space-y-3">
            {reviewStages.map((stage) => {
              const review = request.reviews.find(
                (item) => item.stage === stage.stage
              );

              const isRejected = review?.decision === "REJECTED";
              const isApproved = review?.decision === "APPROVED";
              const isCurrent =
                request.status === `PENDING_${stage.stage}`;

              const markerClass = isRejected
                ? "border-red-500 bg-red-500 text-white"
                : isApproved
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isCurrent
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-400";

              return (
                <li key={stage.stage} className="flex gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${markerClass}`}
                  >
                    {isApproved ? "✓" : isRejected ? "×" : isCurrent ? "•" : ""}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[10px] font-semibold ${
                        isRejected
                          ? "text-red-700"
                          : isApproved
                            ? "text-emerald-700"
                            : isCurrent
                              ? "text-blue-700"
                              : "text-slate-500"
                      }`}
                    >
                      {stage.label}
                      {isCurrent ? " — sedang diproses" : ""}
                      {isRejected ? " — ditolak" : ""}
                      {isApproved ? " — disetujui" : ""}
                    </p>

                    {review && (
                      <p className="mt-0.5 text-[9px] text-slate-500">
                        {new Date(review.createdAt).toLocaleString("id-ID")}
                      </p>
                    )}

                    {review?.note && (
                      <p className="mt-1 whitespace-pre-wrap text-[9px] text-slate-600">
                        Catatan: {review.note}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}

            <li className="flex gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
                  request.status === "PAID"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : request.status === "PROCESSING_PAYMENT"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {request.status === "PAID"
                  ? "✓"
                  : request.status === "PROCESSING_PAYMENT"
                    ? "•"
                    : ""}
              </span>

              <div>
                <p
                  className={`text-[10px] font-semibold ${
                    request.status === "PAID"
                      ? "text-emerald-700"
                      : request.status === "PROCESSING_PAYMENT"
                        ? "text-blue-700"
                        : "text-slate-500"
                  }`}
                >
                  {request.status === "PAID"
                    ? "Klaim selesai / cair"
                    : request.status === "PROCESSING_PAYMENT"
                      ? "Menunggu pencairan"
                      : "Pencairan"}
                </p>
              </div>
            </li>
          </ol>

          {request.status === "REJECTED" && request.reviewNote && (
            <div className="mt-3 rounded-lg bg-red-50 p-3">
              <p className="text-[10px] font-bold text-red-700">
                Alasan penolakan
              </p>
              <p className="mt-1 whitespace-pre-wrap text-[10px] text-red-700">
                {request.reviewNote}
              </p>
            </div>
          )}

          {request.notes && (
            <p className="mt-3 border-t border-slate-100 pt-3 text-[9px] text-slate-500">
              Catatan Anda: {request.notes}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}

export default function ReimbursementPage() {
  const [view, setView] = useState<"form" | "claims" | "summary">("form");
  const [category, setCategory] = useState("Car Wash");
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [stationLocation, setStationLocation] = useState("");
  const [fuelType, setFuelType] =useState("");
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [notes, setNotes] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile | null>(null);
  const [claimRequests, setClaimRequests] = useState<ClaimRequestProgress[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  useEffect(() => {
  let active = true;

  async function fetchClaimRequests() {
    try {
      setRequestsLoading(true);
      setRequestsError("");

      const response = await fetch("/api/claims/requests", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil status pengajuan klaim"
        );
      }

      if (active) {
        setClaimRequests(
          Array.isArray(result.data) ? result.data : []
        );
      }
    } catch (error) {
      console.error("FETCH CLAIM REQUESTS ERROR:", error);

      if (active) {
        setRequestsError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil status pengajuan klaim"
        );
      }
    } finally {
      if (active) setRequestsLoading(false);
    }
  }

  fetchClaimRequests();

  return () => {
    active = false;
  };
  }, []);

  useEffect(() => {
  async function fetchEmployeeProfile() {
    try {
      const response = await fetch("/api/claims/profile");

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.message || "Gagal mengambil informasi karyawan"
        );
      }

      const data: EmployeeProfile = await response.json();
      setEmployeeProfile(data);
    } catch (error) {
      console.error("FETCH EMPLOYEE PROFILE ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil informasi karyawan"
      );
    }
  }

  fetchEmployeeProfile();
  }, []);
  
  useEffect(() => {
  async function fetchClaims() {
    try {
      setLoading(true);

      const response = await fetch("/api/claims");

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal mengambil data klaim");
      }

      const data = await response.json();

      const formattedClaims: Claim[] = (data as ClaimApiResponse[]).map((claim) => ({
        id: claim.id,
        category: enumToCategory[claim.category] || claim.category,
        date: String(claim.transactionDate).slice(0, 10),
        reference: claim.reference || "",
        description: claim.description,
        amount: Number(claim.amount),
        fuelType: claim.fuelType || undefined,
        liters: claim.liters != null ? Number(claim.liters) : undefined,
        pricePerLiter:
          claim.pricePerLiter != null
            ? Number(claim.pricePerLiter)
            : undefined,
        stationLocation: claim.stationLocation || undefined,
        status: claim.status,
        receiptUrl: claim.receiptUrl,
      }));

      setClaims(formattedClaims);
    } catch (error) {
      console.error("FETCH CLAIMS ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data klaim"
      );
    } finally {
      setLoading(false);
    }
  }

  fetchClaims();
  }, []);

  const draftClaims = claims.filter((claim) => claim.status === "DRAFT");

  const total = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const draftTotal = draftClaims.reduce(
    (sum, claim) => sum + claim.amount,
    0
  );

  const fuelTotal =
    (Number(liters) || 0) * (Number(pricePerLiter) || 0);
  

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass = "mb-1.5 block text-[11px] font-semibold text-slate-700";

  async function addClaim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const claimAmount =
        category === "Fuel" ? fuelTotal : Number(amount);

      // 1. Simpan data klaim ke database
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryToEnum[category],
          transactionDate: date,
          reference: reference.trim() || null,
          description: description.trim(),
          amount: claimAmount,
          fuelType: category === "Fuel" ? fuelType : null,
          liters: category === "Fuel" ? Number(liters) : null,
          pricePerLiter:
            category === "Fuel" ? Number(pricePerLiter) : null,
          stationLocation:
            category === "Fuel" ? stationLocation.trim() : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan klaim");
      }

      const savedClaim = result.data;

      // 2. Upload bukti transaksi jika file dipilih
      let uploadWarning = "";

      if (receiptFile) {
        const formData = new FormData();

        formData.append("file", receiptFile);
        formData.append("claimId", savedClaim.id);

        const uploadResponse = await fetch("/api/claims/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          uploadWarning =
            uploadResult.message || "Bukti transaksi gagal diunggah.";
        }
      }

      // 3. Masukkan klaim ke tampilan
      const newClaim: Claim = {
        id: savedClaim.id,
        category:
          enumToCategory[savedClaim.category] || savedClaim.category,
        date: String(savedClaim.transactionDate).slice(0, 10),
        reference: savedClaim.reference || "",
        description: savedClaim.description,
        amount: Number(savedClaim.amount),
        fuelType: savedClaim.fuelType || undefined,
        liters:
          savedClaim.liters != null
            ? Number(savedClaim.liters)
            : undefined,
        pricePerLiter:
          savedClaim.pricePerLiter != null
            ? Number(savedClaim.pricePerLiter)
            : undefined,
        stationLocation: savedClaim.stationLocation || undefined,
        status: savedClaim.status,
      };

      setClaims((current) => [newClaim, ...current]);
      setSubmitted(false);

      // 4. Reset form
      setDate("");
      setReference("");
      setDescription("");
      setAmount("");
      setFuelType("");
      setLiters("");
      setPricePerLiter("");
      setStationLocation("");
      setReceiptFile(null);

      setMessage(
        uploadWarning
          ? `Claim berhasil disimpan, tetapi ${uploadWarning}`
          : "Claim dan bukti transaksi berhasil disimpan."
      );

      setView("claims");
    } catch (error) {
      console.error("ADD CLAIM ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan klaim"
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeClaim(id: string) {
    try {
      setMessage("");

      const response = await fetch("/api/claims", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus klaim");
      }

      setClaims((current) =>
        current.filter((claim) => claim.id !== id)
      );

      setMessage("Claim berhasil dihapus dari database.");
    } catch (error) {
      console.error("REMOVE CLAIM ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus klaim"
      );
    }
  }

  function openSummary() {
    setMessage("");
    setView("summary");
  }

  async function confirmClaim() {
    if (saving || draftClaims.length === 0) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/claims/submit", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengirim pengajuan klaim"
        );
      }

      const submittedIds = new Set<string>(
        Array.isArray(result.data?.claims)
          ? result.data.claims.map((claim: { id: string }) => claim.id)
          : []
      );

      // Draft yang berhasil dikirim dihapus dari My Claim.
      setClaims((current) =>
        current.filter((claim) => !submittedIds.has(claim.id))
      );

      setSubmitted(true);
      setMessage(
        result.data?.requestNumber
          ? `Pengajuan berhasil dikirim. Nomor request: ${result.data.requestNumber}`
          : result.message || "Pengajuan berhasil dikirim ke admin."
      );

      // Perbarui daftar progress agar request baru langsung terlihat di Summary.
      try {
        const progressResponse = await fetch("/api/claims/requests", {
          cache: "no-store",
        });

        if (progressResponse.ok) {
          const progressResult = await progressResponse.json();
          setClaimRequests(
            Array.isArray(progressResult.data) ? progressResult.data : []
          );
        }
      } catch (progressError) {
        console.error("REFRESH CLAIM PROGRESS ERROR:", progressError);
        // Submit sudah berhasil; refresh progress dapat dicoba saat membuka Summary.
      }
    } catch (error) {
      console.error("SUBMIT CLAIM ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim pengajuan klaim"
      );
    } finally {
      setSaving(false);
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
              Claims
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-3 text-black">
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
                              ? "border-blue-600 bg-red-50 text-blue-600"
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

                  
{category === "Fuel" && (
  <>
          <div>
            <label className={labelClass} htmlFor="fuelType">
              Jenis BBM <span className="text-red-600">*</span>
            </label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Pilih jenis BBM</option>
              <option value="Pertalite">Pertalite</option>
              <option value="Pertamax">Pertamax</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="liters">
              Jumlah BBM (Liter) <span className="text-red-600">*</span>
            </label>
            <input
              id="liters"
              type="number"
              min="0.01"
              step="0.01"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder="Masukkan jumlah liter"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="pricePerLiter">
              Harga per Liter (IDR) <span className="text-red-600">*</span>
            </label>
            <input
              id="pricePerLiter"
              type="number"
              min="1"
              step="1"
              value={pricePerLiter}
              onChange={(e) => setPricePerLiter(e.target.value)}
              placeholder="Masukkan harga per liter"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="stationLocation">
              Lokasi SPBU <span className="text-red-600">*</span>
            </label>
            <input
              id="stationLocation"
              value={stationLocation}
              onChange={(e) => setStationLocation(e.target.value)}
              placeholder="Nama atau lokasi SPBU"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Total Biaya BBM</label>
            <div className={`${inputClass} flex items-center font-semibold`}>
              {formatRupiah(fuelTotal)}
            </div>
          </div>
            </>
          )}

          {category !== "Fuel" && (
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
          )}

            <div>
              <label className={labelClass} htmlFor="receipt">
                Transaction Receipt
              </label>

              <input
                id="receipt"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  if (!file) {
                    setReceiptFile(null);
                    return;
                  }

                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "application/pdf",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setMessage("Format file harus JPG, PNG, WebP, atau PDF.");
                    e.target.value = "";
                    setReceiptFile(null);
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setMessage("Ukuran file maksimal 5 MB.");
                    e.target.value = "";
                    setReceiptFile(null);
                    return;
                  }

                  setReceiptFile(file);
                  setMessage("");
                }}
                className="w-full rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-[10px] file:font-semibold file:text-blue-600"
              />

              <p className="mt-1 text-[9px] text-slate-500">
                JPG, PNG, WebP, atau PDF. Maksimal 5 MB.
              </p>

              {receiptFile && (
                <p className="mt-2 text-[10px] font-medium text-green-700">
                  File dipilih: {receiptFile.name}
                </p>
              )}
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

                {loading ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-slate-500">
                    Loading claims...
                  </p>
                </div>
              ) : claims.length === 0 ? (
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
                          {claim.receiptUrl && (
                            <a
                              href={`/api/claims/${claim.id}/receipt`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-100"
                            >
                              <ReceiptText size={12} />
                              View Receipt
                            </a>
                          )}

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
                  type="submit"
                  disabled={saving}
                  className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={15} />
                  {saving ? "Saving..." : "Add Claim"}
                </button>

                <button
                  type="button"
                  onClick={confirmClaim}
                  disabled={saving || draftClaims.length === 0}
                  className="h-10 rounded-lg bg-red-600 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Submit Claim
                </button>
              </div>
            </>
          )}

          {/* Claim Progress / History */}
          {view === "summary" && (
            <section className="space-y-4">
              {requestsLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500">
                  Memuat status pengajuan...
                </div>
              ) : requestsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                  {requestsError}
                </div>
              ) : (
                <ClaimRequestsProgress requests={claimRequests} />
              )}
            </section>
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
