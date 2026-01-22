import { ICodec } from '../interfaces/ICodec';

/**
 * Base64 Codec Implementation
 * Follows Single Responsibility Principle - only handles Base64 encoding/decoding
 * Follows Open/Closed Principle - can be extended without modification
 */
export class Base64Codec implements ICodec {
    /**
     * Encodes text to Base64
     * @param text - UTF-8 text to encode
     * @returns Base64 encoded string
     * @throws Error if encoding fails
     */
    encode(text: string): string {
        try {
            return Buffer.from(text, 'utf8').toString('base64');
        } catch (error) {
            throw new Error(`Failed to encode to Base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Decodes Base64 to text
     * @param text - Base64 encoded string
     * @returns Decoded UTF-8 text
     * @throws Error if decoding fails
     */
    decode(text: string): string {
        try {
            return Buffer.from(text, 'base64').toString('utf8');
        } catch (error) {
            throw new Error(`Failed to decode Base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
