import { ICodec } from '../interfaces/ICodec';
import { IEditorService } from '../interfaces/IEditorService';
import { INotificationService } from '../interfaces/INotificationService';

/**
 * Abstract base class for text transformation commands
 * Follows Single Responsibility Principle - handles command execution flow
 * Follows Open/Closed Principle - open for extension via inheritance
 * Follows Template Method pattern
 */
export abstract class TextTransformCommand {
    protected constructor(
        protected readonly editorService: IEditorService,
        protected readonly notificationService: INotificationService
    ) {}

    /**
     * Template method for executing command
     * Defines the algorithm structure, delegates specifics to subclasses
     */
    execute(): void {
        // Step 1: Validate editor state
        if (!this.editorService.isEditorActive()) {
            this.notificationService.showError('No active editor');
            return;
        }

        // Step 2: Get selected text
        const selectedText = this.editorService.getSelectedText();
        if (!selectedText) {
            this.notificationService.showWarning(this.getEmptySelectionMessage());
            return;
        }

        // Step 3: Transform text
        try {
            const transformed = this.transform(selectedText);
            
            // Step 4: Replace selection
            this.editorService.replaceSelection(transformed);
            
            // Step 5: Show success message
            this.notificationService.showInfo(this.getSuccessMessage());
        } catch (error) {
            this.notificationService.showError(
                `${this.getErrorPrefix()}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Abstract method to be implemented by subclasses
     * Performs the actual text transformation
     */
    protected abstract transform(text: string): string;

    /**
     * Message shown when no text is selected
     */
    protected abstract getEmptySelectionMessage(): string;

    /**
     * Message shown on successful transformation
     */
    protected abstract getSuccessMessage(): string;

    /**
     * Error message prefix
     */
    protected abstract getErrorPrefix(): string;
}

/**
 * Encode command implementation
 * Follows Single Responsibility Principle - only handles encoding
 * Follows Liskov Substitution Principle - can replace base class
 */
export class EncodeCommand extends TextTransformCommand {
    constructor(
        private readonly codec: ICodec,
        editorService: IEditorService,
        notificationService: INotificationService
    ) {
        super(editorService, notificationService);
    }

    protected transform(text: string): string {
        return this.codec.encode(text);
    }

    protected getEmptySelectionMessage(): string {
        return 'Please select text to encode';
    }

    protected getSuccessMessage(): string {
        return 'Text encoded to Base64';
    }

    protected getErrorPrefix(): string {
        return 'Encoding failed';
    }
}

/**
 * Decode command implementation
 * Follows Single Responsibility Principle - only handles decoding
 * Follows Liskov Substitution Principle - can replace base class
 */
export class DecodeCommand extends TextTransformCommand {
    constructor(
        private readonly codec: ICodec,
        editorService: IEditorService,
        notificationService: INotificationService
    ) {
        super(editorService, notificationService);
    }

    protected transform(text: string): string {
        return this.codec.decode(text);
    }

    protected getEmptySelectionMessage(): string {
        return 'Please select Base64 text to decode';
    }

    protected getSuccessMessage(): string {
        return 'Base64 decoded to text';
    }

    protected getErrorPrefix(): string {
        return 'Decoding failed';
    }
}
