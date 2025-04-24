// controllers/populateController.js
const runImport = require('../seeder');

exports.populateDatabase = async (req, res) => {
  try {
    await runImport();
    res.status(200).json({ message: 'Import completed successfully.' });
  } catch (error) {
    console.error('Error during import:', error);

    return res.status(500).json({
      error: 'Error during import.',
      details: error.message || 'An unexpected error occurred.'
    });
  }
};
