-- CreateEnum
CREATE TYPE "CareerApplicationStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "career_jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "deadline" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_applications" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" "CareerApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_jobs_isActive_deadline_idx" ON "career_jobs"("isActive", "deadline");

-- CreateIndex
CREATE INDEX "career_applications_jobId_idx" ON "career_applications"("jobId");

-- CreateIndex
CREATE INDEX "career_applications_status_idx" ON "career_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "career_applications_employeeId_jobId_key" ON "career_applications"("employeeId", "jobId");

-- AddForeignKey
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "career_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
