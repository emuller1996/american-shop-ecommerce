/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import { useClientes } from '../../../../hooks/useClientes'
import ReactTimeAgo from 'react-time-ago'
import { ViewDollar } from '../../../../utils'
import { IconButton } from '@mui/material'
import { Modal } from 'react-bootstrap'
import './MisComprasPages.css'
export default function MisComprasPages() {
  const { getAllShoppingByClientes, loading, dataShopping } = useClientes()
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log('raro')

    getAllShoppingByClientes()
  }, [])
  return (
    <div className="container mt-5">
      <p className="text-center fs-4">Mis Compras</p>
      <p className=" text-center text-muted">
        Bienvenido, en esta sección encontraras la información de tus compras.
      </p>
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
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <ReactTimeAgo date={shop.createdTime} locale="en-CO" />
                      </span>
                      <span className="badge text-bg-primary">{shop?.status}</span>
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
                        onClick={(e) => {
                          setShow(true)
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
          <div className="row g-3">
            <div className="col-md-6">
              <span className="d-flex justify-content-center text-muted">Datos de Envio</span>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <span className="">Cuidad</span>
                    <span className="">Buenaventuara</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Departamento</span>
                    <span className="">Valle</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Direccion</span>
                    <span className="">TEst</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Barrio</span>
                    <span className="">Inde</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Referencia</span>
                    <span className="">P2</span>
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
                <tr className="">
                  <td scope="row">Producto</td>
                  <td>1.250.222</td>
                  <td>1</td>
                  <td>M</td>
                  <td>1.250.222</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
