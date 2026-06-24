import { Component, OnInit, inject } from '@angular/core';
import { AsistenciaService } from './services/asistencia.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h1 class="text-xl font-bold text-gray-900">Panel de Verificación de Flujo</h1>

      <div class="flex gap-4">
        <button
          (click)="simularMarcado()"
          class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Simular Marcación (HTTP POST)
        </button>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Canal WebSockets en Tiempo Real:</h2>
        @if (ultimoEvento) {
          <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2 animate-pulse"
            >
              Nuevo Evento Detectado
            </span>
            <pre
              class="bg-gray-900 text-emerald-400 p-3 rounded text-xs overflow-x-auto font-mono"
              >{{ ultimoEvento | json }}</pre
            >
          </div>
        } @else {
          <p
            class="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
          >
            Esperando emisiones desde el servidor NestJS... Coloca una huella o presiona el botón.
          </p>
        }
      </div>
    </div>
  `,
})
export class App implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  ultimoEvento: any = null;

  ngOnInit(): void {
    // Sintonización del flujo asíncrono emitido por el Gateway
    this.asistenciaService.escucharMarcaciones().subscribe({
      next: (evento) => {
        console.log('📥 Evento WebSocket interceptado en Angular:', evento);
        this.ultimoEvento = evento;
      },
      error: (err) => console.error('❌ Error en el flujo de WebSockets:', err),
    });
  }

  simularMarcado(): void {
    const mockPayload = {
      huellaToken: 'token_huella_juan',
      lectorId: 'LECTOR-CELDA-A101',
    };

    // Envío del registro simulando al agente de hardware (Python)
    this.asistenciaService.enviarMarcadoAsistencia(mockPayload).subscribe({
      next: (res) => console.log('🚀 Respuesta HTTP POST exitosa:', res),
      error: (err) => console.error('❌ Falló la petición HTTP POST:', err),
    });
  }
}
