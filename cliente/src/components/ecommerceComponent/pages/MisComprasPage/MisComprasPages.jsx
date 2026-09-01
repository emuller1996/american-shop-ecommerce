/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import { useClientes } from '../../../../hooks/useClientes'
import { ViewDollar } from '../../../../utils'
import { Step, StepLabel, Stepper } from '@mui/material'
import { Button, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import './MisComprasPages.css'
import StepperStatus from './components/StepperStatus'
import CardShopping from './components/CardShopping'
import { useNavigate } from 'react-router-dom'
import logo_ame from '../../../../assets/Logo.png'

export default function MisComprasPages() {
  const {
    getAllShoppingByClientes,
    loading,
    dataShopping,
    getShopDetailById,
    dataShopDetail,
    cancelarCompra,
  } = useClientes()
  const [show, setShow] = useState(false)
  const [ShopDetail, setShopDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [pedidoACancelar, setPedidoACancelar] = useState(null)
  const [motivoCancelacion, setMotivoCancelacion] = useState('')
  const [loadingCancelar, setLoadingCancelar] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    console.log('raro')

    getAllShoppingByClientes()
  }, [])

  const handleVerDetalle = async (shop) => {
    try {
      setShow(true)
      setShopDetail(null)
      setLoadingDetail(true)
      const result = await getShopDetailById(shop._id)
      setShopDetail(result.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAbrirCancelar = (shop) => {
    setPedidoACancelar(shop)
    setMotivoCancelacion('')
    setCancelError('')
    setShowCancel(true)
  }

  const handleConfirmarCancelar = async () => {
    if (!motivoCancelacion.trim()) return
    try {
      setLoadingCancelar(true)
      setCancelError('')
      const result = await cancelarCompra(pedidoACancelar._id, {
        note_client: motivoCancelacion,
      })
      toast.success(result.data.message)
      setShowCancel(false)
      getAllShoppingByClientes()
    } catch (error) {
      console.log(error)
      const resData = error?.response?.data
      setCancelError(
        resData?.detail ?? resData?.message ?? 'No se pudo cancelar el pedido.',
      )
    } finally {
      setLoadingCancelar(false)
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
                <CardShopping
                  shop={shop}
                  onVerDetalle={handleVerDetalle}
                  onCancelar={handleAbrirCancelar}
                />
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
                            {/* {pro?.image?.image && (
                              <img
                                src={pro.image.image ?? logo_ame}
                                alt="IMG_PRODUCT"
                                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                              />
                            )} */}
                            <span className="ms-3">{pro?.producto_data?.name || ''}</span>
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

      <Modal centered show={showCancel} onHide={() => setShowCancel(false)}>
        <Modal.Body>
          <p className="text-center">¿Seguro que deseas cancelar este pedido?</p>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Cuéntanos el motivo de la cancelación"
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
          />
          {cancelError && <p className="text-danger small mt-2">{cancelError}</p>}
          <div className="d-flex gap-3 justify-content-center mt-3">
            <button
              className="btn btn-danger text-white"
              disabled={loadingCancelar || !motivoCancelacion.trim()}
              onClick={handleConfirmarCancelar}
            >
              {loadingCancelar ? 'Cancelando...' : 'Sí, Cancelar Pedido'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowCancel(false)}>
              Volver
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
