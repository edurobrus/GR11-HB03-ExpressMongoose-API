// controllers/populateController.js
const runImport = require('../scripts/seeder.js');

exports.triggerImport = async (wsClients) => {
  try {
    await runImport(wsClients);
  } catch (error) {
    console.error('Error starting import:', error);
    const message = JSON.stringify({
      event: 'import:error',
      data: { error: error.message }
    });
    wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};