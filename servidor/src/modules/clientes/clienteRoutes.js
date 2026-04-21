import { Router } from "express";
import {
  obtenerTodos,
  obtenerPaginados,
  obtenerComprasPorCliente,
  crear,
  actualizar,
  login,
  crearDireccion,
  actualizarDireccion,
  obtenerDireccionesPorCliente,
  obtenerComprasClienteAutenticado,
  obtenerCompraPorId,
} from "./clienteController.js";
import {
  validateTokenClient,
  validateTokenClientMid,
  validateTokenMid,
} from "../../utils/authjws.js";

const ClientesRouters = Router();

// Rutas admin (token admin)
ClientesRouters.get("/", validateTokenMid, obtenerTodos);
ClientesRouters.get("/pagination", validateTokenMid, obtenerPaginados);
ClientesRouters.get("/:id/shoppings", validateTokenMid, obtenerComprasPorCliente);

// Rutas públicas (registro / login)
ClientesRouters.post("/", crear);
ClientesRouters.post("/login", login);

// Validación de token de cliente
ClientesRouters.get("/validate", validateTokenClient);

// Rutas protegidas por token de cliente
ClientesRouters.put("/:id", validateTokenClientMid, actualizar);

// Direcciones del cliente autenticado
ClientesRouters.post("/new/address", validateTokenClientMid, crearDireccion);
ClientesRouters.put("/new/address/:idAddress", validateTokenClientMid, actualizarDireccion);
ClientesRouters.get("/get/address", validateTokenClientMid, obtenerDireccionesPorCliente);

// Compras del cliente autenticado
ClientesRouters.get("/get/shopping", validateTokenClientMid, obtenerComprasClienteAutenticado);
ClientesRouters.get("/get/shopping/:id", validateTokenClientMid, obtenerCompraPorId);

export default ClientesRouters;
