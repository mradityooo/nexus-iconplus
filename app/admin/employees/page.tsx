
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DeleteEmployeeButton from "@/components/delete-employee-button";
import { redirect } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
} from "lucide-react";

export default async function EmployeesPage() {
  const session = await auth();

  if (
    !session?.user ||
    !["GA", "ADMIN"].includes(session.user.role)
  ) {
    redirect("/login");
  }

  const employees = await prisma.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          email: true,
          status: true,
        },
      },
    },
  });

  const totalEmployees = employees.length;
  const registered = employees.filter((item) => item.userId !== null).length;
  const notRegistered = totalEmployees - registered;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#0095DA]">
            MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Employee Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage employee information and registration status.
          </p>
        </div>

        <Link
          href="/admin/employees/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0095DA] px-5 py-3 text-sm font-semibold text-white hover:bg-[#007AB8]"
        >
          <Plus size={18} />
          Add Employee
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Employees",
            value: totalEmployees,
            icon: Users,
          },
          {
            label: "Registered Accounts",
            value: registered,
            icon: Users,
          },
          {
            label: "Not Registered",
            value: notRegistered,
            icon: Users,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0095DA]">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Employee Directory
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              All registered employee records
            </p>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              placeholder="Search employees..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#0095DA] sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Employee</th>
                <th className="px-5 py-4">Employee ID</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Account Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                <div className="flex items-center gap-2">
                <Link
                    href={`/admin/employees/${employee.id}/edit`}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                    Edit
                </Link>

                <DeleteEmployeeButton
                    employeeId={employee.id}
                    employeeName={employee.fullName}
                />
                </div>
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
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Registered
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Not Registered
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No employee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 p-4 text-xs text-slate-400">
          Showing {employees.length} employee records
        </div>
      </div>
    </div>
  );
}
