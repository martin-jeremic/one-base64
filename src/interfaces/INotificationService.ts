/**
 * Interface for notification service
 * Follows Dependency Inversion Principle
 */
export interface INotificationService {
    showError(message: string): void;
    showWarning(message: string): void;
    showInfo(message: string): void;
}
