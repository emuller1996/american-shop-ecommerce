import md5 from "md5";
import { jwtDecode } from "jwt-decode";
import clienteService from "./clienteService.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { generateClienteAccessToken } from "../../utils/authjws.js";
import { sendVerificationEmail } from "../../services/mailService.js";

// Funciones auxiliares fuera de la clase
const construirConsultaClientes = ({ perPage, page, search, gender }) => {
  const consulta = {
    index: INDEX_ES_MAIN,
    size: perPage,
    from: (page - 1) * perPage,
    body: {
      query: {
        bool: {
          must: [],
          filter: [{ term: { type: "cliente" } }],
        },
      },
      sort: [{ createdTime: { order: "desc" } }],
    },
  };

  if (gender) {
    consulta.body.query.bool.filter.push({ term: { "gender.keyword": gender } });
  }
  if (search) {
    consulta.body.query.bool.must.push({
      query_string: {
        query: `*${search}*`,
        fields: ["name_client", "email_client", "phone_client"],
      },
    });
  }

  return consulta;
};

const construirConsultaComprasPorCliente = ({ id_cliente, perPage, page }) => ({
  index: INDEX_ES_MAIN,
  size: perPage,
  from: (page - 1) * perPage,
  body: {
    query: {
      bool: {
        must: [
          {
            term: {
              "cliente.client_id.keyword": { value: id_cliente },
            },
          },
        ],
        filter: [{ term: { type: "orden" } }],
      },
    },
    sort: [{ createdTime: { order: "desc" } }],
  },
});

const construirConsultaDireccionesPorCliente = ({ client_id, perPage, page }) => ({
  index: INDEX_ES_MAIN,
  size: perPage,
  from: (page - 1) * perPage,
  body: {
    query: {
      bool: {
        must: [
          {
            term: {
              "client_id.keyword": { value: client_id },
            },
          },
        ],
        filter: [{ term: { type: "direccion_cliente" } }],
      },
    },
    sort: [{ createdTime: { order: "desc" } }],
  },
});

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    let clientes = await clienteService.buscarClientes();
    clientes = await Promise.all(clientes);
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPaginados = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const gender = req.query.gender || "";

  try {
    const consulta = construirConsultaClientes({ perPage, page, search, gender });
    const searchResult = await clienteService.buscarClientesPaginados(consulta);

    let data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    data = await Promise.all(
      data.map(async (clienteDoc) => ({
        ...clienteDoc,
        categoria: clienteDoc.category_id
          ? await clienteService.obtenerDocumentoPorId(clienteDoc.category_id)
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

export const obtenerComprasPorCliente = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const id_cliente = req.params.id;

    const consulta = construirConsultaComprasPorCliente({ id_cliente, perPage, page });
    const searchResult = await clienteService.buscarComprasPorCliente(consulta);

    const data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = req.body;

    const requestEL = await clienteService.buscarClientePorEmail(data.email_client);

    if (requestEL.body.hits.total.value > 0) {
      return res.status(400).json({
        ...requestEL,
        message: "Usuario ya esta Registrado.",
        detail: `Ya hay un usuario con el correo electronico '${data.email_client}' en la base de datos como cliente.`,
        error: true,
      });
    }

    data.createdTime = new Date().getTime();
    data.hash = md5(req.body.password_client);
    delete data.password_client;

    const response = await clienteService.crearCliente(data);
    const customer = response.body;

    await sendVerificationEmail(data.email_client);

    return res.status(200).json({
      message: "Usuario Creado.",
      detail: `se creo correctamente su cuenta, por favor revisar el correo '${data.email_client}' para verificar su cuenta.`,
      customer,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const r = await clienteService.actualizarCliente(req.params.id, req.body);

    if (r.body.result === "updated") {
      await clienteService.refreshIndex();
      const clienteData = await clienteService.obtenerClientePorId(req.params.id);
      delete clienteData.hash;
      return res.json({
        message: "Cliente Actualizado",
        detail:
          "Se ha Actualizado tu informacion basica correctamente. Los cambios seran visibles cuando inicias seccion nuevamente.",
        clienteData,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = req.body;
    const requestEL = await clienteService.buscarClientePorEmail(data.email_client);

    if (requestEL.body.hits.total.value > 0) {
      const dataUser = requestEL.body.hits.hits[0]?._source;
      dataUser._id = requestEL.body.hits.hits[0]?._id;

      if (md5(data.password_client) === dataUser.hash) {
        delete dataUser.hash;
        const token = generateClienteAccessToken(dataUser);
        return res.status(200).json({
          ...requestEL,
          message: "Usuario ya esta Registrado.",
          detail: `ya hay un usuario con el correo electronico '${data.email_client}' en la base de datos como cliente.`,
          dataUser,
          token,
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "Contraseña Incorrecta.",
          detail: `La contraseña que esta ingresando es incorrecta, si no te acuerdas de ella, dale en recuperar contraseña.'`,
        });
      }
    } else {
      return res.status(404).json({
        error: true,
        message: "Usuario no registrado.",
        detail: `No hay usuario con el correo electronico '${data.email_client} en la base de datos como cliente.'`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crearDireccion = async (req, res) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const dataAddress = { ...req.body, client_id: decoded._id };
    const response = await clienteService.crearDireccion(dataAddress);
    return res
      .status(200)
      .json({ message:"Se ha creado la nueva dirección de envió correctamente." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarDireccion = async (req, res) => {
  try {
    const r = await clienteService.actualizarDireccion(req.params.idAddress, req.body);

    if (r.body.result === "updated") {
      await clienteService.refreshIndex();
      return res.json({ message: "Actualizado" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerDireccionesPorCliente = async (req, res) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const consulta = construirConsultaDireccionesPorCliente({
      client_id: decoded._id,
      perPage,
      page,
    });

    const searchResult = await clienteService.buscarDireccionesPorCliente(consulta);

    const data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerComprasClienteAutenticado = async (req, res) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const consulta = construirConsultaComprasPorCliente({
      id_cliente: decoded._id,
      perPage,
      page,
    });

    const searchResult = await clienteService.buscarComprasPorCliente(consulta);

    const data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerCompraPorId = async (req, res) => {
  try {
    const orden = await clienteService.obtenerDocumentoPorId(req.params.id);

    if (orden.address_id) {
      orden.address = await clienteService.obtenerDocumentoPorId(orden.address_id);
    }

    const productosData = await Promise.all(
      orden.products.map(async (c) => {
        const producto_data = await clienteService.obtenerDocumentoPorId(c.product_id);
        const stock_data = await clienteService.obtenerDocumentoPorId(c.stock_id);
        const image_id = producto_data.image_id;
        const image = (await clienteService.obtenerDocumentoPorId(image_id)).image;
        return {
          ...c,
          producto_data,
          stock_data,
          image_id,
          image,
        };
      })
    );

    orden.products = productosData;
    return res.status(200).json(orden);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
