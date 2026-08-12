-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('DIRECT', 'ELECTIVE', 'NO_CREDIT');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferCredit" (
    "id" TEXT NOT NULL,
    "fromCollegeId" TEXT NOT NULL,
    "fromCourseCode" TEXT NOT NULL,
    "fromCourseName" TEXT NOT NULL,
    "fromCredits" DOUBLE PRECISION NOT NULL,
    "toCollegeId" TEXT NOT NULL,
    "toCourseCode" TEXT,
    "toCourseName" TEXT,
    "toCredits" DOUBLE PRECISION NOT NULL,
    "transferType" "TransferType" NOT NULL DEFAULT 'DIRECT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_code_key" ON "College"("code");

-- CreateIndex
CREATE INDEX "TransferCredit_fromCollegeId_fromCourseCode_idx" ON "TransferCredit"("fromCollegeId", "fromCourseCode");

-- CreateIndex
CREATE INDEX "TransferCredit_toCollegeId_idx" ON "TransferCredit"("toCollegeId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferCredit_fromCollegeId_fromCourseCode_toCollegeId_key" ON "TransferCredit"("fromCollegeId", "fromCourseCode", "toCollegeId");

-- AddForeignKey
ALTER TABLE "TransferCredit" ADD CONSTRAINT "TransferCredit_fromCollegeId_fkey" FOREIGN KEY ("fromCollegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferCredit" ADD CONSTRAINT "TransferCredit_toCollegeId_fkey" FOREIGN KEY ("toCollegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
