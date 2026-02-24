/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import { useClientes } from '../../../../hooks/useClientes'
import ReactTimeAgo from 'react-time-ago'
import { ViewDollar } from '../../../../utils'
import { IconButton, Step, StepLabel, Stepper } from '@mui/material'
import { Button, Modal } from 'react-bootstrap'
import './MisComprasPages.css'
import StepperStatus from './components/StepperStatus'
import { useNavigate } from 'react-router-dom'
export default function MisComprasPages() {
  const { getAllShoppingByClientes, loading, dataShopping, getShopDetailById, dataShopDetail } =
    useClientes()
  const [show, setShow] = useState(false)
  const [ShopDetail, setShopDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('raro')

    getAllShoppingByClientes()
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-warning text-dark'
      case 'Aprobado':
        return 'bg-success'
      case 'Cancelado':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <div className="container mt-5 mb-5">
      {/* <p className="text-center fs-4">Mis Compras</p> */}
      <div className="card card-body position-relative card-cart mb-4">
        <button
          onClick={() => navigate(-1)}
          className='btn  position-absolute start-0"'
          style={{ zIndex: 10, top: '10px' }}
        >
          <i className="fa-solid fa-chevron-left me-2"></i>Atras
        </button>
        <h5 className="text-end mb-0">
          <i className="fa-solid fa-box-open  me-2"></i>Mis Compras
        </h5>
      </div>
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div style={{ minHeight: '65vh' }}>
        <div className="row g-3 ">
          {dataShopping &&
            dataShopping.map((shop) => (
              <div key={shop._id} className="col-md-6">
                {/* <div className="card card-mi-compra">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <ReactTimeAgo date={shop.createdTime} locale="en-CO" />
                      </span>
                      <span className="badge bg-badged-eco" >{shop?.status}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="card-text">Total</span>
                      <span className="card-title">{`${ViewDollar(shop.total_order ?? 0)}`}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="card-text">Num. Productos</span>
                      <span className="card-title">{shop.products.length}</span>
                    </div>
                    <div className="text-center">
                      <IconButton
                        title="Ver Detalle Compra"
                        onClick={async (e) => {
                          try {
                            setShow(true)
                            console.log(shop)
                            setShopDetail(null)
                            setLoadingDetail(true)
                            const result = await getShopDetailById(shop._id)
                            console.log(result.data)
                            setShopDetail(result.data)
                          } catch (error) {
                            console.log(error)
                          } finally {
                            setLoadingDetail(false)
                          }
                        }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </IconButton>
                    </div>
                  </div>
                </div> */}
                <div className="card card-mi-compra shadow-sm">
                  <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <div className="fw-semibold">Order #{shop._id.slice(-6)}</div>
                        <small className="text-muted">
                          <ReactTimeAgo date={shop.createdTime} locale="en-CO" />
                        </small>
                      </div>

                      <span className={`badge ${getStatusClass(shop.status)}`}>{shop.status}</span>
                    </div>

                    {/* Info resumida */}
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Productos</small>
                      <span>{shop.products.length}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Metodo de Pago</small>
                      <span>{shop.payment_method}</span>
                    </div>

                    {/* Total destacado */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-semibold">Total</span>
                      <span className="fs-5 fw-bold text-success">
                        {ViewDollar(shop.total_order ?? 0)}
                      </span>
                    </div>

                    {/* Acción */}
                    <div className="text-center mt-3">
                      <IconButton
                        title="Ver Detalle Compra"
                        onClick={async (e) => {
                          try {
                            setShow(true)
                            console.log(shop)
                            setShopDetail(null)
                            setLoadingDetail(true)
                            const result = await getShopDetailById(shop._id)
                            console.log(result.data)
                            setShopDetail(result.data)
                          } catch (error) {
                            console.log(error)
                          } finally {
                            setLoadingDetail(false)
                          }
                        }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Modal
        centered
        show={show}
        onHide={() => {
          setShow(false)
        }}
        size="lg"
      >
        <Modal.Body>
          {loadingDetail && (
            <div className="text-center my-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {ShopDetail && (
            <>
              <StepperStatus status={ShopDetail?.status} />
              <div className="row g-3">
                <div className="col-md-6">
                  <span className="d-flex justify-content-center text-muted">Datos de Envio</span>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <span className="">Cuidad</span>
                        <span className="">{ShopDetail?.address?.city ?? ''}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Departamento</span>
                        <span className="">{ShopDetail?.address?.departament ?? ''}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Direccion</span>
                        <span className="">{ShopDetail?.address?.address ?? ''}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Barrio</span>
                        <span className="">{ShopDetail?.address?.neighborhood ?? ''}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Referencia</span>
                        <span className="">{ShopDetail?.address?.reference ?? ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <span className="d-flex justify-content-center text-muted">Datos de Pago</span>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <span className="">Metodo de Pago</span>
                        <span className="">TARJETA</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Estado</span>
                        <span className="">PAGADO</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Fecha</span>
                        <span className="">TEst</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Ultimos 4 Digitos de la Tarjeta</span>
                        <span className="">Inde</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="">Valor Pagado</span>
                        <span className="">11213</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Precio U.</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Talla</th>
                      <th scope="col">Precio Total.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ShopDetail?.products?.map((pro) => (
                      <tr key={pro._id} className="">
                        <td width={'450px'} scope="row">
                          <div>
                            <img
                              src={pro.image}
                              alt="IMG_PRODUCT"
                              style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                            />
                            <span className="ms-3">{pro.producto_data.name}</span>
                          </div>
                        </td>
                        <td>{ViewDollar(pro.price)}</td>
                        <td>{pro.cantidad}</td>
                        <td>{pro.stock_data.size}</td>
                        <td>{ViewDollar(pro.price * pro.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center">
                Valor Total
                <p className="fw-bold fs-5">
                  {ShopDetail?.total_order ? ViewDollar(ShopDetail?.total_order) : ''}
                </p>
              </div>
            </>
          )}

          <div className="text-center">
            <Button
              onClick={() => {
                setShow(false)
              }}
              variant="danger"
              className="text-white"
            >
              <i className="fa-solid fa-xmark me-2"></i>Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
