/**
 * Formats an Algorand address to a shortened version for display
 * @param address - The full Algorand address
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 5)
 * @returns The formatted address
 */
export function formatAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 5
): string {
  if (!address || address.length <= startLength + endLength) {
    return address;
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Validates if a string is a valid Algorand address
 * @param address - The address to validate
 * @returns True if valid, false otherwise
 */
export function isValidAlgorandAddress(address: string): boolean {
  if (!address) {
    return false;
  }

  // Algorand addresses are 58 characters long
  if (address.length !== 58) {
    return false;
  }

  // Algorand addresses use base32 encoding (A-Z, 2-7)
  const validChars = /^[A-Z2-7]+$/;
  return validChars.test(address);
}
