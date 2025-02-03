/* eslint-disable prettier/prettier */

import { useState } from 'react'
import { getAllOrdenService } from '../services/ordenes.services'

export const useOrden = () => {
  const [data, setData] = useState(null)


  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  /* const getAllOrdenes = async (id) => {
    try {
      setLoading(true)
      const r = await getAllOrdenService()
      console.log(r.data)
      setData(r.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error.message)
    }
  } */
  const getAllOrdenes = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getAllOrdenService({signal:signal})
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

  

  

  return {
    data,
    error,
    loading,
    getAllOrdenes,
    abortController
  }
}
