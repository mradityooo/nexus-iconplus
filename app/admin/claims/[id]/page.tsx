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
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface ClaimDetailPageProps {
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

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
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

export default async function ClaimDetailPage({
  params,
}: ClaimDetailPageProps) {
  const session = await auth();

  if (!session?.user || !["GA", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const { id } = await params;

  const claim = await prisma.claim.findUnique({
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
        approvedBy: {
        select: {
            employee: {
            select: {
                fullName: true,
            },
            },
        },
        },
    },
  });

  if (!claim) {
    notFound();
  }

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const detailItems = [
    {
      label: "Category",
      value: categoryLabels[claim.category] ?? claim.category,
      icon: FileText,
    },
    {
      label: "Transaction Date",
      value: formatDate(claim.transactionDate),
      icon: CalendarDays,
    },
    {
      label: "Reference",
      value: claim.reference || "-",
      icon: FileText,
    },
    {
      label: "Claim Amount",
      value: formatRupiah(claim.amount.toString()),
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/claims"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0756A5]"
          >
            <ArrowLeft size={16} />
            Back to Claims
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            Claim Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review employee claim information and transaction details.
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${
            statusColor[claim.status] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {statusLabels[claim.status] ?? claim.status}
        </span>
      </div>

      {/* Employee Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 text-[#0756A5]">
            <UserRound size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Employee Information
            </h2>
            <p className="text-sm text-gray-500">
              Employee identity and department
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Employee Name</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claim.employee.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claim.employee.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claim.employee.department || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 font-semibold text-gray-900">
              {claim.employee.user?.email || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Claim Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 text-[#0756A5]">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Claim Information
            </h2>
            <p className="text-sm text-gray-500">
              Details of the submitted claim
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {detailItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
            <ClaimReviewActions
                claimId={claim.id}
                status={claim.status}
            />
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500">Description</p>
          <p className="mt-2 text-sm leading-6 text-gray-800">
            {claim.description}
          </p>
        </div>

        {claim.notes && (
          <div className="mt-5 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-semibold text-[#0756A5]">
              Additional Notes
            </p>
            <p className="mt-2 text-sm text-gray-700">
              {claim.notes}
            </p>
          </div>
        )}
      </div>

      {/* Fuel Information */}
      {claim.category === "FUEL" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-50 p-2.5 text-yellow-700">
              <Fuel size={20} />
            </div>
            <h2 className="font-semibold text-gray-900">
              Fuel Information
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="mt-1 font-semibold text-gray-900">
                {claim.fuelType || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Liters</p>
              <p className="mt-1 font-semibold text-gray-900">
                {claim.liters?.toString() || "-"} L
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Price per Liter</p>
              <p className="mt-1 font-semibold text-gray-900">
                {claim.pricePerLiter
                  ? formatRupiah(claim.pricePerLiter.toString())
                  : "-"}
              </p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm text-gray-500">Station Location</p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                <MapPin size={16} />
                {claim.stationLocation || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
            <Clock size={20} />
          </div>
          <h2 className="font-semibold text-gray-900">
            Review Information
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Submitted At</p>
            <p className="mt-1 font-medium text-gray-900">
              {formatDate(claim.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reviewed By</p>
            <p className="mt-1 font-medium text-gray-900">
              {claim.approvedBy?.employee?.fullName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reviewed At</p>
            <p className="mt-1 font-medium text-gray-900">
              {claim.reviewedAt ? formatDate(claim.reviewedAt) : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Review Note</p>
            <p className="mt-1 font-medium text-gray-900">
              {claim.reviewNote || "-"}
            </p>
          </div>
        </div>
      </div>

        {/* Transaction Receipt */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">
            Transaction Receipt
        </h2>

        <p className="mt-2 text-sm text-gray-500">
            View the receipt uploaded by the employee.
        </p>

        {claim.receiptUrl ? (
            <div className="mt-4">
            <a
                href={`/api/admin/claims/${claim.id}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0756A5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
                <FileText size={17} />
                View Receipt
            </a>
            </div>
        ) : (
            <p className="mt-4 text-sm text-red-600">
            No receipt uploaded.
            </p>
        )}
        </div>
    </div>
  );
}
