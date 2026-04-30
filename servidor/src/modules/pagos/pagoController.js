import pagoService from "./pagoService.js";

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    const data = await pagoService.buscarPagos();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
