import md5 from "md5";
import jsonwebtoken from "jsonwebtoken";
import authService from "./authService.js";
import { SECRECT_CLIENT } from "../../config.js";

// Funciones auxiliares fuera de la clase
const generateAccessToken = (user) => {
  return jsonwebtoken.sign(user, SECRECT_CLIENT, { expiresIn: "480m" });
};

// Controladores principales
export const login = async (req, res) => {
  try {
    const dataFuncion = await authService.buscarUsuarioPorEmail(req.body.email);

    if (dataFuncion.length === 0) {
      return res.status(400).json({ message: "Usuario no registrado." });
    }

    const passtest = md5(req.body.password);
    if (passtest !== dataFuncion[0].password) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    const userData = dataFuncion[0];
    delete userData.password;
    const token = generateAccessToken(userData);

    return res.json({ message: "TEst", dataFuncion, passtest, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
