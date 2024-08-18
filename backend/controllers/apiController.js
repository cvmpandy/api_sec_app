// controllers/apiController.js

const Api = require('../models/apiModel');
const { discoverAndSaveApis } = require('../services/apiService');

const getApis = async (req, res) => {
  try {
    const apis = await Api.find();
    res.json(apis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const discoverAndSaveApisController = async (req, res) => {
  try {
    const { directory } = req.body;
    await discoverAndSaveApis(directory);
    res.status(200).json({ message: 'APIs discovered and saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApis,
  discoverAndSaveApisController,
};
