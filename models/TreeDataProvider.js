const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const workspaceFolder = path.normalize(
  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""
);

const getFiles = (folderPath) => {
  try {
    return fs
      .readdirSync(folderPath)
      .filter((file) => /^.+\.json$/.test(file))
      .map((file) => {
        const item = new vscode.TreeItem("");
        item.description = file;
        item.command = {
          command: "vscode.open",
          title: "Open File",
          arguments: [vscode.Uri.file(path.join(folderPath, file))],
        };
        return item;
      });
  } catch (error) {
    return [];
  }
};

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

    const files = getFiles(this.currentLocalePath);

    const selectLocalePathItem = new vscode.TreeItem("Locales Path");
    selectLocalePathItem.iconPath = vscode.ThemeIcon.Folder;
    selectLocalePathItem.description = `~/${this.relativePath}`;
    selectLocalePathItem.command = {
      command: "i18n-from-csv.selectLocalePath",
      title: "Select Locale Path",
    };

    const uploadItem = new vscode.TreeItem("Select CSV file");
    uploadItem.iconPath = vscode.ThemeIcon.File;
    uploadItem.command = {
      command: "i18n-from-csv.selectCSVFile",
      title: "Select CSV file",
    };

    return [selectLocalePathItem, ...files, uploadItem];
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
