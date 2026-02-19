import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class CategoriaService {
  async buscarCategorias() {
    return await buscarElasticByType("categoria");
  }

  async crearCategoria(data) {
    return await crearElasticByType(data, "categoria");
  }

  async actualizarCategoria(id, data) {
    return await updateElasticByType(id, data);
  }

  async obtenerCategoriaPorId(id) {
    return await getDocumentById(id);
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new CategoriaService();