export function generateByteString(length: number): `0x${string}` {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}` as `0x${string}`;
}

export function getByteLength(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * Converts a number to a big-endian uint64 representation as hex string
 * @param value The value to convert (can be number or bigint)
 * @returns A hex string representing the big-endian uint64
 */
export const convertToBigEndianUint64Hex = (value: number | bigint): string => {
  // Convert to BigInt if not already
  let bigIntValue = typeof value === "number" ? BigInt(value) : value;

  // Check if the value fits in uint64 (0 to 2^64-1)
  if (bigIntValue < 0n || bigIntValue > 18446744073709551615n) {
    throw new Error("Value out of range for uint64");
  }

  // Create a hex string with proper padding to 16 characters (8 bytes)
  let hexString = bigIntValue.toString(16).padStart(16, "0");

  return `0x${hexString}`;
};

// Convert amount to little-endian uint64 (required by EIP-7002)
export const convertToLittleEndianUint64Hex = (value: bigint): string => {
  // Check if the value fits in uint64
  if (value < 0n || value > 18446744073709551615n) {
    throw new Error("Value out of range for uint64");
  }

  // Create a buffer for uint64
  const buffer = new Uint8Array(8);
  let tempValue = value;

  // Fill buffer with little-endian bytes
  for (let i = 0; i < 8; i++) {
    buffer[i] = Number(tempValue & 255n);
    tempValue >>= 8n;
  }

  // Convert to hex string
  return (
    "0x" +
    Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
};
