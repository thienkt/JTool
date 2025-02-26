const vscode = require("vscode");
const path = require("path");
const { getJSONFiles } = require("../functions/getJSONFile");
const { getAttributesMap } = require("../functions/compareHTML");

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
    return (
      "/" +
      path
        .relative(workspaceFolder, path.normalize(this.currentLocalePath))
        .replace("\\", "/")
    );
  }

  createTreeItem(
    label,
    command,
    collapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    const newItem = new vscode.TreeItem(label, collapsibleState);
    if (command) {
      newItem.command = {
        command: command,
        title: label,
      };
    }
    return newItem;
  }

  createFileItem(file) {
    const item = new vscode.TreeItem(
      file,
      vscode.TreeItemCollapsibleState.None
    );
    item.iconPath = vscode.ThemeIcon.File;
    item.command = {
      command: "vscode.open",
      title: "Open File",
      arguments: [vscode.Uri.file(path.join(this.currentLocalePath, file))],
    };
    return item;
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    switch (element?.label) {
      case this.relativePath: {
        return getJSONFiles(this.currentLocalePath).map((file) =>
          this.createFileItem(file)
        );
      }
      case "CSV and JSON Operations": {
        return [
          this.createTreeItem("Choose Directory", "JTool.selectDir"),
          this.createTreeItem("Import CSV file", "JTool.selectCSVFile"),
          this.createTreeItem("Export CSV file", "JTool.exportCSVFile"),
        ];
      }
      case "Compare HTML Structure": {
        const attributesMap = getAttributesMap();
        const hasAttributes = Object.keys(attributesMap).length > 0;
        return [
          this.createTreeItem("Input HTML", "JTool.compareHTMLStructure"),
          hasAttributes &&
            this.createTreeItem(
              "Setting Attributes",
              "JTool.showAttributesChecklist"
            ),
        ].filter(Boolean);
      }
      default: {
        const collapsible = vscode.TreeItemCollapsibleState.Collapsed;

        return [
          new vscode.TreeItem(this.relativePath, collapsible),
          new vscode.TreeItem(`CSV and JSON Operations`, collapsible),
          new vscode.TreeItem("Compare HTML Structure", collapsible),
        ];
      }
    }
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
