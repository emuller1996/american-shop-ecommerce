import { Router } from "express";
import {
  obtenerTodos,
  obtenerPaginados,
  obtenerPorId,
  crearRespuesta,
  obtenerRespuestasPorConsulta,
  actualizar,
} from "./consultaController.js";

const ConsultasRouters = Router();

// Listado
ConsultasRouters.get("/", obtenerTodos);
ConsultasRouters.get("/pagination", obtenerPaginados);

// Respuestas
ConsultasRouters.post("/respuesta", crearRespuesta);
ConsultasRouters.get("/:id/respuesta", obtenerRespuestasPorConsulta);

// Detalle y actualización
ConsultasRouters.get("/:id", obtenerPorId);
ConsultasRouters.put("/:id", actualizar);

export default ConsultasRouters;
