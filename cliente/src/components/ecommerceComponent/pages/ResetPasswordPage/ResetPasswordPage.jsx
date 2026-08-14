import React, { useState } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { postResetPasswordClientesService } from '../../../../services/clientes.services'
import '../../FormLogin.css'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [ErrorText, setErrorText] = useState({ status: false, message: '', detail: '' })
  const [isLoadingForm, setisLoadingForm] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorText({
        status: true,
        message: 'Las contraseñas no coinciden.',
        detail: 'Verifica que ambas contraseñas sean iguales.',
      })
      return
    }

    try {
      setisLoadingForm(true)
      setErrorText({ status: false, message: '', detail: '' })
      const result = await postResetPasswordClientesService({ token, password: data.password })
      toast.success(result.data.message)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (error) {
      console.error(error)
      const resData = error?.response?.data
      setErrorText({
        status: true,
        message: resData?.message ?? 'No se pudo restablecer la contraseña.',
        detail:
          resData?.detail ?? 'El enlace puede ser inválido o haber expirado. Solicita uno nuevo.',
      })
    } finally {
      setisLoadingForm(false)
    }
  }

  return (
    <CContainer className="px-0 py-4" lg>
      <div className="glass-form-container">
        {success ? (
          <>
            <h2 className="text-center glass-form-title">¡Listo!</h2>
            <p className="text-center">
              Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center glass-form-title">Restablecer contraseña</h2>

            <div className="form-floating glass-input-group">
              <input
                type="password"
                className="form-control glass-input"
                {...register('password', { required: true })}
                id="password"
                placeholder="Nueva contraseña"
              />
              <label htmlFor="password" className="glass-input-label">
                Nueva contraseña
              </label>
            </div>

            <div className="form-floating glass-input-group">
              <input
                type="password"
                className="form-control glass-input"
                {...register('confirmPassword', { required: true })}
                id="confirmPassword"
                placeholder="Confirmar contraseña"
              />
              <label htmlFor="confirmPassword" className="glass-input-label">
                Confirmar contraseña
              </label>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="button-ecomerce w-100" disabled={isLoadingForm}>
                {isLoadingForm ? (
                  <>
                    <CSpinner size="sm" className="me-2" /> Actualizando...
                  </>
                ) : (
                  'Restablecer contraseña'
                )}
              </button>
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
