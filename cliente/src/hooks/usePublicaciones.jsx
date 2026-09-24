/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import {
  getAllPublicacionesService,
  getPublicacionesPublicadasService,
  postCreatePublicacionService,
  putUpdatePublicacionService,
  deletePublicacionService,
} from '../services/publicaciones.services'
import AuthContext from '../context/AuthContext'

export const usePublicaciones = () => {
  const [data, setData] = useState([])
  const [dataPublicadas, setDataPublicadas] = useState([])

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const { Token } = useContext(AuthContext)

  const getAllPublicaciones = async () => {
    setLoading(true)
    try {
      const res = await getAllPublicacionesService(Token, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
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

  const getPublicacionesPublicadas = async () => {
    setLoading(true)
    try {
      const res = await getPublicacionesPublicadasService(signal)
      if (!signal.aborted) {
        setDataPublicadas(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setDataPublicadas([])
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  const createPublicacion = async (formData) => {
    return postCreatePublicacionService(Token, formData)
  }

  const updatePublicacion = async (id, formData) => {
    return putUpdatePublicacionService(Token, id, formData)
  }

  const deletePublicacion = async (id) => {
    return deletePublicacionService(Token, id)
  }

  return {
    data,
    dataPublicadas,
    error,
    loading,
    getAllPublicaciones,
    getPublicacionesPublicadas,
    createPublicacion,
    updatePublicacion,
    deletePublicacion,
    abortController,
  }
}
