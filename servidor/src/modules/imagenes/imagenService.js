import { getDocumentById } from "../../utils/index.js";

class ImagenService {
  async obtenerDocumentoPorId(id) {
    return await getDocumentById(id);
  }
}

export default new ImagenService();
