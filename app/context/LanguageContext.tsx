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
        career: {
      section: "PENGEMBANGAN KARYAWAN",
      title: "Perencanaan Karier",
      subtitle: "Temukan peluang kerja internal dan kembangkan karier Anda.",
      bannerLabel: "PORTAL KARIER INTERNAL",
bannerTitle: "Peluang karier berikutnya dimulai di sini.",
bannerDescription: "Temukan posisi yang sesuai dengan keahlian Anda dan kembangkan karier bersama PLN Icon Plus.",
bannerButton: "Jelajahi Peluang Karier",
openPositions: "Lowongan Tersedia",
availableOpportunities: "Peluang karier yang tersedia",
myApplications: "Lamaran Saya",
submittedApplications: "Lamaran yang telah diajukan",
exploreCareers: "Jelajahi Karier",
searchTitle: "Temukan Posisi Berikutnya",
searchLabel: "Judul Pekerjaan atau Kata Kunci",
searchPlaceholder: "Cari posisi atau keahlian",
department: "Departemen",
location: "Lokasi",
resetFilters: "Atur Ulang Filter",
allDepartments: "Semua Departemen",
allLocations: "Semua Lokasi",
careerOpportunities: "Peluang Karier",
positionsFound: "lowongan ditemukan",
openStatus: "Dibuka",
viewAndApply: "Lihat & Lamar",
viewDetails: "Lihat Detail",
until: "Batas Pendaftaran:",
deadline: "Batas Pendaftaran",
jobDescription: "Deskripsi Pekerjaan",
requiredSkills: "Keahlian yang Dibutuhkan",
applyPosition: "Lamar Posisi Ini",
alreadyApplied: "Sudah Melamar",
applicationSuccess: "Lamaran untuk {job} berhasil diajukan.",
applicationsDescription: "Pantau status lamaran kerja internal Anda.",
appliedOn: "Diajukan:",
submittedStatus: "Telah Diajukan",
noApplications: "Belum Ada Lamaran",
noApplicationsDescription: "Lamaran kerja yang Anda ajukan akan ditampilkan di sini.",
noPositions: "Tidak Ada Lowongan Ditemukan",
noPositionsDescription: "Coba kata kunci lain atau sesuaikan filter pencarian.",
duplicateApplication: "Kamu sudah mengajukan lamaran untuk posisi ini.",
prototypeNotice: "Hanya prototipe. Konfirmasikan detail lowongan dan persyaratan kepada HR.",
experiencedLevel: "Berpengalaman",
intermediateLevel: "Menengah",
internalOpportunity: "PELUANG KARIER INTERNAL",
    },
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
    career: {
  section: "EMPLOYEE DEVELOPMENT",
  title: "Career Planning",
  subtitle: "Discover internal job opportunities and grow your career.",
  bannerLabel: "INTERNAL CAREER PORTAL",
bannerTitle: "Your next career opportunity starts here.",
bannerDescription: "Find a role that matches your skills and take the next step within PLN Icon Plus.",
bannerButton: "Explore Opportunities",
openPositions: "Open Positions",
availableOpportunities: "Available opportunities",
myApplications: "My Applications",
submittedApplications: "Submitted applications",
exploreCareers: "Explore Careers",
searchTitle: "Find Your Next Role",
searchLabel: "Job Title or Keyword",
searchPlaceholder: "Search position or skills",
department: "Department",
location: "Location",
resetFilters: "Reset Filters",
allDepartments: "All Departments",
allLocations: "All Locations",
careerOpportunities: "Career Opportunities",
positionsFound: "position(s) found",
openStatus: "Open",
viewAndApply: "View & Apply",
viewDetails: "View Details",
until: "Until",
deadline: "Deadline",
jobDescription: "Job Description",
requiredSkills: "Required Skills",
applyPosition: "Apply for This Position",
alreadyApplied: "Already Applied",
applicationSuccess: "Your application for {job} was submitted successfully.",
applicationsDescription: "Track your internal job applications.",
appliedOn: "Applied:",
submittedStatus: "Submitted",
noApplications: "No applications yet",
noApplicationsDescription: "Your submitted applications will appear here.",
noPositions: "No positions found",
noPositionsDescription: "Try another keyword or adjust your filters.",
duplicateApplication: "You have already applied for this position.",
prototypeNotice: "Prototype only. Confirm vacancy details and eligibility with HR.",
experiencedLevel: "Experienced",
intermediateLevel: "Intermediate",
internalOpportunity: "INTERNAL OPPORTUNITY",  
},
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
  if (typeof window === "undefined") return "id";

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
