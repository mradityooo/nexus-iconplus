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
        leaveAttendance: {
      section: "LAYANAN KARYAWAN",
      title: "Cuti & Kehadiran",
      description: "Kelola absensi dan pengajuan cuti Anda dalam satu tempat.",
      bannerLabel: "LAYANAN MANDIRI KARYAWAN",
bannerTitle: "Waktu Anda sangat berharga.",
bannerDescription: "Pantau kehadiran kerja dan rencanakan waktu cuti Anda.",
annualLeaveBalance: "Sisa Cuti Tahunan",
daysLeft: "hari tersisa",
leaveAllowanceInfo: "Contoh jatah cuti: 12 hari cuti tahunan per tahun.",
present: "Hadir",
pending: "Menunggu",
approved: "Disetujui",
attendanceTab: "Kehadiran",
newLeaveTab: "Ajukan Cuti",
myRequestsTab: "Pengajuan Saya",
todaysAttendance: "Kehadiran Hari Ini",
recordDailyCheckIn: "Catat kehadiran harian Anda",
checkInLabel: "Masuk",
checkOutLabel: "Pulang",
checkInButton: "Check In",
checkOutButton: "Check Out",
alreadyCheckedIn: "Sudah Check In",
alreadyCheckedOut: "Sudah Check Out",
attendanceHistory: "Riwayat Kehadiran",
recentAttendance: "Riwayat absensi terbaru",
records: "catatan",
late: "Terlambat",
absent: "Tidak Hadir",
weekdays: {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
},
checkInPrototype: "Check-in berhasil dicatat sementara dalam prototipe ini.",
attendancePrototypeInfo: "Data absensi masih digunakan untuk pengujian tampilan. Hubungkan dengan database untuk menggunakan data kehadiran karyawan yang sebenarnya.",
checkInSuccess: "Check-in berhasil dicatat dalam prototipe.",
checkOutSuccess: "Check-out berhasil dicatat.",
alreadyRecordedError: "Kehadiran hari ini sudah dicatat.",
checkInFirstError: "Silakan Check In terlebih dahulu.",
alreadyCheckedOutError: "Anda sudah melakukan Check Out.",
leaveRequestTitle: "Pengajuan Cuti",
leaveRequestSubtitle: "Lengkapi formulir pengajuan cuti Anda",
leaveTypeLabel: "Jenis Cuti *",
annualLeave: "Cuti Tahunan",
sickLeave: "Cuti Sakit",
personalLeave: "Cuti Pribadi",
emergencyLeave: "Cuti Darurat",
startDateLabel: "Tanggal Mulai *",
endDateLabel: "Tanggal Selesai *",
totalCalendarDays: "Total Hari Kalender",
dayUnit: "hari",
calendarDaysInfo: "Akhir pekan dan hari libur nasional ikut dihitung dalam prototipe ini.",
reasonLabel: "Alasan Cuti *",
reasonPlaceholder: "Jelaskan alasan pengajuan cuti Anda...",
leavePendingNotice: "Pengajuan Anda akan berstatus Menunggu pada prototipe ini. Persetujuan dan notifikasi belum terhubung ke server.",
submitLeaveButton: "Ajukan Cuti",
invalidReason: "Silakan masukkan alasan cuti yang valid.",
invalidDate: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
insufficientLeaveBalance: "Sisa cuti tahunan Anda hanya {days} hari.",
leaveSubmitSuccess: "Pengajuan cuti berhasil dikirim.",
myLeaveRequests: "Pengajuan Cuti Saya",
trackApplicationStatus: "Pantau status pengajuan cuti Anda",
newRequestButton: "Baru",
calendarDayUnit: "hari kalender",
rejected: "Ditolak",
historyStartDate: "Tanggal Mulai",
historyEndDate: "Tanggal Selesai",
historyReason: "Alasan",
removeRequest: "Hapus Pengajuan",
requestDetails: "Detail Pengajuan",
leaveRemovedSuccess: "Pengajuan cuti berhasil dihapus.",
confirmRemoveRequest: "Apakah Anda yakin ingin menghapus pengajuan cuti ini?",
noLeaveRequests: "Belum Ada Pengajuan Cuti",
noLeaveRequestsDescription: "Buat pengajuan cuti pertama Anda.",
createRequest: "Buat Pengajuan",
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
    leaveAttendance: {
      section: "EMPLOYEE SERVICES",
      title: "Leave & Attendance",
      description: "Manage your attendance and leave requests in one place.",
      bannerLabel: "Employee Self-Service",
bannerTitle: "Your time matters.",
bannerDescription: "Keep track of your work attendance and planned time off.",
annualLeaveBalance: "Annual Leave Balance",
daysLeft: "days left",
leaveAllowanceInfo: "Example allowance: 12 annual leave days per year.",
present: "Present",
pending: "Pending",
approved: "Approved",
attendanceTab: "Attendance",
newLeaveTab: "New Leave",
myRequestsTab: "My Requests",
todaysAttendance: "Today's Attendance",
recordDailyCheckIn: "Record your daily check-in",
checkInLabel: "Check-in",
checkOutLabel: "Check-out",
checkInButton: "Check In",
checkOutButton: "Check Out",
alreadyCheckedIn: "Already Checked In",
alreadyCheckedOut: "Already Checked Out",
attendanceHistory: "Attendance History",
recentAttendance: "Recent attendance records",
records: "records",
late: "Late",
absent: "Absent",
weekdays: {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
},
checkInPrototype: "Check-in recorded locally for this prototype.",
attendancePrototypeInfo: "Sample records for UI testing. Connect to the attendance service to use real employee data.",
checkInSuccess: "Check-in recorded in this prototype.",
checkOutSuccess: "Check-out recorded successfully.",
alreadyRecordedError: "Attendance for today has already been recorded.",
checkInFirstError: "Please check in first.",
alreadyCheckedOutError: "You have already checked out.",
leaveRequestTitle: "Leave Request",
leaveRequestSubtitle: "Complete your leave application",
leaveTypeLabel: "Leave Type *",
annualLeave: "Annual Leave",
sickLeave: "Sick Leave",
personalLeave: "Personal Leave",
emergencyLeave: "Emergency Leave",
startDateLabel: "Start Date *",
endDateLabel: "End Date *",
totalCalendarDays: "Total calendar days",
dayUnit: "day(s)",
calendarDaysInfo: "Weekends and public holidays are included in this prototype calculation.",
reasonLabel: "Reason for Leave *",
reasonPlaceholder: "Explain the reason for your leave...",
leavePendingNotice: "Your request will be marked as Pending in this prototype. Approval and notifications are not connected to a server.",
submitLeaveButton: "Submit Leave Request",
invalidReason: "Please enter a valid reason for leave.",
invalidDate: "End date cannot be before start date.",
insufficientLeaveBalance: "Your remaining annual leave balance is {days} day(s).",
leaveSubmitSuccess: "Leave request submitted successfully.",
myLeaveRequests: "My Leave Requests",
trackApplicationStatus: "Track your application status",
newRequestButton: "New",
calendarDayUnit: "calendar day(s)",
rejected: "Rejected",
historyStartDate: "Start Date",
historyEndDate: "End Date",
historyReason: "Reason",
removeRequest: "Remove Request",
requestDetails: "Request details",
leaveRemovedSuccess: "Leave request removed.",
confirmRemoveRequest: "Are you sure you want to remove this leave request?",
noLeaveRequests: "No leave requests yet",
noLeaveRequestsDescription: "Create your first leave application.",
createRequest: "Create Request",
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

const [language, setLanguageState] = useState<Language>("id");

useEffect(() => {
  try {
    const saved = window.localStorage.getItem("nexus-language");

    if (saved === "id" || saved === "en") {
      setLanguageState(saved);
    }
  } catch (error) {
    console.error("Failed to load language preference:", error);
  }
}, []);

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
