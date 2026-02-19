import categoriaService from "./categoriaService.js";

// Obtener todas las categorías
export const obtenerTodas = async (req, res) => {
  try {
    const data = await categoriaService.buscarCategorias();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Crear una nueva categoría
export const crear = async (req, res) => {
  try {
    const data = req.body;
    const response = await categoriaService.crearCategoria(data);
    
    return res.status(201).json({ 
      message: "Categoría Creada.", 
      data: response,
      categoria: data 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría
export const actualizar = async (req, res) => {
  try {
    const r = await categoriaService.actualizarCategoria(req.params.id, req.body);
    
    if (r.body.result === "updated") {
      await categoriaService.refreshIndex();
      return res.json({ message: "Categoría Actualizada" });
    }
    
    return res.status(400).json({ message: "No se pudo actualizar la categoría" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Opcional: Obtener categoría por ID (comentado en tu código original)
export const obtenerPorId = async (req, res) => {
  try {
    const categoria = await categoriaService.obtenerCategoriaPorId(req.params.id);
    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};