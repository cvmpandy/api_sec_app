// routes/apiRoutes.js

const express = require('express');
const { getApis, discoverAndSaveApisController } = require('../controllers/apiController');

const router = express.Router();

router.get('/apis', getApis);
router.post('/discover', discoverAndSaveApisController);

module.exports = router;
