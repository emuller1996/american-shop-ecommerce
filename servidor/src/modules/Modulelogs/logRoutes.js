import { Router } from "express";
import { obtenerPaginados } from "./logController.js";

const LogsRouters = Router();
LogsRouters.get("/pagination", obtenerPaginados);

export default LogsRouters;
