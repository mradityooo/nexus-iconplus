
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ClaimReviewActionsProps {
  claimId: string;
  status: string;
}

export default function ClaimReviewActions({
  claimId,
  status,
}: ClaimReviewActionsProps) {
  const router = useRouter();

  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status !== "PENDING") {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">
          This claim has already been reviewed.
        </p>
      </div>
    );
  }

  async function handleReview() {
    if (!action || loading) return;

    if (action === "REJECT" && !reviewNote.trim()) {
      setError("Please enter a reason for rejection.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/claims/${claimId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            reviewNote: action === "REJECT" ? reviewNote.trim() : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to review claim.");
      }

      setAction(null);
      setReviewNote("");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900">
          Claim Review
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review the claim and choose an action.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setError("");
            setAction("APPROVE");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <CheckCircle2 size={18} />
          Approve Claim
        </button>

        <button
          type="button"
          onClick={() => {
            setError("");
            setAction("REJECT");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <XCircle size={18} />
          Reject Claim
        </button>
      </div>

      {action && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="font-semibold text-gray-900">
            {action === "APPROVE"
              ? "Confirm Claim Approval"
              : "Reject Claim"}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {action === "APPROVE"
              ? "Are you sure you want to approve this claim?"
              : "Please provide a reason for rejecting this claim."}
          </p>

          {action === "REJECT" && (
            <div className="mt-4">
              <label
                htmlFor="reviewNote"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Rejection Reason
              </label>

              <textarea
                id="reviewNote"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={4}
                placeholder="Enter the reason for rejection..."
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReview}
              disabled={
                loading ||
                (action === "REJECT" && !reviewNote.trim())
              }
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                action === "APPROVE"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loading
                ? "Processing..."
                : action === "APPROVE"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAction(null);
                setReviewNote("");
                setError("");
              }}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
