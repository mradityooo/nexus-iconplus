
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  level: string;
  deadline: string;
  description: string;
  skills: string[];
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Digital Solution",
    location: "Jakarta",
    level: "Experienced",
    deadline: "30 Nov 2026",
    description:
      "Mengembangkan aplikasi web internal, berkolaborasi dengan tim UI/UX, dan memastikan kualitas serta performa aplikasi.",
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    id: 2,
    title: "IT Business Analyst",
    department: "Information Technology",
    location: "Bandung",
    level: "Experienced",
    deadline: "5 Dec 2026",
    description:
      "Menganalisis kebutuhan bisnis dan menyusun kebutuhan sistem bersama stakeholder serta tim pengembangan.",
    skills: ["Business Analysis", "SQL", "Documentation"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Digital Experience",
    location: "Jakarta",
    level: "Intermediate",
    deadline: "10 Dec 2026",
    description:
      "Merancang pengalaman pengguna untuk produk digital perusahaan melalui riset, wireframe, dan prototyping.",
    skills: ["Figma", "Prototyping", "User Research"],
  },
  {
    id: 4,
    title: "Network Operations Engineer",
    department: "Network Operations",
    location: "Lampung",
    level: "Intermediate",
    deadline: "15 Dec 2026",
    description:
      "Memantau performa jaringan, membantu penanganan gangguan, dan mendukung pemeliharaan infrastruktur jaringan.",
    skills: ["Networking", "Monitoring", "Troubleshooting"],
  },
];

type Application = {
  job: Job;
  status: string;
  appliedAt: string;
};

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-slate-700";

export default function CareerPlanningPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"explore" | "applications">(
    "explore"
  );
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [location, setLocation] = useState("All Locations");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notice, setNotice] = useState("");

  const filteredJobs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.department,
        job.location,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!keyword ||
  (keyword.length <= 2
    ? searchableText
        .split(/[^a-z0-9]+/)
        .some((word) => word.startsWith(keyword))
    : searchableText.includes(keyword))) &&
        (department === "All Departments" ||
          job.department === department) &&
        (location === "All Locations" || job.location === location)
      );
    });
  }, [search, department, location]);

  function applyForJob(job: Job) {
    if (applications.some((item) => item.job.id === job.id)) {
      setNotice(t.career.duplicateApplication);
      setSelectedJob(null);
      return;
    }

    setApplications((previous) => [
      ...previous,
      {
        job,
        status: "Submitted",
        appliedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    ]);

    setSelectedJob(null);
    t.career.applicationSuccess.replace("{job}", job.title)
  }

  return (
    <main
      className="min-h-screen bg-white"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to Home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
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
          {/* Page title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
              {t.career.section}
            </p>

           <h2 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              {t.career.title}
            </h2>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-slate-">
              {t.career.subtitle}
            </p>
          </section>

          {/* Career banner */}
          <section className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#063B82] to-[#0095DA] p-4 text-white">
            <div className="relative z-10">
              <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] font-semibold">
                {t.career.bannerLabel}
              </span>

              <h2 className="mt-3 max-w-[260px] text-[20px] font-bold leading-tight">
                {t.career.bannerTitle}
              </h2>

              <p className="mt-2 max-w-[270px] text-[11px] leading-4 text-blue-50">
                {t.career.bannerDescription}
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("career-search")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-4 flex h-9 items-center justify-center gap-2 rounded-full bg-white px-3 text-xs font-bold text-blue-800 transition hover:bg-blue-50"
              >
                {t.career.bannerButton}
                <ArrowRight size={14} />
              </button>
            </div>

            <BriefcaseBusiness
              size={105}
              strokeWidth={1}
              className="absolute -bottom-3 -right-3 text-white/15"
            />
          </section>

          {/* Summary */}
          <section className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <BriefcaseBusiness size={15} />
                <span className="text-[10px]">{t.career.openPositions}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {jobs.length}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {t.career.availableOpportunities}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <ClipboardIcon />
                <span className="text-[10px]">{t.career.myApplications}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {applications.length}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {t.career.submittedApplications}
              </p>
            </div>
          </section>

          {/* Tabs */}
          <section className="mb-4 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("explore")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "explore"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <Search size={14} />
                {t.career.exploreCareers}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("applications")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "applications"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <BriefcaseBusiness size={14} />
                {t.career.myApplications}
                {applications.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-100 px-1 text-[9px] text-blue-700">
                    {applications.length}
                  </span>
                )}
              </button>
            </div>
          </section>

          {/* Notification */}
          {notice && (
            <div className="mb-4 flex items-start justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-800">
              <p>{notice}</p>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {activeTab === "explore" ? (
            <>
              {/* Search form */}
              <section
                id="career-search"
                className="mb-6 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    {t.career.searchTitle}
                  </h2>
                  <Search size={15} className="text-slate-600" />
                </div>

                <div className="mb-3 h-px bg-slate-400/80" />

                <form
                  onSubmit={(event) => event.preventDefault()}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="job-search" className={labelClass}>
                      {t.career.searchLabel}
                    </label>
                    <div className="relative">
                      <Search
                        size={13}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="job-search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t.career.searchPlaceholder}
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="department" className={labelClass}>
                        {t.career.department}
                      </label>
                      <div className="relative">
                        <select
                          id="department"
                          value={department}
                          onChange={(event) => setDepartment(event.target.value)}
                          className={`${inputClass} appearance-none pr-6`}
                        >
                          <option value="All Departments">
  {t.career.allDepartments}
</option>
                          <option>Digital Solution</option>
                          <option>Information Technology</option>
                          <option>Digital Experience</option>
                          <option>Network Operations</option>
                        </select>
                        <ChevronDown
                          size={13}
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className={labelClass}>
                        {t.career.location}
                      </label>
                      <div className="relative">
                        <select
                          id="location"
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          className={`${inputClass} appearance-none pr-6`}
                        >
                          <option value="All Locations">
  {t.career.allLocations}
</option>
                          <option>Jakarta</option>
                          <option>Bandung</option>
                          <option>Lampung</option>
                        </select>
                        <ChevronDown
                          size={13}
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setDepartment("All Departments");
                      setLocation("All Locations");
                    }}
                    className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <SlidersHorizontal size={13} />
                    {t.career.resetFilters}
                  </button>
                </form>
              </section>

              {/* Job list */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-[14px] font-bold text-slate-900">
                      {t.career.careerOpportunities}
                    </h2>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {filteredJobs.length} {t.career.positionsFound}
                    </p>
                  </div>
                  <BriefcaseBusiness size={17} className="text-slate-400" />
                </div>

                <div className="mb-1 h-px bg-slate-300" />

                <div className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => {
                    const applied = applications.some(
                      (application) => application.job.id === job.id
                    );

                    return (
                      <article
                        key={job.id}
                        className="py-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
                            <Building2 size={22} strokeWidth={1.6} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[11px] font-bold leading-4 text-slate-900">
                                {job.title}
                              </h3>
                              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                                {t.career.openStatus}
                              </span>
                            </div>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {job.department}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <BriefcaseBusiness size={11} />
                                {job.level === "Experienced"
  ? t.career.experiencedLevel
  : job.level === "Intermediate"
    ? t.career.intermediateLevel
    : job.level}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-600"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <p className="flex items-center gap-1 text-[9px] text-slate-500">
                                <CalendarDays size={11} />
{t.career.until} {job.deadline}
                              </p>

                              <button
                                type="button"
                                onClick={() => setSelectedJob(job)}
                                className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#0095DA] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
                              >
                                {applied ? t.career.viewDetails : t.career.viewAndApply}
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filteredJobs.length === 0 && (
                  <div className="py-10 text-center">
                    <Search
                      size={28}
                      className="mx-auto mb-2 text-slate-300"
                    />
                    <p className="text-xs font-semibold text-slate-700">
                      {t.career.noPositions}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {t.career.noPositionsDescription}
                    </p>
                  </div>
                )}
              </section>
            </>
          ) : (
            /* My Applications */
            <section>
              <div className="mb-3">
                <h2 className="text-[14px] font-bold text-slate-900">
                  {t.career.myApplications}
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {t.career.applicationsDescription}
                </p>
              </div>

              <div className="mb-1 h-px bg-slate-300" />

              {applications.length === 0 ? (
                <div className="py-10 text-center">
                  <BriefcaseBusiness
                    size={30}
                    className="mx-auto mb-2 text-slate-300"
                  />
                  <p className="text-xs font-semibold text-slate-700">
                    {t.career.noApplications}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {t.career.noApplicationsDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("explore")}
                    className="mt-4 flex h-9 mx-auto items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 text-xs font-bold text-white hover:bg-[#007AB8]"
                  >
                    {t.career.exploreCareers}
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.map((application) => (
                    <article
                      key={application.job.id}
                      className="flex items-start gap-3 py-3"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
                        <Building2 size={21} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[11px] font-bold text-slate-900">
                          {application.job.title}
                        </h3>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {application.job.department}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {t.career.appliedOn} {application.appliedAt}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-700">
                          <Clock3 size={11} />
{application.status === "Submitted"
  ? t.career.submittedStatus
  : application.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-0 backdrop-blur-sm sm:items-center sm:px-5"
          onClick={() => setSelectedJob(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-detail-title"
            className="max-h-[88vh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Building2 size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-blue-700">
                    {t.career.internalOpportunity}
                  </p>
                  <h2
                    id="job-detail-title"
                    className="mt-1 text-lg font-bold text-slate-900"
                  >
                    {selectedJob.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {selectedJob.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedJob(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <MapPin size={15} className="text-blue-700" />
                <p className="mt-2 text-[10px] text-slate-500">{t.career.location}</p>
                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {selectedJob.location}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <CalendarDays size={15} className="text-blue-700" />
                <p className="mt-2 text-[10px] text-slate-500">{t.career.deadline}</p>
                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {selectedJob.deadline}
                </p>
              </div>
            </div>

            <h3 className="mt-5 text-xs font-bold text-slate-900">
              {t.career.jobDescription}
            </h3>
            <p className="mt-2 text-[11px] leading-5 text-slate-600">
              {selectedJob.description}
            </p>

            <h3 className="mt-5 text-xs font-bold text-slate-900">
              {t.career.requiredSkills}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedJob.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">
              {t.career.prototypeNotice}
            </p>

            <button
              type="button"
              onClick={() => applyForJob(selectedJob)}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] text-xs font-bold text-white transition hover:bg-[#007AB8] active:scale-[0.99]"
            >
              {applications.some(
                (application) => application.job.id === selectedJob.id
              ) ? (
                <>
                  {t.career.alreadyApplied}
                  <Check size={14} />
                </>
              ) : (
                <>
                  {t.career.applyPosition}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

function ClipboardIcon() {
  return <BriefcaseBusiness size={15} />;
}
