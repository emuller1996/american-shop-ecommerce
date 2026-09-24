import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class PublicacionService {
  async buscarPublicaciones() {
    return await buscarElasticByType("publicacion");
  }

  async buscarPublicacionesPublicadas() {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 50,
      body: {
        query: {
          bool: {
            filter: [{ term: { type: "publicacion" } }, { term: { published: true } }],
          },
        },
        sort: [
          { orden: { order: "asc", missing: "_last" } },
          { createdTime: { order: "asc" } },
        ],
      },
    });
    return searchResult.body.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));
  }

  async crearPublicacion(data) {
    return await crearElasticByType(data, "publicacion");
  }

  async actualizarPublicacion(id, data) {
    return await updateElasticByType(id, data);
  }

  async obtenerPublicacionPorId(id) {
    return await getDocumentById(id);
  }

  async eliminarPublicacion(id) {
    return await client.delete({
      index: INDEX_ES_MAIN,
      id,
    });
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new PublicacionService();
