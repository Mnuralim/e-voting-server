-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_departement_id_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "departement_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departement_id_fkey" FOREIGN KEY ("departement_id") REFERENCES "Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
