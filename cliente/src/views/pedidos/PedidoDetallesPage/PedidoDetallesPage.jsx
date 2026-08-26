/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrden } from '../../../hooks/useOrden'
import { ViewDollar } from '../../../utils'
import TableProductosDetalles from './components/TableProductosDetalles'
import InfoPedidoDetalle from './components/InfoPedidoDetalle'
import FormChangeStatus from './components/FormChangeStatus'

export default function PedidoDetallesPage() {
  const { idOrder } = useParams()
  const [Draw, setDraw] = useState(1)

  const { getOrdenById, dataDetalle, loading, changeStatusOrder } = useOrden()

  useEffect(() => {
    getOrdenById(idOrder)
  }, [idOrder, Draw])

  return (
    <div>
      {loading && (
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
      {dataDetalle && !loading && (
        <>
          <div className="card p-3 mb-3">
            <div className="row">
              <div className="col-md-6">
                <p className="m-0 text-center fw-bold fs-5">ID # {dataDetalle._id}</p>
                <p className="m-0 ">Total Orden</p>
                <p className="m-0 fs-5 fw-semibold"> {ViewDollar(dataDetalle.total_order)}</p>
              </div>
              <div className="col-md-6">
                { dataDetalle && <FormChangeStatus idOrder={dataDetalle._id} changeStatusOrder={changeStatusOrder} order={dataDetalle} />}
              </div>
            </div>
          </div>
          {dataDetalle && <InfoPedidoDetalle pedido={dataDetalle} />}
          {dataDetalle && (
            <TableProductosDetalles
              refreshOrder={() => {
                setDraw((status) => ++status)
              }}
              products={dataDetalle?.products}
            />
          )}
        </>
      )}
    </div>
  )
}
