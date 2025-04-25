# 📦 GR11-HB03-ExpressMongoose-API

## 📝 Descripción del Proyecto

Este proyecto es una **API RESTful** desarrollada con **Node.js**, utilizando **Express** como framework web y **Mongoose** para interactuar con una base de datos **MongoDB**. Forma parte del trabajo práctico del grupo **GR11** en el módulo **HB03**, centrado en el desarrollo de backends modernos y escalables.

La API permite gestionar usuarios, mensajes privados, amistades, eventos y localizaciones (ciudades y restaurantes), además de incorporar funcionalidades como autenticación con **JWT** y documentación automática con **Swagger**.

## 🚀 Tecnologías Utilizadas

- **Node.js** – Entorno de ejecución de JavaScript.
- **Express.js** – Framework minimalista para construir APIs.
- **MongoDB** – Base de datos NoSQL orientada a documentos.
- **Mongoose** – ODM para modelar objetos MongoDB en Node.
- **JWT** – Autenticación basada en tokens.
- **Swagger UI + swagger-jsdoc** – Documentación interactiva de la API.
- **Websockets** – Permite una comunicación bidireccional y en tiempo real entre el cliente y el servidor a través de una única conexión persistente.

## 🔧 Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

- **Node.js** y **npm**: Entorno de ejecución y gestor de paquetes. Puedes descargarlo desde [nodejs.org](https://nodejs.org/)
- **Servidor de MongoDB**: Necesario para que la API pueda conectarse a la base de datos.
- **MongoDB Compass** (opcional pero recomendable): Herramienta visual para explorar, consultar y analizar la base de datos MongoDB de forma más sencilla. Puedes descargarla desde [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
- Postman o navegador para probar la API vía Swagger

## 🛠 Instalación y Puesta en Marcha

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

Crea un archivo `.env` en la raíz del proyecto y añade:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cbd
JWT_SECRET=7adfbf456109bb263f7156fcf682a55859a7de88539fd9d128e7972269374b15
```

### 4. Ejecutar el servidor de Node.js

```bash
npm start
```

Con `npm start` **inicia el servidor** y pone en funcionamiento la API en `http://localhost:3000`.

El servidor quedará disponible en:  
👉 `http://localhost:3000`

### 5 Iniciar el servidor de MongoDB

Antes de iniciar la API, asegúrate de que el servidor de MongoDB esté en funcionamiento. Si tienes MongoDB instalado localmente, puedes iniciarlo abriendo el archivo con nombre: mongod

### 6. Ver la documentación Swagger

Accede a:  
👉 `http://localhost:3000/api-docs`

## 🧪 Importar Datos de Prueba

1. Inicia el servidor de Node.js y MongoDB.
2. Abre Swagger UI: `http://localhost:3000/api-docs`
3. Busca la ruta `POST /api/populate`
4. Haz clic en **Try it out** → **Execute**

Esto insertará automáticamente datos de prueba (ciudades, restaurantes, usuarios, etc.) en tu base de datos. Ten en cuenta que este proceso puede tardar algunos minutos, dependiendo de la velocidad de tu conexión y de los recursos disponibles en tu máquina.
Si lo prefieres, también puedes popular la base de datos directamente desde la consola con el comando `npm run setup` teniendo el servidor de MongoDB abierto.

### Verificar datos cargados

Puedes probar rutas como:

```bash
curl -X GET http://localhost:3000/api/restaurants
```

O usar Postman/Swagger para confirmar que los datos están cargados.

## 📂 Estructura del Proyecto

```
GR11-HB03-ExpressMongoose-API/
├── config/           # Configuraciones de conexión y entorno
├── controllers/      # Lógica de negocio y controladores de rutas
├── data/             # Archivos JSON con datos de prueba
├── docs/             # Documentación Swagger
├── middlewares/      # Middlewares de autenticación, errores, etc.
├── models/           # Esquemas de Mongoose
├── routes/           # Rutas de la API divididas por entidad
├── scripts/          # Scripts para setup y populación
├── index.js          # Archivo principal que lanza el servidor
├── .env.local.example
├── package.json
└── README.md
```

## 📡 Endpoints Principales

Aquí tienes una vista rápida. Para detalles y pruebas, usa Swagger.

| Método | Endpoint                               | Descripción                              |
|--------|----------------------------------------|------------------------------------------|
| POST   | `/api/auth/register`                   | Registra un nuevo usuario                |
| POST   | `/api/auth/login`                      | Autentica un usuario                     |
| GET    | `/api/users/me`                        | Obtiene tu perfil                        |
| PUT    | `/api/users/me`                        | Actualiza tu perfil                      |
| GET    | `/api/users/me/friends`                | Lista tus amigos                         |
| POST   | `/api/users/me/friends`                | Añade un nuevo amigo                     |
| DELETE | `/api/users/me/friends/:friendId`      | Elimina a un amigo                       |
| GET    | `/api/messages/sent`                   | Ver mensajes enviados                    |
| GET    | `/api/messages/received`               | Ver mensajes recibidos                   |
| POST   | `/api/messages`                        | Enviar un nuevo mensaje                  |
| GET    | `/api/locations`                       | Lista todas las localizaciones           |
| GET    | `/api/locations/top-rated`             | Top 5 localizaciones por puntuación      |
| GET    | `/api/locations/:id`                   | Detalles de una localización             |
| GET    | `/api/cities/nearby`                   | Lista ciudades cercanas                  |
| GET    | `/api/restaurants/nearby`              | Lista restaurantes cercanos              |
| GET    | `/api/achievements/user`               | Logros del usuario actual                |
| POST   | `/api/populate`                        | Importa datos de prueba                  |

## 🧑‍💻 Contribución

¡Toda ayuda es bienvenida!

1. Haz un fork del repositorio.
2. Crea una rama nueva: `git checkout -b feature/mi-mejora`
3. Haz tus cambios y haz commit: `git commit -m 'Mejora: ...'`
4. Sube la rama: `git push origin feature/mi-mejora`
5. Abre un Pull Request.
