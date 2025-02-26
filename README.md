# JTool Extension

This extension provides tools for working with CSV and JSON files for internationalization, as well as comparing HTML file structures.

## Features

- Select a directory containing JSON files
- Import CSV file and apply to JSON files in the selected directory
- Export JSON files to a CSV file
- Compare HTML files structure

## Commands

- `JTool.selectDir`: Choose a directory containing JSON files
- `JTool.selectCSVFile`: Import a CSV file and apply to JSON files in the selected directory
- `JTool.exportCSVFile`: Export JSON files to a CSV file
- `JTool.compareHTMLStructure`: Compare two CSV files
- `JTool.compareHTMLFiles`: Compare the structure of two HTML files

## Tree View

The extension adds a tree view to the sidebar with the following structure:

- **CSV and JSON Operations**
  - Choose JSON Directory
  - Import CSV file
  - Export CSV file
- **Compare HTML Structure**
  - Compare HTML files

## Sample CSV

| key         | en         | es         | fr         |
|-------------|------------|------------|------------|
| greeting    | Hello      | Hola       | Bonjour    |
| farewell    | Goodbye    | Adiós      | Au revoir  |

## Locales Folder Structure

The generated JSON files will be organized in a folder structure like this:
```
locales/
  ├── en.json
  ├── es.json
  └── fr.json
```

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open the project in VSCode
4. Press `F5` to start debugging the extension

## Usage

1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
2. Run any of the commands listed above
3. Use the tree view in the sidebar to navigate and execute commands

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
