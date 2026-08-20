/* eslint-disable prettier/prettier */
import React from 'react'
import PropTypes from 'prop-types';
import MethodPayment from '../../../../components/ecommerceComponent/pages/MisComprasPage/components/MethodPayment';
import { ViewDollar } from '../../../../utils';

InfoPedidoDetalle.propTypes = {
  pedido: PropTypes.object,
}
export default function InfoPedidoDetalle({ pedido }) {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <span className="d-flex justify-content-center text-muted">Datos de Cliente</span>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span className="">Nombre</span>
              <span className="">{pedido?.cliente?.name_client}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Correo</span>
              <span className="">{pedido?.cliente?.email_client}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Telefono</span>
              <span className="">{pedido?.cliente?.phone_client}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Num Documento</span>
              <span className="">{pedido?.cliente?.number_document_client}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">
                {' '}
                <br />
              </span>
              <span className=""></span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <span className="d-flex justify-content-center text-muted">Datos de Envio</span>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span className="">Cuidad</span>
              <span className="">{pedido?.address?.city}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Departamento</span>
              <span className="">{pedido?.address?.departament}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Direccion</span>
              <span className="">{pedido?.address?.address}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Barrio</span>
              <span className="">{pedido?.address?.neighborhood}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Referencia</span>
              <span className="">{pedido?.address?.reference}</span>
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
              <MethodPayment payment_method={pedido?.payment_method} />
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Estado</span>
              <span className="text-uppercase ">{pedido?.mercadopago_data?.status}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Fecha</span>
              <span className="">{pedido?.mercadopago_data?.date_created}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Ultimos 4 Digitos de la Tarjeta</span>
              <span className="">
                {pedido?.mercadopago_data?.card?.first_six_digits} ***********{' '}
                {pedido?.mercadopago_data?.card?.last_four_digits}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Monto Transaction {`(MercadoPago)`}</span>
              <span className="text-success fw-semibold">
                {ViewDollar(pedido?.mercadopago_data?.transaction_amount)}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="">Monto Tarifa. {`(MercadoPago)`}</span>
              <span className="text-warning fw-semibold">
                {ViewDollar(pedido?.mercadopago_data?.fee_details?.[0]?.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
