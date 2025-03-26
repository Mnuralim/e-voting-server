/*
  Warnings:

  - Added the required column `departement_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "departement_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Departement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departement_id_fkey" FOREIGN KEY ("departement_id") REFERENCES "Departement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
