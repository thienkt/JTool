const vscode = require("vscode");
const path = require("path");

const { getJSONFiles } = require("./getJSONFile");
const { getLocalesData } = require("./getLocalesData");
const { writeFile } = require("./writeFile");

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
      const key = row.key?.replace(/\n/g, "");
      key && localesData[locale].set(key, row[locale]);
    });
  });

  const files = [];

  await Promise.all(
    locales.map(async (locale) => {
      const filePath = path.join(dirPath, `${locale}.json`);
      await writeFile(filePath, JSON.stringify(localesData[locale], null, 2));
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
