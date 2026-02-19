import { Router } from "express";
import {
  obtenerTodos,
  obtenerPaginados,
  obtenerPublicados,
  obtenerPorId,
  crear,
  actualizar,
  agregarStock,
  obtenerStock,
  obtenerLogsStock,
  actualizarStock,
  validarStock,
  agregarImagen,
  obtenerImagenes,
  crearConsulta,
  obtenerConsultas,
  importarDesdeExcel,
} from "./productoController.js";
import {
  validateTokenClientMid,
  validateTokenMid,
} from "../../utils/authjws.js";

const ProductosRouters = Router();

// Rutas principales
ProductosRouters.get("/", obtenerTodos);
ProductosRouters.get("/pagination", validateTokenMid, obtenerPaginados);
ProductosRouters.get("/published", obtenerPublicados);
ProductosRouters.get("/:id", obtenerPorId);

ProductosRouters.post("/", validateTokenMid, crear);
ProductosRouters.put("/:id", validateTokenMid, actualizar);

// Rutas de stock
ProductosRouters.post("/:id/stock", agregarStock);
ProductosRouters.get("/:id/stock", obtenerStock);
ProductosRouters.get("/:id/stock/logs", obtenerLogsStock);
ProductosRouters.put("/stock/:idStock", actualizarStock);
ProductosRouters.post("/stock/:idStock/validate", validarStock);

// Rutas de imágenes
ProductosRouters.post("/:id/images", agregarImagen);
ProductosRouters.get("/:id/images", obtenerImagenes);

// Rutas de consultas
ProductosRouters.post("/:id/consultas", validateTokenClientMid, crearConsulta);
ProductosRouters.get("/:id/consultas", obtenerConsultas);

// Ruta de importación
ProductosRouters.post("/import-excel", importarDesdeExcel);

export default ProductosRouters;
