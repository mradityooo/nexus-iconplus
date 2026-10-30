"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "id" | "en";

const translations = {
  id: {
    employeePortal: "Portal Pegawai",
    greeting: "Selamat pagi",
    homeDescription: "Kelola kebutuhan operasional dan perjalanan dinas Anda.",
    workspace: "Ruang Kerja Saya",
    news: "Berita",
    newsPlaceholder: "Judul berita akan ditampilkan di sini",
    services: [
      "Reservasi Kendaraan",
      "Pemeriksaan Kendaraan",
      "Perjalanan Dinas",
      "Klaim",
      "Perencanaan Karier",
      "Cuti & Kehadiran",
      "Permintaan",
      "Kerja dari Mana Saja",
    ],
    workspaceItems: [
      "Permintaan Saya",
      "Jadwal Saya",
      "Riwayat Kendaraan",
      "Bantuan & Panduan",
      "Tambah Catatan",
    ],
  },
  en: {
    employeePortal: "Employee Portal",
    greeting: "Good morning",
    homeDescription:
      "Manage your operational requirements and business travel.",
    workspace: "My Workspace",
    news: "News",
    newsPlaceholder: "News headlines will appear here",
    services: [
      "Vehicle Reservation",
      "Pre-Use Inspection",
      "Travel",
      "Claims",
      "Career Planning",
      "Leave & Attendance",
      "Request",
      "Work From Anywhere",
    ],
    workspaceItems: [
      "My Request",
      "My Schedule",
      "Vehicle History",
      "Help & Guide",
      "Add Note",
    ],
  },
} as const;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)[Language];
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {


const [language, setLanguageState] = useState<Language>(() => {
  if (typeof window === "undefined") {
    return "id";
  }

  try {
    const saved = window.localStorage.getItem("nexus-language");

    return saved === "id" || saved === "en" ? saved : "id";
  } catch {
    return "id";
  }
});

useEffect(() => {
  document.documentElement.lang = language;
}, [language]);

function setLanguage(nextLanguage: Language) {
  setLanguageState(nextLanguage);

  try {
    window.localStorage.setItem("nexus-language", nextLanguage);
  } catch (error) {
    console.error("Failed to save language preference:", error);
  }
}

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
