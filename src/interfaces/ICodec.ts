/**
 * Interface for encoding operations
 * Follows Interface Segregation Principle - specific to encoding
 */
export interface IEncoder {
    encode(text: string): string;
}

/**
 * Interface for decoding operations
 * Follows Interface Segregation Principle - specific to decoding
 */
export interface IDecoder {
    decode(text: string): string;
}

/**
 * Combined interface for codecs that support both operations
 */
export interface ICodec extends IEncoder, IDecoder {}
