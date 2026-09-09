/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreatePuntoVentaService = (formData) => {
  return axios.post("/punto_venta", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const patchCreatePuntoVentaService = (id, formData) => {
  return axios.patch(`/punto_venta/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllPuntoVentaService = (data) => {
  return axios.get("/punto_venta", data);
};



