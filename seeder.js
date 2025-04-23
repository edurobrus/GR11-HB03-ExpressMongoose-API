const fs = require('fs');
const path = require('path');
const os = require('os');
const AdmZip = require('adm-zip');
const { MongoClient } = require('mongodb');
const { EJSON } = require('mongodb/lib/bson');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const JSONStream = require('JSONStream');
const es = require('event-stream');

// CONFIGURACIÓN
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cbd';
const ZIP_FOLDER = './data';
const BATCH_SIZE = 500;

// Promisificar funciones de fs
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);

async function importJsonToMongo(jsonPath, collectionName) {
    return new Promise(async (resolve, reject) => {
        try {
            const collection = this.db.collection(collectionName);
            let buffer = [];
            let count = 0;
            
            const stream = fs.createReadStream(jsonPath, { encoding: 'utf8' })
                .pipe(JSONStream.parse('*'))
                .pipe(es.mapSync(data => {
                    buffer.push(EJSON.parse(EJSON.stringify(data)));
                    
                    if (buffer.length >= BATCH_SIZE) {
                        stream.pause();
                        collection.insertMany(buffer)
                            .then(() => {
                                count += buffer.length;
                                buffer = [];
                                stream.resume();
                            })
                            .catch(reject);
                    }
                    return data;
                }));

            stream.on('end', async () => {
                if (buffer.length > 0) {
                    await collection.insertMany(buffer);
                    count += buffer.length;
                }
                console.log(`  ↳ Insertados ${count} documentos en '${collectionName}'`);
                resolve();
            });

            stream.on('error', reject);
            
        } catch (error) {
            reject(error);
        }
    });
}

async function processZip(zipPath, tempDir, index, totalZips, importFunction) {
    console.log(`\n[${index}/${totalZips}] Procesando ZIP: ${path.basename(zipPath)}`);
    
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);

    const files = await fs.promises.readdir(tempDir);
    const jsonFiles = files.filter(f => path.extname(f) === '.json');
    
    for (const jsonFile of jsonFiles) {
        const jsonPath = path.join(tempDir, jsonFile);
        const filename = path.basename(jsonFile, '.json');
        const collectionName = filename.replace(/^cbd\./, '');
        
        console.log(`  → Procesando archivo: ${jsonFile} → colección '${collectionName}'`);
        await importFunction(jsonPath, collectionName);
    }
}

async function runImport() {
    const client = new MongoClient(MONGO_URI);
    
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        if (dbs.databases.some(d => d.name === DB_NAME)) {
            console.log(`⚠️  Eliminando base de datos existente: ${DB_NAME}`);
            await db.dropDatabase();
        }
        const importJsonBound = importJsonToMongo.bind({ db });

        const zipFiles = (await readdir(ZIP_FOLDER))
            .filter(f => f.endsWith('.zip'));
        const totalZips = zipFiles.length;

        for (let i = 0; i < zipFiles.length; i++) {
            const zipFile = zipFiles[i];
            const zipPath = path.join(ZIP_FOLDER, zipFile);
            const tempDir = path.join(os.tmpdir(), `cbd-import-${uuidv4()}`);
            
            await mkdir(tempDir, { recursive: true });

            try {
                await processZip(zipPath, tempDir, i + 1, totalZips, importJsonBound);
            } finally {
                await rm(tempDir, { recursive: true, force: true });
            }
        }
        
        console.log('\n✅ Importación completada exitosamente.');
    } catch (error) {
        console.error('❌ Error durante la importación:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

module.exports = runImport;