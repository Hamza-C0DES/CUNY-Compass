/*
  Warnings:

  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,campus,courseCode]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campus` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "userId",
ADD COLUMN     "campus" TEXT NOT NULL,
ADD COLUMN     "credits" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_user_id_campus_courseCode_key" ON "Course"("user_id", "campus", "courseCode");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
