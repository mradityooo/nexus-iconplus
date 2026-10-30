"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CarFront,
  Check,
  ChevronDown,
  ClipboardList,
  LogOut,
  MapPin,
  Search,
  UserRound,
  Users,
} from "lucide-react";

type Vehicle = {
  id: number;
  name: string;
  plate: string;
  color: string;
  available: boolean;
};

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Mitsubishi Xpander",
    plate: "BE 2521 ALG",
    color: "White",
    available: true,
  },
  {
    id: 2,
    name: "Toyota Avanza",
    plate: "BE 2210 AI",
    color: "White",
    available: false,
  },
  {
    id: 3,
    name: "Mitsubishi Xpander",
    plate: "BE 1345 AAD",
    color: "Black",
    available: false,
  },
  {
    id: 4,
    name: "Toyota Avanza",
    plate: "BE 2642 ABA",
    color: "White",
    available: true,
  },
];

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function VehicleReservationPage() {
  const [driverType, setDriverType] = useState<"with" | "without">("with");
  const [usageDate, setUsageDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);



  
  const availableVehicles = vehicles.filter((vehicle) => {
    return vehicle.available;
  });

  const displayedVehicles = searched
    ? availableVehicles
    : vehicles;

  const selectedVehicleData = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (returnDate < usageDate) {
      alert("Return Date tidak boleh sebelum Usage Date.");
      return;
    }

    setSearched(true);
    setSelectedVehicle(null);
  }

  function handleReservation() {
    if (!selectedVehicleData) return;
    setShowConfirmation(true);
  }

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold text-slate-700";

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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-1000 text-slate-1000 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/nexus.png"
              alt="NEXUS"
              className="h-10 w-auto object-contain"
            />
          </div>
            </div>
        </header>

        <div className="px-5 pb-8 pt-2">
          {/* Page title */}
          <section className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0px] text-red-600">
                Operational Services
            </p>

            <h1 className="mt-2 text-[27px] font-bold leading-[1.2] tracking-[-1px]">
                Vehicle Reservation
            </h1>

            <p className="mt-1.5 max-w-[310px] text-[12px] leading-[1] text-black">
               Reserve an operational vehicle
            </p>
         </section>

          {/* Driver toggle */}
          <section className="mb-3 rounded-full bg-[#DEDEDE] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setDriverType("with");
                  setSelectedDriver("");
                }}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  driverType === "with"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <Users size={14} />
                With Driver
              </button>

              <button
                type="button"
                onClick={() => {
                  setDriverType("without");
                  setSelectedDriver("");
                }}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  driverType === "without"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <UserRound size={14} />
                Without Driver
              </button>
            </div>
          </section>

          {/* Search form */}
          <section className="mb-7 rounded-xl border border-slate-200/80 bg-[#DCDCDC] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900">
                Find Available Vehicle
              </h2>
              <Search size={15} className="text-slate-600" />
            </div>

            <div className="mb-3 h-px bg-slate-400/80" />

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="usageDate">
                    Usage Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="usageDate"
                    type="date"
                    value={usageDate}
                    min={undefined}
                    onFocus={(e) => {
                    e.currentTarget.min = getTodayLocal();
                    }}
                    onChange={(e) => setUsageDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="returnDate">
                    Return Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    min={usageDate || undefined}
                    onFocus={(e) => {
                    e.currentTarget.min = usageDate || getTodayLocal();
                    }}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

                <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass} htmlFor="destination">
                    Destination <span className="text-red-600">*</span>
                    </label>

                    <div className="relative">
                    <MapPin
                        size={13}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        id="destination"
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter location"
                        className={`${inputClass} pl-7`}
                        required
                    />
                    </div>
                </div>

                {driverType === "with" && (
                    <div>
                    <label className={labelClass} htmlFor="driver">
                        Select Driver <span className="text-red-600">*</span>
                    </label>

                    <div className="relative">
                        <select
                        id="driver"
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        required
                        className={`${inputClass} appearance-none pr-7`}
                        >
                        <option value="">Choose driver</option>
                        <option value="driver-1">Driver 01</option>
                        <option value="driver-2">Driver 02</option>
                        <option value="driver-3">Driver 03</option>
                        </select>

                        <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                    </div>
                )}
                </div>

              <button
                type="submit"
                className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
              >
                <Search size={14} />
                Find Available Vehicle
              </button>
            </form>
          </section>

          {/* Vehicle list */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-bold text-slate-900">
                  Vehicle List
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {searched
                    ? `${displayedVehicles.length} available vehicle(s)`
                    : "Select a vehicle for your trip"}
                </p>
              </div>

              {searched && (
                <button
                  type="button"
                  onClick={() => {
                    setSearched(false);
                    setSelectedVehicle(null);
                  }}
                  className="text-[10px] font-semibold text-red-600 hover:text-red-700"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mb-1 h-px bg-slate-300" />

            <div className="divide-y divide-slate-100">
              {displayedVehicles.map((vehicle) => {
                const isSelected = selectedVehicle === vehicle.id;

                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    disabled={!vehicle.available}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-1.5 py-3 text-left transition ${
                      isSelected
                        ? "bg-red-50 ring-1 ring-red-200"
                        : vehicle.available
                          ? "hover:bg-slate-50"
                          : "cursor-not-allowed opacity-70"
                    }`}
                  >
                    {/* Vehicle placeholder illustration */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                        isSelected
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      <CarFront size={25} strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-900">
                        {vehicle.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {vehicle.plate} · {vehicle.color}
                      </p>
                      <p
                        className={`mt-1 text-[9px] font-semibold ${
                          vehicle.available
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {vehicle.available ? "Available" : "Unavailable"}
                      </p>
                    </div>

                    <div
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-red-600 text-white"
                          : vehicle.available
                            ? "border-2 border-emerald-500 bg-white"
                            : "bg-red-500"
                      }`}
                    >
                      {isSelected && <Check size={11} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {displayedVehicles.length === 0 && (
              <div className="py-10 text-center">
                <CarFront
                  size={30}
                  className="mx-auto mb-2 text-slate-300"
                />
                <p className="text-xs font-semibold text-slate-700">
                  No vehicles available
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Try a different date or return period.
                </p>
              </div>
            )}
          </section>

          {/* Selected vehicle summary */}
          {selectedVehicleData && (
            <section className="mt-5 rounded-xl border border-red-100 bg-red-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                  <CarFront size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-red-600">
                    Selected Vehicle
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedVehicleData.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {selectedVehicleData.plate} · {selectedVehicleData.color}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    {destination} · {usageDate} to {returnDate}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReservation}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-xs font-bold text-white transition hover:bg-red-700 active:scale-[0.99]"
              >
                Confirm Reservation
                <Check size={15} />
              </button>
            </section>
          )}

          <footer className="mt-8 border-t border-slate-100 pt-4 text-center">
            <p className="text-[9px] text-slate-400">
              NEXUS · Employees Operations Portal
            </p>
          </footer>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirmation && selectedVehicleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-confirmation-title"
            className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ClipboardList size={24} />
            </div>

            <h2
              id="reservation-confirmation-title"
              className="mt-4 text-center text-lg font-bold text-slate-900"
            >
              Reservation Prepared
            </h2>

            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
              Kendaraan berhasil dipilih pada prototype. Data ini belum
              disimpan ke database atau dikirim untuk persetujuan.
            </p>

            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3.5 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Vehicle</span>
                <span className="text-right font-semibold text-slate-800">
                  {selectedVehicleData.name}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">License Plate</span>
                <span className="font-semibold text-slate-800">
                  {selectedVehicleData.plate}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Destination</span>
                <span className="max-w-[60%] text-right font-semibold text-slate-800">
                  {destination}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Usage Date</span>
                <span className="font-semibold text-slate-800">
                  {usageDate}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Return Date</span>
                <span className="font-semibold text-slate-800">
                  {returnDate}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Driver</span>
                <span className="font-semibold text-slate-800">
                  {driverType === "with"
                    ? selectedDriver.replace("driver-", "Driver ")
                    : "Without Driver"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="mt-4 w-full rounded-xl bg-red-600 py-3 text-xs font-bold text-white transition hover:bg-red-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

