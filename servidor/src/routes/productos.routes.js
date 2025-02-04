import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  crearLogsElastic,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import { INDEX_ES_MAIN } from "../config.js";
import { client } from "../db.js";

const ProductosRouters = Router();

ProductosRouters.get("/", async (req, res) => {
  try {
    var data = await buscarElasticByType("producto");
    /* return res.json(searchResult.body.hits); */

    data = data.map(async (product) => {
      return {
        ...product,
        categoria: product.category_id
          ? await getDocumentById(product?.category_id)
          : "",
      };
    });
    data = await Promise.all(data);
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ProductosRouters.get("/:id", async (req, res) => {
  try {
    var producto = await getDocumentById(req.params.id);
    console.log(producto.image_id);

    if (producto.image_id) {
      let temp = await getDocumentById(producto.image_id);
      producto.imageBase64 = temp.image;
    }
    crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se mostro el detalle de un producto."
    );
    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ProductosRouters.post("/", async (req, res) => {
  try {
    var recinto = {};
    const data = req.body;
    const response = await crearElasticByType(data, "producto");
    //recinto = response.body;
    crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se Creado  un producto."
    );
    return res.status(201).json({ message: "Producto Creada.", recinto, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ProductosRouters.put("/:id", async (req, res) => {
  try {
    console.log(req.body);

    const r = await updateElasticByType(req.params.id, req.body);
    if (r.body.result === "updated") {
      await client.indices.refresh({ index: INDEX_ES_MAIN });
      crearLogsElastic(
        JSON.stringify(req.headers),
        JSON.stringify(req.body),
        "Se ha Actualizado un producto."
      );
      return res.json({ message: "Producto Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ProductosRouters.post("/:id/images", async (req, res) => {
  try {
    const dataImage = req.body;
    const ImageCreate = {
      product_id: req.params.id,
      image: dataImage.image,
    };
    const resElasCreateFun = await crearElasticByType(ImageCreate, "imagen");
    //recinto = response.body;
    crearLogsElastic(
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      "Se ha cargado nueva imagen a un producto."
    );
    return res
      .status(201)
      .json({ message: "Producto Creada.", resElasCreateFun });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ProductosRouters.get("/:id/images", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  type: {
                    value: "imagen",
                  },
                },
              },
              {
                term: {
                  product_id: {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "asc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });
    const dataImages = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });
    return res.status(200).json(dataImages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default ProductosRouters;
