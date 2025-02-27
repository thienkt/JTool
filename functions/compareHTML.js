const yaml = require("js-yaml");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { JSDOM } = require("jsdom");

let isDiffShown = false;
let onDidChangeEditorsDisposable;
let oldAttributesMap = {
  $selector: false,
};

const attributesMap = {
  $selector: false,
};

const tempDir = os.tmpdir();
const htmlMock = path.join(tempDir, "mock.html");
const htmlDev = path.join(tempDir, "dev.html");
const yamlMock = path.join(tempDir, "mock.yaml");
const yamlDev = path.join(tempDir, "dev.yaml");

const htmlMockUri = vscode.Uri.file(htmlMock);
const htmlDevUri = vscode.Uri.file(htmlDev);
const yamlMockUri = vscode.Uri.file(yamlMock);
const yamlDevUri = vscode.Uri.file(yamlDev);

async function compareHTML(treeDataProvider) {
  if (isDiffShown) return;

  // Create temporary HTML files
  fs.writeFileSync(htmlMock, "");
  fs.writeFileSync(htmlDev, "");
  fs.writeFileSync(yamlMock, "");
  fs.writeFileSync(yamlDev, "");

  // Open the files in the editor
  const htmlMockDocument = await vscode.workspace.openTextDocument(htmlMockUri);
  const htmlDevDocument = await vscode.workspace.openTextDocument(htmlDevUri);

  // Create a new editor group below the current one
  await vscode.commands.executeCommand("workbench.action.splitEditorDown");

  await vscode.window.showTextDocument(htmlMockDocument, {
    viewColumn: vscode.ViewColumn.One,
  });

  await vscode.window.showTextDocument(htmlDevDocument, {
    viewColumn: vscode.ViewColumn.Beside,
  });

  await vscode.commands.executeCommand(
    "vscode.diff",
    yamlMockUri,
    yamlDevUri,
    "Diff",
    { viewColumn: vscode.ViewColumn.Three }
  );

  // Set up a file system watcher to handle file changes
  const watcher = fs.watch(tempDir, (eventType, filename) => {
    if (filename === "mock.html" || filename === "dev.html") {
      console.log(`File ${filename} has been ${eventType}`);
      // Handle the file change event as needed
      updateYAMLFiles();

      treeDataProvider.refresh();
    }
  });

  // Clean up the watcher when the files are closed
  // Remove the files if they are not open
  if (!onDidChangeEditorsDisposable) {
    onDidChangeEditorsDisposable = vscode.window.onDidChangeVisibleTextEditors(
      (editors) => {
        const formattedUri = (uri) => uri._formatted;

        const openFiles = editors.map((editor) =>
          formattedUri(editor.document.uri)
        );

        if (
          !openFiles.includes(formattedUri(htmlMockUri)) &&
          !openFiles.includes(formattedUri(htmlDevUri))
        ) {
          fs.unlinkSync(htmlMock);
          fs.unlinkSync(htmlDev);
          watcher.close();
          onDidChangeEditorsDisposable.dispose();
          onDidChangeEditorsDisposable = null;
          isDiffShown = false;
          Object.keys(attributesMap).forEach((attr) => {
            delete attributesMap[attr];
          });
        }
      }
    );
  }

  isDiffShown = true;
}

function extractElementInfo(element) {
  function extractNode(node, parentSelector = "") {
    if (node.tagName.toLowerCase() === "script") {
      return null;
    }

    const info = {
      $tag: node.tagName.toLowerCase(),
      attributes: {},
      children: [],
    };

    // Extract innerText only if the element has no children
    attributesMap.textContent = oldAttributesMap.textContent;
    if (node.children.length === 0 && attributesMap.textContent !== false) {
      const text = node.textContent?.replace(/(\s|\\n)+/g, " ").trim();
      if (text) {
        attributesMap.textContent = true;
        info.attributes.textContent = text;
      }
    }

    // Extract non-data and non-id attributes
    Array.from(node.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-") || attr.name === "id") return;

      if (attr.name === "class") {
        attributesMap.$class = oldAttributesMap.$class;

        if (attributesMap.$class === false) return;

        attributesMap.$class = true;
        info.$class = Array.from(node.classList).sort().join(" ");
        return;
      }

      attributesMap[attr.name] = oldAttributesMap[attr.name];

      if (attributesMap[attr.name] === false) return;

      attributesMap[attr.name] = true;
      info.attributes[attr.name] = attr.value?.trim();
    });

    const getSelector = (node) => {
      // Add absolute query selector to attributes
      let selector = node.tagName.toLowerCase();
      if (node.id) {
        selector += `#${node.id}`;
      }
      if (node.className) {
        selector += `.${node.className.split(" ").join(".")}`;
      }
      info.$selector = parentSelector
        ? `${parentSelector} > ${selector}`
        : selector;
    };

    if (attributesMap.$selector) {
      getSelector(node);
    }

    // Recursively extract children and store them as an object
    Array.from(node.children).forEach((child) => {
      const childInfo = extractNode(child, info.$selector);
      if (childInfo) {
        info.children ??= [];
        info.children.push(childInfo);
      }
    });

    return info;
  }
  if (attributesMap.textContent == null) {
    delete attributesMap.textContent;
  }
  return extractNode(element);
}

function getAttributesMap() {
  return attributesMap;
}

function updateYAMLFiles() {
  try {
    oldAttributesMap = JSON.parse(JSON.stringify(attributesMap));
    // Remove $selector from attributesMap
    Object.keys(attributesMap).forEach((attr) => {
      if (attr !== "$selector") delete attributesMap[attr];
    });
    // Parse HTML content
    const htmlMockContent = fs.readFileSync(htmlMock, "utf-8");
    const htmlDevContent = fs.readFileSync(htmlDev, "utf-8");

    const domMock = new JSDOM(htmlMockContent);
    const domDev = new JSDOM(htmlDevContent);

    const mock = convertJsonToYaml(
      extractElementInfo(domMock.window.document.body)
    );
    const dev = convertJsonToYaml(
      extractElementInfo(domDev.window.document.body)
    );

    // Store results into yamlMock and yamlDev
    fs.writeFileSync(yamlMock, mock);
    fs.writeFileSync(yamlDev, dev);
  } catch (error) {
    console.error(error);
  }
}

function convertJsonToYaml(json) {
  try {
    return yaml.dump(json, { sortKeys: true });
  } catch (e) {
    console.error("Error converting JSON to YAML:", e);
    return null;
  }
}

module.exports = {
  compareHTML,
  getAttributesMap,
  updateYAMLFiles,
};
