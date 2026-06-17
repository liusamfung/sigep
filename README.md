# Flujo de trabajo: Feature Branch with PRs

- Si no estas seguro a que se refiere, indaga sobre ello. (Básicamente la rama main esta protegida para que nadie pueda sobreescribirla directamente. La unica forma de hacer cambios es haciendo merge desde otra rama.
- Síntesis: Protege la rama principal (Versio estable) mediante PullRequest

---

## Dependencias y Versiones Usadas

Compatibilidad del entorno de desarrollo

```yaml
database:
  nombre_bd:
  usuario:
  contrasena:
```

# Instalación de dependencias (Solo la primera vez)

### En la carpeta de Python (agent-python/)

```bash
cd agent-python

# Crear el entorno virtual
python3 -m venv env

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
python main.py  #( o python3 main.py)

```

En resumen:
Backend: Corre en el puerto `localhost:3000`
Frontend: Corre en el puerto `localhost:4200`
Python: Cliente (No abre puerto)
