const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");

async function readCSV(filePath) {
  try {
    const jsonArray = await csv({
        noheader: false,
        headers: ['key','en', 'ja', 'cn', 'kr']
    }).fromFile(filePath);
    vscode.window.showInformationMessage("File content: " + jsonArray);
    const newFilePath = path.join(path.dirname(filePath), "newFile.json");
    fs.writeFile(newFilePath, JSON.stringify(jsonArray, null, 2), (err) => {
      if (err) {
        vscode.window.showErrorMessage("Error writing file: " + err.message);
        return;
      }
      vscode.window.showInformationMessage("File written to: " + newFilePath);
    });
  } catch (error) {
    vscode.window.showErrorMessage("Error reading file: " + error.message);
  }
}

module.exports = { readCSV };
