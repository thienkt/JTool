# CSV-i18n README

## Overview

The `CSV-i18n` extension is a tool designed to simplify the process of internationalizing your application. It allows you to manage your translation strings in a CSV file and generate the necessary JSON localization files for your project.

## Features

- Import translation strings from a CSV file.
- Generate JSON localization files.
- Support for multiple languages.
- Easy integration with existing projects.

## Sample CSV

| key         | en         | es         | fr         |
|-------------|------------|------------|------------|
| greeting    | Hello      | Hola       | Bonjour    |
| farewell    | Goodbye    | Adiós      | Au revoir  |

## Locales Folder Structure

The generated JSON files will be organized in a folder structure like this:

locales/
  ├── en.json
  ├── es.json
  └── fr.json
  