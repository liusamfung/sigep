-- CreateEnum
CREATE TYPE "EstadoPreso" AS ENUM ('CELDA', 'AUSENTE', 'FUGA');

-- CreateTable
CREATE TABLE "Celda" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "pabellon" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,

    CONSTRAINT "Celda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "biometricoId" INTEGER NOT NULL,
    "estado" "EstadoPreso" NOT NULL DEFAULT 'AUSENTE',
    "celdaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroAcceso" (
    "id" TEXT NOT NULL,
    "presoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroAcceso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Celda_numero_key" ON "Celda"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Preso_biometricoId_key" ON "Preso"("biometricoId");

-- AddForeignKey
ALTER TABLE "Preso" ADD CONSTRAINT "Preso_celdaId_fkey" FOREIGN KEY ("celdaId") REFERENCES "Celda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroAcceso" ADD CONSTRAINT "RegistroAcceso_presoId_fkey" FOREIGN KEY ("presoId") REFERENCES "Preso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
