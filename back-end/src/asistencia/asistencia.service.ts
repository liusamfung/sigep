import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegurar que apunte a tu PrismaService modular
import { AsistenciaGateway } from './asistencia.gateway';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';
import { EstadoPreso } from '@prisma/client';

@Injectable()
export class AsistenciaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly asistenciaGateway: AsistenciaGateway,
  ) {}

  async registrarMarcacion(dto: RegistrarAsistenciaDto) {
    // 1. Validar existencia y estado del prisionero
    const preso = await this.prisma.preso.findUnique({
      where: { huellaToken: dto.huellaToken },
      include: {
        celda: {
          include: { pabellon: true },
        },
      },
    });

    if (!preso) {
      throw new NotFoundException(
        'Identidad biométrica no registrada en el sistema.',
      );
    }

    if (preso.estado !== EstadoPreso.ACTIVO) {
      throw new BadRequestException(
        'El prisionero no se encuentra en estado ACTIVO.',
      );
    }

    // 2. Definir rango de tiempo del día actual en UTC para el conteo (Horario de Perú -5)
    const ahora = new Date();
    const inicioDia = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      0,
      0,
      0,
    );
    const finDia = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      23,
      59,
      59,
    );

    // 3. Contar marcaciones previas hoy para determinar paridad (Entrada/Salida)
    const conteoAsistenciasHoy = await this.prisma.asistencia.count({
      where: {
        presoId: preso.id,
        fechaHora: {
          gte: inicioDia,
          lte: finDia,
        },
      },
    });

    // Si el conteo es par (0, 2, 4...), la nueva marcación significa que SALE de la celda.
    // Si es impar (1, 3, 5...), significa que REGRESA (Entra) a su celda.
    const esRegreso = conteoAsistenciasHoy % 2 !== 0;

    // 4. Persistir registro de bitácora inmutable
    const nuevaAsistencia = await this.prisma.asistencia.create({
      data: {
        presoId: preso.id,
        fechaHora: ahora,
        // Asumiendo que manejas el estado en el esquema, o se computa para la interfaz
      },
    });

    const payloadEvento = {
      asistenciaId: nuevaAsistencia.id,
      fechaHora: nuevaAsistencia.fechaHora,
      tipoMovimiento: esRegreso ? 'ENTRADA' : 'SALIDA',
      lectorId: dto.lectorId,
      preso: {
        id: preso.id,
        codigoUnico: preso.codigoUnico,
        nombre: preso.nombre,
        apellido: preso.apellido,
        celda: preso.celda.codigo,
        pabellon: preso.celda.pabellon.nombre,
        pabellonId: preso.celda.pabellonId,
      },
    };

    // 5. Despachar eventos a través de WebSockets para Angular
    // Emisión global para el lateral de "última marcación"
    this.asistenciaGateway.emitirNuevaMarcacion(payloadEvento);

    // Emisión estructural para actualizar los contadores por pabellón del dashboard
    this.asistenciaGateway.emitirCambioEstadoPabellon({
      pabellonId: preso.celda.pabellonId,
      presoId: preso.id,
      nuevoEstadoUbicacion: esRegreso ? 'DENTRO' : 'FUERA',
    });

    return {
      status: 'Procesado',
      movimiento: esRegreso ? 'ENTRADA_REGISTRADA' : 'SALIDA_REGISTRADA',
      timestamp: nuevaAsistencia.fechaHora,
    };
  }
}
