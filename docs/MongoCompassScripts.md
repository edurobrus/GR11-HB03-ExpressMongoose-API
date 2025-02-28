// Para restaurantes


Los usuarios User.csv los he sacado de :https://www.kaggle.com/datasets/programmerrdai/brute-force-database?select=38650-password-sktorrent.txt
He sacado los Restaurant.csv: https://www.kaggle.com/datasets/stefanoleone992/tripadvisor-european-restaurants
Despues he hecho esta operacion en MongoCompass: y luego me he descargado los json de los dos que estan en la carpeta data
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