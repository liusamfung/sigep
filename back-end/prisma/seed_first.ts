// back-end/prisma/seed.ts
import { PrismaClient, EstadoPreso } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

// Inicialización del Driver Adapter requerido por Prisma
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Garantizar la existencia del Pabellón Padre usando upsert
  const pabellon = await prisma.pabellon.upsert({
    where: { nombre: 'Pabellón A' },
    update: {},
    create: { nombre: 'Pabellón A' },
  });

  // 2. Garantizar la existencia de la Celda vinculada usando upsert
  const celda = await prisma.celda.upsert({
    where: { codigo: 'A-101' },
    update: {},
    create: {
      codigo: 'A-101',
      pabellonId: pabellon.id,
    },
  });

  // 3. Declaración de los 5 prisioneros de prueba
  const presosDePrueba = [
    {
      codigoUnico: 'PRISO001',
      nombre: 'Juan',
      apellido: 'Pérez',
      huellaToken: 'token_huella_juan',
    },
    {
      codigoUnico: 'PRISO002',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      huellaToken: 'token_huella_carlos',
    },
    {
      codigoUnico: 'PRISO003',
      nombre: 'Luis',
      apellido: 'García',
      huellaToken: 'token_huella_luis',
    },
    {
      codigoUnico: 'PRISO004',
      nombre: 'Andrés',
      apellido: 'López',
      huellaToken: 'token_huella_andres',
    },
    {
      codigoUnico: 'PRISO005',
      nombre: 'Mateo',
      apellido: 'Torres',
      huellaToken: 'token_huella_mateo',
    },
  ];

  console.log(
    '🌱 Insertando lote de prisioneros de prueba con Driver Adapter...',
  );

  // 4. Inserción iterativa segura contra duplicados
  for (const preso of presosDePrueba) {
    await prisma.preso.upsert({
      where: { codigoUnico: preso.codigoUnico },
      update: {},
      create: {
        codigoUnico: preso.codigoUnico,
        nombre: preso.nombre,
        apellido: preso.apellido,
        huellaToken: preso.huellaToken,
        celdaId: celda.id,
        estado: EstadoPreso.ACTIVO,
      },
    });
  }

  console.log(
    '✅ Operación completada: 5 prisioneros procesados exitosamente.',
  );
}

main()
  .catch((e) => {
    console.error('❌ Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Cerrar el pool de conexiones de pg de forma limpia
  });
