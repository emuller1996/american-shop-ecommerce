import logService from "./logService.js";

export const obtenerPaginados = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const method = req.query.method || "";
    const data = await logService.buscarLogsPaginado({ perPage, page, search, method });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
