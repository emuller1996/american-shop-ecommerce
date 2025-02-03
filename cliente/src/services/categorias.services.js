/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreateCategoriaService = (data) => {
  return axios.post('/categoria', data)
}

export const getAllCategoriasService = (signal) => {
  return axios.get('/categoria', { signal: signal })
}

export const putUpdateCategoriaService = (id, data) => {
  return axios.put(`/categoria/${id}`, data)
}
