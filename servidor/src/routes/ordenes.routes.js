import { Router } from "express";

import axios from "axios";
import {
  buscarElasticByType,
  crearElasticByType,
  getDocumentById,
} from "../utils/index.js";
import { INDEX_ES_MAIN } from "../config.js";
import { client } from "../db.js";
const OrdenesRouters = Router();

OrdenesRouters.post("/process_payment", async (req, res) => {
  let data = req.body;
  let ordenData = req.body.orderData;
  let paymentMercado = req.body.paymentMercado;

  delete data.ordenData;
  console.log(req.body);
  console.log(data);
  console.log(ordenData);
  try {
    const t = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      paymentMercado,
      {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      }
    );
    console.log(t.data);
    ordenData.mercadopago_id = t.data.id;
    ordenData.payment_method = "Tarjeta";
    ordenData.status = "Pendiente";
    if (t.data.status === "approved") {
      const response = await crearElasticByType(ordenData, "orden");
      let order = response.body;
      return res.json({ message: "Melo", order, mercaResponse: t.data });
    } else {
      return res.json({
        message: "ERROR EN EL PAGO CON TARJETA",
        mercaResponse: t.data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

OrdenesRouters.get("/", async (req, res) => {
  try {
    var ordenes = await buscarElasticByType("orden");
    /* return res.json(searchResult.body.hits); */
    ordenes = ordenes.map(async (or) => {
      if (or.evento_id) {
        //await getDocumentById(or.evento_id)
        or.evento = await getDocumentById(or.evento_id);
      }
      /* if(or.funcion_id){
        //await getDocumentById(or.funcion_id)
        or.funcion =  await getDocumentById(or.funcion_id)
      } */
      if (or.mercadopago_id) {
        const r = await axios.get(
          `https://api.mercadopago.com/v1/payments/${or.mercadopago_id}`,
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        or.mercadopago_data = r.data;
      }
      return or;
    });

    ordenes = await Promise.all(ordenes);
    return res.status(200).json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

OrdenesRouters.get("/pagination", async (req, res) => {
  let perPage = req.query.perPage ?? 10;
  let page = req.query.page ?? 1;
  let search = req.query.search ?? "";
  let gender = req.query.gender ?? "";

  try {
    var consulta = {
      index: INDEX_ES_MAIN,
      size: perPage,
      from: (page - 1) * perPage,
      body: {
        query: {
          bool: {
            must: [
              /* { match_phrase_prefix: { name: nameQuery } } */
            ],
            filter: [
              {
                term: {
                  type: "orden",
                },
              },
            ],
          },
        },
        sort: [
          { "createdTime": { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    };
    if (gender !== "" && gender) {
      consulta.body.query.bool.filter.push({
        term: {
          "gender.keyword": gender,
        },
      });
    }
    if (search !== "" && search) {
      consulta.body.query.bool.must.push({
        query_string: { query: `*${search}*`, fields: ["cliente.name_client", "cliente.email_client", "cliente.phone_client", "cliente.number_document_client"] },
      });
    }
    const searchResult = await client.search(consulta);

    var data = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });

    data = data.map(async (product) => {
      return {
        ...product,
       /*  cliente: product.client_id
          ? await getDocumentById(product?.client_id)
          : "", */
        address: product.address_id
          ? await getDocumentById(product?.address_id)
          : "",
      };
    });
    data = await Promise.all(data);
    /* return {
      data: data,
      total: searchResult.body.hits.total.value,
      total_pages: Math.ceil(searchResult.body.hits.total.value / perPage),
    }; */

    return res.status(200).json({
      data: data,
      total: searchResult.body.hits.total.value,
      total_pages: Math.ceil(searchResult.body.hits.total.value / perPage),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default OrdenesRouters;
