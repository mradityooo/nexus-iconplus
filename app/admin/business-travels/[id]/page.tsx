
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plane,
  CalendarDays,
  MapPin,
  UserRound,
  Building2,
  BriefcaseBusiness,
  Clock,
  FileText,
} from "lucide-react";

type BusinessTravel = {
  id: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  transportation: string | null;
  notes: string | null;
  reviewNote: string | null;
  status: string;
  createdAt: string;
  employee: {
    id: string;
    employeeCode: string;
    fullName: string;
    department: string;
    position: string;
  };
  approvedBy: {
    id: string;
    email: string;
  } | null;
  facilities: {
    id: string;
    type: string;
    notes?: string | null;
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
  OTHER_TRANSPORTATION: "Transportasi Lainnya",
};

export default function BusinessTravelDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [data, setData] = useState<BusinessTravel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      try {
        const response = await fetch(
          `/api/admin/business-travels/${id}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil detail.");
        }

        if (!cancelled) {
          setData(result.data);
        }
      } catch (err) {
        console.error("BUSINESS TRAVEL DETAIL ERROR:", err);

        if (!cancelled) {
          setError("Gagal mengambil detail pengajuan perjalanan dinas.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Memuat detail pengajuan...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          {error || "Pengajuan tidak ditemukan."}
        </p>

        <button
          onClick={() => router.back()}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/business-travels"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600"
        >
          <ArrowLeft size={16} />
          Kembali ke Business Travel
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Plane size={16} />
              Operations Management
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Detail Perjalanan Dinas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Informasi lengkap pengajuan perjalanan dinas karyawan.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
              statusStyles[data.status] || "bg-slate-100 text-slate-600"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Employee Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
            <UserRound size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Informasi Karyawan
            </h2>
            <p className="text-xs text-slate-500">
              Data pemohon perjalanan dinas
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Nama Karyawan</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.employee.fullName}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">NIK / Employee Code</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.employee.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Departemen</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.employee.department}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Jabatan</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.employee.position}
            </p>
          </div>
        </div>
      </div>

      {/* Travel Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <MapPin size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Informasi Perjalanan
            </h2>
            <p className="text-xs text-slate-500">
              Tujuan dan jadwal perjalanan dinas
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Tujuan Perjalanan</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.destination}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Transportasi</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.transportation || "Tidak ditentukan"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Tanggal Keberangkatan</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays size={16} className="text-sky-500" />
              {formatDate(data.departureDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Tanggal Kepulangan</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays size={16} className="text-sky-500" />
              {formatDate(data.returnDate)}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-slate-500">Tujuan / Keperluan</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {data.purpose}
            </p>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <BriefcaseBusiness size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Fasilitas yang Diminta
            </h2>
            <p className="text-xs text-slate-500">
              Kebutuhan fasilitas selama perjalanan dinas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {data.facilities.length > 0 ? (
            data.facilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-700">
                  {facilityLabels[facility.type] || facility.type}
                </p>

                {facility.notes && (
                  <p className="mt-1 text-xs text-slate-500">
                    {facility.notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Tidak ada fasilitas yang diminta.
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <FileText size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Catatan Pengajuan
            </h2>
            <p className="text-xs text-slate-500">
              Catatan dari karyawan dan hasil peninjauan
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">Catatan Karyawan</p>
            <p className="mt-1 text-sm text-slate-700">
              {data.notes || "Tidak ada catatan."}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Catatan GA / Supervisor</p>
            <p className="mt-1 text-sm text-slate-700">
              {data.reviewNote || "Belum ada catatan peninjauan."}
            </p>
          </div>
        </div>
      </div>

      {/* Approval Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Building2 size={21} />
          </div>
          <h2 className="font-semibold text-slate-900">
            Informasi Persetujuan
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          Disetujui oleh
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {data.approvedBy?.email || "Belum ada persetujuan"}
        </p>

        <p className="mt-4 text-xs text-slate-500">
          Tanggal Pengajuan
        </p>

        <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
          <Clock size={15} />
          {formatDate(data.createdAt)}
        </p>
      </div>
    </div>
  );
}
