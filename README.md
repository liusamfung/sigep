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
  nombre_bd:
  usuario:
  contrasena:
```

# Instalación de dependencias (Solo la primera vez)

	Los saltos de línea de Git (CRLF vs LF): Windows guarda los archivos de texto con un salto de línea invisible llamado CRLF, mientras que Mac y Linux usan LF. Si no configuran esto, cuando un compañero de Windows suba un archivo, Git podría marcar como si hubiera modificado todo el documento.
> Todos ejecuten este comando en su terminal global antes de tocar el repositorio: 
```bash
git config --global core.autocrlf true
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

### En la carpeta del Backend (back-end/)

```bash
cd back-end
npm install
cd ..
```

### En la carpeta del Frontend (front-end/)

```bash
cd front-end
npm install
cd ..
```

# Probar la app

Para probar todo el flujo (Huella -> NestJS -> Angular), debes necesitar abrir tres pestañas o terminales diferentes al mismo tiempo, porque cada servicio corre en un puerto distinto de la computadora.

```bash
cd back-end
npm run start:dev
```

> (El comando start:dev es clave porque activa el modo "watch": cada vez que alguien guarde un cambio en el código de NestJS, el servidor se reiniciará solo).

En otra instacia:

```bash
cd front-end
ng serve
```

En otra instancia:

```bash
cd agent-python
# Asegurarse de activar el entorno primero:
source env/bin/activate  # (o .\env\Scripts\activate en Windows)
python main.py  #( o python3.13 main.py)

#Finalmente asegurate que este corriendo en ese entorno la version python 3.12
python --version
```

En resumen:
Backend: Corre en el puerto `localhost:3000`
Frontend: Corre en el puerto `localhost:4200`
Python: Cliente (No abre puerto)
