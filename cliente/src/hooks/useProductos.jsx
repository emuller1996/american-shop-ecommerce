/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import { getAllCategoriasService } from '../services/categorias.services'
import {
  getAllProductoByIdService,
  getAllProductoImageService,
  getAllProductoService,
  postCreateProductoService,
} from '../services/productos.services'
import AuthContext from '../context/AuthContext'

export const useProductos = () => {
  const [data, setData] = useState([])
  const [dataDetalle, setDataDetalle] = useState(null)
  const [ImagesProduct, setImagesProduct] = useState(null)
  const { Token } = useContext(AuthContext)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllProductos = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getAllProductoService(Token, signal)
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

  const getImagesByProductId = async (id) => {
    try {
      const r = await getAllProductoImageService(id, signal)
      console.log(r.data)
      setImagesProduct(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProductById = async (id) => {
    try {
      const r = await getAllProductoByIdService(id)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createProducto = async (data) => {
    return postCreateProductoService(data,Token)
  }

  return {
    data,
    error,
    loading,
    getAllProductos,
    abortController,
    getImagesByProductId,
    ImagesProduct,
    getProductById,
    dataDetalle,
    createProducto
  }
}
