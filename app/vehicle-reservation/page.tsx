"use client";

import { useEffect, useState } from "react";
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
  id: string;
  vehicleCode: string;
  name: string;
  plateNumber: string;
  vehicleType: string | null;
  seatCapacity: number;
  status: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
};

type Driver = {
  id: string;
  fullName: string;
  phone: string | null;
  licenseNumber: string | null;
  status: "ACTIVE" | "INACTIVE";
};

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
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Data kendaraan dan driver dari database
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Status loading dan error
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [usageTime, setUsageTime] = useState("08:00");
  const [returnTime, setReturnTime] = useState("17:00");
  const [purpose, setPurpose] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const availableVehicles = vehicles.filter((vehicle) => {
    return vehicle.status === "AVAILABLE";
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

  async function handleReservation() {
    if (!selectedVehicleData) {
      setSubmitError("Silakan pilih kendaraan terlebih dahulu.");
      return;
    }

    if (!usageDate || !returnDate || !usageTime || !returnTime) {
      setSubmitError("Tanggal dan waktu reservasi wajib diisi.");
      return;
    }

    if (!destination.trim() || !purpose.trim()) {
      setSubmitError("Destination dan Purpose wajib diisi.");
      return;
    }

    if (driverType === "with" && !selectedDriver) {
      setSubmitError("Silakan pilih driver terlebih dahulu.");
      return;
    }

    // Menggunakan zona waktu Indonesia (UTC+7)
    const startAt = new Date(`${usageDate}T${usageTime}:00+07:00`);
    const endAt = new Date(`${returnDate}T${returnTime}:00+07:00`);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      setSubmitError("Tanggal atau waktu tidak valid.");
      return;
    }

    if (startAt <= new Date()) {
      setSubmitError("Waktu penggunaan harus berada di masa depan.");
      return;
    }

    if (endAt <= startAt) {
      setSubmitError("Waktu pengembalian harus setelah waktu penggunaan.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: selectedVehicleData.id,
          driverId: driverType === "with" ? selectedDriver : null,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          destination: destination.trim(),
          purpose: purpose.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengajukan reservasi kendaraan."
        );
      }

      setShowConfirmation(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengajukan reservasi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold text-slate-700";

  useEffect(() => {
    async function fetchReservationData() {
      try {
        setFetchError("");

        const [vehicleResponse, driverResponse] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/drivers"),
        ]);

        const vehicleResult = await vehicleResponse.json();
        const driverResult = await driverResponse.json();

        if (!vehicleResponse.ok) {
          throw new Error(
            vehicleResult.message || "Gagal mengambil data kendaraan."
          );
        }

        if (!driverResponse.ok) {
          throw new Error(
            driverResult.message || "Gagal mengambil data driver."
          );
        }

        setVehicles(vehicleResult.data ?? []);
        setDrivers(driverResult.data ?? []);
      } catch (error) {
        setFetchError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoadingVehicles(false);
        setLoadingDrivers(false);
      }
    }

    fetchReservationData();
  }, []);

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


{/* Date and Time */}
<div className="grid grid-cols-2 gap-x-3 gap-y-5">
  <div>
    <label className={labelClass} htmlFor="usageDate">
      Usage Date <span className="text-red-600">*</span>
    </label>
    <input
      id="usageDate"
      type="date"
      value={usageDate}
      min={getTodayLocal()}
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
      min={usageDate || getTodayLocal()}
      onChange={(e) => setReturnDate(e.target.value)}
      className={inputClass}
      required
    />
  </div>
</div>

{/* Destination and Driver */}
<div className="grid grid-cols-2 gap-x-3 gap-y-5">
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

          {drivers
            .filter((driver) => driver.status === "ACTIVE")
            .map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName}
              </option>
            ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  )}
</div>

{/* Purpose */}
<div>
  <label className={labelClass} htmlFor="purpose">
    Purpose <span className="text-red-600">*</span>
  </label>

  <textarea
    id="purpose"
    value={purpose}
    onChange={(e) => setPurpose(e.target.value)}
    placeholder="Enter the purpose of your trip"
    className="min-h-20 w-full resize-none rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
    maxLength={1000}
    required
  />
</div>

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

            {loadingVehicles && (
              <p className="py-6 text-center text-xs text-slate-500">
                Loading vehicle data...
              </p>
            )}

            {fetchError && (
              <p className="py-4 text-center text-xs text-red-600">
                {fetchError}
              </p>
            )}

            <div className="divide-y divide-slate-100">
              {displayedVehicles.map((vehicle) => {
                const isSelected = selectedVehicle === vehicle.id;

                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    disabled={vehicle.status !== "AVAILABLE"}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-1.5 py-3 text-left transition ${
                      isSelected
                        ? "bg-red-50 ring-1 ring-red-200"
                        : vehicle.status === "AVAILABLE"
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
                        {vehicle.plateNumber} · {vehicle.vehicleType ?? "Operational Vehicle"}
                      </p>
                      <p
                        className={`mt-1 text-[9px] font-semibold ${
                          vehicle.status === "AVAILABLE"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                      </p>
                    </div>

                    <div
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-red-600 text-white"
                          : vehicle.status === "AVAILABLE"
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
                    {selectedVehicleData.plateNumber} · {selectedVehicleData.vehicleType ?? "Operational Vehicle"}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    {destination} · {usageDate} to {returnDate}
                  </p>
                </div>
              </div>

            {submitError && (
              <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={handleReservation}
              disabled={submitting}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Confirm Reservation"}
              {!submitting && <Check size={15} />}
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
              Reservation Submitted
            </h2>

            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
             Reservasi kendaraan berhasil diajukan dan tersimpan.
             Pengajuan kamu sedang menunggu persetujuan.
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
                  {selectedVehicleData.plateNumber}
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