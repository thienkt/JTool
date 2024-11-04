const vscode = require("vscode");

class MyTreeDataProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!element) {
      const uploadItem = new vscode.TreeItem("Upload CSV");
      uploadItem.command = {
        command: "i18n-from-csv.uploadFile",
        title: "Upload CSV",
      };
      return [uploadItem];
    }
    return [];
  }
}

module.exports = MyTreeDataProvider;
