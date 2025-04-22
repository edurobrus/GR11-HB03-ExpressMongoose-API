const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const basename = path.basename(__filename);

const loadModels = () => {
  // 1. Configurar debug
  mongoose.set('debug', process.env.NODE_ENV === 'development');
  
  // 2. Cargar modelos
  const loadedModels = fs.readdirSync(__dirname)
    .filter(file => (
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
    ))
    .map(file => {
      const modelPath = path.join(__dirname, file);
      try {
        const model = require(modelPath);
        console.log(`📦 Modelo cargado: ${model.modelName}`);
        return model;
      } catch (error) {
        console.error(`❌ Error cargando ${file}:`, error);
        process.exit(1);
      }
    });

  // 3. Validar y registrar modelos
  loadedModels.forEach(({ schema, modelName }) => {
    try {
      if (!mongoose.models[modelName]) {
        mongoose.model(modelName, schema);
        console.log(`✅ Modelo registrado: ${modelName}`);
      } else {
        console.log(`⚠️  Modelo ya registrado: ${modelName}`);
      }
    } catch (error) {
      console.error(`💥 Error registrando ${modelName}:`, error.message);
      process.exit(1);
    }
  });

  // 4. Mostrar resumen final
  console.log('\n🔍 Modelos disponibles:');
  console.log(mongoose.modelNames().map(name => `- ${name}`).join('\n'));
};

module.exports = {
  loadModels,
  mongooseInstance: mongoose,
  getModel: modelName => {
    if (!mongoose.models[modelName]) {
      throw new Error(`Modelo ${modelName} no encontrado`);
    }
    return mongoose.model(modelName);
  }
};