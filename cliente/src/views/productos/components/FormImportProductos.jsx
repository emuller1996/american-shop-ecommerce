/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useProductos } from '../../../hooks/useProductos'
import toast from 'react-hot-toast'
export default function FormImportProductos({ getAllProductos }) {
  FormImportProductos.propTypes = {
    getAllProductos: PropTypes.func,
  }
  const { importProductos, descargarPlantillaProductos } = useProductos()

  const [file, setFile] = useState(null)
  const [isLoadingPlantilla, setIsLoadingPlantilla] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return alert('Selecciona un archivo primero')
    const formData = new FormData()
    formData.append('file', file) // "file" debe coincidir con el nombre del campo en Express
    try {
      const response = await importProductos(formData)
      console.log('Respuesta del servidor:', response.data)
      toast.success("Se ha importado el excel correctamente.")
      await getAllProductos()
    } catch (error) {
      console.error('Error al subir el archivo:', error)
    }
  }

  const handleDescargarPlantilla = async () => {
    try {
      setIsLoadingPlantilla(true)
      const response = await descargarPlantillaProductos()
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = 'plantilla-productos.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar la plantilla:', error)
      toast.error('No se pudo descargar la plantilla.')
    } finally {
      setIsLoadingPlantilla(false)
    }
  }

  return (
    <>
      <p className="text-center font-semibold mb-4 ">Importar Productos por excel</p>
      <div className="text-center mb-4">
        <button
          onClick={handleDescargarPlantilla}
          type="button"
          className="btn btn-outline-primary"
          disabled={isLoadingPlantilla}
        >
          <i className="fa-solid fa-file-arrow-down me-2"></i>
          {isLoadingPlantilla ? 'Descargando...' : 'Descargar Plantilla'}
        </button>
      </div>
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Default file input example
        </label>
        <input onChange={handleFileChange} className="form-control" type="file" id="formFile" />
        <div className="text-center mt-4">
          <button onClick={handleUpload} type="submit" className="btn btn-primary">
            Subir Excel
          </button>
        </div>
      </div>
    </>
  )
}
