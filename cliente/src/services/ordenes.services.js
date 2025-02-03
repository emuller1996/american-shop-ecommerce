/* eslint-disable prettier/prettier */

import axios from 'axios'

export const postCrearOrdenService = (data) => {
  return axios.post(`/ordenes/`, data)
}

export const getAllOrdenService = (data) => {
  return axios.get('/ordenes',data)
}
