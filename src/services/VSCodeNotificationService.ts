import * as vscode from 'vscode';
import { INotificationService } from '../interfaces/INotificationService';

/**
 * VS Code Notification Service Implementation
 * Follows Single Responsibility Principle - only handles notifications
 * Follows Dependency Inversion Principle - implements interface
 */
export class VSCodeNotificationService implements INotificationService {
    /**
     * Shows error message to user
     * @param message - Error message to display
     */
    showError(message: string): void {
        vscode.window.showErrorMessage(message);
    }

    /**
     * Shows warning message to user
     * @param message - Warning message to display
     */
    showWarning(message: string): void {
        vscode.window.showWarningMessage(message);
    }

    /**
     * Shows informational message to user
     * @param message - Info message to display
     */
    showInfo(message: string): void {
        vscode.window.showInformationMessage(message);
    }
}
