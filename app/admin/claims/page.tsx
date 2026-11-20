
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  ReceiptText,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ClaimsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

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

const formatRupiah = (amount: number) =>
  "Rp " + amount.toLocaleString("id-ID");

export default async function ClaimsPage({
  searchParams,
}: ClaimsPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    !["GA", "ADMIN"].includes(session.user.role)
  ) {
    redirect("/login");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = params.status ?? "";
  const category = params.category ?? "";

  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" } : {}),
    ...(category
      ? { category: category as "CAR_WASH" | "MEALS" | "TOLL_FEE" | "FUEL" | "OTHERS" }
      : {}),
    ...(q
      ? {
          OR: [
            {
              employee: {
                fullName: {
                  contains: q,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              employee: {
                employeeCode: {
                  contains: q,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              description: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [
    claims,
    filteredCount,
    totalClaims,
    pending,
    approved,
    rejected,
  ] = await Promise.all([
    prisma.claim.findMany({
      where,
      include: {
        employee: {
          select: {
            fullName: true,
            employeeCode: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (requestedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.claim.count({ where }),
    prisma.claim.count(),
    prisma.claim.count({ where: { status: "PENDING" } }),
    prisma.claim.count({ where: { status: "APPROVED" } }),
    prisma.claim.count({ where: { status: "REJECTED" } }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCount / PAGE_SIZE)
  );

  const currentPage = Math.min(requestedPage, totalPages);

  function createPageUrl(page: number) {
    const query = new URLSearchParams();

    if (q) query.set("q", q);
    if (status) query.set("status", status);
    if (category) query.set("category", category);

    query.set("page", String(page));

    return `/admin/claims?${query.toString()}`;
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-bold tracking-widest text-[#F2C300]">
          NEXUS / FINANCE & OPERATIONS
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#0756A5]">
          Claims Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Kelola dan verifikasi pengajuan reimbursement karyawan.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Claims",
            value: totalClaims,
            icon: ReceiptText,
            color: "bg-blue-50 text-[#0756A5]",
          },
          {
            label: "Pending",
            value: pending,
            icon: Clock3,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Approved",
            value: approved,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Rejected",
            value: rejected,
            icon: XCircle,
            color: "bg-red-50 text-red-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                <Icon size={21} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {item.label}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Claims Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">
            Claims Directory
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Daftar pengajuan reimbursement seluruh karyawan.
          </p>

          {/* Search and Filters */}
          <form
            action="/admin/claims"
            method="GET"
            className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                name="q"
                defaultValue={q}
                placeholder="Cari nama, Employee ID, deskripsi..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"
            >
              <option value="">Semua Status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={category}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"
            >
              <option value="">Semua Kategori</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div className="flex gap-2 md:col-span-2 xl:col-span-4">
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0756A5] px-4 text-sm font-semibold text-white hover:bg-[#064681]"
              >
                <Filter size={15} />
                Terapkan Filter
              </button>

              <Link
                href="/admin/claims"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw size={15} />
                Reset
              </Link>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F7FC] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Employee</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Transaction Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <tr
                  key={claim.id}
                  className="transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {claim.employee.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {claim.employee.employeeCode}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {categoryLabels[claim.category]}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {new Date(claim.transactionDate).toLocaleDateString("id-ID")}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                    {formatRupiah(Number(claim.amount))}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        claim.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : claim.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : claim.status === "REJECTED"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {statusLabels[claim.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/claims/${claim.id}`}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-[#0756A5] hover:bg-blue-50"
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}

              {claims.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    Belum ada pengajuan klaim yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan {filteredCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            {" - "}
            {Math.min(currentPage * PAGE_SIZE, filteredCount)} dari{" "}
            {filteredCount} klaim
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={createPageUrl(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage <= 1}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                currentPage <= 1
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft size={15} />
            </Link>

            <span className="px-2 text-xs font-semibold text-slate-600">
              {currentPage} / {totalPages}
            </span>

            <Link
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage >= totalPages}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                currentPage >= totalPages
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
