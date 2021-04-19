import * as BufferLayout from "buffer-layout";

/**
 * Layout for a public key
 */
export const publicKey = (property: string = "publicKey"): Object => {
  return BufferLayout.blob(32, property);
};

/**
 * Layout for a 64bit unsigned value
 */
export const uint64 = (property: string = "uint64"): Object => {
  return BufferLayout.blob(8, property);
};

export const TokenSwapLayoutLegacyV0 = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("nonce"),
  publicKey("tokenAccountA"),
  publicKey("tokenAccountB"),
  publicKey("tokenPool"),
  uint64("feesNumerator"),
  uint64("feesDenominator"),
]);
