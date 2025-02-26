const vscode = require("vscode");
const MyTreeDataProvider = require("./providers/TreeDataProvider");

const { readCSV } = require("./functions/readCSV");
const { writeJSON } = require("./functions/writeJSON");
const { exportCSV } = require("./functions/exportCSV");
const { compareHTML } = require("./functions/compareHTML");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const myTreeDataProvider = new MyTreeDataProvider();

  vscode.window.registerTreeDataProvider("JTool", myTreeDataProvider);
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri;

  const selectDir = vscode.commands.registerCommand(
    "JTool.selectDir",
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
    "JTool.selectCSVFile",
    async () => {
      const data = await readCSV();
      writeJSON(myTreeDataProvider.currentLocalePath, data);
    }
  );

  const exportCSVFile = vscode.commands.registerCommand(
    "JTool.exportCSVFile",
    async () => {
      exportCSV(myTreeDataProvider.currentLocalePath);
    }
  );

  const compareHTMLStructure = vscode.commands.registerCommand(
    "JTool.compareHTMLStructure",
    async () => {
      const data = await compareHTML();
      vscode.window.showInformationMessage("HTML comparison completed.");
    }
  );

  context.subscriptions.push(selectCSVFile, selectDir, exportCSVFile, compareHTMLStructure);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
