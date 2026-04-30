import imagenService from "./imagenService.js";

// Controladores principales
// Nota: el path es /images/:id pero el :id corresponde a un PRODUCTO. El handler
// resuelve la imagen asociada al producto vía image_id (manteniendo el comportamiento
// y la respuesta original — campo imageBase64 hidrata desde el doc imagen).
export const obtenerImagenPorProducto = async (req, res) => {
  try {
    const producto = await imagenService.obtenerDocumentoPorId(req.params.id);

    if (producto.image_id) {
      const imagen = await imagenService.obtenerDocumentoPorId(producto.image_id);
      producto.imageBase64 = imagen.image;
    }

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
