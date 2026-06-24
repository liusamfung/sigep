import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';

@Controller('asistencias')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Post('marcar')
  @HttpCode(HttpStatus.CREATED)
  async marcarAsistencia(@Body() dto: RegistrarAsistenciaDto) {
    return await this.asistenciaService.registrarMarcacion(dto);
  }
}
