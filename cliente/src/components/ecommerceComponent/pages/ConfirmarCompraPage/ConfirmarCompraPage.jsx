/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react'
import { useProductos } from '../../../../hooks/useProductos'
import AuthContext from '../../../../context/AuthContext'
import { ViewDollar, tieneDescuentoVigente, precioConDescuento } from '../../../../utils'
import { Accordion, Spinner } from 'react-bootstrap'
import './ConfirmarCompraPage.css'
import SelectAddressShop from './components/SelectAddressShop'
import WompiButton from './components/WompiButton'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import logoNequi from '../../../../assets/nequi-logo.svg'
import pagosWompiImg from '../../../../assets/pagos_wompi.png'
import { useLocalStorage } from '../../../../hooks/useLocalStorage'
import Seo from '../../../Seo'

export default function ConfirmarCompraPage({}) {
  const { validateProductoCart } = useProductos()

  const [direccionSelecionada, setDireccionSelecionada] = useState(null)
  const [isLoadingNequi, setIsLoadingNequi] = useState(false)

  const [pasoActive, setPasoActive] = useState('0')
  const [cartEcommerceAmerican, setCartEcommerceAmerican] = useLocalStorage(
    'cartEcommerceAmerican',
    [],
  )

  useEffect(() => {
    getAllProductCart()
  }, [])

  const [Data, setData] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [total, settotal] = useState(null)
  const [nequiOrder, setNequiOrder] = useState(null)

  const { cartEcommerceAmericanState, setCartEcommerceAmericanState, client } =
    useContext(AuthContext)

  console.log(client)

  const getAllProductCart = async () => {
    try {
      setisLoading(true)
      const rest = cartEcommerceAmericanState.map(async (pro) => {
        try {
          const resss = await validateProductoCart(pro._id, pro)
          return { ...resss.data.stock, cantidad: pro.cantidad }
        } catch (error) {
          setCartEcommerceAmericanState(
            cartEcommerceAmericanState.filter((c) => c._id !== pro?._id),
          )
          setCartEcommerceAmerican(cartEcommerceAmericanState.filter((c) => c._id !== pro?._id))
          toast.error(`Se Borro un producto de tu carrito por que  no esta disponible.`)
          return null
        }
      })
      const res2 = await Promise.all(rest)
      const productosValidos = res2.filter((c) => c && c.product)
      const totalCarrito = productosValidos.reduce(
        (acumulador, actual) =>
          acumulador + precioConDescuento(actual.product) * (actual.cantidad ?? 0),
        0,
      )
      settotal(totalCarrito)
      setData(productosValidos)
    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  const buildOrderData = () => ({
    products: Data.map((stk) => ({
      stock_id: stk._id,
      cantidad: stk.cantidad,
      product_id: stk.product_id,
      price: precioConDescuento(stk.product),
    })),
    address_id: direccionSelecionada,
    cliente: {
      client_id: client._id,
      name_client: client.name_client,
      email_client: client.email_client,
      phone_client: client.phone_client,
      number_document_client: client.number_document_client,
    },
    total_order: total,
  })

  const handleNequiPayment = async () => {
    try {
      setIsLoadingNequi(true)
      const orderData = buildOrderData()

      const response = await axios.post('/ordenes/nequi_payment', { orderData })
      if (response.data.order) {
        setCartEcommerceAmericanState([])
        setCartEcommerceAmerican([])
        setNequiOrder(response.data.order)
        toast.success('Orden creada. Ahora confirma el pago por WhatsApp')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al generar la orden con Nequi')
    } finally {
      setIsLoadingNequi(false)
    }
  }

  const goToWhatsApp = () => {
    const phone = import.meta.env.VITE_NEQUI_PHONE // Reemplazar con el número del negocio
    const message = `Hola! Quiero confirmar mi pago por Nequi.\n\n*Orden:* ${nequiOrder._id}\n*Cliente:* ${client.name_client}\n*Total:* ${ViewDollar(total)}\n\nAdjunto el comprobante de pago.`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setPasoActive('2')
  }

  const navigate = useNavigate()

  return (
    <div className="mt-4 mb-5" style={{ minHeight: '50vh' }}>
      <Seo noindex title="Confirmar Compra" />
      <div className="card card-body position-relative card-cart mb-4">
        <button
          onClick={() => navigate(-1)}
          className='btn  position-absolute start-0"'
          style={{ zIndex: 10, top: '10px' }}
        >
          <i className="fa-solid fa-chevron-left me-2"></i>Atras
        </button>
        <h5 className="text-center mb-0">
          <i className="fa-solid fa-cart-shopping fa-xl me-2"></i>CONFIRMAR MI COMPRA
        </h5>
      </div>
      <div className="row g-4">
        <div className="col-md-6 col-payment">
          <Accordion className="checkout-accordion" defaultActiveKey="0" activeKey={pasoActive}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Direccion de Envio</Accordion.Header>
              <Accordion.Body>
                <SelectAddressShop
                  setDireccionSelecionada={setDireccionSelecionada}
                  direccionSelecionada={direccionSelecionada}
                  setPasoActive={setPasoActive}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Método de Pago</Accordion.Header>
              <Accordion.Body>
                <div>
                  {total && pasoActive === '1' && (
                    <div className="d-flex flex-column gap-3">
                      {/* Opción principal: Wompi */}
                      <div className="checkout-payment-card checkout-payment-recommended">
                        <span className="checkout-payment-badge">Recomendado</span>
                        <p className="text-center text-muted small mb-3">
                          Paga de forma rápida y segura con tarjeta, PSE, Nequi y más.
                        </p>
                        {!nequiOrder && (
                          <WompiButton
                            orderData={buildOrderData()}
                            total={total}
                            onSuccess={() => {
                              setCartEcommerceAmericanState([])
                              setCartEcommerceAmerican([])
                              setPasoActive('2')
                            }}
                          />
                        )}
                        <div className="text-center mt-3">
                          <img
                            src={pagosWompiImg}
                            alt="Medios de pago aceptados: Wompi, Visa, Mastercard, PSE, Nequi"
                            className="checkout-payment-methods-img"
                          />
                        </div>
                      </div>

                      <div className="checkout-payment-divider">
                        <span>o</span>
                      </div>

                      {/* Opción alterna: Nequi manual */}
                      <div className="checkout-payment-card">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                          <img src={logoNequi} alt="Nequi" style={{ height: '26px' }} />
                          <span className="fw-bold">Pago manual por Nequi</span>
                        </div>

                        {!nequiOrder ? (
                          <>
                            <ol className="checkout-payment-instructions">
                              <li>
                                Realiza tu pago por Nequi al número{' '}
                                <strong>{import.meta.env.VITE_NEQUI_PHONE} (Est****  Mul****)</strong> por el valor
                                de <strong>{ViewDollar(total)}</strong>.
                              </li>
                              <li>Presiona el botón para generar tu pedido.</li>
                              <li>
                                Envía el comprobante de pago por WhatsApp para confirmar tu compra.
                              </li>
                            </ol>
                            <button
                              disabled={isLoadingNequi}
                              className="btn btn-light w-100 text-dark fw-bold border rounded-3"
                              onClick={handleNequiPayment}
                            >
                              {isLoadingNequi ? (
                                <Spinner size="sm" />
                              ) : (
                                'Ya realicé el pago, generar pedido'
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="alert alert-success small">
                              Pedido generado. Ahora envía tu comprobante de pago por WhatsApp para
                              confirmar tu compra.
                            </div>
                            <button
                              className="btn btn-primary w-100 text-white fw-bold rounded-3"
                              onClick={goToWhatsApp}
                            >
                              <i className="fa-brands fa-whatsapp me-2"></i>
                              Confirmar Pago en WhatsApp
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-danger text-white rounded-3"
                      onClick={() => {
                        setPasoActive('0')
                      }}
                    >
                      Atras
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Confirmación de Orden/Pedido</Accordion.Header>
              <Accordion.Body>
                <p className="text-center fs-5">¡Muchas gracias por tu compra! 🎉</p>
                <p>
                  Tu pedido se ha realizado con éxito. En breve recibirás un correo electrónico con
                  todos los detalles de tu compra. Prepararemos tu envío lo antes posible. Para
                  consultar el estado de tu pedido o revisar tus compras anteriores, dirígete a la
                  sección “Mis compras” en tu cuenta.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="col-md-6 col-detail">
          <div style={{ overflow: 'hidden', borderRadius: '1em' }}>
            <div className="table-responsive">
              <table className="table ">
                <thead>
                  <tr>
                    <td scope="col">Producto</td>
                    <td align="center" scope="col">
                      Unidades
                    </td>
                    <td align="center" scope="col">
                      Tallta
                    </td>
                    <td scope="col">Precio</td>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={5}>
                        <div className="d-flex justify-content-center my-4">
                          <div
                            className="spinner-border"
                            role="status"
                            style={{ color: '#5b64db' }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {Data &&
                    Data.map((st) => (
                      <tr key={st?._id} className="">
                        <td style={{ color: '#696969' }}>{st?.product?.name}</td>
                        <td style={{ color: '#696969' }} align="center">
                          {st?.cantidad}
                        </td>
                        <td style={{ color: '#696969' }}>{st?.size}</td>
                        <td style={{ color: '#696969' }}>
                          {tieneDescuentoVigente(st?.product) ? (
                            <div className="d-flex flex-column">
                              <span className="text-muted text-decoration-line-through small">
                                {ViewDollar(st?.product?.price)}
                              </span>
                              <span className="fw-bold text-danger">
                                {ViewDollar(precioConDescuento(st?.product))}
                              </span>
                            </div>
                          ) : (
                            ViewDollar(st?.product?.price)
                          )}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td
                      style={{ borderRadius: '0 0 0 0.7em', border: 'none' }}
                      colSpan={2}
                      align="right"
                    >
                      <span className="fw-bold fs-5">Total</span>
                    </td>
                    <td style={{ border: 'none' }} colSpan={1}>
                      <span className=" fs-5">
                        {Data &&
                          ViewDollar(
                            Data.reduce(
                              (acumulador, actual) =>
                                acumulador + precioConDescuento(actual.product) * actual.cantidad,
                              0,
                            ),
                          )}
                      </span>
                    </td>
                    <td style={{ borderRadius: '0 0 0.7em 0 ', border: 'none' }}></td>
                  </tr>
                </tbody>
              </table>
              {/* <p className="text-end me-5">
          Total{' '}
          {ViewDollar(
            cartEcommerceAmericanState.reduce(
              (acumulador, actual) => acumulador + actual.price_producto,
              0,
            ),
          )}
        </p> */}
            </div>
          </div>
          <hr />
          <h6 className="text-center fs-4 fw-bold">Nota!</h6>
          <p>
            Es un placer Atenderte, Queremos informarle que el costo del envío para su pedido será
            manejado mediante el método de &quot;Contra Entrega&quot;. Esto significa que el pago
            del
            <span className="text-uppercase  fw-bold  text-success ">{' valor del ENVIO '}</span>
            se realizará en el momento de la entrega de sus productos.
          </p>
          <p>
            Este método le debe pagar el envío directamente al mensajero al recibir solo del
            <span className="text-uppercase  fw-bold  text-success ">{' valor del ENVIO '}</span>
            su pedido. Agradecemos su confianza en nuestros servicios y estamos aquí para cualquier
            pregunta adicional que pueda tener.
          </p>
        </div>
      </div>
    </div>
  )
}
