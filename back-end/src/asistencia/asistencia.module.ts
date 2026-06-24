import { Module } from '@nestjs/common';
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaService } from './asistencia.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path to your PrismaService
import { AsistenciaGateway } from './asistencia.gateway';

@Module({
  imports: [],
  controllers: [AsistenciaController],
  providers: [AsistenciaService, AsistenciaGateway, PrismaService],
  exports: [AsistenciaService],
})
export class AsistenciaModule {}
