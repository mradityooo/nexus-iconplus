
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Save,
  Loader2,
} from "lucide-react";

export default function AddEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    employeeCode: "",
    fullName: "",
    phone: "",
    department: "",
    position: "",
    workLocation: "",
    joinDate: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal menambahkan karyawan.");
        return;
      }

      setSuccess("Data karyawan berhasil ditambahkan.");

      setTimeout(() => {
        router.push("/admin/employees");
        router.refresh();
      }, 1000);
    } catch {
      setError("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#0095DA] focus:ring-4 focus:ring-sky-100";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Link
          href="/admin/employees"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0095DA]"
        >
          <ArrowLeft size={17} />
          Back to Employees
        </Link>

        <p className="text-sm font-semibold text-[#0095DA]">
          EMPLOYEE MANAGEMENT
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Add New Employee
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter employee information to register a new employee.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0095DA]">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500">
                Basic employee details
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Employee ID *
              </label>

              <input
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                placeholder="Example: NEX-2026-004"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name *
              </label>

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
              </label>

              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Example: General Affairs"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Position
              </label>

              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Enter position"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Work Location
              </label>

              <input
                name="workLocation"
                value={form.workLocation}
                onChange={handleChange}
                placeholder="Enter work location"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Join Date
              </label>

              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-semibold text-sky-800">
            Employee Account Information
          </p>

          <p className="mt-1 text-xs leading-5 text-sky-700">
            An employee account will not be created automatically.
            The employee must register through the NEXUS User portal
            using the Employee ID provided above.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link
            href="/admin/employees"
            className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0095DA] px-6 text-sm font-semibold text-white transition hover:bg-[#007AB8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
