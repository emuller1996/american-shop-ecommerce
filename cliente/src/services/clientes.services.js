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
  return axios.put(`/clientes/${id}`, data, { headers: { 'Authorization': token } })
}

export const postNewAddressClientesService = (token, data) => {
  return axios.post(`/clientes/new/address`, data, { headers: { 'Authorization': token } })
}

export const putNewAddressClientesService = (token, data,id) => {
  return axios.put(`/clientes/new/address/${id}/`, data, { headers: { 'Authorization': token } })
}


export const getGetAddressClientesService = (token) => {
  return axios.get(`/clientes/get/address`,{ headers: { 'Authorization': token } })
}


export const getGetShoppingClientesService = (token) => {
  return axios.get(`/clientes/get/shopping`,{ headers: { 'Authorization': token } })
}

export const getShopByIdService = (token, id) => {
  return axios.get(`/clientes/get/shopping/${id}`,{ headers: { 'Authorization': token } })
}
