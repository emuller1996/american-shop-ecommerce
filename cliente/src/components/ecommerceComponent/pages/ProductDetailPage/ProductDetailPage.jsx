/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react'
import { useProductos } from '../../../../hooks/useProductos'
import { useNavigate, useParams } from 'react-router-dom'
import { ViewDollar, tieneDescuentoVigente, precioConDescuento } from '../../../../utils'
import { Carousel } from 'react-bootstrap'
import './ProductDetailPage.css'
import StockComponent from './components/StockComponent'
import { useLocalStorage } from '../../../../hooks/useLocalStorage'
import toast from 'react-hot-toast'
import AuthContext from '../../../../context/AuthContext'
import ConsultasProductoComponent from './components/ConsultasProductoComponent'
import RelatedProductsComponent from './components/RelatedProductsComponent'
import Seo from '../../../Seo'

const truncate = (text, max) =>
  text && text.length > max ? `${text.slice(0, max).trim()}…` : text

export default function ProductDetailPage() {
  const { id } = useParams()
  const { getProductById, dataDetalle } = useProductos()

  const enDescuento = tieneDescuentoVigente(dataDetalle)
  const precioFinal = precioConDescuento(dataDetalle)

  const productSchema = dataDetalle && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: dataDetalle.name,
    description: dataDetalle.description,
    image: dataDetalle.Imagenes?.[0]?.image,
    brand: { '@type': 'Brand', name: dataDetalle.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: precioFinal,
      availability: dataDetalle.Stock?.some((s) => s.stock != 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  const [sizeSelected, setSizeSelected] = useState(null)
  const { setCartEcommerceAmericanState, cartEcommerceAmericanState } = useContext(AuthContext)

  const [cartEcommerceAmerican, setCartEcommerceAmerican] = useLocalStorage(
    'cartEcommerceAmerican',
    [],
  )

  const navigate = useNavigate()

  useEffect(() => {
    getProductById(id)
  }, [id])

  return (
    <>
      <Seo
        title={dataDetalle?.name || 'Detalle del producto'}
        description={dataDetalle?.description ? truncate(dataDetalle.description, 160) : undefined}
        image={dataDetalle?.Imagenes?.[0]?.image}
        path={`/eco/${id}/producto`}
        jsonLd={productSchema}
      />
      <div className="mt-4" style={{ minHeight: '10vh' }}>
        <div className="card card-body position-relative card-cart">
          <button
            onClick={() => navigate(-1)}
            className='btn  position-absolute start-0"'
            style={{ zIndex: 10, top:"10px" }}
          >
            <i className="fa-solid fa-chevron-left me-2"></i>Atras
          </button>
          <h5 className="text-end mb-0">
            <i className="fa-regular fa-eye fa-xl me-2"></i>Detalle del Producto
          </h5>
        </div>
        <hr />
      </div>
      {dataDetalle && (
        <section className="section" id="product">
          <div className="glass-panel">
            <div className="row g-4">
              <div className="col-lg-7">
                <Carousel interval={1500}>
                  {/* <Carousel.Item key={2123}>
                    <img className="d-block w-100" src={dataDetalle?.imageBase64} alt={`Slidess`} />
                  </Carousel.Item> */}
                  {dataDetalle?.Imagenes &&
                    Array.isArray(dataDetalle?.Imagenes) &&
                    dataDetalle?.Imagenes.length === 0 && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '350px' }}
                      >
                        <p className="text-center text-muted mt-4">
                          NO HAY IMAGENES PARA ESTE PRODUCTO
                        </p>
                      </div>
                    )}
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
                  {enDescuento ? (
                    <div className="mb-2">
                      <span className="d-block text-muted text-decoration-line-through">
                        {ViewDollar(dataDetalle?.price)}
                      </span>
                      <span className="d-block fs-4 fw-bold price text-danger">
                        {ViewDollar(precioFinal)}{' '}
                        <span className="badge bg-danger align-middle">
                          -{dataDetalle.porcentaje_descuento}%
                        </span>
                      </span>
                      {dataDetalle.fecha_limite_descuento && (
                        <span className="d-block text-muted small mt-1">
                          <i className="fa-regular fa-clock me-1"></i>
                          Descuento válido hasta el{' '}
                          {new Date(
                            `${dataDetalle.fecha_limite_descuento}T00:00:00`,
                          ).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="d-block fs-4 mb-2 fw-bold price">
                      {ViewDollar(dataDetalle?.price)}
                    </span>
                  )}

                  <span className="brad_product">{dataDetalle?.brand}</span>
                  <hr />
                  <div className="quote">
                    <p style={{ whiteSpace: 'pre-line' }}>{dataDetalle?.description}</p>
                  </div>
                  <hr />
                  <div className="row g-3">
                    {dataDetalle &&
                      dataDetalle?.Stock.filter(sto=> sto.stock !=0).map((stock) => (
                        <StockComponent
                          key={stock?._id}
                          stock={stock}
                          setSizeSelected={setSizeSelected}
                          sizeSelected={sizeSelected}
                        />
                      ))}

                    {dataDetalle && dataDetalle?.Stock?.length === 0 && (
                      <div className="alert alert-warning text-center" role="alert">
                        No hay stock del producto
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      disabled={sizeSelected ? false : true}
                      onClick={() => {
                        console.log(sizeSelected)
                        if (!sizeSelected) {
                          toast.error('Elige una Talla')
                          return
                        }
                        if (!sizeSelected.cantidad) {
                          sizeSelected.cantidad = 1
                        }
                        sizeSelected.name_producto = dataDetalle.name
                        sizeSelected.price_producto = dataDetalle.price
                        console.log(
                          cartEcommerceAmerican.find((stk) => stk._id === sizeSelected._id),
                        )
                        if (cartEcommerceAmerican.find((stk) => stk._id === sizeSelected._id)) {
                          toast.error('Producto ya esta en el carrito')
                          return
                        } else {
                          setCartEcommerceAmerican([...cartEcommerceAmerican, sizeSelected])
                          setCartEcommerceAmericanState([...cartEcommerceAmerican, sizeSelected])
                          toast.success(`Producto se agrego al carrito correctamente.`, {
                            duration: 2000,
                          })
                          setSizeSelected(null)
                        }
                      }}
                      className="button-ecomerce"
                    >
                      Agregar al Carrito
                      <i className="ms-2 fa-solid fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

       <section>
         <div className="mt-4 mb-5">
           <ConsultasProductoComponent productId={id} />
         </div>
       </section>
       <RelatedProductsComponent />
    </>
  )
}
