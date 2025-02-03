/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreateProductoService = (data, token) => {
  return axios.post('/productos', data, { headers: { 'access-token': token } })
}

export const getAllProductoService = (token,signal) => {
  return axios.get('/productos', { headers: { 'access-token': token }, signal: signal })
}

export const putUpdateProductoService = (id, data) => {
  return axios.put(`/productos/${id}`, data)
}

export const postCreateProductoImageService = (data, product_id) => {
  return axios.post(`/productos/${product_id}/images`, data)
}

export const getAllProductoImageService = (product_id, signal) => {
  return axios.get(`/productos/${product_id}/images`, { signal: signal })
}

export const getAllProductoByIdService = (id) => {
  return axios.get(`/productos/${id}`)
}
