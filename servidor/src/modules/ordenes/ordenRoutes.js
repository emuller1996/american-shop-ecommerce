import { Router } from "express";
import {
  procesarPago,
  crearOrdenNequi,
  actualizar,
  obtenerPaginados,
  obtenerPorId,
  webhookMercadoPago,
  productPack,
  generarFirmaWompi,
  crearOrdenWompi,
  webhookWompi,
} from "./ordenController.js";

const OrdenesRouters = Router();

// Pagos y webhooks de Mercado Pago
OrdenesRouters.post("/process_payment", procesarPago);
OrdenesRouters.post("/nequi_payment", crearOrdenNequi);
OrdenesRouters.post("/webhooks", webhookMercadoPago);

// Pagos y webhooks de Wompi
OrdenesRouters.post("/wompi_signature", generarFirmaWompi);
OrdenesRouters.post("/wompi_payment", crearOrdenWompi);
OrdenesRouters.post("/wompi_webhooks", webhookWompi);

// Listado y detalle
OrdenesRouters.get("/pagination", obtenerPaginados);
OrdenesRouters.get("/:id", obtenerPorId);
OrdenesRouters.post("/:id/pack-product", productPack);

// Actualización
OrdenesRouters.put("/:id", actualizar);

export default OrdenesRouters;
