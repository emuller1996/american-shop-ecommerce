import crypto from "crypto";
import bcrypt from "bcryptjs";
import md5 from "md5";

const BCRYPT_ROUNDS = 10;
const BCRYPT_RE = /^\$2[aby]?\$\d{2}\$/;
const MD5_RE = /^[a-f0-9]{32}$/i;

// Hash nuevo. Siempre bcrypt con salt.
export async function hashPassword(plain) {
  if (typeof plain !== "string" || plain.length === 0) {
    throw new Error("password requerido");
  }
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

// Compara en tiempo constante. Solo necesario para el camino md5 legacy
// porque bcrypt.compare ya es timing-safe.
function timingSafeStringEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Verifica un password contra el hash almacenado.
// Soporta bcrypt (nuevos) y md5 (legacy). Si el usuario todavía tiene md5 y
// la contraseña es correcta, devuelve needsRehash=true para que el caller
// actualice el documento a bcrypt de forma transparente.
export async function verifyPassword(plain, stored) {
  if (typeof plain !== "string" || typeof stored !== "string" || !stored) {
    return { valid: false, needsRehash: false };
  }

  if (BCRYPT_RE.test(stored)) {
    const valid = await bcrypt.compare(plain, stored);
    return { valid, needsRehash: false };
  }

  if (MD5_RE.test(stored)) {
    const valid = timingSafeStringEqual(md5(plain), stored);
    return { valid, needsRehash: valid };
  }

  return { valid: false, needsRehash: false };
}
