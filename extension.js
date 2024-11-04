const vscode = require("vscode");
const { readCSV } = require("./functions/readCSV");

const MyTreeDataProvider = require("./models/TreeDataProvider");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const myTreeDataProvider = new MyTreeDataProvider();

  vscode.window.registerTreeDataProvider("csv-i18n", myTreeDataProvider);

  const disposable = vscode.commands.registerCommand(
    "i18n-from-csv.uploadFile",
    async () => {
      const options = {
        canSelectMany: false,
        openLabel: "Open",
        filters: {
          "CSV files": ["csv"],
          "All files": ["*"],
        },
      };

      const fileUri = await vscode.window.showOpenDialog(options);

      if (fileUri && fileUri[0]) {
        const filePath = fileUri[0].fsPath;

        vscode.window.showInformationMessage(
          "Selected file: " + fileUri[0].fsPath
        );

        readCSV(filePath);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
