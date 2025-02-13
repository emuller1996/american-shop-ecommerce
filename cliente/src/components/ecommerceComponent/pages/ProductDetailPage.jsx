/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useProductos } from '../../../hooks/useProductos'
import { useParams } from 'react-router-dom'
import { ViewDollar } from '../../../utils'
import { Carousel } from 'react-bootstrap'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { getProductById, dataDetalle } = useProductos()

  useEffect(() => {
    getProductById(id)
  }, [id])

  return (
    <>
      <div className="mt-4" style={{ minHeight: '10vh' }}>
        <p className="text-center text-muted ">Detalle del Producto</p>
        <hr />
      </div>
      {dataDetalle && (
        <section className="section" id="product">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-7">
                <Carousel interval={1500}>
                  <Carousel.Item key={2123}>
                    <img className="d-block w-100" src={dataDetalle?.imageBase64} alt={`Slidess`} />
                  </Carousel.Item>
                  {dataDetalle?.Imagenes &&
                    dataDetalle?.Imagenes.map((im) => (
                      <Carousel.Item key={im._id}>
                        <img className="d-block w-100" src={im.image} alt={`Slidess`} />
                      </Carousel.Item>
                    ))}
                </Carousel>
              </div>
              <div className="col-lg-5">
                <div className="right-content">
                  <h4>{dataDetalle?.name}</h4>
                  <span className="d-block fs-4 fw-bold price">
                    {ViewDollar(dataDetalle?.price)}
                  </span>

                  <span>{dataDetalle?.brand}</span>
                  <div className="quote">
                    <i className="fa fa-quote-left"></i>
                    <p style={{ whiteSpace: 'pre-line' }}>{dataDetalle?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
