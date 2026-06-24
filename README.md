# Flujo de trabajo: Feature Branch with PRs

- Si no estas seguro a que se refiere, indaga sobre ello. (Básicamente la rama main esta protegida para que nadie pueda sobreescribirla directamente. La unica forma de hacer cambios es haciendo merge desde otra rama.
- Síntesis: Protege la rama principal (Versio estable) mediante PullRequest

---

## Dependencias y Versiones Usadas

Compatibilidad del entorno de desarrollo

```yaml
npm: 24.14.0. (LTS)
python@3.12


database: PostgreSQL
  nombre_bd: (Revisar el docker-compose.yaml)
  usuario: (Revisar el docker-compose.yaml)
  contrasena: (Revisar el docker-compose.yaml)

```

# Instalación de dependencias (Solo la primera vez)

    Los saltos de línea de Git (CRLF vs LF): Windows guarda los archivos de texto con un salto de línea invisible llamado CRLF, mientras que Mac y Linux usan LF. Si no configuran esto, cuando un compañero de Windows suba un archivo, Git podría marcar como si hubiera modificado todo el documento.

> Todos ejecuten este comando en su terminal global antes de tocar el repositorio:

1.

```bash
git config --global core.autocrlf true
```

2.

```bash
git clone https://github.com/liusamfung/sigep.git
cd sigep
```

3.

```bash
pnpm install || pnpm approve-builds --all
```

4.

```bash
pnpm --filter back-end exec ts-node prisma/seed.ts
```

5. > IMPORTANTE: Copiar el archivo .env (Que esta en el whatsApp) a
   > la carpeta sigep/back-end).
6.

```bash
pnpm --filter back-end exec prisma migrate dev
```

7.

```bash
pnpm --filter back-end exec prisma generate
```

8.

```bash
pnpm --filter back-end exec ts-node prisma/seed.ts
```

> IMPORTANTE: RECUERDA SI TIENES INSTALADO PostgreSQL EN TU COMPUTADORA
> RECUERDA DETENER EL SERVICIO, YA QUE SI NO LO HACES. EL NODEJS APUNTARA POR DEFECTO
> A ESE SERVICIO, Y NO A NUESTRO CONTENEDOR COMPOSE DONDE ESTA NUESTRA BASE DE DATOS
> YA QUE COMPARTEN EL MISMO PUERTO.

# Probar la app

Gracias a la integración de **Turborepo**, ya no es necesario abrir múltiples pestañas de la terminal para inicializar los proyectos de Node.js de forma separada. Turborepo se encarga de orquestar y levantar el ecosistema en paralelo.
Desde la carpeta raíz del proyecto (`sigep/`), ejecuta el comando unificado de desarrollo:

```bash
pnpm turbo dev
```

El componente de hardware interactúa con el lector de huellas de forma aislada. Abre una segunda pestaña en tu terminal y ejecuta los comandos:

```bash
#En otro instancia de terminal
cd agent-python

source env/bin/activate  # (o .\env\Scripts\activate en Windows)

python main.py           # (o python3 main.py)

#Finalmente asegurate que este corriendo en ese entorno la version python 3.12
python --version
```

### En la carpeta de Python (agent-python/)

```bash
cd agent-python

# Crear el entorno virtual
python3.12 -m venv env

# Activar el entorno virtual:
# -> En Mac/Linux:
source env/bin/activate
# -> En Windows (PowerShell):
.\env\Scripts\activate

# Instalar las librerías del proyecto
pip install -r requirements.txt

# Regresar a la raíz
cd ..

```

En resumen:
Backend: Corre en el puerto `localhost:3000`
Frontend: Corre en el puerto `localhost:4200`
Python: Cliente (No abre puerto)
