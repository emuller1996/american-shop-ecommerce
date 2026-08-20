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

  async productPack(id, data) {
    const order = await getDocumentById(id);
    const stockObject = await getDocumentById(data.stock_id);

    const productoAEmpacar = order.products.find(
      (pro) => pro.product_id === data.product_id
    );
    const cantidadAEmpacar = parseInt(productoAEmpacar?.cantidad);

    if (parseInt(stockObject.stock) < cantidadAEmpacar) {
      throw new Error("El producto no tiene en el stock la cantidad a empacar.");
    }

    const products = order.products.map((pro) =>
      pro.product_id === data.product_id ? { ...pro, status: "Empacado" } : pro
    );
    const nuevoStock = parseInt(stockObject.stock) - cantidadAEmpacar;

    await Promise.all([
      updateElasticByType(id, { products }),
      updateElasticByType(data.stock_id, { stock: nuevoStock }),
    ]);
    await this.refreshIndex();

    return { order, stockObject: { ...stockObject, stock: nuevoStock }, products };
  }
}

export default new OrdenService();
