/*
  Warnings:

  - You are about to drop the `employee_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ClaimCategory" AS ENUM ('CAR_WASH', 'MEALS', 'TOLL_FEE', 'FUEL', 'OTHERS');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "employee_requests" DROP CONSTRAINT "employee_requests_employeeId_fkey";

-- DropTable
DROP TABLE "employee_requests";

-- DropEnum
DROP TYPE "EmployeeRequestStatus";

-- DropEnum
DROP TYPE "RequestPriority";

-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "category" "ClaimCategory" NOT NULL,
    "transactionDate" DATE NOT NULL,
    "reference" TEXT,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "fuelType" TEXT,
    "liters" DECIMAL(10,2),
    "pricePerLiter" DECIMAL(15,2),
    "stationLocation" TEXT,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "approvedById" UUID,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "claims_employeeId_idx" ON "claims"("employeeId");

-- CreateIndex
CREATE INDEX "claims_approvedById_idx" ON "claims"("approvedById");

-- CreateIndex
CREATE INDEX "claims_status_idx" ON "claims"("status");

-- CreateIndex
CREATE INDEX "claims_category_idx" ON "claims"("category");

-- CreateIndex
CREATE INDEX "claims_transactionDate_idx" ON "claims"("transactionDate");

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
