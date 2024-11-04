const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const { getJSONFiles } = require("./getJSONFile");
const { getLocalesData } = require("../utils");

function writeJSON(dirPath, data) {
  const locales = getJSONFiles(dirPath).map((file) =>
    file.replace(".json", "")
  );

  if (!locales.length) return;

  const localesData = getLocalesData(dirPath, locales);

  data.forEach((row) => {
    if (!row.key) return;
    locales.forEach((locale) => {
      localesData[locale].set(row.key, row[locale]);
    });
  });

  locales.forEach((locale) => {
    const filePath = path.join(dirPath, `${locale}.json`);

    fs.writeFile(
      filePath,
      JSON.stringify(localesData[locale], null, 2),
      (err) => {
        if (err) {
          vscode.window.showErrorMessage(`Error writing file: ${err.message}`);
        } else {
          vscode.window.showInformationMessage(`File written to:  ${locale}.json`);
        }
      }
    );
  });
}

module.exports = { writeJSON };
