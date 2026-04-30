import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
} from "./puntoVentaController.js";

const PuntoVentaRouters = Router();

// Listado y detalle
PuntoVentaRouters.get("/", obtenerTodos);
PuntoVentaRouters.get("/:id", obtenerPorId);

// Creación y actualización
PuntoVentaRouters.post("/", crear);
PuntoVentaRouters.patch("/:id", actualizar);

export default PuntoVentaRouters;
