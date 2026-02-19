import { INDEX_ES_MAIN } from "../../config.js";
import { client } from "../../db.js";
import {
  buscarElasticByType,
  crearElasticByType,
  updateElasticByType,
  getDocumentById,
  createInMasaDocumentByType,
} from "../../utils/index.js";

class ProductoService {
  async buscarProductos() {
    return await buscarElasticByType("producto");
  }

  async buscarProductosPaginados(consulta) {
    const searchResult = await client.search(consulta);
    return searchResult.body;
  }

  async crearProducto(data) {
    return await crearElasticByType(data, "producto");
  }

  async actualizarProducto(id, data) {
    return await updateElasticByType(id, data);
  }

  async obtenerProductoPorId(id) {
    return await getDocumentById(id);
  }

  async obtenerCategoria(categoryId) {
    return categoryId ? await getDocumentById(categoryId) : "";
  }

  async obtenerImagen(imageId) {
    const temp = await getDocumentById(imageId);
    return temp.image;
  }

  async crearStock(dataStock) {
    return await crearElasticByType(dataStock, "stock");
  }

  async crearImagen(imageData) {
    return await crearElasticByType(imageData, "imagen");
  }

  async crearConsulta(consultaData) {
    return await crearElasticByType(consultaData, "consulta");
  }

  async crearProductLog(logData) {
    return await crearElasticByType(logData, "product_log");
  }

  async buscarStockPorProductoYTalla(productId, size) {
    return await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "stock" } } },
              { term: { product_id: { value: productId } } },
              { term: { "size.keyword": { value: size } } },
            ],
          },
        },
      },
    });
  }

  async buscarImagenesPorProducto(productId) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "imagen" } } },
              { term: { "product_id.keyword": { value: productId } } },
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

  async buscarConsultasPorProducto(productId) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "consulta" } } },
              { term: { product_id: { value: productId } } },
              { terms: { status: ["pending", "completed"] } },
            ],
          },
        },
        sort: [{ createdTime: { order: "desc" } }],
      },
    });
    return searchResult.body.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));
  }

  async buscarRespuestasPorConsulta(consultaId) {
    const consulta = {
      index: INDEX_ES_MAIN,
      size: 9999,
      body: {
        query: {
          bool: {
            filter: [
              { term: { "type.keyword": "respuesta" } },
              { term: { "consulta_id.keyword": consultaId } },
            ],
          },
        },
        sort: [{ createdTime: { order: "desc" } }],
      },
    };
    const searchResult = await client.search(consulta);
    return searchResult.body.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));
  }

  async buscarStockPorProducto(productId) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "stock" } } },
              { term: { "product_id.keyword": { value: productId } } },
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

  async buscarLogsPorProducto(productId) {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { term: { "type.keyword": { value: "product_log" } } },
              { term: { "product_id.keyword": { value: productId } } },
            ],
          },
        },
        sort: [{ createdTime: { order: "desc" } }],
      },
    });
    return searchResult.body.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));
  }

  async obtenerStockPorId(idStock) {
    return await getDocumentById(idStock);
  }

  async actualizarStock(idStock, data) {
    return await updateElasticByType(idStock, data);
  }

  async importarProductosExcel(data) {
    return await createInMasaDocumentByType(data, "producto");
  }

  async refreshIndex() {
    await client.indices.refresh({ index: INDEX_ES_MAIN });
  }
}

export default new ProductoService();