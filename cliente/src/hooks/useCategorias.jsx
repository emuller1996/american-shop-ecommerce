/* eslint-disable prettier/prettier */

import { useState } from 'react'
import { getAllCategoriasService } from '../services/categorias.services'

export const useCategorias = () => {
  const [data, setData] = useState(null)
  const [dataDetalle, setDataDetalle] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllCategorias = async () => {
    setLoading(true)
    try {
      const res = await getAllCategoriasService(signal)
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

  /* const getEventoById = async (id) => {
    try {
      const r = await getAllPuntoVentaByIdService(id)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  } */

  return {
    data,
    error,
    loading,
    getAllCategorias,
    abortController,
  }
}
