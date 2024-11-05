const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const { getJSONFiles } = require("./getJSONFile");
const { getLocalesData } = require("./getLocalesData");

async function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        vscode.window.showErrorMessage(`Error writing file: ${err.message}`);
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

async function writeJSON(dirPath, data) {
  const locales = getJSONFiles(dirPath).map((file) =>
    file.replace(".json", "")
  );

  if (!locales.length) return;

  const localesData = getLocalesData(dirPath, locales);

  let entries = 0;

  data.forEach((row) => {
    if (!row.key) return;
    entries++;
    locales.forEach((locale) => {
      localesData[locale].set(row.key, row[locale]);
    });
  });

  const files = [];

  await Promise.all(
    locales.map(async (locale) => {
      const filePath = path.join(dirPath, `${locale}.json`);
      await writeFile(filePath, localesData[locale]);
      files.push(`${locale}.json`);
    })
  );

  const message = `Successfully written ${entries} entries to the following files:`;

  const selection = await vscode.window.showInformationMessage(
    message,
    "",
    ...files
  );

  if (selection) {
    const filePath = path.join(dirPath, selection);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }
}

module.exports = { writeJSON };
