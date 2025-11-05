/* eslint-disable prettier/prettier */

import { useEffect } from 'react'
import { useClientes } from '../../../hooks/useClientes'
import React from 'react'
import { ViewDollar } from '../../../utils'

export default function ClienteComprasDetalle({ idClient }) {
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
                    <p className='m-0 text-center fw-bold'>Compra ID # {order._id}</p>
                    <div className="d-flex justify-content-between">
                    <span>Fecha</span>
                    <span className="" style={{ fontSize: '1.1em' }}>
                      {new Date(order.createdTime).toLocaleDateString()} {new Date(order.createdTime).toLocaleTimeString()}
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
                    <span className="">
                      {ViewDollar(order.total_order)}
                    </span>
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
