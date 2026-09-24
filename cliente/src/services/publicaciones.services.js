/* eslint-disable prettier/prettier */
import axios from 'axios'

export const getAllPublicacionesService = (token, signal) => {
  return axios.get('/publicaciones', { signal: signal, headers: { 'access-token': token } })
}

export const getPublicacionesPublicadasService = (signal) => {
  return axios.get('/publicaciones/publicadas', { signal: signal })
}

export const postCreatePublicacionService = (token, formData) => {
  return axios.post('/publicaciones', formData, {
    headers: { 'access-token': token, 'Content-Type': 'multipart/form-data' },
  })
}

export const putUpdatePublicacionService = (token, id, formData) => {
  return axios.put(`/publicaciones/${id}`, formData, {
    headers: { 'access-token': token, 'Content-Type': 'multipart/form-data' },
  })
}

export const deletePublicacionService = (token, id) => {
  return axios.delete(`/publicaciones/${id}`, { headers: { 'access-token': token } })
}
