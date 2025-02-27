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
npm start
```
El servidor se iniciará en `http://localhost:3000`

---

## 📂 Estructura del Proyecto
```
GR11-HB03-ExpressMongoose-API/
├── config/
│   └── db.js
├── controllers/
│   └── restaurantController.js
├── models/
│   └── Restaurant.js
├── routes/
│   └── restaurantRoutes.js
├── data/
│   └── Restaurants.csv
├── scripts/
│   └── importData.js
├── index.js
├── .env
├── package.json
└── .gitignore
```

---

## Importar Datos de Prueba

### 1. Ejecutar la Importación
Corre el siguiente comando para importar los datos a MongoDB:
```bash
node scripts/importData.js
```
Esto leerá el archivo CSV y lo guardará en la base de datos.

### 2. Verificar que los Datos se Cargaron
Puedes hacer una petición **GET** a la API:
```bash
curl -X GET http://localhost:3000/api/restaurants
```
O usar **Postman** para ver los restaurantes en la base de datos.

---

## Endpoints principales
| Método | Endpoint       | Descripción               |
|--------|--------------|---------------------------|
| GET    | `/api/restaurants`  | Obtiene todos los restaurantes   |
| POST   | `/api/restaurants`  | Crea un nuevo restaurante        |
| GET    | `/api/restaurants/:id` | Obtiene un restaurante por ID   |
| PUT    | `/api/restaurants/:id` | Actualiza un restaurante por ID |
| DELETE | `/api/restaurants/:id` | Elimina un restaurante por ID   |

---

## Contribución
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

