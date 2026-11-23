
-- ==========================================
-- ENUM ATTENDANCE
-- ==========================================

CREATE TYPE "AttendanceStatus" AS ENUM (
  'PRESENT',
  'LATE',
  'ABSENT'
);

-- ==========================================
-- ENUM LEAVE REQUEST
-- ==========================================

CREATE TYPE "LeaveType" AS ENUM (
  'ANNUAL',
  'SICK',
  'PERSONAL',
  'EMERGENCY'
);

CREATE TYPE "LeaveStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

-- ==========================================
-- TABLE ATTENDANCES
-- ==========================================

CREATE TABLE "attendances" (
  "id" UUID NOT NULL,
  "employeeId" UUID NOT NULL,
  "attendanceDate" DATE NOT NULL,
  "checkInAt" TIMESTAMPTZ(3) NOT NULL,
  "checkOutAt" TIMESTAMPTZ(3),
  "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- ==========================================
-- TABLE LEAVE REQUESTS
-- ==========================================

CREATE TABLE "leave_requests" (
  "id" UUID NOT NULL,
  "employeeId" UUID NOT NULL,
  "type" "LeaveType" NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "days" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- ==========================================
-- INDEX ATTENDANCE
-- ==========================================

CREATE INDEX "attendances_attendanceDate_idx"
ON "attendances"("attendanceDate");

CREATE UNIQUE INDEX "attendances_employeeId_attendanceDate_key"
ON "attendances"("employeeId", "attendanceDate");

-- ==========================================
-- INDEX LEAVE REQUEST
-- ==========================================

CREATE INDEX "leave_requests_employeeId_idx"
ON "leave_requests"("employeeId");

CREATE INDEX "leave_requests_status_idx"
ON "leave_requests"("status");

-- ==========================================
-- FOREIGN KEY ATTENDANCE
-- ==========================================

ALTER TABLE "attendances"
ADD CONSTRAINT "attendances_employeeId_fkey"
FOREIGN KEY ("employeeId")
REFERENCES "employees"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- ==========================================
-- FOREIGN KEY LEAVE REQUEST
-- ==========================================

ALTER TABLE "leave_requests"
ADD CONSTRAINT "leave_requests_employeeId_fkey"
FOREIGN KEY ("employeeId")
REFERENCES "employees"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
