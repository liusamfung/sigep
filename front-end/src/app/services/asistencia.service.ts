import { Injectable, NgZone, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface MarcacionPayload {
  huellaToken: string;
  lectorId: string;
}

export interface AsistenciaResponse {
  status: string;
  movimiento: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private http = inject(HttpClient);
  private zone = inject(NgZone);
  private socket!: Socket;

  // URL base de comunicación con el servidor NestJS
  private readonly API_URL = 'http://localhost:3000';

  // Nodo central de distribución de eventos WebSocket hacia los componentes
  private nuevaMarcacion$ = new Subject<any>();

  constructor() {
    this.inicializarConexionWebSocket();
  }

  /**
   * Establece el canal bicanal de comunicación persistente con el Gateway del backend
   */
  private inicializarConexionWebSocket(): void {
    this.socket = io(this.API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Escucha directa del evento emitido por el backend configurado
    this.socket.on('asistencias-en-vivo', (data: any) => {
      this.zone.run(() => {
        this.nuevaMarcacion$.next(data);
      });
    });

    this.socket.on('connect', () => {
      console.log('⚡ Conexión establecida con el servidor de WebSockets de NestJS');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Conexión interrumpida con el servidor de WebSockets');
    });
  }

  /**
   * Dispara una petición HTTP POST para simular o ejecutar el marcado biométrico
   */
  public enviarMarcadoAsistencia(payload: MarcacionPayload): Observable<AsistenciaResponse> {
    return this.http.post<AsistenciaResponse>(`${this.API_URL}/asistencias/marcar`, payload);
  }

  /**
   * Expone el canal de eventos en tiempo real en formato Observable inmutable
   */
  public escucharMarcaciones(): Observable<any> {
    return this.nuevaMarcacion$.asObservable();
  }
}
