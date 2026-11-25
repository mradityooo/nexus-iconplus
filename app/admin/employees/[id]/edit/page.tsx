
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  workLocation: string | null;
  joinDate: string | null;
}

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employeeCode: "",
    fullName: "",
    phone: "",
    department: "",
    position: "",
    workLocation: "",
    joinDate: "",
  });

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await fetch(`/api/employees/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data.");
        }

        const employee: Employee = result.data;

        setForm({
          employeeCode: employee.employeeCode,
          fullName: employee.fullName,
          phone: employee.phone || "",
          department: employee.department || "",
          position: employee.position || "",
          workLocation: employee.workLocation || "",
          joinDate: employee.joinDate
            ? new Date(employee.joinDate).toISOString().slice(0, 10)
            : "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchEmployee();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui data.");
      }

      alert("Data karyawan berhasil diperbarui.");
      router.push("/admin/employees");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" />
        <span className="ml-2">Memuat data karyawan...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/employees"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar karyawan
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          Edit Karyawan
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi dan data karyawan NEXUS.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="font-semibold text-gray-900">
            Informasi Karyawan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Lengkapi informasi identitas karyawan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            { name: "employeeCode", label: "Employee ID", required: true },
            { name: "fullName", label: "Nama Lengkap", required: true },
            { name: "phone", label: "Nomor Telepon" },
            { name: "department", label: "Departemen" },
            { name: "position", label: "Jabatan" },
            { name: "workLocation", label: "Lokasi Kerja" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="text-red-500"> *</span>
                )}
              </label>

              <input
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required={field.required}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tanggal Bergabung
            </label>
            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link
            href="/admin/employees"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
