/*
  Warnings:

  - You are about to drop the column `passengerCount` on the `vehicle_reservations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "InspectionCondition" AS ENUM ('GOOD', 'NEEDS_ATTENTION', 'NOT_APPLICABLE');

-- AlterTable
ALTER TABLE "vehicle_reservations" DROP COLUMN "passengerCount";

-- CreateTable
CREATE TABLE "inspection_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" UUID NOT NULL,
    "reservationId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "status" "InspectionStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "inspectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_items" (
    "id" UUID NOT NULL,
    "inspectionId" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "condition" "InspectionCondition",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inspection_templates_isActive_sortOrder_idx" ON "inspection_templates"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "inspections_reservationId_key" ON "inspections"("reservationId");

-- CreateIndex
CREATE INDEX "inspections_employeeId_idx" ON "inspections"("employeeId");

-- CreateIndex
CREATE INDEX "inspections_vehicleId_idx" ON "inspections"("vehicleId");

-- CreateIndex
CREATE INDEX "inspections_status_idx" ON "inspections"("status");

-- CreateIndex
CREATE INDEX "inspection_items_templateId_idx" ON "inspection_items"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_items_inspectionId_templateId_key" ON "inspection_items"("inspectionId", "templateId");

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "vehicle_reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "inspection_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
