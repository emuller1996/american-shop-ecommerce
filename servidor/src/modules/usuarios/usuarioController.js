import usuarioService from "./usuarioService.js";
import { hashPassword } from "../../utils/password.js";

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    const data = await usuarioService.buscarUsuarios();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = { ...req.body };

    if (typeof data.password !== "string" || !data.password) {
      return res.status(400).json({ message: "password requerido." });
    }

    data.password = await hashPassword(data.password);
    await usuarioService.crearUsuario(data);

    delete data.password;
    return res.status(201).json({ message: "Usuario Creado.", recinto: {}, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const data = req.body;

    if (typeof data.password !== "string" || !data.password) {
      return res.status(400).json({ message: "password requerido." });
    }

    const password = await hashPassword(data.password);
    const r = await usuarioService.actualizarPassword(req.params.id, password);

    if (r.body.result === "updated") {
      return res.json({ message: "Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
