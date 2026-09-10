import puntoVentaService from "./puntoVentaService.js";
import { guardarImagenWebp, eliminarImagenLocal } from "../../services/localImageService.js";

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
    const data = { ...req.body };
    if (data.coordinates) data.coordinates = JSON.parse(data.coordinates);

    const file = req.files?.image;
    if (file) {
      const { relativeUrl } = await guardarImagenWebp(file.tempFilePath, "puntos_ventas");
      data.image_url = `${req.protocol}://${req.get("host")}${relativeUrl}`;
    }

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
    const data = { ...req.body };
    if (data.coordinates) data.coordinates = JSON.parse(data.coordinates);

    const file = req.files?.image;
    if (file) {
      const puntoActual = await puntoVentaService.obtenerPuntoVentaPorId(req.params.id);
      const { relativeUrl } = await guardarImagenWebp(file.tempFilePath, "puntos_ventas");
      data.image_url = `${req.protocol}://${req.get("host")}${relativeUrl}`;

      if (puntoActual?.image_url) {
        const vieja = new URL(puntoActual.image_url).pathname;
        eliminarImagenLocal(vieja);
      }
    }

    const response = await puntoVentaService.actualizarPuntoVenta(req.params.id, data);
    return res
      .status(201)
      .json({ message: "Punto de Venta Actualizado.", response, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
