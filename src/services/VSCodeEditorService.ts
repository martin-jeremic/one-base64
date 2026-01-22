import * as vscode from 'vscode';
import { IEditorService } from '../interfaces/IEditorService';

/**
 * VS Code Editor Service Implementation
 * Follows Single Responsibility Principle - only handles editor operations
 * Follows Dependency Inversion Principle - implements interface
 */
export class VSCodeEditorService implements IEditorService {
    /**
     * Gets currently selected text from active editor
     * @returns Selected text or null if no selection
     */
    getSelectedText(): string | null {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return null;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        return text || null;
    }

    /**
     * Replaces current selection with new text
     * @param text - Text to replace selection with
     */
    replaceSelection(text: string): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        editor.edit(editBuilder => {
            editBuilder.replace(selection, text);
        });
    }

    /**
     * Checks if there's an active text editor
     * @returns true if editor is active
     */
    isEditorActive(): boolean {
        return vscode.window.activeTextEditor !== undefined;
    }
}
