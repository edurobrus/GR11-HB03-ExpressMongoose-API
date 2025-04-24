const runImport = require('../seeder');

exports.triggerImport = async (wsClients) => {
  try {
    await runImport(wsClients);
  } catch (error) {
    console.error('Error al iniciar importación:', error);
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