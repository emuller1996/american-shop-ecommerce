import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
} from "../../utils/index.js";

class ClienteService {
  async buscarClientes() {
    return await buscarElasticByType("cliente");
  }

  async buscarClientesPaginados(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async buscarClientePorEmail(email) {
    return await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { type: { value: "cliente" } } },
              { term: { "email_client.keyword": { value: email } } },
            ],
          },
        },
      },
    });
  }

  async crearCliente(data) {
    return await crearElasticByType(data, "cliente");
  }

  async actualizarCliente(id, data) {
    return await updateElasticByType(id, data);
  }

  async actualizarHashCliente(id, hash) {
    return await updateElasticByType(id, { hash });
  }

  async obtenerClientePorId(id) {
    return await getDocumentById(id);
  }

  async obtenerDocumentoPorId(id) {
    return await getDocumentById(id);
  }

  async buscarComprasPorCliente(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async crearDireccion(data) {
    return await crearElasticByType(data, "direccion_cliente");
  }

  async actualizarDireccion(id, data) {
    return await updateElasticByType(id, data);
  }

  async buscarDireccionesPorCliente(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new ClienteService();
