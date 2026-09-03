import ordenService from "./ordenService.js";
import {
  crearPagoMercadoPago,
  obtenerPagoMercadoPago,
} from "./mercadoPagoClient.js";
import {
  generarReferenciaOrden,
  generarFirmaIntegridad,
  obtenerTransaccionWompi,
  verificarFirmaEvento,
} from "./wompiClient.js";
import { crearLogsElastic } from "../../utils/index.js";
import { INDEX_ES_MAIN } from "../../config.js";
import { sendOrdenDetail, sendOrdenStatusPreparacion } from "../../services/mailService.js";
import { sendOrdenStatusEnCamino } from "../../services/mail/index.js";

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
    consulta.body.query.bool.filter.push({
      term: { "status.keyword": status },
    });
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
      const producto_data = await ordenService.obtenerDocumentoPorId(
        c.product_id,
      );
      const stock_data = await ordenService.obtenerDocumentoPorId(c.stock_id);
      const image_id = producto_data?.image_id;
      const image = image_id
        ? (await ordenService.obtenerDocumentoPorId(image_id))?.image
        : null;
      return { ...c, producto_data, stock_data, image_id, image };
    }),
  );
};

const enriquecerOrden = async (
  orden,
  { incluirMercadoPago = false, incluirWompi = false } = {},
) => {
  if (orden.address_id) {
    orden.address = await ordenService.obtenerDocumentoPorId(orden.address_id);
  }

  if (incluirMercadoPago && orden.mercadopago_id) {
    try {
      orden.mercadopago_data = await obtenerPagoMercadoPago(
        orden.mercadopago_id,
      );
    } catch (err) {
      console.error("[ordenes] error consultando Mercado Pago:", err.message);
    }
  }
  console.log(orden.payment_method === "Wompi" && orden.wompi_transaction_id);

  if (orden.payment_method === "Wompi" && orden.wompi_transaction_id) {
    try {
      orden.wompi_data = await obtenerTransaccionWompi(orden.wompi_transaction_id);
    } catch (err) {
      console.log(err.request);
      console.error("[ordenes] error consultando Wompi:", err.message);
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

export const crearOrdenNequi = async (req, res) => {
  try {
    const ordenData = { ...req.body.orderData };
    ordenData.payment_method = "Nequi";
    ordenData.status = "Pendiente";

    const response = await ordenService.crearOrden(ordenData);
    const order = response.body;

    const ordenDataSend = await ordenService.obtenerOrdenPorId(order._id);
    await enriquecerOrden(ordenDataSend);

    await sendOrdenDetail(ordenDataSend);

    return res.status(200).json({
      message: "Orden creada exitosamente para pago con Nequi",
      order,
    });
  } catch (error) {
    console.error("[ordenes/crearOrdenNequi] error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const generarFirmaWompi = async (req, res) => {
  try {
    const { amountInCents } = req.body ?? {};

    if (!amountInCents || isNaN(Number(amountInCents))) {
      return res.status(400).json({ message: "amountInCents es requerido." });
    }

    const reference = generarReferenciaOrden();
    const signature = generarFirmaIntegridad({ reference, amountInCents });

    return res.status(200).json({ reference, signature });
  } catch (error) {
    console.error("[ordenes/generarFirmaWompi] error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const crearOrdenWompi = async (req, res) => {
  try {
    const ordenData = { ...req.body.orderData };
    const { transactionId } = req.body;

    const transaction = await obtenerTransaccionWompi(transactionId);

    if (transaction.status !== "APPROVED") {
      return res.json({
        message: "ERROR EN EL PAGO CON WOMPI",
        transaction,
      });
    }

    ordenData.payment_method = "Wompi";
    ordenData.wompi_transaction_id = transaction.id;
    ordenData.wompi_data = transaction;
    ordenData.status = "Pendiente";

    const response = await ordenService.crearOrden(ordenData);
    const order = response.body;

    const ordenDataSend = await ordenService.obtenerOrdenPorId(order._id);
    await enriquecerOrden(ordenDataSend);

    await sendOrdenDetail(ordenDataSend);

    return res.status(200).json({
      message: "Orden creada exitosamente con Wompi",
      order,
    });
  } catch (error) {
    console.error("[ordenes/crearOrdenWompi] error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const webhookWompi = async (req, res) => {
  try {
    const { signature, timestamp, data } = req.body ?? {};

    const firmaValida =
      signature &&
      verificarFirmaEvento({
        properties: signature.properties,
        timestamp,
        checksum: signature.checksum,
        dataEvento: data,
      });

    if (firmaValida) {
      const transaction = data?.transaction ?? {};
      const pagoDatos = {
        status: transaction.status,
        amount_in_cents: transaction.amount_in_cents,
        reference: transaction.reference,
        payment_method_type: transaction.payment_method_type,
        wompi_transaction_id: transaction.id,
      };
      await ordenService.crearPago(pagoDatos);
    } else {
      console.error("[ordenes/webhookWompi] firma inválida, evento ignorado.");
    }
  } catch (error) {
    console.error("[ordenes/webhookWompi] error:", error.message);
  }

  return res.status(200).json({});
};

export const actualizar = async (req, res) => {
  try {

    const r = await ordenService.actualizarOrden(req.params.id, req.body);
    const order = await ordenService.obtenerOrdenPorId(req.params.id)

    if(req.body.status && req.body.status==="En Proceso"){
      sendOrdenStatusPreparacion(order)
    }

    if(req.body.status && req.body.status==="En Camino"){
      sendOrdenStatusEnCamino(order)
    }

    if (r.body.result === "updated") {
      await ordenService.refreshIndex();
      crearLogsElastic(
        JSON.stringify(req.headers),
        JSON.stringify(req.body),
        "Se ha Actualizado un Orden.",
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
    const consulta = construirConsultaOrdenes({
      perPage,
      page,
      search,
      status,
    });
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
      })),
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
    await enriquecerOrden(orden, { incluirMercadoPago: true, incluirWompi: true });

    crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se mostro el detalle de un orden.",
    );

    return res.status(200).json(orden);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const productPack = async (req, res) => {
  try {
    console.log(req.params);
    const datos = await ordenService.productPack(req.params.id, req.body);
    
    return res.status(200).json({ ...datos, message: "Solitud con exito" });
  } catch (error) {
    //console.log(error);
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
      net_received_amount:
        payment_mercado?.transaction_details?.net_received_amount,
      net_amount:
        payment_mercado?.net_amount ?? payment_mercado.transaction_amount,
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
