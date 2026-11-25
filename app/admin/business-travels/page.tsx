"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plane,
  Search,
  RefreshCw,
  CalendarDays,
  MapPin,
  Users,
  Clock,
} from "lucide-react";

type BusinessTravel = {
  id: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  transportation: string | null;
  status: string;
  createdAt: string;
  employee: {
    id: string;
    employeeCode: string;
    fullName: string;
    department: string;
    position: string;
  };
  facilities: {
    id: string;
    type: string;
  }[];
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  PROCESSING: "bg-violet-100 text-violet-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

const facilityLabels: Record<string, string> = {
  FLIGHT_TICKET: "Tiket Pesawat",
  HOTEL: "Hotel",
  OTHER_TRANSPORTATION: "Transportasi",
};

export default function BusinessTravelsPage() {
  const [data, setData] = useState<BusinessTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");


async function fetchBusinessTravels() {
  const response = await fetch("/api/admin/business-travels", {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil data.");
  }

  return result.data as BusinessTravel[];
}

useEffect(() => {
  let cancelled = false;

  fetchBusinessTravels()
    .then((result) => {
      if (!cancelled) {
        setData(result);
        setError("");
      }
    })
    .catch((err) => {
      console.error("FETCH BUSINESS TRAVEL ERROR:", err);

      if (!cancelled) {
        setError("Gagal mengambil data perjalanan dinas.");
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, []);


  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.employee.fullName.toLowerCase().includes(keyword) ||
      item.employee.employeeCode.toLowerCase().includes(keyword) ||
      item.destination.toLowerCase().includes(keyword)
    );
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Plane size={16} />
            <span>Operations Management</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Business Travel
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola pengajuan perjalanan dinas karyawan.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setError("");
            fetchBusinessTravels();
            }}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Pengajuan</p>
            <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
              <Plane size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {data.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Menunggu Persetujuan</p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {data.filter((item) => item.status === "PENDING").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Sedang Diproses GA</p>
            <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {data.filter((item) => item.status === "PROCESSING").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Daftar Pengajuan
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Data pengajuan perjalanan dinas karyawan.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari karyawan atau tujuan..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Karyawan</th>
                <th className="px-5 py-4 font-semibold">Tujuan</th>
                <th className="px-5 py-4 font-semibold">Periode</th>
                <th className="px-5 py-4 font-semibold">Fasilitas</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                    Memuat data pengajuan...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Plane className="mx-auto mb-3 text-slate-300" size={32} />
                    <p className="font-medium text-slate-700">
                      Belum ada pengajuan perjalanan dinas
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Data pengajuan karyawan akan muncul di sini.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.employee.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.employee.employeeCode} · {item.employee.department}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                        <MapPin size={15} className="text-sky-500" />
                        {item.destination}
                      </div>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {item.purpose}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CalendarDays size={15} className="text-slate-400" />
                        {formatDate(item.departureDate)}
                      </div>
                      <p className="mt-1 pl-6 text-xs text-slate-500">
                        s/d {formatDate(item.returnDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.facilities.map((facility) => (
                          <span
                            key={facility.id}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
                          >
                            {facilityLabels[facility.type] || facility.type}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[item.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                    <Link
                        href={`/admin/business-travels/${item.id}`}
                        className="inline-flex items-center rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                    >
                        Detail
                    </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
          Menampilkan {filteredData.length} dari {data.length} pengajuan.
        </div>
      </div>
    </div>
  );
}
