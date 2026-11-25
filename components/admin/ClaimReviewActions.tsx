"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  requestId: string;
  status: string;
  reviewerRole: string;
};

const roleStage: Record<string, string> = {
  GA: "PENDING_GA",
  ADMIN: "PENDING_GA",
  BRANCH_HEAD: "PENDING_BRANCH_HEAD",
  TREASURER: "PENDING_TREASURER",
};

const statusLabels: Record<string, string> = {
  PENDING_GA: "Menunggu pemeriksaan GA",
  PENDING_BRANCH_HEAD: "Menunggu pemeriksaan Kepala Cabang",
  PENDING_TREASURER: "Menunggu pemeriksaan Bendahara",
  PROCESSING_PAYMENT: "Menunggu pencairan",
  PAID: "Selesai",
  REJECTED: "Ditolak",
};

export default function ClaimReviewActions({
  requestId,
  status,
  reviewerRole,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canReview = roleStage[reviewerRole] === status;

  async function submitReview(
    action: "APPROVE" | "REJECT",
    reviewNote?: string
  ) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/claims/${requestId}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, reviewNote }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memproses review");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat review"
      );
    } finally {
      setLoading(false);
    }
  }

  function rejectRequest() {
    const note = window.prompt("Masukkan alasan penolakan:");
    if (note === null) return;

    if (!note.trim()) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    void submitReview("REJECT", note.trim());
  }

  if (!canReview) {
    return (
      <section className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        {statusLabels[status] ?? `Status request: ${status}`}
        {roleStage[reviewerRole]
          ? ". Request ini belum berada pada tahap review akun Anda."
          : ". Akun Anda tidak memiliki tahap review untuk request ini."}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-blue-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">Tindakan Review</h2>
      <p className="mt-1 text-sm text-gray-500">
        Periksa semua item sebelum menyetujui atau menolak request ini.
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => void submitReview("APPROVE")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Setujui Request"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={rejectRequest}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Tolak Request
        </button>
      </div>
    </section>
  );
}
