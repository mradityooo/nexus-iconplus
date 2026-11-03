
"use client";

import { useEffect, useMemo, useState, type FormEvent, } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  CalendarDays,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  X,
  Save,
  StickyNote,
} from "lucide-react";

type NoteCategory =
  | "Pekerjaan"
  | "Pengingat"
  | "Agenda"
  | "Lainnya";

type NotePriority = "Rendah" | "Sedang" | "Tinggi";

type Note = {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  priority: NotePriority;
  date: string;
  completed: boolean;
};

const initialNotes: Note[] = [
  {
    id: "NOTE-001",
    title: "Follow up reservasi kendaraan",
    content:
      "Konfirmasi status pengajuan reservasi kendaraan kepada petugas GA.",
    category: "Pekerjaan",
    priority: "Tinggi",
    date: "2026-10-30",
    completed: false,
  },
  {
    id: "NOTE-002",
    title: "Persiapan dokumen meeting",
    content:
      "Siapkan dokumen dan materi untuk rapat koordinasi operasional.",
    category: "Agenda",
    priority: "Sedang",
    date: "2026-10-29",
    completed: false,
  },
  {
    id: "NOTE-003",
    title: "Periksa jadwal perjalanan dinas",
    content:
      "Pastikan jadwal keberangkatan dan detail perjalanan sudah sesuai.",
    category: "Pengingat",
    priority: "Rendah",
    date: "2026-10-27",
    completed: true,
  },
];

const categories: NoteCategory[] = [
  "Pekerjaan",
  "Pengingat",
  "Agenda",
  "Lainnya",
];

const priorities: NotePriority[] = [
  "Rendah",
  "Sedang",
  "Tinggi",
];

const priorityStyle: Record<NotePriority, string> = {
  Rendah: "bg-slate-100 text-slate-600",
  Sedang: "bg-amber-50 text-amber-700",
  Tinggi: "bg-red-50 text-red-700",
};

const categoryStyle: Record<NoteCategory, string> = {
  Pekerjaan: "bg-sky-50 text-sky-700",
  Pengingat: "bg-violet-50 text-violet-700",
  Agenda: "bg-emerald-50 text-emerald-700",
  Lainnya: "bg-slate-100 text-slate-600",
};

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value: string) => {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

export default function AddNotePage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "Semua" | "Aktif" | "Selesai"
  >("Semua");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<NoteCategory>("Pekerjaan");
  const [priority, setPriority] =
    useState<NotePriority>("Sedang");
  const [noteDate, setNoteDate] = useState(today());

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load saved notes from browser storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus-personal-notes");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch {
      console.error("Gagal membaca catatan tersimpan.");
    }
  }, []);

  // Save notes whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "nexus-personal-notes",
        JSON.stringify(notes)
      );
    } catch {
      console.error("Gagal menyimpan catatan.");
    }
  }, [notes]);

  const activeCount = notes.filter(
    (note) => !note.completed
  ).length;

  const completedCount = notes.filter(
    (note) => note.completed
  ).length;

  const filteredNotes = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return notes
      .filter((note) => {
        const matchesFilter =
          filter === "Semua" ||
          (filter === "Aktif" && !note.completed) ||
          (filter === "Selesai" && note.completed);

        const matchesSearch =
          note.title.toLowerCase().includes(keyword) ||
          note.content.toLowerCase().includes(keyword) ||
          note.category.toLowerCase().includes(keyword);

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [notes, filter, search]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Pekerjaan");
    setPriority("Sedang");
    setNoteDate(today());
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                category,
                priority,
                date: noteDate,
              }
            : note
        )
      );
    } else {
      const newNote: Note = {
        id: `NOTE-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        date: noteDate,
        completed: false,
      };

      setNotes((current) => [newNote, ...current]);
    }

    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setPriority(note.priority);
    setNoteDate(note.date);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;

    setNotes((current) =>
      current.filter((note) => note.id !== deleteId)
    );

    setDeleteId(null);
  };

  const toggleCompleted = (id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? { ...note, completed: !note.completed }
          : note
      )
    );
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
              Personal Workspace
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-tight tracking-tight text-slate-950">
              Add Note
            </h1>

            <p className="mt-1 text-xs leading-5 text-black">
              Catat ide, pengingat, dan aktivitas pekerjaan Anda.
            </p>
          </section>

          {/* Statistics */}
          <section className="mb-6 grid grid-cols-3 gap-2">
            <div className="rounded-3 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">
                Total Catatan
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {notes.length}
              </p>
            </div>

            <div className="rounded-3 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">
                Aktif
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {activeCount}
              </p>
            </div>

            <div className="rounded-3 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">
                Selesai
              </p>
              <p className="mt-1 text-xl font-bold text-black">
                {completedCount}
              </p>
            </div>
          </section>

          {/* Add Note Button */}
          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingId(null);
                setTitle("");
                setContent("");
                setCategory("Pekerjaan");
                setPriority("Sedang");
                setNoteDate(today());
                setShowForm(true);
              }
            }}
            className="mb-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087BB7] text-xs font-bold text-white transition hover:bg-[#06699E] active:scale-[0.99]"
          >
            {showForm ? <X size={16} /> : <Plus size={17} />}
            {showForm ? "Tutup Form" : "Buat Catatan Baru"}
          </button>

          {/* Note Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <StickyNote size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {editingId ? "Edit Catatan" : "Catatan Baru"}
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    Lengkapi informasi catatan Anda.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Judul Catatan
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul catatan"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Isi Catatan
                  </label>

                  <textarea
                    required
                    rows={4}
                    maxLength={1000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan detail catatan Anda..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-800 outline-none focus:border-sky-500"
                  />

                  <p className="mt-1 text-right text-[9px] text-slate-400">
                    {content.length}/1000 karakter
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Kategori
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as NoteCategory)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-sky-500"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                      Prioritas
                    </label>

                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as NotePriority)
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-sky-500"
                    >
                      {priorities.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                      Tanggal
                    </label>

                    <input
                      type="date"
                      required
                      value={noteDate}
                      onChange={(e) => setNoteDate(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-[10px] text-slate-800 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-10 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#087BB7] text-xs font-bold text-white hover:bg-[#06699E]"
                >
                  <Save size={15} />
                  {editingId ? "Simpan Perubahan" : "Simpan Catatan"}
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <section className="mb-4">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-sky-500">
              <Search size={17} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari catatan..."
                className="h-full w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </section>

          {/* Filters */}
          <section className="mb-5">
            <div className="flex gap-2">
              {(["Semua", "Aktif", "Selesai"] as const).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-semibold transition ${
                      filter === item
                        ? "border-sky-700 bg-sky-700 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </section>

          {/* Notes List */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Catatan Saya
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Daftar catatan pribadi Anda.
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-700">
                {filteredNotes.length} Catatan
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                <FileText
                  size={35}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-700">
                  Belum ada catatan
                </p>

                <p className="mt-1 px-5 text-xs leading-5 text-slate-500">
                  Buat catatan baru atau ubah filter pencarian.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("Semua");
                  }}
                  className="mt-4 text-xs font-bold text-sky-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <article
                    key={note.id}
                    className={`rounded-2xl border p-4 transition ${
                      note.completed
                        ? "border-slate-100 bg-slate-50/70"
                        : "border-slate-100 bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCompleted(note.id)}
                        aria-label={
                          note.completed
                            ? "Tandai belum selesai"
                            : "Tandai selesai"
                        }
                        className="mt-0.5 shrink-0 text-slate-400 transition hover:text-emerald-600"
                      >
                        {note.completed ? (
                          <CheckCircle2
                            size={21}
                            className="text-emerald-600"
                          />
                        ) : (
                          <Circle size={21} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${categoryStyle[note.category]}`}
                          >
                            {note.category}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${priorityStyle[note.priority]}`}
                          >
                            {note.priority}
                          </span>
                        </div>

                        <h3
                          className={`mt-2 text-sm font-bold ${
                            note.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-950"
                          }`}
                        >
                          {note.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap text-[11px] leading-5 text-slate-500">
                          {note.content}
                        </p>

                        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <CalendarDays size={12} />
                          {formatDate(note.date)}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                          <span
                            className={`text-[10px] font-semibold ${
                              note.completed
                                ? "text-emerald-600"
                                : "text-sky-700"
                            }`}
                          >
                            {note.completed ? "Selesai" : "Belum selesai"}
                          </span>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(note)}
                              aria-label="Edit catatan"
                              className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-sky-700"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteId(note.id)}
                              aria-label="Hapus catatan"
                              className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-red-600"
                            >
                              <Trash2 size={13} />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Privacy Information */}
          <section className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-start gap-2">
              <FileText
                size={16}
                className="mt-0.5 shrink-0 text-sky-700"
              />

              <p className="text-[10px] leading-5 text-slate-500">
                Catatan ini bersifat pribadi dan disimpan pada browser
                perangkat yang digunakan. Catatan belum tersinkronisasi
                dengan akun atau perangkat lain.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-400">
              NEXUS · Employees Operations Portal · PLN Icon Plus
            </p>
          </footer>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-note-title"
            className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h3
              id="delete-note-title"
              className="mt-4 text-base font-bold text-slate-900"
            >
              Hapus Catatan?
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Catatan yang dihapus tidak dapat dikembalikan.
              Apakah Anda yakin ingin melanjutkan?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="h-10 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="h-10 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
