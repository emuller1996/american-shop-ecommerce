import ordenService from "./ordenService.js";
import {
  crearPagoMercadoPago,
  obtenerPagoMercadoPago,
} from "./mercadoPagoClient.js";
import { crearLogsElastic } from "../../utils/index.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { sendOrdenDetail } from "../../services/mailService.js";

// Funciones auxiliares fuera de la clase
const construirConsultaOrdenes = ({ perPage, page, search, status }) => {
  const consulta = {
    index: INDEX_ES_MAIN,
    size: perPage,
    from: (page - 1) * perPage,
    body: {
      query: {
        bool: {
          must: [],
          filter: [{ term: { type: "orden" } }],
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
      query_string: {
        query: `*${search}*`,
        fields: [
          "cliente.name_client",
          "cliente.email_client",
          "cliente.phone_client",
          "cliente.number_document_client",
        ],
      },
    });
  }

  return consulta;
};

const enriquecerProductos = async (productos = []) => {
  return await Promise.all(
    productos.map(async (c) => {
      const producto_data = await ordenService.obtenerDocumentoPorId(c.product_id);
      const stock_data = await ordenService.obtenerDocumentoPorId(c.stock_id);
      const image_id = producto_data?.image_id;
      const image = image_id
        ? (await ordenService.obtenerDocumentoPorId(image_id))?.image
        : null;
      return { ...c, producto_data, stock_data, image_id, image };
    })
  );
};

const enriquecerOrden = async (orden, { incluirMercadoPago = false } = {}) => {
  if (orden.address_id) {
    orden.address = await ordenService.obtenerDocumentoPorId(orden.address_id);
  }

  if (incluirMercadoPago && orden.mercadopago_id) {
    try {
      orden.mercadopago_data = await obtenerPagoMercadoPago(orden.mercadopago_id);
    } catch (err) {
      console.error("[ordenes] error consultando Mercado Pago:", err.message);
    }
  }

  orden.products = await enriquecerProductos(orden.products);
  return orden;
};

// Controladores principales
export const procesarPago = async (req, res) => {
  try {
    const data = { ...req.body };
    const ordenData = { ...req.body.orderData };
    const paymentMercado = req.body.paymentMercado;
    delete data.ordenData;

    const mercaResponse = await crearPagoMercadoPago(paymentMercado);

    console.log("mercaResponse", mercaResponse);
    ordenData.mercadopago_id = mercaResponse.id;
    ordenData.payment_method = "Tarjeta";
    ordenData.status = "Pendiente";

    if (mercaResponse.status !== "approved") {
      return res.json({
        message: "ERROR EN EL PAGO CON TARJETA",
        mercaResponse,
      });
    }

    const response = await ordenService.crearOrden(ordenData);
    const order = response.body;

    const ordenDataSend = await ordenService.obtenerOrdenPorId(order._id);
    await enriquecerOrden(ordenDataSend);

    await sendOrdenDetail(ordenDataSend);

    return res.json({ message: "Melo", order, mercaResponse });
  } catch (error) {
    console.error("[ordenes/procesarPago] error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const r = await ordenService.actualizarOrden(req.params.id, req.body);

    if (r.body.result === "updated") {
      await ordenService.refreshIndex();
      crearLogsElastic(
        JSON.stringify(req.headers),
        JSON.stringify(req.body),
        "Se ha Actualizado un Orden."
      );
      return res.json({ message: "Orden  Actualizada" });
    }
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
    const consulta = construirConsultaOrdenes({ perPage, page, search, status });
    const searchResult = await ordenService.buscarOrdenesPaginadas(consulta);

    let data = searchResult.hits.hits.map((c) => ({
      ...c._source,
      _id: c._id,
    }));

    data = await Promise.all(
      data.map(async (orden) => ({
        ...orden,
        address: orden.address_id
          ? await ordenService.obtenerDocumentoPorId(orden.address_id)
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
    const orden = await ordenService.obtenerOrdenPorId(req.params.id);
    await enriquecerOrden(orden, { incluirMercadoPago: true });

    crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se mostro el detalle de un orden."
    );

    return res.status(200).json(orden);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const webhookMercadoPago = async (req, res) => {
  const data = req.body;

  if (data?.action !== "payment.updated") {
    return res.status(200).json({});
  }

  try {
    const payment_mercado = await obtenerPagoMercadoPago(data.data.id);

    const pagoDatos = {
      status: payment_mercado.status,
      net_received_amount: payment_mercado?.transaction_details?.net_received_amount,
      net_amount: payment_mercado?.net_amount ?? payment_mercado.transaction_amount,
      fee_details_amount: payment_mercado?.fee_details?.[0]?.amount,
      status_detail: payment_mercado?.status_detail,
    };

    await ordenService.crearPago(pagoDatos);

    if (payment_mercado.status === "approved") {
      // TODO: buscar orden + productos para bajar inventario y enviar email del pago.
    }
  } catch (error) {
    console.error("[ordenes/webhook] error:", error.message);
  }

  return res.status(200).json({});
};
