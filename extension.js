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
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri;

  const selectLocalePath = vscode.commands.registerCommand(
    "i18n-from-csv.selectLocalePath",
    async () => {
      const options = {
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        defaultUri: workspaceFolder,
        title: "Select a directory",
        openLabel: "Select",
      };

      const folderUri = await vscode.window.showOpenDialog(options);

      if (folderUri?.length) {
        const folderPath = folderUri[0].fsPath;
        myTreeDataProvider.updateLocalePath(folderPath);
      }
    }
  );

  const selectCSVFile = vscode.commands.registerCommand(
    "i18n-from-csv.selectCSVFile",
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

      if (fileUri?.length) {
        const filePath = fileUri[0].fsPath;

        vscode.window.showInformationMessage(
          "Selected file: " + fileUri[0].fsPath
        );

        readCSV(filePath);
      }
    }
  );

  context.subscriptions.push(selectCSVFile, selectLocalePath);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
