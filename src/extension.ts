import * as vscode from 'vscode';
import { Base64Codec } from './services/Base64Codec';
import { VSCodeEditorService } from './services/VSCodeEditorService';
import { VSCodeNotificationService } from './services/VSCodeNotificationService';
import { EncodeCommand, DecodeCommand } from './commands/TextTransformCommand';

/**
 * Extension activation entry point
 * Follows Dependency Injection pattern
 * Follows Single Responsibility Principle - only handles setup
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('One Base64 extension activated');

    // Dependency Injection - create service instances
    const codec = new Base64Codec();
    const editorService = new VSCodeEditorService();
    const notificationService = new VSCodeNotificationService();

    // Create command instances with injected dependencies
    const encodeCommand = new EncodeCommand(codec, editorService, notificationService);
    const decodeCommand = new DecodeCommand(codec, editorService, notificationService);

    // Register commands with VS Code
    const encodeDisposable = vscode.commands.registerCommand(
        'base64Encoder.encode',
        () => encodeCommand.execute()
    );

    const decodeDisposable = vscode.commands.registerCommand(
        'base64Encoder.decode',
        () => decodeCommand.execute()
    );

    // Add to subscriptions for proper cleanup
    context.subscriptions.push(encodeDisposable, decodeDisposable);
}

/**
 * Extension deactivation cleanup
 */
export function deactivate(): void {
    console.log('One Base64 extension deactivated');
}
