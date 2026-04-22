import { jwtDecode } from "jwt-decode";
import consultaService from "./consultaService.js";
import { crearLogsElastic } from "../../utils/index.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { sendRespuestaConsultaEmail } from "../../services/mailService.js";

// Funciones auxiliares fuera de la clase
const construirConsultaConsultas = ({ perPage, page, search, status }) => {
  const consulta = {
    index: INDEX_ES_MAIN,
    size: perPage,
    from: (page - 1) * perPage,
    body: {
      query: {
        bool: {
          must: [],
          filter: [{ term: { type: "consulta" } }],
        },
      },
      sort: [{ createdTime: { order: "desc" } }],
    },
  };

  if (status) {
    consulta.body.query.bool.filter.push({ term: { "status.keyword": status } });
  }
  if (search) {
    consulta.body.query.bool.must.push({
      query_string: { query: `*${search}*`, fields: ["name", "description"] },
    });
  }

  return consulta;
};

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    const data = await consultaService.buscarConsultas();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPaginados = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const status = req.query.status || "";

  try {
    const consulta = construirConsultaConsultas({ perPage, page, search, status });
    const searchResult = await consultaService.buscarConsultasPaginadas(consulta);

    let data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    data = await Promise.all(
      data.map(async (item) => ({
        ...item,
        producto: item.product_id
          ? await consultaService.obtenerDocumentoPorId(item.product_id)
          : "",
        cliente: item.client_id
          ? await consultaService.obtenerDocumentoPorId(item.client_id)
          : "",
      }))
    );

    return res.status(200).json({
      data,
      total: searchResult.hits.total.value,
      total_pages: Math.ceil(searchResult.hits.total.value / perPage),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const consulta = await consultaService.obtenerConsultaPorId(req.params.id);
    return res.status(200).json(consulta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crearRespuesta = async (req, res) => {
  try {
    const data = { ...req.body };
    const user_token = jwtDecode(req.headers.authorization);
    data.user_id = user_token._id;

    const result = await consultaService.crearRespuesta(data);

    await consultaService.actualizarConsulta(data.consulta_id, {
      status: "completed",
    });

    const [dataRespuesta, dataConsulta] = await Promise.all([
      consultaService.obtenerDocumentoPorId(result.body._id),
      consultaService.obtenerDocumentoPorId(data.consulta_id),
    ]);

    const [cliente, user] = await Promise.all([
      consultaService.obtenerDocumentoPorId(dataConsulta.client_id),
      consultaService.obtenerDocumentoPorId(dataRespuesta.user_id),
    ]);

    dataRespuesta.cliente = cliente;
    dataRespuesta.user = user;
    dataRespuesta.consulta = dataConsulta.consulta;

    await sendRespuestaConsultaEmail(dataRespuesta);

    return res.status(201).json({ message: "Usuario Creado.", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerRespuestasPorConsulta = async (req, res) => {
  try {
    const hits = await consultaService.buscarRespuestasPorConsulta(req.params.id);

    const data = await Promise.all(
      hits.map(async (c) => {
        const user = await consultaService.obtenerDocumentoPorId(c._source.user_id);
        return {
          ...c._source,
          _id: c._id,
          user: { name: user.name, role: user.role },
        };
      })
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const r = await consultaService.actualizarConsulta(req.params.id, req.body);

    if (r.body.result === "updated") {
      await consultaService.refreshIndex();
      crearLogsElastic(
        JSON.stringify(req.headers),
        JSON.stringify(req.body),
        "Se ha Actualizado un Consulta."
      );
      return res.json({ message: "Consulta Actualizada." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
