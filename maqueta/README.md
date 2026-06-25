# Maqueta SIGEP — Sistema de Gestión y Control Biométrico Penitenciario

Maqueta funcional (frontend, sin backend) del flujo completo del sistema SIGEP.
Sirve como evidencia visual de los entregables de cada Sprint.

## Cómo abrir

Abre `index.html` directamente en cualquier navegador (doble clic).
No requiere instalación, servidor ni dependencias.

Usuario de demo: ya viene precargado. Solo pulsa **Ingresar al sistema**.

## Pantallas por Sprint

| Sprint | Módulo | Pantallas |
|--------|--------|-----------|
| Sprint 1 | Gestión de Internos y Personal | Lista de internos · Registrar interno · Personal de seguridad y asignación |
| Sprint 2 | Control Biométrico | Registro de huella · Validación de huella |
| Sprint 3 | Asistencia y Alertas | Horarios de pase de lista · Pase de lista · Alertas |
| Sprint 4 | Monitoreo | Dashboard en tiempo real |

## Notas

- Es una maqueta: los datos son de ejemplo y las acciones (lectura de huella,
  registro de asistencia) están simuladas en el navegador.
- El stack real del proyecto es NestJS + Prisma (back-end), front-end y un
  microservicio en Python para el procesamiento de huellas.
