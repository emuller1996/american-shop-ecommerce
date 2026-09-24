/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import { usePublicaciones } from '../../../../hooks/usePublicaciones'

export default function PublicacionesCarousel() {
  const { getPublicacionesPublicadas, dataPublicadas } = usePublicaciones()

  useEffect(() => {
    getPublicacionesPublicadas()
  }, [])

  if (!dataPublicadas || dataPublicadas.length === 0) return null

  return (
    <Carousel
      data-bs-theme="dark"
      prevIcon={
        <>
          {' '}
          <i className="text-danger fa-2xl fa-solid fa-chevron-left"></i>
        </>
      }
      nextIcon={
        <>
          {' '}
          <i className="text-danger fa-2x fa-solid fa-chevron-right"></i>
        </>
      }
    >
      {dataPublicadas.map((pub) => (
        <Carousel.Item key={pub._id}>
          <div className="row align-items-center">
            <div
              className={
                pub.posicion_imagen === 'izquierda'
                  ? 'mx-auto col-md-8 col-lg-6'
                  : 'mx-auto col-md-8 col-lg-6 order-lg-last'
              }
            >
              <img className="img-fluid" src={pub.image} alt={pub.title} />
            </div>
            <div className="col-lg-6">
              <div className="glass-panel carousel-glass-content animate-fade-in">
                <h1 className="h1 text-danger">
                  <b>{pub.title}</b>
                </h1>
                {pub.subtitle && <h3 className="h2">{pub.subtitle}</h3>}
                {pub.description && (
                  <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                    {pub.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
