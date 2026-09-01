/* eslint-disable prettier/prettier */
import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago'
import { IconButton } from '@mui/material'
import { ViewDollar } from '../../../../../utils'
import { NonCancelableStatuses } from '../../../../../utils/optionsConfig'
import MethodPayment from './MethodPayment'

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

CardShopping.propTypes = {
  shop: PropTypes.object.isRequired,
  onVerDetalle: PropTypes.func,
  onCancelar: PropTypes.func,
}

export default function CardShopping({ shop, onVerDetalle, onCancelar }) {
  return (
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

        {/* Total destacado */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-semibold">Total</span>
          <span className="fs-5 fw-bold text-success">{ViewDollar(shop.total_order ?? 0)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">Metodo de Pago</small>
          {shop && <MethodPayment payment_method={shop?.payment_method} />}
        </div>

        {/* Acción */}
        <div className="text-center mt-3">
          <IconButton title="Ver Detalle Compra" onClick={() => onVerDetalle?.(shop)}>
            <i className="fa-solid fa-eye"></i>
          </IconButton>
          {!NonCancelableStatuses.includes(shop.status) && (
            <IconButton title="Cancelar Pedido" color="error" onClick={() => onCancelar?.(shop)}>
              <i className="fa-solid fa-ban"></i>
            </IconButton>
          )}
        </div>
      </div>
    </div>
  )
}
