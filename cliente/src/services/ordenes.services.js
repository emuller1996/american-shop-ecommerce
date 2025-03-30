/* eslint-disable prettier/prettier */

import axios from 'axios'

export const postCrearOrdenService = (data) => {
  return axios.post(`/ordenes/`, data)
}

export const getAllOrdenService = (data) => {
  return axios.get('/ordenes',data)
}


export const getOrdenesSearchPaginationServices = async (token, ...params) => {
  const searchs = new URLSearchParams();
  Object.entries(params[0]).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchs.append(key, value);
    }
  });

  return await axios.get(`/ordenes/pagination/?${searchs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};