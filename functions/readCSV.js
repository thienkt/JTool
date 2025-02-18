const vscode = require("vscode");
const csv = require("csvtojson");

async function readCSV() {
  try {
    const options = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        "CSV files": ["csv"],
        "All files": ["*"],
      },
    };

    const fileUri = await vscode.window.showOpenDialog(options);

    if (fileUri?.length) {
      const filePath = fileUri[0].fsPath;

      vscode.window.showInformationMessage(
        "Selected file: " + fileUri[0].fsPath
      );

      return await csv({
        trim: true,
        // headers: ["key", "en", "ja", "cn", "kr"],
      }).fromFile(filePath);
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error reading file: " + error.message);
  }
}

module.exports = { readCSV };
