/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import { getAllCategoriasService } from '../services/categorias.services'
import { getAllClientesService, getGetAddressClientesService, getGetShoppingClientesService, postNewAddressClientesService, putUpdateClientesService } from '../services/clientes.services'
import AuthContext from '../context/AuthContext'

export const useClientes = () => {
  const [data, setData] = useState(null)
  const [dataDetalle, setDataDetalle] = useState(null)
  const [dataAddress, setDataAddress] = useState(null)
  const [dataShopping, setDataShopping] = useState(null)


  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const { Token, TokenClient } = useContext(AuthContext)

  const getAllClientes = async () => {
    setLoading(true)
    try {
      const res = await getAllClientesService(Token, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      console.log(res)
      if (!signal.aborted) {
        setData(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setData(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  const putClienteById = async (id, data) => {
    try {
      const r = await putUpdateClientesService(TokenClient, id, data)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const postClienteNewAddress = async (data) => {
    try {
      const r = await postNewAddressClientesService(TokenClient, data)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllShoppingByClientes = async () => {
    setLoading(true)
    try {
      const res = await getGetShoppingClientesService(TokenClient, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      console.log(res)
      if (!signal.aborted) {
        setDataShopping(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setDataShopping(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }


  const getAllAddressByClientes = async () => {
    setLoading(true)
    try {
      const res = await getGetAddressClientesService(TokenClient, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      console.log(res)
      if (!signal.aborted) {
        setDataAddress(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setDataAddress(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  return {
    data,
    error,
    loading,
    getAllClientes,
    abortController,
    putClienteById,
    postClienteNewAddress,
    getAllAddressByClientes,
    dataAddress,
    getAllShoppingByClientes,
    dataShopping
  }
}
