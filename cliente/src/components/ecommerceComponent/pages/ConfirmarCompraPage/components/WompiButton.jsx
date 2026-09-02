/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Spinner } from 'react-bootstrap'

WompiButton.propTypes = {
  orderData: PropTypes.object,
  total: PropTypes.number,
  onSuccess: PropTypes.func,
  disabled: PropTypes.bool,
}

export default function WompiButton({ orderData, total, onSuccess, disabled }) {
  const [loadingWompi, setLoadingWompi] = useState(false)

  const handlePagarConWompi = async () => {
    try {
      setLoadingWompi(true)
      const amountInCents = Math.round(total * 100)

      const { data } = await axios.post('/ordenes/wompi_signature', { amountInCents })

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference: data.reference,
        publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
        signature: { integrity: data.signature },
      })

      checkout.open(async (result) => {
        try {
          const transaction = result?.transaction
          if (!transaction?.id) {
            toast.error('Pago cancelado.')
            return
          }

          const response = await axios.post('/ordenes/wompi_payment', {
            orderData,
            transactionId: transaction.id,
          })

          if (response.data.order) {
            toast.success('Se ha generado su pedido correctamente.')
            onSuccess?.(response.data.order)
          } else {
            toast.error('El pago con Wompi no fue aprobado.')
          }
        } catch (error) {
          console.error(error)
          toast.error('Error al confirmar el pago con Wompi.')
        } finally {
          setLoadingWompi(false)
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al iniciar el pago con Wompi.')
      setLoadingWompi(false)
    }
  }

  return (
    <button
      disabled={disabled || loadingWompi}
      className="btn btn-dark w-100 text-white fw-bold"
      onClick={handlePagarConWompi}
    >
      {loadingWompi ? (
        <Spinner size="sm" />
      ) : (
        <>
          <i className="fa-solid fa-credit-card me-2"></i>
          Pagar con Wompi
        </>
      )}
    </button>
  )
}
