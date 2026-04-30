import { Router } from "express";
import { client } from "../db.js";

import { validateTokenMid } from "../utils/authjws.js";
import { INDEX_ES_MAIN_LOGS } from "../config.js";
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

router.get("/logs", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN_LOGS,
      size: 100,
      body: {
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });
    return res.json(searchResult.body.hits.hits);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});
export default router;
