/* eslint-disable prettier/prettier */

import { useEffect } from 'react'
import { useClientes } from '../../../hooks/useClientes'
import React from 'react'
import { ViewDollar } from '../../../utils'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function ClienteComprasDetalle({ idClient }) {
  ClienteComprasDetalle.propTypes = {
    idClient: PropTypes.string.isRequired,
  }
  const { getShoppingByClientId, dataShopping } = useClientes()

  useEffect(() => {
    getShoppingByClientId(idClient)
  }, [idClient])

  return (
    <div>
      <div className="row g-2">
        {dataShopping &&
          dataShopping.map((order) => (
            <div className="col-md-6" key={order._id}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="m-0 text-center fw-bold fs-5">ID # {order._id}</p>
                    <Link
                      target="_blank"
                      to={`/d/ordenes/${order._id}/detalle`}
                      title="Detalle Orden."
                      className="btn text-white btn-info btn-sm me-2"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </Link>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Fecha</span>
                    <span className="" style={{ fontSize: '1.1em' }}>
                      {new Date(order.createdTime).toLocaleDateString()}{' '}
                      {new Date(order.createdTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Estado</span>
                    <span className="badge bg-primary" style={{ fontSize: '1.1em' }}>
                      {order.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total</span>
                    <span className="">{ViewDollar(order.total_order)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total de Productos</span>
                    <span className="" style={{ fontSize: '1.1em' }}>
                      {order.products.length}
                    </span>
                  </div>
                  <div className="row"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
