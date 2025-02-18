const vscode = require("vscode");
const path = require("path");
const { getJSONFiles } = require("./getJSONFile");
const { getLocalesData } = require("./getLocalesData");
const { json2csvAsync } = require("json-2-csv");
const { writeFile } = require("./writeFile");

async function exportCSV(dirPath) {
  const locales = getJSONFiles(dirPath).map((file) =>
    file.replace(".json", "")
  );

  if (!locales.length) return;

  const localesData = getLocalesData(dirPath, locales, { flatten: true });

  const csvData = {};

  const initialRow = locales.reduce(
    (result, locale) => ({ ...result, [locale]: "" }),
    {}
  );

  locales.forEach((locale) => {
    Object.keys(localesData[locale]).forEach((key) => {
      if (typeof localesData[locale][key] !== "string") return;
      csvData[key] ??= { ...initialRow };
      csvData[key][locale] = localesData[locale][key];
    });
  });

  const csv = await json2csvAsync(
    Object.keys(csvData).map((key) => ({ key, ...csvData[key] }))
  );

  const fileName = new Date()
    .toLocaleString("vi-VN")
    .replaceAll("/", "-")
    .replaceAll(":", ".");

  const options = {
    defaultUri: vscode.Uri.file(path.join(dirPath, `${fileName}.csv`)),
    filters: {
      "CSV Files": ["csv"],
      "All Files": ["*"],
    },
  };

  console.log({ csv });
  const fileUri = await vscode.window.showSaveDialog(options);

  if (!fileUri) return;

  await writeFile(fileUri.fsPath, csv);

  const open = await vscode.window.showInformationMessage(
    `CSV file saved to ${fileUri.fsPath}`,
    "Open"
  );

  if (open) {
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);
  }
}

module.exports = { exportCSV };
