import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class UsuarioService {
  async buscarUsuarios() {
    return await buscarElasticByType("usuario");
  }

  async obtenerUsuarioPorId(id) {
    return await getDocumentById(id);
  }

  async crearUsuario(data) {
    return await crearElasticByType(data, "usuario");
  }

  async actualizarPassword(id, password) {
    return await updateElasticByType(id, { password });
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new UsuarioService();
