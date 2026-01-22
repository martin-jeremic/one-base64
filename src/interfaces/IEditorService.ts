/**
 * Interface for editor operations
 * Follows Dependency Inversion Principle - depend on abstraction
 */
export interface IEditorService {
    getSelectedText(): string | null;
    replaceSelection(text: string): void;
    isEditorActive(): boolean;
}
