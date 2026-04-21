import { jwtDecode } from "jwt-decode";
import clienteService from "./clienteService.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { generateClienteAccessToken } from "../../utils/authjws.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { sendVerificationEmail } from "../../services/mailService.js";

const INVALID_CREDENTIALS = {
  error: true,
  message: "Credenciales inválidas.",
  detail:
    "El correo electrónico o la contraseña son incorrectos. Si no recuerdas tu contraseña, usa la opción de recuperar contraseña.",
};

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
    const data = { ...req.body };
    const { email_client, password_client } = data;

    if (typeof email_client !== "string" || !email_client) {
      return res.status(400).json({
        error: true,
        message: "Email requerido.",
        detail: "Debes ingresar un correo electrónico válido.",
      });
    }

    if (typeof password_client !== "string" || !password_client) {
      return res.status(400).json({
        error: true,
        message: "Contraseña requerida.",
        detail: "Debes ingresar una contraseña.",
      });
    }

    const requestEL = await clienteService.buscarClientePorEmail(email_client);

    if (requestEL.body.hits.total.value > 0) {
      return res.status(400).json({
        error: true,
        message: "Usuario ya está registrado.",
        detail: `Ya hay un usuario con el correo electrónico '${email_client}' en la base de datos como cliente.`,
      });
    }

    data.createdTime = new Date().getTime();
    data.hash = await hashPassword(password_client);
    delete data.password_client;

    await clienteService.crearCliente(data);

    await sendVerificationEmail(email_client);

    return res.status(200).json({
      message: "Usuario Creado.",
      detail: `Se creó correctamente su cuenta, por favor revisar el correo '${email_client}' para verificar su cuenta.`,
    });
  } catch (error) {
    console.error("[clientes/crear] error:", error);
    return res.status(500).json({
      error: true,
      message: "Error interno del servidor.",
      detail: "Ocurrió un error al crear la cuenta. Por favor intenta de nuevo.",
    });
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
    const { email_client, password_client } = req.body ?? {};

    if (
      typeof email_client !== "string" ||
      typeof password_client !== "string" ||
      !email_client ||
      !password_client
    ) {
      return res.status(400).json({
        error: true,
        message: "Credenciales requeridas.",
        detail: "Debes ingresar correo electrónico y contraseña.",
      });
    }

    const requestEL = await clienteService.buscarClientePorEmail(email_client);
    const hit = requestEL.body.hits.hits[0];
    const dataUser = hit?._source ? { ...hit._source, _id: hit._id } : null;

    const { valid, needsRehash } = dataUser
      ? await verifyPassword(password_client, dataUser.hash ?? "")
      : { valid: false, needsRehash: false };

    // Mismo mensaje para "no existe" y "contraseña incorrecta" → evita enumeración de usuarios.
    if (!valid) {
      return res.status(401).json(INVALID_CREDENTIALS);
    }

    // Migración transparente md5 → bcrypt.
    if (needsRehash) {
      try {
        const newHash = await hashPassword(password_client);
        await clienteService.actualizarHashCliente(dataUser._id, newHash);
      } catch (err) {
        console.error("[clientes/login] fallo al re-hashear hash:", err.message);
      }
    }

    delete dataUser.hash;
    const token = generateClienteAccessToken(dataUser);

    return res.status(200).json({
      message: "Login exitoso.",
      dataUser,
      token,
    });
  } catch (error) {
    console.error("[clientes/login] error:", error);
    return res.status(500).json({
      error: true,
      message: "Error interno del servidor.",
      detail: "Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.",
    });
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
