import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function generateTemplateFiles(outputPath: string) {
  const templatePath = path.join(__dirname, '..', 'templates');

  // Read the template manifest file
  const templateManifestPath = path.join(templatePath, 'manifest.json');
  const templateManifest = fs.readFileSync(templateManifestPath, 'utf8');

  // Replace any placeholders or variables in the template manifest
  const generatedManifest = templateManifest
    .replace('{{extensionName}}', 'My Extension')
    .replace('{{version}}', '1.0.0')
    .replace('{{description}}', 'My extension description');

  // Write the generated manifest file to the output directory
  const outputManifestPath = path.join(outputPath, 'manifest.json');
  fs.writeFileSync(outputManifestPath, generatedManifest, 'utf8');

  // Copy other template files if needed
  // fs.copyFileSync(srcPath, destPath);
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.generateChromeExtensionTemplate', () => {
    const outputPath = vscode.workspace.rootPath;

    if (!outputPath) {
      vscode.window.showErrorMessage('Unable to determine the workspace root path.');
      return;
    }

    // Generate template files
    generateTemplateFiles(outputPath);

    // Show a notification
    vscode.window.showInformationMessage('Chrome Extension template files generated successfully!');
	
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
