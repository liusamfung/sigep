import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, restringir al dominio específico de Angular
  },
})
export class AsistenciaGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('📡 WebSocket Gateway inicializado para el monitoreo en vivo.');
  }

  emitirNuevaMarcacion(payload: any) {
    this.server.emit('asistencias-en-vivo', payload);
  }

  emitirCambioEstadoPabellon(payload: any) {
    this.server.emit('actualizacion-pabellon', payload);
  }
}
