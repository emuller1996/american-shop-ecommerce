import { Router } from "express";
import {
  procesarPago,
  actualizar,
  obtenerPaginados,
  obtenerPorId,
  webhookMercadoPago,
} from "./ordenController.js";

const OrdenesRouters = Router();

// Pagos y webhooks de Mercado Pago
OrdenesRouters.post("/process_payment", procesarPago);
OrdenesRouters.post("/webhooks", webhookMercadoPago);

// Listado y detalle
OrdenesRouters.get("/pagination", obtenerPaginados);
OrdenesRouters.get("/:id", obtenerPorId);

// Actualización
OrdenesRouters.put("/:id", actualizar);

export default OrdenesRouters;
