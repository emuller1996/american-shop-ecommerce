import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { updateElasticByType } from "../../utils/index.js";

class AuthService {
  async actualizarPassword(id, password) {
    return await updateElasticByType(id, { password });
  }

  async buscarUsuarioPorEmail(email) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "usuario" } } },
              { term: { "email.keyword": { value: email } } },
            ],
          },
        },
        sort: [{ createdTime: { order: "asc" } }],
      },
    });

    return searchResult.body.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));
  }
}

export default new AuthService();
