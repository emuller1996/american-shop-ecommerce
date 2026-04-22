import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class ConsultaService {
  async buscarConsultas() {
    return await buscarElasticByType("consulta");
  }

  async buscarConsultasPaginadas(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async obtenerConsultaPorId(id) {
    return await getDocumentById(id);
  }

  async obtenerDocumentoPorId(id) {
    return await getDocumentById(id);
  }

  async crearRespuesta(data) {
    return await crearElasticByType(data, "respuesta");
  }

  async actualizarConsulta(id, data) {
    return await updateElasticByType(id, data);
  }

  async buscarRespuestasPorConsulta(consultaId) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 9999,
      body: {
        query: {
          bool: {
            filter: [
              { term: { type: "respuesta" } },
              { term: { "consulta_id.keyword": consultaId } },
            ],
          },
        },
        sort: [{ createdTime: { order: "desc" } }],
      },
    });
    return searchResult.body.hits.hits;
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new ConsultaService();
