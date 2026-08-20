/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { StatusOrderOptions, stylesSelect, themeSelect } from '../../../utils/optionsConfig'
import Select from 'react-select'
import { Badge, Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useOrden } from '../../../hooks/useOrden'
import { ViewDollar } from '../../../utils'
import toast from 'react-hot-toast'
import MethodPayment from '../../../components/ecommerceComponent/pages/MisComprasPage/components/MethodPayment'
import TableProductosDetalles from './components/TableProductosDetalles'
import InfoPedidoDetalle from './components/InfoPedidoDetalle'

export default function PedidoDetallesPage() {
  const { idOrder } = useParams()

  const { getOrdenById, dataDetalle, loading, changeStatusOrder } = useOrden()

  useEffect(() => {
    getOrdenById(idOrder)
  }, [idOrder])

  console.log(dataDetalle)

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
      {dataDetalle && (
        <>
          <div className="card p-3 mb-3">
            <div className="row">
              <div className="col-md-6">
                <p className="m-0 text-center fw-bold fs-5">ID # {dataDetalle._id}</p>
                <p className="m-0 ">Total Orden</p>
                <p className="m-0 fs-5 fw-semibold"> {ViewDollar(dataDetalle.total_order)}</p>
              </div>
              <div className="col-md-6">
                <Form.Label htmlFor="status">Cambiar de Estado</Form.Label>
                {dataDetalle && (
                  <Select
                    name={'status'}
                    id="status"
                    placeholder=""
                    defaultValue={StatusOrderOptions.find(
                      (sta) => sta.value === dataDetalle?.status,
                    )}
                    onChange={async (e) => {
                      try {
                        await changeStatusOrder(idOrder, { status: e?.value })
                        toast.success(`Se ha cambiado de estado la Orden.`)
                      } catch (error) {
                        console.log(error)
                      }
                    }}
                    styles={stylesSelect}
                    theme={themeSelect}
                    options={StatusOrderOptions}
                  />
                )}
              </div>
            </div>
          </div>
          {dataDetalle && <InfoPedidoDetalle pedido={dataDetalle} />}
          {dataDetalle && <TableProductosDetalles products={dataDetalle?.products} />}
        </>
      )}
    </div>
  )
}
