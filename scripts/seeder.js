const zlib = require('node:zlib');
const { resolve } = require('node:path');
const { createReadStream, readdirSync } = require('node:fs');
const { MongoClient, ObjectId } = require('mongodb');
const { createGunzip } = require("node:zlib");
const { chain } = require('stream-chain');
const StreamArray = require("stream-json/streamers/StreamArray");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
const wsClients = new Set();

wss.on('connection', (ws) => {
    wsClients.add(ws);
    console.log('Cliente WebSocket conectado');
    ws.on('close', () => {
        wsClients.delete(ws);
        console.log('Cliente WebSocket desconectado');
    });
});

function sendWsMessage(clients, event, data) {
    const message = JSON.stringify({ event, data });
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const DATA_DIR = resolve(__dirname, "../data");
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cbd';

function readJsonGz(path, collectionName, wsClients) {
    return new Promise((resolve, reject) => {
        const objects = [];
        let count = 0;

        chain([
            createReadStream(path),
            createGunzip(),
            StreamArray.withParser(),
        ])
            .on("data", ({ key, value }) => {
                objects.push(value);
                count++;

                if (count % 500 === 0) {
                    sendWsMessage(wsClients, 'import:progress', { collection: collectionName, count });
                }
            })
            .on("error", (err) => {
                reject(err);
            })
            .on("end", () => {
                sendWsMessage(wsClients, 'import:progress', { collection: collectionName, count });
                resolve(objects);
            });
    });
}

async function setupDB(client) {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log('Connected to', DB_NAME);

    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    if (dbs.databases.some(d => d.name === DB_NAME)) {
        console.log(`⚠️  Deleting existing database: ${DB_NAME}`);
        await db.dropDatabase();
    }

    return db;
}

async function populateDB(db, wsClients) {
    const files = readdirSync(DATA_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)
        .filter(filename => filename.endsWith(".json.gz"));

    for (const filename of files) {
        const collectionName = filename.substring(0, filename.indexOf("."));
        const filePath = resolve(DATA_DIR, filename);

        sendWsMessage(wsClients, 'import:file', {
            file: filename,
            collection: collectionName
        });

        const json = await readJsonGz(filePath, collectionName, wsClients);

        const docs = json.map((doc) => {
            if (doc._id && doc._id.$oid) {
                return { ...doc, _id: new ObjectId(`${doc._id.$oid}`) };
            }
            return doc;
        });

        try {
            const result = await db.collection(collectionName).insertMany(docs, { ordered: false });
            console.log(`  ↳ Inserted ${result.insertedCount} documents into '${DB_NAME}.${collectionName}'`);
        } catch (error) {
            console.error(`  ❌ Failed inserting documents into '${DB_NAME}.${collectionName}':`, error);
        }
    }

    sendWsMessage(wsClients, 'import:done', { message: '✅ Importación completada' });
}

async function main() {
    const client = new MongoClient(MONGO_URI);

    try {
        const db = await setupDB(client);
        await populateDB(db, wsClients); PARÁMETRO
    } finally {
        client.close();
    }
}

if (require.main === module) {
    (async () => await main())();
}

module.exports = main;
