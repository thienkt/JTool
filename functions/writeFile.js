const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

async function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        vscode.window.showErrorMessage(`Error writing file: ${err.message}`);
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

module.exports = { writeFile };
