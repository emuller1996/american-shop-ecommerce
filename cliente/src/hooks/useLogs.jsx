/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import { getLogsSearchPaginationServices } from '../services/logs.services'
import AuthContext from '../context/AuthContext'

export const useLogs = () => {
  const [dataP, setDataP] = useState(undefined)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { Token } = useContext(AuthContext)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getLogsPagination = async (data) => {
    setLoading(true)
    setDataP(undefined)
    try {
      const res = await getLogsSearchPaginationServices(Token, data)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      if (!signal.aborted) {
        setDataP(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  return { dataP, error, loading, getLogsPagination, abortController }
}
