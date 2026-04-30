import { Router } from "express";
import { obtenerTodos } from "./pagoController.js";

const PagosRouters = Router();

PagosRouters.get("/", obtenerTodos);

export default PagosRouters;
