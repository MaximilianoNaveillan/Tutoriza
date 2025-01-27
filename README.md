## Funcionalidades del Proyecto

### Backend (Flask)

1. **Registro de Usuarios**:
   - Endpoint: `/register`
   - Método: `POST`
   - Descripción: Permite registrar nuevos usuarios con datos como nombre, apellido, email y contraseña. La contraseña se guarda de forma segura usando hashing.

2. **Inicio de Sesión**:
   - Endpoint: `/login`
   - Método: `POST`
   - Descripción: Permite a los usuarios iniciar sesión proporcionando su email y contraseña.

3. **Gestión de Asesorías**:
   - **Ver todas las asesorías**: `GET /asesorias`
   - **Obtener asesoría por ID**: `GET /asesoria/<id>`
   - **Solicitar asesoría**: `POST /solicitar-asesoria`
   - **Actualizar asesoría**: `PUT /asesoria/<asesoriaId>`
   - **Eliminar asesoría**: `DELETE /asesoria/<asesoria_id>`

### Frontend

El frontend está compuesto por **Web Components** en la carpeta `frontend/components` que interactúan con el backend a través de API RESTful, enviando y recibiendo datos en formato JSON. Además, se utiliza **Bootstrap** para el diseño y la creación de interfaces de usuario responsive.

### Base de Datos (MongoDB)

- La base de datos utilizada es **MongoDB**, y se conecta a través de la URI proporcionada en el archivo `.env`. Las colecciones principales son `users` y `asesorias`.

## Requisitos

- Python 3.x
- Flask
- python-dotenv
- pymongo
- werkzeug
- Bootstrap
- Web Components
