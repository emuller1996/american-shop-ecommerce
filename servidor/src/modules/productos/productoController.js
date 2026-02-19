import productoService from "./productoService.js";
import { crearLogsElastic } from "../../utils/index.js";
import { jwtDecode } from "jwt-decode";
import { INDEX_ES_MAIN } from "../../config.js";
import xlsx from "xlsx";

// Funciones auxiliares fuera de la clase
const construirConsultaProductos = ({ perPage, page, search, gender, category, published }) => {
  const consulta = {
    index: INDEX_ES_MAIN,
    size: perPage,
    from: (page - 1) * perPage,
    body: {
      query: {
        bool: {
          must: [],
          filter: [{ term: { "type.keyword": "producto" } }],
        },
      },
      sort: [{ "name.keyword": { order: "asc" } }],
    },
  };

  if (gender) {
    consulta.body.query.bool.filter.push({ term: { "gender.keyword": gender } });
  }
  if (category) {
    consulta.body.query.bool.filter.push({ term: { "category_id.keyword": category } });
  }
  if (published) {
    consulta.body.query.bool.filter.push({ term: { published } });
  }
  if (search) {
    consulta.body.query.bool.must.push({
      query_string: { query: `*${search}*`, fields: ["name", "description"] },
    });
  }

  return consulta;
};

const construirConsultaProductosPublicados = ({ perPage, page, search, gender, category }) => {
  const consulta = {
    index: INDEX_ES_MAIN,
    size: perPage,
    from: (page - 1) * perPage,
    body: {
      query: {
        bool: {
          must: [{ term: { published: { value: "true" } } }],
          filter: [{ term: { "type.keyword": "producto" } }],
        },
      },
      sort: [{ "name.keyword": { order: "asc" } }],
    },
  };

  if (gender) {
    consulta.body.query.bool.filter.push({ term: { "gender.keyword": gender } });
  }
  if (category) {
    consulta.body.query.bool.filter.push({ term: { "category_id.keyword": category } });
  }
  if (search) {
    consulta.body.query.bool.must.push({
      query_string: { query: `*${search}*`, fields: ["name", "description"] },
    });
  }

  return consulta;
};

const obtenerTodasLasImagenes = async (idProducto) => {
  return await productoService.buscarImagenesPorProducto(idProducto);
};

const obtenerTodoElStock = async (idProducto) => {
  return await productoService.buscarStockPorProducto(idProducto);
};

const obtenerRespuestasPorConsulta = async (consultaId) => {
  const respuestas = await productoService.buscarRespuestasPorConsulta(consultaId);

  return await Promise.all(
    respuestas.map(async (r) => {
      const user = await productoService.obtenerProductoPorId(r.user_id);
      return {
        ...r,
        _id: r._id,
        user: { name: user.name, role: user.role },
      };
    })
  );
};

// Controladores principales
export const obtenerTodos = async (req, res) => {
  try {
    let data = await productoService.buscarProductos();

    data = data.map(async (product) => ({
      ...product,
      categoria: product.category_id
        ? await productoService.obtenerCategoria(product.category_id)
        : "",
    }));
    data = await Promise.all(data);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPaginados = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const category = req.query.category || "";
  const published = req.query.published || "";

  try {
    const consulta = construirConsultaProductos({
      perPage,
      page,
      search,
      gender,
      category,
      published,
    });

    const searchResult = await productoService.buscarProductosPaginados(consulta);

    let data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    data = await Promise.all(
      data.map(async (product) => ({
        ...product,
        categoria: product.category_id
          ? await productoService.obtenerCategoria(product.category_id)
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

export const obtenerPublicados = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const category = req.query.category || "";

  try {
    const consulta = construirConsultaProductosPublicados({
      perPage,
      page,
      search,
      gender,
      category,
    });

    const searchResult = await productoService.buscarProductosPaginados(consulta);

    let data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    data = await Promise.all(
      data.map(async (product) => ({
        ...product,
        categoria: product.category_id
          ? await productoService.obtenerCategoria(product.category_id)
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
    const producto = await productoService.obtenerProductoPorId(req.params.id);

    if (producto.image_id) {
      producto.imageBase64 = await productoService.obtenerImagen(producto.image_id);
    }

    producto.Imagenes = await obtenerTodasLasImagenes(req.params.id);
    producto.Stock = await obtenerTodoElStock(req.params.id);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se mostro el detalle de un producto."
    );

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = req.body;
    const response = await productoService.crearProducto(data);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se Creado un producto."
    );

    return res.status(201).json({ message: "Producto Creada.", recinto: response, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const r = await productoService.actualizarProducto(req.params.id, req.body);

    if (r.body.result === "updated") {
      await productoService.refreshIndex();

      await crearLogsElastic(
        JSON.stringify(req.headers),
        JSON.stringify(req.body),
        "Se ha Actualizado un producto."
      );

      return res.json({ message: "Producto Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const agregarStock = async (req, res) => {
  try {
    const dataStock = { ...req.body, product_id: req.params.id };

    const requestEL = await productoService.buscarStockPorProductoYTalla(
      req.params.id,
      dataStock.size
    );

    if (requestEL.body.hits.total.value > 0) {
      return res.status(400).json({
        ...requestEL,
        message: "Talla ya esta Registrada en Stock.",
        detail: `Ya hay una Talla '${dataStock.size}' con stock.`,
        error: true,
      });
    }

    const resElasCreateStock = await productoService.crearStock(dataStock);

    const user_id = jwtDecode(req.headers["access-token"])._id;
    const dataCreateLog = {
      user_id,
      product_id: req.params.id,
      cantidad: req.body.stock,
      descripcion: "Se Agrego una Talla",
      size: req.body.size,
      stock_id: resElasCreateStock.body._id,
    };

    await productoService.crearProductLog(dataCreateLog);

    return res.status(201).json({ message: "Stock del producto creada.", dataStock });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const agregarImagen = async (req, res) => {
  try {
    const imageData = {
      product_id: req.params.id,
      image: req.body.image,
    };

    const resElasCreateFun = await productoService.crearImagen(imageData);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se ha cargado nueva imagen a un producto."
    );

    return res.status(201).json({ message: "Imagen creada.", resElasCreateFun });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerImagenes = async (req, res) => {
  try {
    const dataImages = await productoService.buscarImagenesPorProducto(req.params.id);
    return res.status(200).json(dataImages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crearConsulta = async (req, res) => {
  try {
    const accessToken = req.headers["authorization"];
    const decoded = jwtDecode(accessToken);

    const consultaData = {
      ...req.body,
      product_id: req.params.id,
      status: "pending",
      client_id: decoded._id,
    };

    await productoService.crearConsulta(consultaData);

    await crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se ha cargado nueva consulta a un producto."
    );

    return res.status(201).json({ message: "Consulta Creada." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerConsultas = async (req, res) => {
  try {
    let consultas = await productoService.buscarConsultasPorProducto(req.params.id);

    consultas = await Promise.all(
      consultas.map(async (c) => {
        const cliente = await productoService.obtenerProductoPorId(c.client_id);
        const respuestas = await obtenerRespuestasPorConsulta(c._id);

        return {
          ...c,
          cliente: {
            name_client: cliente.name_client,
            email_client: cliente.email_client,
            phone_client: cliente.phone_client,
          },
          respuestas,
        };
      })
    );

    return res.status(200).json(consultas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerStock = async (req, res) => {
  try {
    const dataStock = await productoService.buscarStockPorProducto(req.params.id);
    return res.status(200).json(dataStock);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerLogsStock = async (req, res) => {
  try {
    let logs = await productoService.buscarLogsPorProducto(req.params.id);

    logs = await Promise.all(
      logs.map(async (log) => ({
        ...log,
        user: log.user_id ? (await productoService.obtenerProductoPorId(log.user_id)).name : "",
      }))
    );

    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarStock = async (req, res) => {
  try {
    const dataTest = await productoService.obtenerStockPorId(req.params.idStock);

    const user_id = jwtDecode(req.headers["access-token"])._id;
    const cantidad = req.body.stock - dataTest.stock;

    const dataCreateLog = {
      user_id,
      product_id: dataTest.product_id,
      cantidad,
      descripcion: "Se Actualizo la Talla",
      size: req.body.size,
      stock_id: req.params.idStock,
    };

    const r = await productoService.actualizarStock(req.params.idStock, req.body);
    await productoService.crearProductLog(dataCreateLog);

    if (r.body.result === "updated") {
      await productoService.refreshIndex();
      return res.json({ message: "Stock Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const validarStock = async (req, res) => {
  try {
    const stock = await productoService.obtenerStockPorId(req.params.idStock);
    const producto = await productoService.obtenerProductoPorId(stock.product_id);
    const imagen = await productoService.obtenerProductoPorId(producto.image_id);

    stock.product = producto;
    stock.image = imagen;

    if (req.body.cantidad > stock.stock) {
      return res.status(400).json({ message: "error", stock });
    }

    return res.status(200).json({ message: "test", stock });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const importarDesdeExcel = async (req, res) => {
  try {
    const { file } = req.files;
    if (!file) {
      return res.status(400).send("No se ha seleccionado ningún archivo");
    }

    const workbook = xlsx.readFile(file.tempFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = xlsx.utils.sheet_to_json(worksheet);

    data = data.map((da) => ({ ...da, published: false }));

    const r = await productoService.importarProductosExcel(data);

    return res.status(200).json({ message: "Importada Realizada", data: r });
  } catch (error) {
    return res.status(500).send("Error al procesar el archivo: " + error.message);
  }
};