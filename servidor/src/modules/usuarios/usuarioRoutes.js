import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  cambiarPassword,
} from "./usuarioController.js";

const UsuariosRouters = Router();

// Listado y detalle
UsuariosRouters.get("/", obtenerTodos);
UsuariosRouters.get("/:id", obtenerPorId);

// Creación
UsuariosRouters.post("/", crear);

// Cambio de contraseña
UsuariosRouters.patch("/:id/change_password", cambiarPassword);

export default UsuariosRouters;
