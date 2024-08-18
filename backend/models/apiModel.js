// models/apiModel.js

const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  name: String,
  method: String,
  path: String,
  headers: [{ key: String, value: String }],
  queryParams: [{ key: String, value: String }],
  body: mongoose.Schema.Types.Mixed,
  sourceType: String, // E.g., Swagger, WADL, WSDL, Acorn
  metadata: mongoose.Schema.Types.Mixed, // Additional metadata like description, version, etc.
});

const Api = mongoose.model('Api', apiSchema);

module.exports = Api;
