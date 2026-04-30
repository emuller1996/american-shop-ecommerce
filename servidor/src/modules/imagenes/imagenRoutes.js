import { Router } from "express";
import { obtenerImagenPorProducto } from "./imagenController.js";

const ImagesRouters = Router();

ImagesRouters.get("/:id", obtenerImagenPorProducto);

export default ImagesRouters;
