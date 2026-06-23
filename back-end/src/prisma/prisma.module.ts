import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // El decorador Global hace que el servicio esté disponible en todo el backend sin re-importar el módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
