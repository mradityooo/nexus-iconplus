-- CreateEnum
CREATE TYPE "WfaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "wfa_requests" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "workLocation" TEXT NOT NULL,
    "locationDetails" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "status" "WfaStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wfa_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wfa_requests_employeeId_idx" ON "wfa_requests"("employeeId");

-- CreateIndex
CREATE INDEX "wfa_requests_status_idx" ON "wfa_requests"("status");

-- AddForeignKey
ALTER TABLE "wfa_requests" ADD CONSTRAINT "wfa_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
