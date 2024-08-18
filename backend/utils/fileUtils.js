const fs = require('fs');
const path = require('path');

// Read directory contents
const readDirectory = (dir) => {
  return fs.readdirSync(dir).map(file => path.join(dir, file));
};

module.exports = { readDirectory };
