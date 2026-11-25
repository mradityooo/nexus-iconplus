
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  CarFront,
  ClipboardCheck,
  Plane,
  Wallet,
  UserRound,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileText,
  ShieldCheck,
  Clock3,
  MessageCircle,
  BookOpen,
  CheckCircle2
} from "lucide-react";

type GuideCategory =
  | "Semua"
  | "Reservasi Kendaraan"
  | "Pemeriksaan Kendaraan"
  | "Perjalanan Dinas"
  | "Klaim & Reimbursement"
  | "Akun & Profil";

type GuideItem = {
  id: number;
  category: Exclude<GuideCategory, "Semua">;
  question: string;
  answer: string;
};

const categories: {
  name: GuideCategory;
  icon: typeof CarFront;
  description: string;
}[] = [
  {
    name: "Reservasi Kendaraan",
    icon: CarFront,
    description: "Pemesanan dan penggunaan kendaraan",
  },
  {
    name: "Pemeriksaan Kendaraan",
    icon: ClipboardCheck,
    description: "Pre-Use Inspection (PUI)",
  },
  {
    name: "Perjalanan Dinas",
    icon: Plane,
    description: "Pengajuan perjalanan kerja",
  },
  {
    name: "Klaim & Reimbursement",
    icon: Wallet,
    description: "Pengajuan biaya operasional",
  },
  {
    name: "Akun & Profil",
    icon: UserRound,
    description: "Informasi akun dan keamanan",
  },
];

const guides: GuideItem[] = [
  {
    id: 1,
    category: "Reservasi Kendaraan",
    question: "Bagaimana cara mengajukan reservasi kendaraan?",
    answer:
      "Buka layanan Vehicle Reservation dari halaman Home. Isi informasi tanggal penggunaan, waktu, tujuan, dan keperluan perjalanan. Periksa kembali data sebelum mengirim pengajuan.",
  },
  {
    id: 2,
    category: "Reservasi Kendaraan",
    question: "Bagaimana mengetahui reservasi kendaraan disetujui?",
    answer:
      "Buka My Request dan pilih pengajuan reservasi kendaraan. Periksa tahapan pengajuan mulai dari Pengajuan Terkirim, Pemeriksaan Data, hingga Persetujuan Atasan.",
  },
  {
    id: 3,
    category: "Reservasi Kendaraan",
    question: "Di mana melihat jadwal kendaraan yang sudah disetujui?",
    answer:
      "Pengajuan reservasi kendaraan yang telah disetujui dapat dilihat melalui My Schedule. Informasi kendaraan dan detail penggunaan dapat dibuka dengan memilih kartu jadwal.",
  },
  {
    id: 4,
    category: "Reservasi Kendaraan",
    question: "Di mana melihat riwayat penggunaan kendaraan?",
    answer:
      "Buka Vehicle History untuk melihat catatan penggunaan kendaraan sebelumnya, termasuk tanggal, kendaraan, nomor polisi, tujuan, dan informasi pengembalian yang tersedia.",
  },
  {
    id: 5,
    category: "Pemeriksaan Kendaraan",
    question: "Apa itu Pre-Use Inspection (PUI)?",
    answer:
      "Pre-Use Inspection merupakan pemeriksaan kondisi kendaraan sebelum digunakan. Karyawan mengisi checklist pemeriksaan sesuai komponen yang tersedia pada halaman Pre-Use Inspection.",
  },
  {
    id: 6,
    category: "Pemeriksaan Kendaraan",
    question: "Apa yang harus dilakukan jika kendaraan mengalami masalah?",
    answer:
      "Jangan melanjutkan penggunaan kendaraan apabila ditemukan kondisi yang berpotensi membahayakan. Catat temuan pemeriksaan dan koordinasikan dengan petugas General Affairs (GA).",
  },
  {
    id: 7,
    category: "Perjalanan Dinas",
    question: "Bagaimana cara mengajukan perjalanan dinas?",
    answer:
      "Buka layanan Travel, pilih New Travel, kemudian lengkapi informasi perjalanan seperti tujuan, tanggal keberangkatan, tanggal kembali, dan keperluan perjalanan. Kirim pengajuan setelah data diperiksa.",
  },
  {
    id: 8,
    category: "Perjalanan Dinas",
    question: "Apa perbedaan My Travel dan Summary?",
    answer:
      "My Travel digunakan untuk melihat dan memantau pengajuan perjalanan dinas. Summary digunakan untuk melihat ringkasan informasi perjalanan yang tercatat.",
  },
  {
    id: 9,
    category: "Perjalanan Dinas",
    question: "Di mana melihat status persetujuan perjalanan dinas?",
    answer:
      "Periksa pengajuan melalui My Request untuk melihat proses pemeriksaan dan persetujuan. Jadwal perjalanan yang telah disetujui dapat dilihat melalui My Schedule.",
  },
  {
    id: 10,
    category: "Klaim & Reimbursement",
    question: "Bagaimana cara mengajukan klaim?",
    answer:
      "Buka layanan Claims, pilih jenis klaim yang tersedia, lengkapi informasi pengajuan, masukkan nominal biaya, dan lampirkan dokumen pendukung jika diminta. Periksa kembali sebelum mengirim.",
  },
  {
    id: 11,
    category: "Klaim & Reimbursement",
    question: "Bagaimana mengetahui status klaim?",
    answer:
      "Buka My Request dan pilih pengajuan klaim yang ingin diperiksa. Informasi status dan tahapan persetujuan ditampilkan pada detail pengajuan.",
  },
  {
    id: 12,
    category: "Akun & Profil",
    question: "Bagaimana cara mengubah informasi profil?",
    answer:
      "Pilih ikon profil pada bagian header, kemudian buka halaman Profile. Pilih Edit Profile, ubah informasi yang diperbolehkan, lalu simpan perubahan.",
  },
  {
    id: 13,
    category: "Akun & Profil",
    question: "Bagaimana cara mengganti kata sandi?",
    answer:
      "Buka halaman Profile, masuk ke bagian Ubah Kata Sandi, masukkan kata sandi saat ini dan kata sandi baru, kemudian konfirmasi perubahan.",
  },
  {
    id: 14,
    category: "Akun & Profil",
    question: "Apa fungsi My Request?",
    answer:
      "My Request merupakan pusat pemantauan pengajuan karyawan, termasuk reservasi kendaraan, perjalanan dinas, klaim, dan layanan lain yang menggunakan alur persetujuan.",
  },
];

export default function HelpAndGuidePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<GuideCategory>("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredGuides = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return guides.filter((guide) => {
      const matchesCategory =
        selectedCategory === "Semua" ||
        guide.category === selectedCategory;

      const matchesSearch =
        guide.question.toLowerCase().includes(keyword) ||
        guide.answer.toLowerCase().includes(keyword) ||
        guide.category.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const selectCategory = (category: GuideCategory) => {
    setSelectedCategory(category);
    setExpandedId(null);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white shadow-sm">

        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Kembali ke Home"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-900 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <img
              src="/nexus.png"
              alt="NEXUS"
              className="h-10 w-auto object-contain"
            />
          </div>
        </header>

        <div className="px-5 pb-8 pt-2">

          {/* Page Title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
              NEXUS Support Center
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-tight tracking-tight text-slate-950">
              Help & Guide
            </h1>

            <p className="mt-1 text-xs leading-5 text-black">
              Temukan panduan dan bantuan penggunaan layanan NEXUS.
            </p>
          </section>

          {/* Search */}
          <section className="mb-6">
            <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-sky-500">
              <Search size={18} className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setExpandedId(null);
                }}
                placeholder="Cari panduan atau pertanyaan..."
                className="h-full w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-[10px] font-semibold text-sky-700"
                >
                  Hapus
                </button>
              )}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-950">
                Kategori Panduan
              </h2>

              <span className="text-[10px] text-slate-400">
                {categories.length} kategori
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const active = selectedCategory === category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      selectCategory(
                        active ? "Semua" : category.name
                      )
                    }
                    className={`flex min-h-[104px] flex-col items-start rounded-xl border p-3 text-left transition active:scale-[0.98] ${
                      active
                        ? "border-sky-600 bg-sky-50"
                        : "border-slate-100 bg-slate-50 hover:border-sky-200"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        active
                          ? "bg-sky-100 text-sky-700"
                          : "bg-white text-sky-700"
                      }`}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <p className="mt-2 text-[11px] font-bold text-slate-900">
                      {category.name}
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-slate-500">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Pertanyaan Umum
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Temukan jawaban dari pertanyaan berikut.
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-700">
                {filteredGuides.length} Panduan
              </span>
            </div>

            {/* Active Filter */}
            {selectedCategory !== "Semua" && (
              <div className="mb-3 flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2">
                <p className="text-[10px] font-semibold text-sky-800">
                  {selectedCategory}
                </p>

                <button
                  type="button"
                  onClick={() => selectCategory("Semua")}
                  className="text-[10px] font-bold text-sky-700"
                >
                  Lihat Semua
                </button>
              </div>
            )}

            {filteredGuides.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                <Search
                  size={32}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-700">
                  Panduan tidak ditemukan
                </p>

                <p className="mt-1 px-5 text-xs leading-5 text-slate-500">
                  Coba gunakan kata kunci lain atau pilih kategori berbeda.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    selectCategory("Semua");
                  }}
                  className="mt-4 text-xs font-bold text-sky-700"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGuides.map((guide) => {
                  const expanded = expandedId === guide.id;

                  return (
                    <article
                      key={guide.id}
                      className={`overflow-hidden rounded-xl border transition ${
                        expanded
                          ? "border-sky-200 bg-sky-50/40"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedId(
                            expanded ? null : guide.id
                          )
                        }
                        className="flex w-full items-center gap-3 p-3.5 text-left"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sky-700">
                          <CircleHelp size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold leading-5 text-slate-900">
                            {guide.question}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {guide.category}
                          </p>
                        </div>

                        <ChevronDown
                          size={16}
                          className={`shrink-0 text-slate-400 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expanded && (
                        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                          <p className="text-[11px] leading-6 text-slate-600">
                            {guide.answer}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Request Process */}
          <section className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Alur Pengajuan NEXUS
                </h3>

                <p className="text-[9px] text-slate-500">
                  Tahapan pengajuan layanan karyawan.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Pengajuan Terkirim",
                  description: "Karyawan mengirimkan formulir pengajuan.",
                  icon: FileText,
                },
                {
                  title: "Pemeriksaan Data",
                  description: "Petugas GA memeriksa kelengkapan data.",
                  icon: ClipboardCheck,
                },
                {
                  title: "Persetujuan Atasan",
                  description: "Atasan melakukan pemeriksaan dan keputusan.",
                  icon: UserRound,
                },
                {
                  title: "Selesai",
                  description: "Hasil persetujuan pengajuan.",
                  icon: CheckCircle2,
                },
              ].map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm">
                      <Icon size={15} />
                    </div>

                    <div className="flex-1 pt-0.5">
                      <p className="text-[11px] font-bold text-slate-800">
                        {index + 1}. {step.title}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/my-request"
              className="mt-4 flex min-h-10 items-center justify-center rounded-xl bg-sky-700 text-xs font-bold text-white transition hover:bg-sky-800"
            >
              Lihat My Request
            </Link>
          </section>

          {/* Support Information */}
          <section className="mt-5 rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <MessageCircle
                size={19}
                className="text-sky-700"
              />

              <h3 className="text-xs font-bold text-slate-900">
                Masih Membutuhkan Bantuan?
              </h3>
            </div>

            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              Jika mengalami kendala atau membutuhkan bantuan lebih lanjut,
              silakan hubungi administrator atau petugas General Affairs (GA)
              melalui kanal komunikasi internal perusahaan.
            </p>
          </section>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-400">
              NEXUS · Employees Operations Portal · PLN Icon Plus
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
