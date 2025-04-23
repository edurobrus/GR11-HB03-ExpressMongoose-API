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
```bash
npm install adm-zip
```
* Este paquete permite descomprimir los archivos zip de la carpeta data a la hora de popular la base de datos.

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
```

### 4. Ejecutar el servidor
```bash
npm start
```
El servidor se iniciará en `http://localhost:3000`

---

## 📂 Estructura del Proyecto
```
GR11-HB03-ExpressMongoose-API/
├── config/
│   └── db.js
│   └── swaggerConfig.js
├── controllers/
│   └── achievementController.js
│   └── cityController.js
│   └── locationController.js
│   └── populateController.js
│   └── restaurantController.js
│   └── userController.js
├── data/
│   └── achievements.zip
│   └── locations.zip
│   └── messages.zip
│   └── userachievements.zip
│   └── users.zip
├── docs/
├── models/
│   └── Achievement.js
│   └── Event.js
│   └── Location.js
│   └── Message.js
│   └── PaymentMethod.js
│   └── StripeWebhook.js
│   └── Transaction.js
│   └── User.js
│   └── UserAchievement.js
├── routes/
│   └── achievementRoutes.js
│   └── cityRoutes.js
│   └── locationRoutes.js
│   └── populatieRoutes.js
│   └── restaurantRoutes.js
│   └── userRoutes.js
├── index.js
├── seeder.js
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
| GET    | `/api/achievements/getById/:id`  | Obtiene el logro por su id  |
| GET    | `/api/achievements/user/:userId`  | Obtiene todos los logros de un usuario  |
| GET    | `/api/cities`  | Obtiene todas las ciudades  |
| POST   | `/api/cities`  | Crea una nueva ciudad      |
| GET    | `/api/cities/nearby`  | Obtiene todas las ciudades cercanos   |
| GET    | `/api/cities/:id` | Obtiene una ciudad por ID   |
| PUT    | `/api/cities/:id` | Actualiza una ciudad por ID |
| DELETE | `/api/cities/:id` | Elimina una ciudad por ID   |
| GET    | `/api/locations`  | Obtiene todas las localizaciones  |
| GET    | `/api/locations/nearby`  | Obtiene todas las localizaciones cercanas  |
| GET    | `/api/locations/top-rated`  | Obtiene las 5 localizaciones mejor puntuadas  |
| GET    | `/api/locations/most-voted`  | Obtiene las 5 localizaciones más votadas  |
| GET    | `/api/locations/:id` | Obtiene una localización por ID   |
| GET    | `/api/locations/:id/rated` | Actualiza la puntuación media de la localización  |
| GET    | `/api/restaurants`  | Obtiene todos los restaurantes   |
| POST   | `/api/restaurants`  | Crea un nuevo restaurante        |
| GET    | `/api/restaurants/nearby`  | Obtiene todos los restaurantes cercanos   |
| GET    | `/api/restaurants/:id` | Obtiene un restaurante por ID   |
| PUT    | `/api/restaurants/:id` | Actualiza un restaurante por ID |
| DELETE | `/api/restaurants/:id` | Elimina un restaurante por ID   |
| POST    | `/api/users` | Crea un nuevo usuario   |
| PUT    | `/api/users/:id` | Actualiza un usuario por id |
| POST   | `/api/populate`  | Importa los datos de los archivos ZIP        |

---

## Contribución
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

