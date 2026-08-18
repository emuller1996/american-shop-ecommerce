import { client } from "../../db.js";
import { INDEX_ES_MAIN_LOGS } from "../../config.js";

class LogService {
  async registrarPeticion(entry) {
    return await client.index({
      index: INDEX_ES_MAIN_LOGS,
      body: { ...entry, type: "log", createdTime: Date.now() },
    });
    // Sin refresh: se aplica a casi todas las peticiones; forzarlo en cada una
    // degradaría el rendimiento. El refresh automático de ES (~1s) es suficiente.
  }

  async buscarLogsPaginado({ perPage = 10, page = 1, search = "", method = "" }) {
    const consulta = {
      index: INDEX_ES_MAIN_LOGS,
      size: Number(perPage),
      from: (Number(page) - 1) * Number(perPage),
      body: {
        query: { bool: { must: [], filter: [] } },
        sort: [{ createdTime: { order: "desc" } }],
      },
    };

    if (method) {
      consulta.body.query.bool.filter.push({ term: { "method.keyword": method } });
    }
    if (search) {
      consulta.body.query.bool.must.push({
        query_string: { query: `*${search}*`, fields: ["endpoint", "ip", "description"] },
      });
    }
    if (!consulta.body.query.bool.must.length) {
      consulta.body.query.bool.must.push({ match_all: {} });
    }

    const searchResult = await client.search(consulta);
    const data = searchResult.body.hits.hits.map((h) => ({ ...h._source, _id: h._id }));

    return {
      data,
      total: searchResult.body.hits.total.value,
      total_pages: Math.ceil(searchResult.body.hits.total.value / perPage),
    };
  }
}

export default new LogService();
