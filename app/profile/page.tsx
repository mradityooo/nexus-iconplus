
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  LogOut,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { signOut } from "next-auth/react";
import Link from "next/link";

type ProfileData = {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  joinDate: string;
};

const emptyProfile: ProfileData = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  location: "",
  joinDate: "",
};


const p = {
  title: "Profil Saya",
  subtitle: "Informasi pribadi dan pengaturan akun",
  active: "Karyawan Aktif",
  personalInfo: "Informasi Pribadi",
  employeeId: "ID Karyawan",
  fullName: "Nama Lengkap",
  email: "Email Perusahaan",
  phone: "Nomor Telepon",
  department: "Departemen",
  position: "Jabatan",
  location: "Lokasi Kerja",
  joinDate: "Tanggal Bergabung",
  edit: "Edit Profil",
  save: "Simpan Perubahan",
  cancel: "Batal",
  changePhoto: "Ganti Foto",
  changePassword: "Ubah Kata Sandi",
  passwordSubtitle: "Perbarui kata sandi akun Anda",
  currentPassword: "Kata Sandi Saat Ini",
  newPassword: "Kata Sandi Baru",
  confirmPassword: "Konfirmasi Kata Sandi",
  savePassword: "Perbarui Kata Sandi",
  success: "Profil berhasil diperbarui",
  passwordSuccess: "Kata sandi berhasil diperbarui",
  passwordMismatch: "Konfirmasi kata sandi tidak cocok",
  passwordRequired: "Semua kolom kata sandi wajib diisi",
  passwordDemo: "Fitur kata sandi masih berupa prototype",
  uploadHint: "PNG atau JPG, maksimal 5 MB",
  account: "Pengaturan Akun",
  photoError: "Ukuran foto maksimal 5 MB",
};

export default function ProfilePage() {
  const [language] = useState<"id">("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [draft, setDraft] = useState<ProfileData>(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
  async function loadProfile() {
    try {
      setProfileLoading(true);

      const response = await fetch("/api/profile");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil profil.");
      }

      setProfile(data);
      setDraft(data);
    } catch (error) {
      console.error("Load profile error:", error);

      setNotice(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data profil."
      );
    } finally {
      setProfileLoading(false);
    }
  }

  loadProfile();
}, []);

  const labels = {
    name: p.fullName,
    employeeId: p.employeeId,
    email: p.email,
    phone: p.phone,
    department: p.department,
    position: p.position,
    location: p.location,
    joinDate: p.joinDate,
  };

  function startEditing() {
    setDraft({ ...profile });
    setEditing(true);
    setNotice("");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setNotice("");

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          phone: draft.phone,
          department: draft.department,
          position: draft.position,
          location: draft.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui profil.");
      }

      setProfile(data.profile);
      setDraft(data.profile);
      setEditing(false);
      setNotice(data.message || p.success);
    } catch (error) {
      console.error("Save profile error:", error);

      setNotice(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan profil."
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("Gunakan gambar JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice(p.photoError);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setNotice("");
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !passwords.current ||
      !passwords.next ||
      !passwords.confirm
    ) {
      setNotice(p.passwordRequired);
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setNotice(p.passwordMismatch);
      return;
    }

    // Prototype only: no password is sent to a server.
    setPasswords({ current: "", next: "", confirm: "" });
    setPasswordOpen(false);
    setNotice(p.passwordDemo);
  }

  const fields: {
    key: keyof ProfileData;
    icon: typeof UserRound;
  }[] = [
    { key: "name", icon: UserRound },
    { key: "employeeId", icon: FileText },
    { key: "email", icon: Mail },
    { key: "phone", icon: Phone },
    { key: "department", icon: FileText },
    { key: "position", icon: ShieldCheck },
    { key: "location", icon: MapPin },
    { key: "joinDate", icon: Clock3 },
  ];

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
        {/* Konten profil dimulai di sini */}

      {profileLoading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Memuat informasi profil...
        </div>
      )}

        {/* Profile banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#063B76] via-[#087BB7] to-[#00A5D1] p-5 text-white shadow-lg shadow-sky-900/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -right-3 -top-10 -z-10 h-48 w-48 rounded-full border border-white/15" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/15">
                {photo ? (
                  <Image
                    src={photo}
                    alt={profile.name}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound size={42} strokeWidth={1.5} />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label={p.changePhoto}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#087BB7] bg-white text-sky-800 shadow-sm transition hover:bg-sky-50"
              >
                <Camera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label={p.changePhoto}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/30 bg-emerald-300/15 px-2.5 py-1 text-xs font-medium text-emerald-50">
                  <Check size={13} />
                  {p.active}
                </span>
              </div>

              <h2 className="break-words text-xl font-bold sm:text-2xl">
                {profile.name}
              </h2>

              <p className="mt-1 break-all text-sm text-sky-100">
                {profile.email}
              </p>

              <p className="mt-2 text-sm text-white/80">
                {profile.position} · {profile.department}
              </p>

              <p className="mt-2 text-xs text-white/65">
                {p.employeeId}: {profile.employeeId}
              </p>

              <p className="mt-2 text-xs text-white/75">
                {p.uploadHint}
              </p>
            </div>

            <button
              type="button"
              onClick={startEditing}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Edit3 size={16} />
              {p.edit}
            </button>
          </div>
        </section>

        {/* Notice */}
        {notice && (
          <div
            role="status"
            className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label={language === "id" ? "Tutup pesan" : "Dismiss message"}
            >
              <X size={17} />
            </button>
          </div>
        )}


        {/* Personal information */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">
                {p.personalInfo}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {p.subtitle}
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                <Edit3 size={14} />
                {p.edit}
              </button>
            )}
          </div>

          <form onSubmit={saveProfile}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {fields.map(({ key, icon: Icon }) => (
                <div key={key} className="min-w-0">
                  <label
                    htmlFor={`profile-${key}`}
                    className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    <Icon size={13} className="text-sky-700" />
                    {labels[key]}
                  </label>

                  <input
                    id={`profile-${key}`}
                    type={key === "email" ? "email" : "text"}
                    value={editing ? draft[key] : profile[key]}
                    readOnly={!editing || key === "employeeId" || key === "email"}
                    required={
                      editing &&
                      key !== "employeeId" &&
                      key !== "joinDate"
                    }
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                    className={`w-full min-w-0 rounded-lg border px-3 py-2.5 text-xs outline-none transition ${
                      editing && key !== "employeeId"
                        ? "border-sky-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                        : "border-slate-100 bg-slate-50 text-slate-600"
                    }`}
                  />
                </div>
              ))}
            </div>

            {editing && (
              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {p.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving || profileLoading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#087BB7] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#06699E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={14} />
                  {saving ? "Menyimpan..." : p.save}
                </button>
              </div>
            )}
          </form>
        </section>
  
        {/* Account settings */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {p.account}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {p.passwordSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordOpen((previous) => !previous);
              setNotice("");
            }}
            aria-expanded={passwordOpen}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <KeyRound size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-800">
                {p.changePassword}
              </span>
              <span className="mt-1 block text-[11px] text-slate-500">
                {p.passwordSubtitle}
              </span>
            </span>

            <ChevronRight
              size={17}
              className={`shrink-0 text-slate-400 transition-transform ${
                passwordOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {passwordOpen && (
            <form
              onSubmit={savePassword}
              className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3"
            >
              {(
                [
                  ["current", p.currentPassword],
                  ["next", p.newPassword],
                  ["confirm", p.confirmPassword],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label
                    htmlFor={`password-${key}`}
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    {label}
                  </label>

                  <input
                    id={`password-${key}`}
                    type="password"
                    autoComplete="new-password"
                    value={passwords[key]}
                    onChange={(event) =>
                      setPasswords((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              ))}

              <p className="text-[11px] text-amber-700">
                {p.passwordDemo}
              </p>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPasswordOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  {p.cancel}
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#087BB7] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#06699E]"
                >
                  {p.savePassword}
                </button>
              </div>
            </form>
          )}        
          <div className="mt-5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={async () => {
                const confirmed = window.confirm(
                  "Apakah kamu yakin ingin keluar dari akun NEXUS?"
                );

                if (!confirmed) return;

                await signOut({
                  redirectTo: "/login",
                });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.99]"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>

        <footer className="py-7 text-center text-xs text-slate-400">
          NEXUS · Employees Operations Portal · PLN Icon Plus
        </footer>
      </div>
      </div>
    </main>
  );
}