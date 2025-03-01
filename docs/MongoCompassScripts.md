// Para restaurantes


Los usuarios User.csv los he sacado de :https://www.kaggle.com/datasets/programmerrdai/brute-force-database?select=38650-password-sktorrent.txt
He sacado los Restaurant.csv: https://www.kaggle.com/datasets/stefanoleone992/tripadvisor-european-restaurants
Despues he hecho esta operacion en MongoCompass: y luego me he descargado los json de los dos que estan en la carpeta data
Despues este es el de City.csv: https://www.kaggle.com/datasets/max-mind/world-cities-database?select=worldcitiespop.csv
Compress-Archive -Path data/cbd.cities.json -DestinationPath .\archivo.zip  
Compress-Archive -Path data/cbd.restaurants.json -DestinationPath .\archivo.zip  
Compress-Archive -Path data/cbd.users.json -DestinationPath .\archivo.zip  
db.cities.updateMany(
  {
    $or: [
      { latitude: { $exists: true } },
      { longitude: { $exists: true } }
    ]
  },
  [{
    $set: {
      location: {
        type: "Point",
        coordinates: [
          { $ifNull: ["$longitude", 0] }, // Si no existe, usa 0 (ajusta según tus datos)
          { $ifNull: ["$latitude", 0] }
        ]
      }
    }
  }, {
    $unset: ["latitude", "longitude"]
  }]
);
db.restaurants.updateMany(
  {
    $or: [
      { latitude: { $exists: true } },
      { longitude: { $exists: true } }
    ]
  },
  [{
    $set: {
      location: {
        type: "Point",
        coordinates: [
          { $ifNull: ["$longitude", 0] }, // Si no existe, usa 0 (ajusta según tus datos)
          { $ifNull: ["$latitude", 0] }
        ]
      }
    }
  }, {
    $unset: ["latitude", "longitude"]
  }]
);

// Para usuarios
db.users.updateMany(
  {
    $or: [
      { latitude: { $exists: true } },
      { longitude: { $exists: true } }
    ]
  },
  [{
    $set: {
      location: {
        type: "Point",
        coordinates: [
          { $ifNull: ["$longitude", 0] },
          { $ifNull: ["$latitude", 0] }
        ]
      }
    }
  }, {
    $unset: ["latitude", "longitude"]
  }]
);


db.users.updateMany(
    {}, // Filtro vacío para aplicar a todos los documentos
    {
        $set: {
            cities: [], // Inicializa el campo `cities` como un array vacío
            restaurants: [] // Inicializa el campo `restaurants` como un array vacío
        }
    }
);