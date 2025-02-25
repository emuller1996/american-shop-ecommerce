/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreateClientesService = (data) => {
  return axios.post('/clientes', data)
}

export const postLoginClientesService = (data) => {
  return axios.post('/clientes/login', data)
}

export const getAllClientesService = (token, signal) => {
  return axios.get('/clientes', { headers: { 'access-token': token }, signal: signal })
}

export const putUpdateClientesService = (token, id, data) => {
  return axios.put(`/clientes/${id}`, data, { headers: { 'access-token': token } })
}
