const vscode = require("vscode");
const path = require("path");
const { getJSONFiles } = require("../functions/getJSONFile");

const workspaceFolder = path.normalize(
  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""
);

class MyTreeDataProvider {
  constructor() {
    this.currentLocalePath = path.join(workspaceFolder, "static", "locales");
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  get relativePath() {
    return path
      .relative(workspaceFolder, path.normalize(this.currentLocalePath))
      .replace("\\", "/");
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) return [];

    const files = getJSONFiles(this.currentLocalePath).map((file) => {
      const item = new vscode.TreeItem("");
      item.description = file;
      item.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [vscode.Uri.file(path.join(this.currentLocalePath, file))],
      };
      return item;
    });

    const itemSelectPath = new vscode.TreeItem("Locales Path");
    itemSelectPath.iconPath = vscode.ThemeIcon.Folder;
    itemSelectPath.description = `~/${this.relativePath}`;
    itemSelectPath.command = {
      command: "CSV-i18n.selectLocalePath",
      title: "Select Locale Path",
    };

    const itemUpload = new vscode.TreeItem("Select CSV file");
    itemUpload.iconPath = vscode.ThemeIcon.File;
    itemUpload.command = {
      command: "CSV-i18n.selectCSVFile",
      title: "Select CSV file",
    };

    const itemExportCSV = new vscode.TreeItem("Export CSV file");
    itemExportCSV.iconPath = vscode.ThemeIcon.Folder;
    itemExportCSV.command = {
      command: "CSV-i18n.exportCSVFile",
      title: "Export CSV file",
    };

    return [itemSelectPath, ...files, itemUpload, itemExportCSV];
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  updateLocalePath(newPath) {
    this.currentLocalePath = newPath;
    this.refresh();
  }
}

module.exports = MyTreeDataProvider;
