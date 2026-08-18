/* eslint-disable prettier/prettier */
import React from 'react'
import PropTypes from 'prop-types'
import nequi_log from './../assets/nequi-colombia-svgrepo-com.svg'
import tarjeta_log from './../assets/cards-outline-svgrepo-com.svg'
import "./MethodPayment.css"
MethodPayment.propTypes = {
  payment_method: PropTypes.string,
}
export default function MethodPayment({ payment_method }) {
  return (
    <>
    <div className='payment-method'>
      {payment_method === 'Nequi' && (
        <>
          <div>
            <img src={nequi_log} />
            <span>{payment_method}</span>
          </div>
        </>
      )}
      {payment_method === 'Tarjeta' && (
        <>
          <div>
            <img src={tarjeta_log} />
            <span>{payment_method}</span>
          </div>
        </>
      )}
      </div>
    </>
  )
}
