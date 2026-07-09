export function toBase64Url(input: bigint) {
   return Buffer.from(BigUint64Array.from([input]).buffer)
      .toBase64()
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
}
