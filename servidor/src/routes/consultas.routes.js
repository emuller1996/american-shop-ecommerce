import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  getDocumentById,
} from "../utils/index.js";

import md5 from "md5";
import { INDEX_ES_MAIN } from "../config.js";
import { client } from "../db.js";

const ConsultasRouters = Router();

ConsultasRouters.get("/", async (req, res) => {
  try {
    var data = await buscarElasticByType("consulta");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ConsultasRouters.get("/pagination", async (req, res) => {
  let perPage = req.query.perPage ?? 10;
  let page = req.query.page ?? 1;
  let search = req.query.search ?? "";
  let status = req.query.status ?? "";

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
                  type: "consulta",
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    };
    if (status !== "" && status) {
      consulta.body.query.bool.filter.push({
        term: {
          "status.keyword": status,
        },
      });
    }
    if (search !== "" && search) {
      consulta.body.query.bool.must.push({
        query_string: { query: `*${search}*`, fields: ["name", "description"] },
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
        producto: product.product_id
          ? await getDocumentById(product?.product_id)
          : "",
        cliente: product.client_id
          ? await getDocumentById(product?.client_id)
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

ConsultasRouters.get("/:id", async (req, res) => {
  try {
    var funcion = await getDocumentById(req.params.id);

    return res.status(200).json(funcion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ConsultasRouters.post("/", async (req, res) => {
  try {
    var recinto = {};
    const data = req.body;

    data.password = md5(data.password);
    const response = await crearElasticByType(data, "usuario");
    //recinto = response.body;
    return res.status(201).json({ message: "Usuario Creado.", recinto, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default ConsultasRouters;
