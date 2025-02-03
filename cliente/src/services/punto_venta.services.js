/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreatePuntoVentaService = (data) => {
  return axios.post("/punto_venta", data);
};


export const getAllPuntoVentaService = (data) => {
  return axios.get("/punto_venta", data);
};



