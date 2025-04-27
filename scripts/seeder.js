const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { MongoClient } = require('mongodb');
const { EJSON } = require('mongodb/lib/bson');
const { promisify } = require('util');
const { chain } = require('stream-chain');
const StreamArray = require('stream-json/streamers/StreamArray');
const WebSocket = require('ws');

// CONFIGURACIÓN
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cbd';
const DATA_DIR = './data';
const BATCH_SIZE = 500;

// Promisificar funciones de fs
const readdir = promisify(fs.readdir);

// Función auxiliar para enviar mensajes WebSocket
function sendWsMessage(clients, event, data) {
  const message = JSON.stringify({ event, data });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

async function importJsonToMongo(gzPath, collectionName) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(collectionName);
    const wsClients = this.wsClients;
    let buffer = [];
    let count = 0;

    const pipeline = chain([
      fs.createReadStream(gzPath),
      zlib.createGunzip(),
      StreamArray.withParser(),
    ]);

    pipeline.on('data', ({ value }) => {
      try {
        const doc = EJSON.parse(EJSON.stringify(value));
        buffer.push(doc);

        if (buffer.length >= BATCH_SIZE) {
          pipeline.pause();
          collection.insertMany(buffer)
            .then(() => {
              count += buffer.length;
              sendWsMessage(wsClients, 'import:progress', {
                collection: collectionName,
                count: count
              });
              buffer = [];
              pipeline.resume();
            })
            .catch(err => {
              pipeline.destroy(err);
              reject(err);
            });
        }
      } catch (err) {
        pipeline.destroy(err);
        reject(err);
      }
    });

    pipeline.on('error', reject);

    pipeline.on('end', async () => {
      try {
        if (buffer.length > 0) {
          await collection.insertMany(buffer);
          count += buffer.length;
          sendWsMessage(wsClients, 'import:progress', {
            collection: collectionName,
            count: count
          });
        }
        console.log(`  ↳ Insertados ${count} documentos en '${collectionName}'`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function runImport(wsClients) {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    // Eliminar BD existente
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    if (dbs.databases.some(d => d.name === DB_NAME)) {
      console.log(`⚠️  Eliminando base de datos existente: ${DB_NAME}`);
      await db.dropDatabase();
    }

    const importJsonBound = importJsonToMongo.bind({ db, wsClients });

    // Procesar archivos .json.gz
    const files = (await readdir(DATA_DIR)).filter(f => f.endsWith('.json.gz'));
    const totalFiles = files.length;

    sendWsMessage(wsClients, 'import:start', { totalFiles });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(DATA_DIR, file);
      const collectionName = file.replace(/\.json\.gz$/, '');

      sendWsMessage(wsClients, 'import:file', {
        file: file,
        collection: collectionName,
        current: i + 1,
        total: totalFiles
      });

      console.log(`\n[${i + 1}/${totalFiles}] Procesando: ${file} → '${collectionName}'`);
      await importJsonBound(filePath, collectionName);
    }
    
    sendWsMessage(wsClients, 'import:done', { message: '✅ Importación completada' });
    console.log('\n✅ Importación completada exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    sendWsMessage(wsClients, 'import:error', { error: error.message });
  } finally {
    await client.close();
  }
}

module.exports = runImport;

if (require.main === module) {
  const wss = new WebSocket.Server({ port: 3001 });
  const wsClients = new Set();

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    ws.on('close', () => {
      wsClients.delete(ws);
    });
  });

  runImport(wsClients)
    .catch(err => {
      console.error('❌ Error en ejecución directa:', err);
    });
}
