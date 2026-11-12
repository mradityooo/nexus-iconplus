
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DeleteEmployeeButton from "@/components/delete-employee-button";
import { redirect } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface EmployeesPageProps {
  searchParams: Promise<{
    q?: string;
    department?: string;
    status?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const session = await auth();

  if (!session?.user || !["GA", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const department = params.department ?? "";
  const status = params.status ?? "";

  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { employeeCode: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(department ? { department } : {}),
    ...(status === "registered"
      ? { userId: { not: null } }
      : status === "not-registered"
        ? { userId: null }
        : {}),
  };

  const [
    employees,
    filteredCount,
    totalEmployees,
    registered,
    departments,
  ] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            status: true,
          },
        },
      },
      skip: (requestedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.employee.count({ where }),
    prisma.employee.count(),
    prisma.employee.count({ where: { userId: { not: null } } }),
    prisma.employee.findMany({
      where: { department: { not: null } },
      select: { department: true },
      distinct: ["department"],
      orderBy: { department: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const notRegistered = totalEmployees - registered;

  // Membentuk URL filter dan pagination
  function createPageUrl(page: number) {
    const query = new URLSearchParams();

    if (q) query.set("q", q);
    if (department) query.set("department", department);
    if (status) query.set("status", status);
    query.set("page", String(page));

    return `/admin/employees?${query.toString()}`;
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold tracking-widest text-[#F2C300]">
            NEXUS / HUMAN RESOURCES
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#0756A5]">
            Employee Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola informasi dan status registrasi seluruh karyawan.
          </p>
        </div>

        <Link
          href="/admin/employees/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0756A5] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064681]"
        >
          <Plus size={18} />
          Add Employee
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Employees",
            value: totalEmployees,
            color: "bg-blue-50 text-[#0756A5]",
          },
          {
            label: "Registered Accounts",
            value: registered,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Not Registered",
            value: notRegistered,
            color: "bg-amber-50 text-amber-700",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
              <Users size={21} />
            </div>

            <p className="mt-4 text-sm text-slate-500">{item.label}</p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Employee Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">
              Employee Directory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Cari dan kelola data karyawan NEXUS.
            </p>
          </div>

          {/* Search and filters */}
          <form
            action="/admin/employees"
            method="GET"
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="q"
                defaultValue={q}
                placeholder="Cari nama, Employee ID, atau telepon..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              name="department"
              defaultValue={department}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Semua Departemen</option>
              {departments.map((item) => (
                <option key={item.department} value={item.department!}>
                  {item.department}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Semua Status</option>
              <option value="registered">Sudah Terdaftar</option>
              <option value="not-registered">Belum Terdaftar</option>
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
                href="/admin/employees"
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
                <th className="px-5 py-4">Employee ID</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {employee.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {employee.user?.email ?? "No account yet"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                    {employee.employeeCode}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.department ?? "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.position ?? "-"}
                  </td>

                  <td className="px-5 py-4">
                    {employee.userId ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Registered
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Not Registered
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/employees/${employee.id}/edit`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-[#0756A5] hover:bg-blue-50"
                      >
                        Edit
                      </Link>

                      <DeleteEmployeeButton
                        employeeId={employee.id}
                        employeeName={employee.fullName}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    Tidak ada data karyawan yang sesuai dengan pencarian.
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
            {filteredCount} karyawan
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={createPageUrl(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage <= 1}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                currentPage <= 1
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft size={15} />
              Previous
            </Link>

            <span className="px-2 text-xs font-semibold text-slate-600">
              {currentPage} / {totalPages}
            </span>

            <Link
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage >= totalPages}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                currentPage >= totalPages
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Next
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
