import { buscarElasticByType } from "../../utils/index.js";

class PagoService {
  async buscarPagos() {
    return await buscarElasticByType("pago");
  }
}

export default new PagoService();
