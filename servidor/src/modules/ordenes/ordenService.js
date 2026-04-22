import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class OrdenService {
  async buscarOrdenesPaginadas(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async obtenerOrdenPorId(id) {
    return await getDocumentById(id);
  }

  async obtenerDocumentoPorId(id) {
    return await getDocumentById(id);
  }

  async crearOrden(data) {
    return await crearElasticByType(data, "orden");
  }

  async actualizarOrden(id, data) {
    return await updateElasticByType(id, data);
  }

  async crearPago(data) {
    return await crearElasticByType(data, "pago");
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new OrdenService();
