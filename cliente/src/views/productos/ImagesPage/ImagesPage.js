import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { useProductos } from '../../../hooks/useProductos'
import { useParams } from 'react-router-dom'
import {
  postCreateProductoImageService,
  putUpdateProductoService,
} from '../../../services/productos.services'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'

const ImagesPage = ({ idProduct }) => {
  ImagesPage.propTypes = {
    idProduct: PropTypes.string,
  }
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setisLoading] = useState(true)
  const [base64Image, setBase64Image] = useState(null)

  const { getImagesByProductId, ImagesProduct, getProductById, dataDetalle } = useProductos()

  //const { idProduct } = useParams()

  useEffect(() => {
    if (idProduct) {
      getAllDataFetch()
    }
  }, [idProduct])

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      convertToBase64(file)
    }
  }
  const convertToBase64 = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setBase64Image(reader.result)
    }
    reader.onerror = (error) => {
      console.error('Error al convertir la imagen a Base64:', error)
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
                  <Form.Label>Imagen de la Funcion</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>

                {selectedImage && (
                  <div className=" d-flex gap-4 justify-content-center my-4">
                    <div className="rounded-4 border overflow-hidden">
                      <img src={URL.createObjectURL(selectedImage)} alt="Preview" width="300px" />
                    </div>
                  </div>
                )}

                <div className="text-center mt-3">
                  <Button
                    onClick={async () => {
                      await postCreateProductoImageService({ image: base64Image }, idProduct)
                      await getImagesByProductId(idProduct)
                      setSelectedImage(null)
                      setBase64Image(null)
                      console.log(base64Image)
                    }}
                    disabled={base64Image === null ? true : false}
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
                      <div className="rounded-4  overflow-hidden ">
                        <div
                          className={`card position-relative overflow-hidden rounded-4  ${ima._id === dataDetalle?.image_id ? ' border-2 border-primary ' : ''}`}
                        >
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <Button
                              style={{ opacity: '0.4' }}
                              onClick={async () => {
                                try {
                                  const result = await putUpdateProductoService(idProduct, {
                                    image_id: ima._id,
                                  })
                                  console.log(result.data)
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
                          <img alt="test" src={ima.image} />
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
