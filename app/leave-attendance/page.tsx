"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  LogOut,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ClipboardList,
  CalendarCheck,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  UserCheck,
} from "lucide-react";

type LeaveRequest = {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

type AttendanceRecord = {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent";
};

const initialAttendance: AttendanceRecord[] = [
  {
    date: "24 Oct 2026",
    day: "Saturday",
    checkIn: "08:02",
    checkOut: "17:03",
    status: "Present",
  },
  {
    date: "23 Oct 2026",
    day: "Friday",
    checkIn: "08:15",
    checkOut: "17:05",
    status: "Late",
  },
  {
    date: "22 Oct 2026",
    day: "Thursday",
    checkIn: "07:55",
    checkOut: "17:00",
    status: "Present",
  },
  {
    date: "21 Oct 2026",
    day: "Wednesday",
    checkIn: "08:00",
    checkOut: "17:02",
    status: "Present",
  },
];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-700";

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function LeaveAttendancePage() {
  const [view, setView] = useState<"attendance" | "request" | "history">(
    "attendance"
  );

  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(initialAttendance);

  const [showCheckIn, setShowCheckIn] = useState(false);

  const pendingCount = leaveRequests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = leaveRequests.filter(
    (item) => item.status === "Approved"
  ).length;

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const leaveBalance = Math.max(
    0,
    12 -
      leaveRequests
        .filter((item) => item.status === "Approved" && item.type === "Annual Leave")
        .reduce((total, item) => total + item.days, 0)
  );

  function submitLeave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (endDate < startDate) {
      setMessage("End date cannot be before start date.");
      return;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    const days =
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

    if (leaveType === "Annual Leave" && days > leaveBalance) {
      setMessage(`Your remaining annual leave balance is ${leaveBalance} day(s).`);
      return;
    }

    setLeaveRequests((current) => [
      {
        id: Date.now(),
        type: leaveType,
        startDate,
        endDate,
        days,
        reason: reason.trim(),
        status: "Pending",
      },
      ...current,
    ]);

    setMessage("Leave request submitted successfully.");
    setStartDate("");
    setEndDate("");
    setReason("");
    setView("history");
  }

  function checkIn() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const today = now.toLocaleDateString("en-CA");
    const todayLabel = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const alreadyCheckedIn = attendance.some(
      (item) => item.date === todayLabel
    );

    if (alreadyCheckedIn) {
      setMessage("Attendance for today has already been recorded.");
      return;
    }

    setAttendance((current) => [
      {
        date: todayLabel,
        day: now.toLocaleDateString("en-US", { weekday: "long" }),
        checkIn: time,
        checkOut: "--:--",
        status: time > "08:00" ? "Late" : "Present",
      },
      ...current,
    ]);

    setShowCheckIn(true);
    setMessage("Check-in recorded in this prototype.");
  }

  function cancelLeave(id: number) {
    setLeaveRequests((current) =>
      current.filter((item) => item.id !== id)
    );
    setMessage("Leave request removed.");
  }

  const todayRecord = attendance.find(
    (item) =>
      item.date ===
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="text-slate-900 hover:text-slate-600"
            >
              <Bell size={21} />
            </button>

            <Link
              href="/"
              aria-label="Logout"
              className="text-slate-900 hover:text-slate-600"
            >
              <LogOut size={21} />
            </Link>
          </div>
        </header>

        <div className="px-5 pb-8 pt-2">
          {/* Title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
              Employee Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-tight tracking-tight text-slate-950">
              Leave & Attendance
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Manage your attendance and leave requests in one place.
            </p>
          </section>

          {/* Highlight */}
          <section className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 p-5 text-white">
            <div className="relative z-10 max-w-[260px]">

              <p className="text-xs font-medium text-sky-100">
                Employee Self-Service
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Your time matters.
              </h2>

              <p className="mt-0 text-[11px] leading-5 text-sky-100">
                Keep track of your work attendance and planned time off.
              </p>
            </div>

            <CalendarCheck
              size={110}
              strokeWidth={0.8}
              className="absolute -bottom-5 -right-4 rotate-[-12deg] text-white/10"
            />
          </section>

          {/* Leave balance */}
          <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Annual Leave Balance</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">
                  {leaveBalance}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    days left
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                <CalendarDays size={22} />
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-800 transition-all"
                style={{
                  width: `${Math.min(100, (leaveBalance / 12) * 100)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Example allowance: 12 annual leave days per year.
            </p>
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Present</p>
              <p className="mt-1 text-xl font-bold text-slate-950">
                {presentCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Pending</p>
              <p className="mt-1 text-xl font-bold text-slate-950">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Approved</p>
              <p className="mt-1 text-xl font-bold text-slate-950">
                {approvedCount}
              </p>
            </div>
          </section>

          {/* Navigation */}
          <section className="mb-4 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "attendance", label: "Attendance" },
                { id: "request", label: "New Leave" },
                { id: "history", label: "My Requests" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setView(
                      item.id as "attendance" | "request" | "history"
                    );
                    setMessage("");
                  }}
                  className={`flex h-9 min-w-0 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all duration-200 ${
                    view === item.id
                      ? "bg-white text-black shadow-sm"
                      : "text-black hover:bg-white/40"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {message && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800">
              {message}
            </div>
          )}

          {/* Attendance */}
          {view === "attendance" && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-950">
                      Today&apos;s Attendance
                    </h2>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Record your daily check-in
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] text-slate-500">Check-in</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {todayRecord?.checkIn ?? "--:--"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] text-slate-500">Check-out</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {todayRecord?.checkOut ?? "--:--"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkIn}
                  disabled={Boolean(todayRecord)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <UserCheck size={17} />
                  {todayRecord ? "Already Checked In" : "Check In"}
                </button>

                {showCheckIn && (
                  <p className="mt-2 text-center text-[10px] text-slate-500">
                    Check-in recorded locally for this prototype.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">
                      Attendance History
                    </h2>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Recent attendance records
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-800">
                    {attendance.length} records
                  </span>
                </div>

                <div className="space-y-3">
                  {attendance.map((item) => (
                    <article
                      key={item.date}
                      className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                          <CalendarDays size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900">
                            {item.date}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.day} · {item.checkIn} – {item.checkOut}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                          item.status === "Present"
                            ? "bg-slate-100 text-slate-800"
                            : item.status === "Late"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </article>
                  ))}
                </div>

                <p className="mt-4 text-[10px] leading-5 text-slate-500">
                  Sample records for UI testing. Connect to the attendance
                  service to use real employee data.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-800" />
                    <span className="text-xs font-semibold text-slate-700">
                      Present
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {presentCount}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-amber-600" />
                    <span className="text-xs font-semibold text-slate-700">
                      Late
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {lateCount}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* New Leave Request */}
          {view === "request" && (
            <section className="rounded-2xl border border-slate-100 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-950">
                    Leave Request
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Complete your leave application
                  </p>
                </div>
              </div>

              <form onSubmit={submitLeave} className="space-y-4 p-4">
                <div>
                  <label className={labelClass} htmlFor="leaveType">
                    Leave Type *
                  </label>

                  <select
                    id="leaveType"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Personal Leave</option>
                    <option>Emergency Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} htmlFor="startDate">
                      Start Date *
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      min={new Date().toLocaleDateString("en-CA")}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate && e.target.value > endDate) {
                          setEndDate("");
                        }
                      }}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="endDate">
                      End Date *
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || new Date().toLocaleDateString("en-CA")}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {startDate && endDate && endDate >= startDate && (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Total calendar days
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-950">
                      {Math.round(
                        (new Date(`${endDate}T00:00:00`).getTime() -
                          new Date(`${startDate}T00:00:00`).getTime()) /
                          86400000
                      ) + 1}{" "}
                      day(s)
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Weekends and public holidays are included in this
                      prototype calculation.
                    </p>
                  </div>
                )}

                <div>
                  <label className={labelClass} htmlFor="reason">
                    Reason for Leave *
                  </label>

                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain the reason for your leave..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    required
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-2">
                    <FileText
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-600"
                    />
                    <p className="text-[10px] leading-5 text-slate-600">
                      Your request will be marked as Pending in this prototype.
                      Approval and notifications are not connected to a server.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  <Plus size={17} />
                  Submit Leave Request
                </button>
              </form>
            </section>
          )}

          {/* My Requests */}
          {view === "history" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    My Leave Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Track your application status
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setView("request");
                    setMessage("");
                  }}
                  className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-[10px] font-bold text-white"
                >
                  <Plus size={14} />
                  New
                </button>
              </div>

              {leaveRequests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                  <ClipboardList
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    No leave requests yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Create your first leave application.
                  </p>

                  <button
                    type="button"
                    onClick={() => setView("request")}
                    className="mt-4 text-xs font-bold text-slate-900 underline"
                  >
                    Create Request
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaveRequests.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                            <CalendarDays size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-950">
                              {item.type}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.days} calendar day(s)
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                            item.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "Rejected"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-[10px] text-slate-500">
                            Start Date
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {formatDate(item.startDate)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-500">
                            End Date
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-800">
                            {formatDate(item.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-[10px] text-slate-500">Reason</p>
                        <p className="mt-1 break-words text-xs leading-5 text-slate-700">
                          {item.reason}
                        </p>
                      </div>

                      {item.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => cancelLeave(item.id)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <XCircle size={15} />
                          Remove Request
                        </button>
                      )}

                      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                        <span>Request details</span>
                        <ChevronRight size={13} />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}