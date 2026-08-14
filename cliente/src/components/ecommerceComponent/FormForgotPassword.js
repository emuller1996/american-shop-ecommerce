import React, { useState } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { postForgotPasswordClientesService } from '../../services/clientes.services'
import { Alert } from 'react-bootstrap'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import './FormLogin.css'

const FormForgotPassword = ({ onBackToLogin }) => {
  FormForgotPassword.propTypes = {
    onBackToLogin: PropTypes.func,
  }
  const [ErrorText, setErrorText] = useState({ status: false, message: '', detail: '' })
  const [isLoadingForm, setisLoadingForm] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setisLoadingForm(true)
      setErrorText({ status: false, message: '', detail: '' })
      const result = await postForgotPasswordClientesService(data)
      toast.success(result.data.message)
      setSent(true)
    } catch (error) {
      console.error(error)
      const resData = error?.response?.data
      setErrorText({
        status: true,
        message: resData?.message ?? 'No se pudo procesar la solicitud.',
        detail:
          resData?.detail ??
          'Verifica tu conexión e intenta de nuevo. Si el problema persiste, contáctanos.',
      })
    } finally {
      setisLoadingForm(false)
    }
  }

  return (
    <CContainer className="px-0 py-4" lg>
      <div className="glass-form-container">
        {sent ? (
          <>
            <h2 className="text-center glass-form-title">Revisa tu correo</h2>
            <p className="text-center">
              Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <div className="glass-form-footer text-center">
              <span className="glass-form-link" onClick={onBackToLogin}>
                Volver a iniciar sesión
              </span>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center glass-form-title">¿Olvidaste tu contraseña?</h2>
            <p className="text-center small">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
            <div className="form-floating glass-input-group">
              <input
                type="email"
                className="form-control glass-input"
                {...register('email_client', { required: true })}
                id="email_client_forgot"
                placeholder="nombre@ejemplo.com"
              />
              <label htmlFor="email_client_forgot" className="glass-input-label">
                Correo Electrónico
              </label>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="button-ecomerce w-100" disabled={isLoadingForm}>
                {isLoadingForm ? (
                  <>
                    <CSpinner size="sm" className="me-2" /> Enviando...
                  </>
                ) : (
                  'Enviar enlace de restablecimiento'
                )}
              </button>
            </div>

            <div className="glass-form-footer text-center">
              <span className="glass-form-link" onClick={onBackToLogin}>
                Volver a iniciar sesión
              </span>
            </div>

            {ErrorText.status && (
              <div className="mt-4">
                <Alert className="glass-alert" variant="warning">
                  <Alert.Heading className="h6">{ErrorText?.message}</Alert.Heading>
                  <p className="small mb-0">{ErrorText?.detail}</p>
                </Alert>
              </div>
            )}
          </form>
        )}
      </div>
    </CContainer>
  )
}

export default FormForgotPassword
