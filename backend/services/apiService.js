// services/apiService.js

const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');
const swaggerParser = require('swagger-parser');
const wsdlrdr = require('wsdlrdr');
const Api = require('../models/apiModel');

// Discover APIs using Swagger/OpenAPI files
const discoverSwaggerApis = async (directory) => {
  const apiEndpoints = [];
  const files = fs.readdirSync(directory);

  for (const file of files) {
    if (file.endsWith('.json') || file.endsWith('.yaml')) {
      const filePath = path.join(directory, file);
      try {
        const api = await swaggerParser.validate(filePath);
        api.paths.forEach((path) => {
          Object.keys(path).forEach((method) => {
            apiEndpoints.push({
              name: api.info.title,
              method: method.toUpperCase(),
              path: path,
              sourceType: 'Swagger',
              metadata: api.info,
            });
          });
        });
      } catch (error) {
        console.error(`Error parsing Swagger file ${filePath}:`, error);
      }
    }
  }

  return apiEndpoints;
};

// Discover APIs using WSDL/WADL files
const discoverWSDLWADLApis = async (directory) => {
  const apiEndpoints = [];
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    if (file.endsWith('.wsdl') || file.endsWith('.wadl')) {
      try {
        const apiDescription = await wsdlrdr.getWSDLServices(filePath);
        apiDescription.forEach((service) => {
          service.operations.forEach((operation) => {
            apiEndpoints.push({
              name: service.name,
              method: operation.method || 'SOAP',
              path: operation.input.messageNamespace || '',
              sourceType: 'WSDL/WADL',
              metadata: service,
            });
          });
        });
      } catch (error) {
        console.error(`Error parsing WSDL/WADL file ${filePath}:`, error);
      }
    }
  }

  return apiEndpoints;
};

// Discover APIs using Acorn (JavaScript Parser)
const discoverApisFromJSDirectory = async (directory) => {
  const apiEndpoints = [];
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const ast = acorn.parse(fileContent, { ecmaVersion: 2020 });

      walk.simple(ast, {
        CallExpression(node) {
          if (node.callee && node.callee.object && node.callee.object.name === 'app') {
            const method = node.callee.property.name.toUpperCase();
            const path = node.arguments[0].value;

            apiEndpoints.push({
              name: path,
              method: method,
              path: path,
              sourceType: 'Acorn',
              metadata: {},
            });
          }
        },
      });
    }
  }

  return apiEndpoints;
};

// Aggregate and save APIs to MongoDB
const discoverAndSaveApis = async (directory) => {
  const swaggerApis = await discoverSwaggerApis(directory);
  const wsdlWadlApis = await discoverWSDLWADLApis(directory);
  const jsApis = await discoverApisFromJSDirectory(directory);

  const allApis = [...swaggerApis, ...wsdlWadlApis, ...jsApis];
  await Api.insertMany(allApis);
};

module.exports = {
  discoverAndSaveApis,
};
