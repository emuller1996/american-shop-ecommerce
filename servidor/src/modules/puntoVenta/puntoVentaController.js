import puntoVentaService from "./puntoVentaService.js";

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    const data = await puntoVentaService.buscarPuntosVenta();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const puntoVenta = await puntoVentaService.obtenerPuntoVentaPorId(req.params.id);
    return res.status(200).json(puntoVenta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = req.body;
    await puntoVentaService.crearPuntoVenta(data);
    return res
      .status(201)
      .json({ message: "Punto de Venta Creado.", recinto: {}, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const data = req.body;
    const response = await puntoVentaService.actualizarPuntoVenta(req.params.id, data);
    return res
      .status(201)
      .json({ message: "Punto de Venta Creado.", response, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
