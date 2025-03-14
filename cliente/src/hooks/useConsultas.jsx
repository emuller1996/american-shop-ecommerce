/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getConsultasPaginationServices } from '../services/consultas.services'

export const useConsultas = () => {
  const { Token } = useContext(AuthContext)

  const [dataP, setDataP] = useState(undefined)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllConsultasPagination = async (data) => {
    setLoading(true)
    setDataP(undefined)
    try {
      const res = await getConsultasPaginationServices(Token, data)
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
        setDataP(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  return {
    getAllConsultasPagination,
    dataP,
    error,
    loading,
  }
}
