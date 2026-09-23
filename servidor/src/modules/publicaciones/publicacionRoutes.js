import { Router } from "express";
import {
  obtenerTodas,
  obtenerPublicadas,
  crear,
  actualizar,
  eliminar,
} from "./publicacionController.js";
import { validateTokenMid } from "../../utils/authjws.js";

const PublicacionesRouters = Router();

// Rutas públicas
PublicacionesRouters.get("/", obtenerTodas);
PublicacionesRouters.get("/publicadas", obtenerPublicadas);

// Rutas protegidas (requieren token de admin)
PublicacionesRouters.post("/", validateTokenMid, crear);
PublicacionesRouters.put("/:id", validateTokenMid, actualizar);
PublicacionesRouters.delete("/:id", validateTokenMid, eliminar);

export default PublicacionesRouters;
