import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class PuntoVentaService {
  async buscarPuntosVenta() {
    return await buscarElasticByType("punto_venta");
  }

  async obtenerPuntoVentaPorId(id) {
    return await getDocumentById(id);
  }

  async crearPuntoVenta(data) {
    return await crearElasticByType(data, "punto_venta");
  }

  async actualizarPuntoVenta(id, data) {
    return await updateElasticByType(id, data);
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new PuntoVentaService();
