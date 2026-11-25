
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteEmployeeButtonProps {
  employeeId: string;
  employeeName: string;
}

export default function DeleteEmployeeButton({
  employeeId,
  employeeName,
}: DeleteEmployeeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus karyawan ${employeeName}?`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/employees/${employeeId}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menghapus karyawan."
        );
      }

      alert(result.message);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
      Hapus
    </button>
  );
}
