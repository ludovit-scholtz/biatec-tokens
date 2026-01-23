import { describe, it, expect } from 'vitest';
import { formatAddress, isValidAlgorandAddress } from './address';

describe('Address Utilities', () => {
  describe('formatAddress', () => {
    it('should shorten a long Algorand address', () => {
      const address = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const result = formatAddress(address);
      
      expect(result).toBe('ABCDEF...VWXYZ');
    });

    it('should return original address if it is short', () => {
      const address = 'ABCD';
      const result = formatAddress(address);
      
      expect(result).toBe('ABCD');
    });

    it('should handle empty string', () => {
      const result = formatAddress('');
      
      expect(result).toBe('');
    });

    it('should allow custom start and end lengths', () => {
      const address = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const result = formatAddress(address, 4, 4);
      
      expect(result).toBe('ABCD...WXYZ');
    });
  });

  describe('isValidAlgorandAddress', () => {
    it('should return true for a properly formatted address', () => {
      // Algorand address is 58 characters long with valid base32 chars
      const validAddress = 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A';
      const result = isValidAlgorandAddress(validAddress);
      
      expect(result).toBe(true);
    });

    it('should return false for an address that is too short', () => {
      const shortAddress = 'ABCDEF';
      const result = isValidAlgorandAddress(shortAddress);
      
      expect(result).toBe(false);
    });

    it('should return false for an address that is too long', () => {
      const longAddress = 'A'.repeat(60);
      const result = isValidAlgorandAddress(longAddress);
      
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = isValidAlgorandAddress('');
      
      expect(result).toBe(false);
    });

    it('should return false for address with invalid characters', () => {
      const invalidAddress = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567!@#$%^&*()_+ABCDEFGHIJ';
      const result = isValidAlgorandAddress(invalidAddress);
      
      expect(result).toBe(false);
    });
  });
});
