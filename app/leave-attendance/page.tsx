
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

const features = [
  {
    title: "Absensi Karyawan",
    description: "Kelola kehadiran dan riwayat absensi karyawan.",
    icon: CalendarCheck,
  },
  {
    title: "Pengajuan Cuti",
    description: "Ajukan cuti dan pantau status persetujuan.",
    icon: CalendarDays,
  },
  {
    title: "Riwayat Administrasi",
    description: "Lihat riwayat absensi dan pengajuan cuti.",
    icon: ClipboardList,
  },
];

export default function LeaveAttendancePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-white px-5 py-6">
        <header>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600"
          >
            <ArrowLeft size={20} />
            Kembali
          </Link>

          <p className="text-xs font-semibold uppercase text-red-600">
            EMPLOYEE PORTAL
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Leave & Attendance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manajemen kehadiran dan cuti karyawan
            PLN Icon Plus.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Layanan Karyawan
          </h2>

          <div className="space-y-4">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 shadow-sm"
                >
                  <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                    <FeatureIcon size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {feature.description}
                    </p>

                    <span className="mt-2 inline-block text-xs font-medium text-amber-600">
                      Dalam tahap pengembangan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
