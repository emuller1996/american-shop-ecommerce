import publicacionService from "./publicacionService.js";
import { crearLogsElastic } from "../../utils/index.js";
import { guardarImagenWebp, eliminarImagenLocal } from "../../services/localImageService.js";

const parsePublished = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "1"].includes(value.trim().toLowerCase());
  return true;
};

const parseOrden = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const obtenerTodas = async (req, res) => {
  try {
    const data = await publicacionService.buscarPublicaciones();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPublicadas = async (req, res) => {
  try {
    const data = await publicacionService.buscarPublicacionesPublicadas();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = { ...req.body };
    data.published = parsePublished(data.published);

    const orden = parseOrden(data.orden);
    if (orden !== undefined) {
      data.orden = orden;
    } else {
      delete data.orden;
    }

    const file = req.files?.image;
    if (!file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }

    const { relativeUrl } = await guardarImagenWebp(file.tempFilePath, "publicaciones");
    data.image = `${req.protocol}://${req.get("host")}${relativeUrl}`;

    const response = await publicacionService.crearPublicacion(data);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(data),
      "Se ha creado una publicación del carrusel."
    );

    return res.status(201).json({ message: "Publicación creada.", data: response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const data = { ...req.body };
    data.published = parsePublished(data.published);

    const orden = parseOrden(data.orden);
    if (orden !== undefined) {
      data.orden = orden;
    } else {
      delete data.orden;
    }

    const file = req.files?.image;
    if (file) {
      const actual = await publicacionService
        .obtenerPublicacionPorId(req.params.id)
        .catch(() => null);

      const { relativeUrl } = await guardarImagenWebp(file.tempFilePath, "publicaciones");
      data.image = `${req.protocol}://${req.get("host")}${relativeUrl}`;

      if (actual?.image) {
        const vieja = new URL(actual.image).pathname;
        eliminarImagenLocal(vieja);
      }
    }

    await publicacionService.actualizarPublicacion(req.params.id, data);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify({ id: req.params.id, ...data }),
      "Se ha actualizado una publicación del carrusel."
    );

    return res.status(200).json({ message: "Publicación actualizada." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const actual = await publicacionService
      .obtenerPublicacionPorId(req.params.id)
      .catch(() => null);

    if (!actual) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    if (actual.image) {
      const ruta = new URL(actual.image).pathname;
      eliminarImagenLocal(ruta);
    }

    await publicacionService.eliminarPublicacion(req.params.id);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify({ id: req.params.id }),
      "Se ha eliminado una publicación del carrusel."
    );

    return res.status(200).json({ message: "Publicación eliminada." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
