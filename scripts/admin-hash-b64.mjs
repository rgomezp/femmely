import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd) {
  console.error("Usage: yarn admin:hash-b64 <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 10);
const b64 = Buffer.from(hash, "utf8").toString("base64");
console.log("Add this line to .env.local (avoids Next.js mangling $ in bcrypt hashes):");
console.log(`ADMIN_PASSWORD_HASH_B64=${b64}`);
console.log("(Remove or clear ADMIN_PASSWORD_HASH when using B64.)");
