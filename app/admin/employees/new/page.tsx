
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Save,
  Loader2,
  User,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Phone,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
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
    e: React.ChangeEvent<HTMLInputElement>
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

    if (
      form.phone &&
      !/^[0-9+\-\s()]{8,20}$/.test(form.phone)
    ) {
      setError("Format nomor telepon tidak valid.");
      return;
    }

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
      }, 1200);
    } catch {
      setError("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0756A5] focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* Header */}
      <div>
        <Link
          href="/admin/employees"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0756A5]"
        >
          <ArrowLeft size={17} />
          Back to Employees
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0756A5]">
            <UserPlus size={24} />
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-[#E0B400]">
              NEXUS / HUMAN RESOURCES
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0756A5]">
              Add New Employee
            </h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Register new employee information into the NEXUS system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0756A5]">
              <User size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Personal Information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Basic employee identity and contact details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            <div>
              <label className={labelClass}>
                Employee ID <span className="text-red-500">*</span>
              </label>

              <input
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                placeholder="Example: NEX-2026-004"
                required
                maxLength={30}
                className={inputClass}
              />
              <p className="mt-2 text-xs text-slate-400">
                Unique employee identification number.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter employee full name"
                required
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Join Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  name="joinDate"
                  value={form.joinDate}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Employment Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Employment Information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Department, position, and work location.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            <div>
              <label className={labelClass}>
                Department
              </label>

              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Example: General Affairs"
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Position
              </label>

              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Enter employee position"
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Work Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="workLocation"
                  value={form.workLocation}
                  onChange={handleChange}
                  placeholder="Example: PLN Icon Plus Bandar Lampung"
                  maxLength={150}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0756A5]">
              <BadgeCheck size={21} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0756A5]">
                Employee Account Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                An employee account will not be created automatically.
                The employee can register through the NEXUS User Portal
                using the Employee ID provided by the administrator.
              </p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">

          <Link
            href="/admin/employees"
            className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0756A5] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064681] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {loading ? "Saving Employee..." : "Save Employee"}
          </button>

        </div>
      </form>
    </div>
  );
}
