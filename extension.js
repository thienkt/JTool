const vscode = require("vscode");
const MyTreeDataProvider = require("./providers/TreeDataProvider");

const { readCSV } = require("./functions/readCSV");
const { writeJSON } = require("./functions/writeJSON");
const { exportCSV } = require("./functions/exportCSV");

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
    "CSV-i18n.selectLocalePath",
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
    "CSV-i18n.selectCSVFile",
    async () => {
      const data = await readCSV();
      writeJSON(myTreeDataProvider.currentLocalePath, data);
    }
  );

  const exportCSVFile = vscode.commands.registerCommand(
    "CSV-i18n.exportCSVFile",
    async () => {
      exportCSV(myTreeDataProvider.currentLocalePath);
    }
  );

  context.subscriptions.push(selectCSVFile, selectLocalePath, exportCSVFile);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
