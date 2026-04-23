import React, { useEffect, useState } from 'react'
import { Alert, Form } from 'react-bootstrap'

import { useProductos } from '../../../hooks/useProductos'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import imageCompression from 'browser-image-compression'
import { Button } from '@mui/material'

const ImagesPage = ({ idProduct }) => {
  ImagesPage.propTypes = {
    idProduct: PropTypes.string,
  }
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setisLoading] = useState(true)
  const [isLoadingUpload, setisLoadingUpload] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [ErrorFile, setErrorFile] = useState(null)

  const {
    getImagesByProductId,
    ImagesProduct,
    getProductById,
    dataDetalle,
    updatedProducto,
    uploadProductoImage,
    deleteProductoImage,
  } = useProductos()

  useEffect(() => {
    if (idProduct) {
      getAllDataFetch()
    }
  }, [idProduct])

  // Liberar object URL del preview cuando cambie/desmonte.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const getAllDataFetch = async () => {
    try {
      setisLoading(true)
      await getImagesByProductId(idProduct)
      await getProductById(idProduct)
    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  const resetSelection = (inputEl) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedImage(null)
    setPreviewUrl(null)
    if (inputEl) inputEl.value = ''
  }

  const handleImageChange = async (e) => {
    const inputEl = e.target
    try {
      resetSelection()
      setErrorFile(null)
      const file = inputEl.files[0]
      if (!file) return

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8,
      }

      const compressedFile = await imageCompression(file, options)

      // Asegura nombre con .webp para el upload
      const webpFile =
        compressedFile instanceof File && compressedFile.name?.endsWith('.webp')
          ? compressedFile
          : new File([compressedFile], `${Date.now()}.webp`, { type: 'image/webp' })

      setSelectedImage(webpFile)
      setPreviewUrl(URL.createObjectURL(webpFile))
    } catch (error) {
      console.error('Error al procesar imagen:', error.message)
      inputEl.value = ''
      setErrorFile(error.message)
    }
  }

  const handleUpload = async (inputEl) => {
    if (!selectedImage) return
    try {
      setisLoadingUpload(true)
      await uploadProductoImage(idProduct, selectedImage)
      await getImagesByProductId(idProduct)
      resetSelection(inputEl)
      toast.success('Imagen subida correctamente.')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message ?? 'No se pudo subir la imagen.')
    } finally {
      setisLoadingUpload(false)
    }
  }

  const handleDelete = async (imageId) => {
    if (!window.confirm('¿Eliminar esta imagen? Esta acción es permanente.')) return
    try {
      setDeletingId(imageId)
      await deleteProductoImage(idProduct, imageId)
      await getImagesByProductId(idProduct)
      await getProductById(idProduct)
      toast.success('Imagen eliminada.')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message ?? 'No se pudo eliminar la imagen.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center my-5">
          <div
            className="spinner-border text-primary"
            style={{ width: '3em', height: '3em' }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <div style={{ minHeight: '400px' }}>
          <div className="my-2">
            <div className={`card card-body `}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{dataDetalle?.name}</span>
                <div>
                  <img
                    src={dataDetalle?.imageBase64}
                    className="rounded-circle"
                    alt="NO_IMAGEN"
                    style={{ width: '50px', height: '50px' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 mt-4">
            <div className="col-md-6 ">
              <div className="card card-body">
                <p className="text-center text-muted">Ingresa imagen para el producto.</p>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Imagen del Producto.</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>

                {selectedImage && previewUrl && (
                  <div className=" d-flex gap-4 justify-content-center my-4">
                    <div className="rounded-4 border overflow-hidden">
                      <img src={previewUrl} alt="Preview" width="300px" />
                    </div>
                  </div>
                )}
                {ErrorFile && <Alert variant="warning"> {ErrorFile}</Alert>}

                <div className="text-center mt-3">
                  <Button
                    variant="contained"
                    color="primary"
                    loading={isLoadingUpload}
                    onClick={() => handleUpload(document.getElementById('formFile'))}
                    disabled={!selectedImage || isLoadingUpload}
                  >
                    Agregar Imagen
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="row g-2">
                {ImagesProduct && ImagesProduct.length === 0 && (
                  <div className="col-6 mx-auto">
                    <div className="alert alert-light">
                      <p className="text-center">Producto no tiene imagen.</p>
                    </div>
                  </div>
                )}
                {ImagesProduct &&
                  ImagesProduct.map((ima) => (
                    <div key={ima._id} className="col-4 col-md-6">
                      <div className="rounded-4   ">
                        <div
                          className={`card position-relative overflow-hidden  rounded-4  ${ima._id === dataDetalle?.image_id ? ' border-2 border-primary ' : ''}`}
                        >
                          <div className="position-absolute top-0 end-0">
                            <Button
                              variant={'danger'}
                              className="mt-1 me-1 text-white"
                              size="sm"
                              disabled={deletingId === ima._id}
                              onClick={() => handleDelete(ima._id)}
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </Button>
                          </div>
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <Button
                              variant="contained"
                              style={{ opacity: '0.4' }}
                              onClick={async () => {
                                try {
                                  const result = await updatedProducto(idProduct, {
                                    image_id: ima._id,
                                  })
                                  toast.success(result.data.message)
                                  await getImagesByProductId(idProduct)
                                  await getProductById(idProduct)
                                } catch (error) {
                                  console.log(error)
                                }
                              }}
                            >
                              Definir Imagen Principal
                            </Button>
                          </div>
                          <div className="overflow-hidden">
                            <img className="img-fluid" alt="test" src={ima.image} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImagesPage
