import { Router } from "express";
import {
  obtenerTodas,
  crear,
  actualizar,
  obtenerPorId, // Opcional, descomentar si se necesita
} from "./categoriaController.js";
import { validateTokenMid } from "../../utils/authjws.js";

const CategoriasRouters = Router();

// Rutas públicas
CategoriasRouters.get("/", obtenerTodas);

// Rutas protegidas (requieren token)
CategoriasRouters.post("/", validateTokenMid, crear);
CategoriasRouters.put("/:id", validateTokenMid, actualizar);

// Ruta opcional por ID (comentada en tu código original)
// CategoriasRouters.get("/:id", obtenerPorId);

export default CategoriasRouters;