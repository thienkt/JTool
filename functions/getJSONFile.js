const fs = require("fs");

function getJSONFiles(folderPath) {
  try {
    return fs.readdirSync(folderPath).filter((file) => /^.+\.json$/.test(file));
  } catch (error) {
    return [];
  }
}

module.exports = { getJSONFiles };
