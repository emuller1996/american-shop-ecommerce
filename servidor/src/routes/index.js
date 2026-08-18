import { Router } from "express";
import { client } from "../db.js";

import { validateTokenMid } from "../utils/authjws.js";
import ProductosRouters from "../modules/productos/productoRoutes.js";
import CategoriasRouters from "../modules/categorias/categoriaRoutes.js";
import ClientesRouters from "../modules/clientes/clienteRoutes.js";
import AuthRouters from "../modules/auth/authRoutes.js";
import OrdenesRouters from "../modules/ordenes/ordenRoutes.js";
import ConsultasRouters from "../modules/consultas/consultaRoutes.js";
import UsuariosRouters from "../modules/usuarios/usuarioRoutes.js";
import PuntoVentaRouters from "../modules/puntoVenta/puntoVentaRoutes.js";
import PagosRouters from "../modules/pagos/pagoRoutes.js";
import ImagesRouters from "../modules/imagenes/imagenRoutes.js";
import MetricsRouters from "../modules/metrics/metricsRoutes.js";
import LogsRouters from "../modules/Modulelogs/logRoutes.js";

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/usuarios", validateTokenMid, UsuariosRouters);
router.use("/consultas", ConsultasRouters);
router.use("/categoria", CategoriasRouters);
router.use("/productos", ProductosRouters);
router.use("/images/", ImagesRouters);
router.use("/clientes/", ClientesRouters);
router.use("/auth", AuthRouters);
router.use("/ordenes", OrdenesRouters);
router.use("/punto_venta", PuntoVentaRouters);
router.use("/pagos", PagosRouters);
router.use("/metrics", validateTokenMid, MetricsRouters);
router.use("/logs", validateTokenMid, LogsRouters);



router.get("/test", async (req, res) => {
  try {
    /* const searchResult = await client.get({index:"test"}) */

    return res.json({ message: "ss", client /* searchResult */ });
  } catch (error) {
    return res.json({ message: "ss", error: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const searchResult = client;
    console.log(client);
    return res.json(client);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});

export default router;
