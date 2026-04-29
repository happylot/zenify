import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_PREFIX = "scrypt";
const KEY_LENGTH = 64;

function parsePasswordHash(hash: string) {
  const [algorithm, salt, derivedKey] = hash.split("$");

  if (algorithm !== SCRYPT_PREFIX || !salt || !derivedKey) {
    throw new Error("Invalid ADMIN_PASSWORD_HASH format. Use npm run admin:hash to generate one.");
  }

  return { salt, derivedKey };
}

export function createAdminPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${SCRYPT_PREFIX}$${salt}$${derivedKey}`;
}

export function isAdminLoginConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET,
  );
}

export function verifyAdminPassword(password: string, passwordHash: string) {
  const { salt, derivedKey } = parsePasswordHash(passwordHash);
  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(derivedKey, "hex");

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function verifyAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;

  if (!configuredEmail || !configuredHash) {
    return false;
  }

  if (email.toLowerCase() !== configuredEmail.toLowerCase()) {
    return false;
  }

  return verifyAdminPassword(password, configuredHash);
}
