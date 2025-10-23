import crypto from "crypto";

export function generateToken(length: number): string {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        if (typeof byte === "undefined") continue;
        id += alphabet.charAt(byte >> 3);
    }
    return id;
}

export function hashToken(token: string): string {
    const sha256 = crypto.createHash("sha256");
    sha256.update(token);
    return sha256.digest("hex");
}

export function generateTokenHashPair(length: number): {
    token: string;
    tokenHash: string;
} {
    const token = generateToken(length);
    const tokenHash = hashToken(token);
    return { token, tokenHash };
}
