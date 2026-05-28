/* eslint-disable prettier/prettier */
import { useContext, useState } from 'react'
import { getOrdersStatsService } from '../services/metrics.services'
import AuthContext from '../context/AuthContext'

export const useMetrics = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { Token } = useContext(AuthContext)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getOrdersStats = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getOrdersStatsService(Token, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición de métricas')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      if (!signal.aborted) {
        setData(res.data.data || res.data)
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
    getOrdersStats,
    abortController,
    signal
  }
}