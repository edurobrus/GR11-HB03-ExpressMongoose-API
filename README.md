# GR11-HB03-ExpressMongoose-API

## Descripción
Este proyecto es una API REST desarrollada con Node.js utilizando Express.js como framework para la gestión de rutas y Mongoose como ODM para la interacción con MongoDB. Forma parte de la práctica del grupo **GR11** en el módulo **HB03**.

## Tecnologías utilizadas
- **Node.js** - Entorno de ejecución de JavaScript en el servidor.
- **Express.js** - Framework web para Node.js.
- **Mongoose** - ODM para trabajar con MongoDB.
- **MongoDB** - Base de datos NoSQL orientada a documentos.

## Instalación
### 1. Clonar el repositorio
```bash
git clone git@github.com:edurobrus/GR11-HB03-ExpressMongoose-API.git
cd GR11-HB03-ExpressMongoose-API
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
```

### 4. Ejecutar el servidor
```bash
npm run setup
```
```bash
npm start
```
El servidor se iniciará en `http://localhost:3000`

---

## 📂 Estructura del Proyecto
```
GR11-HB03-ExpressMongoose-API/
├── config/
│   └── ... Archivos de configuración
├── controllers/
│   └── ... Colecciones de request handlers
├── data/
│   └── ... Conjuntos de datos
├── docs/
├── middlewares/
│   └── ... 
├── models/
│   └── ... Modelos de Mongoose
├── routes/
│   └── ... Rutas de Express
├── scripts/
│   └── ... Scripts de setup
├── index.js
├── package.json
├── package-lock.json
├── .env.local.example
└── .gitignore
```

---

## Importar Datos de Prueba

### 1. Ejecutar la Importación
Para importar los datos de prueba a MongoDB, sigue estos pasos:

Primero, asegúrate de que el proyecto esté en funcionamiento. Ejecuta el siguiente comando para iniciar el servidor:
```bash
node index.js
```

Esto levantará el servidor y podrás acceder a la API en http://localhost:3000

Una vez que el servidor esté corriendo, abre Swagger en tu navegador accediendo a la siguiente URL: http://localhost:3000/api-docs

Dentro de Swagger, encontrarás la ruta /api/populate.

Haz lo siguiente:

- Selecciona el método POST de la ruta /api/populate.

-  Haz clic en "Try it out".

- Luego, presiona el botón "Execute" para realizar la importación de los datos.

Este proceso poblará automáticamente la base de datos con los datos de prueba necesarios para realizar las pruebas de la API.

### 2. Verificar que los Datos se Cargaron
Una vez completada la importación, puedes verificar que los datos fueron correctamente insertados en la base de datos utilizando las rutas de consulta disponibles en la API, como /api/locations o /api/restaurants. También puedes utilizar el cliente de base de datos MongoDB para confirmar que los documentos han sido creados correctamente.

```bash
curl -X GET http://localhost:3000/api/restaurants
```
O usar **Postman** para ver los restaurantes en la base de datos.

---

## Endpoints principales
| Método | Endpoint       | Descripción               |
|--------|--------------|---------------------------|
| GET    | `/api/achievements`  | Obtiene todos los logros  |
| GET    | `/api/achievements/user`  | Obtiene todos mis logros  |
| GET    | `/api/achievements/:id`  | Obtiene el logro por su id  |
| POST    | `/api/auth/register`  | Registra a un nuevo usuario |
| POST    | `/api/auth/login`  | Autentica al usuario |
| GET    | `/api/cities`  | Obtiene todas las ciudades  |
| GET    | `/api/cities/nearby`  | Obtiene todas las ciudades cercanos   |
| GET    | `/api/cities/:id` | Obtiene una ciudad por ID   |
| GET    | `/api/locations`  | Obtiene todas las localizaciones  |
| GET    | `/api/locations/nearby`  | Obtiene todas las localizaciones cercanas  |
| GET    | `/api/locations/top-rated`  | Obtiene las 5 localizaciones mejor puntuadas  |
| GET    | `/api/locations/most-voted`  | Obtiene las 5 localizaciones más votadas  |
| GET    | `/api/locations/:id` | Obtiene una localización por ID   |
| GET    | `/api/locations/:id/rated` | Actualiza la puntuación media de la localización  |
| POST    | `/api/messages`  | Crea un nuevo mensaje  |
| GET    | `/api/messages/sent`  | Obtiene todos los mensajes enviados por el usuario  |
| GET    | `/api/messages/received`  | Obtiene todos los mensajes recibidos por el usuario  |
| PATCH    | `/api/messages/status/:id` | Actualiza el estado del mensaje   |
| DELETE    | `/api/messages/:id` | Elimina un mensaje por su id  |
| GET    | `/api/restaurants`  | Obtiene todos los restaurantes   |
| GET    | `/api/restaurants/nearby`  | Obtiene todos los restaurantes cercanos   |
| GET    | `/api/restaurants/:id` | Obtiene un restaurante por ID   |
| GET    | `/api/users/me` | Obtiene el perfil del usuario   |
| PUT    | `/api/users/me` | Actualiza el perfil del usuario |
| GET    | `/api/users/me/friends` | Obtiene las amistades de un usuario   |
| POST    | `/api/users/me/friends` | Añade a un usuario a tu lista de amigos   |
| DELETE    | `/api/users/me/friends/:friendId` | Elimina a un usuario de tu lista de amigos |
| POST   | `/api/populate`  | Importa los datos de los archivos        |

---

## Contribución
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

