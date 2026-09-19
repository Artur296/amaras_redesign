// Prints the value for the ADMIN_PASSWORD_HASH environment variable.
// Usage: node scripts/hash-password.mjs "your new password"
import { scryptSync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Usage: node scripts/hash-password.mjs "your new password"');
  console.error("The password must be at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log("\nSet this in Vercel as ADMIN_PASSWORD_HASH:\n");
console.log(`${salt}:${hash}\n`);
