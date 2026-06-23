/*
  Warnings:

  - The values [CELDA,AUSENTE,FUGA] on the enum `EstadoPreso` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Celda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capacidad` on the `Celda` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Celda` table. All the data in the column will be lost.
  - You are about to drop the column `pabellon` on the `Celda` table. All the data in the column will be lost.
  - You are about to drop the column `biometricoId` on the `Preso` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Preso` table. All the data in the column will be lost.
  - You are about to drop the `RegistroAcceso` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `Celda` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigoUnico]` on the table `Preso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[huellaToken]` on the table `Preso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Celda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pabellonId` to the `Celda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoUnico` to the `Preso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PRESENTE', 'AUSENTE', 'FUGA');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoPreso_new" AS ENUM ('ACTIVO', 'INACTIVO');
ALTER TABLE "public"."Preso" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Preso" ALTER COLUMN "estado" TYPE "EstadoPreso_new" USING ("estado"::text::"EstadoPreso_new");
ALTER TYPE "EstadoPreso" RENAME TO "EstadoPreso_old";
ALTER TYPE "EstadoPreso_new" RENAME TO "EstadoPreso";
DROP TYPE "public"."EstadoPreso_old";
ALTER TABLE "Preso" ALTER COLUMN "estado" SET DEFAULT 'ACTIVO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Preso" DROP CONSTRAINT "Preso_celdaId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroAcceso" DROP CONSTRAINT "RegistroAcceso_presoId_fkey";

-- DropIndex
DROP INDEX "Celda_numero_key";

-- DropIndex
DROP INDEX "Preso_biometricoId_key";

-- AlterTable
ALTER TABLE "Celda" DROP CONSTRAINT "Celda_pkey",
DROP COLUMN "capacidad",
DROP COLUMN "numero",
DROP COLUMN "pabellon",
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "pabellonId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Celda_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Celda_id_seq";

-- AlterTable
ALTER TABLE "Preso" DROP COLUMN "biometricoId",
DROP COLUMN "updatedAt",
ADD COLUMN     "codigoUnico" TEXT NOT NULL,
ADD COLUMN     "huellaToken" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'ACTIVO',
ALTER COLUMN "celdaId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RegistroAcceso";

-- CreateTable
CREATE TABLE "Pabellon" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "presoId" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoAsistencia" NOT NULL DEFAULT 'PRESENTE',

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pabellon_nombre_key" ON "Pabellon"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Celda_codigo_key" ON "Celda"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Preso_codigoUnico_key" ON "Preso"("codigoUnico");

-- CreateIndex
CREATE UNIQUE INDEX "Preso_huellaToken_key" ON "Preso"("huellaToken");

-- AddForeignKey
ALTER TABLE "Celda" ADD CONSTRAINT "Celda_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preso" ADD CONSTRAINT "Preso_celdaId_fkey" FOREIGN KEY ("celdaId") REFERENCES "Celda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_presoId_fkey" FOREIGN KEY ("presoId") REFERENCES "Preso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
