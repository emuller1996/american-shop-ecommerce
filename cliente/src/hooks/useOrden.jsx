/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import { getAllOrdenService, getOrdenesSearchPaginationServices } from '../services/ordenes.services'
import AuthContext from '../context/AuthContext'

export const useOrden = () => {
  const [data, setData] = useState(null)
  const [dataP, setDataP] = useState(undefined)


  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const { Token, TokenClient} = useContext(AuthContext)

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

  

  
  const getAllOrdenesPagination = async (data) => {
      setLoading(true)
      setDataP(undefined)
      try {
        const res = await getOrdenesSearchPaginationServices(Token, data)
        if (res.status !== 200) {
          let err = new Error('Error en la petición Fetch')
          err.status = res.status || '00'
          err.statusText = res.statusText || 'Ocurrió un error'
          throw err
        }
        console.log(res)
        if (!signal.aborted) {
          setDataP(res.data)
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
    abortController,
    getAllOrdenesPagination,
    dataP
  }
}
