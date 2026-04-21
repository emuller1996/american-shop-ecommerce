import jsonwebtoken from "jsonwebtoken";
import authService from "./authService.js";
import { SECRECT_CLIENT } from "../../config.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";

// Funciones auxiliares fuera de la clase
const generateAccessToken = (user) => {
  return jsonwebtoken.sign(user, SECRECT_CLIENT, { expiresIn: "480m" });
};

const INVALID_CREDENTIALS_MESSAGE = "Credenciales inválidas.";

// Controladores principales
export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    const usuarios = await authService.buscarUsuarioPorEmail(email);
    const usuario = usuarios[0];

    const { valid, needsRehash } = usuario
      ? await verifyPassword(password, usuario.password ?? "")
      : { valid: false, needsRehash: false };

    // Mismo mensaje para "no existe" y "contraseña incorrecta" para evitar enumeración.
    if (!valid) {
      return res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
    }

    // Migración transparente md5 → bcrypt: si el password todavía está en md5,
    // se reemplaza por un bcrypt en el mismo login. No bloquea la respuesta si falla.
    if (needsRehash) {
      try {
        const newHash = await hashPassword(password);
        await authService.actualizarPassword(usuario._id, newHash);
      } catch (err) {
        console.error("[auth/login] fallo al re-hashear password:", err.message);
      }
    }

    const { password: _pw, hash: _h, ...userData } = usuario;
    const token = generateAccessToken(userData);

    return res.json({ message: "Login exitoso.", token });
  } catch (error) {
    console.error("[auth/login] error:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
