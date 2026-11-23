import ClaimReviewActions from "@/components/admin/ClaimReviewActions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
  Wallet,
  FileText,
  Fuel,
  MapPin,
  Clock,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface ClaimRequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}


const categoryLabels: Record<string, string> = {
  CAR_WASH: "Car Wash",
  MEALS: "Meals",
  TOLL_FEE: "Toll Fee",
  FUEL: "Fuel",
  OTHERS: "Others",
};

const requestStatusLabels: Record<string, string> = {
  PENDING_GA: "Menunggu GA",
  PENDING_BRANCH_HEAD: "Menunggu Kepala Cabang",
  PENDING_TREASURER: "Menunggu Bendahara",
  PROCESSING_PAYMENT: "Menunggu Pencairan",
  PAID: "Sudah Cair",
  REJECTED: "Ditolak",
};

const claimStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Menunggu Review",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  PROCESSING: "Diproses",
  COMPLETED: "Selesai",
};

const reviewStageLabels: Record<string, string> = {
  GA: "General Affairs (GA)",
  BRANCH_HEAD: "Kepala Cabang",
  TREASURER: "Bendahara",
};

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRequestStatusColor(status: string) {
  if (
    [
      "PENDING_GA",
      "PENDING_BRANCH_HEAD",
      "PENDING_TREASURER",
    ].includes(status)
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "PAID") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default async function ClaimRequestDetailPage({
  params,
}: ClaimRequestDetailPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    !["GA", "ADMIN", "BRANCH_HEAD", "TREASURER"].includes(
      session.user.role
    )
  ) {
    redirect("/login");
  }

  const { id } = await params;

  const claimRequest = await prisma.claimRequest.findUnique({
    where: { id },
    include: {
      employee: {
        select: {
          fullName: true,
          employeeCode: true,
          department: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      claims: {
        orderBy: {
          transactionDate: "asc",
        },
      },
      reviews: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          reviewer: {
            select: {
              email: true,
              role: true,
            },
          },
        },
      },
      paidBy: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!claimRequest) {
    notFound();
  }

  const requestStatus = claimRequest.status;
  const requestStatusLabel =
    requestStatusLabels[requestStatus] ?? requestStatus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/claims"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0756A5]"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar pengajuan
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            Detail Pengajuan Klaim
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Nomor pengajuan:{" "}
            <span className="font-semibold text-gray-800">
              {claimRequest.requestNumber}
            </span>
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${getRequestStatusColor(
            requestStatus
          )}`}
        >
          {requestStatusLabel}
        </span>
      </div>

      {/* Employee Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 text-[#0756A5]">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Informasi Karyawan
            </h2>
            <p className="text-sm text-gray-500">
              Pemilik pengajuan klaim ini
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claimRequest.employee.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claimRequest.employee.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Departemen</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claimRequest.employee.department || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 break-all font-semibold text-gray-900">
              {claimRequest.employee.user?.email || "-"}
            </p>
          </div>
        </div>
      </section>

      {/* Request Summary */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 text-[#0756A5]">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Ringkasan Pengajuan
            </h2>
            <p className="text-sm text-gray-500">
              Informasi utama request klaim
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Nomor Request</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claimRequest.requestNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
            <p className="mt-1 font-semibold text-gray-900">
              {formatDateTime(claimRequest.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Jumlah Item</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claimRequest.claims.length} item
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Pengajuan</p>
            <p className="mt-1 font-semibold text-gray-900">
              {formatRupiah(claimRequest.totalAmount.toString())}
            </p>
          </div>
        </div>

        {claimRequest.notes && (
          <div className="mt-5 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-semibold text-[#0756A5]">
              Catatan dari Karyawan
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
              {claimRequest.notes}
            </p>
          </div>
        )}

        {claimRequest.reviewNote && (
          <div className="mt-5 rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Catatan Review Terakhir
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-amber-900">
              {claimRequest.reviewNote}
            </p>
          </div>
        )}
      </section>

      {/* Claim Items */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Item Klaim
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Semua item yang dikirim dalam request ini
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0756A5]">
            {claimRequest.claims.length} item
          </span>
        </div>

        {claimRequest.claims.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500">
            Request ini belum memiliki item klaim.
          </p>
        ) : (
          <div className="space-y-5">
            {claimRequest.claims.map((claim, index) => (
              <article
                key={claim.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Item {index + 1}
                    </p>
                    <h3 className="mt-1 font-semibold text-gray-900">
                      {categoryLabels[claim.category] ?? claim.category}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Status item:{" "}
                      {claimStatusLabels[claim.status] ?? claim.status}
                    </p>
                  </div>

                  <p className="font-bold text-gray-900">
                    {formatRupiah(claim.amount.toString())}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 text-gray-400"
                    />
                    <div>
                      <p className="text-sm text-gray-500">
                        Tanggal transaksi
                      </p>
                      <p className="mt-1 font-medium text-gray-900">
                        {formatDate(claim.transactionDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wallet
                      size={18}
                      className="mt-0.5 text-gray-400"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Nominal</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {formatRupiah(claim.amount.toString())}
                      </p>
                    </div>
                  </div>
                </div>

                {claim.reference && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Referensi</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {claim.reference}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Deskripsi</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {claim.description}
                  </p>
                </div>

                {claim.category === "FUEL" && (
                  <div className="mt-5 rounded-lg bg-amber-50 p-4">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-amber-900">
                      <Fuel size={18} />
                      Informasi BBM
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-amber-800">Jenis BBM</p>
                        <p className="mt-1 font-medium text-amber-950">
                          {claim.fuelType || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-800">Jumlah</p>
                        <p className="mt-1 font-medium text-amber-950">
                          {claim.liters?.toString() || "-"} liter
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-800">
                          Harga per liter
                        </p>
                        <p className="mt-1 font-medium text-amber-950">
                          {claim.pricePerLiter
                            ? formatRupiah(claim.pricePerLiter.toString())
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-800">Lokasi SPBU</p>
                        <p className="mt-1 flex items-center gap-1 font-medium text-amber-950">
                          <MapPin size={15} />
                          {claim.stationLocation || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Bukti transaksi
                  </p>

                  {claim.receiptUrl ? (
                    <a
                      href={`/api/admin/claims/${claim.id}/receipt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#0756A5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      <FileText size={16} />
                      Lihat Bukti
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Tidak ada bukti transaksi yang diunggah.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-700">
            Total seluruh item
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatRupiah(claimRequest.totalAmount.toString())}
          </span>
        </div>
      </section>

      {/* Review Timeline */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Riwayat Pemeriksaan
            </h2>
            <p className="text-sm text-gray-500">
              Catatan keputusan pada setiap tahap
            </p>
          </div>
        </div>

        {claimRequest.reviews.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            Belum ada keputusan review.
          </p>
        ) : (
          <ol className="space-y-4">
            {claimRequest.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg border border-gray-100 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {reviewStageLabels[review.stage] ?? review.stage}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {review.reviewer.email} ·{" "}
                      {formatDateTime(review.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      review.decision === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {review.decision === "APPROVED"
                      ? "Disetujui"
                      : "Ditolak"}
                  </span>
                </div>

                {review.note && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                    {review.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}

        {claimRequest.paidAt && (
          <div className="mt-5 rounded-lg bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-800">
              Pembayaran tercatat
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              Dibayar pada {formatDateTime(claimRequest.paidAt)}
              {claimRequest.paidBy?.email
                ? ` oleh ${claimRequest.paidBy.email}`
                : ""}
            </p>
            {claimRequest.paymentReference && (
              <p className="mt-1 text-sm text-emerald-700">
                Referensi pembayaran: {claimRequest.paymentReference}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Review Action */}
      <ClaimReviewActions
        requestId={claimRequest.id}
        status={claimRequest.status}
        reviewerRole={session.user.role}
      />
    </div>
  );
}
