-- CreateEnum
CREATE TYPE "BusinessTravelStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BusinessTravelFacilityType" AS ENUM ('FLIGHT_TICKET', 'HOTEL', 'OTHER_TRANSPORTATION');

-- CreateTable
CREATE TABLE "business_travel_requests" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "approvedById" UUID,
    "destination" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "transportation" TEXT,
    "notes" TEXT,
    "status" "BusinessTravelStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_travel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_travel_facilities" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "type" "BusinessTravelFacilityType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_travel_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_travel_requests_employeeId_idx" ON "business_travel_requests"("employeeId");

-- CreateIndex
CREATE INDEX "business_travel_requests_approvedById_idx" ON "business_travel_requests"("approvedById");

-- CreateIndex
CREATE INDEX "business_travel_requests_status_idx" ON "business_travel_requests"("status");

-- CreateIndex
CREATE INDEX "business_travel_requests_departureDate_returnDate_idx" ON "business_travel_requests"("departureDate", "returnDate");

-- CreateIndex
CREATE INDEX "business_travel_facilities_type_idx" ON "business_travel_facilities"("type");

-- CreateIndex
CREATE UNIQUE INDEX "business_travel_facilities_requestId_type_key" ON "business_travel_facilities"("requestId", "type");

-- AddForeignKey
ALTER TABLE "business_travel_requests" ADD CONSTRAINT "business_travel_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_travel_requests" ADD CONSTRAINT "business_travel_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_travel_facilities" ADD CONSTRAINT "business_travel_facilities_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_travel_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
