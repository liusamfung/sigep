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
  const pabellonesConfig = ['A', 'B'];

  // Banco de datos estático ("en duro") con nombres y apellidos reales
  const presosDePrueba = [
    // Pabellón A - Celda A-101
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
    // Pabellón A - Celda A-102
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
    // Pabellón A - Celda A-103
    {
      codigoUnico: 'PRISO005',
      nombre: 'Mateo',
      apellido: 'Torres',
      huellaToken: 'token_huella_mateo',
    },
    {
      codigoUnico: 'PRISO006',
      nombre: 'Alejandro',
      apellido: 'Ramírez',
      huellaToken: 'token_huella_alejandro',
    },
    // Pabellón A - Celda A-104
    {
      codigoUnico: 'PRISO007',
      nombre: 'Diego',
      apellido: 'Flores',
      huellaToken: 'token_huella_diego',
    },
    {
      codigoUnico: 'PRISO008',
      nombre: 'Gabriel',
      apellido: 'Gómez',
      huellaToken: 'token_huella_gabriel',
    },
    // Pabellón B - Celda B-101
    {
      codigoUnico: 'PRISO009',
      nombre: 'Santiago',
      apellido: 'Díaz',
      huellaToken: 'token_huella_santiago',
    },
    {
      codigoUnico: 'PRISO010',
      nombre: 'Sebastián',
      apellido: 'Vásquez',
      huellaToken: 'token_huella_sebastian',
    },
    // Pabellón B - Celda B-102
    {
      codigoUnico: 'PRISO011',
      nombre: 'Matías',
      apellido: 'Castro',
      huellaToken: 'token_huella_matias',
    },
    {
      codigoUnico: 'PRISO012',
      nombre: 'Nicolás',
      apellido: 'Romero',
      huellaToken: 'token_huella_nicolas',
    },
    // Pabellón B - Celda B-103
    {
      codigoUnico: 'PRISO013',
      nombre: 'Samuel',
      apellido: 'Suárez',
      huellaToken: 'token_huella_samuel',
    },
    {
      codigoUnico: 'PRISO014',
      nombre: 'Daniel',
      apellido: 'Ruiz',
      huellaToken: 'token_huella_daniel',
    },
    // Pabellón B - Celda B-104
    {
      codigoUnico: 'PRISO015',
      nombre: 'Lucas',
      apellido: 'Morales',
      huellaToken: 'token_huella_lucas',
    },
    {
      codigoUnico: 'PRISO016',
      nombre: 'Benjamín',
      apellido: 'Herrera',
      huellaToken: 'token_huella_benjamin',
    },
  ];

  let presoIndex = 0;

  console.log(
    '🌱 Insertando datos reales distribuidos de forma matricial (2 Pabellones, 4 Celdas c/u, 2 Presos por celda)...',
  );

  for (const letra of pabellonesConfig) {
    const nombrePabellon = `Pabellón ${letra}`;
    const pabellon = await prisma.pabellon.upsert({
      where: { nombre: nombrePabellon },
      update: {},
      create: { nombre: nombrePabellon },
    });

    for (let c = 1; c <= 4; c++) {
      const codigoCelda = `${letra}-10${c}`;
      const celda = await prisma.celda.upsert({
        where: { codigo: codigoCelda },
        update: {},
        create: {
          codigo: codigoCelda,
          pabellonId: pabellon.id,
        },
      });

      for (let p = 1; p <= 2; p++) {
        const datosPreso = presosDePrueba[presoIndex];

        // Salvaguarda en caso de que el índice exceda el tamaño del array
        if (!datosPreso) break;

        await prisma.preso.upsert({
          where: { codigoUnico: datosPreso.codigoUnico },
          update: {},
          create: {
            codigoUnico: datosPreso.codigoUnico,
            nombre: datosPreso.nombre,
            apellido: datosPreso.apellido,
            huellaToken: datosPreso.huellaToken,
            celdaId: celda.id,
            estado: EstadoPreso.ACTIVO,
          },
        });

        presoIndex++;
      }
    }
  }

  console.log(
    `✅ Proceso finalizado. Se mapearon con éxito ${presoIndex} prisioneros con datos reales.`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
