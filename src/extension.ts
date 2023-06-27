import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as ncp from "ncp";

function generateTemplateFiles(outputPath: string) {
  const templatePath = path.join(__dirname, "..", "templates");

  // Read the template manifest file
  const templateManifestPath = path.join(templatePath, "manifest.json");
  const templateManifest = fs.readFileSync(templateManifestPath, "utf8");

  // Replace any placeholders or variables in the template manifest
  const generatedManifest = templateManifest
    .replace("{{extensionName}}", "My Extension")
    .replace("{{version}}", "1.0.0")
    .replace("{{description}}", "My extension description");

  // Create a subdirectory in the output path
  const outputDirectory = path.join(outputPath, "chrome-extension-template");
  fs.mkdirSync(outputDirectory);

  // Write the generated manifest file to the output directory
  const outputManifestPath = path.join(outputDirectory, "manifest.json");
  fs.writeFileSync(outputManifestPath, generatedManifest, "utf8");

  // Copy other template files using ncp
  ncp(templatePath, outputDirectory, (err: Error[] | null) => {
    if (err && err.length > 0) {
      const errorMessage = err.map((error) => error.message).join("\n");
      vscode.window.showErrorMessage(
        `Error copying template files:\n${errorMessage}`
      );
    } else {
      vscode.window.showInformationMessage(
        "Chrome Extension template files generated successfully!"
      );
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.generateChromeExtensionTemplate",
    () => {
      const outputPath = vscode.workspace.rootPath;

      if (!outputPath) {
        vscode.window.showErrorMessage(
          "Unable to determine the workspace root path."
        );
        return;
      }

      // Generate template files
      generateTemplateFiles(outputPath);
    }
  );

  context.subscriptions.push(disposable);

  // Register a keybinding for the command
  const keybinding = vscode.commands.registerTextEditorCommand(
    "extension.generateChromeExtensionTemplateFromShortcut",
    () => {
      vscode.commands.executeCommand(
        "extension.generateChromeExtensionTemplate"
      );
    }
  );

  context.subscriptions.push(keybinding);

  // Register a completion item for ">generate"
  const completionItem = new vscode.CompletionItem(
    ">generate",
    vscode.CompletionItemKind.Keyword
  );
  completionItem.command = {
    title: "Generate Chrome Extension Template",
    command: "extension.generateChromeExtensionTemplate",
  };
  const triggerCharacters = [">", "g", "e", "n", "r", "a", "t"];
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: "file" },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        const lineText = document.lineAt(position).text;
        if (lineText.trim() === ">generate") {
          return [completionItem];
        }
        return undefined;
      },
      resolveCompletionItem(item: vscode.CompletionItem) {
        return item;
      },
    },
    ...triggerCharacters
  );

  context.subscriptions.push(completionProvider);
}

export function deactivate() {}
